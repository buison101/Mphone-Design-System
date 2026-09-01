// ==============================|| CONTACT CARD - FIELD MAPPING ||============================== //
//
// One place that knows what `contacts.php` actually returns, so the card, the
// dialog and the page cannot disagree about it. The endpoint answers exactly
// this per row and nothing else:
//
//   { uuid, name, title, organization, type, phones: [{ label, number, extension, primary }] }
//
// Everything Mantis's customer card shows beyond that - email, country,
// website, age, gender, education, employment, skills - has no field behind it
// here, so none of it is drawn. A card that prints "—" in six slots is a card
// that teaches a reader the record is empty rather than that the question was
// never asked.
//
// FusionPBX writes contact_type free-form, so the type is matched case-
// insensitively against the values the seed data and the admin UI actually use,
// and anything unrecognised is shown as it was typed rather than dropped.

const TYPE_MESSAGE = {
  customer: 'customer.type.customer',
  client: 'customer.type.customer',
  vendor: 'customer.type.vendor',
  supplier: 'customer.type.vendor',
  partner: 'customer.type.partner',
  employee: 'customer.type.employee',
  staff: 'customer.type.employee',
  internal: 'customer.type.employee',
  lead: 'customer.type.lead',
  prospect: 'customer.type.lead'
};

// The phone label is FusionPBX's own vocabulary (work, mobile, home, fax...).
const LABEL_MESSAGE = {
  work: 'customer.phone.work',
  office: 'customer.phone.work',
  mobile: 'customer.phone.mobile',
  cell: 'customer.phone.mobile',
  home: 'customer.phone.home',
  fax: 'customer.phone.fax',
  main: 'customer.phone.main',
  other: 'customer.phone.other'
};

const lookup = (map, value) => (value ? map[String(value).trim().toLowerCase()] : undefined);

export function typeLabel(intl, type) {
  const id = lookup(TYPE_MESSAGE, type);
  if (id) return intl.formatMessage({ id });
  return type || '';
}

export function phoneLabel(intl, label) {
  const id = lookup(LABEL_MESSAGE, label);
  if (id) return intl.formatMessage({ id });
  return label || '';
}

// The server sorts phones primary-first, but a row with no primary flag at all
// is possible, so the first number is the fallback rather than an assumption.
export function primaryPhone(contact) {
  const phones = contact?.phones ?? [];
  return phones.find((phone) => phone.primary) || phones[0] || null;
}

export function contactInitials(contact) {
  const source = (contact?.name || contact?.organization || '').trim();
  if (!source) return '?';
  const words = source.split(/\s+/).filter(Boolean);
  const first = words[0][0];
  const last = words.length > 1 ? words[words.length - 1][0] : '';
  return (first + last).toUpperCase();
}

// A directory can hold a contact with an organization and no person's name.
// Showing an empty heading is worse than showing the organization twice.
export function contactName(contact, fallback) {
  return contact?.name?.trim() || contact?.organization?.trim() || fallback;
}

export const AVATAR_TONES = ['primary', 'info', 'success', 'warning', 'error'];
