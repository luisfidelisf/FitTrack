from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.models.user import User
from app.models.exercise import Exercise
from app.schemas.exercise import ExerciseCreate, ExerciseUpdate, ExerciseResponse
from app.core.dependencies import get_current_user

router = APIRouter(prefix="/exercises", tags=["Exercícios"])


@router.post("/", response_model=ExerciseResponse, status_code=201)
def create_exercise(
    exercise_data: ExerciseCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Cria um novo exercício para o usuário logado."""

    new_exercise = Exercise(
        name=exercise_data.name,
        muscle_group=exercise_data.muscle_group,
        description=exercise_data.description,
        user_id=current_user.id
    )

    db.add(new_exercise)
    db.commit()
    db.refresh(new_exercise)

    return new_exercise


@router.get("/", response_model=List[ExerciseResponse])
def list_exercises(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Lista todos os exercícios do usuário logado."""

    exercises = db.query(Exercise).filter(Exercise.user_id == current_user.id).all()
    return exercises


@router.get("/{exercise_id}", response_model=ExerciseResponse)
def get_exercise(
    exercise_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Busca um exercício pelo ID."""

    exercise = db.query(Exercise).filter(
        Exercise.id == exercise_id,
        Exercise.user_id == current_user.id
    ).first()

    if not exercise:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Exercício não encontrado."
        )

    return exercise


@router.put("/{exercise_id}", response_model=ExerciseResponse)
def update_exercise(
    exercise_id: int,
    exercise_data: ExerciseUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Atualiza os dados de um exercício."""

    exercise = db.query(Exercise).filter(
        Exercise.id == exercise_id,
        Exercise.user_id == current_user.id
    ).first()

    if not exercise:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Exercício não encontrado."
        )

    # Atualiza apenas os campos que foram enviados
    if exercise_data.name is not None:
        exercise.name = exercise_data.name
    if exercise_data.muscle_group is not None:
        exercise.muscle_group = exercise_data.muscle_group
    if exercise_data.description is not None:
        exercise.description = exercise_data.description

    db.commit()
    db.refresh(exercise)

    return exercise


@router.delete("/{exercise_id}", status_code=204)
def delete_exercise(
    exercise_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Deleta um exercício."""

    exercise = db.query(Exercise).filter(
        Exercise.id == exercise_id,
        Exercise.user_id == current_user.id
    ).first()

    if not exercise:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Exercício não encontrado."
        )

    db.delete(exercise)
    db.commit()