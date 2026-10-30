
from datetime import datetime
from typing import Any

from sqlalchemy import (
    Boolean,
    DateTime,
    Integer,
    JSON,
    String,
    Text,
    func,
)
from sqlalchemy.orm import Mapped, mapped_column

from app.db.session import Base


class Recipe(Base):
    __tablename__ = "recipes"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        index=True,
    )

    title: Mapped[str] = mapped_column(
        String(150),
        nullable=False,
        index=True,
    )

    description: Mapped[str | None] = mapped_column(
        String(500),
        nullable=True,
    )

    category: Mapped[str | None] = mapped_column(
        String(100),
        nullable=True,
    )

    cuisine: Mapped[str | None] = mapped_column(
        String(100),
        nullable=True,
    )

    image_url: Mapped[str | None] = mapped_column(
        String(2048),
        nullable=True,
    )

    ingredients: Mapped[list[dict[str, Any]]] = mapped_column(
        JSON,
        nullable=False,
        default=list,
    )

    instructions: Mapped[str] = mapped_column(
        Text,
        nullable=False,
    )

    prep_time_minutes: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
        default=10,
    )

    cook_time_minutes: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
        default=20,
    )

    servings: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
        default=2,
    )

    difficulty: Mapped[str] = mapped_column(
        String(20),
        nullable=False,
        default="Easy",
    )

    source: Mapped[str] = mapped_column(
        String(30),
        nullable=False,
        default="custom",
    )

    external_id: Mapped[str | None] = mapped_column(
        String(50),
        nullable=True,
        unique=True,
    )

    is_favorite: Mapped[bool] = mapped_column(
        Boolean,
        nullable=False,
        default=False,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now(),
    )

    updated_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True),
        nullable=True,
        onupdate=func.now(),
    )
