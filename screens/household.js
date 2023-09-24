import {
  Box, Button, HStack, Text, Heading, Icon, useToast,
} from 'native-base';
import { useCallback, useMemo } from 'react';
import { openURL } from 'expo-linking';
import { useMutation } from 'react-query';
import { StackActions } from '@react-navigation/native';

import { useLocalization } from '../localization';
import KeyboardAwareScrollView from '../components/KeyboardAwareScrollView';
import OutgoingCall from '../components/svg/outgoingCall';
import { slicePhone } from '../helper/numeral';
import { useAuth } from '../hooks/useAuth';
import useToggle from '../hooks/useToggle';
import Modal from '../components/Modal';

export default function Household({ route, navigation }) {
  const { t } = useLocalization();

  const { user } = useAuth();

  const { mutateAsync: deleteRegistration, isLoading: isDeletingRegistration } = useMutation('deleteRegistration');

  const toast = useToast();

  const [showModal, toggleModal] = useToggle();

  const registration = useMemo(() => route?.params ?? {}, [route?.params]);

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

  const registrationStatus = useMemo(() => registration?.approval?.status ?? '', [registration?.approval?.status]);

  const goEditRegistration = useCallback(() => {
    const pushAction = StackActions.push('Register', {
      firstname: firstName, middlename: middleName, surname: lastName, ...registration,
    });
    navigation.dispatch(pushAction);
  }, [firstName, lastName, middleName, navigation, registration]);

  const goViewHouseholds = useCallback(() => {
    navigation.navigate('HouseholdsList');
  }, [navigation]);

  const makeCall = useCallback((tel = '000000000') => {
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

  const removeRegistration = useCallback(async () => {
    try {
      const result = await deleteRegistration([{}, { endpoint: `registrations/${registration?.id}`, method: 'DELETE' }]);

      if (result?.error) {
        throw new Error('Error deleting registration');
      }
      toggleModal();
      toast.show({
        description: 'Registration deleted successfully',
      });
      goViewHouseholds();
    } catch (error) {
      toast.show({
        description: 'Error deleting registration',
      });
    }
  }, [deleteRegistration, goViewHouseholds, registration?.id, toast, toggleModal]);

  return (
    <KeyboardAwareScrollView paddingX={4} paddingY={3}>
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
          <Text fontSize={14} fontWeight={700}>{registration?.age ?? ''}</Text>
        </Box>
        <Box>
          <Text fontSize={10} color="#868585" marginBottom={2}>{t('Middle name')}</Text>
          <Text fontSize={14} fontWeight={700} marginBottom={2}>{middleName}</Text>
          <Text fontSize={10} color="#868585" marginBottom={2}>{t('Gender')}</Text>
          <Text fontSize={14} fontWeight={700}>{registration?.gender ? t(registration?.gender) : ''}</Text>
        </Box>
        <Box>
          <Text fontSize={10} color="#868585" marginBottom={2}>{t('Surname')}</Text>
          <Text fontSize={14} fontWeight={700} marginBottom={2}>{lastName}</Text>
          <Text fontSize={10} color="#868585" marginBottom={2}>{t('Family members')}</Text>
          <Text fontSize={14} fontWeight={700}>{registration?.number_of_family_members ?? ''}</Text>
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
          <Text fontSize={10} color="#868585" marginBottom={2}>{t('Village/Zone')}</Text>
          <Text fontSize={14} fontWeight={700} marginBottom={2}>{registration?.street ?? ''}</Text>
          <Text fontSize={10} color="#868585" marginBottom={2}>{t('Primary phone')}</Text>
          <Text fontSize={14} fontWeight={700} color={registration?.phone_number ? 'dark' : undefined}>{registration?.phone_number ?? ''}</Text>
        </Box>
        <Box height="full">
          <Text fontSize={10} color="#868585" marginBottom={2}>{t('House number')}</Text>
          <Text fontSize={14} fontWeight={700} marginBottom={2}>{registration?.house_number ?? ''}</Text>
        </Box>
        <Box justifyContent="space-between">
          <Box flex={1}>
            <Text fontSize={10} color="#868585" marginBottom={2}>{t('Number of nets')}</Text>
            <Text fontSize={14} fontWeight={700} marginBottom={2}>{registration?.nets ?? ''}</Text>
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
            onPress={() => makeCall(registration?.phone_number ?? '')}
          >
            {t('Call')}
          </Button>
        </Box>
      </HStack>
      <Heading fontSize={18} textAlign="center" marginTop={6} marginBottom={8}>{t('Coupon number')}</Heading>
      <HStack justifyContent="space-around" marginBottom={12}>
        {[...`${registration?.code ?? ''}`].map((key, index) => (
          <Box
            key={String(key + index)}
            backgroundColor="darkred"
            boxSize={38}
            borderRadius={10}
            justifyContent="center"
            alignItems="center"
            // marginRight={2}
          >
            <Text
              color="white"
              fontSize={18}
              fontWeight={700}
            >
              {key}
            </Text>
          </Box>
        ))}
      </HStack>
      {!registrationStatus.match(/^approved/gi) && !user?.isSheha ? (
        <>
          <Button
            size="lg"
            height={60}
            colorScheme="primary"
            marginBottom={4}
            width="full"
            _text={{ fontSize: 16 }}
            onPress={goEditRegistration}
          >
            {t('Edit')}
          </Button>
          <Button
            size="sm"
            variant="link"
            marginBottom={2}
            textAlign="right"
            _text={{ fontSize: 14, color: 'danger' }}
            onPress={toggleModal}
            isLoading={isDeletingRegistration}
            disabled={isDeletingRegistration}
          >
            {t('Delete')}
          </Button>
          <Modal
            show={showModal}
            height={300}
            marginTop="auto"
            marginBottom={0}
            paddingTop={6}
            marginX={3.5}
          >
            <Box justifyContent="center">
              <Text textAlign="center" fontSize={12} color="#868585" marginBottom={6}>{t('Delete registration confirmation')}</Text>
              <HStack justifyContent="space-around" marginTop={1} marginBottom={3.5}>
                <Button
                  size="lg"
                  height={16}
                  colorScheme="gray"
                  _text={{ fontSize: 16 }}
                  onPress={toggleModal}
                >
                  {t('Cancel')}
                </Button>
                <Button
                  size="lg"
                  height={16}
                  _text={{ fontSize: 16 }}
                  colorScheme="dangerScheme"
                  onPress={removeRegistration}
                  isLoading={isDeletingRegistration}
                  disabled={isDeletingRegistration}
                >
                  {t('Yes')}
                </Button>
              </HStack>
            </Box>
          </Modal>
        </>
      ) : null}
    </KeyboardAwareScrollView>
  );
}
