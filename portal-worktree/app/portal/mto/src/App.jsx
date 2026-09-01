import { RouterProvider } from 'react-router-dom';

// project imports
import Locales from 'components/Locales';
import RTLLayout from 'components/RTLLayout';
import Snackbar from 'components/@extended/Snackbar';
import Notistack from 'components/third-party/Notistack';

import router from 'routes';
import ThemeCustomization from 'themes';

// auth-provider
import { LocalAuthProvider as AuthProvider } from 'contexts/LocalAuthContext';

// ==============================|| APP - THEME, ROUTER, LOCAL ||============================== //

export default function App() {
  return (
    <ThemeCustomization>
      <RTLLayout>
        <Locales>
          <AuthProvider>
            <Notistack>
              <RouterProvider router={router} />
              <Snackbar />
            </Notistack>
          </AuthProvider>
        </Locales>
      </RTLLayout>
    </ThemeCustomization>
  );
}
