
from datetime import datetime
from typing import Literal

from pydantic import BaseModel, ConfigDict, Field, HttpUrl, field_validator


class Ingredient(BaseModel):
    name: str = Field(min_length=1, max_length=150)
    quantity: str = Field(min_length=1, max_length=100)


class RecipeCreate(BaseModel):
    title: str = Field(min_length=1, max_length=150)
    description: str | None = Field(default=None, max_length=500)
    category: str | None = Field(default=None, max_length=100)
    cuisine: str | None = Field(default=None, max_length=100)
    image_url: HttpUrl | None = None
    ingredients: list[Ingredient] = Field(default_factory=list)
    instructions: str = Field(min_length=1)
    prep_time_minutes: int = Field(default=10, ge=0, le=10000)
    cook_time_minutes: int = Field(default=20, ge=0, le=10000)
    servings: int = Field(default=2, ge=1, le=1000)
    difficulty: Literal["Easy", "Medium", "Hard"] = "Easy"
    external_id: str | None = Field(default=None, max_length=50)

    @field_validator(
        "title",
        "instructions",
        mode="before",
    )
    @classmethod
    def strip_required_text(cls, value: object) -> object:
        if isinstance(value, str):
            return value.strip()
        return value


class RecipeUpdate(BaseModel):
    title: str | None = Field(
        default=None,
        min_length=1,
        max_length=150,
    )
    description: str | None = Field(default=None, max_length=500)
    category: str | None = Field(default=None, max_length=100)
    cuisine: str | None = Field(default=None, max_length=100)
    image_url: HttpUrl | None = None
    ingredients: list[Ingredient] | None = None
    instructions: str | None = Field(default=None, min_length=1)
    prep_time_minutes: int | None = Field(default=None, ge=0, le=10000)
    cook_time_minutes: int | None = Field(default=None, ge=0, le=10000)
    servings: int | None = Field(default=None, ge=1, le=1000)
    difficulty: Literal["Easy", "Medium", "Hard"] | None = None

    @field_validator(
        "title",
        "instructions",
        mode="before",
    )
    @classmethod
    def strip_required_text(cls, value: object) -> object:
        if isinstance(value, str):
            return value.strip()
        return value


class RecipeRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    title: str
    description: str | None
    category: str | None
    cuisine: str | None
    image_url: str | None
    ingredients: list[Ingredient]
    instructions: str
    prep_time_minutes: int
    cook_time_minutes: int
    servings: int
    difficulty: Literal["Easy", "Medium", "Hard"]
    source: str
    external_id: str | None
    is_favorite: bool
    created_at: datetime
    updated_at: datetime | None
