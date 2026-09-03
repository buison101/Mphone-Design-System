// assets
import FileTextOutlined from '@ant-design/icons/FileTextOutlined';

const icons = {
  FileTextOutlined
};

// ==============================|| MENU ITEMS - PROMPTS ||============================== //

const prompts = {
  id: 'ai',
  type: 'group',
  title: 'ai',
  icon: icons.FileTextOutlined,
  children: [
    {
      id: 'ai',
      title: 'ai',
      type: 'item',
      url: '/ai',
      icon: icons.FileTextOutlined,
      chip: {
        label: 'new',
        color: 'error',
        size: 'small',
        variant: 'combined'
      },
      breadcrumbs: false,
      target: true
    },
    {
      id: 'prompts-overview',
      title: 'prompts-overview',
      type: 'item',
      url: '/prompts-overview',
      icon: icons.FileTextOutlined,
      chip: {
        label: 'AI',
        color: 'info',
        size: 'small',
        variant: 'filled'
      },
      breadcrumbs: false,
      target: true
    }
  ]
};

export default prompts;
