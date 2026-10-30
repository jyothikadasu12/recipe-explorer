export interface RecipeStats {
  total: number;
  external: number;
  custom: number;
}

export interface ImportResult {
  message: string;
  imported: number;
  updated: number;
  failed_letters: string[];
}
import type {
  Recipe,
  RecipeInput,
} from "../types/recipe";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

async function request<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      ...options.headers,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    let message = `Request failed with status ${response.status}`;

    try {
      const errorData = await response.json();
      message = errorData.detail || errorData.message || message;
    } catch {
      // Keep the default error message.
    }

    throw new Error(
      typeof message === "string" ? message : JSON.stringify(message),
    );
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export const recipeService = {

  getRecipeStats(signal?: AbortSignal): Promise<RecipeStats> {
  return request<RecipeStats>("/api/recipes/stats", { signal });
},

importAllRecipes(): Promise<ImportResult> {
  return request<ImportResult>("/api/external/import-all", {
    method: "POST",
  });
},
  // Get recipes stored in PostgreSQL.
  getMyRecipes(signal?: AbortSignal): Promise<Recipe[]> {
    return request<Recipe[]>("/api/recipes/my", { signal });
  },

  getRecipes(signal?: AbortSignal): Promise<Recipe[]> {
    return request<Recipe[]>("/api/recipes", { signal });
  },

  // Get one recipe.
  getRecipeById(id: number): Promise<Recipe> {
    return request<Recipe>(`/api/recipes/${id}`);
  },

  // Search TheMealDB through FastAPI.
  // Backend saves or updates the returned recipes in PostgreSQL.
  searchExternalRecipes(
    query: string,
    signal?: AbortSignal,
  ): Promise<Recipe[]> {
    return request<Recipe[]>(
      `/api/external/search?q=${encodeURIComponent(query)}`,
      { signal },
    );
  },

  // Create a custom recipe.
  createRecipe(data: RecipeInput): Promise<Recipe> {
    return request<Recipe>("/api/recipes", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  // Update a recipe.
  updateRecipe(
    id: number,
    data: Partial<RecipeInput>,
  ): Promise<Recipe> {
    return request<Recipe>(`/api/recipes/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  // Delete a recipe.
  deleteRecipe(id: number): Promise<void> {
    return request<void>(`/api/recipes/${id}`, {
      method: "DELETE",
    });
  },
};
