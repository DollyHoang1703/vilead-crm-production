'use client'

import React, { useState, useMemo, useEffect } from 'react'
import { Plus, Clock, X, Copy, Users, Search, Check } from 'lucide-react'
import { Checkbox } from '@/components/ui/checkbox'
import { cn } from '@/lib/utils'
import { DaySelector, DayBadges } from './DaySelector'
import {
  ChatShiftEmployee,
  ChatShift,
  EmployeeShiftAssignment,
  DAYS_OF_WEEK,
  PermissionLevel,
} from '../settings/types/chat-shift.types'

interface ShiftTabProps {
  employees: ChatShiftEmployee[]
  assignments: EmployeeShiftAssignment[]
  shifts: ChatShift[]
  zaloConnectionId: string
  onAddShift: (employeeId: string, shift: Omit<ChatShift, 'id' | 'zalo_connection_id' | 'created_at'>) => void
  onRemoveShift: (employeeId: string, shiftId: string) => void
  onApplyShiftToDay: (employeeId: string, shiftId: string, targetDay: number) => void
  onApplyShiftsToOthers?: (sourceEmployeeId: string, targetEmployeeIds: string[]) => void
  onToggleFullTime?: (employeeId: string, isFullTime: boolean) => void
}

interface NewShiftForm {
  days_of_week: number[]
  start_time: string
  end_time: string
}

const initialShiftForm: NewShiftForm = {
  days_of_week: [],
  start_time: '',
  end_time: '',
}

export function ShiftTab({
  employees,
  assignments,
  shifts,
  zaloConnectionId,
  onAddShift,
  onRemoveShift,
  onApplyShiftToDay,
  onApplyShiftsToOthers,
  onToggleFullTime,
}: ShiftTabProps) {
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(
    assignments.find(a => a.permission_level !== 'none')?.employee.id || null
  )
  // Track shift scheduling per employee (true = use shifts, false = full-time)
  const [employeeShiftScheduling, setEmployeeShiftScheduling] = useState<Map<string, boolean>>(
    () => new Map(assignments.map(a => [a.employee.id, a.useShiftScheduling ?? true]))
  )
  const [newShiftForm, setNewShiftForm] = useState<NewShiftForm>(initialShiftForm)
  const [showApplyDropdown, setShowApplyDropdown] = useState<string | null>(null)
  const [showApplyToOthersModal, setShowApplyToOthersModal] = useState(false)
  const [selectedTargetEmployees, setSelectedTargetEmployees] = useState<string[]>([])
  const [applyToOthersSearch, setApplyToOthersSearch] = useState('')

  // Get current employee's shift scheduling state
  const useShiftScheduling = selectedEmployeeId 
    ? (employeeShiftScheduling.get(selectedEmployeeId) ?? true)
    : true

  // Get current employee's assignment
  const currentAssignment = useMemo(() => {
    return assignments.find(a => a.employee.id === selectedEmployeeId)
  }, [assignments, selectedEmployeeId])

  // Get current employee's shifts grouped by day
  const shiftsByDay = useMemo(() => {
    if (!currentAssignment) return new Map<number, ChatShift[]>()
    
    const map = new Map<number, ChatShift[]>()
    DAYS_OF_WEEK.forEach(day => {
      const dayShifts = currentAssignment.shifts.filter(s => 
        s.days_of_week.includes(day.value)
      )
      map.set(day.value, dayShifts)
    })
    return map
  }, [currentAssignment])

  // Filter employees with member permission only (not admin - admins bypass shift scheduling)
  const eligibleEmployees = useMemo(() => {
    return assignments.filter(a => a.permission_level === 'member')
  }, [assignments])

  // Filter target employees for "Apply to others" modal (exclude current employee)
  const targetEmployeesForApply = useMemo(() => {
    return eligibleEmployees.filter(a => a.employee.id !== selectedEmployeeId)
  }, [eligibleEmployees, selectedEmployeeId])

  // Filtered target employees based on search
  const filteredTargetEmployees = useMemo(() => {
    if (!applyToOthersSearch.trim()) return targetEmployeesForApply
    const searchLower = applyToOthersSearch.toLowerCase()
    return targetEmployeesForApply.filter(a => 
      a.employee.name.toLowerCase().includes(searchLower) ||
      (a.employee.phone && a.employee.phone.includes(applyToOthersSearch))
    )
  }, [targetEmployeesForApply, applyToOthersSearch])

  // Handle toggle shift scheduling - when turned off, employee has full-time access
  const handleToggleShiftScheduling = (checked: boolean) => {
    if (!selectedEmployeeId) return
    
    // Update local state
    setEmployeeShiftScheduling(prev => {
      const newMap = new Map(prev)
      newMap.set(selectedEmployeeId, checked)
      return newMap
    })
    
    // Notify parent
    if (onToggleFullTime) {
      onToggleFullTime(selectedEmployeeId, !checked)
    }
  }

  // Get display days for an employee based on their shift scheduling state
  const getDisplayDays = (assignment: EmployeeShiftAssignment): number[] => {
    const useScheduling = employeeShiftScheduling.get(assignment.employee.id) ?? true
    if (!useScheduling) {
      // Full-time access - all days are active
      return [2, 3, 4, 5, 6, 7, 1]
    }
    // Using shifts - only show days with shifts assigned
    return assignment.assigned_days
  }

  // Handle applying shifts to other employees
  const handleApplyShiftsToOthers = () => {
    if (!selectedEmployeeId || selectedTargetEmployees.length === 0) return
    if (onApplyShiftsToOthers) {
      onApplyShiftsToOthers(selectedEmployeeId, selectedTargetEmployees)
    }
    setShowApplyToOthersModal(false)
    setSelectedTargetEmployees([])
    setApplyToOthersSearch('')
  }

  // Toggle target employee selection
  const toggleTargetEmployee = (employeeId: string) => {
    setSelectedTargetEmployees(prev => 
      prev.includes(employeeId)
        ? prev.filter(id => id !== employeeId)
        : [...prev, employeeId]
    )
  }

  // Select/deselect all target employees
  const toggleSelectAll = () => {
    if (selectedTargetEmployees.length === filteredTargetEmployees.length) {
      setSelectedTargetEmployees([])
    } else {
      setSelectedTargetEmployees(filteredTargetEmployees.map(a => a.employee.id))
    }
  }

  // Handle adding a new shift
  const handleAddShift = () => {
    if (!selectedEmployeeId || !newShiftForm.days_of_week.length || !newShiftForm.start_time || !newShiftForm.end_time) {
      return
    }

    const isOvernight = newShiftForm.end_time < newShiftForm.start_time

    onAddShift(selectedEmployeeId, {
      name: `Ca ${newShiftForm.start_time}-${newShiftForm.end_time}`,
      start_time: newShiftForm.start_time,
      end_time: newShiftForm.end_time,
      days_of_week: newShiftForm.days_of_week,
      is_overnight: isOvernight,
      status: 'active',
    })

    setNewShiftForm(initialShiftForm)
  }

  // Get initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase()
  }

  // Get avatar background color based on name
  const getAvatarColor = (name: string) => {
    const colors = [
      'bg-blue-500',
      'bg-green-500',
      'bg-purple-500',
      'bg-orange-500',
      'bg-pink-500',
      'bg-cyan-500',
      'bg-yellow-500',
    ]
    const index = name.charCodeAt(0) % colors.length
    return colors[index]
  }

  return (
    <div className="flex gap-4 h-[500px]">
      {/* Left Panel - Employee List */}
      <div className="w-64 flex-shrink-0 border border-gray-200 rounded-lg overflow-hidden">
        <div className="p-3 border-b border-gray-200 bg-[#fafafb]">
          <h4 className="text-sm font-semibold text-[#1a3353]">Phân ca trực</h4>
        </div>
        <div className="overflow-y-auto h-[calc(100%-48px)]">
          {eligibleEmployees.map(assignment => {
            const isSelected = selectedEmployeeId === assignment.employee.id
            return (
              <div
                key={assignment.employee.id}
                onClick={() => setSelectedEmployeeId(assignment.employee.id)}
                className={cn(
                  'p-3 cursor-pointer border-b border-gray-100 transition-colors',
                  isSelected ? 'bg-blue-50' : 'hover:bg-gray-50'
                )}
              >
                <div className="flex items-start gap-3">
                  <div className={cn(
                    'w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-medium flex-shrink-0',
                    getAvatarColor(assignment.employee.name)
                  )}>
                    {getInitials(assignment.employee.name)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-900 truncate">
                      {assignment.employee.name}
                    </div>
                    <div className="mt-1">
                      <DayBadges days={getDisplayDays(assignment)} />
                    </div>
                  </div>
                </div>
              </div>
            )
          })}

          {eligibleEmployees.length === 0 && (
            <div className="p-4 text-center text-sm text-gray-500">
              Chưa có nhân viên được phân quyền truy cập
            </div>
          )}
        </div>
      </div>

      {/* Right Panel - Shift Configuration */}
      <div className="flex-1 border border-gray-200 rounded-lg overflow-hidden flex flex-col">
        {currentAssignment ? (
          <>
            {/* Employee Header */}
            <div className="p-4 border-b border-gray-200 bg-[#fafafb]">
              <div className="flex items-center justify-between">
                <h4 className="text-base font-semibold text-[#1a3353]">
                  {currentAssignment.employee.name}
                </h4>
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <Checkbox
                      checked={useShiftScheduling}
                      onCheckedChange={(checked) => handleToggleShiftScheduling(checked as boolean)}
                      className="data-[state=checked]:bg-[#3e79f7] data-[state=checked]:border-[#3e79f7]"
                    />
                    <span className="text-sm text-gray-700">Phân theo ca trực</span>
                  </label>
                </div>
              </div>
              
              {/* Apply to others button */}
              <button 
                onClick={() => setShowApplyToOthersModal(true)}
                className="mt-2 px-3 py-1.5 border border-[#3e79f7] text-[#3e79f7] text-sm rounded-lg hover:bg-blue-50 transition-colors flex items-center gap-1"
              >
                <Users className="w-4 h-4" />
                Cùng áp dụng cho nhân viên khác
              </button>
            </div>

            {/* Shift Form & List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {/* Add New Shift Form */}
              {useShiftScheduling && (
                <div className="space-y-3">
                  <h5 className="text-sm font-medium text-gray-700">Thêm ca trực mới</h5>
                  
                  <div className="grid grid-cols-3 gap-3">
                    {/* Days of week */}
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">
                        <span className="text-red-500">*</span> Ngày trong tuần
                      </label>
                      <DaySelector
                        selectedDays={newShiftForm.days_of_week}
                        onChange={(days) => setNewShiftForm(prev => ({ ...prev, days_of_week: days }))}
                        size="sm"
                      />
                    </div>

                    {/* Start time */}
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">
                        <span className="text-red-500">*</span> Thời gian bắt đầu
                      </label>
                      <div className="relative">
                        <input
                          type="time"
                          value={newShiftForm.start_time}
                          onChange={(e) => setNewShiftForm(prev => ({ ...prev, start_time: e.target.value }))}
                          className="w-full px-3 py-2 pr-8 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3e79f7] focus:border-transparent"
                          placeholder="Chọn giờ"
                        />
                        <Clock className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                    </div>

                    {/* End time */}
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">
                        <span className="text-red-500">*</span> Thời gian kết thúc
                      </label>
                      <div className="relative">
                        <input
                          type="time"
                          value={newShiftForm.end_time}
                          onChange={(e) => setNewShiftForm(prev => ({ ...prev, end_time: e.target.value }))}
                          className="w-full px-3 py-2 pr-8 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3e79f7] focus:border-transparent"
                          placeholder="Chọn giờ"
                        />
                        <Clock className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleAddShift}
                    disabled={!newShiftForm.days_of_week.length || !newShiftForm.start_time || !newShiftForm.end_time}
                    className={cn(
                      'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                      newShiftForm.days_of_week.length && newShiftForm.start_time && newShiftForm.end_time
                        ? 'bg-green-500 hover:bg-green-600 text-white'
                        : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    )}
                  >
                    <Plus className="w-4 h-4" />
                    Thêm ca trực
                  </button>
                </div>
              )}

              {/* Current Schedule by Day */}
              {useShiftScheduling && (
                <div className="space-y-3">
                  <h5 className="text-sm font-medium text-gray-700">Lịch trực hiện tại</h5>
                  
                  {DAYS_OF_WEEK.map(day => {
                    const dayShifts = shiftsByDay.get(day.value) || []
                    
                    return (
                      <div key={day.value} className="border border-gray-200 rounded-lg">
                        <div className="flex items-center justify-between px-4 py-2 bg-gray-50 border-b border-gray-200">
                          <span className="text-sm font-medium text-gray-700">{day.fullLabel}:</span>
                          <div className="flex items-center gap-2">
                            {dayShifts.length > 0 && (
                              <span className="px-2 py-0.5 bg-[#3e79f7] text-white text-xs rounded-full">
                                {dayShifts.length} ca
                              </span>
                            )}
                            <div className="relative">
                              <button
                                onClick={() => setShowApplyDropdown(showApplyDropdown === day.value.toString() ? null : day.value.toString())}
                                className="px-2 py-1 border border-gray-300 rounded text-xs text-gray-600 hover:bg-gray-100 flex items-center gap-1"
                              >
                                <Copy className="w-3 h-3" />
                                Áp dụng cho ngày khác
                              </button>
                              
                              {showApplyDropdown === day.value.toString() && (
                                <div className="absolute z-50 right-0 mt-1 w-40 bg-white border border-gray-200 rounded-lg shadow-lg py-1">
                                  {DAYS_OF_WEEK.filter(d => d.value !== day.value).map(targetDay => (
                                    <button
                                      key={targetDay.value}
                                      onClick={() => {
                                        dayShifts.forEach(shift => {
                                          onApplyShiftToDay(selectedEmployeeId!, shift.id, targetDay.value)
                                        })
                                        setShowApplyDropdown(null)
                                      }}
                                      className="w-full px-3 py-1.5 text-left text-sm hover:bg-gray-50"
                                    >
                                      {targetDay.fullLabel}
                                    </button>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <div className="p-3">
                          {dayShifts.length > 0 ? (
                            <div className="space-y-2">
                              {dayShifts.map(shift => (
                                <div
                                  key={shift.id}
                                  className="flex items-center justify-between px-3 py-2 bg-blue-50 rounded-lg"
                                >
                                  <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-gray-500" />
                                    <span className="text-sm text-gray-700">
                                      {shift.start_time} - {shift.end_time}
                                    </span>
                                    {shift.is_overnight && (
                                      <span className="px-1.5 py-0.5 bg-yellow-100 text-yellow-800 text-xs rounded">
                                        Qua đêm
                                      </span>
                                    )}
                                  </div>
                                  <button
                                    onClick={() => onRemoveShift(selectedEmployeeId!, shift.id)}
                                    className="text-red-500 hover:text-red-700 p-1"
                                    title="Xóa ca trực"
                                  >
                                    <X className="w-4 h-4" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="text-sm text-gray-400 text-center py-2">
                              Chưa có ca trực
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}

              {!useShiftScheduling && (
                <div className="flex flex-col items-center justify-center h-40 text-gray-500 text-sm space-y-3">
                  <div className="flex items-center gap-2 text-green-600">
                    <Check className="w-5 h-5" />
                    <span className="font-medium">Truy cập toàn thời gian</span>
                  </div>
                  <p className="text-gray-400 text-xs text-center">
                    Nhân viên này được truy cập tài khoản 24/7<br/>
                    (Tất cả các ngày trong tuần đều được tích)
                  </p>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500 text-sm">
            Chọn nhân viên để cấu hình ca trực
          </div>
        )}
      </div>

      {/* Apply to Others Modal */}
      {showApplyToOthersModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg w-[400px] max-h-[500px] flex flex-col shadow-xl">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-semibold text-[#1a3353]">Phân công nhân viên</h3>
                <button
                  onClick={() => {
                    setShowApplyToOthersModal(false)
                    setSelectedTargetEmployees([])
                    setApplyToOthersSearch('')
                  }}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Copy lịch ca của <span className="font-medium text-gray-700">{currentAssignment?.employee.name}</span> sang nhân viên khác
              </p>
            </div>

            {/* Search */}
            <div className="p-3 border-b border-gray-200">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={applyToOthersSearch}
                  onChange={(e) => setApplyToOthersSearch(e.target.value)}
                  placeholder="Phân công nhân viên"
                  className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3e79f7] focus:border-transparent"
                />
              </div>
            </div>

            {/* Select All */}
            {filteredTargetEmployees.length > 0 && (
              <div className="px-4 py-2 border-b border-gray-100">
                <label 
                  onClick={toggleSelectAll}
                  className="flex items-center gap-3 cursor-pointer"
                >
                  <Checkbox
                    checked={selectedTargetEmployees.length === filteredTargetEmployees.length}
                    className="h-5 w-5 data-[state=checked]:bg-[#3e79f7] data-[state=checked]:border-[#3e79f7]"
                  />
                  <span className="text-sm text-gray-700">Chọn tất cả ({filteredTargetEmployees.length})</span>
                </label>
              </div>
            )}

            {/* Employee List */}
            <div className="flex-1 overflow-y-auto p-2 max-h-[250px]">
              {filteredTargetEmployees.length > 0 ? (
                filteredTargetEmployees.map(assignment => (
                  <div
                    key={assignment.employee.id}
                    onClick={() => toggleTargetEmployee(assignment.employee.id)}
                    className={cn(
                      'flex items-center gap-3 p-2 px-4 rounded-lg cursor-pointer transition-colors',
                      selectedTargetEmployees.includes(assignment.employee.id)
                        ? 'bg-blue-50'
                        : 'hover:bg-gray-50'
                    )}
                  >
                    <Checkbox
                      checked={selectedTargetEmployees.includes(assignment.employee.id)}
                      className="h-5 w-5 flex-shrink-0 data-[state=checked]:bg-[#3e79f7] data-[state=checked]:border-[#3e79f7]"
                    />
                    <div className={cn(
                      'w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-medium flex-shrink-0',
                      getAvatarColor(assignment.employee.name)
                    )}>
                      {getInitials(assignment.employee.name)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-gray-900 truncate">
                        {assignment.employee.name}
                      </div>
                      {assignment.employee.phone && (
                        <div className="text-xs text-gray-500">
                          {assignment.employee.phone}
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-sm text-gray-500 py-8">
                  {applyToOthersSearch ? 'Không tìm thấy nhân viên' : 'Không có nhân viên khác để áp dụng'}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-3 border-t border-gray-200 flex justify-end gap-2">
              <button
                onClick={() => {
                  setShowApplyToOthersModal(false)
                  setSelectedTargetEmployees([])
                  setApplyToOthersSearch('')
                }}
                className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={handleApplyShiftsToOthers}
                disabled={selectedTargetEmployees.length === 0}
                className={cn(
                  'px-4 py-2 text-sm rounded-lg transition-colors',
                  selectedTargetEmployees.length > 0
                    ? 'bg-[#3e79f7] text-white hover:bg-[#2563eb]'
                    : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                )}
              >
                Áp dụng ({selectedTargetEmployees.length})
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ShiftTab
