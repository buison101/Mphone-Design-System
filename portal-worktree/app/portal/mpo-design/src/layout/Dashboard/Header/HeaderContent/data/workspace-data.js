// Hoisted into a function so the labels are rebuilt on every render. As a
// module-scope constant this was evaluated once on import, which froze the
// first locale loaded. See docs/15 §4.7.
export const getWorkspaceData = () => [
  {
    id: 1,
    title: 'Acme Corp',
    image: 'bag.svg',
    label: 'Free'
  },
  {
    id: 2,
    title: 'Globex Inc.',
    image: 'global.svg',
    label: 'Pro'
  },
  {
    id: 3,
    title: 'Stellar Labs',
    image: 'lab.svg'
  }
];
