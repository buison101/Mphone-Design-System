# Portal preview — không gian làm việc thiết kế

Mở toàn bộ portal trên máy này: không cần FusionPBX, không cần PHP, không cần deploy lên server.

```
cd D:\Projects\FusionPBX\design-system\portal-worktree\app\portal\spa
npm run preview:open
```

Trình duyệt tự mở ở **http://localhost:4321/p/dashboard/analytics**. Dừng bằng `Ctrl+C`.
Cổng bận thì: `set PORT=4322 && npm run preview:open`.
Muốn mở thẳng trang khác: `set ROUTE=/p/design-system && npm run preview:open`.

Sau khi sửa code, dựng lại ảnh chụp:

```
npm run preview:build
```

## Sidebar đi được tới đâu

Mọi route trong `MainRoutes.jsx` đều có mục trong sidebar khi chạy preview, kể cả `/design-system`.

Mục "Thiết kế → Design System" chỉ xuất hiện khi `import.meta.env.VITE_PORTAL_PREVIEW === '1'`, và cờ đó chỉ được đặt trong `preview/vite.config.mjs`. Bản `npm run build` cho sản phẩm không định nghĩa cờ này, nên khách hàng không bao giờ thấy mục đó.

## Trong này có gì

| File | Vai trò |
|---|---|
| `vite.config.mjs` | Config build riêng cho preview: gộp một chunk, một stylesheet, font nhúng sẵn |
| `refresh.mjs` | Chạy build rồi nhúng CSS + JS vào một file duy nhất |
| `serve.mjs` | Server tĩnh, giả lập phiên đăng nhập, tự mở trình duyệt |
| `portal.html` | Ảnh chụp đã dựng (sinh ra, không sửa tay) |

`portal.html` và `.out/` là sản phẩm sinh ra — nên cho vào `.gitignore`.

## Giới hạn cần nhớ

- **Phiên đăng nhập là giả** và mọi endpoint `/app/portal/service/*` trả về `{}`. Các trang đọc dữ liệu thật (Cuộc gọi, Ghi âm, Danh bạ, Báo cáo…) sẽ hiện trạng thái rỗng — đúng hành vi, không phải lỗi. Trang Analytics có dữ liệu mẫu riêng nên hiển thị đầy đủ.
- Không có websocket, nên header luôn báo "Chưa kết nối".
- `portal.html` là ảnh chụp tại thời điểm build, không tự theo code. Sửa xong nhớ `npm run preview:build`.
- Đây không thay thế kiểm thử trên server thật: quyền, phân tách domain và dữ liệu thật vẫn phải kiểm bằng bản deploy.
