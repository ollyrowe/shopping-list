import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { IconGripVertical, IconSwitchHorizontal, IconToolsKitchen2 } from '@tabler/icons-react';
import { ActionIcon, Flex, Group, Paper, Text, ThemeIcon } from '@mantine/core';
import type { Recipe } from '@/types';

interface RecipeCardProps {
  recipe: Recipe;
  sortable?: boolean;
  onClick?: () => void;
  onChange?: () => void;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, sortable, onClick, onChange }) => {
  const { attributes, listeners, transform, transition, isDragging, setNodeRef } = useSortable({
    id: recipe.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 1 : undefined,
    borderLeft: '6px solid',
    borderColor: `var(--mantine-color-${recipe.color}-6)`,
    cursor: onClick ? 'pointer' : undefined,
  };

  const handleChangeRecipe = (event: React.MouseEvent) => {
    // Prevent click event from propagating to the paper's onClick handler
    event.stopPropagation();

    onChange?.();
  };

  return (
    <Paper
      ref={setNodeRef}
      onClick={onClick}
      style={style}
      shadow={isDragging ? 'md' : 'sm'}
      radius="md"
      p="sm"
      withBorder
    >
      <Group justify="space-between">
        <Flex gap="sm">
          <ThemeIcon variant="subtle" color={recipe.color} size="sm">
            <IconToolsKitchen2 size={16} />
          </ThemeIcon>
          <Text c="gray" fw="bold">
            {recipe.name}
          </Text>
        </Flex>
        {onChange && (
          <ActionIcon variant="subtle" color="gray" size="sm" onClick={handleChangeRecipe}>
            <IconSwitchHorizontal size={16} />
          </ActionIcon>
        )}
        {sortable && (
          <ActionIcon
            variant="subtle"
            color="gray"
            size="sm"
            {...attributes}
            {...listeners}
            onClick={(e) => e.stopPropagation()}
          >
            <IconGripVertical size={16} />
          </ActionIcon>
        )}
      </Group>
    </Paper>
  );
};

export default RecipeCard;
