import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  server: {
    port: 3000,
  },
  build: {
    assetsDir: 'react',
    chunkSizeWarningLimit: 1500,
    rollupOptions: {
      output: {
        entryFileNames: 'bundle.js',
        manualChunks: undefined,
      },
    },
  },
});
