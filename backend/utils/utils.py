import sys
import os
import typing

# __dirname__ = os.path.dirname(__file__)
# __addons__ = os.path.join(__dirname__, "../addons")

# sys.path.append(__addons__)

from addons.rsa import rsa
from addons.mod_rc4 import mod_rc4
from hashlib import sha3_256
from Crypto.Cipher import AES
import base64

def check_sub_map(d: dict, sub: dict) -> bool:
    for key in sub.keys():
        if d.get(key) != sub.get(key):
            return False
        
    return True

def rsa_keygen(p: int, q: int) -> dict:
    return rsa.generate_key(p, q)

def get_signature(payload: str, rsa_keys: dict):
    # key = rsa.generate_key(23, 19)
    s = sha3_256()
    
    s.update(bytes(payload, "utf-8"))
    
    h = int(s.hexdigest(), 16)
    
    s_h = bytes(str(h), "utf-8")
    
    enc = rsa.encrypt(s_h, rsa_keys["private_key"][0], rsa_keys["private_key"][1])
    
    # return s.hexdigest()
    return hex(int(enc.decode("utf-8")))[2:]
    # return enc.decode("utf-8")
    # return enc.hex()

def verify_signature(payload: str, signature: str, rsa_pub_key: list):
    # key = rsa.generate_key(23, 19)
    
    s = sha3_256()
    
    s.update(bytes(payload, "utf-8"))
    
    h = s.hexdigest()
    
    i_signature = int(signature, 16)
    s_signature = str(i_signature)
    s_signature_ = "0" + str(i_signature)
    
    decr = rsa.decrypt(bytes(s_signature, "utf-8"), rsa_pub_key[0], rsa_pub_key[1])
    decr_ = rsa.decrypt(bytes(s_signature_, "utf-8"), rsa_pub_key[0], rsa_pub_key[1])
    
    try:
        h_ = hex(int(decr.decode("utf-8")))[2:]
    
    except UnicodeDecodeError:
        h_ = hex(int(decr_.decode("utf-8")))[2:]
    
    # print(h)
    # print(h_)
    
    return h == h_
    
def ipk_calc(record: list[dict]) -> float:
    index: dict = {
        "A": 4.0,
        "AB": 3.5,
        "B": 3.0,
        "BC": 2.5,
        "C": 2.0,
        "D": 1.0,
        "E": 0.0,
    }
    
    ipk: float = 0.0
    bobot_nilai: float = 0.0
    total_sks: int = 0
    
    for rec in record:
        bobot_nilai += index[rec["nilai"]] * rec["sks"]
        total_sks += rec["sks"]
        
    ipk = round(bobot_nilai / total_sks, 2)
        
    return ipk

def encrypt_fields(data: dict, rc4_key: str, affine_m_key: int, affine_b_key: int, exclude_keys: set[str] | None = None) -> dict:
    # if (exclude_keys):
    #     keys: set[str] = [key for key in data.keys() if key not in exclude_keys]
    # else:
    keys: set[str] = data.keys()
        
    data_: dict = {}
    for key in keys:
        if exclude_keys and key in exclude_keys:
            data_[key] = data[key]
        else:
            if (data.get(key)):
                if (isinstance(data[key], (list)) and all(isinstance(item, dict) for item in data[key])):
                    data_[key] = []
                    for row in data[key]:
                        data_[key].append(encrypt_fields(row, rc4_key, affine_m_key, affine_b_key))
                        
                else:
                    e = mod_rc4.modRC4("encrypt", bytes(str(data.get(key)), "utf-8"), bytes(rc4_key, "utf-8"), affine_m_key, affine_b_key)
                    b64 = base64.b64encode(e)
                    b64_ = b64.decode("utf-8")
                    data_[key] = b64_
                
    return data_
            
def decrypt_fields(data: dict, rc4_key: str, affine_m_key: int, affine_b_key: int, exclude_keys: set[str] | None = None) -> dict:
    keys: set[str] = data.keys()
        
    data_: dict = {}
    for key in keys:
        if exclude_keys and key in exclude_keys:
            data_[key] = data[key]
        else:
            if (data.get(key)):
                if (isinstance(data[key], (list)) and all(isinstance(item, dict) for item in data[key])):
                    data_[key] = []
                    for row in data[key]:
                        data_[key].append(decrypt_fields(row, rc4_key, affine_m_key, affine_b_key))
                        
                else:
                    # e = mod_rc4.modRC4("encrypt", bytes(str(data.get(key)), "utf-8"), bytes("key", "utf-8"), 31, 3)
                    # b64 = base64.b64encode(e)
                    # b64_ = b64.decode("utf-8")
                    # data_[key] = b64_
                    s = base64.b64decode(bytes(data.get(key), "utf-8"))
                    d = mod_rc4.modRC4("decrypt", s, bytes(rc4_key, "utf-8"), affine_m_key, affine_b_key).decode("utf-8")
                    data_[key] = d
                
    return data_
            
            
def aggr_fields(record: dict) -> str:
    payload: str = ""
    
    for key in record.keys():
        field_value: typing.Any = record.get(key)
        
        if isinstance(field_value, (list, set)):
            for member in field_value:
                if isinstance(member, dict):
                    payload += aggr_fields(member)
                else:
                    if isinstance(member, str):
                        payload += member
                    else:
                        if not member:
                           continue
                        else: 
                            payload += str(member)
                            
        else:
            if isinstance(field_value, dict):
                payload += aggr_fields(field_value)
            else:
                if isinstance(field_value, str):
                    payload += field_value
                else:
                    if not field_value:
                        continue
                    else:
                        payload += str(field_value)
                    
    return payload
    