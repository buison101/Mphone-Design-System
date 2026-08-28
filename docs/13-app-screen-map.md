# Bản đồ màn hình: app Mphone → Portal Web

Nguồn: `linphone-android-master/docs/UI_AUDIT_SCREEN_MAP.md` (baseline 2026-08-06) — 7 Activity, 61 Fragment, 6 mục điều hướng chính.

Tài liệu này chỉ đối chiếu và xếp thứ tự. Nó không thay thế bản kiểm kê của app.

## 1. Sáu mục điều hướng của app đối chiếu với Portal

| App Mphone | Portal Web hiện có | Khoảng cách |
|---|---|---|
| Danh bạ | `/contacts` | Thiếu chi tiết liên hệ, tạo/sửa, media & tài liệu |
| Cuộc gọi | `/calls/history`, `/calls/active`, `/recordings`, `/missed-calls` | Portal tách thành 4 route; app gom vào 3 tab. Thiếu chi tiết lịch sử dạng drawer đầy đủ |
| Trò chuyện | `/chat` (v2.3.0) | Thiếu tạo hội thoại, thông tin hội thoại, chuyển tiếp, tin tự hủy, media |
| **Bàn phím** | **chưa có** | Đây là màn Webphone — xem mục 3 |
| **Cuộc họp** | **chưa có** | Toàn bộ khu vực: danh sách, lên lịch, phòng chờ, chi tiết, sửa, thêm người |
| Tài khoản | `/account` (v2.2.0) | Thiếu thông báo, chuyển tiếp cuộc gọi, chế độ bảo mật, LDAP/CardDAV, nâng cao |

Ngoài ra app có luồng khởi động (Giới thiệu 3 trang → Đăng nhập → chọn máy nhánh) mà Portal thay bằng phiên FusionPBX sẵn có, nên không dựng lại.

## 2. Chín màn hình baseline của app, trạng thái trên Portal

| # | Màn hình app | Trạng thái Portal |
|---|---|---|
| 1 | Đăng nhập | Portal đi theo phiên PHP; bản app dựng lại trong `/app-phone` (v2.5.0) |
| 2 | Danh bạ | Có, cần bổ sung màn con; màn Máy nhánh của app đã có trong `/app-phone` |
| 3 | Cuộc gọi | Có, cần gom tab và bổ sung chi tiết |
| 4 | Trò chuyện | Có (v2.3.0) |
| 5 | **Bàn phím** | **`/webphone` (v2.4.0) và màn app trong `/app-phone` (v2.5.0)** |
| 6 | Cuộc họp | Chưa có |
| 7 | Tài khoản | `/account` (v2.2.0); màn Cài đặt của app trong `/app-phone` (v2.5.0) |
| 8 | **Cuộc gọi đến** | **v2.4.0 — hộp thoại toàn cục trong `/webphone`** |
| 9 | **Cuộc gọi đang diễn ra** | **v2.4.0 trong `/webphone`, bản app trong `/app-phone` (v2.5.0)** |

## 3. Webphone: cái gì đã có và cái gì còn thiếu ở phía server

Ba màn 5, 8, 9 của app là cùng một bề mặt trên web. Phần giao diện đã xong; phần còn thiếu **không nằm ở trình duyệt**.

### Đã có trong Portal

- `DialPad`, `CallPanel`, `WebphonePanel` (v2.3.0) — không giữ phiên SIP, nhận trạng thái qua props.
- `sections/webphone/useWebphone.js` (v2.4.0) — driver SIP.js, đọc cấu hình từ endpoint, tự lùi về driver mô phỏng khi không có cấu hình.
- Websocket router của FusionPBX đã dùng được cho sự kiện cuộc gọi (`active.calls`).

### Server còn thiếu — đây là điểm chặn

`session.php` phát token cho **websocket sự kiện** (`wss://<host>/websockets/`), không phải transport SIP. `settings.php` trả thông tin máy nhánh nhưng **không có mật khẩu SIP**. Muốn webphone gọi được thật, cần một endpoint mới:

```
GET /app/portal/service/webphone.php
{
  "available": true,
  "server":    "wss://pbx.example.vn:7443",
  "realm":     "thaison.mphone.vn",
  "extension": "1001",
  "username":  "1001@thaison.mphone.vn",
  "password":  "<thông tin xác thực SIP>",
  "expires_in": 3600,
  "stun":      ["stun:stun.l.google.com:19302"],
  "turn":      [{ "urls": "turn:...", "username": "...", "credential": "..." }]
}
```

Ba quyết định phải chốt trước khi viết endpoint này:

1. **Không trả mật khẩu SIP thường trực.** Cách an toàn là cấp thông tin xác thực ngắn hạn riêng cho WebRTC, hoặc một máy nhánh WebRTC tách khỏi máy nhánh máy bàn.
2. **FreeSWITCH phải bật WSS** (thường cổng 7443) và chứng chỉ phải hợp lệ với trình duyệt.
3. **TURN là bắt buộc trong thực tế.** Không có TURN thì máy sau NAT đối xứng sẽ đổ chuông nhưng không có tiếng.

Khi endpoint tồn tại, phía web không phải sửa gì: `useWebphone` đã đọc đúng shape trên.

## 4. Thứ tự đề xuất cho các màn còn lại

1. **Cuộc họp** — khu vực duy nhất Portal chưa có gì; cần endpoint riêng.
2. **Chi tiết liên hệ / tạo / sửa** — Portal đã có danh sách, thiếu phần chi tiết.
3. **Màn con của Trò chuyện** — tạo hội thoại, thông tin hội thoại, chuyển tiếp.
4. **Màn con của Tài khoản** — chuyển tiếp cuộc gọi và thông báo là hai cái có endpoint sẵn (`forwarding.php`, `settings.php`).

Mục 4 rẻ nhất vì server đã sẵn sàng; mục 1 đắt nhất vì chưa có gì.
