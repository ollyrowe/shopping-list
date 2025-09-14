import React, { use, useMemo, useState } from 'react';
import { ItemService } from '@/services/ItemService';
import type { Category, Item } from '@/types';

interface ShoppingListContextValue {
  items: Item[];
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
  items: [],
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
  const [items, setItems] = useState(ItemService.getItems());

  const [categories, setCategories] = useState(ItemService.getCategories());

  const addItem = (name: string) => {
    ItemService.addItem(name);

    setItems(ItemService.getItems());
  };

  const updateItem = (item: Item) => {
    const existingItem = items.find((i) => i.id === item.id);
    if (existingItem) {
      ItemService.updateItem(item);
      setItems(ItemService.getItems());
    }
  };

  const deleteItem = (item: Item) => {
    ItemService.deleteItem(item);
    setItems(ItemService.getItems());
  };

  const reorderItems = (sourceId: string, destinationId: string) => {
    ItemService.reorderItems(sourceId, destinationId);
    setItems(ItemService.getItems());
  };

  const createCategory = (category: Omit<Category, 'id'>) => {
    const newCategory = ItemService.createCategory(category);
    setCategories((prevCategories) => [...prevCategories, newCategory]);
  };

  const updateCategory = (category: Category) => {
    ItemService.updateCategory(category);
    setCategories(ItemService.getCategories());
  };

  const deleteCategory = (category: Category) => {
    ItemService.deleteCategory(category);
    setCategories(ItemService.getCategories());
  };

  const reorderCategories = (sourceId: string, destinationId: string) => {
    ItemService.reorderCategories(sourceId, destinationId);
    setCategories(ItemService.getCategories());
  };

  const value = useMemo(
    () => ({
      items,
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
    [items, categories]
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
