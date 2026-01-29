import uuid
from datetime import datetime

from pydantic import BaseModel

from app.models.problem import ProblemStatus


class ProblemCreate(BaseModel):
    title: str
    description: str | None = None
    roles_impacted: list[str] = []
    frequency_score: float = 0.0
    intensity_score: float = 0.0
    workaround_cost_score: float = 0.0
    confidence: float = 0.0
    status: ProblemStatus = ProblemStatus.active


class ProblemRead(BaseModel):
    id: uuid.UUID
    workspace_id: uuid.UUID
    title: str
    description: str | None
    roles_impacted: list
    frequency_score: float
    intensity_score: float
    workaround_cost_score: float
    confidence: float
    status: ProblemStatus
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class ProblemList(BaseModel):
    items: list[ProblemRead]
    count: int
