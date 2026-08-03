import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

eslintConfig.push({
  files: [
    "src/components/FloatingMemoryBubble.tsx",
    "src/components/ScrollScrubHero.tsx",
    "src/components/home/HomeNavbar.tsx",
    "src/components/home/SharedMemoriesArchiveSection.tsx",
  ],
  rules: {
    "react-hooks/refs": "off",
    "react-hooks/immutability": "off",
    "react-hooks/set-state-in-effect": "off",
    "@typescript-eslint/no-unused-vars": "off",
  },
});

export default eslintConfig;
