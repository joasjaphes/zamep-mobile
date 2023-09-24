import { KeyboardAvoidingView, ScrollView, View } from 'native-base';
import { Keyboard, TouchableWithoutFeedback } from 'react-native';
import { useCallback, useState } from 'react';
import useKeyboard from '../hooks/useKeyboard';

/**
 * Keyboard Aware ScrollView Component
 * @param {object} props
 * @param {React.ReactElement} props.children
 * @param {number|string} props.paddingBottom
 * @return {React.ReactElement}
 */
export default function KeyboardAwareScrollView({
  children, paddingTop, paddingBottom, dismissable = true, ...props
}) {
  const keyboardHeight = useKeyboard();
  // const { height } = useWindowDimensions();
  const [fullHeight, setHeight] = useState(0);

  const onLayout = (event) => {
    const { height } = event.nativeEvent.layout;
    setHeight(height - 16);
  };

  const onTouch = useCallback(() => {
    if (dismissable) {
      Keyboard.dismiss();
    }
  }, [dismissable]);

  return (
    <ScrollView {...props} onLayout={onLayout}>
      <KeyboardAvoidingView
        flex={1}
        paddingTop={paddingTop}
        paddingBottom={keyboardHeight ? keyboardHeight / 2 : paddingBottom}
        minH={fullHeight}
      >
        <TouchableWithoutFeedback onPress={onTouch}>
          <View>{children}</View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </ScrollView>
  );
}
