// ======================================================
// MODULE 4.13.1: LUỒNG TIN NHẮN – CONSTANTS (Botcake Style)
// ======================================================

export const NODE_TYPES_CONST = {
  START: 'start',
  TEXT: 'text',
  IMAGE: 'image',
  VIDEO: 'video',
  AUDIO: 'audio',
  FILE: 'file',
  CAROUSEL: 'carousel',
  BUTTONS: 'buttons',
  QUICK_REPLY: 'quick_reply',
  WAIT_RESPONSE: 'wait_response',
  CONDITION: 'condition',
  RANDOM: 'random',
  DELAY: 'delay',
  ACTION: 'action',
} as const;

// Botcake-style node color accents
export const NODE_COLOR: Record<string, string> = {
  start:         '#3B82F6',
  text:          '#6B7280',
  image:         '#6B7280',
  video:         '#6B7280',
  audio:         '#6B7280',
  file:          '#6B7280',
  carousel:      '#6B7280',
  buttons:       '#6B7280',
  quick_reply:   '#6B7280',
  wait_response: '#6B7280',
  condition:     '#4F46E5',
  random:        '#3B82F6',
  delay:         '#F59E0B',
  action:        '#F59E0B',
};

// Light bg for node icon container (Botcake style)
export const NODE_ICON_BG: Record<string, string> = {
  start:         '#EFF6FF',
  text:          '#F3F4F6',
  image:         '#F3F4F6',
  video:         '#F3F4F6',
  audio:         '#F3F4F6',
  file:          '#F3F4F6',
  carousel:      '#F3F4F6',
  buttons:       '#F3F4F6',
  quick_reply:   '#F3F4F6',
  wait_response: '#F3F4F6',
  condition:     '#EEF2FF',
  random:        '#EFF6FF',
  delay:         '#FFFBEB',
  action:        '#FFFBEB',
};

export const NODE_LABEL: Record<string, string> = {
  start:         'Bắt đầu',
  text:          'Nội dung',
  image:         'Nội dung',
  video:         'Nội dung',
  audio:         'Nội dung',
  file:          'Nội dung',
  carousel:      'Nội dung',
  buttons:       'Nội dung',
  quick_reply:   'Nội dung',
  wait_response: 'Nội dung',
  condition:     'Điều kiện',
  random:        'Ngẫu nhiên',
  delay:         'Smart Delay',
  action:        'Hành động',
};

export const NODE_CATEGORIES = [
  {
    id: 'content',
    label: 'Nội dung',
    nodes: [
      { type: 'text',     label: 'Văn bản',     icon: 'MessageSquare', description: 'Gửi tin nhắn văn bản' },
      { type: 'image',    label: 'Hình ảnh',    icon: 'Image',         description: 'Gửi ảnh' },
      { type: 'video',    label: 'Video',        icon: 'Video',         description: 'Gửi video' },
      { type: 'audio',    label: 'Audio',        icon: 'Mic',           description: 'Gửi file âm thanh' },
      { type: 'file',     label: 'File',         icon: 'Paperclip',     description: 'Gửi tài liệu' },
      { type: 'carousel', label: 'Bộ sưu tập',  icon: 'LayoutGrid',    description: 'Gửi nhiều thẻ hình ảnh' },
      { type: 'buttons',       label: 'Nút bấm',       icon: 'MousePointerClick', description: 'Thêm các nút lựa chọn' },
      { type: 'quick_reply',   label: 'Trả lời nhanh', icon: 'MessageCircle',     description: 'Câu trả lời gợi ý' },
      { type: 'wait_response', label: 'Chờ phản hồi',  icon: 'Clock',             description: 'Đợi khách hàng nhắn' },
    ],
  },
  {
    id: 'logic',
    label: 'Logic',
    nodes: [
      { type: 'condition', label: 'Điều kiện',  icon: 'GitBranch', description: 'Rẽ nhánh theo điều kiện' },
      { type: 'random',    label: 'Ngẫu nhiên', icon: 'Shuffle',   description: 'Phân tán ngẫu nhiên' },
    ],
  },
  {
    id: 'timing_action',
    label: 'Hệ thống',
    nodes: [
      { type: 'delay',  label: 'Smart Delay', icon: 'Timer', description: 'Dừng và đợi trước khi tiếp tục' },
      { type: 'action', label: 'Hành động',   icon: 'Zap',   description: 'Tag, task, kịch bản, v.v.' },
    ],
  },
];

// Next step picker options (Botcake style popup)
export const NEXT_STEP_OPTIONS = [
  { id: 'select_message', label: 'Chọn tin nhắn',        icon: 'MessageSquare', description: 'Chọn một khối tin nhắn',         color: '#6B7280' },
  { id: 'action',         label: 'Hành động',            icon: 'Zap',           description: 'Thêm các hành động cho Bot',     color: '#F59E0B' },
  { id: 'ai',             label: 'AI',                   icon: 'Sparkles',      description: 'Áp dụng AI để tạo câu trả lời',  color: '#EC4899' },
  { id: 'delay',          label: 'Smart Delay',          icon: 'Clock',         description: 'Thiết lập thời gian phản hồi',   color: '#F59E0B' },
  { id: 'condition',      label: 'Điều kiện',            icon: 'GitBranch',     description: 'Rẽ nhánh theo điều kiện',        color: '#4F46E5' },
  { id: 'random',         label: 'Ngẫu nhiên',           icon: 'Shuffle',       description: 'Phân tán ngẫu nhiên',            color: '#3B82F6' },
];

export const ACTION_TYPES = [
  { value: 'add_tag',              label: 'Thêm Thẻ',           icon: 'Tag',         group: 'Tag' },
  { value: 'remove_tag',           label: 'Gỡ Thẻ',             icon: 'TagOff',      group: 'Tag' },
  { value: 'subscribe_sequence',   label: 'Đăng ký theo dõi kịch bản',  icon: 'UserPlus',  group: 'Kịch bản' },
  { value: 'unsubscribe_sequence', label: 'Hủy đăng ký theo dõi kịch bản', icon: 'UserMinus', group: 'Kịch bản' },
  { value: 'resume_bot',           label: 'Bật Bot',            icon: 'PlayCircle',  group: 'Thao tác với Bot' },
  { value: 'pause_bot',            label: 'Tạm dừng Bot',       icon: 'PauseCircle', group: 'Thao tác với Bot' },
  { value: 'create_task',          label: 'Tạo Công việc',      icon: 'CheckSquare', group: 'Tác vụ' },
  { value: 'create_reminder',      label: 'Tạo Nhắc nhở',       icon: 'Bell',        group: 'Tác vụ' },
];

export const CONDITION_FIELDS = [
  { value: 'tags',            label: 'Thẻ',              type: 'multi',  group: 'Thông tin' },
  { value: 'customer_gender', label: 'Giới tính',        type: 'enum',   group: 'Thông tin', options: [{ value:'male',label:'Nam' },{ value:'female',label:'Nữ' },{ value:'unknown',label:'Không rõ' }] },
  { value: 'last_name',       label: 'Họ',               type: 'string', group: 'Thông tin' },
  { value: 'first_name',      label: 'Tên',              type: 'string', group: 'Thông tin' },
  { value: 'customer_phone',  label: 'Số điện thoại',    type: 'string', group: 'Thông tin' },
  { value: 'customer_email',  label: 'Email',            type: 'string', group: 'Thông tin' },
  { value: 'psid',            label: 'PSID',             type: 'string', group: 'Thông tin' },
  { value: 'customer_name',   label: 'Tên đầy đủ',       type: 'string', group: 'Thông tin' },
  { value: 'channel',         label: 'Kênh',             type: 'enum',   group: 'Hệ thống', options: [{ value:'zalo_oa',label:'Zalo OA' },{ value:'facebook',label:'Facebook' }] },
  { value: 'day_of_week',     label: 'Ngày trong tuần',  type: 'multi',  group: 'Hệ thống', options: [{ value:'0',label:'CN' },{ value:'1',label:'Thứ 2' },{ value:'2',label:'Thứ 3' },{ value:'3',label:'Thứ 4' },{ value:'4',label:'Thứ 5' },{ value:'5',label:'Thứ 6' },{ value:'6',label:'Thứ 7' }] },
  { value: 'hour',            label: 'Giờ',              type: 'range',  group: 'Hệ thống', min: 0, max: 23 },
];

export const CONDITION_OPERATORS_BY_TYPE: Record<string, Array<{ value: string; label: string }>> = {
  string: [
    { value: 'contains',      label: 'Chứa' },
    { value: 'not_contains',  label: 'Không chứa' },
    { value: 'equals',        label: 'Bằng' },
    { value: 'not_equals',    label: 'Không bằng' },
    { value: 'starts_with',   label: 'Bắt đầu bằng' },
    { value: 'ends_with',     label: 'Kết thúc bằng' },
    { value: 'is_empty',      label: 'Trống' },
    { value: 'is_not_empty',  label: 'Không trống' },
  ],
  enum: [
    { value: 'equals',     label: 'Là' },
    { value: 'not_equals', label: 'Không là' },
  ],
  multi: [
    { value: 'in',     label: 'Có bất kỳ' },
    { value: 'not_in', label: 'Không có' },
  ],
  range: [
    { value: 'equals',     label: 'Bằng' },
    { value: 'not_equals', label: 'Khác' },
  ],
};

export const TEMPLATE_VARIABLES = [
  { key: 'ten_khach_hang',      label: 'Tên đầy đủ',         example: 'Nguyễn Văn A' },
  { key: 'ho',                  label: 'Họ',                  example: 'Nguyễn' },
  { key: 'ten',                 label: 'Tên',                 example: 'A' },
  { key: 'so_dien_thoai',       label: 'Số điện thoại',      example: '0901234567' },
  { key: 'email',               label: 'Email',               example: 'a@example.com' },
  { key: 'nhan_vien_phu_trach', label: 'Nhân viên phụ trách',example: 'Trần B' },
  { key: 'ten_cong_ty',         label: 'Tên công ty',         example: 'ABC Corp' },
  { key: 'ngay_hien_tai',       label: 'Ngày hiện tại',      example: '07/04/2026' },
];

export const FILE_CONSTRAINTS = {
  image: { maxSize: 5 * 1024 * 1024, accept: 'image/jpeg,image/png,image/gif', ext: '.jpg,.jpeg,.png,.gif', label: 'JPG, PNG, GIF tối đa 5MB' },
  video: { maxSize: 15 * 1024 * 1024, accept: 'video/mp4,video/quicktime', ext: '.mp4,.mov', label: 'MP4, MOV tối đa 15MB' },
  audio: { maxSize: 10 * 1024 * 1024, accept: 'audio/mpeg,audio/wav,audio/ogg', ext: '.mp3,.wav,.ogg', label: 'MP3, WAV, OGG tối đa 10MB' },
  file:  { maxSize: 10 * 1024 * 1024, accept: '*/*', ext: '*', label: 'Tối đa 10MB' },
};

// Botcake canvas node dimensions
export const NODE_WIDTH  = 260;
export const NODE_HEIGHT = 120; // variable, used as min

// Mock folders
export const MOCK_FOLDERS = [
  { id: '00000000-0000-0000-0000-000000000001', name: 'Chưa phân loại', flowCount: 4, position: 0, isDefault: true },
  { id: 'f2', name: 'Marketing', flowCount: 8, position: 1 },
  { id: 'f3', name: 'Sales', flowCount: 5, position: 2 },
  { id: 'f4', name: 'Support', flowCount: 3, position: 3 },
  { id: 'f5', name: 'Chăm sóc KH', flowCount: 5, position: 4 },
];

// Mock flows
export const MOCK_FLOWS = [
  { id: 'flow1', name: 'Chào mừng KH mới', shortcut: '/chao', folder: { id: 'f2', name: 'Marketing' }, status: 'published' as const, usedByCount: 3, updatedAt: '2026-04-07T10:00:00Z', createdBy: { id: 'u1', name: 'Admin' } },
  { id: 'flow2', name: 'Xác nhận đơn hàng', shortcut: '/xacnhan', folder: { id: 'f3', name: 'Sales' }, status: 'published' as const, usedByCount: 1, updatedAt: '2026-04-06T08:30:00Z', createdBy: { id: 'u1', name: 'Admin' } },
  { id: 'flow3', name: 'Hỏi feedback sản phẩm', shortcut: '/fb', folder: { id: 'f4', name: 'Support' }, status: 'published' as const, usedByCount: 0, updatedAt: '2026-04-05T14:00:00Z', createdBy: { id: 'u1', name: 'Admin' } },
  { id: 'flow4', name: 'Test automation flow', shortcut: null, folder: { id: '00000000-0000-0000-0000-000000000001', name: 'Chưa phân loại' }, status: 'draft' as const, usedByCount: 0, updatedAt: '2026-04-07T22:00:00Z', createdBy: { id: 'u1', name: 'Admin' } },
  { id: 'flow5', name: 'Upsell sản phẩm Premium', shortcut: '/upsell', folder: { id: 'f2', name: 'Marketing' }, status: 'published' as const, usedByCount: 2, updatedAt: '2026-04-04T09:00:00Z', createdBy: { id: 'u1', name: 'Admin' } },
  { id: 'flow6', name: 'Nhắc nhở gia hạn dịch vụ', shortcut: '/gahan', folder: { id: 'f5', name: 'Chăm sóc KH' }, status: 'draft' as const, usedByCount: 0, updatedAt: '2026-04-03T16:00:00Z', createdBy: { id: 'u1', name: 'Admin' } },
  { id: 'flow7', name: 'Hướng dẫn sử dụng sản phẩm', shortcut: '/hdsd', folder: { id: 'f4', name: 'Support' }, status: 'published' as const, usedByCount: 4, updatedAt: '2026-04-02T11:00:00Z', createdBy: { id: 'u1', name: 'Admin' } },
  { id: 'flow8', name: 'Thu thập thông tin KH tiềm năng', shortcut: '/ttien', folder: { id: 'f3', name: 'Sales' }, status: 'draft' as const, usedByCount: 0, updatedAt: '2026-04-01T09:30:00Z', createdBy: { id: 'u1', name: 'Admin' } },
];
