import { MaterialIcons } from '@expo/vector-icons';
import {
  Box, Divider, HStack, Icon, Text, Button, useToast, Spinner,
} from 'native-base';
import { useCallback, useMemo } from 'react';

import { useInfiniteQuery, useMutation, useQuery } from 'react-query';
import numeral from 'numeral';
import { useForm } from 'react-hook-form';
import { useLocalization } from '../localization';
import InfiniteScrollView from '../components/InfiniteScrollView';
import ProgressPie from '../components/ProgressPie';
import GraphBar from '../components/svg/graphBar';
import Modal from '../components/Modal';
import useToggle from '../hooks/useToggle';
import { useCampaign } from '../hooks/useCampaign';
import useRefreshOnFocus from '../hooks/useRefreshOnFocus';
import SearchInput from '../components/SearchInput';

/**
 * Individual Activities Screen
 * @param {object} props
 * @returns {React.ReactElement}
 */
export default function IndividualActivities({ route, navigation }) {
  const params = route?.params ?? {};
  const userID = params?.id;

  const { t } = useLocalization();

  const { campaign } = useCampaign();

  const toast = useToast();

  const [showConfirmationModal, toggleConfirmationModal] = useToggle();
  const [showModal, toggleModal] = useToggle();

  const { control, watch } = useForm({
    mode: 'onChange',
    shouldUnregister: true,
    defaultValues: {
      search: '',
    },
  });

  // subscribe to changes in search value
  const searchValue = watch('search');

  // useMutation due to form variable dependency
  const { mutateAsync: updateRegistrations, isLoading: isUpdatingRegistrations } = useMutation('updateRegistrations');

  const {
    data,
    isFetching,
    isLoading,
    hasNextPage,
    fetchNextPage,
    refetch: refetchRegistrations,
  } = useInfiniteQuery(
    ['registrations',
      { endpoint: `registrations?fields=created_by,campaign.users,approval&filter=campaign.id:like:${campaign?.id}&filter=created_by.id:eq:${userID}&filter=head_of_family:ilike:${searchValue ?? ''}` }],
    { keepPreviousData: true, refetchOnMount: 'always', enabled: Boolean(campaign?.id && userID) },
  );
  useRefreshOnFocus(refetchRegistrations);

  const {
    data: { registrations: issuedRegistrations = [] } = {},
    refetch: refetchIssuedRegistrations,
  } = useQuery(
    ['issuedRegistrations', { endpoint: `registrations?fields=campaign,created_by&filter=campaign.id:like:${campaign?.id}&filter=updated_by.id:eq:${userID}&filter=issued:eq:1` }],
    { refetchOnMount: 'always', enabled: Boolean(campaign?.id && userID) },
  );
  useRefreshOnFocus(refetchIssuedRegistrations);

  const numberOfIssuedNets = useMemo(() => {
    if (issuedRegistrations?.length) {
      return issuedRegistrations.reduce((
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
  }, [issuedRegistrations]);

  const registrationData = useMemo(
    () => data?.pages?.flatMap((page) => page.registrations).filter(Boolean) ?? [],
    [data?.pages],
  );
  const total = useMemo(() => registrationData?.length ?? 0, [registrationData?.length]);

  const pendingRegs = useMemo(() => registrationData?.filter(({ approval }) => approval?.status && approval.status?.match(/pending/gi)) ?? [], [registrationData]);
  const pendingRegsCount = useMemo(() => pendingRegs?.length ?? 0, [pendingRegs]);

  const approvedRegs = useMemo(() => registrationData?.filter(({ approval }) => approval?.status && approval.status?.match(/^approved/gi)) ?? [], [registrationData]);
  const approvedRegsCount = useMemo(() => approvedRegs?.length ?? 0, [approvedRegs]);

  const isIssuance = useMemo(() => campaign?.parent?.status && campaign?.parent?.status?.match(/issuance/gi), [campaign?.parent?.status]);
  const isRegistering = useMemo(() => !isIssuance, [isIssuance]);

  const registrations = useMemo(() => {
    if (isRegistering) {
      return pendingRegs;
    }
    return approvedRegs;
  }, [approvedRegs, isRegistering, pendingRegs]);

  const approvedRegsPercentage = useMemo(
    () => numeral((approvedRegsCount / total) * 100).format('0'),
    [approvedRegsCount, total],
  );
  const pendingRegsPercentage = useMemo(
    () => numeral((pendingRegsCount / total) * 100).format('0'),
    [pendingRegsCount, total],
  );

  const campaignGoalPerUser = useMemo(
    () => params?.campaignGoalPerUser ?? 0,
    [params?.campaignGoalPerUser],
  );

  const approveRegistrations = useCallback(async () => {
    try {
      const formData = registrations.map(({ approval }) => ({ id: approval?.id, status: 'Approved' }));
      const result = await updateRegistrations([formData, { endpoint: 'approvals/bulky', method: 'POST' }]);
      console.log(formData, result);
      if (!result || result?.error) {
        throw new Error('Error updating registrations');
      }
      refetchRegistrations();
      toggleConfirmationModal();
      toggleModal();
    } catch (error) {
      toast.show({ description: t('Could not approve registrations') });
    }
  }, [
    refetchRegistrations,
    updateRegistrations,
    registrations,
    toggleConfirmationModal,
    toggleModal,
    toast,
    t,
  ]);

  const goViewHousehold = useCallback((parameters) => {
    navigation.navigate('RegistrationReview', parameters);
  }, [navigation]);

  return (
    <Box
      flex={1}
      paddingX={6}
      paddingY={3}
    >
      {isRegistering ? (
        <Box paddingX={6} paddingY={5} backgroundColor="#4D4C4C" borderRadius={10} marginBottom={6}>
          <HStack alignItems="center" mb={3}>
            <Icon as={<GraphBar />} />
            <Text color="white" fontSize={14} fontWeight={700} marginLeft={2}>{t('Registration Summary')}</Text>
          </HStack>
          <HStack alignItems="center" justifyContent="space-between">
            <HStack flex={1} alignItems="center" justifyContent="space-between">
              <Box>
                <ProgressPie
                  fill={Number(approvedRegsPercentage)}
                  tintColor="#FAED0B"
                  backgroundColor="#42C8F5"
                  isValueHidden
                />
              </Box>
              <Box>
                <Text color="lightgrey" fontSize={10}>{t('Approved')}</Text>
                <Text color="#FAED0B" fontSize={14} fontWeight={700}>{`${approvedRegsCount} (${approvedRegsPercentage}%)`}</Text>
              </Box>
              <Divider bg="white" mx={1} mb={1} alignSelf="flex-end" height={4} orientation="vertical" />
              <Box>
                <Text color="lightgrey" fontSize={10}>{t('Pending')}</Text>
                <Text color="#42C8F5" fontSize={14} fontWeight={700}>{`${pendingRegsCount} (${pendingRegsPercentage}%)`}</Text>
              </Box>
              <Box>
                <Text color="lightgrey" fontSize={10}>{t('Goal')}</Text>
                <Text color="white" fontSize={14} fontWeight={700}>{numeral(campaignGoalPerUser).format('0,0')}</Text>
              </Box>
            </HStack>
          </HStack>
        </Box>
      )
        : (
          <HStack space={2} marginBottom={1}>
            <Box flex={1}>
              <SearchInput
                name="search"
                control={control}
                height={41}
              />
            </Box>
          </HStack>
        )}
      {isRegistering ? <Text fontSize={14} fontWeight={700} marginBottom={1}>{t('All households')}</Text>
        : (
          <HStack marginBottom={1} justifyContent="space-between">
            <Text fontSize={14} fontWeight={700} marginBottom={1}>{t('Total issued nets')}</Text>
            <Text fontSize={14} fontWeight={700} marginBottom={1}>{numeral(numberOfIssuedNets).format('0,0')}</Text>
          </HStack>
        )}
      {!isLoading && !isFetching && !registrations?.length ? <Text color="grey">{t('No records found')}</Text> : null}
      {(isLoading || isFetching) ? <Spinner />
        : (
          <InfiniteScrollView
            flex={1}
            fetchNextPage={fetchNextPage}
            hasNextPage={hasNextPage}
          >
            {registrations.map((registration, index) => {
              const {
                id,
                head_of_family: name, number_of_family_members: noOfMembers,
              } = registration;
              const listLength = registrations.length - 1;
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
                  onPress={() => goViewHousehold(registration)}
                  endIcon={noOfMembers > 10 ? <Icon as={<MaterialIcons />} color="#B61414" name="flag" size={14} alt="" /> : null}
                  _stack={{
                    width: 'full',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  {name}
                </Button>
              );
            })}
          </InfiniteScrollView>
        )}
      {isRegistering
        ? (
          <>
            <HStack flex={1} alignItems="flex-end">
              <Button
                size="lg"
                height={60}
                colorScheme="primary"
                marginBottom={3}
                width="full"
                _text={{ fontSize: 16 }}
                onPress={toggleConfirmationModal}
                isDisabled={showConfirmationModal}
              >
                {t('Approve')}
              </Button>
            </HStack>
            <Modal
              show={showConfirmationModal}
              height={300}
              marginTop="auto"
              marginBottom={0}
              paddingTop={6}
              marginX={3.5}
            >
              <Box justifyContent="center">
                <Text textAlign="center" fontSize={12} color="#868585" marginBottom={6}>{t('Approve registrations list confirmation')}</Text>
                <HStack justifyContent="space-around" marginTop={1} marginBottom={3.5}>
                  <Button
                    size="lg"
                    height={16}
                    colorScheme="gray"
                    _text={{ fontSize: 16 }}
                    onPress={toggleConfirmationModal}
                  >
                    {t('Cancel')}
                  </Button>
                  <Button
                    size="lg"
                    height={16}
                    _text={{ fontSize: 16 }}
                    colorScheme="primary"
                    onPress={approveRegistrations}
                    isLoading={isUpdatingRegistrations}
                    isDisabled={isUpdatingRegistrations}
                  >
                    {t('Yes')}
                  </Button>
                </HStack>
              </Box>
            </Modal>
            <Modal
              show={showModal}
              height={300}
              marginTop="auto"
              marginBottom={0}
              paddingTop={6}
              marginX={3.5}
            >
              <Box justifyContent="center">
                <Icon as={<MaterialIcons />} alignSelf="center" color="#1E6312" name="check-circle" size={60} marginBottom={8} alt="" />
                <Text textAlign="center" fontSize={12} color="#868585" marginBottom={6}>{t('Details submitted successfully')}</Text>
                <Button
                  size="lg"
                  height={16}
                  marginTop={1}
                  marginBottom={3.5}
                  _text={{ fontSize: 16 }}
                  onPress={toggleModal}
                >
                  {t('Ok')}
                </Button>
              </Box>
            </Modal>
          </>
        ) : null}
    </Box>
  );
}
