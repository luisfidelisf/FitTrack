from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import Base, engine
from app.routers import auth, exercises, workouts, progress

from app.models import exercise, user, workout, progress as progress_model

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="FitTrack API",
    description="API para gerenciamento de treinos e progresso",
    version="1.0.0"
)

#para o frontend se comunir com a api.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(exercises.router)
app.include_router(workouts.router)
app.include_router(progress.router)

@app.get("/")
def root():
    return {"message": "FitTrack API está rodando!"}