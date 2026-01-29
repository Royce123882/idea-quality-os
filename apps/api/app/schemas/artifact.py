import uuid
from datetime import datetime

from pydantic import BaseModel


class ArtifactCreate(BaseModel):
    source_type: str = "manual"
    content: str
    metadata_: dict = {}


class ArtifactRead(BaseModel):
    id: uuid.UUID
    workspace_id: uuid.UUID
    source_type: str
    content: str | None
    metadata_: dict
    created_at: datetime

    model_config = {"from_attributes": True}
