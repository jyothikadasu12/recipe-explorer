
import { useEffect, useState } from "react";
import {
  ArrowRight,
  BookOpen,
  ChefHat,
  ChevronLeft,
  ChevronRight,
  Search,
} from "lucide-react";
import { Link } from "react-router-dom";

import RecipeCard from "../components/RecipeCard";
import { recipeService } from "../services/recipeService";
import type { Recipe } from "../types/recipe";

import "./HomePage.css";

export default function HomePage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Fetch saved recipes from the backend
  useEffect(() => {
    const controller = new AbortController();

    recipeService
      .getMyRecipes(controller.signal)
      .then((data) => {
        setRecipes(data);
        setActiveIndex(0);
      })
      .catch((err: unknown) => {
        if (err instanceof Error && err.name === "AbortError") {
          return;
        }

        setError(
          "Your saved recipes could not be loaded. Please try again."
        );
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      });

    return () => controller.abort();
  }, []);

  // Automatic carousel scrolling
  useEffect(() => {
    if (recipes.length <= 1 || isPaused) {
      return;
    }

    const interval = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % recipes.length);
    }, 4000);

    return () => window.clearInterval(interval);
  }, [recipes.length, isPaused]);

  // Go to the next recipe
  const nextSlide = () => {
    setActiveIndex((current) =>
      recipes.length > 0
        ? (current + 1) % recipes.length
        : 0
    );
  };

  // Go to the previous recipe
  const previousSlide = () => {
    setActiveIndex((current) =>
      recipes.length > 0
        ? (current - 1 + recipes.length) % recipes.length
        : 0
    );
  };

  // Select a particular recipe
  const selectSlide = (index: number) => {
    setActiveIndex(index);
  };

  // Get three recipes starting from the active recipe
  const visibleRecipes = recipes.length
    ? Array.from(
        { length: Math.min(3, recipes.length) },
        (_, offset) => {
          const index = (activeIndex + offset) % recipes.length;

          return {
            recipe: recipes[index],
            index,
          };
        }
      )
    : [];

  const featuredRecipe = recipes[activeIndex];

  return (
    <div className="page-container home-page">

      {/* FEATURED RECIPE CAROUSEL */}
      <section
        className="featured-carousel"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onFocusCapture={() => setIsPaused(true)}
        onBlurCapture={(event) => {
          if (
            !event.currentTarget.contains(event.relatedTarget as Node | null)
          ) {
            setIsPaused(false);
          }
        }}
      >
        <div className="featured-hero">

          {/* Featured recipe image */}
          {featuredRecipe?.image_url && (
            <img
              key={featuredRecipe.id}
              className="featured-hero-image"
              src={featuredRecipe.image_url}
              alt={featuredRecipe.title}
            />
          )}

          <div className="featured-hero-overlay" />

          <div className="featured-hero-content">

            <span className="eyebrow">
              <ChefHat size={16} />
              YOUR EVERYDAY COOKING COMPANION
            </span>

            {featuredRecipe ? (
              <>
                <h1>
                  Discover your next
                  <br />
                  <span>favorite recipe.</span>
                </h1>

                <p>
                  Today's featured recipe:
                  <strong> {featuredRecipe.title}</strong>.
                  Discover delicious meals and bring new flavors
                  into your kitchen.
                </p>

                <div className="home-hero-actions">
                  <Link
                    to={`/recipes/${featuredRecipe.id}`}
                    className="primary-button"
                  >
                    View Recipe
                    <ArrowRight size={18} />
                  </Link>

                  <Link
                    to="/explore"
                    className="secondary-button"
                  >
                    <Search size={18} />
                    Explore More
                  </Link>
                </div>
              </>
            ) : (
              <>
                <h1>
                  Taste the world
                  <br />
                  <span>from your kitchen.</span>
                </h1>

                <p>
                  Discover delicious recipes, explore new flavors,
                  and create meals you love.
                </p>

                <div className="home-hero-actions">
                  <Link
                    to="/explore"
                    className="primary-button"
                  >
                    <Search size={18} />
                    Explore Recipes
                  </Link>

                  <Link
                    to="/my-recipes"
                    className="secondary-button"
                  >
                    <BookOpen size={18} />
                    My Collection
                  </Link>
                </div>
              </>
            )}

          </div>

          {/* Hero navigation controls */}
          {recipes.length > 1 && (
            <div className="hero-carousel-controls">

              <button
                type="button"
                onClick={previousSlide}
                aria-label="Previous featured recipe"
              >
                <ChevronLeft size={22} />
              </button>

              <span aria-live="polite">
                {activeIndex + 1} / {recipes.length}
              </span>

              <button
                type="button"
                onClick={nextSlide}
                aria-label="Next featured recipe"
              >
                <ChevronRight size={22} />
              </button>

            </div>
          )}

          {/* Auto-play status */}
          {recipes.length > 1 && (
            <span className="carousel-status">
              {isPaused ? "Paused" : "Auto playing"}
            </span>
          )}

        </div>

        {/* RECIPE THUMBNAIL CAROUSEL */}
        {!loading && !error && recipes.length > 0 && (
          <div className="recipe-carousel">

            <button
              type="button"
              className="carousel-arrow"
              onClick={previousSlide}
              aria-label="Previous recipes"
              disabled={recipes.length < 2}
            >
              <ChevronLeft size={21} />
            </button>

            <div className="carousel-track">

              {visibleRecipes.map(({ recipe, index }) => (
                <button
                  type="button"
                  key={recipe.id}
                  className={`carousel-recipe-card ${
                    activeIndex === index ? "active" : ""
                  }`}
                  onClick={() => selectSlide(index)}
                  aria-label={`Show ${recipe.title}`}
                  aria-pressed={activeIndex === index}
                >
                  <div className="carousel-recipe-image">

                    {recipe.image_url ? (
                      <img
                        src={recipe.image_url}
                        alt=""
                      />
                    ) : (
                      <ChefHat size={35} />
                    )}

                  </div>

                  <div className="carousel-recipe-info">
                    <strong>{recipe.title}</strong>
                    <span>Discover this recipe</span>
                  </div>
                </button>
              ))}

            </div>

            <button
              type="button"
              className="carousel-arrow"
              onClick={nextSlide}
              aria-label="Next recipes"
              disabled={recipes.length < 2}
            >
              <ChevronRight size={21} />
            </button>

          </div>
        )}

      </section>

      {/* DISCOVERY SECTION */}
      <section className="home-discovery">

        <div className="home-section-intro">

          <div>
            <p className="eyebrow">
              START SOMETHING DELICIOUS
            </p>

            <h2 className="section-heading">
              What would you like to cook?
            </h2>

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

            <span className="shortcut-icon">
              <Search size={22} />
            </span>

            <span>
              <strong>Explore recipes</strong>
              <small>Search TheMealDB for inspiration</small>
            </span>

            <ArrowRight size={18} />

          </Link>

          <Link to="/my-recipes" className="shortcut-card">

            <span className="shortcut-icon">
              <BookOpen size={22} />
            </span>

            <span>
              <strong>My recipe book</strong>
              <small>Manage recipes saved in your database</small>
            </span>

            <ArrowRight size={18} />

          </Link>

        </div>

      </section>

      {/* RECENTLY SAVED RECIPES */}
      <section className="home-saved-section">

        <div className="home-section-intro">

          <div>
            <p className="eyebrow">
              YOUR PERSONAL COLLECTION
            </p>

            <h2 className="section-heading">
              Recently saved recipes
            </h2>
          </div>

          <Link to="/my-recipes" className="text-link">
            View all <ArrowRight size={17} />
          </Link>

        </div>

        {loading ? (
          <p className="muted-text" role="status">
            Loading your recipes...
          </p>
        ) : error ? (
          <p className="error-message" role="alert">
            {error}
          </p>
        ) : recipes.length > 0 ? (
          <div className="recipe-grid">

            {recipes.slice(0, 3).map((recipe) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
              />
            ))}

          </div>
        ) : (
          <div className="empty-state">

            <BookOpen size={34} />

            <h3>Your recipe book starts here</h3>

            <p className="muted-text">
              Discover a meal or add your own recipe to get started.
            </p>

            <Link
              to="/explore"
              className="primary-button"
            >
              Explore recipes
            </Link>

          </div>
        )}

      </section>

    </div>
  );
}
