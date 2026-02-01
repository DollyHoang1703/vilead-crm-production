// ==================== UTILITY FUNCTIONS FOR EMAIL MARKETING ====================
// Based on TASK_10_1_CAU_HINH_EMAIL.md specification

// Email validation
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Check personal email domains
export function isPersonalEmail(email: string): boolean {
  const personalDomains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'icloud.com'];
  const domain = email.split('@')[1]?.toLowerCase();
  return personalDomains.includes(domain);
}

// Format date
export function formatDate(date: Date | string, format: string = 'DD/MM/YYYY'): string {
  const d = new Date(date);
  const day = d.getDate().toString().padStart(2, '0');
  const month = (d.getMonth() + 1).toString().padStart(2, '0');
  const year = d.getFullYear();
  const hours = d.getHours().toString().padStart(2, '0');
  const minutes = d.getMinutes().toString().padStart(2, '0');
  
  switch (format) {
    case 'DD/MM/YYYY':
      return `${day}/${month}/${year}`;
    case 'DD/MM/YYYY HH:mm':
      return `${day}/${month}/${year} ${hours}:${minutes}`;
    default:
      return `${day}/${month}/${year}`;
  }
}

// Format date time (DD/MM/YYYY HH:mm)
export function formatDateTime(date: Date | string): string {
  return formatDate(date, 'DD/MM/YYYY HH:mm');
}

// Format time remaining
export function formatTimeRemaining(targetDate: Date): string {
  const now = new Date();
  const diff = targetDate.getTime() - now.getTime();
  
  if (diff <= 0) return 'Đã hết hạn';
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  
  if (days > 0) {
    return `${days} ngày`;
  } else if (hours > 0) {
    return `${hours} giờ ${minutes} phút`;
  } else {
    return `${minutes} phút`;
  }
}

// Generate unique ID
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Check if user has permission to use sender email
export function hasPermissionToUse(
  senderEmail: { permission_type: string; permitted_user_ids: string[]; created_by: string },
  userId: string
): boolean {
  switch (senderEmail.permission_type) {
    case 'all':
      return true;
    case 'me':
      return senderEmail.created_by === userId;
    case 'specific':
      return senderEmail.permitted_user_ids.includes(userId);
    default:
      return false;
  }
}

// Get progress bar color based on percentage
export function getProgressColor(percentage: number): string {
  if (percentage >= 90) return 'bg-red-500';
  if (percentage >= 80) return 'bg-yellow-500';
  return 'bg-green-500';
}

// Status configurations
export const STATUS_CONFIG = {
  activated: {
    label: 'Đã kích hoạt',
    color: 'bg-green-100 text-green-800',
    dotColor: 'bg-green-500'
  },
  pending: {
    label: 'Chờ xác thực',
    color: 'bg-yellow-100 text-yellow-800',
    dotColor: 'bg-yellow-500'
  },
  domain_unverified: {
    label: 'Domain chưa xác thực',
    color: 'bg-red-100 text-red-800',
    dotColor: 'bg-red-500'
  },
  disabled: {
    label: 'Đã vô hiệu hóa',
    color: 'bg-gray-100 text-gray-800',
    dotColor: 'bg-gray-500'
  }
} as const;

// Permission type labels
export const PERMISSION_LABELS = {
  all: 'Toàn bộ thành viên dự án',
  me: 'Chỉ tôi',
  specific: 'Thành viên cụ thể'
} as const;
