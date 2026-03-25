from pydantic import BaseModel
from typing import Optional


class ExerciseCreate(BaseModel):
    name: str
    muscle_group: str
    description: Optional[str] = None


class ExerciseUpdate(BaseModel):
    name: Optional[str] = None
    muscle_group: Optional[str] = None
    description: Optional[str] = None


class ExerciseResponse(BaseModel):
    id: int
    name: str
    muscle_group: str
    description: Optional[str] = None
    user_id: int

    class Config:
        from_attributes = True