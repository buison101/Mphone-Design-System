import { createRoot } from 'react-dom/client';

import 'assets/style.css';
import 'simplebar-react/dist/simplebar.min.css';
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';
import '@fontsource/public-sans/400.css';
import '@fontsource/public-sans/500.css';
import '@fontsource/public-sans/600.css';
import '@fontsource/public-sans/700.css';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import 'styles/mphone-owner-overrides.css';

import { ConfigProvider } from 'contexts/ConfigContext';
import PortalApp from './PortalApp';

const root = createRoot(document.getElementById('root'));
root.render(
  <ConfigProvider>
    <PortalApp />
  </ConfigProvider>
);
