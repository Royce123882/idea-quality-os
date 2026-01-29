import uuid

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models.artifact import Artifact
from app.models.workspace import Workspace
from app.schemas.artifact import ArtifactCreate, ArtifactRead

router = APIRouter(tags=["artifacts"])


@router.post("/v1/workspaces/{workspace_id}/artifacts", response_model=ArtifactRead, status_code=201)
async def create_artifact(workspace_id: uuid.UUID, body: ArtifactCreate, db: AsyncSession = Depends(get_db)):
    ws = await db.get(Workspace, workspace_id)
    if not ws:
        raise HTTPException(status_code=404, detail="Workspace not found")
    artifact = Artifact(workspace_id=workspace_id, **body.model_dump())
    db.add(artifact)
    await db.flush()
    await db.refresh(artifact)
    return artifact


@router.get("/v1/workspaces/{workspace_id}/artifacts", response_model=list[ArtifactRead])
async def list_artifacts(workspace_id: uuid.UUID, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Artifact).where(Artifact.workspace_id == workspace_id).order_by(Artifact.created_at.desc())
    )
    return result.scalars().all()
