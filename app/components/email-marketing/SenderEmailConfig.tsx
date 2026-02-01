'use client'

import React from 'react'
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  RefreshCw, 
  MoreVertical,
  Ban,
  CheckCircle,
  Mail
} from 'lucide-react'
import { useSenderEmails } from './hooks'
import { SenderEmailStatus } from './types'
import { formatDate, isPersonalEmail, PERMISSION_LABELS } from './utils'
import StatusBadge, { PersonalEmailWarning } from './StatusBadge'
import AddEmailModal from './AddEmailModal'
import EditEmailModal from './EditEmailModal'
import DeleteConfirmModal from './DeleteConfirmModal'

export default function SenderEmailConfig() {
  const {
    emails,
    totalFiltered,
    loading,
    filters,
    selectedEmail,
    modals,
    pagination,
    currentUser,
    updateFilters,
    toggleModal,
    setSelectedEmail,
    addEmail,
    updateEmail,
    deleteEmail,
    resendVerification,
    disableEmail,
    enableEmail,
    checkPermission,
    setPage
  } = useSenderEmails()

  const [toast, setToast] = React.useState<{ show: boolean; message: string; type: 'success' | 'error' }>({
    show: false,
    message: '',
    type: 'success'
  })

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ show: true, message, type })
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000)
  }

  const handleAddEmail = async (data: any) => {
    const result = await addEmail(data)
    if (result.success) {
      showToast(result.message, 'success')
    }
    return result
  }

  const handleUpdateEmail = async (id: string, data: any) => {
    const result = await updateEmail(id, data)
    if (result.success) {
      showToast(result.message, 'success')
    }
    return result
  }

  const handleDeleteEmail = async (id: string) => {
    const result = await deleteEmail(id)
    if (result.success) {
      showToast(result.message, 'success')
    }
    return result
  }

  const handleResendVerification = async (id: string) => {
    const result = await resendVerification(id)
    showToast(result.message, result.success ? 'success' : 'error')
  }

  const handleDisableEmail = async (id: string) => {
    const result = await disableEmail(id)
    showToast(result.message, result.success ? 'success' : 'error')
  }

  const handleEnableEmail = async (id: string) => {
    const result = await enableEmail(id)
    showToast(result.message, result.success ? 'success' : 'error')
  }

  const isAdmin = currentUser.role === 'admin'

  const statusOptions: { value: SenderEmailStatus | 'all'; label: string }[] = [
    { value: 'all', label: 'Tất cả trạng thái' },
    { value: 'activated', label: 'Đã kích hoạt' },
    { value: 'pending', label: 'Chờ xác thực' },
    { value: 'domain_unverified', label: 'Domain chưa xác thực' },
    { value: 'disabled', label: 'Đã vô hiệu hóa' }
  ]

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toast.show && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg flex items-center space-x-2 animate-slide-in ${
          toast.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
        }`}>
          {toast.type === 'success' ? (
            <CheckCircle className="w-5 h-5" />
          ) : (
            <Ban className="w-5 h-5" />
          )}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Header Actions */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">Quản lý danh sách email dùng để gửi chiến dịch</p>
        <button
          onClick={() => toggleModal('add', true)}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm mới</span>
        </button>
      </div>

      {/* Search and Filter */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm kiếm theo email, tên người gửi..."
            value={filters.search}
            onChange={(e) => updateFilters({ search: e.target.value })}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <select
          value={filters.status}
          onChange={(e) => updateFilters({ status: e.target.value as SenderEmailStatus | 'all' })}
          className="px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white min-w-[180px]"
        >
          {statusOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Email Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Người gửi
                </th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Ngày tạo
                </th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Quyền sử dụng
                </th>
                <th className="px-6 py-3.5 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {emails.map((email) => {
                const canEdit = isAdmin || email.created_by === currentUser.id
                const canDelete = isAdmin
                const canResend = email.status === 'pending'
                const canDisable = isAdmin && email.status === 'activated'
                const canEnable = isAdmin && email.status === 'disabled'
                const hasPermission = checkPermission(email)

                return (
                  <tr key={email.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className="text-sm font-medium text-gray-900">{email.email}</span>
                        {isPersonalEmail(email.email) && <PersonalEmailWarning />}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-600">{email.sender_name}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-500">
                        {formatDate(email.created_at, 'DD/MM/YYYY HH:mm')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={email.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`text-sm ${hasPermission ? 'text-green-600 font-medium' : 'text-gray-400'}`}>
                        {hasPermission ? 'Có' : 'Không'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end space-x-1">
                        {canEdit && (
                          <button
                            onClick={() => {
                              setSelectedEmail(email)
                              toggleModal('edit', true)
                            }}
                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Chỉnh sửa"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                        )}
                        
                        {/* Dropdown Menu for more actions */}
                        <div className="relative group">
                          <button
                            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>
                          <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10 hidden group-hover:block">
                            {canResend && (
                              <button
                                onClick={() => handleResendVerification(email.id)}
                                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                              >
                                <RefreshCw className="w-4 h-4 mr-3 text-gray-400" />
                                Gửi lại xác thực
                              </button>
                            )}
                            {canDisable && (
                              <button
                                onClick={() => handleDisableEmail(email.id)}
                                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                              >
                                <Ban className="w-4 h-4 mr-3 text-gray-400" />
                                Vô hiệu hóa
                              </button>
                            )}
                            {canEnable && (
                              <button
                                onClick={() => handleEnableEmail(email.id)}
                                className="w-full px-4 py-2 text-left text-sm text-green-600 hover:bg-green-50 flex items-center"
                              >
                                <CheckCircle className="w-4 h-4 mr-3" />
                                Kích hoạt lại
                              </button>
                            )}
                            {canDelete && (
                              <>
                                <div className="border-t border-gray-100 my-1"></div>
                                <button
                                  onClick={() => {
                                    setSelectedEmail(email)
                                    toggleModal('delete', true)
                                  }}
                                  className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center"
                                >
                                  <Trash2 className="w-4 h-4 mr-3" />
                                  Xóa
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {emails.length === 0 && (
          <div className="text-center py-16">
            <Mail className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 mb-2">Chưa có email người gửi nào</p>
            <p className="text-sm text-gray-400 mb-4">Thêm email để bắt đầu gửi chiến dịch</p>
            <button
              onClick={() => toggleModal('add', true)}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              + Thêm email đầu tiên
            </button>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalFiltered > 0 && (
        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>Hiển thị {emails.length} / {totalFiltered} email</span>
          {pagination.total_pages > 1 && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage(pagination.page - 1)}
                disabled={pagination.page === 1}
                className="px-3 py-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Trước
              </button>
              <span className="px-3 py-1.5">
                Trang {pagination.page} / {pagination.total_pages}
              </span>
              <button
                onClick={() => setPage(pagination.page + 1)}
                disabled={pagination.page === pagination.total_pages}
                className="px-3 py-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Sau
              </button>
            </div>
          )}
        </div>
      )}

      {/* Modals */}
      <AddEmailModal
        open={modals.add}
        onClose={() => toggleModal('add', false)}
        onSubmit={handleAddEmail}
        loading={loading}
      />

      <EditEmailModal
        open={modals.edit}
        onClose={() => {
          toggleModal('edit', false)
          setSelectedEmail(null)
        }}
        email={selectedEmail}
        onSubmit={handleUpdateEmail}
        loading={loading}
      />

      <DeleteConfirmModal
        open={modals.delete}
        onClose={() => {
          toggleModal('delete', false)
          setSelectedEmail(null)
        }}
        email={selectedEmail}
        onConfirm={handleDeleteEmail}
      />

      {/* Add CSS for toast animation */}
      <style jsx>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
      `}</style>
    </div>
  )
}
