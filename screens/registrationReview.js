import {
  Box, Button, HStack, Text, Heading, Icon, useToast,
} from 'native-base';
import { useCallback, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation } from 'react-query';
import { openURL } from 'expo-linking';
import { MaterialIcons } from '@expo/vector-icons';

import { useLocalization } from '../localization';
import KeyboardAwareScrollView from '../components/KeyboardAwareScrollView';
import OutgoingCall from '../components/svg/outgoingCall';
import { slicePhone } from '../helper/numeral';
import Select from '../components/Select';
import useToggle from '../hooks/useToggle';
import Modal from '../components/Modal';
import { useAuth } from '../hooks/useAuth';

export default function RegistrationReview({ route, navigation }) {
  const { t } = useLocalization();

  const params = route?.params ?? {};
  const registration = params;

  const { user } = useAuth();

  const [showModal, toggleModal] = useToggle(false);

  // useMutation due to form variable dependency
  const { mutateAsync: updateRegistration, isLoading: isUpdatingRegistration } = useMutation('updateRegistration');

  const {
    control, handleSubmit, formState: { isValid },
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      reason: '',
    },
  });

  const toast = useToast();

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

  const goToHouseholds = useCallback(() => {
    toggleModal();
    navigation.goBack();
  }, [navigation, toggleModal]);

  const disapproveRegistration = useCallback(async (data) => {
    try {
      const result = await updateRegistration([{ status: 'Disapproved', reason: data.reason }, { endpoint: `approvals/${registration?.approval?.id}`, method: 'PUT' }]);
      if (!result || result?.error) {
        throw new Error('Error updating registration');
      }
      toggleModal();
      // refetchRegistration();
    } catch (error) {
      toast.show({ description: t('Could not disapprove registration') });
    }
  }, [registration?.approval?.id, t, toast, toggleModal, updateRegistration]);

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
          <Text fontSize={14} fontWeight={700}>{registration?.age ?? '-'}</Text>
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
          <Text fontSize={14} fontWeight={700}>{registration?.number_of_family_members}</Text>
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
          <Text fontSize={10} color="#868585" marginBottom={2}>{t('Primary phone')}</Text>
          <Text fontSize={14} fontWeight={700} color={registration?.phone_number ? 'dark' : undefined}>{registration?.phone_number ?? '-'}</Text>
        </Box>
        <Box justifyContent="space-between">
          <Box>
            <Text fontSize={10} color="#868585" marginBottom={2}>{t('Number of nets')}</Text>
            <Text fontSize={14} fontWeight={700} marginBottom={2}>
              {registration?.nets
              ?? registration?.number_of_nets
              ?? Math.ceil(registration?.number_of_family_members ?? 0 / 2)}
            </Text>
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
            onPress={() => makeCall(registration?.phone_number)}
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
      {user?.isSheha && registrationStatus.match(/pending/i) ? (
        <>
          <Box padding={6} backgroundColor="light" borderRadius={10} marginBottom={5}>
            <Text fontSize={14}>{t('Disapprove this household?')}</Text>
            <Select
              name="reason"
              placeholder={t('Reason')}
              textAlign="left"
              control={control}
              options={[
                { label: t('Unfinished data'), value: 'Unfinished data' },
                { label: t('Wrong data'), value: 'Wrong data' },
                { label: t('I don\'t recorgnize the household'), value: 'I don\'t recorgnize the household' },
              ]}
              backgroundColor="#FFF"
              rules={{
                required: t('Please select reason'),
              }}
            />
            <Button
              size="lg"
              height={60}
              marginTop={1}
              marginBottom={2.5}
              _text={{ fontSize: 16 }}
              onPress={handleSubmit(disapproveRegistration)}
              isLoading={isUpdatingRegistration}
              isDisabled={!isValid || isUpdatingRegistration}
            >
              {t('Disapprove')}
            </Button>
          </Box>
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
                onPress={goToHouseholds}
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
