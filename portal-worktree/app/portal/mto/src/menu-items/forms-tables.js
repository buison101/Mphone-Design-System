// assets
import CloudUploadOutlined from '@ant-design/icons/CloudUploadOutlined';
import FileDoneOutlined from '@ant-design/icons/FileDoneOutlined';
import FormOutlined from '@ant-design/icons/FormOutlined';
import PieChartOutlined from '@ant-design/icons/PieChartOutlined';
import StepForwardOutlined from '@ant-design/icons/StepForwardOutlined';
import TableOutlined from '@ant-design/icons/TableOutlined';
import InsertRowAboveOutlined from '@ant-design/icons/InsertRowAboveOutlined';

// icons
const icons = {
  CloudUploadOutlined,
  FileDoneOutlined,
  FormOutlined,
  PieChartOutlined,
  StepForwardOutlined,
  TableOutlined,
  InsertRowAboveOutlined
};

// ==============================|| MENU ITEMS - FORMS & TABLES ||============================== //

const formsTables = {
  id: 'group-forms-tables',
  title: 'nav.group.formsTables',
  icon: icons.FileDoneOutlined,
  type: 'group',
  children: [
    {
      id: 'validation',
      title: 'nav.formsTables.validation',
      type: 'item',
      url: '/forms/validation',
      icon: icons.FileDoneOutlined
    },
    {
      id: 'wizard',
      title: 'nav.formsTables.wizard',
      type: 'item',
      url: '/forms/wizard',
      icon: icons.StepForwardOutlined
    },
    {
      id: 'forms-layout',
      title: 'nav.formsTables.formsLayout',
      type: 'collapse',
      icon: icons.FormOutlined,
      children: [
        {
          id: 'basic',
          title: 'nav.formsTables.basic',
          type: 'item',
          url: '/forms/layout/basic'
        },
        {
          id: 'multi-column',
          title: 'nav.formsTables.multiColumn',
          type: 'item',
          url: '/forms/layout/multi-column'
        },
        {
          id: 'action-bar',
          title: 'nav.formsTables.actionBar',
          type: 'item',
          url: '/forms/layout/action-bar'
        },
        {
          id: 'sticky-bar',
          title: 'nav.formsTables.stickyBar',
          type: 'item',
          url: '/forms/layout/sticky-bar'
        }
      ]
    },
    {
      id: 'forms-plugins',
      title: 'nav.formsTables.formsPlugins',
      type: 'collapse',
      icon: icons.CloudUploadOutlined,
      children: [
        {
          id: 'mask',
          title: 'nav.formsTables.mask',
          type: 'item',
          url: '/forms/plugins/mask'
        },
        {
          id: 'clipboard',
          title: 'nav.formsTables.clipboard',
          type: 'item',
          url: '/forms/plugins/clipboard'
        },
        {
          id: 're-captcha',
          title: 'nav.formsTables.reCaptcha',
          type: 'item',
          url: '/forms/plugins/re-captcha'
        },
        {
          id: 'editor',
          title: 'nav.formsTables.editor',
          type: 'item',
          url: '/forms/plugins/editor'
        },
        {
          id: 'dropzone',
          title: 'nav.formsTables.dropzone',
          type: 'item',
          url: '/forms/plugins/dropzone'
        }
      ]
    },
    {
      id: 'react-tables',
      title: 'nav.formsTables.reactTables',
      type: 'collapse',
      icon: icons.InsertRowAboveOutlined,
      children: [
        {
          id: 'rt-table',
          title: 'nav.formsTables.rtTable',
          type: 'item',
          url: '/tables/react-table/basic'
        },
        {
          id: 'rt-dense',
          title: 'nav.formsTables.rtDense',
          type: 'item',
          url: '/tables/react-table/dense'
        },
        {
          id: 'rt-sorting',
          title: 'nav.formsTables.rtSorting',
          type: 'item',
          url: '/tables/react-table/sorting'
        },
        {
          id: 'rt-filtering',
          title: 'nav.formsTables.rtFiltering',
          type: 'item',
          url: '/tables/react-table/filtering'
        },
        {
          id: 'rt-grouping',
          title: 'nav.formsTables.rtGrouping',
          type: 'item',
          url: '/tables/react-table/grouping'
        },
        {
          id: 'rt-pagination',
          title: 'nav.formsTables.rtPagination',
          type: 'item',
          url: '/tables/react-table/pagination'
        },
        {
          id: 'rt-row-selection',
          title: 'nav.formsTables.rtRowSelection',
          type: 'item',
          url: '/tables/react-table/row-selection'
        },
        {
          id: 'rt-expanding',
          title: 'nav.formsTables.rtExpanding',
          type: 'item',
          url: '/tables/react-table/expanding'
        },
        {
          id: 'rt-editable',
          title: 'nav.formsTables.rtEditable',
          type: 'item',
          url: '/tables/react-table/editable'
        },
        {
          id: 'rt-drag-drop',
          title: 'nav.formsTables.rtDragDrop',
          type: 'item',
          url: '/tables/react-table/drag-drop'
        },
        {
          id: 'rt-column-visibility',
          title: 'nav.formsTables.rtColumnVisibility',
          type: 'item',
          url: '/tables/react-table/column-visibility'
        },
        {
          id: 'rt-column-resizing',
          title: 'nav.formsTables.rtColumnResizing',
          type: 'item',
          url: '/tables/react-table/column-resizing'
        },
        {
          id: 'rt-sticky-table',
          title: 'nav.formsTables.rtStickyTable',
          type: 'item',
          url: '/tables/react-table/sticky-table'
        },
        {
          id: 'rt-umbrella',
          title: 'nav.formsTables.rtUmbrella',
          type: 'item',
          url: '/tables/react-table/umbrella'
        },
        {
          id: 'rt-empty',
          title: 'nav.formsTables.rtEmpty',
          type: 'item',
          url: '/tables/react-table/empty'
        },
        {
          id: 'rt-virtualized',
          title: 'nav.formsTables.rtVirtualized',
          type: 'item',
          url: '/tables/react-table/virtualized'
        }
      ]
    },
    {
      id: 'mui-tables',
      title: 'nav.formsTables.muiTables',
      type: 'collapse',
      icon: icons.TableOutlined,
      children: [
        {
          id: 'mui-table',
          title: 'nav.formsTables.muiTable',
          type: 'item',
          url: '/tables/mui-table/basic'
        },
        {
          id: 'mui-dense',
          title: 'nav.formsTables.muiDense',
          type: 'item',
          url: '/tables/mui-table/dense'
        },
        {
          id: 'mui-enhanced',
          title: 'nav.formsTables.muiEnhanced',
          type: 'item',
          url: '/tables/mui-table/enhanced'
        },
        {
          id: 'mui-data-table',
          title: 'nav.formsTables.muiDataTable',
          type: 'item',
          url: '/tables/mui-table/datatable'
        },
        {
          id: 'mui-custom',
          title: 'nav.formsTables.muiCustom',
          type: 'item',
          url: '/tables/mui-table/custom'
        },
        {
          id: 'mui-fixed-header',
          title: 'nav.formsTables.muiFixedHeader',
          type: 'item',
          url: '/tables/mui-table/fixed-header'
        },
        {
          id: 'mui-collapse',
          title: 'nav.formsTables.muiCollapse',
          type: 'item',
          url: '/tables/mui-table/collapse'
        }
      ]
    }
  ]
};

export default formsTables;
