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
import FileTextOutlined from '@ant-design/icons/FileTextOutlined';
import LoginOutlined from '@ant-design/icons/LoginOutlined';
import ToolOutlined from '@ant-design/icons/ToolOutlined';

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
  UserOutlined,
  FileTextOutlined,
  LoginOutlined,
  ToolOutlined
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
        id: 'account',
        title: 'nav.account',
        type: 'item',
        url: '/account',
        icon: icons.UserOutlined,
        breadcrumbs: true
      },
      {
        id: 'billing',
        title: 'nav.billing',
        type: 'item',
        url: '/billing',
        icon: icons.FileTextOutlined,
        breadcrumbs: true
      }
    ]
  }
];

// ==============================|| MENU ITEMS - PAGES (PREVIEW ONLY) ||============================== //
//
// Mantis keeps its standalone screens under one "Pages" heading, split into
// collapsible sections, and so does this. The reason is the same: these are
// screens the application never links to from inside itself — you reach a
// sign-in by being signed out and a 404 by being wrong — so the only way to
// review them is a list that admits they are a set.
//
// The catalog and the app-phone reconstruction join them as a third section.
// They are the same kind of thing — design surfaces rather than customer
// features, per docs/08 — and folding them in is also what gives NavCollapse a
// section whose children render inside the shell, so the open-on-active-child
// behaviour has somewhere to actually happen.
//
// The whole group is preview-only. `import.meta.env.VITE_PORTAL_PREVIEW` is
// defined by preview/vite.config.mjs and by nothing else, so a production
// `npm run build` cannot reach any of it.

const preview = import.meta.env.VITE_PORTAL_PREVIEW === '1';

const DESIGN_SCREENS = [
  ['app-phone', 'nav.appPhone', '/app-phone', icons.MobileOutlined],
  ['design-system', 'nav.designSystem', '/design-system', icons.AppstoreOutlined]
];

const WIDGET_SCREENS = [
  ['widget-statistics', 'nav.widget.statistics', '/widget/statistics'],
  ['widget-data', 'nav.widget.data', '/widget/data']
];

// Mantis groups its customer screens as List and Cards, and so does this: the
// two are the same records in two shapes, and the point of keeping them side by
// side is being able to switch between them while the reconstruction is under
// review. The list is the portal's existing /contacts page.
const CUSTOMER_SCREENS = [
  ['customer-list', 'nav.customer.list', '/contacts'],
  ['customer-cards', 'nav.customer.cards', '/customer/cards']
];

const LEGACY_DESIGN_SCREENS = [
  ['active-calls', 'nav.calls', '/calls/active'],
  ['call-history', 'nav.history', '/calls/history'],
  ['recordings', 'nav.recordings', '/recordings'],
  ['missed-calls', 'nav.missedCalls', '/missed-calls'],
  ['reports', 'nav.reports', '/reports'],
  ['settings', 'nav.settings', '/settings']
];

const AUTH_SCREENS = [
  ['auth-login', 'nav.auth.login', '/auth/login'],
  ['auth-activate', 'nav.auth.activate', '/auth/activate'],
  ['auth-forgot', 'nav.auth.forgot', '/auth/forgot-password'],
  ['auth-check-mail', 'nav.auth.checkMail', '/auth/check-mail'],
  ['auth-reset', 'nav.auth.reset', '/auth/reset-password'],
  ['auth-verify', 'nav.auth.verify', '/auth/verify-email'],
  ['auth-code', 'nav.auth.code', '/auth/code']
];

const MAINTENANCE_SCREENS = [
  ['maint-404', 'nav.maint.notFound', '/maintenance/404'],
  ['maint-500', 'nav.maint.serverError', '/maintenance/500'],
  ['maint-construction', 'nav.maint.underConstruction', '/maintenance/under-construction'],
  ['maint-soon', 'nav.maint.comingSoon', '/maintenance/coming-soon']
];

const section = (id, title, icon, screens) => ({
  id,
  title,
  type: 'collapse',
  icon,
  children: screens.map(([childId, childTitle, url, childIcon]) => ({
    id: childId,
    title: childTitle,
    type: 'item',
    url,
    icon: childIcon,
    breadcrumbs: false
  }))
});

const design = {
  id: 'group-design',
  title: 'nav.pages.design',
  type: 'group',
  children: [
    ...section('design-products', 'nav.pages.design', icons.AppstoreOutlined, DESIGN_SCREENS).children,
    section('widget', 'nav.pages.widget', icons.BarChartOutlined, WIDGET_SCREENS),
    section('customer', 'nav.pages.customer', icons.ContactsOutlined, CUSTOMER_SCREENS),
    section('legacy-design', 'nav.designLegacy', icons.ToolOutlined, LEGACY_DESIGN_SCREENS)
  ]
};

const pages = {
  id: 'group-pages',
  title: 'nav.group.pages',
  type: 'group',
  children: [
    section('authentication', 'nav.pages.authentication', icons.LoginOutlined, AUTH_SCREENS),
    section('maintenance', 'nav.pages.maintenance', icons.ToolOutlined, MAINTENANCE_SCREENS)
  ]
};

const navigation = preview ? [...product, design, pages] : product;

export default navigation;
