const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');
const path = require('path');

/**
 * Metro configuration
 * https://facebook.github.io/metro/docs/configuration
 *
 * @type {import('metro-config').MetroConfig}
 */
const config = {
  resolver: {
    // 공식문서에도 관련 내용이 있음
    unstable_enableSymlinks: true,
    unstable_enablePackageExports: true,
  },
  watchFolders: [path.join(__dirname, '..', '..')], // 이 부분이 monorepo root의 node_modules를 참조하도록 하는듯
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
