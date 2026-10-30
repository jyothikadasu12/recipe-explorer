
from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.models.recipe import Recipe
from app.db.session import get_db
from app.repositories import recipe_repository
from app.schemas.recipe import RecipeCreate, RecipeRead, RecipeUpdate

router = APIRouter(prefix="/api/recipes", tags=["Recipes"])


# 1. Get all recipes
@router.get("", response_model=list[RecipeRead])
def list_recipes(db: Session = Depends(get_db)):
    return recipe_repository.get_recipes(db)


# 2. Get my recipes
@router.get("/my", response_model=list[RecipeRead])
def list_my_recipes(db: Session = Depends(get_db)):
    return recipe_repository.get_my_recipes(db)


# 3. Get recipe statistics
@router.get("/stats")
def get_recipe_stats(db: Session = Depends(get_db)):
    total = db.query(func.count(Recipe.id)).scalar() or 0

    external = (
        db.query(func.count(Recipe.id))
        .filter(Recipe.source == "external")
        .scalar() or 0
    )

    custom = (
        db.query(func.count(Recipe.id))
        .filter(Recipe.source == "custom")
        .scalar() or 0
    )

    return {
        "total": total,
        "external": external,
        "custom": custom,
    }


# 4. Get recipe by ID — keep dynamic routes after static routes
@router.get("/{recipe_id}", response_model=RecipeRead)
def read_recipe(recipe_id: int, db: Session = Depends(get_db)):
    recipe = recipe_repository.get_recipe(db, recipe_id)

    if not recipe:
        raise HTTPException(
            status_code=404,
            detail="Recipe not found",
        )

    return recipe


# 5. Create recipe
@router.post(
    "",
    response_model=RecipeRead,
    status_code=status.HTTP_201_CREATED,
)
def add_recipe(
    data: RecipeCreate,
    db: Session = Depends(get_db),
):
    if data.external_id:
        existing = recipe_repository.get_by_external_id(
            db, data.external_id
        )

        if existing:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="This external recipe is already saved.",
            )

    try:
        return recipe_repository.create_recipe(db, data)
    except IntegrityError as exc:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="This recipe may already have been saved.",
        ) from exc


# 6. Update recipe
@router.put("/{recipe_id}", response_model=RecipeRead)
def edit_recipe(
    recipe_id: int,
    data: RecipeUpdate,
    db: Session = Depends(get_db),
):
    recipe = recipe_repository.get_recipe(db, recipe_id)

    if recipe is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Recipe not found",
        )

    return recipe_repository.update_recipe(db, recipe, data)


# 7. Delete recipe
@router.delete(
    "/{recipe_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def remove_recipe(
    recipe_id: int,
    db: Session = Depends(get_db),
):
    recipe = recipe_repository.get_recipe(db, recipe_id)

    if recipe is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Recipe not found",
        )

    recipe_repository.delete_recipe(db, recipe)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
