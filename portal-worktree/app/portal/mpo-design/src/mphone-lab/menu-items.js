import AppstoreOutlined from '@ant-design/icons/AppstoreOutlined';
import BarChartOutlined from '@ant-design/icons/BarChartOutlined';
import ContactsOutlined from '@ant-design/icons/ContactsOutlined';
import CustomerServiceOutlined from '@ant-design/icons/CustomerServiceOutlined';
import MobileOutlined from '@ant-design/icons/MobileOutlined';
import PhoneOutlined from '@ant-design/icons/PhoneOutlined';
import SkinOutlined from '@ant-design/icons/SkinOutlined';

const mphoneLabMenu = {
  items: [
    {
      id: 'mphone-lab',
      title: 'mphoneLab.title',
      type: 'group',
      children: [
        {
          id: 'mphone-lab-overview',
          title: 'mphoneLab.surface.overview.title',
          type: 'item',
          url: '/mphone',
          exact: true,
          icon: AppstoreOutlined,
          breadcrumbs: false
        },
        {
          id: 'mphone-lab-calls',
          title: 'mphoneLab.surface.calls.title',
          type: 'item',
          url: '/mphone/calls',
          icon: PhoneOutlined,
          breadcrumbs: false
        },
        {
          id: 'mphone-lab-contacts',
          title: 'mphoneLab.surface.contacts.title',
          type: 'item',
          url: '/mphone/contacts',
          icon: ContactsOutlined,
          breadcrumbs: false
        },
        {
          id: 'mphone-lab-webphone',
          title: 'mphoneLab.surface.webphone.title',
          type: 'item',
          url: '/mphone/webphone',
          icon: CustomerServiceOutlined,
          breadcrumbs: false
        },
        {
          id: 'mphone-lab-app-phone',
          title: 'mphoneLab.surface.appPhone.title',
          type: 'item',
          url: '/mphone/app-phone',
          icon: MobileOutlined,
          breadcrumbs: false
        },
        {
          id: 'mphone-lab-analytics',
          title: 'mphoneLab.surface.analytics.title',
          type: 'item',
          url: '/mphone/analytics',
          icon: BarChartOutlined,
          breadcrumbs: false
        },
        {
          id: 'mphone-lab-design-system',
          title: 'mphoneLab.surface.designSystem.title',
          type: 'item',
          url: '/mphone/design-system',
          icon: SkinOutlined,
          breadcrumbs: false
        }
      ]
    }
  ]
};

export default mphoneLabMenu;
