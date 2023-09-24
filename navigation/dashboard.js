import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { useMemo } from 'react';
import { useLocalization } from '../localization';
import Header from '../components/Header';
import Home from '../screens/home';
import IssuerHome from '../screens/issuerHome';
import ApproverHome from '../screens/approverHome';
import { useCampaign } from '../hooks/useCampaign';
import { useAuth } from '../hooks/useAuth';

const Stack = createNativeStackNavigator();

export default function DashboardStack() {
  const { t } = useLocalization();

  const { user } = useAuth();
  const { campaign } = useCampaign();

  const initialRouteName = useMemo(() => {
    if (user?.isSheha) {
      return 'ApproverHome';
    }
    let route = 'Dashboard';
    const campaignStatus = campaign?.parent?.status ?? campaign?.status;
    switch (campaignStatus) {
      case 'registration':
      case 'REGISTRATION':
        route = 'Dashboard';
        break;
      case 'issuance':
      case 'ISSUANCE':
        route = 'IssuerHome';
        break;
      default:
        route = 'Dashboard';
        break;
    }
    return route;
  }, [campaign?.parent?.status, campaign?.status, user?.isSheha]);

  return (
    <Stack.Navigator
      screenOptions={{
        contentStyle: { backgroundColor: 'white' },
        headerStyle: { backgroundColor: 'white' },
      }}
      initialRouteName={initialRouteName}
    >
      <Stack.Screen
        name="Dashboard"
        component={Home}
        options={{
          header: Header,
          title: t('Dashboard'),
        }}
      />
      <Stack.Screen
        name="IssuerHome"
        component={IssuerHome}
        options={{
          header: Header,
          title: t('Dashboard'),
        }}
      />
      <Stack.Screen
        name="ApproverHome"
        component={ApproverHome}
        options={{
          header: Header,
          title: t('Dashboard'),
        }}
      />
    </Stack.Navigator>
  );
}
