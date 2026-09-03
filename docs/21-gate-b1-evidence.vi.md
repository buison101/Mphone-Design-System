# Bằng chứng Gate B1 — baseline Mantis song ngữ

Chạy ngày 2026-09-03 trên `portal-worktree/app/portal/mpo-design`, keymap 3.562 entry, 2.100 key dự án.

Tài liệu này là **bằng chứng để product owner ký Gate B1**, không phải bản tự nghiệm thu. Mọi con số dưới đây đều đo được và lặp lại được; chỗ nào không đo được thì nói rõ là không đo được.

## 1. Lượt chụp: 78 route × 2 ngôn ngữ × 3 tổ hợp = 468 lượt render

| Tổ hợp | Khung nhìn | Chế độ |
|---|---|---|
| desktop sáng | 1440 × 900 | light |
| desktop tối | 1440 × 900 | dark |
| di động 390px | 390 × 844 | light |

Mỗi lượt đo bốn thứ: có rơi vào error boundary không, có raw message id lọt ra giao diện không, có tràn ngang ở 390px không, và lỗi console không phải lỗi mạng.

## 2. Kết quả

| Hạng mục | Kết quả |
|---|---|
| Lượt render | 468 |
| Rơi error boundary | 18 lượt / **3 route** |
| Tràn ngang ở 390px | 8 lượt / **4 route** |
| **Raw message id lọt ra giao diện** | **0** |
| Sáng và tối khác nhau | Không route nào chạy ở chế độ này mà hỏng ở chế độ kia |

Một lần khớp regex raw-id là `chu.so.huu` — phần đầu của địa chỉ email mẫu `chu.so.huu@example.com`, không phải id bị lộ.

### Ba route rơi error boundary

`/apps/chat`, `/apps/customer/customer-list`, `/apps/invoice/list`.

Cả ba **hỏng giống hệt nhau ở cả hai ngôn ngữ, 3/3 tổ hợp mỗi bên**. Lỗi console là `Cannot read properties of undefined` khi đọc `filter`, `length`, `map` — tức là trang duyệt qua một danh sách chưa bao giờ về. Cả ba đều là route phụ thuộc mock API của vendor, mà **cloud container không có đường ra tới `vercel.app`**.

Đối xứng giữa hai ngôn ngữ là phương pháp quy trách nhiệm của dự án: một lỗi xuất hiện **y hệt ở cả `vi` và `en`** không thể do bản dịch gây ra.

`/apps/e-commerce/products` — route duy nhất rơi error boundary ở lượt chụp L1 — **nay render bình thường ở cả hai ngôn ngữ**.

### Bốn route tràn ngang ở 390px

`/apps/chat`, `/apps/customer/customer-list`, `/apps/invoice/list`, `/apps/customer/customer-card`.

Ba route đầu đang ở trạng thái lỗi, nên số đo tràn ngang trên đó **không có ý nghĩa**. `/apps/customer/customer-card` render bình thường và tràn 20px — con số này **đã có trong ảnh chụp baseline L1** (`docs/20`, +20px), tức là nó có từ trước khi dịch, không phải hồi quy.

## 3. Không còn đảo tiếng Anh nào chưa được ghi nhận

Quét toàn bộ 78 route ở `vi`, thu mọi đoạn chữ **không có dấu tiếng Việt**: 481 đoạn. Sau khi trừ đi các bản dịch đã duyệt vốn không có dấu (`Doanh thu`, `In`, `Xem`, `Nam`…) và nhiễu dữ liệu (dòng bảng từ API, dump JSON, nội dung tệp prompt, URL, số), còn **67 đoạn**. Phân loại từng đoạn:

| Nhóm | Số đoạn | Trạng thái |
|---|---|---|
| Nhãn tháng và thứ trên trục biểu đồ | 19 | Ngoại lệ đã ghi trong `i18n/array-exceptions.json` |
| Tên công nghệ trong danh sách kỹ năng | 11 | Quyết định đã ghi |
| Thanh công cụ và nhãn mặc định của ApexCharts | 9 | Thư viện tự viết, không có trong mã nguồn |
| Tên quốc gia trong tập dữ liệu bản đồ | 6 | `i18n/data-files.json` |
| Điều khiển kiểu bản đồ của maplibre | 3 | Thư viện tự viết |
| Tên thương hiệu, chuỗi giữ tiếng Anh | 4 | `i18n/keep-english.json` |
| Chuỗi định dạng ngày (`YYYY`, `DD-MM-YYYY`) | 2 | Định dạng, không phải chữ |
| Chữ lỗi trên ba route thiếu dữ liệu | 5 | Hệ quả của việc thiếu API |
| Dữ liệu từ API (`2 August`, `7 hours ago`) | 2 | Không nằm trong mã nguồn |
| Tiếng Việt không dấu bị nhận nhầm (`CALO`, `EMAIL`, `1–5 trong 13`) | 3 | Dương tính giả của phép đo |
| `hours` trong widget | 1 | Đối số hàm dựng dữ liệu; xem §5 |
| Còn lại chưa lý giải | **2** | Chú thích của một ảnh và một nhãn nhóm, cùng nhóm quyết định giữ tiếng Anh |

**Không đoạn nào là chuỗi chưa dịch mà chưa có quyết định.**

## 4. Trạng thái công cụ

| Kiểm tra | Kết quả |
|---|---|
| `i18n:check` | 0 lỗi, 0 cảnh báo |
| `i18n:scan --scope src`, ngoài Component Catalog | **0 vị trí thay thế được còn ngoài keymap** |
| `i18n:diff` với cây vendor nguyên bản | 3.489 matched, 0 reworded, 0 moved, 0 vanished |
| `vite build` | thành công, 14,9s |
| ESLint toàn `src` + `scripts/i18n` | sạch |
| Prettier | sạch |
| Diff `src/` so với cây vendor 4.2.0 | 86 file sửa / 1.113, 1 đổi tên, 4 tệp dự án — tất cả trong `docs/vendor-patches.md` |
| Chuyển `vi` ↔ `en` ba vòng trên 8 route | Bản `en` sạch, bản `vi` khớp từng ký tự với lần render đầu |

## 5. Những gì lượt chụp này **không** chứng minh được

Nói thẳng, vì đây là phần product owner cần biết trước khi ký.

- **Ba route phụ thuộc dữ liệu chưa từng được nhìn thấy ở trạng thái có dữ liệu.** Container không ra được `vercel.app`. Chỉ máy của product owner mới chạy được lượt có mạng, và **đó là hạng mục còn lại duy nhất của Gate B1**.
- **Tràn ngang ở 390px của ba route đó chưa đo được thật**, vì trang đang ở trạng thái lỗi.
- Bàn phím, tiêu điểm nhìn thấy được, và các trạng thái tải/rỗng/lỗi/vô hiệu/hủy **chưa được kiểm tự động**; lượt này chỉ đọc chữ đã render.
- `hours` trong widget vẫn là tiếng Anh: nó là **đối số theo vị trí** của một hàm dựng dữ liệu, và luật nới lỏng cho từ đơn viết thường **cố ý không áp cho vị trí đó**, vì ở đó chữ hiển thị trộn lẫn với giá trị kỹ thuật (`error`, `primary`, `success` là màu chip). Sửa một từ này không đáng để mở một lớp nhiễu mới.

## 6. Điều kiện ký

Gate B1 chấp nhận **baseline Mantis song ngữ trên mọi mặt sản phẩm**, chưa gồm Component Catalog (Gate B2, phạm vi đã chốt ở `docs/15` §4.7b).

- [x] Mọi vị trí thay thế được ngoài Catalog đã vào keymap
- [x] Không có raw message id lọt ra giao diện, trên 468 lượt render
- [x] Không có đảo tiếng Anh nào chưa được ghi nhận
- [x] Chuyển ngôn ngữ ổn định, không lẫn hai thứ tiếng
- [x] Prettier, ESLint, `vite build`, `i18n:check`, `i18n:diff` đều đạt
- [x] Diff vendor còn ở mức nâng cấp được, mọi file lệch đều có trong patch manifest
- [ ] **Lượt chụp có mạng trên máy product owner** cho ba route phụ thuộc dữ liệu
- [ ] **Product owner chấp nhận bằng văn bản**
