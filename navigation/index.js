import { useCallback, useEffect, useMemo } from 'react';
import {
  Alert, HStack, Icon, Text,
} from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';
import { useNetInfo } from '@react-native-community/netinfo';
import { getValueFor } from '../helper/store';
import { useLocalization } from '../localization';
import IntroductionStack from './introduction';
import PanelTabs from './panel';
import { useAuth } from '../hooks/useAuth';
import { useCampaign } from '../hooks/useCampaign';

export { IntroductionStack, PanelTabs };

export default function Navigation() {
  const { user } = useAuth();
  const { campaign } = useCampaign();

  const { t, setLocale } = useLocalization();

  const { isConnected, type } = useNetInfo();

  const getStoredLocale = useCallback(async () => {
    try {
      /** @type {('en'|'sw')} */
      const language = await getValueFor('locale');
      setLocale(language);
    } catch {
      return false;
    }
    return true;
  }, [setLocale]);

  // useEffect(() => {
  //   getStoredLocale();
  // }, [getStoredLocale]);

  const Navigator = useMemo(() => {
    if (user && campaign) {
      return <PanelTabs />;
    }
    return <IntroductionStack />;
  }, [campaign, user]);

  return (
    <>
      {type !== 'unknown' && !isConnected ? (
        <Alert w="100%" bg="#BF0909" status="error" borderRadius={0} py={2}>
          <HStack flexShrink={1} space={2} alignItems="center" justifyContent="space-between">
            <Icon as={<MaterialIcons name="signal-cellular-connected-no-internet-4-bar" />} color="white" size={15} />
            <Text color="white" fontSize={10} fontWeight={700}>
              {t('You are not connected to internet All data are in this device')}
            </Text>
          </HStack>
        </Alert>
      ) : null}
      {/* <Alert w="100%" bg="#3B9AB9" status="error" borderRadius={0} py={2}>
        <HStack flexShrink={1} space={2} alignItems="center" justifyContent="space-between">
          <Icon as={<MaterialIcons />} color="white" size={15} name="upload-file" />
          <Text color="white" fontSize={10} fontWeight={700}>
            {t('Uploading data to server')}
          </Text>
        </HStack>
      </Alert> */}
      {Navigator}
    </>
  );
}
