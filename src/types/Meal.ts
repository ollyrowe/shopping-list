interface FrozenMeal {
  type: 'frozen';
}

interface CookedMeal {
  type: 'cooked';
  recipeId: string;
}

export type Meal = FrozenMeal | CookedMeal;
