import React, { useEffect, useState } from 'react';
import { IconMinus, IconPlus, IconX } from '@tabler/icons-react';
import { ActionIcon, Badge, Box, Divider, Drawer, Flex, Text, TextInput } from '@mantine/core';
import ChangeCategoryModal from '@/components/ChangeCategoryModal';
import { uncategorisedItemIcon } from '@/services';
import type { Item } from '@/types';
import classes from './ItemDrawer.module.css';

interface ItemDrawerProps {
  item?: Item;
  open: boolean;
  onClose: () => void;
  onChange: (item: Item) => void;
}

const ItemDrawer: React.FC<ItemDrawerProps> = ({ open, onClose, onChange, item }) => {
  const [name, setName] = useState(item?.name || '');

  const [category, setCategory] = useState(item?.category);

  const [quantity, setQuantity] = useState(item?.quantity || 0);

  const [unit, setUnit] = useState(item?.unit);

  const [displayChangeCategoryModal, setDisplayChangeCategoryModal] = useState(false);

  const handleClose = () => {
    if (item && category) {
      onChange({ ...item, name, category, quantity, unit });
    }

    onClose();
  };

  const handleDisplayChangeCategoryModal = () => {
    setDisplayChangeCategoryModal(true);
  };

  useEffect(() => {
    setName(item?.name || '');
    setCategory(item?.category);
    setQuantity(item?.quantity || 0);
    setUnit(item?.unit);
  }, [item]);

  return (
    <>
      <Drawer.Root opened={open} onClose={handleClose} position="bottom" radius="lg">
        <Drawer.Overlay onClick={onClose} />
        <Drawer.Content h="auto">
          <Drawer.Body p={0}>
            <Flex align="center" p="md" gap="sm">
              <ActionIcon color="gray" radius="lg" size="lg" variant="subtle" onClick={handleClose}>
                <IconX size={24} />
              </ActionIcon>
              <TextInput
                value={name}
                onChange={(e) => setName(e.currentTarget.value)}
                flex="1 0 0"
                radius="md"
                size="lg"
              />
              <ActionIcon
                size="lg"
                radius="lg"
                color="gray"
                variant="subtle"
                onClick={handleDisplayChangeCategoryModal}
              >
                <Text size="xl">{category ? category.icon : uncategorisedItemIcon}</Text>
              </ActionIcon>
            </Flex>
            <Divider />
            <Box className={classes.inputContainer} p="md">
              <Text style={{ gridArea: 'quantity-label' }}>Quantity</Text>
              <TextInput
                type="number"
                radius="md"
                size="lg"
                min={0}
                max={999999}
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.currentTarget.value, 10))}
                style={{ gridArea: 'quantity-input' }}
              />
              <Text style={{ gridArea: 'unit-label' }}>Unit</Text>
              <TextInput
                size="lg"
                radius="md"
                value={unit}
                onChange={(e) => setUnit(e.currentTarget.value)}
                onFocus={(e) => e.target.select()}
                style={{ gridArea: 'unit-input' }}
              />
              <Flex gap="xs" style={{ gridArea: 'buttons' }} align="center">
                <ActionIcon
                  radius="lg"
                  size="lg"
                  onClick={() => setQuantity(quantity > 0 ? quantity - 1 : 0)}
                >
                  <IconMinus size={24} />
                </ActionIcon>
                <ActionIcon radius="lg" size="lg" onClick={() => setQuantity(quantity + 1)}>
                  <IconPlus size={24} />
                </ActionIcon>
              </Flex>
            </Box>
            <Divider />
            <Flex gap="md" p="md" mb="xl">
              <Text c="dimmed" tt="uppercase">
                Unit
              </Text>
              <Flex gap="4px">
                <UnitBadge unit="g" onSelect={setUnit} />
                <UnitBadge unit="kg" onSelect={setUnit} />
                <UnitBadge unit="ml" onSelect={setUnit} />
                <UnitBadge unit="l" onSelect={setUnit} />
              </Flex>
            </Flex>
          </Drawer.Body>
        </Drawer.Content>
      </Drawer.Root>
      <ChangeCategoryModal
        item={item}
        open={displayChangeCategoryModal}
        onClose={() => setDisplayChangeCategoryModal(false)}
        onChange={setCategory}
      />
    </>
  );
};

export default ItemDrawer;

interface UnitBadgeProps {
  unit: string;
  onSelect: (unit: string) => void;
}

const UnitBadge: React.FC<UnitBadgeProps> = ({ unit, onSelect }) => {
  return (
    <Badge size="lg" onClick={() => onSelect(unit)} className={classes.unitBadge}>
      <Text fw="bold" tt="lowercase">
        {unit}
      </Text>
    </Badge>
  );
};
