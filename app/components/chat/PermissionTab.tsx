'use client'

import React, { useState, useMemo } from 'react'
import { Search, ChevronDown, Users } from 'lucide-react'
import { Checkbox } from '@/components/ui/checkbox'
import { cn } from '@/lib/utils'
import {
  ChatShiftEmployee,
  ZaloAccountPermission,
  PermissionLevel,
  PERMISSION_LEVEL_OPTIONS,
} from '../settings/types/chat-shift.types'

interface PermissionTabProps {
  employees: ChatShiftEmployee[]
  permissions: ZaloAccountPermission[]
  zaloConnectionId: string
  currentUserId?: string  // User đang đăng nhập - mặc định là admin
  onPermissionChange: (userId: string, level: PermissionLevel) => void
  onApplyToOthers?: (userIds: string[], level: PermissionLevel) => void
}

export function PermissionTab({
  employees,
  permissions,
  zaloConnectionId,
  currentUserId = 'emp-1',  // Default là user đầu tiên
  onPermissionChange,
  onApplyToOthers,
}: PermissionTabProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedEmployees, setSelectedEmployees] = useState<Set<string>>(new Set())
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)

  // Tìm admin hiện tại (chỉ cho phép 1 admin duy nhất)
  const currentAdminId = useMemo(() => {
    const adminPerm = permissions.find(
      p => p.zalo_connection_id === zaloConnectionId && p.permission_level === 'admin'
    )
    // Nếu chưa có admin, mặc định là user đang đăng nhập
    return adminPerm?.user_id || currentUserId
  }, [permissions, zaloConnectionId, currentUserId])

  // Get permission level for an employee
  const getPermissionLevel = (userId: string): PermissionLevel => {
    const perm = permissions.find(
      p => p.user_id === userId && p.zalo_connection_id === zaloConnectionId
    )
    return perm?.permission_level || 'none'
  }

  // Filter employees by search
  const filteredEmployees = useMemo(() => {
    if (!searchTerm) return employees
    const term = searchTerm.toLowerCase()
    return employees.filter(
      emp =>
        emp.name.toLowerCase().includes(term) ||
        emp.email.toLowerCase().includes(term)
    )
  }, [employees, searchTerm])

  // Toggle employee selection
  const toggleEmployee = (empId: string) => {
    const next = new Set(selectedEmployees)
    if (next.has(empId)) {
      next.delete(empId)
    } else {
      next.add(empId)
    }
    setSelectedEmployees(next)
  }

  // Toggle all employees
  const toggleAll = () => {
    if (selectedEmployees.size === filteredEmployees.length) {
      setSelectedEmployees(new Set())
    } else {
      setSelectedEmployees(new Set(filteredEmployees.map(e => e.id)))
    }
  }

  // Handle permission dropdown change
  const handlePermissionSelect = (userId: string, level: PermissionLevel) => {
    // Nếu chọn admin mới, tự động chuyển admin cũ thành member
    if (level === 'admin' && currentAdminId && currentAdminId !== userId) {
      onPermissionChange(currentAdminId, 'member')
    }
    onPermissionChange(userId, level)
    setOpenDropdown(null)
  }

  // Apply selected permission to other employees
  const handleApplyToOthers = (sourceUserId: string) => {
    if (!onApplyToOthers || selectedEmployees.size === 0) return
    const sourceLevel = getPermissionLevel(sourceUserId)
    const targetIds = Array.from(selectedEmployees).filter(id => id !== sourceUserId)
    if (targetIds.length > 0) {
      onApplyToOthers(targetIds, sourceLevel)
    }
  }

  const getPermissionBadgeStyle = (level: PermissionLevel) => {
    switch (level) {
      case 'admin':
        return 'bg-purple-100 text-purple-800'
      case 'member':
        return 'bg-blue-100 text-blue-800'
      case 'none':
        return 'bg-gray-100 text-gray-500'
    }
  }

  const getPermissionLabel = (level: PermissionLevel) => {
    return PERMISSION_LEVEL_OPTIONS.find(o => o.value === level)?.label || level
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-[#1a3353]">Phân quyền</h3>
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm nhân viên..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3e79f7] focus:border-transparent w-64"
          />
        </div>
      </div>

      {/* Table */}
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-[#fafafb]">
            <tr>
              <th className="px-4 py-3 text-left w-12">
                <Checkbox
                  checked={selectedEmployees.size === filteredEmployees.length && filteredEmployees.length > 0}
                  onCheckedChange={toggleAll}
                  className="data-[state=checked]:bg-[#3e79f7] data-[state=checked]:border-[#3e79f7]"
                />
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                Tên nhân viên
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                Email
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                Phạm vi quyền
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase w-20">
                
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredEmployees.map(emp => {
              const level = getPermissionLevel(emp.id)
              const isSelected = selectedEmployees.has(emp.id)
              const isDropdownOpen = openDropdown === emp.id

              return (
                <tr key={emp.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={() => toggleEmployee(emp.id)}
                      className="data-[state=checked]:bg-[#3e79f7] data-[state=checked]:border-[#3e79f7]"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm font-medium text-gray-900">{emp.name}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-gray-500">{emp.email}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="relative">
                      <button
                        onClick={() => setOpenDropdown(isDropdownOpen ? null : emp.id)}
                        className={cn(
                          'flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm',
                          'hover:bg-gray-50 transition-colors min-w-[140px] justify-between',
                          isDropdownOpen ? 'border-[#3e79f7] ring-2 ring-[#3e79f7]/20' : 'border-gray-300'
                        )}
                      >
                        <span className={cn(
                          'px-2 py-0.5 rounded text-xs font-medium',
                          getPermissionBadgeStyle(level)
                        )}>
                          {getPermissionLabel(level)}
                        </span>
                        <ChevronDown className={cn(
                          'w-4 h-4 text-gray-400 transition-transform',
                          isDropdownOpen && 'rotate-180'
                        )} />
                      </button>

                      {isDropdownOpen && (
                        <div className="absolute z-50 mt-1 w-56 bg-white border border-gray-200 rounded-lg shadow-lg py-1">
                          {PERMISSION_LEVEL_OPTIONS.map(option => {
                            // Chỉ cho phép chọn admin nếu chưa có admin hoặc đang là admin
                            const isAdminOption = option.value === 'admin'
                            const canSelectAdmin = !isAdminOption || currentAdminId === emp.id || !currentAdminId
                            
                            return (
                              <button
                                key={option.value}
                                onClick={() => handlePermissionSelect(emp.id, option.value)}
                                className={cn(
                                  'w-full px-4 py-2 text-left hover:bg-gray-50 flex flex-col gap-0.5',
                                  level === option.value && 'bg-blue-50',
                                  isAdminOption && currentAdminId && currentAdminId !== emp.id && 'relative'
                                )}
                              >
                                <span className={cn(
                                  'text-sm font-medium',
                                  level === option.value ? 'text-[#3e79f7]' : 'text-gray-900'
                                )}>
                                  {option.label}
                                  {isAdminOption && currentAdminId && currentAdminId !== emp.id && (
                                    <span className="text-xs text-orange-500 ml-2">
                                      (sẽ thay thế admin hiện tại)
                                    </span>
                                  )}
                                </span>
                                <span className="text-xs text-gray-500">
                                  {option.description}
                                </span>
                              </button>
                            )
                          })}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {selectedEmployees.size > 0 && isSelected && (
                      <button
                        onClick={() => handleApplyToOthers(emp.id)}
                        className="text-xs text-[#3e79f7] hover:underline whitespace-nowrap flex items-center gap-1"
                        title="Áp dụng quyền này cho các nhân viên đã chọn"
                      >
                        <Users className="w-3 h-3" />
                        Áp dụng
                      </button>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>

        {filteredEmployees.length === 0 && (
          <div className="py-8 text-center text-gray-500 text-sm">
            Không tìm thấy nhân viên
          </div>
        )}
      </div>

      {/* Apply to others button */}
      {selectedEmployees.size > 1 && (
        <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <Users className="w-4 h-4 text-[#3e79f7]" />
          <span className="text-sm text-gray-700">
            Đã chọn <strong>{selectedEmployees.size}</strong> nhân viên
          </span>
          <button
            onClick={() => {
              const firstSelected = Array.from(selectedEmployees)[0]
              if (firstSelected) handleApplyToOthers(firstSelected)
            }}
            className="ml-auto px-3 py-1.5 bg-[#3e79f7] text-white text-sm rounded-lg hover:bg-[#2e69e7] transition-colors flex items-center gap-1"
          >
            <Users className="w-4 h-4" />
            Cùng áp dụng cho nhân viên khác
          </button>
        </div>
      )}
    </div>
  )
}

export default PermissionTab
