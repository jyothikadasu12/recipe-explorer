
import { useEffect, useState } from "react";
import { ArrowRight, BookOpen, ChefHat, Search } from "lucide-react";
import { Link } from "react-router-dom";
import RecipeCard from "../components/RecipeCard";
import { recipeService } from "../services/recipeService";
import type { Recipe } from "../types/recipe";
import "./HomePage.css";

export default function HomePage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    recipeService
      .getMyRecipes(controller.signal)
      .then((data) => setRecipes(data.slice(0, 3)))
      .catch((err: unknown) => {
        if (err instanceof Error && err.name === "AbortError") return;
        setError("Your saved recipes could not be loaded. Is the backend running?");
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, []);

  return (
    <div className="page-container home-page">
      <section className="home-hero">
        <div className="home-hero-content">
          <span className="eyebrow">
            <ChefHat size={16} />
            YOUR EVERYDAY COOKING COMPANION
          </span>

          <h1>
            Find your next
            <br />
            <span>favorite meal.</span>
          </h1>

          <p>
            Explore recipes, discover new flavors, and build a
            collection of meals you love to cook.
          </p>

          <div className="home-hero-actions">
            <Link to="/explore" className="primary-button">
              <Search size={18} />
              Explore recipes
            </Link>
            <Link to="/my-recipes" className="secondary-button">
              <BookOpen size={18} />
              My collection
            </Link>
          </div>
        </div>

        <div className="home-hero-art" aria-hidden="true">
          <div className="hero-art-circle">
            <ChefHat size={72} strokeWidth={1.2} />
          </div>
          <span className="hero-art-note">Made with curiosity.</span>
        </div>
      </section>

      <section className="home-discovery">
        <div className="home-section-intro">
          <div>
            <p className="eyebrow">START SOMETHING DELICIOUS</p>
            <h2 className="section-heading">What would you like to cook?</h2>
            <p className="muted-text">
              Search by recipe name, then save the recipes you want to try.
            </p>
          </div>
          <Link to="/explore" className="text-link">
            Discover recipes <ArrowRight size={17} />
          </Link>
        </div>

        <div className="home-shortcuts">
          <Link to="/explore" className="shortcut-card">
            <span className="shortcut-icon"><Search size={22} /></span>
            <span>
              <strong>Explore recipes</strong>
              <small>Search TheMealDB for inspiration</small>
            </span>
            <ArrowRight size={18} />
          </Link>

          <Link to="/my-recipes" className="shortcut-card">
            <span className="shortcut-icon"><BookOpen size={22} /></span>
            <span>
              <strong>My recipe book</strong>
              <small>Manage recipes saved in your database</small>
            </span>
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      <section className="home-saved-section">
        <div className="home-section-intro">
          <div>
            <p className="eyebrow">YOUR PERSONAL COLLECTION</p>
            <h2 className="section-heading">Recently saved recipes</h2>
          </div>
          <Link to="/my-recipes" className="text-link">
            View all <ArrowRight size={17} />
          </Link>
        </div>

        {loading ? (
          <p className="muted-text" role="status">Loading your recipes...</p>
        ) : error ? (
          <p className="error-message" role="alert">{error}</p>
        ) : recipes.length > 0 ? (
          <div className="recipe-grid">
            {recipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <BookOpen size={34} />
            <h3>Your recipe book starts here</h3>
            <p className="muted-text">
              Discover a meal or add your own recipe to get started.
            </p>
            <Link to="/my-recipes" className="primary-button">
              Add a recipe
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}
