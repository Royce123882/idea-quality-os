import uuid
from datetime import datetime

from pydantic import BaseModel


class ConstraintSetCreate(BaseModel):
    workspace_id: uuid.UUID
    attention_budget_seconds: int = 0
    cadence: str = ""
    workflow_systems: list[str] = []
    non_negotiables: list[str] = []
    compliance_tags: list[str] = []
    created_by: str = ""


class ConstraintSetRead(BaseModel):
    id: uuid.UUID
    workspace_id: uuid.UUID
    problem_id: uuid.UUID
    attention_budget_seconds: int
    cadence: str
    workflow_systems: list
    non_negotiables: list
    compliance_tags: list
    created_by: str
    version: int
    is_locked: bool
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}
