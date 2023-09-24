import {
  View, Select as SelectPicker, CheckIcon, Icon,
} from 'native-base';
import { useMemo } from 'react';
import { useController } from 'react-hook-form';

import { MaterialIcons } from '@expo/vector-icons';
import InputError from './InputError';

const { Item } = SelectPicker;

/**
 * Select Component
 * @param {object} props
 * @param {string} [props.defaultValue='']
 * @param {string} props.name
 * @param {string} props.placeholder
 * @param {boolean} props.isDisabled
 * @param {{label: string, value: string}[]} props.options
 * @returns {React.ReactElement}
 */
export default function Select({
  defaultValue = '',
  name,
  control,
  rules,
  options,
  placeholder,
  isDisabled,
  ...props
}) {
  // use controller to handle form validation
  const {
    field: {
      onChange, ref, value,
    },
    fieldState: {
      error, isDirty, isTouched,
    },
  } = useController({
    name,
    control,
    rules,
    defaultValue,
  });

  const Options = useMemo(() => {
    if (options && options?.length) {
      return options.map((
        { label, value: optionValue },
      ) => <Item key={optionValue} label={label} value={optionValue} />);
    }
    return null;
  }, [options]);

  // prevent break when control is not passed
  if (!control) {
    return null;
  }

  return (
    <View marginBottom={4}>
      <SelectPicker
        ref={ref}
        placeholder={placeholder}
        size="2xl"
        selectedValue={value}
        accessibilityLabel={placeholder}
        _selectedItem={{
          bg: 'white',
          endIcon: <CheckIcon size="5" />,
        }}
        dropdownIcon={<Icon as={<MaterialIcons name="arrow-drop-down-circle" />} color="dark" size={8} marginRight={2} />}
        onValueChange={onChange}
        fontSize={16}
        height={60}
          // color="grey"
        borderColor="grey"
        borderRadius={10}
        isDisabled={isDisabled}
        {...props}
      >
        {Options}
      </SelectPicker>
      <InputError
        error={error}
        isDirty={isDirty}
        isTouched={isTouched}
      />
    </View>
  );
}
