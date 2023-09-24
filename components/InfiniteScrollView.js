import { useCallback } from 'react';
import { ScrollView } from 'native-base';

function isCloseToBottom({ layoutMeasurement, contentOffset, contentSize }) {
  return layoutMeasurement.height + contentOffset.y >= contentSize.height - 20;
}

/**
 *
 * @param {object} props
 * @returns {React.ReactElement}
 */
export default function InfiniteScrollView({ fetchNextPage, hasNextPage, ...props }) {
  const loadMore = useCallback(() => {
    if (hasNextPage) {
      fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage]);

  return (
    <ScrollView
      onScroll={({ nativeEvent }) => {
        if (isCloseToBottom(nativeEvent)) {
          loadMore();
        }
      }}
      _contentContainerStyle={{ paddingBottom: 4 }}
      {...props}
    />
  );
}
