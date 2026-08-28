# Mphone Component Catalog v2.5

Catalog này là hợp đồng trực quan giữa Designer, Developer và AI. Mỗi component mới phải mô tả đủ anatomy, biến thể, trạng thái, nội dung và quy tắc truy cập trước khi được dùng rộng rãi.

## Page header

**Anatomy:** eyebrow tùy chọn → tiêu đề H1 → mô tả ngắn → nhóm hành động.

| Trường hợp | Cách dùng |
|---|---|
| Trang tổng quan | Tiêu đề, mô tả và bộ lọc thời gian ở vùng hành động |
| Trang danh sách | Tiêu đề, tổng số kết quả và hành động xuất dữ liệu |
| Trang cấu hình | Tiêu đề và mô tả phạm vi thay đổi |

Không đặt nhiều hơn hai hành động chính trong header. Trên mobile, hành động xuống dòng bên dưới nội dung.

## Button

| Biến thể | Mục đích | Ví dụ |
|---|---|---|
| Contained/primary | Hành động chính của vùng | Lưu cấu hình |
| Outlined | Hành động phụ | Xuất CSV |
| Text | Hành động nhẹ, lặp lại | Gọi |
| Contained/error | Chỉ trong xác nhận nguy hiểm | Kết thúc cuộc gọi |

Mỗi vùng chỉ có một nút primary. Nhãn bắt đầu bằng động từ và mô tả đúng kết quả.

## Form controls

- Input, Select và Date dùng cùng chiều cao `small` trong thanh lọc dữ liệu.
- Label dùng khi giá trị cần được hiểu sau khi nhập; placeholder chỉ dùng cho gợi ý tìm kiếm.
- Trạng thái disabled phải giữ được khả năng đọc.
- Lỗi nằm gần trường; phản hồi toàn form dùng Alert.

## Content state

| State | Nội dung bắt buộc | Hành động |
|---|---|---|
| Loading | Tiến trình + mô tả ngắn | Không |
| Empty | Điều gì chưa có | Có thể thêm CTA |
| Error | Điều gì thất bại | Thử lại |
| Forbidden | Lý do không thể truy cập | Quay lại/liên hệ quản trị |

Không thể hiện bảng trống bằng một dòng dữ liệu giả.

## Data table

- Căn trái dữ liệu nhận diện; căn phải số liệu và thời lượng.
- Dùng tabular numerals cho thời gian.
- Hành động trên dòng đặt ở cột cuối và luôn có accessible label.
- Bảng được phép cuộn ngang ở mobile; không ép cột thành chữ quá hẹp.
- Phân trang nằm cùng card với bảng.

## Confirmation dialog

Áp dụng khi thao tác gây gián đoạn hoặc khó hoàn tác. Tiêu đề là câu hỏi trực tiếp; mô tả nêu hậu quả; nút hủy đứng trước và nút xác nhận nguy hiểm dùng màu error.

Ví dụ: “Ngắt cuộc gọi này?” → “Cuộc gọi sẽ kết thúc ngay lập tức và không thể hoàn tác.”

## Feedback

- Success: thao tác đã hoàn tất.
- Error: thao tác không hoàn tất và cần hướng xử lý.
- Warning: người dùng vẫn có thể tiếp tục nhưng cần chú ý.
- Info: trạng thái hệ thống hoặc hướng dẫn trung tính.

Không dùng màu làm tín hiệu duy nhất; luôn có nhãn văn bản.

## Golden flow coverage

| Bước | Pattern chuẩn |
|---|---|
| Đăng nhập | Form, validation, error feedback, loading submit |
| Tổng quan | Page header, filter groups, metric hierarchy, charts, recent table |
| Cuộc gọi | Page header, live status, table, destructive confirmation |
| Lịch sử | Page header, tabs, filters, table, pagination, details drawer |
| Chi tiết | Drawer, metadata groups, recording, notes and feedback |
| Danh bạ | Page header, search, source selector, contact cards, call feedback |
| Cấu hình | Page header, grouped form, inline state and save feedback |

## Analytics composition (v2.1.0, experimental)

Bộ component dựng lại cấu trúc trang analytics của Mantis trên nền Mphone. Tất cả đều thuần trình bày: nhận dữ liệu qua props, không tự gọi API, và tự xử lý trạng thái rỗng.

| Component | Anatomy | Dùng khi |
|---|---|---|
| `WelcomeBanner` | Tiêu đề → mô tả → một hành động → hình minh hoạ vẽ bằng SVG | Mở đầu trang tổng hợp; mỗi trang chỉ một banner |
| `SparkStatCard` | Nhãn → giá trị → chip biến động → sparkline `bar`/`line`/`area` | Chỉ số đầu trang cần cả con số và xu hướng |
| `RankedListCard` | Danh sách hạng: tên → dòng phụ → giá trị → tỷ trọng | Bảng xếp hạng cùng một thước đo (máy nhánh, tuyến, hàng đợi) |
| `ActivityListCard` | Avatar trạng thái (màu + icon) → tiêu đề → thời điểm → giá trị | Dòng sự kiện gần đây |
| `ProgressListCard` | Nhãn → thanh tiến trình → phần trăm; footer tuỳ chọn | Các phần của một tổng thể, so sánh trên cùng đường cơ sở |
| `SupportCard` | Tiêu đề → thời gian phản hồi → AvatarGroup chữ cái → hành động | Lối thoát hỗ trợ trên trang dày đặc |
| `SetupProgressCard` | Tiêu đề → mô tả → phần trăm → thanh tiến trình → việc còn lại | Nhắc hoàn tất cấu hình; biến mất khi đạt 100% |
| `CallTrendCard` | Header + ToggleButtonGroup khoảng thời gian + select chỉ số + xuất dữ liệu → tổng, biến động, mốc so sánh → `CallTrendChart` | Biểu đồ chủ đạo của trang |
| `CallTrendChart` | LineChart hai chuỗi có vùng tô gradient | Trả lời/nhỡ trên cùng trục thời gian |
| `RecentCallsTable` | `DataTableContainer` + `Dot` trạng thái + nhãn `callState.*` | Bằng chứng cuộc gọi phía sau biểu đồ; danh sách ngắn, không phân trang |
| `QualityReportCard` | Danh sách 3 tỷ lệ → LineChart cảnh báo | Chất lượng phục vụ và hướng biến động |
| `CostReportCard` | Tổng chi phí → legend bật/tắt chuỗi → BarChart nhóm | So sánh hai dòng chi phí trên cùng kỳ |
| `ChannelMixCard` | BarChart chồng theo nguồn → legend → danh sách nổi bật | Cơ cấu nguồn cuộc gọi trong một tổng |

### Quy tắc

- Màu chuỗi biểu đồ lấy từ `utils/chartSeries.js`. Không đặt màu chuỗi ngay trong component; `success`/`warning`/`error` mang nghĩa kết quả nên không dùng để phân biệt tuyến hay kênh.
- Chồng cột khi câu hỏi là cơ cấu bên trong một tổng (`ChannelMixCard`); nhóm cột khi câu hỏi là dòng nào lớn hơn (`CostReportCard`).
- Trục tiền tệ dùng định dạng rút gọn; số đầy đủ nằm ở tooltip và ở dòng tổng.
- Sparkline là trang trí cho con số: `aria-hidden`, không trục, không tooltip.
- Nhãn trục sinh từ ordinal theo locale người đọc, không lưu sẵn chuỗi "T2" hay "Tuần 1".
- Trạng thái `loading`, `empty`, `error` là props của chính card, không phải việc của trang.

### Trước khi chuyển sang stable

Trang `/dashboard/analytics` đang đọc `sections/analytics/analyticsSample.js`. Phải thay bằng endpoint thật, chạy lại kiểm tra sáng/tối và 390px, rồi cập nhật trạng thái trong registry.

## Account composition (v2.2.0, experimental)

Màn Tài khoản dựng lại theo cấu trúc account của Mantis, cắt bỏ những phần portal không có endpoint. Bốn component dưới đây dùng được ở bất kỳ trang chi tiết nào, không riêng Tài khoản.

| Component | Anatomy | Dùng khi |
|---|---|---|
| `TabbedCard` | MainCard → thanh tab cuộn được (icon + nhãn) → divider → panel đang chọn | Một đối tượng có nhiều mặt, người đọc chỉ cần một mặt tại một thời điểm |
| `DetailList` | Nhãn ở trên, giá trị ở dưới; 2 cột trên desktop, 1 cột ở 390px | Dữ liệu chỉ đọc của một bản ghi |
| `DangerAction` | Tiêu đề → hậu quả → nút outlined màu error, viền card màu error.light | Một thao tác khó hoàn tác, đi kèm `ConfirmActionDialog` |
| `ProfileSummaryCard` | Avatar chữ cái → tên → dòng phụ → chip → dãy số liệu → danh sách meta có icon | Cột nhận diện cạnh vùng nội dung thay đổi |

### Quy tắc

- `TabbedCard` chỉ mount panel đang chọn. Panel truyền vào dạng hàm, không phải element, để bảng hay biểu đồ trong tab ẩn không tự gọi API.
- Tab dùng cho các mặt song song của cùng một bản ghi. Không dùng cho các bước tuần tự, cũng không dùng khi người đọc cần so sánh hai panel cạnh nhau.
- `DetailList` in dấu gạch ngang cho giá trị rỗng, không ẩn dòng. Ẩn dòng làm hai bản ghi khác dữ liệu trông như hai trang khác nhau.
- `DangerAction` không tự xác nhận. Bước xác nhận và câu chữ hậu quả thuộc về `ConfirmActionDialog` do trang giữ, để nhiều tab không mỗi nơi một kiểu.
- Quyền không được cấp vẫn hiển thị bằng chip outlined, không bỏ trống ô. Ô trống đọc ra là thiếu dữ liệu; chip chưa tô đọc ra là một quyết định.
- Chỉ đưa lên màn hình những thao tác server thực sự có. Mantis có tab đổi mật khẩu và cấu hình thông báo; portal chưa có endpoint nào cho hai việc đó nên hai tab đó không tồn tại.

### Trang Tài khoản

`/account` dùng `TabbedCard` với bốn tab: Hồ sơ, Máy nhánh, Thiết bị, Bảo mật. Trang giữ đúng một H1 và để thanh tab gọi tên phần đang xem — Mantis đổi tiêu đề trang theo tab, cách đó đọc thuận nhưng khiến trình đọc màn hình thông báo một tài liệu mới cho cùng một bản ghi.

Dữ liệu và thao tác đến từ `account.php` đã có sẵn: `identity`, `customer`, `membership`, `extensions`, `devices`, cùng hai hành động `revoke_device` và `logout_others`. Không có trường nào được bịa thêm.

## Chat & Webphone composition (v2.3.0, experimental)

Dựng lại màn Chat của Mantis và mở rộng thành nền cho webphone. Tất cả đều thuần trình bày: nhận dữ liệu qua props, phát ý định qua callback, không tự gọi API và không giữ phiên SIP.

| Component | Anatomy | Dùng khi |
|---|---|---|
| `ConversationList` | Tiêu đề + số chưa đọc → ô tìm → hàng: avatar có vòng presence, tên, tin cuối, giờ, badge chưa đọc | Rail chọn hội thoại; tìm kiếm lọc tại chỗ, không mở trang kết quả |
| `MessageThread` | Vạch ngày → bong bóng trái/phải → chip sự kiện cuộc gọi → ghi chú cuối luồng | Luồng hội thoại, tự cuộn xuống khi có tin mới |
| `MessageComposer` | Emoji + đính kèm → ô nhiều dòng (tối đa 4) → nút gửi | Soạn tin; Enter gửi, Shift+Enter xuống dòng |
| `ContactPanel` | Avatar + presence → nút gọi → `DetailList` thông tin → cuộc gọi gần đây | Cột phải của màn hội thoại |
| `PresenceBadge` | Vòng trạng thái bọc quanh avatar bất kỳ | Mọi nơi hiển thị trạng thái máy nhánh |
| `DialPad` | Ô số sửa/dán được → 12 phím có chữ cái → nút gọi tuỳ chọn | Quay số, và làm bàn phím DTMF trong cuộc gọi |
| `CallPanel` | Avatar → tên/số → trạng thái + đồng hồ → tắt tiếng/giữ/bàn phím/chuyển → nút đỏ kết thúc | Một cuộc gọi đang diễn ra |
| `WebphonePanel` | Header có chấm trạng thái đăng ký → `DialPad` khi rảnh, `CallPanel` khi có cuộc gọi | Bề mặt softphone gắn được ở bất kỳ đâu |

### Quy tắc

- **Không component nào giữ phiên SIP.** Trạng thái vào bằng props, ý định ra bằng callback. Nhờ vậy cùng một UI phục vụ được SIP.js trong trình duyệt, click-to-call bắc qua tổng đài, và cuộc gọi người dùng bấm trên máy bàn.
- Presence luôn là vòng màu **cộng** tên trạng thái bằng chữ. Không bao giờ chỉ dùng màu.
- Sự kiện cuộc gọi nằm trong cùng dòng thời gian với tin nhắn. Tách thành hai lịch sử là cách nhanh nhất để một cuộc gọi lại bị bỏ quên.
- Đồng hồ cuộc gọi đếm từ lúc **được trả lời**, không phải lúc bấm gọi. Cuộc đang đổ chuông chưa có thời lượng.
- Nút kết thúc là control duy nhất được tô đầy và là màu error. Mọi control khác đều đảo ngược được nên không cái nào được cạnh tranh với nó.
- Dưới `md`, ba cột gộp thành một: rail và luồng đổi chỗ, cột phải thành drawer và **mặc định đóng**.

### Trang Chat

`/chat` ghép các component trên, cột phải chuyển giữa `ContactPanel` và `WebphonePanel`. Khi có cuộc gọi mà người dùng đang xem thông tin liên hệ, nút Webphone ở page header mang một chấm đỏ — cuộc gọi đang chạy không được phép vô hình.

Mantis đổ file và link chia sẻ vào cột phải. Portal chưa có kho tệp sau chat nên chỗ đó là cuộc gọi gần đây với chính người đang trò chuyện.

### Trước khi chuyển sang stable

- `sections/chat/chatSample.js` là dữ liệu giả. Portal chưa có endpoint tin nhắn nào trong `app/portal/service/`; presence là trường có thể thành thật sớm nhất vì websocket router hiện có đã tải được trạng thái máy nhánh.
- `sections/chat/useWebphoneDemo.js` chạy trạng thái cuộc gọi bằng timer. Khi có SIP.js trên WSS của FusionPBX, đổi tên thành `useWebphone` với cùng shape trả về; `pages/chat/Chat.jsx` chỉ phải sửa một dòng import.
- Đính kèm tệp và emoji hiện là nút chưa nối. Hoặc nối, hoặc bỏ, trước khi phát hành.

## App phone (v2.5.0, experimental)

Dựng lại toàn bộ app Mphone theo phong cách Mantis, ở đúng kích thước máy tham chiếu trong bản kiểm kê của app: **360 × 780**. Route `/app-phone`, một mục trong nhóm Thiết kế.

Đây là bản phục dựng, không phải bản sao thứ hai của Portal. Màn nào Portal cũng có (tin nhắn, cuộc gọi, cài đặt) thì bản app là bản dành cho điện thoại, và nó **dùng lại chính component của Portal** thay vì fork ra bản mobile riêng.

| Component | Vai trò |
|---|---|
| `PhoneFrame` | Khung 360 × 780, nội dung cuộn bên trong, không cuộn cả trang |
| `AppTopBar` | Tiêu đề + tối đa hai hành động + nút quay lại cho màn chi tiết |
| `AppBottomNav` | Năm điểm đến, luôn hiện nhãn |

### Tám màn

| Nhóm | Màn |
|---|---|
| Xác thực | Đăng nhập |
| Điều hướng chính | Cuộc gọi, Tin nhắn, Gọi điện, Máy nhánh, Cài đặt |
| Chi tiết | Chi tiết tin nhắn, Đang gọi |

Rail bên trái là **chỉ mục màn hình**, không phải điều hướng của app. Điều hướng của app là thanh dưới trong khung máy. Hai thứ này không được nhầm lẫn: chọn "Chi tiết tin nhắn" ở rail là nhảy thẳng tới màn mà app chỉ vào được qua một dòng hội thoại.

### Những chỗ cố tình khác app hiện tại

- **Năm mục điều hướng, không phải sáu.** Chính bản audit của app cảnh báo sáu mục là rủi ro ở chiều ngang hẹp với nhãn tiếng Việt và cỡ chữ lớn. 48dp vùng chạm và không cắt chữ thì năm là con số vừa.
- **Bàn phím chiếm trọn màn**, không phải bottom sheet đè lên danh sách. Bottom sheet tốn một chạm trước mỗi cuộc gọi tay, mà gọi tay là trường hợp người dùng đã biết mình muốn gì.
- **Đăng nhập có một đường chính và QR**, thay vì sáu nhánh của assistant. Giữ QR vì đó là đường duy nhất không bắt ai gõ mật khẩu SIP trên bàn phím điện thoại.
- **Cài đặt nhóm theo thứ mà thiết lập thay đổi**, không theo service nào sở hữu nó. Công tắc có hiệu lực ngay nên không có nút Lưu ở đâu cả, và không dòng nào vừa có công tắc vừa có mũi tên.
- **Máy nhánh dùng radio**, không phải công tắc từng dòng: thiết bị chỉ đổ chuông theo đúng một máy nhánh.
- **Màn đang gọi lệch xuống dưới tâm.** Điện thoại cầm một tay, mọi thứ trên màn này đều là đích chạm, nên điều khiển thuộc về nửa dưới.

### Giới hạn

`sections/app-phone/appPhoneSample.js` là dữ liệu giả. Nút đính kèm bị tắt ở màn chi tiết tin nhắn vì app có camera và trình chọn tệp phía sau nó, còn bản dựng này thì không — một cái ghim giấy không bấm được trên màn điện thoại là lời hứa build không giữ nổi.

## Prompt contract for AI-generated pages

Khi yêu cầu AI tạo trang mới, cung cấp: mục tiêu người dùng, vai trò/quyền, dữ liệu và trạng thái, hành động chính, thao tác nguy hiểm, breakpoint, ngôn ngữ và danh sách component được phép dùng. AI phải tái sử dụng semantic tokens và các pattern trong catalog này; không tự tạo màu, khoảng cách hoặc component mới nếu chưa nêu lý do.
