from datetime import datetime

from sqlalchemy import ForeignKey, Text, func
from sqlalchemy.dialects.postgresql import JSON, UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import Base, UUIDMixin


class GraveyardEntry(Base, UUIDMixin):
    __tablename__ = "graveyard_entries"

    idea_id: Mapped[str] = mapped_column(UUID(as_uuid=True), ForeignKey("ideas.id"), nullable=False)
    kill_reasons: Mapped[list] = mapped_column(JSON, default=list)
    tags: Mapped[list] = mapped_column(JSON, default=list)
    learnings: Mapped[str] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(server_default=func.now())
