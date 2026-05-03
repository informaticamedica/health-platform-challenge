import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";
import { storybookTest } from "@storybook/addon-vitest/vitest-plugin";

const dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig(async () => {
  const { playwright } = await import("@vitest/browser-playwright");

  return {
    test: {
      projects: [
        {
          test: {
            name: "unit",
            environment: "jsdom",
            setupFiles: ["./vitest.setup.ts"],
            include: ["tests/**/*.test.ts", "tests/**/*.test.tsx"],
          },
        },
        {
          extends: true,
          plugins: [storybookTest({ configDir: path.join(dirname, ".storybook") })],
          test: {
            name: "storybook",
            browser: {
              enabled: true,
              headless: true,
              provider: playwright(),
              instances: [{ browser: "chromium" }],
            },
          },
        },
      ],
    },
  };
});
