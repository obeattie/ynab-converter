// @ts-check
import { defineConfig } from "astro/config";

import react from "@astrojs/react";
import vercelStatic from "@astrojs/vercel";
import tailwindcss from "@tailwindcss/vite";

import compress from "astro-compress";

// https://astro.build/config
export default defineConfig({
  integrations: [react(), compress()],

  vite: {
    plugins: [tailwindcss()],
  },

  output: "static",
  adapter: vercelStatic({
    webAnalytics: {
      enabled: true,
    },
    imageService: true,
  }),
});
