'use client'

import React, { useState, useEffect } from 'react'
import {
  Mail,
  Send,
  FileText,
  BarChart3,
  Settings,
  Plus,
  Search,
  Filter,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  Copy,
  Play,
  Pause,
  X,
  Check,
  AlertCircle,
  Clock,
  CheckCircle,
  Users,
  MousePointer,
  MailOpen,
  AlertTriangle,
  ArrowLeft,
  Upload,
  Image,
  Type,
  Link,
  Minus,
  Square,
  Columns,
  Share2,
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Code,
  Variable,
  Download,
  Calendar,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  ChevronDown,
  ExternalLink,
  Smartphone,
  Monitor,
  Zap
} from 'lucide-react'

// ==================== INTERFACES ====================
interface SenderEmail {
  id: string
  email: string
  senderName: string
  status: 'activated' | 'pending' | 'domain_unverified' | 'disabled'
  permission: 'all' | 'me' | 'specific'
  specificUserIds?: string[]
  createdAt: string
  createdBy: string
}

interface EmailTemplate {
  id: string
  name: string
  type: 'system' | 'user'
  thumbnailUrl: string
  contentHtml: string
  ownerId?: string
  createdAt: string
  updatedAt: string
}

interface Campaign {
  id: string
  name: string
  type: 'normal' | 'ab'
  status: 'draft' | 'scheduled' | 'running' | 'paused' | 'sent' | 'cancelled'
  subject: string
  subjectB?: string
  previewText?: string
  senderEmailId: string
  templateId: string
  recipientCount: number
  validEmailCount: number
  sendType: 'immediate' | 'scheduled' | 'batch'
  scheduledAt?: string
  abType?: 'subject' | 'content' | 'send_time'
  abRatioA?: number
  abRatioB?: number
  abWinner?: 'a' | 'b' | null
  stats: CampaignStats
  createdAt: string
  createdBy: string
  startedAt?: string
  completedAt?: string
}

interface CampaignStats {
  totalSent: number
  delivered: number
  bounced: number
  opened: number
  clicked: number
  unsubscribed: number
}

interface EmailLimits {
  dailyLimit: number
  monthlyLimit: number
  perSenderDailyLimit: number
  delayBetweenEmails: number
  dailyUsed: number
  monthlyUsed: number
}

// ==================== DEMO DATA ====================
const demoSenderEmails: SenderEmail[] = [
  {
    id: 'se-1',
    email: 'sales@vilead.vn',
    senderName: 'ViLead Sales Team',
    status: 'activated',
    permission: 'all',
    createdAt: '2025-01-15T08:00:00',
    createdBy: 'Admin'
  },
  {
    id: 'se-2',
    email: 'marketing@vilead.vn',
    senderName: 'ViLead Marketing',
    status: 'activated',
    permission: 'all',
    createdAt: '2025-01-10T09:30:00',
    createdBy: 'Admin'
  },
  {
    id: 'se-3',
    email: 'support@vilead.vn',
    senderName: 'ViLead Support',
    status: 'pending',
    permission: 'specific',
    specificUserIds: ['user-1', 'user-2'],
    createdAt: '2025-01-28T14:00:00',
    createdBy: 'Leader'
  },
  {
    id: 'se-4',
    email: 'info@newcompany.com',
    senderName: 'New Company',
    status: 'domain_unverified',
    permission: 'me',
    createdAt: '2025-01-30T10:00:00',
    createdBy: 'Sale 1'
  }
]

const demoTemplates: EmailTemplate[] = [
  {
    id: 'tpl-1',
    name: 'Mẫu chào mừng khách hàng mới',
    type: 'system',
    thumbnailUrl: '/templates/welcome.png',
    contentHtml: '<html><body><h1>Xin chào {ten_khach}!</h1><p>Cảm ơn bạn đã đăng ký...</p></body></html>',
    createdAt: '2025-01-01T00:00:00',
    updatedAt: '2025-01-01T00:00:00'
  },
  {
    id: 'tpl-2',
    name: 'Mẫu khuyến mãi',
    type: 'system',
    thumbnailUrl: '/templates/promo.png',
    contentHtml: '<html><body><h1>Ưu đãi đặc biệt!</h1><p>Giảm giá 50%...</p></body></html>',
    createdAt: '2025-01-01T00:00:00',
    updatedAt: '2025-01-01T00:00:00'
  },
  {
    id: 'tpl-3',
    name: 'Thông báo sản phẩm mới',
    type: 'system',
    thumbnailUrl: '/templates/product.png',
    contentHtml: '<html><body><h1>Ra mắt sản phẩm mới!</h1><p>Khám phá ngay...</p></body></html>',
    createdAt: '2025-01-01T00:00:00',
    updatedAt: '2025-01-01T00:00:00'
  },
  {
    id: 'tpl-4',
    name: 'Chiến dịch Tết 2025',
    type: 'user',
    thumbnailUrl: '/templates/tet.png',
    contentHtml: '<html><body><h1>Chúc mừng năm mới!</h1><p>Ưu đãi Tết dành cho {ten_khach}...</p></body></html>',
    ownerId: 'user-admin',
    createdAt: '2025-01-20T10:00:00',
    updatedAt: '2025-01-25T15:30:00'
  },
  {
    id: 'tpl-5',
    name: 'Follow-up sau demo',
    type: 'user',
    thumbnailUrl: '/templates/followup.png',
    contentHtml: '<html><body><h1>Cảm ơn bạn đã tham gia demo!</h1><p>Bạn có thắc mắc gì không {ten_khach}?</p></body></html>',
    ownerId: 'user-admin',
    createdAt: '2025-01-22T08:00:00',
    updatedAt: '2025-01-22T08:00:00'
  }
]

const demoCampaigns: Campaign[] = [
  {
    id: 'cmp-1',
    name: 'Chiến dịch Tết 2025',
    type: 'ab',
    status: 'sent',
    subject: '🎁 Ưu đãi Tết 2025 dành riêng cho bạn!',
    subjectB: '{ten_khach} ơi, đừng bỏ lỡ ưu đãi Tết này!',
    senderEmailId: 'se-1',
    templateId: 'tpl-4',
    recipientCount: 500,
    validEmailCount: 485,
    sendType: 'immediate',
    abType: 'subject',
    abRatioA: 10,
    abRatioB: 10,
    abWinner: 'b',
    stats: {
      totalSent: 500,
      delivered: 485,
      bounced: 15,
      opened: 210,
      clicked: 45,
      unsubscribed: 3
    },
    createdAt: '2025-01-15T08:00:00',
    createdBy: 'Admin',
    startedAt: '2025-01-16T09:00:00',
    completedAt: '2025-01-16T10:25:00'
  },
  {
    id: 'cmp-2',
    name: 'Sale cuối năm',
    type: 'normal',
    status: 'running',
    subject: 'Flash Sale cuối năm - Giảm đến 70%!',
    senderEmailId: 'se-2',
    templateId: 'tpl-2',
    recipientCount: 1000,
    validEmailCount: 980,
    sendType: 'batch',
    stats: {
      totalSent: 450,
      delivered: 445,
      bounced: 5,
      opened: 120,
      clicked: 28,
      unsubscribed: 1
    },
    createdAt: '2025-01-14T10:00:00',
    createdBy: 'Marketing',
    startedAt: '2025-01-15T08:00:00'
  },
  {
    id: 'cmp-3',
    name: 'Welcome Email Series',
    type: 'normal',
    status: 'scheduled',
    subject: 'Chào mừng bạn đến với ViLead!',
    senderEmailId: 'se-1',
    templateId: 'tpl-1',
    recipientCount: 200,
    validEmailCount: 198,
    sendType: 'scheduled',
    scheduledAt: '2025-02-01T09:00:00',
    stats: {
      totalSent: 0,
      delivered: 0,
      bounced: 0,
      opened: 0,
      clicked: 0,
      unsubscribed: 0
    },
    createdAt: '2025-01-25T14:00:00',
    createdBy: 'Sale Team'
  },
  {
    id: 'cmp-4',
    name: 'Ra mắt tính năng mới',
    type: 'normal',
    status: 'draft',
    subject: '🚀 Tính năng mới đã sẵn sàng!',
    senderEmailId: 'se-2',
    templateId: 'tpl-3',
    recipientCount: 0,
    validEmailCount: 0,
    sendType: 'immediate',
    stats: {
      totalSent: 0,
      delivered: 0,
      bounced: 0,
      opened: 0,
      clicked: 0,
      unsubscribed: 0
    },
    createdAt: '2025-01-30T16:00:00',
    createdBy: 'Admin'
  },
  {
    id: 'cmp-5',
    name: 'Follow-up khách hàng tiềm năng',
    type: 'normal',
    status: 'paused',
    subject: 'Bạn có cần hỗ trợ gì không?',
    senderEmailId: 'se-1',
    templateId: 'tpl-5',
    recipientCount: 150,
    validEmailCount: 148,
    sendType: 'batch',
    stats: {
      totalSent: 50,
      delivered: 49,
      bounced: 1,
      opened: 18,
      clicked: 5,
      unsubscribed: 0
    },
    createdAt: '2025-01-28T11:00:00',
    createdBy: 'Sale 2',
    startedAt: '2025-01-29T10:00:00'
  }
]

const demoEmailLimits: EmailLimits = {
  dailyLimit: 500,
  monthlyLimit: 10000,
  perSenderDailyLimit: 100,
  delayBetweenEmails: 5,
  dailyUsed: 350,
  monthlyUsed: 2500
}

// ==================== HELPER FUNCTIONS ====================
const formatDate = (dateStr: string) => {
  const date = new Date(dateStr)
  return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

const formatDateTime = (dateStr: string) => {
  const date = new Date(dateStr)
  return date.toLocaleDateString('vi-VN', { 
    day: '2-digit', 
    month: '2-digit', 
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'activated':
    case 'sent':
      return 'bg-green-100 text-green-700'
    case 'pending':
    case 'scheduled':
      return 'bg-yellow-100 text-yellow-700'
    case 'domain_unverified':
    case 'cancelled':
      return 'bg-red-100 text-red-700'
    case 'running':
      return 'bg-blue-100 text-blue-700'
    case 'paused':
      return 'bg-orange-100 text-orange-700'
    case 'draft':
      return 'bg-gray-100 text-gray-700'
    case 'disabled':
      return 'bg-gray-100 text-gray-500'
    default:
      return 'bg-gray-100 text-gray-600'
  }
}

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'activated': return 'Đã kích hoạt'
    case 'pending': return 'Chờ xác thực'
    case 'domain_unverified': return 'Domain chưa xác thực'
    case 'disabled': return 'Vô hiệu hóa'
    case 'draft': return 'Mới'
    case 'scheduled': return 'Đang chờ'
    case 'running': return 'Đang chạy'
    case 'paused': return 'Tạm dừng'
    case 'sent': return 'Đã gửi'
    case 'cancelled': return 'Đã hủy'
    default: return status
  }
}

// ==================== MAIN COMPONENT ====================
export default function EmailMarketing() {
  const [activeTab, setActiveTab] = useState<'campaigns' | 'templates' | 'reports' | 'settings'>('campaigns')
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  
  // Data states
  const [campaigns, setCampaigns] = useState<Campaign[]>(demoCampaigns)
  const [templates, setTemplates] = useState<EmailTemplate[]>(demoTemplates)
  const [senderEmails, setSenderEmails] = useState<SenderEmail[]>(demoSenderEmails)
  const [emailLimits, setEmailLimits] = useState<EmailLimits>(demoEmailLimits)
  
  // Modal states
  const [showCreateCampaignModal, setShowCreateCampaignModal] = useState(false)
  const [showAddSenderModal, setShowAddSenderModal] = useState(false)
  const [showTemplatePreview, setShowTemplatePreview] = useState(false)
  const [showCampaignDetail, setShowCampaignDetail] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null)
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null)
  
  // Template tab state
  const [templateTab, setTemplateTab] = useState<'system' | 'user'>('system')
  
  // Settings sub-tab
  const [settingsTab, setSettingsTab] = useState<'sender' | 'limits'>('sender')

  // ==================== TAB NAVIGATION ====================
  const tabs = [
    { id: 'campaigns', label: 'Chiến dịch mail', icon: Send },
    { id: 'templates', label: 'Thư viện mẫu', icon: FileText },
    { id: 'reports', label: 'Báo cáo chất lượng', icon: BarChart3 },
    { id: 'settings', label: 'Cấu hình', icon: Settings }
  ]

  // ==================== FILTER LOGIC ====================
  const filteredCampaigns = campaigns.filter(campaign => {
    const matchesSearch = campaign.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         campaign.subject.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || campaign.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = templateTab === 'system' ? template.type === 'system' : template.type === 'user'
    return matchesSearch && matchesType
  })

  // ==================== RENDER CAMPAIGNS TAB ====================
  const renderCampaignsTab = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Chiến dịch Email</h2>
          <p className="text-sm text-gray-500 mt-1">Quản lý và theo dõi các chiến dịch email marketing</p>
        </div>
        <button
          onClick={() => setShowCreateCampaignModal(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Tạo chiến dịch mới</span>
        </button>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex items-center space-x-1 border-b border-gray-200">
        {[
          { id: 'all', label: 'Tất cả' },
          { id: 'draft', label: 'Mới' },
          { id: 'scheduled', label: 'Đang chờ' },
          { id: 'running', label: 'Đang chạy' },
          { id: 'paused', label: 'Tạm dừng' },
          { id: 'sent', label: 'Đã gửi' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setStatusFilter(tab.id)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              statusFilter === tab.id
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm kiếm theo tên chiến dịch..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Campaigns Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tên chiến dịch
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Trạng thái
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ngày tạo
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Người nhận
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Thành công
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Đã mở
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Đã click
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredCampaigns.map((campaign) => (
              <tr 
                key={campaign.id} 
                className={`hover:bg-gray-50 ${campaign.status === 'running' ? 'bg-blue-50' : ''}`}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {campaign.type === 'ab' && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-700 mr-2">
                        A/B
                      </span>
                    )}
                    <div>
                      <div className="text-sm font-medium text-gray-900">{campaign.name}</div>
                      <div className="text-xs text-gray-500 truncate max-w-[200px]">{campaign.subject}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(campaign.status)}`}>
                    {campaign.status === 'running' && <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-1.5 animate-pulse"></span>}
                    {getStatusLabel(campaign.status)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(campaign.createdAt)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {campaign.validEmailCount.toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {campaign.stats.delivered > 0 ? (
                    <span className="text-green-600">{campaign.stats.delivered.toLocaleString()}</span>
                  ) : '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {campaign.stats.opened > 0 ? (
                    <div className="flex items-center">
                      <span className="text-blue-600">{campaign.stats.opened.toLocaleString()}</span>
                      <span className="text-gray-400 ml-1">
                        ({campaign.stats.delivered > 0 ? Math.round(campaign.stats.opened / campaign.stats.delivered * 100) : 0}%)
                      </span>
                    </div>
                  ) : '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {campaign.stats.clicked > 0 ? (
                    <div className="flex items-center">
                      <span className="text-purple-600">{campaign.stats.clicked.toLocaleString()}</span>
                      <span className="text-gray-400 ml-1">
                        ({campaign.stats.delivered > 0 ? Math.round(campaign.stats.clicked / campaign.stats.delivered * 100) : 0}%)
                      </span>
                    </div>
                  ) : '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end space-x-2">
                    <button
                      onClick={() => {
                        setSelectedCampaign(campaign)
                        setShowCampaignDetail(true)
                      }}
                      className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded"
                      title="Xem chi tiết"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    {(campaign.status === 'draft' || campaign.status === 'scheduled') && (
                      <button className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded" title="Chỉnh sửa">
                        <Edit className="w-4 h-4" />
                      </button>
                    )}
                    {campaign.status === 'running' && (
                      <button className="p-1.5 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded" title="Tạm dừng">
                        <Pause className="w-4 h-4" />
                      </button>
                    )}
                    {campaign.status === 'paused' && (
                      <button className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded" title="Tiếp tục">
                        <Play className="w-4 h-4" />
                      </button>
                    )}
                    <button className="p-1.5 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded" title="Tạo bản sao">
                      <Copy className="w-4 h-4" />
                    </button>
                    {campaign.status === 'draft' && (
                      <button className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded" title="Xóa">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredCampaigns.length === 0 && (
          <div className="text-center py-12">
            <Mail className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Chưa có chiến dịch nào</p>
            <button
              onClick={() => setShowCreateCampaignModal(true)}
              className="mt-4 text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              + Tạo chiến dịch đầu tiên
            </button>
          </div>
        )}
      </div>
    </div>
  )

  // ==================== RENDER TEMPLATES TAB ====================
  const renderTemplatesTab = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Thư viện mẫu Email</h2>
          <p className="text-sm text-gray-500 mt-1">Quản lý các mẫu email cho chiến dịch marketing</p>
        </div>
      </div>

      {/* Template Type Tabs */}
      <div className="flex items-center space-x-1 border-b border-gray-200">
        <button
          onClick={() => setTemplateTab('system')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            templateTab === 'system'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Mẫu Email có sẵn
        </button>
        <button
          onClick={() => setTemplateTab('user')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            templateTab === 'user'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Mẫu Email của bạn
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Tìm kiếm theo tên mẫu..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Template Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {/* Create New Template Card */}
        {templateTab === 'user' && (
          <div className="group relative bg-white border-2 border-dashed border-gray-300 rounded-xl p-6 hover:border-blue-400 hover:bg-blue-50/50 transition-all cursor-pointer flex flex-col items-center justify-center min-h-[280px]">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors">
              <Plus className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Tạo mẫu mới</h3>
            <p className="text-sm text-gray-500 text-center">Thỏa sức sáng tạo nội dung email của bạn</p>
          </div>
        )}

        {/* Template Cards */}
        {filteredTemplates.map((template) => (
          <div
            key={template.id}
            className="group relative bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg hover:border-blue-300 transition-all"
          >
            {/* Thumbnail */}
            <div className="aspect-[4/3] bg-gradient-to-br from-gray-100 to-gray-200 relative overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-full h-full p-4 flex items-center justify-center">
                  <div className="w-full h-full bg-white rounded shadow-sm border flex flex-col p-3">
                    <div className="h-3 w-3/4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-2 w-full bg-gray-100 rounded mb-1"></div>
                    <div className="h-2 w-5/6 bg-gray-100 rounded mb-1"></div>
                    <div className="h-2 w-4/6 bg-gray-100 rounded mb-3"></div>
                    <div className="h-6 w-1/3 bg-blue-500 rounded mt-auto"></div>
                  </div>
                </div>
              </div>
              
              {/* Hover Actions */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
                <button
                  onClick={() => {
                    setSelectedTemplate(template)
                    setShowTemplatePreview(true)
                  }}
                  className="px-3 py-2 bg-white rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors flex items-center space-x-1"
                >
                  <Eye className="w-4 h-4" />
                  <span>Xem trước</span>
                </button>
                <button className="px-3 py-2 bg-white rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors flex items-center space-x-1">
                  <Copy className="w-4 h-4" />
                  <span>Tạo bản sao</span>
                </button>
              </div>
            </div>

            {/* Template Info */}
            <div className="p-4">
              <h3 className="font-medium text-gray-900 truncate">{template.name}</h3>
              <p className="text-xs text-gray-500 mt-1">
                {template.type === 'system' ? 'Mẫu hệ thống' : `Cập nhật: ${formatDate(template.updatedAt)}`}
              </p>
            </div>

            {/* User Template Actions */}
            {template.type === 'user' && (
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="flex items-center space-x-1">
                  <button className="p-1.5 bg-white rounded-lg shadow hover:bg-gray-100" title="Chỉnh sửa">
                    <Edit className="w-4 h-4 text-gray-600" />
                  </button>
                  <button className="p-1.5 bg-white rounded-lg shadow hover:bg-red-50" title="Xóa">
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredTemplates.length === 0 && templateTab === 'user' && (
        <div className="text-center py-12 bg-gray-50 rounded-xl">
          <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 mb-2">Bạn chưa có mẫu email nào</p>
          <p className="text-sm text-gray-400">Tạo mẫu mới hoặc sao chép từ mẫu có sẵn</p>
        </div>
      )}
    </div>
  )

  // ==================== RENDER REPORTS TAB ====================
  const renderReportsTab = () => {
    const totalSent = campaigns.reduce((sum, c) => sum + c.stats.totalSent, 0)
    const totalDelivered = campaigns.reduce((sum, c) => sum + c.stats.delivered, 0)
    const totalOpened = campaigns.reduce((sum, c) => sum + c.stats.opened, 0)
    const totalClicked = campaigns.reduce((sum, c) => sum + c.stats.clicked, 0)
    const totalBounced = campaigns.reduce((sum, c) => sum + c.stats.bounced, 0)
    
    const deliveryRate = totalSent > 0 ? (totalDelivered / totalSent * 100) : 0
    const openRate = totalDelivered > 0 ? (totalOpened / totalDelivered * 100) : 0
    const clickRate = totalDelivered > 0 ? (totalClicked / totalDelivered * 100) : 0
    const bounceRate = totalSent > 0 ? (totalBounced / totalSent * 100) : 0

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Báo cáo chất lượng Email</h2>
            <p className="text-sm text-gray-500 mt-1">Thống kê và phân tích hiệu quả chiến dịch email</p>
          </div>
          <div className="flex items-center space-x-3">
            <select className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500">
              <option>Tháng này</option>
              <option>Tuần này</option>
              <option>7 ngày qua</option>
              <option>30 ngày qua</option>
              <option>Quý này</option>
            </select>
            <button className="flex items-center space-x-2 px-4 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50">
              <Download className="w-4 h-4" />
              <span>Xuất báo cáo</span>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-white p-5 rounded-xl border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Tổng gửi</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{totalSent.toLocaleString()}</p>
              </div>
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Send className="w-5 h-5 text-blue-600" />
              </div>
            </div>
            <div className="flex items-center mt-2 text-xs">
              <TrendingUp className="w-3 h-3 text-green-500 mr-1" />
              <span className="text-green-600">+15%</span>
              <span className="text-gray-400 ml-1">so với kỳ trước</span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Thành công</p>
                <p className="text-2xl font-bold text-green-600 mt-1">{deliveryRate.toFixed(1)}%</p>
              </div>
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
            </div>
            <div className="flex items-center mt-2 text-xs">
              <TrendingUp className="w-3 h-3 text-green-500 mr-1" />
              <span className="text-green-600">+0.5%</span>
              <span className="text-gray-400 ml-1">so với kỳ trước</span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Tỷ lệ mở</p>
                <p className="text-2xl font-bold text-blue-600 mt-1">{openRate.toFixed(1)}%</p>
              </div>
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <MailOpen className="w-5 h-5 text-blue-600" />
              </div>
            </div>
            <div className="flex items-center mt-2 text-xs">
              <TrendingDown className="w-3 h-3 text-red-500 mr-1" />
              <span className="text-red-600">-2.1%</span>
              <span className="text-gray-400 ml-1">so với kỳ trước</span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Tỷ lệ click</p>
                <p className="text-2xl font-bold text-purple-600 mt-1">{clickRate.toFixed(1)}%</p>
              </div>
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <MousePointer className="w-5 h-5 text-purple-600" />
              </div>
            </div>
            <div className="flex items-center mt-2 text-xs">
              <TrendingUp className="w-3 h-3 text-green-500 mr-1" />
              <span className="text-green-600">+1.2%</span>
              <span className="text-gray-400 ml-1">so với kỳ trước</span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Tỷ lệ bounce</p>
                <p className="text-2xl font-bold text-red-600 mt-1">{bounceRate.toFixed(1)}%</p>
              </div>
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
            </div>
            <div className="flex items-center mt-2 text-xs">
              <TrendingDown className="w-3 h-3 text-green-500 mr-1" />
              <span className="text-green-600">-0.3%</span>
              <span className="text-gray-400 ml-1">so với kỳ trước</span>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Trend Chart */}
          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Xu hướng theo ngày</h3>
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
              <div className="text-center">
                <BarChart3 className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-500 text-sm">Biểu đồ xu hướng</p>
                <p className="text-gray-400 text-xs">(Tích hợp chart library sau)</p>
              </div>
            </div>
            <div className="flex items-center justify-center space-x-6 mt-4 text-sm">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                <span className="text-gray-600">Đã gửi</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                <span className="text-gray-600">Đã mở</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
                <span className="text-gray-600">Đã click</span>
              </div>
            </div>
          </div>

          {/* Campaign Comparison */}
          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">So sánh chiến dịch</h3>
            <div className="space-y-4">
              {campaigns.filter(c => c.stats.totalSent > 0).slice(0, 5).map((campaign, index) => (
                <div key={campaign.id} className="flex items-center">
                  <div className="w-32 truncate text-sm text-gray-600">{campaign.name}</div>
                  <div className="flex-1 mx-4">
                    <div className="h-4 bg-gray-100 rounded-full overflow-hidden flex">
                      <div 
                        className="bg-green-500 h-full"
                        style={{ width: `${campaign.stats.delivered / campaign.stats.totalSent * 100}%` }}
                      ></div>
                      <div 
                        className="bg-red-500 h-full"
                        style={{ width: `${campaign.stats.bounced / campaign.stats.totalSent * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="w-20 text-right text-sm">
                    <span className="text-green-600 font-medium">
                      {Math.round(campaign.stats.delivered / campaign.stats.totalSent * 100)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Detailed Table */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">Chi tiết theo chiến dịch</h3>
            <button className="flex items-center space-x-2 text-sm text-blue-600 hover:text-blue-700">
              <Download className="w-4 h-4" />
              <span>Xuất Excel</span>
            </button>
          </div>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Chiến dịch</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Đã gửi</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Thành công</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Đã mở</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Đã click</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Bounce</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Unsubscribe</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {campaigns.filter(c => c.stats.totalSent > 0).map((campaign) => (
                <tr key={campaign.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{campaign.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-600 text-right">{campaign.stats.totalSent.toLocaleString()}</td>
                  <td className="px-6 py-4 text-sm text-green-600 text-right">
                    {campaign.stats.delivered.toLocaleString()}
                    <span className="text-gray-400 ml-1">
                      ({Math.round(campaign.stats.delivered / campaign.stats.totalSent * 100)}%)
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-blue-600 text-right">
                    {campaign.stats.opened.toLocaleString()}
                    <span className="text-gray-400 ml-1">
                      ({Math.round(campaign.stats.opened / campaign.stats.delivered * 100)}%)
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-purple-600 text-right">
                    {campaign.stats.clicked.toLocaleString()}
                    <span className="text-gray-400 ml-1">
                      ({Math.round(campaign.stats.clicked / campaign.stats.delivered * 100)}%)
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-red-600 text-right">
                    {campaign.stats.bounced.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-orange-600 text-right">
                    {campaign.stats.unsubscribed}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )
  }

  // ==================== RENDER SETTINGS TAB ====================
  const renderSettingsTab = () => (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900">Cấu hình Email Marketing</h2>
        <p className="text-sm text-gray-500 mt-1">Quản lý email gửi và giới hạn hệ thống</p>
      </div>

      {/* Settings Sub-tabs */}
      <div className="flex items-center space-x-1 border-b border-gray-200">
        <button
          onClick={() => setSettingsTab('sender')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            settingsTab === 'sender'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Cấu hình email gửi
        </button>
        <button
          onClick={() => setSettingsTab('limits')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            settingsTab === 'limits'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Giới hạn gửi email
        </button>
      </div>

      {/* Sender Emails */}
      {settingsTab === 'sender' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">Quản lý danh sách email dùng để gửi chiến dịch</p>
            <button
              onClick={() => setShowAddSenderModal(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Thêm mới</span>
            </button>
          </div>

          {/* Sender Emails Table */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Người gửi</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ngày tạo</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Trạng thái</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quyền sử dụng</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {senderEmails.map((sender) => (
                  <tr key={sender.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{sender.email}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{sender.senderName}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{formatDate(sender.createdAt)}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(sender.status)}`}>
                        {getStatusLabel(sender.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {sender.permission === 'all' ? 'Toàn bộ thành viên' : 
                       sender.permission === 'me' ? 'Chỉ tôi' : 'Thành viên cụ thể'}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded" title="Chỉnh sửa">
                          <Edit className="w-4 h-4" />
                        </button>
                        {sender.status === 'pending' && (
                          <button className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded" title="Gửi lại xác thực">
                            <RefreshCw className="w-4 h-4" />
                          </button>
                        )}
                        <button className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded" title="Xóa">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Email Limits */}
      {settingsTab === 'limits' && (
        <div className="space-y-6 max-w-2xl">
          {/* Daily Limit */}
          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <h3 className="font-medium text-gray-900 mb-4">Giới hạn gửi theo ngày</h3>
            <div className="flex items-center space-x-4 mb-3">
              <input
                type="number"
                value={emailLimits.dailyLimit}
                onChange={(e) => setEmailLimits({...emailLimits, dailyLimit: parseInt(e.target.value)})}
                className="w-32 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-gray-600">email/ngày</span>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Đã sử dụng hôm nay:</span>
                <span className="font-medium">{emailLimits.dailyUsed} / {emailLimits.dailyLimit}</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all ${
                    emailLimits.dailyUsed / emailLimits.dailyLimit > 0.9 ? 'bg-red-500' :
                    emailLimits.dailyUsed / emailLimits.dailyLimit > 0.8 ? 'bg-yellow-500' : 'bg-green-500'
                  }`}
                  style={{ width: `${(emailLimits.dailyUsed / emailLimits.dailyLimit) * 100}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500">{Math.round(emailLimits.dailyUsed / emailLimits.dailyLimit * 100)}% đã sử dụng</p>
            </div>
          </div>

          {/* Monthly Limit */}
          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <h3 className="font-medium text-gray-900 mb-4">Giới hạn gửi theo tháng</h3>
            <div className="flex items-center space-x-4 mb-3">
              <input
                type="number"
                value={emailLimits.monthlyLimit}
                onChange={(e) => setEmailLimits({...emailLimits, monthlyLimit: parseInt(e.target.value)})}
                className="w-32 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-gray-600">email/tháng</span>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Đã sử dụng tháng này:</span>
                <span className="font-medium">{emailLimits.monthlyUsed.toLocaleString()} / {emailLimits.monthlyLimit.toLocaleString()}</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all ${
                    emailLimits.monthlyUsed / emailLimits.monthlyLimit > 0.9 ? 'bg-red-500' :
                    emailLimits.monthlyUsed / emailLimits.monthlyLimit > 0.8 ? 'bg-yellow-500' : 'bg-green-500'
                  }`}
                  style={{ width: `${(emailLimits.monthlyUsed / emailLimits.monthlyLimit) * 100}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500">{Math.round(emailLimits.monthlyUsed / emailLimits.monthlyLimit * 100)}% đã sử dụng</p>
            </div>
          </div>

          {/* Per Sender Limit */}
          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <h3 className="font-medium text-gray-900 mb-4">Giới hạn theo email người gửi</h3>
            <div className="flex items-center space-x-4">
              <input
                type="number"
                value={emailLimits.perSenderDailyLimit}
                onChange={(e) => setEmailLimits({...emailLimits, perSenderDailyLimit: parseInt(e.target.value)})}
                className="w-32 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-gray-600">email/ngày/email gửi</span>
            </div>
          </div>

          {/* Delay Between Emails */}
          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <h3 className="font-medium text-gray-900 mb-4">Khoảng cách giữa các email</h3>
            <div className="flex items-center space-x-4">
              <input
                type="number"
                value={emailLimits.delayBetweenEmails}
                onChange={(e) => setEmailLimits({...emailLimits, delayBetweenEmails: parseInt(e.target.value)})}
                className="w-32 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-gray-600">giây</span>
            </div>
          </div>

          <button className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
            Lưu thay đổi
          </button>
        </div>
      )}
    </div>
  )

  // ==================== CREATE CAMPAIGN MODAL ====================
  const CreateCampaignModal = () => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Tạo chiến dịch mới</h3>
          <button onClick={() => setShowCreateCampaignModal(false)} className="p-1 hover:bg-gray-100 rounded">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        <div className="p-6 space-y-4">
          {/* Campaign Type */}
          <div className="flex items-center space-x-4">
            <button className="flex-1 p-4 border-2 border-blue-500 rounded-lg bg-blue-50 text-center">
              <Mail className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <p className="font-medium text-blue-700">Chiến dịch thường</p>
            </button>
            <button className="flex-1 p-4 border-2 border-gray-200 rounded-lg hover:border-gray-300 text-center">
              <Zap className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="font-medium text-gray-600">Chiến dịch A/B</p>
            </button>
          </div>

          {/* Campaign Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tên chiến dịch *</label>
            <input
              type="text"
              placeholder={`Chiến dịch ${new Date().toLocaleDateString('vi-VN')}`}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
        <div className="flex items-center justify-end space-x-3 p-4 border-t border-gray-200">
          <button 
            onClick={() => setShowCreateCampaignModal(false)}
            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Hủy
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Bắt đầu
          </button>
        </div>
      </div>
    </div>
  )

  // ==================== ADD SENDER MODAL ====================
  const AddSenderModal = () => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Thêm email người gửi mới</h3>
          <button onClick={() => setShowAddSenderModal(false)} className="p-1 hover:bg-gray-100 rounded">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ Email người gửi *</label>
            <input
              type="email"
              placeholder="email@company.vn"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p className="mt-1 text-xs text-yellow-600 flex items-center">
              <AlertCircle className="w-3 h-3 mr-1" />
              Khuyến nghị dùng email doanh nghiệp để tránh bị spam
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tên người gửi *</label>
            <input
              type="text"
              placeholder="Nhập tên bạn muốn khách hàng nhìn thấy"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Quyền sử dụng Email này *</label>
            <select className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option value="all">Toàn bộ thành viên dự án</option>
              <option value="me">Chỉ tôi</option>
              <option value="specific">Chọn thành viên cụ thể</option>
            </select>
          </div>
        </div>
        <div className="flex items-center justify-end space-x-3 p-4 border-t border-gray-200">
          <button 
            onClick={() => setShowAddSenderModal(false)}
            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Hủy bỏ
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Thêm và xác nhận
          </button>
        </div>
      </div>
    </div>
  )

  // ==================== TEMPLATE PREVIEW MODAL ====================
  const TemplatePreviewModal = () => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl mx-4 max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">{selectedTemplate?.name}</h3>
          <button onClick={() => setShowTemplatePreview(false)} className="p-1 hover:bg-gray-100 rounded">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        
        {/* Preview Mode Toggle */}
        <div className="flex items-center justify-center space-x-2 p-4 border-b border-gray-100">
          <button className="flex items-center space-x-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg">
            <Monitor className="w-4 h-4" />
            <span>Desktop</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-100 text-gray-600 rounded-lg">
            <Smartphone className="w-4 h-4" />
            <span>Mobile</span>
          </button>
        </div>

        {/* Preview Content */}
        <div className="flex-1 overflow-auto p-6 bg-gray-100">
          <div className="max-w-[600px] mx-auto bg-white rounded-lg shadow-sm p-6">
            <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 min-h-[400px]">
              <div className="text-center mb-6">
                <div className="w-24 h-24 bg-blue-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Mail className="w-12 h-12 text-blue-500" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Xin chào <span className="bg-yellow-100 text-yellow-800 px-1 rounded">{'{ten_khach}'}</span>!
              </h2>
              <p className="text-gray-600 mb-4">
                Cảm ơn bạn đã đăng ký nhận thông tin từ chúng tôi. 
                Chúng tôi rất vui được chào đón bạn!
              </p>
              <p className="text-gray-600 mb-6">
                Để bắt đầu, hãy khám phá các sản phẩm và dịch vụ của chúng tôi.
              </p>
              <button className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium">
                Khám phá ngay
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end space-x-3 p-4 border-t border-gray-200">
          <button 
            onClick={() => setShowTemplatePreview(false)}
            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Đóng
          </button>
          <button className="px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
            Tạo bản sao
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Sử dụng ngay
          </button>
        </div>
      </div>
    </div>
  )

  // ==================== CAMPAIGN DETAIL MODAL ====================
  const CampaignDetailModal = () => {
    if (!selectedCampaign) return null
    
    const openRate = selectedCampaign.stats.delivered > 0 
      ? (selectedCampaign.stats.opened / selectedCampaign.stats.delivered * 100) 
      : 0
    const clickRate = selectedCampaign.stats.delivered > 0 
      ? (selectedCampaign.stats.clicked / selectedCampaign.stats.delivered * 100) 
      : 0

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl mx-4 max-h-[90vh] overflow-hidden flex flex-col">
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <button 
                onClick={() => setShowCampaignDetail(false)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <ArrowLeft className="w-5 h-5 text-gray-500" />
              </button>
              <div>
                <div className="flex items-center space-x-2">
                  {selectedCampaign.type === 'ab' && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-700">
                      A/B
                    </span>
                  )}
                  <h3 className="text-lg font-semibold text-gray-900">{selectedCampaign.name}</h3>
                </div>
                <p className="text-sm text-gray-500">
                  {selectedCampaign.startedAt ? `Gửi ngày: ${formatDateTime(selectedCampaign.startedAt)}` : `Tạo ngày: ${formatDate(selectedCampaign.createdAt)}`}
                </p>
              </div>
            </div>
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedCampaign.status)}`}>
              {getStatusLabel(selectedCampaign.status)}
            </span>
          </div>
          
          <div className="flex-1 overflow-auto p-6 space-y-6">
            {/* Stats Overview */}
            <div className="grid grid-cols-5 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg text-center">
                <p className="text-2xl font-bold text-gray-900">{selectedCampaign.stats.totalSent.toLocaleString()}</p>
                <p className="text-sm text-gray-500">Tổng gửi</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg text-center">
                <p className="text-2xl font-bold text-green-600">{selectedCampaign.stats.delivered.toLocaleString()}</p>
                <p className="text-sm text-gray-500">Thành công ({selectedCampaign.stats.totalSent > 0 ? Math.round(selectedCampaign.stats.delivered / selectedCampaign.stats.totalSent * 100) : 0}%)</p>
              </div>
              <div className="bg-red-50 p-4 rounded-lg text-center">
                <p className="text-2xl font-bold text-red-600">{selectedCampaign.stats.bounced}</p>
                <p className="text-sm text-gray-500">Thất bại</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg text-center">
                <p className="text-2xl font-bold text-blue-600">{selectedCampaign.stats.opened.toLocaleString()}</p>
                <p className="text-sm text-gray-500">Đã mở ({openRate.toFixed(1)}%)</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg text-center">
                <p className="text-2xl font-bold text-purple-600">{selectedCampaign.stats.clicked}</p>
                <p className="text-sm text-gray-500">Đã click ({clickRate.toFixed(1)}%)</p>
              </div>
            </div>

            {/* A/B Testing Results */}
            {selectedCampaign.type === 'ab' && selectedCampaign.abWinner && (
              <div className="bg-purple-50 border border-purple-200 rounded-xl p-6">
                <h4 className="font-semibold text-purple-900 mb-4">Kết quả A/B Testing: Tiêu đề</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className={`p-4 rounded-lg ${selectedCampaign.abWinner === 'a' ? 'bg-white border-2 border-purple-500' : 'bg-white/50'}`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">Phiên bản A</span>
                      {selectedCampaign.abWinner === 'a' && (
                        <span className="text-xs bg-purple-500 text-white px-2 py-0.5 rounded">🏆 Winner</span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{selectedCampaign.subject}</p>
                  </div>
                  <div className={`p-4 rounded-lg ${selectedCampaign.abWinner === 'b' ? 'bg-white border-2 border-purple-500' : 'bg-white/50'}`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">Phiên bản B</span>
                      {selectedCampaign.abWinner === 'b' && (
                        <span className="text-xs bg-purple-500 text-white px-2 py-0.5 rounded">🏆 Winner</span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{selectedCampaign.subjectB}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Campaign Info */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h4 className="font-semibold text-gray-900 mb-4">Thông tin chiến dịch</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Tiêu đề:</span>
                  <p className="font-medium text-gray-900">{selectedCampaign.subject}</p>
                </div>
                <div>
                  <span className="text-gray-500">Người tạo:</span>
                  <p className="font-medium text-gray-900">{selectedCampaign.createdBy}</p>
                </div>
                <div>
                  <span className="text-gray-500">Người nhận:</span>
                  <p className="font-medium text-gray-900">{selectedCampaign.validEmailCount.toLocaleString()} email</p>
                </div>
                <div>
                  <span className="text-gray-500">Loại gửi:</span>
                  <p className="font-medium text-gray-900">
                    {selectedCampaign.sendType === 'immediate' ? 'Gửi ngay' : 
                     selectedCampaign.sendType === 'scheduled' ? 'Lên lịch' : 'Gửi theo đợt'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end space-x-3 p-4 border-t border-gray-200">
            <button 
              onClick={() => setShowCampaignDetail(false)}
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Đóng
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <Download className="w-4 h-4" />
              <span>Xuất báo cáo</span>
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Tạo bản sao
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ==================== MAIN RENDER ====================
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Email Marketing</h1>
          <p className="text-gray-600 mt-1">Quản lý chiến dịch và mẫu email marketing</p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`group inline-flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-500'}`} />
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'campaigns' && renderCampaignsTab()}
        {activeTab === 'templates' && renderTemplatesTab()}
        {activeTab === 'reports' && renderReportsTab()}
        {activeTab === 'settings' && renderSettingsTab()}
      </div>

      {/* Modals */}
      {showCreateCampaignModal && <CreateCampaignModal />}
      {showAddSenderModal && <AddSenderModal />}
      {showTemplatePreview && selectedTemplate && <TemplatePreviewModal />}
      {showCampaignDetail && selectedCampaign && <CampaignDetailModal />}
    </div>
  )
}
