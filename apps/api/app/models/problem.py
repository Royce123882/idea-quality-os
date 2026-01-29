import enum

from sqlalchemy import Enum, Float, ForeignKey, String, Text
from sqlalchemy.dialects.postgresql import JSON, UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import Base, TimestampMixin, UUIDMixin


class ProblemStatus(str, enum.Enum):
    active = "active"
    archived = "archived"


class Problem(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "problems"

    workspace_id: Mapped[str] = mapped_column(UUID(as_uuid=True), ForeignKey("workspaces.id"), nullable=False)
    title: Mapped[str] = mapped_column(String(500))
    description: Mapped[str] = mapped_column(Text, nullable=True)
    roles_impacted: Mapped[list] = mapped_column(JSON, default=list)
    frequency_score: Mapped[float] = mapped_column(Float, default=0.0)
    intensity_score: Mapped[float] = mapped_column(Float, default=0.0)
    workaround_cost_score: Mapped[float] = mapped_column(Float, default=0.0)
    confidence: Mapped[float] = mapped_column(Float, default=0.0)
    status: Mapped[ProblemStatus] = mapped_column(Enum(ProblemStatus), default=ProblemStatus.active)
