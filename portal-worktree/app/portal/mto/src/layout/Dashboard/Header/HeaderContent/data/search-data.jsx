// assets
import ApartmentOutlined from '@ant-design/icons/ApartmentOutlined';
import BuildOutlined from '@ant-design/icons/BuildOutlined';
import CalendarOutlined from '@ant-design/icons/CalendarOutlined';
import CheckSquareOutlined from '@ant-design/icons/CheckSquareOutlined';
import ChromeOutlined from '@ant-design/icons/ChromeOutlined';
import CopyOutlined from '@ant-design/icons/CopyOutlined';
import CustomerServiceOutlined from '@ant-design/icons/CustomerServiceOutlined';
import DashboardOutlined from '@ant-design/icons/DashboardOutlined';
import DashOutlined from '@ant-design/icons/DashOutlined';
import DatabaseOutlined from '@ant-design/icons/DatabaseOutlined';
import DollarOutlined from '@ant-design/icons/DollarOutlined';
import DotChartOutlined from '@ant-design/icons/DotChartOutlined';
import DragOutlined from '@ant-design/icons/DragOutlined';
import EnvironmentOutlined from '@ant-design/icons/EnvironmentOutlined';
import FileDoneOutlined from '@ant-design/icons/FileDoneOutlined';
import FileTextOutlined from '@ant-design/icons/FileTextOutlined';
import FormOutlined from '@ant-design/icons/FormOutlined';
import HighlightOutlined from '@ant-design/icons/HighlightOutlined';
import IdcardOutlined from '@ant-design/icons/IdcardOutlined';
import InsertRowAboveOutlined from '@ant-design/icons/InsertRowAboveOutlined';
import LineChartOutlined from '@ant-design/icons/LineChartOutlined';
import MessageOutlined from '@ant-design/icons/MessageOutlined';
import PhoneOutlined from '@ant-design/icons/PhoneOutlined';
import PieChartOutlined from '@ant-design/icons/PieChartOutlined';
import QuestionCircleOutlined from '@ant-design/icons/QuestionCircleOutlined';
import ShoppingCartOutlined from '@ant-design/icons/ShoppingCartOutlined';
import StepForwardOutlined from '@ant-design/icons/StepForwardOutlined';
import TableOutlined from '@ant-design/icons/TableOutlined';
import UserOutlined from '@ant-design/icons/UserOutlined';

export const searchData = [
  {
    id: 'dashboard',
    title: 'nav.group.dashboard',
    childs: [
      { id: 'dash-default', title: 'nav.dashboard.default', icon: <DashboardOutlined />, path: '/dashboard/default' },
      { id: 'dash-analytics', title: 'nav.dashboard.analytics', icon: <DotChartOutlined />, path: '/dashboard/analytics' },
      { id: 'dash-invoice', title: 'nav.dashboard.invoice', icon: <FileTextOutlined />, path: '/dashboard/invoice' }
    ]
  },
  {
    id: 'widgets',
    title: 'nav.group.widget',
    childs: [
      { id: 'wid-statistics', title: 'nav.widget.statistics', icon: <IdcardOutlined />, path: '/widget/statistics' },
      { id: 'wid-data', title: 'nav.widget.data', icon: <DatabaseOutlined />, path: '/widget/data' },
      { id: 'wid-chart', title: 'nav.widget.chart', icon: <LineChartOutlined />, path: '/widget/chart' }
    ]
  },
  {
    id: 'applications',
    title: 'nav.group.applications',
    childs: [
      { id: 'app-chat', title: 'nav.apps.chat', icon: <MessageOutlined />, path: '/apps/chat' },
      { id: 'app-calendar', title: 'nav.apps.calendar', icon: <CalendarOutlined />, path: '/apps/calendar' },
      { id: 'app-kanban', title: 'nav.apps.kanban', icon: <BuildOutlined />, path: '/apps/kanban/board' },
      { id: 'app-customer', title: 'nav.apps.customer', icon: <CustomerServiceOutlined />, path: '/apps/customer/customer-list' },
      { id: 'app-invoice', title: 'nav.apps.invoice', icon: <FileTextOutlined />, path: '/apps/invoice/dashboard' },
      { id: 'app-profile', title: 'nav.apps.profile', icon: <UserOutlined />, path: '/apps/profiles/user/personal' },
      { id: 'app-e-commerce', title: 'nav.apps.eCommerce', icon: <ShoppingCartOutlined />, path: '/apps/e-commerce/products' }
    ]
  },
  {
    id: 'forms-tables',
    title: 'nav.group.formsTables',
    childs: [
      { id: 'ft-forms-validation', title: 'nav.formsTables.validation', icon: <FileDoneOutlined />, path: '/forms/validation' },
      { id: 'ft-forms-wizard', title: 'nav.formsTables.wizard', icon: <StepForwardOutlined />, path: '/forms/wizard' },
      { id: 'ft-forms-layout', title: 'nav.formsTables.formsLayout', icon: <FormOutlined />, path: '/forms/layout/basic' },
      { id: 'ft-react-tables', title: 'nav.formsTables.reactTables', icon: <InsertRowAboveOutlined />, path: '/tables/react-table/basic' },
      { id: 'ft-mui-tables', title: 'nav.formsTables.muiTables', icon: <TableOutlined />, path: '/tables/mui-table/basic' }
    ]
  },
  {
    id: 'plugins',
    title: 'nav.formsTables.formsPlugins',
    childs: [
      { id: 'plug-mask', title: 'nav.formsTables.mask', icon: <DashOutlined />, path: '/forms/plugins/mask' },
      { id: 'plug-clipboard', title: 'nav.formsTables.clipboard', icon: <CopyOutlined />, path: '/forms/plugins/clipboard' },
      { id: 'plug-re-captcha', title: 'nav.formsTables.reCaptcha', icon: <CheckSquareOutlined />, path: '/forms/plugins/re-captcha' },
      { id: 'plug-editor', title: 'nav.formsTables.editor', icon: <HighlightOutlined />, path: '/forms/plugins/editor' },
      { id: 'plug-dropzone', title: 'nav.formsTables.dropzone', icon: <DragOutlined />, path: '/forms/plugins/dropzone' }
    ]
  },
  {
    id: 'charts-map',
    title: 'nav.group.chartsMap',
    childs: [
      { id: 'cm-apexchart', title: 'nav.charts.apexchart', icon: <PieChartOutlined />, path: '/charts/apexchart' },
      { id: 'cm-org-chart', title: 'nav.charts.orgChart', icon: <ApartmentOutlined />, path: '/charts/org-chart' },
      { id: 'cm-map', title: 'nav.charts.map', icon: <EnvironmentOutlined />, path: '/map' }
    ]
  },
  {
    id: 'pages',
    title: 'nav.group.pages',
    childs: [
      { id: 'page-sample', title: 'nav.samplePage', icon: <ChromeOutlined />, path: '/sample-page' },
      { id: 'page-change-log', title: 'nav.pages.changeLog', icon: <QuestionCircleOutlined />, path: '/change-log', isExternal: true },
      { id: 'page-contact-us', title: 'nav.pages.contactUs', icon: <PhoneOutlined />, path: '/contact-us', isExternal: true },
      { id: 'page-faqs', title: 'nav.pages.faqs', icon: <QuestionCircleOutlined />, path: '/faqs', isExternal: true },
      { id: 'page-pricing', title: 'nav.pages.pricing', icon: <DollarOutlined />, path: '/pricing' }
    ]
  }
];
