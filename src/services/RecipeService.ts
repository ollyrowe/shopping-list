import { v4 as uuid } from 'uuid';
import type { Recipe } from '@/types';

export class RecipeService {
  public static getRecipes(): Recipe[] {
    const recipes = localStorage.getItem(recipesLocalStorageKey);

    if (recipes) {
      return JSON.parse(recipes);
    }

    return [];
  }

  public static addRecipe(recipe: Omit<Recipe, 'id'>) {
    const recipes = RecipeService.getRecipes();

    recipes.push({
      id: uuid(),
      ...recipe,
    });

    localStorage.setItem(recipesLocalStorageKey, JSON.stringify(recipes));
  }

  public static updateRecipe(recipe: Recipe) {
    const recipes = RecipeService.getRecipes();

    const updatedRecipes = recipes.map((existingRecipe) =>
      existingRecipe.id === recipe.id ? { ...existingRecipe, ...recipe } : existingRecipe
    );

    localStorage.setItem(recipesLocalStorageKey, JSON.stringify(updatedRecipes));
  }

  public static deleteRecipe(recipe: Recipe) {
    const recipes = RecipeService.getRecipes();

    const updatedRecipes = recipes.filter((existingRecipe) => existingRecipe.id !== recipe.id);

    localStorage.setItem(recipesLocalStorageKey, JSON.stringify(updatedRecipes));
  }

  public static reorderRecipe(sourceId: string, destinationId: string) {
    const recipes = RecipeService.getRecipes();

    const sourceIndex = recipes.findIndex((recipe) => recipe.id === sourceId);
    const destinationIndex = recipes.findIndex((recipe) => recipe.id === destinationId);

    if (sourceIndex === -1 || destinationIndex === -1 || sourceIndex === destinationIndex) {
      return;
    }

    const [movedRecipe] = recipes.splice(sourceIndex, 1);

    recipes.splice(destinationIndex, 0, movedRecipe);

    localStorage.setItem(recipesLocalStorageKey, JSON.stringify(recipes));
  }
}

const recipesLocalStorageKey = 'recipes';
