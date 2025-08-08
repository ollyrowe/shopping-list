import { v4 as uuidv4 } from 'uuid';
import type { Category, Item, ShoppingList } from '@/types';

export class ShoppingListService {
  public static getShoppingList(): ShoppingList {
    const shoppingList = localStorage.getItem(shoppingListLocalStorageKey);

    if (shoppingList) {
      return JSON.parse(shoppingList);
    }

    return { items: [] };
  }

  public static addItem(item: Pick<Item, 'name'>) {
    const shoppingList = ShoppingListService.getShoppingList();

    shoppingList.items.push({
      id: uuidv4(),
      ...item,
      quantity: 1,
    });

    localStorage.setItem(shoppingListLocalStorageKey, JSON.stringify(shoppingList));
  }

  public static updateItem(item: Item) {
    const shoppingList = ShoppingListService.getShoppingList();

    shoppingList.items = shoppingList.items.map((existingItem) =>
      existingItem.id === item.id ? { ...existingItem, ...item } : existingItem
    );

    localStorage.setItem(shoppingListLocalStorageKey, JSON.stringify(shoppingList));
  }

  public static deleteItem(item: Item) {
    const shoppingList = ShoppingListService.getShoppingList();

    shoppingList.items = shoppingList.items.filter((i) => i.id !== item.id);

    localStorage.setItem(shoppingListLocalStorageKey, JSON.stringify(shoppingList));
  }

  public static checkItem(item: Item) {
    const shoppingList = ShoppingListService.getShoppingList();

    shoppingList.items = shoppingList.items.map((existingItem) =>
      existingItem.id === item.id
        ? { ...existingItem, checked: !existingItem.checked }
        : existingItem
    );

    localStorage.setItem(shoppingListLocalStorageKey, JSON.stringify(shoppingList));
  }

  public static reorderItems(sourceId: string, destinationId: string) {
    const shoppingList = ShoppingListService.getShoppingList();

    const sourceIndex = shoppingList.items.findIndex((item) => item.id === sourceId);
    const destinationIndex = shoppingList.items.findIndex((item) => item.id === destinationId);

    if (sourceIndex === -1 || destinationIndex === -1 || sourceIndex === destinationIndex) {
      return;
    }

    const [movedItem] = shoppingList.items.splice(sourceIndex, 1);

    shoppingList.items.splice(destinationIndex, 0, movedItem);

    localStorage.setItem(shoppingListLocalStorageKey, JSON.stringify(shoppingList));
  }

  public static getCategories(): Category[] {
    const categories = localStorage.getItem(categoriesLocalStorageKey);

    if (categories) {
      return JSON.parse(categories);
    }

    return [];
  }

  public static createCategory(category: Omit<Category, 'id'>) {
    const categories = ShoppingListService.getCategories();
    const newCategory = { id: uuidv4(), ...category };

    categories.push(newCategory);

    localStorage.setItem(categoriesLocalStorageKey, JSON.stringify(categories));

    return newCategory;
  }

  public static updateCategory(category: { id: string; name: string; icon: string }) {
    const categories = ShoppingListService.getCategories();

    const updatedCategories = categories.map((existingCategory) =>
      existingCategory.id === category.id ? { ...existingCategory, ...category } : existingCategory
    );

    localStorage.setItem(categoriesLocalStorageKey, JSON.stringify(updatedCategories));
  }

  public static deleteCategory(category: Category) {
    const categories = ShoppingListService.getCategories();

    const updatedCategories = categories.filter((c) => c.id !== category.id);

    localStorage.setItem(categoriesLocalStorageKey, JSON.stringify(updatedCategories));
  }

  public static reorderCategories(sourceId: string, destinationId: string) {
    const categories = ShoppingListService.getCategories();

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

const shoppingListLocalStorageKey = 'shoppingList';

const categoriesLocalStorageKey = 'categories';

export const uncategorisedItemIcon = '🏷️';
