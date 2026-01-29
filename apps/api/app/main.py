from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.routers import (
    artifacts,
    attention,
    constraints,
    decisions,
    evaluations,
    ideas,
    problems,
    scoring,
    workspaces,
)


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: engine is created at import time in database.py
    yield
    # Shutdown: dispose engine
    from app.database import engine

    await engine.dispose()


app = FastAPI(
    title="Idea Quality Operating System",
    version="0.1.0",
    lifespan=lifespan,
)

# CORS
origins = [o.strip() for o in settings.CORS_ORIGINS.split(",") if o.strip()]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(workspaces.router)
app.include_router(artifacts.router)
app.include_router(problems.router)
app.include_router(constraints.router)
app.include_router(ideas.router)
app.include_router(evaluations.router)
app.include_router(attention.router)
app.include_router(decisions.router)
app.include_router(scoring.router)


@app.get("/healthz")
async def healthz():
    return {"status": "ok"}
