# Kế hoạch triển khai MPO Design

Tài liệu này là kế hoạch triển khai duy nhất cho migration Portal mới tại `portal-worktree/app/portal/mpo-design`. `AGENTS.md` ở thư mục gốc vẫn là nguồn điều khiển cao nhất; tài liệu này diễn giải thứ tự thực hiện và các cổng nghiệm thu.

## 1. Mục tiêu và nguyên tắc

Triển khai theo đúng thứ tự:

1. Dựng lại đầy đủ Mantis 4.2.0 trên `mpo-design` từ nguồn có bản quyền và đã làm sạch.
2. Bổ sung localization và tiếng Việt trong khi giữ nguyên ý nghĩa, cấu trúc, hành vi và trải nghiệm Mantis; tiếng Anh và tiếng Việt phải đầy đủ song song.
3. Chỉ sau khi baseline Mantis song ngữ được nghiệm thu mới phân loại, thiết kế và triển khai nội dung hoặc trang sản phẩm Mphone.

Các giai đoạn không được trộn lẫn. Không dùng một đợt thay đổi để vừa dựng baseline, vừa dịch, vừa đổi thương hiệu hoặc thiết kế lại sản phẩm.

## 2. Ranh giới nguồn

- Nguồn triển khai duy nhất là bộ Mantis 4.2.0 Vite JavaScript full-version có bản quyền và đã được làm sạch.
- `portal-worktree/app/portal/mpo-design` là target và source of truth duy nhất của migration mới.
- `portal-worktree/app/portal/spa` chỉ được đọc để tham khảo hành vi sản phẩm Mphone đã kiểm chứng, nội dung, localization và accessibility. Không import source của `spa` vào build mới.
- `portal-worktree/app/portal/mto` là bản lỗi đã bị loại. Không đọc, sao chép, import, so sánh, sửa, build, test hoặc trích dẫn.
- Không kế thừa inventory, quyết định kỹ thuật, tuyên bố hoàn thành hoặc kết quả kiểm thử của migration đã bị loại.
- Không kết nối server, database production, SIP/PBX, Android hoặc dịch vụ bên ngoài. Mọi tích hợp phải dùng fixture, stub hoặc simulation cục bộ và được ghi nhãn trung thực.

> **Quyết định cây target — product owner chốt 2026-09-02.** Cây Việt hóa chính là `portal-worktree/app/portal/mpo-design`, chạy trên cổng **4323**. Cây này đọc mock API của Mantis thay vì dựng dữ liệu local; lựa chọn này là có chủ ý, vì việc dựng lại dữ liệu bằng tay là nguyên nhân làm các cây trước phình diff và lệch khỏi vendor.
>
> `AGENTS.md` đã được cập nhật ngày 2026-09-02 cho khớp: cổng preview 4323, và ngoại lệ có chủ ý về host ngoài lúc runtime (mock API của vendor, flagcdn, map tile, web font) kèm ranh giới — chỉ đọc dữ liệu demo của vendor, không ghi, không dữ liệu khách hàng, không trình bày như tích hợp thật. Offline cache giữ UI Lab dùng được khi các host đó không truy cập được.
>
> Các cây cũ (`mpo-design-off` và mọi bản thử nghiệm trước) không còn là tham chiếu và không cần đối chiếu nữa. `spa` vẫn là tham chiếu thuật ngữ chỉ đọc.

## 3. Pha A — Baseline Mantis sạch

> **Pha A đã đóng. Product owner quyết ngày 2026-09-02.** Toàn bộ mục 3 mô tả công việc *dựng*: thay dependency ngoài bằng local adapter, dựng fixture, loại mọi host ngoài lúc runtime. **Khối việc đó thuộc về cây `mpo-design-off` đã bị loại.** Cây đang chọn cố tình không đi con đường đó — nó đọc mock API của vendor chính là để khỏi phải dựng dữ liệu bằng tay, vì bản dựng tay làm trang lệch thầm lặng khỏi Mantis thật.
>
> Giữ lại mục 3 làm lịch sử để về sau truy được quyết định. **Không dùng nó làm danh sách việc còn nợ của cây đang chọn.** Hiện trạng thật của cây đang chọn nằm ở `docs/16-mpo-design-stage-1-status.md`.

### Stage 1 — Khởi tạo và làm sạch vendor source

Mục tiêu là dựng một baseline an toàn nhưng chưa thay đổi sản phẩm hoặc nội dung.

- Tạo `mpo-design` từ nguồn Mantis sạch trong staging riêng; không giải nén đè lên workspace root, `spa` hoặc target.
- Giữ đầy đủ page, route, navigation, dashboard, widget, application, form, table, chart, authentication demo, maintenance page, component demo, theme, responsive layout và interaction state.
- Loại bỏ GitHub PAT, credential, APM, telemetry, vendor `.env`, remote execution hook và script tải nội dung từ mạng trước khi chạy mã vendor.
- Thay dependency runtime bên ngoài bằng local fixture hoặc adapter mô phỏng tối thiểu để trang vẫn render và thể hiện đủ trạng thái.
- Thiết lập preview riêng tại `http://127.0.0.1:4323/`; không thay đổi legacy preview hoặc output production.
- Lập mới route/page inventory và security/external-request audit chỉ từ `mpo-design`.

Không thực hiện tại Stage 1:

- Không đổi thương hiệu sang Mphone.
- Không dịch hoặc viết lại product copy.
- Không thêm trang Mphone.
- Không xóa, hợp nhất hoặc thiết kế lại trang Mantis.

### Gate A — đóng lại như lịch sử của cây `-off`

**Quyết định 2026-09-02: Gate A không còn là điều kiện chặn của Pha B.**

Tiêu chí gốc, giữ nguyên văn để truy vết:

- Tất cả page và route Mantis đều tồn tại, truy cập được và giữ đúng hành vi gốc.
- Không có credential, telemetry, request ngoài dự kiến hoặc dependency vào tài khoản/dịch vụ bên ngoài.
- Không có runtime error hoặc console error.
- Formatting, ESLint, local build và quality checks liên quan đều đạt.
- Light/dark và desktop/390px không có page-level horizontal overflow.
- Route/page inventory và security audit mới đã được lưu làm evidence.

Tiêu chí thứ hai — không có dependency vào dịch vụ bên ngoài — là điều cây đang chọn **chủ động từ chối**, không phải chưa làm được. Giữ Gate A làm cổng chặn tức là đòi hỏi lại đúng thứ đã bị bác bỏ. Toàn bộ tiêu chí và bằng chứng thi hành của nó được đánh dấu là **lịch sử của `mpo-design-off`**, không tính là nợ kỹ thuật của cây đang chọn.

**Phần còn lại không mất đi, nhưng đổi vai.** Bốn việc sau không liên quan tới dựng mà liên quan tới khả năng truy lỗi khi dịch: render toàn bộ route, console, lint/build, và 390px light/dark. Chúng chuyển thành **ảnh chụp baseline ở §4.9**, chụp một lần trong L1 trên cây nguyên trạng, không cần nghiệm thu và không chặn ai.

**Pha B mở ngay khi L1 bắt đầu.**

## 4. Pha B — Mantis song ngữ, giữ nguyên trải nghiệm

### 4.1. Quy ước nguồn dịch và cấu trúc catalog

- Nội dung tiếng Anh của Mantis là nguồn nghĩa chuẩn cho toàn bộ quá trình biên soạn tiếng Việt.
- **Catalog của dự án không nằm trong `src/utils/locales/`.** Đó là đường dẫn vendor sở hữu và bản Mantis kế tiếp sẽ ghi đè. Catalog dự án đặt ở `src/locales-mphone/{en,vi}.json`; `src/components/Locales.jsx` hợp nhất catalog vendor với catalog dự án khi nạp, giữ nguyên 168 key navigation/breadcrumb mà component vendor đang tham chiếu.
- Tiếng Việt là catalog ngang hàng, không phải fallback hoặc bản dịch tạm thời, và là ngôn ngữ mặc định của ứng dụng.
- `fr`, `ro`, `zh` giữ nguyên như catalog demo của vendor và không được duy trì. Thứ tự hợp nhất khi nạp: catalog `en` của dự án làm nền, rồi catalog vendor của locale đang chọn, rồi catalog dự án của locale đó nếu có.
- Các catalog vendor hiện có như `fr.json` và `ro.json` chỉ được dùng để tham khảo cấu trúc kỹ thuật, cách tổ chức file và cơ chế nạp locale hiện tại của `react-intl`.
- Không dịch tiếng Việt từ tiếng Pháp, Romania hoặc một ngôn ngữ trung gian. Mọi quyết định về nghĩa phải đối chiếu nội dung tiếng Anh và ngữ cảnh thực tế trên trang Mantis.
- Khi phát hiện chuỗi hiển thị đang hardcode, tạo message key có tên theo miền chức năng và bổ sung nội dung hoàn chỉnh cho cả `en` và `vi` trong cùng change set.
- Không giới hạn phạm vi dịch ở các key đã tồn tại trong catalog vendor. Inventory phải bao phủ toàn bộ chuỗi người dùng nhìn thấy trong ứng dụng.
- Trong Pha B chỉ thay lớp nội dung và hạ tầng localization. Không thay route, bố cục, component, data model, interaction flow, branding hoặc nghiệp vụ Mantis. Ngoại lệ duy nhất, có ranh giới, là danh tính mẫu của vendor ở §4.8.
- Message key giữ nguyên quy ước ngữ nghĩa theo miền chức năng. **Không bao giờ dùng chuỗi tiếng Anh làm key** — cùng một chữ "Save" ở hai ngữ cảnh phải là hai key khác nhau để có hai bản dịch khác nhau.
- Cầu nối giữa vị trí trong source vendor và key ngữ nghĩa là `i18n/keymap.json` (§4.7). Mỗi chuỗi được localize phải có một mục keymap trong cùng change set; thiếu keymap thì change set chưa hoàn thành.

Mô hình đối chiếu bắt buộc:

```text
src/locales-mphone/en.json = nguồn nghĩa và danh mục key chuẩn của dự án
src/locales-mphone/vi.json = bản tiếng Việt đầy đủ, ngang hàng với en
src/utils/locales/*.json    = catalog vendor, chỉ đọc, không thêm key mới vào đây
i18n/keymap.json            = ánh xạ file vendor + chuỗi gốc -> message key
```

#### Khối lượng đo được (2026-09-02)

Số liệu dưới đây do `i18n:scan` đo bằng AST, cập nhật lần hai trong ngày 2026-09-02 sau khi extractor được bổ sung khả năng nhận diện chuỗi nằm trong thuộc tính object. Hai lần đo trước đều thiếu: bản regex đếm dôi ở JSX, bản AST đầu tiên mù hoàn toàn với mảng dữ liệu. Mọi ước lượng đợt phải dựa trên bộ số này.

| Hạng mục | Giá trị |
|---|---|
| Key trong catalog vendor | 168, chỉ gồm navigation và breadcrumb |
| File đã nối `react-intl` | 6 (`Breadcrumbs.jsx`, hai cặp `NavItem`/`NavGroup`, `NavCollapse.jsx`); `formatMessage` chưa dùng ở đâu |
| File nguồn js/jsx | 791 (672 jsx) |
| Vị trí chuỗi hiển thị | **5.043** |
| — thay thế được lúc build | 4.008 vị trí, 2.076 chuỗi khác nhau |
| — **cần quyết định từng ca** | 891 vị trí trong thuộc tính object ở cấp module |
| — đã vào keymap tính đến 2026-09-02 | 144 |
| Tham chiếu thuật ngữ `spa/src/locales/{en,vi}.json` | 1.275 key mỗi bên, chỉ đọc |

Phân bố phần thay thế được, theo vị trí: `pages/components-overview` 891, `sections/apps` 890, `sections/components-overview` 561, `pages/forms` 268, `sections/widget` 191, `sections/auth` 181, `pages/apps` 151, `sections/forms` 119.

Vậy Stage 2 không phải là dịch 168 key, mà là đưa hơn 2.000 chuỗi khác nhau vào hệ localization, cộng gần 900 vị trí phải quyết định riêng.

#### Nhóm 891 vị trí không thay thế được lúc build

Đây là chuỗi nằm trong thuộc tính object của mảng dữ liệu khai báo ở **cấp module**, ví dụ:

```js
const layouts = [
  { value: MenuOrientation.HORIZONTAL, label: 'Horizontal', img: horizontalLayout },
  { value: MenuOrientation.MINI_VERTICAL, label: 'Mini Drawer', img: miniMenu }
];
```

Plugin **từ chối thay thế** những vị trí này và ghi cảnh báo lúc build. Lý do: mảng được tính đúng một lần khi module nạp, nên lời gọi thay thế sẽ đóng băng ngôn ngữ nạp đầu tiên và không phản ứng khi người dùng đổi ngôn ngữ — một lỗi âm thầm, khó thấy hơn nhiều so với việc để nguyên tiếng Anh.

Cùng dạng chuỗi nhưng nằm **trong thân hàm** thì an toàn: nó được tính lại mỗi lần render, và plugin thay thế bình thường.

Mỗi ca cần một trong hai cách xử lý, quyết định khi đợt tương ứng chạy tới:

1. **Vá file vendor** để mảng được dựng lúc render thay vì lúc nạp module. Ghi vào `docs/vendor-patches.md`.
2. **Chấp nhận giữ tiếng Anh** khi chuỗi không đáng một patch — ví dụ nhãn kỹ thuật hoặc trang chỉ dùng trong UI Lab. Ghi vào danh sách ngoại lệ.

`i18n:scan` tách riêng nhóm này; `i18n:scan --frozen` liệt kê từng vị trí. Không được tính nhóm này là "đã phủ".

### 4.2. Điều kiện bắt đầu

**Cập nhật 2026-09-02: mọi điều kiện chặn đã được giải quyết. Pha B mở.**

| Điều kiện | Trạng thái |
|---|---|
| Cây target đã chốt | Xong — `mpo-design`, cổng 4323 |
| Năm quyết định ở §4.6 đã duyệt | Xong |
| Gate A được nghiệm thu | **Bỏ.** Gate A là việc dựng của cây `-off`; xem mục 3 |
| Baseline tiếng Anh đã chốt | Xong — cây vendor nguyên trạng chính là baseline |
| Bảng thuật ngữ có bản nháp | Thuộc phạm vi L1, không còn là điều kiện trước |

Hai ràng buộc còn hiệu lực trong suốt Pha B:

- Route, cấu trúc trang và hành vi Mantis được giữ ổn định.
- Một change set chỉ thuộc một loại. Không sửa baseline và dịch trong cùng một thay đổi.

### Stage 2 — Nền tảng localization

- Lập inventory toàn bộ chuỗi người dùng nhìn thấy, gồm navigation, breadcrumb, heading, description, button, menu, field label, placeholder, helper text, validation, table, filter, pagination, dialog, tooltip, notification, chart label, sample content, empty state, error state và accessibility label.
- Mỗi mục inventory phải ghi route hoặc nhóm route, tệp nguồn, chuỗi tiếng Anh, ngữ cảnh sử dụng, message key dự kiến và trạng thái chuyển đổi.
- Thiết lập shared localization cho toàn bộ ứng dụng trên nền `react-intl` hiện có.
- Duy trì hai catalog ngang hàng: `en` và `vi`.
- Đưa mọi user-visible string vào hệ localization: navigation, breadcrumb, heading, description, button, field, placeholder, validation, error, table, pagination, dialog, tooltip, notification, chart label, empty state và accessibility label.
- **Chuỗi không bị gỡ khỏi file vendor bằng tay.** Chúng được khai báo trong keymap và thay thế lúc build theo §4.7. File vendor trên đĩa giữ nguyên, trừ những trường hợp transform không xử lý được và đã ghi vào patch manifest.
- Chuẩn hóa message key theo miền chức năng, ví dụ `common.actions.save`, `auth.login.title` và `apps.invoice.status.paid`; tránh key phụ thuộc nguyên văn câu tiếng Anh.
- Dùng formatter của `react-intl` cho biến nội suy, số nhiều, số, ngày giờ, tiền tệ và dữ liệu phụ thuộc locale.
- Hoàn thiện language switcher cho `en` và `vi`, đồng thời lưu lựa chọn cục bộ mà không cần tài khoản hoặc dịch vụ bên ngoài.
- Thêm kiểm tra tự động cho catalog parity, giá trị trống, message key thiếu, raw message ID, fallback không hợp lệ và chuỗi hiển thị hardcode.

Thứ tự localization:

1. App shell, navigation, header, footer và route error.
2. Authentication và maintenance.
3. Dashboard và widget.
4. Applications.
5. Forms và tables.
6. Charts, maps và visualization.
7. Component demonstrations và các trang còn lại.

Việc chuyển chuỗi tiếng Anh vào catalog được thực hiện trước trong từng nhóm. Sau khi giao diện tiếng Anh của nhóm đó giữ nguyên nghĩa và hành vi baseline, mới biên soạn nội dung tiếng Việt cho chính nhóm đó.

### Stage 3 — Biên soạn tiếng Việt theo ngữ nghĩa Mantis

- Giữ nguyên mục đích của màn hình, thứ tự thông tin, CTA, interaction flow, component và trạng thái.
- Tiếng Việt phải tự nhiên, ngắn gọn và tương đương ý nghĩa tiếng Anh; không dịch từng từ nếu làm câu khó hiểu.
- Không đưa thuật ngữ hoặc nghiệp vụ Mphone vào một trang khi trang đó vẫn đang thể hiện use case Mantis. Thay danh tính mẫu theo §4.8 không phải là đưa nghiệp vụ Mphone vào.
- Chỉ điều chỉnh text và cách diễn đạt cần thiết để nội dung phù hợp, an toàn và không phá layout.
- Không thay đổi design, route, data model hoặc behavior trong đợt dịch.
- Mỗi message key phải có cả tiếng Việt và tiếng Anh hoàn chỉnh trong cùng thay đổi.

### Stage 4 — Kiểm thử trải nghiệm song ngữ (đã đóng)

Gate B1 đã được product owner chấp nhận ngày 2026-09-03. Ma trận trình duyệt tám tổ hợp từng dùng cho Gate B1 là bằng chứng lịch sử, không phải điều kiện hoàn thành lặp lại cho các thay đổi sau này.

Mặc định, AI dùng kiểm tra localization, static review, formatting, lint, build và các kiểm tra tự động liên quan. AI không bắt buộc mở hoặc điều khiển máy tính/trình duyệt, chụp ảnh, hay rà toàn bộ ngôn ngữ/theme/viewport. Chỉ thực hiện các việc đó khi product owner yêu cầu rõ hoặc khi cần chẩn đoán một lỗi giao diện cụ thể.

### 4.3. Các đợt triển khai và nghiệm thu

Mỗi đợt là một change set localization độc lập. Không trộn branding Mphone, thay đổi layout hoặc nghiệp vụ sản phẩm vào các đợt này.

| Đợt | Phạm vi | Kết quả bắt buộc |
|---|---|---|
| L1 | Inventory, nền tảng localization, `vi.json`, language switcher và kiểm tra tự động | Cơ chế `en`/`vi` hoạt động; catalog parity và các quality gate có thể chạy cục bộ |
| L2 | App shell, navigation, header, footer, route error, authentication và maintenance | Mọi luồng vào ứng dụng và trạng thái hệ thống có nội dung song ngữ đầy đủ |
| L3 | Dashboard và widgets | Tiêu đề, metric, chart, legend, tooltip, state và sample content đều dùng localization |
| L4 | Chat, Calendar và Kanban | Nội dung điều khiển, trạng thái, hội thoại mẫu và thao tác đều song ngữ mà không đổi hành vi |
| L5 | Customer, Invoice và E-commerce | Form, bảng, bộ lọc, trạng thái nghiệp vụ và validation đều song ngữ |
| L6 | Forms, Tables, Charts và Maps | Toàn bộ demonstration text, accessibility label và state được đưa vào catalog |
| L7 | Component Catalog | Tên component, mô tả, ví dụ và trạng thái tương tác đều song ngữ |
| L8 | Landing, extra pages, Prompt Explorer và rà soát toàn cục | Đóng mọi khoảng trống inventory và chuẩn bị evidence cho Gate B1 |

Sau mỗi đợt, chạy formatting, ESLint, local build, kiểm tra catalog và các kiểm tra tự động liên quan. Preview hoặc visual inspection chỉ dùng khi được yêu cầu rõ hoặc hữu ích cho chẩn đoán có mục tiêu; không phải điều kiện đóng đợt.

Bảng trên chia đợt theo miền chức năng, không theo khối lượng. Theo số đo ở §4.1, riêng L7 chiếm khoảng 49% tổng số chuỗi, nhiều hơn L2–L6 cộng lại.

**L7 được hoãn ra sau Gate B1 — product owner quyết ngày 2026-09-02.** Component Catalog không chặn Pha C. Theo số đo AST, nó chiếm 1.350 trong 3.872 vị trí (35%) — không lớn hơn L2–L6 cộng lại như ước lượng ban đầu tưởng, nhưng vẫn là khối đơn lẻ lớn nhất và nằm trên những trang khách hàng không thấy. Khi triển khai, tách L7 thành các đợt con theo nhóm component — ví dụ inputs, data display, feedback, navigation, layout — để mỗi change set còn review được. Trong thời gian chưa dịch, Component Catalog giữ tiếng Anh và được ghi nhãn là bề mặt UI Lab. Chi tiết ở Gate B2.

### 4.4. Quản trị thuật ngữ và chất lượng bản dịch

- Trước L2, lập bảng thuật ngữ cốt lõi từ nội dung tiếng Anh, bao gồm thuật ngữ navigation, authentication, dashboard, customer, invoice, e-commerce, form, table, chart, component và maintenance.
- Mỗi thuật ngữ có bản tiếng Anh, bản tiếng Việt được duyệt, ngữ cảnh, ghi chú dùng/tránh và ví dụ khi cần.
- Ưu tiên tiếng Việt tự nhiên, ngắn gọn và phù hợp không gian giao diện; không dịch từng từ nếu làm thay đổi nghĩa hoặc khiến câu khó hiểu.
- Một thuật ngữ phải nhất quán giữa navigation, page title, field label, validation, tooltip và notification, trừ khi ngữ cảnh ngữ pháp thực sự yêu cầu cách diễn đạt khác.
- Không đưa thuật ngữ viễn thông, thương hiệu hoặc nội dung Mphone vào bản dịch baseline Mantis.
- Nếu câu tiếng Anh gốc mơ hồ, ghi lại quyết định trong inventory hoặc glossary; không tự thay đổi use case để làm câu dễ dịch hơn.
- Ngân sách độ dài: tiếng Việt thường dài hơn tiếng Anh 20–30%. Với header bảng, nút, chip, tab, badge và nhãn biểu đồ, chọn dạng ngắn ngay từ đầu. Nếu bản ngắn làm mất nghĩa, giữ nghĩa và ghi vấn đề layout vào inventory để xử lý riêng.
- Một chuỗi chỉ có một bản dịch trong glossary. Khi hai ngữ cảnh thực sự cần hai cách diễn đạt, tạo hai message key riêng thay vì dùng chung một key.

### 4.5. Checklist hoàn thành cho mỗi route

- Mọi chuỗi hiển thị đến từ shared localization và có đủ `en`/`vi`.
- Tiếng Anh giữ nguyên ý nghĩa baseline; tiếng Việt tự nhiên và tương đương ngữ nghĩa.
- Không có raw message ID, fallback sai ngôn ngữ hoặc chuỗi hardcode ngoài danh sách ngoại lệ kỹ thuật đã được duyệt.
- Responsive behavior, theme, keyboard, focus và các content/interaction state vẫn là mục tiêu thiết kế; dùng static review và kiểm tra tự động hiện có khi chúng liên quan tới thay đổi.
- Không đưa vào request ngoài dự kiến, lỗi runtime đã biết hoặc thay đổi hành vi Mantis có thể xác định bằng các kiểm tra liên quan.
- Formatting, ESLint, local build và kiểm tra catalog đều đạt.
- Kiểm tra ở chế độ dev hoặc đọc nội dung màn hình chỉ là bước chẩn đoán có mục tiêu khi có dấu hiệu lỗi; không phải lượt kiểm tra trình duyệt bắt buộc cho mọi route.
- Không còn `textTransform: 'capitalize'` tác động lên chuỗi hiển thị của route. Baseline có ~19 vị trí. Xử lý ở tầng theme MUI trước; chỉ những chỗ đặt inline trong `sx` mới sửa file và phải vào patch manifest. Tiếng Việt bị viết hoa từng từ là lỗi chặn.
- **Chuỗi hiển thị không được dùng làm định danh.** Nếu một nhãn vừa hiển thị vừa làm khoá object, khoá tra cứu hoặc vế so sánh `===`, thì dịch nó sẽ phá tra cứu một cách âm thầm. Đã xảy ra ở `SalesChart`, `AcquisitionChart` và `IncomeAreaChart`: trạng thái ẩn hiện series khoá theo `label`, nên ở tiếng Việt mọi series bị lọc hết và biểu đồ ném lỗi. `i18n:check` nay tự phát hiện lớp lỗi này; xác nhận rồi thì đặt `identifierChecked: true` trên entry.
- Mọi filter, sort, search hoặc so sánh chạy trên chuỗi hiển thị phải chạy trên chuỗi **đã được format**, không phải trên hằng số tiếng Anh. **Đính chính 2026-09-02:** bản trước của tài liệu này ghi rằng `Search.jsx:63` lọc theo message id. Sai. Nó lọc `child.title.toLowerCase()` trên `data/search-data.jsx` — một **bản sao tiếng Anh hardcode** của cây điều hướng, 38 nhãn. Hệ quả thật còn tệ hơn: sau khi dịch, sidebar nói tiếng Việt còn tìm kiếm chỉ khớp tiếng Anh. Đã sửa ở L2 bằng cách hoist mảng vào một hàm để nó dựng lại mỗi lần render.
- Ngày, giờ, số, tiền tệ hiển thị đúng theo locale đang chọn, gồm cả các chỗ dùng `date-fns` (~10 file, chưa nối locale `vi`) chứ không chỉ formatter của `react-intl`.

### 4.6. Các quyết định phải chốt trước L1

Năm điểm dưới đây chưa có trong kế hoạch và không thể quyết giữa đợt. **Cả năm đã được product owner quyết ngày 2026-09-02**; giữ lại nguyên văn để về sau còn truy được lý do.

1. **Locale mặc định.** **Đã quyết 2026-09-02: tiếng Việt.** `src/config.js` đổi `i18n` thành `'vi'`. Tiếng Anh vẫn là nguồn nghĩa và catalog key chuẩn, và vẫn là `defaultLocale` của `IntlProvider`.
2. **Giữ hay bỏ `fr`, `ro`, `zh`.** **Đã quyết 2026-09-02: giữ.** Ba locale này là **catalog demo của vendor, không được duy trì**: dự án không thêm key mới cho chúng và không dịch sang chúng. Hai hệ quả bắt buộc xử lý trong L1:
   - `i18n:check` chỉ áp parity cho cặp `en`/`vi`. `fr`, `ro`, `zh` chỉ được báo cáo tham khảo, không chặn gate.
   - `Locales.jsx` phải nạp theo thứ tự hợp nhất **catalog `en` của dự án → catalog vendor của locale đang chọn → catalog dự án của locale đang chọn nếu có**. Nếu không có lớp `en` làm nền, người chọn tiếng Pháp sẽ thấy raw message id trên mọi key mới — đúng thứ mà §4.5 cấm.
3. **Quy ước key cho Component Catalog.** **Đã quyết 2026-09-02: hai tầng, cách ly khỏi bề mặt sản phẩm.**
   - `components.common.<nhóm>.<giá trị>` cho từ vựng design system lặp lại — variant, size, color, state. Đo bằng AST: 176 chuỗi loại này, phủ 798 trong 1.350 vị trí của catalog (59%). Một key một bản dịch: ở đây nhất quán là yêu cầu, không phải đánh đổi.
   - `components.<tên component>.<mục đích>` cho nội dung riêng của từng trang — 552 chuỗi chỉ xuất hiện một lần.
   - **Không dùng chung key với `common.*` hay bất kỳ không gian tên nào của bề mặt sản phẩm**, kể cả với 81 chuỗi trùng nhau (27% vị trí của catalog). Catalog bị hoãn sau Gate B1, nên nó không được phép kéo giãn những key đã nghiệm thu cùng bản dịch sản phẩm.
   - Tổng cộng 728 key cho 1.350 vị trí.
4. **Component Catalog có bắt buộc đạt Gate B không.** ~~Chưa quyết.~~ **Đã quyết 2026-09-02: không.** Gate B tách thành B1 cho các bề mặt sản phẩm và B2 cho Component Catalog; Pha C bắt đầu sau B1. Ngoại lệ này được ghi nhận tại Gate B2. Số đo AST sau đó hạ tỷ trọng của catalog từ 49% xuống 35%; quyết định vẫn giữ, vì lý do chính là *ai nhìn thấy những trang đó*, không phải riêng khối lượng.
5. **Bộ công cụ i18n.** **Đã quyết 2026-09-02 theo §4.7:** định dạng keymap, plugin thay thế lúc build, cùng bốn lệnh `i18n:extract`, `i18n:diff`, `i18n:check`, `i18n:scan`. Bộ script của migration bị loại đã bị xóa cùng cây `mto` và không được kế thừa; viết mới trong L1.

Checklist khởi động chi tiết cho L1 nằm ở `docs/18-l1-startup-checklist.vi.md`.

### 4.7. Kiến trúc localization và đường nâng cấp Mantis

Chốt ngày 2026-09-02, thay cho phương án bóc chuỗi thủ công. Hai ràng buộc phải cùng đạt: **bản dịch đúng ngữ cảnh và ổn định qua các bản Mantis**, và **diff so với vendor phải đủ nhỏ để nâng cấp được**. Cách làm dưới đây đạt cả hai; bóc chuỗi thủ công chỉ đạt cái thứ nhất và làm diff phình từ 4 file lên khoảng 670 trên 1.113 file `src`.

#### Nguyên tắc: keymap là hợp đồng, thay thế xảy ra lúc build

**1. `i18n/keymap.json` là tài sản trung tâm.** Mỗi mục mô tả một vị trí chuỗi cụ thể trong source vendor và key ngữ nghĩa gán cho nó:

```json
{
  "file": "src/sections/apps/e-commerce/checkout/AddressCard.jsx",
  "occurrence": "prop:label",
  "source": "Save",
  "key": "apps.ecommerce.checkout.actions.saveAddress",
  "kind": "message",
  "context": "Nút xác nhận lưu địa chỉ giao hàng ở bước Checkout",
  "routes": ["/apps/e-commerce/checkout"],
  "role": "button",
  "maxLength": 16
}
```

Key vẫn là key ngữ nghĩa theo §4.1. Keymap chỉ là cầu nối giữa vị trí trong source và key — nó không phải từ điển tiếng Anh.

**2. Cùng một chuỗi ở hai ngữ cảnh là hai key.** Đây là lý do thiết kế này được chọn thay vì một từ điển toàn cục theo chuỗi tiếng Anh. "Save" trong Checkout, trong Settings và trong trình soạn thảo có thể cần ba cách nói khác nhau; keymap cho phép điều đó, từ điển toàn cục thì không.

**3. Thay thế lúc build, không sửa file vendor.** Một Vite plugin thay đúng những vị trí có trong keymap khi compile. Plugin **không đoán**: chuỗi nào không có mục keymap thì không bị đụng đến. Nhờ vậy nó tất định, kiểm toán được, và file vendor trên đĩa giữ nguyên byte.

**4. Máy đề xuất, người quyết.** `i18n:extract` quét source và đề xuất ứng viên kèm file, route, vai trò và đoạn code xung quanh. Người gán key, viết `context`, đặt `maxLength` khi cần, rồi dịch. Chất lượng ngữ cảnh nằm ở bước duyệt này, không nằm ở heuristic.

#### Các loại vị trí mà keymap gọi tên

`occurrence` cho biết vị trí ấy nằm ở đâu trong cú pháp, và quyết định plugin thay thế bằng hình thức nào. Danh sách này lớn dần theo từng đợt — mỗi lần thêm một loại là một lần **bộ công cụ vừa báo phủ 100% trong khi màn hình vẫn ra tiếng Anh**. Đó là lý do quy tắc kiểm chứng của dự án là đọc chữ đã render, không đọc con số phủ.

| `occurrence` | Nằm ở đâu | Hình thức thay thế |
|---|---|---|
| `text` | JSX text | bọc trong `{...}` |
| `expr` | `{'chuỗi'}` trong thân JSX | bọc trong `{...}` |
| `prop:<tên>` | thuộc tính JSX là chuỗi | bọc trong `{...}` |
| `cond` | nhánh chuỗi của toán tử ba ngôi trong thân JSX | thay tại chỗ, **không** bọc |
| `cond:<tên>` | nhánh chuỗi của toán tử ba ngôi trong thuộc tính JSX | thay tại chỗ, **không** bọc |
| `obj:<tên>` | giá trị thuộc tính object | thay tại chỗ, **không** bọc |
| `arr` | phần tử của mảng chuỗi thuần | thay tại chỗ, **không** bọc |
| `assign:<tên>` | gán chuỗi cho biến sẽ được render | thay tại chỗ, **không** bọc |
| `call:<hàm>` | đối số chuỗi của hàm dựng dữ liệu đã chọn tham gia | thay tại chỗ, **không** bọc |

Bốn loại cuối cùng nằm ở **vị trí biểu thức** — chúng đã ở trong ngữ cảnh biểu thức sẵn, nên bọc thêm `{...}` là lỗi cú pháp (`message: {__t(...)}`). Plugin phân biệt bằng một hàm duy nhất, `isExpressionPosition`.

Ba loại có cổng chọn tham gia, vì chúng dễ bắt nhầm giá trị kỹ thuật:

- `arr` — mảng chuỗi thuần thường là dấu thời gian hoặc token enum. Người duyệt chọn từng mảng; mảng đã xem và cố ý không dịch ghi vào `i18n/array-exceptions.json` kèm lý do.
- `call:<hàm>` — hàm dựng dữ liệu mẫu được chọn tham gia **theo tên, kèm lý do**, trong `i18n/call-arguments.json`. Chỉ chọn sau khi đã kiểm rằng không đối số chuỗi nào của nó được dùng làm khóa tra cứu.
- `assign:<tên>` — chỉ nhận khi biến ấy thực sự xuất hiện bên trong một biểu thức JSX của cùng file.

Hai loại `tpl` biến `` `${selected} row(s) selected` `` thành **một câu với đối số ICU có tên** — `{selected} row(s) selected` — chứ không phải hai mảnh mà người dịch không đảo được trật tự. Ba luật lọc đi kèm: phần chữ tĩnh phải có ít nhất hai chữ cái (nếu không `${percentage}%` cũng thành câu cần dịch); phần chữ tĩnh chỉ là phần mở rộng tệp thì loại; và **dấu nháy đơn đứng trước `{` phải nhân đôi**, vì trong ICU nó mở một đoạn trích dẫn và `Category '{category}'` sẽ in ra đúng chữ `{category}` thay vì thay giá trị.

Hai loại tệp bị **bỏ qua hoàn toàn**, vì chuỗi trong đó trông như chữ hiển thị mà không phải:

- `i18n/id-files.json` — chuỗi là **message id**. `title: 'level 1'` trong định nghĩa menu là đối số của `<FormattedMessage id={...} />`; dịch nó trong source không dịch được gì, nó phá phép tra cứu và đẩy id thô lên màn hình.
- `i18n/data-files.json` — chuỗi là **dữ liệu tham chiếu hoặc dữ liệu mẫu**: danh mục quốc gia, danh mục phim, tọa độ địa lý, danh mục tiền tệ. Việt hóa những thứ này là quyết định dữ liệu ở giai đoạn sản phẩm, và làm sai một dòng là lỗi dữ liệu chứ không phải lỗi chữ. Tệp này cũng nhận một loại thứ ba: **chuỗi nuôi state khởi tạo**. Một object đưa vào `useReducer` hay vào store chỉ được dựng một lần mỗi lần mount, nên phép hoist không cứu được nó — đó là giới hạn thật của kiến trúc thay-thế-lúc-build. Chuỗi như vậy hoặc là nội dung của chính dự án và viết thẳng trong tệp, hoặc được ghi nhận là giữ nguyên.

**Vị trí ở cấp module không thay thế được.** Một thuộc tính object, một phần tử mảng hay một đối số hàm nằm ngoài mọi thân hàm chỉ chạy một lần lúc import: nó sẽ đóng băng ngôn ngữ nạp đầu tiên và không phản ứng với việc đổi ngôn ngữ. Plugin **từ chối** thay những vị trí đó và cảnh báo. Cách chữa là phép hoist — `const x = [...]` thành `const getX = () => [...]`, gọi tại nơi dùng — và mọi phép hoist đều ghi trong `docs/vendor-patches.md`. Khi vị trí nằm trong một object nuôi state khởi tạo (`useReducer`), hoist cũng không cứu được: state chỉ dựng một lần mỗi lần mount. Trường hợp đó chuỗi phải là nội dung của chính dự án và được viết thẳng, hoặc phải chấp nhận giữ nguyên.

#### Khi bản Mantis mới về

Giải nén cây vendor mới, chạy `i18n:diff`, đọc báo cáo bốn phần:

| Trường hợp | Nghĩa | Xử lý |
|---|---|---|
| Khớp nguyên vẹn | File còn, chuỗi còn nguyên văn | Áp tự động, bản dịch dùng lại |
| Đổi lời | File còn, vendor sửa câu tiếng Anh | Key giữ nguyên, duyệt lại bản dịch nếu nghĩa đổi |
| Đổi chỗ | Chuỗi còn, file đổi tên hoặc di chuyển | Cập nhật `file` trong keymap, bản dịch giữ nguyên |
| Biến mất | Không còn trong cây mới | Lưu trữ, không xóa khỏi lịch sử |

Bản dịch bám vào key chứ không bám vào file đã sửa, nên một lần vendor đổi lời là **một dòng trong báo cáo**, không phải một xung đột merge. Đó là điểm khiến thiết kế này ổn định hơn cả phương án bóc tay.

#### Bốn quy tắc bắt buộc

1. **Không format lại file vendor.** Một lần Prettier hoặc `eslint --fix` lên cây vendor phá hỏng mọi khả năng đối chiếu. Cách chặn đã dựng ở L1 **không phải** `.prettierignore` — ignore cả `src/` sẽ làm mù luôn linter trên chính các file mình vá, và gitignore không cho phép mở lại một file nằm trong thư mục đã loại. Thay vào đó: **lệnh ghi bị thu hẹp phạm vi, lệnh kiểm tra thì không.** `npm run prettier` và `npm run lint:fix` chỉ chạy trên các đường dẫn dự án sở hữu cùng những file đã có trong patch manifest; `npm run lint` và `npm run prettier:check` vẫn quét toàn bộ `src`. Không bao giờ chạy `prettier --write` hay `eslint --fix` với glob rộng `src/**`.
2. **Giữ cây vendor nguyên bản của từng phiên bản.** `.tools/mto-stage-20260902/full-version` là bản 4.2.0 nguyên gốc — không xóa. Mỗi phiên bản mới thêm một cây tương tự.
3. **Catalog và tài sản Mphone nằm ngoài đường dẫn vendor sở hữu** (§4.1).
4. **Mọi file vendor buộc phải sửa đều ghi vào `docs/vendor-patches.md`**: file, lý do, cách áp lại. Hiện có sáu mục — `src/App.jsx`, `src/contexts/JWTContext.jsx`, `src/pages/dashboard/analytics.jsx`, `src/utils/axios.js`, `src/utils/offline-cache.js` (thêm mới), `PageViews.jsx` → `TopPagesCard.jsx` (đổi tên) — cộng `package.json`.

#### Phần transform không xử lý được

Ước lượng 5–15% chuỗi: chuỗi ghép lúc chạy, dữ liệu demo trong mảng, cấu hình chart, dạng số nhiều. Những chỗ này thành patch thật trên đĩa và phải vào manifest. Trước khi sửa file, luôn hỏi liệu có cách làm ở tầng cao hơn không — ví dụ `textTransform: 'capitalize'` nên xử lý bằng override trong theme MUI thay vì sửa từng file, chỉ những chỗ đặt inline trong `sx` mới cần patch.

#### Giới hạn phải chấp nhận

- Source trong trình duyệt không khớp 1:1 với source trên đĩa. Bật source map và giữ phép thay thế thật mỏng.
- Plugin là hạng mục kỹ thuật thật, cần test riêng. Đổi lại nó tự động hóa 85–95% khối lượng và giữ diff ở mức một chữ số.
- Nếu về sau việc debug trở nên khó chịu, phương án dự phòng là sinh hẳn cây đã thay thế ra thư mục build và không track nó, thay vì thay lúc compile. Cùng keymap, cùng kết quả.

### 4.7b. Phạm vi Gate B2 — chốt 2026-09-03

Product owner chốt: **chỉ dịch phần khung của Component Catalog**, và làm sau khi Gate B1 được nghiệm thu.

### Đo được gì

| | Vị trí | Chuỗi phải dịch tay |
|---|---|---|
| Toàn bộ Catalog | 1.649 | 821 |
| **Chỉ phần khung** (`title`, `heading`, `caption`, `description`) | **381** | **239** |
| Dùng lại được khóa từ các đợt trước | 414 | — |

### Vì sao không dịch hết

Catalog là trang trưng bày component, và người đọc nó là **designer và lập trình viên đang tra cứu**. Ba nhóm chuỗi trong đó không phải chữ giao diện theo nghĩa thông thường:

- **Từ vựng API của MUI** — `outlined`, `contained`, `sm`/`md`/`lg`, `primary`/`secondary`: 159 vị trí. Đây đúng là tên giá trị prop trong tài liệu MUI. Dịch chúng làm trang tra cứu **khó dùng hơn**, vì người đọc mất đúng cái từ khóa họ cần đối chiếu.
- **Nội dung độn của bản demo** — `Card Title`, `Card Subtitle`, `Weight: Regular`, lorem ipsum: 68 vị trí. Chúng tồn tại để lấp chỗ, không mang nghĩa.
- **Tiêu đề thẻ demo lặp lại** — `Basic` xuất hiện 41 lần, `Default` 23 lần. Những cái này **thuộc phần khung** và được dịch.

Phần khung là thứ người ta dùng để **điều hướng** trong catalog: tên trang, tên thẻ demo, câu mô tả. Dịch đúng phần đó là đủ để một người Việt tìm được component mình cần, mà không làm hỏng giá trị tra cứu kỹ thuật của phần còn lại.

### Ghi để khỏi bàn lại

Đây là quyết định **phạm vi**, không phải sự bỏ sót. Phần không dịch sẽ được ghi vào `i18n/keep-english.json` hoặc `i18n/data-files.json` kèm lý do như mọi ngoại lệ khác, để `i18n:scan` sau khi xong B2 vẫn về 0 và con số đó vẫn có nghĩa.

### Đã thực thi — 2026-09-03

**323 mục keymap, 259 chuỗi phân biệt**: 183 dịch sang tiếng Việt, 76 giữ tiếng Anh kèm lý do trong `i18n/keep-english.json`. Chi tiết bằng chứng ở `docs/18`, mục "Trạng thái L7 / Gate B2".

Ba điều chốt thêm khi làm:

**1. Ranh giới "giữ nguyên tiếng Anh".** Chỉ ba nhóm được giữ: tên component của MUI/Mantis, tên biến thể typography (`Body 1`, `Overline`), và tên hoặc giá trị thuộc tính trong API (`outlined`, `filled`, `dense`, `indeterminate`). Chuỗi ghép nửa API nửa mô tả thì **dịch cả câu, giữ nguyên phần là định danh** — `Circular Determinate With Path` → `Circular Determinate có đường nền`. Tiêu chí: người đọc luôn nhìn thấy đúng từ khóa cần tra trong tài liệu MUI, nhưng không phải đọc một trang toàn tiếng Anh để tìm thẻ demo mình cần.

**2. Không dùng lại khóa xuyên miền.** Công cụ báo 20 chuỗi "dùng lại được khóa cũ"; rà tay thì 6 trong số đó sai ngữ cảnh (`Card` → `profile.payment.card` = "Thẻ" thanh toán; `Position` → `common.position` = "Chức vụ"). Đợt này đúc khóa `catalog.*` riêng cho cả 259 chuỗi. Quy tắc rút ra: **đề xuất dùng lại khóa của công cụ là gợi ý, không phải kết luận** — nó khớp theo từ tiếng Anh, còn §4.2 yêu cầu khóa theo ngữ nghĩa.

**3. Ngoại lệ phải ghim theo số.** Phần đệm còn lại của Catalog (1.385 vị trí) được ghi vào **`i18n/catalog-exceptions.json`**. Mỗi cây khai báo `expected`; `i18n:scan` in dòng `DRIFT` nếu số thực tế lệch. Một danh sách ngoại lệ theo cây mà không ghim số sẽ nuốt mất khoảng trống mới xuất hiện sau này, và con số 0 của `i18n:scan` sẽ mất nghĩa.

Sau đợt này `i18n:scan --scope src` cho **0 substitutable, 0 needs-decision, 0 array-elements** — lần đầu cả ba về 0.

### 4.8. Danh tính mẫu của vendor

**Quyết định 2026-09-02:** thay danh tính mẫu của vendor bằng dữ liệu mẫu Mphone **ngay trong Pha B**, thay vì chờ Stage 6.

Đây là một ngoại lệ có chủ ý của nguyên tắc tách pha ở §1, nên nó phải có ranh giới rõ và không được viện dẫn để làm branding sớm.

**Phạm vi được phép:** tên người, tên công ty, thương hiệu, email, số điện thoại, địa chỉ và dữ liệu mẫu thương mại nhận diện Mantis hoặc khách hàng hư cấu của nó. Đo được khoảng 94 vị trí chỉ riêng trong Component Catalog — `Natacha` 70 lần, `Jone Doe` 12, `Remy Sharp` 12 — và còn nữa ở các bề mặt khác. `AGENTS.md` vốn đã cấm giữ lại nhóm này.

**Không được phép:** đổi mục đích của trang, đưa thuật ngữ hoặc nghiệp vụ viễn thông vào, đổi layout, hay dựng kịch bản sản phẩm Mphone. Thay tên là thay tên. Một thẻ demo đang hiển thị `Natacha` trở thành một cái tên Việt Nam trung tính; nó không trở thành "cuộc gọi đến từ khách hàng".

**Quy tắc thay:**

- Một đổi một, cùng vai trò, cùng độ dài tương đương để không phá layout.
- Tên phải là hư cấu, trung tính, không nhạy cảm. Không dùng tên nhân viên hay khách hàng thật của Mphone. Email, số điện thoại và địa chỉ dùng dải dành cho tài liệu, không dùng dải thật.
- Dùng một bộ danh tính mẫu dùng chung cho toàn ứng dụng, không bịa tên mới ở từng trang.

**Cơ chế: keymap với `kind: "sampleIdentity"`.** Danh tính mẫu **không phải chuỗi cần dịch** — nó mang **một giá trị duy nhất dùng cho mọi locale**. Nếu đưa vào như message thường, giao diện tiếng Anh và tiếng Việt sẽ hiển thị hai con người khác nhau trên cùng một thẻ. Vì vậy:

- Mục `sampleIdentity` có một giá trị, áp cho tất cả locale kể cả `fr`, `ro`, `zh`.
- `i18n:check` miễn cho nhóm này luật parity và luật "bản dịch trùng nguyên văn tiếng Anh".
- `i18n:extract` phân loại riêng nhóm này để người duyệt thấy ngay, và Stage 6 rà lại một lần nữa.
- Không cần sửa file vendor: vẫn là phép thay thế lúc build như mọi mục keymap khác.

### 4.9. Ảnh chụp baseline

**Đây không phải cổng.** Không cần nghiệm thu, không chặn ai, không đòi cây phải sạch. Nó là một lần chụp hiện trạng cây nguyên trạng, làm trong L1.

Lý do tồn tại: từ L2 trở đi, mỗi đợt chạm tới hàng trăm vị trí chuỗi thông qua keymap. Khi một trang hỏng giữa đợt, câu hỏi đầu tiên luôn là *trước đó nó có chạy không*. Không có ảnh chụp thì mỗi lần như vậy phải dựng lại một cây sạch để đối chiếu — đắt hơn nhiều so với chụp đúng một lần.

Nội dung, chạy trên cây nguyên trạng trước khi có mục keymap nào:

- Danh sách route trong `docs/17-mpo-design-route-inventory.md` kèm kết quả render: bình thường, hay rơi vào error boundary.
- Console của từng route, ghi cả cảnh báo và lỗi vốn có của vendor.
- Kết quả Prettier, ESLint và `vite build`.
- Chiều rộng document đo ở 390px, và ảnh chụp light/dark cho các nhóm route chính.

Lưu vào `docs/` kèm ngày và tên cây. Khi một đợt dịch làm hỏng thứ gì, đối chiếu với ảnh chụp này trước khi đi tìm nguyên nhân.

**Ảnh chụp ghi nhận cả lỗi có sẵn.** Nó không yêu cầu sửa chúng — chỉ yêu cầu biết chúng tồn tại. Sửa hay không là quyết định riêng, thuộc change set riêng.

### Gate B1 — Bề mặt sản phẩm song ngữ

> **Đã được product owner nghiệm thu ngày 2026-09-03.** Product owner xác nhận đã kiểm chứng các bề mặt sản phẩm và cho phép ghi checkpoint Git, cập nhật tài liệu để bắt đầu Pha C. Kết quả kiểm tra máy tại thời điểm đóng: `i18n:check`, `i18n:diff`, ESLint, Prettier và production build đều đạt. Component Catalog vẫn thuộc Gate B2 và không nằm trong quyết định đóng B1 này.

Phạm vi: mọi route trừ Component Catalog (`/components-overview` và các trang con).

- 100% user-visible string trong phạm vi có cả `en` và `vi`.
- Không còn chuỗi hiển thị hardcode hoặc message key thiếu trong phạm vi.
- Mọi trang giữ nguyên ý nghĩa và trải nghiệm Mantis.
- Toàn bộ ma trận ngôn ngữ/theme/viewport đạt cho phạm vi.
- Keymap đầy đủ cho phạm vi, plugin thay thế lúc build chạy đúng, và `i18n:diff` trên cây vendor sạch không báo mục nào chưa xử lý.
- Product owner đã nghiệm thu.

**Điều kiện bắt đầu Pha C đã được đáp ứng từ ngày 2026-09-03.**

### Gate B2 — Component Catalog song ngữ

Ngoại lệ do product owner cấp ngày 2026-09-02: Component Catalog chiếm khoảng 49% khối lượng chuỗi trên những trang khách hàng Mphone không nhìn thấy, nên nó không chặn Pha C.

- L7 chạy sau Gate B1, song song với Pha C khi có nguồn lực.
- Trong thời gian chưa dịch, Component Catalog giữ tiếng Anh và được ghi nhãn là bề mặt UI Lab, không phải nội dung sản phẩm.
- Tiêu chí đóng B2 giống B1, giới hạn trong phạm vi Component Catalog.

## 5. Pha C — Sản phẩm và dịch vụ Mphone

### Stage 5 — Phân loại route Mantis cho Mphone

Chưa sửa hoặc xóa trang trong bước phân loại. Mỗi route được đưa vào một nhóm:

| Nhóm | Hướng xử lý |
|---|---|
| Giữ nguyên | Chỉ thay branding, nội dung và dữ liệu mẫu |
| Điều chỉnh | Giữ layout, đổi terminology và use case |
| Hợp nhất | Gộp vào trải nghiệm khác sau phê duyệt |
| Thiết kế lại | Xây UX riêng cho nghiệp vụ viễn thông |
| UI Lab only | Giữ để thử nghiệm component hoặc ý tưởng |
| Đề xuất loại bỏ | Chỉ xóa sau phê duyệt của product owner |

Mỗi quyết định phải ghi route hiện tại, ý nghĩa Mantis, nghiệp vụ Mphone tương ứng, dữ liệu mẫu, component tái sử dụng, ranh giới backend và trạng thái phê duyệt.

### Stage 6 — Mphone branding và product copy

- Áp dụng nhận diện Mphone sau khi bản đồ route được duyệt.
- Thay vendor identity và demo content bằng nội dung Mphone không nhạy cảm.
- Cập nhật tiếng Việt và tiếng Anh cùng lúc.
- Giữ mọi route discoverable trong thời gian chuyển đổi.
- Gắn nhãn rõ dữ liệu mẫu, mô phỏng, thử nghiệm hoặc chưa kết nối.
- Không để prototype tạo cảm giác đang dùng backend hoặc telephony thật.

### Stage 7 — Triển khai các bề mặt Mphone

**Quyết định điều hướng 2026-09-04:** giữ nguyên toàn bộ route Mantis hiện có. Các bề mặt Mphone sắp tới nằm trong namespace `/mphone/*` và dùng một cây sidebar riêng. Header dùng bộ chuyển `Mantis UI / Mphone Lab`. Hai bên là cùng một Portal shell — cùng layout, header, theme, localization, component và phiên mô phỏng; bộ chuyển chỉ thay cây sidebar được render theo namespace hiện tại, không tạo một giao diện thứ hai.

Thứ tự ưu tiên:

1. Portal shell và navigation.
2. Dashboard.
3. Cuộc gọi đang hoạt động.
4. Lịch sử và cuộc gọi nhỡ.
5. Danh bạ.
6. Ghi âm.
7. Báo cáo.
8. Cài đặt.
9. Tài khoản.
10. Bảng phân tích.
11. Webphone mô phỏng.
12. Chat.
13. App Phone prototype.
14. Living Design System.

Mỗi nhóm được triển khai thành một vertical slice hoàn chỉnh gồm content song ngữ, sample data, interaction states, responsive behavior, accessibility và các kiểm tra tự động liên quan.

### Gate C — Trải nghiệm sản phẩm Mphone

- Nội dung `vi` và `en` hoàn chỉnh, không còn vendor identity hoặc dữ liệu demo không phù hợp.
- Không có dữ liệu khách hàng thật hoặc kết nối backend/PBX/dịch vụ bên ngoài.
- Sample và simulation được ghi nhãn trung thực.
- Theme, responsive behavior, keyboard, focus và các content state được giữ đúng bằng static review và các kiểm tra tự động liên quan.
- Formatting, lint, build và các quality check không tương tác đều đạt.
- Việc hợp nhất, thiết kế lại hoặc xóa route đã được product owner phê duyệt.

## 6. Quản trị thực thi

- Mỗi stage có checklist và evidence riêng; không dùng evidence của stage khác để đóng gate.
- Mọi inventory, audit và test report phải ghi rõ được tạo từ `mpo-design`.
- Một change set chỉ thuộc một loại: baseline/security, localization infrastructure, Vietnamese translation, Mphone branding/content hoặc Mphone product implementation.
- Không triển khai trước công việc của pha sau khi gate hiện tại chưa được chấp nhận.
- Mỗi handoff phải báo ngắn gọn: phần đã hoàn thành, kiểm tra cục bộ, integration boundary và known issue nếu có. Chỉ nêu preview khi đã dùng nó trong tác vụ.
