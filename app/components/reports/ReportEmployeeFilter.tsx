'use client'

import { useState, useRef, useEffect } from 'react'
import { Search, ChevronDown, X } from 'lucide-react'

// Mock data for departments, teams, and employees
export const reportOrgData = {
  departments: [
    { id: 'phong_kinh_doanh', name: 'Phòng kinh doanh', initials: 'PK', color: 'blue' },
    { id: 'phong_marketing', name: 'Phòng Marketing', initials: 'PM', color: 'purple' },
  ],
  teams: [
    { id: 'team_hoai_nam', name: 'Team Hoài Nam', departmentId: 'phong_kinh_doanh' },
    { id: 'team_a', name: 'Team A', departmentId: 'phong_kinh_doanh' },
    { id: 'team_b', name: 'Team B', departmentId: 'phong_kinh_doanh' },
    { id: 'team_c', name: 'Team C', departmentId: 'phong_marketing' },
  ],
  employees: [
    { id: 'emp_1', name: 'Hải Yến Nguyễn', initials: 'HY', color: 'red', teamId: 'team_hoai_nam' },
    { id: 'emp_2', name: 'Anh Lê', initials: 'AL', color: 'green', teamId: 'team_hoai_nam' },
    { id: 'emp_3', name: 'Thúy Quỳnh Nguyễn', initials: 'TQ', color: 'blue', teamId: 'team_hoai_nam' },
    { id: 'emp_4', name: 'Thị Thanh Chúc Nguyễn', initials: 'TT', color: 'orange', teamId: 'team_a' },
    { id: 'emp_5', name: 'Đức Nam Lê', initials: 'ĐN', color: 'purple', teamId: 'team_a' },
    { id: 'emp_6', name: 'Nguyễn Văn An', initials: 'NA', color: 'teal', teamId: 'team_b' },
    { id: 'emp_7', name: 'Trần Thị Bình', initials: 'TB', color: 'pink', teamId: 'team_b' },
    { id: 'emp_8', name: 'Lê Minh Tuấn', initials: 'LT', color: 'indigo', teamId: 'team_c' },
  ],
}

// Helper: get filtered employee IDs based on current filter
export function getFilteredEmployeeIds(dept: string, team: string, employee: string): string[] {
  if (employee) return [employee]
  let emps = reportOrgData.employees
  if (team) {
    emps = emps.filter(e => e.teamId === team)
  } else if (dept) {
    const teamIds = reportOrgData.teams.filter(t => t.departmentId === dept).map(t => t.id)
    emps = emps.filter(e => teamIds.includes(e.teamId))
  }
  return emps.map(e => e.id)
}

// Helper: get filtered team names
export function getFilteredTeamNames(dept: string, team: string): string[] {
  if (team) {
    const t = reportOrgData.teams.find(t => t.id === team)
    return t ? [t.name] : []
  }
  if (dept) {
    return reportOrgData.teams.filter(t => t.departmentId === dept).map(t => t.name)
  }
  return reportOrgData.teams.map(t => t.name)
}

// Helper: get multiplier for scaling aggregate data based on filter
export function getFilterMultiplier(dept: string, team: string, employee: string): number {
  const total = reportOrgData.employees.length
  const filtered = getFilteredEmployeeIds(dept, team, employee).length
  return filtered / total
}

const colorMap: Record<string, string> = {
  red: 'bg-red-100 text-red-700',
  green: 'bg-green-100 text-green-700',
  blue: 'bg-blue-100 text-blue-700',
  orange: 'bg-orange-100 text-orange-700',
  purple: 'bg-purple-100 text-purple-700',
  teal: 'bg-teal-100 text-teal-700',
  pink: 'bg-pink-100 text-pink-700',
  indigo: 'bg-indigo-100 text-indigo-700',
}

interface ReportEmployeeFilterProps {
  selectedDepartment: string
  onDepartmentChange: (val: string) => void
  selectedTeam: string
  onTeamChange: (val: string) => void
  selectedEmployee: string
  onEmployeeChange: (val: string) => void
}

export default function ReportEmployeeFilter({
  selectedDepartment,
  onDepartmentChange,
  selectedTeam,
  onTeamChange,
  selectedEmployee,
  onEmployeeChange,
}: ReportEmployeeFilterProps) {
  const [employeeSearch, setEmployeeSearch] = useState('')
  const [showEmployeeDropdown, setShowEmployeeDropdown] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowEmployeeDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Filter teams by department
  const filteredTeams = selectedDepartment
    ? reportOrgData.teams.filter(t => t.departmentId === selectedDepartment)
    : reportOrgData.teams

  // Filter employees by team (or department if no team selected)
  const filteredEmployees = (() => {
    let emps = reportOrgData.employees
    if (selectedTeam) {
      emps = emps.filter(e => e.teamId === selectedTeam)
    } else if (selectedDepartment) {
      const teamIds = filteredTeams.map(t => t.id)
      emps = emps.filter(e => teamIds.includes(e.teamId))
    }
    if (employeeSearch) {
      emps = emps.filter(e => e.name.toLowerCase().includes(employeeSearch.toLowerCase()))
    }
    return emps
  })()

  const selectedEmpObj = reportOrgData.employees.find(e => e.id === selectedEmployee)
  const selectedDeptObj = reportOrgData.departments.find(d => d.id === selectedDepartment)

  return (
    <>
      {/* Department Select */}
      <div className="relative">
        <select
          value={selectedDepartment}
          onChange={(e) => {
            onDepartmentChange(e.target.value)
            onTeamChange('')
            onEmployeeChange('')
          }}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-8 appearance-none min-w-[180px]"
        >
          <option value="">Tất cả Phòng</option>
          {reportOrgData.departments.map(d => (
            <option key={d.id} value={d.id}>{d.name}</option>
          ))}
        </select>
        <ChevronDown className="w-4 h-4 text-gray-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
      </div>

      {/* Team Select - only show when department is selected */}
      {selectedDepartment && (
      <div className="relative">
        <select
          value={selectedTeam}
          onChange={(e) => {
            onTeamChange(e.target.value)
            onEmployeeChange('')
          }}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-8 appearance-none min-w-[160px]"
        >
          <option value="">Tất cả Team</option>
          {filteredTeams.map(t => (
            <option key={t.id} value={t.id}>{t.name}</option>
          ))}
        </select>
        <ChevronDown className="w-4 h-4 text-gray-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
      </div>
      )}

      {/* Employee Search Dropdown - only show when team is selected */}
      {selectedTeam && (
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setShowEmployeeDropdown(!showEmployeeDropdown)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 flex items-center space-x-2 min-w-[170px] hover:border-blue-400 transition-colors"
        >
          {selectedEmpObj ? (
            <>
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${colorMap[selectedEmpObj.color] || 'bg-gray-100 text-gray-700'}`}>
                {selectedEmpObj.initials}
              </span>
              <span className="truncate max-w-[100px]">{selectedEmpObj.name}</span>
              <button
                onClick={(e) => { e.stopPropagation(); onEmployeeChange(''); setEmployeeSearch('') }}
                className="ml-auto p-0.5 hover:bg-gray-100 rounded"
              >
                <X className="w-3 h-3 text-gray-400" />
              </button>
            </>
          ) : (
            <>
              <span className="text-gray-500">Chọn nhân viên</span>
              <ChevronDown className="w-4 h-4 text-gray-400 ml-auto" />
            </>
          )}
        </button>

        {showEmployeeDropdown && (
          <div className="absolute top-full left-0 mt-1 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50 overflow-hidden">
            {/* Search */}
            <div className="p-2 border-b border-gray-100">
              <div className="relative">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Tìm kiếm"
                  value={employeeSearch}
                  onChange={(e) => setEmployeeSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  autoFocus
                />
              </div>
            </div>
            {/* Employee List */}
            <div className="max-h-48 overflow-y-auto py-1">
              {filteredEmployees.length > 0 ? (
                filteredEmployees.map(emp => (
                  <button
                    key={emp.id}
                    onClick={() => {
                      onEmployeeChange(emp.id)
                      setShowEmployeeDropdown(false)
                      setEmployeeSearch('')
                    }}
                    className={`w-full flex items-center space-x-3 px-3 py-2 text-sm hover:bg-gray-50 transition-colors ${selectedEmployee === emp.id ? 'bg-blue-50' : ''}`}
                  >
                    <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${colorMap[emp.color] || 'bg-gray-100 text-gray-700'}`}>
                      {emp.initials}
                    </span>
                    <span className="truncate text-gray-900">{emp.name}</span>
                  </button>
                ))
              ) : (
                <div className="px-3 py-4 text-sm text-gray-500 text-center">Không tìm thấy nhân viên</div>
              )}
            </div>
          </div>
        )}
      </div>
      )}
    </>
  )
}
