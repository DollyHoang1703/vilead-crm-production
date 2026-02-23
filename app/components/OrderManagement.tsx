'use client'

import { useState, useEffect } from 'react'
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
  Clock,
  AlertCircle,
  Activity,
  FileText,
  MessageSquare,
  MessageCircle,
  Tag,
  Upload,
  Download,
  Edit,
  Trash2,
  RefreshCw,
  Send,
  AlertTriangle,
  History,
  Zap,
  ShoppingCart,
  Package,
  CreditCard,
  Bell,
  Settings,
  X,
  Check,
  ChevronDown,
  HelpCircle,
  Info
} from 'lucide-react'

import OrderDetailModal from './OrderDetailModal'

// Interfaces
interface Customer {
  id: number
  name: string
  phone: string
  email: string
  company?: string
  position?: string
  address?: string
  type: 'lead' | 'customer'
}

interface Product {
  id: number
  name: string
  code: string
  basePrice: number
  variants: ProductVariant[]
  category: string
  description: string
}

interface ProductVariant {
  id: number
  name: string
  price: number
  description: string
}

interface OrderItem {
  id: number
  productId: number
  product: Product
  variantId?: number
  variant?: ProductVariant
  quantity: number
  unitPrice: number
  totalPrice: number
  notes?: string
}

interface Invoice {
  id: number
  number: string
  date: string
  totalAmount: number
  tax?: number
  fileUrl?: string
  fileType?: 'pdf' | 'image' | 'link'
  status: 'draft' | 'issued' | 'paid'
}

interface OrderNote {
  id: number
  content: string
  type: 'customer_request' | 'internal' | 'system'
  createdAt: string
  createdBy: string
  isEditable: boolean
}

interface ZaloMessage {
  id: number
  content: string
  direction: 'incoming' | 'outgoing'
  timestamp: string
  sender: string
  tag?: string
  isRead: boolean
}

interface OrderHistory {
  id: number
  action: 'created' | 'status_changed' | 'invoice_added' | 'note_added' | 'refunded' | 'cancelled'
  timestamp: string
  performedBy: string
  oldValue?: string
  newValue?: string
  reason?: string
  details?: string
}

interface Reminder {
  id: number
  type: 'payment' | 'contract' | 'custom'
  schedule: number // hours
  maxAttempts: number
  template: string
  isActive: boolean
}

interface InstallmentData {
  id: number
  plannedAmount: number
  plannedDate: string
  actualAmount: number
  actualDate: string
  status: 'pending' | 'partial' | 'completed'
}

interface Order {
  id: number
  orderNumber: string
  customerId: number
  customer: Customer
  items: OrderItem[]
  subtotal: number
  discount: number
  tax: number
  total: number
  totalAmount: number
  status: 'draft' | 'pending' | 'confirmed' | 'processing' | 'completed' | 'cancelled' | 'refunded'
  paymentStatus: 'unpaid' | 'partial' | 'paid' | 'refunded'
  paymentMethod: 'cash' | 'transfer' | 'card' | 'installment' | 'momo' | 'custom'
  notes: OrderNote[]
  invoices: Invoice[]
  tags: string[]
  createdAt: string
  createdBy: string
  updatedAt: string
  history: OrderHistory[]
  zaloMessages: ZaloMessage[]
  deadline?: string
  remindersSent: number
  isVip: boolean
  upsellSuggestions?: Product[]
  crosssellSuggestions?: Product[]
  // Installment payment fields
  paymentMode?: 'full' | 'installment'
  installments?: InstallmentData[]
  totalPaid?: number
  remainingDebt?: number
}

export default function OrderManagement() {
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'products' | 'reminders'>('orders')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [selectedOrders, setSelectedOrders] = useState<number[]>([])
  const [showBulkActions, setShowBulkActions] = useState(false)
  const [filters, setFilters] = useState({
    status: '',
    paymentStatus: '',
    timeRange: '',
    search: '',
    tags: [] as string[]
  })
  const [customDateRange, setCustomDateRange] = useState({ startDate: '', endDate: '' })
  const [notification, setNotification] = useState<{message: string, type: 'success' | 'error'} | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showExportDropdown, setShowExportDropdown] = useState(false)
  const [openActionMenu, setOpenActionMenu] = useState<number | null>(null)
  const [showReminderTooltip, setShowReminderTooltip] = useState(false)
  const [reminderFilters, setReminderFilters] = useState({
    search: '',
    status: 'all',
    sortBy: 'deadline'
  })
  const [selectedReminderOrders, setSelectedReminderOrders] = useState<number[]>([])
  const [showSendReminderDialog, setShowSendReminderDialog] = useState(false)
  const [showCustomerDetail, setShowCustomerDetail] = useState(false)
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [customerDetailTab, setCustomerDetailTab] = useState<'info' | 'history' | 'orders' | 'notes'>('info')
  
  // Edit and Cancel Order states
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingOrder, setEditingOrder] = useState<Order | null>(null)
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [cancelingOrder, setCancelingOrder] = useState<Order | null>(null)
  const [cancelReason, setCancelReason] = useState('')

  // New Order Modal states
  const [selectedCustomerForNewOrder, setSelectedCustomerForNewOrder] = useState<Customer | null>(null)
  const [selectedProducts, setSelectedProducts] = useState<string[]>([])
  const [selectedPackages, setSelectedPackages] = useState<{[productId: string]: string}>({})
  const [productQuantities, setProductQuantities] = useState<{[productId: string]: number}>({})
  const [orderNotes, setOrderNotes] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('Tất cả')
  const [paymentMethod, setPaymentMethod] = useState('cash')
  const [paymentDeadline, setPaymentDeadline] = useState('')
  const [discountPercent, setDiscountPercent] = useState(0)
  const [discountType, setDiscountType] = useState<'%' | 'VND'>('%')
  const [paymentMode, setPaymentMode] = useState<'full' | 'installment'>('full')
  const [paymentInstallments, setPaymentInstallments] = useState(1)
  const [installmentData, setInstallmentData] = useState([{amount: 0, date: ''}])

  // Available products for order creation
  const availableProducts = [
    { id: 'crm-basic', name: 'CRM Basic', category: 'Phần mềm', price: 500000, description: 'Hệ thống CRM cơ bản cho doanh nghiệp nhỏ' },
    { id: 'crm-professional', name: 'CRM Professional', category: 'Phần mềm', price: 1200000, description: 'Hệ thống CRM chuyên nghiệp với nhiều tính năng nâng cao' },
    { id: 'crm-enterprise', name: 'CRM Enterprise', category: 'Phần mềm', price: 2500000, description: 'Hệ thống CRM doanh nghiệp với đầy đủ tính năng' },
    { id: 'ai-analytics', name: 'AI Analytics Module', category: 'Phần mềm', price: 800000, description: 'Module phân tích dữ liệu với AI' },
    { id: 'mobile-app', name: 'Mobile App License', category: 'Phần mềm', price: 300000, description: 'Giấy phép sử dụng ứng dụng di động' },
    { id: 'marketing-course', name: 'Khóa học Marketing Online', category: 'Khóa học', price: 2000000, description: 'Khóa học Marketing Digital toàn diện' },
    { id: 'sales-course', name: 'Khóa học Kỹ năng bán hàng', category: 'Khóa học', price: 1500000, description: 'Đào tạo kỹ năng bán hàng chuyên nghiệp' },
    { id: 'crm-training', name: 'Khóa đào tạo sử dụng CRM', category: 'Khóa học', price: 800000, description: 'Hướng dẫn sử dụng hệ thống CRM hiệu quả' },
    { id: 'consulting-basic', name: 'Tư vấn triển khai cơ bản', category: 'Dịch vụ tư vấn', price: 5000000, description: 'Dịch vụ tư vấn triển khai CRM cơ bản' },
    { id: 'consulting-advanced', name: 'Tư vấn chiến lược kinh doanh', category: 'Dịch vụ tư vấn', price: 10000000, description: 'Tư vấn chiến lược và tối ưu hóa quy trình' },
    { id: 'support-package', name: 'Gói hỗ trợ kỹ thuật', category: 'Dịch vụ tư vấn', price: 3000000, description: 'Hỗ trợ kỹ thuật 24/7 trong 6 tháng' }
  ]

  const availablePackages: {[key: string]: {id: string, name: string, price: number, description: string}[]} = {
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

  const productCategories = ['Tất cả', 'Phần mềm', 'Khóa học', 'Dịch vụ tư vấn']

  // Format currency helper
  const formatCurrency = (amount: string | number) => {
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount
    return new Intl.NumberFormat('vi-VN').format(numAmount)
  }

  // Sample data
  const [customers] = useState<Customer[]>([
    {
      id: 1,
      name: 'Nguyễn Văn A',
      phone: '0901234567',
      email: 'nguyenvana@email.com',
      company: 'ABC Corp',
      type: 'customer'
    },
    {
      id: 2,
      name: 'Trần Thị B',
      phone: '0902345678',
      email: 'tranthib@email.com',
      type: 'lead'
    }
  ])

  const [products] = useState<Product[]>([
    {
      id: 1,
      name: 'Gói Tư Vấn CRM',
      code: 'CRM-001',
      basePrice: 5000000,
      category: 'Tư vấn',
      description: 'Gói tư vấn triển khai CRM cho doanh nghiệp',
      variants: [
        { id: 1, name: 'Cơ bản', price: 5000000, description: 'Tư vấn cơ bản 10 giờ' },
        { id: 2, name: 'Nâng cao', price: 8000000, description: 'Tư vấn nâng cao 20 giờ' },
        { id: 3, name: 'Cao cấp', price: 12000000, description: 'Tư vấn cao cấp 40 giờ' }
      ]
    },
    {
      id: 2,
      name: 'Phần Mềm ERP',
      code: 'ERP-001',
      basePrice: 15000000,
      category: 'Phần mềm',
      description: 'Hệ thống quản lý tài nguyên doanh nghiệp',
      variants: [
        { id: 4, name: 'Starter', price: 15000000, description: 'Dành cho 5-10 người dùng' },
        { id: 5, name: 'Professional', price: 25000000, description: 'Dành cho 10-50 người dùng' },
        { id: 6, name: 'Enterprise', price: 50000000, description: 'Dành cho 50+ người dùng' }
      ]
    }
  ])

  const [orders, setOrders] = useState<Order[]>([
    {
      id: 1,
      orderNumber: 'DH20260127001',
      customerId: 1,
      customer: customers[0],
      items: [{ id: 1, productId: 1, product: products[0], variantId: 2, variant: products[0].variants[1], quantity: 1, unitPrice: 8000000, totalPrice: 8000000, notes: 'Khách yêu cầu tư vấn online' }],
      subtotal: 8000000,
      discount: 800000,
      tax: 720000,
      total: 7920000,
      totalAmount: 7920000,
      status: 'confirmed',
      paymentStatus: 'unpaid',
      paymentMethod: 'transfer',
      notes: [{ id: 1, content: 'Khách hàng yêu cầu gửi hợp đồng qua Zalo', type: 'customer_request', createdAt: '2026-01-27T10:30:00', createdBy: 'Nguyễn Sales', isEditable: true }],
      invoices: [],
      tags: ['VIP', 'Khẩn cấp'],
      createdAt: '2026-01-27T09:00:00',
      createdBy: 'Nguyễn Sales Manager',
      updatedAt: '2026-01-27T10:30:00',
      history: [],
      zaloMessages: [],
      deadline: '2026-01-30T23:59:59',
      remindersSent: 0,
      isVip: true,
      upsellSuggestions: [products[0]],
      crosssellSuggestions: [products[1]]
    },
    {
      id: 2,
      orderNumber: 'DH20260127002',
      customerId: 2,
      customer: customers[1],
      items: [{ id: 2, productId: 2, product: products[1], variantId: 4, variant: products[1].variants[0], quantity: 1, unitPrice: 15000000, totalPrice: 15000000 }],
      subtotal: 15000000,
      discount: 0,
      tax: 1350000,
      total: 16350000,
      totalAmount: 16350000,
      status: 'pending',
      paymentStatus: 'partial',
      paymentMethod: 'transfer',
      notes: [],
      invoices: [],
      tags: ['Mới', 'Thanh toán một phần'],
      createdAt: '2026-01-27T08:30:00',
      createdBy: 'Trần Sales',
      updatedAt: '2026-01-27T08:30:00',
      history: [],
      zaloMessages: [],
      deadline: '2026-01-31T23:59:59',
      remindersSent: 0,
      isVip: false,
      // Installment payment data - 2 phases
      paymentMode: 'installment',
      installments: [
        { id: 1, plannedAmount: 8000000, plannedDate: '2026-01-30', actualAmount: 0, actualDate: '', status: 'pending' },
        { id: 2, plannedAmount: 8350000, plannedDate: '2026-02-10', actualAmount: 0, actualDate: '', status: 'pending' }
      ],
      totalPaid: 0,
      remainingDebt: 16350000
    },
    {
      id: 3,
      orderNumber: 'DH20260126003',
      customerId: 1,
      customer: customers[0],
      items: [{ id: 3, productId: 1, product: products[0], variantId: 3, variant: products[0].variants[2], quantity: 2, unitPrice: 12000000, totalPrice: 24000000 }],
      subtotal: 24000000,
      discount: 2400000,
      tax: 2160000,
      total: 23760000,
      totalAmount: 23760000,
      status: 'completed',
      paymentStatus: 'paid',
      paymentMethod: 'transfer',
      notes: [],
      invoices: [],
      tags: ['VIP', 'Hoàn thành'],
      createdAt: '2026-01-26T14:00:00',
      createdBy: 'Nguyễn Sales Manager',
      updatedAt: '2026-01-27T09:00:00',
      history: [],
      zaloMessages: [],
      deadline: '2026-01-29T23:59:59',
      remindersSent: 1,
      isVip: true
    },
    {
      id: 4,
      orderNumber: 'DH20260126004',
      customerId: 2,
      customer: customers[1],
      items: [{ id: 4, productId: 2, product: products[1], variantId: 5, variant: products[1].variants[1], quantity: 1, unitPrice: 25000000, totalPrice: 25000000 }],
      subtotal: 25000000,
      discount: 1250000,
      tax: 2250000,
      total: 26000000,
      totalAmount: 26000000,
      status: 'processing',
      paymentStatus: 'partial',
      paymentMethod: 'transfer',
      notes: [],
      invoices: [],
      tags: ['Quan trọng', 'Thanh toán một phần'],
      createdAt: '2026-01-26T11:20:00',
      createdBy: 'Lê Sales',
      updatedAt: '2026-01-26T15:30:00',
      history: [],
      zaloMessages: [],
      deadline: '2026-02-02T23:59:59',
      remindersSent: 0,
      isVip: false,
      // Installment payment data
      paymentMode: 'installment',
      installments: [
        { id: 1, plannedAmount: 10000000, plannedDate: '2026-01-28', actualAmount: 10000000, actualDate: '2026-01-28', status: 'completed' },
        { id: 2, plannedAmount: 8000000, plannedDate: '2026-02-05', actualAmount: 0, actualDate: '', status: 'pending' },
        { id: 3, plannedAmount: 8000000, plannedDate: '2026-02-15', actualAmount: 0, actualDate: '', status: 'pending' }
      ],
      totalPaid: 10000000,
      remainingDebt: 16000000
    },
    {
      id: 5,
      orderNumber: 'DH20260125005',
      customerId: 1,
      customer: customers[0],
      items: [{ id: 5, productId: 1, product: products[0], variantId: 1, variant: products[0].variants[0], quantity: 3, unitPrice: 5000000, totalPrice: 15000000 }],
      subtotal: 15000000,
      discount: 0,
      tax: 1350000,
      total: 16350000,
      totalAmount: 16350000,
      status: 'cancelled',
      paymentStatus: 'refunded',
      paymentMethod: 'card',
      notes: [{ id: 2, content: 'Khách hủy vì thay đổi kế hoạch', type: 'internal', createdAt: '2026-01-26T10:00:00', createdBy: 'Admin', isEditable: false }],
      invoices: [],
      tags: ['Đã hủy'],
      createdAt: '2026-01-25T16:45:00',
      createdBy: 'Phạm Sales',
      updatedAt: '2026-01-26T10:00:00',
      history: [],
      zaloMessages: [],
      deadline: '2026-01-28T23:59:59',
      remindersSent: 2,
      isVip: true
    },
    {
      id: 6,
      orderNumber: 'DH20260125006',
      customerId: 2,
      customer: customers[1],
      items: [{ id: 6, productId: 2, product: products[1], variantId: 6, variant: products[1].variants[2], quantity: 1, unitPrice: 50000000, totalPrice: 50000000 }],
      subtotal: 50000000,
      discount: 5000000,
      tax: 4500000,
      total: 49500000,
      totalAmount: 49500000,
      status: 'confirmed',
      paymentStatus: 'unpaid',
      paymentMethod: 'transfer',
      notes: [],
      invoices: [],
      tags: ['VIP', 'Lớn'],
      createdAt: '2026-01-25T10:15:00',
      createdBy: 'Hoàng Sales',
      updatedAt: '2026-01-25T14:20:00',
      history: [],
      zaloMessages: [],
      deadline: '2026-02-05T23:59:59',
      remindersSent: 0,
      isVip: true
    },
    {
      id: 7,
      orderNumber: 'DH20260124007',
      customerId: 1,
      customer: customers[0],
      items: [{ id: 7, productId: 1, product: products[0], variantId: 2, variant: products[0].variants[1], quantity: 1, unitPrice: 8000000, totalPrice: 8000000 }],
      subtotal: 8000000,
      discount: 400000,
      tax: 720000,
      total: 8320000,
      totalAmount: 8320000,
      status: 'draft',
      paymentStatus: 'unpaid',
      paymentMethod: 'transfer',
      notes: [],
      invoices: [],
      tags: ['Nháp'],
      createdAt: '2026-01-24T09:30:00',
      createdBy: 'Vũ Sales',
      updatedAt: '2026-01-24T09:30:00',
      history: [],
      zaloMessages: [],
      deadline: '2026-01-27T23:59:59',
      remindersSent: 0,
      isVip: false
    },
    {
      id: 8,
      orderNumber: 'DH20260124008',
      customerId: 2,
      customer: customers[1],
      items: [{ id: 8, productId: 2, product: products[1], variantId: 4, variant: products[1].variants[0], quantity: 2, unitPrice: 15000000, totalPrice: 30000000 }],
      subtotal: 30000000,
      discount: 3000000,
      tax: 2700000,
      total: 29700000,
      totalAmount: 29700000,
      status: 'completed',
      paymentStatus: 'paid',
      paymentMethod: 'cash',
      notes: [],
      invoices: [],
      tags: ['Hoàn thành'],
      createdAt: '2026-01-24T08:00:00',
      createdBy: 'Mai Sales',
      updatedAt: '2026-01-26T16:00:00',
      history: [],
      zaloMessages: [],
      deadline: '2026-01-30T23:59:59',
      remindersSent: 0,
      isVip: false
    },
    {
      id: 9,
      orderNumber: 'DH20260123009',
      customerId: 1,
      customer: customers[0],
      items: [{ id: 9, productId: 1, product: products[0], variantId: 3, variant: products[0].variants[2], quantity: 1, unitPrice: 12000000, totalPrice: 12000000 }],
      subtotal: 12000000,
      discount: 600000,
      tax: 1080000,
      total: 12480000,
      totalAmount: 12480000,
      status: 'pending',
      paymentStatus: 'unpaid',
      paymentMethod: 'transfer',
      notes: [],
      invoices: [],
      tags: ['Chờ xác nhận'],
      createdAt: '2026-01-23T15:20:00',
      createdBy: 'Đức Sales',
      updatedAt: '2026-01-23T15:20:00',
      history: [],
      zaloMessages: [],
      deadline: '2026-01-29T23:59:59',
      remindersSent: 0,
      isVip: true
    },
    {
      id: 10,
      orderNumber: 'DH20260123010',
      customerId: 2,
      customer: customers[1],
      items: [{ id: 10, productId: 2, product: products[1], variantId: 5, variant: products[1].variants[1], quantity: 1, unitPrice: 25000000, totalPrice: 25000000 }],
      subtotal: 25000000,
      discount: 0,
      tax: 2250000,
      total: 27250000,
      totalAmount: 27250000,
      status: 'processing',
      paymentStatus: 'unpaid',
      paymentMethod: 'card',
      notes: [],
      invoices: [],
      tags: ['Đang xử lý'],
      createdAt: '2026-01-23T11:45:00',
      createdBy: 'An Sales',
      updatedAt: '2026-01-24T10:00:00',
      history: [],
      zaloMessages: [],
      deadline: '2026-02-01T23:59:59',
      remindersSent: 1,
      isVip: false
    },
    {
      id: 11,
      orderNumber: 'DH20260122011',
      customerId: 1,
      customer: customers[0],
      items: [{ id: 11, productId: 1, product: products[0], variantId: 1, variant: products[0].variants[0], quantity: 5, unitPrice: 5000000, totalPrice: 25000000 }],
      subtotal: 25000000,
      discount: 2500000,
      tax: 2250000,
      total: 24750000,
      totalAmount: 24750000,
      status: 'confirmed',
      paymentStatus: 'partial',
      paymentMethod: 'transfer',
      notes: [],
      invoices: [],
      tags: ['VIP', 'Số lượng lớn'],
      createdAt: '2026-01-22T13:30:00',
      createdBy: 'Bình Sales',
      updatedAt: '2026-01-23T09:15:00',
      history: [],
      zaloMessages: [],
      deadline: '2026-02-03T23:59:59',
      remindersSent: 0,
      isVip: true
    },
    {
      id: 12,
      orderNumber: 'DH20260122012',
      customerId: 2,
      customer: customers[1],
      items: [{ id: 12, productId: 2, product: products[1], variantId: 6, variant: products[1].variants[2], quantity: 1, unitPrice: 50000000, totalPrice: 50000000 }],
      subtotal: 50000000,
      discount: 0,
      tax: 4500000,
      total: 54500000,
      totalAmount: 54500000,
      status: 'completed',
      paymentStatus: 'paid',
      paymentMethod: 'transfer',
      notes: [],
      invoices: [],
      tags: ['Hoàn thành', 'Lớn'],
      createdAt: '2026-01-22T10:00:00',
      createdBy: 'Chi Sales',
      updatedAt: '2026-01-25T17:00:00',
      history: [],
      zaloMessages: [],
      deadline: '2026-02-04T23:59:59',
      remindersSent: 0,
      isVip: false
    },
    {
      id: 13,
      orderNumber: 'DH20260121013',
      customerId: 1,
      customer: customers[0],
      items: [{ id: 13, productId: 1, product: products[0], variantId: 2, variant: products[0].variants[1], quantity: 2, unitPrice: 8000000, totalPrice: 16000000 }],
      subtotal: 16000000,
      discount: 1600000,
      tax: 1440000,
      total: 15840000,
      totalAmount: 15840000,
      status: 'pending',
      paymentStatus: 'unpaid',
      paymentMethod: 'cash',
      notes: [],
      invoices: [],
      tags: ['Chờ'],
      createdAt: '2026-01-21T14:25:00',
      createdBy: 'Dũng Sales',
      updatedAt: '2026-01-21T14:25:00',
      history: [],
      zaloMessages: [],
      deadline: '2026-01-28T23:59:59',
      remindersSent: 0,
      isVip: true
    },
    {
      id: 14,
      orderNumber: 'DH20260121014',
      customerId: 2,
      customer: customers[1],
      items: [{ id: 14, productId: 2, product: products[1], variantId: 4, variant: products[1].variants[0], quantity: 1, unitPrice: 15000000, totalPrice: 15000000 }],
      subtotal: 15000000,
      discount: 750000,
      tax: 1350000,
      total: 15600000,
      totalAmount: 15600000,
      status: 'processing',
      paymentStatus: 'unpaid',
      paymentMethod: 'transfer',
      notes: [],
      invoices: [],
      tags: ['Đang xử lý'],
      createdAt: '2026-01-21T09:50:00',
      createdBy: 'Giang Sales',
      updatedAt: '2026-01-22T11:30:00',
      history: [],
      zaloMessages: [],
      deadline: '2026-01-31T23:59:59',
      remindersSent: 1,
      isVip: false
    },
    {
      id: 15,
      orderNumber: 'DH20260120015',
      customerId: 1,
      customer: customers[0],
      items: [{ id: 15, productId: 1, product: products[0], variantId: 3, variant: products[0].variants[2], quantity: 1, unitPrice: 12000000, totalPrice: 12000000 }],
      subtotal: 12000000,
      discount: 0,
      tax: 1080000,
      total: 13080000,
      totalAmount: 13080000,
      status: 'confirmed',
      paymentStatus: 'paid',
      paymentMethod: 'card',
      notes: [],
      invoices: [],
      tags: ['VIP', 'Đã thanh toán'],
      createdAt: '2026-01-20T16:10:00',
      createdBy: 'Hà Sales',
      updatedAt: '2026-01-21T10:00:00',
      history: [],
      zaloMessages: [],
      deadline: '2026-01-30T23:59:59',
      remindersSent: 0,
      isVip: true
    },
    {
      id: 16,
      orderNumber: 'DH20260120016',
      customerId: 2,
      customer: customers[1],
      items: [{ id: 16, productId: 2, product: products[1], variantId: 5, variant: products[1].variants[1], quantity: 2, unitPrice: 25000000, totalPrice: 50000000 }],
      subtotal: 50000000,
      discount: 5000000,
      tax: 4500000,
      total: 49500000,
      totalAmount: 49500000,
      status: 'draft',
      paymentStatus: 'unpaid',
      paymentMethod: 'transfer',
      notes: [],
      invoices: [],
      tags: ['Nháp', 'Lớn'],
      createdAt: '2026-01-20T12:00:00',
      createdBy: 'Khánh Sales',
      updatedAt: '2026-01-20T12:00:00',
      history: [],
      zaloMessages: [],
      deadline: '2026-02-02T23:59:59',
      remindersSent: 0,
      isVip: false
    },
    {
      id: 17,
      orderNumber: 'DH20260119017',
      customerId: 1,
      customer: customers[0],
      items: [{ id: 17, productId: 1, product: products[0], variantId: 1, variant: products[0].variants[0], quantity: 4, unitPrice: 5000000, totalPrice: 20000000 }],
      subtotal: 20000000,
      discount: 2000000,
      tax: 1800000,
      total: 19800000,
      totalAmount: 19800000,
      status: 'completed',
      paymentStatus: 'paid',
      paymentMethod: 'transfer',
      notes: [],
      invoices: [],
      tags: ['Hoàn thành', 'VIP'],
      createdAt: '2026-01-19T15:40:00',
      createdBy: 'Linh Sales',
      updatedAt: '2026-01-22T14:00:00',
      history: [],
      zaloMessages: [],
      deadline: '2026-01-29T23:59:59',
      remindersSent: 0,
      isVip: true
    },
    {
      id: 18,
      orderNumber: 'DH20260119018',
      customerId: 2,
      customer: customers[1],
      items: [{ id: 18, productId: 2, product: products[1], variantId: 6, variant: products[1].variants[2], quantity: 1, unitPrice: 50000000, totalPrice: 50000000 }],
      subtotal: 50000000,
      discount: 2500000,
      tax: 4500000,
      total: 52000000,
      totalAmount: 52000000,
      status: 'cancelled',
      paymentStatus: 'refunded',
      paymentMethod: 'transfer',
      notes: [{ id: 3, content: 'Khách yêu cầu hủy do vượt ngân sách', type: 'internal', createdAt: '2026-01-20T09:00:00', createdBy: 'Manager', isEditable: false }],
      invoices: [],
      tags: ['Đã hủy'],
      createdAt: '2026-01-19T11:20:00',
      createdBy: 'Nam Sales',
      updatedAt: '2026-01-20T09:00:00',
      history: [],
      zaloMessages: [],
      deadline: '2026-02-05T23:59:59',
      remindersSent: 1,
      isVip: false
    },
    {
      id: 19,
      orderNumber: 'DH20260118019',
      customerId: 1,
      customer: customers[0],
      items: [{ id: 19, productId: 1, product: products[0], variantId: 2, variant: products[0].variants[1], quantity: 3, unitPrice: 8000000, totalPrice: 24000000 }],
      subtotal: 24000000,
      discount: 1200000,
      tax: 2160000,
      total: 25000000,
      totalAmount: 25000000,
      status: 'processing',
      paymentStatus: 'partial',
      paymentMethod: 'card',
      notes: [],
      invoices: [],
      tags: ['VIP', 'Đang xử lý'],
      createdAt: '2026-01-18T13:15:00',
      createdBy: 'Oanh Sales',
      updatedAt: '2026-01-20T16:30:00',
      history: [],
      zaloMessages: [],
      deadline: '2026-02-01T23:59:59',
      remindersSent: 1,
      isVip: true
    },
    {
      id: 20,
      orderNumber: 'DH20260118020',
      customerId: 2,
      customer: customers[1],
      items: [{ id: 20, productId: 2, product: products[1], variantId: 4, variant: products[1].variants[0], quantity: 3, unitPrice: 15000000, totalPrice: 45000000 }],
      subtotal: 45000000,
      discount: 4500000,
      tax: 4050000,
      total: 44550000,
      totalAmount: 44550000,
      status: 'pending',
      paymentStatus: 'unpaid',
      paymentMethod: 'transfer',
      notes: [],
      invoices: [],
      tags: ['Mới', 'Lớn'],
      createdAt: '2026-01-18T10:00:00',
      createdBy: 'Phương Sales',
      updatedAt: '2026-01-18T10:00:00',
      history: [],
      zaloMessages: [],
      deadline: '2026-02-03T23:59:59',
      remindersSent: 0,
      isVip: false
    }
  ])

  // Keyboard shortcuts and effects
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 'a':
            e.preventDefault()
            const filteredOrders = orders.filter(order => {
              if (filters.status && order.status !== filters.status) return false
              if (filters.paymentStatus && order.paymentStatus !== filters.paymentStatus) return false
              if (filters.search) {
                const searchLower = filters.search.toLowerCase()
                if (!order.orderNumber.toLowerCase().includes(searchLower) &&
                    !order.customer.name.toLowerCase().includes(searchLower) &&
                    !order.customer.phone.includes(searchLower)) return false
              }
              return true
            })
            if (filteredOrders.length > 0) {
              setSelectedOrders(filteredOrders.map(order => order.id))
            }
            break
          case 'Escape':
            setSelectedOrders([])
            break
        }
      }
    }

    document.addEventListener('keydown', handleKeyPress)
    return () => document.removeEventListener('keydown', handleKeyPress)
  }, [orders, filters])

  // Clear selection when filters change
  useEffect(() => {
    setSelectedOrders([])
  }, [filters])

  // Helper functions
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft':
        return 'bg-gray-100 text-gray-800 border-gray-200'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'confirmed':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'processing':
        return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'refunded':
        return 'bg-orange-100 text-orange-800 border-orange-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'unpaid':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'partial':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'paid':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'refunded':
        return 'bg-orange-100 text-orange-800 border-orange-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'draft': return 'Nháp'
      case 'pending': return 'Chờ xác nhận'
      case 'confirmed': return 'Đã xác nhận'
      case 'processing': return 'Đang xử lý'
      case 'completed': return 'Hoàn thành'
      case 'cancelled': return 'Đã hủy'
      case 'refunded': return 'Đã hoàn'
      default: return status
    }
  }

  const getPaymentStatusText = (status: string) => {
    switch (status) {
      case 'unpaid': return 'Chưa thanh toán'
      case 'partial': return 'Thanh toán một phần'
      case 'paid': return 'Đã thanh toán'
      case 'refunded': return 'Đã hoàn tiền'
      default: return status
    }
  }

  const getTagColor = (tag: string) => {
    switch (tag.toLowerCase()) {
      case 'vip':
        return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'khẩn cấp':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'chờ ký hợp đồng':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'thanh toán trễ':
        return 'bg-orange-100 text-orange-800 border-orange-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const calculateTimeRemaining = (deadline: string) => {
    const now = new Date()
    const deadlineDate = new Date(deadline)
    const diff = deadlineDate.getTime() - now.getTime()
    
    if (diff <= 0) return 'Quá hạn'
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    
    if (days > 0) return `Còn ${days} ngày ${hours} giờ`
    return `Còn ${hours} giờ`
  }

  // Overview Metrics
  const getOverviewMetrics = () => {
    const totalOrders = orders.length
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0)
    const unpaidOrders = orders.filter(o => o.paymentStatus === 'unpaid').length
    const overdueOrders = orders.filter(o => o.deadline && new Date(o.deadline) < new Date()).length
    const vipOrders = orders.filter(o => o.isVip).length
    const completedOrders = orders.filter(o => o.status === 'completed').length

    return {
      totalOrders,
      totalRevenue,
      unpaidOrders,
      overdueOrders,
      vipOrders,
      completedOrders,
      completionRate: totalOrders > 0 ? Math.round((completedOrders / totalOrders) * 100) : 0
    }
  }

  // Handle create order
  const handleCreateOrder = (orderData: any) => {
    const newOrder: Order = {
      id: Date.now(),
      ...orderData,
      customer: customers.find(c => c.id === parseInt(orderData.customerId))!,
      history: [{
        id: Date.now(),
        action: 'created',
        timestamp: new Date().toISOString(),
        performedBy: 'Nguyễn Sales Manager',
        details: `Tạo đơn hàng ${orderData.orderNumber}`
      }],
      remindersSent: 0,
      createdBy: 'Nguyễn Sales Manager'
    }

    setOrders(prev => [...prev, newOrder])
    setNotification({
      message: `Đơn hàng ${orderData.orderNumber} đã được tạo thành công!`,
      type: 'success'
    })
    setTimeout(() => setNotification(null), 3000)
  }

  // Handle edit order
  const handleEditOrder = (order: Order) => {
    setEditingOrder(order)
    setShowEditModal(true)
  }

  const handleSaveEditOrder = (updatedOrderData: any) => {
    if (!editingOrder) return

    // Auto-manage tags for installment orders
    let tags = [...(updatedOrderData.tags || editingOrder.tags || [])]
    const hasInstallments = updatedOrderData.installments && updatedOrderData.installments.length > 1
    const hasPartialTag = tags.includes('Thanh toán một phần')
    
    if (hasInstallments && !hasPartialTag) {
      tags.push('Thanh toán một phần')
    }
    
    // Check if fully paid - all installments completed
    let finalStatus = updatedOrderData.status || editingOrder.status
    let finalPaymentStatus = updatedOrderData.paymentStatus || editingOrder.paymentStatus
    
    if (updatedOrderData.installments) {
      const allCompleted = updatedOrderData.installments.every((inst: InstallmentData) => inst.status === 'completed')
      const totalPaid = updatedOrderData.installments.reduce((sum: number, inst: InstallmentData) => sum + inst.actualAmount, 0)
      
      if (allCompleted && totalPaid >= editingOrder.total) {
        finalStatus = 'completed'
        finalPaymentStatus = 'paid'
        // Remove partial tag, add completed tag
        tags = tags.filter(t => t !== 'Thanh toán một phần')
        if (!tags.includes('Hoàn thành')) {
          tags.push('Hoàn thành')
        }
      }
    }

    const updatedOrder: Order = {
      ...editingOrder,
      ...updatedOrderData,
      status: finalStatus,
      paymentStatus: finalPaymentStatus,
      tags,
      updatedAt: new Date().toISOString(),
      history: [
        ...editingOrder.history,
        {
          id: Date.now(),
          action: 'status_changed',
          timestamp: new Date().toISOString(),
          performedBy: 'Nguyễn Sales Manager',
          oldValue: editingOrder.status,
          newValue: finalStatus,
          details: updatedOrderData.paymentStatus === 'paid' ? 'Thanh toán hoàn tất' : 'Chỉnh sửa thông tin đơn hàng'
        }
      ]
    }

    setOrders(prev => prev.map(order => 
      order.id === editingOrder.id ? updatedOrder : order
    ))

    setNotification({
      message: finalPaymentStatus === 'paid' && finalStatus === 'completed'
        ? `Đơn hàng ${editingOrder.orderNumber} đã thanh toán hoàn tất và chuyển sang Hoàn thành!`
        : `Đơn hàng ${editingOrder.orderNumber} đã được cập nhật thành công!`,
      type: 'success'
    })
    setTimeout(() => setNotification(null), 3000)

    setShowEditModal(false)
    setEditingOrder(null)
  }

  // Handle cancel order
  const handleCancelOrder = (order: Order) => {
    setCancelingOrder(order)
    setCancelReason('')
    setShowCancelModal(true)
  }

  const handleConfirmCancelOrder = () => {
    if (!cancelingOrder || !cancelReason.trim()) {
      alert('Vui lòng nhập lý do hủy đơn hàng!')
      return
    }

    const updatedOrder: Order = {
      ...cancelingOrder,
      status: 'cancelled',
      updatedAt: new Date().toISOString(),
      history: [
        ...cancelingOrder.history,
        {
          id: Date.now(),
          action: 'cancelled',
          timestamp: new Date().toISOString(),
          performedBy: 'Nguyễn Sales Manager',
          oldValue: cancelingOrder.status,
          newValue: 'cancelled',
          reason: cancelReason,
          details: `Hủy đơn hàng: ${cancelReason}`
        }
      ]
    }

    setOrders(prev => prev.map(order => 
      order.id === cancelingOrder.id ? updatedOrder : order
    ))

    setNotification({
      message: `Đơn hàng ${cancelingOrder.orderNumber} đã được hủy thành công!`,
      type: 'success'
    })
    setTimeout(() => setNotification(null), 3000)

    setShowCancelModal(false)
    setCancelingOrder(null)
    setCancelReason('')
  }

  // Handle payment reminder
  const handleSendPaymentReminder = (order: Order) => {
    // Check if payment reminder is applicable
    if (order.paymentStatus === 'paid') {
      alert('Đơn hàng này đã được thanh toán đầy đủ!')
      return
    }
    
    if (order.status === 'cancelled') {
      alert('Không thể gửi nhắc nhở cho đơn hàng đã hủy!')
      return
    }

    // Simulate sending payment reminder
    const reminderMessage = `Kính chào ${order.customer.name},
    
Chúng tôi xin nhắc nhở về việc thanh toán cho đơn hàng ${order.orderNumber} với số tiền ${order.total.toLocaleString('vi-VN')} VNĐ.

Trạng thái hiện tại: ${
  order.paymentStatus === 'unpaid' ? 'Chưa thanh toán' :
  order.paymentStatus === 'partial' ? 'Thanh toán một phần' : 'Đã thanh toán'
}

Vui lòng liên hệ với chúng tôi nếu bạn cần hỗ trợ thêm.

Trân trọng,
Đội ngũ bán hàng`

    // Update order with reminder sent
    const updatedOrder: Order = {
      ...order,
      remindersSent: order.remindersSent + 1,
      updatedAt: new Date().toISOString(),
      history: [
        ...order.history,
        {
          id: Date.now(),
          action: 'note_added',
          timestamp: new Date().toISOString(),
          performedBy: 'Nguyễn Sales Manager',
          details: `Gửi nhắc nhở thanh toán lần thứ ${order.remindersSent + 1}`
        }
      ]
    }

    setOrders(prev => prev.map(o => 
      o.id === order.id ? updatedOrder : o
    ))

    setNotification({
      message: `Đã gửi nhắc nhở thanh toán cho đơn hàng ${order.orderNumber}`,
      type: 'success'
    })
    setTimeout(() => setNotification(null), 3000)

    console.log('Payment reminder sent:', reminderMessage)
  }

  // Handle bulk operations
  const handleBulkOperation = async (operation: string) => {
    if (selectedOrders.length === 0 && selectedReminderOrders.length === 0) return
    
    setIsLoading(true)
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Use selectedReminderOrders if in reminder tab, otherwise use selectedOrders
      const orderIds = selectedReminderOrders.length > 0 ? selectedReminderOrders : selectedOrders
      
      switch (operation) {
        case 'mark_paid':
          setOrders(prev => prev.map(order => 
            orderIds.includes(order.id) 
              ? { ...order, paymentStatus: 'paid' as const }
              : order
          ))
          setNotification({
            message: `Đã đánh dấu ${orderIds.length} đơn hàng là đã thanh toán`,
            type: 'success'
          })
          // Clear both selected arrays
          setSelectedReminderOrders([])
          break
        case 'mark_completed':
          setOrders(prev => prev.map(order => 
            orderIds.includes(order.id) 
              ? { ...order, status: 'completed' as const }
              : order
          ))
          setNotification({
            message: `Đã hoàn thành ${orderIds.length} đơn hàng`,
            type: 'success'
          })
          break
        case 'send_reminder':
          setOrders(prev => prev.map(order => 
            orderIds.includes(order.id) 
              ? { ...order, remindersSent: order.remindersSent + 1 }
              : order
          ))
          setNotification({
            message: `Đã gửi nhắc nhở thanh toán cho ${orderIds.length} đơn hàng`,
            type: 'success'
          })
          // Clear reminder orders after sending
          setSelectedReminderOrders([])
          break
        case 'export':
          exportOrdersToCSV(orders.filter(order => orderIds.includes(order.id)))
          break
      }
      setSelectedOrders([])
      setShowBulkActions(false)
    } catch (error) {
      setNotification({
        message: 'Có lỗi xảy ra khi thực hiện thao tác',
        type: 'error'
      })
    } finally {
      setIsLoading(false)
      setTimeout(() => setNotification(null), 3000)
    }
  }

  // Export to CSV
  const exportOrdersToCSV = (ordersToExport: Order[]) => {
    const headers = ['Mã đơn', 'Khách hàng', 'Tổng tiền', 'Trạng thái', 'Thanh toán', 'Ngày tạo']
    const rows = ordersToExport.map(order => [
      order.orderNumber,
      order.customer.name,
      order.total.toString(),
      getStatusText(order.status),
      getPaymentStatusText(order.paymentStatus),
      new Date(order.createdAt).toLocaleDateString('vi-VN')
    ])
    
    const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `don-hang-${new Date().toISOString().split('T')[0]}.csv`
    link.click()
    
    setNotification({
      message: `Đã xuất ${ordersToExport.length} đơn hàng`,
      type: 'success'
    })
    setTimeout(() => setNotification(null), 3000)
  }

  // Filter orders
  const getFilteredOrders = () => {
    return orders.filter(order => {
      if (filters.status && order.status !== filters.status) return false
      if (filters.paymentStatus && order.paymentStatus !== filters.paymentStatus) return false
      if (filters.search) {
        const searchLower = filters.search.toLowerCase()
        if (!order.orderNumber.toLowerCase().includes(searchLower) &&
            !order.customer.name.toLowerCase().includes(searchLower) &&
            !order.customer.phone.includes(searchLower)) return false
      }
      if (filters.tags.length > 0) {
        if (!filters.tags.some(tag => order.tags.includes(tag))) return false
      }
      if (filters.timeRange) {
        const orderDate = new Date(order.createdAt)
        const today = new Date()
        const yesterday = new Date(today)
        yesterday.setDate(yesterday.getDate() - 1)
        
        switch (filters.timeRange) {
          case 'today':
            if (orderDate.toDateString() !== today.toDateString()) return false
            break
          case 'yesterday':
            if (orderDate.toDateString() !== yesterday.toDateString()) return false
            break
          case 'thisWeek':
            const weekStart = new Date(today)
            weekStart.setDate(today.getDate() - today.getDay())
            if (orderDate < weekStart) return false
            break
          case 'thisMonth':
            if (orderDate.getMonth() !== today.getMonth() || orderDate.getFullYear() !== today.getFullYear()) return false
            break
        }
      }
      return true
    })
  }

  const metrics = getOverviewMetrics()

  // Render functions
  const renderOverview = () => (
    <div className="space-y-6">
      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-white p-6 border border-blue-100 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-600">Tổng đơn hàng</div>
              <div className="text-2xl font-bold text-blue-600">{metrics.totalOrders}</div>
            </div>
            <ShoppingCart className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-white p-6 border border-green-100 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-600">Tổng doanh thu</div>
              <div className="text-2xl font-bold text-green-600">{formatCurrency(metrics.totalRevenue)}</div>
            </div>
            <DollarSign className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-50 to-white p-6 border border-red-100 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-600">Chưa thanh toán</div>
              <div className="text-2xl font-bold text-red-600">{metrics.unpaidOrders}</div>
            </div>
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-white p-6 border border-purple-100 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-600">Đã thanh toán</div>
              <div className="text-2xl font-bold text-purple-600">{metrics.vipOrders}</div>
            </div>
            <Target className="w-8 h-8 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Đơn hàng cần chú ý</h3>
          <div className="space-y-3">
            {orders.filter(o => o.paymentStatus === 'unpaid' || (o.deadline && new Date(o.deadline) < new Date())).slice(0, 5).map(order => (
              <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium text-gray-900">{order.orderNumber}</div>
                  <div className="text-sm text-gray-500">{order.customer.name}</div>
                </div>
                <div className="flex items-center space-x-2">
                  {order.deadline && new Date(order.deadline) < new Date() && (
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">
                      Quá hạn
                    </span>
                  )}
                  <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getPaymentStatusColor(order.paymentStatus)}`}>
                    {getPaymentStatusText(order.paymentStatus)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Hoạt động gần đây</h3>
          <div className="space-y-3">
            <div className="flex items-center p-3 bg-blue-50 rounded-lg">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
              <div>
                <div className="text-sm font-medium text-gray-900">Đơn mới được tạo</div>
                <div className="text-xs text-gray-500">DH20250611001 - 2 giờ trước</div>
              </div>
            </div>
            <div className="flex items-center p-3 bg-green-50 rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
              <div>
                <div className="text-sm font-medium text-gray-900">Thanh toán thành công</div>
                <div className="text-xs text-gray-500">DH20250610005 - 4 giờ trước</div>
              </div>
            </div>
            <div className="flex items-center p-3 bg-yellow-50 rounded-lg">
              <div className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></div>
              <div>
                <div className="text-sm font-medium text-gray-900">Nhắc thanh toán lần 2</div>
                <div className="text-xs text-gray-500">DH20250609003 - 6 giờ trước</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  // Render Reminders Management  
  const renderRemindersManagement = () => {
    // Get overdue orders
    const overdueOrders = orders.filter(order => 
      order.paymentStatus === 'unpaid' && 
      order.deadline && 
      new Date(order.deadline) < new Date()
    ).map(order => ({ ...order, reminderStatus: 'overdue' as const }))

    // Get upcoming payment reminders (next 7 days)
    const upcomingReminders = orders.filter(order => 
      order.paymentStatus === 'unpaid' && 
      order.deadline && 
      new Date(order.deadline) > new Date() &&
      new Date(order.deadline) <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    ).map(order => ({ ...order, reminderStatus: 'upcoming' as const }))

    // Combine all reminder orders
    const allReminderOrders = [...overdueOrders, ...upcomingReminders]

    // Apply filters and sorting
    const filteredAndSortedOrders = allReminderOrders
      .filter(order => {
        // Search filter
        if (reminderFilters.search) {
          const searchLower = reminderFilters.search.toLowerCase()
          const matchesSearch = 
            order.orderNumber.toLowerCase().includes(searchLower) ||
            order.customer.name.toLowerCase().includes(searchLower) ||
            order.customer.phone.includes(searchLower)
          if (!matchesSearch) return false
        }

        // Status filter
        if (reminderFilters.status !== 'all') {
          if (reminderFilters.status !== order.reminderStatus) return false
        }

        return true
      })
      .sort((a, b) => {
        switch (reminderFilters.sortBy) {
          case 'deadline':
            return new Date(a.deadline!).getTime() - new Date(b.deadline!).getTime()
          case 'amount':
            return b.total - a.total
          case 'reminderCount':
            return b.remindersSent - a.remindersSent
          default:
            return 0
        }
      })

    // Get orders that have been reminded multiple times
    const multipleReminders = orders.filter(order => order.remindersSent >= 2)

    return (
      <div className="space-y-6">
        {/* Reminder Statistics */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          {/* Header with Help Icon */}
          <div className="flex items-center gap-2 mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Quản lý nhắc thanh toán</h3>
            <div 
              className="relative"
              onMouseEnter={() => setShowReminderTooltip(true)}
              onMouseLeave={() => setShowReminderTooltip(false)}
            >
              <HelpCircle className="w-4 h-4 text-gray-400 hover:text-blue-500 cursor-help transition-colors" />
              {showReminderTooltip && (
                <div className="absolute left-0 top-6 z-50 w-80 bg-gray-900 text-white text-xs rounded-lg p-3 shadow-lg">
                  <div className="absolute -top-1 left-4 w-2 h-2 bg-gray-900 transform rotate-45"></div>
                  Tính năng này giúp bạn tự động gửi nhắc thanh toán đến khách hàng (qua email/SMS) và thông báo cho người phụ trách để theo dõi các đơn hàng chưa thanh toán.
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex flex-col justify-center rounded-lg px-6 py-6 min-w-[180px] bg-gradient-to-br from-red-600 to-red-400 text-white shadow-lg cursor-pointer relative transition-all hover:shadow-xl">
              <div className="absolute top-2 right-2">
                <Info className="w-3.5 h-3.5 text-white/70 hover:text-white cursor-help transition-colors" />
              </div>
              <div>
                <p className="text-base font-semibold text-white mb-2">Đơn quá hạn</p>
                <p className="text-4xl font-extrabold text-white">{overdueOrders.length}</p>
              </div>
            </div>

            <div className="flex flex-col justify-center rounded-lg px-6 py-6 min-w-[180px] bg-gradient-to-br from-yellow-600 to-yellow-400 text-white shadow-lg cursor-pointer relative transition-all hover:shadow-xl">
              <div className="absolute top-2 right-2">
                <Info className="w-3.5 h-3.5 text-white/70 hover:text-white cursor-help transition-colors" />
              </div>
              <div>
                <p className="text-base font-semibold text-white mb-2">Sắp đến hạn</p>
                <p className="text-4xl font-extrabold text-white">{upcomingReminders.length}</p>
              </div>
            </div>

            <div className="flex flex-col justify-center rounded-lg px-6 py-6 min-w-[180px] bg-gradient-to-br from-blue-600 to-blue-400 text-white shadow-lg cursor-pointer relative transition-all hover:shadow-xl">
              <div className="absolute top-2 right-2">
                <Info className="w-3.5 h-3.5 text-white/70 hover:text-white cursor-help transition-colors" />
              </div>
              <div>
                <p className="text-base font-semibold text-white mb-2">Đã nhắc nhiều lần</p>
                <p className="text-4xl font-extrabold text-white">{multipleReminders.length}</p>
              </div>
            </div>

            <div className="flex flex-col justify-center rounded-lg px-6 py-6 min-w-[180px] bg-gradient-to-br from-green-600 to-green-400 text-white shadow-lg cursor-pointer relative transition-all hover:shadow-xl">
              <div className="absolute top-2 right-2">
                <Info className="w-3.5 h-3.5 text-white/70 hover:text-white cursor-help transition-colors" />
              </div>
              <div>
                <p className="text-base font-semibold text-white mb-2">Tổng lần nhắc</p>
                <p className="text-4xl font-extrabold text-white">
                  {orders.reduce((sum, order) => sum + order.remindersSent, 0)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Section */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between gap-4">
            {/* Left side: Search and Filters */}
            <div className="flex items-center gap-3 flex-1">
              {/* Search Input */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Tìm kiếm khách hàng..."
                  value={reminderFilters.search}
                  onChange={(e) => setReminderFilters(prev => ({ ...prev, search: e.target.value }))}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>

              {/* Status Dropdown */}
              <select
                value={reminderFilters.status}
                onChange={(e) => setReminderFilters(prev => ({ ...prev, status: e.target.value }))}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm min-w-[160px]"
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="overdue">Quá hạn</option>
                <option value="upcoming">Sắp đến hạn</option>
              </select>

              {/* Sort Dropdown */}
              <select
                value={reminderFilters.sortBy}
                onChange={(e) => setReminderFilters(prev => ({ ...prev, sortBy: e.target.value }))}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm min-w-[180px]"
              >
                <option value="deadline">Sắp xếp: Thời hạn</option>
                <option value="amount">Sắp xếp: Giá trị đơn hàng</option>
                <option value="reminderCount">Sắp xếp: Số lần nhắc</option>
              </select>
            </div>
          </div>
        </div>

        {/* Bulk Actions Bar for Reminders */}
        {selectedReminderOrders.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium text-blue-900">
                  Đã chọn {selectedReminderOrders.length} khách hàng
                </span>
                <button
                  onClick={() => setSelectedReminderOrders([])}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Bỏ chọn tất cả
                </button>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setShowSendReminderDialog(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 text-sm"
                >
                  <Send className="w-4 h-4" />
                  <span>Gửi nhắc hàng loạt</span>
                </button>
                <button
                  onClick={() => handleBulkOperation('mark_paid')}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2 text-sm"
                >
                  <Check className="w-4 h-4" />
                  <span>Đánh dấu đã thanh toán</span>
                </button>
                <button
                  onClick={() => exportOrdersToCSV(filteredAndSortedOrders)}
                  className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors flex items-center space-x-2 text-sm"
                >
                  <Download className="w-4 h-4" />
                  <span>Xuất dữ liệu</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Unified Reminders Table */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedReminderOrders.length === filteredAndSortedOrders.length && filteredAndSortedOrders.length > 0}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedReminderOrders(filteredAndSortedOrders.map(order => order.id))
                        } else {
                          setSelectedReminderOrders([])
                        }
                      }}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Mã đơn
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Khách hàng
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Tổng tiền
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Trạng thái
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Thời hạn
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Lần nhắc
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAndSortedOrders.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
                      <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <p>Không có đơn hàng cần nhắc thanh toán</p>
                    </td>
                  </tr>
                ) : (
                  filteredAndSortedOrders.map((order) => {
                    const isOverdue = order.reminderStatus === 'overdue'
                    const daysValue = order.deadline 
                      ? Math.abs(Math.ceil((new Date().getTime() - new Date(order.deadline).getTime()) / (1000 * 60 * 60 * 24)))
                      : 0

                    return (
                      <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-4 whitespace-nowrap">
                          <input
                            type="checkbox"
                            checked={selectedReminderOrders.includes(order.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedReminderOrders([...selectedReminderOrders, order.id])
                              } else {
                                setSelectedReminderOrders(selectedReminderOrders.filter(id => id !== order.id))
                              }
                            }}
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-medium text-gray-900">{order.orderNumber}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <button 
                              onClick={() => {
                                setSelectedCustomer(order.customer)
                                setShowCustomerDetail(true)
                              }}
                              className="font-medium text-blue-600 hover:text-blue-800 hover:underline cursor-pointer text-left"
                            >
                              {order.customer.name}
                            </button>
                            <div className="text-sm text-gray-500">{order.customer.phone}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className={`font-medium ${isOverdue ? 'text-red-600' : 'text-yellow-600'}`}>
                            {formatCurrency(order.total)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            isOverdue 
                              ? 'bg-red-100 text-red-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {isOverdue ? 'Quá hạn' : 'Sắp đến hạn'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className={`text-sm ${isOverdue ? 'text-red-600' : 'text-yellow-600'}`}>
                            {isOverdue 
                              ? `${daysValue} ngày` 
                              : calculateTimeRemaining(order.deadline!)
                            }
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            order.remindersSent >= 3 ? 'bg-red-100 text-red-800' :
                            order.remindersSent >= 2 ? 'bg-yellow-100 text-yellow-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {order.remindersSent} lần
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button 
                            onClick={() => setSelectedOrder(order)}
                            className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            Xem chi tiết
                          </button>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    )
  }

  const renderOrders = () => (
    <div className="space-y-4">
      {/* Statistics Cards */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        {/* Tổng quan đơn hàng */}
        <div className="flex items-center gap-2 mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Tổng quan đơn hàng</h3>
          <div className="relative">
            <HelpCircle className="w-4 h-4 text-gray-400 hover:text-blue-500 cursor-help transition-colors" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="flex flex-col justify-center rounded-lg px-6 py-6 min-w-[180px] bg-gradient-to-br from-blue-600 to-blue-400 text-white shadow-lg cursor-pointer relative transition-all hover:shadow-xl">
            <div className="absolute top-2 right-2">
              <Info className="w-3.5 h-3.5 text-white/70 hover:text-white cursor-help transition-colors" />
            </div>
            <div>
              <p className="text-base font-semibold text-white mb-2">Tổng đơn hàng</p>
              <p className="text-4xl font-extrabold text-white">{orders.length}</p>
            </div>
          </div>
        
          <div className="flex flex-col justify-center rounded-lg px-6 py-6 min-w-[180px] bg-gradient-to-br from-green-600 to-green-400 text-white shadow-lg cursor-pointer relative transition-all hover:shadow-xl">
            <div className="absolute top-2 right-2">
              <Info className="w-3.5 h-3.5 text-white/70 hover:text-white cursor-help transition-colors" />
            </div>
            <div>
              <p className="text-base font-semibold text-white mb-2">Tổng doanh thu</p>
              <p className="text-4xl font-extrabold text-white">
                {(orders.reduce((sum, order) => sum + order.totalAmount, 0) / 1000000).toFixed(0)}M
              </p>
            </div>
          </div>
        
          <div className="flex flex-col justify-center rounded-lg px-6 py-6 min-w-[180px] bg-gradient-to-br from-red-600 to-red-400 text-white shadow-lg cursor-pointer relative transition-all hover:shadow-xl">
            <div className="absolute top-2 right-2">
              <Info className="w-3.5 h-3.5 text-white/70 hover:text-white cursor-help transition-colors" />
            </div>
            <div>
              <p className="text-base font-semibold text-white mb-2">Chưa thanh toán</p>
              <p className="text-4xl font-extrabold text-white">
                {orders.filter(o => o.paymentStatus === 'unpaid').length}
              </p>
            </div>
          </div>
        
          <div className="flex flex-col justify-center rounded-lg px-6 py-6 min-w-[180px] bg-gradient-to-br from-purple-600 to-purple-400 text-white shadow-lg cursor-pointer relative transition-all hover:shadow-xl">
            <div className="absolute top-2 right-2">
              <Info className="w-3.5 h-3.5 text-white/70 hover:text-white cursor-help transition-colors" />
            </div>
            <div>
              <p className="text-base font-semibold text-white mb-2">Đã thanh toán</p>
              <p className="text-4xl font-extrabold text-white">
                {orders.filter(o => o.paymentStatus === 'paid').length}
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Header and filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Inline Filters */}
          <div className="flex flex-col lg:flex-row gap-3 lg:items-center flex-1">
            {/* Search Input */}
            <div className="relative flex-1 lg:w-80">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm kiếm đơn hàng theo mã, khách hàng..."
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
            </div>
          
            {/* Filters */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Status Filter */}
              <select 
                value={filters.status}
                onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                className="border border-gray-300 rounded px-3 py-2 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-blue-500">
                <option value="">Tất cả trạng thái</option>
                <option value="draft">Nháp</option>
                <option value="pending">Chờ xác nhận</option>
                <option value="confirmed">Đã xác nhận</option>
                <option value="processing">Đang xử lý</option>
                <option value="completed">Hoàn thành</option>
                <option value="cancelled">Đã hủy</option>
              </select>
            
              {/* Payment Status Filter */}
              <select 
                value={filters.paymentStatus}
                onChange={(e) => setFilters(prev => ({ ...prev, paymentStatus: e.target.value }))}
                className="border border-gray-300 rounded px-3 py-2 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-blue-500">
                <option value="">Tình trạng thanh toán</option>
                <option value="unpaid">Chưa thanh toán</option>
                <option value="partial">Thanh toán một phần</option>
                <option value="paid">Đã thanh toán</option>
                <option value="refunded">Đã hoàn tiền</option>
              </select>
            
              {/* Custom Date Range Picker - hiển thị khi chọn custom */}
              {filters.timeRange === 'custom' && (
                <div className="relative">
                  <div className="flex items-center border border-gray-300 rounded-md bg-white overflow-hidden focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500">
                    <div className="flex items-center px-2 text-gray-400">
                      <Calendar className="w-3.5 h-3.5" />
                    </div>
                    <input 
                      className="flex-1 px-1 py-1.5 text-xs border-0 focus:ring-0 focus:outline-none" 
                      type="date"
                      value={customDateRange.startDate}
                      onChange={(e) => setCustomDateRange(prev => ({ ...prev, startDate: e.target.value }))}
                    />
                    <span className="text-gray-400 text-xs">-</span>
                    <input 
                      className="flex-1 px-1 py-1.5 text-xs border-0 focus:ring-0 focus:outline-none" 
                      type="date"
                      value={customDateRange.endDate}
                      onChange={(e) => setCustomDateRange(prev => ({ ...prev, endDate: e.target.value }))}
                    />
                  </div>
                </div>
              )}

              {/* Time Filter */}
              <select 
                value={filters.timeRange}
                onChange={(e) => setFilters(prev => ({ ...prev, timeRange: e.target.value }))}
                className="border border-gray-300 rounded px-3 py-2 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-blue-500">
                <option value="">Thời gian</option>
                <option value="today">Hôm nay</option>
                <option value="yesterday">Hôm qua</option>
                <option value="thisWeek">Tuần này</option>
                <option value="thisMonth">Tháng này</option>
                <option value="lastMonth">Tháng trước</option>
                <option value="custom">Tùy chọn</option>
              </select>
            
              {/* Clear Filters Button */}
              {(filters.status || filters.paymentStatus || filters.timeRange || filters.search) && (
                <button
                  onClick={() => {
                    setFilters({ status: '', paymentStatus: '', timeRange: '', search: '', tags: [] })
                    setCustomDateRange({ startDate: '', endDate: '' })
                  }}
                  className="px-3 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-1"
                >
                  <X className="w-4 h-4" />
                  <span>Xóa bộ lọc</span>
                </button>
              )}
            </div>
          </div>

          {/* Create Order Button - chuyển về bên phải */}
          <button 
            onClick={() => setShowCreateModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center space-x-2 text-sm whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span>Tạo đơn hàng</span>
          </button>
        </div>
      </div>

      {/* Table Container with white background and border */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        {/* Filter Results Summary */}
        <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
          <span>
            Hiển thị {getFilteredOrders().length} trong tổng {orders.length} đơn hàng
            {(filters.status || filters.paymentStatus || filters.timeRange || filters.search) && (
              <span className="ml-1 text-blue-600">(đã lọc)</span>
            )}
          </span>
          {selectedOrders.length > 0 && (
            <span className="text-blue-600 font-medium">
              Đã chọn {selectedOrders.length} đơn hàng
            </span>
          )}
        </div>

        {/* Bulk Actions Bar */}
        {selectedOrders.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium text-blue-900">
                  Đã chọn {selectedOrders.length} đơn hàng
                </span>
                <button
                  onClick={() => setSelectedOrders([])}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Bỏ chọn tất cả
                </button>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => handleBulkOperation('mark_paid')}
                  disabled={isLoading}
                  className="px-3 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-1"
                >
                  {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                  <span>Đánh dấu đã thanh toán</span>
                </button>
                <button
                  onClick={() => handleBulkOperation('send_reminder')}
                  disabled={isLoading}
                  className="px-3 py-2 bg-yellow-600 text-white text-sm rounded-lg hover:bg-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-1"
                >
                  {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  <span>Gửi nhắc nhở</span>
                </button>
                <div className="relative">
                  <button
                    onClick={() => setShowExportDropdown(!showExportDropdown)}
                    disabled={isLoading}
                    className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    <span>Xuất dữ liệu</span>
                    <ChevronDown className="w-4 h-4" />
                  </button>
                  {showExportDropdown && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                      <button
                        onClick={() => {
                          handleBulkOperation('export_excel')
                          setShowExportDropdown(false)
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center space-x-2 text-sm text-gray-700"
                      >
                        <FileText className="w-4 h-4" />
                        <span>Xuất Excel</span>
                      </button>
                      <button
                        onClick={() => {
                          handleBulkOperation('export')
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
              </div>
            </div>
          </div>
        )}

        {/* Orders Table */}
        <div className="rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedOrders.length === getFilteredOrders().length && getFilteredOrders().length > 0}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedOrders(getFilteredOrders().map(order => order.id))
                      } else {
                        setSelectedOrders([])
                      }
                    }}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                </th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Mã đơn</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Khách hàng</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider hidden md:table-cell">Sản phẩm</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-blue-600 uppercase tracking-wider">Tổng tiền</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider whitespace-nowrap hidden lg:table-cell">Số lần TT</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-green-600 uppercase tracking-wider hidden lg:table-cell">Thực tế</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-red-600 uppercase tracking-wider hidden lg:table-cell">Dư nợ</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Trạng thái</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider hidden lg:table-cell">Thanh toán</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider hidden lg:table-cell">Thời hạn</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider hidden xl:table-cell">Nhãn</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Thao tác</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {getFilteredOrders().map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedOrders.includes(order.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedOrders(prev => [...prev, order.id])
                        } else {
                          setSelectedOrders(prev => prev.filter(id => id !== order.id))
                        }
                      }}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div>
                      <div className="font-medium text-gray-900">{order.orderNumber}</div>
                      <div className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleDateString('vi-VN')}</div>
                    </div>
                  </td>
                  
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div>
                      <button 
                        onClick={() => {
                          setSelectedCustomer(order.customer)
                          setShowCustomerDetail(true)
                        }}
                        className="font-medium text-blue-600 hover:text-blue-800 hover:underline cursor-pointer text-left"
                      >
                        {order.customer.name}
                      </button>
                      <div className="text-sm text-gray-500">{order.customer.phone}</div>
                      {order.isVip && (
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800 mt-1">
                          <Target className="w-3 h-3 mr-1" />
                          VIP
                        </span>
                      )}
                    </div>
                  </td>
                  
                  <td className="px-4 py-4 hidden md:table-cell">
                    <div>
                      <div className="font-medium text-gray-900">{order.items[0]?.product.name}</div>
                      {order.items.length > 1 && (
                        <div className="text-sm text-gray-500">+{order.items.length - 1} sản phẩm khác</div>
                      )}
                    </div>
                  </td>
                  
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="font-medium text-blue-600">{formatCurrency(order.total)}</div>
                  </td>
                  
                  <td className="px-4 py-4 whitespace-nowrap hidden lg:table-cell">
                    <div className="text-sm text-gray-900">{order.installments?.length || 1}</div>
                  </td>
                  
                  <td className="px-4 py-4 whitespace-nowrap hidden lg:table-cell">
                    <div className="text-sm font-medium text-green-600">
                      {formatCurrency(order.totalPaid || 0)}
                    </div>
                  </td>
                  
                  <td className="px-4 py-4 whitespace-nowrap hidden lg:table-cell">
                    <div className="text-sm font-medium text-red-600">
                      {formatCurrency(order.remainingDebt ?? order.total)}
                    </div>
                  </td>
                  
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(order.status)}`}>
                      {getStatusText(order.status)}
                    </span>
                  </td>
                  
                  <td className="px-4 py-4 whitespace-nowrap hidden lg:table-cell">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${getPaymentStatusColor(order.paymentStatus)}`}>
                      {getPaymentStatusText(order.paymentStatus)}
                    </span>
                  </td>
                  
                  <td className="px-4 py-4 whitespace-nowrap hidden lg:table-cell">
                    {order.deadline ? (
                      <div className={`text-sm ${new Date(order.deadline) < new Date() ? 'text-red-600' : 'text-gray-900'}`}>
                        {calculateTimeRemaining(order.deadline)}
                      </div>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  
                  <td className="px-4 py-4 hidden xl:table-cell">
                    <div className="flex flex-wrap gap-1">
                      {order.tags.slice(0, 2).map((tag, index) => (
                        <span key={index} className={`inline-flex px-1.5 py-0.5 text-xs font-medium rounded border ${getTagColor(tag)}`}>
                          {tag}
                        </span>
                      ))}
                      {order.tags.length > 2 && (
                        <span className="text-xs text-gray-400">+{order.tags.length - 2}</span>
                      )}
                    </div>
                  </td>
                  
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="relative">
                      <button 
                        onClick={() => setOpenActionMenu(openActionMenu === order.id ? null : order.id)}
                        className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                        title="Thao tác"
                      >
                        <Settings className="w-4 h-4" />
                      </button>
                      {openActionMenu === order.id && (
                        <div className="absolute right-0 mt-1 w-52 bg-white rounded-lg shadow-lg border border-gray-200 z-[999] py-2">
                          {/* Thông tin Section */}
                          <div className="px-4 pb-1 text-left">
                            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Thông tin</span>
                          </div>
                          <button 
                            onClick={() => {
                              setSelectedOrder(order)
                              setOpenActionMenu(null)
                            }}
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-3"
                          >
                            <Eye className="w-4 h-4 text-gray-500" />
                            <span>Xem chi tiết</span>
                          </button>
                          
                          {/* Thao tác nhanh Section */}
                          <div className="border-t border-gray-100 mt-2 pt-2 px-4 pb-1 text-left">
                            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Thao tác nhanh</span>
                          </div>
                          <button 
                            onClick={() => {
                              handleEditOrder(order)
                              setOpenActionMenu(null)
                            }}
                            disabled={order.status === 'cancelled' || order.status === 'completed'}
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-3 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Edit className="w-4 h-4 text-gray-500" />
                            <span>Thanh toán đơn hàng</span>
                          </button>
                          <button 
                            onClick={() => {
                              handleSendPaymentReminder(order)
                              setOpenActionMenu(null)
                            }}
                            disabled={order.paymentStatus === 'paid' || order.status === 'cancelled'}
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-3 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Bell className="w-4 h-4 text-gray-500" />
                            <span>Nhắc nhở thanh toán</span>
                          </button>
                          
                          {/* Thao tác nguy hiểm Section */}
                          <div className="border-t border-gray-100 mt-2 pt-2 px-4 pb-1 text-left">
                            <span className="text-xs font-semibold text-red-400 uppercase tracking-wider">Thao tác nguy hiểm</span>
                          </div>
                          <button 
                            onClick={() => {
                              handleCancelOrder(order)
                              setOpenActionMenu(null)
                            }}
                            disabled={order.status === 'cancelled' || order.status === 'completed'}
                            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-3 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                            <span>Xóa đơn hàng</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {/* Empty State */}
          {getFilteredOrders().length === 0 && (
            <div className="text-center py-12">
              <ShoppingCart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {(filters.status || filters.paymentStatus || filters.timeRange || filters.search) 
                  ? 'Không tìm thấy đơn hàng phù hợp' 
                  : 'Chưa có đơn hàng nào'
                }
              </h3>
              <p className="text-gray-500 mb-4">
                {(filters.status || filters.paymentStatus || filters.timeRange || filters.search)
                  ? 'Hãy thử điều chỉnh bộ lọc để tìm kiếm đơn hàng khác'
                  : 'Tạo đơn hàng đầu tiên để bắt đầu quản lý'
                }
              </p>
              {(filters.status || filters.paymentStatus || filters.timeRange || filters.search) ? (
                <button
                  onClick={() => setFilters({ status: '', paymentStatus: '', timeRange: '', search: '', tags: [] })}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-600 bg-blue-100 hover:bg-blue-200"
                >
                  <X className="w-4 h-4 mr-2" />
                  Xóa tất cả bộ lọc
                </button>
              ) : (
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Tạo đơn hàng đầu tiên
                </button>
              )}
            </div>
          )}
        </div>
      </div>
      </div>
    </div>
  )

  // Customer Detail Modal
  const renderCustomerDetailModal = () => {
    if (!showCustomerDetail || !selectedCustomer) return null

    // Get customer orders
    const customerOrders = orders.filter(o => o.customer.id === selectedCustomer.id)
    const totalSpent = customerOrders.reduce((sum, o) => sum + o.total, 0)
    const lastOrder = customerOrders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0]

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg w-full max-w-6xl mx-4 h-[90vh] flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-full flex items-center justify-center text-white text-lg font-bold bg-purple-600">
                {selectedCustomer.name.charAt(0)}
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">{selectedCustomer.name}</h2>
                <p className="text-sm text-gray-500">{selectedCustomer.email}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <Edit className="w-4 h-4" />
                <span>Chỉnh sửa</span>
              </button>
              <button 
                onClick={() => setShowCustomerDetail(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200 px-6">
            <nav className="flex space-x-8">
              <button
                onClick={() => setCustomerDetailTab('info')}
                className={`flex items-center space-x-2 py-3 px-1 border-b-2 text-sm font-medium transition-colors ${
                  customerDetailTab === 'info'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <User className="w-4 h-4" />
                <span>Thông tin chi tiết</span>
              </button>
              <button
                onClick={() => setCustomerDetailTab('history')}
                className={`flex items-center space-x-2 py-3 px-1 border-b-2 text-sm font-medium transition-colors ${
                  customerDetailTab === 'history'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <MessageCircle className="w-4 h-4" />
                <span>Lịch sử tương tác</span>
              </button>
              <button
                onClick={() => setCustomerDetailTab('orders')}
                className={`flex items-center space-x-2 py-3 px-1 border-b-2 text-sm font-medium transition-colors ${
                  customerDetailTab === 'orders'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Package className="w-4 h-4" />
                <span>Đơn hàng</span>
              </button>
              <button
                onClick={() => setCustomerDetailTab('notes')}
                className={`flex items-center space-x-2 py-3 px-1 border-b-2 text-sm font-medium transition-colors ${
                  customerDetailTab === 'notes'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>Ghi chú</span>
              </button>
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-auto p-6">
            {customerDetailTab === 'info' && (
              <div className="space-y-6">
                {/* Thông tin cơ bản */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Thông tin cơ bản</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Họ và Tên</label>
                      <p className="text-gray-900">{selectedCustomer.name}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <p className="text-gray-900">{selectedCustomer.email}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Điện thoại</label>
                      <p className="text-gray-900">{selectedCustomer.phone}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Công ty</label>
                      <p className="text-gray-900">{selectedCustomer.company || 'Không có'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Chức vụ</label>
                      <p className="text-gray-900">{selectedCustomer.position || 'Không có'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ</label>
                      <p className="text-gray-900">{selectedCustomer.address || 'Không có'}</p>
                    </div>
                  </div>
                </div>

                {/* Thống kê */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Thống kê</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-blue-600">{customerOrders.length}</p>
                      <p className="text-sm text-gray-600">Tổng đơn hàng</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-green-600">{formatCurrency(totalSpent)}</p>
                      <p className="text-sm text-gray-600">Tổng chi tiêu</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-purple-600">{lastOrder ? formatCurrency(lastOrder.total) : '0 đ'}</p>
                      <p className="text-sm text-gray-600">Đơn gần nhất</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xl font-bold text-orange-600">{lastOrder ? new Date(lastOrder.createdAt).toLocaleDateString('vi-VN') : 'Chưa có'}</p>
                      <p className="text-sm text-gray-600">Mua gần nhất</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {customerDetailTab === 'orders' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Lịch sử đơn hàng ({customerOrders.length})</h3>
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mã đơn</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ngày</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tổng tiền</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Trạng thái</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {customerOrders.map(order => (
                        <tr key={order.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm font-medium text-gray-900">{order.orderNumber}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{new Date(order.createdAt).toLocaleDateString('vi-VN')}</td>
                          <td className="px-4 py-3 text-sm font-medium text-gray-900">{formatCurrency(order.total)}</td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                              order.status === 'completed' ? 'bg-green-100 text-green-800' :
                              order.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                              order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {order.status === 'completed' ? 'Hoàn thành' :
                               order.status === 'confirmed' ? 'Đã xác nhận' :
                               order.status === 'pending' ? 'Chờ xác nhận' :
                               order.status === 'cancelled' ? 'Đã hủy' : 'Nháp'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {customerDetailTab === 'history' && (
              <div className="text-center py-12 text-gray-500">
                <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p>Chưa có lịch sử tương tác</p>
              </div>
            )}

            {customerDetailTab === 'notes' && (
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Ghi chú</h3>
                <p className="text-gray-600 italic">Chưa có ghi chú nào</p>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Quản lý Đơn hàng</h1>
        <p className="text-gray-600">Quản lý đơn hàng, thanh toán và theo dõi lịch sử</p>
      </div>

      {/* Navigation Tabs */}
      <div>
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8">
            {[
              { id: 'orders', name: 'Đơn hàng', icon: <ShoppingCart className="w-4 h-4" /> },
              { id: 'reminders', name: 'Nhắc thanh toán', icon: <Bell className="w-4 h-4" /> }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`group inline-flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
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
          {activeTab === 'orders' && renderOrders()}
          {activeTab === 'reminders' && renderRemindersManagement()}
        </div>
      </div>

      {/* Notifications */}
      {notification && (
        <div className={`fixed top-4 right-4 px-4 py-2 rounded-lg shadow-lg ${
          notification.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
        }`}>
          {notification.message}
        </div>
      )}

      {/* Modals */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] sm:max-h-[85vh] overflow-y-auto mx-4">
            <div className="px-4 sm:px-6 py-4 border-b border-gray-200 relative">
              <button
                onClick={() => {
                  setShowCreateModal(false)
                  setSelectedCustomerForNewOrder(null)
                  setSelectedProducts([])
                  setSelectedPackages({})
                  setProductQuantities({})
                  setOrderNotes('')
                  setSelectedCategory('Tất cả')
                  setPaymentMethod('cash')
                  setPaymentDeadline('')
                  setDiscountPercent(0)
                  setDiscountType('%')
                  setPaymentMode('full')
                  setPaymentInstallments(1)
                  setInstallmentData([{amount: 0, date: ''}])
                }}
                className="absolute top-4 right-4 p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                title="Đóng"
              >
                <X className="h-5 w-5" />
              </button>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 pr-8">Tạo đơn hàng mới</h3>
            </div>
            
            <div className="px-4 sm:px-6 py-4">
              {/* Customer Selection */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Khách hàng <span className="text-red-500">*</span></label>
                <select
                  value={selectedCustomerForNewOrder?.id || ''}
                  onChange={(e) => {
                    const customerId = parseInt(e.target.value)
                    const customer = customers.find(c => c.id === customerId)
                    setSelectedCustomerForNewOrder(customer || null)
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Chọn khách hàng</option>
                  {customers.map(customer => (
                    <option key={customer.id} value={customer.id}>
                      {customer.name} - {customer.phone} ({customer.type === 'lead' ? 'Lead' : 'Khách hàng'})
                    </option>
                  ))}
                </select>
              </div>

              {/* Customer Info */}
              {selectedCustomerForNewOrder && (
                <div className="flex items-center gap-3 mb-4">
                  <span className="relative flex shrink-0 overflow-hidden rounded-full h-12 w-12 bg-blue-100">
                    <span className="flex h-full w-full items-center justify-center rounded-full bg-blue-100 text-blue-700 font-semibold">
                      <User className="h-6 w-6" />
                    </span>
                  </span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-slate-900">{selectedCustomerForNewOrder.name}</h3>
                    </div>
                    <p className="text-sm text-slate-600">
                      {selectedCustomerForNewOrder.email && <span>{selectedCustomerForNewOrder.email}</span>}
                    </p>
                  </div>
                </div>
              )}

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
                  {productCategories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              {/* Product Selection */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Chọn sản phẩm và gói sản phẩm <span className="text-red-500">*</span>
                </label>
                <div className="max-h-72 overflow-y-auto border border-gray-300 rounded-lg p-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {availableProducts
                      .filter(product => selectedCategory === 'Tất cả' || product.category === selectedCategory)
                      .map((product) => (
                      <div key={product.id} className="border border-gray-200 rounded-lg p-3 bg-white hover:border-blue-300 transition-colors">
                        <label className="flex items-start space-x-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={selectedProducts.includes(product.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedProducts(prev => [...prev, product.id])
                                setSelectedPackages(prev => ({
                                  ...prev,
                                  [product.id]: availablePackages[product.id]?.[0]?.id || ''
                                }))
                                setProductQuantities(prev => ({
                                  ...prev,
                                  [product.id]: 1
                                }))
                              } else {
                                setSelectedProducts(prev => prev.filter(id => id !== product.id))
                                setSelectedPackages(prev => {
                                  const newPackages = {...prev}
                                  delete newPackages[product.id]
                                  return newPackages
                                })
                                setProductQuantities(prev => {
                                  const newQuantities = {...prev}
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
                        {selectedProducts.includes(product.id) && availablePackages[product.id] && (
                          <div className="ml-7 mt-2 p-2 bg-gray-50 rounded">
                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">Chọn gói:</label>
                                <select
                                  value={selectedPackages[product.id] || ''}
                                  onChange={(e) => {
                                    setSelectedPackages(prev => ({
                                      ...prev,
                                      [product.id]: e.target.value
                                    }))
                                  }}
                                  className="w-full text-xs border border-gray-300 rounded px-2 py-1"
                                >
                                  {availablePackages[product.id]?.map((pkg) => (
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
                                  onChange={(e) => {
                                    setProductQuantities(prev => ({
                                      ...prev,
                                      [product.id]: Math.max(1, parseInt(e.target.value) || 1)
                                    }))
                                  }}
                                  className="w-full text-xs border border-gray-300 rounded px-2 py-1"
                                />
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              {selectedProducts.length > 0 && (() => {
                const subtotal = selectedProducts.reduce((sum, productId) => {
                  const product = availableProducts.find(p => p.id === productId)
                  const selectedPackageId = selectedPackages[productId]
                  const selectedPackage = availablePackages[productId]?.find(pkg => pkg.id === selectedPackageId)
                  const quantity = productQuantities[productId] || 1
                  return sum + ((product?.price || 0) + (selectedPackage?.price || 0)) * quantity
                }, 0)
                const discountAmount = discountType === '%' 
                  ? subtotal * discountPercent / 100 
                  : discountPercent
                const afterDiscount = subtotal - discountAmount
                const vatAmount = afterDiscount * 0.1
                const grandTotal = afterDiscount + vatAmount
                
                return (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                    <h5 className="text-sm font-medium text-green-800 mb-3">
                      Đã chọn {selectedProducts.length} sản phẩm:
                    </h5>
                    <div className="space-y-2 text-sm">
                      {selectedProducts.map(productId => {
                        const product = availableProducts.find(p => p.id === productId)
                        const selectedPackageId = selectedPackages[productId]
                        const selectedPackage = availablePackages[productId]?.find(pkg => pkg.id === selectedPackageId)
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
              {selectedProducts.length > 0 && (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
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
                    </div>

                    {/* Discount */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Giảm giá</label>
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
                            name="newOrderPaymentMode"
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
                            name="newOrderPaymentMode"
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
              )}

              <p className="text-sm text-gray-600 mt-4">
                Khách hàng sẽ được tạo đơn hàng với các sản phẩm đã chọn. Sau khi xác nhận thanh toán thành công, sẽ tự động chuyển sang "Hoàn thành".
              </p>
            </div>

            <div className="px-4 sm:px-6 py-4 border-t border-gray-200 flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3">
              <button
                onClick={() => {
                  setShowCreateModal(false)
                  setSelectedCustomerForNewOrder(null)
                  setSelectedProducts([])
                  setSelectedPackages({})
                  setProductQuantities({})
                  setOrderNotes('')
                  setSelectedCategory('Tất cả')
                  setPaymentMethod('cash')
                  setPaymentDeadline('')
                  setDiscountPercent(0)
                  setDiscountType('%')
                  setPaymentMode('full')
                }}
                className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100 border border-slate-300 rounded-lg hover:bg-slate-200 hover:text-slate-700 transition-all duration-200 shadow-sm hover:shadow-md"
              >
                Hủy
              </button>
              <button
                onClick={() => {
                  if (!selectedCustomerForNewOrder || selectedProducts.length === 0 || !paymentDeadline) {
                    setNotification({ message: 'Vui lòng điền đầy đủ thông tin bắt buộc', type: 'error' })
                    setTimeout(() => setNotification(null), 3000)
                    return
                  }
                  
                  // Build order data
                  const subtotal = selectedProducts.reduce((sum, productId) => {
                    const product = availableProducts.find(p => p.id === productId)
                    const selectedPackageId = selectedPackages[productId]
                    const selectedPackage = availablePackages[productId]?.find(pkg => pkg.id === selectedPackageId)
                    const quantity = productQuantities[productId] || 1
                    return sum + ((product?.price || 0) + (selectedPackage?.price || 0)) * quantity
                  }, 0)
                  const discountAmount = discountType === '%' ? subtotal * discountPercent / 100 : discountPercent
                  const afterDiscount = subtotal - discountAmount
                  const vatAmount = afterDiscount * 0.1
                  const grandTotal = afterDiscount + vatAmount
                  
                  const orderData = {
                    orderNumber: `DH${new Date().toISOString().replace(/[-:T]/g, '').slice(0, 14)}${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
                    customerId: selectedCustomerForNewOrder.id,
                    items: selectedProducts.map(productId => {
                      const product = availableProducts.find(p => p.id === productId)
                      const selectedPackageId = selectedPackages[productId]
                      const selectedPackage = availablePackages[productId]?.find(pkg => pkg.id === selectedPackageId)
                      const quantity = productQuantities[productId] || 1
                      return {
                        id: Date.now() + Math.random(),
                        productId,
                        product: product,
                        variantId: selectedPackageId,
                        variant: selectedPackage,
                        quantity,
                        unitPrice: (product?.price || 0) + (selectedPackage?.price || 0),
                        totalPrice: ((product?.price || 0) + (selectedPackage?.price || 0)) * quantity,
                        notes: orderNotes
                      }
                    }),
                    subtotal,
                    discount: discountAmount,
                    tax: vatAmount,
                    total: grandTotal,
                    totalAmount: grandTotal,
                    status: 'pending',
                    paymentStatus: 'unpaid',
                    paymentMethod,
                    paymentMode,
                    notes: orderNotes ? [{ id: Date.now(), content: orderNotes, type: 'customer_request', createdAt: new Date().toISOString(), createdBy: 'Nguyễn Sales Manager', isEditable: true }] : [],
                    invoices: [],
                    tags: [],
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                    zaloMessages: [],
                    deadline: paymentDeadline,
                    isVip: false
                  }
                  
                  handleCreateOrder(orderData)
                  
                  // Reset form
                  setShowCreateModal(false)
                  setSelectedCustomerForNewOrder(null)
                  setSelectedProducts([])
                  setSelectedPackages({})
                  setProductQuantities({})
                  setOrderNotes('')
                  setSelectedCategory('Tất cả')
                  setPaymentMethod('cash')
                  setPaymentDeadline('')
                  setDiscountPercent(0)
                  setDiscountType('%')
                  setPaymentMode('full')
                }}
                disabled={!selectedCustomerForNewOrder || selectedProducts.length === 0 || !paymentDeadline}
                className={`w-full sm:w-auto px-4 py-2 text-sm font-medium border border-transparent rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-[1.02] flex items-center justify-center gap-2 ${
                  selectedCustomerForNewOrder && selectedProducts.length > 0 && paymentDeadline
                    ? 'text-white bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700'
                    : 'text-gray-400 bg-gray-300 cursor-not-allowed'
                }`}
              >
                <CheckCircle className="w-4 h-4" />
                <span className="truncate">{selectedCustomerForNewOrder && selectedProducts.length > 0 && paymentDeadline ? 'Tạo đơn hàng' : 'Chọn sản phẩm để tiếp tục'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedOrder && (
        <OrderDetailModal
          isOpen={true}
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onUpdate={(orderId, updates) => {
            setOrders(prev => prev.map(o => o.id === orderId ? { ...o, ...updates } : o))
            setSelectedOrder(null)
          }}
        />
      )}

      {/* Edit Order Modal */}
      {showEditModal && editingOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`bg-white rounded-lg shadow-xl ${editingOrder.paymentStatus === 'partial' || editingOrder.paymentMode === 'installment' ? 'max-w-5xl' : 'max-w-md'} w-full mx-4 max-h-[90vh] overflow-y-auto`}>
            <div className="flex items-center justify-between p-6 border-b">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Thanh toán đơn hàng</h3>
                <p className="text-sm text-gray-600 mt-1">Đơn hàng: {editingOrder.orderNumber}</p>
              </div>
              <button
                onClick={() => {
                  setShowEditModal(false)
                  setEditingOrder(null)
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6">
              {/* Payment Status - Full Width */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Trạng thái thanh toán <span className="text-red-500">*</span>
                </label>
                <select
                  value={editingOrder.paymentStatus}
                  onChange={(e) => {
                    const newPaymentStatus = e.target.value as Order['paymentStatus']
                    setEditingOrder(prev => {
                      if (!prev) return null
                      // Auto-fill paid amount when changing to "paid"
                      if (newPaymentStatus === 'paid') {
                        const today = new Date().toISOString().split('T')[0]
                        const updatedInstallments = prev.installments?.map(inst => ({
                          ...inst,
                          status: 'completed' as const,
                          actualAmount: inst.actualAmount || inst.plannedAmount,
                          actualDate: inst.actualDate || today
                        })) || []
                        return {
                          ...prev,
                          paymentStatus: newPaymentStatus,
                          totalPaid: prev.total,
                          remainingDebt: 0,
                          installments: updatedInstallments
                        }
                      }
                      return {...prev, paymentStatus: newPaymentStatus}
                    })
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="unpaid">Chưa thanh toán</option>
                  <option value="partial">Thanh toán một phần</option>
                  <option value="paid">Đã thanh toán</option>
                  <option value="refunded">Đã hoàn tiền</option>
                </select>
              </div>

              {/* Installment Payment UI - Show when partial payment selected */}
              {(editingOrder.paymentStatus === 'partial' || editingOrder.paymentMode === 'installment') && editingOrder.installments && editingOrder.installments.length > 0 && (
                <div className="mt-6 border-t pt-6">
                  <h4 className="text-sm font-semibold text-gray-900 mb-4">Chi tiết thanh toán theo giai đoạn</h4>
                  
                  <div className="flex gap-6">
                    {/* Installments List */}
                    <div className="flex-1">
                      <div className="space-y-3">
                        {editingOrder.installments.map((installment, index) => {
                          const isCompleted = installment.status === 'completed'
                          const isOverPaid = installment.actualAmount > installment.plannedAmount
                          const isLastInstallment = index === (editingOrder.installments?.length || 1) - 1
                          
                          // Check if all previous installments are completed (for sequential payment)
                          const previousInstallments = editingOrder.installments?.slice(0, index) || []
                          const allPreviousCompleted = previousInstallments.every(inst => inst.status === 'completed')
                          
                          // Calculate previous installments deficit
                          const previousDeficit = previousInstallments.reduce((sum, inst) => {
                            return sum + Math.max(0, inst.plannedAmount - inst.actualAmount)
                          }, 0)
                          
                          // For last installment, minimum required = planned + all previous deficits
                          const minRequiredForLast = isLastInstallment ? installment.plannedAmount + previousDeficit : 0
                          const isLastInstallmentShort = isLastInstallment && installment.actualAmount > 0 && installment.actualAmount < minRequiredForLast && !isCompleted
                          
                          // Current remaining debt for validation
                          const currentRemainingDebt = editingOrder.remainingDebt ?? (editingOrder.total - (editingOrder.totalPaid || 0))
                          
                          // For last installment: the actual debt to pay = remaining debt + this installment's current value
                          // (because remainingDebt already subtracted this installment's actualAmount)
                          const actualDebtForThisInstallment = isLastInstallment 
                            ? currentRemainingDebt + installment.actualAmount 
                            : currentRemainingDebt
                          
                          return (
                            <div 
                              key={installment.id} 
                              className={`p-4 rounded-lg border ${isCompleted ? 'bg-gray-50 border-gray-200 opacity-70' : 'bg-white border-gray-200'}`}
                            >
                              {/* Header with Phase Label and Submit Button */}
                              <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-medium text-gray-700">Đợt {index + 1}</span>
                                  {isCompleted && (
                                    <span className="px-2 py-0.5 text-xs bg-green-100 text-green-700 rounded-full">Đã thanh toán</span>
                                  )}
                                </div>
                                
                                {/* Submit Payment Button - Top Right */}
                                {!isCompleted && (() => {
                                  // For last installment, check if actual amount equals the debt to pay
                                  const isLastInstallmentAmountValid = isLastInstallment && installment.actualAmount === actualDebtForThisInstallment
                                  
                                  // Can only submit if: has amount, previous completed, and valid amount
                                  const canSubmitPayment = installment.actualAmount > 0 && 
                                    allPreviousCompleted && 
                                    (!isLastInstallment || isLastInstallmentAmountValid) &&
                                    (isLastInstallment || installment.actualAmount <= installment.plannedAmount)
                                  
                                  return (
                                    <div className="flex flex-col items-end">
                                      <button
                                        type="button"
                                        onClick={() => {
                                          if (installment.actualAmount <= 0) {
                                            setNotification({ message: 'Vui lòng nhập số tiền thanh toán', type: 'error' })
                                            return
                                          }
                                          // For last installment, must pay exactly remaining debt
                                          if (isLastInstallment && installment.actualAmount !== actualDebtForThisInstallment) {
                                            setNotification({ message: `Đây là giai đoạn thanh toán cuối, bạn phải thanh toán đúng ${actualDebtForThisInstallment.toLocaleString('vi-VN')} VNĐ`, type: 'error' })
                                            return
                                          }
                                          if (!isLastInstallment && installment.actualAmount > installment.plannedAmount) {
                                            setNotification({ message: 'Số tiền không được vượt quá số tiền dự kiến', type: 'error' })
                                            return
                                          }
                                          // Mark as completed
                                          const newInstallments = [...(editingOrder.installments || [])]
                                          newInstallments[index] = {
                                            ...newInstallments[index],
                                            status: 'completed',
                                            actualDate: installment.actualDate || new Date().toISOString().split('T')[0]
                                          }
                                          // Calculate totals
                                          const totalPaid = newInstallments.reduce((sum, inst) => sum + inst.actualAmount, 0)
                                          const remainingDebt = editingOrder.total - totalPaid
                                          // Check if fully paid
                                          const allCompleted = newInstallments.every(inst => inst.status === 'completed')
                                          const newPaymentStatus = allCompleted ? 'paid' : 'partial'
                                          const newStatus = allCompleted ? 'completed' : editingOrder.status
                                          
                                          setEditingOrder(prev => prev ? {
                                            ...prev, 
                                            installments: newInstallments,
                                            totalPaid,
                                            remainingDebt,
                                            paymentStatus: newPaymentStatus,
                                            status: newStatus
                                          } : null)
                                          
                                          setNotification({ 
                                            message: allCompleted 
                                              ? 'Đã thanh toán hoàn tất! Đơn hàng chuyển sang trạng thái Hoàn thành.' 
                                              : `Đã ghi nhận thanh toán đợt ${index + 1}`, 
                                            type: 'success' 
                                          })
                                        }}
                                        disabled={!canSubmitPayment}
                                        className={`px-3 py-1.5 rounded-md transition-colors text-sm ${
                                          !canSubmitPayment
                                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                            : 'bg-green-600 text-white hover:bg-green-700'
                                        }`}
                                        title={!allPreviousCompleted 
                                          ? 'Vui lòng hoàn thành thanh toán các đợt trước' 
                                          : isLastInstallment && !isLastInstallmentAmountValid 
                                            ? `Thanh toán đúng ${actualDebtForThisInstallment.toLocaleString('vi-VN')} VNĐ` 
                                            : 'Nộp tiền'}
                                      >
                                        Nộp tiền
                                      </button>
                                      {!allPreviousCompleted && (
                                        <p className="text-xs text-orange-500 mt-1">Hoàn thành đợt trước</p>
                                      )}
                                    </div>
                                  )
                                })()}
                              </div>
                              
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 items-end">
                                {/* Planned Amount */}
                                <div>
                                  <label className="block text-xs text-gray-500 mb-1">Số tiền thanh toán</label>
                                  <input
                                    type="text"
                                    value={installment.plannedAmount.toLocaleString('vi-VN')}
                                    disabled
                                    className="w-full px-3 py-2 bg-gray-100 border border-gray-200 rounded-md text-sm text-gray-700"
                                  />
                                </div>
                                
                                {/* Planned Date */}
                                <div>
                                  <label className="block text-xs text-gray-500 mb-1">Ngày thanh toán đợt {index + 1}</label>
                                  <input
                                    type="text"
                                    value={installment.plannedDate ? new Date(installment.plannedDate).toLocaleDateString('vi-VN') : 'Thời gian thanh toán ...'}
                                    disabled
                                    className="w-full px-3 py-2 bg-gray-100 border border-gray-200 rounded-md text-sm text-gray-500"
                                  />
                                </div>
                                
                                {/* Actual Amount */}
                                <div>
                                  <label className="block text-xs text-gray-500 mb-1">Số tiền thanh toán thực tế</label>
                                  <input
                                    type="text"
                                    value={installment.actualAmount.toLocaleString('vi-VN')}
                                    onKeyDown={(e) => {
                                      if (e.key === 'Enter') {
                                        e.preventDefault()
                                      }
                                    }}
                                    onChange={(e) => {
                                      if (isCompleted || !allPreviousCompleted) return
                                      let value = parseInt(e.target.value.replace(/\D/g, '')) || 0
                                      
                                      // For last installment: allow entering up to the actual debt for this installment
                                      // For other installments: limit to remaining debt and planned amount
                                      if (isLastInstallment) {
                                        value = Math.min(value, actualDebtForThisInstallment)
                                      } else {
                                        value = Math.min(value, currentRemainingDebt, installment.plannedAmount)
                                      }
                                      
                                      const newInstallments = [...(editingOrder.installments || [])]
                                      newInstallments[index] = {
                                        ...newInstallments[index],
                                        actualAmount: value
                                        // Status NOT changed here - only changed when clicking "Nộp tiền" button
                                      }
                                      // Calculate totals for display only
                                      const totalPaid = newInstallments.reduce((sum, inst) => sum + inst.actualAmount, 0)
                                      const remainingDebt = editingOrder.total - totalPaid
                                      
                                      setEditingOrder(prev => prev ? {
                                        ...prev, 
                                        installments: newInstallments,
                                        totalPaid,
                                        remainingDebt
                                      } : null)
                                    }}
                                    disabled={isCompleted || !allPreviousCompleted}
                                    placeholder="0"
                                    className={`w-full px-3 py-2 border rounded-md text-sm focus:ring-2 focus:ring-blue-500 ${
                                      isCompleted || !allPreviousCompleted ? 'bg-gray-100 border-gray-200 text-gray-500' : 
                                      isOverPaid ? 'border-red-500 bg-red-50 text-red-700' : 
                                      isLastInstallmentShort ? 'border-red-500 bg-red-50 text-red-700' : 'border-gray-300'
                                    }`}
                                  />
                                  {!allPreviousCompleted && !isCompleted && (
                                    <p className="mt-1 text-xs text-orange-500">Hoàn thành đợt trước</p>
                                  )}
                                  {allPreviousCompleted && isOverPaid && !isCompleted && (
                                    <p className="mt-1 text-xs text-red-500">Số tiền vượt quá số tiền dự kiến</p>
                                  )}
                                  {allPreviousCompleted && isLastInstallment && installment.actualAmount > 0 && installment.actualAmount !== actualDebtForThisInstallment && (
                                    <p className="mt-1 text-xs text-red-500">Thanh toán đúng {actualDebtForThisInstallment.toLocaleString('vi-VN')} VNĐ</p>
                                  )}
                                </div>
                                
                                {/* Actual Date */}
                                <div>
                                  <label className="block text-xs text-gray-500 mb-1">Ngày thanh toán thực tế đợt {index + 1}</label>
                                  <input
                                    type="date"
                                    value={installment.actualDate || ''}
                                    onKeyDown={(e) => {
                                      if (e.key === 'Enter') {
                                        e.preventDefault()
                                      }
                                    }}
                                    onChange={(e) => {
                                      if (isCompleted || !allPreviousCompleted) return
                                      const newInstallments = [...(editingOrder.installments || [])]
                                      newInstallments[index] = {...newInstallments[index], actualDate: e.target.value}
                                      setEditingOrder(prev => prev ? {...prev, installments: newInstallments} : null)
                                    }}
                                    disabled={isCompleted || !allPreviousCompleted}
                                    className={`w-full px-3 py-2 border rounded-md text-sm focus:ring-2 focus:ring-blue-500 ${
                                      isCompleted || !allPreviousCompleted ? 'bg-gray-100 border-gray-200 text-gray-500' : 'border-gray-300'
                                    }`}
                                  />
                                </div>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                    
                    {/* Statistics Container */}
                    <div className="w-64 shrink-0">
                      <div className="bg-gray-50 rounded-lg p-4 space-y-4 sticky top-0">
                        {/* Total Planned */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Tổng số Tiền thanh toán</label>
                          <div className={`px-3 py-2 border rounded-md text-sm font-medium ${
                            (editingOrder.totalPaid || 0) !== editingOrder.total ? 'border-red-500 bg-red-50 text-red-700' : 'border-gray-300 bg-white'
                          }`}>
                            {editingOrder.total.toLocaleString('vi-VN')}
                          </div>
                          {(editingOrder.totalPaid || 0) !== editingOrder.total && (
                            <p className="mt-1 text-xs text-red-500"></p>
                          )}
                        </div>
                        
                        {/* Total Actual Paid */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Tổng tiền thực tế thanh toán</label>
                          <div className="px-3 py-2 bg-green-50 border border-green-300 rounded-md text-sm font-medium text-green-700">
                            {(editingOrder.totalPaid || 0).toLocaleString('vi-VN')}
                          </div>
                        </div>
                        
                        {/* Remaining Debt */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Dư nợ</label>
                          <div className={`px-3 py-2 border rounded-md text-sm font-medium ${
                            (editingOrder.remainingDebt || 0) > 0 ? 'bg-orange-50 border-orange-300 text-orange-700' : 'bg-green-50 border-green-300 text-green-700'
                          }`}>
                            {(editingOrder.remainingDebt ?? editingOrder.total).toLocaleString('vi-VN')}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Hint for non-installment */}
              {editingOrder.paymentStatus === 'partial' && (!editingOrder.installments || editingOrder.installments.length === 0) && editingOrder.paymentMode !== 'installment' && (
                <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-700">
                    Đơn hàng này chưa có thông tin thanh toán theo giai đoạn. 
                    Vui lòng chọn trạng thái thanh toán khác.
                  </p>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center justify-between mt-6 pt-4 border-t">
                <p className="text-xs text-gray-500"></p>
                <div className="flex space-x-3">
                  <button
                    onClick={() => {
                      setShowEditModal(false)
                      setEditingOrder(null)
                    }}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                  >
                    Hủy
                  </button>
                  <button
                    onClick={() => handleSaveEditOrder(editingOrder)}
                    disabled={editingOrder.paymentStatus === 'partial' && (!editingOrder.installments || editingOrder.installments.length === 0) && editingOrder.paymentMode !== 'installment'}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                  >
                    Lưu thay đổi
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Order Modal */}
      {showCancelModal && cancelingOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="flex items-center justify-between p-6 border-b">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Hủy đơn hàng</h3>
                <p className="text-sm text-gray-600 mt-1">Đơn hàng: {cancelingOrder.orderNumber}</p>
              </div>
              <button
                onClick={() => {
                  setShowCancelModal(false)
                  setCancelingOrder(null)
                  setCancelReason('')
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6">
              <div className="mb-4">
                <div className="flex items-center space-x-2 text-orange-600 mb-3">
                  <AlertTriangle className="w-5 h-5" />
                  <span className="font-medium">Cảnh báo</span>
                </div>
                <p className="text-gray-600 text-sm mb-4">
                  Bạn có chắc chắn muốn hủy đơn hàng <strong>{cancelingOrder.orderNumber}</strong>? 
                  Hành động này không thể hoàn tác.
                </p>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Lý do hủy đơn hàng <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  placeholder="Nhập lý do hủy đơn hàng..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                />
              </div>

              {/* Actions */}
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowCancelModal(false)
                    setCancelingOrder(null)
                    setCancelReason('')
                  }}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                >
                  Không hủy
                </button>
                <button
                  onClick={handleConfirmCancelOrder}
                  disabled={!cancelReason.trim()}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Xác nhận hủy
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Send Reminder Confirmation Dialog */}
      {showSendReminderDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-start space-x-3 mb-4">
                <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Send className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Xác nhận gửi nhắc thanh toán
                  </h3>
                  <div className="text-sm text-gray-600 space-y-3">
                    <p>Khi gửi nhắc thanh toán, hệ thống sẽ tự động gửi thông báo đến cả hai bên:</p>
                    <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                      <div className="flex items-start space-x-2">
                        <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-1.5 flex-shrink-0"></div>
                        <div>
                          <p className="font-medium text-gray-900">Khách hàng:</p>
                          <p className="text-gray-600">Nhận email/SMS nhắc thanh toán với chi tiết đơn hàng và hướng dẫn thanh toán</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-2">
                        <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-1.5 flex-shrink-0"></div>
                        <div>
                          <p className="font-medium text-gray-900">Người phụ trách:</p>
                          <p className="text-gray-600">Nhận thông báo để theo dõi và liên hệ khách hàng nếu cần</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 px-6 py-4 flex items-center justify-end space-x-3 rounded-b-lg">
              <button
                onClick={() => setShowSendReminderDialog(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={() => {
                  handleBulkOperation('send_reminder')
                  setShowSendReminderDialog(false)
                }}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <Send className="w-4 h-4" />
                <span>Gửi</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Customer Detail Modal */}
      {renderCustomerDetailModal()}
    </div>
  )
}