import React, { use, useMemo, useState } from 'react';
import { ShoppingListService } from '@/services/ShoppingListService';
import type { Category, Item, ShoppingList } from '@/types';

interface ShoppingListContextValue {
  shoppingList: ShoppingList;
  addItem: (name: string) => void;
  updateItem: (item: Item) => void;
  deleteItem: (item: Item) => void;
  reorderItems: (sourceId: string, destinationId: string) => void;
  categories: Category[];
  createCategory: (category: Omit<Category, 'id'>) => void;
  updateCategory: (category: Category) => void;
  deleteCategory: (category: Category) => void;
  reorderCategories: (sourceId: string, destinationId: string) => void;
}

const ShoppingListContext = React.createContext<ShoppingListContextValue>({
  shoppingList: { items: [] },
  addItem: () => {},
  updateItem: () => {},
  deleteItem: () => {},
  reorderItems: () => {},
  categories: [],
  createCategory: () => {},
  updateCategory: () => {},
  deleteCategory: () => {},
  reorderCategories: () => {},
});

interface ShoppingListProviderProps {
  children: React.ReactNode;
}

const ShoppingListProvider: React.FC<ShoppingListProviderProps> = ({ children }) => {
  const [shoppingList, setShoppingList] = useState<ShoppingList>(
    ShoppingListService.getShoppingList()
  );

  const [categories, setCategories] = useState(ShoppingListService.getCategories());

  const addItem = (name: string) => {
    ShoppingListService.addItem(name);

    setShoppingList(ShoppingListService.getShoppingList());
  };

  const updateItem = (item: Item) => {
    const existingItem = shoppingList.items.find((i) => i.id === item.id);
    if (existingItem) {
      ShoppingListService.updateItem(item);
      setShoppingList(ShoppingListService.getShoppingList());
    }
  };

  const deleteItem = (item: Item) => {
    ShoppingListService.deleteItem(item);
    setShoppingList(ShoppingListService.getShoppingList());
  };

  const reorderItems = (sourceId: string, destinationId: string) => {
    ShoppingListService.reorderItems(sourceId, destinationId);
    setShoppingList(ShoppingListService.getShoppingList());
  };

  const createCategory = (category: Omit<Category, 'id'>) => {
    const newCategory = ShoppingListService.createCategory(category);
    setCategories((prevCategories) => [...prevCategories, newCategory]);
  };

  const updateCategory = (category: Category) => {
    ShoppingListService.updateCategory(category);
    setCategories(ShoppingListService.getCategories());
  };

  const deleteCategory = (category: Category) => {
    ShoppingListService.deleteCategory(category);
    setCategories(ShoppingListService.getCategories());
  };

  const reorderCategories = (sourceId: string, destinationId: string) => {
    ShoppingListService.reorderCategories(sourceId, destinationId);
    setCategories(ShoppingListService.getCategories());
  };

  const value = useMemo(
    () => ({
      shoppingList,
      addItem,
      updateItem,
      deleteItem,
      reorderItems,
      categories,
      createCategory,
      updateCategory,
      deleteCategory,
      reorderCategories,
    }),
    [shoppingList, categories]
  );

  return <ShoppingListContext value={value}>{children}</ShoppingListContext>;
};

export default ShoppingListProvider;

export const useShoppingList = () => {
  const context = use(ShoppingListContext);

  if (!context) {
    throw new Error('useShoppingList must be used within a ShoppingListProvider');
  }

  return context;
};
