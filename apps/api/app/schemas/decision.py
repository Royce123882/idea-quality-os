import uuid
from datetime import datetime

from pydantic import BaseModel

from app.models.decision import DecisionType


class DecisionCreate(BaseModel):
    decision: DecisionType
    reasons: list[str] = []
    terminal_flags: list[str] = []
    decided_by: str = ""
    # For graveyard (only used when decision == kill)
    kill_reasons: list[str] = []
    tags: list[str] = []
    learnings: str | None = None


class DecisionRead(BaseModel):
    id: uuid.UUID
    idea_id: uuid.UUID
    decision: DecisionType
    reasons: list
    terminal_flags: list
    decided_by: str
    created_at: datetime

    model_config = {"from_attributes": True}
