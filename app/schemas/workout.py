from pydantic import BaseModel
from typing import Optional, List
from app.schemas.exercise import ExerciseResponse


# Exercício dentro de um treino
class WorkoutExerciseCreate(BaseModel):
    exercise_id: int
    sets: int
    reps: int
    weight: Optional[float] = None
    rest_seconds: Optional[int] = None


class WorkoutExerciseResponse(BaseModel):
    id: int
    sets: int
    reps: int
    weight: Optional[float] = None
    rest_seconds: Optional[int] = None
    exercise: ExerciseResponse

    class Config:
        from_attributes = True


# Treino
class WorkoutCreate(BaseModel):
    name: str
    description: Optional[str] = None
    exercises: List[WorkoutExerciseCreate] = []


class WorkoutUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    is_active: Optional[bool] = None


class WorkoutResponse(BaseModel):
    id: int
    name: str
    description: Optional[str] = None
    is_active: bool
    user_id: int
    exercises: List[WorkoutExerciseResponse] = []

    class Config:
        from_attributes = True