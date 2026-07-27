import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    environment: "jsdom",
    setupFiles: ["./tests/setup.ts"],
    globals: true,
    exclude: ["node_modules/**", ".next/**", "tests/e2e/**"],
    css: true,
    coverage: {
      reporter: ["text", "html"],
      reportsDirectory: "coverage",
      include: [
        "lib/cookies.ts",
        "lib/pahuna-content.ts",
        "src/components/auth-card.tsx",
        "src/components/dashboard/stat-card.tsx",
        "src/components/food/food-card.tsx",
        "src/components/shared/empty-state.tsx",
        "src/components/shared/form-success.tsx",
        "src/components/ui/password-input.tsx",
        "src/lib/assets.ts",
        "src/lib/server-assets.ts",
        "src/lib/data/navigation.ts",
        "src/lib/trip-draft.ts",
        "src/lib/utils.ts",
        "src/server/data/site-copy.ts",
      ],
      exclude: ["**/*.d.ts", "**/node_modules/**", "**/.next/**"],
    },
  },
  resolve: {
    alias: {
      "@/components": path.resolve(__dirname, "src/components"),
      "@/lib": path.resolve(__dirname, "src/lib"),
      "@/actions": path.resolve(__dirname, "actions"),
      "@server": path.resolve(__dirname, "src/server"),
      "@": path.resolve(__dirname, "."),
    },
  },
});
