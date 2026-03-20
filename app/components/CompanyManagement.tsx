'use client'

import React, { useState, useEffect } from 'react'
import { 
  Building2, 
  Users, 
  Package, 
  Plus, 
  Search, 
  Edit2, 
  Edit,
  Pencil,
  Eye,
  Mail,
  Phone,
  MapPin,
  Calendar,
  CalendarCheck,
  Award,
  TrendingUp,
  Target,
  DollarSign,
  Filter,
  Download,
  Settings,
  MoreVertical,
  MoreHorizontal,
  Trash2,
  CheckCircle,
  X,
  ArrowRightLeft,
  UserCog,
  ToggleLeft,
  ChevronDown
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

// Interfaces
interface Employee {
  id: number
  name: string
  email: string
  phone: string
  position: string
  department: string
  departmentId: number
  teamId: number
  teamName: string
  roleId: number
  roleName: string
  hireDate: string
  officialDate: string // Ngày lên chính thức
  resignDate?: string // Ngày nghỉ việc
  salary: number
  status: 'active' | 'inactive' | 'probation'
  performance: number
  avatar?: string
}

interface Department {
  id: number
  name: string
  description: string
  managerId: number
  managerName: string
  employeeCount: number
  budget: number
  status: 'active' | 'inactive'
  createdAt: string
  memberIds?: number[]
}

interface Team {
  id: number
  name: string
  departmentId: number
  departmentName: string
  leaderId: number
  leaderName: string
  memberCount: number
  memberIds: number[]
  description: string
  status: 'active' | 'inactive'
  createdAt: string
}

interface ConflictMember {
  employeeId: number
  employeeName: string
  currentTeamId: number
  currentTeamName: string
  departmentName: string
}

interface RolePermissions {
  leads: {
    view: 'all' | 'team' | 'department' | 'own' | 'none'
    create: boolean
    edit: boolean
    delete: boolean
    export: boolean
  }
  deals: {
    view: 'all' | 'team' | 'department' | 'own' | 'none'
    create: boolean
    edit: boolean
    delete: boolean
    export: boolean
  }
  customers: {
    view: 'all' | 'team' | 'department' | 'own' | 'none'
    create: boolean
    edit: boolean
    delete: boolean
    export: boolean
  }
  reports: {
    view: 'all' | 'team' | 'department' | 'own' | 'none'
    create: boolean
    export: boolean
    customReports: boolean
  }
  settings: {
    userManagement: boolean
    systemSettings: boolean
    integrations: boolean
    security: boolean
  }
}

interface Role {
  id: number
  name: string
  description: string
  permissions: RolePermissions
  assignedUsers: number
  departmentIds: number[]
  teamIds: number[]
  status: 'active' | 'inactive'
  createdAt: string
  updatedAt: string
}

// Interface for member conflict detection
interface ConflictMember {
  employeeId: number
  employeeName: string
  currentTeamId: number
  currentTeamName: string
  departmentName: string
}

// Sample Data
const sampleEmployees: Employee[] = [
  {
    id: 1,
    name: "Nguyễn Văn An",
    email: "nguyen.van.an@company.com",
    phone: "0901234567",
    position: "Sales Manager",
    department: "Kinh doanh",
    departmentId: 1,
    teamId: 1,
    teamName: "Sales Team A",
    roleId: 2,
    roleName: "Quản lý",
    hireDate: "2023-01-15",
    officialDate: "2023-04-15",
    salary: 25000000,
    status: "active",
    performance: 92,
    avatar: "/avatars/an.jpg"
  },
  {
    id: 2,
    name: "Trần Thị Bình",
    email: "tran.thi.binh@company.com",
    phone: "0901234568",
    position: "Sales Director",
    department: "Kinh doanh",
    departmentId: 1,
    teamId: 2,
    teamName: "Sales Team B",
    roleId: 1,
    roleName: "Giám đốc",
    hireDate: "2022-03-20",
    officialDate: "2022-06-20",
    salary: 35000000,
    status: "active",
    performance: 88,
    avatar: "/avatars/binh.jpg"
  },
  {
    id: 3,
    name: "Lê Minh Chánh",
    email: "le.minh.chanh@company.com",
    phone: "0901234569",
    position: "Marketing Specialist",
    department: "Marketing",
    departmentId: 2,
    teamId: 3,
    teamName: "Marketing Team",
    roleId: 3,
    roleName: "Nhân viên",
    hireDate: "2023-06-10",
    officialDate: "2023-09-10",
    salary: 18000000,
    status: "active",
    performance: 85
  },
  {
    id: 4,
    name: "Phạm Thị Dung",
    email: "pham.thi.dung@company.com",
    phone: "0901234570",
    position: "HR Manager",
    department: "Nhân sự",
    departmentId: 3,
    teamId: 4,
    teamName: "HR Team",
    roleId: 2,
    roleName: "Quản lý",
    hireDate: "2022-11-05",
    officialDate: "2023-02-05",
    salary: 22000000,
    status: "active",
    performance: 90
  },
  {
    id: 5,
    name: "Hoàng Văn Em",
    email: "hoang.van.em@company.com",
    phone: "0901234571",
    position: "Junior Developer",
    department: "Công nghệ",
    departmentId: 4,
    teamId: 5,
    teamName: "Dev Team",
    roleId: 3,
    roleName: "Nhân viên",
    hireDate: "2024-01-20",
    officialDate: "2024-04-20",
    salary: 15000000,
    status: "probation",
    performance: 78
  },
  {
    id: 6,
    name: "Vũ Thị Hoa",
    email: "vu.thi.hoa@company.com",
    phone: "0901234572",
    position: "Accountant",
    department: "Kế toán",
    departmentId: 5,
    teamId: 6,
    teamName: "Accounting Team",
    roleId: 3,
    roleName: "Nhân viên",
    hireDate: "2023-03-15",
    officialDate: "2023-06-15",
    resignDate: "2024-10-30",
    salary: 16000000,
    status: "inactive",
    performance: 75
  }
]

const sampleDepartments: Department[] = [
  {
    id: 1,
    name: "Phòng Kinh doanh",
    description: "Phụ trách bán hàng và phát triển khách hàng",
    managerId: 2,
    managerName: "Trần Thị Bình",
    employeeCount: 2,
    budget: 500000000,
    status: "active",
    createdAt: "2022-01-01",
    memberIds: [1]
  },
  {
    id: 2,
    name: "Phòng Marketing",
    description: "Phụ trách marketing và truyền thông",
    managerId: 3,
    managerName: "Lê Minh Chánh",
    employeeCount: 1,
    budget: 200000000,
    status: "active",
    createdAt: "2022-01-01",
    memberIds: []
  },
  {
    id: 3,
    name: "Phòng Nhân sự",
    description: "Quản lý nhân sự và tuyển dụng",
    managerId: 4,
    managerName: "Phạm Thị Dung",
    employeeCount: 1,
    budget: 150000000,
    status: "active",
    createdAt: "2022-01-01",
    memberIds: []
  },
  {
    id: 4,
    name: "Phòng Công nghệ",
    description: "Phát triển và bảo trì hệ thống",
    managerId: 5,
    managerName: "Hoàng Văn Em",
    employeeCount: 1,
    budget: 300000000,
    status: "active",
    createdAt: "2022-01-01",
    memberIds: []
  }
]

const sampleTeams: Team[] = [
  {
    id: 1,
    name: "Sales Team A",
    departmentId: 1,
    departmentName: "Phòng Kinh doanh",
    leaderId: 1,
    leaderName: "Nguyễn Văn An",
    memberCount: 4,
    memberIds: [1, 2, 7, 8],
    description: "Nhóm bán hàng khu vực miền Bắc",
    status: "active",
    createdAt: "2022-01-15"
  },
  {
    id: 2,
    name: "Sales Team B",
    departmentId: 1,
    departmentName: "Phòng Kinh doanh",
    leaderId: 2,
    leaderName: "Trần Thị Bình",
    memberCount: 3,
    memberIds: [2, 9, 10],
    description: "Nhóm bán hàng khu vực miền Nam",
    status: "active",
    createdAt: "2022-02-01"
  },
  {
    id: 3,
    name: "Marketing Team",
    departmentId: 2,
    departmentName: "Phòng Marketing",
    leaderId: 3,
    leaderName: "Lê Minh Chánh",
    memberCount: 3,
    memberIds: [3, 4, 11],
    description: "Nhóm marketing tổng thể",
    status: "active",
    createdAt: "2022-03-01"
  }
]

const sampleRoles: Role[] = [
  {
    id: 1,
    name: "Quản trị viên",
    description: "Quyền hạn cao nhất, quản lý toàn bộ hệ thống",
    permissions: {
      leads: { view: 'all', create: true, edit: true, delete: true, export: true },
      deals: { view: 'all', create: true, edit: true, delete: true, export: true },
      customers: { view: 'all', create: true, edit: true, delete: true, export: true },
      reports: { view: 'all', create: true, export: true, customReports: true },
      settings: { userManagement: true, systemSettings: true, integrations: true, security: true }
    },
    assignedUsers: 2,
    departmentIds: [1, 2, 3, 4],
    teamIds: [1, 2, 3],
    status: "active",
    createdAt: "2023-01-01",
    updatedAt: "2025-01-10"
  },
  {
    id: 2,
    name: "Trưởng phòng Sales",
    description: "Quản lý nhóm sales với quyền hạn mở rộng",
    permissions: {
      leads: { view: 'department', create: true, edit: true, delete: false, export: true },
      deals: { view: 'department', create: true, edit: true, delete: false, export: true },
      customers: { view: 'department', create: true, edit: true, delete: false, export: false },
      reports: { view: 'department', create: true, export: true, customReports: true },
      settings: { userManagement: false, systemSettings: false, integrations: false, security: false }
    },
    assignedUsers: 3,
    departmentIds: [1],
    teamIds: [1, 2],
    status: "active",
    createdAt: "2023-02-15",
    updatedAt: "2025-01-08"
  },
  {
    id: 3,
    name: "Nhân viên Marketing",
    description: "Tập trung vào lead generation và marketing campaigns",
    permissions: {
      leads: { view: 'all', create: true, edit: true, delete: false, export: true },
      deals: { view: 'none', create: false, edit: false, delete: false, export: false },
      customers: { view: 'own', create: false, edit: false, delete: false, export: false },
      reports: { view: 'own', create: false, export: false, customReports: false },
      settings: { userManagement: false, systemSettings: false, integrations: false, security: false }
    },
    assignedUsers: 4,
    departmentIds: [2],
    teamIds: [3],
    status: "active",
    createdAt: "2023-03-01",
    updatedAt: "2025-01-05"
  },
  {
    id: 4,
    name: "Nhân viên Sales",
    description: "Nhân viên bán hàng với quyền hạn cơ bản",
    permissions: {
      leads: { view: 'team', create: true, edit: true, delete: false, export: false },
      deals: { view: 'team', create: true, edit: true, delete: false, export: false },
      customers: { view: 'own', create: true, edit: true, delete: false, export: false },
      reports: { view: 'own', create: false, export: false, customReports: false },
      settings: { userManagement: false, systemSettings: false, integrations: false, security: false }
    },
    assignedUsers: 8,
    departmentIds: [1],
    teamIds: [1, 2],
    status: "active",
    createdAt: "2023-04-01",
    updatedAt: "2024-12-20"
  },
  {
    id: 5,
    name: "Hỗ trợ khách hàng",
    description: "Chăm sóc và hỗ trợ khách hàng",
    permissions: {
      leads: { view: 'none', create: false, edit: false, delete: false, export: false },
      deals: { view: 'none', create: false, edit: false, delete: false, export: false },
      customers: { view: 'all', create: false, edit: true, delete: false, export: false },
      reports: { view: 'none', create: false, export: false, customReports: false },
      settings: { userManagement: false, systemSettings: false, integrations: false, security: false }
    },
    assignedUsers: 3,
    departmentIds: [3],
    teamIds: [4],
    status: "active",
    createdAt: "2023-05-01",
    updatedAt: "2024-11-15"
  }
]

export default function CompanyManagement() {
  const [activeTab, setActiveTab] = useState('employees')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null)
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null)
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null)
  const [selectedRole, setSelectedRole] = useState<Role | null>(null)
  
  // Modal states for quick actions
  const [showPositionModal, setShowPositionModal] = useState(false)
  const [showDepartmentModal, setShowDepartmentModal] = useState(false)
  const [showRoleModal, setShowRoleModal] = useState(false)
  const [showStatusModal, setShowStatusModal] = useState(false)
  const [showOfficialDateModal, setShowOfficialDateModal] = useState(false)
  const [showSalaryModal, setShowSalaryModal] = useState(false)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showAddEmployeeModal, setShowAddEmployeeModal] = useState(false)
  const [showAddDepartmentModal, setShowAddDepartmentModal] = useState(false)
  const [showAddTeamModal, setShowAddTeamModal] = useState(false)
  const [showAddRoleModal, setShowAddRoleModal] = useState(false)
  const [showEditRoleModal, setShowEditRoleModal] = useState(false)
  const [showRoleDetailModal, setShowRoleDetailModal] = useState(false)
  const [showEditDepartmentModal, setShowEditDepartmentModal] = useState(false)
  const [showEditTeamModal, setShowEditTeamModal] = useState(false)
  const [employees, setEmployees] = useState<Employee[]>(sampleEmployees)
  const [departments, setDepartments] = useState<Department[]>(sampleDepartments)
  const [teams, setTeams] = useState<Team[]>(sampleTeams)
  const [roles, setRoles] = useState<Role[]>(sampleRoles)

  // Role filter states
  const [roleViewFilter, setRoleViewFilter] = useState<'all' | 'department' | 'team'>('all')
  const [selectedDepartmentFilter, setSelectedDepartmentFilter] = useState<string>('')
  const [selectedTeamFilter, setSelectedTeamFilter] = useState<string>('')

  // Form data for quick actions
  const [newPosition, setNewPosition] = useState('')
  const [newDepartmentId, setNewDepartmentId] = useState('')
  const [newRoleId, setNewRoleId] = useState('')
  const [newStatus, setNewStatus] = useState('')
  const [newOfficialDate, setNewOfficialDate] = useState('')
  const [newSalary, setNewSalary] = useState('')

  // Data transfer states
  const [showDataTransferModal, setShowDataTransferModal] = useState(false)
  const [transferToEmployeeId, setTransferToEmployeeId] = useState('')
  const [selectedDataTypes, setSelectedDataTypes] = useState<string[]>([])

  // Action menu states for department and team tables
  const [deptActionMenuOpen, setDeptActionMenuOpen] = useState<number | null>(null)
  const [teamActionMenuOpen, setTeamActionMenuOpen] = useState<number | null>(null)

  // Edit form data
  const [editFormData, setEditFormData] = useState<Partial<Employee>>({})

  // Utility functions
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN')
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Hoạt động</Badge>
      case 'inactive':
        return <Badge className="bg-red-100 text-red-800">Ngừng hoạt động</Badge>
      case 'probation':
        return <Badge className="bg-yellow-100 text-yellow-800">Thử việc</Badge>
      case 'discontinued':
        return <Badge className="bg-gray-100 text-gray-800">Ngừng sản xuất</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  // Filter functions
  const filteredEmployees = employees.filter(employee =>
    employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.department.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const filteredDepartments = departments.filter(dept =>
    dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dept.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const filteredTeams = teams.filter(team =>
    team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    team.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const filteredRoles = roles.filter(role => {
    const matchesSearch = role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         role.description.toLowerCase().includes(searchTerm.toLowerCase())
    
    if (!matchesSearch) return false
    
    if (roleViewFilter === 'department' && selectedDepartmentFilter) {
      return role.departmentIds.includes(parseInt(selectedDepartmentFilter))
    }
    
    if (roleViewFilter === 'team' && selectedTeamFilter) {
      return role.teamIds.includes(parseInt(selectedTeamFilter))
    }
    
    return true
  })

  // Quick action handlers
  const handleQuickAction = (action: string) => {
    if (!selectedEmployee) return

    // If setting status to inactive, show data transfer modal first
    if (action === 'status' && newStatus === 'inactive') {
      setShowStatusModal(false)
      setShowDataTransferModal(true)
      return
    }

    const updatedEmployees = employees.map(emp => {
      if (emp.id === selectedEmployee.id) {
        switch (action) {
          case 'position':
            return { ...emp, position: newPosition }
          case 'department':
            const dept = sampleDepartments.find(d => d.id === parseInt(newDepartmentId))
            return { 
              ...emp, 
              departmentId: parseInt(newDepartmentId),
              department: dept?.name || emp.department
            }
          case 'status':
            return { ...emp, status: newStatus as Employee['status'] }
          case 'officialDate':
            return { ...emp, officialDate: newOfficialDate }
          case 'salary':
            return { ...emp, salary: parseInt(newSalary) }
          default:
            return emp
        }
      }
      return emp
    })

    setEmployees(updatedEmployees)
    
    // Reset form data and close modals
    setNewPosition('')
    setNewDepartmentId('')
    setNewStatus('')
    setNewOfficialDate('')
    setNewSalary('')
    setShowPositionModal(false)
    setShowDepartmentModal(false)
    setShowStatusModal(false)
    setShowOfficialDateModal(false)
    setShowSalaryModal(false)
    setSelectedEmployee(null)
  }

  const handleDataTransfer = () => {
    if (!selectedEmployee || !transferToEmployeeId) return

    // Here you would implement the actual data transfer logic
    // For now, we'll just simulate it
    console.log('Transferring data from', selectedEmployee.name, 'to employee ID', transferToEmployeeId)
    console.log('Data types to transfer:', selectedDataTypes)

    // Update employee status after data transfer
    const updatedEmployees = employees.map(emp => {
      if (emp.id === selectedEmployee.id) {
        return { ...emp, status: 'inactive' as Employee['status'] }
      }
      return emp
    })

    setEmployees(updatedEmployees)

    // Reset states and close modals
    setTransferToEmployeeId('')
    setSelectedDataTypes([])
    setShowDataTransferModal(false)
    setNewStatus('')
    setSelectedEmployee(null)
  }

  const handleEditEmployee = () => {
    if (!selectedEmployee) return

    const updatedEmployees = employees.map(emp => {
      if (emp.id === selectedEmployee.id) {
        return { ...emp, ...editFormData }
      }
      return emp
    })

    setEmployees(updatedEmployees)
    setEditFormData({})
    setShowEditModal(false)
    setSelectedEmployee(null)
  }

  // Add new handlers
  const handleAddEmployee = (employeeData: Omit<Employee, 'id'>) => {
    const newId = Math.max(...employees.map(e => e.id), 0) + 1
    const newEmployee: Employee = {
      ...employeeData,
      id: newId
    }
    setEmployees([...employees, newEmployee])
    setShowAddEmployeeModal(false)
  }

  const handleAddDepartment = (departmentData: Omit<Department, 'id'>) => {
    const newId = Math.max(...departments.map(d => d.id), 0) + 1
    const newDepartment: Department = {
      ...departmentData,
      id: newId
    }
    setDepartments([...departments, newDepartment])
    // Update employee departmentId for selected members
    if (departmentData.memberIds && departmentData.memberIds.length > 0) {
      setEmployees(prev => prev.map(emp => {
        if (departmentData.memberIds!.includes(emp.id) || emp.id === departmentData.managerId) {
          return { ...emp, departmentId: newId, department: departmentData.name }
        }
        return emp
      }))
    }
    setShowAddDepartmentModal(false)
  }

  const handleAddTeam = (teamData: Omit<Team, 'id'>) => {
    const newId = Math.max(...teams.map(t => t.id), 0) + 1
    const newTeam: Team = {
      ...teamData,
      id: newId
    }
    
    // Remove members from their old teams if they are being transferred
    const updatedTeams = teams.map(team => {
      const membersToRemove = teamData.memberIds.filter(id => team.memberIds.includes(id))
      if (membersToRemove.length > 0) {
        return {
          ...team,
          memberIds: team.memberIds.filter(id => !membersToRemove.includes(id)),
          memberCount: team.memberIds.filter(id => !membersToRemove.includes(id)).length
        }
      }
      return team
    })
    
    setTeams([...updatedTeams, newTeam])
    setShowAddTeamModal(false)
  }

  const handleAddRole = (roleData: Omit<Role, 'id'>) => {
    const newId = Math.max(...roles.map(r => r.id), 0) + 1
    const newRole: Role = {
      ...roleData,
      id: newId
    }
    setRoles([...roles, newRole])
    setShowAddRoleModal(false)
  }

  const handleEditRole = (roleData: Partial<Role>) => {
    if (!selectedRole) return

    const updatedRoles = roles.map(role => {
      if (role.id === selectedRole.id) {
        return { ...role, ...roleData, updatedAt: new Date().toISOString().split('T')[0] }
      }
      return role
    })

    setRoles(updatedRoles)
    setShowEditRoleModal(false)
    setSelectedRole(null)
  }

  const handleDeleteRole = (roleId: number) => {
    if (confirm('Bạn có chắc chắn muốn xóa vai trò này?')) {
      setRoles(roles.filter(role => role.id !== roleId))
    }
  }

  // Edit handlers for Department, Team
  const handleEditDepartment = (departmentData: Partial<Department>) => {
    if (!selectedDepartment) return

    const updatedDepartments = departments.map(dept => {
      if (dept.id === selectedDepartment.id) {
        return { ...dept, ...departmentData, updatedAt: new Date().toISOString().split('T')[0] }
      }
      return dept
    })

    setDepartments(updatedDepartments)
    // Update employee departmentId for selected members
    if (departmentData.memberIds !== undefined) {
      const allMemberIds = [...(departmentData.memberIds || [])]
      if (departmentData.managerId) allMemberIds.push(departmentData.managerId)
      setEmployees(prev => prev.map(emp => {
        // Add new members to this department
        if (allMemberIds.includes(emp.id)) {
          return { ...emp, departmentId: selectedDepartment.id, department: departmentData.name || selectedDepartment.name }
        }
        // Remove old members that were un-selected
        if (emp.departmentId === selectedDepartment.id && !allMemberIds.includes(emp.id)) {
          return { ...emp, departmentId: 0, department: '' }
        }
        return emp
      }))
    }
    setShowEditDepartmentModal(false)
    setSelectedDepartment(null)
  }

  const handleEditTeam = (teamData: Partial<Team>) => {
    if (!selectedTeam) return

    // Remove members from their old teams if they are being transferred (except current team)
    const membersToTransfer = teamData.memberIds || []
    const updatedTeams = teams.map(team => {
      if (team.id === selectedTeam.id) {
        return { ...team, ...teamData, updatedAt: new Date().toISOString().split('T')[0] }
      }
      // Remove transferred members from other teams
      const membersToRemove = membersToTransfer.filter(id => team.memberIds.includes(id))
      if (membersToRemove.length > 0) {
        return {
          ...team,
          memberIds: team.memberIds.filter(id => !membersToRemove.includes(id)),
          memberCount: team.memberIds.filter(id => !membersToRemove.includes(id)).length
        }
      }
      return team
    })

    setTeams(updatedTeams)
    setShowEditTeamModal(false)
    setSelectedTeam(null)
  }

  // Add Form Components
  const AddEmployeeForm = ({ onSubmit, onCancel }: {
    onSubmit: (data: Omit<Employee, 'id'>) => void
    onCancel: () => void
  }) => {
    const [formData, setFormData] = useState({
      name: '',
      email: '',
      phone: '',
      position: '',
      departmentId: '',
      department: '',
      teamId: 1,
      teamName: 'Default Team',
      roleId: '',
      roleName: '',
      hireDate: new Date().toISOString().split('T')[0],
      officialDate: '',
      resignDate: '',
      salary: 0,
      status: 'probation' as Employee['status']
      // performance sẽ được set tự động là 0 khi submit
    })

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault()
      if (!formData.name || !formData.email || !formData.departmentId || !formData.teamId || !formData.roleId) {
        alert('Vui lòng điền đầy đủ thông tin bắt buộc')
        return
      }

      const dept = departments.find(d => d.id === parseInt(formData.departmentId))
      const role = roles.find(r => r.id === parseInt(formData.roleId))
      onSubmit({
        ...formData,
        departmentId: parseInt(formData.departmentId),
        department: dept?.name || '',
        roleId: parseInt(formData.roleId),
        roleName: role?.name || '',
        salary: Number(formData.salary),
        performance: 0 // Hiệu suất mặc định cho nhân viên mới
      })
    }

    return (
      <form onSubmit={handleSubmit} className="space-y-4 px-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name">Họ tên *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              placeholder="Nhập họ tên"
              required
            />
          </div>
          <div>
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              placeholder="example@company.com"
              required
            />
          </div>
          <div>
            <Label htmlFor="phone">Số điện thoại</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
              placeholder="0901234567"
            />
          </div>
          <div>
            <Label htmlFor="position">Vị trí</Label>
            <Input
              id="position"
              value={formData.position}
              onChange={(e) => setFormData({...formData, position: e.target.value})}
              placeholder="Nhập vị trí công việc"
            />
          </div>
          <div>
            <Label htmlFor="department">Phòng ban *</Label>
            <Select value={formData.departmentId} onValueChange={(value) => {
              const dept = departments.find(d => d.id === parseInt(value))
              setFormData({
                ...formData, 
                departmentId: value,
                department: dept?.name || '',
                teamId: 1, // Reset team khi thay đổi phòng ban
                teamName: 'Default Team'
              })
            }}>
              <SelectTrigger>
                <SelectValue placeholder="Chọn phòng ban" />
              </SelectTrigger>
              <SelectContent>
                {departments.map((dept) => (
                  <SelectItem key={dept.id} value={dept.id.toString()}>
                    {dept.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="team">Team *</Label>
            <Select 
              value={formData.teamId.toString()} 
              onValueChange={(value) => {
                const team = teams.find(t => t.id === parseInt(value))
                setFormData({
                  ...formData, 
                  teamId: parseInt(value),
                  teamName: team?.name || ''
                })
              }}
              disabled={!formData.departmentId}
            >
              <SelectTrigger>
                <SelectValue placeholder={formData.departmentId ? "Chọn team" : "Chọn phòng ban trước"} />
              </SelectTrigger>
              <SelectContent>
                {teams
                  .filter(team => team.departmentId === parseInt(formData.departmentId))
                  .map((team) => (
                    <SelectItem key={team.id} value={team.id.toString()}>
                      <div className="flex flex-col">
                        <span className="font-medium">{team.name}</span>
                        <span className="text-xs text-gray-500">{team.description}</span>
                        <span className="text-xs text-blue-600">Trưởng nhóm: {team.leaderName}</span>
                      </div>
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="role">Vai trò *</Label>
            <Select value={formData.roleId} onValueChange={(value) => {
              const role = roles.find(r => r.id === parseInt(value))
              setFormData({
                ...formData, 
                roleId: value,
                roleName: role?.name || ''
              })
            }}>
              <SelectTrigger>
                <SelectValue placeholder="Chọn vai trò" />
              </SelectTrigger>
              <SelectContent>
                {roles.filter(role => role.status === 'active').map((role) => (
                  <SelectItem key={role.id} value={role.id.toString()}>
                    <div className="flex flex-col">
                      <span className="font-medium">{role.name}</span>
                      <span className="text-xs text-gray-500">{role.description}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="salary">Lương (VND)</Label>
            <Input
              id="salary"
              type="number"
              value={formData.salary}
              onChange={(e) => setFormData({...formData, salary: Number(e.target.value)})}
              placeholder="0"
            />
          </div>
          <div>
            <Label htmlFor="hireDate">Ngày vào làm</Label>
            <Input
              id="hireDate"
              type="date"
              value={formData.hireDate}
              onChange={(e) => setFormData({...formData, hireDate: e.target.value})}
            />
          </div>
          <div>
            <Label htmlFor="officialDate">Ngày chính thức</Label>
            <Input
              id="officialDate"
              type="date"
              value={formData.officialDate}
              onChange={(e) => setFormData({...formData, officialDate: e.target.value})}
            />
          </div>
          <div>
            <Label htmlFor="status">Trạng thái</Label>
            <Select value={formData.status} onValueChange={(value) => setFormData({...formData, status: value as Employee['status']})}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Hoạt động</SelectItem>
                <SelectItem value="inactive">Ngừng hoạt động</SelectItem>
                <SelectItem value="probation">Thử việc</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-700">
            <strong>Lưu ý:</strong> Hiệu xuất công việc sẽ được tính toán tự động từ hệ thống sau khi nhân viên bắt đầu làm việc.
          </p>
        </div>
        
        <DialogFooter className="px-6">
          <Button type="button" variant="outline" onClick={onCancel}>
            Hủy
          </Button>
          <Button type="submit">
            Thêm nhân viên
          </Button>
        </DialogFooter>
      </form>
    )
  }

  const AddDepartmentForm = ({ onSubmit, onCancel }: {
    onSubmit: (data: Omit<Department, 'id'>) => void
    onCancel: () => void
  }) => {
    const [formData, setFormData] = useState({
      name: '',
      description: '',
      managerId: '',
      managerName: '',
      employeeCount: 0,
      budget: 0,
      status: 'active' as Department['status'],
      createdAt: new Date().toISOString().split('T')[0]
    })
    const [selectedMembers, setSelectedMembers] = useState<number[]>([])
    const [memberSearch, setMemberSearch] = useState('')
    const [showConflictDialog, setShowConflictDialog] = useState(false)
    const [conflictMembers, setConflictMembers] = useState<ConflictMember[]>([])
    const [confirmedConflictIds, setConfirmedConflictIds] = useState<number[]>([])
    const [pendingFormData, setPendingFormData] = useState<Omit<Department, 'id'> | null>(null)

    const findMembersInOtherDepts = (memberIds: number[]): ConflictMember[] => {
      const conflicts: ConflictMember[] = []
      memberIds.forEach(empId => {
        const emp = employees.find(e => e.id === empId)
        if (!emp) return
        if (emp.departmentId > 0 && emp.department) {
          conflicts.push({
            employeeId: empId,
            employeeName: emp.name,
            currentTeamId: emp.departmentId,
            currentTeamName: emp.department,
            departmentName: emp.department
          })
        }
      })
      return conflicts
    }

    const getEmployeeDeptName = (empId: number): string | null => {
      const emp = employees.find(e => e.id === empId)
      if (emp && emp.departmentId > 0 && emp.department) return emp.department
      return null
    }

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault()
      if (!formData.name || !formData.managerId) {
        alert('Vui lòng điền đầy đủ thông tin bắt buộc')
        return
      }
      const manager = employees.find(emp => emp.id === parseInt(formData.managerId))
      const submitData: Omit<Department, 'id'> = {
        ...formData,
        managerId: parseInt(formData.managerId),
        managerName: manager?.name || '',
        budget: Number(formData.budget),
        employeeCount: selectedMembers.length + (formData.managerId ? 1 : 0),
        memberIds: selectedMembers
      }
      const conflicts = findMembersInOtherDepts(selectedMembers)
      if (conflicts.length > 0) {
        setConflictMembers(conflicts)
        setConfirmedConflictIds(conflicts.map(c => c.employeeId))
        setPendingFormData(submitData)
        setShowConflictDialog(true)
      } else {
        onSubmit(submitData)
      }
    }

    const handleSkipConflict = () => {
      if (!pendingFormData) return
      const conflictIds = conflictMembers.map(c => c.employeeId)
      const membersWithoutConflict = selectedMembers.filter(id => !conflictIds.includes(id))
      onSubmit({ ...pendingFormData, memberIds: membersWithoutConflict, employeeCount: membersWithoutConflict.length + (formData.managerId ? 1 : 0) })
      setShowConflictDialog(false)
    }

    const handleConfirmConflict = () => {
      if (!pendingFormData) return
      const conflictIds = conflictMembers.map(c => c.employeeId)
      const membersWithoutConflict = selectedMembers.filter(id => !conflictIds.includes(id))
      const finalMembers = [...membersWithoutConflict, ...confirmedConflictIds]
      onSubmit({ ...pendingFormData, memberIds: finalMembers, employeeCount: finalMembers.length + (formData.managerId ? 1 : 0) })
      setShowConflictDialog(false)
    }

    const toggleConflictMember = (empId: number) => {
      setConfirmedConflictIds(prev => prev.includes(empId) ? prev.filter(id => id !== empId) : [...prev, empId])
    }

    const filteredEmployees = employees.filter(emp =>
      emp.name.toLowerCase().includes(memberSearch.toLowerCase()) ||
      emp.position.toLowerCase().includes(memberSearch.toLowerCase()) ||
      emp.department.toLowerCase().includes(memberSearch.toLowerCase())
    )

    const toggleMember = (empId: number) => {
      setSelectedMembers(prev => prev.includes(empId) ? prev.filter(id => id !== empId) : [...prev, empId])
    }

    const selectAll = () => {
      const ids = filteredEmployees.filter(emp => emp.id !== parseInt(formData.managerId)).map(emp => emp.id)
      setSelectedMembers(prev => Array.from(new Set([...prev, ...ids])))
    }

    const deselectAll = () => setSelectedMembers([])

    return (
      <>
      <form onSubmit={handleSubmit} className="space-y-4 pt-2 px-6">
        <div className="space-y-2">
          <Label htmlFor="deptName">Tên phòng ban <span className="text-red-500">*</span></Label>
          <Input id="deptName" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="Nhập tên phòng ban" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="description">Mô tả</Label>
          <Input id="description" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} placeholder="Mô tả chức năng phòng ban" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="manager">Trưởng phòng <span className="text-red-500">*</span></Label>
          <Select value={formData.managerId} onValueChange={(value) => {
            const manager = employees.find(emp => emp.id === parseInt(value))
            setFormData({ ...formData, managerId: value, managerName: manager?.name || '' })
          }}>
            <SelectTrigger><SelectValue placeholder="Chọn trưởng phòng" /></SelectTrigger>
            <SelectContent>
              {employees.map((emp) => (<SelectItem key={emp.id} value={emp.id.toString()}>{emp.name} - {emp.position}</SelectItem>))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="deptStatus">Trạng thái</Label>
          <Select value={formData.status} onValueChange={(value) => setFormData({...formData, status: value as Department['status']})}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Hoạt động</SelectItem>
              <SelectItem value="inactive">Ngừng hoạt động</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Member Picker */}
        <div className="space-y-3 pt-2 border-t border-[#e6ebf1]">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">Thành viên phòng ban <span className="text-[#72849a] font-normal">({selectedMembers.length} người)</span></Label>
            <div className="flex items-center gap-2">
              <Button type="button" variant="ghost" size="sm" className="h-7 text-xs text-[#3e79f7] hover:text-[#2a59d1]" onClick={selectAll}>Chọn tất cả</Button>
              <Button type="button" variant="ghost" size="sm" className="h-7 text-xs text-[#72849a] hover:text-[#455560]" onClick={deselectAll}>Bỏ chọn</Button>
            </div>
          </div>
          {selectedMembers.length > 0 && (
            <div className="flex flex-wrap gap-2 p-3 bg-[#f7f7f8] rounded-[10px] max-h-[100px] overflow-y-auto">
              {selectedMembers.map(memberId => {
                const emp = employees.find(e => e.id === memberId)
                return emp ? (
                  <Badge key={memberId} variant="secondary" className="flex items-center gap-1.5 px-2 py-1 bg-white border border-[#e6ebf1] text-[#455560] hover:bg-[#f0f7ff]">
                    <span className="max-w-[120px] truncate">{emp.name}</span>
                    <X className="w-3 h-3 cursor-pointer hover:text-red-500 flex-shrink-0" onClick={() => toggleMember(memberId)} />
                  </Badge>
                ) : null
              })}
            </div>
          )}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#72849a]" />
            <Input placeholder="Tìm kiếm nhân viên theo tên, chức vụ, phòng ban..." value={memberSearch} onChange={(e) => setMemberSearch(e.target.value)} className="pl-9" />
          </div>
          <ScrollArea className="h-[200px] border border-[#e6ebf1] rounded-[10px]">
            <div className="p-2 space-y-1">
              {filteredEmployees.filter(emp => emp.id !== parseInt(formData.managerId)).length === 0 ? (
                <p className="text-sm text-[#72849a] text-center py-8">Không tìm thấy nhân viên phù hợp</p>
              ) : (
                filteredEmployees.filter(emp => emp.id !== parseInt(formData.managerId)).map(emp => (
                  <div key={emp.id} className={`flex items-center gap-3 p-2.5 rounded-lg cursor-pointer transition-colors ${selectedMembers.includes(emp.id) ? 'bg-[#f0f7ff] border border-[#3e79f7]/20' : 'hover:bg-[#f7f7f8] border border-transparent'}`} onClick={() => toggleMember(emp.id)}>
                    <div className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors ${selectedMembers.includes(emp.id) ? 'bg-[#3e79f7] border-[#3e79f7]' : 'border-[#d9d9d9] bg-white'}`}>
                      {selectedMembers.includes(emp.id) && <CheckCircle className="w-3 h-3 text-white" />}
                    </div>
                    <Avatar className="w-8 h-8"><AvatarFallback className="bg-[#3e79f7] text-white text-xs">{emp.name.split(' ').slice(-2).map(n => n[0]).join('')}</AvatarFallback></Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-[#1a3353] truncate">{emp.name}</p>
                        {getEmployeeDeptName(emp.id) && <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4 bg-amber-50 text-amber-700 border-amber-200 font-normal">{getEmployeeDeptName(emp.id)}</Badge>}
                      </div>
                      <p className="text-xs text-[#72849a] truncate">{emp.position} • {emp.department}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </div>

        <DialogFooter className="pt-4 px-6">
          <Button type="button" variant="outline" onClick={onCancel}>Hủy</Button>
          <Button type="submit">Thêm phòng ban</Button>
        </DialogFooter>
      </form>

      {/* Batch Conflict Dialog */}
      <Dialog open={showConflictDialog} onOpenChange={setShowConflictDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-[#1a3353]">Xác nhận chuyển phòng ban</DialogTitle>
            <DialogDescription>Các nhân viên sau đang thuộc phòng ban khác. Chọn nhân viên muốn chuyển sang phòng ban mới:</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 px-6">
            <div className="flex justify-end gap-2 px-1">
              <Button type="button" variant="ghost" size="sm" className="h-7 text-xs text-[#3e79f7]" onClick={() => setConfirmedConflictIds(conflictMembers.map(c => c.employeeId))}>Chọn tất cả</Button>
              <Button type="button" variant="ghost" size="sm" className="h-7 text-xs text-[#72849a]" onClick={() => setConfirmedConflictIds([])}>Bỏ chọn</Button>
            </div>
            <div className="space-y-2 max-h-[300px] overflow-y-auto">
              {conflictMembers.map(conflict => {
                const isSelected = confirmedConflictIds.includes(conflict.employeeId)
                return (
                  <div key={conflict.employeeId} className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors border ${isSelected ? 'bg-[#f0f7ff] border-[#3e79f7]/20' : 'bg-white border-gray-200 hover:bg-gray-50'}`} onClick={() => toggleConflictMember(conflict.employeeId)}>
                    <div className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 ${isSelected ? 'bg-[#3e79f7] border-[#3e79f7]' : 'border-[#d9d9d9]'}`}>
                      {isSelected && <CheckCircle className="w-3 h-3 text-white" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[#1a3353]">{conflict.employeeName}</p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-xs text-[#72849a]">Phòng ban hiện tại:</span>
                        <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4 bg-amber-50 text-amber-700 border-amber-200 font-normal">{conflict.currentTeamName}</Badge>
                      </div>
                      <p className="text-xs text-[#72849a]">{conflict.departmentName}</p>
                    </div>
                  </div>
                )
              })}
            </div>
            <p className="text-xs text-amber-600 italic px-1">* Nhân viên được chọn sẽ được chuyển từ phòng ban cũ sang phòng ban mới</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleSkipConflict}>Bỏ qua</Button>
            <Button onClick={handleConfirmConflict} disabled={confirmedConflictIds.length === 0}>Thêm vào phòng ban ({confirmedConflictIds.length})</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      </>
    )
  }

  const AddTeamForm = ({ onSubmit, onCancel }: {
    onSubmit: (data: Omit<Team, 'id'>) => void
    onCancel: () => void
  }) => {
    const [formData, setFormData] = useState({
      name: '',
      departmentId: '',
      departmentName: '',
      leaderId: '',
      leaderName: '',
      memberCount: 0,
      memberIds: [] as number[],
      description: '',
      status: 'active' as Team['status'],
      createdAt: new Date().toISOString().split('T')[0]
    })
    const [selectedMembers, setSelectedMembers] = useState<number[]>([])
    const [memberSearchQuery, setMemberSearchQuery] = useState('')
    
    // Conflict dialog states
    const [showConflictDialog, setShowConflictDialog] = useState(false)
    const [conflictMembers, setConflictMembers] = useState<ConflictMember[]>([])
    const [confirmedConflictIds, setConfirmedConflictIds] = useState<number[]>([])
    const [pendingFormData, setPendingFormData] = useState<Omit<Team, 'id'> | null>(null)

    // Helper function to find members in other teams
    const findMembersInOtherTeams = (memberIds: number[], currentTeamId?: number): ConflictMember[] => {
      const conflicts: ConflictMember[] = []
      memberIds.forEach(empId => {
        const emp = employees.find(e => e.id === empId)
        if (!emp) return
        
        // Check if this employee is in any other team
        for (const team of teams) {
          if (currentTeamId && team.id === currentTeamId) continue // Skip current team when editing
          if (team.memberIds.includes(empId)) {
            conflicts.push({
              employeeId: empId,
              employeeName: emp.name,
              currentTeamId: team.id,
              currentTeamName: team.name,
              departmentName: emp.department
            })
            break // Employee can only be in one team
          }
        }
      })
      return conflicts
    }

    // Get team name for an employee
    const getEmployeeTeamName = (empId: number): string | null => {
      for (const team of teams) {
        if (team.memberIds.includes(empId)) {
          return team.name
        }
      }
      return null
    }

    // Filter employees by search query
    const availableEmployees = employees.filter(emp => 
      emp.status === 'active' &&
      (emp.name.toLowerCase().includes(memberSearchQuery.toLowerCase()) ||
       emp.position.toLowerCase().includes(memberSearchQuery.toLowerCase()) ||
       emp.department.toLowerCase().includes(memberSearchQuery.toLowerCase()))
    )

    // Toggle member selection
    const toggleMember = (empId: number) => {
      setSelectedMembers(prev => 
        prev.includes(empId) 
          ? prev.filter(id => id !== empId)
          : [...prev, empId]
      )
    }

    // Select all visible employees
    const selectAll = () => {
      const visibleIds = availableEmployees.map(emp => emp.id)
      setSelectedMembers(prev => {
        const newSet = new Set([...prev, ...visibleIds])
        return Array.from(newSet)
      })
    }

    // Deselect all
    const deselectAll = () => {
      setSelectedMembers([])
    }

    // Toggle conflict member selection
    const toggleConflictMember = (empId: number) => {
      setConfirmedConflictIds(prev => 
        prev.includes(empId) 
          ? prev.filter(id => id !== empId)
          : [...prev, empId]
      )
    }

    // Handle skip - only add members without existing team
    const handleSkipConflict = () => {
      if (!pendingFormData) return
      const conflictIds = conflictMembers.map(c => c.employeeId)
      const membersWithoutTeam = selectedMembers.filter(id => !conflictIds.includes(id))
      onSubmit({
        ...pendingFormData,
        memberIds: membersWithoutTeam,
        memberCount: membersWithoutTeam.length
      })
      setShowConflictDialog(false)
    }

    // Handle confirm - add selected members including confirmed transfers
    const handleConfirmConflict = () => {
      if (!pendingFormData) return
      const conflictIds = conflictMembers.map(c => c.employeeId)
      const membersWithoutTeam = selectedMembers.filter(id => !conflictIds.includes(id))
      const finalMembers = [...membersWithoutTeam, ...confirmedConflictIds]
      onSubmit({
        ...pendingFormData,
        memberIds: finalMembers,
        memberCount: finalMembers.length
      })
      setShowConflictDialog(false)
    }

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault()
      if (!formData.name || !formData.departmentId || !formData.leaderId) {
        alert('Vui lòng điền đầy đủ thông tin bắt buộc')
        return
      }

      const dept = departments.find(d => d.id === parseInt(formData.departmentId))
      const leader = employees.find(emp => emp.id === parseInt(formData.leaderId))
      const submitData: Omit<Team, 'id'> = {
        ...formData,
        departmentId: parseInt(formData.departmentId),
        departmentName: dept?.name || '',
        leaderId: parseInt(formData.leaderId),
        leaderName: leader?.name || '',
        memberIds: selectedMembers,
        memberCount: selectedMembers.length
      }

      // Check for conflicts
      const conflicts = findMembersInOtherTeams(selectedMembers)
      if (conflicts.length > 0) {
        setConflictMembers(conflicts)
        setConfirmedConflictIds(conflicts.map(c => c.employeeId)) // Default: select all
        setPendingFormData(submitData)
        setShowConflictDialog(true)
      } else {
        onSubmit(submitData)
      }
    }

    return (
      <>
      <form onSubmit={handleSubmit} className="space-y-4 px-6">
        <div>
          <Label htmlFor="teamName">Tên nhóm *</Label>
          <Input
            id="teamName"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            placeholder="Nhập tên nhóm"
            required
          />
        </div>
        <div>
          <Label htmlFor="teamDepartment">Phòng ban *</Label>
          <Select value={formData.departmentId} onValueChange={(value) => {
            const dept = departments.find(d => d.id === parseInt(value))
            setFormData({
              ...formData, 
              departmentId: value,
              departmentName: dept?.name || ''
            })
          }}>
            <SelectTrigger>
              <SelectValue placeholder="Chọn phòng ban" />
            </SelectTrigger>
            <SelectContent>
              {departments.map((dept) => (
                <SelectItem key={dept.id} value={dept.id.toString()}>
                  {dept.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="teamLeader">Trưởng nhóm *</Label>
          <Select value={formData.leaderId} onValueChange={(value) => {
            const leader = employees.find(emp => emp.id === parseInt(value))
            setFormData({
              ...formData, 
              leaderId: value,
              leaderName: leader?.name || ''
            })
          }}>
            <SelectTrigger>
              <SelectValue placeholder="Chọn trưởng nhóm" />
            </SelectTrigger>
            <SelectContent>
              {employees.filter(emp => 
                formData.departmentId ? emp.departmentId === parseInt(formData.departmentId) : true
              ).map((emp) => (
                <SelectItem key={emp.id} value={emp.id.toString()}>
                  {emp.name} - {emp.position}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="teamDescription">Mô tả</Label>
          <Input
            id="teamDescription"
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            placeholder="Mô tả nhiệm vụ và chức năng nhóm"
          />
        </div>
        <div>
          <Label htmlFor="teamStatus">Trạng thái</Label>
          <Select value={formData.status} onValueChange={(value) => setFormData({...formData, status: value as Team['status']})}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Hoạt động</SelectItem>
              <SelectItem value="inactive">Ngừng hoạt động</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Member Selection Section */}
        <div className="space-y-3 pt-2 border-t border-[#e6ebf1]">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">
              Thành viên nhóm <span className="text-[#72849a] font-normal">({selectedMembers.length} người)</span>
            </Label>
            <div className="flex items-center gap-2">
              <Button type="button" variant="ghost" size="sm" className="h-7 text-xs text-[#3e79f7] hover:text-[#2a59d1]" onClick={selectAll}>
                Chọn tất cả
              </Button>
              <Button type="button" variant="ghost" size="sm" className="h-7 text-xs text-[#72849a] hover:text-[#455560]" onClick={deselectAll}>
                Bỏ chọn
              </Button>
            </div>
          </div>

          {/* Selected Members Display */}
          {selectedMembers.length > 0 && (
            <div className="flex flex-wrap gap-2 p-3 bg-[#f7f7f8] rounded-[10px] max-h-[100px] overflow-y-auto">
              {selectedMembers.map(memberId => {
                const emp = employees.find(e => e.id === memberId)
                return emp ? (
                  <Badge 
                    key={memberId} 
                    variant="secondary" 
                    className="flex items-center gap-1.5 px-2 py-1 bg-white border border-[#e6ebf1] text-[#455560] hover:bg-[#f0f7ff]"
                  >
                    <span className="max-w-[120px] truncate">{emp.name}</span>
                    <X 
                      className="w-3 h-3 cursor-pointer hover:text-red-500 flex-shrink-0" 
                      onClick={() => toggleMember(memberId)}
                    />
                  </Badge>
                ) : null
              })}
            </div>
          )}

          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#72849a]" />
            <Input
              placeholder="Tìm kiếm nhân viên theo tên, chức vụ, phòng ban..."
              value={memberSearchQuery}
              onChange={(e) => setMemberSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Employee List */}
          <ScrollArea className="h-[200px] border border-[#e6ebf1] rounded-[10px]">
            <div className="p-2 space-y-1">
              {availableEmployees.length === 0 ? (
                <p className="text-sm text-[#72849a] text-center py-8">Không tìm thấy nhân viên phù hợp</p>
              ) : (
                availableEmployees.map(emp => (
                  <div 
                    key={emp.id}
                    className={`flex items-center gap-3 p-2.5 rounded-lg cursor-pointer transition-colors ${
                      selectedMembers.includes(emp.id) 
                        ? 'bg-[#f0f7ff] border border-[#3e79f7]/20' 
                        : 'hover:bg-[#f7f7f8] border border-transparent'
                    }`}
                    onClick={() => toggleMember(emp.id)}
                  >
                    <div 
                      className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                        selectedMembers.includes(emp.id)
                          ? 'bg-[#3e79f7] border-[#3e79f7]'
                          : 'border-[#d9d9d9] bg-white'
                      }`}
                    >
                      {selectedMembers.includes(emp.id) && (
                        <CheckCircle className="w-3 h-3 text-white" />
                      )}
                    </div>
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="bg-[#3e79f7] text-white text-xs">
                        {emp.name.split(' ').slice(-2).map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-[#1a3353] truncate">{emp.name}</p>
                        {getEmployeeTeamName(emp.id) && (
                          <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4 bg-amber-50 text-amber-700 border-amber-200 font-normal">
                            {getEmployeeTeamName(emp.id)}
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-[#72849a] truncate">{emp.position} • {emp.department}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </div>

        <DialogFooter className="px-6 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Hủy
          </Button>
          <Button type="submit">
            Thêm nhóm
          </Button>
        </DialogFooter>
      </form>

      {/* Member Conflict Dialog */}
      <Dialog open={showConflictDialog} onOpenChange={setShowConflictDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-[#1a3353]">Xác nhận chuyển nhóm</DialogTitle>
            <DialogDescription>
              Các nhân viên sau đang thuộc nhóm khác. Chọn nhân viên muốn chuyển sang nhóm mới:
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-3">
            {/* Select All / Deselect All buttons */}
            <div className="flex items-center justify-end gap-2 pb-2 border-b border-[#e6ebf1]">
              <Button 
                type="button" 
                variant="ghost" 
                size="sm" 
                className="h-7 text-xs text-[#3e79f7] hover:text-[#2a59d1]"
                onClick={() => setConfirmedConflictIds(conflictMembers.map(c => c.employeeId))}
              >
                Chọn tất cả
              </Button>
              <Button 
                type="button" 
                variant="ghost" 
                size="sm" 
                className="h-7 text-xs text-[#72849a] hover:text-[#455560]"
                onClick={() => setConfirmedConflictIds([])}
              >
                Bỏ chọn
              </Button>
            </div>

            {/* Conflict Members List */}
            <ScrollArea className="h-[200px] border border-[#e6ebf1] rounded-[10px]">
              <div className="p-2 space-y-1">
                {conflictMembers.map(conflict => (
                  <div 
                    key={conflict.employeeId}
                    className={`flex items-center gap-3 p-2.5 rounded-lg cursor-pointer transition-colors ${
                      confirmedConflictIds.includes(conflict.employeeId) 
                        ? 'bg-[#f0f7ff] border border-[#3e79f7]/20' 
                        : 'hover:bg-[#f7f7f8] border border-transparent'
                    }`}
                    onClick={() => toggleConflictMember(conflict.employeeId)}
                  >
                    <div 
                      className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                        confirmedConflictIds.includes(conflict.employeeId)
                          ? 'bg-[#3e79f7] border-[#3e79f7]'
                          : 'border-[#d9d9d9] bg-white'
                      }`}
                    >
                      {confirmedConflictIds.includes(conflict.employeeId) && (
                        <CheckCircle className="w-3 h-3 text-white" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[#1a3353] truncate">{conflict.employeeName}</p>
                      <div className="flex items-center gap-2 text-xs text-[#72849a]">
                        <span className="truncate">Nhóm hiện tại:</span>
                        <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4 bg-amber-50 text-amber-700 border-amber-200 font-normal">
                          {conflict.currentTeamName}
                        </Badge>
                      </div>
                      <p className="text-xs text-[#72849a] truncate">{conflict.departmentName}</p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <p className="text-xs text-[#72849a] italic">
              * Nhân viên được chọn sẽ được chuyển từ nhóm cũ sang nhóm mới
            </p>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleSkipConflict}>
              Bỏ qua
            </Button>
            <Button type="button" onClick={handleConfirmConflict}>
              Thêm vào nhóm ({confirmedConflictIds.length})
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      </>
    )
  }

  const AddRoleForm = ({ onSubmit, onCancel, initialData }: {
    onSubmit: (data: Omit<Role, 'id'>) => void
    onCancel: () => void
    initialData?: Role
  }) => {
    const [formData, setFormData] = useState({
      name: initialData?.name || '',
      description: initialData?.description || '',
      permissions: initialData?.permissions || {
        leads: { view: 'own' as const, create: false, edit: false, delete: false, export: false },
        deals: { view: 'own' as const, create: false, edit: false, delete: false, export: false },
        customers: { view: 'own' as const, create: false, edit: false, delete: false, export: false },
        reports: { view: 'own' as const, create: false, export: false, customReports: false },
        settings: { userManagement: false, systemSettings: false, integrations: false, security: false }
      },
      assignedUsers: initialData?.assignedUsers || 0,
      departmentIds: initialData?.departmentIds || [] as number[],
      teamIds: initialData?.teamIds || [] as number[],
      status: (initialData?.status as Role['status']) || 'active' as Role['status'],
      createdAt: initialData?.createdAt || new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0]
    })

    // Reset form data when initialData changes
    useEffect(() => {
      if (initialData) {
        setFormData({
          name: initialData.name,
          description: initialData.description,
          permissions: initialData.permissions,
          assignedUsers: initialData.assignedUsers,
          departmentIds: initialData.departmentIds,
          teamIds: initialData.teamIds,
          status: initialData.status,
          createdAt: initialData.createdAt,
          updatedAt: new Date().toISOString().split('T')[0]
        })
      }
    }, [initialData])

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault()
      if (!formData.name || !formData.description) {
        alert('Vui lòng điền đầy đủ thông tin bắt buộc')
        return
      }

      onSubmit(formData)
    }

    const handlePermissionChange = (
      module: keyof RolePermissions, 
      permission: string, 
      value: any
    ) => {
      setFormData(prev => ({
        ...prev,
        permissions: {
          ...prev.permissions,
          [module]: {
            ...prev.permissions[module],
            [permission]: value
          }
        }
      }))
    }

    return (
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="roleName">Tên vai trò *</Label>
            <Input
              id="roleName"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              placeholder="Nhập tên vai trò"
              required
            />
          </div>
          <div>
            <Label htmlFor="roleStatus">Trạng thái</Label>
            <Select value={formData.status} onValueChange={(value) => setFormData({...formData, status: value as Role['status']})}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Hoạt động</SelectItem>
                <SelectItem value="inactive">Ngừng hoạt động</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div>
          <Label htmlFor="roleDescription">Mô tả *</Label>
          <Input
            id="roleDescription"
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            placeholder="Mô tả vai trò và trách nhiệm"
            required
          />
        </div>

        <div>
          <Label>Phòng ban áp dụng</Label>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {departments.map((dept) => (
              <label key={dept.id} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.departmentIds.includes(dept.id)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setFormData(prev => ({
                        ...prev,
                        departmentIds: [...prev.departmentIds, dept.id]
                      }))
                    } else {
                      setFormData(prev => ({
                        ...prev,
                        departmentIds: prev.departmentIds.filter(id => id !== dept.id)
                      }))
                    }
                  }}
                />
                <span className="text-sm">{dept.name}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <Label>Nhóm áp dụng</Label>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {teams.map((team) => (
              <label key={team.id} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.teamIds.includes(team.id)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setFormData(prev => ({
                        ...prev,
                        teamIds: [...prev.teamIds, team.id]
                      }))
                    } else {
                      setFormData(prev => ({
                        ...prev,
                        teamIds: prev.teamIds.filter(id => id !== team.id)
                      }))
                    }
                  }}
                />
                <span className="text-sm">{team.name}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Permissions */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Phân quyền</h3>
          
          {/* Leads Permissions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Leads</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <Label>Quyền xem</Label>
                <Select 
                  value={formData.permissions.leads.view} 
                  onValueChange={(value) => handlePermissionChange('leads', 'view', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Không xem</SelectItem>
                    <SelectItem value="own">Chỉ của mình</SelectItem>
                    <SelectItem value="team">Cùng nhóm</SelectItem>
                    <SelectItem value="department">Cùng phòng ban</SelectItem>
                    <SelectItem value="all">Tất cả</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.permissions.leads.create}
                    onChange={(e) => handlePermissionChange('leads', 'create', e.target.checked)}
                  />
                  <span>Tạo mới</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.permissions.leads.edit}
                    onChange={(e) => handlePermissionChange('leads', 'edit', e.target.checked)}
                  />
                  <span>Chỉnh sửa</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.permissions.leads.delete}
                    onChange={(e) => handlePermissionChange('leads', 'delete', e.target.checked)}
                  />
                  <span>Xóa</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.permissions.leads.export}
                    onChange={(e) => handlePermissionChange('leads', 'export', e.target.checked)}
                  />
                  <span>Xuất dữ liệu</span>
                </label>
              </div>
            </CardContent>
          </Card>

          {/* Deals Permissions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Deals</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <Label>Quyền xem</Label>
                <Select 
                  value={formData.permissions.deals.view} 
                  onValueChange={(value) => handlePermissionChange('deals', 'view', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Không xem</SelectItem>
                    <SelectItem value="own">Chỉ của mình</SelectItem>
                    <SelectItem value="team">Cùng nhóm</SelectItem>
                    <SelectItem value="department">Cùng phòng ban</SelectItem>
                    <SelectItem value="all">Tất cả</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.permissions.deals.create}
                    onChange={(e) => handlePermissionChange('deals', 'create', e.target.checked)}
                  />
                  <span>Tạo mới</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.permissions.deals.edit}
                    onChange={(e) => handlePermissionChange('deals', 'edit', e.target.checked)}
                  />
                  <span>Chỉnh sửa</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.permissions.deals.delete}
                    onChange={(e) => handlePermissionChange('deals', 'delete', e.target.checked)}
                  />
                  <span>Xóa</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.permissions.deals.export}
                    onChange={(e) => handlePermissionChange('deals', 'export', e.target.checked)}
                  />
                  <span>Xuất dữ liệu</span>
                </label>
              </div>
            </CardContent>
          </Card>

          {/* Customers Permissions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Khách hàng</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <Label>Quyền xem</Label>
                <Select 
                  value={formData.permissions.customers.view} 
                  onValueChange={(value) => handlePermissionChange('customers', 'view', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Không xem</SelectItem>
                    <SelectItem value="own">Chỉ của mình</SelectItem>
                    <SelectItem value="team">Cùng nhóm</SelectItem>
                    <SelectItem value="department">Cùng phòng ban</SelectItem>
                    <SelectItem value="all">Tất cả</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.permissions.customers.create}
                    onChange={(e) => handlePermissionChange('customers', 'create', e.target.checked)}
                  />
                  <span>Tạo mới</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.permissions.customers.edit}
                    onChange={(e) => handlePermissionChange('customers', 'edit', e.target.checked)}
                  />
                  <span>Chỉnh sửa</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.permissions.customers.delete}
                    onChange={(e) => handlePermissionChange('customers', 'delete', e.target.checked)}
                  />
                  <span>Xóa</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.permissions.customers.export}
                    onChange={(e) => handlePermissionChange('customers', 'export', e.target.checked)}
                  />
                  <span>Xuất dữ liệu</span>
                </label>
              </div>
            </CardContent>
          </Card>

          {/* Reports & Settings */}
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Báo cáo</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label>Quyền xem</Label>
                  <Select 
                    value={formData.permissions.reports.view} 
                    onValueChange={(value) => handlePermissionChange('reports', 'view', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Không xem</SelectItem>
                      <SelectItem value="own">Chỉ của mình</SelectItem>
                      <SelectItem value="team">Cùng nhóm</SelectItem>
                      <SelectItem value="department">Cùng phòng ban</SelectItem>
                      <SelectItem value="all">Tất cả</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.permissions.reports.create}
                      onChange={(e) => handlePermissionChange('reports', 'create', e.target.checked)}
                    />
                    <span>Tạo báo cáo</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.permissions.reports.export}
                      onChange={(e) => handlePermissionChange('reports', 'export', e.target.checked)}
                    />
                    <span>Xuất báo cáo</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.permissions.reports.customReports}
                      onChange={(e) => handlePermissionChange('reports', 'customReports', e.target.checked)}
                    />
                    <span>Báo cáo tùy chỉnh</span>
                  </label>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Cài đặt hệ thống</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.permissions.settings.userManagement}
                    onChange={(e) => handlePermissionChange('settings', 'userManagement', e.target.checked)}
                  />
                  <span>Quản lý người dùng</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.permissions.settings.systemSettings}
                    onChange={(e) => handlePermissionChange('settings', 'systemSettings', e.target.checked)}
                  />
                  <span>Cài đặt hệ thống</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.permissions.settings.integrations}
                    onChange={(e) => handlePermissionChange('settings', 'integrations', e.target.checked)}
                  />
                  <span>Tích hợp</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.permissions.settings.security}
                    onChange={(e) => handlePermissionChange('settings', 'security', e.target.checked)}
                  />
                  <span>Bảo mật</span>
                </label>
              </CardContent>
            </Card>
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onCancel}>
            Hủy
          </Button>
          <Button type="submit">
            {initialData ? 'Cập nhật vai trò' : 'Tạo vai trò'}
          </Button>
        </DialogFooter>
      </form>
    )
  }

  // Edit Form Components
  const EditDepartmentForm = ({ onSubmit, onCancel, initialData }: {
    onSubmit: (data: Partial<Department>) => void
    onCancel: () => void
    initialData: Department
  }) => {
    const [formData, setFormData] = useState({
      name: initialData.name,
      description: initialData.description,
      managerId: initialData.managerId.toString(),
      managerName: initialData.managerName,
      budget: initialData.budget,
      status: initialData.status
    })
    const [selectedMembers, setSelectedMembers] = useState<number[]>(
      initialData.memberIds && initialData.memberIds.length > 0
        ? initialData.memberIds.filter(id => id !== initialData.managerId)
        : employees.filter(emp => emp.departmentId === initialData.id && emp.id !== initialData.managerId).map(emp => emp.id)
    )
    const [memberSearch, setMemberSearch] = useState('')
    const [showConflictDialog, setShowConflictDialog] = useState(false)
    const [conflictMembers, setConflictMembers] = useState<ConflictMember[]>([])
    const [confirmedConflictIds, setConfirmedConflictIds] = useState<number[]>([])
    const [pendingFormData, setPendingFormData] = useState<Partial<Department> | null>(null)

    const findMembersInOtherDepts = (memberIds: number[]): ConflictMember[] => {
      const conflicts: ConflictMember[] = []
      memberIds.forEach(empId => {
        const emp = employees.find(e => e.id === empId)
        if (!emp) return
        if (emp.departmentId > 0 && emp.departmentId !== initialData.id && emp.department) {
          conflicts.push({
            employeeId: empId,
            employeeName: emp.name,
            currentTeamId: emp.departmentId,
            currentTeamName: emp.department,
            departmentName: emp.department
          })
        }
      })
      return conflicts
    }

    const getEmployeeDeptName = (empId: number): string | null => {
      const emp = employees.find(e => e.id === empId)
      if (emp && emp.departmentId > 0 && emp.departmentId !== initialData.id && emp.department) return emp.department
      return null
    }

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault()
      if (!formData.name || !formData.managerId) {
        alert('Vui lòng điền đầy đủ thông tin bắt buộc')
        return
      }
      const manager = employees.find(emp => emp.id === parseInt(formData.managerId))
      const submitData: Partial<Department> = {
        ...formData,
        managerId: parseInt(formData.managerId),
        managerName: manager?.name || '',
        budget: Number(formData.budget),
        employeeCount: selectedMembers.length + (formData.managerId ? 1 : 0),
        memberIds: selectedMembers
      }
      const conflicts = findMembersInOtherDepts(selectedMembers)
      if (conflicts.length > 0) {
        setConflictMembers(conflicts)
        setConfirmedConflictIds(conflicts.map(c => c.employeeId))
        setPendingFormData(submitData)
        setShowConflictDialog(true)
      } else {
        onSubmit(submitData)
      }
    }

    const handleSkipConflict = () => {
      if (!pendingFormData) return
      const conflictIds = conflictMembers.map(c => c.employeeId)
      const membersWithoutConflict = selectedMembers.filter(id => !conflictIds.includes(id))
      onSubmit({ ...pendingFormData, memberIds: membersWithoutConflict, employeeCount: membersWithoutConflict.length + (formData.managerId ? 1 : 0) })
      setShowConflictDialog(false)
    }

    const handleConfirmConflict = () => {
      if (!pendingFormData) return
      const conflictIds = conflictMembers.map(c => c.employeeId)
      const membersWithoutConflict = selectedMembers.filter(id => !conflictIds.includes(id))
      const finalMembers = [...membersWithoutConflict, ...confirmedConflictIds]
      onSubmit({ ...pendingFormData, memberIds: finalMembers, employeeCount: finalMembers.length + (formData.managerId ? 1 : 0) })
      setShowConflictDialog(false)
    }

    const toggleConflictMember = (empId: number) => {
      setConfirmedConflictIds(prev => prev.includes(empId) ? prev.filter(id => id !== empId) : [...prev, empId])
    }

    const filteredEmployees = employees.filter(emp =>
      emp.name.toLowerCase().includes(memberSearch.toLowerCase()) ||
      emp.position.toLowerCase().includes(memberSearch.toLowerCase()) ||
      emp.department.toLowerCase().includes(memberSearch.toLowerCase())
    )

    const toggleMember = (empId: number) => {
      setSelectedMembers(prev => prev.includes(empId) ? prev.filter(id => id !== empId) : [...prev, empId])
    }

    const selectAll = () => {
      const ids = filteredEmployees.filter(emp => emp.id !== parseInt(formData.managerId)).map(emp => emp.id)
      setSelectedMembers(prev => Array.from(new Set([...prev, ...ids])))
    }

    const deselectAll = () => setSelectedMembers([])

    return (
      <>
      <form onSubmit={handleSubmit} className="space-y-4 px-6 pt-2">
        <div className="space-y-2">
          <Label htmlFor="deptName">Tên phòng ban <span className="text-red-500">*</span></Label>
          <Input id="deptName" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="Nhập tên phòng ban" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="description">Mô tả</Label>
          <Input id="description" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} placeholder="Mô tả chức năng phòng ban" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="manager">Trưởng phòng <span className="text-red-500">*</span></Label>
          <Select value={formData.managerId} onValueChange={(value) => {
            const manager = employees.find(emp => emp.id === parseInt(value))
            setFormData({ ...formData, managerId: value, managerName: manager?.name || '' })
          }}>
            <SelectTrigger><SelectValue placeholder="Chọn trưởng phòng" /></SelectTrigger>
            <SelectContent>
              {employees.map((emp) => (<SelectItem key={emp.id} value={emp.id.toString()}>{emp.name} - {emp.position}</SelectItem>))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="deptStatus">Trạng thái</Label>
          <Select value={formData.status} onValueChange={(value) => setFormData({...formData, status: value as Department['status']})}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Hoạt động</SelectItem>
              <SelectItem value="inactive">Ngừng hoạt động</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Member Picker */}
        <div className="space-y-3 pt-2 border-t border-[#e6ebf1]">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">Thành viên phòng ban <span className="text-[#72849a] font-normal">({selectedMembers.length} người)</span></Label>
            <div className="flex items-center gap-2">
              <Button type="button" variant="ghost" size="sm" className="h-7 text-xs text-[#3e79f7] hover:text-[#2a59d1]" onClick={selectAll}>Chọn tất cả</Button>
              <Button type="button" variant="ghost" size="sm" className="h-7 text-xs text-[#72849a] hover:text-[#455560]" onClick={deselectAll}>Bỏ chọn</Button>
            </div>
          </div>
          {selectedMembers.length > 0 && (
            <div className="flex flex-wrap gap-2 p-3 bg-[#f7f7f8] rounded-[10px] max-h-[100px] overflow-y-auto">
              {selectedMembers.map(memberId => {
                const emp = employees.find(e => e.id === memberId)
                return emp ? (
                  <Badge key={memberId} variant="secondary" className="flex items-center gap-1.5 px-2 py-1 bg-white border border-[#e6ebf1] text-[#455560] hover:bg-[#f0f7ff]">
                    <span className="max-w-[120px] truncate">{emp.name}</span>
                    <X className="w-3 h-3 cursor-pointer hover:text-red-500 flex-shrink-0" onClick={() => toggleMember(memberId)} />
                  </Badge>
                ) : null
              })}
            </div>
          )}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#72849a]" />
            <Input placeholder="Tìm kiếm nhân viên theo tên, chức vụ, phòng ban..." value={memberSearch} onChange={(e) => setMemberSearch(e.target.value)} className="pl-9" />
          </div>
          <ScrollArea className="h-[200px] border border-[#e6ebf1] rounded-[10px]">
            <div className="p-2 space-y-1">
              {filteredEmployees.filter(emp => emp.id !== parseInt(formData.managerId)).length === 0 ? (
                <p className="text-sm text-[#72849a] text-center py-8">Không tìm thấy nhân viên phù hợp</p>
              ) : (
                filteredEmployees.filter(emp => emp.id !== parseInt(formData.managerId)).map(emp => (
                  <div key={emp.id} className={`flex items-center gap-3 p-2.5 rounded-lg cursor-pointer transition-colors ${selectedMembers.includes(emp.id) ? 'bg-[#f0f7ff] border border-[#3e79f7]/20' : 'hover:bg-[#f7f7f8] border border-transparent'}`} onClick={() => toggleMember(emp.id)}>
                    <div className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors ${selectedMembers.includes(emp.id) ? 'bg-[#3e79f7] border-[#3e79f7]' : 'border-[#d9d9d9] bg-white'}`}>
                      {selectedMembers.includes(emp.id) && <CheckCircle className="w-3 h-3 text-white" />}
                    </div>
                    <Avatar className="w-8 h-8"><AvatarFallback className="bg-[#3e79f7] text-white text-xs">{emp.name.split(' ').slice(-2).map(n => n[0]).join('')}</AvatarFallback></Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-[#1a3353] truncate">{emp.name}</p>
                        {getEmployeeDeptName(emp.id) && <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4 bg-amber-50 text-amber-700 border-amber-200 font-normal">{getEmployeeDeptName(emp.id)}</Badge>}
                      </div>
                      <p className="text-xs text-[#72849a] truncate">{emp.position} • {emp.department}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </div>

        <DialogFooter className="pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>Hủy</Button>
          <Button type="submit">Cập nhật phòng ban</Button>
        </DialogFooter>
      </form>

      {/* Batch Conflict Dialog */}
      <Dialog open={showConflictDialog} onOpenChange={setShowConflictDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-[#1a3353]">Xác nhận chuyển phòng ban</DialogTitle>
            <DialogDescription>Các nhân viên sau đang thuộc phòng ban khác. Chọn nhân viên muốn chuyển sang phòng ban mới:</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 px-6">
            <div className="flex justify-end gap-2 px-1">
              <Button type="button" variant="ghost" size="sm" className="h-7 text-xs text-[#3e79f7]" onClick={() => setConfirmedConflictIds(conflictMembers.map(c => c.employeeId))}>Chọn tất cả</Button>
              <Button type="button" variant="ghost" size="sm" className="h-7 text-xs text-[#72849a]" onClick={() => setConfirmedConflictIds([])}>Bỏ chọn</Button>
            </div>
            <div className="space-y-2 max-h-[300px] overflow-y-auto">
              {conflictMembers.map(conflict => {
                const isSelected = confirmedConflictIds.includes(conflict.employeeId)
                return (
                  <div key={conflict.employeeId} className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors border ${isSelected ? 'bg-[#f0f7ff] border-[#3e79f7]/20' : 'bg-white border-gray-200 hover:bg-gray-50'}`} onClick={() => toggleConflictMember(conflict.employeeId)}>
                    <div className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 ${isSelected ? 'bg-[#3e79f7] border-[#3e79f7]' : 'border-[#d9d9d9]'}`}>
                      {isSelected && <CheckCircle className="w-3 h-3 text-white" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[#1a3353]">{conflict.employeeName}</p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-xs text-[#72849a]">Phòng ban hiện tại:</span>
                        <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4 bg-amber-50 text-amber-700 border-amber-200 font-normal">{conflict.currentTeamName}</Badge>
                      </div>
                      <p className="text-xs text-[#72849a]">{conflict.departmentName}</p>
                    </div>
                  </div>
                )
              })}
            </div>
            <p className="text-xs text-amber-600 italic px-1">* Nhân viên được chọn sẽ được chuyển từ phòng ban cũ sang phòng ban mới</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleSkipConflict}>Bỏ qua</Button>
            <Button onClick={handleConfirmConflict} disabled={confirmedConflictIds.length === 0}>Cập nhật phòng ban ({confirmedConflictIds.length})</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      </>
    )
  }

  const EditTeamForm = ({ onSubmit, onCancel, initialData }: {
    onSubmit: (data: Partial<Team>) => void
    onCancel: () => void
    initialData: Team
  }) => {
    const [formData, setFormData] = useState({
      name: initialData.name,
      description: initialData.description,
      departmentId: initialData.departmentId.toString(),
      departmentName: initialData.departmentName,
      leaderId: initialData.leaderId.toString(),
      leaderName: initialData.leaderName,
      status: initialData.status
    })
    const [selectedMembers, setSelectedMembers] = useState<number[]>(initialData.memberIds || [])
    const [memberSearchQuery, setMemberSearchQuery] = useState('')
    
    // Conflict dialog states
    const [showConflictDialog, setShowConflictDialog] = useState(false)
    const [conflictMembers, setConflictMembers] = useState<ConflictMember[]>([])
    const [confirmedConflictIds, setConfirmedConflictIds] = useState<number[]>([])
    const [pendingFormData, setPendingFormData] = useState<Partial<Team> | null>(null)

    // Helper function to find members in other teams (excluding current team)
    const findMembersInOtherTeams = (memberIds: number[], currentTeamId: number): ConflictMember[] => {
      const conflicts: ConflictMember[] = []
      // Only check new members (not already in current team)
      const newMemberIds = memberIds.filter(id => !initialData.memberIds.includes(id))
      
      newMemberIds.forEach(empId => {
        const emp = employees.find(e => e.id === empId)
        if (!emp) return
        
        // Check if this employee is in any other team
        for (const team of teams) {
          if (team.id === currentTeamId) continue // Skip current team
          if (team.memberIds.includes(empId)) {
            conflicts.push({
              employeeId: empId,
              employeeName: emp.name,
              currentTeamId: team.id,
              currentTeamName: team.name,
              departmentName: emp.department
            })
            break
          }
        }
      })
      return conflicts
    }

    // Get team name for an employee (excluding current team)
    const getEmployeeTeamName = (empId: number): string | null => {
      for (const team of teams) {
        if (team.id === initialData.id) continue // Skip current team
        if (team.memberIds.includes(empId)) {
          return team.name
        }
      }
      return null
    }

    // Filter employees by search query (show all active employees)
    const availableEmployees = employees.filter(emp => 
      emp.status === 'active' &&
      (emp.name.toLowerCase().includes(memberSearchQuery.toLowerCase()) ||
       emp.position.toLowerCase().includes(memberSearchQuery.toLowerCase()) ||
       emp.department.toLowerCase().includes(memberSearchQuery.toLowerCase()))
    )

    // Toggle member selection
    const toggleMember = (empId: number) => {
      setSelectedMembers(prev => 
        prev.includes(empId) 
          ? prev.filter(id => id !== empId)
          : [...prev, empId]
      )
    }

    // Select all visible employees
    const selectAll = () => {
      const visibleIds = availableEmployees.map(emp => emp.id)
      setSelectedMembers(prev => {
        const newSet = new Set([...prev, ...visibleIds])
        return Array.from(newSet)
      })
    }

    // Deselect all
    const deselectAll = () => {
      setSelectedMembers([])
    }

    // Toggle conflict member selection
    const toggleConflictMember = (empId: number) => {
      setConfirmedConflictIds(prev => 
        prev.includes(empId) 
          ? prev.filter(id => id !== empId)
          : [...prev, empId]
      )
    }

    // Handle skip - only add members without existing team
    const handleSkipConflict = () => {
      if (!pendingFormData) return
      const conflictIds = conflictMembers.map(c => c.employeeId)
      const membersWithoutConflict = selectedMembers.filter(id => !conflictIds.includes(id))
      onSubmit({
        ...pendingFormData,
        memberIds: membersWithoutConflict,
        memberCount: membersWithoutConflict.length
      })
      setShowConflictDialog(false)
    }

    // Handle confirm - add selected members including confirmed transfers
    const handleConfirmConflict = () => {
      if (!pendingFormData) return
      const conflictIds = conflictMembers.map(c => c.employeeId)
      const membersWithoutConflict = selectedMembers.filter(id => !conflictIds.includes(id))
      const finalMembers = [...membersWithoutConflict, ...confirmedConflictIds]
      onSubmit({
        ...pendingFormData,
        memberIds: finalMembers,
        memberCount: finalMembers.length
      })
      setShowConflictDialog(false)
    }

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault()
      if (!formData.name || !formData.departmentId || !formData.leaderId) {
        alert('Vui lòng điền đầy đủ thông tin bắt buộc')
        return
      }

      const department = departments.find(dept => dept.id === parseInt(formData.departmentId))
      const leader = employees.find(emp => emp.id === parseInt(formData.leaderId))
      
      const submitData: Partial<Team> = {
        ...formData,
        departmentId: parseInt(formData.departmentId),
        departmentName: department?.name || '',
        leaderId: parseInt(formData.leaderId),
        leaderName: leader?.name || '',
        memberIds: selectedMembers,
        memberCount: selectedMembers.length
      }

      // Check for conflicts (only for newly added members)
      const conflicts = findMembersInOtherTeams(selectedMembers, initialData.id)
      if (conflicts.length > 0) {
        setConflictMembers(conflicts)
        setConfirmedConflictIds(conflicts.map(c => c.employeeId)) // Default: select all
        setPendingFormData(submitData)
        setShowConflictDialog(true)
      } else {
        onSubmit(submitData)
      }
    }

    return (
      <>
      <form onSubmit={handleSubmit} className="space-y-4 px-6 pt-2">
        <div className="space-y-2">
          <Label htmlFor="teamName">Tên nhóm <span className="text-red-500">*</span></Label>
          <Input
            id="teamName"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            placeholder="Nhập tên nhóm"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="description">Mô tả</Label>
          <Input
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            placeholder="Mô tả chức năng nhóm"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="department">Phòng ban <span className="text-red-500">*</span></Label>
          <Select value={formData.departmentId} onValueChange={(value) => {
            const department = departments.find(dept => dept.id === parseInt(value))
            setFormData({
              ...formData, 
              departmentId: value,
              departmentName: department?.name || ''
            })
          }}>
            <SelectTrigger>
              <SelectValue placeholder="Chọn phòng ban" />
            </SelectTrigger>
            <SelectContent>
              {departments.map((dept) => (
                <SelectItem key={dept.id} value={dept.id.toString()}>
                  {dept.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="leader">Trưởng nhóm <span className="text-red-500">*</span></Label>
          <Select value={formData.leaderId} onValueChange={(value) => {
            const leader = employees.find(emp => emp.id === parseInt(value))
            setFormData({
              ...formData, 
              leaderId: value,
              leaderName: leader?.name || ''
            })
          }}>
            <SelectTrigger>
              <SelectValue placeholder="Chọn trưởng nhóm" />
            </SelectTrigger>
            <SelectContent>
              {employees.map((emp) => (
                <SelectItem key={emp.id} value={emp.id.toString()}>
                  {emp.name} - {emp.position}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="teamStatus">Trạng thái</Label>
          <Select value={formData.status} onValueChange={(value) => setFormData({...formData, status: value as Team['status']})}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Hoạt động</SelectItem>
              <SelectItem value="inactive">Ngừng hoạt động</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Member Selection Section */}
        <div className="space-y-3 pt-2 border-t border-[#e6ebf1]">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">
              Thành viên nhóm <span className="text-[#72849a] font-normal">({selectedMembers.length} người)</span>
            </Label>
            <div className="flex items-center gap-2">
              <Button type="button" variant="ghost" size="sm" className="h-7 text-xs text-[#3e79f7] hover:text-[#2a59d1]" onClick={selectAll}>
                Chọn tất cả
              </Button>
              <Button type="button" variant="ghost" size="sm" className="h-7 text-xs text-[#72849a] hover:text-[#455560]" onClick={deselectAll}>
                Bỏ chọn
              </Button>
            </div>
          </div>

          {/* Selected Members Display */}
          {selectedMembers.length > 0 && (
            <div className="flex flex-wrap gap-2 p-3 bg-[#f7f7f8] rounded-[10px] max-h-[100px] overflow-y-auto">
              {selectedMembers.map(memberId => {
                const emp = employees.find(e => e.id === memberId)
                return emp ? (
                  <Badge 
                    key={memberId} 
                    variant="secondary" 
                    className="flex items-center gap-1.5 px-2 py-1 bg-white border border-[#e6ebf1] text-[#455560] hover:bg-[#f0f7ff]"
                  >
                    <span className="max-w-[120px] truncate">{emp.name}</span>
                    <X 
                      className="w-3 h-3 cursor-pointer hover:text-red-500 flex-shrink-0" 
                      onClick={() => toggleMember(memberId)}
                    />
                  </Badge>
                ) : null
              })}
            </div>
          )}

          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#72849a]" />
            <Input
              placeholder="Tìm kiếm nhân viên theo tên, chức vụ, phòng ban..."
              value={memberSearchQuery}
              onChange={(e) => setMemberSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Employee List */}
          <ScrollArea className="h-[200px] border border-[#e6ebf1] rounded-[10px]">
            <div className="p-2 space-y-1">
              {availableEmployees.length === 0 ? (
                <p className="text-sm text-[#72849a] text-center py-8">Không tìm thấy nhân viên phù hợp</p>
              ) : (
                availableEmployees.map(emp => (
                  <div 
                    key={emp.id}
                    className={`flex items-center gap-3 p-2.5 rounded-lg cursor-pointer transition-colors ${
                      selectedMembers.includes(emp.id) 
                        ? 'bg-[#f0f7ff] border border-[#3e79f7]/20' 
                        : 'hover:bg-[#f7f7f8] border border-transparent'
                    }`}
                    onClick={() => toggleMember(emp.id)}
                  >
                    <div 
                      className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                        selectedMembers.includes(emp.id)
                          ? 'bg-[#3e79f7] border-[#3e79f7]'
                          : 'border-[#d9d9d9] bg-white'
                      }`}
                    >
                      {selectedMembers.includes(emp.id) && (
                        <CheckCircle className="w-3 h-3 text-white" />
                      )}
                    </div>
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="bg-[#3e79f7] text-white text-xs">
                        {emp.name.split(' ').slice(-2).map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-[#1a3353] truncate">{emp.name}</p>
                        {getEmployeeTeamName(emp.id) && (
                          <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4 bg-amber-50 text-amber-700 border-amber-200 font-normal">
                            {getEmployeeTeamName(emp.id)}
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-[#72849a] truncate">{emp.position} • {emp.department}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </div>

        <DialogFooter className="pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Hủy
          </Button>
          <Button type="submit">
            Cập nhật nhóm
          </Button>
        </DialogFooter>
      </form>

      {/* Member Conflict Dialog */}
      <Dialog open={showConflictDialog} onOpenChange={setShowConflictDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-[#1a3353]">Xác nhận chuyển nhóm</DialogTitle>
            <DialogDescription>
              Các nhân viên sau đang thuộc nhóm khác. Chọn nhân viên muốn chuyển sang nhóm này:
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-3">
            {/* Select All / Deselect All buttons */}
            <div className="flex items-center justify-end gap-2 pb-2 border-b border-[#e6ebf1]">
              <Button 
                type="button" 
                variant="ghost" 
                size="sm" 
                className="h-7 text-xs text-[#3e79f7] hover:text-[#2a59d1]"
                onClick={() => setConfirmedConflictIds(conflictMembers.map(c => c.employeeId))}
              >
                Chọn tất cả
              </Button>
              <Button 
                type="button" 
                variant="ghost" 
                size="sm" 
                className="h-7 text-xs text-[#72849a] hover:text-[#455560]"
                onClick={() => setConfirmedConflictIds([])}
              >
                Bỏ chọn
              </Button>
            </div>

            {/* Conflict Members List */}
            <ScrollArea className="h-[200px] border border-[#e6ebf1] rounded-[10px]">
              <div className="p-2 space-y-1">
                {conflictMembers.map(conflict => (
                  <div 
                    key={conflict.employeeId}
                    className={`flex items-center gap-3 p-2.5 rounded-lg cursor-pointer transition-colors ${
                      confirmedConflictIds.includes(conflict.employeeId) 
                        ? 'bg-[#f0f7ff] border border-[#3e79f7]/20' 
                        : 'hover:bg-[#f7f7f8] border border-transparent'
                    }`}
                    onClick={() => toggleConflictMember(conflict.employeeId)}
                  >
                    <div 
                      className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                        confirmedConflictIds.includes(conflict.employeeId)
                          ? 'bg-[#3e79f7] border-[#3e79f7]'
                          : 'border-[#d9d9d9] bg-white'
                      }`}
                    >
                      {confirmedConflictIds.includes(conflict.employeeId) && (
                        <CheckCircle className="w-3 h-3 text-white" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[#1a3353] truncate">{conflict.employeeName}</p>
                      <div className="flex items-center gap-2 text-xs text-[#72849a]">
                        <span className="truncate">Nhóm hiện tại:</span>
                        <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4 bg-amber-50 text-amber-700 border-amber-200 font-normal">
                          {conflict.currentTeamName}
                        </Badge>
                      </div>
                      <p className="text-xs text-[#72849a] truncate">{conflict.departmentName}</p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <p className="text-xs text-[#72849a] italic">
              * Nhân viên được chọn sẽ được chuyển từ nhóm cũ sang nhóm này
            </p>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleSkipConflict}>
              Bỏ qua
            </Button>
            <Button type="button" onClick={handleConfirmConflict}>
              Thêm vào nhóm ({confirmedConflictIds.length})
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      </>
    )
  }

  const EmployeeManagement = () => (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-[#1a3353]">Quản lý Nhân viên</h2>
          <p className="text-sm text-[#455560]">Quản lý thông tin chi tiết nhân viên</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Xuất danh sách
          </Button>
          <Button size="sm" onClick={() => setShowAddEmployeeModal(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Thêm nhân viên
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center space-x-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm nhân viên..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>
        <Select defaultValue="all">
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Trạng thái" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả trạng thái</SelectItem>
            <SelectItem value="active">Hoạt động</SelectItem>
            <SelectItem value="inactive">Ngừng hoạt động</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Employee Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>STT</TableHead>
              <TableHead>Nhân viên</TableHead>
              <TableHead>Vị trí</TableHead>
              <TableHead>Vai trò</TableHead>
              <TableHead>Phòng ban</TableHead>
              <TableHead>Nhóm</TableHead>
              <TableHead>Ngày vào</TableHead>
              <TableHead>Ngày chính thức</TableHead>
              <TableHead>Lương</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead className="text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredEmployees.map((employee, index) => (
              <TableRow key={employee.id}>
                <TableCell>
                  <span className="font-medium text-gray-600">{index + 1}</span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarImage src={employee.avatar} />
                      <AvatarFallback>{employee.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{employee.name}</p>
                      <p className="text-sm text-gray-500">{employee.email}</p>
                      <p className="text-xs text-gray-400">{employee.phone}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="font-medium">{employee.position}</span>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                    {employee.roleName}
                  </Badge>
                </TableCell>
                <TableCell>
                  <span className="font-medium">{employee.department}</span>
                </TableCell>
                <TableCell>
                  <span className="text-sm text-gray-600">{employee.teamName}</span>
                </TableCell>
                <TableCell>{formatDate(employee.hireDate)}</TableCell>
                <TableCell>
                  {employee.status === 'probation' ? (
                    <span className="text-yellow-600 italic">Chưa chính thức</span>
                  ) : (
                    <span className="font-medium text-green-600">
                      {formatDate(employee.officialDate)}
                    </span>
                  )}
                </TableCell>
                <TableCell>{formatCurrency(employee.salary)}</TableCell>
                <TableCell>{getStatusBadge(employee.status)}</TableCell>
                <TableCell className="text-center">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Mở menu</span>
                        <Settings className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="min-w-[200px]">
                      <DropdownMenuLabel>Thông tin</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => {
                        setSelectedEmployee(employee)
                        setShowDetailModal(true)
                      }}>
                        <Eye className="mr-2 h-4 w-4" />
                        Xem chi tiết
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => {
                        setSelectedEmployee(employee)
                        setEditFormData(employee)
                        setShowEditModal(true)
                      }}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Chỉnh sửa
                      </DropdownMenuItem>
                      
                      <DropdownMenuSeparator />
                      <DropdownMenuLabel>Thao tác nhanh</DropdownMenuLabel>
                      
                      <DropdownMenuItem onClick={() => {
                        setSelectedEmployee(employee)
                        setNewPosition(employee.position)
                        setShowPositionModal(true)
                      }}>
                        <ArrowRightLeft className="mr-2 h-4 w-4" />
                        Chuyển vị trí
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => {
                        setSelectedEmployee(employee)
                        setNewDepartmentId(employee.departmentId.toString())
                        setShowDepartmentModal(true)
                      }}>
                        <Building2 className="mr-2 h-4 w-4" />
                        Chuyển phòng ban
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => {
                        setSelectedEmployee(employee)
                        setNewRoleId(employee.roleId?.toString() || '')
                        setShowRoleModal(true)
                      }}>
                        <UserCog className="mr-2 h-4 w-4" />
                        Chuyển vai trò
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => {
                        setSelectedEmployee(employee)
                        setNewStatus(employee.status)
                        setShowStatusModal(true)
                      }}>
                        <ToggleLeft className="mr-2 h-4 w-4" />
                        Thay đổi trạng thái
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => {
                        setSelectedEmployee(employee)
                        setNewOfficialDate(employee.officialDate)
                        setShowOfficialDateModal(true)
                      }}>
                        <CalendarCheck className="mr-2 h-4 w-4" />
                        Cập nhật ngày chính thức
                      </DropdownMenuItem>
                      
                      <DropdownMenuSeparator />
                      <DropdownMenuLabel className="text-red-500">Thao tác nguy hiểm</DropdownMenuLabel>
                      <DropdownMenuItem 
                        className="text-red-500 focus:text-red-600 focus:bg-red-50"
                        onClick={() => {
                          if (confirm('Bạn có chắc chắn muốn xóa nhân viên này?')) {
                            // Handle delete employee
                          }
                        }}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Xóa nhân viên
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  )

  const DepartmentManagement = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-[#1a3353]">Quản lý Phòng ban</h2>
          <p className="text-sm text-[#455560]">Quản lý các phòng ban trong công ty</p>
        </div>
        <Button size="sm" onClick={() => setShowAddDepartmentModal(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Thêm phòng ban
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center space-x-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm phòng ban..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>
        <Select defaultValue="all">
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Trạng thái" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả trạng thái</SelectItem>
            <SelectItem value="active">Hoạt động</SelectItem>
            <SelectItem value="inactive">Ngừng hoạt động</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Department Table */}
      <Card>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">STT</TableHead>
                <TableHead>Tên phòng ban</TableHead>
                <TableHead>Mô tả</TableHead>
                <TableHead>Trưởng phòng</TableHead>
                <TableHead className="w-32">Số nhân viên</TableHead>
                <TableHead className="w-32">Trạng thái</TableHead>
                <TableHead className="w-24 text-center sticky right-0 bg-white">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDepartments.map((dept, index) => (
                <TableRow key={dept.id}>
                  <TableCell>
                    <span className="font-medium text-gray-600">{index + 1}</span>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium">{dept.name}</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-gray-600">{dept.description}</span>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium">{dept.managerName}</span>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium">{dept.employeeCount}</span>
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(dept.status)}
                  </TableCell>
                  <TableCell className="sticky right-0 bg-white relative">
                    <div className="flex justify-center">
                      <button
                        className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                        title="Thao tác"
                        onClick={() => setDeptActionMenuOpen(deptActionMenuOpen === dept.id ? null : dept.id)}
                      >
                        <Settings className="w-4 h-4" />
                      </button>
                    </div>
                    {deptActionMenuOpen === dept.id && (
                      <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                        <div className="px-3 py-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Thao tác nhanh</div>
                        <button
                          className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                          onClick={() => {
                            setSelectedDepartment(dept)
                            setShowEditDepartmentModal(true)
                            setDeptActionMenuOpen(null)
                          }}
                        >
                          <Pencil className="w-4 h-4 text-blue-500" />
                          Chỉnh sửa
                        </button>
                        <button
                          className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                          onClick={() => {
                            if (confirm('Bạn có chắc chắn muốn xóa phòng ban này?')) {
                              setDepartments(departments.filter(d => d.id !== dept.id))
                            }
                            setDeptActionMenuOpen(null)
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                          Xóa
                        </button>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  )

  const TeamManagement = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-[#1a3353]">Quản lý Nhóm</h2>
          <p className="text-sm text-[#455560]">Quản lý các nhóm làm việc</p>
        </div>
        <Button size="sm" onClick={() => setShowAddTeamModal(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Thêm nhóm
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center space-x-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm nhóm..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>
        <Select defaultValue="all">
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Trạng thái" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả trạng thái</SelectItem>
            <SelectItem value="active">Hoạt động</SelectItem>
            <SelectItem value="inactive">Ngừng hoạt động</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Team Table */}
      <Card>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">STT</TableHead>
                <TableHead>Tên nhóm</TableHead>
                <TableHead>Mô tả</TableHead>
                <TableHead>Phòng ban</TableHead>
                <TableHead>Trưởng nhóm</TableHead>
                <TableHead className="w-32">Số thành viên</TableHead>
                <TableHead className="w-32">Trạng thái</TableHead>
                <TableHead className="w-24 text-center sticky right-0 bg-white">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTeams.map((team, index) => (
                <TableRow key={team.id}>
                  <TableCell>
                    <span className="font-medium text-gray-600">{index + 1}</span>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium">{team.name}</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-gray-600">{team.description}</span>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                      {team.departmentName}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium">{team.leaderName}</span>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium">{team.memberCount}</span>
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(team.status)}
                  </TableCell>
                  <TableCell className="sticky right-0 bg-white relative">
                    <div className="flex justify-center">
                      <button
                        className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                        title="Thao tác"
                        onClick={() => setTeamActionMenuOpen(teamActionMenuOpen === team.id ? null : team.id)}
                      >
                        <Settings className="w-4 h-4" />
                      </button>
                    </div>
                    {teamActionMenuOpen === team.id && (
                      <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                        <div className="px-3 py-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Thao tác nhanh</div>
                        <button
                          className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                          onClick={() => {
                            setSelectedTeam(team)
                            setShowEditTeamModal(true)
                            setTeamActionMenuOpen(null)
                          }}
                        >
                          <Pencil className="w-4 h-4 text-blue-500" />
                          Chỉnh sửa
                        </button>
                        <button
                          className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                          onClick={() => {
                            if (confirm('Bạn có chắc chắn muốn xóa nhóm này?')) {
                              setTeams(teams.filter(t => t.id !== team.id))
                            }
                            setTeamActionMenuOpen(null)
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                          Xóa
                        </button>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  )

  const RoleManagement = () => {
    const [selectedRoleId, setSelectedRoleId] = useState<number>(roles[0]?.id || 1)
    const selectedRoleData = roles.find(r => r.id === selectedRoleId) || roles[0]
    
    // Permission states for selected role
    const [tablePermission, setTablePermission] = useState<'manage' | 'edit' | 'view' | 'none'>('edit')
    const [recordPermission, setRecordPermission] = useState<string>('edit_all')
    const [fieldPermission, setFieldPermission] = useState<string>('edit_specified')
    const [viewPermission, setViewPermission] = useState<string>('view_all')
    const [canEditViews, setCanEditViews] = useState(false)
    const [visibleViews, setVisibleViews] = useState<'all' | 'specific'>('all')

    // Permission modules from Omichat
    const permissionModules = [
      { id: 'assignmentRule', name: 'Quy tắc phân chia lead', icon: '☑️' },
      { id: 'assignmentSettings', name: 'Cài đặt phân chia lead', icon: '☑️' },
      { id: 'autoTaskTemplate', name: 'Mẫu tác vụ tự động', icon: '📋' },
      { id: 'category', name: 'Danh mục', icon: '📁' },
      { id: 'company', name: 'Công ty', icon: '🏢' },
      { id: 'customerBehaviorConfig', name: 'Cấu hình hành vi khách hàng', icon: '⚙️' },
      { id: 'customerTierConfig', name: 'Cấu hình hạng khách hàng', icon: '🏆' },
      { id: 'dashboard', name: 'Bảng điều khiển', icon: '📊' },
      { id: 'department', name: 'Phòng ban', icon: '🏛️' },
      { id: 'embedding', name: 'Dữ liệu nhúng', icon: '📦' },
      { id: 'invoice', name: 'Hóa đơn', icon: '🧾' },
      { id: 'invoiceProduct', name: 'Sản phẩm hóa đơn', icon: '≡' },
      { id: 'kpiAssignment', name: 'Phân công KPI', icon: '🔄' },
      { id: 'kpiDataPoint', name: 'Điểm dữ liệu KPI', icon: '📈' },
      { id: 'kpiDefinition', name: 'Định nghĩa KPI', icon: '📐' },
      { id: 'label', name: 'Nhãn', icon: '🏷️' },
      { id: 'leadQualityFlag', name: 'Cờ đánh giá chất lượng lead', icon: '🚩' },
      { id: 'memberPerformanceStats', name: 'Thống kê hiệu suất thành viên', icon: '📊' },
      { id: 'memberSkill', name: 'Kỹ năng thành viên', icon: '💪' },
      { id: 'memberWorkloadSnapshot', name: 'Ảnh chụp khối lượng công việc', icon: '📸' },
      { id: 'note', name: 'Ghi chú', icon: '📝' },
      { id: 'notificationTemplate', name: 'Mẫu thông báo', icon: '🔔' },
      { id: 'opportunity', name: 'Cơ hội', icon: '💰' },
      { id: 'order', name: 'Đơn hàng', icon: '🛒' },
      { id: 'orderHistory', name: 'Lịch sử đơn hàng', icon: '⏱️' },
      { id: 'payment', name: 'Thanh toán', icon: '💳' },
      { id: 'person', name: 'Mọi người', icon: '👤' },
      { id: 'personProductInterest', name: 'Mối quan tâm sản phẩm', icon: '❤️' },
      { id: 'product', name: 'Sản phẩm', icon: '📦' },
      { id: 'productCategory', name: 'Danh mục sản phẩm', icon: '🔗' },
      { id: 'productOption', name: 'Tùy chọn sản phẩm', icon: '⚙️' },
      { id: 'productOptionValue', name: 'Giá trị tùy chọn sản phẩm', icon: '🔢' },
      { id: 'productVariant', name: 'Biến thể sản phẩm', icon: '🎨' },
      { id: 'productVariantOptionValue', name: 'Giá trị tùy chọn biến thể', icon: '📊' },
      { id: 'province', name: 'Tỉnh / Thành phố', icon: '📍' },
      { id: 'reminder', name: 'Nhắc nhở', icon: '⏰' },
      { id: 'tag', name: 'Thẻ', icon: '🏷️' },
      { id: 'task', name: 'Công việc', icon: '✅' },
      { id: 'taskLabel', name: 'Nhãn công việc', icon: '🏷️' },
      { id: 'team', name: 'Nhóm', icon: '👥' },
      { id: 'ward', name: 'Phường / Xã', icon: '📍' },
    ]

    // Module permissions state
    const [modulePermissions, setModulePermissions] = useState<Record<string, {
      all: boolean
      canRead: boolean
      canUpdate: boolean
      canSoftDelete: boolean
      canDestroy: boolean
    }>>(
      permissionModules.reduce((acc, mod) => ({
        ...acc,
        [mod.id]: { all: false, canRead: false, canUpdate: false, canSoftDelete: false, canDestroy: false }
      }), {})
    )

    const toggleModuleAll = (moduleId: string, checked: boolean) => {
      setModulePermissions(prev => ({
        ...prev,
        [moduleId]: {
          all: checked,
          canRead: checked,
          canUpdate: checked,
          canSoftDelete: checked,
          canDestroy: checked
        }
      }))
    }

    const toggleModulePermission = (moduleId: string, permission: string, checked: boolean) => {
      setModulePermissions(prev => {
        const updated = { ...prev[moduleId], [permission]: checked }
        const allChecked = updated.canRead && updated.canUpdate && updated.canSoftDelete && updated.canDestroy
        return {
          ...prev,
          [moduleId]: { ...updated, all: allChecked }
        }
      })
    }

    return (
      <div className="flex gap-6 h-[calc(100vh-200px)]">
        {/* Left Sidebar - Role List */}
        <div className="w-64 flex-shrink-0 bg-[#1a1f2e] rounded-lg overflow-hidden">
          <div className="p-3">
            {roles.map((role) => (
              <div
                key={role.id}
                className={`flex items-center justify-between px-3 py-2 rounded-md cursor-pointer transition-colors ${
                  selectedRoleId === role.id 
                    ? 'bg-[#3e79f7] text-white' 
                    : 'text-gray-300 hover:bg-[#2a3142]'
                }`}
                onClick={() => setSelectedRoleId(role.id)}
              >
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  <span className="text-sm font-medium">{role.name}</span>
                </div>
                {selectedRoleId === role.id && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-white hover:bg-[#2a59d1]">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => {
                        setSelectedRole(role)
                        setShowEditRoleModal(true)
                      }}>
                        <Pencil className="w-4 h-4 mr-2" />
                        Chỉnh sửa
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="text-red-600"
                        onClick={() => handleDeleteRole(role.id)}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Xóa vai trò
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            ))}
            
            {/* Add Role Button */}
            <div
              className="flex items-center gap-2 px-3 py-2 mt-2 text-gray-400 hover:text-white cursor-pointer transition-colors"
              onClick={() => setShowAddRoleModal(true)}
            >
              <Plus className="w-4 h-4" />
              <span className="text-sm">Add Role</span>
            </div>
          </div>
        </div>

        {/* Right Content - Permission Settings */}
        <div className="flex-1 overflow-y-auto space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-[#1a3353]">
                Phân quyền: {selectedRoleData?.name}
              </h2>
              <p className="text-sm text-[#455560]">{selectedRoleData?.description}</p>
            </div>
            <Button size="sm" onClick={() => {
              // Save permissions
              alert('Đã lưu phân quyền!')
            }}>
              Lưu thay đổi
            </Button>
          </div>

          {/* Table Permissions */}
          <Card>
            <div 
              className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50"
              onClick={() => {}}
            >
              <div className="flex items-center gap-2">
                <div className="p-2 bg-gray-100 rounded">
                  <Package className="w-4 h-4 text-gray-600" />
                </div>
                <span className="font-medium text-[#1a3353]">Table permissions</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">
                  {tablePermission === 'manage' ? 'Can manage' : 
                   tablePermission === 'edit' ? 'Can edit' : 
                   tablePermission === 'view' ? 'View only' : 'No access'}
                </span>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </div>
            </div>
            <div className="px-4 pb-4 space-y-2">
              <label className="flex items-center gap-3 p-2 rounded hover:bg-gray-50 cursor-pointer">
                <input 
                  type="radio" 
                  name="tablePermission" 
                  checked={tablePermission === 'manage'}
                  onChange={() => setTablePermission('manage')}
                  className="w-4 h-4 text-[#3e79f7]"
                />
                <span className="text-sm">Can manage</span>
              </label>
              <label className="flex items-center gap-3 p-2 rounded hover:bg-gray-50 cursor-pointer">
                <input 
                  type="radio" 
                  name="tablePermission" 
                  checked={tablePermission === 'edit'}
                  onChange={() => setTablePermission('edit')}
                  className="w-4 h-4 text-[#3e79f7]"
                />
                <span className="text-sm">Can edit</span>
              </label>
              <label className="flex items-center gap-3 p-2 rounded hover:bg-gray-50 cursor-pointer">
                <input 
                  type="radio" 
                  name="tablePermission" 
                  checked={tablePermission === 'view'}
                  onChange={() => setTablePermission('view')}
                  className="w-4 h-4 text-[#3e79f7]"
                />
                <span className="text-sm">View only</span>
              </label>
              <label className="flex items-center gap-3 p-2 rounded hover:bg-gray-50 cursor-pointer">
                <input 
                  type="radio" 
                  name="tablePermission" 
                  checked={tablePermission === 'none'}
                  onChange={() => setTablePermission('none')}
                  className="w-4 h-4 text-[#3e79f7]"
                />
                <span className="text-sm">No access</span>
              </label>
            </div>
          </Card>

          {/* Specific Permissions */}
          <div className="space-y-1">
            <h3 className="text-sm font-medium text-gray-500 px-1">Specific permissions</h3>
            
            {/* Record permissions */}
            <Card>
              <div className="flex items-center justify-between p-4">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-gray-100 rounded">
                    <Package className="w-4 h-4 text-gray-600" />
                  </div>
                  <span className="font-medium text-[#1a3353]">Record permissions</span>
                </div>
                <Select value={recordPermission} onValueChange={setRecordPermission}>
                  <SelectTrigger className="w-36 h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="edit_all">Can edit all</SelectItem>
                    <SelectItem value="edit_own">Can edit own</SelectItem>
                    <SelectItem value="view_all">View all</SelectItem>
                    <SelectItem value="view_own">View own</SelectItem>
                    <SelectItem value="none">No access</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </Card>

            {/* Field permissions */}
            <Card>
              <div className="flex items-center justify-between p-4">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-gray-100 rounded">
                    <Package className="w-4 h-4 text-gray-600" />
                  </div>
                  <span className="font-medium text-[#1a3353]">Field permissions</span>
                </div>
                <Select value={fieldPermission} onValueChange={setFieldPermission}>
                  <SelectTrigger className="w-44 h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="edit_all">Edit all fields</SelectItem>
                    <SelectItem value="edit_specified">Edit specified fields</SelectItem>
                    <SelectItem value="view_only">View only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </Card>

            {/* View permissions */}
            <Card>
              <div className="flex items-center justify-between p-4 border-b">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-gray-100 rounded">
                    <Eye className="w-4 h-4 text-gray-600" />
                  </div>
                  <span className="font-medium text-[#1a3353]">View permissions</span>
                </div>
                <Select value={viewPermission} onValueChange={setViewPermission}>
                  <SelectTrigger className="w-36 h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="view_all">Can view all</SelectItem>
                    <SelectItem value="view_specified">Specified views</SelectItem>
                    <SelectItem value="none">No access</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="p-4 space-y-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={canEditViews}
                    onChange={(e) => setCanEditViews(e.target.checked)}
                    className="w-4 h-4 rounded text-[#3e79f7]"
                  />
                  <span className="text-sm">Can add, delete or edit views</span>
                </label>
                
                <div className="space-y-2">
                  <span className="text-sm text-gray-500">Visible views</span>
                  <div className="space-y-2 ml-2">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input 
                        type="radio" 
                        name="visibleViews"
                        checked={visibleViews === 'all'}
                        onChange={() => setVisibleViews('all')}
                        className="w-4 h-4 text-[#3e79f7]"
                      />
                      <span className="text-sm">All views</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input 
                        type="radio" 
                        name="visibleViews"
                        checked={visibleViews === 'specific'}
                        onChange={() => setVisibleViews('specific')}
                        className="w-4 h-4 text-[#3e79f7]"
                      />
                      <span className="text-sm">Specific views</span>
                    </label>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Module Permissions Grid */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-500">Phân quyền theo module</h3>
              <div className="relative w-64">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Tìm kiếm quyền..." className="pl-8 h-9" />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              {permissionModules.map((module) => (
                <Card key={module.id} className="overflow-hidden">
                  <div className="flex items-center justify-between p-3 border-b bg-gray-50">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 bg-blue-100 text-blue-600 rounded-lg text-sm">
                        {module.icon}
                      </div>
                      <span className="font-medium text-sm text-gray-700">{module.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500">Tất cả</span>
                      <button
                        onClick={() => toggleModuleAll(module.id, !modulePermissions[module.id]?.all)}
                        className={`w-10 h-5 rounded-full transition-colors ${
                          modulePermissions[module.id]?.all ? 'bg-[#3e79f7]' : 'bg-gray-300'
                        }`}
                      >
                        <div className={`w-4 h-4 bg-white rounded-full shadow transition-transform ${
                          modulePermissions[module.id]?.all ? 'translate-x-5' : 'translate-x-0.5'
                        }`} />
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 p-3">
                    {[
                      { key: 'canRead', label: 'Xem' },
                      { key: 'canUpdate', label: 'Chỉnh sửa' },
                      { key: 'canSoftDelete', label: 'Xóa tạm' },
                      { key: 'canDestroy', label: 'Xóa vĩnh viễn' },
                    ].map((perm) => (
                      <label 
                        key={perm.key}
                        className="flex items-center gap-2 p-2 bg-gray-100 rounded hover:bg-blue-50 cursor-pointer transition-colors"
                      >
                        <input 
                          type="checkbox"
                          checked={modulePermissions[module.id]?.[perm.key as keyof typeof modulePermissions[string]] || false}
                          onChange={(e) => toggleModulePermission(module.id, perm.key, e.target.checked)}
                          className="w-4 h-4 rounded text-[#3e79f7]"
                        />
                        <span className="text-xs">{perm.label}</span>
                      </label>
                    ))}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="inline-flex w-auto -mt-6 -ml-6">
          <TabsTrigger value="departments" className="uppercase">Phòng ban</TabsTrigger>
          <TabsTrigger value="teams" className="uppercase">Nhóm</TabsTrigger>
          <TabsTrigger value="employees" className="uppercase">Nhân viên</TabsTrigger>
        </TabsList>

        <TabsContent value="departments">
          <DepartmentManagement />
        </TabsContent>

        <TabsContent value="teams">
          <TeamManagement />
        </TabsContent>

        <TabsContent value="employees">
          <EmployeeManagement />
        </TabsContent>
      </Tabs>

      {/* Quick Action Modals */}
      {/* Position Modal */}
      <Dialog open={showPositionModal} onOpenChange={setShowPositionModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Chuyển vị trí</DialogTitle>
            <DialogDescription>
              Thay đổi vị trí cho nhân viên: {selectedEmployee?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 px-6">
            <div>
              <Label htmlFor="position">Vị trí mới</Label>
              <Input
                id="position"
                value={newPosition}
                onChange={(e) => setNewPosition(e.target.value)}
                placeholder="Nhập vị trí mới"
              />
            </div>
          </div>
          <DialogFooter className="px-6">
            <Button variant="outline" onClick={() => setShowPositionModal(false)}>
              Hủy
            </Button>
            <Button onClick={() => handleQuickAction('position')}>
              Cập nhật
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Department Modal */}
      <Dialog open={showDepartmentModal} onOpenChange={setShowDepartmentModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Chuyển phòng ban</DialogTitle>
            <DialogDescription>
              Chuyển phòng ban cho nhân viên: {selectedEmployee?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 px-6">
            <div>
              <Label htmlFor="department">Phòng ban mới</Label>
              <Select value={newDepartmentId} onValueChange={setNewDepartmentId}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn phòng ban" />
                </SelectTrigger>
                <SelectContent>
                  {sampleDepartments.map((dept) => (
                    <SelectItem key={dept.id} value={dept.id.toString()}>
                      {dept.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className="px-6">
            <Button variant="outline" onClick={() => setShowDepartmentModal(false)}>
              Hủy
            </Button>
            <Button onClick={() => handleQuickAction('department')}>
              Cập nhật
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Status Modal */}
      <Dialog open={showStatusModal} onOpenChange={setShowStatusModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Thay đổi trạng thái</DialogTitle>
            <DialogDescription>
              Thay đổi trạng thái cho nhân viên: {selectedEmployee?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 px-6">
            <div>
              <Label htmlFor="status">Trạng thái mới</Label>
              <Select value={newStatus} onValueChange={setNewStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Hoạt động</SelectItem>
                  <SelectItem value="inactive">Ngừng hoạt động</SelectItem>
                  <SelectItem value="probation">Thử việc</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className="px-6">
            <Button variant="outline" onClick={() => setShowStatusModal(false)}>
              Hủy
            </Button>
            <Button onClick={() => handleQuickAction('status')}>
              Cập nhật
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Official Date Modal */}
      <Dialog open={showOfficialDateModal} onOpenChange={setShowOfficialDateModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cập nhật ngày chính thức</DialogTitle>
            <DialogDescription>
              Cập nhật ngày lên chính thức cho nhân viên: {selectedEmployee?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 px-6">
            <div>
              <Label htmlFor="officialDate">Ngày chính thức</Label>
              <Input
                id="officialDate"
                type="date"
                value={newOfficialDate}
                onChange={(e) => setNewOfficialDate(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter className="px-6">
            <Button variant="outline" onClick={() => setShowOfficialDateModal(false)}>
              Hủy
            </Button>
            <Button onClick={() => handleQuickAction('officialDate')}>
              Cập nhật
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Salary Modal */}
      <Dialog open={showSalaryModal} onOpenChange={setShowSalaryModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Điều chỉnh lương</DialogTitle>
            <DialogDescription>
              Điều chỉnh lương cho nhân viên: {selectedEmployee?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 px-6">
            <div>
              <Label htmlFor="salary">Lương mới (VND)</Label>
              <Input
                id="salary"
                type="number"
                value={newSalary}
                onChange={(e) => setNewSalary(e.target.value)}
                placeholder="Nhập mức lương mới"
              />
            </div>
          </div>
          <DialogFooter className="px-6">
            <Button variant="outline" onClick={() => setShowSalaryModal(false)}>
              Hủy
            </Button>
            <Button onClick={() => handleQuickAction('salary')}>
              Cập nhật
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Data Transfer Modal */}
      <Dialog open={showDataTransferModal} onOpenChange={setShowDataTransferModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Chuyển dữ liệu nhân viên</DialogTitle>
            <DialogDescription>
              Khi ngừng hoạt động nhân viên <strong>{selectedEmployee?.name}</strong>, bạn có thể chuyển dữ liệu của họ cho nhân viên khác.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 px-6">
            {/* Select employee to transfer to */}
            <div>
              <Label htmlFor="transferTo">Chuyển dữ liệu cho nhân viên</Label>
              <Select value={transferToEmployeeId} onValueChange={setTransferToEmployeeId}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn nhân viên tiếp nhận" />
                </SelectTrigger>
                <SelectContent>
                  {employees
                    .filter(emp => emp.id !== selectedEmployee?.id && emp.status === 'active')
                    .map(emp => (
                      <SelectItem key={emp.id} value={emp.id.toString()}>
                        {emp.name} - {emp.position} ({emp.department})
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            {/* Select data types to transfer */}
            <div>
              <Label>Chọn loại dữ liệu cần chuyển</Label>
              <div className="grid grid-cols-2 gap-4 mt-2">
                {[
                  { value: 'leads', label: 'Leads được phân công', icon: '👥' },
                  { value: 'customers', label: 'Khách hàng phụ trách', icon: '🏢' },
                  { value: 'tasks', label: 'Công việc chưa hoàn thành', icon: '✅' },
                  { value: 'orders', label: 'Đơn hàng đang xử lý', icon: '📦' },
                  { value: 'reports', label: 'Báo cáo cá nhân', icon: '📊' },
                  { value: 'calendar', label: 'Lịch hẹn sắp tới', icon: '📅' }
                ].map(dataType => (
                  <div
                    key={dataType.value}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      selectedDataTypes.includes(dataType.value)
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => {
                      if (selectedDataTypes.includes(dataType.value)) {
                        setSelectedDataTypes(prev => prev.filter(item => item !== dataType.value))
                      } else {
                        setSelectedDataTypes(prev => [...prev, dataType.value])
                      }
                    }}
                  >
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">{dataType.icon}</span>
                      <span className="text-sm font-medium">{dataType.label}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Warning message */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start space-x-2">
                <div className="text-yellow-600">⚠️</div>
                <div className="text-sm text-yellow-800">
                  <p className="font-medium mb-1">Lưu ý quan trọng:</p>
                  <ul className="list-disc list-inside space-y-1 text-xs">
                    <li>Việc chuyển dữ liệu không thể hoàn tác</li>
                    <li>Nhân viên tiếp nhận sẽ có quyền truy cập đầy đủ vào dữ liệu được chuyển</li>
                    <li>Hệ thống sẽ ghi log tất cả thay đổi để audit</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter className="px-6">
            <Button 
              variant="outline" 
              onClick={() => {
                setShowDataTransferModal(false)
                setTransferToEmployeeId('')
                setSelectedDataTypes([])
              }}
            >
              Hủy
            </Button>
            <Button 
              onClick={handleDataTransfer}
              disabled={!transferToEmployeeId || selectedDataTypes.length === 0}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Xác nhận chuyển dữ liệu và ngừng hoạt động
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Detail Modal */}
      <Dialog open={showDetailModal} onOpenChange={setShowDetailModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Chi tiết nhân viên</DialogTitle>
          </DialogHeader>
          {selectedEmployee && (
            <div className="space-y-6 px-6">
              <div className="flex items-center space-x-4">
                <Avatar className="w-16 h-16">
                  <AvatarImage src={selectedEmployee.avatar} />
                  <AvatarFallback className="text-lg">
                    {selectedEmployee.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-xl font-semibold">{selectedEmployee.name}</h3>
                  <p className="text-gray-600">{selectedEmployee.position}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    {getStatusBadge(selectedEmployee.status)}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">Thông tin cá nhân</h4>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <Mail className="w-4 h-4 mr-2 text-gray-400" />
                      <span className="text-sm">{selectedEmployee.email}</span>
                    </div>
                    <div className="flex items-center">
                      <Phone className="w-4 h-4 mr-2 text-gray-400" />
                      <span className="text-sm">{selectedEmployee.phone}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">Thông tin công việc</h4>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <Building2 className="w-4 h-4 mr-2 text-gray-400" />
                      <span className="text-sm">{selectedEmployee.department}</span>
                    </div>
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-2 text-gray-400" />
                      <span className="text-sm">{selectedEmployee.teamName}</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                      <span className="text-sm">Ngày vào: {formatDate(selectedEmployee.hireDate)}</span>
                    </div>
                    <div className="flex items-center">
                      <Award className="w-4 h-4 mr-2 text-gray-400" />
                      <span className="text-sm">Ngày chính thức: {formatDate(selectedEmployee.officialDate)}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">Thông tin lương</h4>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <DollarSign className="w-4 h-4 mr-2 text-gray-400" />
                      <span className="text-sm">{formatCurrency(selectedEmployee.salary)}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">Hiệu suất</h4>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="w-4 h-4 text-gray-400" />
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <div className="w-20 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full"
                              style={{ width: `${selectedEmployee.performance}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium">{selectedEmployee.performance}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setShowDetailModal(false)}>
              Đóng
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa nhân viên</DialogTitle>
            <DialogDescription>
              Cập nhật thông tin cho nhân viên: {selectedEmployee?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 px-6">
            <div>
              <Label htmlFor="edit-name">Họ tên</Label>
              <Input
                id="edit-name"
                value={editFormData.name || ''}
                onChange={(e) => setEditFormData({...editFormData, name: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="edit-email">Email</Label>
              <Input
                id="edit-email"
                type="email"
                value={editFormData.email || ''}
                onChange={(e) => setEditFormData({...editFormData, email: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="edit-phone">Số điện thoại</Label>
              <Input
                id="edit-phone"
                value={editFormData.phone || ''}
                onChange={(e) => setEditFormData({...editFormData, phone: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="edit-position">Vị trí</Label>
              <Input
                id="edit-position"
                value={editFormData.position || ''}
                onChange={(e) => setEditFormData({...editFormData, position: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="edit-department">Phòng ban</Label>
              <Select 
                value={editFormData.departmentId?.toString() || ''} 
                onValueChange={(value) => {
                  const dept = sampleDepartments.find(d => d.id === parseInt(value))
                  setEditFormData({
                    ...editFormData, 
                    departmentId: parseInt(value),
                    department: dept?.name || '',
                    teamId: undefined, // Reset team khi thay đổi phòng ban
                    teamName: ''
                  })
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn phòng ban" />
                </SelectTrigger>
                <SelectContent>
                  {sampleDepartments.map((dept) => (
                    <SelectItem key={dept.id} value={dept.id.toString()}>
                      {dept.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="edit-team">Team</Label>
              <Select 
                value={editFormData.teamId?.toString() || ''} 
                onValueChange={(value) => {
                  const team = teams.find(t => t.id === parseInt(value))
                  setEditFormData({
                    ...editFormData, 
                    teamId: parseInt(value),
                    teamName: team?.name || ''
                  })
                }}
                disabled={!editFormData.departmentId}
              >
                <SelectTrigger>
                  <SelectValue placeholder={editFormData.departmentId ? "Chọn team" : "Chọn phòng ban trước"} />
                </SelectTrigger>
                <SelectContent>
                  {teams
                    .filter(team => team.departmentId === editFormData.departmentId)
                    .map((team) => (
                      <SelectItem key={team.id} value={team.id.toString()}>
                        <div className="flex flex-col">
                          <span className="font-medium">{team.name}</span>
                          <span className="text-xs text-gray-500">{team.description}</span>
                          <span className="text-xs text-blue-600">Trưởng nhóm: {team.leaderName}</span>
                        </div>
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="edit-role">Vai trò</Label>
              <Select 
                value={editFormData.roleId?.toString() || ''} 
                onValueChange={(value) => {
                  const role = roles.find(r => r.id === parseInt(value))
                  setEditFormData({
                    ...editFormData, 
                    roleId: parseInt(value),
                    roleName: role?.name || ''
                  })
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn vai trò" />
                </SelectTrigger>
                <SelectContent>
                  {roles.filter(role => role.status === 'active').map((role) => (
                    <SelectItem key={role.id} value={role.id.toString()}>
                      <div className="flex flex-col">
                        <span className="font-medium">{role.name}</span>
                        <span className="text-xs text-gray-500">{role.description}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="edit-salary">Lương</Label>
              <Input
                id="edit-salary"
                type="number"
                value={editFormData.salary || ''}
                onChange={(e) => setEditFormData({...editFormData, salary: parseInt(e.target.value)})}
              />
            </div>
            <div>
              <Label htmlFor="edit-hire-date">Ngày vào làm</Label>
              <Input
                id="edit-hire-date"
                type="date"
                value={editFormData.hireDate || ''}
                onChange={(e) => setEditFormData({...editFormData, hireDate: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="edit-official-date">Ngày chính thức</Label>
              <Input
                id="edit-official-date"
                type="date"
                value={editFormData.officialDate || ''}
                onChange={(e) => setEditFormData({...editFormData, officialDate: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="edit-resignDate">Ngày nghỉ việc</Label>
              <Input
                id="edit-resignDate"
                type="date"
                value={editFormData.resignDate || ''}
                onChange={(e) => setEditFormData({...editFormData, resignDate: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="edit-status">Trạng thái</Label>
              <Select 
                value={editFormData.status || ''} 
                onValueChange={(value) => setEditFormData({...editFormData, status: value as Employee['status']})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Hoạt động</SelectItem>
                  <SelectItem value="inactive">Ngừng hoạt động</SelectItem>
                  <SelectItem value="probation">Thử việc</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="edit-performance">Hiệu xuất công việc (%)</Label>
              <Input
                id="edit-performance"
                type="number"
                min="0"
                max="100"
                value={editFormData.performance || ''}
                readOnly
                disabled
                className="bg-gray-50 cursor-not-allowed"
              />
              <p className="text-xs text-gray-500 mt-1">
                Hiệu xuất được tính toán tự động từ hệ thống
              </p>
            </div>
          </div>
          <DialogFooter className="px-6">
            <Button variant="outline" onClick={() => setShowEditModal(false)}>
              Hủy
            </Button>
            <Button onClick={handleEditEmployee}>
              Lưu thay đổi
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Employee Modal */}
      <Dialog open={showAddEmployeeModal} onOpenChange={setShowAddEmployeeModal}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Thêm nhân viên mới</DialogTitle>
            <DialogDescription>
              Nhập thông tin để thêm nhân viên mới vào công ty
            </DialogDescription>
          </DialogHeader>
          <AddEmployeeForm onSubmit={handleAddEmployee} onCancel={() => setShowAddEmployeeModal(false)} />
        </DialogContent>
      </Dialog>

      {/* Add Department Modal */}
      <Dialog open={showAddDepartmentModal} onOpenChange={setShowAddDepartmentModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Thêm phòng ban mới</DialogTitle>
            <DialogDescription>
              Nhập thông tin để tạo phòng ban mới trong công ty
            </DialogDescription>
          </DialogHeader>
          <AddDepartmentForm onSubmit={handleAddDepartment} onCancel={() => setShowAddDepartmentModal(false)} />
        </DialogContent>
      </Dialog>

      {/* Add Team Modal */}
      <Dialog open={showAddTeamModal} onOpenChange={setShowAddTeamModal}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Thêm nhóm mới</DialogTitle>
            <DialogDescription>
              Nhập thông tin để tạo nhóm làm việc mới
            </DialogDescription>
          </DialogHeader>
          <AddTeamForm onSubmit={handleAddTeam} onCancel={() => setShowAddTeamModal(false)} />
        </DialogContent>
      </Dialog>

      {/* Add Role Modal */}
      <Dialog open={showAddRoleModal} onOpenChange={setShowAddRoleModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Tạo vai trò mới</DialogTitle>
            <DialogDescription>
              Tạo vai trò mới với phân quyền chi tiết
            </DialogDescription>
          </DialogHeader>
          <AddRoleForm onSubmit={handleAddRole} onCancel={() => setShowAddRoleModal(false)} />
        </DialogContent>
      </Dialog>

      {/* Role Detail Modal */}
      <Dialog open={showRoleDetailModal} onOpenChange={setShowRoleDetailModal}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Chi tiết vai trò</DialogTitle>
          </DialogHeader>
          {selectedRole && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold">{selectedRole.name}</h3>
                  <p className="text-gray-600">{selectedRole.description}</p>
                </div>
                {getStatusBadge(selectedRole.status)}
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-3">Thông tin cơ bản</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Người dùng được gán:</span>
                      <span>{selectedRole.assignedUsers}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Ngày tạo:</span>
                      <span>{formatDate(selectedRole.createdAt)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Cập nhật cuối:</span>
                      <span>{formatDate(selectedRole.updatedAt)}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-3">Phạm vi áp dụng</h4>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-gray-500">Phòng ban: </span>
                      <span>
                        {selectedRole.departmentIds.length > 0 
                          ? selectedRole.departmentIds.map(id => 
                              departments.find(d => d.id === id)?.name || 'N/A'
                            ).join(', ')
                          : 'Tất cả phòng ban'
                        }
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">Nhóm: </span>
                      <span>
                        {selectedRole.teamIds.length > 0 
                          ? selectedRole.teamIds.map(id => 
                              teams.find(t => t.id === id)?.name || 'N/A'
                            ).join(', ')
                          : 'Tất cả nhóm'
                        }
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-3">Chi tiết phân quyền</h4>
                <div className="space-y-4">
                  {/* Leads Permissions */}
                  <div className="border rounded-lg p-4">
                    <h5 className="font-medium mb-2">Leads</h5>
                    <div className="grid grid-cols-5 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Xem: </span>
                        <Badge variant="outline">{selectedRole.permissions.leads.view}</Badge>
                      </div>
                      <div>
                        <span className="text-gray-500">Tạo: </span>
                        {selectedRole.permissions.leads.create ? 
                          <CheckCircle className="w-4 h-4 text-green-500 inline" /> : 
                          <X className="w-4 h-4 text-red-500 inline" />}
                      </div>
                      <div>
                        <span className="text-gray-500">Sửa: </span>
                        {selectedRole.permissions.leads.edit ? 
                          <CheckCircle className="w-4 h-4 text-green-500 inline" /> : 
                          <X className="w-4 h-4 text-red-500 inline" />}
                      </div>
                      <div>
                        <span className="text-gray-500">Xóa: </span>
                        {selectedRole.permissions.leads.delete ? 
                          <CheckCircle className="w-4 h-4 text-green-500 inline" /> : 
                          <X className="w-4 h-4 text-red-500 inline" />}
                      </div>
                      <div>
                        <span className="text-gray-500">Xuất: </span>
                        {selectedRole.permissions.leads.export ? 
                          <CheckCircle className="w-4 h-4 text-green-500 inline" /> : 
                          <X className="w-4 h-4 text-red-500 inline" />}
                      </div>
                    </div>
                  </div>

                  {/* Deals Permissions */}
                  <div className="border rounded-lg p-4">
                    <h5 className="font-medium mb-2">Deals</h5>
                    <div className="grid grid-cols-5 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Xem: </span>
                        <Badge variant="outline">{selectedRole.permissions.deals.view}</Badge>
                      </div>
                      <div>
                        <span className="text-gray-500">Tạo: </span>
                        {selectedRole.permissions.deals.create ? 
                          <CheckCircle className="w-4 h-4 text-green-500 inline" /> : 
                          <X className="w-4 h-4 text-red-500 inline" />}
                      </div>
                      <div>
                        <span className="text-gray-500">Sửa: </span>
                        {selectedRole.permissions.deals.edit ? 
                          <CheckCircle className="w-4 h-4 text-green-500 inline" /> : 
                          <X className="w-4 h-4 text-red-500 inline" />}
                      </div>
                      <div>
                        <span className="text-gray-500">Xóa: </span>
                        {selectedRole.permissions.deals.delete ? 
                          <CheckCircle className="w-4 h-4 text-green-500 inline" /> : 
                          <X className="w-4 h-4 text-red-500 inline" />}
                      </div>
                      <div>
                        <span className="text-gray-500">Xuất: </span>
                        {selectedRole.permissions.deals.export ? 
                          <CheckCircle className="w-4 h-4 text-green-500 inline" /> : 
                          <X className="w-4 h-4 text-red-500 inline" />}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setShowRoleDetailModal(false)}>
              Đóng
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Role Modal */}
      <Dialog open={showEditRoleModal} onOpenChange={setShowEditRoleModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa vai trò</DialogTitle>
            <DialogDescription>
              Cập nhật thông tin và phân quyền cho vai trò: {selectedRole?.name}
            </DialogDescription>
          </DialogHeader>
          <AddRoleForm 
            onSubmit={handleEditRole} 
            onCancel={() => setShowEditRoleModal(false)} 
            initialData={selectedRole || undefined}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Department Modal */}
      <Dialog open={showEditDepartmentModal} onOpenChange={setShowEditDepartmentModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa phòng ban</DialogTitle>
            <DialogDescription>
              Cập nhật thông tin phòng ban: {selectedDepartment?.name}
            </DialogDescription>
          </DialogHeader>
          {selectedDepartment && (
            <EditDepartmentForm 
              key={selectedDepartment.id}
              onSubmit={handleEditDepartment} 
              onCancel={() => setShowEditDepartmentModal(false)}
              initialData={selectedDepartment}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Team Modal */}
      <Dialog open={showEditTeamModal} onOpenChange={setShowEditTeamModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa nhóm</DialogTitle>
            <DialogDescription>
              Cập nhật thông tin nhóm: {selectedTeam?.name}
            </DialogDescription>
          </DialogHeader>
          {selectedTeam && (
            <EditTeamForm 
              onSubmit={handleEditTeam} 
              onCancel={() => setShowEditTeamModal(false)}
              initialData={selectedTeam}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}