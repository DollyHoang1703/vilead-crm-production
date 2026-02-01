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

// Import new email configuration components
import { SenderEmailConfig, EmailLimitsConfig, TemplateLibrary } from './email-marketing'
import { CampaignList, NormalCampaignEditor, ABCampaignEditor, CampaignDetailModal as CampaignDetailView } from './email-marketing/campaigns'
import { EmailReportsDashboard } from './email-marketing/reports'
import { useCampaigns } from './email-marketing/hooks'
import type { Campaign as CampaignType, CampaignFormData, SendType, BatchSchedule } from './email-marketing/types'

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

  // ==================== CAMPAIGN EDITOR STATE ====================
  const [showCampaignEditor, setShowCampaignEditor] = useState(false)
  const [showABEditor, setShowABEditor] = useState(false)
  const [editingCampaign, setEditingCampaign] = useState<CampaignType | null>(null)
  const [campaignEditorMode, setCampaignEditorMode] = useState<'create' | 'edit'>('create')
  const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(null)

  // Campaign hooks for editor actions
  const campaignsHook = useCampaigns()

  // Handle open campaign editor (normal or A/B)
  const handleOpenCampaignEditor = (campaign?: CampaignType, mode?: 'create' | 'edit', type?: 'normal' | 'ab') => {
    setEditingCampaign(campaign || null)
    setCampaignEditorMode(mode || 'create')
    if (type === 'ab' || campaign?.type === 'ab') {
      setShowABEditor(true)
      setShowCampaignEditor(false)
    } else {
      setShowCampaignEditor(true)
      setShowABEditor(false)
    }
  }

  // Handle open A/B editor
  const handleOpenABEditor = () => {
    setEditingCampaign(null)
    setCampaignEditorMode('create')
    setShowABEditor(true)
    setShowCampaignEditor(false)
  }

  // Handle view campaign detail
  const handleViewCampaignDetail = (campaign: CampaignType) => {
    setSelectedCampaignId(campaign.id)
    setShowCampaignDetail(true)
  }

  // Handle save campaign
  const handleSaveCampaign = async (data: Partial<CampaignFormData>) => {
    if (campaignEditorMode === 'create') {
      return await campaignsHook.createCampaign(data as CampaignFormData)
    } else if (editingCampaign) {
      return await campaignsHook.updateCampaign(editingCampaign.id, data as CampaignFormData)
    }
    return { success: false, message: 'Invalid state' }
  }

  // Handle start campaign
  const handleStartCampaign = async (id: string, sendType: SendType, scheduledAt?: Date | null, batches?: BatchSchedule[]) => {
    return await campaignsHook.startCampaign(id, sendType, scheduledAt, batches)
  }

  // ==================== RENDER CAMPAIGNS TAB ====================
  const renderCampaignsTab = () => (
    <div className="space-y-6">
      {showCampaignEditor ? (
        <NormalCampaignEditor
          campaign={editingCampaign}
          mode={campaignEditorMode}
          onSave={handleSaveCampaign}
          onStart={handleStartCampaign}
          onClose={() => {
            setShowCampaignEditor(false)
            setEditingCampaign(null)
          }}
        />
      ) : showABEditor ? (
        <ABCampaignEditor
          campaign={editingCampaign}
          onClose={() => {
            setShowABEditor(false)
            setEditingCampaign(null)
          }}
          onSave={(campaign) => {
            campaignsHook.createCampaign(campaign as any)
            setShowABEditor(false)
            setEditingCampaign(null)
          }}
          onStart={(campaign) => {
            campaignsHook.createCampaign(campaign as any)
            setShowABEditor(false)
            setEditingCampaign(null)
          }}
        />
      ) : (
        <CampaignList
          onOpenEditor={handleOpenCampaignEditor}
          onOpenABEditor={handleOpenABEditor}
          onViewStats={handleViewCampaignDetail}
        />
      )}
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

      {/* Template Library Component */}
      <TemplateLibrary />
    </div>
  )

  // ==================== RENDER REPORTS TAB (Enhanced - Task 10.5) ====================
  const renderReportsTab = () => {
    // Handler to navigate to campaign detail when clicking on a campaign in reports
    const handleViewCampaignFromReport = (campaignId: string) => {
      // Find the campaign and open detail view
      const campaign = campaigns.find(c => c.id === campaignId)
      if (campaign) {
        setSelectedCampaign(campaign)
        setShowCampaignDetail(true)
      }
    }

    return (
      <EmailReportsDashboard onViewCampaign={handleViewCampaignFromReport} />
    )
  }

  // ==================== RENDER SETTINGS TAB ====================
  // ==================== RENDER SETTINGS TAB (Enhanced) ====================
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
          className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
            settingsTab === 'sender'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Cấu hình email gửi
        </button>
        <button
          onClick={() => setSettingsTab('limits')}
          className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
            settingsTab === 'limits'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Giới hạn gửi email
        </button>
      </div>

      {/* Sender Emails - Using Enhanced Component */}
      {settingsTab === 'sender' && <SenderEmailConfig />}

      {/* Email Limits - Using Enhanced Component */}
      {settingsTab === 'limits' && <EmailLimitsConfig />}
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
      {showCampaignDetail && selectedCampaignId && (
        <CampaignDetailView
          campaignId={selectedCampaignId}
          onClose={() => {
            setShowCampaignDetail(false)
            setSelectedCampaignId(null)
          }}
        />
      )}
    </div>
  )
}
