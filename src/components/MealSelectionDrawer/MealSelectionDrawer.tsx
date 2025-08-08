import React, { useEffect, useState } from 'react';
import {
  IconArrowLeft,
  IconSnowflake,
  IconToolsKitchen2,
  IconTrash,
  IconX,
} from '@tabler/icons-react';
import { ActionIcon, Button, Divider, Drawer, Flex, Text } from '@mantine/core';
import RecipesList from '@/components/RecipesList';
import SearchInput from '@/components/SearchInput';
import { useMealPlans } from '@/providers/MealPlanProvider';
import type { Recipe } from '@/types';
import { DateUtils } from '@/utils';

interface MealSelectionDrawerProps {
  open: boolean;
  date?: Date;
  onClose: () => void;
}

const MealSelectionDrawer: React.FC<MealSelectionDrawerProps> = ({ open, date, onClose }) => {
  const { mealPlans, createMealPlan, deleteMealPlan } = useMealPlans();

  const [displayRecipes, setDisplayRecipes] = useState(false);

  const [recipeSearchValue, setRecipeSearchValue] = useState('');

  // Find the meal plan already selected for the specified date, if one exists
  const mealPlan = date
    ? mealPlans.find((mealPlan) => mealPlan.date === DateUtils.getIsoDateString(date))
    : undefined;

  const handleSelectFrozenMeal = () => {
    if (date) {
      createMealPlan({ date: DateUtils.getIsoDateString(date), meal: { type: 'frozen' } });
    }

    onClose();
  };

  const handleSelectCookedMeal = () => {
    setDisplayRecipes(true);
  };

  const selectCookedMeal = (recipe: Recipe) => {
    if (date) {
      createMealPlan({
        date: DateUtils.getIsoDateString(date),
        meal: { type: 'cooked', recipeId: recipe.id },
      });
    }

    onClose();
  };

  const handleGoBack = () => {
    if (displayRecipes) {
      setDisplayRecipes(false);
    } else {
      onClose();
    }
  };

  const handleRemoveMeal = () => {
    if (mealPlan) {
      deleteMealPlan(mealPlan);
    }

    onClose();
  };

  /**
   * Reset the view upon reopening the drawer.
   */
  useEffect(() => {
    if (open) {
      setDisplayRecipes(false);
    }
  }, [open]);

  return (
    <Drawer.Root opened={open} onClose={onClose} position="bottom" radius="1rem 1rem 0 0">
      <Drawer.Overlay onClick={onClose} />
      <Drawer.Content h="auto">
        <Drawer.Body p={0} h="25rem">
          <Flex direction="column" h="100%">
            <Flex align="center" p="md">
              <ActionIcon color="gray" mr="xs" variant="subtle" onClick={handleGoBack}>
                {displayRecipes ? <IconArrowLeft size={20} /> : <IconX size={20} />}
              </ActionIcon>
              {date && (
                <Text size="lg" c="gray" fw="bold">
                  {DateUtils.getDayOfWeek(date)}'s Meal
                </Text>
              )}
              {mealPlan && (
                <ActionIcon color="gray" ml="auto" variant="subtle" onClick={handleRemoveMeal}>
                  <IconTrash size={20} />
                </ActionIcon>
              )}
            </Flex>
            {displayRecipes ? (
              <>
                <SearchInput
                  value={recipeSearchValue}
                  onChange={setRecipeSearchValue}
                  pb="md"
                  px="md"
                />
                <Divider />
                <RecipesList
                  searchValue={recipeSearchValue}
                  onSelectRecipe={selectCookedMeal}
                  p="md"
                />
              </>
            ) : (
              <Flex direction="column" align="center" flex="1 0 0" gap="lg" px="md" pb="md">
                <MealTypeSelectionButton
                  label="Frozen"
                  color="blue"
                  icon={<IconSnowflake size={24} />}
                  onClick={handleSelectFrozenMeal}
                />
                <MealTypeSelectionButton
                  label="Cooked"
                  color="orange"
                  icon={<IconToolsKitchen2 size={24} />}
                  onClick={handleSelectCookedMeal}
                />
              </Flex>
            )}
          </Flex>
        </Drawer.Body>
      </Drawer.Content>
    </Drawer.Root>
  );
};

export default MealSelectionDrawer;

interface MealTypeSelectionButtonProps {
  label: string;
  icon: React.ReactNode;
  color: string;
  onClick: () => void;
}

const MealTypeSelectionButton: React.FC<MealTypeSelectionButtonProps> = ({
  label,
  icon,
  color,
  onClick,
}) => {
  return (
    <Button
      color={color}
      onClick={onClick}
      p="lg"
      size="xl"
      bdrs="md"
      bd="dashed"
      flex="1 0 0"
      variant="outline"
      fullWidth
    >
      <Flex direction="column" align="center" p="md" gap="xs">
        {icon}
        <Text fw="bold">{label}</Text>
      </Flex>
    </Button>
  );
};
