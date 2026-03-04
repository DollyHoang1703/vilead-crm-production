import {
  ChatShiftEmployee,
  ZaloAccountPermission,
  ChatShift,
  ChatShiftMember,
  ChatShiftSettings,
  EmployeeShiftAssignment,
  DEFAULT_SHIFT_SETTINGS,
} from '../types/chat-shift.types'

// Mock employees for chat shift system
export const MOCK_EMPLOYEES: ChatShiftEmployee[] = [
  {
    id: 'emp-1',
    name: 'Đỗ Đào Hải Long',
    email: 'long.ddh@company.com',
    phone: '0901234567',
    role: 'Sales',
    department: 'Kinh doanh',
    team: 'Team A',
    status: 'online',
  },
  {
    id: 'emp-2',
    name: 'Nguyễn Thị Nhi',
    email: 'nhi.nt@company.com',
    phone: '0901234568',
    role: 'Sales',
    department: 'Kinh doanh',
    team: 'Team A',
    status: 'online',
  },
  {
    id: 'emp-3',
    name: 'Thủy Dương',
    email: 'duong.t@company.com',
    phone: '0901234569',
    role: 'Support',
    department: 'CSKH',
    team: 'Team B',
    status: 'offline',
  },
  {
    id: 'emp-4',
    name: 'Trần Hà My',
    email: 'my.th@company.com',
    phone: '0901234570',
    role: 'Sales Manager',
    department: 'Kinh doanh',
    team: 'Team B',
    status: 'online',
  },
  {
    id: 'emp-5',
    name: 'Hoàng Chính Nghĩa',
    email: 'chinhnghia1703@gmail.com',
    phone: '0901234571',
    role: 'Admin',
    department: 'Quản trị',
    team: '',
    status: 'online',
  },
  {
    id: 'emp-6',
    name: 'Lê Văn Minh',
    email: 'minh.lv@company.com',
    phone: '0901234572',
    role: 'Support',
    department: 'CSKH',
    team: 'Team A',
    status: 'busy',
  },
  {
    id: 'emp-7',
    name: 'Phạm Thu Hằng',
    email: 'hang.pt@company.com',
    phone: '0901234573',
    role: 'Sales',
    department: 'Kinh doanh',
    team: 'Team A',
    status: 'online',
  },
  {
    id: 'emp-8',
    name: 'Vũ Đức Anh',
    email: 'anh.vd@company.com',
    phone: '0901234574',
    role: 'Sales',
    department: 'Kinh doanh',
    team: 'Team B',
    status: 'offline',
  },
]

// Mock permissions for CRM Funnel account (account-1)
export const MOCK_PERMISSIONS: ZaloAccountPermission[] = [
  {
    id: 'perm-1',
    zalo_connection_id: 'account-1',
    user_id: 'emp-5',
    permission_level: 'admin',
    created_at: '2026-01-15T08:00:00Z',
  },
  {
    id: 'perm-2',
    zalo_connection_id: 'account-1',
    user_id: 'emp-1',
    permission_level: 'member',
    created_at: '2026-01-15T08:00:00Z',
  },
  {
    id: 'perm-3',
    zalo_connection_id: 'account-1',
    user_id: 'emp-2',
    permission_level: 'member',
    created_at: '2026-01-15T08:00:00Z',
  },
  {
    id: 'perm-4',
    zalo_connection_id: 'account-1',
    user_id: 'emp-3',
    permission_level: 'member',
    created_at: '2026-01-16T09:00:00Z',
  },
  {
    id: 'perm-5',
    zalo_connection_id: 'account-1',
    user_id: 'emp-4',
    permission_level: 'member',
    created_at: '2026-01-16T09:00:00Z',
  },
  {
    id: 'perm-6',
    zalo_connection_id: 'account-1',
    user_id: 'emp-6',
    permission_level: 'none',
    created_at: '2026-01-17T10:00:00Z',
  },
  {
    id: 'perm-7',
    zalo_connection_id: 'account-1',
    user_id: 'emp-7',
    permission_level: 'member',
    created_at: '2026-01-18T11:00:00Z',
  },
  {
    id: 'perm-8',
    zalo_connection_id: 'account-1',
    user_id: 'emp-8',
    permission_level: 'none',
    created_at: '2026-01-18T11:00:00Z',
  },
]

// Mock shifts for CRM Funnel account
export const MOCK_SHIFTS: ChatShift[] = [
  {
    id: 'shift-1',
    zalo_connection_id: 'account-1',
    name: 'Ca sáng',
    start_time: '08:00',
    end_time: '12:00',
    days_of_week: [2, 3, 4, 5, 6],
    is_overnight: false,
    status: 'active',
    created_at: '2026-01-15T08:00:00Z',
  },
  {
    id: 'shift-2',
    zalo_connection_id: 'account-1',
    name: 'Ca chiều',
    start_time: '13:00',
    end_time: '17:00',
    days_of_week: [2, 3, 4, 5, 6],
    is_overnight: false,
    status: 'active',
    created_at: '2026-01-15T08:00:00Z',
  },
  {
    id: 'shift-3',
    zalo_connection_id: 'account-1',
    name: 'Ca tối',
    start_time: '18:00',
    end_time: '22:00',
    days_of_week: [2, 3, 4, 5, 6, 7],
    is_overnight: false,
    status: 'active',
    created_at: '2026-01-15T08:00:00Z',
  },
  {
    id: 'shift-4',
    zalo_connection_id: 'account-1',
    name: 'Ca đêm',
    start_time: '22:00',
    end_time: '06:00',
    days_of_week: [6, 7, 1],
    is_overnight: true,
    status: 'inactive',
    created_at: '2026-01-16T08:00:00Z',
  },
]

// Mock shift members (junction)
export const MOCK_SHIFT_MEMBERS: ChatShiftMember[] = [
  // Ca sáng - emp-1, emp-2
  { id: 'sm-1', shift_id: 'shift-1', user_id: 'emp-1' },
  { id: 'sm-2', shift_id: 'shift-1', user_id: 'emp-2' },
  // Ca chiều - emp-3, emp-4
  { id: 'sm-3', shift_id: 'shift-2', user_id: 'emp-3' },
  { id: 'sm-4', shift_id: 'shift-2', user_id: 'emp-4' },
  // Ca tối - emp-1, emp-7
  { id: 'sm-5', shift_id: 'shift-3', user_id: 'emp-1' },
  { id: 'sm-6', shift_id: 'shift-3', user_id: 'emp-7' },
]

// Mock shift settings
export const MOCK_SHIFT_SETTINGS: ChatShiftSettings = {
  id: 'settings-1',
  zalo_connection_id: 'account-1',
  ...DEFAULT_SHIFT_SETTINGS,
  updated_at: '2026-02-01T10:00:00Z',
}

// Helper: Get employee shifts
export const getEmployeeShifts = (userId: string, zaloConnectionId: string): ChatShift[] => {
  const memberShiftIds = MOCK_SHIFT_MEMBERS
    .filter(sm => sm.user_id === userId)
    .map(sm => sm.shift_id)
  
  return MOCK_SHIFTS.filter(
    s => memberShiftIds.includes(s.id) && s.zalo_connection_id === zaloConnectionId
  )
}

// Helper: Get employee assigned days (derived from shifts)
export const getEmployeeAssignedDays = (userId: string, zaloConnectionId: string): number[] => {
  const shifts = getEmployeeShifts(userId, zaloConnectionId)
  const days = new Set<number>()
  shifts.forEach(shift => {
    shift.days_of_week.forEach(day => days.add(day))
  })
  return Array.from(days).sort((a, b) => a - b)
}

// Helper: Get full employee shift assignments for a Zalo account
export const getEmployeeShiftAssignments = (zaloConnectionId: string): EmployeeShiftAssignment[] => {
  const permissions = MOCK_PERMISSIONS.filter(p => p.zalo_connection_id === zaloConnectionId)
  
  return permissions.map(perm => {
    const employee = MOCK_EMPLOYEES.find(e => e.id === perm.user_id)
    if (!employee) return null
    
    const shifts = getEmployeeShifts(perm.user_id, zaloConnectionId)
    const assignedDays = getEmployeeAssignedDays(perm.user_id, zaloConnectionId)
    
    return {
      employee,
      permission_level: perm.permission_level,
      shifts,
      assigned_days: assignedDays,
    }
  }).filter(Boolean) as EmployeeShiftAssignment[]
}

// Helper: Get permission for a user on a Zalo account
export const getPermission = (userId: string, zaloConnectionId: string): ZaloAccountPermission | undefined => {
  return MOCK_PERMISSIONS.find(
    p => p.user_id === userId && p.zalo_connection_id === zaloConnectionId
  )
}

// Helper: Format time display
export const formatShiftTime = (startTime: string, endTime: string): string => {
  return `${startTime} - ${endTime}`
}

// Initial state generator for a new Zalo account
export const generateInitialPermissions = (
  zaloConnectionId: string,
  ownerId: string
): ZaloAccountPermission[] => {
  return MOCK_EMPLOYEES.map((emp, idx) => ({
    id: `perm-new-${idx}`,
    zalo_connection_id: zaloConnectionId,
    user_id: emp.id,
    permission_level: emp.id === ownerId ? 'admin' : 'none',
    created_at: new Date().toISOString(),
  }))
}
