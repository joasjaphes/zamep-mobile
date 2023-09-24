import { Button, Spinner, View } from 'native-base';
import { useCallback, useMemo } from 'react';
import { useQuery } from 'react-query';
import { WebView } from 'react-native-webview';
import { useLocalization } from '../localization';

export default function TermsConditions({ navigation, route }) {
  const { t, locale } = useLocalization();

  /** @type {string} */
  const descriptionKey = useMemo(() => {
    if (locale.includes('en')) {
      return 'description';
    }
    return 'swahili_description';
  }, [locale]);

  const { data: { payload: { value } = {} } = {}, isLoading } = useQuery(['terms', { endpoint: 'get-settings', body: { key: 'rich_terms_and_conditions' } }]);

  /** @type {string} */
  const terms = useMemo(() => {
    if (typeof value === 'object') {
      return value?.[descriptionKey];
    }
    return '';
  }, [value, descriptionKey]);

  const proceedRegister = useCallback(() => {
    navigation.navigate('Register');
  }, [navigation]);

  return (
    <View flex={1} paddingX={8} paddingTop={3}>
      {isLoading ? <Spinner />
        : (
          <WebView
            style={{ flex: 1, paddingBottom: 15 }}
            originWhitelist={['*']}
            source={{ html: `<html><head><meta name="viewport" content="width=device-width, initial-scale=1.0"></head><body>${terms}</body></html>` }}
          />
        )}
      {!route?.params?.cannotProceed ? (
        <Button
          size="lg"
          height={16}
          marginBottom={2.5}
          _text={{ fontSize: 16 }}
          onPress={proceedRegister}
        >
          {t('Proceed')}
        </Button>
      ) : null}
    </View>
  );
}
