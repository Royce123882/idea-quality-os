import uuid

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models.problem import Problem
from app.models.workspace import Workspace
from app.schemas.problem import ProblemCreate, ProblemList, ProblemRead

router = APIRouter(tags=["problems"])


@router.post("/v1/workspaces/{workspace_id}/problems", response_model=ProblemRead, status_code=201)
async def create_problem(workspace_id: uuid.UUID, body: ProblemCreate, db: AsyncSession = Depends(get_db)):
    ws = await db.get(Workspace, workspace_id)
    if not ws:
        raise HTTPException(status_code=404, detail="Workspace not found")
    problem = Problem(workspace_id=workspace_id, **body.model_dump())
    db.add(problem)
    await db.flush()
    await db.refresh(problem)
    return problem


@router.get("/v1/workspaces/{workspace_id}/problems", response_model=ProblemList)
async def list_problems(workspace_id: uuid.UUID, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Problem)
        .where(Problem.workspace_id == workspace_id)
        .order_by((Problem.frequency_score * Problem.intensity_score).desc())
    )
    items = result.scalars().all()
    return ProblemList(items=items, count=len(items))


@router.get("/v1/problems/{problem_id}", response_model=ProblemRead)
async def get_problem(problem_id: uuid.UUID, db: AsyncSession = Depends(get_db)):
    problem = await db.get(Problem, problem_id)
    if not problem:
        raise HTTPException(status_code=404, detail="Problem not found")
    return problem


@router.post("/v1/problems/recompute")
async def recompute_problems():
    """Placeholder for AI-driven problem recomputation."""
    return {"status": "ok", "message": "Recompute not yet implemented"}
