import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

// Extend from Next.js core web vitals and TypeScript configs
const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  // Custom rules for 'any' and other linting preferences
  {
    rules: {
      "@typescript-eslint/no-explicit-any": "off", // Allow the use of 'any'
      "@typescript-eslint/explicit-module-boundary-types": "off", // Allow function return type inference
      "@typescript-eslint/explicit-function-return-type": "off", // Allow function return type inference
      "no-console": "warn", // Warn about console usage
      "no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_" // Ignore unused vars with underscore prefix
        }
      ], // Customizing no-unused-vars rule
    },
  },
];

export default eslintConfig;
