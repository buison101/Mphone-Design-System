// ==============================|| APP PHONE - PLACEHOLDER DATA ||============================== //
//
// Sample content for the app reconstruction. Same rule as everywhere else in
// this portal: the shapes match what the FusionPBX services return, and none of
// it survives into a release.

export const ACCOUNT = { name: 'Nguyễn Thu Hà', extension: '1001', domain: 'thaison.mphone.vn', email: 'ha.nguyen@example.vn' };

export const EXTENSIONS = [
  { id: 'x1', extension: '1001', label: 'Máy nhánh chính', registered: true, device: 'Mphone Android', primary: true },
  { id: 'x2', extension: '1014', label: 'Chăm sóc khách hàng', registered: true, device: 'Bàn lễ tân', primary: false },
  { id: 'x3', extension: '1008', label: 'Kho Bình Tân', registered: false, device: '', primary: false }
];

export const CALLS = [
  { id: 'k1', name: 'Trần Minh Quân', number: '1014', direction: 'outbound', status: 'answered', time: '14:26', duration: '3:34' },
  { id: 'k2', name: '', number: '0288 776 512', direction: 'inbound', status: 'missed', time: '14:28', duration: '—' },
  { id: 'k3', name: 'Công ty Thái Sơn', number: '0243 556 118', direction: 'inbound', status: 'answered', time: '14:21', duration: '8:06' },
  { id: 'k4', name: 'Lê Thị Mai', number: '0912 445 003', direction: 'inbound', status: 'voicemail', time: '14:15', duration: '0:38' },
  { id: 'k5', name: '', number: '0356 774 991', direction: 'inbound', status: 'missed', time: '14:02', duration: '—' },
  { id: 'k6', name: 'Trần Quốc Huy', number: '0987 220 641', direction: 'outbound', status: 'answered', time: '13:54', duration: '2:02' }
];

export const THREADS = [
  {
    id: 't1',
    name: 'Trần Minh Quân',
    extension: '1014',
    presence: 'available',
    time: '14:32',
    unread: 2,
    preview: 'Anh vừa gọi lại cho khách rồi nhé'
  },
  { id: 't2', name: 'Lê Bảo Ngọc', extension: '1007', presence: 'busy', time: '14:05', unread: 0, preview: 'Hàng đợi đang có 6 cuộc chờ' },
  {
    id: 't3',
    name: 'Phạm Đức Anh',
    extension: '1022',
    presence: 'ringing',
    time: '13:41',
    unread: 0,
    preview: 'Để em kiểm tra tuyến 1900 6060'
  },
  { id: 't4', name: 'Kho Bình Tân', extension: '1008', presence: 'offline', time: 'Hôm qua', unread: 0, preview: 'Đơn hàng đã xuất kho' }
];

export const MESSAGES = [
  { id: 'am1', kind: 'day', text: 'Hôm nay' },
  { id: 'am2', kind: 'message', text: 'Anh Quân ơi, khách ở 0903 118 224 vừa gọi nhỡ mình.', time: '14:21', own: true, status: 'sent' },
  { id: 'am3', kind: 'message', text: 'Để anh xem lại bản ghi rồi gọi lại cho khách.', time: '14:24', own: false },
  { id: 'am4', kind: 'call', text: 'Cuộc gọi ra 3:34', time: '14:26', outcome: 'answered' },
  { id: 'am5', kind: 'message', text: 'Xong rồi nhé, khách đồng ý lịch hẹn thứ Năm.', time: '14:32', own: false }
];
