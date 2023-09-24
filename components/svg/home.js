import Svg, { Path } from 'react-native-svg';

export default function Home({ size, color }) {
  return (
    <Svg width={size} height={size} color={color} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <Path
        d="M10 35C9.08336 35 8.29836 34.6733 7.64502 34.02C6.99169 33.3667 6.66558 32.5822 6.66669 31.6667V16.6667C6.66669 16.1389 6.78502 15.6389 7.02169 15.1667C7.25836 14.6945 7.58447 14.3056 8.00002 14L18 6.50001C18.3056 6.27779 18.625 6.11112 18.9584 6.00001C19.2917 5.8889 19.6389 5.83334 20 5.83334C20.3611 5.83334 20.7084 5.8889 21.0417 6.00001C21.375 6.11112 21.6945 6.27779 22 6.50001L32 14C32.4167 14.3056 32.7434 14.6945 32.98 15.1667C33.2167 15.6389 33.3345 16.1389 33.3334 16.6667V31.6667C33.3334 32.5833 33.0067 33.3683 32.3534 34.0217C31.7 34.675 30.9156 35.0011 30 35H23.3334V23.3333H16.6667V35H10Z"
        fill="currentColor"
      />
    </Svg>
  );
}