import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    // Configure for App View compatibility
    host: '0.0.0.0',
    port: 5178,
    cors: true,
    strictPort: true,
    // Allow external access
    hmr: {
      clientPort: 5178
    }
  },
  base: './'
});