import uuid

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models.evaluation import Evaluation
from app.models.idea import Idea
from app.schemas.evaluation import EvaluationRead, StressTestRun

router = APIRouter(tags=["evaluations"])


@router.post("/v1/ideas/{idea_id}/stress-test/run", response_model=EvaluationRead, status_code=201)
async def run_stress_test(idea_id: uuid.UUID, body: StressTestRun, db: AsyncSession = Depends(get_db)):
    idea = await db.get(Idea, idea_id)
    if not idea:
        raise HTTPException(status_code=404, detail="Idea not found")
    # MVP: create a placeholder evaluation for the requested lens
    evaluation = Evaluation(
        idea_id=idea_id,
        lens=body.lens,
        prompts={"placeholder": f"Stress test prompts for {body.lens.value} lens"},
        responses={"placeholder": "Awaiting AI integration"},
        score=0.0,
        rationale="Placeholder - AI evaluation not yet integrated",
        confidence=0.0,
    )
    db.add(evaluation)
    await db.flush()
    await db.refresh(evaluation)
    return evaluation


@router.get("/v1/ideas/{idea_id}/evaluations", response_model=list[EvaluationRead])
async def list_evaluations(idea_id: uuid.UUID, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Evaluation).where(Evaluation.idea_id == idea_id).order_by(Evaluation.created_at.desc())
    )
    return result.scalars().all()
