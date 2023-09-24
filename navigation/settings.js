import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { useLocalization } from '../localization';
import Header from '../components/Header';
import Settings from '../screens/settings';
import ChangePicture from '../screens/changePicture';

const Stack = createNativeStackNavigator();

export default function SettingsStack() {
  const { t } = useLocalization();
  return (
    <Stack.Navigator
      screenOptions={{
        contentStyle: { backgroundColor: 'white' },
      }}
      initialRouteName="MainSettings"
    >
      <Stack.Screen
        name="MainSettings"
        component={Settings}
        options={{
          header: Header,
          title: t('Settings'),
        }}
      />
      <Stack.Screen
        name="ChangePicture"
        component={ChangePicture}
        options={{
          header: Header,
          title: t('Change picture'),
        }}
      />
    </Stack.Navigator>
  );
}
