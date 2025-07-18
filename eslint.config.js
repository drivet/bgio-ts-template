import { defineConfig, globalIgnores } from 'eslint/config';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import simpleImportSort from "eslint-plugin-simple-import-sort";
import importPlugin from 'eslint-plugin-import';
import js from '@eslint/js';
import tseslint from 'typescript-eslint';

export default defineConfig([
  globalIgnores(['dist/']),
  js.configs.recommended,
  tseslint.configs.recommended, 
  {
    plugins: {
      "simple-import-sort": simpleImportSort,
      'import': importPlugin,
    },
    rules: {
      'no-console': 'error',
      '@typescript-eslint/ban-ts-comment': 'warn',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      "simple-import-sort/imports": "error",
      "simple-import-sort/exports": "error",
      // conflicts so turn it off
      'sort-imports': 'off',
      'import/first': 'error',
      'import/no-duplicates': 'error',
      'import/newline-after-import': 'error',
    },
  },
  {
    files: ['*.spec.ts'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
  {
    files: ['*.js'],
    rules: {
      'simple-import-sort/sort': 'off',
      'import/order': ['error', { 'newlines-between': 'always' }],
    },
  },
  eslintPluginPrettierRecommended,
]);
