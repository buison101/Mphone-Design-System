// assets
import LineChartOutlined from '@ant-design/icons/LineChartOutlined';
import IdcardOutlined from '@ant-design/icons/IdcardOutlined';
import DatabaseOutlined from '@ant-design/icons/DatabaseOutlined';

// icons
const icons = { LineChartOutlined, IdcardOutlined, DatabaseOutlined };

// ==============================|| MENU ITEMS - DASHBOARD ||============================== //

const widget = {
  id: 'group-widget',
  title: 'nav.group.widget',
  icon: icons.IdcardOutlined,
  type: 'group',
  children: [
    {
      id: 'statistics',
      title: 'nav.widget.statistics',
      type: 'item',
      url: '/widget/statistics',
      icon: icons.IdcardOutlined
    },
    {
      id: 'data',
      title: 'nav.widget.data',
      type: 'item',
      url: '/widget/data',
      icon: icons.DatabaseOutlined
    },
    {
      id: 'chart',
      title: 'nav.widget.chart',
      type: 'item',
      url: '/widget/chart',
      icon: icons.LineChartOutlined
    }
  ]
};

export default widget;
