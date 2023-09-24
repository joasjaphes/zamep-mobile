import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useLocalization } from '../localization';
import Login from '../screens/login';
import TermsConditions from '../screens/terms';

const Stack = createNativeStackNavigator();

export default function IntroductionStack() {
  const { t } = useLocalization();

  return (
    <Stack.Navigator
      screenOptions={{
        contentStyle: { backgroundColor: '#FFFFFF' },
      }}
      initialRouteName="Login"
    >
      <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
      <Stack.Screen name="Terms&Conditions" component={TermsConditions} options={{ title: t('Terms & Conditions') }} />
    </Stack.Navigator>
  );
}
