import type { Category } from './Category';

export type ShoppingList = {
  items: Item[];
};

export interface Item {
  id: string;
  name: string;
  quantity: number;
  category?: Category;
  unit?: string;
  checked?: boolean;
}
