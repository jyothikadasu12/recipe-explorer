
export type Ingredient = {
  name: string;
  quantity: string;
};

export type RecipeInput = {
  title: string;
  description: string | null;
  category: string | null;
  cuisine: string | null;
  image_url: string | null;
  ingredients: Ingredient[];
  instructions: string;
  prep_time_minutes: number;
  cook_time_minutes: number;
  servings: number;
  difficulty: string;
  external_id: string | null;
};

export type Recipe = RecipeInput & {
  id: number;
  source: string;
  is_favorite: boolean;
  created_at: string;
  updated_at: string;
};

export type ExternalRecipe = RecipeInput;
