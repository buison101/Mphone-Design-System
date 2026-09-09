import AppstoreOutlined from '@ant-design/icons/AppstoreOutlined';
import DatabaseOutlined from '@ant-design/icons/DatabaseOutlined';
import LineChartOutlined from '@ant-design/icons/LineChartOutlined';
import SettingOutlined from '@ant-design/icons/SettingOutlined';

const mphoneLabMenu = {
  items: [
    {
      id: 'mphone-lab',
      title: 'mphoneLab.title',
      type: 'group',
      children: [
        {
          id: 'mphone-lab-overview',
          title: 'mphoneLab.dashboard.title',
          type: 'item',
          url: '/mphone',
          exact: true,
          icon: AppstoreOutlined,
          breadcrumbs: false
        },
        {
          id: 'mphone-lab-analytics',
          title: 'mphoneLab.analytics.title',
          type: 'item',
          url: '/mphone/analytics',
          icon: LineChartOutlined,
          breadcrumbs: false
        },
        {
          id: 'mphone-lab-data',
          title: 'mphoneLab.data.title',
          type: 'item',
          url: '/mphone/data',
          icon: DatabaseOutlined,
          breadcrumbs: true
        },
        {
          id: 'mphone-lab-components',
          title: 'mphoneLab.components.title',
          type: 'item',
          url: '/mphone/components',
          icon: AppstoreOutlined,
          breadcrumbs: false
        },
        {
          id: 'mphone-lab-settings',
          title: 'mphoneLab.settings.menuTitle',
          type: 'item',
          url: '/mphone/settings',
          icon: SettingOutlined,
          breadcrumbs: false
        }
      ]
    }
  ]
};

export default mphoneLabMenu;
