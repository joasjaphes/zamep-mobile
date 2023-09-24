import {
  Progress, Box, Button, Divider, HStack, Icon, Text,
} from 'native-base';
import { useCallback, useMemo } from 'react';
import { useQuery } from 'react-query';
import { MaterialIcons } from '@expo/vector-icons';
import numeral from 'numeral';

import { useLocalization } from '../localization';
import KeyboardAwareScrollView from '../components/KeyboardAwareScrollView';
import GraphBar from '../components/svg/graphBar';
import { useCampaign } from '../hooks/useCampaign';
import useRefreshOnFocus from '../hooks/useRefreshOnFocus';
import { useAuth } from '../hooks/useAuth';

export default function Home({ navigation }) {
  const { t } = useLocalization();

  const { user = {} } = useAuth();
  const { campaign = {} } = useCampaign();

  const { data: { registrations: registrationsData = [], total: numberRegistered = 0 } = {}, isFetched, refetch: refetchRegistrations } = useQuery(['registrations', {
    endpoint: `registrations?filter=campaign.id:like:${campaign?.id}&filter=created_by.id:like:${user?.id}`, body: { fields: 'campaign,created_by,approval', pageSize: 2000 },
  }], { refetchOnMount: 'always', enabled: Boolean(campaign?.id && user?.id) });
  useRefreshOnFocus(refetchRegistrations);

  const {
    data: { teams: [team] = [{}] } = {},
  } = useQuery(
    ['teams',
      { endpoint: `teams?fields=users.roles&filter=name:ilike:${campaign?.location?.name ?? ''}`, body: { pageSize: 1 } }],
    { refetchOnMount: 'always', enabled: Boolean(campaign?.location?.name) },
  );

  const campaignUsers = useMemo(() => {
    if (team?.users?.length) {
      return team.users.filter(({ roles }) => !roles.find(({ name }) => name.match(/^sheha/i)));
    }
    return [];
  }, [team?.users]);

  const campaignGoalPerUser = useMemo(() => (
    campaign?.goal ?? 0) / (campaignUsers?.length ?? 1), [campaign?.goal, campaignUsers?.length]);

  const registrations = registrationsData?.filter(({ approval = {} }) => !approval?.status?.match(/^approved/gi));

  const percentageRegistered = useMemo(() => Math.abs(
    (numberRegistered / campaignGoalPerUser) * 100,
  ), [numberRegistered, campaignGoalPerUser]);

  const goRegister = useCallback(() => {
    // clean register screen before navigating
    navigation.reset({
      index: 0,
      routes: [{ name: 'Households' }],
    });
    navigation.navigate('Households', {
      screen: 'Register',
      params: { toBeCleared: true },
    });
  }, [navigation]);

  const goViewRegistration = useCallback((params) => {
    navigation.navigate('Households', {
      screen: 'Household',
      params,
    });
  }, [navigation]);

  const goViewHouseholds = useCallback(() => {
    navigation.navigate('Households', {
      screen: 'HouseholdsList',
    });
  }, [navigation]);

  return (
    <KeyboardAwareScrollView paddingX={6} paddingY={3}>
      <Box height="full">
        <Box>
          <Box paddingX={6} paddingY={5} backgroundColor="#1E6312" borderRadius={10} marginBottom={6}>
            <HStack alignItems="center" mb={3}>
              <Icon as={<GraphBar />} />
              <Text color="white" fontSize={14} fontWeight={700} marginLeft={2}>{t('Registration tracker')}</Text>
            </HStack>
            <HStack justifyContent="space-between" mb={5}>
              <Box>
                <Text color="white" fontSize={10} fontWeight={700}>{t('Registered')}</Text>
                <Text color="#FAED0B" fontSize={14} fontWeight={700}>{numeral(numberRegistered).format('0,0')}</Text>
              </Box>
              <Box>
                <Text color="white" fontSize={10} fontWeight={700}>{t('Goal')}</Text>
                <Text color="white" fontSize={14} fontWeight={700}>{numeral(campaignGoalPerUser).format('0,0')}</Text>
              </Box>
            </HStack>
            <HStack alignItems="center" justifyContent="space-between">
              <Text color="#C5C5C5" fontSize={10} fontWeight={700} marginRight={2}>0%</Text>
              <Box flex={1}>
                <Progress
                  value={percentageRegistered}
                  width="full"
                  _filledTrack={{
                    bg: '#FAED0B',
                  }}
                />
              </Box>
              <Text color="#C5C5C5" fontSize={10} fontWeight={700} marginLeft={2}>100%</Text>
            </HStack>
          </Box>
          <HStack alignItems="center" justifyContent="space-between">
            <Text fontSize={14} fontWeight={700}>{`${t('Recents')} ${user?.firstName ?? ''}`}</Text>
            {registrations?.length ? (
              <Box flex={1} alignItems="flex-end">
                <Button
                  size="sm"
                  px={4}
                  py={1}
                  _text={{
                    fontSize: 12,
                  }}
                  colorScheme="primary"
                  borderColor="primary.900"
                  variant="outline"
                  onPress={goViewHouseholds}
                >
                  {t('View All')}
                </Button>
              </Box>
            ) : null}
          </HStack>
          <Divider marginY={2} />
          {isFetched && !registrations?.length ? <Text color="grey">{t('No records found')}</Text> : null}
          {registrations?.map((registration, index) => {
            const { head_of_family: item = '', id, approval = {} } = registration;
            const listLength = numberRegistered - 1;
            return (
              <Button
                key={id}
                width="full"
                variant="link"
                color="primary.900"
                px={4}
                bg={index % 2 ? '#F5F5F5' : '#EDEDED'}
                borderRadius={(index !== 0 && index !== listLength) ? 0 : undefined}
                borderTopRadius={(listLength && index === listLength) ? 0 : undefined}
                borderBottomRadius={(listLength && index === 0) ? 0 : undefined}
                justifyContent="flex-start"
                _text={{
                  fontSize: 12,
                  color: 'dark',
                  textAlign: 'left',
                }}
                onPress={() => goViewRegistration(registration)}
                endIcon={approval?.status?.match(/disapproved/gi) ? <Icon as={<MaterialIcons />} color="#3C61AD" name="edit" size={14} alt="" /> : null}
              >
                {item}
              </Button>
            );
          })}
        </Box>
        <HStack flex={1} alignItems="flex-end">
          <Button
            size="lg"
            height={60}
            colorScheme="primary"
            marginBottom={3}
            width="full"
            _text={{ fontSize: 16 }}
            onPress={goRegister}
          >
            {t('Register household')}
          </Button>
        </HStack>
      </Box>
    </KeyboardAwareScrollView>
  );
}
