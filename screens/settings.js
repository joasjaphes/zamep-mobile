import {
  Box, Button, HStack, Text, Heading, Icon, useToast, Avatar,
} from 'native-base';
import { useCallback, useMemo } from 'react';
import { useQuery } from 'react-query';
import { openURL } from 'expo-linking';

import { useLocalization } from '../localization';
import { useAuth } from '../hooks/useAuth';
import KeyboardAwareScrollView from '../components/KeyboardAwareScrollView';
import OutgoingCall from '../components/svg/outgoingCall';
import { slicePhone } from '../helper/numeral';
import { useCampaign } from '../hooks/useCampaign';

const FallbackImage = require('../assets/user-fallback.png');

export default function Settings() {
  const { t } = useLocalization();

  const toast = useToast();

  const { user, logout } = useAuth();
  const { campaign, removeCampaign } = useCampaign();

  const { data: { settings: [supportPhoneSettings] = [{}] } = {} } = useQuery(
    ['supportSettings', { endpoint: 'settings', body: { fields: 'metadata', filter: 'metadata.name:eq:support_phone' } }],
    { refetchOnMount: 'always' },
  );

  const supportPhone = useMemo(() => supportPhoneSettings?.value ?? '', [supportPhoneSettings]);

  const {
    data: location = {},
  } = useQuery(
    ['district',
      { endpoint: `locations/${campaign?.location?.id}`, body: { fields: 'parent' } }],
    { refetchOnMount: false, enabled: Boolean(campaign?.location?.id) },
  );
  const district = location?.parent;

  const {
    data,
  } = useQuery(
    ['teams',
      { endpoint: `teams?fields=users.roles&filter=name:ilike:${campaign?.location?.name ?? ''}`, body: { pageSize: 1 } }],
    { refetchOnMount: 'always', enabled: Boolean(campaign?.location?.name) },
  );
  const { teams: [team] = [{}] } = data ?? {};

  const sheha = useMemo(() => {
    if (team?.users?.length) {
      return team.users.filter(({ roles }) => roles.find(({ name }) => name.match(/^sheha/i)))?.[0];
    }
    return {};
  }, [team?.users]);

  const makeCall = useCallback((tel = '') => {
    try {
      if (tel) {
        openURL(`tel:${slicePhone(tel)}`);
      }
    } catch (error) {
      toast.show({
        description: error?.message ?? error,
      });
    }
  }, [toast]);

  return (
    <KeyboardAwareScrollView paddingX={4} paddingY={3}>
      <Box height="full">
        <Avatar
          bg="gray.200"
          alignSelf="center"
          size="xl"
          marginTop={4}
          marginBottom={6}
          source={FallbackImage}
        >
          {user?.initials ?? ''}
        </Avatar>
        <Heading fontSize={14} textAlign="center" marginBottom={8}>{user?.name ?? '-'}</Heading>
        <Box
          backgroundColor="#F5F5F5"
          borderRadius={10}
          padding={4}
          marginBottom={4}
        >
          <HStack
            alignItems="center"
            justifyContent="space-between"
            marginBottom={2}
          >
            <Box>
              <Text fontSize={10} color="#868585" marginBottom={1}>{t('District')}</Text>
              <Text fontSize={14} fontWeight={700}>{district?.name ?? '-'}</Text>
            </Box>
            <Box>
              <Text fontSize={10} color="#868585" marginBottom={1}>{t('Shehia')}</Text>
              <Text fontSize={14} fontWeight={700}>{campaign?.location?.name ?? '-'}</Text>
            </Box>
          </HStack>
          <HStack
            alignItems="center"
            justifyContent="space-between"
          >
            <Box>
              <Text fontSize={10} color="#868585" marginBottom={1}>{t('Sheha')}</Text>
              <Text fontSize={14} fontWeight={700}>{sheha?.name ?? '-'}</Text>
            </Box>
            <Button
              size="sm"
              px={4}
              py={1}
              _text={{
                fontSize: 12,
              }}
              colorScheme="darkgreen"
              leftIcon={<Icon as={<OutgoingCall />} size="sm" />}
              onPress={() => makeCall(sheha?.phone_number ?? '-')}
            >
              {t('Call')}
            </Button>
          </HStack>
        </Box>
        {/* Quick support section */}
        <HStack
          backgroundColor="#42C8F526"
          borderRadius={10}
          padding={4}
          marginBottom={4}
          alignItems="center"
          justifyContent="space-between"
        >
          <Text fontSize={14} fontWeight={700}>{t('Quick support')}</Text>
          <Button
            size="sm"
            px={4}
            py={1}
            _text={{
              fontSize: 12,
            }}
            colorScheme="darkgreen"
            leftIcon={<Icon as={<OutgoingCall />} size="sm" />}
            onPress={() => makeCall(supportPhone)}
          >
            {t('Call')}
          </Button>
        </HStack>

        <Button
          size="lg"
          height={60}
          colorScheme="dangerScheme"
          marginBottom={6}
          width="full"
          _text={{ fontSize: 16 }}
          onPress={async () => {
            await removeCampaign();
            logout();
          }}
        >
          {t('Logout')}
        </Button>
        <HStack flex={1} alignItems="flex-end" justifyContent="center" marginBottom={4}>
          <Text fontSize={12} color="#868585">
            {t('Zamep net issuance v', { version: '0.7' })}
          </Text>
        </HStack>
      </Box>
    </KeyboardAwareScrollView>
  );
}
