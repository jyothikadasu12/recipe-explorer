
from sqlalchemy import select
from sqlalchemy.orm import Session
from sqlalchemy import select, or_
from app.models.recipe import Recipe
from app.schemas.recipe import RecipeCreate, RecipeUpdate

def get_my_recipes(db: Session) -> list[Recipe]:
    statement = (
        select(Recipe)
        .where(
            or_(
                Recipe.source == "custom",
                Recipe.is_favorite.is_(True),
            )
        )
        .order_by(Recipe.created_at.desc())
    )

    return list(db.scalars(statement).all())
def get_recipes(db: Session) -> list[Recipe]:
    statement = select(Recipe).order_by(Recipe.created_at.desc())
    return list(db.scalars(statement).all())


def get_recipe(db: Session, recipe_id: int) -> Recipe | None:
    return db.get(Recipe, recipe_id)


def get_by_external_id(
    db: Session,
    external_id: str,
) -> Recipe | None:
    statement = select(Recipe).where(
        Recipe.external_id == external_id
    )
    return db.scalar(statement)

def save_external_recipe(
    db: Session,
    data: RecipeCreate,
) -> Recipe:
    if not data.external_id:
        raise ValueError("External recipe ID is required.")

    existing = get_by_external_id(db, data.external_id)

    payload = data.model_dump(mode="json")
    
    if payload.get("image_url"):
        payload["image_url"] = str(payload["image_url"])

    if existing:
        for field, value in payload.items():
            if field != "external_id":
                setattr(existing, field, value)

        existing.source = "external"
        recipe = existing
    else:
        recipe = Recipe(
            **payload,
            source="external",
        )
        db.add(recipe)

    db.commit()
    db.refresh(recipe)

    return recipe


def update_recipe(
    db: Session,
    recipe: Recipe,
    data: RecipeUpdate,
) -> Recipe:
    payload = data.model_dump(
        exclude_unset=True,
        mode="json",
    )

    if payload.get("image_url"):
        payload["image_url"] = str(payload["image_url"])

    for field, value in payload.items():
        setattr(recipe, field, value)

    db.commit()
    db.refresh(recipe)

    return recipe

def delete_recipe(db: Session, recipe: Recipe) -> None:
    db.delete(recipe)
    db.commit()
