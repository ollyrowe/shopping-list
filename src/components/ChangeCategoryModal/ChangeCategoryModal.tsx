import React, { useEffect, useState } from 'react';
import { IconPencil, IconPlus, IconTrash, IconX } from '@tabler/icons-react';
import { ActionIcon, Button, Divider, Flex, Modal, Text, ThemeIcon } from '@mantine/core';
import CategoryModal, { type CategoryModalMode } from '@/components/CategoryModal';
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
  const { categories, deleteCategory } = useShoppingList();

  const [selectedCategory, setSelectedCategory] = useState<Category>();

  const [editingCategory, setEditingCategory] = useState<Category>();

  const [displayCategoryModal, setDisplayCategoryModal] = useState(false);

  const [categoryModalMode, setCategoryModalMode] = useState<CategoryModalMode>('create');

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

  const handleDeleteCategory = (event: React.MouseEvent, category: Category) => {
    event.stopPropagation();
    deleteCategory(category);
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
                    onClick={(event) => handleDeleteCategory(event, category)}
                    size="sm"
                    color="gray"
                  >
                    <IconTrash size={16} />
                  </ActionIcon>
                </Flex>
                <Divider />
              </React.Fragment>
            ))}
          </Flex>
        </Modal.Body>
      </Modal.Content>
      <CategoryModal
        mode={categoryModalMode}
        open={displayCategoryModal}
        onClose={() => setDisplayCategoryModal(false)}
        category={editingCategory}
      />
    </Modal.Root>
  );
};

export default ChangeCategoryModal;
