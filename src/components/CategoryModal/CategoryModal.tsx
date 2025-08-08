import React, { useEffect, useMemo, useState } from 'react';
import { IconX } from '@tabler/icons-react';
import { getEmojisByGroup } from 'unicode-emoji-utils';
import {
  ActionIcon,
  Button,
  Divider,
  Flex,
  Modal,
  Text,
  TextInput,
  ThemeIcon,
} from '@mantine/core';
import SearchInput from '@/components/SearchInput';
import { useShoppingList } from '@/providers/ShoppingListProvider';
import { uncategorisedItemIcon } from '@/services';
import type { Category } from '@/types';
import classes from './CategoryModal.module.css';

interface CategoryModalProps {
  mode: CategoryModalMode;
  category?: Category;
  open: boolean;
  onClose: () => void;
}

const CategoryModal: React.FC<CategoryModalProps> = ({ mode, category, open, onClose }) => {
  const { createCategory, updateCategory } = useShoppingList();

  const [name, setName] = useState(category?.name || '');

  const [icon, setIcon] = useState(category?.icon || uncategorisedItemIcon);

  const [iconSearchValue, setIconSearchValue] = useState('');

  const filteredEmojis = useMemo(() => {
    if (iconSearchValue.trim()) {
      return allEmojis.filter((emoji) =>
        emoji.toLowerCase().includes(iconSearchValue.toLowerCase())
      );
    }

    return allEmojis;
  }, [iconSearchValue]);

  const handleCreate = () => {
    if (name.trim()) {
      createCategory({ name: name.trim(), icon });
      onClose();
    }
  };

  const handleSave = () => {
    if (category && name.trim()) {
      updateCategory({ ...category, name: name.trim(), icon });
      onClose();
    }
  };

  /**
   * Reset the form when the modal opens or the category changes.
   */
  useEffect(() => {
    if (open) {
      if (mode === 'create') {
        setName('');
        setIcon(uncategorisedItemIcon);
        setIconSearchValue('');
      } else {
        setName(category?.name || '');
        setIcon(category?.icon || uncategorisedItemIcon);
        setIconSearchValue('');
      }
    }
  }, [category, open]);

  return (
    <Modal.Root opened={open} onClose={onClose} fullScreen>
      <Modal.Overlay onClick={onClose} />
      <Modal.Content w="100%" className={classes.contents}>
        <Modal.Header>
          <Flex gap="sm" w="100%" align="center">
            <Text c="gray" size="lg" fw="bold" flex="1 0 0">
              {mode === 'create' ? 'Create' : 'Edit'} category
            </Text>
            <ActionIcon color="gray" variant="subtle" onClick={onClose}>
              <IconX size={20} />
            </ActionIcon>
          </Flex>
        </Modal.Header>
        <Divider />
        <Modal.Body p="md">
          <Flex gap="sm" align="center">
            <TextInput
              value={name}
              onChange={(e) => setName(e.currentTarget.value)}
              placeholder="Name"
              flex="1 0 0"
            />
            <ThemeIcon variant="subtle">
              <Text size="xl">{icon}</Text>
            </ThemeIcon>
          </Flex>
        </Modal.Body>
        <Divider />
        <Modal.Body h="100%">
          <Flex className={classes.scrollContainer} direction="column" h="100%">
            <SearchInput
              value={iconSearchValue}
              onChange={setIconSearchValue}
              placeholder="Search icons"
              size="sm"
              mt="md"
              mb="sm"
            />
            <Flex className={classes.scrollContainer} gap="sm" wrap="wrap" flex="1 0 0">
              {filteredEmojis.map((emoji) => (
                <ActionIcon
                  key={emoji}
                  variant={icon === emoji ? 'outline' : 'subtle'}
                  onClick={() => setIcon(emoji)}
                  radius="lg"
                  size="lg"
                >
                  <Text size="xl">{emoji}</Text>
                </ActionIcon>
              ))}
              {filteredEmojis.length === 0 && (
                <Text size="sm" c="gray" mt="md" w="100%" ta="center">
                  No icons found
                </Text>
              )}
            </Flex>
            <Flex gap="sm" mt="md">
              <Button
                onClick={mode === 'create' ? handleCreate : handleSave}
                disabled={!name.trim() || !icon}
                fullWidth
              >
                {mode === 'create' ? 'Create' : 'Save'}
              </Button>
            </Flex>
          </Flex>
        </Modal.Body>
      </Modal.Content>
    </Modal.Root>
  );
};

export default CategoryModal;

export type CategoryModalMode = 'create' | 'edit';

const getAllEmojis = () => {
  const emojisByCategories = getEmojisByGroup('category');

  // Remove flags and symbols categories as they are not needed
  emojisByCategories.delete('flags');
  emojisByCategories.delete('symbols');

  const categories = Array.from(emojisByCategories);

  return categories.flatMap(([_, emojis]) => emojis.map(({ emoji }) => emoji));
};

const allEmojis = getAllEmojis();
