import { lazy, Suspense, useState } from 'react';

// material-ui
import Toolbar from '@mui/material/Toolbar';

// project imports
import PromptsLayoutPage from './PromptsLayout';
import ContainerWrapper from 'components/ContainerWrapper';
import Loader from 'components/Loader';

const Header = lazy(() => import('components/pages/Header'));
const Footer = lazy(() => import('components/pages/Footer'));

// ==============================|| PROMPTS LAYOUT ||============================== //

export default function PromptsLayout() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <Suspense fallback={<Loader />}>
      <ContainerWrapper>
        <Header
          variant="prompts"
          enableComponentDrawer={true}
          onComponentDrawerToggle={() => setDrawerOpen((prev) => !prev)}
          isComponentDrawerOpened={drawerOpen}
        />
        <Toolbar sx={{ my: 2 }} />
        <PromptsLayoutPage drawerOpen={drawerOpen} onCloseDrawer={() => setDrawerOpen(false)} />
      </ContainerWrapper>
      <Footer />
    </Suspense>
  );
}
