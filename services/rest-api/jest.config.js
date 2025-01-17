module.exports = {
    preset: 'ts-jest/presets/default-esm',
    testEnvironment: 'node',
    transform: {
      '^.+\.tsx?$': 'ts-jest',
    },
    extensionsToTreatAsEsm: ['.ts', '.tsx'],
    globals: {
      'ts-jest': {
        useESM: true,
      },
    },
  };