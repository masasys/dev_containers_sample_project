import { build } from "esbuild";
import { existsSync, rmSync, readFileSync, writeFileSync } from "fs";
import { basename, extname, join } from "path";
import copy from "esbuild-plugin-copy";
import { createHash } from "crypto";

const outputDir = "./view/assets/js";
// 各Typescriptをトランスパイルのエントリーポイントとして定義
const filePairs = [
  {ts: "ts/index.ts", html: "index.html"},
];
// 出力ディレクトリが存在する場合、削除する
if (existsSync(outputDir)) {
    rmSync(outputDir, { recursive: true });
}
// Javascriptのファイル名にハッシュ値を使ってランダム要素を加える
function generateHash(content) {
    return createHash("sha256")
        .update(content)
        .digest("hex")
        .slice(0, 8);
}
// １回だけ実行するコピー処理用
let isFirstPair = true;
// ビルド
for (const pair of filePairs) {
    // ファイルを読み込む
    const fileContent = readFileSync(pair.ts, 'utf-8');
    // ファイル名用ハッシュ値を生成
    const hash = generateHash(fileContent);
    // エントリーポイントのファイル名を取得
    const baseName = basename(pair.ts, extname(pair.ts));
    // ビルド後のファイル名を定義
    const outFile = join(outputDir, `${baseName}.${hash}.js`);
    // １回だけ実行するコピー処理
    const plugins = [];
    if (isFirstPair) {
        // 2回目以降はコピー処理を行わない
        plugins.push(
            copy({
                resolveFrom: "cwd",
                assets: [
                    // この.cssファイルは、Bootstrap Studioの各印刷用のページのProperties->HeadContentでのみ設定済みのもの
                    {from: ["ts/*.css"], to: ["view/assets/css"]},
                    // Bootstrap Studioで設定されたファイル群
                    {from: ["html/assets/**/*"], to: ["view/assets"]},
                    // ログイン画面
                    {from: ["html/login.html"], to: ["view/login.html"]},
                    // HowTo
                    {from: ["html/howto.html"], to: ["view/howto.html"]},
                    // webFonts
                    {from: ["webfonts/*.woff2"], to: ["view/assets/webfonts"]},
                ],
                watch: true,
            })
        );
        isFirstPair = false;
        console.log("--- copy files setting. ---");
    }
    // ビルド
    build({
        entryPoints: [pair.ts],
        bundle: true,
        minify: true,
        sourcemap: true,
        target: ["es2017"],
        outfile: outFile,
        platform: "browser",
        format: "esm",
        plugins,
    }).then(() => {
        // ビルド後にHTMLを更新
        const htmlContent = readFileSync(`html/${pair.html}`, 'utf-8');
        // ファイル名をHTMLに埋め込む
        const scriptPlaceholder = "%BUNDLE_JS_PATH%";
        // 整形後のHTMLファイル
        const updatedHtmlContent = htmlContent.replace(scriptPlaceholder, outFile);
        // 書き出し
        writeFileSync(`view/${pair.html}`, updatedHtmlContent);
        console.log(`${pair.ts} -> ${outFile}`);
    }).catch((err) => console.error(err));
}
