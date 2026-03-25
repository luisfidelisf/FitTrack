from sqlalchemy import Column, Integer, String, Float
from app.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    password = Column(String, nullable=False)

    # Dados opcionais de perfil
    weight = Column(Float, nullable=True)   # peso em kg
    height = Column(Float, nullable=True)   # altura em cm
    goal = Column(String, nullable=True)    # ex: "ganhar massa", "emagrecer"