import DashboardLayout from 'layout/Dashboard';
import MockRuntimeProviders from 'mphone-ui/MockRuntimeProviders';

const MphoneUiRoutes = {
  path: '/mphone-ui',
  element: (
    <MockRuntimeProviders>
      <DashboardLayout />
    </MockRuntimeProviders>
  )
};

export default MphoneUiRoutes;
