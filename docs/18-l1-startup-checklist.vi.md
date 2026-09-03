# Checklist khởi động L1 — nền tảng localization

Lập ngày 2026-09-02. **Hạ tầng L1 đã triển khai và kiểm chứng cùng ngày** — xem mục trạng thái ngay dưới.

Tài liệu gốc là `docs/15-mpo-design-implementation-plan.vi.md` §4; `AGENTS.md` ở thư mục gốc vẫn là nguồn điều khiển cao nhất. Tài liệu này chỉ diễn giải điều kiện khởi động, phạm vi và tiêu chí hoàn thành cho riêng đợt L1. Nó không thay thế kế hoạch và không mở rộng phạm vi Pha B.

## Trạng thái L1 — 2026-09-02

**Hạ tầng đã chạy được đầu cuối và đã kiểm chứng trên bản build thật.**

Đã có: `i18n/keymap.json`; plugin thay thế lúc build; bốn lệnh `i18n:extract`, `i18n:diff`, `i18n:check`, `i18n:scan`; `src/i18n/runtime.js`; catalog `src/locales-mphone/{en,vi}.json`; `vi` là locale mặc định với lớp nền `en` cho các locale vendor; `docs/vendor-patches.md`; `docs/19-i18n-glossary.vi.md` gồm bảng thuật ngữ khởi tạo và bộ danh tính mẫu; các lệnh ghi đã bị thu hẹp phạm vi.

Lát cắt kiểm chứng: 5 trang maintenance, 19 vị trí, 17 key. Chọn maintenance vì nó nhỏ, khép kín và không phụ thuộc dữ liệu.

Bằng chứng:

| Kiểm tra | Kết quả |
|---|---|
| `i18n:check` | 0 lỗi, 0 cảnh báo |
| `i18n:scan --scope src/pages/maintenance` | 19/19 vị trí đã vào keymap, 0 còn sót |
| `i18n:diff` với cây vendor nguyên bản | 19 matched, 0 reworded/moved/vanished |
| ESLint toàn `src` + `scripts/i18n` | sạch |
| Prettier trên file dự án | sạch |
| `vite build` (chạy trong cloud container) | thành công, 10,8s |
| Render thật ba route × ba locale | `vi` ra tiếng Việt, `en` ra tiếng Anh, `fr` fallback tiếng Anh, **không lộ raw message id** |
| Diff `src/` so với cây vendor nguyên bản | 6 file sửa trên 1.113, cộng hai thư mục dự án mới |

**Ảnh chụp baseline đã chạy** — kết quả ở `docs/20-baseline-snapshot.md`: 81 route × 3 lượt (desktop light, desktop dark, 390px light). Không route nào lộ raw message id. Một route rơi error boundary, năm route tràn ngang ở 390px, mười route có console không phải lỗi mạng. Lưu ý: ảnh chụp thực hiện trong cloud container nên **không có mạng tới mock API của vendor** — đó đúng là trường hợp khởi động nguội mà §4.9 yêu cầu, nhưng còn nợ một lượt có mạng, chỉ chạy được trên máy của product owner.

Còn lại của L1: **lượt ảnh chụp có mạng**, và **ngoại lệ §2.5** cho ba sửa lỗi nền vẫn chờ product owner duyệt.

Lưu ý môi trường: `vite build` không chạy được trong VM Linux trên máy (rolldown thiếu binding Linux). Build và render được thực hiện trong cloud container theo đúng quy trình đã ghi.

## Trạng thái L8 — bước 2: dịch xong toàn bộ mặt sản phẩm, 2026-09-03

**Mọi vị trí thay thế được ngoài Component Catalog đã vào keymap: 0 còn lại.** Keymap **3.507 entry**, 2.060 key dự án. `i18n:check` 0 lỗi 0 cảnh báo, `i18n:diff` 3.489 matched / 0 reworded / 0 moved / 0 vanished, `vite build` 15,1s, ESLint và Prettier sạch.

### Đã dịch trong bước này

| Khu vực | Vị trí |
|---|---|
| `sections/apps/profiles` + `pages/apps/profiles` | 320 |
| `sections/landing` | 153 |
| `sections/widget` + `pages/widget` | 121 |
| `sections/ai` + `pages/prompts-overview` | 135 |
| `pages/faqs.jsx` | 55 |
| `pricing`, `contact-us`, `change-log`, `password-strength`, còn lại | 93 |

Thêm 25 phép hoist nữa, tất cả đã ghi trong `docs/vendor-patches.md`.

### Bốn điểm mù nữa, tìm ra bằng cách đọc màn hình chứ không đọc con số

Mỗi cái đều là **công cụ báo phủ 100% trong khi trang vẫn ra tiếng Anh**. Đây là lần thứ tư mô-típ này lặp lại, và nó là lý do quy tắc kiểm chứng của dự án không bao giờ được đổi thành "đọc báo cáo".

- **`obj:question` / `obj:answer`** — mười sáu câu hỏi của trang FAQ nằm giữa màn hình, và không luật nào nhìn thấy chúng. Lần đầu tôi thêm nhầm vào bộ thuộc tính JSX thay vì bộ thuộc tính object, extractor trả về 0 đề xuất, và nếu tin vào con số đó thì cả trang FAQ đã đi qua Gate B1 bằng tiếng Anh.
- **`prop:content`** — ba thẻ thống kê widget truyền chú thích phụ qua `content`.
- **`prop:defaultValue`** — giá trị điền sẵn trong biểu mẫu hồ sơ: tên, địa chỉ, đoạn giới thiệu.
- **Giới hạn 200 ký tự của `looksLikeDisplayString`** — nó nuốt mất đoạn giới thiệu 235 ký tự trên trang hồ sơ. Giới hạn là để chặn đoạn mã, không phải để chặn văn xuôi; nay đặt ở 700.

Cộng thêm **địa chỉ email**: mọi luật đều loại chúng (không hoa, không khoảng trắng), trong khi §4.8 nói rõ email mẫu của vendor phải được thay. 13 vị trí, nay dùng `example.com`.

### Lần thứ tư: chuỗi hiển thị kiêm khóa tra cứu

`categoryMetadata[category.name]` ở hai tệp, và `promptCategories.find((cat) => cat.name === categoryName)` ở tệp thứ ba. Dịch tên danh mục là mọi thẻ rơi về ảnh và mô tả mặc định, còn bảng giá thì rỗng — im lặng, không lỗi, không cảnh báo. Mỗi danh mục vốn đã có `slug`; đã đổi cả ba nơi sang khóa theo `slug`, và bỏ hẳn bảng `folderNameToCategory` vốn chỉ tồn tại để đi vòng từ slug sang nhãn rồi tra ngược lại bằng nhãn.

Ba lần trước: chuỗi series biểu đồ (L3), cột sắp xếp danh sách khách hàng (L6), `prompts` vừa là id vừa là chữ đếm (L8 bước 1).

### Hai quyết định phạm vi, ghi để không phải bàn lại

**Thư viện prompt AI không dịch.** `data/prompt-categories.js` (129 vị trí) cùng hai bộ đọc tệp prompt đã vào `i18n/data-files.json`. Hai lý do. Một, nội dung thật của thư viện là các tệp `.prompt.md` trên đĩa — prompt viết cho tác nhân lập trình, làm việc bằng tiếng Anh — nên dịch phần mô tả trong khi phần nội dung vẫn tiếng Anh là làm dở dang. Hai, `name` đang được dùng làm khóa tra cứu; muốn dịch được phải tái cấu trúc trình duyệt prompt, và đó là hạng mục riêng.

**Danh mục kỹ thuật và state khởi tạo cũng không dịch.** `api/invoice.js` (tiền tệ), `api/snackbar.js` (thông báo mặc định luôn bị ghi đè), `contexts/JWTContext.jsx` (phiên xem thử, đã viết thẳng tiếng Việt trong tệp). Điểm chung: chúng nuôi state khởi tạo, chỉ dựng một lần mỗi lần mount, nên **hoist không cứu được** — đây là giới hạn thật của kiến trúc thay-thế-lúc-build, không phải chỗ bị bỏ sót.

### Còn lại: chỉ Component Catalog

| | Vị trí |
|---|---|
| `pages/components-overview` | 908 |
| `sections/components-overview` | 633 |
| Cấp module trong Catalog | 108 |
| Phần tử mảng trong Catalog | 50 |
| **Tổng L7** | **1.699** |

Ngoài Catalog: **0**. Đây là điều kiện của **Gate B1**.

## Trạng thái L8 — bước 1: đóng ba nhóm mù, 2026-09-02

Product owner chốt: đóng ba nhóm mù trước, dịch sau. Lý do là bài học của L6 — dịch xong rồi mới phát hiện công cụ không nhìn thấy cả một loại vị trí thì phải quét lại toàn cây. Bước này không thêm bao nhiêu bản dịch; nó làm cho **con số tồn đọng trở thành số thật**.

### Nhóm mù 1 — slug breadcrumb: hoá ra không phải chuỗi hiển thị

Giả thiết ban đầu sai. `breadcrumbTitle = 'backlogs'`, `{ title: 'home' }` **không phải chữ hiển thị** — `Breadcrumbs` đưa thẳng chúng vào `<FormattedMessage id={...} />`. Chúng là **message id**. Dịch chúng trong source không dịch được gì; nó phá phép tra cứu và đẩy một id thô lên màn hình.

Cho đến giờ chúng vô hình với bộ bóc chuỗi chỉ vì luật `looksLikeDisplayString` loại từ đơn viết thường — một sự **may mắn, không phải một quyết định**. Ba id nhiều từ (`level 1`, `level 2`, `level 3` trong `menu-items/other.js`) thì lọt qua luật đó và sẵn sàng bị dịch nhầm ở đợt sau.

Đã đổi may mắn thành quyết định: `i18n/id-files.json` liệt kê những đường dẫn mà chuỗi là id chứ không phải chữ, kèm lý do và tên thứ tiêu thụ chúng. Hiện có một mục, `src/menu-items`, che 11 tệp và 12 vị trí từng nằm nhầm trong nhóm "cần quyết định".

**Lỗi thật tìm được ở đây:** `vi['backlogs']` = `'Backlog'`. Bản dịch tiếng Việt là chính từ tiếng Anh, và không luật nào bắt được vì luật cũ chỉ so khớp **tuyệt đối** với catalog `en` — mà vendor viết `Backlogs` số nhiều, bản "dịch" viết `Backlog` số ít. Trang `/apps/kanban/backlogs` hiện chữ `Backlog` suốt từ đó tới nay. Đã sửa thành `Tồn đọng`.

### Hai luật kiểm mới, sinh ra từ chính lỗi đó

- **`vi` là từ tiếng Anh khoác hoa thường hoặc số nhiều khác.** So khớp sau khi chuẩn hoá. Bắt được `backlogs`, và 14 trường hợp còn lại đều là quyết định thật — `Widget`, `Plugin`, `Tab`, `Prompt`, `IPv4`, `reCaptcha`, `User story` — nay đã nằm trong `i18n/keep-english.json` kèm lý do, không còn là chỗ trống im lặng.
- **Chuỗi đã dịch trùng tên với một message id.** `prompts` vừa là id của menu vừa là chữ đếm "12 prompts" trên trang AI. Hai đường dùng độc lập, đã kiểm và đánh `identifierChecked: true`. Đây là lần thứ ba cùng một hình dạng lỗi xuất hiện — sau chuỗi series biểu đồ và cột sắp xếp khách hàng — nên nó xứng đáng có luật riêng.

### Nhóm mù 2 — chuỗi mẫu có nội suy

`` label={`${selected} row(s) selected`} `` trước đây vô hình hoàn toàn. Nay template literal ở vị trí hiển thị trở thành **một câu duy nhất với đối số ICU có tên**: `{selected} row(s) selected`, và plugin truyền giá trị ngược vào qua tham số thứ ba của `__t` — vốn đã có sẵn từ L1. Dịch được cả câu, và người dịch đảo được trật tự: `Đã chọn {selected} dòng`.

Ba luật lọc, mỗi luật sinh ra từ một thứ suýt bị dịch nhầm:

- Phần chữ tĩnh phải có ít nhất hai chữ cái, nếu không `${percentage}%` cũng thành "câu cần dịch".
- Phần chữ tĩnh chỉ là phần mở rộng tệp thì loại — `` `${code.toLowerCase()}.png` `` là tên tệp.
- **Dấu nháy đơn đứng trước `{` phải nhân đôi.** Trong ICU nó mở một đoạn trích dẫn, nên `Category '{category}' does not exist` sẽ in ra đúng chữ `{category}` thay vì thay giá trị. Đây là cái bẫy dễ mất cả buổi để tìm, và nó nằm ngay trong hai chuỗi đầu tiên gặp phải.

16 vị trí, dịch 15 (một cái thuộc Component Catalog). Kiểm chứng: `Đã chọn 1 dòng` ở tiếng Việt, `1 row(s) selected` ở tiếng Anh.

### Nhóm mù 3 — 666 thuộc tính cấp module và 182 phần tử mảng

Phân loại xong thì **425 trong số 666 hoá ra là dữ liệu, không phải giao diện**: `data/countries.js` 229 tên quốc gia, `data/movies.js` 99 tên phim, `data/location.js` 11 mục địa lý, `utils/mock-data.js` 23. Việt hóa một danh mục quốc gia là **quyết định dữ liệu ở giai đoạn sản phẩm**, và làm sai một dòng là lỗi dữ liệu chứ không phải lỗi chữ. Đã ghi vào `i18n/data-files.json` kèm lý do từng tệp và thứ tiêu thụ chúng.

Với mảng: 78 vị trí là nhãn tháng/thứ trên trục biểu đồ trang tổng quan — đúng quyết định giữ tiếng Anh đã chốt từ đợt trước, nay được ghi thành sáu mục ngoại lệ thay vì một sự im lặng.

### Con số thật sau khi đóng ba nhóm mù

| | Trước | Sau |
|---|---|---|
| Vị trí thay thế được, ngoài Component Catalog | 709 | **709** |
| Cần quyết định (cấp module), ngoài Catalog | 558 | **219** |
| Phần tử mảng, ngoài Catalog | ~134 | **~33** |
| **Tổng L8 còn lại** | ~1.400 | **~961** |

Trong 219 vị trí cần hoist, khối lớn nhất là `data/prompt-categories.js` (97) — thuộc mặt AI, sẽ làm cùng `sections/ai`.

Component Catalog (L7) không đổi: 899 + 583 vị trí thay thế được, cộng 108 cấp module và ~48 phần tử mảng. Vẫn là Gate B2, sau Gate B1.

## Trạng thái L6b — 2026-09-02 (sau khi product owner duyệt §2.5)

Hai việc do product owner báo, cả hai đều không phải lỗi dịch.

### 1. Từ vựng thời gian tiếng Việt

Yêu cầu: thứ, tháng, buổi phải có dạng đầy đủ và rút gọn đúng tiếng Việt — `Sun` → `CN`, `Mon` → `T2`, `AM` → `SA`, `PM` → `CH`.

date-fns có locale `vi`, nhưng nối nó vào là chưa đủ: `Thứ 2` chứ không phải `T2`, `tháng 09` chứ không phải `Tháng 9`, và `format(date, 'h:mm a')` trả về **`am`/`pm`** — tiếng Anh, giữa câu tiếng Việt, và không format string nào chữa được. Đã dựng một locale của dự án, `src/locales-mphone/date-locale-vi.js`, chỉ thay `localize` và giữ nguyên `match`. Bảng từ vựng và ba quyết định đi kèm nằm trong `docs/19-i18n-glossary.vi.md`.

Ba đường tiêu thụ, ba cách nối: `setDefaultOptions` trong `Locales.jsx` cho 11 tệp gọi `format()` trực tiếp; `MuiLocalizationProvider.defaultProps` trong theme cho 15 chỗ dùng date picker, kèm `localeText` tiếng Việt của MUI cho phần chữ của picker; và prop `locale` + `dayHeaderFormat` cho FullCalendar, vốn viết tên thứ qua `Intl` chứ không qua date-fns.

### 2. Giao diện lẫn hai ngôn ngữ khi chuyển locale

Product owner mô tả đúng hiện tượng: sidebar không sao, phần nội dung nhảy qua lại. Có **hai nguyên nhân độc lập**, và cả hai đều là lỗi kiến trúc chứ không phải chuỗi nào thiếu.

**Nguyên nhân một — một khung hình được commit với ngôn ngữ lệch nhau.** Catalog được nạp bằng `import()` động rồi `setState` trong `useEffect`. Nghĩa là khi đổi ngôn ngữ, `state.i18n` lật ngay ở render đầu tiên, còn catalog, singleton runtime mà `__t()` đọc, và date-fns thì vẫn là ngôn ngữ cũ — React commit đúng cái khung hình lệch đó lên màn hình, rồi mới sửa ở lượt sau. Đã chuyển sang **import tĩnh**: catalog dựng đồng bộ trong `useMemo`, `setRuntimeIntl` và `setDefaultOptions` gọi ngay trong đó, trước khi children render. Cả cú chuyển thành một lượt render duy nhất. Giá phải trả: khoảng 170 kB JSON nằm sẵn trong bundle 3 MB.

**Nguyên nhân hai — component giữ chữ đã dịch trong state.** Một component copy chuỗi đã dịch vào `useState` — options của biểu đồ, `rows` của bảng, nhãn của stepper — thì giữ nguyên ngôn ngữ cũ suốt thời gian còn mounted, và mảng phụ thuộc của `useEffect` gần như không bao giờ nhắc tới locale. Đây là lý do sidebar không lỗi mà nội dung thì lỗi: menu được dựng lại mỗi lần render, còn state thì không. Đã đặt `key={locale}` trên `IntlProvider`. Đổi ngôn ngữ là remount toàn bộ cây bên dưới, nên **cả lớp lỗi này biến mất một lần**, thay vì phải đi vá từng component và lại sót ở đợt sau. Router giữ state của chính nó nên route hiện tại không bị mất.

Kiểm chứng: script chuyển `vi` ↔ `en` **ba vòng** trên `/dashboard/default`, `/charts/apexchart`, `/tables/mui-table/enhanced`, `/forms/wizard`, `/apps/kanban/board`, `/apps/e-commerce/checkout`, `/apps/calendar`. Mỗi vòng đọc lại chữ trong `<main>`. Kết quả: bản tiếng Anh **không còn sót đoạn tiếng Việt nào**, và bản tiếng Việt sau mỗi vòng **khớp từng ký tự với lần render đầu tiên**.

### Phát hiện thêm, chưa xử lý

`Breadcrumbs custom` nhận tiêu đề dạng slug chữ thường — `breadcrumbTitle = 'backlogs'`, `{ title: 'home' }` — rồi component tự viết hoa để hiển thị. 79 vị trí trong 8 tệp, hiện đều vô hình với bộ bóc chuỗi vì luật `looksLikeDisplayString` loại từ đơn viết thường ngoài JSX text. Thấy rõ nhất ở `/apps/kanban/backlogs`, hiển thị `Backlog`. Trước khi dịch phải kiểm một điều: các slug này có đang được dùng để **tra cứu** trong cây menu hay không — nếu có thì đây lại là lỗi "chuỗi hiển thị kiêm khóa tra cứu" một lần nữa. Đưa vào L8.

## Trạng thái L6 — 2026-09-02

Biểu mẫu, bảng, biểu đồ và bản đồ đã vào keymap: `src/{pages,sections}/{forms,tables,charts,maps}` — **0 vị trí có thể thay thế nào còn ngoài keymap**. Phần còn sót là 37 vị trí mảng đã được ghi nhận cố ý không dịch trong `i18n/array-exceptions.json`.

Keymap **2.658 entry**, 1.502 key dự án, catalog `vi` 1.670 mục. `i18n:check` 0 lỗi 0 cảnh báo; `vite build` thành công (9,4s); render thật ở chế độ DEV cho toàn bộ tuyến L6.

### Bảy điểm mù của bộ bóc chuỗi, phát hiện bằng cách đọc màn hình

Đợt này gần như không phải là công việc dịch. Nó là công việc **tìm những chỗ bộ công cụ nói đã phủ 100% nhưng màn hình vẫn ra tiếng Anh**. Bảy loại vị trí dưới đây trước đó không một lệnh nào nhìn thấy; mỗi loại đã được bổ sung vào `scripts/i18n/lib.mjs` và quét lại trên toàn cây, nên các đợt L1–L5 cũng được vá theo.

| Loại vị trí | Ví dụ | Đã tìm thấy |
|---|---|---|
| `cond` — nhánh chuỗi của toán tử ba ngôi trong thân JSX | `{xong ? 'Place order' : 'Next'}` | 45 vị trí |
| `cond:<prop>` — toán tử ba ngôi trong thuộc tính JSX | `title={trên ? 'Pagination at Top' : ...}` | 34 vị trí |
| `obj:header` / `obj:footer` / `obj:headerName` | định nghĩa cột react-table và DataGrid | 221 vị trí, 23 chuỗi |
| `obj:role` | chức danh trong sơ đồ tổ chức | 12 vị trí |
| `assign:<tên>` — gán chuỗi cho biến sẽ được render | `title = 'Rejected';` trong `switch` | 8 vị trí |
| `call:<hàm>` — đối số chuỗi của hàm dựng dữ liệu mẫu | `createData(84564564, 'Camera Lens', 40, 2)` | 216 vị trí, 125 chuỗi |
| `prop:msg` | `<EmptyTable msg="No Data" />` | 3 vị trí |

Thêm hai lỗi thuộc về chính bộ công cụ:

**Thực thể HTML là khoảng trắng bị nuốt.** `&nbsp;` giải mã thành khoảng trắng nên `node.value.trim()` bỏ nó, trong khi `trimEnd()` trên chuỗi thô giữ nguyên sáu ký tự `&nbsp;` bên trong vùng thay thế. Kết quả trên màn hình: `bấm chọnbrowse`. Nay các thực thể khoảng trắng được cắt như khoảng trắng.

**Một từ viết thường trong JSX text bị coi là định danh.** Luật `/^[a-z0-9._-]+$/` loại bỏ `browse`, `prompts`, `invoices`, `here`, `and`, `or`, `now`, `ago` — 38 vị trí, đều là chữ người đọc nhìn thấy. Luật này vẫn giữ cho thuộc tính và giá trị CSS, nhưng JSX text theo định nghĩa là văn xuôi hiển thị nên được nới.

### Ba lỗi thật, không phải lỗi dịch

**1. Sắp xếp danh sách khách hàng gãy khi dịch.** `src/pages/apps/customer/card.jsx` so sánh `sortBy === 'Customer Name'` — tức so sánh **chữ hiển thị**. Dịch tiêu đề cột là phép so sánh không bao giờ khớp nữa, danh sách im lặng thôi sắp xếp. Cùng loại lỗi với vụ biểu đồ dashboard đã sửa ở L3. Đã cho mỗi cột một `key` ổn định và sắp xếp theo `key`; `renderValue` tra ngược ra tiêu đề để hiển thị.

**2. Một key gắn hai chuỗi gốc khác nhau.** Một lượt tái sử dụng tự động ở đợt trước đã gán `'Sort By'` và `'Sort by ('` chung key `apps.reused.sortBy`. Dấu ngoặc mở biến mất khỏi màn hình: `Sắp xếp theoMặc định)`. Đã tách key, và `i18n:check` nay **báo lỗi** khi một key gắn nhiều chuỗi gốc khác nhau — bỏ qua các biến thể chỉ khác hoa thường, vì `NAME` cạnh `Name` là cách vendor tạo kiểu chứ không phải hai chuỗi.

**3. Dev server phục vụ keymap cũ.** Plugin theo dõi `keymap.json` bằng sự kiện `change`. Một keymap bị thay nguyên file — khôi phục từ gói đồng bộ, hoặc do script seeding ghi lại — đến dưới dạng `unlink` + `add`, nên server vẫn dùng keymap đọc lúc khởi động **trong khi mọi trang trông vẫn như đã dịch xong**. Đây là cái bẫy nguy hiểm nhất trong ba lỗi, vì nó làm hỏng chính bước kiểm chứng. Đã theo dõi thêm `add`.

### Hai thay đổi có ảnh hưởng ngoài phạm vi L6

**Locale của MUI.** `src/themes/index.jsx` nay trộn `viVN` từ `@mui/material/locale` vào `themes.components` khi ngôn ngữ là `vi`. MUI tự viết một phần giao diện mà vendor không truyền chữ vào: `Rows per page:`, trạng thái rỗng của autocomplete, nhãn rating. Trộn sau khi gán `componentsOverride` vì phép gán đó thay cả object. `defaultProps` của vendor thắng ở mọi khóa vendor có đặt; `en` giữ mặc định của MUI.

**Phiên xem thử là nội dung của dự án, không phải của vendor.** `previewUser` trong `JWTContext.jsx` nuôi state khởi tạo của `useReducer`, chỉ chạy một lần mỗi lần mount, nên ràng buộc qua keymap sẽ đóng băng ngôn ngữ. Chữ được viết thẳng bằng tiếng Việt kèm chú thích lý do, và entry keymap tương ứng đã gỡ.

### Ngoại lệ đã ghi nhận trong đợt này

`i18n/array-exceptions.json` thêm năm mục: mốc thời gian ISO của biểu đồ vùng; nhãn tháng viết tắt của biểu đồ cột và biểu đồ đường (giữ tiếng Anh cho thống nhất với biểu đồ trang tổng quan đã chốt từ đợt trước); tên thương hiệu Vimeo/Messenger/Facebook/LinkedIn; danh sách tên công nghệ trong biểu mẫu tự động hoàn thành.

`i18n/call-arguments.json` là cơ chế mới, cùng hình dạng: một hàm dựng dữ liệu được **chọn tham gia theo tên, kèm lý do**, sau đó đối số chuỗi của nó mới trở thành ứng viên. Hiện có một mục: `createData`. Chỉ chọn tham gia sau khi đã kiểm rằng không đối số chuỗi nào được dùng làm khóa tra cứu.

### Còn nợ, đã đo, chưa làm

- **216 vị trí `call:` toàn cây, mới xử lý 96.** Phần còn lại nằm ở `src/sections/widget/data/*` (dữ liệu mẫu của trang Widget, thuộc L4) và `src/sections/apps/profiles/account/TabRole.jsx` — thuộc phần rà soát của L8.
- **Chuỗi mẫu có nội suy.** `` label={`${selected} row(s) selected`} `` và khoảng 50 chỗ tương tự. Runtime `__t(id, default, values)` đã nhận tham số, nên việc còn lại là chuyển `${x}` thành đối số ICU có tên — một hạng mục thiết kế riêng cho L8, không phải việc vá lặt vặt.
- **687 vị trí thuộc tính object ở cấp module** vẫn nằm trong nhóm "cần quyết định": mỗi vị trí cần một phép hoist hoặc một quyết định giữ nguyên.
- **10 vị trí `cond` và 15 vị trí một từ viết thường trong `src/sections/components-overview`** — thuộc L7, Component Catalog.
- **`src/data/location.js`**: tên quốc gia, thủ đô và thành phố trong tập dữ liệu địa lý của bản đồ. Là danh từ riêng trong tập dữ liệu, không phải chữ giao diện; đề xuất giữ nguyên, chờ product owner xác nhận ở Gate B1.
- **`Light` / `Dark` / `Streets`** trên trang bản đồ đến từ điều khiển của thư viện maplibre, không có trong mã nguồn.

### Giới hạn kiểm chứng

Kiểm chứng bằng cách **đọc chữ đã render ở chế độ DEV** trên từng tuyến L6, không dựa vào con số phủ. Các tuyến phụ thuộc mock API của vendor vẫn chỉ kết luận được trên máy product owner. Lỗi viết hoa từng chữ — `Tiếp Theo`, `Thêm Khách Hàng`, `Xem Dạng Danh Sách Tồn Đọng` — là ngoại lệ §2.5 `textTransform: 'capitalize'` **vẫn đang chờ product owner duyệt**; đây là bằng chứng sống mới nhất cho thấy nó cần được sửa ở cấp theme.

## Trạng thái L5 — 2026-09-02

Khách hàng, hóa đơn và thương mại điện tử đã vào keymap: sáu thư mục `src/sections/apps/{customer,invoice,e-commerce}` và `src/pages/apps/{customer,invoice,e-commerce}` — **0 vị trí ngoài keymap**. 594 vị trí, 307 chuỗi viết tay, mười patch hoist.

Keymap **1.767 entry**, 1.117 key dự án. `i18n:check` 0 lỗi 0 cảnh báo; `vite build` thành công; ESLint và Prettier sạch.

### Ba việc công cụ tự bắt được trong đợt này

**1. Ba file `export default` bị hoist sai.** `ColorOptions.js`, `PaymentOptions.js`, `SortOptions.js` xuất mặc định chính kết quả của mảng. Phép hoist máy móc biến chúng thành `export default getColorsOptions();` — **gọi ngay ở cấp module**, tức tái tạo đúng lỗi đóng băng ngôn ngữ vừa mới tránh. Đã sửa thành xuất chính hàm và gọi tại nơi dùng. Bài học: hoist không phải phép thay tên thuần túy, phải kiểm cả cách xuất.

**2. Luật định danh báo `Paid`/`Unpaid` ở `pages/apps/invoice/list.jsx`.** Kiểm ra: các phép so sánh trong file chạy trên mảng `groups` lấy từ dữ liệu API, không phải trên tiêu đề thẻ đã dịch. Hai công dụng độc lập, đã đánh `identifierChecked: true`.

**3. Extractor mù với phần tử mảng chuỗi thuần.** `const groups = ['All', 'Paid', ...]` không sinh ứng viên nào, nên `i18n:scan` lại báo phủ quá mức. Đã bổ sung nhận diện `arr`: toàn ứng dụng có thêm **247 vị trí** loại này, nâng tổng số đo từ 5.045 lên **5.292**. Chúng **không được đề xuất tự động** vì mảng chuỗi thường mang giá trị kỹ thuật (dấu thời gian, token enum); người duyệt chọn từng mảng. `i18n/array-exceptions.json` ghi những mảng đã xem và cố ý không dịch, kèm lý do — hiện có một mục: mã khuyến mại trong `CartDiscount.jsx`.

### Giới hạn kiểm chứng

`/apps/customer/customer-list` và `/apps/invoice/list` hiện màn hình lỗi ở **cả hai ngôn ngữ**: `Cannot read properties of undefined` khi đọc `length` và `map`. Route thứ nhất khớp đúng những gì ảnh chụp baseline đã ghi. Bằng chứng đủ mạnh để quy cho việc thiếu dữ liệu API trong container, không phải hồi quy do dịch — nhưng lượt kiểm chứng có mạng trên máy product owner mới là nơi kết luận chắc chắn.

## Trạng thái L4 — 2026-09-02

Chat, Lịch và Kanban đã đưa hết vào keymap: `src/sections/apps/chat`, `src/sections/apps/calendar`, `src/sections/apps/kanban`, `src/pages/apps/kanban`, `src/pages/apps/calendar.jsx` — **0 vị trí ngoài keymap**. 185 vị trí, 79 chuỗi viết tay. Một patch hoist nữa cho `calendar/Toolbar.jsx`.

Nhiều nhãn tiếp tục được nâng lên `common.*` vì dùng chung khắp nơi: `common.actions.{add,delete,copy,reply,forward,close,search}`, `common.{title,id,state,email,phone,address,other,information,startDate,endDate,comment,emptyList}`, `common.confirm.*`, `common.a11y.*`.

Keymap **1.173 entry**, 736 key dự án. `i18n:check` 0 lỗi 0 cảnh báo; `i18n:diff` 1.171 matched; ESLint và Prettier sạch; `vite build` thành công.

### Giới hạn kiểm chứng — nói rõ để không hiểu nhầm

**Không kiểm chứng được nội dung ba màn hình này trong cloud container.** Chat, Lịch và Kanban đều dựng hoàn toàn từ dữ liệu API; container không tới được mock API của vendor nên chỉ có vỏ ứng dụng render, phần thân trống. Chạy ở chế độ dev cả hai ngôn ngữ chỉ chứng minh được: không phát sinh lỗi ứng dụng mới, và bản build vẫn chạy.

`/apps/chat` báo lỗi ứng dụng ở **cả tiếng Việt lẫn tiếng Anh**, với đúng thông báo mà ảnh chụp baseline đã ghi: `Cannot read properties of undefined (reading 'filter')` tại `src/pages/apps/chat.jsx:56`. File đó có **0 entry keymap** — chưa hề bị đụng tới. Lỗi có sẵn do thiếu dữ liệu, không phải hồi quy do dịch. Đây đúng là công dụng của ảnh chụp baseline: quy trách nhiệm trong vài giây thay vì đi truy.

**Còn nợ:** một lượt kiểm chứng có mạng trên máy product owner, nơi mock API tới được. Đó là nơi duy nhất xác nhận được nội dung tiếng Việt của L4.

## Trạng thái L3 — HOÀN TẤT 2026-09-02

Dashboard và widget phủ **100%**: `src/pages/dashboard`, `src/sections/dashboard`, `src/pages/widget`, `src/sections/widget` — 369 vị trí, 216 chuỗi viết tay cộng phần dùng lại cách dịch đã chốt.

Bốn patch hoist nữa (`OrdersTable`, `OrdersList`, hai `SaleReportCard`) đưa vị trí cấp module trong phạm vi L3 về 0.

Nhiều nhãn được nâng lên không gian tên dùng chung vì chúng xuất hiện khắp ứng dụng: `common.status`, `common.price`, `common.date`, `common.name`, `common.period.*`, `common.time.*`. Các đợt sau nên dùng lại thay vì đặt key mới.

Keymap **988 entry**, 597 key dự án, 765 mục catalog `vi`. `i18n:check` 0 lỗi 0 cảnh báo. Kiểm chứng render 6 route × 2 ngôn ngữ: **0 raw message id**, không lỗi trang từ mã ứng dụng.

**`i18n:diff` học thêm một khái niệm.** Sáu mục bị báo "moved" hóa ra là hệ quả của patch đổi tên `PageViews.jsx` → `TopPagesCard.jsx`. Đã thêm trường `vendorFile` vào keymap để đối chiếu đúng đường dẫn phía vendor, và một dòng báo cáo `renamed` riêng — nhìn thấy được chứ không giấu đi.

## Trạng thái L2 — HOÀN TẤT 2026-09-02

Toàn bộ phạm vi L2 phủ **100%**, không còn vị trí nào ngoài keymap:

| Phạm vi | Trạng thái |
|---|---|
| 168 nhãn điều hướng/breadcrumb của vendor | Xong |
| `src/layout` — header, footer, drawer, hồ sơ, thông báo, tìm kiếm, tùy chỉnh, mega menu, workspace | Xong, 0 vị trí cấp module |
| `src/routes` — route error boundary | Xong |
| `src/sections/auth`, `src/pages/auth` — 5 nhà cung cấp xác thực | Xong |
| `src/components` — dropzone, bảng, chip, hỗ trợ, footer, prompt, mega menu | Xong, 0 vị trí cấp module |
| `src/pages/maintenance` | Xong từ L1 |

Keymap **619 entry**, 374 key dự án, 542 mục catalog `vi`. `i18n:check` 0 lỗi 0 cảnh báo; `i18n:diff` 617 matched + 2 mục dự án tự thêm; ESLint và Prettier sạch; `vite build` thành công.

Kiểm chứng bằng render trên 8 route × 2 ngôn ngữ: **0 lỗi trang, 0 raw message id**.

Tám patch hoist đã đưa toàn bộ vị trí cấp module trong phạm vi L2 về 0. Toàn ứng dụng còn 801 vị trí loại này, thuộc các đợt sau.

## Ghi chú quá trình L2 — 2026-09-02

**Đợt L2 đang chạy: vỏ ứng dụng, điều hướng, xác thực và route error.**

Tổng keymap **402 entry**, 189 key dự án, 357 mục catalog `vi`. Toàn ứng dụng: 5.045 vị trí, 402 đã vào keymap, 3.752 còn thay thế được, 891 cần quyết định từng ca.

Đã xong: `src/routes`, `src/sections/auth`, `src/pages/auth` phủ 100%. Còn lại của L2: `src/layout` 17 vị trí thay thế được và 71 vị trí cấp module; `src/components` 110 và 19.

**Đã thêm mục Tiếng Việt vào bộ chọn ngôn ngữ.** Trước đó `vi` là mặc định nhưng switcher chỉ có en/fr/ro/zh, nên ai đổi sang tiếng Anh thì không quay lại được. Đây là patch vendor thứ bảy, đã ghi vào `docs/vendor-patches.md`.

**Ba lỗi tìm ra nhờ render, không phải nhờ đọc code.** Cả ba đều lọt qua `i18n:check` và `i18n:scan` sạch:

1. *Extractor mù với thuộc tính object.* Bảng tùy chỉnh giao diện vẫn hiện `Default`, `Horizontal`, `Mini Drawer` bằng tiếng Anh trong khi scan báo phủ 100%. Đã sửa; số đo toàn ứng dụng tăng từ 3.872 lên hơn 5.000 vị trí.
2. *Plugin bọc `{}` cho cả thuộc tính object.* `message: {__t(...)}` không phải JS hợp lệ nên **build gãy**. Đã sửa: chỉ JSX mới cần dấu ngoặc.
3. *Sai vị trí cắt với JSXText chứa HTML entity.* `Don&apos;t have an account?` bị cắt giữa chừng, hiển thị thành `Chưa có tài khoản?ount?`. Nguyên nhân: `node.value` đã giải mã entity nên độ dài không khớp vùng nguồn. Đã sửa: tính vị trí từ chuỗi nguyên bản.

Bài học ghi lại: **kiểm chứng bằng cách render, không tin con số phủ.** Cả ba lỗi đều cho `0 error, 0 warning`.

**Vỏ ứng dụng đã hoàn tất.** `src/layout` phủ **100%**, không còn vị trí cấp module nào. Đạt được bằng bảy patch hoist: mảng dữ liệu khai báo ở cấp module được đưa vào một hàm để dựng lại mỗi lần render — `search-data`, `workspace-data`, `Notification/data`, `ThemeLayout`, `ThemeMenuDirection`, `Chat/index`, cùng ba file gọi chúng. Đây là mẫu xử lý chuẩn cho 891 vị trí cùng loại; sau L2 còn 820.

**Sửa một khiếm khuyết tôi từng ghi sai.** Tài liệu trước nói `Search.jsx:63` lọc theo message id. Thực tế nó lọc trên `data/search-data.jsx`, một bản sao tiếng Anh hardcode của cây điều hướng gồm 38 nhãn. Hệ quả thật tệ hơn điều đã ghi: sau khi dịch, sidebar tiếng Việt còn tìm kiếm chỉ khớp tiếng Anh. Sau khi hoist, kiểm chứng bằng render: giao diện tiếng Việt tìm "hóa đơn" ra bốn kết quả, tìm "invoice" ra "Không có kết quả"; tiếng Anh thì ngược lại.

**Luật chất lượng của `i18n:check` bắt được trùng lặp thật** — bốn cặp key cùng nghĩa (`Profile`, `All`, `Free`, `Pro`). Đã gộp thành `common.profile`, `shell.filters.all`, `common.tier.free`, `common.tier.pro` thay vì bỏ qua cảnh báo.

Keymap **490 entry**, 268 key dự án, 436 mục catalog `vi`.

**Bằng chứng cho ngoại lệ §2.5, mục `textTransform: 'capitalize'`.** Trang đăng nhập tiếng Việt hiện đang hiện `Đăng Nhập`, `Gửi Email Đặt Lại Mật Khẩu`, `Tiếp Tục` — viết hoa từng từ, sai chuẩn tiếng Việt. Đây không còn là dự đoán mà là lỗi quan sát được trên bản build. Vẫn chờ product owner duyệt ngoại lệ trước khi sửa.

### Kết quả các hạng mục

| Hạng mục | Kết quả |
|---|---|
| 168 nhãn điều hướng/breadcrumb của vendor | Đã dịch, nằm trong `src/locales-mphone/vi.json`. Không cần keymap vì vendor đã tự gọi `FormattedMessage` |
| `src/layout` — header, footer, drawer, hồ sơ, thông báo, tìm kiếm, tùy chỉnh giao diện, mega menu | 125 vị trí, 101 chuỗi, đã vào keymap và dịch xong |
| Kiểm chứng render | Sidebar và bảng tùy chỉnh ra đúng tiếng Việt; tiếng Anh giữ nguyên; tiếng Pháp lấy từ catalog vendor. Không lộ raw message id |
| `i18n:check` | 0 lỗi, 0 cảnh báo |
| `i18n:diff` | 144/144 matched |

Tổng keymap: 144 entry, 118 key dự án, 286 mục trong catalog `vi`.

**Phát hiện quan trọng trong lúc làm L2.** Bảng tùy chỉnh giao diện vẫn hiện `Default`, `Horizontal`, `Mini Drawer` bằng tiếng Anh trong khi `i18n:scan` báo `src/layout` đã phủ 100%. Nguyên nhân: những chuỗi đó nằm trong **thuộc tính object của mảng dữ liệu cấp module**, mà extractor lúc đó chỉ nhìn JSX nên không thấy. Công cụ đã được sửa để nhận diện chúng. Hệ quả:

- Số đo toàn ứng dụng tăng từ 3.872 lên **5.043 vị trí**.
- Trong đó **891 vị trí không thay thế được lúc build** và cần quyết định từng ca — xem `docs/15` §4.1.
- Plugin nay **từ chối** thay thế nhóm cấp module và cảnh báo lúc build, vì thay thế ở đó sẽ đóng băng ngôn ngữ nạp đầu tiên: một lỗi âm thầm, tệ hơn việc để nguyên tiếng Anh.
- `i18n:scan` tách riêng ba con số: đã vào keymap, thay thế được, và cần quyết định.

Riêng `src/layout` còn 17 vị trí thay thế được và 71 vị trí cấp module chờ xử lý.

## 0. Điều kiện chặn — đã giải quyết hết, L1 mở

| Mã | Hạng mục | Người quyết | Trạng thái |
|---|---|---|---|
| B1 | ~~Chốt cây target của Pha B~~ **Đã chốt 2026-09-02: `portal-worktree/app/portal/mpo-design`, cổng 4323, đọc mock API của Mantis** | Product owner | **Xong** |
| B2 | ~~Cập nhật `AGENTS.md`~~ **Xong 2026-09-02**: cổng 4323, mục Localization architecture, và ngoại lệ host ngoài kèm ranh giới | Nhóm thực hiện | **Xong** |
| B3 | ~~Nghiệm thu Gate A trên cây đang chọn~~ **Bỏ 2026-09-02.** Gate A là công việc dựng của cây `-off`. Phần còn dùng được chuyển thành ảnh chụp baseline trong L1 (§4.9), không phải cổng | Product owner | **Bỏ** |
| B4 | ~~Product owner nghiệm thu Gate A~~ **Bỏ 2026-09-02 cùng B3** | Product owner | **Bỏ** |
| B5 | ~~Duyệt năm quyết định ở mục 1~~ **Xong 2026-09-02: cả năm đã chốt** | Product owner | **Xong** |

**Không còn điều kiện chặn nào. L1 có thể mở ngay.** Gate A được viết cho việc dựng — thay dependency ngoài bằng local adapter, dựng fixture, loại mọi host ngoài — và toàn bộ khối đó thuộc cây `mpo-design-off` đã bị loại; cây đang chọn chủ động không đi con đường ấy. Phần vẫn có giá trị của Gate A không mất đi mà đổi vai: nó thành ảnh chụp baseline ở mục 2.6, làm trong L1, không cần nghiệm thu. Hiện trạng thật của cây đang chọn nằm ở `docs/16-mpo-design-stage-1-status.md`.

## 1. Năm quyết định — đã chốt cả năm ngày 2026-09-02

| # | Quyết định | Phương án đã cân nhắc | Kết quả | Ghi chú |
|---|---|---|---|---|
| 1 | ~~Locale mặc định~~ | — | **Đã quyết 2026-09-02: tiếng Việt.** `src/config.js` đặt `i18n: 'vi'`; `en` vẫn là nguồn nghĩa và `defaultLocale` của `IntlProvider` | — |
| 2 | ~~`fr`, `ro`, `zh`~~ | — | **Đã quyết 2026-09-02: giữ**, dưới dạng catalog demo của vendor không được duy trì. `i18n:check` chỉ áp parity cho `en`/`vi`; `Locales.jsx` phải có lớp nền `en` để locale vendor không lộ raw message id | — |
| 3 | ~~Quy ước key cho Component Catalog~~ | — | **Đã quyết 2026-09-02: hai tầng.** `components.common.*` cho 176 chuỗi từ vựng lặp (59% vị trí catalog), `components.<component>.*` cho 552 chuỗi riêng, không dùng chung với không gian tên sản phẩm. 728 key cho 1.350 vị trí | Số đo AST sau khi công cụ L1 chạy |
| 4 | ~~Phạm vi Gate B~~ | — | **Đã quyết 2026-09-02: tách Gate B thành B1 (bề mặt sản phẩm) và B2 (Component Catalog). L7 hoãn sau B1; Pha C bắt đầu sau B1.** | — |
| 5 | ~~Bộ công cụ i18n~~ | — | **Đã quyết 2026-09-02:** `i18n/keymap.json`, plugin thay thế lúc build, và bốn lệnh `i18n:extract`, `i18n:diff`, `i18n:check`, `i18n:scan` — chi tiết ở mục 2.2 | — |

Bộ script i18n của migration bị loại đã bị xóa cùng cây `mto` và **không được kế thừa**. L1 viết mới từ đầu.

## 2. Phạm vi của L1

### 2.1. Hạ tầng localization

- [x] Tạo `src/locales-mphone/{en,vi}.json`. **Không thêm key mới vào `src/utils/locales/`** — đó là đường dẫn vendor sở hữu và bản Mantis kế tiếp sẽ ghi đè.
- [x] Sửa `src/components/Locales.jsx` để hợp nhất catalog vendor với catalog dự án và bổ sung `vi`.
- [x] Đặt `i18n: 'vi'` trong `src/config.js`, giữ `defaultLocale="en"` ở `IntlProvider`.
- [x] Giữ đủ bốn ngôn ngữ trong switcher. Trong loader, hợp nhất theo thứ tự: catalog `en` của dự án → catalog vendor của locale đang chọn → catalog dự án của locale đó. Kiểm tra bằng cách chọn tiếng Pháp và xác nhận không có raw message id nào lộ ra.
- [ ] Lựa chọn ngôn ngữ được lưu cục bộ, không cần tài khoản hay dịch vụ ngoài; xác nhận key `localStorage` đang dùng và ghi lại tên key vào tài liệu.
- [ ] Không đổi route, layout, component, data model hay hành vi Mantis.

### 2.2. Keymap, plugin và bốn lệnh

Đây là hạ tầng của toàn bộ Pha B theo §4.7 của kế hoạch, và là phần bảo hiểm cho lần nâng cấp Mantis kế tiếp. Nó phải ra đời ngay ở L1, không phải bổ sung sau.

- [x] Chốt định dạng `i18n/keymap.json`: `file`, `occurrence` (text node hay tên prop), `source`, `key`, `kind` (`message` hoặc `sampleIdentity`), `context`, `routes`, `role`, `maxLength`.
- [x] Plugin Vite thay thế lúc build: chỉ thay đúng những vị trí có trong keymap, không đoán, không heuristic. Chuỗi không có mục keymap thì không bị đụng đến.
- [x] `i18n:extract` — quét source, đề xuất ứng viên kèm file, route, vai trò và đoạn code xung quanh, để người gán key và viết `context`. Đây là bước quyết định chất lượng ngữ cảnh. Phân loại riêng nhóm danh tính mẫu của vendor theo §4.8 của kế hoạch.
- [x] `i18n:diff` — so keymap với một cây vendor, xuất báo cáo bốn phần: khớp nguyên vẹn, đổi lời, đổi chỗ, biến mất.
- [x] `i18n:check` — parity `en`/`vi`, key thiếu, key thừa, giá trị trống, giá trị trùng nguyên văn tiếng Anh trong `vi`; chỉ áp parity cho cặp `en`/`vi`, `fr`/`ro`/`zh` chỉ báo cáo tham khảo. Thêm hai luật chất lượng: cảnh báo hai key cùng `source`, cùng `role`, cùng route (có thể nên gộp); và cảnh báo cùng `source` nhưng bản dịch khác nhau mà không có `context` giải thích. Miễn cả hai luật cho mục `kind: "sampleIdentity"`.
- [x] `i18n:scan` — phát hiện chuỗi hiển thị chưa vào keymap còn lọt ra giao diện, và raw message id.
- [x] Thu hẹp phạm vi các lệnh **ghi**: `prettier` và `lint:fix` chỉ chạy trên đường dẫn dự án sở hữu và file trong patch manifest. Các lệnh **kiểm tra** (`lint`, và `prettier:check` mới thêm) vẫn quét toàn bộ `src`. Không dùng `.prettierignore`: ignore cả `src/` sẽ làm mù linter trên chính các file mình vá.
- [x] Tạo `docs/vendor-patches.md` với sáu patch hiện có: `src/App.jsx`, `src/contexts/JWTContext.jsx`, `src/pages/dashboard/analytics.jsx`, `src/utils/axios.js`, `src/utils/offline-cache.js` (thêm mới), `PageViews.jsx` → `TopPagesCard.jsx` (đổi tên), cộng `package.json`.
- [ ] Ghi rõ ngưỡng chấp nhận của từng lệnh và danh sách ngoại lệ kỹ thuật được duyệt.
- [x] Cả bốn lệnh chạy được cục bộ, không cần mạng, không cần tài khoản.

### 2.3. Inventory chuỗi

- [ ] Mỗi mục ghi đủ: route hoặc nhóm route, tệp nguồn, chuỗi tiếng Anh, ngữ cảnh sử dụng, message key dự kiến, trạng thái chuyển đổi.
- [ ] Bao phủ đủ các loại nêu ở §4 Stage 2 của kế hoạch: navigation, breadcrumb, heading, description, button, menu, field label, placeholder, helper text, validation, table, filter, pagination, dialog, tooltip, notification, chart label, sample content, empty state, error state, accessibility label.
- [ ] Lưu thành tài liệu riêng trong `docs/`, ghi rõ được tạo từ cây target nào và ngày tạo.
- [ ] Đối chiếu thuật ngữ với `spa/src/locales/{en,vi}.json` (1.275 key, chỉ đọc, không sao chép).
- [ ] Đánh dấu riêng các mục là danh tính mẫu của vendor (tên người, công ty, email, số điện thoại, địa chỉ) để xử lý theo §4.8, không đưa vào luồng dịch.

### 2.4. Glossary và bộ danh tính mẫu

- [x] Bảng thuật ngữ cốt lõi, mỗi mục có: tiếng Anh, tiếng Việt được duyệt, ngữ cảnh, ghi chú dùng/tránh.
- [x] Bao phủ tối thiểu các nhóm navigation, authentication, dashboard, customer, invoice, e-commerce, form, table, chart, component, maintenance.
- [x] Ghi quy tắc ngân sách độ dài ở §4.4 của kế hoạch vào đầu bảng.
- [x] Lập một bộ danh tính mẫu dùng chung cho toàn ứng dụng theo §4.8: tên người, tên công ty, email, số điện thoại, địa chỉ — hư cấu, trung tính, không nhạy cảm, dùng dải dành cho tài liệu. Mỗi mục một giá trị duy nhất cho mọi locale. Không bịa tên mới ở từng trang.

### 2.6. Ảnh chụp baseline

Thay cho Gate A, theo §4.9 của kế hoạch. Chụp **trước** khi thêm mục keymap đầu tiên, trên cây nguyên trạng.

- [x] Render toàn bộ route trong `docs/17`, ghi route nào bình thường và route nào rơi vào error boundary.
- [x] Thu console từng route, ghi cả cảnh báo và lỗi vốn có của vendor.
- [x] Chạy Prettier, ESLint, `vite build` và lưu kết quả.
- [x] Đo chiều rộng document ở 390px; chụp light/dark cho các nhóm route chính.
- [x] Lưu vào `docs/` kèm ngày và tên cây.

Ảnh chụp **ghi nhận** lỗi có sẵn chứ không yêu cầu sửa. Sửa là quyết định riêng, change set riêng.

### 2.5. Ba sửa lỗi kỹ thuật nền

Ba mục này thuộc hạ tầng localization chứ không phải nội dung, nhưng chúng chạm vào style và logic component, nên **cần product owner xác nhận là ngoại lệ hợp lệ của quy tắc "chỉ thay lớp nội dung" ở §4.1**. Nếu không sửa ở L1, mọi đợt sau đều phải sửa lại cùng một lỗi. Ưu tiên xử lý ở tầng cao nhất có thể để không phải sửa file vendor.

- [x] ~~`textTransform: 'capitalize'` (~19 vị trí)~~ **Product owner duyệt 2026-09-02: tắt cho tiếng Việt, tiếng Anh giữ nguyên. Đã làm.** Ghi chú cũ ước lượng sai bản chất: đo trên cả 78 route ở locale `vi` cho thấy **25 nhãn nhiều từ bị viết hoa sai, tất cả đến từ đúng một dòng** — `button.textTransform` trong `src/themes/typography.js`. 19 vị trí `sx` inline hầu hết áp lên dữ liệu một từ (tên màu, `item.priority`, trạng thái từ API) nên không gây hại; chỉ hai nút `Need Help?` ở `pages/dashboard/default.jsx` và `sections/dashboard/analytics/TransactionHistory.jsx` là thật, và ở đó khai báo inline **thừa** — chuỗi tiếng Anh vốn đã title case — nên đã xóa, tiếng Anh không đổi một pixel. Sửa chính nằm trong `src/themes/index.jsx`, file đã có trong patch manifest: khi locale là `vi` thì `button.textTransform = 'none'`. Đo lại: **0 nhãn sai trên cả 78 route**.
- [x] ~~`Search.jsx:63` lọc theo message id~~ **Đính chính và đã sửa ở L2.** Nó lọc trên `data/search-data.jsx`, một bản sao tiếng Anh hardcode của cây điều hướng. Đã hoist mảng vào hàm; tìm kiếm giờ khớp đúng ngôn ngữ đang hiển thị, kiểm chứng bằng render.
- [x] ~~Nối locale `vi` cho `date-fns`~~ **Product owner duyệt 2026-09-02. Đã làm, không sửa file vendor nào.** Hai đường vào, vì có hai nhóm nơi gọi:
  - **Date picker của MUI** (15 chỗ dùng `LocalizationProvider`, không chỗ nào truyền `adapterLocale`): `LocalizationProvider` đọc default prop của theme dưới khóa `MuiLocalizationProvider`, nên một khai báo trong `src/themes/index.jsx` phủ cả 15 chỗ. Kiểm chứng: ô ngày trong `/apps/invoice/create` chuyển từ `09/02/2026` sang `02/09/2026`.
  - **Gọi `format` trực tiếp** (11 file, nằm ngoài mọi picker nên `adapterLocale` không với tới): `setDefaultOptions({ locale: vi })` của date-fns đặt một mặc định toàn cục, gọi trong `src/components/Locales.jsx` mỗi khi đổi ngôn ngữ. Kiểm chứng: tiêu đề lịch chuyển từ `September 2026` sang `tháng 09 2026`.

  Còn hai điểm nhỏ đi kèm, **chưa xử lý và không nằm trong phạm vi mục này**: chuỗi định dạng `'MMMM yyyy'` là của vendor nên tiếng Việt ra `tháng 09 2026` thay vì `Tháng 9, 2026` — sửa được nhưng phải chạm file vendor; và hàng tiêu đề của lịch vẫn là `Sun`/`Mon`/`Tue` vì đó là **FullCalendar**, một thư viện khác, cần truyền prop `locale` trong `src/pages/apps/calendar.jsx`. `@fullcalendar/core/locales/vi` đã có sẵn trong node_modules. Cả hai đưa vào L8.

## 3. Ngoài phạm vi L1

- Không dịch nội dung trang. Việc biên soạn tiếng Việt bắt đầu từ L2 theo đúng thứ tự nhóm.
- Không chuyển chuỗi của các nhóm chức năng vào catalog. L1 chỉ dựng cơ chế, công cụ, inventory và glossary.
- Không branding Mphone, không thêm/xóa/gộp/thiết kế lại trang.
- Không đổi route, data model, interaction flow.
- Không sửa lỗi phát hiện qua ảnh chụp baseline trong cùng change set L1. Ghi nhận trước, sửa sau, change set riêng.

## 4. Định nghĩa hoàn thành L1

- [ ] Chuyển đổi `en` ↔ `vi` hoạt động trên toàn ứng dụng và lựa chọn được ghi nhớ sau khi tải lại trang.
- [ ] `vi.json` tồn tại, cùng hệ key với `en.json`, và `i18n:check` báo parity đạt.
- [ ] Bốn lệnh chạy được cục bộ và có kết quả cơ sở được lưu làm mốc so sánh cho các đợt sau.
- [ ] `i18n/keymap.json` tồn tại, plugin thay thế đúng phạm vi L1 khi build, và `i18n:diff` trên cây vendor sạch không báo mục nào chưa xử lý. Đây là tiêu chí quan trọng nhất của L1.
- [ ] Diff `src/` so với cây vendor nguyên bản vẫn ở mức một chữ số file, và mọi file lệch đều có trong `docs/vendor-patches.md`.
- [ ] `docs/vendor-patches.md` đã liệt kê đủ patch hiện có và cách áp lại.
- [ ] Cây vendor nguyên bản 4.2.0 tại `.tools/mto-stage-20260902/full-version` còn nguyên, không bị xóa hay sửa.
- [ ] Inventory và glossary đã lưu trong `docs/`, ghi rõ nguồn và ngày.
- [ ] Ba sửa lỗi ở 2.5 đã xong hoặc đã được product owner hoãn có ghi nhận.
- [ ] Prettier, ESLint và local build đều đạt.
- [x] Ảnh chụp baseline ở mục 2.6 đã lưu, có ngày và tên cây.
- [ ] Smoke test tám tổ hợp ngôn ngữ/theme/viewport trên ít nhất ba route đại diện: một dashboard, một trang apps, một trang auth. Không raw message id, không lỗi runtime, không lỗi console, không tràn ngang ở 390px.
- [ ] Không có request ra host ngoài phát sinh thêm so với baseline.

## 5. Bằng chứng phải nộp

- Kết quả ba lệnh kiểm tra, dạng văn bản, kèm ngày và cây target.
- Bảng inventory và glossary.
- Ảnh chụp tám tổ hợp của ba route đại diện.
- Nhật ký thay đổi: change set L1 chỉ chứa hạ tầng localization, công cụ và ba sửa lỗi ở 2.5. Không lẫn nội dung dịch, branding hay nghiệp vụ sản phẩm.

## 6. Rủi ro đã biết

- **Keymap ra đời muộn.** Đây là rủi ro lớn nhất. Nếu để đến L3 hay L4 mới làm, phải dựng ngược keymap từ những gì đã sửa — tốn hơn, dễ sót, và mất đường nâng cấp Mantis.
- **Plugin đoán thay vì tra keymap.** Nếu ai đó thêm heuristic "tự nhận diện chuỗi hiển thị" vào plugin để đi nhanh, tính tất định mất và sẽ có chuỗi bị dịch sai ngữ cảnh mà không ai duyệt. Plugin chỉ được thay những vị trí có trong keymap.
- **Bước duyệt keymap bị bỏ qua.** Chất lượng ngữ cảnh nằm ở chỗ người gán key và viết `context`, không nằm ở công cụ.
- **Quy ước key đặt sai ở L1.** Chi phí sửa tăng theo từng đợt; đến L7 là hàng nghìn key.
- **Tiếng Việt dài hơn 20–30%.** Nếu chỉ phát hiện tràn chữ ở Stage 4, chi phí sửa rơi vào cuối dự án. Ngân sách độ dài phải nằm trong glossary ngay từ L1.
