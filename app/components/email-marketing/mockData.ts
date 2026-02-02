// ==================== MOCK DATA FOR EMAIL MARKETING ====================
// Based on TASK_10_1, TASK_10_2, TASK_10_3, TASK_10_4 specifications

import { 
  SenderEmail, 
  EmailLimits, 
  User, 
  EmailTemplate, 
  TemplateVariable,
  Campaign,
  CustomerLabel,
  CustomerSource,
  CustomerStatus,
  RecipientsPreview,
  EmailSendLog,
  EmailLogStatus
} from './types';

// Import notification templates v2.0 from EMAIL_TEMPLATES_SPECIFICATION.md
import { NOTIFICATION_TEMPLATES_V2 } from './notificationTemplatesV2';

// Mock Users for permissions
export const MOCK_USERS: User[] = [
  { id: 'user-001', name: 'Nguyễn Văn Admin', email: 'admin@vilead.vn', role: 'admin' },
  { id: 'user-002', name: 'Trần Thị Leader', email: 'leader@vilead.vn', role: 'leader' },
  { id: 'user-003', name: 'Lê Văn Sales', email: 'sales@vilead.vn', role: 'user' },
  { id: 'user-004', name: 'Phạm Thị Marketing', email: 'marketing@vilead.vn', role: 'user' },
  { id: 'user-005', name: 'Hoàng Văn Support', email: 'support@vilead.vn', role: 'user' }
];

// Current user (simulated)
export const CURRENT_USER: User = MOCK_USERS[0]; // Admin user

// Mock Sender Emails
export const MOCK_SENDER_EMAILS: SenderEmail[] = [
  {
    id: 'se-001',
    email: 'sales@vilead.vn',
    sender_name: 'Phòng Kinh doanh ViLead',
    status: 'activated',
    permission_type: 'all',
    permitted_user_ids: [],
    verification_token: null,
    verification_expires_at: null,
    verification_sent_count: 0,
    verification_last_sent_at: null,
    created_by: 'user-001',
    created_at: new Date('2026-01-15T08:00:00Z'),
    updated_at: new Date('2026-01-15T09:30:00Z'),
    deleted_at: null
  },
  {
    id: 'se-002',
    email: 'marketing@vilead.vn',
    sender_name: 'Marketing Team',
    status: 'activated',
    permission_type: 'specific',
    permitted_user_ids: ['user-001', 'user-002', 'user-003'],
    verification_token: null,
    verification_expires_at: null,
    verification_sent_count: 0,
    verification_last_sent_at: null,
    created_by: 'user-001',
    created_at: new Date('2026-01-10T10:00:00Z'),
    updated_at: new Date('2026-01-10T10:30:00Z'),
    deleted_at: null
  },
  {
    id: 'se-003',
    email: 'support@vilead.vn',
    sender_name: 'Hỗ trợ khách hàng',
    status: 'pending',
    permission_type: 'all',
    permitted_user_ids: [],
    verification_token: 'token-abc123',
    verification_expires_at: new Date('2026-02-02T10:00:00Z'),
    verification_sent_count: 1,
    verification_last_sent_at: new Date('2026-01-31T10:00:00Z'),
    created_by: 'user-002',
    created_at: new Date('2026-01-31T10:00:00Z'),
    updated_at: new Date('2026-01-31T10:00:00Z'),
    deleted_at: null
  },
  {
    id: 'se-004',
    email: 'ceo@newcompany.vn',
    sender_name: 'CEO - Nguyễn Văn A',
    status: 'domain_unverified',
    permission_type: 'me',
    permitted_user_ids: [],
    verification_token: null,
    verification_expires_at: null,
    verification_sent_count: 0,
    verification_last_sent_at: null,
    created_by: 'user-003',
    created_at: new Date('2026-01-20T14:00:00Z'),
    updated_at: new Date('2026-01-20T14:00:00Z'),
    deleted_at: null
  },
  {
    id: 'se-005',
    email: 'test@gmail.com',
    sender_name: 'Test Personal',
    status: 'disabled',
    permission_type: 'me',
    permitted_user_ids: [],
    verification_token: null,
    verification_expires_at: null,
    verification_sent_count: 3,
    verification_last_sent_at: new Date('2026-01-25T16:00:00Z'),
    created_by: 'user-001',
    created_at: new Date('2026-01-05T09:00:00Z'),
    updated_at: new Date('2026-01-28T11:00:00Z'),
    deleted_at: null
  }
];

// Mock Email Limits
export const MOCK_EMAIL_LIMITS: EmailLimits = {
  id: 'limit-001',
  project_id: 'project-001',
  daily_limit: 500,
  monthly_limit: 10000,
  per_sender_daily_limit: 100,
  delay_between_emails: 5,
  daily_used: 350,
  monthly_used: 2500,
  daily_reset_at: new Date('2026-02-02T00:00:00Z'),
  monthly_reset_at: new Date('2026-03-01T00:00:00Z'),
  updated_at: new Date('2026-01-30T15:00:00Z'),
  updated_by: 'user-001'
};

// Helper function to get user by ID
export const getUserById = (id: string): User | undefined => {
  return MOCK_USERS.find(user => user.id === id);
};

// Helper function to get user name by ID
export const getUserNameById = (id: string): string => {
  const user = getUserById(id);
  return user?.name || 'Unknown';
};

// ==================== TEMPLATE VARIABLES ====================
export const TEMPLATE_VARIABLES: TemplateVariable[] = [
  // Customer
  { key: 'ten_khach', label: 'Tên khách hàng', category: 'customer', sample_value: 'Nguyễn Văn A', description: 'Tên đầy đủ của khách hàng' },
  { key: 'email_khach', label: 'Email', category: 'customer', sample_value: 'nguyenvana@email.com', description: 'Email liên hệ của khách hàng' },
  { key: 'sdt_khach', label: 'Số điện thoại', category: 'customer', sample_value: '0901234567', description: 'Số điện thoại khách hàng' },
  { key: 'cong_ty', label: 'Tên công ty', category: 'customer', sample_value: 'Công ty ABC', description: 'Tên công ty của khách hàng' },
  
  // Order
  { key: 'ma_don', label: 'Mã đơn hàng', category: 'order', sample_value: 'DH-2026-001', description: 'Mã định danh đơn hàng' },
  { key: 'san_pham', label: 'Sản phẩm', category: 'order', sample_value: 'Sản phẩm XYZ', description: 'Tên sản phẩm trong đơn' },
  { key: 'gia_tri', label: 'Giá trị đơn', category: 'order', sample_value: '1,500,000 VNĐ', description: 'Tổng giá trị đơn hàng' },
  { key: 'ngay_dat', label: 'Ngày đặt', category: 'order', sample_value: '2026-01-15', description: 'Ngày đặt hàng' },
  
  // System
  { key: 'ngay_hien_tai', label: 'Ngày hiện tại', category: 'system', sample_value: '2026-01-31', description: 'Ngày hôm nay' },
  { key: 'ten_cong_ty', label: 'Tên công ty (của bạn)', category: 'system', sample_value: 'CRM ViLead', description: 'Tên công ty của bạn' }
];

// ==================== MOCK EMAIL TEMPLATES ====================
export const MOCK_TEMPLATES: EmailTemplate[] = [
  // System Templates
  {
    id: 'tpl-sys-001',
    name: 'Chào mừng khách hàng mới',
    type: 'system',
    content_html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #333;">Xin chào {ten_khach|Quý khách}!</h1>
        <p>Chào mừng bạn đến với {ten_cong_ty}.</p>
        <p>Chúng tôi rất vui được phục vụ bạn.</p>
        <a href="#" style="display: inline-block; padding: 12px 24px; background: #4F46E5; color: white; text-decoration: none; border-radius: 6px;">Khám phá ngay</a>
      </div>
    `,
    content_json: null,
    editor_mode: 'richtext',
    thumbnail_url: '/templates/thumbnails/welcome.png',
    owner_id: null,
    category_id: 'cat-welcome',
    version: 1,
    versions: [],
    usage_count: 156,
    created_at: new Date('2024-01-01T00:00:00Z'),
    updated_at: new Date('2024-06-15T00:00:00Z'),
    deleted_at: null
  },
  {
    id: 'tpl-sys-002',
    name: 'Khuyến mãi đặc biệt',
    type: 'system',
    content_html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px; text-align: center;">
          <h1 style="color: white; margin: 0;">🎉 ƯU ĐÃI ĐẶC BIỆT</h1>
        </div>
        <div style="padding: 30px;">
          <p>Xin chào {ten_khach},</p>
          <p>Chúng tôi có ưu đãi đặc biệt dành riêng cho bạn!</p>
          <div style="text-align: center; margin: 30px 0;">
            <span style="font-size: 48px; font-weight: bold; color: #E53E3E;">GIẢM 30%</span>
          </div>
          <a href="#" style="display: block; text-align: center; padding: 15px; background: #E53E3E; color: white; text-decoration: none; border-radius: 8px;">Nhận ưu đãi ngay</a>
        </div>
      </div>
    `,
    content_json: null,
    editor_mode: 'richtext',
    thumbnail_url: '/templates/thumbnails/promo.png',
    owner_id: null,
    category_id: 'cat-promo',
    version: 2,
    versions: [],
    usage_count: 89,
    created_at: new Date('2024-01-15T00:00:00Z'),
    updated_at: new Date('2024-08-20T00:00:00Z'),
    deleted_at: null
  },
  {
    id: 'tpl-sys-003',
    name: 'Xác nhận đơn hàng',
    type: 'system',
    content_html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #10B981;">✅ Đơn hàng đã được xác nhận</h2>
        <p>Xin chào {ten_khach},</p>
        <p>Cảm ơn bạn đã đặt hàng. Đơn hàng của bạn đã được xác nhận.</p>
        <div style="background: #F3F4F6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Mã đơn hàng:</strong> {ma_don}</p>
          <p><strong>Sản phẩm:</strong> {san_pham}</p>
          <p><strong>Giá trị:</strong> {gia_tri}</p>
          <p><strong>Ngày đặt:</strong> {ngay_dat}</p>
        </div>
        <p>Chúng tôi sẽ thông báo khi đơn hàng được giao.</p>
      </div>
    `,
    content_json: null,
    editor_mode: 'richtext',
    thumbnail_url: '/templates/thumbnails/order-confirm.png',
    owner_id: null,
    category_id: 'cat-transactional',
    version: 1,
    versions: [],
    usage_count: 234,
    created_at: new Date('2024-02-01T00:00:00Z'),
    updated_at: new Date('2024-02-01T00:00:00Z'),
    deleted_at: null
  },
  {
    id: 'tpl-sys-004',
    name: 'Nhắc nhở thanh toán',
    type: 'system',
    content_html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #F59E0B;">⏰ Nhắc nhở thanh toán</h2>
        <p>Xin chào {ten_khach},</p>
        <p>Đây là lời nhắc nhở về khoản thanh toán đang chờ xử lý.</p>
        <div style="background: #FEF3C7; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #F59E0B;">
          <p><strong>Mã đơn hàng:</strong> {ma_don}</p>
          <p><strong>Số tiền:</strong> {gia_tri}</p>
          <p><strong>Hạn thanh toán:</strong> {ngay_dat}</p>
        </div>
        <a href="#" style="display: inline-block; padding: 12px 24px; background: #F59E0B; color: white; text-decoration: none; border-radius: 6px;">Thanh toán ngay</a>
      </div>
    `,
    content_json: null,
    editor_mode: 'richtext',
    thumbnail_url: '/templates/thumbnails/payment-reminder.png',
    owner_id: null,
    category_id: 'cat-transactional',
    version: 1,
    versions: [],
    usage_count: 78,
    created_at: new Date('2024-03-01T00:00:00Z'),
    updated_at: new Date('2024-03-01T00:00:00Z'),
    deleted_at: null
  },
  {
    id: 'tpl-sys-005',
    name: 'Cảm ơn khách hàng',
    type: 'system',
    content_html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; text-align: center;">
        <div style="font-size: 48px; margin: 20px 0;">💝</div>
        <h1 style="color: #333;">Cảm ơn bạn!</h1>
        <p>Xin chào {ten_khach},</p>
        <p>Cảm ơn bạn đã tin tưởng và sử dụng dịch vụ của {ten_cong_ty}.</p>
        <p>Sự hài lòng của bạn là động lực của chúng tôi!</p>
        <a href="#" style="display: inline-block; padding: 12px 24px; background: #10B981; color: white; text-decoration: none; border-radius: 6px; margin-top: 20px;">Đánh giá dịch vụ</a>
      </div>
    `,
    content_json: null,
    editor_mode: 'richtext',
    thumbnail_url: '/templates/thumbnails/thank-you.png',
    owner_id: null,
    category_id: 'cat-welcome',
    version: 1,
    versions: [],
    usage_count: 45,
    created_at: new Date('2024-04-01T00:00:00Z'),
    updated_at: new Date('2024-04-01T00:00:00Z'),
    deleted_at: null
  },
  
  // User Templates
  {
    id: 'tpl-user-001',
    name: 'Chiến dịch Tết 2025',
    type: 'user',
    content_html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #DC2626 0%, #991B1B 100%); padding: 40px; text-align: center;">
          <h1 style="color: #FEF08A; margin: 0;">🧧 CHÚC MỪNG NĂM MỚI 2025 🧧</h1>
        </div>
        <div style="padding: 30px; text-align: center;">
          <p>Kính chào {ten_khach},</p>
          <p>Nhân dịp Xuân Ất Tỵ, {ten_cong_ty} xin gửi đến bạn lời chúc tốt đẹp nhất!</p>
          <div style="margin: 30px 0;">
            <span style="font-size: 32px; color: #DC2626; font-weight: bold;">🎊 Ưu đãi đến 50% 🎊</span>
          </div>
          <a href="#" style="display: inline-block; padding: 15px 30px; background: #DC2626; color: white; text-decoration: none; border-radius: 8px;">Xem ưu đãi Tết</a>
        </div>
      </div>
    `,
    content_json: null,
    editor_mode: 'richtext',
    thumbnail_url: '/templates/thumbnails/user/tet-2025.png',
    owner_id: 'user-001',
    category_id: null,
    version: 3,
    versions: [
      {
        version: 1,
        content_html: '<div>Version 1 content...</div>',
        content_json: null,
        created_at: new Date('2026-01-20T10:00:00Z'),
        created_by: 'user-001'
      },
      {
        version: 2,
        content_html: '<div>Version 2 content...</div>',
        content_json: null,
        created_at: new Date('2026-01-25T14:00:00Z'),
        created_by: 'user-001'
      }
    ],
    usage_count: 5,
    created_at: new Date('2026-01-20T10:00:00Z'),
    updated_at: new Date('2026-01-30T16:00:00Z'),
    deleted_at: null
  },
  {
    id: 'tpl-user-002',
    name: 'Newsletter tháng 1',
    type: 'user',
    content_html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #1F2937; color: white; padding: 30px; text-align: center;">
          <h1>📰 BẢN TIN THÁNG 1/2026</h1>
        </div>
        <div style="padding: 30px;">
          <p>Xin chào {ten_khach},</p>
          <p>Đây là những cập nhật quan trọng trong tháng qua:</p>
          <ul>
            <li>Tính năng mới: Email Marketing</li>
            <li>Cập nhật: Cải thiện hiệu suất</li>
            <li>Sắp ra mắt: Tích hợp Zalo OA</li>
          </ul>
          <p>Cảm ơn bạn đã đồng hành cùng chúng tôi!</p>
        </div>
      </div>
    `,
    content_json: null,
    editor_mode: 'richtext',
    thumbnail_url: '/templates/thumbnails/user/newsletter-jan.png',
    owner_id: 'user-001',
    category_id: null,
    version: 1,
    versions: [],
    usage_count: 1,
    created_at: new Date('2026-01-28T09:00:00Z'),
    updated_at: new Date('2026-01-28T09:00:00Z'),
    deleted_at: null
  },
  {
    id: 'tpl-user-003',
    name: 'Giới thiệu sản phẩm mới',
    type: 'user',
    content_html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #3B82F6; padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0;">✨ SẢN PHẨM MỚI</h1>
        </div>
        <div style="padding: 30px;">
          <p>Xin chào {ten_khach},</p>
          <p>{ten_cong_ty} xin hân hạnh giới thiệu sản phẩm/dịch vụ mới nhất!</p>
          <div style="background: #EFF6FF; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #1E40AF; margin-top: 0;">Tính năng nổi bật:</h3>
            <ul>
              <li>Tính năng 1</li>
              <li>Tính năng 2</li>
              <li>Tính năng 3</li>
            </ul>
          </div>
          <a href="#" style="display: inline-block; padding: 12px 24px; background: #3B82F6; color: white; text-decoration: none; border-radius: 6px;">Tìm hiểu thêm</a>
        </div>
      </div>
    `,
    content_json: null,
    editor_mode: 'richtext',
    thumbnail_url: '/templates/thumbnails/user/new-product.png',
    owner_id: 'user-001',
    category_id: null,
    version: 1,
    versions: [],
    usage_count: 0,
    created_at: new Date('2026-01-29T11:00:00Z'),
    updated_at: new Date('2026-01-29T11:00:00Z'),
    deleted_at: null
  },

  // ==================== NOTIFICATION TEMPLATES ====================
  // System notification templates based on EMAIL_TEMPLATES_SPECIFICATION.md v2.0
  // Design: Modern & Minimal - Content-first, clean & professional
  // Imported from notificationTemplatesV2.ts
  ...NOTIFICATION_TEMPLATES_V2
];

// Helper function to get template by ID
export const getTemplateById = (id: string): EmailTemplate | undefined => {
  return MOCK_TEMPLATES.find(template => template.id === id);
};

// Helper function to replace variables in template with sample data
export const replaceVariablesWithSample = (html: string): string => {
  return html.replace(/\{(\w+)(?:\|([^}]+))?\}/g, (match, key, fallback) => {
    const variable = TEMPLATE_VARIABLES.find(v => v.key === key);
    return variable?.sample_value || fallback || match;
  });
};

// ==================== CAMPAIGN MOCK DATA ====================
// Based on TASK_10_3_CHIEN_DICH_THUONG.md specification

// Customer Labels
export const MOCK_CUSTOMER_LABELS: CustomerLabel[] = [
  { id: 'lbl-001', name: 'VIP', color: '#FFD700' },
  { id: 'lbl-002', name: 'Tiềm năng', color: '#10B981' },
  { id: 'lbl-003', name: 'Doanh nghiệp', color: '#3B82F6' },
  { id: 'lbl-004', name: 'Cá nhân', color: '#8B5CF6' },
  { id: 'lbl-005', name: 'Đối tác', color: '#F59E0B' }
];

// Customer Sources
export const MOCK_CUSTOMER_SOURCES: CustomerSource[] = [
  { id: 'src-001', name: 'Website' },
  { id: 'src-002', name: 'Facebook' },
  { id: 'src-003', name: 'Zalo' },
  { id: 'src-004', name: 'Google Ads' },
  { id: 'src-005', name: 'Giới thiệu' },
  { id: 'src-006', name: 'Event/Hội thảo' }
];

// Customer Statuses
export const MOCK_CUSTOMER_STATUSES: CustomerStatus[] = [
  { id: 'sts-001', name: 'Mới', color: '#3B82F6' },
  { id: 'sts-002', name: 'Đang chăm sóc', color: '#F59E0B' },
  { id: 'sts-003', name: 'Đã liên hệ', color: '#10B981' },
  { id: 'sts-004', name: 'Quan tâm', color: '#8B5CF6' },
  { id: 'sts-005', name: 'Chốt deal', color: '#22C55E' },
  { id: 'sts-006', name: 'Không quan tâm', color: '#6B7280' }
];

// Recipients Preview (simulated API response)
export const MOCK_RECIPIENTS_PREVIEW: RecipientsPreview = {
  total_customers: 520,
  valid_emails: 485,
  invalid_emails: 35,
  duplicates_removed: 12,
  excluded: {
    recently_sent: 45,
    unsubscribed: 18,
    bounced: 7
  },
  sample_recipients: [
    { id: 'cust-001', email: 'nguyen.a@gmail.com', name: 'Nguyễn Văn A', labels: ['VIP'] },
    { id: 'cust-002', email: 'tran.b@company.vn', name: 'Trần Thị B', labels: ['Doanh nghiệp', 'Tiềm năng'] },
    { id: 'cust-003', email: 'le.c@email.com', name: 'Lê Văn C', labels: ['Cá nhân'] },
    { id: 'cust-004', email: 'pham.d@corp.vn', name: 'Phạm Thị D', labels: ['VIP', 'Doanh nghiệp'] },
    { id: 'cust-005', email: 'hoang.e@yahoo.com', name: 'Hoàng Văn E', labels: ['Đối tác'] }
  ]
};

// Spam Keywords for detection
export const SPAM_KEYWORDS = [
  'free', 'miễn phí', 'giảm giá', 'khuyến mãi', 'sale',
  'urgent', 'khẩn cấp', 'act now', 'limited time',
  'click here', 'nhấp vào đây', 'winner', 'trúng thưởng',
  '100%', 'guarantee', 'cam kết', 'no risk'
];

// Attachment Constraints
export const ATTACHMENT_CONSTRAINTS = {
  allowedTypes: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'image/jpeg', 'image/png', 'image/gif'
  ],
  allowedExtensions: ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'jpg', 'jpeg', 'png', 'gif'],
  maxFileSize: 5 * 1024 * 1024,      // 5MB per file
  maxTotalSize: 10 * 1024 * 1024,    // 10MB total
  maxFiles: 3
};

// Campaign Status Config
export const CAMPAIGN_STATUS_CONFIG = {
  draft: { 
    label: 'Nháp', 
    bgColor: 'bg-blue-100', 
    textColor: 'text-blue-800',
    dotColor: 'bg-blue-500'
  },
  scheduled: { 
    label: 'Đang chờ', 
    bgColor: 'bg-yellow-100', 
    textColor: 'text-yellow-800',
    dotColor: 'bg-yellow-500'
  },
  running: { 
    label: 'Đang chạy', 
    bgColor: 'bg-green-100', 
    textColor: 'text-green-800',
    dotColor: 'bg-green-500',
    pulse: true
  },
  paused: { 
    label: 'Tạm dừng', 
    bgColor: 'bg-orange-100', 
    textColor: 'text-orange-800',
    dotColor: 'bg-orange-500'
  },
  sent: { 
    label: 'Đã gửi', 
    bgColor: 'bg-gray-100', 
    textColor: 'text-gray-800',
    dotColor: 'bg-gray-500'
  },
  cancelled: { 
    label: 'Đã hủy', 
    bgColor: 'bg-red-100', 
    textColor: 'text-red-800',
    dotColor: 'bg-red-500'
  }
};

// Mock Campaigns
export const MOCK_CAMPAIGNS: Campaign[] = [
  {
    id: 'camp-001',
    name: 'Chiến dịch Tết 2026',
    type: 'normal',
    status: 'sent',
    subject: '🧧 Ưu đãi Tết 2026 dành riêng cho {ten_khach}!',
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
      total_opened: 312,
      total_clicked: 89,
      total_unsubscribed: 3,
      delivery_rate: 97.3,
      open_rate: 66.1,
      click_rate: 18.9,
      bounce_rate: 2.7,
      unsubscribe_rate: 0.6,
      stats_a: null,
      stats_b: null
    },
    created_by: 'user-001',
    created_at: new Date('2026-01-15T08:00:00Z'),
    updated_at: new Date('2026-01-16T10:00:00Z'),
    started_at: new Date('2026-01-16T09:00:00Z'),
    completed_at: new Date('2026-01-16T09:45:00Z'),
    deleted_at: null
  },
  {
    id: 'camp-002',
    name: 'Newsletter tháng 2',
    type: 'normal',
    status: 'scheduled',
    subject: '📰 Bản tin tháng 2 - Cập nhật mới nhất từ {ten_cong_ty}',
    preview_text: 'Tin tức, khuyến mãi và nhiều hơn nữa',
    sender_email_id: 'se-001',
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
    recipient_count: 1200,
    valid_email_count: 1150,
    send_type: 'scheduled',
    scheduled_at: new Date('2026-02-05T09:00:00Z'),
    batches: null,
    ab_config: null,
    stats: {
      total_recipients: 1150,
      total_sent: 0,
      total_delivered: 0,
      total_bounced: 0,
      total_opened: 0,
      total_clicked: 0,
      total_unsubscribed: 0,
      delivery_rate: 0,
      open_rate: 0,
      click_rate: 0,
      bounce_rate: 0,
      unsubscribe_rate: 0,
      stats_a: null,
      stats_b: null
    },
    created_by: 'user-001',
    created_at: new Date('2026-01-28T14:00:00Z'),
    updated_at: new Date('2026-01-30T10:00:00Z'),
    started_at: null,
    completed_at: null,
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
      sources: ['Website'],
      statuses: ['Mới'],
      date_range: {
        from: new Date('2026-01-01'),
        to: new Date('2026-01-31')
      },
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
        email_count: 65,
        scheduled_at: new Date('2026-01-31T09:00:00Z'),
        status: 'completed',
        sent_count: 65,
        failed_count: 2,
        started_at: new Date('2026-01-31T09:00:00Z'),
        completed_at: new Date('2026-01-31T09:10:00Z')
      },
      {
        batch_number: 2,
        email_count: 65,
        scheduled_at: new Date('2026-01-31T14:00:00Z'),
        status: 'running',
        sent_count: 32,
        failed_count: 0,
        started_at: new Date('2026-01-31T14:00:00Z'),
        completed_at: null
      },
      {
        batch_number: 3,
        email_count: 65,
        scheduled_at: new Date('2026-02-01T09:00:00Z'),
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
      total_sent: 97,
      total_delivered: 95,
      total_bounced: 2,
      total_opened: 45,
      total_clicked: 12,
      total_unsubscribed: 0,
      delivery_rate: 97.9,
      open_rate: 47.4,
      click_rate: 12.6,
      bounce_rate: 2.1,
      unsubscribe_rate: 0,
      stats_a: null,
      stats_b: null
    },
    created_by: 'user-002',
    created_at: new Date('2026-01-30T15:00:00Z'),
    updated_at: new Date('2026-01-31T14:30:00Z'),
    started_at: new Date('2026-01-31T09:00:00Z'),
    completed_at: null,
    deleted_at: null
  },
  {
    id: 'camp-004',
    name: 'Flash Sale cuối tuần',
    type: 'normal',
    status: 'paused',
    subject: '⚡ Flash Sale - Chỉ 48 giờ duy nhất!',
    preview_text: 'Giảm giá sốc lên đến 70%',
    sender_email_id: 'se-002',
    template_id: 'tpl-sys-002',
    attachments: [],
    recipient_filter: {
      labels: ['VIP'],
      sources: [],
      statuses: [],
      date_range: null,
      exclude_sent_within_days: 3,
      exclude_unsubscribed: true,
      exclude_bounced: true
    },
    recipient_count: 350,
    valid_email_count: 342,
    send_type: 'immediate',
    scheduled_at: null,
    batches: null,
    ab_config: null,
    stats: {
      total_recipients: 342,
      total_sent: 180,
      total_delivered: 175,
      total_bounced: 5,
      total_opened: 98,
      total_clicked: 34,
      total_unsubscribed: 1,
      delivery_rate: 97.2,
      open_rate: 56.0,
      click_rate: 19.4,
      bounce_rate: 2.8,
      unsubscribe_rate: 0.6,
      stats_a: null,
      stats_b: null
    },
    created_by: 'user-001',
    created_at: new Date('2026-01-29T08:00:00Z'),
    updated_at: new Date('2026-01-29T15:30:00Z'),
    started_at: new Date('2026-01-29T10:00:00Z'),
    completed_at: null,
    deleted_at: null
  },
  {
    id: 'camp-005',
    name: 'Khảo sát khách hàng Q1',
    type: 'normal',
    status: 'draft',
    subject: 'Ý kiến của {ten_khach} rất quan trọng với chúng tôi',
    preview_text: 'Tham gia khảo sát và nhận quà',
    sender_email_id: 'se-001',
    template_id: 'tpl-sys-005',
    attachments: [],
    recipient_filter: {
      labels: [],
      sources: [],
      statuses: ['Chốt deal'],
      date_range: null,
      exclude_sent_within_days: 14,
      exclude_unsubscribed: true,
      exclude_bounced: true
    },
    recipient_count: 280,
    valid_email_count: 275,
    send_type: 'immediate',
    scheduled_at: null,
    batches: null,
    ab_config: null,
    stats: {
      total_recipients: 275,
      total_sent: 0,
      total_delivered: 0,
      total_bounced: 0,
      total_opened: 0,
      total_clicked: 0,
      total_unsubscribed: 0,
      delivery_rate: 0,
      open_rate: 0,
      click_rate: 0,
      bounce_rate: 0,
      unsubscribe_rate: 0,
      stats_a: null,
      stats_b: null
    },
    created_by: 'user-001',
    created_at: new Date('2026-01-31T11:00:00Z'),
    updated_at: new Date('2026-01-31T11:00:00Z'),
    started_at: null,
    completed_at: null,
    deleted_at: null
  },
  {
    id: 'camp-006',
    name: 'Thông báo bảo trì hệ thống',
    type: 'normal',
    status: 'cancelled',
    subject: '[Thông báo] Bảo trì hệ thống ngày 15/01',
    preview_text: 'Hệ thống sẽ tạm ngưng hoạt động',
    sender_email_id: 'se-001',
    template_id: 'tpl-sys-003',
    attachments: [],
    recipient_filter: {
      labels: [],
      sources: [],
      statuses: [],
      date_range: null,
      exclude_sent_within_days: 0,
      exclude_unsubscribed: true,
      exclude_bounced: true
    },
    recipient_count: 1500,
    valid_email_count: 1450,
    send_type: 'immediate',
    scheduled_at: null,
    batches: null,
    ab_config: null,
    stats: {
      total_recipients: 1450,
      total_sent: 0,
      total_delivered: 0,
      total_bounced: 0,
      total_opened: 0,
      total_clicked: 0,
      total_unsubscribed: 0,
      delivery_rate: 0,
      open_rate: 0,
      click_rate: 0,
      bounce_rate: 0,
      unsubscribe_rate: 0,
      stats_a: null,
      stats_b: null
    },
    created_by: 'user-002',
    created_at: new Date('2026-01-10T09:00:00Z'),
    updated_at: new Date('2026-01-12T14:00:00Z'),
    started_at: null,
    completed_at: null,
    deleted_at: null
  },
  // A/B Testing Campaigns
  {
    id: 'camp-ab-001',
    name: '[A/B] Test tiêu đề - Sale cuối năm',
    type: 'ab',
    status: 'sent',
    subject: 'Sale cuối năm - Giảm giá sốc!',
    preview_text: 'Ưu đãi lớn nhất năm đang chờ bạn',
    sender_email_id: 'se-001',
    template_id: 'tpl-user-001',
    attachments: [],
    recipient_filter: {
      labels: ['VIP'],
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
      evaluation_started_at: new Date('2026-01-14T09:00:00Z'),
      evaluation_completed_at: new Date('2026-01-15T09:00:00Z'),
      winner_sent_at: new Date('2026-01-15T10:30:00Z')
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
        version: 'a',
        sent: 98,
        delivered: 96,
        opened: 40,
        clicked: 10,
        open_rate: 41.7,
        click_rate: 10.4
      },
      stats_b: {
        version: 'b',
        sent: 98,
        delivered: 95,
        opened: 48,
        clicked: 14,
        open_rate: 50.5,
        click_rate: 14.7
      }
    },
    created_by: 'user-001',
    created_at: new Date('2026-01-14T08:00:00Z'),
    updated_at: new Date('2026-01-15T10:30:00Z'),
    started_at: new Date('2026-01-14T09:00:00Z'),
    completed_at: new Date('2026-01-15T11:00:00Z'),
    deleted_at: null
  },
  {
    id: 'camp-ab-002',
    name: '[A/B] Test nội dung - Giới thiệu sản phẩm mới',
    type: 'ab',
    status: 'running',
    subject: '🆕 Sản phẩm mới - Dành riêng cho bạn!',
    preview_text: 'Khám phá ngay sản phẩm độc quyền',
    sender_email_id: 'se-001',
    template_id: 'tpl-user-001',
    attachments: [],
    recipient_filter: {
      labels: [],
      sources: [],
      statuses: [],
      date_range: null,
      exclude_sent_within_days: 14,
      exclude_unsubscribed: true,
      exclude_bounced: true
    },
    recipient_count: 800,
    valid_email_count: 780,
    send_type: 'immediate',
    scheduled_at: null,
    batches: null,
    ab_config: {
      test_type: 'content',
      version_a: { template_id: 'tpl-user-001' },
      version_b: { template_id: 'tpl-user-002' },
      ratio_a: 15,
      ratio_b: 15,
      evaluation_hours: 48,
      winning_criteria: 'click',
      winning_threshold: null,
      auto_send_winner: true,
      winner: null,
      evaluation_started_at: new Date('2026-01-31T10:00:00Z'),
      evaluation_completed_at: null,
      winner_sent_at: null
    },
    stats: {
      total_recipients: 780,
      total_sent: 234,
      total_delivered: 230,
      total_bounced: 4,
      total_opened: 85,
      total_clicked: 22,
      total_unsubscribed: 0,
      delivery_rate: 98.3,
      open_rate: 37.0,
      click_rate: 9.6,
      bounce_rate: 1.7,
      unsubscribe_rate: 0,
      stats_a: {
        version: 'a',
        sent: 117,
        delivered: 115,
        opened: 38,
        clicked: 8,
        open_rate: 33.0,
        click_rate: 7.0
      },
      stats_b: {
        version: 'b',
        sent: 117,
        delivered: 115,
        opened: 47,
        clicked: 14,
        open_rate: 40.9,
        click_rate: 12.2
      }
    },
    created_by: 'user-001',
    created_at: new Date('2026-01-31T08:00:00Z'),
    updated_at: new Date('2026-01-31T10:00:00Z'),
    started_at: new Date('2026-01-31T10:00:00Z'),
    completed_at: null,
    deleted_at: null
  },
  {
    id: 'camp-ab-003',
    name: '[A/B] Draft - Test thời gian gửi',
    type: 'ab',
    status: 'draft',
    subject: 'Chương trình khách hàng thân thiết',
    preview_text: 'Tích điểm, nhận quà',
    sender_email_id: 'se-001',
    template_id: 'tpl-user-002',
    attachments: [],
    recipient_filter: {
      labels: ['VIP'],
      sources: [],
      statuses: [],
      date_range: null,
      exclude_sent_within_days: 7,
      exclude_unsubscribed: true,
      exclude_bounced: true
    },
    recipient_count: 300,
    valid_email_count: 295,
    send_type: 'scheduled',
    scheduled_at: null,
    batches: null,
    ab_config: {
      test_type: 'send_time',
      version_a: { send_at: new Date('2026-02-10T09:00:00Z') },
      version_b: { send_at: new Date('2026-02-10T18:00:00Z') },
      ratio_a: 20,
      ratio_b: 20,
      evaluation_hours: 24,
      winning_criteria: 'open',
      winning_threshold: null,
      auto_send_winner: false,
      winner: null,
      evaluation_started_at: null,
      evaluation_completed_at: null,
      winner_sent_at: null
    },
    stats: {
      total_recipients: 295,
      total_sent: 0,
      total_delivered: 0,
      total_bounced: 0,
      total_opened: 0,
      total_clicked: 0,
      total_unsubscribed: 0,
      delivery_rate: 0,
      open_rate: 0,
      click_rate: 0,
      bounce_rate: 0,
      unsubscribe_rate: 0,
      stats_a: null,
      stats_b: null
    },
    created_by: 'user-001',
    created_at: new Date('2026-02-01T08:00:00Z'),
    updated_at: new Date('2026-02-01T08:00:00Z'),
    started_at: null,
    completed_at: null,
    deleted_at: null
  }
];

// Mock Email Send Logs for Campaign Detail
export const MOCK_EMAIL_SEND_LOGS: EmailSendLog[] = [
  {
    id: 'log-001',
    campaign_id: 'camp-ab-001',
    batch_number: null,
    recipient_email: 'nguyen.a@gmail.com',
    recipient_customer_id: 'cust-001',
    recipient_name: 'Nguyễn Văn A',
    ab_version: 'a',
    status: 'clicked',
    queued_at: new Date('2026-01-14T09:00:00Z'),
    sent_at: new Date('2026-01-14T09:00:30Z'),
    delivered_at: new Date('2026-01-14T09:01:00Z'),
    opened_at: new Date('2026-01-14T10:15:00Z'),
    clicked_at: new Date('2026-01-14T10:17:00Z'),
    bounced_at: null,
    unsubscribed_at: null,
    open_count: 2,
    click_count: 3,
    clicked_links: [
      { url: 'https://example.com/sale', clicked_at: new Date('2026-01-14T10:17:00Z') },
      { url: 'https://example.com/products', clicked_at: new Date('2026-01-14T10:20:00Z') }
    ],
    bounce_type: null,
    bounce_reason: null,
    retry_count: 0
  },
  {
    id: 'log-002',
    campaign_id: 'camp-ab-001',
    batch_number: null,
    recipient_email: 'tran.b@yahoo.com',
    recipient_customer_id: 'cust-002',
    recipient_name: 'Trần Thị B',
    ab_version: 'b',
    status: 'opened',
    queued_at: new Date('2026-01-14T09:00:00Z'),
    sent_at: new Date('2026-01-14T09:00:35Z'),
    delivered_at: new Date('2026-01-14T09:01:05Z'),
    opened_at: new Date('2026-01-14T11:30:00Z'),
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
    id: 'log-003',
    campaign_id: 'camp-ab-001',
    batch_number: null,
    recipient_email: 'le.c@hotmail.com',
    recipient_customer_id: 'cust-003',
    recipient_name: 'Lê Văn C',
    ab_version: 'a',
    status: 'bounced',
    queued_at: new Date('2026-01-14T09:00:00Z'),
    sent_at: new Date('2026-01-14T09:00:40Z'),
    delivered_at: null,
    opened_at: null,
    clicked_at: null,
    bounced_at: new Date('2026-01-14T09:01:30Z'),
    unsubscribed_at: null,
    open_count: 0,
    click_count: 0,
    clicked_links: [],
    bounce_type: 'hard',
    bounce_reason: 'Mailbox not found',
    retry_count: 0
  },
  {
    id: 'log-004',
    campaign_id: 'camp-ab-001',
    batch_number: null,
    recipient_email: 'pham.d@outlook.com',
    recipient_customer_id: 'cust-004',
    recipient_name: 'Phạm Thị D',
    ab_version: 'b',
    status: 'clicked',
    queued_at: new Date('2026-01-14T09:00:00Z'),
    sent_at: new Date('2026-01-14T09:00:45Z'),
    delivered_at: new Date('2026-01-14T09:01:15Z'),
    opened_at: new Date('2026-01-14T14:00:00Z'),
    clicked_at: new Date('2026-01-14T14:02:00Z'),
    bounced_at: null,
    unsubscribed_at: null,
    open_count: 3,
    click_count: 2,
    clicked_links: [
      { url: 'https://example.com/contact', clicked_at: new Date('2026-01-14T14:02:00Z') }
    ],
    bounce_type: null,
    bounce_reason: null,
    retry_count: 0
  },
  {
    id: 'log-005',
    campaign_id: 'camp-ab-001',
    batch_number: null,
    recipient_email: 'hoang.e@company.vn',
    recipient_customer_id: 'cust-005',
    recipient_name: 'Hoàng Văn E',
    ab_version: null,
    status: 'delivered',
    queued_at: new Date('2026-01-15T10:30:00Z'),
    sent_at: new Date('2026-01-15T10:31:00Z'),
    delivered_at: new Date('2026-01-15T10:31:30Z'),
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
    id: 'log-006',
    campaign_id: 'camp-ab-001',
    batch_number: null,
    recipient_email: 'vu.f@gmail.com',
    recipient_customer_id: 'cust-006',
    recipient_name: 'Vũ Thị F',
    ab_version: null,
    status: 'unsubscribed',
    queued_at: new Date('2026-01-15T10:30:00Z'),
    sent_at: new Date('2026-01-15T10:31:00Z'),
    delivered_at: new Date('2026-01-15T10:31:30Z'),
    opened_at: new Date('2026-01-15T12:00:00Z'),
    clicked_at: null,
    bounced_at: null,
    unsubscribed_at: new Date('2026-01-15T12:02:00Z'),
    open_count: 1,
    click_count: 0,
    clicked_links: [],
    bounce_type: null,
    bounce_reason: null,
    retry_count: 0
  }
];

// Mock Timeline Data for Charts
export const MOCK_CAMPAIGN_TIMELINE = {
  'camp-ab-001': {
    hourly: [
      { timestamp: new Date('2026-01-14T09:00:00Z'), sent: 196, opened: 0, clicked: 0 },
      { timestamp: new Date('2026-01-14T10:00:00Z'), sent: 0, opened: 25, clicked: 5 },
      { timestamp: new Date('2026-01-14T11:00:00Z'), sent: 0, opened: 18, clicked: 8 },
      { timestamp: new Date('2026-01-14T12:00:00Z'), sent: 0, opened: 12, clicked: 4 },
      { timestamp: new Date('2026-01-14T13:00:00Z'), sent: 0, opened: 8, clicked: 2 },
      { timestamp: new Date('2026-01-14T14:00:00Z'), sent: 0, opened: 10, clicked: 3 },
      { timestamp: new Date('2026-01-14T15:00:00Z'), sent: 0, opened: 5, clicked: 2 },
      { timestamp: new Date('2026-01-15T10:00:00Z'), sent: 784, opened: 0, clicked: 0 },
      { timestamp: new Date('2026-01-15T11:00:00Z'), sent: 0, opened: 120, clicked: 35 },
      { timestamp: new Date('2026-01-15T12:00:00Z'), sent: 0, opened: 85, clicked: 28 },
      { timestamp: new Date('2026-01-15T13:00:00Z'), sent: 0, opened: 60, clicked: 18 },
      { timestamp: new Date('2026-01-15T14:00:00Z'), sent: 0, opened: 45, clicked: 10 }
    ],
    daily: [
      { timestamp: new Date('2026-01-14T00:00:00Z'), sent: 196, opened: 78, clicked: 24 },
      { timestamp: new Date('2026-01-15T00:00:00Z'), sent: 784, opened: 342, clicked: 96 }
    ]
  }
};

// A/B Test Type Labels
export const AB_TEST_TYPE_LABELS: Record<string, { label: string; description: string; icon: string }> = {
  subject: {
    label: 'Tiêu đề email',
    description: 'So sánh 2 tiêu đề khác nhau',
    icon: '📧'
  },
  content: {
    label: 'Nội dung email',
    description: 'So sánh 2 mẫu nội dung khác',
    icon: '📝'
  },
  send_time: {
    label: 'Thời gian gửi',
    description: 'So sánh 2 khung giờ gửi khác',
    icon: '⏰'
  }
};

// A/B Version Colors
export const AB_VERSION_COLORS = {
  a: { primary: '#EF4444', bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700' },
  b: { primary: '#3B82F6', bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700' },
  winner: { primary: '#22C55E', bg: 'bg-green-50', border: 'border-green-500', text: 'text-green-700' }
};

// Email Log Status Config
export const EMAIL_LOG_STATUS_CONFIG: Record<EmailLogStatus, { label: string; color: string; bgColor: string }> = {
  queued: { label: 'Đang chờ', color: 'text-gray-600', bgColor: 'bg-gray-100' },
  sending: { label: 'Đang gửi', color: 'text-blue-600', bgColor: 'bg-blue-100' },
  sent: { label: 'Đã gửi', color: 'text-blue-600', bgColor: 'bg-blue-100' },
  delivered: { label: 'Đã nhận', color: 'text-green-600', bgColor: 'bg-green-100' },
  opened: { label: 'Đã mở', color: 'text-indigo-600', bgColor: 'bg-indigo-100' },
  clicked: { label: 'Đã click', color: 'text-purple-600', bgColor: 'bg-purple-100' },
  bounced: { label: 'Thất bại', color: 'text-red-600', bgColor: 'bg-red-100' },
  failed: { label: 'Lỗi', color: 'text-red-600', bgColor: 'bg-red-100' },
  unsubscribed: { label: 'Hủy ĐK', color: 'text-gray-600', bgColor: 'bg-gray-100' }
};

// Helper function to get campaign by ID
export const getCampaignById = (id: string): Campaign | undefined => {
  return MOCK_CAMPAIGNS.find(campaign => campaign.id === id);
};

// Helper function to get sender email by ID
export const getSenderEmailById = (id: string): SenderEmail | undefined => {
  return MOCK_SENDER_EMAILS.find(email => email.id === id);
};

// Default recipient filter
export const DEFAULT_RECIPIENT_FILTER = {
  labels: [],
  sources: [],
  statuses: [],
  date_range: null,
  exclude_sent_within_days: 7,
  exclude_unsubscribed: true,
  exclude_bounced: true
};

// ==================== REPORT DASHBOARD MOCK DATA (Task 10.5) ====================

import type { 
  EmailMarketingOverview, 
  ReportTrendDataPoint, 
  CampaignComparisonRow, 
  EmailFunnel, 
  StatusDistributionItem, 
  UnsubscribeEntry,
  ReportFilter 
} from './types';

// Email Benchmarks for rate coloring
export const EMAIL_BENCHMARKS = {
  delivery_rate: { good: 98, warning: 95 },
  open_rate: { good: 40, warning: 20 },
  click_rate: { good: 10, warning: 5 },
  bounce_rate: { good: 2, warning: 5 },        // inverted: lower is better
  unsubscribe_rate: { good: 0.5, warning: 1 }  // inverted: lower is better
};

// Chart Colors
export const CHART_COLORS = {
  sent: '#3B82F6',
  delivered: '#22C55E',
  opened: '#6366F1',
  clicked: '#F97316',
  bounced: '#EF4444',
  unsubscribed: '#F59E0B'
};

// Default Report Filter
export const DEFAULT_REPORT_FILTER: ReportFilter = {
  period: 'month',
  start_date: '2026-01-01',
  end_date: '2026-01-31',
  campaign_type: 'all',
  campaign_status: 'all'
};

// Mock Email Marketing Overview
export const MOCK_EMAIL_OVERVIEW: EmailMarketingOverview = {
  period: { 
    type: 'month', 
    from: '2026-01-01', 
    to: '2026-01-31', 
    label: 'Tháng 01/2026' 
  },
  total_campaigns: 12,
  total_sent: 1960,
  total_delivered: 1928,
  total_bounced: 32,
  total_opened: 858,
  total_clicked: 220,
  total_unsubscribed: 8,
  total_leads_generated: 15,
  // Flat rate properties for easy component access
  delivery_rate: 98.4,
  open_rate: 43.8,
  click_rate: 11.2,
  bounce_rate: 1.6,
  unsubscribe_rate: 0.4,
  // Flat trend properties for easy component access
  sent_trend: { value: 12.5, direction: 'up' },
  delivery_trend: { value: 13.1, direction: 'up' },
  open_trend: { value: 19.2, direction: 'up' },
  click_trend: { value: 18.3, direction: 'up' },
  bounce_trend: { value: -13.5, direction: 'down' },
  unsubscribe_trend: { value: 60.0, direction: 'up' }
};

// Mock Trend Data (January 2026)
export const MOCK_TREND_DATA: ReportTrendDataPoint[] = [
  { date: '2026-01-01', label: '01/01', sent: 0, delivered: 0, opened: 0, clicked: 0, bounced: 0, unsubscribed: 0 },
  { date: '2026-01-03', label: '03/01', sent: 45, delivered: 44, opened: 18, clicked: 4, bounced: 1, unsubscribed: 0 },
  { date: '2026-01-05', label: '05/01', sent: 120, delivered: 118, opened: 52, clicked: 12, bounced: 2, unsubscribed: 1 },
  { date: '2026-01-08', label: '08/01', sent: 85, delivered: 84, opened: 38, clicked: 9, bounced: 1, unsubscribed: 0 },
  { date: '2026-01-10', label: '10/01', sent: 195, delivered: 192, opened: 88, clicked: 24, bounced: 3, unsubscribed: 1 },
  { date: '2026-01-12', label: '12/01', sent: 156, delivered: 153, opened: 65, clicked: 18, bounced: 3, unsubscribed: 0 },
  { date: '2026-01-14', label: '14/01', sent: 280, delivered: 276, opened: 125, clicked: 35, bounced: 4, unsubscribed: 2 },
  { date: '2026-01-16', label: '16/01', sent: 485, delivered: 472, opened: 212, clicked: 58, bounced: 13, unsubscribed: 3 },
  { date: '2026-01-18', label: '18/01', sent: 78, delivered: 77, opened: 34, clicked: 8, bounced: 1, unsubscribed: 0 },
  { date: '2026-01-20', label: '20/01', sent: 145, delivered: 143, opened: 62, clicked: 15, bounced: 2, unsubscribed: 0 },
  { date: '2026-01-22', label: '22/01', sent: 98, delivered: 96, opened: 42, clicked: 11, bounced: 2, unsubscribed: 0 },
  { date: '2026-01-25', label: '25/01', sent: 125, delivered: 123, opened: 55, clicked: 14, bounced: 2, unsubscribed: 0 },
  { date: '2026-01-28', label: '28/01', sent: 95, delivered: 93, opened: 38, clicked: 8, bounced: 2, unsubscribed: 1 },
  { date: '2026-01-31', label: '31/01', sent: 53, delivered: 52, opened: 22, clicked: 5, bounced: 1, unsubscribed: 0 }
];

// Mock Campaign Comparison (synced with MOCK_CAMPAIGNS)
export const MOCK_CAMPAIGN_COMPARISON: CampaignComparisonRow[] = [
  {
    id: 'camp-001',
    campaign_name: 'Chiến dịch Tết 2026',
    type: 'normal',
    status: 'sent',
    sent_date: '2026-01-16',
    total_sent: 485,
    delivery_rate: 97.3,
    open_rate: 66.1,
    click_rate: 18.9,
    bounce_rate: 2.7,
    unsubscribe_count: 3
  },
  {
    id: 'camp-ab-001',
    campaign_name: '[A/B] Test tiêu đề - Sale cuối năm',
    type: 'ab',
    status: 'sent',
    sent_date: '2026-01-14',
    total_sent: 980,
    delivery_rate: 98.0,
    open_rate: 43.8,
    click_rate: 12.5,
    bounce_rate: 2.0,
    unsubscribe_count: 5
  },
  {
    id: 'camp-003',
    campaign_name: 'Welcome email tự động',
    type: 'normal',
    status: 'running',
    sent_date: '2026-01-31',
    total_sent: 97,
    delivery_rate: 97.9,
    open_rate: 47.4,
    click_rate: 12.6,
    bounce_rate: 2.1,
    unsubscribe_count: 0
  },
  {
    id: 'camp-004',
    campaign_name: 'Flash Sale cuối tuần',
    type: 'normal',
    status: 'paused',
    sent_date: '2026-01-29',
    total_sent: 180,
    delivery_rate: 97.2,
    open_rate: 56.0,
    click_rate: 19.4,
    bounce_rate: 2.8,
    unsubscribe_count: 1
  },
  {
    id: 'camp-002',
    campaign_name: 'Newsletter tháng 2',
    type: 'normal',
    status: 'scheduled',
    sent_date: '2026-02-05',
    total_sent: 0,
    delivery_rate: 0,
    open_rate: 0,
    click_rate: 0,
    bounce_rate: 0,
    unsubscribe_count: 0
  }
];

// Mock Email Funnel
export const MOCK_EMAIL_FUNNEL: EmailFunnel = {
  stages: [
    { key: 'sent', label: 'Gửi', count: 1960, rate: 100, color: '#3B82F6' },
    { key: 'delivered', label: 'Nhận', count: 1928, rate: 98.4, color: '#22C55E' },
    { key: 'opened', label: 'Mở', count: 858, rate: 43.8, color: '#6366F1' },
    { key: 'clicked', label: 'Click', count: 220, rate: 11.2, color: '#F97316' }
  ],
  overall_conversion: 11.2
};

// Mock Status Distribution
export const MOCK_STATUS_DISTRIBUTION: StatusDistributionItem[] = [
  { status: 'sent', label: 'Đã gửi', count: 5, percentage: 41.7, color: '#6B7280' },
  { status: 'running', label: 'Đang chạy', count: 2, percentage: 16.7, color: '#22C55E' },
  { status: 'scheduled', label: 'Đang chờ', count: 1, percentage: 8.3, color: '#F59E0B' },
  { status: 'draft', label: 'Nháp', count: 3, percentage: 25.0, color: '#3B82F6' },
  { status: 'cancelled', label: 'Đã hủy', count: 1, percentage: 8.3, color: '#EF4444' }
];

// Mock Unsubscribes
export const MOCK_UNSUBSCRIBES: UnsubscribeEntry[] = [
  {
    id: 'unsub-001',
    customer_id: 'cust-101',
    customer_name: 'Nguyễn Văn A',
    customer_email: 'nguyenvana@email.com',
    campaign_id: 'camp-001',
    campaign_name: 'Chiến dịch Tết 2026',
    unsubscribed_at: '2026-01-17T10:30:00Z',
    reason: 'Nhận quá nhiều email'
  },
  {
    id: 'unsub-002',
    customer_id: 'cust-102',
    customer_name: 'Trần Thị B',
    customer_email: 'tranthib@company.vn',
    campaign_id: 'camp-001',
    campaign_name: 'Chiến dịch Tết 2026',
    unsubscribed_at: '2026-01-17T14:15:00Z',
    reason: 'Nội dung không phù hợp'
  },
  {
    id: 'unsub-003',
    customer_id: 'cust-103',
    customer_name: 'Lê Văn C',
    customer_email: 'levanc@gmail.com',
    campaign_id: 'camp-001',
    campaign_name: 'Chiến dịch Tết 2026',
    unsubscribed_at: '2026-01-18T09:00:00Z',
    reason: null
  },
  {
    id: 'unsub-004',
    customer_id: 'cust-104',
    customer_name: 'Phạm Thị D',
    customer_email: 'phamthid@email.vn',
    campaign_id: 'camp-ab-001',
    campaign_name: '[A/B] Test tiêu đề - Sale cuối năm',
    unsubscribed_at: '2026-01-15T11:45:00Z',
    reason: 'Nhận quá nhiều email'
  },
  {
    id: 'unsub-005',
    customer_id: 'cust-105',
    customer_name: 'Hoàng Văn E',
    customer_email: 'hoangvane@company.vn',
    campaign_id: 'camp-ab-001',
    campaign_name: '[A/B] Test tiêu đề - Sale cuối năm',
    unsubscribed_at: '2026-01-15T16:30:00Z',
    reason: 'Không còn quan tâm'
  },
  {
    id: 'unsub-006',
    customer_id: 'cust-106',
    customer_name: 'Võ Thị F',
    customer_email: 'vothif@gmail.com',
    campaign_id: 'camp-ab-001',
    campaign_name: '[A/B] Test tiêu đề - Sale cuối năm',
    unsubscribed_at: '2026-01-14T20:00:00Z',
    reason: 'Nội dung không phù hợp'
  },
  {
    id: 'unsub-007',
    customer_id: 'cust-107',
    customer_name: 'Đặng Văn G',
    customer_email: 'dangvang@email.com',
    campaign_id: 'camp-ab-001',
    campaign_name: '[A/B] Test tiêu đề - Sale cuối năm',
    unsubscribed_at: '2026-01-16T08:20:00Z',
    reason: null
  },
  {
    id: 'unsub-008',
    customer_id: 'cust-108',
    customer_name: null,
    customer_email: 'anonymous@email.com',
    campaign_id: 'camp-ab-001',
    campaign_name: '[A/B] Test tiêu đề - Sale cuối năm',
    unsubscribed_at: '2026-01-16T12:00:00Z',
    reason: 'Nhận quá nhiều email'
  }
];

// Mock Unsubscribe Trend (weekly January 2026)
export const MOCK_UNSUBSCRIBE_TREND = [
  { date: '2026-01-W1', label: 'Tuần 1', count: 0 },
  { date: '2026-01-W2', label: 'Tuần 2', count: 2 },
  { date: '2026-01-W3', label: 'Tuần 3', count: 4 },
  { date: '2026-01-W4', label: 'Tuần 4', count: 1 },
  { date: '2026-01-W5', label: 'Tuần 5', count: 1 }
];

// Period Options
export const PERIOD_OPTIONS = [
  { value: 'week', label: 'Tuần này' },
  { value: 'month', label: 'Tháng này' },
  { value: 'quarter', label: 'Quý này' },
  { value: 'custom', label: 'Tùy chỉnh' }
];

// Trend Line Options
export const TREND_LINES = [
  { key: 'sent', label: 'Đã gửi', color: '#3B82F6', defaultVisible: true },
  { key: 'opened', label: 'Đã mở', color: '#22C55E', defaultVisible: true },
  { key: 'clicked', label: 'Đã click', color: '#F97316', defaultVisible: true }
];

// Interval Options
export const INTERVAL_OPTIONS = [
  { value: 'day', label: 'Theo ngày' },
  { value: 'week', label: 'Theo tuần' },
  { value: 'month', label: 'Theo tháng' }
];
