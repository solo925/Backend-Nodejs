export default {
    transform: {},
    // Remove the extensionsToTreatAsEsm option
    globals: {
        'ts-jest': {
            useESM: true, // Only keep this if using TypeScript with ES modules
        },
    },
    moduleNameMapper: {
        '^(\\.{1,2}/.*)\\.js$': '$1',
    },
    testEnvironment: 'node',
};
