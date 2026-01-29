import uuid
from datetime import datetime

from pydantic import BaseModel


class WorkspaceCreate(BaseModel):
    name: str
    plan: str = "free"


class WorkspaceRead(BaseModel):
    id: uuid.UUID
    name: str
    plan: str
    created_at: datetime

    model_config = {"from_attributes": True}
