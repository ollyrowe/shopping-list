import { motion, type TargetAndTransition } from 'framer-motion';
import {
  ActionIcon,
  Box,
  Checkbox,
  Divider,
  Flex,
  Text,
  useComputedColorScheme,
} from '@mantine/core';
import { uncategorisedItemIcon } from '@/services';
import type { Item } from '@/types';

interface ItemRecordProps {
  item: Item;
  isBeingCleared?: boolean;
  visible?: boolean;
  onClick?: () => void;
  onCheck?: () => void;
  onChangeCategory?: () => void;
}

const ItemRecord: React.FC<ItemRecordProps> = ({
  item,
  isBeingCleared = false,
  visible = true,
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

  const colorScheme = useComputedColorScheme();

  const checkedItemColor =
    colorScheme === 'light' ? 'var(--mantine-color-gray-0)' : 'var(--mantine-color-dark-8)';

  return (
    <motion.div
      initial={itemInitialAnimation}
      animate={isBeingCleared ? itemExitAnimation : itemEnterAnimation}
      exit={visible ? itemExitAnimation : undefined}
      layout
    >
      <Box>
        <Flex
          align="center"
          bg={item.checked ? checkedItemColor : 'var(--mantine-color-body)'}
          onClick={onClick}
        >
          <Checkbox.Card
            checked={!!item.checked}
            onChange={onCheck}
            onClick={(e) => e.stopPropagation()}
            bd="none"
            w="auto"
            p="md"
          >
            <Checkbox.Indicator radius="lg" color="green" />
          </Checkbox.Card>
          <Text c="gray" fw="bold" tt="lowercase" mr="auto">
            {item.name}
          </Text>
          {item.quantity > 1 && (
            <Text c="gray" size="sm" mr="md">
              {item.quantity}
              {item.unit}
            </Text>
          )}
          <ActionIcon variant="subtle" radius="xl" color="gray" onClick={handleChangeCategory}>
            {item.category ? item.category.icon : uncategorisedItemIcon}
          </ActionIcon>
        </Flex>
        <Divider />
      </Box>
    </motion.div>
  );
};

export default ItemRecord;

export const itemAnimationDurationSeconds = 0.3;

const itemInitialAnimation: TargetAndTransition = {
  opacity: 1,
  scale: 1,
  x: -100,
};

const itemExitAnimation: TargetAndTransition = {
  opacity: 0,
  scale: 0.8,
  x: -100,
  transition: {
    duration: itemAnimationDurationSeconds,
    ease: 'easeInOut',
  },
};

const itemEnterAnimation: TargetAndTransition = {
  opacity: 1,
  scale: 1,
  x: 0,
  transition: {
    duration: itemAnimationDurationSeconds,
    ease: 'easeInOut',
  },
};
