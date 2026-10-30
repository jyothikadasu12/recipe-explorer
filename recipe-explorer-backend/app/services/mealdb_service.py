
import httpx

from app.core.config import settings


class MealDBService:
    def __init__(self) -> None:
        self.base_url = settings.themealdb_base_url.rstrip("/")

    async def _fetch_recipes(self, params: dict) -> list[dict]:
        async with httpx.AsyncClient(timeout=20.0) as client:
            response = await client.get(
                f"{self.base_url}/search.php",
                params=params,
            )
            response.raise_for_status()
            payload = response.json()

        meals = payload.get("meals") or []
        results = []

        for meal in meals:
            ingredients = []

            for number in range(1, 21):
                name = meal.get(f"strIngredient{number}")
                quantity = meal.get(f"strMeasure{number}")

                if name and name.strip():
                    ingredients.append({
                        "name": name.strip(),
                        "quantity": (quantity or "").strip() or "To taste",
                    })

            results.append({
                "external_id": str(meal["idMeal"]),
                "title": meal.get("strMeal") or "Untitled recipe",
                "description": None,
                "category": meal.get("strCategory"),
                "cuisine": meal.get("strArea"),
                "image_url": meal.get("strMealThumb"),
                "ingredients": ingredients,
                "instructions": (
                    meal.get("strInstructions") or
                    "Instructions are not available."
                ).strip(),
                "prep_time_minutes": 0,
                "cook_time_minutes": 0,
                "servings": 2,
                "difficulty": "Easy",
            })

        return results

    async def search_recipes(self, query: str) -> list[dict]:
        return await self._fetch_recipes({"s": query})

    async def search_by_letter(self, letter: str) -> list[dict]:
        letter = letter.lower()

        if len(letter) != 1 or not letter.isalpha():
            raise ValueError("A single alphabet letter is required.")

        return await self._fetch_recipes({"f": letter})


# Create the service object.
# This is what external.py imports.
mealdb_service = MealDBService()
