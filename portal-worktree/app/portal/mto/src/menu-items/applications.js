// project imports
import { handlerCustomerDialog } from 'api/customer';
import { NavActionType } from 'config';

// assets
import BuildOutlined from '@ant-design/icons/BuildOutlined';
import CalendarOutlined from '@ant-design/icons/CalendarOutlined';
import CustomerServiceOutlined from '@ant-design/icons/CustomerServiceOutlined';
import FileTextOutlined from '@ant-design/icons/FileTextOutlined';
import MessageOutlined from '@ant-design/icons/MessageOutlined';
import ShoppingCartOutlined from '@ant-design/icons/ShoppingCartOutlined';
import UserOutlined from '@ant-design/icons/UserOutlined';
import AppstoreAddOutlined from '@ant-design/icons/AppstoreAddOutlined';
import PlusOutlined from '@ant-design/icons/PlusOutlined';
import LinkOutlined from '@ant-design/icons/LinkOutlined';

// icons
const icons = {
  BuildOutlined,
  CalendarOutlined,
  CustomerServiceOutlined,
  MessageOutlined,
  ShoppingCartOutlined,
  UserOutlined,
  AppstoreAddOutlined,
  FileTextOutlined,
  PlusOutlined,
  LinkOutlined
};

// ==============================|| MENU ITEMS - APPLICATIONS ||============================== //

const applications = {
  id: 'group-applications',
  title: 'nav.group.applications',
  icon: icons.AppstoreAddOutlined,
  type: 'group',
  children: [
    {
      id: 'chat',
      title: 'nav.apps.chat',
      type: 'item',
      url: '/apps/chat',
      icon: icons.MessageOutlined,
      breadcrumbs: false
    },
    {
      id: 'calendar',
      title: 'nav.apps.calendar',
      type: 'item',
      url: '/apps/calendar',
      icon: icons.CalendarOutlined,
      actions: [
        {
          type: NavActionType.LINK,
          label: 'nav.chip.fullCalendar',
          icon: icons.LinkOutlined,
          url: 'https://fullcalendar.io/docs/react',
          target: true
        }
      ]
    },
    {
      id: 'kanban',
      title: 'nav.apps.kanban',
      type: 'item',
      icon: BuildOutlined,
      link: '/apps/kanban/:tab',
      url: '/apps/kanban/board',
      breadcrumbs: false
    },
    {
      id: 'customer',
      title: 'nav.apps.customer',
      type: 'collapse',
      icon: icons.CustomerServiceOutlined,
      children: [
        {
          id: 'customer-list',
          title: 'nav.apps.customerList',
          type: 'item',
          url: '/apps/customer/customer-list',
          actions: [
            {
              type: NavActionType.FUNCTION,
              label: 'nav.chip.addCustomer',
              function: () => handlerCustomerDialog(true),
              icon: icons.PlusOutlined
            }
          ]
        },
        {
          id: 'customer-card',
          title: 'nav.apps.customerCard',
          type: 'item',
          url: '/apps/customer/customer-card'
        }
      ]
    },
    {
      id: 'invoice',
      title: 'nav.apps.invoice',
      url: '/apps/invoice/dashboard',
      type: 'collapse',
      icon: icons.FileTextOutlined,
      breadcrumbs: false,
      children: [
        {
          id: 'invoice-create',
          title: 'nav.apps.invoiceCreate',
          type: 'item',
          url: '/apps/invoice/create',
          breadcrumbs: false
        },
        {
          id: 'invoice-details',
          title: 'nav.apps.invoiceDetails',
          type: 'item',
          link: '/apps/invoice/details/:id',
          url: '/apps/invoice/details/1',
          breadcrumbs: false
        },
        {
          id: 'invoice-list',
          title: 'nav.apps.invoiceList',
          type: 'item',
          url: '/apps/invoice/list',
          breadcrumbs: false
        },
        {
          id: 'invoice-edit',
          title: 'nav.apps.invoiceEdit',
          type: 'item',
          link: '/apps/invoice/edit/:id',
          url: '/apps/invoice/edit/1',
          breadcrumbs: false
        }
      ]
    },
    {
      id: 'profile',
      title: 'nav.apps.profile',
      type: 'collapse',
      icon: icons.UserOutlined,
      children: [
        {
          id: 'user-profile',
          title: 'nav.apps.userProfile',
          type: 'item',
          link: '/apps/profiles/user/:tab',
          url: '/apps/profiles/user/personal',
          breadcrumbs: false
        },
        {
          id: 'account-profile',
          title: 'nav.apps.accountProfile',
          type: 'item',
          link: '/apps/profiles/account/:tab',
          url: '/apps/profiles/account/basic',
          breadcrumbs: false
        }
      ]
    },

    {
      id: 'e-commerce',
      title: 'nav.apps.eCommerce',
      type: 'collapse',
      icon: icons.ShoppingCartOutlined,
      children: [
        {
          id: 'products',
          title: 'nav.apps.products',
          type: 'item',
          url: '/apps/e-commerce/products'
        },
        {
          id: 'product-details',
          title: 'nav.apps.productDetails',
          type: 'item',
          link: '/apps/e-commerce/product-details/:id',
          url: '/apps/e-commerce/product-details/1',
          breadcrumbs: false
        },
        {
          id: 'product-list',
          title: 'nav.apps.productList',
          type: 'item',
          url: '/apps/e-commerce/product-list'
        },
        {
          id: 'add-product',
          title: 'nav.apps.addProduct',
          type: 'item',
          url: '/apps/e-commerce/add-product'
        },
        {
          id: 'checkout',
          title: 'nav.apps.checkout',
          type: 'item',
          url: '/apps/e-commerce/checkout'
        }
      ]
    }
  ]
};

export default applications;
