import { useCallback } from 'react';
import {
  Box, Button, Text, Icon, Actionsheet, useToast,
} from 'native-base';
import { customAlphabet } from 'nanoid/non-secure';
import { useMutation } from 'react-query';
import { MaterialIcons } from '@expo/vector-icons';
import Constants from 'expo-constants';

import { useLocalization } from '../localization';
import useToggle from '../hooks/useToggle';

const { authorizationHeader } = Constants.manifest.extra;

const nanoid = customAlphabet('123456789', 6);
const generatedPassword = nanoid();

export default function ResendPasswordModal({ phone }) {
  const { t } = useLocalization();

  const toast = useToast();

  const { mutateAsync: getUserByPhone, isLoading: isFetching } = useMutation('getUserByPhone');
  const { mutate: updateUserPassword, isLoading } = useMutation('getUserByPhone');

  const [showModal, toggleModal] = useToggle(false);

  const resetPassword = useCallback(async () => {
    try {
      const phoneNumber = phone?.replace(' ', '');

      const result = await getUserByPhone([{}, {
        endpoint: `users?filter=phone_number:eq:${phoneNumber}`,
        headers: {
          Authorization: `Basic ${authorizationHeader}`,
        },
      }]);

      if (!result || result?.error || result?.users?.[0]?.id) {
        throw new Error('Error getting user');
      }

      updateUserPassword([{ password: generatedPassword, can_login: true }, {
        endpoint: `users/${result?.users?.[0]?.id}`,
        method: 'PUT',
        headers: {
          Authorization: `Basic ${authorizationHeader}`,
        },
      }]);

      toast.show({
        description: 'Password sent successfully',
      });
      toggleModal();
    } catch (error) {
      toast.show({
        description: 'Error sending password',
      });
    }
  }, [getUserByPhone, phone, toast, toggleModal, updateUserPassword]);

  return (
    <>
      <Button
        size="md"
        variant="link"
        marginBottom={8}
        textAlign="center"
        _text={{ fontSize: 14, color: 'dark' }}
        isLoading={isFetching || isLoading}
        isDisabled={phone?.length < 10 || isFetching || isLoading}
        onPress={resetPassword}
      >
        {t('Recover account')}
      </Button>
      <Actionsheet isOpen={showModal} onClose={toggleModal}>
        <Actionsheet.Content alignItems="stretch" padding={6}>
          <Box justifyContent="center">
            <Icon as={<MaterialIcons />} alignSelf="center" color="#1E6312" name="check-circle" size={60} marginBottom={8} alt="" />
            <Text textAlign="center" fontSize={12} color="#868585" marginBottom={6}>{t('Password sent successfully')}</Text>
            <Button
              size="lg"
              height={16}
              marginTop={1}
              marginBottom={3.5}
              _text={{ fontSize: 16 }}
              onPress={toggleModal}
            >
              {t('Ok')}
            </Button>
          </Box>
        </Actionsheet.Content>
      </Actionsheet>
    </>
  );
}
