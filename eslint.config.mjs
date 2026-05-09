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
      // TODO: remove this override when Storybook is upgraded to 10. The
      // addons flagged here (addon-onboarding, addon-links, addon-interactions)
      // are bundled with Storybook 8 but not declared in package.json. The
      // upgrade will reorganize the addon list and this rule should pass.
      'storybook/no-uninstalled-addons': 'warn',
    },
  },
]);
