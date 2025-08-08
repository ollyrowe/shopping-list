import React from 'react';
import { IconMinus, IconPlus, IconTrash, IconX } from '@tabler/icons-react';
import { ActionIcon, Flex, Text } from '@mantine/core';

interface ItemRecordProps {
  name: string;
  quantity: number;
  onAdd: () => void;
  onRemove?: () => void;
}

const ItemRecord: React.FC<ItemRecordProps> = ({ name, quantity, onRemove, onAdd }) => {
  const handleRemoveItem = (e: React.MouseEvent) => {
    // Prevent the click from propagating to the parent element
    e.stopPropagation();

    onRemove?.();
  };

  return (
    <Flex px="md" py="sm" align="center" bg="var(--mantine-color-body)" onClick={onAdd}>
      <ActionIcon radius="lg" mr="md" color={quantity > 0 ? 'blue' : 'gray'}>
        <IconPlus />
      </ActionIcon>
      <Text c="gray" fw="bold" tt="lowercase">
        {name}
      </Text>
      <Flex ml="auto" align="center" gap="md">
        {quantity > 1 && <Text c="gray">{quantity}</Text>}
        <ActionIcon
          variant="subtle"
          color={quantity === 0 ? 'gray' : 'red'}
          onClick={handleRemoveItem}
        >
          {quantity === 0 ? (
            <IconTrash size={20} />
          ) : quantity > 1 ? (
            <IconMinus size={20} />
          ) : (
            <IconX size={20} />
          )}
        </ActionIcon>
      </Flex>
    </Flex>
  );
};

export default ItemRecord;
