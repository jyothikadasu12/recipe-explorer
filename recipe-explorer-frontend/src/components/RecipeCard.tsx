
import { Clock3, Flame, Trash2, Users } from "lucide-react";
import { Link } from "react-router-dom";

import type { Recipe } from "../types/recipe";
import "./RecipeCard.css";

interface RecipeCardProps {
  recipe: Recipe;
  onDelete?: (id: number) => void;
}

export default function RecipeCard({
  recipe,
  onDelete,
}: RecipeCardProps) {
  const recipePath = `/recipes/${recipe.id}`;

  return (
    <article className="recipe-card">
      <Link
        to={recipePath}
        className="recipe-card-image-link"
        aria-label={`View ${recipe.title}`}
      >
        {recipe.image_url ? (
          <img
            className="recipe-card-image"
            src={recipe.image_url}
            alt={recipe.title}
            loading="lazy"
          />
        ) : (
          <div className="recipe-card-placeholder">
            <Flame size={32} />
            <span>No image available</span>
          </div>
        )}

        {recipe.category && (
          <span className="recipe-category">
            {recipe.category}
          </span>
        )}
      </Link>

      <div className="recipe-card-body">
        <p className="recipe-card-cuisine">
          {recipe.cuisine || "Home cooking"}
        </p>

        <h3 className="recipe-card-title">
          <Link to={recipePath}>
            {recipe.title}
          </Link>
        </h3>

        <p className="recipe-card-description">
          {recipe.description || "A recipe to add to your collection."}
        </p>

        <div className="recipe-card-meta">
          <span>
            <Clock3 size={15} />
            {recipe.prep_time_minutes + recipe.cook_time_minutes} min
          </span>

          <span>
            <Users size={15} />
            {recipe.servings} servings
          </span>
        </div>

        <div className="recipe-card-footer">
          <span className="difficulty-label">
            {recipe.difficulty}
          </span>

          {onDelete && (
            <button
              type="button"
              className="card-action-button delete-action"
              onClick={() => onDelete(recipe.id)}
              aria-label={`Delete ${recipe.title}`}
            >
              <Trash2 size={16} />
              Delete
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
