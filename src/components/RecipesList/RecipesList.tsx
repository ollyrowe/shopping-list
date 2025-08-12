import React, { useState } from 'react';
import { DndContext, DragOverlay, type DragEndEvent, type DragStartEvent } from '@dnd-kit/core';
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

  const [recipeBeingDragged, setRecipeBeingDragged] = useState<Recipe>();

  // Filter the recipes based on the search value
  const filteredRecipes = recipes.filter((recipe) =>
    recipe.name.toLowerCase().includes(searchValue.toLowerCase())
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;

    const recipe = filteredRecipes.find((recipe) => recipe.id === active.id.toString());

    if (recipe) {
      setRecipeBeingDragged(recipe);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      reorderRecipe(active.id.toString(), over.id.toString());
    }

    setRecipeBeingDragged(undefined);
  };

  const handleDragCancel = () => {
    setRecipeBeingDragged(undefined);
  };

  return (
    <Flex h="100%" gap="sm" direction="column" style={{ overflow: 'auto' }} p={p}>
      <DndContext
        modifiers={[restrictToVerticalAxis]}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
      >
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
        <DragOverlay>
          {recipeBeingDragged && (
            <RecipeCard recipe={recipeBeingDragged} sortable={sortable} overlay />
          )}
        </DragOverlay>
      </DndContext>
    </Flex>
  );
};

export default RecipesList;
