from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base


class Exercise(Base):
    __tablename__ = "exercises"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    muscle_group = Column(String, nullable=False)   # ex: "peito", "costas", "perna"
    description = Column(String, nullable=True)     # instruções de execução

    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    owner = relationship("User", backref="exercises")