import { useEffect, useRef, useState } from 'react';
import {
  Input as TextInput, InputLeftAddon, InputGroup, View,
} from 'native-base';
import { useController } from 'react-hook-form';
import { TextInputMask, MaskService } from 'react-native-masked-text';

import InputError from './InputError';

/**
 * Input component wrapped in react-hook-form's form controller
 * @param {object} props
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
 * @returns {React.ReactElement}
 */
export default function InputFormatter({
  height = 60,
  name,
  control,
  rules,
  placeholder,
  label,
  isReadOnly,
  marginBottom = 4,
  leftAddon,
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
  });

  const inputRef = useRef();

  const [maskedInput, setMaskedInput] = useState('');

  useEffect(() => {
    if (value && value?.length >= 1) {
      setMaskedInput(MaskService.toMask('custom', value, {
        mask: '0999 999 999',
      }));
    } else {
      setMaskedInput('');
    }
  }, [value]);

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
        <TextInputMask
          ref={inputRef}
          customTextInput={TextInput}
          type="custom"
          options={{
            mask: '0999 999 999',
          }}
          value={maskedInput}
          onChangeText={(text, rawValue) => {
            onChange(rawValue.replace(/\s/ig, ''));
          }}
          customTextInputProps={{
            ref,
            placeholder,
            size: '2xl',
            fontSize: 16,
            height,
            borderColor: 'grey',
            borderRadius: 10,
            flex: 1,
            onBlur,
            isReadOnly,
            _input: {
              selectionColor: '#30303080',
              cursorColor: '#303030',
            },
            _readOnly: {
              backgroundColor: 'gray.100', borderColor: 'grey', borderLeftWidth: leftAddon ? 0 : 1, opacity: 0.4,
            },
            ...props,
          }}
          includeRawValueInChangeText
        />
      </InputGroup>
      <InputError
        error={error}
        isDirty={isDirty}
        isTouched={isTouched}
      />
    </View>
  );
}
