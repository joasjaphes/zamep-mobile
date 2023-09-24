import { forwardRef, useEffect, useRef } from 'react';
import {
  Input as TextInput, InputLeftAddon, InputGroup, View,
} from 'native-base';
import { useController } from 'react-hook-form';
import { AutocompleteDropdown } from 'react-native-autocomplete-dropdown';

import InputError from './InputError';

const SelectorInput = forwardRef((props, ref) => (
  <TextInput
    ref={ref}
    {...props}
  />
));

/**
 * Autocomplete Input component wrapped in react-hook-form's form controller
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
 * loading
 * @param {boolean} props.isReadOnly
 * @param {boolean} [props.clearOnFocus=false]
 * @returns {React.ReactElement}
 */
export default function AutocompleteInput({
  dataSet = null,
  defaultValue = '',
  height = 60,
  name,
  control,
  rules,
  placeholder,
  label,
  isReadOnly,
  loading,
  marginBottom = 4,
  leftAddon,
  clearOnFocus = false,
  ...props
}) {
  const dropdownController = useRef(null);
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

  useEffect(() => {
    if (defaultValue) {
      dropdownController.current.setInputText(defaultValue);
      onChange(defaultValue);
    }
  }, [defaultValue, onChange]);

  // prevent break when control is not passed
  if (!control) {
    return null;
  }

  return (
    <View marginBottom={marginBottom} zIndex={3}>
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
        <AutocompleteDropdown
          ref={ref}
          controller={(controller) => {
            dropdownController.current = controller;
          }}
          InputComponent={SelectorInput}
          textInputProps={{
            placeholder,
            size: '2xl',
            fontSize: 16,
            height,
            borderColor: 'grey',
            borderRadius: 10,
            flex: 1,
            width: '100%',
            position: 'absolute',
            isReadOnly,
            _input: {
              selectionColor: '#30303080',
              cursorColor: '#303030',
            },
            onChangeText: (val) => {
              if (dropdownController.current) {
                dropdownController.current.setInputText(val);
                onChange(val);
              }
            },
            _readOnly: {
              backgroundColor: 'gray.100', borderColor: 'grey', borderLeftWidth: leftAddon ? 0 : 1, opacity: 0.4,
            },
            ...props,
          }}
          inputContainerStyle={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'flex-end',
            backgroundColor: 'transparent',
          }}
          containerStyle={{ flexGrow: 1, flexShrink: 1 }}
          onSelectItem={(item) => {
            if (item?.title) {
              onChange(item.title);
            } else {
              onChange('');
            }
          }}
          onClear={() => onChange('')}
          onBlur={onBlur}
          loading={loading}
          dataSet={dataSet}
          emptyResultText={value}
          clearOnFocus={clearOnFocus}
          // showClear={false}
          showChevron={false}
          closeOnBlur
          closeOnSubmit
        />
      </InputGroup>
      <InputError
        error={error}
        isDirty={isDirty}
        isTouched={isTouched}
        zIndex={-1}
      />
    </View>
  );
}
