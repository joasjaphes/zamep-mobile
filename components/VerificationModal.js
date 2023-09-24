import {
  Box, Button, HStack, Text, Heading, Icon, Actionsheet,
} from 'native-base';
import { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { useQuery } from 'react-query';

import { MaterialIcons } from '@expo/vector-icons';
import { useLocalization } from '../localization';
import { useAuth } from '../hooks/useAuth';
import useToggle from '../hooks/useToggle';
import VerificationInput from './VerificationInput';
import PasswordInput from './PasswordInput';

export default function VerificationModal({ navigation }) {
  const { t } = useLocalization();

  // const { data: { payload: { value: ads } = {} } = {} } = useQuery(['advertisements', { endpoint: 'get-settings', body: { key: 'home_slider' } }], { refetchOnMount: 'always' });

  const {
    control, handleSubmit, formState: { isValid }, watch, setError,
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      phone: '',
      otp: '',
    },
  });

  const otp = watch('otp');
  const password = watch('password');

  const [showModal, toggleModal] = useToggle();
  const [isVerifySuccessful, showSuccess] = useToggle();

  return (
    <>
      <Button
        size="md"
        variant="link"
        marginBottom={8}
        textAlign="center"
        _text={{ fontSize: 14, color: 'dark' }}
        onPress={toggleModal}
      >
        {t('Recover password')}
      </Button>
      <Actionsheet isOpen={showModal} onClose={toggleModal}>
        <Actionsheet.Content alignItems="stretch" padding={6}>
          {!isVerifySuccessful
            ? (
              <>
                <Heading textAlign="center" fontSize={16} fontWeight={700} marginBottom={4}>{t('Verification')}</Heading>
                <Text textAlign="center" fontSize={12} color="#868585" marginBottom={4}>{t('Enter OTP sent to your number to reset password')}</Text>
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
                  disabled={otp.length < 4}
                  onPress={showSuccess}
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
            )
            : (
              <Box>
                {!isVerifySuccessful ? (
                  <>
                    <Heading textAlign="center" fontSize={16} fontWeight={700} marginBottom={4}>{t('New Password')}</Heading>
                    <PasswordInput
                      name="password"
                      placeholder={t('Password')}
                      control={control}
                    />
                    <PasswordInput
                      name="confirm-password"
                      placeholder={t('Re-enter Password')}
                      control={control}
                      rules={{
                        validate: (value) => value === password.current || 'Passwords do not match',
                      }}
                    />
                    <Button
                      size="lg"
                      height={16}
                      marginTop={1}
                      marginBottom={3.5}
                      _text={{ fontSize: 16 }}
                      disabled={!isValid}
                      onPress={showSuccess}
                    >
                      {t('Save Password')}
                    </Button>
                  </>
                )
                  : (
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
                  )}
              </Box>
            )}
        </Actionsheet.Content>
      </Actionsheet>
    </>
  );
}
