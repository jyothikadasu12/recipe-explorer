
import { useEffect, useMemo, useState } from "react";
import {
  Search,
  X,
  ChevronLeft,
  ChevronRight,
  Download,
} from "lucide-react";

import RecipeCard from "../components/RecipeCard";
import { useDebounce } from "../hooks/useDebounce";
import { recipeService } from "../services/recipeService";

import type { Recipe } from "../types/recipe";
import "./ExplorePage.css";

const PAGE_SIZE = 8;

interface RecipeStats {
  total: number;
  external: number;
  custom: number;
}

export default function ExplorePage() {
  const [query, setQuery] = useState("");
  const [recipes, setRecipes] = useState<Recipe[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [currentPage, setCurrentPage] = useState(1);

  const [stats, setStats] = useState<RecipeStats>({
    total: 0,
    external: 0,
    custom: 0,
  });

  const [importing, setImporting] = useState(false);
  const [importMessage, setImportMessage] = useState("");
  const [importError, setImportError] = useState("");

  const [refreshKey, setRefreshKey] = useState(0);

  const debouncedQuery = useDebounce(query.trim(), 350);

  // Load recipes from PostgreSQL or search TheMealDB.
  useEffect(() => {
    const controller = new AbortController();

    async function loadRecipes() {
      setLoading(true);
      setError("");

      try {
        const data = debouncedQuery
          ? await recipeService.searchExternalRecipes(
              debouncedQuery,
              controller.signal
            )
          : await recipeService.getRecipes(controller.signal);

        if (!controller.signal.aborted) {
          setRecipes(data);
        }
      } catch (err) {
        if (controller.signal.aborted) return;

        setError(
          err instanceof Error
            ? err.message
            : "Could not load recipes."
        );

        setRecipes([]);
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadRecipes();

    return () => controller.abort();
  }, [debouncedQuery, refreshKey]);

  // Load recipe statistics from PostgreSQL.
  useEffect(() => {
    const controller = new AbortController();

    async function loadStats() {
      try {
        const data = await recipeService.getRecipeStats(
          controller.signal
        );

        if (!controller.signal.aborted) {
          setStats(data);
        }
      } catch (err) {
        if (!controller.signal.aborted) {
          console.error("Unable to load recipe statistics:", err);
        }
      }
    }

    loadStats();

    return () => controller.abort();
  }, [refreshKey]);

  // Reset pagination whenever the search changes.
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedQuery]);

  // Import all recipes from TheMealDB.
  async function handleImportAll() {
    try {
      setImporting(true);
      setImportMessage("");
      setImportError("");

      const result = await recipeService.importAllRecipes();

      setImportMessage(
        `Import completed! ${result.imported} new recipes added and ${result.updated} recipes updated.`
      );

      if (result.failed_letters.length > 0) {
        setImportMessage(
          `Import completed with some errors. Failed letters: ${result.failed_letters.join(", ")}.`
        );
      }

      // Reload recipes and statistics.
      setRefreshKey((previous) => previous + 1);
    } catch (err) {
      setImportError(
        err instanceof Error
          ? err.message
          : "Unable to import recipes."
      );
    } finally {
      setImporting(false);
    }
  }

  // Calculate pagination.
  const totalPages = Math.ceil(recipes.length / PAGE_SIZE);

  const visibleRecipes = useMemo(() => {
    const startIndex = (currentPage - 1) * PAGE_SIZE;

    return recipes.slice(startIndex, startIndex + PAGE_SIZE);
  }, [recipes, currentPage]);

  const startItem =
    recipes.length === 0
      ? 0
      : (currentPage - 1) * PAGE_SIZE + 1;

  const endItem = Math.min(
    currentPage * PAGE_SIZE,
    recipes.length
  );

  function handlePageChange(page: number) {
    if (page < 1 || page > totalPages) return;

    setCurrentPage(page);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  return (
    <div className="page-container explore-page">

      {/* Page heading */}
      <section className="explore-heading">
        <p className="eyebrow">FIND YOUR NEXT FAVORITE</p>

        <h1 className="section-heading">
          Explore recipes
        </h1>

        <p className="muted-text">
          Discover recipes from your collection and explore new dishes.
        </p>
      </section>

      {/* Recipe statistics */}
      <section className="explore-stats">

        <div className="explore-stat">
          <span>Total recipes</span>
          <strong>{stats.total}</strong>
        </div>

        <div className="explore-stat">
          <span>External recipes</span>
          <strong>{stats.external}</strong>
        </div>

        <div className="explore-stat">
          <span>My recipes</span>
          <strong>{stats.custom}</strong>
        </div>

        <button
          type="button"
          className="import-recipes-button"
          onClick={handleImportAll}
          disabled={importing}
        >
          <Download size={18} />

          {importing
            ? "Importing recipes..."
            : "Import all recipes"}
        </button>

      </section>

      {/* Import messages */}
      {importMessage && (
        <p className="import-message" role="status">
          {importMessage}
        </p>
      )}

      {importError && (
        <p className="import-error" role="alert">
          {importError}
        </p>
      )}

      {/* Search bar */}
      <div className="explore-search">
        <Search size={21} />

        <input
          type="search"
          aria-label="Search recipes"
          placeholder="Try pasta, chicken, curry..."
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />

        {query && (
          <button
            type="button"
            className="search-clear"
            aria-label="Clear search"
            onClick={() => setQuery("")}
          >
            <X size={19} />
          </button>
        )}
      </div>

      {/* Search information */}
      <p className="explore-hint">
        {debouncedQuery
          ? `Searching TheMealDB for "${debouncedQuery}"`
          : "Showing recipes saved in your collection."}
      </p>

      {/* Error */}
      {error && (
        <p className="error-message" role="alert">
          {error}
        </p>
      )}

      {/* Loading */}
      {loading && (
        <p className="explore-status" role="status">
          {debouncedQuery
            ? "Searching recipes..."
            : "Loading your recipes..."}
        </p>
      )}

      {/* Empty state */}
      {!loading && !error && recipes.length === 0 && (
        <div className="empty-state explore-empty">
          <Search size={32} />

          <h2>
            {debouncedQuery
              ? "No recipes found"
              : "Your recipe collection is empty"}
          </h2>

          <p className="muted-text">
            {debouncedQuery
              ? "Try another recipe name or ingredient."
              : "Import recipes or search for a dish above to discover new recipes."}
          </p>
        </div>
      )}

      {/* Recipe results */}
      {!loading && !error && recipes.length > 0 && (
        <>
          <div className="explore-results-heading">
            <h2 className="section-heading">
              {debouncedQuery
                ? "Search results"
                : "Discover recipes"}
            </h2>

            <span>
              {recipes.length}{" "}
              {recipes.length === 1 ? "recipe" : "recipes"}
            </span>
          </div>

          <div className="recipe-grid">
            {visibleRecipes.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
              />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <nav
              className="explore-pagination"
              aria-label="Recipe pagination"
            >
              <span className="pagination-info">
                Showing {startItem}–{endItem} of {recipes.length} recipes
              </span>

              <div className="pagination-controls">

                <button
                  type="button"
                  className="pagination-button"
                  onClick={() =>
                    handlePageChange(currentPage - 1)
                  }
                  disabled={currentPage === 1}
                  aria-label="Previous page"
                >
                  <ChevronLeft size={18} />
                  Previous
                </button>

                <div className="pagination-pages">
                  {Array.from(
                    { length: totalPages },
                    (_, index) => index + 1
                  ).map((page) => (
                    <button
                      key={page}
                      type="button"
                      className={`pagination-page ${
                        currentPage === page ? "active" : ""
                      }`}
                      aria-label={`Page ${page}`}
                      aria-current={
                        currentPage === page
                          ? "page"
                          : undefined
                      }
                      onClick={() =>
                        handlePageChange(page)
                      }
                    >
                      {page}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  className="pagination-button"
                  onClick={() =>
                    handlePageChange(currentPage + 1)
                  }
                  disabled={currentPage === totalPages}
                  aria-label="Next page"
                >
                  Next
                  <ChevronRight size={18} />
                </button>

              </div>
            </nav>
          )}
        </>
      )}
    </div>
  );
}
