from fastapi import APIRouter, Response, status, File, UploadFile
from fastapi.responses import FileResponse
from pydantic import BaseModel
from services import transcrypt
import os
import dotenv

__dirname__ = os.path.dirname(__file__)
__envname__ = os.path.join(__dirname__, "../.env")

env: dict = dotenv.dotenv_values(__envname__)

router: APIRouter = APIRouter()
    
class Item(BaseModel):
    data: list[dict]
    rsa_keys: dict
    
rc4_key = env.get("RC4_KEY") or "dViX*m!X{c&!tj}YzF4H8mn]T@a9C#"
affine_m_key = int(env.get("AFFINE_M_KEY")) if env.get("AFFINE_M_KEY") else 31
affine_b_key = int(env.get("AFFINE_B_KEY")) if env.get("AFFINE_B_KEY") else 7

@router.get("/hello")
def say_hello(name: str | None = None, resp: Response = status.HTTP_200_OK):
    if not name:
        return {
            "message": "Hello!"
        }
    else:
        return {
            "message": "Hello, " + name + "!"
        }
        
@router.get("/rsa-keygen")
async def rsa_keygen(prime1: int, prime2: int, resp: Response = status.HTTP_200_OK):
    keys = await transcrypt.rsa_keygen(prime1, prime2)
    
    if keys.get("Error"):
        resp.status_code = status.HTTP_400_BAD_REQUEST
        return {
            "message": "[Error] " + keys.get("Error")
        }
        
    else:
        return {
            "message": keys
        }
        
@router.post("/add-data")
async def add_data(item: Item, resp: Response = status.HTTP_200_OK):
    try:
        await transcrypt.create(item.data, item.rsa_keys, rc4_key=rc4_key, affine_m_key=affine_m_key, affine_b_key=affine_b_key)
        
        # return {
        #     "message": "Data added successfully"
        # }
        
        data: dict = await transcrypt.read(rc4_key=rc4_key, affine_m_key=affine_m_key, affine_b_key=affine_b_key)
        
        return {
            "message": data["data"]
        }
        
    except:
        return {
            "message": "[Error] Internal server error"
        }
    
@router.get("/get-data")
async def get_data(nama: str | None = None, nim: str | None = None, type: str = "decrypted", resp: Response = status.HTTP_200_OK):
    try:
        options: dict = {}
        if (nama or nim):
            if (nama):
                options["nama"] = nama
                
            if (nim):
                options["nim"] = nim
        
            data: dict = await transcrypt.read(options, type, rc4_key=rc4_key, affine_m_key=affine_m_key, affine_b_key=affine_b_key)
        else:
            data: dict = await transcrypt.read(type=type, rc4_key=rc4_key, affine_m_key=affine_m_key, affine_b_key=affine_b_key)
        
        return {
            "message": data["data"]
        }
        
    except:
        return {
            "message": "[Error] Internal server error"
        }
        
@router.get("/verify-signature")
async def verify_signature(nama: str | None = None, nim: str | None = None, type: str = "decrypted", resp: Response = status.HTTP_200_OK):
    try:
        options: dict = {}
        if (nama or nim):
            if (nama):
                options["nama"] = nama
                
            if (nim):
                options["nim"] = nim
        
            data: dict = await transcrypt.verify(options, type, rc4_key=rc4_key, affine_m_key=affine_m_key, affine_b_key=affine_b_key)
        else:
            data: dict = await transcrypt.verify(type=type, rc4_key=rc4_key, affine_m_key=affine_m_key, affine_b_key=affine_b_key)
        
        return {
            "message": data["data"]
        }
        
    except:
        return {
            "message": "[Error] Internal server error"
        }