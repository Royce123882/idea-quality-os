import uuid

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models.decision import Decision, DecisionType
from app.models.graveyard import GraveyardEntry
from app.models.idea import Idea, IdeaStatus
from app.schemas.decision import DecisionCreate, DecisionRead
from app.schemas.graveyard import GraveyardEntryRead

router = APIRouter(tags=["decisions"])


@router.post("/v1/ideas/{idea_id}/decide", response_model=DecisionRead, status_code=201)
async def decide_on_idea(idea_id: uuid.UUID, body: DecisionCreate, db: AsyncSession = Depends(get_db)):
    idea = await db.get(Idea, idea_id)
    if not idea:
        raise HTTPException(status_code=404, detail="Idea not found")

    decision = Decision(
        idea_id=idea_id,
        decision=body.decision,
        reasons=body.reasons,
        terminal_flags=body.terminal_flags,
        decided_by=body.decided_by,
    )
    db.add(decision)

    # Update idea status
    if body.decision == DecisionType.kill:
        idea.status = IdeaStatus.killed
        graveyard = GraveyardEntry(
            idea_id=idea_id,
            kill_reasons=body.kill_reasons or body.reasons,
            tags=body.tags,
            learnings=body.learnings,
        )
        db.add(graveyard)
    elif body.decision == DecisionType.proceed:
        idea.status = IdeaStatus.proceeded

    await db.flush()
    await db.refresh(decision)
    return decision


@router.get("/v1/ideas/{idea_id}/decision", response_model=DecisionRead)
async def get_decision(idea_id: uuid.UUID, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Decision).where(Decision.idea_id == idea_id).order_by(Decision.created_at.desc())
    )
    decision = result.scalars().first()
    if not decision:
        raise HTTPException(status_code=404, detail="No decision found for this idea")
    return decision


@router.get("/v1/workspaces/{workspace_id}/graveyard", response_model=list[GraveyardEntryRead])
async def list_graveyard(workspace_id: uuid.UUID, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(GraveyardEntry)
        .join(Idea, GraveyardEntry.idea_id == Idea.id)
        .where(Idea.workspace_id == workspace_id)
        .order_by(GraveyardEntry.created_at.desc())
    )
    return result.scalars().all()
