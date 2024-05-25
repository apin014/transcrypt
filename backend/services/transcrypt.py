import sys
import os
import json
import typing
import copy
from dotenv import dotenv_values
from utils import utils

__dirname__ = os.path.dirname(__file__)
__envname__ = os.path.join(__dirname__, "../.env")

env: dict = dotenv_values(__envname__)

data_path: str = os.path.abspath(os.path.join(__dirname__, ".." + (env.get("JSON_PATH") or "/data/plain/example-akademik.json")))
encrypted_data_path: str = os.path.abspath(os.path.join(__dirname__, ".." + (env.get("ENCRYPTED_JSON_PATH") or "/data/encrypted/example-akademik.json")))
signed_encrypted_data_path: str = os.path.abspath(os.path.join(__dirname__, ".." + (env.get("SIGNED_ENCRYPTED_JSON_PATH") or "/data/signed_encrypted/example-akademik.json")))
        
async def hello(name: str) -> None:
    print("Hello, " + name)
    
async def rsa_keygen(prime1: int, prime2: int) -> dict:
    keys: dict = utils.rsa_keygen(prime1, prime2)
    
    if (not keys.get("private_key") and not keys.get("public_key")):
        return {
            "Error": "Keys cannot be generated"
        }
    else:
        return keys
    
async def create(data: list[dict], rsa_keys: dict, rc4_key: str | None = None, affine_m_key: int | None = None, affine_b_key: int | None = None) -> None:
    with open(data_path, 'r') as file:
        json_data: dict | typing.Any = json.load(file)
    
    if (rc4_key and affine_m_key and affine_b_key):    
        with open(encrypted_data_path, 'r') as enc_file:
            json_data_enc: dict | typing.Any = json.load(enc_file)
            
        with open(signed_encrypted_data_path, 'r') as signed_enc_file:
            json_data_signed_enc: dict | typing.Any = json.load(signed_enc_file)
        
    for row in data:
        row["ipk"] = utils.ipk_calc(row["mk"])
        row["ttd"] = utils.get_signature(utils.aggr_fields(row), rsa_keys)
        row["pub_key"] = rsa_keys["public_key"]
            
        json_data["data"].append(row)
        
        if (rc4_key and affine_m_key and affine_b_key): 
            row_enc: dict = utils.encrypt_fields(row, rc4_key, affine_m_key, affine_b_key, ("ttd", "pub_key"))
            row_signed_enc: dict = utils.encrypt_fields(row, rc4_key, affine_m_key, affine_b_key, ("pub_key"))
            
            json_data_enc["data"].append(row_enc)
            json_data_signed_enc["data"].append(row_signed_enc)
    
    with open(data_path, 'w') as file:
        json.dump(json_data, file, indent=4)
        
    if (rc4_key and affine_m_key and affine_b_key): 
        with open(encrypted_data_path, 'w') as enc_file:
            json.dump(json_data_enc, enc_file, indent=4)
            
        with open(signed_encrypted_data_path, 'w') as signed_enc_file:
            json.dump(json_data_signed_enc, signed_enc_file, indent=4)


async def read(options: dict | None = None, type: str = "decrypted", rc4_key: str | None = None, affine_m_key: int | None = None, affine_b_key: int | None = None) -> dict:
    try:
        if type == "decrypted":
            with open(signed_encrypted_data_path, 'r') as file:
                json_data: typing.Any = json.load(file)
                
            d_: list[dict] = []
            for row in json_data["data"]:
                d_.append(utils.decrypt_fields(row, rc4_key, affine_m_key, affine_b_key, ("pub_key")))
                
            json_data["data"] = d_
        elif type == "encrypted":
            with open(encrypted_data_path, 'r') as file:
                json_data: typing.Any = json.load(file)
        elif type == "signed_encrypted":
            with open(signed_encrypted_data_path, 'r') as file:
                json_data: typing.Any = json.load(file)
        else:
            with open(data_path, 'r') as file:
                json_data: typing.Any = json.load(file)
            
        if options:
            data_: list = []
            for row in json_data["data"]:
                if utils.check_sub_map(row, options):
                    data_.append(row)
            
            json_data["data"] = data_
            
        return json_data
        
    except FileNotFoundError:
        print("Error: File not found!")
        
        
async def delete(options: dict) -> None:
    with open(data_path, 'r') as file:
        json_data: dict | typing.Any = json.load(file)
        
    json_data["data"] = [data for data in json_data["data"] if not utils.check_sub_map(data, options)]
    
    with open(data_path, 'w') as file:
        json.dump(json_data, file, indent=4)
        
async def verify(options: dict | None = None, type: str = "decrypted", rc4_key: str | None = None, affine_m_key: int | None = None, affine_b_key: int | None = None) -> dict:
    try:
        if type == "decrypted":
            with open(encrypted_data_path, 'r') as file:
                json_data: typing.Any = json.load(file)
                
            d_: list[dict] = []
            for row in json_data["data"]:
                d_.append(utils.decrypt_fields(row, rc4_key, affine_m_key, affine_b_key, ("pub_key", "ttd")))
                
            json_data["data"] = d_
        else:
            with open(data_path, 'r') as file:
                json_data: typing.Any = json.load(file)
            
        if options:
            data_: list = []
            for row in json_data["data"]:
                if utils.check_sub_map(row, options):
                    data_.append(row)
            
            json_data["data"] = data_
            
        for row in json_data["data"]:
            toAggr: dict = copy.deepcopy(row)
            
            del toAggr["ttd"]
            del toAggr["pub_key"]
            
            row["verified"] = utils.verify_signature(utils.aggr_fields(toAggr), row["ttd"], row["pub_key"])
            
        return json_data
        
    except FileNotFoundError:
        print("Error: File not found!")
