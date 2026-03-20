'use client'

import { useState, useRef, useEffect } from 'react'
import {
  TrendingUp,
  TrendingDown,
  ChevronDown,
  ChevronRight,
  Download,
  Info,
  Trophy,
  AlertTriangle,
  Users,
  DollarSign,
  Target,
  CheckCircle,
  Activity,
  Zap,
  UserCheck,
  Building2,
  User,
  UserPlus,
  CreditCard,
  X,
  Eye,
  Calendar,
  Clock,
  Tag,
  Phone,
  PenSquare,
  Bell,
  History,
  FileText,
  Search
} from 'lucide-react'

// ==================== TYPES ====================
interface OrgDepartment {
  id: string; name: string; teams: OrgTeam[]
}
interface OrgTeam {
  id: string; name: string; departmentId: string; employees: OrgEmployee[]
}
interface OrgEmployee {
  id: string; name: string; teamId: string; avatar: string
}
interface SummaryCard {
  label: string; value: number; format: 'currency' | 'number' | 'percent'
  change: { value: number; direction: 'up' | 'down' | 'neutral' }
  benchmark?: { label: string; value: number }
}
interface ComparisonRow {
  entityId: string; name: string; revenue: number; leadsAssigned: number
  ordersClosed: number; closeRate: number; kpiPct: number
}


// ==================== MOCK DATA ====================
const mockOrg: OrgDepartment = {
  id: 'dept_01', name: 'Phòng Sales',
  teams: [
    {
      id: 'team_01', name: 'Team A', departmentId: 'dept_01', employees: [
        { id: 'emp_01', name: 'Nguyễn Văn An', teamId: 'team_01', avatar: '👨‍💼' },
        { id: 'emp_02', name: 'Trần Thị Bình', teamId: 'team_01', avatar: '👩‍💼' },
        { id: 'emp_03', name: 'Lê Minh Chánh', teamId: 'team_01', avatar: '👨‍💼' },
      ]
    },
    {
      id: 'team_02', name: 'Team B', departmentId: 'dept_01', employees: [
        { id: 'emp_04', name: 'Phạm Thu Hà', teamId: 'team_02', avatar: '👩‍💼' },
        { id: 'emp_05', name: 'Hoàng Minh Tuấn', teamId: 'team_02', avatar: '👨‍💼' },
        { id: 'emp_06', name: 'Vũ Thị Mai', teamId: 'team_02', avatar: '👩‍💼' },
      ]
    },
    {
      id: 'team_03', name: 'Team C', departmentId: 'dept_01', employees: [
        { id: 'emp_07', name: 'Đặng Văn Hùng', teamId: 'team_03', avatar: '👨‍💼' },
        { id: 'emp_08', name: 'Ngô Thị Lan', teamId: 'team_03', avatar: '👩‍💼' },
        { id: 'emp_09', name: 'Bùi Quốc Đạt', teamId: 'team_03', avatar: '👨‍💼' },
      ]
    },
  ]
}

const deptSummary: SummaryCard[] = [
  { label: 'Doanh số', value: 1580000000, format: 'currency', change: { value: 8.2, direction: 'up' } },
  { label: 'Lead giao', value: 520, format: 'number', change: { value: 12.0, direction: 'up' } },
  { label: 'Tỷ lệ chốt', value: 38.0, format: 'percent', change: { value: -2.1, direction: 'down' } },
  { label: 'KPI TB phòng', value: 72.0, format: 'percent', change: { value: 5.0, direction: 'up' } },
  { label: 'Task hoàn thành', value: 85.0, format: 'percent', change: { value: 3.0, direction: 'up' } },
]

const deptComparison: ComparisonRow[] = [
  { entityId: 'team_01', name: 'Team A', revenue: 680000000, leadsAssigned: 280, ordersClosed: 118, closeRate: 42.1, kpiPct: 78.0 },
  { entityId: 'team_02', name: 'Team B', revenue: 520000000, leadsAssigned: 150, ordersClosed: 79, closeRate: 52.7, kpiPct: 72.0 },
  { entityId: 'team_03', name: 'Team C', revenue: 380000000, leadsAssigned: 90, ordersClosed: 58, closeRate: 64.4, kpiPct: 65.0 },
]

const teamSummaryData: Record<string, { summary: SummaryCard[]; comparison: ComparisonRow[]; topPerformer: string }> = {
  team_01: {
    summary: [
      { label: 'Doanh số', value: 680000000, format: 'currency', change: { value: 10.0, direction: 'up' } },
      { label: 'Lead giao', value: 280, format: 'number', change: { value: 8.0, direction: 'up' } },
      { label: 'Tỷ lệ chốt', value: 42.1, format: 'percent', change: { value: 3.5, direction: 'up' } },
      { label: 'KPI TB team', value: 78.0, format: 'percent', change: { value: 6.0, direction: 'up' } },
      { label: 'Task hoàn thành', value: 88.0, format: 'percent', change: { value: 2.0, direction: 'up' } },
    ],
    comparison: [
      { entityId: 'emp_01', name: 'Nguyễn Văn An', revenue: 250000000, leadsAssigned: 95, ordersClosed: 55, closeRate: 57.9, kpiPct: 92.0 },
      { entityId: 'emp_02', name: 'Trần Thị Bình', revenue: 230000000, leadsAssigned: 100, ordersClosed: 38, closeRate: 38.0, kpiPct: 71.0 },
      { entityId: 'emp_03', name: 'Lê Minh Chánh', revenue: 200000000, leadsAssigned: 85, ordersClosed: 25, closeRate: 29.4, kpiPct: 65.0 },
    ],
    topPerformer: 'Nguyễn Văn An',
  },
  team_02: {
    summary: [
      { label: 'Doanh số', value: 520000000, format: 'currency', change: { value: 5.0, direction: 'up' } },
      { label: 'Lead giao', value: 150, format: 'number', change: { value: 3.0, direction: 'up' } },
      { label: 'Tỷ lệ chốt', value: 52.7, format: 'percent', change: { value: 1.2, direction: 'up' } },
      { label: 'KPI TB team', value: 72.0, format: 'percent', change: { value: 4.0, direction: 'up' } },
      { label: 'Task hoàn thành', value: 82.0, format: 'percent', change: { value: -1.0, direction: 'down' } },
    ],
    comparison: [
      { entityId: 'emp_05', name: 'Hoàng Minh Tuấn', revenue: 220000000, leadsAssigned: 55, ordersClosed: 35, closeRate: 63.6, kpiPct: 85.0 },
      { entityId: 'emp_04', name: 'Phạm Thu Hà', revenue: 180000000, leadsAssigned: 50, ordersClosed: 25, closeRate: 50.0, kpiPct: 70.0 },
      { entityId: 'emp_06', name: 'Vũ Thị Mai', revenue: 120000000, leadsAssigned: 45, ordersClosed: 19, closeRate: 42.2, kpiPct: 61.0 },
    ],
    topPerformer: 'Hoàng Minh Tuấn',
  },
  team_03: {
    summary: [
      { label: 'Doanh số', value: 380000000, format: 'currency', change: { value: -2.0, direction: 'down' } },
      { label: 'Lead giao', value: 90, format: 'number', change: { value: 1.5, direction: 'up' } },
      { label: 'Tỷ lệ chốt', value: 64.4, format: 'percent', change: { value: 5.0, direction: 'up' } },
      { label: 'KPI TB team', value: 65.0, format: 'percent', change: { value: -3.0, direction: 'down' } },
      { label: 'Task hoàn thành', value: 79.0, format: 'percent', change: { value: 1.0, direction: 'up' } },
    ],
    comparison: [
      { entityId: 'emp_07', name: 'Đặng Văn Hùng', revenue: 160000000, leadsAssigned: 35, ordersClosed: 22, closeRate: 62.9, kpiPct: 75.0 },
      { entityId: 'emp_08', name: 'Ngô Thị Lan', revenue: 130000000, leadsAssigned: 30, ordersClosed: 20, closeRate: 66.7, kpiPct: 63.0 },
      { entityId: 'emp_09', name: 'Bùi Quốc Đạt', revenue: 90000000, leadsAssigned: 25, ordersClosed: 16, closeRate: 64.0, kpiPct: 55.0 },
    ],
    topPerformer: 'Đặng Văn Hùng',
  },
}

// Employee detail mock data
const getEmployeeDetail = (empId: string) => {
  const base: Record<string, any> = {
    emp_01: {
      summary: [
        { label: 'Doanh số', value: 250000000, format: 'currency', change: { value: 15, direction: 'up' }, benchmark: { label: 'TB team', value: 226000000 } },
        { label: 'Lead đang xử lý', value: 32, format: 'number', change: { value: 5, direction: 'up' } },
        { label: 'Tỷ lệ chốt', value: 58.0, format: 'percent', change: { value: 8.0, direction: 'up' }, benchmark: { label: 'TB team', value: 42.1 } },
        { label: 'KPI tiến độ', value: 92.0, format: 'percent', change: { value: 4.0, direction: 'up' }, benchmark: { label: 'TB team', value: 78.0 } },
        { label: 'Task hoàn thành', value: 80.0, format: 'percent', change: { value: 2.0, direction: 'up' } },
        { label: 'Khách hàng', value: 28, format: 'number', change: { value: 10.0, direction: 'up' } },
      ],
      revenue: {
        orders: [
          { id: 'ORD-001', customer: 'Công ty ABC', product: 'CRM Enterprise', value: 45000000, status: 'Đã thanh toán', date: '15/03/2026' },
          { id: 'ORD-002', customer: 'Nguyễn Văn X', product: 'CRM Professional', value: 28000000, status: 'Đã thanh toán', date: '12/03/2026' },
          { id: 'ORD-003', customer: 'Công ty XYZ', product: 'AI Analytics', value: 35000000, status: 'Đã thanh toán', date: '10/03/2026' },
          { id: 'ORD-004', customer: 'Trần Thị Y', product: 'CRM Basic', value: 15000000, status: 'Chờ thanh toán', date: '08/03/2026' },
          { id: 'ORD-005', customer: 'Công ty DEF', product: 'Consulting', value: 52000000, status: 'Đã thanh toán', date: '05/03/2026' },
        ],
        totalRevenue: 250000000, totalOrders: 55, avgOrderValue: 4545454, cancelledOrders: 3, cancelledPct: 5.5
      },
      performance: {
        leadsAssigned: 95, ordersClosed: 55, closeRate: 57.9, revenueClosed: 250000000,
        benchmark: { leadsAssigned: 93, ordersClosed: 39, closeRate: 42.1, revenueClosed: 226000000 }
      },
      pipeline: [
        { stage: 'Tiếp nhận', count: 15, conversionRate: 100, avgTime: 0, dropRate: 0 },
        { stage: 'Tư vấn', count: 12, conversionRate: 80, avgTime: 1.2, dropRate: 20 },
        { stage: 'Báo giá', count: 8, conversionRate: 66.7, avgTime: 2.5, dropRate: 33.3 },
        { stage: 'Chốt Deal', count: 5, conversionRate: 62.5, avgTime: 3.1, dropRate: 37.5 },
      ],
      leadSource: [
        { source: 'Facebook Ads', count: 18, closedCount: 7, conversionRate: 38.9, revenue: 50000000 },
        { source: 'Google Ads', count: 13, closedCount: 5, conversionRate: 38.5, revenue: 35000000 },
        { source: 'Zalo', count: 9, closedCount: 4, conversionRate: 44.4, revenue: 25000000 },
        { source: 'Website', count: 4, closedCount: 1, conversionRate: 25.0, revenue: 10000000 },
        { source: 'Giới thiệu', count: 2, closedCount: 1, conversionRate: 50.0, revenue: 5000000 },
      ],
      customers: {
        total: 28, businessCount: 18, individualCount: 10, newInPeriod: 8, avgOrderValue: 8928571,
        top10: [
          { name: 'Công ty ABC', type: 'DN', label: 'VIP', orders: 5, revenue: 125000000, lastOrder: '15/03/2026' },
          { name: 'Công ty DEF', type: 'DN', label: 'Tiềm năng', orders: 3, revenue: 85000000, lastOrder: '05/03/2026' },
          { name: 'Nguyễn Văn X', type: 'CN', label: 'Mới', orders: 2, revenue: 42000000, lastOrder: '12/03/2026' },
          { name: 'Công ty GHI', type: 'DN', label: 'Thường xuyên', orders: 4, revenue: 38000000, lastOrder: '01/03/2026' },
          { name: 'Trần Thị Y', type: 'CN', label: 'Mới', orders: 1, revenue: 15000000, lastOrder: '08/03/2026' },
        ],
      },
      tasksKpi: {
        tasks: [
          { name: 'Gọi follow-up Công ty ABC', relatedName: 'Thị Khánh Hòa Trần', relatedType: 'Khách hàng', relatedPhone: '968408946', loai: 'Khách hàng', status: 'Chưa làm', deadline: '18/03/2026', deadlineTime: '08:10', priority: 'Cao', tags: ['Chưa có nhận'], createdAt: '17/03/2026 11:33', overdueDays: 2 },
          { name: 'Gửi báo giá Công ty MNO', relatedName: 'Thị Thanh Nguyễn', relatedType: 'Khách hàng', relatedPhone: '342984868', loai: 'Khách hàng', status: 'Đang làm', deadline: '18/03/2026', deadlineTime: '08:10', priority: 'Cao', tags: ['Chưa có nhận'], createdAt: '17/03/2026 11:33', overdueDays: 2 },
          { name: 'Demo sản phẩm cho KH mới', relatedName: 'Nguyễn Quân Ăn Cướp Giật', relatedType: 'Khách hàng', relatedPhone: '832838832', loai: 'Khách hàng', status: 'Đang làm', deadline: '18/03/2026', deadlineTime: '08:10', priority: 'Cao', tags: ['Chưa có nhận'], createdAt: '17/03/2026 11:33', overdueDays: 2 },
          { name: 'Follow up đơn hàng', relatedName: 'Thị Ngọc Mai Nguyễn', relatedType: 'Khách hàng', relatedPhone: '377645186', loai: 'Khách hàng', status: 'Hoàn tất', deadline: '18/03/2026', deadlineTime: '00:00', priority: 'Cao', tags: ['Khách tiềm năng'], createdAt: '17/03/2026 11:15', overdueDays: 2 },
          { name: 'Meeting online với Công ty PQR', relatedName: 'Thị Hương Giang Trịnh', relatedType: 'Lead', relatedPhone: '904080011', loai: 'Lead', status: 'Hoàn tất', deadline: '17/03/2026', deadlineTime: '00:00', priority: 'Thấp', tags: ['Chưa có nhận'], createdAt: '17/03/2026 10:26', overdueDays: 3 },
          { name: 'Cập nhật CRM data', relatedName: 'Thị Thùy Dung Vũ', relatedType: 'Lead', relatedPhone: '945205487', loai: 'Lead', status: 'Đang làm', deadline: '17/03/2026', deadlineTime: '00:00', priority: 'Thấp', tags: ['Chưa có nhận'], createdAt: '17/03/2026 10:26', overdueDays: 3 },
        ],
        kpi: [
          { name: 'Doanh thu', current: 250000000, target: 300000000, pct: 83 },
          { name: 'Leads', current: 95, target: 100, pct: 95 },
          { name: 'Chuyển đổi', current: 58, target: 70, pct: 83 },
          { name: 'Công việc', current: 12, target: 15, pct: 80 },
        ]
      }
    }
  }
  // Return emp_01 data as default for all employees (with name changes)
  return base[empId] || base['emp_01']
}

// ==================== FORMAT HELPERS ====================
const fmtCurrency = (v: number) => {
  if (v >= 1e9) return `${(v / 1e9).toFixed(1)} tỷ`
  if (v >= 1e6) return `${Math.round(v / 1e6)} tr`
  return new Intl.NumberFormat('vi-VN').format(v)
}
const fmtCurrencyFull = (v: number) => new Intl.NumberFormat('vi-VN').format(v) + ' ₫'
const fmtValue = (v: number, f: string) => {
  if (f === 'currency') return fmtCurrency(v)
  if (f === 'percent') return `${v}%`
  return v.toLocaleString('vi-VN')
}

// ==================== COMPONENT ====================
export default function EmployeeReportTab() {
  const [level, setLevel] = useState<'department' | 'team' | 'employee'>('department')
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null)
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(null)
  const [timeRange, setTimeRange] = useState('this_month')
  const [showPerformanceDetail, setShowPerformanceDetail] = useState(false)
  const [showTaskDetail, setShowTaskDetail] = useState(false)
  const [selectedTask, setSelectedTask] = useState<any>(null)
  const [taskDetailTab, setTaskDetailTab] = useState<'overview' | 'reminders' | 'history'>('overview')
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(['revenue', 'performance', 'pipeline', 'leadSource', 'customers'])
  )
  const [sortCol, setSortCol] = useState<string>('kpiPct')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')
  const [employeeSearch, setEmployeeSearch] = useState('')
  const [showEmpDropdown, setShowEmpDropdown] = useState(false)
  const empDropdownRef = useRef<HTMLDivElement>(null)

  // Close employee dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (empDropdownRef.current && !empDropdownRef.current.contains(e.target as Node)) {
        setShowEmpDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Navigation handlers — filter dropdowns directly control navigation
  const handleTeamSelect = (teamId: string) => {
    if (teamId) {
      setSelectedTeamId(teamId)
      setSelectedEmployeeId(null)
      setLevel('team')
    } else {
      setSelectedTeamId(null)
      setSelectedEmployeeId(null)
      setLevel('department')
    }
  }

  const handleEmployeeSelect = (empId: string) => {
    if (empId) {
      setSelectedEmployeeId(empId)
      setLevel('employee')
    } else {
      setSelectedEmployeeId(null)
      setLevel('team')
    }
  }

  // Drill-down from table rows
  const drillDown = (entityId: string, _name: string, targetLevel: 'team' | 'employee') => {
    if (targetLevel === 'team') {
      setSelectedTeamId(entityId)
      setSelectedEmployeeId(null)
      setLevel('team')
    } else {
      setSelectedEmployeeId(entityId)
      setLevel('employee')
    }
  }

  const toggleSection = (key: string) => {
    setExpandedSections(prev => {
      const next = new Set(prev)
      next.has(key) ? next.delete(key) : next.add(key)
      return next
    })
  }

  const sortData = (data: ComparisonRow[]) => {
    return [...data].sort((a, b) => {
      const aVal = a[sortCol as keyof ComparisonRow] as number
      const bVal = b[sortCol as keyof ComparisonRow] as number
      return sortDir === 'desc' ? bVal - aVal : aVal - bVal
    })
  }

  const handleSort = (col: string) => {
    if (sortCol === col) setSortDir(d => d === 'desc' ? 'asc' : 'desc')
    else { setSortCol(col); setSortDir('desc') }
  }

  const getBenchmarkBadge = (value: number, benchmark?: { value: number }) => {
    if (!benchmark) return null
    const diff = Math.abs(value - benchmark.value) / benchmark.value
    if (diff <= 0.05) return <span className="inline-block w-2.5 h-2.5 rounded-full bg-yellow-400 ml-1.5" title="Bằng TB" />
    if (value > benchmark.value * 1.05) return <span className="inline-block w-2.5 h-2.5 rounded-full bg-green-500 ml-1.5" title="Trên TB" />
    return <span className="inline-block w-2.5 h-2.5 rounded-full bg-red-400 ml-1.5" title="Dưới TB" />
  }

  const cardGradients = [
    'from-green-600 to-green-400', 'from-blue-600 to-blue-400', 'from-purple-600 to-purple-400',
    'from-orange-600 to-orange-400', 'from-teal-600 to-teal-400', 'from-pink-600 to-pink-400'
  ]

  const getTaskStatusBadge = (status: string) => {
    const map: Record<string, string> = {
      'Chưa làm': 'bg-gray-100 text-gray-700', 'Đang làm': 'bg-blue-100 text-blue-700',
      'Hoàn thành': 'bg-green-100 text-green-700', 'Quá hạn': 'bg-red-100 text-red-700',
    }
    return map[status] || 'bg-gray-100 text-gray-700'
  }

  const getKpiBarColor = (pct: number) => {
    if (pct >= 90) return 'bg-green-500'
    if (pct >= 70) return 'bg-blue-500'
    if (pct >= 50) return 'bg-orange-500'
    return 'bg-red-500'
  }

  // Get current data based on level
  const currentSummary = level === 'department' ? deptSummary
    : level === 'team' && selectedTeamId ? teamSummaryData[selectedTeamId]?.summary || []
      : selectedEmployeeId ? getEmployeeDetail(selectedEmployeeId)?.summary || []
        : []

  const currentComparison = level === 'department' ? deptComparison
    : level === 'team' && selectedTeamId ? teamSummaryData[selectedTeamId]?.comparison || []
      : []

  const empDetail = level === 'employee' && selectedEmployeeId ? getEmployeeDetail(selectedEmployeeId) : null

  return (
    <div className="space-y-6">
      {/* Header with Filter Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Báo cáo nhân viên</h2>
          <p className="text-gray-600">Phân tích các chỉ số của nhân viên</p>
        </div>

        <div className="flex items-center space-x-3">
          <select
            value={timeRange} onChange={e => setTimeRange(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 text-sm bg-white"
          >
            <option value="today">Hôm nay</option>
            <option value="yesterday">Hôm qua</option>
            <option value="this_week">Tuần này</option>
            <option value="this_month">Tháng này</option>
            <option value="this_quarter">Quý này</option>
            <option value="custom">Chọn thời gian</option>
          </select>
          <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
            <option>Phòng Sales</option>
          </select>
          <select
            value={selectedTeamId || ''}
            onChange={e => handleTeamSelect(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Tất cả Team</option>
            {mockOrg.teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
          </select>
          {selectedTeamId && (() => {
            const currentTeam = mockOrg.teams.find(t => t.id === selectedTeamId)
            const employees = currentTeam?.employees || []
            const filteredEmps = employeeSearch
              ? employees.filter(e => e.name.toLowerCase().includes(employeeSearch.toLowerCase()))
              : employees
            const selectedEmpObj = employees.find(e => e.id === selectedEmployeeId)
            const empColors = ['red', 'green', 'blue', 'orange', 'purple', 'teal', 'pink', 'indigo']
            const getEmpColor = (idx: number) => {
              const colors: Record<string, string> = {
                red: 'bg-red-100 text-red-700',
                green: 'bg-green-100 text-green-700',
                blue: 'bg-blue-100 text-blue-700',
                orange: 'bg-orange-100 text-orange-700',
                purple: 'bg-purple-100 text-purple-700',
                teal: 'bg-teal-100 text-teal-700',
                pink: 'bg-pink-100 text-pink-700',
                indigo: 'bg-indigo-100 text-indigo-700',
              }
              return colors[empColors[idx % empColors.length]]
            }
            const getInitials = (name: string) => {
              const parts = name.split(' ')
              return parts.length >= 2 ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase() : name.substring(0, 2).toUpperCase()
            }

            return (
              <div className="relative" ref={empDropdownRef}>
                <button
                  onClick={() => setShowEmpDropdown(!showEmpDropdown)}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 flex items-center space-x-2 min-w-[170px] hover:border-blue-400 transition-colors"
                >
                  {selectedEmpObj ? (
                    <>
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${getEmpColor(employees.indexOf(selectedEmpObj))}`}>
                        {getInitials(selectedEmpObj.name)}
                      </span>
                      <span className="truncate max-w-[100px]">{selectedEmpObj.name}</span>
                      <button
                        onClick={(ev) => { ev.stopPropagation(); handleEmployeeSelect(''); setEmployeeSearch('') }}
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

                {showEmpDropdown && (
                  <div className="absolute top-full left-0 mt-1 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50 overflow-hidden">
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
                    <div className="max-h-48 overflow-y-auto py-1">
                      {filteredEmps.length > 0 ? (
                        filteredEmps.map((emp, idx) => (
                          <button
                            key={emp.id}
                            onClick={() => {
                              handleEmployeeSelect(emp.id)
                              setShowEmpDropdown(false)
                              setEmployeeSearch('')
                            }}
                            className={`w-full flex items-center space-x-3 px-3 py-2 text-sm hover:bg-gray-50 transition-colors ${selectedEmployeeId === emp.id ? 'bg-blue-50' : ''}`}
                          >
                            <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${getEmpColor(employees.indexOf(emp))}`}>
                              {getInitials(emp.name)}
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
            )
          })()}
          <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all duration-300 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 rounded-[10px] h-10 px-4 py-[8.5px] bg-green-600 hover:bg-green-700 text-white">
            <Download className="w-4 h-4 mr-2" />
            Xuất Excel
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className={`grid gap-4 ${level === 'employee' ? 'grid-cols-2 lg:grid-cols-3 xl:grid-cols-6' : 'grid-cols-2 lg:grid-cols-5'}`}>
        {currentSummary.map((card: SummaryCard, idx: number) => (
          <div key={idx} className={`relative rounded-xl px-5 py-4 text-white shadow-lg bg-gradient-to-br ${cardGradients[idx % cardGradients.length]} transition-all hover:shadow-xl hover:scale-[1.02]`}>
            <div className="absolute top-2 right-2">
              <Info className="w-3.5 h-3.5 text-white/60 hover:text-white cursor-help" />
            </div>
            <p className="text-sm font-medium text-white/90 mb-1">{card.label}</p>
            <p className="text-2xl font-extrabold mb-1">
              {fmtValue(card.value, card.format)}
              {card.benchmark && getBenchmarkBadge(card.value, card.benchmark)}
            </p>
            <div className="flex items-center text-xs text-white/85">
              {card.change.direction === 'up' ? <TrendingUp className="w-3.5 h-3.5 mr-1" /> : card.change.direction === 'down' ? <TrendingDown className="w-3.5 h-3.5 mr-1" /> : null}
              <span>{card.change.direction === 'up' ? '+' : card.change.direction === 'down' ? '' : ''}{card.change.value}%</span>
            </div>
            {card.benchmark && (
              <p className="text-xs text-white/70 mt-1">{card.benchmark.label}: {fmtValue(card.benchmark.value, card.format)}</p>
            )}
          </div>
        ))}
      </div>

      {/* Top Performer Highlight (Team level only) */}
      {level === 'team' && selectedTeamId && teamSummaryData[selectedTeamId] && (
        <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-200 rounded-xl">
          <Trophy className="w-6 h-6 text-yellow-600" />
          <span className="text-sm font-semibold text-yellow-800">
            Top performer: {teamSummaryData[selectedTeamId].topPerformer} — Tỷ lệ chốt {teamSummaryData[selectedTeamId].comparison[0]?.closeRate}%, KPI {teamSummaryData[selectedTeamId].comparison[0]?.kpiPct}%
          </span>
        </div>
      )}

      {/* Comparison Table (Department & Team level) */}
      {(level === 'department' || level === 'team') && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h3 className="text-lg font-bold text-gray-900">
              {level === 'department' ? 'So sánh Team' : 'So sánh Nhân viên'}
            </h3>
            <p className="text-sm text-gray-500">Sắp xếp theo {sortCol === 'kpiPct' ? 'KPI %' : sortCol} {sortDir === 'desc' ? '↓' : '↑'}</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  {level === 'team' && <th className="px-4 py-3 text-left font-semibold text-gray-600">Rank</th>}
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">{level === 'department' ? 'Tên Team' : 'Tên NV'}</th>
                  {[
                    { key: 'revenue', label: 'Doanh số' }, { key: 'leadsAssigned', label: 'Lead giao' },
                    { key: 'ordersClosed', label: 'Đơn chốt' }, { key: 'closeRate', label: 'Tỷ lệ chốt' },
                    { key: 'kpiPct', label: 'KPI %' },
                  ].map(col => (
                    <th key={col.key} className="px-4 py-3 text-right font-semibold text-gray-600 cursor-pointer hover:text-blue-600 select-none" onClick={() => handleSort(col.key)}>
                      {col.label} {sortCol === col.key && (sortDir === 'desc' ? '↓' : '↑')}
                    </th>
                  ))}
                  <th className="px-4 py-3 text-center font-semibold text-gray-600">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {sortData(currentComparison).map((row, idx) => {
                  const isFirst = idx === 0 && level === 'team'
                  const isLast = idx === currentComparison.length - 1 && level === 'team' && currentComparison.length > 1
                  return (
                    <tr key={row.entityId} className={`hover:bg-gray-50 transition-colors ${isFirst ? 'bg-green-50/60' : isLast ? 'bg-red-50/60' : ''}`}>
                      {level === 'team' && <td className="px-4 py-3 font-bold text-gray-500">#{idx + 1}</td>}
                      <td className="px-4 py-3 font-semibold text-gray-900">{row.name}</td>
                      <td className="px-4 py-3 text-right font-medium text-blue-600">{fmtCurrency(row.revenue)}</td>
                      <td className="px-4 py-3 text-right">{row.leadsAssigned}</td>
                      <td className="px-4 py-3 text-right">{row.ordersClosed}</td>
                      <td className="px-4 py-3 text-right">{row.closeRate}%</td>
                      <td className="px-4 py-3 text-right font-bold">{row.kpiPct}%</td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => drillDown(row.entityId, row.name, level === 'department' ? 'team' : 'employee')}
                          className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                        >
                          Xem ▸
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Employee Detail Sections */}
      {level === 'employee' && empDetail && (
        <div className="space-y-4">
          {/* Section 1: Doanh số */}
          <DetailSection title="Doanh số" icon={<DollarSign className="w-5 h-5" />} sectionKey="revenue" expanded={expandedSections.has('revenue')} onToggle={toggleSection}>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              {[
                { label: 'Tổng doanh số', value: fmtCurrencyFull(empDetail.revenue.totalRevenue) },
                { label: 'Số đơn bán', value: empDetail.revenue.totalOrders },
                { label: 'Tỷ lệ chuyển đổi TB', value: fmtCurrencyFull(empDetail.revenue.avgOrderValue) },
                { label: 'Tỷ lệ thanh toán', value: `${empDetail.revenue.cancelledOrders} (${empDetail.revenue.cancelledPct}%)` },
              ].map((m, i) => (
                <div key={i} className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500 mb-1">{m.label}</p>
                  <p className="text-xl font-bold text-gray-900">{m.value}</p>
                </div>
              ))}
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50"><tr>
                  {['Mã đơn', 'Khách hàng', 'Sản phẩm', 'Giá trị', 'Trạng thái', 'Ngày tạo'].map(h => (
                    <th key={h} className="px-3 py-2 text-left font-semibold text-gray-600">{h}</th>
                  ))}
                </tr></thead>
                <tbody className="divide-y divide-gray-100">
                  {empDetail.revenue.orders.map((o: any) => (
                    <tr key={o.id} className="hover:bg-gray-50">
                      <td className="px-3 py-2 font-mono text-blue-600">{o.id}</td>
                      <td className="px-3 py-2">{o.customer}</td>
                      <td className="px-3 py-2">{o.product}</td>
                      <td className="px-3 py-2 font-medium">{fmtCurrencyFull(o.value)}</td>
                      <td className="px-3 py-2">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${o.status === 'Đã thanh toán' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                          {o.status}
                        </span>
                      </td>
                      <td className="px-3 py-2 text-gray-500">{o.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </DetailSection>

          {/* Section 2: Hiệu suất */}
          <DetailSection title="Hiệu suất" icon={<Activity className="w-5 h-5" />} sectionKey="performance" expanded={expandedSections.has('performance')} onToggle={toggleSection}>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              {[
                { label: 'Tổng Lead được giao', val: empDetail.performance.leadsAssigned },
                { label: 'Tổng đơn chốt', val: empDetail.performance.ordersClosed },
                { label: 'Tỷ lệ chốt TB', val: `${empDetail.performance.closeRate}%` },
                { label: 'Tổng doanh số', val: fmtCurrency(empDetail.performance.revenueClosed) },
              ].map((m, i) => (
                <div key={i} className="bg-gray-50 rounded-lg p-4">
                  <p className="text-xs text-gray-500 mb-1">{m.label}</p>
                  <p className="text-xl font-bold text-gray-900">{m.val}</p>
                </div>
              ))}
            </div>
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b-2 border-gray-200"><tr>
                {['STT', 'NGUỒN', 'LEAD ĐƯỢC GIAO', 'ĐƠN CHỐT', 'TỶ LỆ CHỐT', 'DOANH SỐ'].map(h => (
                  <th key={h} className="px-4 py-3 text-left font-bold text-gray-700 uppercase text-xs tracking-wider">{h}</th>
                ))}
              </tr></thead>
              <tbody className="divide-y divide-gray-100">
                {empDetail.leadSource.map((s: any, i: number) => (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-600">{i + 1}</td>
                    <td className="px-4 py-3 font-medium">{s.source}</td>
                    <td className="px-4 py-3 text-blue-600">{s.count}</td>
                    <td className="px-4 py-3">{s.closedCount}</td>
                    <td className="px-4 py-3">{s.conversionRate}%</td>
                    <td className="px-4 py-3 font-medium text-blue-600">{fmtCurrencyFull(s.revenue)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-gray-50 border-t-2 border-gray-300">
                  <td colSpan={4} className="px-4 py-3"></td>
                  <td className="px-4 py-3 font-bold text-gray-700 text-right">Tổng doanh số:</td>
                  <td className="px-4 py-3 font-bold text-blue-600">{fmtCurrencyFull(empDetail.leadSource.reduce((sum: number, s: any) => sum + s.revenue, 0))}</td>
                </tr>
              </tfoot>
            </table>
          </DetailSection>

          {/* Section 3: Quy trình */}
          <DetailSection title="Quy trình (Pipeline cá nhân)" icon={<Target className="w-5 h-5" />} sectionKey="pipeline" expanded={expandedSections.has('pipeline')} onToggle={toggleSection}>
            <div className="flex items-center justify-center gap-2 mb-4 flex-wrap">
              {empDetail.pipeline.map((s: any, i: number) => (
                <div key={i} className="flex items-center">
                  <div className={`px-4 py-2 rounded-lg text-center ${s.dropRate >= 35 ? 'bg-red-50 border-2 border-red-300' : 'bg-blue-50 border border-blue-200'}`}>
                    <p className="text-xs font-medium text-gray-600">{s.stage}</p>
                    <p className="text-lg font-bold text-gray-900">{s.count}</p>
                    {i > 0 && <p className="text-xs text-gray-500">{s.conversionRate}%</p>}
                  </div>
                  {i < empDetail.pipeline.length - 1 && <span className="text-gray-400 mx-1">→</span>}
                </div>
              ))}
            </div>
            <table className="w-full text-sm">
              <thead className="bg-gray-50"><tr>
                {['Giai đoạn', 'Số lead', 'Tỷ lệ chuyển đổi', 'Thời gian TB (ngày)', 'Tỷ lệ rớt'].map(h => (
                  <th key={h} className="px-3 py-2 text-left font-semibold text-gray-600">{h}</th>
                ))}
              </tr></thead>
              <tbody className="divide-y divide-gray-100">
                {empDetail.pipeline.map((s: any) => (
                  <tr key={s.stage} className={`${s.dropRate >= 35 ? 'bg-red-50/50' : 'hover:bg-gray-50'}`}>
                    <td className="px-3 py-2 font-medium">{s.stage} {s.dropRate >= 35 && <span className="text-red-500 text-xs ml-1">⚠ Điểm nghẽn</span>}</td>
                    <td className="px-3 py-2">{s.count}</td>
                    <td className="px-3 py-2">{s.conversionRate}%</td>
                    <td className="px-3 py-2">{s.avgTime}</td>
                    <td className="px-3 py-2">{s.dropRate}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </DetailSection>

          {/* Section 4: Nguồn Lead */}
          <DetailSection title="Nguồn Lead" icon={<Zap className="w-5 h-5" />} sectionKey="leadSource" expanded={expandedSections.has('leadSource')} onToggle={toggleSection}>
            <table className="w-full text-sm">
              <thead className="bg-gray-50"><tr>
                {['Nguồn', 'Số lead', 'Chất lượng', 'Tỷ lệ chuyển đổi', 'Doanh số đóng góp'].map(h => (
                  <th key={h} className="px-3 py-2 text-left font-semibold text-gray-600">{h}</th>
                ))}
              </tr></thead>
              <tbody className="divide-y divide-gray-100">
                {empDetail.leadSource.map((s: any, i: number) => {
                  const bestRate = Math.max(...empDetail.leadSource.map((x: any) => x.conversionRate))
                  return (
                    <tr key={i} className={`${s.conversionRate === bestRate ? 'bg-green-50/60' : 'hover:bg-gray-50'}`}>
                      <td className="px-3 py-2 font-medium">{s.source}</td>
                      <td className="px-3 py-2">{s.count}</td>
                      <td className="px-3 py-2">{s.closedCount} {s.conversionRate === bestRate && <span className="text-green-600 text-xs">★ Tốt nhất</span>}</td>
                      <td className="px-3 py-2">{s.conversionRate}%</td>
                      <td className="px-3 py-2 font-medium text-blue-600">{fmtCurrencyFull(s.revenue)}</td>
                    </tr>
                  )
                })}
              </tbody>
              <tfoot>
                <tr className="bg-gray-50 border-t-2 border-gray-300 font-semibold">
                  <td className="px-3 py-2"></td>
                  <td className="px-3 py-2"></td>
                  <td className="px-3 py-2"></td>
                  <td className="px-3 py-2 text-right">Tổng doanh số:</td>
                  <td className="px-3 py-2 font-bold text-blue-600">{fmtCurrencyFull(empDetail.leadSource.reduce((sum: number, s: any) => sum + s.revenue, 0))}</td>
                </tr>
              </tfoot>
            </table>
          </DetailSection>

          {/* Section 5: Khách hàng */}
          <DetailSection title="Khách hàng" icon={<Users className="w-5 h-5" />} sectionKey="customers" expanded={expandedSections.has('customers')} onToggle={toggleSection}>
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
              {[
                { label: 'Tổng khách hàng', value: empDetail.customers.total },
                { label: 'KH doanh nghiệp', value: empDetail.customers.businessCount },
                { label: 'KH cá nhân', value: empDetail.customers.individualCount },
                { label: 'Khách hàng mới', value: empDetail.customers.newInPeriod },
                { label: 'GTB / khách hàng', value: fmtCurrency(empDetail.customers.avgOrderValue) },
              ].map((m, i) => (
                <div key={i} className="bg-gray-50 rounded-xl p-4 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">{m.label}</p>
                    <p className="text-xl font-bold text-gray-900">{m.value}</p>
                  </div>
                </div>
              ))}
            </div>
            <table className="w-full text-sm">
              <thead className="bg-gray-50"><tr>
                {['Tên KH', 'Loại', 'Nhãn', 'Số đơn', 'Doanh số', 'Đơn gần nhất'].map(h => (
                  <th key={h} className="px-3 py-2 text-left font-semibold text-gray-600">{h}</th>
                ))}
              </tr></thead>
              <tbody className="divide-y divide-gray-100">
                {empDetail.customers.top10.map((c: any, i: number) => (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="px-3 py-2 font-medium">{c.name}</td>
                    <td className="px-3 py-2"><span className={`px-2 py-0.5 rounded-full text-xs ${c.type === 'DN' ? 'bg-purple-100 text-purple-700' : 'bg-sky-100 text-sky-700'}`}>{c.type === 'DN' ? 'Doanh nghiệp' : 'Cá nhân'}</span></td>
                    <td className="px-3 py-2"><span className="px-2 py-0.5 rounded-full text-xs bg-blue-100 text-blue-700">{c.label}</span></td>
                    <td className="px-3 py-2">{c.orders}</td>
                    <td className="px-3 py-2 font-medium text-blue-600">{fmtCurrencyFull(c.revenue)}</td>
                    <td className="px-3 py-2 text-gray-500">{c.lastOrder}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </DetailSection>

          {/* Section 6: Công việc & KPI (collapsed by default) */}
          <DetailSection title="Công việc & KPI" icon={<CheckCircle className="w-5 h-5" />} sectionKey="tasksKpi" expanded={expandedSections.has('tasksKpi')} onToggle={toggleSection}>
            <div className="grid grid-cols-2 lg:grid-cols-6 gap-4 mb-4">
              {[
                { label: 'Tổng công việc', value: empDetail.tasksKpi.tasks.length },
                { label: 'Chưa làm', value: empDetail.tasksKpi.tasks.filter((t: any) => t.status === 'Chưa làm').length },
                { label: 'Đang làm', value: empDetail.tasksKpi.tasks.filter((t: any) => t.status === 'Đang làm').length },
                { label: 'Hoàn tất', value: empDetail.tasksKpi.tasks.filter((t: any) => t.status === 'Hoàn tất').length },
                { label: 'Quá hạn', value: empDetail.tasksKpi.tasks.filter((t: any) => t.overdueDays > 0 && t.status !== 'Hoàn tất').length },
                { label: 'Cần ưu tiên', value: empDetail.tasksKpi.tasks.filter((t: any) => t.priority === 'Cao').length },
              ].map((m, i) => (
                <div key={i} className="bg-gray-50 rounded-xl p-4 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">{m.label}</p>
                    <p className="text-xl font-bold text-gray-900">{m.value}</p>
                  </div>
                </div>
              ))}
            </div>
            {/* <h4 className="font-semibold text-gray-800 mb-3">Danh sách Công việc</h4> */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm mb-6">
                <thead className="bg-gray-50"><tr>
                  {['Công việc', 'Liên quan', 'Thời hạn', 'Ưu tiên', 'Loại', 'Trạng thái', 'Tags', 'Ngày tạo'].map(h => (
                    <th key={h} className="px-3 py-2 text-left font-semibold text-gray-600 whitespace-nowrap">{h}</th>
                  ))}
                </tr></thead>
                <tbody className="divide-y divide-gray-100">
                  {empDetail.tasksKpi.tasks.map((t: any, i: number) => (
                    <tr key={i} className="hover:bg-gray-50">
                      <td className="px-3 py-2">
                        <button
                          onClick={() => { setSelectedTask(t); setShowTaskDetail(true) }}
                          className="text-blue-600 hover:text-blue-800 hover:underline font-medium text-left"
                        >
                          {t.name}
                        </button>
                      </td>
                      <td className="px-3 py-2">
                        <div className="font-medium text-gray-900 text-sm">{t.relatedName}</div>
                        <div className="text-xs text-gray-500">{t.relatedType}</div>
                        <div className="text-xs text-gray-400">{t.relatedPhone}</div>
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{t.deadline}</div>
                        <div className="text-xs text-gray-500">{t.deadlineTime}</div>
                        {t.overdueDays > 0 && t.status !== 'Hoàn tất' && (
                          <div className="flex items-center text-xs text-red-500 mt-0.5">
                            <Clock className="w-3 h-3 mr-0.5" />
                            Quá hạn {t.overdueDays} ngày
                          </div>
                        )}
                      </td>
                      <td className="px-3 py-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${t.priority === 'Cao' ? 'bg-red-100 text-red-700' :
                          t.priority === 'Trung bình' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-green-100 text-green-700'
                          }`}>{t.priority}</span>
                      </td>
                      <td className="px-3 py-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${t.loai === 'Khách hàng' ? 'bg-purple-100 text-purple-700' : 'bg-sky-100 text-sky-700'
                          }`}>{t.loai}</span>
                      </td>
                      <td className="px-3 py-2"><span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getTaskStatusBadge(t.status)}`}>{t.status}</span></td>
                      <td className="px-3 py-2">
                        <div className="flex flex-wrap gap-1">
                          {(t.tags || []).map((tag: string, ti: number) => (
                            <span key={ti} className="px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-600">{tag}</span>
                          ))}
                        </div>
                      </td>
                      <td className="px-3 py-2 text-gray-500 text-xs whitespace-nowrap">{t.createdAt}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* <div className="text-sm text-gray-500 mb-4">Tổng số bản ghi: {empDetail.tasksKpi.tasks.length}</div> */}
            <h4 className="font-semibold text-gray-800 mb-3">KPI Progress</h4>
            <div className="space-y-3">
              {empDetail.tasksKpi.kpi.map((k: any, i: number) => (
                <div key={i}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-gray-700">{k.name}</span>
                    <span className="text-gray-500">{k.pct}% ({fmtValue(k.current, k.name === 'Doanh thu' ? 'currency' : 'number')} / {fmtValue(k.target, k.name === 'Doanh thu' ? 'currency' : 'number')})</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div className={`h-3 rounded-full transition-all duration-500 ${getKpiBarColor(k.pct)}`} style={{ width: `${Math.min(k.pct, 100)}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </DetailSection>
        </div>
      )}

      {/* Task Detail Modal */}
      {showTaskDetail && selectedTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden mx-4">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <h2 className="text-xl font-semibold text-gray-900">{selectedTask.name}</h2>
              </div>
              <div className="flex items-center space-x-2">
                <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors" title="Chỉnh sửa">
                  <PenSquare className="w-5 h-5" />
                </button>
                <button onClick={() => { setShowTaskDetail(false); setSelectedTask(null); setTaskDetailTab('overview') }} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8 px-6 overflow-x-auto">
                <button
                  onClick={() => setTaskDetailTab('overview')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap flex items-center space-x-2 ${taskDetailTab === 'overview' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                >
                  <FileText className="w-4 h-4" />
                  <span>Tổng quan</span>
                </button>
                <button
                  onClick={() => setTaskDetailTab('reminders')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap flex items-center space-x-2 ${taskDetailTab === 'reminders' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                >
                  <Bell className="w-4 h-4" />
                  <span>Nhắc nhở</span>
                </button>
                <button
                  onClick={() => setTaskDetailTab('history')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap flex items-center space-x-2 ${taskDetailTab === 'history' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                >
                  <History className="w-4 h-4" />
                  <span>Lịch sử</span>
                </button>
              </nav>
            </div>

            {/* Content */}
            <div className="overflow-y-auto max-h-[60vh] p-6">
              {taskDetailTab === 'overview' && (
                <div className="space-y-6">
                  {/* Status Bar */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className={`px-3 py-1 text-sm font-medium rounded-full ${getTaskStatusBadge(selectedTask.status)}`}>{selectedTask.status}</span>
                        {selectedTask.overdueDays > 0 && selectedTask.status !== 'Hoàn tất' && (
                          <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800 border border-red-200 flex items-center">
                            <AlertTriangle className="w-3 h-3 mr-1" />
                            Quá hạn {selectedTask.overdueDays} ngày
                          </span>
                        )}
                      </div>
                      {selectedTask.status === 'Chưa làm' && (
                        <button className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-1">
                          <span>Bắt đầu</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Details Grid */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-gray-500">Tiêu đề</label>
                        <div className="text-lg font-medium text-gray-900">{selectedTask.name}</div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Mô tả</label>
                        <div className="text-gray-900 whitespace-pre-wrap">{selectedTask.description || 'Không có mô tả'}</div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Thời hạn</label>
                        <div className={`flex items-center space-x-2 ${selectedTask.overdueDays > 0 && selectedTask.status !== 'Hoàn tất' ? 'text-red-600' : 'text-gray-900'}`}>
                          <Calendar className="w-4 h-4" />
                          <span>{selectedTask.deadlineTime} {selectedTask.deadline}</span>
                          {selectedTask.overdueDays > 0 && selectedTask.status !== 'Hoàn tất' && (
                            <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">Quá hạn {selectedTask.overdueDays} ngày</span>
                          )}
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Ưu tiên</label>
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${selectedTask.priority === 'Cao' ? 'bg-red-100 text-red-800 border-red-200' :
                          selectedTask.priority === 'Trung bình' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                            'bg-green-100 text-green-800 border-green-200'
                          }`}>{selectedTask.priority}</span>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-gray-500">Người phụ trách</label>
                        <div className="flex items-center space-x-2">
                          <User className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-900">{selectedTask.assignee || 'Nguyễn Văn An'}</span>
                          <span className="text-sm text-gray-500">(Sales)</span>
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Liên quan</label>
                        <div className="flex items-center space-x-2 mt-1">
                          <Building2 className="w-4 h-4 text-blue-600" />
                          <span className="text-gray-900">{selectedTask.relatedName}</span>
                          <span className="text-sm text-gray-500">({selectedTask.relatedType})</span>
                        </div>
                        {selectedTask.relatedPhone && (
                          <div className="flex items-center space-x-2 mt-1 text-sm text-gray-500">
                            <Phone className="w-3 h-3" />
                            <span>{selectedTask.relatedPhone}</span>
                          </div>
                        )}
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Nhãn</label>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {selectedTask.tags && selectedTask.tags.length > 0 ? selectedTask.tags.map((tag: string, i: number) => (
                            <span key={i} className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">{tag}</span>
                          )) : <span className="text-gray-500 text-sm">-</span>}
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Tạo lúc</label>
                        <div className="text-gray-900">{selectedTask.createdAt}</div>
                      </div>
                    </div>
                  </div>

                  {/* Internal Note */}
                  {selectedTask.note && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Ghi chú nội bộ</label>
                      <div className="mt-1 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-gray-900">
                        {selectedTask.note}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {taskDetailTab === 'reminders' && (
                <div className="text-center py-8 text-gray-500">
                  Chưa có nhắc nhở nào
                </div>
              )}

              {taskDetailTab === 'history' && (
                <div className="text-center py-8 text-gray-500">
                  Chưa có lịch sử hoạt động
                </div>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

// Collapsible Section wrapper
function DetailSection({ title, icon, sectionKey, expanded, onToggle, children }: {
  title: string; icon: React.ReactNode; sectionKey: string; expanded: boolean; onToggle: (key: string) => void; children: React.ReactNode
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <button
        onClick={() => onToggle(sectionKey)}
        className="w-full flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="text-blue-600">{icon}</span>
          <h3 className="text-base font-bold text-gray-900">{title}</h3>
        </div>
        {expanded ? <ChevronDown className="w-5 h-5 text-gray-400" /> : <ChevronRight className="w-5 h-5 text-gray-400" />}
      </button>
      {expanded && <div className="px-6 pb-5 border-t border-gray-100 pt-4">{children}</div>}
    </div>
  )
}
