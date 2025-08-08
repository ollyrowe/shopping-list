import { IconSearch, IconX } from '@tabler/icons-react';
import { ActionIcon, TextInput, type TextInputProps } from '@mantine/core';

interface SearchInputProps
  extends Omit<TextInputProps, 'onChange' | 'leftSection' | 'rightSection' | 'radius'> {
  ref?: React.Ref<HTMLInputElement>;
  onChange?: (value: string) => void;
}

const SearchInput: React.FC<SearchInputProps> = ({
  ref,
  onChange,
  placeholder = 'Search',
  ...props
}) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(event.currentTarget.value);
  };

  const handleClear = () => {
    onChange?.('');
  };

  return (
    <TextInput
      {...props}
      ref={ref}
      onChange={handleChange}
      placeholder={placeholder}
      leftSection={<IconSearch size={16} />}
      rightSection={
        <ActionIcon variant="subtle" radius="lg" onClick={handleClear}>
          <IconX size={16} />
        </ActionIcon>
      }
      radius="xl"
    />
  );
};

export default SearchInput;
