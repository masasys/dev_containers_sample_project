from fastapi import FastAPI

app = FastAPI()


@app.get("/api/hello")
async def _hello():
    return {"message": "Hello World"}
