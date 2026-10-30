import httpx
import string

from fastapi import APIRouter, Depends, HTTPException, Query
from fastapi.encoders import jsonable_encoder
from pydantic import ValidationError
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session
from app.repositories import recipe_repository
from app.db.session import get_db
from app.schemas.recipe import RecipeCreate
from app.repositories.recipe_repository import save_external_recipe
from app.services.mealdb_service import mealdb_service


router = APIRouter(
    prefix="/api/external",
    tags=["External Recipes"],
)
@router.post("/import-all")
async def import_all_recipes(db: Session = Depends(get_db)):
    imported_count = 0
    updated_count = 0
    failed_letters = []

    try:
        for letter in string.ascii_lowercase:
            try:
                meals = await mealdb_service.search_by_letter(letter)

                for meal in meals:
                    try:
                        recipe_data = RecipeCreate(**meal)

                        existing = (
                            recipe_repository.get_by_external_id(
                                db,
                                recipe_data.external_id,
                            )
                        )

                        save_external_recipe(db, recipe_data)

                        if existing:
                            updated_count += 1
                        else:
                            imported_count += 1

                    except ValidationError:
                        continue

            except Exception:
                failed_letters.append(letter)

        return {
            "message": "Recipe import completed.",
            "imported": imported_count,
            "updated": updated_count,
            "failed_letters": failed_letters,
        }

    except SQLAlchemyError as exc:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail="Unable to import recipes into the database.",
        ) from exc


@router.get("/search")
async def search_external_recipes(
    q: str = Query(min_length=1, max_length=100),
    db: Session = Depends(get_db),
):
    query = q.strip()

    if not query:
        raise HTTPException(
            status_code=422,
            detail="Search query cannot be empty.",
        )

    try:
        # 1. Fetch recipes from TheMealDB
        external_recipes = await mealdb_service.search_recipes(query)

        saved_recipes = []

        # 2. Validate and save recipes to PostgreSQL
        for item in external_recipes:
            try:
                recipe_data = RecipeCreate(**item)

                saved_recipe = save_external_recipe(
                    db=db,
                    data=recipe_data,
                )

                saved_recipes.append(saved_recipe)

            except ValidationError:
                continue

        # 3. Return saved database records to React
        return jsonable_encoder(saved_recipes)

    except httpx.TimeoutException as exc:
        raise HTTPException(
            status_code=504,
            detail="The recipe provider took too long to respond.",
        ) from exc

    except httpx.HTTPError as exc:
        raise HTTPException(
            status_code=502,
            detail="Unable to retrieve recipes from the external provider.",
        ) from exc

    except SQLAlchemyError as exc:
        db.rollback()

        raise HTTPException(
            status_code=500,
            detail="Unable to save external recipes to the database.",
        ) from exc

    except ValueError as exc:
        db.rollback()

        raise HTTPException(
            status_code=502,
            detail="The external recipe provider returned invalid data.",
        ) from exc