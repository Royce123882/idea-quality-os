import enum

from sqlalchemy import Enum, ForeignKey, String, Text
from sqlalchemy.dialects.postgresql import JSON, UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import Base, TimestampMixin, UUIDMixin


class IdeaStatus(str, enum.Enum):
    draft = "draft"
    active = "active"
    killed = "killed"
    proceeded = "proceeded"


class Idea(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "ideas"

    workspace_id: Mapped[str] = mapped_column(UUID(as_uuid=True), ForeignKey("workspaces.id"), nullable=False)
    problem_id: Mapped[str] = mapped_column(UUID(as_uuid=True), ForeignKey("problems.id"), nullable=False)
    constraint_set_id: Mapped[str] = mapped_column(UUID(as_uuid=True), ForeignKey("constraint_sets.id"), nullable=False)
    title: Mapped[str] = mapped_column(String(500))
    pitch: Mapped[str] = mapped_column(Text, nullable=True)
    replacement_statement: Mapped[str] = mapped_column(Text, nullable=True)
    wedge: Mapped[str] = mapped_column(Text, nullable=True)
    assumptions: Mapped[list] = mapped_column(JSON, default=list)
    status: Mapped[IdeaStatus] = mapped_column(Enum(IdeaStatus), default=IdeaStatus.draft)
