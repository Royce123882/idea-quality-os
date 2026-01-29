import uuid
from datetime import datetime

from pydantic import BaseModel

from app.models.evaluation import LensType


class StressTestRun(BaseModel):
    lens: LensType


class EvaluationCreate(BaseModel):
    lens: LensType
    prompts: dict = {}
    responses: dict = {}
    score: float = 0.0
    rationale: str | None = None
    confidence: float = 0.0


class EvaluationRead(BaseModel):
    id: uuid.UUID
    idea_id: uuid.UUID
    lens: LensType
    prompts: dict
    responses: dict
    score: float
    rationale: str | None
    confidence: float
    created_at: datetime

    model_config = {"from_attributes": True}
