
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.db.session import Base, engine
from app.models import Recipe  # Ensures the model is registered
from app.api.routes.external import router as external_router
from app.api.routes.recipes import router as recipes_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initial development setup only.
    # Use Alembic migrations for production.
    Base.metadata.create_all(bind=engine)
    yield


app = FastAPI(
    title="Recipe Explorer API",
    description=(
        "API for discovering, creating, and managing recipes."
    ),
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        settings.frontend_url,
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {
        "message": "Welcome to Recipe Explorer API",
        "docs": "/docs",
    }


@app.get("/health")
def health():
    return {"status": "ok"}


app.include_router(recipes_router)
app.include_router(external_router)
