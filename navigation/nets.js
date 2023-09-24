import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { useLocalization } from '../localization';
import Header from '../components/Header';
import IssuedNets from '../screens/issuedNets';
import IndividualActivities from '../screens/individualActivities';
import RegistrationReview from '../screens/registrationReview';

const Stack = createNativeStackNavigator();

export default function NetsStack() {
  const { t } = useLocalization();
  return (
    <Stack.Navigator
      screenOptions={{
        contentStyle: { backgroundColor: 'white' },
      }}
      initialRouteName="IssuedNets"
    >
      <Stack.Screen
        name="IssuedNets"
        component={IssuedNets}
        options={{
          header: Header,
          title: t('Issued nets'),
        }}
      />
      <Stack.Screen
        name="IndividualActivities"
        component={IndividualActivities}
        options={({ route }) => ({
          header: Header,
          title: route.params.name,
        })}
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
