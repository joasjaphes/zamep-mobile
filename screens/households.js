import {
  Box, HStack, Text, Button, Spinner,
} from 'native-base';
import { useCallback, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { StackActions } from '@react-navigation/native';

import { useInfiniteQuery } from 'react-query';
import { useLocalization } from '../localization';
import InfiniteScrollView from '../components/InfiniteScrollView';
import SearchInput from '../components/SearchInput';
import { useCampaign } from '../hooks/useCampaign';
import { useAuth } from '../hooks/useAuth';
import useRefreshOnFocus from '../hooks/useRefreshOnFocus';

/**
 * Households Screen
 * @param {object} props
 * @returns {React.ReactElement}
 */
export default function Households({ navigation }) {
  const { t } = useLocalization();

  const { user: { isSheha, id: userID } = {} } = useAuth();
  const { campaign = {} } = useCampaign();

  const { control, watch } = useForm({
    mode: 'onChange',
    defaultValues: {
      search: '',
    },
  });

  // subscribe to changes in search value
  const searchValue = watch('search');

  const {
    data,
    isFetching,
    isLoading,
    hasNextPage,
    fetchNextPage,
    refetch: refetchRegistrations,
  } = useInfiniteQuery(
    ['households', {
      endpoint: `registrations?fields=campaign,approval,created_by&filter=campaign.id:like:${campaign?.id}${!isSheha ? `&filter=created_by.id:like:${userID}&filter=approval.status:like:disapproved&filter=approval.status:like:pending` : ''}&filter=head_of_family:ilike:${searchValue}`,
    }],
    {
      keepPreviousData: true, refetchOnMount: 'always', refetchOnWindowFocus: 'always', enabled: Boolean(campaign?.id && userID),
    },
  );
  useRefreshOnFocus(refetchRegistrations);

  const households = useMemo(
    () => data?.pages?.flatMap((page) => page.registrations).filter(Boolean) ?? [],
    [data?.pages],
  );

  const goViewHousehold = useCallback((household) => {
    navigation.navigate('Household', household);
  }, [navigation]);

  const RegisterButton = useMemo(() => {
    if (isSheha) {
      return null;
    }
    const goRegister = () => {
      navigation.dispatch(
        StackActions.push('Register', { toBeCleared: true }),
      );
      // navigation.navigate('Register');
    };

    return (
      <Button
        size="sm"
        px={5}
        py={1}
        _text={{
          fontSize: 12,
        }}
        colorScheme="primary"
        height={41}
        onPress={goRegister}
      >
        {t('Register')}
      </Button>
    );
  }, [isSheha, navigation, t]);

  return (
    <Box
      flex={1}
      paddingX={6}
      paddingY={3}
    >
      <HStack space={2} marginBottom={1}>
        <Box flex={1}>
          <SearchInput
            name="search"
            control={control}
            height={41}
          />
        </Box>
        {RegisterButton}
      </HStack>
      {!isLoading && !isFetching && !households?.length ? <Text color="grey">{t('No records found')}</Text> : null}
      {(isLoading || isFetching) ? <Spinner />
        : (
          <InfiniteScrollView
            flex={1}
            fetchNextPage={fetchNextPage}
            hasNextPage={hasNextPage}
          >
            {households.map((household, index) => {
              const { head_of_family: name, id } = household;
              const listLength = households.length - 1;
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
                  onPress={() => goViewHousehold(household)}
                >
                  {name}
                </Button>
              );
            })}
          </InfiniteScrollView>
        )}
    </Box>
  );
}
