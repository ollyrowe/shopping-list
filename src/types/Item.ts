import type { Category } from './Category';

export interface Item {
  id: string;
  name: string;
  quantity: number;
  category?: Category;
  unit?: string;
  checked?: boolean;
}
