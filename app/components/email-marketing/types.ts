// ==================== EMAIL MARKETING TYPES ====================
// Based on TASK_10_1_CAU_HINH_EMAIL.md specification

export type SenderEmailStatus = 
  | 'activated'           // Đã kích hoạt - có thể dùng gửi
  | 'pending'             // Chờ xác thực - chưa click link
  | 'domain_unverified'   // Domain chưa xác thực - giới hạn gửi
  | 'disabled';           // Đã vô hiệu hóa

export type PermissionType = 
  | 'all'       // Toàn bộ thành viên dự án
  | 'me'        // Chỉ người tạo
  | 'specific'; // Chọn thành viên cụ thể

export interface SenderEmail {
  id: string;                    // UUID, primary key
  email: string;                 // Unique, required, email format
  sender_name: string;           // Required, max 100 chars
  status: SenderEmailStatus;     // Enum
  permission_type: PermissionType;
  permitted_user_ids: string[];  // Array of user IDs (if permission_type = 'specific')
  
  // Verification
  verification_token: string | null;
  verification_expires_at: Date | null;
  verification_sent_count: number;  // Max 5/day
  verification_last_sent_at: Date | null;
  
  // Audit
  created_by: string;            // User ID
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;       // Soft delete
}

export interface EmailLimits {
  id: string;
  project_id: string;
  
  // Limits configuration
  daily_limit: number;              // Default: 500
  monthly_limit: number;            // Default: 10000
  per_sender_daily_limit: number;   // Default: 100
  delay_between_emails: number;     // Seconds, default: 5
  
  // Current usage
  daily_used: number;
  monthly_used: number;
  
  // Reset timestamps
  daily_reset_at: Date;             // 00:00 mỗi ngày
  monthly_reset_at: Date;           // Ngày 1 mỗi tháng
  
  updated_at: Date;
  updated_by: string;
}

export interface EmailVerificationLog {
  id: string;
  sender_email_id: string;
  action: 'sent' | 'clicked' | 'expired' | 'resent';
  ip_address: string | null;
  user_agent: string | null;
  created_at: Date;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'leader' | 'user';
  avatar?: string;
}

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

export interface SenderEmailsFilters {
  search: string;
  status: SenderEmailStatus | 'all';
}

// Form data types
export interface AddEmailFormData {
  email: string;
  sender_name: string;
  permission_type: PermissionType;
  permitted_user_ids: string[];
}

export interface EditEmailFormData {
  sender_name: string;
  permission_type: PermissionType;
  permitted_user_ids: string[];
}

export interface EmailLimitsFormData {
  daily_limit: number;
  monthly_limit: number;
  per_sender_daily_limit: number;
  delay_between_emails: number;
}

export interface EmailUsage {
  daily: { used: number; limit: number; percentage: number };
  monthly: { used: number; limit: number; percentage: number };
  reset_daily_in: string;
  reset_monthly_in: string;
}

// ==================== EMAIL TEMPLATE TYPES ====================
// Based on TASK_10_2_THU_VIEN_MAU_EMAIL.md specification

export type BlockType = 
  | 'text'
  | 'image'
  | 'button'
  | 'divider'
  | 'spacer'
  | 'columns'
  | 'social';

export type EditorMode = 'richtext' | 'dragdrop' | 'html';

export interface TemplateBlock {
  id: string;
  type: BlockType;
  order: number;
  properties: Record<string, any>;
}

export interface TemplateVersion {
  version: number;
  content_html: string;
  content_json: TemplateBlock[] | null;
  created_at: Date;
  created_by: string;
}

export interface EmailTemplate {
  id: string;
  name: string;
  type: 'system' | 'user' | 'notification';
  
  // Content
  content_html: string;
  content_json: TemplateBlock[] | null;
  editor_mode: EditorMode;
  
  // Preview
  thumbnail_url: string;
  
  // Metadata
  owner_id: string | null;
  category_id: string | null;
  
  // Version control
  version: number;
  versions: TemplateVersion[];
  
  // Usage stats
  usage_count: number;
  
  // Audit
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
}

export interface TemplateVariable {
  key: string;
  label: string;
  category: 'customer' | 'order' | 'system';
  sample_value: string;
  description?: string;
}

export interface TemplatesFilters {
  search: string;
  activeTab: 'system' | 'user' | 'notification';
}

export interface CreateTemplateFormData {
  name: string;
  content_html: string;
  content_json?: TemplateBlock[];
  editor_mode: EditorMode;
}

export interface EditTemplateFormData {
  name?: string;
  content_html?: string;
  content_json?: TemplateBlock[] | null;
}

// ==================== CAMPAIGN TYPES ====================
// Based on TASK_10_3_CHIEN_DICH_THUONG.md specification

export type CampaignType = 'normal' | 'ab';

export type CampaignStatus = 
  | 'draft'       // Mới/Nháp
  | 'scheduled'   // Đang chờ
  | 'running'     // Đang chạy
  | 'paused'      // Tạm dừng
  | 'sent'        // Đã gửi
  | 'cancelled';  // Đã hủy

export type SendType = 
  | 'immediate'   // Gửi ngay
  | 'scheduled'   // Lên lịch
  | 'batch';      // Gửi theo đợt

export type EmailLogStatus = 
  | 'queued' | 'sending' | 'sent' | 'delivered'
  | 'opened' | 'clicked' | 'bounced' | 'failed' | 'unsubscribed';

export interface Attachment {
  id: string;
  campaign_id: string;
  file_name: string;
  file_url: string;
  file_size: number;
  file_type: string;
  uploaded_at: Date;
}

export interface RecipientFilter {
  labels: string[];
  sources: string[];
  statuses: string[];
  date_range: {
    from: Date | null;
    to: Date | null;
  } | null;
  exclude_sent_within_days: number;
  exclude_unsubscribed: boolean;
  exclude_bounced: boolean;
}

export interface BatchSchedule {
  batch_number: number;
  email_count: number | null;
  scheduled_at: Date;
  status: 'pending' | 'running' | 'completed' | 'failed';
  sent_count: number;
  failed_count: number;
  started_at: Date | null;
  completed_at: Date | null;
}

// ==================== A/B TESTING TYPES ====================
// Based on TASK_10_4_CHIEN_DICH_AB_VA_CHI_TIET.md specification

export type ABTestType = 'subject' | 'content' | 'send_time';

export interface ABVersionContent {
  subject?: string;           // For 'subject' test
  template_id?: string;       // For 'content' test
  send_at?: Date;             // For 'send_time' test
}

export interface ABTestConfig {
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
  evaluation_started_at: Date | null;
  evaluation_completed_at: Date | null;
  winner_sent_at: Date | null;
}

export interface ABVersionStats {
  version: 'a' | 'b';
  sent: number;
  delivered: number;
  opened: number;
  clicked: number;
  open_rate: number;
  click_rate: number;
}

export interface CampaignStats {
  total_recipients: number;
  total_sent: number;
  total_delivered: number;
  total_bounced: number;
  total_opened: number;
  total_clicked: number;
  total_unsubscribed: number;
  delivery_rate: number;
  open_rate: number;
  click_rate: number;
  bounce_rate: number;
  unsubscribe_rate: number;
  stats_a: ABVersionStats | null;
  stats_b: ABVersionStats | null;
}

export interface Campaign {
  id: string;
  name: string;
  type: CampaignType;
  status: CampaignStatus;
  
  // Content
  subject: string;
  preview_text: string | null;
  sender_email_id: string;
  template_id: string;
  attachments: Attachment[];
  
  // Recipients
  recipient_filter: RecipientFilter;
  recipient_count: number;
  valid_email_count: number;
  
  // Schedule
  send_type: SendType;
  scheduled_at: Date | null;
  batches: BatchSchedule[] | null;
  
  // A/B Testing
  ab_config: ABTestConfig | null;
  
  // Statistics
  stats: CampaignStats;
  
  // Audit
  created_by: string;
  created_at: Date;
  updated_at: Date;
  started_at: Date | null;
  completed_at: Date | null;
  deleted_at: Date | null;
}

export interface ClickedLink {
  url: string;
  clicked_at: Date;
}

export interface EmailSendLog {
  id: string;
  campaign_id: string;
  batch_number: number | null;
  recipient_email: string;
  recipient_customer_id: string;
  recipient_name: string | null;
  ab_version: 'a' | 'b' | null;
  status: EmailLogStatus;
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

export interface CampaignsFilters {
  status: CampaignStatus | 'all';
  type: CampaignType | 'all';
  search: string;
}

export interface StatusCounts {
  all: number;
  draft: number;
  scheduled: number;
  running: number;
  paused: number;
  sent: number;
  cancelled: number;
}

export interface CustomerLabel {
  id: string;
  name: string;
  color: string;
}

export interface CustomerSource {
  id: string;
  name: string;
}

export interface CustomerStatus {
  id: string;
  name: string;
  color: string;
}

export interface RecipientsPreview {
  total_customers: number;
  valid_emails: number;
  invalid_emails: number;
  duplicates_removed: number;
  excluded: {
    recently_sent: number;
    unsubscribed: number;
    bounced: number;
  };
  sample_recipients: Array<{
    id: string;
    email: string;
    name: string;
    labels: string[];
  }>;
}

export interface CampaignFormData {
  name: string;
  subject: string;
  preview_text: string;
  sender_email_id: string | null;
  template_id: string | null;
  recipient_filter: RecipientFilter;
  attachments: Attachment[];
  send_type: SendType;
  scheduled_at: Date | null;
  batches: BatchSchedule[];
}

export interface CampaignChecklist {
  subject: boolean;
  preview_text: boolean;
  sender: boolean;
  recipients: boolean;
  content: boolean;
  attachments: boolean;
}

// ==================== A/B CAMPAIGN EDITOR TYPES ====================

export interface ABCampaignFormData {
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
}

export type ABEditorStep = 'basic' | 'ab_config' | 'confirm';

export interface ABCampaignChecklist {
  test_type: boolean;
  sender: boolean;
  recipients: boolean;
  content: boolean;      // Or subject, depends on test type
  version_a: boolean;
  version_b: boolean;
}

// ==================== CAMPAIGN DETAIL/REPORT TYPES ====================

export interface ABTestResults {
  test_type: ABTestType;
  version_a: {
    content: ABVersionContent;
    stats: ABVersionStats;
  };
  version_b: {
    content: ABVersionContent;
    stats: ABVersionStats;
  };
  winner: 'a' | 'b' | 'tie' | null;
  comparison: {
    open_rate_diff: number;       // B - A (có thể âm)
    click_rate_diff: number;
  };
  evaluation_status: 'pending' | 'completed';
  remaining_count: number;
  can_send_remaining: boolean;
}

export interface TimelineDataPoint {
  timestamp: Date;
  count: number;
}

export interface CampaignDetailState {
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
    status: EmailLogStatus | 'all';
    search: string;
  };
  recipientsCounts: Record<EmailLogStatus | 'all', number>;
  
  // Timeline Chart
  timelineData: TimelineDataPoint[];
  timelineMetric: 'sent' | 'opened' | 'clicked';
  timelineInterval: 'hour' | 'day';
}

// ==================== EMAIL REPORTS DASHBOARD TYPES (Task 10.5) ====================

export interface ReportPeriod {
  type: 'week' | 'month' | 'quarter' | 'custom';
  from: string;                     // ISO date "2025-01-01"
  to: string;                       // ISO date "2025-01-31"
  label: string;                    // "Tháng 01/2025"
}

export interface TrendValue {
  value: number;                    // % change value
  direction: 'up' | 'down' | 'neutral';
}

export interface EmailMarketingOverview {
  period: ReportPeriod;
  
  // KPIs - Số tuyệt đối
  total_campaigns: number;
  total_sent: number;
  total_delivered: number;
  total_bounced: number;
  total_opened: number;
  total_clicked: number;
  total_unsubscribed: number;
  total_leads_generated: number;
  
  // Rates - Tỷ lệ % (flat structure for easy access)
  delivery_rate: number;
  open_rate: number;
  click_rate: number;
  bounce_rate: number;
  unsubscribe_rate: number;
  
  // Trends so với period trước (flat structure for easy access)
  sent_trend: TrendValue;
  delivery_trend: TrendValue;
  open_trend: TrendValue;
  click_trend: TrendValue;
  bounce_trend: TrendValue;
  unsubscribe_trend: TrendValue;
}

export interface ReportTrendDataPoint {
  date: string;                     // "2025-01-15" hoặc "2025-W03"
  label: string;                    // "15/01" hoặc "Tuần 3"
  sent: number;
  delivered: number;
  opened: number;
  clicked: number;
  bounced: number;
  unsubscribed: number;
}

export interface CampaignComparisonRow {
  id: string;
  campaign_name: string;
  type: CampaignType; // 'normal' | 'ab'
  status: CampaignStatus;
  sent_date: string;
  total_sent: number;
  delivery_rate: number;
  open_rate: number;
  click_rate: number;
  bounce_rate: number;
  unsubscribe_count: number;
}

export interface FunnelStage {
  key: string;                      // "sent", "delivered", "opened", "clicked"
  label: string;                    // "Gửi", "Nhận", "Mở", "Click"
  count: number;
  rate: number;                     // % so với stage đầu
  color: string;
}

export interface EmailFunnel {
  stages: FunnelStage[];
  overall_conversion: number;       // % chuyển đổi tổng thể (sent -> clicked)
}

export interface StatusDistributionItem {
  status: string;
  label: string;
  count: number;
  percentage: number;
  color: string;
}

export interface UnsubscribeEntry {
  id: string;
  customer_id: string;
  customer_name: string | null;
  customer_email: string;
  campaign_id: string;
  campaign_name: string;
  unsubscribed_at: string;
  reason: string | null;
}

export interface ReportFilter {
  period: 'today' | 'week' | 'month' | 'quarter' | 'custom';
  start_date: string | null;
  end_date: string | null;
  campaign_type: 'all' | CampaignType; // 'all' | 'normal' | 'ab'
  campaign_status: 'all' | CampaignStatus;
}

export interface EmailReportsState {
  // Filters
  filters: ReportFilter;
  
  // Overview
  overview: EmailMarketingOverview | null;
  overviewLoading: boolean;
  
  // Trend Chart
  trendData: ReportTrendDataPoint[];
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
  campaignsPagination: Pagination;
  campaignsSort: { field: string; order: 'asc' | 'desc' };
  
  // Unsubscribe
  unsubscribes: UnsubscribeEntry[];
  unsubscribesLoading: boolean;
  unsubscribesPagination: Pagination;
  unsubscribesSearch: string;
  unsubscribesTrend: Array<{ date: string; label: string; count: number }>;
  
  // Export
  exportModalOpen: boolean;
  exporting: boolean;
}
