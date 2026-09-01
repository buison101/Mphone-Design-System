// ==============================|| MENU ITEMS - COMPONENTS ||============================== //

const menuItems = [
  {
    id: 'all-components',
    type: 'group',
    children: [
      {
        id: 'all-component',
        search: 'all component',
        title: 'nav.components.allComponent',
        type: 'item',
        url: '/components-overview'
      }
    ]
  },
  {
    id: 'group-inputs',
    title: 'nav.group.inputs',
    type: 'group',
    children: [
      {
        id: 'autocomplete',
        search: 'autocomplete, combo box, country select, grouped, multi select',
        title: 'nav.components.autocomplete',
        type: 'item',
        url: '/components-overview/autocomplete'
      },
      {
        id: 'buttons',
        search: 'buttons, button group, icon button, toggle button, loading button',
        title: 'nav.components.buttons',
        type: 'item',
        url: '/components-overview/buttons'
      },
      {
        id: 'checkbox',
        search: 'checkbox, indeterminate',
        title: 'nav.components.checkbox',
        type: 'item',
        url: '/components-overview/checkbox'
      },
      {
        id: 'radio',
        search: 'radio',
        title: 'nav.components.radio',
        type: 'item',
        url: '/components-overview/radio'
      },
      {
        id: 'rating',
        search: 'rating, star rating, feedback',
        title: 'nav.components.rating',
        type: 'item',
        url: '/components-overview/rating'
      },
      {
        id: 'switch',
        search: 'switch',
        title: 'nav.components.switch',
        type: 'item',
        url: '/components-overview/switch'
      },
      {
        id: 'select',
        search: 'select, multi-select',
        title: 'nav.components.select',
        type: 'item',
        url: '/components-overview/select'
      },
      {
        id: 'slider',
        search: 'slider, range',
        title: 'nav.components.slider',
        type: 'item',
        url: '/components-overview/slider'
      },
      {
        id: 'textfield',
        search: 'textfield, input, form input, search',
        title: 'nav.components.textfield',
        type: 'item',
        url: '/components-overview/textfield'
      }
    ]
  },
  {
    id: 'data-display',
    title: 'nav.components.dataDisplay',
    type: 'group',
    children: [
      {
        id: 'avatars',
        search: 'avatars, fallbacks, group avatar',
        title: 'nav.components.avatars',
        type: 'item',
        url: '/components-overview/avatars'
      },
      {
        id: 'badges',
        search: 'badges',
        title: 'nav.components.badges',
        type: 'item',
        url: '/components-overview/badges'
      },
      {
        id: 'chips',
        search: 'chips, tags, ',
        title: 'nav.components.chips',
        type: 'item',
        url: '/components-overview/chips'
      },
      {
        id: 'lists',
        search: 'lists, folder list, nested list',
        title: 'nav.components.lists',
        type: 'item',
        url: '/components-overview/lists'
      },
      {
        id: 'tooltip',
        search: 'tooltip',
        title: 'nav.components.tooltip',
        type: 'item',
        url: '/components-overview/tooltip'
      },
      {
        id: 'typography',
        search: 'typography, h1, h2,h3, h4, h5, h6, caption, subtitle, body',
        title: 'nav.components.typography',
        type: 'item',
        url: '/components-overview/typography'
      }
    ]
  },
  {
    id: 'feedback',
    title: 'nav.components.feedback',
    type: 'group',
    children: [
      {
        id: 'alert',
        search: 'alert',
        title: 'nav.components.alert',
        type: 'item',
        url: '/components-overview/alert'
      },
      {
        id: 'dialogs',
        search: 'dialogs, modal, sweetalert, confirmation box',
        title: 'nav.components.dialogs',
        type: 'item',
        url: '/components-overview/dialogs'
      },
      {
        id: 'progress',
        search: 'progress, circular, linear, buffer',
        title: 'nav.components.progress',
        type: 'item',
        url: '/components-overview/progress'
      },
      {
        id: 'snackbar',
        search: 'snackbar, notification, notify',
        title: 'nav.components.snackbar',
        type: 'item',
        url: '/components-overview/snackbar'
      }
    ]
  },
  {
    id: 'navigation',
    title: 'nav.components.navigation',
    type: 'group',
    children: [
      {
        id: 'breadcrumbs',
        search: 'breadcrumbs',
        title: 'nav.components.breadcrumbs',
        type: 'item',
        url: '/components-overview/breadcrumbs'
      },
      {
        id: 'pagination',
        search: 'pagination, table pagination',
        title: 'nav.components.pagination',
        type: 'item',
        url: '/components-overview/pagination'
      },
      {
        id: 'speeddial',
        search: 'speeddial, speed dial, quick access button, fab button',
        title: 'nav.components.speeddial',
        type: 'item',
        url: '/components-overview/speeddial'
      },
      {
        id: 'stepper',
        search: 'stepper, form wizard, vertical stepper, vertical wizard',
        title: 'nav.components.stepper',
        type: 'item',
        url: '/components-overview/stepper'
      },
      {
        id: 'tabs',
        search: 'tabs, vertical tab',
        title: 'nav.components.tabs',
        type: 'item',
        url: '/components-overview/tabs'
      }
    ]
  },
  {
    id: 'surfaces',
    title: 'nav.components.surfaces',
    type: 'group',
    children: [
      {
        id: 'accordion',
        search: 'accordion',
        title: 'nav.components.accordion',
        type: 'item',
        url: '/components-overview/accordion'
      },
      {
        id: 'cards',
        search: 'cards',
        title: 'nav.components.cards',
        type: 'item',
        url: '/components-overview/cards'
      }
    ]
  },
  {
    id: 'utils',
    title: 'nav.components.utils',
    type: 'group',
    children: [
      {
        id: 'color',
        search: 'color',
        title: 'nav.components.color',
        type: 'item',
        url: '/components-overview/color'
      },
      {
        id: 'date-time-picker',
        search: 'datetime, date, time date time, picker, date range picker',
        title: 'nav.components.dateTimePicker',
        type: 'item',
        url: '/components-overview/date-time-picker'
      },
      {
        id: 'modal',
        search: 'modal, dialog',
        title: 'nav.components.modal',
        type: 'item',
        url: '/components-overview/modal'
      },
      {
        id: 'shadows',
        search: 'shadows, color shadow',
        title: 'nav.components.shadows',
        type: 'item',
        url: '/components-overview/shadows'
      },
      {
        id: 'timeline',
        search: 'timeline, list of event',
        title: 'nav.components.timeline',
        type: 'item',
        url: '/components-overview/timeline'
      },
      {
        id: 'treeview',
        search: 'treeview, email clone',
        title: 'nav.components.treeview',
        type: 'item',
        url: '/components-overview/treeview'
      }
    ]
  }
];

export default menuItems;
