import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import jsconfigPaths from 'vite-jsconfig-paths';
import i18nSubstitute from './scripts/i18n/vite-plugin-i18n.mjs';
import path from 'path';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const API_URL = env.VITE_APP_BASE_NAME || '/';
  const appTarget = env.VITE_APP_TARGET || 'design-lab';
  const PORT = 3000;

  if (appTarget === 'portal' && env.VITE_DATA_PROVIDER !== 'fusionpbx') {
    throw new Error('Portal build requires VITE_DATA_PROVIDER=fusionpbx');
  }

  const buildTargetPlugin = {
    name: 'mphone-build-target',
    transformIndexHtml: {
      order: 'pre',
      handler(html) {
        if (appTarget !== 'portal') return html;
        return html
          .replace('/src/index.jsx', '/src/mphone-ui/portal-entry.jsx')
          .replace('<title>Mphone UI Lab</title>', '<title>Mphone Portal Next</title>')
          .replace('content="Mantis - React Material UI Dashboard Template"', 'content="Mphone Portal Next"')
          .replace(
            'property="og:site_name" content="Mantis - React Material UI Dashboard Template"',
            'property="og:site_name" content="Mphone Portal Next"'
          )
          .replace(
            'content="Start your next React project with the Mantis admin template. It is built with ReactJS, Material-UI, NextJS, and SWR for faster web development."',
            'content="Mphone customer communications portal."'
          )
          .replace(/\s*<meta\s+name="keywords"[\s\S]*?\/>/, '')
          .replace(/\s*<meta name="author" content="CodedThemes"\s*\/>/, '')
          .replace(/\s*<script type="application\/ld\+json">[\s\S]*?<\/script>/, '');
      }
    }
  };

  return {
    base: API_URL,
    server: {
      open: true,
      port: PORT,
      host: true,
      fs: {
        allow: ['..']
      }
    },
    preview: {
      open: true,
      host: true
    },
    define: {
      global: 'window' // Only if you need it for legacy packages
    },
    resolve: {
      alias: {
        '@ant-design/icons': path.resolve(__dirname, 'node_modules/@ant-design/icons')
        // Add more aliases as needed
      }
    },
    plugins: [buildTargetPlugin, i18nSubstitute(), react(), jsconfigPaths()],

    optimizeDeps: {
      include: ['@mui/material/Tooltip', 'react', 'react-dom', 'react-router-dom']
    }
  };
});
