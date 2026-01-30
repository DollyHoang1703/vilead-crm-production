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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const selectedManager = employees.find(emp => emp.id === formData.managerId)
    
    onSave({
      ...formData,
      managerName: selectedManager?.name || formData.managerName,
      established: department?.established || new Date().toISOString().split('T')[0],
      employeeCount: department?.employeeCount || 0,
      performance: department?.performance || 0,
      currentRevenue: department?.currentRevenue || 0,
      teams: department?.teams || []
    })
    
    onClose()
  }

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {department ? 'Chỉnh sửa Phòng ban' : 'Thêm Phòng ban mới'}
          </DialogTitle>
          <DialogDescription>
            Điền thông tin chi tiết cho phòng ban
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Tên phòng ban</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Nhập tên phòng ban"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="manager">Trưởng phòng</Label>
              <Select
                value={formData.managerId.toString()}
                onValueChange={(value) => handleInputChange('managerId', parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn trưởng phòng" />
                </SelectTrigger>
                <SelectContent>
                  {employees.map((employee) => (
                    <SelectItem key={employee.id} value={employee.id.toString()}>
                      {employee.name} - {employee.position}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="location">Vị trí</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                placeholder="Vị trí văn phòng"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone">Số điện thoại</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="Số điện thoại liên hệ"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="Email liên hệ"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="status">Trạng thái</Label>
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="budget">Ngân sách (VND)</Label>
              <Input
                id="budget"
                type="number"
                value={formData.budget}
                onChange={(e) => handleInputChange('budget', parseInt(e.target.value) || 0)}
                placeholder="Ngân sách phòng ban"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="targetRevenue">Mục tiêu doanh thu (VND)</Label>
              <Input
                id="targetRevenue"
                type="number"
                value={formData.targetRevenue}
                onChange={(e) => handleInputChange('targetRevenue', parseInt(e.target.value) || 0)}
                placeholder="Mục tiêu doanh thu"
              />
            </div>
          </div>

          <DialogFooter className="px-6">
            <Button type="button" variant="outline" onClick={onClose}>
              Hủy
            </Button>
            <Button type="submit">
              {department ? 'Cập nhật' : 'Thêm mới'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
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
