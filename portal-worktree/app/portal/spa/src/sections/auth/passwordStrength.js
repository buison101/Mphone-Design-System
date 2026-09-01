// ==============================|| AUTH - PASSWORD STRENGTH ||============================== //
//
// A thin layer over utils/password-strength.js, which arrived with the Mantis
// template and had never been called by anything.
//
// It is wrapped rather than used directly for one reason: the original returns
// its own English label ("Poor", "Weak", "Strong") straight out of the scoring
// function, so a Vietnamese reader would be told their password is "Weak". This
// returns a level id and lets the component ask react-intl for the words.
//
// The original also has an unreachable branch — `count < 6` catches every score
// the indicator can produce, so its trailing "Poor" can never be returned. The
// bands below are written out in full instead of inheriting that shape.

import { strengthIndicator } from 'utils/password-strength';

// The indicator awards one point each for: longer than 5, longer than 7, a
// digit, a special character, and mixed case. Five points, five bands.
export const STRENGTH_MAX = 5;

const BANDS = [
  { upTo: 1, level: 'poor', color: 'error' },
  { upTo: 2, level: 'weak', color: 'warning' },
  { upTo: 3, level: 'fair', color: 'warning' },
  { upTo: 4, level: 'good', color: 'success' },
  { upTo: 5, level: 'strong', color: 'success' }
];

export function passwordStrength(value) {
  const score = value ? strengthIndicator(value) : 0;
  if (score === 0) return { score: 0, level: null, color: 'secondary' };
  const band = BANDS.find((item) => score <= item.upTo) ?? BANDS[BANDS.length - 1];
  return { score, level: band.level, color: band.color };
}
