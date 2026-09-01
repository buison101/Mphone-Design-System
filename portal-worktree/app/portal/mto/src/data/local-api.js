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

const customers = [
  {
    id: 1,
    firstName: 'Minh',
    lastName: 'Nguyen',
    name: 'Minh Nguyen',
    role: 'Mphone Business customer',
    about: 'this is a local sample customer for interface evaluation.',
    email: 'minh.nguyen@example.local',
    contact: '0900000001',
    age: 32,
    country: 'Vietnam',
    status: 'Active',
    avatar: 1,
    skills: ['Cloud PBX', 'Webphone'],
    time: '2026'
  },
  {
    id: 2,
    firstName: 'Lan',
    lastName: 'Tran',
    name: 'Lan Tran',
    role: 'Mphone team administrator',
    about: 'this profile uses sample data and is not connected to a live service.',
    email: 'lan.tran@example.local',
    contact: '0900000002',
    age: 29,
    country: 'Vietnam',
    status: 'Active',
    avatar: 2,
    skills: ['Call queue', 'Reports'],
    time: '2026'
  }
];

const invoices = [
  {
    id: 1,
    invoice_id: 202609001,
    customer_name: 'Minh Nguyen',
    email: 'minh.nguyen@example.local',
    avatar: 1,
    status: 'Paid',
    date: '2026-09-01',
    due_date: '2026-09-15',
    quantity: 2,
    discount: 5,
    tax: 10,
    country: { code: 'US', label: 'United States Dollar', currency: 'Dollar', prefix: '$' },
    cashierInfo: {
      name: 'Mphone UI Lab',
      address: 'Local sample workspace',
      phone: 'Sample contact',
      email: 'support@example.local'
    },
    customerInfo: {
      name: 'Minh Nguyen',
      address: 'Sample customer address',
      phone: '0900000001',
      email: 'minh.nguyen@example.local'
    },
    invoice_detail: [
      { id: 1, name: 'Cloud PBX', description: 'Local service sample', qty: 1, price: '24.00' },
      { id: 2, name: 'Webphone', description: 'Simulated browser calling experience', qty: 1, price: '12.00' }
    ],
    notes: 'Local sample invoice. No payment or live service is connected.'
  }
];

const products = [
  {
    id: 1,
    name: 'Cloud PBX workspace',
    brand: 'Mphone sample',
    about: 'A local product demonstration for evaluating the Mantis commerce layouts.',
    description: 'Sample product data. No purchase or service activation is available.',
    image: 'prod-1.png',
    colors: ['primaryDark', 'errorDark'],
    offer: 'Sample',
    isStock: true,
    offerPrice: 24,
    salePrice: 30,
    rating: 4.5
  },
  {
    id: 2,
    name: 'Webphone workspace',
    brand: 'Mphone sample',
    about: 'A simulated browser calling product card for local interface review.',
    description: 'Sample product data. Calling and checkout actions are simulated.',
    image: 'prod-2.png',
    colors: ['primaryDark'],
    offer: 'Sample',
    isStock: true,
    offerPrice: 12,
    salePrice: 15,
    rating: 4.2
  }
];

const responses = {
  '/api/account/login': { user: { name: 'Mphone UI Lab' }, serviceToken: 'local-simulation' },
  '/api/account/me': { user: { name: 'Mphone UI Lab' } },
  '/api/account/register': [],
  '/api/address/list': { address: [] },
  '/api/calendar/events': { events: [] },
  '/api/chat/users': { users: chatUsers },
  '/api/customer/list': { customers },
  '/api/invoice/list': { invoice: invoices },
  '/api/kanban': { backlogs: emptyBacklogs },
  '/api/menu/dashboard': { dashboard },
  '/api/products/list': { products },
  '/api/products/filter': { products },
  '/api/product/details': products[0],
  '/api/product/related': products.slice(1),
  '/api/review/list': { productReviews: [] }
};

export function getLocalResponse(url = '', method = 'get', body) {
  const path = `/${String(url).replace(/^\/+/, '')}`;

  if (path === '/api/chat/filter' && method?.toLowerCase() === 'post') return [];

  if (path === '/api/product/details') {
    const payload = typeof body === 'string' ? JSON.parse(body) : body;
    return structuredClone(products.find((product) => product.id === Number(payload?.id)) ?? null);
  }

  if (path === '/api/product/related') {
    const payload = typeof body === 'string' ? JSON.parse(body) : body;
    return structuredClone(products.filter((product) => product.id !== Number(payload?.id)));
  }

  return structuredClone(responses[path] ?? {});
}
