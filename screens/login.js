import { Image } from 'react-native';
import {
  Box, Button, Heading, useToast,
} from 'native-base';
import { useForm } from 'react-hook-form';
import { useCallback, useEffect } from 'react';
import { useMutation } from 'react-query';

import { useLocalization } from '../localization';
import { useAuth } from '../hooks/useAuth';
import KeyboardAwareScrollView from '../components/KeyboardAwareScrollView';
import PasswordInput from '../components/PasswordInput';
import PhoneInput from '../components/PhoneInput';
import { getValueFor } from '../helper/store';
import { useCampaign } from '../hooks/useCampaign';
import ResendPasswordModal from '../components/ResendPasswordModal';

const Logo = require('../assets/logo.png');

/**
 * Login Screen
 * @param {object} props
 * @returns {React.ReactElement}
 */
export default function Login() {
  const { t } = useLocalization();

  const { login, isLoggingIn } = useAuth();
  const { setCampaign } = useCampaign();

  // useMutation due to form variable dependency
  const { mutateAsync: getCampaign /* isLoading */ } = useMutation('getCampaign');

  const toast = useToast();

  const findCampaign = useCallback(async (location) => {
    if (!location) {
      throw new Error('Error getting campaign');
    }
    const queriedCampaign = await getCampaign([{}, { endpoint: `campaigns?fields=location,parent.location&filter=parent:eq:!null&filter=parent.active:eq:1&filter=location.id:like:${location}` }]);

    if (!queriedCampaign || queriedCampaign?.error || !queriedCampaign?.campaigns?.[0]) {
      // request failed
      toast.show({ description: t('Campaign could not be found') });
      return;
    }
    setCampaign(queriedCampaign.campaigns[0]);
    toast.show({ description: t('Campaign found') });
  }, [getCampaign, setCampaign, t, toast]);

  const {
    control, handleSubmit, formState: { isValid }, watch, setError, setValue,
  } = useForm({
    mode: 'onTouched',
    defaultValues: {
      phone: '',
      password: '',
    },
  });

  // subscribe to changes in phone number
  const phone = watch('phone');

  const getStoredPhone = useCallback(async () => {
    // autofill form with previously used phone number
    const storedPhone = await getValueFor('phone');
    if (storedPhone) {
      setValue('phone', storedPhone);
    }
  }, [setValue]);

  const getStoredPassword = useCallback(async () => {
    // autofill form with previously used phone number
    const storedPassword = await getValueFor('password');
    if (storedPassword) {
      setValue('password', storedPassword);
    }
  }, [setValue]);

  useEffect(() => {
    getStoredPhone();
  }, [getStoredPhone]);

  useEffect(() => {
    getStoredPassword();
  }, [getStoredPassword]);

  const onSubmit = useCallback(async (data) => {
    try {
      const result = await login(data.phone, data.password);

      if (result?.error) {
        switch (result?.error) {
          case 'User disabled':
            toast.show({ description: t('User not enabled to login') });
            return;
          default:
            toast.show({ description: t('Invalid Username or Password') });
            setError('password', { type: 'custom', message: t('Wrong password, try again') });
            return;
        }
      }

      if (!result) {
        // request failed
        throw new Error('Error logging in');
      }

      // login successful
      toast.show({ description: t('Login successful') });
      //
      const location = result?.locations?.find(({ level }) => level >= 4)?.id;
      await findCampaign(location);
    } catch (error) {
      // console.log(error);
      toast.show({ description: t('Error logging in') });
    }
  }, [findCampaign, login, setError, t, toast]);

  return (
    <KeyboardAwareScrollView>
      <Box flex={1} paddingX={6} paddingY={20}>
        <Box alignItems="center" marginBottom={6}>
          <Image source={Logo} style={{ height: 100, width: 100, resizeMode: 'contain' }} />
        </Box>
        <Heading
          alignSelf="center"
          fontWeight={700}
          fontSize={18}
          marginBottom={8}
          textTransform="uppercase"
        >
          {t('Login')}
        </Heading>
        <PhoneInput
          control={control}
          required
        />
        <PasswordInput
          name="password"
          placeholder={t('Password')}
          control={control}
          rules={{
            required: t('Please enter Password'),
          }}
        />
        <Button
          size="lg"
          height={60}
          marginBottom={5}
          _text={{ fontSize: 16 }}
          onPress={handleSubmit(onSubmit)}
          isLoading={isLoggingIn}
          isDisabled={!isValid || isLoggingIn}
        >
          {t('Log in')}
        </Button>
        <ResendPasswordModal phone={phone} />
      </Box>
    </KeyboardAwareScrollView>
  );
}
