import uuid

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models.attention_economics import AttentionEconomics
from app.models.idea import Idea
from app.schemas.attention_economics import AttentionEconomicsCreate, AttentionEconomicsRead

router = APIRouter(tags=["attention-economics"])


@router.post("/v1/ideas/{idea_id}/attention-economics/calculate", response_model=AttentionEconomicsRead, status_code=201)
async def calculate_attention_economics(
    idea_id: uuid.UUID, body: AttentionEconomicsCreate, db: AsyncSession = Depends(get_db)
):
    idea = await db.get(Idea, idea_id)
    if not idea:
        raise HTTPException(status_code=404, detail="Idea not found")
    # Check if already exists
    existing = await db.execute(select(AttentionEconomics).where(AttentionEconomics.idea_id == idea_id))
    if existing.scalar_one_or_none():
        raise HTTPException(status_code=409, detail="Attention economics already calculated for this idea")

    # Compute ratio score: value_per_second / friction
    friction = body.cognitive_load_score + body.emotional_friction_score
    total_time_per_week = body.time_per_interaction_sec * body.frequency_per_week
    ratio_score = (body.frequency_per_week / max(friction, 0.01)) if friction else 0.0

    ae = AttentionEconomics(
        idea_id=idea_id,
        time_per_interaction_sec=body.time_per_interaction_sec,
        frequency_per_week=body.frequency_per_week,
        cognitive_load_score=body.cognitive_load_score,
        emotional_friction_score=body.emotional_friction_score,
        ratio_score=round(ratio_score, 4),
    )
    db.add(ae)
    await db.flush()
    await db.refresh(ae)
    return ae


@router.get("/v1/ideas/{idea_id}/attention-economics", response_model=AttentionEconomicsRead)
async def get_attention_economics(idea_id: uuid.UUID, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(AttentionEconomics).where(AttentionEconomics.idea_id == idea_id))
    ae = result.scalar_one_or_none()
    if not ae:
        raise HTTPException(status_code=404, detail="Attention economics not found for this idea")
    return ae
