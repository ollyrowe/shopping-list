import React, { useEffect, useState } from 'react';
import {
  IconArrowBackUp,
  IconCheck,
  IconLink,
  IconPencil,
  IconPlus,
  IconToolsKitchen2,
  IconTrash,
  IconX,
} from '@tabler/icons-react';
import {
  ActionIcon,
  Anchor,
  Button,
  Divider,
  Flex,
  Modal,
  NumberInput,
  Table,
  Text,
  Textarea,
  TextInput,
  ThemeIcon,
} from '@mantine/core';
import ConfirmationDrawer from '@/components/ConfirmationDrawer';
import { useRecipes } from '@/providers/RecipeProvider';
import type { Ingredient } from '@/types';
import classes from './RecipeModal.module.css';

interface RecipeModalProps {
  recipeId?: string;
  mode?: RecipeModalMode;
  open: boolean;
  onClose: () => void;
}

const RecipeModal: React.FC<RecipeModalProps> = ({
  recipeId,
  mode: modeProp = defaultMode,
  open,
  onClose,
}) => {
  const { recipes, addRecipe, updateRecipe, deleteRecipe } = useRecipes();

  const [mode, setMode] = useState<RecipeModalMode>(modeProp);

  const [name, setName] = useState('');

  const [ingredients, setIngredients] = useState<Ingredient[]>([]);

  const [link, setLink] = useState('');

  const [notes, setNotes] = useState('');

  const [color, setColor] = useState(defaultColour);

  const [ingredientsMultiplier, setIngredientsMultiplier] = useState(ingredientsMultipliers[0]);

  // New ingredient to be added to the list of ingredients
  const [newIngredient, setNewIngredient] = useState<Ingredient>({ name: '', quantity: 1 });

  const [displayDeleteConfirmation, setDisplayDeleteConfirmation] = useState(false);

  // Fetch the recipe by ID from the list of recipes
  const recipe = recipes.find((recipe) => recipe.id === recipeId);

  const isRecipeValid = name.trim().length > 0;

  const handleEditRecipe = () => {
    setMode('edit');
  };

  const handleCreateRecipe = () => {
    if (isRecipeValid) {
      const newRecipe = {
        name,
        ingredients,
        color,
        link,
        notes,
      };

      addRecipe(newRecipe);

      onClose();
    }
  };

  const handleUpdateRecipe = () => {
    if (recipe && isRecipeValid) {
      const updatedRecipe = {
        ...recipe,
        name,
        ingredients,
        link,
        notes,
        color,
      };

      updateRecipe(updatedRecipe);

      setMode('view');
    }
  };

  const handleToggleIngredientsMultiplier = () => {
    const currentMultiplierIndex = ingredientsMultipliers.indexOf(ingredientsMultiplier);

    const nextIndex =
      currentMultiplierIndex < ingredientsMultipliers.length - 1 ? currentMultiplierIndex + 1 : 0;

    setIngredientsMultiplier(ingredientsMultipliers[nextIndex]);
  };

  const handleUpdateIngredient = (
    ingredientIndex: number,
    updatedIngredient: Partial<Ingredient>
  ) => {
    const updatedIngredients = ingredients.map((ingredient, index) =>
      ingredientIndex === index ? { ...ingredient, ...updatedIngredient } : ingredient
    );

    setIngredients(updatedIngredients);
  };

  const handleDeleteIngredient = (ingredientIndex: number) => {
    setIngredients(ingredients.filter((_, index) => index !== ingredientIndex));
  };

  const handleAddNewIngredient = () => {
    if (newIngredient.name) {
      setIngredients([
        ...ingredients,
        {
          name: newIngredient.name,
          quantity: newIngredient.quantity,
          unit: newIngredient.unit,
        },
      ]);

      setNewIngredient({ name: '', quantity: 1, unit: '' });
    }
  };

  const handleConfirmDeleteRecipe = () => {
    setDisplayDeleteConfirmation(true);
  };

  const handleDeleteRecipe = () => {
    if (recipe) {
      deleteRecipe(recipe);
      onClose();
    }
  };

  /**
   * Reset state upon opening the modal.
   */
  useEffect(() => {
    if (open) {
      if (mode === 'create') {
        setName('');
        setIngredients([]);
        setLink('');
        setNotes('');
        setColor(defaultColour);
      } else {
        setName(recipe?.name || '');
        setIngredients(recipe?.ingredients || []);
        setLink(recipe?.link || '');
        setNotes(recipe?.notes || '');
        setColor(recipe?.color || defaultColour);
        setIngredientsMultiplier(ingredientsMultipliers[0]);
      }
    }
  }, [open, mode]);

  /**
   * Reset the mode to the selected one upon opening the modal.
   */
  useEffect(() => {
    if (open) {
      setMode(modeProp || defaultMode);
    }
  }, [open, modeProp]);

  return (
    <>
      <Modal.Root opened={open && !displayDeleteConfirmation} onClose={onClose} centered>
        <Modal.Overlay onClick={onClose} />
        <Modal.Content
          className={classes.contents}
          style={{ borderColor: `var(--mantine-color-${color}-6)` }}
          radius="md"
        >
          <Modal.Header p={0}>
            <Flex gap="sm" w="100%" align="center" px="sm">
              <ThemeIcon variant="subtle" color={color} size="sm">
                <IconToolsKitchen2 size={20} />
              </ThemeIcon>
              {mode === 'view' ? (
                <>
                  <Text c="gray" size="lg" fw="bold" flex="1 0 0">
                    {recipe?.name}
                  </Text>
                  <ActionIcon color="gray" variant="subtle" onClick={handleEditRecipe}>
                    <IconPencil size={20} />
                  </ActionIcon>
                </>
              ) : (
                <TextInput
                  value={name}
                  onChange={(e) => setName(e.currentTarget.value)}
                  placeholder="Recipe name"
                  flex="1 0 0"
                />
              )}
              {mode === 'edit' ? (
                <ActionIcon color="gray" variant="subtle" onClick={() => setMode('view')}>
                  <IconArrowBackUp size={20} />
                </ActionIcon>
              ) : (
                <ActionIcon color="gray" variant="subtle" onClick={onClose}>
                  <IconX size={20} />
                </ActionIcon>
              )}
            </Flex>
          </Modal.Header>
          <Divider />
          <Modal.Body p="md">
            <Table withColumnBorders striped>
              <Table.Thead>
                {mode === 'view' ? (
                  ingredients.length > 0 ? (
                    <Table.Tr>
                      <Table.Th>Ingredient</Table.Th>
                      <Table.Th>x1</Table.Th>
                      <Table.Th>
                        <Button
                          variant="subtle"
                          justify="space-between"
                          onClick={handleToggleIngredientsMultiplier}
                          miw={55}
                          p={0}
                        >
                          x{ingredientsMultiplier}
                        </Button>
                      </Table.Th>
                    </Table.Tr>
                  ) : (
                    <Text c="gray">No ingredients</Text>
                  )
                ) : (
                  <Table.Tr>
                    <Table.Th>Ingredient</Table.Th>
                    <Table.Th>Quantity</Table.Th>
                    <Table.Th>Unit</Table.Th>
                  </Table.Tr>
                )}
              </Table.Thead>
              <Table.Tbody>
                {ingredients.map((ingredient, index) => (
                  // eslint-disable-next-line react-x/no-array-index-key
                  <Table.Tr key={index}>
                    <Table.Td>
                      {mode === 'view' ? (
                        ingredient.name
                      ) : (
                        <TextInput
                          value={ingredient.name}
                          onChange={(e) =>
                            handleUpdateIngredient(index, { name: e.currentTarget.value })
                          }
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              handleAddNewIngredient();
                            }
                          }}
                        />
                      )}
                    </Table.Td>
                    <Table.Td>
                      {mode === 'view' ? (
                        `${ingredient.quantity}${ingredient.unit || ''}`
                      ) : (
                        <NumberInput
                          value={ingredient.quantity}
                          onChange={(value) =>
                            handleUpdateIngredient(index, {
                              quantity: parseInt(value.toString(), 10) || 1,
                            })
                          }
                          min={1}
                        />
                      )}
                    </Table.Td>
                    {mode !== 'view' && (
                      <Table.Td>
                        <TextInput
                          value={ingredient.unit}
                          onChange={(e) =>
                            handleUpdateIngredient(index, { unit: e.currentTarget.value })
                          }
                        />
                      </Table.Td>
                    )}
                    {mode === 'view' ? (
                      <Table.Td>
                        {ingredient.quantity * ingredientsMultiplier}
                        {ingredient.unit}
                      </Table.Td>
                    ) : (
                      <Table.Td>
                        <ActionIcon
                          color="red"
                          variant="subtle"
                          onClick={() => handleDeleteIngredient(index)}
                        >
                          <IconTrash size={20} />
                        </ActionIcon>
                      </Table.Td>
                    )}
                  </Table.Tr>
                ))}
                {mode !== 'view' && (
                  <Table.Tr>
                    <Table.Td>
                      <TextInput
                        value={newIngredient.name}
                        onChange={(e) =>
                          setNewIngredient({ ...newIngredient, name: e.currentTarget.value })
                        }
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            handleAddNewIngredient();
                          }
                        }}
                      />
                    </Table.Td>
                    <Table.Td>
                      <NumberInput
                        value={newIngredient.quantity}
                        onChange={(value) =>
                          setNewIngredient({
                            ...newIngredient,
                            quantity: parseInt(value.toString(), 10) || 1,
                          })
                        }
                        min={1}
                      />
                    </Table.Td>
                    <Table.Td>
                      <TextInput
                        value={newIngredient.unit}
                        onChange={(e) =>
                          setNewIngredient({ ...newIngredient, unit: e.currentTarget.value })
                        }
                      />
                    </Table.Td>
                    <Table.Td>
                      <ActionIcon
                        onClick={handleAddNewIngredient}
                        disabled={!newIngredient.name}
                        variant="subtle"
                        radius="lg"
                      >
                        <IconPlus size={20} />
                      </ActionIcon>
                    </Table.Td>
                  </Table.Tr>
                )}
              </Table.Tbody>
            </Table>
          </Modal.Body>
          {(mode !== 'view' || (mode === 'view' && link)) && (
            <>
              <Divider />
              <Modal.Body p="md">
                <Flex gap="4px">
                  {mode === 'view' ? (
                    link && (
                      <Flex align="center" gap="xs">
                        <ThemeIcon variant="subtle" size="sm">
                          <IconLink size={20} />
                        </ThemeIcon>
                        <Anchor href={link}>Recipe link</Anchor>
                      </Flex>
                    )
                  ) : (
                    <TextInput
                      value={link}
                      onChange={(event) => setLink(event.currentTarget.value)}
                      leftSection={<IconLink size={16} />}
                      placeholder="Recipe link"
                      radius="md"
                      w="100%"
                    />
                  )}
                </Flex>
              </Modal.Body>
            </>
          )}
          {(mode !== 'view' || (mode === 'view' && notes)) && (
            <>
              <Divider />
              <Modal.Body p="md">
                <Flex gap="4px">
                  {mode === 'view' ? (
                    notes && <Text c="gray">{notes}</Text>
                  ) : (
                    <Textarea
                      value={notes}
                      onChange={(event) => setNotes(event.currentTarget.value)}
                      placeholder="Recipe notes"
                      radius="md"
                      w="100%"
                    />
                  )}
                </Flex>
              </Modal.Body>
            </>
          )}
          {mode !== 'view' && (
            <>
              <Divider />
              <Modal.Body p="md" style={{ overflow: 'auto' }}>
                <Flex gap="4px">
                  {colours.map((colorOption) => (
                    <ActionIcon
                      key={colorOption}
                      onClick={() => setColor(colorOption)}
                      bg={colorOption}
                      variant="subtle"
                      size="xs"
                      w="100%"
                      h="100%"
                      style={{ aspectRatio: '1 / 1' }}
                    >
                      {color === colorOption && <IconCheck size={16} color="white" />}
                    </ActionIcon>
                  ))}
                </Flex>
              </Modal.Body>
              <Divider />
              <Modal.Body
                p="md"
                bg="var(--mantine-color-body)"
                pos="sticky"
                bottom={0}
                style={{ zIndex: 1000 }}
              >
                <Flex gap="xs">
                  {mode === 'edit' && (
                    <Button
                      onClick={handleConfirmDeleteRecipe}
                      rightSection={<IconTrash size={16} />}
                      disabled={!isRecipeValid}
                      variant="outline"
                      color="red"
                      radius="md"
                      fullWidth
                    >
                      Delete
                    </Button>
                  )}
                  <Button
                    onClick={mode === 'create' ? handleCreateRecipe : handleUpdateRecipe}
                    disabled={!isRecipeValid}
                    rightSection={
                      mode === 'create' ? <IconPlus size={16} /> : <IconCheck size={16} />
                    }
                    variant="outline"
                    radius="md"
                    fullWidth
                  >
                    {mode === 'create' ? 'Create' : 'Save'}
                  </Button>
                </Flex>
              </Modal.Body>
            </>
          )}
        </Modal.Content>
      </Modal.Root>
      <ConfirmationDrawer
        title="Confirm Delete Recipe"
        message="Are you sure you want to permanently delete this recipe?"
        open={displayDeleteConfirmation}
        onClose={() => setDisplayDeleteConfirmation(false)}
        onConfirm={handleDeleteRecipe}
      />
    </>
  );
};

export default RecipeModal;

const defaultColour = 'blue';

const defaultMode: RecipeModalMode = 'view';

const colours = [
  'red',
  'pink',
  'grape',
  'violet',
  'indigo',
  'blue',
  'cyan',
  'teal',
  'green',
  'lime',
  'yellow',
  'orange',
];

const ingredientsMultipliers = [1.25, 1.5, 2, 4, 6, 8];

type RecipeModalMode = 'view' | 'edit' | 'create';
