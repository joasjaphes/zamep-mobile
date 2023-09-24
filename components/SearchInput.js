import { Icon } from 'native-base';

import { MaterialIcons } from '@expo/vector-icons';
import Input from './Input';
import { useLocalization } from '../localization';

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
export default function SearchInput(props) {
  const { t } = useLocalization();

  return (
    <Input
      size="md"
      {...props}
      placeholder={t('Search')}
      InputLeftElement={<Icon as={<MaterialIcons name="person-search" />} size={5} ml="2" color="#C5C5C5" />}
    />
  );
}
