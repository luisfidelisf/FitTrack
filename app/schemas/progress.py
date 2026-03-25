from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from app.schemas.exercise import ExerciseResponse


# Progresso de um exercício dentro da sessão
class ExerciseProgressCreate(BaseModel):
    exercise_id: int
    sets_done: int
    reps_done: int
    weight_used: Optional[float] = None
    notes: Optional[str] = None


class ExerciseProgressResponse(BaseModel):
    id: int
    sets_done: int
    reps_done: int
    weight_used: Optional[float] = None
    notes: Optional[str] = None
    exercise: ExerciseResponse

    class Config:
        from_attributes = True


# Sessão de treino
class WorkoutSessionCreate(BaseModel):
    workout_id: int
    notes: Optional[str] = None
    exercises: List[ExerciseProgressCreate] = []


class WorkoutSessionResponse(BaseModel):
    id: int
    date: datetime
    notes: Optional[str] = None
    workout_id: int
    user_id: int
    exercises: List[ExerciseProgressResponse] = []

    class Config:
        from_attributes = True