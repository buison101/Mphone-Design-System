// ==============================|| CLICK TO CALL - ERROR MESSAGES ||============================== //
//
// `click_to_call.php` answers with a code, and the codes are not
// interchangeable. The existing Contacts page maps every failure to one
// sentence, which is how a reader ends up pressing the same button twelve times
// against a switch that is down.
//
// Two of these must never read as "try again":
//
// - `extension_forbidden`: the extension chosen as the caller is not assigned to
//   this identity. Nothing the reader does to the number will fix it; the fix is
//   to pick one of their own extensions, or to ask whoever runs the PBX.
// - `switch_unavailable`: FreeSWITCH is not answering. The request never reached
//   a phone, the number is fine, and retrying in the same second cannot help.
//
// `originate_failed` is the one that is worth retrying — the switch took the
// command and refused it, usually because the caller's own handset is not
// registered.

const MESSAGE = {
  extension_forbidden: 'customer.call.error.extension',
  not_found: 'customer.call.error.extensionMissing',
  invalid_destination: 'customer.call.error.destination',
  switch_unavailable: 'customer.call.error.switch',
  originate_failed: 'customer.call.error.originate'
};

export function callErrorMessage(code) {
  return MESSAGE[code] || 'customer.call.error.generic';
}
