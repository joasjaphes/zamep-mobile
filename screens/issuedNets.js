import {
  Box, HStack, Text, Button, Spinner,
} from 'native-base';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';

import { useInfiniteQuery } from 'react-query';
import { useLocalization } from '../localization';
import InfiniteScrollView from '../components/InfiniteScrollView';
import SearchInput from '../components/SearchInput';
import { useCampaign } from '../hooks/useCampaign';
import useRefreshOnFocus from '../hooks/useRefreshOnFocus';
import { useAuth } from '../hooks/useAuth';

/**
 * Issued nets Screen
 * @param {object} props
 * @returns {React.ReactElement}
 */
export default function IssuedNets() {
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
    ['issuedNets', {
      endpoint: `registrations?fields=campaign,created_by&filter=campaign.id:like:${campaign?.id}${!isSheha ? `&filter=created_by.id:like:${userID}` : ''}&filter=issued:eq:1&filter=head_of_family:ilike:${searchValue}`,
    }],
    { keepPreviousData: true, refetchOnMount: 'always', enabled: Boolean(campaign?.id && userID) },
  );

  useRefreshOnFocus(refetchRegistrations);

  const clients = useMemo(
    () => data?.pages?.flatMap((page) => page.registrations).filter(Boolean) ?? [],
    [data?.pages],
  );

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
      </HStack>
      {!isLoading && !isFetching && !clients?.length ? <Text color="grey">{t('No records found')}</Text> : null}
      {(isLoading || isFetching) ? <Spinner />
        : (
          <InfiniteScrollView
            flex={1}
            fetchNextPage={fetchNextPage}
            hasNextPage={hasNextPage}
          >
            {clients.map((net, index) => {
              const { id, head_of_family: name, nets } = net;
              const listLength = clients.length - 1;
              return (
                <HStack
                  key={id}
                  width="full"
                  paddingY={2}
                  paddingX={4}
                  paddingRight={5}
                  backgroundColor={index % 2 ? '#F5F5F5' : '#EDEDED'}
                  borderRadius={(index !== 0 && index !== listLength) ? 0 : 10}
                  borderTopRadius={(listLength && index === listLength) ? 0 : undefined}
                  borderBottomRadius={(listLength && index === 0) ? 0 : undefined}
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Button
                    width="full"
                    variant="link"
                    color="primary.900"
                    px={0}
                    py={0}
                    bg={index % 2 ? '#F5F5F5' : '#EDEDED'}
                    borderRadius={(index !== 0 && index !== listLength) ? 0 : undefined}
                    borderTopRadius={(listLength && index === listLength) ? 0 : undefined}
                    borderBottomRadius={(listLength && index === 0) ? 0 : undefined}
                    justifyContent="space-between"
                    _text={{
                      fontSize: 12,
                      color: 'dark',
                      textAlign: 'left',
                    }}
                    _pressed={{ opacity: 1 }}
                  >
                    {name}
                  </Button>
                  <Text color="#868585" fontSize={12}>{nets?.length}</Text>
                </HStack>
              );
            })}
          </InfiniteScrollView>
        )}
    </Box>
  );
}
