import uuid

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models.constraint_set import ConstraintSet
from app.models.idea import Idea
from app.schemas.idea import IdeaCreate, IdeaRead

router = APIRouter(prefix="/v1/ideas", tags=["ideas"])


@router.post("", response_model=IdeaRead, status_code=201)
async def create_idea(body: IdeaCreate, db: AsyncSession = Depends(get_db)):
    cs = await db.get(ConstraintSet, body.constraint_set_id)
    if not cs:
        raise HTTPException(status_code=404, detail="Constraint set not found")
    if not cs.is_locked:
        raise HTTPException(status_code=400, detail="Constraint set must be locked before creating ideas")
    idea = Idea(**body.model_dump())
    db.add(idea)
    await db.flush()
    await db.refresh(idea)
    return idea


@router.get("", response_model=list[IdeaRead])
async def list_ideas(problem_id: uuid.UUID | None = Query(None), db: AsyncSession = Depends(get_db)):
    stmt = select(Idea)
    if problem_id:
        stmt = stmt.where(Idea.problem_id == problem_id)
    stmt = stmt.order_by(Idea.created_at.desc())
    result = await db.execute(stmt)
    return result.scalars().all()


@router.get("/{idea_id}", response_model=IdeaRead)
async def get_idea(idea_id: uuid.UUID, db: AsyncSession = Depends(get_db)):
    idea = await db.get(Idea, idea_id)
    if not idea:
        raise HTTPException(status_code=404, detail="Idea not found")
    return idea
