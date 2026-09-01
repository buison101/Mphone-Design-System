import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import jsconfigPaths from 'vite-jsconfig-paths';
import path from 'path';

export default defineConfig(() => {
  return {
    base: '/',
    server: {
      open: false,
      port: 4322,
      host: '127.0.0.1',
      fs: {
        allow: ['..']
      }
    },
    preview: {
      open: false,
      port: 4322,
      host: '127.0.0.1'
    },
    define: {
      global: 'window' // Only if you need it for legacy packages
    },
    resolve: {
      alias: {
        '@ant-design/icons': path.resolve(import.meta.dirname, 'node_modules/@ant-design/icons')
        // Add more aliases as needed
      }
    },
    plugins: [react(), jsconfigPaths()],

    optimizeDeps: {
      include: ['@mui/material/Tooltip', 'react', 'react-dom', 'react-router-dom']
    }
  };
});
