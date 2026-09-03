// Vietnamese date vocabulary for MPO Design.
//
// date-fns ships a `vi` locale, but three of its forms are not what a
// Vietnamese interface reads best, and one is not Vietnamese at all:
//
//   weekday, short/abbreviated   `Thứ 2`     -> `T2`   (`CN` for Sunday)
//   month, wide                  `tháng 09`  -> `Tháng 9`
//   month, abbreviated           `thg 9`     -> `Thg 9`
//   day period, abbreviated      `am` / `pm` -> `SA` / `CH`
//
// The last one is the reason this file exists rather than a few format-string
// edits: `format(date, 'h:mm a')` in vendor source renders `am`/`pm`, English,
// in the middle of a Vietnamese sentence, and no format string can fix that.
//
// Only `localize` is replaced. `match` — which `parse` uses to read text back —
// stays exactly as date-fns wrote it, because narrowing what the app can parse
// is a real regression and every picker in this tree writes numeric formats
// (`dd/MM/yyyy`), never month or weekday names.
//
// Decisions recorded in docs/19-i18n-glossary.vi.md: weekday names use sentence
// case (`Thứ hai`, not `Thứ Hai`), matching the §2.5 decision that per-word
// capitalisation is a spelling error in Vietnamese.

import { vi } from 'date-fns/locale';

const WEEKDAY_SHORT = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
const WEEKDAY_WIDE = ['Chủ nhật', 'Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu', 'Thứ bảy'];

const DAY_PERIOD_SHORT = {
  am: 'SA',
  pm: 'CH',
  midnight: 'nửa đêm',
  noon: 'trưa',
  morning: 'sáng',
  afternoon: 'chiều',
  evening: 'tối',
  night: 'đêm'
};

const DAY_PERIOD_WIDE = {
  am: 'Sáng',
  pm: 'Chiều',
  midnight: 'nửa đêm',
  noon: 'giữa trưa',
  morning: 'sáng',
  afternoon: 'chiều',
  evening: 'tối',
  night: 'đêm'
};

const day = (index, options) => (options?.width === 'wide' ? WEEKDAY_WIDE[index] : WEEKDAY_SHORT[index]);

const month = (index, options) => {
  const n = index + 1;
  if (options?.width === 'narrow') return String(n);
  if (options?.width === 'abbreviated' || options?.width === 'short') return 'Thg ' + n;
  return 'Tháng ' + n;
};

const dayPeriod = (value, options) => {
  const table = options?.width === 'wide' ? DAY_PERIOD_WIDE : DAY_PERIOD_SHORT;
  return table[value] ?? vi.localize.dayPeriod(value, options);
};

const dateLocaleVi = {
  ...vi,
  localize: { ...vi.localize, day, month, dayPeriod }
};

export default dateLocaleVi;
