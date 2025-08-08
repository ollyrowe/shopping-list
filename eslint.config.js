import mantine from 'eslint-config-mantine';
import reactDom from 'eslint-plugin-react-dom';
import reactX from 'eslint-plugin-react-x';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  ...mantine,
  {
    files: ['**/*.{ts,tsx}'],
    extends: [reactX.configs['recommended-typescript'], reactDom.configs.recommended],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  { ignores: ['**/*.{mjs,cjs,js,d.ts,d.mts}'] },
  {
    rules: { 'no-console': 'off' },
  }
);
