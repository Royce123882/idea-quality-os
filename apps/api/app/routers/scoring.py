import uuid

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models.attention_economics import AttentionEconomics
from app.models.evaluation import Evaluation
from app.models.idea import Idea
from app.services.scoring import compute_idea_score

router = APIRouter(tags=["scoring"])


@router.post("/v1/ideas/{idea_id}/score")
async def score_idea(idea_id: uuid.UUID, db: AsyncSession = Depends(get_db)):
    idea = await db.get(Idea, idea_id)
    if not idea:
        raise HTTPException(status_code=404, detail="Idea not found")

    evals_result = await db.execute(select(Evaluation).where(Evaluation.idea_id == idea_id))
    evaluations = list(evals_result.scalars().all())

    ae_result = await db.execute(select(AttentionEconomics).where(AttentionEconomics.idea_id == idea_id))
    attention = ae_result.scalar_one_or_none()

    breakdown = compute_idea_score(evaluations, attention)

    return {
        "idea_id": str(idea_id),
        "lens_scores": breakdown.lens_scores,
        "weighted_evaluation_score": breakdown.weighted_evaluation_score,
        "attention_ratio_score": breakdown.attention_ratio_score,
        "composite_score": breakdown.composite_score,
        "recommendation": breakdown.recommendation,
    }
