// assets
import FileTextOutlined from '@ant-design/icons/FileTextOutlined';

const icons = {
  FileTextOutlined
};

// ==============================|| MENU ITEMS - PROMPTS ||============================== //

const prompts = {
  id: 'ai',
  type: 'group',
  title: 'nav.ai.assistant',
  icon: icons.FileTextOutlined,
  children: [
    {
      id: 'ai',
      title: 'nav.ai.workspace',
      type: 'item',
      url: '/ai',
      icon: icons.FileTextOutlined,
      chip: {
        label: 'nav.chip.new',
        color: 'error',
        size: 'small',
        variant: 'combined'
      },
      breadcrumbs: false,
      target: true
    },
    {
      id: 'prompts-overview',
      title: 'nav.ai.promptsOverview',
      type: 'item',
      url: '/prompts-overview',
      icon: icons.FileTextOutlined,
      chip: {
        label: 'nav.chip.ai',
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
