'use client'

import { useState } from 'react'
import { 
  X,
  Edit,
  Info,
  FileText,
  Receipt,
  Trash2,
  MoreVertical
} from 'lucide-react'

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

interface OrderNote {
  id: string
  content: string
  createdAt: string
  createdBy: string
}

interface Order {
  id: number
  orderNumber: string
  customerId: number
  customer: any
  items: any[]
  subtotal: number
  discount: number
  tax: number
  total: number
  status: string
  paymentStatus: string
  paymentMethod: string
  paymentMode?: 'full' | 'installment'
  installments?: any[]
  totalPaid?: number
  remainingDebt?: number
  notes: any[]
  invoices: any[]
  tags: string[]
  createdAt: string
  createdBy: string
  updatedAt: string
  history: any[]
  zaloMessages: any[]
  deadline?: string
  remindersSent: number
  isVip: boolean
  upsellSuggestions?: any[]
  crosssellSuggestions?: any[]
}

interface OrderDetailModalProps {
  isOpen: boolean
  onClose: () => void
  order: Order | null
  onUpdate: (orderId: number, updates: any) => void
}

export default function OrderDetailModal({ 
  isOpen, 
  onClose, 
  order, 
  onUpdate 
}: OrderDetailModalProps) {
  const [activeTab, setActiveTab] = useState<'info' | 'invoices' | 'notes'>('info')
  const [invoiceActionMenu, setInvoiceActionMenu] = useState<string | null>(null)
  const [noteActionMenu, setNoteActionMenu] = useState<string | null>(null)
  const [showEditInvoice, setShowEditInvoice] = useState(false)
  const [showDeleteInvoice, setShowDeleteInvoice] = useState(false)
  const [showEditNote, setShowEditNote] = useState(false)
  const [showDeleteNote, setShowDeleteNote] = useState(false)
  const [selectedInvoice, setSelectedInvoice] = useState<OrderInvoice | null>(null)
  const [selectedNote, setSelectedNote] = useState<OrderNote | null>(null)
  const [editNoteContent, setEditNoteContent] = useState('')

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

  const orderItems: OrderItem[] = order.items?.map((item: any, index: number) => ({
    id: index + 1,
    productName: item.product?.name || item.productName || 'Sản phẩm ' + (index + 1),
    productPackage: item.variant?.name || item.productPackage || '1',
    quantity: item.quantity || 1,
    price: item.unitPrice || item.price || 0,
    total: item.totalPrice || item.total || 0,
    paymentStatus: order.paymentStatus === 'paid' ? 'paid' : order.paymentStatus === 'partial' ? 'partial' : 'unpaid'
  })) || [
    { id: 1, productName: 'NETCore', productPackage: '1', quantity: 1, price: 10000, total: 10000, paymentStatus: 'paid' as const },
    { id: 2, productName: 'HRMCort', productPackage: '2', quantity: 1, price: 20000, total: 40000, paymentStatus: 'partial' as const },
  ]

  const mockInvoices: OrderInvoice[] = order.invoices?.length > 0 
    ? order.invoices.map((inv: any) => ({
        id: inv.id?.toString() || String(Math.random()),
        fileName: inv.fileName || inv.name || 'invoice.png',
        fileSize: inv.fileSize || inv.size || 1000000,
        fileType: inv.fileType || inv.type || 'image/png',
        uploadedAt: inv.uploadedAt || inv.createdAt || new Date().toISOString(),
        thumbnailUrl: inv.thumbnailUrl || ''
      }))
    : [
        { id: '1', fileName: '028d0cad-e7b5-4e85-94bc-92a0003a71c2.png', fileSize: 1240000, fileType: 'image/png', uploadedAt: '2026-02-26T00:53:00', thumbnailUrl: '' },
        { id: '2', fileName: '81686d2f-77ae-478b-8165-76fbf9269dc3.png', fileSize: 997070, fileType: 'image/png', uploadedAt: '2026-02-26T00:53:00', thumbnailUrl: '' },
      ]

  const mockNotes: OrderNote[] = order.notes?.length > 0
    ? order.notes.map((note: any) => ({
        id: note.id?.toString() || String(Math.random()),
        content: note.content || '',
        createdAt: note.createdAt || new Date().toISOString(),
        createdBy: note.createdBy || 'System'
      }))
    : [
        { id: '1', content: 'Khách hàng yêu cầu giao hàng vào buổi sáng', createdAt: '2026-02-20T10:30:00', createdBy: 'Nguyễn Văn A' },
      ]

  const subtotal = order.subtotal || orderItems.reduce((sum, item) => sum + item.total, 0)
  const discount = order.discount || 0
  const vat = order.tax || Math.round(subtotal * 0.1)
  const grandTotal = order.total || (subtotal - discount + vat)

  const tabs = [
    { id: 'info', label: 'Thông tin', icon: <Info className="w-4 h-4" /> },
    { id: 'invoices', label: 'Hóa đơn', icon: <Receipt className="w-4 h-4" /> },
    { id: 'notes', label: 'Ghi chú', icon: <FileText className="w-4 h-4" /> },
  ]

  const handleEditNote = (note: OrderNote) => {
    setSelectedNote(note)
    setEditNoteContent(note.content)
    setShowEditNote(true)
    setNoteActionMenu(null)
  }

  const handleSaveNote = () => {
    if (selectedNote && editNoteContent.trim()) {
      const updatedNotes = order.notes.map((n: any) => 
        n.id === selectedNote.id ? { ...n, content: editNoteContent } : n
      )
      onUpdate(order.id, { notes: updatedNotes })
      setShowEditNote(false)
      setSelectedNote(null)
      setEditNoteContent('')
    }
  }

  const handleDeleteNote = () => {
    if (selectedNote) {
      const updatedNotes = order.notes.filter((n: any) => n.id !== selectedNote.id)
      onUpdate(order.id, { notes: updatedNotes })
      setShowDeleteNote(false)
      setSelectedNote(null)
    }
  }

  const handleDeleteInvoice = () => {
    if (selectedInvoice) {
      const updatedInvoices = order.invoices.filter((inv: any) => inv.id !== selectedInvoice.id)
      onUpdate(order.id, { invoices: updatedInvoices })
      setShowDeleteInvoice(false)
      setSelectedInvoice(null)
    }
  }

  const renderInfoTab = () => (
    <div className="space-y-4">
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
                  <span className={'inline-flex px-2 py-1 text-xs font-medium rounded-full ' + getPaymentStatusColor(item.paymentStatus)}>
                    {getPaymentStatusText(item.paymentStatus)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
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
                        <span className="text-lg">{''}</span>
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
        <div className="text-center py-8 text-gray-500">Chưa có hóa đơn nào</div>
      )}
    </div>
  )

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
                        onClick={() => handleEditNote(note)}
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
        <div className="text-center py-8 text-gray-500">Chưa có ghi chú nào</div>
      )}
    </div>
  )

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl w-full max-w-3xl shadow-2xl max-h-[90vh] flex flex-col">
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <Info className="w-5 h-5 text-blue-500" />
              <h3 className="font-semibold text-gray-900">Chi tiết đơn hàng - {order.orderNumber}</h3>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="border-b border-gray-200 px-4">
            <nav className="flex space-x-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as 'info' | 'invoices' | 'notes')}
                  className={'flex items-center gap-2 py-3 px-1 border-b-2 text-sm font-medium transition-colors ' + (
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  )}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>

          <div className="p-4 overflow-y-auto flex-1">
            {activeTab === 'info' && renderInfoTab()}
            {activeTab === 'invoices' && renderInvoicesTab()}
            {activeTab === 'notes' && renderNotesTab()}
          </div>

          <div className="flex justify-end gap-2 p-4 border-t border-gray-200 bg-gray-50 rounded-b-xl">
            <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg">
              Đóng
            </button>
          </div>
        </div>
      </div>

      {showEditInvoice && selectedInvoice && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]">
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Chọn file mới</label>
                <input type="file" accept="image/*,.pdf" className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 p-4 border-t border-gray-200">
              <button onClick={() => setShowEditInvoice(false)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">Hủy</button>
              <button onClick={() => setShowEditInvoice(false)} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700">Lưu thay đổi</button>
            </div>
          </div>
        </div>
      )}

      {showDeleteInvoice && selectedInvoice && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]">
          <div className="bg-white rounded-lg w-full max-w-sm mx-4 shadow-xl">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Xác nhận xóa</h3>
              <p className="text-sm text-gray-600">Bạn có chắc chắn muốn xóa hóa đơn "{selectedInvoice.fileName}"? Hành động này không thể hoàn tác.</p>
            </div>
            <div className="flex items-center justify-end gap-3 p-4 border-t border-gray-200">
              <button onClick={() => setShowDeleteInvoice(false)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">Hủy</button>
              <button onClick={handleDeleteInvoice} className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700">Xóa</button>
            </div>
          </div>
        </div>
      )}

      {showEditNote && selectedNote && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]">
          <div className="bg-white rounded-lg w-full max-w-md mx-4 shadow-xl">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Sửa ghi chú</h3>
              <button onClick={() => setShowEditNote(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Nội dung ghi chú <span className="text-red-500">*</span></label>
              <textarea value={editNoteContent} onChange={(e) => setEditNoteContent(e.target.value)} rows={4} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none" placeholder="Nhập nội dung ghi chú..." />
            </div>
            <div className="flex items-center justify-end gap-3 p-4 border-t border-gray-200">
              <button onClick={() => setShowEditNote(false)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">Hủy</button>
              <button onClick={handleSaveNote} disabled={!editNoteContent.trim()} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed">Lưu thay đổi</button>
            </div>
          </div>
        </div>
      )}

      {showDeleteNote && selectedNote && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]">
          <div className="bg-white rounded-lg w-full max-w-sm mx-4 shadow-xl">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Xác nhận xóa</h3>
              <p className="text-sm text-gray-600">Bạn có chắc chắn muốn xóa ghi chú này? Hành động này không thể hoàn tác.</p>
            </div>
            <div className="flex items-center justify-end gap-3 p-4 border-t border-gray-200">
              <button onClick={() => setShowDeleteNote(false)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">Hủy</button>
              <button onClick={handleDeleteNote} className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700">Xóa</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
