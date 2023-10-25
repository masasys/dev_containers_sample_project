# ベースとなるイメージを指定
FROM node:20.1.0-slim

# 作業ディレクトリを設定
WORKDIR /usr/src

# 依存関係のあるファイルをコピー
COPY package*.json ./

# 依存関係のあるパッケージをインストール
RUN npm install

# ポート3000番をエクスポートする
EXPOSE 3000

# プロジェクトをコンパイルと実行
CMD [ "npm", "start" ]
ENV PATH=$PATH:node_modules/.bin
