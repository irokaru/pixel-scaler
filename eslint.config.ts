import eslint from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier/flat";
import eslintPluginImportX from "eslint-plugin-import-x";
import eslintPluginUnicorn from "eslint-plugin-unicorn";
import eslintPluginUnusedImports from "eslint-plugin-unused-imports";
import eslintPluginVitest from "eslint-plugin-vitest";
import globals from "globals";
import tseslint from "typescript-eslint";
import vueParser from "vue-eslint-parser";

export default tseslint.config(
  {
    ignores: ["node_modules", "dist", "coverage", "public", "src-tauri"],
  },
  {
    files: ["**/*.ts", "**/*.vue"],
  },
  {
    files: ["tests/**"],
    ...eslintPluginVitest.configs.recommended,
  },
  eslint.configs.recommended,
  tseslint.configs.recommended,
  eslintPluginUnicorn.configs.recommended,
  eslintPluginImportX.flatConfigs.recommended,
  eslintConfigPrettier,
  {
    plugins: {
      "unused-imports": eslintPluginUnusedImports,
    },
    settings: {
      "import-x/resolver": {
        typescript: {},
      },
    },
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.browser,
        // FIXME: more simple way to define globals
        MIMEType: "readonly",
        FilePickerOptions: "readonly",
      },
      parser: vueParser,
      parserOptions: {
        parser: tseslint.parser,
        extraFileExtensions: [".vue"],
      },
    },
    rules: {
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-unused-expressions": [
        "error",
        { allowTernary: true },
      ],
      "unused-imports/no-unused-imports": "warn",
      "unicorn/consistent-function-scoping": "off",
      "unicorn/prevent-abbreviations": "off",
      "unicorn/filename-case": "off",
      "unicorn/no-array-reduce": "off",
      "unicorn/no-null": "off",
      "import-x/order": [
        "warn",
        {
          groups: [
            "builtin",
            "external",
            "internal",
            "parent",
            "sibling",
            "index",
            "object",
            "type",
          ],
          "newlines-between": "always",
          pathGroupsExcludedImportTypes: ["builtin"],
          pathGroups: [
            {
              pattern: "@/**",
              group: "internal",
              position: "after",
            },
          ],
          alphabetize: { order: "asc", caseInsensitive: true },
        },
      ],
    },
  },
);
