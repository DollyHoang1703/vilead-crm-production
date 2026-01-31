'use client'

import React, { useState, useEffect } from 'react'
import CreateTaskModalSimple from './CreateTaskModalSimple'
import TaskDetailModal from './TaskDetailModal'
import CreateEventModalSimple from './CreateEventModalSimple'
import { 
  Plus, 
  Search, 
  Filter, 
  Calendar, 
  Clock, 
  Users, 
  Tag, 
  Bell, 
  CheckCircle, 
  Circle, 
  Play, 
  Pause,
  Edit,
  Trash2,
  Eye,
  MessageSquare,
  Mail,
  Phone,
  AlertTriangle,
  Target,
  FileText,
  Download,
  Upload,
  Settings,
  MoreVertical,
  ChevronDown,
  X,
  Save,
  Send,
  Zap,
  User,
  MapPin,
  Video,
  Coffee,
  Building,
  Star,
  Moon,
  Sun,
  TreePine,
  Grid3X3,
  List,
  Columns,
  ChevronUp,
  TrendingUp,
  BarChart3,
  PieChart,
  ArrowRight,
  TrendingDown,
  MousePointer,
  Info,
  StickyNote
} from 'lucide-react'

// Interfaces
interface TaskTemplate {
  id: string
  title: string
  description: string
  category: 'lead' | 'customer' | 'general'
}

interface CustomView {
  id: string
  name: string
  description?: string
  color: string
  filters: {
    status?: string
    priority?: string
    assignee?: string
    team?: string
    relatedType?: string
  }
  createdAt: string
  createdBy: string
}

interface Task {
  id: string
  title: string
  description: string
  dueDate: string
  priority: 'low' | 'medium' | 'high'
  status: 'pending' | 'in_progress' | 'completed'
  progress: number
  assignedTo: string
  assignedTeam?: string
  tags: string[]
  
  // Related entities
  relatedType?: 'lead' | 'customer' | 'general' | 'order'
  relatedId?: string
  relatedName?: string
  relatedInfo?: {
    phone?: string
    orderNumber?: string
    orderStatus?: string
    customerHistory?: string
  }
  
  // Notes and comments
  internalNotes: string
  progressNotes: TaskProgressNote[]
  
  // Automation
  isAutoCreated: boolean
  autoTrigger?: string
  
  // Reminders
  reminders: TaskReminder[]
  customReminders: CustomReminder[]
  
  // Timestamps and history
  createdAt: string
  createdBy: string
  updatedAt: string
  completedAt?: string
  history: TaskHistory[]
}

interface Employee {
  id: string
  name: string
  email: string
  phone: string
  role: string
  team: string
  isActive: boolean
}

interface Lead {
  id: string
  name: string
  phone: string
  email: string
  stage: string
  assignedTo: string
  tags: string[]
  isVip: boolean
}

interface Order {
  id: string
  orderNumber: string
  customerName: string
  customerPhone: string
  status: string
  paymentStatus: string
  total: number
  assignedTo: string
}

interface Customer {
  id: string
  name: string
  phone: string
  email: string
  type: string
  totalOrders: number
  totalSpent: number
  lastOrderDate: string
}

interface TaskProgressNote {
  id: string
  progress: number
  note: string
  createdAt: string
  createdBy: string
}

interface TaskReminder {
  id: string
  taskId: string
  type: 'zalo' | 'email' | 'app'
  scheduledAt: string
  content: string
  status: 'pending' | 'sent' | 'read' | 'failed'
  sentAt?: string
  readAt?: string
  attempt: number
}

interface CustomReminder {
  id: string
  taskId: string
  scheduleType: 'once' | 'recurring'
  scheduledAt: string
  recurringPattern?: string
  channels: ('zalo' | 'email' | 'app')[]
  content: string
  isActive: boolean
  lastSent?: string
}

interface TaskHistory {
  id: string
  action: string
  details: string
  createdAt: string
  createdBy: string
}

interface CalendarEvent {
  id: string
  title: string
  description: string
  startDate: string
  endDate: string
  startTime: string
  endTime: string
  type: 'task' | 'meeting' | 'internal' | 'personal' | 'holiday'
  priority: 'low' | 'medium' | 'high'
  location?: string
  attendees: string[]
  relatedType?: 'lead' | 'customer' | 'general'
  relatedId?: string
  relatedName?: string
  isAllDay: boolean
  isRecurring: boolean
  recurringPattern?: string
  reminderMinutes: number[]
  color: string
  createdBy: string
  createdAt: string
  updatedAt: string
}

export default function TaskManagement() {
  const [activeTab, setActiveTab] = useState('tasks')
  const [tasks, setTasks] = useState<Task[]>([])
  const [templates, setTemplates] = useState<TaskTemplate[]>([])
  const [employees, setEmployees] = useState<Employee[]>([])
  const [leads, setLeads] = useState<Lead[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [customers, setCustomers] = useState<Customer[]>([])
  
  // Modals
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [showCreateEventModal, setShowCreateEventModal] = useState(false)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [selectedEventDate, setSelectedEventDate] = useState<Date | null>(null)

  // Filters
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [priorityFilter, setPriorityFilter] = useState('')
  const [relatedTypeFilter, setRelatedTypeFilter] = useState('')
  const [assigneeFilter, setAssigneeFilter] = useState('')
  const [tagFilter, setTagFilter] = useState('')
  const [dueDateFilter, setDueDateFilter] = useState('')
  const [dateRangeFilter, setDateRangeFilter] = useState({
    startDate: '',
    endDate: '',
    preset: '' // 'today', 'tomorrow', 'this_week', 'next_week', 'this_month', 'custom'
  })
  const [selectedStatsFilter, setSelectedStatsFilter] = useState<string>('')
  const [selectedTasks, setSelectedTasks] = useState<string[]>([])
  const [showCreateViewModal, setShowCreateViewModal] = useState(false)
  const [customViews, setCustomViews] = useState<CustomView[]>([])
  const [activeViewType, setActiveViewType] = useState<string>('all') // 'all', 'leads', 'customers', 'team_a', 'team_b', 'other', hoặc custom view id
  const [newViewForm, setNewViewForm] = useState({
    name: '',
    description: '',
    color: '#3B82F6',
    filters: {
      status: '',
      priority: '',
      team: '',
      relatedType: ''
    }
  })

  // Task view state
  const [taskView, setTaskView] = useState<'table' | 'kanban'>('table')
  
  // Drag and drop state
  const [draggedTask, setDraggedTask] = useState<Task | null>(null)
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null)
  
  // Column visibility state
  const [visibleColumns, setVisibleColumns] = useState({
    task: true,
    category: true,
    related: true,
    assignee: true,
    dueDate: true,
    priority: true,
    status: true,
    tags: true,
    createdDate: true,
    actions: true
  })

  // Dropdown state
  const [openDropdownTaskId, setOpenDropdownTaskId] = useState<string | null>(null)
  
  const [showColumnSelector, setShowColumnSelector] = useState(false)

  // Initialize sample data
  useEffect(() => {
    initializeSampleData()
  }, [])

  const initializeSampleData = () => {
    // Sample employees
    const sampleEmployees: Employee[] = [
      { id: '1', name: 'Nguyễn Văn An', email: 'an@company.com', phone: '0123456789', role: 'Sales', team: 'Team A', isActive: true },
      { id: '2', name: 'Trần Thị Bình', email: 'binh@company.com', phone: '0123456790', role: 'Sales Manager', team: 'Team B', isActive: true },
      { id: '3', name: 'Lê Văn Cường', email: 'cuong@company.com', phone: '0123456791', role: 'Support', team: 'Team A', isActive: true },
      { id: '4', name: 'Phạm Thị Dung', email: 'dung@company.com', phone: '0123456792', role: 'Sales', team: 'Team B', isActive: true },
      { id: '5', name: 'Hoàng Văn Em', email: 'em@company.com', phone: '0123456793', role: 'Marketing', team: 'Team A', isActive: true },
      { id: '6', name: 'Võ Thị Phương', email: 'phuong@company.com', phone: '0123456794', role: 'Account Manager', team: 'Team B', isActive: true },
      { id: '7', name: 'Đặng Văn Giang', email: 'giang@company.com', phone: '0123456795', role: 'Technical Support', team: 'Team A', isActive: true },
      { id: '8', name: 'Bùi Thị Hồng', email: 'hong@company.com', phone: '0123456796', role: 'Customer Success', team: 'Team B', isActive: true }
    ]

    // Sample leads
    const sampleLeads: Lead[] = [
      { id: '1', name: 'Công ty ABC', phone: '0987654321', email: 'contact@abc.com', stage: 'Tư vấn', assignedTo: '1', tags: ['VIP'], isVip: true },
      { id: '2', name: 'Nguyễn Văn Đức', phone: '0987654322', email: 'duc@email.com', stage: 'Báo giá', assignedTo: '2', tags: [], isVip: false },
      { id: '3', name: 'Công ty DEF Technology', phone: '0987654324', email: 'info@def.com', stage: 'Demo', assignedTo: '4', tags: ['Tech', 'Hot'], isVip: true },
      { id: '4', name: 'Lê Thị Mai', phone: '0987654325', email: 'mai.le@gmail.com', stage: 'Tư vấn', assignedTo: '1', tags: ['SME'], isVip: false },
      { id: '5', name: 'Công ty GHI Solutions', phone: '0987654326', email: 'sales@ghi.com', stage: 'Chốt deal', assignedTo: '6', tags: ['VIP', 'Enterprise'], isVip: true },
      { id: '6', name: 'Trần Văn Nam', phone: '0987654327', email: 'nam.tran@outlook.com', stage: 'Follow up', assignedTo: '3', tags: [], isVip: false },
      { id: '7', name: 'Startup JKL', phone: '0987654328', email: 'hello@jkl.io', stage: 'Tư vấn', assignedTo: '5', tags: ['Startup', 'Tech'], isVip: false },
      { id: '8', name: 'Công ty MNO Group', phone: '0987654329', email: 'contact@mno.vn', stage: 'Báo giá', assignedTo: '2', tags: ['Big Corp'], isVip: true }
    ]

    // Sample orders  
    const sampleOrders: Order[] = [
      { id: '1', orderNumber: 'ORD-001', customerName: 'Công ty ABC', customerPhone: '0987654321', status: 'confirmed', paymentStatus: 'unpaid', total: 50000000, assignedTo: '1' },
      { id: '2', orderNumber: 'ORD-002', customerName: 'Công ty XYZ', customerPhone: '0987654323', status: 'processing', paymentStatus: 'paid', total: 30000000, assignedTo: '2' },
      { id: '3', orderNumber: 'ORD-003', customerName: 'Công ty DEF Technology', customerPhone: '0987654324', status: 'delivered', paymentStatus: 'paid', total: 75000000, assignedTo: '4' },
      { id: '4', orderNumber: 'ORD-004', customerName: 'Công ty GHI Solutions', customerPhone: '0987654326', status: 'confirmed', paymentStatus: 'partial', total: 120000000, assignedTo: '6' },
      { id: '5', orderNumber: 'ORD-005', customerName: 'Startup JKL', customerPhone: '0987654328', status: 'pending', paymentStatus: 'unpaid', total: 15000000, assignedTo: '5' },
      { id: '6', orderNumber: 'ORD-006', customerName: 'Công ty MNO Group', customerPhone: '0987654329', status: 'processing', paymentStatus: 'paid', total: 90000000, assignedTo: '2' }
    ]

    // Sample customers
    const sampleCustomers: Customer[] = [
      { id: '1', name: 'Công ty ABC', phone: '0987654321', email: 'contact@abc.com', type: 'VIP', totalOrders: 5, totalSpent: 250000000, lastOrderDate: '2025-06-01' },
      { id: '2', name: 'Công ty XYZ', phone: '0987654323', email: 'contact@xyz.com', type: 'Regular', totalOrders: 2, totalSpent: 80000000, lastOrderDate: '2025-05-15' },
      { id: '3', name: 'Công ty DEF Technology', phone: '0987654324', email: 'info@def.com', type: 'VIP', totalOrders: 3, totalSpent: 180000000, lastOrderDate: '2025-06-20' },
      { id: '4', name: 'Công ty GHI Solutions', phone: '0987654326', email: 'sales@ghi.com', type: 'Enterprise', totalOrders: 8, totalSpent: 450000000, lastOrderDate: '2025-06-25' },
      { id: '5', name: 'Startup JKL', phone: '0987654328', email: 'hello@jkl.io', type: 'Regular', totalOrders: 1, totalSpent: 15000000, lastOrderDate: '2025-06-10' },
      { id: '6', name: 'Công ty MNO Group', phone: '0987654329', email: 'contact@mno.vn', type: 'VIP', totalOrders: 4, totalSpent: 320000000, lastOrderDate: '2025-06-28' },
      { id: '7', name: 'Doanh nghiệp PQR', phone: '0987654330', email: 'info@pqr.com', type: 'Regular', totalOrders: 2, totalSpent: 60000000, lastOrderDate: '2025-05-20' },
      { id: '8', name: 'Tập đoàn STU', phone: '0987654331', email: 'contact@stu.vn', type: 'Enterprise', totalOrders: 12, totalSpent: 800000000, lastOrderDate: '2025-06-30' }
    ]

    // Sample tasks
    const sampleTasks: Task[] = [
      {
        id: '1',
        title: 'Gọi lead Công ty ABC',
        description: 'Liên hệ tư vấn gói phần mềm quản lý nhân sự',
        dueDate: '2025-07-15T10:00:00',
        priority: 'high',
        status: 'pending',
        progress: 0,
        assignedTo: '1',
        tags: ['Khẩn cấp', 'VIP'],
        relatedType: 'lead',
        relatedId: '1',
        relatedName: 'Công ty ABC',
        relatedInfo: { phone: '0987654321' },
        internalNotes: 'Khách quan tâm đến tính năng chấm công tự động',
        progressNotes: [],
        isAutoCreated: false,
        reminders: [],
        customReminders: [],
        createdAt: '2025-07-01T09:00:00',
        createdBy: '2',
        updatedAt: '2025-07-01T09:00:00',
        history: []
      },
      {
        id: '2',
        title: 'Gửi hợp đồng ORD-001',
        description: 'Gửi hợp đồng phần mềm CRM cho Công ty ABC',
        dueDate: '2025-07-10T15:00:00',
        priority: 'medium',
        status: 'in_progress',
        progress: 50,
        assignedTo: '1',
        tags: ['Hợp đồng'],
        relatedType: 'general',
        relatedId: '1',
        relatedName: 'Hợp đồng ABC',
        relatedInfo: { orderNumber: 'ORD-001', orderStatus: 'confirmed' },
        internalNotes: 'Đã trao đổi với khách về điều khoản thanh toán',
        progressNotes: [],
        isAutoCreated: true,
        autoTrigger: 'order_confirmed',
        reminders: [],
        customReminders: [],
        createdAt: '2025-06-28T16:00:00',
        createdBy: 'system',
        updatedAt: '2025-07-01T14:00:00',
        history: []
      },
      {
        id: '3',
        title: 'Chăm sóc khách hàng VIP',
        description: 'Liên hệ chăm sóc và tư vấn sản phẩm mới',
        dueDate: '2025-07-20T14:00:00',
        priority: 'high',
        status: 'pending',
        progress: 0,
        assignedTo: '2',
        tags: ['VIP', 'Chăm sóc'],
        relatedType: 'customer',
        relatedId: '1',
        relatedName: 'Công ty ABC',
        relatedInfo: { phone: '0987654321' },
        internalNotes: 'Khách hàng đã mua sản phẩm 6 tháng trước',
        progressNotes: [],
        isAutoCreated: false,
        reminders: [],
        customReminders: [],
        createdAt: '2025-07-01T08:30:00',
        createdBy: '1',
        updatedAt: '2025-07-01T08:30:00',
        history: []
      },
      {
        id: '4',
        title: 'Demo sản phẩm cho DEF Technology',
        description: 'Thực hiện demo tính năng quản lý dự án và báo cáo',
        dueDate: '2025-07-03T15:00:00',
        priority: 'high',
        status: 'pending',
        progress: 0,
        assignedTo: '4',
        tags: ['Demo', 'Tech', 'Hot'],
        relatedType: 'lead',
        relatedId: '3',
        relatedName: 'Công ty DEF Technology',
        relatedInfo: { phone: '0987654324' },
        internalNotes: 'Khách yêu cầu demo chi tiết về API integration',
        progressNotes: [],
        isAutoCreated: false,
        reminders: [],
        customReminders: [],
        createdAt: '2025-07-01T10:15:00',
        createdBy: '1',
        updatedAt: '2025-07-01T10:15:00',
        history: []
      },
      {
        id: '5',
        title: 'Follow up lead Lê Thị Mai',
        description: 'Gọi điện follow up sau khi gửi proposal',
        dueDate: '2025-07-02T09:30:00',
        priority: 'medium',
        status: 'pending',
        progress: 0,
        assignedTo: '1',
        tags: ['Follow up', 'SME'],
        relatedType: 'lead',
        relatedId: '4',
        relatedName: 'Lê Thị Mai',
        relatedInfo: { phone: '0987654325' },
        internalNotes: 'Đã gửi proposal vào ngày 30/6, cần follow up',
        progressNotes: [],
        isAutoCreated: false,
        reminders: [],
        customReminders: [],
        createdAt: '2025-07-01T11:00:00',
        createdBy: '3',
        updatedAt: '2025-07-01T11:00:00',
        history: []
      },
      {
        id: '6',
        title: 'Chuẩn bị hợp đồng GHI Solutions',
        description: 'Soạn thảo hợp đồng enterprise cho GHI Solutions',
        dueDate: '2025-07-05T17:00:00',
        priority: 'high',
        status: 'in_progress',
        progress: 30,
        assignedTo: '6',
        tags: ['Hợp đồng', 'Enterprise', 'VIP'],
        relatedType: 'lead',
        relatedId: '5',
        relatedName: 'Công ty GHI Solutions',
        relatedInfo: { phone: '0987654326' },
        internalNotes: 'Khách yêu cầu customization đặc biệt, cần thỏa thuận thêm',
        progressNotes: [],
        isAutoCreated: false,
        reminders: [],
        customReminders: [],
        createdAt: '2025-06-30T14:00:00',
        createdBy: '2',
        updatedAt: '2025-07-01T16:00:00',
        history: []
      },
      {
        id: '7',
        title: 'Technical support cho order ORD-003',
        description: 'Hỗ trợ setup và training cho DEF Technology',
        dueDate: '2025-07-08T10:00:00',
        priority: 'medium',
        status: 'pending',
        progress: 0,
        assignedTo: '7',
        tags: ['Support', 'Training'],
        relatedType: 'general',
        relatedId: '3',
        relatedName: 'Đào tạo sử dụng sản phẩm',
        relatedInfo: { orderNumber: 'ORD-003', orderStatus: 'delivered' },
        internalNotes: 'Khách yêu cầu training cho 20 users',
        progressNotes: [],
        isAutoCreated: true,
        autoTrigger: 'order_delivered',
        reminders: [],
        customReminders: [],
        createdAt: '2025-06-29T09:00:00',
        createdBy: 'system',
        updatedAt: '2025-06-29T09:00:00',
        history: []
      },
      {
        id: '8',
        title: 'Check-in với MNO Group',
        description: 'Gọi điện check tình hình sử dụng sản phẩm',
        dueDate: '2025-07-10T14:00:00',
        priority: 'low',
        status: 'pending',
        progress: 0,
        assignedTo: '8',
        tags: ['Check-in', 'Customer Success'],
        relatedType: 'customer',
        relatedId: '6',
        relatedName: 'Công ty MNO Group',
        relatedInfo: { phone: '0987654329' },
        internalNotes: 'Khách hàng mới sử dụng 1 tháng, cần check satisfaction',
        progressNotes: [],
        isAutoCreated: false,
        reminders: [],
        customReminders: [],
        createdAt: '2025-07-01T08:00:00',
        createdBy: '6',
        updatedAt: '2025-07-01T08:00:00',
        history: []
      },
      {
        id: '9',
        title: 'Tư vấn upgrade cho Startup JKL',
        description: 'Thuyết trình các gói upgrade và add-ons',
        dueDate: '2025-07-12T11:00:00',
        priority: 'medium',
        status: 'pending',
        progress: 0,
        assignedTo: '5',
        tags: ['Upgrade', 'Upsell'],
        relatedType: 'customer',
        relatedId: '5',
        relatedName: 'Startup JKL',
        relatedInfo: { phone: '0987654328' },
        internalNotes: 'Startup đang phát triển nhanh, có nhu cầu mở rộng',
        progressNotes: [],
        isAutoCreated: false,
        reminders: [],
        customReminders: [],
        createdAt: '2025-07-01T13:30:00',
        createdBy: '2',
        updatedAt: '2025-07-01T13:30:00',
        history: []
      },
      {
        id: '10',
        title: 'Xử lý complaint từ khách hàng XYZ',
        description: 'Giải quyết vấn đề về hiệu năng hệ thống',
        dueDate: '2025-07-02T16:00:00',
        priority: 'high',
        status: 'in_progress',
        progress: 70,
        assignedTo: '3',
        tags: ['Urgent', 'Bug Fix', 'Support'],
        relatedType: 'customer',
        relatedId: '2',
        relatedName: 'Công ty XYZ',
        relatedInfo: { phone: '0987654323' },
        internalNotes: 'Đã identify root cause, đang implement fix',
        progressNotes: [],
        isAutoCreated: false,
        reminders: [],
        customReminders: [],
        createdAt: '2025-06-30T18:00:00',
        createdBy: '8',
        updatedAt: '2025-07-01T15:00:00',
        history: []
      },
      {
        id: '11',
        title: 'Báo giá cho Doanh nghiệp PQR',
        description: 'Chuẩn bị báo giá chi tiết cho gói Standard',
        dueDate: '2025-07-04T12:00:00',
        priority: 'medium',
        status: 'completed',
        progress: 100,
        assignedTo: '2',
        tags: ['Báo giá', 'Standard'],
        relatedType: 'lead',
        relatedId: '7',
        relatedName: 'Doanh nghiệp PQR',
        relatedInfo: { phone: '0987654330' },
        internalNotes: 'Đã gửi báo giá và đang chờ phản hồi',
        progressNotes: [],
        isAutoCreated: false,
        reminders: [],
        customReminders: [],
        createdAt: '2025-06-28T10:00:00',
        createdBy: '1',
        updatedAt: '2025-07-01T09:00:00',
        completedAt: '2025-07-01T09:00:00',
        history: []
      },
      {
        id: '12',
        title: 'Onboarding Tập đoàn STU',
        description: 'Hướng dẫn setup và training cho enterprise customer',
        dueDate: '2025-07-15T09:00:00',
        priority: 'high',
        status: 'pending',
        progress: 0,
        assignedTo: '8',
        tags: ['Onboarding', 'Enterprise', 'Training'],
        relatedType: 'customer',
        relatedId: '8',
        relatedName: 'Tập đoàn STU',
        relatedInfo: { phone: '0987654331' },
        internalNotes: 'Enterprise customer với 500+ users, cần plan cẩn thận',
        progressNotes: [],
        isAutoCreated: true,
        autoTrigger: 'enterprise_signup',
        reminders: [],
        customReminders: [],
        createdAt: '2025-06-30T20:00:00',
        createdBy: 'system',
        updatedAt: '2025-06-30T20:00:00',
        history: []
      }
    ]

    // Sample custom views
    const sampleCustomViews: CustomView[] = [
      {
        id: 'cv1',
        name: 'Công việc khẩn cấp',
        description: 'Tất cả công việc có mức độ ưu tiên cao',
        color: '#EF4444',
        filters: {
          priority: 'high'
        },
        createdAt: '2025-06-25T10:00:00',
        createdBy: 'current_user'
      },
      {
        id: 'cv2', 
        name: 'Leads hôm nay',
        description: 'Công việc liên quan đến leads cần hoàn thành hôm nay',
        color: '#10B981',
        filters: {
          relatedType: 'leads',
          status: 'pending'
        },
        createdAt: '2025-06-30T14:30:00',
        createdBy: 'current_user'
      },
      {
        id: 'cv3',
        name: 'Support Tasks',
        description: 'Các công việc hỗ trợ kỹ thuật và khách hàng',
        color: '#F59E0B',
        filters: {
          status: 'pending'
        },
        createdAt: '2025-06-28T09:00:00',
        createdBy: 'current_user'
      },
      {
        id: 'cv4',
        name: 'Đã hoàn thành',
        description: 'Tất cả công việc đã hoàn thành để review',
        color: '#8B5CF6',
        filters: {
          status: 'completed'
        },
        createdAt: '2025-06-26T16:00:00',
        createdBy: 'current_user'
      },
      {
        id: 'cv5',
        name: 'Team A Tasks',
        description: 'Công việc được giao cho Team A',
        color: '#6B7280',
        filters: {
          priority: 'medium'
        },
        createdAt: '2025-06-27T11:30:00',
        createdBy: 'current_user'
      }
    ]

    setEmployees(sampleEmployees)
    setLeads(sampleLeads)
    setOrders(sampleOrders)
    setCustomers(sampleCustomers)
    setTasks(sampleTasks)
    setCustomViews(sampleCustomViews)
  }

  // Utility functions
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount)
  }

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('vi-VN')
  }

  // Drag and Drop handlers
  const handleDragStart = (e: React.DragEvent, task: Task) => {
    setDraggedTask(task)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e: React.DragEvent, column: string) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    setDragOverColumn(column)
  }

  const handleDragLeave = () => {
    setDragOverColumn(null)
  }

  const handleDrop = (e: React.DragEvent, newStatus: string) => {
    e.preventDefault()
    setDragOverColumn(null)
    
    if (draggedTask && draggedTask.status !== newStatus) {
      // Update task status
      setTasks(prevTasks => 
        prevTasks.map(task => 
          task.id === draggedTask.id 
            ? { ...task, status: newStatus as 'pending' | 'in_progress' | 'completed' }
            : task
        )
      )
    }
    
    setDraggedTask(null)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN')
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'Cao'
      case 'medium':
        return 'Trung bình'
      case 'low':
        return 'Thấp'
      default:
        return 'Không xác định'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'in_progress':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Chưa làm'
      case 'in_progress':
        return 'Đang làm'
      case 'completed':
        return 'Hoàn tất'
      default:
        return 'Không xác định'
    }
  }

  const getCategoryColor = (category?: string) => {
    switch (category) {
      case 'lead':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'customer':
        return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'general':
        return 'bg-gray-100 text-gray-800 border-gray-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getCategoryText = (category?: string) => {
    switch (category) {
      case 'lead':
        return 'Lead'
      case 'customer':
        return 'Khách hàng'
      case 'general':
        return 'Công việc chung'
      default:
        return 'Công việc chung'
    }
  }

  // Filter tasks
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = !searchTerm || 
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.relatedName?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = !statusFilter || task.status === statusFilter
    const matchesPriority = !priorityFilter || task.priority === priorityFilter
    const matchesAssignee = !assigneeFilter || task.assignedTo === assigneeFilter
    const matchesTag = !tagFilter || task.tags.some(tag => tag.toLowerCase().includes(tagFilter.toLowerCase()))

    const matchesDueDate = !dueDateFilter || (() => {
      const taskDate = new Date(task.dueDate)
      const today = new Date()
      const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000)
      const weekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)

      switch (dueDateFilter) {
        case 'overdue':
          return taskDate < today && task.status !== 'completed'
        case 'today':
          return taskDate.toDateString() === today.toDateString()
        case 'tomorrow':
          return taskDate.toDateString() === tomorrow.toDateString()
        case 'this_week':
          return taskDate >= today && taskDate <= weekFromNow
        default:
          return true
      }
    })()

    // Date range filter
    const matchesDateRange = (() => {
      if (!dateRangeFilter.preset && !dateRangeFilter.startDate && !dateRangeFilter.endDate) {
        return true
      }

      const taskDate = new Date(task.dueDate)
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      // Handle preset filters
      if (dateRangeFilter.preset) {
        switch (dateRangeFilter.preset) {
          case 'today':
            const todayEnd = new Date(today)
            todayEnd.setHours(23, 59, 59, 999)
            return taskDate >= today && taskDate <= todayEnd
          case 'tomorrow':
            const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000)
            const tomorrowEnd = new Date(tomorrow)
            tomorrowEnd.setHours(23, 59, 59, 999)
            return taskDate >= tomorrow && taskDate <= tomorrowEnd
          case 'this_week':
            const startOfWeek = new Date(today)
            startOfWeek.setDate(today.getDate() - today.getDay())
            const endOfWeek = new Date(startOfWeek)
            endOfWeek.setDate(startOfWeek.getDate() + 6)
            endOfWeek.setHours(23, 59, 59, 999)
            return taskDate >= startOfWeek && taskDate <= endOfWeek
          case 'next_week':
            const nextWeekStart = new Date(today)
            nextWeekStart.setDate(today.getDate() + (7 - today.getDay()))
            const nextWeekEnd = new Date(nextWeekStart)
            nextWeekEnd.setDate(nextWeekStart.getDate() + 6)
            nextWeekEnd.setHours(23, 59, 59, 999)
            return taskDate >= nextWeekStart && taskDate <= nextWeekEnd
          case 'this_month':
            const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
            const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0)
            endOfMonth.setHours(23, 59, 59, 999)
            return taskDate >= startOfMonth && taskDate <= endOfMonth
          default:
            return true
        }
      }

      // Handle custom date range
      if (dateRangeFilter.startDate || dateRangeFilter.endDate) {
        const startDate = dateRangeFilter.startDate ? new Date(dateRangeFilter.startDate) : null
        const endDate = dateRangeFilter.endDate ? new Date(dateRangeFilter.endDate) : null
        
        if (startDate) startDate.setHours(0, 0, 0, 0)
        if (endDate) endDate.setHours(23, 59, 59, 999)

        if (startDate && endDate) {
          return taskDate >= startDate && taskDate <= endDate
        } else if (startDate) {
          return taskDate >= startDate
        } else if (endDate) {
          return taskDate <= endDate
        }
      }

      return true
    })()

    return matchesSearch && matchesStatus && matchesPriority && matchesAssignee && matchesTag && matchesDueDate && matchesDateRange
  })

  // Filter tasks based on selected stats filter
  const getFilteredTasksByStats = (statsFilter: string) => {
    switch (statsFilter) {
      case 'total':
        return tasks
      case 'pending':
        return tasks.filter(t => t.status === 'pending')
      case 'in_progress':
        return tasks.filter(t => t.status === 'in_progress')
      case 'completed':
        return tasks.filter(t => t.status === 'completed')
      case 'overdue':
        return tasks.filter(t => new Date(t.dueDate) < new Date() && t.status !== 'completed')
      case 'urgent_priority':
        return tasks.filter(t => 
          (t.priority === 'high') || 
          (new Date(t.dueDate) <= new Date(Date.now() + 24*60*60*1000) && t.status !== 'completed')
        )
      case 'leads':
        return tasks.filter(t => t.relatedType === 'lead')
      case 'customers':
        return tasks.filter(t => t.relatedType === 'customer')
      case 'other':
        return tasks.filter(t => !t.relatedType || t.relatedType === 'general')
      default:
        return filteredTasks
    }
  }

  // Get tasks to display based on stats filter or regular filters  
  const displayTasks = selectedStatsFilter ? getFilteredTasksByStats(selectedStatsFilter) : filteredTasks

  const handleCreateTask = (newTask: Task) => {
    setTasks(prev => [...prev, newTask])
    
    // Tự động tạo calendar event cho task
    const taskEvent: CalendarEvent = {
      id: `task-${newTask.id}`,
      title: `📋 ${newTask.title}`,
      description: newTask.description,
      startDate: new Date(newTask.dueDate).toISOString().split('T')[0],
      endDate: new Date(newTask.dueDate).toISOString().split('T')[0],
      startTime: new Date(newTask.dueDate).toTimeString().slice(0, 5),
      endTime: new Date(new Date(newTask.dueDate).getTime() + 60*60*1000).toTimeString().slice(0, 5), // +1 hour
      type: 'task' as any,
      priority: newTask.priority,
      location: '',
      attendees: [newTask.assignedTo],
      isAllDay: false,
      isRecurring: false,
      reminderMinutes: [15],
      color: newTask.priority === 'high' ? '#EF4444' : newTask.priority === 'medium' ? '#F59E0B' : '#10B981',
      createdBy: newTask.createdBy,
      createdAt: newTask.createdAt,
      updatedAt: newTask.updatedAt
    }
    
    setCalendarEvents(prev => [...prev, taskEvent])
  }

  const handleUpdateTask = (updatedTask: Task) => {
    setTasks(prev => prev.map(task => task.id === updatedTask.id ? updatedTask : task))
    
    // Cập nhật calendar event tương ứng
    setCalendarEvents(prev => prev.map(event => {
      if (event.id === `task-${updatedTask.id}`) {
        return {
          ...event,
          title: `📋 ${updatedTask.title}`,
          description: updatedTask.description,
          startDate: new Date(updatedTask.dueDate).toISOString().split('T')[0],
          endDate: new Date(updatedTask.dueDate).toISOString().split('T')[0],
          startTime: new Date(updatedTask.dueDate).toTimeString().slice(0, 5),
          endTime: new Date(new Date(updatedTask.dueDate).getTime() + 60*60*1000).toTimeString().slice(0, 5),
          attendees: [updatedTask.assignedTo],
          color: updatedTask.priority === 'high' ? '#EF4444' : updatedTask.priority === 'medium' ? '#F59E0B' : '#10B981',
          updatedAt: updatedTask.updatedAt
        }
      }
      return event
    }))
  }

  const handleCreateEvent = (newEvent: CalendarEvent) => {
    setCalendarEvents(prev => [...prev, newEvent])
    
    // Nếu là meeting với khách hàng, có thể tạo task follow-up tự động
    if (newEvent.type === 'meeting' && newEvent.attendees.length > 0) {
      const followUpTask: Task = {
        id: `followup-${newEvent.id}`,
        title: `Follow up: ${newEvent.title}`,
        description: `Follow up sau cuộc họp: ${newEvent.description}`,
        dueDate: new Date(new Date(newEvent.endDate).getTime() + 24*60*60*1000).toISOString(), // +1 day
        priority: 'medium',
        status: 'pending',
        progress: 0,
        assignedTo: newEvent.attendees[0] || newEvent.createdBy,
        tags: ['follow-up', 'meeting'],
        relatedType: 'general',
        internalNotes: `Tự động tạo từ cuộc họp: ${newEvent.title}`,
        progressNotes: [],
        isAutoCreated: true,
        reminders: [],
        customReminders: [],
        createdAt: new Date().toISOString(),
        createdBy: 'system',
        updatedAt: new Date().toISOString(),
        history: []
      }
      
      // Không tạo calendar event cho follow-up task để tránh loop vô tận
      setTasks(prev => [...prev, followUpTask])
    }
  }

  // Handle stats card click
  const handleStatsCardClick = (filterType: string) => {
    if (selectedStatsFilter === filterType) {
      // If same filter clicked, clear it
      setSelectedStatsFilter('')
    } else {
      // Set new filter and clear other filters
      setSelectedStatsFilter(filterType)
      setSearchTerm('')
      setStatusFilter('')
      setPriorityFilter('')
      setAssigneeFilter('')
      setTagFilter('')
      setDueDateFilter('')
      setDateRangeFilter({ preset: '', startDate: '', endDate: '' })
    }
  }

  // Calculate statistics for overview
  const getTaskStats = () => {
    const total = tasks.length
    const completed = tasks.filter(t => t.status === 'completed').length
    const inProgress = tasks.filter(t => t.status === 'in_progress').length
    const pending = tasks.filter(t => t.status === 'pending').length
    const overdue = tasks.filter(t => new Date(t.dueDate) < new Date() && t.status !== 'completed').length
    
    // Group by priority
    const highPriority = tasks.filter(t => t.priority === 'high').length
    const mediumPriority = tasks.filter(t => t.priority === 'medium').length
    const lowPriority = tasks.filter(t => t.priority === 'low').length
    
    // Group by type
    const leadTasks = tasks.filter(t => t.relatedType === 'lead').length
    const customerTasks = tasks.filter(t => t.relatedType === 'customer').length
    const orderTasks = tasks.filter(t => t.relatedType === 'order').length
    const generalTasks = tasks.filter(t => t.relatedType === 'general').length
    
    // Team performance
    const teamStats = employees.reduce((acc, emp) => {
      const empTasks = tasks.filter(t => t.assignedTo === emp.id)
      const empCompleted = empTasks.filter(t => t.status === 'completed').length
      acc[emp.team] = acc[emp.team] || { total: 0, completed: 0, members: [] }
      acc[emp.team].total += empTasks.length
      acc[emp.team].completed += empCompleted
      if (!acc[emp.team].members.find(m => m.id === emp.id)) {
        acc[emp.team].members.push(emp)
      }
      return acc
    }, {} as Record<string, { total: number, completed: number, members: Employee[] }>)
    
    return {
      total, completed, inProgress, pending, overdue,
      highPriority, mediumPriority, lowPriority,
      leadTasks, customerTasks, orderTasks, generalTasks,
      teamStats,
      completionRate: total > 0 ? Math.round((completed / total) * 100) : 0
    }
  }

  const renderOverview = () => {
    // Calculate report metrics
    const completedTasks = tasks.filter(t => t.status === 'completed')
    const overdueTasks = tasks.filter(t => new Date(t.dueDate) < new Date() && t.status !== 'completed')
    const totalTasksThisMonth = tasks.filter(t => {
      const taskDate = new Date(t.createdAt)
      const now = new Date()
      return taskDate.getMonth() === now.getMonth() && taskDate.getFullYear() === now.getFullYear()
    })
    
    const completionRate = tasks.length > 0 ? Math.round((completedTasks.length / tasks.length) * 100) : 0
    const overdueRate = tasks.length > 0 ? Math.round((overdueTasks.length / tasks.length) * 100) : 0
    
    // Employee performance
    const employeeStats = employees.map(emp => {
      const empTasks = tasks.filter(t => t.assignedTo === emp.id)
      const empCompleted = empTasks.filter(t => t.status === 'completed')
      const empOverdue = empTasks.filter(t => new Date(t.dueDate) < new Date() && t.status !== 'completed')
      
      return {
        ...emp,
        totalTasks: empTasks.length,
        completedTasks: empCompleted.length,
        overdueTasks: empOverdue.length,
        completionRate: empTasks.length > 0 ? Math.round((empCompleted.length / empTasks.length) * 100) : 0
      }
    }).filter(emp => emp.totalTasks > 0)
    
    // Priority distribution
    const priorityStats = {
      high: tasks.filter(t => t.priority === 'high').length,
      medium: tasks.filter(t => t.priority === 'medium').length,
      low: tasks.filter(t => t.priority === 'low').length
    }

    return (
      <div className="space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Tổng quan & Báo cáo Công việc</h2>
          
          <div className="flex flex-wrap gap-2">
          <button 
            onClick={() => setShowCreateModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center space-x-2 text-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Tạo công việc</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm">
            <Download className="w-4 h-4" />
            <span>Xuất Excel</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm">
            <FileText className="w-4 h-4" />
            <span>Xuất PDF</span>
          </button>
        </div>
      </div>

      {/* Detailed Priority Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Priority Tasks Analysis */}
        <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-lg border border-red-200 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-red-100 rounded-lg">
              <Target className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Công việc cần ưu tiên</h3>
              <p className="text-sm text-gray-600">Theo dõi độ ưu tiên và thời hạn</p>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="bg-white rounded-lg p-4 border border-red-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Quá hạn</span>
                <span className="text-lg font-bold text-red-600">
                  {tasks.filter(t => new Date(t.dueDate) < new Date() && t.status !== 'completed').length}
                </span>
              </div>
              <div className="text-xs text-gray-500">
                {tasks.filter(t => new Date(t.dueDate) < new Date() && t.status !== 'completed' && t.relatedType === 'lead').length} leads, {' '}
                {tasks.filter(t => new Date(t.dueDate) < new Date() && t.status !== 'completed' && t.relatedType === 'customer').length} khách hàng
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 border border-orange-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Hết hạn hôm nay</span>
                <span className="text-lg font-bold text-orange-600">
                  {tasks.filter(t => {
                    const taskDate = new Date(t.dueDate).toDateString()
                    const today = new Date().toDateString()
                    return taskDate === today && t.status !== 'completed'
                  }).length}
                </span>
              </div>
              <div className="text-xs text-gray-500">
                Cần hoàn thành trong ngày hôm nay
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 border border-yellow-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Hết hạn ngày mai</span>
                <span className="text-lg font-bold text-yellow-600">
                  {tasks.filter(t => {
                    const taskDate = new Date(t.dueDate).toDateString()
                    const tomorrow = new Date(Date.now() + 24*60*60*1000).toDateString()
                    return taskDate === tomorrow && t.status !== 'completed'
                  }).length}
                </span>
              </div>
              <div className="text-xs text-gray-500">
                Cần chuẩn bị và lên kế hoạch
              </div>
            </div>
          </div>
        </div>

        {/* Customer Related Tasks */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-200 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <User className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Công việc Khách hàng</h3>
              <p className="text-sm text-gray-600">Theo dõi và chăm sóc khách hàng</p>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="bg-white rounded-lg p-4 border border-blue-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Tổng CV khách hàng</span>
                <span className="text-lg font-bold text-blue-600">
                  {tasks.filter(t => t.relatedType === 'customer').length}
                </span>
              </div>
              <div className="text-xs text-gray-500">
                {tasks.filter(t => t.relatedType === 'customer' && t.status === 'completed').length} hoàn thành, {' '}
                {tasks.filter(t => t.relatedType === 'customer' && t.status !== 'completed').length} đang xử lý
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 border border-purple-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">KH ưu tiên cao</span>
                <span className="text-lg font-bold text-purple-600">
                  {tasks.filter(t => t.relatedType === 'customer' && t.priority === 'high').length}
                </span>
              </div>
              <div className="text-xs text-gray-500">
                Khách hàng VIP và quan trọng
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 border border-green-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Follow-up cần làm</span>
                <span className="text-lg font-bold text-green-600">
                  {tasks.filter(t => 
                    t.relatedType === 'customer' && 
                    t.status !== 'completed' &&
                    (t.tags.includes('follow-up') || t.title.toLowerCase().includes('follow'))
                  ).length}
                </span>
              </div>
              <div className="text-xs text-gray-500">
                Chăm sóc và theo dõi khách hàng
              </div>
            </div>
          </div>
        </div>

        {/* Lead Related Tasks */}
        <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-lg border border-teal-200 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-teal-100 rounded-lg">
              <Users className="w-5 h-5 text-teal-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Công việc Leads</h3>
              <p className="text-sm text-gray-600">Chuyển đổi khách hàng tiềm năng</p>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="bg-white rounded-lg p-4 border border-teal-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Tổng CV leads</span>
                <span className="text-lg font-bold text-teal-600">
                  {tasks.filter(t => t.relatedType === 'lead').length}
                </span>
              </div>
              <div className="text-xs text-gray-500">
                {tasks.filter(t => t.relatedType === 'lead' && t.status === 'completed').length} hoàn thành, {' '}
                {tasks.filter(t => t.relatedType === 'lead' && t.status !== 'completed').length} đang xử lý
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 border border-orange-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Leads nóng</span>
                <span className="text-lg font-bold text-orange-600">
                  {tasks.filter(t => 
                    t.relatedType === 'lead' && 
                    (t.priority === 'high' || t.tags.includes('hot') || t.tags.includes('nóng'))
                  ).length}
                </span>
              </div>
              <div className="text-xs text-gray-500">
                Cần xử lý ngay để chuyển đổi
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 border border-blue-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Tư vấn & Demo</span>
                <span className="text-lg font-bold text-blue-600">
                  {tasks.filter(t => 
                    t.relatedType === 'lead' && 
                    (t.title.toLowerCase().includes('demo') || 
                     t.title.toLowerCase().includes('tư vấn') ||
                     t.title.toLowerCase().includes('tư vấn'))
                  ).length}
                </span>
              </div>
              <div className="text-xs text-gray-500">
                Hẹn demo và tư vấn sản phẩm
              </div>
            </div>
          </div>
        </div>
      </div>



      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Task Type Distribution Chart - Split into 2 horizontal tables */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-blue-100 rounded-lg">
                <PieChart className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Phân loại Công việc</h3>
                <p className="text-sm text-gray-600">Thống kê theo loại và ưu tiên</p>
              </div>
            </div>
          </div>

          {/* First and Second tables side by side */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* First horizontal table - Task Categories */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">Theo loại công việc</h4>
              <div className="space-y-3">
                {/* Lead & Customer Tasks */}
                <div className="bg-blue-50 rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                      <span className="text-sm font-medium text-gray-700">Lead & KH</span>
                    </div>
                    <span className="text-lg font-bold text-blue-600 min-w-[2rem]">
                      {tasks.filter(t => t.relatedType === 'lead' || t.relatedType === 'customer').length}
                    </span>
                  </div>
                </div>

                {/* Order Tasks */}
                <div className="bg-green-50 rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                      <span className="text-sm font-medium text-gray-700">Công việc chung</span>
                    </div>
                    <span className="text-lg font-bold text-green-600 min-w-[2rem]">
                      {tasks.filter(t => t.relatedType === 'general').length}
                    </span>
                  </div>
                </div>

                {/* General Tasks */}
                <div className="bg-purple-50 rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-4 h-4 bg-purple-500 rounded-full"></div>
                      <span className="text-sm font-medium text-gray-700">Nội bộ & Khác</span>
                    </div>
                    <span className="text-lg font-bold text-purple-600 min-w-[2rem]">
                      {tasks.filter(t => t.relatedType === 'general' || !t.relatedType).length}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Second horizontal table - Priority Distribution */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">Theo mức độ ưu tiên</h4>
              <div className="space-y-3">
                {/* High Priority */}
                <div className="bg-red-50 rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                      <span className="text-sm font-medium text-gray-700">Cao</span>
                    </div>
                    <span className="text-lg font-bold text-red-600 min-w-[2rem]">
                      {tasks.filter(t => t.priority === 'high').length}
                    </span>
                  </div>
                </div>

                {/* Medium Priority */}
                <div className="bg-yellow-50 rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
                      <span className="text-sm font-medium text-gray-700">Trung bình</span>
                    </div>
                    <span className="text-lg font-bold text-yellow-600 min-w-[2rem]">
                      {tasks.filter(t => t.priority === 'medium').length}
                    </span>
                  </div>
                </div>

                {/* Low Priority */}
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-4 h-4 bg-gray-500 rounded-full"></div>
                      <span className="text-sm font-medium text-gray-700">Thấp</span>
                    </div>
                    <span className="text-lg font-bold text-gray-600 min-w-[2rem]">
                      {tasks.filter(t => t.priority === 'low').length}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Tasks */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-green-100 rounded-lg">
                <Clock className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Công việc gần đây</h3>
                <p className="text-sm text-gray-600">5 công việc mới nhất</p>
              </div>
            </div>
          </div>
          <div className="divide-y divide-gray-100 max-h-96 overflow-y-auto">
            {tasks.slice(0, 5).map(task => {
              const assignee = employees.find(e => e.id === task.assignedTo)
              return (
                <div key={task.id} className="p-4 hover:bg-gray-50 cursor-pointer transition-colors" onClick={() => {
                  setSelectedTask(task)
                  setShowDetailModal(true)
                }}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        {task.status === 'completed' ? <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" /> :
                         task.status === 'in_progress' ? <Play className="w-4 h-4 text-blue-500 flex-shrink-0" /> :
                         <Circle className="w-4 h-4 text-gray-400 flex-shrink-0" />}
                        <div className="min-w-0 flex-1">
                          <div className="font-medium text-gray-900 text-sm truncate">{task.title}</div>
                          <div className="text-xs text-gray-500 truncate">{task.description}</div>
                        </div>
                      </div>
                      
                      <div className="mt-2 flex items-center space-x-3 text-xs text-gray-500">
                        <span className="flex items-center space-x-1">
                          <Clock className="w-3 h-3" />
                          <span>{formatDate(task.dueDate)}</span>
                        </span>
                        {assignee && (
                          <span className="flex items-center space-x-1">
                            <User className="w-3 h-3" />
                            <span className="truncate">{assignee.name}</span>
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-end space-y-1 ml-3">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(task.priority)}`}>
                        {getPriorityText(task.priority)}
                      </span>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(task.status)}`}>
                        {getStatusText(task.status)}
                      </span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
          <div className="p-4 bg-gray-50 border-t border-gray-100">
            <button 
              onClick={() => setActiveTab('list')}
              className="w-full text-center text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              Xem tất cả công việc →
            </button>
          </div>
        </div>
      </div>

    </div>
  )
  }

  // Calendar-related state and functions
  const [currentDate, setCurrentDate] = useState(new Date())
  const [calendarView, setCalendarView] = useState<'day' | 'week' | 'month'>('month')
  const [showLunar, setShowLunar] = useState(false)
  const [showHolidays, setShowHolidays] = useState(true)
  const [eventTypeFilter, setEventTypeFilter] = useState('')
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([])
  
  // Quick event templates
  const quickTemplates = [
    {
      id: '1',
      title: 'Họp khách hàng',
      type: 'meeting' as const,
      duration: 60,
      location: 'Phòng họp',
      description: 'Cuộc họp với khách hàng',
      color: '#3B82F6'
    },
    {
      id: '2', 
      title: 'Họp nội bộ',
      type: 'internal' as const,
      duration: 30,
      location: 'Văn phòng',
      description: 'Họp team nội bộ',
      color: '#10B981'
    },
    {
      id: '3',
      title: 'Nghỉ giải lao',
      type: 'personal' as const,
      duration: 15,
      description: 'Thời gian nghỉ ngơi',
      color: '#6B7280'
    }
  ]

    const renderCalendar = () => {
    // Get first day of month
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
    const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)
    const startDate = new Date(firstDayOfMonth)
    startDate.setDate(startDate.getDate() - firstDayOfMonth.getDay()) // Start from Sunday
    
    // Generate calendar days
    const calendarDays = []
    for (let i = 0; i < 42; i++) { // 6 weeks * 7 days
      const date = new Date(startDate)
      date.setDate(startDate.getDate() + i)
      calendarDays.push(date)
    }
    
    const navigateMonth = (direction: 'prev' | 'next') => {
      const newDate = new Date(currentDate)
      if (calendarView === 'day') {
        // Navigate by day
        if (direction === 'prev') {
          newDate.setDate(newDate.getDate() - 1)
        } else {
          newDate.setDate(newDate.getDate() + 1)
        }
      } else if (calendarView === 'week') {
        // Navigate by week
        if (direction === 'prev') {
          newDate.setDate(newDate.getDate() - 7)
        } else {
          newDate.setDate(newDate.getDate() + 7)
        }
      } else {
        // Navigate by month
        if (direction === 'prev') {
          newDate.setMonth(newDate.getMonth() - 1)
        } else {
          newDate.setMonth(newDate.getMonth() + 1)
        }
      }
      setCurrentDate(newDate)
    }
    
    const isToday = (date: Date) => {
      const today = new Date()
      return date.toDateString() === today.toDateString()
    }
    
    const isCurrentMonth = (date: Date) => {
      return date.getMonth() === currentDate.getMonth()
    }

    const handleQuickEvent = (template: any, date: Date) => {
      const startTime = new Date()
      startTime.setHours(9, 0, 0, 0) // Default 9:00 AM
      const endTime = new Date(startTime.getTime() + template.duration * 60000)
      
      const newEvent: CalendarEvent = {
        id: Date.now().toString(),
        title: template.title,
        description: template.description,
        startDate: date.toISOString().split('T')[0],
        endDate: date.toISOString().split('T')[0],
        startTime: startTime.toTimeString().slice(0, 5),
        endTime: endTime.toTimeString().slice(0, 5),
        type: template.type,
        priority: 'medium',
        location: template.location || '',
        attendees: [employees[0]?.id || '1'],
        isAllDay: false,
        isRecurring: false,
        reminderMinutes: [15],
        color: template.color,
        createdBy: employees[0]?.id || '1',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      
      setCalendarEvents(prev => [...prev, newEvent])
    }

    const getEventsForDate = (date: Date) => {
      const tasksForDate = tasks.filter(task => {
        const taskDate = new Date(task.dueDate)
        return taskDate.toDateString() === date.toDateString()
      })
      
      const eventsForDate = calendarEvents.filter(event => {
        const eventDate = new Date(event.startDate)
        return eventDate.toDateString() === date.toDateString()
      })
      
      return { tasks: tasksForDate, events: eventsForDate }
    }

    const isHoliday = (date: Date) => {
      // Simple holiday check - can be expanded
      const month = date.getMonth() + 1
      const day = date.getDate()
      
      const holidays = [
        { month: 1, day: 1, name: 'Tết Dương lịch' },
        { month: 4, day: 30, name: 'Giải phóng miền Nam' },
        { month: 5, day: 1, name: 'Quốc tế Lao động' },
        { month: 9, day: 2, name: 'Quốc khánh' }
      ]
      
      return holidays.find(h => h.month === month && h.day === day) || null
    }

    const getLunarDate = (date: Date) => {
      // Simplified lunar date - in real app should use proper lunar calendar library
      return {
        lunarDay: date.getDate(),
        lunarMonth: date.getMonth() + 1,
        lunarYear: date.getFullYear(),
        zodiac: 'Tý',
        can: 'Giáp',
        chi: 'Tý',
        monthName: 'Tháng Giêng'
      }
    }
    
    return (
      <div className="h-full">
        {/* Lark-style Header */}
        <div className="rounded-lg border border-gray-200 mb-6">
        <div className="border-b border-gray-100 bg-white sticky top-0 z-10">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              {/* Left section - Month/Year */}
              <div className="flex items-center space-x-4">
                <h1 className="text-2xl font-semibold text-gray-900">
                  {calendarView === 'day' 
                    ? currentDate.toLocaleDateString('vi-VN', { 
                        weekday: 'long',
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })
                    : calendarView === 'week'
                    ? `Tuần ${Math.ceil(currentDate.getDate() / 7)} - ${currentDate.toLocaleDateString('vi-VN', { month: 'long', year: 'numeric' })}`
                    : currentDate.toLocaleDateString('vi-VN', { month: 'long', year: 'numeric' })
                  }
                </h1>
                <div className="flex items-center space-x-1 bg-gray-50 rounded-lg p-1">
                  <button
                    onClick={() => navigateMonth('prev')}
                    className="p-2 hover:bg-white hover:shadow-sm rounded-md transition-all duration-200"
                  >
                    <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setCurrentDate(new Date())}
                    className="px-3 py-2 text-sm text-gray-700 hover:bg-white hover:shadow-sm rounded-md transition-all duration-200 font-medium"
                  >
                    Hôm nay
                  </button>
                  <button
                    onClick={() => navigateMonth('next')}
                    className="p-2 hover:bg-white hover:shadow-sm rounded-md transition-all duration-200"
                  >
                    <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Right section - Actions */}
              <div className="flex items-center space-x-3">
                {/* View toggle */}
                <div className="flex items-center bg-gray-50 rounded-lg p-1">
                  <button
                    onClick={() => setCalendarView('day')}
                    className={`px-3 py-2 text-sm rounded-md transition-all duration-200 font-medium ${
                      calendarView === 'day' 
                        ? 'bg-white shadow-sm text-blue-600' 
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Ngày
                  </button>
                  <button
                    onClick={() => setCalendarView('week')}
                    className={`px-3 py-2 text-sm rounded-md transition-all duration-200 font-medium ${
                      calendarView === 'week' 
                        ? 'bg-white shadow-sm text-blue-600' 
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Tuần
                  </button>
                  <button
                    onClick={() => setCalendarView('month')}
                    className={`px-3 py-2 text-sm rounded-md transition-all duration-200 font-medium ${
                      calendarView === 'month' 
                        ? 'bg-white shadow-sm text-blue-600' 
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Tháng
                  </button>
                </div>

                {/* Create event button */}
                <button
                  onClick={() => {
                    setSelectedEventDate(new Date())
                    setShowCreateEventModal(true)
                  }}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 font-medium shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>Tạo sự kiện</span>
                </button>
              </div>
            </div>
          </div>
        </div>
        </div>

        {calendarView === 'day' ? (
          /* Day view */
          <div className="flex-1 bg-white">
            <div className="border-b border-gray-100 p-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {currentDate.toLocaleDateString('vi-VN', { 
                  weekday: 'long',
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </h3>
            </div>
            
            {/* Time slots */}
            <div className="overflow-y-auto" style={{ height: 'calc(100vh - 300px)' }}>
              {Array.from({ length: 24 }, (_, hour) => {
                const timeSlot = new Date(currentDate)
                timeSlot.setHours(hour, 0, 0, 0)
                
                const { tasks: dayTasks, events } = getEventsForDate(currentDate)
                const hourTasks = dayTasks.filter(task => {
                  const taskHour = new Date(task.dueDate).getHours()
                  return taskHour === hour
                })
                const hourEvents = events.filter(event => {
                  const eventHour = parseInt(event.startTime.split(':')[0])
                  return eventHour === hour
                })
                
                return (
                  <div key={hour} className="flex border-b border-gray-50 hover:bg-gray-25">
                    {/* Time column */}
                    <div className="w-20 p-3 text-sm text-gray-500 font-medium border-r border-gray-100">
                      {hour.toString().padStart(2, '0')}:00
                    </div>
                    
                    {/* Events column */}
                    <div className="flex-1 p-3 min-h-[60px]">
                      <div className="space-y-2">
                        {/* Tasks for this hour */}
                        {hourTasks.map(task => (
                          <div
                            key={`task-${task.id}`}
                            onClick={() => {
                              setSelectedTask(task)
                              setShowDetailModal(true)
                            }}
                            className={`p-3 rounded-lg border-l-4 cursor-pointer transition-all hover:shadow-sm ${
                              task.priority === 'high' 
                                ? 'bg-red-50 border-red-400 text-red-700 hover:bg-red-100' 
                                : task.priority === 'medium'
                                ? 'bg-yellow-50 border-yellow-400 text-yellow-700 hover:bg-yellow-100'
                                : 'bg-gray-50 border-gray-400 text-gray-700 hover:bg-gray-100'
                            }`}
                          >
                            <div className="flex items-center space-x-3">
                              {task.status === 'completed' ? (
                                <CheckCircle className="w-4 h-4 text-green-600" />
                              ) : task.status === 'in_progress' ? (
                                <Play className="w-4 h-4 text-blue-600" />
                              ) : (
                                <Circle className="w-4 h-4" />
                              )}
                              <div className="flex-1">
                                <div className="font-medium">{task.title}</div>
                                <div className="text-sm opacity-75 mt-1">{task.description}</div>
                                <div className="text-xs mt-2 flex items-center space-x-2">
                                  <span>{new Date(task.dueDate).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}</span>
                                  {task.relatedName && (
                                    <span className="bg-white bg-opacity-50 px-2 py-1 rounded">
                                      {task.relatedName}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                        
                        {/* Events for this hour */}
                        {hourEvents.map(event => (
                          <div
                            key={`event-${event.id}`}
                            className="p-3 rounded-lg border-l-4 cursor-pointer transition-all hover:shadow-sm"
                            style={{ 
                              backgroundColor: event.color + '15', 
                              borderLeftColor: event.color,
                              color: event.color
                            }}
                          >
                            <div className="flex items-center space-x-3">
                              {event.type === 'meeting' && <Users className="w-4 h-4" />}
                              {event.type === 'internal' && <Building className="w-4 h-4" />}
                              {event.type === 'personal' && <User className="w-4 h-4" />}
                              <div className="flex-1">
                                <div className="font-medium">{event.title}</div>
                                <div className="text-sm opacity-75 mt-1">{event.description}</div>
                                <div className="text-xs mt-2 flex items-center space-x-2">
                                  <span>{event.startTime} - {event.endTime}</span>
                                  {event.location && (
                                    <span className="bg-white bg-opacity-50 px-2 py-1 rounded">
                                      📍 {event.location}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                        
                        {/* Empty slot - show add button on hover */}
                        {hourTasks.length === 0 && hourEvents.length === 0 && (
                          <div className="group">
                            <button
                              onClick={() => {
                                const eventDate = new Date(currentDate)
                                eventDate.setHours(hour, 0, 0, 0)
                                setSelectedEventDate(eventDate)
                                setShowCreateEventModal(true)
                              }}
                              className="w-full p-2 text-left text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-all opacity-0 group-hover:opacity-100"
                            >
                              + Thêm sự kiện lúc {hour.toString().padStart(2, '0')}:00
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ) : calendarView === 'week' ? (
          /* Week view */
          <div className="flex-1 bg-white">
            {/* Week header */}
            <div className="border-b border-gray-100">
              <div className="grid grid-cols-8 text-center">
                <div className="p-3 border-r border-gray-100"></div>
                {Array.from({ length: 7 }, (_, dayIndex) => {
                  const weekStart = new Date(currentDate)
                  weekStart.setDate(currentDate.getDate() - currentDate.getDay() + dayIndex)
                  const isToday = weekStart.toDateString() === new Date().toDateString()
                  
                  return (
                    <div key={dayIndex} className="p-3 border-r border-gray-100">
                      <div className={`text-sm font-medium ${isToday ? 'text-blue-600' : 'text-gray-700'}`}>
                        {weekStart.toLocaleDateString('vi-VN', { weekday: 'short' })}
                      </div>
                      <div className={`text-lg font-semibold mt-1 ${isToday ? 'text-blue-600' : 'text-gray-900'}`}>
                        {weekStart.getDate()}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
            
            {/* Week time slots */}
            <div className="overflow-y-auto" style={{ height: 'calc(100vh - 350px)' }}>
              {Array.from({ length: 24 }, (_, hour) => (
                <div key={hour} className="grid grid-cols-8 border-b border-gray-50">
                  {/* Time column */}
                  <div className="p-2 text-sm text-gray-500 font-medium border-r border-gray-100 bg-gray-25">
                    {hour.toString().padStart(2, '0')}:00
                  </div>
                  
                  {/* Day columns */}
                  {Array.from({ length: 7 }, (_, dayIndex) => {
                    const weekDay = new Date(currentDate)
                    weekDay.setDate(currentDate.getDate() - currentDate.getDay() + dayIndex)
                    
                    const { tasks: dayTasks, events } = getEventsForDate(weekDay)
                    const hourTasks = dayTasks.filter(task => {
                      const taskHour = new Date(task.dueDate).getHours()
                      return taskHour === hour
                    })
                    const hourEvents = events.filter(event => {
                      const eventHour = parseInt(event.startTime.split(':')[0])
                      return eventHour === hour
                    })
                    
                    return (
                      <div key={dayIndex} className="p-1 border-r border-gray-100 min-h-[50px] hover:bg-gray-25">
                        {/* Tasks */}
                        {hourTasks.map(task => (
                          <div
                            key={`task-${task.id}`}
                            onClick={() => {
                              setSelectedTask(task)
                              setShowDetailModal(true)
                            }}
                            className={`text-xs p-1 mb-1 rounded cursor-pointer ${
                              task.priority === 'high' 
                                ? 'bg-red-100 text-red-700' 
                                : task.priority === 'medium'
                                ? 'bg-yellow-100 text-yellow-700'
                                : 'bg-gray-100 text-gray-700'
                            }`}
                            title={task.title}
                          >
                            <div className="truncate font-medium">{task.title}</div>
                          </div>
                        ))}
                        
                        {/* Events */}
                        {hourEvents.map(event => (
                          <div
                            key={`event-${event.id}`}
                            className="text-xs p-1 mb-1 rounded cursor-pointer"
                            style={{ 
                              backgroundColor: event.color + '20', 
                              color: event.color
                            }}
                            title={event.title}
                          >
                            <div className="truncate font-medium">{event.title}</div>
                          </div>
                        ))}
                      </div>
                    )
                  })}
                </div>
              ))}
            </div>
          </div>
        ) : calendarView === 'month' ? (
          <div className="flex-1">
            {/* Calendar Grid */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div>
              {/* Weekday headers - Lark style */}
              <div className="grid grid-cols-7 border-b border-gray-100">
                {['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'].map((day, index) => (
                  <div key={day} className="px-4 py-3 text-center bg-gray-50">
                    <div className={`text-xs font-semibold ${
                      index === 0 || index === 6 
                        ? 'text-red-500' 
                        : 'text-gray-700'
                    }`}>
                      {day}
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Calendar body */}
              <div className="grid grid-cols-7">
                {calendarDays.map((date, index) => {
                  const { tasks: dayTasks, events } = getEventsForDate(date)
                  const holiday = showHolidays ? isHoliday(date) : null
                  const lunarDate = showLunar ? getLunarDate(date) : null
                  const isWeekend = date.getDay() === 0 || date.getDay() === 6
                  const dayIsToday = isToday(date)
                  const dayIsCurrentMonth = isCurrentMonth(date)
                  
                  return (
                    <div
                      key={index}
                      className={`relative min-h-[120px] border-b border-r border-gray-100 group hover:bg-gray-50 transition-colors ${
                        !dayIsCurrentMonth ? 'bg-gray-25' : 'bg-white'
                      }`}
                    >
                      {/* Date header */}
                      <div className="flex items-center justify-between p-3">
                        <div className="flex items-center space-x-2">
                          <div className={`flex items-center justify-center w-7 h-7 rounded-full text-sm font-medium transition-colors ${
                            dayIsToday
                              ? 'bg-blue-600 text-white'
                              : !dayIsCurrentMonth
                              ? 'text-gray-400'
                              : holiday
                              ? 'text-red-600 hover:bg-red-50'
                              : isWeekend
                              ? 'text-orange-600 hover:bg-orange-50'
                              : 'text-gray-900 hover:bg-gray-100'
                          }`}>
                            {date.getDate()}
                          </div>
                          
                          {/* Lunar date */}
                          {showLunar && lunarDate && dayIsCurrentMonth && (
                            <div className="text-xs text-gray-500">
                              {lunarDate.lunarDay}/{lunarDate.lunarMonth}
                            </div>
                          )}
                        </div>
                        
                        {/* Quick add button */}
                        <button
                          onClick={() => {
                            setSelectedEventDate(date)
                            setShowCreateEventModal(true)
                          }}
                          className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-all"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      
                      {/* Holiday indicator */}
                      {holiday && (
                        <div className="px-3 pb-1">
                          <div className="text-xs text-red-600 font-medium bg-red-50 px-2 py-1 rounded-full flex items-center">
                            <TreePine className="w-3 h-3 mr-1" />
                            {holiday.name}
                          </div>
                        </div>
                      )}
                      
                      {/* Events and tasks */}
                      <div className="px-3 pb-3 space-y-1">
                        {/* Tasks */}
                        {dayTasks.slice(0, 2).map(task => (
                          <div
                            key={`task-${task.id}`}
                            onClick={() => {
                              setSelectedTask(task)
                              setShowDetailModal(true)
                            }}
                            className={`group/item cursor-pointer p-2 rounded-md text-xs transition-all hover:shadow-sm ${
                              task.priority === 'high' 
                                ? 'bg-red-50 border-l-2 border-red-400 text-red-700 hover:bg-red-100' 
                                : task.priority === 'medium'
                                ? 'bg-yellow-50 border-l-2 border-yellow-400 text-yellow-700 hover:bg-yellow-100'
                                : 'bg-gray-50 border-l-2 border-gray-400 text-gray-700 hover:bg-gray-100'
                            }`}
                          >
                            <div className="flex items-center space-x-2">
                              {task.status === 'completed' ? (
                                <CheckCircle className="w-3 h-3 text-green-600 flex-shrink-0" />
                              ) : task.status === 'in_progress' ? (
                                <Play className="w-3 h-3 text-blue-600 flex-shrink-0" />
                              ) : (
                                <Circle className="w-3 h-3 text-gray-400 flex-shrink-0" />
                              )}
                              <span className="truncate font-medium">{task.title}</span>
                            </div>
                            <div className="mt-1 text-xs opacity-75">
                              {new Date(task.dueDate).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                            </div>
                          </div>
                        ))}
                        
                        {/* Events */}
                        {events.slice(0, 3 - dayTasks.slice(0, 2).length).map(event => (
                          <div
                            key={`event-${event.id}`}
                            className="cursor-pointer p-2 rounded-md text-xs transition-all hover:shadow-sm"
                            style={{ 
                              backgroundColor: event.color + '15', 
                              borderLeft: `3px solid ${event.color}`
                            }}
                          >
                            <div className="flex items-center space-x-2">
                              {event.type === 'meeting' && <Users className="w-3 h-3 flex-shrink-0" />}
                              {event.type === 'internal' && <Building className="w-3 h-3 flex-shrink-0" />}
                              {event.type === 'personal' && <User className="w-3 h-3 flex-shrink-0" />}
                              <span className="truncate font-medium" style={{ color: event.color }}>
                                {event.title}
                              </span>
                            </div>
                            {!event.isAllDay && (
                              <div className="mt-1 text-xs opacity-75" style={{ color: event.color }}>
                                {event.startTime} - {event.endTime}
                              </div>
                            )}
                          </div>
                        ))}
                        
                        {/* More indicator */}
                        {(dayTasks.length + events.length) > 3 && (
                          <div className="text-xs text-gray-500 px-2 py-1 hover:bg-gray-100 rounded cursor-pointer">
                            +{(dayTasks.length + events.length) - 3} sự kiện khác
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}  
              </div>
            </div>
            </div>
          </div>
        ) : (
          /* Default fallback */
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <div className="text-gray-500 text-lg font-medium">Chế độ xem không hợp lệ</div>
            </div>
          </div>
        )}

        {/* Bottom toolbar - Lark style */}
        <div className="border-t border-gray-100 px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Left side - Quick templates */}
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600 font-medium">Tạo nhanh:</span>
              {quickTemplates.slice(0, 3).map(template => (
                <button
                  key={template.id}
                  onClick={() => handleQuickEvent(template, new Date())}
                  className="flex items-center space-x-2 px-3 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  style={{ borderLeftColor: template.color, borderLeftWidth: '3px' }}
                >
                  {template.type === 'meeting' && <Users className="w-4 h-4" />}
                  {template.type === 'internal' && <Building className="w-4 h-4" />}
                  {template.type === 'personal' && <Coffee className="w-4 h-4" />}
                  <span>{template.title}</span>
                </button>
              ))}
            </div>

            {/* Right side - Options */}
            <div className="flex items-center space-x-4">
              <label className="flex items-center space-x-2 text-sm text-gray-600">
                <input
                  type="checkbox"
                  checked={showLunar}
                  onChange={(e) => setShowLunar(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <Moon className="w-4 h-4" />
                <span>Âm lịch</span>
              </label>
              <label className="flex items-center space-x-2 text-sm text-gray-600">
                <input
                  type="checkbox"
                  checked={showHolidays}
                  onChange={(e) => setShowHolidays(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <TreePine className="w-4 h-4" />
                <span>Lễ tết</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const renderTasks = () => (
    <div className="space-y-4">
      {/* Statistics Cards */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <div 
          className={`flex flex-col justify-between rounded-lg px-6 py-5 min-w-[180px] text-white shadow-lg cursor-pointer relative transition-all hover:shadow-xl ${
            selectedStatsFilter === 'total' 
              ? 'bg-gradient-to-br from-blue-700 to-blue-500 transform scale-105 ring-4 ring-blue-300' 
              : 'bg-gradient-to-br from-blue-600 to-blue-400'
          }`}
          onClick={() => handleStatsCardClick('total')}
        >
          <div className="absolute top-2 right-2">
            <Info className="w-3.5 h-3.5 text-white/70 hover:text-white cursor-help transition-colors" />
          </div>
          <div>
            <p className="text-base font-semibold text-white mb-2">Tổng công việc</p>
            <p className="text-4xl font-extrabold text-white mb-1">{tasks.length}</p>
            <div className="mt-3">
              <p className="text-sm text-white/90">T.trước: 15</p>
            </div>
          </div>
        </div>

        <div 
          className={`flex flex-col justify-between rounded-lg px-6 py-5 min-w-[180px] text-white shadow-lg cursor-pointer relative transition-all hover:shadow-xl ${
            selectedStatsFilter === 'pending' 
              ? 'bg-gradient-to-br from-gray-700 to-gray-500 transform scale-105 ring-4 ring-gray-300' 
              : 'bg-gradient-to-br from-gray-600 to-gray-400'
          }`}
          onClick={() => handleStatsCardClick('pending')}
        >
          <div className="absolute top-2 right-2">
            <Info className="w-3.5 h-3.5 text-white/70 hover:text-white cursor-help transition-colors" />
          </div>
          <div>
            <p className="text-base font-semibold text-white mb-2">Chưa làm</p>
            <p className="text-4xl font-extrabold text-white mb-1">{tasks.filter(t => t.status === 'pending').length}</p>
            <div className="mt-3">
              <p className="text-sm text-white/90">T.trước: 3</p>
            </div>
          </div>
        </div>

        <div 
          className={`flex flex-col justify-between rounded-lg px-6 py-5 min-w-[180px] text-white shadow-lg cursor-pointer relative transition-all hover:shadow-xl ${
            selectedStatsFilter === 'in_progress' 
              ? 'bg-gradient-to-br from-yellow-700 to-yellow-500 transform scale-105 ring-4 ring-yellow-300' 
              : 'bg-gradient-to-br from-yellow-600 to-yellow-400'
          }`}
          onClick={() => handleStatsCardClick('in_progress')}
        >
          <div className="absolute top-2 right-2">
            <Info className="w-3.5 h-3.5 text-white/70 hover:text-white cursor-help transition-colors" />
          </div>
          <div>
            <p className="text-base font-semibold text-white mb-2">Đang làm</p>
            <p className="text-4xl font-extrabold text-white mb-1">{tasks.filter(t => t.status === 'in_progress').length}</p>
            <div className="mt-3">
              <p className="text-sm text-white/90">T.trước: 5</p>
            </div>
          </div>
        </div>

        <div 
          className={`flex flex-col justify-between rounded-lg px-6 py-5 min-w-[180px] text-white shadow-lg cursor-pointer relative transition-all hover:shadow-xl ${
            selectedStatsFilter === 'completed' 
              ? 'bg-gradient-to-br from-green-700 to-green-500 transform scale-105 ring-4 ring-green-300' 
              : 'bg-gradient-to-br from-green-600 to-green-400'
          }`}
          onClick={() => handleStatsCardClick('completed')}
        >
          <div className="absolute top-2 right-2">
            <Info className="w-3.5 h-3.5 text-white/70 hover:text-white cursor-help transition-colors" />
          </div>
          <div>
            <p className="text-base font-semibold text-white mb-2">Hoàn tất</p>
            <p className="text-4xl font-extrabold text-white mb-1">{tasks.filter(t => t.status === 'completed').length}</p>
            <div className="mt-3">
              <p className="text-sm text-white/90">T.trước: 8</p>
            </div>
          </div>
        </div>

        <div 
          className={`flex flex-col justify-between rounded-lg px-6 py-5 min-w-[180px] text-white shadow-lg cursor-pointer relative transition-all hover:shadow-xl ${
            selectedStatsFilter === 'overdue' 
              ? 'bg-gradient-to-br from-red-700 to-red-500 transform scale-105 ring-4 ring-red-300' 
              : 'bg-gradient-to-br from-red-600 to-red-400'
          }`}
          onClick={() => handleStatsCardClick('overdue')}
        >
          <div className="absolute top-2 right-2">
            <Info className="w-3.5 h-3.5 text-white/70 hover:text-white cursor-help transition-colors" />
          </div>
          <div>
            <p className="text-base font-semibold text-white mb-2">Quá hạn</p>
            <p className="text-4xl font-extrabold text-white mb-1">{tasks.filter(t => new Date(t.dueDate) < new Date() && t.status !== 'completed').length}</p>
            <div className="mt-3">
              <p className="text-sm text-white/90">T.trước: 2</p>
            </div>
          </div>
        </div>

        <div 
          className={`flex flex-col justify-between rounded-lg px-6 py-5 min-w-[180px] text-white shadow-lg cursor-pointer relative transition-all hover:shadow-xl ${
            selectedStatsFilter === 'urgent_priority' 
              ? 'bg-gradient-to-br from-orange-700 to-orange-500 transform scale-105 ring-4 ring-orange-300' 
              : 'bg-gradient-to-br from-orange-600 to-orange-400'
          }`}
          onClick={() => handleStatsCardClick('urgent_priority')}
        >
          <div className="absolute top-2 right-2">
            <Info className="w-3.5 h-3.5 text-white/70 hover:text-white cursor-help transition-colors" />
          </div>
          <div>
            <p className="text-base font-semibold text-white mb-2">Cần ưu tiên</p>
            <p className="text-4xl font-extrabold text-white mb-1">
              {tasks.filter(t => 
                (t.priority === 'high') || 
                (new Date(t.dueDate) <= new Date(Date.now() + 24*60*60*1000) && t.status !== 'completed')
              ).length}
            </p>
            <div className="flex items-center justify-between mt-3">
              <p className="text-sm text-white/90">Khẩn cấp + hết hạn sớm</p>
            </div>
          </div>
        </div>
        </div>
      </div>

      {/* Header and filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center gap-4">
            {/* View Toggle */}
            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setTaskView('table')}
                className={`flex items-center space-x-1 px-3 py-1.5 text-sm rounded-md transition-colors ${
                  taskView === 'table' 
                    ? 'bg-white shadow-sm text-blue-600' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <List className="w-4 h-4" />
                <span>Bảng</span>
              </button>
              <button
                onClick={() => setTaskView('kanban')}
                className={`flex items-center space-x-1 px-3 py-1.5 text-sm rounded-md transition-colors ${
                  taskView === 'kanban' 
                    ? 'bg-white shadow-sm text-blue-600' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Grid3X3 className="w-4 h-4" />
                <span>Kanban</span>
              </button>
            </div>
          </div>
          
          <div className="flex flex-col lg:flex-row gap-3 lg:items-center">
            {/* Search */}
            <div className="relative flex-1 lg:w-80">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm kiếm công việc..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
            </div>
            
            {/* Filters */}
            <div className="flex flex-wrap items-center gap-2">
              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border border-gray-300 rounded px-3 py-2 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="">Tất cả trạng thái</option>
                <option value="pending">Chưa làm</option>
                <option value="in_progress">Đang làm</option>
                <option value="completed">Hoàn tất</option>
              </select>
              
              <select 
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="border border-gray-300 rounded px-3 py-2 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="">Tất cả ưu tiên</option>
                <option value="high">Cao</option>
                <option value="medium">Trung bình</option>
                <option value="low">Thấp</option>
              </select>
              
              <select 
                value={relatedTypeFilter}
                onChange={(e) => setRelatedTypeFilter(e.target.value)}
                className="border border-gray-300 rounded px-3 py-2 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="">Tất cả phân loại</option>
                <option value="lead">Leads</option>
                <option value="customer">Khách hàng</option>
                <option value="general">Công việc chung</option>
              </select>
              
              <select 
                value={assigneeFilter}
                onChange={(e) => setAssigneeFilter(e.target.value)}
                className="border border-gray-300 rounded px-3 py-2 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="">Tất cả nhân viên</option>
                {employees.map(emp => (
                  <option key={emp.id} value={emp.id}>{emp.name}</option>
                ))}
              </select>
              
              {/* Date Range Filter */}
              <div className="flex items-center gap-2 border border-gray-300 rounded px-3 py-2 bg-white">
                <Calendar className="w-4 h-4 text-gray-400" />
                <select 
                  value={dateRangeFilter.preset}
                  onChange={(e) => setDateRangeFilter(prev => ({
                    ...prev,
                    preset: e.target.value,
                    startDate: e.target.value === 'custom' ? prev.startDate : '',
                    endDate: e.target.value === 'custom' ? prev.endDate : ''
                  }))}
                  className="text-sm bg-transparent focus:outline-none min-w-[120px]"
                >
                  <option value="">Tất cả ngày</option>
                  <option value="today">Hôm nay</option>
                  <option value="tomorrow">Ngày mai</option>
                  <option value="this_week">Tuần này</option>
                  <option value="next_week">Tuần sau</option>
                  <option value="this_month">Tháng này</option>
                  <option value="custom">Tùy chọn</option>
                </select>
              </div>
              
              {/* Custom Date Range Inputs */}
              {dateRangeFilter.preset === 'custom' && (
                <>
                  <input
                    type="date"
                    value={dateRangeFilter.startDate}
                    onChange={(e) => setDateRangeFilter(prev => ({
                      ...prev,
                      startDate: e.target.value
                    }))}
                    className="border border-gray-300 rounded px-3 py-2 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="Từ ngày"
                  />
                  <input
                    type="date"
                    value={dateRangeFilter.endDate}
                    onChange={(e) => setDateRangeFilter(prev => ({
                      ...prev,
                      endDate: e.target.value
                    }))}
                    className="border border-gray-300 rounded px-3 py-2 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="Đến ngày"
                  />
                </>
              )}
              
              <button 
                onClick={() => setShowCreateModal(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center space-x-2 text-sm"
              >
                <Plus className="w-4 h-4" />
                <span>Tạo công việc mới</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tasks Content - Table or Kanban */}
      {taskView === 'table' ? (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          {/* Selection Bar */}
          {selectedTasks.length > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <span className="text-sm font-medium text-blue-900">
                    Đã chọn {selectedTasks.length} công việc
                  </span>
                  <button 
                    onClick={() => setSelectedTasks([])}
                    className="text-xs text-blue-600 hover:text-blue-800 underline"
                  >
                    Bỏ chọn tất cả
                  </button>
                </div>
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={() => {
                      setTasks(tasks.map(task => 
                        selectedTasks.includes(task.id) 
                          ? { ...task, status: 'completed' }
                          : task
                      ))
                      setSelectedTasks([])
                    }}
                    className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>Đánh dấu đã làm</span>
                  </button>
                  <button 
                    onClick={() => {
                      if (confirm(`Bạn có chắc chắn muốn xóa ${selectedTasks.length} công việc đã chọn?`)) {
                        setTasks(tasks.filter(task => !selectedTasks.includes(task.id)))
                        setSelectedTasks([])
                      }
                    }}
                    className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Xóa công việc</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Display count */}
          <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
            <span>Hiển thị {displayTasks.length} trong tổng {tasks.length} công việc</span>
          </div>

          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                    checked={selectedTasks.length === displayTasks.length && displayTasks.length > 0}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedTasks(displayTasks.map(task => task.id))
                      } else {
                        setSelectedTasks([])
                      }
                    }}
                  />
                </th>
                {visibleColumns.task && (
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider whitespace-nowrap">
                    Công việc
                  </th>
                )}
                {visibleColumns.category && (
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider whitespace-nowrap">
                    Phân loại
                  </th>
                )}
                {visibleColumns.related && (
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider whitespace-nowrap">
                    Liên quan
                  </th>
                )}
                {visibleColumns.assignee && (
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider whitespace-nowrap">
                    Người phụ trách
                  </th>
                )}
                {visibleColumns.dueDate && (
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider whitespace-nowrap">
                    Thời hạn
                  </th>
                )}
                {visibleColumns.priority && (
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider whitespace-nowrap">
                    Ưu tiên
                  </th>
                )}
                {visibleColumns.status && (
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider whitespace-nowrap">
                    Trạng thái
                  </th>
                )}
                {visibleColumns.tags && (
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider whitespace-nowrap">
                    Tags
                  </th>
                )}
                {visibleColumns.createdDate && (
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider whitespace-nowrap">
                    Ngày tạo
                  </th>
                )}
                {visibleColumns.actions && (
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider whitespace-nowrap">
                    Thao tác
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {displayTasks.map((task) => {
                const isOverdue = new Date(task.dueDate) < new Date() && task.status !== 'completed'
                const assignee = employees.find(e => e.id === task.assignedTo)
                
                return (
                  <tr key={task.id} className={`hover:bg-gray-50 ${isOverdue ? 'bg-red-50' : ''}`}>
                    <td className="px-4 py-4">
                      <input
                        type="checkbox"
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                        checked={selectedTasks.includes(task.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedTasks([...selectedTasks, task.id])
                          } else {
                            setSelectedTasks(selectedTasks.filter(id => id !== task.id))
                          }
                        }}
                      />
                    </td>
                    {visibleColumns.task && (
                      <td className="px-4 py-4">
                        <div>
                          <div className="font-medium text-gray-900">{task.title}</div>
                          <div className="text-sm text-gray-500 line-clamp-2">{task.description}</div>
                        </div>
                      </td>
                    )}
                    
                    {visibleColumns.category && (
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getCategoryColor(task.relatedType)}`}>
                          {getCategoryText(task.relatedType)}
                        </span>
                      </td>
                    )}
                    
                    {visibleColumns.related && (
                      <td className="px-4 py-4 whitespace-nowrap">
                        {task.relatedType && (
                          <div>
                            <div className="font-medium text-gray-900">{task.relatedName}</div>
                            <div className="text-sm text-gray-500">
                              {task.relatedType === 'lead' && 'Lead'}
                              {task.relatedType === 'customer' && 'Khách hàng'}
                              {task.relatedType === 'general' && 'Công việc chung'}
                            </div>
                            {task.relatedInfo?.phone && (
                              <div className="text-xs text-gray-400">{task.relatedInfo.phone}</div>
                            )}
                          </div>
                        )}
                      </td>
                    )}
                    
                    {visibleColumns.assignee && (
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div>
                          <div className="font-medium text-gray-900">{assignee?.name}</div>
                          <div className="text-sm text-gray-500">{assignee?.team}</div>
                        </div>
                      </td>
                    )}
                    
                    {visibleColumns.dueDate && (
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className={isOverdue ? 'text-red-600' : ''}>
                          <div className="font-medium">{formatDate(task.dueDate)}</div>
                          <div className="text-sm text-gray-500">{new Date(task.dueDate).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}</div>
                          {isOverdue && (
                            <div className="text-xs text-red-600 flex items-center mt-1">
                              <AlertTriangle className="w-3 h-3 mr-1" />
                              Quá hạn
                            </div>
                          )}
                        </div>
                      </td>
                    )}
                    
                    {visibleColumns.priority && (
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getPriorityColor(task.priority)}`}>
                          {getPriorityText(task.priority)}
                        </span>
                      </td>
                    )}
                    
                    {visibleColumns.status && (
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(task.status)}`}>
                          {getStatusText(task.status)}
                        </span>
                      </td>
                    )}
                    
                    {visibleColumns.tags && (
                      <td className="px-4 py-4">
                        <div className="flex flex-wrap gap-1">
                          {task.tags.map(tag => (
                            <span key={tag} className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 border border-blue-200">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </td>
                    )}
                    
                    {visibleColumns.createdDate && (
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div>
                          <div className="font-medium text-gray-900">{formatDate(task.createdAt)}</div>
                          <div className="text-sm text-gray-500">{new Date(task.createdAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}</div>
                          <div className="text-xs text-gray-400">
                            Bởi: {employees.find(e => e.id === task.createdBy)?.name || task.createdBy}
                          </div>
                        </div>
                      </td>
                    )}
                    
                    {visibleColumns.actions && (
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="relative flex justify-center">
                          <button 
                            onClick={() => setOpenDropdownTaskId(openDropdownTaskId === task.id ? null : task.id)}
                            className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                          >
                            <Settings className="w-4 h-4" />
                          </button>
                          
                          {openDropdownTaskId === task.id && (
                            <>
                              <div 
                                className="fixed inset-0 z-[999]" 
                                onClick={() => setOpenDropdownTaskId(null)}
                              />
                              <div className="absolute right-0 top-full mt-1 w-56 bg-white rounded-xl shadow-xl border border-gray-200 z-[1000] py-2 text-left">
                                {/* Thông tin Section */}
                                <div className="px-3 py-1.5">
                                  <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Thông tin</span>
                                </div>
                                <button 
                                  onClick={() => {
                                    setSelectedTask(task)
                                    setShowDetailModal(true)
                                    setOpenDropdownTaskId(null)
                                  }}
                                  className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                >
                                  <Eye className="w-4 h-4 text-gray-400" />
                                  <span>Xem chi tiết</span>
                                </button>
                                <button 
                                  onClick={() => {
                                    setSelectedTask(task)
                                    setShowEditModal(true)
                                    setOpenDropdownTaskId(null)
                                  }}
                                  className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                >
                                  <svg className="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" fill="currentColor" />
                                  </svg>
                                  <span>Chỉnh sửa</span>
                                </button>

                                {/* Thao tác nguy hiểm Section */}
                                <div className="border-t border-gray-100 mt-1 pt-1">
                                  <div className="px-3 py-1.5">
                                    <span className="text-[11px] font-semibold text-red-400 uppercase tracking-wider">Thao tác nguy hiểm</span>
                                  </div>
                                  <button 
                                    onClick={() => {
                                      if (confirm('Bạn có chắc chắn muốn xóa công việc này?')) {
                                        setTasks(tasks.filter(t => t.id !== task.id))
                                        setOpenDropdownTaskId(null)
                                      }
                                    }}
                                    className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                    <span>Xóa công việc</span>
                                  </button>
                                </div>
                              </div>
                            </>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        </div>
      ) : (
        /* Kanban Board */
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Chưa làm Column */}
            <div 
              className={`bg-slate-50 rounded-lg p-4 transition-colors ${
                dragOverColumn === 'pending' ? 'bg-slate-100 ring-2 ring-gray-400 ring-dashed' : ''
              }`}
              onDragOver={(e) => handleDragOver(e, 'pending')}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, 'pending')}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900 flex items-center">
                  <div className="w-3 h-3 bg-gray-400 rounded-full mr-2"></div>
                  Chưa làm
                </h3>
                <span className="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded-full">
                  {displayTasks.filter(task => task.status === 'pending').length}
                </span>
              </div>
              <div className="space-y-3 min-h-[200px]">
                {displayTasks.filter(task => task.status === 'pending').map((task) => {
                  const isOverdue = new Date(task.dueDate) < new Date()
                  const assignee = employees.find(e => e.id === task.assignedTo)
                  
                  return (
                    <div 
                      key={task.id} 
                      draggable
                      onDragStart={(e) => handleDragStart(e, task)}
                      className={`bg-white p-3 rounded-lg shadow-sm border-l-4 hover:shadow-md transition-all cursor-move ${
                        isOverdue ? 'border-l-red-500 bg-red-50' : 'border-l-gray-300'
                      } ${draggedTask?.id === task.id ? 'opacity-50 transform scale-95' : ''}`}
                      onClick={() => {
                        setSelectedTask(task)
                        setShowDetailModal(true)
                      }}
                    >
                      <div className="space-y-2">
                        <h4 className="font-medium text-gray-900 text-sm">{task.title}</h4>
                        <p className="text-xs text-gray-600 line-clamp-2">{task.description}</p>
                        
                        <div className="flex items-center justify-between">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getPriorityColor(task.priority)}`}>
                            {getPriorityText(task.priority)}
                          </span>
                          <span className="text-xs text-gray-500">{formatDate(task.dueDate)}</span>
                        </div>
                        
                        {task.relatedType && (
                          <div className="flex items-center space-x-2">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getCategoryColor(task.relatedType)}`}>
                              {getCategoryText(task.relatedType)}
                            </span>
                            <span className="text-xs text-gray-500">{task.relatedName}</span>
                          </div>
                        )}
                        
                        {assignee && (
                          <div className="flex items-center space-x-2">
                            <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">
                              <span className="text-xs text-gray-600">{assignee.name.charAt(0)}</span>
                            </div>
                            <span className="text-xs text-gray-600">{assignee.name}</span>
                          </div>
                        )}
                        
                        {task.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {task.tags.slice(0, 2).map(tag => (
                              <span key={tag} className="px-1.5 py-0.5 text-xs font-medium rounded bg-blue-100 text-blue-800">
                                {tag}
                              </span>
                            ))}
                            {task.tags.length > 2 && (
                              <span className="px-1.5 py-0.5 text-xs text-gray-500">+{task.tags.length - 2}</span>
                            )}
                          </div>
                        )}
                        
                        {isOverdue && (
                          <div className="flex items-center text-red-600 text-xs">
                            <AlertTriangle className="w-3 h-3 mr-1" />
                            Quá hạn
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Đang làm Column */}
            <div 
              className={`bg-blue-50 rounded-lg p-4 transition-colors ${
                dragOverColumn === 'in_progress' ? 'bg-blue-100 ring-2 ring-blue-400 ring-dashed' : ''
              }`}
              onDragOver={(e) => handleDragOver(e, 'in_progress')}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, 'in_progress')}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900 flex items-center">
                  <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                  Đang làm
                </h3>
                <span className="bg-blue-200 text-blue-700 text-xs px-2 py-1 rounded-full">
                  {displayTasks.filter(task => task.status === 'in_progress').length}
                </span>
              </div>
              <div className="space-y-3 min-h-[200px]">
                {displayTasks.filter(task => task.status === 'in_progress').map((task) => {
                  const isOverdue = new Date(task.dueDate) < new Date()
                  const assignee = employees.find(e => e.id === task.assignedTo)
                  
                  return (
                    <div 
                      key={task.id} 
                      draggable
                      onDragStart={(e) => handleDragStart(e, task)}
                      className={`bg-white p-3 rounded-lg shadow-sm border-l-4 hover:shadow-md transition-all cursor-move ${
                        isOverdue ? 'border-l-red-500 bg-red-50' : 'border-l-blue-300'
                      } ${draggedTask?.id === task.id ? 'opacity-50 transform scale-95' : ''}`}
                      onClick={() => {
                        setSelectedTask(task)
                        setShowDetailModal(true)
                      }}
                    >
                      <div className="space-y-2">
                        <h4 className="font-medium text-gray-900 text-sm">{task.title}</h4>
                        <p className="text-xs text-gray-600 line-clamp-2">{task.description}</p>
                        
                        <div className="flex items-center justify-between">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getPriorityColor(task.priority)}`}>
                            {getPriorityText(task.priority)}
                          </span>
                          <span className="text-xs text-gray-500">{formatDate(task.dueDate)}</span>
                        </div>
                        
                        {task.relatedType && (
                          <div className="flex items-center space-x-2">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getCategoryColor(task.relatedType)}`}>
                              {getCategoryText(task.relatedType)}
                            </span>
                            <span className="text-xs text-gray-500">{task.relatedName}</span>
                          </div>
                        )}
                        
                        {assignee && (
                          <div className="flex items-center space-x-2">
                            <div className="w-6 h-6 bg-blue-300 rounded-full flex items-center justify-center">
                              <span className="text-xs text-blue-700">{assignee.name.charAt(0)}</span>
                            </div>
                            <span className="text-xs text-gray-600">{assignee.name}</span>
                          </div>
                        )}
                        
                        {task.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {task.tags.slice(0, 2).map(tag => (
                              <span key={tag} className="px-1.5 py-0.5 text-xs font-medium rounded bg-blue-100 text-blue-800">
                                {tag}
                              </span>
                            ))}
                            {task.tags.length > 2 && (
                              <span className="px-1.5 py-0.5 text-xs text-gray-500">+{task.tags.length - 2}</span>
                            )}
                          </div>
                        )}
                        
                        {isOverdue && (
                          <div className="flex items-center text-red-600 text-xs">
                            <AlertTriangle className="w-3 h-3 mr-1" />
                            Quá hạn
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Hoàn tất Column */}
            <div 
              className={`bg-green-50 rounded-lg p-4 transition-colors ${
                dragOverColumn === 'completed' ? 'bg-green-100 ring-2 ring-green-400 ring-dashed' : ''
              }`}
              onDragOver={(e) => handleDragOver(e, 'completed')}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, 'completed')}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900 flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                  Hoàn tất
                </h3>
                <span className="bg-green-200 text-green-700 text-xs px-2 py-1 rounded-full">
                  {displayTasks.filter(task => task.status === 'completed').length}
                </span>
              </div>
              <div className="space-y-3 min-h-[200px]">
                {displayTasks.filter(task => task.status === 'completed').map((task) => {
                  const assignee = employees.find(e => e.id === task.assignedTo)
                  
                  return (
                    <div 
                      key={task.id} 
                      draggable
                      onDragStart={(e) => handleDragStart(e, task)}
                      className={`bg-white p-3 rounded-lg shadow-sm border-l-4 border-l-green-300 hover:shadow-md transition-all cursor-move opacity-90 ${
                        draggedTask?.id === task.id ? 'opacity-30 transform scale-95' : ''
                      }`}
                      onClick={() => {
                        setSelectedTask(task)
                        setShowDetailModal(true)
                      }}
                    >
                      <div className="space-y-2">
                        <h4 className="font-medium text-gray-900 text-sm line-through">{task.title}</h4>
                        <p className="text-xs text-gray-600 line-clamp-2">{task.description}</p>
                        
                        <div className="flex items-center justify-between">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getPriorityColor(task.priority)}`}>
                            {getPriorityText(task.priority)}
                          </span>
                          <span className="text-xs text-gray-500">{formatDate(task.dueDate)}</span>
                        </div>
                        
                        {task.relatedType && (
                          <div className="flex items-center space-x-2">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getCategoryColor(task.relatedType)}`}>
                              {getCategoryText(task.relatedType)}
                            </span>
                            <span className="text-xs text-gray-500">{task.relatedName}</span>
                          </div>
                        )}
                        
                        {assignee && (
                          <div className="flex items-center space-x-2">
                            <div className="w-6 h-6 bg-green-300 rounded-full flex items-center justify-center">
                              <span className="text-xs text-green-700">{assignee.name.charAt(0)}</span>
                            </div>
                            <span className="text-xs text-gray-600">{assignee.name}</span>
                          </div>
                        )}
                        
                        {task.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {task.tags.slice(0, 2).map(tag => (
                              <span key={tag} className="px-1.5 py-0.5 text-xs font-medium rounded bg-green-100 text-green-800">
                                {tag}
                              </span>
                            ))}
                            {task.tags.length > 2 && (
                              <span className="px-1.5 py-0.5 text-xs text-gray-500">+{task.tags.length - 2}</span>
                            )}
                          </div>
                        )}
                        
                        <div className="flex items-center text-green-600 text-xs">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Hoàn thành
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý Công việc</h1>
          <p className="text-gray-600">Quản lý toàn bộ công việc và lên lịch</p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8 px-6">
          <button
            onClick={() => setActiveTab('tasks')}
            className={`group inline-flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'tasks'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <span className={activeTab === 'tasks' ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-500'}>
              <List className="w-4 h-4" />
            </span>
            <span>Danh sách</span>
          </button>
          <button
            onClick={() => setActiveTab('calendar')}
            className={`group inline-flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'calendar'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <span className={activeTab === 'calendar' ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-500'}>
              <Calendar className="w-4 h-4" />
            </span>
            <span>Lịch</span>
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'tasks' && renderTasks()}
      {activeTab === 'calendar' && renderCalendar()}

      {/* Modals */}
      {/* Create View Modal */}
      {showCreateViewModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Tạo chế độ xem mới</h3>
              <button
                onClick={() => setShowCreateViewModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tên chế độ xem
                </label>
                <input
                  type="text"
                  value={newViewForm.name}
                  onChange={(e) => setNewViewForm(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Ví dụ: Công việc urgent của tôi"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mô tả (tùy chọn)
                </label>
                <textarea
                  rows={3}
                  value={newViewForm.description}
                  onChange={(e) => setNewViewForm(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Mô tả ngắn gọn về chế độ xem này"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bộ lọc
                </label>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <label className="text-sm text-gray-600 w-20">Trạng thái:</label>
                    <select 
                      value={newViewForm.filters.status}
                      onChange={(e) => setNewViewForm(prev => ({ 
                        ...prev, 
                        filters: { ...prev.filters, status: e.target.value }
                      }))}
                      className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded"
                    >
                      <option value="">Tất cả</option>
                      <option value="pending">Chờ xử lý</option>
                      <option value="in_progress">Đang thực hiện</option>
                      <option value="completed">Hoàn thành</option>
                    </select>
                  </div>

                  <div className="flex items-center space-x-3">
                    <label className="text-sm text-gray-600 w-20">Ưu tiên:</label>
                    <select 
                      value={newViewForm.filters.priority}
                      onChange={(e) => setNewViewForm(prev => ({ 
                        ...prev, 
                        filters: { ...prev.filters, priority: e.target.value }
                      }))}
                      className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded"
                    >
                      <option value="">Tất cả</option>
                      <option value="high">Cao</option>
                      <option value="medium">Trung bình</option>
                      <option value="low">Thấp</option>
                    </select>
                  </div>

                  <div className="flex items-center space-x-3">
                    <label className="text-sm text-gray-600 w-20">Loại:</label>
                    <select 
                      value={newViewForm.filters.relatedType}
                      onChange={(e) => setNewViewForm(prev => ({ 
                        ...prev, 
                        filters: { ...prev.filters, relatedType: e.target.value }
                      }))}
                      className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded"
                    >
                      <option value="">Tất cả</option>
                      <option value="leads">Leads</option>
                      <option value="customers">Khách hàng</option>
                      <option value="other">Khác</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Màu sắc
                </label>
                <div className="flex space-x-2">
                  {['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444', '#6B7280'].map((color) => (
                    <button
                      key={color}
                      onClick={() => setNewViewForm(prev => ({ ...prev, color }))}
                      className={`w-8 h-8 rounded-full border-2 shadow-md hover:scale-110 transition-transform ${
                        newViewForm.color === color ? 'border-gray-400' : 'border-white'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 p-4 border-t border-gray-200">
              <button
                onClick={() => {
                  setShowCreateViewModal(false)
                  // Reset form
                  setNewViewForm({
                    name: '',
                    description: '',
                    color: '#3B82F6',
                    filters: {
                      status: '',
                      priority: '',
                      team: '',
                      relatedType: ''
                    }
                  })
                }}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
              >
                Hủy
              </button>
              <button
                onClick={() => {
                  if (newViewForm.name.trim()) {
                    const newView: CustomView = {
                      id: Date.now().toString(),
                      name: newViewForm.name.trim(),
                      description: newViewForm.description.trim(),
                      color: newViewForm.color,
                      filters: newViewForm.filters,
                      createdAt: new Date().toISOString(),
                      createdBy: 'current_user'
                    }
                    
                    setCustomViews(prev => [...prev, newView])
                    
                    // Apply the new view filters and set as active
                    setStatusFilter(newView.filters.status || '')
                    setPriorityFilter(newView.filters.priority || '')
                    setAssigneeFilter(newView.filters.assignee || '')
                    setTagFilter('')
                    setDueDateFilter('')
                    setSelectedStatsFilter(newView.filters.relatedType || '')
                    setActiveViewType(newView.id)
                    
                    setShowCreateViewModal(false)
                    
                    // Reset form
                    setNewViewForm({
                      name: '',
                      description: '',
                      color: '#3B82F6',
                      filters: {
                        status: '',
                        priority: '',
                        team: '',
                        relatedType: ''
                      }
                    })
                  }
                }}
                disabled={!newViewForm.name.trim()}
                className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Tạo chế độ xem
              </button>
            </div>
          </div>
        </div>
      )}

      <CreateTaskModalSimple
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSave={handleCreateTask}
        employees={employees}
      />

      <CreateTaskModalSimple
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false)
          setSelectedTask(null)
        }}
        onSave={(taskData) => {
          if (selectedTask) {
            const updatedTask: Task = {
              ...selectedTask,
              ...taskData,
              updatedAt: new Date().toISOString()
            }
            handleUpdateTask(updatedTask)
          }
          setShowEditModal(false)
          setSelectedTask(null)
        }}
        employees={employees}
        initialTask={selectedTask || undefined}
        isEditMode={true}
      />

      <TaskDetailModal
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        task={selectedTask}
        onUpdate={handleUpdateTask}
        employees={employees}
      />

      <CreateEventModalSimple
        isOpen={showCreateEventModal}
        onClose={() => setShowCreateEventModal(false)}
        onSave={handleCreateEvent}
        selectedDate={selectedEventDate}
        employees={employees}
      />
    </div>
  )
}
