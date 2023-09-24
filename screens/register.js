import {
  Button, HStack, Text, Heading, useToast,
} from 'native-base';
import { StackActions } from '@react-navigation/native';
import { useCallback, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation } from 'react-query';

import { useLocalization } from '../localization';
import KeyboardAwareScrollView from '../components/KeyboardAwareScrollView';
import Input from '../components/Input';
import Card from '../components/Card';
import { useCampaign } from '../hooks/useCampaign';
import PhoneInput from '../components/PhoneInput';
import StreetInput from '../components/StreetInput';
import RadioGroup from '../components/RadioGroup';

const defaultValues = {
  firstname: '',
  middlename: '',
  surname: '',
  age: '',
  gender: 'Male',
  location_type: 'Zone',
  street: '',
  phone_number: '',
  number_of_family_members: '',
  house_number: '',
  pin: '',
};

export default function Register({ route, navigation }) {
  const { t } = useLocalization();

  const toast = useToast();

  // useMutation due to form variable dependency
  const { mutateAsync: createRegistration, isLoading } = useMutation('createRegistration');
  const { mutateAsync: updateRegistration, isLoading: isLoadingUpdate } = useMutation('updateRegistration');
  const { mutate: resetDisapproval } = useMutation('resetDisapproval');

  const { campaign = {} } = useCampaign();

  const {
    control, handleSubmit, formState: { isValid, isDirty }, watch, reset,
  } = useForm({
    mode: 'onChange',
    defaultValues,
  });

  const locationType = watch('location_type');

  /**
   * registration to be edited
   */
  const prevRegistration = useMemo(() => (
    !route?.params?.toBeCleared && route?.params
  ), [route?.params]);

  useEffect(() => {
    if (prevRegistration) {
      // if registration to edit has been passed, update form with its values
      reset({
        ...prevRegistration,
        age: String(prevRegistration?.age ?? ''),
        number_of_family_members: String(prevRegistration?.number_of_family_members ?? ''),
      });
    }
  }, [prevRegistration, reset]);

  /**
   * params to indicate new reg
   */
  const toBeCleared = useMemo(() => route?.params?.toBeCleared, [route?.params?.toBeCleared]);

  useEffect(() => {
    if (toBeCleared) {
      console.log(defaultValues);
      // if registration has to be cleared
      reset(defaultValues);
    }
  }, [toBeCleared, reset]);

  const goConfirmRegistration = useCallback((params) => {
    navigation.dispatch(
      StackActions.replace('RegisterConfirm', params),
    );
  }, [navigation]);

  const goBackToRegistration = useCallback(() => {
    navigation.dispatch(
      StackActions.replace('HouseholdsList'),
    );
  }, [navigation]);

  const onSubmit = useCallback(async (data) => {
    try {
      const formData = {
        ...data,
        // code: '',
        head_of_family: `${data?.firstname}${data?.middlename ? ` ${data?.middlename} ` : ' '}${data?.surname}`,
        campaign,
        age: Number(data.age),
        number_of_family_members: Number(data.number_of_family_members),
      };

      let result;
      if (prevRegistration) {
        result = await updateRegistration([formData, { endpoint: `registrations/${prevRegistration?.id}`, method: 'PUT' }]);

        if (result && !result?.error && prevRegistration?.approval?.status?.match(/disapproved/gi)) {
          // reset disapproval to pending if edited
          resetDisapproval([{ status: 'Pending' }, { endpoint: `approvals/${prevRegistration?.approval?.id}`, method: 'PUT' }]);
        }
      } else {
        result = await createRegistration([formData, { endpoint: 'registrations', method: 'POST' }]);
      }

      if (!result || result?.error) {
        throw new Error('Error creating registration');
      }

      toast.show({ description: t(`Registration ${prevRegistration ? 'updated' : 'created'} successfully`) });

      // reset isDirty state
      reset(data);

      if (!prevRegistration) {
        goConfirmRegistration({ ...formData, ...result });
      } else {
        goBackToRegistration({ ...formData, ...result });
      }
    } catch (error) {
      toast.show({ description: t(`Error ${prevRegistration ? 'updating' : 'creating'} registration`) });
    }
  }, [
    campaign,
    createRegistration,
    goConfirmRegistration,
    goBackToRegistration,
    prevRegistration,
    reset, t,
    toast,
    updateRegistration,
    resetDisapproval,
  ]);

  return (
    <KeyboardAwareScrollView
      paddingX={4}
      paddingY={3}
      zIndex={1}
      nestedScrollEnabled
      keyboardDismissMode="on-drag"
      keyboardShouldPersistTaps="handled"
      contentInsetAdjustmentBehavior="automatic"
      dismissable={false}
    >
      <Card>
        <Heading fontSize={16} marginBottom={3}>{t('Head of household')}</Heading>
        <Input
          name="firstname"
          placeholder={t('First name')}
          autoComplete="given-name"
          autoCapitalize="words"
          control={control}
          maxLength={25}
          rules={{
            required: t('Please enter first name'),
          }}
        />
        <Input
          name="middlename"
          placeholder={t('Middle name (optional)')}
          autoComplete="name-middle"
          autoCapitalize="words"
          control={control}
          maxLength={25}
        />
        <Input
          name="surname"
          placeholder={t('Surname')}
          autoComplete="family-name"
          autoCapitalize="words"
          control={control}
          maxLength={25}
          rules={{
            required: t('Please enter surname'),
          }}
        />
        <Input
          name="age"
          placeholder={t('Age')}
          keyboardType="number-pad"
          control={control}
          maxLength={2}
          rules={{
            required: t('Please enter age'),
            validate: (value) => Number(value) >= 18 || t('Age should not be below 18'),
          }}
        />
        <HStack
          alignItems="center"
          justifyContent="space-between"
          backgroundColor="#F5F5F5"
          borderRadius={10}
          padding={4}
          marginBottom={4}
        >
          <Text minWidth={50} fontSize={12} fontWeight={700}>{t('Sex')}</Text>
          <RadioGroup
            name="gender"
            defaultValue="Male"
            control={control}
            accessibilityLabel="pick gender"
            options={[
              { label: t('Male'), value: 'Male' },
              { label: t('Female'), value: 'Female' },
            ]}
          />
        </HStack>
        <Input
          name="number_of_family_members"
          placeholder={t('Number of family members')}
          autoComplete="off"
          keyboardType="number-pad"
          control={control}
          maxLength={2}
          rules={{
            required: t('Please enter number of family members'),
            validate: (value) => Number(value) <= 20 || t('Number should not exceed 20'),
          }}
        />
      </Card>
      {/* Address & Contacts section */}
      <Card>
        <Heading fontSize={16} marginBottom={3}>{t('Address & Contacts')}</Heading>
        <HStack
          alignItems="center"
          justifyContent="space-between"
          backgroundColor="#F5F5F5"
          borderRadius={10}
          padding={4}
          marginBottom={4}
        >
          <Text minWidth={50} fontSize={12} fontWeight={700}>{t('Location')}</Text>
          <RadioGroup
            name="location_type"
            defaultValue="Zone"
            control={control}
            accessibilityLabel="pick shehia type"
            options={[
              { label: t('Zone'), value: 'Zone' },
              { label: t('Village'), value: 'Village' },
            ]}
          />
        </HStack>
        <StreetInput
          control={control}
          defaultValue={prevRegistration?.street}
          type={locationType}
        />
        <Input
          name="house_number"
          placeholder={t('House number')}
          autoComplete="off"
          control={control}
          maxLength={8}
          rules={{
            required: t('Please enter house number'),
          }}
        />
        <PhoneInput
          placeholder={t('Phone number (optional)')}
          name="phone_number"
          control={control}
        />
      </Card>
      <HStack flex={1} alignItems="flex-end">
        <Button
          size="lg"
          height={60}
          colorScheme="primary"
          marginBottom={5}
          width="full"
          _text={{ fontSize: 16 }}
          onPress={handleSubmit(onSubmit)}
          isLoading={isLoading || isLoadingUpdate}
          disabled={!isValid || !isDirty}
        >
          {t('Submit')}
        </Button>
      </HStack>
    </KeyboardAwareScrollView>
  );
}
