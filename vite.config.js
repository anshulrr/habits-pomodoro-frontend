import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  server: {
    port: 3000, // Matches CRA's default
    open: true, // Automatically opens browser
  },
  build: {
    outDir: 'build', // Matches CRA's output folder name
  }
});