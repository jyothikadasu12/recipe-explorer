
import { useState } from "react";
import type { SyntheticEvent } from "react";
import type {
  Ingredient,
  Recipe,
  RecipeInput,
} from "../types/recipe";
import "./RecipeForm.css";

type Difficulty = Recipe["difficulty"];

interface RecipeFormProps {
  initialRecipe?: Recipe;
  onSubmit: (data: RecipeInput) => Promise<void>;
  onCancel: () => void;
}

function ingredientsToText(ingredients: Ingredient[]): string {
  return ingredients
    .map((item) => `${item.name} | ${item.quantity}`)
    .join("\n");
}

export default function RecipeForm({
  initialRecipe,
  onSubmit,
  onCancel,
}: RecipeFormProps) {
  const [title, setTitle] = useState(initialRecipe?.title ?? "");
  const [description, setDescription] = useState(
    initialRecipe?.description ?? "",
  );
  const [category, setCategory] = useState(
    initialRecipe?.category ?? "",
  );
  const [cuisine, setCuisine] = useState(
    initialRecipe?.cuisine ?? "",
  );
  const [imageUrl, setImageUrl] = useState(
    initialRecipe?.image_url ?? "",
  );
  const [ingredientsText, setIngredientsText] = useState(
    ingredientsToText(initialRecipe?.ingredients ?? []),
  );
  const [instructions, setInstructions] = useState(
    initialRecipe?.instructions ?? "",
  );
  const [prepTime, setPrepTime] = useState(
    String(initialRecipe?.prep_time_minutes ?? 10),
  );
  const [cookTime, setCookTime] = useState(
    String(initialRecipe?.cook_time_minutes ?? 20),
  );
  const [servings, setServings] = useState(
    String(initialRecipe?.servings ?? 2),
  );
  const [difficulty, setDifficulty] = useState<Difficulty>(
    initialRecipe?.difficulty ?? "Easy",
  );
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const ingredients = ingredientsText
      .split("\n")
      .map((line) => {
        const separator = line.indexOf("|");

        if (separator === -1) {
          return { name: line.trim(), quantity: "" };
        }

        return {
          name: line.slice(0, separator).trim(),
          quantity: line.slice(separator + 1).trim(),
        };
      })
      .filter((item) => item.name && item.quantity);

    if (!title.trim() || !instructions.trim()) {
      setError("Recipe name and instructions are required.");
      return;
    }

    if (ingredients.length === 0) {
      setError("Add at least one ingredient with its quantity.");
      return;
    }

    if (imageUrl.trim()) {
      try {
        const url = new URL(imageUrl);
        if (!["http:", "https:"].includes(url.protocol)) {
          throw new Error("Invalid image URL");
        }
      } catch {
        setError("Enter a valid HTTP or HTTPS image URL.");
        return;
      }
    }

    const numericValues = [
      Number(prepTime),
      Number(cookTime),
      Number(servings),
    ];

    if (
      numericValues.some(
        (value) => !Number.isInteger(value) || value < 0,
      ) ||
      Number(servings) < 1
    ) {
      setError("Enter valid non-negative times and at least 1 serving.");
      return;
    }

    const data: RecipeInput = {
      title: title.trim(),
      description: description.trim() || null,
      category: category.trim() || null,
      cuisine: cuisine.trim() || null,
      image_url: imageUrl.trim() || null,
      ingredients,
      instructions: instructions.trim(),
      prep_time_minutes: Number(prepTime),
      cook_time_minutes: Number(cookTime),
      servings: Number(servings),
      difficulty,
      external_id: initialRecipe?.external_id ?? null,
    };

    try {
      setSubmitting(true);
      await onSubmit(data);
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Unable to save this recipe.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="recipe-form" onSubmit={handleSubmit}>
      {error && (
        <p className="error-message" role="alert">
          {error}
        </p>
      )}

      <label className="form-field">
        Recipe name *
        <input
          required
          maxLength={150}
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="e.g. Creamy tomato pasta"
        />
      </label>

      <label className="form-field">
        Short description
        <textarea
          rows={2}
          maxLength={500}
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="What makes this recipe special?"
        />
      </label>

      <div className="form-grid">
        <label className="form-field">
          Category
          <input
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            placeholder="Dinner"
          />
        </label>

        <label className="form-field">
          Cuisine
          <input
            value={cuisine}
            onChange={(event) => setCuisine(event.target.value)}
            placeholder="Italian"
          />
        </label>
      </div>

      <label className="form-field">
        Image URL
        <input
          type="url"
          value={imageUrl}
          onChange={(event) => setImageUrl(event.target.value)}
          placeholder="https://example.com/recipe.jpg"
        />
      </label>

      <label className="form-field">
        Ingredients *
        <textarea
          required
          rows={5}
          value={ingredientsText}
          onChange={(event) => setIngredientsText(event.target.value)}
          placeholder={"Pasta | 200 g\nTomatoes | 3\nOlive oil | 1 tbsp"}
        />
        <span className="form-help">
          One per line: ingredient name | quantity
        </span>
      </label>

      <label className="form-field">
        Instructions *
        <textarea
          required
          rows={5}
          value={instructions}
          onChange={(event) => setInstructions(event.target.value)}
          placeholder="Explain each cooking step..."
        />
      </label>

      <div className="form-grid form-grid-four">
        <label className="form-field">
          Prep (min)
          <input
            type="number"
            min="0"
            value={prepTime}
            onChange={(event) => setPrepTime(event.target.value)}
          />
        </label>

        <label className="form-field">
          Cook (min)
          <input
            type="number"
            min="0"
            value={cookTime}
            onChange={(event) => setCookTime(event.target.value)}
          />
        </label>

        <label className="form-field">
          Servings
          <input
            type="number"
            min="1"
            value={servings}
            onChange={(event) => setServings(event.target.value)}
          />
        </label>

        <label className="form-field">
          Difficulty
          <select
            value={difficulty}
            onChange={(event) =>
              setDifficulty(event.target.value as Difficulty)
            }
          >
            <option>Easy</option>
            <option>Medium</option>
            <option>Hard</option>
          </select>
        </label>
      </div>

      <div className="form-actions">
        <button
          type="button"
          className="secondary-button"
          onClick={onCancel}
          disabled={submitting}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="primary-button"
          disabled={submitting}
        >
          {submitting
            ? "Saving..."
            : initialRecipe
              ? "Update recipe"
              : "Save recipe"}
        </button>
      </div>
    </form>
  );
}
