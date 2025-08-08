import React from 'react';
import { IconCheck, IconX } from '@tabler/icons-react';
import { ActionIcon, Box, Button, Divider, Drawer, Flex, Text } from '@mantine/core';

interface ConfirmationDrawerProps {
  title: string;
  message: string;
  open: boolean;
  onConfirm: () => void;
  onCancel?: () => void;
  onClose: () => void;
}

const ConfirmationDrawer: React.FC<ConfirmationDrawerProps> = ({
  title,
  message,
  open,
  onConfirm,
  onCancel,
  onClose,
}) => {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  const handleCancel = () => {
    onCancel?.();
    onClose();
  };

  return (
    <Drawer.Root opened={open} onClose={onClose} position="bottom" radius="1rem 1rem 0 0">
      <Drawer.Overlay onClick={onClose} />
      <Drawer.Content h="auto">
        <Drawer.Body p={0}>
          <Flex align="center" gap="sm" p="md">
            <ActionIcon color="gray" size="lg" variant="subtle" onClick={onClose}>
              <IconX size={24} />
            </ActionIcon>
            <Text c="gray" size="lg">
              {title}
            </Text>
          </Flex>
          <Divider />
          <Box p="md">
            <Text size="lg" c="gray" mb="lg">
              {message}
            </Text>
            <Flex gap="xs">
              <Button
                variant="outline"
                color="red"
                rightSection={<IconX size={16} />}
                onClick={handleCancel}
                fullWidth
              >
                Cancel
              </Button>
              <Button
                variant="outline"
                rightSection={<IconCheck size={16} />}
                onClick={handleConfirm}
                fullWidth
              >
                Confirm
              </Button>
            </Flex>
          </Box>
        </Drawer.Body>
      </Drawer.Content>
    </Drawer.Root>
  );
};

export default ConfirmationDrawer;
