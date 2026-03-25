from sqlalchemy import column, Integer, String, ForeignKey, Boolean, Float
from sqlalchemy import Column, Integer, String, ForeignKey, Boolean, Float
from sqlalchemy.orm import relationship
from app.database import Base


class Workout(Base):
    __tablename__ = "workouts"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)           # ex: "Treino A - Peito"
    description = Column(String, nullable=True)     # descrição opcional
    is_active = Column(Boolean, default=True)       # treino ativo ou não

    # Cada treino pertence a um usuário
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    owner = relationship("User", backref="workouts")

    # Exercícios dentro desse treino
    exercises = relationship("WorkoutExercise", backref="workout", cascade="all, delete-orphan")


class WorkoutExercise(Base):
    __tablename__ = "workout_exercises"

    id = Column(Integer, primary_key=True, index=True)
    sets = Column(Integer, nullable=False)          # número de séries
    reps = Column(Integer, nullable=False)          # número de repetições
    weight = Column(Float, nullable=True)           # carga em kg (opcional)
    rest_seconds = Column(Integer, nullable=True)   # descanso em segundos

    # Liga o treino ao exercício
    workout_id = Column(Integer, ForeignKey("workouts.id"), nullable=False)
    exercise_id = Column(Integer, ForeignKey("exercises.id"), nullable=False)
    exercise = relationship("Exercise")