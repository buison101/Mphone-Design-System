// assets
import DashboardOutlined from '@ant-design/icons/DashboardOutlined';
import PhoneOutlined from '@ant-design/icons/PhoneOutlined';
import HistoryOutlined from '@ant-design/icons/HistoryOutlined';
import AudioOutlined from '@ant-design/icons/AudioOutlined';
import BarChartOutlined from '@ant-design/icons/BarChartOutlined';
import LineChartOutlined from '@ant-design/icons/LineChartOutlined';
import AppstoreOutlined from '@ant-design/icons/AppstoreOutlined';
import MobileOutlined from '@ant-design/icons/MobileOutlined';
import ContactsOutlined from '@ant-design/icons/ContactsOutlined';
import MessageOutlined from '@ant-design/icons/MessageOutlined';
import SettingOutlined from '@ant-design/icons/SettingOutlined';
import UserOutlined from '@ant-design/icons/UserOutlined';

// icons
const icons = {
  DashboardOutlined,
  PhoneOutlined,
  HistoryOutlined,
  AudioOutlined,
  BarChartOutlined,
  LineChartOutlined,
  AppstoreOutlined,
  MobileOutlined,
  ContactsOutlined,
  MessageOutlined,
  SettingOutlined,
  UserOutlined
};

// ==============================|| MENU ITEMS - NAVIGATION ||============================== //

const product = [
  {
    id: 'group-overview',
    title: 'nav.group.overview',
    type: 'group',
    children: [
      {
        id: 'overview',
        title: 'nav.overview',
        type: 'item',
        url: '/dashboard',
        icon: icons.DashboardOutlined,
        breadcrumbs: false
      }
    ]
  },
  {
    id: 'group-calls',
    title: 'nav.group.calls',
    type: 'group',
    children: [
      {
        id: 'webphone',
        title: 'nav.webphone',
        type: 'item',
        url: '/webphone',
        icon: icons.PhoneOutlined,
        breadcrumbs: true
      },
      {
        id: 'active-calls',
        title: 'nav.calls',
        type: 'item',
        url: '/calls/active',
        icon: icons.PhoneOutlined,
        breadcrumbs: true
      },
      {
        id: 'call-history',
        title: 'nav.history',
        type: 'item',
        url: '/calls/history',
        icon: icons.HistoryOutlined,
        breadcrumbs: false
      },
      {
        id: 'recordings',
        title: 'nav.recordings',
        type: 'item',
        url: '/recordings',
        icon: icons.AudioOutlined,
        breadcrumbs: true
      },
      {
        id: 'missed-calls',
        title: 'nav.missedCalls',
        type: 'item',
        url: '/missed-calls',
        icon: icons.PhoneOutlined,
        breadcrumbs: true
      }
    ]
  },
  {
    id: 'group-insights',
    title: 'nav.group.insights',
    type: 'group',
    children: [
      {
        id: 'analytics',
        title: 'nav.analytics',
        type: 'item',
        url: '/dashboard/analytics',
        icon: icons.LineChartOutlined,
        breadcrumbs: true
      },
      {
        id: 'reports',
        title: 'nav.reports',
        type: 'item',
        url: '/reports',
        icon: icons.BarChartOutlined,
        breadcrumbs: true
      }
    ]
  },
  {
    id: 'group-workspace',
    title: 'nav.group.workspace',
    type: 'group',
    children: [
      {
        id: 'chat',
        title: 'nav.chat',
        type: 'item',
        url: '/chat',
        icon: icons.MessageOutlined,
        breadcrumbs: true
      },
      {
        id: 'contacts',
        title: 'nav.contacts',
        type: 'item',
        url: '/contacts',
        icon: icons.ContactsOutlined,
        breadcrumbs: true
      },
      {
        id: 'settings',
        title: 'nav.settings',
        type: 'item',
        url: '/settings',
        icon: icons.SettingOutlined,
        breadcrumbs: true
      },
      {
        id: 'account',
        title: 'nav.account',
        type: 'item',
        url: '/account',
        icon: icons.UserOutlined,
        breadcrumbs: true
      }
    ]
  }
];

// ==============================|| MENU ITEMS - PREVIEW ONLY ||============================== //
//
// The catalog is a design tool, not a customer feature, so docs/08 keeps it out
// of product navigation and the route is opened directly. The local preview
// build sets VITE_PORTAL_PREVIEW, which puts it in the sidebar so every route in
// the app is reachable from one place while reviewing.
//
// A production `npm run build` never defines the flag, so this group cannot
// reach a customer.

const preview = import.meta.env.VITE_PORTAL_PREVIEW === '1';

const designSystem = {
  id: 'group-design',
  title: 'nav.group.design',
  type: 'group',
  children: [
    {
      id: 'app-phone',
      title: 'nav.appPhone',
      type: 'item',
      url: '/app-phone',
      icon: icons.MobileOutlined,
      breadcrumbs: true
    },
    {
      id: 'design-system',
      title: 'nav.designSystem',
      type: 'item',
      url: '/design-system',
      icon: icons.AppstoreOutlined,
      breadcrumbs: true
    }
  ]
};

const navigation = preview ? [...product, designSystem] : product;

export default navigation;
