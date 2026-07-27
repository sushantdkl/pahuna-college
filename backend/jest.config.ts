import type { Config } from "jest";

const config: Config = {
  testEnvironment: "node",
  roots: ["<rootDir>/__tests__"],
  setupFilesAfterEnv: ["<rootDir>/__tests__/setup.ts"],
  testMatch: ["**/*.test.ts"],
  clearMocks: true,
  transform: {
    "^.+\\.tsx?$": [
      "ts-jest",
      {
      tsconfig: {
        isolatedModules: true,
        types: ["jest", "node"],
      },
    },
    ],
  },
  collectCoverageFrom: [
    "src/**/*.ts",
    "!src/**/*.model.ts",
    "!src/data/**",
  ],
  coverageDirectory: "coverage",
  testTimeout: 30000,
};

export default config;
