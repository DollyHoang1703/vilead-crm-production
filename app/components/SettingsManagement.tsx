'use client'

import { useState } from 'react'
import Image from 'next/image'
import {
  Settings,
  Users,
  Shield,
  Workflow,
  Palette,
  Globe,
  Facebook,
  MessageSquare,
  Tags,
  UserCog,
  Database,
  Clock,
  History,
  Search,
  Plus,
  Edit2,
  Trash2,
  Eye,
  Save,
  X,
  Upload,
  Download,
  Filter,
  MoreHorizontal,
  MoreVertical,
  ChevronDown,
  ChevronRight,
  CheckCircle,
  XCircle,
  HelpCircle,
  AlertTriangle,
  Info,
  Lock,
  Unlock,
  Monitor,
  Smartphone,
  MapPin,
  Calendar,
  Mail,
  Phone,
  Bell,
  Key,
  ArrowUp,
  ArrowDown,
  RefreshCw,
  ExternalLink,
  Copy,
  QrCode,
  Zap,
  Camera,
  Layers,
  FileText,
  BarChart3,
  Target,
  Star,
  Tag,
  User2,
  ShoppingCart
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
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
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
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
import { Progress } from '@/components/ui/progress'
import CompanyManagement from './CompanyManagement'

// Interfaces
interface User {
  id: string
  username: string
  email: string
  fullName: string
  role: string
  department: string
  team: string
  status: 'active' | 'inactive' | 'locked'
  lastLogin: string
  createdAt: string
  permissions: UserPermissions
  workingHours: {
    enabled: boolean
    start: string
    end: string
    days: string[]
  }
}

interface UserPermissions {
  leads: {
    view: 'all' | 'team' | 'own' | 'none'
    create: boolean
    edit: boolean
    delete: boolean
    export: boolean
    tags: string[]
  }
  deals: {
    view: 'all' | 'team' | 'own' | 'none'
    create: boolean
    edit: boolean
    delete: boolean
    export: boolean
    tags: string[]
  }
  customers: {
    view: 'all' | 'team' | 'own' | 'none'
    create: boolean
    edit: boolean
    delete: boolean
    export: boolean
    tags: string[]
  }
  reports: {
    view: 'all' | 'team' | 'own' | 'none'
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

interface UserAction {
  id: string
  userId: string
  userName: string
  action: string
  target: string
  targetId: string
  oldValue: any
  newValue: any
  reason: string
  timestamp: string
  ipAddress: string
  userAgent: string
}

interface SalesStage {
  id: string
  name: string
  description: string
  color: string
  order: number
  team?: string
  product?: string
  isActive: boolean
  isFixed?: boolean  // Giai đoạn cố định không được xóa
  autoTransition: {
    enabled: boolean
    days: number
    nextStage: string
  }
}

interface OrderStatus {
  id: string
  name: string
  description: string
  color: string
  category: 'payment' | 'delivery' | 'contract' | 'other' | 'shipping' | 'processing' | 'completion'
  timeout: {
    enabled: boolean
    days: number
    action: 'notify' | 'auto_change' | 'none'
    nextStatus?: string
  }
  notifications: {
    zalo: boolean
    email: boolean
    app: boolean
  }
  isActive: boolean
}

interface IntegrationConfig {
  id: string
  type: 'zalo' | 'facebook'
  name: string
  status: 'connected' | 'pending' | 'disconnected' | 'error'
  accountId: string // NEW: OA ID / Page ID
  creator: string // NEW: Người tạo / Người liên hệ
  createdAt: string // NEW: Thời gian tạo
  badges: string[] // NEW: Array of badge labels
  config: {
    appId?: string
    token?: string
    webhookUrl?: string
    syncFrequency: number // minutes
    autoTags: string[]
    syncLeads: boolean
    syncMessages: boolean
    syncForms: boolean
    syncNotifications: boolean // NEW: Switch 2
  }
  permissions: {
    connect: string[] // user roles
    edit: string[]
    delete: string[]
  }
  lastSync: string
  errorLog: string[]
}

interface CustomTag {
  id: string
  name: string
  color: string
  category: 'lead' | 'customer' | 'deal' | 'task'
  scope: 'global' | 'team' | 'user'
  scopeId?: string
  isDefault: boolean
  autoAssign: {
    enabled: boolean
    conditions: {
      field: string
      operator: 'equals' | 'not_equals' | 'greater_than' | 'less_than' | 'contains' | 'not_contains'
      value: any
    }[]
  }
  createdBy: string
  createdAt: string
}

interface CustomRole {
  id: string
  name: string
  description: string
  permissions: UserPermissions
  isActive: boolean
  createdBy: string
  createdAt: string
  usersCount: number
}

interface DataTemplate {
  id: string
  type: 'lead' | 'deal' | 'customer'
  name: string
  fields: {
    name: string
    type: 'text' | 'number' | 'select' | 'multiselect' | 'date' | 'boolean'
    required: boolean
    defaultValue: any
    options?: string[]
  }[]
  defaultTags: string[]
  scope: 'global' | 'team' | 'user'
  scopeId?: string
  isActive: boolean
  createdBy: string
  createdAt: string
}

interface SystemLog {
  id: string | number
  category: 'lead_management' | 'deal_management' | 'customer_management' | 'user_management' | 'permissions' | 'workflow' | 'integration' | 'interface' | 'system'
  action: string
  details: string
  performedBy: string
  performedByRole: 'admin' | 'manager' | 'sales' | 'support' | 'system'
  timestamp: string
  affectedEntities: string[]
  changes: {
    before: any
    after: any
  }
  ip: string
  status: 'success' | 'failed' | 'partial_success'
}

interface InterfaceSettings {
  theme: 'light' | 'dark' | 'auto'
  primaryColor: string
  logo: {
    url: string
    width: number
    height: number
  }
  favicon: {
    url: string
  }
  companyName: string
  systemName: string
  language: string
  timezone: string
  dateFormat: string
  numberFormat: string
  currency: string
  sidebarCollapsed: boolean
  tablePageSize: number
  autoSave: boolean
  customCSS: string
  allowCustomization: boolean
}

interface DistributionRule {
  id: string
  name: string
  description: string
  method: 'round_robin' | 'load_based' | 'random'
  assignmentType: 'department' | 'team' | 'individual'
  assignedTargets: string[]  // Changed to array for multiple selections
  isActive: boolean
  leadsAssigned: number
  conditions: {
    source?: string[]
    maxLeads?: number
    timeRange?: string
    priority?: string
  }
  createdAt: string
  lastModified: string
}

// Sample Data
const sampleDistributionRules: DistributionRule[] = [
  {
    id: '1',
    name: 'Phân bổ leads website',
    description: 'Tự động phân bổ leads từ website cho team sales',
    method: 'round_robin',
    assignmentType: 'department',
    assignedTargets: ['Phòng Sales'],
    isActive: true,
    leadsAssigned: 145,
    conditions: {
      source: ['website'],
      maxLeads: 100,
      timeRange: 'business',
      priority: 'medium'
    },
    createdAt: '2025-06-01T00:00:00',
    lastModified: '2025-06-10T00:00:00'
  },
  {
    id: '2',
    name: 'Leads VIP tự động',
    description: 'Phân bổ leads có điểm cao cho Team Sales A và B',
    method: 'load_based',
    assignmentType: 'team',
    assignedTargets: ['Team Sales A', 'Team Sales B'],
    isActive: true,
    leadsAssigned: 78,
    conditions: {
      source: ['all'],
      maxLeads: 50,
      timeRange: 'all',
      priority: 'high'
    },
    createdAt: '2025-05-15T00:00:00',
    lastModified: '2025-06-08T00:00:00'
  },
  {
    id: '3',
    name: 'Leads Zalo OA',
    description: 'Phân bổ leads từ Zalo OA cho telesales',
    method: 'random',
    assignmentType: 'individual',
    assignedTargets: ['Nguyễn Văn A', 'Trần Thị B'],
    isActive: false,
    leadsAssigned: 234,
    conditions: {
      source: ['zalo'],
      maxLeads: 25,
      timeRange: 'all',
      priority: 'low'
    },
    createdAt: '2025-04-20T00:00:00',
    lastModified: '2025-06-05T00:00:00'
  }
]

const sampleUsers: User[] = [
  {
    id: '1',
    username: 'admin',
    email: 'admin@company.com',
    fullName: 'Quản trị viên',
    role: 'admin',
    department: 'IT',
    team: 'Hệ thống',
    status: 'active',
    lastLogin: '2025-06-11T08:30:00',
    createdAt: '2025-01-01T00:00:00',
    workingHours: {
      enabled: false,
      start: '08:00',
      end: '17:00',
      days: ['1', '2', '3', '4', '5']
    },
    permissions: {
      leads: { view: 'all', create: true, edit: true, delete: true, export: true, tags: [] },
      deals: { view: 'all', create: true, edit: true, delete: true, export: true, tags: [] },
      customers: { view: 'all', create: true, edit: true, delete: true, export: true, tags: [] },
      reports: { view: 'all', create: true, export: true, customReports: true },
      settings: { userManagement: true, systemSettings: true, integrations: true, security: true }
    }
  },
  {
    id: '2',
    username: 'sales01',
    email: 'sales01@company.com',
    fullName: 'Nguyễn Văn An',
    role: 'sales',
    department: 'Sales',
    team: 'Team A',
    status: 'active',
    lastLogin: '2025-06-11T09:15:00',
    createdAt: '2025-02-15T00:00:00',
    workingHours: {
      enabled: true,
      start: '08:30',
      end: '17:30',
      days: ['1', '2', '3', '4', '5']
    },
    permissions: {
      leads: { view: 'team', create: true, edit: true, delete: false, export: true, tags: ['Tiềm năng'] },
      deals: { view: 'team', create: true, edit: true, delete: false, export: true, tags: [] },
      customers: { view: 'team', create: true, edit: true, delete: false, export: false, tags: [] },
      reports: { view: 'team', create: false, export: false, customReports: false },
      settings: { userManagement: false, systemSettings: false, integrations: false, security: false }
    }
  }
]

const sampleSalesStages: SalesStage[] = [
  {
    id: 'new',
    name: 'Lead mới',
    description: 'Lead mới được tiếp nhận từ các kênh',
    color: '#3B82F6',
    order: 1,
    isActive: true,
    isFixed: true,  // Giai đoạn cố định
    autoTransition: { enabled: false, days: 1, nextStage: 'contacted' }
  },
  {
    id: 'contacted',
    name: 'Đang tư vấn',
    description: 'Đang liên hệ và tư vấn chi tiết cho khách hàng',
    color: '#F59E0B',
    order: 2,
    isActive: true,
    isFixed: false,  // Giai đoạn tùy chỉnh - có thể xóa
    autoTransition: { enabled: false, days: 3, nextStage: 'qualified' }
  },
  {
    id: 'qualified',
    name: 'Đã gửi ĐX',
    description: 'Đã gửi đề xuất/báo giá cho khách hàng',
    color: '#8B5CF6',
    order: 3,
    isActive: true,
    isFixed: false,  // Giai đoạn tùy chỉnh - có thể xóa
    autoTransition: { enabled: false, days: 5, nextStage: 'negotiation' }
  },
  {
    id: 'negotiation',
    name: 'Đàm phán',
    description: 'Đang trong quá trình đàm phán với khách hàng',
    color: '#EC4899',
    order: 4,
    isActive: true,
    isFixed: false,  // Giai đoạn tùy chỉnh - có thể xóa
    autoTransition: { enabled: false, days: 0, nextStage: 'payment_pending' }
  },
  {
    id: 'payment_pending',
    name: 'Chuyển đổi - chờ thanh toán',
    description: 'Khách hàng đã đồng ý, đang chờ thanh toán',
    color: '#F97316',
    order: 5,
    isActive: true,
    isFixed: true,  // Giai đoạn cố định
    autoTransition: { enabled: false, days: 7, nextStage: 'converted' }
  },
  {
    id: 'converted',
    name: 'Chuyển đổi thành công',
    description: 'Khách hàng đã thanh toán thành công',
    color: '#10B981',
    order: 6,
    isActive: true,
    isFixed: true,  // Giai đoạn cố định
    autoTransition: { enabled: false, days: 0, nextStage: '' }
  },
  {
    id: 'lost',
    name: 'Thất bại',
    description: 'Lead không thành công, không chuyển đổi được',
    color: '#EF4444',
    order: 7,
    isActive: true,
    isFixed: true,  // Giai đoạn cố định
    autoTransition: { enabled: false, days: 0, nextStage: '' }
  }
]

const sampleOrderStatuses: OrderStatus[] = [
  {
    id: '1',
    name: 'Chưa thanh toán',
    description: 'Đơn hàng chưa được thanh toán',
    color: '#EF4444',
    category: 'payment',
    timeout: { enabled: true, days: 3, action: 'notify' },
    notifications: { zalo: false, email: true, app: true },
    isActive: true
  },
  {
    id: '2',
    name: 'Đã thanh toán',
    description: 'Đơn hàng đã được thanh toán',
    color: '#10B981',
    category: 'payment',
    timeout: { enabled: false, days: 0, action: 'none' },
    notifications: { zalo: false, email: false, app: true },
    isActive: true
  }
]

const sampleInterfaceSettings: InterfaceSettings = {
  theme: 'light',
  primaryColor: '#3B82F6',
  logo: {
    url: '/logo.png',
    width: 180,
    height: 60
  },
  favicon: {
    url: '/favicon.ico'
  },
  companyName: 'Công ty ABC',
  systemName: 'CRM System',
  language: 'vi',
  timezone: 'Asia/Ho_Chi_Minh',
  dateFormat: 'DD/MM/YYYY',
  numberFormat: '1,000.00',
  currency: 'VND',
  sidebarCollapsed: false,
  tablePageSize: 20,
  autoSave: true,
  customCSS: '',
  allowCustomization: true
}

const sampleTags: CustomTag[] = [
  {
    id: '1',
    name: 'VIP',
    color: '#F59E0B',
    category: 'customer',
    scope: 'global',
    isDefault: false,
    autoAssign: {
      enabled: true,
      conditions: [
        { field: 'revenue', operator: 'greater_than', value: 100000000 }
      ]
    },
    createdBy: 'admin',
    createdAt: '2025-01-15T00:00:00'
  },
  {
    id: '2',
    name: 'Tiềm năng cao',
    color: '#10B981',
    category: 'lead',
    scope: 'global',
    isDefault: true,
    autoAssign: {
      enabled: true,
      conditions: [
        { field: 'score', operator: 'greater_than', value: 80 }
      ]
    },
    createdBy: 'admin',
    createdAt: '2025-01-15T00:00:00'
  },
  {
    id: '3',
    name: 'Deal lớn',
    color: '#EF4444',
    category: 'deal',
    scope: 'global',
    isDefault: false,
    autoAssign: {
      enabled: true,
      conditions: [
        { field: 'amount', operator: 'greater_than', value: 50000000 }
      ]
    },
    createdBy: 'admin',
    createdAt: '2025-02-01T00:00:00'
  },
  {
    id: '4',
    name: 'Khẩn cấp',
    color: '#DC2626',
    category: 'task',
    scope: 'global',
    isDefault: false,
    autoAssign: {
      enabled: true,
      conditions: [
        { field: 'priority', operator: 'equals', value: 'high' }
      ]
    },
    createdBy: 'admin',
    createdAt: '2025-01-20T00:00:00'
  },
  {
    id: '5',
    name: 'Team A',
    color: '#3B82F6',
    category: 'lead',
    scope: 'team',
    scopeId: 'team-a',
    isDefault: false,
    autoAssign: {
      enabled: true,
      conditions: [
        { field: 'source', operator: 'equals', value: 'website' }
      ]
    },
    createdBy: 'manager',
    createdAt: '2025-03-01T00:00:00'
  }
]

export default function SettingsManagement() {
  const [activeTab, setActiveTab] = useState('workflow')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [showUserModal, setShowUserModal] = useState(false)
  const [showRoleModal, setShowRoleModal] = useState(false)
  const [showStageModal, setShowStageModal] = useState(false)
  const [showEditStageModal, setShowEditStageModal] = useState(false)
  const [showDeleteStageModal, setShowDeleteStageModal] = useState(false)
  const [showStatusModal, setShowStatusModal] = useState(false)
  const [showEditStatusModal, setShowEditStatusModal] = useState(false)
  const [showDeleteStatusModal, setShowDeleteStatusModal] = useState(false)
  const [showTagModal, setShowTagModal] = useState(false)
  const [showTemplateModal, setShowTemplateModal] = useState(false)
  const [showIntegrationModal, setShowIntegrationModal] = useState(false)
  const [selectedIntegrationType, setSelectedIntegrationType] = useState<'zalo-personal' | 'zalo-oa' | 'facebook' | ''>('')
  const [showQRModal, setShowQRModal] = useState(false)
  const [showOALinkModal, setShowOALinkModal] = useState(false)
  const [showOAPermissionModal, setShowOAPermissionModal] = useState(false)
  const [qrCheckStatus, setQRCheckStatus] = useState<'pending' | 'checking' | 'success' | 'error'>('pending')
  const [qrCheckInterval, setQRCheckInterval] = useState<NodeJS.Timeout | null>(null)
  const [selectedRole, setSelectedRole] = useState<any>(null)
  const [selectedStage, setSelectedStage] = useState<SalesStage | null>(null)
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus | null>(null)
  const [statusToDelete, setStatusToDelete] = useState<OrderStatus | null>(null)
  const [transferToStatusId, setTransferToStatusId] = useState<string>('')
  
  // New stage form state
  const [newStageForm, setNewStageForm] = useState({
    name: '',
    description: '',
    color: '#3B82F6',
    position: 'end' as 'start' | 'end' | 'after',
    afterStageId: ''
  })
  
  // Edit status form state
  const [editStatusForm, setEditStatusForm] = useState({
    name: '',
    description: '',
    color: '#3B82F6',
    category: 'payment' as 'payment' | 'delivery' | 'contract' | 'other' | 'shipping' | 'processing' | 'completion',
    notifications: { zalo: false, email: false, app: false }
  })
  
  const [stageToDelete, setStageToDelete] = useState<SalesStage | null>(null)
  const [transferToStageId, setTransferToStageId] = useState<string>('')
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null)
  const [selectedTag, setSelectedTag] = useState<CustomTag | null>(null)
  
  // Data states
  const [users, setUsers] = useState<User[]>(sampleUsers)
  const [salesStages, setSalesStages] = useState<SalesStage[]>(sampleSalesStages)
  const [orderStatuses, setOrderStatuses] = useState<OrderStatus[]>(sampleOrderStatuses)
  const [interfaceSettings, setInterfaceSettings] = useState<InterfaceSettings>(sampleInterfaceSettings)
  const [tags, setTags] = useState<CustomTag[]>(sampleTags)
  const [userActions, setUserActions] = useState<UserAction[]>([])
  const [systemLogs, setSystemLogs] = useState<SystemLog[]>([])
  
  // Filter states
  const [roleFilter, setRoleFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [dateFilter, setDateFilter] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')

  // Utility functions
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('vi-VN')
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'inactive': return 'bg-gray-100 text-gray-800'
      case 'locked': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-purple-100 text-purple-800'
      case 'manager': return 'bg-blue-100 text-blue-800'
      case 'sales': return 'bg-green-100 text-green-800'
      case 'support': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  // Filter logic
  const filteredUsers = users.filter(user => {
    if (roleFilter !== 'all' && user.role !== roleFilter) return false
    if (statusFilter !== 'all' && user.status !== statusFilter) return false
    return true
  })

  // Component: Workflow Management
  const WorkflowManagement = () => {
    // Distribution Rules state
    const [distributionRules, setDistributionRules] = useState<DistributionRule[]>(sampleDistributionRules)
    const [showAddDistributionRule, setShowAddDistributionRule] = useState(false)
    const [showEditDistributionRule, setShowEditDistributionRule] = useState(false)
    const [selectedDistributionRule, setSelectedDistributionRule] = useState<DistributionRule | null>(null)
    const [selectedAssignmentType, setSelectedAssignmentType] = useState<string>('')
    const [individualSearchTerm, setIndividualSearchTerm] = useState<string>('')
    const [individualFilterTeam, setIndividualFilterTeam] = useState<string>('all')
    const [distributionRuleToDelete, setDistributionRuleToDelete] = useState<DistributionRule | null>(null)
    const [selectedTimeRange, setSelectedTimeRange] = useState<string>('all')
    const [editTimeRange, setEditTimeRange] = useState<string>('all')

    const getCategoryColor = (category: string) => {
      switch (category) {
        case 'lead': return 'bg-blue-100 text-blue-800'
        case 'customer': return 'bg-green-100 text-green-800'
        case 'deal': return 'bg-purple-100 text-purple-800'
        case 'task': return 'bg-orange-100 text-orange-800'
        default: return 'bg-gray-100 text-gray-800'
      }
    }

    const getScopeColor = (scope: string) => {
      switch (scope) {
        case 'global': return 'bg-indigo-100 text-indigo-800'
        case 'team': return 'bg-cyan-100 text-cyan-800'
        case 'user': return 'bg-pink-100 text-pink-800'
        default: return 'bg-gray-100 text-gray-800'
      }
    }

    // Distribution Rule Handlers
    const handleEditDistributionRule = (rule: DistributionRule) => {
      setSelectedDistributionRule(rule)
      setShowEditDistributionRule(true)
    }

    const handleDeleteDistributionRule = (ruleId: string) => {
      const rule = distributionRules.find(r => r.id === ruleId)
      if (rule) {
        setDistributionRuleToDelete(rule)
      }
    }

    const handleConfirmDeleteDistributionRule = () => {
      if (distributionRuleToDelete) {
        setDistributionRules(prev => prev.filter(rule => rule.id !== distributionRuleToDelete.id))
        setDistributionRuleToDelete(null)
      }
    }

    const handleToggleDistributionRule = (ruleId: string, isActive: boolean) => {
      setDistributionRules(prev => prev.map(rule => 
        rule.id === ruleId ? { ...rule, isActive } : rule
      ))
    }

    const handleCreateTag = () => {
      setSelectedTag(null)
      setShowTagModal(true)
    }

    const handleEditTag = (tag: CustomTag) => {
      setSelectedTag(tag)
      setShowTagModal(true)
    }

    const handleDeleteTag = (tagId: string) => {
      setTags(prev => prev.filter(t => t.id !== tagId))
    }

    const handleDeleteSalesStage = (stageId: string) => {
      const stage = salesStages.find(s => s.id === stageId)
      if (!stage) return
      
      if (stage.isFixed) {
        alert('Không thể xóa giai đoạn cố định của hệ thống!')
        return
      }
      
      // Giả định có dữ liệu trong giai đoạn này (thực tế sẽ check từ database)
      const hasData = Math.random() > 0.5 // Mô phỏng có data ngẫu nhiên
      
      if (hasData) {
        setStageToDelete(stage)
        setShowDeleteStageModal(true)
      } else {
        if (confirm('Bạn có chắc chắn muốn xóa giai đoạn này?')) {
          setSalesStages(prev => prev.filter(s => s.id !== stageId))
        }
      }
    }

    const handleEditSalesStage = (stage: SalesStage) => {
      setSelectedStage(stage)
      setShowEditStageModal(true)
    }

    const handleAddSalesStage = () => {
      if (!newStageForm.name.trim()) return

      // Calculate new order based on position
      let newOrder = 1
      const nonFixedStages = salesStages.filter(s => !s.isFixed)

      if (newStageForm.position === 'start') {
        // Insert at beginning of non-fixed stages
        const firstNonFixedOrder = Math.min(...nonFixedStages.map(s => s.order))
        newOrder = firstNonFixedOrder - 0.5
      } else if (newStageForm.position === 'end') {
        // Insert at end
        newOrder = Math.max(...salesStages.map(s => s.order)) + 1
      } else if (newStageForm.position === 'after' && newStageForm.afterStageId) {
        // Insert after specific stage
        const afterStage = salesStages.find(s => s.id === newStageForm.afterStageId)
        if (afterStage) {
          const nextStages = salesStages.filter(s => s.order > afterStage.order).sort((a, b) => a.order - b.order)
          if (nextStages.length > 0) {
            newOrder = (afterStage.order + nextStages[0].order) / 2
          } else {
            newOrder = afterStage.order + 1
          }
        }
      }

      const newStage: SalesStage = {
        id: `custom_${Date.now()}`,
        name: newStageForm.name,
        description: newStageForm.description,
        color: newStageForm.color,
        order: newOrder,
        isActive: true,
        isFixed: false,
        autoTransition: {
          enabled: false,
          days: 0,
          nextStage: ''
        }
      }

      setSalesStages(prev => [...prev, newStage].sort((a, b) => a.order - b.order))
      
      // Reset form
      setNewStageForm({
        name: '',
        description: '',
        color: '#3B82F6',
        position: 'end',
        afterStageId: ''
      })
      setShowStageModal(false)
    }

    const handleMoveStage = (stageId: string, direction: 'up' | 'down') => {
      const stage = salesStages.find(s => s.id === stageId)
      if (!stage || stage.isFixed) return

      const nonFixedStages = salesStages.filter(s => !s.isFixed).sort((a, b) => a.order - b.order)
      const currentIndex = nonFixedStages.findIndex(s => s.id === stageId)
      
      if (direction === 'up' && currentIndex > 0) {
        // Swap with previous stage
        const targetIndex = currentIndex - 1
        const targetStage = nonFixedStages[targetIndex]
        
        setSalesStages(prev => prev.map(s => {
          if (s.id === stage.id) return { ...s, order: targetStage.order }
          if (s.id === targetStage.id) return { ...s, order: stage.order }
          return s
        }))
      } else if (direction === 'down' && currentIndex < nonFixedStages.length - 1) {
        // Swap with next stage
        const targetIndex = currentIndex + 1
        const targetStage = nonFixedStages[targetIndex]
        
        setSalesStages(prev => prev.map(s => {
          if (s.id === stage.id) return { ...s, order: targetStage.order }
          if (s.id === targetStage.id) return { ...s, order: stage.order }
          return s
        }))
      }
    }

    const handleConfirmDeleteStage = () => {
      if (!stageToDelete || !transferToStageId) return
      
      // Thực hiện chuyển đổi dữ liệu và xóa giai đoạn
      setSalesStages(prev => prev.filter(s => s.id !== stageToDelete.id))
      
      // Reset states
      setStageToDelete(null)
      setTransferToStageId('')
      setShowDeleteStageModal(false)
      
      alert(`Đã chuyển toàn bộ dữ liệu từ "${stageToDelete.name}" sang giai đoạn khác và xóa giai đoạn thành công!`)
    }

    const handleAddOrderStatus = (statusData: Omit<OrderStatus, 'id'>) => {
      const newId = (Math.max(...orderStatuses.map(s => parseInt(s.id)), 0) + 1).toString()
      const newStatus: OrderStatus = {
        ...statusData,
        id: newId
      }
      setOrderStatuses(prev => [...prev, newStatus])
      setShowStatusModal(false)
    }

    const handleEditOrderStatus = (status: OrderStatus) => {
      setSelectedStatus(status)
      initializeEditForm(status)
      setShowEditStatusModal(true)
    }

    const handleDeleteOrderStatus = (statusId: string) => {
      // Luôn phải có ít nhất 1 trạng thái
      if (orderStatuses.length <= 1) {
        alert('Phải có ít nhất một trạng thái đơn hàng trong hệ thống!')
        return
      }

      const status = orderStatuses.find(s => s.id === statusId)
      if (!status) return
      
      // Giả định có dữ liệu trong trạng thái này
      const hasData = Math.random() > 0.3 // Mô phỏng có data
      
      if (hasData) {
        setStatusToDelete(status)
        setShowDeleteStatusModal(true)
      } else {
        if (confirm('Bạn có chắc chắn muốn xóa trạng thái này?')) {
          setOrderStatuses(prev => prev.filter(s => s.id !== statusId))
        }
      }
    }

    const handleConfirmDeleteStatus = () => {
      if (!statusToDelete || !transferToStatusId) return
      
      // Thực hiện chuyển đổi dữ liệu và xóa trạng thái
      setOrderStatuses(prev => prev.filter(s => s.id !== statusToDelete.id))
      
      // Reset states
      setStatusToDelete(null)
      setTransferToStatusId('')
      setShowDeleteStatusModal(false)
      
      alert(`Đã chuyển toàn bộ đơn hàng từ trạng thái "${statusToDelete.name}" sang trạng thái khác và xóa thành công!`)
    }

    const handleEditOrderStatusSubmit = () => {
      if (!selectedStatus) return

      const updatedStatus = {
        ...selectedStatus,
        name: editStatusForm.name,
        description: editStatusForm.description,
        color: editStatusForm.color,
        category: editStatusForm.category,
        notifications: editStatusForm.notifications
      }

      setOrderStatuses(prev => 
        prev.map(status => 
          status.id === selectedStatus.id ? updatedStatus : status
        )
      )

      setShowEditStatusModal(false)
      setSelectedStatus(null)
      alert('Cập nhật trạng thái đơn hàng thành công!')
    }

    const initializeEditForm = (status: OrderStatus) => {
      setEditStatusForm({
        name: status.name,
        description: status.description,
        color: status.color,
        category: status.category,
        notifications: status.notifications
      })
    }

    const getOperatorText = (operator: string) => {
      switch (operator) {
        case 'equals': return 'bằng'
        case 'not_equals': return 'không bằng'
        case 'greater_than': return 'lớn hơn'
        case 'less_than': return 'nhỏ hơn'
        case 'contains': return 'chứa'
        case 'not_contains': return 'không chứa'
        default: return operator
      }
    }

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Quản lý Quy trình & Nhãn</h2>
            <p className="text-gray-600">Tùy chỉnh giai đoạn bán hàng, trạng thái đơn hàng và nhãn tự động</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Sales Stages */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Giai đoạn bán hàng</CardTitle>
                  <CardDescription>
                    Các giai đoạn cố định tương ứng với quy trình bán hàng hiện tại. 
                    Bạn có thể thêm các giai đoạn tùy chỉnh để mở rộng quy trình.
                  </CardDescription>
                </div>
                <Button onClick={() => setShowStageModal(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Thêm giai đoạn
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {salesStages.map((stage, index) => (
                <div key={stage.id} className={`flex items-center justify-between p-3 border rounded-lg ${stage.isFixed ? 'bg-gray-50 border-gray-200' : 'bg-white border-gray-200'}`}>
                  <div className="flex items-center space-x-3">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: stage.color }}
                    />
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">{stage.name}</span>
                        {stage.isFixed && (
                          <Badge variant="secondary" className="text-xs">Cố định</Badge>
                        )}
                      </div>
                      <div className="text-sm text-gray-500">{stage.description}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline">{stage.order}</Badge>
                    
                    {/* Move buttons for non-fixed stages */}
                    {!stage.isFixed && (
                      <div className="flex flex-col">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="h-6 px-1"
                          onClick={() => handleMoveStage(stage.id, 'up')}
                          disabled={salesStages.filter(s => !s.isFixed && s.order < stage.order).length === 0}
                          title="Di chuyển lên"
                        >
                          <ArrowUp className="w-3 h-3" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="h-6 px-1"
                          onClick={() => handleMoveStage(stage.id, 'down')}
                          disabled={salesStages.filter(s => !s.isFixed && s.order > stage.order).length === 0}
                          title="Di chuyển xuống"
                        >
                          <ArrowDown className="w-3 h-3" />
                        </Button>
                      </div>
                    )}
                    
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleEditSalesStage(stage)}
                      title="Chỉnh sửa giai đoạn"
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      disabled={stage.isFixed}
                      className={stage.isFixed ? 'cursor-not-allowed opacity-50' : ''}
                      title={stage.isFixed ? 'Giai đoạn cố định không thể xóa' : 'Xóa giai đoạn'}
                      onClick={() => !stage.isFixed && handleDeleteSalesStage(stage.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Order Statuses */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Trạng thái đơn hàng</CardTitle>
                  <CardDescription>Quản lý trạng thái và thông báo</CardDescription>
                </div>
                <Button onClick={() => setShowStatusModal(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Thêm trạng thái
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {orderStatuses.map((status) => (
                <div key={status.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: status.color }}
                    />
                    <div>
                      <div className="font-medium">{status.name}</div>
                      <div className="text-sm text-gray-500">{status.description}</div>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {status.category === 'payment' ? 'Thanh toán' :
                           status.category === 'delivery' ? 'Giao hàng' :
                           status.category === 'contract' ? 'Hợp đồng' : 'Khác'}
                        </Badge>
                        {status.timeout.enabled && (
                          <Badge variant="outline" className="text-xs">
                            Hết hạn: {status.timeout.days} ngày
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-1">
                      {status.notifications.zalo && (
                        <MessageSquare className="w-3 h-3 text-blue-500" />
                      )}
                      {status.notifications.email && (
                        <Mail className="w-3 h-3 text-green-500" />
                      )}
                      {status.notifications.app && (
                        <Bell className="w-3 h-3 text-purple-500" />
                      )}
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleEditOrderStatus(status)}
                      title="Chỉnh sửa trạng thái"
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleDeleteOrderStatus(status.id)}
                      title="Xóa trạng thái"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Tags Management Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold text-gray-900">Quản lý nhãn</h3>
              <p className="text-gray-600">Tạo và quản lý nhãn trong hệ thống</p>
            </div>
            <Button onClick={handleCreateTag}>
              <Plus className="w-4 h-4 mr-2" />
              Tạo nhãn mới
            </Button>
          </div>

          {/* Tags List */}
          <Card>
            <CardHeader>
              <CardTitle>Danh sách Nhãn</CardTitle>
              <CardDescription>Quản lý tất cả nhãn trong hệ thống</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {tags.map((tag) => (
                  <div key={tag.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                    <div className="flex items-center space-x-4">
                      <div
                        className="w-4 h-4 rounded"
                        style={{ backgroundColor: tag.color }}
                      />
                      <div>
                        <div className="flex items-center space-x-2">
                          <h4 className="font-medium">{tag.name}</h4>
                          {tag.isDefault && (
                            <Badge variant="outline" className="text-xs">
                              <Star className="w-3 h-3 mr-1" />
                              Mặc định
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge className={getCategoryColor(tag.category)}>
                            {tag.category === 'lead' && 'Lead'}
                            {tag.category === 'customer' && 'Khách hàng'}
                            {tag.category === 'deal' && 'Deal'}
                            {tag.category === 'task' && 'Công việc'}
                          </Badge>
                          <Badge className={getScopeColor(tag.scope)}>
                            {tag.scope === 'global' && 'Toàn cục'}
                            {tag.scope === 'team' && 'Nhóm'}
                            {tag.scope === 'user' && 'Cá nhân'}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditTag(tag)}
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteTag(tag.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tag Creation/Edit Modal */}
        <Dialog open={showTagModal} onOpenChange={setShowTagModal}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {selectedTag ? 'Chỉnh sửa nhãn' : 'Tạo nhãn mới'}
              </DialogTitle>
              <DialogDescription>
                {selectedTag 
                  ? 'Cập nhật thông tin nhãn và quy tắc tự động gán'
                  : 'Tạo nhãn mới để phân loại dữ liệu'
                }
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="tag-name">Tên nhãn</Label>
                <Input
                  id="tag-name"
                  placeholder="Nhập tên nhãn"
                  defaultValue={selectedTag?.name || ''}
                />
              </div>

              <div>
                <Label>Màu sắc</Label>
                <div className="grid grid-cols-8 gap-2 mt-2">
                  {[
                    '#EF4444', '#F59E0B', '#10B981', '#3B82F6',
                    '#8B5CF6', '#EC4899', '#6366F1', '#14B8A6'
                  ].map((color) => (
                    <button
                      key={color}
                      className={`w-8 h-8 rounded border-2 ${
                        selectedTag?.color === color ? 'border-gray-900' : 'border-gray-200'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              <div>
                <Label>Loại</Label>
                <Select defaultValue={selectedTag?.category || 'lead'}>
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="lead">Lead</SelectItem>
                    <SelectItem value="customer">Khách hàng</SelectItem>
                    <SelectItem value="deal">Deal</SelectItem>
                    <SelectItem value="task">Công việc</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Phạm vi</Label>
                <Select defaultValue={selectedTag?.scope || 'global'}>
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="global">Toàn cục</SelectItem>
                    <SelectItem value="team">Nhóm</SelectItem>
                    <SelectItem value="user">Cá nhân</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="is-default">Nhãn mặc định</Label>
                <Switch
                  id="is-default"
                  defaultChecked={selectedTag?.isDefault || false}
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setShowTagModal(false)}>
                Hủy
              </Button>
              <Button>
                {selectedTag ? 'Cập nhật' : 'Tạo mới'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Add Sales Stage Modal */}
        <Dialog open={showStageModal} onOpenChange={setShowStageModal}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Thêm giai đoạn bán hàng mới</DialogTitle>
              <DialogDescription>
                Tạo giai đoạn tùy chỉnh cho quy trình bán hàng của bạn
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="stage-name">Tên giai đoạn</Label>
                <Input
                  id="stage-name"
                  placeholder="Nhập tên giai đoạn"
                  value={newStageForm.name}
                  onChange={(e) => setNewStageForm(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>

              <div>
                <Label htmlFor="stage-description">Mô tả</Label>
                <Input
                  id="stage-description"
                  placeholder="Mô tả chi tiết về giai đoạn"
                  value={newStageForm.description}
                  onChange={(e) => setNewStageForm(prev => ({ ...prev, description: e.target.value }))}
                />
              </div>

              <div>
                <Label>Vị trí giai đoạn</Label>
                <Select
                  value={newStageForm.position}
                  onValueChange={(value) => setNewStageForm(prev => ({ 
                    ...prev, 
                    position: value as 'start' | 'end' | 'after',
                    afterStageId: value !== 'after' ? '' : prev.afterStageId
                  }))}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="start">Đầu quy trình (sau các giai đoạn cố định đầu)</SelectItem>
                    <SelectItem value="end">Cuối quy trình</SelectItem>
                    <SelectItem value="after">Sau giai đoạn cụ thể</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {newStageForm.position === 'after' && (
                <div>
                  <Label>Chọn giai đoạn</Label>
                  <Select
                    value={newStageForm.afterStageId}
                    onValueChange={(value) => setNewStageForm(prev => ({ ...prev, afterStageId: value }))}
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Chọn giai đoạn để chèn sau" />
                    </SelectTrigger>
                    <SelectContent>
                      {salesStages
                        .filter(stage => !stage.isFixed || ['new', 'qualified'].includes(stage.id))
                        .sort((a, b) => a.order - b.order)
                        .map((stage) => (
                        <SelectItem key={stage.id} value={stage.id}>
                          {stage.name} {stage.isFixed ? '(Cố định)' : ''}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div>
                <Label>Màu sắc</Label>
                <div className="grid grid-cols-8 gap-2 mt-2">
                  {[
                    '#EF4444', '#F59E0B', '#10B981', '#3B82F6',
                    '#8B5CF6', '#EC4899', '#6366F1', '#14B8A6'
                  ].map((color) => (
                    <button
                      key={color}
                      className={`w-8 h-8 rounded border-2 transition-colors ${
                        newStageForm.color === color ? 'border-gray-800' : 'border-gray-200 hover:border-gray-400'
                      }`}
                      style={{ backgroundColor: color }}
                      onClick={() => setNewStageForm(prev => ({ ...prev, color }))}
                    />
                  ))}
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => {
                setShowStageModal(false)
                setNewStageForm({
                  name: '',
                  description: '',
                  color: '#3B82F6',
                  position: 'end',
                  afterStageId: ''
                })
              }}>
                Hủy
              </Button>
              <Button 
                onClick={handleAddSalesStage}
                disabled={!newStageForm.name.trim() || (newStageForm.position === 'after' && !newStageForm.afterStageId)}
              >
                Thêm giai đoạn
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Sales Stage Modal */}
        <Dialog open={showEditStageModal} onOpenChange={setShowEditStageModal}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Chỉnh sửa giai đoạn bán hàng</DialogTitle>
              <DialogDescription>
                Cập nhật thông tin giai đoạn "{selectedStage?.name}"
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-stage-name">Tên giai đoạn</Label>
                <Input
                  id="edit-stage-name"
                  defaultValue={selectedStage?.name}
                  placeholder="Nhập tên giai đoạn"
                />
              </div>

              <div>
                <Label htmlFor="edit-stage-description">Mô tả</Label>
                <Input
                  id="edit-stage-description"
                  defaultValue={selectedStage?.description}
                  placeholder="Mô tả chi tiết về giai đoạn"
                />
              </div>

              <div>
                <Label>Màu sắc</Label>
                <div className="grid grid-cols-8 gap-2 mt-2">
                  {[
                    '#EF4444', '#F59E0B', '#10B981', '#3B82F6',
                    '#8B5CF6', '#EC4899', '#6366F1', '#14B8A6'
                  ].map((color) => (
                    <button
                      key={color}
                      className={`w-8 h-8 rounded border-2 ${
                        selectedStage?.color === color ? 'border-gray-900' : 'border-gray-200'
                      } hover:border-gray-400`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setShowEditStageModal(false)}>
                Hủy
              </Button>
              <Button onClick={() => {
                // TODO: Implement edit stage logic
                setShowEditStageModal(false)
              }}>
                Cập nhật
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Stage with Data Transfer Modal */}
        <Dialog open={showDeleteStageModal} onOpenChange={setShowDeleteStageModal}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2 text-red-600">
                <AlertTriangle className="w-5 h-5" />
                <span>Xóa giai đoạn có dữ liệu</span>
              </DialogTitle>
              <DialogDescription>
                Giai đoạn "{stageToDelete?.name}" đang chứa dữ liệu. 
                Vui lòng chọn giai đoạn để chuyển toàn bộ dữ liệu trước khi xóa.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="transfer-stage">Chuyển dữ liệu sang giai đoạn</Label>
                <select
                  id="transfer-stage"
                  className="w-full mt-1 p-2 border rounded"
                  value={transferToStageId}
                  onChange={(e) => setTransferToStageId(e.target.value)}
                >
                  <option value="">-- Chọn giai đoạn đích --</option>
                  {salesStages
                    .filter(s => s.id !== stageToDelete?.id)
                    .map(stage => (
                      <option key={stage.id} value={stage.id}>
                        {stage.name} {stage.isFixed ? '(Cố định)' : ''}
                      </option>
                    ))}
                </select>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded p-3">
                <div className="flex items-center space-x-2 text-yellow-800">
                  <AlertTriangle className="w-4 h-4" />
                  <span className="font-medium">Cảnh báo</span>
                </div>
                <p className="text-sm text-yellow-700 mt-1">
                  Hành động này sẽ chuyển toàn bộ leads/deals trong giai đoạn 
                  "{stageToDelete?.name}" sang giai đoạn được chọn và không thể hoàn tác.
                </p>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => {
                setShowDeleteStageModal(false)
                setStageToDelete(null)
                setTransferToStageId('')
              }}>
                Hủy
              </Button>
              <Button 
                variant="destructive"
                disabled={!transferToStageId}
                onClick={handleConfirmDeleteStage}
              >
                Chuyển dữ liệu và xóa
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Add Order Status Modal */}
        <Dialog open={showStatusModal} onOpenChange={setShowStatusModal}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Thêm trạng thái đơn hàng mới</DialogTitle>
              <DialogDescription>
                Tạo trạng thái mới cho đơn hàng với thông báo tự động
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="status-name">Tên trạng thái</Label>
                <Input
                  id="status-name"
                  placeholder="Nhập tên trạng thái"
                />
              </div>

              <div>
                <Label htmlFor="status-description">Mô tả</Label>
                <Input
                  id="status-description"
                  placeholder="Mô tả chi tiết về trạng thái"
                />
              </div>

              <div>
                <Label>Màu sắc</Label>
                <div className="grid grid-cols-8 gap-2 mt-2">
                  {[
                    '#EF4444', '#F59E0B', '#10B981', '#3B82F6',
                    '#8B5CF6', '#EC4899', '#6366F1', '#14B8A6'
                  ].map((color) => (
                    <button
                      key={color}
                      className="w-8 h-8 rounded border-2 border-gray-200 hover:border-gray-400"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="status-category">Loại trạng thái</Label>
                <select
                  id="status-category"
                  className="w-full mt-1 p-2 border rounded"
                >
                  <option value="payment">Thanh toán</option>
                  <option value="shipping">Vận chuyển</option>
                  <option value="processing">Xử lý</option>
                  <option value="completion">Hoàn thành</option>
                </select>
              </div>

              <div className="space-y-3">
                <Label>Thông báo</Label>
                <div className="grid grid-cols-2 gap-2">
                  {/* <div className="flex items-center space-x-2">
                    <input type="checkbox" id="zalo-notify" defaultChecked />
                    <Label htmlFor="zalo-notify" className="text-sm">Zalo</Label>
                  </div> */}
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="email-notify" defaultChecked />
                    <Label htmlFor="email-notify" className="text-sm">Email</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="app-notify" defaultChecked />
                    <Label htmlFor="app-notify" className="text-sm">App</Label>
                  </div>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setShowStatusModal(false)}>
                Hủy
              </Button>
              <Button onClick={() => {
                const nameInput = document.getElementById('status-name') as HTMLInputElement
                const descInput = document.getElementById('status-description') as HTMLInputElement
                const categorySelect = document.getElementById('status-category') as HTMLSelectElement
                
                if (!nameInput?.value) {
                  alert('Vui lòng nhập tên trạng thái')
                  return
                }

                const newStatus = {
                  name: nameInput.value,
                  description: descInput?.value || '',
                  color: '#3B82F6', // Default color
                  category: categorySelect?.value as OrderStatus['category'] || 'processing',
                  timeout: { enabled: false, days: 0, action: 'notify' as const },
                  notifications: { 
                    zalo: (document.getElementById('zalo-notify') as HTMLInputElement)?.checked || false,
                    email: (document.getElementById('email-notify') as HTMLInputElement)?.checked || false,
                    app: (document.getElementById('app-notify') as HTMLInputElement)?.checked || false
                  },
                  isActive: true
                }

                handleAddOrderStatus(newStatus)
              }}>
                Thêm trạng thái
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Order Status Modal */}
        <Dialog open={showEditStatusModal} onOpenChange={setShowEditStatusModal}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Chỉnh sửa trạng thái đơn hàng</DialogTitle>
              <DialogDescription>
                Cập nhật thông tin trạng thái "{selectedStatus?.name}"
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-status-name">Tên trạng thái</Label>
                <Input
                  id="edit-status-name"
                  value={editStatusForm.name}
                  onChange={(e) => setEditStatusForm(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Nhập tên trạng thái"
                />
              </div>

              <div>
                <Label htmlFor="edit-status-description">Mô tả</Label>
                <Input
                  id="edit-status-description"
                  value={editStatusForm.description}
                  onChange={(e) => setEditStatusForm(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Mô tả chi tiết về trạng thái"
                />
              </div>

              <div>
                <Label>Màu sắc</Label>
                <div className="grid grid-cols-8 gap-2 mt-2">
                  {[
                    '#EF4444', '#F59E0B', '#10B981', '#3B82F6',
                    '#8B5CF6', '#EC4899', '#6366F1', '#14B8A6'
                  ].map((color) => (
                    <button
                      key={color}
                      className={`w-8 h-8 rounded border-2 ${
                        editStatusForm.color === color ? 'border-gray-900' : 'border-gray-200'
                      } hover:border-gray-400`}
                      style={{ backgroundColor: color }}
                      onClick={() => setEditStatusForm(prev => ({ ...prev, color }))}
                    />
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="edit-status-category">Loại trạng thái</Label>
                <select
                  id="edit-status-category"
                  className="w-full mt-1 p-2 border rounded"
                  value={editStatusForm.category}
                  onChange={(e) => setEditStatusForm(prev => ({ 
                    ...prev, 
                    category: e.target.value as 'payment' | 'delivery' | 'contract' | 'other' | 'shipping' | 'processing' | 'completion'
                  }))}
                >
                  <option value="payment">Thanh toán</option>
                  <option value="shipping">Vận chuyển</option>
                  <option value="processing">Xử lý</option>
                  <option value="completion">Hoàn thành</option>
                </select>
              </div>

              <div className="space-y-3">
                <Label>Thông báo</Label>
                <div className="grid grid-cols-2 gap-2">
                  {/* <div className="flex items-center space-x-2">
                    <input 
                      type="checkbox" 
                      id="edit-zalo-notify" 
                      checked={editStatusForm.notifications.zalo}
                      onChange={(e) => setEditStatusForm(prev => ({
                        ...prev,
                        notifications: { ...prev.notifications, zalo: e.target.checked }
                      }))}
                    />
                    <Label htmlFor="edit-zalo-notify" className="text-sm">Zalo</Label>
                  </div> */}
                  <div className="flex items-center space-x-2">
                    <input 
                      type="checkbox" 
                      id="edit-email-notify" 
                      checked={editStatusForm.notifications.email}
                      onChange={(e) => setEditStatusForm(prev => ({
                        ...prev,
                        notifications: { ...prev.notifications, email: e.target.checked }
                      }))}
                    />
                    <Label htmlFor="edit-email-notify" className="text-sm">Email</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input 
                      type="checkbox" 
                      id="edit-app-notify" 
                      checked={editStatusForm.notifications.app}
                      onChange={(e) => setEditStatusForm(prev => ({
                        ...prev,
                        notifications: { ...prev.notifications, app: e.target.checked }
                      }))}
                    />
                    <Label htmlFor="edit-app-notify" className="text-sm">App</Label>
                  </div>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setShowEditStatusModal(false)}>
                Hủy
              </Button>
              <Button onClick={handleEditOrderStatusSubmit}>
                Cập nhật
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Status with Data Transfer Modal */}
        <Dialog open={showDeleteStatusModal} onOpenChange={setShowDeleteStatusModal}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2 text-red-600">
                <AlertTriangle className="w-5 h-5" />
                <span>Xóa trạng thái có dữ liệu</span>
              </DialogTitle>
              <DialogDescription>
                Trạng thái "{statusToDelete?.name}" đang chứa dữ liệu đơn hàng. 
                Vui lòng chọn trạng thái để chuyển toàn bộ đơn hàng trước khi xóa.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="transfer-status">Chuyển đơn hàng sang trạng thái</Label>
                <select
                  id="transfer-status"
                  className="w-full mt-1 p-2 border rounded"
                  value={transferToStatusId}
                  onChange={(e) => setTransferToStatusId(e.target.value)}
                >
                  <option value="">-- Chọn trạng thái đích --</option>
                  {orderStatuses
                    .filter(s => s.id !== statusToDelete?.id)
                    .map(status => (
                      <option key={status.id} value={status.id}>
                        {status.name} ({status.category === 'payment' ? 'Thanh toán' :
                         status.category === 'shipping' ? 'Vận chuyển' :
                         status.category === 'processing' ? 'Xử lý' : 'Hoàn thành'})
                      </option>
                    ))}
                </select>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded p-3">
                <div className="flex items-center space-x-2 text-yellow-800">
                  <AlertTriangle className="w-4 h-4" />
                  <span className="font-medium">Cảnh báo</span>
                </div>
                <p className="text-sm text-yellow-700 mt-1">
                  Hành động này sẽ chuyển toàn bộ đơn hàng trong trạng thái 
                  "{statusToDelete?.name}" sang trạng thái được chọn và không thể hoàn tác.
                </p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded p-3">
                <div className="flex items-center space-x-2 text-blue-800">
                  <Info className="w-4 h-4" />
                  <span className="font-medium">Lưu ý</span>
                </div>
                <p className="text-sm text-blue-700 mt-1">
                  Hệ thống luôn phải có ít nhất một trạng thái đơn hàng.
                </p>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => {
                setShowDeleteStatusModal(false)
                setStatusToDelete(null)
                setTransferToStatusId('')
              }}>
                Hủy
              </Button>
              <Button 
                variant="destructive"
                disabled={!transferToStatusId}
                onClick={handleConfirmDeleteStatus}
              >
                Chuyển đơn hàng và xóa
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Lead Distribution Section */}
        <div className="space-y-6 mt-8">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold text-gray-900">Phân bổ Leads</h3>
              <p className="text-gray-600">Cài đặt quy tắc phân bổ leads tự động cho nhóm bán hàng</p>
            </div>
            <Button onClick={() => setShowAddDistributionRule(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Thêm quy tắc
            </Button>
          </div>

          {/* Distribution Rules List */}
          <Card>
            <CardHeader>
              <CardTitle>Quy tắc phân bổ</CardTitle>
              <CardDescription>Danh sách các quy tắc phân bổ leads hiện tại</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {distributionRules.map((rule) => (
                  <div key={rule.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                    <div className="flex items-center space-x-4">
                      <div className={`w-3 h-3 rounded-full ${rule.isActive ? 'bg-green-500' : 'bg-gray-400'}`} />
                      <div>
                        <h4 className="font-medium text-gray-900">{rule.name}</h4>
                        <p className="text-sm text-gray-500">{rule.description}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {rule.method === 'round_robin' ? 'Xoay vòng' : 
                             rule.method === 'load_based' ? 'Theo tải' : 'Ngẫu nhiên'}
                          </Badge>
                          <Badge variant="secondary" className="text-xs">
                            {rule.assignedTargets.join(', ')}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {rule.assignmentType === 'department' ? 'Phòng ban' : 
                             rule.assignmentType === 'team' ? 'Team' : 'Cá nhân'}
                          </Badge>
                          {rule.assignedTargets.length > 1 && (
                            <Badge variant="default" className="text-xs bg-blue-100 text-blue-800">
                              {rule.assignedTargets.length} đối tượng
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="text-right text-sm">
                        <p className="font-medium">{rule.leadsAssigned}</p>
                        <p className="text-gray-500">leads được phân</p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditDistributionRule(rule)}
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteDistributionRule(rule.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                      <Switch
                        checked={rule.isActive}
                        onCheckedChange={(checked) => handleToggleDistributionRule(rule.id, checked)}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {distributionRules.length === 0 && (
                <div className="text-center py-8">
                  <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có quy tắc phân bổ</h3>
                  <p className="text-gray-500">Tạo quy tắc đầu tiên để bắt đầu phân bổ leads tự động.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Add Distribution Rule Modal */}
        <Dialog open={showAddDistributionRule} onOpenChange={setShowAddDistributionRule}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Thêm quy tắc phân bổ leads</DialogTitle>
              <DialogDescription>
                Tạo quy tắc mới để phân bổ leads tự động cho nhóm bán hàng
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="rule-name">Tên quy tắc</Label>
                  <Input
                    id="rule-name"
                    placeholder="VD: Phân bổ leads mới"
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="assignment-type">Loại phân bổ</Label>
                  <Select onValueChange={(value) => setSelectedAssignmentType(value)}>
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Chọn loại phân bổ" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="department">Theo phòng ban</SelectItem>
                      <SelectItem value="team">Theo team</SelectItem>
                      <SelectItem value="individual">Cá nhân</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="assigned-targets">
                  {selectedAssignmentType === 'department' ? 'Phòng ban được phân' :
                   selectedAssignmentType === 'team' ? 'Team được phân' : 'Cá nhân được phân'}
                </Label>
                <div className="mt-2 space-y-2 max-h-40 overflow-y-auto border rounded-lg p-3">
                  {selectedAssignmentType === 'department' && (
                    <>
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" id="dept-sales" value="dept-sales" />
                        <label htmlFor="dept-sales" className="text-sm">Phòng Sales</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" id="dept-marketing" value="dept-marketing" />
                        <label htmlFor="dept-marketing" className="text-sm">Phòng Marketing</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" id="dept-telesales" value="dept-telesales" />
                        <label htmlFor="dept-telesales" className="text-sm">Phòng Telesales</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" id="dept-customer-service" value="dept-customer-service" />
                        <label htmlFor="dept-customer-service" className="text-sm">Phòng Chăm sóc khách hàng</label>
                      </div>
                    </>
                  )}
                  
                  {selectedAssignmentType === 'team' && (
                    <>
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" id="team-sales-a" value="team-sales-a" />
                        <label htmlFor="team-sales-a" className="text-sm">Team Sales A</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" id="team-sales-b" value="team-sales-b" />
                        <label htmlFor="team-sales-b" className="text-sm">Team Sales B</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" id="team-telesales-1" value="team-telesales-1" />
                        <label htmlFor="team-telesales-1" className="text-sm">Team Telesales 1</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" id="team-telesales-2" value="team-telesales-2" />
                        <label htmlFor="team-telesales-2" className="text-sm">Team Telesales 2</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" id="team-marketing" value="team-marketing" />
                        <label htmlFor="team-marketing" className="text-sm">Team Marketing</label>
                      </div>
                    </>
                  )}

                  {selectedAssignmentType === 'individual' && (
                    <div className="space-y-3">
                      {/* Search and Filter Controls */}
                      <div className="flex space-x-2 pb-3 border-b">
                        <div className="flex-1">
                          <Input
                            placeholder="Tìm kiếm nhân viên..."
                            value={individualSearchTerm}
                            onChange={(e) => setIndividualSearchTerm(e.target.value)}
                            className="text-sm"
                          />
                        </div>
                        <Select value={individualFilterTeam} onValueChange={setIndividualFilterTeam}>
                          <SelectTrigger className="w-40">
                            <SelectValue placeholder="Lọc theo team" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">Tất cả team</SelectItem>
                            <SelectItem value="sales-a">Team Sales A</SelectItem>
                            <SelectItem value="sales-b">Team Sales B</SelectItem>
                            <SelectItem value="telesales-1">Team Telesales 1</SelectItem>
                            <SelectItem value="telesales-2">Team Telesales 2</SelectItem>
                            <SelectItem value="customer-success">Team Customer Success</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Individual List */}
                      <div className="space-y-2">
                        {[
                          { id: 'user-nguyen-van-a', name: 'Nguyễn Văn A', team: 'sales-a', title: 'Sales Manager', teamName: 'Team Sales A' },
                          { id: 'user-tran-thi-b', name: 'Trần Thị B', team: 'sales-a', title: 'Sales Executive', teamName: 'Team Sales A' },
                          { id: 'user-le-van-c', name: 'Lê Văn C', team: 'telesales-1', title: 'Telesales Specialist', teamName: 'Team Telesales 1' },
                          { id: 'user-pham-thi-d', name: 'Phạm Thị D', team: 'sales-b', title: 'Account Manager', teamName: 'Team Sales B' },
                          { id: 'user-hoang-van-e', name: 'Hoàng Văn E', team: 'sales-a', title: 'Senior Sales', teamName: 'Team Sales A' },
                          { id: 'user-vo-thi-f', name: 'Võ Thị F', team: 'customer-success', title: 'Customer Success', teamName: 'Team Customer Success' },
                          { id: 'user-dao-van-g', name: 'Đào Văn G', team: 'telesales-1', title: 'Telesales Lead', teamName: 'Team Telesales 1' },
                          { id: 'user-bui-thi-h', name: 'Bùi Thị H', team: 'sales-b', title: 'Sales Representative', teamName: 'Team Sales B' },
                          { id: 'user-nguyen-thi-i', name: 'Nguyễn Thị I', team: 'sales-a', title: 'Team Leader', teamName: 'Team Sales A' },
                          { id: 'user-tran-van-j', name: 'Trần Văn J', team: 'sales-b', title: 'Key Account Manager', teamName: 'Team Sales B' },
                          { id: 'user-le-thi-k', name: 'Lê Thị K', team: 'telesales-2', title: 'Telesales Executive', teamName: 'Team Telesales 2' },
                          { id: 'user-pham-van-l', name: 'Phạm Văn L', team: 'sales-b', title: 'Business Development', teamName: 'Team Sales B' }
                        ]
                        .filter(person => {
                          const matchesSearch = person.name.toLowerCase().includes(individualSearchTerm.toLowerCase()) ||
                                              person.title.toLowerCase().includes(individualSearchTerm.toLowerCase()) ||
                                              person.teamName.toLowerCase().includes(individualSearchTerm.toLowerCase())
                          const matchesTeam = individualFilterTeam === 'all' || person.team === individualFilterTeam
                          return matchesSearch && matchesTeam
                        })
                        .map(person => (
                          <div key={person.id} className="flex items-center space-x-2 hover:bg-gray-50 p-1 rounded">
                            <input type="checkbox" id={person.id} value={person.id} />
                            <label htmlFor={person.id} className="text-sm flex-1 cursor-pointer flex items-center justify-between">
                              <span>{person.name}</span>
                              <div className="flex items-center space-x-2">
                                <span className="text-xs text-gray-500">{person.title}</span>
                                <Badge variant="outline" className="text-xs">
                                  {person.teamName}
                                </Badge>
                              </div>
                            </label>
                          </div>
                        ))}
                      </div>

                      {/* No Results Message */}
                      {[
                        { id: 'user-nguyen-van-a', name: 'Nguyễn Văn A', team: 'sales-a', title: 'Sales Manager', teamName: 'Team Sales A' },
                        { id: 'user-tran-thi-b', name: 'Trần Thị B', team: 'sales-a', title: 'Sales Executive', teamName: 'Team Sales A' },
                        { id: 'user-le-van-c', name: 'Lê Văn C', team: 'telesales-1', title: 'Telesales Specialist', teamName: 'Team Telesales 1' },
                        { id: 'user-pham-thi-d', name: 'Phạm Thị D', team: 'sales-b', title: 'Account Manager', teamName: 'Team Sales B' },
                        { id: 'user-hoang-van-e', name: 'Hoàng Văn E', team: 'sales-a', title: 'Senior Sales', teamName: 'Team Sales A' },
                        { id: 'user-vo-thi-f', name: 'Võ Thị F', team: 'customer-success', title: 'Customer Success', teamName: 'Team Customer Success' },
                        { id: 'user-dao-van-g', name: 'Đào Văn G', team: 'telesales-1', title: 'Telesales Lead', teamName: 'Team Telesales 1' },
                        { id: 'user-bui-thi-h', name: 'Bùi Thị H', team: 'sales-b', title: 'Sales Representative', teamName: 'Team Sales B' },
                        { id: 'user-nguyen-thi-i', name: 'Nguyễn Thị I', team: 'sales-a', title: 'Team Leader', teamName: 'Team Sales A' },
                        { id: 'user-tran-van-j', name: 'Trần Văn J', team: 'sales-b', title: 'Key Account Manager', teamName: 'Team Sales B' },
                        { id: 'user-le-thi-k', name: 'Lê Thị K', team: 'telesales-2', title: 'Telesales Executive', teamName: 'Team Telesales 2' },
                        { id: 'user-pham-van-l', name: 'Phạm Văn L', team: 'sales-b', title: 'Business Development', teamName: 'Team Sales B' }
                      ]
                      .filter(person => {
                        const matchesSearch = person.name.toLowerCase().includes(individualSearchTerm.toLowerCase()) ||
                                            person.title.toLowerCase().includes(individualSearchTerm.toLowerCase()) ||
                                            person.teamName.toLowerCase().includes(individualSearchTerm.toLowerCase())
                        const matchesTeam = individualFilterTeam === 'all' || person.team === individualFilterTeam
                        return matchesSearch && matchesTeam
                      }).length === 0 && (
                        <div className="text-center py-4 text-gray-500 text-sm">
                          <Users className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                          Không tìm thấy nhân viên phù hợp
                        </div>
                      )}
                    </div>
                  )}

                  {!selectedAssignmentType && (
                    <p className="text-gray-500 text-sm">Vui lòng chọn loại phân bổ trước</p>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="rule-description">Mô tả</Label>
                <Input
                  id="rule-description"
                  placeholder="Mô tả ngắn về quy tắc này"
                  className="mt-2"
                />
              </div>

              <div>
                <Label>Phương thức phân bổ</Label>
                <div className="grid grid-cols-3 gap-4 mt-2">
                  <div className="border rounded-lg p-4 cursor-pointer hover:bg-blue-50 hover:border-blue-300">
                    <div className="flex items-center space-x-2">
                      <input type="radio" name="distribution-method" value="round_robin" />
                      <div>
                        <h4 className="font-medium">Xoay vòng</h4>
                        <p className="text-sm text-gray-500">Phân đều cho từng thành viên</p>
                      </div>
                    </div>
                  </div>
                  <div className="border rounded-lg p-4 cursor-pointer hover:bg-blue-50 hover:border-blue-300">
                    <div className="flex items-center space-x-2">
                      <input type="radio" name="distribution-method" value="load_based" />
                      <div>
                        <h4 className="font-medium">Theo tải</h4>
                        <p className="text-sm text-gray-500">Dựa trên khối lượng công việc</p>
                      </div>
                    </div>
                  </div>
                  <div className="border rounded-lg p-4 cursor-pointer hover:bg-blue-50 hover:border-blue-300">
                    <div className="flex items-center space-x-2">
                      <input type="radio" name="distribution-method" value="random" />
                      <div>
                        <h4 className="font-medium">Ngẫu nhiên</h4>
                        <p className="text-sm text-gray-500">Phân bổ hoàn toàn ngẫu nhiên</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <Label>Điều kiện áp dụng</Label>
                <div className="space-y-3 mt-2">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="lead-source">Nguồn leads</Label>
                      <Select>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Tất cả nguồn" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Tất cả nguồn</SelectItem>
                          <SelectItem value="website">Website</SelectItem>
                          <SelectItem value="zalo">Zalo OA</SelectItem>
                          <SelectItem value="facebook">Facebook</SelectItem>
                          <SelectItem value="phone">Điện thoại</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="max-leads">Leads phân tối đa cho từng người</Label>
                      <Input
                        id="max-leads"
                        type="number"
                        placeholder="Không giới hạn"
                        className="mt-1"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="time-range">Thời gian áp dụng</Label>
                      <Select value={selectedTimeRange} onValueChange={setSelectedTimeRange}>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="24/7" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">24/7</SelectItem>
                          <SelectItem value="business">Giờ hành chính</SelectItem>
                          <SelectItem value="custom">Tùy chỉnh</SelectItem>
                        </SelectContent>
                      </Select>
                      
                      {selectedTimeRange === 'custom' && (
                        <div className="mt-3 p-3 border rounded-lg bg-gray-50">
                          <Label className="text-sm font-medium mb-2 block">Chọn khung giờ</Label>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <Label htmlFor="start-time" className="text-xs text-gray-600">Từ giờ</Label>
                              <Select>
                                <SelectTrigger className="mt-1">
                                  <SelectValue placeholder="08:00" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="06:00">06:00</SelectItem>
                                  <SelectItem value="07:00">07:00</SelectItem>
                                  <SelectItem value="08:00">08:00</SelectItem>
                                  <SelectItem value="09:00">09:00</SelectItem>
                                  <SelectItem value="10:00">10:00</SelectItem>
                                  <SelectItem value="11:00">11:00</SelectItem>
                                  <SelectItem value="12:00">12:00</SelectItem>
                                  <SelectItem value="13:00">13:00</SelectItem>
                                  <SelectItem value="14:00">14:00</SelectItem>
                                  <SelectItem value="15:00">15:00</SelectItem>
                                  <SelectItem value="16:00">16:00</SelectItem>
                                  <SelectItem value="17:00">17:00</SelectItem>
                                  <SelectItem value="18:00">18:00</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label htmlFor="end-time" className="text-xs text-gray-600">Đến giờ</Label>
                              <Select>
                                <SelectTrigger className="mt-1">
                                  <SelectValue placeholder="17:00" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="12:00">12:00</SelectItem>
                                  <SelectItem value="13:00">13:00</SelectItem>
                                  <SelectItem value="14:00">14:00</SelectItem>
                                  <SelectItem value="15:00">15:00</SelectItem>
                                  <SelectItem value="16:00">16:00</SelectItem>
                                  <SelectItem value="17:00">17:00</SelectItem>
                                  <SelectItem value="18:00">18:00</SelectItem>
                                  <SelectItem value="19:00">19:00</SelectItem>
                                  <SelectItem value="20:00">20:00</SelectItem>
                                  <SelectItem value="21:00">21:00</SelectItem>
                                  <SelectItem value="22:00">22:00</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          <div className="mt-3">
                            <Label className="text-xs text-gray-600 mb-2 block">Ngày trong tuần</Label>
                            <div className="flex flex-wrap gap-2">
                              <div className="flex items-center space-x-1">
                                <input type="checkbox" id="mon" defaultChecked />
                                <label htmlFor="mon" className="text-xs">T2</label>
                              </div>
                              <div className="flex items-center space-x-1">
                                <input type="checkbox" id="tue" defaultChecked />
                                <label htmlFor="tue" className="text-xs">T3</label>
                              </div>
                              <div className="flex items-center space-x-1">
                                <input type="checkbox" id="wed" defaultChecked />
                                <label htmlFor="wed" className="text-xs">T4</label>
                              </div>
                              <div className="flex items-center space-x-1">
                                <input type="checkbox" id="thu" defaultChecked />
                                <label htmlFor="thu" className="text-xs">T5</label>
                              </div>
                              <div className="flex items-center space-x-1">
                                <input type="checkbox" id="fri" defaultChecked />
                                <label htmlFor="fri" className="text-xs">T6</label>
                              </div>
                              <div className="flex items-center space-x-1">
                                <input type="checkbox" id="sat" />
                                <label htmlFor="sat" className="text-xs">T7</label>
                              </div>
                              <div className="flex items-center space-x-1">
                                <input type="checkbox" id="sun" />
                                <label htmlFor="sun" className="text-xs">CN</label>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="priority">Độ ưu tiên</Label>
                      <Select>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Trung bình" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="high">Cao</SelectItem>
                          <SelectItem value="medium">Trung bình</SelectItem>
                          <SelectItem value="low">Thấp</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setShowAddDistributionRule(false)}>
                Hủy
              </Button>
              <Button onClick={() => {
                // TODO: Implement add distribution rule logic
                setShowAddDistributionRule(false)
              }}>
                Tạo quy tắc
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Distribution Rule Modal */}
        <Dialog open={showEditDistributionRule} onOpenChange={setShowEditDistributionRule}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Chỉnh sửa quy tắc phân bổ</DialogTitle>
              <DialogDescription>
                Cập nhật thông tin quy tắc phân bổ leads
              </DialogDescription>
            </DialogHeader>
            
            {selectedDistributionRule && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="edit-rule-name">Tên quy tắc</Label>
                    <Input
                      id="edit-rule-name"
                      defaultValue={selectedDistributionRule.name}
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-assignment-type">Loại phân bổ</Label>
                    <Select defaultValue={selectedDistributionRule.assignmentType}>
                      <SelectTrigger className="mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="department">Theo phòng ban</SelectItem>
                        <SelectItem value="team">Theo team</SelectItem>
                        <SelectItem value="individual">Cá nhân</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="edit-rule-description">Mô tả</Label>
                  <Input
                    id="edit-rule-description"
                    defaultValue={selectedDistributionRule.description}
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label>Phương thức phân bổ</Label>
                  <div className="grid grid-cols-3 gap-4 mt-2">
                    <div className={`border rounded-lg p-4 cursor-pointer ${selectedDistributionRule.method === 'round_robin' ? 'bg-blue-50 border-blue-300' : 'hover:bg-blue-50 hover:border-blue-300'}`}>
                      <div className="flex items-center space-x-2">
                        <input type="radio" name="edit-distribution-method" value="round_robin" defaultChecked={selectedDistributionRule.method === 'round_robin'} />
                        <div>
                          <h4 className="font-medium">Xoay vòng</h4>
                          <p className="text-sm text-gray-500">Phân đều cho từng thành viên</p>
                        </div>
                      </div>
                    </div>
                    <div className={`border rounded-lg p-4 cursor-pointer ${selectedDistributionRule.method === 'load_based' ? 'bg-blue-50 border-blue-300' : 'hover:bg-blue-50 hover:border-blue-300'}`}>
                      <div className="flex items-center space-x-2">
                        <input type="radio" name="edit-distribution-method" value="load_based" defaultChecked={selectedDistributionRule.method === 'load_based'} />
                        <div>
                          <h4 className="font-medium">Theo tải</h4>
                          <p className="text-sm text-gray-500">Dựa trên khối lượng công việc</p>
                        </div>
                      </div>
                    </div>
                    <div className={`border rounded-lg p-4 cursor-pointer ${selectedDistributionRule.method === 'random' ? 'bg-blue-50 border-blue-300' : 'hover:bg-blue-50 hover:border-blue-300'}`}>
                      <div className="flex items-center space-x-2">
                        <input type="radio" name="edit-distribution-method" value="random" defaultChecked={selectedDistributionRule.method === 'random'} />
                        <div>
                          <h4 className="font-medium">Ngẫu nhiên</h4>
                          <p className="text-sm text-gray-500">Phân bổ hoàn toàn ngẫu nhiên</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <Label>Đối tượng được phân</Label>
                  <div className="mt-2 p-3 border rounded-lg">
                    <div className="flex flex-wrap gap-2">
                      {selectedDistributionRule.assignedTargets.map((target, index) => (
                        <Badge key={index} variant="secondary">
                          {target}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <Label>Điều kiện áp dụng</Label>
                  <div className="space-y-3 mt-2">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="edit-lead-source">Nguồn leads</Label>
                        <Select defaultValue={selectedDistributionRule.conditions.source?.[0] || 'all'}>
                          <SelectTrigger className="mt-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">Tất cả nguồn</SelectItem>
                            <SelectItem value="website">Website</SelectItem>
                            <SelectItem value="zalo">Zalo OA</SelectItem>
                            <SelectItem value="facebook">Facebook</SelectItem>
                            <SelectItem value="phone">Điện thoại</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="edit-max-leads">Leads phân tối đa cho từng người</Label>
                        <Input
                          id="edit-max-leads"
                          type="number"
                          defaultValue={selectedDistributionRule.conditions.maxLeads}
                          placeholder="Không giới hạn"
                          className="mt-1"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="edit-time-range">Thời gian áp dụng</Label>
                        <Select 
                          value={editTimeRange} 
                          onValueChange={setEditTimeRange}
                          defaultValue={selectedDistributionRule.conditions.timeRange || 'all'}
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">24/7</SelectItem>
                            <SelectItem value="business">Giờ hành chính</SelectItem>
                            <SelectItem value="custom">Tùy chỉnh</SelectItem>
                          </SelectContent>
                        </Select>
                        
                        {editTimeRange === 'custom' && (
                          <div className="mt-3 p-3 border rounded-lg bg-gray-50">
                            <Label className="text-sm font-medium mb-2 block">Chọn khung giờ</Label>
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <Label htmlFor="edit-start-time" className="text-xs text-gray-600">Từ giờ</Label>
                                <Select>
                                  <SelectTrigger className="mt-1">
                                    <SelectValue placeholder="08:00" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="06:00">06:00</SelectItem>
                                    <SelectItem value="07:00">07:00</SelectItem>
                                    <SelectItem value="08:00">08:00</SelectItem>
                                    <SelectItem value="09:00">09:00</SelectItem>
                                    <SelectItem value="10:00">10:00</SelectItem>
                                    <SelectItem value="11:00">11:00</SelectItem>
                                    <SelectItem value="12:00">12:00</SelectItem>
                                    <SelectItem value="13:00">13:00</SelectItem>
                                    <SelectItem value="14:00">14:00</SelectItem>
                                    <SelectItem value="15:00">15:00</SelectItem>
                                    <SelectItem value="16:00">16:00</SelectItem>
                                    <SelectItem value="17:00">17:00</SelectItem>
                                    <SelectItem value="18:00">18:00</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div>
                                <Label htmlFor="edit-end-time" className="text-xs text-gray-600">Đến giờ</Label>
                                <Select>
                                  <SelectTrigger className="mt-1">
                                    <SelectValue placeholder="17:00" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="12:00">12:00</SelectItem>
                                    <SelectItem value="13:00">13:00</SelectItem>
                                    <SelectItem value="14:00">14:00</SelectItem>
                                    <SelectItem value="15:00">15:00</SelectItem>
                                    <SelectItem value="16:00">16:00</SelectItem>
                                    <SelectItem value="17:00">17:00</SelectItem>
                                    <SelectItem value="18:00">18:00</SelectItem>
                                    <SelectItem value="19:00">19:00</SelectItem>
                                    <SelectItem value="20:00">20:00</SelectItem>
                                    <SelectItem value="21:00">21:00</SelectItem>
                                    <SelectItem value="22:00">22:00</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                            <div className="mt-3">
                              <Label className="text-xs text-gray-600 mb-2 block">Ngày trong tuần</Label>
                              <div className="flex flex-wrap gap-2">
                                <div className="flex items-center space-x-1">
                                  <input type="checkbox" id="edit-mon" defaultChecked />
                                  <label htmlFor="edit-mon" className="text-xs">T2</label>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <input type="checkbox" id="edit-tue" defaultChecked />
                                  <label htmlFor="edit-tue" className="text-xs">T3</label>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <input type="checkbox" id="edit-wed" defaultChecked />
                                  <label htmlFor="edit-wed" className="text-xs">T4</label>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <input type="checkbox" id="edit-thu" defaultChecked />
                                  <label htmlFor="edit-thu" className="text-xs">T5</label>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <input type="checkbox" id="edit-fri" defaultChecked />
                                  <label htmlFor="edit-fri" className="text-xs">T6</label>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <input type="checkbox" id="edit-sat" />
                                  <label htmlFor="edit-sat" className="text-xs">T7</label>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <input type="checkbox" id="edit-sun" />
                                  <label htmlFor="edit-sun" className="text-xs">CN</label>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="edit-priority">Độ ưu tiên</Label>
                        <Select defaultValue={selectedDistributionRule.conditions.priority || 'medium'}>
                          <SelectTrigger className="mt-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="high">Cao</SelectItem>
                            <SelectItem value="medium">Trung bình</SelectItem>
                            <SelectItem value="low">Thấp</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <DialogFooter>
              <Button variant="outline" onClick={() => setShowEditDistributionRule(false)}>
                Hủy
              </Button>
              <Button onClick={() => {
                // TODO: Implement edit distribution rule logic
                setShowEditDistributionRule(false)
              }}>
                Cập nhật
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Distribution Rule Confirmation Modal */}
        <Dialog open={!!distributionRuleToDelete} onOpenChange={(open) => !open && setDistributionRuleToDelete(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Xác nhận xóa quy tắc</DialogTitle>
              <DialogDescription>
                Bạn có chắc chắn muốn xóa quy tắc phân bổ này không? Hành động này không thể hoàn tác.
              </DialogDescription>
            </DialogHeader>
            
            {distributionRuleToDelete && (
              <div className="py-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900">{distributionRuleToDelete.name}</h4>
                  <p className="text-sm text-gray-600 mt-1">{distributionRuleToDelete.description}</p>
                  <div className="flex items-center space-x-2 mt-2">
                    <Badge variant="outline" className="text-xs">
                      {distributionRuleToDelete.assignmentType === 'department' ? 'Phòng ban' : 
                       distributionRuleToDelete.assignmentType === 'team' ? 'Team' : 'Cá nhân'}
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                      {distributionRuleToDelete.leadsAssigned} leads đã phân
                    </Badge>
                  </div>
                </div>
              </div>
            )}

            <DialogFooter>
              <Button variant="outline" onClick={() => setDistributionRuleToDelete(null)}>
                Hủy
              </Button>
              <Button variant="destructive" onClick={handleConfirmDeleteDistributionRule}>
                Xóa quy tắc
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    )
  }

  // Component: Interface Management
  const InterfaceManagement = () => {
    const [logoFile, setLogoFile] = useState<File | null>(null)
    const [faviconFile, setFaviconFile] = useState<File | null>(null)

    const colorOptions = [
      { name: 'Blue', value: '#3B82F6' },
      { name: 'Green', value: '#10B981' },
      { name: 'Purple', value: '#8B5CF6' },
      { name: 'Red', value: '#EF4444' },
      { name: 'Orange', value: '#F59E0B' },
      { name: 'Pink', value: '#EC4899' },
      { name: 'Indigo', value: '#6366F1' },
      { name: 'Teal', value: '#14B8A6' }
    ]

    const themes = [
      { value: 'light', label: 'Sáng', icon: '☀️' },
      { value: 'dark', label: 'Tối', icon: '🌙' },
      { value: 'auto', label: 'Tự động', icon: '🔄' }
    ]

    const dateFormats = [
      { value: 'DD/MM/YYYY', label: '31/12/2025' },
      { value: 'MM/DD/YYYY', label: '12/31/2025' },
      { value: 'YYYY-MM-DD', label: '2025-12-31' },
      { value: 'DD-MM-YYYY', label: '31-12-2025' }
    ]

    const numberFormats = [
      { value: '1,000.00', label: '1,000.00' },
      { value: '1.000,00', label: '1.000,00' },
      { value: '1 000.00', label: '1 000.00' },
      { value: '1000.00', label: '1000.00' }
    ]

    const currencies = [
      { value: 'VND', label: 'Vietnamese Dong (₫)' },
      { value: 'USD', label: 'US Dollar ($)' },
      { value: 'EUR', label: 'Euro (€)' },
      { value: 'JPY', label: 'Japanese Yen (¥)' }
    ]

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Giao diện & Ngôn ngữ</h2>
            <p className="text-gray-600">Tùy chỉnh giao diện và cài đặt ngôn ngữ hệ thống</p>
          </div>
          <Button>
            <Save className="w-4 h-4 mr-2" />
            Lưu cài đặt
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Theme & Appearance */}
          <Card>
            <CardHeader>
              <CardTitle>Giao diện</CardTitle>
              <CardDescription>Tùy chỉnh giao diện hệ thống</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Theme Selection */}
              <div>
                <Label className="text-sm font-medium">Chủ đề</Label>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {themes.map((theme) => (
                    <Button
                      key={theme.value}
                      variant={interfaceSettings.theme === theme.value ? "default" : "outline"}
                      className="h-12 flex flex-col items-center justify-center"
                      onClick={() => setInterfaceSettings(prev => ({ ...prev, theme: theme.value as any }))}
                    >
                      <span className="text-lg">{theme.icon}</span>
                      <span className="text-xs">{theme.label}</span>
                    </Button>
                  ))}
                </div>
              </div>

              {/* Primary Color */}
              <div>
                <Label className="text-sm font-medium">Màu chính</Label>
                <div className="grid grid-cols-4 gap-2 mt-2">
                  {colorOptions.map((color) => (
                    <button
                      key={color.value}
                      className={`w-12 h-12 rounded-lg border-2 ${
                        interfaceSettings.primaryColor === color.value 
                          ? 'border-gray-900 scale-110' 
                          : 'border-gray-200 hover:border-gray-400'
                      } transition-all`}
                      style={{ backgroundColor: color.value }}
                      onClick={() => setInterfaceSettings(prev => ({ ...prev, primaryColor: color.value }))}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>

              {/* Logo Upload */}
              <div>
                <Label className="text-sm font-medium">Logo công ty</Label>
                <div className="mt-2 space-y-2">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50">
                      {interfaceSettings.logo.url ? (
                        <Image 
                          src={interfaceSettings.logo.url} 
                          alt="Logo" 
                          width={64}
                          height={64}
                          className="max-w-full max-h-full object-contain"
                        />
                      ) : (
                        <Camera className="w-6 h-6 text-gray-400" />
                      )}
                    </div>
                    <div className="flex-1">
                      <Button variant="outline" size="sm">
                        <Upload className="w-4 h-4 mr-2" />
                        Tải lên logo
                      </Button>
                      <p className="text-xs text-gray-500 mt-1">
                        PNG, JPG hoặc SVG. Tối đa 2MB. Khuyến nghị: 180x60px
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Company Info */}
              <div className="space-y-3">
                <div>
                  <Label htmlFor="company-name">Tên công ty</Label>
                  <Input
                    id="company-name"
                    value={interfaceSettings.companyName}
                    onChange={(e) => setInterfaceSettings(prev => ({ ...prev, companyName: e.target.value }))}
                    placeholder="Nhập tên công ty"
                  />
                </div>
                <div>
                  <Label htmlFor="system-name">Tên hệ thống</Label>
                  <Input
                    id="system-name"
                    value={interfaceSettings.systemName}
                    onChange={(e) => setInterfaceSettings(prev => ({ ...prev, systemName: e.target.value }))}
                    placeholder="Nhập tên hệ thống"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const UserManagement = () => {
    const filteredUsers = users.filter(user => {
      const matchesSearch = user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           user.username.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesRole = !roleFilter || user.role === roleFilter
      const matchesStatus = !statusFilter || user.status === statusFilter
      
      return matchesSearch && matchesRole && matchesStatus
    })

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Quản lý Người dùng</h2>
            <p className="text-gray-600">Tạo, chỉnh sửa và phân quyền người dùng</p>
          </div>
          <Button onClick={() => setShowUserModal(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Thêm người dùng
          </Button>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Tìm kiếm người dùng..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Vai trò" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả vai trò</SelectItem>
                  <SelectItem value="admin">Quản trị viên</SelectItem>
                  <SelectItem value="manager">Quản lý</SelectItem>
                  <SelectItem value="sales">Sales</SelectItem>
                  <SelectItem value="support">Hỗ trợ</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả trạng thái</SelectItem>
                  <SelectItem value="active">Hoạt động</SelectItem>
                  <SelectItem value="inactive">Tạm dừng</SelectItem>
                  <SelectItem value="locked">Bị khóa</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline">
                <Filter className="w-4 h-4 mr-2" />
                Lọc nâng cao
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Người dùng</TableHead>
                  <TableHead>Vai trò</TableHead>
                  <TableHead>Phòng ban/Team</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Đăng nhập cuối</TableHead>
                  <TableHead>Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{user.fullName}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                        <div className="text-xs text-gray-400">@{user.username}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col space-y-1">
                        <Badge className={getRoleColor(user.role)}>
                          {user.role === 'admin' ? 'Quản trị viên' :
                           user.role === 'manager' ? 'Quản lý' :
                           user.role === 'sales' ? 'Sales' : 'Hỗ trợ'}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="text-sm">{user.department}</div>
                        <div className="text-xs text-gray-500">{user.team}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(user.status)}>
                        {user.status === 'active' ? 'Hoạt động' :
                         user.status === 'inactive' ? 'Tạm dừng' : 'Bị khóa'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">{formatDate(user.lastLogin)}</div>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem onClick={() => {
                            setSelectedUser(user)
                            setShowUserModal(true)
                          }}>
                            <Edit2 className="w-4 h-4 mr-2" />
                            Chỉnh sửa
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Eye className="w-4 h-4 mr-2" />
                            Xem lịch sử
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Key className="w-4 h-4 mr-2" />
                            Đặt lại mật khẩu
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            {user.status === 'active' ? (
                              <>
                                <Lock className="w-4 h-4 mr-2" />
                                Khóa tài khoản
                              </>
                            ) : (
                              <>
                                <Unlock className="w-4 h-4 mr-2" />
                                Mở khóa
                              </>
                            )}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* User Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Tổng người dùng</p>
                  <p className="text-2xl font-bold">{users.length}</p>
                </div>
                <Users className="w-6 h-6 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Đang hoạt động</p>
                  <p className="text-2xl font-bold text-green-600">
                    {users.filter(u => u.status === 'active').length}
                  </p>
                </div>
                <CheckCircle className="w-6 h-6 text-green-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Online hôm nay</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {users.filter(u => {
                      const today = new Date().toDateString()
                      const lastLogin = new Date(u.lastLogin).toDateString()
                      return today === lastLogin
                    }).length}
                  </p>
                </div>
                <Clock className="w-6 h-6 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // Component: Integration Management
  const IntegrationManagement = () => {
    const [integrations, setIntegrations] = useState<IntegrationConfig[]>([
      // Zalo 1 - Pending
      {
        id: 'zalo-001',
        type: 'zalo',
        name: 'Lưu Thị Hằng',
        status: 'pending',
        accountId: '1234567890',
        creator: 'Nguyễn Văn A',
        createdAt: '2025-01-15',
        lastSync: '2025-01-22T08:48:00',
        badges: ['Zalo'],
        config: {
          appId: 'zalo_app_001',
          token: 'zalo_token_***',
          webhookUrl: 'https://api.company.com/webhook/zalo/001',
          syncFrequency: 30,
          autoTags: ['Zalo OA'],
          syncLeads: true,
          syncMessages: true,
          syncForms: false,
          syncNotifications: false
        },
        permissions: {
          connect: ['admin', 'manager'],
          edit: ['admin'],
          delete: ['admin']
        },
        errorLog: []
      },
      // Zalo 2 - Connected
      {
        id: 'zalo-002',
        type: 'zalo',
        name: 'My Shop OA',
        status: 'connected',
        accountId: '0987654321',
        creator: 'Trần Thị B',
        createdAt: '2025-01-10',
        lastSync: '2025-01-22T09:15:00',
        badges: ['Zalo', 'Vip'],
        config: {
          appId: 'zalo_app_002',
          token: 'zalo_token_***',
          webhookUrl: 'https://api.company.com/webhook/zalo/002',
          syncFrequency: 60,
          autoTags: ['Zalo OA', 'VIP'],
          syncLeads: true,
          syncMessages: true,
          syncForms: true,
          syncNotifications: true
        },
        permissions: {
          connect: ['admin', 'manager'],
          edit: ['admin'],
          delete: ['admin']
        },
        errorLog: []
      },
      // Facebook 1 - Pending
      {
        id: 'fb-001',
        type: 'facebook',
        name: 'My Shop OA',
        status: 'pending',
        accountId: '5555666677',
        creator: 'Lê Văn C',
        createdAt: '2025-01-18',
        lastSync: '2025-01-22T08:30:00',
        badges: ['Facebook'],
        config: {
          appId: 'fb_app_001',
          token: 'fb_token_***',
          webhookUrl: 'https://api.company.com/webhook/facebook/001',
          syncFrequency: 30,
          autoTags: ['Facebook'],
          syncLeads: true,
          syncMessages: false,
          syncForms: false,
          syncNotifications: true
        },
        permissions: {
          connect: ['admin', 'manager'],
          edit: ['admin'],
          delete: ['admin']
        },
        errorLog: []
      },
      // Facebook 2 - Connected
      {
        id: 'fb-002',
        type: 'facebook',
        name: 'My Shop OA',
        status: 'connected',
        accountId: '8888999900',
        creator: 'Phạm Thị D',
        createdAt: '2025-01-12',
        lastSync: '2025-01-22T09:00:00',
        badges: ['Facebook', 'Vip'],
        config: {
          appId: 'fb_app_002',
          token: 'fb_token_***',
          webhookUrl: 'https://api.company.com/webhook/facebook/002',
          syncFrequency: 60,
          autoTags: ['Facebook', 'VIP'],
          syncLeads: true,
          syncMessages: true,
          syncForms: true,
          syncNotifications: true
        },
        permissions: {
          connect: ['admin', 'manager'],
          edit: ['admin'],
          delete: ['admin']
        },
        errorLog: []
      }
    ])

    const getStatusIcon = (status: string) => {
      switch (status) {
        case 'connected':
          return <CheckCircle className="w-5 h-5 text-green-500" />
        case 'disconnected':
          return <X className="w-5 h-5 text-gray-500" />
        case 'error':
          return <AlertTriangle className="w-5 h-5 text-red-500" />
        default:
          return <RefreshCw className="w-5 h-5 text-blue-500" />
      }
    }

    const getStatusColor = (status: string) => {
      switch (status) {
        case 'connected': return 'bg-green-100 text-green-800'
        case 'disconnected': return 'bg-gray-100 text-gray-800'
        case 'error': return 'bg-red-100 text-red-800'
        default: return 'bg-blue-100 text-blue-800'
      }
    }

    // Format date/time helper
    const formatDateTime = (dateStr: string) => {
      try {
        const date = new Date(dateStr)
        const day = String(date.getDate()).padStart(2, '0')
        const month = String(date.getMonth() + 1).padStart(2, '0')
        const year = date.getFullYear()
        const hours = String(date.getHours()).padStart(2, '0')
        const minutes = String(date.getMinutes()).padStart(2, '0')

        if (dateStr.includes('T') || dateStr.includes(':')) {
          return `${day}/${month}/${year} ${hours}:${minutes}`
        }
        return `${day}/${month}/${year}`
      } catch {
        return dateStr
      }
    }

    // Status badge helper
    const getStatusBadge = (status: string) => {
      switch (status) {
        case 'connected':
          return <Badge className="bg-blue-500 text-white font-medium">ĐÃ KẾT NỐI</Badge>
        case 'pending':
          return <Badge className="bg-orange-500 text-white font-medium">MẤT KẾT NỐI</Badge>
        case 'error':
          return <Badge className="bg-red-500 text-white font-medium">LỖI</Badge>
        default:
          return null
      }
    }

    // Sync frequency options
    const syncFrequencyOptions = [
      { value: 30, label: '30 phút' },
      { value: 60, label: '60 phút' },
      { value: 120, label: '2 giờ' },
      { value: 240, label: '4 giờ' }
    ]

    // Handler: Sync integration
    const handleSync = (id: string) => {
      setIntegrations(prev => prev.map(i =>
        i.id === id
          ? { ...i, lastSync: new Date().toISOString() }
          : i
      ))
    }

    // Handler: Edit integration
    const handleEdit = (id: string) => {
      const integration = integrations.find(i => i.id === id)
      if (integration) {
        // TODO: Open edit modal
        console.log('Edit:', integration)
      }
    }

    // Handler: Delete integration
    const handleDelete = (id: string) => {
      if (confirm('Bạn có chắc muốn xóa tích hợp này?')) {
        setIntegrations(prev => prev.filter(i => i.id !== id))
      }
    }

    // Handler: Toggle switches
    const handleToggleSwitch = (id: string, field: 'syncMessages' | 'syncNotifications', value: boolean) => {
      setIntegrations(prev => prev.map(i =>
        i.id === id
          ? {
              ...i,
              config: {
                ...i.config,
                [field]: value
              }
            }
          : i
      ))
    }

    // Handler: Change sync frequency
    const handleFrequencyChange = (id: string, frequency: number) => {
      setIntegrations(prev => prev.map(i =>
        i.id === id
          ? {
              ...i,
              config: {
                ...i.config,
                syncFrequency: frequency
              }
            }
          : i
      ))
    }

    // Handler: Auto-check QR connection
    const startQRCheck = () => {
      setQRCheckStatus('checking')

      // Simulate API check (replace with real API)
      const interval = setInterval(() => {
        // TODO: Call API to check if QR was scanned
        // Example: fetch('/api/zalo/check-qr-status')

        // Simulate success after random time (for demo)
        const randomSuccess = Math.random() > 0.7
        if (randomSuccess) {
          setQRCheckStatus('success')
          clearInterval(interval)
          setQRCheckInterval(null)

          // Add new integration to list
          const newIntegration: IntegrationConfig = {
            id: `zalo-personal-${Date.now()}`,
            type: 'zalo',
            name: 'Zalo Cá nhân',
            status: 'connected',
            accountId: 'zalo_personal_' + Math.random().toString(36).substr(2, 9),
            creator: 'Người dùng hiện tại',
            createdAt: new Date().toISOString(),
            lastSync: new Date().toISOString(),
            badges: ['Zalo', 'Cá nhân'],
            config: {
              syncFrequency: 30,
              autoTags: ['Zalo Personal'],
              syncLeads: false,
              syncMessages: true,
              syncForms: false,
              syncNotifications: true
            },
            permissions: {
              connect: ['admin'],
              edit: ['admin'],
              delete: ['admin']
            },
            errorLog: []
          }

          setIntegrations(prev => [...prev, newIntegration])

          // Close modal after 1.5s
          setTimeout(() => {
            setShowQRModal(false)
            setQRCheckStatus('pending')
          }, 1500)
        }
      }, 3000) // Check every 3 seconds

      setQRCheckInterval(interval)
    }

    // Handler: Cleanup on modal close
    const closeQRModal = () => {
      if (qrCheckInterval) {
        clearInterval(qrCheckInterval)
        setQRCheckInterval(null)
      }
      setQRCheckStatus('pending')
      setShowQRModal(false)
    }

    // Handler: Integration type selection
    const handleIntegrationTypeSelect = () => {
      if (selectedIntegrationType === 'zalo-personal') {
        setShowIntegrationModal(false)
        setShowQRModal(true)
        // Auto-start checking when modal opens
        setTimeout(() => startQRCheck(), 500)
      } else if (selectedIntegrationType === 'zalo-oa') {
        setShowIntegrationModal(false)
        setShowOALinkModal(true)
      } else if (selectedIntegrationType === 'facebook') {
        // Disabled for now
        alert('Tính năng này sẽ được phát triển sau')
      }
    }

    // Handler: Open OA Permission modal from OA Link modal
    const handleOAConnect = () => {
      setShowOALinkModal(false)
      setShowOAPermissionModal(true)
    }

    // Handler: Grant OA permissions
    const handleOAGrantPermission = () => {
      // TODO: Call OAuth API
      // For now, just add to integrations

      const newIntegration: IntegrationConfig = {
        id: `zalo-oa-${Date.now()}`,
        type: 'zalo',
        name: 'Pancake Viet Nam',
        status: 'connected',
        accountId: '3310249125083374313',
        creator: 'Admin',
        createdAt: new Date().toISOString(),
        lastSync: new Date().toISOString(),
        badges: ['Zalo', 'OA', 'Premium'],
        config: {
          appId: '4052056140860594003',
          syncFrequency: 60,
          autoTags: ['Zalo OA', 'Official'],
          syncLeads: true,
          syncMessages: true,
          syncForms: true,
          syncNotifications: true
        },
        permissions: {
          connect: ['admin', 'manager'],
          edit: ['admin'],
          delete: ['admin']
        },
        errorLog: []
      }

      setIntegrations(prev => [...prev, newIntegration])
      setShowOAPermissionModal(false)
      setSelectedIntegrationType('')
    }

    // IntegrationCard Component
    const IntegrationCard = ({ integration }: { integration: IntegrationConfig }) => {
      return (
        <Card className="hover:shadow-md transition-shadow">
          {/* Header */}
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-bold">
                {integration.name}
              </CardTitle>
              {getStatusBadge(integration.status)}
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Info Section */}
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">
                  {integration.type === 'zalo' ? 'OA ID:' : 'Page ID:'}
                </span>
                <span className="font-medium break-all">{integration.accountId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">
                  {integration.type === 'zalo' ? 'Người tạo:' : 'Người liên hệ:'}
                </span>
                <span className="font-medium">{integration.creator}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Thời gian tạo:</span>
                <span className="font-medium">
                  {formatDateTime(integration.createdAt)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Đồng bộ lần cuối:</span>
                <span className="font-medium">
                  {formatDateTime(integration.lastSync)}
                </span>
              </div>
            </div>

            {/* Settings Section */}
            <div className="border rounded-lg p-3 space-y-3 bg-gray-50">
              {/* Switch 1: Sync Messages */}
              <div className="flex items-center justify-between">
                <Label htmlFor={`sync-messages-${integration.id}`} className="text-sm">
                  Đồng bộ Tin nhắn
                </Label>
                <Switch
                  id={`sync-messages-${integration.id}`}
                  checked={integration.config.syncMessages}
                  onCheckedChange={(checked) =>
                    handleToggleSwitch(integration.id, 'syncMessages', checked)
                  }
                />
              </div>

              {/* Switch 2: Sync Notifications */}
              <div className="flex items-center justify-between">
                <Label htmlFor={`sync-notifications-${integration.id}`} className="text-sm">
                  Đồng bộ Thông báo
                </Label>
                <Switch
                  id={`sync-notifications-${integration.id}`}
                  checked={integration.config.syncNotifications}
                  onCheckedChange={(checked) =>
                    handleToggleSwitch(integration.id, 'syncNotifications', checked)
                  }
                />
              </div>

              {/* Dropdown: Sync Frequency */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Tần suất đồng bộ:</span>
                <Select
                  value={String(integration.config.syncFrequency)}
                  onValueChange={(value) =>
                    handleFrequencyChange(integration.id, Number(value))
                  }
                >
                  <SelectTrigger className="w-32 h-8 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {syncFrequencyOptions.map(opt => (
                      <SelectItem key={opt.value} value={String(opt.value)}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-2">
              {/* Left - Badges */}
              <div className="flex flex-wrap gap-1">
                {integration.badges.map((badge, idx) => (
                  <Badge key={idx} variant="secondary" className="text-xs">
                    {badge}
                  </Badge>
                ))}
              </div>

              {/* Right - Action Icons */}
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => handleSync(integration.id)}
                  title="Đồng bộ ngay"
                >
                  <RefreshCw className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => handleDelete(integration.id)}
                  title="Xóa"
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => handleEdit(integration.id)}
                  title="Chỉnh sửa"
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )
    }

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Tích hợp Zalo & Facebook</h2>
            <p className="text-gray-600">Kết nối và đồng bộ dữ liệu từ các kênh</p>
          </div>
          <Button onClick={() => setShowIntegrationModal(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Thêm tích hợp
          </Button>
        </div>

        {/* 2-Column Grouped Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Zalo */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 mb-2">
              <MessageSquare className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-semibold">Zalo / Zalo OA</h3>
            </div>
            {integrations
              .filter(i => i.type === 'zalo')
              .map(integration => (
                <IntegrationCard
                  key={integration.id}
                  integration={integration}
                />
              ))
            }
            {integrations.filter(i => i.type === 'zalo').length === 0 && (
              <Card className="border-dashed">
                <CardContent className="py-8 text-center text-gray-500">
                  <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-30" />
                  <p>Chưa có tích hợp Zalo OA</p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - Facebook */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 mb-2">
              <Facebook className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-semibold">Facebook Fanpage</h3>
            </div>
            {integrations
              .filter(i => i.type === 'facebook')
              .map(integration => (
                <IntegrationCard
                  key={integration.id}
                  integration={integration}
                />
              ))
            }
            {integrations.filter(i => i.type === 'facebook').length === 0 && (
              <Card className="border-dashed">
                <CardContent className="py-8 text-center text-gray-500">
                  <Facebook className="w-8 h-8 mx-auto mb-2 opacity-30" />
                  <p>Chưa có tích hợp Facebook</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Modal: Chọn loại tích hợp */}
        {showIntegrationModal && (
          <Dialog open={showIntegrationModal} onOpenChange={setShowIntegrationModal}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Thêm tích hợp mới</DialogTitle>
                <DialogDescription>
                  Chọn loại tích hợp bạn muốn kết nối với Vilead CRM
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                <div>
                  <Label>Loại tích hợp</Label>
                  <Select
                    value={selectedIntegrationType}
                    onValueChange={(value) => setSelectedIntegrationType(value as 'zalo-personal' | 'zalo-oa' | 'facebook' | '')}
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Chọn loại tích hợp" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="zalo-personal">
                        <div className="flex items-center gap-2">
                          <MessageSquare className="w-4 h-4" />
                          Kết nối Zalo cá nhân
                        </div>
                      </SelectItem>
                      <SelectItem value="zalo-oa">
                        <div className="flex items-center gap-2">
                          <MessageSquare className="w-4 h-4" />
                          Kết nối Zalo OA
                        </div>
                      </SelectItem>
                      <SelectItem value="facebook" disabled>
                        <div className="flex items-center gap-2 opacity-50">
                          <Facebook className="w-4 h-4" />
                          Kết nối Facebook Fanpage (Sắp ra mắt)
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {selectedIntegrationType === 'zalo-personal' && (
                  <div className="bg-blue-50 border border-blue-200 rounded p-3">
                    <p className="text-sm text-blue-800">
                      Quét mã QR bằng ứng dụng Zalo để kết nối tài khoản cá nhân với CRM
                    </p>
                  </div>
                )}

                {selectedIntegrationType === 'zalo-oa' && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded p-3">
                    <p className="text-sm text-yellow-800">
                      <AlertTriangle className="w-4 h-4 inline mr-1" />
                      Yêu cầu gói <strong>OA Nâng cao</strong> hoặc <strong>OA Premium</strong>
                    </p>
                  </div>
                )}
              </div>

              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowIntegrationModal(false)
                    setSelectedIntegrationType('')
                  }}
                >
                  Hủy
                </Button>
                <Button
                  onClick={handleIntegrationTypeSelect}
                  disabled={!selectedIntegrationType}
                >
                  Tiếp tục
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}

        {/* Modal: QR Code - Kết nối Zalo cá nhân */}
        {showQRModal && (
          <Dialog open={showQRModal} onOpenChange={closeQRModal}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle className="text-2xl">Kết nối Zalo cá nhân</DialogTitle>
              </DialogHeader>

              <div className="flex gap-8">
                {/* Left: QR Code */}
                <div className="flex-shrink-0">
                  <div className="w-64 h-64 bg-gray-100 border-2 border-gray-300 rounded-lg flex items-center justify-center relative">
                    {qrCheckStatus === 'pending' || qrCheckStatus === 'checking' ? (
                      <>
                        {/* Placeholder QR code - replace with real QR */}
                        <div className="w-56 h-56 bg-white border border-gray-200 rounded flex items-center justify-center">
                          <QrCode className="w-32 h-32 text-gray-400" />
                        </div>
                        {qrCheckStatus === 'checking' && (
                          <div className="absolute inset-0 bg-white bg-opacity-80 flex items-center justify-center">
                            <RefreshCw className="w-8 h-8 animate-spin text-blue-500" />
                          </div>
                        )}
                      </>
                    ) : qrCheckStatus === 'success' ? (
                      <div className="text-center">
                        <CheckCircle className="w-24 h-24 text-green-500 mx-auto mb-2" />
                        <p className="text-green-600 font-medium">Kết nối thành công!</p>
                      </div>
                    ) : (
                      <div className="text-center">
                        <XCircle className="w-24 h-24 text-red-500 mx-auto mb-2" />
                        <p className="text-red-600 font-medium">Lỗi kết nối</p>
                        <Button
                          variant="outline"
                          size="sm"
                          className="mt-2"
                          onClick={startQRCheck}
                        >
                          <RefreshCw className="w-4 h-4 mr-1" />
                          Thử lại
                        </Button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right: Instructions */}
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-4">
                    Quét QR để kết nối Zalo với Vilead CRM
                  </h3>

                  <ol className="space-y-3 text-sm">
                    <li className="flex items-start gap-2">
                      <span className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                        1
                      </span>
                      <div>
                        <span>Mở ứng dụng </span>
                        <Badge variant="outline" className="mx-1">
                          <MessageSquare className="w-3 h-3 mr-1" />
                          Zalo
                        </Badge>
                        <span>trên di động.</span>
                      </div>
                    </li>

                    <li className="flex items-start gap-2">
                      <span className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                        2
                      </span>
                      <div>
                        <span>Ở mục ⚙️ </span>
                        <strong>Cài đặt</strong>
                        <span>, nhấn nút quét QR 📷</span>
                      </div>
                    </li>

                    <li className="flex items-start gap-2">
                      <span className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                        3
                      </span>
                      <span>Quét mã QR để đăng nhập.</span>
                    </li>
                  </ol>

                  <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded p-3">
                    <p className="text-sm font-medium text-yellow-900 mb-1">Lưu ý:</p>
                    <ul className="text-xs text-yellow-800 space-y-1">
                      <li>• Không truy cập: <code className="bg-yellow-100 px-1 rounded">chat.Zalo.me</code> để tránh bị mất kết nối</li>
                      <li>• Nếu mất kết nối: Bạn làm mới kết nối và đăng nhập lại</li>
                    </ul>
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={closeQRModal}>
                  Đóng
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}

        {/* Modal: Kết nối Zalo OA - Step 1 (Link) */}
        {showOALinkModal && (
          <Dialog open={showOALinkModal} onOpenChange={setShowOALinkModal}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle className="text-2xl text-center">
                  Kết nối Pancake
                </DialogTitle>
                <DialogDescription className="text-center">
                  với tài khoản Zalo OA
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6 py-4">
                {/* Logo Section */}
                <div className="flex items-center justify-center gap-6">
                  <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                    <span className="text-2xl font-bold text-blue-600">V</span>
                  </div>

                  <RefreshCw className="w-6 h-6 text-gray-400" />

                  <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center">
                    <MessageSquare className="w-8 h-8 text-white" />
                  </div>
                </div>

                {/* Warning Message */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
                  <p className="text-sm text-gray-700">
                    Zalo OA yêu cầu bạn phải mua gói{' '}
                    <strong className="text-yellow-800">OA Nâng cao</strong> hoặc{' '}
                    <strong className="text-yellow-800">OA Premium</strong>{' '}
                    để có thể kết nối với Vilead CRM
                  </p>
                </div>

                {/* Connect Button */}
                <Button
                  className="w-full h-12 text-base"
                  onClick={handleOAConnect}
                >
                  <MessageSquare className="w-5 h-5 mr-2" />
                  Kết nối tài khoản Zalo OA
                </Button>

                {/* Help Link */}
                <div className="text-center">
                  <button className="text-sm text-blue-600 hover:underline inline-flex items-center gap-1">
                    <HelpCircle className="w-4 h-4" />
                    Hướng dẫn kết nối
                  </button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}

        {/* Modal: Zalo OA Permissions - Step 2 (OAuth) */}
        {showOAPermissionModal && (
          <Dialog open={showOAPermissionModal} onOpenChange={setShowOAPermissionModal}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-xl">
                  Yêu cầu cấp quyền truy cập Official Account
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-4">
                {/* App Info */}
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-white rounded border flex items-center justify-center">
                      <span className="text-lg font-bold text-blue-600">P</span>
                    </div>
                    <div>
                      <p className="font-medium">Pancake V2</p>
                      <p className="text-xs text-gray-500">APP ID: 4052056140860594003</p>
                    </div>
                  </div>

                  <RefreshCw className="w-5 h-5 text-gray-400" />

                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                      <MessageSquare className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="font-medium">Pancake Viet Nam</p>
                      <p className="text-xs text-gray-500">OA ID: 3310249125083374313</p>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm text-gray-700">
                  Ứng dụng đang yêu cầu Official Account <strong>Pancake Viet Nam</strong> cấp các quyền sau:
                </p>

                {/* Warning */}
                <div className="bg-orange-50 border border-orange-200 rounded p-3">
                  <p className="text-sm text-orange-800">
                    ⚠️ OA đã <strong>xác thực</strong> và <strong>năng cấp gói</strong> sẽ được sử dụng các API sau:
                  </p>
                </div>

                {/* API Permissions */}
                <div>
                  <h4 className="font-medium text-sm mb-2">Quyền sử dụng API (7)</h4>
                  <div className="space-y-1">
                    {[
                      'Quyền: Sử dụng ZNS',
                      'Quyền: Gửi tin nhắn',
                      'Quyền: Quản lý thông tin OA',
                      'Quyền: Quản lý tin nhắn người quan tâm',
                      'Quyền: Quản lý Nhóm Chat - GMF',
                      'Quyền: Quản lý cửa hàng, đơn hàng',
                      'Quyền: Quản lý bài viết'
                    ].map((permission, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-2 bg-gray-50 rounded text-sm hover:bg-gray-100 cursor-pointer"
                      >
                        <span>{permission}</span>
                        <ChevronDown className="w-4 h-4 text-gray-400" />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Event Permissions */}
                <div>
                  <h4 className="font-medium text-sm mb-2">Quyền nhận sự kiện (5)</h4>
                  <div className="space-y-1">
                    {[
                      'Quyền: Nhận sự kiện quản lý gửi ZNS',
                      'Quyền: Nhận sự kiện quản lý tin nhắn',
                      'Quyền: Nhận sự kiện quản lý người quan tâm',
                      'Quyền: Nhận sự kiện Quản lý Nhóm Chat - GMF',
                      'Quyền: Nhận sự kiện quản lý cửa hàng, đơn hàng'
                    ].map((permission, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-2 bg-gray-50 rounded text-sm hover:bg-gray-100 cursor-pointer"
                      >
                        <span>{permission}</span>
                        <ChevronDown className="w-4 h-4 text-gray-400" />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Terms Checkbox */}
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="terms-checkbox"
                    className="w-4 h-4 rounded border-gray-300"
                    defaultChecked
                  />
                  <label htmlFor="terms-checkbox" className="text-sm text-gray-700">
                    Tôi đã đọc và đồng ý với{' '}
                    <a href="#" className="text-blue-600 hover:underline">
                      Điều khoản sử dụng của Zalo
                    </a>
                    {' '}và{' '}
                    <a href="#" className="text-blue-600 hover:underline">
                      Điều khoản sử dụng Mạng xã hội Zalo
                    </a>
                  </label>
                </div>
              </div>

              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setShowOAPermissionModal(false)}
                >
                  Hủy
                </Button>
                <Button onClick={handleOAGrantPermission}>
                  Cấp quyền
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>
    )
  }

  // Custom Role Management Component - Disabled
  const CustomRoleManagement = () => {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Chức năng Vai trò không khả dụng</h3>
          <p className="text-gray-500">Chức năng quản lý vai trò đã được tắt.</p>
        </div>
      </div>
    )
  }



  // Data Template Management Component
  const DataTemplateManagement = () => {
    const [templates, setTemplates] = useState([
      {
        id: 1,
        name: 'Lead Zalo OA',
        type: 'lead',
        description: 'Mẫu cho lead từ Zalo OA',
        defaultValues: {
          source: 'zalo',
          status: 'new',
          tags: ['Zalo OA', 'Tiềm năng'],
          priority: 'medium'
        },
        requiredFields: ['name', 'phone'],
        customFields: [
          { name: 'sở_thích', type: 'text', required: false },
          { name: 'khu_vực', type: 'select', options: ['Hà Nội', 'TP.HCM', 'Đà Nẵng'], required: true }
        ],
        assignedTo: ['team_a', 'team_b'],
        createdAt: '2025-06-01',
        isActive: true
      },
      {
        id: 2,
        name: 'Đơn hàng VIP',
        type: 'order',
        description: 'Mẫu cho đơn hàng khách VIP',
        defaultValues: {
          status: 'pending_contract',
          priority: 'high',
          tags: ['VIP', 'Cao cấp'],
          discount: 10
        },
        requiredFields: ['customer', 'product', 'value'],
        customFields: [
          { name: 'ghi_chú_vip', type: 'textarea', required: true },
          { name: 'hình_thức_thanh_toán', type: 'select', options: ['Chuyển khoản', 'Tiền mặt', 'Thẻ'], required: true }
        ],
        assignedTo: ['vip_team'],
        createdAt: '2025-05-20',
        isActive: true
      },
      {
        id: 3,
        name: 'Khách hàng Doanh nghiệp',
        type: 'customer',
        description: 'Mẫu cho khách hàng doanh nghiệp',
        defaultValues: {
          type: 'business',
          tags: ['Doanh nghiệp', 'B2B'],
          category: 'enterprise'
        },
        requiredFields: ['company_name', 'contact_person', 'email', 'tax_code'],
        customFields: [
          { name: 'quy_mô_công_ty', type: 'select', options: ['Nhỏ (<50)', 'Vừa (50-200)', 'Lớn (>200)'], required: true },
          { name: 'lĩnh_vực', type: 'text', required: true }
        ],
        assignedTo: ['enterprise_team'],
        createdAt: '2025-05-15',
        isActive: true
      }
    ])
    const [selectedTemplate, setSelectedTemplate] = useState<any>(null)
    const [showCreateModal, setShowCreateModal] = useState(false)

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Mẫu Dữ liệu</h2>
            <p className="text-gray-600">Tạo và quản lý mẫu dữ liệu chuẩn hóa</p>
          </div>
          <Button onClick={() => setShowCreateModal(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Tạo mẫu mới
          </Button>
        </div>

        {/* Template Types Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Mẫu Lead</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {templates.filter(t => t.type === 'lead').length}
                  </p>
                </div>
                <Users className="w-6 h-6 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Mẫu Đơn hàng</p>
                  <p className="text-2xl font-bold text-green-600">
                    {templates.filter(t => t.type === 'order').length}
                  </p>
                </div>
                <ShoppingCart className="w-6 h-6 text-green-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Mẫu Khách hàng</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {templates.filter(t => t.type === 'customer').length}
                  </p>
                </div>
                <UserCog className="w-6 h-6 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Templates List */}
        <Card>
          <CardHeader>
            <CardTitle>Danh sách Mẫu</CardTitle>
            <CardDescription>Quản lý tất cả mẫu dữ liệu trong hệ thống</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {templates.map((template) => (
                <div key={template.id} className="border rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center space-x-2">
                          <Badge variant={template.type === 'lead' ? 'default' : template.type === 'order' ? 'secondary' : 'outline'}>
                            {template.type === 'lead' ? 'Lead' : template.type === 'order' ? 'Đơn hàng' : 'Khách hàng'}
                          </Badge>
                          <h3 className="font-medium text-gray-900">{template.name}</h3>
                          {template.isActive ? (
                            <Badge variant="secondary" className="bg-green-100 text-green-800">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Hoạt động
                            </Badge>
                          ) : (
                            <Badge variant="secondary" className="bg-gray-100 text-gray-800">
                              Tạm dừng
                            </Badge>
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{template.description}</p>
                      
                      {/* Template Details */}
                      <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="font-medium text-gray-700">Trường bắt buộc:</span>
                          <div className="mt-1">
                            {template.requiredFields.map((field, index) => (
                              <Badge key={index} variant="outline" className="mr-1 mb-1">
                                {field}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Trường tùy chỉnh:</span>
                          <div className="mt-1">
                            {template.customFields.map((field, index) => (
                              <Badge key={index} variant="secondary" className="mr-1 mb-1">
                                {field.name}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Áp dụng cho:</span>
                          <div className="mt-1">
                            {template.assignedTo.map((team, index) => (
                              <Badge key={index} variant="outline" className="mr-1 mb-1">
                                {team}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm" onClick={() => setSelectedTemplate(template)}>
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Copy className="w-4 h-4" />
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem>
                            <Settings className="w-4 h-4 mr-2" />
                            Cấu hình
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Download className="w-4 h-4 mr-2" />
                            Xuất mẫu
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="w-4 h-4 mr-2" />
                            Xóa
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Template Usage Statistics */}
        <Card>
          <CardHeader>
            <CardTitle>Thống kê Sử dụng Mẫu</CardTitle>
            <CardDescription>Hiệu quả của các mẫu dữ liệu</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {templates.map((template) => (
                <div key={template.id} className="flex items-center justify-between p-3 border rounded">
                  <div className="flex items-center space-x-3">
                    <Badge variant={template.type === 'lead' ? 'default' : template.type === 'order' ? 'secondary' : 'outline'}>
                      {template.type === 'lead' ? 'Lead' : template.type === 'order' ? 'Đơn hàng' : 'Khách hàng'}
                    </Badge>
                    <span className="font-medium">{template.name}</span>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <div>Sử dụng: 234 lần</div>
                    <div>Thành công: 89%</div>
                    <div>Cập nhật: {formatDate(template.createdAt)}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Access Control Management Component
  const AccessControlManagement = () => {
    const [accessSettings, setAccessSettings] = useState({
      workingHours: {
        enabled: true,
        start: '08:00',
        end: '17:00',
        days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday']
      },
      afterHours: {
        requireAuth: true,
        allowedRoles: ['admin', 'manager'],
        notificationEnabled: true
      }
    })

    const [userAccessRules, setUserAccessRules] = useState([
      {
        id: 1,
        userId: 1,
        userName: 'Nguyễn Văn An',
        role: 'sales',
        workingHours: { start: '09:00', end: '18:00' },
        allowedDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'],
        allowAfterHours: false,
        ipRestrictions: ['192.168.1.0/24'],
        lastAccess: '2025-06-11T15:30:00',
        status: 'active'
      },
      {
        id: 2,
        userId: 2,
        userName: 'Trần Thị Bình',
        role: 'manager',
        workingHours: { start: '08:00', end: '19:00' },
        allowedDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
        allowAfterHours: true,
        ipRestrictions: [],
        lastAccess: '2025-06-11T16:45:00',
        status: 'active'
      }
    ])

    const [accessLogs, setAccessLogs] = useState([
      {
        id: 1,
        userId: 1,
        userName: 'Nguyễn Văn An',
        action: 'login_success',
        timestamp: '2025-06-11T15:30:00',
        ip: '192.168.1.100',
        device: 'Chrome/Windows',
        status: 'allowed'
      },
      {
        id: 2,
        userId: 3,
        userName: 'Lê Minh Chánh',
        action: 'login_blocked',
        timestamp: '2025-06-11T19:30:00',
        ip: '192.168.1.101',
        device: 'Firefox/Windows',
        status: 'blocked',
        reason: 'Ngoài giờ làm việc'
      }
    ])

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Kiểm soát Truy cập theo Thời gian</h2>
            <p className="text-gray-600">Quản lý quyền truy cập CRM theo thời gian và thiết bị</p>
          </div>
        </div>

        {/* Global Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Cài đặt Chung</CardTitle>
            <CardDescription>Thiết lập quy tắc truy cập toàn hệ thống</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Working Hours */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="working-hours">Giới hạn Giờ làm việc</Label>
                  <p className="text-sm text-gray-500">Hạn chế truy cập ngoài giờ làm việc</p>
                </div>
                <Switch
                  id="working-hours"
                  checked={accessSettings.workingHours.enabled}
                  onCheckedChange={(checked) => 
                    setAccessSettings(prev => ({ 
                      ...prev, 
                      workingHours: { ...prev.workingHours, enabled: checked }
                    }))
                  }
                />
              </div>

              {accessSettings.workingHours.enabled && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                  <div>
                    <Label>Giờ bắt đầu</Label>
                    <Input
                      type="time"
                      value={accessSettings.workingHours.start}
                      onChange={(e) => 
                        setAccessSettings(prev => ({ 
                          ...prev, 
                          workingHours: { ...prev.workingHours, start: e.target.value }
                        }))
                      }
                    />
                  </div>
                  <div>
                    <Label>Giờ kết thúc</Label>
                    <Input
                      type="time"
                      value={accessSettings.workingHours.end}
                      onChange={(e) => 
                        setAccessSettings(prev => ({ 
                          ...prev, 
                          workingHours: { ...prev.workingHours, end: e.target.value }
                        }))
                      }
                    />
                  </div>
                </div>
              )}
            </div>

            {/* After Hours Settings */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="after-hours-auth">Xác thực Ngoài giờ</Label>
                  <p className="text-sm text-gray-500">Yêu cầu xác thực bổ sung khi truy cập ngoài giờ</p>
                </div>
                <Switch
                  id="after-hours-auth"
                  checked={accessSettings.afterHours.requireAuth}
                  onCheckedChange={(checked) => 
                    setAccessSettings(prev => ({ 
                      ...prev, 
                      afterHours: { ...prev.afterHours, requireAuth: checked }
                    }))
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="after-hours-notification">Thông báo Truy cập</Label>
                  <p className="text-sm text-gray-500">Gửi thông báo khi có truy cập ngoài giờ</p>
                </div>
                <Switch
                  id="after-hours-notification"
                  checked={accessSettings.afterHours.notificationEnabled}
                  onCheckedChange={(checked) => 
                    setAccessSettings(prev => ({ 
                      ...prev, 
                      afterHours: { ...prev.afterHours, notificationEnabled: checked }
                    }))
                  }
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* User Access Rules */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Quy tắc Truy cập Người dùng</CardTitle>
                <CardDescription>Thiết lập quy tắc riêng cho từng người dùng</CardDescription>
              </div>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Thêm quy tắc
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {userAccessRules.map((rule) => (
                <div key={rule.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <User2 className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-medium">{rule.userName}</h3>
                        <p className="text-sm text-gray-500">
                          {rule.role} • Truy cập cuối: {new Date(rule.lastAccess).toLocaleString('vi-VN')}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={rule.status === 'active' ? 'default' : 'secondary'}>
                        {rule.status === 'active' ? 'Hoạt động' : 'Tạm dừng'}
                      </Badge>
                      <Button variant="ghost" size="sm">
                        <Edit2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-700">Giờ làm việc:</span>
                      <p className="text-gray-600">
                        {rule.workingHours.start} - {rule.workingHours.end}
                      </p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Ngoài giờ:</span>
                      <p className="text-gray-600">
                        {rule.allowAfterHours ? 'Cho phép' : 'Không cho phép'}
                      </p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Hạn chế IP:</span>
                      <p className="text-gray-600">
                        {rule.ipRestrictions.length > 0 ? rule.ipRestrictions.join(', ') : 'Không có'}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Access Logs */}
        <Card>
          <CardHeader>
            <CardTitle>Nhật ký Truy cập</CardTitle>
            <CardDescription>Theo dõi các lần truy cập và vi phạm</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {accessLogs.map((log) => (
                <div key={log.id} className="flex items-center justify-between p-3 border rounded">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${
                      log.status === 'allowed' ? 'bg-green-500' : 'bg-red-500'
                    }`} />
                    <div>
                      <p className="font-medium">{log.userName}</p>
                      <p className="text-sm text-gray-500">
                        {log.action === 'login_success' ? 'Đăng nhập thành công' : 
                         log.action === 'login_blocked' ? 'Đăng nhập bị chặn' : log.action}
                      </p>
                    </div>
                  </div>
                  <div className="text-right text-sm text-gray-600">
                    <p>{new Date(log.timestamp).toLocaleString('vi-VN')}</p>
                    <p>{log.ip} • {log.device}</p>
                    {log.reason && <p className="text-red-600">{log.reason}</p>}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // System History Management Component
  const SystemHistoryManagement = () => {
    const [systemHistory, setSystemHistory] = useState([
      // Lead Management Activities
      {
        id: 1,
        category: 'lead_management',
        action: 'create_lead',
        details: 'Tạo lead mới: "Nguyễn Thị Lan - Quan tâm sản phẩm A"',
        performedBy: 'Nguyễn Văn An',
        performedByRole: 'sales',
        timestamp: '2025-06-11T16:45:00',
        affectedEntities: ['lead_12345'],
        changes: {
          before: null,
          after: {
            name: 'Nguyễn Thị Lan',
            phone: '0987654321',
            email: 'lanng@email.com',
            source: 'website',
            status: 'new',
            assignedTo: 'Nguyễn Văn An',
            score: 75
          }
        },
        ip: '192.168.1.100',
        status: 'success'
      },
      {
        id: 2,
        category: 'lead_management',
        action: 'assign_lead',
        details: 'Phân lead "Trần Minh Hoàng" từ Nguyễn Văn An cho Lê Thị Mai',
        performedBy: 'Trần Thị Bình',
        performedByRole: 'manager',
        timestamp: '2025-06-11T16:30:00',
        affectedEntities: ['lead_12344'],
        changes: {
          before: { assignedTo: 'Nguyễn Văn An', status: 'contacted' },
          after: { assignedTo: 'Lê Thị Mai', status: 'transferred', reason: 'Chuyên môn phù hợp hơn' }
        },
        ip: '192.168.1.101',
        status: 'success'
      },
      {
        id: 3,
        category: 'lead_management',
        action: 'update_lead_status',
        details: 'Cập nhật trạng thái lead "Phạm Văn Đức" từ "Tư vấn" sang "Báo giá"',
        performedBy: 'Lê Thị Mai',
        performedByRole: 'sales',
        timestamp: '2025-06-11T16:15:00',
        affectedEntities: ['lead_12343'],
        changes: {
          before: { status: 'consulting', stage: 'Tư vấn', score: 65 },
          after: { status: 'quoted', stage: 'Báo giá', score: 80, note: 'Gửi báo giá sản phẩm B' }
        },
        ip: '192.168.1.102',
        status: 'success'
      },
      {
        id: 4,
        category: 'lead_management',
        action: 'convert_lead_to_deal',
        details: 'Chuyển đổi lead "Công ty XYZ" thành deal với giá trị 150.000.000 VNĐ',
        performedBy: 'Nguyễn Văn An',
        performedByRole: 'sales',
        timestamp: '2025-06-11T16:00:00',
        affectedEntities: ['lead_12342', 'deal_5678'],
        changes: {
          before: { type: 'lead', status: 'interested', value: null },
          after: { type: 'deal', status: 'negotiating', value: 150000000, probability: 70 }
        },
        ip: '192.168.1.100',
        status: 'success'
      },
      {
        id: 5,
        category: 'lead_management',
        action: 'bulk_assign_leads',
        details: 'Phân bổ tự động 25 lead từ Zalo OA cho Team Sales A',
        performedBy: 'System Auto',
        performedByRole: 'system',
        timestamp: '2025-06-11T15:30:00',
        affectedEntities: ['team_sales_a', 'bulk_assign_001'],
        changes: {
          before: { unassignedLeads: 25, teamWorkload: 45 },
          after: { assignedLeads: 25, teamWorkload: 70, assignmentRule: 'Round Robin' }
        },
        ip: 'system',
        status: 'success'
      },
      {
        id: 6,
        category: 'lead_management',
        action: 'add_lead_tag',
        details: 'Thêm tag "VIP" cho lead "Nguyễn Thị Hoa" do doanh thu > 100 triệu',
        performedBy: 'Auto Tag System',
        performedByRole: 'system',
        timestamp: '2025-06-11T15:20:00',
        affectedEntities: ['lead_12341', 'tag_vip'],
        changes: {
          before: { tags: ['Tiềm năng cao'], revenue: 120000000 },
          after: { tags: ['Tiềm năng cao', 'VIP'], autoTagged: true, priority: 'high' }
        },
        ip: 'system',
        status: 'success'
      },
      {
        id: 7,
        category: 'lead_management',
        action: 'import_leads',
        details: 'Import 50 lead từ file Excel "Danh_sach_KH_thang6.xlsx"',
        performedBy: 'Trần Thị Bình',
        performedByRole: 'manager',
        timestamp: '2025-06-11T14:45:00',
        affectedEntities: ['import_batch_001'],
        changes: {
          before: { totalLeads: 1250 },
          after: { 
            totalLeads: 1300, 
            importedCount: 50, 
            successCount: 48, 
            errorCount: 2, 
            duplicateCount: 2 
          }
        },
        ip: '192.168.1.101',
        status: 'partial_success'
      },
      {
        id: 8,
        category: 'lead_management',
        action: 'delete_lead',
        details: 'Xóa lead "Spam Contact" do vi phạm chính sách',
        performedBy: 'Nguyễn Văn An',
        performedByRole: 'sales',
        timestamp: '2025-06-11T14:30:00',
        affectedEntities: ['lead_12340'],
        changes: {
          before: { name: 'Spam Contact', phone: '0000000000', status: 'new' },
          after: null
        },
        ip: '192.168.1.100',
        status: 'success'
      },
      // User Management Activities
      {
        id: 9,
        category: 'user_management',
        action: 'create_user',
        details: 'Tạo tài khoản người dùng mới: Nguyễn Văn E',
        performedBy: 'Phạm Thị Dung',
        performedByRole: 'admin',
        timestamp: '2025-06-11T14:00:00',
        affectedEntities: ['user_5'],
        changes: {
          before: null,
          after: {
            name: 'Nguyễn Văn E',
            role: 'sales',
            email: 'nguyenvane@company.com',
            status: 'active'
          }
        },
        ip: '192.168.1.103',
        status: 'success'
      },
      // System Configuration
      {
        id: 10,
        category: 'workflow',
        action: 'create_stage',
        details: 'Tạo giai đoạn mới trong quy trình sales: "Tư vấn chi tiết"',
        performedBy: 'Trần Thị Bình',
        performedByRole: 'manager',
        timestamp: '2025-06-11T13:15:00',
        affectedEntities: ['sales_workflow'],
        changes: {
          before: { stages: 4 },
          after: { stages: 5, newStage: 'Tư vấn chi tiết' }
        },
        ip: '192.168.1.101',
        status: 'success'
      },
      {
        id: 11,
        category: 'integration',
        action: 'sync_leads_zalo',
        details: 'Đồng bộ 12 lead mới từ Zalo OA "VileLead Official"',
        performedBy: 'Zalo Integration',
        performedByRole: 'system',
        timestamp: '2025-06-11T13:00:00',
        affectedEntities: ['zalo_sync_001'],
        changes: {
          before: { lastSync: '2025-06-11T12:00:00', totalSynced: 1288 },
          after: { lastSync: '2025-06-11T13:00:00', totalSynced: 1300, newLeads: 12 }
        },
        ip: 'zalo_webhook',
        status: 'success'
      },
      {
        id: 12,
        category: 'lead_management',
        action: 'update_lead_score',
        details: 'Cập nhật điểm lead "Công ty ABC" từ 45 lên 85 do tương tác tích cực',
        performedBy: 'Lead Scoring System',
        performedByRole: 'system',
        timestamp: '2025-06-11T12:30:00',
        affectedEntities: ['lead_12339', 'scoring_rule_001'],
        changes: {
          before: { score: 45, interactions: 3, lastContact: '2025-06-10' },
          after: { 
            score: 85, 
            interactions: 8, 
            lastContact: '2025-06-11',
            scoreFactors: ['Mở email: +10', 'Click link: +15', 'Phản hồi: +15']
          }
        },
        ip: 'system',
        status: 'success'
      }
    ])

    const [filterCategory, setFilterCategory] = useState('all')
    const [filterPerformer, setFilterPerformer] = useState('all')
    const [filterDateRange, setFilterDateRange] = useState('')
    const [searchQuery, setSearchQuery] = useState('')

    const categories = [
      { value: 'all', label: 'Tất cả danh mục', icon: Settings },
      { value: 'lead_management', label: 'Quản lý Lead', icon: Users },
      { value: 'deal_management', label: 'Quản lý Deal', icon: Target },
      { value: 'customer_management', label: 'Quản lý Khách hàng', icon: User2 },
      { value: 'user_management', label: 'Quản lý Người dùng', icon: UserCog },
      { value: 'permissions', label: 'Phân quyền', icon: Shield },
      { value: 'workflow', label: 'Quy trình', icon: Workflow },
      // { value: 'integration', label: 'Tích hợp', icon: Zap },
      { value: 'interface', label: 'Giao diện', icon: Monitor },
      { value: 'system', label: 'Hệ thống', icon: Database }
    ]

    const filteredHistory = systemHistory.filter(item => {
      const categoryMatch = filterCategory === 'all' || item.category === filterCategory
      const performerMatch = filterPerformer === 'all' || item.performedBy === filterPerformer
      const dateMatch = !filterDateRange || new Date(item.timestamp).toDateString() === new Date(filterDateRange).toDateString()
      
      // Search trong details, performedBy, action
      const searchMatch = !searchQuery || 
        item.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.performedBy.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.affectedEntities.some(entity => entity.toLowerCase().includes(searchQuery.toLowerCase()))
      
      return categoryMatch && performerMatch && dateMatch && searchMatch
    })

    const getCategoryIcon = (category: string) => {
      const categoryObj = categories.find(c => c.value === category)
      const IconComponent = categoryObj?.icon || Settings
      return <IconComponent className="w-4 h-4" />
    }

    const getCategoryColor = (category: string) => {
      const colors = {
        lead_management: 'text-blue-600 bg-blue-100',
        deal_management: 'text-purple-600 bg-purple-100',
        customer_management: 'text-green-600 bg-green-100',
        user_management: 'text-indigo-600 bg-indigo-100',
        permissions: 'text-emerald-600 bg-emerald-100',
        workflow: 'text-violet-600 bg-violet-100',
        integration: 'text-orange-600 bg-orange-100',
        interface: 'text-gray-600 bg-gray-100',
        system: 'text-slate-600 bg-slate-100'
      }
      return colors[category as keyof typeof colors] || 'text-gray-600 bg-gray-100'
    }

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Lịch sử Hệ thống</h2>
              <p className="text-gray-600">Theo dõi tất cả thay đổi cấu hình và cài đặt hệ thống</p>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Xuất lịch sử
              </Button>
              <Button variant="outline">
                <RefreshCw className="w-4 h-4 mr-2" />
                Làm mới
              </Button>
            </div>
          </div>
          
          {/* Search Bar */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="text"
              placeholder="Tìm kiếm trong lịch sử..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* System Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Tổng thay đổi</p>
                  <p className="text-2xl font-bold text-blue-600">{systemHistory.length}</p>
                </div>
                <History className="w-6 h-6 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Hôm nay</p>
                  <p className="text-2xl font-bold text-green-600">
                    {systemHistory.filter(item => 
                      new Date(item.timestamp).toDateString() === new Date().toDateString()
                    ).length}
                  </p>
                </div>
                <Calendar className="w-6 h-6 text-green-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Admin thực hiện</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {systemHistory.filter(item => item.performedByRole === 'admin').length}
                  </p>
                </div>
                <Shield className="w-6 h-6 text-purple-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Thành công</p>
                  <p className="text-2xl font-bold text-orange-600">
                    {systemHistory.filter(item => item.status === 'success').length}
                  </p>
                </div>
                <CheckCircle className="w-6 h-6 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Bộ lọc & Tìm kiếm</CardTitle>
            <CardDescription>
              Lọc lịch sử theo danh mục, người thực hiện và tìm kiếm trong nội dung
              {searchQuery && (
                <span className="block mt-1 text-blue-600 font-medium">
                  Tìm kiếm: "{searchQuery}" - {filteredHistory.length} kết quả
                </span>
              )}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label>Danh mục</Label>
                <Select value={filterCategory} onValueChange={setFilterCategory}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Người thực hiện</Label>
                <Select value={filterPerformer} onValueChange={setFilterPerformer}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả người dùng</SelectItem>
                    {Array.from(new Set(systemHistory.map(item => item.performedBy)))
                      .map((performer) => (
                        <SelectItem key={performer} value={performer}>
                          {performer}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Ngày</Label>
                <Input
                  type="date"
                  value={filterDateRange}
                  onChange={(e) => setFilterDateRange(e.target.value)}
                />
              </div>
            </div>
            
            {/* Clear Filters Button */}
            {(searchQuery || filterCategory !== 'all' || filterPerformer !== 'all' || filterDateRange) && (
              <div className="mt-4 pt-4 border-t">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    setSearchQuery('')
                    setFilterCategory('all')
                    setFilterPerformer('all')
                    setFilterDateRange('')
                  }}
                  className="text-gray-600"
                >
                  <X className="w-4 h-4 mr-2" />
                  Xóa tất cả bộ lọc
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* History Table */}
        <Card>
          <CardHeader>
            <CardTitle>Lịch sử Hệ thống ({filteredHistory.length})</CardTitle>
            <CardDescription>Theo dõi chi tiết các thay đổi hệ thống theo thời gian</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="text-left p-3 font-medium text-gray-700">Thời gian</th>
                    <th className="text-left p-3 font-medium text-gray-700">Danh mục</th>
                    <th className="text-left p-3 font-medium text-gray-700">Hành động</th>
                    <th className="text-left p-3 font-medium text-gray-700">Người thực hiện</th>
                    <th className="text-left p-3 font-medium text-gray-700">Chi tiết</th>
                    <th className="text-left p-3 font-medium text-gray-700">Trạng thái</th>
                    <th className="text-left p-3 font-medium text-gray-700">IP</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredHistory.map((item, index) => (
                    <tr key={item.id} className={`border-b hover:bg-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-25'}`}>
                      <td className="p-3 text-sm">
                        <div className="font-medium text-gray-900">
                          {new Date(item.timestamp).toLocaleDateString('vi-VN')}
                        </div>
                        <div className="text-gray-500 text-xs">
                          {new Date(item.timestamp).toLocaleTimeString('vi-VN')}
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center space-x-2">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getCategoryColor(item.category)}`}>
                            {getCategoryIcon(item.category)}
                          </div>
                          <span className="text-sm font-medium">
                            {categories.find(c => c.value === item.category)?.label || item.category}
                          </span>
                        </div>
                      </td>
                      <td className="p-3 text-sm">
                        <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">
                          {item.action.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="p-3 text-sm">
                        <div className="font-medium text-gray-900">{item.performedBy}</div>
                        <Badge variant="secondary" className="text-xs mt-1">
                          {item.performedByRole}
                        </Badge>
                      </td>
                      <td className="p-3 text-sm max-w-md">
                        <div className="text-gray-900 line-clamp-2" title={item.details}>
                          {item.details}
                        </div>
                        {item.affectedEntities.length > 0 && (
                          <div className="mt-1 flex flex-wrap gap-1">
                            {item.affectedEntities.slice(0, 2).map((entity, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {entity}
                              </Badge>
                            ))}
                            {item.affectedEntities.length > 2 && (
                              <Badge variant="outline" className="text-xs">
                                +{item.affectedEntities.length - 2}
                              </Badge>
                            )}
                          </div>
                        )}
                      </td>
                      <td className="p-3">
                        <Badge variant={item.status === 'success' ? 'default' : 'destructive'} className="text-xs">
                          {item.status === 'success' ? 'Thành công' : 'Thất bại'}
                        </Badge>
                      </td>
                      <td className="p-3 text-sm text-gray-500">
                        {item.ip}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredHistory.length === 0 && (
              <div className="text-center py-12">
                <History className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Không có lịch sử</h3>
                <p className="text-gray-500">Không tìm thấy thay đổi nào phù hợp với bộ lọc.</p>
              </div>
            )}

            {/* Pagination */}
            {filteredHistory.length > 0 && (
              <div className="flex items-center justify-between mt-6 pt-4 border-t">
                <div className="text-sm text-gray-700">
                  Hiển thị <span className="font-medium">{Math.min(filteredHistory.length, 20)}</span> trong tổng số{' '}
                  <span className="font-medium">{filteredHistory.length}</span> kết quả
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" disabled>
                    Trước
                  </Button>
                  <Button variant="outline" size="sm" disabled>
                    Sau
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    )
  }

  // Component: Product Management (Sản phẩm & Gói sản phẩm)
  const ProductManagement = () => {
    const [products, setProducts] = useState<any[]>([
      { id: 'p1', name: 'Sản phẩm A', code: 'PROD-A', price: 1000000, description: 'Mô tả sản phẩm A' },
      { id: 'p2', name: 'Sản phẩm B', code: 'PROD-B', price: 2000000, description: 'Mô tả sản phẩm B' }
    ])

    const [packages, setPackages] = useState<any[]>([
      { id: 'pkg1', name: 'Gói Cơ bản', productIds: ['p1'], price: 900000, description: 'Gói cơ bản chứa 1 sản phẩm' }
    ])

    const [showProductModal, setShowProductModal] = useState(false)
    const [showPackageModal, setShowPackageModal] = useState(false)
    const [productForm, setProductForm] = useState({ name: '', code: '', price: '', description: '' })
    const [packageForm, setPackageForm] = useState({ name: '', price: '', productIds: [] as string[], description: '' })

    const handleAddProduct = () => {
      const newProduct = {
        id: 'p' + (products.length + 1),
        name: productForm.name || `Sản phẩm ${products.length + 1}`,
        code: productForm.code || `PROD-${products.length + 1}`,
        price: Number(productForm.price) || 0,
        description: productForm.description || ''
      }
      setProducts(prev => [newProduct, ...prev])
      setProductForm({ name: '', code: '', price: '', description: '' })
      setShowProductModal(false)
    }

    const handleAddPackage = () => {
      const newPkg = {
        id: 'pkg' + (packages.length + 1),
        name: packageForm.name || `Gói ${packages.length + 1}`,
        price: Number(packageForm.price) || 0,
        productIds: packageForm.productIds,
        description: packageForm.description || ''
      }
      setPackages(prev => [newPkg, ...prev])
      setPackageForm({ name: '', price: '', productIds: [], description: '' })
      setShowPackageModal(false)
    }

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Sản phẩm & Gói sản phẩm</h2>
            <p className="text-gray-600">Quản lý danh sách sản phẩm và các gói sản phẩm</p>
          </div>
          <div className="flex items-center space-x-2">
            <Button onClick={() => setShowPackageModal(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Thêm gói sản phẩm
            </Button>
            <Button onClick={() => setShowProductModal(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Thêm sản phẩm
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Danh sách Sản phẩm</CardTitle>
                  <CardDescription>Quản lý các sản phẩm có trong hệ thống</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {products.map(p => (
                  <div key={p.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="font-medium">{p.name} <span className="text-xs text-gray-400">({p.code})</span></div>
                      <div className="text-sm text-gray-500">{p.description}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{p.price?.toLocaleString?.('vi-VN') || p.price} ₫</div>
                      <div className="flex items-center space-x-2 mt-2">
                        <Button variant="ghost" size="sm"><Edit2 className="w-4 h-4" /></Button>
                        <Button variant="ghost" size="sm"><Trash2 className="w-4 h-4" /></Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Danh sách Gói sản phẩm</CardTitle>
              <CardDescription>Gói sản phẩm là tập hợp các sản phẩm với mức giá gộp</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {packages.map(pkg => (
                  <div key={pkg.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="font-medium">{pkg.name}</div>
                      <div className="text-sm text-gray-500">{pkg.description}</div>
                      <div className="text-xs text-gray-500 mt-1">Sản phẩm: {pkg.productIds.map((id:any) => products.find(p=>p.id===id)?.name || id).join(', ')}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{pkg.price?.toLocaleString?.('vi-VN') || pkg.price} ₫</div>
                      <div className="flex items-center space-x-2 mt-2">
                        <Button variant="ghost" size="sm"><Edit2 className="w-4 h-4" /></Button>
                        <Button variant="ghost" size="sm"><Trash2 className="w-4 h-4" /></Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Add Product Modal */}
        <Dialog open={showProductModal} onOpenChange={setShowProductModal}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Thêm sản phẩm</DialogTitle>
              <DialogDescription>Nhập thông tin sản phẩm mới</DialogDescription>
            </DialogHeader>
            <div className="space-y-3">
              <div>
                <Label>Tên sản phẩm</Label>
                <Input value={productForm.name} onChange={(e:any)=>setProductForm(prev=>({...prev,name:e.target.value}))} />
              </div>
              <div>
                <Label>Mã sản phẩm</Label>
                <Input value={productForm.code} onChange={(e:any)=>setProductForm(prev=>({...prev,code:e.target.value}))} />
              </div>
              <div>
                <Label>Giá</Label>
                <Input value={productForm.price} onChange={(e:any)=>setProductForm(prev=>({...prev,price:e.target.value}))} />
              </div>
              <div>
                <Label>Mô tả</Label>
                <Textarea value={productForm.description} onChange={(e:any)=>setProductForm(prev=>({...prev,description:e.target.value}))} />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={()=>setShowProductModal(false)}>Hủy</Button>
              <Button onClick={handleAddProduct}>Thêm</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Add Package Modal */}
        <Dialog open={showPackageModal} onOpenChange={setShowPackageModal}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Thêm gói sản phẩm</DialogTitle>
              <DialogDescription>Tạo một gói sản phẩm mới gồm nhiều sản phẩm</DialogDescription>
            </DialogHeader>
            <div className="space-y-3">
              <div>
                <Label>Tên gói</Label>
                <Input value={packageForm.name} onChange={(e:any)=>setPackageForm(prev=>({...prev,name:e.target.value}))} />
              </div>
              <div>
                <Label>Giá gói</Label>
                <Input value={packageForm.price} onChange={(e:any)=>setPackageForm(prev=>({...prev,price:e.target.value}))} />
              </div>
              <div>
                <Label>Sản phẩm trong gói</Label>
                <Select onValueChange={(v:any)=>setPackageForm(prev=>({...prev,productIds: v ? v.split(',') : []}))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn sản phẩm (vài sản phẩm bằng dấu phẩy)" />
                  </SelectTrigger>
                  <SelectContent>
                    {products.map(p=> (
                      <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Mô tả</Label>
                <Textarea value={packageForm.description} onChange={(e:any)=>setPackageForm(prev=>({...prev,description:e.target.value}))} />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={()=>setShowPackageModal(false)}>Hủy</Button>
              <Button onClick={handleAddPackage}>Thêm gói</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Cài đặt Hệ thống</h1>
          <p className="text-gray-600">Quản lý cấu hình và bảo mật hệ thống CRM</p>
        </div>
        <Button variant="outline">
          <Download className="w-4 h-4 mr-2" />
          Xuất cấu hình
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="company">Công ty</TabsTrigger>
          <TabsTrigger value="workflow">Quy trình</TabsTrigger>
          <TabsTrigger value="interface">Giao diện</TabsTrigger>
          <TabsTrigger value="products">Sản phẩm</TabsTrigger>
          <TabsTrigger value="integrations">Tích hợp</TabsTrigger>
          <TabsTrigger value="history">Lịch sử</TabsTrigger>
        </TabsList>

        <TabsContent value="company" className="mt-6">
          <CompanyManagement />
        </TabsContent>

        {/* Other tabs content will be implemented */}
        <TabsContent value="workflow" className="mt-6">
          <WorkflowManagement />
        </TabsContent>

        <TabsContent value="interface" className="mt-6">
          <InterfaceManagement />
        </TabsContent>

        <TabsContent value="products" className="mt-6">
          <ProductManagement />
        </TabsContent>

        <TabsContent value="integrations" className="mt-6">
          <IntegrationManagement />
        </TabsContent>

        <TabsContent value="templates" className="mt-6">
          <DataTemplateManagement />
        </TabsContent>

        <TabsContent value="history" className="mt-6">
          <SystemHistoryManagement />
        </TabsContent>
      </Tabs>
    </div>
  )
}
