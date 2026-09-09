# Mphone Portal Next — Hướng dẫn trước khi triển khai / Pre-implementation Guide

**Trạng thái / Status:** Nền tảng Portal Next đã được triển khai tại `/p-next/`; chưa thay thế production `/p/` / Portal Next foundation is deployed at `/p-next/`; production `/p/` has not been replaced.

**Cập nhật / Updated:** 2026-09-06

---

# Tiếng Việt

## 0. Trạng thái triển khai ngày 2026-09-06

- Source thiết kế vẫn nằm trên Windows tại `D:\Projects\FusionPBX\design-system` và được mount vào Debian tại `/mnt/design-system`.
- Design Lab có workspace **Mphone UI** tại route `/mphone-ui`, chạy bằng mock provider để thiết kế đúng data contract.
- Debian build một target riêng bằng `sudo mphone-ui-stage`; lệnh này chỉ đọc/copy source sang ổ local, kiểm tra, build và đổi symlink `/p-next/` theo release.
- `/p-next/` bắt buộc dùng `fusionpbx` provider. Bundle được chặn nếu chứa mock endpoint hoặc preview user.
- App shell, session FusionPBX, Dashboard API và active-call WebSocket đã có nền tảng kết nối thật.
- Calls, Contacts và Recordings mới là route giữ chỗ; từng màn hình phải được thiết kế, duyệt và nối API thật trước khi đánh dấu hoàn tất.
- `/p/` hiện tại chưa bị thay đổi. Chưa có lệnh promote/rollback production; các lệnh đó vẫn là đề xuất và phải được triển khai, kiểm thử riêng trước khi chuyển production.
- Mount hiện là read-write để có thể làm việc với source Windows từ Debian. Script stage không build hoặc cài dependency trực tiếp trên mount.
- Release staging đang active: `20260906T124532Z-1091211`. Windows Mphone UI và Debian Portal Next hiện dùng chung Mantis Pro shell, menu, header, drawer, route và page components; chỉ data provider khác nhau.
- Có hai chế độ phát triển trên Windows: `npm start` dùng mock tại `/mphone-ui`; `npm run start:mphone:debian` bật hot reload tại `https://call.mphone.vn/mphone-ui-dev/` và dùng session/API/WebSocket thật của Debian qua reverse proxy có xác thực.
- Không mở trực tiếp `http://<windows>:4324` để kiểm tra dữ liệu thật, vì đường đó không có FusionPBX cookie cùng origin. Luôn đăng nhập `/p/` rồi mở URL `/mphone-ui-dev/` trên `call.mphone.vn`.
- Trước khi promote production vẫn phải kiểm tra bằng tài khoản Portal thật, xác nhận WebSocket với cuộc gọi thật, kiểm tra desktop/mobile và xử lý dependency audit (hiện production dependency tree báo 14 cảnh báo: 2 low, 1 moderate, 10 high, 1 critical).

## 1. Mục tiêu

Mphone Portal Next là thế hệ giao diện mới của Portal khách hàng, được xây dựng trên Mantis Pro và cải tiến dần theo nhu cầu thực tế của Mphone.

Mục tiêu không phải là đổi theme cho Portal hiện tại trong một lần. Mục tiêu là:

- tổ chức lại kiến trúc thông tin, menu và luồng thao tác;
- thiết kế, thử nghiệm và duyệt từng khu vực bằng dữ liệu mẫu;
- kết nối từng khu vực đã ổn định với API thật của FusionPBX;
- giữ Portal hiện tại hoạt động trong suốt quá trình chuyển đổi;
- phát hành có kiểm tra, có thể quay lại phiên bản trước;
- giữ kho thiết kế trên Windows độc lập với môi trường chạy trên server.

## 2. Các quyết định kiến trúc bắt buộc

1. Không thay toàn bộ Portal hiện tại trong một lần.
2. Không cho web server chạy trực tiếp từ thư mục Windows được mount qua SSHFS.
3. Không dùng `mpo-design` hiện tại làm bản production khi nó còn phụ thuộc vào mock API.
4. Không để production tự động fallback từ API thật sang dữ liệu mock.
5. Portal hiện tại tiếp tục chạy ở `/p/`; Portal mới được thử nghiệm ở `/p-next/`.
6. Mỗi màn hình chỉ được chuyển sang Portal mới sau khi đã duyệt UI/UX, kết nối API thật và kiểm tra phân quyền.
7. Quá trình deploy chỉ đọc nguồn Windows, build trên ổ đĩa local của Debian và phát hành artifact tĩnh.
8. Phải có bản phát hành trước đó để rollback.

## 3. Hiện trạng đã xác nhận

| Thành phần | Vị trí | Vai trò hiện tại |
|---|---|---|
| Nguồn thiết kế Windows | `D:\Projects\FusionPBX\design-system` | Kho thiết kế và thử nghiệm Mphone |
| Mount trên Debian | `/mnt/design-system` | Truy cập nguồn Windows bằng SSHFS/Tailscale |
| Design Lab hiện tại | `portal-worktree/app/portal/mpo-design` | Mantis Pro, Vite, MUI và mock data |
| Portal đang chạy | `/var/www/fusionpbx/app/portal/spa` | SPA đã kết nối nghiệp vụ FusionPBX |
| Bản build đang phục vụ | `/var/www/fusionpbx/p` | Được truy cập qua URL `/p/` |

`mpo-design` hiện vẫn có cấu hình mock API của mẫu Mantis. Vì vậy nó là nền thiết kế tốt nhưng chưa phải một ứng dụng Mphone production có thể thay trực tiếp cho Portal hiện tại.

## 4. Kiến trúc mục tiêu

```text
Mantis Pro gốc (vendor, không sửa)
                │
                ▼
Mphone Design Lab (mock data, thử và duyệt UI/UX)
                │
                ▼
Mphone Portal Next (API FusionPBX thật)
                │
                ▼
Build local trên Debian
                │
                ▼
/p-next/ ── duyệt và kiểm thử ──► /p/
```

Nên tổ chức dần kho `design-system` theo hướng:

```text
design-system/
├── vendor/
│   └── mantis-pro-4.2.0/       # Nguồn vendor nguyên bản, chỉ tham khảo
├── apps/
│   ├── design-lab/             # Mock data, thử nghiệm UI/UX
│   └── portal-next/            # Ứng dụng thật dùng API FusionPBX
├── packages/
│   ├── ui/                     # Component Mphone dùng chung
│   ├── tokens/                 # Màu, font, spacing, shadow
│   └── contracts/              # Hợp đồng dữ liệu giữa UI và provider
└── docs/
```

Đây là cấu trúc mục tiêu. Không di chuyển hoặc xóa cấu trúc hiện tại trước khi lập bản đồ phụ thuộc và có kế hoạch chuyển an toàn.

## 5. Có dựng một ứng dụng trống không?

Có, theo nghĩa tạo một ứng dụng sản phẩm mới và chỉ đưa các màn hình đã được duyệt vào đó. Không, theo nghĩa không bắt đầu lại từ một Vite project hoàn toàn trắng.

Portal Next được kế thừa từ Mantis Pro:

- theme và design tokens;
- layout primitives;
- component cơ bản;
- responsive behavior;
- typography, spacing, form, table và dialog patterns.

Portal Next không được giữ nguyên:

- màn hình demo không thuộc Mphone;
- mock authentication của vendor;
- mock API và dữ liệu giả ở runtime production;
- route, menu và nội dung mẫu không phục vụ nghiệp vụ Mphone;
- khóa, analytics ID, CDN hoặc external runtime resource của vendor.

## 6. Ba lớp cần tách biệt

### 6.1 Vendor baseline

Mã Mantis Pro nguyên bản được giữ bất biến để:

- đối chiếu khi cần component hoặc behavior gốc;
- so sánh khi vendor phát hành bản mới;
- tránh trộn code vendor với các thay đổi riêng của Mphone.

Không phát triển tính năng Mphone trực tiếp trong thư mục vendor. Không công khai hoặc phân phối mã nguồn vendor ngoài phạm vi giấy phép cho phép.

### 6.2 Design Lab

Design Lab dùng để:

- thử cấu trúc menu và kiến trúc thông tin;
- xây prototype nhanh;
- dùng mock data có kiểm soát;
- thử desktop, tablet và mobile;
- duyệt empty, loading, error và permission-denied state;
- thống nhất thiết kế trước khi kết nối backend.

Design Lab có thể tiếp tục dùng mock API hoặc fixture local. Nó không được phục vụ cho người dùng production.

### 6.3 Portal Next

Portal Next là ứng dụng sản phẩm thật. Nó dùng component và thiết kế đã được duyệt nhưng phải kết nối với:

- FusionPBX PHP session;
- các endpoint trong `app/portal/service/`;
- WebSocket cho dữ liệu cuộc gọi realtime;
- phân quyền và phạm vi dữ liệu do server quyết định;
- bản dịch tiếng Việt và tiếng Anh;
- base path `/p-next/`, sau này là `/p/`.

## 7. Mock data và dữ liệu thật

UI nên giao tiếp qua một data-provider contract thống nhất:

```text
Component giao diện
        │
        ▼
Data Provider Contract
        ├── Mock Provider       → Design Lab
        └── FusionPBX Provider  → Portal Next/production
```

Ví dụ cấu hình phát triển:

```env
VITE_DATA_PROVIDER=mock
VITE_APP_BASE_NAME=/
```

Ví dụ cấu hình staging:

```env
VITE_DATA_PROVIDER=fusionpbx
VITE_APP_BASE_NAME=/p-next/
```

Ví dụ cấu hình production:

```env
VITE_DATA_PROVIDER=fusionpbx
VITE_APP_BASE_NAME=/p/
```

Quy tắc bắt buộc:

- Production build phải thất bại nếu provider không phải `fusionpbx`.
- API thật lỗi phải hiển thị error state; không được thay bằng số liệu mock.
- Không đưa secret vào biến môi trường Vite vì mọi giá trị Vite đều có thể xuất hiện trong bundle trình duyệt.
- Fixture phải ghi rõ là dữ liệu giả và không chứa dữ liệu khách hàng thật.

## 8. Chiến lược chuyển đổi từng màn hình

Không sao chép màn hình cũ một cách máy móc. Với mỗi khu vực phải thực hiện:

1. Kiểm kê chức năng, quyền, API và trạng thái đang có.
2. Xác định vấn đề UI/UX và mục tiêu nghiệp vụ.
3. Thiết kế lại cấu trúc thông tin và luồng thao tác.
4. Prototype trong Design Lab với mock data.
5. Duyệt desktop/mobile và các trạng thái đặc biệt.
6. Chốt data contract.
7. Kết nối FusionPBX provider.
8. Kiểm tra permission, `domain_uuid`, loading, empty và error state.
9. Build vào `/p-next/` để nghiệm thu.
10. Ghi nhận màn hình đã hoàn thành trong bảng migration.

Thứ tự đề xuất:

1. App shell: sidebar, header, navigation, responsive và route guards.
2. Dashboard.
3. Lịch sử và chi tiết cuộc gọi.
4. Danh bạ.
5. Ghi âm.
6. Chuyển tiếp cuộc gọi.
7. Tài khoản và thiết bị.
8. Billing.
9. Campaign/Dialer.
10. Những module còn lại theo mức độ sử dụng.

## 9. Theo dõi migration

Mỗi màn hình nên có trạng thái rõ ràng:

| Màn hình | UX đã duyệt | Responsive | Data contract | API thật | Permission | Staging | Production |
|---|---:|---:|---:|---:|---:|---:|---:|
| App shell | Chưa | Chưa | N/A | Chưa | Chưa | Chưa | Chưa |
| Dashboard | Chưa | Chưa | Chưa | Chưa | Chưa | Chưa | Chưa |
| Calls | Chưa | Chưa | Chưa | Chưa | Chưa | Chưa | Chưa |

Không đánh dấu hoàn thành chỉ vì màn hình nhìn đúng với mock data.

## 10. Các quy tắc tích hợp FusionPBX

- Scope dữ liệu được quyết định ở server, không lọc trên React rồi coi đó là bảo mật.
- Mọi query liên quan khách hàng phải được giới hạn bằng `domain_uuid`.
- Tái sử dụng permission FusionPBX hiện có khi phù hợp.
- Ẩn nút ở React không thay thế permission check phía server.
- Endpoint Portal nằm trong `app/portal/service/`; không tạo URL có đoạn `/api/` vì quy tắc rewrite hiện tại.
- Không dùng CDN, Google Fonts, remote image hoặc external runtime dependency.
- Text hiển thị cho người dùng phải có cả tiếng Việt và tiếng Anh.
- Portal Next phải dùng session FusionPBX hiện có, không thêm một hệ đăng nhập song song.
- Dữ liệu cuộc gọi realtime và lịch sử phải có failure state độc lập.
- Không liên kết recording của Portal đến endpoint admin không được scope theo domain.

## 11. Tách nguồn Windows khỏi môi trường chạy

Đường truyền deploy phải một chiều:

```text
D:\Projects\FusionPBX\design-system
                 │
                 │ SSHFS, chỉ đọc khi deploy
                 ▼
/mnt/design-system
                 │
                 │ copy/rsync có exclude
                 ▼
Thư mục build local tạm thời trên Debian
                 │
                 ▼
Release artifact trên Debian
```

Không chạy `npm install`, `npm run build` hoặc web server trực tiếp trong `/mnt/design-system`. Lý do:

- máy Windows hoặc Tailscale có thể mất kết nối;
- SSHFS chậm với nhiều file nhỏ trong `node_modules`;
- khác biệt Windows/Linux có thể ảnh hưởng symlink, executable bit và native dependency;
- một build lỗi không được làm bẩn kho thiết kế.

Mount hiện được cấu hình đọc-ghi. Script `mphone-ui-stage` đã được giới hạn theo hướng chỉ đọc/copy từ `/mnt/design-system`; không chạy npm hoặc build trực tiếp trên mount.

Khi cần chỉnh code từ Debian, dùng một checkout/worktree local và chuyển thay đổi có chủ đích qua Git; không sửa ngầm vào ổ Windows trong lúc deploy.

## 12. Quy trình phát hành

Lệnh Stage đã được triển khai. Promote và Rollback vẫn là thiết kế dự kiến, chưa được phép dùng cho production.

### Stage

```bash
sudo mphone-ui-stage
```

Lệnh stage cần:

1. Xác nhận `/mnt/design-system` đang mount đúng nguồn.
2. Sao chép source cần thiết vào workspace local.
3. Loại trừ `.git`, `node_modules`, `dist`, `.env` cục bộ và file tạm.
4. Dùng lockfile cố định để cài dependency.
5. Chạy formatter check, lint, i18n check và build.
6. Kiểm tra production provider là `fusionpbx`.
7. Phát hành artifact versioned.
8. Cập nhật `/p-next/` theo cách atomic.
9. Không thay đổi `/p/`.

### Promote

```bash
sudo mphone-ui-promote
```

Chỉ promote một artifact đã qua staging. Không build lại trong bước promote. Việc chuyển `/p/` phải atomic và giữ lại release trước đó.

### Rollback

```bash
sudo mphone-ui-rollback
```

Rollback chỉ đổi release đang active về artifact trước đó, không lấy source mới và không build lại.

## 13. Kiểm tra trước khi promote

- Asset và SPA routes ở `/p-next/` trả về HTTP thành công.
- Refresh trực tiếp trên route con không bị 404.
- Session hết hạn chuyển về login FusionPBX đúng cách.
- User thiếu `portal_view` bị từ chối.
- Dữ liệu không vượt ra ngoài domain và extension được cấp quyền.
- User/admin/superadmin nhìn thấy đúng chức năng.
- Mock data không xuất hiện trong production bundle hoặc runtime.
- Không có request đến host bên ngoài nếu không được phê duyệt rõ ràng.
- Tiếng Việt và tiếng Anh đều hiển thị đầy đủ.
- Loading, empty, API error, websocket error và permission error đều có UI riêng.
- Desktop và mobile đã được kiểm tra bằng trình duyệt thật.
- Build có release ID, nguồn commit/version và thời điểm phát hành.
- Rollback đã được thử với release staging.

## 14. Những việc không được làm

- Không symlink `/p/` hoặc source production trực tiếp vào `/mnt/design-system`.
- Không `rsync --delete` vào nguồn Windows.
- Không overwrite `app/portal/spa` khi chưa có backup và kế hoạch rollback.
- Không đưa toàn bộ demo Mantis Pro lên production.
- Không dùng mock API làm fallback khi API FusionPBX lỗi.
- Không coi việc ẩn menu hoặc button là kiểm soát quyền.
- Không lưu credential, token hoặc dữ liệu khách hàng thật trong design fixtures.
- Không nâng version Mantis, React, MUI hoặc router cùng lúc với một migration nghiệp vụ nếu chưa tách riêng kiểm thử.

## 15. Điều kiện bắt đầu triển khai

Trước khi viết Portal Next cần chốt:

- tên và vị trí chính thức của Design Lab và Portal Next;
- ứng dụng nào là source of truth cho code production;
- mount sẽ chuyển thành read-only hay vẫn cho phép chỉnh sửa từ Debian;
- danh sách route/màn hình hiện tại và thứ tự ưu tiên thiết kế lại;
- data-provider contract ban đầu;
- quy tắc version/release và thời gian giữ artifact;
- người duyệt UI/UX và điều kiện một màn hình được coi là hoàn thành;
- phạm vi giấy phép Mantis Pro cho source, build artifact và thành viên được truy cập.

---

# English

## 0. Implementation status on 2026-09-06

- The design source remains on Windows at `D:\Projects\FusionPBX\design-system` and is mounted on Debian at `/mnt/design-system`.
- The Design Lab includes an **Mphone UI** workspace at `/mphone-ui`, using a mock provider that follows the real data contract.
- Debian builds a separate target with `sudo mphone-ui-stage`; the command only reads/copies source to local storage, validates it, builds it, and atomically switches the `/p-next/` release symlink.
- `/p-next/` is required to use the `fusionpbx` provider. Deployment rejects bundles containing the mock endpoint or preview user.
- The application shell, FusionPBX session, Dashboard API, and active-call WebSocket integration foundations are implemented.
- Calls, Contacts, and Recordings remain explicit placeholder routes; each screen must be designed, approved, and connected to a real API before completion.
- The existing `/p/` is unchanged. Production promote/rollback commands do not exist yet; they remain proposals and require separate implementation and testing before production migration.
- The mount is currently read-write so Debian can deliberately work on the Windows source. The stage script does not build or install dependencies directly on the mount.
- Active staging release: `20260906T124532Z-1091211`. Windows Mphone UI and Debian Portal Next now share the same Mantis Pro shell, menu, header, drawer, routes, and page components; only the data provider differs.
- Windows supports two development modes: `npm start` provides mock data at `/mphone-ui`; `npm run start:mphone:debian` provides hot reload at `https://call.mphone.vn/mphone-ui-dev/` using the real Debian session/API/WebSocket through an authenticated reverse proxy.
- Do not open `http://<windows>:4324` directly for real-data testing because it does not share the FusionPBX same-origin cookie. Sign in at `/p/` and open `/mphone-ui-dev/` on `call.mphone.vn` instead.
- Before production promotion, test with a real Portal account, validate the WebSocket with a real call, check desktop/mobile behavior, and address the dependency audit (the production dependency tree currently reports 14 findings: 2 low, 1 moderate, 10 high, and 1 critical).

## 1. Purpose

Mphone Portal Next is the next generation of the customer Portal UI. It will use Mantis Pro as its visual foundation and evolve around actual Mphone product needs.

This is not a one-time theme replacement. The goals are to:

- reorganize information architecture, navigation, and user flows;
- design and approve one area at a time using controlled mock data;
- connect approved areas to real FusionPBX services;
- keep the current Portal operational throughout the migration;
- use verified, reversible releases;
- keep the Windows design workspace independent from the server runtime.

## 2. Mandatory architecture decisions

1. Do not replace the entire current Portal in one operation.
2. Do not serve the application directly from the Windows SSHFS mount.
3. Do not deploy the current `mpo-design` as production while it depends on vendor mock APIs.
4. Production must never silently fall back from real data to mock data.
5. Keep the current Portal at `/p/`; stage the new Portal at `/p-next/`.
6. Migrate a screen only after UX approval, real API integration, and permission testing.
7. Deployment reads Windows source, builds on local Debian storage, and publishes static artifacts.
8. Always retain a previously verified release for rollback.

## 3. Confirmed current state

| Component | Location | Current role |
|---|---|---|
| Windows design source | `D:\Projects\FusionPBX\design-system` | Mphone design and experimentation workspace |
| Debian mount | `/mnt/design-system` | SSHFS/Tailscale access to Windows source |
| Current Design Lab | `portal-worktree/app/portal/mpo-design` | Mantis Pro, Vite, MUI, and mock data |
| Current Portal source | `/var/www/fusionpbx/app/portal/spa` | SPA integrated with FusionPBX behavior |
| Currently served build | `/var/www/fusionpbx/p` | Available at `/p/` |

The current `mpo-design` still contains Mantis sample mock-API configuration. It is a useful design foundation, but it is not yet a production Mphone application that can directly replace the current Portal.

## 4. Target architecture

```text
Immutable Mantis Pro vendor baseline
                │
                ▼
Mphone Design Lab (mock data and UX approval)
                │
                ▼
Mphone Portal Next (real FusionPBX services)
                │
                ▼
Local Debian build
                │
                ▼
/p-next/ ── review and verification ──► /p/
```

A suitable long-term repository shape is:

```text
design-system/
├── vendor/
│   └── mantis-pro-4.2.0/       # Immutable vendor reference
├── apps/
│   ├── design-lab/             # Mock-backed UX experiments
│   └── portal-next/            # Real FusionPBX application
├── packages/
│   ├── ui/                     # Shared Mphone components
│   ├── tokens/                 # Color, typography, spacing, shadows
│   └── contracts/              # UI/provider data contracts
└── docs/
```

This is a target structure. Do not move or delete the current structure until dependencies have been mapped and a safe migration plan exists.

## 5. Should the new application start blank?

Yes in the sense that it is a new product application containing only reviewed product screens. No in the sense that it should not start from an empty Vite project.

Portal Next should inherit from Mantis Pro:

- theme and design tokens;
- layout primitives;
- foundational components;
- responsive behavior;
- typography, spacing, form, table, and dialog patterns.

Portal Next should not retain:

- unrelated demo screens;
- vendor mock authentication;
- mock APIs or fabricated runtime data in production;
- sample routes, menus, and content unrelated to Mphone;
- vendor credentials, analytics identifiers, CDNs, or remote runtime assets.

## 6. Required separation of concerns

### 6.1 Vendor baseline

Keep original Mantis Pro source immutable so it can be used for reference, upgrade comparison, and clean separation between licensed vendor code and Mphone modifications. Do not develop Mphone product features directly in the vendor directory. Do not expose or distribute vendor source beyond the license terms.

### 6.2 Design Lab

Use the Design Lab to explore navigation, information architecture, prototypes, responsive behavior, and loading/empty/error/permission states. It may use mock APIs or local fixtures and must never be the customer-facing production runtime.

### 6.3 Portal Next

Portal Next is the real product application. It reuses approved designs but integrates with the FusionPBX PHP session, endpoints under `app/portal/service/`, realtime WebSocket data, server-defined authorization and scope, English/Vietnamese localization, and the `/p-next/` base path before promotion to `/p/`.

## 7. Mock and real data

The UI should depend on a stable provider contract:

```text
UI component
      │
      ▼
Data Provider Contract
      ├── Mock Provider       → Design Lab
      └── FusionPBX Provider  → Portal Next/production
```

Development example:

```env
VITE_DATA_PROVIDER=mock
VITE_APP_BASE_NAME=/
```

Staging example:

```env
VITE_DATA_PROVIDER=fusionpbx
VITE_APP_BASE_NAME=/p-next/
```

Production example:

```env
VITE_DATA_PROVIDER=fusionpbx
VITE_APP_BASE_NAME=/p/
```

Mandatory rules:

- A production build must fail unless the provider is `fusionpbx`.
- A real API failure must render an error state, never fabricated data.
- Do not place secrets in Vite environment variables; browser bundles can expose them.
- Fixtures must be clearly identified as fake and must contain no real customer data.

## 8. Screen-by-screen migration

For every area:

1. Inventory existing behavior, permissions, APIs, and states.
2. Identify UX problems and business goals.
3. Redesign information architecture and user flow.
4. Prototype with controlled mock data in the Design Lab.
5. Review desktop, mobile, and exceptional states.
6. Approve a data contract.
7. Connect the FusionPBX provider.
8. Test authorization, `domain_uuid`, loading, empty, and error states.
9. Build to `/p-next/` for acceptance.
10. Record completion in a migration matrix.

Suggested order:

1. Application shell, navigation, responsive layout, and route guards.
2. Dashboard.
3. Call history and call details.
4. Contacts.
5. Recordings.
6. Call forwarding.
7. Account and devices.
8. Billing.
9. Campaign/Dialer.
10. Remaining modules ordered by actual usage.

## 9. Migration tracking

Track each screen explicitly:

| Screen | UX approved | Responsive | Data contract | Real API | Permission | Staging | Production |
|---|---:|---:|---:|---:|---:|---:|---:|
| App shell | No | No | N/A | No | No | No | No |
| Dashboard | No | No | No | No | No | No | No |
| Calls | No | No | No | No | No | No | No |

A screen is not complete merely because it looks correct with mock data.

## 10. FusionPBX integration rules

- The server determines data scope; React-side filtering is not authorization.
- Customer queries must be pinned to `domain_uuid`.
- Reuse applicable FusionPBX permissions.
- Hiding a button in React does not replace server-side permission checks.
- Portal endpoints belong under `app/portal/service/`; avoid URL paths containing `/api/` because of the current rewrite behavior.
- Do not use CDNs, remote fonts, remote images, or unapproved runtime hosts.
- User-visible text must be available in both English and Vietnamese.
- Reuse the FusionPBX session; do not introduce a parallel login system.
- Realtime and historical call data require independent failure states.
- Do not expose recordings through an admin endpoint that is not safely domain-scoped.

## 11. Isolate Windows source from runtime

Deployment must be one-way:

```text
D:\Projects\FusionPBX\design-system
                 │
                 │ SSHFS, read-only during deployment
                 ▼
/mnt/design-system
                 │
                 │ copy/rsync with exclusions
                 ▼
Temporary local Debian build workspace
                 │
                 ▼
Versioned Debian release artifact
```

Do not run `npm install`, `npm run build`, or the production web server directly in `/mnt/design-system`. Windows availability, Tailscale connectivity, SSHFS small-file performance, cross-platform filesystem behavior, and build pollution make that unsafe.

The current mount is read-write. `mphone-ui-stage` is constrained to read/copy from `/mnt/design-system`; it does not run npm or build directly on the mount.

If Debian-side source editing is required, use a local checkout/worktree and transfer deliberate changes through Git. Deployment must never write changes back to Windows implicitly.

## 12. Release workflow

Stage is implemented. Promote and Rollback remain design proposals and are not authorized for production use.

### Stage

```bash
sudo mphone-ui-stage
```

The stage operation should verify the mount, copy required source locally, exclude `.git`, `node_modules`, `dist`, local `.env` files, and temporary files, install from a locked dependency graph, run formatting/lint/i18n/build checks, assert the FusionPBX provider, publish a versioned artifact, atomically update `/p-next/`, and leave `/p/` unchanged.

### Promote

```bash
sudo mphone-ui-promote
```

Promote only an artifact already verified in staging. Do not rebuild during promotion. Atomically update `/p/` and retain the previous release.

### Rollback

```bash
sudo mphone-ui-rollback
```

Rollback only switches the active release to the prior artifact. It must not fetch new source or rebuild.

## 13. Pre-promotion checks

- Assets and SPA routes under `/p-next/` return successful HTTP responses.
- Direct refresh of nested routes does not return 404.
- Expired sessions redirect through the expected FusionPBX login flow.
- Users without `portal_view` are rejected.
- Data cannot escape authorized domains and extensions.
- User/admin/superadmin roles see only authorized behavior.
- No mock data appears in the production bundle or runtime.
- No unapproved external runtime request occurs.
- English and Vietnamese catalogs are complete.
- Loading, empty, API error, WebSocket error, and permission error states exist.
- Desktop and mobile behavior has been checked in a real browser.
- The build records a release ID, source commit/version, and release timestamp.
- Rollback has been exercised against staging releases.

## 14. Prohibited actions

- Do not symlink `/p/` or production source directly into `/mnt/design-system`.
- Do not run `rsync --delete` against Windows source.
- Do not overwrite `app/portal/spa` without a backup and rollback plan.
- Do not deploy the entire Mantis Pro demo to production.
- Do not use mock APIs as a fallback for failed FusionPBX APIs.
- Do not treat hidden menus or buttons as authorization.
- Do not store credentials, tokens, or real customer data in design fixtures.
- Do not combine a Mantis/React/MUI/router upgrade with a business-screen migration unless the changes are tested separately.

## 15. Conditions to begin implementation

Before Portal Next implementation begins, confirm:

- final names and locations for the Design Lab and Portal Next;
- which application is the production source of truth;
- whether the mount becomes read-only or remains editable from Debian;
- the current route/screen inventory and redesign priority;
- the initial data-provider contract;
- release naming, retention, and rollback policy;
- the UX approver and the definition of done for each screen;
- Mantis Pro license scope for source access, built artifacts, and team members.
