import sharedConfig from "@nursenourish/eslint-config";

export default [
  ...sharedConfig,
  {
    languageOptions: {
      parserOptions: {
        project: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
];