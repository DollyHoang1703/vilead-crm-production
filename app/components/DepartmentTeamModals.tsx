'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface Department {
  id: number
  name: string
  description: string
  managerId: number
  managerName: string
  employeeCount: number
  budget: number
  location: string
  phone: string
  email: string
  established: string
  status: 'active' | 'inactive'
  performance: number
  targetRevenue: number
  currentRevenue: number
  teams: Team[]
}

interface Team {
  id: number
  name: string
  description: string
  departmentId: number
  leaderId: number
  leaderName: string
  memberCount: number
  status: 'active' | 'inactive'
  performance: number
  targetMetric: number
  currentMetric: number
  established: string
  members: number[]
}

interface Employee {
  id: number
  name: string
  email: string
  phone: string
  position: string
  department: string
  departmentId: number
  teamId?: number
  teamName?: string
  hireDate: string
  salary: number
  status: 'active' | 'inactive' | 'on_leave'
  avatar?: string
  performance: number
  salesThisMonth: number
  leadsConverted: number
  tasksCompleted: number
}

interface DepartmentModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (department: Partial<Department>) => void
  employees: Employee[]
  department?: Department
}

interface TeamModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (team: Partial<Team>) => void
  departments: Department[]
  employees: Employee[]
  team?: Team
}

export function DepartmentModal({ isOpen, onClose, onSave, employees, department }: DepartmentModalProps) {
  const [formData, setFormData] = useState({
    name: department?.name || '',
    description: department?.description || '',
    managerId: department?.managerId || 0,
    managerName: department?.managerName || '',
    budget: department?.budget || 0,
    location: department?.location || '',
    phone: department?.phone || '',
    email: department?.email || '',
    status: department?.status || 'active' as const,
    targetRevenue: department?.targetRevenue || 0
  })

  // Member picker state
  const [selectedMembers, setSelectedMembers] = useState<number[]>([])
  const [memberSearch, setMemberSearch] = useState('')
  const [showTransferConfirm, setShowTransferConfirm] = useState(false)
  const [employeeToTransfer, setEmployeeToTransfer] = useState<Employee | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const selectedManager = employees.find(emp => emp.id === formData.managerId)
    
    onSave({
      ...formData,
      managerName: selectedManager?.name || formData.managerName,
      established: department?.established || new Date().toISOString().split('T')[0],
      employeeCount: selectedMembers.length + (formData.managerId > 0 ? 1 : 0),
      performance: department?.performance || 0,
      currentRevenue: department?.currentRevenue || 0,
      teams: department?.teams || []
    })
    
    onClose()
  }

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  // Member picker handlers
  const handleMemberToggle = (employee: Employee) => {
    if (selectedMembers.includes(employee.id)) {
      setSelectedMembers(prev => prev.filter(id => id !== employee.id))
    } else {
      // Check if employee belongs to another department
      if (employee.departmentId > 0 && employee.department && department && employee.department !== department.name) {
        setEmployeeToTransfer(employee)
        setShowTransferConfirm(true)
      } else if (employee.departmentId > 0 && employee.department && !department) {
        setEmployeeToTransfer(employee)
        setShowTransferConfirm(true)
      } else {
        setSelectedMembers(prev => [...prev, employee.id])
      }
    }
  }

  const confirmTransfer = () => {
    if (employeeToTransfer) {
      setSelectedMembers(prev => [...prev, employeeToTransfer.id])
      setEmployeeToTransfer(null)
      setShowTransferConfirm(false)
    }
  }

  const handleSelectAll = () => {
    const filteredIds = filteredEmployees
      .filter(emp => emp.id !== formData.managerId)
      .map(emp => emp.id)
    setSelectedMembers(filteredIds)
  }

  const handleDeselectAll = () => {
    setSelectedMembers([])
  }

  const handleRemoveMember = (empId: number) => {
    setSelectedMembers(prev => prev.filter(id => id !== empId))
  }

  // Filter employees by search
  const filteredEmployees = employees.filter(emp => {
    const search = memberSearch.toLowerCase()
    return (
      emp.name.toLowerCase().includes(search) ||
      emp.position.toLowerCase().includes(search) ||
      emp.department.toLowerCase().includes(search)
    )
  })

  // Get initials for avatar
  const getInitials = (name: string) => {
    const parts = name.split(' ')
    if (parts.length >= 2) {
      return (parts[parts.length - 2][0] + parts[parts.length - 1][0]).toUpperCase()
    }
    return name.substring(0, 2).toUpperCase()
  }

  return (
    <>
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {department ? 'Chỉnh sửa Phòng ban' : 'Thêm Phòng ban mới'}
          </DialogTitle>
          <DialogDescription>
            Nhập thông tin để tạo phòng ban mới trong công ty
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Tên phòng ban <span className="text-red-500">*</span></Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Nhập tên phòng ban"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Mô tả</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Mô tả về phòng ban"
              rows={3}
            />
          </div>

          {/* Member Picker Section */}
          <div className="space-y-3 pt-2 border-t border-[#e6ebf1]">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">
                Thành viên phòng ban <span className="text-[#72849a] font-normal">({selectedMembers.length} người)</span>
              </Label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="px-3 py-1 h-7 text-xs text-[#3e79f7] hover:text-[#2a59d1] hover:bg-[#fafafb] rounded-[10px] font-medium transition-colors"
                  onClick={handleSelectAll}
                >
                  Chọn tất cả
                </button>
                <button
                  type="button"
                  className="px-3 py-1 h-7 text-xs text-[#72849a] hover:text-[#455560] hover:bg-[#fafafb] rounded-[10px] font-medium transition-colors"
                  onClick={handleDeselectAll}
                >
                  Bỏ chọn
                </button>
              </div>
            </div>

            {/* Chips */}
            {selectedMembers.length > 0 && (
              <div className="flex flex-wrap gap-2 p-3 bg-[#f7f7f8] rounded-[10px] max-h-[100px] overflow-y-auto">
                {selectedMembers.map(memberId => {
                  const emp = employees.find(e => e.id === memberId)
                  if (!emp) return null
                  return (
                    <div
                      key={memberId}
                      className="flex items-center gap-1.5 px-2 py-1 bg-white border border-[#e6ebf1] text-[#455560] rounded text-xs font-medium hover:bg-[#f0f7ff] transition-colors"
                    >
                      <span className="max-w-[120px] truncate">{emp.name}</span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="w-3 h-3 cursor-pointer hover:text-red-500 flex-shrink-0"
                        onClick={() => handleRemoveMember(memberId)}
                      >
                        <path d="M18 6 6 18"></path>
                        <path d="m6 6 12 12"></path>
                      </svg>
                    </div>
                  )
                })}
              </div>
            )}

            {/* Search */}
            <div className="relative">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#72849a]"
              >
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.3-4.3"></path>
              </svg>
              <Input
                value={memberSearch}
                onChange={(e) => setMemberSearch(e.target.value)}
                placeholder="Tìm kiếm nhân viên theo tên, chức vụ, phòng ban..."
                className="pl-9"
              />
            </div>

            {/* Employee List */}
            <div className="h-[200px] border border-[#e6ebf1] rounded-[10px] overflow-y-auto">
              <div className="p-2 space-y-1">
                {filteredEmployees
                  .filter(emp => emp.id !== formData.managerId)
                  .map((employee) => {
                    const isSelected = selectedMembers.includes(employee.id)
                    const hasOtherDept = employee.departmentId > 0 && employee.department && (!department || employee.department !== department.name)
                    return (
                      <div
                        key={employee.id}
                        onClick={() => handleMemberToggle(employee)}
                        className={`flex items-center gap-3 p-2.5 rounded-lg cursor-pointer transition-colors ${
                          isSelected
                            ? 'bg-[#f0f7ff] border border-[#3e79f7]/20'
                            : 'hover:bg-[#f7f7f8] border border-transparent'
                        }`}
                      >
                        {/* Checkbox */}
                        <div className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                          isSelected ? 'bg-[#3e79f7] border-[#3e79f7]' : 'border-[#d9d9d9] bg-white'
                        }`}>
                          {isSelected && (
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3 text-white">
                              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                              <path d="m9 11 3 3L22 4"></path>
                            </svg>
                          )}
                        </div>

                        {/* Avatar */}
                        <div className="w-8 h-8 rounded-full bg-[#3e79f7] text-white flex items-center justify-center text-xs font-medium flex-shrink-0">
                          {getInitials(employee.name)}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-medium text-[#1a3353] truncate">{employee.name}</p>
                            {hasOtherDept && (
                              <span className="inline-flex items-center rounded text-[10px] px-1.5 py-0 h-4 bg-amber-50 text-amber-700 border border-amber-200 font-normal flex-shrink-0">
                                {employee.department}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-[#72849a] truncate">{employee.position} • {employee.department}</p>
                        </div>
                      </div>
                    )
                  })}
                {filteredEmployees.filter(emp => emp.id !== formData.managerId).length === 0 && (
                  <div className="text-center py-6 text-sm text-gray-400">
                    Không tìm thấy nhân viên
                  </div>
                )}
              </div>
            </div>
          </div>

          <DialogFooter className="px-6">
            <Button type="button" variant="outline" onClick={onClose}>
              Hủy
            </Button>
            <Button type="submit">
              {department ? 'Cập nhật' : 'Thêm phòng ban'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>

    {/* Transfer Confirmation Dialog */}
    <Dialog open={showTransferConfirm} onOpenChange={setShowTransferConfirm}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Xác nhận chuyển phòng ban</DialogTitle>
        </DialogHeader>
        <div className="py-4 px-6">
          <p className="text-sm text-gray-600">
            Nhân viên <span className="font-semibold text-gray-900">{employeeToTransfer?.name}</span> hiện đang thuộc phòng ban <span className="font-semibold text-gray-900">{employeeToTransfer?.department}</span>. Bạn có muốn chuyển sang phòng ban mới?
          </p>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => { setShowTransferConfirm(false); setEmployeeToTransfer(null) }}>
            Hủy
          </Button>
          <Button onClick={confirmTransfer}>
            Xác nhận
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    </>
  )
}

export function TeamModal({ isOpen, onClose, onSave, departments, employees, team }: TeamModalProps) {
  const [formData, setFormData] = useState({
    name: team?.name || '',
    description: team?.description || '',
    departmentId: team?.departmentId || 0,
    leaderId: team?.leaderId || 0,
    leaderName: team?.leaderName || '',
    status: team?.status || 'active' as const,
    targetMetric: team?.targetMetric || 0,
    members: team?.members || [] as number[]
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const selectedLeader = employees.find(emp => emp.id === formData.leaderId)
    
    onSave({
      ...formData,
      leaderName: selectedLeader?.name || formData.leaderName,
      established: team?.established || new Date().toISOString().split('T')[0],
      memberCount: formData.members.length + 1, // +1 for leader
      performance: team?.performance || 0,
      currentMetric: team?.currentMetric || 0
    })
    
    onClose()
  }

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleMemberToggle = (employeeId: number) => {
    setFormData(prev => ({
      ...prev,
      members: prev.members.includes(employeeId)
        ? prev.members.filter(id => id !== employeeId)
        : [...prev.members, employeeId]
    }))
  }

  const departmentEmployees = employees.filter(emp => emp.departmentId === formData.departmentId)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {team ? 'Chỉnh sửa Team' : 'Thêm Team mới'}
          </DialogTitle>
          <DialogDescription>
            Điền thông tin chi tiết cho team
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="teamName">Tên team</Label>
              <Input
                id="teamName"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Nhập tên team"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="department">Phòng ban</Label>
              <Select
                value={formData.departmentId.toString()}
                onValueChange={(value) => {
                  handleInputChange('departmentId', parseInt(value))
                  handleInputChange('leaderId', 0) // Reset leader when department changes
                  handleInputChange('members', []) // Reset members when department changes
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn phòng ban" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((department) => (
                    <SelectItem key={department.id} value={department.id.toString()}>
                      {department.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="teamDescription">Mô tả</Label>
            <Textarea
              id="teamDescription"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Mô tả về team"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="leader">Team Leader</Label>
              <Select
                value={formData.leaderId.toString()}
                onValueChange={(value) => handleInputChange('leaderId', parseInt(value))}
                disabled={!formData.departmentId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn team leader" />
                </SelectTrigger>
                <SelectContent>
                  {departmentEmployees.map((employee) => (
                    <SelectItem key={employee.id} value={employee.id.toString()}>
                      {employee.name} - {employee.position}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="teamStatus">Trạng thái</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => handleInputChange('status', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Hoạt động</SelectItem>
                  <SelectItem value="inactive">Không hoạt động</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="targetMetric">Mục tiêu</Label>
            <Input
              id="targetMetric"
              type="number"
              value={formData.targetMetric}
              onChange={(e) => handleInputChange('targetMetric', parseInt(e.target.value) || 0)}
              placeholder="Mục tiêu của team"
            />
          </div>

          {formData.departmentId > 0 && (
            <div className="space-y-2">
              <Label>Thành viên team</Label>
              <div className="border rounded-lg p-4 max-h-48 overflow-y-auto">
                {departmentEmployees.length > 0 ? (
                  <div className="space-y-2">
                    {departmentEmployees
                      .filter(emp => emp.id !== formData.leaderId) // Exclude leader from members list
                      .map((employee) => (
                      <div key={employee.id} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={`member-${employee.id}`}
                          checked={formData.members.includes(employee.id)}
                          onChange={() => handleMemberToggle(employee.id)}
                          className="rounded border-gray-300"
                        />
                        <Label htmlFor={`member-${employee.id}`} className="flex-1 cursor-pointer">
                          {employee.name} - {employee.position}
                        </Label>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">Không có nhân viên nào trong phòng ban này</p>
                )}
              </div>
              <p className="text-sm text-gray-500">
                Đã chọn: {formData.members.length} thành viên {formData.leaderId > 0 && '+ 1 leader'}
              </p>
            </div>
          )}

          <DialogFooter className="px-6">
            <Button type="button" variant="outline" onClick={onClose}>
              Hủy
            </Button>
            <Button type="submit">
              {team ? 'Cập nhật' : 'Thêm mới'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
