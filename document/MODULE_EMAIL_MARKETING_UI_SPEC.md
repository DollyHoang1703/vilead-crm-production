# MODULE 3.10: EMAIL MARKETING - UI SPECIFICATION

> **Mục đích**: Tài liệu này mô tả chi tiết UI/UX cho Module Email Marketing của CRM ViLead.
> **Dành cho**: AI Coding Assistants (Copilot, Claude Code) để generate UI components.

---

## 📋 MỤC LỤC

1. [Tổng quan Module](#1-tổng-quan-module)
2. [Task 10.1: Cấu hình Email gửi](#2-task-101-cấu-hình-email-gửi)
3. [Task 10.2: Thư viện mẫu Email](#3-task-102-thư-viện-mẫu-email)
4. [Task 10.3: Chiến dịch Email thường](#4-task-103-chiến-dịch-email-thường)
5. [Task 10.4: Chiến dịch A/B Testing](#5-task-104-chiến-dịch-ab-testing)
6. [Task 10.5: Báo cáo & Thống kê](#6-task-105-báo-cáo--thống-kê)
7. [Data Models](#7-data-models)
8. [UI Components Library](#8-ui-components-library)

---

## 1. TỔNG QUAN MODULE

### 1.1 Menu Structure
```
📧 Email Marketing
├── 📋 Chiến dịch mail          → /email-marketing/campaigns
├── 📚 Thư viện mẫu             → /email-marketing/templates
├── 📊 Báo cáo chất lượng email → /email-marketing/reports
└── ⚙️ Cài đặt
    ├── Cấu hình email gửi      → /settings/email-config
    └── Giới hạn gửi email      → /settings/email-limits
```

### 1.2 User Roles & Permissions
| Feature | Admin | Leader | User |
|---------|-------|--------|------|
| Cấu hình email gửi | ✅ Full | ❌ | ✅ Limited |
| Thư viện mẫu | ✅ Full | ✅ View | ✅ Own |
| Chiến dịch email | ✅ All | ✅ All | ✅ Own |
| Báo cáo | ✅ All | ✅ All | ✅ Own |
| Cài đặt giới hạn | ✅ Only | ❌ | ❌ |

---

## 2. TASK 10.1: CẤU HÌNH EMAIL GỬI

### 2.1 Màn hình: Danh sách Email đã cấu hình

**Route**: `/settings/email-config`

**Layout**:
```
┌─────────────────────────────────────────────────────────────────┐
│ [Breadcrumb: Cài đặt > Cấu hình email gửi]                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Cấu hình email gửi                        [+ Thêm mới] (btn)   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ 🔍 Tìm kiếm theo email, tên người gửi...               │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │ Email          │ Người gửi │ Ngày tạo  │ Trạng thái │ Quyền ││
│  │                │           │           │            │ sử dụng││
│  ├────────────────┼───────────┼───────────┼────────────┼───────┤│
│  │ sale@abc.vn    │ Công ty A │ 15/01/25  │ 🟢 Đã kích │ Có    ││
│  │                │           │           │    hoạt    │       ││
│  ├────────────────┼───────────┼───────────┼────────────┼───────┤│
│  │ info@xyz.com   │ Marketing │ 10/01/25  │ 🟡 Chờ xác │ Có    ││
│  │                │           │           │    thực    │       ││
│  ├────────────────┼───────────┼───────────┼────────────┼───────┤│
│  │ test@gmail.com │ Test User │ 05/01/25  │ 🔴 Domain  │ Không ││
│  │                │           │           │ chưa xác   │       ││
│  │                │           │           │ thực       │       ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Table Columns**:
| Column | Type | Description |
|--------|------|-------------|
| email | string | Địa chỉ email |
| sender_name | string | Tên hiển thị khi gửi |
| created_at | datetime | Thời điểm thêm email |
| status | enum | `activated` / `pending` / `domain_unverified` |
| has_permission | boolean | User có quyền sử dụng không |
| actions | buttons | Chỉnh sửa, Menu (...) |

**Status Badge Colors**:
```css
.status-activated { background: #10B981; } /* Green */
.status-pending { background: #F59E0B; }   /* Yellow */
.status-domain-unverified { background: #EF4444; } /* Red */
```

**Row Actions Menu (...):**
- Chỉnh sửa
- Vô hiệu hóa (Admin only)
- Xóa (Admin only)
- Gửi lại email xác thực (if status = pending)

---

### 2.2 Popup: Thêm email người gửi mới

**Trigger**: Click button `[+ Thêm mới]`

**UI Structure**:
```
┌─────────────────────────────────────────────────────────────┐
│ ╳                           Thêm email người gửi mới        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Địa chỉ Email người gửi *                                  │
│  ┌─────────────────────────────────────────────────────┐    │
│  │ Địa chỉ Email người gửi, phải là email doanh        │    │
│  │ nghiệp để tránh bị spam                             │    │
│  └─────────────────────────────────────────────────────┘    │
│  ⚠️ Khuyến nghị dùng email doanh nghiệp (không phải        │
│     @gmail.com, @yahoo.com)                                 │
│                                                             │
│  Tên người gửi *                                            │
│  ┌─────────────────────────────────────────────────────┐    │
│  │ Nhập tên bạn muốn khách hàng của mình nhìn thấy     │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                             │
│  Quyền sử dụng Email này *                                  │
│  ┌─────────────────────────────────────────────────────┐    │
│  │ Toàn bộ thành viên dự án                         ▼  │    │
│  └─────────────────────────────────────────────────────┘    │
│  Options:                                                   │
│  - Toàn bộ thành viên dự án                                 │
│  - Chỉ tôi                                                  │
│  - Chọn thành viên cụ thể → Opens member picker             │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                          [Hủy bỏ]  [Thêm và xác nhận]       │
└─────────────────────────────────────────────────────────────┘
```

**Form Validation**:
```typescript
interface AddEmailForm {
  email: string;        // required, email format, unique in system
  sender_name: string;  // required, max 100 chars
  permission: 'all' | 'me' | 'specific';
  specific_members?: string[]; // required if permission = 'specific'
}
```

**After Submit Flow**:
1. Validate form
2. Check email uniqueness
3. Create record with status = `pending`
4. Send verification email (within 30 seconds)
5. Show success toast: "Đã gửi email xác thực đến [email]"
6. Close popup, refresh list

---

### 2.3 Popup: Chỉnh sửa thông tin email

**UI Structure**:
```
┌─────────────────────────────────────────────────────────────┐
│ ╳                           Chỉnh sửa thông tin email       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Địa chỉ Email                                              │
│  ┌─────────────────────────────────────────────────────┐    │
│  │ sale@abc.vn                              (readonly) │    │
│  └─────────────────────────────────────────────────────┘    │
│  🔒 Không thể thay đổi địa chỉ email                        │
│                                                             │
│  Tên người gửi *                                            │
│  ┌─────────────────────────────────────────────────────┐    │
│  │ Công ty ABC                                         │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                             │
│  Quyền sử dụng Email này *                                  │
│  ┌─────────────────────────────────────────────────────┐    │
│  │ Toàn bộ thành viên dự án                         ▼  │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                            [Hủy bỏ]  [Lưu thay đổi]         │
└─────────────────────────────────────────────────────────────┘
```

---

### 2.4 Màn hình: Cài đặt giới hạn gửi email

**Route**: `/settings/email-limits`
**Permission**: Admin only

**UI Structure**:
```
┌─────────────────────────────────────────────────────────────────┐
│ [Breadcrumb: Cài đặt > Giới hạn gửi email]                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Giới hạn gửi email                                             │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ Giới hạn gửi theo ngày                                  │    │
│  │ ┌──────────┐                                            │    │
│  │ │   500    │ email/ngày                                 │    │
│  │ └──────────┘                                            │    │
│  │                                                         │    │
│  │ Đã sử dụng hôm nay: 350 / 500                           │    │
│  │ [████████████████████░░░░░░] 70%                        │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ Giới hạn gửi theo tháng                                 │    │
│  │ ┌──────────┐                                            │    │
│  │ │  10000   │ email/tháng                                │    │
│  │ └──────────┘                                            │    │
│  │                                                         │    │
│  │ Đã sử dụng tháng này: 2500 / 10000                      │    │
│  │ [██████░░░░░░░░░░░░░░░░░░░░] 25%                        │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ Giới hạn theo email người gửi                           │    │
│  │ ┌──────────┐                                            │    │
│  │ │   100    │ email/ngày/email gửi                       │    │
│  │ └──────────┘                                            │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ Khoảng cách giữa các email                              │    │
│  │ ┌──────────┐                                            │    │
│  │ │    5     │ giây                                       │    │
│  │ └──────────┘                                            │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                 │
│                                              [Lưu thay đổi]     │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Progress Bar Colors**:
```css
.progress-normal { background: #10B981; }  /* < 80% - Green */
.progress-warning { background: #F59E0B; } /* 80-90% - Yellow */
.progress-danger { background: #EF4444; }  /* > 90% - Red */
```

**Alert Thresholds**:
- 80%: Warning notification
- 90%: Critical notification  
- 100%: Block sending, show error

---

## 3. TASK 10.2: THƯ VIỆN MẪU EMAIL

### 3.1 Màn hình: Thư viện mẫu email

**Route**: `/email-marketing/templates`

**UI Structure**:
```
┌─────────────────────────────────────────────────────────────────┐
│ [Breadcrumb: Email Marketing > Thư viện mẫu]                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Thư viện mẫu                                                   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ [Mẫu Email có sẵn]  [Mẫu Email của bạn]                 │    │
│  │  ─────────────────   ─────────────────                  │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                 │
│  🔍 Tìm kiếm theo tên mẫu...                                    │
│                                                                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐              │
│  │ ┌─────────┐ │  │ ┌─────────┐ │  │             │              │
│  │ │         │ │  │ │         │ │  │      +      │              │
│  │ │ Preview │ │  │ │ Preview │ │  │             │              │
│  │ │  Image  │ │  │ │  Image  │ │  │   Tạo mới   │              │
│  │ │         │ │  │ │         │ │  │             │              │
│  │ └─────────┘ │  │ └─────────┘ │  │  Thỏa sức   │              │
│  │             │  │             │  │  sáng tạo   │              │
│  │ Mẫu chào    │  │ Mẫu khuyến │  │  nội dung   │              │
│  │ mừng        │  │ mãi        │  │  email...   │              │
│  │             │  │             │  │             │              │
│  │ [Hover:     │  │ [Hover:     │  │             │              │
│  │  Xem trước  │  │  Xem trước  │  │             │              │
│  │  Tạo bản sao│  │  Tạo bản sao│  │             │              │
│  │ ]           │  │ ]           │  │             │              │
│  └─────────────┘  └─────────────┘  └─────────────┘              │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Grid Card Component**:
```typescript
interface TemplateCard {
  id: string;
  name: string;
  thumbnail_url: string;
  type: 'system' | 'user';
  owner_id?: string;
  created_at: datetime;
  updated_at: datetime;
}
```

**Hover Actions**:
- Tab "Mẫu có sẵn": `Xem trước`, `Tạo bản sao`
- Tab "Mẫu của bạn": `Xem trước`, `Tạo bản sao`, `Chỉnh sửa`, `Xóa`

---

### 3.2 Popup: Xem trước mẫu email

**Trigger**: Click `Xem trước` on template card

**UI Structure**:
```
┌─────────────────────────────────────────────────────────────────┐
│ ╳                                                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Mẫu chào mừng khách hàng mới                                   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ [💻 Desktop]  [📱 Mobile]                               │    │
│  │  ───────────   ─────────                                │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                                                         │    │
│  │                    EMAIL PREVIEW                        │    │
│  │                                                         │    │
│  │  Xin chào {ten_khach},                                  │    │
│  │           ═══════════ (highlighted variable)            │    │
│  │                                                         │    │
│  │  Cảm ơn bạn đã đăng ký...                               │    │
│  │                                                         │    │
│  │  [Variables highlighted with different background]      │    │
│  │                                                         │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│            [Đóng]  [Tạo bản sao]  [Sử dụng ngay]                │
└─────────────────────────────────────────────────────────────────┘
```

**Preview Modes**:
- Desktop: Full width (600px email width)
- Mobile: 375px viewport simulation

**Variable Highlighting**:
```css
.variable-placeholder {
  background: #FEF3C7;
  padding: 2px 4px;
  border-radius: 4px;
  color: #92400E;
}
```

---

### 3.3 Màn hình: Editor mẫu email

**Route**: `/email-marketing/templates/new` hoặc `/email-marketing/templates/:id/edit`

**UI Structure**:
```
┌─────────────────────────────────────────────────────────────────────────┐
│ ← Quay lại                              [Xem trước]  [Import HTML]      │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  Tên thư mẫu *                                                          │
│  ┌─────────────────────────────────────────────────────────────────┐    │
│  │ Nhập tên mẫu email...                                           │    │
│  └─────────────────────────────────────────────────────────────────┘    │
│                                                                         │
│  Nội dung mail                                                          │
│  ┌─────────────────────────────────────────────────────────────────┐    │
│  │ ┌─────────────────────────────────────────────────────────────┐ │    │
│  │ │ B  I  U  S │ ≡ ≡ ≡ │ • 1. │ 🔗 🖼 📊 │ </> │ {x} │ ⚙️ │    │ │    │
│  │ │ Bold Italic│ Align │ Lists│ Link Img │ HTML│ Var │Font│    │ │    │
│  │ └─────────────────────────────────────────────────────────────┘ │    │
│  │                                                                 │    │
│  │  ┌─────────────────────────────────────────────────────────┐   │    │
│  │  │                                                         │   │    │
│  │  │                    RICH TEXT EDITOR                     │   │    │
│  │  │                                                         │   │    │
│  │  │  Type your email content here...                        │   │    │
│  │  │                                                         │   │    │
│  │  │                                                         │   │    │
│  │  └─────────────────────────────────────────────────────────┘   │    │
│  └─────────────────────────────────────────────────────────────────┘    │
│                                                                         │
│  💾 Đã lưu tự động lúc 14:30:25                                         │
│                                                                         │
├─────────────────────────────────────────────────────────────────────────┤
│                                           [Quay lại]  [Lưu và tiếp tục] │
└─────────────────────────────────────────────────────────────────────────┘
```

**Toolbar Features**:
| Group | Features |
|-------|----------|
| Format | Bold, Italic, Underline, Strikethrough |
| Align | Left, Center, Right, Justify |
| Lists | Bullet, Numbered |
| Insert | Link, Image, Table |
| Special | HTML code, Cá nhân hóa (Variables), Trường hệ thống |
| Font | Kiểu chữ, Phông, Cỡ chữ, Line Height |

**Variables Dropdown ({x} button)**:
```
┌─────────────────────────────────┐
│ Cá nhân hóa                     │
├─────────────────────────────────┤
│ 👤 Khách hàng                   │
│   {ten_khach} - Tên khách hàng  │
│   {email_khach} - Email         │
│   {sdt_khach} - Số điện thoại   │
│   {cong_ty} - Tên công ty       │
├─────────────────────────────────┤
│ 📦 Đơn hàng                     │
│   {ma_don} - Mã đơn hàng        │
│   {san_pham} - Sản phẩm         │
│   {gia_tri} - Giá trị đơn       │
│   {ngay_dat} - Ngày đặt         │
├─────────────────────────────────┤
│ ⚙️ Hệ thống                     │
│   {ngay_hien_tai} - Ngày hiện tại│
│   {ten_cong_ty} - Tên công ty   │
└─────────────────────────────────┘
```

**Fallback Syntax**: `{ten_khach|Quý khách}` - Nếu không có tên, hiển thị "Quý khách"

---

### 3.4 Popup: Import HTML

**UI Structure**:
```
┌─────────────────────────────────────────────────────────────┐
│ ╳                                Import HTML                │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Option 1: Upload file                                      │
│  ┌─────────────────────────────────────────────────────┐    │
│  │                                                     │    │
│  │         📁 Kéo thả file .html vào đây              │    │
│  │            hoặc click để chọn file                  │    │
│  │                                                     │    │
│  │         Max size: 500KB                             │    │
│  │                                                     │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                             │
│  ─────────────────── HOẶC ───────────────────               │
│                                                             │
│  Option 2: Paste HTML code                                  │
│  ┌─────────────────────────────────────────────────────┐    │
│  │                                                     │    │
│  │  <html>                                             │    │
│  │    <body>                                           │    │
│  │      ...                                            │    │
│  │    </body>                                          │    │
│  │  </html>                                            │    │
│  │                                                     │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                             │
│  ⚠️ Script tags sẽ bị loại bỏ tự động vì lý do bảo mật      │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                              [Hủy]  [Import và xem trước]   │
└─────────────────────────────────────────────────────────────┘
```

**HTML Sanitization Rules**:
- Remove: `<script>`, `onclick`, `onerror`, `onload`, etc.
- Keep: Inline styles
- Convert: Relative URLs → Absolute URLs

---

### 3.5 Drag & Drop Editor Mode

**UI Structure**:
```
┌─────────────────────────────────────────────────────────────────────────┐
│ ← Quay lại                    [📝 Editor]  [🧩 Kéo thả]  [Xem trước]    │
├───────────────────┬─────────────────────────────────────────────────────┤
│                   │                                                     │
│  BLOCKS           │                  CANVAS                             │
│                   │                                                     │
│  ┌─────────────┐  │  ┌─────────────────────────────────────────────┐    │
│  │ 📝 Text     │  │  │                                             │    │
│  └─────────────┘  │  │  [Block 1: Header Image]                    │    │
│  ┌─────────────┐  │  │                                             │    │
│  │ 🖼 Image    │  │  │  ─────────────────────────                  │    │
│  └─────────────┘  │  │                                             │    │
│  ┌─────────────┐  │  │  [Block 2: Text Content]                    │    │
│  │ 🔘 Button   │  │  │  Xin chào {ten_khach}...                    │    │
│  └─────────────┘  │  │                                             │    │
│  ┌─────────────┐  │  │  ─────────────────────────                  │    │
│  │ ─ Divider   │  │  │                                             │    │
│  └─────────────┘  │  │  [Block 3: CTA Button]                      │    │
│  ┌─────────────┐  │  │  [    Xem ngay    ]                         │    │
│  │ ⬜ Spacer   │  │  │                                             │    │
│  └─────────────┘  │  │  ─────────────────────────                  │    │
│  ┌─────────────┐  │  │                                             │    │
│  │ ▢▢ Columns  │  │  │  [Drop zone - Kéo block vào đây]           │    │
│  │ (2,3,4 cột)│  │  │                                             │    │
│  └─────────────┘  │  │                                             │    │
│  ┌─────────────┐  │  └─────────────────────────────────────────────┘    │
│  │ 📱 Social   │  │                                                     │
│  └─────────────┘  │  [↩️ Undo]  [↪️ Redo]                               │
│                   │                                                     │
└───────────────────┴─────────────────────────────────────────────────────┘
```

**Block Types**:
```typescript
type BlockType = 
  | 'text'      // Rich text content
  | 'image'     // Single image
  | 'button'    // CTA button
  | 'divider'   // Horizontal line
  | 'spacer'    // Vertical spacing
  | 'columns'   // 2, 3, or 4 column layout
  | 'social';   // Social media icons

interface Block {
  id: string;
  type: BlockType;
  properties: Record<string, any>;
  order: number;
}
```

**Constraints**:
- Max 50 blocks per template
- Auto-save on every change
- Undo/Redo support (max 20 steps)

---

## 4. TASK 10.3: CHIẾN DỊCH EMAIL THƯỜNG

### 4.1 Màn hình: Danh sách chiến dịch

**Route**: `/email-marketing/campaigns`

**UI Structure**:
```
┌─────────────────────────────────────────────────────────────────────────┐
│ [Breadcrumb: Email Marketing > Chiến dịch mail]                         │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  Chiến dịch mail                              [+ Tạo chiến dịch mới]    │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐    │
│  │ [Tất cả] [Mới] [Đang chờ] [Đang chạy] [Tạm dừng] [Đã gửi]       │    │
│  │  ═══════                                                        │    │
│  └─────────────────────────────────────────────────────────────────┘    │
│                                                                         │
│  Nhóm chiến dịch: [Tất cả        ▼]   🔍 Tìm kiếm theo tên...           │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────────┐│
│  │ Tên              │ Trạng thái │ Ngày   │ Ngày   │ Khách │ Thành │ Đã ││
│  │                  │            │ tạo    │ chạy   │ hàng  │ công  │ mở ││
│  ├──────────────────┼────────────┼────────┼────────┼───────┼───────┼────┤│
│  │ [A/B] Chiến dịch │ 🟢 Đã gửi │ 15/01  │ 16/01  │ 500   │ 485   │ 210││
│  │ Tết 2025         │            │        │        │       │       │    ││
│  ├──────────────────┼────────────┼────────┼────────┼───────┼───────┼────┤│
│  │ Sale cuối năm    │ 🔵 Đang   │ 14/01  │ 15/01  │ 1000  │ 450   │ 120││
│  │                  │    chạy    │        │        │       │       │    ││
│  ├──────────────────┼────────────┼────────┼────────┼───────┼───────┼────┤│
│  │ Welcome email    │ 🟡 Đang   │ 13/01  │ 17/01  │ 200   │ -     │ -  ││
│  │                  │    chờ     │        │        │       │       │    ││
│  └─────────────────────────────────────────────────────────────────────┘│
│                                                                         │
│  Hiển thị: [10 ▼] bản ghi/trang           < 1 2 3 ... 10 >              │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

**Status Badges**:
```typescript
type CampaignStatus = 
  | 'draft'      // 🔵 Mới (xanh dương)
  | 'scheduled'  // 🟡 Đang chờ (vàng)
  | 'running'    // 🟢 Đang chạy (xanh lá) - highlight row
  | 'paused'     // 🟠 Tạm dừng (cam)
  | 'sent'       // ⚫ Đã gửi (xám)
  | 'cancelled'; // 🔴 Đã hủy (đỏ)
```

**Row Actions**:
- Draft: `Chỉnh sửa`, `Xóa`
- Scheduled: `Chỉnh sửa`, `Hủy chiến dịch`, `Tạo bản sao`
- Running: `Tạm dừng`, `Chi tiết`
- Paused: `Tiếp tục`, `Chi tiết`
- Sent: `Chi tiết`, `Tạo bản sao`, `Xóa`

---

### 4.2 Popup: Chọn loại chiến dịch

**Trigger**: Click `[+ Tạo chiến dịch mới]`

**UI Structure**:
```
┌─────────────────────────────────────────────────────────────┐
│ ╳                         Tạo chiến dịch mới                │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────────────────────────────────────────┐    │
│  │ [📧 Chiến dịch thường]  [🔀 Chiến dịch A/B]         │    │
│  │  ═══════════════════                                │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                             │
│  Tên chiến dịch *                                           │
│  ┌─────────────────────────────────────────────────────┐    │
│  │ Chiến dịch 31/01/2025                               │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                   [Hủy]  [Bắt đầu]          │
└─────────────────────────────────────────────────────────────┘
```

---

### 4.3 Màn hình: Chi tiết chiến dịch (Checklist)

**Route**: `/email-marketing/campaigns/:id/edit`

**UI Structure**:
```
┌─────────────────────────────────────────────────────────────────────────┐
│ ← Quay lại                                                              │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  Chiến dịch Tết 2025                                    [Trạng thái: Mới]│
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐    │
│  │                                                                 │    │
│  │  ① Tiêu đề mail *                                               │    │
│  │  ┌─────────────────────────────────────────────────────────┐    │    │
│  │  │ ✅ Ưu đãi Tết 2025 dành riêng cho {ten_khach}           │    │    │
│  │  └─────────────────────────────────────────────────────────┘    │    │
│  │                                                                 │    │
│  │  ② Preview Text                                                 │    │
│  │  ┌─────────────────────────────────────────────────────────┐    │    │
│  │  │ ⬜ Nhập nội dung xem trước (hiển thị trong inbox)       │    │    │
│  │  └─────────────────────────────────────────────────────────┘    │    │
│  │                                                                 │    │
│  │  ③ Người gửi *                                                  │    │
│  │  ┌─────────────────────────────────────────────────────────┐    │    │
│  │  │ ✅ sale@company.vn (Công ty ABC)                        │    │    │
│  │  └─────────────────────────────────────────────────────────┘    │    │
│  │                                                                 │    │
│  │  ④ Người nhận *                                                 │    │
│  │  ┌─────────────────────────────────────────────────────────┐    │    │
│  │  │ ✅ 500 email hợp lệ                         [Thay đổi]  │    │    │
│  │  └─────────────────────────────────────────────────────────┘    │    │
│  │                                                                 │    │
│  │  ⑤ Nội dung email *                                             │    │
│  │  ┌─────────────────────────────────────────────────────────┐    │    │
│  │  │ ✅ Mẫu: "Ưu đãi Tết 2025"                   [Thay đổi]  │    │    │
│  │  │ [Thumbnail preview of template]                         │    │    │
│  │  └─────────────────────────────────────────────────────────┘    │    │
│  │                                                                 │    │
│  │  ⑥ File đính kèm                                                │    │
│  │  ┌─────────────────────────────────────────────────────────┐    │    │
│  │  │ ⬜ Không có file đính kèm                   [Thêm file] │    │    │
│  │  └─────────────────────────────────────────────────────────┘    │    │
│  │                                                                 │    │
│  └─────────────────────────────────────────────────────────────────┘    │
│                                                                         │
│  Hoàn thành: 4/5 mục bắt buộc                                           │
│  [████████████████████░░░░] 80%                                         │
│                                                                         │
├─────────────────────────────────────────────────────────────────────────┤
│                                  [Lưu nháp]  [Bắt đầu chiến dịch]       │
│                                              (disabled if < 100%)       │
└─────────────────────────────────────────────────────────────────────────┘
```

**Checklist Item States**:
- ✅ Completed (green checkmark)
- ⬜ Empty/Not completed
- ⚠️ Has warning (yellow)

---

### 4.4 Popup: Nhập tiêu đề email

**UI Structure**:
```
┌─────────────────────────────────────────────────────────────┐
│ ╳                              Tiêu đề email                │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Tiêu đề mail của bạn sẽ gửi là gì? *                       │
│  ┌─────────────────────────────────────────────────────┐    │
│  │ VD: Ưu đãi đặc biệt dành riêng cho bạn!             │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                   45/200    │
│                                                             │
│  Chèn biến: [{ten_khach} ▼]                                 │
│                                                             │
│  💡 Tips:                                                   │
│  • Tiêu đề nên từ 30-50 ký tự                               │
│  • Tránh từ spam: FREE, MIỄN PHÍ, KHUYẾN MÃI (viết hoa)     │
│                                                             │
│  ⚠️ Cảnh báo: Tiêu đề chứa từ "MIỄN PHÍ" có thể bị vào spam │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                         [Hủy]  [Lưu]        │
└─────────────────────────────────────────────────────────────┘
```

**Spam Keywords Detection**:
```javascript
const spamKeywords = [
  'FREE', 'MIỄN PHÍ', 'KHUYẾN MÃI', 
  '100%', 'GIẢM GIÁ', 'HOT', 'SALE'
];
// Detect ALL CAPS versions
```

---

### 4.5 Màn hình: Chọn người nhận

**Route**: Modal overlay

**UI Structure**:
```
┌─────────────────────────────────────────────────────────────────────────┐
│ ╳                                    Chọn người nhận                    │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  📊 Thống kê nhanh:                                                     │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐                                  │
│  │  1,500  │  │  1,450  │  │    50   │                                  │
│  │ Tổng KH │  │Email hợp│  │Email    │                                  │
│  │         │  │lệ       │  │không hợp│                                  │
│  └─────────┘  └─────────┘  └─────────┘                                  │
│                                                                         │
│  Bộ lọc:                                                                │
│  ┌─────────────────────────────────────────────────────────────────┐    │
│  │                                                                 │    │
│  │  Nhãn:        [VIP ▼] [Tiềm năng ▼] [Miền Bắc ▼] [+ Thêm]       │    │
│  │                                                                 │    │
│  │  Nguồn:       [Website ▼] [Zalo ▼] [Facebook ▼]                 │    │
│  │                                                                 │    │
│  │  Trạng thái:  [Mới ▼] [Đang chăm sóc ▼] [Đã mua ▼]              │    │
│  │                                                                 │    │
│  │  Ngày tạo:    [01/01/2025] đến [31/01/2025]                     │    │
│  │                                                                 │    │
│  └─────────────────────────────────────────────────────────────────┘    │
│                                                                         │
│  Options:                                                               │
│  ☑️ Loại trừ khách hàng đã gửi email trong 7 ngày gần đây               │
│  ☑️ Loại trừ khách hàng đã unsubscribe                                  │
│                                                                         │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━   │
│                                                                         │
│  Kết quả: 500 email hợp lệ / 550 khách hàng                             │
│                                                                         │
│  ⚠️ Cảnh báo: Số email vượt 80% giới hạn ngày (400/500)                 │
│                                                                         │
├─────────────────────────────────────────────────────────────────────────┤
│                                             [Hủy]  [Xác nhận]           │
└─────────────────────────────────────────────────────────────────────────┘
```

**Real-time Counter**: Updates as filters change

---

### 4.6 Popup: Cấu hình thời gian gửi

**UI Structure**:
```
┌─────────────────────────────────────────────────────────────┐
│ ╳                         Cấu hình thời gian gửi            │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ⦿ Gửi ngay                                                 │
│    Bắt đầu gửi ngay sau khi xác nhận                        │
│                                                             │
│  ○ Lên lịch                                                 │
│    ┌────────────────┐  ┌────────────────┐                   │
│    │ 📅 15/02/2025  │  │ ⏰ 09:00       │                   │
│    └────────────────┘  └────────────────┘                   │
│    Timezone: GMT+7 (Việt Nam)                               │
│                                                             │
│  ○ Gửi theo đợt (Batch)                                     │
│    ┌─────────────────────────────────────────────────┐      │
│    │ Lượt 1: [100] email vào [15/02/2025] [09:00]    │      │
│    │ Lượt 2: [100] email vào [15/02/2025] [14:00]    │      │
│    │ Lượt 3: [100] email vào [16/02/2025] [09:00]    │      │
│    │                                                 │      │
│    │ [+ Thêm lượt]                                   │      │
│    └─────────────────────────────────────────────────┘      │
│    ⚠️ Khoảng cách tối thiểu giữa các đợt: 1 giờ             │
│                                                             │
│  ⚠️ Cảnh báo: Giờ gửi từ 2h-6h sáng thường có tỷ lệ mở thấp │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                         [Hủy]  [Xác nhận]   │
└─────────────────────────────────────────────────────────────┘
```

**Batch Rules**:
- Max 10 batches per campaign
- Min 1 hour between batches
- Auto-distribute if quantity not specified

---

### 4.7 Popup: Xác nhận gửi chiến dịch

**UI Structure**:
```
┌─────────────────────────────────────────────────────────────┐
│ ╳                     Xác nhận gửi chiến dịch               │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  📋 Tóm tắt chiến dịch:                                     │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐    │
│  │ Tên:          Chiến dịch Tết 2025                   │    │
│  │ Người gửi:    sale@company.vn (Công ty ABC)         │    │
│  │ Người nhận:   500 email                             │    │
│  │ Thời gian:    Gửi ngay                              │    │
│  │ Ước tính:     Hoàn thành trong ~25 phút             │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                             │
│  ⚠️ Lưu ý quan trọng:                                       │
│  Sau khi bắt đầu, bạn không thể chỉnh sửa nội dung          │
│  chiến dịch. Chỉ có thể Tạm dừng hoặc Hủy.                  │
│                                                             │
│  ☑️ Tôi đã kiểm tra và xác nhận thông tin chính xác         │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                   [Hủy]  [Xác nhận gửi]     │
│                                          (disabled until    │
│                                           checkbox checked) │
└─────────────────────────────────────────────────────────────┘
```

---

### 4.8 Màn hình: Chi tiết chiến dịch đã gửi

**Route**: `/email-marketing/campaigns/:id/report`

**UI Structure**:
```
┌─────────────────────────────────────────────────────────────────────────┐
│ ← Quay lại                                              [Tạo bản sao]   │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  Chiến dịch Tết 2025                                [Trạng thái: Đã gửi]│
│  Ngày gửi: 15/01/2025 09:00                                             │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐    │
│  │                                                                 │    │
│  │  📊 TỔNG QUAN                                                   │    │
│  │                                                                 │    │
│  │  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐│    │
│  │  │   500   │  │   485   │  │    15   │  │   210   │  │    45   ││    │
│  │  │Tổng gửi │  │Thành    │  │Thất bại │  │Đã mở    │  │Đã click ││    │
│  │  │         │  │công 97% │  │3%       │  │43%      │  │9%       ││    │
│  │  └─────────┘  └─────────┘  └─────────┘  └─────────┘  └─────────┘│    │
│  │                                                                 │    │
│  └─────────────────────────────────────────────────────────────────┘    │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐    │
│  │                                                                 │    │
│  │  📈 BIỂU ĐỒ                                                     │    │
│  │                                                                 │    │
│  │  [Timeline mở/click]              [Pie: Tỷ lệ trạng thái]       │    │
│  │  ┌─────────────────────┐          ┌─────────────────────┐       │    │
│  │  │      /\    /\       │          │     ████████        │       │    │
│  │  │     /  \  /  \      │          │   ██      ██        │       │    │
│  │  │    /    \/    \     │          │  ██  97%   ██       │       │    │
│  │  │   /            \    │          │   ██      ██        │       │    │
│  │  │  /              \   │          │     ████████        │       │    │
│  │  │ 9h  12h  15h  18h   │          │  ■ Thành công       │       │    │
│  │  └─────────────────────┘          │  ■ Thất bại         │       │    │
│  │                                   └─────────────────────┘       │    │
│  └─────────────────────────────────────────────────────────────────┘    │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐    │
│  │                                                                 │    │
│  │  📋 DANH SÁCH CHI TIẾT                                          │    │
│  │                                                                 │    │
│  │  [Tất cả] [Thành công] [Đã mở] [Đã click] [Thất bại]            │    │
│  │   ═══════                                                       │    │
│  │                                                                 │    │
│  │  ┌───────────────────────────────────────────────────────────┐  │    │
│  │  │ Email        │ Tên KH   │Trạng thái│Gửi lúc  │Mở lúc     │  │    │
│  │  ├──────────────┼──────────┼──────────┼─────────┼───────────┤  │    │
│  │  │ a@mail.com   │ Nguyễn A │✅ Đã mở  │09:01    │09:15      │  │    │
│  │  │ b@mail.com   │ Trần B   │📧 Gửi OK │09:02    │-          │  │    │
│  │  │ c@mail.com   │ Lê C     │❌ Bounce │09:03    │-          │  │    │
│  │  └───────────────────────────────────────────────────────────┘  │    │
│  │                                                                 │    │
│  │  [Export Excel]                                                 │    │
│  │                                                                 │    │
│  └─────────────────────────────────────────────────────────────────┘    │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

**Recipient Status Icons**:
- ✅ Đã mở (opened)
- 🔗 Đã click (clicked)
- 📧 Gửi thành công (delivered)
- ❌ Bounce/Failed
- 🚫 Unsubscribed

---

## 5. TASK 10.4: CHIẾN DỊCH A/B TESTING

### 5.1 Màn hình: Cấu hình A/B Testing

**Route**: `/email-marketing/campaigns/:id/edit` (when type = 'ab')

**UI Structure - Chọn loại A/B**:
```
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│  [A/B] Chiến dịch Tết 2025                                              │
│                                                                         │
│  Chọn loại A/B Testing:                                                 │
│  ┌─────────────────────────────────────────────────────────────────┐    │
│  │                                                                 │    │
│  │  ⦿ 📧 Tiêu đề mail                                              │    │
│  │    So sánh 2 tiêu đề khác nhau để tìm tiêu đề có tỷ lệ mở      │    │
│  │    cao hơn                                                      │    │
│  │                                                                 │    │
│  │  ○ 📝 Nội dung mail                                             │    │
│  │    So sánh 2 mẫu nội dung khác nhau để tìm mẫu có tỷ lệ        │    │
│  │    click cao hơn                                                │    │
│  │                                                                 │    │
│  │  ○ ⏰ Thời gian gửi                                              │    │
│  │    So sánh 2 khung giờ gửi khác nhau để tìm thời điểm tối ưu   │    │
│  │                                                                 │    │
│  └─────────────────────────────────────────────────────────────────┘    │
│                                                                         │
│  💡 Tips: Chỉ thay đổi 1 yếu tố mỗi lần để kết quả A/B rõ ràng         │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

### 5.2 UI: Cấu hình A/B theo Tiêu đề

```
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│  Tiêu đề mail (A/B Testing)                                             │
│                                                                         │
│  Tiêu đề A:                                                             │
│  ┌─────────────────────────────────────────────────────────────────┐    │
│  │ 🎁 Ưu đãi Tết 2025 dành riêng cho bạn!                          │    │
│  └─────────────────────────────────────────────────────────────────┘    │
│                                                                         │
│  Tiêu đề B:                                                             │
│  ┌─────────────────────────────────────────────────────────────────┐    │
│  │ {ten_khach} ơi, đừng bỏ lỡ ưu đãi Tết này!                      │    │
│  └─────────────────────────────────────────────────────────────────┘    │
│                                                                         │
│  💡 Gợi ý: Thử nghiệm tiêu đề ngắn vs dài, có emoji vs không,          │
│     có tên khách hàng vs không...                                       │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

### 5.3 UI: Cài đặt tỷ lệ A/B

```
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│  Cài đặt chiến dịch A/B                                                 │
│                                                                         │
│  Tùy chỉnh tỷ lệ gửi mail:                                              │
│                                                                         │
│  Tỷ lệ gửi phiên bản A: [10] %                                          │
│  Tỷ lệ gửi phiên bản B: [10] %                                          │
│                                                                         │
│  ⚠️ Tổng tỷ lệ của A và B không quá 50%                                 │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐    │
│  │ ████ A    ████ B    ████████████████████████████████ Winner     │    │
│  │ 10%       10%                    80%                            │    │
│  │  🔴        🔵                     🏆                             │    │
│  └─────────────────────────────────────────────────────────────────┘    │
│                                                                         │
│  ─────────────────────────────────────────────────────────────────      │
│                                                                         │
│  Thời gian đánh giá:                                                    │
│  Bạn muốn thử nghiệm trong thời gian bao lâu?                           │
│  ┌──────┐ Ngày  ┌──────┐ Giờ                                            │
│  │  1   │       │  0   │                                                │
│  └──────┘       └──────┘                                                │
│  💡 Nên chờ ít nhất 24 giờ để có đủ dữ liệu                             │
│                                                                         │
│  ─────────────────────────────────────────────────────────────────      │
│                                                                         │
│  Phiên bản thắng sẽ được chọn dựa theo:                                 │
│                                                                         │
│  ⦿ Số lượng mở mail (Open)                                              │
│    Phiên bản nào có số lượng mở mail cao hơn thì sẽ chiến thắng        │
│    Số lượng mở mail phải lớn hơn: [    ] (để trống = so sánh tương đối)│
│                                                                         │
│  ○ Số lượng click link (Click)                                          │
│    Phiên bản nào có số lượng click link cao hơn thì sẽ chiến thắng     │
│    Số lượng click phải lớn hơn: [    ]                                  │
│                                                                         │
│  ─────────────────────────────────────────────────────────────────      │
│                                                                         │
│  Bạn có muốn hệ thống tự động gửi số email còn lại cho phiên bản        │
│  chiến thắng?                                                           │
│                                                                         │
│  ○ Có, tự động gửi ngay khi tìm ra phiên bản chiến thắng                │
│  ⦿ Không, chỉ tìm ra phiên bản chiến thắng, tôi sẽ chủ động gửi sau    │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

### 5.4 Màn hình: Kết quả A/B Testing

**Route**: `/email-marketing/campaigns/:id/ab-result`

```
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│  Kết quả A/B Testing                                                    │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐    │
│  │                                                                 │    │
│  │  So sánh: TIÊU ĐỀ                                               │    │
│  │                                                                 │    │
│  │  ┌───────────────────────┬───────────────────────┐              │    │
│  │  │      PHIÊN BẢN A      │      PHIÊN BẢN B      │              │    │
│  │  │                       │        🏆 WINNER       │              │    │
│  │  ├───────────────────────┼───────────────────────┤              │    │
│  │  │ 🎁 Ưu đãi Tết 2025... │ {ten_khach} ơi,...    │              │    │
│  │  ├───────────────────────┼───────────────────────┤              │    │
│  │  │ Đã gửi:      50       │ Đã gửi:      50       │              │    │
│  │  │ Thành công:  49 (98%) │ Thành công:  48 (96%) │              │    │
│  │  │ Đã mở:       22 (45%) │ Đã mở:       26 (52%) │ ← +7%        │    │
│  │  │ Đã click:    6 (12%)  │ Đã click:    9 (18%)  │ ← +6%        │    │
│  │  └───────────────────────┴───────────────────────┘              │    │
│  │                                                                 │    │
│  │  📊 Kết luận: Phiên bản B thắng với tỷ lệ mở cao hơn 7%         │    │
│  │                                                                 │    │
│  └─────────────────────────────────────────────────────────────────┘    │
│                                                                         │
│  Gửi phần còn lại (400 email):                                          │
│  ┌─────────────────────────────────────────────────────────────────┐    │
│  │                                                                 │    │
│  │  [Gửi phiên bản A]        [Gửi phiên bản B] (recommended)       │    │
│  │                                                                 │    │
│  └─────────────────────────────────────────────────────────────────┘    │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 6. TASK 10.5: BÁO CÁO & THỐNG KÊ

### 6.1 Màn hình: Báo cáo tổng quan

**Route**: `/email-marketing/reports`

**UI Structure**:
```
┌─────────────────────────────────────────────────────────────────────────┐
│ [Breadcrumb: Email Marketing > Báo cáo chất lượng email]                │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  Báo cáo chất lượng email                                               │
│                                                                         │
│  Khoảng thời gian: [Tháng này ▼]  Chiến dịch: [Tất cả ▼]  [Áp dụng]     │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐    │
│  │                                                                 │    │
│  │  📊 DASHBOARD                                                   │    │
│  │                                                                 │    │
│  │  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐   │    │
│  │  │  5,000  │ │  97.2%  │ │  42.5%  │ │  12.3%  │ │   2.1%  │   │    │
│  │  │Tổng gửi │ │Thành    │ │Open     │ │Click    │ │Bounce   │   │    │
│  │  │         │ │công     │ │rate     │ │rate     │ │rate     │   │    │
│  │  │ ↑ 15%   │ │ ↑ 0.5%  │ │ ↓ 2.1%  │ │ ↑ 1.2%  │ │ ↓ 0.3%  │   │    │
│  │  └─────────┘ └─────────┘ └─────────┘ └─────────┘ └─────────┘   │    │
│  │                                                                 │    │
│  └─────────────────────────────────────────────────────────────────┘    │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐    │
│  │                                                                 │    │
│  │  📈 XU HƯỚNG THEO NGÀY                                          │    │
│  │                                                                 │    │
│  │  [Line Chart: Gửi / Mở / Click theo ngày]                       │    │
│  │                                                                 │    │
│  │       1000│                                                     │    │
│  │        800│        ╱╲                                           │    │
│  │        600│      ╱    ╲      ╱╲                                 │    │
│  │        400│    ╱        ╲  ╱    ╲                               │    │
│  │        200│  ╱            ╲        ╲                            │    │
│  │           │╱                                                    │    │
│  │           └────────────────────────────────────                 │    │
│  │            1    5    10   15   20   25   30                     │    │
│  │                                                                 │    │
│  │  ━━ Đã gửi   ━━ Đã mở   ━━ Đã click                             │    │
│  │                                                                 │    │
│  └─────────────────────────────────────────────────────────────────┘    │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐    │
│  │                                                                 │    │
│  │  📊 SO SÁNH CÁC CHIẾN DỊCH                     [Export Excel]   │    │
│  │                                                                 │    │
│  │  [Bar Chart: Hiệu quả từng chiến dịch]                          │    │
│  │                                                                 │    │
│  └─────────────────────────────────────────────────────────────────┘    │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

### 6.2 Admin: Báo cáo theo Domain

**Permission**: Admin only

```
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│  Chất lượng theo domain                                                 │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────────┐│
│  │ Domain        │ Số gửi │ Thành công │ Inbox  │ Spam  │ Bounce      ││
│  ├───────────────┼────────┼────────────┼────────┼───────┼─────────────┤│
│  │ gmail.com     │ 2,500  │ 98.5%      │ 95.2%  │ 3.3%  │ 1.5%        ││
│  │ outlook.com   │ 1,200  │ 97.8%      │ 92.1%  │ 5.7%  │ 2.2%        ││
│  │ company.vn    │ 800    │ 85.2%      │ 78.5%  │ 6.7%  │ ⚠️ 14.8%    ││
│  │ yahoo.com     │ 500    │ 96.4%      │ 89.3%  │ 7.1%  │ 3.6%        ││
│  └─────────────────────────────────────────────────────────────────────┘│
│                                                                         │
│  ⚠️ company.vn có tỷ lệ bounce > 10%. Kiểm tra domain này.             │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 7. DATA MODELS

### 7.1 Email Config
```typescript
interface SenderEmail {
  id: string;
  email: string;
  sender_name: string;
  status: 'activated' | 'pending' | 'domain_unverified' | 'disabled';
  permission: 'all' | 'me' | 'specific';
  specific_user_ids?: string[];
  created_by: string;
  created_at: datetime;
  updated_at: datetime;
  verification_token?: string;
  verification_expires_at?: datetime;
  verification_attempts: number; // max 5/day
}
```

### 7.2 Email Template
```typescript
interface EmailTemplate {
  id: string;
  name: string;
  type: 'system' | 'user';
  content_html: string;
  content_json?: object; // For drag-drop editor
  thumbnail_url: string;
  owner_id?: string; // null for system templates
  created_at: datetime;
  updated_at: datetime;
  version: number;
  versions_history: TemplateVersion[]; // max 10
}

interface TemplateVersion {
  version: number;
  content_html: string;
  saved_at: datetime;
}
```

### 7.3 Campaign
```typescript
interface Campaign {
  id: string;
  name: string;
  type: 'normal' | 'ab';
  status: 'draft' | 'scheduled' | 'running' | 'paused' | 'sent' | 'cancelled';
  
  // Content
  subject: string;
  subject_b?: string; // For A/B
  preview_text?: string;
  sender_email_id: string;
  template_id: string;
  template_b_id?: string; // For A/B content test
  attachments?: Attachment[];
  
  // Recipients
  recipient_filter: RecipientFilter;
  recipient_count: number;
  valid_email_count: number;
  
  // Schedule
  send_type: 'immediate' | 'scheduled' | 'batch';
  scheduled_at?: datetime;
  batches?: BatchSchedule[];
  
  // A/B Testing
  ab_type?: 'subject' | 'content' | 'send_time';
  ab_ratio_a?: number; // default 10
  ab_ratio_b?: number; // default 10
  ab_evaluation_hours?: number; // default 24
  ab_criteria?: 'open' | 'click';
  ab_criteria_threshold?: number;
  ab_auto_send_winner?: boolean;
  ab_winner?: 'a' | 'b' | null;
  
  // Stats
  stats: CampaignStats;
  
  // Metadata
  created_by: string;
  created_at: datetime;
  updated_at: datetime;
  started_at?: datetime;
  completed_at?: datetime;
}

interface RecipientFilter {
  labels?: string[];
  sources?: string[];
  statuses?: string[];
  date_range?: { from: date; to: date };
  exclude_sent_within_days?: number; // default 7
  exclude_unsubscribed?: boolean; // default true
}

interface BatchSchedule {
  batch_number: number;
  email_count: number;
  scheduled_at: datetime;
  status: 'pending' | 'sent';
}

interface CampaignStats {
  total_sent: number;
  delivered: number;
  bounced: number;
  opened: number;
  clicked: number;
  unsubscribed: number;
  // A/B specific
  stats_a?: { sent: number; opened: number; clicked: number };
  stats_b?: { sent: number; opened: number; clicked: number };
}
```

### 7.4 Email Send Log
```typescript
interface EmailSendLog {
  id: string;
  campaign_id: string;
  recipient_email: string;
  recipient_customer_id: string;
  
  status: 'queued' | 'sent' | 'delivered' | 'opened' | 'clicked' | 'bounced' | 'unsubscribed';
  
  // For A/B
  ab_version?: 'a' | 'b';
  
  sent_at?: datetime;
  delivered_at?: datetime;
  opened_at?: datetime;
  clicked_at?: datetime;
  
  open_count: number;
  click_count: number;
  
  bounce_type?: 'soft' | 'hard';
  bounce_reason?: string;
  
  retry_count: number; // max 3
  
  // Tracking
  ip_address?: string;
  user_agent?: string;
  device_type?: 'desktop' | 'mobile' | 'tablet';
}
```

### 7.5 Email Limits
```typescript
interface EmailLimits {
  daily_limit: number; // default 500
  monthly_limit: number; // default 10000
  per_sender_daily_limit: number; // default 100
  delay_between_emails: number; // seconds, default 5
  
  // Usage tracking
  daily_used: number;
  monthly_used: number;
  daily_reset_at: datetime;
  monthly_reset_at: datetime;
}
```

---

## 8. UI COMPONENTS LIBRARY

### 8.1 Common Components

```typescript
// Status Badge
<StatusBadge 
  status="activated" | "pending" | "domain_unverified" | "draft" | "scheduled" | "running" | "paused" | "sent" | "cancelled"
/>

// Progress Bar with threshold colors
<ProgressBar 
  value={70} 
  max={100}
  thresholds={{ warning: 80, danger: 90 }}
/>

// Variable Chip (for email content)
<VariableChip variable="ten_khach" fallback="Quý khách" />

// Stat Card
<StatCard
  value={5000}
  label="Tổng gửi"
  trend={{ direction: 'up', value: 15 }}
/>

// Template Card
<TemplateCard
  thumbnail="/path/to/thumb.jpg"
  name="Mẫu chào mừng"
  actions={['preview', 'clone', 'edit', 'delete']}
/>

// Recipient Counter (real-time)
<RecipientCounter
  total={1500}
  valid={1450}
  invalid={50}
/>

// A/B Ratio Slider
<ABRatioSlider
  ratioA={10}
  ratioB={10}
  maxTotal={50}
  onChange={(a, b) => {}}
/>
```

### 8.2 Form Components

```typescript
// Email Subject Input with spam detection
<EmailSubjectInput
  value={subject}
  onChange={setSubject}
  maxLength={200}
  variables={availableVariables}
  onSpamDetected={(keywords) => {}}
/>

// Send Time Picker
<SendTimePicker
  type="immediate" | "scheduled" | "batch"
  scheduledAt={datetime}
  batches={[]}
  onChange={(config) => {}}
/>

// Recipient Filter
<RecipientFilter
  labels={[]}
  sources={[]}
  statuses={[]}
  dateRange={{ from, to }}
  options={{
    excludeSentWithinDays: 7,
    excludeUnsubscribed: true
  }}
  onChange={(filter) => {}}
  onCountUpdate={(count) => {}}
/>
```

### 8.3 Editor Components

```typescript
// Rich Text Editor with variables
<EmailEditor
  content={html}
  mode="richtext" | "dragdrop" | "html"
  variables={availableVariables}
  onSave={(html, json) => {}}
  autoSaveInterval={30000}
/>

// Drag & Drop Block
<DragDropBlock
  type="text" | "image" | "button" | "divider" | "spacer" | "columns" | "social"
  properties={blockProps}
  onPropertiesChange={(props) => {}}
/>

// Email Preview
<EmailPreview
  content={html}
  mode="desktop" | "mobile"
  sampleData={variableSampleData}
/>
```

---

## 📌 NOTES FOR DEVELOPERS

### Performance Requirements
- List pages: Load < 2 seconds
- Preview popup: Load < 1 second
- Dashboard: Load < 3 seconds
- Auto-save: Every 30 seconds (non-blocking)

### Responsive Breakpoints
- Desktop: >= 1024px
- Tablet: 768px - 1023px
- Mobile: < 768px

### Color Palette
```css
:root {
  --color-success: #10B981;    /* Green - Activated, Sent, Opened */
  --color-warning: #F59E0B;    /* Yellow - Pending, Scheduled */
  --color-danger: #EF4444;     /* Red - Failed, Bounced */
  --color-info: #3B82F6;       /* Blue - Draft, Running */
  --color-neutral: #6B7280;    /* Gray - Cancelled */
  --color-primary: #6366F1;    /* Indigo - Primary actions */
}
```

### Accessibility
- All interactive elements must be keyboard accessible
- Color contrast ratio >= 4.5:1
- Error messages must be associated with form fields
- Loading states must be announced to screen readers

---

*Document Version: 1.0*
*Last Updated: 31/01/2025*
*Author: CRM ViLead BA Team*
