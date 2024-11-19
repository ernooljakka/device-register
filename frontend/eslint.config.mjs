import { FlatCompat } from "@eslint/eslintrc";
import js from "@eslint/js";
import react from "eslint-plugin-react";
import jest from "eslint-plugin-jest";

const compat = new FlatCompat({
  recommendedConfig: js.configs.recommended,
});

export default [
  ...compat.config({
    extends: [
      "eslint:recommended",
      "plugin:react/recommended",
      "plugin:react/jsx-runtime",
      "plugin:jest/recommended"
    ],
  }),
  {
    files: ["**/*.js", "**/*.jsx"],
    plugins: {
      react,
      jest,
    },
    settings: {
      react: {
        version: "detect",
      },
    },
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        module: 'readonly',
        require: 'readonly',
        process: 'readonly',
        fetch: 'readonly',
        global: 'readonly',
        console: 'readonly',
        window: 'readonly',
        Event: 'readonly',
        localStorage: 'readonly', // Added to handle localStorage
        document: 'readonly', // Added to handle document
        alert: 'readonly', // Added to handle alert
        FormData: 'readonly', // Added to handle FormData
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    rules: {
      "react/jsx-uses-react": "error",
      "react/jsx-uses-vars": "error",
    },
  },
];
