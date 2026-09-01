// assets
import BorderOutlined from '@ant-design/icons/BorderOutlined';
import BoxPlotOutlined from '@ant-design/icons/BoxPlotOutlined';
import DeploymentUnitOutlined from '@ant-design/icons/DeploymentUnitOutlined';
import GatewayOutlined from '@ant-design/icons/GatewayOutlined';
import MenuUnfoldOutlined from '@ant-design/icons/MenuUnfoldOutlined';
import QuestionOutlined from '@ant-design/icons/QuestionOutlined';
import SmileOutlined from '@ant-design/icons/SmileOutlined';
import StopOutlined from '@ant-design/icons/StopOutlined';

// icons
const icons = {
  BorderOutlined,
  BoxPlotOutlined,
  DeploymentUnitOutlined,
  GatewayOutlined,
  MenuUnfoldOutlined,
  QuestionOutlined,
  StopOutlined,
  SmileOutlined
};

// ==============================|| MENU ITEMS - SUPPORT ||============================== //

const other = {
  id: 'other',
  type: 'group',
  children: [
    {
      id: 'menu-level',
      title: 'nav.other.menuLevel',
      type: 'collapse',
      icon: icons.MenuUnfoldOutlined,
      children: [
        {
          id: 'menu-level-1.1',
          title: 'nav.other.menuLevel11',
          type: 'item',
          url: '#'
        },
        {
          id: 'menu-level-1.2',
          title: 'nav.other.menuLevel12',
          type: 'collapse',
          children: [
            {
              id: 'menu-level-2.1',
              title: 'nav.other.menuLevel21',
              type: 'item',
              url: '#'
            },
            {
              id: 'menu-level-2.2',
              title: 'nav.other.menuLevel22',
              type: 'collapse',
              children: [
                {
                  id: 'menu-level-3.1',
                  title: 'nav.other.menuLevel31',
                  type: 'item',
                  url: '#'
                },
                {
                  id: 'menu-level-3.2',
                  title: 'nav.other.menuLevel32',
                  type: 'item',
                  url: '#'
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: 'menu-level-subtitle',
      title: 'nav.other.menuLevelSubtitle',
      caption: 'nav.other.menuLevelSubtitle.caption',
      type: 'collapse',
      icon: icons.BoxPlotOutlined,
      children: [
        {
          id: 'sub-menu-level-1.1',
          title: 'nav.other.subMenuLevel11',
          caption: 'nav.other.subMenuLevel11.caption',
          type: 'item',
          url: '#'
        },
        {
          id: 'sub-menu-level-1.2',
          title: 'nav.other.subMenuLevel12',
          caption: 'nav.other.subMenuLevel12.caption',
          type: 'collapse',
          children: [
            {
              id: 'sub-menu-level-2.1',
              title: 'nav.other.subMenuLevel21',
              caption: 'nav.other.subMenuLevel21.caption',
              type: 'item',
              url: '#'
            }
          ]
        }
      ]
    },
    {
      id: 'disabled-menu',
      title: 'nav.other.disabledMenu',
      type: 'item',
      url: '#',
      icon: icons.StopOutlined,
      disabled: true
    },
    {
      id: 'oval-chip-menu',
      title: 'nav.other.ovalChipMenu',
      type: 'item',
      url: '#',
      icon: icons.BorderOutlined
    },
    {
      id: 'documentation',
      title: 'nav.other.documentation',
      type: 'item',
      url: 'https://call.mphone.vn/p/',
      icon: icons.QuestionOutlined,
      external: true,
      target: true,
      chip: {
        label: 'nav.chip.reference',
        color: 'secondary',
        size: 'small'
      }
    }
  ]
};

export default other;
