import {
  Icon, Pressable, Text,
} from 'native-base';
import { Path, Svg } from 'react-native-svg';

import Input from './Input';
import useToggle from '../hooks/useToggle';
import { useLocalization } from '../localization';

/**
 * Password input component wrapped in react-hook-form's form controller
 * @param {object} props
 * @returns {React.ReactElement}
 */
export default function PasswordInput(props) {
  const { t } = useLocalization();

  const [show, toggle] = useToggle();

  return (
    <Input
      {...props}
      autoComplete="off"
      secureTextEntry={!show}
      InputLeftElement={(
        <Icon
          as={(
            <Svg width="24" height="24" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <Path key="path1" d="M11.78 10.22a.75.75 0 0 0-1.06 1.06l.72.72-.72.72a.75.75 0 1 0 1.06 1.06l.72-.72.72.72a.75.75 0 0 0 1.06-1.062L13.561 12l.72-.72a.75.75 0 1 0-1.061-1.06l-.72.72-.72-.72ZM5.22 10.22a.75.75 0 0 1 1.06 0l.72.72.72-.72a.75.75 0 1 1 1.06 1.06l-.719.72.72.718A.75.75 0 1 1 7.72 13.78L7 13.06l-.72.72a.75.75 0 0 1-1.06-1.06l.72-.72-.72-.72a.75.75 0 0 1 0-1.06ZM16.5 13.5a.75.75 0 0 0 0 1.5h1.75a.75.75 0 0 0 0-1.5H16.5Z" fill="#212121" />
              <Path key="path2" d="M5.25 5A3.25 3.25 0 0 0 2 8.25v7.5A3.25 3.25 0 0 0 5.25 19h13.5A3.25 3.25 0 0 0 22 15.75v-7.5A3.25 3.25 0 0 0 18.75 5H5.25ZM3.5 8.25c0-.967.783-1.75 1.75-1.75h13.5c.967 0 1.75.783 1.75 1.75v7.5a1.75 1.75 0 0 1-1.75 1.75H5.25a1.75 1.75 0 0 1-1.75-1.75v-7.5Z" fill="#212121" />
            </Svg>
          )}
          size={5}
          ml="2"
          color="black"
        />
      )}
      InputRightElement={(
        <Pressable onPress={toggle} marginRight={2} height="full" justifyContent="center">
          <Text
            color="dark"
            fontSize={12}
            fontWeight={700}
          >
            {t(show ? 'Hide' : 'Show')}
          </Text>
        </Pressable>
      )}
    />
  );
}
