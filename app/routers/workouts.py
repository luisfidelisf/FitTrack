from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.models.user import User
from app.models.workout import Workout, WorkoutExercise
from app.models.exercise import Exercise
from app.schemas.workout import WorkoutCreate, WorkoutUpdate, WorkoutResponse
from app.core.dependencies import get_current_user

router = APIRouter(prefix="/workouts", tags=["Treinos"])


@router.post("/", response_model=WorkoutResponse, status_code=201)
def create_workout(
    workout_data: WorkoutCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Cria um novo treino com os exercícios informados."""

    new_workout = Workout(
        name=workout_data.name,
        description=workout_data.description,
        user_id=current_user.id
    )

    db.add(new_workout)
    db.flush()

    for item in workout_data.exercises:

        exercise = db.query(Exercise).filter(
            Exercise.id == item.exercise_id,
            Exercise.user_id == current_user.id
        ).first()

        if not exercise:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Exercício {item.exercise_id} não encontrado."
            )

        workout_exercise = WorkoutExercise(
            workout_id=new_workout.id,
            exercise_id=item.exercise_id,
            sets=item.sets,
            reps=item.reps,
            weight=item.weight,
            rest_seconds=item.rest_seconds
        )
        db.add(workout_exercise)

    db.commit()
    db.refresh(new_workout)

    return new_workout


@router.get("/", response_model=List[WorkoutResponse])
def list_workouts(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Lista todos os treinos do usuário logado."""

    workouts = db.query(Workout).filter(Workout.user_id == current_user.id).all()
    return workouts


@router.get("/{workout_id}", response_model=WorkoutResponse)
def get_workout(
    workout_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Busca um treino pelo ID."""

    workout = db.query(Workout).filter(
        Workout.id == workout_id,
        Workout.user_id == current_user.id
    ).first()

    if not workout:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Treino não encontrado."
        )

    return workout


@router.put("/{workout_id}", response_model=WorkoutResponse)
def update_workout(
    workout_id: int,
    workout_data: WorkoutUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Atualiza nome, descrição ou status do treino."""

    workout = db.query(Workout).filter(
        Workout.id == workout_id,
        Workout.user_id == current_user.id
    ).first()

    if not workout:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Treino não encontrado."
        )

    if workout_data.name is not None:
        workout.name = workout_data.name
    if workout_data.description is not None:
        workout.description = workout_data.description
    if workout_data.is_active is not None:
        workout.is_active = workout_data.is_active

    db.commit()
    db.refresh(workout)

    return workout


@router.delete("/{workout_id}", status_code=204)
def delete_workout(
    workout_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Deleta um treino e todos os seus exercícios."""

    workout = db.query(Workout).filter(
        Workout.id == workout_id,
        Workout.user_id == current_user.id
    ).first()

    if not workout:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Treino não encontrado."
        )

    db.delete(workout)
    db.commit()