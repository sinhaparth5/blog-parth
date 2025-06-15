// @ts-check
import { defineConfig } from 'astro/config';

import cloudflare from '@astrojs/cloudflare';

import sitemap from '@astrojs/sitemap';

import mdx from '@astrojs/mdx';
import { imageService } from '@unpic/astro/service';

// https://astro.build/config
export default defineConfig({
  site: 'https://blogs.parthsinha.com',
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
  integrations: [sitemap(), mdx({ extendMarkdownConfig: true })],
  markdown: {
    shikiConfig: {
      theme: 'github-dark',
      wrap: true
    }
  },
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
      cssCodeSplit: false,
      cssMinify: true,
      rollupOptions: {
        output: {
          assetFileNames: (assetInfo) => {
            const info = assetInfo.name;
            const extType = info?.split('.').at(1);
            if (/css/i.test(extType ?? '')) {
              return `build/styles.[hash][extname]`;
            }
            return `build/[name].[hash][extname]`;
          },
        },
      },
    },
    ssr: {
      external: [
        'node:fs/promises',
        'node:path',
        'node:url',
        'node:crypto'
      ]
    }
  },
  build: {
    assets: 'build',
  },
});