
import { useEffect, useState } from "react";
import { ArrowLeft, Clock3, Users } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import RecipeForm from "../components/RecipeForm";
import { recipeService } from "../services/recipeService";
import type { Recipe, RecipeInput } from "../types/recipe";
import "./RecipeDetailsPage.css";

export default function RecipeDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState("");

  
useEffect(() => {
  if (!id) {
    setError("Recipe ID is missing.");
    setLoading(false);
    return;
  }

  const recipeId = Number(id);

  if (!Number.isInteger(recipeId) || recipeId <= 0) {
    setError("Invalid recipe ID.");
    setLoading(false);
    return;
  }

  const controller = new AbortController();

  setLoading(true);
  setError("");

  recipeService
    .getRecipeById(recipeId)
    .then((foundRecipe) => {
      if (!controller.signal.aborted) {
        setRecipe(foundRecipe);
      }
    })
    .catch((err: unknown) => {
      if (err instanceof Error && err.name === "AbortError") return;

      if (!controller.signal.aborted) {
        setError(
          err instanceof Error
            ? err.message
            : "Recipe could not be loaded.",
        );
      }
    })
    .finally(() => {
      if (!controller.signal.aborted) {
        setLoading(false);
      }
    });

  return () => controller.abort();
}, [id]);


  async function handleUpdate(data: RecipeInput) {
    if (!recipe) return;
    const updated = await recipeService.updateRecipe(recipe.id, data);
    setRecipe(updated);
    setEditing(false);
  }

  if (loading) {
    return (
      <div className="page-container details-state" role="status">
        Loading recipe...
      </div>
    );
  }

  if (error || !recipe) {
    return (
      <div className="page-container details-state">
        <p className="error-message" role="alert">
          {error || "Recipe not found."}
        </p>
        <Link to="/my-recipes" className="secondary-button">
          <ArrowLeft size={17} /> Back to My Recipes
        </Link>
      </div>
    );
  }

  return (
    <div className="page-container recipe-details-page">
      <Link to="/my-recipes" className="back-link">
        <ArrowLeft size={17} /> Back to My Recipes
      </Link>

      {editing ? (
        <section className="details-edit-panel">
          <h1>Edit recipe</h1>
          <RecipeForm
            initialRecipe={recipe}
            onSubmit={handleUpdate}
            onCancel={() => setEditing(false)}
          />
        </section>
      ) : (
        <>
          <section className="details-hero">
            {recipe.image_url ? (
              <img src={recipe.image_url} alt={recipe.title} />
            ) : (
              <div className="details-image-placeholder">
                No image available
              </div>
            )}

            <div className="details-hero-content">
              {recipe.category && (
                <span className="details-category">{recipe.category}</span>
              )}
              <h1>{recipe.title}</h1>
              <p>{recipe.description || "A recipe in your collection."}</p>

              <div className="details-meta">
                <span>
                  <Clock3 size={17} />
                  {recipe.prep_time_minutes + recipe.cook_time_minutes} min
                </span>
                <span>
                  <Users size={17} />
                  {recipe.servings} servings
                </span>
                <span>{recipe.difficulty}</span>
              </div>

              <button
                type="button"
                className="primary-button"
                onClick={() => setEditing(true)}
              >
                Edit recipe
              </button>
            </div>
          </section>

          <section className="details-content">
            <div className="ingredients-panel">
              <h2>Ingredients</h2>
              <ul>
                {recipe.ingredients.map((ingredient, index) => (
                  <li key={`${ingredient.name}-${index}`}>
                    <span>{ingredient.name}</span>
                    <strong>{ingredient.quantity}</strong>
                  </li>
                ))}
              </ul>
            </div>

            <div className="instructions-panel">
              <h2>Cooking instructions</h2>
              {recipe.instructions.split(/\n+/).filter(Boolean).map((step, index) => (
                <div className="instruction-step" key={`${index}-${step.slice(0, 20)}`}>
                  <span>{index + 1}</span>
                  <p>{step}</p>
                </div>
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
}
