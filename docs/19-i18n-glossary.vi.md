# Bảng thuật ngữ và bộ danh tính mẫu

Lập ở đợt L1 ngày 2026-09-02. Kèm theo `docs/15-mpo-design-implementation-plan.vi.md` §4.4 và §4.8.

Đây là bản khởi tạo, chưa đầy đủ. Mỗi đợt L2–L8 bổ sung thuật ngữ của phạm vi mình và không được tự đặt lại cách dịch đã chốt ở đây.

## Quy tắc dùng bảng

- Một thuật ngữ có **một** cách dịch trong toàn ứng dụng, trừ khi ngữ cảnh ngữ pháp thực sự đòi hỏi khác — và khi đó phải tạo hai message key riêng, ghi `context` cho từng key, chứ không dùng chung một key.
- **Ngân sách độ dài:** tiếng Việt thường dài hơn tiếng Anh 20–30%. Với header bảng, nút, chip, tab, badge và nhãn biểu đồ, chọn dạng ngắn ngay từ đầu và ghi `maxLength` vào keymap. Nếu bản ngắn làm mất nghĩa thì giữ nghĩa và ghi vấn đề layout vào inventory.
- Không đưa thuật ngữ viễn thông hay nghiệp vụ Mphone vào bản dịch baseline Mantis. Một trang còn đang thể hiện use case Mantis thì vẫn nói ngôn ngữ Mantis.
- Đối chiếu với `spa/src/locales/{en,vi}.json` (1.275 key, chỉ đọc) trước khi đặt một cách dịch mới cho thuật ngữ đã dùng ở Portal cũ.

## Thuật ngữ đã chốt

| English | Tiếng Việt | Ngữ cảnh | Ghi chú |
|---|---|---|---|
| Back To Home | Về trang chủ | Nút trên các trang lỗi và bảo trì | Dạng ngắn. Không dùng "Quay lại trang chủ" — dài hơn mà không rõ hơn |
| Page Not Found | Không tìm thấy trang | Tiêu đề 404 | |
| Internal Server Error | Lỗi máy chủ nội bộ | Tiêu đề 500 | |
| Coming Soon | Sắp ra mắt | Tiêu đề trang chờ | |
| Under Construction | Đang xây dựng | Tiêu đề trang bảo trì | |
| Email Address | Địa chỉ email | Nhãn và placeholder ô email | Viết thường chữ "email", không viết hoa giữa câu |
| Enter your email | Nhập email của bạn | Placeholder | |
| Notify Me | Thông báo cho tôi | Nút đăng ký nhận tin | |
| Get Notified | Nhận thông báo | Nút đăng ký nhận tin | Hai chuỗi nguồn khác nhau, hai key riêng, cùng nghĩa |
| Join Our Waiting List | Tham gia danh sách chờ | Tiêu đề | |

| Total Sales / Revenue / Orders | Tổng doanh số / Doanh thu / Đơn hàng | Chỉ số dashboard | Bổ sung ở L3 |
| Page Views | Lượt xem trang | Chỉ số và nhãn biểu đồ | Không dùng "lượt xem" trần, dễ nhầm với lượt xem video |
| Sessions / Users / Bounce | Phiên truy cập / Người dùng / Thoát trang | Nhãn chuỗi dữ liệu biểu đồ | |
| Direct / Referral / Social | Trực tiếp / Giới thiệu / Mạng xã hội | Kênh truy cập | |
| Status / Price / Date / Name | Trạng thái / Giá / Ngày / Tên | Tiêu đề cột bảng | Đã nâng lên `common.*` để mọi bảng dùng chung |
| Due Date | Hạn chót | Tiêu đề cột | Không dịch "Ngày đến hạn" — dài hơn mà không rõ hơn |
| Today / This Week / This Month | Hôm nay / Tuần này / Tháng này | Mốc thời gian | Đã nâng lên `common.period.*` |
| N min/hrs/day ago | N phút/giờ/ngày trước | Mốc thời gian tương đối | Đã nâng lên `common.time.*` |
| Task | Công việc | Danh sách việc cần làm | Không dùng "nhiệm vụ" — nặng nề hơn mức cần thiết |

## Nguyên tắc dịch đã áp dụng

- **Không dịch từng từ khi câu trở nên khó hiểu.** "Server error 500. we fixing the problem. please try again at a later stage." dịch thành "Lỗi máy chủ 500. Chúng tôi đang khắc phục, vui lòng thử lại sau." — gọn hơn nguyên bản, và nguyên bản vốn có lỗi ngữ pháp.
- **Bỏ dấu chấm than thừa.** Tiếng Anh marketing dùng nhiều `!`; tiếng Việt giao diện nghiêm túc hơn, giữ dấu chấm.
- **Chủ ngữ.** Dùng "Chúng tôi" cho hệ thống, "bạn" cho người dùng. Không dùng "quý khách" ở baseline Mantis.

## Ngày, tháng, thứ, buổi

Chốt 2026-09-02. Đây là **từ vựng thời gian**, không phải chuỗi trong keymap: nó do thư viện sinh ra từ một mã ngôn ngữ, nên nơi quyết định là một tệp locale của dự án chứ không phải bảng key. Tệp đó là `src/locales-mphone/date-locale-vi.js` — đường dẫn dự án sở hữu, vendor không đụng tới.

date-fns có sẵn locale `vi`, nhưng bốn dạng của nó không phải thứ giao diện tiếng Việt cần đọc, và một dạng thì **không phải tiếng Việt**: `format(date, 'h:mm a')` trong source vendor trả về `am`/`pm` giữa một câu tiếng Việt, và không format string nào chữa được. Đó là lý do có tệp locale riêng thay vì vài lần sửa chuỗi định dạng.

| Loại | Đầy đủ | Rút gọn |
|---|---|---|
| Thứ | Chủ nhật, Thứ hai, Thứ ba, Thứ tư, Thứ năm, Thứ sáu, Thứ bảy | CN, T2, T3, T4, T5, T6, T7 |
| Tháng | Tháng 1 … Tháng 12 | Thg 1 … Thg 12 |
| Buổi | Sáng, Chiều | SA, CH |

Các buổi khác, dùng khi format string gọi tới: `nửa đêm`, `giữa trưa`, `sáng`, `chiều`, `tối`, `đêm`.

Ba quyết định đi kèm, ghi ra để sau này không ai đổi ngược mà không biết lý do:

- **Thứ viết theo kiểu câu**, `Thứ hai` chứ không phải `Thứ Hai`. Cùng một quyết định với ngoại lệ §2.5: viết hoa từng từ là lỗi chính tả trong tiếng Việt, không phải kiểu chữ.
- **Tháng bỏ số 0 đứng đầu.** date-fns `vi` trả `tháng 09`; `Tháng 9` là cách người Việt viết.
- **Chỉ thay `localize`, không thay `match`.** `match` là phần `parse` dùng để đọc chuỗi ngược lại thành ngày. Thu hẹp thứ mà ứng dụng đọc được là một hồi quy thật, và mọi date picker trong cây này đều ghi định dạng số (`dd/MM/yyyy`), không bao giờ ghi tên tháng hay tên thứ.

Ba nơi tiêu thụ từ vựng này, ba đường dẫn khác nhau:

| Nơi dùng | Cách nối |
|---|---|
| Mọi lời gọi `format()` trực tiếp (11 tệp) | `setDefaultOptions({ locale })` trong `src/components/Locales.jsx` |
| Mọi date picker của MUI (15 chỗ dùng `LocalizationProvider`) | `MuiLocalizationProvider.defaultProps.adapterLocale` trong theme, cộng `localeText` tiếng Việt của MUI cho phần chữ của picker |
| Lịch FullCalendar | prop `locale` và `dayHeaderFormat={{ weekday: 'narrow' }}` trong `src/pages/apps/calendar.jsx` — FullCalendar tự viết tên thứ qua `Intl`, không qua date-fns |

Kiểm chứng bằng render: lịch hiện `Tháng 9 2026` với hàng tiêu đề `T2 T3 T4 T5 T6 T7 CN`; ô nhập ngày chuyển từ `MM/DD/YYYY` sang `DD/MM/YYYY`; `format(d, 'h:mm a')` cho `9:05 SA` và `3:05 CH`.

## Bộ danh tính mẫu

Theo §4.8. Mỗi mục có **một giá trị dùng cho mọi locale** — tên người không phải chuỗi cần dịch. Trong keymap chúng mang `kind: "sampleIdentity"` và được `i18n:check` miễn hai luật parity.

Bộ này **chưa được dùng** ở L1. Nó được áp khi mỗi đợt L2–L8 gặp danh tính vendor trong phạm vi của mình.

| Vai trò | Giá trị | Thay cho |
|---|---|---|
| Người dùng chính | Nguyễn Minh Anh | Natacha, Jone Doe |
| Người dùng phụ | Trần Quốc Huy | Remy Sharp |
| Người dùng thứ ba | Lê Thu Hà | — |
| Công ty | Công ty TNHH Hải Đăng | các tên công ty demo của vendor |
| Email | minh.anh@example.com | mọi email demo |
| Điện thoại | 0900 000 001 | mọi số demo |
| Địa chỉ | 12 Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh | mọi địa chỉ demo |

Ràng buộc: tên hư cấu, trung tính, không nhạy cảm. **Không dùng tên nhân viên hay khách hàng thật của Mphone.** Email dùng `example.com`, số điện thoại dùng dải `0900 000 xxx` không có thật.

## Chưa xử lý

- Chuỗi `Be the first to be notified when Mantis launches.` còn chứa thương hiệu vendor **Mantis**. Nó nằm giữa câu nên không tách thành `sampleIdentity` được; xử lý ở một đợt thương hiệu riêng, không sửa lẫn vào đợt dịch.
