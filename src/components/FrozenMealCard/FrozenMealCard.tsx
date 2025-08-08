import React from 'react';
import { IconSnowflake, IconSwitchHorizontal } from '@tabler/icons-react';
import { ActionIcon, Flex, Group, Paper, Text, ThemeIcon } from '@mantine/core';
import classes from './FrozenMealCard.module.css';

interface FrozenMealCardProps {
  onChange?: () => void;
}

const FrozenMealCard: React.FC<FrozenMealCardProps> = ({ onChange }) => {
  return (
    <Paper className={classes.card} shadow="sm" p="sm" radius="md" color="blue" withBorder>
      <Group justify="space-between">
        <Flex gap="sm">
          <ThemeIcon variant="subtle" color="blue" size="sm">
            <IconSnowflake size={16} />
          </ThemeIcon>
          <Text c="gray" fw="bold">
            Frozen
          </Text>
        </Flex>
        <ActionIcon variant="subtle" color="gray" size="sm" onClick={onChange}>
          <IconSwitchHorizontal size={16} />
        </ActionIcon>
      </Group>
    </Paper>
  );
};

export default FrozenMealCard;
