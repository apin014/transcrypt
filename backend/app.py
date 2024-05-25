from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from router import routes

app: FastAPI = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(routes.router)

@app.get("/")
async def home():
    return {
        "message": "Welcome!"
    }