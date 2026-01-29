import uuid
from datetime import datetime

from pydantic import BaseModel

from app.models.idea import IdeaStatus


class IdeaCreate(BaseModel):
    workspace_id: uuid.UUID
    problem_id: uuid.UUID
    constraint_set_id: uuid.UUID
    title: str
    pitch: str | None = None
    replacement_statement: str | None = None
    wedge: str | None = None
    assumptions: list[str] = []


class IdeaRead(BaseModel):
    id: uuid.UUID
    workspace_id: uuid.UUID
    problem_id: uuid.UUID
    constraint_set_id: uuid.UUID
    title: str
    pitch: str | None
    replacement_statement: str | None
    wedge: str | None
    assumptions: list
    status: IdeaStatus
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}
