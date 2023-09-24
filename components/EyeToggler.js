import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Button, Icon, Text } from 'native-base';
import { useLocalization } from '../localization';

/**
 * Eye/Eye-off toggling component
 * @param {object} props
 * @param {boolean} props.show
 * @param {function()} props.toggle
 * @returns {React.ReactElement}
 */
export default function EyeToggler({ show, toggle }) {
  const { t } = useLocalization();

  return (
    <Button paddingX={4} pb={0} onPress={toggle} flex={1} variant="unstyled">
      <Icon
        as={MaterialCommunityIcons}
        name={show ? 'eye' : 'eye-off'}
        size={6}
        color="white"
      />
      <Text color="gray.400" fontSize="xs">{t(show ? 'Hide' : 'Show')}</Text>
    </Button>
  );
}
