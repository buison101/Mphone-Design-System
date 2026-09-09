import { RouterProvider } from 'react-router-dom';

import Locales from 'components/Locales';
import ThemeCustomization from 'themes';
import { DATA_PROVIDER } from './config';
import RuntimeProviders from './RuntimeProviders';
import router from './routes/portal-router';

if (DATA_PROVIDER !== 'fusionpbx') throw new Error('Portal build requires VITE_DATA_PROVIDER=fusionpbx');

export default function PortalApp() {
  return (
    <ThemeCustomization>
      <Locales remountOnLocaleChange={false}>
        <RuntimeProviders>
          <RouterProvider router={router} />
        </RuntimeProviders>
      </Locales>
    </ThemeCustomization>
  );
}
