import sharedConfig from "@nursenourish/eslint-config";

export default [
  ...sharedConfig,
  {
    languageOptions: {
      parserOptions: {
        project: true,
        tsconfigRootDir: import.meta.dirname,
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
  },
  {
    rules: {
      "react/react-in-jsx-scope": "off",
    },
  },
];