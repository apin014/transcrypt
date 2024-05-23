import sys
import os
import sympy
from utils import affineDecrypt, affineEncrypt

coprimes256 = []
for i in range(256):
    if (sympy.gcd(i, 256) == 1):
        coprimes256.append(i)

def modRC4(mode, buf, key, m, b):
    if m not in coprimes256:
        return {
            "error": True
        }
    
    S = []
    K = affineEncrypt(key, m, b)
    
    for i in range(256):
        S.append(i)
        
    j = 0
    for i in range(256):
        j = (j + S[i] + K[i % len(K)]) % 256
        S[i], S[j] = S[j], S[i]
        
    FOut = []
    count = 0
    j = 0
    i = 0
    
    if mode == "encrypt":
        for id in range(len(buf)):
            in_ = buf[id]
            count == 1
            i = (i + 1) % 256
            j = (j + S[i]) % 256
            S[i], S[j] = S[j], S[i]
            t = (S[i] + S[j]) % 256
            u = S[t]
            out_ = u ^ in_
            out__ = [out_]
            FOut.append(affineEncrypt(out__, m, b)[0])
    
    elif mode == "decrypt":
        for id in range(len(buf)):
            in__ = [buf[id]]
            in_ = affineDecrypt(in__, m, b)[0]
            count += 1
            i = (i + 1) % 256
            j = (j + S[i]) % 256
            S[i], S[j] = S[j], S[i]
            t = (S[i] + S[j]) % 256
            u = S[t]
            out_ = u ^ in_
            FOut.append(out_)
            
    return FOut