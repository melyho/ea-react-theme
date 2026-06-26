import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

/**
 * Output format: IIFE (Immediately Invoked Function Expression)
 *
 * WHY IIFE, not ESM:
 * - WordPress enqueues React + ReactDOM as UMD globals via CDN
 *   (window.React, window.ReactDOM).
 * - An ESM output uses bare `import ... from "react"` which the browser
 *   cannot resolve without an import map — causing a blank page.
 * - IIFE output wraps everything in a self-executing function and references
 *   React/ReactDOM via the `globals` map (window.React, window.ReactDOM).
 * - We also remove type="module" from the script tag (no module filter needed).
 */
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'assets/js',
    emptyOutDir: false,
    rollupOptions: {
      input: path.resolve(__dirname, 'src/main.jsx'),
      external: ['react', 'react-dom', 'react-dom/client'],
      output: {
        format: 'iife',
        name: 'EABadmintonApp',
        entryFileNames: 'main.js',
        // Map bare module names → the window globals WP's CDN scripts set
        globals: {
          'react':            'React',
          'react-dom':        'ReactDOM',
          'react-dom/client': 'ReactDOM',
        },
      },
    },
  },
});
