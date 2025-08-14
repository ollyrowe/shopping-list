import React from 'react';
import { IconDeviceDesktop, IconMoon, IconSun, IconX } from '@tabler/icons-react';
import { ActionIcon, Divider, Flex, Modal, Select, Text } from '@mantine/core';
import { ColorScheme, useTheme } from '@/components/ThemeProvider/ThemeProvider';
import packageJson from '../../../package.json';

interface SettingsModalProps {
  open: boolean;
  onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ open, onClose }) => {
  const { colorScheme, setColorScheme } = useTheme();

  const selectedThemeOption = themeOptions.find((option) => option.value === colorScheme);

  const handleChangeTheme = (value: string | null) => {
    if (value) {
      setColorScheme(value as ColorScheme);
    }
  };

  return (
    <Modal.Root opened={open} onClose={onClose} centered size="sm">
      <Modal.Overlay onClick={onClose} />
      <Modal.Content radius="md">
        <Modal.Header>
          <Flex w="100%" align="center">
            <Text c="gray" size="lg" fw="bold" flex="1 0 0">
              Settings
            </Text>
            <ActionIcon color="gray" variant="subtle" onClick={onClose}>
              <IconX size={20} />
            </ActionIcon>
          </Flex>
        </Modal.Header>
        <Divider />
        <Modal.Body p="md">
          <Flex align="center">
            <Text c="gray" flex="1 0 0">
              Theme
            </Text>
            <Select
              value={colorScheme}
              data={themeOptions}
              onChange={handleChangeTheme}
              leftSection={selectedThemeOption?.icon}
              radius="lg"
              w="8rem"
            />
          </Flex>
        </Modal.Body>
        <Divider />
        <Modal.Body p="md">
          <Text c="dimmed" ta="right" size="sm">
            v{packageJson.version}
          </Text>
        </Modal.Body>
      </Modal.Content>
    </Modal.Root>
  );
};

export default SettingsModal;

const themeOptions = [
  { value: ColorScheme.System, label: 'System', icon: <IconDeviceDesktop size={16} /> },
  { value: ColorScheme.Light, label: 'Light', icon: <IconSun size={16} /> },
  { value: ColorScheme.Dark, label: 'Dark', icon: <IconMoon size={16} /> },
];
