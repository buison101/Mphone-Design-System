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

const backlogs = {
  columns: [
    { id: 'column-1', title: 'Planned', itemIds: ['task-101', 'task-102'] },
    { id: 'column-2', title: 'In progress', itemIds: ['task-103'] },
    { id: 'column-3', title: 'Review', itemIds: ['task-104'] },
    { id: 'column-4', title: 'Completed', itemIds: ['task-105'] }
  ],
  columnsOrder: ['column-1', 'column-2', 'column-3', 'column-4'],
  profiles: [
    { id: 'profile-1', name: 'Minh Nguyen', avatar: 'avatar-1.png', time: '09:15' },
    { id: 'profile-2', name: 'Lan Tran', avatar: 'avatar-2.png', time: '10:30' },
    { id: 'profile-3', name: 'Mphone Support', avatar: 'avatar-3.png', time: '11:45' }
  ],
  comments: [
    {
      id: 'comment-1',
      profileId: 'profile-2',
      comment: 'The interaction is ready for local review.',
      time: '10:30'
    },
    {
      id: 'comment-2',
      profileId: 'profile-1',
      comment: 'Please verify the responsive layout and empty state.',
      time: '11:45'
    }
  ],
  items: [
    {
      id: 'task-101',
      title: 'Review Webphone call controls',
      dueDate: '2026-09-04T09:00:00.000Z',
      image: false,
      assign: 'profile-1',
      description: 'Evaluate the simulated call controls without connecting to SIP or PBX services.',
      priority: 'high',
      commentIds: ['comment-1'],
      attachments: []
    },
    {
      id: 'task-102',
      title: 'Check bilingual navigation labels',
      dueDate: '2026-09-05T09:00:00.000Z',
      image: false,
      assign: 'profile-2',
      description: 'Review Vietnamese and English labels in the local preview.',
      priority: 'medium',
      commentIds: [],
      attachments: []
    },
    {
      id: 'task-103',
      title: 'Prepare analytics sample states',
      dueDate: '2026-09-03T09:00:00.000Z',
      image: false,
      assign: 'profile-3',
      description: 'Exercise loading, populated, empty, and error presentation states.',
      priority: 'high',
      commentIds: ['comment-2'],
      attachments: []
    },
    {
      id: 'task-104',
      title: 'Validate invoice responsive layout',
      dueDate: '2026-09-06T09:00:00.000Z',
      image: false,
      assign: 'profile-1',
      description: 'Inspect invoice details at desktop and 390px widths.',
      priority: 'medium',
      commentIds: [],
      attachments: []
    },
    {
      id: 'task-105',
      title: 'Replace remote authentication demos',
      dueDate: '2026-09-01T09:00:00.000Z',
      image: false,
      assign: 'profile-2',
      description: 'Keep authentication screens interactive with local simulated sessions.',
      priority: 'low',
      commentIds: [],
      attachments: []
    }
  ],
  userStory: [
    {
      id: 'story-201',
      title: 'Evaluate simulated calling experience',
      assign: 'profile-1',
      columnId: 'column-2',
      priority: 'high',
      dueDate: '2026-09-06T09:00:00.000Z',
      acceptance: 'All controls remain clearly labelled as simulated.',
      description: 'A local-only product story for the Portal UI Lab.',
      commentIds: ['comment-1'],
      image: false,
      itemIds: ['task-101', 'task-103'],
      files: []
    },
    {
      id: 'story-202',
      title: 'Complete bilingual commerce demonstrations',
      assign: 'profile-2',
      columnId: 'column-1',
      priority: 'medium',
      dueDate: '2026-09-08T09:00:00.000Z',
      acceptance: 'Product, invoice, and checkout layouts are populated in both languages.',
      description: 'Preserve the Mantis demonstration purpose with Mphone sample content.',
      commentIds: ['comment-2'],
      image: false,
      itemIds: ['task-102', 'task-104'],
      files: []
    }
  ],
  userStoryOrder: ['story-201', 'story-202']
};

const chatUsers = [
  {
    id: 2,
    name: 'Mphone Support',
    role: 'Customer care',
    avatar: 'avatar-2.png',
    online_status: 'available',
    lastMessage: '2 min',
    status: 'The local preview is ready for review.',
    latestMessage: { seen: false },
    unReadChatCount: 2,
    location: 'Ho Chi Minh City',
    personal_email: 'support@example.local',
    personal_phone: 'Local simulation'
  },
  {
    id: 3,
    name: 'Lan Tran',
    role: 'Portal product team',
    avatar: 'avatar-3.png',
    online_status: 'available',
    lastMessage: '18 min',
    status: 'Calendar samples have been updated.',
    latestMessage: { seen: true },
    unReadChatCount: 0,
    location: 'Da Nang',
    personal_email: 'lan.tran@example.local',
    personal_phone: 'Local simulation'
  },
  {
    id: 4,
    name: 'Minh Nguyen',
    role: 'Interface reviewer',
    avatar: 'avatar-4.png',
    online_status: 'do_not_disturb',
    lastMessage: '1 hour',
    status: 'Reviewing the responsive invoice layout.',
    latestMessage: { seen: true },
    unReadChatCount: 0,
    location: 'Hanoi',
    personal_email: 'minh.nguyen@example.local',
    personal_phone: 'Local simulation'
  },
  {
    id: 5,
    name: 'Portal review group',
    role: 'Sample group conversation',
    avatar: 'avatar-5.png',
    online_status: 'available',
    lastMessage: '3 hours',
    status: 'Three reviewers are active.',
    latestMessage: { seen: true },
    unReadChatCount: 0,
    isGroup: true,
    location: 'Local UI Lab',
    personal_email: 'group@example.local',
    personal_phone: 'Local simulation'
  }
];

const chatMessages = {
  'Mphone Support': [
    { id: 1, from: 'Mphone Support', to: 'User1', text: 'Welcome to the local Mphone Portal preview.', time: '09:10' },
    { id: 2, from: 'User1', to: 'Mphone Support', text: 'I am checking the simulated call and billing screens.', time: '09:12' },
    { id: 3, from: 'Mphone Support', to: 'User1', text: 'No live PBX, payment, or customer data is connected.', time: '09:14' },
    { id: 4, from: 'User1', to: 'Mphone Support', text: 'Understood. I will review the responsive states next.', time: '09:15' }
  ],
  'Lan Tran': [
    { id: 5, from: 'Lan Tran', to: 'User1', text: 'The calendar now contains sample review sessions.', time: '10:20' },
    { id: 6, from: 'User1', to: 'Lan Tran', text: 'I will verify month, week, and list views.', time: '10:22' }
  ],
  'Minh Nguyen': [{ id: 7, from: 'Minh Nguyen', to: 'User1', text: 'Invoice details look ready for the 390px check.', time: '11:05' }],
  'Portal review group': [
    { id: 8, type: 'group', from: 'Lan Tran', to: 'Portal review group', text: 'Calendar and chat fixtures are ready.', time: '13:30' },
    { id: 9, type: 'group', from: 'User1', to: 'Portal review group', text: 'I am running the full sidebar smoke test.', time: '13:35' },
    {
      id: 10,
      type: 'group',
      from: 'Minh Nguyen',
      to: 'Portal review group',
      text: 'Please include dark mode in the review.',
      time: '13:38'
    }
  ]
};

const calendarEvents = [
  {
    id: 'event-1',
    title: 'Portal review',
    description: 'Review the populated MTO dashboard with local sample data.',
    start: '2026-09-02T09:00:00',
    end: '2026-09-02T10:00:00',
    allDay: false,
    color: '#1677ff',
    textColor: '#ffffff'
  },
  {
    id: 'event-2',
    title: 'Webphone prototype check',
    description: 'Evaluate simulated call states. No SIP connection is used.',
    start: '2026-09-03T13:30:00',
    end: '2026-09-03T14:30:00',
    allDay: false,
    color: '#52c41a',
    textColor: '#ffffff'
  },
  {
    id: 'event-3',
    title: 'Bilingual content review',
    description: 'Check Vietnamese and English copy across the selected routes.',
    start: '2026-09-05',
    end: '2026-09-06',
    allDay: true,
    color: '#faad14',
    textColor: '#1f1f1f'
  },
  {
    id: 'event-4',
    title: 'Responsive layout test',
    description: 'Inspect the Portal at desktop and 390px widths.',
    start: '2026-09-08T15:00:00',
    end: '2026-09-08T16:30:00',
    allDay: false,
    color: '#722ed1',
    textColor: '#ffffff'
  },
  {
    id: 'event-5',
    title: 'Local integration boundary review',
    description: 'Document future backend boundaries without connecting external services.',
    start: '2026-09-11T10:00:00',
    end: '2026-09-11T11:00:00',
    allDay: false,
    color: '#ff4d4f',
    textColor: '#ffffff'
  }
];

const addresses = [
  {
    id: 1,
    destination: 'Office',
    name: 'Minh Nguyen',
    building: 'Mphone sample workspace',
    street: 'Local preview street',
    city: 'Ho Chi Minh City',
    state: 'Ho Chi Minh City',
    country: 'Vietnam',
    post: '700000',
    phone: '0900000001',
    email: 'minh.nguyen@example.local',
    address: 'Mphone sample workspace, Ho Chi Minh City',
    isDefault: true
  },
  {
    id: 2,
    destination: 'Branch',
    name: 'Lan Tran',
    building: 'Local UI Lab branch',
    street: 'Sample review street',
    city: 'Da Nang',
    state: 'Da Nang',
    country: 'Vietnam',
    post: '550000',
    phone: '0900000002',
    email: 'lan.tran@example.local',
    address: 'Local UI Lab branch, Da Nang',
    isDefault: false
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
  },
  {
    id: 3,
    name: 'Call analytics workspace',
    brand: 'Mphone sample',
    about: 'A sample analytics product card for reviewing charts and reporting layouts.',
    description: 'Local sample data only. It does not contain real call records.',
    image: 'prod-3.png',
    colors: ['warningDark'],
    offer: 'Sample',
    isStock: true,
    offerPrice: 18,
    salePrice: 22,
    rating: 4.4
  },
  {
    id: 4,
    name: 'Contact workspace',
    brand: 'Mphone sample',
    about: 'A local contact-management demonstration for layout evaluation.',
    description: 'All contacts shown in this demonstration are fictional.',
    image: 'prod-4.png',
    colors: ['successDark'],
    offer: '',
    isStock: true,
    offerPrice: 8,
    salePrice: 10,
    rating: 4.1
  },
  {
    id: 5,
    name: 'Recording workspace',
    brand: 'Mphone sample',
    about: 'An unavailable product state retained for evaluating the original Mantis layout.',
    description: 'No recording service is connected to this local prototype.',
    image: 'prod-5.png',
    colors: ['secondaryMain'],
    offer: '',
    isStock: false,
    offerPrice: 14,
    salePrice: 18,
    rating: 3.9
  }
];

const productReviews = [
  {
    profile: { name: 'Lan Tran', avatar: 'avatar-3.png' },
    date: '2026-09-01T09:30:00',
    rating: 4.5,
    review: 'The local sample clearly demonstrates the product details layout.'
  },
  {
    profile: { name: 'Minh Nguyen', avatar: 'avatar-4.png' },
    date: '2026-08-30T14:15:00',
    rating: 4,
    review: 'Responsive states remain understandable without a live service connection.'
  }
];

const responses = {
  '/api/account/login': { user: { name: 'Mphone UI Lab' }, serviceToken: 'local-simulation' },
  '/api/account/me': { user: { name: 'Mphone UI Lab' } },
  '/api/account/register': [],
  '/api/address/list': { address: addresses },
  '/api/calendar/events': { events: calendarEvents },
  '/api/chat/users': { users: chatUsers },
  '/api/customer/list': { customers },
  '/api/invoice/list': { invoice: invoices },
  '/api/kanban': { backlogs },
  '/api/menu/dashboard': { dashboard },
  '/api/products/list': { products },
  '/api/products/filter': { products },
  '/api/product/details': products[0],
  '/api/product/related': products.slice(1),
  '/api/review/list': { productReviews }
};

export function getLocalResponse(url = '', method = 'get', body) {
  const path = `/${String(url).replace(/^\/+/, '')}`;

  if (path === '/api/chat/filter' && method?.toLowerCase() === 'post') {
    const payload = typeof body === 'string' ? JSON.parse(body) : body;
    return structuredClone(chatMessages[payload?.user] ?? []);
  }

  if (path === '/api/products/filter' && method?.toLowerCase() === 'post') return structuredClone(products);

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
