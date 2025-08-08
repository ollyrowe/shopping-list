import React, { useEffect, useState } from 'react';
import { DndContext, type DragEndEvent } from '@dnd-kit/core';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { SortableContext, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { IconArrowBackUp, IconGripVertical, IconX } from '@tabler/icons-react';
import {
  ActionIcon,
  Divider,
  Flex,
  Modal,
  Text,
  ThemeIcon,
  type MantineStyleProp,
} from '@mantine/core';
import { useShoppingList } from '@/providers/ShoppingListProvider';
import type { Category, Item } from '@/types';

interface SortItemsModalProps {
  open: boolean;
  onClose: () => void;
}

const SortItemsModal: React.FC<SortItemsModalProps> = ({ open, onClose }) => {
  const { shoppingList, categories, reorderItems, reorderCategories } = useShoppingList();

  const [visibleCategory, setVisibleCategory] = useState<Category>();

  const visibleCategoryItems = visibleCategory
    ? shoppingList.items.filter((item) => item.category?.id === visibleCategory.id)
    : [];

  // The IDs of items in the current view which can be sorted
  const sortableItemIds = visibleCategory
    ? visibleCategoryItems.map((item) => item.id)
    : categories.map((category) => category.id);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      if (visibleCategory) {
        reorderItems(active.id.toString(), over.id.toString());
      } else {
        reorderCategories(active.id.toString(), over.id.toString());
      }
    }
  };

  /**
   * Reset the visible category upon reopening the modal.
   */
  useEffect(() => {
    if (open) {
      setVisibleCategory(undefined);
    }
  }, [open]);

  return (
    <Modal.Root opened={open} onClose={onClose} fullScreen>
      <Modal.Overlay onClick={onClose} />
      <Modal.Content>
        <Modal.Header>
          <Flex gap="sm" w="100%" align="center">
            <Text c="gray" size="lg" fw="bold" flex="1 0 0">
              Sort {visibleCategory ? 'items' : 'categories'}
            </Text>
            <ActionIcon color="gray" mr="xs" variant="subtle" onClick={onClose}>
              <IconX size={20} />
            </ActionIcon>
          </Flex>
        </Modal.Header>
        <Divider />
        <Modal.Body p={0}>
          <DndContext modifiers={[restrictToVerticalAxis]} onDragEnd={handleDragEnd}>
            <SortableContext items={sortableItemIds}>
              {visibleCategory ? (
                <>
                  <Flex align="center" p="md" h="100%">
                    <ThemeIcon variant="subtle" mr="xs" size="lg">
                      {visibleCategory.icon}
                    </ThemeIcon>
                    <Text c="gray" tt="lowercase" fw="bold" size="lg">
                      {visibleCategory.name}
                    </Text>
                    <ActionIcon
                      color="gray"
                      variant="subtle"
                      ml="auto"
                      onClick={() => setVisibleCategory(undefined)}
                    >
                      <IconArrowBackUp size={20} />
                    </ActionIcon>
                  </Flex>
                  <Divider />
                  <Flex direction="column">
                    {visibleCategoryItems.map((item) => (
                      <ItemRecord key={item.id} item={item} />
                    ))}
                    {visibleCategoryItems.length === 0 && (
                      <Text c="gray" mt="md" w="100%" ta="center">
                        No items in this category
                      </Text>
                    )}
                  </Flex>
                </>
              ) : (
                <>
                  {categories.map((category) => (
                    <CategoryRecord
                      key={category.id}
                      category={category}
                      onClick={() => setVisibleCategory(category)}
                    />
                  ))}
                  {categories.length === 0 && (
                    <Text c="gray" mt="md" w="100%" ta="center">
                      No categories found
                    </Text>
                  )}
                </>
              )}
            </SortableContext>
          </DndContext>
        </Modal.Body>
      </Modal.Content>
    </Modal.Root>
  );
};

export default SortItemsModal;

interface ItemRecordProps {
  item: Item;
}

const ItemRecord: React.FC<ItemRecordProps> = ({ item }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: item.id,
  });

  const style: MantineStyleProp = {
    transition,
    transform: CSS.Transform.toString(transform),
    zIndex: isDragging ? 10000 : undefined,
  };

  return (
    <Flex
      ref={setNodeRef}
      px="md"
      py="sm"
      align="center"
      bg="var(--mantine-color-body)"
      bd="1px solid var(--mantine-color-gray-3)"
      my="-1px"
      style={style}
    >
      <Text c="gray" fw="bold" tt="lowercase" mr="auto">
        {item.name}
      </Text>
      <ActionIcon
        variant="subtle"
        color="gray"
        {...attributes}
        {...listeners}
        onClick={(e) => e.stopPropagation()}
      >
        <IconGripVertical size={16} />
      </ActionIcon>
    </Flex>
  );
};

interface CategoryRecordProps {
  category: Category;
  onClick: () => void;
}

const CategoryRecord: React.FC<CategoryRecordProps> = ({ category, onClick }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: category.id,
  });

  const style: MantineStyleProp = {
    transition,
    cursor: 'pointer',
    position: 'relative',
    transform: CSS.Transform.toString(transform),
    zIndex: isDragging ? 10000 : undefined,
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClick();
  };

  return (
    <Flex
      p="sm"
      gap="sm"
      align="center"
      ref={setNodeRef}
      onClick={handleClick}
      bg="var(--mantine-color-body)"
      bd="1px solid var(--mantine-color-default-border)"
      my="-1px"
      style={style}
    >
      <ThemeIcon variant="subtle">{category.icon}</ThemeIcon>
      <Text c="gray" tt="lowercase" fw="bold" flex="1 0 0">
        {category.name}
      </Text>
      <ActionIcon variant="subtle" color="gray" {...attributes} {...listeners}>
        <IconGripVertical size={16} />
      </ActionIcon>
    </Flex>
  );
};
