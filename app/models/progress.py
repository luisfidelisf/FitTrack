from sqlalchemy import Column, Integer, Float, ForeignKey, DateTime, String
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base


class WorkoutSession(Base):
    __tablename__ = "workout_sessions"

    id = Column(Integer, primary_key=True, index=True)
    date = Column(DateTime, default=datetime.utcnow)   # data da sessão
    notes = Column(String, nullable=True)               # observações gerais

    # Qual treino foi realizado
    workout_id = Column(Integer, ForeignKey("workouts.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    workout = relationship("Workout")
    exercises = relationship("ExerciseProgress", backref="session", cascade="all, delete-orphan")


class ExerciseProgress(Base):
    __tablename__ = "exercise_progress"

    id = Column(Integer, primary_key=True, index=True)
    sets_done = Column(Integer, nullable=False)     # séries realizadas
    reps_done = Column(Integer, nullable=False)     # repetições realizadas
    weight_used = Column(Float, nullable=True)      # carga usada em kg
    notes = Column(String, nullable=True)           # ex: "senti dor no ombro"

    session_id = Column(Integer, ForeignKey("workout_sessions.id"), nullable=False)
    exercise_id = Column(Integer, ForeignKey("exercises.id"), nullable=False)
    exercise = relationship("Exercise")