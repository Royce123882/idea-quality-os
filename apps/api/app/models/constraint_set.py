from sqlalchemy import Boolean, ForeignKey, Integer, String
from sqlalchemy.dialects.postgresql import JSON, UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import Base, TimestampMixin, UUIDMixin


class ConstraintSet(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "constraint_sets"

    workspace_id: Mapped[str] = mapped_column(UUID(as_uuid=True), ForeignKey("workspaces.id"), nullable=False)
    problem_id: Mapped[str] = mapped_column(UUID(as_uuid=True), ForeignKey("problems.id"), nullable=False)
    attention_budget_seconds: Mapped[int] = mapped_column(Integer, default=0)
    cadence: Mapped[str] = mapped_column(String(100), default="")
    workflow_systems: Mapped[list] = mapped_column(JSON, default=list)
    non_negotiables: Mapped[list] = mapped_column(JSON, default=list)
    compliance_tags: Mapped[list] = mapped_column(JSON, default=list)
    created_by: Mapped[str] = mapped_column(String(255), default="")
    version: Mapped[int] = mapped_column(Integer, default=1)
    is_locked: Mapped[bool] = mapped_column(Boolean, default=False)
