from datetime import datetime

from sqlalchemy import Float, ForeignKey, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import Base, UUIDMixin


class AttentionEconomics(Base, UUIDMixin):
    __tablename__ = "attention_economics"

    idea_id: Mapped[str] = mapped_column(UUID(as_uuid=True), ForeignKey("ideas.id"), unique=True, nullable=False)
    time_per_interaction_sec: Mapped[float] = mapped_column(Float, default=0.0)
    frequency_per_week: Mapped[float] = mapped_column(Float, default=0.0)
    cognitive_load_score: Mapped[float] = mapped_column(Float, default=0.0)
    emotional_friction_score: Mapped[float] = mapped_column(Float, default=0.0)
    ratio_score: Mapped[float] = mapped_column(Float, default=0.0)
    created_at: Mapped[datetime] = mapped_column(server_default=func.now())
