'use client'

import React, { useState, useRef } from 'react'
import { 
  Target, 
  TrendingUp, 
  Users, 
  DollarSign,
  Calendar,
  Plus,
  Edit,
  Trash2,
  BarChart3,
  Award,
  AlertCircle,
  CheckCircle,
  CheckSquare,
  Clock,
  Settings,
  Eye,
  Download,
  Filter,
  Search,
  MoreVertical,
  X,
  Building,
  User,
  GitBranch,
  FileText,
  MessageSquare,
  Paperclip,
  Send,
  ChevronDown,
  ChevronRight,
  PieChart,
  ShoppingCart,
  StickyNote,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Lock,
  MapPin
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from '@/components/ui/dropdown-menu'

interface KPITarget {
  id: number
  name: string
  description: string
  category: 'revenue' | 'leads' | 'conversion' | 'tasks' | 'custom'
  targetValue: number
  currentValue: number
  unit: string
  period: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly'
  startDate: string
  endDate: string
  assignedTo: string[]
  assignmentLevel: 'individual' | 'team' | 'department' | 'company'
  status: 'not_started' | 'active' | 'paused' | 'completed' | 'overdue'
  priority: 'low' | 'medium' | 'high' | 'critical'
  progressPercentage: number
  lastUpdated: string
  createdAt: string
  tags: string[]
  parentKPI?: number // ID của KPI cha (nếu là KPI con)
  childKPIs?: number[] // Danh sách ID KPI con
  rollupMethod: 'sum' | 'average' | 'max' | 'min' // Cách tính tổng hợp
  isAutoCalculated: boolean // Có tự động tính từ KPI con không
}

// Interface for comments with reply support
interface KPIComment {
  id: number
  authorName: string
  authorAvatar?: string
  content: string
  timestamp: string
  likes: number
  attachments?: { name: string; type: string }[]
  replies?: KPIComment[]
  replyingTo?: number // ID of parent comment being replied to
}

// Interface for tasks linked to KPI
interface KPITask {
  id: string
  title: string
  description: string
  relatedType: 'lead' | 'customer' | 'general' | 'order'
  relatedName: string
  relatedInfo?: string
  assignedTo: string
  assignedTeam: string
  dueDate: string
  priority: 'low' | 'medium' | 'high'
  status: 'pending' | 'in_progress' | 'completed'
  tags: string[]
  createdAt: string
  createdBy: string
}

export default function KPIManagement() {
  const [activeTab, setActiveTab] = useState<'overview' | 'targets' | 'reports' | 'settings'>('targets')
  const [activeTargetTab, setActiveTargetTab] = useState<'individual' | 'team' | 'department' | 'company'>('individual')
  const [showAddKPIModal, setShowAddKPIModal] = useState(false)
  const [showEditKPIModal, setShowEditKPIModal] = useState(false)
  const [selectedKPI, setSelectedKPI] = useState<KPITarget | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [startDateFilter, setStartDateFilter] = useState('')
  const [endDateFilter, setEndDateFilter] = useState('')
  const [assignmentLevelFilter, setAssignmentLevelFilter] = useState('all')
  // Modal states for tree diagram, report and detail views
  const [showTreeDiagramModal, setShowTreeDiagramModal] = useState(false)
  const [showReportModal, setShowReportModal] = useState(false)
  const [showTreeReportModal, setShowTreeReportModal] = useState(false) // Combined Tree+Report modal
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [selectedKPIForDetail, setSelectedKPIForDetail] = useState<KPITarget | null>(null)
  // Tree & Report combined modal tab
  const [treeReportTab, setTreeReportTab] = useState<'tree' | 'report'>('tree')
  // Detail modal tab
  const [detailModalTab, setDetailModalTab] = useState<'comment' | 'attachment'>('comment')
  // Zoom and pan for tree diagram
  const [treeZoom, setTreeZoom] = useState(85)
  const treeContainerRef = useRef<HTMLDivElement>(null)
  // Pan state for tree diagram drag
  const [treePan, setTreePan] = useState({ x: 0, y: 0 })
  const [isDraggingTree, setIsDraggingTree] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  // Month/year states for Add KPI form
  const [kpiMonth, setKpiMonth] = useState<number>(new Date().getMonth() + 1)
  const [kpiYear, setKpiYear] = useState<number>(new Date().getFullYear())
  const [kpiWeek, setKpiWeek] = useState<number>(1)
  // Month/year states for Company tab filters
  const [filterMonth, setFilterMonth] = useState<number>(new Date().getMonth() + 1)
  const [filterYear, setFilterYear] = useState<number>(new Date().getFullYear())
  // Emoji picker and mention states for comments
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [showMentionDropdown, setShowMentionDropdown] = useState(false)
  const [mentionSearch, setMentionSearch] = useState('')
  // Available users for @mention
  const mentionableUsers = [
    { id: 1, name: 'Nguyễn Văn An', avatar: 'NVA' },
    { id: 2, name: 'Trần Thị Bình', avatar: 'TTB' },
    { id: 3, name: 'Lê Văn Cường', avatar: 'LVC' },
    { id: 4, name: 'Phạm Thị Dung', avatar: 'PTD' },
    { id: 5, name: 'Hoài Nam Trần', avatar: 'HNT' },
    { id: 6, name: 'Minh Quang Nguyễn', avatar: 'MQN' },
  ]
  // Common emojis
  const commonEmojis = ['😀', '😊', '👍', '❤️', '🎉', '🔥', '👏', '💪', '✅', '⭐', '🙏', '😂']
  // Expanded state for individual tab grouping
  const [expandedEmployees, setExpandedEmployees] = useState<string[]>(['Hoài Nam Trần', 'Minh Quang Nguyễn', 'Lê Văn C', 'Phạm Thị D', 'Hoàng Văn E', 'Đỗ Thị F', 'Vũ Văn G', 'Mai Thị H'])
  // Expanded state for team tab grouping
  const [expandedTeams, setExpandedTeams] = useState<string[]>(['Team A Sales', 'Team B Sales', 'Team Marketing', 'Team Support'])
  // Expanded state for department tab grouping
  const [expandedDepartments, setExpandedDepartments] = useState<string[]>(['Phòng Sales', 'Phòng Marketing', 'Phòng Hỗ trợ'])
  // Expanded state for tree nodes in mindmap - bao gồm cả 4 loại KPI cấp công ty
  const [expandedTreeNodes, setExpandedTreeNodes] = useState<number[]>([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20])
  // Expanded state for KPI tree in detail modal
  const [expandedDetailKPIs, setExpandedDetailKPIs] = useState<number[]>([])
  // Company tab view mode
  const [companyViewMode, setCompanyViewMode] = useState<'tree' | 'report'>('report')
  // Comment states
  const [replyingToCommentId, setReplyingToCommentId] = useState<number | null>(null)
  const [newCommentText, setNewCommentText] = useState('')
  const [newReplyText, setNewReplyText] = useState('')
  // Sample comments data
  const [kpiComments] = useState<KPIComment[]>([
    {
      id: 1,
      authorName: 'Nguyễn Văn Long',
      content: 'Hi',
      timestamp: '09:56 Mar 05, 2026',
      likes: 1,
      replies: [
        {
          id: 2,
          authorName: 'Nguyễn Văn Long',
          content: 'hihi',
          timestamp: '09:56 Mar 05, 2026',
          likes: 0,
          replyingTo: 1
        }
      ]
    },
    {
      id: 3,
      authorName: 'Nguyễn Văn Long',
      content: 'Xin chào',
      timestamp: '09:56 Mar 05, 2026',
      likes: 1,
      replies: [
        {
          id: 4,
          authorName: 'Nguyễn Văn Long',
          content: 'File',
          timestamp: '09:57 Mar 05, 2026',
          likes: 0,
          attachments: [{ name: 'lead-sample 1.xlsx', type: 'xlsx' }],
          replyingTo: 3
        }
      ]
    }
  ])
  // Task states for individual KPI detail
  const [kpiTasks, setKpiTasks] = useState<KPITask[]>([
    {
      id: 'task-1',
      title: 'Gọi lead Công ty ABC',
      description: 'Liên hệ tư vấn gói phần mềm quản lý nhân sự',
      relatedType: 'lead',
      relatedName: 'Công ty ABC',
      relatedInfo: '0987654321',
      assignedTo: 'Nguyễn Văn An',
      assignedTeam: 'Team A',
      dueDate: '2025-07-15T10:00:00',
      priority: 'high',
      status: 'pending',
      tags: ['Khẩn cấp', 'VIP'],
      createdAt: '2025-07-01T09:00:00',
      createdBy: 'Nguyễn Văn An'
    },
    {
      id: 'task-2',
      title: 'Gửi hợp đồng ORD-001',
      description: 'Gửi hợp đồng phần mềm CRM cho Công ty ABC',
      relatedType: 'order',
      relatedName: 'Hợp đồng ABC',
      relatedInfo: 'Công việc chung',
      assignedTo: 'Nguyễn Văn An',
      assignedTeam: 'Team A',
      dueDate: '2025-07-10T15:00:00',
      priority: 'medium',
      status: 'in_progress',
      tags: ['Hợp đồng'],
      createdAt: '2025-07-01T11:00:00',
      createdBy: 'Nguyễn Văn An'
    },
    {
      id: 'task-3',
      title: 'Chăm sóc khách hàng VIP',
      description: 'Liên hệ chăm sóc và tư vấn sản phẩm mới',
      relatedType: 'customer',
      relatedName: 'Công ty ABC',
      relatedInfo: '0987654321',
      assignedTo: 'Trần Thị Bình',
      assignedTeam: 'Team B',
      dueDate: '2025-07-20T14:00:00',
      priority: 'high',
      status: 'pending',
      tags: ['VIP', 'Chăm sóc'],
      createdAt: '2025-07-01T10:00:00',
      createdBy: 'Nguyễn Văn An'
    },
    {
      id: 'task-4',
      title: 'Demo sản phẩm cho DEF Technology',
      description: 'Thực hiện demo tính năng quản lý dự án và báo cáo',
      relatedType: 'lead',
      relatedName: 'Công ty DEF Technology',
      relatedInfo: '0987654324',
      assignedTo: 'Phạm Thị Dung',
      assignedTeam: 'Team B',
      dueDate: '2025-07-03T15:00:00',
      priority: 'high',
      status: 'pending',
      tags: ['Demo', 'Tech', 'Hot'],
      createdAt: '2025-07-01T10:15:00',
      createdBy: 'Nguyễn Văn An'
    },
    {
      id: 'task-5',
      title: 'Follow up lead Lê Thị Mai',
      description: 'Gọi điện follow up sau khi gửi proposal',
      relatedType: 'lead',
      relatedName: 'Lê Thị Mai',
      relatedInfo: '0987654325',
      assignedTo: 'Nguyễn Văn An',
      assignedTeam: 'Team A',
      dueDate: '2025-07-02T09:30:00',
      priority: 'medium',
      status: 'pending',
      tags: ['Follow up', 'SME'],
      createdAt: '2025-07-01T11:00:00',
      createdBy: 'Lê Văn Cường'
    }
  ])
  const [openTaskDropdownId, setOpenTaskDropdownId] = useState<string | null>(null)
  const [showTaskDetailModal, setShowTaskDetailModal] = useState(false)
  const [showTaskEditModal, setShowTaskEditModal] = useState(false)
  const [selectedTask, setSelectedTask] = useState<KPITask | null>(null)
  const [newKPI, setNewKPI] = useState({
    name: '',
    description: '',
    category: 'revenue' as KPITarget['category'],
    targetValue: 0,
    unit: 'VND',
    period: 'monthly' as KPITarget['period'],
    assignedTo: [] as string[],
    assignmentLevel: 'individual' as KPITarget['assignmentLevel'],
    priority: 'medium' as KPITarget['priority'],
    startDate: '',
    endDate: '',
    tags: [] as string[],
    rollupMethod: 'sum' as KPITarget['rollupMethod'],
    isAutoCalculated: false,
    // New fields for redesigned modal
    linkedGroup: '', // Link to team/group
    indicatorGroup: '', // Indicator group
    indicator: '', // Selected indicator
    watchers: [] as string[], // Followers/watchers
    status: 'not_started' as 'not_started' | 'active' | 'paused' | 'completed' | 'overdue'
  })

  // Indicator groups for KPI (4 loại chính: Doanh thu, Chuyển đổi, Công việc, Leads)
  const indicatorGroups = [
    {
      id: 'revenue',
      name: 'Doanh thu',
      indicators: [
        { id: 'total_revenue', name: 'Tổng doanh thu', unit: 'VND' },
        { id: 'new_revenue', name: 'Doanh thu mới', unit: 'VND' },
        { id: 'recurring_revenue', name: 'Doanh thu định kỳ', unit: 'VND' },
        { id: 'average_order_value', name: 'Giá trị đơn hàng trung bình', unit: 'VND' },
        { id: 'gross_profit', name: 'Lợi nhuận gộp', unit: 'VND' }
      ]
    },
    {
      id: 'leads',
      name: 'Leads',
      indicators: [
        { id: 'new_leads', name: 'Leads mới', unit: 'leads' },
        { id: 'qualified_leads', name: 'Leads chất lượng (MQL)', unit: 'leads' },
        { id: 'sales_qualified_leads', name: 'Leads sales (SQL)', unit: 'leads' },
        { id: 'hot_leads', name: 'Leads nóng', unit: 'leads' },
        { id: 'leads_from_campaign', name: 'Leads từ chiến dịch', unit: 'leads' }
      ]
    },
    {
      id: 'conversion',
      name: 'Chuyển đổi',
      indicators: [
        { id: 'lead_to_opportunity', name: 'Tỷ lệ Lead → Cơ hội', unit: '%' },
        { id: 'opportunity_to_customer', name: 'Tỷ lệ Cơ hội → Khách hàng', unit: '%' },
        { id: 'lead_to_customer', name: 'Tỷ lệ Lead → Khách hàng', unit: '%' },
        { id: 'quote_to_order', name: 'Tỷ lệ Báo giá → Đơn hàng', unit: '%' },
        { id: 'win_rate', name: 'Tỷ lệ thắng deal', unit: '%' }
      ]
    },
    {
      id: 'tasks',
      name: 'Công việc',
      indicators: [
        { id: 'calls_made', name: 'Cuộc gọi thực hiện', unit: 'cuộc gọi' },
        { id: 'meetings_held', name: 'Cuộc họp tổ chức', unit: 'cuộc họp' },
        { id: 'emails_sent', name: 'Email gửi', unit: 'email' },
        { id: 'demos_completed', name: 'Demo hoàn thành', unit: 'demo' },
        { id: 'proposals_sent', name: 'Báo giá gửi', unit: 'báo giá' },
        { id: 'tasks_completed', name: 'Task hoàn thành', unit: 'task' },
        { id: 'customer_visits', name: 'Khách hàng gặp mặt', unit: 'lượt' }
      ]
    }
  ]

  // Sample KPI data with hierarchical structure - 4 loại: Doanh thu, Leads, Chuyển đổi, Công việc
  // Hierarchy: Công ty → Phòng ban → Team → Cá nhân
  const [kpiTargets, setKpiTargets] = useState<KPITarget[]>([
    // ============================================
    // COMPANY LEVEL KPIs (4 loại KPI cấp công ty)
    // ============================================
    {
      id: 1,
      name: "Doanh thu tháng - Công ty",
      description: "Mục tiêu tổng doanh thu hàng tháng của toàn công ty",
      category: 'revenue',
      targetValue: 10000000000,
      currentValue: 6850000000,
      unit: 'VND',
      period: 'monthly',
      startDate: '2026-03-01',
      endDate: '2026-03-31',
      assignedTo: ['Toàn công ty'],
      assignmentLevel: 'company',
      status: 'active',
      priority: 'critical',
      progressPercentage: 68.5,
      lastUpdated: '2026-03-10T10:00:00',
      createdAt: '2026-03-01T08:00:00',
      tags: ['doanh thu', 'tháng 3', 'Q1'],
      childKPIs: [5, 6, 7],
      rollupMethod: 'sum',
      isAutoCalculated: true
    },
    {
      id: 2,
      name: "Leads mới tháng - Công ty",
      description: "Tổng số leads mới cần thu hút hàng tháng của toàn công ty",
      category: 'leads',
      targetValue: 500,
      currentValue: 342,
      unit: 'leads',
      period: 'monthly',
      startDate: '2026-03-01',
      endDate: '2026-03-31',
      assignedTo: ['Toàn công ty'],
      assignmentLevel: 'company',
      status: 'active',
      priority: 'critical',
      progressPercentage: 68.4,
      lastUpdated: '2026-03-10T10:00:00',
      createdAt: '2026-03-01T08:00:00',
      tags: ['leads', 'tháng 3', 'Q1'],
      childKPIs: [8, 9, 10],
      rollupMethod: 'sum',
      isAutoCalculated: true
    },
    {
      id: 3,
      name: "Tỷ lệ chuyển đổi Lead → Khách hàng - Công ty",
      description: "Tỷ lệ chuyển đổi từ lead sang khách hàng của toàn công ty",
      category: 'conversion',
      targetValue: 25,
      currentValue: 22.5,
      unit: '%',
      period: 'monthly',
      startDate: '2026-03-01',
      endDate: '2026-03-31',
      assignedTo: ['Toàn công ty'],
      assignmentLevel: 'company',
      status: 'active',
      priority: 'high',
      progressPercentage: 90,
      lastUpdated: '2026-03-10T10:00:00',
      createdAt: '2026-03-01T08:00:00',
      tags: ['chuyển đổi', 'tháng 3', 'Q1'],
      childKPIs: [11, 12, 13],
      rollupMethod: 'average',
      isAutoCalculated: true
    },
    {
      id: 4,
      name: "Công việc hoàn thành tháng - Công ty",
      description: "Tổng số công việc (cuộc gọi, họp, demo) cần hoàn thành hàng tháng",
      category: 'tasks',
      targetValue: 2000,
      currentValue: 1420,
      unit: 'công việc',
      period: 'monthly',
      startDate: '2026-03-01',
      endDate: '2026-03-31',
      assignedTo: ['Toàn công ty'],
      assignmentLevel: 'company',
      status: 'active',
      priority: 'high',
      progressPercentage: 71,
      lastUpdated: '2026-03-10T10:00:00',
      createdAt: '2026-03-01T08:00:00',
      tags: ['công việc', 'tháng 3', 'Q1'],
      childKPIs: [14, 15, 16],
      rollupMethod: 'sum',
      isAutoCalculated: true
    },

    // ============================================
    // DEPARTMENT LEVEL KPIs - PHÒNG SALES
    // ============================================
    {
      id: 5,
      name: "Doanh thu tháng - Phòng Sales",
      description: "Mục tiêu doanh thu hàng tháng của phòng Sales",
      category: 'revenue',
      targetValue: 6000000000,
      currentValue: 4200000000,
      unit: 'VND',
      period: 'monthly',
      startDate: '2026-03-01',
      endDate: '2026-03-31',
      assignedTo: ['Phòng Sales'],
      assignmentLevel: 'department',
      status: 'active',
      priority: 'critical',
      progressPercentage: 70,
      lastUpdated: '2026-03-10T10:00:00',
      createdAt: '2026-03-01T08:00:00',
      tags: ['doanh thu', 'sales'],
      parentKPI: 1,
      childKPIs: [17, 18],
      rollupMethod: 'sum',
      isAutoCalculated: true
    },
    {
      id: 8,
      name: "Leads mới tháng - Phòng Sales",
      description: "Số leads mới phòng Sales cần tạo/tiếp nhận hàng tháng",
      category: 'leads',
      targetValue: 150,
      currentValue: 98,
      unit: 'leads',
      period: 'monthly',
      startDate: '2026-03-01',
      endDate: '2026-03-31',
      assignedTo: ['Phòng Sales'],
      assignmentLevel: 'department',
      status: 'active',
      priority: 'high',
      progressPercentage: 65.3,
      lastUpdated: '2026-03-10T10:00:00',
      createdAt: '2026-03-01T08:00:00',
      tags: ['leads', 'sales'],
      parentKPI: 2,
      childKPIs: [23, 24],
      rollupMethod: 'sum',
      isAutoCalculated: true
    },
    {
      id: 11,
      name: "Tỷ lệ chuyển đổi - Phòng Sales",
      description: "Tỷ lệ chuyển đổi lead sang khách hàng của phòng Sales",
      category: 'conversion',
      targetValue: 30,
      currentValue: 27,
      unit: '%',
      period: 'monthly',
      startDate: '2026-03-01',
      endDate: '2026-03-31',
      assignedTo: ['Phòng Sales'],
      assignmentLevel: 'department',
      status: 'active',
      priority: 'high',
      progressPercentage: 90,
      lastUpdated: '2026-03-10T10:00:00',
      createdAt: '2026-03-01T08:00:00',
      tags: ['chuyển đổi', 'sales'],
      parentKPI: 3,
      childKPIs: [29, 30],
      rollupMethod: 'average',
      isAutoCalculated: true
    },
    {
      id: 14,
      name: "Công việc hoàn thành - Phòng Sales",
      description: "Tổng công việc phòng Sales cần hoàn thành hàng tháng",
      category: 'tasks',
      targetValue: 1200,
      currentValue: 876,
      unit: 'công việc',
      period: 'monthly',
      startDate: '2026-03-01',
      endDate: '2026-03-31',
      assignedTo: ['Phòng Sales'],
      assignmentLevel: 'department',
      status: 'active',
      priority: 'medium',
      progressPercentage: 73,
      lastUpdated: '2026-03-10T10:00:00',
      createdAt: '2026-03-01T08:00:00',
      tags: ['công việc', 'sales'],
      parentKPI: 4,
      childKPIs: [35, 36],
      rollupMethod: 'sum',
      isAutoCalculated: true
    },

    // ============================================
    // DEPARTMENT LEVEL KPIs - PHÒNG MARKETING
    // ============================================
    {
      id: 6,
      name: "Doanh thu tháng - Phòng Marketing",
      description: "Mục tiêu doanh thu hàng tháng của phòng Marketing",
      category: 'revenue',
      targetValue: 2500000000,
      currentValue: 1650000000,
      unit: 'VND',
      period: 'monthly',
      startDate: '2026-03-01',
      endDate: '2026-03-31',
      assignedTo: ['Phòng Marketing'],
      assignmentLevel: 'department',
      status: 'active',
      priority: 'high',
      progressPercentage: 66,
      lastUpdated: '2026-03-10T10:00:00',
      createdAt: '2026-03-01T08:00:00',
      tags: ['doanh thu', 'marketing'],
      parentKPI: 1,
      childKPIs: [19],
      rollupMethod: 'sum',
      isAutoCalculated: true
    },
    {
      id: 9,
      name: "Leads mới tháng - Phòng Marketing",
      description: "Số leads mới phòng Marketing cần tạo/thu hút hàng tháng",
      category: 'leads',
      targetValue: 300,
      currentValue: 215,
      unit: 'leads',
      period: 'monthly',
      startDate: '2026-03-01',
      endDate: '2026-03-31',
      assignedTo: ['Phòng Marketing'],
      assignmentLevel: 'department',
      status: 'active',
      priority: 'critical',
      progressPercentage: 71.7,
      lastUpdated: '2026-03-10T10:00:00',
      createdAt: '2026-03-01T08:00:00',
      tags: ['leads', 'marketing'],
      parentKPI: 2,
      childKPIs: [25],
      rollupMethod: 'sum',
      isAutoCalculated: true
    },
    {
      id: 12,
      name: "Tỷ lệ chuyển đổi - Phòng Marketing",
      description: "Tỷ lệ chuyển đổi lead từ marketing sang cơ hội",
      category: 'conversion',
      targetValue: 20,
      currentValue: 18,
      unit: '%',
      period: 'monthly',
      startDate: '2026-03-01',
      endDate: '2026-03-31',
      assignedTo: ['Phòng Marketing'],
      assignmentLevel: 'department',
      status: 'active',
      priority: 'high',
      progressPercentage: 90,
      lastUpdated: '2026-03-10T10:00:00',
      createdAt: '2026-03-01T08:00:00',
      tags: ['chuyển đổi', 'marketing'],
      parentKPI: 3,
      childKPIs: [31],
      rollupMethod: 'average',
      isAutoCalculated: true
    },
    {
      id: 15,
      name: "Công việc hoàn thành - Phòng Marketing",
      description: "Tổng công việc phòng Marketing cần hoàn thành hàng tháng",
      category: 'tasks',
      targetValue: 500,
      currentValue: 344,
      unit: 'công việc',
      period: 'monthly',
      startDate: '2026-03-01',
      endDate: '2026-03-31',
      assignedTo: ['Phòng Marketing'],
      assignmentLevel: 'department',
      status: 'active',
      priority: 'medium',
      progressPercentage: 68.8,
      lastUpdated: '2026-03-10T10:00:00',
      createdAt: '2026-03-01T08:00:00',
      tags: ['công việc', 'marketing'],
      parentKPI: 4,
      childKPIs: [37],
      rollupMethod: 'sum',
      isAutoCalculated: true
    },

    // ============================================
    // DEPARTMENT LEVEL KPIs - PHÒNG HỖ TRỢ
    // ============================================
    {
      id: 7,
      name: "Doanh thu tháng - Phòng Hỗ trợ",
      description: "Mục tiêu doanh thu từ upsell/renewal của phòng Hỗ trợ",
      category: 'revenue',
      targetValue: 1500000000,
      currentValue: 1000000000,
      unit: 'VND',
      period: 'monthly',
      startDate: '2026-03-01',
      endDate: '2026-03-31',
      assignedTo: ['Phòng Hỗ trợ'],
      assignmentLevel: 'department',
      status: 'active',
      priority: 'medium',
      progressPercentage: 66.7,
      lastUpdated: '2026-03-10T10:00:00',
      createdAt: '2026-03-01T08:00:00',
      tags: ['doanh thu', 'hỗ trợ'],
      parentKPI: 1,
      childKPIs: [20],
      rollupMethod: 'sum',
      isAutoCalculated: true
    },
    {
      id: 10,
      name: "Leads mới tháng - Phòng Hỗ trợ",
      description: "Số referral leads từ khách hàng cũ do phòng Hỗ trợ thu thập",
      category: 'leads',
      targetValue: 50,
      currentValue: 29,
      unit: 'leads',
      period: 'monthly',
      startDate: '2026-03-01',
      endDate: '2026-03-31',
      assignedTo: ['Phòng Hỗ trợ'],
      assignmentLevel: 'department',
      status: 'active',
      priority: 'medium',
      progressPercentage: 58,
      lastUpdated: '2026-03-10T10:00:00',
      createdAt: '2026-03-01T08:00:00',
      tags: ['leads', 'hỗ trợ', 'referral'],
      parentKPI: 2,
      childKPIs: [26],
      rollupMethod: 'sum',
      isAutoCalculated: true
    },
    {
      id: 13,
      name: "Tỷ lệ chuyển đổi - Phòng Hỗ trợ",
      description: "Tỷ lệ chuyển đổi từ yêu cầu hỗ trợ sang upsell",
      category: 'conversion',
      targetValue: 15,
      currentValue: 12,
      unit: '%',
      period: 'monthly',
      startDate: '2026-03-01',
      endDate: '2026-03-31',
      assignedTo: ['Phòng Hỗ trợ'],
      assignmentLevel: 'department',
      status: 'active',
      priority: 'medium',
      progressPercentage: 80,
      lastUpdated: '2026-03-10T10:00:00',
      createdAt: '2026-03-01T08:00:00',
      tags: ['chuyển đổi', 'hỗ trợ'],
      parentKPI: 3,
      childKPIs: [32],
      rollupMethod: 'average',
      isAutoCalculated: true
    },
    {
      id: 16,
      name: "Công việc hoàn thành - Phòng Hỗ trợ",
      description: "Tổng ticket/task phòng Hỗ trợ cần xử lý hàng tháng",
      category: 'tasks',
      targetValue: 300,
      currentValue: 200,
      unit: 'công việc',
      period: 'monthly',
      startDate: '2026-03-01',
      endDate: '2026-03-31',
      assignedTo: ['Phòng Hỗ trợ'],
      assignmentLevel: 'department',
      status: 'active',
      priority: 'medium',
      progressPercentage: 66.7,
      lastUpdated: '2026-03-10T10:00:00',
      createdAt: '2026-03-01T08:00:00',
      tags: ['công việc', 'hỗ trợ'],
      parentKPI: 4,
      childKPIs: [38],
      rollupMethod: 'sum',
      isAutoCalculated: true
    },

    // ============================================
    // TEAM LEVEL KPIs - TEAM A SALES (Doanh thu, Leads, Chuyển đổi, Công việc)
    // ============================================
    {
      id: 17,
      name: "Doanh thu tháng - Team A Sales",
      description: "Mục tiêu doanh thu hàng tháng của Team A phòng Sales",
      category: 'revenue',
      targetValue: 3500000000,
      currentValue: 2520000000,
      unit: 'VND',
      period: 'monthly',
      startDate: '2026-03-01',
      endDate: '2026-03-31',
      assignedTo: ['Team A Sales'],
      assignmentLevel: 'team',
      status: 'active',
      priority: 'critical',
      progressPercentage: 72,
      lastUpdated: '2026-03-10T10:00:00',
      createdAt: '2026-03-01T08:00:00',
      tags: ['doanh thu', 'team a', 'sales'],
      parentKPI: 5,
      childKPIs: [39, 40],
      rollupMethod: 'sum',
      isAutoCalculated: true
    },
    {
      id: 23,
      name: "Leads mới tháng - Team A Sales",
      description: "Số leads mới Team A Sales cần tạo/tiếp nhận hàng tháng",
      category: 'leads',
      targetValue: 80,
      currentValue: 54,
      unit: 'leads',
      period: 'monthly',
      startDate: '2026-03-01',
      endDate: '2026-03-31',
      assignedTo: ['Team A Sales'],
      assignmentLevel: 'team',
      status: 'active',
      priority: 'high',
      progressPercentage: 67.5,
      lastUpdated: '2026-03-10T10:00:00',
      createdAt: '2026-03-01T08:00:00',
      tags: ['leads', 'team a', 'sales'],
      parentKPI: 8,
      childKPIs: [45, 46],
      rollupMethod: 'sum',
      isAutoCalculated: true
    },
    {
      id: 29,
      name: "Tỷ lệ chuyển đổi - Team A Sales",
      description: "Tỷ lệ chuyển đổi lead sang khách hàng của Team A Sales",
      category: 'conversion',
      targetValue: 32,
      currentValue: 29,
      unit: '%',
      period: 'monthly',
      startDate: '2026-03-01',
      endDate: '2026-03-31',
      assignedTo: ['Team A Sales'],
      assignmentLevel: 'team',
      status: 'active',
      priority: 'high',
      progressPercentage: 90.6,
      lastUpdated: '2026-03-10T10:00:00',
      createdAt: '2026-03-01T08:00:00',
      tags: ['chuyển đổi', 'team a', 'sales'],
      parentKPI: 11,
      childKPIs: [51, 52],
      rollupMethod: 'average',
      isAutoCalculated: true
    },
    {
      id: 35,
      name: "Công việc hoàn thành - Team A Sales",
      description: "Tổng công việc Team A Sales cần hoàn thành hàng tháng",
      category: 'tasks',
      targetValue: 700,
      currentValue: 518,
      unit: 'công việc',
      period: 'monthly',
      startDate: '2026-03-01',
      endDate: '2026-03-31',
      assignedTo: ['Team A Sales'],
      assignmentLevel: 'team',
      status: 'active',
      priority: 'medium',
      progressPercentage: 74,
      lastUpdated: '2026-03-10T10:00:00',
      createdAt: '2026-03-01T08:00:00',
      tags: ['công việc', 'team a', 'sales'],
      parentKPI: 14,
      childKPIs: [57, 58],
      rollupMethod: 'sum',
      isAutoCalculated: true
    },

    // ============================================
    // TEAM LEVEL KPIs - TEAM B SALES (Doanh thu, Leads, Chuyển đổi, Công việc)
    // ============================================
    {
      id: 18,
      name: "Doanh thu tháng - Team B Sales",
      description: "Mục tiêu doanh thu hàng tháng của Team B phòng Sales",
      category: 'revenue',
      targetValue: 2500000000,
      currentValue: 1680000000,
      unit: 'VND',
      period: 'monthly',
      startDate: '2026-03-01',
      endDate: '2026-03-31',
      assignedTo: ['Team B Sales'],
      assignmentLevel: 'team',
      status: 'active',
      priority: 'high',
      progressPercentage: 67.2,
      lastUpdated: '2026-03-10T10:00:00',
      createdAt: '2026-03-01T08:00:00',
      tags: ['doanh thu', 'team b', 'sales'],
      parentKPI: 5,
      childKPIs: [41, 42],
      rollupMethod: 'sum',
      isAutoCalculated: true
    },
    {
      id: 24,
      name: "Leads mới tháng - Team B Sales",
      description: "Số leads mới Team B Sales cần tạo/tiếp nhận hàng tháng",
      category: 'leads',
      targetValue: 70,
      currentValue: 44,
      unit: 'leads',
      period: 'monthly',
      startDate: '2026-03-01',
      endDate: '2026-03-31',
      assignedTo: ['Team B Sales'],
      assignmentLevel: 'team',
      status: 'active',
      priority: 'high',
      progressPercentage: 62.9,
      lastUpdated: '2026-03-10T10:00:00',
      createdAt: '2026-03-01T08:00:00',
      tags: ['leads', 'team b', 'sales'],
      parentKPI: 8,
      childKPIs: [47, 48],
      rollupMethod: 'sum',
      isAutoCalculated: true
    },
    {
      id: 30,
      name: "Tỷ lệ chuyển đổi - Team B Sales",
      description: "Tỷ lệ chuyển đổi lead sang khách hàng của Team B Sales",
      category: 'conversion',
      targetValue: 28,
      currentValue: 25,
      unit: '%',
      period: 'monthly',
      startDate: '2026-03-01',
      endDate: '2026-03-31',
      assignedTo: ['Team B Sales'],
      assignmentLevel: 'team',
      status: 'active',
      priority: 'high',
      progressPercentage: 89.3,
      lastUpdated: '2026-03-10T10:00:00',
      createdAt: '2026-03-01T08:00:00',
      tags: ['chuyển đổi', 'team b', 'sales'],
      parentKPI: 11,
      childKPIs: [53, 54],
      rollupMethod: 'average',
      isAutoCalculated: true
    },
    {
      id: 36,
      name: "Công việc hoàn thành - Team B Sales",
      description: "Tổng công việc Team B Sales cần hoàn thành hàng tháng",
      category: 'tasks',
      targetValue: 500,
      currentValue: 358,
      unit: 'công việc',
      period: 'monthly',
      startDate: '2026-03-01',
      endDate: '2026-03-31',
      assignedTo: ['Team B Sales'],
      assignmentLevel: 'team',
      status: 'active',
      priority: 'medium',
      progressPercentage: 71.6,
      lastUpdated: '2026-03-10T10:00:00',
      createdAt: '2026-03-01T08:00:00',
      tags: ['công việc', 'team b', 'sales'],
      parentKPI: 14,
      childKPIs: [59, 60],
      rollupMethod: 'sum',
      isAutoCalculated: true
    },

    // ============================================
    // TEAM LEVEL KPIs - TEAM MARKETING (Doanh thu, Leads, Chuyển đổi, Công việc)
    // ============================================
    {
      id: 19,
      name: "Doanh thu tháng - Team Marketing",
      description: "Mục tiêu doanh thu từ chiến dịch marketing",
      category: 'revenue',
      targetValue: 2500000000,
      currentValue: 1650000000,
      unit: 'VND',
      period: 'monthly',
      startDate: '2026-03-01',
      endDate: '2026-03-31',
      assignedTo: ['Team Marketing'],
      assignmentLevel: 'team',
      status: 'active',
      priority: 'high',
      progressPercentage: 66,
      lastUpdated: '2026-03-10T10:00:00',
      createdAt: '2026-03-01T08:00:00',
      tags: ['doanh thu', 'marketing'],
      parentKPI: 6,
      childKPIs: [43, 44],
      rollupMethod: 'sum',
      isAutoCalculated: true
    },
    {
      id: 25,
      name: "Leads mới tháng - Team Marketing",
      description: "Số leads mới Team Marketing cần tạo từ các kênh",
      category: 'leads',
      targetValue: 300,
      currentValue: 215,
      unit: 'leads',
      period: 'monthly',
      startDate: '2026-03-01',
      endDate: '2026-03-31',
      assignedTo: ['Team Marketing'],
      assignmentLevel: 'team',
      status: 'active',
      priority: 'critical',
      progressPercentage: 71.7,
      lastUpdated: '2026-03-10T10:00:00',
      createdAt: '2026-03-01T08:00:00',
      tags: ['leads', 'marketing'],
      parentKPI: 9,
      childKPIs: [49, 50],
      rollupMethod: 'sum',
      isAutoCalculated: true
    },
    {
      id: 31,
      name: "Tỷ lệ chuyển đổi - Team Marketing",
      description: "Tỷ lệ chuyển đổi lead từ marketing sang MQL",
      category: 'conversion',
      targetValue: 20,
      currentValue: 18,
      unit: '%',
      period: 'monthly',
      startDate: '2026-03-01',
      endDate: '2026-03-31',
      assignedTo: ['Team Marketing'],
      assignmentLevel: 'team',
      status: 'active',
      priority: 'high',
      progressPercentage: 90,
      lastUpdated: '2026-03-10T10:00:00',
      createdAt: '2026-03-01T08:00:00',
      tags: ['chuyển đổi', 'marketing'],
      parentKPI: 12,
      childKPIs: [55, 56],
      rollupMethod: 'average',
      isAutoCalculated: true
    },
    {
      id: 37,
      name: "Công việc hoàn thành - Team Marketing",
      description: "Tổng công việc Team Marketing cần hoàn thành hàng tháng",
      category: 'tasks',
      targetValue: 500,
      currentValue: 344,
      unit: 'công việc',
      period: 'monthly',
      startDate: '2026-03-01',
      endDate: '2026-03-31',
      assignedTo: ['Team Marketing'],
      assignmentLevel: 'team',
      status: 'active',
      priority: 'medium',
      progressPercentage: 68.8,
      lastUpdated: '2026-03-10T10:00:00',
      createdAt: '2026-03-01T08:00:00',
      tags: ['công việc', 'marketing'],
      parentKPI: 15,
      childKPIs: [61, 62],
      rollupMethod: 'sum',
      isAutoCalculated: true
    },

    // ============================================
    // TEAM LEVEL KPIs - TEAM SUPPORT (Doanh thu, Leads, Chuyển đổi, Công việc)
    // ============================================
    {
      id: 20,
      name: "Doanh thu tháng - Team Support",
      description: "Mục tiêu doanh thu từ renewal/upsell qua hỗ trợ",
      category: 'revenue',
      targetValue: 1500000000,
      currentValue: 1000000000,
      unit: 'VND',
      period: 'monthly',
      startDate: '2026-03-01',
      endDate: '2026-03-31',
      assignedTo: ['Team Support'],
      assignmentLevel: 'team',
      status: 'active',
      priority: 'medium',
      progressPercentage: 66.7,
      lastUpdated: '2026-03-10T10:00:00',
      createdAt: '2026-03-01T08:00:00',
      tags: ['doanh thu', 'support'],
      parentKPI: 7,
      childKPIs: [63, 64],
      rollupMethod: 'sum',
      isAutoCalculated: true
    },
    {
      id: 26,
      name: "Leads referral - Team Support",
      description: "Số leads referral từ khách hàng cũ qua Team Support",
      category: 'leads',
      targetValue: 50,
      currentValue: 29,
      unit: 'leads',
      period: 'monthly',
      startDate: '2026-03-01',
      endDate: '2026-03-31',
      assignedTo: ['Team Support'],
      assignmentLevel: 'team',
      status: 'active',
      priority: 'medium',
      progressPercentage: 58,
      lastUpdated: '2026-03-10T10:00:00',
      createdAt: '2026-03-01T08:00:00',
      tags: ['leads', 'support', 'referral'],
      parentKPI: 10,
      childKPIs: [65, 66],
      rollupMethod: 'sum',
      isAutoCalculated: true
    },
    {
      id: 32,
      name: "Tỷ lệ upsell - Team Support",
      description: "Tỷ lệ chuyển đổi từ hỗ trợ sang upsell",
      category: 'conversion',
      targetValue: 15,
      currentValue: 12,
      unit: '%',
      period: 'monthly',
      startDate: '2026-03-01',
      endDate: '2026-03-31',
      assignedTo: ['Team Support'],
      assignmentLevel: 'team',
      status: 'active',
      priority: 'medium',
      progressPercentage: 80,
      lastUpdated: '2026-03-10T10:00:00',
      createdAt: '2026-03-01T08:00:00',
      tags: ['chuyển đổi', 'support'],
      parentKPI: 13,
      childKPIs: [67, 68],
      rollupMethod: 'average',
      isAutoCalculated: true
    },
    {
      id: 38,
      name: "Ticket xử lý - Team Support",
      description: "Tổng ticket Team Support cần xử lý hàng tháng",
      category: 'tasks',
      targetValue: 300,
      currentValue: 200,
      unit: 'ticket',
      period: 'monthly',
      startDate: '2026-03-01',
      endDate: '2026-03-31',
      assignedTo: ['Team Support'],
      assignmentLevel: 'team',
      status: 'active',
      priority: 'medium',
      progressPercentage: 66.7,
      lastUpdated: '2026-03-10T10:00:00',
      createdAt: '2026-03-01T08:00:00',
      tags: ['công việc', 'support'],
      parentKPI: 16,
      childKPIs: [69, 70],
      rollupMethod: 'sum',
      isAutoCalculated: true
    },

    // ============================================
    // INDIVIDUAL LEVEL KPIs - TEAM A SALES
    // Hoài Nam Trần (4 KPIs: Doanh thu, Leads, Chuyển đổi, Công việc)
    // ============================================
    {
      id: 39,
      name: "Doanh thu tháng - Hoài Nam Trần",
      description: "Mục tiêu doanh thu cá nhân của Hoài Nam Trần",
      category: 'revenue',
      targetValue: 1800000000,
      currentValue: 1320000000,
      unit: 'VND',
      period: 'monthly',
      startDate: '2026-03-01',
      endDate: '2026-03-31',
      assignedTo: ['Hoài Nam Trần'],
      assignmentLevel: 'individual',
      status: 'active',
      priority: 'critical',
      progressPercentage: 73.3,
      lastUpdated: '2026-03-10T10:00:00',
      createdAt: '2026-03-01T08:00:00',
      tags: ['doanh thu', 'cá nhân'],
      parentKPI: 17,
      rollupMethod: 'sum',
      isAutoCalculated: false
    },
    {
      id: 45,
      name: "Leads mới tháng - Hoài Nam Trần",
      description: "Số leads mới mà Hoài Nam Trần cần tiếp cận",
      category: 'leads',
      targetValue: 40,
      currentValue: 28,
      unit: 'leads',
      period: 'monthly',
      startDate: '2026-03-01',
      endDate: '2026-03-31',
      assignedTo: ['Hoài Nam Trần'],
      assignmentLevel: 'individual',
      status: 'active',
      priority: 'high',
      progressPercentage: 70,
      lastUpdated: '2026-03-10T10:00:00',
      createdAt: '2026-03-01T08:00:00',
      tags: ['leads', 'cá nhân'],
      parentKPI: 23,
      rollupMethod: 'sum',
      isAutoCalculated: false
    },
    {
      id: 51,
      name: "Tỷ lệ chuyển đổi - Hoài Nam Trần",
      description: "Tỷ lệ chuyển đổi lead sang khách hàng của Hoài Nam Trần",
      category: 'conversion',
      targetValue: 35,
      currentValue: 32,
      unit: '%',
      period: 'monthly',
      startDate: '2026-03-01',
      endDate: '2026-03-31',
      assignedTo: ['Hoài Nam Trần'],
      assignmentLevel: 'individual',
      status: 'active',
      priority: 'high',
      progressPercentage: 91.4,
      lastUpdated: '2026-03-10T10:00:00',
      createdAt: '2026-03-01T08:00:00',
      tags: ['chuyển đổi', 'cá nhân'],
      parentKPI: 29,
      rollupMethod: 'average',
      isAutoCalculated: false
    },
    {
      id: 57,
      name: "Công việc hoàn thành - Hoài Nam Trần",
      description: "Số công việc Hoài Nam Trần cần hoàn thành hàng tháng",
      category: 'tasks',
      targetValue: 350,
      currentValue: 268,
      unit: 'công việc',
      period: 'monthly',
      startDate: '2026-03-01',
      endDate: '2026-03-31',
      assignedTo: ['Hoài Nam Trần'],
      assignmentLevel: 'individual',
      status: 'active',
      priority: 'medium',
      progressPercentage: 76.6,
      lastUpdated: '2026-03-10T10:00:00',
      createdAt: '2026-03-01T08:00:00',
      tags: ['công việc', 'cá nhân'],
      parentKPI: 35,
      rollupMethod: 'sum',
      isAutoCalculated: false
    },

    // ============================================
    // INDIVIDUAL LEVEL KPIs - TEAM A SALES
    // Minh Quang Nguyễn (4 KPIs)
    // ============================================
    {
      id: 40,
      name: "Doanh thu tháng - Minh Quang Nguyễn",
      description: "Mục tiêu doanh thu cá nhân của Minh Quang Nguyễn",
      category: 'revenue',
      targetValue: 1700000000,
      currentValue: 1200000000,
      unit: 'VND',
      period: 'monthly',
      startDate: '2026-03-01',
      endDate: '2026-03-31',
      assignedTo: ['Minh Quang Nguyễn'],
      assignmentLevel: 'individual',
      status: 'active',
      priority: 'high',
      progressPercentage: 70.6,
      lastUpdated: '2026-03-10T10:00:00',
      createdAt: '2026-03-01T08:00:00',
      tags: ['doanh thu', 'cá nhân'],
      parentKPI: 17,
      rollupMethod: 'sum',
      isAutoCalculated: false
    },
    {
      id: 46,
      name: "Leads mới tháng - Minh Quang Nguyễn",
      description: "Số leads mới mà Minh Quang Nguyễn cần tiếp cận",
      category: 'leads',
      targetValue: 40,
      currentValue: 26,
      unit: 'leads',
      period: 'monthly',
      startDate: '2026-03-01',
      endDate: '2026-03-31',
      assignedTo: ['Minh Quang Nguyễn'],
      assignmentLevel: 'individual',
      status: 'active',
      priority: 'high',
      progressPercentage: 65,
      lastUpdated: '2026-03-10T10:00:00',
      createdAt: '2026-03-01T08:00:00',
      tags: ['leads', 'cá nhân'],
      parentKPI: 23,
      rollupMethod: 'sum',
      isAutoCalculated: false
    },
    {
      id: 52,
      name: "Tỷ lệ chuyển đổi - Minh Quang Nguyễn",
      description: "Tỷ lệ chuyển đổi lead sang khách hàng của Minh Quang Nguyễn",
      category: 'conversion',
      targetValue: 30,
      currentValue: 26,
      unit: '%',
      period: 'monthly',
      startDate: '2026-03-01',
      endDate: '2026-03-31',
      assignedTo: ['Minh Quang Nguyễn'],
      assignmentLevel: 'individual',
      status: 'active',
      priority: 'high',
      progressPercentage: 86.7,
      lastUpdated: '2026-03-10T10:00:00',
      createdAt: '2026-03-01T08:00:00',
      tags: ['chuyển đổi', 'cá nhân'],
      parentKPI: 29,
      rollupMethod: 'average',
      isAutoCalculated: false
    },
    {
      id: 58,
      name: "Công việc hoàn thành - Minh Quang Nguyễn",
      description: "Số công việc Minh Quang Nguyễn cần hoàn thành hàng tháng",
      category: 'tasks',
      targetValue: 350,
      currentValue: 250,
      unit: 'công việc',
      period: 'monthly',
      startDate: '2026-03-01',
      endDate: '2026-03-31',
      assignedTo: ['Minh Quang Nguyễn'],
      assignmentLevel: 'individual',
      status: 'active',
      priority: 'medium',
      progressPercentage: 71.4,
      lastUpdated: '2026-03-10T10:00:00',
      createdAt: '2026-03-01T08:00:00',
      tags: ['công việc', 'cá nhân'],
      parentKPI: 35,
      rollupMethod: 'sum',
      isAutoCalculated: false
    },

    // ============================================
    // INDIVIDUAL LEVEL KPIs - TEAM B SALES
    // Lê Văn C (4 KPIs)
    // ============================================
    {
      id: 41,
      name: "Doanh thu tháng - Lê Văn C",
      description: "Mục tiêu doanh thu cá nhân của Lê Văn C",
      category: 'revenue',
      targetValue: 1300000000,
      currentValue: 880000000,
      unit: 'VND',
      period: 'monthly',
      startDate: '2026-03-01',
      endDate: '2026-03-31',
      assignedTo: ['Lê Văn C'],
      assignmentLevel: 'individual',
      status: 'active',
      priority: 'high',
      progressPercentage: 67.7,
      lastUpdated: '2026-03-10T10:00:00',
      createdAt: '2026-03-01T08:00:00',
      tags: ['doanh thu', 'cá nhân'],
      parentKPI: 18,
      rollupMethod: 'sum',
      isAutoCalculated: false
    },
    {
      id: 47,
      name: "Leads mới tháng - Lê Văn C",
      description: "Số leads mới mà Lê Văn C cần tiếp cận",
      category: 'leads',
      targetValue: 35,
      currentValue: 22,
      unit: 'leads',
      period: 'monthly',
      startDate: '2026-03-01',
      endDate: '2026-03-31',
      assignedTo: ['Lê Văn C'],
      assignmentLevel: 'individual',
      status: 'active',
      priority: 'high',
      progressPercentage: 62.9,
      lastUpdated: '2026-03-10T10:00:00',
      createdAt: '2026-03-01T08:00:00',
      tags: ['leads', 'cá nhân'],
      parentKPI: 24,
      rollupMethod: 'sum',
      isAutoCalculated: false
    },
    {
      id: 53,
      name: "Tỷ lệ chuyển đổi - Lê Văn C",
      description: "Tỷ lệ chuyển đổi lead sang khách hàng của Lê Văn C",
      category: 'conversion',
      targetValue: 28,
      currentValue: 24,
      unit: '%',
      period: 'monthly',
      startDate: '2026-03-01',
      endDate: '2026-03-31',
      assignedTo: ['Lê Văn C'],
      assignmentLevel: 'individual',
      status: 'active',
      priority: 'high',
      progressPercentage: 85.7,
      lastUpdated: '2026-03-10T10:00:00',
      createdAt: '2026-03-01T08:00:00',
      tags: ['chuyển đổi', 'cá nhân'],
      parentKPI: 30,
      rollupMethod: 'average',
      isAutoCalculated: false
    },
    {
      id: 59,
      name: "Công việc hoàn thành - Lê Văn C",
      description: "Số công việc Lê Văn C cần hoàn thành hàng tháng",
      category: 'tasks',
      targetValue: 250,
      currentValue: 180,
      unit: 'công việc',
      period: 'monthly',
      startDate: '2026-03-01',
      endDate: '2026-03-31',
      assignedTo: ['Lê Văn C'],
      assignmentLevel: 'individual',
      status: 'active',
      priority: 'medium',
      progressPercentage: 72,
      lastUpdated: '2026-03-10T10:00:00',
      createdAt: '2026-03-01T08:00:00',
      tags: ['công việc', 'cá nhân'],
      parentKPI: 36,
      rollupMethod: 'sum',
      isAutoCalculated: false
    },

    // ============================================
    // INDIVIDUAL LEVEL KPIs - TEAM B SALES
    // Phạm Thị D (4 KPIs)
    // ============================================
    {
      id: 42,
      name: "Doanh thu tháng - Phạm Thị D",
      description: "Mục tiêu doanh thu cá nhân của Phạm Thị D",
      category: 'revenue',
      targetValue: 1200000000,
      currentValue: 800000000,
      unit: 'VND',
      period: 'monthly',
      startDate: '2026-03-01',
      endDate: '2026-03-31',
      assignedTo: ['Phạm Thị D'],
      assignmentLevel: 'individual',
      status: 'active',
      priority: 'high',
      progressPercentage: 66.7,
      lastUpdated: '2026-03-10T10:00:00',
      createdAt: '2026-03-01T08:00:00',
      tags: ['doanh thu', 'cá nhân'],
      parentKPI: 18,
      rollupMethod: 'sum',
      isAutoCalculated: false
    },
    {
      id: 48,
      name: "Leads mới tháng - Phạm Thị D",
      description: "Số leads mới mà Phạm Thị D cần tiếp cận",
      category: 'leads',
      targetValue: 35,
      currentValue: 22,
      unit: 'leads',
      period: 'monthly',
      startDate: '2026-03-01',
      endDate: '2026-03-31',
      assignedTo: ['Phạm Thị D'],
      assignmentLevel: 'individual',
      status: 'active',
      priority: 'high',
      progressPercentage: 62.9,
      lastUpdated: '2026-03-10T10:00:00',
      createdAt: '2026-03-01T08:00:00',
      tags: ['leads', 'cá nhân'],
      parentKPI: 24,
      rollupMethod: 'sum',
      isAutoCalculated: false
    },
    {
      id: 54,
      name: "Tỷ lệ chuyển đổi - Phạm Thị D",
      description: "Tỷ lệ chuyển đổi lead sang khách hàng của Phạm Thị D",
      category: 'conversion',
      targetValue: 28,
      currentValue: 26,
      unit: '%',
      period: 'monthly',
      startDate: '2026-03-01',
      endDate: '2026-03-31',
      assignedTo: ['Phạm Thị D'],
      assignmentLevel: 'individual',
      status: 'active',
      priority: 'high',
      progressPercentage: 92.9,
      lastUpdated: '2026-03-10T10:00:00',
      createdAt: '2026-03-01T08:00:00',
      tags: ['chuyển đổi', 'cá nhân'],
      parentKPI: 30,
      rollupMethod: 'average',
      isAutoCalculated: false
    },
    {
      id: 60,
      name: "Công việc hoàn thành - Phạm Thị D",
      description: "Số công việc Phạm Thị D cần hoàn thành hàng tháng",
      category: 'tasks',
      targetValue: 250,
      currentValue: 178,
      unit: 'công việc',
      period: 'monthly',
      startDate: '2026-03-01',
      endDate: '2026-03-31',
      assignedTo: ['Phạm Thị D'],
      assignmentLevel: 'individual',
      status: 'active',
      priority: 'medium',
      progressPercentage: 71.2,
      lastUpdated: '2026-03-10T10:00:00',
      createdAt: '2026-03-01T08:00:00',
      tags: ['công việc', 'cá nhân'],
      parentKPI: 36,
      rollupMethod: 'sum',
      isAutoCalculated: false
    },

    // ============================================
    // INDIVIDUAL LEVEL KPIs - TEAM MARKETING
    // Hoàng Văn E (4 KPIs)
    // ============================================
    {
      id: 43,
      name: "Doanh thu từ campaign - Hoàng Văn E",
      description: "Doanh thu từ các chiến dịch marketing của Hoàng Văn E",
      category: 'revenue',
      targetValue: 1300000000,
      currentValue: 880000000,
      unit: 'VND',
      period: 'monthly',
      startDate: '2026-03-01',
      endDate: '2026-03-31',
      assignedTo: ['Hoàng Văn E'],
      assignmentLevel: 'individual',
      status: 'active',
      priority: 'high',
      progressPercentage: 67.7,
      lastUpdated: '2026-03-10T10:00:00',
      createdAt: '2026-03-01T08:00:00',
      tags: ['doanh thu', 'marketing', 'cá nhân'],
      parentKPI: 19,
      rollupMethod: 'sum',
      isAutoCalculated: false
    },
    {
      id: 49,
      name: "Leads từ campaign - Hoàng Văn E",
      description: "Số leads tạo từ các chiến dịch của Hoàng Văn E",
      category: 'leads',
      targetValue: 150,
      currentValue: 112,
      unit: 'leads',
      period: 'monthly',
      startDate: '2026-03-01',
      endDate: '2026-03-31',
      assignedTo: ['Hoàng Văn E'],
      assignmentLevel: 'individual',
      status: 'active',
      priority: 'critical',
      progressPercentage: 74.7,
      lastUpdated: '2026-03-10T10:00:00',
      createdAt: '2026-03-01T08:00:00',
      tags: ['leads', 'marketing', 'cá nhân'],
      parentKPI: 25,
      rollupMethod: 'sum',
      isAutoCalculated: false
    },
    {
      id: 55,
      name: "Tỷ lệ MQL - Hoàng Văn E",
      description: "Tỷ lệ chuyển đổi lead sang MQL của Hoàng Văn E",
      category: 'conversion',
      targetValue: 22,
      currentValue: 20,
      unit: '%',
      period: 'monthly',
      startDate: '2026-03-01',
      endDate: '2026-03-31',
      assignedTo: ['Hoàng Văn E'],
      assignmentLevel: 'individual',
      status: 'active',
      priority: 'high',
      progressPercentage: 90.9,
      lastUpdated: '2026-03-10T10:00:00',
      createdAt: '2026-03-01T08:00:00',
      tags: ['chuyển đổi', 'marketing', 'cá nhân'],
      parentKPI: 31,
      rollupMethod: 'average',
      isAutoCalculated: false
    },
    {
      id: 61,
      name: "Công việc marketing - Hoàng Văn E",
      description: "Số công việc Hoàng Văn E cần hoàn thành hàng tháng",
      category: 'tasks',
      targetValue: 250,
      currentValue: 175,
      unit: 'công việc',
      period: 'monthly',
      startDate: '2026-03-01',
      endDate: '2026-03-31',
      assignedTo: ['Hoàng Văn E'],
      assignmentLevel: 'individual',
      status: 'active',
      priority: 'medium',
      progressPercentage: 70,
      lastUpdated: '2026-03-10T10:00:00',
      createdAt: '2026-03-01T08:00:00',
      tags: ['công việc', 'marketing', 'cá nhân'],
      parentKPI: 37,
      rollupMethod: 'sum',
      isAutoCalculated: false
    },

    // ============================================
    // INDIVIDUAL LEVEL KPIs - TEAM MARKETING
    // Đỗ Thị F (4 KPIs)
    // ============================================
    {
      id: 44,
      name: "Doanh thu từ campaign - Đỗ Thị F",
      description: "Doanh thu từ các chiến dịch marketing của Đỗ Thị F",
      category: 'revenue',
      targetValue: 1200000000,
      currentValue: 770000000,
      unit: 'VND',
      period: 'monthly',
      startDate: '2026-03-01',
      endDate: '2026-03-31',
      assignedTo: ['Đỗ Thị F'],
      assignmentLevel: 'individual',
      status: 'active',
      priority: 'high',
      progressPercentage: 64.2,
      lastUpdated: '2026-03-10T10:00:00',
      createdAt: '2026-03-01T08:00:00',
      tags: ['doanh thu', 'marketing', 'cá nhân'],
      parentKPI: 19,
      rollupMethod: 'sum',
      isAutoCalculated: false
    },
    {
      id: 50,
      name: "Leads từ campaign - Đỗ Thị F",
      description: "Số leads tạo từ các chiến dịch của Đỗ Thị F",
      category: 'leads',
      targetValue: 150,
      currentValue: 103,
      unit: 'leads',
      period: 'monthly',
      startDate: '2026-03-01',
      endDate: '2026-03-31',
      assignedTo: ['Đỗ Thị F'],
      assignmentLevel: 'individual',
      status: 'active',
      priority: 'critical',
      progressPercentage: 68.7,
      lastUpdated: '2026-03-10T10:00:00',
      createdAt: '2026-03-01T08:00:00',
      tags: ['leads', 'marketing', 'cá nhân'],
      parentKPI: 25,
      rollupMethod: 'sum',
      isAutoCalculated: false
    },
    {
      id: 56,
      name: "Tỷ lệ MQL - Đỗ Thị F",
      description: "Tỷ lệ chuyển đổi lead sang MQL của Đỗ Thị F",
      category: 'conversion',
      targetValue: 18,
      currentValue: 16,
      unit: '%',
      period: 'monthly',
      startDate: '2026-03-01',
      endDate: '2026-03-31',
      assignedTo: ['Đỗ Thị F'],
      assignmentLevel: 'individual',
      status: 'active',
      priority: 'high',
      progressPercentage: 88.9,
      lastUpdated: '2026-03-10T10:00:00',
      createdAt: '2026-03-01T08:00:00',
      tags: ['chuyển đổi', 'marketing', 'cá nhân'],
      parentKPI: 31,
      rollupMethod: 'average',
      isAutoCalculated: false
    },
    {
      id: 62,
      name: "Công việc marketing - Đỗ Thị F",
      description: "Số công việc Đỗ Thị F cần hoàn thành hàng tháng",
      category: 'tasks',
      targetValue: 250,
      currentValue: 169,
      unit: 'công việc',
      period: 'monthly',
      startDate: '2026-03-01',
      endDate: '2026-03-31',
      assignedTo: ['Đỗ Thị F'],
      assignmentLevel: 'individual',
      status: 'active',
      priority: 'medium',
      progressPercentage: 67.6,
      lastUpdated: '2026-03-10T10:00:00',
      createdAt: '2026-03-01T08:00:00',
      tags: ['công việc', 'marketing', 'cá nhân'],
      parentKPI: 37,
      rollupMethod: 'sum',
      isAutoCalculated: false
    },

    // ============================================
    // INDIVIDUAL LEVEL KPIs - TEAM SUPPORT
    // Vũ Văn G (4 KPIs)
    // ============================================
    {
      id: 63,
      name: "Doanh thu upsell - Vũ Văn G",
      description: "Doanh thu từ upsell/renewal của Vũ Văn G",
      category: 'revenue',
      targetValue: 800000000,
      currentValue: 540000000,
      unit: 'VND',
      period: 'monthly',
      startDate: '2026-03-01',
      endDate: '2026-03-31',
      assignedTo: ['Vũ Văn G'],
      assignmentLevel: 'individual',
      status: 'active',
      priority: 'medium',
      progressPercentage: 67.5,
      lastUpdated: '2026-03-10T10:00:00',
      createdAt: '2026-03-01T08:00:00',
      tags: ['doanh thu', 'support', 'cá nhân'],
      parentKPI: 20,
      rollupMethod: 'sum',
      isAutoCalculated: false
    },
    {
      id: 65,
      name: "Leads referral - Vũ Văn G",
      description: "Số leads referral từ khách hàng của Vũ Văn G",
      category: 'leads',
      targetValue: 25,
      currentValue: 15,
      unit: 'leads',
      period: 'monthly',
      startDate: '2026-03-01',
      endDate: '2026-03-31',
      assignedTo: ['Vũ Văn G'],
      assignmentLevel: 'individual',
      status: 'active',
      priority: 'medium',
      progressPercentage: 60,
      lastUpdated: '2026-03-10T10:00:00',
      createdAt: '2026-03-01T08:00:00',
      tags: ['leads', 'support', 'referral', 'cá nhân'],
      parentKPI: 26,
      rollupMethod: 'sum',
      isAutoCalculated: false
    },
    {
      id: 67,
      name: "Tỷ lệ upsell - Vũ Văn G",
      description: "Tỷ lệ chuyển đổi từ support sang upsell của Vũ Văn G",
      category: 'conversion',
      targetValue: 15,
      currentValue: 12,
      unit: '%',
      period: 'monthly',
      startDate: '2026-03-01',
      endDate: '2026-03-31',
      assignedTo: ['Vũ Văn G'],
      assignmentLevel: 'individual',
      status: 'active',
      priority: 'medium',
      progressPercentage: 80,
      lastUpdated: '2026-03-10T10:00:00',
      createdAt: '2026-03-01T08:00:00',
      tags: ['chuyển đổi', 'support', 'cá nhân'],
      parentKPI: 32,
      rollupMethod: 'average',
      isAutoCalculated: false
    },
    {
      id: 69,
      name: "Ticket xử lý - Vũ Văn G",
      description: "Số ticket Vũ Văn G cần xử lý hàng tháng",
      category: 'tasks',
      targetValue: 150,
      currentValue: 102,
      unit: 'ticket',
      period: 'monthly',
      startDate: '2026-03-01',
      endDate: '2026-03-31',
      assignedTo: ['Vũ Văn G'],
      assignmentLevel: 'individual',
      status: 'active',
      priority: 'medium',
      progressPercentage: 68,
      lastUpdated: '2026-03-10T10:00:00',
      createdAt: '2026-03-01T08:00:00',
      tags: ['công việc', 'support', 'cá nhân'],
      parentKPI: 38,
      rollupMethod: 'sum',
      isAutoCalculated: false
    },

    // ============================================
    // INDIVIDUAL LEVEL KPIs - TEAM SUPPORT
    // Mai Thị H (4 KPIs)
    // ============================================
    {
      id: 64,
      name: "Doanh thu upsell - Mai Thị H",
      description: "Doanh thu từ upsell/renewal của Mai Thị H",
      category: 'revenue',
      targetValue: 700000000,
      currentValue: 460000000,
      unit: 'VND',
      period: 'monthly',
      startDate: '2026-03-01',
      endDate: '2026-03-31',
      assignedTo: ['Mai Thị H'],
      assignmentLevel: 'individual',
      status: 'active',
      priority: 'medium',
      progressPercentage: 65.7,
      lastUpdated: '2026-03-10T10:00:00',
      createdAt: '2026-03-01T08:00:00',
      tags: ['doanh thu', 'support', 'cá nhân'],
      parentKPI: 20,
      rollupMethod: 'sum',
      isAutoCalculated: false
    },
    {
      id: 66,
      name: "Leads referral - Mai Thị H",
      description: "Số leads referral từ khách hàng của Mai Thị H",
      category: 'leads',
      targetValue: 25,
      currentValue: 14,
      unit: 'leads',
      period: 'monthly',
      startDate: '2026-03-01',
      endDate: '2026-03-31',
      assignedTo: ['Mai Thị H'],
      assignmentLevel: 'individual',
      status: 'active',
      priority: 'medium',
      progressPercentage: 56,
      lastUpdated: '2026-03-10T10:00:00',
      createdAt: '2026-03-01T08:00:00',
      tags: ['leads', 'support', 'referral', 'cá nhân'],
      parentKPI: 26,
      rollupMethod: 'sum',
      isAutoCalculated: false
    },
    {
      id: 68,
      name: "Tỷ lệ upsell - Mai Thị H",
      description: "Tỷ lệ chuyển đổi từ support sang upsell của Mai Thị H",
      category: 'conversion',
      targetValue: 15,
      currentValue: 12,
      unit: '%',
      period: 'monthly',
      startDate: '2026-03-01',
      endDate: '2026-03-31',
      assignedTo: ['Mai Thị H'],
      assignmentLevel: 'individual',
      status: 'active',
      priority: 'medium',
      progressPercentage: 80,
      lastUpdated: '2026-03-10T10:00:00',
      createdAt: '2026-03-01T08:00:00',
      tags: ['chuyển đổi', 'support', 'cá nhân'],
      parentKPI: 32,
      rollupMethod: 'average',
      isAutoCalculated: false
    },
    {
      id: 70,
      name: "Ticket xử lý - Mai Thị H",
      description: "Số ticket Mai Thị H cần xử lý hàng tháng",
      category: 'tasks',
      targetValue: 150,
      currentValue: 98,
      unit: 'ticket',
      period: 'monthly',
      startDate: '2026-03-01',
      endDate: '2026-03-31',
      assignedTo: ['Mai Thị H'],
      assignmentLevel: 'individual',
      status: 'active',
      priority: 'medium',
      progressPercentage: 65.3,
      lastUpdated: '2026-03-10T10:00:00',
      createdAt: '2026-03-01T08:00:00',
      tags: ['công việc', 'support', 'cá nhân'],
      parentKPI: 38,
      rollupMethod: 'sum',
      isAutoCalculated: false
    }
  ])

  // Available organizational structure
  const organizationStructure = {
    company: ['Toàn công ty'],
    departments: [
      { id: 'sales', name: 'Phòng Sales', teams: ['Team A Sales', 'Team B Sales'] },
      { id: 'marketing', name: 'Phòng Marketing', teams: ['Team Marketing'] },
      { id: 'support', name: 'Phòng Hỗ trợ', teams: ['Team Support'] }
    ],
    teams: [
      { id: 'team-a-sales', name: 'Team A Sales', department: 'sales', members: ['Hoài Nam Trần', 'Minh Quang Nguyễn'] },
      { id: 'team-b-sales', name: 'Team B Sales', department: 'sales', members: ['Lê Văn C', 'Phạm Thị D'] },
      { id: 'team-marketing', name: 'Team Marketing', department: 'marketing', members: ['Hoàng Văn E', 'Đỗ Thị F'] },
      { id: 'team-support', name: 'Team Support', department: 'support', members: ['Vũ Văn G', 'Mai Thị H'] }
    ],
    individuals: [
      'Hoài Nam Trần', 'Minh Quang Nguyễn', 'Lê Văn C', 'Phạm Thị D',
      'Hoàng Văn E', 'Đỗ Thị F', 'Vũ Văn G', 'Mai Thị H'
    ]
  }

  // Get available targets based on assignment level
  const getAvailableTargets = (level: KPITarget['assignmentLevel']) => {
    switch (level) {
      case 'company':
        return organizationStructure.company
      case 'department':
        return organizationStructure.departments.map(d => d.name)
      case 'team':
        return organizationStructure.teams.map(t => t.name)
      case 'individual':
        return organizationStructure.individuals
      default:
        return []
    }
  }

  // Calculate rollup values for parent KPIs
  const calculateRollupValue = (parentKPI: KPITarget, childKPIs: KPITarget[]) => {
    if (!childKPIs.length) return parentKPI.currentValue

    switch (parentKPI.rollupMethod) {
      case 'sum':
        return childKPIs.reduce((sum, child) => sum + child.currentValue, 0)
      case 'average':
        return childKPIs.reduce((sum, child) => sum + child.currentValue, 0) / childKPIs.length
      case 'max':
        return Math.max(...childKPIs.map(child => child.currentValue))
      case 'min':
        return Math.min(...childKPIs.map(child => child.currentValue))
      default:
        return parentKPI.currentValue
    }
  }

  // Get assignment level display name
  const getAssignmentLevelName = (level: KPITarget['assignmentLevel']) => {
    switch (level) {
      case 'individual': return 'Cá nhân'
      case 'team': return 'Team'
      case 'department': return 'Phòng ban'
      case 'company': return 'Công ty'
      default: return level
    }
  }

  // Filter KPIs
  const filteredKPIs = kpiTargets.filter(kpi => {
    const matchesSearch = kpi.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         kpi.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         kpi.assignedTo.some(person => person.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesCategory = categoryFilter === 'all' || kpi.category === categoryFilter
    const matchesStatus = statusFilter === 'all' || kpi.status === statusFilter
    const matchesAssignmentLevel = assignmentLevelFilter === 'all' || kpi.assignmentLevel === assignmentLevelFilter
    
    // Date filtering
    const matchesStartDate = !startDateFilter || new Date(kpi.startDate) >= new Date(startDateFilter)
    const matchesEndDate = !endDateFilter || new Date(kpi.endDate) <= new Date(endDateFilter)
    
    return matchesSearch && matchesCategory && matchesStatus && matchesAssignmentLevel && matchesStartDate && matchesEndDate
  })

  // Filter KPIs by level for specific tabs
  const getFilteredKPIsByLevel = (level: string) => {
    return filteredKPIs.filter(kpi => kpi.assignmentLevel === level)
  }

  // Reset filters function
  const resetFilters = () => {
    setSearchTerm('')
    setCategoryFilter('all')
    setStatusFilter('all')
    setAssignmentLevelFilter('all')
    setStartDateFilter('')
    setEndDateFilter('')
  }

  // Calculate overview metrics
  const overviewMetrics = {
    totalKPIs: kpiTargets.length,
    activeKPIs: kpiTargets.filter(k => k.status === 'active').length,
    achievedKPIs: kpiTargets.filter(k => k.progressPercentage >= 100).length,
    avgProgress: Math.round(kpiTargets.reduce((sum, k) => sum + k.progressPercentage, 0) / kpiTargets.length),
    criticalKPIs: kpiTargets.filter(k => k.priority === 'critical' && k.progressPercentage < 80).length,
    overdueKPIs: kpiTargets.filter(k => k.status === 'overdue').length
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'revenue': return <DollarSign className="w-4 h-4" />
      case 'leads': return <Users className="w-4 h-4" />
      case 'conversion': return <TrendingUp className="w-4 h-4" />
      case 'tasks': return <CheckSquare className="w-4 h-4" />
      default: return <Target className="w-4 h-4" />
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'revenue': return 'text-green-600 bg-green-100'
      case 'leads': return 'text-blue-600 bg-blue-100'
      case 'conversion': return 'text-purple-600 bg-purple-100'
      case 'tasks': return 'text-orange-600 bg-orange-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'paused': return <Clock className="w-4 h-4 text-yellow-500" />
      case 'completed': return <Award className="w-4 h-4 text-blue-500" />
      case 'overdue': return <AlertCircle className="w-4 h-4 text-red-500" />
      default: return <Target className="w-4 h-4 text-gray-500" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-500'
      case 'high': return 'bg-orange-500'
      case 'medium': return 'bg-yellow-500'
      case 'low': return 'bg-green-500'
      default: return 'bg-gray-500'
    }
  }

  const formatValue = (value: number, unit: string) => {
    if (unit === 'VND') {
      return new Intl.NumberFormat('vi-VN').format(value) + ' VND'
    }
    return `${value} ${unit}`
  }

  const formatPeriod = (period: string) => {
    switch (period) {
      case 'daily': return 'Hàng ngày'
      case 'weekly': return 'Hàng tuần'
      case 'monthly': return 'Hàng tháng'
      case 'quarterly': return 'Hàng quý'
      case 'yearly': return 'Hàng năm'
      default: return period
    }
  }

  const handleAddKPI = () => {
    const newKPIData: KPITarget = {
      id: Date.now(),
      name: newKPI.name,
      description: newKPI.description,
      category: newKPI.category,
      targetValue: newKPI.targetValue,
      currentValue: 0,
      unit: newKPI.unit,
      period: newKPI.period,
      startDate: newKPI.startDate,
      endDate: newKPI.endDate,
      assignedTo: newKPI.assignedTo,
      assignmentLevel: newKPI.assignmentLevel,
      status: newKPI.status,
      priority: newKPI.priority,
      progressPercentage: 0,
      lastUpdated: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      tags: newKPI.tags,
      rollupMethod: newKPI.rollupMethod,
      isAutoCalculated: newKPI.isAutoCalculated
    }

    setKpiTargets([...kpiTargets, newKPIData])
    setShowAddKPIModal(false)
    setNewKPI({
      name: '',
      description: '',
      category: 'revenue',
      targetValue: 0,
      unit: 'VND',
      period: 'monthly',
      assignedTo: [],
      assignmentLevel: 'individual',
      priority: 'medium',
      startDate: '',
      endDate: '',
      tags: [],
      rollupMethod: 'sum',
      isAutoCalculated: false,
      linkedGroup: '',
      indicatorGroup: '',
      indicator: '',
      watchers: [],
      status: 'not_started'
    })
  }

  // Calculate weeks in a month based on ISO standard (Monday-Sunday)
  const getWeeksInMonth = (year: number, month: number): number[] => {
    const firstDay = new Date(year, month - 1, 1)
    const lastDay = new Date(year, month, 0)
    
    // Find first Monday
    let firstMonday = new Date(firstDay)
    const dayOfWeek = firstDay.getDay()
    const daysUntilMonday = dayOfWeek === 0 ? 1 : (dayOfWeek === 1 ? 0 : 8 - dayOfWeek)
    firstMonday.setDate(firstDay.getDate() + daysUntilMonday)
    
    // Count weeks
    const weeks: number[] = []
    let currentMonday = new Date(firstMonday)
    let weekNum = 1
    
    while (currentMonday <= lastDay && weekNum <= 4) {
      weeks.push(weekNum)
      currentMonday.setDate(currentMonday.getDate() + 7)
      weekNum++
    }
    
    // If there are remaining days, they belong to week 4
    if (weeks.length === 0) {
      weeks.push(1)
    }
    
    return weeks
  }

  const handleEditKPI = (kpi: KPITarget) => {
    setSelectedKPI(kpi)
    setShowEditKPIModal(true)
  }

  const handleDeleteKPI = (id: number) => {
    if (window.confirm('Bạn có chắc muốn xóa KPI này?')) {
      setKpiTargets(kpiTargets.filter(k => k.id !== id))
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý KPI</h1>
          <p className="text-gray-600">Thiết lập và theo dõi các chỉ số hiệu suất quan trọng</p>
        </div>
      </div>

      {/* Tabs */}
      {false && (
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {[
            // { id: 'overview', label: 'Tổng quan', icon: BarChart3 },
            { id: 'targets', label: 'Mục tiêu KPI', icon: Target },
            // { id: 'reports', label: 'Báo cáo', icon: TrendingUp },
            // { id: 'settings', label: 'Cài đặt', icon: Settings }
          ].map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            )
          })}
        </nav>
      </div>
      )}

      {/* Overview Tab */}
      {false && activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Metrics Cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="bg-white p-4 rounded-lg shadow border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Tổng KPIs</p>
                  <p className="text-2xl font-bold text-gray-900">{overviewMetrics.totalKPIs}</p>
                </div>
                <Target className="w-8 h-8 text-blue-600" />
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Đang hoạt động</p>
                  <p className="text-2xl font-bold text-green-600">{overviewMetrics.activeKPIs}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Đã hoàn thành</p>
                  <p className="text-2xl font-bold text-blue-600">{overviewMetrics.achievedKPIs}</p>
                </div>
                <Award className="w-8 h-8 text-blue-600" />
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Tiến độ TB</p>
                  <p className="text-2xl font-bold text-purple-600">{overviewMetrics.avgProgress}%</p>
                </div>
                <TrendingUp className="w-8 h-8 text-purple-600" />
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Cần chú ý</p>
                  <p className="text-2xl font-bold text-red-600">{overviewMetrics.criticalKPIs}</p>
                </div>
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Quá hạn</p>
                  <p className="text-2xl font-bold text-orange-600">{overviewMetrics.overdueKPIs}</p>
                </div>
                <Clock className="w-8 h-8 text-orange-600" />
              </div>
            </div>
          </div>

          {/* Quick KPI Status */}
          <div className="bg-white rounded-lg shadow border">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Trạng thái KPI quan trọng</h3>
              <div className="space-y-4">
                {kpiTargets.filter(k => k.priority === 'critical' || k.priority === 'high').slice(0, 3).map(kpi => (
                  <div key={kpi.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className={`p-2 rounded-lg ${getCategoryColor(kpi.category)}`}>
                        {getCategoryIcon(kpi.category)}
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{kpi.name}</h4>
                        <p className="text-sm text-gray-600">{formatPeriod(kpi.period)}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">
                          {formatValue(kpi.currentValue, kpi.unit)} / {formatValue(kpi.targetValue, kpi.unit)}
                        </p>
                        <p className="text-sm text-gray-600">{kpi.progressPercentage}% hoàn thành</p>
                      </div>
                      <div className="w-20">
                        <div className="bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${
                              kpi.progressPercentage >= 100 ? 'bg-green-500' :
                              kpi.progressPercentage >= 80 ? 'bg-blue-500' :
                              kpi.progressPercentage >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${Math.min(kpi.progressPercentage, 100)}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Targets Tab */}
      {/* Always show targets content */}
      <div className="space-y-6">
          {/* Sub-tabs */}
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8">
              {[
                { id: 'individual', label: 'Cá nhân', icon: User },
                { id: 'team', label: 'Nhóm', icon: Users },
                { id: 'department', label: 'Phòng ban', icon: Users },
                { id: 'company', label: 'Công ty', icon: Building }
              ].map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTargetTab(tab.id as any)}
                    className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                      activeTargetTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                )
              })}
            </nav>
          </div>

          {/* Company Level Tab */}
          {activeTargetTab === 'company' && (
            <div className="bg-white rounded-lg shadow border">
              <div className="p-6">
                {/* Filters for Company */}
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <div className="flex flex-wrap items-center gap-4">
                    <div className="flex-1 min-w-64">
                      <div className="relative">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                          type="text"
                          placeholder="Tìm kiếm KPI công ty..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>
                    
                    <select
                      value={categoryFilter}
                      onChange={(e) => setCategoryFilter(e.target.value)}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="all">Tất cả danh mục</option>
                      <option value="revenue">Doanh thu</option>
                      <option value="leads">Leads</option>
                      <option value="conversion">Chuyển đổi</option>
                      <option value="tasks">Công việc</option>
                      <option value="custom">Tùy chỉnh</option>
                    </select>

                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="all">Tất cả trạng thái</option>
                      <option value="active">Đang hoạt động</option>
                      <option value="paused">Tạm dừng</option>
                      <option value="completed">Hoàn thành</option>
                      <option value="overdue">Quá hạn</option>
                    </select>

                    <select
                      value={filterMonth}
                      onChange={(e) => setFilterMonth(Number(e.target.value))}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value={0}>Chọn tháng</option>
                      <option value={1}>Tháng 1</option>
                      <option value={2}>Tháng 2</option>
                      <option value={3}>Tháng 3</option>
                      <option value={4}>Tháng 4</option>
                      <option value={5}>Tháng 5</option>
                      <option value={6}>Tháng 6</option>
                      <option value={7}>Tháng 7</option>
                      <option value={8}>Tháng 8</option>
                      <option value={9}>Tháng 9</option>
                      <option value={10}>Tháng 10</option>
                      <option value={11}>Tháng 11</option>
                      <option value={12}>Tháng 12</option>
                    </select>

                    <select
                      value={filterYear}
                      onChange={(e) => setFilterYear(Number(e.target.value))}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      {[2024, 2025, 2026, 2027, 2028, 2029, 2030].map(year => (
                        <option key={year} value={year}>Năm {year}</option>
                      ))}
                    </select>

                    <button
                      onClick={resetFilters}
                      className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 flex items-center space-x-2"
                    >
                      <X className="w-4 h-4" />
                      <span>Xóa bộ lọc</span>
                    </button>

                    {/* Settings Dropdown for Company Tab */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 flex items-center space-x-2">
                          <Settings className="w-4 h-4" />
                          <span>Cài đặt</span>
                          <ChevronDown className="w-4 h-4" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem 
                          onClick={() => {
                            setTreeReportTab('tree')
                            setShowTreeReportModal(true)
                          }}
                          className="cursor-pointer"
                        >
                          <GitBranch className="w-4 h-4 mr-2" />
                          Xem cây mục tiêu
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => {
                            setTreeReportTab('report')
                            setShowTreeReportModal(true)
                          }}
                          className="cursor-pointer"
                        >
                          <BarChart3 className="w-4 h-4 mr-2" />
                          Xem báo cáo
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          CÔNG TY / KPI
                        </th>
                        {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Giao cho
                        </th> */}
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Thời gian KPI
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Ngày hiện tại
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Mục tiêu
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Hiện tại
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Tiến độ
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Trạng thái
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Thao tác
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {getFilteredKPIsByLevel('company').length === 0 ? (
                        <tr>
                          <td colSpan={9} className="px-6 py-12 text-center">
                            <div className="text-gray-500">
                              <Search className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                              <p className="text-lg font-medium mb-2">Không tìm thấy KPI công ty</p>
                              <p className="text-sm">Thử điều chỉnh bộ lọc hoặc tìm kiếm với từ khóa khác</p>
                            </div>
                          </td>
                        </tr>
                      ) : (
                        getFilteredKPIsByLevel('company').map(kpi => (
                        <tr key={kpi.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className={`p-2 rounded-lg ${getCategoryColor(kpi.category)} mr-3`}>
                                {getCategoryIcon(kpi.category)}
                              </div>
                              <div>
                                <div className="text-sm font-medium text-gray-900">{kpi.name}</div>
                                <div className="text-sm text-gray-500">{formatPeriod(kpi.period)}</div>
                              </div>
                            </div>
                          </td>
                          {/* <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex flex-wrap gap-1">
                              {kpi.assignedTo.map((target, index) => (
                                <span key={index} className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">
                                  {target}
                                </span>
                              ))}
                            </div>
                          </td> */}
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            <div>
                              <div className="font-medium">{kpi.startDate} - {kpi.endDate}</div>
                              <div className="text-xs text-gray-500">{formatPeriod(kpi.period)}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            <div>
                              <div className="font-medium" suppressHydrationWarning>{new Date().toLocaleDateString('vi-VN')}</div>
                              <div className="text-xs text-gray-500" suppressHydrationWarning>{new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {formatValue(kpi.targetValue, kpi.unit)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {formatValue(kpi.currentValue, kpi.unit)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-1 bg-gray-200 rounded-full h-2 mr-2">
                                <div 
                                  className={`h-2 rounded-full ${
                                    kpi.progressPercentage >= 100 ? 'bg-green-500' :
                                    kpi.progressPercentage >= 80 ? 'bg-blue-500' :
                                    kpi.progressPercentage >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                                  }`}
                                  style={{ width: `${Math.min(kpi.progressPercentage, 100)}%` }}
                                />
                              </div>
                              <span className="text-xs font-medium text-gray-900 min-w-[2.5rem]">
                                {kpi.progressPercentage}%
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              kpi.status === 'not_started' ? 'bg-gray-100 text-gray-800' :
                              kpi.status === 'active' ? 'bg-green-100 text-green-800' :
                              kpi.status === 'paused' ? 'bg-yellow-100 text-yellow-800' :
                              kpi.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {kpi.status === 'not_started' ? 'Chưa bắt đầu' :
                               kpi.status === 'active' ? 'Đang hoạt động' :
                               kpi.status === 'paused' ? 'Tạm dừng' :
                               kpi.status === 'completed' ? 'Hoàn thành' : 'Quá hạn'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <button className="p-2 hover:bg-gray-100 rounded-lg">
                                  <MoreVertical className="w-4 h-4 text-gray-500" />
                                </button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-48">
                                <DropdownMenuLabel className="text-xs text-gray-500 uppercase">Thông tin</DropdownMenuLabel>
                                <DropdownMenuItem onClick={() => {
                                  setSelectedKPIForDetail(kpi)
                                  setShowDetailModal(true)
                                }}>
                                  <Eye className="w-4 h-4 mr-2" />
                                  Xem chi tiết
                                </DropdownMenuItem>
                                {/* <DropdownMenuSeparator /> */}
                                {/* <DropdownMenuLabel className="text-xs text-gray-500 uppercase">Thao tác nhanh</DropdownMenuLabel>
                                <DropdownMenuItem onClick={() => handleEditKPI(kpi)}>
                                  <ShoppingCart className="w-4 h-4 mr-2" />
                                  Chỉnh sửa
                                </DropdownMenuItem> */}
                                {/* <DropdownMenuSeparator />
                                <DropdownMenuLabel className="text-xs text-gray-500 uppercase">Thao tác nguy hiểm</DropdownMenuLabel>
                                {/* <DropdownMenuItem 
                                  className="text-red-600 focus:text-red-600"
                                  onClick={() => handleDeleteKPI(kpi.id)}
                                >
                                  <Trash2 className="w-4 h-4 mr-2" />
                                  Xóa KPI
                                </DropdownMenuItem> */}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </td>
                        </tr>
                      )))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Department Level Tab */}
          {activeTargetTab === 'department' && (
            <div className="bg-white rounded-lg shadow border">
              <div className="p-6">
                {/* Filters for Department */}
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <div className="flex flex-wrap items-center gap-4">
                    <div className="flex-1 min-w-64">
                      <div className="relative">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                          type="text"
                          placeholder="Tìm kiếm KPI phòng ban..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>
                    
                    <select
                      value={categoryFilter}
                      onChange={(e) => setCategoryFilter(e.target.value)}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="all">Tất cả danh mục</option>
                      <option value="revenue">Doanh thu</option>
                      <option value="leads">Leads</option>
                      <option value="conversion">Chuyển đổi</option>
                      <option value="tasks">Công việc</option>
                      <option value="custom">Tùy chỉnh</option>
                    </select>

                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="all">Tất cả trạng thái</option>
                      <option value="active">Đang hoạt động</option>
                      <option value="paused">Tạm dừng</option>
                      <option value="completed">Hoàn thành</option>
                      <option value="overdue">Quá hạn</option>
                    </select>

                    <input
                      type="date"
                      placeholder="Từ ngày"
                      value={startDateFilter}
                      onChange={(e) => setStartDateFilter(e.target.value)}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />

                    <input
                      type="date"
                      placeholder="Đến ngày"
                      value={endDateFilter}
                      onChange={(e) => setEndDateFilter(e.target.value)}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />

                    <button
                      onClick={resetFilters}
                      className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 flex items-center space-x-2"
                    >
                      <X className="w-4 h-4" />
                      <span>Xóa bộ lọc</span>
                    </button>
                  </div>
                </div>

                {/* Grouped by Department View */}
                <div className="border rounded-lg overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-8"></th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Phòng ban / KPI
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Thời gian KPI
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Ngày hiện tại
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Mục tiêu
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Hiện tại
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Tiến độ
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Trạng thái
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Thao tác
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {(() => {
                        const filteredKPIs = getFilteredKPIsByLevel('department')
                        // Group by department
                        const kpisByDepartment = filteredKPIs.reduce((acc: Record<string, typeof filteredKPIs>, kpi) => {
                          const deptName = kpi.assignedTo[0] || 'Không xác định'
                          if (!acc[deptName]) acc[deptName] = []
                          acc[deptName].push(kpi)
                          return acc
                        }, {})
                        
                        const departmentNames = Object.keys(kpisByDepartment)
                        
                        if (departmentNames.length === 0) {
                          return (
                            <tr>
                              <td colSpan={9} className="px-6 py-12 text-center">
                                <div className="text-gray-500">
                                  <Search className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                                  <p className="text-lg font-medium mb-2">Không tìm thấy KPI phòng ban</p>
                                  <p className="text-sm">Thử điều chỉnh bộ lọc hoặc tìm kiếm với từ khóa khác</p>
                                </div>
                              </td>
                            </tr>
                          )
                        }
                        
                        return departmentNames.map((deptName) => {
                          const deptKPIs = kpisByDepartment[deptName]
                          const isExpanded = expandedDepartments.includes(deptName)
                          
                          return (
                            <React.Fragment key={deptName}>
                              {/* Department Header Row */}
                              <tr 
                                className="bg-gray-50 hover:bg-gray-100 cursor-pointer"
                                onClick={() => {
                                  setExpandedDepartments(prev => 
                                    prev.includes(deptName) 
                                      ? prev.filter(d => d !== deptName)
                                      : [...prev, deptName]
                                  )
                                }}
                              >
                                <td className="px-6 py-3">
                                  <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isExpanded ? '' : '-rotate-90'}`} />
                                </td>
                                <td className="px-6 py-3" colSpan={8}>
                                  <div className="flex items-center space-x-3">
                                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                                      <Building className="w-4 h-4 text-purple-600" />
                                    </div>
                                    <span className="font-semibold text-gray-900">{deptName}</span>
                                    <span className="text-sm text-gray-500">({deptKPIs.length} KPI)</span>
                                  </div>
                                </td>
                              </tr>
                              
                              {/* Department KPIs */}
                              {isExpanded && deptKPIs.map(kpi => (
                                <tr key={kpi.id} className="hover:bg-gray-50">
                                  <td className="px-6 py-4"></td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center pl-4">
                                      <div className={`p-2 rounded-lg ${getCategoryColor(kpi.category)} mr-3`}>
                                        {getCategoryIcon(kpi.category)}
                                      </div>
                                      <div>
                                        <button 
                                          className="text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline text-left"
                                          onClick={() => {
                                            setSelectedKPIForDetail(kpi)
                                            setShowDetailModal(true)
                                          }}
                                        >
                                          {kpi.name}
                                        </button>
                                        <div className="text-sm text-gray-500">{formatPeriod(kpi.period)}</div>
                                      </div>
                                    </div>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    <div>
                                      <div className="font-medium">{kpi.startDate} - {kpi.endDate}</div>
                                      <div className="text-xs text-gray-500">{formatPeriod(kpi.period)}</div>
                                    </div>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    <div>
                                      <div className="font-medium">{new Date().toLocaleDateString('vi-VN')}</div>
                                      <div className="text-xs text-gray-500">{new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}</div>
                                    </div>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {formatValue(kpi.targetValue, kpi.unit)}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {formatValue(kpi.currentValue, kpi.unit)}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                      <div className="flex-1 bg-gray-200 rounded-full h-2 mr-2">
                                        <div 
                                          className={`h-2 rounded-full ${
                                            kpi.progressPercentage >= 100 ? 'bg-green-500' :
                                            kpi.progressPercentage >= 80 ? 'bg-blue-500' :
                                            kpi.progressPercentage >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                                          }`}
                                          style={{ width: `${Math.min(kpi.progressPercentage, 100)}%` }}
                                        />
                                      </div>
                                      <span className="text-xs font-medium text-gray-900 min-w-[2.5rem]">
                                        {kpi.progressPercentage}%
                                      </span>
                                    </div>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                      kpi.status === 'not_started' ? 'bg-gray-100 text-gray-800' :
                                      kpi.status === 'active' ? 'bg-green-100 text-green-800' :
                                      kpi.status === 'paused' ? 'bg-yellow-100 text-yellow-800' :
                                      kpi.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                                      'bg-red-100 text-red-800'
                                    }`}>
                                      {kpi.status === 'not_started' ? 'Chưa bắt đầu' :
                                       kpi.status === 'active' ? 'Đang hoạt động' :
                                       kpi.status === 'paused' ? 'Tạm dừng' :
                                       kpi.status === 'completed' ? 'Hoàn thành' : 'Quá hạn'}
                                    </span>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <DropdownMenu>
                                      <DropdownMenuTrigger asChild>
                                        <button className="p-2 hover:bg-gray-100 rounded-lg">
                                          <MoreVertical className="w-4 h-4 text-gray-500" />
                                        </button>
                                      </DropdownMenuTrigger>
                                      <DropdownMenuContent align="end" className="w-48">
                                        <DropdownMenuLabel className="text-xs text-gray-500 uppercase">Thông tin</DropdownMenuLabel>
                                        <DropdownMenuItem onClick={() => {
                                          setSelectedKPIForDetail(kpi)
                                          setShowDetailModal(true)
                                        }}>
                                          <Eye className="w-4 h-4 mr-2" />
                                          Xem chi tiết
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => {
                                          setSelectedKPIForDetail(kpi)
                                          setTreeReportTab('tree')
                                          setShowTreeReportModal(true)
                                        }}>
                                          <GitBranch className="w-4 h-4 mr-2" />
                                          Xem cây mục tiêu
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => {
                                          setSelectedKPIForDetail(kpi)
                                          setTreeReportTab('report')
                                          setShowTreeReportModal(true)
                                        }}>
                                          <BarChart3 className="w-4 h-4 mr-2" />
                                          Xem báo cáo
                                        </DropdownMenuItem>
                                      </DropdownMenuContent>
                                    </DropdownMenu>
                                  </td>
                                </tr>
                              ))}
                            </React.Fragment>
                          )
                        })
                      })()}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Team Level Tab */}
          {activeTargetTab === 'team' && (
            <div className="bg-white rounded-lg shadow border">
              <div className="p-6">
                {/* Filters for Team */}
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <div className="flex flex-wrap items-center gap-4">
                    <div className="flex-1 min-w-64">
                      <div className="relative">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                          type="text"
                          placeholder="Tìm kiếm KPI team..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>
                    
                    <select
                      value={categoryFilter}
                      onChange={(e) => setCategoryFilter(e.target.value)}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="all">Tất cả danh mục</option>
                      <option value="revenue">Doanh thu</option>
                      <option value="leads">Leads</option>
                      <option value="conversion">Chuyển đổi</option>
                      <option value="tasks">Công việc</option>
                      <option value="custom">Tùy chỉnh</option>
                    </select>

                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="all">Tất cả trạng thái</option>
                      <option value="active">Đang hoạt động</option>
                      <option value="paused">Tạm dừng</option>
                      <option value="completed">Hoàn thành</option>
                      <option value="overdue">Quá hạn</option>
                    </select>

                    <input
                      type="date"
                      placeholder="Từ ngày"
                      value={startDateFilter}
                      onChange={(e) => setStartDateFilter(e.target.value)}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />

                    <input
                      type="date"
                      placeholder="Đến ngày"
                      value={endDateFilter}
                      onChange={(e) => setEndDateFilter(e.target.value)}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />

                    <button
                      onClick={resetFilters}
                      className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 flex items-center space-x-2"
                    >
                      <X className="w-4 h-4" />
                      <span>Xóa bộ lọc</span>
                    </button>
                  </div>
                </div>

                {/* Grouped by Team View */}
                <div className="border rounded-lg overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-8"></th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Team / KPI
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Thời gian KPI
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Ngày hiện tại
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Mục tiêu
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Hiện tại
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Tiến độ
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Trạng thái
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Thao tác
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {(() => {
                        const filteredKPIs = getFilteredKPIsByLevel('team')
                        // Group by team
                        const kpisByTeam = filteredKPIs.reduce((acc: Record<string, typeof filteredKPIs>, kpi) => {
                          const teamName = kpi.assignedTo[0] || 'Không xác định'
                          if (!acc[teamName]) acc[teamName] = []
                          acc[teamName].push(kpi)
                          return acc
                        }, {})
                        
                        const teamNames = Object.keys(kpisByTeam)
                        
                        if (teamNames.length === 0) {
                          return (
                            <tr>
                              <td colSpan={9} className="px-6 py-12 text-center">
                                <div className="text-gray-500">
                                  <Search className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                                  <p className="text-lg font-medium mb-2">Không tìm thấy KPI team</p>
                                  <p className="text-sm">Thử điều chỉnh bộ lọc hoặc tìm kiếm với từ khóa khác</p>
                                </div>
                              </td>
                            </tr>
                          )
                        }
                        
                        return teamNames.map((teamName) => {
                          const teamKPIs = kpisByTeam[teamName]
                          const isExpanded = expandedTeams.includes(teamName)
                          
                          return (
                            <React.Fragment key={teamName}>
                              {/* Team Header Row */}
                              <tr 
                                className="bg-gray-50 hover:bg-gray-100 cursor-pointer"
                                onClick={() => {
                                  setExpandedTeams(prev => 
                                    prev.includes(teamName) 
                                      ? prev.filter(t => t !== teamName)
                                      : [...prev, teamName]
                                  )
                                }}
                              >
                                <td className="px-6 py-3">
                                  <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isExpanded ? '' : '-rotate-90'}`} />
                                </td>
                                <td className="px-6 py-3" colSpan={8}>
                                  <div className="flex items-center space-x-3">
                                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                      <Users className="w-4 h-4 text-blue-600" />
                                    </div>
                                    <span className="font-semibold text-gray-900">{teamName}</span>
                                    <span className="text-sm text-gray-500">({teamKPIs.length} KPI)</span>
                                  </div>
                                </td>
                              </tr>
                              
                              {/* Team KPIs */}
                              {isExpanded && teamKPIs.map(kpi => (
                                <tr key={kpi.id} className="hover:bg-gray-50">
                                  <td className="px-6 py-4"></td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center pl-4">
                                      <div className={`p-2 rounded-lg ${getCategoryColor(kpi.category)} mr-3`}>
                                        {getCategoryIcon(kpi.category)}
                                      </div>
                                      <div>
                                        <button 
                                          className="text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline text-left"
                                          onClick={() => {
                                            setSelectedKPIForDetail(kpi)
                                            setShowDetailModal(true)
                                          }}
                                        >
                                          {kpi.name}
                                        </button>
                                        <div className="text-sm text-gray-500">{formatPeriod(kpi.period)}</div>
                                      </div>
                                    </div>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    <div>
                                      <div className="font-medium">{kpi.startDate} - {kpi.endDate}</div>
                                      <div className="text-xs text-gray-500">{formatPeriod(kpi.period)}</div>
                                    </div>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    <div>
                                      <div className="font-medium" suppressHydrationWarning>{new Date().toLocaleDateString('vi-VN')}</div>
                                      <div className="text-xs text-gray-500" suppressHydrationWarning>{new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}</div>
                                    </div>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {formatValue(kpi.targetValue, kpi.unit)}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {formatValue(kpi.currentValue, kpi.unit)}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                      <div className="flex-1 bg-gray-200 rounded-full h-2 mr-2">
                                        <div 
                                          className={`h-2 rounded-full ${
                                            kpi.progressPercentage >= 100 ? 'bg-green-500' :
                                            kpi.progressPercentage >= 80 ? 'bg-blue-500' :
                                            kpi.progressPercentage >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                                          }`}
                                          style={{ width: `${Math.min(kpi.progressPercentage, 100)}%` }}
                                        />
                                      </div>
                                      <span className="text-xs font-medium text-gray-900 min-w-[2.5rem]">
                                        {kpi.progressPercentage}%
                                      </span>
                                    </div>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                      kpi.status === 'not_started' ? 'bg-gray-100 text-gray-800' :
                                      kpi.status === 'active' ? 'bg-green-100 text-green-800' :
                                      kpi.status === 'paused' ? 'bg-yellow-100 text-yellow-800' :
                                      kpi.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                                      'bg-red-100 text-red-800'
                                    }`}>
                                      {kpi.status === 'not_started' ? 'Chưa bắt đầu' :
                                       kpi.status === 'active' ? 'Đang hoạt động' :
                                       kpi.status === 'paused' ? 'Tạm dừng' :
                                       kpi.status === 'completed' ? 'Hoàn thành' : 'Quá hạn'}
                                    </span>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <DropdownMenu>
                                      <DropdownMenuTrigger asChild>
                                        <button className="p-2 hover:bg-gray-100 rounded-lg">
                                          <MoreVertical className="w-4 h-4 text-gray-500" />
                                        </button>
                                      </DropdownMenuTrigger>
                                      <DropdownMenuContent align="end" className="w-48">
                                        <DropdownMenuLabel className="text-xs text-gray-500 uppercase">Thông tin</DropdownMenuLabel>
                                        <DropdownMenuItem onClick={() => {
                                          setSelectedKPIForDetail(kpi)
                                          setShowDetailModal(true)
                                        }}>
                                          <Eye className="w-4 h-4 mr-2" />
                                          Xem chi tiết
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => {
                                          setSelectedKPIForDetail(kpi)
                                          setTreeReportTab('tree')
                                          setShowTreeReportModal(true)
                                        }}>
                                          <GitBranch className="w-4 h-4 mr-2" />
                                          Xem cây mục tiêu
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => {
                                          setSelectedKPIForDetail(kpi)
                                          setTreeReportTab('report')
                                          setShowTreeReportModal(true)
                                        }}>
                                          <BarChart3 className="w-4 h-4 mr-2" />
                                          Xem báo cáo
                                        </DropdownMenuItem>
                                      </DropdownMenuContent>
                                    </DropdownMenu>
                                  </td>
                                </tr>
                              ))}
                            </React.Fragment>
                          )
                        })
                      })()}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Individual Level Tab - Grouped by Employee */}
          {activeTargetTab === 'individual' && (
            <div className="bg-white rounded-lg shadow border">
              <div className="p-6">
                {/* Filters for Individual */}
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <div className="flex flex-wrap items-center gap-4">
                    <div className="flex-1 min-w-64">
                      <div className="relative">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                          type="text"
                          placeholder="Tìm kiếm KPI cá nhân..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>
                    
                    <select
                      value={categoryFilter}
                      onChange={(e) => setCategoryFilter(e.target.value)}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="all">Tất cả danh mục</option>
                      <option value="revenue">Doanh thu</option>
                      <option value="leads">Leads</option>
                      <option value="conversion">Chuyển đổi</option>
                      <option value="tasks">Công việc</option>
                      <option value="custom">Tùy chỉnh</option>
                    </select>

                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="all">Tất cả trạng thái</option>
                      <option value="active">Đang hoạt động</option>
                      <option value="paused">Tạm dừng</option>
                      <option value="completed">Hoàn thành</option>
                      <option value="overdue">Quá hạn</option>
                    </select>

                    <input
                      type="date"
                      placeholder="Từ ngày"
                      value={startDateFilter}
                      onChange={(e) => setStartDateFilter(e.target.value)}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />

                    <input
                      type="date"
                      placeholder="Đến ngày"
                      value={endDateFilter}
                      onChange={(e) => setEndDateFilter(e.target.value)}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />

                    <button
                      onClick={resetFilters}
                      className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 flex items-center space-x-2"
                    >
                      <X className="w-4 h-4" />
                      <span>Xóa bộ lọc</span>
                    </button>

                    {<button
                      onClick={() => setShowAddKPIModal(true)}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Thêm KPI</span>
                    </button>}
                  </div>
                </div>
                {/* Grouped by Employee View */}
                <div className="border rounded-lg overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-8"></th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Nhân viên / KPI
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Thời gian KPI
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Ngày hiện tại
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Mục tiêu
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Hiện tại
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Tiến độ
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Trạng thái
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Thao tác
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {(() => {
                        const filteredKPIs = getFilteredKPIsByLevel('individual')
                        // Group by employee
                        const kpisByEmployee = filteredKPIs.reduce((acc: Record<string, typeof filteredKPIs>, kpi) => {
                          const employeeName = kpi.assignedTo[0] || 'Không xác định'
                          if (!acc[employeeName]) acc[employeeName] = []
                          acc[employeeName].push(kpi)
                          return acc
                        }, {})
                        
                        const employeeNames = Object.keys(kpisByEmployee)
                        
                        if (employeeNames.length === 0) {
                          return (
                            <tr>
                              <td colSpan={9} className="px-6 py-12 text-center">
                                <div className="text-gray-500">
                                  <Search className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                                  <p className="text-lg font-medium mb-2">Không tìm thấy KPI cá nhân</p>
                                  <p className="text-sm">Thử điều chỉnh bộ lọc hoặc tìm kiếm với từ khóa khác</p>
                                </div>
                              </td>
                            </tr>
                          )
                        }
                        
                        return employeeNames.map((employeeName) => {
                          const employeeKPIs = kpisByEmployee[employeeName]
                          const isExpanded = expandedEmployees.includes(employeeName)
                          
                          return (
                            <React.Fragment key={employeeName}>
                              {/* Employee Header Row */}
                              <tr 
                                className="bg-gray-50 hover:bg-gray-100 cursor-pointer"
                                onClick={() => {
                                  setExpandedEmployees(prev => 
                                    prev.includes(employeeName) 
                                      ? prev.filter(e => e !== employeeName)
                                      : [...prev, employeeName]
                                  )
                                }}
                              >
                                <td className="px-6 py-3">
                                  <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isExpanded ? '' : '-rotate-90'}`} />
                                </td>
                                <td className="px-6 py-3" colSpan={8}>
                                  <div className="flex items-center space-x-3">
                                    <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                                      <User className="w-4 h-4 text-orange-600" />
                                    </div>
                                    <span className="font-semibold text-gray-900">{employeeName}</span>
                                    <span className="text-sm text-gray-500">({employeeKPIs.length} KPI)</span>
                                  </div>
                                </td>
                              </tr>
                              
                              {/* Employee KPIs */}
                              {isExpanded && employeeKPIs.map(kpi => (
                                <tr key={kpi.id} className="hover:bg-gray-50">
                                  <td className="px-6 py-4"></td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center pl-4">
                                      <div className={`p-2 rounded-lg ${getCategoryColor(kpi.category)} mr-3`}>
                                        {getCategoryIcon(kpi.category)}
                                      </div>
                                      <div>
                                        <button 
                                          className="text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline text-left"
                                          onClick={() => {
                                            setSelectedKPIForDetail(kpi)
                                            setShowDetailModal(true)
                                          }}
                                        >
                                          {kpi.name}
                                        </button>
                                        <div className="text-sm text-gray-500">{formatPeriod(kpi.period)}</div>
                                      </div>
                                    </div>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    <div>
                                      <div className="font-medium">{kpi.startDate} - {kpi.endDate}</div>
                                      <div className="text-xs text-gray-500">{formatPeriod(kpi.period)}</div>
                                    </div>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    <div>
                                      <div className="font-medium" suppressHydrationWarning>{new Date().toLocaleDateString('vi-VN')}</div>
                                      <div className="text-xs text-gray-500" suppressHydrationWarning>{new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}</div>
                                    </div>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {formatValue(kpi.targetValue, kpi.unit)}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {formatValue(kpi.currentValue, kpi.unit)}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                      <div className="flex-1 bg-gray-200 rounded-full h-2 mr-2">
                                        <div 
                                          className={`h-2 rounded-full ${
                                            kpi.progressPercentage >= 100 ? 'bg-green-500' :
                                            kpi.progressPercentage >= 80 ? 'bg-blue-500' :
                                            kpi.progressPercentage >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                                          }`}
                                          style={{ width: `${Math.min(kpi.progressPercentage, 100)}%` }}
                                        />
                                      </div>
                                      <span className="text-xs font-medium text-gray-900 min-w-[2.5rem]">
                                        {kpi.progressPercentage}%
                                      </span>
                                    </div>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                      kpi.status === 'not_started' ? 'bg-gray-100 text-gray-800' :
                                      kpi.status === 'active' ? 'bg-green-100 text-green-800' :
                                      kpi.status === 'paused' ? 'bg-yellow-100 text-yellow-800' :
                                      kpi.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                                      'bg-red-100 text-red-800'
                                    }`}>
                                      {kpi.status === 'not_started' ? 'Chưa bắt đầu' :
                                       kpi.status === 'active' ? 'Đang hoạt động' :
                                       kpi.status === 'paused' ? 'Tạm dừng' :
                                       kpi.status === 'completed' ? 'Hoàn thành' : 'Quá hạn'}
                                    </span>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <DropdownMenu>
                                      <DropdownMenuTrigger asChild>
                                        <button className="p-2 hover:bg-gray-100 rounded-lg">
                                          <MoreVertical className="w-4 h-4 text-gray-500" />
                                        </button>
                                      </DropdownMenuTrigger>
                                      <DropdownMenuContent align="end" className="w-48">
                                        <DropdownMenuLabel className="text-xs text-gray-500 uppercase">Thông tin</DropdownMenuLabel>
                                        <DropdownMenuItem onClick={() => {
                                          setSelectedKPIForDetail(kpi)
                                          setShowDetailModal(true)
                                        }}>
                                          <Eye className="w-4 h-4 mr-2" />
                                          Xem chi tiết
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuLabel className="text-xs text-gray-500 uppercase">Thao tác nhanh</DropdownMenuLabel>
                                        <DropdownMenuItem>
                                          <ShoppingCart className="w-4 h-4 mr-2" />
                                          Chỉnh sửa
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuLabel className="text-xs text-gray-500 uppercase">Thao tác nguy hiểm</DropdownMenuLabel>
                                        <DropdownMenuItem 
                                          className="text-red-600 focus:text-red-600"
                                          onClick={() => handleDeleteKPI(kpi.id)}
                                        >
                                          <Trash2 className="w-4 h-4 mr-2" />
                                          Xóa KPI
                                        </DropdownMenuItem>
                                      </DropdownMenuContent>
                                    </DropdownMenu>
                                  </td>
                                </tr>
                              ))}
                            </React.Fragment>
                          )
                        })
                      })()}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>

      {/* Reports Tab */}
      {false && activeTab === 'reports' && (
        <div className="space-y-6">
          <div className="bg-white p-8 rounded-lg shadow border text-center">
            <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Báo cáo KPI</h3>
            <p className="text-gray-600 mb-4">Tính năng báo cáo chi tiết sẽ được phát triển trong phiên bản tiếp theo</p>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
              Xem báo cáo mẫu
            </button>
          </div>
        </div>
      )}

      {/* Settings Tab */}
      {false && activeTab === 'settings' && (
        <div className="space-y-6">
          <div className="bg-white p-8 rounded-lg shadow border text-center">
            <Settings className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Cài đặt KPI</h3>
            <p className="text-gray-600 mb-4">Tính năng cài đặt nâng cao sẽ được phát triển trong phiên bản tiếp theo</p>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
              Xem cài đặt hiện tại
            </button>
          </div>
        </div>
      )}

      {/* Add KPI Modal */}
      {showAddKPIModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-xl w-full m-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Thêm KPI</h2>
                <button
                  onClick={() => setShowAddKPIModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                {/* Mục tiêu (Target Name) - Required */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mục tiêu <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={newKPI.name}
                    onChange={(e) => setNewKPI({...newKPI, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Nhập tên mục tiêu KPI..."
                  />
                </div>

                {/* Giao cho (Assign To) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Giao cho</label>
                  <select
                    value={newKPI.assignedTo[0] || ''}
                    onChange={(e) => setNewKPI({...newKPI, assignedTo: e.target.value ? [e.target.value] : []})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Chọn người được giao</option>
                    {organizationStructure.individuals.map((person, idx) => (
                      <option key={idx} value={person}>{person}</option>
                    ))}
                  </select>
                </div>

                {/* Liên kết với nhóm (Linked Group)
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Liên kết với nhóm</label>
                  <select
                    value={newKPI.linkedGroup}
                    onChange={(e) => setNewKPI({...newKPI, linkedGroup: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Chọn nhóm liên kết</option>
                    {organizationStructure.teams.map((team) => (
                      <option key={team.id} value={team.id}>{team.name}</option>
                    ))}
                  </select>
                </div> */}

                {/* Chỉ số (Indicator) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Loại KPI</label>
                  <select
                    value={newKPI.indicator}
                    onChange={(e) => {
                      const unitMap: Record<string, string> = {
                        'revenue': 'VND',
                        'leads': 'leads',
                        'conversion': '%',
                        'tasks': 'công việc'
                      }
                      setNewKPI({
                        ...newKPI, 
                        indicator: e.target.value,
                        unit: unitMap[e.target.value] || 'VND',
                        category: (e.target.value || 'revenue') as KPITarget['category']
                      })
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Chọn loại KPI</option>
                    <option value="revenue">Doanh số</option>
                    <option value="leads">Leads</option>
                    <option value="conversion">Chuyển đổi</option>
                    <option value="tasks">Công việc</option>
                  </select>
                </div>

                {/* Giá trị mục tiêu (Target Value) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Giá trị mục tiêu</label>
                  <input
                    type="number"
                    value={newKPI.targetValue || ''}
                    onChange={(e) => setNewKPI({...newKPI, targetValue: Number(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="0"
                  />
                </div>

                {/* Thời gian (Period - Year/Month/Week Selection) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Chọn thời gian <span className="text-red-500">*</span></label>
                  <div className="flex gap-3">
                    <select
                      value={kpiYear}
                      onChange={(e) => {
                        setKpiYear(Number(e.target.value))
                        setKpiWeek(1)
                      }}
                      className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      {[2024, 2025, 2026, 2027, 2028, 2029, 2030].map(year => (
                        <option key={year} value={year}>Năm {year}</option>
                      ))}
                    </select>
                    <select
                      value={kpiMonth}
                      onChange={(e) => {
                        setKpiMonth(Number(e.target.value))
                        setKpiWeek(1)
                      }}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value={0}>Chọn tháng</option>
                      <option value={1}>Tháng 1</option>
                      <option value={2}>Tháng 2</option>
                      <option value={3}>Tháng 3</option>
                      <option value={4}>Tháng 4</option>
                      <option value={5}>Tháng 5</option>
                      <option value={6}>Tháng 6</option>
                      <option value={7}>Tháng 7</option>
                      <option value={8}>Tháng 8</option>
                      <option value={9}>Tháng 9</option>
                      <option value={10}>Tháng 10</option>
                      <option value={11}>Tháng 11</option>
                      <option value={12}>Tháng 12</option>
                    </select>
                    <select
                      value={kpiWeek}
                      onChange={(e) => setKpiWeek(Number(e.target.value))}
                      className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      disabled={kpiMonth === 0}
                    >
                      <option value={0}>Theo tháng</option>
                      {kpiMonth > 0 && getWeeksInMonth(kpiYear, kpiMonth).map(week => (
                        <option key={week} value={week}>Tuần {week}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Người theo dõi (Watchers) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Người theo dõi</label>
                  <div className="space-y-2 max-h-32 overflow-y-auto border border-gray-300 rounded-lg p-3">
                    {organizationStructure.individuals.map((person, index) => (
                      <label key={index} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={newKPI.watchers.includes(person)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setNewKPI({...newKPI, watchers: [...newKPI.watchers, person]})
                            } else {
                              setNewKPI({...newKPI, watchers: newKPI.watchers.filter(w => w !== person)})
                            }
                          }}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">{person}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Trạng thái (Status) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
                  <select
                    value={newKPI.status}
                    onChange={(e) => setNewKPI({...newKPI, status: e.target.value as typeof newKPI.status})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="not_started">Chưa bắt đầu</option>
                    <option value="active">Đang hoạt động</option>
                    <option value="paused">Tạm dừng</option>
                    <option value="completed">Hoàn thành</option>
                    <option value="overdue">Quá hạn</option>
                  </select>
                </div>

                {/* Mô tả (Description) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
                  <textarea
                    value={newKPI.description}
                    onChange={(e) => setNewKPI({...newKPI, description: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows={3}
                    placeholder="Mô tả chi tiết về KPI..."
                  />
                </div>
              </div>

              {/* Footer Buttons */}
              <div className="flex justify-end space-x-3 mt-6 pt-4 border-t">
                <button
                  onClick={() => setShowAddKPIModal(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  Hủy
                </button>
                <button
                  onClick={handleAddKPI}
                  disabled={!newKPI.name}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Lưu
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Combined Tree Diagram + Report Modal */}
      {showTreeReportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full m-4 max-h-[90vh] flex flex-col">
            <div className="p-6 flex flex-col h-full">
              {/* Header with Tabs */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-6">
                  <button
                    onClick={() => setTreeReportTab('tree')}
                    className={`py-2 px-1 text-sm font-medium border-b-2 transition-colors ${
                      treeReportTab === 'tree'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    Sơ đồ cây
                  </button>
                  <button
                    onClick={() => setTreeReportTab('report')}
                    className={`py-2 px-1 text-sm font-medium border-b-2 transition-colors ${
                      treeReportTab === 'report'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    Báo cáo
                  </button>
                </div>
                <button
                  onClick={() => setShowTreeReportModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Tree Tab Content - Card-based Vertical Layout */}
              {treeReportTab === 'tree' && (
                <div className="flex-1 overflow-hidden">
                  {/* Zoom and Pan Controls */}
                  <div className="flex items-center justify-between mb-4 px-2">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <span className="flex items-center space-x-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                        </svg>
                        <span>Kéo thả để di chuyển</span>
                      </span>
                      {(treePan.x !== 0 || treePan.y !== 0) && (
                        <button 
                          onClick={() => setTreePan({ x: 0, y: 0 })}
                          className="text-blue-600 hover:text-blue-800 hover:underline ml-2"
                        >
                          Đặt lại vị trí
                        </button>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <button 
                        className="p-2 border rounded-lg hover:bg-gray-100"
                        onClick={() => setTreeZoom(prev => Math.min(prev + 10, 150))}
                      >
                        <Plus className="w-4 h-4 text-gray-600" />
                      </button>
                      <span className="px-3 py-1 bg-gray-100 rounded-lg text-sm font-medium min-w-[3.5rem] text-center">
                        {treeZoom}%
                      </span>
                      <button 
                        className="p-2 border rounded-lg hover:bg-gray-100"
                        onClick={() => setTreeZoom(prev => Math.max(prev - 10, 30))}
                      >
                        <span className="text-gray-600 text-sm font-medium">−</span>
                      </button>
                    </div>
                  </div>

                  {/* Card-based Tree Diagram */}
                  <div 
                    ref={treeContainerRef}
                    className={`overflow-auto bg-gray-100 p-6 ${isDraggingTree ? 'cursor-grabbing' : 'cursor-grab'}`}
                    style={{ maxHeight: 'calc(90vh - 200px)' }}
                    onMouseDown={(e) => {
                      // Start dragging on mouse down
                      if (e.button === 0) { // Left mouse button
                        setIsDraggingTree(true)
                        setDragStart({ x: e.clientX - treePan.x, y: e.clientY - treePan.y })
                      }
                    }}
                    onMouseMove={(e) => {
                      if (isDraggingTree) {
                        const newX = e.clientX - dragStart.x
                        const newY = e.clientY - dragStart.y
                        setTreePan({ x: newX, y: newY })
                      }
                    }}
                    onMouseUp={() => setIsDraggingTree(false)}
                    onMouseLeave={() => setIsDraggingTree(false)}
                  >
                    <div 
                      style={{ 
                        transform: `scale(${treeZoom / 100}) translate(${treePan.x}px, ${treePan.y}px)`,
                        transformOrigin: 'top center',
                        minWidth: '1200px',
                        transition: isDraggingTree ? 'none' : 'transform 0.1s ease-out'
                      }}
                    >
                      {/* Root Node - Quarter Target */}
                      <div className="flex flex-col items-center">
                        <div className="bg-blue-800 text-white rounded-lg p-4 shadow-lg min-w-[200px] text-center mb-8">
                          <h3 className="font-bold text-lg">Chỉ tiêu chi nhánh Q4/2...</h3>
                          <p className="text-sm text-blue-200">Oct 01 - Dec 31 2025</p>
                          <p className="text-2xl font-bold mt-2">17.07%</p>
                          <div className="w-full bg-blue-600 rounded-full h-2 mt-2">
                            <div className="h-2 bg-white rounded-full" style={{ width: '17%' }} />
                          </div>
                        </div>
                        
                        {/* Vertical Line from Root */}
                        <div className="w-0.5 h-8 bg-gray-300" />
                        
                        {/* Level 1 - Company KPIs */}
                        <div className="flex flex-wrap justify-center gap-4 max-w-[1400px]">
                          {kpiTargets.filter(k => k.assignmentLevel === 'company').map((companyKPI, idx) => {
                            const isExpanded = expandedTreeNodes.includes(companyKPI.id)
                            const childKPIs = kpiTargets.filter(k => companyKPI.childKPIs?.includes(k.id))
                            const progressColor = companyKPI.progressPercentage >= 50 ? 'bg-yellow-400' : 'bg-red-400'
                            
                            return (
                              <div key={companyKPI.id} className="flex flex-col items-center">
                                {/* Company KPI Card */}
                                <div 
                                  className="bg-white rounded-lg shadow border border-gray-200 p-3 min-w-[180px] max-w-[200px] cursor-pointer hover:shadow-md transition-shadow"
                                  onClick={() => {
                                    setExpandedTreeNodes(prev => 
                                      prev.includes(companyKPI.id) 
                                        ? prev.filter(id => id !== companyKPI.id)
                                        : [...prev, companyKPI.id]
                                    )
                                  }}
                                >
                                  <div className="text-xs text-gray-500 mb-1">
                                    kpi · công ty · Oct 01 - Dec 31 ...
                                  </div>
                                  <h4 className="font-medium text-gray-900 text-sm truncate">{companyKPI.name}</h4>
                                  <div className="flex items-center space-x-2 mt-2">
                                    <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                                      <div className={`h-1.5 rounded-full ${progressColor}`} style={{ width: `${Math.min(companyKPI.progressPercentage, 100)}%` }} />
                                    </div>
                                    <span className="text-xs font-medium text-gray-700">{companyKPI.progressPercentage.toFixed(2)}%</span>
                                  </div>
                                  <div className="flex items-center justify-between mt-2">
                                    <div className="flex items-center space-x-1">
                                      <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center">
                                        <User className="w-3 h-3 text-gray-500" />
                                      </div>
                                      <span className="text-xs text-gray-600">{companyKPI.assignedTo[0]}</span>
                                    </div>
                                    <div className="flex items-center text-xs text-gray-500">
                                      <span>{childKPIs.length}</span>
                                      <ChevronDown className={`w-3 h-3 ml-1 transition-transform ${isExpanded ? '' : '-rotate-90'}`} />
                                    </div>
                                  </div>
                                </div>
                                
                                {/* Level 2 - Department/Team KPIs */}
                                {isExpanded && childKPIs.length > 0 && (
                                  <>
                                    <div className="w-0.5 h-4 bg-gray-300" />
                                    <div className="flex flex-wrap justify-center gap-3 max-w-[600px]">
                                      {childKPIs.map((deptKPI) => {
                                        const isDeptExpanded = expandedTreeNodes.includes(deptKPI.id)
                                        const subChildKPIs = kpiTargets.filter(k => deptKPI.childKPIs?.includes(k.id))
                                        const deptProgressColor = deptKPI.progressPercentage >= 50 ? 'bg-yellow-400' : 'bg-red-400'
                                        
                                        return (
                                          <div key={deptKPI.id} className="flex flex-col items-center">
                                            <div 
                                              className="bg-white rounded-lg shadow border border-gray-200 p-2.5 min-w-[160px] max-w-[180px] cursor-pointer hover:shadow-md transition-shadow"
                                              onClick={(e) => {
                                                e.stopPropagation()
                                                setExpandedTreeNodes(prev => 
                                                  prev.includes(deptKPI.id) 
                                                    ? prev.filter(id => id !== deptKPI.id)
                                                    : [...prev, deptKPI.id]
                                                )
                                              }}
                                            >
                                              <div className="text-xs text-gray-500 mb-1">
                                                kpi · phòng ban · Oct 01 - Dec 31 ...
                                              </div>
                                              <h5 className="font-medium text-gray-900 text-xs truncate">{deptKPI.name}</h5>
                                              <div className="flex items-center space-x-2 mt-2">
                                                <div className="flex-1 bg-gray-200 rounded-full h-1">
                                                  <div className={`h-1 rounded-full ${deptProgressColor}`} style={{ width: `${Math.min(deptKPI.progressPercentage, 100)}%` }} />
                                                </div>
                                                <span className="text-xs font-medium text-gray-700">{deptKPI.progressPercentage.toFixed(2)}%</span>
                                              </div>
                                              <div className="flex items-center justify-between mt-2">
                                                <div className="flex items-center space-x-1">
                                                  <div className="w-5 h-5 bg-gray-200 rounded-full flex items-center justify-center">
                                                    <User className="w-2.5 h-2.5 text-gray-500" />
                                                  </div>
                                                  <span className="text-xs text-gray-600 truncate max-w-[80px]">{deptKPI.assignedTo[0]}</span>
                                                </div>
                                                <div className="flex items-center text-xs text-gray-500">
                                                  <span>{subChildKPIs.length}</span>
                                                  <ChevronDown className={`w-3 h-3 ml-1 transition-transform ${isDeptExpanded ? '' : '-rotate-90'}`} />
                                                </div>
                                              </div>
                                            </div>
                                            
                                            {/* Level 3 - Team/Individual KPIs */}
                                            {isDeptExpanded && subChildKPIs.length > 0 && (
                                              <>
                                                <div className="w-0.5 h-3 bg-gray-200" />
                                                <div className="flex flex-wrap justify-center gap-2 max-w-[400px]">
                                                  {subChildKPIs.map((teamKPI) => {
                                                    const teamProgressColor = teamKPI.progressPercentage >= 50 ? 'bg-green-400' : 'bg-red-400'
                                                    
                                                    return (
                                                      <div key={teamKPI.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-2 min-w-[140px] max-w-[160px]">
                                                        <div className="text-xs text-gray-400 mb-1">
                                                          MT cá nhân · okr · 📎
                                                        </div>
                                                        <h6 className="font-medium text-gray-800 text-xs truncate">{teamKPI.name}</h6>
                                                        <div className="flex items-center space-x-2 mt-1">
                                                          <div className="flex-1 bg-gray-200 rounded-full h-1">
                                                            <div className={`h-1 rounded-full ${teamProgressColor}`} style={{ width: `${Math.min(teamKPI.progressPercentage, 100)}%` }} />
                                                          </div>
                                                          <span className="text-xs text-gray-600">{teamKPI.progressPercentage.toFixed(2)}%</span>
                                                        </div>
                                                        <p className="text-xs text-gray-400 mt-1">Không có người theo dõi</p>
                                                      </div>
                                                    )
                                                  })}
                                                </div>
                                              </>
                                            )}
                                          </div>
                                        )
                                      })}
                                    </div>
                                  </>
                                )}
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Report Tab Content */}
              {treeReportTab === 'report' && (
                <div className="flex-1 overflow-auto">
                  {/* Overview Cards */}
                  <div className="grid grid-cols-4 gap-4 mb-6">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-blue-600 font-medium">Tổng KPI</p>
                          <p className="text-2xl font-bold text-blue-900">{kpiTargets.length}</p>
                        </div>
                        <Target className="w-8 h-8 text-blue-500" />
                      </div>
                    </div>
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-green-600 font-medium">Hoàn thành</p>
                          <p className="text-2xl font-bold text-green-900">{kpiTargets.filter(k => k.progressPercentage >= 100).length}</p>
                        </div>
                        <CheckCircle className="w-8 h-8 text-green-500" />
                      </div>
                    </div>
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-yellow-600 font-medium">Đang thực hiện</p>
                          <p className="text-2xl font-bold text-yellow-900">{kpiTargets.filter(k => k.progressPercentage > 0 && k.progressPercentage < 100).length}</p>
                        </div>
                        <Clock className="w-8 h-8 text-yellow-500" />
                      </div>
                    </div>
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-red-600 font-medium">Cần chú ý</p>
                          <p className="text-2xl font-bold text-red-900">{kpiTargets.filter(k => k.progressPercentage < 60).length}</p>
                        </div>
                        <AlertCircle className="w-8 h-8 text-red-500" />
                      </div>
                    </div>
                  </div>

                  {/* Chart Area */}
                  <div className="grid grid-cols-2 gap-6 mb-6">
                    {/* Pie Chart Placeholder */}
                    <div className="border rounded-lg p-4">
                      <h3 className="font-semibold text-gray-900 mb-4">Phân bổ theo trạng thái</h3>
                      <div className="flex items-center justify-center h-48">
                        <div className="relative w-40 h-40">
                          <div className="absolute inset-0 rounded-full border-8 border-green-500" style={{ clipPath: 'polygon(50% 50%, 50% 0%, 100% 0%, 100% 50%)' }} />
                          <div className="absolute inset-0 rounded-full border-8 border-blue-500" style={{ clipPath: 'polygon(50% 50%, 100% 50%, 100% 100%, 50% 100%)' }} />
                          <div className="absolute inset-0 rounded-full border-8 border-yellow-500" style={{ clipPath: 'polygon(50% 50%, 50% 100%, 0% 100%, 0% 50%)' }} />
                          <div className="absolute inset-0 rounded-full border-8 border-red-500" style={{ clipPath: 'polygon(50% 50%, 0% 50%, 0% 0%, 50% 0%)' }} />
                          <div className="absolute inset-4 bg-white rounded-full flex items-center justify-center">
                            <PieChart className="w-8 h-8 text-gray-400" />
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-center space-x-4 mt-4">
                        <div className="flex items-center space-x-1">
                          <div className="w-3 h-3 bg-green-500 rounded-full" />
                          <span className="text-xs text-gray-600">Hoàn thành</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <div className="w-3 h-3 bg-blue-500 rounded-full" />
                          <span className="text-xs text-gray-600">Tốt</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                          <span className="text-xs text-gray-600">Trung bình</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <div className="w-3 h-3 bg-red-500 rounded-full" />
                          <span className="text-xs text-gray-600">Cần cải thiện</span>
                        </div>
                      </div>
                    </div>

                    {/* Progress Overview */}
                    <div className="border rounded-lg p-4">
                      <h3 className="font-semibold text-gray-900 mb-4">Tiến độ trung bình theo cấp</h3>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-600">Công ty</span>
                            <span className="font-medium">{Math.round(kpiTargets.filter(k => k.assignmentLevel === 'company').reduce((sum, k) => sum + k.progressPercentage, 0) / Math.max(kpiTargets.filter(k => k.assignmentLevel === 'company').length, 1))}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-3">
                            <div className="bg-blue-600 h-3 rounded-full" style={{ width: `${Math.round(kpiTargets.filter(k => k.assignmentLevel === 'company').reduce((sum, k) => sum + k.progressPercentage, 0) / Math.max(kpiTargets.filter(k => k.assignmentLevel === 'company').length, 1))}%` }} />
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-600">Phòng ban</span>
                            <span className="font-medium">{Math.round(kpiTargets.filter(k => k.assignmentLevel === 'department').reduce((sum, k) => sum + k.progressPercentage, 0) / Math.max(kpiTargets.filter(k => k.assignmentLevel === 'department').length, 1))}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-3">
                            <div className="bg-green-600 h-3 rounded-full" style={{ width: `${Math.round(kpiTargets.filter(k => k.assignmentLevel === 'department').reduce((sum, k) => sum + k.progressPercentage, 0) / Math.max(kpiTargets.filter(k => k.assignmentLevel === 'department').length, 1))}%` }} />
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-600">Nhóm</span>
                            <span className="font-medium">{Math.round(kpiTargets.filter(k => k.assignmentLevel === 'team').reduce((sum, k) => sum + k.progressPercentage, 0) / Math.max(kpiTargets.filter(k => k.assignmentLevel === 'team').length, 1))}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-3">
                            <div className="bg-orange-600 h-3 rounded-full" style={{ width: `${Math.round(kpiTargets.filter(k => k.assignmentLevel === 'team').reduce((sum, k) => sum + k.progressPercentage, 0) / Math.max(kpiTargets.filter(k => k.assignmentLevel === 'team').length, 1))}%` }} />
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-600">Cá nhân</span>
                            <span className="font-medium">{Math.round(kpiTargets.filter(k => k.assignmentLevel === 'individual').reduce((sum, k) => sum + k.progressPercentage, 0) / Math.max(kpiTargets.filter(k => k.assignmentLevel === 'individual').length, 1))}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-3">
                            <div className="bg-purple-600 h-3 rounded-full" style={{ width: `${Math.round(kpiTargets.filter(k => k.assignmentLevel === 'individual').reduce((sum, k) => sum + k.progressPercentage, 0) / Math.max(kpiTargets.filter(k => k.assignmentLevel === 'individual').length, 1))}%` }} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Performance Table */}
                  <div className="border rounded-lg overflow-hidden">
                    <div className="bg-gray-50 px-4 py-3">
                      <h3 className="font-semibold text-gray-900">Chi tiết hiệu suất KPI</h3>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50 border-t border-b">
                          <tr>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Tên KPI</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Cấp độ</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Phân công</th>
                            <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">Mục tiêu</th>
                            <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">Hiện tại</th>
                            <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">Tiến độ</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y">
                          {kpiTargets.slice(0, 10).map(kpi => (
                            <tr key={kpi.id} className="hover:bg-gray-50">
                              <td className="px-4 py-3">
                                <span className="font-medium text-gray-900">{kpi.name}</span>
                              </td>
                              <td className="px-4 py-3">
                                <span className={`px-2 py-1 text-xs rounded-full ${
                                  kpi.assignmentLevel === 'company' ? 'bg-blue-100 text-blue-700' :
                                  kpi.assignmentLevel === 'department' ? 'bg-green-100 text-green-700' :
                                  kpi.assignmentLevel === 'team' ? 'bg-orange-100 text-orange-700' :
                                  'bg-purple-100 text-purple-700'
                                }`}>
                                  {getAssignmentLevelName(kpi.assignmentLevel)}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-600">{kpi.assignedTo.join(', ')}</td>
                              <td className="px-4 py-3 text-right text-sm text-gray-900">{formatValue(kpi.targetValue, kpi.unit)}</td>
                              <td className="px-4 py-3 text-right text-sm text-gray-900">{formatValue(kpi.currentValue, kpi.unit)}</td>
                              <td className="px-4 py-3">
                                <div className="flex items-center justify-center space-x-2">
                                  <div className="w-16 bg-gray-200 rounded-full h-2">
                                    <div 
                                      className={`h-2 rounded-full ${
                                        kpi.progressPercentage >= 100 ? 'bg-green-500' :
                                        kpi.progressPercentage >= 80 ? 'bg-blue-500' :
                                        kpi.progressPercentage >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                                      }`}
                                      style={{ width: `${Math.min(kpi.progressPercentage, 100)}%` }}
                                    />
                                  </div>
                                  <span className="text-sm font-medium text-gray-900">{kpi.progressPercentage}%</span>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* Footer */}
              <div className="flex justify-end mt-6 pt-4 border-t space-x-3">
                <button
                  onClick={() => setShowTreeReportModal(false)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                >
                  Đóng
                </button>
                {treeReportTab === 'report' && (
                  <button className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 flex items-center space-x-2">
                    <Download className="w-4 h-4" />
                    <span>Xuất báo cáo</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {showDetailModal && selectedKPIForDetail && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full m-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">{selectedKPIForDetail.name}</h2>
                <button
                  onClick={() => {
                    setShowDetailModal(false)
                    setSelectedKPIForDetail(null)
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Info Grid - 6 fields */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div>
                  <label className="text-xs text-gray-500 uppercase font-medium">CHU KỲ</label>
                  <p className="text-sm text-gray-900 mt-1">{new Date(selectedKPIForDetail.startDate).toLocaleDateString('vi-VN')} - {new Date(selectedKPIForDetail.endDate).toLocaleDateString('vi-VN')}</p>
                </div>
                <div>
                  <label className="text-xs text-gray-500 uppercase font-medium">LOẠI MỤC TIÊU</label>
                  <p className="text-sm text-gray-900 mt-1">
                    {selectedKPIForDetail.assignmentLevel === 'company' ? 'Công ty' :
                     selectedKPIForDetail.assignmentLevel === 'department' ? 'Phòng ban' :
                     selectedKPIForDetail.assignmentLevel === 'team' ? 'Nhóm' : 'Cá nhân'}
                  </p>
                </div>
                <div>
                  <label className="text-xs text-gray-500 uppercase font-medium"></label>
                  <p className="text-sm text-gray-900 mt-1">{selectedKPIForDetail.assignedTo.join(', ')}</p>
                </div>
                <div>
                  <label className="text-xs text-gray-500 uppercase font-medium">NGƯỜI THEO DÕI</label>
                  <div className="flex items-center space-x-2 mt-1">
                    <Lock className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-400">Hoàng Chính Nghĩa</span>
                  </div>
                </div>
                <div>
                  <label className="text-xs text-gray-500 uppercase font-medium">NGÀY BẮT ĐẦU</label>
                  <p className="text-sm text-gray-900 mt-1">{new Date(selectedKPIForDetail.startDate).toLocaleDateString('vi-VN')}</p>
                </div>
                <div>
                  <label className="text-xs text-gray-500 uppercase font-medium">NGÀY KẾT THÚC</label>
                  <p className="text-sm text-gray-900 mt-1">{new Date(selectedKPIForDetail.endDate).toLocaleDateString('vi-VN')}</p>
                </div>
              </div>

              {/* KPI con - Tree List with Hierarchy */}
              <div className="mb-6">
                <div className="border rounded-lg overflow-hidden max-h-[400px] overflow-y-auto">
                  {selectedKPIForDetail.childKPIs && selectedKPIForDetail.childKPIs.length > 0 ? (
                    <div>
                      {/* Render hierarchical KPI tree */}
                      {(() => {
                        // Get direct children - Phòng ban level
                        const deptKPIs = kpiTargets.filter(k => selectedKPIForDetail.childKPIs?.includes(k.id))
                        
                        return deptKPIs.map((deptKPI) => {
                          const isDeptExpanded = expandedDetailKPIs.includes(deptKPI.id)
                          const teamKPIs = kpiTargets.filter(k => deptKPI.childKPIs?.includes(k.id))
                          
                          return (
                            <div key={deptKPI.id} className="border-b last:border-b-0">
                              {/* Phòng ban Row */}
                              <div 
                                className="flex items-center p-3 hover:bg-gray-50 cursor-pointer"
                                onClick={() => {
                                  setExpandedDetailKPIs(prev => 
                                    prev.includes(deptKPI.id) 
                                      ? prev.filter(id => id !== deptKPI.id) 
                                      : [...prev, deptKPI.id]
                                  )
                                }}
                              >
                                <div className="flex items-center flex-1">
                                  {teamKPIs.length > 0 && (
                                    <ChevronDown className={`w-4 h-4 text-gray-400 mr-2 transition-transform ${isDeptExpanded ? '' : '-rotate-90'}`} />
                                  )}
                                  {teamKPIs.length === 0 && <div className="w-6" />}
                                  <span 
                                    className="text-sm text-blue-600 hover:underline cursor-pointer font-medium"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      setSelectedKPIForDetail(deptKPI)
                                    }}
                                  >
                                    {deptKPI.assignedTo[0]} » {deptKPI.name}: {deptKPI.targetValue} ({deptKPI.unit})
                                  </span>
                                </div>
                                <div className="flex items-center space-x-4">
                                  <div className="flex items-center space-x-2">
                                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                                      <User className="w-4 h-4 text-gray-500" />
                                    </div>
                                    <span className="text-sm text-gray-600">{deptKPI.assignedTo[0]}</span>
                                  </div>
                                  <span className="text-xs text-gray-500 w-28">Oct 01 - Dec 31 2025</span>
                                  <div className="flex items-center space-x-2 w-24">
                                    <span className="text-sm font-medium text-gray-900">{deptKPI.progressPercentage.toFixed(2)}%</span>
                                    <div className="w-12 bg-gray-200 rounded-full h-1.5">
                                      <div 
                                        className={`h-1.5 rounded-full ${deptKPI.progressPercentage >= 50 ? 'bg-blue-500' : 'bg-red-500'}`}
                                        style={{ width: `${Math.min(deptKPI.progressPercentage, 100)}%` }}
                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>
                              
                              {/* Team Level - Nhóm */}
                              {isDeptExpanded && teamKPIs.map((teamKPI) => {
                                const isTeamExpanded = expandedDetailKPIs.includes(teamKPI.id)
                                const indKPIs = kpiTargets.filter(k => teamKPI.childKPIs?.includes(k.id))
                                
                                return (
                                  <div key={teamKPI.id}>
                                    {/* Team Row */}
                                    <div 
                                      className="flex items-center p-3 pl-8 hover:bg-gray-50 cursor-pointer border-t border-gray-100"
                                      onClick={() => {
                                        setExpandedDetailKPIs(prev => 
                                          prev.includes(teamKPI.id) 
                                            ? prev.filter(id => id !== teamKPI.id) 
                                            : [...prev, teamKPI.id]
                                        )
                                      }}
                                    >
                                      <div className="flex items-center flex-1">
                                        {indKPIs.length > 0 && (
                                          <ChevronDown className={`w-4 h-4 text-gray-400 mr-2 transition-transform ${isTeamExpanded ? '' : '-rotate-90'}`} />
                                        )}
                                        {indKPIs.length === 0 && <div className="w-6" />}
                                        <span 
                                          className="text-sm text-blue-600 hover:underline cursor-pointer"
                                          onClick={(e) => {
                                            e.stopPropagation()
                                            setSelectedKPIForDetail(teamKPI)
                                          }}
                                        >
                                          {teamKPI.assignedTo[0]} » {teamKPI.name}: {teamKPI.targetValue} ({teamKPI.unit})
                                        </span>
                                      </div>
                                      <div className="flex items-center space-x-4">
                                        <div className="flex items-center space-x-2">
                                          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                                            <User className="w-4 h-4 text-gray-500" />
                                          </div>
                                          <span className="text-sm text-gray-600">{teamKPI.assignedTo[0]}</span>
                                        </div>
                                        <span className="text-xs text-gray-500 w-28">Oct 01 - Dec 31 2025</span>
                                        <div className="flex items-center space-x-2 w-24">
                                          <span className="text-sm font-medium text-gray-900">{teamKPI.progressPercentage.toFixed(2)}%</span>
                                          <div className="w-12 bg-gray-200 rounded-full h-1.5">
                                            <div 
                                              className={`h-1.5 rounded-full ${teamKPI.progressPercentage >= 50 ? 'bg-blue-500' : 'bg-red-500'}`}
                                              style={{ width: `${Math.min(teamKPI.progressPercentage, 100)}%` }}
                                            />
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                    
                                    {/* Individual Level - Cá nhân */}
                                    {isTeamExpanded && indKPIs.map((indKPI) => (
                                      <div key={indKPI.id} className="flex items-center p-3 pl-16 hover:bg-gray-50 border-t border-gray-100">
                                        <div className="flex items-center flex-1">
                                          <div className="w-6" />
                                          <div className="flex items-center space-x-2">
                                            <CheckCircle className="w-4 h-4 text-green-500" />
                                            <span 
                                              className="text-sm text-blue-600 hover:underline cursor-pointer"
                                              onClick={(e) => {
                                                e.stopPropagation()
                                                setSelectedKPIForDetail(indKPI)
                                              }}
                                            >
                                              {indKPI.assignedTo[0]} » {indKPI.name}: {indKPI.targetValue} ({indKPI.unit})
                                            </span>
                                          </div>
                                        </div>
                                        <div className="flex items-center space-x-4">
                                          <div className="flex items-center space-x-2">
                                            <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center overflow-hidden">
                                              <span className="text-xs font-medium text-orange-600">{indKPI.assignedTo[0]?.charAt(0)}</span>
                                            </div>
                                            <span className="text-sm text-gray-600">{indKPI.assignedTo[0]}</span>
                                          </div>
                                          <span className="text-xs text-gray-500 w-28">Oct 01 - Dec 31 2025</span>
                                          <div className="flex items-center space-x-2 w-24">
                                            <span className="text-sm font-medium text-gray-900">{indKPI.progressPercentage.toFixed(2)}%</span>
                                            <div className="w-12 bg-gray-200 rounded-full h-1.5">
                                              <div 
                                                className={`h-1.5 rounded-full ${indKPI.progressPercentage >= 50 ? 'bg-blue-500' : 'bg-red-500'}`}
                                                style={{ width: `${Math.min(indKPI.progressPercentage, 100)}%` }}
                                              />
                                            </div>
                                          </div>
                                          <div className="relative group">
                                            <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded cursor-pointer">
                                              {indKPI.currentValue}/{indKPI.targetValue} ({indKPI.unit})
                                            </span>
                                            <div className="hidden group-hover:block absolute right-0 top-6 z-10 bg-white border shadow-lg rounded-lg p-2 text-xs whitespace-nowrap">
                                              {indKPI.currentValue}/{indKPI.targetValue} ({indKPI.unit})<br/>
                                              {indKPI.progressPercentage.toFixed(2)}%
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                )
                              })}
                            </div>
                          )
                        })
                      })()}
                    </div>
                  ) : (
                    /* Task Table for Individual KPI */
                    <div className="border rounded-lg overflow-hidden">
                      {/* Header with Create Task button */}
                      <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-orange-50 to-orange-100">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                            <CheckSquare className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <span className="text-sm font-semibold text-gray-900">Danh sách công việc</span>
                            <span className="text-xs text-gray-500 ml-2">({kpiTasks.length} công việc)</span>
                          </div>
                        </div>
                        <button className="flex items-center space-x-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 text-sm font-medium shadow-sm">
                          <Plus className="w-4 h-4" />
                          <span>Tạo công việc</span>
                        </button>
                      </div>
                      
                      {/* Task Table */}
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              {/* <th className="w-8 px-3 py-3">
                                <input type="checkbox" className="rounded border-gray-300" />
                              </th> */}
                              <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">Công việc</th>
                              <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">Phân loại</th>
                              <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">Liên quan</th>
                              <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">Người phụ trách</th>
                              <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">Thời hạn</th>
                              <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">Ưu tiên</th>
                              <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">Trạng thái</th>
                              <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">Tags</th>
                              <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">Ngày tạo</th>
                              <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">Thao tác</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {kpiTasks.map((task) => {
                              const isOverdue = new Date(task.dueDate) < new Date() && task.status !== 'completed'
                              return (
                                <tr key={task.id} className={`hover:bg-gray-50 ${isOverdue ? 'bg-red-50' : ''}`}>
                                  {/* <td className="px-3 py-3">
                                    <input type="checkbox" className="rounded border-gray-300" />
                                  </td> */}
                                  <td className="px-4 py-3">
                                    <div>
                                      <div className="text-sm font-medium text-blue-600">{task.title}</div>
                                      <div className="text-xs text-gray-500">{task.description}</div>
                                    </div>
                                  </td>
                                  <td className="px-4 py-3">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                      task.relatedType === 'lead' ? 'bg-blue-100 text-blue-800' :
                                      task.relatedType === 'customer' ? 'bg-green-100 text-green-800' :
                                      task.relatedType === 'order' ? 'bg-yellow-100 text-yellow-800' :
                                      'bg-gray-100 text-gray-800'
                                    }`}>
                                      {task.relatedType === 'lead' ? 'Lead' :
                                       task.relatedType === 'customer' ? 'Khách hàng' :
                                       task.relatedType === 'order' ? 'Công việc chung' : 'Chung'}
                                    </span>
                                  </td>
                                  <td className="px-4 py-3">
                                    <div className="text-sm text-gray-900">{task.relatedName}</div>
                                    <div className="text-xs text-gray-500">{task.relatedType === 'lead' ? 'Lead' : task.relatedType === 'customer' ? 'Khách hàng' : task.relatedType}</div>
                                    {task.relatedInfo && <div className="text-xs text-gray-400">{task.relatedInfo}</div>}
                                  </td>
                                  <td className="px-4 py-3">
                                    <div className="text-sm text-gray-900">{task.assignedTo}</div>
                                    <div className="text-xs text-gray-500">{task.assignedTeam}</div>
                                  </td>
                                  <td className="px-4 py-3">
                                    <div className={`text-sm ${isOverdue ? 'text-red-600 font-medium' : 'text-gray-900'}`}>
                                      {new Date(task.dueDate).toLocaleDateString('vi-VN')}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                      {new Date(task.dueDate).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                    {isOverdue && (
                                      <div className="flex items-center text-xs text-red-500 mt-0.5">
                                        <AlertCircle className="w-3 h-3 mr-1" />
                                        Quá hạn
                                      </div>
                                    )}
                                  </td>
                                  <td className="px-4 py-3">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                      task.priority === 'high' ? 'bg-red-100 text-red-800' :
                                      task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                      'bg-green-100 text-green-800'
                                    }`}>
                                      {task.priority === 'high' ? 'Cao' : task.priority === 'medium' ? 'Trung bình' : 'Thấp'}
                                    </span>
                                  </td>
                                  <td className="px-4 py-3">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                      task.status === 'completed' ? 'bg-green-100 text-green-800' :
                                      task.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                                      'bg-yellow-100 text-yellow-800'
                                    }`}>
                                      {task.status === 'completed' ? 'Hoàn thành' : task.status === 'in_progress' ? 'Đang làm' : 'Chưa làm'}
                                    </span>
                                  </td>
                                  <td className="px-4 py-3">
                                    <div className="flex flex-wrap gap-1">
                                      {task.tags.map((tag, idx) => (
                                        <span key={idx} className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                                          tag === 'VIP' || tag === 'Khẩn cấp' ? 'bg-red-100 text-red-700' :
                                          tag === 'Hot' ? 'bg-orange-100 text-orange-700' :
                                          'bg-gray-100 text-gray-700'
                                        }`}>
                                          {tag}
                                        </span>
                                      ))}
                                    </div>
                                  </td>
                                  <td className="px-4 py-3">
                                    <div className="text-sm text-gray-900">
                                      {new Date(task.createdAt).toLocaleDateString('vi-VN')}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                      {new Date(task.createdAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                    <div className="text-xs text-gray-400">Bởi: {task.createdBy}</div>
                                  </td>
                                  <td className="px-4 py-3 relative">
                                    <button 
                                      onClick={() => setOpenTaskDropdownId(openTaskDropdownId === task.id ? null : task.id)}
                                      className="p-2 hover:bg-gray-100 rounded-lg"
                                    >
                                      <Settings className="w-4 h-4 text-gray-500" />
                                    </button>
                                    
                                    {/* Action Dropdown */}
                                    {openTaskDropdownId === task.id && (
                                      <>
                                        <div 
                                          className="fixed inset-0 z-[999]" 
                                          onClick={() => setOpenTaskDropdownId(null)}
                                        />
                                        <div className="absolute right-0 top-full mt-1 w-56 bg-white rounded-xl shadow-xl border border-gray-200 z-[1000] py-2 text-left">
                                          {/* Thông tin Section */}
                                          <div className="px-3 py-1.5">
                                            <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Thông tin</span>
                                          </div>
                                          <button 
                                            className="w-full flex items-center space-x-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                                            onClick={() => {
                                              setSelectedTask(task)
                                              setShowTaskDetailModal(true)
                                              setOpenTaskDropdownId(null)
                                            }}
                                          >
                                            <Eye className="w-4 h-4 text-gray-400" />
                                            <span>Xem chi tiết</span>
                                          </button>
                                          <button 
                                            className="w-full flex items-center space-x-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                                            onClick={() => {
                                              setSelectedTask(task)
                                              setShowTaskEditModal(true)
                                              setOpenTaskDropdownId(null)
                                            }}
                                          >
                                            <Edit className="w-4 h-4 text-gray-400" />
                                            <span>Chỉnh sửa</span>
                                          </button>
                                          
                                          {/* Thao tác nguy hiểm Section */}
                                          <div className="border-t border-gray-100 mt-1 pt-1">
                                            <div className="px-3 py-1.5">
                                              <span className="text-[11px] font-semibold text-red-400 uppercase tracking-wider">Thao tác nguy hiểm</span>
                                            </div>
                                            <button 
                                              className="w-full flex items-center space-x-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50"
                                              onClick={() => {
                                                if (confirm('Bạn có chắc chắn muốn xóa công việc này?')) {
                                                  setKpiTasks(kpiTasks.filter(t => t.id !== task.id))
                                                }
                                                setOpenTaskDropdownId(null)
                                              }}
                                            >
                                              <Trash2 className="w-4 h-4" />
                                              <span>Xóa công việc</span>
                                            </button>
                                          </div>
                                        </div>
                                      </>
                                    )}
                                  </td>
                                </tr>
                              )
                            })}
                          </tbody>
                        </table>
                      </div>
                      
                      {kpiTasks.length === 0 && (
                        <div className="p-8 text-center text-gray-500">
                          <Target className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                          <p>Chưa có công việc nào</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Tabs: Bình luận / File đính kèm */}
              <div className="border-b mb-4">
                <div className="flex space-x-6">
                  <button
                    onClick={() => setDetailModalTab('comment')}
                    className={`py-2 text-sm font-medium border-b-2 transition-colors ${
                      detailModalTab === 'comment'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    Bình luận
                  </button>
                  <button
                    onClick={() => setDetailModalTab('attachment')}
                    className={`py-2 text-sm font-medium border-b-2 transition-colors ${
                      detailModalTab === 'attachment'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    File đính kèm
                  </button>
                </div>
              </div>

              {/* Tab Content */}
              {detailModalTab === 'comment' ? (
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900">Bình luận</h3>
                  
                  {/* Comments List with Replies */}
                  {kpiComments.map((comment) => (
                    <div key={comment.id} className="space-y-3">
                      {/* Main Comment */}
                      <div className="flex space-x-3">
                        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0">
                          <span className="text-white font-medium text-sm">{comment.authorName.split(' ').pop()?.charAt(0)}</span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <span className="font-medium text-blue-600">{comment.authorName}</span>
                            <span className="text-gray-800">{comment.content}</span>
                          </div>
                          <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500">
                            <button className="flex items-center space-x-1 hover:text-blue-600">
                              <span>👍</span>
                              <span>Thích</span>
                            </button>
                            <span>·</span>
                            <button 
                              className="hover:text-blue-600"
                              onClick={() => setReplyingToCommentId(replyingToCommentId === comment.id ? null : comment.id)}
                            >
                              Trả lời {comment.replies && comment.replies.length > 0 ? `(${comment.replies.length})` : ''}
                            </button>
                            <span>·</span>
                            <span>{comment.timestamp}</span>
                          </div>
                          
                          {/* Replies */}
                          {comment.replies && comment.replies.length > 0 && (
                            <div className="mt-3 space-y-3 pl-2 border-l-2 border-gray-100">
                              {comment.replies.map((reply) => (
                                <div key={reply.id} className="flex space-x-3">
                                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0">
                                    <span className="text-white font-medium text-xs">{reply.authorName.split(' ').pop()?.charAt(0)}</span>
                                  </div>
                                  <div className="flex-1">
                                    <div className="flex items-start space-x-2">
                                      <span className="font-medium text-blue-600">{reply.authorName}</span>
                                      <span className="text-gray-800">{reply.content}</span>
                                    </div>
                                    {/* File attachment in reply */}
                                    {reply.attachments && reply.attachments.length > 0 && (
                                      <div className="mt-2">
                                        {reply.attachments.map((file, idx) => (
                                          <div key={idx} className="inline-flex items-center space-x-2 px-3 py-2 bg-gray-100 rounded-lg">
                                            <div className="w-8 h-8 bg-green-100 rounded flex items-center justify-center">
                                              <FileText className="w-4 h-4 text-green-600" />
                                            </div>
                                            <span className="text-sm text-gray-700">{file.name}</span>
                                            <button className="text-gray-400 hover:text-blue-600">
                                              <Download className="w-4 h-4" />
                                            </button>
                                          </div>
                                        ))}
                                      </div>
                                    )}
                                    <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500">
                                      <button className="flex items-center space-x-1 hover:text-blue-600">
                                        <span>👍</span>
                                        <span>Thích</span>
                                      </button>
                                      <span>·</span>
                                      <span>{reply.timestamp}</span>
                                    </div>
                                  </div>
                                  <button className="text-gray-400 hover:text-gray-600">
                                    <MoreVertical className="w-4 h-4" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                          
                          {/* Reply Input for this comment */}
                          {replyingToCommentId === comment.id && (
                            <div className="mt-3 flex items-center space-x-2 bg-gray-50 rounded-lg p-2">
                              <input
                                type="text"
                                placeholder="Trả lời bình luận này"
                                value={newReplyText}
                                onChange={(e) => setNewReplyText(e.target.value)}
                                className="flex-1 px-3 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                              />
                              <button className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100" title="Đính kèm file">
                                <Paperclip className="w-4 h-4" />
                              </button>
                              <button 
                        className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100" 
                        title="Mention @"
                        onClick={() => {
                          setNewCommentText(prev => prev + '@')
                          setShowMentionDropdown(true)
                          setMentionSearch('')
                        }}
                      >
                        <span className="text-sm font-bold">@</span>
                      </button>
                              <button className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100" title="Emoji">
                                <span>😊</span>
                              </button>
                              <button className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                                <Send className="w-4 h-4" />
                              </button>
                            </div>
                          )}
                        </div>
                        <button className="text-gray-400 hover:text-gray-600 flex-shrink-0">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                  
                  {/* Add new comment input - Always visible at bottom */}
                  <div className="pt-4 border-t bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center space-x-2 relative">
                      <div className="flex-1 relative">
                        <input
                          type="text"
                          placeholder="Viết bình luận của bạn (gõ @ để mention)"
                          value={newCommentText}
                          onChange={(e) => {
                            setNewCommentText(e.target.value)
                            // Check if user is typing @mention
                            const lastWord = e.target.value.split(' ').pop() || ''
                            if (lastWord.startsWith('@')) {
                              setShowMentionDropdown(true)
                              setMentionSearch(lastWord.slice(1))
                            } else {
                              setShowMentionDropdown(false)
                            }
                          }}
                          className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                        />
                        
                        {/* @Mention Dropdown */}
                        {showMentionDropdown && (
                          <div className="absolute bottom-full mb-2 left-0 w-64 bg-white border rounded-lg shadow-lg z-50 max-h-48 overflow-y-auto">
                            <div className="p-2 text-xs text-gray-500 border-b">Chọn người để mention</div>
                            {mentionableUsers
                              .filter(user => user.name.toLowerCase().includes(mentionSearch.toLowerCase()))
                              .map(user => (
                                <button
                                  key={user.id}
                                  className="w-full flex items-center space-x-2 px-3 py-2 hover:bg-blue-50 text-left"
                                  onClick={() => {
                                    // Replace @search with @username
                                    const words = newCommentText.split(' ')
                                    words[words.length - 1] = `@${user.name}`
                                    setNewCommentText(words.join(' ') + ' ')
                                    setShowMentionDropdown(false)
                                  }}
                                >
                                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-xs font-medium text-blue-700">
                                    {user.avatar}
                                  </div>
                                  <span className="text-sm text-gray-700">{user.name}</span>
                                </button>
                              ))}
                              {mentionableUsers.filter(user => user.name.toLowerCase().includes(mentionSearch.toLowerCase())).length === 0 && (
                                <div className="p-3 text-sm text-gray-500 text-center">Không tìm thấy người dùng</div>
                              )}
                          </div>
                        )}
                      </div>
                      
                      <button className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100" title="Đính kèm file">
                        <Paperclip className="w-4 h-4" />
                      </button>
                      <button 
                        className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100" 
                        title="Mention @"
                        onClick={() => {
                          setNewCommentText(prev => prev + '@')
                          setShowMentionDropdown(true)
                          setMentionSearch('')
                        }}
                      >
                        <span className="text-sm font-bold">@</span>
                      </button>
                      <div className="relative">
                        <button 
                          className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100" 
                          title="Emoji"
                          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                        >
                          <span>😊</span>
                        </button>
                        
                        {/* Emoji Picker Dropdown */}
                        {showEmojiPicker && (
                          <div className="absolute bottom-full mb-2 right-0 bg-white border rounded-lg shadow-lg z-50 p-3">
                            <div className="text-xs text-gray-500 mb-2">Chọn biểu tượng cảm xúc</div>
                            <div className="grid grid-cols-6 gap-1">
                              {commonEmojis.map((emoji, idx) => (
                                <button
                                  key={idx}
                                  className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded text-lg"
                                  onClick={() => {
                                    setNewCommentText(prev => prev + emoji)
                                    setShowEmojiPicker(false)
                                  }}
                                >
                                  {emoji}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                      <button className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                        <Send className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center space-x-2 px-3 py-2 bg-gray-50 rounded-lg border">
                      <FileText className="w-4 h-4 text-orange-600" />
                      <span className="text-sm text-gray-700">report_q4_2024.xlsx</span>
                      <button className="text-gray-400 hover:text-red-500">
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                    <div className="flex items-center space-x-2 px-3 py-2 bg-gray-50 rounded-lg border">
                      <FileText className="w-4 h-4 text-orange-600" />
                      <span className="text-sm text-gray-700">kpi_details.pdf</span>
                      <button className="text-gray-400 hover:text-red-500">
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                    <button className="flex items-center space-x-2 px-3 py-2 border border-dashed border-gray-300 rounded-lg text-gray-500 hover:text-orange-500 hover:border-orange-300">
                      <Plus className="w-4 h-4" />
                      <span className="text-sm">Thêm tệp</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Footer */}
              <div className="flex justify-end mt-6 pt-4 border-t">
                <button
                  onClick={() => {
                    setShowDetailModal(false)
                    setSelectedKPIForDetail(null)
                  }}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}