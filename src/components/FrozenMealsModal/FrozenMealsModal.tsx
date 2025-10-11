import React from 'react';
import { IconLabelFilled, IconSnowflake, IconX } from '@tabler/icons-react';
import { ActionIcon, Divider, Flex, Modal, Text, ThemeIcon } from '@mantine/core';

interface FrozenMealsModalProps {
  open: boolean;
  onClose: () => void;
}

const FrozenMealsModal: React.FC<FrozenMealsModalProps> = ({ open, onClose }) => {
  return (
    <Modal.Root opened={open} onClose={onClose} centered>
      <Modal.Overlay onClick={onClose} />
      <Modal.Content radius="md">
        <Modal.Header p={0}>
          <Flex gap="sm" w="100%" align="center" px="sm">
            <ThemeIcon variant="subtle" color="blue" size="sm">
              <IconSnowflake size={20} />
            </ThemeIcon>
            <Text c="gray" size="lg" fw="bold" flex="1 0 0">
              Frozen Meals
            </Text>
            <ActionIcon color="gray" variant="subtle" onClick={onClose}>
              <IconX size={20} />
            </ActionIcon>
          </Flex>
        </Modal.Header>
        <Divider />
        <Modal.Body p="md">
          {getMonthColourKey().map((month) => (
            <Flex key={month.month} align="center" justify="space-between" py="xs">
              <Text c="gray" size="sm">
                {month.month}
              </Text>
              <ThemeIcon variant="subtle" color={month.colour} size="sm">
                <IconLabelFilled size={20} />
              </ThemeIcon>
            </Flex>
          ))}
        </Modal.Body>
      </Modal.Content>
    </Modal.Root>
  );
};

export default FrozenMealsModal;

const getMonthColourKey = () => {
  const months = getPastXMonths(monthColours.length);

  return months.reverse().map((month) => ({
    month: month.toLocaleString('default', { month: 'long' }),
    colour: monthColours.at(getMonthsSince(startDate, month) % monthColours.length),
  }));
};

const getMonthsSince = (startDate: Date, endDate: Date) => {
  const diff = endDate.getTime() - startDate.getTime();

  return Math.floor(diff / (1000 * 60 * 60 * 24 * 30));
};

const getPastXMonths = (numberOfMonths: number) => {
  const months = [];

  for (let i = 0; i < numberOfMonths; i++) {
    const month = new Date();
    month.setMonth(month.getMonth() - i);
    months.push(month);
  }

  return months;
};

const monthColours = ['pink', 'yellow', 'blue', 'orange', 'green'];

const startDate = new Date(2025, 6, 1);
