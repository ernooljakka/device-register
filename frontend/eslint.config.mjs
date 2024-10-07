import { FlatCompat } from "@eslint/eslintrc";
import js from "@eslint/js";
import React from "eslint-plugin-react"
import Jest from "eslint-plugin-jest"

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
      React,
      Jest,
    },
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        module: 'readonly',
        require: 'readonly',
        process: 'readonly',
        fetch: 'readonly', // Define fetch as a global to prevent ESLint errors
        global: 'readonly', // Define global as a readonly global
        console: 'readonly'
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    "rules": {
      "react/jsx-uses-react": "error",
      "react/jsx-uses-vars": "error",
    }
  },
];
