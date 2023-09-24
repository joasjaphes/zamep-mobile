import { HStack, Icon, Text } from 'native-base';
import { Ionicons } from '@expo/vector-icons';

import { useLocalization } from '../localization';

export default function InputError({
  error, isTouched, isDirty, zIndex,
}) {
  const { t } = useLocalization();
  if (error && (isTouched || isDirty)) {
    return (
      <HStack marginTop={1} alignItems="center" zIndex={zIndex}>
        <Icon as={<Ionicons name="warning" />} color="danger" marginRight={0.5} />
        <Text
          color="danger"
          fontSize={12}
        >
          {error?.message ?? t('Invalid input')}
        </Text>
      </HStack>
    );
  }
  return null;
}
