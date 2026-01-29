import uuid
from datetime import datetime

from pydantic import BaseModel


class AttentionEconomicsCreate(BaseModel):
    time_per_interaction_sec: float = 0.0
    frequency_per_week: float = 0.0
    cognitive_load_score: float = 0.0
    emotional_friction_score: float = 0.0


class AttentionEconomicsRead(BaseModel):
    id: uuid.UUID
    idea_id: uuid.UUID
    time_per_interaction_sec: float
    frequency_per_week: float
    cognitive_load_score: float
    emotional_friction_score: float
    ratio_score: float
    created_at: datetime

    model_config = {"from_attributes": True}
