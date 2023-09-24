import { useCallback, useState } from 'react';
import { Dimensions } from 'react-native';
import { Entypo } from '@expo/vector-icons';
import {
  Avatar, Box, HStack, Icon, Pressable, Button, useToast, Text,
} from 'native-base';
import {
  launchCameraAsync, MediaTypeOptions,
  requestCameraPermissionsAsync, requestMediaLibraryPermissionsAsync,
} from 'expo-image-picker';
import { useLocalization } from '../localization';
import { useAuth } from '../hooks/useAuth';
import useImagePicker from '../hooks/useImagePicker';
import uploadMedia from '../helper/networkRequest';
import Images from '../components/svg/images';
import useToggle from '../hooks/useToggle';

const { width } = Dimensions.get('screen');

/**
 * Change picture Screen
 * @param {object} props
 * @returns {React.ReactElement}
 */
export default function ChangePicture() {
  const { t } = useLocalization();

  const toast = useToast();

  const [isChanging, toggleIsChanging] = useToggle(false);

  const {
    user, refetchUser, isUpdating,
  } = useAuth();
  const {
    initials, dp: photo,
  } = user || {};

  const { image, pickImage } = useImagePicker();

  const [resultImage, setResult] = useState(null);

  const changePicture = useCallback(async () => {
    try {
      // UX enhancement
      toggleIsChanging();
      // const img = `data:image/jpeg;base64,${result.base64}`;
      const data = await uploadMedia(resultImage.uri, 'image', 'profile-picture');

      if (data.code !== 200) {
        throw new Error('Error uploading photo');
      }

      const result = await refetchUser();
      if (!result || result?.error) {
        throw new Error('Error changing photo');
      }
      // photo changed
      toast.show({ description: t('Photo changed successfully') });
    } catch (error) {
      toast.show({ description: t(error?.message ?? error) });
    } finally {
      toggleIsChanging();
    }
  }, [toggleIsChanging, resultImage.uri, refetchUser, toast, t]);

  /**
 * Capturing image in a base64 format returning object
 * @returns {Promise<*>}
 */
  const takeImage = useCallback(async () => {
    try {
      const { granted: cameraGranted } = await requestCameraPermissionsAsync();
      // required on Android and iOS 10
      await requestMediaLibraryPermissionsAsync();
      if (cameraGranted) {
        const result = await launchCameraAsync({
          mediaTypes: MediaTypeOptions.Images,
          base64: true,
          aspect: [4, 4],
          quality: 0.2,
          allowsEditing: true,
        });

        if (!result.cancelled) {
          return setResult(result);
        }
        throw new Error('Image capturing cancelled');
      }
      throw new Error('Camera permissions required to proceed');
    } catch (error) {
      toast.show({ description: t(error?.message ?? error) });
    }
    return true;
  }, [t, toast]);

  return (
    <Box flex={1} paddingX={6} paddingY={3}>
      <Avatar
        bg="gray.200"
        source={{
          uri: resultImage?.uri ?? image ?? photo,
        }}
        _image={{ borderRadius: 20, width: 'full' }}
        height={`${width - 40}px`}
        width="full"
        borderRadius={20}
        marginTop={4}
        marginBottom={12}
      >
        {initials}
      </Avatar>
      <HStack space={3} alignItems="center" justifyContent="center" marginBottom={10}>
        <Pressable onPress={() => pickImage(setResult)}>
          <HStack alignItems="center" justifyContent="center">
            <Box
              size={10}
              backgroundColor="#42C8F526"
              borderRadius="full"
              alignItems="center"
              justifyContent="center"
            >
              <Images />
            </Box>
            <Text
              color="link.900"
              padding={2}
              fontSize={16}
            >
              {t('Open gallery')}
            </Text>
          </HStack>
        </Pressable>
        <Pressable onPress={takeImage}>
          <HStack alignItems="center" justifyContent="center">
            <Box
              size={10}
              backgroundColor="#42C8F526"
              borderRadius="full"
              alignItems="center"
              justifyContent="center"
            >
              <Icon
                as={Entypo}
                name="camera"
                size={5}
                color="black"
              />
            </Box>
            <Box>
              <Text
                color="link.900"
                padding={2}
                fontSize={16}
              >
                {t('Take picture')}
              </Text>
            </Box>
          </HStack>
        </Pressable>
      </HStack>
      <Button
        size="lg"
        height={16}
        marginBottom={3.5}
        _text={{ fontSize: 16 }}
        onPress={changePicture}
        isLoading={isUpdating || isChanging}
        isDisabled={isUpdating || isChanging}
      >
        {t('Save')}
      </Button>
    </Box>
  );
}
