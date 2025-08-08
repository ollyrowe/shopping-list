import { useState } from 'react';
import { IconPlus } from '@tabler/icons-react';
import { Box, Button, Progress } from '@mantine/core';
import RecipeModal from '@/components/RecipeModal';
import RecipesList from '@/components/RecipesList';
import SearchInput from '@/components/SearchInput';
import type { Recipe } from '@/types';

const RecipesPage: React.FC = () => {
  const [searchValue, setSearchValue] = useState('');

  const [visibleRecipe, setVisibleRecipe] = useState<Recipe>();

  const [displayCreateRecipeModal, setDisplayCreateRecipeModal] = useState(false);

  return (
    <>
      <Box w="100%" px="sm" pb="sm">
        <SearchInput value={searchValue} onChange={setSearchValue} mb="sm" />
        <Button
          variant="outline"
          justify="space-between"
          rightSection={<IconPlus size={16} />}
          onClick={() => setDisplayCreateRecipeModal(true)}
          px="xs"
          fullWidth
        >
          Add recipe
        </Button>
      </Box>
      <Progress value={0} radius="none" h="4px" />
      <RecipesList searchValue={searchValue} onSelectRecipe={setVisibleRecipe} p="md" sortable />
      <RecipeModal
        recipeId={visibleRecipe?.id}
        open={!!visibleRecipe}
        onClose={() => setVisibleRecipe(undefined)}
      />
      <RecipeModal
        mode="create"
        open={displayCreateRecipeModal}
        onClose={() => setDisplayCreateRecipeModal(false)}
      />
    </>
  );
};

export default RecipesPage;
