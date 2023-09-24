import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { useLocalization } from '../localization';
import Header from '../components/Header';
import RegisterConfirm from '../screens/registerConfirm';
import Register from '../screens/register';
import Households from '../screens/households';
import Household from '../screens/household';
import RegistrationReview from '../screens/registrationReview';

const Stack = createNativeStackNavigator();

export default function HouseholdsStack() {
  const { t } = useLocalization();
  return (
    <Stack.Navigator
      screenOptions={{
        contentStyle: { backgroundColor: 'white' },
      }}
      initialRouteName="HouseholdsList"
    >
      <Stack.Screen
        name="HouseholdsList"
        component={Households}
        options={{
          header: Header,
          title: t('Households'),
        }}
      />
      <Stack.Screen
        name="Register"
        component={Register}
        options={({ route }) => ({
          header: Header,
          title: !route?.params?.toBeCleared && route?.params ? t('Registration') : t('New registration'),
        })}
      />
      <Stack.Screen
        name="RegisterConfirm"
        component={RegisterConfirm}
        options={{
          header: Header,
          title: t('Confirm registration'),
        }}
      />
      <Stack.Screen
        name="Household"
        component={Household}
        options={{
          header: Header,
          title: t('Household'),
        }}
      />
      <Stack.Screen
        name="RegistrationReview"
        component={RegistrationReview}
        options={{
          header: Header,
          title: t('Review registration'),
        }}
      />
    </Stack.Navigator>
  );
}
