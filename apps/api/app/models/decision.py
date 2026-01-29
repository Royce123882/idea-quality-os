import enum
from datetime import datetime

from sqlalchemy import Enum, ForeignKey, String, func
from sqlalchemy.dialects.postgresql import JSON, UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import Base, UUIDMixin


class DecisionType(str, enum.Enum):
    proceed = "proceed"
    revise = "revise"
    kill = "kill"


class Decision(Base, UUIDMixin):
    __tablename__ = "decisions"

    idea_id: Mapped[str] = mapped_column(UUID(as_uuid=True), ForeignKey("ideas.id"), nullable=False)
    decision: Mapped[DecisionType] = mapped_column(Enum(DecisionType), nullable=False)
    reasons: Mapped[list] = mapped_column(JSON, default=list)
    terminal_flags: Mapped[list] = mapped_column(JSON, default=list)
    decided_by: Mapped[str] = mapped_column(String(255), default="")
    created_at: Mapped[datetime] = mapped_column(server_default=func.now())
