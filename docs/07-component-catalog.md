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

## Hoá đơn (v2.7.0, experimental)

Dựng lại màn Invoice của Mantis Pro cho phía **nhận** hoá đơn. Route `/billing`, một mục trong nhóm Không gian làm việc, ngay sau Tài khoản.

Mantis dựng màn này cho bên *phát hành* hoá đơn. Một tenant tổng đài thì ở đầu kia: họ nhận hoá đơn, không tạo ra nó. Cả trang được đọc lại theo hướng đó, và đó là lý do những thứ dưới đây khác bản gốc.

| Component | Vai trò |
|---|---|
| `BilledTrendCard` | 12 kỳ đã chốt, mỗi kỳ một cột |
| `InvoiceFilterGrid` | Lưới ô lọc theo trạng thái, mỗi ô mang số lượng |
| `InvoiceListCard` | Danh sách hoá đơn kèm chip trạng thái |
| `CostBreakdownCard` | Vòng chi phí theo hạng mục + chú giải có số tiền và tỉ lệ |

Thẻ số dùng lại `SparkStatCard` (không truyền `data` thì không có sparkline) và hoạt động dùng lại `ActivityListCard`. Hai chỗ này không cần component mới.

### Ba lỗi của bản gốc được sửa

- **Mantis để £ ở thẻ số và $ ở danh sách hoá đơn trên cùng một màn.** Ở đây tiền tệ là **một lựa chọn cấp trang**; mọi con số bên dưới đi theo nó, nên không bao giờ có hai đơn vị trên một màn và không có tổng nào là phép cộng của hai loại tiền. Đổi tiền tệ là đổi tài khoản, nên bộ lọc trạng thái được reset về "Tất cả" — mang bộ lọc cũ sang có thể đẩy người đọc vào danh sách rỗng mà không rõ vì sao.
- **Bốn thẻ số của Mantis đều ghi £5678.09 và biểu đồ không liên quan tới thẻ nào.** Ở đây 12 cột cộng đúng bằng thẻ Tổng giá trị, `Đã thanh toán + Chờ thanh toán + Quá hạn` cũng bằng đúng thẻ Tổng, và 4 dòng chi phí cộng đúng bằng hoá đơn kỳ hiện tại. Ai cộng thử sẽ thấy khớp.
- **Mantis gắn một tỉ lệ phần trăm lên cả bốn thẻ.** "-4,7%" trên năm hoá đơn quá hạn là con số tính ra chỉ để lấp chỗ. Chỉ thẻ Tổng mang delta, vì đó là chỗ duy nhất mà so kỳ này với kỳ trước có nghĩa; ba thẻ còn lại mang số lượng hoá đơn.

### Những chỗ cố tình khác bản gốc

- **Không có trạng thái "Nháp".** Hoá đơn nháp là trạng thái riêng của bên phát hành, tenant không bao giờ thấy. Lưới lọc cũng bỏ ô "Reports" của Mantis: nó là một điểm đến ở sidebar, và một ô điều hướng nằm lẫn trong nhóm ô lọc dạy người đọc sai về việc bấm vào đó sẽ xảy ra chuyện gì.
- **Mỗi ô lọc mang số lượng.** Ô "Quá hạn" của Mantis bắt người đọc bấm vào mới biết có gì quá hạn hay không. Ô ở đây trả lời trước khi bấm, và biến trạng thái rỗng thành thứ người đọc chọn chứ không phải thứ họ va phải.
- **Không có nút "Xem tất cả", không có Thanh toán, không có Tải PDF.** Chưa có route chi tiết hoá đơn và chưa có endpoint nào đứng sau các nút đó. Chân thẻ ghi "Đang hiển thị 6 trên 13 hoá đơn" thay cho nút. Vì cùng lý do, dòng hoá đơn là `ListItem` chứ không phải `ListItemButton`.
- **Cột, không phải đường.** 12 hoá đơn tháng là 12 sự kiện rời; một đường nối chúng lại thành đại lượng liên tục và mời người đọc lấy giá trị ở đoạn dốc giữa hai tháng vốn không tồn tại.
- **Biểu đồ cột một màu.** Bản nháp tô riêng các kỳ chưa trả bằng màu thứ hai. Sai hai lần: nó là thẻ thứ tư trên trang nói cùng một điều (thẻ số, số đếm ở lưới lọc và chip ở danh sách đã nói rồi, và nói bằng chữ), còn màu nó tiêu là đúng màu cam mà vòng chi phí bên cạnh cần cho cước gọi ra. Hai biểu đồ trên một màn dùng chung một màu cho hai nghĩa chính là thứ `utils/chartSeries.js` sinh ra để chặn.
- **Số tiền hoá đơn đã huỷ bị gạch ngang** và không vào bất kỳ tổng nào. `isBilled()` trong `utils/invoiceStatus.js` là chỗ duy nhất quyết định điều đó, vì ba thẻ cùng hỏi câu này.
- **Trục tiền dùng ký hiệu rút gọn** ("8 Tr", "8M"). Một trục tiền không có đơn vị thì không đọc được, còn chuỗi tiền tệ đầy đủ trên mỗi vạch sẽ bị cắt thành "7.730.00…".
- **Nhãn trục tháng đi qua một message riêng** (`chart.monthShort`): `Intl` tiếng Việt trả về "Tháng 9", và 12 nhãn như thế không vừa trục ở bất kỳ chiều rộng nào. Tiếng Việt lấy "T9", tiếng Anh lấy "Sep".

### Khi nào được dùng vòng tròn

Portal đã thay một pie bằng bar ở `/dashboard`, nên một vòng tròn ở đây cần lý do. Quy tắc chung cho cả hai quyết định:

> Chỉ dùng pie/donut khi **(a)** tối đa 5 phần, **(b)** các phần cộng lại đúng bằng một tổng và tổng đó được nêu ra thành chữ, **(c)** câu hỏi là *tỉ lệ trên tổng thể*, không phải *xếp hạng*.

Kết quả cuộc gọi không đạt cả ba: bảy lát, không có tổng có nghĩa, và câu hỏi là so sánh độ dài. Chi phí hoá đơn đạt cả ba. Dù vậy vòng tròn không phải là bản ghi: mọi số tiền và tỉ lệ đều được viết ra ở chú giải bên dưới theo thứ tự, nên phép so sánh không bao giờ phụ thuộc vào việc ước lượng một góc, và thẻ vẫn đọc được khi đọc thành tiếng. `paddingAngle` để 1 chứ không phải 2: khoảng đệm bị trừ đều ở mọi lát, ở 2 độ thì lát 4,1% mất một phần tám góc của nó còn lát 62,7% mất chưa tới một phần trăm.

### Trước khi chuyển sang stable

- `sections/billing/billingSample.js` là dữ liệu giả **toàn bộ**. `app/portal/service/` không có endpoint hoá đơn nào: không có gì phát hành hoá đơn, ghi nhận thanh toán hay tính giá một cuộc gọi. Trang tự nói điều đó bằng một Alert ở đầu trang, và **cái Alert đó gỡ xuống cùng lúc với file này, không sớm hơn**. Cho người dùng xem một con số trông giống tiền mà không phải tiền là lỗi tệ nhất trang này có thể mắc.
- Cần `billing.php` trả về: `period`, `months`, `series[{amount,status}]`, `summary{total,paid,pending,overdue,cancelled}`, `breakdown[{id,amount}]`, `invoices[{id,period,amount,status,due,settled,replacedBy}]`, `activity[]` — mỗi tiền tệ một khối. Mọi tên trường ở file mẫu đã đặt đúng theo tên endpoint dự kiến trả, nên việc nối là đổi một dòng import.
- Cột `breakdown` cần bảng giá; `series` và `summary` có thể dựng từ CDR cộng với bảng thuê bao. `usage` là phần gần sự thật nhất vì `reports.php` đã có dữ liệu cuộc gọi.

## Xác thực (v2.8.0 – v2.9.0, experimental)

### Đăng nhập (v2.8.0)

Dựng lại màn `auth/login` của Mantis Pro. Khác mọi màn đã dựng trước đó ở một điểm quan trọng: **màn này đã có endpoint thật**. `SessionGate` vẫn đang render một form trần chưa qua thiết kế, và `app/portal/service/identity.php` thì đã chạy được. Đây không phải bản dựng để ngắm, đây là màn đăng nhập thật của portal.

| Component | Vai trò |
|---|---|
| `AuthLayout` | Khung trang cho mọi màn chưa đăng nhập: mark góc trên trái, một card ở giữa, footer dưới cùng |
| `LoginForm` | Email, mật khẩu có nút hiện/ẩn, nút gửi |

`pages/auth/Login.jsx` ghép hai cái trên và **không giữ state, không gọi endpoint nào**. `SessionGate` là container: nó sở hữu lần thử đăng nhập. Nhờ vậy đúng màn đó review được trong bản preview mà không cần một đường đăng nhập giả.

### Chỉ ship thứ server đỡ được

`identity.php` trả lời đúng **hai** action: `login` và `logout`. Ba control của Mantis vì thế không có mặt:

- **"Don't have an account?"** — máy nhánh do người vận hành tổng đài cấp. Không ai tự đăng ký một hệ thống điện thoại, nên link này sai ngay cả khi có endpoint.
- **"Forgot Password?"** — không có endpoint đặt lại mật khẩu. Dòng chữ dưới các trường nói ai đặt lại được, thay vì link tới một trang không làm được việc đó. Một link chết trên màn đăng nhập tệ hơn là không có link: đây đúng là màn mà người đọc đang mắc kẹt.
- **"Keep me sign in"** — tuổi thọ phiên do PHP session quyết định. Một checkbox âm thầm không làm gì là một lời hứa về bảo mật của người khác.

Nút hiện/ẩn mật khẩu thì **được giữ**, vì nó không cần server và là control giúp được nhiều nhất: mật khẩu này bị gõ trên bàn phím điện thoại đủ thường xuyên để "sai mật khẩu" phần lớn là một lỗi gõ mà người dùng không nhìn thấy.

### Hai lỗi của bản cũ được sửa

`sections/auth/loginErrors.js` là chỗ duy nhất dịch mã lỗi của `identity.php` thành câu cho người đọc. Bản cũ rơi về "email hoặc mật khẩu không đúng" cho mọi mã nó không nhận ra, và hai trong số đó **không phải** vậy:

- **`invalid_csrf`** — token phát cùng trang đã quá hạn, thường vì tab mở lâu. Mật khẩu không sai. Bị báo là sai, người dùng sẽ gõ lại một mật khẩu đúng cho tới lúc bỏ cuộc, vì gõ lại không hề tạo ra token mới. Gate giờ **tự nạp lại phiên khi gặp mã này**, nên "thử lại" là lời khuyên có tác dụng thật.
- **`invalid_identity_mapping`** — thông tin đăng nhập đúng, nhưng tài khoản chưa gắn với user PBX nào. Không có gì người đọc gõ được để sửa việc này, nên đẩy họ về ô mật khẩu vừa tốn thời gian của họ vừa giấu một lỗi cấp phát khỏi người có thể sửa.

Mã thật sự lạ vẫn rơi về câu thông tin đăng nhập: đó là nguyên nhân nhiều khả năng nhất, và nó không tiết lộ gì về tài khoản.

### Nền trang vẽ bằng CSS, không dùng ảnh

Mantis phủ nền bằng một artwork chevron lớn. Ở đây là hai vùng gradient tô từ token palette. Lý do rất cụ thể: **đây là màn đầu tiên portal vẽ ra**, nó được vẽ trước khi có session, và một request ảnh chưa trả lời sẽ để đúng cái màn mà người dùng đang bị chặn ở ngoài trông dở dang. Gradient nằm trong stylesheet, không thể tới muộn.

Hai chế độ sáng/tối có bộ alpha riêng: cùng một alpha, cặp gradient hợp với nền tối sẽ nhạt mất hút trên `#fafafb`, còn cặp hợp với nền sáng sẽ phát sáng trên `#121212`. Cả hai đều nằm xa dưới ngưỡng tương phản mà card và chữ cần — đó là chủ đích, nền chỉ được phép là không khí.

### Route và cách review

Màn thật không có route: `SessionGate` render nó thay cho cả ứng dụng khi `session.php` trả 401. Nhưng `preview/serve.mjs` luôn stub một phiên đã đăng nhập, nên gate không bao giờ chạy và bản preview không có đường nào tới màn này.

Vì vậy có `/auth/login`, **chỉ đăng ký khi `VITE_PORTAL_PREVIEW` được đặt**. Nó là route anh em của ứng dụng chứ không phải con: màn này phải vẽ mà không có drawer, header và footer bao quanh. Bản build production không có route nào tới một form đăng nhập không đăng nhập được ai.

Bấm Đăng nhập ở bản preview hiện trạng thái lỗi chứ không phải không làm gì — nhánh lỗi mới là nửa đáng review của màn này, nhánh thành công thì điều hướng đi mất. Banner mang theo một đường quay lại, vì route này đưa người đọc ra khỏi vỏ portal và lịch sử trình duyệt là lối ra duy nhất còn lại.

### Còn lại

- `login.subtitle` nói "cùng email và mật khẩu khách hàng như trên ứng dụng Mphone". Câu đó phải đúng — nếu identity của app và của portal tách ra thì sửa câu này trước khi người dùng phát hiện.
- Chưa có màn nào khác dùng `AuthLayout`. Nếu sau này có đặt lại mật khẩu hoặc xác thực hai lớp, chúng dùng chung khung này chứ không dựng khung mới.

### Năm màn còn lại (v2.9.0)

Mantis có sáu màn trong nhóm Authentication. Sáu màn này đều được dựng, nhưng **một màn bị đổi nghĩa và một màn được tách làm hai**, và không màn nào trong số đó có endpoint hôm nay.

| Mantis | Mphone | Route (chỉ preview) |
|---|---|---|
| Login | Đăng nhập | `/auth/login` |
| Register | **Kích hoạt tài khoản** | `/auth/activate` |
| Forgot Password | Quên mật khẩu | `/auth/forgot-password` |
| Check Mail | Kiểm tra email | `/auth/check-mail` |
| Reset Password | Đặt lại mật khẩu | `/auth/reset-password` |
| Code Verification | Nhập mã xác minh | `/auth/code` |
| — | **Xác minh email (theo link)** | `/auth/verify-email` |

| Component | Vai trò |
|---|---|
| `PasswordField` | Ô mật khẩu có nút hiện/ẩn, dùng chung cho bốn màn |
| `PasswordStrengthMeter` | Năm vạch và một chữ, đọc từ `utils/password-strength.js` |
| `PasswordRules` | Danh sách điều kiện còn thiếu, đọc từ `utils/password-validation.js` |
| `CodeInput` | Sáu ô một chữ số, dán vào bất kỳ ô nào cũng điền cả hàng |
| `AuthResultCard` | Hình dạng chung của mọi màn kết thúc không có gì để điền |
| `SetPasswordForm` | Dùng chung cho Kích hoạt và Đặt lại — khác nhau ở tiêu đề, không khác ở việc |
| `ForgotPasswordForm` | Một ô, một nút, cố tình không có đường thất bại |
| `CodeVerificationForm` | Sáu ô, nút gửi lại có đếm ngược |

Hai util `password-strength.js` và `password-validation.js` đã nằm trong repo từ template Mantis và **chưa từng được gọi ở đâu**. v2.9.0 dùng lại chúng thay vì viết mới; `sections/auth/passwordStrength.js` chỉ bọc thêm một lớp vì bản gốc trả thẳng nhãn tiếng Anh ("Poor", "Weak") từ hàm chấm điểm — người đọc tiếng Việt sẽ bị báo mật khẩu "Weak". Bản gốc còn có một nhánh không bao giờ chạy tới (`count < 6` bắt hết mọi điểm mà hàm có thể sinh ra).

### Register trở thành Kích hoạt tài khoản

Trên nền tảng này, Identity do operator tạo rồi gán Extension — đó là toàn bộ mô hình trong `PHASE_2_CUSTOMER_ASSIGNMENT`. Một người tự đăng ký sẽ vào portal mà không có điện thoại, không có customer và không có gì để xem. `PHASE_2_IDENTITY_IMPLEMENTATION.md` cũng liệt kê self-service registration vào mục "Deliberately not enabled yet".

Nên màn ở địa chỉ đó là **nửa sau hành động của operator**: người được mời tới từ link trong email và đặt mật khẩu đầu tiên.

- **Email hiện ra và không sửa được.** Đó là địa chỉ lời mời được gửi tới và là thứ token gắn vào. Một ô nhập được ở đây ngụ ý người đọc có thể kích hoạt một tài khoản khác với tài khoản họ được mời.
- **Không hỏi họ tên, công ty.** Operator đã sở hữu dữ liệu customer và membership; một chỗ thứ hai để gõ tên công ty là một phiên bản thứ hai của nó mà không ai đối soát.
- **Không có dòng đồng ý Điều khoản/Bảo mật.** Portal không có trang điều khoản lẫn trang bảo mật để trỏ tới, và một checkbox đồng ý với văn bản không tồn tại còn tệ hơn không có.

### Code Verification tách làm hai

Kế hoạch Bước 3 dùng **link callback HTTPS**, không dùng mã OTP: "URL HTTPS công khai cho verify/recovery callback". Nên `/auth/verify-email` — trang mà link trong email trỏ tới — là màn khớp với kế hoạch, và nó không có biểu mẫu nào: token nằm trong URL, việc duy nhất của người đọc là biết nó có chạy không. Ba trạng thái, và trạng thái đang chờ không phải hình thức: token được kiểm với dịch vụ identity qua mạng, nên có một khoảng thật sự chưa biết kết quả.

`/auth/code` giữ dạng nhập mã của Mantis theo yêu cầu, để sau này chọn. **Sáu ô, không phải bốn như Mantis**: bốn chữ số là mười nghìn mã, và tuy có rate limit của Bước 3 thì vẫn bảo vệ được, sáu mới là thứ mọi ứng dụng đã dạy người dùng mong đợi. Nếu server đi theo hướng link thì màn này bỏ đi.

### Ràng buộc cứng: không được tiết lộ email có tồn tại hay không

Bước 3 ghi: *"Phản hồi recovery không tiết lộ email có tồn tại hay không."* Đây là ràng buộc định hình hai màn:

- `ForgotPasswordForm` **không có** thông báo "không tìm thấy tài khoản", và sau này cũng không được có. Gửi đi luôn dẫn tới cùng một màn xác nhận. Một trạng thái lỗi ở đây là một cỗ máy dò tài khoản với giọng điệu thân thiện.
- `checkMail.description` viết theo lối điều kiện: *"Nếu {email} thuộc về một tài khoản Mphone, liên kết đặt lại mật khẩu đã được gửi tới đó."* Câu đó đúng trong cả hai trường hợp. Địa chỉ được in lại nhưng không bao giờ được xác nhận — in lại chỉ chứng minh người đọc đã gõ nó, đúng bằng lượng thông tin màn này được phép biết.

Lỗi duy nhất màn Quên mật khẩu được phép hiện là lỗi không nói gì về địa chỉ: dịch vụ gián đoạn, hoặc bị giới hạn tần suất.

### Những chỗ khác cố tình khác Mantis

- **Dòng nhắc hộp thư rác chuyển sang màn sau.** Mantis để "Do not forgot to check SPAM box." ngay dưới ô email, trước khi gửi. Không ai kiểm tra được hộp thư rác cho một lá thư chưa được gửi.
- **Email hiển thị che ngược lại.** Mantis in "jone. ****@company.com" — giữ tên người, giấu hộp thư, tức là lộ ra người và giấu đi đúng phần phân biệt hai tài khoản cùng công ty. `maskEmail` giữ ký tự đầu của phần local và giữ nguyên domain.
- **Màn Đặt lại có trạng thái link hết hạn.** Mantis không có; màn reset của nó chỉ là biểu mẫu. Bước 3 bắt token dùng một lần và hết hạn ngắn, nên đây không phải trường hợp biên — đó là thứ hiện ra mỗi lần thứ hai ai đó mở lại email cũ.
- **Có danh sách điều kiện, không chỉ thanh độ mạnh.** Thanh của Mantis nói mật khẩu "Poor" mà không nói làm gì cho nó khá hơn. Danh sách mới là nửa hành động được, nên nó cũng là nửa mà form kiểm tra; đạt/chưa đạt là hai icon khác nhau chứ không phải hai màu của cùng một icon.
- **Ghi chú SIP.** Mật khẩu khách hàng và SIP password của máy nhánh là hai bí mật khác nhau, và Bước 3 ghi rõ đổi cái này không đổi cái kia. Người đi đặt lại mật khẩu vì điện thoại bàn ngừng đăng ký cần biết màn này không phải chỗ sửa.
- **Đếm ngược khi gửi lại.** Bước 3 yêu cầu rate limit cho verify, resend và recovery. Một giới hạn người đọc không nhìn thấy là một nút chạy được cho tới lúc đột nhiên không. Con số ở trình duyệt là lời hứa của giao diện, không phải chỗ thực thi — server vẫn phải từ chối yêu cầu quá sớm.

### Route và cách review

`/auth/:screen`, **chỉ đăng ký khi `VITE_PORTAL_PREVIEW`**, là route anh em của ứng dụng chứ không phải con. Bản production không có route tới màn nào trong nhóm: màn đăng nhập thật do `SessionGate` render khi `session.php` trả 401, còn lại đều mở từ link trong email mà chưa có gì gửi được.

`AuthPreviewBanner` làm hai việc reviewer cần và khách hàng không bao giờ được thấy: **đổi trạng thái màn** (link hết hạn, xác minh đang chạy — đúng những trạng thái không bấm tới được, và cũng là những trạng thái không ai nhớ để thiết kế), và **mang một đường quay lại** vì các route này nằm ngoài vỏ portal.

Luồng duy nhất được nối thật trong preview là **Quên mật khẩu → Kiểm tra email**, vì đó là chỗ bàn giao mà reviewer nên đi bộ qua được.

### Hợp đồng identity.php cần mọc thêm

`identity.php` hiện proxy tới `mphone-auth-v2` với đúng năm action: `login`, `logout`, `refresh`, `session`, `extensions`. Bước 3 cần thêm, và mọi màn ở trên đã viết theo hình dạng này:

| Màn | Action cần | Ghi chú |
|---|---|---|
| Quên mật khẩu | `recovery/request` | Luôn trả 200 bất kể email có tồn tại. Rate limit theo IP và theo email. |
| Đặt lại mật khẩu | `recovery/confirm` | Token dùng một lần, hết hạn ngắn. Trả mã riêng cho token chết để màn hiện đúng trạng thái. |
| Kích hoạt | `invite/accept` | Token gắn với đúng một identity; email lấy từ token chứ không nhận từ client. |
| Xác minh email | `verify/confirm` + `verify/resend` | Kết quả gồm đang chờ, thành công, hết hạn. |
| Nhập mã | `verify/code` | Chỉ cần nếu chọn hướng OTP thay vì link. |

Không màn nào tự gọi endpoint: trang chỉ nhận `onSubmit`, `error`, `submitting`. Container sở hữu lần thử — `SessionGate` đang làm đúng như vậy cho màn đăng nhập, và đó cũng là thứ cho phép review nguyên màn trong bản preview mà không có đường đăng nhập giả.

## Sidebar nhiều cấp (v2.10.0, experimental)

Template Mantis free in chữ `collapse - only available in paid version` ngay chỗ menu lồng nhau. `NavCollapse` là cấp đó, viết cho portal này.

Ba hành vi làm nên khác biệt giữa một collapse và một cái thư mục để giấu bớt mục:

- **Tự mở khi một route con đang active.** Vào thẳng `/design-system` từ một link mà thấy mục Thiết kế đang đóng, không biết nó nằm trong nhóm nào, là cách quen thuộc nhất để menu lồng nhau làm người ta lạc. Effect chạy lại theo `pathname` nên nó cũng mở lại sau khi đổi route.
- **Vẫn đóng được dù con đang active.** Auto-open đặt trạng thái ban đầu, không giành lấy quyền điều khiển của người đọc sau đó.
- **Trong mini drawer thì mở drawer trước rồi mới bung.** Mantis Pro thả một popper ra khỏi rail; một popper neo vào icon 36px cần focus trap và luật đóng riêng của nó, sai một chút còn tệ hơn thêm một nhịp animation của drawer.

Chevron `aria-hidden`, trạng thái nằm ở `aria-expanded`, nên trình đọc màn hình được nghe "đang thu gọn" chứ không phải "có một hình tam giác". `Collapse` dùng `timeout="auto"` (thêm một mục con không phải sửa lại con số cứng) và `unmountOnExit`, nên link của mục đang đóng không nằm trong thứ tự tab — đã kiểm bằng render: mục đóng đóng góp 0 link.

### Nhóm Pages

Toàn bộ màn đứng ngoài vỏ portal gom về một nhóm `Pages` **chỉ có trong bản preview**, chia làm ba mục `collapse`: **Thiết kế** (App phone, Design System), **Xác thực** (7 màn), **Bảo trì** (4 màn).

Đây là những màn mà ứng dụng không bao giờ tự link tới — vào màn đăng nhập bằng cách bị đăng xuất, vào 404 bằng cách gõ sai — nên cách duy nhất để review chúng là một danh sách thừa nhận chúng là một bộ. Mục Thiết kế được gộp vào cùng vì nó cùng loại (design surface, không phải tính năng khách hàng, theo docs/08), **và vì nó là mục duy nhất có route con render bên trong vỏ portal** — tức là chỗ duy nhất hành vi tự-mở thực sự chạy được.

## Bảo trì (v2.10.0, experimental)

Bốn màn của Mantis, một file, vì chúng chỉ khác nhau ở một dấu hiệu, ba chuỗi và lối ra.

**Ba trong bốn màn được nối vào thứ có thật**, điều hiếm gặp với một bản phục dựng ở đây:

| Màn | Nối vào |
|---|---|
| `notFound` | Catch-all của router. Trước đây là redirect âm thầm về dashboard — tức là bảo người gõ sai URL rằng không có gì sai cả. |
| `serverError` | `errorElement` của router **và** `ErrorBoundary` mới. Trước đây một component ném lỗi làm cả portal thành trang trắng. |
| `underMaintenance` | `SessionGate` khi `session.php` trả **503**. Nginx tự trả mã đó khi PHP-FPM không đáp, nên không cần thêm gì ở server. |
| `comingSoon` | Không nối vào đâu, không có route production. |

Màn 404 đặt **ngoài** `DashboardLayout` chứ không phải trong. Cân nhắc cả hai: giữ sidebar thì người gõ sai có thể bấm luôn chỗ họ định tới; nhưng một trang lỗi mang nguyên vỏ ứng dụng dễ bị đọc nhầm thành "trang này tồn tại, chỉ là trống". Một lối ra rõ ràng thắng.

Màn 500 mời **Tải lại** chứ không phải link về trang chủ. Nếu nguyên nhân là bundle cũ sau khi deploy, đổi route bên trong đúng cái bundle hỏng đó không thay đổi được gì.

### Những chỗ cố tình khác Mantis

- **Bỏ đồng hồ đếm ngược và ô nhận thông báo ở màn Sắp ra mắt.** Không có ngày ra mắt nào cả, và một đồng hồ đếm về một ngày bịa ra cùng loại với hoá đơn hiện số tiền bịa ra. Ô email cũng không có endpoint nào phía sau, mà lấy một địa chỉ rồi không làm gì với nó còn tệ hơn không hỏi.
- **Không dùng ảnh minh hoạ.** Mantis render 3D cho cả bốn màn. Portal vẽ bằng chữ và icon, đúng lý do `StandaloneLayout` vẽ nền bằng gradient: đây là những trang người đọc nhìn thấy *khi đã có thứ gì đó hỏng*, và một request ảnh chưa trả lời là thứ hỏng thứ hai.
- **`underMaintenance` không có nút về trang chủ.** Trang chủ cũng đang không phục vụ; nút duy nhất có nghĩa là Thử lại.

### Đổi tên trong lần này

`AuthLayout` → **`StandaloneLayout`** (`components/patterns/`) và `AuthResultCard` → **`ResultCard`** (`components/patterns/`). Cả hai đều `experimental` nên đổi tên được theo docs/10.

Một màn 404 và một màn đăng nhập không liên quan gì đến nhau, trừ đúng điểm này: cả hai đều không có drawer, không có header, không có session, và vẫn phải trông như cùng một sản phẩm. Đặt tên khung theo họ màn đầu tiên cần đến nó sẽ khiến họ thứ hai hoặc phải import một thứ tên là "auth", hoặc tự vẽ khung riêng.

`ResultCard` thêm prop `mark`: thay icon bằng một con số cỡ lớn cho các trang mà chủ đề là một mã trạng thái.

### Lỗi bắt được khi render

Số 404/500 ban đầu dùng `variant="h1"`, mà MUI ánh xạ variant đó sang **thẻ** `<h1>`. Kết quả là mỗi trang có hai `h1`, cái đầu là một con số `aria-hidden`, và tên trang mà trình đọc màn hình lấy được là "404". Đã đổi sang `component="div"`; giờ mỗi trang đúng một `h1` — đã kiểm lại bằng render trên cả năm trang.

## Thẻ thống kê (v2.11.0, experimental)

Dựng lại `Widget > Statistics` của Mantis Pro. Route `/widget/statistics`, mục Widget trong nhóm Thiết kế, chỉ có trong bản preview.

Màn này khác mọi màn đã dựng: **nó không phải một trang sản phẩm, nó là một cái giá trưng bày** — tám cách vẽ cùng một con số, trên một màn, không kèm bất kỳ phát biểu nào về khi nào dùng cái nào. Dựng y nguyên sẽ tặng cho portal tám component thay thế được cho nhau và không có lý do gì để chọn giữa chúng.

Nên bản dựng này là một catalogue **có luận điểm**: năm hình dạng, mỗi hình trả lời một câu hỏi bốn hình kia không trả lời được, và thẻ cuối trang là bảng quyết định.

| Component | Trả lời câu hỏi | Quy tắc |
|---|---|---|
| `HeroStatCard` | Con số quan trọng nhất trang này là gì? | Đúng một thẻ mỗi trang |
| `StatCard` | Hiện có bao nhiêu? | Không tô màu |
| `SparkStatCard` | Nó đang đi lên hay đi xuống? | Chỉ khi đủ điểm để hình dạng có nghĩa |
| `PeriodStatCard` | Bao nhiêu, trong khoảng nào? | Kỳ phải hiện trên thẻ |
| `StatusStatCard` | Có gì cần xử lý không? | Luôn kèm icon và chữ |

Tám biến thể của Mantis rút về năm vì bốn trong số đó chỉ khác nhau ở màu nền: thẻ Revenue xanh, Orders hổ phách, Total Sales xanh lá, bốn thẻ mạng xã hội theo màu thương hiệu. Đó là một hình dạng, không phải bốn. `StatCard` cũng chỉ **thêm prop `icon`** thay vì sinh ra component thứ sáu — một thẻ có icon mờ và một thẻ không có là cùng một thẻ.

### Hai điều cố tình không lặp lại

**Mười chín con số cỡ lớn cạnh tranh nhau.** Trang này có đúng một thẻ dẫn, và mọi thẻ bên dưới nhỏ hơn là có chủ ý. Một trang mà mọi thứ đều được nhấn mạnh thì không có gì được nhấn mạnh.

**Mười mảng màu không mã hoá gì cả.** Tiêu màu vào trang trí không miễn phí — nó chính là thứ khiến người đọc không nhận ra thẻ duy nhất chuyển đỏ. Ở đây chỉ `StatusStatCard` được tô, vì chỉ nó có màu mang thông tin.

### Ba con số đo được, không phải ba ý kiến

1. **ΔE 0.3.** Chạy validator palette trên bộ status của theme: `#52c41a` (success) và `#faad14` (warning) cách nhau **ΔE 0.3 dưới protanopia mô phỏng**. Với người mù màu đỏ-lục, "bình thường" và "vượt ngưỡng" là **cùng một màu**. Vì vậy mỗi trạng thái bắt buộc kèm icon và chữ — đây là ràng buộc đo được, không phải thói quen tốt.
2. **1.74:1.** Bản dựng đầu của `StatusStatCard` tô nền đặc bằng `{tone}.main` và lấy `contrastText` của theme. Đo trên ảnh render: chữ trắng trên warning đạt **1.74:1**, trên success **2.27:1** — dưới xa ngưỡng 4.5:1, và không đọc được. Nền đổi sang tint nhạt kèm viền nhấn 3px.
3. **11.5:1.** Sau khi sửa, đo lại cả bốn thẻ ở cả hai chế độ: thấp nhất **11.53:1**, cao nhất 14.73:1.

Viền nhấn còn là kênh thứ hai không phải màu. Cùng với icon và chữ, trạng thái sống sót khi in đen trắng.

### Lỗi bắt được khi render

- **Chip trạng thái không hiện.** Component guard chip trên prop `status`, nhưng trang truyền `statusLabel`. Kết quả: thẻ vẽ ra màu và không có chữ — **đúng cái thất bại mà component tồn tại để ngăn, ship bên trong chính component cấm nó**. Chỉ lộ ra khi nhìn trang, không lộ khi đọc file.
- **`ReferenceError: FILL is not defined`** khi sửa nền: patch bằng chuỗi trượt vì prettier đã gộp dòng trước đó, xoá hằng số mà còn tham chiếu. Đáng ghi lại vì `errorElement` dựng ở v2.10.0 đã bắt đúng lỗi này và hiện màn 500 kèm nút Tải lại thay vì trang trắng — lần đầu cơ chế đó chạy thật.

### `StatCard featured` bị thay thế

`featured` (nền primary đặc) không được dùng ở bất kỳ trang sản phẩm nào — chỉ tồn tại trong catalog. `HeroStatCard` là thứ thay thế nó: cùng vai trò, cỡ chữ đúng cho một con số dẫn, và có dòng so sánh. `featured` vẫn chạy được để không phá vỡ API, nhưng **không dùng cho việc mới**; gỡ ở 3.0.0 theo docs/10.

## Bộ card widget (v2.12.0, experimental)

Từng card trên `Widget > Statistics` của Mantis dựng lại thành component riêng, để lấy ra dùng cho màn khác. Trang `/widget/statistics` giờ là một **giá trưng bày**: mỗi hàng ghi rõ tên component vẽ ra nó.

| Component | Tương ứng | Ghi chú |
|---|---|---|
| `MetricTile` | Hàng 1 | Nền trắng, số trên nhãn dưới, glyph mờ bên phải |
| `FeatureMetricCard` | Hàng 2 | Nền đặc, watermark trái, số 56px căn phải, dải footer |
| `ChannelTile` | Hàng 3 | Nền đặc, số đếm, glyph trong ô bo góc |
| `PeriodStatCard` | Hàng 4 | Đã có từ v2.11.0, dùng lại nguyên |
| `SparkStatCard` | Hàng 5 | Đã có, dùng lại nguyên |
| `IllustratedMetricCard` + `WidgetMotif` | Hàng 6 | Nền đặc, số căn giữa trên hoa văn vẽ bằng SVG |

Hàng 4 và 5 **không sinh component mới**: `PeriodStatCard` và `SparkStatCard` đã đúng hình dạng đó rồi. Thêm bản sao chỉ để khớp số hàng của Mantis là cách nhanh nhất để có hai component phải giữ đồng bộ mãi mãi.

### Màu nền: giữ nguyên, và không hardcode hex nào

Màu của Mantis **đúng bằng ramp Ant mà theme Mphone đã có**: xanh là `primary.main` (#1677ff), hổ phách `warning.main` (#faad14), lục `success.main` (#52c41a), xanh mòng két `info.main` (#13c2c2), đỏ `error.main` (#ff4d4f). Lấy bằng computed style từ trang gốc chứ không ước lượng từ ảnh. Vì vậy toàn bộ bộ card dùng token, không một mã hex nào nằm trong component.

### Màu chữ: không giữ nguyên, vì đo được là sai

Mantis đặt chữ trắng lên cả sáu nền. Bốn trong sáu là không đọc được:

| Nền | Chữ trắng | Chữ `#262626` | Chọn |
|---|---|---|---|
| `primary` #1677ff | 4.10 | 3.69 | trắng |
| `warning` #faad14 | **1.90** | 7.96 | mực tối |
| `success` #52c41a | **2.27** | 6.68 | mực tối |
| `info` #13c2c2 | **2.21** | 6.86 | mực tối |
| `error` #ff4d4f | **3.27** | 4.63 | mực tối |
| `dark` #1f1f1f | 16.48 | 1.09 | trắng |

Quy tắc rút ra gọn một dòng và **không đổi một hue nào**: nền sáng lấy mực tối, nền tối lấy mực trắng. Thẻ hổ phách vẫn là thẻ hổ phách. Bảng này nằm trong `widgetInk.js` cùng lý do vì sao nó là dữ liệu chứ không phải công thức tính luminance lúc chạy — sáu nền này đã đo một lần, còn một công thức ở đó sẽ mời người sau tin nó trên nền thứ bảy chưa ai kiểm.

### Dải footer không phải trang trí

`FeatureMetricCard` giữ dải tối dưới đáy vì bản gốc có. Hoá ra nó cũng là thứ cứu trường hợp còn lại: chữ trắng trên `primary.main` đạt 4.10 — qua ngưỡng 3:1 cho chữ lớn nhưng thiếu 4.5:1 cho chữ nhỏ; trên dải tối 18% thì đạt **5.69** và caption qua hẳn.

Tiêu đề card cũng nâng lên weight 600. Ở 20px thường nó là "chữ nhỏ" cần 4.5:1; ở 20px semibold nó vượt ngưỡng chữ lớn 3:1 mà cặp màu đó đã qua. Một nấc weight, không đổi màu.

### Prop `strong`: lối thoát có đo đạc

Vẫn còn đúng một trường hợp không cứu được bằng dải footer: chữ **nhỏ** trên nền `primary.main` phẳng, như nhãn của `IllustratedMetricCard`. Mực tối còn tệ hơn (3.69). Nên có `strong`, đổi nền sang `primary.dark` #0958d9 — cùng họ xanh, chữ trắng lên **6.16**. Mặc định tắt vì `primary.main` mới là thứ Mantis vẽ; bật ở đâu có chữ nhỏ trên nền xanh.

Đo lại trên trang render sau khi bật: giá trị 6.16, nhãn 5.09. Ba card hàng 6 giờ đều qua cả hai ngưỡng — lục 8.13/6.75, xanh 6.16/5.09, hổ phách 9.70/7.85.

### Hình minh hoạ vẽ, không nhập

`WidgetMotif` vẽ ba hoa văn — `waves` (cung đồng tâm, tín hiệu rời một điểm), `nodes` (đồ thị máy nhánh trên một tổng đài), `grid` (trường chấm trung tính) — bằng SVG nội tuyến, một họ path trong `currentColor`, `aria-hidden`.

Hai lý do không dùng file ảnh. `docs/12` rule 6 cấm sao chép asset của Mantis Pro. Và đây là những tấm card mà toàn bộ công việc của chúng là *làm một mặt phẳng có màu* — một request ảnh chưa trả lời để lại đúng chỗ đó dở dang.

Hoa văn bị **mask cho quang một phần ba giữa**. Đây không phải thẩm mỹ: mọi con số tương phản ở trên đo trên nền phẳng, và chúng chỉ đúng với card thật nếu không có gì được vẽ chen giữa nền và chữ. Motif dùng mực tối cũng được vẽ nhạt hơn (0.13 so với 0.24), vì nét tối đọc nặng hơn nét sáng ở cùng alpha.

### Lỗi lặp lại đáng ghi

Lần thứ hai trong hai phiên: một patch thay chuỗi vào JSX **trượt vì prettier đã ngắt dòng từ trước**, khiến prop `strong` được khai báo ở component và có trong dữ liệu nhưng không bao giờ được truyền — card vẫn ra nền cũ. Không lỗi lint, không lỗi runtime, chỉ sai màu. Chỉ lộ ra vì có phép đo sau khi render. **Quy tắc: sửa chạm quá vài dòng thì viết lại cả file, đừng thay chuỗi.**

## Thẻ dữ liệu (v2.13.0, experimental)

`/widget/data` (chỉ preview, mục Widget trong nhóm thiết kế) dựng lại màn `Widget > Data` của Mantis: **giữ nguyên mười tám thẻ, đúng lưới, đúng breakpoint, đúng màu nền**, chỉ đổi nội dung sang ngữ cảnh tổng đài Mphone và đổi ba thứ có lý do đo được.

### Mười bốn component cho mười tám thẻ

| Component | Thẻ Mantis | Ghi chú |
|---|---|---|
| `ChecklistCard` | To Do List | Nút cộng mở ô nhập và thêm được thật |
| `ProgressListCard` (`layout="stacked"`) | Traffic Sources | Không thêm component mới, chỉ thêm một layout |
| `PeopleListCard` | Team Members, User Activity, New Customers | Một hình dạng, ba bộ dữ liệu |
| `NotificationListCard` | Latest Messages | Cột thời gian riêng bên trái |
| `FeedListCard` | Feeds, Incoming Requests | `marker="avatar"` hoặc `"dot"` |
| `TaskTimelineCard` | Tasks | Dựng bằng Stack, không cần `@mui/lab` |
| `MediaListCard` | Latest Posts | Khối màu + icon thay cho ảnh |
| `DeltaListCard` | Total Revenue | Ba tín hiệu chiều: caret, dấu, màu |
| `AssignmentTable` | Projects | Chip ưu tiên |
| `TicketQueueTable` | Active Tickets | Cột hạn xếp chồng số và đơn vị |
| `SummaryTableCard` | Product Sales | Ba figure ngang hàng + bảng cuộn |
| `MetricTable` | Application Sales, Latest Customers | Ô có thể là node, cặp hai dòng, hoặc avatar |
| `OrderTable` | Latest Order | Sửa số lượng tại chỗ, xoá dòng |
| `StatusTable` | Recent Tickets | Chip outlined trung tính |
| `ToneChip` | (dùng chung) | Chip nền màu, mực do `dataInk.js` chọn |

Ba component vẽ nhiều hơn một thẻ. Cùng một hình dạng với dữ liệu khác nhau là **một** component; bản sao tạo ra chỉ để khớp số thẻ là hai thứ phải giữ đồng bộ mãi mãi. Trang có một card cuối cùng in đúng bảng này để người xem nhấc được card mà không phải mở file.

### Mực chữ phải chọn theo từng chế độ màu

`dataInk.js` là `widgetInk.js` đo lại cho chữ cỡ chip, và khác hai điểm.

Thứ nhất, chip mang chữ 13px nên **không bao giờ được hưởng ngưỡng 3:1 của chữ lớn**. Trắng trên `primary.main` đo 3.83 — đủ cho một con số 24px, không đủ cho một cái chip. Nên chip xanh ở chế độ sáng dùng `primary.dark` #0958d9, chính là lối thoát `strong` mà v2.12 đã đặt ra: trắng lên 6.16 và nó vẫn là cái chip xanh.

Thứ hai — và đây là chỗ dễ trượt nhất — **ramp xám của theme bị lật ở dark mode**: `grey.800` là #141414 ở sáng và #f0f0f0 ở tối. Một mực đặt tên theo ramp xám sẽ âm thầm thành gần trắng trên nền hổ phách. `common.black` và `common.white` không di chuyển, nên bảng dưới đây gọi đúng hai token đó và chọn theo từng scheme:

| Nền | Chữ trắng | Chữ đen | Chọn |
|---|---|---|---|
| sáng `primary` #1677ff | 4.10 | 5.12 | `primary.dark` + trắng (6.16) |
| sáng `warning` #faad14 | 1.90 | 11.05 | đen |
| sáng `success` #52c41a | 2.27 | 9.27 | đen |
| sáng `info` #13c2c2 | 2.20 | 9.52 | đen |
| sáng `error` #ff4d4f | 3.27 | 6.43 | đen |
| tối `primary` #1668dc | 5.19 | 2.53 | trắng |
| tối `warning` #d89614 | 2.53 | 8.29 | đen |
| tối `success` #49aa19 | 2.98 | 7.05 | đen |
| tối `info` #13a8a8 | 2.92 | 7.19 | đen |
| tối `error` #a61d24 | 7.44 | 2.24 | trắng |

`error` là tông duy nhất đổi phe: đỏ ramp sáng đủ sáng để cần mực đen, đỏ ramp tối đủ tối để cần mực trắng. Đó chính là lý do đây là **bảng theo chế độ màu** chứ không phải một quy tắc.

Cùng lý do đó, chữ có màu (thẻ `DeltaListCard`) dùng nấc `dark` chứ không phải `main`: `success.main` #52c41a đo 2.27 trên nền giấy trắng, `success.dark` #237804 đo 5.58 — và vì ramp tối của Ant chạy sáng dần ở đầu trên, cùng token đó đo 9.35 trên #1e1e1e mà không cần giá trị thứ hai.

### Ba chỗ không giữ nguyên Mantis, và vì sao

**Thang ưu tiên bị lật lại cho đúng.** Mantis tô ưu tiên cao nhất màu lục và thấp nhất màu đỏ. Năm nền được giữ nguyên; thang thì quay lại đúng chiều — đỏ ở đầu thang, lục ở cuối. Chip nào cũng mang chữ, vì `success` #52c41a và `warning` #faad14 cách nhau ΔE 0.3 dưới protanopia.

**"Xem tất cả" chỉ vẽ ở nơi có đích thật.** Sáu thẻ trỏ được sang `/contacts`, `/calls/history`, `/billing`, `/reports`; số còn lại không có route nào trong portal này, nên không có link. Một link không đi đâu tệ hơn không có link.

**Hai nút thao tác của `OrderTable` làm được việc.** Mantis vẽ bút chì và thùng rác không nối vào gì. Ở đây bút chì mở ô số lượng ngay trong dòng (Enter lưu, Esc huỷ) và thùng rác xoá dòng khỏi danh sách mà trang đang giữ. Không truyền handler thì cột thao tác không được vẽ.

### Số liệu mẫu nhưng khớp nhau

Tám dòng cước cộng đúng bằng con số "Tuần này" in phía trên; "Hôm qua" là dòng mới nhất. Bốn dòng gói nhân ra đúng thành tiền. Chín khu vực cộng đúng 100,00%. Toàn bộ nằm trong `sections/widget/dataSample.js` để ngày nào có endpoint thật thì đổi một import.


### Ba lỗi tương phản của v2.11–v2.12 lộ ra trong lần đo này

Cùng phép đo trên `/widget/statistics` cho thấy ba chỗ hỏng, đều chỉ hiện ra khi *render rồi đo*, không đọc code mà thấy:

1. **`widgetInk.js` chọn mực bằng token `grey.800`** — ramp xám lật ở dark mode nên toàn bộ card nền hổ phách, lục, mòng két bị mực gần trắng (đo 2.22–2.61), còn ô "nền tối" biến thành ô **trắng chữ trắng** ở 1.14. Nay `widgetSurface()` trả về hai nửa sáng/tối và ô tối dùng `grey.100` (#1f1f1f) ở dark mode.
2. **MainCard nuốt khối dark của caller.** MainCard tự phát `theme.applyStyles('dark', …)` và spread *sau* `sx` của caller, nên một khối dark truyền qua `sx` bị ghi đè im lặng. Đó là lý do prop `darkSX` tồn tại; ba card widget nay dùng nó.
3. **`themes/overrides/Chip.js` viết `${color}.main` trên `${color}.lighter` ở chế độ sáng** trong khi chế độ tối đã dùng `darker`. Đo được 1.83 (warning), 2.21 (success), 2.97 (error) — chip `light`/`combined` không đọc được ở một chế độ và ổn ở chế độ kia, từ đúng một dòng. Nay cả hai chế độ dùng `darker`; không nền nào đổi.

Ngoài ra: chữ nhỏ trên nền xanh `primary.main` cần `strong` (đo 4.10 so với ngưỡng 4.5) — `FeatureMetricCard` "Cuộc gọi hôm nay", `ChannelTile` "Gọi vào hotline" và `HeroStatCard` dạng filled đều đã bật; hai nhãn còn dùng `opacity` 0.85/0.88 trên nền màu được trả về đủ mực.

## Thẻ khách hàng (v2.14.0, experimental)

`/customer/cards` dựng lại màn `Customer > Cards` của Mantis, nằm trong mục **Khách hàng** cạnh trang danh sách sẵn có. Khác hai màn Widget trước, **màn này chạy trên dữ liệu thật**: `contacts.php` đã tồn tại và trả về đúng những gì trang hiển thị.

### Hợp đồng của endpoint

```
GET contacts.php?q&page&page_size   (chỉ GET; mọi method khác trả 405)
→ { available, scope: 'domain'|'assigned', page, page_size, pages, total,
    contacts: [{ uuid, name, title, organization, type,
                 phones: [{ label, number, extension, primary }] }],
    extensions: [{ extension_uuid, extension, effective_caller_id_name }],
    capabilities: { click_to_call } }
```

`page_size` chỉ nhận **20 / 50 / 100**, `q` bị cắt ở 64 ký tự và tìm theo tên, tổ chức hoặc số điện thoại. Sắp xếp là cố định phía máy chủ (theo tên rồi tổ chức) — không có tham số sort.

### Giữ giải phẫu, bỏ ô không có dữ liệu

Giữ nguyên: avatar + tên trên một đường kẻ, một dòng thân, khối 2×2 thông tin, hàng chip, chân thẻ có một hành động; lưới `xs-12 sm-6 lg-4`; dialog xem nhanh chia 8/4 với nút Đóng ở chân.

Bỏ hẳn: email, quốc gia, website, tuổi, giới tính, học vấn, kinh nghiệm, kỹ năng — `contacts.php` không có trường nào trong số đó. **Sáu dấu gạch ngang xếp hàng nói với người đọc rằng hồ sơ trống, chứ không phải rằng câu hỏi chưa từng được hỏi.** Thay vào đó khối 2×2 là số chính, máy nhánh, tổ chức, loại liên hệ; các số còn lại thành chip.

### Ba nút biến mất và một nút thay chỗ

`Add Customer`, `Edit`, `Delete`, `Export PDF` đều cần endpoint mà server trả 405. Chỗ của nút chính giờ là **máy nhánh dùng để gọi** — thứ màn hình thật sự cần, vì click-to-call phải biết gọi từ đâu. Menu ba chấm giữ lại hai việc làm được không cần server mới: **Gọi** (`click_to_call.php`, POST thật) và **Sao chép số**.

Nút sắp xếp có nhãn "trong trang", vì nó chỉ đảo được hai mươi dòng đang hiển thị.

### Lỗi click-to-call không được gộp làm một

`sections/customer/callErrors.js` tách các mã của `click_to_call.php`. Hai mã không bao giờ được đọc thành "thử lại": `extension_forbidden` (máy nhánh gọi đi không thuộc tài khoản — sửa số đích bao nhiêu lần cũng vô ích) và `switch_unavailable` (FreeSWITCH không trả lời — số điện thoại hoàn toàn bình thường). `originate_failed` mới là mã đáng thử lại, thường vì máy nhánh của chính người gọi chưa đăng ký.

### Preview server

`preview/serve.mjs` nay stub `contacts.php` bằng 24 liên hệ tiếng Việt thuộc tám tổ chức, có xử lý `q`, `page`, `page_size`, nên tìm kiếm và phân trang xem thử được ngoại tuyến; stub session cũng mang đúng các khoá quyền mà `session.php` phát ra (`contact_view`, `click_to_call_call`…) thay cho những khoá tự đặt trước đây.

## Prompt contract for AI-generated pages

Khi yêu cầu AI tạo trang mới, cung cấp: mục tiêu người dùng, vai trò/quyền, dữ liệu và trạng thái, hành động chính, thao tác nguy hiểm, breakpoint, ngôn ngữ và danh sách component được phép dùng. AI phải tái sử dụng semantic tokens và các pattern trong catalog này; không tự tạo màu, khoảng cách hoặc component mới nếu chưa nêu lý do.
