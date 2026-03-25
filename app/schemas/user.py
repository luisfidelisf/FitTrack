from pydantic import BaseModel, EmailStr
from typing import Optional

# Dados para criar um usuário (recebidos no cadastro)
class UserCreate(BaseModel):
    name: str
    email: str
    password: str
    weight: Optional[float] = None
    height: Optional[float] = None
    goal: Optional[str] = None

# Dados para login
class UserLogin(BaseModel):
    email: str
    password: str

# O que devolvemos ao buscar um usuário (sem a senha!)
class UserResponse(BaseModel):
    id: int
    name: str
    email: str
    weight: Optional[float] = None
    height: Optional[float] = None
    goal: Optional[str] = None

    class Config:
        from_attributes = True

# O token que devolvemos após o login
class Token(BaseModel):
    access_token: str
    token_type: str