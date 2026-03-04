'use client'

import React, { useState, useCallback, useMemo } from 'react'
import { X, Users, Calendar, History } from 'lucide-react'
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog'
import { cn } from '@/lib/utils'
import { PermissionTab } from './PermissionTab'
import { ShiftTab } from './ShiftTab'
import {
  ChatShiftEmployee,
  ZaloAccountPermission,
  ChatShift,
  ChatShiftMember,
  PermissionLevel,
  EmployeeShiftAssignment,
} from '../settings/types/chat-shift.types'
import {
  MOCK_EMPLOYEES,
  MOCK_PERMISSIONS,
  MOCK_SHIFTS,
  MOCK_SHIFT_MEMBERS,
  getEmployeeShiftAssignments,
} from '../settings/data/chat-shift.data'

// Mock: User đang đăng nhập (trong thực tế lấy từ auth context)
const CURRENT_USER_ID = 'emp-1'  // Đỗ Đào Hải Long

interface ChatShiftPermissionModalProps {
  isOpen: boolean
  onClose: () => void
  accountId: string
  accountName: string
  accountType?: 'zalo-personal' | 'zalo-oa' | 'facebook'
  defaultTab?: 'permission' | 'shift' | 'history'
}

type TabType = 'permission' | 'shift' | 'history'

export function ChatShiftPermissionModal({
  isOpen,
  onClose,
  accountId,
  accountName,
  accountType = 'facebook',
  defaultTab = 'permission',
}: ChatShiftPermissionModalProps) {
  const [activeTab, setActiveTab] = useState<TabType>(defaultTab)
  
  // Local state for permissions (mock data)
  // Đảm bảo user đang đăng nhập được set là admin mặc định
  const [permissions, setPermissions] = useState<ZaloAccountPermission[]>(() => {
    const hasAdmin = MOCK_PERMISSIONS.some(
      p => p.zalo_connection_id === accountId && p.permission_level === 'admin'
    )
    if (!hasAdmin) {
      // Tự động set user đang đăng nhập là admin
      return [
        ...MOCK_PERMISSIONS,
        {
          id: `perm-default-admin-${Date.now()}`,
          zalo_connection_id: accountId,
          user_id: CURRENT_USER_ID,
          permission_level: 'admin' as PermissionLevel,
          created_at: new Date().toISOString(),
        },
      ]
    }
    return MOCK_PERMISSIONS
  })
  const [shifts, setShifts] = useState<ChatShift[]>(MOCK_SHIFTS)
  const [shiftMembers, setShiftMembers] = useState<ChatShiftMember[]>(MOCK_SHIFT_MEMBERS)

  // Get employee shift assignments
  const assignments = useMemo((): EmployeeShiftAssignment[] => {
    return MOCK_EMPLOYEES.map(emp => {
      const perm = permissions.find(
        p => p.user_id === emp.id && p.zalo_connection_id === accountId
      )
      const memberShiftIds = shiftMembers
        .filter(sm => sm.user_id === emp.id)
        .map(sm => sm.shift_id)
      const empShifts = shifts.filter(
        s => memberShiftIds.includes(s.id) && s.zalo_connection_id === accountId
      )
      const assignedDays = new Set<number>()
      empShifts.forEach(s => s.days_of_week.forEach(d => assignedDays.add(d)))

      return {
        employee: emp,
        permission_level: perm?.permission_level || 'none',
        shifts: empShifts,
        assigned_days: Array.from(assignedDays).sort((a, b) => a - b),
      }
    })
  }, [permissions, shifts, shiftMembers, accountId])

  // Handle permission change
  const handlePermissionChange = useCallback((userId: string, level: PermissionLevel) => {
    setPermissions(prev => {
      const existing = prev.find(
        p => p.user_id === userId && p.zalo_connection_id === accountId
      )
      if (existing) {
        return prev.map(p =>
          p.user_id === userId && p.zalo_connection_id === accountId
            ? { ...p, permission_level: level, updated_at: new Date().toISOString() }
            : p
        )
      } else {
        return [
          ...prev,
          {
            id: `perm-new-${Date.now()}`,
            zalo_connection_id: accountId,
            user_id: userId,
            permission_level: level,
            created_at: new Date().toISOString(),
          },
        ]
      }
    })

    // If setting to 'none', remove from all shifts
    if (level === 'none') {
      setShiftMembers(prev => prev.filter(sm => sm.user_id !== userId))
    }
  }, [accountId])

  // Handle apply permission to multiple users
  const handleApplyToOthers = useCallback((userIds: string[], level: PermissionLevel) => {
    userIds.forEach(userId => {
      handlePermissionChange(userId, level)
    })
  }, [handlePermissionChange])

  // Handle add shift
  const handleAddShift = useCallback((
    employeeId: string,
    shiftData: Omit<ChatShift, 'id' | 'zalo_connection_id' | 'created_at'>
  ) => {
    const newShiftId = `shift-new-${Date.now()}`
    const newShift: ChatShift = {
      ...shiftData,
      id: newShiftId,
      zalo_connection_id: accountId,
      created_at: new Date().toISOString(),
    }

    setShifts(prev => [...prev, newShift])
    setShiftMembers(prev => [
      ...prev,
      {
        id: `sm-new-${Date.now()}`,
        shift_id: newShiftId,
        user_id: employeeId,
        created_at: new Date().toISOString(),
      },
    ])
  }, [accountId])

  // Handle remove shift
  const handleRemoveShift = useCallback((employeeId: string, shiftId: string) => {
    // Remove from shift members
    setShiftMembers(prev => prev.filter(
      sm => !(sm.user_id === employeeId && sm.shift_id === shiftId)
    ))

    // Check if any other member uses this shift
    const otherMembers = shiftMembers.filter(
      sm => sm.shift_id === shiftId && sm.user_id !== employeeId
    )
    
    // If no other members, optionally remove the shift itself
    // For now, we keep the shift
  }, [shiftMembers])

  // Handle apply shift to another day
  const handleApplyShiftToDay = useCallback((
    employeeId: string,
    shiftId: string,
    targetDay: number
  ) => {
    const sourceShift = shifts.find(s => s.id === shiftId)
    if (!sourceShift) return

    // Check if shift already exists for this day
    if (sourceShift.days_of_week.includes(targetDay)) return

    // Create a new shift for the target day with same time
    handleAddShift(employeeId, {
      name: sourceShift.name,
      start_time: sourceShift.start_time,
      end_time: sourceShift.end_time,
      days_of_week: [targetDay],
      is_overnight: sourceShift.is_overnight,
      status: 'active',
    })
  }, [shifts, handleAddShift])

  const tabs: { id: TabType; label: string; icon: React.ElementType }[] = [
    { id: 'permission', label: 'Thiết lập nhân viên', icon: Users },
    { id: 'shift', label: 'Phân ca', icon: Calendar },
    { id: 'history', label: 'Lịch sử', icon: History },
  ]

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] p-0 gap-0">
        <div className="flex flex-col h-full max-h-[85vh]">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className={cn(
                'w-10 h-10 rounded-lg flex items-center justify-center text-white text-sm font-bold',
                accountType === 'facebook' ? 'bg-blue-600' :
                accountType === 'zalo-oa' ? 'bg-purple-600' :
                'bg-blue-500'
              )}>
                {accountName.substring(0, 1).toUpperCase()}
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">{accountName}</h2>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <span className={cn(
                    'px-2 py-0.5 rounded text-xs font-medium',
                    accountType === 'facebook' ? 'bg-blue-100 text-blue-800' :
                    accountType === 'zalo-oa' ? 'bg-purple-100 text-purple-800' :
                    'bg-blue-100 text-blue-700'
                  )}>
                    {accountType === 'facebook' ? 'Facebook' :
                     accountType === 'zalo-oa' ? 'Zalo OA' :
                     'Zalo cá nhân'}
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-1 px-4 py-2 border-b border-gray-200 bg-gray-50">
            {tabs.map(tab => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                    activeTab === tab.id
                      ? 'bg-white text-[#3e79f7] shadow-sm border border-gray-200'
                      : 'text-gray-600 hover:bg-white/50'
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              )
            })}
          </div>

          {/* Content */}
          <div className="flex-1 overflow-auto p-4">
            {activeTab === 'permission' && (
              <PermissionTab
                employees={MOCK_EMPLOYEES}
                permissions={permissions}
                zaloConnectionId={accountId}
                currentUserId={CURRENT_USER_ID}
                onPermissionChange={handlePermissionChange}
                onApplyToOthers={handleApplyToOthers}
              />
            )}

            {activeTab === 'shift' && (
              <ShiftTab
                employees={MOCK_EMPLOYEES}
                assignments={assignments}
                shifts={shifts}
                zaloConnectionId={accountId}
                onAddShift={handleAddShift}
                onRemoveShift={handleRemoveShift}
                onApplyShiftToDay={handleApplyShiftToDay}
              />
            )}

            {activeTab === 'history' && (
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-[#1a3353]">Lịch sử thay đổi</h3>
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-[#fafafb]">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Thời gian</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Người thực hiện</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Hành động</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Chi tiết</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      <tr className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm text-gray-500">03/03/2026 14:30</td>
                        <td className="px-4 py-3 text-sm text-gray-900">Hoàng Chính Nghĩa</td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                            Cập nhật quyền
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-500">
                          Đổi quyền Nguyễn Thị Nhi: Không có quyền → Truy cập
                        </td>
                      </tr>
                      <tr className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm text-gray-500">03/03/2026 10:15</td>
                        <td className="px-4 py-3 text-sm text-gray-900">Hoàng Chính Nghĩa</td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                            Thêm ca trực
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-500">
                          Thêm ca sáng (08:00-12:00) cho Đỗ Đào Hải Long
                        </td>
                      </tr>
                      <tr className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm text-gray-500">02/03/2026 16:45</td>
                        <td className="px-4 py-3 text-sm text-gray-900">Admin</td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                            Xóa ca trực
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-500">
                          Xóa ca tối (18:00-22:00) của Trần Hà My
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 p-4 border-t border-gray-200 bg-gray-50">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Đóng
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-white bg-[#3e79f7] rounded-lg hover:bg-[#2e69e7] transition-colors"
            >
              Lưu thay đổi
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default ChatShiftPermissionModal
