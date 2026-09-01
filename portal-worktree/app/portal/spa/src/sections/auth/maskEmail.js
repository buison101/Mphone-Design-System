// ==============================|| AUTH - MASK EMAIL ||============================== //
//
// Shows enough of an address for the reader to recognise which account this is,
// without printing it in full on a screen somebody else may be looking at.
//
// The first character of the mailbox and the whole domain are kept. Mantis masks
// the other way round — "jone. ****@company.com" keeps the name and hides the
// mailbox — which reveals the person and withholds the only part that
// distinguishes two accounts at the same company.
//
// This is presentation, not protection: whoever sent the code already knows the
// address. It exists so a support call, a screen share or a shoulder does not.

export default function maskEmail(email) {
  const value = String(email || '');
  const at = value.lastIndexOf('@');
  if (at < 1) return value;

  const local = value.slice(0, at);
  const domain = value.slice(at);
  if (local.length <= 1) return `${local}${'•'.repeat(3)}${domain}`;

  return `${local[0]}${'•'.repeat(Math.min(Math.max(local.length - 1, 3), 8))}${domain}`;
}
