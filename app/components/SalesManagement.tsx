'use client'

import { useState } from 'react'
import {
  Plus,
  Search,
  Filter,
  MoreVertical,
  Phone,
  Mail,
  Eye,
  Calendar,
  DollarSign,
  User,
  Building2,
  TrendingUp,
  Target,
  Users,
  Briefcase,
  ArrowRight,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle,
  Check,
  Clock,
  AlertCircle,
  XCircle,
  Activity,
  Bot,
  Table,
  LayoutGrid,
  HelpCircle,
  Download,
  Settings,
  X,
  Trash2,
  Edit,
  MessageSquare,
  MessageSquarePlus,
  Send,
  Save,
  Columns,
  MapPin,
  Percent,
  ChevronDown,
  StickyNote,
  Upload,
  FileText,
  Download as DownloadIcon,
  Paperclip,
  Sliders,
  Info,
  AlertTriangle,
  CheckSquare
} from 'lucide-react'
import { CreatableSelect, CreatableSelectOption } from '@/components/ui/creatable-select'
import { SalesTable } from './sales/components/SalesTable'
import type { Lead as LeadType, ColumnVisibility } from './sales/types/lead.types'
import CustomerDetailModal from './CustomerDetailModal'

interface Lead {
  id: number
  name: string
  phone: string
  email: string
  source: string
  region: string
  product: string
  tags: string[]
  content: string
  status: 'new' | 'contacted' | 'qualified' | 'proposal' | 'negotiation' | 'payment_pending' | 'converted' | 'lost'
  stage: string
  notes: string
  assignedTo: string
  value: number
  lastContactedAt: string | null
  createdAt: string
  updatedAt: string
  type: 'lead'
  company?: string
  position?: string
  nextAction: string
  nextActionDate: string
  careCount?: number
  assignee?: string
  department?: string
  team?: string
  lastContact?: string
  interactions?: number
  priority?: string
  interestedProducts?: string[]
  quickNotes?: Array<{
    content: string
    timestamp: string
    author: string
  }>
  // New fields for 23-column display
  address?: string
  customerType: 'individual' | 'business'
  winProbability?: number
  interactionCount: number
  lastInteractionAt: string | null
  // Files đính kèm
  files?: Array<{
    name: string
    size: string
    type: string
    uploadedAt: string
  }>
  // Discount fields
  discountPercent?: number
  originalValue?: number
  // Estimated revenue
  estimatedRevenue?: string | number
}

interface MetricData {
  id: string
  title: string
  value: number
  previousValue: number
  percentageChange: number
  icon: React.ReactNode
  color: string
  bgColor: string
  trend?: 'up' | 'down' | 'neutral'
  clickAction: () => void
}

// Helper function to convert Lead to Customer format for CustomerDetailModal
const convertLeadToCustomer = (lead: Lead) => ({
  id: lead.id,
  name: lead.name,
  contact: lead.phone,
  email: lead.email,
  phone2: undefined,
  company: lead.company,
  position: lead.position,
  address: lead.address,
  city: lead.region,
  status: lead.status === 'converted' ? 'active' : lead.status === 'new' ? 'new' : 'consulting',
  customerType: lead.customerType === 'business' ? 'Doanh nghiệp' : 'Cá nhân',
  dateOfBirth: undefined,
  source: lead.source,
  assignedPerson: lead.assignedTo || lead.assignee,
  interestedProduct: lead.product || (lead.interestedProducts ? lead.interestedProducts.join(', ') : undefined),
  leadValue: lead.value,
  successRate: lead.winProbability,
  createdAt: lead.createdAt,
  updatedAt: lead.updatedAt,
  lastContactAt: lead.lastContactedAt || lead.lastContact || undefined,
  totalOrders: 0,
  totalSpent: lead.value || 0,
  lastOrderDate: undefined,
  lastInteraction: (lead.lastInteractionAt || lead.lastContactedAt) ?? undefined,
  lastPurchaseDate: undefined,
  tags: lead.tags?.map((tag, index) => ({ id: String(index), name: tag, color: 'bg-blue-100 text-blue-800' })),
  notes: lead.quickNotes?.map((note, index) => ({
    id: String(index),
    content: note.content,
    createdAt: note.timestamp,
    createdBy: note.author,
    attachments: []
  })),
  orders: [],
  tasks: [],
  history: []
})

export default function SalesManagement() {
  const [activeTab, setActiveTab] = useState<'pipeline'>('pipeline')
  const [viewMode, setViewMode] = useState<'table' | 'kanban'>('table')
  const [showFilters, setShowFilters] = useState(false)
  const [notification, setNotification] = useState<{ message: string, type: 'success' | 'error' } | null>(null)
  const [selectedMetric, setSelectedMetric] = useState<string | null>(null)
  const [draggedLead, setDraggedLead] = useState<Lead | null>(null)
  const [showAutoAssignModal, setShowAutoAssignModal] = useState(false)
  const [isAutoAssignEnabled, setIsAutoAssignEnabled] = useState(false)
  const [autoAssignStrategy, setAutoAssignStrategy] = useState('round_robin')
  const [selectedPipelineStage, setSelectedPipelineStage] = useState<string | null>(null)
  const [showTooltip, setShowTooltip] = useState<string | null>(null)
  const [showAutoAssignTooltip, setShowAutoAssignTooltip] = useState<string | null>(null)
  const [openActionMenuId, setOpenActionMenuId] = useState<number | null>(null)
  const [showLeadDetailModal, setShowLeadDetailModal] = useState(false)
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
  const [activeDetailTab, setActiveDetailTab] = useState<'contact' | 'history' | 'notes'>('contact')
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingLead, setEditingLead] = useState<Lead | null>(null)
  const [showConvertModal, setShowConvertModal] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState('')
  const [selectedProducts, setSelectedProducts] = useState<string[]>([])
  const [selectedPackages, setSelectedPackages] = useState<{ [productId: string]: string }>({}) // Track package for each product
  const [productQuantities, setProductQuantities] = useState<{ [productId: string]: number }>({}) // Track quantity for each product
  const [orderNotes, setOrderNotes] = useState('') // Order notes
  const [discountPercent, setDiscountPercent] = useState(0)
  const [discountType, setDiscountType] = useState<'%' | 'VND'>('%')
  const [paymentMethod, setPaymentMethod] = useState('cash')
  const [selectedCategory, setSelectedCategory] = useState('Tất cả')
  const [paymentDeadline, setPaymentDeadline] = useState<string>('')
  const [paymentMode, setPaymentMode] = useState<'full' | 'installment'>('full')
  const [paymentInstallments, setPaymentInstallments] = useState(1)
  const [installmentData, setInstallmentData] = useState<{ amount: number; date: string }[]>([{ amount: 0, date: '' }])
  const [isEditMode, setIsEditMode] = useState(false)
  const [editedLead, setEditedLead] = useState<Lead | null>(null)
  const [showDragConvertModal, setShowDragConvertModal] = useState(false)
  const [dragTargetStatus, setDragTargetStatus] = useState<string>('')
  const [memberDailyLimits, setMemberDailyLimits] = useState<{ [memberId: number]: number }>({
    1: 5, // Minh Expert: 5 leads/day  
    2: 3, // An Expert: 3 leads/day
    3: 8, // An Sales: 8 leads/day
    4: 2, // Trần Văn Support: 2 leads/day
    5: 4, // Đỗ Thị Analytics: 4 leads/day
    6: 3, // Lê Thị Inventory: 3 leads/day
    7: 2, // Nguyễn Văn HR: 2 leads/day
    8: 5, // Trần Thị Finance: 5 leads/day
    9: 6  // Võ Văn Project: 6 leads/day
  })
  const [originalTargetStatus, setOriginalTargetStatus] = useState<string>('') // Track trạng thái gốc user kéo vào
  const [pendingDragLead, setPendingDragLead] = useState<Lead | null>(null)

  // Advanced filters state
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)
  const [filterStatus, setFilterStatus] = useState('')
  const [filterSource, setFilterSource] = useState('')
  const [filterAssignee, setFilterAssignee] = useState('')
  const [filterRegion, setFilterRegion] = useState('')
  const [filterDepartment, setFilterDepartment] = useState('')
  const [filterTeam, setFilterTeam] = useState('')
  const [filterLastContact, setFilterLastContact] = useState('')
  const [filterCreatedDate, setFilterCreatedDate] = useState({ start: '', end: '' })
  const [filterInteractionCount, setFilterInteractionCount] = useState({ min: '', max: '' })
  const [filterPriority, setFilterPriority] = useState('')
  const [filterProductInterest, setFilterProductInterest] = useState('')
  const [filterProvince, setFilterProvince] = useState('')
  const [filterTag, setFilterTag] = useState('')
  const [showProvinceDropdown, setShowProvinceDropdown] = useState(false)
  const [provinceSearchTerm, setProvinceSearchTerm] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

  // Vietnam provinces list
  const vietnamProvinces = [
    'An Giang', 'Bà Rịa - Vũng Tàu', 'Bắc Giang', 'Bắc Kạn', 'Bạc Liêu',
    'Bắc Ninh', 'Bến Tre', 'Bình Định', 'Bình Dương', 'Bình Phước',
    'Bình Thuận', 'Cà Mau', 'Cần Thơ', 'Cao Bằng', 'Đà Nẵng',
    'Đắk Lắk', 'Đắk Nông', 'Điện Biên', 'Đồng Nai', 'Đồng Tháp',
    'Gia Lai', 'Hà Giang', 'Hà Nam', 'Hà Nội', 'Hà Tĩnh',
    'Hải Dương', 'Hải Phòng', 'Hậu Giang', 'Hòa Bình', 'Hưng Yên',
    'Khánh Hòa', 'Kiên Giang', 'Kon Tum', 'Lai Châu', 'Lâm Đồng',
    'Lạng Sơn', 'Lào Cai', 'Long An', 'Nam Định', 'Nghệ An',
    'Ninh Bình', 'Ninh Thuận', 'Phú Thọ', 'Phú Yên', 'Quảng Bình',
    'Quảng Nam', 'Quảng Ngãi', 'Quảng Ninh', 'Quảng Trị', 'Sóc Trăng',
    'Sơn La', 'Tây Ninh', 'Thái Bình', 'Thái Nguyên', 'Thanh Hóa',
    'Thành phố Hà Nội', 'Thành phố Hồ Chí Minh', 'Thừa Thiên Huế', 'Tiền Giang', 'Trà Vinh',
    'Tuyên Quang', 'Vĩnh Long', 'Vĩnh Phúc', 'Yên Bái'
  ]

  const filteredProvinces = vietnamProvinces.filter(province =>
    province.toLowerCase().includes(provinceSearchTerm.toLowerCase())
  )

  // Column visibility state
  // Sales team data
  const salesTeam = [
    { id: 1, name: 'Minh Expert', department: 'CRM Solutions', title: 'Senior Sales Expert', avatar: '👨‍💼', activeLeads: 12, maxLeads: 20 },
    { id: 2, name: 'An Expert', department: 'Marketing Automation', title: 'Marketing Specialist', avatar: '👩‍💼', activeLeads: 8, maxLeads: 20 },
    { id: 3, name: 'An Sales', department: 'Enterprise Sales', title: 'Enterprise Account Manager', avatar: '👨‍💼', activeLeads: 15, maxLeads: 20 },
    { id: 4, name: 'Trần Văn Support', department: 'Customer Service', title: 'Customer Success Manager', avatar: '👩‍💼', activeLeads: 5, maxLeads: 20 },
    { id: 5, name: 'Đỗ Thị Analytics', department: 'Data Analytics', title: 'Data Analyst', avatar: '👨‍💼', activeLeads: 7, maxLeads: 20 },
    { id: 6, name: 'Lê Thị Inventory', department: 'Supply Chain', title: 'Supply Chain Manager', avatar: '👩‍💼', activeLeads: 6, maxLeads: 20 },
    { id: 7, name: 'Nguyễn Văn HR', department: 'HR Solutions', title: 'HR Business Partner', avatar: '👨‍💼', activeLeads: 4, maxLeads: 20 },
    { id: 8, name: 'Trần Thị Finance', department: 'Financial Services', title: 'Financial Consultant', avatar: '👩‍💼', activeLeads: 9, maxLeads: 20 },
    { id: 9, name: 'Võ Văn Project', department: 'Project Management', title: 'Project Manager', avatar: '👨‍💼', activeLeads: 20, maxLeads: 20 }
  ]

  // Task types for bulk creation
  const taskTypes = [
    { id: 'call', name: 'Gọi điện', icon: '📞', description: 'Liên hệ qua điện thoại', color: 'bg-blue-100 text-blue-700 border-blue-200' },
    { id: 'email', name: 'Gửi email', icon: '✉️', description: 'Gửi email tư vấn', color: 'bg-green-100 text-green-700 border-green-200' },
    { id: 'zalo', name: 'Nhắn tin Zalo', icon: '💬', description: 'Liên hệ qua Zalo', color: 'bg-blue-100 text-blue-700 border-blue-200' },
    { id: 'facebook', name: 'Nhắn Facebook', icon: '👥', description: 'Nhắn tin qua Facebook', color: 'bg-blue-100 text-blue-700 border-blue-200' },
    { id: 'followup', name: 'Follow-up', icon: '🔄', description: 'Theo dõi tình hình khách hàng', color: 'bg-orange-100 text-orange-700 border-orange-200' },
    { id: 'quote', name: 'Gửi báo giá', icon: '📄', description: 'Chuẩn bị và gửi báo giá', color: 'bg-purple-100 text-purple-700 border-purple-200' },
    { id: 'demo', name: 'Demo sản phẩm', icon: '🎯', description: 'Trình diễn sản phẩm', color: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
    { id: 'meeting', name: 'Hẹn gặp mặt', icon: '🤝', description: 'Sắp xếp cuộc hẹn trực tiếp', color: 'bg-indigo-100 text-indigo-700 border-indigo-200' },
    { id: 'online', name: 'Meeting online', icon: '📹', description: 'Cuộc họp trực tuyến', color: 'bg-teal-100 text-teal-700 border-teal-200' },
    { id: 'contract', name: 'Chuẩn bị hợp đồng', icon: '📋', description: 'Soạn thảo hợp đồng', color: 'bg-gray-100 text-gray-700 border-gray-200' },
    { id: 'invoice', name: 'Gửi hóa đơn', icon: '💰', description: 'Xuất và gửi hóa đơn', color: 'bg-green-100 text-green-700 border-green-200' }
  ]

  // Available products and packages list (same as CustomersManagement)
  // Product categories
  const productCategories = ['Tất cả', 'Khóa học', 'Phần mềm', 'Dịch vụ tư vấn']

  const availableProducts = [
    // Phần mềm
    { id: 'crm-basic', name: 'CRM Basic', category: 'Phần mềm', price: 500000, description: 'Hệ thống CRM cơ bản cho doanh nghiệp nhỏ' },
    { id: 'crm-professional', name: 'CRM Professional', category: 'Phần mềm', price: 1200000, description: 'Hệ thống CRM chuyên nghiệp với nhiều tính năng nâng cao' },
    { id: 'crm-enterprise', name: 'CRM Enterprise', category: 'Phần mềm', price: 2500000, description: 'Hệ thống CRM doanh nghiệp với đầy đủ tính năng' },
    { id: 'ai-analytics', name: 'AI Analytics Module', category: 'Phần mềm', price: 800000, description: 'Module phân tích dữ liệu với AI' },
    { id: 'mobile-app', name: 'Mobile App License', category: 'Phần mềm', price: 300000, description: 'Giấy phép sử dụng ứng dụng di động' },
    // Khóa học
    { id: 'marketing-course', name: 'Khóa học Marketing Online', category: 'Khóa học', price: 2000000, description: 'Khóa học Marketing Digital toàn diện' },
    { id: 'sales-course', name: 'Khóa học Kỹ năng bán hàng', category: 'Khóa học', price: 1500000, description: 'Đào tạo kỹ năng bán hàng chuyên nghiệp' },
    { id: 'crm-training', name: 'Khóa đào tạo sử dụng CRM', category: 'Khóa học', price: 800000, description: 'Hướng dẫn sử dụng hệ thống CRM hiệu quả' },
    // Dịch vụ tư vấn
    { id: 'consulting-basic', name: 'Tư vấn triển khai cơ bản', category: 'Dịch vụ tư vấn', price: 5000000, description: 'Dịch vụ tư vấn triển khai CRM cơ bản' },
    { id: 'consulting-advanced', name: 'Tư vấn chiến lược kinh doanh', category: 'Dịch vụ tư vấn', price: 10000000, description: 'Tư vấn chiến lược và tối ưu hóa quy trình' },
    { id: 'support-package', name: 'Gói hỗ trợ kỹ thuật', category: 'Dịch vụ tư vấn', price: 3000000, description: 'Hỗ trợ kỹ thuật 24/7 trong 6 tháng' }
  ]

  // Available packages for each product
  const availablePackages = {
    // Phần mềm
    'crm-basic': [
      { id: 'basic-standard', name: 'Gói Standard', price: 0, description: 'Sản phẩm cơ bản' },
      { id: 'basic-plus', name: 'Gói Plus', price: 200000, description: 'Thêm training cơ bản + support 3 tháng' },
      { id: 'basic-premium', name: 'Gói Premium', price: 500000, description: 'Thêm training + support 6 tháng + customization' }
    ],
    'crm-professional': [
      { id: 'pro-standard', name: 'Gói Standard', price: 0, description: 'Sản phẩm cơ bản' },
      { id: 'pro-plus', name: 'Gói Plus', price: 400000, description: 'Thêm AI Analytics + training nâng cao' },
      { id: 'pro-premium', name: 'Gói Premium', price: 800000, description: 'Thêm full modules + premium support 1 năm' }
    ],
    'crm-enterprise': [
      { id: 'ent-standard', name: 'Gói Standard', price: 0, description: 'Sản phẩm cơ bản' },
      { id: 'ent-plus', name: 'Gói Plus', price: 1000000, description: 'Thêm full training + migration service' },
      { id: 'ent-premium', name: 'Gói Premium', price: 2000000, description: 'Thêm custom development + premium support 2 năm' }
    ],
    'ai-analytics': [
      { id: 'ai-standard', name: 'Gói Standard', price: 0, description: 'Module cơ bản' },
      { id: 'ai-advanced', name: 'Gói Advanced', price: 300000, description: 'Thêm custom reports + training' }
    ],
    'mobile-app': [
      { id: 'mobile-standard', name: 'Gói Standard', price: 0, description: 'License cơ bản' },
      { id: 'mobile-unlimited', name: 'Gói Unlimited', price: 150000, description: 'Unlimited users + premium features' }
    ],
    // Khóa học
    'marketing-course': [
      { id: 'marketing-course-standard', name: 'Gói Standard', price: 0, description: 'Khóa học cơ bản' },
      { id: 'marketing-course-vip', name: 'Gói VIP', price: 1000000, description: 'Thêm 1-1 coaching + certificate' }
    ],
    'sales-course': [
      { id: 'sales-course-standard', name: 'Gói Standard', price: 0, description: 'Khóa học cơ bản' },
      { id: 'sales-course-vip', name: 'Gói VIP', price: 800000, description: 'Thêm practice sessions + mentoring' }
    ],
    'crm-training': [
      { id: 'crm-training-standard', name: 'Gói Standard', price: 0, description: 'Đào tạo cơ bản' },
      { id: 'crm-training-advanced', name: 'Gói Advanced', price: 400000, description: 'Thêm advanced features + certification' }
    ],
    // Dịch vụ tư vấn
    'consulting-basic': [
      { id: 'consulting-basic-standard', name: 'Gói Standard', price: 0, description: 'Tư vấn cơ bản' },
      { id: 'consulting-basic-extended', name: 'Gói Extended', price: 2000000, description: 'Thêm follow-up 3 tháng' }
    ],
    'consulting-advanced': [
      { id: 'consulting-advanced-standard', name: 'Gói Standard', price: 0, description: 'Tư vấn chiến lược' },
      { id: 'consulting-advanced-premium', name: 'Gói Premium', price: 5000000, description: 'Thêm implementation support + 6 tháng theo dõi' }
    ],
    'support-package': [
      { id: 'support-6month', name: 'Gói 6 tháng', price: 0, description: 'Hỗ trợ 6 tháng' },
      { id: 'support-12month', name: 'Gói 12 tháng', price: 2000000, description: 'Hỗ trợ 12 tháng + priority support' }
    ]
  }

  // Helper function to format currency
  const formatCurrency = (amount: string | number) => {
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount
    return new Intl.NumberFormat('vi-VN').format(numAmount)
  }

  const [visibleColumns, setVisibleColumns] = useState({
    checkbox: true,
    stt: true,
    customerName: true,
    phone: true,
    email: true,
    source: true,
    address: true,
    stage: true,
    estimatedRevenue: false,
    salesOwner: true,
    tags: true,
    notes: true,
    createdDate: true,
    actions: true
  })

  const [showAddLeadModal, setShowAddLeadModal] = useState(false)
  const [showEditLeadModal, setShowEditLeadModal] = useState(false)
  const [showColumnModal, setShowColumnModal] = useState(false)
  const [showImportModal, setShowImportModal] = useState(false)
  const [showAddNoteModal, setShowAddNoteModal] = useState(false)
  const [selectedLeadForNote, setSelectedLeadForNote] = useState<Lead | null>(null)
  const [newNoteContent, setNewNoteContent] = useState('')
  const [selectedLeadIds, setSelectedLeadIds] = useState<number[]>([])
  const [selectAllChecked, setSelectAllChecked] = useState(false)
  const [showAssignSalesModal, setShowAssignSalesModal] = useState(false)
  const [showEditNoteModal, setShowEditNoteModal] = useState(false)
  const [showDeleteNoteConfirm, setShowDeleteNoteConfirm] = useState(false)
  const [editNoteContent, setEditNoteContent] = useState('')
  const [showCreateTaskModal, setShowCreateTaskModal] = useState(false)
  const [showBulkStatusModal, setShowBulkStatusModal] = useState(false)
  const [selectedBulkStatus, setSelectedBulkStatus] = useState('')
  const [showBulkConvertModal, setShowBulkConvertModal] = useState(false)
  const [bulkConvertTargetStatus, setBulkConvertTargetStatus] = useState('')
  const [selectedTaskType, setSelectedTaskType] = useState('')
  const [selectedTaskObj, setSelectedTaskObj] = useState<any | null>(null)

  // File management states
  const [showFileModal, setShowFileModal] = useState(false)
  const [selectedLeadForFile, setSelectedLeadForFile] = useState<Lead | null>(null)
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null)

  // Import states
  const [importFile, setImportFile] = useState<File | null>(null)
  const [importProgress, setImportProgress] = useState(0)
  const [importError, setImportError] = useState<string | null>(null)
  const [importSuccess, setImportSuccess] = useState<string | null>(null)
  const [importAutoAssign, setImportAutoAssign] = useState(false)
  const [importPreviewData, setImportPreviewData] = useState<any[]>([])
  const [showImportPreview, setShowImportPreview] = useState(false)
  const [taskDeadlineDate, setTaskDeadlineDate] = useState<string>(() => {
    const d = new Date(); d.setDate(d.getDate() + 1); return d.toISOString().slice(0, 10)
  })
  const [taskDeadlineTime, setTaskDeadlineTime] = useState<string>('09:00')
  const [taskAssignedTo, setTaskAssignedTo] = useState('')
  const [taskExtraNote, setTaskExtraNote] = useState<string>('')
  const [salesSearchTerm, setSalesSearchTerm] = useState('')
  const [salesCurrentPage, setSalesCurrentPage] = useState(1)
  // Phân chia Lead modal states — 2-step flow
  const [assignStep, setAssignStep] = useState<'step1' | 'step2' | 'loading' | 'success' | 'error'>('step1')
  const [reassignOption, setReassignOption] = useState<'skip' | 'reassign'>('skip')
  const [assignMethod, setAssignMethod] = useState<'auto' | 'manual'>('manual')
  const [selectedSalesIds, setSelectedSalesIds] = useState<number[]>([])
  const [distributionMethod, setDistributionMethod] = useState<'round_robin' | 'by_workload' | 'random'>('round_robin')
  const [assignSourceFilter, setAssignSourceFilter] = useState('')
  const [assignRegionFilter, setAssignRegionFilter] = useState('')
  const [assignType, setAssignType] = useState<'department' | 'team' | 'individual'>('department')
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([])
  const [assignTimeRange, setAssignTimeRange] = useState('24_7')
  const [assignPriority, setAssignPriority] = useState(0)
  const [quickNote, setQuickNote] = useState('')
  const [isAddingQuickNote, setIsAddingQuickNote] = useState(false)
  const [newLead, setNewLead] = useState({
    name: '',
    phone: '',
    email: '',
    company: '',
    jobTitle: '',
    industry: '',
    companySize: '',
    website: '',
    address: '',
    source: 'website',
    region: 'hanoi',
    product: '',
    content: '',
    notes: '',
    assignedTo: '',
    tags: [] as string[],
    customerType: 'individual' as 'individual' | 'business',
    estimatedRevenue: ''
  })

  // Custom options for creatable selects
  const [customSources, setCustomSources] = useState<CreatableSelectOption[]>([])
  const [customIndustries, setCustomIndustries] = useState<CreatableSelectOption[]>([])

  // Field settings modal
  const [showFieldSettingsModal, setShowFieldSettingsModal] = useState(false)
  const [leadFormFieldVisibility, setLeadFormFieldVisibility] = useState({
    name: true,
    phone: true, // Required - cannot be hidden
    email: true, // Required - cannot be hidden
    estimatedRevenue: true,
    company: true,
    jobTitle: true,
    industry: true,
    companySize: true,
    website: true,
    address: true,
    source: true,
    region: true,
    assignedTo: true,
    product: true,
    content: true,
    notes: true
  })

  // Default source options
  const defaultSourceOptions: CreatableSelectOption[] = [
    { value: 'website', label: 'Website', color: 'bg-blue-100 text-blue-700 border-blue-200' },
    { value: 'facebook', label: 'Facebook', color: 'bg-indigo-100 text-indigo-700 border-indigo-200' },
    { value: 'google', label: 'Google Ads', color: 'bg-red-100 text-red-700 border-red-200' },
    { value: 'referral', label: 'Giới thiệu', color: 'bg-green-100 text-green-700 border-green-200' },
    { value: 'cold-call', label: 'Cold Call', color: 'bg-orange-100 text-orange-700 border-orange-200' },
    { value: 'exhibition', label: 'Triển lãm', color: 'bg-purple-100 text-purple-700 border-purple-200' },
    { value: 'linkedin', label: 'LinkedIn', color: 'bg-sky-100 text-sky-700 border-sky-200' },
    { value: 'email-marketing', label: 'Email Marketing', color: 'bg-pink-100 text-pink-700 border-pink-200' },
    { value: 'webinar', label: 'Webinar', color: 'bg-teal-100 text-teal-700 border-teal-200' },
    { value: 'partner', label: 'Đối tác', color: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
  ]

  // Default industry options
  const defaultIndustryOptions: CreatableSelectOption[] = [
    { value: 'technology', label: 'Công nghệ thông tin', color: 'bg-blue-100 text-blue-700 border-blue-200' },
    { value: 'finance', label: 'Tài chính - Ngân hàng', color: 'bg-green-100 text-green-700 border-green-200' },
    { value: 'healthcare', label: 'Y tế - Sức khỏe', color: 'bg-red-100 text-red-700 border-red-200' },
    { value: 'education', label: 'Giáo dục', color: 'bg-purple-100 text-purple-700 border-purple-200' },
    { value: 'retail', label: 'Bán lẻ', color: 'bg-orange-100 text-orange-700 border-orange-200' },
    { value: 'manufacturing', label: 'Sản xuất', color: 'bg-gray-100 text-gray-700 border-gray-200' },
    { value: 'real-estate', label: 'Bất động sản', color: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
    { value: 'consulting', label: 'Tư vấn', color: 'bg-indigo-100 text-indigo-700 border-indigo-200' },
    { value: 'marketing', label: 'Marketing', color: 'bg-pink-100 text-pink-700 border-pink-200' },
    { value: 'logistics', label: 'Vận chuyển - Logistics', color: 'bg-teal-100 text-teal-700 border-teal-200' },
  ]

  // Combined options including custom ones
  const allSourceOptions = [...defaultSourceOptions, ...customSources]
  const allIndustryOptions = [...defaultIndustryOptions, ...customIndustries]

  // Handler to add new source
  const handleAddNewSource = (label: string) => {
    const newValue = label.toLowerCase().replace(/\s+/g, '-')
    const colors = ['bg-cyan-100 text-cyan-700 border-cyan-200', 'bg-emerald-100 text-emerald-700 border-emerald-200', 'bg-amber-100 text-amber-700 border-amber-200']
    const randomColor = colors[customSources.length % colors.length]
    setCustomSources(prev => [...prev, { value: newValue, label, color: randomColor }])
  }

  // Handler to add new industry
  const handleAddNewIndustry = (label: string) => {
    const newValue = label.toLowerCase().replace(/\s+/g, '-')
    const colors = ['bg-cyan-100 text-cyan-700 border-cyan-200', 'bg-emerald-100 text-emerald-700 border-emerald-200', 'bg-amber-100 text-amber-700 border-amber-200']
    const randomColor = colors[customIndustries.length % colors.length]
    setCustomIndustries(prev => [...prev, { value: newValue, label, color: randomColor }])
  }

  // Currency format helper
  const formatCurrencyInput = (value: string): string => {
    const numericValue = value.replace(/\D/g, '')
    if (!numericValue) return ''
    return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
  }

  const handleEstimatedRevenueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCurrencyInput(e.target.value)
    setNewLead(prev => ({ ...prev, estimatedRevenue: formatted }))
  }

  // Drag & Drop handlers
  const handleDragStart = (e: React.DragEvent, lead: Lead) => {
    setDraggedLead(lead)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = (e: React.DragEvent, targetStatus: string) => {
    e.preventDefault()

    if (draggedLead && draggedLead.status !== targetStatus) {
      // Ngăn không cho kéo từ trạng thái "Chuyển đổi thành công" 
      if (draggedLead.status === 'converted') {
        setNotification({
          message: `"${draggedLead.name}" đã hoàn tất chuyển đổi thành công, không thể di chuyển sang trạng thái khác!`,
          type: 'error'
        })
        setTimeout(() => setNotification(null), 3000)
        setDraggedLead(null)
        return
      }

      // Xử lý logic đặc biệt khi kéo vào "Chuyển đổi thành công"
      if (targetStatus === 'converted') {
        // Tự động chuyển về "Chờ thanh toán" thay vì "Chuyển đổi thành công"
        setPendingDragLead(draggedLead)
        setOriginalTargetStatus('converted') // Lưu trạng thái gốc
        setDragTargetStatus('payment_pending') // Tự động đặt về payment_pending
        setSelectedProducts([]) // Reset selected products
        setSelectedPackages({}) // Reset selected packages
        setShowDragConvertModal(true)
        return
      }

      // Kiểm tra xem có cần hiển thị popup chọn sản phẩm không
      const needProductSelection = (
        // Từ "Chờ thanh toán" kéo sang trạng thái khác (trừ lost)
        ((draggedLead.status as string) === 'payment_pending' && targetStatus !== 'lost') ||
        // Kéo vào "Chờ thanh toán" từ các trạng thái khác
        (targetStatus as string === 'payment_pending')
      )

      if (needProductSelection) {
        // Hiển thị popup chọn sản phẩm
        setPendingDragLead(draggedLead)
        setOriginalTargetStatus(targetStatus) // Lưu trạng thái gốc
        setDragTargetStatus(targetStatus)
        setSelectedProducts([]) // Reset selected products
        setSelectedPackages({}) // Reset selected packages
        setShowDragConvertModal(true)
      } else {
        // Chuyển trạng thái thông thường
        const updatedLeads = leads.map(lead =>
          lead.id === draggedLead.id
            ? { ...lead, status: targetStatus as Lead['status'], updatedAt: new Date().toISOString() }
            : lead
        )

        setLeads(updatedLeads)

        // Show success notification
        setNotification({
          message: `Đã chuyển "${draggedLead.name}" sang "${getStatusName(targetStatus)}"`,
          type: 'success'
        })

        // Clear notification after 3 seconds
        setTimeout(() => setNotification(null), 3000)
      }
    }

    setDraggedLead(null)
  }

  const handleDragEnd = () => {
    setDraggedLead(null)
  }

  const handleQuickAssign = (leadId: number, assignedTo: string) => {
    const updatedLeads = leads.map(lead =>
      lead.id === leadId
        ? { ...lead, assignedTo: assignedTo || '', updatedAt: new Date().toISOString() }
        : lead
    )

    setLeads(updatedLeads)

    // Show success notification
    const message = assignedTo
      ? `Đã phân công lead cho "${assignedTo}"`
      : 'Đã hủy phân công lead'

    setNotification({
      message,
      type: 'success'
    })

    // Clear notification after 3 seconds
    setTimeout(() => setNotification(null), 3000)
  }

  // Action handlers for buttons

  const handleViewLeadDetail = (lead: Lead) => {
    setSelectedLead(lead)
    setEditedLead({ ...lead }) // Tạo bản copy để edit
    setShowLeadDetailModal(true)
    setIsAddingQuickNote(false)
    setQuickNote('')
    setIsEditMode(false) // Bắt đầu ở view mode
  }

  const handleEditLead = (lead: Lead) => {
    setEditingLead(lead)
    setShowEditLeadModal(true)
  }

  const handleUpdateLead = (updatedLead: Lead) => {
    const updatedLeads = leads.map(lead =>
      lead.id === updatedLead.id ? { ...updatedLead, updatedAt: new Date().toISOString() } : lead
    )
    setLeads(updatedLeads)
    setShowEditLeadModal(false)
    setEditingLead(null)
    setNotification({
      message: `Lead "${updatedLead.name}" đã được cập nhật thành công!`,
      type: 'success'
    })
    setTimeout(() => setNotification(null), 3000)
  }

  const handleAddQuickNote = () => {
    if (!quickNote.trim() || !selectedLead) return

    const updatedLead = {
      ...selectedLead,
      quickNotes: [...(selectedLead.quickNotes || []), {
        content: quickNote.trim(),
        timestamp: new Date().toISOString(),
        author: 'Current User' // Trong thực tế sẽ lấy từ user hiện tại
      }],
      careCount: (selectedLead.careCount || 0) + 1,
      lastContactedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    const updatedLeads = leads.map(lead =>
      lead.id === selectedLead.id ? updatedLead : lead
    )

    setLeads(updatedLeads)
    setSelectedLead(updatedLead)
    setQuickNote('')
    setIsAddingQuickNote(false)

    setNotification({
      message: 'Đã thêm tương tác nhanh và cập nhật số lần chăm sóc!',
      type: 'success'
    })
    setTimeout(() => setNotification(null), 3000)
  }

  const handleConvertLead = (lead: Lead) => {
    setSelectedLead(lead)
    setSelectedProduct('') // Reset single product selection
    setSelectedProducts([]) // Reset multiple products selection
    setSelectedPackages({}) // Reset package selection
    setShowConvertModal(true)
  }

  const handleExportLead = (lead: Lead) => {
    const leadData = JSON.stringify(lead, null, 2)
    const blob = new Blob([leadData], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `lead_${lead.name.replace(/\s+/g, '_')}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    setNotification({
      message: `Đã xuất dữ liệu lead "${lead.name}"`,
      type: 'success'
    })
    setTimeout(() => setNotification(null), 3000)
  }

  const handleDeleteLead = (lead: Lead) => {
    if (window.confirm(`Bạn có chắc muốn xóa lead "${lead.name}"?`)) {
      setLeads(prevLeads => prevLeads.filter(l => l.id !== lead.id))
      setNotification({
        message: `Đã xóa lead "${lead.name}"`,
        type: 'success'
      })
      setTimeout(() => setNotification(null), 3000)
    }
  }

  const confirmConvertLead = () => {
    if (selectedProducts.length === 0) {
      setNotification({
        message: 'Vui lòng chọn ít nhất một sản phẩm khách hàng quan tâm trước khi chuyển đổi',
        type: 'error'
      })
      setTimeout(() => setNotification(null), 3000)
      return
    }

    if (selectedLead) {
      const totalAmount = selectedProducts.reduce((sum, productId) => {
        const product = availableProducts.find(p => p.id === productId)
        const selectedPackageId = selectedPackages[productId]
        const selectedPackage = availablePackages[productId as keyof typeof availablePackages]?.find(pkg => pkg.id === selectedPackageId)
        return sum + (product?.price || 0) + (selectedPackage?.price || 0)
      }, 0)

      const finalAmount = totalAmount * (100 - discountPercent) / 100

      const updatedLeads = leads.map(l =>
        l.id === selectedLead.id
          ? {
            ...l,
            status: 'payment_pending' as Lead['status'], // Chuyển vào chờ thanh toán
            stage: 'payment_pending',
            product: selectedProducts.join(', '), // Combine multiple products
            value: finalAmount, // Cập nhật giá trị sau giảm giá
            updatedAt: new Date().toISOString(),
            nextAction: `Theo dõi thanh toán ${paymentMethod === 'cash' ? 'tiền mặt' : 'chuyển khoản'} từ khách hàng`,
            // Thêm thông tin thanh toán
            paymentInfo: {
              method: paymentMethod,
              originalAmount: totalAmount,
              discountPercent: discountPercent,
              finalAmount: finalAmount,
              products: selectedProducts,
              packages: selectedPackages
            }
          }
          : l
      )
      setLeads(updatedLeads)

      setNotification({
        message: `${selectedLead.name} đã chuyển vào "Chuyển đổi - chờ thanh toán" với ${selectedProducts.length} sản phẩm: "${selectedProducts.join(', ')}"!`,
        type: 'success'
      })
      setTimeout(() => setNotification(null), 3000)
    }
    setShowConvertModal(false)
    setSelectedLead(null)
    setSelectedProduct('')
    setSelectedProducts([]) // Reset multiple products selection
    setSelectedPackages({}) // Reset package selection
    setDiscountPercent(0) // Reset discount
    setPaymentMethod('cash') // Reset payment method
  }

  // Payment success handler
  const handlePaymentSuccess = (lead: Lead) => {
    const updatedLeads = leads.map(l =>
      l.id === lead.id
        ? {
          ...l,
          status: 'converted' as Lead['status'],
          stage: 'deal_closed',
          updatedAt: new Date().toISOString(),
          nextAction: 'Bắt đầu thực hiện dự án'
        }
        : l
    )
    setLeads(updatedLeads)

    setNotification({
      message: `${lead.name} đã thanh toán thành công! Tự động chuyển sang "Chuyển đổi thành công".`,
      type: 'success'
    })
    setTimeout(() => setNotification(null), 3000)
  }

  // Payment failed handler
  const handlePaymentFailed = (lead: Lead) => {
    const updatedLeads = leads.map(l =>
      l.id === lead.id
        ? {
          ...l,
          status: 'lost' as Lead['status'],
          stage: 'payment_failed',
          updatedAt: new Date().toISOString(),
          nextAction: 'Phân tích nguyên nhân thất bại'
        }
        : l
    )
    setLeads(updatedLeads)

    setNotification({
      message: `${lead.name} thanh toán thất bại. Deal chuyển vào "Thất bại".`,
      type: 'error'
    })
    setTimeout(() => setNotification(null), 3000)
  }

  // Drag convert confirmation handler
  const confirmDragConvert = () => {
    if (selectedProducts.length === 0) {
      setNotification({
        message: 'Vui lòng chọn ít nhất một sản phẩm trước khi chuyển đổi',
        type: 'error'
      })
      setTimeout(() => setNotification(null), 3000)
      return
    }

    if (pendingDragLead) {
      let nextAction = 'Tiếp tục theo dõi'
      let stage = dragTargetStatus

      // Xác định next action và stage dựa vào target status
      if (dragTargetStatus === 'payment_pending') {
        nextAction = 'Theo dõi thanh toán từ khách hàng'
        stage = 'payment_pending'
      } else if (dragTargetStatus === 'converted') {
        nextAction = 'Bắt đầu thực hiện dự án'
        stage = 'deal_closed'
      }

      // Tính toán tổng tiền với discount
      const totalAmount = selectedProducts.reduce((sum, productId) => {
        const product = availableProducts.find(p => p.id === productId)
        const selectedPackageId = selectedPackages[productId]
        const selectedPackage = availablePackages[productId as keyof typeof availablePackages]?.find(pkg => pkg.id === selectedPackageId)
        return sum + (product?.price || 0) + (selectedPackage?.price || 0)
      }, 0)

      const finalAmount = totalAmount * (100 - discountPercent) / 100

      const updatedLeads = leads.map(l =>
        l.id === pendingDragLead.id
          ? {
            ...l,
            status: dragTargetStatus as Lead['status'],
            stage: stage,
            product: selectedProducts.join(', '),
            updatedAt: new Date().toISOString(),
            nextAction: `Theo dõi thanh toán ${paymentMethod === 'cash' ? 'tiền mặt' : 'chuyển khoản'} từ khách hàng`,
            value: finalAmount,
            discountPercent: discountPercent,
            originalValue: totalAmount,
            paymentInfo: {
              method: paymentMethod,
              originalAmount: totalAmount,
              discountPercent: discountPercent,
              finalAmount: finalAmount,
              products: selectedProducts,
              packages: selectedPackages
            }
          }
          : l
      )
      setLeads(updatedLeads)

      const discountMessage = discountPercent > 0 ? ` (giảm ${discountPercent}%)` : ''
      setNotification({
        message: `Đã chuyển "${pendingDragLead.name}" sang "${getStatusName(dragTargetStatus)}" với ${selectedProducts.length} sản phẩm${discountMessage}!`,
        type: 'success'
      })
      setTimeout(() => setNotification(null), 3000)
    }

    // Reset states
    setShowDragConvertModal(false)
    setPendingDragLead(null)
    setDragTargetStatus('')
    setOriginalTargetStatus('')
    setSelectedProducts([])
    setSelectedPackages({})
    setDiscountPercent(0) // Reset discount
    setPaymentMethod('cash') // Reset payment method
  }

  // Auto assignment logic
  const getAvailableSalesPersons = () => {
    return [
      { id: 'nguyen-van-a', name: 'Nguyễn Văn A', expertise: ['technology', 'software'], performance: 85, currentLeads: 12 },
      { id: 'tran-thi-b', name: 'Trần Thị B', expertise: ['real-estate', 'construction'], performance: 92, currentLeads: 8 },
      { id: 'le-van-c', name: 'Lê Văn C', expertise: ['retail', 'consumer'], performance: 78, currentLeads: 15 },
      { id: 'pham-thi-d', name: 'Phạm Thị D', expertise: ['healthcare', 'education'], performance: 88, currentLeads: 10 },
      { id: 'hoang-van-e', name: 'Hoàng Văn E', expertise: ['finance', 'banking'], performance: 90, currentLeads: 6 },
      { id: 'do-thi-f', name: 'Đỗ Thị F', expertise: ['technology', 'fintech'], performance: 82, currentLeads: 9 }
    ]
  }

  // Helper function to get today's assigned leads count per member
  const getTodayAssignedCount = (memberName: string) => {
    const today = new Date().toDateString()
    return leads.filter(lead =>
      lead.assignedTo === memberName &&
      new Date(lead.updatedAt || lead.createdAt).toDateString() === today
    ).length
  }

  const autoAssignLeads = (strategy: string, filters: any) => {
    const salesPersons = getAvailableSalesPersons()
    const unassignedLeads = leads.filter(lead => !lead.assignedTo || lead.assignedTo === '')

    let updatedLeads = [...leads]
    let assignmentCount = 0

    switch (strategy) {
      case 'balanced':
        // Phân bổ đều
        unassignedLeads.forEach((lead, index) => {
          const salesPerson = salesPersons[index % salesPersons.length]
          const leadIndex = updatedLeads.findIndex(l => l.id === lead.id)
          if (leadIndex !== -1) {
            updatedLeads[leadIndex] = {
              ...updatedLeads[leadIndex],
              assignedTo: salesPerson.name,
              updatedAt: new Date().toISOString()
            }
            assignmentCount++
          }
        })
        break

      case 'skill-based':
        // Dựa trên kỹ năng
        unassignedLeads.forEach(lead => {
          const productCategory = lead.product?.toLowerCase() || ''
          const bestMatch = salesPersons.find(sp =>
            sp.expertise.some(exp => productCategory.includes(exp))
          ) || salesPersons[0]

          const leadIndex = updatedLeads.findIndex(l => l.id === lead.id)
          if (leadIndex !== -1) {
            updatedLeads[leadIndex] = {
              ...updatedLeads[leadIndex],
              assignedTo: bestMatch.name,
              updatedAt: new Date().toISOString()
            }
            assignmentCount++
          }
        })
        break

      case 'performance':
        // Dựa trên hiệu suất - ưu tiên người có performance cao
        const sortedByPerformance = [...salesPersons].sort((a, b) => b.performance - a.performance)
        unassignedLeads.forEach((lead, index) => {
          const salesPerson = sortedByPerformance[index % sortedByPerformance.length]
          const leadIndex = updatedLeads.findIndex(l => l.id === lead.id)
          if (leadIndex !== -1) {
            updatedLeads[leadIndex] = {
              ...updatedLeads[leadIndex],
              assignedTo: salesPerson.name,
              updatedAt: new Date().toISOString()
            }
            assignmentCount++
          }
        })
        break

      case 'workload':
        // Dựa trên khối lượng công việc - ưu tiên người có ít leads nhất
        const sortedByWorkload = [...salesPersons].sort((a, b) => a.currentLeads - b.currentLeads)
        unassignedLeads.forEach((lead, index) => {
          const salesPerson = sortedByWorkload[index % sortedByWorkload.length]
          const leadIndex = updatedLeads.findIndex(l => l.id === lead.id)
          if (leadIndex !== -1) {
            updatedLeads[leadIndex] = {
              ...updatedLeads[leadIndex],
              assignedTo: salesPerson.name,
              updatedAt: new Date().toISOString()
            }
            assignmentCount++
          }
        })
        break

      case 'round_robin':
        // Round-robin với daily limits
        let currentSalesPersonIndex = 0
        unassignedLeads.forEach(lead => {
          let assigned = false
          let attempts = 0

          while (!assigned && attempts < salesPersons.length) {
            const salesPerson = salesPersons[currentSalesPersonIndex]
            const memberId = salesTeam.find(m => m.name === salesPerson.name)?.id
            const dailyLimit = memberDailyLimits[memberId || 0] || 3
            const todayCount = getTodayAssignedCount(salesPerson.name)

            if (todayCount < dailyLimit) {
              const leadIndex = updatedLeads.findIndex(l => l.id === lead.id)
              if (leadIndex !== -1) {
                updatedLeads[leadIndex] = {
                  ...updatedLeads[leadIndex],
                  assignedTo: salesPerson.name,
                  updatedAt: new Date().toISOString()
                }
                assignmentCount++
                assigned = true
              }
            }

            currentSalesPersonIndex = (currentSalesPersonIndex + 1) % salesPersons.length
            attempts++
          }
        })
        break

      case 'workload_based':
        // Dựa trên khối lượng công việc với daily limits
        unassignedLeads.forEach(lead => {
          const availableMembers = salesPersons.filter(sp => {
            const memberId = salesTeam.find(m => m.name === sp.name)?.id
            const dailyLimit = memberDailyLimits[memberId || 0] || 3
            const todayCount = getTodayAssignedCount(sp.name)
            return todayCount < dailyLimit
          }).sort((a, b) => a.currentLeads - b.currentLeads)

          if (availableMembers.length > 0) {
            const salesPerson = availableMembers[0]
            const leadIndex = updatedLeads.findIndex(l => l.id === lead.id)
            if (leadIndex !== -1) {
              updatedLeads[leadIndex] = {
                ...updatedLeads[leadIndex],
                assignedTo: salesPerson.name,
                updatedAt: new Date().toISOString()
              }
              assignmentCount++
            }
          }
        })
        break

      default:
        // Default round-robin với daily limits
        let defaultIndex = 0
        unassignedLeads.forEach(lead => {
          let assigned = false
          let attempts = 0

          while (!assigned && attempts < salesPersons.length) {
            const salesPerson = salesPersons[defaultIndex]
            const memberId = salesTeam.find(m => m.name === salesPerson.name)?.id
            const dailyLimit = memberDailyLimits[memberId || 0] || 3
            const todayCount = getTodayAssignedCount(salesPerson.name)

            if (todayCount < dailyLimit) {
              const leadIndex = updatedLeads.findIndex(l => l.id === lead.id)
              if (leadIndex !== -1) {
                updatedLeads[leadIndex] = {
                  ...updatedLeads[leadIndex],
                  assignedTo: salesPerson.name,
                  updatedAt: new Date().toISOString()
                }
                assignmentCount++
                assigned = true
              }
            }

            defaultIndex = (defaultIndex + 1) % salesPersons.length
            attempts++
          }
        })
    }

    setLeads(updatedLeads)
    return assignmentCount
  }

  // Function to add new lead
  const handleAddLead = () => {
    // Validation
    if (!newLead.name.trim() || !newLead.email.trim() || !newLead.phone.trim()) {
      setNotification({
        message: 'Vui lòng điền đầy đủ thông tin bắt buộc (Tên, Email, Số điện thoại)',
        type: 'error'
      })
      setTimeout(() => setNotification(null), 3000)
      return
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(newLead.email)) {
      setNotification({
        message: 'Email không hợp lệ',
        type: 'error'
      })
      setTimeout(() => setNotification(null), 3000)
      return
    }

    // Phone validation
    const phoneRegex = /^[0-9+\-\s\(\)]{8,15}$/
    if (!phoneRegex.test(newLead.phone)) {
      setNotification({
        message: 'Số điện thoại không hợp lệ (8-15 ký tự, chỉ số và ký tự đặc biệt)',
        type: 'error'
      })
      setTimeout(() => setNotification(null), 3000)
      return
    }

    // Create new lead
    const leadToAdd: Lead = {
      id: Date.now(), // Simple ID generation
      name: newLead.name.trim(),
      phone: newLead.phone.trim(),
      email: newLead.email.trim().toLowerCase(),
      company: newLead.company.trim(),
      source: newLead.source,
      region: newLead.region,
      product: newLead.product.trim(),
      tags: newLead.tags,
      content: newLead.content.trim(),
      status: 'new',
      stage: 'Mới',
      notes: newLead.notes.trim(),
      assignedTo: newLead.assignedTo || 'Minh Expert', // Mặc định cho người tạo nếu không chọn
      value: 0, // Bỏ ngân sách ước tính
      lastContactedAt: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      type: 'lead',
      nextAction: 'Liên hệ lần đầu',
      nextActionDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Tomorrow
      address: newLead.address?.trim() || '',
      customerType: 'business',
      winProbability: 50,
      interactionCount: 0,
      lastInteractionAt: null
    }

    // Add to leads list
    setLeads(prevLeads => [leadToAdd, ...prevLeads])

    // Reset form
    setNewLead({
      name: '',
      phone: '',
      email: '',
      company: '',
      jobTitle: '',
      industry: '',
      companySize: '',
      website: '',
      address: '',
      source: 'website',
      region: 'hanoi',
      product: '',

      content: '',
      notes: '',
      assignedTo: '', // Sẽ được set thành 'Minh Expert' khi submit
      tags: [],
      customerType: 'individual',
      estimatedRevenue: ''
    })

    // Close modal and show success message
    setShowAddLeadModal(false)
    setNotification({
      message: `Lead "${leadToAdd.name}" đã được thêm thành công!`,
      type: 'success'
    })
    setTimeout(() => setNotification(null), 3000)
  }

  // Import Excel functions
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setImportFile(file)
      setImportError(null)
      setImportSuccess(null)
      setImportPreviewData([])
      setShowImportPreview(false)

      // Parse file để preview data
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          // Simulate parsing CSV data - trong thực tế sẽ dùng library như papaparse
          const csvContent = e.target?.result as string
          const lines = csvContent.split('\n')
          if (lines.length > 1) {
            const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''))
            const previewRows = lines.slice(1, 6).map(line => { // Chỉ lấy 5 dòng đầu để preview
              const values = line.split(',').map(v => v.trim().replace(/"/g, ''))
              const row: any = {}
              headers.forEach((header, index) => {
                row[header] = values[index] || ''
              })
              return row
            }).filter(row => Object.values(row).some(val => val !== ''))

            setImportPreviewData(previewRows)
          }
        } catch (error) {
          console.error('Error parsing file:', error)
        }
      }
      reader.readAsText(file)
    }
  }

  const handleImportExcel = async () => {
    if (!importFile) {
      setImportError('Vui lòng chọn file Excel để import')
      return
    }

    // Check if preview data exists and validate field mapping
    if (importPreviewData.length === 0) {
      setImportError('Không có dữ liệu để import. Vui lòng kiểm tra file.')
      return
    }

    // Validate required fields in the data
    const requiredFields = ['Tên', 'Số điện thoại', 'Email']
    const headers = importPreviewData[0] || []
    const missingFields = requiredFields.filter(field => !headers.includes(field))

    if (missingFields.length > 0) {
      setImportError(`Thiếu các cột bắt buộc: ${missingFields.join(', ')}`)
      return
    }

    setImportProgress(0)
    setImportError(null)
    setImportSuccess(null)

    try {
      setImportProgress(30)

      setTimeout(() => {
        setImportProgress(60)

        // Process the actual preview data
        const dataRows = importPreviewData.slice(1) // Skip header row
        const validLeads: any[] = []

        dataRows.forEach((row, index) => {
          const leadData: any = {}
          headers.forEach((header: string, colIndex: number) => {
            leadData[header] = row[colIndex] || ''
          })

          // Validate required fields for each row
          if (leadData['Tên'] && leadData['Số điện thoại'] && leadData['Email']) {
            validLeads.push({
              name: leadData['Tên'],
              phone: leadData['Số điện thoại'],
              email: leadData['Email'].toLowerCase(),
              company: leadData['Công ty'] || '',
              source: 'excel_import',
              region: leadData['Tỉnh thành'] || 'hanoi',
              product: leadData['Sản phẩm quan tâm'] || '',
              content: leadData['Nội dung'] || 'Import từ file Excel',
              position: leadData['Chức vụ'] || '',
              industry: leadData['Ngành nghề'] || '',
              companySize: leadData['Quy mô công ty'] || '',
              website: leadData['Website'] || '',
              address: leadData['Địa chỉ'] || '',
              customerType: leadData['Loại khách hàng'] || 'business',
              notes: leadData['Ghi chú'] || ''
            })
          }
        })

        if (validLeads.length === 0) {
          setImportError('Không có dữ liệu hợp lệ để import')
          setImportProgress(0)
          return
        }

        setImportProgress(90)

        // Convert to Lead format and add to leads list
        setTimeout(() => {
          // Determine who to assign leads to
          const defaultAssignee = importAutoAssign ? '' : 'Minh Expert' // Default to current user if not auto-assigning

          const newLeads: Lead[] = validLeads.map((leadData, index) => ({
            id: Date.now() + index,
            name: leadData.name,
            phone: leadData.phone,
            email: leadData.email,
            company: leadData.company,
            source: leadData.source,
            region: leadData.region,
            product: leadData.product,
            content: leadData.content,
            status: 'new',
            stage: 'Mới',
            notes: leadData.notes,
            assignedTo: defaultAssignee,
            value: 0,
            lastContactedAt: null,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            type: 'lead',
            nextAction: 'Liên hệ lần đầu',
            nextActionDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            address: leadData.address,
            customerType: leadData.customerType,
            winProbability: 50,
            interactionCount: 0,
            lastInteractionAt: null,
            tags: ['excel-import']
          }))

          setLeads(prevLeads => [...newLeads, ...prevLeads])

          // Auto assign if selected
          if (importAutoAssign) {
            const assignmentCount = autoAssignLeads(autoAssignStrategy, {
              leadIds: newLeads.map(lead => lead.id)
            })
            setImportSuccess(`Đã import thành công ${newLeads.length} leads và phân công ${assignmentCount} leads tự động!`)
          } else {
            setImportSuccess(`Đã import thành công ${newLeads.length} leads và phân công cho Minh Expert!`)
          }

          setImportProgress(100)

          setTimeout(() => {
            setShowImportModal(false)
            setImportFile(null)
            setImportProgress(0)
            setImportSuccess(null)
            setImportAutoAssign(false)
            setImportPreviewData([])
            setShowImportPreview(false)
            const message = importAutoAssign
              ? `Import thành công ${newLeads.length} leads từ Excel và đã phân công tự động!`
              : `Import thành công ${newLeads.length} leads từ Excel và phân công cho Minh Expert!`
            setNotification({
              message,
              type: 'success'
            })
            setTimeout(() => setNotification(null), 3000)
          }, 1500)
        }, 500)
      }, 1000)
    } catch (error) {
      setImportError('Đã xảy ra lỗi khi import file Excel')
      setImportProgress(0)
    }
  }

  const downloadTemplate = () => {
    // Template CSV khớp với các trường trong phần mềm
    const csvContent = [
      'Tên,Số điện thoại,Email,Công ty,Loại khách hàng,Chức vụ,Ngành nghề,Quy mô công ty,Website,Địa chỉ,Nguồn,Tỉnh thành,Sản phẩm quan tâm,Nội dung,Ghi chú',
      'Nguyễn Văn A,0901234567,nguyenvana@email.com,Công ty ABC,business,CEO,technology,51-200,https://congtyabc.com,Hà Nội,website,hanoi,CRM Solution,Quan tâm giải pháp CRM,Khách hàng tiềm năng cao',
      'Trần Thị B,0907654321,tranthib@email.com,Công ty XYZ,business,Marketing Manager,marketing,11-50,https://companyxyz.vn,TP HCM,facebook,hcm,Marketing Automation,Cần tự động hóa marketing,Liên hệ trong tuần này',
      'Lê Văn C,0909876543,levanc@personal.com,,individual,,,,,Đà Nẵng,referral,danang,Website Development,Cần làm website cá nhân,Giới thiệu từ bạn bè'
    ].join('\n')

    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', 'lead_template.csv')
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Calculate preview data for auto assignment
  const getPreviewData = () => {
    const unassignedLeads = leads.filter(lead => !lead.assignedTo || lead.assignedTo === '')
    const salesPersons = getAvailableSalesPersons()
    const avgLeadsPerPerson = Math.ceil(unassignedLeads.length / salesPersons.length)

    // Calculate daily capacity
    const totalDailyCapacity = Object.values(memberDailyLimits).reduce((sum, limit) => sum + limit, 0)
    const usedCapacityToday = salesTeam.reduce((sum, member) => {
      return sum + getTodayAssignedCount(member.name)
    }, 0)
    const remainingCapacityToday = totalDailyCapacity - usedCapacityToday

    return {
      totalLeads: leads.length,
      unassignedLeads: unassignedLeads.length,
      activeSalesPeople: salesPersons.length,
      avgLeadsPerPerson: avgLeadsPerPerson,
      totalDailyCapacity,
      usedCapacityToday,
      remainingCapacityToday
    }
  }

  // Bulk action handlers
  const resetAssignModal = () => {
    setShowAssignSalesModal(false)
    setSalesSearchTerm('')
    setSalesCurrentPage(1)
    setAssignMethod('manual')
    setSelectedSalesIds([])
    setDistributionMethod('round_robin')
    setAssignStep('step1')
    setReassignOption('skip')
    setAssignSourceFilter('')
    setAssignRegionFilter('')
    setAssignType('department')
    setSelectedDepartments([])
    setAssignTimeRange('24_7')
    setAssignPriority(0)
  }

  // Compute lead counts for step 1
  const getAssignStats = () => {
    const selectedLeads = leads.filter(l => selectedLeadIds.includes(l.id))
    const assignedLeads = selectedLeads.filter(l => l.assignedTo && l.assignedTo.trim() !== '')
    const newLeads = selectedLeads.filter(l => !l.assignedTo || l.assignedTo.trim() === '')
    return { total: selectedLeads.length, assigned: assignedLeads.length, newCount: newLeads.length }
  }

  // Get the effective leads to assign based on reassignOption
  const getEffectiveLeadIds = () => {
    if (reassignOption === 'skip') {
      return selectedLeadIds.filter(id => {
        const lead = leads.find(l => l.id === id)
        return !lead?.assignedTo || lead.assignedTo.trim() === ''
      })
    }
    return selectedLeadIds // reassign all
  }

  const handleAssignSubmit = () => {
    const effectiveIds = getEffectiveLeadIds()
    if (effectiveIds.length === 0) {
      setAssignStep('success')
      return
    }
    if (assignMethod === 'manual' && selectedSalesIds.length === 0) return
    setAssignStep('loading')
    setTimeout(() => {
      if (assignMethod === 'manual') {
        const chosenSales = salesTeam.filter(s => selectedSalesIds.includes(s.id) && s.activeLeads < s.maxLeads)
        if (chosenSales.length === 0) { setAssignStep('error'); return }
        setLeads(prev => {
          let idx = 0
          return prev.map(l => {
            if (!effectiveIds.includes(l.id)) return l
            let assigned: typeof chosenSales[0]
            if (distributionMethod === 'round_robin') {
              assigned = chosenSales[idx % chosenSales.length]
            } else if (distributionMethod === 'by_workload') {
              assigned = [...chosenSales].sort((a, b) => a.activeLeads - b.activeLeads)[0]
            } else {
              assigned = chosenSales[Math.floor(Math.random() * chosenSales.length)]
            }
            idx++
            return { ...l, assignedTo: assigned.name }
          })
        })
      } else {
        // Auto assignment: round-robin all available
        const activeSales = salesTeam.filter(s => s.activeLeads < s.maxLeads).sort((a, b) => a.activeLeads - b.activeLeads)
        let idx = 0
        setLeads(prev => prev.map(l => {
          if (!effectiveIds.includes(l.id)) return l
          const s = activeSales[idx % activeSales.length]
          idx++
          return s ? { ...l, assignedTo: s.name } : l
        }))
      }
      setAssignStep('success')
    }, 1500)
  }

  const handleAssignClose = () => {
    if (assignStep === 'success') {
      const effectiveCount = getEffectiveLeadIds().length
      setNotification({ message: `Đã phân chia ${effectiveCount} lead thành công`, type: 'success' })
      setSelectedLeadIds([])
      setSelectAllChecked(false)
      setTimeout(() => setNotification(null), 3000)
    }
    resetAssignModal()
  }

  const confirmAssignSales = (salesPerson: { name: string }) => {
    setLeads(prev => prev.map(l => selectedLeadIds.includes(l.id) ? { ...l, assignedTo: salesPerson.name } : l))
    setNotification({ message: `Đã gán ${salesPerson.name} cho ${selectedLeadIds.length} leads`, type: 'success' })
    setSelectedLeadIds([])
    setSelectAllChecked(false)
    resetAssignModal()
    setTimeout(() => setNotification(null), 3000)
  }

  const confirmCreateTask = (
    taskType: { id: string, name: string, icon: string },
    deadlineDate?: string,
    deadlineTime?: string,
    extraNote?: string,
    assignedTo?: string
  ) => {
    const now = new Date().toISOString()
    let deadlineText = ''
    if (deadlineDate) {
      const dt = deadlineTime ? `${deadlineDate}T${deadlineTime}:00` : `${deadlineDate}T09:00:00`
      try {
        const dd = new Date(dt)
        deadlineText = ` - Hạn: ${dd.toLocaleString('vi-VN')}`
      } catch (e) {
        deadlineText = ` - Hạn: ${deadlineDate} ${deadlineTime || ''}`
      }
    }

    setLeads(prev => prev.map(l => {
      if (!selectedLeadIds.includes(l.id)) return l
      const notes = Array.isArray(l.quickNotes) ? l.quickNotes : (l.quickNotes ? [l.quickNotes] : [])
      const noteContent = `${taskType.icon} ${taskType.name}${deadlineText}${extraNote ? ' - ' + extraNote : ''}${assignedTo ? ` (Phụ trách: ${assignedTo})` : ''}`
      return {
        ...l,
        quickNotes: [...notes, { content: noteContent, timestamp: now, author: 'System' }],
        interactionCount: (l.interactionCount || 0) + 1,
        lastInteractionAt: now
      }
    }))
    setNotification({ message: `Đã tạo task "${taskType.name}" cho ${selectedLeadIds.length} leads`, type: 'success' })
    // reset selection and modal state
    setSelectedLeadIds([])
    setSelectAllChecked(false)
    setShowCreateTaskModal(false)
    setSelectedTaskType('')
    setSelectedTaskObj(null)
    setTaskExtraNote('')
    setTaskAssignedTo('')
    // reset deadline to default next day
    const nd = new Date(); nd.setDate(nd.getDate() + 1)
    setTaskDeadlineDate(nd.toISOString().slice(0, 10))
    setTaskDeadlineTime('09:00')
    setTimeout(() => setNotification(null), 3000)
  }

  // Bulk status change function
  const confirmBulkStatusChange = (newStatus: string) => {
    // Nếu chuyển sang converted hoặc payment_pending, cần popup xác nhận với sản phẩm
    if (newStatus === 'converted' || newStatus === 'payment_pending') {
      setShowBulkStatusModal(false)
      setShowBulkConvertModal(true)
      setBulkConvertTargetStatus(newStatus)
      return
    }

    const updatedLeads = leads.map(lead => {
      if (selectedLeadIds.includes(lead.id)) {
        return {
          ...lead,
          status: newStatus as Lead['status'],
          updatedAt: new Date().toISOString()
        }
      }
      return lead
    })

    setLeads(updatedLeads)
    setNotification({
      message: `Đã chuyển ${selectedLeadIds.length} leads sang trạng thái "${getStatusName(newStatus)}"`,
      type: 'success'
    })

    // Reset selection and modal state
    setSelectedLeadIds([])
    setSelectAllChecked(false)
    setShowBulkStatusModal(false)
    setSelectedBulkStatus('')
    setTimeout(() => setNotification(null), 3000)
  }

  // Bulk convert function  
  const confirmBulkConvert = () => {
    if (selectedProducts.length === 0) {
      setNotification({ message: 'Vui lòng chọn ít nhất một sản phẩm', type: 'error' })
      setTimeout(() => setNotification(null), 3000)
      return
    }

    const actualStatus = bulkConvertTargetStatus === 'converted' ? 'payment_pending' : bulkConvertTargetStatus

    const updatedLeads = leads.map(lead => {
      if (selectedLeadIds.includes(lead.id)) {
        return {
          ...lead,
          status: actualStatus as Lead['status'],
          stage: actualStatus === 'payment_pending' ? 'payment_pending' : lead.stage,
          updatedAt: new Date().toISOString()
        }
      }
      return lead
    })

    setLeads([...updatedLeads])

    const statusMessage = bulkConvertTargetStatus === 'converted'
      ? `Đã chuyển ${selectedLeadIds.length} leads sang "Chờ thanh toán" với ${selectedProducts.length} sản phẩm được chọn. Sau khi xác nhận thanh toán, leads sẽ tự động chuyển sang "Chuyển đổi thành công".`
      : `Đã chuyển ${selectedLeadIds.length} leads sang "${getStatusName(actualStatus)}" với ${selectedProducts.length} sản phẩm được chọn.`

    setNotification({ message: statusMessage, type: 'success' })

    // Reset all states
    setSelectedLeadIds([])
    setSelectAllChecked(false)
    setShowBulkConvertModal(false)
    setBulkConvertTargetStatus('')
    setSelectedProducts([])
    setSelectedPackages({})
    setDiscountPercent(0)
    setPaymentMethod('cash')
    setTimeout(() => setNotification(null), 5000)
  }

  // Sales filtering and pagination
  const SALES_PER_PAGE = 6
  const filteredSalesTeam = salesTeam.filter(sales =>
    sales.name.toLowerCase().includes(salesSearchTerm.toLowerCase()) ||
    sales.department.toLowerCase().includes(salesSearchTerm.toLowerCase()) ||
    sales.title.toLowerCase().includes(salesSearchTerm.toLowerCase())
  )
  const totalSalesPages = Math.ceil(filteredSalesTeam.length / SALES_PER_PAGE)
  const paginatedSalesTeam = filteredSalesTeam.slice(
    (salesCurrentPage - 1) * SALES_PER_PAGE,
    salesCurrentPage * SALES_PER_PAGE
  )

  const getStatusName = (status: string) => {
    switch (status) {
      case 'new': return 'Lead mới';
      case 'contacted': return 'Đang tư vấn';
      case 'qualified': return 'Đã gửi đề xuất';
      case 'negotiation': return 'Đàm phán';
      case 'payment_pending': return 'Chuyển đổi - chờ thanh toán';
      case 'converted': return 'Chuyển đổi thành công';
      case 'lost': return 'Thất bại';
      default: return status;
    }
  }

  const getStrategyName = (strategy: string) => {
    switch (strategy) {
      case 'round_robin': return 'Round-Robin (Phân đều)';
      case 'workload_based': return 'Theo khối lượng công việc';
      case 'territory_based': return 'Theo tỉnh thành địa lý';
      case 'source_based': return 'Theo nguồn lead';
      case 'shift_based': return 'Theo ca làm việc';
      default: return strategy;
    }
  }

  // Search and filter states for leads
  const [leadSearchTerm, setLeadSearchTerm] = useState('')
  const [leadStatusFilter, setLeadStatusFilter] = useState('all')
  const [leadRegionFilter, setLeadRegionFilter] = useState('all')
  const [leadSourceFilter, setLeadSourceFilter] = useState('all')
  const [showColumnSelector, setShowColumnSelector] = useState(false)

  // Column labels for selector
  const columnLabels = {
    customerName: 'Tên khách hàng',
    phone: 'Số điện thoại',
    email: 'Email',
    company: 'Công ty',
    address: 'Địa chỉ',
    source: 'Nguồn',
    region: 'Tỉnh thành',
    stage: 'Giai đoạn',
    estimatedRevenue: 'Doanh thu ước tính',
    product: 'Sản phẩm quan tâm',
    customerType: 'Loại khách hàng',
    salesOwner: 'Sales phụ trách',
    tags: 'Tags/Nhãn',
    notes: 'Ghi chú',
    createdDate: 'Ngày tạo',
    lastModified: 'Ngày cập nhật',
    actions: 'Hành động'
  }

  // Filter states
  const [filters, setFilters] = useState({
    timeRange: 'thisMonth',
    team: '',
    product: '',
    owner: '',
    leadStatus: '',
    advancedFilters: false
  })
  // Sample data với liên kết
  const [leads, setLeads] = useState<Lead[]>([
    {
      id: 1,
      name: 'Nguyễn Văn A',
      phone: '0901234567',
      email: 'nguyenvana@email.com',
      source: 'facebook',
      region: 'ha_noi',
      product: 'CRM Solution',
      tags: ['hot', 'enterprise'],
      content: 'Cần giải pháp CRM cho 100+ nhân viên bán hàng',
      status: 'converted',
      stage: 'deal_created',
      notes: 'Quan tâm đến tính năng AI, budget 50M',
      assignedTo: 'Minh Expert',
      value: 50000000,
      lastContactedAt: '2024-01-20T14:30:00',
      createdAt: '2024-01-15T09:00:00',
      updatedAt: '2024-01-20T14:30:00',
      type: 'lead',
      company: 'ABC Corp',

      nextAction: 'Ký hợp đồng',
      nextActionDate: '2024-01-25T10:00:00',
      careCount: 8,
      quickNotes: [
        { content: 'Gọi điện tư vấn ban đầu', timestamp: '2024-01-15T10:00:00', author: 'Minh Expert' },
        { content: 'Gửi brochure và báo giá sơ bộ', timestamp: '2024-01-16T14:00:00', author: 'Minh Expert' },
        { content: 'Họp demo sản phẩm với team kỹ thuật', timestamp: '2024-01-18T09:30:00', author: 'Minh Expert' },
        { content: 'Thảo luận về customization và integration', timestamp: '2024-01-19T15:00:00', author: 'Minh Expert' },
        { content: 'Gửi proposal chi tiết và timeline', timestamp: '2024-01-20T11:00:00', author: 'Minh Expert' }
      ],
      address: '123 Nguyễn Du, Hai Bà Trưng, Hà Nội',
      customerType: 'business',
      winProbability: 85,
      interactionCount: 8,
      lastInteractionAt: '2024-01-20T14:30:00',
      files: [
        { name: 'proposal_ABC_Corp.pdf', size: '2.5MB', type: 'pdf', uploadedAt: '2024-01-20T11:00:00' },
        { name: 'requirement_specification.docx', size: '1.2MB', type: 'docx', uploadedAt: '2024-01-18T15:30:00' },
        { name: 'demo_presentation.pptx', size: '8.7MB', type: 'pptx', uploadedAt: '2024-01-18T09:30:00' }
      ]
    },
    {
      id: 2,
      name: 'Trần Thị B',
      phone: '0912345678',
      email: 'tranthib@email.com',
      source: 'website',
      region: 'ho_chi_minh',
      product: 'Marketing Automation',
      tags: ['warm', 'sme'],
      content: 'Tự động hóa marketing cho startup',
      status: 'qualified',
      stage: 'proposal_sent',
      notes: 'Đã gửi proposal, chờ phản hồi',
      assignedTo: 'An Expert',
      value: 25000000,
      lastContactedAt: '2024-01-19T16:45:00',
      createdAt: '2024-01-16T11:20:00',
      updatedAt: '2024-01-19T16:45:00',
      type: 'lead',
      company: 'DEF Startup',

      nextAction: 'Gửi báo giá chi tiết',
      nextActionDate: '2024-01-22T09:30:00',
      careCount: 5,
      quickNotes: [
        { content: 'Cuộc gọi đầu tiên - tìm hiểu nhu cầu', timestamp: '2024-01-16T13:00:00', author: 'An Expert' },
        { content: 'Gửi case study của các startup tương tự', timestamp: '2024-01-17T10:30:00', author: 'An Expert' },
        { content: 'Demo tính năng automation workflow', timestamp: '2024-01-18T14:00:00', author: 'An Expert' },
        { content: 'Thảo luận pricing và package phù hợp', timestamp: '2024-01-19T11:15:00', author: 'An Expert' }
      ],
      address: '456 Lê Lợi, Quận 1, TP.HCM',
      customerType: 'business',
      winProbability: 60,
      interactionCount: 5,
      lastInteractionAt: '2024-01-19T16:45:00',
      files: [
        { name: 'startup_case_study.pdf', size: '1.8MB', type: 'pdf', uploadedAt: '2024-01-17T10:30:00' },
        { name: 'marketing_workflow_demo.mp4', size: '15.2MB', type: 'mp4', uploadedAt: '2024-01-18T14:00:00' }
      ]
    },
    {
      id: 3,
      name: 'Lê Văn C',
      phone: '0923456789',
      email: 'levanc@email.com',
      source: 'google',
      region: 'da_nang',
      product: 'Sales Management',
      tags: ['hot', 'follow_up'],
      content: 'Quản lý bán hàng cho công ty xuất nhập khẩu',
      status: 'negotiation',
      stage: 'contract_review',
      notes: 'Đang thương lượng về giá và điều khoản',
      assignedTo: 'An Sales',
      value: 80000000,
      lastContactedAt: '2024-01-19T10:15:00',
      createdAt: '2024-01-12T13:20:00',
      updatedAt: '2024-01-19T10:15:00',
      type: 'lead',
      company: 'DEF Export',

      nextAction: 'Cuộc họp ký hợp đồng',
      nextActionDate: '2024-01-23T14:00:00',
      careCount: 12,
      quickNotes: [
        { content: 'Tìm hiểu quy trình hiện tại của công ty', timestamp: '2024-01-12T14:00:00', author: 'An Sales' },
        { content: 'Demo module quản lý đơn hàng xuất khẩu', timestamp: '2024-01-13T10:30:00', author: 'An Sales' },
        { content: 'Khách hàng quan tâm tính năng tracking container', timestamp: '2024-01-14T15:45:00', author: 'An Sales' },
        { content: 'Gửi báo giá cho module bổ sung', timestamp: '2024-01-15T09:00:00', author: 'An Sales' },
        { content: 'Họp với team IT để đánh giá integration', timestamp: '2024-01-16T14:30:00', author: 'An Sales' },
        { content: 'Thảo luận về training plan cho user', timestamp: '2024-01-17T11:15:00', author: 'An Sales' },
        { content: 'Đàm phán giảm giá 10% cho gói enterprise', timestamp: '2024-01-18T16:00:00', author: 'An Sales' },
        { content: 'Khách đồng ý mức giá, đang review contract', timestamp: '2024-01-19T10:15:00', author: 'An Sales' }
      ],
      address: '789 Trần Phú, Hải Châu, Đà Nẵng',
      customerType: 'business',
      winProbability: 90,
      interactionCount: 12,
      lastInteractionAt: '2024-01-19T10:15:00'
    },
    {
      id: 4,
      name: 'Hoàng Thị D',
      phone: '0934567890',
      email: 'hoangthid@email.com',
      source: 'zalo',
      region: 'can_tho',
      product: 'Customer Service',
      tags: ['warm', 'sme'],
      content: 'Cải thiện chất lượng dịch vụ khách hàng',
      status: 'contacted',
      stage: 'follow_up',
      notes: 'Đã liên hệ lần đầu, cần follow up',
      assignedTo: 'Trần Văn Support',
      value: 30000000,
      lastContactedAt: '2024-01-18T09:30:00',
      createdAt: '2024-01-18T09:00:00',
      updatedAt: '2024-01-18T09:30:00',
      type: 'lead',
      company: 'JKL Services',

      nextAction: 'Gọi lại cho khách hàng',
      nextActionDate: '2024-01-20T15:00:00',
      address: '321 Cần Thơ, Ninh Kiều, Cần Thơ',
      customerType: 'business',
      winProbability: 45,
      interactionCount: 2,
      lastInteractionAt: '2024-01-18T09:30:00'
    },
    {
      id: 5,
      name: 'Vũ Minh E',
      phone: '0945678901',
      email: 'vuminhe@email.com',
      source: 'referral',
      region: 'hai_phong',
      product: 'Analytics Dashboard',
      tags: ['cold', 'enterprise'],
      content: 'Phân tích dữ liệu bán hàng chi tiết',
      status: 'new',
      stage: 'initial_contact',
      notes: 'Lead mới từ referral, chưa liên hệ',
      assignedTo: 'Đỗ Thị Analytics',
      value: 40000000,
      lastContactedAt: null,
      createdAt: '2024-01-22T16:00:00',
      updatedAt: '2024-01-22T16:00:00',
      type: 'lead',
      company: 'MNO Analytics',

      nextAction: 'Liên hệ qua email',
      nextActionDate: '2024-01-24T10:00:00',
      careCount: 0,
      quickNotes: [],
      address: '555 Lê Duẩn, Hồng Bàng, Hải Phòng',
      customerType: 'business',
      winProbability: 25,
      interactionCount: 0,
      lastInteractionAt: null
    },
    {
      id: 6,
      name: 'Ngô Thị F',
      phone: '0956789012',
      email: 'ngothif@email.com',
      source: 'website',
      region: 'ha_noi',
      product: 'E-commerce Platform',
      tags: ['hot', 'sme'],
      content: 'Xây dựng platform bán hàng online',
      status: 'proposal',
      stage: 'proposal_sent',
      notes: 'Đã gửi proposal chi tiết, chờ quyết định',
      assignedTo: 'Minh Expert',
      value: 85000000,
      lastContactedAt: '2024-01-20T11:45:00',
      createdAt: '2024-01-14T13:30:00',
      updatedAt: '2024-01-20T11:45:00',
      type: 'lead',
      company: 'PQR Commerce',

      nextAction: 'Theo dõi phản hồi khách hàng',
      nextActionDate: '2024-01-21T09:00:00',
      address: '200 Lý Tự Trọng, Quận 1, TP.HCM',
      customerType: 'business',
      winProbability: 75,
      interactionCount: 6,
      lastInteractionAt: '2024-01-20T11:45:00'
    },
    {
      id: 7,
      name: 'Phạm Văn G',
      phone: '0967890123',
      email: 'phamvang@email.com',
      source: 'linkedin',
      region: 'ho_chi_minh',
      product: 'Inventory Management',
      tags: ['warm', 'enterprise'],
      content: 'Quản lý kho hàng thông minh cho chuỗi cửa hàng',
      status: 'qualified',
      stage: 'demo_completed',
      notes: 'Demo thành công, rất hài lòng với tính năng',
      assignedTo: 'Lê Thị Inventory',
      value: 60000000,
      lastContactedAt: '2024-06-28T15:20:00',
      createdAt: '2024-06-20T10:00:00',
      updatedAt: '2024-06-28T15:20:00',
      type: 'lead',
      company: 'RST Retail Chain',

      nextAction: 'Gửi hợp đồng mẫu',
      nextActionDate: '2024-07-01T10:00:00',
      address: '888 Nguyễn Văn Linh, Quận 7, TP.HCM',
      customerType: 'business',
      winProbability: 55,
      interactionCount: 4,
      lastInteractionAt: '2024-06-28T15:20:00'
    },
    {
      id: 8,
      name: 'Đỗ Thị H',
      phone: '0978901234',
      email: 'dothih@email.com',
      source: 'facebook',
      region: 'da_nang',
      product: 'HR Management',
      tags: ['hot', 'sme'],
      content: 'Số hóa quy trình nhân sự và tuyển dụng',
      status: 'negotiation',
      stage: 'contract_review',
      notes: 'Đang review hợp đồng, sẽ ký trong tuần này',
      assignedTo: 'Nguyễn Văn HR',
      value: 35000000,
      lastContactedAt: '2024-06-30T11:30:00',
      createdAt: '2024-06-15T14:00:00',
      updatedAt: '2024-06-30T11:30:00',
      type: 'lead',
      company: 'UVW Solutions',

      nextAction: 'Ký hợp đồng',
      nextActionDate: '2024-07-03T10:00:00',
      address: '99 Bạch Đằng, Hải Châu, Đà Nẵng',
      customerType: 'business',
      winProbability: 95,
      interactionCount: 7,
      lastInteractionAt: '2024-06-30T11:30:00'
    },
    {
      id: 9,
      name: 'Bùi Văn I',
      phone: '0989012345',
      email: 'buivani@email.com',
      source: 'google',
      region: 'ha_noi',
      product: 'Financial Management',
      tags: ['warm', 'enterprise'],
      content: 'Quản lý tài chính và kế toán tự động',
      status: 'contacted',
      stage: 'needs_assessment',
      notes: 'Đã tìm hiểu nhu cầu, chuẩn bị demo',
      assignedTo: 'Trần Thị Finance',
      value: 45000000,
      lastContactedAt: '2024-06-29T14:45:00',
      createdAt: '2024-06-25T09:30:00',
      updatedAt: '2024-06-29T14:45:00',
      type: 'lead',
      company: 'XYZ Finance',

      nextAction: 'Gửi tài liệu tham khảo',
      nextActionDate: '2024-07-02T10:00:00',
      address: '777 Giải Phóng, Đống Đa, Hà Nội',
      customerType: 'business',
      winProbability: 50,
      interactionCount: 3,
      lastInteractionAt: '2024-06-29T14:45:00'
    },
    {
      id: 10,
      name: 'Lý Thị K',
      phone: '0990123456',
      email: 'lythik@email.com',
      source: 'website',
      region: 'can_tho',
      product: 'Project Management',
      tags: ['cold', 'sme'],
      content: 'Quản lý dự án và phân công công việc',
      status: 'new',
      stage: 'initial_contact',
      notes: 'Lead mới đăng ký, chưa liên hệ',
      assignedTo: 'Võ Văn Project',
      value: 20000000,
      lastContactedAt: null,
      createdAt: '2024-07-01T08:00:00',
      updatedAt: '2024-07-01T08:00:00',
      type: 'lead',
      company: 'ABC Project Co',

      nextAction: 'Gửi email chào mừng',
      nextActionDate: '2024-07-03T10:00:00',
      address: '111 Trần Hưng Đạo, Ninh Kiều, Cần Thơ',
      customerType: 'business',
      winProbability: 20,
      interactionCount: 0,
      lastInteractionAt: null
    },
    {
      id: 11,
      name: 'Hoàng Văn L',
      phone: '0901234568',
      email: 'hoangvanl@email.com',
      source: 'referral',
      region: 'hai_phong',
      product: 'Supply Chain',
      tags: ['hot', 'enterprise'],
      content: 'Tối ưu hóa chuỗi cung ứng và logistics',
      status: 'proposal',
      stage: 'proposal_review',
      notes: 'Proposal đang được xem xét bởi board',
      assignedTo: 'Đặng Thị Supply',
      value: 120000000,
      lastContactedAt: '2024-06-27T16:00:00',
      createdAt: '2024-06-18T11:15:00',
      updatedAt: '2024-06-27T16:00:00',
      type: 'lead',
      company: 'DEF Logistics',

      nextAction: 'Theo dõi phản hồi từ board',
      nextActionDate: '2024-07-01T10:00:00',
      address: '456 Dien Bien Phu, Le Chan, Hai Phong',
      customerType: 'business',
      winProbability: 80,
      interactionCount: 9,
      lastInteractionAt: '2024-06-27T16:00:00'
    },
    {
      id: 12,
      name: 'Trương Thị M',
      phone: '0912345679',
      email: 'truongthim@email.com',
      source: 'zalo',
      region: 'ho_chi_minh',
      product: 'Customer Analytics',
      tags: ['warm', 'sme'],
      content: 'Phân tích hành vi và xu hướng khách hàng',
      status: 'qualified',
      stage: 'demo_scheduled',
      notes: 'Đã book demo cho tuần sau',
      assignedTo: 'Phan Văn Analytics',
      value: 38000000,
      lastContactedAt: '2024-06-28T10:20:00',
      createdAt: '2024-06-22T13:45:00',
      updatedAt: '2024-06-28T10:20:00',
      type: 'lead',
      company: 'GHI Analytics',

      nextAction: 'Chuẩn bị tài liệu demo',
      nextActionDate: '2024-07-04T10:00:00',
      address: '789 Nguyen Hue, District 1, Ho Chi Minh City',
      customerType: 'business',
      winProbability: 65,
      interactionCount: 4,
      lastInteractionAt: '2024-06-28T10:20:00'
    },
    {
      id: 13,
      name: 'Đinh Văn N',
      phone: '0923456780',
      email: 'dinhvann@email.com',
      source: 'linkedin',
      region: 'da_nang',
      product: 'Quality Management',
      tags: ['hot', 'enterprise'],
      content: 'Hệ thống quản lý chất lượng ISO',
      status: 'negotiation',
      stage: 'pricing_negotiation',
      notes: 'Đang thương lượng package và pricing',
      assignedTo: 'Lê Văn Quality',
      value: 55000000,
      lastContactedAt: '2024-06-30T09:15:00',
      createdAt: '2024-06-12T15:30:00',
      updatedAt: '2024-06-30T09:15:00',
      type: 'lead',
      company: 'JKL Manufacturing',

      nextAction: 'Đàm phán lại về giá',
      nextActionDate: '2024-07-05T10:00:00',
      address: '321 Bach Dang, Hai Chau, Da Nang',
      customerType: 'business',
      winProbability: 85,
      interactionCount: 11,
      lastInteractionAt: '2024-06-30T09:15:00'
    },
    {
      id: 14,
      name: 'Châu Thị O',
      phone: '0934567891',
      email: 'chauthio@email.com',
      source: 'facebook',
      region: 'can_tho',
      product: 'Education Platform',
      tags: ['warm', 'sme'],
      content: 'Nền tảng giáo dục trực tuyến',
      status: 'contacted',
      stage: 'demo_requested',
      notes: 'Yêu cầu demo chi tiết về tính năng',
      assignedTo: 'Huỳnh Thị Edu',
      value: 28000000,
      lastContactedAt: '2024-06-29T11:00:00',
      createdAt: '2024-06-24T16:20:00',
      updatedAt: '2024-06-29T11:00:00',
      type: 'lead',
      company: 'MNO Education',

      nextAction: 'Gửi thông tin khóa học',
      nextActionDate: '2024-07-06T10:00:00',
      address: '654 Tran Hung Dao, Ninh Kieu, Can Tho',
      customerType: 'business',
      winProbability: 40,
      interactionCount: 3,
      lastInteractionAt: '2024-06-29T11:00:00'
    },
    {
      id: 15,
      name: 'Mai Văn P',
      phone: '0945678902',
      email: 'maivanp@email.com',
      source: 'google',
      region: 'ha_noi',
      product: 'Security System',
      tags: ['hot', 'enterprise'],
      content: 'Hệ thống bảo mật và giám sát toàn diện',
      status: 'converted',
      stage: 'deal_created',
      notes: 'Đã chuyển thành deal, bắt đầu implementation',
      assignedTo: 'Vũ Thị Security',
      value: 90000000,
      lastContactedAt: '2024-06-26T14:30:00',
      createdAt: '2024-06-10T12:00:00',
      updatedAt: '2024-06-26T14:30:00',
      type: 'lead',
      company: 'PQR Security',

      nextAction: 'Triển khai hệ thống bảo mật',
      nextActionDate: '2024-07-07T10:00:00',
      address: '987 Kim Ma, Ba Dinh, Ha Noi',
      customerType: 'business',
      winProbability: 100,
      interactionCount: 15,
      lastInteractionAt: '2024-06-26T14:30:00'
    },
    {
      id: 16,
      name: 'Dương Thị Q',
      phone: '0956789013',
      email: 'duongthiq@email.com',
      source: 'referral',
      region: 'ho_chi_minh',
      product: 'Mobile App Development',
      tags: ['warm', 'sme'],
      content: 'Phát triển ứng dụng mobile cho doanh nghiệp',
      status: 'qualified',
      stage: 'requirements_gathering',
      notes: 'Đang thu thập yêu cầu chi tiết',
      assignedTo: 'Cao Văn Mobile',
      value: 42000000,
      lastContactedAt: '2024-06-28T13:45:00',
      createdAt: '2024-06-19T10:30:00',
      updatedAt: '2024-06-28T13:45:00',
      type: 'lead',
      company: 'STU Mobile',

      nextAction: 'Lên danh sách tính năng yêu cầu',
      nextActionDate: '2024-07-08T10:00:00',
      address: '123 Le Loi, District 1, Ho Chi Minh City',
      customerType: 'business',
      winProbability: 55,
      interactionCount: 6,
      lastInteractionAt: '2024-06-27T13:45:00'
    },
    {
      id: 17,
      name: 'Kiều Văn R',
      phone: '0967890124',
      email: 'kieuvanr@email.com',
      source: 'website',
      region: 'hai_phong',
      product: 'Cloud Infrastructure',
      tags: ['cold', 'enterprise'],
      content: 'Migration lên cloud và quản lý hạ tầng',
      status: 'new',
      stage: 'lead_qualification',
      notes: 'Lead mới, cần qualify budget và timeline',
      assignedTo: 'Bùi Thị Cloud',
      value: 75000000,
      lastContactedAt: null,
      createdAt: '2024-06-30T17:00:00',
      updatedAt: '2024-06-30T17:00:00',
      type: 'lead',
      company: 'VWX Cloud Corp',

      nextAction: 'Gửi khảo sát nhu cầu',
      nextActionDate: '2024-07-09T10:00:00',
      address: '456 Le Duan, Hong Bang, Hai Phong',
      customerType: 'business',
      winProbability: 35,
      interactionCount: 1,
      lastInteractionAt: '2024-06-30T08:00:00'
    },
    {
      id: 18,
      name: 'Tô Thị S',
      phone: '0978901235',
      email: 'tothis@email.com',
      source: 'zalo',
      region: 'da_nang',
      product: 'IoT Solutions',
      tags: ['hot', 'enterprise'],
      content: 'Giải pháp IoT cho smart city và nhà máy',
      status: 'proposal',
      stage: 'technical_review',
      notes: 'Proposal đang được review về mặt kỹ thuật',
      assignedTo: 'Lương Văn IoT',
      value: 150000000,
      lastContactedAt: '2024-06-29T15:30:00',
      createdAt: '2024-06-08T14:45:00',
      updatedAt: '2024-06-29T15:30:00',
      type: 'lead',
      company: 'YZA Smart Tech',

      nextAction: 'Đợi phản hồi kỹ thuật',
      nextActionDate: '2024-07-10T10:00:00',
      address: '789 Bach Dang, Hai Chau, Da Nang',
      customerType: 'business',
      winProbability: 70,
      interactionCount: 8,
      lastInteractionAt: '2024-06-28T16:30:00'
    },
    {
      id: 19,
      name: 'Nguyễn Văn T',
      phone: '0989012346',
      email: 'nguyenvant@email.com',
      source: 'website',
      region: 'ha_noi',
      product: 'CRM Solution',
      tags: ['cold', 'sme'],
      content: 'Tìm hiểu giải pháp CRM cho công ty nhỏ',
      status: 'lost',
      stage: 'lost_competitor',
      notes: 'Khách hàng chọn đối thủ cạnh tranh do giá rẻ hơn',
      assignedTo: 'Minh Expert',
      value: 15000000,
      lastContactedAt: '2024-06-25T14:00:00',
      createdAt: '2024-06-01T09:00:00',
      updatedAt: '2024-06-25T14:00:00',
      type: 'lead',
      company: 'ABC Small Co',

      nextAction: '',
      nextActionDate: '',
      address: '456 Cau Giay, Cau Giay, Ha Noi',
      customerType: 'business',
      winProbability: 0,
      interactionCount: 4,
      lastInteractionAt: '2024-06-25T14:00:00'
    },
    {
      id: 20,
      name: 'Phạm Thị Payment',
      phone: '0912345678',
      email: 'phamthipayment@email.com',
      source: 'google',
      region: 'ha_noi',
      product: 'CRM Premium',
      tags: ['hot', 'enterprise'],
      content: 'Đã ký hợp đồng, đang chờ thanh toán',
      status: 'negotiation',
      stage: 'waiting_payment',
      notes: 'Hợp đồng đã ký, khách hàng xác nhận thanh toán trong tuần',
      assignedTo: 'An Expert',
      value: 85000000,
      lastContactedAt: '2024-07-01T10:00:00',
      createdAt: '2024-05-15T08:30:00',
      updatedAt: '2024-07-01T10:00:00',
      type: 'lead',
      company: 'Premium Corp',
      nextAction: 'Theo dõi thanh toán',
      nextActionDate: '2024-07-05T09:00:00',
      address: '789 Ba Dinh, Ba Dinh, Ha Noi',
      customerType: 'business',
      winProbability: 95,
      interactionCount: 12,
      lastInteractionAt: '2024-07-01T10:00:00',
      quickNotes: [
        {
          content: 'Khách hàng đã ký hợp đồng và xác nhận thanh toán',
          timestamp: '2024-07-01T10:00:00',
          author: 'An Expert'
        }
      ]
    }
  ])

  // Note handling functions
  function handleAddNote(lead: Lead) {
    setSelectedLeadForNote(lead)
    setNewNoteContent('')
    setShowAddNoteModal(true)
  }

  function handleSubmitNote() {
    if (!selectedLeadForNote || !newNoteContent.trim()) {
      alert('Vui lòng nhập nội dung ghi chú!')
      return
    }

    // Update lead with new note and files
    const updatedLeads = leads.map(lead => {
      if (lead.id === selectedLeadForNote.id) {
        const newNote = {
          content: newNoteContent.trim(),
          timestamp: new Date().toISOString(),
          author: 'Người dùng hiện tại' // In real app, get from auth context
        }

        // Handle file uploads
        let fileInfo = ''
        const newFiles = []
        if (selectedFiles && selectedFiles.length > 0) {
          for (let i = 0; i < selectedFiles.length; i++) {
            const file = selectedFiles[i]
            newFiles.push({
              name: file.name,
              size: (file.size / 1024 / 1024).toFixed(2) + ' MB',
              type: file.type || 'unknown',
              uploadedAt: new Date().toISOString()
            })
          }
          fileInfo = ` [Đính kèm: ${newFiles.map(f => f.name).join(', ')}]`
        }

        return {
          ...lead,
          quickNotes: [...(lead.quickNotes || []), newNote],
          files: [...(lead.files || []), ...newFiles],
          content: lead.content + (lead.content ? '\n' : '') + `[${new Date().toLocaleDateString('vi-VN')}] ${newNoteContent.trim()}${fileInfo}`,
          updatedAt: new Date().toISOString()
        }
      }
      return lead
    })

    setLeads(updatedLeads)
    setShowAddNoteModal(false)
    setSelectedLeadForNote(null)
    setNewNoteContent('')
    setSelectedFiles(null)

    const message = selectedFiles && selectedFiles.length > 0
      ? `Đã thêm ghi chú thành công với ${selectedFiles.length} file đính kèm!`
      : 'Đã thêm ghi chú thành công!'

    setNotification({ message, type: 'success' })
    setTimeout(() => setNotification(null), 3000)
  }

  // File management functions
  const handleViewFiles = (lead: Lead) => {
    setSelectedLeadForFile(lead)
    setShowFileModal(true)
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files && files.length > 0) {
      setSelectedFiles(files)
    }
  }

  const handleSubmitFiles = () => {
    if (!selectedFiles || !selectedLeadForFile) return

    const newFiles = Array.from(selectedFiles).map(file => ({
      name: file.name,
      size: (file.size / 1024 / 1024).toFixed(2) + ' MB',
      type: file.type || 'unknown',
      uploadedAt: new Date().toISOString()
    }))

    const updatedLeads = leads.map(lead => {
      if (lead.id === selectedLeadForFile.id) {
        return {
          ...lead,
          files: [...(lead.files || []), ...newFiles]
        }
      }
      return lead
    })

    setLeads(updatedLeads)
    setSelectedFiles(null)
    setShowFileModal(false)
    setSelectedLeadForFile(null)
    alert('Đã upload file thành công!')
  }

  const handleDeleteFile = (fileIndex: number) => {
    if (!selectedLeadForFile) return

    const updatedLeads = leads.map(lead => {
      if (lead.id === selectedLeadForFile.id) {
        const updatedFiles = lead.files?.filter((_, index) => index !== fileIndex) || []
        return {
          ...lead,
          files: updatedFiles
        }
      }
      return lead
    })

    setLeads(updatedLeads)
    setSelectedLeadForFile({
      ...selectedLeadForFile,
      files: selectedLeadForFile.files?.filter((_, index) => index !== fileIndex) || []
    })
  }

  function handleSaveLeadEdit() {
    if (!editedLead || !selectedLead) return;

    // Update the lead in the leads array
    const updatedLeads = leads.map(lead => {
      if (lead.id === selectedLead.id) {
        return {
          ...lead,
          ...editedLead,
          updatedAt: new Date().toISOString()
        };
      }
      return lead;
    });

    setLeads(updatedLeads);
    setSelectedLead({ ...editedLead });
    setIsEditMode(false);
    alert('Đã lưu thông tin lead thành công!');
  }

  // Calculate metrics with realistic previous month data
  const calculateMetrics = () => {
    const currentMonth = new Date().getMonth()
    const currentYear = new Date().getFullYear()

    // Calculate AI Suggestions count (hidden but kept for consistency)
    const calculateAISuggestions = () => {
      return 0 // Hidden feature
    }

    // Simulate previous month data (in real app, this would come from API)
    const previousMonthData = {
      totalLeads: 12, // Tháng trước có 12 leads
      conversionRate: 15, // Tỷ lệ chuyển đổi tháng trước 15%
      totalValue: 850000000 // Tổng giá trị dự kiến tháng trước: 850M VND
    }

    const currentData = {
      totalLeads: leads.length,
      conversionRate: leads.length > 0 ? Math.round((leads.filter(l => l.status === 'converted').length / leads.length) * 100) : 0,
      totalValue: leads.reduce((sum, lead) => sum + lead.value, 0)
    }

    const calculateTrend = (current: number, previous: number): 'up' | 'down' | 'neutral' => {
      if (current > previous) return 'up'
      if (current < previous) return 'down'
      return 'neutral'
    }

    const calculatePercentageChange = (current: number, previous: number): number => {
      if (previous === 0) return current > 0 ? 100 : 0
      return Math.round(((current - previous) / previous) * 100)
    }

    return [
      {
        id: 'leads',
        title: 'Tổng Leads',
        value: currentData.totalLeads,
        previousValue: previousMonthData.totalLeads,
        percentageChange: calculatePercentageChange(currentData.totalLeads, previousMonthData.totalLeads),
        icon: <Users className="w-5 h-5" />,
        color: 'text-blue-600',
        bgColor: 'bg-blue-100',
        trend: calculateTrend(currentData.totalLeads, previousMonthData.totalLeads), clickAction: () => {
          setActiveTab('pipeline')
          setSelectedMetric('leads')
          setNotification({
            message: `Đang hiển thị chi tiết ${currentData.totalLeads} leads trong Pipeline`,
            type: 'success'
          })
          setTimeout(() => setNotification(null), 3000)
        }
      },
      {
        id: 'conversion',
        title: 'Tỷ Lệ Chuyển Đổi',
        value: currentData.conversionRate,
        previousValue: previousMonthData.conversionRate,
        percentageChange: calculatePercentageChange(currentData.conversionRate, previousMonthData.conversionRate),
        icon: <TrendingUp className="w-5 h-5" />,
        color: 'text-orange-600',
        bgColor: 'bg-orange-100',
        trend: calculateTrend(currentData.conversionRate, previousMonthData.conversionRate), clickAction: () => {
          setActiveTab('pipeline')
          setSelectedMetric('conversion')
          setNotification({
            message: `Tỷ lệ chuyển đổi hiện tại: ${currentData.conversionRate}%`,
            type: 'success'
          })
          setTimeout(() => setNotification(null), 3000)
        }
      },
      {
        id: 'total-value',
        title: 'Tổng Giá Trị Dự Kiến',
        value: Math.round(currentData.totalValue / 1000000), // Convert to millions
        previousValue: Math.round(previousMonthData.totalValue / 1000000),
        percentageChange: calculatePercentageChange(currentData.totalValue, previousMonthData.totalValue),
        icon: <DollarSign className="w-5 h-5" />,
        color: 'text-green-600',
        bgColor: 'bg-green-100',
        trend: calculateTrend(currentData.totalValue, previousMonthData.totalValue),
        clickAction: () => {
          setActiveTab('pipeline')
          setSelectedMetric('total-value')
          setNotification({
            message: `Tổng giá trị dự kiến: ${Math.round(currentData.totalValue / 1000000)}M VND`,
            type: 'success'
          })
          setTimeout(() => setNotification(null), 3000)
        }
      }
    ]
  }

  const metrics = calculateMetrics()

  // Handle AI suggestions
  const handleAISuggestion = (suggestionId: string, action: string) => {
    switch (action) {
      case 'accept':
        setNotification({
          message: 'Đã thực hiện theo gợi ý AI',
          type: 'success'
        })
        break
      case 'dismiss':
        // Just mark as dismissed
        break
      case 'like':
        // Track positive feedback
        break
      case 'dislike':
        // Track negative feedback
        break
    }

    // Clear notification after 3 seconds
    setTimeout(() => setNotification(null), 3000)
  }

  // Handle pipeline stage click
  const handlePipelineStageClick = (stage: string) => {
    setSelectedPipelineStage(selectedPipelineStage === stage ? null : stage)

    // Filter leads based on selected stage
    let statusFilter = 'all'
    switch (stage) {
      case 'new':
        statusFilter = 'new'
        break
      case 'contacted':
        statusFilter = 'contacted'
        break
      case 'qualified':
        statusFilter = 'qualified'
        break
      case 'proposal':
        statusFilter = 'proposal'
        break
      case 'negotiation':
        statusFilter = 'negotiation'
        break
      case 'converted':
        statusFilter = 'converted'
        break
    }

    // Update lead status filter to show relevant data
    setLeadStatusFilter(statusFilter)

    // Show notification
    const stageNames = {
      'new': 'Mới',
      'contacted': 'Đã liên hệ',
      'qualified': 'Đã xác định',
      'proposal': 'Báo giá',
      'negotiation': 'Đàm phán',
      'converted': 'Đã chuyển đổi'
    }

    setNotification({
      message: `Đang hiển thị ${leads.filter(l => l.status === stage).length} leads ở giai đoạn "${stageNames[stage as keyof typeof stageNames]}"`,
      type: 'success'
    })
    setTimeout(() => setNotification(null), 3000)
  }

  const renderPipeline = () => {
    // Filtered leads based on search and filters
    const filteredLeads = leads.filter(lead => {
      const matchesSearch = lead.name.toLowerCase().includes(leadSearchTerm.toLowerCase()) ||
        lead.email.toLowerCase().includes(leadSearchTerm.toLowerCase()) ||
        lead.phone.includes(leadSearchTerm) ||
        lead.company?.toLowerCase().includes(leadSearchTerm.toLowerCase())

      const matchesStatus = leadStatusFilter === 'all' || lead.status === leadStatusFilter
      const matchesRegion = leadRegionFilter === 'all' || lead.region === leadRegionFilter
      const matchesSource = leadSourceFilter === 'all' || lead.source === leadSourceFilter

      // Advanced filters
      const matchesAssignee = !filterAssignee || lead.assignee === filterAssignee

      const matchesDepartment = !filterDepartment || lead.department === filterDepartment

      const matchesTeam = !filterTeam || lead.team === filterTeam

      const matchesLastContact = !filterLastContact || (() => {
        if (!lead.lastContact) return filterLastContact === 'old'
        const lastContactDate = new Date(lead.lastContact)
        const now = new Date()
        const daysDiff = Math.floor((now.getTime() - lastContactDate.getTime()) / (1000 * 60 * 60 * 24))

        switch (filterLastContact) {
          case 'today': return daysDiff === 0
          case 'week': return daysDiff <= 7
          case 'month': return daysDiff <= 30
          case 'old': return daysDiff > 30
          default: return true
        }
      })()

      const matchesCreatedDate = (!filterCreatedDate.start || new Date(lead.createdAt) >= new Date(filterCreatedDate.start)) &&
        (!filterCreatedDate.end || new Date(lead.createdAt) <= new Date(filterCreatedDate.end))

      const matchesInteractionCount = (!filterInteractionCount.min || (lead.interactions || 0) >= parseInt(filterInteractionCount.min)) &&
        (!filterInteractionCount.max || (lead.interactions || 0) <= parseInt(filterInteractionCount.max))

      const matchesPriority = !filterPriority || lead.priority === filterPriority

      const matchesProductInterest = !filterProductInterest || (lead.interestedProducts && lead.interestedProducts.includes(filterProductInterest))

      return matchesSearch && matchesStatus && matchesRegion && matchesSource &&
        matchesAssignee && matchesDepartment && matchesTeam && matchesLastContact &&
        matchesCreatedDate && matchesInteractionCount && matchesPriority && matchesProductInterest
    })

    // Pipeline statistics
    const pipelineStats = {
      newLeads: leads.filter(l => l.status === 'new').length,
      contactedLeads: leads.filter(l => l.status === 'contacted').length,
      qualifiedLeads: leads.filter(l => l.status === 'qualified').length,
      negotiationLeads: leads.filter(l => l.status === 'negotiation').length,
      paymentPendingLeads: leads.filter(l => (l.status as string) === 'payment_pending').length,
      convertedLeads: leads.filter(l => l.status === 'converted').length,
      lostLeads: leads.filter(l => l.status === 'lost').length,
      totalValue: leads.reduce((sum, lead) => sum + lead.value, 0),
      hotLeads: leads.filter(l => l.tags.includes('hot')).length,
      avgDealSize: leads.length > 0 ? Math.round(leads.reduce((sum, lead) => sum + lead.value, 0) / leads.length) : 0
    }

    // Selection handlers for bulk actions (available while table is rendered)
    const handleToggleSelectLead = (id: number) => {
      setSelectedLeadIds(prev => {
        const exists = prev.includes(id)
        const next = exists ? prev.filter(x => x !== id) : [...prev, id]
        // update select-all checkbox state
        setSelectAllChecked(filteredLeads.length > 0 && next.length === filteredLeads.length)
        return next
      })
    }

    const handleToggleSelectAll = (checked: boolean) => {
      setSelectAllChecked(checked)
      if (checked) {
        setSelectedLeadIds(filteredLeads.map(l => l.id))
      } else {
        setSelectedLeadIds([])
      }
    }

    const handleAssignSalesQuick = () => {
      setShowAssignSalesModal(true)
    }

    const handleCreateTaskQuick = () => {
      setShowCreateTaskModal(true)
    }

    const handleExportSelectedLeads = () => {
      if (selectedLeadIds.length === 0) {
        alert('Vui lòng chọn ít nhất một lead để xuất!')
        return
      }

      // Get selected leads
      const selectedLeads = leads.filter(lead => selectedLeadIds.includes(lead.id))

      // Prepare CSV data
      const csvHeaders = [
        'ID',
        'Tên',
        'Email',
        'Điện thoại',
        'Công ty',
        'Chức vụ',
        'Nguồn',
        'Trạng thái',
        'Độ ưu tiên',
        'Sales phụ trách',
        'Giá trị dự kiến',
        'Ngày tạo',
        'Ngày cập nhật',
        'Ghi chú',
        'Số tệp đính kèm'
      ]

      const csvData = selectedLeads.map(lead => [
        lead.id,
        lead.name || '',
        lead.email || '',
        lead.phone || '',
        lead.company || '',
        lead.position || '',
        lead.source || '',
        lead.status || '',
        lead.priority || '',
        lead.assignedTo || '',
        lead.value || '',
        lead.createdAt || '',
        lead.updatedAt || '',
        (lead.notes || '').replace(/"/g, '""'), // Escape quotes in notes
        lead.files ? lead.files.length : 0 // Number of files
      ])

      // Create CSV content
      const csvContent = [
        csvHeaders.join(','),
        ...csvData.map(row => row.map(cell => `"${cell}"`).join(','))
      ].join('\n')

      // Create and download file
      const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' }) // \uFEFF for UTF-8 BOM
      const link = document.createElement('a')
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute('download', `leads_export_${new Date().toISOString().split('T')[0]}.csv`)
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      // Show success message
      alert(`Đã xuất thành công ${selectedLeads.length} leads ra file CSV!`)

      // Clear selection after export
      setSelectedLeadIds([])
      setSelectAllChecked(false)
    }

    return (
      <div className="space-y-6">
        {/* Pipeline Flow - Show in both table and kanban view */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold text-gray-900">Quy trình Bán hàng</h3>
              <div
                className="relative"
                onMouseEnter={() => setShowTooltip('pipeline-overview')}
                onMouseLeave={() => setShowTooltip(null)}
              >
                <HelpCircle className="w-4 h-4 text-gray-400 hover:text-blue-500 cursor-help transition-colors" />
                {showTooltip === 'pipeline-overview' && (
                  <div className="absolute left-0 top-7 z-10 bg-white text-gray-600 text-sm rounded-xl py-3 px-4 shadow-lg border border-gray-100 min-w-[280px]">
                    <p>Theo dõi toàn bộ hành trình khách hàng từ lead mới đến chuyển đổi thành công.</p>
                    <div className="absolute top-[-6px] left-4 w-3 h-3 bg-white border-l border-t border-gray-100 transform rotate-45"></div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Pipeline Cards in horizontal layout */}
          <div className="flex gap-6 overflow-x-auto py-3 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 overflow-y-visible">
            {/* 1. Lead mới - BẮT BUỘC */}
            <div
              className={`flex flex-col justify-between rounded-lg px-8 py-7 min-w-[220px] max-w-[240px] bg-gradient-to-br from-purple-600 to-purple-400 text-white shadow-lg cursor-pointer relative transition-all hover:shadow-xl ${selectedPipelineStage === 'new' ? 'ring-4 ring-purple-300 transform scale-105 z-10' : ''
                }`}
              onClick={() => handlePipelineStageClick('new')}
            >
              <div className="absolute top-2 right-2">
                <div
                  className="relative"
                  onMouseEnter={() => setShowTooltip('stage-new')}
                  onMouseLeave={() => setShowTooltip(null)}
                >
                  <HelpCircle className="w-3.5 h-3.5 text-white/70 hover:text-white cursor-help transition-colors" />
                  {showTooltip === 'stage-new' && (
                    <div className="absolute right-0 top-6 z-10 bg-white text-gray-600 text-sm rounded-xl py-3 px-4 shadow-lg border border-gray-100 min-w-[200px]">
                      <p>Giai đoạn bắt đầu - không thể xóa hay đổi tên.</p>
                      <div className="absolute top-[-6px] right-4 w-3 h-3 bg-white border-l border-t border-gray-100 transform rotate-45"></div>
                    </div>
                  )}
                </div>
              </div>
              <div>
                <p className="text-base font-semibold text-white mb-2">Lead mới</p>
                <p className="text-4xl font-extrabold text-white mb-1">{pipelineStats.newLeads}</p>
                <div className="flex items-center justify-between mt-3">
                  <p className="text-sm text-white/90">T.trước: 1</p>
                  <p className="text-sm text-white/90 font-semibold">+200%</p>
                </div>
              </div>
            </div>

            {/* Arrow */}
            <div className="flex items-center">
              <ArrowRight className="w-3 h-3 text-gray-400" />
            </div>

            {/* 2. Đang tư vấn - LINH ĐỘNG */}
            <div
              className={`flex flex-col justify-between rounded-lg px-8 py-7 min-w-[220px] max-w-[240px] bg-gradient-to-br from-blue-600 to-blue-400 text-white shadow-lg cursor-pointer relative transition-all hover:shadow-xl ${selectedPipelineStage === 'contacted' ? 'ring-4 ring-blue-300 transform scale-105 z-10' : ''
                }`}
              onClick={() => handlePipelineStageClick('contacted')}
            >
              <div className="absolute top-2 right-2">
                <div
                  className="relative"
                  onMouseEnter={() => setShowTooltip('stage-contacted')}
                  onMouseLeave={() => setShowTooltip(null)}
                >
                  <HelpCircle className="w-3.5 h-3.5 text-white/70 hover:text-white cursor-help transition-colors" />
                  {showTooltip === 'stage-contacted' && (
                    <div className="absolute right-0 top-6 z-10 bg-white text-gray-600 text-sm rounded-xl py-3 px-4 shadow-lg border border-gray-100 min-w-[220px]">
                      <p>Đang tư vấn và tìm hiểu nhu cầu khách hàng.</p>
                      <div className="absolute top-[-6px] right-4 w-3 h-3 bg-white border-l border-t border-gray-100 transform rotate-45"></div>
                    </div>
                  )}
                </div>
              </div>
              <div>
                <p className="text-base font-semibold text-white mb-2">Đang tư vấn</p>
                <p className="text-4xl font-extrabold text-white mb-1">{pipelineStats.contactedLeads}</p>
                <div className="flex items-center justify-between mt-3">
                  <p className="text-sm text-white/90">T.trước: 2</p>
                  <p className="text-sm text-white/90 font-semibold">+50%</p>
                </div>
              </div>
            </div>

            {/* Arrow */}
            <div className="flex items-center">
              <ArrowRight className="w-3 h-3 text-gray-400" />
            </div>

            {/* 3. Đã gửi ĐX - LINH ĐỘNG */}
            <div
              className={`flex flex-col justify-between rounded-lg px-8 py-7 min-w-[220px] max-w-[240px] bg-gradient-to-br from-green-600 to-green-400 text-white shadow-lg cursor-pointer relative transition-all hover:shadow-xl ${selectedPipelineStage === 'qualified' ? 'ring-4 ring-green-300 transform scale-105 z-10' : ''
                }`}
              onClick={() => handlePipelineStageClick('qualified')}
            >
              <div className="absolute top-2 right-2">
                <div
                  className="relative"
                  onMouseEnter={() => setShowTooltip('stage-qualified')}
                  onMouseLeave={() => setShowTooltip(null)}
                >
                  <HelpCircle className="w-3.5 h-3.5 text-white/70 hover:text-white cursor-help transition-colors" />
                  {showTooltip === 'stage-qualified' && (
                    <div className="absolute right-0 top-6 z-10 bg-white text-gray-600 text-sm rounded-xl py-3 px-4 shadow-lg border border-gray-100 min-w-[220px]">
                      <p>Đã gửi đề xuất/hợp đồng cho khách.</p>
                      <div className="absolute top-[-6px] right-4 w-3 h-3 bg-white border-l border-t border-gray-100 transform rotate-45"></div>
                    </div>
                  )}
                </div>
              </div>
              <div>
                <p className="text-base font-semibold text-white mb-2">Đã gửi đề xuất</p>
                <p className="text-4xl font-extrabold text-white mb-1">{pipelineStats.qualifiedLeads}</p>
                <div className="flex items-center justify-between mt-3">
                  <p className="text-sm text-white/90">T.trước: 2</p>
                  <p className="text-sm text-white/90 font-semibold">+100%</p>
                </div>
              </div>
            </div>

            {/* Arrow */}
            <div className="flex items-center">
              <ArrowRight className="w-3 h-3 text-gray-400" />
            </div>

            {/* 4. Đàm phán - LINH ĐỘNG */}
            <div
              className={`flex flex-col justify-between rounded-lg px-8 py-7 min-w-[220px] max-w-[240px] bg-gradient-to-br from-yellow-600 to-yellow-400 text-white shadow-lg cursor-pointer relative transition-all hover:shadow-xl ${selectedPipelineStage === 'negotiation' ? 'ring-4 ring-yellow-300 transform scale-105 z-10' : ''
                }`}
              onClick={() => handlePipelineStageClick('negotiation')}
            >
              <div className="absolute top-2 right-2">
                <div
                  className="relative"
                  onMouseEnter={() => setShowTooltip('stage-negotiation')}
                  onMouseLeave={() => setShowTooltip(null)}
                >
                  <HelpCircle className="w-3.5 h-3.5 text-white/70 hover:text-white cursor-help transition-colors" />
                  {showTooltip === 'stage-negotiation' && (
                    <div className="absolute right-0 top-6 z-10 bg-white text-gray-600 text-sm rounded-xl py-3 px-4 shadow-lg border border-gray-100 min-w-[220px]">
                      <p>Đang thảo luận về giá cả và điều kiện.</p>
                      <div className="absolute top-[-6px] right-4 w-3 h-3 bg-white border-l border-t border-gray-100 transform rotate-45"></div>
                    </div>
                  )}
                </div>
              </div>
              <div>
                <p className="text-base font-semibold text-white mb-2">Đàm phán</p>
                <p className="text-4xl font-extrabold text-white mb-1">{pipelineStats.negotiationLeads}</p>
                <div className="flex items-center justify-between mt-3">
                  <p className="text-sm text-white/90">T.trước: 4</p>
                  <p className="text-sm text-white/90 font-semibold">-25%</p>
                </div>
              </div>
            </div>

            {/* Arrow */}
            <div className="flex items-center">
              <ArrowRight className="w-3 h-3 text-gray-400" />
            </div>

            {/* 5. Chờ thanh toán - BẮT BUỘC */}
            <div
              className={`flex flex-col justify-between rounded-lg px-8 py-7 min-w-[220px] max-w-[240px] bg-gradient-to-br from-orange-600 to-orange-400 text-white shadow-lg cursor-pointer relative transition-all hover:shadow-xl ${selectedPipelineStage === 'payment_pending' ? 'ring-4 ring-orange-300 transform scale-105 z-10' : ''
                }`}
              onClick={() => handlePipelineStageClick('payment_pending')}
            >
              <div className="absolute top-2 right-2">
                <div
                  className="relative"
                  onMouseEnter={() => setShowTooltip('stage-payment')}
                  onMouseLeave={() => setShowTooltip(null)}
                >
                  <HelpCircle className="w-3.5 h-3.5 text-white/70 hover:text-white cursor-help transition-colors" />
                  {showTooltip === 'stage-payment' && (
                    <div className="absolute right-0 top-6 z-10 bg-white text-gray-600 text-sm rounded-xl py-3 px-4 shadow-lg border border-gray-100 min-w-[240px]">
                      <p>Khách hàng đã đồng ý, đang chờ thanh toán.</p>
                      <div className="absolute top-[-6px] right-4 w-3 h-3 bg-white border-l border-t border-gray-100 transform rotate-45"></div>
                    </div>
                  )}
                </div>
              </div>
              <div>
                <p className="text-base font-semibold text-white mb-2">Chờ thanh toán</p>
                <p className="text-4xl font-extrabold text-white mb-1">{pipelineStats.paymentPendingLeads || 0}</p>
                <div className="flex items-center justify-between mt-3">
                  <p className="text-sm text-white/90">T.trước: 1</p>
                  <p className="text-sm text-white/90 font-semibold">+0%</p>
                </div>
              </div>
            </div>

            {/* Arrow */}
            <div className="flex items-center">
              <ArrowRight className="w-3 h-3 text-gray-400" />
            </div>

            {/* 6. Đã chốt - BẮT BUỘC */}
            <div
              className={`flex flex-col justify-between rounded-lg px-8 py-7 min-w-[220px] max-w-[240px] bg-gradient-to-br from-emerald-600 to-emerald-400 text-white shadow-lg cursor-pointer relative transition-all hover:shadow-xl ${selectedPipelineStage === 'converted' ? 'ring-4 ring-emerald-300 transform scale-105 z-10' : ''
                }`}
              onClick={() => handlePipelineStageClick('converted')}
            >
              <div className="absolute top-2 right-2">
                <div
                  className="relative"
                  onMouseEnter={() => setShowTooltip('stage-converted')}
                  onMouseLeave={() => setShowTooltip(null)}
                >
                  <HelpCircle className="w-3.5 h-3.5 text-white/70 hover:text-white cursor-help transition-colors" />
                  {showTooltip === 'stage-converted' && (
                    <div className="absolute right-0 top-6 z-10 bg-white text-gray-600 text-sm rounded-xl py-3 px-4 shadow-lg border border-gray-100 min-w-[200px]">
                      <p>Deal thành công, đã nhận thanh toán.</p>
                      <div className="absolute top-[-6px] right-4 w-3 h-3 bg-white border-l border-t border-gray-100 transform rotate-45"></div>
                    </div>
                  )}
                </div>
              </div>
              <div>
                <p className="text-base font-semibold text-white mb-2">Thành công</p>
                <p className="text-4xl font-extrabold text-white mb-1">{pipelineStats.convertedLeads}</p>
                <div className="flex items-center justify-between mt-3">
                  <p className="text-sm text-white/90">T.trước: 1</p>
                  <p className="text-sm text-white/90 font-semibold">+100%</p>
                </div>
              </div>
            </div>

            {/* Arrow */}
            <div className="flex items-center">
              <ArrowRight className="w-3 h-3 text-gray-400" />
            </div>

            {/* 7. Thất bại - BẮT BUỘC */}
            <div
              className={`flex flex-col justify-between rounded-lg px-8 py-7 min-w-[220px] max-w-[240px] bg-gradient-to-br from-red-600 to-red-400 text-white shadow-lg cursor-pointer relative ${selectedPipelineStage === 'lost' ? 'ring-2 ring-red-700' : ''}`}
              onClick={() => handlePipelineStageClick('lost')}
            >
              <div className="absolute top-2 right-2">
                <div
                  className="relative"
                  onMouseEnter={() => setShowTooltip('stage-lost')}
                  onMouseLeave={() => setShowTooltip(null)}
                >
                  <HelpCircle className="w-3.5 h-3.5 text-white/70 hover:text-white cursor-help transition-colors" />
                  {showTooltip === 'stage-lost' && (
                    <div className="absolute right-0 top-6 z-10 bg-white text-gray-600 text-sm rounded-xl py-3 px-4 shadow-lg border border-gray-100 min-w-[240px]">
                      <p>Deal không thành công, phân tích nguyên nhân.</p>
                      <div className="absolute top-[-6px] right-4 w-3 h-3 bg-white border-l border-t border-gray-100 transform rotate-45"></div>
                    </div>
                  )}
                </div>
              </div>
              <div>
                <p className="text-base font-semibold text-white mb-2">Thất bại</p>
                <p className="text-4xl font-extrabold text-white mb-1">{pipelineStats.lostLeads || 1}</p>
                <div className="flex items-center justify-between mt-3">
                  <p className="text-sm text-white/90">T.trước: 2</p>
                  <p className="text-sm text-white/90 font-semibold">-50%</p>
                </div>
              </div>
            </div>
          </div>

          {/* Pipeline Progress Bar */}
          <div className="mt-6 pt-5 border-t border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 animate-pulse"></div>
                  <span className="text-base font-medium text-gray-700">Tiến độ Pipeline</span>
                </div>
                <div
                  className="relative"
                  onMouseEnter={() => setShowTooltip('progress-bar')}
                  onMouseLeave={() => setShowTooltip(null)}
                >
                  <HelpCircle className="w-4 h-4 text-gray-400 hover:text-blue-500 cursor-help transition-colors" />
                  {showTooltip === 'progress-bar' && (
                    <div className="absolute left-0 top-7 z-10 bg-white text-gray-600 text-sm rounded-xl py-3 px-4 shadow-lg border border-gray-100 min-w-[300px]">
                      <p>Dựa trên tổng đơn hàng thành công và thực tế trên hợp đồng</p>
                      <div className="absolute top-[-6px] left-4 w-3 h-3 bg-white border-l border-t border-gray-100 transform rotate-45"></div>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
                  {Math.round((pipelineStats.convertedLeads / leads.length) * 100)}%
                </span>
                <span className="text-xs text-gray-500">hoàn thành</span>
              </div>
            </div>
            <div className="relative w-full h-3 bg-gray-100 rounded-full overflow-hidden shadow-inner">
              <div
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-violet-500 via-fuchsia-500 to-pink-500 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${Math.round((pipelineStats.convertedLeads / leads.length) * 100)}%` }}
              >
                <div className="absolute inset-0 bg-gradient-to-b from-white/25 to-transparent"></div>
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full shadow-md"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter Controls */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* View Mode Toggle */}
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('table')}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${viewMode === 'table'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
                  }`}
              >
                <Table className="w-4 h-4" />
                Bảng
              </button>
              <button
                onClick={() => setViewMode('kanban')}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${viewMode === 'kanban'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
                  }`}
              >
                <LayoutGrid className="w-4 h-4" />
                Kanban
              </button>
            </div>

            {/* Search Bar */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Tìm theo tên, email, phone, công ty..."
                  value={leadSearchTerm}
                  onChange={(e) => setLeadSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Filter Controls */}
            <div className="flex gap-3">
              <select
                value={leadStatusFilter}
                onChange={(e) => setLeadStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="new">🆕 Lead mới</option>
                <option value="contacted">💬 Đang tư vấn</option>
                <option value="qualified">📄 Đã gửi đề xuất</option>
                <option value="negotiation">🤝 Đàm phán</option>
                <option value="payment_pending">💳 Chuyển đổi - chờ thanh toán</option>
                <option value="converted">✅ Chuyển đổi thành công</option>
                <option value="lost">❌ Thất bại</option>
              </select>

              <select
                value={leadSourceFilter}
                onChange={(e) => setLeadSourceFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Tất cả nguồn</option>
                <option value="facebook">Facebook</option>
                <option value="google">Google</option>
                <option value="website">Website</option>
                <option value="zalo">Zalo</option>
                <option value="referral">Referral</option>
              </select>

              <button
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-200 flex items-center gap-2"
              >
                <Filter className="w-4 h-4" />
                Lọc nâng cao
                <ChevronDown className={`w-4 h-4 transition-transform ${showAdvancedFilters ? 'rotate-180' : ''}`} />
              </button>

              <div className="relative">
                <button
                  onClick={() => setShowColumnSelector(!showColumnSelector)}
                  className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 hover:text-indigo-800 transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  Hiển thị cột
                </button>

                {showColumnSelector && (
                  <div className="absolute right-0 top-12 z-50 bg-white border border-gray-200 rounded-lg shadow-lg p-4 min-w-[300px]">
                    <h4 className="font-medium text-gray-900 mb-3">Tùy chỉnh cột hiển thị</h4>
                    <div className="grid grid-cols-2 gap-2 max-h-80 overflow-y-auto">
                      {Object.entries(columnLabels).map(([key, label]) => (
                        <label key={key} className="flex items-center space-x-2 text-sm cursor-pointer">
                          <input
                            type="checkbox"
                            checked={visibleColumns[key as keyof typeof visibleColumns]}
                            onChange={(e) => setVisibleColumns(prev => ({
                              ...prev,
                              [key]: e.target.checked
                            }))}
                            className="w-4 h-4 rounded border-gray-300 text-[#1a3353] focus:ring-[#1a3353]"
                          />
                          <span className="text-gray-700">{label}</span>
                        </label>
                      ))}
                    </div>
                    <div className="mt-4 pt-3 border-t border-gray-200 flex justify-start gap-3">
                      <button
                        onClick={() => {
                          const allEnabled = Object.keys(visibleColumns).reduce((acc, key) => {
                            acc[key as keyof typeof visibleColumns] = true;
                            return acc;
                          }, {} as typeof visibleColumns);
                          setVisibleColumns(allEnabled);
                        }}
                        className="px-4 py-2 text-sm font-medium text-white bg-[#1a3353] rounded-lg hover:bg-[#2a4363] transition-colors"
                      >
                        Tất cả
                      </button>
                      <button
                        onClick={() => setVisibleColumns({
                          checkbox: true, stt: true, customerName: true, phone: true, email: true,
                          address: true, source: true, stage: true, estimatedRevenue: false,
                          salesOwner: true, tags: true,
                          notes: true, createdDate: true, actions: true
                        })}
                        className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
                      >
                        Mặc định
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Hidden: Automatic lead distribution button 
              <button 
                onClick={() => setShowAutoAssignModal(true)}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all duration-200 flex items-center gap-2 shadow-md hover:shadow-lg transform hover:scale-[1.02]"
              >
                <Bot className="w-4 h-4" />
                Phân leads tự động
              </button>
              */}

              <button
                onClick={() => setShowImportModal(true)}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-200 flex items-center gap-2 shadow-md hover:shadow-lg transform hover:scale-[1.02]"
              >
                <Download className="w-4 h-4" />
                Nhập leads
              </button>

              <button
                onClick={() => setShowAddLeadModal(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 flex items-center gap-2 shadow-md hover:shadow-lg transform hover:scale-[1.02]"
              >
                <Plus className="w-4 h-4" />
                Thêm Lead
              </button>
            </div>
          </div>

          {/* Filter Summary */}
          {(leadSearchTerm || leadStatusFilter !== 'all' || leadRegionFilter !== 'all' || leadSourceFilter !== 'all' ||
            filterDepartment || filterTeam || filterAssignee || filterLastContact || filterCreatedDate.start || filterCreatedDate.end ||
            filterInteractionCount.min || filterInteractionCount.max || filterPriority ||
            filterProductInterest) && (
              <div className="mt-3 flex items-center gap-2 text-sm text-gray-600">
                <span>Hiển thị {filteredLeads.length} / {leads.length} leads</span>
                <button
                  onClick={() => {
                    setLeadSearchTerm('');
                    setLeadStatusFilter('all');
                    setLeadRegionFilter('all');
                    setLeadSourceFilter('all');
                    // Clear advanced filters
                    setFilterDepartment('')
                    setFilterTeam('')
                    setFilterAssignee('')
                    setFilterLastContact('')
                    setFilterCreatedDate({ start: '', end: '' })
                    setFilterInteractionCount({ min: '', max: '' })
                    setFilterPriority('')
                    setFilterProductInterest('')
                  }}
                  className="text-blue-600 hover:text-blue-800"
                >
                  Xóa tất cả bộ lọc
                </button>
              </div>
            )}

          {/* Advanced Filters - Inside toolbar container */}
          {showAdvancedFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <h3 className="text-sm font-semibold text-gray-800 mb-3">Bộ lọc nâng cao</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                {/* Sales phụ trách */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Sales phụ trách</label>
                  <select
                    value={filterAssignee}
                    onChange={(e) => setFilterAssignee(e.target.value)}
                    className="w-full px-2 py-1.5 border border-gray-300 rounded-md text-xs bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  >
                    <option value="">Chọn sale</option>
                    <option value="Nguyễn Văn A">Nguyễn Văn A</option>
                    <option value="Trần Thị B">Trần Thị B</option>
                    <option value="Lê Văn C">Lê Văn C</option>
                    <option value="Phạm Thị D">Phạm Thị D</option>
                    <option value="Hoàng Văn E">Hoàng Văn E</option>
                  </select>
                </div>

                {/* Ngày tạo lead (chọn khoảng ngày) */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Ngày tạo lead</label>
                  <div className="relative">
                    <div className="flex items-center border border-gray-300 rounded-md bg-white overflow-hidden focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500">
                      <div className="flex items-center px-2 text-gray-400">
                        <Calendar className="w-3.5 h-3.5" />
                      </div>
                      <input
                        type="date"
                        value={filterCreatedDate.start}
                        onChange={(e) => setFilterCreatedDate({ ...filterCreatedDate, start: e.target.value })}
                        className="flex-1 px-1 py-1.5 text-xs border-0 focus:ring-0 focus:outline-none"
                      />
                      <span className="text-gray-400 text-xs">-</span>
                      <input
                        type="date"
                        value={filterCreatedDate.end}
                        onChange={(e) => setFilterCreatedDate({ ...filterCreatedDate, end: e.target.value })}
                        className="flex-1 px-1 py-1.5 text-xs border-0 focus:ring-0 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Sản phẩm quan tâm */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Sản phẩm quan tâm</label>
                  <select
                    value={filterProductInterest}
                    onChange={(e) => setFilterProductInterest(e.target.value)}
                    className="w-full px-2 py-1.5 border border-gray-300 rounded-md text-xs bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  >
                    <option value="">Chọn sản phẩm</option>
                    <option value="CRM Basic">CRM Basic</option>
                    <option value="CRM Professional">CRM Professional</option>
                    <option value="CRM Enterprise">CRM Enterprise</option>
                    <option value="Marketing Automation">Marketing Automation</option>
                    <option value="Sales Analytics">Sales Analytics</option>
                  </select>
                </div>

                {/* Tỉnh thành - Searchable dropdown */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Tỉnh thành</label>
                  <div className="relative">
                    <div
                      className="w-full px-2 py-1.5 border border-gray-300 rounded-md text-xs bg-white cursor-pointer flex items-center justify-between hover:border-gray-400 transition-colors"
                      onClick={() => setShowProvinceDropdown(!showProvinceDropdown)}
                    >
                      <span className={filterProvince ? 'text-gray-900' : 'text-gray-500'}>
                        {filterProvince || 'Chọn tỉnh thành'}
                      </span>
                      <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform ${showProvinceDropdown ? 'rotate-180' : ''}`} />
                    </div>

                    {showProvinceDropdown && (
                      <>
                        <div
                          className="fixed inset-0 z-[998]"
                          onClick={() => {
                            setShowProvinceDropdown(false)
                            setProvinceSearchTerm('')
                          }}
                        />
                        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-[999] max-h-[280px] overflow-hidden">
                          {/* Search input */}
                          <div className="p-2 border-b border-gray-100">
                            <div className="relative">
                              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                              <input
                                type="text"
                                placeholder="Tìm kiếm"
                                value={provinceSearchTerm}
                                onChange={(e) => setProvinceSearchTerm(e.target.value)}
                                className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                onClick={(e) => e.stopPropagation()}
                              />
                            </div>
                          </div>

                          {/* Province list */}
                          <div className="max-h-[220px] overflow-y-auto">
                            {filteredProvinces.length > 0 ? (
                              filteredProvinces.map((province) => (
                                <button
                                  key={province}
                                  onClick={() => {
                                    setFilterProvince(province)
                                    setShowProvinceDropdown(false)
                                    setProvinceSearchTerm('')
                                  }}
                                  className={`w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors flex items-center justify-between ${filterProvince === province ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                                    }`}
                                >
                                  <span>{province}</span>
                                  {filterProvince === province && (
                                    <Check className="w-4 h-4 text-blue-600" />
                                  )}
                                </button>
                              ))
                            ) : (
                              <div className="px-4 py-3 text-sm text-gray-500 text-center">
                                Không tìm thấy tỉnh thành
                              </div>
                            )}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Tag */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Thẻ Tag</label>
                  <select
                    value={filterTag}
                    onChange={(e) => setFilterTag(e.target.value)}
                    className="w-full px-2 py-1.5 border border-gray-300 rounded-md text-xs bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  >
                    <option value="">Chọn tag</option>
                    <option value="hot">Hot</option>
                    <option value="warm">Warm</option>
                    <option value="cold">Cold</option>
                    <option value="enterprise">Enterprise</option>
                    <option value="sme">SME</option>
                  </select>
                </div>
              </div>

              {/* Filter Action Buttons */}
              <div className="mt-5 flex items-center gap-3">
                <button
                  onClick={() => {
                    // TODO: Apply filter logic
                    setShowAdvancedFilters(false)
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Check className="w-4 h-4" />
                  <span>Áp dụng bộ lọc</span>
                </button>
                <button
                  onClick={() => {
                    setFilterAssignee('')
                    setFilterCreatedDate({ start: '', end: '' })
                    setFilterProductInterest('')
                    setFilterProvince('')
                    setFilterTag('')
                    setProvinceSearchTerm('')
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <X className="w-4 h-4" />
                  <span>Xóa bộ lọc nâng cao</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Leads View - Table or Kanban */}
        {viewMode === 'table' ? (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            {/* Bulk Actions Bar - Show when leads are selected */}
            {selectedLeadIds.length > 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-blue-900">
                      Đã chọn {selectedLeadIds.length} leads
                    </span>
                    <button
                      onClick={() => {
                        setSelectedLeadIds([])
                        setSelectAllChecked(false)
                      }}
                      className="text-xs text-blue-600 hover:text-blue-800 underline"
                    >
                      Bỏ chọn tất cả
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleAssignSalesQuick}
                      className="px-3 py-1.5 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 transition-colors flex items-center gap-1"
                    >
                      <User className="w-4 h-4" />
                      Gán Sales nhanh
                    </button>
                    <button
                      onClick={() => setShowBulkStatusModal(true)}
                      className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors flex items-center gap-1"
                    >
                      <TrendingUp className="w-4 h-4" />
                      Chuyển trạng thái
                    </button>
                    <button
                      onClick={handleCreateTaskQuick}
                      className="px-3 py-1.5 bg-orange-600 text-white text-sm rounded-md hover:bg-orange-700 transition-colors flex items-center gap-1"
                    >
                      <Plus className="w-4 h-4" />
                      Tạo task nhanh
                    </button>
                    <button
                      onClick={handleExportSelectedLeads}
                      className="px-3 py-1.5 bg-purple-600 text-white text-sm rounded-md hover:bg-purple-700 transition-colors flex items-center gap-1"
                    >
                      <Download className="w-4 h-4" />
                      Xuất leads
                    </button>
                    <button
                      onClick={() => {
                        setBulkConvertTargetStatus('payment_pending')
                        setShowBulkConvertModal(true)
                      }}
                      className="px-3 py-1.5 bg-teal-600 text-white text-sm rounded-md hover:bg-teal-700 transition-colors flex items-center gap-1"
                    >
                      <User className="w-4 h-4" />
                      Chuyển đổi khách hàng
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Display count */}
            <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
              <span>Hiển thị {filteredLeads.length} trong tổng {leads.length} khách hàng</span>
            </div>

            <div className="omi-table-container overflow-x-auto rounded-lg border border-gray-200">
              <table className="omi-table">
                <thead>
                  <tr>
                    {/* 1. Checkbox */}
                    {visibleColumns.checkbox && (
                      <th className="omi-table-sticky-left text-center" style={{ width: '48px' }}>
                        <input
                          type="checkbox"
                          className="omi-checkbox"
                          checked={selectAllChecked}
                          onChange={(e) => handleToggleSelectAll(e.target.checked)}
                        />
                      </th>
                    )}

                    {/* 2. STT */}
                    {visibleColumns.stt && (
                      <th className="text-center" style={{ width: '60px' }}>
                        STT
                      </th>
                    )}

                    {/* 3. Tên khách hàng */}
                    {visibleColumns.customerName && (
                      <th style={{ minWidth: '180px' }}>
                        Tên khách hàng
                      </th>
                    )}

                    {/* 4. Số điện thoại */}
                    {visibleColumns.phone && (
                      <th style={{ width: '130px' }}>
                        Số điện thoại
                      </th>
                    )}

                    {/* 5. Email */}
                    {visibleColumns.email && (
                      <th style={{ minWidth: '180px' }}>
                        Email
                      </th>
                    )}

                    {/* 6. Nguồn */}
                    {visibleColumns.source && (
                      <th style={{ width: '120px' }}>
                        Nguồn
                      </th>
                    )}

                    {/* 7. Địa chỉ */}
                    {visibleColumns.address && (
                      <th style={{ minWidth: '180px' }}>
                        Địa chỉ
                      </th>
                    )}

                    {/* 8. Giai đoạn */}
                    {visibleColumns.stage && (
                      <th style={{ minWidth: '150px' }}>
                        Giai đoạn
                      </th>
                    )}

                    {/* 8.5. Doanh thu ước tính */}
                    {visibleColumns.estimatedRevenue && (
                      <th style={{ width: '150px' }}>
                        Doanh thu ước tính
                      </th>
                    )}

                    {/* 9. Sales phụ trách */}
                    {visibleColumns.salesOwner && (
                      <th style={{ width: '150px' }}>
                        Sales phụ trách
                      </th>
                    )}

                    {/* 10. Tags */}
                    {visibleColumns.tags && (
                      <th style={{ width: '140px' }}>
                        Tags
                      </th>
                    )}

                    {/* 11. Ghi chú */}
                    {visibleColumns.notes && (
                      <th style={{ minWidth: '180px' }}>
                        Ghi chú
                      </th>
                    )}

                    {/* 12. Ngày tạo */}
                    {visibleColumns.createdDate && (
                      <th style={{ width: '110px' }}>
                        Ngày tạo
                      </th>
                    )}

                    {/* 13. Thao tác */}
                    {visibleColumns.actions && (
                      <th className="omi-table-sticky-right text-center" style={{ width: '80px' }}>
                        Thao tác
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {filteredLeads.map((lead, index) => (
                    <tr key={lead.id}>
                      {/* 1. Checkbox */}
                      {visibleColumns.checkbox && (
                        <td className="omi-table-sticky-left text-center">
                          <input
                            type="checkbox"
                            className="omi-checkbox"
                            checked={selectedLeadIds.includes(lead.id)}
                            onChange={() => handleToggleSelectLead(lead.id)}
                          />
                        </td>
                      )}

                      {/* 2. STT */}
                      {visibleColumns.stt && (
                        <td className="text-center">
                          {index + 1}
                        </td>
                      )}

                      {/* 3. Tên khách hàng */}
                      {visibleColumns.customerName && (
                        <td>
                          <span className="omi-link font-semibold" onClick={() => handleViewLeadDetail(lead)}>
                            {lead.name}
                          </span>
                        </td>
                      )}

                      {/* 4. Số điện thoại */}
                      {visibleColumns.phone && (
                        <td>
                          <span className="omi-truncate block" style={{ maxWidth: '120px' }}>{lead.phone}</span>
                        </td>
                      )}

                      {/* 5. Email */}
                      {visibleColumns.email && (
                        <td>
                          <span className="omi-truncate block" style={{ maxWidth: '170px' }} title={lead.email}>
                            {lead.email}
                          </span>
                        </td>
                      )}

                      {/* 6. Nguồn */}
                      {visibleColumns.source && (
                        <td>
                          <span className={`omi-badge ${lead.source === 'facebook' ? 'bg-blue-50 text-blue-600' :
                            lead.source === 'google' ? 'bg-red-50 text-red-600' :
                              lead.source === 'website' ? 'bg-green-50 text-green-600' :
                                lead.source === 'zalo' ? 'bg-blue-50 text-blue-600' :
                                  lead.source === 'linkedin' ? 'bg-blue-50 text-blue-600' :
                                    lead.source === 'referral' ? 'bg-purple-50 text-purple-600' :
                                      'bg-gray-50 text-gray-600'
                            }`}>
                            {lead.source === 'facebook' ? 'Facebook' :
                              lead.source === 'google' ? 'Google' :
                                lead.source === 'website' ? 'Website' :
                                  lead.source === 'zalo' ? 'Zalo' :
                                    lead.source === 'linkedin' ? 'LinkedIn' :
                                      lead.source === 'referral' ? 'Giới thiệu' : lead.source}
                          </span>
                        </td>
                      )}

                      {/* 7. Địa chỉ */}
                      {visibleColumns.address && (
                        <td>
                          <span className="omi-truncate block" style={{ maxWidth: '170px' }} title={lead.address}>
                            {lead.address || '-'}
                          </span>
                        </td>
                      )}

                      {/* 8. Giai đoạn */}
                      {visibleColumns.stage && (
                        <td className="whitespace-nowrap">
                          <span className={`inline-flex px-2.5 py-1 text-xs font-medium rounded-full whitespace-nowrap ${lead.status === 'new' ? 'bg-purple-100 text-purple-800' :
                            lead.status === 'contacted' ? 'bg-blue-100 text-blue-800' :
                              lead.status === 'qualified' ? 'bg-green-100 text-green-800' :
                                lead.status === 'proposal' ? 'bg-yellow-100 text-yellow-800' :
                                  lead.status === 'negotiation' ? 'bg-orange-100 text-orange-800' :
                                    lead.status === 'converted' ? 'bg-emerald-100 text-emerald-800' :
                                      lead.status === 'lost' ? 'bg-red-100 text-red-800' :
                                        'bg-gray-100 text-gray-800'
                            }`}>
                            {lead.status === 'new' ? 'Lead mới' :
                              lead.status === 'contacted' ? 'Đang tư vấn' :
                                lead.status === 'qualified' ? 'Đã gửi đề xuất' :
                                  lead.status === 'proposal' ? 'Đàm phán' :
                                    lead.status === 'negotiation' ? 'Chờ thanh toán' :
                                      lead.status === 'converted' ? 'Thành công' :
                                        lead.status === 'lost' ? 'Thất bại' : 'Khác'}
                          </span>
                        </td>
                      )}

                      {/* 8.5. Doanh thu ước tính */}
                      {visibleColumns.estimatedRevenue && (
                        <td>
                          <div className="text-sm text-gray-900 font-medium">
                            {lead.estimatedRevenue ? `${formatCurrency(lead.estimatedRevenue)} ₫` : '-'}
                          </div>
                        </td>
                      )}

                      {/* 9. Sales phụ trách */}
                      {visibleColumns.salesOwner && (
                        <td>
                          <div className="text-sm text-gray-900 truncate" style={{ maxWidth: '140px' }}>
                            {lead.assignedTo || 'Chưa phân công'}
                          </div>
                        </td>
                      )}

                      {/* 10. Tags */}
                      {visibleColumns.tags && (
                        <td>
                          <div className="flex flex-wrap gap-1">
                            {lead.tags.slice(0, 2).map((tag, tagIndex) => (
                              <span
                                key={tagIndex}
                                className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${tag === 'hot' ? 'bg-red-100 text-red-800' :
                                  tag === 'warm' ? 'bg-yellow-100 text-yellow-800' :
                                    tag === 'cold' ? 'bg-blue-100 text-blue-800' :
                                      tag === 'enterprise' ? 'bg-purple-100 text-purple-800' :
                                        tag === 'sme' ? 'bg-green-100 text-green-800' :
                                          'bg-gray-100 text-gray-800'
                                  }`}
                              >
                                {tag === 'hot' ? 'Hot' :
                                  tag === 'warm' ? 'Warm' :
                                    tag === 'cold' ? 'Cold' :
                                      tag === 'enterprise' ? 'Enterprise' :
                                        tag === 'sme' ? 'SME' : tag}
                              </span>
                            ))}
                            {lead.tags.length > 2 && (
                              <span className="text-xs text-gray-500">+{lead.tags.length - 2}</span>
                            )}
                          </div>
                        </td>
                      )}

                      {/* 11. Ghi chú */}
                      {visibleColumns.notes && (
                        <td>
                          <div className="text-sm text-gray-600 truncate" style={{ maxWidth: '170px' }} title={lead.content}>
                            {lead.content.length > 40 ? `${lead.content.substring(0, 40)}...` : lead.content}
                          </div>
                        </td>
                      )}

                      {/* 12. Ngày tạo */}
                      {visibleColumns.createdDate && (
                        <td>
                          <div className="text-sm text-gray-900">
                            {new Date(lead.createdAt).toLocaleDateString('vi-VN')}
                          </div>
                        </td>
                      )}

                      {/* 13. Thao tác */}
                      {visibleColumns.actions && (
                        <td className="omi-table-sticky-right text-center" style={{ zIndex: openActionMenuId === lead.id ? 100 : 'auto' }}>
                          <div className="relative">
                            <button
                              onClick={() => setOpenActionMenuId(openActionMenuId === lead.id ? null : lead.id)}
                              className="p-2 text-slate-500 hover:text-slate-700 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                              <Settings className="w-5 h-5" />
                            </button>

                            {openActionMenuId === lead.id && (
                              <>
                                <div
                                  className="fixed inset-0 z-[999]"
                                  onClick={() => setOpenActionMenuId(null)}
                                />
                                <div className="absolute right-0 top-full mt-1 w-56 bg-white rounded-xl shadow-xl border border-gray-200 z-[1000] py-2 text-left">
                                  {/* THÔNG TIN */}
                                  <div className="px-3 py-1.5">
                                    <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Thông tin</span>
                                  </div>
                                  <button
                                    onClick={() => {
                                      handleViewLeadDetail(lead)
                                      setOpenActionMenuId(null)
                                    }}
                                    className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                  >
                                    <Eye className="w-4 h-4 text-gray-400" />
                                    <span>Xem chi tiết</span>
                                  </button>
                                  <button
                                    onClick={() => {
                                      setEditingLead(lead)
                                      setShowEditModal(true)
                                      setOpenActionMenuId(null)
                                    }}
                                    className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                  >
                                    <svg className="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                      <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" fill="currentColor" />
                                    </svg>
                                    <span>Chỉnh sửa</span>
                                  </button>

                                  {/* THAO TÁC NHANH */}
                                  <div className="border-t border-gray-100 mt-1 pt-1">
                                    <div className="px-3 py-1.5">
                                      <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Thao tác nhanh</span>
                                    </div>
                                    <button
                                      onClick={() => {
                                        handleAddNote(lead)
                                        setOpenActionMenuId(null)
                                      }}
                                      className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                    >
                                      <StickyNote className="w-4 h-4 text-gray-400" />
                                      <span>Thêm ghi chú</span>
                                    </button>
                                    <button
                                      onClick={() => {
                                        // Set the single lead as selected
                                        setSelectedLeadIds([lead.id])
                                        setBulkConvertTargetStatus('payment_pending')
                                        setShowBulkConvertModal(true)
                                        setOpenActionMenuId(null)
                                      }}
                                      className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                    >
                                      <User className="w-4 h-4 text-gray-400" />
                                      <span>Chuyển đổi khách hàng</span>
                                    </button>
                                  </div>

                                  {/* THAO TÁC NGUY HIỂM */}
                                  <div className="border-t border-gray-100 mt-1 pt-1">
                                    <div className="px-3 py-1.5">
                                      <span className="text-[11px] font-semibold text-red-400 uppercase tracking-wider">Thao tác nguy hiểm</span>
                                    </div>
                                    <button
                                      onClick={() => {
                                        if (confirm(`Bạn có chắc chắn muốn xóa lead "${lead.name}"?`)) {
                                          // Handle delete lead
                                          setOpenActionMenuId(null)
                                        }
                                      }}
                                      className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                      <span>Xóa lead</span>
                                    </button>
                                  </div>
                                </div>
                              </>
                            )}
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6 mt-4">
              <div className="flex-1 flex justify-between sm:hidden">
                <button className="relative inline-flex items-center px-4 py-2 border border-slate-300 text-sm font-medium rounded-lg text-slate-700 bg-slate-50 hover:bg-slate-100 hover:text-slate-800 transition-all duration-200 shadow-sm hover:shadow-md">
                  Trước
                </button>
                <button className="ml-3 relative inline-flex items-center px-4 py-2 border border-slate-300 text-sm font-medium rounded-lg text-slate-700 bg-slate-50 hover:bg-slate-100 hover:text-slate-800 transition-all duration-200 shadow-sm hover:shadow-md">
                  Sau
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Hiển thị <span className="font-medium">1</span> đến <span className="font-medium">{filteredLeads.length}</span> của{' '}
                    <span className="font-medium">{filteredLeads.length}</span> kết quả
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-lg shadow-sm -space-x-px" aria-label="Pagination">
                    <button className="relative inline-flex items-center px-2 py-2 rounded-l-lg border border-slate-300 bg-slate-50 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-700 focus:z-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200">
                      <span className="sr-only">Trước</span>
                      <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </button>
                    <button className="bg-blue-600 border-blue-600 text-white relative inline-flex items-center px-4 py-2 border text-sm font-medium shadow-md hover:bg-blue-700 transition-all duration-200">
                      1
                    </button>
                    <button className="relative inline-flex items-center px-2 py-2 rounded-r-lg border border-slate-300 bg-slate-50 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-700 focus:z-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200">
                      <span className="sr-only">Sau</span>
                      <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Kanban View */
          <div className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-7 gap-4 h-[calc(100vh-400px)]">
              {['new', 'contacted', 'qualified', 'negotiation', 'payment_pending', 'converted', 'lost'].map((status) => {
                const statusLeads = filteredLeads.filter(lead => lead.status === status);

                return (
                  <div
                    key={status}
                    className="bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col h-full"
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, status)}
                  >
                    {/* Column Header */}
                    <div className={`p-4 border-b border-gray-200 flex items-center justify-between transition-colors ${draggedLead && draggedLead.status !== status ?
                      (status === 'converted' ? 'bg-green-50 border-green-200' : 'bg-blue-50 border-blue-200')
                      : ''
                      }`}>
                      <div className="flex items-center">
                        <span className={`w-3 h-3 rounded-full mr-2 ${status === 'new' ? 'bg-gray-500' :
                          status === 'contacted' ? 'bg-blue-500' :
                            status === 'qualified' ? 'bg-green-500' :
                              status === 'negotiation' ? 'bg-yellow-500' :
                                status === 'payment_pending' ? 'bg-purple-500' :
                                  status === 'converted' ? 'bg-green-600' :
                                    'bg-red-500'
                          }`}></span>
                        <h3 className="font-medium text-gray-900">
                          {getStatusName(status)}
                          {status === 'converted' && (
                            <span className="text-xs text-gray-500 ml-1">(Tự động)</span>
                          )}
                        </h3>
                      </div>
                      <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                        {statusLeads.length}
                      </span>
                    </div>

                    {/* Cards Container */}
                    <div className="flex-1 p-2 overflow-y-auto">
                      {statusLeads.length === 0 ? (
                        <div className={`text-center py-12 text-gray-400 border-2 border-dashed border-gray-200 rounded-lg transition-colors ${draggedLead && draggedLead.status !== status ? 'border-blue-400 bg-blue-50 text-blue-600' : ''
                          }`}>
                          <div className="flex flex-col items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                              <Plus className="w-4 h-4" />
                            </div>
                            <p className="text-sm">
                              {draggedLead && draggedLead.status !== status ? 'Thả vào đây' : 'Chưa có lead'}
                            </p>
                          </div>
                        </div>
                      ) : (
                        statusLeads.map((lead) => (
                          <div
                            key={lead.id}
                            className={`bg-white rounded-lg p-3 shadow-sm border border-gray-200 hover:shadow-md transition-all ${lead.status === 'converted'
                              ? 'cursor-not-allowed border-green-300 bg-green-50'
                              : 'cursor-move'
                              } ${draggedLead?.id === lead.id ? 'opacity-50 rotate-2 scale-105' : 'hover:scale-102'
                              }`}
                            draggable={lead.status !== 'converted'}
                            title={lead.status === 'converted' ? 'Lead đã chuyển đổi thành công, không thể di chuyển' : ''}
                            onDragStart={(e) => {
                              if (lead.status === 'converted') {
                                e.preventDefault()
                                return
                              }
                              handleDragStart(e, lead)
                            }}
                            onDragEnd={handleDragEnd}
                          >
                            <div className="space-y-2">
                              {/* Lead Header */}
                              <div className="flex items-start justify-between">
                                <div>
                                  <h4 className="font-medium text-gray-900 text-sm">{lead.name}</h4>
                                  {lead.company && (
                                    <p className="text-xs text-gray-500">{lead.company}</p>
                                  )}
                                </div>
                                {lead.status === 'converted' && (
                                  <div className="flex items-center">
                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                      ✓ Hoàn tất
                                    </span>
                                  </div>
                                )}
                              </div>

                              {/* Sản phẩm quan tâm */}
                              <div>
                                <p className="text-xs text-gray-500 mb-1">Sản phẩm quan tâm:</p>
                                <p className="text-sm text-gray-900 font-medium">{lead.product}</p>
                              </div>

                              {/* Contact Info */}
                              <div className="text-xs text-gray-500 space-y-1">
                                <p className="flex items-center gap-1">
                                  <Phone className="w-3 h-3" />
                                  {lead.phone}
                                </p>
                                <p className="flex items-center gap-1">
                                  <Mail className="w-3 h-3" />
                                  {lead.email}
                                </p>
                              </div>

                              {/* Source & Region */}
                              <div className="text-xs text-gray-500 space-y-1">
                                <p><span className="font-medium">Nguồn:</span> {lead.source}</p>
                                <p><span className="font-medium">Tỉnh thành:</span> {lead.region}</p>
                              </div>

                              {/* Tags */}
                              <div className="flex flex-wrap gap-1">
                                {lead.tags.slice(0, 2).map((tag, index) => (
                                  <span key={index} className={`px-2 py-1 text-xs font-medium rounded-full ${tag === 'hot' ? 'bg-red-100 text-red-800' :
                                    tag === 'warm' ? 'bg-yellow-100 text-yellow-800' :
                                      tag === 'cold' ? 'bg-blue-100 text-blue-800' :
                                        tag === 'enterprise' ? 'bg-purple-100 text-purple-800' :
                                          'bg-gray-100 text-gray-800'
                                    }`}>
                                    {tag}
                                  </span>
                                ))}
                              </div>

                              {/* Assigned To */}
                              <div className="flex items-center gap-2">
                                <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center">
                                  <User className="w-3 h-3 text-gray-500" />
                                </div>
                                <span className="text-xs text-gray-600">{lead.assignedTo}</span>
                              </div>

                              {/* Actions */}
                              <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                                <div className="flex items-center gap-1">
                                  <button
                                    onClick={() => handleViewLeadDetail(lead)}
                                    className="p-1.5 text-slate-600 hover:text-white hover:bg-blue-600 rounded-md transition-all duration-200 transform hover:scale-105 shadow-sm hover:shadow-md"
                                    title="Xem chi tiết"
                                  >
                                    <Eye className="w-3.5 h-3.5" />
                                  </button>

                                  <button
                                    onClick={() => handleViewLeadDetail(lead)}
                                    className="p-1.5 text-slate-600 hover:text-white hover:bg-amber-500 rounded-md transition-all duration-200 transform hover:scale-105 shadow-sm hover:shadow-md"
                                    title="Chỉnh sửa"
                                  >
                                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                      <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" fill="currentColor" />
                                    </svg>
                                  </button>

                                  <button
                                    onClick={() => {/* TODO: Add comment function */ }}
                                    className="p-1.5 text-slate-600 hover:text-white hover:bg-purple-600 rounded-md transition-all duration-200 transform hover:scale-105 shadow-sm hover:shadow-md"
                                    title="Ghi chú"
                                  >
                                    <MessageSquare className="w-3.5 h-3.5" />
                                  </button>

                                  {/* Hiển thị buttons khác nhau tùy theo status */}
                                  {(lead.status as string) === 'payment_pending' ? (
                                    <>
                                      {/* Chỉ giữ lại nút xem chi tiết, đã có ở trên */}
                                    </>
                                  ) : lead.status !== 'converted' && lead.status !== 'lost' ? (
                                    <button
                                      onClick={() => handleConvertLead(lead)}
                                      className="p-1.5 text-slate-600 hover:text-white hover:bg-green-600 rounded-md transition-all duration-200 transform hover:scale-105 shadow-sm hover:shadow-md"
                                      title="Chuyển đổi thành khách hàng"
                                    >
                                      <User className="w-3.5 h-3.5" />
                                    </button>
                                  ) : null}

                                  <button
                                    onClick={() => {/* TODO: Add delete function */ }}
                                    className="p-1.5 text-slate-600 hover:text-white hover:bg-red-600 rounded-md transition-all duration-200 transform hover:scale-105 shadow-sm hover:shadow-md"
                                    title="Xóa"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>

                              {/* Date */}
                              <div className="flex justify-start pt-2">
                                <span className="text-xs text-gray-500">
                                  {new Date(lead.createdAt).toLocaleDateString('vi-VN')}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    )
  }



  return (
    <div className="space-y-4">
      {/* Notification */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg ${notification?.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-5 h-5" />
            <span>{notification?.message}</span>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Hoạt động Bán hàng</h1>
          <p className="text-gray-600">Quản lý toàn bộ quy trình từ Lead đến Đơn hàng</p>
        </div>
      </div>

      {/* Pipeline Content */}
      <div>
        <div>
          {renderPipeline()}
        </div>
      </div>

      {/* Add Lead Modal */}
      {showAddLeadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-semibold text-gray-900">Thêm Lead mới</h3>
                  <div
                    className="relative"
                    onMouseEnter={() => setShowTooltip('add-lead-title')}
                    onMouseLeave={() => setShowTooltip(null)}
                  >
                    <HelpCircle className="w-5 h-5 text-gray-400 hover:text-gray-600 cursor-help" />
                    {showTooltip === 'add-lead-title' && (
                      <div className="absolute left-0 top-7 z-50 bg-black text-white text-sm rounded-lg py-3 px-4 shadow-lg">
                        <div className="max-w-sm">
                          <p className="font-medium mb-2">📝 Tạo lead mới</p>
                          <p className="mb-2">Nhập thông tin khách hàng tiềm năng mới:</p>
                          <ul className="text-xs space-y-1 text-gray-300">
                            <li>• Thông tin bắt buộc: Tên, Email, Số ĐT</li>
                            <li>• Lead sẽ tự động có trạng thái "Mới"</li>
                            <li>• Tự động phân công cho người tạo</li>
                          </ul>
                        </div>
                        <div className="absolute top-[-6px] left-4 w-3 h-3 bg-black transform rotate-45"></div>
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => setShowFieldSettingsModal(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-100 border border-gray-200 rounded-lg hover:bg-gray-200 hover:text-gray-700 transition-all"
                  >
                    {/* <Sliders className="w-3.5 h-3.5" /> */}
                    Thiết lập trường thông tin
                  </button>
                </div>
                <button
                  onClick={() => setShowAddLeadModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Customer Type Selection */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
                  <span className="text-red-500">*</span>
                  Loại khách hàng
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <label className="relative flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition-colors">
                    <input
                      type="radio"
                      name="customerType"
                      value="individual"
                      checked={newLead.customerType === 'individual'}
                      onChange={(e) => setNewLead(prev => ({
                        ...prev,
                        customerType: e.target.value as 'individual' | 'business',
                        company: '', // Clear company info when switching to individual
                        industry: '',
                        companySize: '',
                        website: ''
                      }))}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 focus:ring-2"
                    />
                    <div className="ml-3">
                      <div className="text-sm font-medium text-gray-900">👤 Cá nhân</div>
                      <div className="text-xs text-gray-500">Khách hàng cá nhân</div>
                    </div>
                  </label>

                  <label className="relative flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition-colors">
                    <input
                      type="radio"
                      name="customerType"
                      value="business"
                      checked={newLead.customerType === 'business'}
                      onChange={(e) => setNewLead(prev => ({ ...prev, customerType: e.target.value as 'individual' | 'business' }))}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 focus:ring-2"
                    />
                    <div className="ml-3">
                      <div className="text-sm font-medium text-gray-900">🏢 Công ty</div>
                      <div className="text-xs text-gray-500">Khách hàng doanh nghiệp</div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Required Information */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-purple-500" />
                  Thông tin cơ bản
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {leadFormFieldVisibility.name && (
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Tên khách hàng
                      </label>
                      <input
                        type="text"
                        value={newLead.name}
                        onChange={(e) => setNewLead(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Nhập tên khách hàng..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Số điện thoại <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      value={newLead.phone}
                      onChange={(e) => setNewLead(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="0901234567"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      value={newLead.email}
                      onChange={(e) => setNewLead(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="email@domain.com"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {leadFormFieldVisibility.estimatedRevenue && (
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Doanh thu ước tính
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={newLead.estimatedRevenue}
                          onChange={handleEstimatedRevenueChange}
                          placeholder="1.000.000"
                          className="w-full px-3 py-2 pr-12 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">VNĐ</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Company Information - Only show for business customers */}
              {newLead.customerType === 'business' && (
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-blue-500" />
                    Thông tin công ty
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {leadFormFieldVisibility.company && (
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Công ty</label>
                        <input
                          type="text"
                          value={newLead.company}
                          onChange={(e) => setNewLead(prev => ({ ...prev, company: e.target.value }))}
                          placeholder="Tên công ty..."
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    )}

                    {leadFormFieldVisibility.jobTitle && (
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Chức vụ</label>
                        <input
                          type="text"
                          value={newLead.jobTitle}
                          onChange={(e) => setNewLead(prev => ({ ...prev, jobTitle: e.target.value }))}
                          placeholder="CEO, Manager, Developer..."
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    )}

                    {leadFormFieldVisibility.industry && (
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Ngành nghề</label>
                        <CreatableSelect
                          options={allIndustryOptions}
                          value={newLead.industry}
                          onChange={(value) => setNewLead(prev => ({ ...prev, industry: value }))}
                          onAddNew={handleAddNewIndustry}
                          placeholder="Lựa chọn hoặc thêm mới"
                        />
                      </div>
                    )}

                    {leadFormFieldVisibility.companySize && (
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Quy mô công ty</label>
                        <input
                          type="text"
                          value={newLead.companySize}
                          onChange={(e) => setNewLead(prev => ({ ...prev, companySize: e.target.value }))}
                          placeholder="Quy mô bao nhiêu người..."
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    )}

                    {leadFormFieldVisibility.website && (
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Website</label>
                        <input
                          type="url"
                          value={newLead.website}
                          onChange={(e) => setNewLead(prev => ({ ...prev, website: e.target.value }))}
                          placeholder="https://domain.com"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    )}

                    {leadFormFieldVisibility.address && (
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Địa chỉ</label>
                        <input
                          type="text"
                          value={newLead.address}
                          onChange={(e) => setNewLead(prev => ({ ...prev, address: e.target.value }))}
                          placeholder="Địa chỉ công ty..."
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Lead Source & Assignment */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
                  <Target className="w-4 h-4 text-green-500" />
                  Nguồn lead & Phân công
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {leadFormFieldVisibility.source && (
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Nguồn</label>
                      <CreatableSelect
                        options={allSourceOptions}
                        value={newLead.source}
                        onChange={(value) => setNewLead(prev => ({ ...prev, source: value }))}
                        onAddNew={handleAddNewSource}
                        placeholder="Lựa chọn hoặc thêm mới"
                      />
                    </div>
                  )}

                  {leadFormFieldVisibility.region && (
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Tỉnh thành</label>
                      <select
                        value={newLead.region}
                        onChange={(e) => setNewLead(prev => ({ ...prev, region: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="hanoi">Hà Nội</option>
                        <option value="hcm">TP. Hồ Chí Minh</option>
                        <option value="danang">Đà Nẵng</option>
                        <option value="haiphong">Hải Phòng</option>
                        <option value="cantho">Cần Thơ</option>
                        <option value="other">Khác</option>
                      </select>
                    </div>
                  )}

                  {leadFormFieldVisibility.assignedTo && (
                    <div className="md:col-span-2">
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Phân công cho
                        <div
                          className="inline-block ml-1 relative"
                          onMouseEnter={() => setShowTooltip('assign-to')}
                          onMouseLeave={() => setShowTooltip(null)}
                        >
                          <HelpCircle className="w-3 h-3 text-gray-400 hover:text-gray-600 cursor-help" />
                          {showTooltip === 'assign-to' && (
                            <div className="absolute left-0 top-5 z-50 bg-black text-white text-xs rounded-lg py-2 px-3 shadow-lg">
                              <div className="max-w-xs">
                                <p className="text-gray-300">Mặc định phân công cho người tạo. Có thể chọn người khác hoặc để trống để phân công tự động sau.</p>
                              </div>
                              <div className="absolute top-[-4px] left-3 w-2 h-2 bg-black transform rotate-45"></div>
                            </div>
                          )}
                        </div>
                      </label>
                      <select
                        value={newLead.assignedTo}
                        onChange={(e) => setNewLead(prev => ({ ...prev, assignedTo: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Mặc định (Minh Expert - người tạo)</option>
                        {getAvailableSalesPersons().map(person => (
                          <option key={person.id} value={person.name}>
                            {person.name} ({person.currentLeads} leads hiện tại)
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
              </div>

              {/* Product & Sales Information */}
              {leadFormFieldVisibility.product && (
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-yellow-500" />
                    Thông tin sản phẩm & Bán hàng
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Sản phẩm quan tâm</label>
                      <select
                        value={newLead.product}
                        onChange={(e) => setNewLead(prev => ({ ...prev, product: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Chọn sản phẩm...</option>
                        <option value="CRM Solution">CRM Solution - Quản lý khách hàng</option>
                        <option value="ERP System">ERP System - Quản lý tài nguyên doanh nghiệp</option>
                        <option value="Website Development">Website Development - Phát triển website</option>
                        <option value="E-commerce Platform">E-commerce Platform - Nền tảng thương mại điện tử</option>
                        <option value="Mobile Application">Mobile Application - Ứng dụng di động</option>
                        <option value="Marketing Automation">Marketing Automation - Tự động hóa marketing</option>
                        <option value="Data Analytics">Data Analytics - Phân tích dữ liệu</option>
                        <option value="Cloud Services">Cloud Services - Dịch vụ đám mây</option>
                        <option value="AI/ML Solutions">AI/ML Solutions - Giải pháp trí tuệ nhân tạo</option>
                        <option value="Cybersecurity">Cybersecurity - An ninh mạng</option>
                        <option value="Digital Transformation">Digital Transformation - Chuyển đổi số</option>
                        <option value="Custom Software">Custom Software - Phần mềm tùy chỉnh</option>
                        <option value="Consulting Services">Consulting Services - Dịch vụ tư vấn</option>
                        <option value="Training & Support">Training & Support - Đào tạo và hỗ trợ</option>
                        <option value="Other">Khác</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Description */}
              {(leadFormFieldVisibility.content || leadFormFieldVisibility.notes) && (
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-orange-500" />
                    Mô tả chi tiết
                  </h4>
                  <div className="space-y-4">
                    {leadFormFieldVisibility.content && (
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Nội dung quan tâm</label>
                        <textarea
                          value={newLead.content}
                          onChange={(e) => setNewLead(prev => ({ ...prev, content: e.target.value }))}
                          placeholder="Mô tả nhu cầu, yêu cầu của khách hàng..."
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    )}

                    {leadFormFieldVisibility.notes && (
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Ghi chú</label>
                        <textarea
                          value={newLead.notes}
                          onChange={(e) => setNewLead(prev => ({ ...prev, notes: e.target.value }))}
                          placeholder="Ghi chú thêm về lead này..."
                          rows={2}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Preview Card */}
              {/* <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
                <h4 className="text-sm font-medium text-blue-900 mb-2 flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  Xem trước Lead
                </h4>
                <div className="text-sm text-blue-800 space-y-1">
                  <div><strong>Tên:</strong> {newLead.name || 'Chưa nhập'} {newLead.jobTitle && `- ${newLead.jobTitle}`}</div>
                  <div><strong>Email:</strong> {newLead.email || 'Chưa nhập'}</div>
                  <div><strong>SĐT:</strong> {newLead.phone || 'Chưa nhập'}</div>
                  {newLead.company && <div><strong>Công ty:</strong> {newLead.company} {newLead.companySize && `(${newLead.companySize})`}</div>}
                  {newLead.industry && <div><strong>Ngành:</strong> {
                    newLead.industry === 'technology' ? 'Công nghệ thông tin' :
                    newLead.industry === 'finance' ? 'Tài chính - Ngân hàng' :
                    newLead.industry === 'healthcare' ? 'Y tế - Sức khỏe' :
                    newLead.industry === 'education' ? 'Giáo dục' :
                    newLead.industry === 'retail' ? 'Bán lẻ' :
                    newLead.industry === 'manufacturing' ? 'Sản xuất' :
                    newLead.industry === 'real-estate' ? 'Bất động sản' :
                    newLead.industry === 'consulting' ? 'Tư vấn' :
                    newLead.industry === 'marketing' ? 'Marketing' :
                    newLead.industry === 'logistics' ? 'Vận chuyển - Logistics' : 'Khác'
                  }</div>}
                  <div><strong>Nguồn:</strong> {
                    newLead.source === 'website' ? 'Website' :
                    newLead.source === 'facebook' ? 'Facebook' :
                    newLead.source === 'google' ? 'Google Ads' :
                    newLead.source === 'referral' ? 'Giới thiệu' :
                    newLead.source === 'cold-call' ? 'Cold Call' :
                    newLead.source === 'exhibition' ? 'Triển lãm' :
                    newLead.source === 'linkedin' ? 'LinkedIn' :
                    newLead.source === 'email-marketing' ? 'Email Marketing' :
                    newLead.source === 'webinar' ? 'Webinar' :
                    newLead.source === 'partner' ? 'Đối tác' : 'Khác'
                  }</div>
                  <div><strong>Phân công cho:</strong> {newLead.assignedTo || 'Minh Expert (người tạo)'}</div>
                </div>
              </div> */}
            </div>

            <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={() => setShowAddLeadModal(false)}
                className="px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100 border border-slate-300 rounded-lg hover:bg-slate-200 hover:text-slate-700 transition-all duration-200 shadow-sm hover:shadow-md"
              >
                Hủy
              </button>
              <button
                onClick={handleAddLead}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 transition-all duration-200 flex items-center gap-2 shadow-md hover:shadow-lg transform hover:scale-[1.02]"
              >
                <Plus className="w-4 h-4" />
                Thêm Lead
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Auto Assign Modal */}
      {showAutoAssignModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 sm:p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto flex flex-col">
            <div className="px-4 sm:px-6 py-4 border-b border-gray-200 flex-shrink-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900">Phân leads tự động</h3>
                  <div
                    className="relative"
                    onMouseEnter={() => setShowAutoAssignTooltip('main-title')}
                    onMouseLeave={() => setShowAutoAssignTooltip(null)}
                  >
                    <HelpCircle className="w-5 h-5 text-gray-400 hover:text-gray-600 cursor-help" />
                    {showAutoAssignTooltip === 'main-title' && (
                      <div className="absolute left-0 top-7 z-50 bg-black text-white text-sm rounded-lg py-3 px-4 shadow-lg">
                        <div className="max-w-sm">
                          <p className="font-medium mb-2">🤖 Hệ thống phân leads tự động</p>
                          <p className="mb-2">Tự động phân công leads cho đội ngũ sales dựa trên:</p>
                          <ul className="text-xs space-y-1 text-gray-300">
                            <li>• Chiến lược phân công phù hợp</li>
                            <li>• Kỹ năng và chuyên môn của từng người</li>
                            <li>• Khối lượng công việc hiện tại</li>
                            <li>• Hiệu suất làm việc</li>
                          </ul>
                          <p className="text-xs text-gray-300 mt-2">Giúp tối ưu hóa tỷ lệ chuyển đổi và cân bằng workload.</p>
                        </div>
                        <div className="absolute top-[-6px] left-4 w-3 h-3 bg-black transform rotate-45"></div>
                      </div>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => setShowAutoAssignModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-4 sm:p-6 space-y-6 flex-1 overflow-y-auto">
              {/* Auto-assign Toggle */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900">Trạng thái hệ thống</h4>
                    <p className="text-xs text-gray-600 mt-1">Bật/tắt chế độ phân leads tự động</p>
                  </div>
                  <button
                    onClick={() => setIsAutoAssignEnabled(!isAutoAssignEnabled)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${isAutoAssignEnabled ? 'bg-green-600' : 'bg-gray-300'
                      }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isAutoAssignEnabled ? 'translate-x-6' : 'translate-x-1'
                        }`}
                    />
                  </button>
                </div>
                <div className={`text-sm ${isAutoAssignEnabled ? 'text-green-700' : 'text-gray-600'}`}>
                  {isAutoAssignEnabled ? (
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      <span>🟢 Đang hoạt động - Leads mới sẽ được phân tự động</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-4 h-4" />
                      <span>⭕ Đã tạm dừng - Leads mới sẽ chờ phân thủ công</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Strategy Selection - Only show when enabled */}
              {isAutoAssignEnabled && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <h4 className="text-sm font-medium text-gray-900">Chiến lược phân công</h4>
                    <div
                      className="relative"
                      onMouseEnter={() => setShowAutoAssignTooltip('strategy-section')}
                      onMouseLeave={() => setShowAutoAssignTooltip(null)}
                    >
                      <HelpCircle className="w-4 h-4 text-gray-400 hover:text-gray-600 cursor-help" />
                      {showAutoAssignTooltip === 'strategy-section' && (
                        <div className="absolute left-0 top-6 z-50 bg-black text-white text-xs rounded-lg py-2 px-3 shadow-lg">
                          <div className="max-w-xs">
                            <p className="font-medium mb-1">📋 Chọn phương pháp phân công phù hợp</p>
                            <p className="text-gray-300">Mỗi chiến lược có ưu điểm riêng, hãy chọn dựa trên tình hình thực tế của đội nhóm.</p>
                          </div>
                          <div className="absolute top-[-4px] left-3 w-2 h-2 bg-black transform rotate-45"></div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                    <div className="flex items-start gap-2">
                      <svg className="w-4 h-4 text-blue-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                      <div className="text-xs text-blue-700">
                        <p className="font-medium">💡 Gợi ý chọn strategy:</p>
                        <ul className="mt-1 space-y-1">
                          <li>• <strong>Team mới:</strong> Round-Robin (phân đều)</li>
                          <li>• <strong>Có chuyên gia:</strong> Territory/Source-based</li>
                          <li>• <strong>Cân bằng workload:</strong> Workload-based</li>
                          <li>• <strong>Leads chất lượng cao:</strong> Score-based</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {/* Round-Robin Strategy */}
                    <label className="flex items-start space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                      <input
                        type="radio"
                        name="strategy"
                        value="round_robin"
                        className="mt-1"
                        checked={autoAssignStrategy === 'round_robin'}
                        onChange={(e) => setAutoAssignStrategy(e.target.value)}
                      />
                      <div className="flex-1">
                        <div className="font-medium text-sm text-gray-900">🔄 Round-Robin (Phân đều theo vòng tròn)</div>
                        <p className="text-xs text-gray-600 mt-1">Phân leads lần lượt cho từng sales theo thứ tự, đảm bảo công bằng</p>
                        <div className="text-xs text-gray-500 mt-1">
                          <strong>Ưu điểm:</strong> Công bằng, đơn giản | <strong>Nhược điểm:</strong> Không xét kỹ năng
                        </div>
                      </div>
                    </label>

                    {/* Workload-based Strategy */}
                    <label className="flex items-start space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                      <input
                        type="radio"
                        name="strategy"
                        value="workload_based"
                        className="mt-1"
                        checked={autoAssignStrategy === 'workload_based'}
                        onChange={(e) => setAutoAssignStrategy(e.target.value)}
                      />
                      <div className="flex-1">
                        <div className="font-medium text-sm text-gray-900">⚖️ Workload-based (Theo khối lượng công việc)</div>
                        <p className="text-xs text-gray-600 mt-1">Ưu tiên gán cho sales đang xử lý ít leads nhất</p>
                        <div className="text-xs text-gray-500 mt-1">
                          <strong>Ưu điểm:</strong> Cân bằng workload | <strong>Nhược điểm:</strong> Phức tạp hơn
                        </div>
                      </div>
                    </label>

                    {/* Territory-based Strategy */}
                    <label className="flex items-start space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                      <input
                        type="radio"
                        name="strategy"
                        value="territory_based"
                        className="mt-1"
                        checked={autoAssignStrategy === 'territory_based'}
                        onChange={(e) => setAutoAssignStrategy(e.target.value)}
                      />
                      <div className="flex-1">
                        <div className="font-medium text-sm text-gray-900">🗺️ Territory-based (Theo tỉnh thành địa lý)</div>
                        <p className="text-xs text-gray-600 mt-1">Phân theo tỉnh/thành phố mà sales phụ trách</p>
                        <div className="text-xs text-gray-500 mt-1">
                          <strong>Ưu điểm:</strong> Chuyên môn tỉnh thành | <strong>Nhược điểm:</strong> Cần setup territory
                        </div>
                      </div>
                    </label>

                    {/* Source-based Strategy */}
                    <label className="flex items-start space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                      <input
                        type="radio"
                        name="strategy"
                        value="source_based"
                        className="mt-1"
                        checked={autoAssignStrategy === 'source_based'}
                        onChange={(e) => setAutoAssignStrategy(e.target.value)}
                      />
                      <div className="flex-1">
                        <div className="font-medium text-sm text-gray-900">🌐 Source-based (Theo nguồn lead)</div>
                        <p className="text-xs text-gray-600 mt-1">Phân theo kênh/nguồn mà lead đến (Facebook, Google, Website...)</p>
                        <div className="text-xs text-gray-500 mt-1">
                          <strong>Ưu điểm:</strong> Chuyên môn kênh | <strong>Nhược điểm:</strong> Cần sales chuyên biệt
                        </div>
                      </div>
                    </label>

                    {/* Shift-based Strategy */}
                    <label className="flex items-start space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                      <input
                        type="radio"
                        name="strategy"
                        value="shift_based"
                        className="mt-1"
                        checked={autoAssignStrategy === 'shift_based'}
                        onChange={(e) => setAutoAssignStrategy(e.target.value)}
                      />
                      <div className="flex-1">
                        <div className="font-medium text-sm text-gray-900">⏰ Shift-based (Theo ca làm việc)</div>
                        <p className="text-xs text-gray-600 mt-1">Chỉ phân cho sales đang trong ca, queue ngoài giờ</p>
                        <div className="text-xs text-gray-500 mt-1">
                          <strong>Ưu điểm:</strong> Response nhanh | <strong>Nhược điểm:</strong> Queue ngoài giờ
                        </div>
                      </div>
                    </label>

                  </div>
                </div>
              )}

              {/* Current Status */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-4 h-4 text-yellow-600" />
                  <h4 className="text-sm font-medium text-yellow-800">Trạng thái hiện tại</h4>
                </div>
                <div className="text-xs text-yellow-700 space-y-1">
                  <div>• Hệ thống: <strong>{isAutoAssignEnabled ? 'ĐANG HOẠT ĐỘNG' : 'TẠM DỪNG'}</strong></div>
                  <div>• Chiến lược: <strong>{getStrategyName(autoAssignStrategy)}</strong></div>
                  <div>• Leads đang chờ phân: <strong>{leads.filter(l => !l.assignedTo).length} leads</strong></div>
                  <div>• Sales có sẵn: <strong>{getAvailableSalesPersons().filter(s => s.currentLeads < 20).length}/{getAvailableSalesPersons().length} người</strong></div>
                </div>
              </div>

              {/* Filters */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <h4 className="text-sm font-medium text-gray-900">Bộ lọc leads</h4>
                  <div
                    className="relative"
                    onMouseEnter={() => setShowAutoAssignTooltip('filters-section')}
                    onMouseLeave={() => setShowAutoAssignTooltip(null)}
                  >
                    <HelpCircle className="w-4 h-4 text-gray-400 hover:text-gray-600 cursor-help" />
                    {showAutoAssignTooltip === 'filters-section' && (
                      <div className="absolute left-0 top-6 z-50 bg-black text-white text-xs rounded-lg py-2 px-3 shadow-lg">
                        <div className="max-w-xs">
                          <p className="font-medium mb-1">🔍 Lọc leads trước khi phân công</p>
                          <p className="text-gray-300">Chỉ phân công những leads phù hợp với điều kiện đã chọn. Bỏ trống để áp dụng cho tất cả leads.</p>
                        </div>
                        <div className="absolute top-[-4px] left-3 w-2 h-2 bg-black transform rotate-45"></div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                  <div className="flex items-start gap-2">
                    <svg className="w-4 h-4 text-yellow-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <div className="text-xs text-yellow-700">
                      <p className="font-medium">⚠️ Lưu ý khi sử dụng bộ lọc:</p>
                      <p>Chỉ những leads thỏa mãn TẤT CẢ điều kiện được chọn mới được phân công. Bỏ trống các trường không cần lọc.</p>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Trạng thái</label>
                    <select name="status" className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option value="">Tất cả trạng thái</option>
                      <option value="new">Mới</option>
                      <option value="contacted">Đã liên hệ</option>
                      <option value="qualified">Đã đánh giá</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Nguồn</label>
                    <select name="source" className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option value="">Tất cả nguồn</option>
                      <option value="website">Website</option>
                      <option value="facebook">Facebook</option>
                      <option value="google">Google Ads</option>
                      <option value="referral">Giới thiệu</option>
                      <option value="cold-call">Cold Call</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Tỉnh thành</label>
                    <select name="region" className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option value="">Tất cả tỉnh thành</option>
                      <option value="hanoi">Hà Nội</option>
                      <option value="hcm">TP.HCM</option>
                      <option value="danang">Đà Nẵng</option>
                      <option value="other">Khác</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Assignment Rules */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <h4 className="text-sm font-medium text-gray-900">Quy tắc phân công</h4>
                  <div
                    className="relative"
                    onMouseEnter={() => setShowAutoAssignTooltip('rules-section')}
                    onMouseLeave={() => setShowAutoAssignTooltip(null)}
                  >
                    <HelpCircle className="w-4 h-4 text-gray-400 hover:text-gray-600 cursor-help" />
                    {showAutoAssignTooltip === 'rules-section' && (
                      <div className="absolute left-0 top-6 z-50 bg-black text-white text-xs rounded-lg py-2 px-3 shadow-lg">
                        <div className="max-w-xs">
                          <p className="font-medium mb-1">⚙️ Tùy chỉnh cách thức phân công</p>
                          <p className="text-gray-300">Các quy tắc bổ sung để điều chỉnh hành vi của hệ thống phân công tự động.</p>
                        </div>
                        <div className="absolute top-[-4px] left-3 w-2 h-2 bg-black transform rotate-45"></div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-3">
                    <div className="flex items-start gap-2">
                      <svg className="w-4 h-4 text-green-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <div className="text-xs text-green-700">
                        <p className="font-medium">✅ Quy tắc được khuyến nghị:</p>
                        <p>Nên bật "Chỉ phân leads chưa được phân công" và "Gửi thông báo" để đảm bảo hoạt động hiệu quả.</p>
                      </div>
                    </div>
                  </div>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded" defaultChecked />
                    <span className="text-sm text-gray-700">Chỉ phân leads chưa được phân công</span>
                    <div
                      className="relative"
                      onMouseEnter={() => setShowAutoAssignTooltip('rule-unassigned')}
                      onMouseLeave={() => setShowAutoAssignTooltip(null)}
                    >
                      <HelpCircle className="w-3 h-3 text-gray-400 hover:text-gray-600 cursor-help" />
                      {showAutoAssignTooltip === 'rule-unassigned' && (
                        <div className="absolute left-0 top-5 z-50 bg-black text-white text-xs rounded-lg py-2 px-3 shadow-lg">
                          <div className="max-w-xs">
                            <p className="font-medium mb-1">🔒 Bảo vệ leads đã có người phụ trách</p>
                            <p className="text-gray-300">Chỉ phân công những leads chưa có ai đảm nhận, tránh làm gián đoạn công việc đang diễn ra.</p>
                          </div>
                          <div className="absolute top-[-4px] left-3 w-2 h-2 bg-black transform rotate-45"></div>
                        </div>
                      )}
                    </div>
                  </label>

                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded" />
                    <span className="text-sm text-gray-700">Ghi đè phân công hiện tại</span>
                    <div
                      className="relative"
                      onMouseEnter={() => setShowAutoAssignTooltip('rule-override')}
                      onMouseLeave={() => setShowAutoAssignTooltip(null)}
                    >
                      <HelpCircle className="w-3 h-3 text-gray-400 hover:text-gray-600 cursor-help" />
                      {showAutoAssignTooltip === 'rule-override' && (
                        <div className="absolute left-0 top-5 z-50 bg-black text-white text-xs rounded-lg py-2 px-3 shadow-lg">
                          <div className="max-w-xs">
                            <p className="font-medium mb-1">⚠️ Thay đổi người phụ trách</p>
                            <p className="text-gray-300">Phân công lại tất cả leads, bao gồm cả những leads đã có người đảm nhận. <strong>Cẩn thận khi sử dụng!</strong></p>
                          </div>
                          <div className="absolute top-[-4px] left-3 w-2 h-2 bg-black transform rotate-45"></div>
                        </div>
                      )}
                    </div>
                  </label>

                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded" defaultChecked />
                    <span className="text-sm text-gray-700">Gửi thông báo cho nhân viên được phân công</span>
                    <div
                      className="relative"
                      onMouseEnter={() => setShowAutoAssignTooltip('rule-notification')}
                      onMouseLeave={() => setShowAutoAssignTooltip(null)}
                    >
                      <HelpCircle className="w-3 h-3 text-gray-400 hover:text-gray-600 cursor-help" />
                      {showAutoAssignTooltip === 'rule-notification' && (
                        <div className="absolute left-0 top-5 z-50 bg-black text-white text-xs rounded-lg py-2 px-3 shadow-lg">
                          <div className="max-w-xs">
                            <p className="font-medium mb-1">📧 Thông báo tự động</p>
                            <p className="text-gray-300">Gửi email/SMS thông báo cho nhân viên về leads mới được phân công, kèm thông tin chi tiết.</p>
                          </div>
                          <div className="absolute top-[-4px] left-3 w-2 h-2 bg-black transform rotate-45"></div>
                        </div>
                      )}
                    </div>
                  </label>

                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded" />
                    <span className="text-sm text-gray-700">Tự động tạo tác vụ follow-up</span>
                    <div
                      className="relative"
                      onMouseEnter={() => setShowAutoAssignTooltip('rule-followup')}
                      onMouseLeave={() => setShowAutoAssignTooltip(null)}
                    >
                      <HelpCircle className="w-3 h-3 text-gray-400 hover:text-gray-600 cursor-help" />
                      {showAutoAssignTooltip === 'rule-followup' && (
                        <div className="absolute left-0 top-5 z-50 bg-black text-white text-xs rounded-lg py-2 px-3 shadow-lg">
                          <div className="max-w-xs">
                            <p className="font-medium mb-1">📅 Tạo lời nhắc tự động</p>
                            <p className="text-gray-300">Tự động tạo task nhắc nhở liên hệ lead trong 24-48h, đảm bảo không bỏ sót cơ hội.</p>
                          </div>
                          <div className="absolute top-[-4px] left-3 w-2 h-2 bg-black transform rotate-45"></div>
                        </div>
                      )}
                    </div>
                  </label>
                </div>
              </div>

              {/* Daily Limits Configuration */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <h4 className="text-sm font-medium text-gray-900">Giới hạn leads mỗi ngày</h4>
                  <div
                    className="relative"
                    onMouseEnter={() => setShowAutoAssignTooltip('daily-limits-section')}
                    onMouseLeave={() => setShowAutoAssignTooltip(null)}
                  >
                    <HelpCircle className="w-4 h-4 text-gray-400 hover:text-gray-600 cursor-help" />
                    {showAutoAssignTooltip === 'daily-limits-section' && (
                      <div className="absolute left-0 top-6 z-50 bg-black text-white text-xs rounded-lg py-2 px-3 shadow-lg">
                        <div className="max-w-xs">
                          <p className="font-medium mb-1">📊 Cân bằng khối lượng công việc</p>
                          <p className="text-gray-300">Đặt giới hạn số leads tối đa mỗi người có thể nhận trong 1 ngày để đảm bảo chất lượng xử lý.</p>
                        </div>
                        <div className="absolute top-[-4px] left-3 w-2 h-2 bg-black transform rotate-45"></div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                  <div className="flex items-start gap-2">
                    <svg className="w-4 h-4 text-blue-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    <div className="text-xs text-blue-700">
                      <p className="font-medium">💡 Lợi ích của việc đặt giới hạn:</p>
                      <ul className="mt-1 space-y-1">
                        <li>• Đảm bảo chất lượng chăm sóc lead</li>
                        <li>• Tránh quá tải cho nhân viên</li>
                        <li>• Phân bổ đều workload trong team</li>
                        <li>• Tăng tỷ lệ chuyển đổi</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {salesTeam.map(member => (
                    <div key={member.id} className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                          {member.avatar}
                        </div>
                        <div>
                          <div className="font-medium text-sm text-gray-900">{member.name}</div>
                          <div className="text-xs text-gray-500">{member.title}</div>
                          <div className="text-xs text-gray-400">Leads hiện tại: {member.activeLeads}</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-gray-500">Tối đa/ngày:</span>
                        <input
                          type="number"
                          min="1"
                          max="20"
                          value={memberDailyLimits[member.id] || 3}
                          onChange={(e) => setMemberDailyLimits(prev => ({
                            ...prev,
                            [member.id]: parseInt(e.target.value) || 1
                          }))}
                          className="w-16 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <span className="text-xs text-gray-500">leads</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-3 text-xs text-gray-600 bg-gray-50 p-2 rounded">
                  <p><strong>Tổng capacity mỗi ngày:</strong> {Object.values(memberDailyLimits).reduce((sum, limit) => sum + limit, 0)} leads</p>
                  <p className="mt-1">Hệ thống sẽ dừng phân công khi đạt giới hạn để đảm bảo chất lượng.</p>
                </div>
              </div>

              {/* Preview */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="text-sm font-medium text-gray-900">Xem trước kết quả</h4>
                  <div
                    className="relative"
                    onMouseEnter={() => setShowAutoAssignTooltip('preview-section')}
                    onMouseLeave={() => setShowAutoAssignTooltip(null)}
                  >
                    <HelpCircle className="w-4 h-4 text-gray-400 hover:text-gray-600 cursor-help" />
                    {showAutoAssignTooltip === 'preview-section' && (
                      <div className="absolute left-0 top-6 z-50 bg-black text-white text-xs rounded-lg py-2 px-3 shadow-lg">
                        <div className="max-w-xs">
                          <p className="font-medium mb-1">👁️ Kiểm tra trước khi thực hiện</p>
                          <p className="text-gray-300">Xem thông tin tổng quan về số lượng leads sẽ được phân công và phân bổ dự kiến.</p>
                        </div>
                        <div className="absolute top-[-4px] left-3 w-2 h-2 bg-black transform rotate-45"></div>
                      </div>
                    )}
                  </div>
                </div>
                <div className="text-sm text-gray-600 space-y-1">
                  <div>• Tổng số leads: <span className="font-medium text-gray-900">{getPreviewData().totalLeads} leads</span></div>
                  <div>• Leads chưa phân công: <span className="font-medium text-gray-900">{getPreviewData().unassignedLeads} leads</span></div>
                  <div>• Nhân viên sales hoạt động: <span className="font-medium text-gray-900">{getPreviewData().activeSalesPeople} người</span></div>
                  <div>• Trung bình mỗi người: <span className="font-medium text-gray-900">{getPreviewData().avgLeadsPerPerson} leads</span></div>
                  <div>• Capacity hôm nay: <span className="font-medium text-gray-900">{getPreviewData().usedCapacityToday}/{getPreviewData().totalDailyCapacity} leads</span></div>
                  <div>• Còn lại hôm nay: <span className={`font-medium ${getPreviewData().remainingCapacityToday > 0 ? 'text-green-600' : 'text-red-600'}`}>{getPreviewData().remainingCapacityToday} leads</span></div>
                </div>

                {getPreviewData().unassignedLeads === 0 && (
                  <div className="mt-3 bg-yellow-100 border border-yellow-300 rounded-lg p-2">
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      <p className="text-xs text-yellow-700 font-medium">Không có leads nào cần phân công!</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={() => setShowAutoAssignModal(false)}
                className="px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100 border border-slate-300 rounded-lg hover:bg-slate-200 hover:text-slate-700 transition-all duration-200 shadow-sm hover:shadow-md"
              >
                Hủy
              </button>
              <button
                onClick={() => {
                  // Get selected strategy from radio buttons
                  const strategyRadio = document.querySelector('input[name="strategy"]:checked') as HTMLInputElement
                  const strategy = strategyRadio?.value || 'balanced'

                  // Get filter values
                  const filters = {
                    status: (document.querySelector('select[name="status"]') as HTMLSelectElement)?.value || '',
                    source: (document.querySelector('select[name="source"]') as HTMLSelectElement)?.value || '',
                    region: (document.querySelector('select[name="region"]') as HTMLSelectElement)?.value || ''
                  }

                  // Perform auto assignment
                  const assignedCount = autoAssignLeads(strategy, filters)

                  // Show success notification
                  setNotification({
                    message: `Đã phân công tự động ${assignedCount} leads thành công!`,
                    type: 'success'
                  })
                  setTimeout(() => setNotification(null), 3000)
                  setShowAutoAssignModal(false)
                }}
                className="px-4 py-2 text-sm font-medium text-white bg-purple-600 border border-transparent rounded-lg hover:bg-purple-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-[1.02]"
              >
                Thực hiện phân công
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Lead Detail Modal */}
      <CustomerDetailModal
        isOpen={showLeadDetailModal}
        onClose={() => {
          setShowLeadDetailModal(false)
          setActiveDetailTab('contact')
        }}
        customer={selectedLead ? convertLeadToCustomer(selectedLead) : null}
      />

      {/* Edit Lead Modal */}
      {showEditModal && editingLead && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full mx-4 max-h-[90vh] overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-gray-200 flex-shrink-0">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Chỉnh sửa Lead - {editingLead.name}</h3>
                <button
                  onClick={() => {
                    setShowEditModal(false)
                    setEditingLead(null)
                  }}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-6">
                {/* Thông tin cơ bản (read-only) */}
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">Thông tin cơ bản (không thể thay đổi)</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Tên khách hàng:</span>
                      <span className="ml-2 font-medium text-gray-900">{editingLead.name}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Số điện thoại:</span>
                      <span className="ml-2 font-medium text-gray-900">{editingLead.phone}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Email:</span>
                      <span className="ml-2 font-medium text-gray-900">{editingLead.email}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Công ty:</span>
                      <span className="ml-2 font-medium text-gray-900">{editingLead.company || 'Cá nhân'}</span>
                    </div>
                  </div>
                </div>

                {/* Nguồn lead */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nguồn lead</label>
                  <select
                    value={editingLead.source}
                    onChange={(e) => setEditingLead({ ...editingLead, source: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="facebook">Facebook</option>
                    <option value="google">Google Ads</option>
                    <option value="website">Website</option>
                    <option value="referral">Giới thiệu</option>
                    <option value="cold_call">Cold Call</option>
                    <option value="other">Khác</option>
                  </select>
                </div>

                {/* Giai đoạn */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Giai đoạn</label>
                  <select
                    value={editingLead.status}
                    onChange={(e) => setEditingLead({ ...editingLead, status: e.target.value as Lead['status'] })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="new">Mới</option>
                    <option value="contacted">Đã liên hệ</option>
                    <option value="qualified">Đủ điều kiện</option>
                    <option value="negotiation">Đàm phán</option>
                    <option value="proposal">Đã gửi đề xuất</option>
                    <option value="payment_pending">Chờ thanh toán</option>
                    <option value="converted">Đã chuyển đổi</option>
                    <option value="lost">Thất bại</option>
                  </select>
                </div>

                {/* Sales phụ trách */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sales phụ trách</label>
                  <select
                    value={editingLead.assignedTo || ''}
                    onChange={(e) => setEditingLead({ ...editingLead, assignedTo: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Chưa phân công</option>
                    {salesTeam.map(member => (
                      <option key={member.id} value={member.name}>{member.name}</option>
                    ))}
                  </select>
                </div>

                {/* Sản phẩm quan tâm */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sản phẩm quan tâm</label>
                  <select
                    value={editingLead.product}
                    onChange={(e) => setEditingLead({ ...editingLead, product: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="CRM Premium">CRM Premium</option>
                    <option value="CRM Enterprise">CRM Enterprise</option>
                    <option value="Marketing Automation">Marketing Automation</option>
                    <option value="Sales Analytics">Sales Analytics</option>
                    <option value="Custom Solution">Custom Solution</option>
                  </select>
                </div>

                {/* Tỉnh/Thành phố */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tỉnh/Thành phố</label>
                  <select
                    value={editingLead.region}
                    onChange={(e) => setEditingLead({ ...editingLead, region: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="ha_noi">Hà Nội</option>
                    <option value="ho_chi_minh">Hồ Chí Minh</option>
                    <option value="da_nang">Đà Nẵng</option>
                    <option value="hai_phong">Hải Phòng</option>
                    <option value="can_tho">Cần Thơ</option>
                    <option value="other">Khác</option>
                  </select>
                </div>

                {/* Địa chỉ */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Địa chỉ chi tiết</label>
                  <input
                    type="text"
                    value={editingLead.address || ''}
                    onChange={(e) => setEditingLead({ ...editingLead, address: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Nhập địa chỉ chi tiết"
                  />
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tags/Nhãn</label>
                  <div className="space-y-2">
                    <div className="flex flex-wrap gap-2">
                      {['hot', 'warm', 'cold', 'enterprise', 'urgent', 'follow_up'].map(tag => (
                        <button
                          key={tag}
                          onClick={() => {
                            const currentTags = editingLead.tags || []
                            const newTags = currentTags.includes(tag)
                              ? currentTags.filter(t => t !== tag)
                              : [...currentTags, tag]
                            setEditingLead({ ...editingLead, tags: newTags })
                          }}
                          className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${(editingLead.tags || []).includes(tag)
                            ? tag === 'hot' ? 'bg-red-600 text-white' :
                              tag === 'warm' ? 'bg-orange-600 text-white' :
                                tag === 'cold' ? 'bg-blue-600 text-white' :
                                  tag === 'enterprise' ? 'bg-purple-600 text-white' :
                                    tag === 'urgent' ? 'bg-pink-600 text-white' :
                                      'bg-green-600 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                        >
                          {tag === 'hot' ? '🔥 Hot' :
                            tag === 'warm' ? '☀️ Warm' :
                              tag === 'cold' ? '❄️ Cold' :
                                tag === 'enterprise' ? '🏢 Enterprise' :
                                  tag === 'urgent' ? '⚡ Urgent' :
                                    '👀 Follow Up'}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Ghi chú */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Ghi chú bổ sung</label>
                  <textarea
                    value={editingLead.notes || ''}
                    onChange={(e) => setEditingLead({ ...editingLead, notes: e.target.value })}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    placeholder="Nhập ghi chú bổ sung về lead này..."
                  />
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3 flex-shrink-0">
              <button
                onClick={() => {
                  setShowEditModal(false)
                  setEditingLead(null)
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 transition-all duration-200"
              >
                Hủy
              </button>
              <button
                onClick={() => {
                  if (editingLead) {
                    setLeads(prev => prev.map(l => l.id === editingLead.id ? { ...editingLead, updatedAt: new Date().toISOString() } : l))
                    setShowEditModal(false)
                    setEditingLead(null)
                    // Show success notification
                    const notification = document.createElement('div')
                    notification.className = 'fixed top-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in'
                    notification.innerHTML = '<div class="flex items-center gap-2"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg><span>Cập nhật lead thành công!</span></div>'
                    document.body.appendChild(notification)
                    setTimeout(() => notification.remove(), 3000)
                  }
                }}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 transition-all duration-200 flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                Lưu thay đổi
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Import Excel Modal */}
      {showImportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full mx-4">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Import Leads từ Excel</h3>
                <button
                  onClick={() => {
                    setShowImportModal(false)
                    setImportFile(null)
                    setImportError(null)
                    setImportSuccess(null)
                    setImportProgress(0)
                    setImportAutoAssign(false)
                    setImportPreviewData([])
                    setShowImportPreview(false)
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="px-6 py-4 space-y-4">
              {/* Download Template */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Download className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="font-medium text-blue-900 mb-1">Tải template Excel</h4>
                    <p className="text-sm text-blue-700 mb-3">
                      Tải file mẫu để đảm bảo định dạng đúng cho việc import leads
                    </p>
                    <button
                      onClick={downloadTemplate}
                      className="text-sm bg-blue-600 text-white px-3 py-1.5 rounded hover:bg-blue-700 transition-colors"
                    >
                      Tải template
                    </button>
                  </div>
                </div>
              </div>

              {/* File Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Chọn file Excel (.xlsx, .xls, .csv)
                </label>
                <input
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  onChange={handleFileSelect}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                {importFile && (
                  <div className="mt-2 space-y-2">
                    <p className="text-sm text-gray-600">
                      Đã chọn: {importFile.name}
                    </p>
                    {importPreviewData.length > 0 && (
                      <button
                        onClick={() => setShowImportPreview(!showImportPreview)}
                        className="text-sm bg-indigo-600 text-white px-3 py-1.5 rounded hover:bg-indigo-700 transition-colors flex items-center gap-2"
                      >
                        <Eye className="w-4 h-4" />
                        {showImportPreview ? 'Ẩn dữ liệu' : 'Xem dữ liệu'}
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Data Preview */}
              {showImportPreview && importPreviewData.length > 0 && (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <h5 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                    <Eye className="w-4 h-4" />
                    Preview dữ liệu ({importPreviewData.length} dòng đầu)
                  </h5>
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-xs">
                      <thead>
                        <tr className="bg-gray-100">
                          {Object.keys(importPreviewData[0] || {}).map(header => (
                            <th key={header} className="px-2 py-1 text-left font-medium text-gray-700 border">
                              {header}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {importPreviewData.map((row, index) => (
                          <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                            {Object.values(row).map((value: any, cellIndex) => (
                              <td key={cellIndex} className="px-2 py-1 border text-gray-600">
                                {value || '-'}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="mt-3 text-xs text-gray-600">
                    💡 <strong>Lưu ý:</strong> Đảm bảo các cột trong file Excel khớp với template để import thành công.
                  </div>
                </div>
              )}

              {/* Auto Assignment Option */}
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="importAutoAssign"
                    checked={importAutoAssign}
                    onChange={(e) => setImportAutoAssign(e.target.checked)}
                    className="mt-1 w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500 focus:ring-2"
                  />
                  <div className="flex-1">
                    <label htmlFor="importAutoAssign" className="font-medium text-purple-900 cursor-pointer">
                      Phân công tự động sau khi import
                    </label>
                    <p className="text-sm text-purple-700 mt-1">
                      Leads sẽ được phân công tự động cho sales team theo chiến lược đã chọn ({autoAssignStrategy === 'round_robin' ? 'Luân phiên' :
                        autoAssignStrategy === 'workload_based' ? 'Theo khối lượng công việc' :
                          autoAssignStrategy === 'territory_based' ? 'Theo vùng địa lý' :
                            autoAssignStrategy === 'source_based' ? 'Theo nguồn lead' :
                              autoAssignStrategy === 'shift_based' ? 'Theo ca làm việc' : 'Luân phiên'})
                    </p>
                    <p className="text-sm text-orange-600 mt-2 bg-orange-50 px-2 py-1 rounded">
                      💡 <strong>Lưu ý:</strong> Nếu không chọn, tất cả leads sẽ được phân công mặc định cho người thực hiện import
                    </p>
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              {importProgress > 0 && (
                <div>
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Đang import...</span>
                    <span>{importProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${importProgress}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {/* Error Message */}
              {importError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <div className="flex items-center gap-2 text-red-700">
                    <AlertCircle className="w-4 h-4" />
                    <span className="text-sm">{importError}</span>
                  </div>
                </div>
              )}

              {/* Success Message */}
              {importSuccess && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <div className="flex items-center gap-2 text-green-700">
                    <CheckCircle className="w-4 h-4" />
                    <span className="text-sm">{importSuccess}</span>
                  </div>
                </div>
              )}

              {/* Instructions */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">Hướng dẫn import:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• File phải có các cột: Tên, Số điện thoại, Email, Công ty</li>
                  <li>• Định dạng file hỗ trợ: .xlsx, .xls, .csv</li>
                  <li>• Dòng đầu tiên là tiêu đề cột</li>
                  <li>• Email phải có định dạng hợp lệ</li>
                  <li>• Số điện thoại phải từ 8-15 ký tự</li>
                </ul>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowImportModal(false)
                  setImportFile(null)
                  setImportError(null)
                  setImportSuccess(null)
                  setImportProgress(0)
                  setImportAutoAssign(false)
                  setImportPreviewData([])
                  setShowImportPreview(false)
                }}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={handleImportExcel}
                disabled={!importFile || importProgress > 0}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {importProgress > 0 ? 'Đang import...' : 'Import'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Lead Modal */}
      {showEditLeadModal && editingLead && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Chỉnh sửa Lead</h3>
            </div>

            <div className="p-6">
              <form onSubmit={(e) => {
                e.preventDefault()
                handleUpdateLead(editingLead)
              }}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Tên */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tên <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={editingLead.name}
                      onChange={(e) => setEditingLead({ ...editingLead, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      value={editingLead.email}
                      onChange={(e) => setEditingLead({ ...editingLead, email: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>

                  {/* Số điện thoại */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Số điện thoại <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      value={editingLead.phone}
                      onChange={(e) => setEditingLead({ ...editingLead, phone: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>

                  {/* Công ty */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Công ty
                    </label>
                    <input
                      type="text"
                      value={editingLead.company || ''}
                      onChange={(e) => setEditingLead({ ...editingLead, company: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  {/* Nguồn */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nguồn
                    </label>
                    <select
                      value={editingLead.source}
                      onChange={(e) => setEditingLead({ ...editingLead, source: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="website">Website</option>
                      <option value="facebook">Facebook</option>
                      <option value="google">Google</option>
                      <option value="zalo">Zalo</option>
                      <option value="linkedin">LinkedIn</option>
                      <option value="referral">Giới thiệu</option>
                    </select>
                  </div>

                  {/* Tỉnh thành */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tỉnh thành
                    </label>
                    <select
                      value={editingLead.region}
                      onChange={(e) => setEditingLead({ ...editingLead, region: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="ha_noi">Hà Nội</option>
                      <option value="ho_chi_minh">TP. Hồ Chí Minh</option>
                      <option value="da_nang">Đà Nẵng</option>
                      <option value="hai_phong">Hải Phòng</option>
                      <option value="can_tho">Cần Thơ</option>
                    </select>
                  </div>

                  {/* Sản phẩm */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Sản phẩm quan tâm
                    </label>
                    <input
                      type="text"
                      value={editingLead.product}
                      onChange={(e) => setEditingLead({ ...editingLead, product: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  {/* Giá trị dự kiến */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Giá trị dự kiến (VND)
                    </label>
                    <input
                      type="number"
                      value={editingLead.value}
                      onChange={(e) => setEditingLead({ ...editingLead, value: parseInt(e.target.value) || 0 })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  {/* Người phụ trách */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Người phụ trách
                    </label>
                    <select
                      value={editingLead.assignedTo}
                      onChange={(e) => setEditingLead({ ...editingLead, assignedTo: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Chưa phân công</option>
                      {getAvailableSalesPersons().map(person => (
                        <option key={person.id} value={person.name}>
                          {person.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Nội dung */}
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nội dung
                  </label>
                  <textarea
                    value={editingLead.content}
                    onChange={(e) => setEditingLead({ ...editingLead, content: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Ghi chú */}
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ghi chú
                  </label>
                  <textarea
                    value={editingLead.notes}
                    onChange={(e) => setEditingLead({ ...editingLead, notes: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowEditLeadModal(false)
                      setEditingLead(null)
                    }}
                    className="px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100 border border-slate-300 rounded-lg hover:bg-slate-200 hover:text-slate-700 transition-all duration-200 shadow-sm hover:shadow-md"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-[1.02] flex items-center gap-2"
                  >
                    <Edit className="w-4 h-4" />
                    Cập nhật Lead
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Convert Lead Confirmation Modal */}
      {showConvertModal && selectedLead && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Chuyển vào chuyển đổi - chờ thanh toán</h3>
            </div>

            <div className="p-6 max-h-[70vh] overflow-y-auto">
              {/* Customer Info */}
              <div className="flex items-center gap-3 mb-4">
                <span className="relative flex shrink-0 overflow-hidden rounded-full h-12 w-12 bg-blue-100">
                  <span className="flex h-full w-full items-center justify-center rounded-full bg-blue-100 text-blue-700 font-semibold">
                    <User className="h-6 w-6" />
                  </span>
                </span>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-slate-900">{selectedLead.name}</h3>
                  </div>
                  <p className="text-sm text-slate-600">
                    {selectedLead.phone && <span className="mr-3">📱 {selectedLead.phone}</span>}
                    {selectedLead.email && <span>📧 {selectedLead.email}</span>}
                  </p>
                </div>
              </div>

              {/* Order Notes */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Ghi chú đơn hàng</label>
                <textarea
                  value={orderNotes}
                  onChange={(e) => setOrderNotes(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={2}
                  placeholder="Nhập ghi chú cho đơn hàng (không bắt buộc)..."
                />
              </div>

              {/* Category Filter */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Chọn thể loại sản phẩm</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full sm:w-64 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="Tất cả">Tất cả</option>
                  <option value="Khóa học">Khóa học</option>
                  <option value="Phần mềm">Phần mềm</option>
                  <option value="Dịch vụ tư vấn">Dịch vụ tư vấn</option>
                </select>
              </div>

              {/* Product Selection - with Packages */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Chọn sản phẩm & gói sản phẩm <span className="text-red-500">*</span>
                </label>
                <div className="max-h-80 overflow-y-auto space-y-3 border border-gray-300 rounded-lg p-3">
                  {availableProducts.filter(product => selectedCategory === 'Tất cả' || product.category === selectedCategory).map((product) => (
                    <div key={product.id} className="border border-gray-200 rounded-lg p-3 bg-white hover:border-blue-300 transition-colors">
                      {/* Product Selection */}
                      <label className="flex items-start space-x-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedProducts.includes(product.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedProducts(prev => [...prev, product.id])
                              // Set default package to standard
                              setSelectedPackages(prev => ({
                                ...prev,
                                [product.id]: availablePackages[product.id as keyof typeof availablePackages]?.[0]?.id || ''
                              }))
                              // Set default quantity to 1
                              setProductQuantities(prev => ({
                                ...prev,
                                [product.id]: 1
                              }))
                            } else {
                              setSelectedProducts(prev => prev.filter(id => id !== product.id))
                              // Remove package selection
                              setSelectedPackages(prev => {
                                const newPackages = { ...prev }
                                delete newPackages[product.id]
                                return newPackages
                              })
                              // Remove quantity
                              setProductQuantities(prev => {
                                const newQuantities = { ...prev }
                                delete newQuantities[product.id]
                                return newQuantities
                              })
                            }
                          }}
                          className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium text-gray-900 text-sm">{product.name}</h4>
                            <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded">{product.category}</span>
                          </div>
                          <p className="text-xs text-gray-500 mt-1 line-clamp-2">{product.description}</p>
                          <p className="text-sm font-semibold text-green-600 mt-1">{formatCurrency(product.price.toString())} VNĐ</p>
                        </div>
                      </label>

                      {/* Package & Quantity Selection */}
                      {selectedProducts.includes(product.id) && (
                        <div className="ml-7 mt-2 p-2 bg-gray-50 rounded">
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="block text-xs font-medium text-gray-700 mb-1">Chọn gói:</label>
                              <select
                                value={selectedPackages[product.id] || ''}
                                onChange={(e) => setSelectedPackages(prev => ({
                                  ...prev,
                                  [product.id]: e.target.value
                                }))}
                                className="w-full text-sm border border-gray-300 rounded px-2 py-1"
                              >
                                {availablePackages[product.id as keyof typeof availablePackages]?.map((pkg) => (
                                  <option key={pkg.id} value={pkg.id}>
                                    {pkg.name} {pkg.price > 0 ? `(+${formatCurrency(pkg.price.toString())} VNĐ)` : ''} - {pkg.description}
                                  </option>
                                ))}
                              </select>
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-700 mb-1">Số lượng:</label>
                              <input
                                type="number"
                                min="1"
                                value={productQuantities[product.id] || 1}
                                onChange={(e) => setProductQuantities(prev => ({
                                  ...prev,
                                  [product.id]: Math.max(1, parseInt(e.target.value) || 1)
                                }))}
                                className="w-full text-sm border border-gray-300 rounded px-2 py-1"
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                  {availableProducts.filter(product => selectedCategory === 'Tất cả' || product.category === selectedCategory).length === 0 && (
                    <p className="text-sm text-gray-500 text-center py-4">Không có sản phẩm nào trong thể loại này</p>
                  )}
                </div>

                {/* Selected Products Summary */}
                {selectedProducts.length > 0 && (
                  <div className="mt-3 p-3 bg-green-50 rounded-lg">
                    <p className="text-sm font-medium text-green-800 mb-2">Đã chọn {selectedProducts.length} sản phẩm:</p>
                    <div className="space-y-1">
                      {selectedProducts.map(productId => {
                        const product = availableProducts.find(p => p.id === productId)
                        const selectedPackageId = selectedPackages[productId]
                        const selectedPackage = availablePackages[productId as keyof typeof availablePackages]?.find(pkg => pkg.id === selectedPackageId)
                        const quantity = productQuantities[productId] || 1
                        const unitPrice = (product?.price || 0) + (selectedPackage?.price || 0)
                        const totalPrice = unitPrice * quantity

                        return product ? (
                          <div key={productId} className="flex justify-between text-sm">
                            <span>
                              {product.name} ({selectedPackage?.name || 'Standard'}) x{quantity}
                            </span>
                            <span className="font-medium text-green-600">
                              {formatCurrency(totalPrice.toString())} VNĐ
                            </span>
                          </div>
                        ) : null
                      })}
                      <div className="border-t border-green-200 pt-1 mt-2">
                        <div className="flex justify-between font-medium text-green-800">
                          <span>Tổng cộng:</span>
                          <span>
                            {formatCurrency(
                              selectedProducts.reduce((sum, productId) => {
                                const product = availableProducts.find(p => p.id === productId)
                                const selectedPackageId = selectedPackages[productId]
                                const selectedPackage = availablePackages[productId as keyof typeof availablePackages]?.find(pkg => pkg.id === selectedPackageId)
                                const quantity = productQuantities[productId] || 1
                                return sum + ((product?.price || 0) + (selectedPackage?.price || 0)) * quantity
                              }, 0).toString()
                            )} VNĐ
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {selectedProducts.length === 0 && (
                  <p className="mt-1 text-xs text-red-500">Vui lòng chọn ít nhất một sản phẩm trước khi chuyển đổi</p>
                )}
              </div>

              {/* Payment Information */}
              <div className="mb-4 p-4 border border-blue-200 rounded-lg bg-blue-50">
                <h5 className="text-sm font-medium text-blue-900 mb-3">💰 Thông tin thanh toán</h5>

                {/* Discount */}
                <div className="mb-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Giảm giá (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={discountPercent}
                    onChange={(e) => setDiscountPercent(Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="0"
                  />
                </div>

                {/* Payment Method */}
                <div className="mb-3">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hình thức thanh toán
                  </label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="flex-1 max-w-xs px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="cash">Tiền mặt</option>
                    <option value="bank_transfer">Chuyển khoản</option>
                    <option value="installment">Trả góp</option>
                    <option value="momo">Momo</option>
                    <option value="card">Thẻ</option>
                    <option value="custom">Tùy chỉnh</option>
                  </select>
                </div>

                {/* Total calculation */}
                {selectedProducts.length > 0 && (
                  <div className="bg-white rounded-md p-3 border border-blue-200">
                    <div className="flex justify-between text-sm">
                      <span>Tổng tiền hàng:</span>
                      <span>{formatCurrency(
                        selectedProducts.reduce((sum, productId) => {
                          const product = availableProducts.find(p => p.id === productId)
                          const selectedPackageId = selectedPackages[productId]
                          const selectedPackage = availablePackages[productId as keyof typeof availablePackages]?.find(pkg => pkg.id === selectedPackageId)
                          const quantity = productQuantities[productId] || 1
                          return sum + ((product?.price || 0) + (selectedPackage?.price || 0)) * quantity
                        }, 0).toString()
                      )} VNĐ</span>
                    </div>
                    {discountPercent > 0 && (
                      <div className="flex justify-between text-sm text-red-600">
                        <span>Giảm giá ({discountPercent}%):</span>
                        <span>-{formatCurrency(
                          (selectedProducts.reduce((sum, productId) => {
                            const product = availableProducts.find(p => p.id === productId)
                            const selectedPackageId = selectedPackages[productId]
                            const selectedPackage = availablePackages[productId as keyof typeof availablePackages]?.find(pkg => pkg.id === selectedPackageId)
                            const quantity = productQuantities[productId] || 1
                            return sum + ((product?.price || 0) + (selectedPackage?.price || 0)) * quantity
                          }, 0) * discountPercent / 100).toString()
                        )} VNĐ</span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm font-medium border-t border-gray-200 pt-2 mt-2">
                      <span>Thành tiền:</span>
                      <span className="text-green-600">{formatCurrency(
                        (selectedProducts.reduce((sum, productId) => {
                          const product = availableProducts.find(p => p.id === productId)
                          const selectedPackageId = selectedPackages[productId]
                          const selectedPackage = availablePackages[productId as keyof typeof availablePackages]?.find(pkg => pkg.id === selectedPackageId)
                          const quantity = productQuantities[productId] || 1
                          return sum + ((product?.price || 0) + (selectedPackage?.price || 0)) * quantity
                        }, 0) * (100 - discountPercent) / 100).toString()
                      )} VNĐ</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="bg-green-50 rounded-lg p-4 mb-4">
                <h5 className="text-sm font-medium text-green-900 mb-2">Điều gì sẽ xảy ra:</h5>
                <ul className="text-sm text-green-800 space-y-1">
                  <li>• Lead được chuyển thành trạng thái "Chuyển đổi - chờ thanh toán"</li>
                  <li>• Deal mới sẽ được tạo trong hệ thống</li>
                  <li>• Bắt đầu quy trình theo dõi thanh toán</li>
                  {selectedProducts.length > 0 && (
                    <>
                      <li>• Hình thức thanh toán: <span className="font-medium">
                        {paymentMethod === 'cash' ? 'Tiền mặt' :
                          paymentMethod === 'bank_transfer' ? 'Chuyển khoản' :
                            paymentMethod === 'installment' ? 'Trả góp' :
                              paymentMethod === 'momo' ? 'Momo' :
                                paymentMethod === 'card' ? 'Thẻ' : 'Tùy chỉnh'}
                      </span></li>
                      {discountPercent > 0 && (
                        <li>• Giảm giá: <span className="font-medium text-red-600">{discountPercent}%</span></li>
                      )}
                      <li>• Tổng giá trị đơn hàng: <span className="font-medium">
                        {formatCurrency(
                          (selectedProducts.reduce((sum, productId) => {
                            const product = availableProducts.find(p => p.id === productId)
                            const selectedPackageId = selectedPackages[productId]
                            const selectedPackage = availablePackages[productId as keyof typeof availablePackages]?.find(pkg => pkg.id === selectedPackageId)
                            const quantity = productQuantities[productId] || 1
                            return sum + ((product?.price || 0) + (selectedPackage?.price || 0)) * quantity
                          }, 0) * (100 - discountPercent) / 100).toString()
                        )} VNĐ
                      </span></li>
                    </>
                  )}
                </ul>
              </div>

              <p className="text-sm text-gray-600">
                Khách hàng đã đồng ý mua sản phẩm. Lead sẽ chuyển vào "Chuyển đổi - chờ thanh toán" để theo dõi việc thanh toán.
              </p>
            </div>

            <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowConvertModal(false)
                  setSelectedProduct('') // Reset single product when closing modal
                  setSelectedProducts([]) // Reset multiple products when closing modal
                  setSelectedPackages({}) // Reset packages when closing modal
                  setProductQuantities({}) // Reset quantities
                  setOrderNotes('') // Reset order notes
                  setDiscountPercent(0) // Reset discount
                  setPaymentMethod('cash') // Reset payment method
                  setSelectedCategory('Tất cả') // Reset category
                }}
                className="px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100 border border-slate-300 rounded-lg hover:bg-slate-200 hover:text-slate-700 transition-all duration-200 shadow-sm hover:shadow-md"
              >
                Hủy
              </button>
              <button
                onClick={confirmConvertLead}
                disabled={selectedProducts.length === 0}
                className={`px-4 py-2 text-sm font-medium border border-transparent rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-[1.02] flex items-center gap-2 ${selectedProducts.length > 0
                  ? 'text-white bg-green-600 hover:bg-green-700'
                  : 'text-gray-400 bg-gray-300 cursor-not-allowed'
                  }`}
              >
                <CheckCircle className="w-4 h-4" />
                {selectedProducts.length > 0 ? `Chuyển vào chuyển đổi - chờ thanh toán (${selectedProducts.length} sản phẩm)` : 'Chọn sản phẩm để tiếp tục'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Drag Convert Modal */}
      {showDragConvertModal && pendingDragLead && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 sm:p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-2 max-h-[90vh] sm:max-h-[80vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                Chuyển sang "{getStatusName(dragTargetStatus)}"
              </h3>
              {originalTargetStatus === 'converted' && dragTargetStatus === 'payment_pending' && (
                <p className="text-sm text-amber-600 mt-1">
                  ℹ️ Bạn đã kéo vào "Chuyển đổi thành công", nhưng lead sẽ được chuyển về "Chờ thanh toán" để xác nhận thanh toán trước.
                </p>
              )}
            </div>

            <div className="p-6 max-h-[60vh] overflow-y-auto">
              {/* Customer Info */}
              <div className="flex items-center gap-3 mb-4">
                <span className="relative flex shrink-0 overflow-hidden rounded-full h-12 w-12 bg-blue-100">
                  <span className="flex h-full w-full items-center justify-center rounded-full bg-blue-100 text-blue-700 font-semibold">
                    <User className="h-6 w-6" />
                  </span>
                </span>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-slate-900">{pendingDragLead.name}</h3>
                  </div>
                  <p className="text-sm text-slate-600">
                    {pendingDragLead.phone && <span className="mr-3">📱 {pendingDragLead.phone}</span>}
                    {pendingDragLead.email && <span>{pendingDragLead.email}</span>}
                  </p>
                </div>
              </div>

              {/* Order Notes */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Ghi chú đơn hàng</label>
                <textarea
                  value={orderNotes}
                  onChange={(e) => setOrderNotes(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={2}
                  placeholder="Nhập ghi chú cho đơn hàng (không bắt buộc)..."
                />
              </div>

              {/* Category Filter */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Chọn thể loại sản phẩm</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full sm:w-64 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="Tất cả">Tất cả</option>
                  <option value="Khóa học">Khóa học</option>
                  <option value="Phần mềm">Phần mềm</option>
                  <option value="Dịch vụ tư vấn">Dịch vụ tư vấn</option>
                </select>
              </div>

              {/* Product Selection - with Packages */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {dragTargetStatus === 'converted' ?
                    'Chọn sản phẩm đã bán' :
                    'Chọn sản phẩm chuyển đổi'
                  } <span className="text-red-500">*</span>
                </label>
                <div className="max-h-64 overflow-y-auto space-y-3 border border-gray-300 rounded-lg p-3">
                  {availableProducts.filter(product => selectedCategory === 'Tất cả' || product.category === selectedCategory).map((product) => (
                    <div key={product.id} className="border border-gray-200 rounded-lg p-3 bg-white hover:border-blue-300 transition-colors">
                      {/* Product Selection */}
                      <label className="flex items-start space-x-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedProducts.includes(product.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedProducts(prev => [...prev, product.id])
                              // Set default package to standard
                              setSelectedPackages(prev => ({
                                ...prev,
                                [product.id]: availablePackages[product.id as keyof typeof availablePackages]?.[0]?.id || ''
                              }))
                              // Set default quantity to 1
                              setProductQuantities(prev => ({
                                ...prev,
                                [product.id]: 1
                              }))
                            } else {
                              setSelectedProducts(prev => prev.filter(id => id !== product.id))
                              // Remove package selection
                              setSelectedPackages(prev => {
                                const newPackages = { ...prev }
                                delete newPackages[product.id]
                                return newPackages
                              })
                              // Remove quantity
                              setProductQuantities(prev => {
                                const newQuantities = { ...prev }
                                delete newQuantities[product.id]
                                return newQuantities
                              })
                            }
                          }}
                          className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium text-gray-900 text-sm">{product.name}</h4>
                            <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded">{product.category}</span>
                          </div>
                          <p className="text-xs text-gray-500 mt-1 line-clamp-2">{product.description}</p>
                          <p className="text-sm font-semibold text-green-600 mt-1">{formatCurrency(product.price.toString())} VNĐ</p>
                        </div>
                      </label>

                      {/* Package & Quantity Selection */}
                      {selectedProducts.includes(product.id) && (
                        <div className="ml-7 mt-2 p-2 bg-gray-50 rounded">
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="block text-xs font-medium text-gray-700 mb-1">Chọn gói:</label>
                              <select
                                value={selectedPackages[product.id] || ''}
                                onChange={(e) => setSelectedPackages(prev => ({
                                  ...prev,
                                  [product.id]: e.target.value
                                }))}
                                className="w-full text-sm border border-gray-300 rounded px-2 py-1"
                              >
                                {availablePackages[product.id as keyof typeof availablePackages]?.map((pkg) => (
                                  <option key={pkg.id} value={pkg.id}>
                                    {pkg.name} {pkg.price > 0 ? `(+${formatCurrency(pkg.price.toString())} VNĐ)` : ''}
                                  </option>
                                ))}
                              </select>
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-700 mb-1">Số lượng:</label>
                              <input
                                type="number"
                                min="1"
                                value={productQuantities[product.id] || 1}
                                onChange={(e) => setProductQuantities(prev => ({
                                  ...prev,
                                  [product.id]: Math.max(1, parseInt(e.target.value) || 1)
                                }))}
                                className="w-full text-sm border border-gray-300 rounded px-2 py-1"
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                  {availableProducts.filter(product => selectedCategory === 'Tất cả' || product.category === selectedCategory).length === 0 && (
                    <p className="text-sm text-gray-500 text-center py-4">Không có sản phẩm nào trong thể loại này</p>
                  )}
                </div>

                {/* Selected Products Summary */}
                {selectedProducts.length > 0 && (
                  <div className="mt-2 p-2 bg-blue-50 rounded">
                    <p className="text-xs text-blue-800 font-medium mb-1">Đã chọn {selectedProducts.length} sản phẩm:</p>
                    <div className="space-y-1">
                      {selectedProducts.map(productId => {
                        const product = availableProducts.find(p => p.id === productId)
                        const selectedPackageId = selectedPackages[productId]
                        const selectedPackage = availablePackages[productId as keyof typeof availablePackages]?.find(pkg => pkg.id === selectedPackageId)
                        const quantity = productQuantities[productId] || 1
                        const unitPrice = (product?.price || 0) + (selectedPackage?.price || 0)
                        const totalPrice = unitPrice * quantity

                        return product ? (
                          <div key={productId} className="flex justify-between text-xs">
                            <span>{product.name} ({selectedPackage?.name || 'Standard'}) x{quantity}</span>
                            <span className="font-medium text-blue-600">
                              {formatCurrency(totalPrice.toString())} VNĐ
                            </span>
                          </div>
                        ) : null
                      })}
                    </div>
                  </div>
                )}
                {selectedProducts.length === 0 && (
                  <p className="mt-1 text-xs text-red-500">Vui lòng chọn ít nhất một sản phẩm</p>
                )}
              </div>

              {/* Discount Section */}
              {selectedProducts.length > 0 && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mã giảm giá (%)
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={discountPercent}
                      onChange={(e) => setDiscountPercent(Number(e.target.value))}
                      placeholder="0"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <span className="text-sm text-gray-500">%</span>
                  </div>
                  <p className="mt-1 text-xs text-gray-500">Nhập từ 0-100% để áp dụng giảm giá</p>
                </div>
              )}

              {/* Payment Method */}
              {selectedProducts.length > 0 && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hình thức thanh toán
                  </label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="cash">Tiền mặt</option>
                    <option value="bank_transfer">Chuyển khoản</option>
                    <option value="installment">Trả góp</option>
                    <option value="momo">Momo</option>
                    <option value="card">Thẻ</option>
                    <option value="custom">Tùy chỉnh</option>
                  </select>
                </div>
              )}

              {/* Total Summary with Discount */}
              {selectedProducts.length > 0 && (
                <div className="mb-4">
                  {discountPercent > 0 && (
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="space-y-1 text-xs">
                        <div className="flex justify-between">
                          <span>Tổng tiền gốc:</span>
                          <span className="font-medium">
                            {formatCurrency(selectedProducts.reduce((sum, productId) => {
                              const product = availableProducts.find(p => p.id === productId)
                              const selectedPackageId = selectedPackages[productId]
                              const selectedPackage = availablePackages[productId as keyof typeof availablePackages]?.find(pkg => pkg.id === selectedPackageId)
                              const quantity = productQuantities[productId] || 1
                              return sum + ((product?.price || 0) + (selectedPackage?.price || 0)) * quantity
                            }, 0).toString())} VNĐ
                          </span>
                        </div>
                        <div className="flex justify-between text-red-600">
                          <span>Giảm giá ({discountPercent}%):</span>
                          <span className="font-medium">
                            -{formatCurrency((selectedProducts.reduce((sum, productId) => {
                              const product = availableProducts.find(p => p.id === productId)
                              const selectedPackageId = selectedPackages[productId]
                              const selectedPackage = availablePackages[productId as keyof typeof availablePackages]?.find(pkg => pkg.id === selectedPackageId)
                              const quantity = productQuantities[productId] || 1
                              return sum + ((product?.price || 0) + (selectedPackage?.price || 0)) * quantity
                            }, 0) * discountPercent / 100).toString())} VNĐ
                          </span>
                        </div>
                        <div className="flex justify-between font-medium text-green-700 border-t border-green-300 pt-1">
                          <span>Thành tiền:</span>
                          <span className="text-base">
                            {formatCurrency((selectedProducts.reduce((sum, productId) => {
                              const product = availableProducts.find(p => p.id === productId)
                              const selectedPackageId = selectedPackages[productId]
                              const selectedPackage = availablePackages[productId as keyof typeof availablePackages]?.find(pkg => pkg.id === selectedPackageId)
                              const quantity = productQuantities[productId] || 1
                              return sum + ((product?.price || 0) + (selectedPackage?.price || 0)) * quantity
                            }, 0) * (100 - discountPercent) / 100).toString())} VNĐ
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              <p className="text-sm text-gray-600">
                {dragTargetStatus === 'converted' ?
                  `Xác nhận lead đã thanh toán thành công và hoàn tất giao dịch với các sản phẩm đã chọn.` :
                  dragTargetStatus === 'payment_pending' ?
                    `Lead sẽ được chuyển sang trạng thái "${getStatusName(dragTargetStatus)}" với các sản phẩm đã chọn. Sau khi xác nhận thanh toán thành công, sẽ tự động chuyển sang "Chuyển đổi thành công".` :
                    `Lead sẽ được chuyển sang trạng thái "${getStatusName(dragTargetStatus)}" với các sản phẩm đã chọn.`
                }
              </p>
            </div>

            <div className="px-4 sm:px-6 py-4 border-t border-gray-200 flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3">
              <button
                onClick={() => {
                  setShowDragConvertModal(false)
                  setPendingDragLead(null)
                  setDragTargetStatus('')
                  setOriginalTargetStatus('')
                  setSelectedProducts([])
                  setSelectedPackages({})
                  setProductQuantities({}) // Reset quantities
                  setOrderNotes('') // Reset order notes
                  setDiscountPercent(0) // Reset discount
                  setPaymentMethod('cash') // Reset payment method
                  setSelectedCategory('Tất cả') // Reset category
                }}
                className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100 border border-slate-300 rounded-lg hover:bg-slate-200 hover:text-slate-700 transition-all duration-200 shadow-sm hover:shadow-md"
              >
                Hủy
              </button>
              <button
                onClick={confirmDragConvert}
                disabled={selectedProducts.length === 0}
                className={`w-full sm:w-auto px-4 py-2 text-sm font-medium border border-transparent rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-[1.02] flex items-center justify-center gap-2 ${selectedProducts.length > 0
                  ? dragTargetStatus === 'converted'
                    ? 'text-white bg-green-600 hover:bg-green-700'
                    : 'text-white bg-blue-600 hover:bg-blue-700'
                  : 'text-gray-400 bg-gray-300 cursor-not-allowed'
                  }`}
              >
                <CheckCircle className="w-4 h-4" />
                <span className="truncate">
                  {selectedProducts.length > 0 ?
                    dragTargetStatus === 'converted'
                      ? `Xác nhận hoàn tất (${selectedProducts.length} SP)`
                      : `Xác nhận chuyển (${selectedProducts.length} SP)`
                    : 'Chọn sản phẩm để tiếp tục'
                  }
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Task Modal */}
      {showCreateTaskModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 sm:p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] sm:max-h-[80vh] overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">
                  Tạo Task cho {selectedLeadIds.length} leads đã chọn
                </h3>
                <button
                  onClick={() => {
                    setShowCreateTaskModal(false)
                    setSelectedTaskType('')
                  }}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <p className="text-sm text-gray-600 mt-2">Chọn loại task để thêm cho các leads đã chọn</p>
            </div>

            {/* Task Types Grid */}
            <div className="px-4 sm:px-6 py-4 overflow-y-auto flex-1 min-h-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {taskTypes.map((task) => (
                  <div
                    key={task.id}
                    onClick={() => {
                      setSelectedTaskType(task.id)
                      setSelectedTaskObj(task)
                      setTaskExtraNote('')
                      setTaskAssignedTo('')
                    }}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md ${selectedTaskType === task.id
                      ? 'border-blue-500 bg-blue-50'
                      : `border-gray-200 hover:border-gray-300 ${task.color}`
                      }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="text-2xl">{task.icon}</div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">{task.name}</h4>
                        <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                      </div>
                      <div className="flex items-center">
                        {selectedTaskType === task.id ? (
                          <CheckCircle className="w-5 h-5 text-blue-500" />
                        ) : (
                          <ArrowRight className="w-5 h-5 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Deadline & confirm area (appears after selecting a task) */}
            {selectedTaskObj && (
              <div className="px-4 sm:px-6 py-4 border-t border-gray-100 bg-white flex-shrink-0">
                <h4 className="font-medium">Xác nhận: {selectedTaskObj.icon} {selectedTaskObj.name}</h4>
                <p className="text-sm text-gray-600 mb-3">{selectedTaskObj.description}</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 items-end">
                  <div>
                    <label className="text-xs text-gray-600">Hạn hoàn thành</label>
                    <input
                      type="date"
                      value={taskDeadlineDate}
                      onChange={(e) => setTaskDeadlineDate(e.target.value)}
                      className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-gray-600">Giờ</label>
                    <input
                      type="time"
                      value={taskDeadlineTime}
                      onChange={(e) => setTaskDeadlineTime(e.target.value)}
                      className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>

                  <div className="sm:col-span-1 lg:col-span-1">
                    <label className="text-xs text-gray-600">Người phụ trách</label>
                    <select
                      value={taskAssignedTo}
                      onChange={(e) => setTaskAssignedTo(e.target.value)}
                      className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md"
                    >
                      <option value="">Chọn người phụ trách</option>
                      <option value="Nguyễn Văn A">Nguyễn Văn A</option>
                      <option value="Trần Thị B">Trần Thị B</option>
                      <option value="Lê Văn C">Lê Văn C</option>
                      <option value="Phạm Thị D">Phạm Thị D</option>
                      <option value="Hoàng Văn E">Hoàng Văn E</option>
                      <option value="Đỗ Thị F">Đỗ Thị F</option>
                    </select>
                  </div>

                  <div className="col-span-full">
                    <label className="text-xs text-gray-600">Ghi chú thêm (tuỳ chọn)</label>
                    <input
                      type="text"
                      value={taskExtraNote}
                      onChange={(e) => setTaskExtraNote(e.target.value)}
                      placeholder="Ví dụ: Chuẩn bị tài liệu, gửi trước 1 ngày..."
                      className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                </div>

                <div className="mt-4 flex flex-col sm:flex-row justify-end gap-2">
                  <button
                    onClick={() => {
                      setSelectedTaskObj(null)
                      setSelectedTaskType('')
                      setTaskExtraNote('')
                      setTaskAssignedTo('')
                    }}
                    className="w-full sm:w-auto px-3 py-2 bg-white border border-gray-300 rounded-md text-sm hover:bg-gray-50"
                  >
                    Bỏ chọn
                  </button>
                  <button
                    onClick={() => confirmCreateTask(selectedTaskObj, taskDeadlineDate, taskDeadlineTime, taskExtraNote, taskAssignedTo)}
                    className="w-full sm:w-auto px-3 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700"
                  >
                    Tạo task
                  </button>
                </div>
              </div>
            )}

            <div className="px-4 sm:px-6 py-4 border-t border-gray-200 bg-gray-50 flex-shrink-0">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
                <div className="text-sm text-gray-600 text-center sm:text-left">
                  💡 Mẹo: Task sẽ được thêm vào lịch sử tương tác của từng lead
                </div>
                <button
                  onClick={() => {
                    setShowCreateTaskModal(false)
                    setSelectedTaskType('')
                  }}
                  className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Hủy
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Phân chia Lead Modal — 2-step flow */}
      {showAssignSalesModal && (() => {
        const stats = getAssignStats()
        const effectiveCount = getEffectiveLeadIds().length
        return (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 sm:p-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-[600px] max-h-[90vh] overflow-hidden flex flex-col">
              {/* Header */}
              <div className="px-6 py-4 border-b border-gray-200 flex-shrink-0">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-semibold text-gray-900">Phân chia Lead</h3>
                    {/* Step indicator */}
                    {(assignStep === 'step1' || assignStep === 'step2') && (
                      <div className="flex items-center gap-1.5">
                        <div className={`w-2 h-2 rounded-full ${assignStep === 'step1' ? 'bg-blue-600' : 'bg-blue-200'}`} />
                        <div className={`w-2 h-2 rounded-full ${assignStep === 'step2' ? 'bg-blue-600' : 'bg-blue-200'}`} />
                      </div>
                    )}
                  </div>
                  <button
                    onClick={handleAssignClose}
                    className="text-gray-400 hover:text-gray-600 transition-colors p-1 hover:bg-gray-100 rounded-lg"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                {(assignStep === 'step1' || assignStep === 'step2') && (
                  <p className="text-xs text-gray-500 mt-1">Bước {assignStep === 'step1' ? '1' : '2'} / 2</p>
                )}
              </div>

              {/* Body */}
              <div className="flex-1 overflow-y-auto">

                {/* ═══ STEP 1: Lead stats + skip/re-assign option ═══ */}
                {assignStep === 'step1' && (
                  <div className="px-6 py-5 space-y-5">
                    {/* Lead Stats */}
                    <div className="grid grid-cols-3 gap-3">
                      <div className="bg-gradient-to-br from-blue-600 to-blue-400 text-white shadow-lg cursor-pointer relative transition-all hover:shadow-xl rounded-lg p-4 text-center">
                        <div className="text-2xl font-bold text-white">{stats.total}</div>
                        <div className="text-xs text-white mt-1">Lead được chọn</div>
                      </div>
                      <div className="bg-gradient-to-br from-green-600 to-green-400 text-white shadow-lg relative transition-all hover:shadow-xl rounded-lg p-4 text-center ">
                        <div className="text-2xl font-bold text-white">{stats.assigned}</div>
                        <div className="text-xs text-white mt-1">Đã được gán</div>
                      </div>
                      <div className="bg-gradient-to-br from-red-600 to-red-400 text-white shadow-lg cursor-pointer relative transition-all hover:shadow-xl rounded-lg p-4 text-center">
                        <div className="text-2xl font-bold text-white">{stats.newCount}</div>
                        <div className="text-xs text-white mt-1">Chưa được gán</div>
                      </div>
                    </div>

                    {/* Skip / Re-assign option (only show if there are assigned leads) */}
                    {stats.assigned > 0 && (
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-sm font-semibold text-gray-700">Có {stats.assigned} lead đã được phân công</span>
                        </div>
                        <div className="space-y-2">
                          <label
                            className={`flex items-center gap-3 p-3 border-2 rounded-lg cursor-pointer transition-all ${reassignOption === 'skip' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                              }`}
                          >
                            <input
                              type="radio" name="reassignOption" value="skip"
                              checked={reassignOption === 'skip'}
                              onChange={() => setReassignOption('skip')}
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                            />
                            <div>
                              <div className="text-sm font-medium text-gray-900">Bỏ qua lead đã được phân công</div>
                              <div className="text-xs text-gray-500 mt-0.5">Chỉ phân chia {stats.newCount} lead chưa có Sales phụ trách</div>
                            </div>
                          </label>
                          <label
                            className={`flex items-center gap-3 p-3 border-2 rounded-lg cursor-pointer transition-all ${reassignOption === 'reassign' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                              }`}
                          >
                            <input
                              type="radio" name="reassignOption" value="reassign"
                              checked={reassignOption === 'reassign'}
                              onChange={() => setReassignOption('reassign')}
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                            />
                            <div>
                              <div className="text-sm font-medium text-gray-900">Phân chia lại lead đã phân công</div>
                              <div className="text-xs text-gray-500 mt-0.5">Phân chia lại toàn bộ {stats.total} lead (Sales cũ sẽ mất quyền phụ trách)</div>
                            </div>
                          </label>
                        </div>
                      </div>
                    )}

                    {/* Summary */}
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm text-gray-700">
                      <span className="font-medium">{reassignOption === 'skip' && stats.assigned > 0 ? stats.newCount : stats.total}</span> lead sẽ được phân chia ở bước tiếp theo.
                    </div>
                  </div>
                )}

                {/* ═══ STEP 2: Auto / Manual assignment ═══ */}
                {assignStep === 'step2' && (
                  <div className="px-6 py-5 space-y-5">
                    {/* Effective leads count */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-center gap-2 text-sm">
                      <Info className="w-4 h-4 text-blue-500 flex-shrink-0" />
                      <span>Đang phân chia <span className="font-semibold text-blue-700">{effectiveCount} lead</span>
                        {reassignOption === 'skip' && stats.assigned > 0 && <span className="text-gray-500"> (đã bỏ qua {stats.assigned} lead đã phân công)</span>}
                      </span>
                    </div>

                    {/* Assignment Method Radio Group */}
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <Settings className="w-4 h-4 text-blue-500" />
                        <span className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Phương thức phân chia</span>
                      </div>
                      <div className="space-y-2">
                        <label
                          className={`flex items-start gap-3 p-3 border-2 rounded-lg cursor-pointer transition-all ${assignMethod === 'auto' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                            }`}
                        >
                          <input type="radio" name="assignMethod2" value="auto" checked={assignMethod === 'auto'}
                            onChange={() => setAssignMethod('auto')}
                            className="mt-0.5 h-4 w-4 text-blue-600 focus:ring-blue-500" />
                          <div>
                            <div className="text-sm font-medium text-gray-900">Tự động theo quy tắc đã cấu hình</div>
                            <div className="text-xs text-gray-500 mt-1">Hệ thống sẽ tự động phân chia theo rule: Territory → Source → Round-Robin</div>
                          </div>
                        </label>
                        <label
                          className={`flex items-start gap-3 p-3 border-2 rounded-lg cursor-pointer transition-all ${assignMethod === 'manual' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                            }`}
                        >
                          <input type="radio" name="assignMethod2" value="manual" checked={assignMethod === 'manual'}
                            onChange={() => setAssignMethod('manual')}
                            className="mt-0.5 h-4 w-4 text-blue-600 focus:ring-blue-500" />
                          <div className="text-sm font-medium text-gray-900">Chọn thủ công</div>
                        </label>
                      </div>
                    </div>

                    {/* Manual: assignment type + sales selection + distribution + conditions */}
                    {assignMethod === 'manual' && (
                      <div className="space-y-5">
                        {/* Loại phân bổ */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1.5">
                            Loại phân bổ <span className="text-red-500">*</span>
                          </label>
                          <select
                            value={assignType}
                            onChange={(e) => setAssignType(e.target.value as any)}
                            className="w-full h-10 px-3 py-2 rounded-[10px] border border-[#e6ebf1] bg-white text-sm text-[#455560] hover:border-[#699dff] focus:outline-none focus:border-[#3e79f7] focus:ring-2 focus:ring-[rgba(62,121,247,0.2)] transition-all duration-300"
                          >
                            <option value="department">Theo phòng ban</option>
                            <option value="team">Theo team</option>
                            <option value="individual">Theo cá nhân</option>
                          </select>
                        </div>

                        {/* Department / Team checkboxes */}
                        {(assignType === 'department' || assignType === 'team') && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                              Chọn {assignType === 'department' ? 'phòng ban' : 'team'}
                            </label>
                            <div className="space-y-2 max-h-32 overflow-y-auto border border-[#e6ebf1] rounded-lg p-3">
                              {(assignType === 'department'
                                ? [
                                  { id: 'support', label: 'Phòng support' },
                                  { id: 'qa', label: 'Phòng kiểm tra chất lượng' },
                                  { id: 'dev', label: 'Phòng Dev CRM' },
                                  { id: 'sales', label: 'Phòng sale' },
                                ]
                                : [
                                  { id: 'team_a', label: 'Team A - Sales HN' },
                                  { id: 'team_b', label: 'Team B - Sales HCM' },
                                  { id: 'team_c', label: 'Team C - Marketing' },
                                  { id: 'team_d', label: 'Team D - Support' },
                                ]
                              ).map(item => (
                                <label key={item.id} className="flex items-center space-x-3 cursor-pointer">
                                  <input
                                    type="checkbox"
                                    checked={selectedDepartments.includes(item.id)}
                                    onChange={() => setSelectedDepartments(prev =>
                                      prev.includes(item.id)
                                        ? prev.filter(d => d !== item.id)
                                        : [...prev, item.id]
                                    )}
                                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                  />
                                  <span className="text-sm text-gray-700">{item.label}</span>
                                </label>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Individual Sales multi-select */}
                        {assignType === 'individual' && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Chọn Sales nhận lead <span className="text-red-500">*</span>
                              {selectedSalesIds.length > 0 && (
                                <span className="font-normal text-blue-600 ml-2">({selectedSalesIds.length} đã chọn)</span>
                              )}
                            </label>
                            <div className="relative mb-2">
                              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                              <input
                                type="text" placeholder="Tìm kiếm Sales..."
                                value={salesSearchTerm}
                                onChange={(e) => setSalesSearchTerm(e.target.value)}
                                className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              />
                            </div>
                            <div className="border border-gray-200 rounded-lg max-h-52 overflow-y-auto divide-y divide-gray-100">
                              {filteredSalesTeam
                                .sort((a, b) => a.activeLeads - b.activeLeads)
                                .map((sales) => {
                                  const wp = Math.round((sales.activeLeads / sales.maxLeads) * 100)
                                  const isMaxed = wp >= 100
                                  const wColor = '#FAAD14' //wp >= 100 ? '#BFBFBF' : wp >= 80 ? '#FF7875' : wp >= 50 ? '#FAAD14' : '#52C41A'
                                  const isChecked = selectedSalesIds.includes(sales.id)
                                  return (
                                    <label
                                      key={sales.id}
                                      className={`flex items-center gap-3 px-3 py-2.5 cursor-pointer transition-colors ${isMaxed ? 'opacity-40 cursor-not-allowed bg-gray-50' : isChecked ? 'bg-blue-50' : 'hover:bg-gray-50'
                                        }`}
                                    >
                                      <input
                                        type="checkbox"
                                        checked={isChecked}
                                        disabled={isMaxed}
                                        onChange={() => {
                                          if (isMaxed) return
                                          setSelectedSalesIds(prev =>
                                            prev.includes(sales.id)
                                              ? prev.filter(id => id !== sales.id)
                                              : [...prev, sales.id]
                                          )
                                        }}
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                      />
                                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#3e79f7] text-white text-xs font-medium flex-shrink-0">{sales.name.split(' ').map((w: string) => w[0]).join('').slice(-3).toUpperCase()}</span>
                                      <div className="flex-1 min-w-0">
                                        <div className="text-sm font-medium text-gray-900 truncate">
                                          {sales.name}
                                          <span className="font-normal text-gray-500"> • {sales.department}</span>
                                        </div>
                                        <div className="text-xs text-gray-500">{sales.title}</div>
                                      </div>
                                      <span
                                        className="inline-flex items-center gap-1 text-xs font-medium px-1.5 py-0.5 rounded-full flex-shrink-0"
                                        style={{ backgroundColor: `${wColor}18`, color: wColor }}
                                      >
                                        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: wColor }} />
                                        {sales.activeLeads}
                                        {isMaxed && ' (max)'}
                                      </span>
                                    </label>
                                  )
                                })}
                            </div>
                            {selectedSalesIds.length === 0 && (
                              <p className="mt-1 text-xs text-red-500">Vui lòng chọn ít nhất 1 Sales</p>
                            )}
                          </div>
                        )}

                        {/* Phương thức phân bổ */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-3">Phương thức phân bổ</label>
                          <div className="grid grid-cols-3 gap-3">
                            {[
                              { value: 'round_robin' as const, label: 'Xoay vòng', desc: 'Phân đều cho từng thành viên' },
                              { value: 'by_workload' as const, label: 'Theo tải', desc: 'Dựa trên khối lượng công việc' },
                              { value: 'random' as const, label: 'Ngẫu nhiên', desc: 'Phân bổ hoàn toàn ngẫu nhiên' },
                            ].map(method => (
                              <label
                                key={method.value}
                                className={`p-4 border-2 rounded-lg text-center cursor-pointer transition-all ${distributionMethod === method.value
                                  ? 'border-blue-500 bg-blue-50'
                                  : 'border-gray-200 hover:border-gray-300'
                                  }`}
                              >
                                <input
                                  type="radio" name="distributionMethod" value={method.value}
                                  checked={distributionMethod === method.value}
                                  onChange={() => setDistributionMethod(method.value)}
                                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 mb-2"
                                />
                                <div className="text-sm font-semibold text-gray-900">{method.label}</div>
                                <div className="text-[11px] text-gray-500 mt-1 leading-tight">{method.desc}</div>
                              </label>
                            ))}
                          </div>
                        </div>

                        {/* Điều kiện áp dụng */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-3">Điều kiện áp dụng</label>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-xs font-medium text-gray-600 mb-1">Nguồn leads</label>
                              <select
                                value={assignSourceFilter}
                                onChange={(e) => setAssignSourceFilter(e.target.value)}
                                className="w-full h-10 px-3 py-2 rounded-[10px] border border-[#e6ebf1] bg-white text-sm text-[#455560] hover:border-[#699dff] focus:outline-none focus:border-[#3e79f7] focus:ring-2 focus:ring-[rgba(62,121,247,0.2)] transition-all duration-300"
                              >
                                <option value="">Chọn nguồn</option>
                                <option value="facebook">Facebook</option>
                                <option value="website">Website</option>
                                <option value="google">Google</option>
                                <option value="zalo">Zalo</option>
                                <option value="linkedin">LinkedIn</option>
                                <option value="referral">Giới thiệu</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-600 mb-1">Khu vực</label>
                              <select
                                value={assignRegionFilter}
                                onChange={(e) => setAssignRegionFilter(e.target.value)}
                                className="w-full h-10 px-3 py-2 rounded-[10px] border border-[#e6ebf1] bg-white text-sm text-[#455560] hover:border-[#699dff] focus:outline-none focus:border-[#3e79f7] focus:ring-2 focus:ring-[rgba(62,121,247,0.2)] transition-all duration-300"
                              >
                                <option value="">Chọn khu vực</option>
                                <option value="ha_noi">Hà Nội</option>
                                <option value="ho_chi_minh">Hồ Chí Minh</option>
                                <option value="da_nang">Đà Nẵng</option>
                                <option value="can_tho">Cần Thơ</option>
                                <option value="hai_phong">Hải Phòng</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* ═══ Loading ═══ */}
                {assignStep === 'loading' && (
                  <div className="px-6 py-12 flex flex-col items-center justify-center">
                    <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4" />
                    <p className="text-sm font-medium text-gray-700">Đang phân chia...</p>
                    <p className="text-xs text-gray-500 mt-1">Vui lòng đợi trong giây lát</p>
                  </div>
                )}

                {/* ═══ Success ═══ */}
                {assignStep === 'success' && (
                  <div className="px-6 py-8">
                    <div className="text-center mb-6">
                      <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-3">
                        <CheckSquare className="w-7 h-7 text-green-600" />
                      </div>
                      <h4 className="text-lg font-semibold text-gray-900">Phân chia thành công</h4>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
                      <div>
                        <span className="font-medium">{effectiveCount} lead</span>
                        <span className="text-gray-600"> đã được phân chia {assignMethod === 'manual' ? 'thủ công' : 'tự động'} thành công.</span>
                      </div>
                      {assignMethod === 'manual' && selectedSalesIds.length > 0 && (
                        <div className="text-gray-500">
                          Sales nhận: {selectedSalesIds.map(id => salesTeam.find(s => s.id === id)?.name).filter(Boolean).join(', ')}
                          {selectedSalesIds.length > 1 && (
                            <span> ({distributionMethod === 'round_robin' ? 'Xoay vòng' : distributionMethod === 'by_workload' ? 'Theo tải' : 'Ngẫu nhiên'})</span>
                          )}
                        </div>
                      )}
                      {reassignOption === 'skip' && stats.assigned > 0 && (
                        <div className="text-gray-400 text-xs">Đã bỏ qua {stats.assigned} lead đã phân công trước đó.</div>
                      )}
                    </div>
                  </div>
                )}

                {/* ═══ Error ═══ */}
                {assignStep === 'error' && (
                  <div className="px-6 py-8">
                    <div className="text-center mb-6">
                      <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-3">
                        <AlertTriangle className="w-7 h-7 text-red-600" />
                      </div>
                      <h4 className="text-lg font-semibold text-gray-900">Phân chia thất bại</h4>
                    </div>
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-700">
                      Không thể gán Lead. Vui lòng thử lại sau.
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="px-6 py-4 border-t border-gray-200 flex-shrink-0">
                {assignStep === 'step1' && (
                  <div className="flex items-center justify-between">
                    <button onClick={handleAssignClose}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >Hủy</button>
                    <button
                      onClick={() => {
                        // If skip and no new leads, show message
                        if (reassignOption === 'skip' && stats.newCount === 0) {
                          setNotification({ message: 'Tất cả lead đã được phân công. Không có lead mới để phân chia.', type: 'info' as any })
                          setTimeout(() => setNotification(null), 3000)
                          return
                        }
                        setAssignStep('step2')
                      }}
                      className="px-5 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-sm flex items-center gap-2"
                    >
                      Tiếp tục
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
                {assignStep === 'step2' && (
                  <div className="flex items-center justify-between">
                    <button onClick={() => setAssignStep('step1')}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >Quay lại</button>
                    <button
                      onClick={handleAssignSubmit}
                      disabled={assignMethod === 'manual' && selectedSalesIds.length === 0}
                      className={`px-5 py-2 text-sm font-medium rounded-lg transition-colors shadow-sm flex items-center gap-2 ${assignMethod === 'manual' && selectedSalesIds.length === 0
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'text-white bg-blue-600 hover:bg-blue-700'
                        }`}
                    >
                      <CheckSquare className="w-4 h-4" />
                      {assignMethod === 'auto' ? 'Phân chia tự động' : `Xác nhận phân chia (${effectiveCount} lead)`}
                    </button>
                  </div>
                )}
                {assignStep === 'success' && (
                  <div className="flex justify-end">
                    <button onClick={handleAssignClose}
                      className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                    >Đóng</button>
                  </div>
                )}
                {assignStep === 'error' && (
                  <div className="flex items-center justify-end gap-3">
                    <button onClick={() => setAssignStep('step2')}
                      className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
                    >Thử lại</button>
                    <button onClick={handleAssignClose}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >Đóng</button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )
      })()}

      {/* Bulk Status Change Modal */}
      {showBulkStatusModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 sm:p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] sm:max-h-[80vh] overflow-hidden flex flex-col">
            <div className="px-4 sm:px-6 py-4 border-b border-gray-200 flex-shrink-0">
              <div className="flex justify-between items-center">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                  Chuyển trạng thái cho {selectedLeadIds.length} leads
                </h3>
                <button
                  onClick={() => {
                    setShowBulkStatusModal(false)
                    setSelectedBulkStatus('')
                  }}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <p className="text-sm text-gray-600 mt-2">Chọn trạng thái mới cho các leads đã chọn</p>
            </div>

            <div className="px-4 sm:px-6 py-4 flex-1 overflow-y-auto">
              <div className="space-y-3">
                {[
                  { value: 'new', name: 'Lead mới', color: 'bg-gray-100 border-gray-300', icon: '🆕', description: 'Lead mới vừa được tạo, chưa được xử lý' },
                  { value: 'contacted', name: 'Đang tư vấn', color: 'bg-blue-100 border-blue-300', icon: '📞', description: 'Đã liên hệ và đang tư vấn khách hàng' },
                  { value: 'qualified', name: 'Đã gửi đề xuất', color: 'bg-yellow-100 border-yellow-300', icon: '📋', description: 'Đã gửi đề xuất/báo giá cho khách hàng' },
                  { value: 'negotiation', name: 'Đàm phán', color: 'bg-orange-100 border-orange-300', icon: '🤝', description: 'Đang trong quá trình thương lượng và đàm phán' },
                  { value: 'payment_pending', name: 'Chờ thanh toán', color: 'bg-purple-100 border-purple-300', icon: '💳', description: 'Đã thống nhất, chờ khách hàng thanh toán' },
                  { value: 'converted', name: 'Chuyển đổi thành công', color: 'bg-green-100 border-green-300', icon: '✅', description: 'Đã thanh toán và chuyển đổi thành công' },
                  { value: 'lost', name: 'Thất bại', color: 'bg-red-100 border-red-300', icon: '❌', description: 'Lead không thành công, đã đóng' }
                ].map((status) => (
                  <div
                    key={status.value}
                    onClick={() => setSelectedBulkStatus(status.value)}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md ${selectedBulkStatus === status.value
                      ? 'border-blue-500 bg-blue-50'
                      : `border-gray-200 hover:border-gray-300 ${status.color}`
                      }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="text-2xl">{status.icon}</div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">{status.name}</h4>
                        <p className="text-sm text-gray-600 mt-1">{status.description}</p>
                      </div>
                      <div className="flex items-center">
                        {selectedBulkStatus === status.value ? (
                          <CheckCircle className="w-5 h-5 text-blue-500" />
                        ) : (
                          <ArrowRight className="w-5 h-5 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="px-4 sm:px-6 py-4 border-t border-gray-200 bg-gray-50 flex-shrink-0">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
                <div className="text-sm text-gray-600 text-center sm:text-left">
                  💡 Mẹo: Việc chuyển trạng thái sẽ được ghi lại trong lịch sử tương tác
                </div>
                <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                  <button
                    onClick={() => {
                      setShowBulkStatusModal(false)
                      setSelectedBulkStatus('')
                    }}
                    className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Hủy
                  </button>
                  <button
                    onClick={() => confirmBulkStatusChange(selectedBulkStatus)}
                    disabled={!selectedBulkStatus}
                    className={`w-full sm:w-auto px-4 py-2 text-sm font-medium border border-transparent rounded-lg transition-all duration-200 flex items-center justify-center gap-2 ${selectedBulkStatus
                      ? 'text-white bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg'
                      : 'text-gray-400 bg-gray-300 cursor-not-allowed'
                      }`}
                  >
                    <TrendingUp className="w-4 h-4" />
                    {selectedBulkStatus ? `Chuyển sang "${[
                      { value: 'new', name: 'Lead mới' },
                      { value: 'contacted', name: 'Đã liên hệ' },
                      { value: 'qualified', name: 'Đủ điều kiện' },
                      { value: 'proposal', name: 'Đã báo giá' },
                      { value: 'negotiation', name: 'Thương lượng' },
                      { value: 'converted', name: 'Chuyển đổi thành công' },
                      { value: 'lost', name: 'Thất bại' }
                    ].find(s => s.value === selectedBulkStatus)?.name || ''
                      }"` : 'Chọn trạng thái để tiếp tục'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Convert Modal */}
      {showBulkConvertModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 sm:p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] sm:max-h-[85vh] overflow-y-auto">
            <div className="px-4 sm:px-6 py-4 border-b border-gray-200 relative">
              <button
                onClick={() => {
                  setShowBulkConvertModal(false)
                  setBulkConvertTargetStatus('')
                  setSelectedProducts([])
                  setSelectedPackages({})
                  setProductQuantities({}) // Reset quantities
                  setOrderNotes('') // Reset order notes
                  setDiscountPercent(0)
                  setDiscountType('%')
                  setPaymentMethod('cash')
                  setSelectedCategory('Tất cả')
                  setPaymentDeadline('')
                  setPaymentMode('full')
                  setPaymentInstallments(1)
                  setInstallmentData([{ amount: 0, date: '' }])
                }}
                className="absolute top-4 right-4 p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                title="Đóng"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 pr-8">
                {selectedLeadIds.length > 1
                  ? `Chuyển đổi hàng loạt - ${bulkConvertTargetStatus === 'payment_pending' ? 'Chờ thanh toán' : getStatusName(bulkConvertTargetStatus)}`
                  : `Chuyển đổi sang ${bulkConvertTargetStatus === 'payment_pending' ? 'chờ thanh toán' : getStatusName(bulkConvertTargetStatus).toLowerCase()}`
                }
              </h3>
              {bulkConvertTargetStatus === 'converted' && (
                <p className="text-sm text-amber-600 mt-1">
                  ℹ️ Leads sẽ được chuyển về "Chờ thanh toán" để xác nhận thanh toán trước khi hoàn tất chuyển đổi.
                </p>
              )}
              <p className="text-sm text-gray-600 mt-2">
                <strong>Lưu ý quan trọng:</strong> Toàn bộ {selectedLeadIds.length} leads sẽ tạo đơn hàng giống nhau với các sản phẩm được chọn bên dưới.
              </p>
            </div>

            <div className="px-4 sm:px-6 py-4">
              {/* Customer Info */}
              {selectedLeadIds.length === 1 && (() => {
                const selectedLead = leads.find(l => l.id === selectedLeadIds[0])
                return selectedLead ? (
                  <div className="flex items-center gap-3 mb-4">
                    <span className="relative flex shrink-0 overflow-hidden rounded-full h-12 w-12 bg-blue-100">
                      <span className="flex h-full w-full items-center justify-center rounded-full bg-blue-100 text-blue-700 font-semibold">
                        <User className="h-6 w-6" />
                      </span>
                    </span>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-slate-900">{selectedLead.name}</h3>
                      </div>
                      <p className="text-sm text-slate-600">
                        {selectedLead.email && <span>{selectedLead.email}</span>}
                      </p>
                    </div>
                  </div>
                ) : null
              })()}

              {/* Order Notes */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Ghi chú đơn hàng</label>
                <textarea
                  value={orderNotes}
                  onChange={(e) => setOrderNotes(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={2}
                  placeholder="Nhập ghi chú cho đơn hàng (không bắt buộc)..."
                />
              </div>

              {/* Category Filter */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Chọn thể loại sản phẩm
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full sm:w-64 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {productCategories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              {/* Product Selection */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {bulkConvertTargetStatus === 'converted' ?
                    'Chọn sản phẩm đã bán cho tất cả leads' :
                    'Chọn sản phẩm và gói sản phẩm'
                  } <span className="text-red-500">*</span>
                </label>
                <div className="max-h-72 overflow-y-auto border border-gray-300 rounded-lg p-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {availableProducts
                      .filter(product => selectedCategory === 'Tất cả' || product.category === selectedCategory)
                      .map((product) => (
                        <div key={product.id} className="border border-gray-200 rounded-lg p-3 bg-white hover:border-blue-300 transition-colors">
                          {/* Product Selection */}
                          <label className="flex items-start space-x-3 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={selectedProducts.includes(product.id)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedProducts(prev => [...prev, product.id])
                                  // Set default package to standard
                                  setSelectedPackages(prev => ({
                                    ...prev,
                                    [product.id]: availablePackages[product.id as keyof typeof availablePackages]?.[0]?.id || ''
                                  }))
                                  // Set default quantity to 1
                                  setProductQuantities(prev => ({
                                    ...prev,
                                    [product.id]: 1
                                  }))
                                } else {
                                  setSelectedProducts(prev => prev.filter(id => id !== product.id))
                                  setSelectedPackages(prev => {
                                    const newPackages = { ...prev }
                                    delete newPackages[product.id]
                                    return newPackages
                                  })
                                  setProductQuantities(prev => {
                                    const newQuantities = { ...prev }
                                    delete newQuantities[product.id]
                                    return newQuantities
                                  })
                                }
                              }}
                              className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <h4 className="font-medium text-gray-900 text-sm">{product.name}</h4>
                                <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded">{product.category}</span>
                              </div>
                              <p className="text-xs text-gray-500 mt-1 line-clamp-2">{product.description}</p>
                              <p className="text-sm font-semibold text-green-600 mt-1">{formatCurrency(product.price.toString())} VNĐ</p>
                            </div>
                          </label>

                          {/* Package & Quantity Selection */}
                          {selectedProducts.includes(product.id) && availablePackages[product.id as keyof typeof availablePackages] && (
                            <div className="ml-7 mt-2 p-2 bg-gray-50 rounded">
                              <div className="grid grid-cols-2 gap-2">
                                <div>
                                  <label className="block text-xs font-medium text-gray-700 mb-1">Chọn gói:</label>
                                  <select
                                    value={selectedPackages[product.id] || ''}
                                    onChange={(e) => setSelectedPackages(prev => ({
                                      ...prev,
                                      [product.id]: e.target.value
                                    }))}
                                    className="w-full text-sm border border-gray-300 rounded px-2 py-1"
                                  >
                                    {availablePackages[product.id as keyof typeof availablePackages]?.map(pkg => (
                                      <option key={pkg.id} value={pkg.id}>
                                        {pkg.name} {pkg.price > 0 ? `(+${formatCurrency(pkg.price.toString())} VNĐ)` : ''}
                                      </option>
                                    ))}
                                  </select>
                                </div>
                                <div>
                                  <label className="block text-xs font-medium text-gray-700 mb-1">Số lượng:</label>
                                  <input
                                    type="number"
                                    min="1"
                                    value={productQuantities[product.id] || 1}
                                    onChange={(e) => setProductQuantities(prev => ({
                                      ...prev,
                                      [product.id]: Math.max(1, parseInt(e.target.value) || 1)
                                    }))}
                                    className="w-full text-sm border border-gray-300 rounded px-2 py-1"
                                  />
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                  </div>
                  {availableProducts.filter(product => selectedCategory === 'Tất cả' || product.category === selectedCategory).length === 0 && (
                    <p className="text-sm text-gray-500 text-center py-4">Không có sản phẩm nào trong thể loại này</p>
                  )}
                </div>
              </div>

              {/* Payment & Discount Info for all statuses */}
              {selectedProducts.length > 0 && (
                <div className="space-y-4">

                  {/* Selected Products Summary - Show individual products with quantities */}
                  {(() => {
                    const subtotal = selectedProducts.reduce((sum, productId) => {
                      const product = availableProducts.find(p => p.id === productId)
                      const selectedPackageId = selectedPackages[productId]
                      const selectedPackage = availablePackages[productId as keyof typeof availablePackages]?.find(pkg => pkg.id === selectedPackageId)
                      const quantity = productQuantities[productId] || 1
                      return sum + ((product?.price || 0) + (selectedPackage?.price || 0)) * quantity
                    }, 0)
                    const totalBeforeDiscount = subtotal * selectedLeadIds.length
                    const discountAmount = discountType === '%'
                      ? totalBeforeDiscount * discountPercent / 100
                      : discountPercent
                    const afterDiscount = totalBeforeDiscount - discountAmount
                    const vatAmount = afterDiscount * 0.1
                    const grandTotal = afterDiscount + vatAmount

                    return (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <h5 className="text-sm font-medium text-green-800 mb-3">
                          Đã chọn {selectedProducts.length} sản phẩm:
                        </h5>
                        <div className="space-y-2 text-sm">
                          {selectedProducts.map(productId => {
                            const product = availableProducts.find(p => p.id === productId)
                            const selectedPackageId = selectedPackages[productId]
                            const selectedPackage = availablePackages[productId as keyof typeof availablePackages]?.find(pkg => pkg.id === selectedPackageId)
                            const quantity = productQuantities[productId] || 1
                            const productTotal = ((product?.price || 0) + (selectedPackage?.price || 0)) * quantity

                            return product ? (
                              <div key={productId} className="flex justify-between text-gray-700">
                                <span>{product.name} ({selectedPackage?.name || 'Standard'}) x{quantity} / {selectedLeadIds.length} leads</span>
                                <span className="font-medium text-green-600">
                                  {formatCurrency((productTotal * selectedLeadIds.length).toString())} VNĐ
                                </span>
                              </div>
                            ) : null
                          })}
                          {discountAmount > 0 && (
                            <div className="flex justify-between text-gray-600 border-t border-green-200 pt-2 mt-2">
                              <span>Giảm giá {discountType === '%' ? `(${discountPercent}%)` : ''}:</span>
                              <span className="font-medium text-red-500">-{formatCurrency(discountAmount.toString())} VNĐ</span>
                            </div>
                          )}
                          <div className="flex justify-between text-gray-600 pt-1">
                            <span>Phí VAT (10%):</span>
                            <span className="font-medium text-gray-700">+{formatCurrency(vatAmount.toString())} VNĐ</span>
                          </div>
                          <div className="flex justify-between font-semibold text-green-700 border-t border-green-300 pt-2 mt-2">
                            <span>Tổng cộng:</span>
                            <span className="text-lg">{formatCurrency(grandTotal.toString())} VNĐ</span>
                          </div>
                        </div>
                      </div>
                    )
                  })()}

                  {/* Payment Info Section */}
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    {/* Payment Deadline & Discount - Same Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      {/* Payment Deadline */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Thời hạn thanh toán <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="date"
                          value={paymentDeadline}
                          onChange={(e) => setPaymentDeadline(e.target.value)}
                          min={new Date().toISOString().split('T')[0]}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        {!paymentDeadline && (
                          <p className="mt-1 text-xs text-red-500">Vui lòng chọn thời hạn thanh toán</p>
                        )}
                      </div>

                      {/* Discount */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Giảm giá
                        </label>
                        <div className="flex items-center space-x-2">
                          <input
                            type="number"
                            min="0"
                            max={discountType === '%' ? 100 : undefined}
                            value={discountPercent}
                            onChange={(e) => setDiscountPercent(Math.max(0, discountType === '%' ? Math.min(100, parseInt(e.target.value) || 0) : parseInt(e.target.value) || 0))}
                            placeholder="0"
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                          <select
                            value={discountType}
                            onChange={(e) => {
                              setDiscountType(e.target.value as '%' | 'VND')
                              setDiscountPercent(0)
                            }}
                            className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="%">%</option>
                            <option value="VND">VNĐ</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Payment Method - Same Row */}
                    <div className="mb-4">
                      <div className="flex flex-wrap items-center gap-4">
                        <label className="text-sm font-medium text-gray-700 whitespace-nowrap">
                          Hình thức thanh toán
                        </label>
                        <select
                          value={paymentMethod}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                          className="w-auto px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="cash">Tiền mặt</option>
                          <option value="bank_transfer">Chuyển khoản</option>
                          <option value="installment">Trả góp</option>
                          <option value="momo">Momo</option>
                          <option value="card">Thẻ</option>
                          <option value="custom">Tùy chỉnh</option>
                        </select>
                      </div>
                    </div>

                    {/* Payment Mode - Full or Installment */}
                    <div className="mb-4">
                      <div className="flex flex-wrap items-center gap-4">
                        <label className="text-sm font-medium text-gray-700 whitespace-nowrap">
                          Thực hiện thanh toán
                        </label>
                        <div className="flex gap-3">
                          <label className="flex items-center px-3 py-2 border border-gray-200 rounded-lg cursor-pointer hover:bg-white transition-colors bg-white">
                            <input
                              type="radio"
                              name="paymentMode"
                              value="full"
                              checked={paymentMode === 'full'}
                              onChange={(e) => setPaymentMode(e.target.value as 'full' | 'installment')}
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                            />
                            <span className="ml-2 text-sm text-gray-700">Toàn bộ</span>
                          </label>
                          <label className="flex items-center px-3 py-2 border border-gray-200 rounded-lg cursor-pointer hover:bg-white transition-colors bg-white">
                            <input
                              type="radio"
                              name="paymentMode"
                              value="installment"
                              checked={paymentMode === 'installment'}
                              onChange={(e) => setPaymentMode(e.target.value as 'full' | 'installment')}
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                            />
                            <span className="ml-2 text-sm text-gray-700">Theo giai đoạn</span>
                          </label>
                        </div>
                      </div>
                    </div>

                    {/* Payment Installments - Only show when installment mode selected */}
                    {paymentMode === 'installment' && (
                      <div className="border-t border-gray-200 pt-4">
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Số lần thanh toán
                          </label>
                          <input
                            type="number"
                            min="1"
                            max="12"
                            value={paymentInstallments}
                            onChange={(e) => {
                              const num = Math.max(1, Math.min(12, parseInt(e.target.value) || 1))
                              setPaymentInstallments(num)
                              // Update installment data array
                              const newInstallments = Array.from({ length: num }, (_, i) =>
                                installmentData[i] || { amount: 0, date: '' }
                              )
                              setInstallmentData(newInstallments)
                            }}
                            className="w-32 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>

                        {/* Installment Details */}
                        {installmentData.map((installment, index) => {
                          // Calculate grand total for validation (same as summary calculation)
                          const subtotalCalc = selectedProducts.reduce((sum, productId) => {
                            const product = availableProducts.find(p => p.id === productId)
                            const selectedPackageId = selectedPackages[productId]
                            const selectedPackage = availablePackages[productId as keyof typeof availablePackages]?.find(pkg => pkg.id === selectedPackageId)
                            const quantity = productQuantities[productId] || 1
                            return sum + ((product?.price || 0) + (selectedPackage?.price || 0)) * quantity
                          }, 0)
                          const totalBeforeDiscountCalc = subtotalCalc * selectedLeadIds.length
                          const discountAmountCalc = discountType === '%'
                            ? totalBeforeDiscountCalc * discountPercent / 100
                            : discountPercent
                          const afterDiscountCalc = totalBeforeDiscountCalc - discountAmountCalc
                          const grandTotalCalc = afterDiscountCalc + afterDiscountCalc * 0.1

                          // Calculate max allowed for this installment
                          const otherInstallmentsTotal = installmentData.reduce((sum, inst, i) =>
                            i !== index ? sum + inst.amount : sum, 0
                          )
                          const maxAllowed = Math.max(0, grandTotalCalc - otherInstallmentsTotal)
                          const isOverLimit = installment.amount > maxAllowed

                          return (
                            <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3 p-3 bg-white rounded-lg border border-gray-100">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Số tiền thanh toán <span className="text-xs text-gray-500">(Tối đa: {formatCurrency(maxAllowed.toString())} VNĐ)</span>
                                </label>
                                <input
                                  type="text"
                                  value={formatCurrency(installment.amount.toString())}
                                  onChange={(e) => {
                                    const value = parseInt(e.target.value.replace(/\D/g, '')) || 0
                                    const validatedValue = Math.min(value, maxAllowed)
                                    const newData = [...installmentData]
                                    newData[index] = { ...newData[index], amount: validatedValue }
                                    setInstallmentData(newData)
                                  }}
                                  placeholder="0"
                                  className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${isOverLimit ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                                />
                                {isOverLimit && (
                                  <p className="mt-1 text-xs text-red-500">Số tiền vượt quá giới hạn cho phép</p>
                                )}
                              </div>
                              <div className="flex items-end gap-2">
                                <div className="flex-1">
                                  <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Ngày thanh toán đợt {index + 1}
                                  </label>
                                  <input
                                    type="date"
                                    value={installment.date}
                                    onChange={(e) => {
                                      const newData = [...installmentData]
                                      newData[index] = { ...newData[index], date: e.target.value }
                                      setInstallmentData(newData)
                                    }}
                                    min={new Date().toISOString().split('T')[0]}
                                    placeholder="Thời gian thanh toán ..."
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                  />
                                </div>
                                {paymentInstallments > 1 && (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      if (paymentInstallments > 1) {
                                        const newData = installmentData.filter((_, i) => i !== index)
                                        setInstallmentData(newData)
                                        setPaymentInstallments(paymentInstallments - 1)
                                      }
                                    }}
                                    className="px-3 py-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                                    title="Xóa đợt thanh toán"
                                  >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                  </button>
                                )}
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>
                </div>
              )}

              <p className="text-sm text-gray-600 mt-4">
                {bulkConvertTargetStatus === 'converted' ?
                  `Xác nhận tất cả ${selectedLeadIds.length} leads đã thanh toán thành công và hoàn tất giao dịch với các sản phẩm đã chọn.` :
                  bulkConvertTargetStatus === 'payment_pending' ?
                    `Tất cả ${selectedLeadIds.length} leads sẽ được chuyển sang trạng thái "Chờ thanh toán" với các sản phẩm đã chọn. Sau khi xác nhận thanh toán thành công, sẽ tự động chuyển sang "Chuyển đổi thành công".` :
                    `Tất cả ${selectedLeadIds.length} leads sẽ được chuyển sang trạng thái "${getStatusName(bulkConvertTargetStatus)}" với các sản phẩm đã chọn.`
                }
              </p>
            </div>

            <div className="px-4 sm:px-6 py-4 border-t border-gray-200 flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3">
              <button
                onClick={() => {
                  setShowBulkConvertModal(false)
                  setBulkConvertTargetStatus('')
                  setSelectedProducts([])
                  setSelectedPackages({})
                  setProductQuantities({}) // Reset quantities
                  setOrderNotes('') // Reset order notes
                  setDiscountPercent(0)
                  setDiscountType('%')
                  setPaymentMethod('cash')
                  setSelectedCategory('Tất cả')
                  setPaymentDeadline('')
                  setPaymentMode('full')
                  setPaymentInstallments(1)
                  setInstallmentData([{ amount: 0, date: '' }])
                }}
                className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100 border border-slate-300 rounded-lg hover:bg-slate-200 hover:text-slate-700 transition-all duration-200 shadow-sm hover:shadow-md"
              >
                Hủy
              </button>
              <button
                onClick={confirmBulkConvert}
                disabled={selectedProducts.length === 0 || !paymentDeadline}
                className={`w-full sm:w-auto px-4 py-2 text-sm font-medium border border-transparent rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-[1.02] flex items-center justify-center gap-2 ${selectedProducts.length > 0 && paymentDeadline
                  ? bulkConvertTargetStatus === 'converted'
                    ? 'text-white bg-green-600 hover:bg-green-700'
                    : 'text-white bg-blue-600 hover:bg-blue-700'
                  : 'text-gray-400 bg-gray-300 cursor-not-allowed'
                  }`}
              >
                <CheckCircle className="w-4 h-4" />
                <span className="truncate">
                  {selectedProducts.length > 0 && paymentDeadline ?
                    bulkConvertTargetStatus === 'converted'
                      ? `Xác nhận hoàn tất (${selectedProducts.length} SP cho ${selectedLeadIds.length} leads)`
                      : `Xác nhận chuyển (${selectedProducts.length} SP cho ${selectedLeadIds.length} leads)`
                    : !paymentDeadline && selectedProducts.length > 0
                      ? 'Vui lòng chọn thời hạn thanh toán'
                      : 'Chọn sản phẩm để tiếp tục'
                  }
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Column Management Modal */}
      {showColumnModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[80vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">Quản lý hiển thị cột</h3>
                <button
                  onClick={() => setShowColumnModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <p className="text-sm text-gray-600 mt-2">Chọn các cột bạn muốn hiển thị trong bảng</p>
            </div>

            {/* Quick Actions */}
            <div className="px-6 py-3 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700">Thao tác nhanh:</span>
                <button
                  onClick={() => {
                    const allEnabled = Object.keys(visibleColumns).reduce((acc, key) => {
                      acc[key as keyof typeof visibleColumns] = true;
                      return acc;
                    }, {} as typeof visibleColumns);
                    setVisibleColumns(allEnabled);
                  }}
                  className="px-3 py-1 text-xs bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  ✅ Hiển thị tất cả
                </button>
                <button
                  onClick={() => {
                    const essential = {
                      ...Object.keys(visibleColumns).reduce((acc, key) => {
                        acc[key as keyof typeof visibleColumns] = false;
                        return acc;
                      }, {} as typeof visibleColumns),
                      checkbox: true,
                      stt: true,
                      customerName: true,
                      phone: true,
                      stage: true,
                      salesOwner: true,
                      actions: true
                    };
                    setVisibleColumns(essential);
                  }}
                  className="px-3 py-1 text-xs bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                >
                  🎯 Chỉ cột thiết yếu
                </button>
                <button
                  onClick={() => {
                    const allDisabled = Object.keys(visibleColumns).reduce((acc, key) => {
                      acc[key as keyof typeof visibleColumns] = false;
                      return acc;
                    }, {} as typeof visibleColumns);
                    setVisibleColumns({ ...allDisabled, customerName: true, actions: true });
                  }}
                  className="px-3 py-1 text-xs bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
                >
                  ❌ Ẩn tất cả
                </button>
              </div>
            </div>

            <div className="px-6 py-4 space-y-3">
              {Object.entries({
                checkbox: '☑️ Checkbox',
                stt: '🔢 STT',
                customerName: '👤 Tên khách hàng',
                phone: '📱 Số điện thoại',
                email: '✉️ Email',
                company: '🏢 Công ty',
                address: '📍 Địa chỉ',
                source: '🌐 Nguồn',
                region: '🗺️ Tỉnh thành',
                stage: '🎯 Giai đoạn',
                product: '🛍️ Sản phẩm quan tâm',
                customerType: '👥 Loại khách hàng',
                salesOwner: '👨‍💼 Sales phụ trách',
                tags: '🏷️ Tags/Nhãn',
                notes: '📝 Ghi chú',
                files: '📎 Tệp đính kèm',
                createdDate: '📅 Ngày tạo',
                lastModified: '🕐 Ngày cập nhật',
                interactionCount: '🔄 Số lần tương tác',
                lastInteraction: '⏰ Lần tương tác cuối',
                actions: '⚙️ Hành động'
              } as const).map(([key, label]) => (
                <div key={key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={visibleColumns[key as keyof typeof visibleColumns]}
                      onChange={(e) => {
                        setVisibleColumns(prev => ({
                          ...prev,
                          [key]: e.target.checked
                        }))
                      }}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 focus:ring-2"
                    />
                    <span className="ml-3 text-sm font-medium text-gray-700">{label}</span>
                  </label>
                </div>
              ))}
            </div>

            <div className="px-6 py-4 border-t border-gray-200 flex justify-between">
              <div className="flex space-x-2">
                <button
                  onClick={() => {
                    setVisibleColumns(Object.keys(visibleColumns).reduce((acc, key) => {
                      acc[key as keyof typeof visibleColumns] = true
                      return acc
                    }, {} as typeof visibleColumns))
                  }}
                  className="px-3 py-2 text-sm text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Chọn tất cả
                </button>
                <button
                  onClick={() => {
                    setVisibleColumns(Object.keys(visibleColumns).reduce((acc, key) => {
                      acc[key as keyof typeof visibleColumns] = key === 'customerName' || key === 'actions'
                      return acc
                    }, {} as typeof visibleColumns))
                  }}
                  className="px-3 py-2 text-sm text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Mặc định
                </button>
              </div>
              <button
                onClick={() => setShowColumnModal(false)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Áp dụng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* File Management Modal */}
      {showFileModal && selectedLeadForFile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Quản lý tệp</h3>
                <p className="text-sm text-gray-600 mt-1">Lead: {selectedLeadForFile.name}</p>
              </div>
              <button
                onClick={() => {
                  setShowFileModal(false)
                  setSelectedLeadForFile(null)
                  setSelectedFiles(null)
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              {/* Upload Section */}
              <div className="mb-6">
                <h4 className="text-md font-medium text-gray-900 mb-3">Thêm tệp mới</h4>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                  <div className="text-center">
                    <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                    <label className="cursor-pointer">
                      <span className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                        Chọn tệp để upload
                      </span>
                      <input
                        type="file"
                        multiple
                        onChange={handleFileUpload}
                        className="hidden"
                        accept="*/*"
                      />
                    </label>
                    <p className="text-xs text-gray-500 mt-1">
                      Hoặc kéo thả tệp vào đây
                    </p>
                  </div>

                  {selectedFiles && (
                    <div className="mt-4">
                      <h5 className="text-sm font-medium text-gray-700 mb-2">Tệp đã chọn:</h5>
                      {Array.from(selectedFiles).map((file, index) => (
                        <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded text-sm">
                          <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4 text-gray-600" />
                            <span>{file.name}</span>
                            <span className="text-gray-500">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                          </div>
                        </div>
                      ))}
                      <button
                        onClick={handleSubmitFiles}
                        className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                      >
                        Upload tệp
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Existing Files */}
              <div>
                <h4 className="text-md font-medium text-gray-900 mb-3">
                  Tệp hiện có ({selectedLeadForFile.files?.length || 0})
                </h4>
                {selectedLeadForFile.files && selectedLeadForFile.files.length > 0 ? (
                  <div className="space-y-2">
                    {selectedLeadForFile.files.map((file, index) => (
                      <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                        <div className="flex items-center gap-3">
                          <FileText className="w-5 h-5 text-blue-600" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">{file.name}</p>
                            <p className="text-xs text-gray-500">
                              {file.size} • {file.type} • {new Date(file.uploadedAt).toLocaleDateString('vi-VN')}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              // Create a download link for the file
                              alert('Chức năng download sẽ được triển khai sau')
                            }}
                            className="p-1 text-blue-600 hover:text-blue-700 transition-colors"
                            title="Tải xuống"
                          >
                            <DownloadIcon className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteFile(index)}
                            className="p-1 text-red-600 hover:text-red-700 transition-colors"
                            title="Xóa tệp"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <FileText className="mx-auto h-12 w-12 text-gray-300 mb-3" />
                    <p>Chưa có tệp nào được upload</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Note Modal */}
      {showAddNoteModal && selectedLeadForNote && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="flex items-center justify-between p-6 border-b">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Thêm ghi chú</h3>
                <p className="text-sm text-gray-600 mt-1">Lead: {selectedLeadForNote.name}</p>
              </div>
              <button
                onClick={() => {
                  setShowAddNoteModal(false)
                  setSelectedLeadForNote(null)
                  setNewNoteContent('')
                  setSelectedFiles(null)
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nội dung ghi chú
                </label>
                <textarea
                  value={newNoteContent}
                  onChange={(e) => setNewNoteContent(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Nhập nội dung ghi chú..."
                />
              </div>

              {/* Quick File Upload */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Đính kèm file (tùy chọn)
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="file"
                    multiple
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.gif"
                    onChange={(e) => {
                      const files = e.target.files
                      if (files) {
                        // Handle file upload logic here
                        setSelectedFiles(files)
                        setNotification({
                          message: `Đã chọn ${files.length} file để đính kèm`,
                          type: 'success'
                        })
                        setTimeout(() => setNotification(null), 2000)
                      }
                    }}
                    className="hidden"
                    id="note-file-input"
                  />
                  <label
                    htmlFor="note-file-input"
                    className="flex items-center px-3 py-2 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50 transition-colors"
                  >
                    <Paperclip className="w-4 h-4 mr-2 text-gray-600" />
                    <span className="text-sm text-gray-700">Chọn file</span>
                  </label>
                  {selectedFiles && selectedFiles.length > 0 && (
                    <span className="text-sm text-green-600">
                      {selectedFiles.length} file đã chọn
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Hỗ trợ: PDF, Word, Excel, hình ảnh. Tối đa 10MB/file.
                </p>
              </div>

              {/* Show existing notes preview */}
              {selectedLeadForNote.quickNotes && selectedLeadForNote.quickNotes.length > 0 && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ghi chú hiện có ({selectedLeadForNote.quickNotes.length})
                  </label>
                  <div className="max-h-32 overflow-y-auto bg-gray-50 rounded-md p-3">
                    {selectedLeadForNote.quickNotes.slice(-3).map((note, index) => (
                      <div key={index} className="text-xs text-gray-600 mb-2 last:mb-0">
                        <div className="font-medium">
                          {new Date(note.timestamp).toLocaleDateString('vi-VN')} - {note.author}
                        </div>
                        <div className="text-gray-800">{note.content}</div>
                      </div>
                    ))}
                    {selectedLeadForNote.quickNotes.length > 3 && (
                      <div className="text-xs text-gray-500 italic">
                        ... và {selectedLeadForNote.quickNotes.length - 3} ghi chú khác
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-3 p-6 border-t bg-gray-50 rounded-b-lg">
              <button
                onClick={() => {
                  setShowAddNoteModal(false)
                  setSelectedLeadForNote(null)
                  setNewNoteContent('')
                  setSelectedFiles(null)
                }}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={handleSubmitNote}
                disabled={!newNoteContent.trim()}
                className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                <StickyNote className="w-4 h-4" />
                Thêm ghi chú
                {selectedFiles && selectedFiles.length > 0 && (
                  <span className="text-xs">({selectedFiles.length} file)</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Sửa Ghi Chú */}
      {showEditNoteModal && selectedLead && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" fill="currentColor" />
                </svg>
                Sửa ghi chú
              </h3>
              <button
                onClick={() => {
                  setShowEditNoteModal(false)
                  setEditNoteContent('')
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nội dung ghi chú
              </label>
              <textarea
                value={editNoteContent || selectedLead.notes || ''}
                onChange={(e) => setEditNoteContent(e.target.value)}
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                placeholder="Nhập ghi chú..."
              />
            </div>

            <div className="flex items-center justify-end gap-3 p-6 border-t bg-gray-50">
              <button
                onClick={() => {
                  setShowEditNoteModal(false)
                  setEditNoteContent('')
                }}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={() => {
                  if (selectedLead) {
                    const updatedLeads = leads.map(lead =>
                      lead.id === selectedLead.id
                        ? { ...lead, notes: editNoteContent || selectedLead.notes }
                        : lead
                    )
                    setLeads(updatedLeads)
                    setSelectedLead({ ...selectedLead, notes: editNoteContent || selectedLead.notes })
                    setShowEditNoteModal(false)
                    setEditNoteContent('')
                  }
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                Lưu thay đổi
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Xác Nhận Xóa Ghi Chú */}
      {showDeleteNoteConfirm && selectedLead && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-600" />
                Xác nhận xóa
              </h3>
              <button
                onClick={() => setShowDeleteNoteConfirm(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6">
              <p className="text-gray-700">
                Bạn có xác nhận xóa ghi chú này? Hành động này sẽ không được hoàn tác.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 p-6 border-t bg-gray-50">
              <button
                onClick={() => setShowDeleteNoteConfirm(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
              >
                Hủy bỏ
              </button>
              <button
                onClick={() => {
                  if (selectedLead) {
                    const updatedLeads = leads.map(lead =>
                      lead.id === selectedLead.id
                        ? { ...lead, notes: '' }
                        : lead
                    )
                    setLeads(updatedLeads)
                    setSelectedLead({ ...selectedLead, notes: '' })
                    setShowDeleteNoteConfirm(false)
                  }
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Đồng ý
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Field Settings Modal */}
      {showFieldSettingsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex border border-gray-200 rounded-lg overflow-hidden">
                    <button className="px-4 py-2 text-sm font-medium bg-white text-gray-900 border-r border-gray-200">
                      Ẩn hiện trường dữ liệu
                    </button>
                    <button
                      onClick={() => setShowFieldSettingsModal(false)}
                      className="px-4 py-2 text-sm font-medium hover:bg-green-700 transition-all text-white bg-green-600 rounded-r-lg flex items-center gap-1"
                    >
                      Lưu
                    </button>
                  </div>
                </div>
                <button
                  onClick={() => setShowFieldSettingsModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-6 max-h-[60vh] overflow-y-auto">
              <div className="space-y-3">
                {/* Required fields - cannot be hidden */}
                <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200 opacity-70 cursor-not-allowed">
                  <span className="text-sm text-gray-600">Số điện thoại</span>
                  <input
                    type="checkbox"
                    checked={true}
                    disabled
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded cursor-not-allowed"
                  />
                </label>

                <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200 opacity-70 cursor-not-allowed">
                  <span className="text-sm text-gray-600">Email</span>
                  <input
                    type="checkbox"
                    checked={true}
                    disabled
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded cursor-not-allowed"
                  />
                </label>

                {/* Optional fields */}
                <label className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer">
                  <span className="text-sm text-gray-700">Tên khách hàng</span>
                  <input
                    type="checkbox"
                    checked={leadFormFieldVisibility.name}
                    onChange={(e) => setLeadFormFieldVisibility(prev => ({ ...prev, name: e.target.checked }))}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer">
                  <span className="text-sm text-gray-700">Doanh thu ước tính</span>
                  <input
                    type="checkbox"
                    checked={leadFormFieldVisibility.estimatedRevenue}
                    onChange={(e) => setLeadFormFieldVisibility(prev => ({ ...prev, estimatedRevenue: e.target.checked }))}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer">
                  <span className="text-sm text-gray-700">Công ty</span>
                  <input
                    type="checkbox"
                    checked={leadFormFieldVisibility.company}
                    onChange={(e) => setLeadFormFieldVisibility(prev => ({ ...prev, company: e.target.checked }))}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer">
                  <span className="text-sm text-gray-700">Chức vụ</span>
                  <input
                    type="checkbox"
                    checked={leadFormFieldVisibility.jobTitle}
                    onChange={(e) => setLeadFormFieldVisibility(prev => ({ ...prev, jobTitle: e.target.checked }))}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer">
                  <span className="text-sm text-gray-700">Ngành nghề</span>
                  <input
                    type="checkbox"
                    checked={leadFormFieldVisibility.industry}
                    onChange={(e) => setLeadFormFieldVisibility(prev => ({ ...prev, industry: e.target.checked }))}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer">
                  <span className="text-sm text-gray-700">Quy mô công ty</span>
                  <input
                    type="checkbox"
                    checked={leadFormFieldVisibility.companySize}
                    onChange={(e) => setLeadFormFieldVisibility(prev => ({ ...prev, companySize: e.target.checked }))}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer">
                  <span className="text-sm text-gray-700">Website</span>
                  <input
                    type="checkbox"
                    checked={leadFormFieldVisibility.website}
                    onChange={(e) => setLeadFormFieldVisibility(prev => ({ ...prev, website: e.target.checked }))}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer">
                  <span className="text-sm text-gray-700">Địa chỉ</span>
                  <input
                    type="checkbox"
                    checked={leadFormFieldVisibility.address}
                    onChange={(e) => setLeadFormFieldVisibility(prev => ({ ...prev, address: e.target.checked }))}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer">
                  <span className="text-sm text-gray-700">Nguồn</span>
                  <input
                    type="checkbox"
                    checked={leadFormFieldVisibility.source}
                    onChange={(e) => setLeadFormFieldVisibility(prev => ({ ...prev, source: e.target.checked }))}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer">
                  <span className="text-sm text-gray-700">Tỉnh thành</span>
                  <input
                    type="checkbox"
                    checked={leadFormFieldVisibility.region}
                    onChange={(e) => setLeadFormFieldVisibility(prev => ({ ...prev, region: e.target.checked }))}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer">
                  <span className="text-sm text-gray-700">Phân công cho</span>
                  <input
                    type="checkbox"
                    checked={leadFormFieldVisibility.assignedTo}
                    onChange={(e) => setLeadFormFieldVisibility(prev => ({ ...prev, assignedTo: e.target.checked }))}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer">
                  <span className="text-sm text-gray-700">Sản phẩm quan tâm</span>
                  <input
                    type="checkbox"
                    checked={leadFormFieldVisibility.product}
                    onChange={(e) => setLeadFormFieldVisibility(prev => ({ ...prev, product: e.target.checked }))}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer">
                  <span className="text-sm text-gray-700">Nội dung quan tâm</span>
                  <input
                    type="checkbox"
                    checked={leadFormFieldVisibility.content}
                    onChange={(e) => setLeadFormFieldVisibility(prev => ({ ...prev, content: e.target.checked }))}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer">
                  <span className="text-sm text-gray-700">Ghi chú</span>
                  <input
                    type="checkbox"
                    checked={leadFormFieldVisibility.notes}
                    onChange={(e) => setLeadFormFieldVisibility(prev => ({ ...prev, notes: e.target.checked }))}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                  />
                </label>

                <p className="text-xs text-gray-500 mt-4 pt-3 border-t border-gray-200">
                  <span className="text-red-500">*</span> Số điện thoại và Email là trường bắt buộc, không thể ẩn.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
