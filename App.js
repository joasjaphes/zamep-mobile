// import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
import { Platform, SafeAreaView, StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { NativeBaseProvider, extendTheme } from 'native-base';
import { QueryClientProvider } from 'react-query';
import Navigation from './navigation';
import LocalizationProvider from './localization';
import queryClient from './helper/queryClient';
import { AuthProvider } from './hooks/useAuth';
import { CampaignProvider } from './hooks/useCampaign';

export default function App() {
  const theme = extendTheme({
    components: {
      Badge: {
        baseStyle: {
          px: 3,
        },
      },
      Button: {
      // Can simply pass default props to change default behaviour of components.
        defaultProps: {
          _pressed: { opacity: 0.6 },
          borderRadius: 10,
        },
      },
      Pressable: {
        defaultProps: {
          _pressed: { opacity: 0.6 },
        },
      },
      Spinner: {
        defaultProps: {
          size: 'lg',
        },
      },
    },
    colors: {
      // Add new color
      dark: '#28409A',
      danger: '#A71C13',
      darkred: '#C81515',
      light: '#F5F5F5',
      lightgrey: '#C5C5C5',
      dangerScheme: {
        400: '#A71C1380',
        500: '#A71C13',
        600: '#A71C13',
        700: '#A71C13',
        800: '#A71C13',
        900: '#A71C13',
      },
      darkgreen: {
        400: '#1E631280',
        500: '#1E6312',
        600: '#1E6312',
        700: '#1E6312',
        800: '#1E6312',
        900: '#1E6312',
      },
      secondary: {
        400: '#EFBD3F',
        500: '#EFBD3F',
        600: '#EFBD3F',
        700: '#EFBD3F',
        800: '#EFBD3F',
        900: '#EFBD3F',
      },
      primary: {
        400: '#3C61AD80',
        500: '#3C61AD99',
        600: '#3C61AD',
        700: '#3C61AD',
        800: '#3C61AD',
        900: '#3C61AD',
      },
      grey: '#A4A3A3',
      black: '#333333',
      link: {
        400: '#152FB6',
        500: '#152FB6',
        600: '#152FB6',
        700: '#152FB6',
        800: '#152FB6',
        900: '#152FB6',
      },
    },
  });

  return (
    <NavigationContainer>
      <NativeBaseProvider theme={theme}>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <CampaignProvider>
              <LocalizationProvider>
                <SafeAreaView
                  style={{ flex: 1, paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 }}
                >
                  <Navigation />
                </SafeAreaView>
              </LocalizationProvider>
            </CampaignProvider>
          </AuthProvider>
        </QueryClientProvider>
      </NativeBaseProvider>
    </NavigationContainer>
  );
}
