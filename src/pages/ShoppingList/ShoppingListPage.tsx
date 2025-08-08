import React, { useState } from 'react';
import { IconPlus, IconSearch, IconSortAscendingShapes } from '@tabler/icons-react';
import {
  ActionIcon,
  Box,
  Button,
  Checkbox,
  Divider,
  Flex,
  Progress,
  Text,
  TextInput,
} from '@mantine/core';
import AddItemModal from '@/components/AddItemModal';
import ChangeCategoryModal from '@/components/ChangeCategoryModal';
import ItemDrawer from '@/components/ItemDrawer';
import SortItemsModal from '@/components/SortItemsModal';
import { useShoppingList } from '@/providers/ShoppingListProvider';
import { uncategorisedItemIcon } from '@/services';
import { type Category, type Item } from '@/types';

const ShoppingListPage: React.FC = () => {
  const { shoppingList, categories, updateItem } = useShoppingList();

  const [displayAddItemModal, setDisplayAddItemModal] = useState(false);

  const [displaySortItemsModal, setDisplaySortItemsModal] = useState(false);

  const [selectedItem, setSelectedItem] = useState<Item>();

  const [displayItemDrawer, setDisplayItemDrawer] = useState(false);

  const [displayChangeCategoryModal, setDisplayChangeCategoryModal] = useState(false);

  const handleDisplayItemDrawer = (item: Item) => {
    setSelectedItem(item);
    setDisplayItemDrawer(true);
  };

  const handleDisplayChangeCategoryModal = (item: Item) => {
    setSelectedItem(item);
    setDisplayChangeCategoryModal(true);
  };

  const handleCheckItem = (item: Item) => {
    updateItem({ ...item, checked: !item.checked });
  };

  const handleUpdateSelectedItemCategory = (category: Category) => {
    if (selectedItem) {
      updateItem({ ...selectedItem, category });
    }
  };

  // Filter all items for those which have a quantity of at least 1
  const itemsOnList = shoppingList.items.filter((item) => item.quantity > 0);

  // Sort the items by the order of categories, and then retain order of item within list
  const orderedItems = itemsOnList.sort((a, b) => {
    const categoryAIndex = a.category ? categories.findIndex((c) => c.id === a.category?.id) : -1;
    const categoryBIndex = b.category ? categories.findIndex((c) => c.id === b.category?.id) : -1;

    if (categoryAIndex !== categoryBIndex) {
      return categoryAIndex - categoryBIndex;
    }

    return 1;
  });

  // The progress of the total number of items checked off the list
  const progress = (itemsOnList.filter((item) => item.checked).length / itemsOnList.length) * 100;

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
          Sort items
        </Button>
      </Box>
      <Progress value={progress} transitionDuration={400} color="green" radius="none" h="4px" />
      <Flex direction="column" h="100%" style={{ overflow: 'auto' }}>
        {orderedItems.map((item) => (
          <ItemRecord
            key={item.id}
            name={item.name}
            quantity={item.quantity}
            unit={item.unit}
            checked={item.checked}
            icon={item.category ? item.category.icon : uncategorisedItemIcon}
            onClick={() => handleDisplayItemDrawer(item)}
            onCheck={() => handleCheckItem(item)}
            onChangeCategory={() => handleDisplayChangeCategoryModal(item)}
          />
        ))}
        {orderedItems.length === 0 && (
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

interface ItemRecordProps {
  name: string;
  quantity: number;
  unit?: string;
  checked?: boolean;
  icon: string;
  onClick?: () => void;
  onCheck?: () => void;
  onChangeCategory?: () => void;
}

const ItemRecord: React.FC<ItemRecordProps> = ({
  name,
  quantity,
  unit,
  icon,
  checked,
  onClick,
  onCheck,
  onChangeCategory,
}) => {
  const handleChangeCategory = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (onChangeCategory) {
      onChangeCategory();
    }
  };

  return (
    <Box>
      <Flex px="md" py="sm" align="center" bg="var(--mantine-color-body)" onClick={onClick}>
        <Checkbox
          radius="lg"
          mr="md"
          color="green"
          checked={!!checked}
          onChange={onCheck}
          onClick={(e) => e.stopPropagation()}
        />
        <Text c="gray" fw="bold" tt="lowercase" mr="auto">
          {name}
        </Text>
        {quantity > 1 && (
          <Text c="gray" size="sm" mr="md">
            {quantity}
            {unit}
          </Text>
        )}
        <ActionIcon variant="subtle" radius="xl" color="gray" onClick={handleChangeCategory}>
          {icon}
        </ActionIcon>
      </Flex>
      <Divider />
    </Box>
  );
};
