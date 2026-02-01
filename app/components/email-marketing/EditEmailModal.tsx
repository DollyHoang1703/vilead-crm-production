'use client'

import React, { useState, useEffect } from 'react'
import { X, AlertCircle, Users, Lock } from 'lucide-react'
import { SenderEmail, EditEmailFormData, PermissionType } from './types'
import { PERMISSION_LABELS } from './utils'
import { MOCK_USERS } from './mockData'

interface EditEmailModalProps {
  open: boolean
  onClose: () => void
  email: SenderEmail | null
  onSubmit: (id: string, data: EditEmailFormData) => Promise<{ success: boolean; message: string }>
  loading?: boolean
}

export default function EditEmailModal({ open, onClose, email, onSubmit, loading = false }: EditEmailModalProps) {
  const [formData, setFormData] = useState<EditEmailFormData>({
    sender_name: '',
    permission_type: 'all',
    permitted_user_ids: []
  })
  const [errors, setErrors] = useState<Partial<Record<keyof EditEmailFormData, string>>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Initialize form data when email changes
  useEffect(() => {
    if (email) {
      setFormData({
        sender_name: email.sender_name,
        permission_type: email.permission_type,
        permitted_user_ids: email.permitted_user_ids
      })
      setErrors({})
    }
  }, [email])

  // Validation
  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof EditEmailFormData, string>> = {}
    
    if (!formData.sender_name.trim()) {
      newErrors.sender_name = 'Vui lòng nhập tên người gửi'
    } else if (formData.sender_name.length > 100) {
      newErrors.sender_name = 'Tên người gửi không được quá 100 ký tự'
    }
    
    if (formData.permission_type === 'specific' && formData.permitted_user_ids.length === 0) {
      newErrors.permitted_user_ids = 'Vui lòng chọn ít nhất một thành viên'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!email || !validate()) return
    
    setIsSubmitting(true)
    await onSubmit(email.id, formData)
    setIsSubmitting(false)
  }

  const handleMemberToggle = (userId: string) => {
    setFormData(prev => ({
      ...prev,
      permitted_user_ids: prev.permitted_user_ids.includes(userId)
        ? prev.permitted_user_ids.filter(id => id !== userId)
        : [...prev.permitted_user_ids, userId]
    }))
  }

  if (!open || !email) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Chỉnh sửa thông tin email</h3>
          <button 
            onClick={onClose} 
            className="p-1 hover:bg-gray-100 rounded transition-colors"
            disabled={isSubmitting}
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5 overflow-y-auto flex-1">
          {/* Email Field - READONLY */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Địa chỉ Email
            </label>
            <input
              type="email"
              value={email.email}
              readOnly
              disabled
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
            />
            <p className="mt-1.5 text-xs text-gray-500 flex items-center">
              <Lock className="w-3 h-3 mr-1" />
              Không thể thay đổi địa chỉ email
            </p>
          </div>

          {/* Sender Name Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Tên người gửi <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Nhập tên bạn muốn khách hàng của mình nhìn thấy"
              value={formData.sender_name}
              onChange={(e) => {
                setFormData({ ...formData, sender_name: e.target.value })
                if (errors.sender_name) setErrors({ ...errors, sender_name: undefined })
              }}
              maxLength={100}
              className={`w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                errors.sender_name ? 'border-red-300 bg-red-50' : 'border-gray-200'
              }`}
              disabled={isSubmitting}
            />
            {errors.sender_name && (
              <p className="mt-1.5 text-sm text-red-600 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.sender_name}
              </p>
            )}
          </div>

          {/* Permission Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Quyền sử dụng Email này <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.permission_type}
              onChange={(e) => {
                const newType = e.target.value as PermissionType
                setFormData({ 
                  ...formData, 
                  permission_type: newType,
                  permitted_user_ids: newType === 'specific' ? formData.permitted_user_ids : []
                })
                if (errors.permitted_user_ids) setErrors({ ...errors, permitted_user_ids: undefined })
              }}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              disabled={isSubmitting}
            >
              <option value="all">{PERMISSION_LABELS.all}</option>
              <option value="me">{PERMISSION_LABELS.me}</option>
              <option value="specific">{PERMISSION_LABELS.specific}</option>
            </select>

            {/* Permission description */}
            <div className="mt-2 p-3 bg-gray-50 rounded-lg">
              {formData.permission_type === 'all' && (
                <div className="flex items-start text-sm text-gray-600">
                  <Users className="w-4 h-4 mr-2 mt-0.5 text-gray-400" />
                  <span>Tất cả thành viên trong dự án có thể sử dụng email này để gửi chiến dịch</span>
                </div>
              )}
              {formData.permission_type === 'me' && (
                <div className="flex items-start text-sm text-gray-600">
                  <Lock className="w-4 h-4 mr-2 mt-0.5 text-gray-400" />
                  <span>Chỉ bạn mới có thể sử dụng email này</span>
                </div>
              )}
              {formData.permission_type === 'specific' && (
                <div className="flex items-start text-sm text-gray-600">
                  <Users className="w-4 h-4 mr-2 mt-0.5 text-gray-400" />
                  <span>Chọn thành viên cụ thể được phép sử dụng email này</span>
                </div>
              )}
            </div>

            {/* Member Picker */}
            {formData.permission_type === 'specific' && (
              <div className="mt-3">
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <div className="p-3 bg-gray-50 border-b border-gray-200">
                    <span className="text-sm font-medium text-gray-700">
                      Chọn thành viên ({formData.permitted_user_ids.length} đã chọn)
                    </span>
                  </div>
                  <div className="max-h-48 overflow-y-auto p-2 space-y-1">
                    {MOCK_USERS.map(user => (
                      <label
                        key={user.id}
                        className="flex items-center p-2 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={formData.permitted_user_ids.includes(user.id)}
                          onChange={() => handleMemberToggle(user.id)}
                          className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                          disabled={isSubmitting}
                        />
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900">{user.name}</p>
                          <p className="text-xs text-gray-500">{user.email}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
                {errors.permitted_user_ids && (
                  <p className="mt-1.5 text-sm text-red-600 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.permitted_user_ids}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-4 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
            disabled={isSubmitting}
          >
            Hủy bỏ
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Đang lưu...
              </>
            ) : (
              'Lưu thay đổi'
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
