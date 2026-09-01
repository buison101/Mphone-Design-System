import { RouterProvider } from 'react-router-dom';

// project imports
import router from 'routes';
import ThemeCustomization from 'themes';
import { LocaleProvider } from 'contexts/LocaleContext';
import { SessionProvider } from 'contexts/SessionContext';
import { ActiveCallsProvider } from 'contexts/ActiveCallsContext';
import { WebphoneProvider } from 'contexts/WebphoneContext';
import SessionGate from 'components/SessionGate';
import ErrorBoundary from 'components/ErrorBoundary';

// ==============================|| APP - THEME, LOCALE, SESSION, ROUTER ||============================== //
//
// The boundary sits inside ThemeCustomization and LocaleProvider, not outside
// them. Its fallback is a themed, translated page, and a boundary that catches a
// throw from above its own theme would have nothing to render it with.

export default function App() {
  return (
    <ThemeCustomization>
      <LocaleProvider>
        <ErrorBoundary>
          <SessionProvider>
            <SessionGate>
              <ActiveCallsProvider>
                <WebphoneProvider>
                  <RouterProvider router={router} />
                </WebphoneProvider>
              </ActiveCallsProvider>
            </SessionGate>
          </SessionProvider>
        </ErrorBoundary>
      </LocaleProvider>
    </ThemeCustomization>
  );
}
