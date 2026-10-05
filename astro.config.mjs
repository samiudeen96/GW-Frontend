// @ts-check
import { defineConfig, envField } from "astro/config";
import node from "@astrojs/node";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";
import { loadEnv } from "vite";

const { PUBLIC_SITE_URL } = loadEnv(process.env.NODE_ENV ?? "development", process.cwd(), "");

export default defineConfig({
  site: PUBLIC_SITE_URL || undefined,
  output: "server",
  adapter: node({ mode: "standalone" }),
  integrations: [react()],
  vite: {
    plugins: [tailwindcss()],
  },
  env: {
    schema: {
      API_URL: envField.string({ context: "server", access: "secret", url: true }),
      PUBLIC_API_URL: envField.string({
        context: "client",
        access: "public",
        url: true,
        optional: true,
      }),
      PUBLIC_SITE_URL: envField.string({
        context: "client",
        access: "public",
        url: true,
        optional: true,
      }),
    },
  },
});
