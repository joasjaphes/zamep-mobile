import {
  Progress, Box, Divider, HStack, Icon, Text, Avatar, Pressable,
} from 'native-base';
import { useCallback, useMemo } from 'react';
import { useQuery } from 'react-query';
import numeral from 'numeral';

import { useLocalization } from '../localization';
import KeyboardAwareScrollView from '../components/KeyboardAwareScrollView';
import GraphBar from '../components/svg/graphBar';
import getInitials from '../helper/lingo';
import { useCampaign } from '../hooks/useCampaign';
import useRefreshOnFocus from '../hooks/useRefreshOnFocus';

const FallbackImage = require('../assets/user-fallback.png');
const FallbackFemaleImage = require('../assets/female-profile.png');

export default function ApproverHome({ navigation }) {
  const { t } = useLocalization();

  const { campaign } = useCampaign();

  // console.log('userActiveCampaign', campaign);
  const {
    data: { registrations: registrationsData = [], total: numberRegistered = 0 } = {},
    isFetched, refetch: refetchRegistrations,
  } = useQuery(
    ['registrations',
      { endpoint: `registrations?fields=created_by,campaign.users,approval&filter=campaign.id:like:${campaign?.id ?? ''}&pageSize=2000` }],
    { refetchOnMount: 'always', enabled: Boolean(campaign?.id) },
  );
  useRefreshOnFocus(refetchRegistrations);

  const {
    data: { teams: [team] = [{}] } = {},
  } = useQuery(
    ['teams',
      { endpoint: `teams?fields=users.roles&filter=name:ilike:${campaign?.location?.name ?? ''}`, body: { pageSize: 1 } }],
    { refetchOnMount: 'always', enabled: Boolean(campaign?.location?.name) },
  );

  const registrations = useMemo(() => registrationsData ?? [], [registrationsData]);

  const campaignUsers = useMemo(() => {
    if (team?.users?.length) {
      return team.users.filter(({ roles }) => !roles.find(({ name }) => name.match(/^sheha/i)));
    }
    return [];
  }, [team?.users]);

  const isIssuance = useMemo(() => campaign?.parent?.status && campaign?.parent?.status?.match(/issuance/gi), [campaign?.parent?.status]);

  const campaignGoal = useMemo(() => campaign?.goal ?? 0, [campaign?.goal]);
  const percentageRegistered = useMemo(() => Math.abs(
    (numberRegistered / campaignGoal) * 100,
  ), [numberRegistered, campaignGoal]);

  const campaignGoalPerUser = useMemo(
    () => campaignGoal / (campaignUsers?.length ?? 1),
    [campaignGoal, campaignUsers],
  );

  const numberOfIssuedNets = useMemo(() => {
    if (registrations?.length) {
      return registrations.reduce((
        prev,
        current,
      ) => {
        if (current?.issued) {
          return Number(prev) + Number(current?.nets ?? 0);
        }
        return prev;
      }, 0);
    }
    return 0;
  }, [registrations]);

  const numberOfNetsToBeIssued = useMemo(() => {
    if (registrations?.length) {
      return registrations.reduce((
        prev,
        current,
      ) => Number(prev) + Number(current?.nets ?? 0), 0);
    }
    return 0;
  }, [registrations]);

  const percentageIssued = useMemo(() => (
    (numberOfIssuedNets / numberOfNetsToBeIssued) * 100
  ), [numberOfIssuedNets, numberOfNetsToBeIssued]);

  const issuanceGoalPerUser = useMemo(
    () => numberOfNetsToBeIssued / (campaignUsers?.length ?? 1),
    [numberOfNetsToBeIssued, campaignUsers],
  );

  /**
   * @param {object} callback
   * @param {object} callback.params
   * @param {string} callback.params.id agent (user) id
   */
  const goViewIndividualActivities = useCallback((params) => {
    navigation.navigate('Net', {
      screen: 'IndividualActivities',
      params: { ...params, campaignGoalPerUser },
    });
  }, [navigation, campaignGoalPerUser]);

  return (
    <KeyboardAwareScrollView paddingX={6} paddingY={3}>
      <Box>
        <Box paddingX={6} paddingY={5} backgroundColor="#031303" borderRadius={10} marginBottom={6}>
          <HStack alignItems="center" mb={3}>
            <Icon as={<GraphBar />} />
            <Text color="white" fontSize={14} fontWeight={700} marginLeft={2}>{t(isIssuance ? 'Issuance tracker' : 'Registration tracker')}</Text>
          </HStack>
          <HStack justifyContent="space-between" mb={5}>
            <Box>
              <Text color="white" fontSize={10} fontWeight={700}>{t(isIssuance ? 'Issued' : 'Registered')}</Text>
              <Text color="#FAED0B" fontSize={14} fontWeight={700}>{isIssuance ? numberOfIssuedNets : campaign?.registrations}</Text>
            </Box>
            <Box>
              <Text color="white" fontSize={10} fontWeight={700}>{t('Goal')}</Text>
              <Text color="white" fontSize={14} fontWeight={700}>{isIssuance ? numberOfNetsToBeIssued : campaign?.goal}</Text>
            </Box>
          </HStack>
          <HStack alignItems="center" justifyContent="space-between">
            <Text color="#C5C5C5" fontSize={10} fontWeight={700} marginRight={2}>0%</Text>
            <Box flex={1}>
              <Progress
                value={isIssuance ? percentageIssued : percentageRegistered}
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
          <Text fontSize={14} fontWeight={700}>{t('Activities')}</Text>
        </HStack>
        <Divider marginY={2} />
        {isFetched && !campaignUsers?.length ? <Text color="grey">{t('No records found')}</Text> : null}
        {campaignUsers.map(({
          id: userId, name = '', gender = 'M',
        }) => {
          const registrationsDone = registrations.filter(({
            created_by: { id },
            issued,
            approval = {},
          }) => {
            const isUser = id === userId;
            if (isIssuance) {
              return isUser && issued;
            }
            return isUser && !approval?.status?.match(/^approved/gi);
          }).length;
          return (
            <Pressable key={name} onPress={() => goViewIndividualActivities({ id: userId, name })}>
              <HStack padding={4} backgroundColor="light" alignItems="center" borderRadius={10} space={3} marginBottom={3}>
                <Avatar
                  bg="gray.200"
                  alignSelf="center"
                  size="md"
                  source={gender === 'M' ? FallbackImage : FallbackFemaleImage}
                >
                  {getInitials(name)}
                </Avatar>
                <Box flex={1}>
                  <HStack justifyContent="space-between">
                    <Text fontSize={13} fontWeight={700} color="dark" marginBottom={2}>{name}</Text>
                    <Text fontSize={13} fontWeight={700}>{numeral(isIssuance ? issuanceGoalPerUser : campaignGoalPerUser).format('0,0')}</Text>
                  </HStack>
                  <Progress
                    value={
                      (registrationsDone
                        / (isIssuance ? issuanceGoalPerUser : campaignGoalPerUser)
                      ) * 100
                    }
                    width="full"
                    _filledTrack={{
                      bg: 'dark',
                    }}
                    backgroundColor="#28409A33"
                  />
                </Box>
              </HStack>
            </Pressable>
          );
        })}
      </Box>
    </KeyboardAwareScrollView>
  );
}
