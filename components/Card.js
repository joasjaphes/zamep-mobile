import { Box } from 'native-base';

export default function Card({ children }) {
  return (<Box backgroundColor="white" shadow={2} borderRadius={10} padding={4} marginTop={1} marginX={1} marginBottom={5}>{children}</Box>);
}
