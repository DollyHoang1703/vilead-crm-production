'use client'

import React, { useState, useEffect } from 'react'
import { X, Mail, User, AlertTriangle, ExternalLink, Info, CheckCircle } from 'lucide-react'

interface AddSenderModalProps {
  open: boolean
  onClose: () => void
  onSubmit: (data: {
    email: string
    sender_name: string
    permission_type: 'all' | 'me' | 'specific'
    permitted_user_ids: string[]
  }) => Promise<{ success: boolean; message: string }>
  loading?: boolean
}

// Mock users for permission selection
const MOCK_USERS = [
  { id: 'user-001', name: 'Nguyễn Văn Admin', email: 'admin@vilead.vn' },
  { id: 'user-002', name: 'Trần Thị Sale', email: 'sale@vilead.vn' },
  { id: 'user-003', name: 'Lê Văn Marketing', email: 'marketing@vilead.vn' },
  { id: 'user-004', name: 'Phạm Thị Support', email: 'support@vilead.vn' }
]

export default function AddSenderModal({ open, onClose, onSubmit, loading }: AddSenderModalProps) {
  const [formData, setFormData] = useState({
    email: '',
    sender_name: '',
    permission_type: 'me' as 'all' | 'me' | 'specific',
    permitted_user_ids: [] as string[]
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitted, setSubmitted] = useState(false)

  // Reset form when modal opens
  useEffect(() => {
    if (open) {
      setFormData({
        email: '',
        sender_name: '',
        permission_type: 'me',
        permitted_user_ids: []
      })
      setErrors({})
      setSubmitted(false)
    }
  }, [open])

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const isPersonalEmail = (email: string): boolean => {
    const personalDomains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'icloud.com']
    const domain = email.split('@')[1]?.toLowerCase()
    return personalDomains.includes(domain)
  }

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.email.trim()) {
      newErrors.email = 'Vui lòng nhập email'
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Email không hợp lệ'
    }

    if (!formData.sender_name.trim()) {
      newErrors.sender_name = 'Vui lòng nhập tên người gửi'
    }

    if (formData.permission_type === 'specific' && formData.permitted_user_ids.length === 0) {
      newErrors.permitted_user_ids = 'Vui lòng chọn ít nhất một nhân viên'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validate()) return

    const result = await onSubmit(formData)
    if (result.success) {
      setSubmitted(true)
    }
  }

  const toggleUserSelection = (userId: string) => {
    setFormData(prev => ({
      ...prev,
      permitted_user_ids: prev.permitted_user_ids.includes(userId)
        ? prev.permitted_user_ids.filter(id => id !== userId)
        : [...prev.permitted_user_ids, userId]
    }))
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 transition-opacity" onClick={onClose} />
      
      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-xl transform transition-all">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              Thêm Sender mới
            </h3>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          {submitted ? (
            /* Success State */
            <div className="px-6 py-8 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">
                Đã gửi yêu cầu xác thực!
              </h4>
              <p className="text-sm text-gray-600 mb-4">
                Brevo đã gửi email xác thực đến <span className="font-medium">{formData.email}</span>. 
                Vui lòng kiểm tra hộp thư (hoặc spam) và nhấn link xác thực.
              </p>
              <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 text-left">
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-blue-800">
                    <p className="font-medium mb-1">Lưu ý:</p>
                    <ul className="list-disc list-inside space-y-1 text-blue-700">
                      <li>Kiểm tra cả thư mục Spam/Junk</li>
                      <li>Link xác thực có hiệu lực 24 giờ</li>
                      <li>Sau khi xác thực, nhấn nút "Cập nhật từ Brevo" để đồng bộ</li>
                    </ul>
                  </div>
                </div>
              </div>
              <button
                onClick={onClose}
                className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Đóng
              </button>
            </div>
          ) : (
            /* Form State */
            <form onSubmit={handleSubmit}>
              <div className="px-6 py-4 space-y-5 max-h-[60vh] overflow-y-auto">
                {/* Info Alert */}
                <div className="flex items-start gap-3 p-3 bg-yellow-50 border border-yellow-100 rounded-lg">
                  <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-yellow-800">
                    <p>
                      Sender sẽ được tạo trên Brevo và cần xác thực qua email. 
                      <a 
                        href="https://help.brevo.com/hc/en-us/articles/12027135169554-Add-and-verify-a-sender"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-yellow-700 hover:text-yellow-800 font-medium ml-1"
                      >
                        Tìm hiểu thêm
                        <ExternalLink className="w-3.5 h-3.5 ml-1" />
                      </a>
                    </p>
                  </div>
                </div>

                {/* Email Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="sender@company.com"
                      className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.email ? 'border-red-300 bg-red-50' : 'border-gray-200'
                      }`}
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                  )}
                  {formData.email && isPersonalEmail(formData.email) && !errors.email && (
                    <div className="mt-1.5 flex items-center text-sm text-amber-600">
                      <AlertTriangle className="w-4 h-4 mr-1" />
                      <span>Nên sử dụng email doanh nghiệp thay vì email cá nhân</span>
                    </div>
                  )}
                </div>

                {/* Sender Name Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Tên người gửi <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={formData.sender_name}
                      onChange={(e) => setFormData(prev => ({ ...prev, sender_name: e.target.value }))}
                      placeholder="VD: Phòng Kinh Doanh"
                      className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.sender_name ? 'border-red-300 bg-red-50' : 'border-gray-200'
                      }`}
                    />
                  </div>
                  {errors.sender_name && (
                    <p className="mt-1 text-sm text-red-600">{errors.sender_name}</p>
                  )}
                </div>

                {/* Permission Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quyền sử dụng sender
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                      <input
                        type="radio"
                        name="permission_type"
                        value="me"
                        checked={formData.permission_type === 'me'}
                        onChange={() => setFormData(prev => ({ ...prev, permission_type: 'me', permitted_user_ids: [] }))}
                        className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                      />
                      <div className="ml-3">
                        <span className="text-sm font-medium text-gray-900">Chỉ mình tôi</span>
                        <p className="text-xs text-gray-500">Chỉ bạn có thể sử dụng sender này</p>
                      </div>
                    </label>
                    
                    <label className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                      <input
                        type="radio"
                        name="permission_type"
                        value="all"
                        checked={formData.permission_type === 'all'}
                        onChange={() => setFormData(prev => ({ ...prev, permission_type: 'all', permitted_user_ids: [] }))}
                        className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                      />
                      <div className="ml-3">
                        <span className="text-sm font-medium text-gray-900">Toàn bộ tổ chức</span>
                        <p className="text-xs text-gray-500">Tất cả nhân viên có thể sử dụng</p>
                      </div>
                    </label>
                    
                    <label className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                      <input
                        type="radio"
                        name="permission_type"
                        value="specific"
                        checked={formData.permission_type === 'specific'}
                        onChange={() => setFormData(prev => ({ ...prev, permission_type: 'specific' }))}
                        className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                      />
                      <div className="ml-3">
                        <span className="text-sm font-medium text-gray-900">Chỉ định cụ thể</span>
                        <p className="text-xs text-gray-500">Chọn nhân viên được phép sử dụng</p>
                      </div>
                    </label>
                  </div>
                </div>

                {/* User Selection (for specific permission) */}
                {formData.permission_type === 'specific' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Chọn nhân viên <span className="text-red-500">*</span>
                    </label>
                    <div className={`border rounded-lg divide-y ${
                      errors.permitted_user_ids ? 'border-red-300' : 'border-gray-200'
                    }`}>
                      {MOCK_USERS.map(user => (
                        <label
                          key={user.id}
                          className="flex items-center p-3 cursor-pointer hover:bg-gray-50 transition-colors"
                        >
                          <input
                            type="checkbox"
                            checked={formData.permitted_user_ids.includes(user.id)}
                            onChange={() => toggleUserSelection(user.id)}
                            className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                          />
                          <div className="ml-3">
                            <span className="text-sm font-medium text-gray-900">{user.name}</span>
                            <span className="text-xs text-gray-500 ml-2">{user.email}</span>
                          </div>
                        </label>
                      ))}
                    </div>
                    {errors.permitted_user_ids && (
                      <p className="mt-1 text-sm text-red-600">{errors.permitted_user_ids}</p>
                    )}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center"
                >
                  {loading && (
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  )}
                  Thêm Sender
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
