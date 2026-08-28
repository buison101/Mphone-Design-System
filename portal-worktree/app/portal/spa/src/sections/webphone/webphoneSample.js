// ==============================|| WEBPHONE - PLACEHOLDER DATA ||============================== //
//
// Recent calls and the extension directory for the Bàn phím screen.
//
// Both have real endpoints waiting for them: recent calls belong to `calls.php`
// and the directory to `settings.php`, which already returns the extensions in
// the domain. They are stubbed here only so the screen can be reviewed before
// those two are wired, and the shapes match what those services return.

export const RECENT = [
  { id: 'w1', name: 'Trần Minh Quân', number: '1014', direction: 'outbound', status: 'answered', time: 'Hôm nay 14:26', duration: '3:34' },
  { id: 'w2', name: '', number: '0288 776 512', direction: 'inbound', status: 'missed', time: 'Hôm nay 14:28', duration: '—' },
  {
    id: 'w3',
    name: 'Công ty Thái Sơn',
    number: '0243 556 118',
    direction: 'inbound',
    status: 'answered',
    time: 'Hôm nay 14:21',
    duration: '8:06'
  },
  { id: 'w4', name: 'Lê Bảo Ngọc', number: '1007', direction: 'outbound', status: 'answered', time: 'Hôm nay 11:02', duration: '1:05' },
  { id: 'w5', name: '', number: '0356 774 991', direction: 'inbound', status: 'missed', time: 'Hôm nay 14:02', duration: '—' }
];

export const DIRECTORY = [
  { id: 'd1', name: 'Trần Minh Quân', extension: '1014', presence: 'available' },
  { id: 'd2', name: 'Lê Bảo Ngọc', extension: '1007', presence: 'busy' },
  { id: 'd3', name: 'Phạm Đức Anh', extension: '1022', presence: 'ringing' },
  { id: 'd4', name: 'Đỗ Hoàng Yến', extension: '1030', presence: 'away' },
  { id: 'd5', name: 'Kho Bình Tân', extension: '1008', presence: 'offline' }
];
