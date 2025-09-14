import { v4 as uuidv4 } from 'uuid';
import type { Category, Item } from '@/types';

export class ItemService {
  public static getItems(): Item[] {
    const items = localStorage.getItem(itemsLocalStorageKey);

    if (items) {
      return JSON.parse(items);
    }

    return [];
  }

  public static addItem(name: string) {
    const items = ItemService.getItems();

    items.push({ id: uuidv4(), name, quantity: 1 });

    localStorage.setItem(itemsLocalStorageKey, JSON.stringify(items));
  }

  public static updateItem(item: Item) {
    const items = ItemService.getItems();

    const updatedItems = items.map((existingItem) =>
      existingItem.id === item.id ? { ...existingItem, ...item } : existingItem
    );

    localStorage.setItem(itemsLocalStorageKey, JSON.stringify(updatedItems));
  }

  public static deleteItem(item: Item) {
    const items = ItemService.getItems();

    const updatedItems = items.filter((i) => i.id !== item.id);

    localStorage.setItem(itemsLocalStorageKey, JSON.stringify(updatedItems));
  }

  public static reorderItems(sourceId: string, destinationId: string) {
    const items = ItemService.getItems();

    const sourceIndex = items.findIndex((item) => item.id === sourceId);
    const destinationIndex = items.findIndex((item) => item.id === destinationId);

    if (sourceIndex === -1 || destinationIndex === -1 || sourceIndex === destinationIndex) {
      return;
    }

    const [movedItem] = items.splice(sourceIndex, 1);

    items.splice(destinationIndex, 0, movedItem);

    localStorage.setItem(itemsLocalStorageKey, JSON.stringify(items));
  }

  public static getCategories(): Category[] {
    const categories = localStorage.getItem(categoriesLocalStorageKey);

    if (categories) {
      return JSON.parse(categories);
    }

    return [];
  }

  public static createCategory(category: Omit<Category, 'id'>) {
    const categories = ItemService.getCategories();
    const newCategory = { id: uuidv4(), ...category };

    categories.push(newCategory);

    localStorage.setItem(categoriesLocalStorageKey, JSON.stringify(categories));

    return newCategory;
  }

  public static updateCategory(category: { id: string; name: string; icon: string }) {
    const categories = ItemService.getCategories();

    const updatedCategories = categories.map((existingCategory) =>
      existingCategory.id === category.id ? { ...existingCategory, ...category } : existingCategory
    );

    localStorage.setItem(categoriesLocalStorageKey, JSON.stringify(updatedCategories));
  }

  public static deleteCategory(category: Category) {
    const categories = ItemService.getCategories();

    const updatedCategories = categories.filter((c) => c.id !== category.id);

    localStorage.setItem(categoriesLocalStorageKey, JSON.stringify(updatedCategories));
  }

  public static reorderCategories(sourceId: string, destinationId: string) {
    const categories = ItemService.getCategories();

    const sourceIndex = categories.findIndex((category) => category.id === sourceId);
    const destinationIndex = categories.findIndex((category) => category.id === destinationId);

    if (sourceIndex === -1 || destinationIndex === -1 || sourceIndex === destinationIndex) {
      return;
    }

    const [movedCategory] = categories.splice(sourceIndex, 1);
    categories.splice(destinationIndex, 0, movedCategory);

    localStorage.setItem(categoriesLocalStorageKey, JSON.stringify(categories));
  }
}

const itemsLocalStorageKey = 'items';

const categoriesLocalStorageKey = 'categories';

export const uncategorisedItemIcon = '🏷️';
