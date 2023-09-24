import {
  Input as TextInput, InputLeftAddon, InputGroup, View,
} from 'native-base';
import { useController } from 'react-hook-form';

import InputError from './InputError';
import InputLengthCounter from './InputLengthCounter';

/**
 * Input component wrapped in react-hook-form's form controller
 * @param {object} props
 * @param {number} props.maxLength
 * @param {string} props.defaultValue
 * @param {string|number} props.height Height of input field - takes in tailwind or normal values
 * @param {string|number} props.marginBottom Bottom margin - takes in tailwind or normal values
 * @param {string|React.ReactElement} props.leftAddon
 * @param {string} props.name
 * @param {object} props.control
 * @param {object} props.rules
 * @param {string} props.placeholder
 * @param {string} props.label
 * @param {boolean} props.isReadOnly
 * @param {boolean} [props.withLengthCount=false]
 * @returns {React.ReactElement}
 */
export default function Input({
  maxLength,
  defaultValue = '',
  height = 60,
  name,
  control,
  rules,
  placeholder,
  label,
  isReadOnly,
  marginBottom = 4,
  leftAddon,
  withLengthCount = false,
  ...props
}) {
  // use controller to handle form validation
  const {
    field: {
      onChange, onBlur, ref, value,
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
    <View marginBottom={marginBottom}>
      <InputGroup>
        {leftAddon ? (
          <InputLeftAddon
            backgroundColor={isReadOnly ? 'gray.100' : 'transparent'}
            borderColor="grey"
            opacity={isReadOnly ? 0.4 : 1}
            // _text={{ color: 'grey' }}
          >
            {leftAddon}
          </InputLeftAddon>
        ) : null}
        <TextInput
          ref={ref}
          placeholder={placeholder}
          size="2xl"
          fontSize={16}
          height={height}
          borderColor="grey"
          borderRadius="10px"
          maxLength={maxLength}
          onBlur={onBlur}
          value={value}
          onChangeText={onChange}
          flex={1}
          isReadOnly={isReadOnly}
          _input={{
            selectionColor: '#30303080',
            cursorColor: '#303030',
          }}
          _readOnly={{
            backgroundColor: 'gray.100', borderColor: 'grey', borderLeftWidth: leftAddon ? 0 : 1, opacity: 0.4,
          }}
          {...props}
        />
        {withLengthCount ? (
          <InputLengthCounter
            maxLength={maxLength}
            value={value}
          />
        ) : null}
      </InputGroup>
      <InputError
        error={error}
        isDirty={isDirty}
        isTouched={isTouched}
      />
    </View>
  );
}
