import {
  Box, Button, HStack, Icon, Text, Heading, Image, useToast, Progress,
} from 'native-base';
import { useCallback, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery } from 'react-query';

import numeral from 'numeral';
import { useLocalization } from '../localization';
import KeyboardAwareScrollView from '../components/KeyboardAwareScrollView';
import GraphBar from '../components/svg/graphBar';
import VerificationInput from '../components/VerificationInput';
import useToggle from '../hooks/useToggle';
import Modal from '../components/Modal';
import { useCampaign } from '../hooks/useCampaign';
import useRefreshOnFocus from '../hooks/useRefreshOnFocus';
import { useAuth } from '../hooks/useAuth';

const IssuanceSuccessImage = require('../assets/issuance-success.png');

const defaultValues = { token: '' };

export default function IssuerHome({ navigation }) {
  const { t } = useLocalization();

  const toast = useToast();

  const { user = {} } = useAuth();
  const { campaign = {} } = useCampaign();

  const { mutateAsync: fetchRegistration, isLoading: isGettingRegistration, data: { registrations: [registration] = [{}] } = {} } = useMutation('fetchRegistration');
  const { mutateAsync: updateRegistration, isLoading: isUpdatingRegistration } = useMutation('updateRegistration');

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

  const { data: { registrations: allRegistrationsToIssue = [] } = {}, refetch: refetchAllRegistrationsToIssue } = useQuery(['registrations', {
    endpoint: `registrations?fields=campaign,created_by&filter=campaign.id:like:${campaign?.id}`,
  }], { refetchOnMount: 'always', enabled: Boolean(campaign?.id) });

  const { data: { registrations = [] } = {}, refetch: refetchRegistrations } = useQuery(['issuedRegistrations', {
    endpoint: `registrations?fields=campaign,updated_by&filter=campaign.id:like:${campaign?.id}&filter=updated_by.id:like:${user?.id}&filter=issued:eq:1`,
  }], { refetchOnMount: 'always', enabled: Boolean(campaign?.id && user?.id) });

  useRefreshOnFocus(refetchRegistrations);
  useRefreshOnFocus(refetchAllRegistrationsToIssue);

  const [isNetIssued, issueNet] = useToggle(false);
  const [isConfirmingDetails, confirmDetails] = useToggle(false, { onHide: issueNet });

  const {
    control, handleSubmit, formState: { isValid }, watch, reset,
  } = useForm({
    mode: 'onChange',
    defaultValues,
  });

  const token = watch('token');

  const numberOfRegistrationsToIssue = useMemo(() => {
    if (allRegistrationsToIssue?.length) {
      return allRegistrationsToIssue.reduce((
        prev,
        current,
      ) => Number(prev) + Number(current?.nets ?? 0), 0);
    }
    return 0;
  }, [allRegistrationsToIssue]);

  const numberOfIssuedNets = useMemo(() => {
    if (registrations?.length) {
      return registrations.reduce((
        prev,
        current,
      ) => Number(prev) + Number(current?.nets ?? 0), 0);
    }
    return 0;
  }, [registrations]);

  const issuanceGoalPerUser = useMemo(
    () => numberOfRegistrationsToIssue / (campaignUsers?.length ?? 1),
    [numberOfRegistrationsToIssue, campaignUsers],
  );

  const percentageIssued = useMemo(() => (
    (numberOfIssuedNets / issuanceGoalPerUser) * 100
  ), [numberOfIssuedNets, issuanceGoalPerUser]);

  const { firstName = '', middleName = '', lastName = '' } = useMemo(() => {
    if (!registration?.head_of_family) {
      return {};
    }

    const names = registration.head_of_family.split(' ');
    const nameLength = names.length;

    const fname = names?.[0] ?? '';
    const mname = nameLength > 2 ? names?.[1] : '';
    const lname = names?.[names.length - 1] ?? '';

    return { firstName: fname, middleName: mname, lastName: lname };
  }, [registration?.head_of_family]);

  const getRegistration = useCallback(async () => {
    try {
      const result = await fetchRegistration([{}, { endpoint: `registrations?fields=campaign&filter=campaign.id:like:${campaign?.id}&filter=code:eq:${token}` }]);

      if (!result || result?.error || !result?.registrations?.length) {
        throw new Error('Error getting registration');
      }

      if (result.registrations[0]?.issued) {
        toast.show({ description: t('Nets for this household are already issued') });
        return;
      }

      confirmDetails(); // sets isConfirmingDetails to true (onShow)
    } catch (error) {
      toast.show({ description: t('Registration not found') });
    }
  }, [campaign?.id, confirmDetails, fetchRegistration, t, toast, token]);

  const issueNets = useCallback(async () => {
    try {
      const result = await updateRegistration([{ issued: true }, { endpoint: `registrations/${registration?.id}`, method: 'PUT' }]);
      console.log(result);
      if (!result || result?.error) {
        throw new Error('Error updating registration');
      }
      confirmDetails(); // sets isConfirmingDetails to false (onHide)
      refetchRegistrations();
      refetchAllRegistrationsToIssue();
      reset(defaultValues);
    } catch (error) {
      toast.show({ description: t('Could not issue nets') });
    }
  }, [
    confirmDetails,
    refetchRegistrations,
    refetchAllRegistrationsToIssue,
    registration?.id,
    t,
    toast,
    updateRegistration,
    reset,
  ]);

  const goViewIssuedNets = useCallback(() => {
    navigation.navigate('Net', {
      screen: 'IssuedNets',
    });
    issueNet();
  }, [issueNet, navigation]);

  return (
    <KeyboardAwareScrollView paddingX={4} paddingY={3}>
      <Box paddingX={6} paddingY={5} backgroundColor="#632112" borderRadius={10} marginBottom={6}>
        <HStack alignItems="center" mb={3}>
          <Icon as={<GraphBar />} />
          <Text color="white" fontSize={14} fontWeight={700} marginLeft={2}>{t('Issuance tracker')}</Text>
        </HStack>
        <HStack justifyContent="space-between" mb={5}>
          <Box>
            <Text color="white" fontSize={10} fontWeight={700}>{t('Issued')}</Text>
            <Text color="#FAED0B" fontSize={14} fontWeight={700}>{numeral(numberOfIssuedNets).format('0,0')}</Text>
          </Box>
          <Box>
            {/*
            <Text color="white" fontSize={10} fontWeight={700}>{t('Goal')}</Text>
            <Text color="white" fontSize={14} fontWeight={700}>{numeral(issuanceGoalPerUser).format('0,0')}</Text>
            */}
          </Box>
        </HStack>
        <HStack alignItems="center" justifyContent="space-between">
          <Text color="#C5C5C5" fontSize={10} fontWeight={700} marginRight={2}>0%</Text>
          <Box flex={1}>
            <Progress
              value={percentageIssued}
              width="full"
              _filledTrack={{
                bg: '#FAED0B',
              }}
            />
          </Box>
          <Text color="#C5C5C5" fontSize={10} fontWeight={700} marginLeft={2}>100%</Text>
        </HStack>
      </Box>
      <Box padding={4} backgroundColor="light" borderRadius={10} marginBottom={4}>
        <Heading fontSize={14} textAlign="center">{t(!isConfirmingDetails ? 'Enter coupon to issue net' : 'Coupon number')}</Heading>
        <VerificationInput
          name="token"
          control={control}
          cellCount={8}
          width={36}
          height={36}
          borderColor="#D9E5D6"
          backgroundColor="white"
          marginTop={3}
        />
        {!isConfirmingDetails
          ? (
            <Button
              size="lg"
              height={60}
              marginTop={1}
              marginBottom={2.5}
              _text={{ fontSize: 16 }}
              onPress={handleSubmit(getRegistration)}
              isLoading={isGettingRegistration}
              isDisabled={!isValid || isGettingRegistration || token?.length < 8}
            >
              {t('Issue net')}
            </Button>
          )
          : null}
      </Box>
      {isConfirmingDetails ? (
        <>
          <HStack
            alignItems="center"
            justifyContent="space-between"
            backgroundColor="#F5F5F5"
            borderRadius={10}
            padding={4}
            marginBottom={4}
          >
            <Box>
              <Text fontSize={10} color="#868585" marginBottom={2}>{t('First name')}</Text>
              <Text fontSize={14} fontWeight={700} marginBottom={2}>{firstName}</Text>
              <Text fontSize={10} color="#868585" marginBottom={2}>{t('Age')}</Text>
              <Text fontSize={14} fontWeight={700}>{registration?.age}</Text>
            </Box>
            <Box>
              <Text fontSize={10} color="#868585" marginBottom={2}>{t('Middle name')}</Text>
              <Text fontSize={14} fontWeight={700} marginBottom={2}>{middleName}</Text>
              <Text fontSize={10} color="#868585" marginBottom={2}>{t('Gender')}</Text>
              <Text fontSize={14} fontWeight={700}>{registration?.gender}</Text>
            </Box>
            <Box>
              <Text fontSize={10} color="#868585" marginBottom={2}>{t('Surname')}</Text>
              <Text fontSize={14} fontWeight={700} marginBottom={2}>{lastName}</Text>
              <Text fontSize={10} color="#868585" marginBottom={2}>{t('Family members')}</Text>
              <Text
                fontSize={14}
                fontWeight={700}
              >
                {registration?.number_of_family_members ?? 0}
              </Text>
            </Box>
          </HStack>
          <HStack
            alignItems="center"
            justifyContent="space-between"
            backgroundColor="#F5F5F5"
            borderRadius={10}
            padding={4}
            marginBottom={4}
          >
            <Box>
              <Text fontSize={10} color="#868585" marginBottom={2}>{t('Street')}</Text>
              <Text fontSize={14} fontWeight={700} marginBottom={2}>{registration?.street}</Text>
            </Box>
            <Box>
              <Text fontSize={10} color="#868585" marginBottom={2}>{t('Primary phone')}</Text>
              <Text fontSize={14} fontWeight={700} color="dark">{registration?.phone_number}</Text>
            </Box>
          </HStack>
          <Heading fontSize={12} textAlign="center" marginTop={3} marginBottom={5}>{t('Number of net(s) to be given')}</Heading>
          <HStack
            borderRadius="full"
            borderWidth={4}
            boxSize="64px"
            borderColor="darkred"
            alignSelf="center"
            justifyContent="center"
            marginBottom={4}
          >
            <Text fontSize={36} color="darkred" fontWeight={700}>{registration?.nets ?? registration?.number_of_nets}</Text>
          </HStack>
          <Button
            size="lg"
            height={60}
            marginTop={1}
            marginBottom={5}
            _text={{ fontSize: 16 }}
            onPress={issueNets}
            isLoading={isUpdatingRegistration}
            isDisabled={isUpdatingRegistration}
          >
            {t('Issue net')}
          </Button>
          <Modal
            show={isNetIssued}
            height={300}
            marginTop="auto"
            marginBottom={0}
            paddingTop={6}
            marginX={3.5}
          >
            <Box justifyContent="center">
              <Image source={IssuanceSuccessImage} height={70} width={74} alignSelf="center" marginBottom={8} alt="" />
              <Text textAlign="center" fontSize={12} color="#868585" marginBottom={6}>
                {t('Nets issued to name', { name: `${firstName} ${lastName}`, number: registration?.nets ?? registration?.number_of_nets })}
              </Text>
              <Button
                size="lg"
                height={16}
                marginTop={1}
                marginBottom={3.5}
                _text={{ fontSize: 16 }}
                onPress={goViewIssuedNets}
              >
                {t('Ok')}
              </Button>
            </Box>
          </Modal>
        </>
      ) : null}
    </KeyboardAwareScrollView>
  );
}
