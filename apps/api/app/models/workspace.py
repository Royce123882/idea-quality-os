from datetime import datetime

from sqlalchemy import String, func
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import Base, UUIDMixin


class Workspace(Base, UUIDMixin):
    __tablename__ = "workspaces"

    name: Mapped[str] = mapped_column(String(255))
    plan: Mapped[str] = mapped_column(String(50), default="free")
    created_at: Mapped[datetime] = mapped_column(server_default=func.now())
