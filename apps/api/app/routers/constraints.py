import uuid

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models.constraint_set import ConstraintSet
from app.models.problem import Problem
from app.schemas.constraint_set import ConstraintSetCreate, ConstraintSetRead

router = APIRouter(tags=["constraints"])


@router.post("/v1/problems/{problem_id}/constraints", response_model=ConstraintSetRead, status_code=201)
async def create_constraint_set(
    problem_id: uuid.UUID, body: ConstraintSetCreate, db: AsyncSession = Depends(get_db)
):
    problem = await db.get(Problem, problem_id)
    if not problem:
        raise HTTPException(status_code=404, detail="Problem not found")
    cs = ConstraintSet(problem_id=problem_id, **body.model_dump())
    db.add(cs)
    await db.flush()
    await db.refresh(cs)
    return cs


@router.get("/v1/constraint-sets/{constraint_set_id}", response_model=ConstraintSetRead)
async def get_constraint_set(constraint_set_id: uuid.UUID, db: AsyncSession = Depends(get_db)):
    cs = await db.get(ConstraintSet, constraint_set_id)
    if not cs:
        raise HTTPException(status_code=404, detail="Constraint set not found")
    return cs


@router.post("/v1/constraint-sets/{constraint_set_id}/lock", response_model=ConstraintSetRead)
async def lock_constraint_set(constraint_set_id: uuid.UUID, db: AsyncSession = Depends(get_db)):
    cs = await db.get(ConstraintSet, constraint_set_id)
    if not cs:
        raise HTTPException(status_code=404, detail="Constraint set not found")
    if cs.is_locked:
        raise HTTPException(status_code=400, detail="Constraint set is already locked")
    cs.is_locked = True
    await db.flush()
    await db.refresh(cs)
    return cs
