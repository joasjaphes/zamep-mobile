import { useCallback, useMemo } from 'react';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import {
  Box, Heading, HStack, Icon, Image,
} from 'native-base';

const Logo = require('../assets/logo.png');

/**
 * Header Left Component
 * @param {object} props
 * @returns {React.ReactElement}
 */
function HeaderLeft() {
  const navigation = useNavigation();

  const goBackSafe = useCallback(() => {
    // https://github.com/react-navigation/react-navigation/issues/6434#issuecomment-593216764
    // Traverse parent stack until we can go back
    const parent = navigation;
    // if (!navigation.canGoBack()) {
    //   while (parent.getState()?.index === 0 && parent.getParent()) {
    //     parent = parent.getParent();
    //   }
    // }
    parent?.goBack();
  }, [navigation]);

  const icon = useMemo(() => {
    if (navigation.canGoBack()) {
      return (
        <Box alignItems="flex-start" justifyContent="center" paddingLeft={2} style={{ height: 40, width: 40 }}>
          <Icon
            as={Ionicons}
            name="arrow-back-outline"
            size={8}
            marginLeft={1}
            color="dark"
            onPress={goBackSafe}
          />
        </Box>
      );
    }
    return (
      <Box alignItems="center" justifyContent="center" marginLeft={2} style={{ height: 40, width: 40 }}>
        <Image source={Logo} height="full" width="full" style={{ resizeMode: 'contain' }} alt="Logo" />
      </Box>
    );
  }, [goBackSafe, navigation]);

  return icon;
}

function HeaderRight() {
  const navigation = useNavigation();
  const route = useRoute();

  const icon = useMemo(() => {
    if (route.name === 'Notifications') {
      return null;
    }
    return (
      <Icon
        as={MaterialIcons}
        name="circle-notifications"
        size={10}
        alignSelf="center"
        color="primary.900"
        onPress={() => navigation.navigate('Notifications')}
      />
    );
  }, [route?.name, navigation]);

  return (
    <Box alignItems="center" justifyContent="center" style={{ height: 72, width: 72 }}>
      {icon}
    </Box>
  );
}

export default function Header(props = {}) {
  const { options: { title } = {} } = props;

  const Title = useMemo(() => {
    if (title) {
      return <Heading alignSelf="center" fontWeight={700} marginLeft={3}>{title}</Heading>;
    }
    return null;
  }, [title]);

  return (
    <HStack
      paddingY={2}
      borderBottomWidth={0.7}
      borderBottomColor="#D9D9D9"
      backgroundColor="white"
    >
      <HeaderLeft />
      {Title}
    </HStack>
  );
}
