const dashboard = {
  id: 'group-dashboard',
  title: 'nav.group.dashboard',
  type: 'group',
  icon: 'dashboard',
  children: [
    {
      id: 'dashboard-main',
      title: 'nav.dashboard.dashboard',
      type: 'collapse',
      icon: 'dashboard',
      children: [
        { id: 'dashboard-default', title: 'nav.dashboard.default', type: 'item', url: '/dashboard/default', breadcrumbs: false },
        { id: 'dashboard-analytics', title: 'nav.dashboard.analytics', type: 'item', url: '/dashboard/analytics', breadcrumbs: false }
      ]
    }
  ]
};

const emptyBacklogs = {
  columns: [],
  columnsOrder: [],
  comments: [],
  items: [],
  userStory: [],
  userStoryOrder: []
};

const chatUsers = [
  {
    id: 2,
    name: 'Mphone Support',
    role: 'Customer care',
    avatar: 'avatar-2.png',
    online_status: 'available',
    lastMessage: 'a moment',
    location: 'Ho Chi Minh City',
    personal_email: 'support@example.local',
    personal_phone: 'Local simulation'
  }
];

const responses = {
  '/api/account/login': { user: { name: 'Mphone UI Lab' }, serviceToken: 'local-simulation' },
  '/api/account/me': { user: { name: 'Mphone UI Lab' } },
  '/api/account/register': [],
  '/api/address/list': { address: [] },
  '/api/calendar/events': { events: [] },
  '/api/chat/users': { users: chatUsers },
  '/api/customer/list': { customers: [] },
  '/api/invoice/list': { invoice: [] },
  '/api/kanban': { backlogs: emptyBacklogs },
  '/api/menu/dashboard': { dashboard },
  '/api/products/list': { products: [] },
  '/api/products/filter': { products: [] },
  '/api/product/details': { product: null },
  '/api/product/related': { products: [] },
  '/api/review/list': { reviews: [] }
};

export function getLocalResponse(url = '', method = 'get') {
  const path = `/${String(url).replace(/^\/+/, '')}`;

  if (path === '/api/chat/filter' && method?.toLowerCase() === 'post') return [];

  return structuredClone(responses[path] ?? {});
}
