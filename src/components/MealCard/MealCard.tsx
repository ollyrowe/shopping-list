import React from 'react';
import { IconPlus } from '@tabler/icons-react';
import { Button, Flex, Text, ThemeIcon, Title } from '@mantine/core';
import FrozenMealCard from '@/components/FrozenMealCard';
import RecipeCard from '@/components/RecipeCard';
import { useMealPlans } from '@/providers/MealPlanProvider';
import { useRecipes } from '@/providers/RecipeProvider';
import type { DayOfWeek, Recipe } from '@/types';
import { DateUtils } from '@/utils';

interface MealCardProps {
  day: DayOfWeek;
  date: Date;
  onChange?: () => void;
  onDisplayRecipe?: (recipe: Recipe) => void;
}

const MealCard: React.FC<MealCardProps> = ({ day, date, onChange, onDisplayRecipe }) => {
  const { mealPlans } = useMealPlans();

  const { recipes } = useRecipes();

  // Find any existing meal plan for the specified date
  const mealPlan = mealPlans.find((mealPlan) => mealPlan.date === DateUtils.getIsoDateString(date));

  // If there's a meal plan for this date and it's a cooked meal, find the associated recipe
  const recipe = recipes.find(
    (recipe) => mealPlan?.meal.type === 'cooked' && recipe.id === mealPlan.meal.recipeId
  );

  const handleDisplayRecipe = () => {
    if (recipe) {
      onDisplayRecipe?.(recipe);
    }
  };

  return (
    <Flex direction="column" gap="xs">
      <Flex align="center">
        <Title order={5} c="gray">
          {day}
        </Title>
        <Text size="sm" c="gray" ml="auto">
          {DateUtils.getShortDateString(date)}
        </Text>
      </Flex>
      {!mealPlan?.meal ? (
        <Placeholder onClick={onChange} />
      ) : mealPlan.meal.type === 'cooked' ? (
        recipe && <RecipeCard recipe={recipe} onChange={onChange} onClick={handleDisplayRecipe} />
      ) : (
        <FrozenMealCard onChange={onChange} />
      )}
    </Flex>
  );
};

export default MealCard;

interface PlaceholderProps {
  onClick?: () => void;
}

const Placeholder: React.FC<PlaceholderProps> = ({ onClick }) => {
  return (
    <Button
      h="3.2rem"
      radius="md"
      color="gray"
      variant="outline"
      bd="2px dashed var(--mantine-color-default-border)"
      onClick={onClick}
      fullWidth
    >
      <ThemeIcon variant="subtle" c="var(--mantine-color-default-border)">
        <IconPlus />
      </ThemeIcon>
    </Button>
  );
};
