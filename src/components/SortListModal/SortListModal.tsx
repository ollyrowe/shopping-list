import React, { useEffect, useState } from 'react';
import { DndContext, DragOverlay, type DragEndEvent, type DragStartEvent } from '@dnd-kit/core';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { SortableContext, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { IconArrowBackUp, IconSortAscendingShapes, IconX } from '@tabler/icons-react';
import {
  ActionIcon,
  Divider,
  Flex,
  Modal,
  Text,
  ThemeIcon,
  type MantineStyleProp,
} from '@mantine/core';
import DragHandle from '@/components/DragHandle';
import { useShoppingList } from '@/providers/ShoppingListProvider';
import type { Category, Item } from '@/types';

interface SortListModalProps {
  open: boolean;
  onClose: () => void;
}

const SortListModal: React.FC<SortListModalProps> = ({ open, onClose }) => {
  const { shoppingList, categories, reorderItems, reorderCategories } = useShoppingList();

  const [visibleCategory, setVisibleCategory] = useState<Category>();

  const visibleCategoryItems = visibleCategory
    ? shoppingList.items.filter((item) => item.category?.id === visibleCategory.id)
    : [];

  // The IDs of items in the current view which can be sorted
  const sortableItemIds = visibleCategory
    ? visibleCategoryItems.map((item) => item.id)
    : categories.map((category) => category.id);

  const [itemBeingDragged, setItemBeingDragged] = useState<Item>();

  const [categoryBeingDragged, setCategoryBeingDragged] = useState<Category>();

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;

    if (visibleCategory) {
      const item = visibleCategoryItems.find((item) => item.id === active.id.toString());

      if (item) {
        setItemBeingDragged(item);
      }
    } else {
      const category = categories.find((category) => category.id === active.id.toString());

      if (category) {
        setCategoryBeingDragged(category);
      }
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      if (visibleCategory) {
        reorderItems(active.id.toString(), over.id.toString());
      } else {
        reorderCategories(active.id.toString(), over.id.toString());
      }
    }

    setItemBeingDragged(undefined);
    setCategoryBeingDragged(undefined);
  };

  const handleDragCancel = () => {
    setItemBeingDragged(undefined);
    setCategoryBeingDragged(undefined);
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
              Sort list
            </Text>
            <ActionIcon color="gray" mr="xs" variant="subtle" onClick={onClose}>
              <IconX size={20} />
            </ActionIcon>
          </Flex>
        </Modal.Header>
        <Divider />
        <Modal.Body p={0}>
          <DndContext
            modifiers={[restrictToVerticalAxis]}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDragCancel={handleDragCancel}
          >
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
                      onSortItems={() => setVisibleCategory(category)}
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
            <DragOverlay>
              {itemBeingDragged && <ItemRecord item={itemBeingDragged} overlay />}
              {categoryBeingDragged && <CategoryRecord category={categoryBeingDragged} overlay />}
            </DragOverlay>
          </DndContext>
        </Modal.Body>
      </Modal.Content>
    </Modal.Root>
  );
};

export default SortListModal;

interface ItemRecordProps {
  item: Item;
  overlay?: boolean;
}

const ItemRecord: React.FC<ItemRecordProps> = ({ item, overlay }) => {
  const { attributes, listeners, transform, transition, isDragging, setNodeRef } = useSortable({
    id: item.id,
  });

  const style: MantineStyleProp = {
    transition,
    transform: CSS.Transform.toString(transform),
    zIndex: overlay ? 10000 : undefined,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <Flex
      ref={setNodeRef}
      px="md"
      py="sm"
      align="center"
      bg="var(--mantine-color-body)"
      bd="1px solid var(--mantine-color-default-border)"
      my="-1px"
      style={style}
    >
      <Text c="gray" fw="bold" tt="lowercase" mr="auto">
        {item.name}
      </Text>
      <DragHandle attributes={attributes} listeners={listeners} />
    </Flex>
  );
};

interface CategoryRecordProps {
  category: Category;
  overlay?: boolean;
  onSortItems?: () => void;
}

const CategoryRecord: React.FC<CategoryRecordProps> = ({ category, overlay, onSortItems }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: category.id,
  });

  const style: MantineStyleProp = {
    transition,
    cursor: 'pointer',
    position: 'relative',
    transform: CSS.Transform.toString(transform),
    zIndex: overlay ? 10000 : undefined,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleSortItems = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSortItems?.();
  };

  return (
    <Flex
      p="sm"
      gap="sm"
      align="center"
      ref={setNodeRef}
      bg="var(--mantine-color-body)"
      bd="1px solid var(--mantine-color-default-border)"
      my="-1px"
      style={style}
    >
      <ThemeIcon variant="subtle">{category.icon}</ThemeIcon>
      <Text c="gray" tt="lowercase" fw="bold" flex="1 0 0">
        {category.name}
      </Text>
      <ActionIcon color="gray" variant="subtle" onClick={handleSortItems}>
        <IconSortAscendingShapes size={16} />
      </ActionIcon>
      <DragHandle attributes={attributes} listeners={listeners} />
    </Flex>
  );
};
