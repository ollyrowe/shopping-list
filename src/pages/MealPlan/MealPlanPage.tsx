import { useState } from 'react';
import { IconChevronLeft, IconChevronRight, IconTags } from '@tabler/icons-react';
import { ActionIcon, Box, Button, Flex, Group, Progress, Text } from '@mantine/core';
import MealCard from '@/components/MealCard';
import MealSelectionDrawer from '@/components/MealSelectionDrawer';
import RecipeModal from '@/components/RecipeModal';
import type { Recipe } from '@/types';
import { DateUtils } from '@/utils';

const MealPlanPage: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date>();

  const [visibleRecipe, setVisibleRecipe] = useState<Recipe>();

  // Offset used to indicate previous or future weeks (negative for previous, positive for future)
  const [visibleWeekOffset, setVisibleWeekOffset] = useState(0);

  return (
    <>
      <Box px="sm" pb="sm">
        <Group
          justify="space-between"
          bd="1px var(--mantine-color-default-border) solid"
          bdrs="lg"
          mb="sm"
          w="100%"
        >
          <ActionIcon
            variant="subtle"
            color="gray"
            size="lg"
            radius="lg"
            onClick={() => setVisibleWeekOffset(visibleWeekOffset - 1)}
          >
            <IconChevronLeft size={16} />
          </ActionIcon>
          <Text size="sm" c="gray">
            {DateUtils.getWeekAlias(visibleWeekOffset)}
          </Text>
          <ActionIcon
            variant="subtle"
            color="gray"
            size="lg"
            radius="lg"
            onClick={() => setVisibleWeekOffset(visibleWeekOffset + 1)}
          >
            <IconChevronRight size={16} />
          </ActionIcon>
        </Group>
        <Button
          variant="outline"
          justify="space-between"
          rightSection={<IconTags size={16} />}
          px="xs"
          fullWidth
          disabled
        >
          Frozen meals
        </Button>
      </Box>
      <Progress value={0} radius="none" h="4px" />
      <Flex direction="column" px="md" py="sm" gap="xs" style={{ overflow: 'auto' }}>
        {DateUtils.getDaysInWeek(visibleWeekOffset).map(({ day, date }) => (
          <MealCard
            key={day}
            day={day}
            date={date}
            onDisplayRecipe={setVisibleRecipe}
            onChange={() => setSelectedDate(date)}
          />
        ))}
      </Flex>
      <MealSelectionDrawer
        open={!!selectedDate}
        onClose={() => setSelectedDate(undefined)}
        date={selectedDate}
      />
      <RecipeModal
        open={!!visibleRecipe}
        onClose={() => setVisibleRecipe(undefined)}
        recipeId={visibleRecipe?.id}
      />
    </>
  );
};

export default MealPlanPage;
