'use client'

import { useState } from 'react'
import { 
  TrendingUp, 
  Users, 
  Target, 
  Percent,
  ArrowUpRight,
  ArrowDownRight,
  MoreVertical,
  BarChart3,
  Plus,
  Minus,
  Info
} from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, ComposedChart } from 'recharts'
import EnhancedDashboardFilters from './EnhancedDashboardFilters'
// import VileadRevenueChart from './VileadRevenueChart'

export default function Dashboard({ onNavigate }: { onNavigate?: (view: string) => void } = {}) {
  // State for time period selection
  const [selectedPeriod, setSelectedPeriod] = useState<'thismonth' | '6months' | '12months' | 'custom'>('thismonth')
  const [showCustomModal, setShowCustomModal] = useState(false)
  const [customStartDate, setCustomStartDate] = useState('')
  const [customEndDate, setCustomEndDate] = useState('')
  
  // Tooltip state
  const [hoveredBottleneck, setHoveredBottleneck] = useState<string | null>(null)
  const [showCalculationGuide, setShowCalculationGuide] = useState(false)
  
  // Bottleneck explanations
  const bottleneckExplanations = {
    'response_time': {
      title: 'Thời gian phản hồi leads',
      explanation: 'Thời gian trung bình từ khi nhận lead đến khi có phản hồi đầu tiên',
      causes: [
        '• Thiếu nhân sự xử lý leads',
        '• Quy trình phản hồi chưa tự động',
        '• Leads đến ngoài giờ hành chính',
        '• Phân bổ leads không đều'
      ],
      solutions: [
        '• Thiết lập auto-response',
        '• Tăng cường đội ngũ',
        '• Phân ca xử lý 24/7',
        '• Sử dụng chatbot hỗ trợ'
      ]
    },
    'negotiation': {
      title: 'Giai đoạn "Đàm phán"',
      explanation: 'Số lượng leads tồn đọng ở giai đoạn đàm phán quá lâu',
      causes: [
        '• Khách hàng chưa sẵn sàng quyết định',
        '• Giá cả chưa phù hợp',
        '• Thiếu thông tin sản phẩm',
        '• Competitor can thiệp'
      ],
      solutions: [
        '• Follow up định kỳ',
        '• Cung cấp thêm ưu đãi',
        '• Demo sản phẩm chi tiết',
        '• Tạo sense of urgency'
      ]
    },
    'assignment': {
      title: 'Phân bổ leads',
      explanation: 'Leads chưa được phân bổ cho nhân viên phụ trách',
      causes: [
        '• Thiếu quy trình phân bổ tự động',
        '• Nhân viên đã quá tải',
        '• Leads chất lượng thấp',
        '• Thông tin leads không đầy đủ'
      ],
      solutions: [
        '• Thiết lập auto-assignment',
        '• Cân bằng workload',
        '• Lọc leads chất lượng',
        '• Hoàn thiện thông tin leads'
      ]
    }
  }
  
  // Sample data for different periods
  const revenueDataThisMonth = [
    { month: '01/07', revenue: 0.12, target: 0.15 },
    { month: '02/07', revenue: 0.18, target: 0.15 },
    { month: '03/07', revenue: 0.14, target: 0.15 },
    { month: '04/07', revenue: 0.16, target: 0.15 },
    { month: '05/07', revenue: 0.21, target: 0.15 },
    { month: '06/07', revenue: 0.19, target: 0.15 },
    { month: '07/07', revenue: 0.23, target: 0.15 },
    { month: '08/07', revenue: 0.17, target: 0.15 },
    { month: '09/07', revenue: 0.25, target: 0.15 },
    { month: '10/07', revenue: 0.22, target: 0.15 },
    { month: '11/07', revenue: 0.20, target: 0.15 },
    { month: '12/07', revenue: 0.24, target: 0.15 },
    { month: '13/07', revenue: 0.18, target: 0.15 },
    { month: '14/07', revenue: 0.26, target: 0.15 },
    { month: '15/07', revenue: 0.28, target: 0.15 },
    { month: '16/07', revenue: 0.22, target: 0.15 },
    { month: '17/07', revenue: 0.19, target: 0.15 },
    { month: '18/07', revenue: 0.31, target: 0.15 },
    { month: '19/07', revenue: 0.27, target: 0.15 },
    { month: '20/07', revenue: 0.24, target: 0.15 },
    { month: '21/07', revenue: 0.29, target: 0.15 },
    { month: '22/07', revenue: 0.25, target: 0.15 },
    { month: '23/07', revenue: 0.33, target: 0.15 },
    { month: '24/07', revenue: 0.28, target: 0.15 },
    { month: '25/07', revenue: 0.30, target: 0.15 },
    { month: '26/07', revenue: 0.27, target: 0.15 },
    { month: '27/07', revenue: 0.32, target: 0.15 },
    { month: '28/07', revenue: 0.29, target: 0.15 },
    { month: '29/07', revenue: 0.35, target: 0.15 },
    { month: '30/07', revenue: 0.31, target: 0.15 },
  ]

  const revenueData6Months = [
    { month: 'T1', revenue: 2.8, target: 3.0 },
    { month: 'T2', revenue: 3.2, target: 3.5 },
    { month: 'T3', revenue: 2.9, target: 3.2 },
    { month: 'T4', revenue: 3.8, target: 4.0 },
    { month: 'T5', revenue: 4.2, target: 4.2 },
    { month: 'T6', revenue: 3.9, target: 4.1 },
  ]

  const revenueData12Months = [
    { month: 'T1/2024', revenue: 2.1, target: 2.5 },
    { month: 'T2/2024', revenue: 2.3, target: 2.7 },
    { month: 'T3/2024', revenue: 2.6, target: 2.8 },
    { month: 'T4/2024', revenue: 2.4, target: 2.9 },
    { month: 'T5/2024', revenue: 2.7, target: 3.0 },
    { month: 'T6/2024', revenue: 2.9, target: 3.1 },
    { month: 'T7/2024', revenue: 2.8, target: 3.0 },
    { month: 'T8/2024', revenue: 3.2, target: 3.5 },
    { month: 'T9/2024', revenue: 2.9, target: 3.2 },
    { month: 'T10/2024', revenue: 3.8, target: 4.0 },
    { month: 'T11/2024', revenue: 4.2, target: 4.2 },
    { month: 'T12/2024', revenue: 3.9, target: 4.1 },
  ]

  // Get current data based on selected period
  const getCurrentRevenueData = () => {
    switch (selectedPeriod) {
      case 'thismonth':
        return revenueDataThisMonth
      case '6months':
        return revenueData6Months
      case '12months':
        return revenueData12Months
      case 'custom':
        // For custom, we'll use 6months data as fallback
        return revenueData6Months
      default:
        return revenueData6Months
    }
  }

  const revenueData = getCurrentRevenueData()

  // Calculate summary stats based on current data
  const calculateSummaryStats = () => {
    const currentRevenue = revenueData[revenueData.length - 1]?.revenue || 0
    const currentTarget = revenueData[revenueData.length - 1]?.target || 0
    const achievementRate = currentTarget > 0 ? (currentRevenue / currentTarget * 100).toFixed(1) : '0'
    
    const avgGrowth = revenueData.length > 1 
      ? ((revenueData[revenueData.length - 1].revenue - revenueData[0].revenue) / revenueData[0].revenue * 100 / (revenueData.length - 1)).toFixed(1)
      : '0'
    
    const bestMonth = revenueData.reduce((best, current) => 
      current.revenue > best.revenue ? current : best, revenueData[0])
    
    const predictedNext = currentRevenue * (1 + parseFloat(avgGrowth) / 100)
    
    return {
      currentRevenue,
      currentTarget,
      achievementRate,
      avgGrowth,
      bestMonth,
      predictedNext: predictedNext.toFixed(1),
      predictedGrowth: ((predictedNext - currentRevenue) / currentRevenue * 100).toFixed(1)
    }
  }

  const summaryStats = calculateSummaryStats()

  // Handle custom date selection
  const handleCustomPeriod = () => {
    setShowCustomModal(true)
  }

  const applyCustomPeriod = () => {
    if (customStartDate && customEndDate) {
      setSelectedPeriod('custom')
      setShowCustomModal(false)
      // In a real app, you would fetch data for this custom period
      console.log('Custom period:', customStartDate, 'to', customEndDate)
    }
  }

  const conversionData = [
    { stage: 'Lead mới', count: 254, percentage: 100 },
    { stage: 'Đang tư vấn', count: 186, percentage: 73.2 },
    { stage: 'Đã gửi đề xuất', count: 132, percentage: 52.0 },
    { stage: 'Đàm phán', count: 124, percentage: 48.8 },
    { stage: 'Chuyển đổi - chờ thanh toán', count: 89, percentage: 35.0 },
    { stage: 'Chuyển đổi thành công', count: 42, percentage: 16.5 },
  ]

  const activityData = [
    { type: 'Thêm mới lead từ Facebook Ads', name: 'Nguyễn Thanh', time: '2 phút trước', status: 'new' },
    { type: 'Gọi báo giá cho khách hàng', name: 'XYZ Corp', time: '15 phút trước', status: 'progress' },
    { type: 'Lịch hẹn Demo sản phẩm cho ABC Corp', name: 'ABC Corp', time: '30 phút trước', status: 'scheduled' },
    { type: 'Deal #123 đã chuyển sang giai đoạn Đàm phán', name: 'DEF Ltd', time: '1 giờ trước', status: 'updated' },
  ]

  const topPerformers = [
    { name: 'Nguyễn Văn A', revenue: '1.250.000.000', deals: 12, conversion: '65%' },
    { name: 'Trần Thị B', revenue: '980.000.000', deals: 9, conversion: '48%' },
    { name: 'Lê Văn C', revenue: '850.000.000', deals: 8, conversion: '42%' },
    { name: 'Phạm Thị D', revenue: '720.000.000', deals: 7, conversion: '35%' },
    { name: 'Hoàng Văn E', revenue: '580.000.000', deals: 5, conversion: '28%' },
  ]

  // Top products data
  const topProducts = [
    { 
      name: 'CRM Professional', 
      revenue: '2.850.000.000', 
      units: 45, 
      growth: '+18%',
      category: 'Software'
    },
    { 
      name: 'Marketing Automation', 
      revenue: '1.920.000.000', 
      units: 28, 
      growth: '+12%',
      category: 'Software'
    },
    { 
      name: 'Sales Analytics', 
      revenue: '1.480.000.000', 
      units: 32, 
      growth: '+25%',
      category: 'Analytics'
    },
    { 
      name: 'Customer Support Plus', 
      revenue: '980.000.000', 
      units: 18, 
      growth: '-5%',
      category: 'Service'
    },
    { 
      name: 'Integration Suite', 
      revenue: '720.000.000', 
      units: 12, 
      growth: '+8%',
      category: 'Integration'
    },
  ]

  // Important tasks data (max 4)
  const importantTasks = [
    { 
      id: 1,
      title: 'Gọi lại khách hàng ABC Corp', 
      deadline: 'Hôm nay, 15:00', 
      priority: 'urgent',
      priorityText: 'Khẩn cấp',
      color: {
        border: 'border-red-500',
        bg: 'bg-red-50',
        dot: 'bg-red-500',
        text: 'text-red-900',
        subtext: 'text-red-700',
        badge: 'bg-red-100 text-red-800'
      }
    },
    { 
      id: 2,
      title: 'Hoàn thiện báo giá dự án XYZ', 
      deadline: 'Ngày mai, 09:00', 
      priority: 'high',
      priorityText: 'Cao',
      color: {
        border: 'border-orange-500',
        bg: 'bg-orange-50',
        dot: 'bg-orange-500',
        text: 'text-orange-900',
        subtext: 'text-orange-700',
        badge: 'bg-orange-100 text-orange-800'
      }
    },
    { 
      id: 3,
      title: 'Cập nhật thông tin lead mới', 
      deadline: '05/07/2025', 
      priority: 'medium',
      priorityText: 'Trung bình',
      color: {
        border: 'border-yellow-500',
        bg: 'bg-yellow-50',
        dot: 'bg-yellow-500',
        text: 'text-yellow-900',
        subtext: 'text-yellow-700',
        badge: 'bg-yellow-100 text-yellow-800'
      }
    },
    { 
      id: 4,
      title: 'Tổng kết báo cáo tháng 6', 
      deadline: '04/07/2025', 
      priority: 'medium',
      priorityText: 'Trung bình',
      color: {
        border: 'border-blue-500',
        bg: 'bg-blue-50',
        dot: 'bg-blue-500',
        text: 'text-blue-900',
        subtext: 'text-blue-700',
        badge: 'bg-blue-100 text-blue-800'
      }
    }
  ]

  // Today's schedule data (max 4)
  const todaySchedule = [
    {
      id: 1,
      title: 'Họp báo cáo tuần với team',
      time: '10:00 - 11:00',
      location: 'Phòng họp A',
      type: 'meeting',
      color: {
        bg: 'bg-blue-50',
        iconBg: 'bg-blue-500',
        text: 'text-blue-900',
        subtext: 'text-blue-700'
      },
      icon: (
        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
        </svg>
      )
    },
    {
      id: 2,
      title: 'Demo sản phẩm cho DEF Company',
      time: '14:30 - 15:30',
      location: 'Online Meeting',
      type: 'demo',
      color: {
        bg: 'bg-green-50',
        iconBg: 'bg-green-500',
        text: 'text-green-900',
        subtext: 'text-green-700'
      },
      icon: (
        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
        </svg>
      )
    },
    {
      id: 3,
      title: 'Cuộc gọi tư vấn khách hàng mới',
      time: '16:00 - 16:30',
      location: 'Số điện thoại',
      type: 'call',
      color: {
        bg: 'bg-purple-50',
        iconBg: 'bg-purple-500',
        text: 'text-purple-900',
        subtext: 'text-purple-700'
      },
      icon: (
        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
        </svg>
      )
    },
    {
      id: 4,
      title: 'Họp review dự án với khách hàng',
      time: '17:30 - 18:00',
      location: 'Zoom Meeting',
      type: 'review',
      color: {
        bg: 'bg-indigo-50',
        iconBg: 'bg-indigo-500',
        text: 'text-indigo-900',
        subtext: 'text-indigo-700'
      },
      icon: (
        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tổng quan</h1>
          <p className="text-gray-600">Theo dõi hiệu suất kinh doanh của bạn</p>
        </div>
      </div>

      {/* Dashboard Filters */}
      <EnhancedDashboardFilters onFilterChange={(filters) => console.log('Filters changed:', filters)} />

      {/* Metric Cards */}
      <div className="grid grid-cols-4 gap-4">
        <div 
          className="flex flex-col justify-between rounded-lg px-6 py-5 min-w-[180px] bg-gradient-to-br from-blue-600 to-blue-400 text-white shadow-lg cursor-pointer relative transition-all hover:shadow-xl"
          onClick={() => {
            onNavigate?.('reports')
            setTimeout(() => {
              const event = new CustomEvent('setReportTab', { detail: { tab: 'sales' } })
              window.dispatchEvent(event)
            }, 100)
          }}
        >
          <div className="absolute top-2 right-2">
            <Info className="w-3.5 h-3.5 text-white/70 hover:text-white cursor-help transition-colors" />
          </div>
          <div>
            <p className="text-base font-semibold text-white mb-2">Doanh thu</p>
            <p className="text-4xl font-extrabold text-white mb-1">2.8B</p>
            <div className="flex items-center justify-between mt-3">
              <p className="text-sm text-white/90">T.trước: 2.5B</p>
              <p className="text-sm text-white/90 font-semibold">+12%</p>
            </div>
          </div>
        </div>

        <div 
          className="flex flex-col justify-between rounded-lg px-6 py-5 min-w-[180px] bg-gradient-to-br from-purple-600 to-purple-400 text-white shadow-lg cursor-pointer relative transition-all hover:shadow-xl"
          onClick={() => {
            onNavigate?.('reports')
            setTimeout(() => {
              const event = new CustomEvent('setReportTab', { detail: { tab: 'sources' } })
              window.dispatchEvent(event)
            }, 100)
          }}
        >
          <div className="absolute top-2 right-2">
            <Info className="w-3.5 h-3.5 text-white/70 hover:text-white cursor-help transition-colors" />
          </div>
          <div>
            <p className="text-base font-semibold text-white mb-2">Số lượng leads</p>
            <p className="text-4xl font-extrabold text-white mb-1">245</p>
            <div className="flex items-center justify-between mt-3">
              <p className="text-sm text-white/90">T.trước: 207</p>
              <p className="text-sm text-white/90 font-semibold">+18.5%</p>
            </div>
          </div>
        </div>

        <div 
          className="flex flex-col justify-between rounded-lg px-6 py-5 min-w-[180px] bg-gradient-to-br from-orange-600 to-orange-400 text-white shadow-lg cursor-pointer relative transition-all hover:shadow-xl"
          onClick={() => {
            onNavigate?.('reports')
            setTimeout(() => {
              const event = new CustomEvent('setReportTab', { detail: { tab: 'sales' } })
              window.dispatchEvent(event)
            }, 100)
          }}
        >
          <div className="absolute top-2 right-2">
            <Info className="w-3.5 h-3.5 text-white/70 hover:text-white cursor-help transition-colors" />
          </div>
          <div>
            <p className="text-base font-semibold text-white mb-2">Tỷ lệ chuyển đổi</p>
            <p className="text-4xl font-extrabold text-white mb-1">18.5%</p>
            <div className="flex items-center justify-between mt-3">
              <p className="text-sm text-white/90">T.trước: 16.2%</p>
              <p className="text-sm text-white/90 font-semibold">+2.3%</p>
            </div>
          </div>
        </div>

        <div 
          className="flex flex-col justify-between rounded-lg px-6 py-5 min-w-[180px] bg-gradient-to-br from-green-600 to-green-400 text-white shadow-lg cursor-pointer relative transition-all hover:shadow-xl"
          onClick={() => onNavigate?.('tasks')}
        >
          <div className="absolute top-2 right-2">
            <Info className="w-3.5 h-3.5 text-white/70 hover:text-white cursor-help transition-colors" />
          </div>
          <div>
            <p className="text-base font-semibold text-white mb-2">Số lượng công việc</p>
            <p className="text-4xl font-extrabold text-white mb-1">68</p>
            <div className="flex items-center justify-between mt-3">
              <p className="text-sm text-white/90">T.trước: 72</p>
              <p className="text-sm text-white/90 font-semibold">-5.2%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid - Charts and Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Enhanced Revenue Chart */}
        <div className="lg:col-span-2 bg-gradient-to-br from-white via-blue-50/30 to-blue-100/20 p-8 rounded-2xl shadow-xl border border-blue-100/60 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-black text-gray-900 tracking-tight">
                  Doanh thu theo {selectedPeriod === 'thismonth' ? 'ngày' : selectedPeriod === '12months' ? 'tháng (năm)' : 'tháng'}
                </h3>
                <p className="text-sm text-gray-600 font-medium">
                  Theo dõi xu hướng {selectedPeriod === 'thismonth' ? 'hàng ngày' : 'tăng trưởng'} • Cập nhật realtime
                </p>
              </div>
            </div>

          </div>
          
          {/* Enhanced Summary Cards */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div 
              className="flex flex-col justify-between rounded-lg px-6 py-5 min-w-[180px] bg-gradient-to-br from-blue-600 to-blue-400 text-white shadow-lg cursor-pointer relative transition-all hover:shadow-xl"
              onClick={() => {
                onNavigate?.('reports')
                setTimeout(() => {
                  const event = new CustomEvent('setReportTab', { detail: { tab: 'sales', filter: 'today' } })
                  window.dispatchEvent(event)
                }, 100)
              }}
            >
              <div className="absolute top-2 right-2">
                <Info className="w-3.5 h-3.5 text-white/70 hover:text-white cursor-help transition-colors" />
              </div>
              <div>
                <p className="text-base font-semibold text-white mb-2">Doanh thu hôm nay</p>
                <p className="text-4xl font-extrabold text-white mb-1">310M</p>
                <div className="flex items-center justify-between mt-3">
                  <p className="text-sm text-white/90">H.qua: 294M</p>
                  <p className="text-sm text-white/90 font-semibold">+5.5%</p>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col justify-between rounded-lg px-6 py-5 min-w-[180px] bg-gradient-to-br from-green-600 to-green-400 text-white shadow-lg cursor-pointer relative transition-all hover:shadow-xl">
              <div className="absolute top-2 right-2">
                <Info className="w-3.5 h-3.5 text-white/70 hover:text-white cursor-help transition-colors" />
              </div>
              <div>
                <p className="text-base font-semibold text-white mb-2">KPI hôm nay</p>
                <p className="text-4xl font-extrabold text-white mb-1">150M</p>
                <div className="flex items-center justify-between mt-3">
                  <p className="text-sm text-white/90">Mục tiêu: 150M</p>
                  <p className="text-sm text-white/90 font-semibold">206.7%</p>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col justify-between rounded-lg px-6 py-5 min-w-[180px] bg-gradient-to-br from-purple-600 to-purple-400 text-white shadow-lg cursor-pointer relative transition-all hover:shadow-xl">
              <div className="absolute top-2 right-2">
                <Info className="w-3.5 h-3.5 text-white/70 hover:text-white cursor-help transition-colors" />
              </div>
              <div>
                <p className="text-base font-semibold text-white mb-2">Tăng trưởng TB</p>
                <p className="text-4xl font-extrabold text-white mb-1">+5.5%</p>
                <div className="flex items-center justify-between mt-3">
                  <p className="text-sm text-white/90">Trung bình hàng ngày</p>
                </div>
              </div>
            </div>
          </div>

            <div className="relative">
            <div className="h-80 bg-gradient-to-br from-white via-blue-50/20 to-blue-100/30 rounded-xl p-6 border border-blue-100/40 shadow-inner">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={revenueData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                  <defs>
                    <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.8} />
                      <stop offset="100%" stopColor="#93c5fd" stopOpacity={0.3} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid 
                    strokeDasharray="3 3" 
                    stroke="#e2e8f0" 
                    strokeOpacity={0.5}
                  />
                  <XAxis 
                    dataKey="month" 
                    stroke="#64748b" 
                    fontSize={12}
                    fontWeight="500"
                    tickLine={false}
                    axisLine={{ stroke: '#cbd5e1', strokeWidth: 1 }}
                  />
                  <YAxis 
                    stroke="#64748b" 
                    fontSize={12}
                    fontWeight="500"
                    tickLine={false}
                    axisLine={{ stroke: '#cbd5e1', strokeWidth: 1 }}
                    tickFormatter={(value) => `${(Number(value) * 1000000000).toLocaleString('vi-VN')}`}
                    width={120}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      border: 'none',
                      borderRadius: '12px',
                      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
                      padding: '12px'
                    }}
                    labelStyle={{ 
                      color: '#1f2937', 
                      fontWeight: '600', 
                      fontSize: '14px',
                      marginBottom: '4px'
                    }}
                    formatter={(value, name) => {
                      if (name === 'revenue') {
                        const kpiValue = revenueData[0]?.target || 0.15;
                        return [
                          <div key="tooltip-content" className="space-y-1">
                            <div>
                              <span className="text-[#151D48] text-[16px] font-semibold">
                                {`${(Number(value) * 1000000000).toLocaleString('vi-VN')} VND`}
                              </span>
                              <span className="block font-medium text-blue-600">💰 Doanh thu</span>
                            </div>
                            <div className="pt-1 border-t border-gray-200">
                              <span className="text-[14px] font-medium text-green-600">
                                🎯 KPI: {`${(kpiValue * 1000000000).toLocaleString('vi-VN')} VND`}
                              </span>
                            </div>
                          </div>,
                          ""
                        ];
                      }
                      return [
                        <span key="value" className="text-[14px] font-medium text-green-600">
                          {`${(Number(value) * 1000000000).toLocaleString('vi-VN')} VND`}
                        </span>,
                        <span key="label" className="font-medium text-green-600">
                          🎯 KPI
                        </span>
                      ];
                    }}
                    labelFormatter={(label) => `📅 ${label}`}
                  />
                  {/* KPI Reference Line */}
                  <Line 
                    type="monotone"
                    dataKey="target" 
                    stroke="#10b981" 
                    strokeWidth={3}
                    strokeDasharray="8 4"
                    dot={false}
                    activeDot={{ r: 6, fill: '#10b981', stroke: '#fff', strokeWidth: 2 }}
                    name="target"
                  />
                  <Bar 
                    dataKey="revenue" 
                    fill="url(#barGradient)"
                    radius={[4, 4, 0, 0]}
                    stroke="#3b82f6"
                    strokeWidth={1}
                    name="revenue"
                  />
                </ComposedChart>
              </ResponsiveContainer>
              
              {/* Enhanced Legend */}
              <div className="absolute bottom-4 left-6 flex items-center space-x-6 bg-white/90 px-4 py-2 rounded-full shadow-md backdrop-blur-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-blue-500 rounded"></div>
                  <span className="text-xs font-semibold text-gray-700">Doanh thu</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-0.5 bg-green-500 rounded" style={{borderStyle: 'dashed', borderTop: '2px dashed #10b981', backgroundColor: 'transparent'}}></div>
                  <span className="text-xs font-semibold text-gray-700">KPI</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Important Tasks & Schedule */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Công việc quan trọng</h3>
            <button 
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              onClick={() => onNavigate?.('tasks')}
            >
              Xem tất cả
            </button>
          </div>
          
          <div className="space-y-3">
            {/* Important Tasks - Display up to 4 */}
            {importantTasks.slice(0, 4).map((task) => (
              <div key={task.id} className={`border-l-4 ${task.color.border} ${task.color.bg} p-3 rounded-r-lg`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-2 h-2 ${task.color.dot} rounded-full`}></div>
                    <div>
                      <p className={`text-sm font-medium ${task.color.text}`}>{task.title}</p>
                      <p className={`text-xs ${task.color.subtext}`}>Deadline: {task.deadline}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 ${task.color.badge} text-xs rounded-full font-medium`}>
                    {task.priorityText}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Upcoming Schedule */}
          <div className="mt-6 pt-4 border-t border-gray-200">
            <h4 className="text-md font-semibold text-gray-900 mb-3">Lịch quan trọng hôm nay</h4>
            <div className="space-y-3">
              {/* Today's Schedule - Display up to 4 */}
              {todaySchedule.slice(0, 4).map((schedule) => (
                <div key={schedule.id} className={`flex items-center space-x-3 p-2 ${schedule.color.bg} rounded-lg`}>
                  <div className={`w-8 h-8 ${schedule.color.iconBg} rounded-lg flex items-center justify-center`}>
                    {schedule.icon}
                  </div>
                  <div className="flex-1">
                    <p className={`text-sm font-medium ${schedule.color.text}`}>{schedule.title}</p>
                    <p className={`text-xs ${schedule.color.subtext}`}>{schedule.time} • {schedule.location}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Conversion Funnel and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Conversion Funnel */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-6">Phễu chuyển đổi</h3>
          <div className="space-y-4">
            {conversionData.map((stage, index) => {
              const nextStage = conversionData[index + 1]
              const dropoffRate = nextStage ? ((stage.count - nextStage.count) / stage.count * 100).toFixed(1) : '0'
              
              return (
                <div key={index} className="relative group">
                  {/* Stage info */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${
                        index === 0 ? 'bg-blue-600' :
                        index === 1 ? 'bg-blue-500' :
                        index === 2 ? 'bg-blue-400' :
                        index === 3 ? 'bg-blue-300' :
                        'bg-blue-200'
                      }`}></div>
                      <span className="text-sm font-medium text-gray-900">{stage.stage}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="text-lg font-bold text-gray-900">{stage.count}</span>
                      <span className="text-sm text-gray-500">({stage.percentage}%)</span>
                      {parseFloat(dropoffRate) > 0 && (
                        <span className="text-xs text-red-500 bg-red-50 px-2 py-1 rounded">
                          -{dropoffRate}%
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {/* Funnel visualization */}
                  <div className="relative mb-4">
                    <div 
                      className={`h-12 rounded-lg shadow-sm transition-all duration-500 flex items-center justify-between px-4 ${
                        index === 0 ? 'bg-gradient-to-r from-blue-600 to-blue-500' :
                        index === 1 ? 'bg-gradient-to-r from-blue-500 to-blue-400' :
                        index === 2 ? 'bg-gradient-to-r from-blue-400 to-blue-300' :
                        index === 3 ? 'bg-gradient-to-r from-blue-300 to-blue-200' :
                        'bg-gradient-to-r from-blue-200 to-blue-100'
                      } group-hover:shadow-md`}
                      style={{
                        width: `${Math.max(stage.percentage, 20)}%`,
                        marginLeft: `${(100 - Math.max(stage.percentage, 20)) / 2}%`
                      }}
                    >
                      <span className="text-white text-sm font-semibold">
                        {stage.percentage}%
                      </span>
                      <span className="text-white text-xs">
                        {stage.count} leads
                      </span>
                    </div>
                    
                    {/* Dropoff indicator */}
                    {index < conversionData.length - 1 && (
                      <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                        <div className="w-6 h-4 bg-gray-200 rounded-b-full flex items-end justify-center">
                          <div className="w-1 h-2 bg-red-400 rounded-full"></div>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Conversion rate tooltip */}
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute top-0 right-0 bg-gray-900 text-white text-xs p-3 rounded-lg shadow-lg z-10 min-w-48">
                    <div className="space-y-1">
                      <div className="font-semibold">{stage.stage}</div>
                      <div className="flex justify-between">
                        <span>Số lượng:</span>
                        <span className="font-medium">{stage.count} leads</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Tỷ lệ:</span>
                        <span className="font-medium">{stage.percentage}%</span>
                      </div>
                      {nextStage && (
                        <div className="flex justify-between text-red-300">
                          <span>Tỷ lệ rớt:</span>
                          <span className="font-medium">{dropoffRate}%</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
          
          {/* Summary */}
          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-lg font-bold text-blue-600">
                  {conversionData[conversionData.length - 1].count}
                </div>
                <div className="text-xs text-gray-500">Deals thành công</div>
              </div>
              <div>
                <div className="text-lg font-bold text-green-600">
                  {conversionData[conversionData.length - 1].percentage}%
                </div>
                <div className="text-xs text-gray-500">Tỷ lệ chuyển đổi</div>
              </div>
              <div>
                <div className="text-lg font-bold text-orange-600">
                  {(conversionData[0].count - conversionData[conversionData.length - 1].count)}
                </div>
                <div className="text-xs text-gray-500">Leads bị mất</div>
              </div>
            </div>
          </div>
        </div>

        {/* Lead Sources Analysis */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Nguồn Leads & Phân tích</h3>
            <button 
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              onClick={() => {
                onNavigate?.('reports')
                setTimeout(() => {
                  const event = new CustomEvent('setReportTab', { detail: { tab: 'sources' } })
                  window.dispatchEvent(event)
                }, 100)
              }}
            >
              Xem báo cáo đầy đủ
            </button>
          </div>
          
          {/* Lead Sources Performance */}
          <div className="space-y-3 mb-6">
            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-100 hover:bg-blue-100 transition-colors cursor-pointer">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-500 rounded-lg">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-900">Facebook Ads</div>
                  <div className="text-xs text-gray-500">24.5% tổng leads</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900">245</div>
                <div className="text-xs text-green-600 font-semibold">92% chuyển đổi</div>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-100 hover:bg-green-100 transition-colors cursor-pointer">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-500 rounded-lg">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"/>
                  </svg>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-900">Google Ads</div>
                  <div className="text-xs text-gray-500">18.2% tổng leads</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900">182</div>
                <div className="text-xs text-green-600 font-semibold">88% chuyển đổi</div>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-orange-50 rounded-lg border border-orange-100 hover:bg-orange-100 transition-colors cursor-pointer">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-orange-500 rounded-lg">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 15.287c-.678 2.034-2.525 3.467-4.989 3.871a6.79 6.79 0 01-5.524-1.384 6.801 6.801 0 01-2.485-4.755c-.078-1.875.611-3.683 1.901-4.989a6.79 6.79 0 014.755-2.113c1.875-.078 3.683.611 4.989 1.901a6.801 6.801 0 012.485 4.755c.156 1.094-.078 2.189-.611 3.127l-.521.587z"/>
                  </svg>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-900">Zalo Business</div>
                  <div className="text-xs text-gray-500">15.3% tổng leads</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900">153</div>
                <div className="text-xs text-green-600 font-semibold">95% chuyển đổi</div>
              </div>
            </div>
          </div>

          {/* Bottleneck Analysis */}
          <div className="border-t pt-4">
            <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center justify-between">
              <span>Điểm tắc nghẽn</span>
              <button 
                onClick={() => setShowCalculationGuide(!showCalculationGuide)}
                className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 transition-colors"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Cách tính
              </button>
            </h4>
            
            {/* Calculation Guide */}
            {showCalculationGuide && (
              <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h5 className="font-semibold text-blue-900 mb-3 flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  Hướng dẫn tính điểm tắc nghẽn
                </h5>
                
                <div className="space-y-4 text-sm">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Response Time Calculation */}
                    <div className="bg-white p-3 rounded border border-red-100">
                      <h6 className="font-medium text-red-700 mb-2 flex items-center">
                        <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                        Thời gian phản hồi
                      </h6>
                      <div className="text-xs text-gray-600 space-y-1">
                        <div className="bg-blue-50 p-2 rounded mb-2 border-l-2 border-blue-400">
                          <p className="font-medium text-blue-800 mb-1">📋 Định nghĩa:</p>
                          <p className="text-blue-700">Thời gian từ khi <strong>nhận lead</strong> cho tới khi <strong>liên hệ</strong> (gọi điện, nhắn tin, email) lần đầu tiên</p>
                        </div>
                        <p><strong>Công thức:</strong></p>
                        <p>Tổng thời gian phản hồi ÷ Số leads</p>
                        <div className="bg-gray-50 p-2 rounded mt-2">
                          <p><strong>Ví dụ:</strong></p>
                          <p>• Lead A: Nhận 9:00 → Gọi 11:30 = 2.5h</p>
                          <p>• Lead B: Nhận 14:00 → SMS 17:00 = 3h</p>
                          <p>• Lead C: Nhận 16:00 → Gọi 18:30 = 2.5h</p>
                          <p className="mt-1 font-medium">➜ Trung bình: 8h ÷ 3 = 2.67h</p>
                        </div>
                        <div className="mt-2">
                          <p className="text-red-600"><strong>Mức độ nghiêm trọng:</strong></p>
                          <p>🟢 &lt; 1 giờ: Tốt</p>
                          <p>🟡 1-3 giờ: Chấp nhận</p>
                          <p>🔴 &gt; 3 giờ: Nghiêm trọng</p>
                        </div>
                        <div className="mt-2 text-xs bg-yellow-50 p-2 rounded border border-yellow-200">
                          <p className="font-medium text-yellow-800">⚠️ Lưu ý:</p>
                          <p className="text-yellow-700">Chỉ tính trong giờ làm việc (8:00-17:30). Leads cuối tuần được tính từ thứ 2.</p>
                        </div>
                      </div>
                    </div>

                    {/* Negotiation Stage Calculation */}
                    <div className="bg-white p-3 rounded border border-yellow-100">
                      <h6 className="font-medium text-yellow-700 mb-2 flex items-center">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
                        Giai đoạn đàm phán
                      </h6>
                      <div className="text-xs text-gray-600 space-y-1">
                        <p><strong>Công thức:</strong></p>
                        <p>Số leads tồn đọng × Số ngày trung bình</p>
                        <div className="bg-gray-50 p-2 rounded mt-2">
                          <p><strong>Ví dụ:</strong></p>
                          <p>124 leads × 5 ngày = 620 điểm tắc nghẽn</p>
                        </div>
                        <div className="mt-2">
                          <p className="text-yellow-600"><strong>Mức độ nghiêm trọng:</strong></p>
                          <p>🟢 &lt; 200: Tốt</p>
                          <p>🟡 200-500: Chú ý</p>
                          <p>🔴 &gt; 500: Nghiêm trọng</p>
                        </div>
                      </div>
                    </div>

                    {/* Assignment Calculation */}
                    <div className="bg-white p-3 rounded border border-blue-100">
                      <h6 className="font-medium text-blue-700 mb-2 flex items-center">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                        Phân bổ leads
                      </h6>
                      <div className="text-xs text-gray-600 space-y-1">
                        <p><strong>Công thức:</strong></p>
                        <p>(Leads chưa assign ÷ Tổng leads) × 100%</p>
                        <div className="bg-gray-50 p-2 rounded mt-2">
                          <p><strong>Ví dụ:</strong></p>
                          <p>(67 ÷ 335) × 100% = 20%</p>
                        </div>
                        <div className="mt-2">
                          <p className="text-blue-600"><strong>Mức độ nghiêm trọng:</strong></p>
                          <p>🟢 &lt; 5%: Tốt</p>
                          <p>🟡 5-15%: Chấp nhận</p>
                          <p>🔴 &gt; 15%: Nghiêm trọng</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Overall Scoring */}
                  <div className="border-t pt-3">
                    <h6 className="font-medium text-gray-800 mb-2">📊 Tính điểm tổng thể:</h6>
                    <div className="bg-gray-50 p-3 rounded">
                      <p className="text-xs text-gray-600 mb-2">
                        <strong>Điểm tắc nghẽn tổng thể</strong> = (Điểm phản hồi × 40%) + (Điểm đàm phán × 35%) + (Điểm phân bổ × 25%)
                      </p>
                      <div className="grid grid-cols-4 gap-2 text-xs">
                        <div className="text-center p-2 bg-green-100 rounded">
                          <div className="font-semibold text-green-700">Tốt</div>
                          <div className="text-green-600">0-30 điểm</div>
                        </div>
                        <div className="text-center p-2 bg-yellow-100 rounded">
                          <div className="font-semibold text-yellow-700">Chú ý</div>
                          <div className="text-yellow-600">31-60 điểm</div>
                        </div>
                        <div className="text-center p-2 bg-orange-100 rounded">
                          <div className="font-semibold text-orange-700">Cảnh báo</div>
                          <div className="text-orange-600">61-80 điểm</div>
                        </div>
                        <div className="text-center p-2 bg-red-100 rounded">
                          <div className="font-semibold text-red-700">Nghiêm trọng</div>
                          <div className="text-red-600">81-100 điểm</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Tips */}
                  <div className="border-t pt-3">
                    <h6 className="font-medium text-gray-800 mb-2 flex items-center">
                      💡 Mẹo tối ưu hóa:
                    </h6>
                    <ul className="text-xs text-gray-600 space-y-1">
                      <li>• <strong>Theo dõi hàng ngày:</strong> Kiểm tra điểm tắc nghẽn mỗi sáng để phát hiện sớm vấn đề</li>
                      <li>• <strong>Thiết lập cảnh báo:</strong> Tự động thông báo khi điểm vượt ngưỡng cho phép</li>
                      <li>• <strong>Phân tích xu hướng:</strong> So sánh với tuần/tháng trước để đánh giá cải thiện</li>
                      <li>• <strong>Hành động nhanh:</strong> Ưu tiên xử lý các tắc nghẽn có điểm cao nhất trước</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
            <div className="space-y-3">
              <div 
                className="relative flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200 cursor-help transition-all duration-200 hover:shadow-md hover:bg-red-100"
                onMouseEnter={() => setHoveredBottleneck('response_time')}
                onMouseLeave={() => setHoveredBottleneck(null)}
              >
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-sm font-medium text-red-900">Thời gian phản hồi leads</span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-red-900">3.2h</div>
                  <div className="text-xs text-red-600">Tăng 25% so với tuần trước</div>
                </div>
                
                {/* Tooltip */}
                {hoveredBottleneck === 'response_time' && (
                  <div className="absolute left-0 top-full mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-50">
                    <h4 className="font-semibold text-gray-900 mb-2">{bottleneckExplanations.response_time.title}</h4>
                    <p className="text-sm text-gray-600 mb-3">{bottleneckExplanations.response_time.explanation}</p>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <h5 className="font-medium text-red-700 text-xs mb-1">Nguyên nhân:</h5>
                        <ul className="text-xs text-gray-600 space-y-0.5">
                          {bottleneckExplanations.response_time.causes.map((cause, index) => (
                            <li key={index}>{cause}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h5 className="font-medium text-green-700 text-xs mb-1">Giải pháp:</h5>
                        <ul className="text-xs text-gray-600 space-y-0.5">
                          {bottleneckExplanations.response_time.solutions.map((solution, index) => (
                            <li key={index}>{solution}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div 
                className="relative flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-200 cursor-help transition-all duration-200 hover:shadow-md hover:bg-yellow-100"
                onMouseEnter={() => setHoveredBottleneck('negotiation')}
                onMouseLeave={() => setHoveredBottleneck(null)}
              >
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span className="text-sm font-medium text-yellow-900">Giai đoạn &quot;Đàm phán&quot;</span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-yellow-900">124 leads</div>
                  <div className="text-xs text-yellow-600">Tồn đọng 5 ngày</div>
                </div>
                
                {/* Tooltip */}
                {hoveredBottleneck === 'negotiation' && (
                  <div className="absolute left-0 top-full mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-50">
                    <h4 className="font-semibold text-gray-900 mb-2">{bottleneckExplanations.negotiation.title}</h4>
                    <p className="text-sm text-gray-600 mb-3">{bottleneckExplanations.negotiation.explanation}</p>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <h5 className="font-medium text-red-700 text-xs mb-1">Nguyên nhân:</h5>
                        <ul className="text-xs text-gray-600 space-y-0.5">
                          {bottleneckExplanations.negotiation.causes.map((cause, index) => (
                            <li key={index}>{cause}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h5 className="font-medium text-green-700 text-xs mb-1">Giải pháp:</h5>
                        <ul className="text-xs text-gray-600 space-y-0.5">
                          {bottleneckExplanations.negotiation.solutions.map((solution, index) => (
                            <li key={index}>{solution}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div 
                className="relative flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200 cursor-help transition-all duration-200 hover:shadow-md hover:bg-blue-100"
                onMouseEnter={() => setHoveredBottleneck('assignment')}
                onMouseLeave={() => setHoveredBottleneck(null)}
              >
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-sm font-medium text-blue-900">Phân bổ leads</span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-blue-900">67 leads</div>
                  <div className="text-xs text-blue-600">Chưa assign</div>
                </div>
                
                {/* Tooltip */}
                {hoveredBottleneck === 'assignment' && (
                  <div className="absolute left-0 top-full mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-50">
                    <h4 className="font-semibold text-gray-900 mb-2">{bottleneckExplanations.assignment.title}</h4>
                    <p className="text-sm text-gray-600 mb-3">{bottleneckExplanations.assignment.explanation}</p>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <h5 className="font-medium text-red-700 text-xs mb-1">Nguyên nhân:</h5>
                        <ul className="text-xs text-gray-600 space-y-0.5">
                          {bottleneckExplanations.assignment.causes.map((cause, index) => (
                            <li key={index}>{cause}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h5 className="font-medium text-green-700 text-xs mb-1">Giải pháp:</h5>
                        <ul className="text-xs text-gray-600 space-y-0.5">
                          {bottleneckExplanations.assignment.solutions.map((solution, index) => (
                            <li key={index}>{solution}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>


        </div>
      </div>

      {/* Top Performers and Products */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Sales Performers */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Top nhân viên kinh doanh</h3>
            <button 
              className="text-blue-600 hover:text-blue-700 text-sm"
              onClick={() => {
                onNavigate?.('reports')
                setTimeout(() => {
                  const event = new CustomEvent('setReportTab', { detail: { tab: 'sales' } })
                  window.dispatchEvent(event)
                }, 100)
              }}
            >
              Xem báo cáo đầy đủ
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 text-sm font-medium text-gray-600">Nhân viên</th>
                  <th className="text-right py-2 text-sm font-medium text-gray-600">Doanh thu</th>
                  <th className="text-right py-2 text-sm font-medium text-gray-600">Deals</th>
                  <th className="text-right py-2 text-sm font-medium text-gray-600">Tỷ lệ</th>
                </tr>
              </thead>
              <tbody>
                {topPerformers.map((performer, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="py-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                          {performer.name.charAt(0)}
                        </div>
                        <span className="font-medium text-sm">{performer.name}</span>
                      </div>
                    </td>
                    <td className="text-right py-3 font-medium text-sm">{performer.revenue}</td>
                    <td className="text-right py-3 text-sm">{performer.deals}</td>
                    <td className="text-right py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        parseInt(performer.conversion) >= 50 ? 'bg-green-100 text-green-800' :
                        parseInt(performer.conversion) >= 30 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {performer.conversion}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Top sản phẩm</h3>
            <button 
              className="text-blue-600 hover:text-blue-700 text-sm"
              onClick={() => {
                onNavigate?.('reports')
                setTimeout(() => {
                  const event = new CustomEvent('setReportTab', { detail: { tab: 'sales' } })
                  window.dispatchEvent(event)
                }, 100)
              }}
            >
              Xem báo cáo đầy đủ
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 text-sm font-medium text-gray-600">Sản phẩm</th>
                  <th className="text-right py-2 text-sm font-medium text-gray-600">Doanh thu</th>
                  <th className="text-right py-2 text-sm font-medium text-gray-600">Đơn vị</th>
                  <th className="text-right py-2 text-sm font-medium text-gray-600">Tăng trưởng</th>
                </tr>
              </thead>
              <tbody>
                {topProducts.map((product, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="py-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg flex items-center justify-center text-white text-xs font-bold">
                          {product.name.charAt(0)}
                        </div>
                        <div>
                          <span className="font-medium text-sm">{product.name}</span>
                          <p className="text-xs text-gray-500">{product.category}</p>
                        </div>
                      </div>
                    </td>
                    <td className="text-right py-3 font-medium text-sm">{product.revenue}</td>
                    <td className="text-right py-3 text-sm">{product.units}</td>
                    <td className="text-right py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        product.growth.startsWith('+') ? 'bg-green-100 text-green-800' :
                        product.growth.startsWith('-') ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {product.growth}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Custom Date Range Modal */}
      {showCustomModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-96 max-w-md mx-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900">Chọn khoảng thời gian</h3>
              <button 
                onClick={() => setShowCustomModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ngày bắt đầu
                </label>
                <input
                  type="date"
                  value={customStartDate}
                  onChange={(e) => setCustomStartDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ngày kết thúc
                </label>
                <input
                  type="date"
                  value={customEndDate}
                  onChange={(e) => setCustomEndDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              {/* Quick preset buttons */}
              <div className="border-t pt-4">
                <p className="text-sm font-medium text-gray-700 mb-3">Hoặc chọn nhanh:</p>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      const today = new Date()
                      const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate())
                      setCustomStartDate(lastMonth.toISOString().split('T')[0])
                      setCustomEndDate(today.toISOString().split('T')[0])
                    }}
                    className="px-3 py-2 text-sm text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    30 ngày qua
                  </button>
                  <button
                    onClick={() => {
                      const today = new Date()
                      const last3Months = new Date(today.getFullYear(), today.getMonth() - 3, today.getDate())
                      setCustomStartDate(last3Months.toISOString().split('T')[0])
                      setCustomEndDate(today.toISOString().split('T')[0])
                    }}
                    className="px-3 py-2 text-sm text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    3 tháng qua
                  </button>
                  <button
                    onClick={() => {
                      const today = new Date()
                      const startOfYear = new Date(today.getFullYear(), 0, 1)
                      setCustomStartDate(startOfYear.toISOString().split('T')[0])
                      setCustomEndDate(today.toISOString().split('T')[0])
                    }}
                    className="px-3 py-2 text-sm text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    Từ đầu năm
                  </button>
                  <button
                    onClick={() => {
                      const today = new Date()
                      const lastYear = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate())
                      setCustomStartDate(lastYear.toISOString().split('T')[0])
                      setCustomEndDate(today.toISOString().split('T')[0])
                    }}
                    className="px-3 py-2 text-sm text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    1 năm qua
                  </button>
                </div>
              </div>
            </div>
            
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowCustomModal(false)}
                className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={applyCustomPeriod}
                disabled={!customStartDate || !customEndDate}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Áp dụng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
