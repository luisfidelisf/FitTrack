from passlib.context import CryptContext
from datetime import datetime, timedelta
from dotenv import load_dotenv
import jwt
import os

from app.schemas import user

load_dotenv()

# Configuração do bcrypt para criptografar senhas
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES"))


def hash_password(password: str) -> str:
    """Transforma a senha em um hash criptografado."""
    return pwd_context.hash(password[:72])


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Compara a senha digitada com o hash salvo no banco."""
    return pwd_context.verify(plain_password[:72], hashed_password)


def create_access_token(data: dict) -> str:
    """Gera um token JWT com os dados do usuário e tempo de expiração."""
    payload = data.copy()
    expiration = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    payload.update({"exp": expiration})
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)


def decode_access_token(token: str) -> dict:
    """Decodifica o token e retorna os dados do usuário."""
    return jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])