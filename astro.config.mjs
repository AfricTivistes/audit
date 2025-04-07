
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';
import { env } from "process"

export default defineConfig({
  integrations: [tailwind(), react()],
  server: {
    allowedHosts: [(env.REPLIT_DOMAINS || "").split(",")[0]],
    host: '0.0.0.0',
    port: 4321
  }
});
