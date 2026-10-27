import { defineConfig } from 'vite';
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';

export default defineConfig({
  plugins: [
    ViteImageOptimizer({
      png: { quality: 82 },
      jpeg: { quality: 78 },
      jpg: { quality: 78 },
      webp: { quality: 80 },
      svg: {
        multipass: true,
        plugins: [
          {
            name: 'preset-default',
            params: { overrides: { removeViewBox: false } },
          },
        ],
      },
      includePublic: true,
      logStats: true,
    }),
  ],
  build: {
    outDir: 'dist',
  },
});
