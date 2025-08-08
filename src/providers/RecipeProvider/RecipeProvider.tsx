import React, { use, useMemo, useState } from 'react';
import { RecipeService } from '@/services/RecipeService';
import type { Recipe } from '@/types';

interface RecipeContextValue {
  recipes: Recipe[];
  addRecipe: (recipe: Omit<Recipe, 'id'>) => void;
  updateRecipe: (recipe: Recipe) => void;
  deleteRecipe: (recipe: Recipe) => void;
  reorderRecipe: (sourceId: string, destinationId: string) => void;
}

const RecipeContext = React.createContext<RecipeContextValue>({
  recipes: [],
  addRecipe: () => {},
  updateRecipe: () => {},
  deleteRecipe: () => {},
  reorderRecipe: () => {},
});

interface RecipeProviderProps {
  children: React.ReactNode;
}

const RecipeProvider: React.FC<RecipeProviderProps> = ({ children }) => {
  const [recipes, setRecipes] = useState<Recipe[]>(RecipeService.getRecipes());

  const addRecipe = (recipe: Omit<Recipe, 'id'>) => {
    RecipeService.addRecipe(recipe);
    setRecipes(RecipeService.getRecipes());
  };

  const updateRecipe = (recipe: Recipe) => {
    const existingRecipe = recipes.find((existingRecipe) => existingRecipe.id === recipe.id);
    if (existingRecipe) {
      RecipeService.updateRecipe(recipe);
      setRecipes(RecipeService.getRecipes());
    }
  };

  const deleteRecipe = (recipe: Recipe) => {
    RecipeService.deleteRecipe(recipe);
    setRecipes(RecipeService.getRecipes());
  };

  const reorderRecipe = (sourceId: string, destinationId: string) => {
    RecipeService.reorderRecipe(sourceId, destinationId);
    setRecipes(RecipeService.getRecipes());
  };

  const value = useMemo(
    () => ({
      recipes,
      addRecipe,
      updateRecipe,
      deleteRecipe,
      reorderRecipe,
    }),
    [recipes]
  );

  return <RecipeContext value={value}>{children}</RecipeContext>;
};

export default RecipeProvider;

export const useRecipes = () => {
  const context = use(RecipeContext);

  if (!context) {
    throw new Error('useRecipes must be used within a RecipeProvider');
  }

  return context;
};
