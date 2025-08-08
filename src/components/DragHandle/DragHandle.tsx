import React from 'react';
import type { DraggableAttributes, DraggableSyntheticListeners } from '@dnd-kit/core';
import { IconGripVertical } from '@tabler/icons-react';
import { ActionIcon } from '@mantine/core';
import classes from './DragHandle.module.css';

interface DragHandleProps {
  attributes: DraggableAttributes;
  listeners: DraggableSyntheticListeners;
}

const DragHandle: React.FC<DragHandleProps> = ({ attributes, listeners }) => {
  return (
    <ActionIcon
      size="sm"
      color="gray"
      variant="subtle"
      className={classes.button}
      onClick={(e) => e.stopPropagation()}
      {...attributes}
      {...listeners}
    >
      <IconGripVertical size={16} />
    </ActionIcon>
  );
};

export default DragHandle;
