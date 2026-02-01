# TASK 10.4 - CHIẾN DỊCH A/B TESTING & CHI TIẾT BÁO CÁO
## Complete UI & Data Flow Specification

> **Module**: Email Marketing
> **Task**: 10.4 - Chiến dịch A/B Testing (10 User Stories) + Chi tiết & Báo cáo chiến dịch
> **Phạm vi**: Tạo chiến dịch A/B + Xem chi tiết/thống kê bất kỳ chiến dịch nào
> **Mục đích**: Copilot/AI Code Assistant generate đầy đủ UI, logic, data flow
> **Version**: 1.0 | **Date**: 31/01/2025

---

## 📑 MỤC LỤC

1. [TỔNG QUAN A/B TESTING](#1-tổng-quan-ab-testing)
2. [DATA MODELS](#2-data-models)
3. [API ENDPOINTS](#3-api-endpoints)
4. [STATE MANAGEMENT](#4-state-management)
5. [UI - TẠO CHIẾN DỊCH A/B](#5-ui---tạo-chiến-dịch-ab)
6. [UI - XEM CHI TIẾT & BÁO CÁO](#6-ui---xem-chi-tiết--báo-cáo)
7. [USER FLOWS](#7-user-flows)
8. [UTILITY FUNCTIONS](#8-utility-functions)
9. [MOCK DATA](#9-mock-data)
10. [IMPLEMENTATION CHECKLIST](#10-implementation-checklist)

---

# 1. TỔNG QUAN A/B TESTING

## 1.1 A/B Testing Concept

```
┌─────────────────────────────────────────────────────────────┐
│                    CHIẾN DỊCH A/B TESTING                    │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  📧 Tổng: 1000 người nhận                                   │
│                                                             │
│  ┌───────────┐  ┌───────────┐  ┌───────────────────────┐  │
│  │ VERSION A │  │ VERSION B │  │    PHẦN CÒN LẠI       │  │
│  │   10%     │  │   10%     │  │       80%              │  │
│  │ 100 email │  │ 100 email │  │     800 email          │  │
│  └─────┬─────┘  └─────┬─────┘  └───────────┬───────────┘  │
│        │              │                     │              │
│        ▼              ▼                     │              │
│  ┌──────────────────────────┐              │              │
│  │  ⏳ CHỜ ĐÁNH GIÁ (24h)  │              │              │
│  │  So sánh Open/Click rate │              │              │
│  └──────────┬───────────────┘              │              │
│             │                              │              │
│             ▼                              │              │
│  ┌──────────────────────────┐              │              │
│  │  🏆 VERSION B THẮNG      │              │              │
│  │  Open rate: 50.5% > 41.7%│──────────────┘              │
│  └──────────────────────────┘                              │
│             │                                              │
│             ▼                                              │
│  ┌──────────────────────────┐                              │
│  │  📤 GỬI 800 email        │                              │
│  │  với nội dung VERSION B  │                              │
│  └──────────────────────────┘                              │
└─────────────────────────────────────────────────────────────┘
```

## 1.2 A/B Test Types

| Loại test | So sánh gì | Giữ nguyên |
|-----------|-----------|------------|
| **Tiêu đề (subject)** | 2 tiêu đề khác nhau | Nội dung, người gửi, thời gian |
| **Nội dung (content)** | 2 mẫu email khác nhau | Tiêu đề, người gửi, thời gian |
| **Thời gian (send_time)** | 2 khung giờ gửi khác nhau | Tiêu đề, nội dung, người gửi |

## 1.3 A/B Campaign Status Flow

```
Tạo chiến dịch A/B
   ↓
[draft] → Cấu hình A/B → [scheduled/immediate]
   ↓
[running] → Gửi song song A và B (% nhỏ)
   ↓
⏳ Chờ đánh giá (evaluation_hours)
   ↓
🏆 Xác định winner
   ↓
[Nếu auto_send = true]  → Tự động gửi phần còn lại → [sent]
[Nếu auto_send = false] → Chờ user quyết định
   ↓
User chọn gửi phiên bản A hoặc B → Gửi phần còn lại → [sent]
```

## 1.4 Shared References

> **Lưu ý**: File này sử dụng chung các models/types sau từ Task 10.3:
> - `Campaign`, `CampaignType`, `CampaignStatus`, `SendType`
> - `RecipientFilter`, `Attachment`, `BatchSchedule`
> - `CampaignStatusBadge`, `ChecklistItem`
> - Các API CRUD cơ bản của Campaign

---

# 2. DATA MODELS

## 2.1 A/B Test Config Model

```typescript
interface ABTestConfig {
  // Loại A/B test
  test_type: ABTestType;
  
  // Nội dung phiên bản A & B
  version_a: ABVersionContent;
  version_b: ABVersionContent;
  
  // Tỷ lệ gửi
  ratio_a: number;                // % cho phiên bản A (default: 10)
  ratio_b: number;                // % cho phiên bản B (default: 10)
  // Phần còn lại: 100 - ratio_a - ratio_b → dành cho winner
  
  // Thời gian đánh giá
  evaluation_hours: number;       // Default: 24, min: 1, max: 168 (7 days)
  
  // Tiêu chí đánh giá
  winning_criteria: 'open' | 'click';
  winning_threshold: number | null;  // Ngưỡng tối thiểu (null = so sánh tương đối)
  
  // Tự động gửi winner
  auto_send_winner: boolean;      // Default: false
  
  // Kết quả
  winner: 'a' | 'b' | 'tie' | null;
  evaluation_completed_at: Date | null;
  winner_sent_at: Date | null;
}

type ABTestType = 
  | 'subject'     // Test tiêu đề
  | 'content'     // Test nội dung
  | 'send_time';  // Test thời gian gửi

interface ABVersionContent {
  subject?: string;           // For 'subject' test
  template_id?: string;       // For 'content' test
  send_at?: Date;             // For 'send_time' test
}
```

## 2.2 A/B Version Stats Model

```typescript
interface ABVersionStats {
  sent: number;
  delivered: number;
  opened: number;
  clicked: number;
  open_rate: number;
  click_rate: number;
}
```

## 2.3 Campaign Stats Model (Full - with A/B)

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
  delivery_rate: number;
  open_rate: number;
  click_rate: number;
  bounce_rate: number;
  unsubscribe_rate: number;
  
  // A/B specific
  stats_a: ABVersionStats | null;     // null cho chiến dịch thường
  stats_b: ABVersionStats | null;     // null cho chiến dịch thường
}
```

## 2.4 Email Send Log Model (with A/B version)

```typescript
interface EmailSendLog {
  id: string;
  campaign_id: string;
  batch_number: number | null;
  
  recipient_email: string;
  recipient_customer_id: string;
  recipient_name: string | null;
  
  ab_version: 'a' | 'b' | null;      // ← Quan trọng cho A/B
  
  status: EmailStatus;
  
  queued_at: Date;
  sent_at: Date | null;
  delivered_at: Date | null;
  opened_at: Date | null;
  clicked_at: Date | null;
  bounced_at: Date | null;
  unsubscribed_at: Date | null;
  
  open_count: number;
  click_count: number;
  clicked_links: ClickedLink[];
  
  bounce_type: 'soft' | 'hard' | null;
  bounce_reason: string | null;
  retry_count: number;
}

type EmailStatus = 
  | 'queued' | 'sending' | 'sent' | 'delivered'
  | 'opened' | 'clicked' | 'bounced' | 'failed' | 'unsubscribed';
```

---

# 3. API ENDPOINTS

## 3.1 A/B Testing APIs

```typescript
// GET: Kết quả A/B test
GET /api/email-marketing/campaigns/:id/ab/results
Response: {
  test_type: ABTestType,
  version_a: {
    content: ABVersionContent,
    stats: ABVersionStats
  },
  version_b: {
    content: ABVersionContent,
    stats: ABVersionStats
  },
  winner: 'a' | 'b' | 'tie' | null,
  comparison: {
    open_rate_diff: number,       // B - A (có thể âm)
    click_rate_diff: number
  },
  evaluation_status: 'pending' | 'completed',
  remaining_count: number,
  can_send_remaining: boolean
}

// POST: Gửi phần còn lại
POST /api/email-marketing/campaigns/:id/ab/send-remaining
Body: { version: 'a' | 'b', send_type?, scheduled_at? }
Response: { data: Campaign, message: "Đã bắt đầu gửi phần còn lại" }
```

## 3.2 Statistics APIs

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

## 3.3 Recipients APIs (for Detail view)

```typescript
// GET: Danh sách người nhận
GET /api/email-marketing/campaigns/:id/recipients
Query: status?, search?, page?, limit?
Response: { data: EmailSendLog[], pagination, counts }

// POST: Gửi lại email thất bại
POST /api/email-marketing/campaigns/:id/recipients/retry
Body: { recipient_ids?, retry_type?: 'soft_bounce' | 'all' }
Response: { queued_count, skipped_count }
```

---

# 4. STATE MANAGEMENT

## 4.1 Campaign A/B Editor Store

```typescript
interface ABCampaignEditorState {
  mode: 'create' | 'edit';
  campaignType: 'ab';
  
  formData: {
    name: string;
    subject: string;
    subject_b: string | null;           // For A/B subject test
    preview_text: string;
    sender_email_id: string | null;
    template_id: string | null;
    template_b_id: string | null;       // For A/B content test
    recipient_filter: RecipientFilter;
    attachments: Attachment[];
    
    // Schedule
    send_type: SendType;
    scheduled_at: Date | null;
    
    // A/B config
    ab_test_type: ABTestType | null;
    ab_ratio_a: number;                 // Default: 10
    ab_ratio_b: number;                 // Default: 10
    ab_evaluation_hours: number;        // Default: 24
    ab_winning_criteria: 'open' | 'click';
    ab_winning_threshold: number | null;
    ab_auto_send_winner: boolean;
    ab_send_time_a: Date | null;        // For send_time test
    ab_send_time_b: Date | null;        // For send_time test
  };
  
  // Step wizard
  currentStep: 'basic' | 'ab_config' | 'confirm';
  
  // Recipients preview
  recipientsPreview: RecipientsPreviewData | null;
  
  // Validation
  errors: Record<string, string | null>;
  isDirty: boolean;
  isSaving: boolean;
  lastSavedAt: Date | null;
}
```

## 4.2 Campaign Detail Store

```typescript
interface CampaignDetailState {
  campaign: Campaign | null;
  loading: boolean;
  
  // Stats
  stats: CampaignStats | null;
  statsLoading: boolean;
  
  // A/B Results
  abResults: ABTestResults | null;
  
  // Recipients
  recipients: EmailSendLog[];
  recipientsLoading: boolean;
  recipientsPagination: Pagination;
  recipientsFilter: {
    status: EmailStatus | 'all';
    search: string;
  };
  recipientsCounts: Record<EmailStatus | 'all', number>;
  
  // Timeline Chart
  timelineData: Array<{ timestamp: Date; count: number }>;
  timelineMetric: 'sent' | 'opened' | 'clicked';
  timelineInterval: 'hour' | 'day';
}
```

---

# 5. UI - TẠO CHIẾN DỊCH A/B

## 5.1 ABCampaignEditorPage

**Route**: `/email-marketing/campaigns/new?type=ab`

```tsx
// Layout with Steps
ABCampaignEditorPage
├── CampaignEditorHeader
│   ├── BackButton
│   ├── Badge: "A/B Testing"
│   └── SaveDraftButton
├── StepIndicator
│   └── Steps: [1: Thông tin cơ bản] → [2: Cấu hình A/B] → [3: Xác nhận]
└── StepContent
    ├── ABBasicInfoStep (step 1)
    ├── ABConfigStep (step 2)
    └── ABConfirmStep (step 3)
```

## 5.2 ABBasicInfoStep (Step 1)

```tsx
// Content
├── Card: Campaign Name
│
├── Card: A/B Test Type Selection
│   ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│   │ 📧 Tiêu đề mail │ │ 📝 Nội dung mail│ │ ⏰ Thời gian gửi│
│   │                 │ │                 │ │                 │
│   │ So sánh 2 tiêu  │ │ So sánh 2 mẫu   │ │ So sánh 2 khung │
│   │ đề khác nhau    │ │ nội dung khác   │ │ giờ gửi khác    │
│   └─────────────────┘ └─────────────────┘ └─────────────────┘
│   💡 Tips: Chỉ thay đổi 1 yếu tố mỗi lần
│
├── Card: Thông tin chung
│   ├── ChecklistItem: Người gửi *            (dùng chung cả 2 version)
│   ├── ChecklistItem: Người nhận * (min 100) (dùng chung cả 2 version)
│   ├── ChecklistItem: Nội dung * (nếu test_type != 'content')
│   └── ChecklistItem: Tiêu đề * (nếu test_type != 'subject')
│
├── Warning (if recipients < 100):
│   "⚠️ Cần tối thiểu 100 người nhận cho A/B testing"
│
└── Navigation: [Tiếp tục →]
```

## 5.3 ABConfigStep (Step 2)

```tsx
// Content
├── Card: Nhập 2 phiên bản [Tiêu đề/Nội dung/Thời gian]
│   ┌──────────────────────────────────────────────────────┐
│   │  ┌──────────────────────┐  ┌──────────────────────┐ │
│   │  │ [A] Phiên bản A      │  │ [B] Phiên bản B      │ │
│   │  │ (red-50, red border) │  │ (blue-50, blue border)│ │
│   │  │                      │  │                      │ │
│   │  │ [Input/Selector      │  │ [Input/Selector      │ │
│   │  │  tùy theo test_type] │  │  tùy theo test_type] │ │
│   │  └──────────────────────┘  └──────────────────────┘ │
│   └──────────────────────────────────────────────────────┘
│
├── Card: Tùy chỉnh tỷ lệ gửi mail
│   - Tỷ lệ phiên bản A: [10] %
│   - Tỷ lệ phiên bản B: [10] %
│   
│   ABRatioVisualization:
│   ┌────────────────────────────────────────────────────────┐
│   │ [████ A 10%][████ B 10%][████████████ Winner 80%]     │
│   │   98 email   98 email        784 email                │
│   └────────────────────────────────────────────────────────┘
│   ⚠️ Tổng tỷ lệ A và B không quá 50%
│
├── Card: Cài đặt đánh giá phiên bản thắng
│   ├── Thời gian đánh giá:
│   │   [1] Ngày [0] Giờ
│   │   💡 Nên chờ ít nhất 24 giờ để có đủ dữ liệu
│   │
│   ├── Tiêu chí đánh giá:
│   │   (●) Số lượng mở mail (Open)
│   │       → Input optional: "Số lượng mở phải lớn hơn: ___"
│   │   ( ) Số lượng click link
│   │
│   └── Tự động gửi phần còn lại:
│       (●) Có, tự động gửi ngay khi tìm ra phiên bản thắng
│       ( ) Không, tôi sẽ chủ động gửi sau
│
└── Navigation: [← Quay lại] [Tiếp tục →]
```

## 5.4 ABRatioVisualization Component

```tsx
interface ABRatioVisualizationProps {
  ratioA: number;           // 5-45%
  ratioB: number;           // 5-45%
  totalRecipients: number;
}

// Visual:
// ┌────────────────────────────────────────────────────────┐
// │ [███ A 10%][███ B 10%][██████████████ Winner 80%]     │
// └────────────────────────────────────────────────────────┘
//    98 email   98 email        784 email

// Colors: A = bg-red-500, B = bg-blue-500, Winner = bg-green-500
```

## 5.5 ABVersionInput Component

```tsx
// Render khác nhau tùy theo test_type:

// test_type = 'subject':
  <FormField label="Tiêu đề email">
    <Input placeholder="VD: Ưu đãi đặc biệt dành cho bạn!" />
  </FormField>

// test_type = 'content':
  <FormField label="Mẫu nội dung">
    <TemplateSelector />
  </FormField>

// test_type = 'send_time':
  <FormField label="Thời gian gửi">
    <DateTimePicker minDate={new Date()} />
  </FormField>
```

## 5.6 ABConfirmStep (Step 3)

```tsx
// Content
├── Summary Card:
│   ┌─────────────────────────────────────────────────────────┐
│   │ Loại test: Tiêu đề email                               │
│   │ Người gửi: sales@vilead.vn                             │
│   │ Người nhận: 980 email                                  │
│   │                                                        │
│   │ Phiên bản A (10% - 98 email):                          │
│   │   "Sale cuối năm - Giảm giá sốc!"                      │
│   │                                                        │
│   │ Phiên bản B (10% - 98 email):                          │
│   │   "{ten_khach} ơi, đừng bỏ lỡ Sale cuối năm!"         │
│   │                                                        │
│   │ Phần còn lại: 80% - 784 email                          │
│   │ Thời gian đánh giá: 24 giờ                             │
│   │ Tiêu chí: Số lượng mở mail                             │
│   │ Tự động gửi: Không                                     │
│   └─────────────────────────────────────────────────────────┘
│
├── Important Notice (info):
│   "Sau khi bắt đầu, A và B sẽ được gửi đồng thời.
│    Sau [24 giờ], hệ thống sẽ xác định phiên bản thắng."
│
├── Confirm Checkbox:
│   ☐ Tôi đã kiểm tra và xác nhận thông tin chính xác
│
└── Navigation: [← Quay lại] [▶️ Bắt đầu chiến dịch]
```

---

# 6. UI - XEM CHI TIẾT & BÁO CÁO

## 6.1 CampaignDetailPage

**Route**: `/email-marketing/campaigns/:id`

```tsx
// Layout
CampaignDetailPage
├── Header
│   ├── BackButton
│   ├── Title: "[A/B] Chiến dịch Tết 2025" + StatusBadge
│   ├── Subtitle: "Tạo lúc DD/MM HH:mm • Bắt đầu lúc ..."
│   └── CampaignDetailActions (based on status)
│
├── CampaignStatsOverview (5 stat cards)
│
├── ABTestResults (if type = 'ab')
│
├── CampaignCharts
│   ├── TimelineChart: Opens/Clicks theo thời gian
│   └── FunnelChart: Gửi → Deliver → Open → Click
│
└── CampaignRecipientsList
    ├── Tabs: [Tất cả | Thành công | Đã mở | Đã click | Thất bại | Hủy ĐK]
    ├── Export Button
    └── Table + Pagination
```

## 6.2 CampaignStatsOverview

```tsx
// 5 Stat Cards in a row
┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐
│   485   │ │   472   │ │    13   │ │   210   │ │    45   │
│Tổng gửi │ │Thành công│ │Thất bại │ │ Đã mở  │ │ Đã click│
│         │ │ 97.3%   │ │  2.7%   │ │ 44.5%  │ │  9.5%  │
└─────────┘ └─────────┘ └─────────┘ └─────────┘ └─────────┘
   gray       green        red        blue       primary

// Mỗi card hiển thị:
// - Số tuyệt đối (lớn, font-bold)
// - Label
// - Tỷ lệ % (nhỏ hơn)
```

## 6.3 ABTestResults Component

```tsx
// Card Layout
┌─────────────────────────────────────────────────────────────┐
│ 🔀 Kết quả A/B Testing                                     │
│                                                            │
│ Loại test: Tiêu đề email                                   │
│                                                            │
│ ┌────────────────────────┐  ┌────────────────────────┐    │
│ │ [A] Phiên bản A        │  │ [B] Phiên bản B  🏆    │    │
│ │ (red border)           │  │ (green border = winner)│    │
│ │                        │  │                        │    │
│ │ Đã gửi: 98             │  │ Đã gửi: 98             │    │
│ │ Đã mở: 40 (41.7%)      │  │ Đã mở: 48 (50.5%)      │    │
│ │ Đã click: 10 (10.4%)   │  │ Đã click: 14 (14.7%)   │    │
│ └────────────────────────┘  └────────────────────────┘    │
│                                                            │
│ ✅ Kết luận: Phiên bản B thắng với tỷ lệ mở cao hơn 8.8%  │
│                                                            │
│ (if evaluation pending):                                   │
│ ⏳ Đang đánh giá... Còn X giờ Y phút                       │
│                                                            │
│ (if can_send_remaining && !winner_sent):                   │
│ ┌────────────────────────────────────────────────────────┐│
│ │ Gửi phần còn lại (784 email)                          ││
│ │ [Gửi phiên bản A] [Gửi phiên bản B (recommended)]     ││
│ └────────────────────────────────────────────────────────┘│
│                                                            │
│ (if winner_sent):                                          │
│ ✅ Đã gửi phần còn lại với phiên bản B lúc DD/MM HH:mm    │
└─────────────────────────────────────────────────────────────┘

// Version Card colors:
// Normal: border-red-200 (A) / border-blue-200 (B)
// Winner: border-green-500 + bg-green-50
// Badge 🏆 THẮNG: variant="success"
```

## 6.4 CampaignCharts

```tsx
// 2 charts side by side

// TimelineChart (left):
// - Line chart showing opens/clicks over time
// - Toggle: [Theo giờ] [Theo ngày]
// - Metric selector: [Đã mở] [Đã click]
// - Library: recharts

// FunnelChart (right):
// - Horizontal bar chart showing conversion funnel
// - Levels: Gửi (100%) → Deliver (97.3%) → Open (44.5%) → Click (9.5%)
// - Each level shows count + percentage
```

## 6.5 CampaignRecipientsList

```tsx
// Layout
├── Header: "Chi tiết người nhận" + [Export Excel] button
│
├── Tabs with counts:
│   [Tất cả (485)] [Thành công (472)] [Đã mở (210)] 
│   [Đã click (45)] [Thất bại (13)] [Hủy ĐK (3)]
│
├── Table Columns:
│   | Email | Tên KH | Trạng thái | Gửi lúc | Mở lúc | Số lần mở | [Xem hồ sơ] |
│
└── Pagination

// EmailStatusBadge colors:
// delivered: green, opened: blue, clicked: indigo, bounced: red, unsubscribed: gray
```

## 6.6 CampaignDetailActions

```tsx
// Buttons change based on campaign status:
switch(status) {
  case 'running':
    → [Tạm dừng]
  
  case 'paused':
    → [Tiếp tục] [Chi tiết]
  
  case 'sent':
    → [Tạo bản sao] [Export]
}
```

---

# 7. USER FLOWS

## 7.1 Flow: Tạo chiến dịch A/B Testing

```
1. User chọn "Chiến dịch A/B" từ popup
   ↓
2. Redirect to /email-marketing/campaigns/new?type=ab
   ↓
3. STEP 1: Thông tin cơ bản
   - Chọn loại A/B (Tiêu đề / Nội dung / Thời gian)
   - Chọn Người gửi (dùng chung)
   - Chọn Người nhận (min 100)
   - Chọn nội dung chung (nếu không test content)
   ↓
4. STEP 2: Cấu hình A/B
   - Nhập 2 phiên bản A và B
   - Cài đặt tỷ lệ gửi (A: 10%, B: 10%)
   - Cài đặt thời gian đánh giá (24h)
   - Chọn tiêu chí thắng (Open / Click)
   - Chọn gửi tự động hay thủ công
   ↓
5. STEP 3: Xác nhận
   - Review thông tin
   - Tick xác nhận
   ↓
6. Click "Bắt đầu"
   ↓
7. System gửi song song A và B
   ↓
8. CHỜ thời gian đánh giá
   ↓
9. System xác định winner
   ↓
10. [Nếu auto] → Tự động gửi phần còn lại
    [Nếu manual] → Notification + Chờ quyết định
```

## 7.2 Flow: A/B Testing - Gửi phần còn lại

```
1. A/B test hoàn thành đánh giá
   ↓
2. System xác định winner (VD: B thắng)
   ↓
3. [Nếu auto_send = false]
   User vào trang chi tiết
   ↓
4. Xem kết quả A/B
   ↓
5. Có 2 options:
   - [Gửi phiên bản A]
   - [Gửi phiên bản B (recommended)]
   ↓
6. User chọn phiên bản
   ↓
7. Popup xác nhận: Gửi ngay / Lên lịch
   ↓
8. System gửi 80% còn lại với phiên bản được chọn
   ↓
9. Cập nhật winner_sent_at
```

## 7.3 Flow: Xem chi tiết chiến dịch

```
1. User click vào tên chiến dịch hoặc "Chi tiết"
   ↓
2. Load campaign detail + stats
   ↓
3. Hiển thị:
   - Stats Overview (5 cards)
   - A/B Results (nếu type='ab')
   - Charts (timeline + funnel)
   - Recipients list
   ↓
4. User có thể:
   - Toggle chart metric (opened/clicked)
   - Filter recipients by status
   - Export to Excel
   - Xem hồ sơ khách hàng
```

---

# 8. UTILITY FUNCTIONS

```typescript
// A/B Test Helpers
function getTestTypeLabel(testType: ABTestType): string {
  switch (testType) {
    case 'subject': return 'Tiêu đề email';
    case 'content': return 'Nội dung email';
    case 'send_time': return 'Thời gian gửi';
    default: return '';
  }
}

function calculateWinnerRemainingCount(campaign: Campaign): number {
  const totalRecipients = campaign.valid_email_count;
  const ratioA = campaign.ab_config?.ratio_a || 10;
  const ratioB = campaign.ab_config?.ratio_b || 10;
  const winnerRatio = 100 - ratioA - ratioB;
  return Math.floor(totalRecipients * winnerRatio / 100);
}

function getRemainingTime(abConfig: ABTestConfig): string {
  const startTime = abConfig.evaluation_started_at || new Date();
  const endTime = addHours(startTime, abConfig.evaluation_hours);
  const remaining = differenceInHours(endTime, new Date());
  if (remaining > 24) {
    return `${Math.floor(remaining / 24)} ngày ${remaining % 24} giờ`;
  }
  return `${remaining} giờ`;
}

// Time Helpers
function formatDateTime(date: Date | string): string {
  return dayjs(date).format('DD/MM/YYYY HH:mm');
}

function formatDate(date: Date | string): string {
  return dayjs(date).format('DD/MM/YYYY');
}
```

---

# 9. MOCK DATA

## 9.1 Mock A/B Campaign

```typescript
export const MOCK_AB_CAMPAIGN: Campaign = {
  id: 'camp-002',
  name: '[A/B] Test tiêu đề - Sale cuối năm',
  type: 'ab',
  status: 'sent',
  subject: 'Sale cuối năm - Giảm giá sốc!',
  preview_text: null,
  sender_email_id: 'se-002',
  template_id: 'tpl-sys-002',
  attachments: [],
  recipient_filter: {
    labels: [],
    sources: ['Website', 'Facebook'],
    statuses: ['Mới', 'Đang chăm sóc'],
    date_range: null,
    exclude_sent_within_days: 7,
    exclude_unsubscribed: true,
    exclude_bounced: true
  },
  recipient_count: 1000,
  valid_email_count: 980,
  send_type: 'immediate',
  scheduled_at: null,
  batches: null,
  ab_config: {
    test_type: 'subject',
    version_a: { subject: 'Sale cuối năm - Giảm giá sốc!' },
    version_b: { subject: '{ten_khach} ơi, đừng bỏ lỡ Sale cuối năm!' },
    ratio_a: 10,
    ratio_b: 10,
    evaluation_hours: 24,
    winning_criteria: 'open',
    winning_threshold: null,
    auto_send_winner: false,
    winner: 'b',
    evaluation_completed_at: new Date('2025-01-15T09:00:00Z'),
    winner_sent_at: new Date('2025-01-15T10:30:00Z')
  },
  stats: {
    total_recipients: 980,
    total_sent: 980,
    total_delivered: 960,
    total_bounced: 20,
    total_opened: 420,
    total_clicked: 120,
    total_unsubscribed: 5,
    delivery_rate: 98.0,
    open_rate: 43.8,
    click_rate: 12.5,
    bounce_rate: 2.0,
    unsubscribe_rate: 0.5,
    stats_a: {
      sent: 98, delivered: 96, opened: 40, clicked: 10,
      open_rate: 41.7, click_rate: 10.4
    },
    stats_b: {
      sent: 98, delivered: 95, opened: 48, clicked: 14,
      open_rate: 50.5, click_rate: 14.7
    }
  },
  created_by: 'user-001',
  created_at: new Date('2025-01-14T08:00:00Z'),
  updated_at: new Date('2025-01-15T10:30:00Z'),
  started_at: new Date('2025-01-14T09:00:00Z'),
  completed_at: new Date('2025-01-15T11:00:00Z'),
  deleted_at: null
};
```

## 9.2 Mock A/B Email Send Logs

```typescript
export const MOCK_AB_EMAIL_LOGS: EmailSendLog[] = [
  {
    id: 'log-004',
    campaign_id: 'camp-002',
    batch_number: null,
    recipient_email: 'le.c@gmail.com',
    recipient_customer_id: 'cust-004',
    recipient_name: 'Lê Thị C',
    ab_version: 'a',
    status: 'opened',
    queued_at: new Date('2025-01-14T09:00:00Z'),
    sent_at: new Date('2025-01-14T09:00:30Z'),
    delivered_at: new Date('2025-01-14T09:01:00Z'),
    opened_at: new Date('2025-01-14T09:30:00Z'),
    clicked_at: null,
    bounced_at: null,
    unsubscribed_at: null,
    open_count: 1,
    click_count: 0,
    clicked_links: [],
    bounce_type: null,
    bounce_reason: null,
    retry_count: 0
  },
  {
    id: 'log-005',
    campaign_id: 'camp-002',
    batch_number: null,
    recipient_email: 'pham.d@outlook.com',
    recipient_customer_id: 'cust-005',
    recipient_name: 'Phạm Văn D',
    ab_version: 'b',
    status: 'clicked',
    queued_at: new Date('2025-01-14T09:00:00Z'),
    sent_at: new Date('2025-01-14T09:00:35Z'),
    delivered_at: new Date('2025-01-14T09:01:05Z'),
    opened_at: new Date('2025-01-14T10:00:00Z'),
    clicked_at: new Date('2025-01-14T10:02:00Z'),
    bounced_at: null,
    unsubscribed_at: null,
    open_count: 2,
    click_count: 3,
    clicked_links: [
      { url: 'https://example.com/product/1', clicked_at: new Date('2025-01-14T10:02:00Z'), click_count: 2 },
      { url: 'https://example.com/contact', clicked_at: new Date('2025-01-14T10:05:00Z'), click_count: 1 }
    ],
    bounce_type: null,
    bounce_reason: null,
    retry_count: 0
  }
];
```

---

# 10. IMPLEMENTATION CHECKLIST

## 10.1 Tạo chiến dịch A/B

- [ ] `ABCampaignEditorPage` - Trang editor A/B
- [ ] `StepIndicator` - Hiển thị bước (3 steps)
- [ ] `ABBasicInfoStep` - Step 1: Thông tin cơ bản
- [ ] `ABTestTypeCard` - Card chọn loại A/B (3 cards)
- [ ] `ABConfigStep` - Step 2: Cấu hình A/B
- [ ] `ABVersionInput` - Input cho phiên bản A/B (3 variants)
- [ ] `ABRatioVisualization` - Biểu đồ tỷ lệ gửi
- [ ] `ABConfirmStep` - Step 3: Xác nhận & review

## 10.2 Chi tiết chiến dịch & Báo cáo

- [ ] `CampaignDetailPage` - Trang chi tiết
- [ ] `CampaignStatsOverview` - 5 stat cards
- [ ] `StatCard` - Card hiển thị số liệu + %
- [ ] `ABTestResults` - Kết quả A/B testing + gửi remaining
- [ ] `CampaignCharts` - Biểu đồ (Timeline + Funnel)
- [ ] `CampaignRecipientsList` - Danh sách người nhận + tabs
- [ ] `EmailStatusBadge` - Badge status email
- [ ] `CampaignDetailActions` - Nút hành động theo status

## 10.3 Hooks & State

- [ ] `useCampaignDetail` hook - Get campaign detail
- [ ] `useABCampaignEditor` hook - A/B editor state
- [ ] `useCampaignStats` hook - Statistics
- [ ] `useCampaignRecipients` hook - Recipients list

---

## 📌 VALIDATION RULES (A/B Specific)

```typescript
const AB_VALIDATION = {
  recipients: { minCountForAB: 100 },
  ab_config: {
    ratio: { min: 5, max: 45, total_max: 50 },
    evaluation_hours: { min: 1, max: 168 }    // 1h to 7 days
  }
};
```

## 📌 A/B VERSION COLORS

```typescript
const AB_VERSION_COLORS = {
  a: { primary: '#EF4444', bg: 'bg-red-50', border: 'border-red-200' },
  b: { primary: '#3B82F6', bg: 'bg-blue-50', border: 'border-blue-200' },
  winner: { primary: '#22C55E', bg: 'bg-green-50', border: 'border-green-500' }
};
```

## 📌 REAL-TIME POLLING

```typescript
const POLLING_INTERVALS = {
  runningCampaign: 10000,      // 10s - refresh stats
  abEvaluation: 60000,         // 1 min - check winner
  statistics: 300000           // 5 min - refresh charts
};
```

## 📌 HƯỚNG DẪN SỬ DỤNG VỚI COPILOT

```
Based on TASK_10_4_CHIEN_DICH_AB_VA_CHI_TIET.md, create the [ComponentName] component.
```

**Ví dụ:**
- "Create the ABCampaignEditorPage with 3-step wizard"
- "Create the ABConfigStep with ratio visualization and evaluation settings"
- "Create the ABTestResults component showing comparison and send remaining"
- "Create the CampaignDetailPage with stats, charts, and recipients list"
- "Create the CampaignStatsOverview with 5 stat cards"

---

*Document generated for AI Code Assistants (Copilot, Claude Code, Cursor AI)*
*Task: 10.4 - Chiến dịch A/B Testing & Chi tiết Báo cáo*
