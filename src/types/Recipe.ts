export interface Recipe {
  id: string;
  name: string;
  ingredients: Ingredient[];
  link?: string;
  notes?: string;
  color: string;
}

export interface Ingredient {
  name: string;
  quantity: number;
  unit?: string;
}
