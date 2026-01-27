'use client'

import { useState, useEffect } from 'react'
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
  Pencil,
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
  ChevronLeft,
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
  GripVertical,
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
  ShoppingCart,
  Building2,
  Package,
  GitBranch,
  Briefcase,
  UserCheck,
  UserPlus,
  Crown,
  Award,
  Wrench,
  Heart,
  Trophy,
  Receipt,
  CreditCard,
  FolderOpen,
  Link2,
  Hash,
  Palette as PaletteIcon,
  ListChecks,
  AlarmClock,
  LayoutDashboard,
  TrendingUp,
  Ruler,
  Activity,
  Dumbbell,
  ImageIcon,
  StickyNote,
  Flag,
  type LucideIcon
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
  isActive: boolean
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
    name: 'Đã gửi đề xuất',
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
    isActive: true,
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
    isActive: true,
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
    isActive: true,
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
    isActive: true,
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
    isActive: true,
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

// Sample departments and teams data
const sampleDepartments = [
  { id: 'dept1', name: 'Kinh doanh' },
  { id: 'dept2', name: 'Kỹ thuật' },
  { id: 'dept3', name: 'Hành chính' },
  { id: 'dept4', name: 'Marketing' },
  { id: 'dept5', name: 'Phòng sale' },
]

const sampleTeams = [
  { id: 'team1', name: 'Sale Team A', departmentId: 'dept1' },
  { id: 'team2', name: 'Sale Team B', departmentId: 'dept1' },
  { id: 'team3', name: 'Dev Team', departmentId: 'dept2' },
  { id: 'team4', name: 'QA Team', departmentId: 'dept2' },
  { id: 'team5', name: 'Admin Team', departmentId: 'dept3' },
  { id: 'team6', name: 'Content Team', departmentId: 'dept4' },
]

// Role data
const initialRolesList = [
  { id: 1, name: 'Leader', description: 'Quản lý cấp cao', status: 'active', department: 'Kinh doanh', team: 'Sale Team A', users: 5 },
  { id: 2, name: 'DEV', description: 'Nhân viên phát triển', status: 'active', department: 'Kỹ thuật', team: 'Dev Team', users: 8 },
  { id: 3, name: 'Tester', description: 'Nhân viên kiểm thử', status: 'active', department: 'Kỹ thuật', team: 'QA Team', users: 3 },
  { id: 4, name: 'Trưởng phòng ban khác', description: 'Quản lý phòng ban', status: 'active', department: 'Hành chính', team: 'Admin Team', users: 2 },
]

// Permission modules grouped by category
const permissionModuleGroups = [
  {
    id: 'customer',
    name: 'Khách hàng & Lead',
    icon: '👤',
    modules: [
      { id: 'person', name: 'Mọi người', icon: '👤' },
      { id: 'opportunity', name: 'Cơ hội', icon: '💰' },
      { id: 'leadQualityFlag', name: 'Cờ đánh giá chất lượng lead', icon: '🚩' },
      { id: 'personProductInterest', name: 'Mối quan tâm sản phẩm', icon: '❤️' },
      { id: 'customerBehaviorConfig', name: 'Cấu hình hành vi khách hàng', icon: '⚙️' },
      { id: 'customerTierConfig', name: 'Cấu hình hạng khách hàng', icon: '🏆' },
    ]
  },
  {
    id: 'sales',
    name: 'Bán hàng & Đơn hàng',
    icon: '🛒',
    modules: [
      { id: 'order', name: 'Đơn hàng', icon: '🛒' },
      { id: 'orderHistory', name: 'Lịch sử đơn hàng', icon: '⏱️' },
      { id: 'invoice', name: 'Hóa đơn', icon: '🧾' },
      { id: 'invoiceProduct', name: 'Sản phẩm hóa đơn', icon: '≡' },
      { id: 'payment', name: 'Thanh toán', icon: '💳' },
    ]
  },
  {
    id: 'product',
    name: 'Sản phẩm',
    icon: '📦',
    modules: [
      { id: 'product', name: 'Sản phẩm', icon: '📦' },
      { id: 'category', name: 'Danh mục', icon: '📁' },
      { id: 'productCategory', name: 'Danh mục sản phẩm', icon: '🔗' },
      { id: 'productOption', name: 'Tùy chọn sản phẩm', icon: '⚙️' },
      { id: 'productOptionValue', name: 'Giá trị tùy chọn sản phẩm', icon: '🔢' },
      { id: 'productVariant', name: 'Biến thể sản phẩm', icon: '🎨' },
      { id: 'productVariantOptionValue', name: 'Giá trị tùy chọn biến thể', icon: '📊' },
    ]
  },
  {
    id: 'task',
    name: 'Công việc & Tác vụ',
    icon: '✅',
    modules: [
      { id: 'task', name: 'Công việc', icon: '✅' },
      { id: 'taskLabel', name: 'Nhãn công việc', icon: '🏷️' },
      { id: 'autoTaskTemplate', name: 'Mẫu tác vụ tự động', icon: '📋' },
      { id: 'reminder', name: 'Nhắc nhở', icon: '⏰' },
    ]
  },
  {
    id: 'organization',
    name: 'Tổ chức',
    icon: '🏢',
    modules: [
      { id: 'company', name: 'Công ty', icon: '🏢' },
      { id: 'department', name: 'Phòng ban', icon: '🏛️' },
      { id: 'team', name: 'Nhóm', icon: '👥' },
    ]
  },
  {
    id: 'kpi',
    name: 'KPI & Hiệu suất',
    icon: '📊',
    modules: [
      { id: 'dashboard', name: 'Bảng điều khiển', icon: '📊' },
      { id: 'kpiAssignment', name: 'Phân công KPI', icon: '🔄' },
      { id: 'kpiDataPoint', name: 'Điểm dữ liệu KPI', icon: '📈' },
      { id: 'kpiDefinition', name: 'Định nghĩa KPI', icon: '📐' },
      { id: 'memberPerformanceStats', name: 'Thống kê hiệu suất thành viên', icon: '📊' },
      { id: 'memberSkill', name: 'Kỹ năng thành viên', icon: '💪' },
      { id: 'memberWorkloadSnapshot', name: 'Ảnh chụp khối lượng công việc', icon: '📸' },
    ]
  },
  {
    id: 'settings',
    name: 'Cấu hình & Hệ thống',
    icon: '⚙️',
    modules: [
      { id: 'assignmentRule', name: 'Quy tắc phân công', icon: '☑️' },
      { id: 'assignmentSettings', name: 'Cài đặt phân công', icon: '☑️' },
      { id: 'notificationTemplate', name: 'Mẫu thông báo', icon: '🔔' },
      { id: 'embedding', name: 'Dữ liệu nhúng', icon: '📦' },
    ]
  },
  {
    id: 'tags',
    name: 'Phân loại & Nhãn',
    icon: '🏷️',
    modules: [
      { id: 'label', name: 'Nhãn', icon: '🏷️' },
      { id: 'tag', name: 'Thẻ', icon: '🏷️' },
      { id: 'note', name: 'Ghi chú', icon: '📝' },
    ]
  },
  {
    id: 'geography',
    name: 'Địa lý',
    icon: '📍',
    modules: [
      { id: 'province', name: 'Tỉnh / Thành phố', icon: '📍' },
      { id: 'ward', name: 'Phường / Xã', icon: '📍' },
    ]
  },
]

// Flat list of all modules for state initialization
const allPermissionModules = permissionModuleGroups.flatMap(group => group.modules)

// Module icon mapping
const moduleIconMap: Record<string, LucideIcon> = {
  // Khách hàng & Lead
  person: User2,
  opportunity: Target,
  leadQualityFlag: Flag,
  personProductInterest: Heart,
  customerBehaviorConfig: Settings,
  customerTierConfig: Trophy,
  // Bán hàng & Đơn hàng
  order: ShoppingCart,
  orderHistory: History,
  invoice: Receipt,
  invoiceProduct: FileText,
  payment: CreditCard,
  // Sản phẩm
  product: Package,
  category: FolderOpen,
  productCategory: Link2,
  productOption: Settings,
  productOptionValue: Hash,
  productVariant: PaletteIcon,
  productVariantOptionValue: Layers,
  // Công việc & Tác vụ
  task: ListChecks,
  taskLabel: Tag,
  autoTaskTemplate: FileText,
  reminder: AlarmClock,
  // Tổ chức
  company: Building2,
  department: Building2,
  team: Users,
  // KPI & Hiệu suất
  dashboard: LayoutDashboard,
  kpiAssignment: RefreshCw,
  kpiDataPoint: TrendingUp,
  kpiDefinition: Ruler,
  memberPerformanceStats: BarChart3,
  memberSkill: Dumbbell,
  memberWorkloadSnapshot: ImageIcon,
  // Cấu hình & Hệ thống
  assignmentRule: CheckCircle,
  assignmentSettings: Settings,
  notificationTemplate: Bell,
  embedding: Database,
  // Phân loại & Nhãn
  label: Tag,
  tag: Tag,
  note: StickyNote,
  // Địa lý
  province: MapPin,
  ward: MapPin,
}

// Sample employees data for assign permission
const sampleEmployeesForAssign = [
  { id: 4, code: '4', name: 'Hoàng Chính Nghĩa', username: 'nghiahc', department: 'Phòng kinh doanh', roles: ['Leader', 'DEV'], status: 'active' },
  { id: 5, code: '5', name: 'Nguyễn Minh Quang', username: 'nmquang', department: 'Phòng kinh doanh', roles: ['Leader', 'Tester'], status: 'active' },
  { id: 6, code: '6', name: 'Nguyễn Thị Mai', username: 'ntmai', department: 'Phòng chăm sóc khách hàng', roles: ['Tester'], status: 'active' },
  { id: 7, code: '7', name: 'Lê Đình Nam', username: 'ldnam', department: 'Team Minh Quang', roles: ['DEV'], status: 'active' },
  { id: 8, code: '8', name: 'Trần Văn Hùng', username: 'tvhung', department: 'Phòng kinh doanh', roles: ['Leader'], status: 'active' },
  { id: 9, code: '9', name: 'Phạm Thị Lan', username: 'ptlan', department: 'Phòng kỹ thuật', roles: ['DEV', 'Tester'], status: 'active' },
]

// Assign Permission Component
const AssignPermissionContent = () => {
  const [assignRolesList] = useState([
    { id: 1, name: 'Leader' },
    { id: 2, name: 'DEV' },
    { id: 3, name: 'Tester' },
    { id: 4, name: 'Trưởng phòng ban khác' },
  ])
  const [selectedAssignRoleId, setSelectedAssignRoleId] = useState<number>(1)
  const [employees] = useState(sampleEmployeesForAssign)
  const [roleAssignments, setRoleAssignments] = useState<Record<number, number[]>>({
    1: [4, 5, 8], // Leader: Hoàng Chính Nghĩa, Nguyễn Minh Quang, Trần Văn Hùng
    2: [4, 7, 9], // DEV: Hoàng Chính Nghĩa, Lê Đình Nam, Phạm Thị Lan
    3: [5, 6, 9], // Tester: Nguyễn Minh Quang, Nguyễn Thị Mai, Phạm Thị Lan
    4: [], // Trưởng phòng ban khác: none
  })
  const [currentPage, setCurrentPage] = useState(1)
  const [filterDepartment, setFilterDepartment] = useState('')
  const [filterTeam, setFilterTeam] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

  // Get selected employees for current role
  const selectedEmployees = roleAssignments[selectedAssignRoleId] || []

  const toggleSelectAll = () => {
    const allEmployeeIds = employees.map(e => e.id)
    if (selectedEmployees.length === employees.length) {
      setRoleAssignments(prev => ({ ...prev, [selectedAssignRoleId]: [] }))
    } else {
      setRoleAssignments(prev => ({ ...prev, [selectedAssignRoleId]: allEmployeeIds }))
    }
  }

  const toggleSelectEmployee = (id: number) => {
    setRoleAssignments(prev => {
      const currentAssigned = prev[selectedAssignRoleId] || []
      if (currentAssigned.includes(id)) {
        return { ...prev, [selectedAssignRoleId]: currentAssigned.filter(e => e !== id) }
      } else {
        return { ...prev, [selectedAssignRoleId]: [...currentAssigned, id] }
      }
    })
  }

  // Get current role name
  const currentRoleName = assignRolesList.find(r => r.id === selectedAssignRoleId)?.name || ''

  return (
    <div className="flex gap-6 h-[calc(100vh-200px)]">
      {/* Left Sidebar - Role List */}
      <div className="w-56 flex-shrink-0 bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="p-2">
          {assignRolesList.map((role) => (
            <div
              key={role.id}
              className={`relative flex items-center px-3 py-2 rounded-md cursor-pointer transition-colors mb-1 ${
                selectedAssignRoleId === role.id 
                  ? 'bg-[#3e79f7] text-white' 
                  : 'text-[#455560] hover:bg-gray-100'
              }`}
              onClick={() => setSelectedAssignRoleId(role.id)}
            >
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span className="text-sm font-medium">{role.name}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Side - Employee Table */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Filters and Save Button */}
        <div className="flex items-center gap-3 mb-4">
          <select
            value={filterDepartment}
            onChange={(e) => setFilterDepartment(e.target.value)}
            className="h-9 px-3 border border-[#e6ebf1] rounded-[10px] text-sm text-[#455560] hover:border-[#699dff] focus:outline-none focus:border-[#3e79f7] focus:ring-2 focus:ring-[#3e79f7]/20 transition-all duration-300 min-w-[160px]"
          >
            <option value="">Theo phòng ban</option>
            <option value="dept1">Kinh doanh</option>
            <option value="dept2">Kỹ thuật</option>
            <option value="dept3">Hành chính</option>
            <option value="dept4">Marketing</option>
            <option value="dept5">Phòng sale</option>
          </select>
          <select
            value={filterTeam}
            onChange={(e) => setFilterTeam(e.target.value)}
            className="h-9 px-3 border border-[#e6ebf1] rounded-[10px] text-sm text-[#455560] hover:border-[#699dff] focus:outline-none focus:border-[#3e79f7] focus:ring-2 focus:ring-[#3e79f7]/20 transition-all duration-300 min-w-[160px]"
          >
            <option value="">Theo nhóm</option>
            <option value="team1">Sale Team A</option>
            <option value="team2">Sale Team B</option>
            <option value="team3">Dev Team</option>
            <option value="team4">QA Team</option>
            <option value="team5">Admin Team</option>
          </select>
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#72849a]" />
            <Input
              placeholder="Tìm kiếm nhân viên..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-9"
            />
          </div>
          <div className="ml-auto">
            <Button size="sm">
              <Save className="w-4 h-4 mr-2" />
              Lưu thay đổi
            </Button>
          </div>
        </div>

        {/* Table Container */}
        <div className="flex-1 flex flex-col bg-white border border-[#e6ebf1] rounded-[10px] overflow-hidden">
          <div className="flex-1 overflow-auto">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-[#fafafa] border-b border-[#e6ebf1]">
                <tr>
                  <th className="text-left py-3 px-4 font-normal text-[#455560] w-10">
                    <input 
                      type="checkbox" 
                      className="w-4 h-4 rounded border-gray-300 text-[#3e79f7] focus:ring-[#3e79f7]"
                      checked={selectedEmployees.length === employees.length && employees.length > 0}
                      onChange={toggleSelectAll}
                    />
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-[#455560] uppercase text-xs tracking-wider whitespace-nowrap">Mã NV</th>
                  <th className="text-left py-3 px-4 font-semibold text-[#455560] uppercase text-xs tracking-wider whitespace-nowrap">Họ và tên</th>
                  <th className="text-left py-3 px-4 font-semibold text-[#455560] uppercase text-xs tracking-wider whitespace-nowrap">Tên đăng n...</th>
                  <th className="text-left py-3 px-4 font-semibold text-[#455560] uppercase text-xs tracking-wider whitespace-nowrap">Phòng ban</th>
                  <th className="text-left py-3 px-4 font-semibold text-[#455560] uppercase text-xs tracking-wider whitespace-nowrap">Vai trò</th>
                  <th className="text-left py-3 px-4 font-semibold text-[#455560] uppercase text-xs tracking-wider whitespace-nowrap">Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {employees.map((employee) => (
                  <tr key={employee.id} className="border-b border-[#e6ebf1] hover:bg-[#f5f5f5] transition-colors">
                    <td className="py-3 px-4">
                      <input 
                        type="checkbox" 
                        className="w-4 h-4 rounded border-gray-300 text-[#3e79f7] focus:ring-[#3e79f7]"
                        checked={selectedEmployees.includes(employee.id)}
                        onChange={() => toggleSelectEmployee(employee.id)}
                      />
                    </td>
                    <td className="py-3 px-4 text-[#455560]">{employee.code}</td>
                    <td className="py-3 px-4 text-[#455560]">{employee.name}</td>
                    <td className="py-3 px-4 text-[#455560]">{employee.username}</td>
                    <td className="py-3 px-4 text-[#455560]">{employee.department}</td>
                    <td className="py-3 px-4 text-[#455560]">{employee.roles.join(',')}</td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1.5 text-[#04d182]">
                        <span className="w-2 h-2 rounded-full bg-[#04d182]"></span>
                        Đang làm việc
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          <div className="flex items-center justify-end px-4 py-3 border-t border-[#e6ebf1] bg-white">
            <div className="flex items-center gap-1">
              <button className="w-8 h-8 flex items-center justify-center rounded border border-[#e6ebf1] text-[#455560] hover:bg-gray-50 disabled:opacity-50" disabled>
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button className="w-8 h-8 flex items-center justify-center rounded bg-[#3e79f7] text-white text-sm font-medium">
                1
              </button>
              <button className="w-8 h-8 flex items-center justify-center rounded border border-[#e6ebf1] text-[#455560] hover:bg-gray-50 disabled:opacity-50" disabled>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// RoleManagementNew Component
const RoleManagementNew = () => {
  const [rolesList, setRolesList] = useState(initialRolesList)
  const [selectedRoleId, setSelectedRoleId] = useState<number>(rolesList[0]?.id || 1)
  const [showAddRoleModal, setShowAddRoleModal] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [roleToDelete, setRoleToDelete] = useState<number | null>(null)
  const [showRoleDropdown, setShowRoleDropdown] = useState<number | null>(null)
  const [isEditingRole, setIsEditingRole] = useState(false)
  const [editRoleForm, setEditRoleForm] = useState({ 
    name: '', 
    description: '', 
    scopeEnabled: false,
    scope: 'department' as 'department' | 'team' | 'global',
    scopeTarget: ''
  })
  const [addRoleForm, setAddRoleForm] = useState({ 
    name: '', 
    description: '', 
    scopeEnabled: false,
    scope: 'department' as 'department' | 'team' | 'global',
    scopeTarget: ''
  })
  const [addRoleError, setAddRoleError] = useState('')
  const selectedRoleData = rolesList.find(r => r.id === selectedRoleId) || rolesList[0]
  
  // Permission states
  const [searchPermission, setSearchPermission] = useState('')
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>(
    permissionModuleGroups.reduce((acc, group) => ({ ...acc, [group.id]: true }), {})
  )

  // Module permissions state
  const [modulePermissions, setModulePermissions] = useState<Record<string, {
    all: boolean
    canRead: boolean
    canUpdate: boolean
    canSoftDelete: boolean
    canDestroy: boolean
  }>>(
    allPermissionModules.reduce((acc, mod) => ({
      ...acc,
      [mod.id]: { all: false, canRead: false, canUpdate: false, canSoftDelete: false, canDestroy: false }
    }), {})
  )

  const toggleGroupExpand = (groupId: string) => {
    setExpandedGroups(prev => ({ ...prev, [groupId]: !prev[groupId] }))
  }

  const toggleGroupAll = (groupId: string, checked: boolean) => {
    const group = permissionModuleGroups.find(g => g.id === groupId)
    if (!group) return
    
    setModulePermissions(prev => {
      const updated = { ...prev }
      group.modules.forEach(mod => {
        updated[mod.id] = {
          all: checked,
          canRead: checked,
          canUpdate: checked,
          canSoftDelete: checked,
          canDestroy: checked
        }
      })
      return updated
    })
  }

  const isGroupAllChecked = (groupId: string) => {
    const group = permissionModuleGroups.find(g => g.id === groupId)
    if (!group) return false
    return group.modules.every(mod => modulePermissions[mod.id]?.all)
  }

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

  // Filter groups and modules based on search
  const filteredGroups = permissionModuleGroups.map(group => ({
    ...group,
    modules: group.modules.filter(mod => 
      mod.name.toLowerCase().includes(searchPermission.toLowerCase())
    )
  })).filter(group => group.modules.length > 0)

  // Handle delete role
  const handleDeleteRole = () => {
    if (roleToDelete) {
      setRolesList(prev => prev.filter(r => r.id !== roleToDelete))
      if (selectedRoleId === roleToDelete) {
        setSelectedRoleId(rolesList[0]?.id || 1)
      }
      setShowDeleteConfirm(false)
      setRoleToDelete(null)
    }
  }

  // Handle edit role
  const startEditRole = () => {
    setEditRoleForm({ 
      name: selectedRoleData.name, 
      description: selectedRoleData.description,
      scopeEnabled: true,
      scope: 'department',
      scopeTarget: 'dept1'
    })
    setIsEditingRole(true)
    setShowRoleDropdown(null)
  }

  const saveEditRole = () => {
    const scopeData = editRoleForm.scopeEnabled && editRoleForm.scope !== 'global' 
      ? {
          department: editRoleForm.scope === 'department' 
            ? sampleDepartments.find(d => d.id === editRoleForm.scopeTarget)?.name || ''
            : '',
          team: editRoleForm.scope === 'team'
            ? sampleTeams.find(t => t.id === editRoleForm.scopeTarget)?.name || ''
            : ''
        }
      : { department: '', team: '' }
    
    setRolesList(prev => prev.map(r => 
      r.id === selectedRoleId 
        ? { ...r, name: editRoleForm.name, description: editRoleForm.description, ...scopeData }
        : r
    ))
    setIsEditingRole(false)
  }

  // Handle add role
  const handleAddRole = () => {
    if (!addRoleForm.name.trim()) {
      setAddRoleError('Vui lòng nhập tên vai trò')
      return
    }
    const scopeData = addRoleForm.scopeEnabled && addRoleForm.scope !== 'global' 
      ? {
          department: addRoleForm.scope === 'department' 
            ? sampleDepartments.find(d => d.id === addRoleForm.scopeTarget)?.name || ''
            : '',
          team: addRoleForm.scope === 'team'
            ? sampleTeams.find(t => t.id === addRoleForm.scopeTarget)?.name || ''
            : ''
        }
      : { department: '', team: '' }
    
    const newRole = {
      id: Math.max(...rolesList.map(r => r.id)) + 1,
      name: addRoleForm.name,
      description: addRoleForm.description,
      status: 'active',
      ...scopeData,
      users: 0
    }
    setRolesList(prev => [...prev, newRole])
    setShowAddRoleModal(false)
    setAddRoleForm({ name: '', description: '', scopeEnabled: false, scope: 'department', scopeTarget: '' })
    setAddRoleError('')
    setSelectedRoleId(newRole.id)
  }

  return (
    <div className="flex gap-6 h-[calc(100vh-200px)]">
      {/* Left Sidebar - Role List */}
      <div className="w-56 flex-shrink-0 bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="p-2">
          {rolesList.map((role) => (
            <div
              key={role.id}
              className={`relative flex items-center justify-between px-3 py-2 rounded-md cursor-pointer transition-colors mb-1 ${
                selectedRoleId === role.id 
                  ? 'bg-[#3e79f7] text-white' 
                  : 'text-[#455560] hover:bg-gray-100'
              }`}
              onClick={() => setSelectedRoleId(role.id)}
            >
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span className="text-sm font-medium">{role.name}</span>
              </div>
              {selectedRoleId === role.id && (
                <div className="relative">
                  <MoreHorizontal 
                    className="w-4 h-4 cursor-pointer hover:opacity-80" 
                    onClick={(e) => {
                      e.stopPropagation()
                      setShowRoleDropdown(showRoleDropdown === role.id ? null : role.id)
                    }}
                  />
                  {/* Dropdown Menu */}
                  {showRoleDropdown === role.id && (
                    <div className="absolute right-0 top-6 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-20 min-w-[120px]">
                      <div
                        className="flex items-center gap-2 px-3 py-2 text-[#455560] hover:bg-gray-100 cursor-pointer text-sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          startEditRole()
                        }}
                      >
                        <Pencil className="w-4 h-4" />
                        <span>Chỉnh sửa</span>
                      </div>
                      <div
                        className="flex items-center gap-2 px-3 py-2 text-red-500 hover:bg-red-50 cursor-pointer text-sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          setRoleToDelete(role.id)
                          setShowDeleteConfirm(true)
                          setShowRoleDropdown(null)
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>Xóa</span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
          
          {/* Add Role Button */}
          <div
            className="flex items-center gap-2 px-3 py-2 mt-2 text-[#455560] hover:text-[#3e79f7] cursor-pointer transition-colors"
            onClick={() => setShowAddRoleModal(true)}
          >
            <Plus className="w-4 h-4" />
            <span className="text-sm">Thêm vai trò</span>
          </div>
        </div>
      </div>

      {/* Right Content - Permission Settings */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Sticky Header - Role Info + Search */}
        <div className="sticky top-0 z-10 pb-4 space-y-4">
          {/* Role Info Header */}
          <div className="flex items-center justify-between">
            <div className="flex-1">
              {isEditingRole ? (
                <div className="space-y-3">
                  <div>
                    <Label className="text-sm text-[#1a3353]">
                      Tên vai trò <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      value={editRoleForm.name}
                      onChange={(e) => setEditRoleForm(prev => ({ ...prev, name: e.target.value }))}
                      className="h-9 mt-1 max-w-xs"
                      placeholder="Tên vai trò"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Label className="text-sm text-[#1a3353]">Phạm vi vai trò</Label>
                    <Switch
                      checked={editRoleForm.scopeEnabled}
                      onCheckedChange={(checked) => setEditRoleForm(prev => ({ 
                        ...prev, 
                        scopeEnabled: checked,
                        scope: checked ? 'department' : 'global',
                        scopeTarget: ''
                      }))}
                    />
                  </div>
                  {editRoleForm.scopeEnabled && (
                    <>
                      <div>
                        <select
                          value={editRoleForm.scope}
                          onChange={(e) => setEditRoleForm(prev => ({ 
                            ...prev, 
                            scope: e.target.value as 'department' | 'team' | 'global',
                            scopeTarget: ''
                          }))}
                          className="w-full max-w-xs h-9 px-3 border border-[#e6ebf1] rounded-[10px] text-sm text-[#455560] hover:border-[#699dff] focus:outline-none focus:border-[#3e79f7] focus:ring-2 focus:ring-[#3e79f7]/20 transition-all duration-300"
                        >
                          <option value="department">Theo phòng ban</option>
                          <option value="team">Theo nhóm</option>
                          <option value="global">Toàn quyền</option>
                        </select>
                      </div>
                      {editRoleForm.scope !== 'global' && (
                        <div>
                          <Label className="text-sm text-[#1a3353] block">
                            Áp dụng <span className="text-red-500">*</span>
                          </Label>
                          <select
                            value={editRoleForm.scopeTarget}
                            onChange={(e) => setEditRoleForm(prev => ({ ...prev, scopeTarget: e.target.value }))}
                            className="block w-full max-w-xs h-9 px-3 mt-1 border border-[#e6ebf1] rounded-[10px] text-sm text-[#455560] hover:border-[#699dff] focus:outline-none focus:border-[#3e79f7] focus:ring-2 focus:ring-[#3e79f7]/20 transition-all duration-300"
                          >
                            <option value="">-- Chọn {editRoleForm.scope === 'department' ? 'phòng ban' : 'nhóm'} --</option>
                            {editRoleForm.scope === 'department' 
                              ? sampleDepartments.map(dept => (
                                  <option key={dept.id} value={dept.id}>{dept.name}</option>
                                ))
                              : sampleTeams.map(team => (
                                  <option key={team.id} value={team.id}>{team.name}</option>
                                ))
                            }
                          </select>
                        </div>
                      )}
                    </>
                  )}
                  <div>
                    <Label className="text-sm text-[#1a3353]">Mô tả</Label>
                    <Textarea
                      value={editRoleForm.description}
                      onChange={(e) => setEditRoleForm(prev => ({ ...prev, description: e.target.value }))}
                      className="mt-1 min-h-[60px] max-w-xs"
                      placeholder="Mô tả vai trò"
                    />
                  </div>
                </div>
              ) : (
                <>
                  <h2 className="text-lg font-semibold text-[#1a3353]">
                    Phân quyền: {selectedRoleData?.name}
                  </h2>
                  <p className="text-sm text-[#455560]">{selectedRoleData?.description}</p>
                </>
              )}
              {/* Additional Role Info */}
              {!isEditingRole && (
                <div className="flex items-center gap-4 mt-2 text-xs text-[#455560]">
                  <span className="flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5" />
                    Phòng ban: <strong>{selectedRoleData?.department || 'Chưa gán'}</strong>
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5" />
                    Nhóm: <strong>{selectedRoleData?.team || 'Chưa gán'}</strong>
                  </span>
                  <span className="flex items-center gap-1">
                    <User2 className="w-3.5 h-3.5" />
                    Người dùng: <strong>{selectedRoleData?.users || 0}</strong>
                  </span>
                </div>
              )}
            </div>
            {isEditingRole ? (
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => setIsEditingRole(false)}>
                  Hủy
                </Button>
                <Button size="sm" onClick={saveEditRole}>
                  Lưu thay đổi
                </Button>
              </div>
            ) : (
              <Button size="sm">
                Lưu thay đổi
              </Button>
            )}
          </div>

          {/* Search Header */}
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-500">Phân quyền theo module</h3>
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Tìm kiếm quyền..." 
                className="pl-8 h-9"
                value={searchPermission}
                onChange={(e) => setSearchPermission(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Module Permissions Grid - Grouped */}
        <div className="flex-1 overflow-y-auto pr-2 space-y-4">
          {filteredGroups.map((group) => (
            <Card key={group.id} className="overflow-hidden">
              {/* Group Header */}
              <div 
                className="flex items-center justify-between p-3 bg-[#f8fafc] border-b cursor-pointer hover:bg-[#f1f5f9] transition-colors"
                onClick={() => toggleGroupExpand(group.id)}
              >
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm text-[#1a3353]">{group.name}</span>
                  <span className="text-xs text-gray-400">({group.modules.length} modules)</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">Tất cả</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleGroupAll(group.id, !isGroupAllChecked(group.id))
                      }}
                      className={`w-10 h-5 rounded-full transition-colors ${
                        isGroupAllChecked(group.id) ? 'bg-[#3e79f7]' : 'bg-gray-300'
                      }`}
                    >
                      <div className={`w-4 h-4 bg-white rounded-full shadow transition-transform ${
                        isGroupAllChecked(group.id) ? 'translate-x-5' : 'translate-x-0.5'
                      }`} />
                    </button>
                  </div>
                  <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${
                    expandedGroups[group.id] ? 'rotate-180' : ''
                  }`} />
                </div>
              </div>
              
              {/* Group Content - Modules */}
              {expandedGroups[group.id] && (
                <div className="p-3 grid grid-cols-2 gap-3">
                  {group.modules.map((module) => {
                    const ModuleIcon = moduleIconMap[module.id] || Building2
                    return (
                    <div key={module.id} className="border border-gray-200 rounded-lg overflow-hidden">
                      <div className="flex items-center justify-between p-2.5 bg-gray-50 border-b">
                        <div className="flex items-center gap-2">
                          <ModuleIcon className="w-4 h-4 text-gray-400" />
                          <span className="font-medium text-xs text-gray-700">{module.name}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] text-gray-400">Tất cả</span>
                          <button
                            onClick={() => toggleModuleAll(module.id, !modulePermissions[module.id]?.all)}
                            className={`w-8 h-4 rounded-full transition-colors ${
                              modulePermissions[module.id]?.all ? 'bg-[#3e79f7]' : 'bg-gray-300'
                            }`}
                          >
                            <div className={`w-3 h-3 bg-white rounded-full shadow transition-transform ${
                              modulePermissions[module.id]?.all ? 'translate-x-4' : 'translate-x-0.5'
                            }`} />
                          </button>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-1.5 p-2">
                        {[
                          { key: 'canRead', label: 'Xem' },
                          { key: 'canUpdate', label: 'Chỉnh sửa' },
                          { key: 'canSoftDelete', label: 'Xóa tạm' },
                          { key: 'canDestroy', label: 'Xóa vĩnh viễn' },
                        ].map((perm) => (
                          <label 
                            key={perm.key}
                            className="flex items-center gap-1.5 p-1.5 bg-gray-100 rounded hover:bg-blue-50 cursor-pointer transition-colors"
                          >
                            <input 
                              type="checkbox"
                              checked={modulePermissions[module.id]?.[perm.key as keyof typeof modulePermissions[string]] || false}
                              onChange={(e) => toggleModulePermission(module.id, perm.key, e.target.checked)}
                              className="w-3.5 h-3.5 rounded text-[#3e79f7]"
                            />
                            <span className="text-[10px]">{perm.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    )
                  })}
                </div>
              )}
            </Card>
          ))}
        </div>
      </div>

      {/* Add Role Modal */}
      {showAddRoleModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowAddRoleModal(false)}>
          <div className="bg-white rounded-lg w-[480px] max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-4 border-b">
              <div>
                <h3 className="text-lg font-semibold text-[#1a3353]">Thêm mới vai trò mới</h3>
                <p className="text-sm text-[#455560]">Tạo vai trò mới với phân quyền chi tiết</p>
              </div>
              <button onClick={() => setShowAddRoleModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <Label className="text-sm text-[#1a3353]">
                  Tên vai trò <span className="text-red-500">*</span>
                </Label>
                <Input
                  placeholder="Nhập tên vai trò"
                  value={addRoleForm.name}
                  onChange={(e) => {
                    setAddRoleForm(prev => ({ ...prev, name: e.target.value }))
                    if (addRoleError) setAddRoleError('')
                  }}
                  className="mt-1"
                />
                {addRoleError && (
                  <p className="text-sm text-red-500 mt-1">{addRoleError}</p>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Label className="text-sm text-[#1a3353]">Phạm vi vai trò</Label>
                <Switch
                  checked={addRoleForm.scopeEnabled}
                  onCheckedChange={(checked) => setAddRoleForm(prev => ({ 
                    ...prev, 
                    scopeEnabled: checked,
                    scope: checked ? 'department' : 'global',
                    scopeTarget: ''
                  }))}
                />
              </div>
              {addRoleForm.scopeEnabled && (
                <>
                  <div>
                    <select
                      value={addRoleForm.scope}
                      onChange={(e) => setAddRoleForm(prev => ({ 
                        ...prev, 
                        scope: e.target.value as 'department' | 'team' | 'global',
                        scopeTarget: ''
                      }))}
                      className="w-full h-9 px-3 border border-[#e6ebf1] rounded-[10px] text-sm text-[#455560] hover:border-[#699dff] focus:outline-none focus:border-[#3e79f7] focus:ring-2 focus:ring-[#3e79f7]/20 transition-all duration-300"
                    >
                      <option value="department">Theo phòng ban</option>
                      <option value="team">Theo nhóm</option>
                      <option value="global">Toàn quyền</option>
                    </select>
                  </div>
                  {addRoleForm.scope !== 'global' && (
                    <div>
                      <Label className="text-sm text-[#1a3353]">
                        Áp dụng <span className="text-red-500">*</span>
                      </Label>
                      <select
                        value={addRoleForm.scopeTarget}
                        onChange={(e) => setAddRoleForm(prev => ({ ...prev, scopeTarget: e.target.value }))}
                        className="w-full h-9 px-3 mt-1 border border-[#e6ebf1] rounded-[10px] text-sm text-[#455560] hover:border-[#699dff] focus:outline-none focus:border-[#3e79f7] focus:ring-2 focus:ring-[#3e79f7]/20 transition-all duration-300"
                      >
                        <option value="">-- Chọn {addRoleForm.scope === 'department' ? 'phòng ban' : 'nhóm'} --</option>
                        {addRoleForm.scope === 'department' 
                          ? sampleDepartments.map(dept => (
                              <option key={dept.id} value={dept.id}>{dept.name}</option>
                            ))
                          : sampleTeams.map(team => (
                              <option key={team.id} value={team.id}>{team.name}</option>
                            ))
                        }
                      </select>
                    </div>
                  )}
                </>
              )}
              <div>
                <Label className="text-sm text-[#1a3353]">Mô tả</Label>
                <Textarea
                  placeholder="Mô tả vai trò và trách nhiệm"
                  value={addRoleForm.description}
                  onChange={(e) => setAddRoleForm(prev => ({ ...prev, description: e.target.value }))}
                  className="mt-1 min-h-[80px]"
                />
              </div>
              <div>
                <Label className="text-sm text-[#1a3353]">Phân quyền</Label>
                <p className="text-xs text-[#455560] mt-1">Sau khi tạo vai trò, bạn có thể thiết lập phân quyền chi tiết</p>
              </div>
            </div>
            <div className="flex justify-end gap-2 p-4 border-t">
              <Button variant="outline" onClick={() => setShowAddRoleModal(false)}>
                Hủy
              </Button>
              <Button onClick={handleAddRole}>
                Tạo vai trò
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowDeleteConfirm(false)}>
          <div className="bg-white rounded-lg w-[400px] p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-500" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-[#1a3353]">Xác nhận xóa</h3>
                <p className="text-sm text-[#455560]">Bạn có xác nhận xóa vai trò này?</p>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowDeleteConfirm(false)}>
                Hủy
              </Button>
              <Button variant="destructive" onClick={handleDeleteRole}>
                Xóa vai trò
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Click outside to close dropdown */}
      {showRoleDropdown && (
        <div className="fixed inset-0 z-10" onClick={() => setShowRoleDropdown(null)} />
      )}
    </div>
  )
}

export default function SettingsManagement() {
  const [activeTab, setActiveTab] = useState('workflow')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [showUserModal, setShowUserModal] = useState(false)
  const [showRoleModal, setShowRoleModal] = useState(false)
  const [showStageModal, setShowStageModal] = useState(false)
  const [showEditStageModal, setShowEditStageModal] = useState(false)
  const [showDeleteStageModal, setShowDeleteStageModal] = useState(false)
  const [showSimpleDeleteStageModal, setShowSimpleDeleteStageModal] = useState(false)
  const [showStatusModal, setShowStatusModal] = useState(false)
  const [showEditStatusModal, setShowEditStatusModal] = useState(false)
  const [showDeleteStatusModal, setShowDeleteStatusModal] = useState(false)
  const [showTagModal, setShowTagModal] = useState(false)
  const [newTagForm, setNewTagForm] = useState({
    name: '',
    color: '#EF4444',
    scope: 'global',
    isActive: true
  })
  const [showDeleteTagModal, setShowDeleteTagModal] = useState(false)
  const [tagToDelete, setTagToDelete] = useState<string | null>(null)
  const [showDeleteDistributionRuleModal, setShowDeleteDistributionRuleModal] = useState(false)
  const [showAddDistributionRule, setShowAddDistributionRule] = useState(false)
  const [showEditDistributionRule, setShowEditDistributionRule] = useState(false)
  const [ruleToDelete, setRuleToDelete] = useState<string | null>(null)
  
  // Customer Ranking Edit State
  const [isEditingRanking, setIsEditingRanking] = useState(false)
  const [editingTier, setEditingTier] = useState<string | null>(null)
  const [customerRankingData, setCustomerRankingData] = useState({
    diamond: {
      totalSpend: 10000000,
      orderCount: 20,
      benefits: ['Ưu đãi độc quyền 20-30%', 'Account Manager riêng', 'Hỗ trợ 24/7 ưu tiên cao', 'Trải nghiệm cá nhân hóa', 'Mời sự kiện VIP']
    },
    gold: {
      totalSpend: 5000000,
      orderCount: 10,
      benefits: ['Ưu đãi đặc biệt 15-20%', 'Hỗ trợ ưu tiên', 'Trải nghiệm nâng cao', 'Tư vấn chuyên sâu', 'Quà tặng định kỳ']
    },
    silver: {
      totalSpend: 2000000,
      orderCount: 5,
      benefits: ['Ưu đãi thành viên 10-15%', 'Hỗ trợ nhanh chóng', 'Tích điểm thưởng', 'Newsletter độc quyền', 'Chương trình loyalty']
    },
    bronze: {
      totalSpend: 500000,
      orderCount: 2,
      benefits: ['Ưu đãi cơ bản 5-10%', 'Hỗ trợ tiêu chuẩn', 'Tích điểm cơ bản', 'Thông tin sản phẩm mới', 'Chăm sóc khách hàng']
    },
    new: {
      totalSpend: 0,
      orderCount: 0,
      benefits: ['Ưu đãi chào mừng', 'Hướng dẫn sử dụng', 'Hỗ trợ onboarding', 'Tài liệu tham khảo', 'Chăm sóc khách hàng mới']
    }
  })
  
  const handleRankingChange = (tier: string, field: string, value: number | string[]) => {
    setCustomerRankingData(prev => ({
      ...prev,
      [tier]: {
        ...prev[tier as keyof typeof prev],
        [field]: value
      }
    }))
  }
  
  const addBenefit = (tier: string) => {
    setCustomerRankingData(prev => ({
      ...prev,
      [tier]: {
        ...prev[tier as keyof typeof prev],
        benefits: [...prev[tier as keyof typeof prev].benefits, '']
      }
    }))
  }
  
  const removeBenefit = (tier: string, index: number) => {
    setCustomerRankingData(prev => ({
      ...prev,
      [tier]: {
        ...prev[tier as keyof typeof prev],
        benefits: prev[tier as keyof typeof prev].benefits.filter((_, i) => i !== index)
      }
    }))
  }
  
  const updateBenefit = (tier: string, index: number, value: string) => {
    setCustomerRankingData(prev => ({
      ...prev,
      [tier]: {
        ...prev[tier as keyof typeof prev],
        benefits: prev[tier as keyof typeof prev].benefits.map((b, i) => i === index ? value : b)
      }
    }))
  }

  const [selectedAssignmentType, setSelectedAssignmentType] = useState<string>('')
  const [individualSearchTerm, setIndividualSearchTerm] = useState<string>('')
  const [individualFilterTeam, setIndividualFilterTeam] = useState<string>('all')
  const [selectedTimeRange, setSelectedTimeRange] = useState<string>('all')
  const [showTemplateModal, setShowTemplateModal] = useState(false)
  const [showIntegrationModal, setShowIntegrationModal] = useState(false)
  const [selectedIntegrationType, setSelectedIntegrationType] = useState<'zalo-personal' | 'zalo-oa' | 'facebook' | ''>('')
  const [showQRModal, setShowQRModal] = useState(false)
  const [showOALinkModal, setShowOALinkModal] = useState(false)
  const [showOAPermissionModal, setShowOAPermissionModal] = useState(false)
  const [showFacebookModal, setShowFacebookModal] = useState(false)
  const [fbConnectionStatus, setFbConnectionStatus] = useState<'idle' | 'connecting' | 'selecting' | 'success'>('idle')
  const [fbPages, setFbPages] = useState<{id: string, name: string, avatar: string, followers: number}[]>([])
  const [selectedFbPages, setSelectedFbPages] = useState<string[]>([])
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
    value: '',
    isAuto: true,
    description: '',
    color: '#3B82F6',
    position: 'end' as 'start' | 'end' | 'after',
    afterStageId: ''
  })
  
  // Edit stage form state
  const [editStageForm, setEditStageForm] = useState({
    name: '',
    value: '',
    isAuto: true,
    description: '',
    color: '#3B82F6'
  })
  
  // Color picker state
  const [showColorPicker, setShowColorPicker] = useState(false)
  const [colorPickerTarget, setColorPickerTarget] = useState<'add' | 'edit' | 'tag'>('add')
  const [tempColor, setTempColor] = useState({ h: 0, s: 100, l: 50, hex: '#3B82F6' })
  
  // Drag and drop state for stages
  const [draggedStageId, setDraggedStageId] = useState<string | null>(null)
  
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

  // Sales Stage Handlers (moved from WorkflowManagement for Dialog access)
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
      value: '',
      isAuto: true,
      description: '',
      color: '#3B82F6',
      position: 'end',
      afterStageId: ''
    })
    setShowStageModal(false)
  }

  // Helper function to convert hex to HSL
  const hexToHsl = (hex: string) => {
    let r = parseInt(hex.slice(1, 3), 16) / 255
    let g = parseInt(hex.slice(3, 5), 16) / 255
    let b = parseInt(hex.slice(5, 7), 16) / 255

    const max = Math.max(r, g, b), min = Math.min(r, g, b)
    let h = 0, s = 0, l = (max + min) / 2

    if (max !== min) {
      const d = max - min
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
      switch (max) {
        case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break
        case g: h = ((b - r) / d + 2) / 6; break
        case b: h = ((r - g) / d + 4) / 6; break
      }
    }

    return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) }
  }

  // Helper function to convert HSL to hex
  const hslToHex = (h: number, s: number, l: number) => {
    s /= 100
    l /= 100
    const a = s * Math.min(l, 1 - l)
    const f = (n: number) => {
      const k = (n + h / 30) % 12
      const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1)
      return Math.round(255 * color).toString(16).padStart(2, '0')
    }
    return `#${f(0)}${f(8)}${f(4)}`
  }

  // Open color picker
  const openColorPicker = (target: 'add' | 'edit' | 'tag') => {
    setColorPickerTarget(target)
    const currentColor = target === 'add' ? newStageForm.color :
                         target === 'edit' ? editStageForm.color :
                         (selectedTag?.color || newTagForm.color)
    const hsl = hexToHsl(currentColor)
    setTempColor({ ...hsl, hex: currentColor })
    setShowColorPicker(true)
  }

  // Apply color from picker
  const applyColor = () => {
    if (colorPickerTarget === 'add') {
      setNewStageForm(prev => ({ ...prev, color: tempColor.hex }))
    } else if (colorPickerTarget === 'edit') {
      setEditStageForm(prev => ({ ...prev, color: tempColor.hex }))
    } else if (colorPickerTarget === 'tag') {
      setNewTagForm(prev => ({ ...prev, color: tempColor.hex }))
    }
    setShowColorPicker(false)
  }

  // Handle color picker change
  const handleColorPickerChange = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
    const y = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height))

    const s = Math.round(x * 100)
    const l = Math.round((1 - y) * 100)
    const hex = hslToHex(tempColor.h, s, l)
    setTempColor(prev => ({ ...prev, s, l, hex }))
  }

  // Handle hue slider change
  const handleHueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const h = parseInt(e.target.value)
    const hex = hslToHex(h, tempColor.s, tempColor.l)
    setTempColor(prev => ({ ...prev, h, hex }))
  }

  // Handle hex input change
  const handleHexInputChange = (hex: string) => {
    if (/^#[0-9A-Fa-f]{6}$/.test(hex)) {
      const hsl = hexToHsl(hex)
      setTempColor({ ...hsl, hex })
    } else {
      setTempColor(prev => ({ ...prev, hex }))
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

  // Drag and drop handlers for stages
  const handleDragStart = (e: React.DragEvent, stageId: string) => {
    const stage = salesStages.find(s => s.id === stageId)
    if (stage?.isFixed) {
      e.preventDefault()
      return
    }
    setDraggedStageId(stageId)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e: React.DragEvent, targetStageId: string) => {
    e.preventDefault()
    const targetStage = salesStages.find(s => s.id === targetStageId)
    if (targetStage?.isFixed) {
      e.dataTransfer.dropEffect = 'none'
      return
    }
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = (e: React.DragEvent, targetStageId: string) => {
    e.preventDefault()
    if (!draggedStageId || draggedStageId === targetStageId) {
      setDraggedStageId(null)
      return
    }

    const draggedStage = salesStages.find(s => s.id === draggedStageId)
    const targetStage = salesStages.find(s => s.id === targetStageId)

    if (!draggedStage || !targetStage || draggedStage.isFixed || targetStage.isFixed) {
      setDraggedStageId(null)
      return
    }

    // Swap orders
    setSalesStages(prev => prev.map(s => {
      if (s.id === draggedStageId) return { ...s, order: targetStage.order }
      if (s.id === targetStageId) return { ...s, order: draggedStage.order }
      return s
    }))

    setDraggedStageId(null)
  }

  const handleDragEnd = () => {
    setDraggedStageId(null)
  }

  // Tag Handlers (moved from WorkflowManagement for access outside component)
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

  // Component: Workflow Management
  const WorkflowManagement = () => {
    // Distribution Rules state
    const [distributionRules, setDistributionRules] = useState<DistributionRule[]>(sampleDistributionRules)
    const [selectedDistributionRule, setSelectedDistributionRule] = useState<DistributionRule | null>(null)
    const [distributionRuleToDelete, setDistributionRuleToDelete] = useState<DistributionRule | null>(null)
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

    // Tag handlers moved to root level for access outside component

    const handleDeleteSalesStage = (stageId: string) => {
      const stage = salesStages.find(s => s.id === stageId)
      if (!stage) return
      
      if (stage.isFixed) {
        alert('Không thể xóa giai đoạn cố định của hệ thống!')
        return
      }
      
      // Luôn hiển thị modal xác nhận xóa với lựa chọn chuyển dữ liệu
      setStageToDelete(stage)
      setShowDeleteStageModal(true)
    }

    const handleEditSalesStage = (stage: SalesStage) => {
      setSelectedStage(stage)
      setEditStageForm({
        name: stage.name,
        value: stage.id.toUpperCase().replace(/[^A-Z0-9_]/g, '_'),
        isAuto: false,
        description: stage.description,
        color: stage.color
      })
      setShowEditStageModal(true)
    }

    // Sales Stage handlers moved to root level for Dialog access

    // handleMoveStage, drag and drop handlers moved to root level for Dialog access

    // Color picker and delete handlers moved to root level for Dialog access

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
    };

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-[#1a3353]">Quản lý Quy trình bán hàng</h2>
            <p className="text-sm text-[#455560]">Tùy chỉnh giai đoạn bán hàng của hệ thống</p>
          </div>
          <Button onClick={() => setShowStageModal(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Thêm giai đoạn
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {/* Sales Stages */}
          <Card>
            <CardContent className="space-y-2 pt-6">
              {salesStages.sort((a, b) => a.order - b.order).map((stage, index) => (
                <div 
                  key={stage.id} 
                  className={`flex items-center justify-between p-3 border rounded-lg transition-all ${
                    stage.isFixed 
                      ? 'bg-white border-gray-200' 
                      : draggedStageId === stage.id 
                        ? 'bg-blue-50 border-blue-300 opacity-50' 
                        : 'bg-white border-gray-200 hover:bg-gray-50'
                  }`}
                  draggable={!stage.isFixed}
                  onDragStart={(e) => handleDragStart(e, stage.id)}
                  onDragOver={(e) => handleDragOver(e, stage.id)}
                  onDrop={(e) => handleDrop(e, stage.id)}
                  onDragEnd={handleDragEnd}
                >
                  <div className="flex items-center space-x-3">
                    {/* Drag handle - only for non-fixed stages */}
                    {!stage.isFixed ? (
                      <div className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600">
                        <GripVertical className="w-5 h-5" />
                      </div>
                    ) : (
                      <div className="w-5 h-5 flex items-center justify-center text-gray-300">
                        <Lock className="w-4 h-4" />
                      </div>
                    )}
                    <div
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: stage.color }}
                    />
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-gray-900">{stage.name}</span>
                      {stage.isFixed && (
                        <Badge className="text-xs bg-[#f5f0fa] text-[#a461d8] hover:bg-[#f5f0fa]">Cố định</Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="text-xs min-w-[32px] justify-center">{stage.order}</Badge>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleEditSalesStage(stage)}
                      title="Chỉnh sửa giai đoạn"
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      disabled={stage.isFixed}
                      className={stage.isFixed ? 'cursor-not-allowed opacity-50' : 'text-red-600 hover:text-red-700'}
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
        </div>

        {/* Tag Creation/Edit Modal - moved to root level for better rendering */}

        {/* Delete Tag Confirmation Modal - moved to root level for better rendering */}

        {/* Delete Distribution Rule Confirmation Modal */}
        <Dialog open={showDeleteDistributionRuleModal} onOpenChange={setShowDeleteDistributionRuleModal}>
          <DialogContent className="max-w-sm">
            <DialogHeader>
              <DialogTitle className="text-lg font-semibold text-[#1a3353]">Xác nhận xóa</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <p className="text-sm text-gray-600">Bạn có muốn xóa quy tắc phân bổ này không?</p>
            </div>
            <DialogFooter className="gap-2 sm:gap-0">
              <Button variant="outline" onClick={() => setShowDeleteDistributionRuleModal(false)}>
                Hủy
              </Button>
              <Button 
                variant="destructive"
                onClick={() => {
                  // TODO: Delete rule logic
                  setShowDeleteDistributionRuleModal(false)
                  setRuleToDelete(null)
                }}
              >
                Xóa
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Sales Stage Modals have been moved to root level for better rendering - see bottom of SettingsManagement component */}

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

        {/* Add Distribution Rule Modal */}
        <Dialog open={showAddDistributionRule} onOpenChange={setShowAddDistributionRule}>
          <DialogContent className="max-w-xl p-0 max-h-[90vh] overflow-hidden flex flex-col">
            <DialogHeader className="px-6 pt-6 pb-4 border-b border-[#e6ebf1] shrink-0">
              <DialogTitle className="text-lg font-semibold text-[#1a3353]">Thêm quy tắc phân bổ leads</DialogTitle>
              <DialogDescription className="text-sm text-[#455560]">
                Tạo quy tắc mới để phân bổ leads tự động cho nhóm bán hàng
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-5 px-6 py-4 overflow-y-auto flex-1">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="rule-name" className="text-sm font-medium">
                    Tên quy tắc <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="rule-name"
                    placeholder="Nhập tên quy tắc"
                    className="mt-1.5"
                  />
                  <p className="text-xs text-red-500 mt-1">Vui lòng nhập tên quy tắc</p>
                </div>
                <div>
                  <Label htmlFor="assignment-type" className="text-sm font-medium">
                    Loại phân bổ <span className="text-red-500">*</span>
                  </Label>
                  <Select onValueChange={(value) => setSelectedAssignmentType(value)} defaultValue="department">
                    <SelectTrigger className="mt-1.5">
                      <SelectValue placeholder="Theo phòng ban" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="department">Theo phòng ban</SelectItem>
                      <SelectItem value="team">Theo team</SelectItem>
                      <SelectItem value="individual">Cá nhân</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Department/Team/Individual selection */}
              <div className="space-y-2 max-h-32 overflow-y-auto border rounded-lg p-3">
                {(selectedAssignmentType === 'department' || !selectedAssignmentType) && (
                  <>
                    <div className="flex items-center space-x-3">
                      <input type="checkbox" id="dept-support" className="w-4 h-4 rounded border-gray-300" />
                      <label htmlFor="dept-support" className="text-sm">Phòng support</label>
                    </div>
                    <div className="flex items-center space-x-3">
                      <input type="checkbox" id="dept-qa" className="w-4 h-4 rounded border-gray-300" />
                      <label htmlFor="dept-qa" className="text-sm">Phòng kiểm tra chất lượng</label>
                    </div>
                    <div className="flex items-center space-x-3">
                      <input type="checkbox" id="dept-dev" className="w-4 h-4 rounded border-gray-300" />
                      <label htmlFor="dept-dev" className="text-sm">Phòng Dev CRM</label>
                    </div>
                    <div className="flex items-center space-x-3">
                      <input type="checkbox" id="dept-sales" className="w-4 h-4 rounded border-gray-300" />
                      <label htmlFor="dept-sales" className="text-sm">Phòng sale</label>
                    </div>
                  </>
                )}
                  
                {selectedAssignmentType === 'team' && (
                  <>
                    <div className="flex items-center space-x-3">
                      <input type="checkbox" id="team-sales-a" className="w-4 h-4 rounded border-gray-300" />
                      <label htmlFor="team-sales-a" className="text-sm">Team Sales A</label>
                    </div>
                    <div className="flex items-center space-x-3">
                      <input type="checkbox" id="team-sales-b" className="w-4 h-4 rounded border-gray-300" />
                      <label htmlFor="team-sales-b" className="text-sm">Team Sales B</label>
                    </div>
                    <div className="flex items-center space-x-3">
                      <input type="checkbox" id="team-telesales-1" className="w-4 h-4 rounded border-gray-300" />
                      <label htmlFor="team-telesales-1" className="text-sm">Team Telesales 1</label>
                    </div>
                    <div className="flex items-center space-x-3">
                      <input type="checkbox" id="team-telesales-2" className="w-4 h-4 rounded border-gray-300" />
                      <label htmlFor="team-telesales-2" className="text-sm">Team Telesales 2</label>
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
                <Label htmlFor="rule-description" className="text-sm font-medium">Mô tả</Label>
                <Input
                  id="rule-description"
                  placeholder="Mô tả ngắn về quy tắc này"
                  className="mt-1.5"
                />
              </div>

              <div>
                <Label className="text-sm font-medium">Phương thức phân bổ</Label>
                <div className="grid grid-cols-3 gap-3 mt-2">
                  <div className="border-2 border-blue-500 rounded-lg p-3 cursor-pointer bg-blue-50">
                    <div className="flex flex-col items-center text-center">
                      <input type="radio" name="distribution-method" value="round_robin" defaultChecked className="mb-2" />
                      <h4 className="font-medium text-sm">Xoay vòng</h4>
                      <p className="text-xs text-gray-500 mt-1">Phân đều cho từng thành viên</p>
                    </div>
                  </div>
                  <div className="border rounded-lg p-3 cursor-pointer hover:bg-gray-50 hover:border-gray-300">
                    <div className="flex flex-col items-center text-center">
                      <input type="radio" name="distribution-method" value="load_based" className="mb-2" />
                      <h4 className="font-medium text-sm">Theo tải</h4>
                      <p className="text-xs text-gray-500 mt-1">Dựa trên khối lượng công việc</p>
                    </div>
                  </div>
                  <div className="border rounded-lg p-3 cursor-pointer hover:bg-gray-50 hover:border-gray-300">
                    <div className="flex flex-col items-center text-center">
                      <input type="radio" name="distribution-method" value="random" className="mb-2" />
                      <h4 className="font-medium text-sm">Ngẫu nhiên</h4>
                      <p className="text-xs text-gray-500 mt-1">Phân bổ hoàn toàn ngẫu nhiên</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium">Điều kiện áp dụng</Label>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <div>
                    <Label htmlFor="lead-source" className="text-xs text-gray-600">Nguồn leads</Label>
                    <Select>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Chọn nguồn" />
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
                    <Label htmlFor="region" className="text-xs text-gray-600">Khu vực</Label>
                    <Select>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Chọn khu vực" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tất cả</SelectItem>
                        <SelectItem value="north">Miền Bắc</SelectItem>
                        <SelectItem value="central">Miền Trung</SelectItem>
                        <SelectItem value="south">Miền Nam</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-3">
                  <div>
                    <Label htmlFor="time-range" className="text-xs text-gray-600">Thời gian áp dụng</Label>
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
                  </div>
                  <div>
                    <Label htmlFor="priority" className="text-xs text-gray-600">Độ ưu tiên</Label>
                    <Input
                      id="priority"
                      type="number"
                      placeholder="0"
                      defaultValue="0"
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>

            <DialogFooter className="px-6 py-4 border-t border-[#e6ebf1] gap-2 sm:gap-0 shrink-0">
              <Button variant="outline" onClick={() => setShowAddDistributionRule(false)}>
                Hủy
              </Button>
              <Button onClick={() => {
                // TODO: Implement add distribution rule logic
                setShowAddDistributionRule(false)
              }}>
                Đồng ý
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
        setShowIntegrationModal(false)
        setShowFacebookModal(true)
        setFbConnectionStatus('idle')
      }
    }

    // Handler: Connect Zalo OA - directly create integration (OAuth handled by Zalo)
    const handleOAConnect = () => {
      // TODO: Call Zalo OAuth API - Zalo will show their own permission UI
      // For now, simulate successful connection
      
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
      setShowOALinkModal(false)
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
            <DialogContent className="max-w-md [&>button]:hidden">
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
                      <SelectItem value="facebook">
                        <div className="flex items-center gap-2">
                          <Facebook className="w-4 h-4" />
                          Kết nối Facebook Fanpage
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
            <DialogContent className="max-w-2xl [&>button]:hidden">
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

        {/* Modal: Kết nối Facebook Fanpage */}
        {showFacebookModal && (
          <Dialog open={showFacebookModal} onOpenChange={setShowFacebookModal}>
            <DialogContent className="max-w-md [&>button]:hidden">
              <DialogHeader>
                <DialogTitle className="text-2xl text-center">
                  Kết nối Vilead CRM
                </DialogTitle>
                <DialogDescription className="text-center">
                  với Facebook Fanpage
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6 py-4">
                {/* Logo Section */}
                <div className="flex items-center justify-center gap-6">
                  <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                    <span className="text-2xl font-bold text-blue-600">V</span>
                  </div>

                  <RefreshCw className="w-6 h-6 text-gray-400" />

                  <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
                    <Facebook className="w-8 h-8 text-white" />
                  </div>
                </div>

                {/* Info Message */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                  <p className="text-sm text-gray-700">
                    Đăng nhập Facebook để kết nối các{' '}
                    <strong className="text-blue-600">Fanpage</strong> bạn quản lý{' '}
                    với Vilead CRM
                  </p>
                </div>

                {/* Connect Button */}
                <Button
                  className="w-full h-12 text-base bg-blue-600 hover:bg-blue-700"
                  onClick={() => {
                    // TODO: Implement Facebook OAuth
                    alert('Chức năng đang được phát triển')
                  }}
                >
                  <Facebook className="w-5 h-5 mr-2" />
                  Kết nối tài khoản Facebook
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}

        {/* Modal: Kết nối Zalo OA - Step 1 (Link) */}
        {showOALinkModal && (
          <Dialog open={showOALinkModal} onOpenChange={setShowOALinkModal}>
            <DialogContent className="max-w-md [&>button]:hidden">
              <DialogHeader>
                <DialogTitle className="text-2xl text-center">
                  Kết nối Vilead CRM
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
              </div>
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
    const [filterStartDate, setFilterStartDate] = useState('')
    const [filterEndDate, setFilterEndDate] = useState('')
    const [searchQuery, setSearchQuery] = useState('')
    const [historyTab, setHistoryTab] = useState('process')

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

      // Date range filter
      const itemDate = new Date(item.timestamp)
      let dateMatch = true
      if (filterStartDate && filterEndDate) {
        const startDate = new Date(filterStartDate)
        const endDate = new Date(filterEndDate)
        dateMatch = itemDate >= startDate && itemDate <= endDate
      } else if (filterStartDate) {
        const startDate = new Date(filterStartDate)
        dateMatch = itemDate >= startDate
      } else if (filterEndDate) {
        const endDate = new Date(filterEndDate)
        dateMatch = itemDate <= endDate
      }

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
            <div className="flex items-center border-b border-[#e6ebf1] w-full -ml-6">
              <div className="inline-flex items-center justify-center whitespace-nowrap px-4 py-3 text-sm font-semibold leading-6 text-[#3e79f7] border-b-2 border-[#3e79f7] transition-all duration-300 uppercase">
                Lịch sử
              </div>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Hôm nay */}
          <Card className="bg-gradient-to-br from-purple-400 to-purple-600 border border-gray-300 text-white rounded-lg shadow-md">
            <CardContent className="p-6">
              <div className="space-y-2">
                <p className="text-sm font-medium opacity-90">Hôm nay</p>
                <p className="text-5xl font-bold">0</p>
              </div>
            </CardContent>
          </Card>

          {/* Tuần này */}
          <Card className="bg-gradient-to-br from-blue-400 to-blue-600 border border-gray-300 text-white rounded-lg shadow-md">
            <CardContent className="p-6">
              <div className="space-y-2">
                <p className="text-sm font-medium opacity-90">Tuần này</p>
                <p className="text-5xl font-bold">0</p>
              </div>
            </CardContent>
          </Card>

          {/* Tháng này */}
          <Card className="bg-gradient-to-br from-green-400 to-green-600 border border-gray-300 text-white rounded-lg shadow-md">
            <CardContent className="p-6">
              <div className="space-y-2">
                <p className="text-sm font-medium opacity-90">Tháng này</p>
                <p className="text-5xl font-bold">0</p>
              </div>
            </CardContent>
          </Card>

          {/* Admin */}
          <Card className="bg-gradient-to-br from-orange-400 to-orange-600 border border-gray-300 text-white rounded-lg shadow-md">
            <CardContent className="p-6">
              <div className="space-y-2">
                <p className="text-sm font-medium opacity-90">Admin</p>
                <p className="text-5xl font-bold">0</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="border border-gray-300 rounded-lg shadow-md">
          <CardHeader>
            <CardTitle>Bộ lọc & Tìm kiếm</CardTitle>
            <CardDescription>
              Lọc lịch sử theo danh mục, người thực hiện và tìm kiếm trong nội dung
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4">
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Tất cả danh mục" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={filterPerformer} onValueChange={setFilterPerformer}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Chọn người phân công" />
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

              <Input
                type="date"
                value={filterStartDate}
                onChange={(e) => setFilterStartDate(e.target.value)}
                placeholder="Chọn ngày bắt đầu"
                className="w-[180px]"
              />

              <Input
                type="date"
                value={filterEndDate}
                onChange={(e) => setFilterEndDate(e.target.value)}
                placeholder="Chọn ngày kết thúc"
                className="w-[180px]"
              />
            </div>
          </CardContent>
        </Card>

        {/* History Table */}
        <Card className="border border-gray-300 rounded-lg shadow-md">
          <CardHeader>
            <CardTitle>Lịch sử Hệ thống</CardTitle>
            <CardDescription>Theo dõi chi tiết các thay đổi hệ thống theo thời gian</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
              <TableRow>
                <TableHead>Thời gian</TableHead>
                <TableHead>Danh mục</TableHead>
                <TableHead>Hành động</TableHead>
                <TableHead>Người thực hiện</TableHead>
                <TableHead>Chi tiết</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>IP</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredHistory.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <div className="font-medium text-gray-900">
                      {new Date(item.timestamp).toLocaleDateString('vi-VN')}
                    </div>
                    <div className="text-gray-500 text-xs">
                      {new Date(item.timestamp).toLocaleTimeString('vi-VN')}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getCategoryColor(item.category)}`}>
                        {getCategoryIcon(item.category)}
                      </div>
                      <span className="text-sm font-medium">
                        {categories.find(c => c.value === item.category)?.label || item.category}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">
                      {item.action.replace(/_/g, ' ')}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium text-gray-900">{item.performedBy}</div>
                    <Badge variant="secondary" className="text-xs mt-1">
                      {item.performedByRole}
                    </Badge>
                  </TableCell>
                  <TableCell className="max-w-md">
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
                  </TableCell>
                  <TableCell>
                    <Badge variant={item.status === 'success' ? 'default' : 'destructive'} className="text-xs">
                      {item.status === 'success' ? 'Thành công' : 'Thất bại'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-gray-500">
                    {item.ip}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            </Table>

            {filteredHistory.length === 0 && (
              <div className="text-center py-12">
                <History className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Không có lịch sử</h3>
                <p className="text-gray-500">Không tìm thấy thay đổi nào phù hợp với bộ lọc.</p>
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
      { id: 'p1', name: 'Sản phẩm A', code: 'PROD-A', price: 1000000, description: 'Mô tả sản phẩm A', image: '', category: 'Phần mềm', type: 'Gói cơ bản', classification: 'Dịch vụ', quantity: 100, status: 'active' },
      { id: 'p2', name: 'Sản phẩm B', code: 'PROD-B', price: 2000000, description: 'Mô tả sản phẩm B', image: '', category: 'Phần cứng', type: 'Gói nâng cao', classification: 'Sản phẩm', quantity: 50, status: 'active' },
      { id: 'p3', name: 'Sản phẩm C', code: 'PROD-C', price: 3000000, description: 'Mô tả sản phẩm C', image: '', category: 'Phần mềm', type: 'Gói premium', classification: 'Dịch vụ', quantity: 0, status: 'inactive' }
    ])

    const [categories, setCategories] = useState<any[]>([
      { id: 'cat1', name: 'Phần mềm' },
      { id: 'cat2', name: 'Phần cứng' },
      { id: 'cat3', name: 'Dịch vụ' },
      { id: 'cat4', name: 'Combo' }
    ])

    const [selectedCategory, setSelectedCategory] = useState<string>('cat1')

    const [packages, setPackages] = useState<any[]>([
      { id: 'pkg1', name: 'Gói Cơ bản', productIds: ['p1'], price: 900000, description: 'Gói cơ bản chứa 1 sản phẩm' }
    ])

    const [showProductModal, setShowProductModal] = useState(false)
    const [showPackageModal, setShowPackageModal] = useState(false)
    const [showCategoryModal, setShowCategoryModal] = useState(false)
    const [showDeleteCategoryConfirm, setShowDeleteCategoryConfirm] = useState(false)
    const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null)
    const [editingCategory, setEditingCategory] = useState<any>(null)
    const [editingProduct, setEditingProduct] = useState<any>(null)
    const [categoryForm, setCategoryForm] = useState({ name: '' })
    const [productForm, setProductForm] = useState({ 
      name: '', 
      code: '', 
      price: '0', 
      description: '',
      productType: 'simple', // 'simple' | 'configurable'
      quantity: '0',
      status: 'active',
      categoryId: '',
      classification: 'physical' // 'physical' | 'non-physical'
    })
    const [productFormErrors, setProductFormErrors] = useState<any>({})
    const [variants, setVariants] = useState<any[]>([
      { id: 'v1', name: '', hasImage: false, options: [{ id: 'o1', value: '' }] }
    ])
    const [variantCombinations, setVariantCombinations] = useState<any[]>([])
    const [packageForm, setPackageForm] = useState({ name: '', price: '', productIds: [] as string[], description: '' })

    const handleSaveProduct = () => {
      // Validate
      const errors: any = {}
      if (!productForm.name.trim()) errors.name = 'Tên sản phẩm không được để trống'
      if (!productForm.categoryId) errors.categoryId = 'Phải chọn ít nhất một thể loại'
      
      if (Object.keys(errors).length > 0) {
        setProductFormErrors(errors)
        return
      }

      if (editingProduct) {
        // Update existing product
        setProducts(prev => prev.map(p => {
          if (p.id === editingProduct.id) {
            return {
              ...p,
              name: productForm.name,
              code: productForm.code,
              price: Number(productForm.price) || 0,
              description: productForm.description || '',
              category: categories.find(c => c.id === productForm.categoryId)?.name || 'Phần mềm',
              type: productForm.productType === 'configurable' ? 'Có thể cấu hình' : 'Đơn giản',
              classification: productForm.classification === 'physical' ? 'Sản phẩm vật lý' : 'Sản phẩm phi vật lý',
              quantity: Number(productForm.quantity) || 0,
              status: productForm.status,
              variants: productForm.productType === 'configurable' ? variantCombinations : []
            }
          }
          return p
        }))
      } else {
        // Add new product
        const newProduct = {
          id: 'p' + (products.length + 1),
          name: productForm.name || `Sản phẩm ${products.length + 1}`,
          code: productForm.code || `PROD-${products.length + 1}`,
          price: Number(productForm.price) || 0,
          description: productForm.description || '',
          image: '',
          category: categories.find(c => c.id === productForm.categoryId)?.name || 'Phần mềm',
          type: productForm.productType === 'configurable' ? 'Có thể cấu hình' : 'Đơn giản',
          classification: productForm.classification === 'physical' ? 'Sản phẩm vật lý' : 'Sản phẩm phi vật lý',
          quantity: Number(productForm.quantity) || 0,
          status: productForm.status,
          variants: productForm.productType === 'configurable' ? variantCombinations : []
        }
        setProducts(prev => [newProduct, ...prev])
      }
      resetProductForm()
      setShowProductModal(false)
    }

    const handleOpenEditProduct = (product: any) => {
      setEditingProduct(product)
      // Find category id from category name
      const categoryId = categories.find(c => c.name === product.category)?.id || ''
      setProductForm({
        name: product.name || '',
        code: product.code || '',
        price: String(product.price || 0),
        description: product.description || '',
        productType: product.type === 'Có thể cấu hình' ? 'configurable' : 'simple',
        quantity: String(product.quantity || 0),
        status: product.status || 'active',
        categoryId: categoryId,
        classification: product.classification === 'Sản phẩm vật lý' ? 'physical' : 'non-physical'
      })
      if (product.variants && product.variants.length > 0) {
        setVariantCombinations(product.variants)
      }
      setShowProductModal(true)
    }

    const resetProductForm = () => {
      setEditingProduct(null)
      setProductForm({ 
        name: '', 
        code: '', 
        price: '0', 
        description: '',
        productType: 'simple',
        quantity: '0',
        status: 'active',
        categoryId: '',
        classification: 'physical'
      })
      setProductFormErrors({})
      setVariants([{ id: 'v1', name: '', hasImage: false, options: [{ id: 'o1', value: '' }] }])
      setVariantCombinations([])
    }

    const handleAddVariant = () => {
      setVariants(prev => [...prev, { 
        id: 'v' + (prev.length + 1), 
        name: '', 
        hasImage: false, 
        options: [{ id: 'o1', value: '' }] 
      }])
    }

    const handleRemoveVariant = (variantId: string) => {
      setVariants(prev => prev.filter(v => v.id !== variantId))
    }

    const handleAddOption = (variantId: string) => {
      setVariants(prev => prev.map(v => {
        if (v.id === variantId) {
          return {
            ...v,
            options: [...v.options, { id: 'o' + (v.options.length + 1), value: '' }]
          }
        }
        return v
      }))
    }

    const handleRemoveOption = (variantId: string, optionId: string) => {
      setVariants(prev => prev.map(v => {
        if (v.id === variantId) {
          return {
            ...v,
            options: v.options.filter((o: any) => o.id !== optionId)
          }
        }
        return v
      }))
    }

    const handleUpdateVariantName = (variantId: string, name: string) => {
      setVariants(prev => prev.map(v => v.id === variantId ? { ...v, name } : v))
    }

    const handleUpdateVariantHasImage = (variantId: string, hasImage: boolean) => {
      setVariants(prev => prev.map(v => v.id === variantId ? { ...v, hasImage } : v))
    }

    const handleUpdateOptionValue = (variantId: string, optionId: string, value: string) => {
      setVariants(prev => prev.map(v => {
        if (v.id === variantId) {
          return {
            ...v,
            options: v.options.map((o: any) => o.id === optionId ? { ...o, value } : o)
          }
        }
        return v
      }))
    }

    const generateVariantCombinations = () => {
      // Generate combinations from variants
      const validVariants = variants.filter(v => v.name && v.options.some((o: any) => o.value))
      if (validVariants.length === 0) {
        setVariantCombinations([])
        return
      }

      // Simple combination for single variant
      const combinations: any[] = []
      validVariants.forEach(v => {
        v.options.filter((o: any) => o.value).forEach((o: any) => {
          combinations.push({
            id: `combo_${v.id}_${o.id}`,
            variantName: v.name,
            optionValue: o.value,
            price: '0',
            quantity: '0'
          })
        })
      })
      setVariantCombinations(combinations)
    }

    // Auto generate combinations when variants change
    useEffect(() => {
      if (productForm.productType === 'configurable') {
        generateVariantCombinations()
      }
    }, [variants, productForm.productType])

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

    const handleOpenAddCategory = () => {
      setEditingCategory(null)
      setCategoryForm({ name: '' })
      setShowCategoryModal(true)
    }

    const handleOpenEditCategory = (cat: any) => {
      setEditingCategory(cat)
      setCategoryForm({ name: cat.name })
      setShowCategoryModal(true)
    }

    const handleSaveCategory = () => {
      if (editingCategory) {
        // Edit existing
        setCategories(prev => prev.map(c => c.id === editingCategory.id ? { ...c, name: categoryForm.name } : c))
      } else {
        // Add new
        const newCat = {
          id: 'cat' + (categories.length + 1),
          name: categoryForm.name || `Thể loại ${categories.length + 1}`
        }
        setCategories(prev => [...prev, newCat])
      }
      setCategoryForm({ name: '' })
      setEditingCategory(null)
      setShowCategoryModal(false)
    }

    const handleDeleteCategory = (catId: string) => {
      setCategoryToDelete(catId)
      setShowDeleteCategoryConfirm(true)
    }

    const confirmDeleteCategory = () => {
      if (categoryToDelete) {
        setCategories(prev => prev.filter(c => c.id !== categoryToDelete))
        // Also remove products in this category
        const catName = categories.find(c => c.id === categoryToDelete)?.name
        setProducts(prev => prev.filter(p => p.category !== catName))
        if (selectedCategory === categoryToDelete && categories.length > 1) {
          setSelectedCategory(categories.find(c => c.id !== categoryToDelete)?.id || '')
        }
      }
      setCategoryToDelete(null)
      setShowDeleteCategoryConfirm(false)
    }

    return (
      <>
      <Tabs defaultValue="products" className="space-y-6">
        <TabsList className="inline-flex w-auto -mt-6 -ml-6">
          <TabsTrigger value="products" className="uppercase">Sản phẩm</TabsTrigger>
        </TabsList>

        <TabsContent value="products" className="space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-[#1a3353]">Sản phẩm & Thể loại sản phẩm</h2>
              <p className="text-sm text-[#455560]">Quản lý danh sách sản phẩm và các thể loại sản phẩm</p>
            </div>
            <div className="flex items-center space-x-2">
              <Button size="sm" onClick={() => setShowProductModal(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Thêm sản phẩm
              </Button>
            </div>
          </div>

          {/* Main Content - Left sidebar + Right table */}
          <div className="flex gap-4">
          {/* Left Sidebar - Category List */}
          <div className="w-56 flex-shrink-0 bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="p-2">
              {categories.map(cat => (
                <div
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`relative flex items-center justify-between px-3 py-2 rounded-md cursor-pointer transition-colors mb-1 ${
                    selectedCategory === cat.id
                      ? 'bg-[#3e79f7] text-white'
                      : 'text-[#455560] hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Package className="w-4 h-4" />
                    <span className="text-sm font-medium">{cat.name}</span>
                  </div>
                  {selectedCategory === cat.id && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <div className="relative">
                          <MoreHorizontal className="w-4 h-4 cursor-pointer hover:opacity-80" />
                        </div>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => handleOpenEditCategory(cat)}>
                          <Edit2 className="w-4 h-4 mr-2" />
                          Chỉnh sửa
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600" onClick={() => handleDeleteCategory(cat.id)}>
                          <Trash2 className="w-4 h-4 mr-2" />
                          Xóa
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>
              ))}
              <div
                onClick={handleOpenAddCategory}
                className="flex items-center gap-2 px-3 py-2 mt-2 text-[#455560] hover:text-[#3e79f7] cursor-pointer transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span className="text-sm">Thêm thể loại sản phẩm</span>
              </div>
            </div>
          </div>

          {/* Right Content - Products Table */}
          <div className="flex-1 overflow-hidden">
            <Card>
              <CardContent className="p-0 overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">STT</TableHead>
                      <TableHead className="w-16">Ảnh</TableHead>
                      <TableHead className="whitespace-nowrap">Tên sản phẩm</TableHead>
                      <TableHead>Mô tả</TableHead>
                      <TableHead className="whitespace-nowrap">Loại sản phẩm</TableHead>
                      <TableHead className="whitespace-nowrap">Thể loại</TableHead>
                      <TableHead className="whitespace-nowrap">Phân loại</TableHead>
                      <TableHead className="text-right whitespace-nowrap">Số lượng còn</TableHead>
                      <TableHead className="whitespace-nowrap">Trạng thái</TableHead>
                      <TableHead className="w-24">Thao tác</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.map((p, index) => (
                      <TableRow key={p.id}>
                        <TableCell className="text-center">{index + 1}</TableCell>
                        <TableCell>
                          <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center">
                            <Package className="w-5 h-5 text-gray-400" />
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">{p.name}</div>
                          <div className="text-xs text-gray-400">{p.code}</div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm text-gray-500 max-w-[150px] truncate">{p.description}</div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">{p.type}</div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">{p.category}</div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">{p.classification}</div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="font-medium">{p.quantity}</div>
                        </TableCell>
                        <TableCell>
                          <Badge className={p.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}>
                            {p.status === 'active' ? 'Hoạt động' : 'Ngừng bán'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Button variant="ghost" size="sm" onClick={() => handleOpenEditProduct(p)}>
                              <Edit2 className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </div>
        </TabsContent>
      </Tabs>

      {/* Add/Edit Product Modal */}
      <Dialog open={showProductModal} onOpenChange={(open) => {
        setShowProductModal(open)
        if (!open) resetProductForm()
      }}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingProduct ? 'Chỉnh sửa sản phẩm' : 'Thêm mới sản phẩm'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 px-6">
              {/* Tên sản phẩm */}
              <div>
                <Label className="text-sm">Tên sản phẩm <span className="text-red-500">*</span></Label>
                <Input 
                  value={productForm.name} 
                  onChange={(e:any)=>{
                    setProductForm(prev=>({...prev,name:e.target.value}))
                    if (productFormErrors.name) setProductFormErrors((prev: any)=>({...prev,name:''}))
                  }}
                  placeholder="Nhập tên sản phẩm"
                  className={productFormErrors.name ? 'border-red-500' : ''}
                />
                {productFormErrors.name && <p className="text-xs text-red-500 mt-1">{productFormErrors.name}</p>}
              </div>

              {/* Image Upload */}
              <div>
                <div className="w-16 h-16 border border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50">
                  <ImageIcon className="w-6 h-6 text-gray-400" />
                </div>
                <Button variant="outline" size="sm" className="mt-2">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Images
                </Button>
              </div>

              {/* Row: Loại sản phẩm & Giá gốc */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm">Loại sản phẩm <span className="text-red-500">*</span></Label>
                  <Select 
                    value={productForm.productType} 
                    onValueChange={(v)=>setProductForm(prev=>({...prev,productType:v}))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn loại sản phẩm" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="simple">Đơn giản</SelectItem>
                      <SelectItem value="configurable">Có thể cấu hình</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-sm">Giá gốc (VND) <span className="text-red-500">*</span></Label>
                  <Input 
                    type="number"
                    value={productForm.price} 
                    onChange={(e:any)=>setProductForm(prev=>({...prev,price:e.target.value}))}
                    placeholder="0"
                  />
                </div>
              </div>

              {/* Row: Số lượng & Trạng thái */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm">Số lượng <span className="text-red-500">*</span></Label>
                  <Input 
                    type="number"
                    value={productForm.quantity} 
                    onChange={(e:any)=>setProductForm(prev=>({...prev,quantity:e.target.value}))}
                    placeholder="0"
                  />
                </div>
                <div>
                  <Label className="text-sm">Trạng thái <span className="text-red-500">*</span></Label>
                  <Select 
                    value={productForm.status} 
                    onValueChange={(v)=>setProductForm(prev=>({...prev,status:v}))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn trạng thái" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Đang hoạt động</SelectItem>
                      <SelectItem value="inactive">Ngừng hoạt động</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Row: Thể loại & Phân loại sản phẩm */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm">Thể loại <span className="text-red-500">*</span></Label>
                  <Select 
                    value={productForm.categoryId} 
                    onValueChange={(v)=>{
                      setProductForm(prev=>({...prev,categoryId:v}))
                      if (productFormErrors.categoryId) setProductFormErrors((prev: any)=>({...prev,categoryId:''}))
                    }}
                  >
                    <SelectTrigger className={productFormErrors.categoryId ? 'border-red-500' : ''}>
                      <SelectValue placeholder="Chọn thể loại" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(cat => (
                        <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {productFormErrors.categoryId && <p className="text-xs text-red-500 mt-1">{productFormErrors.categoryId}</p>}
                </div>
                <div>
                  <Label className="text-sm">Phân loại sản phẩm <span className="text-red-500">*</span></Label>
                  <Select 
                    value={productForm.classification} 
                    onValueChange={(v)=>setProductForm(prev=>({...prev,classification:v}))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn phân loại" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="physical">Sản phẩm vật lý</SelectItem>
                      <SelectItem value="non-physical">Sản phẩm phi vật lý</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Mô tả */}
              <div>
                <Label className="text-sm">Mô tả</Label>
                <Textarea 
                  value={productForm.description} 
                  onChange={(e:any)=>setProductForm(prev=>({...prev,description:e.target.value}))}
                  placeholder="Nhập mô tả..."
                  rows={3}
                />
              </div>

              {/* Biến thể - chỉ hiển thị khi chọn "Có thể cấu hình" */}
              {productForm.productType === 'configurable' && (
                <div className="space-y-4 pt-4 border-t">
                  <Label className="text-sm font-semibold">Biến thể <span className="text-red-500">*</span></Label>
                  
                  {variants.map((variant, vIndex) => (
                    <div key={variant.id} className="border rounded-lg p-4 space-y-3 relative">
                      {variants.length > 1 && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="absolute right-2 top-2 text-gray-400 hover:text-red-500"
                          onClick={() => handleRemoveVariant(variant.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                      
                      <div>
                        <Label className="text-sm">Tên biến thể <span className="text-red-500">*</span></Label>
                        <div className="flex items-center gap-4 mt-1">
                          <span className="text-xs text-gray-500">Thêm hình ảnh</span>
                          <Switch 
                            checked={variant.hasImage}
                            onCheckedChange={(checked) => handleUpdateVariantHasImage(variant.id, checked)}
                          />
                        </div>
                        <Input 
                          value={variant.name}
                          onChange={(e) => handleUpdateVariantName(variant.id, e.target.value)}
                          placeholder="Ví dụ: MKT-PAGE 1 năm"
                          className="mt-2"
                        />
                      </div>

                      <div>
                        <Label className="text-sm">Tùy chọn <span className="text-red-500">*</span></Label>
                        {variant.options.map((option: any, oIndex: number) => (
                          <div key={option.id} className="flex items-center gap-2 mt-2">
                            <Input 
                              value={option.value}
                              onChange={(e) => handleUpdateOptionValue(variant.id, option.id, e.target.value)}
                              placeholder="Ví dụ: Gói hỗ trợ 1 năm"
                              className="flex-1"
                            />
                            {variant.options.length > 1 && (
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleRemoveOption(variant.id, option.id)}
                              >
                                <X className="w-4 h-4 text-gray-400" />
                              </Button>
                            )}
                          </div>
                        ))}
                        <button 
                          type="button"
                          onClick={() => handleAddOption(variant.id)}
                          className="text-sm text-[#3e79f7] hover:underline mt-2"
                        >
                          + Thêm giá trị
                        </button>
                      </div>
                    </div>
                  ))}

                  <button 
                    type="button"
                    onClick={handleAddVariant}
                    className="text-sm text-[#3e79f7] hover:underline"
                  >
                    + Thêm biến thể
                  </button>

                  {/* Danh sách biến thể */}
                  {variantCombinations.length > 0 && (
                    <div className="mt-4">
                      <Label className="text-sm font-semibold">Danh sách biến thể <span className="text-red-500">*</span></Label>
                      <div className="border rounded-lg mt-2 overflow-hidden">
                        <Table>
                          <TableHeader>
                            <TableRow className="bg-gray-50">
                              <TableHead className="text-xs">{variants[0]?.name || 'Biến thể'}</TableHead>
                              <TableHead className="text-xs">Giá bán lẻ</TableHead>
                              <TableHead className="text-xs">Số lượng</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {variantCombinations.map((combo) => (
                              <TableRow key={combo.id}>
                                <TableCell className="text-sm">{combo.optionValue}</TableCell>
                                <TableCell>
                                  <Input 
                                    type="number"
                                    value={combo.price}
                                    onChange={(e) => {
                                      setVariantCombinations(prev => prev.map(c => 
                                        c.id === combo.id ? { ...c, price: e.target.value } : c
                                      ))
                                    }}
                                    className="h-8 text-sm"
                                  />
                                </TableCell>
                                <TableCell>
                                  <Input 
                                    type="number"
                                    value={combo.quantity}
                                    onChange={(e) => {
                                      setVariantCombinations(prev => prev.map(c => 
                                        c.id === combo.id ? { ...c, quantity: e.target.value } : c
                                      ))
                                    }}
                                    className="h-8 text-sm"
                                  />
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={()=>{setShowProductModal(false); resetProductForm()}}>Hủy</Button>
              <Button onClick={handleSaveProduct}>Đồng ý</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Add/Edit Category Modal */}
        <Dialog open={showCategoryModal} onOpenChange={setShowCategoryModal}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{editingCategory ? 'Sửa thể loại' : 'Thêm thể loại'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-3 px-6">
              <div>
                <Label>Tên thể loại</Label>
                <Input 
                  value={categoryForm.name} 
                  onChange={(e:any)=>setCategoryForm(prev=>({...prev,name:e.target.value}))} 
                  placeholder="Nhập tên thể loại..."
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={()=>setShowCategoryModal(false)}>Hủy</Button>
              <Button onClick={handleSaveCategory}>Đồng ý</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Category Confirm Dialog */}
        <Dialog open={showDeleteCategoryConfirm} onOpenChange={setShowDeleteCategoryConfirm}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Xác nhận xóa</DialogTitle>
            </DialogHeader>
            <div className="py-4 px-6">
              <p className="text-sm text-gray-600">Bạn có muốn xóa thể loại sản phẩm này? Các sản phẩm thuộc thể loại sản phẩm này sẽ bị xóa theo?</p>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={()=>setShowDeleteCategoryConfirm(false)}>Hủy</Button>
              <Button variant="destructive" onClick={confirmDeleteCategory}>Xóa</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </>
    )
  }

  return (
    <div className="flex min-h-[600px]">
      {/* Sidebar Menu - Fixed */}
      <div className="w-52 border-r border-[#e6ebf1] pr-3 sticky top-0 self-start">
        <nav className="space-y-0.5">
          {/* 1. Thiết Lập (Công ty) */}
          <button
            onClick={() => setActiveTab('company')}
            className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
              activeTab === 'company'
                ? 'text-[#3e79f7] bg-[#f0f7ff]'
                : 'text-[#455560] hover:text-[#3e79f7] hover:bg-[#f8f9fa]'
            }`}
          >
            <Wrench className="w-4 h-4" />
            Thiết lập
          </button>
          {/* 2. Phân quyền */}
          <button
            onClick={() => setActiveTab('permissions')}
            className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
              activeTab === 'permissions'
                ? 'text-[#3e79f7] bg-[#f0f7ff]'
                : 'text-[#455560] hover:text-[#3e79f7] hover:bg-[#f8f9fa]'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            Phân quyền
          </button>
          {/* 3. Dịch vụ (Sản phẩm) */}
          <button
            onClick={() => setActiveTab('products')}
            className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
              activeTab === 'products'
                ? 'text-[#3e79f7] bg-[#f0f7ff]'
                : 'text-[#455560] hover:text-[#3e79f7] hover:bg-[#f8f9fa]'
            }`}
          >
            <Package className="w-4 h-4" />
            Sản phẩm
          </button>
          {/* 4. Bán hàng (Quy trình) */}
          <button
            onClick={() => setActiveTab('workflow')}
            className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
              activeTab === 'workflow'
                ? 'text-[#3e79f7] bg-[#f0f7ff]'
                : 'text-[#455560] hover:text-[#3e79f7] hover:bg-[#f8f9fa]'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            Bán hàng
          </button>
          {/* 5. Thông báo */}
          <button
            onClick={() => setActiveTab('notifications')}
            disabled
            className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
              activeTab === 'notifications'
                ? 'text-[#3e79f7] bg-[#f0f7ff]'
                : 'text-[#455560] hover:text-[#3e79f7] hover:bg-[#f8f9fa]'
            } disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-[#455560]`}
          >
            <Bell className="w-4 h-4" />
            Thông báo
          </button>
          {/* 6. Lịch sử */}
          <button
            onClick={() => setActiveTab('history')}
            className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
              activeTab === 'history'
                ? 'text-[#3e79f7] bg-[#f0f7ff]'
                : 'text-[#455560] hover:text-[#3e79f7] hover:bg-[#f8f9fa]'
            }`}
          >
            <History className="w-4 h-4" />
            Lịch sử
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 pl-6">
        {activeTab === 'company' && <CompanyManagement />}
        
        {/* Phân quyền - 2 tabs: Vai trò, Gán quyền */}
        {activeTab === 'permissions' && (
          <div>
            <Tabs defaultValue="roles" className="space-y-6">
              <TabsList className="inline-flex w-auto -mt-6 -ml-6">
                <TabsTrigger value="roles" className="uppercase">Vai trò</TabsTrigger>
                <TabsTrigger value="assign" className="uppercase">Gán quyền</TabsTrigger>
              </TabsList>

              <TabsContent value="roles" className="space-y-0">
                <RoleManagementNew />
              </TabsContent>

              <TabsContent value="assign" className="space-y-0">
                <AssignPermissionContent />
              </TabsContent>
            </Tabs>
          </div>
        )}
        
        {/* Sản phẩm - hiển thị ProductManagement */}
        {activeTab === 'products' && (
          <div>
            <ProductManagement />
          </div>
        )}
        
        {/* Bán hàng - 3 tabs: Quy trình, ds, Nhãn */}
        {activeTab === 'workflow' && (
          <div>
            <Tabs defaultValue="process" className="space-y-6">
              <TabsList className="inline-flex w-auto -mt-6 -ml-6">
                <TabsTrigger value="process" className="uppercase">Quy trình</TabsTrigger>
                <TabsTrigger value="distribution" className="uppercase">Phân bố leads</TabsTrigger>
                <TabsTrigger value="customerRanking" className="uppercase">Phân hạng khách hàng</TabsTrigger>
                <TabsTrigger value="labels" className="uppercase">Nhãn gán</TabsTrigger>
              </TabsList>

              <TabsContent value="process" className="space-y-4">
                <WorkflowManagement />
              </TabsContent>

              <TabsContent value="distribution" className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-[#1a3353]">Phân bổ Leads</h2>
                    <p className="text-sm text-[#455560]">Cài đặt quy tắc phân bổ leads tự động cho nhóm bán hàng</p>
                  </div>
                  <Button onClick={() => setShowAddDistributionRule(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Thêm quy tắc
                  </Button>
                </div>
                <Card>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      {/* Rule 1 */}
                      <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                        <div className="flex items-center space-x-4">
                          <div className="w-3 h-3 rounded-full bg-green-500" />
                          <div>
                            <h4 className="font-medium text-gray-900">Phân bổ leads website</h4>
                            <p className="text-sm text-gray-500">Tự động phân bổ leads từ website cho team sales</p>
                            <div className="flex items-center space-x-2 mt-1">
                              <Badge variant="outline" className="text-xs">Xoay vòng</Badge>
                              <Badge variant="secondary" className="text-xs">Phòng Sales</Badge>
                              <Badge variant="outline" className="text-xs">Phòng ban</Badge>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="text-right text-sm">
                            <p className="font-medium">145</p>
                            <p className="text-gray-500">leads được phân</p>
                          </div>
                          <Button variant="outline" size="sm" onClick={() => setShowEditDistributionRule(true)}><Edit2 className="w-4 h-4" /></Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="text-red-600 hover:text-red-700"
                            onClick={() => {
                              setRuleToDelete('rule-1')
                              setShowDeleteDistributionRuleModal(true)
                            }}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                          <Switch defaultChecked />
                        </div>
                      </div>
                      {/* Rule 2 */}
                      <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                        <div className="flex items-center space-x-4">
                          <div className="w-3 h-3 rounded-full bg-green-500" />
                          <div>
                            <h4 className="font-medium text-gray-900">Leads VIP tự động</h4>
                            <p className="text-sm text-gray-500">Phân bổ leads có điểm cao cho Team Sales A và B</p>
                            <div className="flex items-center space-x-2 mt-1">
                              <Badge variant="outline" className="text-xs">Theo tải</Badge>
                              <Badge variant="secondary" className="text-xs">Team Sales A, Team Sales B</Badge>
                              <Badge variant="outline" className="text-xs">Team</Badge>
                              <Badge className="text-xs bg-blue-100 text-blue-800">2 đối tượng</Badge>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="text-right text-sm">
                            <p className="font-medium">78</p>
                            <p className="text-gray-500">leads được phân</p>
                          </div>
                          <Button variant="outline" size="sm" onClick={() => setShowEditDistributionRule(true)}><Edit2 className="w-4 h-4" /></Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="text-red-600 hover:text-red-700"
                            onClick={() => {
                              setRuleToDelete('rule-2')
                              setShowDeleteDistributionRuleModal(true)
                            }}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                          <Switch defaultChecked />
                        </div>
                      </div>
                      {/* Rule 3 */}
                      <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                        <div className="flex items-center space-x-4">
                          <div className="w-3 h-3 rounded-full bg-gray-400" />
                          <div>
                            <h4 className="font-medium text-gray-900">Leads Zalo OA</h4>
                            <p className="text-sm text-gray-500">Phân bổ leads từ Zalo OA cho telesales</p>
                            <div className="flex items-center space-x-2 mt-1">
                              <Badge variant="outline" className="text-xs">Ngẫu nhiên</Badge>
                              <Badge variant="secondary" className="text-xs">Nguyễn Văn A, Trần Thị B</Badge>
                              <Badge variant="outline" className="text-xs">Cá nhân</Badge>
                              <Badge className="text-xs bg-blue-100 text-blue-800">2 đối tượng</Badge>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="text-right text-sm">
                            <p className="font-medium">234</p>
                            <p className="text-gray-500">leads được phân</p>
                          </div>
                          <Button variant="outline" size="sm" onClick={() => setShowEditDistributionRule(true)}><Edit2 className="w-4 h-4" /></Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="text-red-600 hover:text-red-700"
                            onClick={() => {
                              setRuleToDelete('rule-3')
                              setShowDeleteDistributionRuleModal(true)
                            }}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                          <Switch />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="customerRanking" className="space-y-4">
                <div className="space-y-6">
                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-lg font-semibold text-[#1a3353]">Cài đặt phân hạng khách hàng</h2>
                      <p className="text-sm text-[#455560]">Tiêu chí và ngưỡng phân loại khách hàng</p>
                    </div>
                  </div>

                  {/* Ranking Cards */}
                  <div className="flex flex-wrap gap-4">
                    {/* Kim Cương */}
                    <div className="flex flex-col justify-between rounded-lg px-6 py-5 min-w-[200px] flex-1 bg-gradient-to-br from-purple-600 to-pink-500 text-white shadow-lg relative">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="absolute top-2 right-2 p-1 rounded hover:bg-white/20">
                            <MoreVertical className="w-4 h-4 text-white" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => setEditingTier('diamond')}>
                            <Eye className="w-4 h-4 mr-2" />
                            Xem và chỉnh sửa
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                      <div>
                        <p className="text-base font-semibold text-white mb-2">Kim Cương</p>
                        <p className="text-3xl font-extrabold text-white mb-1">45</p>
                        <p className="text-sm text-white/80">khách hàng</p>
                        <div className="mt-3 pt-3 border-t border-white/20">
                          <p className="text-xs text-white/90">Chi tiêu: ≥ {customerRankingData.diamond.totalSpend.toLocaleString()} VND</p>
                          <p className="text-xs text-white/90">Đơn hàng: ≥ {customerRankingData.diamond.orderCount} đơn</p>
                        </div>
                      </div>
                    </div>

                    {/* Vàng */}
                    <div className="flex flex-col justify-between rounded-lg px-6 py-5 min-w-[200px] flex-1 bg-gradient-to-br from-yellow-500 to-amber-400 text-white shadow-lg relative">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="absolute top-2 right-2 p-1 rounded hover:bg-white/20">
                            <MoreVertical className="w-4 h-4 text-white" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => setEditingTier('gold')}>
                            <Eye className="w-4 h-4 mr-2" />
                            Xem và chỉnh sửa
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                      <div>
                        <p className="text-base font-semibold text-white mb-2">Vàng</p>
                        <p className="text-3xl font-extrabold text-white mb-1">128</p>
                        <p className="text-sm text-white/80">khách hàng</p>
                        <div className="mt-3 pt-3 border-t border-white/20">
                          <p className="text-xs text-white/90">Chi tiêu: ≥ {customerRankingData.gold.totalSpend.toLocaleString()} VND</p>
                          <p className="text-xs text-white/90">Đơn hàng: ≥ {customerRankingData.gold.orderCount} đơn</p>
                        </div>
                      </div>
                    </div>

                    {/* Bạc */}
                    <div className="flex flex-col justify-between rounded-lg px-6 py-5 min-w-[200px] flex-1 bg-gradient-to-br from-gray-400 to-slate-500 text-white shadow-lg relative">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="absolute top-2 right-2 p-1 rounded hover:bg-white/20">
                            <MoreVertical className="w-4 h-4 text-white" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => setEditingTier('silver')}>
                            <Eye className="w-4 h-4 mr-2" />
                            Xem và chỉnh sửa
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                      <div>
                        <p className="text-base font-semibold text-white mb-2">Bạc</p>
                        <p className="text-3xl font-extrabold text-white mb-1">356</p>
                        <p className="text-sm text-white/80">khách hàng</p>
                        <div className="mt-3 pt-3 border-t border-white/20">
                          <p className="text-xs text-white/90">Chi tiêu: ≥ {customerRankingData.silver.totalSpend.toLocaleString()} VND</p>
                          <p className="text-xs text-white/90">Đơn hàng: ≥ {customerRankingData.silver.orderCount} đơn</p>
                        </div>
                      </div>
                    </div>

                    {/* Đồng */}
                    <div className="flex flex-col justify-between rounded-lg px-6 py-5 min-w-[200px] flex-1 bg-gradient-to-br from-orange-500 to-amber-600 text-white shadow-lg relative">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="absolute top-2 right-2 p-1 rounded hover:bg-white/20">
                            <MoreVertical className="w-4 h-4 text-white" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => setEditingTier('bronze')}>
                            <Eye className="w-4 h-4 mr-2" />
                            Xem và chỉnh sửa
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                      <div>
                        <p className="text-base font-semibold text-white mb-2">Đồng</p>
                        <p className="text-3xl font-extrabold text-white mb-1">892</p>
                        <p className="text-sm text-white/80">khách hàng</p>
                        <div className="mt-3 pt-3 border-t border-white/20">
                          <p className="text-xs text-white/90">Chi tiêu: ≥ {customerRankingData.bronze.totalSpend.toLocaleString()} VND</p>
                          <p className="text-xs text-white/90">Đơn hàng: ≥ {customerRankingData.bronze.orderCount} đơn</p>
                        </div>
                      </div>
                    </div>

                    {/* Mới */}
                    <div className="flex flex-col justify-between rounded-lg px-6 py-5 min-w-[200px] flex-1 bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg relative">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="absolute top-2 right-2 p-1 rounded hover:bg-white/20">
                            <MoreVertical className="w-4 h-4 text-white" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => setEditingTier('new')}>
                            <Eye className="w-4 h-4 mr-2" />
                            Xem và chỉnh sửa
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                      <div>
                        <p className="text-base font-semibold text-white mb-2">Mới</p>
                        <p className="text-3xl font-extrabold text-white mb-1">1,245</p>
                        <p className="text-sm text-white/80">khách hàng</p>
                        <div className="mt-3 pt-3 border-t border-white/20">
                          <p className="text-xs text-white/90">Khách hàng mới đăng ký</p>
                          <p className="text-xs text-white/90">Chưa có đơn hàng</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Edit Panel for Diamond */}
                  {editingTier === 'diamond' && (
                    <div className="border border-purple-200 rounded-lg p-6 bg-gradient-to-r from-purple-50 to-pink-50">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-bold text-purple-800">Kim Cương (Diamond)</h3>
                          <p className="text-sm text-purple-600">Khách hàng VIP cao cấp nhất</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button size="sm" className="bg-[#3e79f7] text-white border border-[#3e79f7] rounded-[10px] hover:bg-[#699dff]" onClick={() => setEditingTier(null)}>
                            <Save className="w-4 h-4 mr-1" />
                            Lưu
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => setEditingTier(null)}>Đóng</Button>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                          <h4 className="font-semibold text-purple-700">Tiêu chí chính:</h4>
                          <div className="space-y-3">
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-purple-600 w-24">Tổng chi tiêu:</span>
                              <Input type="number" value={customerRankingData.diamond.totalSpend} onChange={(e) => handleRankingChange('diamond', 'totalSpend', Number(e.target.value))} className="flex-1" />
                              <span className="text-sm text-purple-600">VND</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-purple-600 w-24">Số đơn hàng:</span>
                              <Input type="number" value={customerRankingData.diamond.orderCount} onChange={(e) => handleRankingChange('diamond', 'orderCount', Number(e.target.value))} className="flex-1" />
                              <span className="text-sm text-purple-600">đơn</span>
                            </div>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <h4 className="font-semibold text-purple-700">Đặc quyền:</h4>
                            <button onClick={() => addBenefit('diamond')} className="text-purple-600 hover:text-purple-800"><Plus className="w-4 h-4" /></button>
                          </div>
                          <div className="space-y-2">
                            {customerRankingData.diamond.benefits.map((benefit, index) => (
                              <div key={index} className="flex items-center gap-2">
                                <Input value={benefit} onChange={(e) => updateBenefit('diamond', index, e.target.value)} className="flex-1" placeholder="Nhập đặc quyền..." />
                                <button onClick={() => removeBenefit('diamond', index)} className="text-red-500 hover:text-red-700"><X className="w-4 h-4" /></button>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Edit Panel for Gold */}
                  {editingTier === 'gold' && (
                    <div className="border border-yellow-200 rounded-lg p-6 bg-gradient-to-r from-yellow-50 to-amber-50">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-bold text-yellow-800">Vàng (Gold)</h3>
                          <p className="text-sm text-yellow-600">Khách hàng trung thành cao</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button size="sm" className="bg-[#3e79f7] text-white border border-[#3e79f7] rounded-[10px] hover:bg-[#699dff]" onClick={() => setEditingTier(null)}>
                            <Save className="w-4 h-4 mr-1" />
                            Lưu
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => setEditingTier(null)}>Đóng</Button>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                          <h4 className="font-semibold text-yellow-700">Tiêu chí chính:</h4>
                          <div className="space-y-3">
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-yellow-600 w-24">Tổng chi tiêu:</span>
                              <Input type="number" value={customerRankingData.gold.totalSpend} onChange={(e) => handleRankingChange('gold', 'totalSpend', Number(e.target.value))} className="flex-1" />
                              <span className="text-sm text-yellow-600">VND</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-yellow-600 w-24">Số đơn hàng:</span>
                              <Input type="number" value={customerRankingData.gold.orderCount} onChange={(e) => handleRankingChange('gold', 'orderCount', Number(e.target.value))} className="flex-1" />
                              <span className="text-sm text-yellow-600">đơn</span>
                            </div>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <h4 className="font-semibold text-yellow-700">Đặc quyền:</h4>
                            <button onClick={() => addBenefit('gold')} className="text-yellow-600 hover:text-yellow-800"><Plus className="w-4 h-4" /></button>
                          </div>
                          <div className="space-y-2">
                            {customerRankingData.gold.benefits.map((benefit, index) => (
                              <div key={index} className="flex items-center gap-2">
                                <Input value={benefit} onChange={(e) => updateBenefit('gold', index, e.target.value)} className="flex-1" placeholder="Nhập đặc quyền..." />
                                <button onClick={() => removeBenefit('gold', index)} className="text-red-500 hover:text-red-700"><X className="w-4 h-4" /></button>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Edit Panel for Silver */}
                  {editingTier === 'silver' && (
                    <div className="border border-gray-200 rounded-lg p-6 bg-gradient-to-r from-gray-50 to-slate-50">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-bold text-gray-800">Bạc (Silver)</h3>
                          <p className="text-sm text-gray-600">Khách hàng ổn định</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button size="sm" className="bg-[#3e79f7] text-white border border-[#3e79f7] rounded-[10px] hover:bg-[#699dff]" onClick={() => setEditingTier(null)}>
                            <Save className="w-4 h-4 mr-1" />
                            Lưu
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => setEditingTier(null)}>Đóng</Button>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                          <h4 className="font-semibold text-gray-700">Tiêu chí chính:</h4>
                          <div className="space-y-3">
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-gray-600 w-24">Tổng chi tiêu:</span>
                              <Input type="number" value={customerRankingData.silver.totalSpend} onChange={(e) => handleRankingChange('silver', 'totalSpend', Number(e.target.value))} className="flex-1" />
                              <span className="text-sm text-gray-600">VND</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-gray-600 w-24">Số đơn hàng:</span>
                              <Input type="number" value={customerRankingData.silver.orderCount} onChange={(e) => handleRankingChange('silver', 'orderCount', Number(e.target.value))} className="flex-1" />
                              <span className="text-sm text-gray-600">đơn</span>
                            </div>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <h4 className="font-semibold text-gray-700">Đặc quyền:</h4>
                            <button onClick={() => addBenefit('silver')} className="text-gray-600 hover:text-gray-800"><Plus className="w-4 h-4" /></button>
                          </div>
                          <div className="space-y-2">
                            {customerRankingData.silver.benefits.map((benefit, index) => (
                              <div key={index} className="flex items-center gap-2">
                                <Input value={benefit} onChange={(e) => updateBenefit('silver', index, e.target.value)} className="flex-1" placeholder="Nhập đặc quyền..." />
                                <button onClick={() => removeBenefit('silver', index)} className="text-red-500 hover:text-red-700"><X className="w-4 h-4" /></button>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Edit Panel for Bronze */}
                  {editingTier === 'bronze' && (
                    <div className="border border-orange-200 rounded-lg p-6 bg-gradient-to-r from-orange-50 to-amber-50">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-bold text-orange-800">Đồng (Bronze)</h3>
                          <p className="text-sm text-orange-600">Khách hàng mới/cơ bản</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button size="sm" className="bg-[#3e79f7] text-white border border-[#3e79f7] rounded-[10px] hover:bg-[#699dff]" onClick={() => setEditingTier(null)}>
                            <Save className="w-4 h-4 mr-1" />
                            Lưu
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => setEditingTier(null)}>Đóng</Button>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                          <h4 className="font-semibold text-orange-700">Tiêu chí chính:</h4>
                          <div className="space-y-3">
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-orange-600 w-24">Tổng chi tiêu:</span>
                              <Input type="number" value={customerRankingData.bronze.totalSpend} onChange={(e) => handleRankingChange('bronze', 'totalSpend', Number(e.target.value))} className="flex-1" />
                              <span className="text-sm text-orange-600">VND</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-orange-600 w-24">Số đơn hàng:</span>
                              <Input type="number" value={customerRankingData.bronze.orderCount} onChange={(e) => handleRankingChange('bronze', 'orderCount', Number(e.target.value))} className="flex-1" />
                              <span className="text-sm text-orange-600">đơn</span>
                            </div>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <h4 className="font-semibold text-orange-700">Đặc quyền:</h4>
                            <button onClick={() => addBenefit('bronze')} className="text-orange-600 hover:text-orange-800"><Plus className="w-4 h-4" /></button>
                          </div>
                          <div className="space-y-2">
                            {customerRankingData.bronze.benefits.map((benefit, index) => (
                              <div key={index} className="flex items-center gap-2">
                                <Input value={benefit} onChange={(e) => updateBenefit('bronze', index, e.target.value)} className="flex-1" placeholder="Nhập đặc quyền..." />
                                <button onClick={() => removeBenefit('bronze', index)} className="text-red-500 hover:text-red-700"><X className="w-4 h-4" /></button>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Edit Panel for New */}
                  {editingTier === 'new' && (
                    <div className="border border-blue-200 rounded-lg p-6 bg-gradient-to-r from-blue-50 to-indigo-50">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-bold text-blue-800">Mới (New)</h3>
                          <p className="text-sm text-blue-600">Khách hàng tiềm năng</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button size="sm" className="bg-[#3e79f7] text-white border border-[#3e79f7] rounded-[10px] hover:bg-[#699dff]" onClick={() => setEditingTier(null)}>
                            <Save className="w-4 h-4 mr-1" />
                            Lưu
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => setEditingTier(null)}>Đóng</Button>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                          <h4 className="font-semibold text-blue-700">Tiêu chí chính:</h4>
                          <div className="space-y-3">
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-blue-600 w-24">Tổng chi tiêu:</span>
                              <Input type="number" value={customerRankingData.new.totalSpend} onChange={(e) => handleRankingChange('new', 'totalSpend', Number(e.target.value))} className="flex-1" />
                              <span className="text-sm text-blue-600">VND</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-blue-600 w-24">Số đơn hàng:</span>
                              <Input type="number" value={customerRankingData.new.orderCount} onChange={(e) => handleRankingChange('new', 'orderCount', Number(e.target.value))} className="flex-1" />
                              <span className="text-sm text-blue-600">đơn</span>
                            </div>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <h4 className="font-semibold text-blue-700">Đặc quyền:</h4>
                            <button onClick={() => addBenefit('new')} className="text-blue-600 hover:text-blue-800"><Plus className="w-4 h-4" /></button>
                          </div>
                          <div className="space-y-2">
                            {customerRankingData.new.benefits.map((benefit, index) => (
                              <div key={index} className="flex items-center gap-2">
                                <Input value={benefit} onChange={(e) => updateBenefit('new', index, e.target.value)} className="flex-1" placeholder="Nhập đặc quyền..." />
                                <button onClick={() => removeBenefit('new', index)} className="text-red-500 hover:text-red-700"><X className="w-4 h-4" /></button>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Quy trình đánh giá */}
                  {!editingTier && (
                    <div className="border border-blue-200 rounded-lg p-6 bg-blue-50">
                      <h3 className="text-lg font-bold text-blue-800 mb-4">Quy trình đánh giá</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-semibold text-blue-700 mb-2">Tần suất cập nhật:</h4>
                          <ul className="text-sm text-blue-600 space-y-1">
                            <li>• Tự động: Mỗi đơn hàng mới</li>
                            <li>• Định kỳ: Cuối mỗi tháng</li>
                            <li>• Thủ công: Khi có yêu cầu đặc biệt</li>
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-semibold text-blue-700 mb-2">Yếu tố bổ sung:</h4>
                          <ul className="text-sm text-blue-600 space-y-1">
                            <li>• Phản hồi khách hàng</li>
                            <li>• Mức độ tương tác</li>
                            <li>• Giới thiệu khách hàng mới</li>
                            <li>• Tham gia sự kiện</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="labels" className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-[#1a3353]">Quản lý nhãn</h2>
                    <p className="text-sm text-[#455560]">Tạo và quản lý nhãn trong hệ thống</p>
                  </div>
                  <Button onClick={() => {
                    setSelectedTag(null)
                    setNewTagForm({ name: '', color: '#EF4444', scope: 'global', isActive: true })
                    setShowTagModal(true)
                  }}>
                    <Plus className="w-4 h-4 mr-2" />
                    Tạo nhãn mới
                  </Button>
                </div>
                <Card>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      {/* Tag: VIP */}
                      <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                        <div className="flex items-center space-x-4">
                          <div className="w-4 h-4 rounded" style={{ backgroundColor: '#F59E0B' }} />
                          <div>
                            <div className="flex items-center space-x-2">
                              <h4 className="font-medium">VIP</h4>
                            </div>
                            <div className="flex items-center space-x-2 mt-1">
                              <Badge className="bg-indigo-100 text-indigo-800 text-xs">Toàn cục</Badge>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditTag({
                              id: 'vip',
                              name: 'VIP',
                              color: '#F59E0B',
                              scope: 'global',
                              isActive: true,
                              isDefault: false,
                              category: 'customer',
                              autoAssign: {
                                enabled: false,
                                conditions: []
                              },
                              createdBy: 'admin',
                              createdAt: new Date().toISOString()
                            })}
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-600 hover:text-red-700"
                            onClick={() => {
                              setTagToDelete('vip')
                              setShowDeleteTagModal(true)
                            }}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      {/* Tag: Tiềm năng cao */}
                      <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                        <div className="flex items-center space-x-4">
                          <div className="w-4 h-4 rounded" style={{ backgroundColor: '#10B981' }} />
                          <div>
                            <div className="flex items-center space-x-2">
                              <h4 className="font-medium">Tiềm năng cao</h4>
                              <Badge variant="outline" className="text-xs"><Star className="w-3 h-3 mr-1" />Mặc định</Badge>
                            </div>
                            <div className="flex items-center space-x-2 mt-1">
                              <Badge className="bg-indigo-100 text-indigo-800 text-xs">Toàn cục</Badge>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditTag({
                              id: 'tiem-nang-cao',
                              name: 'Tiềm năng cao',
                              color: '#10B981',
                              scope: 'global',
                              isActive: true,
                              isDefault: true,
                              category: 'lead',
                              autoAssign: {
                                enabled: false,
                                conditions: []
                              },
                              createdBy: 'admin',
                              createdAt: new Date().toISOString()
                            })}
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-600 hover:text-red-700"
                            onClick={() => {
                              setTagToDelete('tiem-nang-cao')
                              setShowDeleteTagModal(true)
                            }}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      {/* Tag: Deal lớn */}
                      <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                        <div className="flex items-center space-x-4">
                          <div className="w-4 h-4 rounded" style={{ backgroundColor: '#EF4444' }} />
                          <div>
                            <div className="flex items-center space-x-2">
                              <h4 className="font-medium">Deal lớn</h4>
                            </div>
                            <div className="flex items-center space-x-2 mt-1">
                              <Badge className="bg-indigo-100 text-indigo-800 text-xs">Toàn cục</Badge>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditTag({
                              id: 'deal-lon',
                              name: 'Deal lớn',
                              color: '#EF4444',
                              scope: 'global',
                              isActive: true,
                              isDefault: false,
                              category: 'deal',
                              autoAssign: {
                                enabled: false,
                                conditions: []
                              },
                              createdBy: 'admin',
                              createdAt: new Date().toISOString()
                            })}
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-600 hover:text-red-700"
                            onClick={() => {
                              setTagToDelete('deal-lon')
                              setShowDeleteTagModal(true)
                            }}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      {/* Tag: Khẩn cấp */}
                      <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                        <div className="flex items-center space-x-4">
                          <div className="w-4 h-4 rounded" style={{ backgroundColor: '#DC2626' }} />
                          <div>
                            <div className="flex items-center space-x-2">
                              <h4 className="font-medium">Khẩn cấp</h4>
                            </div>
                            <div className="flex items-center space-x-2 mt-1">
                              <Badge className="bg-indigo-100 text-indigo-800 text-xs">Toàn cục</Badge>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditTag({
                              id: 'khan-cap',
                              name: 'Khẩn cấp',
                              color: '#DC2626',
                              scope: 'global',
                              isActive: true,
                              isDefault: false,
                              category: 'task',
                              autoAssign: {
                                enabled: false,
                                conditions: []
                              },
                              createdBy: 'admin',
                              createdAt: new Date().toISOString()
                            })}
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-600 hover:text-red-700"
                            onClick={() => {
                              setTagToDelete('khan-cap')
                              setShowDeleteTagModal(true)
                            }}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      {/* Tag: Team A */}
                      <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                        <div className="flex items-center space-x-4">
                          <div className="w-4 h-4 rounded" style={{ backgroundColor: '#3B82F6' }} />
                          <div>
                            <div className="flex items-center space-x-2">
                              <h4 className="font-medium">Team A</h4>
                            </div>
                            <div className="flex items-center space-x-2 mt-1">
                              <Badge className="bg-cyan-100 text-cyan-800 text-xs">Nhóm</Badge>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button variant="outline" size="sm"><Edit2 className="w-4 h-4" /></Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="text-red-600 hover:text-red-700"
                            onClick={() => {
                              setTagToDelete('team-a')
                              setShowDeleteTagModal(true)
                            }}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        )}
        
        {/* Thông báo - 3 tabs: Mẫu nội dung, Quy tắc, Nhật ký */}
        {activeTab === 'notifications' && (
          <div>
            <Tabs defaultValue="templates" className="space-y-6">
              <TabsList className="inline-flex w-auto -mt-6 -ml-6">
                <TabsTrigger value="templates" className="uppercase">Mẫu nội dung</TabsTrigger>
                <TabsTrigger value="rules" className="uppercase">Quy tắc</TabsTrigger>
                <TabsTrigger value="logs" className="uppercase">Nhật ký</TabsTrigger>
              </TabsList>

              <TabsContent value="templates" className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-[#1a3353]">Mẫu nội dung thông báo</h2>
                    <p className="text-sm text-[#455560]">Quản lý các mẫu tin nhắn và email</p>
                  </div>
                  <Button size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Thêm mẫu
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Chào mừng khách hàng mới</CardTitle>
                      <CardDescription>Email</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-[#455560]">Xin chào {'{customer_name}'}, cảm ơn bạn đã quan tâm...</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Nhắc lịch hẹn</CardTitle>
                      <CardDescription>SMS</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-[#455560]">Nhắc nhở: Bạn có lịch hẹn vào {'{appointment_time}'}...</p>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="rules" className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-[#1a3353]">Quy tắc thông báo</h2>
                    <p className="text-sm text-[#455560]">Cấu hình điều kiện gửi thông báo tự động</p>
                  </div>
                  <Button size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Thêm quy tắc
                  </Button>
                </div>
                <Card>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h4 className="font-medium">Lead mới từ Website</h4>
                          <p className="text-sm text-[#455560]">Gửi email chào mừng khi có lead mới</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h4 className="font-medium">Nhắc follow-up</h4>
                          <p className="text-sm text-[#455560]">Nhắc nhân viên sau 3 ngày không liên hệ</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h4 className="font-medium">Deal thắng</h4>
                          <p className="text-sm text-[#455560]">Thông báo khi deal chuyển sang Won</p>
                        </div>
                        <Switch />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="logs" className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-[#1a3353]">Nhật ký thông báo</h2>
                    <p className="text-sm text-[#455560]">Lịch sử các thông báo đã gửi</p>
                  </div>
                </div>
                <Card>
                  <CardContent className="pt-6">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <Mail className="w-4 h-4 text-[#3e79f7]" />
                          <div>
                            <p className="text-sm font-medium">Email: Chào mừng khách hàng mới</p>
                            <p className="text-xs text-[#455560]">Gửi đến: nguyenvana@email.com</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge className="bg-green-100 text-green-800">Đã gửi</Badge>
                          <p className="text-xs text-[#455560] mt-1">2 phút trước</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <Bell className="w-4 h-4 text-[#3e79f7]" />
                          <div>
                            <p className="text-sm font-medium">Push: Nhắc follow-up lead</p>
                            <p className="text-xs text-[#455560]">Gửi đến: Trần Văn B</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge className="bg-green-100 text-green-800">Đã gửi</Badge>
                          <p className="text-xs text-[#455560] mt-1">15 phút trước</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        )}
        
        {activeTab === 'interface' && <InterfaceManagement />}
        {activeTab === 'integrations' && <IntegrationManagement />}
        {activeTab === 'templates' && <DataTemplateManagement />}
        {activeTab === 'history' && <SystemHistoryManagement />}
      </div>

      {/* Add Distribution Rule Modal - rendered at root level */}
      <Dialog open={showAddDistributionRule} onOpenChange={setShowAddDistributionRule}>
        <DialogContent className="max-w-xl p-0 max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader className="px-6 pt-6 pb-4 border-b border-[#e6ebf1] shrink-0">
            <DialogTitle className="text-lg font-semibold text-[#1a3353]">Thêm quy tắc phân bổ leads</DialogTitle>
            <DialogDescription className="text-sm text-[#455560]">
              Tạo quy tắc mới để phân bổ leads tự động cho nhóm bán hàng
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-5 px-6 py-4 overflow-y-auto flex-1">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="rule-name-main" className="text-sm font-medium">
                  Tên quy tắc <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="rule-name-main"
                  placeholder="Nhập tên quy tắc"
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label htmlFor="assignment-type-main" className="text-sm font-medium">
                  Loại phân bổ <span className="text-red-500">*</span>
                </Label>
                <Select onValueChange={(value) => setSelectedAssignmentType(value)} value={selectedAssignmentType || 'department'}>
                  <SelectTrigger className="mt-1.5">
                    <SelectValue placeholder="Theo phòng ban" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="department">Theo phòng ban</SelectItem>
                    <SelectItem value="team">Theo team</SelectItem>
                    <SelectItem value="individual">Cá nhân</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Department/Team/Individual selection */}
            <div className="space-y-2 max-h-32 overflow-y-auto border rounded-lg p-3">
              {(selectedAssignmentType === 'department' || !selectedAssignmentType) && (
                <>
                  <div className="flex items-center space-x-3">
                    <input type="checkbox" id="dept-support-main" className="w-4 h-4 rounded border-gray-300" />
                    <label htmlFor="dept-support-main" className="text-sm">Phòng support</label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <input type="checkbox" id="dept-qa-main" className="w-4 h-4 rounded border-gray-300" />
                    <label htmlFor="dept-qa-main" className="text-sm">Phòng kiểm tra chất lượng</label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <input type="checkbox" id="dept-dev-main" className="w-4 h-4 rounded border-gray-300" />
                    <label htmlFor="dept-dev-main" className="text-sm">Phòng Dev CRM</label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <input type="checkbox" id="dept-sales-main" className="w-4 h-4 rounded border-gray-300" />
                    <label htmlFor="dept-sales-main" className="text-sm">Phòng sale</label>
                  </div>
                </>
              )}
                
              {selectedAssignmentType === 'team' && (
                <>
                  <div className="flex items-center space-x-3">
                    <input type="checkbox" id="team-sales-a-main" className="w-4 h-4 rounded border-gray-300" />
                    <label htmlFor="team-sales-a-main" className="text-sm">Team Sales A</label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <input type="checkbox" id="team-sales-b-main" className="w-4 h-4 rounded border-gray-300" />
                    <label htmlFor="team-sales-b-main" className="text-sm">Team Sales B</label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <input type="checkbox" id="team-telesales-1-main" className="w-4 h-4 rounded border-gray-300" />
                    <label htmlFor="team-telesales-1-main" className="text-sm">Team Telesales 1</label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <input type="checkbox" id="team-telesales-2-main" className="w-4 h-4 rounded border-gray-300" />
                    <label htmlFor="team-telesales-2-main" className="text-sm">Team Telesales 2</label>
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
                      { id: 'user-nguyen-van-a-main', name: 'Nguyễn Văn A', team: 'sales-a', title: 'Sales Manager', teamName: 'Team Sales A' },
                      { id: 'user-tran-thi-b-main', name: 'Trần Thị B', team: 'sales-a', title: 'Sales Executive', teamName: 'Team Sales A' },
                      { id: 'user-le-van-c-main', name: 'Lê Văn C', team: 'telesales-1', title: 'Telesales Specialist', teamName: 'Team Telesales 1' },
                      { id: 'user-pham-thi-d-main', name: 'Phạm Thị D', team: 'sales-b', title: 'Account Manager', teamName: 'Team Sales B' },
                      { id: 'user-hoang-van-e-main', name: 'Hoàng Văn E', team: 'sales-a', title: 'Senior Sales', teamName: 'Team Sales A' },
                      { id: 'user-vo-thi-f-main', name: 'Võ Thị F', team: 'customer-success', title: 'Customer Success', teamName: 'Team Customer Success' },
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
                </div>
              )}
            </div>

            <div>
              <Label htmlFor="rule-description-main" className="text-sm font-medium">Mô tả</Label>
              <Input
                id="rule-description-main"
                placeholder="Mô tả ngắn về quy tắc này"
                className="mt-1.5"
              />
            </div>

            <div>
              <Label className="text-sm font-medium">Phương thức phân bổ</Label>
              <div className="grid grid-cols-3 gap-3 mt-2">
                <div className="border-2 border-blue-500 rounded-lg p-3 cursor-pointer bg-blue-50">
                  <div className="flex flex-col items-center text-center">
                    <input type="radio" name="distribution-method-main" value="round_robin" defaultChecked className="mb-2" />
                    <h4 className="font-medium text-sm">Xoay vòng</h4>
                    <p className="text-xs text-gray-500 mt-1">Phân đều cho từng thành viên</p>
                  </div>
                </div>
                <div className="border rounded-lg p-3 cursor-pointer hover:bg-gray-50 hover:border-gray-300">
                  <div className="flex flex-col items-center text-center">
                    <input type="radio" name="distribution-method-main" value="load_based" className="mb-2" />
                    <h4 className="font-medium text-sm">Theo tải</h4>
                    <p className="text-xs text-gray-500 mt-1">Dựa trên khối lượng công việc</p>
                  </div>
                </div>
                <div className="border rounded-lg p-3 cursor-pointer hover:bg-gray-50 hover:border-gray-300">
                  <div className="flex flex-col items-center text-center">
                    <input type="radio" name="distribution-method-main" value="random" className="mb-2" />
                    <h4 className="font-medium text-sm">Ngẫu nhiên</h4>
                    <p className="text-xs text-gray-500 mt-1">Phân bổ hoàn toàn ngẫu nhiên</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium">Điều kiện áp dụng</Label>
              <div className="grid grid-cols-2 gap-4 mt-2">
                <div>
                  <Label htmlFor="lead-source-main" className="text-xs text-gray-600">Nguồn leads</Label>
                  <Select>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Chọn nguồn" />
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
                  <Label htmlFor="region-main" className="text-xs text-gray-600">Khu vực</Label>
                  <Select>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Chọn khu vực" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tất cả</SelectItem>
                      <SelectItem value="north">Miền Bắc</SelectItem>
                      <SelectItem value="central">Miền Trung</SelectItem>
                      <SelectItem value="south">Miền Nam</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-3">
                <div>
                  <Label htmlFor="time-range-main" className="text-xs text-gray-600">Thời gian áp dụng</Label>
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
                </div>
                <div>
                  <Label htmlFor="priority-main" className="text-xs text-gray-600">Độ ưu tiên</Label>
                  <Input
                    id="priority-main"
                    type="number"
                    placeholder="0"
                    defaultValue="0"
                    className="mt-1"
                  />
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="px-6 py-4 border-t border-[#e6ebf1] gap-2 sm:gap-0 shrink-0">
            <Button variant="outline" onClick={() => setShowAddDistributionRule(false)}>
              Hủy
            </Button>
            <Button onClick={() => {
              // TODO: Implement add distribution rule logic
              setShowAddDistributionRule(false)
            }}>
              Đồng ý
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Distribution Rule Modal - rendered at root level */}
      <Dialog open={showEditDistributionRule} onOpenChange={setShowEditDistributionRule}>
        <DialogContent className="max-w-xl p-0 max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader className="px-6 pt-6 pb-4 border-b border-[#e6ebf1] shrink-0">
            <DialogTitle className="text-lg font-semibold text-[#1a3353]">Chỉnh sửa quy tắc phân bổ leads</DialogTitle>
            <DialogDescription className="text-sm text-[#455560]">
              Cập nhật thông tin quy tắc phân bổ leads
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-5 px-6 py-4 overflow-y-auto flex-1">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-rule-name" className="text-sm font-medium">
                  Tên quy tắc <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="edit-rule-name"
                  placeholder="Nhập tên quy tắc"
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label htmlFor="edit-assignment-type" className="text-sm font-medium">
                  Loại phân bổ <span className="text-red-500">*</span>
                </Label>
                <Select onValueChange={(value) => setSelectedAssignmentType(value)} value={selectedAssignmentType || 'department'}>
                  <SelectTrigger className="mt-1.5">
                    <SelectValue placeholder="Theo phòng ban" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="department">Theo phòng ban</SelectItem>
                    <SelectItem value="team">Theo team</SelectItem>
                    <SelectItem value="individual">Cá nhân</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Department/Team/Individual selection */}
            <div className="space-y-2 max-h-32 overflow-y-auto border rounded-lg p-3">
              {(selectedAssignmentType === 'department' || !selectedAssignmentType) && (
                <>
                  <div className="flex items-center space-x-3">
                    <input type="checkbox" id="edit-dept-support" className="w-4 h-4 rounded border-gray-300" />
                    <label htmlFor="edit-dept-support" className="text-sm">Phòng support</label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <input type="checkbox" id="edit-dept-qa" className="w-4 h-4 rounded border-gray-300" />
                    <label htmlFor="edit-dept-qa" className="text-sm">Phòng kiểm tra chất lượng</label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <input type="checkbox" id="edit-dept-dev" className="w-4 h-4 rounded border-gray-300" />
                    <label htmlFor="edit-dept-dev" className="text-sm">Phòng Dev CRM</label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <input type="checkbox" id="edit-dept-sales" className="w-4 h-4 rounded border-gray-300" />
                    <label htmlFor="edit-dept-sales" className="text-sm">Phòng sale</label>
                  </div>
                </>
              )}
                
              {selectedAssignmentType === 'team' && (
                <>
                  <div className="flex items-center space-x-3">
                    <input type="checkbox" id="edit-team-sales-a" className="w-4 h-4 rounded border-gray-300" />
                    <label htmlFor="edit-team-sales-a" className="text-sm">Team Sales A</label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <input type="checkbox" id="edit-team-sales-b" className="w-4 h-4 rounded border-gray-300" />
                    <label htmlFor="edit-team-sales-b" className="text-sm">Team Sales B</label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <input type="checkbox" id="edit-team-telesales-1" className="w-4 h-4 rounded border-gray-300" />
                    <label htmlFor="edit-team-telesales-1" className="text-sm">Team Telesales 1</label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <input type="checkbox" id="edit-team-telesales-2" className="w-4 h-4 rounded border-gray-300" />
                    <label htmlFor="edit-team-telesales-2" className="text-sm">Team Telesales 2</label>
                  </div>
                </>
              )}

              {selectedAssignmentType === 'individual' && (
                <div className="space-y-3">
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
                  <div className="space-y-2">
                    {[
                      { id: 'edit-user-nguyen-van-a', name: 'Nguyễn Văn A', team: 'sales-a', title: 'Sales Manager', teamName: 'Team Sales A' },
                      { id: 'edit-user-tran-thi-b', name: 'Trần Thị B', team: 'sales-a', title: 'Sales Executive', teamName: 'Team Sales A' },
                      { id: 'edit-user-le-van-c', name: 'Lê Văn C', team: 'telesales-1', title: 'Telesales Specialist', teamName: 'Team Telesales 1' },
                      { id: 'edit-user-pham-thi-d', name: 'Phạm Thị D', team: 'sales-b', title: 'Account Manager', teamName: 'Team Sales B' },
                      { id: 'edit-user-hoang-van-e', name: 'Hoàng Văn E', team: 'sales-a', title: 'Senior Sales', teamName: 'Team Sales A' },
                      { id: 'edit-user-vo-thi-f', name: 'Võ Thị F', team: 'customer-success', title: 'Customer Success', teamName: 'Team Customer Success' },
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
                </div>
              )}
            </div>

            <div>
              <Label htmlFor="edit-rule-description" className="text-sm font-medium">Mô tả</Label>
              <Input
                id="edit-rule-description"
                placeholder="Mô tả ngắn về quy tắc này"
                className="mt-1.5"
              />
            </div>

            <div>
              <Label className="text-sm font-medium">Phương thức phân bổ</Label>
              <div className="grid grid-cols-3 gap-3 mt-2">
                <div className="border-2 border-blue-500 rounded-lg p-3 cursor-pointer bg-blue-50">
                  <div className="flex flex-col items-center text-center">
                    <input type="radio" name="edit-distribution-method" value="round_robin" defaultChecked className="mb-2" />
                    <h4 className="font-medium text-sm">Xoay vòng</h4>
                    <p className="text-xs text-gray-500 mt-1">Phân đều cho từng thành viên</p>
                  </div>
                </div>
                <div className="border rounded-lg p-3 cursor-pointer hover:bg-gray-50 hover:border-gray-300">
                  <div className="flex flex-col items-center text-center">
                    <input type="radio" name="edit-distribution-method" value="load_based" className="mb-2" />
                    <h4 className="font-medium text-sm">Theo tải</h4>
                    <p className="text-xs text-gray-500 mt-1">Dựa trên khối lượng công việc</p>
                  </div>
                </div>
                <div className="border rounded-lg p-3 cursor-pointer hover:bg-gray-50 hover:border-gray-300">
                  <div className="flex flex-col items-center text-center">
                    <input type="radio" name="edit-distribution-method" value="random" className="mb-2" />
                    <h4 className="font-medium text-sm">Ngẫu nhiên</h4>
                    <p className="text-xs text-gray-500 mt-1">Phân bổ hoàn toàn ngẫu nhiên</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium">Điều kiện áp dụng</Label>
              <div className="grid grid-cols-2 gap-4 mt-2">
                <div>
                  <Label htmlFor="edit-lead-source" className="text-xs text-gray-600">Nguồn leads</Label>
                  <Select>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Chọn nguồn" />
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
                  <Label htmlFor="edit-region" className="text-xs text-gray-600">Khu vực</Label>
                  <Select>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Chọn khu vực" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tất cả</SelectItem>
                      <SelectItem value="north">Miền Bắc</SelectItem>
                      <SelectItem value="central">Miền Trung</SelectItem>
                      <SelectItem value="south">Miền Nam</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-3">
                <div>
                  <Label htmlFor="edit-time-range" className="text-xs text-gray-600">Thời gian áp dụng</Label>
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
                </div>
                <div>
                  <Label htmlFor="edit-priority" className="text-xs text-gray-600">Độ ưu tiên</Label>
                  <Input
                    id="edit-priority"
                    type="number"
                    placeholder="0"
                    defaultValue="0"
                    className="mt-1"
                  />
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="px-6 py-4 border-t border-[#e6ebf1] gap-2 sm:gap-0 shrink-0">
            <Button variant="outline" onClick={() => setShowEditDistributionRule(false)}>
              Hủy
            </Button>
            <Button onClick={() => {
              // TODO: Implement edit distribution rule logic
              setShowEditDistributionRule(false)
            }}>
              Đồng ý
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Distribution Rule Confirmation Modal - rendered at root level */}
      <Dialog open={showDeleteDistributionRuleModal} onOpenChange={setShowDeleteDistributionRuleModal}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-[#1a3353]">Xác nhận xóa</DialogTitle>
          </DialogHeader>
          <div className="px-6 py-4">
            <p className="text-sm text-gray-600">Bạn có muốn xóa quy tắc phân bổ này không?</p>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setShowDeleteDistributionRuleModal(false)}>
              Hủy
            </Button>
            <Button 
              variant="destructive"
              onClick={() => {
                // TODO: Delete rule logic
                setShowDeleteDistributionRuleModal(false)
                setRuleToDelete(null)
              }}
            >
              Xóa
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Sales Stage Modals - rendered at root level */}
      {/* Add Sales Stage Modal */}
      <Dialog open={showStageModal} onOpenChange={setShowStageModal}>
        <DialogContent className="max-w-md p-0">
          <DialogHeader className="px-6 pt-6 pb-4 border-b border-[#e6ebf1]">
            <DialogTitle className="text-lg font-semibold text-[#1a3353]">Thêm mới giai đoạn</DialogTitle>
            <DialogDescription className="text-sm text-[#455560]">Tạo giai đoạn mới trong quy trình bán hàng</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 px-6 py-4">
            <div>
              <Label htmlFor="stage-name" className="text-sm font-medium">
                Tên giai đoạn <span className="text-red-500">*</span>
              </Label>
              <Input
                id="stage-name"
                placeholder="Nhập giai đoạn"
                className="mt-1.5"
                value={newStageForm.name}
                onChange={(e) => setNewStageForm(prev => ({ ...prev, name: e.target.value }))}
              />
              {!newStageForm.name && (
                <p className="text-xs text-red-500 mt-1">Vui lòng nhập tên giai đoạn</p>
              )}
            </div>

            <div>
              <Label htmlFor="stage-value" className="text-sm font-medium">
                Value <span className="text-red-500">*</span>
              </Label>
              <Input
                id="stage-value"
                placeholder="Nhập giá trị (VD: QUALIFIED, NEGOTIATION...)"
                className="mt-1.5"
                value={newStageForm.value}
                onChange={(e) => setNewStageForm(prev => ({ ...prev, value: e.target.value.toUpperCase() }))}
                disabled={newStageForm.isAuto}
              />
              <div className="flex items-center space-x-2 mt-2">
                <input
                  type="checkbox"
                  id="stage-auto"
                  checked={newStageForm.isAuto}
                  onChange={(e) => {
                    const isAuto = e.target.checked
                    setNewStageForm(prev => ({
                      ...prev,
                      isAuto,
                      value: isAuto ? prev.name.toUpperCase().replace(/\s+/g, '_') : prev.value
                    }))
                  }}
                  className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <Label htmlFor="stage-auto" className="text-sm cursor-pointer">Tự động</Label>
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium">
                Màu sắc <span className="text-red-500">*</span>
              </Label>
              <div
                className="mt-1.5 h-10 rounded-md border border-gray-300 cursor-pointer hover:border-gray-400 transition-colors"
                style={{ backgroundColor: newStageForm.color }}
                onClick={() => openColorPicker('add')}
              />
              {!newStageForm.color && (
                <p className="text-xs text-red-500 mt-1">Vui lòng chọn màu sắc</p>
              )}
            </div>

            <div>
              <Label htmlFor="stage-description" className="text-sm font-medium">Mô tả</Label>
              <Textarea
                id="stage-description"
                placeholder="Nhập mô tả"
                className="mt-1.5 min-h-[80px] resize-none"
                value={newStageForm.description}
                onChange={(e) => setNewStageForm(prev => ({ ...prev, description: e.target.value }))}
              />
            </div>
          </div>

          <DialogFooter className="px-6 py-4 border-t border-[#e6ebf1] gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => {
              setShowStageModal(false)
              setNewStageForm({
                name: '',
                value: '',
                isAuto: true,
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
              disabled={!newStageForm.name.trim()}
            >
              Đồng ý
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Sales Stage Modal */}
      <Dialog open={showEditStageModal} onOpenChange={setShowEditStageModal}>
        <DialogContent className="max-w-md p-0">
          <DialogHeader className="px-6 pt-6 pb-4 border-b border-[#e6ebf1]">
            <DialogTitle className="text-lg font-semibold text-[#1a3353]">Chỉnh sửa giai đoạn</DialogTitle>
            <DialogDescription className="text-sm text-[#455560]">Cập nhật thông tin giai đoạn bán hàng</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 px-6 py-4">
            <div>
              <Label htmlFor="edit-stage-name" className="text-sm font-medium">
                Tên giai đoạn <span className="text-red-500">*</span>
              </Label>
              <Input
                id="edit-stage-name"
                placeholder="Nhập giai đoạn"
                className="mt-1.5"
                value={editStageForm.name}
                onChange={(e) => setEditStageForm(prev => ({ ...prev, name: e.target.value }))}
              />
              {!editStageForm.name && (
                <p className="text-xs text-red-500 mt-1">Vui lòng nhập tên giai đoạn</p>
              )}
            </div>

            <div>
              <Label htmlFor="edit-stage-value" className="text-sm font-medium">
                Value <span className="text-red-500">*</span>
              </Label>
              <Input
                id="edit-stage-value"
                placeholder="Nhập giá trị (VD: QUALIFIED, NEGOTIATION...)"
                className="mt-1.5"
                value={editStageForm.value}
                onChange={(e) => setEditStageForm(prev => ({ ...prev, value: e.target.value.toUpperCase() }))}
                disabled={editStageForm.isAuto}
              />
              <div className="flex items-center space-x-2 mt-2">
                <input
                  type="checkbox"
                  id="edit-stage-auto"
                  checked={editStageForm.isAuto}
                  onChange={(e) => {
                    const isAuto = e.target.checked
                    setEditStageForm(prev => ({
                      ...prev,
                      isAuto,
                      value: isAuto ? prev.name.toUpperCase().replace(/\s+/g, '_') : prev.value
                    }))
                  }}
                  className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <Label htmlFor="edit-stage-auto" className="text-sm cursor-pointer">Tự động</Label>
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium">
                Màu sắc <span className="text-red-500">*</span>
              </Label>
              <div
                className="mt-1.5 h-10 rounded-md border border-gray-300 cursor-pointer hover:border-gray-400 transition-colors"
                style={{ backgroundColor: editStageForm.color }}
                onClick={() => openColorPicker('edit')}
              />
              {!editStageForm.color && (
                <p className="text-xs text-red-500 mt-1">Vui lòng chọn màu sắc</p>
              )}
            </div>

            <div>
              <Label htmlFor="edit-stage-description" className="text-sm font-medium">Mô tả</Label>
              <Textarea
                id="edit-stage-description"
                placeholder="Nhập mô tả"
                className="mt-1.5 min-h-[80px] resize-none"
                value={editStageForm.description}
                onChange={(e) => setEditStageForm(prev => ({ ...prev, description: e.target.value }))}
              />
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setShowEditStageModal(false)}>
              Hủy
            </Button>
            <Button
              onClick={() => {
                if (!selectedStage || !editStageForm.name.trim()) return

                setSalesStages(prev => prev.map(stage =>
                  stage.id === selectedStage.id
                    ? { ...stage, name: editStageForm.name, description: editStageForm.description, color: editStageForm.color }
                    : stage
                ))
                setShowEditStageModal(false)
                setSelectedStage(null)
              }}
              disabled={!editStageForm.name.trim()}
            >
              Đồng ý
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Color Picker Modal */}
      <Dialog open={showColorPicker} onOpenChange={setShowColorPicker}>
        <DialogContent className="max-w-xs p-4">
          <div className="space-y-3">
            {/* Color gradient picker */}
            <div
              className="w-full h-36 rounded-md cursor-crosshair relative"
              style={{
                background: `linear-gradient(to bottom, white, transparent), linear-gradient(to right, transparent, hsl(${tempColor.h}, 100%, 50%))`,
                backgroundColor: `hsl(${tempColor.h}, 100%, 50%)`
              }}
              onClick={handleColorPickerChange}
              onMouseMove={(e) => {
                if (e.buttons === 1) handleColorPickerChange(e)
              }}
            >
              {/* Indicator */}
              <div
                className="absolute w-4 h-4 rounded-full border-2 border-white shadow-md transform -translate-x-1/2 -translate-y-1/2"
                style={{
                  left: `${tempColor.s}%`,
                  top: `${100 - tempColor.l}%`,
                  backgroundColor: tempColor.hex
                }}
              />
            </div>

            {/* Hue slider */}
            <input
              type="range"
              min="0"
              max="360"
              value={tempColor.h}
              onChange={handleHueChange}
              className="w-full h-3 rounded-md cursor-pointer"
              style={{
                background: 'linear-gradient(to right, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000)'
              }}
            />

            {/* Color values */}
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <Input
                  value={tempColor.hex}
                  onChange={(e) => handleHexInputChange(e.target.value)}
                  className="text-xs h-8 font-mono"
                  maxLength={7}
                />
                <p className="text-xs text-center text-gray-500 mt-0.5">Hex</p>
              </div>
              <div className="w-12">
                <Input
                  value={Math.round(parseInt(tempColor.hex.slice(1, 3), 16))}
                  className="text-xs h-8 text-center"
                  readOnly
                />
                <p className="text-xs text-center text-gray-500 mt-0.5">R</p>
              </div>
              <div className="w-12">
                <Input
                  value={Math.round(parseInt(tempColor.hex.slice(3, 5), 16))}
                  className="text-xs h-8 text-center"
                  readOnly
                />
                <p className="text-xs text-center text-gray-500 mt-0.5">G</p>
              </div>
              <div className="w-12">
                <Input
                  value={Math.round(parseInt(tempColor.hex.slice(5, 7), 16))}
                  className="text-xs h-8 text-center"
                  readOnly
                />
                <p className="text-xs text-center text-gray-500 mt-0.5">B</p>
              </div>
              <div className="w-12">
                <Input
                  value="100"
                  className="text-xs h-8 text-center"
                  readOnly
                />
                <p className="text-xs text-center text-gray-500 mt-0.5">A</p>
              </div>
            </div>

            {/* Preset colors */}
            <div className="grid grid-cols-8 gap-1.5">
              {[
                '#EF4444', '#F97316', '#F59E0B', '#EAB308',
                '#84CC16', '#22C55E', '#10B981', '#14B8A6',
                '#06B6D4', '#0EA5E9', '#3B82F6', '#6366F1',
                '#8B5CF6', '#A855F7', '#D946EF', '#EC4899',
                '#F43F5E', '#FFFFFF', '#9CA3AF', '#000000'
              ].map((color) => (
                <button
                  key={color}
                  className={`w-6 h-6 rounded border ${
                    tempColor.hex.toUpperCase() === color.toUpperCase()
                      ? 'border-gray-900 ring-1 ring-gray-900'
                      : 'border-gray-200 hover:border-gray-400'
                  }`}
                  style={{ backgroundColor: color }}
                  onClick={() => {
                    const hsl = hexToHsl(color)
                    setTempColor({ ...hsl, hex: color })
                  }}
                />
              ))}
            </div>

            {/* Preview and apply */}
            <div className="flex items-center gap-2 pt-2">
              <div
                className="flex-1 h-8 rounded border"
                style={{ backgroundColor: tempColor.hex }}
              />
              <Button size="sm" onClick={applyColor}>
                Chọn
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Simple Delete Stage Confirmation Modal */}
      <Dialog open={showSimpleDeleteStageModal} onOpenChange={setShowSimpleDeleteStageModal}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-[#1a3353]">Xác nhận xóa</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-gray-600">Bạn có muốn xóa giai đoạn này không?</p>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => {
              setShowSimpleDeleteStageModal(false)
              setStageToDelete(null)
            }}>
              Hủy
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (stageToDelete) {
                  setSalesStages(prev => prev.filter(s => s.id !== stageToDelete.id))
                }
                setShowSimpleDeleteStageModal(false)
                setStageToDelete(null)
              }}
            >
              Xóa
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

          <div className="space-y-4 px-6">
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

      {/* Tag Creation/Edit Modal */}
      <Dialog open={showTagModal} onOpenChange={setShowTagModal}>
        <DialogContent className="max-w-md p-0">
          <DialogHeader className="px-6 pt-6 pb-4 border-b border-[#e6ebf1]">
            <DialogTitle className="text-lg font-semibold text-[#1a3353]">
              {selectedTag ? 'Chỉnh sửa nhãn' : 'Thêm mới nhãn mới'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-5 px-6 py-4">
            <div>
              <Label htmlFor="tag-name" className="text-sm font-medium">
                Tên nhãn <span className="text-red-500">*</span>
              </Label>
              <Input
                id="tag-name"
                placeholder="Nhập tên nhãn"
                className="mt-1.5"
                value={selectedTag?.name || newTagForm.name}
                onChange={(e) => setNewTagForm(prev => ({ ...prev, name: e.target.value }))}
              />
              {!newTagForm.name && !selectedTag && (
                <p className="text-xs text-red-500 mt-1">Vui lòng nhập tên</p>
              )}
            </div>

            <div>
              <Label className="text-sm font-medium">
                Màu sắc <span className="text-red-500">*</span>
              </Label>
              <div
                className="mt-1.5 h-10 rounded-md border border-gray-300 cursor-pointer hover:border-gray-400 transition-colors"
                style={{ backgroundColor: selectedTag?.color || newTagForm.color }}
                onClick={() => openColorPicker('tag')}
              />
            </div>

            <div>
              <Label className="text-sm font-medium">
                Phạm vi <span className="text-red-500">*</span>
              </Label>
              <Select
                defaultValue={selectedTag?.scope || newTagForm.scope}
                onValueChange={(value) => setNewTagForm(prev => ({ ...prev, scope: value }))}
              >
                <SelectTrigger className="mt-1.5">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="global">Toàn cục</SelectItem>
                  <SelectItem value="team">Nhóm</SelectItem>
                  <SelectItem value="user">Cá nhân</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-3">
              <Switch
                id="is-active"
                checked={selectedTag?.isDefault || newTagForm.isActive}
                onCheckedChange={(checked) => setNewTagForm(prev => ({ ...prev, isActive: checked }))}
              />
              <Label htmlFor="is-active" className="text-sm">Trạng thái hoạt động</Label>
            </div>
          </div>

          <DialogFooter className="px-6 py-4 border-t border-[#e6ebf1] gap-2">
            <Button variant="outline" onClick={() => {
              setShowTagModal(false)
              setNewTagForm({ name: '', color: '#EF4444', scope: 'global', isActive: true })
            }}>
              Hủy
            </Button>
            <Button disabled={!newTagForm.name && !selectedTag}>
              {selectedTag ? 'Cập nhật' : 'Tạo mới'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Tag Confirmation Modal */}
      <Dialog open={showDeleteTagModal} onOpenChange={setShowDeleteTagModal}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-[#1a3353]">Xác nhận xóa</DialogTitle>
          </DialogHeader>
          <div className="px-6 py-4">
            <p className="text-sm text-gray-600">Bạn có muốn xóa nhãn này không?</p>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setShowDeleteTagModal(false)}>
              Hủy
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                // TODO: Delete tag logic
                setShowDeleteTagModal(false)
                setTagToDelete(null)
              }}
            >
              Xóa
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
