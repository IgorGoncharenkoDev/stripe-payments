import js from "@eslint/js";
import tseslint from "typescript-eslint";

import importPlugin from "eslint-plugin-import";
import perfectionist from 'eslint-plugin-perfectionist'

export default tseslint.config(
  js.configs.recommended,

  ...tseslint.configs.recommended,

  {
    files: ['**/*.{ts,mts,cts}'],

    languageOptions: {
      parserOptions: {
        project: './tsconfig.json',
      },
    },

    plugins: {
      perfectionist,
      import: importPlugin,
    },

    rules: {
      'import/no-duplicates': 'error',
      'import/no-unresolved': 'error',
      'import/order': 'off',

      'object-shorthand': ['warn', 'always'],

      'perfectionist/sort-imports': [
        'error',
        {
          type: 'natural',
          order: 'asc',

          // 🧩 This defines your architecture layers
          groups: [
            'builtin', // node: fs, path, etc
            'external', // react, next, lodash
            'internal', // "@/..."
            ['parent', 'sibling', 'index'], // ../, ./same-folder, ./index
            'unknown',
          ],

          // treat "@/..." as internal
          internalPattern: ['^@/'],
        },
      ],

      'perfectionist/sort-named-imports': [
        'error',
        {
          type: 'natural',
          order: 'asc',
        },
      ],

      'perfectionist/sort-exports': 'error',

      'perfectionist/sort-interfaces': 'error',

      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],

      '@typescript-eslint/consistent-type-imports': [
        'warn',
        {
          prefer: 'type-imports',
        },
      ],

      '@typescript-eslint/explicit-function-return-type': 'off',
    },

    settings: {
      'import/resolver': {
        typescript: {
          project: './tsconfig.json',
        },
        node: true,
      },
    },
  },

  {
    ignores: ['dist/**', 'node_modules/**'],
  },
)