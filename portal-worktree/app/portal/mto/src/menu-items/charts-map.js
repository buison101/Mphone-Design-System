// assets
import PieChartOutlined from '@ant-design/icons/PieChartOutlined';
import EnvironmentOutlined from '@ant-design/icons/EnvironmentOutlined';

// icons
const icons = { PieChartOutlined, EnvironmentOutlined };

// ==============================|| MENU ITEMS - FORMS & TABLES ||============================== //

const chartsMap = {
  id: 'group-charts-map',
  title: 'nav.group.chartsMap',
  icon: icons.PieChartOutlined,
  type: 'group',
  children: [
    {
      id: 'react-chart',
      title: 'nav.charts.reactChart',
      type: 'collapse',
      icon: icons.PieChartOutlined,
      children: [
        {
          id: 'apexchart',
          title: 'nav.charts.apexchart',
          type: 'item',
          url: '/charts/apexchart'
        },
        {
          id: 'org-chart',
          title: 'nav.charts.orgChart',
          type: 'item',
          url: '/charts/org-chart'
        }
      ]
    },
    {
      id: 'map',
      title: 'nav.charts.map',
      type: 'item',
      url: '/map',
      icon: icons.EnvironmentOutlined
    }
  ]
};

export default chartsMap;
