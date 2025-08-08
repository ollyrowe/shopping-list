import React, { useEffect, useRef, useState } from 'react';
import {
  IconArrowBackUp,
  IconArrowLeft,
  IconCategory,
  IconChevronRight,
  IconListCheck,
} from '@tabler/icons-react';
import { ActionIcon, Box, Button, Divider, Flex, Modal, Text, ThemeIcon } from '@mantine/core';
import ConfirmationDrawer from '@/components/ConfirmationDrawer';
import SearchInput from '@/components/SearchInput';
import { useShoppingList } from '@/providers/ShoppingListProvider';
import { uncategorisedItemIcon } from '@/services';
import type { Category, Item } from '@/types';
import ItemRecord from './ItemRecord';

interface AddItemModalProps {
  open: boolean;
  onClose: () => void;
}

const AddItemModal: React.FC<AddItemModalProps> = ({ open, onClose }) => {
  const { shoppingList, categories, addItem, updateItem, deleteItem } = useShoppingList();

  const searchInputRef = useRef<HTMLInputElement>(null);

  const [searchValue, setSearchValue] = useState('');

  // Whether to show all items or items grouped by category
  const [view, setView] = useState<View>('all');

  // The currently visible category when in category view (null for uncategorised items)
  const [visibleCategory, setVisibleCategory] = useState<Category | null>();

  const [itemToDelete, setItemToDelete] = useState<Item>();

  // Filter items based on search value and sort by quantity, with items with quantity first
  const filteredItems = shoppingList.items
    .filter((item) => item.name.toLowerCase().includes(searchValue.toLowerCase()))
    .sort((a, b) => {
      const aValue = a.quantity > 0;
      const bValue = b.quantity > 0;

      return aValue === bValue ? 0 : aValue ? -1 : 1;
    });

  const visibleCategoryItems = shoppingList.items.filter((item) =>
    visibleCategory === null ? !item.category : item.category?.id === visibleCategory?.id
  );

  // If the search value is not empty and there are no items with that name, show a new item record
  const displayAddNewItemRecord =
    searchValue.trim() &&
    !filteredItems.find((item) => item.name.toLowerCase() === searchValue.toLowerCase());

  const handleAddItem = (item: Item) => {
    updateItem({ ...item, quantity: item.quantity + 1 });
  };

  const handleRemoveItem = (item: Item) => {
    if (item.quantity > 0) {
      updateItem({ ...item, quantity: item.quantity - 1 });
    } else {
      setItemToDelete(item);
    }
  };

  const handleDeleteItem = () => {
    if (itemToDelete) {
      deleteItem(itemToDelete);
      setItemToDelete(undefined);
    }
  };

  const handleAutoFocusOnSearchInput = () => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };

  const handleClearSearch = () => {
    setSearchValue('');
  };

  /**
   * Reset the state when the modal opens.
   */
  useEffect(() => {
    if (open) {
      setVisibleCategory(undefined);
      setSearchValue('');
      setView('all');
    }
  }, [open]);

  /**
   * Reset the visible category when the view changes.
   */
  useEffect(() => {
    setVisibleCategory(undefined);
  }, [view]);

  return (
    <>
      <Modal.Root
        opened={open}
        onClose={onClose}
        onEnterTransitionEnd={handleAutoFocusOnSearchInput}
        onExitTransitionEnd={handleClearSearch}
        fullScreen
      >
        <Modal.Overlay onClick={onClose} />
        <Modal.Content>
          <Modal.Header p={0}>
            <Box w="100%">
              <Box p="md">
                <Flex align="center" mb="sm">
                  <ActionIcon color="gray" mr="xs" variant="subtle" onClick={onClose}>
                    <IconArrowLeft size={20} />
                  </ActionIcon>
                  <SearchInput
                    ref={searchInputRef}
                    value={searchValue}
                    onChange={setSearchValue}
                    flex="1 0 0"
                  />
                </Flex>
                <Button
                  variant="outline"
                  justify="space-between"
                  rightSection={
                    view === 'all' ? <IconCategory size={16} /> : <IconListCheck size={16} />
                  }
                  onClick={() => setView(view === 'all' ? 'categories' : 'all')}
                  fullWidth
                >
                  {view === 'all' ? 'Browse categories' : 'All items'}
                </Button>
              </Box>
              <Divider />
            </Box>
          </Modal.Header>
          <Modal.Body p={0}>
            {view === 'all' ? (
              <Box px="md">
                {displayAddNewItemRecord && (
                  <ItemRecord
                    name={searchValue}
                    quantity={0}
                    onAdd={() => addItem({ name: searchValue })}
                  />
                )}
                {filteredItems.map((item) => (
                  <ItemRecord
                    key={item.id}
                    name={item.name}
                    quantity={item.quantity}
                    onAdd={() => handleAddItem(item)}
                    onRemove={() => handleRemoveItem(item)}
                  />
                ))}
              </Box>
            ) : visibleCategory !== undefined ? (
              <>
                <Flex align="center" p="md">
                  <ThemeIcon variant="subtle" mr="xs">
                    <Text size="xl">
                      {visibleCategory ? visibleCategory.icon : uncategorisedItemIcon}
                    </Text>
                  </ThemeIcon>
                  <Text c="gray" fw="bold" tt="lowercase">
                    {visibleCategory ? visibleCategory.name : 'Uncategorised'}
                  </Text>
                  <ActionIcon
                    color="gray"
                    variant="subtle"
                    ml="auto"
                    onClick={() => setVisibleCategory(undefined)}
                  >
                    <IconArrowBackUp size={16} />
                  </ActionIcon>
                </Flex>
                <Divider />
                <Flex
                  direction="column"
                  align={visibleCategoryItems.length === 0 ? 'center' : undefined}
                  p="md"
                >
                  {visibleCategoryItems.map((item) => (
                    <ItemRecord
                      key={item.id}
                      name={item.name}
                      quantity={item.quantity}
                      onAdd={() => handleAddItem(item)}
                      onRemove={() => handleRemoveItem(item)}
                    />
                  ))}
                  {visibleCategoryItems.length === 0 && (
                    <Text c="gray" mt="md">
                      No items in this category
                    </Text>
                  )}
                </Flex>
              </>
            ) : (
              <Box px="md">
                {categories.map((category) => (
                  <CategoryRecord
                    key={category.id}
                    name={category.name}
                    icon={category.icon}
                    onClick={() => setVisibleCategory(category)}
                  />
                ))}
                <CategoryRecord
                  name="Uncategorised"
                  icon={uncategorisedItemIcon}
                  onClick={() => setVisibleCategory(null)}
                />
              </Box>
            )}
          </Modal.Body>
        </Modal.Content>
      </Modal.Root>
      <ConfirmationDrawer
        title="Confirm Delete Item"
        message="Are you sure you want to permanently delete this item?"
        open={!!itemToDelete}
        onClose={() => setItemToDelete(undefined)}
        onConfirm={handleDeleteItem}
      />
    </>
  );
};

export default AddItemModal;

interface CategoryRecordProps {
  name: string;
  icon: string;
  onClick: () => void;
}

const CategoryRecord: React.FC<CategoryRecordProps> = ({ name, icon, onClick }) => {
  return (
    <Flex px="md" py="sm" align="center" gap="md" onClick={onClick}>
      <Text>{icon}</Text>
      <Text c="gray" fw="bold" tt="lowercase" mr="auto">
        {name}
      </Text>
      <ActionIcon variant="subtle" size="sm" color="gray">
        <IconChevronRight size={16} />
      </ActionIcon>
    </Flex>
  );
};

type View = 'all' | 'categories';
