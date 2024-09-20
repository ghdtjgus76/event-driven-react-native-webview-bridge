module.exports = {
  displayName: "react-native",
  preset: "ts-jest",
  moduleFileExtensions: ["js", "jsx", "ts", "tsx"],
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest",
    "^.+\\.(js|jsx)$": "babel-jest",
  },
  testMatch: ["<rootDir>/**/*.test.(js|jsx|ts|tsx)"],
  setupFilesAfterEnv: ["<rootDir>/setupTests.ts"],
  testEnvironment: "jsdom",
  transformIgnorePatterns: [
    "<rootDir>/node_modules/(?!(jest-)?@?react-native|@react-native-community|@react-navigation|@react-native/js-polyfills)",
  ],
  extensionsToTreatAsEsm: [".ts", ".tsx"],
};
