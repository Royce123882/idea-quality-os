import enum
from datetime import datetime

from sqlalchemy import Enum, Float, ForeignKey, Text, func
from sqlalchemy.dialects.postgresql import JSON, UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import Base, UUIDMixin


class LensType(str, enum.Enum):
    user = "user"
    buyer = "buyer"
    attention = "attention"
    workflow = "workflow"
    timing = "timing"


class Evaluation(Base, UUIDMixin):
    __tablename__ = "evaluations"

    idea_id: Mapped[str] = mapped_column(UUID(as_uuid=True), ForeignKey("ideas.id"), nullable=False)
    lens: Mapped[LensType] = mapped_column(Enum(LensType), nullable=False)
    prompts: Mapped[dict] = mapped_column(JSON, default=dict)
    responses: Mapped[dict] = mapped_column(JSON, default=dict)
    score: Mapped[float] = mapped_column(Float, default=0.0)
    rationale: Mapped[str] = mapped_column(Text, nullable=True)
    confidence: Mapped[float] = mapped_column(Float, default=0.0)
    created_at: Mapped[datetime] = mapped_column(server_default=func.now())
