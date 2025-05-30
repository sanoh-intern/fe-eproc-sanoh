import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  plugins: [react()],
  build: {
    sourcemap: false, // Disable sourcemaps in production to avoid sourcemap errors
    rollupOptions: {
      onwarn(warning, warn) {
        // Suppress sourcemap warnings
        if (warning.code === 'SOURCEMAP_ERROR') return;
        warn(warning);
      },
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
        },
      },
    },
    chunkSizeWarningLimit: 5000,
    // Suppress additional build warnings
    emptyOutDir: true,
  },
  esbuild: {
    // Suppress esbuild warnings
    logOverride: { 'this-is-undefined-in-esm': 'silent' }
  },
});