import React from 'react';
import { DndContext, type DragEndEvent } from '@dnd-kit/core';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { SortableContext } from '@dnd-kit/sortable';
import { Flex, Text, type MantineSpacing, type StyleProp } from '@mantine/core';
import RecipeCard from '@/components/RecipeCard';
import { useRecipes } from '@/providers/RecipeProvider';
import type { Recipe } from '@/types';

interface RecipesListProps {
  searchValue?: string;
  onSelectRecipe?: (recipe: Recipe) => void;
  sortable?: boolean;
  p?: StyleProp<MantineSpacing>;
}

const RecipesList: React.FC<RecipesListProps> = ({
  searchValue = '',
  onSelectRecipe,
  sortable,
  p,
}) => {
  const { recipes, reorderRecipe } = useRecipes();

  // Filter the recipes based on the search value
  const filteredRecipes = recipes.filter((recipe) =>
    recipe.name.toLowerCase().includes(searchValue.toLowerCase())
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      reorderRecipe(active.id.toString(), over.id.toString());
    }
  };

  return (
    <Flex h="100%" gap="md" direction="column" style={{ overflow: 'auto' }} p={p}>
      <DndContext modifiers={[restrictToVerticalAxis]} onDragEnd={handleDragEnd}>
        <SortableContext items={filteredRecipes.map((recipe) => recipe.id)}>
          {filteredRecipes.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              sortable={sortable}
              onClick={() => onSelectRecipe?.(recipe)}
            />
          ))}
          {filteredRecipes.length === 0 && (
            <Text c="gray" mt="md" w="100%" ta="center">
              No recipes found
            </Text>
          )}
        </SortableContext>
      </DndContext>
    </Flex>
  );
};

export default RecipesList;
