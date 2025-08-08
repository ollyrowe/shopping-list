import React, { useEffect, useState } from 'react';
import { IconPencil, IconPlus, IconTrash, IconX } from '@tabler/icons-react';
import {
  ActionIcon,
  Button,
  Divider,
  Flex,
  Modal,
  Text,
  ThemeIcon,
  useComputedColorScheme,
} from '@mantine/core';
import CategoryModal, { type CategoryModalMode } from '@/components/CategoryModal';
import ConfirmationDrawer from '@/components/ConfirmationDrawer';
import { useShoppingList } from '@/providers/ShoppingListProvider';
import { uncategorisedItemIcon } from '@/services';
import type { Category, Item } from '@/types';

interface ChangeCategoryModalProps {
  item?: Item;
  open: boolean;
  onClose: () => void;
  onChange?: (category: Category) => void;
}

const ChangeCategoryModal: React.FC<ChangeCategoryModalProps> = ({
  item,
  open,
  onClose,
  onChange,
}) => {
  const colorScheme = useComputedColorScheme();

  const { shoppingList, categories, deleteCategory } = useShoppingList();

  const [selectedCategory, setSelectedCategory] = useState<Category>();

  const [editingCategory, setEditingCategory] = useState<Category>();

  const [displayCategoryModal, setDisplayCategoryModal] = useState(false);

  const [categoryModalMode, setCategoryModalMode] = useState<CategoryModalMode>('create');

  const [categoryToDelete, setCategoryToDelete] = useState<Category>();

  const handleCreateCategory = () => {
    setCategoryModalMode('create');
    setDisplayCategoryModal(true);
  };

  const handleEditCategory = (event: React.MouseEvent, category: Category) => {
    event.stopPropagation();
    setCategoryModalMode('edit');
    setEditingCategory(category);
    setDisplayCategoryModal(true);
  };

  const handleConfirmDeleteCategory = (event: React.MouseEvent, category: Category) => {
    event.stopPropagation();
    setCategoryToDelete(category);
  };

  const handleDeleteCategory = () => {
    if (categoryToDelete) {
      deleteCategory(categoryToDelete);
    }
  };

  const handleClose = () => {
    if (onChange && selectedCategory) {
      onChange(selectedCategory);
    }

    onClose();
  };

  useEffect(() => {
    if (open) {
      setSelectedCategory(item?.category);
    }
  }, [item, open]);

  return (
    <>
      <Modal.Root opened={open} onClose={handleClose} fullScreen>
        <Modal.Overlay onClick={handleClose} />
        <Modal.Content>
          <Modal.Header>
            <Flex direction="column" w="100%" gap="sm">
              <Flex gap="sm" w="100%" align="center">
                <Text c="gray" size="lg" fw="bold" flex="1 0 0">
                  Change category
                </Text>
                <ActionIcon color="gray" variant="subtle" onClick={handleClose}>
                  <IconX size={20} />
                </ActionIcon>
              </Flex>
              <Button
                variant="outline"
                justify="space-between"
                rightSection={<IconPlus size={16} />}
                onClick={handleCreateCategory}
                fullWidth
              >
                Add category
              </Button>
            </Flex>
          </Modal.Header>
          <Divider mb="sm" />
          <Modal.Body>
            <Flex align="center">
              <Text c="gray" fw="bold" flex="1 0 0">
                {item?.name}
              </Text>
              <ThemeIcon variant="subtle" size="lg" radius="lg">
                <Text size="xl">
                  {selectedCategory ? selectedCategory.icon : uncategorisedItemIcon}
                </Text>
              </ThemeIcon>
            </Flex>
          </Modal.Body>
          <Divider />
          <Modal.Body p={0}>
            <Flex direction="column">
              {categories.map((category) => (
                <React.Fragment key={category.id}>
                  <Flex
                    px="md"
                    py="sm"
                    align="center"
                    gap="md"
                    onClick={() => setSelectedCategory(category)}
                    style={{
                      background:
                        selectedCategory?.id === category.id
                          ? colorScheme === 'light'
                            ? 'var(--mantine-color-blue-1)'
                            : 'var(--mantine-color-blue-9)'
                          : undefined,
                    }}
                  >
                    <Text>{category.icon}</Text>
                    <Text c="gray" fw="bold" tt="lowercase" mr="auto">
                      {category.name}
                    </Text>
                    <ActionIcon
                      variant="subtle"
                      onClick={(event) => handleEditCategory(event, category)}
                      size="sm"
                      color="gray"
                    >
                      <IconPencil size={16} />
                    </ActionIcon>
                    <ActionIcon
                      variant="subtle"
                      onClick={(event) => handleConfirmDeleteCategory(event, category)}
                      size="sm"
                      color="gray"
                      disabled={shoppingList.items.some(
                        (item) => item.category && item.category.id === category.id
                      )}
                    >
                      <IconTrash size={16} />
                    </ActionIcon>
                  </Flex>
                  <Divider />
                </React.Fragment>
              ))}
              {categories.length === 0 && (
                <Text c="gray" mt="md">
                  No categories found
                </Text>
              )}
            </Flex>
          </Modal.Body>
        </Modal.Content>
      </Modal.Root>
      <CategoryModal
        mode={categoryModalMode}
        open={displayCategoryModal}
        onClose={() => setDisplayCategoryModal(false)}
        category={editingCategory}
      />
      <ConfirmationDrawer
        title="Confirm Delete Category"
        message="Are you sure you want to permanently delete this category?"
        open={!!categoryToDelete}
        onClose={() => setCategoryToDelete(undefined)}
        onConfirm={handleDeleteCategory}
      />
    </>
  );
};

export default ChangeCategoryModal;
