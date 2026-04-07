// Types for Chat Shift Scheduling - Phân ca trực Chat

// Employee in the chat shift system
export interface ChatShiftEmployee {
  id: string
  name: string
  email: string
  phone?: string
  avatar?: string
  role: string
  department?: string
  team?: string
  status: 'online' | 'offline' | 'busy'
}

// Permission level for Zalo account access
export type PermissionLevel = 'admin' | 'member' | 'none'

// Permission assignment for an employee on a Zalo account
export interface ZaloAccountPermission {
  id: string
  zalo_connection_id: string
  user_id: string
  permission_level: PermissionLevel
  created_at?: string
  updated_at?: string
  created_by?: string
}

// Shift definition
export interface ChatShift {
  id: string
  zalo_connection_id: string
  name: string
  start_time: string  // HH:mm format
  end_time: string    // HH:mm format
  days_of_week: number[]  // 1=Mon, 2=Tue, ..., 7=Sun
  is_overnight: boolean
  status: 'active' | 'inactive'
  created_at?: string
  updated_at?: string
  created_by?: string
}

// Junction table: Employee assigned to a shift
export interface ChatShiftMember {
  id: string
  shift_id: string
  user_id: string
  created_at?: string
  created_by?: string
}

// Settings for shift scheduling
export interface ChatShiftSettings {
  id: string
  zalo_connection_id: string
  max_conversations: number
  shift_buffer_minutes: number
  queue_alert_threshold: number
  updated_at?: string
  updated_by?: string
}

// Queue item for conversations waiting to be assigned
export interface ChatQueueItem {
  id: string
  conversation_id: string
  zalo_connection_id: string
  status: 'pending' | 'assigned' | 'expired'
  queued_at: string
  assigned_at?: string
  assigned_to?: string
}

// Employee shift assignment view (for UI display)
export interface EmployeeShiftAssignment {
  employee: ChatShiftEmployee
  permission_level: PermissionLevel
  shifts: ChatShift[]
  assigned_days: number[]  // Derived from shifts
  useShiftScheduling?: boolean  // true = use shifts, false = full-time access (all days)
}

// Day of week mapping
export const DAYS_OF_WEEK = [
  { value: 2, label: '2', fullLabel: 'Thứ 2' },
  { value: 3, label: '3', fullLabel: 'Thứ 3' },
  { value: 4, label: '4', fullLabel: 'Thứ 4' },
  { value: 5, label: '5', fullLabel: 'Thứ 5' },
  { value: 6, label: '6', fullLabel: 'Thứ 6' },
  { value: 7, label: '7', fullLabel: 'Thứ 7' },
  { value: 1, label: 'CN', fullLabel: 'Chủ nhật' },
]

// Permission level options for dropdown
export const PERMISSION_LEVEL_OPTIONS = [
  { value: 'admin', label: 'Chủ sở hữu', description: 'Quản lý tài khoản' },
  { value: 'member', label: 'Truy cập', description: 'Phải có ca trực mới nhận chat' },
  { value: 'none', label: 'Không được truy cập', description: 'Không thể xem tài khoản này' },
] as const

// Default shift settings
export const DEFAULT_SHIFT_SETTINGS: Omit<ChatShiftSettings, 'id' | 'zalo_connection_id'> = {
  max_conversations: 20,
  shift_buffer_minutes: 15,
  queue_alert_threshold: 5,
}
