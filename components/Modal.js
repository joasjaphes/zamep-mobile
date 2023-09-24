import { useCallback, useEffect, useState } from 'react';
import { Box, Modal as NativeModal } from 'native-base';
import { Dimensions } from 'react-native';

const { height } = Dimensions.get('screen');

const { Body, CloseButton, Content } = NativeModal;

/**
 * Modal wrapper component
 * @param {object} props
 * @param {React.ReactElement} props.children
 * @param {boolean} props.show State of modal, must control state is used
 * @param {boolean} [props.closeable=false] toggle close button
 * @param {boolean} props.initialShow Initial state of modal, if not desireable to control state
 * @param {func()} props.onClose Function called when exiting modal
 * @param {string|number} props.marginTop Top margin - takes in tailwind or normal values
 * @param {string|number} props.marginBottom Bottom margin - takes in tailwind or normal values
 * @param {string|number} props.maxHeight Maximum height - takes in tailwind or normal values
 * @param {string|number} props.paddingTop Padding top - takes in tailwind or normal values
 * @returns {React.ReactElement}
 */
export default function Modal({
  children, closeable = false, height: maxHeight = height / 2, onClose, show, initialShow, marginTop = 'auto', marginBottom = 0, marginX, paddingTop = 8,
  closeOnOverlayClick,
}) {
  const [showModal, setShowModal] = useState(false);

  const onCloseModal = useCallback(() => {
    if (typeof show === 'undefined') {
      setShowModal(false);
    }
    if (onClose && typeof onClose === 'function') {
      onClose();
    }
  }, [onClose, show]);

  useEffect(() => {
    if (typeof show !== 'undefined') {
      setShowModal(show);
    }
  }, [show]);

  useEffect(() => {
    if (typeof initialShow !== 'undefined') {
      setShowModal(initialShow);
    }
  }, [initialShow]);

  return (
    <NativeModal
      isOpen={showModal}
      onClose={onCloseModal}
      // size="full"
      // animationPreset="slide"
      // _slide={{ delay: 0, placement: 'bottom', overlay: false }}
      paddingX={marginX}
      safeAreaTop
      closeOnOverlayClick={closeOnOverlayClick}
    >
      <Content
        flex={1}
        maxHeight={maxHeight}
        width="full"
        marginTop={marginTop}
        marginBottom={marginBottom}
      >
        {closeable ? (
          <Box>
            <CloseButton />
          </Box>
        ) : null}
        <Body height="full" justifyContent="center">
          <Box paddingTop={paddingTop}>
            {children}
          </Box>
        </Body>
      </Content>
    </NativeModal>
  );
}
