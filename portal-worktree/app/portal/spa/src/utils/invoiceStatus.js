// ==============================|| INVOICE STATUS ||============================== //
//
// The four states a tenant's invoice can be in. A tenant never sees a provider's
// draft, so there is no `draft` here: Mantis carries one because its screen is
// built for whoever *issues* the invoice, and this portal is the side that
// receives it.
//
// `cancelled` is deliberately not a failure colour. A cancelled invoice is not a
// problem the reader has to act on — it is an amount that stopped existing — and
// painting it red would put it beside `overdue` in the one glance that matters.
//
// Status is never carried by colour alone anywhere it is drawn: every chip pairs
// the colour with its own icon and its own text label.

import CheckCircleOutlined from '@ant-design/icons/CheckCircleOutlined';
import ClockCircleOutlined from '@ant-design/icons/ClockCircleOutlined';
import ExclamationCircleOutlined from '@ant-design/icons/ExclamationCircleOutlined';
import StopOutlined from '@ant-design/icons/StopOutlined';
import ProfileOutlined from '@ant-design/icons/ProfileOutlined';

export const INVOICE_STATUSES = ['paid', 'pending', 'overdue', 'cancelled'];

export const INVOICE_STATUS_COLOR = {
  all: 'primary',
  paid: 'success',
  pending: 'warning',
  overdue: 'error',
  cancelled: 'secondary'
};

export const INVOICE_STATUS_ICON = {
  all: ProfileOutlined,
  paid: CheckCircleOutlined,
  pending: ClockCircleOutlined,
  overdue: ExclamationCircleOutlined,
  cancelled: StopOutlined
};

// A cancelled invoice was never charged, so it is excluded from every total on
// the page. One place decides that, because three cards ask the question.
export const isBilled = (invoice) => invoice.status !== 'cancelled';
