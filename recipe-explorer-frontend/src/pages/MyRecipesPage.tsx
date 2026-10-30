
import { useCallback, useEffect, useState } from "react";
import { BookOpen, Plus, X } from "lucide-react";
import RecipeCard from "../components/RecipeCard";
import RecipeForm from "../components/RecipeForm";
import { recipeService } from "../services/recipeService";
import type { Recipe, RecipeInput } from "../types/recipe";
import "./MyRecipesPage.css";

export default function MyRecipesPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);

  const loadRecipes = useCallback(async (signal?: AbortSignal) => {
    try {
      setError("");
      const data = await recipeService.getMyRecipes(signal);
      setRecipes(data);
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") return;
      setError(
        err instanceof Error
          ? err.message
          : "Could not load your recipes.",
      );
    } finally {
      if (!signal?.aborted) setLoading(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    void loadRecipes(controller.signal);
    return () => controller.abort();
  }, [loadRecipes]);

  async function handleCreate(data: RecipeInput) {
    await recipeService.createRecipe(data);
    setShowForm(false);
    await loadRecipes();
  }

  async function handleDelete(id: number) {
    const recipe = recipes.find((item) => item.id === id);
    if (!recipe) return;

    const confirmed = window.confirm(
      `Delete "${recipe.title}" from your recipe book?`,
    );

    if (!confirmed) return;

    try {
      setError("");
      await recipeService.deleteRecipe(id);
      setRecipes((current) => current.filter((item) => item.id !== id));
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not delete recipe.",
      );
    }
  }

  return (
    <div className="page-container my-recipes-page">
      <section className="my-recipes-heading">
        <div>
          <p className="eyebrow">YOUR PERSONAL COOKBOOK</p>
          <h1 className="section-heading">My Recipes</h1>
          <p className="muted-text">
            Keep your own creations and discovered recipes together.
          </p>
        </div>

        <button
          type="button"
          className="primary-button"
          onClick={() => setShowForm(true)}
        >
          <Plus size={18} />
          Add recipe
        </button>
      </section>

      <div className="collection-summary">
        <span className="collection-summary-icon"><BookOpen size={22} /></span>
        <div>
          <strong>{recipes.length} saved {recipes.length === 1 ? "recipe" : "recipes"}</strong>
          <p>Stored in your connected recipe database</p>
        </div>
      </div>

      {error && (
        <p className="error-message" role="alert">
          {error}
        </p>
      )}

      {loading ? (
        <p className="muted-text" role="status">Loading your collection...</p>
      ) : recipes.length === 0 && !error ? (
        <div className="empty-state my-recipes-empty">
          <BookOpen size={36} />
          <h2>Your cookbook is waiting</h2>
          <p className="muted-text">
            Add a personal recipe or discover one to save.
          </p>
          <button
            type="button"
            className="primary-button"
            onClick={() => setShowForm(true)}
          >
            <Plus size={18} />
            Create your first recipe
          </button>
        </div>
      ) : (
        <div className="recipe-grid">
          {recipes.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {showForm && (
        <div
          className="recipe-modal-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setShowForm(false);
          }}
        >
          <section
            className="recipe-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="add-recipe-title"
          >
            <div className="recipe-modal-heading">
              <div>
                <p className="eyebrow">MAKE IT YOURS</p>
                <h2 id="add-recipe-title">Add a recipe</h2>
              </div>
              <button
                type="button"
                className="modal-close"
                aria-label="Close form"
                onClick={() => setShowForm(false)}
              >
                <X size={20} />
              </button>
            </div>

            <RecipeForm
              onSubmit={handleCreate}
              onCancel={() => setShowForm(false)}
            />
          </section>
        </div>
      )}
    </div>
  );
}
