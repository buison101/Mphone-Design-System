// assets
import DollarOutlined from '@ant-design/icons/DollarOutlined';
import LoginOutlined from '@ant-design/icons/LoginOutlined';
import PhoneOutlined from '@ant-design/icons/PhoneOutlined';
import HistoryOutlined from '@ant-design/icons/HistoryOutlined';
import QuestionCircleOutlined from '@ant-design/icons/QuestionCircleOutlined';
import RocketOutlined from '@ant-design/icons/RocketOutlined';

// icons
const icons = { DollarOutlined, LoginOutlined, PhoneOutlined, RocketOutlined, HistoryOutlined, QuestionCircleOutlined };

// ==============================|| MENU ITEMS - PAGES ||============================== //

const pages = {
  id: 'group-pages',
  title: 'nav.group.pages',
  type: 'group',
  children: [
    {
      id: 'authentication',
      title: 'nav.pages.authentication',
      type: 'collapse',
      icon: icons.LoginOutlined,
      children: [
        {
          id: 'login',
          title: 'nav.pages.login',
          type: 'item',
          url: '/auth/login',
          target: true
        },
        {
          id: 'register',
          title: 'nav.pages.register',
          type: 'item',
          url: '/auth/register',
          target: true
        },
        {
          id: 'forgot-password',
          title: 'nav.pages.forgotPassword',
          type: 'item',
          url: '/auth/forgot-password',
          target: true
        },
        {
          id: 'reset-password',
          title: 'nav.pages.resetPassword',
          type: 'item',
          url: '/auth/reset-password',
          target: true
        },
        {
          id: 'check-mail',
          title: 'nav.pages.checkMail',
          type: 'item',
          url: '/auth/check-mail',
          target: true
        },
        {
          id: 'code-verification',
          title: 'nav.pages.codeVerification',
          type: 'item',
          url: '/auth/code-verification',
          target: true
        }
      ]
    },
    {
      id: 'maintenance',
      title: 'nav.pages.maintenance',
      type: 'collapse',
      icon: icons.RocketOutlined,
      isDropdown: true,
      children: [
        {
          id: 'error-404',
          title: 'nav.pages.error404',
          type: 'item',
          url: '/maintenance/404',
          target: true
        },
        {
          id: 'error-500',
          title: 'nav.pages.error500',
          type: 'item',
          url: '/maintenance/500',
          target: true
        },
        {
          id: 'coming-soon',
          title: 'nav.pages.comingSoon',
          type: 'item',
          url: '/maintenance/coming-soon',
          target: true
        },
        {
          id: 'under-construction',
          title: 'nav.pages.underConstruction',
          type: 'item',
          url: '/maintenance/under-construction',
          target: true
        },
        {
          id: 'join-waitlist',
          title: 'nav.pages.joinWaitlist',
          type: 'item',
          url: '/maintenance/join-waitlist',
          target: true
        }
      ]
    },
    { id: 'change-log', title: 'nav.pages.changeLog', type: 'item', url: '/change-log', icon: icons.HistoryOutlined, target: true },
    {
      id: 'contact-us',
      title: 'nav.pages.contactUs',
      type: 'item',
      url: '/contact-us',
      icon: icons.PhoneOutlined,
      target: true
    },
    {
      id: 'faqs',
      title: 'nav.pages.faqs',
      type: 'item',
      url: '/faqs',
      icon: icons.QuestionCircleOutlined,
      target: true
    },
    {
      id: 'pricing',
      title: 'nav.pages.pricing',
      type: 'item',
      url: '/pricing',
      icon: icons.DollarOutlined
    }
  ]
};

export default pages;
