import { View, Text } from 'native-base';
import { useController } from 'react-hook-form';
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';

import InputError from './InputError';

const styles = {
  cell: {
    fontSize: 20,
    borderRadius: 10,
    textAlign: 'center',
  },
  focusCell: {
    borderColor: '#3F7D34',
  },
};

/**
 * Input component wrapped in react-hook-form's form controller
 * @param {object} props
 * @param {number} props.maxLength
 * @param {string} props.defaultValue
 * @param {string|number} props.height Height of input cell - takes in tailwind or normal values
 * @param {string|number} props.width Width of input cell - takes in tailwind or normal values
 * @param {string|number} props.borderWidth Border Width of cell - takes tailwind/normal values
 * @param {string|number} props.marginTop Top margin - takes in tailwind or normal values
 * @param {string|number} props.marginBottom Bottom margin - takes in tailwind or normal values
 * @param {string|React.ReactElement} props.leftAddon
 * @param {string} props.name
 * @param {object} props.control
 * @param {object} props.rules
 * @param {string} props.placeholder
 * @param {string} props.label
 * @param {boolean} props.isReadOnly
 * @param {number} [props.cellCount=4]
 * @returns {React.ReactElement}
 */
export default function VerificationInput({
  maxLength,
  defaultValue = '',
  height = 44,
  width = 60,
  borderWidth = 1,
  borderColor = '#3F7D3433',
  backgroundColor,
  name,
  control,
  rules,
  placeholder,
  label,
  isReadOnly,
  marginTop,
  marginBottom = 4,
  leftAddon,
  cellCount = 4,
  ...props
}) {
  // use controller to handle form validation
  const {
    field: {
      onChange, value,
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

  const ref = useBlurOnFulfill({ value, cellCount });
  const [codeFieldProps, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue: onChange,
  });

  // prevent break when control is not passed
  if (!control) {
    return null;
  }

  return (
    <View marginTop={marginTop} marginBottom={marginBottom}>
      <CodeField
        ref={ref}
        {...codeFieldProps}
        value={value}
        onChangeText={onChange}
        cellCount={cellCount}
        keyboardType="default"
        textContentType="oneTimeCode"
        renderCell={({ index, symbol, isFocused }) => (
          <Text
            key={index}
            style={[styles.cell, {
              lineHeight: height - (2 * borderWidth),
              height,
              width,
              borderWidth,
              borderColor,
              backgroundColor,
            }, isFocused && styles.focusCell]}
            onLayout={getCellOnLayoutHandler(index)}
            {...props}
          >
            {symbol || (isFocused ? <Cursor /> : null)}
          </Text>
        )}
      />
      <InputError
        error={error}
        isDirty={isDirty}
        isTouched={isTouched}
      />
    </View>
  );
}
