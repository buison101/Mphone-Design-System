// assets
import paypal from 'assets/images/e-commerce/paypal.png';
import card from 'assets/images/e-commerce/card.png';

// ==============================|| CHECKOUT - PAYMENT OPTIONS ||============================== //

// Hoisted into a function so the labels are rebuilt on every render. As a
// module-scope constant this was evaluated once on import, which froze the
// first locale loaded. See docs/15 §4.7.
const getPaymentOptions = () => [
  {
    id: 2,
    value: 'card',
    title: 'Credit Card',
    caption: '10% off with master card',
    image: card,
    size: {
      width: 72,
      height: 24
    }
  },
  {
    id: 1,
    value: 'paypal',
    title: 'Pay with PayPal',
    caption: '5% off on first payment',
    image: paypal,
    size: {
      width: 50,
      height: 14
    }
  },
  {
    id: 3,
    value: 'cod',
    title: 'Cash on Delivery',
    caption: 'When you use this payment',
    size: {
      width: 46,
      height: 28
    }
  }
];

export default getPaymentOptions;
