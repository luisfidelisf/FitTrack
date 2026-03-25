from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.models.user import User
from app.models.progress import WorkoutSession, ExerciseProgress
from app.models.workout import Workout
from app.models.exercise import Exercise
from app.schemas.progress import WorkoutSessionCreate, WorkoutSessionResponse
from app.core.dependencies import get_current_user

router = APIRouter(prefix="/progress", tags=["Progresso"])


@router.post("/", response_model=WorkoutSessionResponse, status_code=201)
def register_session(
    session_data: WorkoutSessionCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Registra uma sessão de treino realizada."""

    # Verifica se o treino existe e pertence ao usuário
    workout = db.query(Workout).filter(
        Workout.id == session_data.workout_id,
        Workout.user_id == current_user.id
    ).first()

    if not workout:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Treino não encontrado."
        )

    new_session = WorkoutSession(
        workout_id=session_data.workout_id,
        user_id=current_user.id,
        notes=session_data.notes
    )

    db.add(new_session)
    db.flush() 

    # Registra o progresso de cada exercício
    for item in session_data.exercises:

        # Verifica se o exercício existe e pertence ao usuário
        exercise = db.query(Exercise).filter(
            Exercise.id == item.exercise_id,
            Exercise.user_id == current_user.id
        ).first()

        if not exercise:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Exercício {item.exercise_id} não encontrado."
            )

        exercise_progress = ExerciseProgress(
            session_id=new_session.id,
            exercise_id=item.exercise_id,
            sets_done=item.sets_done,
            reps_done=item.reps_done,
            weight_used=item.weight_used,
            notes=item.notes
        )
        db.add(exercise_progress)

    db.commit()
    db.refresh(new_session)

    return new_session


@router.get("/", response_model=List[WorkoutSessionResponse])
def list_sessions(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Lista todas as sessões de treino do usuário."""

    sessions = db.query(WorkoutSession).filter(
        WorkoutSession.user_id == current_user.id
    ).order_by(WorkoutSession.date.desc()).all()

    return sessions


@router.get("/exercise/{exercise_id}", response_model=List[WorkoutSessionResponse])
def get_exercise_history(
    exercise_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Retorna todas as sessões onde um exercício específico foi realizado.
    
    Útil para ver a evolução de carga ao longo do tempo.
    """

    # Verifica se o exercício pertence ao usuário
    exercise = db.query(Exercise).filter(
        Exercise.id == exercise_id,
        Exercise.user_id == current_user.id
    ).first()

    if not exercise:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Exercício não encontrado."
        )

    # Busca todas as sessões que contêm esse exercício
    sessions = db.query(WorkoutSession).join(ExerciseProgress).filter(
        WorkoutSession.user_id == current_user.id,
        ExerciseProgress.exercise_id == exercise_id
    ).order_by(WorkoutSession.date.desc()).all()

    return sessions


@router.delete("/{session_id}", status_code=204)
def delete_session(
    session_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Deleta uma sessão de treino."""

    session = db.query(WorkoutSession).filter(
        WorkoutSession.id == session_id,
        WorkoutSession.user_id == current_user.id
    ).first()

    if not session:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Sessão não encontrada."
        )

    db.delete(session)
    db.commit()