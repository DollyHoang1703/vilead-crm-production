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
  Save,
  Percent
} from 'lucide-react'

interface Customer {
  id: number
  name: string
  phone: string
  email: string
  company?: string
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

interface CreateOrderModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (orderData: any) => void
  customers: Customer[]
  products: Product[]
}

export default function CreateOrderModal({ 
  isOpen, 
  onClose, 
  onSave, 
  customers, 
  products 
}: CreateOrderModalProps) {
  const [formData, setFormData] = useState({
    customerId: '',
    items: [] as OrderItem[],
    status: 'draft',
    paymentStatus: 'unpaid',
    paymentMethod: 'transfer',
    discount: 0,
    discountType: 'amount', // 'amount' or 'percent'
    notes: '',
    tags: [] as string[],
    deadline: '',
    isVip: false
  })

  const [currentItem, setCurrentItem] = useState({
    productId: '',
    variantId: '',
    quantity: 1,
    notes: ''
  })

  const [showSuggestions, setShowSuggestions] = useState(false)
  const [suggestions, setSuggestions] = useState<{upsell: Product[], crosssell: Product[]}>({
    upsell: [],
    crosssell: []
  })

  const [availableTags] = useState([
    'VIP', 'Khẩn cấp', 'Chờ ký hợp đồng', 'Thanh toán trễ', 'Đơn cần duyệt'
  ])

  const [isDraft, setIsDraft] = useState(false)

  // Reset form when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setFormData({
        customerId: '',
        items: [],
        status: 'draft',
        paymentStatus: 'unpaid',
        paymentMethod: 'transfer',
        discount: 0,
        discountType: 'amount',
        notes: '',
        tags: [],
        deadline: '',
        isVip: false
      })
      setCurrentItem({
        productId: '',
        variantId: '',
        quantity: 1,
        notes: ''
      })
      setShowSuggestions(false)
    }
  }, [isOpen])

  // Calculate totals
  const calculateTotals = () => {
    const subtotal = formData.items.reduce((sum, item) => sum + item.totalPrice, 0)
    const discountAmount = formData.discountType === 'percent' 
      ? (subtotal * formData.discount / 100)
      : formData.discount
    const taxableAmount = subtotal - discountAmount
    const tax = Math.round(taxableAmount * 0.1) // 10% VAT
    const total = taxableAmount + tax

    return {
      subtotal,
      discountAmount,
      tax,
      total
    }
  }

  const totals = calculateTotals()

  // Format currency
  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('vi-VN') + ' đ'
  }

  // Handle customer selection
  const handleCustomerChange = (customerId: string) => {
    setFormData(prev => ({ ...prev, customerId }))
    const customer = customers.find(c => c.id === parseInt(customerId))
    if (customer?.type === 'lead') {
      // Auto-generate suggestions for leads
      generateSuggestions()
    }
  }

  // Generate product suggestions
  const generateSuggestions = () => {
    // Simple logic for demo - in real app this would be more sophisticated
    const upsell = products.filter(p => p.category === 'Tư vấn')
    const crosssell = products.filter(p => p.category === 'Phần mềm')
    setSuggestions({ upsell, crosssell })
    setShowSuggestions(true)
  }

  // Add product to order
  const addProduct = () => {
    if (!currentItem.productId) return

    const product = products.find(p => p.id === parseInt(currentItem.productId))
    if (!product) return

    let variant = undefined
    let unitPrice = product.basePrice

    if (currentItem.variantId) {
      variant = product.variants.find(v => v.id === parseInt(currentItem.variantId))
      if (variant) unitPrice = variant.price
    }

    const newItem: OrderItem = {
      id: Date.now(),
      productId: product.id,
      product,
      variantId: variant?.id,
      variant,
      quantity: currentItem.quantity,
      unitPrice,
      totalPrice: unitPrice * currentItem.quantity,
      notes: currentItem.notes
    }

    setFormData(prev => ({
      ...prev,
      items: [...prev.items, newItem]
    }))

    // Reset current item
    setCurrentItem({
      productId: '',
      variantId: '',
      quantity: 1,
      notes: ''
    })

    // Show suggestions if this is the first item
    if (formData.items.length === 0) {
      generateSuggestions()
    }
  }

  // Remove product from order
  const removeProduct = (itemId: number) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter(item => item.id !== itemId)
    }))
  }

  // Add suggestion to order
  const addSuggestion = (product: Product, type: 'upsell' | 'crosssell') => {
    const newItem: OrderItem = {
      id: Date.now(),
      productId: product.id,
      product,
      quantity: 1,
      unitPrice: product.basePrice,
      totalPrice: product.basePrice,
      notes: `Đề xuất ${type === 'upsell' ? 'nâng cấp' : 'bổ sung'}`
    }

    setFormData(prev => ({
      ...prev,
      items: [...prev.items, newItem]
    }))
  }

  // Handle tag toggle
  const toggleTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag]
    }))
  }

  // Save order
  const handleSave = (asDraft = false) => {
    if (!formData.customerId || formData.items.length === 0) {
      alert('Vui lòng chọn khách hàng và thêm ít nhất một sản phẩm')
      return
    }

    const orderData = {
      ...formData,
      status: asDraft ? 'draft' : formData.status,
      ...totals,
      orderNumber: `DH${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}${String(new Date().getDate()).padStart(2, '0')}${String(Date.now()).slice(-3)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    onSave(orderData)
    onClose()
  }

  if (!isOpen) return null

  const selectedCustomer = customers.find(c => c.id === parseInt(formData.customerId))
  const selectedProduct = products.find(p => p.id === parseInt(currentItem.productId))

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-screen overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Tạo đơn hàng mới</h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Customer Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Khách hàng *
              </label>
              <select
                value={formData.customerId}
                onChange={(e) => handleCustomerChange(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Chọn khách hàng</option>
                {customers.map(customer => (
                  <option key={customer.id} value={customer.id}>
                    {customer.name} - {customer.phone} ({customer.type === 'lead' ? 'Lead' : 'Khách hàng'})
                  </option>
                ))}
              </select>
              {selectedCustomer && (
                <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                  <div className="text-sm">
                    <div><strong>Email:</strong> {selectedCustomer.email}</div>
                    {selectedCustomer.company && (
                      <div><strong>Công ty:</strong> {selectedCustomer.company}</div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cài đặt đơn hàng
              </label>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Trạng thái</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                  >
                    <option value="draft">Nháp</option>
                    <option value="pending">Chờ xác nhận</option>
                    <option value="confirmed">Đã xác nhận</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Phương thức thanh toán</label>
                  <select
                    value={formData.paymentMethod}
                    onChange={(e) => setFormData(prev => ({ ...prev, paymentMethod: e.target.value }))}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                  >
                    <option value="cash">Tiền mặt</option>
                    <option value="transfer">Chuyển khoản</option>
                    <option value="card">Thẻ tín dụng/Ghi nợ</option>
                    <option value="installment">Trả góp</option>
                    <option value="momo">Momo</option>
                    <option value="custom">Tùy chỉnh</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Product Selection */}
          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Thêm sản phẩm</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sản phẩm</label>
                <select
                  value={currentItem.productId}
                  onChange={(e) => setCurrentItem(prev => ({ ...prev, productId: e.target.value, variantId: '' }))}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                >
                  <option value="">Chọn sản phẩm</option>
                  {products.map(product => (
                    <option key={product.id} value={product.id}>
                      {product.name} ({product.code})
                    </option>
                  ))}
                </select>
              </div>

              {selectedProduct && selectedProduct.variants.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Biến thể</label>
                  <select
                    value={currentItem.variantId}
                    onChange={(e) => setCurrentItem(prev => ({ ...prev, variantId: e.target.value }))}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                  >
                    <option value="">Mặc định ({formatCurrency(selectedProduct.basePrice)})</option>
                    {selectedProduct.variants.map(variant => (
                      <option key={variant.id} value={variant.id}>
                        {variant.name} ({formatCurrency(variant.price)})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Số lượng</label>
                <input
                  type="number"
                  min="1"
                  value={currentItem.quantity}
                  onChange={(e) => setCurrentItem(prev => ({ ...prev, quantity: parseInt(e.target.value) || 1 }))}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                />
              </div>

              <div className="flex items-end">
                <button
                  onClick={addProduct}
                  disabled={!currentItem.productId}
                  className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-sm"
                >
                  <Plus className="w-4 h-4 inline mr-1" />
                  Thêm
                </button>
              </div>
            </div>

            {currentItem.productId && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Ghi chú cho sản phẩm</label>
                <input
                  type="text"
                  value={currentItem.notes}
                  onChange={(e) => setCurrentItem(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Ví dụ: Khách yêu cầu tư vấn online"
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                />
              </div>
            )}
          </div>

          {/* Order Items */}
          {formData.items.length > 0 && (
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Sản phẩm đã chọn</h3>
              
              <div className="space-y-3">
                {formData.items.map((item, index) => (
                  <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">
                        {item.product.name}
                        {item.variant && (
                          <span className="text-sm text-gray-600"> - {item.variant.name}</span>
                        )}
                      </div>
                      <div className="text-sm text-gray-600">
                        {formatCurrency(item.unitPrice)} x {item.quantity} = {formatCurrency(item.totalPrice)}
                      </div>
                      {item.notes && (
                        <div className="text-sm text-blue-600">📝 {item.notes}</div>
                      )}
                    </div>
                    <button
                      onClick={() => removeProduct(item.id)}
                      className="p-1 text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Suggestions */}
          {showSuggestions && (suggestions.upsell.length > 0 || suggestions.crosssell.length > 0) && (
            <div className="border border-blue-200 rounded-lg p-4 bg-blue-50">
              <h3 className="text-lg font-medium text-blue-900 mb-4">
                <Zap className="w-5 h-5 inline mr-2" />
                Đề xuất sản phẩm
              </h3>
              
              {suggestions.upsell.length > 0 && (
                <div className="mb-4">
                  <h4 className="font-medium text-blue-800 mb-2">Nâng cấp (Upsell)</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {suggestions.upsell.map(product => (
                      <div key={product.id} className="flex items-center justify-between p-3 bg-white rounded border">
                        <div>
                          <div className="font-medium text-gray-900">{product.name}</div>
                          <div className="text-sm text-gray-600">{formatCurrency(product.basePrice)}</div>
                        </div>
                        <button
                          onClick={() => addSuggestion(product, 'upsell')}
                          className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                        >
                          Thêm
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {suggestions.crosssell.length > 0 && (
                <div>
                  <h4 className="font-medium text-blue-800 mb-2">Sản phẩm bổ sung (Cross-sell)</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {suggestions.crosssell.map(product => (
                      <div key={product.id} className="flex items-center justify-between p-3 bg-white rounded border">
                        <div>
                          <div className="font-medium text-gray-900">{product.name}</div>
                          <div className="text-sm text-gray-600">{formatCurrency(product.basePrice)}</div>
                        </div>
                        <button
                          onClick={() => addSuggestion(product, 'crosssell')}
                          className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                        >
                          Thêm
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-3 text-center">
                <button
                  onClick={() => setShowSuggestions(false)}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Ẩn đề xuất
                </button>
              </div>
            </div>
          )}

          {/* Discount and Totals */}
          {formData.items.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                {/* Discount */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Giảm giá</h3>
                  <div className="flex items-center space-x-3">
                    <input
                      type="number"
                      min="0"
                      value={formData.discount}
                      onChange={(e) => setFormData(prev => ({ ...prev, discount: parseFloat(e.target.value) || 0 }))}
                      className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm"
                      placeholder="0"
                    />
                    <select
                      value={formData.discountType}
                      onChange={(e) => setFormData(prev => ({ ...prev, discountType: e.target.value }))}
                      className="border border-gray-300 rounded px-3 py-2 text-sm"
                    >
                      <option value="amount">VNĐ</option>
                      <option value="percent">%</option>
                    </select>
                  </div>
                  {formData.discount > 0 && (
                    <div className="mt-2 text-sm text-green-600">
                      Giảm: {formatCurrency(totals.discountAmount)}
                    </div>
                  )}
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ghi chú đơn hàng
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                    rows={3}
                    placeholder="Ví dụ: Gửi hợp đồng qua Zalo, Khách cần hóa đơn gấp"
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                    maxLength={500}
                  />
                  <div className="mt-1 text-xs text-gray-500">
                    {formData.notes.length}/500 ký tự
                  </div>
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nhãn
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {availableTags.map(tag => (
                      <button
                        key={tag}
                        onClick={() => toggleTag(tag)}
                        className={`px-3 py-1 rounded text-sm border ${
                          formData.tags.includes(tag)
                            ? 'bg-blue-100 border-blue-300 text-blue-800'
                            : 'bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Deadline */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Thời hạn thanh toán
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.deadline}
                    onChange={(e) => setFormData(prev => ({ ...prev, deadline: e.target.value }))}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                  />
                </div>
              </div>

              {/* Order Summary */}
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Tổng kết đơn hàng</h3>
                
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Tạm tính:</span>
                    <span>{formatCurrency(totals.subtotal)}</span>
                  </div>
                  
                  {totals.discountAmount > 0 && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Giảm giá:</span>
                      <span>-{formatCurrency(totals.discountAmount)}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between text-sm">
                    <span>Thuế VAT (10%):</span>
                    <span>{formatCurrency(totals.tax)}</span>
                  </div>
                  
                  <div className="border-t border-gray-200 pt-3">
                    <div className="flex justify-between text-lg font-semibold">
                      <span>Tổng cộng:</span>
                      <span className="text-blue-600">{formatCurrency(totals.total)}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 text-xs text-gray-500">
                  <div>Mã đơn sẽ được tự động tạo khi lưu</div>
                  <div>Người tạo: Nguyễn Sales Manager</div>
                  <div>Thời gian: {new Date().toLocaleString('vi-VN')}</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
          <div className="text-sm text-gray-600">
            Tạo đơn nhanh từ tin nhắn Zalo/Facebook
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Hủy
            </button>
            
            <button
              onClick={() => handleSave(true)}
              disabled={!formData.customerId || formData.items.length === 0}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              <Save className="w-4 h-4" />
              <span>Lưu nháp</span>
            </button>
            
            <button
              onClick={() => handleSave(false)}
              disabled={!formData.customerId || formData.items.length === 0}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              <Check className="w-4 h-4" />
              <span>Tạo đơn hàng</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
