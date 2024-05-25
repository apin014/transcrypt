from sympy import mod_inverse

def affineEncrypt(in_, m, b):
    out = []
    for i in range(len(in_)):
        p = in_[i]
        encrypted = ((m * p) + b) % 256
        out.append(encrypted)
        
    return out

def affineDecrypt(in_, m, b):
    out = []
    inverse_m = mod_inverse(m, 256)
    for i in range(len(in_)):
        c = in_[i]
        decrypted = (inverse_m * (c - b + 256) % 256)
        out.append(decrypted)
        
    return out