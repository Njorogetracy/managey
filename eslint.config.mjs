import globals from "globals";
import pluginJs from "@eslint/js";
import pluginReactConfig from "eslint-plugin-react/configs/recommended.js";


export default [
  {
    files: ['**/*.js', '**/*.mjs', '**/*.cjs', '**/*.jsx', '**/*.mjsx', '**/*.ts', '**/*.tsx', '**/*.mtsx'], settings: { react: { version: "detect" } }
    },
  { languageOptions: { parserOptions: { ecmaFeatures: { jsx: true } } } },
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  pluginReactConfig,
];