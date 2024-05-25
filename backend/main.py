import uvicorn
from dotenv import dotenv_values

env = dotenv_values("./.env")

if __name__ == "__main__":
    uvicorn.run("app:app", port=int(env.get("PORT") or 5115), log_level="info", reload=True)