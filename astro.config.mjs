// @ts-check
import { defineConfig } from 'astro/config';

import cloudflare from '@astrojs/cloudflare';

import sitemap from '@astrojs/sitemap';

import mdx from '@astrojs/mdx';
import { imageService } from '@unpic/astro/service';

// https://astro.build/config
export default defineConfig({
  output: "server",
  adapter: cloudflare({
    platformProxy: {
      enabled: true
    },

    imageService: "cloudflare"
  }),
  image: {
    service: imageService(),
  },
  integrations: [sitemap(), mdx()],
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          includePaths: ['./src/assets/styles'],
          outputStyle: 'compressed'
        },
      },
      minify: true,
      transform:{
        minify: true,
      },
    },
    build: {
      cssMinify: true,
    }
  }
});