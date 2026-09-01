// ==============================|| AUTH - LOGIN ERROR MAPPING ||============================== //
//
// One place that turns what identity.php answered into what the reader is told.
//
// It exists because the gate used to fall back to "email or password is
// incorrect" for anything it did not recognise, and two of the codes it did not
// recognise are not that:
//
//   invalid_csrf — the token minted with the page has aged out, usually because
//     the tab sat open. The password was fine. Told it was wrong, someone will
//     retype a correct password until they give up, because nothing about
//     retyping mints a new token. The gate refreshes the token on this code, so
//     "try again" is advice that now works.
//   invalid_identity_mapping — the credentials were accepted and the account is
//     not attached to a PBX user. There is nothing the reader can type that
//     fixes this, so sending them back to the password field wastes their time
//     and hides a real provisioning fault from whoever could fix it.
//
// A code that is genuinely unknown still falls back to the credentials message:
// it is the likeliest cause, and it reveals nothing about an account.

export const LOGIN_ERROR_MESSAGE = {
  invalid_credentials: 'login.error.invalid',
  invalid_request: 'login.error.invalid',
  rate_limited: 'login.error.rateLimited',
  service_unavailable: 'login.error.unavailable',
  unavailable: 'login.error.unavailable',
  method_not_allowed: 'login.error.unavailable',
  forbidden: 'login.error.forbidden',
  invalid_csrf: 'login.error.expired',
  invalid_identity_mapping: 'login.error.unmapped'
};

// The one code the browser can recover from on its own: re-reading the session
// endpoint mints a fresh login token, so the reader's next attempt can succeed.
export const RECOVERABLE_LOGIN_ERRORS = ['invalid_csrf'];

export function loginErrorMessage(code) {
  return LOGIN_ERROR_MESSAGE[code] || 'login.error.invalid';
}
