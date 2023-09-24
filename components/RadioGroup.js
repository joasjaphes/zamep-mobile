import { View, Radio, HStack } from 'native-base';
import { useController } from 'react-hook-form';

import InputError from './InputError';

/**
 * Input component wrapped in react-hook-form's form controller
 * @param {object} props
 * @param {string} props.defaultValue
 * @param {array} props.options
 * @param {string|number} props.marginBottom Bottom margin - takes in tailwind or normal values
 * @param {string|React.ReactElement} props.leftAddon
 * @param {string} props.name
 * @param {object} props.control
 * @param {object} props.rules
 * @param {string} props.placeholder
 * @param {string} props.label
 * @param {string} props.accessibilityLabel
 * @returns {React.ReactElement}
 */
export default function RadioGroup({
  defaultValue = '',
  options,
  name,
  control,
  rules,
  placeholder,
  accessibilityLabel,
  marginBottom,
  leftAddon,
  ...props
}) {
  // use controller to handle form validation
  const {
    field: {
      onChange, onBlur,
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

  // prevent break when control is not passed
  if (!control) {
    return null;
  }

  return (
    <View marginBottom={marginBottom} flex={1}>
      <Radio.Group
        name={name}
        onBlur={onBlur}
        defaultValue={defaultValue}
        onChange={onChange}
        accessibilityLabel={accessibilityLabel}
        {...props}
      >
        <HStack alignItems="center" justifyContent="space-around" width="full">
          {options?.length ? options.map(({ label, value: selectionValue }) => (
            <Radio key={selectionValue} value={selectionValue} size="sm">
              {label}
            </Radio>
          )) : null}
        </HStack>
      </Radio.Group>
      <InputError
        error={error}
        isDirty={isDirty}
        isTouched={isTouched}
      />
    </View>
  );
}
