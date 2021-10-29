const common = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  clearMocks: true,
}

export default {
  collectCoverage: true,
  coverageReporters: ['lcov', 'text-summary'],
  collectCoverageFrom: ['<rootDir>/packages/*/src/**/*.ts'],
  projects: [
    {
      ...common,
      testMatch: ['<rootDir>/packages/*/tests/**/*.spec.ts'],
    },
  ],
}
