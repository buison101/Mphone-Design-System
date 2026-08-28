// ==============================|| PREVIEW BUILD CONFIG ||============================== //
//
// Bundles the whole portal into one self-contained file so it can be reviewed on
// a laptop with no server. Not part of the product build — `npm run build` still
// uses vite.config.mjs and is untouched by anything here.
//
// Driven by preview/refresh.mjs; there is no reason to run this config directly.

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import jsconfigPaths from 'vite-jsconfig-paths';
import path from 'path';

export default defineConfig({
  base: '/p/',
  define: {
    global: 'window',
    // the sidebar reads this to show the Design System catalog, which product
    // navigation deliberately hides; a production build never defines it
    'import.meta.env.VITE_PORTAL_PREVIEW': JSON.stringify('1')
  },
  resolve: {
    alias: { '@ant-design/icons': path.resolve(import.meta.dirname, '../node_modules/@ant-design/icons') }
  },
  plugins: [react(), jsconfigPaths()],
  build: {
    outDir: 'preview/.out',
    emptyOutDir: true,
    sourcemap: false,
    // one stylesheet and one script, so refresh.mjs has two files to inline
    cssCodeSplit: false,
    assetsInlineLimit: 200000,
    chunkSizeWarningLimit: 4000,
    rollupOptions: {
      output: {
        inlineDynamicImports: true,
        entryFileNames: 'app.js',
        assetFileNames: 'app.[ext]'
      }
    }
  }
});
