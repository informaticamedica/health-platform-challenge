import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    name: "unit",
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    include: ["tests/**/*.test.ts", "tests/**/*.test.tsx"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html", "lcov"],
      reportsDirectory: "./coverage",
      exclude: [
        "**/*.stories.ts",
        "**/*.stories.tsx",
        "dist/**",
        "storybook-static/**",
        "scripts/**",
        "postcss.config.mjs",
        "tailwind.config.ts",
      ],
    },
  },
});
