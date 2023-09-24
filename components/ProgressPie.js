import { Text } from 'native-base';
import { useRef } from 'react';
import { AnimatedCircularProgress } from 'react-native-circular-progress';

export default function ProgressPie({
  fill = 0, size = 40, width = 6, tintColor = '#FAED0B', backgroundColor = '#1E6312', isValueHidden = false,
}) {
  const circularProgressRef = useRef();
  return (
    <AnimatedCircularProgress
      size={size}
      width={width}
      fill={fill}
      tintColor={tintColor}
      ref={circularProgressRef}
      backgroundColor={backgroundColor}
    >
      {(fillValue) => (
        <Text
          style={{
            textAlign: 'center',
          }}
          color={tintColor}
          fontSize={9}
        >
          { !isValueHidden ? `${fillValue}%` : null}
        </Text>
      )}
    </AnimatedCircularProgress>
  );
}
