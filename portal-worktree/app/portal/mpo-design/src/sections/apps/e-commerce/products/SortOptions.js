// ==============================|| PRODUCT GRID - SORT FILTER ||============================== //

// Hoisted into a function so the labels are rebuilt on every render. As a
// module-scope constant this was evaluated once on import, which froze the
// first locale loaded. See docs/15 §4.7.
const getSortOptions = () => [
  {
    value: 'high',
    label: 'Price: High To Low'
  },
  {
    value: 'low',
    label: 'Price: Low To High'
  },
  {
    value: 'popularity',
    label: 'Popularity'
  },
  {
    value: 'discount',
    label: 'Discount'
  },
  {
    value: 'new',
    label: 'Fresh Arrivals'
  }
];

export default getSortOptions;
