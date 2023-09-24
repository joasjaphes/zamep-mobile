import {
  Avatar,
  Box, Button, Text, useToast,
} from 'native-base';
import { useForm } from 'react-hook-form';
import { useQuery } from 'react-query';
import { useCallback } from 'react';
import { useLocalization } from '../localization';
import Select from '../components/Select';
import { useAuth } from '../hooks/useAuth';
import { useCampaign } from '../hooks/useCampaign';

const FallbackImage = require('../assets/user-fallback.png');

export default function SelectCampaign() {
  const { t } = useLocalization();

  const { user: { firstName = '', initials, location } } = useAuth();
  const { setCampaign } = useCampaign();

  const toast = useToast();

  const { data: { campaigns = [] } = {} } = useQuery([
    'campaigns',
    { endpoint: `campaigns?order=date_created:desc&fields=location,parent&filter=parent:eq:!null&filter=parent.active:eq:1&filter=location.id:like:${location}` },
  ]);

  const { control, handleSubmit, formState: { isValid } } = useForm({
    mode: 'onChange',
    defaultValues: {
      campaign: '',
    },
  });

  const onSubmit = useCallback(async (data) => {
    try {
      const campaign = campaigns?.find(({ id }) => id === data?.campaign);
      setCampaign(campaign);
      toast.show({ description: t('Login successful') });
    } catch (error) {
      toast.show({ description: t('Error logging in') });
    }
  }, [campaigns, setCampaign, t, toast]);

  return (
    <Box flex={1} paddingX={4} paddingY={10}>
      <Box alignItems="center" marginBottom={6}>
        <Avatar
          bg="gray.200"
          alignSelf="center"
          size="xl"
          marginBottom={8}
          source={FallbackImage}
        >
          {initials}
        </Avatar>
        <Text
          fontWeight={700}
          fontSize={14}
          top={-5}
          noOfLines={2}
          textAlign="center"
        >
          {t('Welcome back name', { name: firstName })}
        </Text>
      </Box>
      <Box padding={6} backgroundColor="light" borderRadius={10}>
        <Select
          name="campaign"
          placeholder={t('Select campaign')}
          textAlign="left"
          control={control}
          options={campaigns?.map(({ id, name }) => ({ label: name, value: id }))}
          backgroundColor="#FFF"
          rules={{
            required: t('Please select campaign'),
          }}
        />
        <Button
          size="lg"
          height={60}
          marginTop={1}
          marginBottom={2.5}
          _text={{ fontSize: 16 }}
          onPress={handleSubmit(onSubmit)}
          // isLoading={isUpdatingUser}
          isDisabled={!isValid}
        >
          {t('Proceed')}
        </Button>
      </Box>
    </Box>
  );
}
