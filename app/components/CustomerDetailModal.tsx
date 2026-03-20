'use client'

import { useState } from 'react'
import {
  X,
  Phone,
  Mail,
  User,
  Package,
  FileText,
  CheckSquare,
  History,
  Edit,
  Trash2,
  Plus,
  Calendar,
  Filter,
  ChevronDown,
  Info,
  Play,
  AlertTriangle,
  Building,
  Bell,
  Circle,
  MoreVertical,
  RefreshCw,
  Receipt,
  PenSquare,
  Eye,
  MessageSquarePlus,
  Settings,
  CreditCard,
  BellRing
} from 'lucide-react'

// ==================== INTERFACES ====================

interface CustomerTag {
  id: string
  name: string
  color: string
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

interface OrderItem {
  id: number
  productName: string
  productPackage: string
  quantity: number
  price: number
  total: number
  paymentStatus: 'paid' | 'unpaid' | 'partial'
}

interface OrderInvoice {
  id: string
  fileName: string
  fileSize: number
  fileType: string
  uploadedAt: string
  thumbnailUrl?: string
}

interface CustomerOrder {
  id: number
  orderNumber: string
  customerName?: string
  products: string
  total: number
  paymentCount?: number
  paid: number
  debt: number
  paymentMethod: string
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
  createdAt: string
  dueDate?: string
  label?: string
  items?: OrderItem[]
  discount?: number
  vat?: number
  subtotal?: number
  invoices?: OrderInvoice[]
}

interface CustomerTask {
  id: string
  title: string
  description?: string
  assignee: string
  assigneeRole?: string
  priority: 'low' | 'medium' | 'high'
  status: 'pending' | 'in-progress' | 'completed'
  completedAt?: string
  dueDate?: string
  tags: string[]
  createdAt: string
  relatedCustomer?: string
  relatedCustomerType?: string
  relatedPhone?: string
  internalNote?: string
}

interface CustomerHistoryItem {
  id: string
  type: 'order' | 'customer' | 'task' | 'system'
  action: string
  description: string
  timestamp: string
  performedBy?: string
}

interface Customer {
  id: number
  name: string
  contact: string
  email: string
  phone2?: string
  company?: string
  position?: string
  address?: string
  city?: string
  status: string
  customerType?: string
  dateOfBirth?: string
  source?: string
  assignedPerson?: string
  interestedProduct?: string
  leadValue?: number
  successRate?: number
  createdAt?: string
  updatedAt?: string
  lastContactAt?: string
  totalOrders: number
  totalSpent: number
  lastOrderDate?: string
  lastInteraction?: string
  lastPurchaseDate?: string
  tags?: CustomerTag[]
  notes?: CustomerNote[]
  orders?: CustomerOrder[]
  tasks?: CustomerTask[]
  history?: CustomerHistoryItem[]
}

interface CustomerDetailModalProps {
  isOpen: boolean
  onClose: () => void
  customer: Customer | null
  onUpdate?: (customerId: number, updates: Partial<Customer>) => void
  onOpenOrderDetail?: (order: CustomerOrder) => void
}

// ==================== SUB COMPONENTS ====================

// Edit Note Dialog
interface EditNoteDialogProps {
  isOpen: boolean
  onClose: () => void
  note: CustomerNote | null
  customerName: string
  onSave: (noteId: string, content: string) => void
}

function EditNoteDialog({ isOpen, onClose, note, customerName, onSave }: EditNoteDialogProps) {
  const [content, setContent] = useState(note?.content || '')

  if (!isOpen || !note) return null

  const handleSave = () => {
    if (content.trim()) {
      onSave(note.id, content)
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]">
      <div className="bg-white rounded-lg w-full max-w-md mx-4 shadow-xl">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Chỉnh sửa ghi chú</h3>
            <p className="text-sm text-gray-500">Lead: {customerName}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nội dung ghi chú <span className="text-red-500">*</span>
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
            placeholder="Nhập nội dung ghi chú..."
          />
        </div>
        <div className="flex items-center justify-end gap-3 p-4 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Hủy
          </button>
          <button
            onClick={handleSave}
            disabled={!content.trim()}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Lưu thay đổi
          </button>
        </div>
      </div>
    </div>
  )
}

// Delete Note Confirmation Dialog
interface DeleteNoteDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
}

function DeleteNoteDialog({ isOpen, onClose, onConfirm }: DeleteNoteDialogProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]">
      <div className="bg-white rounded-lg w-full max-w-sm mx-4 shadow-xl">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Xác nhận xóa</h3>
          <p className="text-sm text-gray-600">
            Bạn có chắc chắn muốn xóa ghi chú này? Hành động này không thể hoàn tác.
          </p>
        </div>
        <div className="flex items-center justify-end gap-3 p-4 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Hủy
          </button>
          <button
            onClick={() => {
              onConfirm()
              onClose()
            }}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700"
          >
            Xóa
          </button>
        </div>
      </div>
    </div>
  )
}

// Add Note Dialog
interface AddNoteDialogProps {
  isOpen: boolean
  onClose: () => void
  customerName: string
  onSave: (content: string, files: File[]) => void
}

function AddNoteDialog({ isOpen, onClose, customerName, onSave }: AddNoteDialogProps) {
  const [content, setContent] = useState('')
  const [files, setFiles] = useState<File[]>([])

  if (!isOpen) return null

  const handleSave = () => {
    if (content.trim()) {
      onSave(content, files)
      setContent('')
      setFiles([])
      onClose()
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(prev => [...prev, ...Array.from(e.target.files || [])])
    }
  }

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index))
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]">
      <div className="bg-white rounded-lg w-full max-w-md mx-4 shadow-xl">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Thêm ghi chú</h3>
            <p className="text-sm text-gray-500">Lead: {customerName}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nội dung ghi chú <span className="text-red-500">*</span>
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              placeholder="Nhập nội dung ghi chú..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              File đính kèm
            </label>
            <input
              type="file"
              multiple
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            {files.length > 0 && (
              <div className="mt-2 space-y-1">
                {files.map((file, index) => (
                  <div key={index} className="flex items-center justify-between text-sm bg-gray-50 px-2 py-1 rounded">
                    <span className="truncate">{file.name}</span>
                    <button onClick={() => removeFile(index)} className="text-red-500 hover:text-red-700">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center justify-end gap-3 p-4 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Hủy
          </button>
          <button
            onClick={handleSave}
            disabled={!content.trim()}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Lưu ghi chú
          </button>
        </div>
      </div>
    </div>
  )
}

// Customer Info Detail Dialog (Pasted Image 3)
interface CustomerInfoDetailDialogProps {
  isOpen: boolean
  onClose: () => void
  customer: Customer | null
}

function CustomerInfoDetailDialog({ isOpen, onClose, customer }: CustomerInfoDetailDialogProps) {
  if (!isOpen || !customer) return null

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '-'
    return new Date(dateStr).toLocaleDateString('vi-VN')
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]">
      <div className="bg-white rounded-xl w-full max-w-2xl mx-4 shadow-xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 sticky top-0 bg-white">
          <h3 className="text-lg font-semibold text-gray-900">Thông tin chi tiết khách hàng</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Row 1: Basic Info & Sales Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Thông tin cơ bản */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-gray-700 mb-3">
                <User className="w-4 h-4 text-blue-500" />
                <span className="font-semibold">Thông tin cơ bản</span>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Tên khách hàng:</span>
                  <span className="font-medium text-gray-900">{customer.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Ngày sinh:</span>
                  <span className="font-medium text-gray-900">{formatDate(customer.dateOfBirth)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Công ty:</span>
                  <span className="font-medium text-gray-900">{customer.company || '-'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Loại khách hàng:</span>
                  <span className="font-medium text-gray-900">{customer.customerType || 'Cá nhân'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Địa chỉ:</span>
                  <span className="font-medium text-gray-900">{customer.address || '-'}</span>
                </div>
              </div>
            </div>

            {/* Thông tin bán hàng */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-gray-700 mb-3">
                <Package className="w-4 h-4 text-orange-500" />
                <span className="font-semibold">Thông tin bán hàng</span>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Sản phẩm quan tâm:</span>
                  <span className="font-medium text-gray-900">{customer.interestedProduct || '-'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Sales phụ trách:</span>
                  <span className="font-medium text-gray-900">{customer.assignedPerson || '-'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Giá trị lead:</span>
                  <span className="font-medium text-gray-900">{customer.leadValue ? `${customer.leadValue.toLocaleString('vi-VN')} đ` : '-'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Xác suất thành công:</span>
                  <span className="font-medium text-gray-900">{customer.successRate ? `${customer.successRate}%` : '-'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Row 2: Contact Info & Time Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Thông tin liên hệ */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-gray-700 mb-3">
                <Phone className="w-4 h-4 text-green-500" />
                <span className="font-semibold">Thông tin liên hệ</span>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Số điện thoại:</span>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-900">{customer.contact}</span>
                    <button className="text-green-500 hover:text-green-600">
                      <Phone className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Email:</span>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-900">{customer.email}</span>
                    <button className="text-blue-500 hover:text-blue-600">
                      <Mail className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Nguồn:</span>
                  <span className="inline-flex px-2 py-0.5 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                    {customer.source || 'Giới thiệu'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Tỉnh/thành:</span>
                  <span className="font-medium text-gray-900">{customer.city || '-'}</span>
                </div>
              </div>
            </div>

            {/* Thông tin thời gian */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-gray-700 mb-3">
                <Calendar className="w-4 h-4 text-purple-500" />
                <span className="font-semibold">Thông tin thời gian</span>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Ngày tạo:</span>
                  <span className="font-medium text-gray-900">{formatDate(customer.createdAt)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Cập nhật cuối:</span>
                  <span className="font-medium text-gray-900">{formatDate(customer.updatedAt)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Lần liên hệ cuối:</span>
                  <span className="font-medium text-gray-900">{formatDate(customer.lastContactAt)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Tags */}
          {customer.tags && customer.tags.length > 0 && (
            <div className="pt-4 border-t border-gray-200">
              <h4 className="text-center font-semibold text-gray-900 mb-3">Tags/Nhãn</h4>
              <div className="flex flex-wrap justify-center gap-2">
                {customer.tags.map((tag) => (
                  <span
                    key={tag.id}
                    className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${tag.color || 'bg-blue-100 text-blue-800'}`}
                  >
                    {tag.name}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Order Note Interface for Order Detail
interface OrderNote {
  id: string
  content: string
  createdAt: string
  createdBy: string
}

// Order Detail Dialog Component with Tabs
interface OrderDetailDialogProps {
  isOpen: boolean
  onClose: () => void
  order: CustomerOrder | null
}

function OrderDetailDialog({ isOpen, onClose, order }: OrderDetailDialogProps) {
  const [activeTab, setActiveTab] = useState<'info' | 'invoices' | 'notes'>('info')
  const [invoiceActionMenu, setInvoiceActionMenu] = useState<string | null>(null)
  const [noteActionMenu, setNoteActionMenu] = useState<string | null>(null)
  const [showEditInvoice, setShowEditInvoice] = useState(false)
  const [showDeleteInvoice, setShowDeleteInvoice] = useState(false)
  const [showEditNote, setShowEditNote] = useState(false)
  const [showDeleteNote, setShowDeleteNote] = useState(false)
  const [selectedInvoice, setSelectedInvoice] = useState<OrderInvoice | null>(null)
  const [selectedNote, setSelectedNote] = useState<OrderNote | null>(null)

  if (!isOpen || !order) return null

  const formatCurrency = (amount: number) => amount.toLocaleString('vi-VN') + ' đ'

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB'
  }

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800'
      case 'unpaid': return 'bg-red-100 text-red-800'
      case 'partial': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPaymentStatusText = (status: string) => {
    switch (status) {
      case 'paid': return 'Đã thanh toán'
      case 'unpaid': return 'Chưa thanh toán'
      case 'partial': return 'Thanh toán 1 phần'
      default: return status
    }
  }

  // Mock order items for demonstration
  const orderItems: OrderItem[] = order.items || [
    { id: 1, productName: 'NETCore', productPackage: '1', quantity: 1, price: 10000, total: 10000, paymentStatus: 'paid' },
    { id: 2, productName: 'HRMCort', productPackage: '2', quantity: 1, price: 20000, total: 40000, paymentStatus: 'partial' },
  ]

  // Mock invoices for demonstration
  const mockInvoices: OrderInvoice[] = order.invoices || [
    { id: '1', fileName: '028d0cad-e7b5-4e85-94bc-92a0003a71c2.png', fileSize: 1240000, fileType: 'image/png', uploadedAt: '2026-02-26T00:53:00', thumbnailUrl: '' },
    { id: '2', fileName: '81686d2f-77ae-478b-8165-76fbf9269dc3.png', fileSize: 997070, fileType: 'image/png', uploadedAt: '2026-02-26T00:53:00', thumbnailUrl: '' },
    { id: '3', fileName: '490a618f-5499-49dd-b1cd-424e1efdf759.png', fileSize: 1130000, fileType: 'image/png', uploadedAt: '2026-02-26T00:53:00', thumbnailUrl: '' },
  ]

  // Mock notes for demonstration
  const mockNotes: OrderNote[] = [
    { id: '1', content: 'Khách hàng yêu cầu giao hàng vào buổi sáng', createdAt: '2026-02-20T10:30:00', createdBy: 'Nguyễn Văn A' },
    { id: '2', content: 'Đã liên hệ xác nhận đơn hàng', createdAt: '2026-02-21T14:00:00', createdBy: 'Trần Thị B' },
  ]

  const subtotal = order.subtotal || orderItems.reduce((sum, item) => sum + item.total, 0)
  const discount = order.discount || 350000
  const vat = order.vat || Math.round(subtotal * 0.1)
  const grandTotal = subtotal - discount + vat

  const tabs = [
    { id: 'info', label: 'Thông tin', icon: <Info className="w-4 h-4" /> },
    { id: 'invoices', label: 'Hóa đơn', icon: <Receipt className="w-4 h-4" /> },
    { id: 'notes', label: 'Ghi chú', icon: <FileText className="w-4 h-4" /> },
  ]

  // Tab: Thông tin
  const renderInfoTab = () => (
    <div className="space-y-4">
      {/* Products Table */}
      <div className="overflow-x-auto border border-gray-200 rounded-lg">
        <table className="w-full">
          <thead className="bg-[#fafafb]">
            <tr>
              <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600 uppercase border-r border-gray-200">Tên SP</th>
              <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600 uppercase border-r border-gray-200">Gói SP</th>
              <th className="px-3 py-2 text-center text-xs font-semibold text-gray-600 uppercase border-r border-gray-200">Số lượng</th>
              <th className="px-3 py-2 text-right text-xs font-semibold text-gray-600 uppercase border-r border-gray-200">Giá</th>
              <th className="px-3 py-2 text-right text-xs font-semibold text-gray-600 uppercase border-r border-gray-200">Tổng tiền</th>
              <th className="px-3 py-2 text-center text-xs font-semibold text-gray-600 uppercase">Trạng thái TT</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {orderItems.map((item) => (
              <tr key={item.id} className="hover:bg-[#f0f7ff]">
                <td className="px-3 py-2 border-r border-gray-200 text-sm text-gray-900">{item.productName}</td>
                <td className="px-3 py-2 border-r border-gray-200 text-sm text-gray-700">{item.productPackage}</td>
                <td className="px-3 py-2 border-r border-gray-200 text-sm text-gray-700 text-center">{item.quantity}</td>
                <td className="px-3 py-2 border-r border-gray-200 text-sm text-gray-900 text-right">{formatCurrency(item.price)}</td>
                <td className="px-3 py-2 border-r border-gray-200 text-sm text-blue-600 text-right font-medium">{formatCurrency(item.total)}</td>
                <td className="px-3 py-2 text-center">
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getPaymentStatusColor(item.paymentStatus)}`}>
                    {getPaymentStatusText(item.paymentStatus)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pricing Summary */}
      <div className="border-t border-gray-200 pt-4 space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Tạm tính:</span>
          <span className="text-sm text-gray-900 text-right">{formatCurrency(subtotal)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-green-600">Giảm giá:</span>
          <span className="text-sm text-green-600 text-right">-{formatCurrency(discount)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Thuế VAT:</span>
          <span className="text-sm text-gray-900 text-right">{formatCurrency(vat)}</span>
        </div>
        <div className="flex justify-between items-center pt-2 border-t border-gray-200">
          <span className="text-base font-semibold text-gray-900">Tổng cộng:</span>
          <span className="text-lg font-bold text-blue-600">{formatCurrency(grandTotal)}</span>
        </div>
      </div>
    </div>
  )

  // Tab: Hóa đơn
  const renderInvoicesTab = () => (
    <div className="space-y-4">
      <div className="overflow-x-auto border border-gray-200 rounded-lg">
        <table className="w-full">
          <thead className="bg-[#fafafb]">
            <tr>
              <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600 uppercase border-r border-gray-200 w-16">Ảnh</th>
              <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600 uppercase border-r border-gray-200">Tên file</th>
              <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600 uppercase border-r border-gray-200">Ngày tạo</th>
              <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600 uppercase border-r border-gray-200">Kích thước</th>
              <th className="px-3 py-2 text-center text-xs font-semibold text-gray-600 uppercase w-20">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {mockInvoices.map((invoice) => (
              <tr key={invoice.id} className="hover:bg-[#f0f7ff]">
                <td className="px-3 py-2 border-r border-gray-200">
                  <div className="w-10 h-10 bg-gray-200 rounded flex items-center justify-center overflow-hidden">
                    {invoice.fileType.startsWith('image/') ? (
                      invoice.thumbnailUrl ? (
                        <img src={invoice.thumbnailUrl} alt={invoice.fileName} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-lg">🖼️</span>
                      )
                    ) : (
                      <FileText className="w-5 h-5 text-gray-500" />
                    )}
                  </div>
                </td>
                <td className="px-3 py-2 border-r border-gray-200">
                  <span className="text-sm text-blue-600 hover:underline cursor-pointer">{invoice.fileName}</span>
                </td>
                <td className="px-3 py-2 border-r border-gray-200 text-sm text-gray-600">
                  {new Date(invoice.uploadedAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })} - {new Date(invoice.uploadedAt).toLocaleDateString('vi-VN')}
                </td>
                <td className="px-3 py-2 border-r border-gray-200 text-sm text-gray-600">
                  {formatFileSize(invoice.fileSize)}
                </td>
                <td className="px-3 py-2 text-center relative">
                  <button
                    className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
                    onClick={() => setInvoiceActionMenu(invoiceActionMenu === invoice.id ? null : invoice.id)}
                  >
                    <MoreVertical className="w-4 h-4" />
                  </button>
                  {invoiceActionMenu === invoice.id && (
                    <div className="absolute right-0 top-full mt-1 w-36 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                      <button
                        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                        onClick={() => {
                          setSelectedInvoice(invoice)
                          setShowEditInvoice(true)
                          setInvoiceActionMenu(null)
                        }}
                      >
                        <Edit className="w-4 h-4 text-blue-500" />
                        Sửa
                      </button>
                      <button
                        className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                        onClick={() => {
                          setSelectedInvoice(invoice)
                          setShowDeleteInvoice(true)
                          setInvoiceActionMenu(null)
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                        Xóa
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {mockInvoices.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          Chưa có hóa đơn nào
        </div>
      )}
    </div>
  )

  // Tab: Ghi chú
  const renderNotesTab = () => (
    <div className="space-y-4">
      <div className="overflow-x-auto border border-gray-200 rounded-lg">
        <table className="w-full">
          <thead className="bg-[#fafafb]">
            <tr>
              <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600 uppercase border-r border-gray-200">Nội dung</th>
              <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600 uppercase border-r border-gray-200 w-40">Ngày tạo</th>
              <th className="px-3 py-2 text-center text-xs font-semibold text-gray-600 uppercase w-20">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {mockNotes.map((note) => (
              <tr key={note.id} className="hover:bg-[#f0f7ff]">
                <td className="px-3 py-2 border-r border-gray-200 text-sm text-gray-900">
                  {note.content}
                </td>
                <td className="px-3 py-2 border-r border-gray-200 text-sm text-gray-600">
                  {new Date(note.createdAt).toLocaleDateString('vi-VN')}
                </td>
                <td className="px-3 py-2 text-center relative">
                  <button
                    className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
                    onClick={() => setNoteActionMenu(noteActionMenu === note.id ? null : note.id)}
                  >
                    <MoreVertical className="w-4 h-4" />
                  </button>
                  {noteActionMenu === note.id && (
                    <div className="absolute right-0 top-full mt-1 w-36 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                      <button
                        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                        onClick={() => {
                          setSelectedNote(note)
                          setShowEditNote(true)
                          setNoteActionMenu(null)
                        }}
                      >
                        <Edit className="w-4 h-4 text-blue-500" />
                        Sửa
                      </button>
                      <button
                        className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                        onClick={() => {
                          setSelectedNote(note)
                          setShowDeleteNote(true)
                          setNoteActionMenu(null)
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                        Xóa
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {mockNotes.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          Chưa có ghi chú nào
        </div>
      )}
    </div>
  )

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]">
        <div className="bg-white rounded-xl w-full max-w-3xl mx-4 shadow-2xl max-h-[90vh] flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <Info className="w-5 h-5 text-blue-500" />
              <h3 className="font-semibold text-gray-900">Chi tiết đơn hàng - {order.orderNumber}</h3>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Tabs Navigation */}
          <div className="border-b border-gray-200 px-4">
            <nav className="flex space-x-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as 'info' | 'invoices' | 'notes')}
                  className={`flex items-center gap-2 py-3 px-1 border-b-2 text-sm font-medium transition-colors ${activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div className="p-4 overflow-y-auto flex-1">
            {activeTab === 'info' && renderInfoTab()}
            {activeTab === 'invoices' && renderInvoicesTab()}
            {activeTab === 'notes' && renderNotesTab()}
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-2 p-4 border-t border-gray-200 bg-gray-50 rounded-b-xl">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>

      {/* Edit Invoice Dialog */}
      {showEditInvoice && selectedInvoice && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[70]">
          <div className="bg-white rounded-lg w-full max-w-md mx-4 shadow-xl">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Sửa hóa đơn</h3>
              <button onClick={() => setShowEditInvoice(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  File hiện tại: <span className="text-blue-600">{selectedInvoice.fileName}</span>
                </label>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Chọn file mới
                </label>
                <input
                  type="file"
                  accept="image/*,.pdf"
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 p-4 border-t border-gray-200">
              <button
                onClick={() => setShowEditInvoice(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Hủy
              </button>
              <button
                onClick={() => setShowEditInvoice(false)}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
              >
                Lưu thay đổi
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Invoice Confirmation */}
      {showDeleteInvoice && selectedInvoice && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[70]">
          <div className="bg-white rounded-lg w-full max-w-sm mx-4 shadow-xl">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Xác nhận xóa</h3>
              <p className="text-sm text-gray-600">
                Bạn có chắc chắn muốn xóa hóa đơn "{selectedInvoice.fileName}"? Hành động này không thể hoàn tác.
              </p>
            </div>
            <div className="flex items-center justify-end gap-3 p-4 border-t border-gray-200">
              <button
                onClick={() => setShowDeleteInvoice(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Hủy
              </button>
              <button
                onClick={() => setShowDeleteInvoice(false)}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700"
              >
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Note Dialog */}
      {showEditNote && selectedNote && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[70]">
          <div className="bg-white rounded-lg w-full max-w-md mx-4 shadow-xl">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Sửa ghi chú</h3>
              <button onClick={() => setShowEditNote(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nội dung ghi chú <span className="text-red-500">*</span>
              </label>
              <textarea
                defaultValue={selectedNote.content}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                placeholder="Nhập nội dung ghi chú..."
              />
            </div>
            <div className="flex items-center justify-end gap-3 p-4 border-t border-gray-200">
              <button
                onClick={() => setShowEditNote(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Hủy
              </button>
              <button
                onClick={() => setShowEditNote(false)}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
              >
                Lưu thay đổi
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Note Confirmation */}
      {showDeleteNote && selectedNote && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[70]">
          <div className="bg-white rounded-lg w-full max-w-sm mx-4 shadow-xl">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Xác nhận xóa</h3>
              <p className="text-sm text-gray-600">
                Bạn có chắc chắn muốn xóa ghi chú này? Hành động này không thể hoàn tác.
              </p>
            </div>
            <div className="flex items-center justify-end gap-3 p-4 border-t border-gray-200">
              <button
                onClick={() => setShowDeleteNote(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Hủy
              </button>
              <button
                onClick={() => setShowDeleteNote(false)}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700"
              >
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

// Refund Dialog Component
interface RefundDialogProps {
  isOpen: boolean
  onClose: () => void
  order: CustomerOrder | null
  onSubmit: (orderId: number, amount: number, method: string, reason: string) => void
}

function RefundDialog({ isOpen, onClose, order, onSubmit }: RefundDialogProps) {
  const [amount, setAmount] = useState('')
  const [method, setMethod] = useState('bank_transfer')
  const [reason, setReason] = useState('')

  if (!isOpen || !order) return null

  const handleSubmit = () => {
    const refundAmount = parseFloat(amount.replace(/[^\d]/g, ''))
    if (refundAmount > 0 && reason.trim()) {
      onSubmit(order.id, refundAmount, method, reason)
      setAmount('')
      setMethod('bank_transfer')
      setReason('')
      onClose()
    }
  }

  const formatCurrency = (value: string) => {
    const num = value.replace(/[^\d]/g, '')
    if (!num) return ''
    return parseInt(num).toLocaleString('vi-VN')
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]">
      <div className="bg-white rounded-xl w-full max-w-md mx-4 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <RefreshCw className="w-5 h-5 text-blue-500" />
            <h3 className="font-semibold text-gray-900">Hoàn tiền/Hủy đơn</h3>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {/* Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Số tiền hoàn (VND) <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={amount}
              onChange={(e) => setAmount(formatCurrency(e.target.value))}
              placeholder="Nhập số tiền hoàn..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Method */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Phương thức hoàn <span className="text-red-500">*</span>
            </label>
            <select
              value={method}
              onChange={(e) => setMethod(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
            >
              <option value="custom">Tùy chỉnh</option>
              <option value="bank_transfer">Chuyển khoản</option>
              <option value="cash">Tiền mặt</option>
              <option value="voucher">Voucher</option>
            </select>
          </div>

          {/* Reason */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Lý do hoàn/hủy <span className="text-red-500">*</span>
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
              placeholder="Khách hủy, sai hợp đồng, chưa thanh toán..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-4 border-t border-gray-200 bg-gray-50 rounded-b-xl">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Hủy
          </button>
          <button
            onClick={handleSubmit}
            disabled={!amount || !reason.trim()}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Đồng ý
          </button>
        </div>
      </div>
    </div>
  )
}

// Add Note to Order Dialog
interface AddOrderNoteDialogProps {
  isOpen: boolean
  onClose: () => void
  order: CustomerOrder | null
  onSave: (orderId: number, content: string) => void
}

function AddOrderNoteDialog({ isOpen, onClose, order, onSave }: AddOrderNoteDialogProps) {
  const [content, setContent] = useState('')

  if (!isOpen || !order) return null

  const handleSave = () => {
    if (content.trim()) {
      onSave(order.id, content)
      setContent('')
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]">
      <div className="bg-white rounded-xl w-full max-w-md mx-4 shadow-2xl">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <MessageSquarePlus className="w-5 h-5 text-blue-500" />
            <h3 className="font-semibold text-gray-900">Thêm ghi chú - {order.orderNumber}</h3>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-4">
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Nội dung ghi chú <span className="text-red-500">*</span>
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={4}
            placeholder="Nhập nội dung ghi chú cho đơn hàng..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
          />
          {!content.trim() && (
            <p className="text-sm text-red-500 mt-1">Vui lòng nhập nội dung ghi chú</p>
          )}
        </div>
        <div className="flex items-center justify-end gap-3 p-4 border-t border-gray-200 bg-gray-50 rounded-b-xl">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Hủy
          </button>
          <button
            onClick={handleSave}
            disabled={!content.trim()}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Lưu ghi chú
          </button>
        </div>
      </div>
    </div>
  )
}

// Attach Invoice Dialog
interface AttachInvoiceDialogProps {
  isOpen: boolean
  onClose: () => void
  order: CustomerOrder | null
  onSave: (orderId: number, files: File[]) => void
}

function AttachInvoiceDialog({ isOpen, onClose, order, onSave }: AttachInvoiceDialogProps) {
  const [files, setFiles] = useState<File[]>([])

  if (!isOpen || !order) return null

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(prev => [...prev, ...Array.from(e.target.files || [])])
    }
  }

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index))
  }

  const handleSave = () => {
    if (files.length > 0) {
      onSave(order.id, files)
      setFiles([])
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]">
      <div className="bg-white rounded-xl w-full max-w-md mx-4 shadow-2xl">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <Receipt className="w-5 h-5 text-green-500" />
            <h3 className="font-semibold text-gray-900">Gắn hóa đơn - {order.orderNumber}</h3>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Chọn file hóa đơn <span className="text-red-500">*</span>
            </label>
            <input
              type="file"
              multiple
              accept="image/*,.pdf"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
            />
          </div>
          {files.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-700">Các file đã chọn:</p>
              {files.map((file, index) => (
                <div key={index} className="flex items-center justify-between text-sm bg-gray-50 px-3 py-2 rounded-lg border border-gray-200">
                  <div className="flex items-center gap-2 min-w-0">
                    <FileText className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <span className="truncate">{file.name}</span>
                  </div>
                  <button onClick={() => removeFile(index)} className="text-red-500 hover:text-red-700 ml-2 flex-shrink-0">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="flex items-center justify-end gap-3 p-4 border-t border-gray-200 bg-gray-50 rounded-b-xl">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Hủy
          </button>
          <button
            onClick={handleSave}
            disabled={files.length === 0}
            className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Gắn hóa đơn
          </button>
        </div>
      </div>
    </div>
  )
}

// Task Detail Modal Component
interface TaskDetailModalProps {
  isOpen: boolean
  onClose: () => void
  task: CustomerTask | null
  customerName: string
}

function TaskDetailModal({ isOpen, onClose, task, customerName }: TaskDetailModalProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'reminders' | 'history'>('overview')

  if (!isOpen || !task) return null

  const formatDateTime = (dateStr: string) => {
    const date = new Date(dateStr)
    return `${date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })} ${date.toLocaleDateString('vi-VN')}`
  }

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'completed'

  const getStatusDisplay = () => {
    switch (task.status) {
      case 'pending': return { text: 'Chưa làm', color: 'bg-gray-100 text-gray-800 border-gray-200' }
      case 'in-progress': return { text: 'Đang làm', color: 'bg-blue-100 text-blue-800 border-blue-200' }
      case 'completed': return { text: 'Hoàn thành', color: 'bg-green-100 text-green-800 border-green-200' }
      default: return { text: task.status, color: 'bg-gray-100 text-gray-800 border-gray-200' }
    }
  }

  const getPriorityDisplay = () => {
    switch (task.priority) {
      case 'high': return { text: 'Cao', color: 'bg-red-100 text-red-800 border-red-200' }
      case 'medium': return { text: 'Trung bình', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' }
      case 'low': return { text: 'Thấp', color: 'bg-green-100 text-green-800 border-green-200' }
      default: return { text: task.priority, color: 'bg-gray-100 text-gray-800 border-gray-200' }
    }
  }

  const status = getStatusDisplay()
  const priority = getPriorityDisplay()

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <h2 className="text-xl font-semibold text-gray-900">{task.title}</h2>
          </div>
          <div className="flex items-center space-x-2">
            <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors" title="Chỉnh sửa">
              <Edit className="w-5 h-5" />
            </button>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6 overflow-x-auto">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap flex items-center space-x-2 ${activeTab === 'overview' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
            >
              <FileText className="w-4 h-4" />
              <span>Tổng quan</span>
            </button>
            <button
              onClick={() => setActiveTab('reminders')}
              className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap flex items-center space-x-2 ${activeTab === 'reminders' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
            >
              <Bell className="w-4 h-4" />
              <span>Nhắc nhở</span>
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap flex items-center space-x-2 ${activeTab === 'history' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
            >
              <History className="w-4 h-4" />
              <span>Lịch sử</span>
            </button>
          </nav>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[60vh] p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Status Bar */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Circle className="w-5 h-5 text-gray-600" />
                    <span className={`px-3 py-1 text-sm font-medium rounded-full border ${status.color}`}>
                      {status.text}
                    </span>
                    {isOverdue && (
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800 border border-red-200 flex items-center">
                        <AlertTriangle className="w-3 h-3 mr-1" />
                        Quá hạn
                      </span>
                    )}
                  </div>
                  {task.status === 'pending' && (
                    <button className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-1">
                      <Play className="w-3 h-3" />
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
                    <div className="text-lg font-medium text-gray-900">{task.title}</div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Mô tả</label>
                    <div className="text-gray-900 whitespace-pre-wrap">{task.description || 'Không có mô tả'}</div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Thời hạn</label>
                    <div className={`flex items-center space-x-2 ${isOverdue ? 'text-red-600' : 'text-gray-900'}`}>
                      <Calendar className="w-4 h-4" />
                      <span>{task.dueDate ? formatDateTime(task.dueDate) : '-'}</span>
                      {isOverdue && (
                        <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">Quá hạn</span>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Ưu tiên</label>
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${priority.color}`}>
                      {priority.text}
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Người phụ trách</label>
                    <div className="flex items-center space-x-2">
                      <User className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-900">{task.assignee}</span>
                      {task.assigneeRole && (
                        <span className="text-sm text-gray-500">({task.assigneeRole})</span>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Liên quan</label>
                    <div className="flex items-center space-x-2 mt-1">
                      <Building className="w-4 h-4 text-blue-600" />
                      <span className="text-gray-900">{task.relatedCustomer || customerName}</span>
                      {task.relatedCustomerType && (
                        <span className="text-sm text-gray-500">({task.relatedCustomerType})</span>
                      )}
                    </div>
                    {task.relatedPhone && (
                      <div className="flex items-center space-x-2 mt-1 text-sm text-gray-500">
                        <Phone className="w-3 h-3" />
                        <span>{task.relatedPhone}</span>
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Nhãn</label>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {task.tags.length > 0 ? task.tags.map((tag, i) => (
                        <span key={i} className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                          {tag}
                        </span>
                      )) : <span className="text-gray-500 text-sm">-</span>}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Tạo lúc</label>
                    <div className="text-gray-900">{formatDateTime(task.createdAt)}</div>
                  </div>
                </div>
              </div>

              {/* Internal Note */}
              {task.internalNote && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Ghi chú nội bộ</label>
                  <div className="mt-1 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-gray-900">
                    {task.internalNote}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'reminders' && (
            <div className="text-center py-8 text-gray-500">
              Chưa có nhắc nhở nào
            </div>
          )}

          {activeTab === 'history' && (
            <div className="text-center py-8 text-gray-500">
              Chưa có lịch sử hoạt động
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ==================== MAIN COMPONENT ====================

export default function CustomerDetailModal({
  isOpen,
  onClose,
  customer,
  onUpdate,
  onOpenOrderDetail
}: CustomerDetailModalProps) {
  const [activeTab, setActiveTab] = useState<'orders' | 'notes' | 'tasks' | 'history'>('orders')
  const [showInfoDetail, setShowInfoDetail] = useState(false)
  const [showEditNote, setShowEditNote] = useState(false)
  const [showDeleteNote, setShowDeleteNote] = useState(false)
  const [showAddNote, setShowAddNote] = useState(false)
  const [selectedNote, setSelectedNote] = useState<CustomerNote | null>(null)
  const [showOrderDetail, setShowOrderDetail] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<CustomerOrder | null>(null)
  const [showTaskDetail, setShowTaskDetail] = useState(false)
  const [selectedTask, setSelectedTask] = useState<CustomerTask | null>(null)

  // Order action dialogs
  const [showRefundDialog, setShowRefundDialog] = useState(false)
  const [showAddOrderNote, setShowAddOrderNote] = useState(false)
  const [showAttachInvoice, setShowAttachInvoice] = useState(false)
  const [orderActionMenuOpen, setOrderActionMenuOpen] = useState<number | null>(null)

  // History filters
  const [historyDateFrom, setHistoryDateFrom] = useState('')
  const [historyDateTo, setHistoryDateTo] = useState('')
  const [historyTypeFilter, setHistoryTypeFilter] = useState<string>('all')

  if (!isOpen || !customer) return null

  // Mock data for demonstration
  const defaultOrders: CustomerOrder[] = [
    { id: 1, orderNumber: 'DH001', customerName: customer.name, products: 'Sản phẩm A, Sản phẩm B', total: 5000000, paymentCount: 2, paid: 3000000, debt: 2000000, paymentMethod: 'Chuyển khoản', status: 'pending', createdAt: '2026-02-20', dueDate: '2026-03-20', label: 'Chờ xử lý' },
    { id: 2, orderNumber: 'DH002', customerName: customer.name, products: 'Sản phẩm C', total: 2000000, paymentCount: 1, paid: 2000000, debt: 0, paymentMethod: 'Tiền mặt', status: 'completed', createdAt: '2026-02-15', dueDate: '2026-02-28', label: 'Hoàn thành' },
    { id: 3, orderNumber: 'DH003', customerName: customer.name, products: 'Sản phẩm D, E, F', total: 8000000, paymentCount: 3, paid: 4000000, debt: 4000000, paymentMethod: 'Trả góp', status: 'confirmed', createdAt: '2026-02-10', dueDate: '2026-04-10', label: 'Đã xác nhận' },
  ]
  const mockOrders: CustomerOrder[] = Array.isArray(customer.orders) && customer.orders.length > 0 ? customer.orders : defaultOrders

  const defaultNotes: CustomerNote[] = [
    {
      id: '1',
      content: 'Lao toet',
      createdAt: '2026-02-26T00:53:00',
      createdBy: 'Ánh Văn Ngọc',
      attachments: [
        { id: 'a1', fileName: '028d0cad-e7b5-4e85-94bc-92a0003a71c2.png', fileSize: 1300000, fileType: 'image/png', uploadedAt: '2026-02-26T00:53:00', thumbnailUrl: '' },
        { id: 'a2', fileName: '81686d2f-77ae-478b-8165-76fbf9269dc3.png', fileSize: 1021000, fileType: 'image/png', uploadedAt: '2026-02-26T00:53:00', thumbnailUrl: '' },
        { id: 'a3', fileName: '490a618f-5499-49dd-b1cd-424e1efdf759.png', fileSize: 1190000, fileType: 'image/png', uploadedAt: '2026-02-26T00:53:00', thumbnailUrl: '' },
      ]
    },
    {
      id: '2',
      content: 'Thằng cu này láo nháo',
      createdAt: '2026-02-25T11:09:00',
      createdBy: 'Ánh Văn Ngọc',
      attachments: [
        { id: 'a4', fileName: '7057926d-cd1b-4d17-b0be-9fd5d5dd223a.png', fileSize: 1021000, fileType: 'image/png', uploadedAt: '2026-02-25T11:09:00', thumbnailUrl: '' },
      ]
    }
  ]
  const mockNotes: CustomerNote[] = Array.isArray(customer.notes) && customer.notes.length > 0 ? customer.notes : defaultNotes

  const defaultTasks: CustomerTask[] = [
    { id: '1', title: 'Gọi điện tư vấn', description: 'Liên hệ tư vấn gói phần mềm quản lý nhân sự', assignee: 'Nguyễn Văn An', assigneeRole: 'Sales', priority: 'high', status: 'pending', dueDate: '2025-07-15T10:00:00', tags: ['Khẩn cấp', 'VIP'], createdAt: '2025-07-01T09:00:00', relatedCustomer: 'Công ty ABC', relatedCustomerType: 'Lead', relatedPhone: '0987654321', internalNote: 'Khách quan tâm đến tính năng chấm công tự động' },
    { id: '2', title: 'Gửi báo giá', description: 'Gửi báo giá chi tiết cho khách hàng', assignee: 'Sale 2', assigneeRole: 'Sales', priority: 'medium', status: 'completed', completedAt: '2026-02-22', tags: [], createdAt: '2026-02-18' },
    { id: '3', title: 'Follow up đơn hàng', description: 'Theo dõi tiến độ đơn hàng', assignee: 'Sale 1', assigneeRole: 'Sales', priority: 'low', status: 'in-progress', dueDate: '2026-03-01T14:00:00', tags: [], createdAt: '2026-02-15' },
  ]
  const mockTasks: CustomerTask[] = Array.isArray(customer.tasks) && customer.tasks.length > 0 ? customer.tasks : defaultTasks

  const defaultHistory: CustomerHistoryItem[] = [
    { id: '1', type: 'order', action: 'Tạo đơn hàng', description: 'Đơn hàng DH001 được tạo', timestamp: '2026-02-20T10:30:00', performedBy: 'Sale 1' },
    { id: '2', type: 'customer', action: 'Cập nhật thông tin', description: 'Thay đổi số điện thoại', timestamp: '2026-02-18T14:20:00', performedBy: 'Admin' },
    { id: '3', type: 'task', action: 'Hoàn thành công việc', description: 'Gửi báo giá - Hoàn thành', timestamp: '2026-02-22T09:00:00', performedBy: 'Sale 2' },
    { id: '4', type: 'system', action: 'Tự động', description: 'Gửi email reminder', timestamp: '2026-02-21T08:00:00' },
  ]
  const mockHistory: CustomerHistoryItem[] = Array.isArray(customer.history) && customer.history.length > 0 ? customer.history : defaultHistory

  // Calculate totals
  const totalOrderAmount = mockOrders.reduce((sum, o) => sum + o.total, 0)
  const totalPaid = mockOrders.reduce((sum, o) => sum + o.paid, 0)
  const totalDebt = mockOrders.reduce((sum, o) => sum + o.debt, 0)

  // Filtered history - computed directly without useMemo to avoid hooks rules violation
  const filteredHistory = mockHistory.filter(item => {
    if (historyTypeFilter !== 'all' && item.type !== historyTypeFilter) return false
    if (historyDateFrom && new Date(item.timestamp) < new Date(historyDateFrom)) return false
    if (historyDateTo && new Date(item.timestamp) > new Date(historyDateTo + 'T23:59:59')) return false
    return true
  })

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('vi-VN') + ' đ'
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('vi-VN')
  }

  const formatDateTime = (dateStr: string) => {
    const date = new Date(dateStr)
    return `${date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })} - ${date.toLocaleDateString('vi-VN')}`
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB'
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'confirmed': return 'bg-blue-100 text-blue-800'
      case 'completed': return 'bg-green-100 text-green-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Chờ xử lý'
      case 'confirmed': return 'Đã xác nhận'
      case 'completed': return 'Hoàn thành'
      case 'cancelled': return 'Đã hủy'
      default: return status
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'low': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'high': return 'Cao'
      case 'medium': return 'Trung bình'
      case 'low': return 'Thấp'
      default: return priority
    }
  }

  const getTaskStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Chưa bắt đầu'
      case 'in-progress': return 'Đang thực hiện'
      case 'completed': return 'Hoàn thành'
      default: return status
    }
  }

  const getHistoryTypeColor = (type: string) => {
    switch (type) {
      case 'order': return 'bg-blue-500'
      case 'customer': return 'bg-green-500'
      case 'task': return 'bg-purple-500'
      case 'system': return 'bg-gray-500'
      default: return 'bg-gray-500'
    }
  }

  // Handlers
  const handleEditNote = (note: CustomerNote) => {
    setSelectedNote(note)
    setShowEditNote(true)
  }

  const handleDeleteNote = (note: CustomerNote) => {
    setSelectedNote(note)
    setShowDeleteNote(true)
  }

  const handleSaveEditedNote = (noteId: string, content: string) => {
    console.log('Saving note:', noteId, content)
    // In real app, call API to update note
  }

  const handleConfirmDeleteNote = () => {
    if (selectedNote) {
      console.log('Deleting note:', selectedNote.id)
      // In real app, call API to delete note
    }
  }

  const handleAddNote = (content: string, files: File[]) => {
    console.log('Adding note:', content, files)
    // In real app, call API to add note with attachments
  }

  // ==================== RENDER TABS ====================

  const handleOpenOrderDetail = (order: CustomerOrder) => {
    setSelectedOrder(order)
    setShowOrderDetail(true)
  }

  const renderOrdersTab = () => (
    <div className="space-y-4">
      {/* Orders Table */}
      <div className="overflow-x-auto border border-gray-200 rounded-lg">
        <table className="w-full">
          <thead className="bg-[#fafafb]">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase border-r border-gray-200">Mã đơn</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase border-r border-gray-200">Khách hàng</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase border-r border-gray-200">Sản phẩm</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase border-r border-gray-200">Tổng tiền</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase border-r border-gray-200">Số lần TT</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase border-r border-gray-200">Thực tế</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase border-r border-gray-200">Dư nợ</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase border-r border-gray-200">Trạng thái</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase border-r border-gray-200">Thanh toán</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase border-r border-gray-200">Thời hạn</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase border-r border-gray-200">Nhãn</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase w-16">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {mockOrders.map((order) => (
              <tr key={order.id} className="hover:bg-[#f0f7ff]">
                <td className="px-4 py-3 border-r border-gray-200">
                  <button
                    className="text-blue-600 hover:text-blue-800 font-medium hover:underline"
                    onClick={() => handleOpenOrderDetail(order)}
                  >
                    {order.orderNumber}
                  </button>
                </td>
                <td className="px-4 py-3 border-r border-gray-200 text-sm text-gray-700 max-w-[150px] truncate" title={order.customerName || customer.name}>
                  {order.customerName || customer.name}
                </td>
                <td className="px-4 py-3 border-r border-gray-200 text-sm text-gray-700 max-w-[180px] truncate" title={order.products}>
                  {order.products}
                </td>
                <td className="px-4 py-3 border-r border-gray-200 text-sm text-blue-600 text-right font-medium">
                  {formatCurrency(order.total)}
                </td>
                <td className="px-4 py-3 border-r border-gray-200 text-sm text-gray-700 text-center">
                  {order.paymentCount || 0}
                </td>
                <td className="px-4 py-3 border-r border-gray-200 text-sm text-green-600 text-right">
                  {formatCurrency(order.paid)}
                </td>
                <td className="px-4 py-3 border-r border-gray-200 text-sm text-red-600 text-right">
                  {formatCurrency(order.debt)}
                </td>
                <td className="px-4 py-3 border-r border-gray-200">
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                    {getStatusText(order.status)}
                  </span>
                </td>
                <td className="px-4 py-3 border-r border-gray-200 text-sm text-gray-700">
                  {order.paymentMethod}
                </td>
                <td className="px-4 py-3 border-r border-gray-200 text-sm text-gray-500">
                  {order.dueDate ? formatDate(order.dueDate) : '-'}
                </td>
                <td className="px-4 py-3 border-r border-gray-200">
                  {order.label ? (
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${order.label === 'Hoàn thành' ? 'bg-green-100 text-green-700' :
                      order.label === 'Đã xác nhận' ? 'bg-blue-100 text-blue-700' :
                        order.label === 'Chờ xử lý' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-gray-100 text-gray-700'
                      }`}>
                      {order.label}
                    </span>
                  ) : '-'}
                </td>
                <td className="px-4 py-3 text-center relative">
                  <button
                    className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
                    onClick={() => setOrderActionMenuOpen(orderActionMenuOpen === order.id ? null : order.id)}
                  >
                    <Settings className="w-4 h-4" />
                  </button>
                  {/* Action Menu Dropdown */}
                  {orderActionMenuOpen === order.id && (
                    <div className="absolute right-0 top-full mt-1 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                      {/* THÔNG TIN section */}
                      <div className="px-3 py-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Thông tin</div>
                      <button
                        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                        onClick={() => {
                          handleOpenOrderDetail(order)
                          setOrderActionMenuOpen(null)
                        }}
                      >
                        <Eye className="w-4 h-4 text-blue-500" />
                        Xem chi tiết
                      </button>

                      {/* THAO TÁC NHANH section */}
                      <div className="border-t border-gray-100 mt-1 pt-1">
                        <div className="px-3 py-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Thao tác nhanh</div>
                        <button
                          className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                          onClick={() => {
                            setSelectedOrder(order)
                            setOrderActionMenuOpen(null)
                            alert('Chức năng thanh toán đơn hàng - Đang phát triển')
                          }}
                        >
                          <CreditCard className="w-4 h-4 text-green-500" />
                          Thanh toán đơn hàng
                        </button>
                        <button
                          className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                          onClick={() => {
                            setSelectedOrder(order)
                            setOrderActionMenuOpen(null)
                            alert('Đã gửi nhắc nhở thanh toán cho đơn hàng ' + order.orderNumber)
                          }}
                        >
                          <BellRing className="w-4 h-4 text-orange-500" />
                          Nhắc nhở thanh toán
                        </button>
                        <button
                          className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                          onClick={() => {
                            setSelectedOrder(order)
                            setShowAttachInvoice(true)
                            setOrderActionMenuOpen(null)
                          }}
                        >
                          <Receipt className="w-4 h-4 text-purple-500" />
                          Gắn hóa đơn
                        </button>
                        <button
                          className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                          onClick={() => {
                            setSelectedOrder(order)
                            setShowAddOrderNote(true)
                            setOrderActionMenuOpen(null)
                          }}
                        >
                          <MessageSquarePlus className="w-4 h-4 text-blue-500" />
                          Thêm ghi chú
                        </button>
                      </div>

                      {/* THAO TÁC NGUY HIỂM section */}
                      <div className="border-t border-gray-100 mt-1 pt-1">
                        <div className="px-3 py-1.5 text-xs font-semibold text-red-400 uppercase tracking-wide">Thao tác nguy hiểm</div>
                        <button
                          className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                          onClick={() => {
                            setSelectedOrder(order)
                            setShowRefundDialog(true)
                            setOrderActionMenuOpen(null)
                          }}
                        >
                          <RefreshCw className="w-4 h-4 text-red-500" />
                          Hoàn tiền
                        </button>
                        {/* <button
                          className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                          onClick={() => {
                            setOrderActionMenuOpen(null)
                            if (confirm('Bạn có chắc chắn muốn xóa đơn hàng ' + order.orderNumber + '?')) {
                              console.log('Delete order:', order.id)
                              // In real app, call API to delete order
                            }
                          }}
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                          Xóa đơn hàng
                        </button> */}
                      </div>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
          {/* Summary Stats Row - aligned with table columns */}
          {mockOrders.length > 0 && (
            <tfoot>
              <tr className="bg-gray-50 border-t-2 border-gray-300">
                {/* Mã đơn column */}
                <td className="px-4 py-3 border-r border-gray-200">
                  <div className="text-xs text-gray-500 mb-0.5">Tổng số bản ghi: </div>
                  <div className="font-semibold text-gray-900">{mockOrders.length}</div>
                </td>
                {/* Khách hàng column */}
                <td className="px-4 py-3 border-r border-gray-200"></td>
                {/* Sản phẩm column */}
                <td className="px-4 py-3 border-r border-gray-200"></td>
                {/* Tổng tiền column */}
                <td className="px-4 py-3 border-r border-gray-200 text-right whitespace-nowrap">
                  <div className="text-xs text-gray-500 mb-0.5">Tổng tiền</div>
                  <div className="font-semibold text-blue-600">{formatCurrency(totalOrderAmount)}</div>
                </td>
                {/* Số lần TT column */}
                <td className="px-4 py-3 border-r border-gray-200"></td>
                {/* Thực tế (Đã TT) column */}
                <td className="px-4 py-3 border-r border-gray-200 text-right whitespace-nowrap">
                  <div className="text-xs text-gray-500 mb-0.5">Đã TT</div>
                  <div className="font-semibold text-green-600">{formatCurrency(totalPaid)}</div>
                </td>
                {/* Dư nợ column */}
                <td className="px-4 py-3 border-r border-gray-200 text-right whitespace-nowrap">
                  <div className="text-xs text-gray-500 mb-0.5">Dư nợ</div>
                  <div className="font-semibold text-red-600">{formatCurrency(totalDebt)}</div>
                </td>
                {/* Trạng thái column */}
                <td className="px-4 py-3 border-r border-gray-200"></td>
                {/* Thanh toán column */}
                <td className="px-4 py-3 border-r border-gray-200"></td>
                {/* Thời hạn column */}
                <td className="px-4 py-3 border-r border-gray-200"></td>
                {/* Nhãn column */}
                <td className="px-4 py-3 border-r border-gray-200"></td>
                {/* Thao tác column */}
                <td className="px-4 py-3"></td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    </div>
  )

  const handleOpenTaskDetail = (task: CustomerTask) => {
    setSelectedTask(task)
    setShowTaskDetail(true)
  }

  const getTaskStatusTag = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-gray-100 text-gray-800 border border-gray-200'
      case 'in-progress': return 'bg-blue-100 text-blue-800 border border-blue-200'
      case 'completed': return 'bg-green-100 text-green-800 border border-green-200'
      default: return 'bg-gray-100 text-gray-800 border border-gray-200'
    }
  }

  const getTaskStatusTagText = (status: string) => {
    switch (status) {
      case 'pending': return 'Chưa làm'
      case 'in-progress': return 'Đang làm'
      case 'completed': return 'Hoàn thành'
      default: return status
    }
  }

  const renderNotesTab = () => (
    <div className="space-y-4">
      {/* Add Note Button */}
      <div className="flex justify-end">
        <button
          onClick={() => setShowAddNote(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
        >
          <Plus className="w-4 h-4" />
          Thêm ghi chú
        </button>
      </div>

      {/* Notes List */}
      <div className="space-y-4">
        {mockNotes.map((note) => (
          <div key={note.id} className="border border-gray-200 rounded-lg p-4 bg-white">
            {/* Note Header */}
            <div className="flex items-start justify-between mb-3">
              <div>
                <h4 className="font-medium text-gray-900">{note.content}</h4>
                <p className="text-sm text-gray-500 mt-1">
                  {note.createdBy} - {formatDateTime(note.createdAt)}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleEditNote(note)}
                  className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                  title="Chỉnh sửa"
                >
                  <PenSquare className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeleteNote(note)}
                  className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                  title="Xóa"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Attachments */}
            {note.attachments && note.attachments.length > 0 && (
              <div className="space-y-2 mt-3 pt-3 border-t border-gray-100">
                {note.attachments.map((attachment) => (
                  <div key={attachment.id} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                    {/* Thumbnail */}
                    <div className="w-10 h-10 bg-gray-200 rounded flex items-center justify-center flex-shrink-0">
                      {attachment.fileType.startsWith('image/') ? (
                        <span className="text-lg">🖼️</span>
                      ) : (
                        <FileText className="w-5 h-5 text-gray-500" />
                      )}
                    </div>

                    {/* File Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-blue-600 truncate hover:underline cursor-pointer">
                        {attachment.fileName}
                      </p>
                      <p className="text-xs text-gray-500">
                        Ngày tạo {formatDateTime(attachment.uploadedAt)}
                      </p>
                      <p className="text-xs text-gray-500">
                        Kích thước: {formatFileSize(attachment.fileSize)}
                      </p>
                    </div>

                    {/* Delete */}
                    <button className="p-1 text-gray-400 hover:text-red-600 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {mockNotes.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          Chưa có ghi chú nào
        </div>
      )}
    </div>
  )

  const renderTasksTab = () => (
    <div className="space-y-4">
      {/* Header with Add Task Button */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-[#1a3353]">Danh sách công việc</h3>
        <button
          className="flex items-center gap-1 px-3 py-1.5 bg-[#3e79f7] hover:bg-[#2e69e7] text-white text-sm font-medium rounded-lg transition-colors"
          onClick={() => {
            // TODO: Implement add task functionality
            console.log('Add task clicked')
          }}
        >
          <Plus className="w-4 h-4" />
          Thêm công việc
        </button>
      </div>

      {/* Tasks Table */}
      <div className="overflow-x-auto border border-gray-200 rounded-lg">
        <table className="w-full">
          <thead className="bg-[#fafafb]">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase border-r border-gray-200">Công việc</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase border-r border-gray-200">Người phụ trách</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase border-r border-gray-200">Ưu tiên</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase border-r border-gray-200">Trạng thái</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase border-r border-gray-200">Hoàn thành</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase border-r border-gray-200">Tag</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Ngày tạo</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {mockTasks.map((task) => (
              <tr key={task.id} className="hover:bg-[#f0f7ff]">
                <td className="px-4 py-3 border-r border-gray-200">
                  <button
                    onClick={() => handleOpenTaskDetail(task)}
                    className="text-sm text-blue-600 hover:text-blue-800 hover:underline font-medium"
                  >
                    {task.title}
                  </button>
                </td>
                <td className="px-4 py-3 border-r border-gray-200 text-sm text-gray-700">
                  {task.assignee}
                </td>
                <td className="px-4 py-3 border-r border-gray-200">
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(task.priority)}`}>
                    {getPriorityText(task.priority)}
                  </span>
                </td>
                <td className="px-4 py-3 border-r border-gray-200">
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getTaskStatusTag(task.status)}`}>
                    {getTaskStatusTagText(task.status)}
                  </span>
                </td>
                <td className="px-4 py-3 border-r border-gray-200 text-sm text-gray-500">
                  {task.completedAt ? formatDate(task.completedAt) : '-'}
                </td>
                <td className="px-4 py-3 border-r border-gray-200 text-sm text-gray-500">
                  {task.tags.length > 0 ? task.tags.join(', ') : '-'}
                </td>
                <td className="px-4 py-3 text-sm text-gray-500">
                  {formatDate(task.createdAt)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Summary */}
      <div className="text-sm text-gray-500">
        Tổng số bản ghi: <span className="font-medium text-gray-900">{mockTasks.length}</span>
      </div>
    </div>
  )

  const renderHistoryTab = () => (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4 bg-gray-50 rounded-lg p-4">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">Bộ lọc:</span>
        </div>

        {/* Date Range */}
        <div className="flex items-center gap-2">
          <input
            type="date"
            value={historyDateFrom}
            onChange={(e) => setHistoryDateFrom(e.target.value)}
            className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm"
            placeholder="Từ ngày"
          />
          <span className="text-gray-400">-</span>
          <input
            type="date"
            value={historyDateTo}
            onChange={(e) => setHistoryDateTo(e.target.value)}
            className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm"
            placeholder="Đến ngày"
          />
        </div>

        {/* Type Filter */}
        <div className="relative">
          <select
            value={historyTypeFilter}
            onChange={(e) => setHistoryTypeFilter(e.target.value)}
            className="px-3 py-1.5 pr-8 border border-gray-300 rounded-lg text-sm appearance-none bg-white"
          >
            <option value="all">Tất cả</option>
            <option value="order">Đơn hàng</option>
            <option value="customer">Khách hàng</option>
            <option value="task">Công việc</option>
            <option value="system">Hệ thống</option>
          </select>
          <ChevronDown className="w-4 h-4 text-gray-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      {/* Timeline */}
      <div className="space-y-0">
        {filteredHistory.map((item, index) => (
          <div key={item.id} className="flex">
            <div className="flex flex-col items-center mr-4">
              <div className={`w-3 h-3 rounded-full flex-shrink-0 ${getHistoryTypeColor(item.type)}`}></div>
              {index < filteredHistory.length - 1 && (
                <div className="w-px flex-1 border-l-2 border-dashed border-gray-300 min-h-[40px]"></div>
              )}
            </div>
            <div className="pb-4 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-900">{item.action}</span>
                <span className={`inline-flex px-1.5 py-0.5 text-xs rounded ${item.type === 'order' ? 'bg-blue-100 text-blue-700' :
                  item.type === 'customer' ? 'bg-green-100 text-green-700' :
                    item.type === 'task' ? 'bg-purple-100 text-purple-700' :
                      'bg-gray-100 text-gray-700'
                  }`}>
                  {item.type === 'order' ? 'Đơn hàng' :
                    item.type === 'customer' ? 'Khách hàng' :
                      item.type === 'task' ? 'Công việc' : 'Hệ thống'}
                </span>
              </div>
              <p className="text-sm text-gray-600 mt-1">{item.description}</p>
              <p className="text-xs text-gray-400 mt-1">
                {formatDateTime(item.timestamp)}
                {item.performedBy && ` • ${item.performedBy}`}
              </p>
            </div>
          </div>
        ))}
      </div>

      {filteredHistory.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          Không có lịch sử phù hợp với bộ lọc
        </div>
      )}
    </div>
  )

  // ==================== MAIN RENDER ====================

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl w-[80vw] mx-4 h-[90vh] flex flex-col shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            {/* Left: Avatar + Name + Tag + View Detail */}
            <div className="flex items-center gap-4">
              {/* Avatar */}
              <div className={`w-14 h-14 rounded-full flex items-center justify-center text-white text-xl font-bold ${customer.status === 'vip' ? 'bg-purple-600' :
                customer.status === 'active' ? 'bg-green-600' :
                  customer.status === 'at-risk' ? 'bg-red-600' : 'bg-gray-600'
                }`}>
                {customer.name.charAt(0)}
              </div>

              {/* Name + Tag + View Detail */}
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="text-xl font-bold text-gray-900">{customer.name}</h2>
                  <span className={`inline-flex px-2.5 py-1 text-xs font-medium rounded-full ${customer.status === 'vip' ? 'bg-purple-100 text-purple-800' :
                    customer.status === 'active' ? 'bg-green-100 text-green-800' :
                      customer.status === 'at-risk' ? 'bg-red-100 text-red-800' :
                        customer.status === 'new' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                    {customer.status === 'vip' ? 'VIP' :
                      customer.status === 'active' ? 'Khách hàng' :
                        customer.status === 'at-risk' ? 'Cần chăm sóc' :
                          customer.status === 'new' ? 'Lead mới' : 'Đang tư vấn'}
                  </span>
                </div>
                <button
                  onClick={() => setShowInfoDetail(true)}
                  className="text-blue-600 hover:text-blue-800 text-sm hover:underline mt-1"
                >
                  Xem chi tiết...
                </button>
              </div>
            </div>

            {/* Right: Customer Info + Close Button */}
            <div className="flex items-center gap-6">
              {/* Customer Info Grid */}
              <div className="flex items-center gap-6 text-sm">
                {/* Loại khách hàng */}
                <div className="text-center">
                  <div className="text-xs text-gray-500 mb-1">Loại khách hàng</div>
                  <div className="font-medium text-gray-900">
                    {customer.customerType === 'business' || customer.customerType === 'Doanh nghiệp' ? 'Doanh nghiệp' : 'Cá nhân'}
                  </div>
                </div>
                {/* Điện thoại */}
                <div className="text-center">
                  <div className="text-xs text-gray-500 mb-1">Điện thoại</div>
                  <div className="font-medium text-gray-900">{customer.contact}</div>
                </div>
                {/* Email */}
                <div className="text-center">
                  <div className="text-xs text-gray-500 mb-1">Email</div>
                  <div className="font-medium text-gray-900">{customer.email || '-'}</div>
                </div>
                {/* Phụ trách */}
                <div className="text-center">
                  <div className="text-xs text-gray-500 mb-1">Phụ trách</div>
                  <div className="font-medium text-gray-900">{customer.assignedPerson || '-'}</div>
                </div>
              </div>

              {/* Close Button */}
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Statistics Row - Gradient cards like sales activity stages */}
          <div className="flex items-center gap-4 px-6 py-4 border-b border-gray-200 bg-gray-50">
            <div className="flex-1 min-w-0 rounded-lg px-4 py-4 bg-gradient-to-br from-blue-600 to-blue-400 text-white shadow-lg cursor-pointer transition-all hover:shadow-xl">
              <p className="text-sm font-medium text-white/90 mb-1">Tổng đơn hàng</p>
              <p className="text-2xl font-extrabold text-white">{customer.totalOrders || mockOrders.length}</p>
            </div>
            <div className="flex-1 min-w-0 rounded-lg px-4 py-4 bg-gradient-to-br from-green-600 to-green-400 text-white shadow-lg cursor-pointer transition-all hover:shadow-xl">
              <p className="text-sm font-medium text-white/90 mb-1">Tổng chi tiêu</p>
              <p className="text-2xl font-extrabold text-white">{formatCurrency(customer.totalSpent || totalOrderAmount)}</p>
            </div>
            <div className="flex-1 min-w-0 rounded-lg px-4 py-4 bg-gradient-to-br from-orange-600 to-orange-400 text-white shadow-lg cursor-pointer transition-all hover:shadow-xl">
              <p className="text-sm font-medium text-white/90 mb-1">Đơn gần nhất</p>
              <p className="text-2xl font-extrabold text-white">{customer.lastOrderDate ? formatDate(customer.lastOrderDate) : '05/02/2026'}</p>
            </div>
            <div className="flex-1 min-w-0 rounded-lg px-4 py-4 bg-gradient-to-br from-pink-600 to-pink-400 text-white shadow-lg cursor-pointer transition-all hover:shadow-xl">
              <p className="text-sm font-medium text-white/90 mb-1">Tương tác gần nhất</p>
              <p className="text-2xl font-extrabold text-white">{customer.lastInteraction ? formatDate(customer.lastInteraction) : '05/02/2026'}</p>
            </div>
            <div className="flex-1 min-w-0 rounded-lg px-4 py-4 bg-gradient-to-br from-purple-600 to-purple-400 text-white shadow-lg cursor-pointer transition-all hover:shadow-xl">
              <p className="text-sm font-medium text-white/90 mb-1">Mua gần nhất</p>
              <p className="text-2xl font-extrabold text-white">{customer.lastPurchaseDate ? formatDate(customer.lastPurchaseDate) : '05/02/2026'}</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200 px-6">
            <nav className="flex space-x-8">
              {[
                { id: 'orders', label: 'Đơn hàng', icon: Package },
                { id: 'notes', label: 'Ghi chú', icon: FileText },
                { id: 'tasks', label: 'Công việc', icon: CheckSquare },
                { id: 'history', label: 'Lịch sử', icon: History }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 py-3 px-1 border-b-2 text-sm font-medium transition-colors ${activeTab === tab.id
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

          {/* Content */}
          <div className="flex-1 overflow-auto p-6">
            {activeTab === 'orders' && renderOrdersTab()}
            {activeTab === 'notes' && renderNotesTab()}
            {activeTab === 'tasks' && renderTasksTab()}
            {activeTab === 'history' && renderHistoryTab()}
          </div>
        </div>
      </div>

      {/* Sub Dialogs */}
      <CustomerInfoDetailDialog
        isOpen={showInfoDetail}
        onClose={() => setShowInfoDetail(false)}
        customer={customer}
      />

      <EditNoteDialog
        isOpen={showEditNote}
        onClose={() => {
          setShowEditNote(false)
          setSelectedNote(null)
        }}
        note={selectedNote}
        customerName={customer.name}
        onSave={handleSaveEditedNote}
      />

      <DeleteNoteDialog
        isOpen={showDeleteNote}
        onClose={() => {
          setShowDeleteNote(false)
          setSelectedNote(null)
        }}
        onConfirm={handleConfirmDeleteNote}
      />

      <AddNoteDialog
        isOpen={showAddNote}
        onClose={() => setShowAddNote(false)}
        customerName={customer.name}
        onSave={handleAddNote}
      />

      <OrderDetailDialog
        isOpen={showOrderDetail}
        onClose={() => {
          setShowOrderDetail(false)
          setSelectedOrder(null)
        }}
        order={selectedOrder}
      />

      <TaskDetailModal
        isOpen={showTaskDetail}
        onClose={() => {
          setShowTaskDetail(false)
          setSelectedTask(null)
        }}
        task={selectedTask}
        customerName={customer.name}
      />

      <RefundDialog
        isOpen={showRefundDialog}
        onClose={() => {
          setShowRefundDialog(false)
          setSelectedOrder(null)
        }}
        order={selectedOrder}
        onSubmit={(orderId, amount, method, reason) => {
          console.log('Refund:', orderId, amount, method, reason)
          // In real app, call API to process refund
        }}
      />

      <AddOrderNoteDialog
        isOpen={showAddOrderNote}
        onClose={() => {
          setShowAddOrderNote(false)
          setSelectedOrder(null)
        }}
        order={selectedOrder}
        onSave={(orderId, content) => {
          console.log('Add order note:', orderId, content)
          // In real app, call API to add note
        }}
      />

      <AttachInvoiceDialog
        isOpen={showAttachInvoice}
        onClose={() => {
          setShowAttachInvoice(false)
          setSelectedOrder(null)
        }}
        order={selectedOrder}
        onSave={(orderId, files) => {
          console.log('Attach invoice:', orderId, files)
          // In real app, call API to upload invoices
        }}
      />
    </>
  )
}
