import { Icon } from 'native-base';
import { Ionicons } from '@expo/vector-icons';

import { useCallback } from 'react';
import InputFormatter from './InputFormatter';
import { useLocalization } from '../localization';

export default function PhoneInput({
  name = 'phone', control, required, ...props
}) {
  const { t } = useLocalization();

  const validateTanzanianPhoneNumber = useCallback((value) => {
    if (!value || value?.length <= 1) {
      return true;
    }
    const tanzanianPhoneRegex = /^0[67]\d{8}$/;

    if (!tanzanianPhoneRegex.test(value)) {
      return t('Invalid phone number format');
    }

    return true;
  }, [t]);

  return (
    <InputFormatter
      name={name}
      placeholder={t('Phone number')}
      keyboardType="phone-pad"
      autoComplete="tel-national"
      control={control}
      maxLength={12}
      InputLeftElement={<Icon as={<Ionicons name="person-outline" />} size={5} ml="2" color="black" />}
      rules={{
        validate: validateTanzanianPhoneNumber,
        required: required && t('Please enter phone number'),
      }}
      {...props}
    />
  );
}
