# Email Marketing — Cập nhật giao diện Cấu hình (Tích hợp Brevo API)

## Bối cảnh

Chuyển cơ chế Email Marketing từ **tự xây** (ViLead gửi email xác thực, quản lý domain, cấu hình giới hạn thủ công) sang **tích hợp Brevo API** (khách hàng tự đăng ký Brevo, nhập API Key vào ViLead).

Phạm vi thay đổi: **CHỈ tab "Cấu hình"** trong module Email Marketing. 4 tab chính (Chiến dịch mail | Thư viện mẫu | Báo cáo chất lượng | Cấu hình) giữ nguyên.

---

## Tổng quan thay đổi Tab Cấu hình

### CŨ (2 sub-tab):
```
Cấu hình email gửi | Giới hạn gửi email
```

### MỚI (3 sub-tab):
```
Kết nối Brevo | Cấu hình email gửi | Giới hạn gửi email
```

---

## 1. SUB-TAB MỚI: "Kết nối Brevo"

Thêm sub-tab mới đặt **đầu tiên** (trước "Cấu hình email gửi").

### 1.1 State: Chưa kết nối

Hiển thị khi chưa có API Key hoặc API Key đã bị ngắt.

```
┌─────────────────────────────────────────────────────────────────┐
│ Kết nối Brevo                              ● Chưa kết nối     │
│ Kết nối tài khoản Brevo để gửi email marketing                │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  🔗 Hướng dẫn kết nối Brevo                            │   │
│  │                                                         │   │
│  │  Bước 1: Đăng ký tài khoản Brevo miễn phí              │   │
│  │          [Đăng ký Brevo →]  (link, mở tab mới)         │   │
│  │                                                         │   │
│  │  Bước 2: Vào SMTP & API → API Keys → Tạo key mới      │   │
│  │                                                         │   │
│  │  Bước 3: Sao chép API Key và dán vào ô bên dưới        │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  Brevo API Key *                                                │
│  ┌─────────────────────────────────────────────────┐           │
│  │ xkeysib-xxxxxx...                               │           │
│  └─────────────────────────────────────────────────┘           │
│                                                                 │
│  [Kết nối]  (primary button, disabled khi input trống)         │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Chi tiết component:**

| Component | Spec |
|-----------|------|
| Badge trạng thái | Góc trên phải. Text "Chưa kết nối", background `#FEE2E2`, text `#DC2626`, border-radius 9999px, padding 4px 12px |
| Card hướng dẫn | Background `#F0F9FF`, border `1px solid #BAE6FD`, border-radius 8px, padding 20px. Icon 🔗 hoặc Brevo logo bên trái tiêu đề |
| Link "Đăng ký Brevo" | `href="https://app.brevo.com/account/register"`, `target="_blank"`, style link button (text blue, underline on hover) |
| Input API Key | `type="password"` (masked mặc định), full-width, font `monospace`, placeholder `"xkeysib-xxxxxx..."`. Có icon toggle visibility (mắt) bên phải input |
| Nút "Kết nối" | Primary button (blue), `disabled` khi input empty. Hiển thị loading spinner khi đang gọi API |

**Xử lý khi nhấn "Kết nối":**

```
1. Disable button, hiển thị spinner
2. Gọi Brevo API: GET https://api.brevo.com/v3/account
   Header: { "api-key": "{input_value}" }
3. Nếu response 200:
   → Lưu API Key (mã hóa) vào database
   → Lưu thông tin account (companyName, email, plan)
   → Chuyển sang state "Đã kết nối"
   → Toast success: "Kết nối Brevo thành công!"
4. Nếu response 401/403:
   → Hiển thị error text dưới input: "API Key không hợp lệ. Vui lòng kiểm tra lại."
   → Error text: color #DC2626, font-size 14px
   → Không chuyển state
5. Nếu network error / timeout (5s):
   → Hiển thị error: "Không thể kết nối Brevo. Vui lòng thử lại."
```

### 1.2 State: Đã kết nối

Hiển thị sau khi validate API Key thành công.

```
┌─────────────────────────────────────────────────────────────────┐
│ Kết nối Brevo                  ● Đã kết nối Brevo ✔           │
│ Kết nối tài khoản Brevo để gửi email marketing                │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                                                         │   │
│  │  Tên công ty      Phòng KD ViLead                      │   │
│  │  Email chủ TK     admin@vilead.vn                       │   │
│  │  Plan hiện tại    [Free]  (badge)                       │   │
│  │                                                         │   │
│  │  API Key          xk-****...****a3b2   👁               │   │
│  │  Ngày kết nối     09/03/2026                            │   │
│  │  Kiểm tra cuối    09/03/2026 14:30                      │   │
│  │                                                         │   │
│  │  [Đổi API Key]  (outline)    [NGẮT KẾT NỐI]  (danger)  │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Chi tiết component:**

| Component | Spec |
|-----------|------|
| Badge trạng thái | Text "Đã kết nối Brevo ✔", background `#DCFCE7`, text `#16A34A` |
| Card thông tin | Background white, border `1px solid #E5E7EB`, border-radius 8px, padding 24px |
| Layout trong card | 2 cột (label : value). Label width 150px, color `#6B7280`, font-weight 500. Value color `#111827` |
| Badge Plan | Theo plan: Free → `bg-gray-100 text-gray-700`, Starter → `bg-blue-100 text-blue-700`, Business → `bg-purple-100 text-purple-700`, Enterprise → `bg-amber-100 text-amber-700` |
| API Key display | Font monospace, masked mặc định `xk-****...****a3b2`. Icon mắt toggle hiển thị full key |
| Nút "Đổi API Key" | Outline button. Click → mở dialog nhập key mới (giống form ở state Chưa kết nối) |
| Nút "NGẮT KẾT NỐI" | Danger outline button (`border-red-500 text-red-500`). Click → mở confirm dialog |

**Confirm dialog khi ngắt kết nối:**

```
Title:   "Ngắt kết nối Brevo?"
Body:    "NGẮT kết nối sẽ dừng mọi chiến dịch email đang chạy và
          không thể gửi email mới. Bạn chắc chắn?"
Buttons: [Hủy] (secondary)   [Ngắt kết nối] (danger, destructive)
```

Sau khi ngắt:
- Xóa API Key khỏi database
- Chuyển về state "Chưa kết nối"
- Toast: "Đã ngắt kết nối Brevo"

### 1.3 State: Lỗi kết nối

Hiển thị khi hệ thống kiểm tra định kỳ phát hiện API Key bị revoke.

```
┌─────────────────────────────────────────────────────────────────┐
│ Kết nối Brevo                     ● Lỗi kết nối              │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ⚠️ Không thể kết nối Brevo. API Key có thể đã bị hủy.        │
│     Vui lòng kiểm tra tại Brevo dashboard.                     │
│                                                                 │
│  [Kiểm tra lại]  (outline)    [Đổi API Key]  (primary)        │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

| Component | Spec |
|-----------|------|
| Badge trạng thái | Text "Lỗi kết nối", background `#FEF3C7`, text `#D97706` |
| Alert box | Background `#FFFBEB`, border-left `4px solid #F59E0B`, padding 16px, icon ⚠️ |

### 1.4 Background job: Kiểm tra kết nối định kỳ

```
- Chạy mỗi 1 giờ (cron hoặc scheduled job)
- Gọi GET /account với API Key đã lưu
- Nếu thất bại → cập nhật state thành "Lỗi kết nối"
- Gửi notification cho Admin (in-app)
- Lưu timestamp "Kiểm tra cuối" vào database
```

---

## 2. SUB-TAB CẬP NHẬT: "Cấu hình email gửi"

### 2.1 Khi chưa kết nối Brevo

Hiển thị banner thay vì bảng:

```
┌─────────────────────────────────────────────────────────────────┐
│  ⚠️ Vui lòng kết nối Brevo trước khi cấu hình email gửi.     │
│     [Đi tới Kết nối Brevo →]                                   │
└─────────────────────────────────────────────────────────────────┘
```

Banner: background `#FEF3C7`, border `1px solid #F59E0B`, link navigate sang sub-tab "Kết nối Brevo".

### 2.2 Khi đã kết nối Brevo

Giữ nguyên bố cục bảng hiện tại nhưng thay đổi nguồn dữ liệu và một số cột.

**Thay đổi phần header:**

```
CŨ:  "Quản lý danh sách email dùng để gửi chiến dịch"           [+ Thêm mới]
MỚI: "Danh sách email gửi (đồng bộ từ Brevo)"   [🔄 Làm mới]  [+ Thêm Sender mới]
```

| Thay đổi | Chi tiết |
|----------|----------|
| Thêm nút "🔄 Làm mới" | Icon refresh, outline button, bên trái nút "+ Thêm". Click → gọi Brevo API GET /senders → cập nhật bảng. Hiển thị spinner khi đang sync |
| Đổi text nút | "+ Thêm mới" → "+ Thêm Sender mới" |
| Đổi mô tả | "Quản lý danh sách email dùng để gửi chiến dịch" → "Danh sách email gửi (đồng bộ từ Brevo)" |

**Thay đổi các cột bảng:**

| Cột | CŨ | MỚI | Hành động |
|-----|-----|-----|-----------|
| EMAIL | Giữ nguyên | Giữ nguyên | Dữ liệu từ Brevo API field `email` |
| NGƯỜI GỬI | Giữ nguyên | Giữ nguyên | Dữ liệu từ Brevo API field `name` |
| NGÀY TẠO | Ngày thêm trong ViLead | **ĐỔI header → "NGÀY SYNC"** | Lần đầu tiên Sender xuất hiện từ Brevo sync |
| TRẠNG THÁI | 1 badge (Đã kích hoạt / Chờ xác thực / Domain chưa xác thực / Đã vô hiệu hóa) | **ĐỔI → 2 badge trên 2 dòng** | Xem chi tiết bên dưới |
| QUYỀN SỬ DỤNG | Giữ nguyên | Giữ nguyên | ViLead quản lý, không liên quan Brevo |
| THAO TÁC | Menu (...) → Chỉnh sửa / Xóa / Vô hiệu hóa | **ĐỔI → 2 icon button** | Xem chi tiết bên dưới |

**Chi tiết cột TRẠNG THÁI (mới — 2 badge):**

```
Dòng 1 - Trạng thái Brevo:
  • "Đã xác thực"    → badge xanh (bg #DCFCE7, text #16A34A)
  • "Chờ xác thực"   → badge vàng (bg #FEF3C7, text #D97706)

Dòng 2 - Trạng thái ViLead:
  • "Hoạt động"       → không hiển thị (default, ẩn đi cho gọn)
  • "Đã vô hiệu"     → badge xám  (bg #F3F4F6, text #6B7280)
```

Layout: 2 dòng trong cùng cell, gap 4px.

**Chi tiết cột THAO TÁC (mới):**

Bỏ menu (...). Thay bằng 2 icon button inline:

```
[🔑]  [⏸️]
```

| Icon | Tooltip | Hành động |
|------|---------|-----------|
| 🔑 (hoặc icon key/shield) | "Phân quyền" | Mở popup phân quyền (xem mục 2.3) |
| ⏸️ (hoặc icon toggle) | "Vô hiệu hóa" / "Kích hoạt lại" | Toggle trạng thái ViLead. Xem mục 2.4 |

Chỉ hiển thị cho Admin. User thường không thấy cột này.

### 2.3 Popup "Thêm Sender mới" (cập nhật)

Thay thế popup cũ. Form fields giữ nguyên nhưng logic backend thay đổi.

```
┌─────────────────────────────────────────────┐
│ Thêm Sender mới                         ✕  │
├─────────────────────────────────────────────┤
│                                             │
│ Địa chỉ Email người gửi *                  │
│ ┌─────────────────────────────────────────┐ │
│ │ Địa chỉ email doanh nghiệp để tránh    │ │
│ │ spam                                    │ │
│ └─────────────────────────────────────────┘ │
│                                             │
│ Tên người gửi *                             │
│ ┌─────────────────────────────────────────┐ │
│ │ Tên hiển thị khi khách hàng nhận email  │ │
│ └─────────────────────────────────────────┘ │
│                                             │
│ Quyền sử dụng Email *                      │
│ ┌─────────────────────────────────────┐ ▼  │
│ │ Toàn bộ thành viên dự án           │    │
│ └─────────────────────────────────────┘    │
│                                             │
│ ⚠️ Nếu email là @gmail.com, @yahoo.com:   │
│    Tỷ lệ vào spam sẽ cao hơn.             │
│    Khuyến nghị dùng email doanh nghiệp.    │
│                                             │
│          [Hủy bỏ]   [Thêm và gửi xác thực] │
└─────────────────────────────────────────────┘
```

**Logic khi nhấn "Thêm và gửi xác thực":**

```
1. Validate frontend:
   - Email: format hợp lệ, không trùng Sender đã có
   - Tên: không rỗng
   - Quyền: đã chọn

2. Gọi Brevo API: POST https://api.brevo.com/v3/senders
   Header: { "api-key": "{saved_api_key}" }
   Body:   { "name": "{tên}", "email": "{email}" }

3. Nếu response 201 (Created):
   → Lưu Sender vào database ViLead (email, name, quyền, trạng thái = "Chờ xác thực")
   → Đóng popup
   → Toast success: "Đã gửi email xác thực từ Brevo. Vui lòng kiểm tra hộp thư."
   → Refresh bảng Sender

4. Nếu response 400 (email đã tồn tại trên Brevo):
   → Hiển thị error: "Email này đã tồn tại trên Brevo. Vui lòng kiểm tra."

5. Nếu lỗi khác:
   → Hiển thị error tương ứng từ Brevo response message
```

**SO SÁNH VỚI POPUP CŨ:**

| Phần | CŨ | MỚI |
|------|-----|-----|
| Fields | Giữ nguyên 3 fields | Giữ nguyên 3 fields |
| Nút submit | "Thêm và xác nhận" | **ĐỔI text → "Thêm và gửi xác thực"** |
| Sau khi submit | ViLead gửi email xác thực (link 24h) | **ĐỔI → Gọi Brevo API tạo sender, Brevo tự gửi xác thực** |
| Cảnh báo email cá nhân | ⚠️ hiển thị | Giữ nguyên |

### 2.4 Popup "Phân quyền Sender" (cập nhật)

```
┌─────────────────────────────────────────────┐
│ Phân quyền Sender                        ✕  │
├─────────────────────────────────────────────┤
│                                             │
│ Địa chỉ Email                               │
│ ┌─────────────────────────────────────────┐ │
│ │ sales@vilead.vn                (khóa)   │ │
│ └─────────────────────────────────────────┘ │
│                                             │
│ Tên người gửi                               │
│ ┌─────────────────────────────────────────┐ │
│ │ Phòng Kinh doanh ViLead       (khóa)   │ │
│ └─────────────────────────────────────────┘ │
│                                             │
│ ℹ️ Tên và email được quản lý trên Brevo.    │
│    Để thay đổi, vui lòng vào Brevo dashboard│
│                                             │
│ Quyền sử dụng Email *                      │
│ ┌─────────────────────────────────────┐ ▼  │
│ │ Toàn bộ thành viên dự án           │    │
│ └─────────────────────────────────────┘    │
│                                             │
│              [Hủy bỏ]   [Lưu thay đổi]     │
└─────────────────────────────────────────────┘
```

**SO SÁNH VỚI POPUP "CHỈNH SỬA" CŨ:**

| Phần | CŨ | MỚI |
|------|-----|-----|
| Email | Readonly | Giữ readonly |
| Tên người gửi | **Cho phép sửa** | **ĐỔI → Readonly** (quản lý trên Brevo) |
| Quyền sử dụng | Cho phép sửa | Giữ cho phép sửa |
| Thông báo | Không có | **THÊM info text**: "Tên và email được quản lý trên Brevo..." |
| Tên popup | "Chỉnh sửa thông tin email" | **ĐỔI → "Phân quyền Sender"** |

### 2.5 Vô hiệu hóa / Kích hoạt lại Sender

Khi nhấn icon ⏸️ trên dòng Sender:

**Vô hiệu hóa (Sender đang hoạt động):**
```
- Kiểm tra: Sender có đang dùng trong chiến dịch "Đang chạy"?
  → Có: Toast error "Không thể vô hiệu hóa. Sender đang được dùng trong chiến dịch đang chạy."
  → Không: Confirm dialog "Vô hiệu hóa sender sales@vilead.vn? Sender sẽ không xuất hiện khi tạo chiến dịch mới."
    → Xác nhận: cập nhật trạng thái ViLead = "Đã vô hiệu", icon đổi thành ▶️ (kích hoạt lại)
```

**Kích hoạt lại (Sender đã vô hiệu):**
```
- Không cần confirm
- Cập nhật trạng thái ViLead = "Hoạt động"
- Toast success: "Đã kích hoạt lại sender"
- Icon đổi thành ⏸️
```

**LƯU Ý: KHÔNG gọi Brevo API khi vô hiệu hóa. Chỉ thay đổi trạng thái trong database ViLead.**

### 2.6 Sync Sender từ Brevo

**Tự động sync:**
```
- Trigger: Lần đầu kết nối + mỗi 15 phút (background job)
- Gọi: GET https://api.brevo.com/v3/senders
- Xử lý response:
  → Sender mới (có trên Brevo, chưa có trong ViLead): thêm vào database, quyền mặc định = "Toàn bộ thành viên"
  → Sender bị xóa trên Brevo (có trong ViLead, không có trên Brevo): soft-delete, ẩn khỏi bảng
  → Sender đã có: cập nhật tên và trạng thái xác thực từ Brevo
```

**Thủ công sync (nút "Làm mới"):**
```
- Click → icon spin animation
- Gọi API tương tự tự động sync
- Sau khi xong: Toast "Đã cập nhật danh sách Sender" + dừng spin
```

---

## 3. SUB-TAB CẬP NHẬT: "Giới hạn gửi email"

### 3.1 Khi chưa kết nối Brevo

Hiển thị banner tương tự sub-tab Cấu hình email gửi:

```
⚠️ Vui lòng kết nối Brevo trước để xem giới hạn gửi email.
   [Đi tới Kết nối Brevo →]
```

### 3.2 Khi đã kết nối Brevo

**BỎ hoàn toàn:**
- Card "Giới hạn theo email người gửi" (100 email/ngày/email gửi) → XÓA
- Card "Khoảng cách giữa các email" (5 giây) → XÓA
- Dòng "Với cấu hình hiện tại, hệ thống có thể gửi tối đa 720 email/giờ" → XÓA
- Nút "Lưu thay đổi" → XÓA

**GIỮ và SỬA:**
- Card "Giới hạn gửi theo ngày" → chuyển input thành **read-only text**
- Card "Giới hạn gửi theo tháng" → chuyển input thành **read-only text**
- Progress bar "Đã sử dụng" → giữ nguyên, dữ liệu từ Brevo

**THÊM MỚI:**
- Card "Thông tin Brevo Plan" (bên dưới)

### Layout mới:

```
┌─────────────────────────────────────────────────────────────────┐
│ Giới hạn gửi email                                             │
│ Giới hạn gửi email tự động theo gói Brevo của bạn              │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ ┌───────────────────────────┐ ┌───────────────────────────┐    │
│ │ Giới hạn gửi theo ngày   │ │ Giới hạn gửi theo tháng  │    │
│ │                           │ │                           │    │
│ │ 300 email/ngày            │ │ 9,000 email/tháng         │    │
│ │ (Theo gói Brevo Free)    │ │ (Theo gói Brevo Free)    │    │
│ │                           │ │                           │    │
│ │ Đã sử dụng:  210 / 300   │ │ Đã sử dụng: 2,500/9,000 │    │
│ │ ████████████░░░░ 70%      │ │ ████░░░░░░░░░░░░ 28%     │    │
│ │                           │ │                           │    │
│ │ Reset sau: 6 giờ          │ │ Reset sau: 22 ngày        │    │
│ └───────────────────────────┘ └───────────────────────────┘    │
│                                                                 │
│ ┌───────────────────────────────────────────────────────────┐  │
│ │ Thông tin gói Brevo                                       │  │
│ │                                                           │  │
│ │ Plan hiện tại:  [Free]                                    │  │
│ │ Giới hạn:       300 email/ngày                            │  │
│ │                                                           │  │
│ │ [Nâng cấp plan Brevo →]  (link, mở tab mới)             │  │
│ └───────────────────────────────────────────────────────────┘  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Chi tiết thay đổi từng card:**

**Card "Giới hạn gửi theo ngày" (SỬA):**

| Phần | CŨ | MỚI |
|------|-----|-----|
| Giá trị giới hạn | `<input type="number" value="500">` email/ngày | **ĐỔI → text tĩnh** `"300 email/ngày"` (từ Brevo API) |
| Mô tả | "Số lượng email tối đa có thể gửi trong một ngày" | **ĐỔI → "(Theo gói Brevo {plan_name})"** |
| Progress bar | Giữ nguyên | Giữ nguyên, data từ Brevo API `GET /account` field `plan[0].credits` |
| "Đã sử dụng" | Giữ nguyên | Giữ nguyên format `X / Y` |
| "Reset sau" | "Đã hết hạn" | Giữ nguyên, tính countdown đến 00:00 UTC |

**Card "Giới hạn gửi theo tháng" (SỬA):**
- Tương tự card ngày, thay đổi y hệt
- Reset countdown tính đến ngày 1 tháng tiếp theo

**Card "Thông tin gói Brevo" (MỚI):**

| Component | Spec |
|-----------|------|
| Card container | Full-width, background `#F9FAFB`, border `1px solid #E5E7EB`, border-radius 8px, padding 20px |
| Plan badge | Tương tự badge ở sub-tab Kết nối Brevo |
| Link nâng cấp | `href="https://app.brevo.com/billing"`, `target="_blank"`, style primary link button |

**Cảnh báo quota:**

```
Khi đạt 80% giới hạn (ngày hoặc tháng):
→ Progress bar đổi màu vàng (#F59E0B)
→ Thêm badge "Gần hết quota" (vàng) phía trên card

Khi đạt 100%:
→ Progress bar đổi màu đỏ (#DC2626)
→ Thêm badge "Đã hết quota" (đỏ)
→ Hiển thị alert: "Đã hết quota gửi email. Nâng cấp gói Brevo để tiếp tục. [Nâng cấp →]"
```

**API call để lấy dữ liệu quota:**

```
GET https://api.brevo.com/v3/account
Response chứa:
- plan[]: array plans, mỗi plan có type, credits, creditsType
- email.count: số email đã gửi trong kỳ hiện tại

Mapping:
- Giới hạn ngày: plan[0].credits (nếu creditsType = "sendLimit")
- Đã dùng: response tổng hợp từ credits đã tiêu
- Plan name: plan[0].type (free/starter/business/enterprise)
```

---

## 4. Ảnh hưởng đến các tab khác

Khi Brevo chưa kết nối hoặc hết quota, cần xử lý ở các tab khác trong module Email Marketing:

### 4.1 Tab "Chiến dịch mail"

| Tình huống | Xử lý |
|------------|--------|
| Chưa kết nối Brevo | Nút "Gửi" / "Lên lịch gửi" trong chiến dịch: `disabled` + tooltip `"Vui lòng kết nối Brevo trước"` |
| Hết quota Brevo | Nút "Gửi" / "Lên lịch gửi": `disabled` + tooltip `"Đã hết quota Brevo. Nâng cấp plan để tiếp tục."` |
| Đã kết nối, còn quota | Hoạt động bình thường |

### 4.2 Tab "Thư viện mẫu"

Không ảnh hưởng. Tạo/sửa mẫu không cần Brevo.

### 4.3 Tab "Báo cáo chất lượng"

| Tình huống | Xử lý |
|------------|--------|
| Chưa kết nối | Hiển thị dữ liệu cũ (nếu có). Banner nhỏ: "Kết nối Brevo để xem báo cáo mới nhất" |
| Đã kết nối | Pull data báo cáo từ Brevo API (`GET /smtp/statistics/events`) |

### 4.4 Dropdown chọn người gửi (trong form tạo chiến dịch)

```
CŨ:  Dropdown hiển thị tất cả email trạng thái "Đã kích hoạt" + user có quyền
MỚI: Dropdown hiển thị tất cả Sender thỏa mãn 3 điều kiện:
     1. Trạng thái Brevo = "Đã xác thực"
     2. Trạng thái ViLead = "Hoạt động" (không bị vô hiệu hóa)
     3. User hiện tại có quyền sử dụng Sender đó
```

---

## 5. Database changes

### 5.1 Bảng mới: `brevo_connection`

```sql
CREATE TABLE brevo_connection (
  id            UUID PRIMARY KEY,
  organization_id UUID NOT NULL REFERENCES organizations(id),
  api_key_encrypted TEXT NOT NULL,          -- API Key mã hóa (AES-256)
  brevo_company_name VARCHAR(255),
  brevo_email   VARCHAR(255),
  brevo_plan    VARCHAR(50),                -- free / starter / business / enterprise
  status        VARCHAR(20) DEFAULT 'active', -- active / error / disconnected
  connected_at  TIMESTAMP NOT NULL DEFAULT NOW(),
  last_check_at TIMESTAMP,
  created_by    UUID REFERENCES users(id),
  UNIQUE(organization_id)                   -- 1 org = 1 Brevo connection
);
```

### 5.2 Sửa bảng: `email_senders`

```sql
-- Thêm cột mới
ALTER TABLE email_senders ADD COLUMN brevo_sender_id BIGINT;    -- ID sender trên Brevo
ALTER TABLE email_senders ADD COLUMN brevo_status VARCHAR(20);   -- active / pending
ALTER TABLE email_senders ADD COLUMN vilead_status VARCHAR(20) DEFAULT 'active'; -- active / disabled
ALTER TABLE email_senders ADD COLUMN synced_at TIMESTAMP;

-- Bỏ cột cũ (nếu có)
-- ALTER TABLE email_senders DROP COLUMN verification_token;
-- ALTER TABLE email_senders DROP COLUMN verification_expires_at;
-- ALTER TABLE email_senders DROP COLUMN domain_verified;
```

### 5.3 Bỏ bảng / cột liên quan cơ chế cũ

```sql
-- Bỏ bảng giới hạn gửi (nếu có riêng)
-- DROP TABLE IF EXISTS email_sending_limits;

-- Hoặc bỏ các cột giới hạn thủ công trong bảng settings
-- ALTER TABLE email_settings DROP COLUMN daily_limit;
-- ALTER TABLE email_settings DROP COLUMN monthly_limit;
-- ALTER TABLE email_settings DROP COLUMN per_sender_limit;
-- ALTER TABLE email_settings DROP COLUMN send_interval_seconds;
```

---

## 6. API Endpoints cần tạo / sửa

### 6.1 Endpoints mới

```
POST   /api/email-marketing/brevo/connect       — Validate + lưu API Key
DELETE /api/email-marketing/brevo/disconnect     — Ngắt kết nối
GET    /api/email-marketing/brevo/status         — Lấy trạng thái kết nối + info account
POST   /api/email-marketing/brevo/check          — Kiểm tra kết nối thủ công
POST   /api/email-marketing/senders/sync         — Trigger sync Sender từ Brevo
POST   /api/email-marketing/senders/add          — Thêm Sender qua Brevo API
GET    /api/email-marketing/brevo/quota          — Lấy quota hiện tại từ Brevo
```

### 6.2 Endpoints sửa

```
GET    /api/email-marketing/senders              — Sửa: lấy từ DB (đã sync từ Brevo) thay vì dữ liệu cũ
PUT    /api/email-marketing/senders/:id/permission — Sửa: chỉ cho sửa quyền, không cho sửa tên
PUT    /api/email-marketing/senders/:id/toggle   — Mới: toggle vô hiệu hóa / kích hoạt
```

### 6.3 Endpoints bỏ

```
POST   /api/email-marketing/senders/:id/verify   — BỎ (Brevo xử lý xác thực)
POST   /api/email-marketing/senders/:id/resend-verification — BỎ
PUT    /api/email-marketing/settings/limits       — BỎ (không cấu hình thủ công nữa)
DELETE /api/email-marketing/senders/:id           — BỎ (chỉ vô hiệu hóa, không xóa)
```

---

## 7. Brevo API Reference

Các endpoint Brevo sử dụng trong tích hợp:

| Mục đích | Method | Endpoint | Header |
|----------|--------|----------|--------|
| Validate API Key + lấy info | GET | `https://api.brevo.com/v3/account` | `api-key: {key}` |
| Lấy danh sách Sender | GET | `https://api.brevo.com/v3/senders` | `api-key: {key}` |
| Tạo Sender mới | POST | `https://api.brevo.com/v3/senders` | `api-key: {key}` |
| Lấy thống kê gửi | GET | `https://api.brevo.com/v3/smtp/statistics/aggregatedReport` | `api-key: {key}` |

Docs: https://developers.brevo.com/reference/getting-started-1
