import { View } from 'native-base';
import { Slider as RNSlider } from '@miblanchard/react-native-slider';
import { useController } from 'react-hook-form';

import InputError from './InputError';

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
 * @returns {React.ReactElement}
 */
export default function Slider({
  maxLength,
  defaultValue = '',
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

  // prevent break when control is not passed
  if (!control) {
    return null;
  }

  return (
    <View marginBottom={marginBottom}>
      <RNSlider
        ref={ref}
        minimumValue={1}
        maximumValue={20}
        step={1}
        value={value}
        // onValueChange={([sliderValue]) => onChange(sliderValue)}
        onSlidingComplete={([sliderValue]) => onChange(sliderValue)}
        minimumTrackTintColor="#28409A33"
        maximumTrackTintColor="#28409A"
        thumbTintColor="#28409A"
        {...props}
      />
      <InputError
        error={error}
        isDirty={isDirty}
        isTouched={isTouched}
      />
    </View>
  );
}
