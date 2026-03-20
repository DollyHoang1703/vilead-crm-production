'use client'

import { useState, useMemo, useEffect } from 'react'
import { 
  Plus, Search, Filter, MoreVertical, Phone, Mail, Eye, Building2, 
  User, Calendar, Tag, Clock, TrendingUp, TrendingDown, AlertTriangle,
  Star, Heart, DollarSign, MessageCircle, Activity, Target, Gift,
  MapPin, Briefcase, CreditCard, UserCheck, UserX, Users, ChevronDown,
  Bell, RefreshCw, Zap, BarChart3, PieChart, CheckCircle, XCircle,
  FileText, History, Send, Settings, Download, Crown, Award, UserPlus,
  Info, ArrowUpRight, ArrowDownRight, X, MessageSquare, Columns,
  Brain, BarChart, Package, Edit, ShoppingCart, StickyNote, Save, Sliders
} from 'lucide-react'
import CustomerEventsManager from './CustomerEventsManager'
import CustomerAnalytics from './CustomerAnalytics'
import CustomerDetailModal from './CustomerDetailModal'
import { CreatableSelect, CreatableSelectOption } from '@/components/ui/creatable-select'

interface CustomerTag {
  id: string
  name: string
  color: string
  category: 'behavior' | 'value' | 'engagement' | 'risk'
}

interface CustomerInteraction {
  id: string
  type: 'email' | 'call' | 'meeting' | 'sms' | 'chat' | 'support'
  channel: string
  title: string
  summary: string
  date: string
  status: 'success' | 'pending' | 'failed'
  aiSummary?: string
  editHistory?: InteractionEditLog[]
}

interface InteractionEditLog {
  id: string
  editedBy: string
  editedAt: string
  changes: {
    field: string
    oldValue: string
    newValue: string
  }[]
  reason?: string
}

interface CustomerProduct {
  id: string
  name: string
  category: string
  purchaseDate: string
  quantity: number
  price: number
  status: 'active' | 'expired' | 'cancelled'
}

interface NoteAttachment {
  id: string
  fileName: string
  fileSize: number
  fileType: string
  uploadedAt: string
  thumbnailUrl?: string
}

interface CustomerNote {
  id: string
  content: string
  createdAt: string
  createdBy: string
  attachments: NoteAttachment[]
}

interface Customer {
  id: number
  name: string
  firstName: string
  lastName: string
  contact: string
  email: string
  secondaryEmail?: string
  company: string
  companySize: 'small' | 'medium' | 'large' | 'enterprise'
  industry: string
  position: string
  department: string
  status: 'active' | 'inactive' | 'at-risk' | 'vip' | 'churned' | 'dormant'
  customerType: 'diamond' | 'gold' | 'silver' | 'bronze' | 'new' | 'returning' | 'inactive'
  tags: CustomerTag[]
  totalValue: string
  lifetimeValue: string
  averageOrderValue: string
  lastOrderDate: string
  lastInteraction: string
  daysSinceLastInteraction: number
  engagementScore: number
  churnRisk: number
  loyaltyPoints: number
  preferredChannel: 'email' | 'phone' | 'chat' | 'in-person' | 'social'
  interactions: CustomerInteraction[]
  products: CustomerProduct[]
  team?: string
  assignedPerson?: string
  
  // Personal Information
  dateOfBirth?: string
  gender?: 'male' | 'female' | 'other'
  maritalStatus?: 'single' | 'married' | 'divorced' | 'widowed'
  
  // Contact Information
  address: string
  city: string
  state: string
  country: string
  postalCode: string
  phone2?: string
  fax?: string
  website?: string
  
  // Social Media
  socialMedia?: {
    facebook?: string
    linkedin?: string
    twitter?: string
    instagram?: string
  }
  
  // Business Information
  taxId?: string
  registrationNumber?: string
  businessLicense?: string
  
  // Financial Information
  creditLimit: number
  paymentTerms: string
  currency: string
  taxExempt: boolean
  
  // Preferences
  preferences: {
    communicationFrequency: 'daily' | 'weekly' | 'monthly' | 'quarterly'
    marketingConsent: boolean
    newsletter: boolean
    smsConsent: boolean
    language: string
    timezone: string
    communicationHours: {
      start: string
      end: string
    }
  }
  
  // Relationship Information
  assignedSalesRep?: string
  accountManager?: string
  customerSince: string
  referredBy?: string
  referralCode?: string
  
  // Purchase History
  firstPurchaseDate?: string
  lastPurchaseDate?: string
  totalOrders: number
  totalSpent: number
  averageOrderFrequency: number
  predictedRevenue?: number
  
  // Support Information
  supportTickets: number
  supportPriority: 'low' | 'medium' | 'high' | 'critical'
  customFields?: Record<string, any>
  
  // Metadata
  notes?: CustomerNote[]
  internalNotes?: string
  createdAt: string
  updatedAt: string
  createdBy: string
  updatedBy: string
  isDeleted: boolean
  deletedAt?: string
  
  // Marketing & Campaigns
  remarketing: {
    eligible: boolean
    priority: 'low' | 'medium' | 'high'
    lastCampaign: string
    suggestedActions?: string[]
    bestTimeToContact?: string
    campaigns: Array<{
      id: string
      name: string
      type: string
      status: string
      sentAt: string
      openRate?: number
      clickRate?: number
    }>
  }
}

/**
 * CustomersManagement Component
 * 
 * Quản lý danh sách khách hàng đã chuyển đổi thành công từ lead.
 * - Dữ liệu được đồng bộ từ Sales Management khi lead chuyển trạng thái thành "Đã bán"
 * - Tags được đồng bộ trực tiếp từ Sales Management (không thêm tag chuyển đổi)
 * - Thông tin nguồn gốc và lifecycle được tính toán dựa trên dữ liệu sales
 * - Hiển thị đầy đủ 25 trường thông tin khách hàng theo đặc tả
 */
export default function CustomersManagement() {
  const [selectedView, setSelectedView] = useState<'list' | 'analytics' | 'events' | 'insights'>('list')
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [isEditingCustomer, setIsEditingCustomer] = useState(false)
  const [editCustomerData, setEditCustomerData] = useState<Partial<Customer>>({})
  const [activeTab, setActiveTab] = useState<'details' | 'interactions' | 'orders' | 'notes'>('details')
  const [showAddInteractionModal, setShowAddInteractionModal] = useState(false)
  const [newInteractionData, setNewInteractionData] = useState({
    type: 'call',
    channel: '',
    title: '',
    summary: '',
    status: 'success'
  })
  const [showCreateOrderModal, setShowCreateOrderModal] = useState(false)
  const [selectedCustomerForOrder, setSelectedCustomerForOrder] = useState<Customer | null>(null)
  const [selectedProducts, setSelectedProducts] = useState<string[]>([])
  const [selectedPackages, setSelectedPackages] = useState<{[productId: string]: string}>({}) // Track package for each product
  const [productQuantities, setProductQuantities] = useState<{[productId: string]: number}>({}) // Track quantity for each product
  const [orderNotes, setOrderNotes] = useState('') // Order notes
  const [selectedCategory, setSelectedCategory] = useState('Tất cả') // Category filter
  const [paymentDeadline, setPaymentDeadline] = useState('')
  const [discountPercent, setDiscountPercent] = useState(0)
  const [discountType, setDiscountType] = useState<'%' | 'VND'>('%')
  const [paymentMethod, setPaymentMethod] = useState('cash')
  const [paymentMode, setPaymentMode] = useState<'full' | 'installment'>('full')
  const [paymentInstallments, setPaymentInstallments] = useState(1)
  const [installmentData, setInstallmentData] = useState([{amount: 0, date: ''}])
  const [newOrderData, setNewOrderData] = useState({
    notes: '',
    discountPercent: 0,
    paymentMethod: 'cash',
    totalAmount: 0,
    finalAmount: 0
  })

  // Available products and packages list
  const availableProducts = [
    // Main Products
    { id: 'crm-basic', name: 'CRM Basic', category: 'Sản phẩm', price: 500000, description: 'Hệ thống CRM cơ bản cho doanh nghiệp nhỏ' },
    { id: 'crm-professional', name: 'CRM Professional', category: 'Sản phẩm', price: 1200000, description: 'Hệ thống CRM chuyên nghiệp với nhiều tính năng nâng cao' },
    { id: 'crm-enterprise', name: 'CRM Enterprise', category: 'Sản phẩm', price: 2500000, description: 'Hệ thống CRM doanh nghiệp với đầy đủ tính năng' },
    { id: 'ai-analytics', name: 'AI Analytics Module', category: 'Sản phẩm', price: 800000, description: 'Module phân tích dữ liệu với AI' },
    { id: 'marketing-automation', name: 'Marketing Automation', category: 'Sản phẩm', price: 600000, description: 'Tự động hóa marketing và email campaigns' },
    { id: 'sales-dashboard', name: 'Sales Dashboard Pro', category: 'Sản phẩm', price: 400000, description: 'Dashboard bán hàng chuyên nghiệp' },
    { id: 'mobile-app', name: 'Mobile App License', category: 'Sản phẩm', price: 300000, description: 'Giấy phép sử dụng ứng dụng di động' }
  ]

  // Available packages for each product
  const availablePackages = {
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
    'marketing-automation': [
      { id: 'marketing-standard', name: 'Gói Standard', price: 0, description: 'Module cơ bản' },
      { id: 'marketing-pro', name: 'Gói Pro', price: 250000, description: 'Thêm email templates + analytics' }
    ],
    'sales-dashboard': [
      { id: 'dashboard-standard', name: 'Gói Standard', price: 0, description: 'Dashboard cơ bản' },
      { id: 'dashboard-pro', name: 'Gói Pro', price: 200000, description: 'Thêm custom widgets + real-time data' }
    ],
    'mobile-app': [
      { id: 'mobile-standard', name: 'Gói Standard', price: 0, description: 'License cơ bản' },
      { id: 'mobile-unlimited', name: 'Gói Unlimited', price: 150000, description: 'Unlimited users + premium features' }
    ]
  }
  
  // Auto-calculate order totals when products/packages change
  useEffect(() => {
    if (showCreateOrderModal) {
      handleOrderDiscountChange(newOrderData.discountPercent)
    }
  }, [selectedProducts, selectedPackages, showCreateOrderModal])

  const [showFilters, setShowFilters] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [filterIndustry, setFilterIndustry] = useState('')
  const [filterTag, setFilterTag] = useState('')
  const [filterCustomerType, setFilterCustomerType] = useState('')
  const [filterPurchasedProduct, setFilterPurchasedProduct] = useState<string[]>([])
  
  // Advanced filters
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)
  const [showProductDropdown, setShowProductDropdown] = useState(false)
  const [productSearchTerm, setProductSearchTerm] = useState('')
  const [filterRegion, setFilterRegion] = useState('')
  const [filterOrderValue, setFilterOrderValue] = useState({ min: '', max: '' })
  const [filterLastInteraction, setFilterLastInteraction] = useState('')
  const [filterPurchaseDate, setFilterPurchaseDate] = useState({ start: '', end: '' })
  const [filterDepartment, setFilterDepartment] = useState('')
  const [filterTeam, setFilterTeam] = useState('')
  const [filterAssignedPerson, setFilterAssignedPerson] = useState('')
  
  // Quick interaction states
  const [showQuickInteractionModal, setShowQuickInteractionModal] = useState(false)
  const [selectedCustomerForInteraction, setSelectedCustomerForInteraction] = useState<Customer | null>(null)
  const [quickInteractionContent, setQuickInteractionContent] = useState('')
  const [quickInteractionTitle, setQuickInteractionTitle] = useState('')
  const [quickInteractionType, setQuickInteractionType] = useState<'call' | 'email' | 'meeting' | 'note'>('note')
  
  // Edit interaction states
  const [showEditInteractionModal, setShowEditInteractionModal] = useState(false)
  const [editingInteraction, setEditingInteraction] = useState<CustomerInteraction | null>(null)
  const [editInteractionData, setEditInteractionData] = useState({
    title: '',
    summary: '',
    type: 'email' as CustomerInteraction['type'],
    channel: '',
    status: 'success' as CustomerInteraction['status']
  })
  const [editReason, setEditReason] = useState('')
  
  const [showColumnSelector, setShowColumnSelector] = useState(false)
  const [openActionMenu, setOpenActionMenu] = useState<number | null>(null)
  const [visibleColumns, setVisibleColumns] = useState({
    checkbox: true,
    no: true,
    customerName: true,
    phoneNumber: true,
    email: true,
    company: true,
    address: false,
    region: true,
    customerType: true,
    segment: true,
    tags: true,
    source: true,
    accountManager: true,
    status: true,
    lifecycleStage: true,
    totalOrderValue: true,
    orderCount: true,
    lastOrderDate: true,
    averageOrderValue: true,
    lastContactDate: true,
    interactionCount: true,
    createdDate: true,
    customerScore: false,
    npsScore: false,
    actions: true
  })
  const [sortBy, setSortBy] = useState('name')
  const [showRemarketingModal, setShowRemarketingModal] = useState(false)
  const [showAddCustomerModal, setShowAddCustomerModal] = useState(false)
  const [showCustomerFieldSettingsModal, setShowCustomerFieldSettingsModal] = useState(false)
  
  // Customer form field visibility state
  const [customerFormFieldVisibility, setCustomerFormFieldVisibility] = useState({
    phone: true,
    email: true,
    customerName: true,
    company: true,
    position: true,
    industry: true,
    companySize: true,
    website: false,
    address: true,
    source: true,
    region: true,
    assignedTo: true,
    product: true,
    content: true,
    notes: true
  })

  // Customer source options
  const defaultCustomerSourceOptions: CreatableSelectOption[] = [
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

  // Customer industry options
  const defaultCustomerIndustryOptions: CreatableSelectOption[] = [
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

  const [customCustomerSources, setCustomCustomerSources] = useState<CreatableSelectOption[]>([])
  const [customCustomerIndustries, setCustomCustomerIndustries] = useState<CreatableSelectOption[]>([])
  
  const allCustomerSourceOptions = [...defaultCustomerSourceOptions, ...customCustomerSources]
  const allCustomerIndustryOptions = [...defaultCustomerIndustryOptions, ...customCustomerIndustries]

  // Handler to add new customer source
  const handleAddNewCustomerSource = (label: string) => {
    const newValue = label.toLowerCase().replace(/\s+/g, '-')
    const colors = ['bg-cyan-100 text-cyan-700 border-cyan-200', 'bg-emerald-100 text-emerald-700 border-emerald-200', 'bg-amber-100 text-amber-700 border-amber-200']
    const randomColor = colors[customCustomerSources.length % colors.length]
    setCustomCustomerSources(prev => [...prev, { value: newValue, label, color: randomColor }])
  }

  // Handler to add new customer industry
  const handleAddNewCustomerIndustry = (label: string) => {
    const newValue = label.toLowerCase().replace(/\s+/g, '-')
    const colors = ['bg-cyan-100 text-cyan-700 border-cyan-200', 'bg-emerald-100 text-emerald-700 border-emerald-200', 'bg-amber-100 text-amber-700 border-amber-200']
    const randomColor = colors[customCustomerIndustries.length % colors.length]
    setCustomCustomerIndustries(prev => [...prev, { value: newValue, label, color: randomColor }])
  }

  // Currency format helper for customer form
  const formatCustomerCurrencyInput = (value: string): string => {
    const numericValue = value.replace(/\D/g, '')
    if (!numericValue) return ''
    return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
  }

  const handleCustomerEstimatedRevenueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCustomerCurrencyInput(e.target.value)
    setNewCustomerData(prev => ({ ...prev}))
  }

  const [showRankingDefinitionModal, setShowRankingDefinitionModal] = useState(false)
  const [isEditingRanking, setIsEditingRanking] = useState(false)
  const [rankingSettings, setRankingSettings] = useState({
    diamond: {
      totalSpent: 10000000,
      orderCount: 20,
      timeAsCustomer: 24, // months
      discount: '20-30%',
      benefits: ['Ưu đãi độc quyền 20-30%', 'Account Manager riêng', 'Hỗ trợ 24/7 ưu tiên cao', 'Trải nghiệm cá nhân hóa', 'Mời sự kiện VIP']
    },
    gold: {
      totalSpent: 5000000,
      orderCount: 10,
      timeAsCustomer: 12,
      discount: '15-20%',
      benefits: ['Ưu đãi đặc biệt 15-20%', 'Hỗ trợ ưu tiên', 'Trải nghiệm nâng cao', 'Tư vấn chuyên sâu', 'Quà tặng định kỳ']
    },
    silver: {
      totalSpent: 2000000,
      orderCount: 5,
      timeAsCustomer: 6,
      discount: '10-15%',
      benefits: ['Ưu đãi thành viên 10-15%', 'Hỗ trợ nhanh chóng', 'Tích điểm thưởng', 'Newsletter độc quyền', 'Chương trình loyalty']
    },
    bronze: {
      totalSpent: 500000,
      orderCount: 2,
      timeAsCustomer: 3,
      discount: '5-10%',
      benefits: ['Ưu đãi cơ bản 5-10%', 'Hỗ trợ tiêu chuẩn', 'Tích điểm cơ bản', 'Thông tin sản phẩm mới', 'Chăm sóc khách hàng']
    },
    new: {
      totalSpent: 0,
      orderCount: 0,
      timeAsCustomer: 0,
      discount: '0-5%',
      benefits: ['Ưu đãi chào mừng', 'Hướng dẫn sử dụng', 'Hỗ trợ onboarding', 'Tài liệu tham khảo', 'Chăm sóc khách hàng mới']
    }
  })
  const [selectedCustomerIds, setSelectedCustomerIds] = useState<string[]>([])
  const [selectAll, setSelectAll] = useState(false)
  const [showQuickTaskModal, setShowQuickTaskModal] = useState(false)
  const [showExportDropdown, setShowExportDropdown] = useState(false)
  const [quickTaskData, setQuickTaskData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    dueDate: '',
    assignedTo: ''
  })
  
  // Helper function to calculate predicted revenue for customers without it
  const calculatePredictedRevenue = (customer: Customer): number => {
    if (customer.predictedRevenue) return customer.predictedRevenue;
    
    // Simple prediction based on customer data
    const baseRevenue = customer.totalSpent / customer.totalOrders || 0;
    const frequencyMultiplier = Math.max(customer.averageOrderFrequency, 0.1);
    const engagementMultiplier = customer.engagementScore / 100;
    const churnRiskPenalty = (100 - customer.churnRisk) / 100;
    
    return Math.round(baseRevenue * frequencyMultiplier * engagementMultiplier * churnRiskPenalty * 3);
  };

  // Handle checkbox selection functions
  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedCustomerIds([])
      setSelectAll(false)
    } else {
      setSelectedCustomerIds(filteredCustomers.map(customer => customer.id.toString()))
      setSelectAll(true)
    }
  }

  const handleSelectCustomer = (customerId: string) => {
    if (selectedCustomerIds.includes(customerId)) {
      setSelectedCustomerIds(selectedCustomerIds.filter(id => id !== customerId))
      setSelectAll(false)
    } else {
      const newSelected = [...selectedCustomerIds, customerId]
      setSelectedCustomerIds(newSelected)
      if (newSelected.length === filteredCustomers.length) {
        setSelectAll(true)
      }
    }
  }

  // Bulk Actions Functions
  const handleCreateQuickTask = () => {
    const selectedCustomers = customers.filter(customer => 
      selectedCustomerIds.includes(customer.id.toString())
    )
    
    if (selectedCustomers.length === 0) {
      alert('Vui lòng chọn ít nhất một khách hàng')
      return
    }
    
    setShowQuickTaskModal(true)
  }

  const handleSubmitQuickTask = () => {
    const selectedCustomers = customers.filter(customer => 
      selectedCustomerIds.includes(customer.id.toString())
    )
    
    console.log('Tạo task:', {
      ...quickTaskData,
      customerIds: selectedCustomerIds,
      customers: selectedCustomers.map(c => ({ id: c.id, name: c.name, email: c.email }))
    })
    
    alert(`Đã tạo task "${quickTaskData.title}" cho ${selectedCustomers.length} khách hàng`)
    
    // Reset data
    setQuickTaskData({
      title: '',
      description: '',
      priority: 'medium',
      dueDate: '',
      assignedTo: ''
    })
    setSelectedCustomerIds([])
    setSelectAll(false)
    setShowQuickTaskModal(false)
  }

  // Ẩn chức năng gửi email hàng loạt theo yêu cầu
  /* const handleBulkEmail = () => {
    const selectedCustomers = customers.filter(customer => 
      selectedCustomerIds.includes(customer.id.toString())
    )
    
    console.log('Gửi email hàng loạt cho:', selectedCustomers.map(c => c.email))
    alert(`Gửi email hàng loạt cho ${selectedCustomers.length} khách hàng`)
    
    // Reset selection after action
    setSelectedCustomerIds([])
    setSelectAll(false)
  } */
  
  const [newCustomerData, setNewCustomerData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    position: '',
    industry: '',
    companySize: '',
    customerType: 'individual', // Changed from 'bronze' to 'individual'
    status: 'active',
    preferredChannel: 'email',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    notes: '',
    source: 'website', // Added source field
    marketingConsent: false,
    smsConsent: false,
    // Required product fields - now supporting multiple products
    selectedProducts: [] as Array<{
      productId: string,
      productName: string,
      packageId: string,
      packageName: string,
      price: number,
      features: string[]
    }>,
    totalAmount: 0,
    discountPercent: 0,
    paymentMethod: 'cash',
    finalAmount: 0
  })

  // Temporary state for adding new product
  const [tempProduct, setTempProduct] = useState({
    selectedProduct: '',
    selectedPackage: ''
  })

  // Helper functions for product management
  const addProductToCustomer = () => {
    if (!tempProduct.selectedProduct || !tempProduct.selectedPackage) {
      alert('Vui lòng chọn sản phẩm và gói dịch vụ')
      return
    }

    const productData = products.find(p => p.id === tempProduct.selectedProduct)
    const packageData = packages[tempProduct.selectedProduct as keyof typeof packages]?.find(pkg => pkg.id === tempProduct.selectedPackage)
    
    if (!productData || !packageData) return

    // Check if product already exists
    const existingProduct = newCustomerData.selectedProducts.find(p => p.productId === tempProduct.selectedProduct && p.packageId === tempProduct.selectedPackage)
    if (existingProduct) {
      alert('Sản phẩm và gói này đã được thêm')
      return
    }

    const newProduct = {
      productId: tempProduct.selectedProduct,
      productName: productData.name,
      packageId: tempProduct.selectedPackage,
      packageName: packageData.name,
      price: packageData.price,
      features: packageData.features
    }

    const updatedProducts = [...newCustomerData.selectedProducts, newProduct]
    const newTotal = updatedProducts.reduce((sum, product) => sum + product.price, 0)
    const newFinalAmount = newTotal * (100 - newCustomerData.discountPercent) / 100

    setNewCustomerData(prev => ({
      ...prev,
      selectedProducts: updatedProducts,
      totalAmount: newTotal,
      finalAmount: newFinalAmount
    }))

    // Reset temp product
    setTempProduct({
      selectedProduct: '',
      selectedPackage: ''
    })
  }

  const removeProductFromCustomer = (productId: string, packageId: string) => {
    const updatedProducts = newCustomerData.selectedProducts.filter(p => !(p.productId === productId && p.packageId === packageId))
    const newTotal = updatedProducts.reduce((sum, product) => sum + product.price, 0)
    const newFinalAmount = newTotal * (100 - newCustomerData.discountPercent) / 100

    setNewCustomerData(prev => ({
      ...prev,
      selectedProducts: updatedProducts,
      totalAmount: newTotal,
      finalAmount: newFinalAmount
    }))
  }

  // Handle discount change
  const handleDiscountChange = (discount: number) => {
    const newFinalAmount = newCustomerData.totalAmount * (100 - discount) / 100
    setNewCustomerData(prev => ({
      ...prev,
      discountPercent: discount,
      finalAmount: newFinalAmount
    }))
  }

  // Handle payment method change
  const handlePaymentMethodChange = (method: string) => {
    setNewCustomerData(prev => ({
      ...prev,
      paymentMethod: method
    }))
  }

  // Helper functions for ranking settings
  const handleSaveRankingSettings = () => {
    // Here you would normally save to backend
    console.log('Saving ranking settings:', rankingSettings)
    alert('Cài đặt phân hạng đã được lưu thành công!')
    setIsEditingRanking(false)
  }

  const handleCancelEditRanking = () => {
    // Reset to original values if needed
    setIsEditingRanking(false)
  }

  const updateRankingSetting = (tier: string, field: string, value: any) => {
    setRankingSettings(prev => ({
      ...prev,
      [tier]: {
        ...prev[tier as keyof typeof prev],
        [field]: value
      }
    }))
  }

  const addBenefit = (tier: string) => {
    const newBenefit = prompt('Nhập quyền lợi mới:')
    if (newBenefit && newBenefit.trim()) {
      setRankingSettings(prev => ({
        ...prev,
        [tier]: {
          ...prev[tier as keyof typeof prev],
          benefits: [...prev[tier as keyof typeof prev].benefits, newBenefit.trim()]
        }
      }))
    }
  }

  const removeBenefit = (tier: string, benefitIndex: number) => {
    setRankingSettings(prev => ({
      ...prev,
      [tier]: {
        ...prev[tier as keyof typeof prev],
        benefits: prev[tier as keyof typeof prev].benefits.filter((_, index) => index !== benefitIndex)
      }
    }))
  }

  // Helper functions for order payment
  const handleOrderDiscountChange = (discountPercent: number) => {
    const totalAmount = calculateOrderTotal()
    const finalAmount = totalAmount * (1 - discountPercent / 100)
    setNewOrderData(prev => ({
      ...prev,
      discountPercent,
      totalAmount,
      finalAmount
    }))
  }

  const handleOrderPaymentMethodChange = (paymentMethod: string) => {
    setNewOrderData(prev => ({
      ...prev,
      paymentMethod
    }))
  }

  const calculateOrderTotal = () => {
    let total = 0
    selectedProducts.forEach(productId => {
      const product = availableProducts.find(p => p.id === productId)
      if (product) {
        total += product.price
        
        const packageId = selectedPackages[productId]
        if (packageId) {
          const packageData = availablePackages[productId as keyof typeof availablePackages]?.find(pkg => pkg.id === packageId)
          if (packageData) {
            total += packageData.price
          }
        }
      }
    })
    return total
  }
  
  // Product and package data
  const products = [
    { id: 'crm', name: 'CRM System', description: 'Hệ thống quản lý khách hàng' },
    { id: 'marketing', name: 'Marketing Automation', description: 'Tự động hóa marketing' },
    { id: 'sales', name: 'Sales Management', description: 'Quản lý bán hàng' },
    { id: 'support', name: 'Customer Support', description: 'Hỗ trợ khách hàng' }
  ]

  const packages = {
    crm: [
      { id: 'basic', name: 'Gói Cơ Bản', price: 500000, features: ['Quản lý 100 khách hàng', 'Báo cáo cơ bản'] },
      { id: 'pro', name: 'Gói Chuyên Nghiệp', price: 1000000, features: ['Quản lý 500 khách hàng', 'Báo cáo nâng cao', 'Tích hợp API'] },
      { id: 'enterprise', name: 'Gói Doanh Nghiệp', price: 2000000, features: ['Quản lý không giới hạn', 'Báo cáo tùy chỉnh', 'Hỗ trợ 24/7'] }
    ],
    marketing: [
      { id: 'starter', name: 'Gói Khởi Đầu', price: 300000, features: ['Email marketing', '1000 contacts'] },
      { id: 'growth', name: 'Gói Phát Triển', price: 800000, features: ['Email + SMS', '5000 contacts', 'A/B testing'] },
      { id: 'scale', name: 'Gói Mở Rộng', price: 1500000, features: ['Omnichannel', 'Unlimited contacts', 'Advanced automation'] }
    ],
    sales: [
      { id: 'essential', name: 'Gói Thiết Yếu', price: 400000, features: ['Pipeline management', '3 users'] },
      { id: 'professional', name: 'Gói Chuyên Nghiệp', price: 900000, features: ['Advanced pipeline', '10 users', 'Forecasting'] },
      { id: 'ultimate', name: 'Gói Tối Ưu', price: 1800000, features: ['Complete sales suite', 'Unlimited users', 'AI insights'] }
    ],
    support: [
      { id: 'basic', name: 'Gói Cơ Bản', price: 200000, features: ['Ticket system', '2 agents'] },
      { id: 'standard', name: 'Gói Tiêu Chuẩn', price: 600000, features: ['Multi-channel support', '5 agents', 'Knowledge base'] },
      { id: 'premium', name: 'Gói Cao Cấp', price: 1200000, features: ['Complete support suite', '15 agents', 'Live chat', 'Phone support'] }
    ]
  }

  // Sample customer data
  const [customers] = useState<Customer[]>([
    {
      id: 1,
      name: 'Nguyễn Văn An',
      firstName: 'An',
      lastName: 'Nguyễn Văn',
      contact: '0901234567',
      email: 'nguyen.van.an@company.com',
      secondaryEmail: 'an.nguyen@personal.com',
      company: 'Tech Solutions Ltd',
      companySize: 'large',
      industry: 'Công nghệ',
      position: 'CEO',
      department: 'Điều hành',
      status: 'vip',
      customerType: 'diamond',
      tags: [
        { id: '1', name: 'VIP', color: 'bg-purple-100 text-purple-800', category: 'value' },
        { id: '2', name: 'Khách hàng lâu năm', color: 'bg-blue-100 text-blue-800', category: 'engagement' }
      ],
      totalValue: '2,500,000',
      lifetimeValue: '15,000,000',
      averageOrderValue: '500,000',
      lastOrderDate: '2024-01-20',
      lastInteraction: '2024-01-22',
      daysSinceLastInteraction: 2,
      engagementScore: 95,
      churnRisk: 5,
      loyaltyPoints: 2500,
      preferredChannel: 'email',
      dateOfBirth: '1985-07-15',
      gender: 'male',
      maritalStatus: 'married',
      address: '123 Đường Nguyễn Huệ',
      city: 'Hà Nội',
      state: 'Hà Nội',
      country: 'Việt Nam',
      postalCode: '100000',
      phone2: '0901234568',
      website: 'https://techsolutions.com',
      socialMedia: {
        linkedin: 'https://linkedin.com/in/nguyen-van-an',
        facebook: 'https://facebook.com/nguyenvanan'
      },
      taxId: '0123456789',
      creditLimit: 5000000,
      paymentTerms: '30 ngày',
      currency: 'VND',
      taxExempt: false,
      preferences: {
        communicationFrequency: 'weekly',
        marketingConsent: true,
        newsletter: true,
        smsConsent: true,
        language: 'vi',
        timezone: 'Asia/Ho_Chi_Minh',
        communicationHours: {
          start: '08:00',
          end: '18:00'
        }
      },
      assignedSalesRep: 'Lê Thị Mai',
      accountManager: 'Trần Văn Hùng',
      customerSince: '2023-01-15',
      firstPurchaseDate: '2023-01-20',
      lastPurchaseDate: '2024-01-20',
      totalOrders: 25,
      totalSpent: 15000000,
      averageOrderFrequency: 2,
      predictedRevenue: 3500000,
      supportTickets: 3,
      supportPriority: 'high',
      notes: [],
      internalNotes: 'Có thể nâng cấp lên gói Enterprise',
      createdAt: '2023-01-15',
      updatedAt: '2024-01-22',
      createdBy: 'admin',
      updatedBy: 'sales_manager',
      isDeleted: false,
      interactions: [
        {
          id: '1',
          type: 'call',
          channel: 'Phone',
          title: 'Tư vấn nâng cấp hệ thống',
          summary: 'Khách hàng quan tâm đến package Enterprise',
          date: '2024-01-22',
          status: 'success'
        }
      ],
      products: [
        {
          id: '1',
          name: 'CRM Enterprise',
          category: 'Software',
          purchaseDate: '2024-01-20',
          quantity: 1,
          price: 2500000,
          status: 'active'
        },
        {
          id: '2',
          name: 'AI Analytics Module',
          category: 'Add-on',
          purchaseDate: '2023-12-15',
          quantity: 1,
          price: 1200000,
          status: 'active'
        },
        {
          id: '3',
          name: 'Marketing Automation',
          category: 'Software',
          purchaseDate: '2023-11-10',
          quantity: 1,
          price: 800000,
          status: 'active'
        }
      ],
      remarketing: {
        eligible: false,
        priority: 'low',
        lastCampaign: '2024-01-01',
        campaigns: []
      }
    },
    {
      id: 2,
      name: 'Trần Thị Bình',
      firstName: 'Bình',
      lastName: 'Trần Thị',
      contact: '0912345678',
      email: 'tran.thi.binh@startup.vn',
      company: 'Startup Innovation',
      companySize: 'medium',
      industry: 'IT Services',
      position: 'CTO',
      department: 'Công nghệ',
      status: 'active',
      customerType: 'gold',
      tags: [
        { id: '3', name: 'Tiềm năng cao', color: 'bg-green-100 text-green-800', category: 'value' },
        { id: '4', name: 'Startup', color: 'bg-orange-100 text-orange-800', category: 'behavior' }
      ],
      totalValue: '1,200,000',
      lifetimeValue: '3,600,000',
      averageOrderValue: '300,000',
      lastOrderDate: '2024-01-18',
      lastInteraction: '2024-01-20',
      daysSinceLastInteraction: 4,
      engagementScore: 78,
      churnRisk: 15,
      loyaltyPoints: 1200,
      preferredChannel: 'chat',
      dateOfBirth: '1990-07-22',
      gender: 'female',
      maritalStatus: 'single',
      address: '456 Đường Lê Lợi',
      city: 'TP.HCM',
      state: 'TP.HCM',
      country: 'Việt Nam',
      postalCode: '700000',
      website: 'https://startupinnovation.vn',
      socialMedia: {
        linkedin: 'https://linkedin.com/in/tran-thi-binh',
        twitter: 'https://twitter.com/tranthibibh'
      },
      creditLimit: 2000000,
      paymentTerms: '15 ngày',
      currency: 'VND',
      taxExempt: false,
      preferences: {
        communicationFrequency: 'monthly',
        marketingConsent: true,
        newsletter: true,
        smsConsent: false,
        language: 'vi',
        timezone: 'Asia/Ho_Chi_Minh',
        communicationHours: {
          start: '09:00',
          end: '17:00'
        }
      },
      assignedSalesRep: 'Phạm Minh Tuấn',
      customerSince: '2023-06-10',
      firstPurchaseDate: '2023-06-15',
      lastPurchaseDate: '2024-01-18',
      totalOrders: 12,
      totalSpent: 3600000,
      averageOrderFrequency: 1,
      predictedRevenue: 800000,
      supportTickets: 1,
      supportPriority: 'medium',
      notes: [],
      createdAt: '2023-06-10',
      updatedAt: '2024-01-20',
      createdBy: 'sales_rep',
      updatedBy: 'sales_rep',
      isDeleted: false,
      interactions: [
        {
          id: '2',
          type: 'email',
          channel: 'Email',
          title: 'Proposal mới về AI Solutions',
          summary: 'Gửi proposal tích hợp AI vào sản phẩm hiện tại',
          date: '2024-01-20',
          status: 'pending'
        }
      ],
      products: [
        {
          id: '4',
          name: 'CRM Startup',
          category: 'Software',
          purchaseDate: '2024-01-18',
          quantity: 1,
          price: 800000,
          status: 'active'
        },
        {
          id: '5',
          name: 'Lead Management',
          category: 'Module',
          purchaseDate: '2023-12-20',
          quantity: 1,
          price: 400000,
          status: 'active'
        }
      ],
      remarketing: {
        eligible: true,
        priority: 'medium',
        lastCampaign: '2023-12-15',
        suggestedActions: [
          'Gửi email về sản phẩm AI mới với ưu đãi 15%',
          'Mời tham gia webinar về công nghệ mới',
          'Liên hệ qua điện thoại để tư vấn trực tiếp'
        ],
        bestTimeToContact: '9:00-11:00 AM (Thứ 2-5)',
        campaigns: [
          {
            id: 'c1',
            name: 'AI Solutions Campaign',
            type: 'email',
            status: 'sent',
            sentAt: '2023-12-15',
            openRate: 85,
            clickRate: 12
          }
        ]
      }
    },
    {
      id: 3,
      name: 'Lê Minh Cường',
      firstName: 'Cường',
      lastName: 'Lê Minh',
      contact: '0923456789',
      email: 'le.minh.cuong@manufacturing.com',
      company: 'Manufacturing Corp',
      companySize: 'enterprise',
      industry: 'Sản xuất',
      position: 'Giám đốc IT',
      department: 'IT',
      status: 'at-risk',
      customerType: 'silver',
      tags: [
        { id: '5', name: 'Rủi ro cao', color: 'bg-red-100 text-red-800', category: 'risk' },
        { id: '6', name: 'Khó liên lạc', color: 'bg-gray-100 text-gray-800', category: 'engagement' }
      ],
      totalValue: '800,000',
      lifetimeValue: '2,400,000',
      averageOrderValue: '400,000',
      lastOrderDate: '2023-11-15',
      lastInteraction: '2023-12-01',
      daysSinceLastInteraction: 54,
      engagementScore: 32,
      churnRisk: 75,
      loyaltyPoints: 400,
      preferredChannel: 'phone',
      dateOfBirth: '1978-07-25',
      gender: 'male',
      maritalStatus: 'married',
      address: '789 Đường Trần Phú',
      city: 'Đà Nẵng',
      state: 'Đà Nẵng',
      country: 'Việt Nam',
      postalCode: '550000',
      phone2: '0923456788',
      website: 'https://manufacturingcorp.vn',
      creditLimit: 1500000,
      paymentTerms: '45 ngày',
      currency: 'VND',
      taxExempt: true,
      preferences: {
        communicationFrequency: 'quarterly',
        marketingConsent: false,
        newsletter: false,
        smsConsent: false,
        language: 'vi',
        timezone: 'Asia/Ho_Chi_Minh',
        communicationHours: {
          start: '07:00',
          end: '16:00'
        }
      },
      assignedSalesRep: 'Nguyễn Thị Lan',
      customerSince: '2023-03-20',
      firstPurchaseDate: '2023-04-01',
      lastPurchaseDate: '2023-11-15',
      totalOrders: 6,
      totalSpent: 2400000,
      averageOrderFrequency: 0.5,
      predictedRevenue: 600000,
      supportTickets: 8,
      supportPriority: 'high',
      notes: [],
      internalNotes: 'Có vấn đề về thanh toán, cần theo dõi',
      createdAt: '2023-03-20',
      updatedAt: '2023-12-01',
      createdBy: 'sales_rep',
      updatedBy: 'account_manager',
      isDeleted: false,
      interactions: [
        {
          id: '3',
          type: 'call',
          channel: 'Phone',
          title: 'Cuộc gọi chăm sóc khách hàng',
          summary: 'Không liên lạc được, để lại voicemail',
          date: '2023-12-01',
          status: 'failed'
        }
      ],
      products: [
        {
          id: '6',
          name: 'ERP Manufacturing',
          category: 'Software',
          purchaseDate: '2023-11-15',
          quantity: 1,
          price: 800000,
          status: 'active'
        }
      ],
      remarketing: {
        eligible: true,
        priority: 'high',
        lastCampaign: '2024-01-10',
        suggestedActions: [
          'Gửi ưu đãi đặc biệt 20% cho đơn hàng tiếp theo',
          'Liên hệ trực tiếp để tìm hiểu nguyên nhân không hoạt động',
          'Gửi survey để thu thập feedback'
        ],
        bestTimeToContact: '2:00-4:00 PM (Thứ 3, 5)',
        campaigns: [
          {
            id: 'c2',
            name: 'Win-back Campaign',
            type: 'email',
            status: 'sent',
            sentAt: '2024-01-10',
            openRate: 45,
            clickRate: 3
          }
        ]
      }
    },
    {
      id: 4,
      name: 'Phạm Thanh Hoa',
      firstName: 'Hoa',
      lastName: 'Phạm Thanh',
      contact: '0934567890',
      email: 'pham.thanh.hoa@retail.com',
      company: 'Retail Solutions',
      companySize: 'small',
      industry: 'Bán lẻ',
      position: 'Chủ cửa hàng',
      department: 'Kinh doanh',
      status: 'active',
      customerType: 'bronze',
      tags: [
        { id: '7', name: 'Khách hàng mới', color: 'bg-blue-100 text-blue-800', category: 'value' }
      ],
      totalValue: '450,000',
      lifetimeValue: '450,000',
      averageOrderValue: '150,000',
      lastOrderDate: '2024-01-15',
      lastInteraction: '2024-01-16',
      daysSinceLastInteraction: 8,
      engagementScore: 65,
      churnRisk: 25,
      loyaltyPoints: 150,
      preferredChannel: 'phone',
      dateOfBirth: '1988-05-20',
      gender: 'female',
      maritalStatus: 'married',
      address: '321 Đường Hai Bà Trưng',
      city: 'Hải Phòng',
      state: 'Hải Phòng',
      country: 'Việt Nam',
      postalCode: '180000',
      creditLimit: 500000,
      paymentTerms: '7 ngày',
      currency: 'VND',
      taxExempt: false,
      preferences: {
        communicationFrequency: 'weekly',
        marketingConsent: true,
        newsletter: true,
        smsConsent: true,
        language: 'vi',
        timezone: 'Asia/Ho_Chi_Minh',
        communicationHours: {
          start: '08:00',
          end: '20:00'
        }
      },
      assignedSalesRep: 'Vũ Thị Nga',
      customerSince: '2023-12-01',
      firstPurchaseDate: '2023-12-05',
      lastPurchaseDate: '2024-01-15',
      totalOrders: 3,
      totalSpent: 450000,
      averageOrderFrequency: 1,
      supportTickets: 0,
      supportPriority: 'low',
      notes: [],
      createdAt: '2023-12-01',
      updatedAt: '2024-01-16',
      createdBy: 'sales_rep',
      updatedBy: 'sales_rep',
      isDeleted: false,
      interactions: [],
      products: [
        {
          id: '6',
          name: 'CRM Basic',
          category: 'Software',
          purchaseDate: '2024-01-15',
          quantity: 1,
          price: 450000,
          status: 'active'
        }
      ],
      remarketing: {
        eligible: false,
        priority: 'low',
        lastCampaign: '',
        campaigns: []
      }
    },
    {
      id: 5,
      name: 'Hoàng Minh Đức',
      firstName: 'Đức',
      lastName: 'Hoàng Minh',
      contact: '0945678901',
      email: 'hoang.minh.duc@finance.vn',
      company: 'Finance Group',
      companySize: 'large',
      industry: 'Tài chính',
      position: 'Giám đốc Tài chính',
      department: 'Tài chính',
      status: 'inactive',
      customerType: 'inactive',
      tags: [
        { id: '8', name: 'Không quay lại', color: 'bg-gray-100 text-gray-800', category: 'risk' }
      ],
      totalValue: '0',
      lifetimeValue: '5,200,000',
      averageOrderValue: '650,000',
      lastOrderDate: '2023-08-15',
      lastInteraction: '2023-09-10',
      daysSinceLastInteraction: 136,
      engagementScore: 15,
      churnRisk: 95,
      loyaltyPoints: 0,
      preferredChannel: 'email',
      dateOfBirth: '1975-11-30',
      gender: 'male',
      maritalStatus: 'divorced',
      address: '654 Đường Đồng Khởi',
      city: 'TP.HCM',
      state: 'TP.HCM',
      country: 'Việt Nam',
      postalCode: '700000',
      creditLimit: 0,
      paymentTerms: 'Thanh toán ngay',
      currency: 'VND',
      taxExempt: false,
      preferences: {
        communicationFrequency: 'monthly',
        marketingConsent: false,
        newsletter: false,
        smsConsent: false,
        language: 'vi',
        timezone: 'Asia/Ho_Chi_Minh',
        communicationHours: {
          start: '09:00',
          end: '17:00'
        }
      },
      assignedSalesRep: 'Đỗ Văn Minh',
      customerSince: '2022-05-10',
      firstPurchaseDate: '2022-05-15',
      lastPurchaseDate: '2023-08-15',
      totalOrders: 8,
      totalSpent: 5200000,
      averageOrderFrequency: 0.5,
      supportTickets: 2,
      supportPriority: 'low',
      notes: [],
      internalNotes: 'Chuyển sang đối thủ cạnh tranh',
      createdAt: '2022-05-10',
      updatedAt: '2023-09-10',
      createdBy: 'sales_manager',
      updatedBy: 'sales_rep',
      isDeleted: false,
      interactions: [],
      products: [
        {
          id: '7',
          name: 'CRM Enterprise',
          category: 'Software',
          purchaseDate: '2022-05-15',
          quantity: 1,
          price: 2000000,
          status: 'expired'
        },
        {
          id: '8',
          name: 'Financial Analytics',
          category: 'Module',
          purchaseDate: '2022-08-20',
          quantity: 1,
          price: 1500000,
          status: 'expired'
        },
        {
          id: '9',
          name: 'Reporting Dashboard',
          category: 'Add-on',
          purchaseDate: '2023-01-10',
          quantity: 1,
          price: 800000,
          status: 'expired'
        }
      ],
      remarketing: {
        eligible: true,
        priority: 'high',
        lastCampaign: '2023-11-01',
        suggestedActions: [
          'Gửi thông báo về gói dịch vụ mới với giá ưu đãi',
          'Mời thử nghiệm miễn phí trong 30 ngày',
          'Liên hệ để tư vấn nâng cấp gói dịch vụ'
        ],
        bestTimeToContact: '10:00 AM-12:00 PM (Thứ 2, 4, 6)',
        campaigns: [
          {
            id: 'c3',
            name: 'Reactivation Campaign',
            type: 'email',
            status: 'sent',
            sentAt: '2023-11-01',
            openRate: 25,
            clickRate: 0
          }
        ]
      }
    },
    {
      id: 5.5,
      name: 'Đặng Văn Minh',
      firstName: 'Minh',
      lastName: 'Đặng Văn',
      contact: '0945678901',
      email: 'dangvanminh@gmail.com',
      company: '', // Cá nhân - không có công ty
      industry: 'Technology',
      position: 'Freelancer',
      department: '',
      companySize: 'small',
      status: 'active',
      customerType: 'bronze',
      tags: [
        { id: '10', name: 'Cá nhân', color: 'bg-green-100 text-green-800', category: 'value' },
        { id: '11', name: 'Freelancer', color: 'bg-yellow-100 text-yellow-800', category: 'behavior' }
      ],
      totalValue: '750,000',
      lifetimeValue: '750,000',
      averageOrderValue: '250,000',
      lastOrderDate: '2024-01-10',
      lastInteraction: '2024-01-12',
      daysSinceLastInteraction: 12,
      engagementScore: 72,
      churnRisk: 20,
      loyaltyPoints: 200,
      preferredChannel: 'email',
      dateOfBirth: '1992-03-18',
      gender: 'male',
      maritalStatus: 'single',
      address: '789 Đường Cầu Giấy',
      city: 'Hà Nội',
      state: 'Hà Nội',
      country: 'Việt Nam',
      postalCode: '100000',
      phone2: '',
      website: 'https://dangvanminh.dev',
      socialMedia: {
        linkedin: 'https://linkedin.com/in/dangvanminh'
      },
      taxId: '',
      creditLimit: 1000000,
      paymentTerms: 'Thanh toán ngay',
      currency: 'VND',
      taxExempt: false,
      preferences: {
        communicationFrequency: 'monthly',
        marketingConsent: true,
        newsletter: true,
        smsConsent: false,
        language: 'vi',
        timezone: 'Asia/Ho_Chi_Minh',
        communicationHours: {
          start: '09:00',
          end: '21:00'
        }
      },
      assignedSalesRep: 'Nguyễn Thị Lan',
      customerSince: '2023-10-05',
      firstPurchaseDate: '2023-10-08',
      lastPurchaseDate: '2024-01-10',
      totalOrders: 3,
      totalSpent: 750000,
      averageOrderFrequency: 1.2,
      supportTickets: 0,
      supportPriority: 'medium',
      notes: [],
      createdAt: '2023-10-05',
      updatedAt: '2024-01-12',
      createdBy: 'online_form',
      updatedBy: 'sales_rep',
      isDeleted: false,
      interactions: [
        {
          id: '5',
          type: 'email',
          channel: 'Email',
          title: 'Hỏi về gói thiết kế web',
          summary: 'Quan tâm đến tools thiết kế website responsive',
          date: '2024-01-12',
          status: 'success'
        }
      ],
      products: [
        {
          id: '10',
          name: 'Design Tools Basic',
          category: 'Software',
          purchaseDate: '2023-10-08',
          quantity: 1,
          price: 250000,
          status: 'active'
        }
      ],
      remarketing: {
        eligible: false,
        priority: 'medium',
        lastCampaign: '',
        campaigns: []
      }
    },
    {
      id: 5.6,
      name: 'Lý Thị Hương',
      firstName: 'Hương',
      lastName: 'Lý Thị',
      contact: '0987654321',
      email: 'lythihuong88@hotmail.com',
      company: '', // Cá nhân - không có công ty
      industry: 'Education',
      position: 'Teacher',
      department: '',
      companySize: 'small',
      status: 'active',
      customerType: 'silver',
      tags: [
        { id: '12', name: 'Giáo dục', color: 'bg-blue-100 text-blue-800', category: 'value' },
        { id: '13', name: 'Khách quen', color: 'bg-purple-100 text-purple-800', category: 'engagement' }
      ],
      totalValue: '1,200,000',
      lifetimeValue: '1,800,000',
      averageOrderValue: '300,000',
      lastOrderDate: '2024-01-05',
      lastInteraction: '2024-01-07',
      daysSinceLastInteraction: 17,
      engagementScore: 85,
      churnRisk: 10,
      loyaltyPoints: 600,
      preferredChannel: 'phone',
      dateOfBirth: '1988-11-25',
      gender: 'female',
      maritalStatus: 'married',
      address: '234 Đường Lý Thường Kiệt',
      city: 'Đà Nẵng',
      state: 'Đà Nẵng',
      country: 'Việt Nam',
      postalCode: '550000',
      phone2: '0234567890',
      socialMedia: {
        facebook: 'https://facebook.com/lythihuong88'
      },
      taxId: '',
      creditLimit: 2000000,
      paymentTerms: '15 ngày',
      currency: 'VND',
      taxExempt: false,
      preferences: {
        communicationFrequency: 'weekly',
        marketingConsent: true,
        newsletter: true,
        smsConsent: true,
        language: 'vi',
        timezone: 'Asia/Ho_Chi_Minh',
        communicationHours: {
          start: '07:00',
          end: '19:00'
        }
      },
      assignedSalesRep: 'Trần Văn Đức',
      customerSince: '2023-05-20',
      firstPurchaseDate: '2023-05-25',
      lastPurchaseDate: '2024-01-05',
      totalOrders: 6,
      totalSpent: 1800000,
      averageOrderFrequency: 2,
      supportTickets: 1,
      supportPriority: 'high',
      notes: [],
      createdAt: '2023-05-20',
      updatedAt: '2024-01-07',
      createdBy: 'facebook_lead',
      updatedBy: 'sales_rep',
      isDeleted: false,
      interactions: [
        {
          id: '6',
          type: 'call',
          channel: 'Điện thoại',
          title: 'Tư vấn phần mềm học tập',
          summary: 'Hỏi về tính năng mới cho phần mềm toán học lớp 5',
          date: '2024-01-07',
          status: 'success'
        }
      ],
      products: [
        {
          id: '13',
          name: 'Toán học tiểu học',
          category: 'Educational Software',
          purchaseDate: '2023-05-25',
          quantity: 1,
          price: 400000,
          status: 'active'
        }
      ],
      remarketing: {
        eligible: false,
        priority: 'low',
        lastCampaign: '',
        campaigns: []
      }
    },
    {
      id: 6,
      name: 'Ngô Thị Linh',
      firstName: 'Linh',
      lastName: 'Ngô Thị',
      contact: '0956789012',
      email: 'ngo.thi.linh@education.edu.vn',
      company: 'Education Institute',
      companySize: 'medium',
      industry: 'Giáo dục',
      position: 'Hiệu trưởng',
      department: 'Điều hành',
      status: 'active',
      customerType: 'returning',
      tags: [
        { id: '9', name: 'Khách hàng quay lại', color: 'bg-green-100 text-green-800', category: 'value' },
        { id: '10', name: 'Giáo dục', color: 'bg-indigo-100 text-indigo-800', category: 'behavior' }
      ],
      totalValue: '850,000',
      lifetimeValue: '1,700,000',
      averageOrderValue: '425,000',
      lastOrderDate: '2024-01-10',
      lastInteraction: '2024-01-23',
      daysSinceLastInteraction: 1,
      engagementScore: 85,
      churnRisk: 10,
      loyaltyPoints: 0,
      preferredChannel: 'email',
      dateOfBirth: '1982-09-12',
      gender: 'female',
      maritalStatus: 'married',
      address: '987 Đường Lý Thường Kiệt',
      city: 'Cần Thơ',
      state: 'Cần Thơ',
      country: 'Việt Nam',
      postalCode: '900000',
      creditLimit: 1000000,
      paymentTerms: '30 ngày',
      currency: 'VND',
      taxExempt: true,
      preferences: {
        communicationFrequency: 'weekly',
        marketingConsent: true,
        newsletter: true,
        smsConsent: false,
        language: 'vi',
        timezone: 'Asia/Ho_Chi_Minh',
        communicationHours: {
          start: '08:00',
          end: '17:00'
        }
      },
      assignedSalesRep: 'Lý Hoàng Nam',
      customerSince: '2024-01-20',
      firstPurchaseDate: '',
      lastPurchaseDate: '',
      totalOrders: 0,
      totalSpent: 0,
      averageOrderFrequency: 0,
      supportTickets: 0,
      supportPriority: 'medium',
      notes: [],
      createdAt: '2023-08-20',
      updatedAt: '2024-01-23',
      createdBy: 'sales_rep',
      updatedBy: 'sales_rep',
      isDeleted: false,
      interactions: [
        {
          id: '4',
          type: 'email',
          channel: 'Email',
          title: 'Gia hạn hợp đồng thành công',
          summary: 'Khách hàng đồng ý gia hạn thêm 1 năm',
          date: '2024-01-23',
          status: 'success'
        }
      ],
      products: [
        {
          id: '10',
          name: 'CRM Education',
          category: 'Software',
          purchaseDate: '2024-01-10',
          quantity: 1,
          price: 600000,
          status: 'active'
        },
        {
          id: '11',
          name: 'Student Management',
          category: 'Module',
          purchaseDate: '2023-12-15',
          quantity: 1,
          price: 250000,
          status: 'active'
        }
      ],
      remarketing: {
        eligible: false,
        priority: 'low',
        lastCampaign: '',
        campaigns: []
      }
    },
    {
      id: 7,
      name: 'Vũ Văn Khoa',
      firstName: 'Khoa',
      lastName: 'Vũ Văn',
      contact: '0967890123',
      email: 'vu.van.khoa@trading.com',
      company: 'Trading Company',
      companySize: 'medium',
      industry: 'Thương mại',
      position: 'Giám đốc Kinh doanh',
      department: 'Kinh doanh',
      status: 'churned',
      customerType: 'inactive',
      tags: [
        { id: '11', name: 'Đã churn', color: 'bg-red-100 text-red-800', category: 'risk' },
        { id: '12', name: 'Cạnh tranh', color: 'bg-orange-100 text-orange-800', category: 'risk' }
      ],
      totalValue: '0',
      lifetimeValue: '3,800,000',
      averageOrderValue: '475,000',
      lastOrderDate: '2023-07-20',
      lastInteraction: '2023-08-15',
      daysSinceLastInteraction: 162,
      engagementScore: 8,
      churnRisk: 100,
      loyaltyPoints: 0,
      preferredChannel: 'phone',
      dateOfBirth: '1980-07-02',
      gender: 'male',
      maritalStatus: 'married',
      address: '147 Đường Nguyễn Trãi',
      city: 'Hà Nội',
      state: 'Hà Nội',
      country: 'Việt Nam',
      postalCode: '100000',
      creditLimit: 0,
      paymentTerms: 'Đã hủy',
      currency: 'VND',
      taxExempt: false,
      preferences: {
        communicationFrequency: 'monthly',
        marketingConsent: false,
        newsletter: false,
        smsConsent: false,
        language: 'vi',
        timezone: 'Asia/Ho_Chi_Minh',
        communicationHours: {
          start: '09:00',
          end: '17:00'
        }
      },
      assignedSalesRep: 'Nguyễn Thị Hương',
      customerSince: '2022-03-10',
      firstPurchaseDate: '2022-03-15',
      lastPurchaseDate: '2023-07-20',
      totalOrders: 8,
      totalSpent: 3800000,
      averageOrderFrequency: 0.5,
      supportTickets: 5,
      supportPriority: 'low',
      notes: [],
      internalNotes: 'Không thể giữ chân, giá cả không cạnh tranh',
      createdAt: '2022-03-10',
      updatedAt: '2023-08-15',
      createdBy: 'sales_manager',
      updatedBy: 'sales_rep',
      isDeleted: false,
      interactions: [
        {
          id: '5',
          type: 'call',
          channel: 'Phone',
          title: 'Cuộc gọi thông báo hủy',
          summary: 'Khách hàng thông báo chuyển sang nhà cung cấp khác',
          date: '2023-08-15',
          status: 'success'
        }
      ],
      products: [
        {
          id: '12',
          name: 'CRM Professional',
          category: 'Software',
          purchaseDate: '2022-03-15',
          quantity: 1,
          price: 1800000,
          status: 'cancelled'
        },
        {
          id: '13',
          name: 'Sales Analytics',
          category: 'Module',
          purchaseDate: '2022-08-10',
          quantity: 1,
          price: 1200000,
          status: 'cancelled'
        }
      ],
      remarketing: {
        eligible: true,
        priority: 'high',
        lastCampaign: '2023-10-01',
        campaigns: [
          {
            id: 'c4',
            name: 'Win-back Premium',
            type: 'email',
            status: 'sent',
            sentAt: '2023-10-01',
            openRate: 15,
            clickRate: 0
          }
        ]
      }
    },
    {
      id: 8,
      name: 'Đặng Thị Mai',
      firstName: 'Mai',
      lastName: 'Đặng Thị',
      contact: '0978901234',
      email: 'dang.thi.mai@logistics.vn',
      company: 'Logistics Solutions',
      companySize: 'large',
      industry: 'Vận tải',
      position: 'Giám đốc Vận hành',
      department: 'Vận hành',
      status: 'dormant',
      customerType: 'silver',
      tags: [
        { id: '13', name: 'Tạm ngưng', color: 'bg-gray-100 text-gray-800', category: 'risk' },
        { id: '14', name: 'Mùa vụ', color: 'bg-blue-100 text-blue-800', category: 'behavior' }
      ],
      totalValue: '0',
      lifetimeValue: '6,500,000',
      averageOrderValue: '1,300,000',
      lastOrderDate: '2023-10-30',
      lastInteraction: '2023-12-20',
      daysSinceLastInteraction: 35,
      engagementScore: 45,
      churnRisk: 55,
      loyaltyPoints: 650,
      preferredChannel: 'email',
      dateOfBirth: '1983-08-25',
      gender: 'female',
      maritalStatus: 'married',
      address: '258 Đường Cách Mang Tháng 8',
      city: 'TP.HCM',
      state: 'TP.HCM',
      country: 'Việt Nam',
      postalCode: '700000',
      creditLimit: 2000000,
      paymentTerms: '60 ngày',
      currency: 'VND',
      taxExempt: false,
      preferences: {
        communicationFrequency: 'monthly',
        marketingConsent: true,
        newsletter: true,
        smsConsent: false,
        language: 'vi',
        timezone: 'Asia/Ho_Chi_Minh',
        communicationHours: {
          start: '07:00',
          end: '18:00'
        }
      },
      assignedSalesRep: 'Bùi Văn Tấn',
      customerSince: '2022-01-20',
      firstPurchaseDate: '2022-02-10',
      lastPurchaseDate: '2023-10-30',
      totalOrders: 5,
      totalSpent: 6500000,
      averageOrderFrequency: 0.3,
      supportTickets: 2,
      supportPriority: 'medium',
      notes: [],
      internalNotes: 'Dự kiến sẽ quay lại Q1/2024',
      createdAt: '2022-01-20',
      updatedAt: '2023-12-20',
      createdBy: 'sales_rep',
      updatedBy: 'account_manager',
      isDeleted: false,
      interactions: [
        {
          id: '6',
          type: 'meeting',
          channel: 'In-person',
          title: 'Họp đánh giá năm 2023',
          summary: 'Khách hàng tạm ngưng do khó khăn tài chính',
          date: '2023-12-20',
          status: 'success'
        }
      ],
      products: [
        {
          id: '14',
          name: 'Logistics Management',
          category: 'Software',
          purchaseDate: '2023-10-30',
          quantity: 1,
          price: 2500000,
          status: 'active'
        },
        {
          id: '15',
          name: 'Fleet Tracking',
          category: 'Module',
          purchaseDate: '2023-03-20',
          quantity: 1,
          price: 1800000,
          status: 'active'
        }
      ],
      remarketing: {
        eligible: true,
        priority: 'medium',
        lastCampaign: '2024-01-15',
        campaigns: [
          {
            id: 'c5',
            name: 'New Year Campaign',
            type: 'email',
            status: 'sent',
            sentAt: '2024-01-15',
            openRate: 68,
            clickRate: 8
          }
        ]
      }
    },
    {
      id: 9,
      name: 'Bùi Thị Lan',
      firstName: 'Lan',
      lastName: 'Bùi Thị',
      contact: '0989012345',
      email: 'bui.thi.lan@healthcare.vn',
      company: 'Healthcare Solutions',
      companySize: 'large',
      industry: 'Y tế',
      position: 'Giám đốc Y khoa',
      department: 'Y khoa',
      status: 'vip',
      customerType: 'diamond',
      tags: [
        { id: '15', name: 'VIP', color: 'bg-purple-100 text-purple-800', category: 'value' },
        { id: '16', name: 'Y tế', color: 'bg-green-100 text-green-800', category: 'behavior' }
      ],
      totalValue: '3,200,000',
      lifetimeValue: '18,500,000',
      averageOrderValue: '800,000',
      lastOrderDate: '2024-01-21',
      lastInteraction: '2024-01-24',
      daysSinceLastInteraction: 0,
      engagementScore: 98,
      churnRisk: 2,
      loyaltyPoints: 3200,
      preferredChannel: 'email',
      dateOfBirth: '1977-06-18',
      gender: 'female',
      maritalStatus: 'married',
      address: '159 Đường Pasteur',
      city: 'TP.HCM',
      state: 'TP.HCM',
      country: 'Việt Nam',
      postalCode: '700000',
      phone2: '0989012346',
      website: 'https://healthcaresolutions.vn',
      socialMedia: {
        linkedin: 'https://linkedin.com/in/bui-thi-lan',
        facebook: 'https://facebook.com/buithilan'
      },
      taxId: '0987654321',
      creditLimit: 8000000,
      paymentTerms: '30 ngày',
      currency: 'VND',
      taxExempt: false,
      preferences: {
        communicationFrequency: 'weekly',
        marketingConsent: true,
        newsletter: true,
        smsConsent: true,
        language: 'vi',
        timezone: 'Asia/Ho_Chi_Minh',
        communicationHours: {
          start: '07:00',
          end: '19:00'
        }
      },
      assignedSalesRep: 'Hoàng Văn Dũng',
      accountManager: 'Nguyễn Thị Hồng',
      customerSince: '2022-08-10',
      firstPurchaseDate: '2022-08-15',
      lastPurchaseDate: '2024-01-21',
      totalOrders: 23,
      totalSpent: 18500000,
      averageOrderFrequency: 2.5,
      supportTickets: 1,
      supportPriority: 'high',
      notes: [],
      internalNotes: 'Có thể mở rộng sang các bệnh viện khác',
      createdAt: '2022-08-10',
      updatedAt: '2024-01-24',
      createdBy: 'admin',
      updatedBy: 'sales_manager',
      isDeleted: false,
      interactions: [
        {
          id: '7',
          type: 'meeting',
          channel: 'In-person',
          title: 'Họp triển khai hệ thống mới',
          summary: 'Thảo luận về tích hợp AI vào hệ thống quản lý bệnh nhân',
          date: '2024-01-24',
          status: 'success'
        }
      ],
      products: [
        {
          id: '16',
          name: 'Healthcare CRM Enterprise',
          category: 'Software',
          purchaseDate: '2024-01-21',
          quantity: 1,
          price: 3200000,
          status: 'active'
        },
        {
          id: '17',
          name: 'Patient Management System',
          category: 'Software',
          purchaseDate: '2023-11-15',
          quantity: 1,
          price: 2500000,
          status: 'active'
        },
        {
          id: '18',
          name: 'Medical Analytics',
          category: 'Module',
          purchaseDate: '2023-08-20',
          quantity: 1,
          price: 1800000,
          status: 'active'
        }
      ],
      remarketing: {
        eligible: false,
        priority: 'low',
        lastCampaign: '2024-01-01',
        campaigns: []
      }
    },
    {
      id: 10,
      name: 'Cao Minh Tâm',
      firstName: 'Tâm',
      lastName: 'Cao Minh',
      contact: '0990123456',
      email: 'cao.minh.tam@construction.com',
      company: 'Construction Corp',
      companySize: 'enterprise',
      industry: 'Xây dựng',
      position: 'Tổng Giám đốc',
      department: 'Điều hành',
      status: 'active',
      customerType: 'gold',
      tags: [
        { id: '17', name: 'Dự án lớn', color: 'bg-orange-100 text-orange-800', category: 'value' },
        { id: '18', name: 'Xây dựng', color: 'bg-brown-100 text-brown-800', category: 'behavior' }
      ],
      totalValue: '1,800,000',
      lifetimeValue: '7,200,000',
      averageOrderValue: '900,000',
      lastOrderDate: '2024-01-12',
      lastInteraction: '2024-01-19',
      daysSinceLastInteraction: 5,
      engagementScore: 82,
      churnRisk: 18,
      loyaltyPoints: 1800,
      preferredChannel: 'phone',
      dateOfBirth: '1973-02-28',
      gender: 'male',
      maritalStatus: 'married',
      address: '357 Đường Cộng Hòa',
      city: 'TP.HCM',
      state: 'TP.HCM',
      country: 'Việt Nam',
      postalCode: '700000',
      phone2: '0990123457',
      website: 'https://constructioncorp.vn',
      socialMedia: {
        linkedin: 'https://linkedin.com/in/cao-minh-tam'
      },
      taxId: '1234567890',
      creditLimit: 5000000,
      paymentTerms: '45 ngày',
      currency: 'VND',
      taxExempt: false,
      preferences: {
        communicationFrequency: 'monthly',
        marketingConsent: true,
        newsletter: false,
        smsConsent: true,
        language: 'vi',
        timezone: 'Asia/Ho_Chi_Minh',
        communicationHours: {
          start: '06:00',
          end: '18:00'
        }
      },
      assignedSalesRep: 'Trần Thị Oanh',
      accountManager: 'Lê Văn Thành',
      customerSince: '2023-02-15',
      firstPurchaseDate: '2023-02-20',
      lastPurchaseDate: '2024-01-12',
      totalOrders: 8,
      totalSpent: 7200000,
      averageOrderFrequency: 0.8,
      supportTickets: 4,
      supportPriority: 'medium',
      notes: [],
      internalNotes: 'Có tiềm năng mở rộng sang các tỉnh khác',
      createdAt: '2023-02-15',
      updatedAt: '2024-01-19',
      createdBy: 'sales_rep',
      updatedBy: 'account_manager',
      isDeleted: false,
      interactions: [
        {
          id: '8',
          type: 'call',
          channel: 'Phone',
          title: 'Tư vấn giải pháp cho dự án mới',
          summary: 'Khách hàng cần tư vấn cho dự án cao ốc 40 tầng',
          date: '2024-01-19',
          status: 'success'
        }
      ],

      products: [
        {
          id: '19',
          name: 'Construction Management Suite',
          category: 'Software',
          purchaseDate: '2024-01-12',
          quantity: 1,
          price: 1800000,
          status: 'active'
        },
        {
          id: '20',
          name: 'Project Tracking System',
          category: 'Software',
          purchaseDate: '2023-10-15',
          quantity: 1,
          price: 1500000,
          status: 'active'
        },
        {
          id: '21',
          name: 'Resource Planning Module',
          category: 'Module',
          purchaseDate: '2023-06-20',
          quantity: 1,
          price: 1200000,
          status: 'active'
        }
      ],
      remarketing: {
        eligible: false,
        priority: 'low',
        lastCampaign: '',
        campaigns: []
      }
    },
    {
      id: 11,
      name: 'Dương Thị Hạnh',
      firstName: 'Hạnh',
      lastName: 'Dương Thị',
      contact: '0901234567',
      email: 'duong.thi.hanh@fashion.com',
      company: 'Fashion Boutique',
      companySize: 'small',
      industry: 'Thời trang',
      position: 'Chủ cửa hàng',
      department: 'Kinh doanh',
      status: 'active',
      customerType: 'bronze',
      tags: [
        { id: '19', name: 'Thời trang', color: 'bg-pink-100 text-pink-800', category: 'behavior' },
        { id: '20', name: 'Khách hàng trung thành', color: 'bg-blue-100 text-blue-800', category: 'engagement' }
      ],
      totalValue: '680,000',
      lifetimeValue: '2,720,000',
      averageOrderValue: '170,000',
      lastOrderDate: '2024-01-17',
      lastInteraction: '2024-01-18',
      daysSinceLastInteraction: 6,
      engagementScore: 72,
      churnRisk: 22,
      loyaltyPoints: 680,
      preferredChannel: 'chat',
      dateOfBirth: '1992-11-14',
      gender: 'female',
      maritalStatus: 'single',
      address: '789 Đường Nguyễn Huệ',
      city: 'TP.HCM',
      state: 'TP.HCM',
      country: 'Việt Nam',
      postalCode: '700000',
      phone2: '0901234568',
      website: 'https://fashionboutique.vn',
      socialMedia: {
        instagram: 'https://instagram.com/fashionboutique',
        facebook: 'https://facebook.com/fashionboutique'
      },
      taxId: '2468135790',
      creditLimit: 1000000,
      paymentTerms: '15 ngày',
      currency: 'VND',
      taxExempt: false,
      preferences: {
        communicationFrequency: 'weekly',
        marketingConsent: true,
        newsletter: true,
        smsConsent: true,
        language: 'vi',
        timezone: 'Asia/Ho_Chi_Minh',
        communicationHours: {
          start: '09:00',
          end: '21:00'
        }
      },
      assignedSalesRep: 'Phạm Thị Linh',
      customerSince: '2023-05-20',
      firstPurchaseDate: '2023-05-25',
      lastPurchaseDate: '2024-01-17',
      totalOrders: 16,
      totalSpent: 2720000,
      averageOrderFrequency: 2,
      supportTickets: 2,
      supportPriority: 'low',
      notes: [],
      internalNotes: 'Có thể upsell social media management tools',
      createdAt: '2023-05-20',
      updatedAt: '2024-01-18',
      createdBy: 'sales_rep',
      updatedBy: 'sales_rep',
      isDeleted: false,
      interactions: [
        {
          id: '9',
          type: 'chat',
          channel: 'LiveChat',
          title: 'Hỗ trợ setup campaign marketing',
          summary: 'Hướng dẫn thiết lập chiến dịch marketing cho mùa sale',
          date: '2024-01-18',
          status: 'success'
        }
      ],
      products: [
        {
          id: '22',
          name: 'Retail Management System',
          category: 'Software',
          purchaseDate: '2024-01-17',
          quantity: 1,
          price: 680000,
          status: 'active'
        },
        {
          id: '23',
          name: 'Inventory Tracker',
          category: 'Module',
          purchaseDate: '2023-12-10',
          quantity: 1,
          price: 320000,
          status: 'active'
        },
        {
          id: '24',
          name: 'Social Media Integration',
          category: 'Add-on',
          purchaseDate: '2023-11-05',
          quantity: 1,
          price: 180000,
          status: 'active'
        }
      ],
      remarketing: {
        eligible: false,
        priority: 'low',
        lastCampaign: '',
        campaigns: []
      }
    },
    {
      id: 12,
      name: 'Lý Văn Phong',
      firstName: 'Phong',
      lastName: 'Lý Văn',
      contact: '0912345678',
      email: 'ly.van.phong@restaurant.vn',
      company: 'Restaurant Chain',
      companySize: 'medium',
      industry: 'Nhà hàng',
      position: 'Chủ chuỗi nhà hàng',
      department: 'F&B',
      status: 'at-risk',
      customerType: 'silver',
      tags: [
        { id: '21', name: 'Nhà hàng', color: 'bg-yellow-100 text-yellow-800', category: 'behavior' },
        { id: '22', name: 'Cần chăm sóc', color: 'bg-red-100 text-red-800', category: 'risk' }
      ],
      totalValue: '950,000',
      lifetimeValue: '4,750,000',
      averageOrderValue: '475,000',
      lastOrderDate: '2023-12-20',
      lastInteraction: '2024-01-05',
      daysSinceLastInteraction: 19,
      engagementScore: 48,
      churnRisk: 65,
      loyaltyPoints: 475,
      preferredChannel: 'phone',
      dateOfBirth: '1981-09-03',
      gender: 'male',
      maritalStatus: 'married',
      address: '456 Đường Điện Biên Phủ',
      city: 'Hà Nội',
      state: 'Hà Nội',
      country: 'Việt Nam',
      postalCode: '100000',
      phone2: '0912345679',
      website: 'https://restaurantchain.vn',
      socialMedia: {
        facebook: 'https://facebook.com/restaurantchain',
        instagram: 'https://instagram.com/restaurantchain'
      },
      taxId: '3691470258',
      creditLimit: 2000000,
      paymentTerms: '30 ngày',
      currency: 'VND',
      taxExempt: false,
      preferences: {
        communicationFrequency: 'monthly',
        marketingConsent: true,
        newsletter: false,
        smsConsent: false,
        language: 'vi',
        timezone: 'Asia/Ho_Chi_Minh',
        communicationHours: {
          start: '10:00',
          end: '22:00'
        }
      },
      assignedSalesRep: 'Võ Thị Mai',
      customerSince: '2023-01-10',
      firstPurchaseDate: '2023-01-15',
      lastPurchaseDate: '2023-12-20',
      totalOrders: 10,
      totalSpent: 4750000,
      averageOrderFrequency: 1,
      supportTickets: 6,
      supportPriority: 'high',
      notes: [],
      internalNotes: 'Cần follow up gấp, có nguy cơ churn cao',
      createdAt: '2023-01-10',
      updatedAt: '2024-01-05',
      createdBy: 'sales_rep',
      updatedBy: 'account_manager',
      isDeleted: false,
      interactions: [
        {
          id: '10',
          type: 'call',
          channel: 'Phone',
          title: 'Cuộc gọi check-in',
          summary: 'Khách hàng bận, hẹn gọi lại tuần sau',
          date: '2024-01-05',
          status: 'pending'
        }
      ],

      products: [
        {
          id: '25',
          name: 'Restaurant Management System',
          category: 'Software',
          purchaseDate: '2023-12-20',
          quantity: 1,
          price: 950000,
          status: 'active'
        },
        {
          id: '26',
          name: 'Order Management',
          category: 'Module',
          purchaseDate: '2023-08-15',
          quantity: 1,
          price: 650000,
          status: 'active'
        },
        {
          id: '27',
          name: 'Kitchen Display System',
          category: 'Hardware',
          purchaseDate: '2023-06-10',
          quantity: 3,
          price: 1200000,
          status: 'active'
        }
      ],
      remarketing: {
        eligible: true,
        priority: 'high',
        lastCampaign: '2024-01-10',
        campaigns: [
          {
            id: 'c6',
            name: 'Restaurant Retention Campaign',
            type: 'email',
            status: 'sent',
            sentAt: '2024-01-10',
            openRate: 55,
            clickRate: 8
          }
        ]
      }
    },
    {
      id: 13,
      name: 'Nguyễn Thị Uyên',
      firstName: 'Uyên',
      lastName: 'Nguyễn Thị',
      contact: '0923456789',
      email: 'nguyen.thi.uyen@bookstore.com',
      company: 'Bookstore Network',
      companySize: 'small',
      industry: 'Xuất bản',
      position: 'Chủ cửa hàng sách',
      department: 'Kinh doanh',
      status: 'active',
      customerType: 'new',
      tags: [
        { id: '23', name: 'Sách', color: 'bg-indigo-100 text-indigo-800', category: 'behavior' },
        { id: '24', name: 'Khách hàng mới', color: 'bg-green-100 text-green-800', category: 'value' }
      ],
      totalValue: '320,000',
      lifetimeValue: '320,000',
      averageOrderValue: '160,000',
      lastOrderDate: '2024-01-22',
      lastInteraction: '2024-01-23',
      daysSinceLastInteraction: 1,
      engagementScore: 88,
      churnRisk: 8,
      loyaltyPoints: 32,
      preferredChannel: 'email',
      dateOfBirth: '1989-04-12',
      gender: 'female',
      maritalStatus: 'single',
      address: '123 Đường Sách',
      city: 'Hà Nội',
      state: 'Hà Nội',
      country: 'Việt Nam',
      postalCode: '100000',
      website: 'https://bookstorenetwork.vn',
      socialMedia: {
        facebook: 'https://facebook.com/bookstorenetwork',
        instagram: 'https://instagram.com/bookstorenetwork'
      },
      taxId: '7410852963',
      creditLimit: 500000,
      paymentTerms: '7 ngày',
      currency: 'VND',
      taxExempt: false,
      preferences: {
        communicationFrequency: 'weekly',
        marketingConsent: true,
        newsletter: true,
        smsConsent: false,
        language: 'vi',
        timezone: 'Asia/Ho_Chi_Minh',
        communicationHours: {
          start: '08:00',
          end: '18:00'
        }
      },
      assignedSalesRep: 'Đặng Văn Hùng',
      customerSince: '2024-01-10',
      firstPurchaseDate: '2024-01-15',
      lastPurchaseDate: '2024-01-22',
      totalOrders: 2,
      totalSpent: 320000,
      averageOrderFrequency: 2,
      supportTickets: 0,
      supportPriority: 'low',
      notes: [],
      internalNotes: 'Tiềm năng phát triển tốt, có thể mở rộng',
      createdAt: '2024-01-10',
      updatedAt: '2024-01-23',
      createdBy: 'sales_rep',
      updatedBy: 'sales_rep',
      isDeleted: false,
      interactions: [
        {
          id: '11',
          type: 'email',
          channel: 'Email',
          title: 'Welcome email và onboarding',
          summary: 'Gửi email chào mừng và hướng dẫn sử dụng hệ thống',
          date: '2024-01-23',
          status: 'success'
        }
      ],
      products: [
        {
          id: '28',
          name: 'Bookstore POS System',
          category: 'Software',
          purchaseDate: '2024-01-22',
          quantity: 1,
          price: 320000,
          status: 'active'
        }
      ],
      remarketing: {
        eligible: false,
        priority: 'low',
        lastCampaign: '',
        campaigns: []
      }
    },
    {
      id: 14,
      name: 'Trịnh Văn Đạt',
      firstName: 'Đạt',
      lastName: 'Trịnh Văn',
      contact: '0934567890',
      email: 'trinh.van.dat@autoservice.com',
      company: 'Auto Service Center',
      companySize: 'medium',
      industry: 'Ô tô',
      position: 'Chủ xưởng',
      department: 'Dịch vụ',
      status: 'active',
      customerType: 'returning',
      tags: [
        { id: '25', name: 'Ô tô', color: 'bg-gray-100 text-gray-800', category: 'behavior' },
        { id: '26', name: 'Khách quay lại', color: 'bg-green-100 text-green-800', category: 'engagement' }
      ],
      totalValue: '1,200,000',
      lifetimeValue: '3,600,000',
      averageOrderValue: '600,000',
      lastOrderDate: '2024-01-16',
      lastInteraction: '2024-01-17',
      daysSinceLastInteraction: 7,
      engagementScore: 76,
      churnRisk: 15,
      loyaltyPoints: 1200,
      preferredChannel: 'phone',
      dateOfBirth: '1984-12-08',
      gender: 'male',
      maritalStatus: 'married',
      address: '987 Đường Xô Viết Nghệ Tĩnh',
      city: 'Đà Nẵng',
      state: 'Đà Nẵng',
      country: 'Việt Nam',
      postalCode: '550000',
      phone2: '0934567891',
      website: 'https://autoservicecenter.vn',
      taxId: '8520741963',
      creditLimit: 3000000,
      paymentTerms: '30 ngày',
      currency: 'VND',
      taxExempt: false,
      preferences: {
        communicationFrequency: 'monthly',
        marketingConsent: true,
        newsletter: false,
        smsConsent: true,
        language: 'vi',
        timezone: 'Asia/Ho_Chi_Minh',
        communicationHours: {
          start: '07:00',
          end: '17:00'
        }
      },
      assignedSalesRep: 'Huỳnh Thị Nga',
      customerSince: '2023-09-20',
      firstPurchaseDate: '2023-09-25',
      lastPurchaseDate: '2024-01-16',
      totalOrders: 6,
      totalSpent: 3600000,
      averageOrderFrequency: 1.5,
      supportTickets: 3,
      supportPriority: 'medium',
      notes: [],
      internalNotes: 'Từng dừng hợp tác 2 tháng, nay đã quay lại',
      createdAt: '2023-09-20',
      updatedAt: '2024-01-17',
      createdBy: 'sales_rep',
      updatedBy: 'sales_rep',
      isDeleted: false,
      interactions: [
        {
          id: '12',
          type: 'call',
          channel: 'Phone',
          title: 'Tư vấn nâng cấp hệ thống',
          summary: 'Khách hàng muốn tích hợp thêm module quản lý phụ tùng',
          date: '2024-01-17',
          status: 'success'
        }
      ],

      products: [
        {
          id: '29',
          name: 'Auto Service Management',
          category: 'Software',
          purchaseDate: '2024-01-16',
          quantity: 1,
          price: 1200000,
          status: 'active'
        },
        {
          id: '30',
          name: 'Customer Appointment System',
          category: 'Module',
          purchaseDate: '2023-11-10',
          quantity: 1,
          price: 800000,
          status: 'active'
        },
        {
          id: '31',
          name: 'Parts Inventory Management',
          category: 'Module',
          purchaseDate: '2023-09-25',
          quantity: 1,
          price: 600000,
          status: 'active'
        }
      ],
      remarketing: {
        eligible: false,
        priority: 'low',
        lastCampaign: '',
        campaigns: []
      }
    },
    {
      id: 15,
      name: 'Phùng Thị Hương',
      firstName: 'Hương',
      lastName: 'Phùng Thị',
      contact: '0945678901',
      email: 'phung.thi.huong@pharmacy.vn',
      company: 'Pharmacy Chain',
      companySize: 'large',
      industry: 'Dược phẩm',
      position: 'Giám đốc chuỗi',
      department: 'Điều hành',
      status: 'inactive',
      customerType: 'inactive',
      tags: [
        { id: '27', name: 'Dược phẩm', color: 'bg-green-100 text-green-800', category: 'behavior' },
        { id: '28', name: 'Tạm ngưng', color: 'bg-gray-100 text-gray-800', category: 'risk' }
      ],
      totalValue: '0',
      lifetimeValue: '8,500,000',
      averageOrderValue: '850,000',
      lastOrderDate: '2023-09-30',
      lastInteraction: '2023-11-15',
      daysSinceLastInteraction: 71,
      engagementScore: 25,
      churnRisk: 85,
      loyaltyPoints: 0,
      preferredChannel: 'email',
      dateOfBirth: '1979-01-25',
      gender: 'female',
      maritalStatus: 'divorced',
      address: '741 Đường Cách Mạng Tháng 8',
      city: 'TP.HCM',
      state: 'TP.HCM',
      country: 'Việt Nam',
      postalCode: '700000',
      phone2: '0945678902',
      website: 'https://pharmacychain.vn',
      taxId: '9630741852',
      creditLimit: 0,
      paymentTerms: 'Đã tạm dừng',
      currency: 'VND',
      taxExempt: false,
      preferences: {
        communicationFrequency: 'monthly',
        marketingConsent: false,
        newsletter: false,
        smsConsent: false,
        language: 'vi',
        timezone: 'Asia/Ho_Chi_Minh',
        communicationHours: {
          start: '08:00',
          end: '17:00'
        }
      },
      assignedSalesRep: 'Lê Thị Phương',
      customerSince: '2022-04-10',
      firstPurchaseDate: '2022-04-15',
      lastPurchaseDate: '2023-09-30',
      totalOrders: 10,
      totalSpent: 8500000,
      averageOrderFrequency: 0.6,
      supportTickets: 5,
      supportPriority: 'low',
      notes: [],
      internalNotes: 'Có thể quay lại trong Q2/2024',
      createdAt: '2022-04-10',
      updatedAt: '2023-11-15',
      createdBy: 'sales_manager',
      updatedBy: 'account_manager',
      isDeleted: false,
      interactions: [
        {
          id: '13',
          type: 'email',
          channel: 'Email',
          title: 'Email thông báo tạm ngưng',
          summary: 'Khách hàng thông báo tạm ngưng do thay đổi hệ thống',
          date: '2023-11-15',
          status: 'success'
        }
      ],
      products: [
        {
          id: '32',
          name: 'Pharmacy Management System',
          category: 'Software',
          purchaseDate: '2022-04-15',
          quantity: 1,
          price: 2500000,
          status: 'expired'
        },
        {
          id: '33',
          name: 'Drug Inventory Control',
          category: 'Module',
          purchaseDate: '2022-08-20',
          quantity: 1,
          price: 1800000,
          status: 'expired'
        },
        {
          id: '34',
          name: 'Prescription Management',
          category: 'Module',
          purchaseDate: '2023-02-10',
          quantity: 1,
          price: 1200000,
          status: 'expired'
        }
      ],
      remarketing: {
        eligible: true,
        priority: 'medium',
        lastCampaign: '2023-12-01',
        campaigns: [
          {
            id: 'c7',
            name: 'Pharmacy Reactivation',
            type: 'email',
            status: 'sent',
            sentAt: '2023-12-01',
            openRate: 35,
            clickRate: 2
          }
        ]
      }
    }
  ])

  // Helper functions
  const formatCurrency = (value: string) => {
    return parseInt(value.replace(/,/g, '')).toLocaleString()
  }

  const formatDate = (dateString?: string): string => {
    if (!dateString) return 'Chưa có'
    try {
      const date = new Date(dateString)
      if (isNaN(date.getTime())) return 'Chưa có'
      return date.toLocaleDateString('vi-VN', { 
        day: '2-digit', 
        month: '2-digit', 
        year: 'numeric' 
      })
    } catch {
      return 'Chưa có'
    }
  }

  const formatBirthday = (dateString?: string): string => {
    if (!dateString) return 'Chưa có'
    try {
      const date = new Date(dateString)
      if (isNaN(date.getTime())) return 'Chưa có'
      return date.toLocaleDateString('vi-VN', { 
        day: '2-digit', 
        month: '2-digit' 
      })
    } catch {
      return 'Chưa có'
    }
  }

  const getRiskColor = (risk: number) => {
    if (risk >= 70) return 'text-red-600'
    if (risk >= 40) return 'text-orange-600'
    return 'text-green-600'
  }

  const handleCustomerSelect = (customer: Customer) => {
    setSelectedCustomer(customer)
    setEditCustomerData(customer)
    setIsEditingCustomer(false)
    setActiveTab('details')
  }

  const handleSaveCustomer = () => {
    if (!editCustomerData.name || !editCustomerData.name.trim()) {
      alert('Vui lòng điền họ và tên')
      return
    }

    // In a real app, this would make an API call to update the customer
    console.log('Saving customer:', editCustomerData)
    alert('Đã lưu thông tin khách hàng thành công!')
    setIsEditingCustomer(false)
    setSelectedCustomer(editCustomerData as Customer)
  }

  const handleCloseCustomerDetail = () => {
    setSelectedCustomer(null)
    setEditCustomerData({})
    setIsEditingCustomer(false)
  }

  const handleAddInteraction = () => {
    if (!newInteractionData.title.trim() || !newInteractionData.channel.trim()) {
      alert('Vui lòng điền đầy đủ tiêu đề và kênh tương tác')
      return
    }

    const newInteraction: CustomerInteraction = {
      id: Date.now().toString(),
      type: newInteractionData.type as any,
      channel: newInteractionData.channel,
      title: newInteractionData.title,
      summary: newInteractionData.summary,
      date: new Date().toISOString().split('T')[0],
      status: newInteractionData.status as any
    }

    // In a real app, this would make an API call to add the interaction
    console.log('Adding interaction:', newInteraction)
    
    // Update selected customer's interactions
    if (selectedCustomer) {
      const updatedCustomer = {
        ...selectedCustomer,
        interactions: [...(selectedCustomer.interactions || []), newInteraction]
      }
      setSelectedCustomer(updatedCustomer)
    }

    // Reset form and close modal
    setNewInteractionData({
      type: 'call',
      channel: '',
      title: '',
      summary: '',
      status: 'success'
    })
    setShowAddInteractionModal(false)
    alert('Đã thêm tương tác mới thành công!')
  }

  const handleCreateOrder = (customer: Customer) => {
    setSelectedCustomerForOrder(customer)
    setShowCreateOrderModal(true)
  }

  const handleSubmitOrder = () => {
    // Validation
    if (selectedProducts.length === 0) {
      alert('Vui lòng chọn ít nhất một sản phẩm!')
      return
    }

    // Calculate total amount including packages
    const totalAmount = selectedProducts.reduce((sum, productId) => {
      const product = availableProducts.find(p => p.id === productId)
      const selectedPackageId = selectedPackages[productId]
      const selectedPackage = availablePackages[productId as keyof typeof availablePackages]?.find(pkg => pkg.id === selectedPackageId)
      return sum + (product?.price || 0) + (selectedPackage?.price || 0)
    }, 0)

    // Create order products with packages
    const orderProducts = selectedProducts.map(productId => {
      const product = availableProducts.find(p => p.id === productId)
      const selectedPackageId = selectedPackages[productId]
      const selectedPackage = availablePackages[productId as keyof typeof availablePackages]?.find(pkg => pkg.id === selectedPackageId)
      const totalProductPrice = (product?.price || 0) + (selectedPackage?.price || 0)
      
      return {
        id: Date.now().toString() + '-' + productId,
        name: `${product?.name || ''} (${selectedPackage?.name || 'Standard'})`,
        category: product?.category || '',
        purchaseDate: new Date().toISOString().split('T')[0],
        quantity: 1,
        price: totalProductPrice,
        status: 'active' as const,
        packageInfo: selectedPackage ? {
          packageId: selectedPackage.id,
          packageName: selectedPackage.name,
          packagePrice: selectedPackage.price,
          packageDescription: selectedPackage.description
        } : null
      }
    })

    // In a real app, this would make an API call to create the order
    console.log('Creating order:', {
      customer: selectedCustomerForOrder,
      products: orderProducts,
      orderDetails: newOrderData,
      totalAmount: newOrderData.totalAmount,
      discountPercent: newOrderData.discountPercent,
      paymentMethod: newOrderData.paymentMethod,
      finalAmount: newOrderData.finalAmount
    })

    // Update customer's products if in selected customer detail
    if (selectedCustomer && selectedCustomer.id === selectedCustomerForOrder?.id) {
      const updatedCustomer = {
        ...selectedCustomer,
        products: [...(selectedCustomer.products || []), ...orderProducts],
        totalOrders: (selectedCustomer.totalOrders || 0) + 1,
        totalSpent: (selectedCustomer.totalSpent || 0) + newOrderData.finalAmount,
        lastPurchaseDate: new Date().toISOString().split('T')[0]
      }
      setSelectedCustomer(updatedCustomer)
    }

    // Prepare payment info for alert
    let paymentInfo = `\nTổng tiền hàng: ${newOrderData.totalAmount.toLocaleString('vi-VN')} VND`
    if (newOrderData.discountPercent > 0) {
      paymentInfo += `\nGiảm giá (${newOrderData.discountPercent}%): -${(newOrderData.totalAmount * newOrderData.discountPercent / 100).toLocaleString('vi-VN')} VND`
    }
    paymentInfo += `\nThành tiền: ${newOrderData.finalAmount.toLocaleString('vi-VN')} VND`
    paymentInfo += `\nHình thức thanh toán: ${newOrderData.paymentMethod === 'cash' ? '💵 Tiền mặt' : '🏦 Chuyển khoản'}`

    // Reset form and close modal
    setNewOrderData({
      notes: '',
      discountPercent: 0,
      paymentMethod: 'cash',
      totalAmount: 0,
      finalAmount: 0
    })
    setSelectedProducts([])
    setSelectedPackages({})
    setSelectedCustomerForOrder(null)
    setShowCreateOrderModal(false)
    alert(`Đã tạo đơn hàng cho khách hàng ${selectedCustomerForOrder?.name} thành công!${paymentInfo}`)
  }

  // Quick interaction handlers
  const handleQuickInteraction = (customer: Customer) => {
    setSelectedCustomerForInteraction(customer)
    setShowQuickInteractionModal(true)
  }

  const handleSubmitQuickInteraction = () => {
    if (!quickInteractionTitle.trim() || !quickInteractionContent.trim() || !selectedCustomerForInteraction) {
      alert('Vui lòng nhập đầy đủ tiêu đề và nội dung tương tác!')
      return
    }

    const newInteraction: CustomerInteraction = {
      id: `interaction_${Date.now()}`,
      type: quickInteractionType === 'note' ? 'support' : quickInteractionType,
      channel: quickInteractionType === 'call' ? 'phone' : 
               quickInteractionType === 'email' ? 'email' : 
               quickInteractionType === 'meeting' ? 'in-person' : 'note',
      title: quickInteractionTitle,
      summary: quickInteractionContent,
      date: new Date().toISOString(),
      status: 'success'
    }

    console.log('Quick interaction added:', newInteraction)
    
    // Reset and close modal
    setQuickInteractionContent('')
    setQuickInteractionTitle('')
    setQuickInteractionType('note')
    setSelectedCustomerForInteraction(null)
    setShowQuickInteractionModal(false)
    
    alert(`Đã thêm tương tác thành công cho khách hàng ${selectedCustomerForInteraction.name}!`)
  }

  // Edit interaction handlers
  const handleEditInteraction = (interaction: CustomerInteraction) => {
    setEditingInteraction(interaction)
    setEditInteractionData({
      title: interaction.title,
      summary: interaction.summary,
      type: interaction.type,
      channel: interaction.channel,
      status: interaction.status
    })
    setEditReason('')
    setShowEditInteractionModal(true)
  }

  const handleSubmitEditInteraction = () => {
    if (!editingInteraction || !selectedCustomer || !editReason.trim()) {
      alert('Vui lòng nhập lý do chỉnh sửa!')
      return
    }

    // Track changes
    const changes: { field: string; oldValue: string; newValue: string }[] = []
    
    if (editInteractionData.title !== editingInteraction.title) {
      changes.push({
        field: 'title',
        oldValue: editingInteraction.title,
        newValue: editInteractionData.title
      })
    }
    
    if (editInteractionData.summary !== editingInteraction.summary) {
      changes.push({
        field: 'summary',
        oldValue: editingInteraction.summary,
        newValue: editInteractionData.summary
      })
    }
    
    if (editInteractionData.type !== editingInteraction.type) {
      changes.push({
        field: 'type',
        oldValue: editingInteraction.type,
        newValue: editInteractionData.type
      })
    }
    
    if (editInteractionData.channel !== editingInteraction.channel) {
      changes.push({
        field: 'channel',
        oldValue: editingInteraction.channel,
        newValue: editInteractionData.channel
      })
    }
    
    if (editInteractionData.status !== editingInteraction.status) {
      changes.push({
        field: 'status',
        oldValue: editingInteraction.status,
        newValue: editInteractionData.status
      })
    }

    if (changes.length === 0) {
      alert('Không có thay đổi nào để lưu!')
      return
    }

    // Create edit log
    const editLog: InteractionEditLog = {
      id: `edit_${Date.now()}`,
      editedBy: 'Current User', // Replace with actual user
      editedAt: new Date().toISOString(),
      changes,
      reason: editReason
    }

    // Update interaction
    const updatedInteraction: CustomerInteraction = {
      ...editingInteraction,
      ...editInteractionData,
      editHistory: [...(editingInteraction.editHistory || []), editLog]
    }

    // Update customer's interactions
    const updatedCustomer = {
      ...selectedCustomer,
      interactions: selectedCustomer.interactions.map(int => 
        int.id === editingInteraction.id ? updatedInteraction : int
      )
    }

    setSelectedCustomer(updatedCustomer)
    
    // Reset and close modal
    setEditingInteraction(null)
    setEditInteractionData({
      title: '',
      summary: '',
      type: 'email',
      channel: '',
      status: 'success'
    })
    setEditReason('')
    setShowEditInteractionModal(false)
    
    alert('Đã cập nhật tương tác thành công!')
  }

  const handleExportData = (format: 'csv' | 'excel') => {
    console.log(`Exporting ${filteredCustomers.length} customers as ${format}`)
    // Implement export logic here
  }

  const handleRemarketingClick = () => {
    setShowRemarketingModal(true)
  }

  const handleAddCustomer = () => {
    // Validate required fields
    if (!newCustomerData.email || !newCustomerData.phone) {
      alert('Vui lòng điền email và số điện thoại')
      return
    }

    // Validate product and package selection
    if (newCustomerData.selectedProducts.length === 0) {
      alert('Vui lòng chọn ít nhất một sản phẩm và gói dịch vụ')
      return
    }

    // Create new customer object
    const newCustomer: Customer = {
      id: Math.max(...customers.map(c => c.id)) + 1,
      name: `${newCustomerData.lastName} ${newCustomerData.firstName}`.trim() || 'Khách hàng mới',
      firstName: newCustomerData.firstName,
      lastName: newCustomerData.lastName,
      contact: newCustomerData.phone,
      email: newCustomerData.email,
      company: newCustomerData.company || 'Chưa cập nhật',
      companySize: newCustomerData.companySize as any,
      industry: newCustomerData.industry || 'Khác',
      position: newCustomerData.position || 'Chưa cập nhật',
      department: 'Chưa phân bổ',
      status: newCustomerData.status as any,
      customerType: newCustomerData.customerType as any,
      tags: [],
      totalValue: '0',
      lifetimeValue: '0',
      averageOrderValue: '0',
      lastOrderDate: '',
      lastInteraction: new Date().toISOString().split('T')[0],
      daysSinceLastInteraction: 0,
      engagementScore: 50,
      churnRisk: 20,
      loyaltyPoints: 0,
      preferredChannel: newCustomerData.preferredChannel as any,
      interactions: [],

      products: [],
      address: newCustomerData.address || '',
      city: newCustomerData.city || '',
      state: newCustomerData.state || '',
      country: 'Việt Nam',
      postalCode: newCustomerData.postalCode || '',
      creditLimit: 1000000,
      paymentTerms: '30 ngày',
      currency: 'VND',
      taxExempt: false,
      preferences: {
        communicationFrequency: 'weekly',
        marketingConsent: newCustomerData.marketingConsent,
        newsletter: newCustomerData.marketingConsent,
        smsConsent: newCustomerData.smsConsent,
        language: 'vi',
        timezone: 'Asia/Ho_Chi_Minh',
        communicationHours: {
          start: '08:00',
          end: '18:00'
        }
      },
      customerSince: new Date().toISOString().split('T')[0],
      firstPurchaseDate: '',
      lastPurchaseDate: '',
      totalOrders: 0,
      totalSpent: 0,
      averageOrderFrequency: 0,
      supportTickets: 0,
      supportPriority: 'medium',
      notes: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: 'Admin',
      updatedBy: 'Admin',
      isDeleted: false,
      remarketing: {
        eligible: false,
        priority: 'low',
        lastCampaign: '',
        suggestedActions: [],
        campaigns: []
      }
    }

    // Create order with multiple products for the new customer
    const orderItems = newCustomerData.selectedProducts.map(product => ({
      productId: product.productId,
      productName: product.productName,
      packageId: product.packageId,
      packageName: product.packageName,
      price: product.price,
      features: product.features
    }))
    
    const newOrder = {
      id: Math.random().toString(36).substr(2, 9),
      customerId: newCustomer.id,
      customerName: newCustomer.name,
      items: orderItems,
      totalAmount: newCustomerData.totalAmount,
      discountPercent: newCustomerData.discountPercent,
      paymentMethod: newCustomerData.paymentMethod,
      finalAmount: newCustomerData.finalAmount,
      status: 'pending_payment', // Chờ thanh toán
      createdDate: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 7 days from now
      notes: `Đơn hàng tự động tạo khi thêm khách hàng. Bao gồm ${orderItems.length} sản phẩm/gói.`,
      itemsSummary: orderItems.map(item => `${item.productName} - ${item.packageName}`).join(', ')
    }

    // Here you would normally add to the customers array and orders array
    // For now, we'll just show a success message
    const productsSummary = orderItems.map(item => `• ${item.productName} - ${item.packageName}: ${item.price.toLocaleString('vi-VN')} VND`).join('\n')
    
    let paymentInfo = `\nTổng tiền hàng: ${newCustomerData.totalAmount.toLocaleString('vi-VN')} VND`
    if (newCustomerData.discountPercent > 0) {
      paymentInfo += `\nGiảm giá (${newCustomerData.discountPercent}%): -${(newCustomerData.totalAmount * newCustomerData.discountPercent / 100).toLocaleString('vi-VN')} VND`
    }
    paymentInfo += `\nThành tiền: ${newCustomerData.finalAmount.toLocaleString('vi-VN')} VND`
    paymentInfo += `\nHình thức thanh toán: ${newCustomerData.paymentMethod === 'cash' ? '💵 Tiền mặt' : '🏦 Chuyển khoản'}`
    
    alert(`Khách hàng mới đã được thêm thành công!\n\nĐơn hàng ${newOrder.id} đã được tạo với trạng thái "Chờ thanh toán"\n\nSản phẩm:\n${productsSummary}${paymentInfo}`)
    
    console.log('New Customer:', newCustomer)
    console.log('New Order:', newOrder)
    
    // Reset form and close modal
    setNewCustomerData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      company: '',
      position: '',
      industry: '',
      companySize: 'small',
      customerType: 'individual',
      status: 'active',
      preferredChannel: 'email',
      address: '',
      city: '',
      state: '',
      postalCode: '',
      notes: '',
      source: 'website',
      marketingConsent: false,
      smsConsent: false,
      selectedProducts: [],
      totalAmount: 0,
      discountPercent: 0,
      paymentMethod: 'cash',
      finalAmount: 0
    })
    setShowAddCustomerModal(false)
  }

  const handleInputChange = (field: string, value: any) => {
    setNewCustomerData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleClearFilters = () => {
    setSearchTerm('')
    setFilterStatus('')
    setFilterIndustry('')
    setFilterTag('')
    setFilterCustomerType('')
    setFilterPurchasedProduct([])
  }

  const handleCustomerTypeFilter = (customerType: string) => {
    setFilterCustomerType(customerType)
    setSelectedView('list') // Automatically switch to list view when filtering
  }
  // Filter logic - Only show customers who have made purchases (existing customers)
  const filteredCustomers = useMemo(() => {
    return customers.filter((customer) => {
      // Only show customers who have purchase history (exclude prospects/leads)
      const hasValidPurchaseHistory = customer.products && customer.products.length > 0 && 
                                     customer.totalSpent > 0
      if (!hasValidPurchaseHistory) return false

      const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.company.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesStatus = !filterStatus || customer.status === filterStatus
      const matchesIndustry = !filterIndustry || customer.industry === filterIndustry
      const matchesTag = !filterTag || customer.tags.some(tag => tag.name === filterTag)
      const matchesCustomerType = !filterCustomerType || customer.customerType === filterCustomerType
      const matchesPurchasedProduct = filterPurchasedProduct.length === 0 || 
        filterPurchasedProduct.some(selectedProduct =>
          customer.products.some(product => 
            product.name.toLowerCase().includes(selectedProduct.toLowerCase())
          )
        )

      // Advanced filters
      const matchesRegion = !filterRegion || customer.state === filterRegion || customer.city.includes(filterRegion)
      
      const orderValue = parseInt(customer.totalValue.replace(/,/g, ''))
      const matchesOrderValue = (!filterOrderValue.min || orderValue >= parseInt(filterOrderValue.min)) &&
                               (!filterOrderValue.max || orderValue <= parseInt(filterOrderValue.max))
      
      const matchesLastInteraction = !filterLastInteraction || (() => {
        const daysAgo = customer.daysSinceLastInteraction
        switch(filterLastInteraction) {
          case 'recent': return daysAgo <= 7
          case 'week': return daysAgo <= 30
          case 'month': return daysAgo <= 90
          case 'old': return daysAgo > 90
          default: return true
        }
      })()
      
      const matchesPurchaseDate = (!filterPurchaseDate.start || new Date(customer.lastOrderDate) >= new Date(filterPurchaseDate.start)) &&
                                 (!filterPurchaseDate.end || new Date(customer.lastOrderDate) <= new Date(filterPurchaseDate.end))

      const matchesDepartment = !filterDepartment || customer.department === filterDepartment
      
      const matchesTeam = !filterTeam || customer.team === filterTeam
      
      const matchesAssignedPerson = !filterAssignedPerson || customer.assignedPerson === filterAssignedPerson

      return matchesSearch && matchesStatus && matchesIndustry && matchesTag && 
             matchesCustomerType && matchesPurchasedProduct && matchesRegion &&
             matchesOrderValue && matchesLastInteraction && matchesPurchaseDate &&
             matchesDepartment && matchesTeam && matchesAssignedPerson
    }).sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name)
        case 'lastInteraction':
          return new Date(b.lastInteraction).getTime() - new Date(a.lastInteraction).getTime()
        case 'engagementScore':
          return b.engagementScore - a.engagementScore
        case 'churnRisk':
          return b.churnRisk - a.churnRisk
        case 'totalValue':
          return parseInt(b.totalValue.replace(/,/g, '')) - parseInt(a.totalValue.replace(/,/g, ''))
        default:
          return 0
      }
    })
  }, [customers, searchTerm, filterStatus, filterIndustry, filterTag, filterCustomerType, filterPurchasedProduct, 
      filterRegion, filterOrderValue, filterLastInteraction, filterPurchaseDate, 
      filterDepartment, filterTeam, filterAssignedPerson, sortBy])

  const remarketingCustomers = customers.filter(c => 
    c.remarketing.eligible && (c.status === 'at-risk' || c.churnRisk >= 50)
  )

  // AI Action Handlers
  // Additional state for new remarketing flow
  const [remarketingStep, setRemarketingStep] = useState(1)
  const [selectedRemarketingCustomers, setSelectedRemarketingCustomers] = useState<Customer[]>([])
  const [remarketingCampaignType, setRemarketingCampaignType] = useState('')
  const [remarketingFilters, setRemarketingFilters] = useState({
    riskLevel: '',
    daysSinceLastContact: '',
    customerType: '',
    engagementScore: '',
    birthdayPeriod: '',
    birthdayMonth: ''
  })

  const handleRemarketingCustomerToggle = (customer: Customer) => {
    setSelectedRemarketingCustomers(prev => {
      const isSelected = prev.find(c => c.id === customer.id)
      if (isSelected) {
        return prev.filter(c => c.id !== customer.id)
      } else {
        return [...prev, customer]
      }
    })
  }

  const handleSelectAllRemarketing = () => {
    const filteredForRemarketing = getFilteredRemarketingCustomers()
    if (selectedRemarketingCustomers.length === filteredForRemarketing.length) {
      setSelectedRemarketingCustomers([])
    } else {
      setSelectedRemarketingCustomers(filteredForRemarketing)
    }
  }

  const getFilteredRemarketingCustomers = () => {
    return customers.filter(customer => {
      // Special logic for birthday campaign
      if (remarketingCampaignType === 'birthday') {
        if (!customer.dateOfBirth) return false
        
        const customerBirthday = new Date(customer.dateOfBirth)
        const currentDate = new Date()
        const customerMonth = customerBirthday.getMonth()
        const customerDay = customerBirthday.getDate()
        
        // Apply birthday period filter
        if (remarketingFilters.birthdayPeriod) {
          const currentMonth = currentDate.getMonth()
          const currentYear = currentDate.getFullYear()
          
          if (remarketingFilters.birthdayPeriod === 'this_month') {
            return customerMonth === currentMonth
          } else if (remarketingFilters.birthdayPeriod === 'next_month') {
            const nextMonth = (currentMonth + 1) % 12
            return customerMonth === nextMonth
          } else if (remarketingFilters.birthdayPeriod === 'this_week') {
            const currentWeekStart = new Date(currentDate)
            currentWeekStart.setDate(currentDate.getDate() - currentDate.getDay())
            const currentWeekEnd = new Date(currentWeekStart)
            currentWeekEnd.setDate(currentWeekStart.getDate() + 6)
            
            const thisBirthday = new Date(currentYear, customerMonth, customerDay)
            return thisBirthday >= currentWeekStart && thisBirthday <= currentWeekEnd
          } else if (remarketingFilters.birthdayPeriod === 'next_week') {
            const nextWeekStart = new Date(currentDate)
            nextWeekStart.setDate(currentDate.getDate() + (7 - currentDate.getDay()))
            const nextWeekEnd = new Date(nextWeekStart)
            nextWeekEnd.setDate(nextWeekStart.getDate() + 6)
            
            const thisBirthday = new Date(currentYear, customerMonth, customerDay)
            return thisBirthday >= nextWeekStart && thisBirthday <= nextWeekEnd
          } else if (remarketingFilters.birthdayPeriod === 'today') {
            return customerMonth === currentMonth && customerDay === currentDate.getDate()
          }
        }
        
        // Apply specific month filter
        if (remarketingFilters.birthdayMonth) {
          const selectedMonth = parseInt(remarketingFilters.birthdayMonth)
          return customerMonth === selectedMonth
        }
        
        // Default: current month or next month
        if (!remarketingFilters.birthdayPeriod && !remarketingFilters.birthdayMonth) {
          const currentMonth = currentDate.getMonth()
          const nextMonth = (currentMonth + 1) % 12
          return customerMonth === currentMonth || customerMonth === nextMonth
        }
        
        return true
      }

      // Base remarketing criteria for other campaigns
      let isEligible = customer.churnRisk >= 40 || customer.daysSinceLastInteraction >= 14

      // Apply additional filters
      if (remarketingFilters.riskLevel) {
        if (remarketingFilters.riskLevel === 'high' && customer.churnRisk < 70) isEligible = false
        if (remarketingFilters.riskLevel === 'medium' && (customer.churnRisk < 40 || customer.churnRisk >= 70)) isEligible = false
        if (remarketingFilters.riskLevel === 'low' && customer.churnRisk >= 40) isEligible = false
      }

      if (remarketingFilters.daysSinceLastContact) {
        const days = parseInt(remarketingFilters.daysSinceLastContact)
        if (customer.daysSinceLastInteraction < days) isEligible = false
      }

      if (remarketingFilters.customerType && customer.customerType !== remarketingFilters.customerType) {
        isEligible = false
      }

      if (remarketingFilters.engagementScore) {
        if (remarketingFilters.engagementScore === 'high' && customer.engagementScore < 70) isEligible = false
        if (remarketingFilters.engagementScore === 'medium' && (customer.engagementScore < 40 || customer.engagementScore >= 70)) isEligible = false
        if (remarketingFilters.engagementScore === 'low' && customer.engagementScore >= 40) isEligible = false
      }

      return isEligible
    })
  }

  return (
    <>
      {/* Remarketing Campaign Modal - Multi-step Flow */}
      {showRemarketingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
          <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full mx-4 max-h-[90vh] overflow-hidden">
            {/* Header with Steps */}
            <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-orange-50 to-amber-50">
              <div className="flex items-center space-x-4">
                <Target className="w-8 h-8 text-orange-600" />
                <div>
                  <h2 className="text-xl font-bold text-gray-900">🎯 Tạo chiến dịch Remarketing</h2>
                  <p className="text-gray-600">Thiết lập chiến dịch tái kích hoạt khách hàng</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowRemarketingModal(false)
                  setRemarketingStep(1)
                  setSelectedRemarketingCustomers([])
                  setRemarketingCampaignType('')
                  setRemarketingFilters({
                    riskLevel: '',
                    daysSinceLastContact: '',
                    customerType: '',
                    engagementScore: '',
                    birthdayPeriod: '',
                    birthdayMonth: ''
                  })
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Step Progress */}
            <div className="px-6 py-4 bg-gray-50 border-b">
              <div className="flex items-center justify-center space-x-8">
                <div className={`flex items-center space-x-2 ${remarketingStep >= 1 ? 'text-orange-600' : 'text-gray-400'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    remarketingStep >= 1 ? 'bg-orange-100 text-orange-600' : 'bg-gray-100 text-gray-400'
                  }`}>1</div>
                  <span className="font-medium">Chọn loại chiến dịch</span>
                </div>
                <div className={`w-8 h-0.5 ${remarketingStep >= 2 ? 'bg-orange-600' : 'bg-gray-200'}`}></div>
                <div className={`flex items-center space-x-2 ${remarketingStep >= 2 ? 'text-orange-600' : 'text-gray-400'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    remarketingStep >= 2 ? 'bg-orange-100 text-orange-600' : 'bg-gray-100 text-gray-400'
                  }`}>2</div>
                  <span className="font-medium">Lọc khách hàng</span>
                </div>
                <div className={`w-8 h-0.5 ${remarketingStep >= 3 ? 'bg-orange-600' : 'bg-gray-200'}`}></div>
                <div className={`flex items-center space-x-2 ${remarketingStep >= 3 ? 'text-orange-600' : 'text-gray-400'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    remarketingStep >= 3 ? 'bg-orange-100 text-orange-600' : 'bg-gray-100 text-gray-400'
                  }`}>3</div>
                  <span className="font-medium">Thiết lập & Chạy</span>
                </div>
              </div>
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(90vh-300px)]">
              {/* Step 1: Campaign Type Selection */}
              {remarketingStep === 1 && (
                <div className="space-y-6">
                  <div className="text-center mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Bước 1: Chọn loại chiến dịch</h3>
                    <p className="text-gray-600">Chọn hình thức liên hệ phù hợp với khách hàng của bạn</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Email Campaign */}
                    <div 
                      onClick={() => setRemarketingCampaignType('email')}
                      className={`p-6 border-2 rounded-lg cursor-pointer transition-all ${
                        remarketingCampaignType === 'email' 
                          ? 'border-orange-500 bg-orange-50' 
                          : 'border-gray-200 hover:border-orange-300 hover:bg-orange-25'
                      }`}
                    >
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                          <Mail className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">Email Campaign</h4>
                          <p className="text-sm text-gray-600">Gửi email tái kích hoạt</p>
                        </div>
                      </div>
                      <div className="space-y-2 text-sm text-gray-600">
                        <div>• Tỷ lệ mở email: ~25%</div>
                        <div>• Chi phí: Thấp</div>
                        <div>• Thời gian thiết lập: 15 phút</div>
                        <div>• Phù hợp: Khách hàng có email hoạt động</div>
                      </div>
                    </div>

                    {/* SMS Campaign */}
                    <div 
                      onClick={() => setRemarketingCampaignType('sms')}
                      className={`p-6 border-2 rounded-lg cursor-pointer transition-all ${
                        remarketingCampaignType === 'sms' 
                          ? 'border-orange-500 bg-orange-50' 
                          : 'border-gray-200 hover:border-orange-300 hover:bg-orange-25'
                      }`}
                    >
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                          <MessageSquare className="w-6 h-6 text-green-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">SMS Campaign</h4>
                          <p className="text-sm text-gray-600">Tin nhắn ưu đãi đặc biệt</p>
                        </div>
                      </div>
                      <div className="space-y-2 text-sm text-gray-600">
                        <div>• Tỷ lệ đọc: ~98%</div>
                        <div>• Chi phí: Trung bình</div>
                        <div>• Thời gian thiết lập: 10 phút</div>
                        <div>• Phù hợp: Ưu đãi khẩn cấp</div>
                      </div>
                    </div>

                    {/* Phone Campaign */}
                    <div 
                      onClick={() => setRemarketingCampaignType('phone')}
                      className={`p-6 border-2 rounded-lg cursor-pointer transition-all ${
                        remarketingCampaignType === 'phone' 
                          ? 'border-orange-500 bg-orange-50' 
                          : 'border-gray-200 hover:border-orange-300 hover:bg-orange-25'
                      }`}
                    >
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                          <Phone className="w-6 h-6 text-purple-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">Phone Campaign</h4>
                          <p className="text-sm text-gray-600">Danh sách gọi trực tiếp</p>
                        </div>
                      </div>
                      <div className="space-y-2 text-sm text-gray-600">
                        <div>• Tỷ lệ chuyển đổi: ~45%</div>
                        <div>• Chi phí: Cao</div>
                        <div>• Thời gian thiết lập: 30 phút</div>
                        <div>• Phù hợp: Khách hàng VIP</div>
                      </div>
                    </div>

                    {/* Multi-Channel */}
                    <div 
                      onClick={() => setRemarketingCampaignType('multi')}
                      className={`p-6 border-2 rounded-lg cursor-pointer transition-all ${
                        remarketingCampaignType === 'multi' 
                          ? 'border-orange-500 bg-orange-50' 
                          : 'border-gray-200 hover:border-orange-300 hover:bg-orange-25'
                      }`}
                    >
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                          <Target className="w-6 h-6 text-indigo-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">Multi-Channel</h4>
                          <p className="text-sm text-gray-600">Kết hợp nhiều kênh</p>
                        </div>
                      </div>
                      <div className="space-y-2 text-sm text-gray-600">
                        <div>• Tỷ lệ hiệu quả: ~65%</div>
                        <div>• Chi phí: Cao</div>
                        <div>• Thời gian thiết lập: 45 phút</div>
                        <div>• Phù hợp: Khách hàng quan trọng</div>
                      </div>
                    </div>

                    {/* Social Media */}
                    <div 
                      onClick={() => setRemarketingCampaignType('social')}
                      className={`p-6 border-2 rounded-lg cursor-pointer transition-all ${
                        remarketingCampaignType === 'social' 
                          ? 'border-orange-500 bg-orange-50' 
                          : 'border-gray-200 hover:border-orange-300 hover:bg-orange-25'
                      }`}
                    >
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center">
                          <Heart className="w-6 h-6 text-pink-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">Social Media</h4>
                          <p className="text-sm text-gray-600">Quảng cáo mạng xã hội</p>
                        </div>
                      </div>
                      <div className="space-y-2 text-sm text-gray-600">
                        <div>• Tỷ lệ tương tác: ~35%</div>
                        <div>• Chi phí: Trung bình</div>
                        <div>• Thời gian thiết lập: 20 phút</div>
                        <div>• Phù hợp: Khách hàng trẻ</div>
                      </div>
                    </div>

                    {/* Promotion Campaign */}
                    <div 
                      onClick={() => setRemarketingCampaignType('promotion')}
                      className={`p-6 border-2 rounded-lg cursor-pointer transition-all ${
                        remarketingCampaignType === 'promotion' 
                          ? 'border-orange-500 bg-orange-50' 
                          : 'border-gray-200 hover:border-orange-300 hover:bg-orange-25'
                      }`}
                    >
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                          <Gift className="w-6 h-6 text-yellow-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">Promotion Campaign</h4>
                          <p className="text-sm text-gray-600">Ưu đãi đặc biệt</p>
                        </div>
                      </div>
                      <div className="space-y-2 text-sm text-gray-600">
                        <div>• Tỷ lệ chuyển đổi: ~55%</div>
                        <div>• Chi phí: Trung bình</div>
                        <div>• Thời gian thiết lập: 25 phút</div>
                        <div>• Phù hợp: Khách hàng giá rẻ</div>
                      </div>
                    </div>

                    {/* Birthday Campaign */}
                    <div 
                      onClick={() => setRemarketingCampaignType('birthday')}
                      className={`p-6 border-2 rounded-lg cursor-pointer transition-all ${
                        remarketingCampaignType === 'birthday' 
                          ? 'border-pink-500 bg-pink-50' 
                          : 'border-gray-200 hover:border-pink-300 hover:bg-pink-25'
                      }`}
                    >
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center">
                          <Heart className="w-6 h-6 text-pink-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">🎂 Birthday Campaign</h4>
                          <p className="text-sm text-gray-600">Chúc mừng sinh nhật khách hàng</p>
                        </div>
                      </div>
                      <div className="space-y-2 text-sm text-gray-600">
                        <div>• Tỷ lệ mở email: ~85%</div>
                        <div>• Tỷ lệ chuyển đổi: ~45%</div>
                        <div>• Chi phí: Thấp</div>
                        <div>• Thời gian thiết lập: 15 phút</div>
                        <div>• Phù hợp: Tất cả khách hàng có sinh nhật</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Customer Filtering */}
              {remarketingStep === 2 && (
                <div className="space-y-6">
                  <div className="text-center mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Bước 2: Lọc khách hàng mục tiêu</h3>
                    <p className="text-gray-600">Chọn các tiêu chí để lọc khách hàng cần remarketing</p>
                  </div>

                  {/* Filters */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Mức độ rủi ro</label>
                      <select
                        value={remarketingFilters.riskLevel}
                        onChange={(e) => setRemarketingFilters(prev => ({ ...prev, riskLevel: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                      >
                        <option value="">Tất cả</option>
                        <option value="high">Cao (≥70%)</option>
                        <option value="medium">Trung bình (40-69%)</option>
                        <option value="low">Thấp (&lt;40%)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Ngày chưa liên hệ</label>
                      <select
                        value={remarketingFilters.daysSinceLastContact}
                        onChange={(e) => setRemarketingFilters(prev => ({ ...prev, daysSinceLastContact: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                      >
                        <option value="">Tất cả</option>
                        <option value="7">≥ 7 ngày</option>
                        <option value="14">≥ 14 ngày</option>
                        <option value="30">≥ 30 ngày</option>
                        <option value="60">≥ 60 ngày</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Loại khách hàng</label>
                      <select
                        value={remarketingFilters.customerType}
                        onChange={(e) => setRemarketingFilters(prev => ({ ...prev, customerType: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                      >
                        <option value="">Tất cả</option>
                        <option value="diamond">Kim cương</option>
                        <option value="gold">Vàng</option>
                        <option value="silver">Bạc</option>
                        <option value="bronze">Đồng</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Điểm tương tác</label>
                      <select
                        value={remarketingFilters.engagementScore}
                        onChange={(e) => setRemarketingFilters(prev => ({ ...prev, engagementScore: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                      >
                        <option value="">Tất cả</option>
                        <option value="high">Cao (≥70)</option>
                        <option value="medium">Trung bình (40-69)</option>
                        <option value="low">Thấp (&lt;40)</option>
                      </select>
                    </div>
                  </div>

                  {/* Birthday Campaign Specific Filters */}
                  {remarketingCampaignType === 'birthday' && (
                    <div className="p-4 bg-pink-50 border border-pink-200 rounded-lg">
                      <h4 className="font-medium text-pink-800 mb-3 flex items-center">
                        🎂 Bộ lọc sinh nhật
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Khoảng thời gian</label>
                          <select
                            value={remarketingFilters.birthdayPeriod}
                            onChange={(e) => setRemarketingFilters(prev => ({ ...prev, birthdayPeriod: e.target.value, birthdayMonth: '' }))}
                            className="w-full px-3 py-2 border border-pink-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                          >
                            <option value="">Tháng này + tháng tới (mặc định)</option>
                            <option value="today">🎯 Hôm nay</option>
                            <option value="this_week">📅 Tuần này</option>
                            <option value="next_week">📅 Tuần tới</option>
                            <option value="this_month">📅 Tháng này</option>
                            <option value="next_month">📅 Tháng tới</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Tháng cụ thể</label>
                          <select
                            value={remarketingFilters.birthdayMonth}
                            onChange={(e) => setRemarketingFilters(prev => ({ ...prev, birthdayMonth: e.target.value, birthdayPeriod: '' }))}
                            className="w-full px-3 py-2 border border-pink-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                            disabled={remarketingFilters.birthdayPeriod !== ''}
                          >
                            <option value="">Chọn tháng sinh nhật</option>
                            <option value="0">Tháng 1</option>
                            <option value="1">Tháng 2</option>
                            <option value="2">Tháng 3</option>
                            <option value="3">Tháng 4</option>
                            <option value="4">Tháng 5</option>
                            <option value="5">Tháng 6</option>
                            <option value="6">Tháng 7</option>
                            <option value="7">Tháng 8</option>
                            <option value="8">Tháng 9</option>
                            <option value="9">Tháng 10</option>
                            <option value="10">Tháng 11</option>
                            <option value="11">Tháng 12</option>
                          </select>
                        </div>
                      </div>
                      
                      <div className="mt-3 text-sm text-pink-700">
                        💡 <strong>Gợi ý:</strong> 
                        {remarketingFilters.birthdayPeriod === 'today' && ' Gửi lời chúc vào đúng ngày sinh nhật'}
                        {remarketingFilters.birthdayPeriod === 'this_week' && ' Gửi trước 1-2 ngày để chuẩn bị quà'}
                        {remarketingFilters.birthdayPeriod === 'next_week' && ' Lên kế hoạch chiến dịch trước'}
                        {remarketingFilters.birthdayPeriod === 'this_month' && ' Chiến dịch sinh nhật tháng hiện tại'}
                        {remarketingFilters.birthdayPeriod === 'next_month' && ' Chuẩn bị chiến dịch tháng sau'}
                        {remarketingFilters.birthdayMonth && ` Tất cả khách hàng sinh tháng ${parseInt(remarketingFilters.birthdayMonth) + 1}`}
                        {!remarketingFilters.birthdayPeriod && !remarketingFilters.birthdayMonth && ' Tự động lọc sinh nhật gần nhất (tháng này + tháng tới)'}
                      </div>
                    </div>
                  )}

                  {/* Customer List */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-gray-900">
                        Khách hàng phù hợp ({getFilteredRemarketingCustomers().length})
                      </h4>
                      <button
                        onClick={handleSelectAllRemarketing}
                        className="text-sm text-orange-600 hover:text-orange-800 font-medium"
                      >
                        {selectedRemarketingCustomers.length === getFilteredRemarketingCustomers().length ? 'Bỏ chọn tất cả' : 'Chọn tất cả'}
                      </button>
                    </div>
                    
                    <div className="max-h-80 overflow-y-auto space-y-2">
                      {getFilteredRemarketingCustomers().map(customer => (
                        <div key={customer.id} className="flex items-center space-x-3 p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50">
                          <input
                            type="checkbox"
                            checked={selectedRemarketingCustomers.find(c => c.id === customer.id) !== undefined}
                            onChange={() => handleRemarketingCustomerToggle(customer)}
                            className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                          />
                          <div className="w-10 h-10 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-white font-medium">
                            {customer.name.charAt(0)}
                          </div>
                          <div className="flex-1">
                            <h5 className="font-medium text-gray-900">{customer.name}</h5>
                            <p className="text-sm text-gray-600">{customer.company}</p>
                            <div className="flex items-center space-x-4 mt-1">
                              {remarketingCampaignType === 'birthday' ? (
                                <>
                                  <span className="text-xs bg-pink-100 text-pink-800 px-2 py-1 rounded-full">
                                    🎂 {formatBirthday(customer.dateOfBirth)}
                                  </span>
                                  <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
                                    {customer.customerType === 'diamond' ? '💎 VIP' : 
                                     customer.customerType === 'gold' ? '🥇 Vàng' : 
                                     customer.customerType === 'silver' ? '🥈 Bạc' : '🥉 Đồng'}
                                  </span>
                                </>
                              ) : (
                                <>
                                  <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">
                                    {customer.churnRisk}% rủi ro
                                  </span>
                                  <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                                    {customer.daysSinceLastInteraction} ngày
                                  </span>
                                </>
                              )}
                              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                                {customer.engagementScore} điểm
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Campaign Setup */}
              {remarketingStep === 3 && (
                <div className="space-y-6">
                  <div className="text-center mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Bước 3: Thiết lập chiến dịch</h3>
                    <p className="text-gray-600">Cấu hình chi tiết cho chiến dịch {
                      remarketingCampaignType === 'email' ? 'Email' :
                      remarketingCampaignType === 'sms' ? 'SMS' :
                      remarketingCampaignType === 'phone' ? 'Phone' :
                      remarketingCampaignType === 'multi' ? 'Multi-Channel' :
                      remarketingCampaignType === 'social' ? 'Social Media' : 
                      remarketingCampaignType === 'promotion' ? 'Promotion' :
                      remarketingCampaignType === 'birthday' ? '🎂 Birthday' : 'Remarketing'
                    }</p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Campaign Details */}
                    <div className="space-y-4">
                      <h4 className="font-medium text-gray-900">Chi tiết chiến dịch</h4>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Tên chiến dịch</label>
                          <input
                            type="text"
                            defaultValue={
                              remarketingCampaignType === 'birthday' 
                                ? `🎂 Chúc mừng sinh nhật - ${new Date().toLocaleDateString('vi-VN')}`
                                : `Remarketing ${remarketingCampaignType.toUpperCase()} - ${new Date().toLocaleDateString('vi-VN')}`
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Thời gian bắt đầu</label>
                          <input
                            type="datetime-local"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                          />
                        </div>
                        {remarketingCampaignType === 'promotion' && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Mức giảm giá (%)</label>
                            <input
                              type="number"
                              defaultValue="20"
                              min="5"
                              max="50"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                            />
                          </div>
                        )}
                        {remarketingCampaignType === 'birthday' && (
                          <div className="space-y-3">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">🎁 Ưu đãi sinh nhật</label>
                              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500">
                                <option value="discount">Giảm giá 15%</option>
                                <option value="gift">Quà tặng miễn phí</option>
                                <option value="voucher">Voucher 100k</option>
                                <option value="combo">Combo ưu đãi</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">📅 Gửi trước sinh nhật</label>
                              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500">
                                <option value="0">Vào ngày sinh nhật</option>
                                <option value="1">1 ngày trước</option>
                                <option value="3">3 ngày trước</option>
                                <option value="7">1 tuần trước</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">💌 Template tin nhắn</label>
                              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500">
                                <option value="formal">Lời chúc trang trọng</option>
                                <option value="friendly">Lời chúc thân thiện</option>
                                <option value="cute">Lời chúc dễ thương</option>
                                <option value="business">Lời chúc kinh doanh</option>
                              </select>
                            </div>
                          </div>
                        )}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Ghi chú</label>
                          <textarea
                            rows={3}
                            placeholder="Ghi chú thêm về chiến dịch..."
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Selected Customers Summary */}
                    <div className="space-y-4">
                      <h4 className="font-medium text-gray-900">Khách hàng đã chọn ({selectedRemarketingCustomers.length})</h4>
                      <div className="max-h-80 overflow-y-auto space-y-2">
                        {selectedRemarketingCustomers.map(customer => (
                          <div key={customer.id} className="flex items-center space-x-3 p-3 bg-orange-50 border border-orange-200 rounded">
                            <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 font-medium text-sm">
                              {customer.name.charAt(0)}
                            </div>
                            <div className="flex-1">
                              <p className="font-medium text-gray-900">{customer.name}</p>
                              <p className="text-sm text-gray-600">{customer.email}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Campaign Preview */}
                  <div className={`border rounded-lg p-6 ${
                    remarketingCampaignType === 'birthday' 
                      ? 'bg-gradient-to-r from-pink-50 to-purple-50 border-pink-200' 
                      : 'bg-gradient-to-r from-orange-50 to-amber-50 border-orange-200'
                  }`}>
                    <h4 className={`font-medium mb-4 ${
                      remarketingCampaignType === 'birthday' ? 'text-pink-800' : 'text-orange-800'
                    }`}>
                      {remarketingCampaignType === 'birthday' ? '🎂 Dự báo hiệu quả chúc mừng sinh nhật' : '📊 Dự báo hiệu quả chiến dịch'}
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="text-center">
                        <p className={`text-2xl font-bold ${
                          remarketingCampaignType === 'birthday' ? 'text-pink-600' : 'text-orange-600'
                        }`}>{selectedRemarketingCustomers.length}</p>
                        <p className={`text-sm ${
                          remarketingCampaignType === 'birthday' ? 'text-pink-800' : 'text-orange-800'
                        }`}>
                          {remarketingCampaignType === 'birthday' ? 'Khách có sinh nhật' : 'Khách hàng'}
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-green-600">
                          {Math.round(selectedRemarketingCustomers.length * (
                            remarketingCampaignType === 'email' ? 0.25 :
                            remarketingCampaignType === 'sms' ? 0.98 :
                            remarketingCampaignType === 'phone' ? 0.45 :
                            remarketingCampaignType === 'multi' ? 0.65 :
                            remarketingCampaignType === 'social' ? 0.35 : 
                            remarketingCampaignType === 'birthday' ? 0.85 : 0.55
                          ) * 100) / 100}
                        </p>
                        <p className="text-sm text-green-800">
                          {remarketingCampaignType === 'birthday' ? 'Dự kiến mở email' : 'Dự kiến phản hồi'}
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-blue-600">
                          {Math.round(selectedRemarketingCustomers.length * (
                            remarketingCampaignType === 'birthday' ? 0.45 : 0.15
                          ))}
                        </p>
                        <p className="text-sm text-blue-800">Dự kiến chuyển đổi</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-purple-600">
                          {remarketingCampaignType === 'birthday' ? '45%' : '15%'}
                        </p>
                        <p className="text-sm text-purple-800">Tỷ lệ thành công</p>
                      </div>
                    </div>
                    
                    {/* Birthday specific preview */}
                    {remarketingCampaignType === 'birthday' && (
                      <div className="mt-4 p-4 bg-white rounded-lg border border-pink-200">
                        <h5 className="font-medium text-pink-800 mb-2">💌 Preview tin nhắn sinh nhật:</h5>
                        <div className="text-sm text-gray-700 italic bg-pink-50 p-3 rounded border-l-4 border-pink-400">
                          &quot;🎉 Chúc mừng sinh nhật {selectedRemarketingCustomers[0]?.name || '[Tên khách hàng]'}! 🎂<br/>
                          Nhân dịp sinh nhật đặc biệt này, chúng tôi gửi tặng bạn ưu đãi 15% cho tất cả sản phẩm. 🎁<br/>
                          Cảm ơn bạn đã luôn đồng hành cùng chúng tôi!&quot;
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Footer Actions */}
            <div className="flex items-center justify-between p-6 border-t bg-gray-50">
              <div className="text-sm text-gray-600">
                {remarketingStep === 1 && remarketingCampaignType && `Loại chiến dịch: ${remarketingCampaignType}`}
                {remarketingStep === 2 && `${selectedRemarketingCustomers.length} khách hàng đã chọn`}
                {remarketingStep === 3 && `Sẵn sàng chạy chiến dịch cho ${selectedRemarketingCustomers.length} khách hàng`}
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => {
                    if (remarketingStep > 1) {
                      setRemarketingStep(remarketingStep - 1)
                    } else {
                      setShowRemarketingModal(false)
                      setRemarketingStep(1)
                      setSelectedRemarketingCustomers([])
                      setRemarketingCampaignType('')
                      setRemarketingFilters({
                        riskLevel: '',
                        daysSinceLastContact: '',
                        customerType: '',
                        engagementScore: '',
                        birthdayPeriod: '',
                        birthdayMonth: ''
                      })
                    }
                  }}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  {remarketingStep > 1 ? 'Quay lại' : 'Đóng'}
                </button>
                <button
                  onClick={() => {
                    if (remarketingStep < 3) {
                      if (remarketingStep === 1 && !remarketingCampaignType) {
                        alert('Vui lòng chọn loại chiến dịch')
                        return
                      }
                      if (remarketingStep === 2 && selectedRemarketingCustomers.length === 0) {
                        alert('Vui lòng chọn ít nhất một khách hàng')
                        return
                      }
                      setRemarketingStep(remarketingStep + 1)
                    } else {
                      // Execute campaign
                      alert('Chiến dịch đã được tạo và sẽ chạy theo lịch trình!')
                      setShowRemarketingModal(false)
                      setRemarketingStep(1)
                      setSelectedRemarketingCustomers([])
                      setRemarketingCampaignType('')
                      setRemarketingFilters({
                        riskLevel: '',
                        daysSinceLastContact: '',
                        customerType: '',
                        engagementScore: '',
                        birthdayPeriod: '',
                        birthdayMonth: ''
                      })
                    }
                  }}
                  disabled={
                    (remarketingStep === 1 && !remarketingCampaignType) ||
                    (remarketingStep === 2 && selectedRemarketingCustomers.length === 0)
                  }
                  className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  {remarketingStep < 3 ? 'Tiếp tục' : 'Chạy chiến dịch'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Customer Modal */}
      {showAddCustomerModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-semibold text-gray-900">Thêm khách hàng mới</h3>
                  <button
                    onClick={() => setShowCustomerFieldSettingsModal(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-100 border border-gray-200 rounded-lg hover:bg-gray-200 hover:text-gray-700 transition-all"
                  >
                    {/* <Sliders className="w-3.5 h-3.5" /> */}
                    Thiết lập trường thông tin
                  </button>
                </div>
                <button
                  onClick={() => setShowAddCustomerModal(false)}
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
                      checked={newCustomerData.customerType === 'individual'}
                      onChange={(e) => handleInputChange('customerType', e.target.value)}
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
                      checked={newCustomerData.customerType === 'business'}
                      onChange={(e) => handleInputChange('customerType', e.target.value)}
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
                  <span className="text-red-500">*</span>
                  Thông tin bắt buộc
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Tên khách hàng <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={`${newCustomerData.firstName} ${newCustomerData.lastName}`.trim()}
                      onChange={(e) => {
                        const names = e.target.value.split(' ')
                        const firstName = names.slice(0, -1).join(' ') || ''
                        const lastName = names[names.length - 1] || ''
                        handleInputChange('firstName', firstName)
                        handleInputChange('lastName', lastName)
                      }}
                      placeholder="Nhập tên khách hàng..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Số điện thoại <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      value={newCustomerData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="0901234567"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      value={newCustomerData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="email@domain.com"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Company Information - Only show for business customers */}
              {newCustomerData.customerType === 'business' && (
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-blue-500" />
                    Thông tin công ty
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Tên công ty</label>
                      <input
                        type="text"
                        value={newCustomerData.company}
                        onChange={(e) => handleInputChange('company', e.target.value)}
                        placeholder="Tên công ty..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Chức vụ</label>
                      <input
                        type="text"
                        value={newCustomerData.position}
                        onChange={(e) => handleInputChange('position', e.target.value)}
                        placeholder="CEO, Manager..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Ngành nghề</label>
                      <CreatableSelect
                        options={allCustomerIndustryOptions}
                        value={newCustomerData.industry}
                        onChange={(value) => handleInputChange('industry', value)}
                        onAddNew={handleAddNewCustomerIndustry}
                        placeholder="Lựa chọn hoặc thêm mới"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Quy mô công ty (số nhân viên)</label>
                      <input
                        type="text"
                        value={newCustomerData.companySize}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, '')
                          handleInputChange('companySize', value)
                        }}
                        placeholder="Nhập số nhân viên"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Product and Package Selection - Required */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
                  <span className="text-red-500">*</span>
                  <Package className="w-4 h-4 text-purple-500" />
                  Chọn sản phẩm và gói dịch vụ
                </h4>
                
                {/* Add Product Section */}
                <div className="space-y-4 p-4 bg-gray-50 rounded-lg mb-4">
                  <h5 className="text-sm font-medium text-gray-700">Thêm sản phẩm mới:</h5>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Sản phẩm</label>
                      <select
                        value={tempProduct.selectedProduct}
                        onChange={(e) => {
                          setTempProduct(prev => ({
                            ...prev,
                            selectedProduct: e.target.value,
                            selectedPackage: '' // Reset package when product changes
                          }))
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Chọn sản phẩm...</option>
                        {products.map(product => (
                          <option key={product.id} value={product.id}>
                            {product.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Gói dịch vụ</label>
                      <select
                        value={tempProduct.selectedPackage}
                        onChange={(e) => {
                          setTempProduct(prev => ({
                            ...prev,
                            selectedPackage: e.target.value
                          }))
                        }}
                        disabled={!tempProduct.selectedProduct}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                      >
                        <option value="">Chọn gói...</option>
                        {tempProduct.selectedProduct && packages[tempProduct.selectedProduct as keyof typeof packages]?.map(pkg => (
                          <option key={pkg.id} value={pkg.id}>
                            {pkg.name} - {pkg.price.toLocaleString('vi-VN')} VND
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="flex items-end">
                      <button
                        type="button"
                        onClick={addProductToCustomer}
                        disabled={!tempProduct.selectedProduct || !tempProduct.selectedPackage}
                        className="w-full px-3 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                      >
                        <Plus className="w-4 h-4 inline mr-1" />
                        Thêm
                      </button>
                    </div>
                  </div>
                </div>

                {/* Selected Products List */}
                {newCustomerData.selectedProducts.length > 0 && (
                  <div className="space-y-3">
                    <h5 className="text-sm font-medium text-gray-700">Sản phẩm đã chọn:</h5>
                    <div className="space-y-2">
                      {newCustomerData.selectedProducts.map((product, index) => (
                        <div key={`${product.productId}-${product.packageId}`} className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-md">
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <h6 className="text-sm font-medium text-blue-900">
                                {product.productName} - {product.packageName}
                              </h6>
                              <span className="text-sm font-bold text-blue-600">
                                {product.price.toLocaleString('vi-VN')} VND
                              </span>
                            </div>
                            <div className="text-xs text-blue-700 mt-1">
                              <strong>Tính năng:</strong> {product.features.join(', ')}
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeProductFromCustomer(product.productId, product.packageId)}
                            className="ml-3 p-1 text-red-500 hover:text-red-700 hover:bg-red-100 rounded transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                    
                    {/* Total Amount */}
                    <div className="p-3 bg-green-50 border border-green-200 rounded-md">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-green-900">Tổng giá trị hàng:</span>
                        <span className="text-lg font-bold text-green-600">
                          {newCustomerData.totalAmount.toLocaleString('vi-VN')} VND
                        </span>
                      </div>
                    </div>

                    {/* Payment Information */}
                    <div className="p-4 border border-blue-200 rounded-lg bg-blue-50">
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
                          value={newCustomerData.discountPercent}
                          onChange={(e) => handleDiscountChange(Number(e.target.value))}
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="0"
                        />
                      </div>

                      {/* Payment Method */}
                      <div className="mb-3">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Hình thức thanh toán
                        </label>
                        <div className="space-y-2">
                          <label className="flex items-center">
                            <input
                              type="radio"
                              name="customerPaymentMethod"
                              value="cash"
                              checked={newCustomerData.paymentMethod === 'cash'}
                              onChange={(e) => handlePaymentMethodChange(e.target.value)}
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                            />
                            <span className="ml-2 text-sm text-gray-700">💵 Tiền mặt</span>
                          </label>
                          <label className="flex items-center">
                            <input
                              type="radio"
                              name="customerPaymentMethod"
                              value="transfer"
                              checked={newCustomerData.paymentMethod === 'transfer'}
                              onChange={(e) => handlePaymentMethodChange(e.target.value)}
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                            />
                            <span className="ml-2 text-sm text-gray-700">🏦 Chuyển khoản</span>
                          </label>
                        </div>
                      </div>

                      {/* Final Amount */}
                      <div className="bg-white rounded-md p-3 border border-blue-200">
                        <div className="flex justify-between text-sm">
                          <span>Tổng tiền hàng:</span>
                          <span>{newCustomerData.totalAmount.toLocaleString('vi-VN')} VND</span>
                        </div>
                        {newCustomerData.discountPercent > 0 && (
                          <div className="flex justify-between text-sm text-red-600">
                            <span>Giảm giá ({newCustomerData.discountPercent}%):</span>
                            <span>-{(newCustomerData.totalAmount * newCustomerData.discountPercent / 100).toLocaleString('vi-VN')} VND</span>
                          </div>
                        )}
                        <div className="flex justify-between text-sm font-medium border-t border-gray-200 pt-2 mt-2">
                          <span>Thành tiền:</span>
                          <span className="text-green-600">{newCustomerData.finalAmount.toLocaleString('vi-VN')} VND</span>
                        </div>
                        <div className="text-xs text-gray-600 mt-1">
                          Hình thức: {newCustomerData.paymentMethod === 'cash' ? '💵 Tiền mặt' : '🏦 Chuyển khoản'}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {newCustomerData.selectedProducts.length === 0 && (
                  <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                    <p className="text-sm text-yellow-700">
                      ⚠️ Vui lòng chọn ít nhất một sản phẩm và gói dịch vụ để tiếp tục
                    </p>
                  </div>
                )}
              </div>

              {/* Optional Information */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
                  <Info className="w-4 h-4 text-gray-500" />
                  Thông tin bổ sung
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Địa chỉ</label>
                    <input
                      type="text"
                      value={newCustomerData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      placeholder="Địa chỉ..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Nguồn khách hàng</label>
                    <CreatableSelect
                      options={allCustomerSourceOptions}
                      value={newCustomerData.source}
                      onChange={(value) => handleInputChange('source', value)}
                      onAddNew={handleAddNewCustomerSource}
                      placeholder="Lựa chọn hoặc thêm mới"
                    />
                  </div>
                </div>
                
                <div className="mt-4">
                  <label className="block text-xs font-medium text-gray-700 mb-1">Ghi chú</label>
                  <textarea
                    value={newCustomerData.notes}
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                    placeholder="Ghi chú về khách hàng..."
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
            
            <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={() => setShowAddCustomerModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={handleAddCustomer}
                disabled={!newCustomerData.firstName && !newCustomerData.lastName || !newCustomerData.email || !newCustomerData.phone || newCustomerData.selectedProducts.length === 0}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                Thêm khách hàng & Tạo đơn hàng ({newCustomerData.selectedProducts.length} sản phẩm)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Customer Field Settings Modal */}
      {showCustomerFieldSettingsModal && (
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
                      onClick={() => setShowCustomerFieldSettingsModal(false)}
                      className="px-4 py-2 text-sm font-medium hover:bg-green-700 transition-all text-white bg-green-600 rounded-r-lg flex items-center gap-1"
                    >
                      Lưu
                    </button>
                  </div>
                </div>
                <button 
                  onClick={() => setShowCustomerFieldSettingsModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="p-6 max-h-[60vh] overflow-y-auto">
              <div className="space-y-3">
                {/* Required fields - disabled */}
                <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200 opacity-70 cursor-not-allowed">
                  <span className="text-sm text-gray-600">Số điện thoại</span>
                  <input 
                    disabled 
                    type="checkbox" 
                    checked 
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded cursor-not-allowed" 
                  />
                </label>
                <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200 opacity-70 cursor-not-allowed">
                  <span className="text-sm text-gray-600">Email</span>
                  <input 
                    disabled 
                    type="checkbox" 
                    checked 
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded cursor-not-allowed" 
                  />
                </label>

                {/* Configurable fields */}
                <label className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer">
                  <span className="text-sm text-gray-700">Tên khách hàng</span>
                  <input 
                    type="checkbox" 
                    checked={customerFormFieldVisibility.customerName}
                    onChange={(e) => setCustomerFormFieldVisibility(prev => ({ ...prev, customerName: e.target.checked }))}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 cursor-pointer" 
                  />
                </label>
                <label className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer">
                  <span className="text-sm text-gray-700">Công ty</span>
                  <input 
                    type="checkbox" 
                    checked={customerFormFieldVisibility.company}
                    onChange={(e) => setCustomerFormFieldVisibility(prev => ({ ...prev, company: e.target.checked }))}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 cursor-pointer" 
                  />
                </label>
                <label className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer">
                  <span className="text-sm text-gray-700">Chức vụ</span>
                  <input 
                    type="checkbox" 
                    checked={customerFormFieldVisibility.position}
                    onChange={(e) => setCustomerFormFieldVisibility(prev => ({ ...prev, position: e.target.checked }))}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 cursor-pointer" 
                  />
                </label>
                <label className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer">
                  <span className="text-sm text-gray-700">Ngành nghề</span>
                  <input 
                    type="checkbox" 
                    checked={customerFormFieldVisibility.industry}
                    onChange={(e) => setCustomerFormFieldVisibility(prev => ({ ...prev, industry: e.target.checked }))}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 cursor-pointer" 
                  />
                </label>
                <label className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer">
                  <span className="text-sm text-gray-700">Quy mô công ty</span>
                  <input 
                    type="checkbox" 
                    checked={customerFormFieldVisibility.companySize}
                    onChange={(e) => setCustomerFormFieldVisibility(prev => ({ ...prev, companySize: e.target.checked }))}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 cursor-pointer" 
                  />
                </label>
                <label className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer">
                  <span className="text-sm text-gray-700">Địa chỉ</span>
                  <input 
                    type="checkbox" 
                    checked={customerFormFieldVisibility.address}
                    onChange={(e) => setCustomerFormFieldVisibility(prev => ({ ...prev, address: e.target.checked }))}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 cursor-pointer" 
                  />
                </label>
                <label className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer">
                  <span className="text-sm text-gray-700">Nguồn</span>
                  <input 
                    type="checkbox" 
                    checked={customerFormFieldVisibility.source}
                    onChange={(e) => setCustomerFormFieldVisibility(prev => ({ ...prev, source: e.target.checked }))}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 cursor-pointer" 
                  />
                </label>
                <label className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer">
                  <span className="text-sm text-gray-700">Sản phẩm quan tâm</span>
                  <input 
                    type="checkbox" 
                    checked={customerFormFieldVisibility.product}
                    onChange={(e) => setCustomerFormFieldVisibility(prev => ({ ...prev, product: e.target.checked }))}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 cursor-pointer" 
                  />
                </label>
                <label className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer">
                  <span className="text-sm text-gray-700">Nội dung quan tâm</span>
                  <input 
                    type="checkbox" 
                    checked={customerFormFieldVisibility.content}
                    onChange={(e) => setCustomerFormFieldVisibility(prev => ({ ...prev, content: e.target.checked }))}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 cursor-pointer" 
                  />
                </label>
                <label className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer">
                  <span className="text-sm text-gray-700">Ghi chú</span>
                  <input 
                    type="checkbox" 
                    checked={customerFormFieldVisibility.notes}
                    onChange={(e) => setCustomerFormFieldVisibility(prev => ({ ...prev, notes: e.target.checked }))}
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

      {/* Ranking Definition Modal */}
      {showRankingDefinitionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b">
              <div className="flex items-center space-x-3">
                <Crown className="w-6 h-6 text-yellow-600" />
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Cài đặt phân hạng khách hàng</h2>
                  <p className="text-gray-600">Tiêu chí và ngưỡng phân loại khách hàng</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                {!isEditingRanking ? (
                  <button
                    onClick={() => setIsEditingRanking(true)}
                    className="inline-flex items-center px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Chỉnh sửa
                  </button>
                ) : (
                  <>
                    <button
                      onClick={handleSaveRankingSettings}
                      className="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <Save className="w-4 h-4 mr-1" />
                      Lưu
                    </button>
                    <button
                      onClick={handleCancelEditRanking}
                      className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-600 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Hủy
                    </button>
                  </>
                )}
                <button
                  onClick={() => setShowRankingDefinitionModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
              {/* Ranking Tiers */}
              <div className="space-y-6">
                {/* Diamond */}
                <div className="border border-purple-200 rounded-lg p-6 bg-gradient-to-r from-purple-50 to-pink-50">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                      <Crown className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-purple-800">💎 Kim Cương (Diamond)</h3>
                      <p className="text-purple-600">Khách hàng VIP cao cấp nhất</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <h4 className="font-semibold text-purple-700">Tiêu chí chính:</h4>
                      {isEditingRanking ? (
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-purple-600 w-32">Tổng chi tiêu:</span>
                            <input
                              type="number"
                              value={rankingSettings.diamond.totalSpent}
                              onChange={(e) => updateRankingSetting('diamond', 'totalSpent', parseInt(e.target.value) || 0)}
                              className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded"
                            />
                            <span className="text-sm text-purple-600">VND</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-purple-600 w-32">Số đơn hàng:</span>
                            <input
                              type="number"
                              value={rankingSettings.diamond.orderCount}
                              onChange={(e) => updateRankingSetting('diamond', 'orderCount', parseInt(e.target.value) || 0)}
                              className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded"
                            />
                            <span className="text-sm text-purple-600">đơn</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-purple-600 w-32">Thời gian:</span>
                            <input
                              type="number"
                              value={rankingSettings.diamond.timeAsCustomer}
                              onChange={(e) => updateRankingSetting('diamond', 'timeAsCustomer', parseInt(e.target.value) || 0)}
                              className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded"
                            />
                            <span className="text-sm text-purple-600">tháng</span>
                          </div>
                        </div>
                      ) : (
                        <ul className="text-sm text-purple-600 space-y-1">
                          <li>• Tổng chi tiêu: ≥ {rankingSettings.diamond.totalSpent.toLocaleString('vi-VN')} VND</li>
                          <li>• Số đơn hàng: ≥ {rankingSettings.diamond.orderCount} đơn</li>
                          <li>• Thời gian là khách hàng: ≥ {Math.floor(rankingSettings.diamond.timeAsCustomer / 12)} năm</li>
                        </ul>
                      )}
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-purple-700">Đặc quyền:</h4>
                        {isEditingRanking && (
                          <button
                            onClick={() => addBenefit('diamond')}
                            className="text-purple-600 hover:text-purple-800"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                      {isEditingRanking ? (
                        <div className="space-y-1">
                          {rankingSettings.diamond.benefits.map((benefit, index) => (
                            <div key={index} className="flex items-center space-x-2">
                              <input
                                type="text"
                                value={benefit}
                                onChange={(e) => {
                                  const newBenefits = [...rankingSettings.diamond.benefits]
                                  newBenefits[index] = e.target.value
                                  updateRankingSetting('diamond', 'benefits', newBenefits)
                                }}
                                className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded"
                              />
                              <button
                                onClick={() => removeBenefit('diamond', index)}
                                className="text-red-500 hover:text-red-700"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <ul className="text-sm text-purple-600 space-y-1">
                          {rankingSettings.diamond.benefits.map((benefit, index) => (
                            <li key={index}>• {benefit}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </div>

                {/* Gold */}
                <div className="border border-yellow-200 rounded-lg p-6 bg-gradient-to-r from-yellow-50 to-amber-50">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-amber-500 rounded-full flex items-center justify-center">
                      <Star className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-yellow-800">🥇 Vàng (Gold)</h3>
                      <p className="text-yellow-600">Khách hàng trung thành cao</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <h4 className="font-semibold text-yellow-700">Tiêu chí chính:</h4>
                      {isEditingRanking ? (
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-yellow-600 w-32">Tổng chi tiêu:</span>
                            <input
                              type="number"
                              value={rankingSettings.gold.totalSpent}
                              onChange={(e) => updateRankingSetting('gold', 'totalSpent', parseInt(e.target.value) || 0)}
                              className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded"
                            />
                            <span className="text-sm text-yellow-600">VND</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-yellow-600 w-32">Số đơn hàng:</span>
                            <input
                              type="number"
                              value={rankingSettings.gold.orderCount}
                              onChange={(e) => updateRankingSetting('gold', 'orderCount', parseInt(e.target.value) || 0)}
                              className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded"
                            />
                            <span className="text-sm text-yellow-600">đơn</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-yellow-600 w-32">Thời gian:</span>
                            <input
                              type="number"
                              value={rankingSettings.gold.timeAsCustomer}
                              onChange={(e) => updateRankingSetting('gold', 'timeAsCustomer', parseInt(e.target.value) || 0)}
                              className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded"
                            />
                            <span className="text-sm text-yellow-600">tháng</span>
                          </div>
                        </div>
                      ) : (
                        <ul className="text-sm text-yellow-600 space-y-1">
                          <li>• Tổng chi tiêu: ≥ {rankingSettings.gold.totalSpent.toLocaleString('vi-VN')} VND</li>
                          <li>• Số đơn hàng: ≥ {rankingSettings.gold.orderCount} đơn</li>
                          <li>• Thời gian là khách hàng: ≥ {Math.floor(rankingSettings.gold.timeAsCustomer / 12)} năm</li>
                        </ul>
                      )}
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-yellow-700">Đặc quyền:</h4>
                        {isEditingRanking && (
                          <button
                            onClick={() => addBenefit('gold')}
                            className="text-yellow-600 hover:text-yellow-800"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                      {isEditingRanking ? (
                        <div className="space-y-1">
                          {rankingSettings.gold.benefits.map((benefit, index) => (
                            <div key={index} className="flex items-center space-x-2">
                              <input
                                type="text"
                                value={benefit}
                                onChange={(e) => {
                                  const newBenefits = [...rankingSettings.gold.benefits]
                                  newBenefits[index] = e.target.value
                                  updateRankingSetting('gold', 'benefits', newBenefits)
                                }}
                                className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded"
                              />
                              <button
                                onClick={() => removeBenefit('gold', index)}
                                className="text-red-500 hover:text-red-700"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <ul className="text-sm text-yellow-600 space-y-1">
                          {rankingSettings.gold.benefits.map((benefit, index) => (
                            <li key={index}>• {benefit}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </div>

                {/* Silver */}
                <div className="border border-gray-200 rounded-lg p-6 bg-gradient-to-r from-gray-50 to-slate-50">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-gray-400 to-slate-400 rounded-full flex items-center justify-center">
                      <Award className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-800">🥈 Bạc (Silver)</h3>
                      <p className="text-gray-600">Khách hàng ổn định</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <h4 className="font-semibold text-gray-700">Tiêu chí chính:</h4>
                      {isEditingRanking ? (
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-600 w-32">Tổng chi tiêu:</span>
                            <input
                              type="number"
                              value={rankingSettings.silver.totalSpent}
                              onChange={(e) => updateRankingSetting('silver', 'totalSpent', parseInt(e.target.value) || 0)}
                              className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded"
                            />
                            <span className="text-sm text-gray-600">VND</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-600 w-32">Số đơn hàng:</span>
                            <input
                              type="number"
                              value={rankingSettings.silver.orderCount}
                              onChange={(e) => updateRankingSetting('silver', 'orderCount', parseInt(e.target.value) || 0)}
                              className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded"
                            />
                            <span className="text-sm text-gray-600">đơn</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-600 w-32">Thời gian:</span>
                            <input
                              type="number"
                              value={rankingSettings.silver.timeAsCustomer}
                              onChange={(e) => updateRankingSetting('silver', 'timeAsCustomer', parseInt(e.target.value) || 0)}
                              className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded"
                            />
                            <span className="text-sm text-gray-600">tháng</span>
                          </div>
                        </div>
                      ) : (
                        <ul className="text-sm text-gray-600 space-y-1">
                          <li>• Tổng chi tiêu: ≥ {rankingSettings.silver.totalSpent.toLocaleString('vi-VN')} VND</li>
                          <li>• Số đơn hàng: ≥ {rankingSettings.silver.orderCount} đơn</li>
                          <li>• Thời gian là khách hàng: ≥ {Math.floor(rankingSettings.silver.timeAsCustomer / 12)} năm</li>
                        </ul>
                      )}
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-gray-700">Đặc quyền:</h4>
                        {isEditingRanking && (
                          <button
                            onClick={() => addBenefit('silver')}
                            className="text-gray-600 hover:text-gray-800"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                      {isEditingRanking ? (
                        <div className="space-y-1">
                          {rankingSettings.silver.benefits.map((benefit, index) => (
                            <div key={index} className="flex items-center space-x-2">
                              <input
                                type="text"
                                value={benefit}
                                onChange={(e) => {
                                  const newBenefits = [...rankingSettings.silver.benefits]
                                  newBenefits[index] = e.target.value
                                  updateRankingSetting('silver', 'benefits', newBenefits)
                                }}
                                className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded"
                              />
                              <button
                                onClick={() => removeBenefit('silver', index)}
                                className="text-red-500 hover:text-red-700"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <ul className="text-sm text-gray-600 space-y-1">
                          {rankingSettings.silver.benefits.map((benefit, index) => (
                            <li key={index}>• {benefit}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </div>

                {/* Bronze */}
                <div className="border border-orange-200 rounded-lg p-6 bg-gradient-to-r from-orange-50 to-amber-50">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-amber-600 rounded-full flex items-center justify-center">
                      <UserCheck className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-orange-800">🥉 Đồng (Bronze)</h3>
                      <p className="text-orange-600">Khách hàng mới/cơ bản</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <h4 className="font-semibold text-orange-700">Tiêu chí chính:</h4>
                      {isEditingRanking ? (
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-orange-600 w-32">Tổng chi tiêu:</span>
                            <input
                              type="number"
                              value={rankingSettings.bronze.totalSpent}
                              onChange={(e) => updateRankingSetting('bronze', 'totalSpent', parseInt(e.target.value) || 0)}
                              className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded"
                            />
                            <span className="text-sm text-orange-600">VND</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-orange-600 w-32">Số đơn hàng:</span>
                            <input
                              type="number"
                              value={rankingSettings.bronze.orderCount}
                              onChange={(e) => updateRankingSetting('bronze', 'orderCount', parseInt(e.target.value) || 0)}
                              className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded"
                            />
                            <span className="text-sm text-orange-600">đơn</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-orange-600 w-32">Thời gian:</span>
                            <input
                              type="number"
                              value={rankingSettings.bronze.timeAsCustomer}
                              onChange={(e) => updateRankingSetting('bronze', 'timeAsCustomer', parseInt(e.target.value) || 0)}
                              className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded"
                            />
                            <span className="text-sm text-orange-600">tháng</span>
                          </div>
                        </div>
                      ) : (
                        <ul className="text-sm text-orange-600 space-y-1">
                          <li>• Tổng chi tiêu: ≥ {rankingSettings.bronze.totalSpent.toLocaleString('vi-VN')} VND</li>
                          <li>• Số đơn hàng: ≥ {rankingSettings.bronze.orderCount} đơn</li>
                          <li>• Thời gian là khách hàng: ≥ {Math.floor(rankingSettings.bronze.timeAsCustomer / 12)} năm</li>
                        </ul>
                      )}
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-orange-700">Đặc quyền:</h4>
                        {isEditingRanking && (
                          <button
                            onClick={() => addBenefit('bronze')}
                            className="text-orange-600 hover:text-orange-800"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                      {isEditingRanking ? (
                        <div className="space-y-1">
                          {rankingSettings.bronze.benefits.map((benefit, index) => (
                            <div key={index} className="flex items-center space-x-2">
                              <input
                                type="text"
                                value={benefit}
                                onChange={(e) => {
                                  const newBenefits = [...rankingSettings.bronze.benefits]
                                  newBenefits[index] = e.target.value
                                  updateRankingSetting('bronze', 'benefits', newBenefits)
                                }}
                                className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded"
                              />
                              <button
                                onClick={() => removeBenefit('bronze', index)}
                                className="text-red-500 hover:text-red-700"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <ul className="text-sm text-orange-600 space-y-1">
                          {rankingSettings.bronze.benefits.map((benefit, index) => (
                            <li key={index}>• {benefit}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </div>

                {/* New */}
                <div className="border border-blue-200 rounded-lg p-6 bg-gradient-to-r from-blue-50 to-indigo-50">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                      <UserPlus className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-blue-800">🎯 Mới (New)</h3>
                      <p className="text-blue-600">Khách hàng tiềm năng</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <h4 className="font-semibold text-blue-700">Tiêu chí chính:</h4>
                      {isEditingRanking ? (
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-blue-600 w-32">Tổng chi tiêu:</span>
                            <input
                              type="number"
                              value={rankingSettings.new.totalSpent}
                              onChange={(e) => updateRankingSetting('new', 'totalSpent', parseInt(e.target.value) || 0)}
                              className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded"
                            />
                            <span className="text-sm text-blue-600">VND</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-blue-600 w-32">Số đơn hàng:</span>
                            <input
                              type="number"
                              value={rankingSettings.new.orderCount}
                              onChange={(e) => updateRankingSetting('new', 'orderCount', parseInt(e.target.value) || 0)}
                              className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded"
                            />
                            <span className="text-sm text-blue-600">đơn</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-blue-600 w-32">Thời gian:</span>
                            <input
                              type="number"
                              value={rankingSettings.new.timeAsCustomer}
                              onChange={(e) => updateRankingSetting('new', 'timeAsCustomer', parseInt(e.target.value) || 0)}
                              className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded"
                            />
                            <span className="text-sm text-blue-600">tháng</span>
                          </div>
                        </div>
                      ) : (
                        <ul className="text-sm text-blue-600 space-y-1">
                          <li>• Tổng chi tiêu: {rankingSettings.new.totalSpent.toLocaleString('vi-VN')} VND</li>
                          <li>• Số đơn hàng: {rankingSettings.new.orderCount} đơn</li>
                          <li>• Thời gian là khách hàng: {rankingSettings.new.timeAsCustomer} tháng</li>
                        </ul>
                      )}
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-blue-700">Đặc quyền:</h4>
                        {isEditingRanking && (
                          <button
                            onClick={() => addBenefit('new')}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                      {isEditingRanking ? (
                        <div className="space-y-1">
                          {rankingSettings.new.benefits.map((benefit, index) => (
                            <div key={index} className="flex items-center space-x-2">
                              <input
                                type="text"
                                value={benefit}
                                onChange={(e) => {
                                  const newBenefits = [...rankingSettings.new.benefits]
                                  newBenefits[index] = e.target.value
                                  updateRankingSetting('new', 'benefits', newBenefits)
                                }}
                                className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded"
                              />
                              <button
                                onClick={() => removeBenefit('new', index)}
                                className="text-red-500 hover:text-red-700"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <ul className="text-sm text-blue-600 space-y-1">
                          {rankingSettings.new.benefits.map((benefit, index) => (
                            <li key={index}>• {benefit}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </div>

                {/* Additional Info */}
                <div className="border border-blue-200 rounded-lg p-6 bg-blue-50">
                  <h3 className="text-lg font-bold text-blue-800 mb-4">📋 Quy trình đánh giá</h3>
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
              </div>
            </div>

            <div className="flex items-center justify-end p-6 border-t bg-gray-50">
              <button
                onClick={() => setShowRankingDefinitionModal(false)}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Đã hiểu
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-6">
      {/* Header with Actions */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Chăm sóc Khách hàng</h1>
          <p className="text-gray-600">Quản lý thông tin chi tiết và hành vi khách hàng</p>
        </div>
      </div>

      {/* Section 1: Tổng quan - Phân loại khách hàng */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800">Phân loại khách hàng</h2>
          <div className="flex items-center space-x-3">
            {filterCustomerType && (
              <div className="flex items-center space-x-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                <span>Đang lọc: {
                  filterCustomerType === 'diamond' ? 'VIP' :
                  filterCustomerType === 'gold' ? 'Vàng' :
                  filterCustomerType === 'silver' ? 'Bạc' :
                  filterCustomerType === 'bronze' ? 'Đồng' :
                  filterCustomerType === 'new' ? 'Mới' :
                  filterCustomerType === 'returning' ? 'Quay lại' : filterCustomerType
                }</span>
                <button 
                  onClick={() => setFilterCustomerType('')}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {/* VIP Customer - Kim cương */}
          <div 
            onClick={() => handleCustomerTypeFilter('diamond')}
            className={`flex flex-col justify-between rounded-lg px-6 py-5 min-w-[180px] bg-gradient-to-br from-purple-600 to-purple-400 text-white shadow-lg cursor-pointer relative transition-all hover:shadow-xl ${
              filterCustomerType === 'diamond' ? 'ring-4 ring-purple-300' : ''
            }`}
          >
            <div className="absolute top-2 right-2">
              <Info className="w-3.5 h-3.5 text-white/70 hover:text-white cursor-help transition-colors" />
            </div>
            <div>
              <p className="text-base font-semibold text-white mb-2">Kim cương</p>
              <p className="text-4xl font-extrabold text-white mb-1">
                {filteredCustomers.filter(c => c.customerType === 'diamond').length}
              </p>
              <div className="flex items-center justify-between mt-3">
                <p className="text-sm text-white/90">T.trước: 2</p>
                <p className="text-sm text-white/90 font-semibold">+12%</p>
              </div>
            </div>
          </div>

          {/* Gold Customer - Vàng */}
          <div 
            onClick={() => handleCustomerTypeFilter('gold')}
            className={`flex flex-col justify-between rounded-lg px-6 py-5 min-w-[180px] bg-gradient-to-br from-yellow-500 to-yellow-400 text-white shadow-lg cursor-pointer relative transition-all hover:shadow-xl ${
              filterCustomerType === 'gold' ? 'ring-4 ring-yellow-300' : ''
            }`}
          >
            <div className="absolute top-2 right-2">
              <Info className="w-3.5 h-3.5 text-white/70 hover:text-white cursor-help transition-colors" />
            </div>
            <div>
              <p className="text-base font-semibold text-white mb-2">Vàng</p>
              <p className="text-4xl font-extrabold text-white mb-1">
                {filteredCustomers.filter(c => c.customerType === 'gold').length}
              </p>
              <div className="flex items-center justify-between mt-3">
                <p className="text-sm text-white/90">T.trước: 2</p>
                <p className="text-sm text-white/90 font-semibold">+5%</p>
              </div>
            </div>
          </div>

          {/* Silver Customer - Bạc */}
          <div 
            onClick={() => handleCustomerTypeFilter('silver')}
            className={`flex flex-col justify-between rounded-lg px-6 py-5 min-w-[180px] bg-gradient-to-br from-gray-500 to-gray-400 text-white shadow-lg cursor-pointer relative transition-all hover:shadow-xl ${
              filterCustomerType === 'silver' ? 'ring-4 ring-gray-300' : ''
            }`}
          >
            <div className="absolute top-2 right-2">
              <Info className="w-3.5 h-3.5 text-white/70 hover:text-white cursor-help transition-colors" />
            </div>
            <div>
              <p className="text-base font-semibold text-white mb-2">Bạc</p>
              <p className="text-4xl font-extrabold text-white mb-1">
                {filteredCustomers.filter(c => c.customerType === 'silver').length}
              </p>
              <div className="flex items-center justify-between mt-3">
                <p className="text-sm text-white/90">T.trước: 3</p>
                <p className="text-sm text-white/90 font-semibold">+12%</p>
              </div>
            </div>
          </div>

          {/* Bronze Customer - Đồng */}
          <div 
            onClick={() => handleCustomerTypeFilter('bronze')}
            className={`flex flex-col justify-between rounded-lg px-6 py-5 min-w-[180px] bg-gradient-to-br from-orange-500 to-orange-400 text-white shadow-lg cursor-pointer relative transition-all hover:shadow-xl ${
              filterCustomerType === 'bronze' ? 'ring-4 ring-orange-300' : ''
            }`}
          >
            <div className="absolute top-2 right-2">
              <Info className="w-3.5 h-3.5 text-white/70 hover:text-white cursor-help transition-colors" />
            </div>
            <div>
              <p className="text-base font-semibold text-white mb-2">Đồng</p>
              <p className="text-4xl font-extrabold text-white mb-1">
                {filteredCustomers.filter(c => c.customerType === 'bronze').length}
              </p>
              <div className="flex items-center justify-between mt-3">
                <p className="text-sm text-white/90">T.trước: 3</p>
                <p className="text-sm text-white/90 font-semibold">+3%</p>
              </div>
            </div>
          </div>

          {/* New Customer - Mới */}
          <div 
            onClick={() => handleCustomerTypeFilter('new')}
            className={`flex flex-col justify-between rounded-lg px-6 py-5 min-w-[180px] bg-gradient-to-br from-blue-600 to-blue-400 text-white shadow-lg cursor-pointer relative transition-all hover:shadow-xl ${
              filterCustomerType === 'new' ? 'ring-4 ring-blue-300' : ''
            }`}
          >
            <div className="absolute top-2 right-2">
              <Info className="w-3.5 h-3.5 text-white/70 hover:text-white cursor-help transition-colors" />
            </div>
            <div>
              <p className="text-base font-semibold text-white mb-2">Mới</p>
              <p className="text-4xl font-extrabold text-white mb-1">
                {filteredCustomers.filter(c => c.customerType === 'new').length}
              </p>
              <div className="flex items-center justify-between mt-3">
                <p className="text-sm text-white/90">T.trước: 1</p>
                <p className="text-sm text-white/90 font-semibold">+15%</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content based on selected view */}
      {selectedView === 'list' && (
        <>
          {/* Section 3: Thanh công cụ tìm kiếm và lọc */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3 flex-wrap gap-y-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Tìm kiếm khách hàng..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 w-64 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                </div>
                <select 
                  value={filterStatus} 
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                >
                  <option value="">Tất cả trạng thái</option>
                  <option value="vip">💎 VIP</option>
                  <option value="active">✅ Hoạt động</option>
                  <option value="inactive">⏸️ Không hoạt động</option>
                  <option value="at-risk">⚠️ Có nguy cơ</option>
                  <option value="churned">❌ Đã churn</option>
                  <option value="dormant">💤 Tạm ngưng</option>
                </select>
                <select 
                  value={filterCustomerType} 
                  onChange={(e) => setFilterCustomerType(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                >
                  <option value="">Tất cả hạng</option>
                  <option value="diamond">Kim cương</option>
                  <option value="gold">Vàng</option>
                  <option value="silver">Bạc</option>
                  <option value="bronze">Đồng</option>
                  <option value="new">Mới</option>
                  <option value="returning">Quay lại</option>
                </select>
                <select 
                  value={sortBy} 
                  onChange={(e) => setSortBy(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                >
                  <option value="name">Sắp xếp theo tên</option>
                  <option value="lastInteraction">Tương tác gần nhất</option>
                  <option value="totalValue">Giá trị</option>
                </select>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                  className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                >
                  <Filter className="w-4 h-4" />
                  <span>Lọc nâng cao</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${showAdvancedFilters ? 'rotate-180' : ''}`} />
                </button>
                <div className="relative">
                  <button
                    onClick={() => setShowColumnSelector(!showColumnSelector)}
                    className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                  >
                    <Columns className="w-4 h-4" />
                    <span>Hiển thị cột</span>
                  </button>
                  {showColumnSelector && (
                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
                      <div className="p-4">
                        <h4 className="font-medium text-gray-900 mb-3">Tùy chỉnh cột hiển thị</h4>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-2 max-h-72 overflow-y-auto">
                          {[
                            { key: 'email', label: 'Mail' },
                            { key: 'company', label: 'Công ty' },
                            { key: 'address', label: 'Địa chỉ' },
                            { key: 'region', label: 'Khu vực' },
                            { key: 'customerType', label: 'Loại khách hàng' },
                            { key: 'segment', label: 'Phân loại' },
                            { key: 'tags', label: 'Tags' },
                            { key: 'source', label: 'Nguồn' },
                            { key: 'accountManager', label: 'Sales phụ trách' },
                            { key: 'status', label: 'Trạng thái' },
                            { key: 'totalOrderValue', label: 'Tổng giá trị đơn' },
                            { key: 'orderCount', label: 'Số đơn hàng' },
                            { key: 'lastOrderDate', label: 'Đơn hàng gần nhất' },
                            { key: 'averageOrderValue', label: 'Giá trị đơn TB' },
                            { key: 'actions', label: 'Thao tác' }
                          ].map(column => (
                            <label key={column.key} className="flex items-center space-x-2 py-1">
                              <input
                                type="checkbox"
                                checked={visibleColumns[column.key as keyof typeof visibleColumns]}
                                onChange={(e) => setVisibleColumns(prev => ({
                                  ...prev,
                                  [column.key]: e.target.checked
                                }))}
                                className="w-4 h-4 text-blue-800 rounded focus:ring-blue-500 border-gray-300"
                              />
                              <span className="text-sm text-gray-700">{column.label}</span>
                            </label>
                          ))}
                        </div>
                        <div className="flex gap-3 mt-4 pt-3 border-t border-gray-200">
                          <button
                            onClick={() => setVisibleColumns({
                              checkbox: true,
                              no: true,
                              customerName: true,
                              phoneNumber: true,
                              email: true,
                              company: true,
                              address: true,
                              region: true,
                              customerType: true,
                              segment: true,
                              tags: true,
                              source: true,
                              accountManager: true,
                              status: true,
                              lifecycleStage: false,
                              totalOrderValue: true,
                              orderCount: true,
                              lastOrderDate: true,
                              averageOrderValue: true,
                              lastContactDate: false,
                              interactionCount: false,
                              createdDate: false,
                              npsScore: false,
                              customerScore: false,
                              actions: true
                            })}
                            className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-800 rounded-lg hover:bg-blue-900 transition-colors"
                          >
                            Tất cả
                          </button>
                          <button
                            onClick={() => {
                              setVisibleColumns({
                                checkbox: true,
                                no: true,
                                customerName: true,
                                phoneNumber: true,
                                email: true,
                                company: true,
                                address: false,
                                region: true,
                                customerType: true,
                                segment: true,
                                tags: true,
                                source: true,
                                accountManager: true,
                                status: true,
                                lifecycleStage: false,
                                totalOrderValue: true,
                                orderCount: true,
                                lastOrderDate: true,
                                averageOrderValue: true,
                                lastContactDate: false,
                                interactionCount: false,
                                createdDate: false,
                                npsScore: false,
                                customerScore: false,
                                actions: true
                              })
                              setShowColumnSelector(false)
                            }}
                            className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                          >
                            Mặc định
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Import Customer Button */}
                <button 
                  className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
                >
                  <Download className="w-4 h-4" />
                  <span>Nhập khách hàng</span>
                </button>

                {/* Add Customer Button */}
                <button 
                  onClick={() => setShowAddCustomerModal(true)}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>Thêm khách hàng</span>
                </button>
              </div>
            </div>

            {/* Advanced Filters - Inside toolbar container */}
            {showAdvancedFilters && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                {/* Row 1: 4 columns - Người phụ trách, Khu vực, Sản phẩm đã mua, Tag */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                  {/* Người phụ trách */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Người phụ trách</label>
                    <div className="relative">
                      <select
                        value={filterAssignedPerson}
                        onChange={(e) => setFilterAssignedPerson(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm bg-white appearance-none cursor-pointer focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Chọn người phụ trách</option>
                        <option value="Nguyễn Văn A">Nguyễn Văn A</option>
                        <option value="Trần Thị B">Trần Thị B</option>
                        <option value="Lê Văn C">Lê Văn C</option>
                        <option value="Phạm Thị D">Phạm Thị D</option>
                        <option value="Hoàng Văn E">Hoàng Văn E</option>
                      </select>
                      <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>

                  {/* Khu vực */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Khu vực</label>
                    <div className="relative">
                      <select
                        value={filterRegion}
                        onChange={(e) => setFilterRegion(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm bg-white appearance-none cursor-pointer focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Chọn khu vực</option>
                        <option value="Hà Nội">Hà Nội</option>
                        <option value="TP.HCM">TP.HCM</option>
                        <option value="Đà Nẵng">Đà Nẵng</option>
                        <option value="Hải Phòng">Hải Phòng</option>
                        <option value="Cần Thơ">Cần Thơ</option>
                      </select>
                      <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>

                  {/* Sản phẩm đã mua */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Sản phẩm đã mua</label>
                    <div className="relative">
                      <select
                        value={filterPurchasedProduct.length > 0 ? filterPurchasedProduct[0] : ''}
                        onChange={(e) => {
                          if (e.target.value) {
                            setFilterPurchasedProduct([e.target.value])
                          } else {
                            setFilterPurchasedProduct([])
                          }
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm bg-white appearance-none cursor-pointer focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Chọn sản phẩm</option>
                        {Array.from(new Set(customers.flatMap(c => c.products?.map(p => p.name) || []))).map(productName => (
                          <option key={productName} value={productName}>{productName}</option>
                        ))}
                      </select>
                      <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>

                  {/* Tag */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tag</label>
                    <div className="relative">
                      <select
                        value={filterTag}
                        onChange={(e) => setFilterTag(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm bg-white appearance-none cursor-pointer focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Chọn tag</option>
                        {Array.from(new Set(customers.flatMap(c => c.tags?.map(t => t.name) || []))).sort().map(tagName => (
                          <option key={tagName} value={tagName}>{tagName}</option>
                        ))}
                      </select>
                      <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>
                </div>

                {/* Row 2: Giá trị đơn hàng và Ngày mua */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  {/* Giá trị đơn hàng (VND) */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Giá trị đơn hàng (VND)</label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        placeholder="Từ"
                        value={filterOrderValue.min}
                        onChange={(e) => setFilterOrderValue({...filterOrderValue, min: e.target.value})}
                        className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                      <input
                        type="number"
                        placeholder="Đến"
                        value={filterOrderValue.max}
                        onChange={(e) => setFilterOrderValue({...filterOrderValue, max: e.target.value})}
                        className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>

                  {/* Ngày mua */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Ngày mua</label>
                    <div className="flex gap-2">
                      <div className="flex-1 relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                          <Calendar className="w-4 h-4" />
                        </div>
                        <input
                          type="date"
                          placeholder="Chọn ngày bắt đầu"
                          value={filterPurchaseDate.start}
                          onChange={(e) => setFilterPurchaseDate({...filterPurchaseDate, start: e.target.value})}
                          className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div className="flex-1 relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                          <Calendar className="w-4 h-4" />
                        </div>
                        <input
                          type="date"
                          placeholder="Chọn ngày kết thúc"
                          value={filterPurchaseDate.end}
                          onChange={(e) => setFilterPurchaseDate({...filterPurchaseDate, end: e.target.value})}
                          className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-3 mt-4">
                  <button
                    onClick={() => {
                      // Apply filter logic
                      setShowAdvancedFilters(false)
                    }}
                    className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 transition-colors"
                  >
                    Áp dụng bộ lọc
                  </button>
                  <button
                    onClick={() => {
                      setFilterDepartment('')
                      setFilterTeam('')
                      setFilterAssignedPerson('')
                      setFilterRegion('')
                      setFilterOrderValue({min: '', max: ''})
                      setFilterLastInteraction('')
                      setFilterPurchaseDate({start: '', end: ''})
                      setFilterPurchasedProduct([])
                      setFilterTag('')
                      setProductSearchTerm('')
                      setShowProductDropdown(false)
                    }}
                    className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                  >
                    <X className="w-4 h-4" />
                    <span>Xóa bộ lọc nâng cao</span>
                  </button>
                </div>
              </div>
            )}
          </div>
          {/* End Section 3: Thanh công cụ tìm kiếm và lọc */}

          {/* Section 4: Bảng danh sách khách hàng */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            {/* Bulk Actions Toolbar */}
            {selectedCustomerIds.length > 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <span className="text-sm font-medium text-blue-900">
                      Đã chọn {selectedCustomerIds.length} khách hàng
                    </span>
                    <button
                      onClick={() => {
                        setSelectedCustomerIds([])
                        setSelectAll(false)
                      }}
                      className="text-xs text-blue-600 hover:text-blue-800 underline"
                    >
                      Bỏ chọn tất cả
                    </button>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleCreateQuickTask()}
                      className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Tạo task nhanh</span>
                    </button>
                    <div className="relative">
                      <button
                        onClick={() => setShowExportDropdown(!showExportDropdown)}
                        className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                      >
                        <Download className="w-4 h-4" />
                        <span>Xuất dữ liệu</span>
                        <ChevronDown className="w-4 h-4" />
                      </button>
                      {showExportDropdown && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                          <button
                            onClick={() => {
                              // Handle Excel export
                              setShowExportDropdown(false)
                            }}
                            className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center space-x-2 text-sm text-gray-700"
                          >
                            <FileText className="w-4 h-4" />
                            <span>Xuất Excel</span>
                          </button>
                          <button
                            onClick={() => {
                              // Handle CSV export
                              setShowExportDropdown(false)
                            }}
                            className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center space-x-2 text-sm text-gray-700 border-t border-gray-100"
                          >
                            <FileText className="w-4 h-4" />
                            <span>Xuất CSV</span>
                          </button>
                        </div>
                      )}
                    </div>
                    {/* Ẩn chức năng gửi email hàng loạt theo yêu cầu */}
                    {/* <button
                      onClick={() => handleBulkEmail()}
                      className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <Mail className="w-4 h-4" />
                      <span>Gửi email hàng loạt</span>
                    </button> */}
                  </div>
                </div>
              </div>
            )}

            {/* Thông tin hiển thị */}
            <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
              <span>Hiển thị {filteredCustomers.length} trong tổng {customers.length} khách hàng</span>
            </div>

            <div className="overflow-x-auto border border-gray-200 rounded-lg">
              <table className="w-full border-collapse">
                <thead className="bg-gray-50">
                  <tr className="border-b border-gray-300">
                    {visibleColumns.checkbox && (
                      <th className="text-left py-3 px-4 font-medium text-gray-700 border-r border-gray-200 whitespace-nowrap min-w-fit">
                        <input
                          type="checkbox"
                          className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                          checked={selectAll}
                          onChange={handleSelectAll}
                        />
                      </th>
                    )}
                    {visibleColumns.no && (
                      <th className="text-left py-3 px-4 font-bold text-gray-700 border-r border-gray-200 whitespace-nowrap min-w-fit">STT</th>
                    )}
                    {visibleColumns.customerName && (
                      <th className="text-left py-3 px-4 font-bold text-gray-700 border-r border-gray-200 whitespace-nowrap min-w-fit">TÊN KHÁCH HÀNG</th>
                    )}
                    {visibleColumns.phoneNumber && (
                      <th className="text-left py-3 px-4 font-bold text-gray-700 border-r border-gray-200 whitespace-nowrap min-w-fit">SỐ ĐIỆN THOẠI</th>
                    )}
                    {visibleColumns.email && (
                      <th className="text-left py-3 px-4 font-bold text-gray-700 border-r border-gray-200 whitespace-nowrap min-w-fit">EMAIL</th>
                    )}
                    {visibleColumns.company && (
                      <th className="text-left py-3 px-4 font-bold text-gray-700 border-r border-gray-200 whitespace-nowrap min-w-fit">CÔNG TY</th>
                    )}
                    {visibleColumns.address && (
                      <th className="text-left py-3 px-4 font-bold text-gray-700 border-r border-gray-200 whitespace-nowrap min-w-fit">ĐỊA CHỈ</th>
                    )}
                    {visibleColumns.region && (
                      <th className="text-left py-3 px-4 font-bold text-gray-700 border-r border-gray-200 whitespace-nowrap min-w-fit">KHU VỰC</th>
                    )}
                    {visibleColumns.customerType && (
                      <th className="text-left py-3 px-4 font-bold text-gray-700 border-r border-gray-200 whitespace-nowrap min-w-fit">LOẠI KHÁCH HÀNG</th>
                    )}
                    {visibleColumns.segment && (
                      <th className="text-left py-3 px-4 font-bold text-gray-700 border-r border-gray-200 whitespace-nowrap min-w-fit">PHÂN LOẠI</th>
                    )}
                    {visibleColumns.tags && (
                      <th className="text-left py-3 px-4 font-bold text-gray-700 border-r border-gray-200 whitespace-nowrap min-w-[180px]">TAGS</th>
                    )}
                    {visibleColumns.source && (
                      <th className="text-left py-3 px-4 font-bold text-gray-700 border-r border-gray-200 whitespace-nowrap min-w-fit">NGUỒN</th>
                    )}
                    {visibleColumns.accountManager && (
                      <th className="text-left py-3 px-4 font-bold text-gray-700 border-r border-gray-200 whitespace-nowrap min-w-fit">SALES PHỤ TRÁCH</th>
                    )}
                    {visibleColumns.status && (
                      <th className="text-left py-3 px-4 font-bold text-gray-700 border-r border-gray-200 whitespace-nowrap min-w-fit">TRẠNG THÁI</th>
                    )}
                    {visibleColumns.lifecycleStage && (
                      <th className="text-left py-3 px-4 font-bold text-gray-700 border-r border-gray-200 whitespace-nowrap min-w-fit">LIFECYCLE STAGE</th>
                    )}
                    {visibleColumns.totalOrderValue && (
                      <th className="text-left py-3 px-4 font-bold text-gray-700 border-r border-gray-200 whitespace-nowrap min-w-fit">TỔNG GIÁ TRỊ ĐỠN</th>
                    )}
                    {visibleColumns.orderCount && (
                      <th className="text-left py-3 px-4 font-bold text-gray-700 border-r border-gray-200 whitespace-nowrap min-w-fit">SỐ ĐƠN HÀNG</th>
                    )}
                    {visibleColumns.lastOrderDate && (
                      <th className="text-left py-3 px-4 font-bold text-gray-700 border-r border-gray-200 whitespace-nowrap min-w-fit">ĐƠN HÀNG GẦN NHẤT</th>
                    )}
                    {visibleColumns.averageOrderValue && (
                      <th className="text-left py-3 px-4 font-bold text-gray-700 border-r border-gray-200 whitespace-nowrap min-w-fit">GIÁ TRỊ ĐƠN TB</th>
                    )}
                    {visibleColumns.lastContactDate && (
                      <th className="text-left py-3 px-4 font-bold text-gray-700 border-r border-gray-200 whitespace-nowrap min-w-fit">LẦN LIÊN HỆ CUỐI</th>
                    )}
                    {visibleColumns.interactionCount && (
                      <th className="text-left py-3 px-4 font-bold text-gray-700 border-r border-gray-200 whitespace-nowrap min-w-fit">SỐ LẦN TƯƠNG TÁC</th>
                    )}
                    {visibleColumns.createdDate && (
                      <th className="text-left py-3 px-4 font-bold text-gray-700 border-r border-gray-200 whitespace-nowrap min-w-fit">NGÀY TẠO</th>
                    )}
                    {visibleColumns.customerScore && (
                      <th className="text-left py-3 px-4 font-bold text-gray-700 border-r border-gray-200 whitespace-nowrap min-w-fit">CUSTOMER SCORE</th>
                    )}
                    {visibleColumns.npsScore && (
                      <th className="text-left py-3 px-4 font-bold text-gray-700 border-r border-gray-200 whitespace-nowrap min-w-fit">NPS SCORE</th>
                    )}
                    {visibleColumns.actions && (
                      <th className="text-center py-3 px-4 font-bold text-gray-700 whitespace-nowrap min-w-fit sticky right-0 bg-gray-50 z-10 shadow-[-2px_0_5px_-2px_rgba(0,0,0,0.1)]">THAO TÁC</th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {filteredCustomers.map((customer, index) => (
                    <tr key={customer.id} className={`border-b border-gray-100 hover:bg-blue-50 transition-colors ${
                      index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                    }`}>
                      {visibleColumns.checkbox && (
                        <td className="py-3 px-4 border-r border-gray-200">
                          <input
                            type="checkbox"
                            className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                            checked={selectedCustomerIds.includes(customer.id.toString())}
                            onChange={() => handleSelectCustomer(customer.id.toString())}
                          />
                        </td>
                      )}
                      {visibleColumns.no && (
                        <td className="py-3 px-4 border-r border-gray-200 text-sm text-gray-700">
                          {index + 1}
                        </td>
                      )}
                      {visibleColumns.customerName && (
                        <td className="py-3 px-4 border-r border-gray-200">
                          <button 
                            onClick={() => handleCustomerSelect(customer)}
                            className="omi-link font-semibold text-left"
                          >
                            {customer.name}
                          </button>
                        </td>
                      )}
                      {visibleColumns.phoneNumber && (
                        <td className="py-3 px-4 border-r border-gray-200">
                          <div className="text-sm text-gray-900">{customer.contact}</div>
                          {customer.phone2 && (
                            <div className="text-xs text-gray-500">{customer.phone2}</div>
                          )}
                        </td>
                      )}
                      {visibleColumns.email && (
                        <td className="py-3 px-4 border-r border-gray-200">
                          <div className="text-sm text-gray-900">{customer.email}</div>
                        </td>
                      )}
                      {visibleColumns.company && (
                        <td className="py-3 px-4 border-r border-gray-200">
                          <div className="text-sm text-gray-900">{customer.company || '-'}</div>
                        </td>
                      )}
                      {visibleColumns.address && (
                        <td className="py-3 px-4 border-r border-gray-200">
                          <div className="text-sm text-gray-900 max-w-xs truncate" title={`${customer.address}, ${customer.city}`}>
                            {customer.address || '-'}
                          </div>
                          {customer.city && (
                            <div className="text-xs text-gray-500">{customer.city}</div>
                          )}
                        </td>
                      )}
                      {visibleColumns.region && (
                        <td className="py-3 px-4 border-r border-gray-200">
                          <div className="text-sm text-gray-900">{customer.city || '-'}</div>
                        </td>
                      )}
                      {visibleColumns.customerType && (
                        <td className="py-3 px-4 border-r border-gray-200">
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                            customer.company ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                          }`}>
                            {customer.company ? 'Doanh nghiệp' : 'Cá nhân'}
                          </span>
                        </td>
                      )}
                      {visibleColumns.segment && (
                        <td className="py-3 px-4 border-r border-gray-200">
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                            customer.status === 'vip' ? 'bg-purple-100 text-purple-800' :
                            (customer.totalSpent || 0) > 50000000 ? 'bg-yellow-100 text-yellow-800' :
                            (customer.totalSpent || 0) > 10000000 ? 'bg-blue-100 text-blue-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {customer.status === 'vip' ? 'VIP' :
                             (customer.totalSpent || 0) > 50000000 ? 'Tiềm năng' :
                             (customer.totalSpent || 0) > 10000000 ? 'Thường' : 'Mới'}
                          </span>
                        </td>
                      )}
                      {visibleColumns.tags && (
                        <td className="py-3 px-4 border-r border-gray-200 min-w-[180px]">
                          <div className="flex flex-nowrap gap-1 overflow-hidden">
                            {/* Tags đồng bộ từ sales management */}
                            {customer.tags && customer.tags.length > 0 ? (
                              customer.tags.slice(0, 2).map((tag, tagIndex) => (
                                <span 
                                  key={tagIndex}
                                  className={`inline-flex px-2 py-1 text-xs font-medium rounded-full whitespace-nowrap max-w-[80px] truncate ${tag.color || 'bg-blue-100 text-blue-800'}`}
                                  title={tag.name}
                                >
                                  {tag.name}
                                </span>
                              ))
                            ) : (
                              <span className="text-xs text-gray-400">-</span>
                            )}
                            
                            {/* Hiển thị số tags còn lại */}
                            {customer.tags && customer.tags.length > 2 && (
                              <span className="text-xs text-gray-500 whitespace-nowrap">+{customer.tags.length - 2}</span>
                            )}
                          </div>
                        </td>
                      )}
                      {visibleColumns.source && (
                        <td className="py-3 px-4 border-r border-gray-200">
                          <span className="text-sm text-gray-900">
                            🌐 Website
                          </span>
                        </td>
                      )}
                      {visibleColumns.accountManager && (
                        <td className="py-3 px-4 border-r border-gray-200">
                          <div className="text-sm text-gray-900">{customer.assignedSalesRep || customer.accountManager || '-'}</div>
                        </td>
                      )}
                      {visibleColumns.status && (
                        <td className="py-3 px-4 border-r border-gray-200">
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                            customer.status === 'active' ? 'bg-green-100 text-green-800' :
                            customer.status === 'inactive' ? 'bg-gray-100 text-gray-800' :
                            customer.status === 'at-risk' ? 'bg-red-100 text-red-800' :
                            customer.status === 'churned' ? 'bg-orange-100 text-orange-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {customer.status === 'active' ? 'Active' :
                             customer.status === 'inactive' ? 'Inactive' :
                             customer.status === 'at-risk' ? 'At Risk' :
                             customer.status === 'churned' ? 'Churned' : 'Active'}
                          </span>
                        </td>
                      )}
                      {visibleColumns.lifecycleStage && (
                        <td className="py-3 px-4 border-r border-gray-200">
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                            (customer.totalOrders || 0) > 5 ? 'bg-purple-100 text-purple-800' :
                            (customer.totalOrders || 0) > 1 ? 'bg-green-100 text-green-800' :
                            customer.status === 'at-risk' ? 'bg-red-100 text-red-800' :
                            customer.status === 'churned' ? 'bg-orange-100 text-orange-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {(customer.totalOrders || 0) > 5 ? 'Loyal' :
                             (customer.totalOrders || 0) > 1 ? 'Active' :
                             customer.status === 'at-risk' ? 'At Risk' :
                             customer.status === 'churned' ? 'Churned' : 'New'}
                          </span>
                        </td>
                      )}
                      {visibleColumns.totalOrderValue && (
                        <td className="py-3 px-4 border-r border-gray-200">
                          <div className="font-medium text-gray-900">{formatCurrency((customer.totalSpent || 0).toString())}</div>
                        </td>
                      )}
                      {visibleColumns.orderCount && (
                        <td className="py-3 px-4 border-r border-gray-200">
                          <div className="text-sm text-gray-900">{customer.totalOrders || 0}</div>
                        </td>
                      )}
                      {visibleColumns.lastOrderDate && (
                        <td className="py-3 px-4 border-r border-gray-200">
                          <div className="text-sm text-gray-900">{formatDate(customer.lastPurchaseDate)}</div>
                          {customer.lastPurchaseDate && (
                            <div className="text-xs text-gray-500">
                              {Math.floor((new Date().getTime() - new Date(customer.lastPurchaseDate).getTime()) / (1000 * 60 * 60 * 24))} ngày trước
                            </div>
                          )}
                        </td>
                      )}
                      {visibleColumns.averageOrderValue && (
                        <td className="py-3 px-4 border-r border-gray-200">
                          <div className="text-sm text-gray-900">
                            {formatCurrency((customer.totalOrders ? (customer.totalSpent || 0) / customer.totalOrders : 0).toString())}
                          </div>
                        </td>
                      )}
                      {visibleColumns.lastContactDate && (
                        <td className="py-3 px-4 border-r border-gray-200">
                          <div className="text-sm text-gray-900">{formatDate(customer.lastInteraction) || 'Chưa có'}</div>
                          {customer.daysSinceLastInteraction && (
                            <div className="text-xs text-gray-500">{customer.daysSinceLastInteraction} ngày trước</div>
                          )}
                        </td>
                      )}
                      {visibleColumns.interactionCount && (
                        <td className="py-3 px-4 border-r border-gray-200">
                          <div className="text-sm text-gray-900">{customer.interactions?.length || 0}</div>
                        </td>
                      )}
                      {visibleColumns.createdDate && (
                        <td className="py-3 px-4 border-r border-gray-200">
                          <div className="text-sm text-gray-900">{formatDate(customer.createdAt)}</div>
                          {customer.createdAt && (
                            <div className="text-xs text-gray-500">
                              {Math.floor((new Date().getTime() - new Date(customer.createdAt).getTime()) / (1000 * 60 * 60 * 24))} ngày trước
                            </div>
                          )}
                        </td>
                      )}
                      {visibleColumns.customerScore && (
                        <td className="py-3 px-4 border-r border-gray-200">
                          <div className="flex items-center space-x-2">
                            <div className="text-sm font-medium text-gray-900">{customer.engagementScore || 0}</div>
                            <div className={`w-2 h-2 rounded-full ${
                              (customer.engagementScore || 0) >= 80 ? 'bg-green-400' :
                              (customer.engagementScore || 0) >= 60 ? 'bg-yellow-400' :
                              (customer.engagementScore || 0) >= 40 ? 'bg-orange-400' : 'bg-red-400'
                            }`}></div>
                          </div>
                        </td>
                      )}
                      {visibleColumns.npsScore && (
                        <td className="py-3 px-4 border-r border-gray-200">
                          <div className="text-sm text-gray-900">-</div>
                        </td>
                      )}
                      {visibleColumns.actions && (
                        <td className={`py-3 px-4 text-center sticky right-0 bg-white shadow-[-2px_0_5px_-2px_rgba(0,0,0,0.1)] ${openActionMenu === customer.id ? 'z-[1000]' : 'z-10'}`}>
                          <div className="relative inline-block">
                            <button 
                              onClick={(e) => {
                                e.stopPropagation()
                                setOpenActionMenu(openActionMenu === customer.id ? null : customer.id)
                              }}
                              className="p-2 text-slate-500 hover:text-slate-700 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                              <Settings className="w-5 h-5" />
                            </button>
                            {openActionMenu === customer.id && (
                              <>
                                <div 
                                  className="fixed inset-0 z-[998]" 
                                  onClick={() => setOpenActionMenu(null)}
                                />
                                <div className="absolute right-0 mt-1 w-52 bg-white rounded-lg shadow-lg border border-gray-200 z-[999] py-2">
                                  {/* THÔNG TIN */}
                                  <div className="px-4 pb-1 text-left">
                                    <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Thông tin</span>
                                  </div>
                                  <button 
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      handleCustomerSelect(customer)
                                      setOpenActionMenu(null)
                                    }}
                                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-3"
                                  >
                                    <Eye className="w-4 h-4 text-gray-500" />
                                    <span>Xem chi tiết</span>
                                  </button>

                                  {/* THAO TÁC NHANH */}
                                  <div className="border-t border-gray-100 mt-2 pt-2 px-4 pb-1 text-left">
                                    <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Thao tác nhanh</span>
                                  </div>
                                  <button 
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      handleCreateOrder(customer)
                                      setOpenActionMenu(null)
                                    }}
                                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-3"
                                  >
                                    <ShoppingCart className="w-4 h-4 text-gray-500" />
                                    <span>Tạo đơn hàng</span>
                                  </button>
                                  <button 
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      handleQuickInteraction(customer)
                                      setOpenActionMenu(null)
                                    }}
                                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-3"
                                  >
                                    <StickyNote className="w-4 h-4 text-gray-500" />
                                    <span>Ghi chú</span>
                                  </button>

                                  {/* THAO TÁC NGUY HIỂM */}
                                  <div className="border-t border-gray-100 mt-2 pt-2 px-4 pb-1 text-left">
                                    <span className="text-xs font-semibold text-red-400 uppercase tracking-wider">Thao tác nguy hiểm</span>
                                  </div>
                                  <button 
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      if (confirm('Bạn có chắc chắn muốn xóa khách hàng này?')) {
                                        // Handle delete customer
                                        setOpenActionMenu(null)
                                      }
                                    }}
                                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-3"
                                  >
                                    <XCircle className="w-4 h-4 text-red-500" />
                                    <span>Xóa khách hàng</span>
                                  </button>
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
          </div>
          {/* End Section 4: Bảng danh sách khách hàng */}
        </>
      )}

      {selectedView === 'analytics' && (
        <div className="space-y-6">
          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Tổng khách hàng</p>
                  <p className="text-2xl font-bold text-gray-900">{filteredCustomers.length}</p>
                  <div className="flex items-center mt-1 text-xs">
                    <TrendingUp className="w-3 h-3 text-green-500 mr-1" />
                    <span className="text-green-600">+12% so với tháng trước</span>
                  </div>
                </div>
                <Users className="w-8 h-8 text-blue-600" />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Tổng doanh thu</p>
                  <p className="text-2xl font-bold text-green-600">
                    {formatCurrency(
                      filteredCustomers.reduce((sum, c) => sum + parseInt(c.totalValue.replace(/,/g, '')), 0).toString()
                    )} VNĐ
                  </p>
                  <div className="flex items-center mt-1 text-xs">
                    <TrendingUp className="w-3 h-3 text-green-500 mr-1" />
                    <span className="text-green-600">+8.5% so với tháng trước</span>
                  </div>
                </div>
                <DollarSign className="w-8 h-8 text-green-600" />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Doanh thu trung bình/KH</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {filteredCustomers.length > 0 ? formatCurrency(
                      Math.round(filteredCustomers.reduce((sum, c) => sum + parseInt(c.totalValue.replace(/,/g, '')), 0) / filteredCustomers.length).toString()
                    ) : '0'} VNĐ
                  </p>
                  <div className="flex items-center mt-1 text-xs">
                    <TrendingUp className="w-3 h-3 text-green-500 mr-1" />
                    <span className="text-green-600">+5.2% so với tháng trước</span>
                  </div>
                </div>
                <BarChart3 className="w-8 h-8 text-blue-600" />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Tỷ lệ giữ chân</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {Math.round((filteredCustomers.filter(c => c.status !== 'churned').length / filteredCustomers.length) * 100 || 0)}%
                  </p>
                  <div className="flex items-center mt-1 text-xs">
                    <TrendingUp className="w-3 h-3 text-green-500 mr-1" />
                    <span className="text-green-600">+2.1% so với tháng trước</span>
                  </div>
                </div>
                <Heart className="w-8 h-8 text-purple-600" />
              </div>
            </div>
          </div>

          {/* Status Distribution */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Phân bố theo trạng thái</h3>
              <div className="space-y-3">
                {[
                  { status: 'active', label: 'Hoạt động', color: 'bg-green-500', textColor: 'text-green-600', icon: '✅' },
                  { status: 'at-risk', label: 'Có nguy cơ', color: 'bg-red-500', textColor: 'text-red-600', icon: '⚠️' },
                  { status: 'inactive', label: 'Không hoạt động', color: 'bg-gray-500', textColor: 'text-gray-600', icon: '⏸️' },
                  { status: 'churned', label: 'Đã rời bỏ', color: 'bg-orange-500', textColor: 'text-orange-600', icon: '❌' },
                  { status: 'dormant', label: 'Ngủ đông', color: 'bg-yellow-500', textColor: 'text-yellow-600', icon: '💤' }
                ].map(({ status, label, color, textColor, icon }) => {
                  const count = filteredCustomers.filter(c => c.status === status).length
                  const percentage = filteredCustomers.length > 0 ? (count / filteredCustomers.length * 100).toFixed(1) : 0
                  return (
                    <div key={status} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className="text-sm">{icon}</span>
                        <span className="text-sm text-gray-700">{label}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-gray-900">{count}</span>
                        <span className={`text-sm font-medium ${textColor}`}>({percentage}%)</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Phân bố theo loại khách hàng</h3>
              <div className="space-y-3">
                {[
                  { type: 'diamond', label: 'Kim cương', color: 'bg-purple-500', textColor: 'text-purple-600', icon: '💎' },
                  { type: 'gold', label: 'Vàng', color: 'bg-yellow-500', textColor: 'text-yellow-600', icon: '🥇' },
                  { type: 'silver', label: 'Bạc', color: 'bg-gray-400', textColor: 'text-gray-600', icon: '🥈' },
                  { type: 'bronze', label: 'Đồng', color: 'bg-orange-600', textColor: 'text-orange-600', icon: '🥉' }
                ].map(({ type, label, color, textColor, icon }) => {
                  const count = filteredCustomers.filter(c => c.customerType === type).length
                  const percentage = filteredCustomers.length > 0 ? (count / filteredCustomers.length * 100).toFixed(1) : 0
                  return (
                    <div key={type} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className="text-sm">{icon}</span>
                        <span className="text-sm text-gray-700">{label}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-gray-900">{count}</span>
                        <span className={`text-sm font-medium ${textColor}`}>({percentage}%)</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Điểm tương tác</h3>
                <Activity className="w-5 h-5 text-blue-600" />
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">
                  {Math.round(
                    filteredCustomers.reduce((sum, c) => sum + c.engagementScore, 0) / filteredCustomers.length || 0
                  )}
                </div>
                <p className="text-sm text-gray-500">điểm trung bình / 100</p>
              </div>
              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-xs">
                  <span>Cao (80-100)</span>
                  <span>{filteredCustomers.filter(c => c.engagementScore >= 80).length} KH</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span>Trung bình (50-79)</span>
                  <span>{filteredCustomers.filter(c => c.engagementScore >= 50 && c.engagementScore < 80).length} KH</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span>Thấp (&lt;50)</span>
                  <span>{filteredCustomers.filter(c => c.engagementScore < 50).length} KH</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Rủi ro Churn</h3>
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-red-600 mb-2">
                  {Math.round(
                    filteredCustomers.reduce((sum, c) => sum + c.churnRisk, 0) / filteredCustomers.length || 0
                  )}%
                </div>
                <p className="text-sm text-gray-500">rủi ro trung bình</p>
              </div>
              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-red-600">Cao (&gt;70%)</span>
                  <span>{filteredCustomers.filter(c => c.churnRisk > 70).length} KH</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-orange-600">Trung bình (30-70%)</span>
                  <span>{filteredCustomers.filter(c => c.churnRisk >= 30 && c.churnRisk <= 70).length} KH</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-green-600">Thấp (&lt;30%)</span>
                  <span>{filteredCustomers.filter(c => c.churnRisk < 30).length} KH</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Điểm trung thành</h3>
                <Star className="w-5 h-5 text-yellow-600" />
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-yellow-600 mb-2">
                  {Math.round(
                    filteredCustomers.reduce((sum, c) => sum + c.loyaltyPoints, 0) / filteredCustomers.length || 0
                  )}
                </div>
                <p className="text-sm text-gray-500">điểm trung bình</p>
              </div>
              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-xs">
                  <span>Platinum (&gt;2000)</span>
                  <span>{filteredCustomers.filter(c => c.loyaltyPoints > 2000).length} KH</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span>Gold (1000-2000)</span>
                  <span>{filteredCustomers.filter(c => c.loyaltyPoints >= 1000 && c.loyaltyPoints <= 2000).length} KH</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span>Silver (&lt;1000)</span>
                  <span>{filteredCustomers.filter(c => c.loyaltyPoints < 1000).length} KH</span>
                </div>
              </div>
            </div>
          </div>

          {/* Industry & Geographic Analysis */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Phân tích theo ngành nghề</h3>
              <div className="space-y-3">
                {(() => {
                  const industriesSet = new Set(filteredCustomers.map(c => c.industry))
                  const industries = Array.from(industriesSet)
                  return industries.slice(0, 6).map(industry => {
                    const count = filteredCustomers.filter(c => c.industry === industry).length
                    const percentage = filteredCustomers.length > 0 ? (count / filteredCustomers.length * 100).toFixed(1) : 0
                    const avgRevenue = filteredCustomers
                      .filter(c => c.industry === industry)
                      .reduce((sum, c) => sum + parseInt(c.totalValue.replace(/,/g, '')), 0) / count || 0
                    
                    return (
                      <div key={industry} className="p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-900">{industry}</span>
                          <span className="text-sm text-gray-600">{count} KH ({percentage}%)</span>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          Doanh thu TB: {formatCurrency(Math.round(avgRevenue).toString())} VNĐ
                        </div>
                      </div>
                    )
                  })
                })()}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Phân tích theo khu vực</h3>
              <div className="space-y-3">
                {(() => {
                  const citiesSet = new Set(filteredCustomers.map(c => c.city))
                  const cities = Array.from(citiesSet)
                  return cities.slice(0, 6).map(city => {
                    const count = filteredCustomers.filter(c => c.city === city).length
                    const percentage = filteredCustomers.length > 0 ? (count / filteredCustomers.length * 100).toFixed(1) : 0
                    const avgRevenue = filteredCustomers
                      .filter(c => c.city === city)
                      .reduce((sum, c) => sum + parseInt(c.totalValue.replace(/,/g, '')), 0) / count || 0
                    
                    return (
                      <div key={city} className="p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <MapPin className="w-4 h-4 text-gray-400" />
                            <span className="text-sm font-medium text-gray-900">{city}</span>
                          </div>
                          <span className="text-sm text-gray-600">{count} KH ({percentage}%)</span>
                        </div>
                        <div className="text-xs text-gray-500 mt-1 ml-6">
                          Doanh thu TB: {formatCurrency(Math.round(avgRevenue).toString())} VNĐ
                        </div>
                      </div>
                    )
                  })
                })()}
              </div>
            </div>
          </div>

          {/* Communication Preferences */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Phản hồi và Tương tác</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {filteredCustomers.filter(c => c.preferredChannel === 'email').length}
                </div>
                <div className="text-sm text-gray-600 flex items-center justify-center mt-1">
                  <Mail className="w-4 h-4 mr-1" />
                  Ưa thích Email
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {filteredCustomers.filter(c => c.preferredChannel === 'phone').length}
                </div>
                <div className="text-sm text-gray-600 flex items-center justify-center mt-1">
                  <Phone className="w-4 h-4 mr-1" />
                  Ưa thích Điện thoại
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {filteredCustomers.filter(c => c.preferredChannel === 'chat').length}
                </div>
                <div className="text-sm text-gray-600 flex items-center justify-center mt-1">
                  <MessageCircle className="w-4 h-4 mr-1" />
                  Ưa thích Chat
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {filteredCustomers.filter(c => c.daysSinceLastInteraction <= 7).length}
                </div>
                <div className="text-sm text-gray-600 flex items-center justify-center mt-1">
                  <Clock className="w-4 h-4 mr-1" />
                  Tương tác gần đây
                </div>
              </div>
            </div>
          </div>

          {/* Remarketing Insights */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Thông tin Remarketing</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">
                  {remarketingCustomers.length}
                </div>
                <div className="text-sm text-orange-700 mt-1">Cần Remarketing</div>
                <div className="text-xs text-orange-600 mt-1">
                  {filteredCustomers.length > 0 ? ((remarketingCustomers.length / filteredCustomers.length) * 100).toFixed(1) : 0}% tổng KH
                </div>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <div className="text-2xl font-bold text-red-600">
                  {remarketingCustomers.filter(c => c.remarketing.priority === 'high').length}
                </div>
                <div className="text-sm text-red-700 mt-1">Ưu tiên cao</div>
                <div className="text-xs text-red-600 mt-1">Cần xử lý ngay</div>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600">
                  {remarketingCustomers.filter(c => c.remarketing.priority === 'medium').length}
                </div>
                <div className="text-sm text-yellow-700 mt-1">Ưu tiên trung bình</div>
                <div className="text-xs text-yellow-600 mt-1">Theo dõi thường xuyên</div>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {Math.round(
                    remarketingCustomers
                      .filter(c => c.remarketing.campaigns.length > 0)
                      .reduce((sum, c) => {
                        const avgOpenRate = c.remarketing.campaigns.reduce((s, camp) => s + (camp.openRate || 0), 0) / c.remarketing.campaigns.length
                        return sum + avgOpenRate
                      }, 0) / remarketingCustomers.filter(c => c.remarketing.campaigns.length > 0).length || 0
                  )}%
                </div>
                <div className="text-sm text-blue-700 mt-1">Tỷ lệ mở TB</div>
                <div className="text-xs text-blue-600 mt-1">Campaigns gần đây</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>

    {/* Quick Task Modal */}
    {showQuickTaskModal && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Tạo task nhanh</h3>
            <button
              onClick={() => setShowQuickTaskModal(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="mb-4">
            <div className="text-sm text-gray-600 mb-2">
              Tạo task cho {selectedCustomerIds.length} khách hàng đã chọn:
            </div>
            <div className="text-xs text-gray-500 max-h-20 overflow-y-auto bg-gray-50 p-2 rounded">
              {customers
                .filter(customer => selectedCustomerIds.includes(customer.id.toString()))
                .map(customer => customer.name)
                .join(', ')
              }
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tiêu đề task *
              </label>
              <input
                type="text"
                value={quickTaskData.title}
                onChange={(e) => setQuickTaskData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="VD: Gọi điện tư vấn sản phẩm mới"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mô tả
              </label>
              <textarea
                value={quickTaskData.description}
                onChange={(e) => setQuickTaskData(prev => ({ ...prev, description: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows={3}
                placeholder="Mô tả chi tiết về task..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Độ ưu tiên
                </label>
                <select
                  value={quickTaskData.priority}
                  onChange={(e) => setQuickTaskData(prev => ({ ...prev, priority: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="low">Thấp</option>
                  <option value="medium">Trung bình</option>
                  <option value="high">Cao</option>
                  <option value="urgent">Khẩn cấp</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hạn hoàn thành
                </label>
                <input
                  type="date"
                  value={quickTaskData.dueDate}
                  onChange={(e) => setQuickTaskData(prev => ({ ...prev, dueDate: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Giao cho
              </label>
              <select
                value={quickTaskData.assignedTo}
                onChange={(e) => setQuickTaskData(prev => ({ ...prev, assignedTo: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Chọn người thực hiện</option>
                <option value="me">Tôi</option>
                <option value="nguyen_thi_lan">Nguyễn Thị Lan</option>
                <option value="tran_van_duc">Trần Văn Đức</option>
                <option value="pham_minh_tuan">Phạm Minh Tuấn</option>
                <option value="do_van_minh">Đỗ Văn Minh</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              onClick={() => setShowQuickTaskModal(false)}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
            >
              Hủy
            </button>
            <button
              onClick={handleSubmitQuickTask}
              disabled={!quickTaskData.title.trim()}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              Tạo task
            </button>
          </div>
        </div>
      </div>
    )}

    {/* Customer Detail Modal */}
    <CustomerDetailModal
      isOpen={!!selectedCustomer}
      onClose={handleCloseCustomerDetail}
      customer={selectedCustomer}
      onUpdate={(customerId, updates) => {
        console.log('Update customer:', customerId, updates)
        // In real app, call API to update customer
      }}
    />

    {/* OLD Customer Detail Modal - REPLACED */}
    {false as boolean && selectedCustomer && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg w-full max-w-6xl mx-4 h-[90vh] flex flex-col">
          {/* Modal Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white text-lg font-bold ${
                selectedCustomer.status === 'vip' ? 'bg-purple-600' :
                selectedCustomer.status === 'active' ? 'bg-green-600' :
                selectedCustomer.status === 'at-risk' ? 'bg-red-600' : 'bg-gray-600'
              }`}>
                {selectedCustomer.name.charAt(0)}
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">{selectedCustomer.name}</h2>
                <p className="text-sm text-gray-500">{selectedCustomer.email}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {isEditingCustomer ? (
                <>
                  <button
                    onClick={handleSaveCustomer}
                    className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Save className="w-4 h-4" />
                    <span>Lưu</span>
                  </button>
                  <button
                    onClick={() => setIsEditingCustomer(false)}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Hủy
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsEditingCustomer(true)}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Edit className="w-4 h-4" />
                  <span>Chỉnh sửa</span>
                </button>
              )}
              <button
                onClick={handleCloseCustomerDetail}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Modal Tabs */}
          <div className="border-b border-gray-200 px-6">
            <nav className="flex space-x-8">
              {[
                { id: 'details', label: 'Thông tin chi tiết', icon: User },
                { id: 'interactions', label: 'Lịch sử tương tác', icon: MessageCircle },
                { id: 'orders', label: 'Đơn hàng', icon: Package },
                { id: 'notes', label: 'Ghi chú', icon: FileText }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-2 py-3 px-1 border-b-2 text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Modal Content */}
          <div className="flex-1 overflow-auto p-6">
            {activeTab === 'details' && (
              <div className="space-y-6">
                {/* Basic Information */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Thông tin cơ bản</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Họ và Tên</label>
                      {isEditingCustomer ? (
                        <input
                          type="text"
                          value={editCustomerData.name || ''}
                          onChange={(e) => setEditCustomerData(prev => ({ ...prev, name: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      ) : (
                        <p className="text-gray-900">{selectedCustomer.name || '-'}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <p className="text-gray-900">{selectedCustomer.email}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Điện thoại</label>
                      <p className="text-gray-900">{selectedCustomer.contact}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Công ty</label>
                      {isEditingCustomer ? (
                        <input
                          type="text"
                          value={editCustomerData.company || ''}
                          onChange={(e) => setEditCustomerData(prev => ({ ...prev, company: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      ) : (
                        <p className="text-gray-900">{selectedCustomer.company || '-'}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Chức vụ</label>
                      {isEditingCustomer ? (
                        <input
                          type="text"
                          value={editCustomerData.position || ''}
                          onChange={(e) => setEditCustomerData(prev => ({ ...prev, position: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      ) : (
                        <p className="text-gray-900">{selectedCustomer.position || '-'}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ đầy đủ</label>
                      {isEditingCustomer ? (
                        <input
                          type="text"
                          value={`${editCustomerData.address || ''}, ${editCustomerData.city || ''}, ${editCustomerData.state || ''}, ${editCustomerData.country || ''}`.replace(/^,\s*|,\s*,/g, '').replace(/,\s*$/, '') || ''}
                          onChange={(e) => {
                            const fullAddress = e.target.value
                            setEditCustomerData(prev => ({ ...prev, address: fullAddress }))
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Nhập địa chỉ đầy đủ..."
                        />
                      ) : (
                        <p className="text-gray-900">
                          {[selectedCustomer.address, selectedCustomer.city, selectedCustomer.state, selectedCustomer.country]
                            .filter(Boolean)
                            .join(', ') || '-'}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Business Information */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Thông tin kinh doanh</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Ngành nghề</label>
                      {isEditingCustomer ? (
                        <input
                          type="text"
                          value={editCustomerData.industry || ''}
                          onChange={(e) => setEditCustomerData(prev => ({ ...prev, industry: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      ) : (
                        <p className="text-gray-900">{selectedCustomer.industry || '-'}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Quy mô công ty</label>
                      {isEditingCustomer ? (
                        <select
                          value={editCustomerData.companySize || ''}
                          onChange={(e) => setEditCustomerData(prev => ({ ...prev, companySize: e.target.value as any }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="small">Nhỏ (1-50 nhân viên)</option>
                          <option value="medium">Trung bình (51-200 nhân viên)</option>
                          <option value="large">Lớn (201-1000 nhân viên)</option>
                          <option value="enterprise">Doanh nghiệp (&gt;1000 nhân viên)</option>
                        </select>
                      ) : (
                        <p className="text-gray-900">
                          {selectedCustomer.companySize === 'small' ? 'Nhỏ (1-50 nhân viên)' :
                           selectedCustomer.companySize === 'medium' ? 'Trung bình (51-200 nhân viên)' :
                           selectedCustomer.companySize === 'large' ? 'Lớn (201-1000 nhân viên)' :
                           selectedCustomer.companySize === 'enterprise' ? 'Doanh nghiệp (&gt;1000 nhân viên)' : '-'}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
                      {isEditingCustomer ? (
                        <select
                          value={editCustomerData.status || ''}
                          onChange={(e) => setEditCustomerData(prev => ({ ...prev, status: e.target.value as any }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="active">Hoạt động</option>
                          <option value="inactive">Không hoạt động</option>
                          <option value="at-risk">Có nguy cơ</option>
                          <option value="vip">VIP</option>
                          <option value="churned">Đã rời bỏ</option>
                          <option value="dormant">Ngủ đông</option>
                        </select>
                      ) : (
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          selectedCustomer.status === 'active' ? 'bg-green-100 text-green-800' :
                          selectedCustomer.status === 'inactive' ? 'bg-gray-100 text-gray-800' :
                          selectedCustomer.status === 'at-risk' ? 'bg-red-100 text-red-800' :
                          selectedCustomer.status === 'vip' ? 'bg-purple-100 text-purple-800' :
                          selectedCustomer.status === 'churned' ? 'bg-orange-100 text-orange-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {selectedCustomer.status === 'active' ? 'Hoạt động' :
                           selectedCustomer.status === 'inactive' ? 'Không hoạt động' :
                           selectedCustomer.status === 'at-risk' ? 'Có nguy cơ' :
                           selectedCustomer.status === 'vip' ? 'VIP' :
                           selectedCustomer.status === 'churned' ? 'Đã rời bỏ' : 'Ngủ đông'}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Statistics */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Thống kê</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-blue-600">{selectedCustomer.totalOrders}</p>
                      <p className="text-sm text-gray-600">Tổng đơn hàng</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-green-600">{formatCurrency(selectedCustomer.totalSpent.toString())} VNĐ</p>
                      <p className="text-sm text-gray-600">Tổng chi tiêu</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-purple-600">
                        {selectedCustomer.lastOrderDate ? formatCurrency(
                          selectedCustomer.products && selectedCustomer.products.length > 0 
                            ? selectedCustomer.products[selectedCustomer.products.length - 1].price.toString() 
                            : '0'
                        ) : '0'} VNĐ
                      </p>
                      <p className="text-sm text-gray-600">Đơn gần nhất</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xl font-bold text-orange-600">
                        {selectedCustomer.lastInteraction ? formatDate(selectedCustomer.lastInteraction) : 'Chưa có'}
                      </p>
                      <p className="text-sm text-gray-600">Tương tác gần nhất</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xl font-bold text-indigo-600">
                        {selectedCustomer.lastPurchaseDate ? formatDate(selectedCustomer.lastPurchaseDate) : 'Chưa có'}
                      </p>
                      <p className="text-sm text-gray-600">Mua gần nhất</p>
                    </div>
                  </div>
                </div>

                {/* Notes */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Ghi chú</h3>
                  {isEditingCustomer ? (
                    <textarea
                      value={(editCustomerData.notes as any) || ''}
                      onChange={(e) => setEditCustomerData(prev => ({ ...prev, notes: e.target.value as any }))}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Nhập ghi chú về khách hàng..."
                    />
                  ) : (
                    <p className="text-gray-900">{(selectedCustomer.notes as any) || 'Chưa có ghi chú'}</p>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'interactions' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Lịch sử tương tác</h3>
                  <button
                    onClick={() => setShowAddInteractionModal(true)}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Thêm tương tác</span>
                  </button>
                </div>
                {selectedCustomer.interactions && selectedCustomer.interactions.length > 0 ? (
                  <div className="space-y-3">
                    {selectedCustomer.interactions.map((interaction, index) => (
                      <div key={index} className="bg-white border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <span className={`w-2 h-2 rounded-full ${
                              interaction.status === 'success' ? 'bg-green-500' :
                              interaction.status === 'pending' ? 'bg-yellow-500' : 'bg-red-500'
                            }`}></span>
                            <span className="font-medium text-gray-900">{interaction.title}</span>
                            {interaction.editHistory && interaction.editHistory.length > 0 && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-orange-100 text-orange-800">
                                <Edit className="w-3 h-3 mr-1" />
                                Đã chỉnh sửa ({interaction.editHistory.length})
                              </span>
                            )}
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-500">{formatDate(interaction.date)}</span>
                            <button
                              onClick={() => handleEditInteraction(interaction)}
                              className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                              title="Chỉnh sửa tương tác"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        <p className="text-gray-600 text-sm mb-2">{interaction.summary}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4 text-xs text-gray-500">
                            <span>Loại: {interaction.type}</span>
                            <span>Kênh: {interaction.channel}</span>
                            <span className={`px-2 py-1 rounded-full ${
                              interaction.status === 'success' ? 'bg-green-100 text-green-800' :
                              interaction.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {interaction.status === 'success' ? 'Thành công' :
                               interaction.status === 'pending' ? 'Đang xử lý' : 'Thất bại'}
                            </span>
                          </div>
                        </div>
                        
                        {/* Edit History */}
                        {interaction.editHistory && interaction.editHistory.length > 0 && (
                          <div className="mt-3 pt-3 border-t border-gray-100">
                            <details className="group">
                              <summary className="cursor-pointer text-xs text-gray-500 hover:text-gray-700 flex items-center">
                                <History className="w-3 h-3 mr-1" />
                                Lịch sử chỉnh sửa ({interaction.editHistory.length} lần)
                                <ChevronDown className="w-3 h-3 ml-1 group-open:rotate-180 transition-transform" />
                              </summary>
                              <div className="mt-2 space-y-2">
                                {interaction.editHistory.map((edit, editIndex) => (
                                  <div key={editIndex} className="bg-gray-50 rounded p-2 text-xs">
                                    <div className="flex items-center justify-between mb-1">
                                      <span className="font-medium text-gray-700">
                                        Chỉnh sửa bởi: {edit.editedBy}
                                      </span>
                                      <span className="text-gray-500">
                                        {formatDate(edit.editedAt)}
                                      </span>
                                    </div>
                                    {edit.reason && (
                                      <p className="text-gray-600 mb-1">
                                        <strong>Lý do:</strong> {edit.reason}
                                      </p>
                                    )}
                                    <div className="space-y-1">
                                      {edit.changes.map((change, changeIndex) => (
                                        <div key={changeIndex} className="text-gray-600">
                                          <strong>{change.field}:</strong>{' '}
                                          <span className="bg-red-100 text-red-800 px-1 rounded">
                                            {change.oldValue}
                                          </span>
                                          {' → '}
                                          <span className="bg-green-100 text-green-800 px-1 rounded">
                                            {change.newValue}
                                          </span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </details>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">Chưa có lịch sử tương tác</p>
                )}
              </div>
            )}

            {activeTab === 'orders' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Đơn hàng</h3>
                {selectedCustomer.products && selectedCustomer.products.length > 0 ? (
                  <div className="space-y-3">
                    {selectedCustomer.products.map((product, index) => (
                      <div key={index} className="bg-white border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-gray-900">{product.name}</span>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            product.status === 'active' ? 'bg-green-100 text-green-800' :
                            product.status === 'expired' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {product.status === 'active' ? 'Đang sử dụng' :
                             product.status === 'expired' ? 'Hết hạn' : 'Đã hủy'}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-gray-500">Danh mục:</span>
                            <span className="ml-1 text-gray-900">{product.category}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Số lượng:</span>
                            <span className="ml-1 text-gray-900">{product.quantity}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Giá:</span>
                            <span className="ml-1 text-gray-900">{formatCurrency(product.price.toString())} VNĐ</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Ngày mua:</span>
                            <span className="ml-1 text-gray-900">{formatDate(product.purchaseDate)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">Chưa có đơn hàng nào</p>
                )}
              </div>
            )}

            {activeTab === 'notes' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Ghi chú chi tiết</h3>
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">Ghi chú công khai</h4>
                  {isEditingCustomer ? (
                    <textarea
                      value={(editCustomerData.notes as any) || ''}
                      onChange={(e) => setEditCustomerData(prev => ({ ...prev, notes: e.target.value as any }))}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Ghi chú có thể chia sẻ với team..."
                    />
                  ) : (
                    <p className="text-gray-900">{(selectedCustomer.notes as any) || 'Chưa có ghi chú công khai'}</p>
                  )}
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">Ghi chú nội bộ</h4>
                  {isEditingCustomer ? (
                    <textarea
                      value={editCustomerData.internalNotes || ''}
                      onChange={(e) => setEditCustomerData(prev => ({ ...prev, internalNotes: e.target.value }))}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Ghi chú nội bộ (chỉ team bán hàng xem được)..."
                    />
                  ) : (
                    <p className="text-gray-900">{selectedCustomer.internalNotes || 'Chưa có ghi chú nội bộ'}</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    )}

    {/* Add Interaction Modal */}
    {showAddInteractionModal && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Thêm tương tác mới</h3>
            <button
              onClick={() => setShowAddInteractionModal(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Loại tương tác *
              </label>
              <select
                value={newInteractionData.type}
                onChange={(e) => setNewInteractionData(prev => ({ ...prev, type: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="call">Cuộc gọi</option>
                <option value="email">Email</option>
                <option value="meeting">Cuộc họp</option>
                <option value="sms">SMS</option>
                <option value="chat">Chat</option>
                <option value="support">Hỗ trợ</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Kênh tương tác *
              </label>
              <input
                type="text"
                value={newInteractionData.channel}
                onChange={(e) => setNewInteractionData(prev => ({ ...prev, channel: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="VD: Điện thoại, Zalo, Email, ..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tiêu đề *
              </label>
              <input
                type="text"
                value={newInteractionData.title}
                onChange={(e) => setNewInteractionData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="VD: Tư vấn sản phẩm mới"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mô tả chi tiết
              </label>
              <textarea
                value={newInteractionData.summary}
                onChange={(e) => setNewInteractionData(prev => ({ ...prev, summary: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows={3}
                placeholder="Mô tả chi tiết về cuộc tương tác..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Trạng thái
              </label>
              <select
                value={newInteractionData.status}
                onChange={(e) => setNewInteractionData(prev => ({ ...prev, status: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="success">Thành công</option>
                <option value="pending">Đang xử lý</option>
                <option value="failed">Thất bại</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              onClick={() => setShowAddInteractionModal(false)}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
            >
              Hủy
            </button>
            <button
              onClick={handleAddInteraction}
              disabled={!newInteractionData.title.trim() || !newInteractionData.channel.trim()}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              Thêm tương tác
            </button>
          </div>
        </div>
      </div>
    )}

    {/* Create Order Modal */}
    {showCreateOrderModal && selectedCustomerForOrder && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Tạo đơn hàng</h3>
            </div>
            <button
              onClick={() => {
                setShowCreateOrderModal(false)
                setSelectedProducts([])
                setSelectedPackages({})
                setProductQuantities({})
                setOrderNotes('')
                setSelectedCategory('Tất cả')
                setPaymentDeadline('')
                setDiscountPercent(0)
                setDiscountType('%')
                setPaymentMethod('cash')
                setPaymentMode('full')
                setPaymentInstallments(1)
                setInstallmentData([{amount: 0, date: ''}])
              }}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Customer Info */}
          <div className="flex items-center gap-3 mb-4 p-3 rounded-lg">
            <span className="relative flex shrink-0 overflow-hidden rounded-full h-12 w-12 bg-blue-100">
              <span className="flex h-full w-full items-center justify-center rounded-full bg-blue-100 text-blue-700 font-semibold">
                <User className="h-6 w-6" />
              </span>
            </span>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-slate-900">{selectedCustomerForOrder.name}</h3>
              </div>
              <p className="text-sm text-slate-600">
                {selectedCustomerForOrder.phone2 && <span className="mr-3">{selectedCustomerForOrder.phone2}</span>}
                {selectedCustomerForOrder.email && <span>{selectedCustomerForOrder.email}</span>}
              </p>
            </div>
          </div>

          <div className="space-y-4">
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
                <option value="Sản phẩm">Sản phẩm</option>
              </select>
            </div>

            {/* Product Selection - 2 Column Grid */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-3">Chọn sản phẩm & gói sản phẩm <span className="text-red-500">*</span></h4>
              <div className="max-h-80 overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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
                              setSelectedPackages(prev => ({
                                ...prev,
                                [product.id]: availablePackages[product.id as keyof typeof availablePackages]?.[0]?.id || ''
                              }))
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
                </div>
                {availableProducts.filter(product => selectedCategory === 'Tất cả' || product.category === selectedCategory).length === 0 && (
                  <p className="text-sm text-gray-500 text-center py-4">Không có sản phẩm nào trong thể loại này</p>
                )}
              </div>
            </div>

            {/* Payment & Discount Info */}
            {selectedProducts.length > 0 && (
              <div className="space-y-4">
                {/* Selected Products Summary */}
                {(() => {
                  const subtotal = selectedProducts.reduce((sum, productId) => {
                    const product = availableProducts.find(p => p.id === productId)
                    const selectedPackageId = selectedPackages[productId]
                    const selectedPackage = availablePackages[productId as keyof typeof availablePackages]?.find(pkg => pkg.id === selectedPackageId)
                    const quantity = productQuantities[productId] || 1
                    return sum + ((product?.price || 0) + (selectedPackage?.price || 0)) * quantity
                  }, 0)
                  const totalBeforeDiscount = subtotal
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
                              <span>{product.name} ({selectedPackage?.name || 'Standard'}) x{quantity}</span>
                              <span className="font-medium text-green-600">
                                {formatCurrency(productTotal.toString())} VNĐ
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

                  {/* Payment Method */}
                  <div className="mb-4">
                    <div className="flex flex-wrap items-center gap-4">
                      <label className="text-sm font-medium text-gray-700 whitespace-nowrap">Hình thức thanh toán</label>
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

                  {/* Payment Mode */}
                  <div className="mb-4">
                    <div className="flex flex-wrap items-center gap-4">
                      <label className="text-sm font-medium text-gray-700 whitespace-nowrap">Thực hiện thanh toán</label>
                      <div className="flex gap-3">
                        <label className="flex items-center px-3 py-2 border border-gray-200 rounded-lg cursor-pointer hover:bg-white transition-colors bg-white">
                          <input
                            type="radio"
                            name="customerOrderPaymentMode"
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
                            name="customerOrderPaymentMode"
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
                          const newInstallments = Array.from({length: num}, (_, i) => 
                            installmentData[i] || {amount: 0, date: ''}
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
                      const totalBeforeDiscountCalc = subtotalCalc
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
                              newData[index] = {...newData[index], amount: validatedValue}
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
                                newData[index] = {...newData[index], date: e.target.value}
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
              Khách hàng sẽ được tạo đơn hàng với các sản phẩm đã chọn. Sau khi xác nhận thanh toán thành công, sẽ tự động chuyển sang "Hoàn thành".
            </p>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              onClick={() => {
                setShowCreateOrderModal(false)
                setSelectedProducts([])
                setSelectedPackages({})
                setProductQuantities({})
                setOrderNotes('')
                setSelectedCategory('Tất cả')
                setPaymentDeadline('')
                setDiscountPercent(0)
                setDiscountType('%')
                setPaymentMethod('cash')
                setPaymentMode('full')
                setPaymentInstallments(1)
                setInstallmentData([{amount: 0, date: ''}])
              }}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
            >
              Hủy
            </button>
            <button
              onClick={handleSubmitOrder}
              disabled={selectedProducts.length === 0 || !paymentDeadline}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              Tạo đơn hàng
            </button>
          </div>
        </div>
      </div>
    )}

    {/* Quick Interaction Modal */}
    {showQuickInteractionModal && selectedCustomerForInteraction && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
          <div className="flex items-center justify-between p-6 border-b">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Thêm tương tác nhanh</h3>
              <p className="text-sm text-gray-600 mt-1">Khách hàng: {selectedCustomerForInteraction.name}</p>
            </div>
            <button
              onClick={() => {
                setShowQuickInteractionModal(false)
                setSelectedCustomerForInteraction(null)
                setQuickInteractionContent('')
                setQuickInteractionType('note')
              }}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="p-6">
            {/* Interaction Type */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Loại tương tác
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { value: 'note', label: '📝 Ghi chú', color: 'bg-gray-100 text-gray-800' },
                  { value: 'call', label: '📞 Gọi điện', color: 'bg-green-100 text-green-800' },
                  { value: 'email', label: '📧 Email', color: 'bg-blue-100 text-blue-800' },
                  { value: 'meeting', label: '🤝 Gặp mặt', color: 'bg-purple-100 text-purple-800' }
                ].map((type) => (
                  <button
                    key={type.value}
                    onClick={() => setQuickInteractionType(type.value as any)}
                    className={`p-2 text-xs font-medium rounded-lg border-2 transition-all ${
                      quickInteractionType === type.value
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    } ${type.color}`}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Title */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tiêu đề tương tác <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={quickInteractionTitle}
                onChange={(e) => setQuickInteractionTitle(e.target.value)}
                placeholder={`Nhập tiêu đề ${
                  quickInteractionType === 'call' ? 'cuộc gọi' :
                  quickInteractionType === 'email' ? 'email' :
                  quickInteractionType === 'meeting' ? 'cuộc gặp' :
                  'ghi chú'
                }...`}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Content */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nội dung tương tác <span className="text-red-500">*</span>
              </label>
              <textarea
                value={quickInteractionContent}
                onChange={(e) => setQuickInteractionContent(e.target.value)}
                placeholder={`Nhập nội dung ${
                  quickInteractionType === 'call' ? 'cuộc gọi' :
                  quickInteractionType === 'email' ? 'email' :
                  quickInteractionType === 'meeting' ? 'cuộc gặp' :
                  'ghi chú'
                }...`}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowQuickInteractionModal(false)
                  setSelectedCustomerForInteraction(null)
                  setQuickInteractionContent('')
                  setQuickInteractionTitle('')
                  setQuickInteractionType('note')
                }}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={handleSubmitQuickInteraction}
                disabled={!quickInteractionTitle.trim() || !quickInteractionContent.trim()}
                className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                <StickyNote className="w-4 h-4" />
                Thêm tương tác
              </button>
            </div>
          </div>
        </div>
      </div>
    )}

    {/* Edit Interaction Modal */}
    {showEditInteractionModal && editingInteraction && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between p-6 border-b">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Chỉnh sửa tương tác</h3>
              <p className="text-sm text-gray-600 mt-1">ID: {editingInteraction.id}</p>
            </div>
            <button
              onClick={() => {
                setShowEditInteractionModal(false)
                setEditingInteraction(null)
                setEditInteractionData({
                  title: '',
                  summary: '',
                  type: 'email',
                  channel: '',
                  status: 'success'
                })
                setEditReason('')
              }}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="p-6">
            {/* Edit Reason */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Lý do chỉnh sửa <span className="text-red-500">*</span>
              </label>
              <textarea
                value={editReason}
                onChange={(e) => setEditReason(e.target.value)}
                placeholder="Nhập lý do chỉnh sửa tương tác..."
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tiêu đề
                </label>
                <input
                  type="text"
                  value={editInteractionData.title}
                  onChange={(e) => setEditInteractionData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Loại tương tác
                </label>
                <select
                  value={editInteractionData.type}
                  onChange={(e) => setEditInteractionData(prev => ({ ...prev, type: e.target.value as CustomerInteraction['type'] }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="email">Email</option>
                  <option value="call">Gọi điện</option>
                  <option value="meeting">Gặp mặt</option>
                  <option value="sms">SMS</option>
                  <option value="chat">Chat</option>
                  <option value="support">Hỗ trợ</option>
                </select>
              </div>

              {/* Channel */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kênh
                </label>
                <input
                  type="text"
                  value={editInteractionData.channel}
                  onChange={(e) => setEditInteractionData(prev => ({ ...prev, channel: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Trạng thái
                </label>
                <select
                  value={editInteractionData.status}
                  onChange={(e) => setEditInteractionData(prev => ({ ...prev, status: e.target.value as CustomerInteraction['status'] }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="success">Thành công</option>
                  <option value="pending">Đang xử lý</option>
                  <option value="failed">Thất bại</option>
                </select>
              </div>
            </div>

            {/* Summary */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nội dung tương tác
              </label>
              <textarea
                value={editInteractionData.summary}
                onChange={(e) => setEditInteractionData(prev => ({ ...prev, summary: e.target.value }))}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>

            {/* Original Data Preview */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Dữ liệu gốc:</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                <div><strong>Tiêu đề:</strong> {editingInteraction.title}</div>
                <div><strong>Loại:</strong> {editingInteraction.type}</div>
                <div><strong>Kênh:</strong> {editingInteraction.channel}</div>
                <div><strong>Trạng thái:</strong> {editingInteraction.status}</div>
                <div className="md:col-span-2"><strong>Nội dung:</strong> {editingInteraction.summary}</div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowEditInteractionModal(false)
                  setEditingInteraction(null)
                  setEditInteractionData({
                    title: '',
                    summary: '',
                    type: 'email',
                    channel: '',
                    status: 'success'
                  })
                  setEditReason('')
                }}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={handleSubmitEditInteraction}
                disabled={!editReason.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                Lưu thay đổi
              </button>
            </div>
          </div>
        </div>
      </div>
    )}
    </>
  )
}
