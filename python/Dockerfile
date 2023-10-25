# Pythonの公式イメージをベースにする
FROM python:3.11

# 作業ディレクトリを設定
WORKDIR /app

# 必要なPythonライブラリをコンテナにコピー
COPY requirements.txt .

# cronおよびPythonライブラリをインストール
RUN apt-get update && apt-get install -y cron vim libgl1-mesa-dev && \
    pip install --upgrade pip && pip install --no-cache-dir -r requirements.txt  \
    && apt-get autoremove -y && apt-get clean && rm -rf /var/lib/apt/lists/*

# アプリケーションのソースコードをコンテナにコピー
# COPY ./app /app

# コンテナがリッスンするポートを指定
EXPOSE 8000

# FastAPIを実行
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
