# Chuyển đổi Portal sang Mantis 4.2.0 — Bản hướng dẫn tiếng Việt

Tài liệu này là bản tiếng Việt phụ của các quy tắc chuyển đổi MTO trong `AGENTS.md`. Khi có khác biệt, `AGENTS.md` ở thư mục gốc là nguồn điều khiển chính thức cho AI.

## Phạm vi và vai trò

- **Mục tiêu triển khai mới:** `portal-worktree/app/portal/mto`
- **Portal cũ dùng làm tham chiếu:** `portal-worktree/app/portal/spa`
- **Nền tảng chính:** Mantis 4.2.0 Vite JavaScript full-version.
- Chủ sản phẩm xác nhận đã mua license chính thức cho bộ Mantis mới.
- `mto` là nguồn chuẩn cho mọi công việc Portal mới.
- `spa` được giữ lại để tham khảo nghiệp vụ, hành vi, nội dung, localization và accessibility.
- Không ghi đè, đổi tên, xóa hoặc hợp nhất cơ học `spa` vào `mto`.
- Không chuyển preview chính sang MTO hoặc loại bỏ Portal cũ cho đến khi chủ sản phẩm phê duyệt cutover.
- Preview MTO chạy riêng tại `http://127.0.0.1:4322/`; preview Portal cũ tiếp tục ở `http://localhost:4321/` để đối chiếu.

## Mục tiêu giai đoạn đầu

Mục tiêu đầu tiên không phải thu gọn hoặc thiết kế lại Mantis. Phải giữ nguyên đầy đủ Mantis 4.2.0 Vite JavaScript full-version trong `mto`, bao gồm toàn bộ page, route, navigation, dashboard, widget, application, form, table, chart, authentication demonstration, maintenance page, component demonstration, theme, responsive layout và interaction state.

Trong giai đoạn này, chỉ thay đổi nội dung hiển thị, localization, thương hiệu Mphone và lớp mô phỏng cục bộ cần thiết. Không xóa trang chỉ vì Portal cũ chưa có chức năng tương ứng.

Mục tiêu là tạo một bản Mantis đầy đủ, song ngữ và mang ngữ cảnh Mphone trước khi quyết định trang nào sẽ được giữ, hợp nhất, thiết kế lại, chỉ giữ trong UI Lab hoặc loại bỏ.

## Song ngữ hóa và nội dung Mphone

- Mọi chuỗi hiển thị phải đi qua hệ thống localization dùng chung; không hardcode tiếng Việt hoặc tiếng Anh trong component.
- Mỗi message key phải có nội dung tiếng Việt và tiếng Anh hoàn chỉnh trong cùng một thay đổi.
- Giữ cấu trúc và mục đích minh họa của từng trang Mantis trong giai đoạn đầu, nhưng thay nội dung demo bằng nội dung phù hợp với sản phẩm và dịch vụ Mphone.
- Nội dung mới phải tuân theo Calm, Clear, Certain, Efficient và Human.
- Nội dung phải ngắn gọn, tự nhiên, nhất quán và dễ hiểu đối với khách hàng viễn thông; không dịch từng từ nếu tạo ra câu thiếu tự nhiên.
- Dùng thuật ngữ nhất quán cho chức năng, trạng thái, hành động, validation, lỗi và hướng dẫn.
- Tiếng Anh phải là nội dung sản phẩm hoàn chỉnh, không phải bản dự phòng sơ sài của tiếng Việt.
- Không giữ tên công ty, thương hiệu, khách hàng, sản phẩm, địa chỉ, số điện thoại hoặc dữ liệu thương mại mẫu của Mantis.
- Không sao chép dữ liệu khách hàng thật từ Portal đang hoạt động vào fixture cục bộ.

Khi một trang Mantis chưa có chức năng Mphone tương ứng, giữ nguyên trang và layout, chuyển nội dung thành kịch bản Mphone hợp lý, dùng dữ liệu mẫu cục bộ, gắn nhãn mẫu/thử nghiệm/chưa kết nối khi cần và ghi rõ ranh giới tích hợp tương lai.

## Tham khảo Portal đang hoạt động

Có thể quan sát `https://call.mphone.vn/p/` ở chế độ chỉ đọc để hiểu thuật ngữ, nhóm route, nội dung song ngữ, cấu trúc dữ liệu hiển thị, trạng thái cuộc gọi, báo cáo, ghi âm, liên hệ, tài khoản, cài đặt và hành vi sản phẩm cần giữ trong MTO.

- Chỉ dùng phiên Chrome hoặc thông tin truy cập do chủ sản phẩm cung cấp trực tiếp cho phiên làm việc hiện tại.
- Không lưu username, password, cookie, token hoặc session trong `AGENTS.md`, source, fixture, test, screenshot, log, tài liệu hoặc file được commit.
- Không hiển thị lại credential trong báo cáo tiến độ hoặc handoff.
- Không thay đổi dữ liệu, cấu hình hoặc trạng thái trên Portal đang hoạt động.
- Không deploy, upload hoặc đồng bộ từ workspace đến Portal đang hoạt động.
- Không đưa dữ liệu thật hoặc thông tin nhạy cảm vào MTO.

Portal đang hoạt động là nguồn tham khảo sản phẩm chỉ đọc, không phải môi trường kiểm thử hoặc đích triển khai.

## Bảo mật mã nguồn nhà cung cấp

Các gói Mantis 4.2.0 có chứa GitHub PAT trong package scripts, cùng APM, telemetry, file `.env` và adapter dịch vụ bên ngoài.

- Không chạy `setup:apm:*` hoặc `install:apm:*`.
- Không sao chép, sử dụng, xác minh, hiển thị hoặc commit PAT được nhúng.
- Không nhập file `.env` của nhà cung cấp.
- Không chạy telemetry hoặc script tải và thực thi nội dung từ mạng.
- Trước khi commit, kiểm tra file staged để tìm credential, telemetry, giá trị môi trường của nhà cung cấp và URL ngoài dự kiến.

Giữ nguyên tất cả trang Mantis có nghĩa là giữ trải nghiệm giao diện, không phải giữ credential, telemetry hoặc kết nối thật.

## Tích hợp và mô phỏng

Các trang liên quan đến Auth0, Firebase, Supabase, Amazon Cognito, Google reCAPTCHA, mock API, e-commerce, customer, invoice, chat hoặc dịch vụ bên ngoài phải tiếp tục render với đủ trạng thái và tương tác để đánh giá giao diện, nhưng phải sử dụng fixture cục bộ, stubbed session hoặc simulated action.

Các trang này không được yêu cầu tài khoản bên ngoài, gửi dữ liệu ra ngoài workspace hoặc thể hiện tích hợp mô phỏng như đang hoạt động thật. Không kết nối Webphone với SIP/PBX thật, không dùng database production và không kết nối MTO với backend FusionPBX trong UI Lab.

## Quản lý archive

- Coi ZIP và file Figma Mantis gốc là đầu vào tham khảo cục bộ.
- Không commit hoặc phân phối lại nếu chưa được chủ sản phẩm phê duyệt rõ ràng.
- Không giải nén đè lên `spa`, `mto` hoặc workspace root; dùng thư mục staging riêng.
- Không dùng quy tắc ignore quá rộng có thể ẩn mã nguồn `mto`.
- Chỉ commit mã Mantis đã được đưa vào `mto` sau khi loại bỏ credential, telemetry và cấu hình không an toàn.
- Không đưa thông tin mua hàng, license key hoặc credential vào repository.

## Các giai đoạn triển khai

1. Tạo `mto` từ Mantis 4.2.0 Vite JavaScript full-version, giữ nguyên toàn bộ page và route, đồng thời loại bỏ credential, APM và telemetry và thay tích hợp runtime bên ngoài bằng adapter cục bộ.
2. Kiểm kê toàn bộ chuỗi hiển thị và hoàn thiện catalogue tiếng Việt/tiếng Anh. Kiểm tra text expansion, xuống dòng, button, table header, dialog và responsive navigation.
3. Áp dụng nhận diện Mphone và viết lại nội dung demo theo sản phẩm, dịch vụ Mphone bằng dữ liệu mẫu không nhạy cảm. Giữ khả năng truy cập mọi trang Mantis.
4. Sau khi toàn bộ ứng dụng đã song ngữ và mang nội dung Mphone, phân loại trang cần giữ, hợp nhất, thiết kế lại, chỉ giữ trong UI Lab hoặc loại bỏ; ghi lại shared foundation và ranh giới backend tương lai. Không loại bỏ lớn nếu chưa được chủ sản phẩm phê duyệt.
5. Tái triển khai hành vi đã kiểm chứng từ `spa` trong `mto`, bao gồm dashboard, calls, contacts, recordings, reports, settings, account, analytics, Webphone, Chat và App Phone. Không import source file từ `spa` vào build của `mto`.

## Tiêu chí hoàn thành mỗi trang

Mỗi trang MTO phải được kiểm tra bằng tiếng Việt và tiếng Anh, light/dark theme, desktop và 390px; không được có page-level horizontal overflow, text bị cắt/chồng lấn, network request ngoài dự kiến, runtime error, console error, credential bị lộ hoặc dữ liệu khách hàng thật.

Phải kiểm tra keyboard navigation, focus visibility, loading, empty, error, disabled và interactive states, cùng dữ liệu mẫu và hành động mô phỏng cục bộ.

Một thay đổi chỉ hoàn thành sau khi formatting, lint, local build, quality checks liên quan và visual inspection trên local preview đều đạt.
