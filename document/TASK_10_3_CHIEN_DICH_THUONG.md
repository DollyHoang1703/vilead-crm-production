# TASK 10.3 - DANH SÁCH CHIẾN DỊCH & CHIẾN DỊCH THƯỜNG
## Complete UI & Data Flow Specification

> **Module**: Email Marketing
> **Task**: 10.3 - Chiến dịch Email thường (17 User Stories)
> **Phạm vi**: Danh sách chiến dịch + Tạo/Sửa/Xóa chiến dịch thường + Quản lý trạng thái
> **Mục đích**: Copilot/AI Code Assistant generate đầy đủ UI, logic, data flow
> **Version**: 1.0 | **Date**: 31/01/2025

---

## 📑 MỤC LỤC

1. [TỔNG QUAN](#1-tổng-quan)
2. [DATA MODELS](#2-data-models)
3. [API ENDPOINTS](#3-api-endpoints)
4. [STATE MANAGEMENT](#4-state-management)
5. [UI - DANH SÁCH CHIẾN DỊCH](#5-ui---danh-sách-chiến-dịch)
6. [UI - TẠO CHIẾN DỊCH THƯỜNG](#6-ui---tạo-chiến-dịch-thường)
7. [USER FLOWS](#7-user-flows)
8. [UTILITY FUNCTIONS](#8-utility-functions)
9. [MOCK DATA](#9-mock-data)
10. [IMPLEMENTATION CHECKLIST](#10-implementation-checklist)

---

# 1. TỔNG QUAN

## 1.1 Campaign Types

| Loại | Mô tả | Use Case |
|------|-------|----------|
| **Chiến dịch thường** | Gửi 1 email giống nhau cho tất cả người nhận | Newsletter, thông báo, khuyến mãi |
| **Chiến dịch A/B** | So sánh 2 phiên bản để tìm email hiệu quả nhất | *(Xem file TASK_10_4)* |

## 1.2 Campaign Status Flow

```
┌──────────┐     Lưu      ┌──────────┐   Lên lịch   ┌──────────┐
│   MỚI    │ ◄─────────── │   MỚI    │ ───────────► │ ĐANG CHỜ │
│  (draft) │              │  (draft) │              │(scheduled)│
└──────────┘              └──────────┘              └──────────┘
                               │                         │
                               │ Gửi ngay                │ Đến giờ
                               ▼                         ▼
                          ┌──────────┐             ┌──────────┐
                          │ĐANG CHẠY │ ◄───────────│ĐANG CHẠY │
                          │(running) │             │(running) │
                          └──────────┘             └──────────┘
                               │                         │
                     Tạm dừng  │  │ Hoàn thành           │
                               ▼  │                      │
                          ┌──────────┐                   │
                          │TẠM DỪNG  │                   │
                          │(paused)  │                   │
                          └──────────┘                   │
                               │                         │
                     Tiếp tục  │                         │
                               ▼                         ▼
                          ┌──────────────────────────────────┐
                          │              ĐÃ GỬI              │
                          │              (sent)              │
                          └──────────────────────────────────┘

                          ┌──────────┐
Hủy (từ draft/scheduled)──►  ĐÃ HỦY  │
                          │(cancelled)│
                          └──────────┘
```

## 1.3 Status Definitions

| Status | Label | Màu | Cho phép |
|--------|-------|-----|----------|
| draft | Mới | 🔵 Blue | Chỉnh sửa, Xóa |
| scheduled | Đang chờ | 🟡 Yellow | Chỉnh sửa, Hủy |
| running | Đang chạy | 🟢 Green (pulse) | Tạm dừng |
| paused | Tạm dừng | 🟠 Orange | Tiếp tục |
| sent | Đã gửi | ⚫ Gray | Clone, Xóa |
| cancelled | Đã hủy | 🔴 Red | Clone, Xóa |

## 1.4 Campaign Creation Checklist

```
┌─────────────────────────────────────────────────────────────┐
│ CHECKLIST TẠO CHIẾN DỊCH                    [3/4 hoàn thành]│
├─────────────────────────────────────────────────────────────┤
│  ① Tiêu đề mail *          ✓ Ưu đãi đặc biệt cho {ten_kh..│
│  ② Preview Text            ─ Nhập nội dung xem trước       │
│  ③ Người gửi *             ✓ sales@vilead.vn               │
│  ④ Người nhận *            ✓ 485 email hợp lệ              │
│  ⑤ Nội dung email *        ─ Chọn mẫu                      │
│  ⑥ File đính kèm           ─ Thêm file                     │
├─────────────────────────────────────────────────────────────┤
│ [██████████░░░░░░░░░░] 75%    [Lưu nháp] [Bắt đầu chiến dịch]│
└─────────────────────────────────────────────────────────────┘
```

---

# 2. DATA MODELS

## 2.1 Campaign Model (Core)

```typescript
interface Campaign {
  id: string;
  name: string;
  type: CampaignType;
  status: CampaignStatus;
  
  // === CONTENT ===
  subject: string;                    // Tiêu đề email
  preview_text: string | null;        // Preview text (hiển thị trong inbox)
  sender_email_id: string;            // FK to SenderEmail
  template_id: string;                // FK to EmailTemplate
  attachments: Attachment[];          // File đính kèm
  
  // === RECIPIENTS ===
  recipient_filter: RecipientFilter;  // Bộ lọc người nhận
  recipient_count: number;            // Tổng số người nhận
  valid_email_count: number;          // Số email hợp lệ
  
  // === SCHEDULE ===
  send_type: SendType;
  scheduled_at: Date | null;          // Nếu send_type = 'scheduled'
  batches: BatchSchedule[] | null;    // Nếu send_type = 'batch'
  
  // === A/B TESTING (chỉ khi type = 'ab') ===
  ab_config: ABTestConfig | null;     // null cho chiến dịch thường
  
  // === STATISTICS ===
  stats: CampaignStats;
  
  // === AUDIT ===
  created_by: string;
  created_at: Date;
  updated_at: Date;
  started_at: Date | null;
  completed_at: Date | null;
  deleted_at: Date | null;
}

type CampaignType = 'normal' | 'ab';

type CampaignStatus = 
  | 'draft'       // Mới/Nháp
  | 'scheduled'   // Đang chờ
  | 'running'     // Đang chạy
  | 'paused'      // Tạm dừng
  | 'sent'        // Đã gửi
  | 'cancelled';  // Đã hủy

type SendType = 
  | 'immediate'   // Gửi ngay
  | 'scheduled'   // Lên lịch
  | 'batch';      // Gửi theo đợt
```

## 2.2 Attachment Model

```typescript
interface Attachment {
  id: string;
  campaign_id: string;
  file_name: string;
  file_url: string;
  file_size: number;          // bytes
  file_type: string;          // mime type
  uploaded_at: Date;
}

const ATTACHMENT_CONSTRAINTS = {
  allowedTypes: [
    'application/pdf', 
    'application/msword', 
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel', 
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'image/jpeg', 'image/png', 'image/gif'
  ],
  maxFileSize: 5 * 1024 * 1024,      // 5MB per file
  maxTotalSize: 10 * 1024 * 1024,    // 10MB total
  maxFiles: 3
};
```

## 2.3 Recipient Filter Model

```typescript
interface RecipientFilter {
  labels: string[];                   // Nhãn khách hàng
  sources: string[];                  // Nguồn khách hàng
  statuses: string[];                 // Trạng thái khách hàng
  date_range: {
    from: Date | null;
    to: Date | null;
  } | null;
  
  // Exclusion options
  exclude_sent_within_days: number;   // Default: 7
  exclude_unsubscribed: boolean;      // Default: true
  exclude_bounced: boolean;           // Default: true
}
```

## 2.4 Batch Schedule Model

```typescript
interface BatchSchedule {
  batch_number: number;           // 1, 2, 3, ...
  email_count: number | null;     // null = tự chia đều
  scheduled_at: Date;
  status: 'pending' | 'running' | 'completed' | 'failed';
  sent_count: number;
  failed_count: number;
  started_at: Date | null;
  completed_at: Date | null;
}

const BATCH_CONSTRAINTS = {
  maxBatches: 10,
  minIntervalMinutes: 60,         // Tối thiểu 1 giờ giữa các đợt
};
```

## 2.5 Campaign Stats Model

```typescript
interface CampaignStats {
  total_recipients: number;
  total_sent: number;
  total_delivered: number;
  total_bounced: number;
  total_opened: number;
  total_clicked: number;
  total_unsubscribed: number;
  
  // Rates
  delivery_rate: number;          // (delivered / sent) * 100
  open_rate: number;              // (opened / delivered) * 100
  click_rate: number;             // (clicked / delivered) * 100
  bounce_rate: number;            // (bounced / sent) * 100
  unsubscribe_rate: number;       // (unsubscribed / delivered) * 100
  
  // A/B specific (null cho chiến dịch thường)
  stats_a: ABVersionStats | null;
  stats_b: ABVersionStats | null;
}
```

## 2.6 Email Send Log Model

```typescript
interface EmailSendLog {
  id: string;
  campaign_id: string;
  batch_number: number | null;
  
  // Recipient
  recipient_email: string;
  recipient_customer_id: string;
  recipient_name: string | null;
  
  // A/B version
  ab_version: 'a' | 'b' | null;      // null cho chiến dịch thường
  
  // Status
  status: EmailStatus;
  
  // Timestamps
  queued_at: Date;
  sent_at: Date | null;
  delivered_at: Date | null;
  opened_at: Date | null;
  clicked_at: Date | null;
  bounced_at: Date | null;
  unsubscribed_at: Date | null;
  
  // Engagement
  open_count: number;
  click_count: number;
  clicked_links: ClickedLink[];
  
  // Error info
  bounce_type: 'soft' | 'hard' | null;
  bounce_reason: string | null;
  
  // Retry
  retry_count: number;            // Max 3
}

type EmailStatus = 
  | 'queued' | 'sending' | 'sent' | 'delivered'
  | 'opened' | 'clicked' | 'bounced' | 'failed' | 'unsubscribed';
```

---

# 3. API ENDPOINTS

## 3.1 Campaign CRUD APIs

```typescript
// GET: Danh sách chiến dịch
GET /api/email-marketing/campaigns
Query: status?, type?, search?, group_id?, page?, limit?
Response: { data: Campaign[], pagination, counts: StatusCounts }

// GET: Chi tiết chiến dịch
GET /api/email-marketing/campaigns/:id
Response: Campaign

// POST: Tạo chiến dịch mới
POST /api/email-marketing/campaigns
Body: { name, type, subject?, sender_email_id?, template_id?, recipient_filter?, ab_config? }
Response 201: { data: Campaign }

// PUT: Cập nhật chiến dịch (chỉ draft/scheduled)
PUT /api/email-marketing/campaigns/:id
Body: Partial<Campaign>
Response: Campaign
Error 400: { error: "CAMPAIGN_NOT_EDITABLE" }

// DELETE: Xóa chiến dịch (chỉ draft/cancelled/sent)
DELETE /api/email-marketing/campaigns/:id
Response: { message: "Đã xóa" }
Error 400: { error: "CAMPAIGN_NOT_DELETABLE" }
```

## 3.2 Campaign Actions APIs

```typescript
// POST: Bắt đầu chiến dịch
POST /api/email-marketing/campaigns/:id/start
Body: { send_type, scheduled_at?, batches? }
Response: { data: Campaign, message: "Đã kích hoạt" }
Error 400: { error: "CAMPAIGN_INCOMPLETE" | "LIMIT_EXCEEDED" | "NO_VALID_RECIPIENTS" }

// POST: Tạm dừng
POST /api/email-marketing/campaigns/:id/pause
Response: { data: Campaign, stats: { sent, remaining } }

// POST: Tiếp tục
POST /api/email-marketing/campaigns/:id/resume
Body: { send_type?, scheduled_at? }
Response: Campaign

// POST: Hủy
POST /api/email-marketing/campaigns/:id/cancel
Body: { reason? }
Response: Campaign

// POST: Clone
POST /api/email-marketing/campaigns/:id/clone
Response 201: Campaign (status = 'draft')
```

## 3.3 Recipients APIs

```typescript
// POST: Preview người nhận
POST /api/email-marketing/campaigns/preview-recipients
Body: { filter: RecipientFilter }
Response: {
  total_customers, valid_emails, invalid_emails,
  excluded: { recently_sent, unsubscribed, bounced },
  sample_recipients: Array<{ id, email, name, labels }>
}

// GET: Danh sách người nhận của chiến dịch
GET /api/email-marketing/campaigns/:id/recipients
Query: status?, search?, page?, limit?
Response: { data: EmailSendLog[], pagination, counts }

// POST: Gửi lại email thất bại
POST /api/email-marketing/campaigns/:id/recipients/retry
Body: { recipient_ids?, retry_type?: 'soft_bounce' | 'all' }
Response: { queued_count, skipped_count }
```

## 3.4 Attachment APIs

```typescript
// POST: Upload attachment
POST /api/email-marketing/campaigns/:id/attachments
Content-Type: multipart/form-data
Response 201: Attachment
Error 400: { error: "FILE_TOO_LARGE" | "INVALID_FILE_TYPE" | "MAX_FILES_EXCEEDED" | "MAX_SIZE_EXCEEDED" }

// DELETE: Remove attachment
DELETE /api/email-marketing/campaigns/:id/attachments/:attachmentId
Response: { message: "Đã xóa" }
```

## 3.5 Statistics APIs

```typescript
// GET: Campaign statistics
GET /api/email-marketing/campaigns/:id/stats
Response: CampaignStats

// GET: Timeline statistics
GET /api/email-marketing/campaigns/:id/stats/timeline
Query: metric ('sent'|'opened'|'clicked'), interval ('hour'|'day')
Response: { data: Array<{ timestamp, count }> }

// GET: Export
GET /api/email-marketing/campaigns/:id/export
Query: format ('xlsx'|'csv'), include ('summary'|'recipients'|'all')
Response: { download_url, expires_at }
```

---

# 4. STATE MANAGEMENT

## 4.1 Campaigns List Store

```typescript
interface CampaignsState {
  campaigns: Campaign[];
  loading: boolean;
  error: string | null;
  pagination: Pagination;
  
  filters: {
    status: CampaignStatus | 'all';
    type: CampaignType | 'all';
    search: string;
    group_id: string | null;
  };
  
  statusCounts: {
    all: number;
    draft: number;
    scheduled: number;
    running: number;
    paused: number;
    sent: number;
    cancelled: number;
  };
  
  selectedCampaign: Campaign | null;
  
  modals: {
    createType: boolean;
    delete: boolean;
    cancel: boolean;
    pause: boolean;
    resume: boolean;
    confirmStart: boolean;
  };
}
```

## 4.2 Campaign Editor Store (Normal)

```typescript
interface CampaignEditorState {
  mode: 'create' | 'edit';
  campaignType: 'normal';
  
  formData: {
    name: string;
    subject: string;
    preview_text: string;
    sender_email_id: string | null;
    template_id: string | null;
    recipient_filter: RecipientFilter;
    attachments: Attachment[];
    
    // Schedule
    send_type: SendType;
    scheduled_at: Date | null;
    batches: BatchSchedule[];
  };
  
  // Checklist completion status
  checklist: {
    subject: boolean;
    preview_text: boolean;              // Always true (optional)
    sender: boolean;
    recipients: boolean;
    content: boolean;
    attachments: boolean;               // Always true (optional)
  };
  
  // Recipients preview
  recipientsPreview: RecipientsPreviewData | null;
  
  // Validation
  errors: Record<string, string | null>;
  isDirty: boolean;
  isSaving: boolean;
  lastSavedAt: Date | null;
}
```

---

# 5. UI - DANH SÁCH CHIẾN DỊCH

## 5.1 CampaignListPage

**Route**: `/email-marketing/campaigns`

```tsx
// Component Structure
CampaignListPage
├── PageHeader
│   ├── Breadcrumb: ["Email Marketing", "Chiến dịch mail"]
│   ├── Title: "Chiến dịch mail"
│   └── Button: "+ Tạo chiến dịch mới"
├── CampaignStatusTabs
│   └── Tabs: [Tất cả, Mới, Đang chờ, Đang chạy, Tạm dừng, Đã gửi]
├── CampaignFilters
│   ├── Select: Nhóm chiến dịch
│   └── SearchInput: Tìm kiếm theo tên
├── CampaignTable
│   └── Columns: [Tên, Trạng thái, Ngày tạo, Ngày chạy, Khách hàng, Thành công, Đã mở, Hành động]
├── Pagination
└── Modals
    ├── CreateCampaignTypeModal
    ├── DeleteCampaignModal
    └── CancelCampaignModal
```

## 5.2 CampaignStatusTabs

```tsx
const STATUS_TABS = [
  { key: 'all', label: 'Tất cả' },
  { key: 'draft', label: 'Mới' },
  { key: 'scheduled', label: 'Đang chờ' },
  { key: 'running', label: 'Đang chạy' },
  { key: 'paused', label: 'Tạm dừng' },
  { key: 'sent', label: 'Đã gửi' }
];

// Each tab shows count badge
// Active tab has primary color bottom border
```

## 5.3 CampaignTable Columns

| Column | Header | Width | Render |
|--------|--------|-------|--------|
| name | Tên | 25% | Badge [A/B] nếu type='ab' + name |
| status | Trạng thái | 12% | StatusBadge |
| created_at | Ngày tạo | 12% | DD/MM/YYYY |
| scheduled_at | Ngày chạy | 12% | started_at or scheduled_at or '-' |
| recipients | Khách hàng | 10% | valid_email_count.toLocaleString() |
| delivered | Thành công | 10% | stats.total_delivered |
| opened | Đã mở | 10% | stats.total_opened |
| actions | Hành động | 9% | DropdownMenu |

## 5.4 CampaignStatusBadge

```tsx
const STATUS_CONFIG = {
  draft: { label: 'Mới', color: 'bg-blue-100 text-blue-800', icon: FileIcon },
  scheduled: { label: 'Đang chờ', color: 'bg-yellow-100 text-yellow-800', icon: ClockIcon },
  running: { label: 'Đang chạy', color: 'bg-green-100 text-green-800', icon: PlayIcon, pulse: true },
  paused: { label: 'Tạm dừng', color: 'bg-orange-100 text-orange-800', icon: PauseIcon },
  sent: { label: 'Đã gửi', color: 'bg-gray-100 text-gray-800', icon: CheckIcon },
  cancelled: { label: 'Đã hủy', color: 'bg-red-100 text-red-800', icon: XIcon }
};
```

## 5.5 CampaignActions by Status

| Status | Actions |
|--------|---------|
| draft | Chỉnh sửa, Tạo bản sao, --- , Xóa |
| scheduled | Chỉnh sửa, Tạo bản sao, --- , Hủy chiến dịch |
| running | Chi tiết, Tạm dừng |
| paused | Chi tiết, Tiếp tục |
| sent | Chi tiết, Tạo bản sao, --- , Xóa |
| cancelled | Chi tiết, Tạo bản sao, --- , Xóa |

## 5.6 CreateCampaignTypeModal

```tsx
// Modal Content
- Title: "Tạo chiến dịch mới"
- Campaign Type Selection (2 cards):
  ┌─────────────────────────────┐  ┌─────────────────────────────┐
  │  📧 Chiến dịch thường       │  │  🔀 Chiến dịch A/B          │
  │                             │  │                             │
  │  Gửi email giống nhau cho   │  │  So sánh 2 phiên bản để    │
  │  tất cả người nhận          │  │  tìm email hiệu quả nhất   │
  └─────────────────────────────┘  └─────────────────────────────┘

- Campaign Name Input
  - Default: "Chiến dịch DD/MM/YYYY"
  
- Footer: [Hủy] [Bắt đầu]
// type=normal → navigate to /campaigns/new?type=normal
// type=ab → navigate to /campaigns/new?type=ab
```

---

# 6. UI - TẠO CHIẾN DỊCH THƯỜNG

## 6.1 NormalCampaignEditorPage

**Route**: `/email-marketing/campaigns/new?type=normal` hoặc `/:id/edit`

```tsx
// Layout
NormalCampaignEditorPage
├── CampaignEditorHeader
│   ├── BackButton
│   ├── AutoSaveIndicator: "💾 Đã lưu lúc HH:mm"
│   └── SaveDraftButton
├── Content (max-w-4xl mx-auto)
│   ├── Card: Campaign Name
│   │   └── Input: "Tên chiến dịch"
│   ├── Card: Checklist
│   │   ├── ChecklistItem ①: Tiêu đề mail *
│   │   ├── ChecklistItem ②: Preview Text
│   │   ├── ChecklistItem ③: Người gửi *
│   │   ├── ChecklistItem ④: Người nhận *
│   │   ├── ChecklistItem ⑤: Nội dung email *
│   │   ├── ChecklistItem ⑥: File đính kèm
│   │   └── ProgressBar: X/4 mục bắt buộc
│   └── ActionButtons
│       ├── Button: Lưu nháp
│       └── Button: Bắt đầu chiến dịch (disabled if not complete)
└── Modals
    ├── SubjectModal
    ├── PreviewTextModal
    ├── SenderModal
    ├── RecipientsModal
    ├── ContentModal
    ├── AttachmentsModal
    └── ConfirmStartModal
```

## 6.2 ChecklistItem Component

```tsx
interface ChecklistItemProps {
  number: number;           // 1-6
  label: string;            // "Tiêu đề mail"
  required?: boolean;       // Show * if true
  completed: boolean;       // Show ✓ or number
  value: string | null;     // Display current value
  secondaryValue?: string;  // E.g., sender_name
  thumbnail?: string;       // For template preview
  placeholder: string;      // "Nhập tiêu đề"
  onClick: () => void;      // Open modal
}

// Visual:
// ┌─────────────────────────────────────────────────────────┐
// │ [✓/1]  Tiêu đề mail *                              [>] │
// │        Ưu đãi đặc biệt cho {ten_khach}!                │
// └─────────────────────────────────────────────────────────┘
```

## 6.3 SubjectModal

```tsx
// Modal Content
- Title: "Tiêu đề email"
- FormField: "Tiêu đề mail của bạn sẽ gửi là gì?" *
  - Input with placeholder
  - Character counter: X/200 ký tự
  - Optimal length indicator: 30-50 chars = ✓ Độ dài tối ưu

- Variables Section:
  - Label: "Chèn biến:"
  - Buttons: {ten_khach}, {cong_ty}, {san_pham}

- Tips Alert (info):
  - Tiêu đề nên từ 30-50 ký tự
  - Tránh viết HOA toàn bộ
  - Tránh dùng quá nhiều !!!

- Spam Warning Alert (warning) - conditional:
  - "Tiêu đề chứa từ có thể bị spam: [keywords]"

- Footer: [Hủy] [Lưu]
```

## 6.4 SenderModal

```tsx
// Modal Content
- Title: "Chọn người gửi"
- RadioGroup of activated sender emails:
  ┌─────────────────────────────────────────────────────────┐
  │ (●) sales@vilead.vn                               [⚠️] │
  │     Phòng Kinh doanh ViLead                            │
  └─────────────────────────────────────────────────────────┘
  
- Warning icon if domain_unverified
- Empty state if no senders → Link to Settings
- Footer: [Đóng]
// Auto-close when selection made
```

## 6.5 RecipientsModal

```tsx
// Modal Layout (size="lg")
- Title: "Chọn người nhận"

- Quick Stats (3 cards):
  [Tổng KH: 520] [Email hợp lệ: 485 ✓] [Không hợp lệ: 35 ⚠️]

- Filters Section (bordered box):
  ├── MultiSelect: Nhãn
  ├── MultiSelect: Nguồn
  ├── MultiSelect: Trạng thái
  └── DateRangePicker: Ngày tạo

- Exclusion Options (checkboxes):
  ☑️ Loại trừ KH đã gửi email trong [7] ngày gần đây
  ☑️ Loại trừ KH đã hủy đăng ký
  ☑️ Loại trừ email đã bounce

- Exclusion Summary (yellow box):
  "Đã loại trừ: 45 gửi gần đây, 18 hủy đăng ký, 7 bounce"

- Limit Warning (if > 80% daily limit):
  "⚠️ Số email vượt 80% giới hạn ngày (500)"

- Footer: [Hủy] [Xác nhận (485 email)]
```

## 6.6 ContentModal

```tsx
// Modal Layout (size="xl")
- Title: "Chọn mẫu nội dung email"

- Split Layout (50/50):
  Left Panel (scrollable):
  ├── Tabs: [Mẫu có sẵn] [Mẫu của bạn]
  └── TemplateGrid
      └── TemplateCard (clickable, selected = border)

  Right Panel:
  └── Preview (hover to see rendered HTML)

- Footer: [Hủy] [Chọn mẫu này]
```

## 6.7 AttachmentsModal

```tsx
// Modal Content
- Title: "File đính kèm"

- FileDropzone (if < 3 files):
  ┌─────────────────────────────────────────────────────────┐
  │         📤 Kéo thả file vào đây hoặc click để chọn     │
  │         PDF, DOC, DOCX, XLS, XLSX, JPG, PNG, GIF       │
  │                     Max 5MB/file                       │
  └─────────────────────────────────────────────────────────┘

- File List:
  ┌─────────────────────────────────────────────────────────┐
  │ 📄 brochure.pdf                        1.2 MB    [🗑️] │
  │ 📊 price-list.xlsx                     856 KB    [🗑️] │
  └─────────────────────────────────────────────────────────┘

- Summary: "Số file: 2/3 | Tổng dung lượng: 2.1MB/10MB"
- Footer: [Hủy] [Xác nhận]
```

## 6.8 ConfirmStartModal (Cấu hình thời gian gửi)

```tsx
// Modal Layout (size="lg")
- Title: "Xác nhận gửi chiến dịch"

- Campaign Summary (gray box):
  ┌─────────────────────────────────────────────────────────┐
  │ 📋 Tóm tắt chiến dịch                                  │
  │ Tên: Chiến dịch Tết 2025                               │
  │ Người gửi: sales@vilead.vn                             │
  │ Người nhận: 485 email                                  │
  │ Ước tính: Hoàn thành trong ~8 phút                     │
  └─────────────────────────────────────────────────────────┘

- Send Type Selection (radio cards):
  
  (●) Gửi ngay
      Bắt đầu gửi ngay sau khi xác nhận
  
  ( ) Lên lịch
      [DatePicker] [TimePicker]
      ⚠️ Thời gian 2h-6h sáng có tỷ lệ mở thấp
  
  ( ) Gửi theo đợt
      [BatchScheduleEditor]

- Important Notice (info):
  "⚠️ Sau khi bắt đầu, không thể chỉnh sửa nội dung"

- Confirm Checkbox:
  ☐ Tôi đã kiểm tra và xác nhận thông tin chính xác

- Footer: [Hủy] [▶️ Xác nhận gửi]
```

## 6.9 BatchScheduleEditor

```tsx
// Layout
- Batch List:
  ┌─────────────────────────────────────────────────────────┐
  │ Lượt 1  [100] email vào [📅 01/02/2025] [🕐 09:00] [🗑️] │
  │ Lượt 2  [100] email vào [📅 01/02/2025] [🕐 14:00] [🗑️] │
  │ Lượt 3  [_95] email vào [📅 02/02/2025] [🕐 09:00] [🗑️] │
  └─────────────────────────────────────────────────────────┘

- [+ Thêm lượt] button (disabled if 10 batches)
- Note: "Khoảng cách tối thiểu giữa các đợt: 1 giờ"

// Constraints: max 10 batches, min 1h between batches
// email_count can be empty (auto distribute)
```

---

# 7. USER FLOWS

## 7.1 Flow: Tạo chiến dịch thường

```
1. User click "+ Tạo chiến dịch mới"
   ↓
2. Popup chọn loại → [Chiến dịch thường]
   ↓
3. Nhập tên → Click "Bắt đầu"
   ↓
4. Redirect to /email-marketing/campaigns/new?type=normal
   ↓
5. Hiển thị màn Checklist (6 mục)
   ↓
6. User click từng mục → Popup tương ứng
   ↓
7. Khi hoàn thành 4 mục *, nút "Bắt đầu" enable
   ↓
8. Click "Bắt đầu chiến dịch"
   ↓
9. Popup cấu hình thời gian:
   - Gửi ngay
   - Lên lịch
   - Gửi theo đợt
   ↓
10. Tick xác nhận → Click "Xác nhận gửi"
    ↓
11. System validates → Start campaign
    ↓
12. Redirect to campaign list + Toast success
```

## 7.2 Flow: Tạm dừng và Tiếp tục

```
=== TẠM DỪNG ===
1. Campaign đang chạy
   ↓
2. Click "Tạm dừng"
   ↓
3. Popup xác nhận
   ↓
4. Status → 'paused'
   ↓
5. Hiển thị: "Đã gửi X/Y email"

=== TIẾP TỤC ===
1. Campaign đã tạm dừng
   ↓
2. Click "Tiếp tục"
   ↓
3. Popup: "Còn Y email chưa gửi"
   - Option: Gửi ngay / Lên lịch
   ↓
4. Status → 'running'
   ↓
5. System gửi tiếp từ email cuối
```

---

# 8. UTILITY FUNCTIONS

```typescript
// Spam Detection
const SPAM_KEYWORDS = [
  'free', 'miễn phí', 'giảm giá', 'khuyến mãi', 'sale',
  'urgent', 'khẩn cấp', 'act now', 'limited time',
  'click here', 'nhấp vào đây', 'winner', 'trúng thưởng',
  '100%', 'guarantee', 'cam kết', 'no risk'
];

function detectSpamKeywords(subject: string): string[] {
  const lowerSubject = subject.toLowerCase();
  return SPAM_KEYWORDS.filter(keyword => 
    lowerSubject.includes(keyword.toLowerCase())
  );
}

// Time Helpers
function isLowEngagementTime(date: Date): boolean {
  const hour = date.getHours();
  return hour >= 2 && hour < 6;
}

function formatDateTime(date: Date | string): string {
  return dayjs(date).format('DD/MM/YYYY HH:mm');
}

function formatDate(date: Date | string): string {
  return dayjs(date).format('DD/MM/YYYY');
}

// File Helpers
function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

const ALLOWED_FILE_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'image/jpeg', 'image/png', 'image/gif'
];
```

---

# 9. MOCK DATA

## 9.1 Mock Campaigns (Normal)

```typescript
export const MOCK_CAMPAIGNS: Campaign[] = [
  {
    id: 'camp-001',
    name: 'Chiến dịch Tết 2025',
    type: 'normal',
    status: 'sent',
    subject: '🧧 Ưu đãi Tết 2025 dành riêng cho {ten_khach}!',
    preview_text: 'Giảm đến 50% cho tất cả sản phẩm',
    sender_email_id: 'se-001',
    template_id: 'tpl-user-001',
    attachments: [],
    recipient_filter: {
      labels: ['VIP', 'Tiềm năng'],
      sources: [],
      statuses: [],
      date_range: null,
      exclude_sent_within_days: 7,
      exclude_unsubscribed: true,
      exclude_bounced: true
    },
    recipient_count: 500,
    valid_email_count: 485,
    send_type: 'immediate',
    scheduled_at: null,
    batches: null,
    ab_config: null,
    stats: {
      total_recipients: 485,
      total_sent: 485,
      total_delivered: 472,
      total_bounced: 13,
      total_opened: 210,
      total_clicked: 45,
      total_unsubscribed: 3,
      delivery_rate: 97.3,
      open_rate: 44.5,
      click_rate: 9.5,
      bounce_rate: 2.7,
      unsubscribe_rate: 0.6,
      stats_a: null,
      stats_b: null
    },
    created_by: 'user-001',
    created_at: new Date('2025-01-15T08:00:00Z'),
    updated_at: new Date('2025-01-16T10:00:00Z'),
    started_at: new Date('2025-01-16T09:00:00Z'),
    completed_at: new Date('2025-01-16T09:45:00Z'),
    deleted_at: null
  },
  {
    id: 'camp-003',
    name: 'Welcome email tự động',
    type: 'normal',
    status: 'running',
    subject: 'Chào mừng {ten_khach} đến với {ten_cong_ty}!',
    preview_text: 'Cảm ơn bạn đã đăng ký',
    sender_email_id: 'se-001',
    template_id: 'tpl-sys-001',
    attachments: [],
    recipient_filter: {
      labels: [],
      sources: [],
      statuses: ['Mới'],
      date_range: { from: new Date('2025-01-01'), to: new Date('2025-01-31') },
      exclude_sent_within_days: 0,
      exclude_unsubscribed: true,
      exclude_bounced: true
    },
    recipient_count: 200,
    valid_email_count: 195,
    send_type: 'batch',
    scheduled_at: null,
    batches: [
      {
        batch_number: 1,
        email_count: 100,
        scheduled_at: new Date('2025-01-31T09:00:00Z'),
        status: 'completed',
        sent_count: 98,
        failed_count: 2,
        started_at: new Date('2025-01-31T09:00:00Z'),
        completed_at: new Date('2025-01-31T09:15:00Z')
      },
      {
        batch_number: 2,
        email_count: 95,
        scheduled_at: new Date('2025-01-31T14:00:00Z'),
        status: 'pending',
        sent_count: 0,
        failed_count: 0,
        started_at: null,
        completed_at: null
      }
    ],
    ab_config: null,
    stats: {
      total_recipients: 195,
      total_sent: 98,
      total_delivered: 96,
      total_bounced: 2,
      total_opened: 45,
      total_clicked: 12,
      total_unsubscribed: 0,
      delivery_rate: 98.0,
      open_rate: 46.9,
      click_rate: 12.5,
      bounce_rate: 2.0,
      unsubscribe_rate: 0,
      stats_a: null,
      stats_b: null
    },
    created_by: 'user-002',
    created_at: new Date('2025-01-30T15:00:00Z'),
    updated_at: new Date('2025-01-31T09:15:00Z'),
    started_at: new Date('2025-01-31T09:00:00Z'),
    completed_at: null,
    deleted_at: null
  },
  {
    id: 'camp-004',
    name: 'Newsletter tháng 2',
    type: 'normal',
    status: 'scheduled',
    subject: '📰 Bản tin tháng 2/2025',
    preview_text: null,
    sender_email_id: 'se-002',
    template_id: 'tpl-user-002',
    attachments: [],
    recipient_filter: {
      labels: [],
      sources: [],
      statuses: [],
      date_range: null,
      exclude_sent_within_days: 7,
      exclude_unsubscribed: true,
      exclude_bounced: true
    },
    recipient_count: 1500,
    valid_email_count: 1450,
    send_type: 'scheduled',
    scheduled_at: new Date('2025-02-01T09:00:00Z'),
    batches: null,
    ab_config: null,
    stats: {
      total_recipients: 0, total_sent: 0, total_delivered: 0, total_bounced: 0,
      total_opened: 0, total_clicked: 0, total_unsubscribed: 0,
      delivery_rate: 0, open_rate: 0, click_rate: 0, bounce_rate: 0, unsubscribe_rate: 0,
      stats_a: null, stats_b: null
    },
    created_by: 'user-001',
    created_at: new Date('2025-01-30T10:00:00Z'),
    updated_at: new Date('2025-01-30T11:00:00Z'),
    started_at: null,
    completed_at: null,
    deleted_at: null
  },
  {
    id: 'camp-005',
    name: 'Chiến dịch test (Nháp)',
    type: 'normal',
    status: 'draft',
    subject: '',
    preview_text: null,
    sender_email_id: null,
    template_id: null,
    attachments: [],
    recipient_filter: {
      labels: [], sources: [], statuses: [], date_range: null,
      exclude_sent_within_days: 7, exclude_unsubscribed: true, exclude_bounced: true
    },
    recipient_count: 0,
    valid_email_count: 0,
    send_type: 'immediate',
    scheduled_at: null,
    batches: null,
    ab_config: null,
    stats: {
      total_recipients: 0, total_sent: 0, total_delivered: 0, total_bounced: 0,
      total_opened: 0, total_clicked: 0, total_unsubscribed: 0,
      delivery_rate: 0, open_rate: 0, click_rate: 0, bounce_rate: 0, unsubscribe_rate: 0,
      stats_a: null, stats_b: null
    },
    created_by: 'user-003',
    created_at: new Date('2025-01-31T08:00:00Z'),
    updated_at: new Date('2025-01-31T08:00:00Z'),
    started_at: null,
    completed_at: null,
    deleted_at: null
  }
];
```

## 9.2 Mock Email Send Logs (Normal)

```typescript
export const MOCK_EMAIL_LOGS: EmailSendLog[] = [
  {
    id: 'log-001',
    campaign_id: 'camp-001',
    batch_number: null,
    recipient_email: 'nguyen.a@gmail.com',
    recipient_customer_id: 'cust-001',
    recipient_name: 'Nguyễn Văn A',
    ab_version: null,
    status: 'clicked',
    queued_at: new Date('2025-01-16T09:00:00Z'),
    sent_at: new Date('2025-01-16T09:01:00Z'),
    delivered_at: new Date('2025-01-16T09:01:30Z'),
    opened_at: new Date('2025-01-16T09:15:00Z'),
    clicked_at: new Date('2025-01-16T09:20:00Z'),
    bounced_at: null,
    unsubscribed_at: null,
    open_count: 3,
    click_count: 2,
    clicked_links: [
      { url: 'https://example.com/sale', clicked_at: new Date('2025-01-16T09:20:00Z'), click_count: 2 }
    ],
    bounce_type: null,
    bounce_reason: null,
    retry_count: 0
  },
  {
    id: 'log-002',
    campaign_id: 'camp-001',
    batch_number: null,
    recipient_email: 'tran.b@company.vn',
    recipient_customer_id: 'cust-002',
    recipient_name: 'Trần Văn B',
    ab_version: null,
    status: 'delivered',
    queued_at: new Date('2025-01-16T09:00:00Z'),
    sent_at: new Date('2025-01-16T09:01:05Z'),
    delivered_at: new Date('2025-01-16T09:01:35Z'),
    opened_at: null,
    clicked_at: null,
    bounced_at: null,
    unsubscribed_at: null,
    open_count: 0,
    click_count: 0,
    clicked_links: [],
    bounce_type: null,
    bounce_reason: null,
    retry_count: 0
  },
  {
    id: 'log-003',
    campaign_id: 'camp-001',
    batch_number: null,
    recipient_email: 'invalid@notexist.xyz',
    recipient_customer_id: 'cust-003',
    recipient_name: 'Test Invalid',
    ab_version: null,
    status: 'bounced',
    queued_at: new Date('2025-01-16T09:00:00Z'),
    sent_at: new Date('2025-01-16T09:01:10Z'),
    delivered_at: null,
    opened_at: null,
    clicked_at: null,
    bounced_at: new Date('2025-01-16T09:01:15Z'),
    unsubscribed_at: null,
    open_count: 0,
    click_count: 0,
    clicked_links: [],
    bounce_type: 'hard',
    bounce_reason: 'Email không tồn tại',
    retry_count: 0
  }
];
```

## 9.3 Mock Customer Filters & Recipients Preview

```typescript
export const MOCK_CUSTOMER_LABELS = [
  { id: 'lbl-001', name: 'VIP', color: '#FFD700' },
  { id: 'lbl-002', name: 'Tiềm năng', color: '#10B981' },
  { id: 'lbl-003', name: 'Doanh nghiệp', color: '#3B82F6' },
  { id: 'lbl-004', name: 'Cá nhân', color: '#8B5CF6' },
  { id: 'lbl-005', name: 'Đối tác', color: '#F59E0B' }
];

export const MOCK_CUSTOMER_SOURCES = [
  { id: 'src-001', name: 'Website' },
  { id: 'src-002', name: 'Facebook' },
  { id: 'src-003', name: 'Zalo' },
  { id: 'src-004', name: 'Google Ads' },
  { id: 'src-005', name: 'Giới thiệu' },
  { id: 'src-006', name: 'Event/Hội thảo' }
];

export const MOCK_CUSTOMER_STATUSES = [
  { id: 'sts-001', name: 'Mới', color: '#3B82F6' },
  { id: 'sts-002', name: 'Đang chăm sóc', color: '#F59E0B' },
  { id: 'sts-003', name: 'Đã liên hệ', color: '#10B981' },
  { id: 'sts-004', name: 'Quan tâm', color: '#8B5CF6' },
  { id: 'sts-005', name: 'Chốt deal', color: '#22C55E' },
  { id: 'sts-006', name: 'Không quan tâm', color: '#6B7280' }
];

export const MOCK_RECIPIENTS_PREVIEW = {
  total_customers: 520,
  valid_emails: 485,
  invalid_emails: 35,
  duplicates_removed: 12,
  excluded: { recently_sent: 45, unsubscribed: 18, bounced: 7 },
  sample_recipients: [
    { id: 'cust-001', email: 'nguyen.a@gmail.com', name: 'Nguyễn Văn A', labels: ['VIP'] },
    { id: 'cust-002', email: 'tran.b@company.vn', name: 'Trần Văn B', labels: ['Doanh nghiệp'] },
    { id: 'cust-004', email: 'le.c@gmail.com', name: 'Lê Thị C', labels: ['Tiềm năng'] },
    { id: 'cust-005', email: 'pham.d@outlook.com', name: 'Phạm Văn D', labels: [] },
    { id: 'cust-006', email: 'hoang.e@yahoo.com', name: 'Hoàng Thị E', labels: ['VIP', 'Đối tác'] }
  ]
};
```

---

# 10. IMPLEMENTATION CHECKLIST

## 10.1 Danh sách chiến dịch

- [ ] `CampaignListPage` - Trang danh sách chính
- [ ] `CampaignStatusTabs` - Tabs filter theo status
- [ ] `CampaignFilters` - Bộ lọc (group, search)
- [ ] `CampaignTable` - Bảng danh sách
- [ ] `CampaignStatusBadge` - Badge hiển thị status
- [ ] `CampaignActions` - Menu hành động theo status
- [ ] `CreateCampaignTypeModal` - Popup chọn loại
- [ ] `DeleteCampaignModal` - Xác nhận xóa
- [ ] `CancelCampaignModal` - Xác nhận hủy

## 10.2 Tạo chiến dịch thường

- [ ] `NormalCampaignEditorPage` - Trang editor chính
- [ ] `CampaignEditorHeader` - Header với save/back
- [ ] `ChecklistItem` - Component item checklist
- [ ] `SubjectModal` - Popup nhập tiêu đề
- [ ] `PreviewTextModal` - Popup nhập preview text
- [ ] `SenderModal` - Popup chọn người gửi
- [ ] `RecipientsModal` - Popup chọn người nhận
- [ ] `ContentModal` - Popup chọn mẫu nội dung
- [ ] `AttachmentsModal` - Popup upload files
- [ ] `ConfirmStartModal` - Popup cấu hình thời gian
- [ ] `BatchScheduleEditor` - Editor cho gửi theo đợt

## 10.3 Hooks & State

- [ ] `useCampaigns` hook - List campaigns
- [ ] `useCampaignEditor` hook - Form state management
- [ ] `useCampaignActions` hook - Campaign actions (start, pause, etc.)
- [ ] `campaignsStore` - Global state management

---

## 📌 VALIDATION RULES

```typescript
const CAMPAIGN_VALIDATION = {
  name: { required: true, maxLength: 255 },
  subject: { required: true, maxLength: 200 },
  preview_text: { required: false, maxLength: 200 },
  recipients: { minCount: 1 },
  attachments: {
    maxFiles: 3,
    maxFileSize: 5 * 1024 * 1024,    // 5MB
    maxTotalSize: 10 * 1024 * 1024   // 10MB
  },
  batches: { max: 10, minIntervalMinutes: 60 }
};
```

## 📌 STATUS COLORS

```typescript
const STATUS_COLORS = {
  draft: { bg: 'bg-blue-100', text: 'text-blue-800' },
  scheduled: { bg: 'bg-yellow-100', text: 'text-yellow-800' },
  running: { bg: 'bg-green-100', text: 'text-green-800' },
  paused: { bg: 'bg-orange-100', text: 'text-orange-800' },
  sent: { bg: 'bg-gray-100', text: 'text-gray-800' },
  cancelled: { bg: 'bg-red-100', text: 'text-red-800' }
};
```

## 📌 HƯỚNG DẪN SỬ DỤNG VỚI COPILOT

```
Based on TASK_10_3_CHIEN_DICH_THUONG.md, create the [ComponentName] component.
```

**Ví dụ:**
- "Create the CampaignListPage with status tabs, filters, table, pagination, and all modals"
- "Create the NormalCampaignEditorPage with checklist UI and all 7 modals"
- "Create the RecipientsModal with filter, preview stats, and exclusion options"
- "Create the ConfirmStartModal with 3 send types and BatchScheduleEditor"

---

*Document generated for AI Code Assistants (Copilot, Claude Code, Cursor AI)*
*Task: 10.3 - Danh sách chiến dịch & Chiến dịch thường*
