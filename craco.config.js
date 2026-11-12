const path = require('path');

module.exports = {
  webpack: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  jest: {
    configure: (config) => {
      config.moduleNameMapper = {
        ...config.moduleNameMapper,
        '^@/(.*)$': '<rootDir>/src/$1',
      };
      config.transform = {
        '^.+\\.svg$': require.resolve('./scripts/jest-svg-transformer'),
        ...config.transform,
      };
      return config;
    },
  },
};
