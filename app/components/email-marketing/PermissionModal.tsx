'use client'

import React, { useState, useEffect } from 'react'
import { X, Users, User, Settings, Search, CheckCircle } from 'lucide-react'
import { BrevoSenderEmail } from './types'

interface PermissionModalProps {
  open: boolean
  onClose: () => void
  sender: BrevoSenderEmail | null
  onSubmit: (
    id: string, 
    permission_type: 'all' | 'me' | 'specific', 
    permitted_user_ids: string[]
  ) => Promise<{ success: boolean; message: string }>
  loading?: boolean
}

// Mock users for permission selection
const MOCK_USERS = [
  { id: 'user-001', name: 'Nguyễn Văn Admin', email: 'admin@vilead.vn', avatar: null },
  { id: 'user-002', name: 'Trần Thị Sale', email: 'sale@vilead.vn', avatar: null },
  { id: 'user-003', name: 'Lê Văn Marketing', email: 'marketing@vilead.vn', avatar: null },
  { id: 'user-004', name: 'Phạm Thị Support', email: 'support@vilead.vn', avatar: null },
  { id: 'user-005', name: 'Hoàng Văn Dev', email: 'dev@vilead.vn', avatar: null },
  { id: 'user-006', name: 'Vũ Thị HR', email: 'hr@vilead.vn', avatar: null }
]

export default function PermissionModal({ open, onClose, sender, onSubmit, loading }: PermissionModalProps) {
  const [permissionType, setPermissionType] = useState<'all' | 'me' | 'specific'>('me')
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [error, setError] = useState<string | null>(null)

  // Initialize form when sender changes
  useEffect(() => {
    if (sender && open) {
      setPermissionType(sender.permission_type)
      setSelectedUserIds(sender.permitted_user_ids || [])
      setSearchQuery('')
      setError(null)
    }
  }, [sender, open])

  const filteredUsers = MOCK_USERS.filter(user => {
    if (searchQuery === '') return true
    return (
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })

  const toggleUserSelection = (userId: string) => {
    setSelectedUserIds(prev => 
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    )
  }

  const handleSubmit = async () => {
    if (!sender) return

    // Validate
    if (permissionType === 'specific' && selectedUserIds.length === 0) {
      setError('Vui lòng chọn ít nhất một nhân viên')
      return
    }

    setError(null)
    await onSubmit(sender.id, permissionType, selectedUserIds)
  }

  const handleSelectAll = () => {
    if (selectedUserIds.length === MOCK_USERS.length) {
      setSelectedUserIds([])
    } else {
      setSelectedUserIds(MOCK_USERS.map(u => u.id))
    }
  }

  if (!open || !sender) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 transition-opacity" onClick={onClose} />
      
      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-xl transform transition-all">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                Phân quyền sử dụng Sender
              </h3>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            {/* Sender Info */}
            <div className="mt-3 p-3 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium text-gray-900">{sender.email}</p>
              <p className="text-xs text-gray-500 mt-0.5">{sender.sender_name}</p>
            </div>
          </div>

          {/* Content */}
          <div className="px-6 py-4 space-y-4 max-h-[60vh] overflow-y-auto">
            {/* Permission Type Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phạm vi quyền
              </label>
              <div className="space-y-2">
                {/* Chỉ mình tôi */}
                <label className={`flex items-start p-3 border rounded-lg cursor-pointer transition-colors ${
                  permissionType === 'me' 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:bg-gray-50'
                }`}>
                  <input
                    type="radio"
                    name="permission_type"
                    value="me"
                    checked={permissionType === 'me'}
                    onChange={() => {
                      setPermissionType('me')
                      setSelectedUserIds([])
                    }}
                    className="w-4 h-4 text-blue-600 focus:ring-blue-500 mt-0.5"
                  />
                  <div className="ml-3">
                    <div className="flex items-center">
                      <User className="w-4 h-4 text-gray-400 mr-2" />
                      <span className="text-sm font-medium text-gray-900">Chỉ mình tôi</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Chỉ bạn có thể sử dụng sender này trong chiến dịch</p>
                  </div>
                </label>

                {/* Toàn bộ tổ chức */}
                <label className={`flex items-start p-3 border rounded-lg cursor-pointer transition-colors ${
                  permissionType === 'all' 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:bg-gray-50'
                }`}>
                  <input
                    type="radio"
                    name="permission_type"
                    value="all"
                    checked={permissionType === 'all'}
                    onChange={() => {
                      setPermissionType('all')
                      setSelectedUserIds([])
                    }}
                    className="w-4 h-4 text-blue-600 focus:ring-blue-500 mt-0.5"
                  />
                  <div className="ml-3">
                    <div className="flex items-center">
                      <Users className="w-4 h-4 text-gray-400 mr-2" />
                      <span className="text-sm font-medium text-gray-900">Toàn bộ tổ chức</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Tất cả nhân viên trong tổ chức có thể sử dụng</p>
                  </div>
                </label>

                {/* Chỉ định cụ thể */}
                <label className={`flex items-start p-3 border rounded-lg cursor-pointer transition-colors ${
                  permissionType === 'specific' 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:bg-gray-50'
                }`}>
                  <input
                    type="radio"
                    name="permission_type"
                    value="specific"
                    checked={permissionType === 'specific'}
                    onChange={() => setPermissionType('specific')}
                    className="w-4 h-4 text-blue-600 focus:ring-blue-500 mt-0.5"
                  />
                  <div className="ml-3">
                    <div className="flex items-center">
                      <Settings className="w-4 h-4 text-gray-400 mr-2" />
                      <span className="text-sm font-medium text-gray-900">Chỉ định cụ thể</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Chọn từng nhân viên được phép sử dụng</p>
                  </div>
                </label>
              </div>
            </div>

            {/* User Selection (for specific permission) */}
            {permissionType === 'specific' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700">
                    Chọn nhân viên ({selectedUserIds.length} đã chọn)
                  </label>
                  <button
                    type="button"
                    onClick={handleSelectAll}
                    className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                  >
                    {selectedUserIds.length === MOCK_USERS.length ? 'Bỏ chọn tất cả' : 'Chọn tất cả'}
                  </button>
                </div>

                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Tìm kiếm nhân viên..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                </div>

                {/* User List */}
                <div className={`border rounded-lg divide-y max-h-48 overflow-y-auto ${
                  error ? 'border-red-300' : 'border-gray-200'
                }`}>
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map(user => (
                      <label
                        key={user.id}
                        className="flex items-center p-3 cursor-pointer hover:bg-gray-50 transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={selectedUserIds.includes(user.id)}
                          onChange={() => toggleUserSelection(user.id)}
                          className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                        />
                        <div className="ml-3 flex-1 min-w-0">
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-xs font-medium text-gray-600">
                              {user.name.charAt(0)}
                            </div>
                            <div className="ml-2">
                              <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
                              <p className="text-xs text-gray-500 truncate">{user.email}</p>
                            </div>
                          </div>
                        </div>
                        {selectedUserIds.includes(user.id) && (
                          <CheckCircle className="w-4 h-4 text-blue-600 flex-shrink-0" />
                        )}
                      </label>
                    ))
                  ) : (
                    <div className="p-4 text-center text-sm text-gray-500">
                      Không tìm thấy nhân viên
                    </div>
                  )}
                </div>

                {error && (
                  <p className="text-sm text-red-600">{error}</p>
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
              onClick={handleSubmit}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center"
            >
              {loading && (
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              )}
              Lưu thay đổi
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
