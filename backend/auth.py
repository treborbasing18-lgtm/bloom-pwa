import os
import hashlib
import hmac
from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt

SECRET_KEY = os.getenv("SECRET_KEY", "change-me-in-production-use-a-long-random-string")
ALGORITHM  = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 10080))


def hash_password(plain: str) -> str:
    salt = os.urandom(32).hex()
    key = hashlib.pbkdf2_hmac('sha256', plain.encode(), salt.encode(), 100000).hex()
    return f"{salt}${key}"


def verify_password(plain: str, hashed: str) -> bool:
    try:
        salt, key = hashed.split('$')
        return hmac.compare_digest(
            hashlib.pbkdf2_hmac('sha256', plain.encode(), salt.encode(), 100000).hex(),
            key
        )
    except Exception:
        return False


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=15))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


def decode_token(token: str) -> Optional[dict]:
    try:
        return jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    except JWTError:
        return None