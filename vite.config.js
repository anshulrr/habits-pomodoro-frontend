import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(), 
    tsconfigPaths(),
    VitePWA({
      strategies: 'injectManifest', // Essential for custom logic (Firebase)
      srcDir: 'src',                // Where your sw.js lives
      filename: 'firebase-messaging-sw.js',            // Name of your source file
      registerType: 'autoUpdate',
      injectManifest: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'], // Files to precache
      },
      devOptions: {
        enabled: true,               // Allows testing SW in dev mode!
        type: 'module',
      },
    }),
],
  server: {
    port: 3000, // Matches CRA's default
    open: true, // Automatically opens browser
  },
  build: {
    outDir: 'build', // Matches CRA's output folder name
  }
});