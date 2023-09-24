import { useCallback, useMemo } from 'react';
import {
  Actionsheet, Box, Button, HStack, Text, Heading, Icon, Image, useToast,
} from 'native-base';
import { StackActions } from '@react-navigation/native';
import { useForm } from 'react-hook-form';
import { openURL } from 'expo-linking';

import { useLocalization } from '../localization';
import KeyboardAwareScrollView from '../components/KeyboardAwareScrollView';
import OutgoingCall from '../components/svg/outgoingCall';
import useToggle from '../hooks/useToggle';
import VerificationInput from '../components/VerificationInput';
import { slicePhone } from '../helper/numeral';

const RegisterSuccessImage = require('../assets/register-success.png');

export default function RegisterConfirm({ navigation, route }) {
  const { t } = useLocalization();

  const toast = useToast();

  const params = useMemo(() => route?.params ?? {}, [route?.params]);

  const {
    control, handleSubmit, watch,
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      otp: '',
    },
  });
  const otp = watch('otp');

  const [showModal, toggleModal] = useToggle();
  const [isVerifySuccessful, showSuccess] = useToggle(true);

  const numberOfNets = useMemo(
    () => Math.ceil(
      (params?.number_of_family_members ?? 0) / 2,
    ),
    [params?.number_of_family_members],
  );

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

  const goViewHouseholds = useCallback(() => {
    toggleModal();
    navigation.dispatch(
      StackActions.replace('HouseholdsList'),
    );
  }, [navigation, toggleModal]);

  const goEditRegistration = useCallback(() => {
    const pushAction = StackActions.push('Register', params);
    navigation.dispatch(pushAction);
  }, [navigation, params]);

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
          <Text fontSize={14} fontWeight={700} marginBottom={2}>{params?.firstname ?? ''}</Text>
          <Text fontSize={10} color="#868585" marginBottom={2}>{t('Age')}</Text>
          <Text fontSize={14} fontWeight={700}>{params?.age ?? ''}</Text>
        </Box>
        <Box>
          <Text fontSize={10} color="#868585" marginBottom={2}>{t('Middle name')}</Text>
          <Text fontSize={14} fontWeight={700} marginBottom={2}>{params?.middlename ?? ''}</Text>
          <Text fontSize={10} color="#868585" marginBottom={2}>{t('Gender')}</Text>
          <Text fontSize={14} fontWeight={700}>{params?.gender ? t(params?.gender) : ''}</Text>
        </Box>
        <Box>
          <Text fontSize={10} color="#868585" marginBottom={2}>{t('Surname')}</Text>
          <Text fontSize={14} fontWeight={700} marginBottom={2}>{params?.surname ?? ''}</Text>
          <Text fontSize={10} color="#868585" marginBottom={2}>{t('Family members')}</Text>
          <Text fontSize={14} fontWeight={700}>{params?.number_of_family_members ?? ''}</Text>
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
          <Text fontSize={14} fontWeight={700} marginBottom={2}>{params?.street ?? ''}</Text>
          <Text fontSize={10} color="#868585" marginBottom={2}>{t('Primary phone')}</Text>
          <Text fontSize={14} fontWeight={700} color={params?.phone_number ? 'dark' : undefined}>{params?.phone_number || '-'}</Text>
        </Box>
        <Box height="full">
          <Text fontSize={10} color="#868585" marginBottom={2}>{t('House number')}</Text>
          <Text fontSize={14} fontWeight={700} marginBottom={2}>{params?.house_number ?? ''}</Text>
        </Box>
        <Box justifyContent="space-between">
          <Box flex={1}>
            <Text fontSize={10} color="#868585" marginBottom={2}>{t('Number of nets')}</Text>
            <Text fontSize={14} fontWeight={700} marginBottom={2}>
              {numberOfNets}
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
            onPress={() => makeCall(params?.phone_number)}
          >
            {t('Call')}
          </Button>
        </Box>
      </HStack>
      <Heading fontSize={18} textAlign="center" marginTop={6} marginBottom={8}>{t('Coupon number')}</Heading>
      <HStack justifyContent="space-around" marginBottom={12}>
        {[...`${params?.code ?? ''}`].map((key, index) => (
          <Box
            key={String(index + key)}
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
      <HStack flex={1} alignItems="flex-end">
        <Button
          size="lg"
          height={60}
          colorScheme="primary"
          marginBottom={5}
          width="full"
          _text={{ fontSize: 16 }}
          onPress={goViewHouseholds}
        >
          {t('Ok')}
        </Button>
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
      </HStack>
      <Actionsheet isOpen={showModal} onClose={toggleModal}>
        <Actionsheet.Content
          alignItems="stretch"
          height={!isVerifySuccessful ? 350 : 300}
          padding={6}
        >
          {!isVerifySuccessful ? (
            <>
              <Heading textAlign="center" fontSize={16} fontWeight={700} marginBottom={4}>{t('Verification')}</Heading>
              <Text textAlign="center" fontSize={12} color="#868585" marginBottom={4}>{t('Enter verification PIN from', { name: `${params?.firstname} ${params?.surname}` })}</Text>
              <VerificationInput
                name="otp"
                control={control}
                marginTop={3}
                marginBottom={6}
              />
              <Button
                size="lg"
                height={16}
                marginTop={1}
                marginBottom={3.5}
                _text={{ fontSize: 16 }}
                onPress={handleSubmit(showSuccess)}
                disabled={otp.length < 4}
              >
                {t('Verify')}
              </Button>
              <Button
                size="md"
                variant="link"
                marginBottom={3}
                textAlign="right"
                _text={{ fontSize: 14, color: 'dark', textDecorationLine: 'underline' }}
              >
                {t('Resend OTP')}
              </Button>
            </>
          ) : (
            <Box justifyContent="center">
              <Image source={RegisterSuccessImage} height={70} width={74} alignSelf="center" marginBottom={8} alt="" />
              <Text textAlign="center" fontSize={12} color="#868585" marginBottom={6}>{t('Name is registered', { name: `${params?.firstname} ${params?.surname}` })}</Text>
              <Button
                size="lg"
                height={16}
                marginTop={1}
                marginBottom={3.5}
                _text={{ fontSize: 16 }}
                onPress={goViewHouseholds}
              >
                {t('Ok')}
              </Button>
            </Box>
          )}
        </Actionsheet.Content>
      </Actionsheet>
    </KeyboardAwareScrollView>
  );
}
