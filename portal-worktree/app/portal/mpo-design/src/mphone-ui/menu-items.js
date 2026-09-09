import DashboardOutlined from '@ant-design/icons/DashboardOutlined';
import PhoneOutlined from '@ant-design/icons/PhoneOutlined';

import { mphoneUiRoute } from './workspace';

const mphoneUiMenu = {
  items: [
    {
      id: 'mphone-ui',
      title: 'mphoneUi.title',
      type: 'group',
      children: [
        {
          id: 'mphone-ui-dashboard',
          title: 'mphoneUi.navigation.dashboard',
          type: 'item',
          url: mphoneUiRoute('dashboard'),
          exact: true,
          icon: DashboardOutlined,
          breadcrumbs: false
        },
        {
          id: 'mphone-ui-active-calls',
          title: 'mphoneUi.navigation.activeCalls',
          type: 'item',
          url: mphoneUiRoute('calls/active'),
          exact: true,
          icon: PhoneOutlined,
          breadcrumbs: false
        },
        {
          id: 'mphone-ui-missed-calls',
          title: 'mphoneUi.navigation.missedCalls',
          type: 'item',
          url: mphoneUiRoute('missed-calls'),
          exact: true,
          icon: PhoneOutlined,
          breadcrumbs: false
        }
      ]
    }
  ]
};

export default mphoneUiMenu;
