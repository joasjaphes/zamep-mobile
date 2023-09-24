import {
  Box, HStack, Spinner, Text, VStack,
} from 'native-base';
import { useMemo } from 'react';
import { useInfiniteQuery } from 'react-query';
import InfiniteScrollView from '../components/InfiniteScrollView';
import { shortDuration } from '../helper/moment';
import { useAuth } from '../hooks/useAuth';
import { useLocalization } from '../localization';

/**
 * Notifications Screen
 * @param {object} props
 * @returns {React.ReactElement}
 */
export default function Notifications() {
  const { locale } = useLocalization();

  const { user: { ID: userID } } = useAuth();

  const {
    data: { pages } = {},
    isFetching,
    isLoading,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteQuery(['notifications', { endpoint: 'get-notification-records', body: { userID } }], { keepPreviousData: true, refetchOnMount: 'always' });

  const notifications = useMemo(
    () => pages?.flatMap((page) => page.payload).filter(Boolean) ?? [],
    [pages],
  );

  return (
    <>
      {(isLoading || isFetching) && <Spinner />}
      <InfiniteScrollView
        flex={1}
        paddingX={6}
        paddingY={3}
        fetchNextPage={fetchNextPage}
        hasNextPage={hasNextPage}
      >
        <VStack space={2}>
          {notifications?.map(({
            ID, date, body, title,
          }) => (
            <HStack
              key={ID}
              backgroundColor="#F5F5F5"
              padding={15}
              justifyContent="space-between"
              borderRadius={5}
            >
              <Box>
                <Text fontWeight={700}>{title}</Text>
                <Text fontSize="2xs" color="#9B9A9A">{body}</Text>
              </Box>
              <Text fontSize="2xs" position="absolute" top={15} right={15}>{shortDuration(new Date(date), locale.split('-')[0])}</Text>
            </HStack>
          ))}
        </VStack>
      </InfiniteScrollView>
    </>
  );
}
