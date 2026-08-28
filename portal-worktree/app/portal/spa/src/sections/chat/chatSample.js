// ==============================|| CHAT - PLACEHOLDER DATA ||============================== //
//
// Shape-accurate sample data for the chat workspace.
//
// The portal has no messaging endpoint yet — `app/portal/service/` carries no
// chat, message or SMS service — so this file stands in for one. Every field is
// the field the endpoint is expected to return, which makes wiring it up a swap
// of this import for a hook over the real service.
//
// Presence is the exception worth knowing about: the websocket router the portal
// already talks to (see lib/websocket_client.js) can carry extension state, so
// presence is the first field here that will become real.
//
// Do not ship a release with this import still in place.

export const ME = { id: 'me', name: 'Nguyễn Thu Hà', extension: '1001' };

export const CONVERSATIONS = [
  {
    id: 'c1',
    name: 'Trần Minh Quân',
    extension: '1014',
    title: 'Trưởng nhóm chăm sóc khách hàng',
    department: 'Chăm sóc khách hàng',
    email: 'quan.tran@example.vn',
    presence: 'available',
    time: '14:32',
    unread: 2,
    preview: 'Anh vừa gọi lại cho khách rồi nhé'
  },
  {
    id: 'c2',
    name: 'Lê Bảo Ngọc',
    extension: '1007',
    title: 'Điều phối tổng đài',
    department: 'Vận hành',
    email: 'ngoc.le@example.vn',
    presence: 'busy',
    time: '14:05',
    unread: 0,
    preview: 'Hàng đợi đang có 6 cuộc chờ'
  },
  {
    id: 'c3',
    name: 'Phạm Đức Anh',
    extension: '1022',
    title: 'Kỹ thuật',
    department: 'Kỹ thuật',
    email: 'anh.pham@example.vn',
    presence: 'ringing',
    time: '13:41',
    unread: 0,
    preview: 'Để em kiểm tra tuyến 1900 6060'
  },
  {
    id: 'c4',
    name: 'Đỗ Hoàng Yến',
    extension: '1030',
    title: 'Kinh doanh',
    department: 'Kinh doanh',
    email: 'yen.do@example.vn',
    presence: 'away',
    time: 'Hôm qua',
    unread: 0,
    preview: 'Cảm ơn chị nhiều'
  },
  {
    id: 'c5',
    name: 'Kho Bình Tân',
    extension: '1008',
    title: 'Máy nhánh dùng chung',
    department: 'Kho vận',
    email: '',
    presence: 'offline',
    time: 'Hôm qua',
    unread: 0,
    preview: 'Đơn hàng đã xuất kho'
  }
];

export const MESSAGES = {
  c1: [
    { id: 'm1', kind: 'day', text: 'Hôm nay' },
    {
      id: 'm2',
      kind: 'message',
      text: 'Anh Quân ơi, khách ở 0903 118 224 vừa gọi nhỡ mình lúc nãy.',
      time: '14:21',
      own: true,
      status: 'sent'
    },
    { id: 'm3', kind: 'message', text: 'Để anh xem lại bản ghi rồi gọi lại cho khách.', time: '14:24', own: false },
    { id: 'm4', kind: 'call', text: 'Cuộc gọi ra 3:34', time: '14:26', outcome: 'answered' },
    { id: 'm5', kind: 'message', text: 'Anh vừa gọi lại cho khách rồi nhé, khách đồng ý lịch hẹn thứ Năm.', time: '14:32', own: false },
    { id: 'm6', kind: 'message', text: 'Tuyệt quá, em cập nhật vào phiếu luôn.', time: '14:32', own: true, status: 'sending' }
  ],
  c2: [
    { id: 'n1', kind: 'day', text: 'Hôm nay' },
    { id: 'n2', kind: 'message', text: 'Hàng đợi đang có 6 cuộc chờ, chị hỗ trợ nhận bớt giúp em với.', time: '14:05', own: false },
    { id: 'n3', kind: 'message', text: 'Ok em, chị vào hàng đợi ngay.', time: '14:06', own: true, status: 'sent' }
  ],
  c3: [
    { id: 'p1', kind: 'day', text: 'Hôm nay' },
    { id: 'p2', kind: 'message', text: 'Tuyến 1900 6060 sáng nay có vài cuộc không đổ chuông.', time: '13:38', own: true, status: 'sent' },
    { id: 'p3', kind: 'message', text: 'Để em kiểm tra tuyến 1900 6060 rồi báo lại chị.', time: '13:41', own: false },
    { id: 'p4', kind: 'call', text: 'Cuộc gọi nhỡ', time: '13:44', outcome: 'missed' }
  ],
  c4: [
    { id: 'q1', kind: 'day', text: 'Hôm qua' },
    { id: 'q2', kind: 'message', text: 'Chị gửi em danh sách khách cần gọi lại nhé.', time: '16:20', own: true, status: 'sent' },
    { id: 'q3', kind: 'message', text: 'Cảm ơn chị nhiều, em gọi trong chiều nay.', time: '16:44', own: false }
  ],
  c5: [
    { id: 'r1', kind: 'day', text: 'Hôm qua' },
    { id: 'r2', kind: 'message', text: 'Đơn hàng đã xuất kho lúc 15:10.', time: '15:12', own: false }
  ]
};

export const RECENT_CALLS = {
  c1: [
    { id: 'rc1', direction: 'outbound', status: 'answered', time: 'Hôm nay 14:26', duration: '3:34' },
    { id: 'rc2', direction: 'inbound', status: 'answered', time: 'Hôm qua 09:12', duration: '1:05' }
  ],
  c2: [{ id: 'rc3', direction: 'inbound', status: 'answered', time: 'Hôm nay 11:02', duration: '8:06' }],
  c3: [
    { id: 'rc4', direction: 'inbound', status: 'missed', time: 'Hôm nay 13:44', duration: '—' },
    { id: 'rc5', direction: 'outbound', status: 'answered', time: '26/08 15:31', duration: '2:02' }
  ],
  c4: [],
  c5: []
};
