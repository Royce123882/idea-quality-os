import uuid
from datetime import datetime

from pydantic import BaseModel


class GraveyardEntryRead(BaseModel):
    id: uuid.UUID
    idea_id: uuid.UUID
    kill_reasons: list
    tags: list
    learnings: str | None
    created_at: datetime

    model_config = {"from_attributes": True}
