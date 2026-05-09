import { defineConfig } from 'eslint/config';
import nextCoreWebVitals from 'eslint-config-next/core-web-vitals';
import storybook from 'eslint-plugin-storybook';

export default defineConfig([
  {
    ignores: [
      '.next/**',
      'out/**',
      'build/**',
      'coverage/**',
      'storybook-static/**',
      'playwright-report/**',
      'test-results/**',
      'next-env.d.ts',
    ],
  },
  {
    extends: [...nextCoreWebVitals, ...storybook.configs['flat/recommended']],
    rules: {
      'react-hooks/set-state-in-effect': 'warn',
      'react-hooks/incompatible-library': 'warn',
      'storybook/no-uninstalled-addons': 'warn',
    },
  },
]);
