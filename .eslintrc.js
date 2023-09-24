module.exports = {
  extends: [
    'airbnb',
    'airbnb/hooks',
  ],
  plugins: [
    'react',
    'react-native',
    'react-hooks',
  ],
  parserOptions: {
    ecmaVersion: 2020,
  },
  env: {
    jest: true,
    'react-native/react-native': true,
  },
  rules: {
    'react/jsx-props-no-spreading': [2, {
      custom: 'ignore',
    }],
    'react/prop-types': 0,
    'react/react-in-jsx-scope': 0,
    'react/jsx-uses-react': 0,
    'react/jsx-filename-extension': [
      1,
      {
        extensions: [
          '.js',
          '.jsx',
        ],
      },
    ],
  },
};
