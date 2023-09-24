import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Icon } from 'native-base';
import { useCallback, useMemo } from 'react';
import { useNavigation, StackActions } from '@react-navigation/native';

import { useLocalization } from '../localization';
import HouseholdsStack from './households';
import DashboardStack from './dashboard';
import Home from '../components/svg/home';
import Households from '../components/svg/households';
import MosquitoNet from '../components/svg/mosquitoNet';
import Settings from '../components/svg/settings';
import NetsStack from './nets';
import SettingsStack from './settings';
import { useCampaign } from '../hooks/useCampaign';
import { useAuth } from '../hooks/useAuth';

const Tab = createBottomTabNavigator();

function getHomeTabBarIcon({ color, size }) {
  return (
    <Icon
      as={<Home color={color} size={size} />}
      size={size}
      color={color}
    />
  );
}
function getHouseholdsTabBarIcon({ color, size }) {
  return (
    <Icon
      as={<Households color={color} size={size} />}
      size={size}
      color={color}
    />
  );
}
function getNetsTabBarIcon({ color, size }) {
  return <Icon as={<MosquitoNet color={color} size={size} />} size={size} color={color} />;
}
function getSettingsTabBarIcon({ color, size }) {
  return <Icon as={<Settings color={color} size={size} />} size={28} color={color} />;
}

export default function PanelTabs() {
  const { t } = useLocalization();

  const { campaign } = useCampaign();
  const { user } = useAuth();

  const navigation = useNavigation();

  const doubleClickHandler = useCallback((routeName, parent) => {
    let lastTap = null;

    return () => {
      const now = Date.now();

      if (lastTap && now - lastTap < 300) {
        if (parent && routeName) {
          navigation.navigate(parent, { screen: routeName });
          return;
        }
        navigation.dispatch(StackActions.popToTop());
      } else {
        lastTap = now;
      }
    };
  }, [navigation]);

  const ExtraPanel = useMemo(() => {
    if (user?.isSheha) {
      return (
        <>
          <Tab.Screen
            name="Households"
            component={HouseholdsStack}
            options={{
              tabBarIcon: getHouseholdsTabBarIcon,
              tabBarLabel: t('Households'),
            }}
            listeners={{
              tabPress: doubleClickHandler('HouseholdsList', 'Households'),
            }}
          />
          <Tab.Screen
            name="Net"
            component={NetsStack}
            options={{
              tabBarIcon: getNetsTabBarIcon,
              tabBarLabel: t('Net'),
            }}
            listeners={{
              tabPress: doubleClickHandler('IssuedNets', 'Net'),
            }}
          />
        </>
      );
    }
    if (campaign?.parent?.status && campaign.parent.status?.match(/registration/i)) {
      return (
        <Tab.Screen
          name="Households"
          component={HouseholdsStack}
          options={{
            tabBarIcon: getHouseholdsTabBarIcon,
            tabBarLabel: t('Households'),
          }}
          listeners={{
            tabPress: doubleClickHandler('HouseholdsList', 'Households'),
          }}
        />
      );
    }
    return (
      <Tab.Screen
        name="Net"
        component={NetsStack}
        options={{
          tabBarIcon: getNetsTabBarIcon,
          tabBarLabel: t('Net'),
        }}
        listeners={{
          tabPress: doubleClickHandler('IssuedNets', 'Net'),
        }}
      />
    );
  }, [campaign?.parent?.status, user?.isSheha, doubleClickHandler, t]);

  return (
    <Tab.Navigator screenOptions={{
      tabBarLabelStyle: { fontSize: 10, fontWeight: 700 },
      tabBarActiveTintColor: '#000000',
      tabBarInactiveTintColor: '#868585',
      headerShown: false,
    }}
    >
      <Tab.Screen
        name="Home"
        component={DashboardStack}
        options={{
          tabBarIcon: getHomeTabBarIcon,
          tabBarLabel: t('Home'),
        }}
        listeners={{
          tabPress: doubleClickHandler,
        }}
      />
      {ExtraPanel}
      <Tab.Screen
        name="Settings"
        component={SettingsStack}
        options={{
          tabBarIcon: getSettingsTabBarIcon,
          tabBarLabel: t('Settings'),
        }}
      />
    </Tab.Navigator>
  );
}
