from datetime import datetime
from base64 import b64decode
from pyaes import AESModeOfOperationCBC

from app import MASTER_KEY

BLOCK_SIZE = 16


def decrypt(encrypted_data, key: bytes):
    encrypted_data = b64decode(encrypted_data)

    iv = encrypted_data[0:BLOCK_SIZE]
    encrypted_data = encrypted_data[BLOCK_SIZE:]

    aes = AESModeOfOperationCBC(key, iv)
    blocks_count = len(encrypted_data) // BLOCK_SIZE
    plain_text = b''
    for i in range(blocks_count):
        block = encrypted_data[i * 16:i * 16 + 16]
        plain_text += aes.decrypt(block)

    return plain_text.decode('utf-8').rstrip('\0')



