import { Box, Spinner } from 'native-base';
import { useQuery } from 'react-query';
import { WebView } from 'react-native-webview';
import { useMemo } from 'react';
import { useLocalization } from '../localization';

/**
 * Privacy Policy Screen
 * @param {object} props
 * @returns {React.ReactElement}
 */
export default function Privacy() {
  const { locale } = useLocalization();

  const { data: { payload: { value = {} } = {} } = {}, isLoading } = useQuery(['privacy', { endpoint: 'get-settings', body: { key: 'privacy' } }]);

  /** @type {string} */
  const descriptionKey = useMemo(() => {
    if (locale.includes('en')) {
      return 'description';
    }
    return 'swahili_description';
  }, [locale]);

  /** @type {string} */
  const privacyPolicy = useMemo(() => {
    if (typeof value === 'object') {
      return value?.[descriptionKey];
    }
    return '';
  }, [value, descriptionKey]);

  return (
    <Box flex={1} paddingX={8} paddingTop={3}>
      {isLoading ? <Spinner />
        : (
          <WebView
            style={{ flex: 1, paddingBottom: 15 }}
            originWhitelist={['*']}
            source={{ html: `<html><head><meta name="viewport" content="width=device-width, initial-scale=1.0"></head><body>${privacyPolicy}</body></html>` }}
          />
        )}
    </Box>
  );
}
