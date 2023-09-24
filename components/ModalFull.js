import { useCallback, useEffect, useState } from 'react';
import {
  Box,
  Button, Image, Modal as NativeModal,
} from 'native-base';
import { Dimensions } from 'react-native';
import { useLocalization } from '../localization';

const { height } = Dimensions.get('screen');

const Logo = require('../assets/logo.png');

const { Body, Content } = NativeModal;

/**
 * Full-Modal wrapper component
 * @param {object} props
 * @param {React.ReactElement} props.children
 * @param {func()} props.onClose Function called when exiting modal
 * @returns {React.ReactElement}
 */
export default function ModalFull({ children, onClose, show }) {
  const { t } = useLocalization();

  const [showModal, setShowModal] = useState(false);

  const onCloseModal = useCallback(() => {
    setShowModal(false);
    if (onClose && typeof onClose === 'function') {
      onClose();
    }
  }, [onClose]);

  useEffect(() => {
    setShowModal(show);
  }, [show]);

  return (
    <NativeModal
      isOpen={showModal}
      onClose={() => setShowModal(false)}
      size="full"
    >
      <Content
        flex={1}
        maxHeight="full"
      >
        <Body height={height} justifyContent="center">
          <Box>
            <Box alignItems="center" marginBottom={6}>
              <Image source={Logo} style={{ height: 72, width: 72, resizeMode: 'contain' }} alt="ZAMEP Logo" />
            </Box>
            {children}
            <Button
              size="lg"
              height={16}
              marginTop={6}
              marginBottom={2.5}
              _text={{ fontSize: 16 }}
              onPress={onCloseModal}
            >
              {t('Ok')}
            </Button>
          </Box>
        </Body>
      </Content>
    </NativeModal>
  );
}
