import { Text } from 'native-base';

/**
 * Input length counter - counts characters in input
 * @param {number} maxLength - max length of input
 * @param {string} value - value input
 * @returns {JSX}
 */
export default function InputLengthCounter({ maxLength, value }) {
  if (!maxLength) {
    return null;
  }
  return (
    <Text
      fontSize={10}
      color="gray.400"
      position="absolute"
      bottom={4}
      right={2}
    >
      {`${
        value?.length ?? 0
      }/${maxLength}`}
    </Text>
  );
}
