import React, { useEffect, useState } from 'react';
import {
  IconClearAll,
  IconEye,
  IconEyeOff,
  IconPlus,
  IconSearch,
  IconSortAscendingShapes,
} from '@tabler/icons-react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ActionIcon,
  Box,
  Button,
  Divider,
  Flex,
  Progress,
  Text,
  TextInput,
  useComputedColorScheme,
} from '@mantine/core';
import { useLocalStorage } from '@mantine/hooks';
import AddItemModal from '@/components/AddItemModal';
import ChangeCategoryModal from '@/components/ChangeCategoryModal';
import ItemDrawer from '@/components/ItemDrawer';
import SortItemsModal from '@/components/SortListModal';
import { useShoppingList } from '@/providers/ShoppingListProvider';
import { type Category, type Item } from '@/types';
import ItemRecord, { itemAnimationDurationSeconds } from './ItemRecord';

const ShoppingListPage: React.FC = () => {
  const { shoppingList, categories, updateItem } = useShoppingList();

  const [items, setItems] = useState<Item[]>(shoppingList.items);

  const [displayAddItemModal, setDisplayAddItemModal] = useState(false);

  const [displaySortItemsModal, setDisplaySortItemsModal] = useState(false);

  const [selectedItem, setSelectedItem] = useState<Item>();

  const [displayItemDrawer, setDisplayItemDrawer] = useState(false);

  const [displayChangeCategoryModal, setDisplayChangeCategoryModal] = useState(false);

  // Whether the checked items are currently being cleared
  const [isClearing, setIsClearing] = useState(false);

  // The IDs of the items that are currently being cleared
  const [itemsBeingCleared, setItemsBeingCleared] = useState<Set<string>>(new Set());

  const [areCheckedItemsVisible, setAreCheckedItemsVisible] = useLocalStorage({
    key: 'checked-items-visible',
    defaultValue: true,
  });

  const toggleCheckedItemsVisibility = () => {
    setAreCheckedItemsVisible((prev) => !prev);
  };

  const handleDisplayItemDrawer = (item: Item) => {
    setSelectedItem(item);
    setDisplayItemDrawer(true);
  };

  const handleDisplayChangeCategoryModal = (item: Item) => {
    setSelectedItem(item);
    setDisplayChangeCategoryModal(true);
  };

  const handleCheckItem = (item: Item) => {
    /**
     * Update the local state with a temporary duplicate item with the opposite checked state.
     *
     * This allows for a new item to be added before the old one is removed, creating a cleaner animation.
     */
    setItems((prev) => [...prev, { ...item, checked: !item.checked }]);

    /**
     * Use a timeout to ensure the state change made above is reflected before updating the item.
     */
    setTimeout(() => {
      updateItem({ ...item, checked: !item.checked });
    });
  };

  const handleClearCheckedItems = async () => {
    const checkedItemIds = orderedCheckedItems.map((item) => item.id);

    if (checkedItemIds.length === 0) {
      return;
    }

    setIsClearing(true);

    // Animate items out one by one
    for (let i = 0; i < checkedItemIds.length; i++) {
      const itemId = checkedItemIds[i];

      // Add item to clearing set to trigger exit animation
      setItemsBeingCleared((prev) => new Set([...prev, itemId]));

      // Wait a moment before proceeding to next item
      await new Promise((resolve) => setTimeout(resolve, 150));
    }

    // Wait for the exit animation of the last item to complete
    await new Promise((resolve) => setTimeout(resolve, itemAnimationDurationSeconds * 1000));

    // Actually remove the items from the list
    for (const item of orderedCheckedItems) {
      updateItem({ ...item, quantity: 0 });
    }

    // Reset state
    setIsClearing(false);
    setItemsBeingCleared(new Set());
  };

  const handleUpdateSelectedItemCategory = (category: Category) => {
    if (selectedItem) {
      updateItem({ ...selectedItem, category });
    }
  };

  // Filter all items for those which have a quantity of at least 1
  const itemsOnList = items.filter((item) => item.quantity > 0);

  // Separate checked and unchecked items
  const uncheckedItems = itemsOnList.filter((item) => !item.checked);
  const checkedItems = itemsOnList.filter((item) => item.checked);

  // Sort the items inline within the original list then sort by category
  const sortItemsByCategory = (items: Item[]) => {
    return items
      .sort((a, b) => {
        const indexA = shoppingList.items.findIndex((item) => item.id === a.id);
        const indexB = shoppingList.items.findIndex((item) => item.id === b.id);

        return indexA - indexB;
      })
      .sort((a, b) => {
        const categoryAIndex = a.category
          ? categories.findIndex((c) => c.id === a.category?.id)
          : -1;
        const categoryBIndex = b.category
          ? categories.findIndex((c) => c.id === b.category?.id)
          : -1;

        if (categoryAIndex !== categoryBIndex) {
          return categoryAIndex - categoryBIndex;
        }

        return 1;
      });
  };

  const orderedUncheckedItems = sortItemsByCategory(uncheckedItems);
  const orderedCheckedItems = sortItemsByCategory(checkedItems);

  // The progress of the total number of items checked off the list
  const progress = (itemsOnList.filter((item) => item.checked).length / itemsOnList.length) * 100;

  const colorScheme = useComputedColorScheme();

  const checkedItemColor =
    colorScheme === 'light' ? 'var(--mantine-color-gray-0)' : 'var(--mantine-color-dark-8)';

  /**
   * Synchronise the items within the internal state.
   */
  useEffect(() => {
    setItems(shoppingList.items);
  }, [shoppingList.items]);

  return (
    <>
      <Box w="100%" px="sm" pb="sm">
        <TextInput
          placeholder="Add item"
          leftSection={<IconSearch size={16} />}
          rightSection={
            <ActionIcon
              radius="xl"
              variant="outline"
              size="sm"
              onClick={() => setDisplayAddItemModal(true)}
            >
              <IconPlus size={16} />
            </ActionIcon>
          }
          onClick={() => setDisplayAddItemModal(true)}
          onFocus={(e) => e.target.blur()}
          radius="xl"
          mb="sm"
        />
        <Button
          rightSection={<IconSortAscendingShapes size={16} />}
          onClick={() => setDisplaySortItemsModal(true)}
          variant="outline"
          justify="space-between"
          px="xs"
          fullWidth
        >
          Sort list
        </Button>
      </Box>
      <Progress value={progress} transitionDuration={400} color="green" radius="none" h="4px" />
      <Flex direction="column" h="100%" style={{ overflow: 'auto' }} bg={checkedItemColor}>
        <AnimatePresence initial={false}>
          {orderedUncheckedItems.map((item) => (
            <ItemRecord
              key={`${item.id}-${item.checked}`}
              item={item}
              isBeingCleared={itemsBeingCleared.has(item.id)}
              onClick={() => handleDisplayItemDrawer(item)}
              onCheck={() => handleCheckItem(item)}
              onChangeCategory={() => handleDisplayChangeCategoryModal(item)}
            />
          ))}
          {checkedItems.length > 0 && (
            <motion.div key="checked-items" layout>
              <Flex px="md" py="xs" bg={checkedItemColor} align="center">
                <ActionIcon variant="subtle" color="gray" onClick={toggleCheckedItemsVisibility}>
                  {areCheckedItemsVisible ? <IconEye size={16} /> : <IconEyeOff size={16} />}
                </ActionIcon>
                <Text c="gray" size="sm" fw="bold" w="100%" ta="center">
                  Checked Items ({checkedItems.length})
                </Text>
                <ActionIcon
                  variant="subtle"
                  color="gray"
                  onClick={handleClearCheckedItems}
                  disabled={isClearing}
                >
                  <IconClearAll size={16} />
                </ActionIcon>
              </Flex>
              <Divider />
            </motion.div>
          )}
          {areCheckedItemsVisible &&
            orderedCheckedItems.map((item) => (
              <ItemRecord
                key={`${item.id}-${item.checked}`}
                item={item}
                visible={areCheckedItemsVisible}
                isBeingCleared={itemsBeingCleared.has(item.id)}
                onClick={() => handleDisplayItemDrawer(item)}
                onCheck={() => handleCheckItem(item)}
                onChangeCategory={() => handleDisplayChangeCategoryModal(item)}
              />
            ))}
        </AnimatePresence>
        {orderedCheckedItems.length === 0 && orderedUncheckedItems.length === 0 && (
          <Text c="gray" mt="md" w="100%" ta="center">
            Your list is empty
          </Text>
        )}
      </Flex>
      <AddItemModal open={displayAddItemModal} onClose={() => setDisplayAddItemModal(false)} />
      <SortItemsModal
        open={displaySortItemsModal}
        onClose={() => setDisplaySortItemsModal(false)}
      />
      <ItemDrawer
        open={displayItemDrawer}
        onClose={() => setDisplayItemDrawer(false)}
        item={selectedItem}
        onChange={updateItem}
      />
      <ChangeCategoryModal
        open={displayChangeCategoryModal}
        onClose={() => setDisplayChangeCategoryModal(false)}
        item={selectedItem}
        onChange={handleUpdateSelectedItemCategory}
      />
    </>
  );
};

export default ShoppingListPage;
