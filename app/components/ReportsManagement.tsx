'use client'

import { useState, useEffect } from 'react'
import {
  BarChart3,
  PieChart,
  TrendingUp,
  TrendingDown,
  Users,
  ShoppingCart,
  DollarSign,
  Calendar,
  Filter,
  Download,
  Search,
  Plus,
  Eye,
  Edit2,
  Trash2,
  FileText,
  Activity,
  Target,
  MessageSquare,
  Zap,
  RefreshCw,
  ChevronDown,
  ChevronRight,
  Brain,
  X,
  CheckCircle,
  AlertTriangle,
  Clock,
  Phone,
  Mail,
  LineChart,
  Settings,
  Save,
  Upload,
  Share2,
  Copy,
  ExternalLink,
  Facebook,
  Send,
  Layers,
  Calendar as CalendarIcon,
  BarChart2,
  Monitor,
  Star,
  XCircle,
  Edit,
  Info,
  UserCheck
} from 'lucide-react'
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import EmployeeReportTab from './reports/EmployeeReportTab'
import ReportEmployeeFilter, { getFilterMultiplier, getFilteredTeamNames } from './reports/ReportEmployeeFilter'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
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
import { Progress } from '@/components/ui/progress'

// Interfaces
interface SalesReport {
  id: string
  dateRange: string
  totalRevenue: number
  totalOrders: number
  averageOrderValue: number
  ordersByStatus: {
    paid: number
    unpaid: number
    pending_contract: number
    drafting_contract: number
    cancelled: number
  }
  createdAt: string
}

interface SalesPerformanceReport {
  id: string
  salesPerson: string
  salesTeam: string
  dateRange: string
  leadsAssigned: number
  ordersCreated: number
  conversionRate: number
  revenue: number
  kpiTarget?: number
  kpiCompletion?: number
  leadsBySource: {
    zalo: number
    facebook: number
    manual: number
  }
  createdAt: string
}

interface SalesProcessAnalysis {
  id: string
  stage: string
  leadsCount: number
  conversionRate: number
  averageTimeInStage: number
  dropoffRate: number
}

interface InteractionReport {
  id: string
  period: string
  platform: string
  totalInteractions: number
  interactionsByChannel: {
    zalo: number
    facebook: number
    email: number
    phone: number
  }
  topPerformingAgents: Array<{
    agentName: string
    interactions: number
    responseRate: number
    avgResponseTime: number
  }>
  averageResponseTime: number
  responseRate: number
  conversionsFromInteractions: number
}

interface ComparisonReport {
  id: string
  period1: {
    name: string
    startDate: string
    endDate: string
  }
  period2: {
    name: string
    startDate: string
    endDate: string
  }
  metrics: {
    [key: string]: {
      period1: number
      period2: number
      change: number
    }
  }
}

// KPI Interfaces
interface KPI {
  id: number
  name: string
  current: number
  target: number
  unit: string
  period: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly'
  category: 'sales' | 'marketing' | 'operations' | 'finance'
  trend: 'up' | 'down' | 'stable'
  achievement: number
  description?: string
  assignedTo?: number // Employee ID responsible for this KPI
  departmentId?: number
  isActive: boolean
  createdAt: string
  updatedAt: string
  history: KPIHistory[]
}

interface KPIHistory {
  id: number
  kpiId: number
  value: number
  target: number
  period: string // e.g., "2024-06", "2024-Q2"
  recordedAt: string
  recordedBy: number
  note?: string
}

interface KPITarget {
  id: number
  kpiId: number
  period: string
  target: number
  createdAt: string
  createdBy: number
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
  probationEndDate?: string
  officialDate?: string
  contractType: 'probation' | 'official' | 'contract'
  workingDays: number
  salary: number
  status: 'active' | 'inactive' | 'on_leave'
  avatar?: string
  performance: number
  salesThisMonth: number
  leadsConverted: number
  tasksCompleted: number
  kpiScore: number
  attendanceRate: number
  customerSatisfaction: number
  projectsCompleted: number
  skillLevel: 'junior' | 'middle' | 'senior' | 'expert'
}

// Sample Data
const sampleSalesReports: SalesReport[] = [
  {
    id: '1',
    dateRange: '01/06/2025 - 07/06/2025',
    totalRevenue: 450000000,
    totalOrders: 125,
    averageOrderValue: 3600000,
    ordersByStatus: {
      paid: 75,
      unpaid: 30,
      pending_contract: 15,
      drafting_contract: 3,
      cancelled: 2
    },
    createdAt: '2025-06-08T00:00:00'
  }
]

// Sales Performance Data by Time Period
const getSalesPerformanceData = (period: string): SalesPerformanceReport[] => {
  const todayData: SalesPerformanceReport[] = [
    {
      id: '1',
      salesPerson: 'Nguyễn Văn An',
      salesTeam: 'Team A',
      dateRange: '29/01/2026',
      leadsAssigned: 8,
      ordersCreated: 3,
      conversionRate: 38,
      revenue: 22000000,
      kpiTarget: 5000000,
      kpiCompletion: 440,
      leadsBySource: { zalo: 5, facebook: 2, manual: 1 },
      createdAt: '2026-01-29T00:00:00'
    },
    {
      id: '2',
      salesPerson: 'Trần Thị Bình',
      salesTeam: 'Team B',
      dateRange: '29/01/2026',
      leadsAssigned: 6,
      ordersCreated: 4,
      conversionRate: 67,
      revenue: 28000000,
      kpiTarget: 5000000,
      kpiCompletion: 560,
      leadsBySource: { zalo: 3, facebook: 2, manual: 1 },
      createdAt: '2026-01-29T00:00:00'
    },
    {
      id: '3',
      salesPerson: 'Hoàng Minh Tuấn',
      salesTeam: 'Team B',
      dateRange: '29/01/2026',
      leadsAssigned: 7,
      ordersCreated: 5,
      conversionRate: 71,
      revenue: 32000000,
      kpiTarget: 5000000,
      kpiCompletion: 640,
      leadsBySource: { zalo: 4, facebook: 2, manual: 1 },
      createdAt: '2026-01-29T00:00:00'
    }
  ]

  const weekData: SalesPerformanceReport[] = [
    {
      id: '1',
      salesPerson: 'Nguyễn Văn An',
      salesTeam: 'Team A',
      dateRange: '23/01/2026 - 29/01/2026',
      leadsAssigned: 45,
      ordersCreated: 18,
      conversionRate: 40,
      revenue: 125000000,
      kpiTarget: 150000000,
      kpiCompletion: 83,
      leadsBySource: { zalo: 25, facebook: 15, manual: 5 },
      createdAt: '2026-01-29T00:00:00'
    },
    {
      id: '2',
      salesPerson: 'Trần Thị Bình',
      salesTeam: 'Team B',
      dateRange: '23/01/2026 - 29/01/2026',
      leadsAssigned: 38,
      ordersCreated: 22,
      conversionRate: 58,
      revenue: 180000000,
      kpiTarget: 140000000,
      kpiCompletion: 129,
      leadsBySource: { zalo: 20, facebook: 12, manual: 6 },
      createdAt: '2026-01-29T00:00:00'
    },
    {
      id: '3',
      salesPerson: 'Lê Minh Chánh',
      salesTeam: 'Team A',
      dateRange: '23/01/2026 - 29/01/2026',
      leadsAssigned: 52,
      ordersCreated: 15,
      conversionRate: 29,
      revenue: 95000000,
      kpiTarget: 120000000,
      kpiCompletion: 79,
      leadsBySource: { zalo: 30, facebook: 18, manual: 4 },
      createdAt: '2026-01-29T00:00:00'
    },
    {
      id: '4',
      salesPerson: 'Phạm Thu Hà',
      salesTeam: 'Team C',
      dateRange: '23/01/2026 - 29/01/2026',
      leadsAssigned: 41,
      ordersCreated: 19,
      conversionRate: 46,
      revenue: 142000000,
      leadsBySource: { zalo: 22, facebook: 14, manual: 5 },
      createdAt: '2026-01-29T00:00:00'
    },
    {
      id: '5',
      salesPerson: 'Hoàng Minh Tuấn',
      salesTeam: 'Team B',
      dateRange: '23/01/2026 - 29/01/2026',
      leadsAssigned: 36,
      ordersCreated: 24,
      conversionRate: 67,
      revenue: 198000000,
      kpiTarget: 160000000,
      kpiCompletion: 124,
      leadsBySource: { zalo: 18, facebook: 13, manual: 5 },
      createdAt: '2026-01-29T00:00:00'
    }
  ]

  const monthData: SalesPerformanceReport[] = [
    {
      id: '1',
      salesPerson: 'Nguyễn Văn An',
      salesTeam: 'Team A',
      dateRange: '01/01/2026 - 29/01/2026',
      leadsAssigned: 185,
      ordersCreated: 72,
      conversionRate: 39,
      revenue: 520000000,
      kpiTarget: 600000000,
      kpiCompletion: 87,
      leadsBySource: { zalo: 105, facebook: 60, manual: 20 },
      createdAt: '2026-01-29T00:00:00'
    },
    {
      id: '2',
      salesPerson: 'Trần Thị Bình',
      salesTeam: 'Team B',
      dateRange: '01/01/2026 - 29/01/2026',
      leadsAssigned: 162,
      ordersCreated: 95,
      conversionRate: 59,
      revenue: 745000000,
      kpiTarget: 560000000,
      kpiCompletion: 133,
      leadsBySource: { zalo: 85, facebook: 52, manual: 25 },
      createdAt: '2026-01-29T00:00:00'
    },
    {
      id: '3',
      salesPerson: 'Lê Minh Chánh',
      salesTeam: 'Team A',
      dateRange: '01/01/2026 - 29/01/2026',
      leadsAssigned: 208,
      ordersCreated: 62,
      conversionRate: 30,
      revenue: 395000000,
      kpiTarget: 480000000,
      kpiCompletion: 82,
      leadsBySource: { zalo: 120, facebook: 70, manual: 18 },
      createdAt: '2026-01-29T00:00:00'
    },
    {
      id: '4',
      salesPerson: 'Phạm Thu Hà',
      salesTeam: 'Team C',
      dateRange: '01/01/2026 - 29/01/2026',
      leadsAssigned: 175,
      ordersCreated: 81,
      conversionRate: 46,
      revenue: 595000000,
      leadsBySource: { zalo: 92, facebook: 60, manual: 23 },
      createdAt: '2026-01-29T00:00:00'
    },
    {
      id: '5',
      salesPerson: 'Hoàng Minh Tuấn',
      salesTeam: 'Team B',
      dateRange: '01/01/2026 - 29/01/2026',
      leadsAssigned: 148,
      ordersCreated: 102,
      conversionRate: 69,
      revenue: 825000000,
      kpiTarget: 640000000,
      kpiCompletion: 129,
      leadsBySource: { zalo: 75, facebook: 55, manual: 18 },
      createdAt: '2026-01-29T00:00:00'
    },
    {
      id: '6',
      salesPerson: 'Vũ Thị Mai',
      salesTeam: 'Team A',
      dateRange: '01/01/2026 - 29/01/2026',
      leadsAssigned: 155,
      ordersCreated: 68,
      conversionRate: 44,
      revenue: 485000000,
      kpiTarget: 520000000,
      kpiCompletion: 93,
      leadsBySource: { zalo: 88, facebook: 50, manual: 17 },
      createdAt: '2026-01-29T00:00:00'
    }
  ]

  const quarterData: SalesPerformanceReport[] = monthData.map(sales => ({
    ...sales,
    dateRange: 'Q1/2026',
    leadsAssigned: sales.leadsAssigned * 3,
    ordersCreated: sales.ordersCreated * 3,
    revenue: sales.revenue * 3,
    kpiTarget: sales.kpiTarget ? sales.kpiTarget * 3 : undefined,
    leadsBySource: {
      zalo: sales.leadsBySource.zalo * 3,
      facebook: sales.leadsBySource.facebook * 3,
      manual: sales.leadsBySource.manual * 3
    }
  }))

  const yearData: SalesPerformanceReport[] = monthData.map(sales => ({
    ...sales,
    dateRange: '2026',
    leadsAssigned: sales.leadsAssigned * 12,
    ordersCreated: sales.ordersCreated * 12,
    revenue: sales.revenue * 12,
    kpiTarget: sales.kpiTarget ? sales.kpiTarget * 12 : undefined,
    leadsBySource: {
      zalo: sales.leadsBySource.zalo * 12,
      facebook: sales.leadsBySource.facebook * 12,
      manual: sales.leadsBySource.manual * 12
    }
  }))

  switch (period) {
    case 'today': return todayData
    case 'this_week': return weekData
    case 'this_month': return monthData
    case 'this_quarter': return quarterData
    case 'this_year': return yearData
    default: return monthData
  }
}

const sampleSalesPerformance: SalesPerformanceReport[] = getSalesPerformanceData('this_week')

const sampleProcessAnalysis: SalesProcessAnalysis[] = [
  {
    id: '1',
    stage: 'Mới',
    leadsCount: 898,
    conversionRate: 100,
    averageTimeInStage: 0,
    dropoffRate: 0
  },
  {
    id: '2',
    stage: 'Đã liên hệ',
    leadsCount: 39,
    conversionRate: 4.3,
    averageTimeInStage: 2.5,
    dropoffRate: 95.7
  },
  {
    id: '3',
    stage: 'Đủ điều kiện',
    leadsCount: 35,
    conversionRate: 89.7,
    averageTimeInStage: 1.2,
    dropoffRate: 10.3
  },
  {
    id: '4',
    stage: 'Đang tư vấn',
    leadsCount: 28,
    conversionRate: 80,
    averageTimeInStage: 3.8,
    dropoffRate: 20
  },
  {
    id: '5',
    stage: 'Báo giá',
    leadsCount: 22,
    conversionRate: 78.6,
    averageTimeInStage: 2.1,
    dropoffRate: 21.4
  },
  {
    id: '6',
    stage: 'Chốt deal',
    leadsCount: 18,
    conversionRate: 81.8,
    averageTimeInStage: 1.5,
    dropoffRate: 18.2
  }
]

// Sample KPI data
const sampleKPIs: KPI[] = [
  {
    id: 1,
    name: "Doanh số tháng",
    current: 450000000,
    target: 500000000,
    unit: "VND",
    period: "monthly",
    category: "sales",
    trend: "up",
    achievement: 90,
    description: "Tổng doanh số bán hàng trong tháng",
    assignedTo: 2,
    departmentId: 1,
    isActive: true,
    createdAt: "2024-01-01T00:00:00",
    updatedAt: "2025-06-11T00:00:00",
    history: [
      {
        id: 1,
        kpiId: 1,
        value: 450000000,
        target: 500000000,
        period: "2025-06",
        recordedAt: "2025-06-11T00:00:00",
        recordedBy: 2,
        note: "Doanh số tháng 6 đang khả quan"
      },
      {
        id: 2,
        kpiId: 1,
        value: 480000000,
        target: 500000000,
        period: "2025-05",
        recordedAt: "2025-05-31T00:00:00",
        recordedBy: 2,
        note: "Đạt 96% mục tiêu tháng 5"
      }
    ]
  },
  {
    id: 2,
    name: "Số leads mới",
    current: 285,
    target: 300,
    unit: "leads",
    period: "monthly",
    category: "marketing",
    trend: "up",
    achievement: 95,
    description: "Số lượng leads mới được tạo trong tháng",
    assignedTo: 4,
    departmentId: 2,
    isActive: true,
    createdAt: "2024-01-01T00:00:00",
    updatedAt: "2025-06-11T00:00:00",
    history: [
      {
        id: 3,
        kpiId: 2,
        value: 285,
        target: 300,
        period: "2025-06",
        recordedAt: "2025-06-11T00:00:00",
        recordedBy: 4,
        note: "Cần tăng cường hoạt động marketing"
      }
    ]
  },
  {
    id: 3,
    name: "Tỷ lệ chuyển đổi",
    current: 25,
    target: 30,
    unit: "%",
    period: "monthly",
    category: "sales",
    trend: "up",
    achievement: 83,
    description: "Tỷ lệ chuyển đổi từ leads thành khách hàng",
    assignedTo: 2,
    departmentId: 1,
    isActive: true,
    createdAt: "2024-01-01T00:00:00",
    updatedAt: "2025-06-11T00:00:00",
    history: [
      {
        id: 4,
        kpiId: 3,
        value: 25,
        target: 30,
        period: "2025-06",
        recordedAt: "2025-06-11T00:00:00",
        recordedBy: 2,
        note: "Cần cải thiện quy trình bán hàng"
      }
    ]
  },
  {
    id: 4,
    name: "Doanh thu/nhân viên",
    current: 180000000,
    target: 200000000,
    unit: "VND",
    period: "monthly",
    category: "operations",
    trend: "up",
    achievement: 90,
    description: "Doanh thu trung bình mỗi nhân viên",
    assignedTo: 1,
    isActive: true,
    createdAt: "2024-01-01T00:00:00",
    updatedAt: "2025-06-11T00:00:00",
    history: [
      {
        id: 5,
        kpiId: 4,
        value: 180000000,
        target: 200000000,
        period: "2025-06",
        recordedAt: "2025-06-11T00:00:00",
        recordedBy: 1,
        note: "Hiệu suất làm việc ổn định"
      }
    ]
  },
  {
    id: 5,
    name: "Chỉ số hài lòng KH",
    current: 4.2,
    target: 4.5,
    unit: "/5",
    period: "monthly",
    category: "operations",
    trend: "stable",
    achievement: 93,
    description: "Điểm đánh giá trung bình của khách hàng",
    assignedTo: 3,
    departmentId: 3,
    isActive: true,
    createdAt: "2024-01-01T00:00:00",
    updatedAt: "2025-06-11T00:00:00",
    history: [
      {
        id: 6,
        kpiId: 5,
        value: 4.2,
        target: 4.5,
        period: "2025-06",
        recordedAt: "2025-06-11T00:00:00",
        recordedBy: 3,
        note: "Chất lượng dịch vụ tốt"
      }
    ]
  },
  {
    id: 6,
    name: "Chi phí vận hành",
    current: 120000000,
    target: 100000000,
    unit: "VND",
    period: "monthly",
    category: "finance",
    trend: "down",
    achievement: 83,
    description: "Tổng chi phí vận hành hàng tháng",
    assignedTo: 5,
    isActive: true,
    createdAt: "2024-01-01T00:00:00",
    updatedAt: "2025-06-11T00:00:00",
    history: [
      {
        id: 7,
        kpiId: 6,
        value: 120000000,
        target: 100000000,
        period: "2025-06",
        recordedAt: "2025-06-11T00:00:00",
        recordedBy: 5,
        note: "Cần tối ưu hóa chi phí"
      }
    ]
  }
]

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
    hireDate: "2023-01-15",
    probationEndDate: "2023-04-15",
    officialDate: "2023-04-16",
    contractType: "official",
    workingDays: 852,
    salary: 25000000,
    status: "active",
    performance: 92,
    salesThisMonth: 150000000,
    leadsConverted: 23,
    tasksCompleted: 45,
    kpiScore: 88,
    attendanceRate: 96,
    customerSatisfaction: 4.5,
    projectsCompleted: 12,
    skillLevel: "senior"
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
    hireDate: "2022-03-20",
    probationEndDate: "2022-06-20",
    officialDate: "2022-06-21",
    contractType: "official",
    workingDays: 1083,
    salary: 35000000,
    status: "active",
    performance: 88,
    salesThisMonth: 180000000,
    leadsConverted: 28,
    tasksCompleted: 52,
    kpiScore: 92,
    attendanceRate: 98,
    customerSatisfaction: 4.7,
    projectsCompleted: 18,
    skillLevel: "expert"
  },
  {
    id: 3,
    name: "Lê Văn Cường",
    email: "le.van.cuong@company.com",
    phone: "0901234569",
    position: "Customer Support Manager",
    department: "Hỗ trợ khách hàng",
    departmentId: 3,
    teamId: 4,
    teamName: "Customer Support",
    hireDate: "2023-02-10",
    probationEndDate: "2023-05-10",
    officialDate: "2023-05-11",
    contractType: "official",
    workingDays: 795,
    salary: 20000000,
    status: "active",
    performance: 89,
    salesThisMonth: 0,
    leadsConverted: 0,
    tasksCompleted: 38,
    kpiScore: 85,
    attendanceRate: 94,
    customerSatisfaction: 4.8,
    projectsCompleted: 8,
    skillLevel: "senior"
  },
  {
    id: 4,
    name: "Lê Văn Dũng",
    email: "le.van.dung@company.com",
    phone: "0901234570",
    position: "Marketing Manager",
    department: "Marketing",
    departmentId: 2,
    teamId: 3,
    teamName: "Digital Marketing",
    hireDate: "2023-03-01",
    probationEndDate: "2023-06-01",
    officialDate: "2023-06-02",
    contractType: "official",
    workingDays: 776,
    salary: 22000000,
    status: "active",
    performance: 91,
    salesThisMonth: 0,
    leadsConverted: 0,
    tasksCompleted: 42,
    kpiScore: 87,
    attendanceRate: 95,
    customerSatisfaction: 4.3,
    projectsCompleted: 15,
    skillLevel: "senior"
  },
  {
    id: 5,
    name: "Phạm Thị Hương",
    email: "pham.thi.huong@company.com",
    phone: "0901234571",
    position: "Customer Support",
    department: "Hỗ trợ khách hàng",
    departmentId: 3,
    teamId: 4,
    teamName: "Customer Support",
    hireDate: "2024-01-15",
    probationEndDate: "2024-04-15",
    officialDate: "2024-04-16",
    contractType: "official",
    workingDays: 512,
    salary: 16000000,
    status: "active",
    performance: 86,
    salesThisMonth: 0,
    leadsConverted: 0,
    tasksCompleted: 35,
    kpiScore: 82,
    attendanceRate: 93,
    customerSatisfaction: 4.6,
    projectsCompleted: 6,
    skillLevel: "middle"
  }
]

// Sample Interaction Reports
const sampleInteractionReports: InteractionReport[] = [
  {
    id: '1',
    platform: 'zalo',
    period: '01/06/2025 - 07/06/2025',
    totalInteractions: 1250,
    responseRate: 85,
    averageResponseTime: 45, // 45 minutes
    conversionsFromInteractions: 78,
    interactionsByChannel: {
      zalo: 1250,
      facebook: 0,
      email: 0,
      phone: 0
    },
    topPerformingAgents: [
      {
        agentName: 'Nguyễn Văn An',
        interactions: 320,
        responseRate: 92,
        avgResponseTime: 25
      },
      {
        agentName: 'Trần Thị Bình',
        interactions: 280,
        responseRate: 88,
        avgResponseTime: 35
      },
      {
        agentName: 'Lê Minh Chánh',
        interactions: 245,
        responseRate: 82,
        avgResponseTime: 50
      }
    ]
  },
  {
    id: '2',
    platform: 'facebook',
    period: '01/06/2025 - 07/06/2025',
    totalInteractions: 890,
    responseRate: 78,
    averageResponseTime: 65,
    conversionsFromInteractions: 45,
    interactionsByChannel: {
      zalo: 0,
      facebook: 890,
      email: 0,
      phone: 0
    },
    topPerformingAgents: [
      {
        agentName: 'Phạm Thị Dung',
        interactions: 220,
        responseRate: 85,
        avgResponseTime: 40
      },
      {
        agentName: 'Hoàng Văn Em',
        interactions: 195,
        responseRate: 80,
        avgResponseTime: 55
      }
    ]
  }
]

// Sample Comparison Reports
const sampleComparisonReports: ComparisonReport[] = [
  {
    id: '1',
    period1: {
      name: 'Tháng này',
      startDate: '2025-06-01',
      endDate: '2025-06-07'
    },
    period2: {
      name: 'Tháng trước',
      startDate: '2025-05-01',
      endDate: '2025-05-07'
    },
    metrics: {
      revenue: { period1: 450000000, period2: 380000000, change: 18.4 },
      orders: { period1: 125, period2: 108, change: 15.7 },
      leads: { period1: 450, period2: 420, change: 7.1 },
      conversionRate: { period1: 27.8, period2: 25.7, change: 8.2 }
    }
  }
]

export default function ReportsManagement({ onNavigate }: { onNavigate?: (view: string) => void } = {}) {
  const [activeTab, setActiveTab] = useState('overview')
  const [selectedDateRange, setSelectedDateRange] = useState('this_week')
  const [customDateRange, setCustomDateRange] = useState({ start: '', end: '' })
  const [selectedReport, setSelectedReport] = useState<any>(null)
  const [showReportModal, setShowReportModal] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showExportModal, setShowExportModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [showSalesDetailModal, setShowSalesDetailModal] = useState(false)
  const [selectedDate, setSelectedDate] = useState('')
  const [modalSearchTerm, setModalSearchTerm] = useState('')
  const [showPerformanceDetailModal, setShowPerformanceDetailModal] = useState(false)
  const [selectedSalesForDetail, setSelectedSalesForDetail] = useState<SalesPerformanceReport | null>(null)

  // Listen for tab switching events from Dashboard
  useEffect(() => {
    const handleSetTab = (event: any) => {
      if (event.detail?.tab) {
        setActiveTab(event.detail.tab)
        if (event.detail.filter === 'today') {
          setSelectedDateRange('today')
        }
      }
    }
    window.addEventListener('setReportTab', handleSetTab)
    return () => window.removeEventListener('setReportTab', handleSetTab)
  }, [])

  // Collapsible sections state
  const [showAIAnalysis, setShowAIAnalysis] = useState(false)

  // Filters
  const [productFilter, setProductFilter] = useState('')
  const [salesPersonFilter, setSalesPersonFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [sourceFilter, setSourceFilter] = useState('')
  // Shared dept/team/employee filter state
  const [reportDeptFilter, setReportDeptFilter] = useState('')
  const [reportTeamFilter, setReportTeamFilter] = useState('')
  const [reportEmployeeFilter, setReportEmployeeFilter] = useState('')

  // Interaction & Comparison states
  const [selectedPlatform, setSelectedPlatform] = useState<'all' | 'zalo' | 'facebook' | 'email' | 'phone'>('all')
  const [comparisonPeriod1, setComparisonPeriod1] = useState('this_month')
  const [comparisonPeriod2, setComparisonPeriod2] = useState('last_month')

  // KPI states
  const [selectedKPI, setSelectedKPI] = useState<KPI | null>(null)
  const [activeKPITab, setActiveKPITab] = useState('overview')
  const [kpiSearchTerm, setKpiSearchTerm] = useState('')
  const [kpiCategoryFilter, setKpiCategoryFilter] = useState('all')
  const [kpiPeriodFilter, setKpiPeriodFilter] = useState('all')

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

  const formatPercent = (value: number) => {
    return `${value.toFixed(1)}%`
  }

  const formatTime = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes} phút`
    }
    const hours = Math.floor(minutes / 60)
    const remainingMinutes = minutes % 60
    return `${hours}h ${remainingMinutes}m`
  }

  const getChangeIcon = (change: number) => {
    if (change > 0) return <TrendingUp className="w-4 h-4 text-green-600" />
    if (change < 0) return <TrendingDown className="w-4 h-4 text-red-600" />
    return <span className="w-4 h-4 text-gray-400">—</span>
  }

  const getChangeColor = (change: number) => {
    if (change > 0) return 'text-green-600'
    if (change < 0) return 'text-red-600'
    return 'text-gray-600'
  }

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'zalo': return <MessageSquare className="w-5 h-5 text-blue-500" />
      case 'facebook': return <Facebook className="w-5 h-5 text-blue-600" />
      case 'email': return <Mail className="w-5 h-5 text-gray-600" />
      case 'phone': return <Phone className="w-5 h-5 text-green-600" />
      default: return <MessageSquare className="w-5 h-5 text-gray-500" />
    }
  }

  // KPI Utility functions
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'sales': return 'bg-blue-100 text-blue-800'
      case 'marketing': return 'bg-green-100 text-green-800'
      case 'operations': return 'bg-purple-100 text-purple-800'
      case 'finance': return 'bg-orange-100 text-orange-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getCategoryText = (category: string) => {
    switch (category) {
      case 'sales': return 'Kinh doanh'
      case 'marketing': return 'Marketing'
      case 'operations': return 'Vận hành'
      case 'finance': return 'Tài chính'
      default: return category
    }
  }

  const getPeriodText = (period: string) => {
    switch (period) {
      case 'daily': return 'Hàng ngày'
      case 'weekly': return 'Hàng tuần'
      case 'monthly': return 'Hàng tháng'
      case 'quarterly': return 'Hàng quý'
      case 'yearly': return 'Hàng năm'
      default: return period
    }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-green-500" />
      case 'down': return <TrendingUp className="w-4 h-4 text-red-500 rotate-180" />
      case 'stable': return <Activity className="w-4 h-4 text-yellow-500" />
      default: return <Activity className="w-4 h-4 text-gray-500" />
    }
  }

  const filteredKPIs = sampleKPIs.filter(kpi => {
    const matchesSearch = kpi.name.toLowerCase().includes(kpiSearchTerm.toLowerCase()) ||
      (kpi.description && kpi.description.toLowerCase().includes(kpiSearchTerm.toLowerCase()))
    const matchesCategory = !kpiCategoryFilter || kpiCategoryFilter === 'all' || kpi.category === kpiCategoryFilter
    const matchesPeriod = !kpiPeriodFilter || kpiPeriodFilter === 'all' || kpi.period === kpiPeriodFilter
    return matchesSearch && matchesCategory && matchesPeriod && kpi.isActive
  })

  // Export functionality
  const handleExport = (format: 'excel' | 'csv' | 'pdf', reportType: string) => {
    // Mock export functionality
    console.log(`Exporting ${reportType} as ${format}`)
    // In real implementation, this would call an API or generate the file
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800'
      case 'unpaid': return 'bg-yellow-100 text-yellow-800'
      case 'pending_contract': return 'bg-blue-100 text-blue-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'paid': return 'Đã thanh toán'
      case 'unpaid': return 'Chưa thanh toán'
      case 'pending_contract': return 'Chờ hợp đồng'
      case 'drafting_contract': return 'Đang soạn hợp đồng'
      case 'cancelled': return 'Hủy'
      default: return status
    }
  }

  // Report Overview Component
  const ReportOverview = () => (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="flex flex-col justify-between rounded-lg px-6 py-5 min-w-[180px] text-white shadow-lg cursor-pointer relative transition-all hover:shadow-xl bg-gradient-to-br from-green-600 to-green-400">
          <div className="absolute top-2 right-2">
            <Info className="w-3.5 h-3.5 text-white/70 hover:text-white cursor-help transition-colors" />
          </div>
          <div>
            <p className="text-base font-semibold text-white mb-2">Tổng doanh số</p>
            <p className="text-4xl font-extrabold text-white mb-1">
              {formatCurrency(sampleSalesReports[0]?.totalRevenue || 0)}
            </p>
            <div className="mt-3">
              <p className="text-sm text-white/90">Tuần này</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-between rounded-lg px-6 py-5 min-w-[180px] text-white shadow-lg cursor-pointer relative transition-all hover:shadow-xl bg-gradient-to-br from-blue-600 to-blue-400">
          <div className="absolute top-2 right-2">
            <Info className="w-3.5 h-3.5 text-white/70 hover:text-white cursor-help transition-colors" />
          </div>
          <div>
            <p className="text-base font-semibold text-white mb-2">Số đơn bán</p>
            <p className="text-4xl font-extrabold text-white mb-1">
              {sampleSalesReports[0]?.totalOrders || 0}
            </p>
            <div className="mt-3">
              <p className="text-sm text-white/90">+12% so với tuần trước</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-between rounded-lg px-6 py-5 min-w-[180px] text-white shadow-lg cursor-pointer relative transition-all hover:shadow-xl bg-gradient-to-br from-purple-600 to-purple-400">
          <div className="absolute top-2 right-2">
            <Info className="w-3.5 h-3.5 text-white/70 hover:text-white cursor-help transition-colors" />
          </div>
          <div>
            <p className="text-base font-semibold text-white mb-2">Tỷ lệ chốt TB</p>
            <p className="text-4xl font-extrabold text-white mb-1">
              {Math.round(sampleSalesPerformance.reduce((acc, s) => acc + s.conversionRate, 0) / sampleSalesPerformance.length)}%
            </p>
            <div className="mt-3">
              <p className="text-sm text-white/90">+5% so với tuần trước</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-between rounded-lg px-6 py-5 min-w-[180px] text-white shadow-lg cursor-pointer relative transition-all hover:shadow-xl bg-gradient-to-br from-orange-600 to-orange-400">
          <div className="absolute top-2 right-2">
            <Info className="w-3.5 h-3.5 text-white/70 hover:text-white cursor-help transition-colors" />
          </div>
          <div>
            <p className="text-base font-semibold text-white mb-2">GTB đơn hàng</p>
            <p className="text-4xl font-extrabold text-white mb-1">
              {formatCurrency(sampleSalesReports[0]?.averageOrderValue || 0)}
            </p>
            <div className="mt-3">
              <p className="text-sm text-white/90">-2% so với tuần trước</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Report Access */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => setActiveTab('sales')}>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <BarChart3 className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold">Báo cáo Doanh số</h3>
                <p className="text-sm text-gray-600">Theo dõi doanh thu và đơn hàng</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => setActiveTab('performance')}>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold">Hiệu suất Sales</h3>
                <p className="text-sm text-gray-600">Đánh giá hiệu quả bán hàng</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => setActiveTab('process')}>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Activity className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold">Quy trình Bán hàng</h3>
                <p className="text-sm text-gray-600">Phân tích funnel chuyển đổi</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => setActiveTab('sources')}>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Zap className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <h3 className="font-semibold">Nguồn Lead</h3>
                <p className="text-sm text-gray-600">Hiệu quả các kênh marketing</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => setActiveTab('cancellation')}>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-red-100 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="font-semibold">Tỷ lệ Hủy đơn</h3>
                <p className="text-sm text-gray-600">Phân tích đơn hàng bị hủy</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => setActiveTab('custom')}>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gray-100 rounded-lg">
                <FileText className="w-6 h-6 text-gray-600" />
              </div>
              <div>
                <h3 className="font-semibold">Báo cáo Tùy chỉnh</h3>
                <p className="text-sm text-gray-600">Tạo và lưu báo cáo riêng</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Reports */}
      <Card>
        <CardHeader>
          <CardTitle>Báo cáo gần đây</CardTitle>
          <CardDescription>Các báo cáo được tạo trong 7 ngày qua</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { name: 'Doanh số tuần 23/2025', type: 'Doanh số', date: '2025-06-07', status: 'completed' },
              { name: 'Hiệu suất Team A - Tháng 6', type: 'Hiệu suất', date: '2025-06-06', status: 'completed' },
              { name: 'Phân tích Lead Facebook', type: 'Nguồn Lead', date: '2025-06-05', status: 'processing' }
            ].map((report, index) => (
              <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <FileText className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="font-medium">{report.name}</p>
                    <p className="text-sm text-gray-500">{report.type} • {formatDate(report.date)}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant={report.status === 'completed' ? 'default' : 'secondary'}>
                    {report.status === 'completed' ? 'Hoàn thành' : 'Đang xử lý'}
                  </Badge>
                  <Button variant="ghost" size="sm">
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )

  // Sales Report Component
  const SalesReportComponent = () => (
    <div className="space-y-6">
      {/* Header and Filters */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Báo cáo Doanh số</h2>
          <p className="text-gray-600">Theo dõi doanh thu và hiệu quả bán hàng</p>
        </div>

        <div className="flex items-center space-x-3">
          <select
            value={selectedDateRange}
            onChange={(e) => setSelectedDateRange(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 text-sm bg-white"
          >
            <option value="today">Hôm nay</option>
            <option value="this_week">Tuần này</option>
            <option value="this_month">Tháng này</option>
            <option value="this_quarter">Quý này</option>
            <option value="this_year">Năm này</option>
            <option value="custom">Chọn thời gian</option>
          </select>
          {selectedDateRange === 'custom' && (
            <div className="flex items-center space-x-2">
              <input
                type="date"
                value={customDateRange.start}
                onChange={(e) => setCustomDateRange({ ...customDateRange, start: e.target.value })}
                className="border border-gray-300 rounded px-3 py-2 text-sm bg-white"
              />
              <span className="text-gray-500 text-sm">đến</span>
              <input
                type="date"
                value={customDateRange.end}
                onChange={(e) => setCustomDateRange({ ...customDateRange, end: e.target.value })}
                className="border border-gray-300 rounded px-3 py-2 text-sm bg-white"
              />
            </div>
          )}

          <ReportEmployeeFilter
            selectedDepartment={reportDeptFilter}
            onDepartmentChange={setReportDeptFilter}
            selectedTeam={reportTeamFilter}
            onTeamChange={setReportTeamFilter}
            selectedEmployee={reportEmployeeFilter}
            onEmployeeChange={setReportEmployeeFilter}
          />
        </div>
      </div>

      {/* Sales Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {(() => {
          const mult = getFilterMultiplier(reportDeptFilter, reportTeamFilter, reportEmployeeFilter)
          const summaryData = {
            today: { revenue: 75000000, orders: 22, conversion: 32, paymentRate: 76 },
            this_week: { revenue: 490000000, orders: 140, conversion: 32, paymentRate: 76 },
            this_month: { revenue: 2070000000, orders: 580, conversion: 32, paymentRate: 76 },
            this_quarter: { revenue: 2070000000, orders: 580, conversion: 32, paymentRate: 76 },
            this_year: { revenue: 2070000000, orders: 580, conversion: 32, paymentRate: 76 }
          }
          const raw = summaryData[selectedDateRange as keyof typeof summaryData] || summaryData.this_week
          const data = { revenue: Math.round(raw.revenue * mult), orders: Math.round(raw.orders * mult), conversion: raw.conversion, paymentRate: raw.paymentRate }

          return (
            <>
              <div className="flex flex-col justify-between rounded-lg px-6 py-5 min-w-[180px] text-white shadow-lg cursor-pointer relative transition-all hover:shadow-xl bg-gradient-to-br from-green-600 to-green-400">
                <div className="absolute top-2 right-2">
                  <Info className="w-3.5 h-3.5 text-white/70 hover:text-white cursor-help transition-colors" />
                </div>
                <div>
                  <p className="text-base font-semibold text-white mb-2">Tổng doanh số</p>
                  <p className="text-4xl font-extrabold text-white mb-1">
                    {formatCurrency(data.revenue)}
                  </p>
                  <div className="mt-3 flex items-center">
                    <TrendingUp className="w-4 h-4 text-white/90 mr-1" />
                    <span className="text-sm text-white/90">+15.2%</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col justify-between rounded-lg px-6 py-5 min-w-[180px] text-white shadow-lg cursor-pointer relative transition-all hover:shadow-xl bg-gradient-to-br from-blue-600 to-blue-400">
                <div className="absolute top-2 right-2">
                  <Info className="w-3.5 h-3.5 text-white/70 hover:text-white cursor-help transition-colors" />
                </div>
                <div>
                  <p className="text-base font-semibold text-white mb-2">Số đơn bán</p>
                  <p className="text-4xl font-extrabold text-white mb-1">{data.orders}</p>
                  <div className="mt-3 flex items-center">
                    <TrendingUp className="w-4 h-4 text-white/90 mr-1" />
                    <span className="text-sm text-white/90">+8.3%</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col justify-between rounded-lg px-6 py-5 min-w-[180px] text-white shadow-lg cursor-pointer relative transition-all hover:shadow-xl bg-gradient-to-br from-purple-600 to-purple-400">
                <div className="absolute top-2 right-2">
                  <Info className="w-3.5 h-3.5 text-white/70 hover:text-white cursor-help transition-colors" />
                </div>
                <div>
                  <p className="text-base font-semibold text-white mb-2">Tỷ lệ chuyển đổi trung bình</p>
                  <p className="text-4xl font-extrabold text-white mb-1">{data.conversion}%</p>
                  <div className="mt-3 flex items-center">
                    <TrendingUp className="w-4 h-4 text-white/90 mr-1" />
                    <span className="text-sm text-white/90">+4.5%</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col justify-between rounded-lg px-6 py-5 min-w-[180px] text-white shadow-lg cursor-pointer relative transition-all hover:shadow-xl bg-gradient-to-br from-orange-600 to-orange-400">
                <div className="absolute top-2 right-2">
                  <Info className="w-3.5 h-3.5 text-white/70 hover:text-white cursor-help transition-colors" />
                </div>
                <div>
                  <p className="text-base font-semibold text-white mb-2">Tỷ lệ thanh toán</p>
                  <p className="text-4xl font-extrabold text-white mb-1">{data.paymentRate}%</p>
                  <div className="mt-3 flex items-center">
                    <TrendingUp className="w-4 h-4 text-white/90 mr-1" />
                    <span className="text-sm text-white/90">+3.2%</span>
                  </div>
                </div>
              </div>
            </>
          )
        })()}
      </div>

      {/* Order Status Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Phân loại đơn hàng theo trạng thái</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {(() => {
                const statusData = {
                  today: [
                    { status: 'paid', count: 16, label: 'Đã thanh toán', color: 'green' },
                    { status: 'unpaid', count: 4, label: 'Chưa thanh toán', color: 'yellow' },
                    { status: 'pending_contract', count: 2, label: 'Chờ hợp đồng', color: 'blue' },
                    { status: 'drafting_contract', count: 0, label: 'Đang soạn HĐ', color: 'purple' },
                    { status: 'cancelled', count: 0, label: 'Đã hủy', color: 'red' }
                  ],
                  this_week: [
                    { status: 'paid', count: 105, label: 'Đã thanh toán', color: 'green' },
                    { status: 'unpaid', count: 25, label: 'Chưa thanh toán', color: 'yellow' },
                    { status: 'pending_contract', count: 8, label: 'Chờ hợp đồng', color: 'blue' },
                    { status: 'drafting_contract', count: 2, label: 'Đang soạn HĐ', color: 'purple' },
                    { status: 'cancelled', count: 0, label: 'Đã hủy', color: 'red' }
                  ],
                  this_month: [
                    { status: 'paid', count: 435, label: 'Đã thanh toán', color: 'green' },
                    { status: 'unpaid', count: 100, label: 'Chưa thanh toán', color: 'yellow' },
                    { status: 'pending_contract', count: 35, label: 'Chờ hợp đồng', color: 'blue' },
                    { status: 'drafting_contract', count: 8, label: 'Đang soạn HĐ', color: 'purple' },
                    { status: 'cancelled', count: 2, label: 'Đã hủy', color: 'red' }
                  ]
                }
                const data = statusData[selectedDateRange as keyof typeof statusData] || statusData.this_month
                const total = data.reduce((sum, item) => sum + item.count, 0)

                return data.map((item) => (
                  <div key={item.status} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full bg-${item.color}-500`}></div>
                      <span className="font-medium">{item.label}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="font-bold">{item.count}</span>
                      <span className="text-sm text-gray-500">
                        ({total > 0 ? Math.round((item.count / total) * 100) : 0}%)
                      </span>
                    </div>
                  </div>
                ))
              })()}
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Doanh số theo sản phẩm</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {(() => {
                const productData = {
                  today: [
                    { product: 'Gói Enterprise', revenue: 35000000, percentage: 47 },
                    { product: 'Gói Professional', revenue: 25000000, percentage: 33 },
                    { product: 'Gói Starter', revenue: 10000000, percentage: 13 },
                    { product: 'Dịch vụ tư vấn', revenue: 5000000, percentage: 7 }
                  ],
                  this_week: [
                    { product: 'Gói Enterprise', revenue: 240000000, percentage: 49 },
                    { product: 'Gói Professional', revenue: 150000000, percentage: 31 },
                    { product: 'Gói Starter', revenue: 70000000, percentage: 14 },
                    { product: 'Dịch vụ tư vấn', revenue: 30000000, percentage: 6 }
                  ],
                  this_month: [
                    { product: 'Gói Enterprise', revenue: 1014000000, percentage: 49 },
                    { product: 'Gói Professional', revenue: 642000000, percentage: 31 },
                    { product: 'Gói Starter', revenue: 290000000, percentage: 14 },
                    { product: 'Dịch vụ tư vấn', revenue: 124000000, percentage: 6 }
                  ]
                }
                const data = productData[selectedDateRange as keyof typeof productData] || productData.this_month

                return data.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-sm">{item.product}</span>
                        <span className="text-xs text-gray-500">{item.percentage}%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-blue-600">
                          {formatCurrency(item.revenue)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              })()}
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-6">
          <CardHeader>
            <CardTitle>
              {selectedDateRange === 'today' && 'Xu hướng doanh số hôm nay'}
              {selectedDateRange === 'this_week' && 'Xu hướng doanh số 7 ngày qua'}
              {(selectedDateRange === 'this_month' || selectedDateRange === 'this_quarter' || selectedDateRange === 'this_year') && 'Xu hướng doanh số tháng qua'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={256}>
              {(() => {
                const chartData = {
                  today: [
                    { date: '29/01', revenue: 75000000, displayDate: '29/01/2026' }
                  ],
                  this_week: [
                    { date: '23/01', revenue: 68000000, displayDate: '23/01/2026' },
                    { date: '24/01', revenue: 72000000, displayDate: '24/01/2026' },
                    { date: '25/01', revenue: 65000000, displayDate: '25/01/2026' },
                    { date: '26/01', revenue: 58000000, displayDate: '26/01/2026' },
                    { date: '27/01', revenue: 82000000, displayDate: '27/01/2026' },
                    { date: '28/01', revenue: 70000000, displayDate: '28/01/2026' },
                    { date: '29/01', revenue: 75000000, displayDate: '29/01/2026' }
                  ],
                  this_month: [
                    { date: '01/01', revenue: 45000000, displayDate: '01/01/2026' },
                    { date: '05/01', revenue: 50000000, displayDate: '05/01/2026' },
                    { date: '10/01', revenue: 65000000, displayDate: '10/01/2026' },
                    { date: '15/01', revenue: 80000000, displayDate: '15/01/2026' },
                    { date: '20/01', revenue: 75000000, displayDate: '20/01/2026' },
                    { date: '25/01', revenue: 65000000, displayDate: '25/01/2026' },
                    { date: '29/01', revenue: 75000000, displayDate: '29/01/2026' }
                  ]
                }
                const data = chartData[selectedDateRange as keyof typeof chartData] || chartData.this_month

                return (
                  <RechartsLineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                    <XAxis
                      dataKey="date"
                      tick={{ fontSize: 12 }}
                      stroke="#6b7280"
                    />
                    <YAxis
                      tick={{ fontSize: 12 }}
                      stroke="#6b7280"
                      tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        padding: '8px 12px'
                      }}
                      formatter={(value: any) => [formatCurrency(value), 'Doanh số']}
                      labelFormatter={(label) => {
                        const item = data.find(d => d.date === label)
                        return item ? item.displayDate : label
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="revenue"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      dot={{ fill: '#3b82f6', r: 4 }}
                      activeDot={{ r: 6, fill: '#2563eb' }}
                    />
                  </RechartsLineChart>
                )
              })()}
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Sales Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>
                {selectedDateRange === 'today' && 'Chi tiết doanh số hôm nay'}
                {selectedDateRange === 'this_week' && 'Chi tiết doanh số theo tuần'}
                {selectedDateRange === 'this_month' && 'Chi tiết doanh số theo tháng'}
                {selectedDateRange === 'this_quarter' && 'Chi tiết doanh số theo quý'}
                {selectedDateRange === 'this_year' && 'Chi tiết doanh số theo năm'}
              </CardTitle>
              <CardDescription>
                {selectedDateRange === 'today' && 'Thống kê chi tiết hôm nay'}
                {selectedDateRange === 'this_week' && 'Thống kê chi tiết theo từng ngày trong tuần'}
                {(selectedDateRange === 'this_month' || selectedDateRange === 'this_quarter' || selectedDateRange === 'this_year') && 'Thống kê chi tiết theo từng ngày trong tháng'}
              </CardDescription>
            </div>
            <Button
              className="bg-green-600 hover:bg-green-700 text-white"
              onClick={() => {
                // Export all displayed records to Excel
                console.log('Exporting to Excel...')
              }}
            >
              <Download className="w-4 h-4 mr-2" />
              Xuất excel
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ngày</TableHead>
                <TableHead>Doanh số</TableHead>
                <TableHead>Số đơn</TableHead>
                <TableHead>Số khách hàng</TableHead>
                <TableHead>Giá trị bán</TableHead>
                <TableHead>Tỷ lệ thanh toán</TableHead>
                <TableHead>Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(() => {
                // Data for today (29/01/2026)
                const todayData = [
                  { date: '2026-01-29', revenue: 75000000, orders: 22, customers: 18, totalValue: 98500000, paymentRate: 76 }
                ]

                // Data for this week (23/01 - 29/01/2026)
                const weekData = [
                  { date: '2026-01-23', revenue: 68000000, orders: 19, customers: 16, totalValue: 89000000, paymentRate: 76 },
                  { date: '2026-01-24', revenue: 72000000, orders: 21, customers: 17, totalValue: 95000000, paymentRate: 76 },
                  { date: '2026-01-25', revenue: 65000000, orders: 18, customers: 15, totalValue: 85000000, paymentRate: 76 },
                  { date: '2026-01-26', revenue: 58000000, orders: 16, customers: 13, totalValue: 77000000, paymentRate: 75 },
                  { date: '2026-01-27', revenue: 82000000, orders: 24, customers: 20, totalValue: 108000000, paymentRate: 76 },
                  { date: '2026-01-28', revenue: 70000000, orders: 20, customers: 17, totalValue: 92000000, paymentRate: 76 },
                  { date: '2026-01-29', revenue: 75000000, orders: 22, customers: 18, totalValue: 98500000, paymentRate: 76 }
                ]

                // Data for this month (January 2026 - 31 days)
                const monthData = [
                  { date: '2026-01-01', revenue: 45000000, orders: 12, customers: 10, totalValue: 60000000, paymentRate: 75 },
                  { date: '2026-01-02', revenue: 52000000, orders: 15, customers: 12, totalValue: 69000000, paymentRate: 75 },
                  { date: '2026-01-03', revenue: 48000000, orders: 14, customers: 11, totalValue: 64000000, paymentRate: 75 },
                  { date: '2026-01-04', revenue: 55000000, orders: 16, customers: 13, totalValue: 73000000, paymentRate: 75 },
                  { date: '2026-01-05', revenue: 50000000, orders: 14, customers: 12, totalValue: 67000000, paymentRate: 75 },
                  { date: '2026-01-06', revenue: 62000000, orders: 18, customers: 15, totalValue: 82000000, paymentRate: 76 },
                  { date: '2026-01-07', revenue: 58000000, orders: 17, customers: 14, totalValue: 77000000, paymentRate: 75 },
                  { date: '2026-01-08', revenue: 68000000, orders: 20, customers: 16, totalValue: 90000000, paymentRate: 76 },
                  { date: '2026-01-09', revenue: 72000000, orders: 21, customers: 17, totalValue: 95000000, paymentRate: 76 },
                  { date: '2026-01-10', revenue: 65000000, orders: 19, customers: 15, totalValue: 86000000, paymentRate: 76 },
                  { date: '2026-01-11', revenue: 58000000, orders: 16, customers: 13, totalValue: 77000000, paymentRate: 75 },
                  { date: '2026-01-12', revenue: 55000000, orders: 15, customers: 12, totalValue: 73000000, paymentRate: 75 },
                  { date: '2026-01-13', revenue: 70000000, orders: 20, customers: 17, totalValue: 93000000, paymentRate: 75 },
                  { date: '2026-01-14', revenue: 75000000, orders: 22, customers: 18, totalValue: 99000000, paymentRate: 76 },
                  { date: '2026-01-15', revenue: 80000000, orders: 23, customers: 19, totalValue: 105000000, paymentRate: 76 },
                  { date: '2026-01-16', revenue: 72000000, orders: 21, customers: 17, totalValue: 95000000, paymentRate: 76 },
                  { date: '2026-01-17', revenue: 68000000, orders: 19, customers: 16, totalValue: 90000000, paymentRate: 76 },
                  { date: '2026-01-18', revenue: 62000000, orders: 18, customers: 15, totalValue: 82000000, paymentRate: 76 },
                  { date: '2026-01-19', revenue: 58000000, orders: 16, customers: 14, totalValue: 77000000, paymentRate: 75 },
                  { date: '2026-01-20', revenue: 75000000, orders: 22, customers: 18, totalValue: 99000000, paymentRate: 76 },
                  { date: '2026-01-21', revenue: 78000000, orders: 23, customers: 19, totalValue: 103000000, paymentRate: 76 },
                  { date: '2026-01-22', revenue: 70000000, orders: 20, customers: 17, totalValue: 93000000, paymentRate: 75 },
                  { date: '2026-01-23', revenue: 68000000, orders: 19, customers: 16, totalValue: 89000000, paymentRate: 76 },
                  { date: '2026-01-24', revenue: 72000000, orders: 21, customers: 17, totalValue: 95000000, paymentRate: 76 },
                  { date: '2026-01-25', revenue: 65000000, orders: 18, customers: 15, totalValue: 85000000, paymentRate: 76 },
                  { date: '2026-01-26', revenue: 58000000, orders: 16, customers: 13, totalValue: 77000000, paymentRate: 75 },
                  { date: '2026-01-27', revenue: 82000000, orders: 24, customers: 20, totalValue: 108000000, paymentRate: 76 },
                  { date: '2026-01-28', revenue: 70000000, orders: 20, customers: 17, totalValue: 92000000, paymentRate: 76 },
                  { date: '2026-01-29', revenue: 75000000, orders: 22, customers: 18, totalValue: 98500000, paymentRate: 76 },
                  { date: '2026-01-30', revenue: 68000000, orders: 19, customers: 16, totalValue: 90000000, paymentRate: 76 },
                  { date: '2026-01-31', revenue: 72000000, orders: 21, customers: 17, totalValue: 95000000, paymentRate: 76 }
                ]

                let displayData = monthData
                if (selectedDateRange === 'today') {
                  displayData = todayData
                } else if (selectedDateRange === 'this_week') {
                  displayData = weekData
                }

                const tblMult = getFilterMultiplier(reportDeptFilter, reportTeamFilter, reportEmployeeFilter)
                return displayData.map((rawDay, index) => { const day = { ...rawDay, revenue: Math.round(rawDay.revenue * tblMult), orders: Math.round(rawDay.orders * tblMult), customers: Math.round(rawDay.customers * tblMult), totalValue: Math.round(rawDay.totalValue * tblMult) }; return (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{formatDate(day.date)}</TableCell>
                    <TableCell className="font-bold text-green-600">
                      {formatCurrency(day.revenue)}
                    </TableCell>
                    <TableCell>{day.orders}</TableCell>
                    <TableCell>{day.customers}</TableCell>
                    <TableCell className="font-semibold">
                      {formatCurrency(day.totalValue)}
                    </TableCell>
                    <TableCell>
                      <Badge variant={day.paymentRate >= 75 ? 'default' : 'secondary'}>
                        {day.paymentRate}%
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedDate(day.date)
                          setShowSalesDetailModal(true)
                        }}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                )})
              })()}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Sales Detail Modal */}
      {showSalesDetailModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-6xl max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-bold">Chi tiết doanh số ngày {formatDate(selectedDate)}</h2>
              <Button variant="ghost" size="sm" onClick={() => {
                setShowSalesDetailModal(false)
                setModalSearchTerm('')
              }}>
                <X className="w-5 h-5" />
              </Button>
            </div>

            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      placeholder="Tìm kiếm đơn hàng, khách hàng..."
                      className="pl-10 w-80"
                      value={modalSearchTerm}
                      onChange={(e) => setModalSearchTerm(e.target.value)}
                    />
                  </div>
                  <select className="border border-gray-300 rounded px-3 py-2 text-sm bg-white">
                    <option value="">Phòng sale</option>
                    <option value="ps">PS Phòng sale</option>
                    <option value="sale1">Phòng Sale 1</option>
                    <option value="sale2">Phòng Sale 2</option>
                  </select>
                  <select className="border border-gray-300 rounded px-3 py-2 text-sm bg-white">
                    <option value="">Chọn team</option>
                    <option value="team_a">Team A</option>
                    <option value="team_b">Team B</option>
                    <option value="team_c">Team C</option>
                  </select>
                </div>
                <Button className="bg-green-600 hover:bg-green-700">
                  <Download className="w-4 h-4 mr-2" />
                  Xuất dữ liệu
                </Button>
              </div>

              <div className="overflow-auto max-h-[calc(90vh-220px)]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-16">STT</TableHead>
                      <TableHead>Mã đơn hàng</TableHead>
                      <TableHead>Khách hàng</TableHead>
                      <TableHead>Tổng tiền</TableHead>
                      <TableHead>Chiết khấu (VND)</TableHead>
                      <TableHead>Thực thu (Net)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(() => {
                      const allOrders = [
                        { id: 1, orderCode: 'DH001', customer: 'Nguyễn Văn A', discount: 500000, total: 10000000, net: 9500000 },
                        { id: 2, orderCode: 'DH002', customer: 'Trần Thị B', discount: 0, total: 15000000, net: 15000000 },
                        { id: 3, orderCode: 'DH003', customer: 'Lê Văn C', discount: 1000000, total: 20000000, net: 19000000 },
                        { id: 4, orderCode: 'DH004', customer: 'Phạm Thị D', discount: 200000, total: 8000000, net: 7800000 },
                        { id: 5, orderCode: 'DH005', customer: 'Hoàng Văn E', discount: 0, total: 12000000, net: 12000000 },
                        { id: 6, orderCode: 'DH006', customer: 'Vũ Thị F', discount: 300000, total: 18000000, net: 17700000 },
                        { id: 7, orderCode: 'DH007', customer: 'Đỗ Văn G', discount: 0, total: 9000000, net: 9000000 },
                        { id: 8, orderCode: 'DH008', customer: 'Bùi Thị H', discount: 750000, total: 25000000, net: 24250000 },
                        { id: 9, orderCode: 'DH009', customer: 'Đinh Văn I', discount: 0, total: 11000000, net: 11000000 },
                        { id: 10, orderCode: 'DH010', customer: 'Cao Thị K', discount: 400000, total: 16000000, net: 15600000 }
                      ]

                      const filteredOrders = modalSearchTerm
                        ? allOrders.filter(order =>
                          order.orderCode.toLowerCase().includes(modalSearchTerm.toLowerCase()) ||
                          order.customer.toLowerCase().includes(modalSearchTerm.toLowerCase())
                        )
                        : allOrders

                      return filteredOrders.map((order, index) => (
                        <TableRow key={order.id}>
                          <TableCell>{index + 1}</TableCell>
                          <TableCell className="text-blue-600 font-medium">{order.orderCode}</TableCell>
                          <TableCell>{order.customer}</TableCell>
                          <TableCell className="font-semibold">
                            {formatCurrency(order.total)}
                          </TableCell>
                          <TableCell className="text-orange-600">
                            {order.discount > 0 ? formatCurrency(order.discount) : '0'}
                          </TableCell>
                          <TableCell className="font-bold text-green-600">
                            {formatCurrency(order.net)}
                          </TableCell>
                        </TableRow>
                      ))
                    })()}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )

  // Sales Performance Component
  const SalesPerformanceComponent = () => (
    <div className="space-y-6">
      {/* Header and Filters */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Báo cáo Hiệu suất Sales</h2>
          <p className="text-gray-600">Đánh giá hiệu quả bán hàng của từng sales</p>
        </div>

        <div className="flex items-center space-x-3">
          <select
            value={selectedDateRange}
            onChange={(e) => setSelectedDateRange(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 text-sm bg-white"
          >
            <option value="today">Hôm nay</option>
            <option value="this_week">Tuần này</option>
            <option value="this_month">Tháng này</option>
            <option value="this_quarter">Quý này</option>
            <option value="this_year">Năm này</option>
            <option value="custom">Chọn thời gian</option>
          </select>
          {selectedDateRange === 'custom' && (
            <div className="flex items-center space-x-2">
              <input
                type="date"
                value={customDateRange.start}
                onChange={(e) => setCustomDateRange({ ...customDateRange, start: e.target.value })}
                className="border border-gray-300 rounded px-3 py-2 text-sm bg-white"
              />
              <span className="text-gray-500 text-sm">đến</span>
              <input
                type="date"
                value={customDateRange.end}
                onChange={(e) => setCustomDateRange({ ...customDateRange, end: e.target.value })}
                className="border border-gray-300 rounded px-3 py-2 text-sm bg-white"
              />
            </div>
          )}

          <ReportEmployeeFilter
            selectedDepartment={reportDeptFilter}
            onDepartmentChange={setReportDeptFilter}
            selectedTeam={reportTeamFilter}
            onTeamChange={setReportTeamFilter}
            selectedEmployee={reportEmployeeFilter}
            onEmployeeChange={setReportEmployeeFilter}
          />
        </div>
      </div>

      {/* Performance Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {(() => {
          const allData = getSalesPerformanceData(selectedDateRange)
          const allowedTeams = getFilteredTeamNames(reportDeptFilter, reportTeamFilter)
          const displayData = reportDeptFilter ? allData.filter(s => allowedTeams.includes(s.salesTeam)) : allData

          return (
            <>
              <div className="flex flex-col justify-between rounded-lg px-6 py-5 min-w-[180px] text-white shadow-lg cursor-pointer relative transition-all hover:shadow-xl bg-gradient-to-br from-blue-600 to-blue-400">
                <div className="absolute top-2 right-2">
                  <Info className="w-3.5 h-3.5 text-white/70 hover:text-white cursor-help transition-colors" />
                </div>
                <div>
                  <p className="text-base font-semibold text-white mb-2">Tổng Lead được giao</p>
                  <p className="text-4xl font-extrabold text-white mb-1">
                    {displayData.reduce((acc, s) => acc + s.leadsAssigned, 0)}
                  </p>
                </div>
              </div>

              <div className="flex flex-col justify-between rounded-lg px-6 py-5 min-w-[180px] text-white shadow-lg cursor-pointer relative transition-all hover:shadow-xl bg-gradient-to-br from-green-600 to-green-400">
                <div className="absolute top-2 right-2">
                  <Info className="w-3.5 h-3.5 text-white/70 hover:text-white cursor-help transition-colors" />
                </div>
                <div>
                  <p className="text-base font-semibold text-white mb-2">Tổng đơn chốt</p>
                  <p className="text-4xl font-extrabold text-white mb-1">
                    {displayData.reduce((acc, s) => acc + s.ordersCreated, 0)}
                  </p>
                </div>
              </div>

              <div className="flex flex-col justify-between rounded-lg px-6 py-5 min-w-[180px] text-white shadow-lg cursor-pointer relative transition-all hover:shadow-xl bg-gradient-to-br from-purple-600 to-purple-400">
                <div className="absolute top-2 right-2">
                  <Info className="w-3.5 h-3.5 text-white/70 hover:text-white cursor-help transition-colors" />
                </div>
                <div>
                  <p className="text-base font-semibold text-white mb-2">Tỷ lệ chốt TB</p>
                  <p className="text-4xl font-extrabold text-white mb-1">
                    {Math.round(displayData.reduce((acc, s) => acc + s.conversionRate, 0) / displayData.length)}%
                  </p>
                </div>
              </div>

              <div className="flex flex-col justify-between rounded-lg px-6 py-5 min-w-[180px] text-white shadow-lg cursor-pointer relative transition-all hover:shadow-xl bg-gradient-to-br from-orange-600 to-orange-400">
                <div className="absolute top-2 right-2">
                  <Info className="w-3.5 h-3.5 text-white/70 hover:text-white cursor-help transition-colors" />
                </div>
                <div>
                  <p className="text-base font-semibold text-white mb-2">Tổng doanh số</p>
                  <p className="text-4xl font-extrabold text-white mb-1">
                    {formatCurrency(displayData.reduce((acc, s) => acc + s.revenue, 0))}
                  </p>
                </div>
              </div>
            </>
          )
        })()}
      </div>

      {/* Sales Performance Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Bảng hiệu suất Sales</CardTitle>
              <CardDescription>Chi tiết hiệu quả bán hàng của từng sales</CardDescription>
            </div>
            <Button className="bg-green-600 hover:bg-green-700 text-white">
              <Download className="w-4 h-4 mr-2" />
              Xuất Excel
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Sales</TableHead>
                <TableHead>Team</TableHead>
                <TableHead>Lead được giao</TableHead>
                <TableHead>Đơn chốt</TableHead>
                <TableHead>Tỷ lệ chốt</TableHead>
                <TableHead>Doanh số</TableHead>
                <TableHead>KPI</TableHead>
                <TableHead>Nguồn Lead</TableHead>
                <TableHead>Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(() => {
                const allPerfData = getSalesPerformanceData(selectedDateRange)
                const perfTeams = getFilteredTeamNames(reportDeptFilter, reportTeamFilter)
                const displayData = reportDeptFilter ? allPerfData.filter(s => perfTeams.includes(s.salesTeam)) : allPerfData
                return displayData.map((sales) => (
                  <TableRow key={sales.id}>
                    <TableCell className="font-medium">{sales.salesPerson}</TableCell>
                    <TableCell>{sales.salesTeam}</TableCell>
                    <TableCell>{sales.leadsAssigned}</TableCell>
                    <TableCell>{sales.ordersCreated}</TableCell>
                    <TableCell>
                      <Badge variant={sales.conversionRate >= 50 ? 'default' : sales.conversionRate >= 30 ? 'secondary' : 'destructive'}>
                        {sales.conversionRate}%
                      </Badge>
                    </TableCell>
                    <TableCell className="font-bold text-green-600">
                      {formatCurrency(sales.revenue)}
                    </TableCell>
                    <TableCell>
                      {sales.kpiTarget && sales.kpiCompletion ? (
                        <div className="space-y-1">
                          <Badge
                            variant={
                              sales.kpiCompletion >= 100 ? 'default' :
                                sales.kpiCompletion >= 80 ? 'secondary' :
                                  'destructive'
                            }
                          >
                            {sales.kpiCompletion}%
                          </Badge>
                          <div className="text-xs text-gray-500">
                            {formatCurrency(sales.kpiTarget)}
                          </div>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400 italic">Chưa có KPI</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="text-xs space-y-1">
                        <div>Zalo: {sales.leadsBySource.zalo}</div>
                        <div>FB: {sales.leadsBySource.facebook}</div>
                        <div>Manual: {sales.leadsBySource.manual}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedSalesForDetail(sales)
                          setShowPerformanceDetailModal(true)
                        }}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              })()}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Performance Detail Modal */}
      {showPerformanceDetailModal && selectedSalesForDetail && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-bold">Chi tiết hiệu suất - {selectedSalesForDetail.salesPerson}</h2>
              <Button variant="ghost" size="sm" onClick={() => setShowPerformanceDetailModal(false)}>
                <X className="w-5 h-5" />
              </Button>
            </div>

            <div className="p-6">
              <div className="flex justify-end mb-6">
                <Button className="bg-green-600 hover:bg-green-700 text-white">
                  <Download className="w-4 h-4 mr-2" />
                  Xuất dữ liệu
                </Button>
              </div>

              <div className="overflow-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-16">STT</TableHead>
                      <TableHead>Nguồn</TableHead>
                      <TableHead>Lead được giao</TableHead>
                      <TableHead>Đơn chốt</TableHead>
                      <TableHead>Tỷ lệ chốt</TableHead>
                      <TableHead>Doanh số</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(() => {
                      const detailData = getPerformanceDetailData(selectedSalesForDetail)
                      const totalRevenue = detailData.reduce((sum, item) => sum + item.revenue, 0)

                      return (
                        <>
                          {detailData.map((item) => (
                            <TableRow key={item.id}>
                              <TableCell>{item.id}</TableCell>
                              <TableCell>{item.source}</TableCell>
                              <TableCell>{item.leads}</TableCell>
                              <TableCell>{item.orders}</TableCell>
                              <TableCell>{item.conversionRate.toFixed(1)}%</TableCell>
                              <TableCell className="font-bold text-green-600">
                                {formatCurrency(item.revenue)}
                              </TableCell>
                            </TableRow>
                          ))}
                          <TableRow className="bg-gray-50 font-semibold">
                            <TableCell colSpan={4}></TableCell>
                            <TableCell>Tổng doanh số:</TableCell>
                            <TableCell className="font-bold text-green-600">
                              {formatCurrency(totalRevenue)}
                            </TableCell>
                          </TableRow>
                        </>
                      )
                    })()}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )

  // Performance Detail Modal Helper
  const getPerformanceDetailData = (sales: SalesPerformanceReport) => {
    const sourceMap = {
      'Facebook Ads': { leads: 0, orders: 0, revenue: 0 },
      'Google Ads': { leads: 0, orders: 0, revenue: 0 },
      'Zalo': { leads: 0, orders: 0, revenue: 0 },
      'Website': { leads: 0, orders: 0, revenue: 0 },
      'Giới thiệu': { leads: 0, orders: 0, revenue: 0 }
    }

    // Calculate based on leadsBySource ratio
    const totalLeads = sales.leadsAssigned
    const totalOrders = sales.ordersCreated
    const totalRevenue = sales.revenue

    // Facebook Ads: 40% of leads
    const fbRatio = 0.40
    sourceMap['Facebook Ads'].leads = Math.round(totalLeads * fbRatio)
    sourceMap['Facebook Ads'].orders = Math.round(totalOrders * fbRatio)
    sourceMap['Facebook Ads'].revenue = Math.round(totalRevenue * fbRatio)

    // Google Ads: 28% of leads
    const gaRatio = 0.28
    sourceMap['Google Ads'].leads = Math.round(totalLeads * gaRatio)
    sourceMap['Google Ads'].orders = Math.round(totalOrders * gaRatio)
    sourceMap['Google Ads'].revenue = Math.round(totalRevenue * gaRatio)

    // Zalo: 20% of leads
    const zaloRatio = 0.20
    sourceMap['Zalo'].leads = Math.round(totalLeads * zaloRatio)
    sourceMap['Zalo'].orders = Math.round(totalOrders * zaloRatio)
    sourceMap['Zalo'].revenue = Math.round(totalRevenue * zaloRatio)

    // Website: 8% of leads
    const webRatio = 0.08
    sourceMap['Website'].leads = Math.round(totalLeads * webRatio)
    sourceMap['Website'].orders = Math.round(totalOrders * webRatio)
    sourceMap['Website'].revenue = Math.round(totalRevenue * webRatio)

    // Giới thiệu: 4% of leads
    const refRatio = 0.04
    sourceMap['Giới thiệu'].leads = Math.round(totalLeads * refRatio)
    sourceMap['Giới thiệu'].orders = Math.round(totalOrders * refRatio)
    sourceMap['Giới thiệu'].revenue = Math.round(totalRevenue * refRatio)

    return Object.entries(sourceMap).map((entry, idx) => ({
      id: idx + 1,
      source: entry[0],
      leads: entry[1].leads,
      orders: entry[1].orders,
      conversionRate: entry[1].leads > 0 ? Math.round((entry[1].orders / entry[1].leads) * 100 * 10) / 10 : 0,
      revenue: entry[1].revenue
    }))
  }

  // Helper function to detect bottleneck
  const detectBottleneck = (stage: SalesProcessAnalysis): boolean => {
    // Bottleneck criteria: conversion rate < 50% and drop rate > 50%
    return stage.conversionRate < 50 && stage.dropoffRate > 50
  }

  // Function to generate process data based on filters
  const getProcessData = (period: string, department: string, team: string): SalesProcessAnalysis[] => {
    // Base data configurations for different scenarios
    const dataConfigurations: { [key: string]: SalesProcessAnalysis[] } = {
      // Scenario with bottleneck (default)
      'bottleneck': [
        { id: '1', stage: 'Mới', leadsCount: 898, conversionRate: 100, averageTimeInStage: 0, dropoffRate: 0 },
        { id: '2', stage: 'Đã liên hệ', leadsCount: 39, conversionRate: 4.3, averageTimeInStage: 2.5, dropoffRate: 95.7 },
        { id: '3', stage: 'Đủ điều kiện', leadsCount: 35, conversionRate: 89.7, averageTimeInStage: 1.2, dropoffRate: 10.3 },
        { id: '4', stage: 'Đang tư vấn', leadsCount: 28, conversionRate: 80, averageTimeInStage: 3.8, dropoffRate: 20 },
        { id: '5', stage: 'Báo giá', leadsCount: 22, conversionRate: 78.6, averageTimeInStage: 2.1, dropoffRate: 21.4 },
        { id: '6', stage: 'Chốt deal', leadsCount: 18, conversionRate: 81.8, averageTimeInStage: 1.5, dropoffRate: 18.2 }
      ],
      // Good performance scenario
      'good': [
        { id: '1', stage: 'Mới', leadsCount: 650, conversionRate: 100, averageTimeInStage: 0, dropoffRate: 0 },
        { id: '2', stage: 'Đã liên hệ', leadsCount: 520, conversionRate: 80, averageTimeInStage: 1.2, dropoffRate: 20 },
        { id: '3', stage: 'Đủ điều kiện', leadsCount: 468, conversionRate: 90, averageTimeInStage: 0.8, dropoffRate: 10 },
        { id: '4', stage: 'Đang tư vấn', leadsCount: 397, conversionRate: 85, averageTimeInStage: 2.5, dropoffRate: 15 },
        { id: '5', stage: 'Báo giá', leadsCount: 337, conversionRate: 85, averageTimeInStage: 1.8, dropoffRate: 15 },
        { id: '6', stage: 'Chốt deal', leadsCount: 270, conversionRate: 80, averageTimeInStage: 2.2, dropoffRate: 20 }
      ],
      // Multiple bottlenecks scenario
      'critical': [
        { id: '1', stage: 'Mới', leadsCount: 1200, conversionRate: 100, averageTimeInStage: 0, dropoffRate: 0 },
        { id: '2', stage: 'Đã liên hệ', leadsCount: 240, conversionRate: 20, averageTimeInStage: 3.5, dropoffRate: 80 },
        { id: '3', stage: 'Đủ điều kiện', leadsCount: 192, conversionRate: 80, averageTimeInStage: 1.5, dropoffRate: 20 },
        { id: '4', stage: 'Đang tư vấn', leadsCount: 77, conversionRate: 40, averageTimeInStage: 5.2, dropoffRate: 60 },
        { id: '5', stage: 'Báo giá', leadsCount: 62, conversionRate: 80, averageTimeInStage: 2.8, dropoffRate: 20 },
        { id: '6', stage: 'Chốt deal', leadsCount: 50, conversionRate: 80, averageTimeInStage: 1.8, dropoffRate: 20 }
      ],
      // Average performance
      'average': [
        { id: '1', stage: 'Mới', leadsCount: 450, conversionRate: 100, averageTimeInStage: 0, dropoffRate: 0 },
        { id: '2', stage: 'Đã liên hệ', leadsCount: 315, conversionRate: 70, averageTimeInStage: 1.8, dropoffRate: 30 },
        { id: '3', stage: 'Đủ điều kiện', leadsCount: 252, conversionRate: 80, averageTimeInStage: 1.2, dropoffRate: 20 },
        { id: '4', stage: 'Đang tư vấn', leadsCount: 189, conversionRate: 75, averageTimeInStage: 3.2, dropoffRate: 25 },
        { id: '5', stage: 'Báo giá', leadsCount: 142, conversionRate: 75, averageTimeInStage: 2.5, dropoffRate: 25 },
        { id: '6', stage: 'Chốt deal', leadsCount: 99, conversionRate: 70, averageTimeInStage: 2.8, dropoffRate: 30 }
      ]
    }

    // Determine which data to return based on filters
    let scenario = 'bottleneck'

    // Logic to determine scenario based on filters
    if (period === 'this_week' && department === 'sale_department_1') {
      scenario = 'good'
    } else if (period === 'this_month' && team === 'team_c') {
      scenario = 'critical'
    } else if (period === 'today' || (period === 'this_week' && team === 'team_a')) {
      scenario = 'average'
    } else if (department === 'sale_department_2' || team === 'team_b') {
      scenario = 'bottleneck'
    } else if (period === 'this_quarter') {
      scenario = 'good'
    } else if (period === 'this_year') {
      scenario = 'average'
    }

    return dataConfigurations[scenario]
  }

  // Sales Process Component
  const SalesProcessComponent = () => {
    const [processFilterPeriod, setProcessFilterPeriod] = useState('this_month')
    const [processCustomDate, setProcessCustomDate] = useState({ start: '', end: '' })
    const [currentProcessData, setCurrentProcessData] = useState<SalesProcessAnalysis[]>(sampleProcessAnalysis)

    const handleApplyFilter = () => {
      const newData = getProcessData(processFilterPeriod, reportDeptFilter, reportTeamFilter)
      setCurrentProcessData(newData)
    }

    // Auto-apply filters when they change
    useEffect(() => {
      handleApplyFilter()
    }, [processFilterPeriod, reportDeptFilter, reportTeamFilter])

    const bottlenecks = currentProcessData.filter(detectBottleneck)

    return (
      <div className="space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Phân tích Quy trình Bán hàng</h2>
            <p className="text-gray-600">Theo dõi hiệu quả chuyển đổi qua các giai đoạn</p>
          </div>

          <div className="flex items-center space-x-3">
            <select
              className="border border-gray-300 rounded px-3 py-2 text-sm bg-white"
              value={processFilterPeriod}
              onChange={(e) => setProcessFilterPeriod(e.target.value)}
            >
              <option value="today">Hôm nay</option>
              <option value="this_week">Tuần này</option>
              <option value="this_month">Tháng này</option>
              <option value="this_quarter">Quý này</option>
              <option value="this_year">Năm này</option>
              <option value="custom">Chọn thời gian</option>
            </select>
            {processFilterPeriod === 'custom' && (
              <div className="flex items-center space-x-2">
                <input
                  type="date"
                  value={processCustomDate.start}
                  onChange={(e) => setProcessCustomDate({ ...processCustomDate, start: e.target.value })}
                  className="border border-gray-300 rounded px-3 py-2 text-sm bg-white"
                />
                <span className="text-gray-500 text-sm">đến</span>
                <input
                  type="date"
                  value={processCustomDate.end}
                  onChange={(e) => setProcessCustomDate({ ...processCustomDate, end: e.target.value })}
                  className="border border-gray-300 rounded px-3 py-2 text-sm bg-white"
                />
              </div>
            )}
            <ReportEmployeeFilter
              selectedDepartment={reportDeptFilter}
              onDepartmentChange={setReportDeptFilter}
              selectedTeam={reportTeamFilter}
              onTeamChange={setReportTeamFilter}
              selectedEmployee={reportEmployeeFilter}
              onEmployeeChange={setReportEmployeeFilter}
            />
            <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all duration-300 ease-[cubic-bezier(0.645,0.045,0.355,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(62,121,247,0.2)] focus-visible:ring-offset-0 disabled:pointer-events-none disabled:opacity-50 border border-[#3e79f7] rounded-[10px] hover:border-[#699dff] active:bg-[#2a59d1] active:border-[#2a59d1] h-10 px-4 py-[8.5px] bg-green-600 hover:bg-green-700 text-white">
              <Download className="w-4 h-4 mr-2" />
              Xuất Excel
            </button>
          </div>
        </div>

        {/* Funnel Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Phễu chuyển đổi</CardTitle>
            <CardDescription>Số lượng leads qua các giai đoạn bán hàng</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {(() => {
                const procMult = getFilterMultiplier(reportDeptFilter, reportTeamFilter, reportEmployeeFilter)
                return currentProcessData.map((stage, index) => {
                const fs = { ...stage, leadsCount: Math.round(stage.leadsCount * procMult) }
                const isBottleneck = detectBottleneck(fs)
                return (
                  <div key={fs.id} className="relative">
                    <div className={`flex items-center justify-between p-4 rounded-lg ${isBottleneck
                        ? 'border-2 border-red-500 bg-red-50'
                        : 'border border-gray-200'
                      }`}>
                      <div className="flex items-center space-x-4">
                        <div className="text-2xl font-bold text-blue-600">{index + 1}</div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold">{fs.stage}</h3>
                            {isBottleneck && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                                <AlertTriangle className="w-3 h-3 mr-1" />
                                Điểm tắc nghẽn
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-500">{fs.leadsCount} leads</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-6">
                        {/* Tỷ lệ chuyển đổi */}
                        <div className="text-right min-w-[140px]">
                          <p className="font-semibold text-sm mb-1">Tỷ lệ chuyển đổi</p>
                          <div className="flex items-center gap-2">
                            <div className="flex-1">
                              <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div
                                  className={`absolute top-0 left-0 h-full rounded-full transition-all duration-500 ${fs.conversionRate >= 80 ? 'bg-green-500' :
                                      fs.conversionRate >= 60 ? 'bg-blue-500' :
                                        fs.conversionRate >= 40 ? 'bg-yellow-500' :
                                          fs.conversionRate >= 20 ? 'bg-orange-500' :
                                            'bg-red-500'
                                    }`}
                                  style={{ width: `${fs.conversionRate}%` }}
                                ></div>
                              </div>
                            </div>
                            <p className="text-base font-bold text-gray-900 min-w-[45px]">{fs.conversionRate}%</p>
                          </div>
                        </div>

                        {/* Thời gian xử lý trung bình */}
                        <div className="text-right min-w-[180px]">
                          <p className="font-semibold text-sm mb-1">Thời gian xử lý trung bình</p>
                          <p className="text-base font-bold text-gray-900">{fs.averageTimeInStage} ngày</p>
                        </div>

                        {/* Tỷ lệ rớt */}
                        <div className="text-right min-w-[120px]">
                          <p className="font-semibold text-sm mb-1">Tỷ lệ rớt</p>
                          <div className="flex items-center gap-2">
                            <div className="flex-1">
                              <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div
                                  className={`absolute top-0 left-0 h-full rounded-full transition-all duration-500 ${fs.dropoffRate >= 80 ? 'bg-red-500' :
                                      fs.dropoffRate >= 60 ? 'bg-orange-500' :
                                        fs.dropoffRate >= 40 ? 'bg-yellow-500' :
                                          fs.dropoffRate >= 20 ? 'bg-blue-500' :
                                            'bg-green-500'
                                    }`}
                                  style={{ width: `${fs.dropoffRate}%` }}
                                ></div>
                              </div>
                            </div>
                            <p className="text-base font-bold text-gray-900 min-w-[45px]">{fs.dropoffRate}%</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })
              })()}
            </div>

            {/* Bottleneck Warning */}
            {bottlenecks.length > 0 && (
              <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="font-semibold text-red-900 mb-1">
                      Phát hiện Điểm tắc nghẽn nghiêm trọng
                    </h4>
                    <p className="text-sm text-red-800">
                      {bottlenecks.map((stage, index) => (
                        <span key={stage.id}>
                          Giai đoạn &quot;{stage.stage}&quot; có tỷ lệ chuyển đổi chỉ {stage.conversionRate}% ({stage.dropoffRate}% leads bị mất).
                          {index < bottlenecks.length - 1 && ' '}
                        </span>
                      ))}
                      {' '}Đề xuất: Kiểm tra quy trình liên hệ, tăng tốc độ phản hồi lead mới.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    )
  }

  // Function to generate lead source data based on filters
  const getLeadSourceData = (period: string, department: string, team: string) => {
    // Data configurations for different scenarios
    const dataConfigurations: { [key: string]: any[] } = {
      'default': [
        { source: 'Facebook', leads: 8, conversion: 29.6, revenue: 6000000, quality: 85, roi: 150 },
        { source: 'Zalo', leads: 45, conversion: 42, revenue: 185000000, quality: 92, roi: 180 },
        { source: 'Nhập tay', leads: 11, conversion: 55, revenue: 80000000, quality: 78, roi: 220 }
      ],
      'good_performance': [
        { source: 'Facebook', leads: 125, conversion: 68, revenue: 450000000, quality: 95, roi: 280 },
        { source: 'Zalo', leads: 210, conversion: 72, revenue: 890000000, quality: 97, roi: 320 },
        { source: 'Nhập tay', leads: 85, conversion: 80, revenue: 380000000, quality: 92, roi: 350 }
      ],
      'low_quality': [
        { source: 'Facebook', leads: 5, conversion: 15, revenue: 2000000, quality: 45, roi: 80 },
        { source: 'Zalo', leads: 18, conversion: 28, revenue: 8500000, quality: 55, roi: 95 },
        { source: 'Nhập tay', leads: 3, conversion: 33, revenue: 1500000, quality: 60, roi: 110 }
      ],
      'mixed': [
        { source: 'Facebook', leads: 52, conversion: 48, revenue: 125000000, quality: 78, roi: 185 },
        { source: 'Zalo', leads: 98, conversion: 55, revenue: 420000000, quality: 88, roi: 210 },
        { source: 'Nhập tay', leads: 35, conversion: 62, revenue: 180000000, quality: 82, roi: 240 }
      ]
    }

    // Determine which data to return based on filters
    let scenario = 'default'

    if (period === 'this_quarter' || (period === 'this_month' && department === 'sale_department_1')) {
      scenario = 'good_performance'
    } else if (period === 'today' || (department === 'sale_department_3' && team === 'team_d')) {
      scenario = 'low_quality'
    } else if (period === 'this_week' || team === 'team_b') {
      scenario = 'mixed'
    }

    return dataConfigurations[scenario]
  }

  // Lead Source Component
  const LeadSourceComponent = () => {
    const [sourceFilterPeriod, setSourceFilterPeriod] = useState('this_month')
    const [sourceCustomDate, setSourceCustomDate] = useState({ start: '', end: '' })
    const [currentSourceData, setCurrentSourceData] = useState(getLeadSourceData('this_month', '', ''))

    const handleApplySourceFilter = () => {
      const newData = getLeadSourceData(sourceFilterPeriod, reportDeptFilter, reportTeamFilter)
      setCurrentSourceData(newData)
    }

    // Auto-apply filters when they change
    useEffect(() => {
      handleApplySourceFilter()
    }, [sourceFilterPeriod, reportDeptFilter, reportTeamFilter])

    return (
      <div className="space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Báo cáo Nguồn Lead</h2>
            <p className="text-gray-600">Phân tích hiệu quả các kênh marketing</p>
          </div>

          <div className="flex items-center space-x-3">
            <select
              className="border border-gray-300 rounded px-3 py-2 text-sm bg-white"
              value={sourceFilterPeriod}
              onChange={(e) => setSourceFilterPeriod(e.target.value)}
            >
              <option value="today">Hôm nay</option>
              <option value="this_week">Tuần này</option>
              <option value="this_month">Tháng này</option>
              <option value="this_quarter">Quý này</option>
              <option value="this_year">Năm này</option>
              <option value="custom">Chọn thời gian</option>
            </select>
            {sourceFilterPeriod === 'custom' && (
              <div className="flex items-center space-x-2">
                <input
                  type="date"
                  value={sourceCustomDate.start}
                  onChange={(e) => setSourceCustomDate({ ...sourceCustomDate, start: e.target.value })}
                  className="border border-gray-300 rounded px-3 py-2 text-sm bg-white"
                />
                <span className="text-gray-500 text-sm">đến</span>
                <input
                  type="date"
                  value={sourceCustomDate.end}
                  onChange={(e) => setSourceCustomDate({ ...sourceCustomDate, end: e.target.value })}
                  className="border border-gray-300 rounded px-3 py-2 text-sm bg-white"
                />
              </div>
            )}
            <ReportEmployeeFilter
              selectedDepartment={reportDeptFilter}
              onDepartmentChange={setReportDeptFilter}
              selectedTeam={reportTeamFilter}
              onTeamChange={setReportTeamFilter}
              selectedEmployee={reportEmployeeFilter}
              onEmployeeChange={setReportEmployeeFilter}
            />
            <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all duration-300 ease-[cubic-bezier(0.645,0.045,0.355,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(62,121,247,0.2)] focus-visible:ring-offset-0 disabled:pointer-events-none disabled:opacity-50 border border-[#3e79f7] rounded-[10px] hover:border-[#699dff] active:bg-[#2a59d1] active:border-[#2a59d1] h-10 px-4 py-[8.5px] bg-green-600 hover:bg-green-700 text-white">
              <Download className="w-4 h-4 mr-2" />
              Xuất Excel
            </button>
          </div>
        </div>

        {/* Source Performance */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {(() => {
            const srcMult = getFilterMultiplier(reportDeptFilter, reportTeamFilter, reportEmployeeFilter)
            return currentSourceData.map((source) => {
              const fs = { ...source, leads: Math.round(source.leads * srcMult), revenue: Math.round(source.revenue * srcMult) }
              return (
            <Card key={source.source} className="border border-[#e6ebf1]">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-lg text-[#455560]">{source.source}</h3>
                  <span className="inline-flex items-center rounded px-2 py-0.5 text-xs font-medium bg-green-50 text-green-700">
                    {source.conversion}% chuyển đổi
                  </span>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Số leads:</span>
                    <span className="font-bold text-gray-900">{fs.leads}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Doanh số:</span>
                    <span className="font-bold text-gray-900">{formatCurrency(fs.revenue)}</span>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Chất lượng lead:</span>
                      <span className="font-bold text-gray-900">{source.quality}%</span>
                    </div>
                    <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`absolute top-0 left-0 h-full rounded-full transition-all duration-500 ${source.quality >= 90 ? 'bg-green-500' :
                            source.quality >= 80 ? 'bg-green-500' :
                              source.quality >= 70 ? 'bg-yellow-500' :
                                source.quality >= 60 ? 'bg-orange-500' :
                                  'bg-red-500'
                          }`}
                        style={{ width: `${source.quality}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
            })
          })()}
        </div>
      </div>
    )
  }

  // Cancellation Report Component  
  const CancellationReportComponent = () => (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Báo cáo Tỷ lệ Hủy đơn</h2>
          <p className="text-gray-600">Phân tích các đơn hàng bị hủy và nguyên nhân</p>
        </div>

        <div className="flex items-center space-x-3">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Xuất Excel
          </Button>
        </div>
      </div>

      {/* Cancellation Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="flex flex-col justify-between rounded-lg px-6 py-5 min-w-[180px] text-white shadow-lg cursor-pointer relative transition-all hover:shadow-xl bg-gradient-to-br from-red-600 to-red-400">
          <div className="absolute top-2 right-2">
            <Info className="w-3.5 h-3.5 text-white/70 hover:text-white cursor-help transition-colors" />
          </div>
          <div>
            <p className="text-base font-semibold text-white mb-2">Đơn hủy</p>
            <p className="text-4xl font-extrabold text-white mb-1">12</p>
          </div>
        </div>

        <div className="flex flex-col justify-between rounded-lg px-6 py-5 min-w-[180px] text-white shadow-lg cursor-pointer relative transition-all hover:shadow-xl bg-gradient-to-br from-red-600 to-red-400">
          <div className="absolute top-2 right-2">
            <Info className="w-3.5 h-3.5 text-white/70 hover:text-white cursor-help transition-colors" />
          </div>
          <div>
            <p className="text-base font-semibold text-white mb-2">Tỷ lệ hủy</p>
            <p className="text-4xl font-extrabold text-white mb-1">8.7%</p>
          </div>
        </div>

        <div className="flex flex-col justify-between rounded-lg px-6 py-5 min-w-[180px] text-white shadow-lg cursor-pointer relative transition-all hover:shadow-xl bg-gradient-to-br from-red-600 to-red-400">
          <div className="absolute top-2 right-2">
            <Info className="w-3.5 h-3.5 text-white/70 hover:text-white cursor-help transition-colors" />
          </div>
          <div>
            <p className="text-base font-semibold text-white mb-2">Giá trị mất</p>
            <p className="text-4xl font-extrabold text-white mb-1">{formatCurrency(45000000)}</p>
          </div>
        </div>

        <div className="flex flex-col justify-between rounded-lg px-6 py-5 min-w-[180px] text-white shadow-lg cursor-pointer relative transition-all hover:shadow-xl bg-gradient-to-br from-gray-600 to-gray-400">
          <div className="absolute top-2 right-2">
            <Info className="w-3.5 h-3.5 text-white/70 hover:text-white cursor-help transition-colors" />
          </div>
          <div>
            <p className="text-base font-semibold text-white mb-2">Lý do chính</p>
            <p className="text-3xl font-extrabold text-white mb-1">Khách hủy</p>
          </div>
        </div>
      </div>

      {/* Cancellation Reasons */}
      <Card>
        <CardHeader>
          <CardTitle>Phân tích lý do hủy đơn</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { reason: 'Khách hủy', count: 7, percentage: 58, color: 'red' },
              { reason: 'Sai hợp đồng', count: 3, percentage: 25, color: 'yellow' },
              { reason: 'Chưa thanh toán', count: 2, percentage: 17, color: 'blue' }
            ].map((item) => (
              <div key={item.reason} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full bg-${item.color}-500`}></div>
                  <span className="font-medium">{item.reason}</span>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="font-bold">{item.count} đơn</span>
                  <span className="text-sm text-gray-500">{item.percentage}%</span>
                  <Progress value={item.percentage} className="w-20" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )

  // Function to generate customer data based on filters
  const getCustomerData = (period: string, department: string, team: string) => {
    const dataConfigurations: { [key: string]: any } = {
      'default': {
        stats: {
          total: 486,
          enterprise: 156,
          individual: 307,
          new: 23,
          avgValue: 5200000
        },
        retention: {
          returnRate: 39,
          returnChange: 5.2,
          churnRate: 8.5,
          churnChange: -2.1,
          avgFrequency: 2.3,
          frequencyChange: 8,
          frequency1: 298,
          frequency2to5: 152,
          frequency5plus: 39
        },
        newVsReturning: {
          newCustomers: 45,
          newChange: 15,
          returningCustomers: 82,
          returningChange: 8,
          newRevenuePct: 35,
          returningRevenuePct: 65
        },
        topCustomers: [
          { rank: 1, name: 'Công ty ABC Corp', segment: 'VIP', orders: 24, frequency: '2.4/tháng', lastPurchase: '5 ngày', spent: 320000000 },
          { rank: 2, name: 'Tập đoàn XYZ', segment: 'VIP', orders: 18, frequency: '1.8/tháng', lastPurchase: '12 ngày', spent: 285000000 },
          { rank: 3, name: 'Công ty DEF Ltd', segment: 'VIP', orders: 15, frequency: '1.5/tháng', lastPurchase: '8 ngày', spent: 245000000 },
          { rank: 4, name: 'Nguyễn Văn Minh', segment: 'DN', orders: 12, frequency: '1.2/tháng', lastPurchase: '15 ngày', spent: 180000000 },
          { rank: 5, name: 'Công ty GHI', segment: 'DN', orders: 10, frequency: '1.0/tháng', lastPurchase: '22 ngày', spent: 165000000 }
        ]
      },
      'high_performance': {
        stats: {
          total: 850,
          enterprise: 280,
          individual: 520,
          new: 50,
          avgValue: 8500000
        },
        retention: {
          returnRate: 58,
          returnChange: 12.5,
          churnRate: 4.2,
          churnChange: -5.8,
          avgFrequency: 3.8,
          frequencyChange: 18,
          frequency1: 180,
          frequency2to5: 420,
          frequency5plus: 250
        },
        newVsReturning: {
          newCustomers: 95,
          newChange: 28,
          returningCustomers: 185,
          returningChange: 22,
          newRevenuePct: 25,
          returningRevenuePct: 75
        },
        topCustomers: [
          { rank: 1, name: 'Tập đoàn Hòa Phát', segment: 'VIP', orders: 48, frequency: '4.8/tháng', lastPurchase: '2 ngày', spent: 850000000 },
          { rank: 2, name: 'Công ty Vinamilk', segment: 'VIP', orders: 42, frequency: '4.2/tháng', lastPurchase: '3 ngày', spent: 720000000 },
          { rank: 3, name: 'FPT Corporation', segment: 'VIP', orders: 38, frequency: '3.8/tháng', lastPurchase: '5 ngày', spent: 680000000 },
          { rank: 4, name: 'Viettel Group', segment: 'VIP', orders: 35, frequency: '3.5/tháng', lastPurchase: '7 ngày', spent: 650000000 },
          { rank: 5, name: 'Masan Group', segment: 'VIP', orders: 32, frequency: '3.2/tháng', lastPurchase: '8 ngày', spent: 580000000 }
        ]
      },
      'low_activity': {
        stats: {
          total: 280,
          enterprise: 80,
          individual: 185,
          new: 15,
          avgValue: 3200000
        },
        retention: {
          returnRate: 22,
          returnChange: -8.5,
          churnRate: 18.5,
          churnChange: 6.2,
          avgFrequency: 1.5,
          frequencyChange: -12,
          frequency1: 220,
          frequency2to5: 50,
          frequency5plus: 10
        },
        newVsReturning: {
          newCustomers: 28,
          newChange: -5,
          returningCustomers: 38,
          returningChange: -12,
          newRevenuePct: 45,
          returningRevenuePct: 55
        },
        topCustomers: [
          { rank: 1, name: 'Công ty TNHH An Phát', segment: 'DN', orders: 8, frequency: '0.8/tháng', lastPurchase: '28 ngày', spent: 85000000 },
          { rank: 2, name: 'Trần Văn Bình', segment: 'DN', orders: 6, frequency: '0.6/tháng', lastPurchase: '32 ngày', spent: 65000000 },
          { rank: 3, name: 'Công ty Minh Châu', segment: 'DN', orders: 5, frequency: '0.5/tháng', lastPurchase: '35 ngày', spent: 48000000 },
          { rank: 4, name: 'Lê Thị Hoa', segment: 'DN', orders: 4, frequency: '0.4/tháng', lastPurchase: '40 ngày', spent: 32000000 },
          { rank: 5, name: 'Nguyễn Đức Long', segment: 'DN', orders: 3, frequency: '0.3/tháng', lastPurchase: '45 ngày', spent: 28000000 }
        ]
      },
      'mixed': {
        stats: {
          total: 620,
          enterprise: 195,
          individual: 400,
          new: 25,
          avgValue: 6800000
        },
        retention: {
          returnRate: 45,
          returnChange: 3.2,
          churnRate: 10.5,
          churnChange: -1.5,
          avgFrequency: 2.8,
          frequencyChange: 5,
          frequency1: 250,
          frequency2to5: 280,
          frequency5plus: 90
        },
        newVsReturning: {
          newCustomers: 68,
          newChange: 12,
          returningCustomers: 125,
          returningChange: 8,
          newRevenuePct: 30,
          returningRevenuePct: 70
        },
        topCustomers: [
          { rank: 1, name: 'Công ty Thiên Long', segment: 'VIP', orders: 32, frequency: '3.2/tháng', lastPurchase: '6 ngày', spent: 480000000 },
          { rank: 2, name: 'Phạm Văn Nam', segment: 'VIP', orders: 28, frequency: '2.8/tháng', lastPurchase: '9 ngày', spent: 420000000 },
          { rank: 3, name: 'Công ty Hoàng Gia', segment: 'DN', orders: 22, frequency: '2.2/tháng', lastPurchase: '12 ngày', spent: 350000000 },
          { rank: 4, name: 'Võ Thị Mai', segment: 'DN', orders: 18, frequency: '1.8/tháng', lastPurchase: '18 ngày', spent: 280000000 },
          { rank: 5, name: 'Công ty Bảo An', segment: 'DN', orders: 15, frequency: '1.5/tháng', lastPurchase: '20 ngày', spent: 240000000 }
        ]
      }
    }

    // Determine which data to return based on filters
    let scenario = 'default'

    if (period === 'this_quarter' || (period === 'this_month' && department === 'sale_department_1')) {
      scenario = 'high_performance'
    } else if (period === 'today' || (department === 'sale_department_3' && team === 'team_d')) {
      scenario = 'low_activity'
    } else if (period === 'this_week' || team === 'team_b') {
      scenario = 'mixed'
    } else if (department === 'sale_department_2' || team === 'team_c') {
      scenario = 'default'
    }

    return dataConfigurations[scenario]
  }

  // Customer Report Component
  const CustomerReportComponent = () => {
    const [customerFilterPeriod, setCustomerFilterPeriod] = useState('this_month')
    const [customerCustomDate, setCustomerCustomDate] = useState({ start: '', end: '' })
    const [selectedCustomer, setSelectedCustomer] = useState<any>(null)
    const [isOrderModalOpen, setIsOrderModalOpen] = useState(false)
    const [currentCustomerData, setCurrentCustomerData] = useState(getCustomerData('this_month', '', ''))

    const handleApplyCustomerFilter = () => {
      const newData = getCustomerData(customerFilterPeriod, reportDeptFilter, reportTeamFilter)
      setCurrentCustomerData(newData)
    }

    // Auto-apply filters when they change
    useEffect(() => {
      handleApplyCustomerFilter()
    }, [customerFilterPeriod, reportDeptFilter, reportTeamFilter])

    const handleViewCustomerOrders = (customer: any) => {
      setSelectedCustomer(customer)
      setIsOrderModalOpen(true)
    }

    // Sample order data for selected customer
    const getCustomerOrders = (customerName: string) => {
      return [
        { orderCode: 'DH001', total: 50000000, paymentMethod: 'Chuyển khoản', product: 'Sản phẩm A, Sản phẩm B' },
        { orderCode: 'DH002', total: 35000000, paymentMethod: 'Tiền mặt', product: 'Sản phẩm C' },
        { orderCode: 'DH003', total: 25000000, paymentMethod: 'Chuyển khoản', product: 'Sản phẩm D, Sản phẩm E, Sản phẩm F' },
        { orderCode: 'DH004', total: 10000000, paymentMethod: 'Ví điện tử', product: 'Sản phẩm G' },
        { orderCode: 'DH005', total: 5000000, paymentMethod: 'Chuyển khoản', product: 'Sản phẩm H, Sản phẩm I' }
      ]
    }

    return (
      <div className="space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Báo cáo Khách hàng</h2>
            <p className="text-gray-600">Phân tích hành vi và giá trị khách hàng</p>
          </div>

          <div className="flex items-center space-x-3">
            <select
              className="border border-gray-300 rounded px-3 py-2 text-sm bg-white"
              value={customerFilterPeriod}
              onChange={(e) => setCustomerFilterPeriod(e.target.value)}
            >
              <option value="today">Hôm nay</option>
              <option value="this_week">Tuần này</option>
              <option value="this_month">Tháng này</option>
              <option value="this_quarter">Quý này</option>
              <option value="this_year">Năm này</option>
              <option value="custom">Chọn thời gian</option>
            </select>
            {customerFilterPeriod === 'custom' && (
              <div className="flex items-center space-x-2">
                <input
                  type="date"
                  value={customerCustomDate.start}
                  onChange={(e) => setCustomerCustomDate({ ...customerCustomDate, start: e.target.value })}
                  className="border border-gray-300 rounded px-3 py-2 text-sm bg-white"
                />
                <span className="text-gray-500 text-sm">đến</span>
                <input
                  type="date"
                  value={customerCustomDate.end}
                  onChange={(e) => setCustomerCustomDate({ ...customerCustomDate, end: e.target.value })}
                  className="border border-gray-300 rounded px-3 py-2 text-sm bg-white"
                />
              </div>
            )}
            <ReportEmployeeFilter
              selectedDepartment={reportDeptFilter}
              onDepartmentChange={setReportDeptFilter}
              selectedTeam={reportTeamFilter}
              onTeamChange={setReportTeamFilter}
              selectedEmployee={reportEmployeeFilter}
              onEmployeeChange={setReportEmployeeFilter}
            />
            <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all duration-300 ease-[cubic-bezier(0.645,0.045,0.355,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(62,121,247,0.2)] focus-visible:ring-offset-0 disabled:pointer-events-none disabled:opacity-50 border border-[#3e79f7] rounded-[10px] hover:border-[#699dff] active:bg-[#2a59d1] active:border-[#2a59d1] h-10 px-4 py-[8.5px] bg-green-600 hover:bg-green-700 text-white">
              <Download className="w-4 h-4 mr-2" />
              Xuất Excel
            </button>
          </div>
        </div>

        {/* Customer Stats */}
        {(() => {
          const custMult = getFilterMultiplier(reportDeptFilter, reportTeamFilter, reportEmployeeFilter)
          const cStats = {
            total: Math.round(currentCustomerData.stats.total * custMult),
            enterprise: Math.round(currentCustomerData.stats.enterprise * custMult),
            individual: Math.round(currentCustomerData.stats.individual * custMult),
            new: Math.round(currentCustomerData.stats.new * custMult),
            avgValue: Math.round(currentCustomerData.stats.avgValue * custMult)
          }
          return (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="flex flex-col justify-between rounded-lg px-6 py-5 min-w-[180px] text-white shadow-lg cursor-pointer relative transition-all hover:shadow-xl bg-gradient-to-br from-blue-600 to-blue-400">
            <div className="absolute top-2 right-2">
              <Info className="w-3.5 h-3.5 text-white/70 hover:text-white cursor-help transition-colors" />
            </div>
            <div>
              <p className="text-base font-semibold text-white mb-2">Tổng khách hàng</p>
              <p className="text-4xl font-extrabold text-white mb-1">{cStats.total}</p>
            </div>
          </div>

          <div className="flex flex-col justify-between rounded-lg px-6 py-5 min-w-[180px] text-white shadow-lg cursor-pointer relative transition-all hover:shadow-xl bg-gradient-to-br from-purple-600 to-purple-400">
            <div className="absolute top-2 right-2">
              <Info className="w-3.5 h-3.5 text-white/70 hover:text-white cursor-help transition-colors" />
            </div>
            <div>
              <p className="text-base font-semibold text-white mb-2">Khách hàng doanh nghiệp</p>
              <p className="text-4xl font-extrabold text-white mb-1">{cStats.enterprise}</p>
            </div>
          </div>

          <div className="flex flex-col justify-between rounded-lg px-6 py-5 min-w-[180px] text-white shadow-lg cursor-pointer relative transition-all hover:shadow-xl bg-gradient-to-br from-indigo-600 to-indigo-400">
            <div className="absolute top-2 right-2">
              <Info className="w-3.5 h-3.5 text-white/70 hover:text-white cursor-help transition-colors" />
            </div>
            <div>
              <p className="text-base font-semibold text-white mb-2">Khách hàng cá nhân</p>
              <p className="text-4xl font-extrabold text-white mb-1">{cStats.individual}</p>
            </div>
          </div>

          <div className="flex flex-col justify-between rounded-lg px-6 py-5 min-w-[180px] text-white shadow-lg cursor-pointer relative transition-all hover:shadow-xl bg-gradient-to-br from-green-600 to-green-400">
            <div className="absolute top-2 right-2">
              <Info className="w-3.5 h-3.5 text-white/70 hover:text-white cursor-help transition-colors" />
            </div>
            <div>
              <p className="text-base font-semibold text-white mb-2">Khách hàng mới</p>
              <p className="text-4xl font-extrabold text-white mb-1">{cStats.new}</p>
            </div>
          </div>

          <div className="flex flex-col justify-between rounded-lg px-6 py-5 min-w-[180px] text-white shadow-lg cursor-pointer relative transition-all hover:shadow-xl bg-gradient-to-br from-orange-600 to-orange-400">
            <div className="absolute top-2 right-2">
              <Info className="w-3.5 h-3.5 text-white/70 hover:text-white cursor-help transition-colors" />
            </div>
            <div>
              <p className="text-base font-semibold text-white mb-2">Giá trị bán TB / khách hàng</p>
              <p className="text-4xl font-extrabold text-white mb-1">{formatCurrency(cStats.avgValue)}</p>
            </div>
          </div>
        </div>
          )
        })()}

        {/* Retention & Churn and New vs Returning */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Retention & Churn Card */}
          <Card>
            <CardHeader>
              <CardTitle>Tần xuất mua hàng</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Top metrics */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-green-50 rounded-lg p-4">
                  <p className="text-3xl font-bold text-green-600">39%</p>
                  <p className="text-sm text-gray-600 mt-1">Tỷ lệ quay lại</p>
                  <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    +5.2%
                  </p>
                </div>
                <div className="bg-blue-50 rounded-lg p-4">
                  <p className="text-3xl font-bold text-blue-600">2.3</p>
                  <p className="text-sm text-gray-600 mt-1">Tần suất mua TB</p>
                  <p className="text-xs text-blue-600 mt-1 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    +8%
                  </p>
                </div>
              </div>

              {/* Frequency distribution */}
              <div className="space-y-3">
                <p className="font-semibold text-gray-900">Phân bổ tần suất mua</p>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">1 lần</span>
                    <span className="text-sm text-gray-500">(61%)</span>
                  </div>
                  <div className="relative h-6 bg-gray-200 rounded-full overflow-hidden">
                    <div className="absolute top-0 left-0 h-full bg-gray-500 rounded-full flex items-center justify-end pr-2" style={{ width: '61%' }}>
                      <span className="text-xs font-semibold text-white">298</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">2-5 lần</span>
                    <span className="text-sm text-gray-500">(31%)</span>
                  </div>
                  <div className="relative h-6 bg-gray-200 rounded-full overflow-hidden">
                    <div className="absolute top-0 left-0 h-full bg-blue-500 rounded-full flex items-center justify-end pr-2" style={{ width: '31%' }}>
                      <span className="text-xs font-semibold text-white">152</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">&gt;5 lần</span>
                    <span className="text-sm text-gray-500">(8%)</span>
                  </div>
                  <div className="relative h-6 bg-gray-200 rounded-full overflow-hidden">
                    <div className="absolute top-0 left-0 h-full bg-green-500 rounded-full flex items-center justify-end pr-2" style={{ width: '8%' }}>
                      <span className="text-xs font-semibold text-white">39</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* New vs Returning Customers Card */}
          <Card>
            <CardHeader>
              <CardTitle>Khách hàng mới và quay lại</CardTitle>
            </CardHeader>
            <CardContent>
              {/* New vs Returning stats */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-green-50 rounded-lg p-6 text-center">
                  <Users className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <p className="text-4xl font-bold text-green-600 mb-2">45</p>
                  <p className="text-sm text-gray-600 mb-1">Khách hàng mới</p>
                  <p className="text-xs text-green-600">+15% vs tháng trước</p>
                </div>
                <div className="bg-blue-50 rounded-lg p-6 text-center">
                  <RefreshCw className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <p className="text-4xl font-bold text-blue-600 mb-2">82</p>
                  <p className="text-sm text-gray-600 mb-1">KH quay lại</p>
                  <p className="text-xs text-blue-600">+8% vs tháng trước</p>
                </div>
              </div>

              {/* Revenue distribution */}
              <div className="space-y-3">
                <p className="font-semibold text-gray-900">Tỷ lệ doanh thu</p>
                <div className="relative h-12 bg-gray-200 rounded-full overflow-hidden flex">
                  <div className="h-full bg-green-500 flex items-center justify-center text-white font-semibold" style={{ width: '35%' }}>
                    KH mới 35%
                  </div>
                  <div className="h-full bg-blue-500 flex items-center justify-center text-white font-semibold" style={{ width: '65%' }}>
                    KH cũ 65%
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Top 10 Customers Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Top 10 khách hàng giá trị nhất</CardTitle>
              <button
                onClick={() => onNavigate?.('customers')}
                className="text-sm text-blue-600 hover:underline flex items-center gap-1"
              >
                Xem tất cả
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">STT</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Khách hàng</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Phân khúc</th>
                    <th className="text-center py-3 px-4 text-sm font-semibold text-gray-600">Tổng đơn</th>
                    <th className="text-center py-3 px-4 text-sm font-semibold text-gray-600">Tần suất</th>
                    <th className="text-center py-3 px-4 text-sm font-semibold text-gray-600">Lần mua gần nhất</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600">Tổng chi tiêu</th>
                    <th className="text-center py-3 px-4 text-sm font-semibold text-gray-600">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { rank: 1, name: 'Công ty ABC Corp', segment: 'VIP', orders: 24, frequency: '2.4/tháng', lastPurchase: '5 ngày', spent: 320000000 },
                    { rank: 2, name: 'Tập đoàn XYZ', segment: 'VIP', orders: 18, frequency: '1.8/tháng', lastPurchase: '12 ngày', spent: 285000000 },
                    { rank: 3, name: 'Công ty DEF Ltd', segment: 'VIP', orders: 15, frequency: '1.5/tháng', lastPurchase: '8 ngày', spent: 245000000 },
                    { rank: 4, name: 'Nguyễn Văn Minh', segment: 'DN', orders: 12, frequency: '1.2/tháng', lastPurchase: '15 ngày', spent: 180000000 },
                    { rank: 5, name: 'Công ty GHI', segment: 'DN', orders: 10, frequency: '1.0/tháng', lastPurchase: '22 ngày', spent: 165000000 }
                  ].map((customer) => (
                    <tr key={customer.rank} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-4">
                        <span className="text-gray-900 font-medium">{customer.rank}</span>
                      </td>
                      <td className="py-3 px-4">
                        <p className="font-medium text-gray-900">{customer.name}</p>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${customer.segment === 'VIP' ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'
                          }`}>
                          {customer.segment}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center text-gray-900">{customer.orders}</td>
                      <td className="py-3 px-4 text-center text-blue-600">{customer.frequency}</td>
                      <td className="py-3 px-4 text-center text-orange-600">{customer.lastPurchase}</td>
                      <td className="py-3 px-4 text-right font-semibold text-green-600">{formatCurrency(customer.spent)}</td>
                      <td className="py-3 px-4 text-center">
                        <button
                          className="text-gray-400 hover:text-gray-600 transition-colors"
                          onClick={() => handleViewCustomerOrders(customer)}
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Order Details Modal */}
        {isOrderModalOpen && selectedCustomer && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900">
                  Chi tiết hiệu suất - {selectedCustomer.name}
                </h2>
                <button
                  onClick={() => setIsOrderModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
                {/* Export Button */}
                <div className="flex justify-end mb-4">
                  <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all duration-300 ease-[cubic-bezier(0.645,0.045,0.355,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(62,121,247,0.2)] focus-visible:ring-offset-0 disabled:pointer-events-none disabled:opacity-50 border border-[#3e79f7] rounded-[10px] hover:border-[#699dff] active:bg-[#2a59d1] active:border-[#2a59d1] h-10 px-4 py-[8.5px] bg-green-600 hover:bg-green-700 text-white">
                    <Download className="w-4 h-4 mr-2" />
                    Xuất dữ liệu
                  </button>
                </div>

                {/* Orders Table */}
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200">
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">STT</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Mã đơn hàng</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Sản phẩm</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Phương thức thanh toán</th>
                        <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600">Tổng tiền</th>
                      </tr>
                    </thead>
                    <tbody>
                      {getCustomerOrders(selectedCustomer.name).map((order, index) => (
                        <tr key={index} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                          <td className="py-3 px-4 text-gray-900">{index + 1}</td>
                          <td className="py-3 px-4 text-gray-900">{order.orderCode}</td>
                          <td className="py-3 px-4 text-gray-600">{order.product}</td>
                          <td className="py-3 px-4 text-gray-900">{order.paymentMethod}</td>
                          <td className="py-3 px-4 text-right font-semibold text-green-600">{formatCurrency(order.total)}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="bg-gray-50 border-t-2 border-gray-300">
                        <td colSpan={4} className="py-3 px-4 text-right font-semibold text-gray-900">
                          Tổng doanh số:
                        </td>
                        <td className="py-3 px-4 text-right font-bold text-green-600 text-lg">
                          {formatCurrency(
                            getCustomerOrders(selectedCustomer.name).reduce((sum, order) => sum + order.total, 0)
                          )}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  // Custom Report Component
  const CustomReportComponent = () => (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Báo cáo Tùy chỉnh</h2>
          <p className="text-gray-600">Tạo và quản lý các báo cáo theo nhu cầu riêng</p>
        </div>

        <div className="flex items-center space-x-3">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Tạo báo cáo mới
          </Button>
        </div>
      </div>

      {/* Saved Reports */}
      <Card>
        <CardHeader>
          <CardTitle>Báo cáo đã lưu</CardTitle>
          <CardDescription>Các báo cáo tùy chỉnh đã được tạo và lưu</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              {
                name: 'Doanh số Team A - Tháng 6',
                type: 'Doanh số',
                filters: 'Team A, 01/06 - 30/06/2025',
                createdAt: '2025-06-01',
                lastRun: '2025-06-11'
              },
              {
                name: 'Hiệu suất Lead Facebook',
                type: 'Nguồn Lead',
                filters: 'Facebook, VIP, Tuần này',
                createdAt: '2025-05-28',
                lastRun: '2025-06-10'
              },
              {
                name: 'So sánh Q1 vs Q2',
                type: 'So sánh',
                filters: 'Q1 2025 vs Q2 2025',
                createdAt: '2025-05-15',
                lastRun: '2025-06-08'
              }
            ].map((report, index) => (
              <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <FileText className="w-5 h-5 text-gray-400" />
                    <div>
                      <h3 className="font-medium">{report.name}</h3>
                      <p className="text-sm text-gray-500">{report.type} • {report.filters}</p>
                      <p className="text-xs text-gray-400">
                        Tạo: {formatDate(report.createdAt)} • Chạy gần nhất: {formatDate(report.lastRun)}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm">
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Download className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Report Templates */}
      <Card>
        <CardHeader>
          <CardTitle>Mẫu báo cáo</CardTitle>
          <CardDescription>Các mẫu báo cáo có sẵn để bắt đầu nhanh</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { name: 'Doanh số hàng tuần', type: 'sales', description: 'Báo cáo doanh số theo tuần' },
              { name: 'Hiệu suất Sales', type: 'performance', description: 'Đánh giá hiệu quả bán hàng' },
              { name: 'Phân tích Lead', type: 'source', description: 'Hiệu quả các nguồn lead' },
              { name: 'Tỷ lệ hủy đơn', type: 'cancellation', description: 'Phân tích đơn hàng hủy' },
              { name: 'Khách hàng VIP', type: 'customer', description: 'Báo cáo khách hàng VIP' },
              { name: 'So sánh thời gian', type: 'comparison', description: 'So sánh giữa các kỳ' }
            ].map((template, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 rounded">
                      <BarChart3 className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-medium">{template.name}</h3>
                      <p className="text-sm text-gray-500">{template.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )

  // Interaction Reports Component
  const InteractionReportComponent = () => (
    <div className="space-y-6">
      {/* Header & Filters */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <MessageSquare className="w-5 h-5 text-blue-600" />
                <span>Báo cáo tương tác</span>
              </CardTitle>
              <CardDescription>Phân tích hiệu quả tương tác qua các kênh</CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={() => handleExport('excel', 'interaction')}>
                <Download className="w-4 h-4 mr-2" />
                Excel
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleExport('pdf', 'interaction')}>
                <Download className="w-4 h-4 mr-2" />
                PDF
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4 mb-6">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium">Kênh:</span>
              <select
                value={selectedPlatform}
                onChange={(e) => setSelectedPlatform(e.target.value as any)}
                className="border border-gray-300 rounded px-3 py-1 text-sm"
              >
                <option value="all">Tất cả</option>
                <option value="zalo">Zalo</option>
                <option value="facebook">Facebook</option>
                <option value="email">Email</option>
                <option value="phone">Điện thoại</option>
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium">Thời gian:</span>
              <select
                value={selectedDateRange}
                onChange={(e) => setSelectedDateRange(e.target.value)}
                className="border border-gray-300 rounded px-3 py-1 text-sm"
              >
                <option value="today">Hôm nay</option>
                <option value="yesterday">Hôm qua</option>
                <option value="this_week">Tuần này</option>
                <option value="last_week">Tuần trước</option>
                <option value="this_month">Tháng này</option>
                <option value="last_month">Tháng trước</option>
              </select>
            </div>
          </div>

          {/* Platform Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {sampleInteractionReports.map(report => (
              <Card key={report.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      {getPlatformIcon(report.platform)}
                      <span className="font-medium capitalize">{report.platform}</span>
                    </div>
                    <Badge variant={report.responseRate > 80 ? "default" : "secondary"}>
                      {formatPercent(report.responseRate)}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Tương tác:</span>
                      <span className="font-medium">{report.totalInteractions.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Thời gian phản hồi:</span>
                      <span className="font-medium">{formatTime(report.averageResponseTime)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Chuyển đổi:</span>
                      <span className="font-medium text-green-600">{report.conversionsFromInteractions}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Detailed Analysis */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Response Time Analysis */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Phân tích thời gian phản hồi</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {sampleInteractionReports.map(report => (
                    <div key={report.id} className="flex items-center justify-between p-3 border rounded">
                      <div className="flex items-center space-x-3">
                        {getPlatformIcon(report.platform)}
                        <span className="font-medium capitalize">{report.platform}</span>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{formatTime(report.averageResponseTime)}</div>
                        <div className="text-xs text-gray-500">
                          {report.averageResponseTime < 30 ? 'Rất tốt' :
                            report.averageResponseTime < 60 ? 'Tốt' : 'Cần cải thiện'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Top Performing Agents */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Nhân viên xuất sắc</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {sampleInteractionReports[0].topPerformingAgents.map((agent, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-blue-600">#{index + 1}</span>
                        </div>
                        <div>
                          <div className="font-medium">{agent.agentName}</div>
                          <div className="text-xs text-gray-500">{agent.interactions} tương tác</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium text-green-600">{formatPercent(agent.responseRate)}</div>
                        <div className="text-xs text-gray-500">{formatTime(agent.avgResponseTime)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // Comparison Report Component
  const ComparisonReportComponent = () => (
    <div className="space-y-6">
      {/* Header & Controls */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <BarChart2 className="w-5 h-5 text-purple-600" />
                <span>So sánh thời gian</span>
              </CardTitle>
              <CardDescription>So sánh hiệu suất giữa các kỳ khác nhau</CardDescription>
            </div>
            <Button onClick={() => setShowCreateModal(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Tạo so sánh mới
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4 mb-6">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium">Kỳ 1:</span>
              <select
                value={comparisonPeriod1}
                onChange={(e) => setComparisonPeriod1(e.target.value)}
                className="border border-gray-300 rounded px-3 py-1 text-sm"
              >
                <option value="this_month">Tháng này</option>
                <option value="last_month">Tháng trước</option>
                <option value="this_quarter">Quý này</option>
                <option value="last_quarter">Quý trước</option>
                <option value="this_year">Năm này</option>
                <option value="last_year">Năm trước</option>
              </select>
            </div>
            <div className="text-gray-400">vs</div>
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium">Kỳ 2:</span>
              <select
                value={comparisonPeriod2}
                onChange={(e) => setComparisonPeriod2(e.target.value)}
                className="border border-gray-300 rounded px-3 py-1 text-sm"
              >
                <option value="last_month">Tháng trước</option>
                <option value="last_quarter">Quý trước</option>
                <option value="last_year">Năm trước</option>
                <option value="same_month_last_year">Cùng kỳ năm trước</option>
              </select>
            </div>
          </div>

          {/* Comparison Metrics */}
          {sampleComparisonReports.map(comparison => (
            <div key={comparison.id} className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded">
                <div>
                  <h3 className="font-semibold">{comparison.period1.name} vs {comparison.period2.name}</h3>
                  <p className="text-sm text-gray-600">
                    {formatDate(comparison.period1.startDate)} - {formatDate(comparison.period1.endDate)}
                    {' vs '}
                    {formatDate(comparison.period2.startDate)} - {formatDate(comparison.period2.endDate)}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" onClick={() => handleExport('excel', 'comparison')}>
                    <Download className="w-4 h-4 mr-2" />
                    Excel
                  </Button>
                  <Button variant="outline" size="sm">
                    <Share2 className="w-4 h-4 mr-2" />
                    Chia sẻ
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {Object.entries(comparison.metrics).map(([key, metric]) => (
                  <Card key={key}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-medium text-gray-600 capitalize">
                          {key === 'revenue' ? 'Doanh thu' :
                            key === 'orders' ? 'Đơn hàng' :
                              key === 'leads' ? 'Leads' : 'Tỷ lệ chuyển đổi'}
                        </span>
                        {getChangeIcon(metric.change)}
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-xs text-gray-500">{comparison.period1.name}:</span>
                          <span className="text-sm font-medium">
                            {key === 'revenue' ? formatCurrency(metric.period1) :
                              key === 'conversionRate' ? formatPercent(metric.period1) :
                                metric.period1.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-xs text-gray-500">{comparison.period2.name}:</span>
                          <span className="text-sm font-medium">
                            {key === 'revenue' ? formatCurrency(metric.period2) :
                              key === 'conversionRate' ? formatPercent(metric.period2) :
                                metric.period2.toLocaleString()}
                          </span>
                        </div>
                        <div className="border-t pt-2">
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-gray-500">Thay đổi:</span>
                            <span className={`text-sm font-semibold ${getChangeColor(metric.change)}`}>
                              {metric.change > 0 ? '+' : ''}{formatPercent(metric.change)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );

  // KPI Tracking Component
  const KPITrackingComponent = () => (
    <div className="space-y-6">
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="overview">Tổng quan</TabsTrigger>
          <TabsTrigger value="history">Lịch sử</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="relative">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Tìm kiếm KPI..."
                        value={kpiSearchTerm}
                        onChange={(e) => setKpiSearchTerm(e.target.value)}
                        className="pl-8"
                      />
                    </div>
                    <Select value={kpiCategoryFilter} onValueChange={setKpiCategoryFilter}>
                      <SelectTrigger className="w-[150px]">
                        <SelectValue placeholder="Danh mục" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tất cả</SelectItem>
                        <SelectItem value="sales">Kinh doanh</SelectItem>
                        <SelectItem value="marketing">Marketing</SelectItem>
                        <SelectItem value="operations">Vận hành</SelectItem>
                        <SelectItem value="finance">Tài chính</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={kpiPeriodFilter} onValueChange={setKpiPeriodFilter}>
                      <SelectTrigger className="w-[150px]">
                        <SelectValue placeholder="Chu kỳ" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tất cả</SelectItem>
                        <SelectItem value="daily">Hàng ngày</SelectItem>
                        <SelectItem value="weekly">Hàng tuần</SelectItem>
                        <SelectItem value="monthly">Hàng tháng</SelectItem>
                        <SelectItem value="quarterly">Hàng quý</SelectItem>
                        <SelectItem value="yearly">Hàng năm</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* KPI List */}
                  <div className="space-y-3">
                    {filteredKPIs.map((kpi) => (
                      <Card key={kpi.id} className="cursor-pointer hover:shadow-md transition-shadow"
                        onClick={() => setSelectedKPI(kpi)}>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-3 mb-2">
                                <h4 className="font-medium">{kpi.name}</h4>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(kpi.category)}`}>
                                  {getCategoryText(kpi.category)}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  {getPeriodText(kpi.period)}
                                </span>
                              </div>
                              <p className="text-sm text-muted-foreground mb-2">{kpi.description}</p>
                              <div className="flex items-center space-x-4">
                                <span className="text-sm">
                                  <strong>Hiện tại:</strong> {kpi.unit === 'VND' ? formatCurrency(kpi.current) :
                                    kpi.unit === '%' ? `${kpi.current}%` :
                                      kpi.current.toLocaleString()}
                                </span>
                                <span className="text-sm">
                                  <strong>Mục tiêu:</strong> {kpi.unit === 'VND' ? formatCurrency(kpi.target) :
                                    kpi.unit === '%' ? `${kpi.target}%` :
                                      kpi.target.toLocaleString()}
                                </span>
                                <span className="text-sm">
                                  <strong>Người phụ trách:</strong> {sampleEmployees.find(emp => emp.id === kpi.assignedTo)?.name}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center space-x-3">
                              {getTrendIcon(kpi.trend)}
                              <div className="text-right">
                                <div className={`text-lg font-bold ${kpi.achievement >= 100 ? 'text-green-600' :
                                  kpi.achievement >= 80 ? 'text-yellow-600' : 'text-red-600'}`}>
                                  {kpi.achievement}%
                                </div>
                                <div className="w-20 bg-gray-200 rounded-full h-2">
                                  <div
                                    className={`h-2 rounded-full transition-all duration-300 ${kpi.achievement >= 100 ? 'bg-green-500' :
                                        kpi.achievement >= 80 ? 'bg-yellow-500' : 'bg-red-500'
                                      }`}
                                    style={{ width: `${Math.min(kpi.achievement, 100)}%` }}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="history" className="mt-6">
          <div className="space-y-6">
            <Tabs defaultValue="history" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="history">Lịch sử cập nhật</TabsTrigger>
                <TabsTrigger value="reports">Báo cáo phân tích</TabsTrigger>
              </TabsList>

              <TabsContent value="history" className="mt-6">
                <div className="space-y-4">
                  <div className="grid gap-4">
                    {sampleKPIs.map((kpi) => (
                      <Card key={kpi.id}>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="font-medium">{kpi.name}</h4>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(kpi.category)}`}>
                              {getCategoryText(kpi.category)}
                            </span>
                          </div>
                          <div className="space-y-3">
                            {kpi.history.map((record) => (
                              <div key={record.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div className="space-y-1">
                                  <div className="flex items-center space-x-2">
                                    <span className="font-medium">
                                      {kpi.unit === 'VND' ? formatCurrency(record.value) :
                                        kpi.unit === '%' ? `${record.value}%` :
                                          record.value.toLocaleString()}
                                    </span>
                                    <span className="text-sm text-muted-foreground">
                                      / {kpi.unit === 'VND' ? formatCurrency(record.target) :
                                        kpi.unit === '%' ? `${record.target}%` :
                                          record.target.toLocaleString()}
                                    </span>
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    {record.note && <span className="mr-2">{record.note}</span>}
                                    <span>Chu kỳ: {record.period}</span>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <div className="text-sm font-medium">
                                    {Math.round((record.value / record.target) * 100)}%
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    {formatDate(record.recordedAt)}
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    {sampleEmployees.find(emp => emp.id === record.recordedBy)?.name}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="reports" className="mt-6">
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Performance Summary */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Tổng quan hiệu suất</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">Tỷ lệ đạt mục tiêu</span>
                            <span className="text-lg font-bold text-green-600">
                              {Math.round((sampleKPIs.filter(kpi => kpi.achievement >= 100).length / sampleKPIs.length) * 100)}%
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">Điểm trung bình</span>
                            <span className="text-lg font-bold">
                              {Math.round(sampleKPIs.reduce((sum, kpi) => sum + kpi.achievement, 0) / sampleKPIs.length)}%
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">Xu hướng tăng trưởng</span>
                            <span className="text-lg font-bold text-green-600">
                              {sampleKPIs.filter(kpi => kpi.trend === 'up').length}/{sampleKPIs.length}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Category Performance */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Hiệu suất theo danh mục</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {['sales', 'marketing', 'operations', 'finance'].map((category) => {
                            const categoryKPIs = sampleKPIs.filter(kpi => kpi.category === category)
                            const avgAchievement = categoryKPIs.length > 0 ?
                              Math.round(categoryKPIs.reduce((sum, kpi) => sum + kpi.achievement, 0) / categoryKPIs.length) : 0

                            return (
                              <div key={category} className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(category)}`}>
                                    {getCategoryText(category)}
                                  </span>
                                  <span className="text-sm text-muted-foreground">
                                    ({categoryKPIs.length} KPI)
                                  </span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <div className="w-20 bg-gray-200 rounded-full h-2">
                                    <div
                                      className={`h-2 rounded-full ${avgAchievement >= 100 ? 'bg-green-500' :
                                          avgAchievement >= 80 ? 'bg-yellow-500' : 'bg-red-500'
                                        }`}
                                      style={{ width: `${Math.min(avgAchievement, 100)}%` }}
                                    />
                                  </div>
                                  <span className="text-sm font-medium">{avgAchievement}%</span>
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Detailed Analytics */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Phân tích chi tiết</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                          <h4 className="font-medium text-green-600">Top Performers</h4>
                          {sampleKPIs
                            .filter(kpi => kpi.achievement >= 100)
                            .sort((a, b) => b.achievement - a.achievement)
                            .slice(0, 3)
                            .map((kpi) => (
                              <div key={kpi.id} className="flex justify-between items-center p-2 bg-green-50 rounded">
                                <span className="text-sm font-medium">{kpi.name}</span>
                                <span className="text-sm text-green-600">{kpi.achievement}%</span>
                              </div>
                            ))}
                        </div>
                        <div className="space-y-2">
                          <h4 className="font-medium text-yellow-600">Needs Attention</h4>
                          {sampleKPIs
                            .filter(kpi => kpi.achievement >= 70 && kpi.achievement < 100)
                            .sort((a, b) => a.achievement - b.achievement)
                            .slice(0, 3)
                            .map((kpi) => (
                              <div key={kpi.id} className="flex justify-between items-center p-2 bg-yellow-50 rounded">
                                <span className="text-sm font-medium">{kpi.name}</span>
                                <span className="text-sm text-yellow-600">{kpi.achievement}%</span>
                              </div>
                            ))}
                        </div>
                        <div className="space-y-2">
                          <h4 className="font-medium text-red-600">Critical Issues</h4>
                          {sampleKPIs
                            .filter(kpi => kpi.achievement < 70)
                            .sort((a, b) => a.achievement - b.achievement)
                            .slice(0, 3)
                            .map((kpi) => (
                              <div key={kpi.id} className="flex justify-between items-center p-2 bg-red-50 rounded">
                                <span className="text-sm font-medium">{kpi.name}</span>
                                <span className="text-sm text-red-600">{kpi.achievement}%</span>
                              </div>
                            ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </TabsContent>
      </Tabs>

      {/* Modals */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Tạo báo cáo mới</h2>
              <Button variant="ghost" size="sm" onClick={() => setShowCreateModal(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="space-y-6">
              {/* Report Type Selection */}
              <div>
                <label className="block text-sm font-medium mb-3">Loại báo cáo</label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { type: 'sales', name: 'Doanh số', icon: DollarSign, color: 'green' },
                    { type: 'performance', name: 'Hiệu suất', icon: Target, color: 'blue' },
                    { type: 'interaction', name: 'Tương tác', icon: MessageSquare, color: 'purple' },
                    { type: 'comparison', name: 'So sánh', icon: BarChart2, color: 'orange' },
                    { type: 'customer', name: 'Khách hàng', icon: Users, color: 'indigo' },
                    { type: 'source', name: 'Nguồn Lead', icon: Zap, color: 'yellow' }
                  ].map(reportType => (
                    <div key={reportType.type} className="border-2 border-gray-200 rounded-lg p-4 hover:border-blue-300 cursor-pointer transition-colors">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 bg-${reportType.color}-100 rounded`}>
                          <reportType.icon className={`w-5 h-5 text-${reportType.color}-600`} />
                        </div>
                        <span className="font-medium">{reportType.name}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Report Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Tên báo cáo</label>
                  <Input placeholder="Nhập tên báo cáo..." />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Mô tả</label>
                  <Input placeholder="Mô tả ngắn gọn..." />
                </div>
              </div>

              {/* Time Range */}
              <div>
                <label className="block text-sm font-medium mb-2">Khoảng thời gian</label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Từ ngày</label>
                    <Input type="date" />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Đến ngày</label>
                    <Input type="date" />
                  </div>
                </div>
              </div>

              {/* Filters */}
              <div>
                <label className="block text-sm font-medium mb-3">Bộ lọc</label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Sản phẩm</label>
                    <select className="w-full border border-gray-300 rounded px-3 py-2 text-sm">
                      <option value="">Tất cả sản phẩm</option>
                      <option value="product1">Sản phẩm A</option>
                      <option value="product2">Sản phẩm B</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Nhân viên</label>
                    <select className="w-full border border-gray-300 rounded px-3 py-2 text-sm">
                      <option value="">Tất cả nhân viên</option>
                      <option value="emp1">Nguyễn Văn An</option>
                      <option value="emp2">Trần Thị Bình</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Schedule */}
              <div>
                <label className="block text-sm font-medium mb-3">Lập lịch tự động</label>
                <div className="flex items-center space-x-4">
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded" />
                    <span className="text-sm">Gửi báo cáo tự động</span>
                  </label>
                  <select className="border border-gray-300 rounded px-3 py-1 text-sm">
                    <option value="daily">Hàng ngày</option>
                    <option value="weekly">Hàng tuần</option>
                    <option value="monthly">Hàng tháng</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 mt-8 pt-6 border-t">
              <Button variant="outline" onClick={() => setShowCreateModal(false)}>
                Hủy
              </Button>
              <Button>
                <Save className="w-4 h-4 mr-2" />
                Tạo báo cáo
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Export Modal */}
      {showExportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Xuất báo cáo</h2>
              <Button variant="ghost" size="sm" onClick={() => setShowExportModal(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Định dạng</label>
                <div className="space-y-2">
                  {[
                    { format: 'excel', name: 'Excel (.xlsx)', icon: FileText },
                    { format: 'csv', name: 'CSV (.csv)', icon: FileText },
                    { format: 'pdf', name: 'PDF (.pdf)', icon: FileText }
                  ].map(option => (
                    <label key={option.format} className="flex items-center space-x-3 p-3 border rounded hover:bg-gray-50 cursor-pointer">
                      <input type="radio" name="export-format" value={option.format} defaultChecked={option.format === 'excel'} />
                      <option.icon className="w-5 h-5 text-gray-500" />
                      <span>{option.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="flex items-center space-x-2">
                  <input type="checkbox" defaultChecked />
                  <span className="text-sm">Bao gồm biểu đồ</span>
                </label>
              </div>

              <div>
                <label className="flex items-center space-x-2">
                  <input type="checkbox" defaultChecked />
                  <span className="text-sm">Bao gồm dữ liệu chi tiết</span>
                </label>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 mt-6 pt-4 border-t">
              <Button variant="outline" onClick={() => setShowExportModal(false)}>
                Hủy
              </Button>
              <Button>
                <Download className="w-4 h-4 mr-2" />
                Xuất file
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* KPI Detail Modal */}
      {selectedKPI && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <h2 className="text-xl font-semibold">{selectedKPI.name}</h2>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(selectedKPI.category)}`}>
                  {getCategoryText(selectedKPI.category)}
                </span>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setSelectedKPI(null)}>
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* KPI Overview */}
              <div className="space-y-4">
                <Card>
                  <CardContent className="p-4">
                    <h3 className="font-medium mb-3">Thông tin KPI</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Mô tả:</span>
                        <span className="text-sm">{selectedKPI.description}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Chu kỳ:</span>
                        <span className="text-sm">{getPeriodText(selectedKPI.period)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Người phụ trách:</span>
                        <span className="text-sm">{sampleEmployees.find(emp => emp.id === selectedKPI.assignedTo)?.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Trạng thái:</span>
                        <span className={`text-sm font-medium ${selectedKPI.isActive ? 'text-green-600' : 'text-red-600'}`}>
                          {selectedKPI.isActive ? 'Đang hoạt động' : 'Không hoạt động'}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <h3 className="font-medium mb-3">Hiệu suất hiện tại</h3>
                    <div className="space-y-4">
                      <div className="text-center">
                        <div className="text-3xl font-bold mb-2">
                          {selectedKPI.unit === 'VND' ? formatCurrency(selectedKPI.current) :
                            selectedKPI.unit === '%' ? `${selectedKPI.current}%` :
                              selectedKPI.current.toLocaleString()}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Mục tiêu: {selectedKPI.unit === 'VND' ? formatCurrency(selectedKPI.target) :
                            selectedKPI.unit === '%' ? `${selectedKPI.target}%` :
                              selectedKPI.target.toLocaleString()}
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-4">
                        <div
                          className={`h-4 rounded-full transition-all duration-300 ${selectedKPI.achievement >= 100 ? 'bg-green-500' :
                              selectedKPI.achievement >= 80 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                          style={{ width: `${Math.min(selectedKPI.achievement, 100)}%` }}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Tỷ lệ hoàn thành</span>
                        <div className="flex items-center space-x-2">
                          {getTrendIcon(selectedKPI.trend)}
                          <span className={`font-medium ${selectedKPI.achievement >= 100 ? 'text-green-600' :
                            selectedKPI.achievement >= 80 ? 'text-yellow-600' : 'text-red-600'}`}>
                            {selectedKPI.achievement}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* KPI History */}
              <div className="space-y-4">
                <Card>
                  <CardContent className="p-4">
                    <h3 className="font-medium mb-3">Lịch sử cập nhật</h3>
                    <div className="space-y-3 max-h-64 overflow-y-auto">
                      {selectedKPI.history.map((record) => (
                        <div key={record.id} className="p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium">
                              {selectedKPI.unit === 'VND' ? formatCurrency(record.value) :
                                selectedKPI.unit === '%' ? `${record.value}%` :
                                  record.value.toLocaleString()}
                            </span>
                            <span className="text-sm text-muted-foreground">
                              {formatDate(record.recordedAt)}
                            </span>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            <div>Mục tiêu: {selectedKPI.unit === 'VND' ? formatCurrency(record.target) :
                              selectedKPI.unit === '%' ? `${record.target}%` :
                                record.target.toLocaleString()}</div>
                            <div>Chu kỳ: {record.period}</div>
                            {record.note && <div>Ghi chú: {record.note}</div>}
                            <div>Cập nhật bởi: {sampleEmployees.find(emp => emp.id === record.recordedBy)?.name}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <div className="flex space-x-2">
                  <Button className="flex-1">
                    <Edit className="w-4 h-4 mr-2" />
                    Chỉnh sửa
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <Plus className="w-4 h-4 mr-2" />
                    Cập nhật giá trị
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )

  // Main return
  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Báo cáo</h1>
          <p className="text-gray-600">Phân tích và theo dõi hiệu quả kinh doanh</p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {[
            { id: 'overview', name: 'Tổng quan', icon: <BarChart3 className="w-4 h-4" /> },
            { id: 'sales', name: 'Doanh số', icon: <DollarSign className="w-4 h-4" /> },
            { id: 'performance', name: 'Hiệu suất Sale', icon: <Users className="w-4 h-4" /> },
            { id: 'process', name: 'Quy trình', icon: <Activity className="w-4 h-4" /> },
            { id: 'sources', name: 'Nguồn Lead', icon: <Zap className="w-4 h-4" /> },
            // { id: 'cancellation', name: 'Hủy đơn', icon: <AlertTriangle className="w-4 h-4" /> },
            { id: 'customer', name: 'Khách hàng', icon: <Users className="w-4 h-4" /> },
            { id: 'employee', name: 'Nhân viên', icon: <UserCheck className="w-4 h-4" /> }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`group inline-flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
            >
              <span className={activeTab === tab.id ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-500'}>
                {tab.icon}
              </span>
              <span>{tab.name}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === 'overview' && <ReportOverview />}
        {activeTab === 'sales' && <SalesReportComponent />}
        {activeTab === 'performance' && <SalesPerformanceComponent />}
        {activeTab === 'process' && <SalesProcessComponent />}
        {activeTab === 'sources' && <LeadSourceComponent />}
        {activeTab === 'cancellation' && <CancellationReportComponent />}
        {activeTab === 'customer' && <CustomerReportComponent />}
        {activeTab === 'employee' && <EmployeeReportTab />}
      </div>
    </div>
  )
}
