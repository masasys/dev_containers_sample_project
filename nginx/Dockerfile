FROM nginx:latest
ENV NODE_MAJOR=20

# 依存関係のあるファイルをコピー
COPY nginx.conf /etc/nginx/conf.d/default.conf

# ポート80番をエクスポートする
EXPOSE 80
EXPOSE 443
