import { Facebook, MessageCircle, Search, FileText } from "lucide-react";

export const LEAD_SOURCES = [
  { value: "facebook", label: "Facebook", icon: Facebook },
  { value: "zalo", label: "Zalo", icon: MessageCircle },
  { value: "google_ads", label: "Google Ads", icon: Search },
  { value: "manual", label: "Nhập thủ công", icon: FileText },
];

export const LEAD_STATUSES = [
  { value: "new", label: "Mới" },
  { value: "contacted", label: "Đã liên hệ" },
  { value: "potential", label: "Tiềm năng" },
  { value: "not_interested", label: "Không quan tâm" },
];

export const REGIONS = [
  { value: "ha_noi", label: "Hà Nội" },
  { value: "ho_chi_minh", label: "TP. Hồ Chí Minh" },
  { value: "da_nang", label: "Đà Nẵng" },
  { value: "mien_bac", label: "Miền Bắc" },
  { value: "mien_trung", label: "Miền Trung" },
  { value: "mien_nam", label: "Miền Nam" },
];

// Demo data for Team A (Leader role)
export const TEAM_A_MEMBERS = [
  { value: "leader_a", label: "Nguyễn Văn Anh (Leader)", role: "leader" },
  { value: "sale_a1", label: "Trần Thị Bình", role: "sale" },
  { value: "sale_a2", label: "Lê Văn Cường", role: "sale" },
  { value: "sale_a3", label: "Phạm Thị Dung", role: "sale" },
];

export const ALL_SALES_USERS = [
  // Team A
  ...TEAM_A_MEMBERS,
  // Team B (for demo - not accessible by Leader)
  { value: "leader_b", label: "Hoàng Thị Lan (Leader)", role: "leader" },
  { value: "sale_b1", label: "Ngô Văn Minh", role: "sale" },
  { value: "sale_b2", label: "Đỗ Thị Nga", role: "sale" },
];

export const LEAD_STAGES = [
  { value: "reception", label: "Tiếp nhận" },
  { value: "consulting", label: "Tư vấn" },
  { value: "quoted", label: "Báo giá" },
  { value: "negotiating", label: "Đàm phán" },
  { value: "closed", label: "Chốt Deal" },
];

export const ORDER_STATUSES = [
  { value: "pending", label: "Chờ xử lý" },
  { value: "confirmed", label: "Đã xác nhận" },
  { value: "processing", label: "Đang xử lý" },
  { value: "shipped", label: "Đã giao" },
  { value: "delivered", label: "Hoàn thành" },
  { value: "cancelled", label: "Đã hủy" },
];

export const TASK_TYPES = [
  { value: "call", label: "Gọi điện" },
  { value: "email", label: "Gửi email" },
  { value: "meeting", label: "Họp mặt" },
  { value: "follow_up", label: "Theo dõi" },
];

export const TASK_PRIORITIES = [
  { value: "low", label: "Thấp" },
  { value: "medium", label: "Trung bình" },
  { value: "high", label: "Cao" },
  { value: "urgent", label: "Khẩn cấp" },
];

export const TASK_STATUSES = [
  { value: "pending", label: "Chờ xử lý" },
  { value: "in_progress", label: "Đang thực hiện" },
  { value: "completed", label: "Hoàn thành" },
  { value: "cancelled", label: "Đã hủy" },
];

export const USER_ROLES = [
  { value: "admin", label: "Quản trị viên" },
  { value: "sales", label: "Sales" },
  { value: "support", label: "Hỗ trợ" },
];

export const ACTIVITY_TYPES = [
  { value: "lead_created", label: "Tạo lead mới" },
  { value: "lead_assigned", label: "Phân bổ lead" },
  { value: "stage_changed", label: "Thay đổi giai đoạn" },
  { value: "order_created", label: "Tạo đơn hàng" },
  { value: "task_completed", label: "Hoàn thành nhiệm vụ" },
  { value: "email_sent", label: "Gửi email" },
];

export const AUTOMATION_TRIGGERS = [
  { value: "lead_created", label: "Lead mới được tạo" },
  { value: "lead_assigned", label: "bổ" },
  { value: "stage_changed", label: "Thay đổi giai đoạn" },
  { value: "order_created", label: "Đơn hàng mới" },
];

export const AUTOMATION_ACTIONS = [
  { value: "send_email", label: "Gửi email" },
  { value: "send_notification", label: "Gửi thông báo" },
  { value: "assign_lead", label: "Phân bổ lead" },
  { value: "create_task", label: "Tạo nhiệm vụ" },
];
