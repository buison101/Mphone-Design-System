// ==============================|| BILLING - PLACEHOLDER DATA ||============================== //
//
// Shape-accurate sample data for the Hoá đơn composition.
//
// `app/portal/service/` has no billing endpoint. Nothing on the server issues an
// invoice, records a payment or prices a call, so every figure below is invented
// and the page says so on screen. Showing a tenant a number that looks like
// money and is not is the worst failure this portal could ship; the notice at
// the top of the page is not decoration and does not come off until this file
// does.
//
// When `billing.php` lands, the swap is this import for `useBilling(BILLING_URL,
// currency)` and nothing else — every field here is named for the field the
// endpoint is expected to return.
//
// The numbers reconcile on purpose. The twelve monthly amounts sum to `total`,
// `paid + pending + overdue` sums to `total`, and the four breakdown lines sum
// to the current period's invoice. A reviewer who adds them up should find them
// consistent, because a reader of the real page will.

// Months are ordinals so the axis follows the reader's language. Sep 2025 →
// Aug 2026, the twelve closed periods behind the current one.
const TWELVE_MONTHS = [8, 9, 10, 11, 0, 1, 2, 3, 4, 5, 6, 7];

export const CURRENCIES = ['VND', 'USD'];

export const BILLING = {
  // The domestic tenant: 40 extensions, 3 DID numbers, priced in đồng.
  VND: {
    period: { year: 2026, month: 7 },
    months: TWELVE_MONTHS,
    // One bar per closed period, coloured by how that period's invoice ended.
    series: [
      { amount: 6910000, status: 'paid' },
      { amount: 7240000, status: 'paid' },
      { amount: 7580000, status: 'paid' },
      { amount: 8320000, status: 'paid' },
      { amount: 6450000, status: 'paid' },
      { amount: 6120000, status: 'paid' },
      { amount: 7290000, status: 'paid' },
      { amount: 7015000, status: 'paid' },
      { amount: 6980000, status: 'overdue' },
      { amount: 7412000, status: 'paid' },
      { amount: 8145000, status: 'paid' },
      { amount: 7730000, status: 'pending' }
    ],
    summary: {
      total: { amount: 87192000, count: 12, delta: 6.4, isLoss: false },
      paid: { amount: 72482000, count: 10 },
      pending: { amount: 7730000, count: 1 },
      overdue: { amount: 6980000, count: 1 },
      cancelled: { amount: 1240000, count: 1 }
    },
    breakdown: [
      { id: 'usage', amount: 4850000 },
      { id: 'extensions', amount: 2200000 },
      { id: 'numbers', amount: 360000 },
      { id: 'storage', amount: 320000 }
    ],
    invoices: [
      { id: 'MP-2026-08', period: { year: 2026, month: 7 }, amount: 7730000, status: 'pending', due: '2026-09-05' },
      { id: 'MP-2026-07', period: { year: 2026, month: 6 }, amount: 8145000, status: 'paid', due: '2026-08-05', settled: '2026-08-04' },
      { id: 'MP-2026-06', period: { year: 2026, month: 5 }, amount: 7412000, status: 'paid', due: '2026-07-05', settled: '2026-07-03' },
      { id: 'MP-2026-05', period: { year: 2026, month: 4 }, amount: 6980000, status: 'overdue', due: '2026-06-05' },
      { id: 'MP-2026-04', period: { year: 2026, month: 3 }, amount: 7015000, status: 'paid', due: '2026-05-05', settled: '2026-05-05' },
      { id: 'MP-2026-03R', period: { year: 2026, month: 2 }, amount: 7290000, status: 'paid', due: '2026-04-06', settled: '2026-04-06' },
      {
        id: 'MP-2026-03',
        period: { year: 2026, month: 2 },
        amount: 1240000,
        status: 'cancelled',
        due: '2026-04-06',
        replacedBy: 'MP-2026-03R'
      },
      { id: 'MP-2026-02', period: { year: 2026, month: 1 }, amount: 6120000, status: 'paid', due: '2026-03-05', settled: '2026-03-04' },
      { id: 'MP-2026-01', period: { year: 2026, month: 0 }, amount: 6450000, status: 'paid', due: '2026-02-05', settled: '2026-02-05' },
      { id: 'MP-2025-12', period: { year: 2025, month: 11 }, amount: 8320000, status: 'paid', due: '2026-01-06', settled: '2026-01-06' },
      { id: 'MP-2025-11', period: { year: 2025, month: 10 }, amount: 7580000, status: 'paid', due: '2025-12-05', settled: '2025-12-04' },
      { id: 'MP-2025-10', period: { year: 2025, month: 9 }, amount: 7240000, status: 'paid', due: '2025-11-05', settled: '2025-11-05' },
      { id: 'MP-2025-09', period: { year: 2025, month: 8 }, amount: 6910000, status: 'paid', due: '2025-10-05', settled: '2025-10-03' }
    ],
    activity: [
      { id: 'a1', kind: 'issued', invoice: 'MP-2026-08', amount: 7730000, days: 3 },
      { id: 'a2', kind: 'payment', invoice: 'MP-2026-07', amount: 8145000, days: 25 },
      { id: 'a3', kind: 'overdue', invoice: 'MP-2026-05', amount: 6980000, days: 85 },
      { id: 'a4', kind: 'usage', amount: 4850000, meta: 12.4, days: 3 },
      { id: 'a5', kind: 'change', amount: 275000, meta: 5, days: 11 }
    ]
  },

  // The tenant billed in dollars: 10 extensions, 2 DID numbers. Kept in the
  // sample because a page that only ever renders one currency hides every place
  // the layout assumed a wide đồng figure.
  USD: {
    period: { year: 2026, month: 7 },
    months: TWELVE_MONTHS,
    series: [
      { amount: 361.2, status: 'paid' },
      { amount: 378.9, status: 'paid' },
      { amount: 395.4, status: 'paid' },
      { amount: 441.8, status: 'paid' },
      { amount: 352.6, status: 'paid' },
      { amount: 338.1, status: 'paid' },
      { amount: 402.7, status: 'paid' },
      { amount: 388.5, status: 'paid' },
      { amount: 374.2, status: 'paid' },
      { amount: 396.8, status: 'paid' },
      { amount: 428.3, status: 'paid' },
      { amount: 412.5, status: 'pending' }
    ],
    summary: {
      total: { amount: 4671, count: 12, delta: 2.8, isLoss: false },
      paid: { amount: 4258.5, count: 11 },
      pending: { amount: 412.5, count: 1 },
      // Zero on purpose: the overdue tile has to read correctly when there is
      // nothing wrong, and that state is easy to never look at.
      overdue: { amount: 0, count: 0 },
      cancelled: { amount: 0, count: 0 }
    },
    breakdown: [
      { id: 'usage', amount: 268.4 },
      { id: 'extensions', amount: 110 },
      { id: 'numbers', amount: 24 },
      { id: 'storage', amount: 10.1 }
    ],
    invoices: [
      { id: 'MP-US-2026-08', period: { year: 2026, month: 7 }, amount: 412.5, status: 'pending', due: '2026-09-05' },
      { id: 'MP-US-2026-07', period: { year: 2026, month: 6 }, amount: 428.3, status: 'paid', due: '2026-08-05', settled: '2026-08-03' },
      { id: 'MP-US-2026-06', period: { year: 2026, month: 5 }, amount: 396.8, status: 'paid', due: '2026-07-05', settled: '2026-07-04' },
      { id: 'MP-US-2026-05', period: { year: 2026, month: 4 }, amount: 374.2, status: 'paid', due: '2026-06-05', settled: '2026-06-02' },
      { id: 'MP-US-2026-04', period: { year: 2026, month: 3 }, amount: 388.5, status: 'paid', due: '2026-05-05', settled: '2026-05-05' },
      { id: 'MP-US-2026-03', period: { year: 2026, month: 2 }, amount: 402.7, status: 'paid', due: '2026-04-06', settled: '2026-04-06' },
      { id: 'MP-US-2026-02', period: { year: 2026, month: 1 }, amount: 338.1, status: 'paid', due: '2026-03-05', settled: '2026-03-05' },
      { id: 'MP-US-2026-01', period: { year: 2026, month: 0 }, amount: 352.6, status: 'paid', due: '2026-02-05', settled: '2026-02-04' },
      { id: 'MP-US-2025-12', period: { year: 2025, month: 11 }, amount: 441.8, status: 'paid', due: '2026-01-06', settled: '2026-01-05' },
      { id: 'MP-US-2025-11', period: { year: 2025, month: 10 }, amount: 395.4, status: 'paid', due: '2025-12-05', settled: '2025-12-05' },
      { id: 'MP-US-2025-10', period: { year: 2025, month: 9 }, amount: 378.9, status: 'paid', due: '2025-11-05', settled: '2025-11-04' },
      { id: 'MP-US-2025-09', period: { year: 2025, month: 8 }, amount: 361.2, status: 'paid', due: '2025-10-05', settled: '2025-10-05' }
    ],
    activity: [
      { id: 'b1', kind: 'issued', invoice: 'MP-US-2026-08', amount: 412.5, days: 3 },
      { id: 'b2', kind: 'payment', invoice: 'MP-US-2026-07', amount: 428.3, days: 26 },
      { id: 'b3', kind: 'usage', amount: 268.4, meta: 8.1, days: 3 },
      { id: 'b4', kind: 'change', amount: 22, meta: 2, days: 19 }
    ]
  }
};
