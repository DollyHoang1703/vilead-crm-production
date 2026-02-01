# TASK 10.5 - BÁO CÁO & THỐNG KÊ EMAIL MARKETING
## Complete UI & Data Flow Specification

> **Module**: Email Marketing (Phase 2)
> **Task**: 10.5 - Báo cáo/Thống kê (7 User Stories)
> **Phạm vi**: Dashboard tổng quan module, biểu đồ xu hướng, so sánh chiến dịch, phễu chuyển đổi, quản lý unsubscribe/bounce, xuất báo cáo
> **Phân biệt**: Task 10.4 = báo cáo 1 chiến dịch cụ thể | Task 10.5 = báo cáo **tổng hợp toàn bộ module**
> **Nguồn yêu cầu**: Tính năng CRM ViLead - Section 2.9.3 (Báo cáo Hiệu quả Chiến dịch)
> **Mục đích**: Copilot/AI Code Assistant generate đầy đủ UI, logic, data flow
> **Version**: 2.0 | **Date**: 01/02/2026

---

## 📑 MỤC LỤC

1. [TỔNG QUAN](#1-tổng-quan)
2. [USER STORIES](#2-user-stories)
3. [BUSINESS RULES](#3-business-rules)
4. [DATA MODELS](#4-data-models)
5. [API ENDPOINTS](#5-api-endpoints)
6. [STATE MANAGEMENT](#6-state-management)
7. [UI COMPONENTS](#7-ui-components)
8. [USER FLOWS](#8-user-flows)
9. [UTILITY FUNCTIONS](#9-utility-functions)
10. [MOCK DATA](#10-mock-data)
11. [IMPLEMENTATION CHECKLIST](#11-implementation-checklist)

---

# 1. TỔNG QUAN

## 1.1 Phạm vi Task 10.5 vs Task 10.4

| Tiêu chí | Task 10.4 (Chi tiết 1 CD) | Task 10.5 (Tổng hợp module) |
|-----------|---------------------------|------------------------------|
| Scope | 1 chiến dịch cụ thể | Toàn bộ module Email Marketing |
| Route | `/campaigns/:id` | `/email-marketing/reports` |
| Data | Stats của 1 campaign | Aggregate stats tất cả campaigns |
| Charts | Timeline gửi 1 campaign | Xu hướng theo ngày/tuần/tháng, so sánh campaigns |
| Filters | Không có (cố định 1 CD) | Period, loại CD, trạng thái, campaign cụ thể |
| Export | Export recipients 1 CD | Export báo cáo tổng hợp (overview + comparison + unsubscribes) |
| Drill-down | Xem chi tiết recipients | Click chart → xem chi tiết CD, người nhận, hành động |

## 1.2 Layout Dashboard

```
┌─────────────────────────────────────────────────────────────────┐
│ BÁO CÁO EMAIL MARKETING                          [Xuất báo cáo]│
├─────────────────────────────────────────────────────────────────┤
│ FILTERS (sticky)                                                │
│ [Tháng này ▼] [Tất cả loại ▼] [Tất cả trạng thái ▼] [Áp dụng]│
│ (Tùy chỉnh: [📅 Từ ngày] → [📅 Đến ngày])                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  PHẦN 1: TỔNG QUAN KPIs (6 stat cards)                         │
│  ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐             │
│  │Tổng │ │Thành│ │Tỷ lệ│ │Tỷ lệ│ │Hủy  │ │Bounce│            │
│  │ gửi │ │công │ │ mở  │ │click│ │ ĐK  │ │     │             │
│  └─────┘ └─────┘ └─────┘ └─────┘ └─────┘ └─────┘             │
│                                                                 │
│  PHẦN 2: BIỂU ĐỒ XU HƯỚNG (line chart)                        │
│  ┌──────────────────────────────────────────────┐               │
│  │  📈 Xu hướng gửi / mở / click theo thời gian │               │
│  │  [✓Gửi] [✓Mở] [✓Click] | Interval: [Ngày▼] │               │
│  └──────────────────────────────────────────────┘               │
│                                                                 │
│  PHẦN 3: PHÂN BỔ + PHỄU (2 cột)                               │
│  ┌──────────────────┐ ┌──────────────────┐                     │
│  │ 🍩 Phân bổ trạng │ │ 📊 Phễu email    │                     │
│  │    thái CD       │ │    conversion    │                     │
│  └──────────────────┘ └──────────────────┘                     │
│                                                                 │
│  PHẦN 4: BẢNG SO SÁNH CHIẾN DỊCH (sortable)                   │
│  ┌──────────────────────────────────────────────┐               │
│  │ 📋 Top chiến dịch + bảng so sánh hiệu quả   │               │
│  └──────────────────────────────────────────────┘               │
│                                                                 │
│  PHẦN 5: UNSUBSCRIBE & BOUNCE                                  │
│  ┌──────────────────────────────────────────────┐               │
│  │ 🚫 Xu hướng hủy ĐK + DS hủy đăng ký         │               │
│  └──────────────────────────────────────────────┘               │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## 1.3 Shared References

> File này sử dụng chung các models/types từ Task 10.3 & 10.4:
> - `Campaign`, `CampaignStatus`, `CampaignStats` (từ Task 10.3)
> - `EmailSendLog`, `EmailStatus` (từ Task 10.3)
> - `CampaignStatusBadge`, `STATUS_COLORS` (từ Task 10.3)
> - `CampaignDetailStats` (từ Task 10.4 - dùng khi drill-down)

---

# 2. USER STORIES

## 2.1 Bảng User Stories

| # | User Story ID | Vai trò | Yêu cầu | Tiêu chí chấp nhận | Quyền | Ràng buộc nghiệp vụ | Ghi chú |
|---|---------------|---------|----------|---------------------|-------|----------------------|---------|
| 1 | US-10.5.1 | Admin / Marketing | Xem dashboard tổng quan KPIs email marketing (tổng gửi, thành công, tỷ lệ mở, click, hủy ĐK, bounce) | Hiển thị 6 stat cards với số liệu + trend so với kỳ trước. Có biểu đồ phân bổ trạng thái CD. Loading skeleton khi fetch data. | Admin: Full access. Marketing: Chỉ xem. Sales: Không truy cập | Data aggregate từ TẤT CẢ campaigns trong period đã chọn. Trend = so sánh period hiện tại vs period trước | KPIs tính realtime từ email_send_logs |
| 2 | US-10.5.2 | Admin / Marketing | Xem biểu đồ xu hướng gửi/mở/click email theo thời gian | Biểu đồ đường với 3 metrics toggle (gửi/mở/click). Chọn interval: ngày/tuần/tháng. Tooltip khi hover | Admin: Full. Marketing: Chỉ xem | Trục X = ngày/tuần/tháng. Trục Y = số lượng. Mỗi line có màu riêng | Dùng recharts library |
| 3 | US-10.5.3 | Admin / Marketing | Xem phễu chuyển đổi email (Gửi → Nhận → Mở → Click) | Hiển thị horizontal bar funnel 4 tầng. Hiện count + rate + drop-off giữa các tầng | Admin: Full. Marketing: Chỉ xem | Rate tính theo: (count tầng hiện / count tầng đầu) × 100. Drop-off = rate tầng trước − rate tầng hiện | Hiển thị cảnh báo nếu bounce_rate > 5% |
| 4 | US-10.5.4 | Admin / Marketing | So sánh hiệu quả giữa các chiến dịch trong bảng | Bảng sortable theo: tên, gửi, nhận%, mở%, click%, hủy. Click tên CD → navigate sang chi tiết (Task 10.4). Pagination 10/page | Admin: Full + xóa. Marketing: Chỉ xem | Chỉ hiện campaigns có status ≠ draft. Sort mặc định: ngày gửi mới nhất. Rate cells hiện màu theo benchmark | RateCell dùng benchmark color |
| 5 | US-10.5.5 | Admin / Marketing | Xem danh sách & xu hướng hủy đăng ký (unsubscribe) | Bảng DS hủy ĐK (email, tên, CD, ngày, lý do). Mini bar chart xu hướng hủy ĐK theo tuần. Tìm kiếm theo email/tên | Admin: Full + export. Marketing: Chỉ xem | Mỗi unsubscribe log lưu: customer_id, campaign_id, reason (optional), timestamp. Unsubscribe rate alert nếu > 1% | Lý do phổ biến: "Nhận quá nhiều email", "Nội dung không phù hợp" |
| 6 | US-10.5.6 | Admin / Marketing | Lọc báo cáo theo khoảng thời gian, loại chiến dịch, trạng thái | Bộ lọc sticky top: Period (tuần/tháng/quý/tùy chỉnh), Loại CD (tất cả/thường/A-B), Trạng thái. Thay đổi filter → re-fetch toàn bộ APIs | Admin: Full. Marketing: Full filter | Mặc định: Tháng hiện tại + Tất cả loại. Khi chọn "Tùy chỉnh" → hiện DateRangePicker. Tất cả charts/tables respect filter | URL sync: filter params lưu vào URL query |
| 7 | US-10.5.7 | Admin | Xuất báo cáo tổng hợp ra Excel/CSV | Modal chọn: nội dung (tổng quan / so sánh CD / DS hủy ĐK) + format (xlsx/csv). Click xuất → download file | Chỉ Admin | File xuất bao gồm: header thông tin filter + data. Tên file: `bao-cao-email_{period}_{timestamp}.xlsx`. Giới hạn export: 50k rows, timeout 30s | Toast khi xuất thành công/lỗi |

## 2.2 Phân quyền tổng hợp

| Chức năng | Admin | Marketing | Sales | Support |
|-----------|-------|-----------|-------|---------|
| Xem Dashboard | ✅ | ✅ | ❌ | ❌ |
| Thay đổi Filters | ✅ | ✅ | ❌ | ❌ |
| Drill-down (click chart) | ✅ | ✅ | ❌ | ❌ |
| Xuất báo cáo | ✅ | ❌ | ❌ | ❌ |
| Xem Unsubscribe details | ✅ | ✅ | ❌ | ❌ |

---

# 3. BUSINESS RULES

## 3.1 Quy tắc tính KPIs

```
BR-10.5.01: Tổng gửi (total_sent)
  = COUNT(email_send_logs WHERE campaign.period = selected_period)

BR-10.5.02: Thành công (total_delivered)
  = COUNT(email_send_logs WHERE status IN ('delivered','opened','clicked'))

BR-10.5.03: Tỷ lệ mở (avg_open_rate)
  = (COUNT(status='opened' OR status='clicked') / total_delivered) × 100
  → Lưu ý: clicked cũng tính là đã mở

BR-10.5.04: Tỷ lệ click (avg_click_rate)
  = (COUNT(status='clicked') / total_delivered) × 100

BR-10.5.05: Bounce rate
  = (COUNT(status='bounced') / total_sent) × 100

BR-10.5.06: Unsubscribe rate
  = (COUNT(unsubscribes trong period) / total_delivered) × 100

BR-10.5.07: Trend calculation
  = ((current_period_value - previous_period_value) / previous_period_value) × 100
  → Nếu previous = 0 → hiện "N/A" thay vì infinity
```

## 3.2 Quy tắc hiển thị

```
BR-10.5.08: Benchmark colors cho Rate cells
  → delivery_rate: ≥98% = xanh, 95-97% = vàng, <95% = đỏ
  → open_rate:     ≥40% = xanh, 20-39% = vàng, <20% = đỏ
  → click_rate:    ≥10% = xanh, 5-9% = vàng, <5% = đỏ
  → bounce_rate:   <2% = xanh, 2-5% = vàng, >5% = đỏ (inverted)
  → unsub_rate:    <0.5% = xanh, 0.5-1% = vàng, >1% = đỏ (inverted)

BR-10.5.09: Trend direction colors
  → Cho metrics tích cực (gửi, mở, click): up = xanh, down = đỏ
  → Cho metrics tiêu cực (bounce, unsub): up = đỏ, down = xanh (inverted)

BR-10.5.10: Campaign comparison table
  → Chỉ hiện campaigns có status != 'draft'
  → Sort mặc định: sent_date DESC
  → Campaigns chưa gửi (scheduled, cancelled): rates hiện "─"

BR-10.5.11: Drill-down navigation
  → Click tên chiến dịch trong bảng → navigate to /campaigns/:id
  → Click vào chart section → hiện tooltip chi tiết, KHÔNG navigate

BR-10.5.12: Empty state
  → Nếu period không có campaign nào → hiện empty state với icon + message
  → Nếu không có unsubscribes → hiện: "Chưa có hủy đăng ký nào 🎉"
```

## 3.3 Quy tắc Export

```
BR-10.5.13: Export format
  → Excel (.xlsx): có header, styling, auto-width columns, sheet theo report_type
  → CSV (.csv): UTF-8 BOM, comma-separated, header row

BR-10.5.14: Export filename
  → Pattern: bao-cao-email_{period_type}_{YYYYMMDD_HHmmss}.{ext}
  → Ví dụ: bao-cao-email_thang-01-2025_20250201_143000.xlsx

BR-10.5.15: Export limits
  → Max 50,000 rows per report type
  → Timeout: 30 giây
  → Nếu quá limit → export 50k đầu + ghi chú "Dữ liệu bị cắt"
```

---

# 4. DATA MODELS

## 4.1 EmailMarketingOverview

```typescript
interface EmailMarketingOverview {
  period: ReportPeriod;
  
  // KPIs - Số tuyệt đối
  total_campaigns: number;
  total_sent: number;
  total_delivered: number;
  total_bounced: number;
  total_opened: number;
  total_clicked: number;
  total_unsubscribed: number;
  total_leads_generated: number;    // Lead mới từ chiến dịch email
  
  // Rates - Tỷ lệ %
  avg_delivery_rate: number;
  avg_open_rate: number;
  avg_click_rate: number;
  avg_bounce_rate: number;
  avg_unsubscribe_rate: number;
  
  // Trends so với period trước
  trends: {
    sent: TrendValue;
    delivered: TrendValue;
    opened: TrendValue;
    clicked: TrendValue;
    unsubscribed: TrendValue;
    bounce: TrendValue;
  };
}

interface TrendValue {
  current: number;
  previous: number;
  change_percent: number;           // (current - previous) / previous × 100
  direction: 'up' | 'down' | 'stable';
}

interface ReportPeriod {
  type: 'week' | 'month' | 'quarter' | 'custom';
  from: string;                     // ISO date "2025-01-01"
  to: string;                       // ISO date "2025-01-31"
  label: string;                    // "Tháng 01/2025"
}
```

## 4.2 TrendDataPoint (cho line chart)

```typescript
interface TrendDataPoint {
  date: string;                     // "2025-01-15" hoặc "2025-W03"
  label: string;                    // "15/01" hoặc "Tuần 3"
  sent: number;
  delivered: number;
  opened: number;
  clicked: number;
  bounced: number;
  unsubscribed: number;
}
```

## 4.3 CampaignComparisonRow

```typescript
interface CampaignComparisonRow {
  campaign_id: string;
  campaign_name: string;
  campaign_type: 'normal' | 'ab';
  status: CampaignStatus;
  sent_date: string | null;
  total_recipients: number;
  total_sent: number;
  delivery_rate: number;
  open_rate: number;
  click_rate: number;
  bounce_rate: number;
  unsubscribe_count: number;
}
```

## 4.4 EmailFunnel

```typescript
interface EmailFunnel {
  stages: FunnelStage[];
}

interface FunnelStage {
  name: string;                     // "Gửi", "Nhận", "Mở", "Click"
  count: number;
  rate: number;                     // % so với stage đầu
  drop_off: number;                 // % mất đi so với stage trước
  color: string;
}
```

## 4.5 StatusDistributionItem

```typescript
interface StatusDistributionItem {
  status: CampaignStatus;
  label: string;
  count: number;
  percentage: number;
  color: string;
}
```

## 4.6 UnsubscribeEntry

```typescript
interface UnsubscribeEntry {
  id: string;
  customer_id: string;
  customer_name: string | null;
  customer_email: string;
  campaign_id: string;
  campaign_name: string;
  unsubscribed_at: string;
  reason: string | null;
}
```

## 4.7 ReportFilter

```typescript
interface ReportFilter {
  period_type: 'week' | 'month' | 'quarter' | 'custom';
  date_from: string;
  date_to: string;
  campaign_type: 'all' | 'normal' | 'ab';
  campaign_status: 'all' | CampaignStatus;
}
```

---

# 5. API ENDPOINTS

## 5.1 Overview APIs

```typescript
// GET: Tổng quan KPIs
GET /api/email-marketing/reports/overview
Query: {
  period_type?: 'week' | 'month' | 'quarter' | 'custom',
  date_from?: string,
  date_to?: string,
  campaign_type?: 'all' | 'normal' | 'ab'
}
Response: EmailMarketingOverview

// GET: Trend data cho line chart
GET /api/email-marketing/reports/trends
Query: {
  period_type?: string,
  date_from?: string,
  date_to?: string,
  interval: 'day' | 'week' | 'month',
  campaign_type?: string
}
Response: { data: TrendDataPoint[] }
```

## 5.2 Analysis APIs

```typescript
// GET: Phễu chuyển đổi email
GET /api/email-marketing/reports/funnel
Query: { date_from?, date_to?, campaign_type? }
Response: EmailFunnel

// GET: Phân bổ trạng thái chiến dịch
GET /api/email-marketing/reports/status-distribution
Query: { date_from?, date_to? }
Response: { data: StatusDistributionItem[] }

// GET: Bảng so sánh chiến dịch
GET /api/email-marketing/reports/campaigns
Query: {
  date_from?, date_to?,
  campaign_type?: 'all' | 'normal' | 'ab',
  campaign_status?: 'all' | CampaignStatus,
  sort_by?: 'campaign_name' | 'sent_date' | 'total_sent' | 'open_rate' | 'click_rate',
  sort_order?: 'asc' | 'desc',
  page?: number,
  limit?: number
}
Response: { data: CampaignComparisonRow[], pagination }
```

## 5.3 Unsubscribe APIs

```typescript
// GET: Danh sách hủy đăng ký
GET /api/email-marketing/reports/unsubscribes
Query: { date_from?, date_to?, search?, page?, limit? }
Response: { data: UnsubscribeEntry[], pagination, total_count }

// GET: Xu hướng hủy đăng ký
GET /api/email-marketing/reports/unsubscribes/trend
Query: { period_type?, date_from?, date_to?, interval }
Response: { data: Array<{ date: string; label: string; count: number }> }
```

## 5.4 Export API

```typescript
// POST: Xuất báo cáo
POST /api/email-marketing/reports/export
Body: {
  report_types: ('overview' | 'campaigns' | 'unsubscribes')[],
  format: 'xlsx' | 'csv',
  filters: ReportFilter
}
Response: { download_url: string, filename: string, expires_at: string }

// Error codes: 400 INVALID_DATE_RANGE, 408 EXPORT_TIMEOUT, 413 TOO_MANY_ROWS
```

---

# 6. STATE MANAGEMENT

```typescript
interface EmailReportsState {
  // Filters
  filters: ReportFilter;
  
  // Overview
  overview: EmailMarketingOverview | null;
  overviewLoading: boolean;
  overviewError: string | null;
  
  // Trend Chart
  trendData: TrendDataPoint[];
  trendLoading: boolean;
  trendInterval: 'day' | 'week' | 'month';
  trendVisibleMetrics: ('sent' | 'opened' | 'clicked')[];
  
  // Funnel
  funnel: EmailFunnel | null;
  funnelLoading: boolean;
  
  // Status Distribution
  statusDistribution: StatusDistributionItem[];
  statusDistributionLoading: boolean;
  
  // Campaign Comparison
  campaigns: CampaignComparisonRow[];
  campaignsLoading: boolean;
  campaignsPagination: { page: number; limit: number; total: number; total_pages: number };
  campaignsSort: { field: string; order: 'asc' | 'desc' };
  
  // Unsubscribe
  unsubscribes: UnsubscribeEntry[];
  unsubscribesLoading: boolean;
  unsubscribesPagination: { page: number; limit: number; total: number };
  unsubscribesSearch: string;
  unsubscribesTrend: Array<{ date: string; label: string; count: number }>;
  
  // Export
  exportModalOpen: boolean;
  exporting: boolean;
  exportError: string | null;
}
```

---

# 7. UI COMPONENTS

## 7.1 EmailReportsDashboardPage (Layout chính)

**Route**: `/email-marketing/reports`

```
EmailReportsDashboardPage
├── PageHeader
│   ├── Breadcrumb: ["Email Marketing", "Báo cáo"]
│   ├── Title: "Báo cáo Email Marketing"
│   └── ExportButton (chỉ Admin)
│
├── ReportFilters (sticky top, z-10)
│
├── Section 1: OverviewStatsCards (6 cards)
├── Section 2: TrendSection (line chart + controls)
├── Section 3: AnalysisSection (grid 2 cols)
│   ├── StatusDistributionChart (donut)
│   └── EmailFunnelChart (horizontal bar)
├── Section 4: CampaignComparisonTable (sortable, paginated)
├── Section 5: UnsubscribeSection (trend chart + table)
│
└── ExportReportModal (overlay)
```

## 7.2 OverviewStatsCards (6 cards)

```
Layout: 6 cards / row → responsive: 3×2 (tablet), 2×3 (mobile)

┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐
│ 📤 Tổng gửi │ │ ✅ Thành công│ │ 📬 Tỷ lệ mở │ │ 🖱️ Tỷ lệ   │ │ 🚫 Hủy ĐK  │ │ ⚠️ Bounce   │
│   1,960     │ │   1,928     │ │   43.8%     │ │  click     │ │    8        │ │   32        │
│             │ │  (98.4%)    │ │             │ │  11.2%     │ │             │ │  (1.6%)     │
│ ↗ +12.5%    │ │ ↗ +1.2%     │ │ ↗ +2.1%     │ │ ↗ +1.8%    │ │ ↗ +60% ⚠️  │ │ ↘ -13.5%    │
│ vs kỳ trước │ │ vs kỳ trước │ │ vs kỳ trước │ │ vs kỳ trước│ │ vs kỳ trước │ │ vs kỳ trước │
└─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘
   bg-blue-50     bg-green-50     bg-indigo-50    bg-purple-50    bg-orange-50    bg-red-50

// Props:
interface StatCardProps {
  icon: ReactNode;
  label: string;
  value: string | number;
  subValue?: string;
  trend: TrendValue;
  bgColor: string;
  iconColor: string;
  invertTrend?: boolean;            // true cho Unsubscribe/Bounce
}
```

## 7.3 TrendChart (Line Chart)

```
┌──────────────────────────────────────────────────────────────────┐
│ 📈 Xu hướng gửi email                                            │
│ [✓ Đã gửi] [✓ Đã mở] [✓ Đã click]    Interval: [Theo ngày ▼]   │
│                                                                   │
│  500 ┤         ╱──╲         ╱──╮                                  │
│  300 ┤    ╱───╱    ╲───╱───╱   │       ← Đã gửi (#3B82F6)       │
│  100 ┤  ╱──────────────────╲      ← Đã mở (#22C55E)             │
│   50 ┤ ╱──────────────────╲       ← Đã click (#F97316)          │
│      └────────────────────────                                    │
│       01   05   10   15   20   25   30                            │
│ Tooltip (hover): "15/01: Gửi 196 | Mở 88 | Click 24"            │
└──────────────────────────────────────────────────────────────────┘

const TREND_LINES = [
  { key: 'sent',    label: 'Đã gửi',  color: '#3B82F6', defaultVisible: true },
  { key: 'opened',  label: 'Đã mở',   color: '#22C55E', defaultVisible: true },
  { key: 'clicked', label: 'Đã click', color: '#F97316', defaultVisible: true }
];

const INTERVAL_OPTIONS = [
  { value: 'day',   label: 'Theo ngày' },
  { value: 'week',  label: 'Theo tuần' },
  { value: 'month', label: 'Theo tháng' }
];
```

## 7.4 StatusDistributionChart (Donut)

```
┌──────────────────────────────────┐
│ 🍩 Phân bổ chiến dịch            │
│       ╭──────────╮               │
│     ╱              ╲             │  ● Đã gửi: 5 (41.7%)
│    │   12 chiến    │             │  ● Đang chạy: 2 (16.7%)
│    │    dịch       │             │  ● Đang chờ: 1 (8.3%)
│     ╲              ╱             │  ● Nháp: 3 (25%)
│       ╰──────────╯               │  ● Đã hủy: 1 (8.3%)
└──────────────────────────────────┘
```

## 7.5 EmailFunnelChart (Horizontal Bar)

```
┌──────────────────────────────────────────────────────────────────┐
│ 📊 Phễu chuyển đổi Email                                         │
│                                                                   │
│ Gửi    ████████████████████████████████████████  1,960 (100%)    │
│ Nhận   █████████████████████████████████████░░░  1,928 (98.4%)   │
│ Mở     ████████████████░░░░░░░░░░░░░░░░░░░░░░░    858 (43.8%)   │
│ Click  █████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░    220 (11.2%)   │
│                                                                   │
│ Drop-off: Gửi→Nhận -1.6% | Nhận→Mở -55.5% | Mở→Click -74.4%   │
│ ⚠️ Cảnh báo nếu bounce_rate > 5%                                 │
└──────────────────────────────────────────────────────────────────┘
```

## 7.6 CampaignComparisonTable

```
┌──────────────────────────────────────────────────────────────────┐
│ 📋 So sánh hiệu quả chiến dịch                       [Xuất Excel]│
├──────────────────────────────────────────────────────────────────┤
│ Tên chiến dịch ↕ │ Loại │ T.thái │ Đã gửi ↕│Nhận %↕│Mở % ↕│Click%↕│Hủy│Ngày gửi ↕│
│──────────────────────────────────────────────────────────────────│
│ CD Tết 2025      │  ──  │ Đã gửi │    485  │ 97.3% │ 44.5%│  9.5% │ 3 │16/01/2025│
│ [A/B] Sale cuối  │  A/B │ Đã gửi │    980  │ 98.0% │ 43.8%│ 12.5% │ 5 │14/01/2025│
│ Welcome email    │  ──  │ Đ.chạy │     98  │ 98.0% │ 46.9%│ 12.5% │ 0 │31/01/2025│
├──────────────────────────────────────────────────────────────────┤
│ Hiển thị 1-4 / 4 chiến dịch                  « ‹  Trang 1/1  › »│
└──────────────────────────────────────────────────────────────────┘

// Click tên CD → navigate to /campaigns/{campaign_id}
// Rate cells: màu xanh/vàng/đỏ theo benchmark (xem BR-10.5.08)
```

## 7.7 RateCell Component

```typescript
interface RateCellProps {
  value: number;
  benchmark: { good: number; warning: number };
  inverted?: boolean;
}
// value >= good → text-green-600, value >= warning → text-yellow-600, else → text-red-600
// value = 0 → text-gray-400 "─"
```

## 7.8 UnsubscribeSection

```
├── UnsubscribeTrendChart (mini bar chart)
│   ┌──────────────────────────────────────────────────┐
│   │ 🚫 Xu hướng hủy đăng ký                          │
│   │   T1: █ 0   T2: ██ 2   T3: ████ 4   T4: █ 1    │
│   └──────────────────────────────────────────────────┘
│
└── UnsubscribeTable
    ├── Header: "Danh sách hủy đăng ký (8)" + [🔍 Tìm email/tên...]
    ├── Table: Email | Tên KH | Chiến dịch | Ngày hủy | Lý do
    └── Pagination
```

## 7.9 ExportReportModal

```
┌──────────────────────────────────────────────┐
│  📥 Xuất báo cáo Email Marketing              │
│                                               │
│  Chọn nội dung xuất:                          │
│  ☑️ Tổng quan (KPIs, tỷ lệ)                  │
│  ☑️ So sánh chiến dịch                        │
│  ☐ Danh sách hủy đăng ký                     │
│                                               │
│  Chọn định dạng:                              │
│  (●) Excel (.xlsx)    ( ) CSV (.csv)          │
│                                               │
│  ┌─────────────────────────────────────────┐  │
│  │ 📋 Khoảng thời gian: 01/01 - 31/01/2025│  │
│  └─────────────────────────────────────────┘  │
│                                               │
│           [Hủy]    [📥 Xuất báo cáo]          │
└──────────────────────────────────────────────┘

// Validation: Phải chọn ít nhất 1 report_type
// Button disabled khi: selectedTypes.length === 0 hoặc exporting
```

## 7.10 ReportFilters (Sticky Bar)

```
┌──────────────────────────────────────────────────────────────────┐
│ Khoảng thời gian: [Tháng này ▼]  Loại: [Tất cả ▼]  TT: [Tất cả ▼] │
│ (Tùy chỉnh): Từ: [📅 01/01/2025]  Đến: [📅 31/01/2025]         │
│ [Áp dụng bộ lọc]                                                │
└──────────────────────────────────────────────────────────────────┘

const PERIOD_OPTIONS = [
  { value: 'week', label: 'Tuần này' },
  { value: 'month', label: 'Tháng này' },
  { value: 'quarter', label: 'Quý này' },
  { value: 'custom', label: 'Tùy chỉnh' }
];

// URL sync: ?period=month&from=2025-01-01&to=2025-01-31&type=all&status=all
```

## 7.11 Responsive & Mobile

```
Desktop (≥1280px): Full layout, 6 cards/row, 2-col analysis
Tablet (768-1279px): 3 cards/row, 2-col analysis, table scroll-x
Mobile (<768px): 2 cards/row, 1-col stacked, filter drawer

Mobile: ReportFilters → collapse to "Bộ lọc" button → drawer
Mobile: TrendChart height 250px → 200px, labels xoay 45°
Mobile: Tables: horizontal scroll, sticky first column
```

## 7.12 Loading & Empty States

```
Loading: Skeleton placeholders (6 cards pulse, chart area pulse, 5 table rows)
Empty: Icon 📊 + "Chưa có dữ liệu chiến dịch trong khoảng thời gian này"
Empty unsub: Icon 🎉 + "Chưa có hủy đăng ký nào - Tuyệt vời!"
Error: Icon ⚠️ + "Không thể tải báo cáo. Vui lòng thử lại" + [Thử lại]
```

---

# 8. USER FLOWS

## 8.1 Flow: Xem Dashboard

```
1. User vào menu Email Marketing → Báo cáo
2. Check permissions: Admin/Marketing? → OK. Khác? → 403
3. Load mặc định: period=month, type=all, status=all
4. Gọi SONG SONG 6 APIs (show skeleton):
   ├── GET /reports/overview
   ├── GET /reports/trends?interval=day
   ├── GET /reports/funnel
   ├── GET /reports/status-distribution
   ├── GET /reports/campaigns?page=1&limit=10&sort=sent_date&order=desc
   └── GET /reports/unsubscribes/trend
5. Render dashboard, replace skeleton → data
6. User thay đổi filter → Re-fetch TẤT CẢ APIs
```

## 8.2 Flow: Drill-down từ bảng

```
1. Click header column → Sort (re-fetch GET /campaigns)
2. Click tên chiến dịch (blue link) → Navigate /campaigns/:id (Task 10.4)
3. Back → quay lại dashboard (giữ filter state via URL)
```

## 8.3 Flow: Xuất báo cáo

```
1. Admin click "Xuất báo cáo" → Open ExportReportModal
2. Chọn nội dung (multi-checkbox) + format (radio)
3. Click "Xuất báo cáo" → POST /reports/export → Loading
4. Success → Auto download + Toast "✅ Đã xuất thành công"
5. Error → Toast "❌ Có lỗi xảy ra"
```

## 8.4 Flow: Tìm kiếm Unsubscribe

```
1. Nhập ô tìm kiếm: "nguyen" (debounce 300ms)
2. GET /reports/unsubscribes?search=nguyen&page=1
3. Table cập nhật: chỉ entries match email/tên
4. Clear → Re-fetch full list
```

---

# 9. UTILITY FUNCTIONS

```typescript
// Format helpers
function formatRate(value: number): string {
  if (value === 0 || value == null) return '─';
  return `${value.toFixed(1)}%`;
}

function formatNumber(value: number): string {
  return value.toLocaleString('vi-VN');
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('vi-VN');
}

function formatDateTime(dateStr: string): string {
  const d = new Date(dateStr);
  return `${d.toLocaleDateString('vi-VN')} ${d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}`;
}

// Trend helper
function formatTrend(trend: TrendValue, inverted?: boolean): {
  text: string; color: string; icon: string;
} {
  if (trend.direction === 'stable') {
    return { text: '0%', color: 'text-gray-500', icon: '→' };
  }
  const sign = trend.direction === 'up' ? '+' : '';
  const text = `${sign}${trend.change_percent.toFixed(1)}%`;
  let color: string;
  if (inverted) {
    color = trend.direction === 'up' ? 'text-red-600' : 'text-green-600';
  } else {
    color = trend.direction === 'up' ? 'text-green-600' : 'text-red-600';
  }
  return { text, color, icon: trend.direction === 'up' ? '↗' : '↘' };
}

// Rate color helper
function getRateColor(
  value: number,
  benchmark: { good: number; warning: number },
  inverted?: boolean
): string {
  if (value === 0 || value == null) return 'text-gray-400';
  if (inverted) {
    if (value <= benchmark.good) return 'text-green-600';
    if (value <= benchmark.warning) return 'text-yellow-600';
    return 'text-red-600';
  }
  if (value >= benchmark.good) return 'text-green-600';
  if (value >= benchmark.warning) return 'text-yellow-600';
  return 'text-red-600';
}

// Period helper
function getDefaultPeriod(type: 'week' | 'month' | 'quarter'): ReportPeriod {
  const now = new Date();
  // Returns { type, from, to, label } based on current date
}
```

---

# 10. MOCK DATA

## 10.1 Mock Overview

```typescript
export const MOCK_EMAIL_OVERVIEW: EmailMarketingOverview = {
  period: { type: 'month', from: '2025-01-01', to: '2025-01-31', label: 'Tháng 01/2025' },
  total_campaigns: 12,
  total_sent: 1960,
  total_delivered: 1928,
  total_bounced: 32,
  total_opened: 858,
  total_clicked: 220,
  total_unsubscribed: 8,
  total_leads_generated: 15,
  avg_delivery_rate: 98.4,
  avg_open_rate: 43.8,
  avg_click_rate: 11.2,
  avg_bounce_rate: 1.6,
  avg_unsubscribe_rate: 0.4,
  trends: {
    sent:         { current: 1960, previous: 1742, change_percent: 12.5,  direction: 'up' },
    delivered:    { current: 1928, previous: 1705, change_percent: 13.1,  direction: 'up' },
    opened:       { current: 858,  previous: 720,  change_percent: 19.2,  direction: 'up' },
    clicked:      { current: 220,  previous: 186,  change_percent: 18.3,  direction: 'up' },
    unsubscribed: { current: 8,    previous: 5,    change_percent: 60.0,  direction: 'up' },
    bounce:       { current: 32,   previous: 37,   change_percent: -13.5, direction: 'down' }
  }
};
```

## 10.2 Mock Trend Data

```typescript
export const MOCK_TREND_DATA: TrendDataPoint[] = [
  { date: '2025-01-01', label: '01/01', sent: 0,   delivered: 0,   opened: 0,   clicked: 0,  bounced: 0,  unsubscribed: 0 },
  { date: '2025-01-05', label: '05/01', sent: 50,  delivered: 49,  opened: 22,  clicked: 5,  bounced: 1,  unsubscribed: 0 },
  { date: '2025-01-10', label: '10/01', sent: 120, delivered: 118, opened: 55,  clicked: 14, bounced: 2,  unsubscribed: 1 },
  { date: '2025-01-14', label: '14/01', sent: 196, delivered: 192, opened: 88,  clicked: 24, bounced: 4,  unsubscribed: 1 },
  { date: '2025-01-16', label: '16/01', sent: 485, delivered: 472, opened: 210, clicked: 45, bounced: 13, unsubscribed: 3 },
  { date: '2025-01-20', label: '20/01', sent: 200, delivered: 196, opened: 90,  clicked: 22, bounced: 4,  unsubscribed: 1 },
  { date: '2025-01-25', label: '25/01', sent: 150, delivered: 148, opened: 68,  clicked: 18, bounced: 2,  unsubscribed: 0 },
  { date: '2025-01-28', label: '28/01', sent: 175, delivered: 172, opened: 78,  clicked: 20, bounced: 3,  unsubscribed: 1 },
  { date: '2025-01-31', label: '31/01', sent: 195, delivered: 192, opened: 88,  clicked: 24, bounced: 3,  unsubscribed: 1 }
];
```

## 10.3 Mock Campaign Comparison

```typescript
export const MOCK_CAMPAIGN_COMPARISON: CampaignComparisonRow[] = [
  {
    campaign_id: 'camp-001', campaign_name: 'Chiến dịch Tết 2025',
    campaign_type: 'normal', status: 'sent', sent_date: '2025-01-16',
    total_recipients: 500, total_sent: 485, delivery_rate: 97.3,
    open_rate: 44.5, click_rate: 9.5, bounce_rate: 2.7, unsubscribe_count: 3
  },
  {
    campaign_id: 'camp-002', campaign_name: '[A/B] Test tiêu đề - Sale cuối năm',
    campaign_type: 'ab', status: 'sent', sent_date: '2025-01-14',
    total_recipients: 1000, total_sent: 980, delivery_rate: 98.0,
    open_rate: 43.8, click_rate: 12.5, bounce_rate: 2.0, unsubscribe_count: 5
  },
  {
    campaign_id: 'camp-003', campaign_name: 'Welcome email tự động',
    campaign_type: 'normal', status: 'running', sent_date: '2025-01-31',
    total_recipients: 100, total_sent: 98, delivery_rate: 98.0,
    open_rate: 46.9, click_rate: 12.5, bounce_rate: 2.0, unsubscribe_count: 0
  },
  {
    campaign_id: 'camp-004', campaign_name: 'Newsletter tháng 2',
    campaign_type: 'normal', status: 'scheduled', sent_date: null,
    total_recipients: 800, total_sent: 0, delivery_rate: 0,
    open_rate: 0, click_rate: 0, bounce_rate: 0, unsubscribe_count: 0
  },
  {
    campaign_id: 'camp-005', campaign_name: 'Ưu đãi khách VIP Q1',
    campaign_type: 'normal', status: 'sent', sent_date: '2025-01-10',
    total_recipients: 210, total_sent: 200, delivery_rate: 99.0,
    open_rate: 52.3, click_rate: 15.8, bounce_rate: 1.0, unsubscribe_count: 0
  }
];
```

## 10.4 Mock Funnel + Distribution

```typescript
export const MOCK_EMAIL_FUNNEL: EmailFunnel = {
  stages: [
    { name: 'Gửi',  count: 1960, rate: 100,  drop_off: 0,    color: '#3B82F6' },
    { name: 'Nhận',  count: 1928, rate: 98.4, drop_off: 1.6,  color: '#22C55E' },
    { name: 'Mở',   count: 858,  rate: 43.8, drop_off: 55.5, color: '#6366F1' },
    { name: 'Click', count: 220,  rate: 11.2, drop_off: 74.4, color: '#F97316' }
  ]
};

export const MOCK_STATUS_DISTRIBUTION: StatusDistributionItem[] = [
  { status: 'sent',      label: 'Đã gửi',   count: 5, percentage: 41.7, color: '#6B7280' },
  { status: 'running',   label: 'Đang chạy', count: 2, percentage: 16.7, color: '#22C55E' },
  { status: 'scheduled', label: 'Đang chờ',  count: 1, percentage: 8.3,  color: '#EAB308' },
  { status: 'draft',     label: 'Nháp',      count: 3, percentage: 25.0, color: '#3B82F6' },
  { status: 'cancelled', label: 'Đã hủy',    count: 1, percentage: 8.3,  color: '#EF4444' }
];
```

## 10.5 Mock Unsubscribes

```typescript
export const MOCK_UNSUBSCRIBES: UnsubscribeEntry[] = [
  {
    id: 'unsub-001', customer_id: 'cust-010',
    customer_name: 'Nguyễn Thị F', customer_email: 'nguyen.f@gmail.com',
    campaign_id: 'camp-001', campaign_name: 'Chiến dịch Tết 2025',
    unsubscribed_at: '2025-01-16T12:00:00Z', reason: 'Nhận quá nhiều email'
  },
  {
    id: 'unsub-002', customer_id: 'cust-020',
    customer_name: 'Trần Văn G', customer_email: 'tran.g@company.vn',
    campaign_id: 'camp-001', campaign_name: 'Chiến dịch Tết 2025',
    unsubscribed_at: '2025-01-16T14:30:00Z', reason: 'Nội dung không phù hợp'
  },
  {
    id: 'unsub-003', customer_id: 'cust-030',
    customer_name: 'Lê Thị H', customer_email: 'le.h@outlook.com',
    campaign_id: 'camp-001', campaign_name: 'Chiến dịch Tết 2025',
    unsubscribed_at: '2025-01-17T08:00:00Z', reason: null
  },
  {
    id: 'unsub-004', customer_id: 'cust-040',
    customer_name: 'Phạm Văn I', customer_email: 'pham.i@gmail.com',
    campaign_id: 'camp-002', campaign_name: '[A/B] Test tiêu đề - Sale cuối năm',
    unsubscribed_at: '2025-01-14T16:00:00Z', reason: 'Nhận quá nhiều email'
  },
  {
    id: 'unsub-005', customer_id: 'cust-050',
    customer_name: null, customer_email: 'user.k@yahoo.com',
    campaign_id: 'camp-002', campaign_name: '[A/B] Test tiêu đề - Sale cuối năm',
    unsubscribed_at: '2025-01-15T10:00:00Z', reason: null
  },
  {
    id: 'unsub-006', customer_id: 'cust-060',
    customer_name: 'Hoàng Minh L', customer_email: 'hoang.l@tech.vn',
    campaign_id: 'camp-005', campaign_name: 'Ưu đãi khách VIP Q1',
    unsubscribed_at: '2025-01-22T09:15:00Z', reason: 'Nội dung không phù hợp'
  }
];

export const MOCK_UNSUBSCRIBE_TREND = [
  { date: '2025-01-W1', label: 'Tuần 1', count: 0 },
  { date: '2025-01-W2', label: 'Tuần 2', count: 2 },
  { date: '2025-01-W3', label: 'Tuần 3', count: 4 },
  { date: '2025-01-W4', label: 'Tuần 4', count: 1 },
  { date: '2025-01-W5', label: 'Tuần 5', count: 1 }
];
```

---

# 11. IMPLEMENTATION CHECKLIST

## 11.1 Layout & Filters

- [ ] `EmailReportsDashboardPage` - Trang dashboard chính
- [ ] `ReportFilters` - Sticky filter bar (period, type, status)
- [ ] `PeriodSelect` - Dropdown chọn khoảng thời gian
- [ ] `DateRangePicker` - Chọn ngày tùy chỉnh
- [ ] URL sync cho filters (query params ↔ state)

## 11.2 Overview & Charts

- [ ] `OverviewStatsCards` - Container 6 stat cards
- [ ] `StatCard` - Card đơn lẻ (value + trend + icon + color)
- [ ] `TrendChart` - Line chart xu hướng (recharts)
- [ ] `MetricToggle` - Toggle hiện/ẩn lines
- [ ] `StatusDistributionChart` - Donut chart (recharts PieChart)
- [ ] `EmailFunnelChart` - Horizontal bar funnel + alert

## 11.3 Tables

- [ ] `CampaignComparisonTable` - Sortable + paginated
- [ ] `RateCell` - % với benchmark color coding
- [ ] `UnsubscribeTable` - Search + paginated
- [ ] `UnsubscribeTrendChart` - Mini bar chart

## 11.4 Modals & Export

- [ ] `ExportReportModal` - Multi-select types + format + download

## 11.5 Hooks & State

- [ ] `useEmailReports` - Fetch & manage all report data
- [ ] `useReportFilters` - Filter state + URL sync
- [ ] `useExportReport` - Export logic + download + toast
- [ ] `emailReportsStore` - Global state

## 11.6 Permission & Guards

- [ ] Route guard: chỉ Admin/Marketing truy cập
- [ ] Export button: chỉ Admin
- [ ] Redirect 403 cho Sales/Support

---

## 📌 CONSTANTS

```typescript
const EMAIL_BENCHMARKS = {
  delivery_rate:    { good: 98,  warning: 95 },
  open_rate:        { good: 40,  warning: 20 },
  click_rate:       { good: 10,  warning: 5 },
  bounce_rate:      { good: 2,   warning: 5 },
  unsubscribe_rate: { good: 0.5, warning: 1 }
};

const CHART_COLORS = {
  sent: '#3B82F6', delivered: '#22C55E', opened: '#6366F1',
  clicked: '#F97316', bounced: '#EF4444', unsubscribed: '#F59E0B'
};

const REPORT_CONFIG = {
  autoRefresh: false,
  staleTime: 5 * 60 * 1000,
  refetchOnFilterChange: true,
  debounceSearch: 300,
  defaultPageSize: 10,
  exportTimeout: 30_000,
  exportMaxRows: 50_000
};
```

---

## 📌 HƯỚNG DẪN SỬ DỤNG VỚI COPILOT

```
Based on TASK_10_5_BAO_CAO_THONG_KE.md, create the [ComponentName] component.
Follow the exact specs in section [X.X]. Use mock data from section 10.
```

**Ví dụ prompts:**
- "Create `EmailReportsDashboardPage` with all 5 sections following layout in 7.1"
- "Create `OverviewStatsCards` with 6 KPI cards, trends, inverted logic for bounce/unsub"
- "Create `TrendChart` using recharts LineChart with metric toggles and interval select"
- "Create `EmailFunnelChart` with Gửi → Nhận → Mở → Click funnel + drop-off alerts"
- "Create `CampaignComparisonTable` with sortable columns and RateCell benchmarks"
- "Create `UnsubscribeSection` with mini trend bar chart + searchable data table"
- "Create `ExportReportModal` with multi-select types, format radio, download logic"
- "Create `useEmailReports` hook fetching all 6 APIs in parallel on mount/filter change"

---

*Document Version: 2.0*
*Generated for: AI Code Assistants (Copilot, Claude Code, Cursor AI)*
*Module: Email Marketing - Báo cáo & Thống kê*
*Task: 10.5 (7 User Stories)*
*Source: Tính năng CRM ViLead - Section 2.9.3*
