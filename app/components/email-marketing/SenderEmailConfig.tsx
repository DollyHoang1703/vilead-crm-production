'use client'

import React, { useState, useCallback } from 'react'
import { 
  Plus, 
  Search, 
  RefreshCw, 
  MoreVertical,
  Ban,
  CheckCircle,
  Mail,
  Users,
  Settings,
  AlertTriangle,
  ExternalLink,
  Clock
} from 'lucide-react'
import { useBrevoConnection, useBrevoSenders } from './hooks'
import { BrevoSenderEmail, BrevoSenderStatus, ViLeadSenderStatus } from './types'
import { formatDate, isPersonalEmail, PERMISSION_LABELS } from './utils'
import { PersonalEmailWarning } from './StatusBadge'
import BrevoConnectionSection from './BrevoConnectionSection'
import AddSenderModal from './AddSenderModal'
import PermissionModal from './PermissionModal'

// Brevo Status Badge component
function BrevoStatusBadge({ status }: { status: BrevoSenderStatus }) {
  const statusConfig = {
    verified: { 
      label: 'Đã xác thực', 
      className: 'bg-green-100 text-green-800 border-green-200' 
    },
    pending: { 
      label: 'Chờ xác thực', 
      className: 'bg-yellow-100 text-yellow-800 border-yellow-200' 
    },
    unverified: { 
      label: 'Chưa xác thực', 
      className: 'bg-gray-100 text-gray-600 border-gray-200' 
    }
  }

  const config = statusConfig[status] || statusConfig.unverified

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${config.className}`}>
      {config.label}
    </span>
  )
}

// ViLead Status Badge component
function ViLeadStatusBadge({ status }: { status: ViLeadSenderStatus }) {
  const statusConfig = {
    active: { 
      label: 'Hoạt động', 
      className: 'bg-blue-100 text-blue-800 border-blue-200',
      icon: CheckCircle
    },
    disabled: { 
      label: 'Đã tắt', 
      className: 'bg-gray-100 text-gray-600 border-gray-200',
      icon: Ban
    }
  }

  const config = statusConfig[status] || statusConfig.active
  const Icon = config.icon

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${config.className}`}>
      <Icon className="w-3 h-3 mr-1" />
      {config.label}
    </span>
  )
}

// Permission Badge component
function PermissionBadge({ type }: { type: 'all' | 'me' | 'specific' }) {
  const config = {
    all: { label: 'Toàn bộ', className: 'text-green-600 bg-green-50', icon: Users },
    me: { label: 'Chỉ mình tôi', className: 'text-blue-600 bg-blue-50', icon: null },
    specific: { label: 'Chỉ định', className: 'text-orange-600 bg-orange-50', icon: Settings }
  }

  const { label, className, icon: Icon } = config[type]

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${className}`}>
      {Icon && <Icon className="w-3 h-3 mr-1" />}
      {label}
    </span>
  )
}

export default function SenderEmailConfig() {
  // Brevo connection hook
  const {
    connection,
    isConnected,
    hasError,
    loading: connectionLoading,
    connect,
    disconnect,
    changeApiKey,
    checkConnection
  } = useBrevoConnection()

  // Brevo senders hook
  const {
    senders,
    loading: sendersLoading,
    syncing,
    searchQuery,
    setSearchQuery,
    syncFromBrevo,
    addSender,
    updatePermission,
    toggleViLeadStatus,
    checkPermission,
    currentUser
  } = useBrevoSenders()

  // UI states
  const [toast, setToast] = useState<{ show: boolean; message: string; type: 'success' | 'error' }>({
    show: false,
    message: '',
    type: 'success'
  })
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null)
  const [modals, setModals] = useState({
    addSender: false,
    permission: false
  })
  const [selectedSender, setSelectedSender] = useState<BrevoSenderEmail | null>(null)
  const [statusFilter, setStatusFilter] = useState<'all' | BrevoSenderStatus>('all')

  const isAdmin = currentUser.role === 'admin'

  // Filter senders by status
  const filteredSenders = React.useMemo(() => {
    return senders.filter(sender => {
      if (statusFilter !== 'all' && sender.brevo_status !== statusFilter) return false
      return true
    })
  }, [senders, statusFilter])

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (!target.closest('.action-dropdown')) {
        setOpenDropdownId(null)
      }
    }
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [])

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ show: true, message, type })
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000)
  }

  const toggleModal = (modal: 'addSender' | 'permission', open: boolean) => {
    setModals(prev => ({ ...prev, [modal]: open }))
  }

  // Brevo connection handlers
  const handleConnect = async (apiKey: string) => {
    const result = await connect(apiKey)
    showToast(result.message, result.success ? 'success' : 'error')
    return result
  }

  const handleDisconnect = async () => {
    const result = await disconnect()
    showToast(result.message, result.success ? 'success' : 'error')
    return result
  }

  const handleChangeApiKey = async (apiKey: string) => {
    const result = await changeApiKey(apiKey)
    showToast(result.message, result.success ? 'success' : 'error')
    return result
  }

  const handleCheckConnection = async () => {
    const result = await checkConnection()
    showToast(result.message, result.success ? 'success' : 'error')
    return result
  }

  // Sender handlers
  const handleSyncFromBrevo = async () => {
    const result = await syncFromBrevo()
    showToast(result.message, result.success ? 'success' : 'error')
  }

  const handleAddSender = async (data: any) => {
    const result = await addSender(data)
    if (result.success) {
      showToast(result.message, 'success')
      toggleModal('addSender', false)
    } else {
      showToast(result.message, 'error')
    }
    return result
  }

  const handleUpdatePermission = async (id: string, type: 'all' | 'me' | 'specific', userIds: string[]) => {
    const result = await updatePermission(id, type, userIds)
    if (result.success) {
      showToast(result.message, 'success')
      toggleModal('permission', false)
      setSelectedSender(null)
    } else {
      showToast(result.message, 'error')
    }
    return result
  }

  const handleToggleStatus = async (id: string) => {
    const result = await toggleViLeadStatus(id)
    showToast(result.message, result.success ? 'success' : 'error')
  }

  const statusOptions = [
    { value: 'all', label: 'Tất cả trạng thái' },
    { value: 'verified', label: 'Đã xác thực (Brevo)' },
    { value: 'pending', label: 'Chờ xác thực (Brevo)' }
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

      {/* SECTION 1: Brevo Connection */}
      <BrevoConnectionSection
        connection={connection}
        onConnect={handleConnect}
        onDisconnect={handleDisconnect}
        onChangeApiKey={handleChangeApiKey}
        onCheckConnection={handleCheckConnection}
        loading={connectionLoading}
      />

      {/* SECTION 2: Sender Email Configuration */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        {/* Section Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Cấu hình email gửi</h3>
          <p className="text-sm text-gray-500 mt-1">
            Quản lý danh sách sender để gửi chiến dịch email
          </p>
        </div>

        {/* Content - depends on connection state */}
        {!isConnected ? (
          /* Not Connected State - Show info banner */
          <div className="p-8">
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-gray-400" />
              </div>
              <h4 className="text-lg font-medium text-gray-900 mb-2">
                Vui lòng kết nối Brevo để quản lý sender
              </h4>
              <p className="text-gray-500 text-sm max-w-md mx-auto mb-6">
                Sau khi kết nối Brevo, bạn có thể quản lý danh sách email sender, 
                cấp quyền sử dụng cho nhân viên và gửi chiến dịch email.
              </p>
              <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                  <span>Đồng bộ sender từ Brevo</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                  <span>Phân quyền linh hoạt</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                  <span>Xác thực email tự động</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Connected State - Show sender management */
          <div className="p-6 space-y-4">
            {/* Actions Bar */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Tìm email sender..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-72"
                  />
                </div>
                {/* Status Filter */}
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                  className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  {statusOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-3">
                {/* Refresh from Brevo button */}
                <button
                  onClick={handleSyncFromBrevo}
                  disabled={syncing}
                  className="flex items-center space-x-2 px-4 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  <RefreshCw className={`w-4 h-4 ${syncing ? 'animate-spin' : ''}`} />
                  <span>{syncing ? 'Đang cập nhật...' : 'Cập nhật từ Brevo'}</span>
                </button>
                {/* Add Sender button */}
                <button
                  onClick={() => toggleModal('addSender', true)}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>Thêm Sender mới</span>
                </button>
              </div>
            </div>

            {/* Info Alert */}
            {/* <div className="flex items-start gap-3 p-3 bg-blue-50 border border-blue-100 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p>
                  Sender được quản lý trên Brevo. ViLead chỉ đồng bộ và phân quyền sử dụng.
                </p>
                <a 
                  href="https://app.brevo.com/senders/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium mt-1"
                >
                  Quản lý sender trên Brevo
                  <ExternalLink className="w-3.5 h-3.5 ml-1" />
                </a>
              </div>
            </div> */}

            {/* Sender Table */}
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Email Sender
                    </th>
                    <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Tên người gửi
                    </th>
                    <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Trạng thái Brevo
                    </th>
                    <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Trạng thái ViLead
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
                  {filteredSenders.map((sender) => {
                    const canManagePermission = isAdmin || sender.created_by === currentUser.id
                    const canToggleStatus = isAdmin
                    const hasPermission = checkPermission(sender)

                    return (
                      <tr key={sender.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <span className="text-sm font-medium text-gray-900">{sender.email}</span>
                            {isPersonalEmail(sender.email) && <PersonalEmailWarning />}
                          </div>
                          <div className="flex items-center text-xs text-gray-400 mt-1">
                            <Clock className="w-3 h-3 mr-1" />
                            <span>Đồng bộ: {sender.synced_at ? formatDate(sender.synced_at, 'DD/MM/YYYY HH:mm') : 'Chưa đồng bộ'}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-600">{sender.sender_name}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <BrevoStatusBadge status={sender.brevo_status} />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <ViLeadStatusBadge status={sender.vilead_status} />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <PermissionBadge type={sender.permission_type} />
                          {!hasPermission && (
                            <span className="ml-2 text-xs text-gray-400">(Không có quyền)</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="flex items-center justify-end">
                            <div className="relative action-dropdown">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  setOpenDropdownId(openDropdownId === sender.id ? null : sender.id)
                                }}
                                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                              >
                                <MoreVertical className="w-4 h-4" />
                              </button>
                              {openDropdownId === sender.id && (
                                <div className="absolute right-0 mt-1 w-52 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                                  {/* Phân quyền sử dụng */}
                                  {canManagePermission && (
                                    <button
                                      onClick={() => {
                                        setSelectedSender(sender)
                                        toggleModal('permission', true)
                                        setOpenDropdownId(null)
                                      }}
                                      className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                                    >
                                      <Users className="w-4 h-4 mr-3 text-gray-400" />
                                      Phân quyền sử dụng
                                    </button>
                                  )}
                                  
                                  {/* Vô hiệu hóa / Kích hoạt */}
                                  {canToggleStatus && (
                                    <button
                                      onClick={() => {
                                        handleToggleStatus(sender.id)
                                        setOpenDropdownId(null)
                                      }}
                                      className={`w-full px-4 py-2 text-left text-sm flex items-center ${
                                        sender.vilead_status === 'active' 
                                          ? 'text-gray-700 hover:bg-gray-50' 
                                          : 'text-green-600 hover:bg-green-50'
                                      }`}
                                    >
                                      {sender.vilead_status === 'active' ? (
                                        <>
                                          <Ban className="w-4 h-4 mr-3 text-gray-400" />
                                          Vô hiệu hóa trên ViLead
                                        </>
                                      ) : (
                                        <>
                                          <CheckCircle className="w-4 h-4 mr-3" />
                                          Kích hoạt lại
                                        </>
                                      )}
                                    </button>
                                  )}

                                  {/* Divider */}
                                  <div className="border-t border-gray-100 my-1"></div>

                                  {/* Link to Brevo */}
                                  <a
                                    href={`https://app.brevo.com/senders/`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={() => setOpenDropdownId(null)}
                                    className="w-full px-4 py-2 text-left text-sm text-gray-500 hover:bg-gray-50 flex items-center"
                                  >
                                    <ExternalLink className="w-4 h-4 mr-3 text-gray-400" />
                                    Quản lý trên Brevo
                                  </a>
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>

              {/* Empty State */}
              {filteredSenders.length === 0 && (
                <div className="text-center py-12">
                  <Mail className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 mb-2">Chưa có sender nào</p>
                  <p className="text-sm text-gray-400 mb-4">
                    Thêm sender mới hoặc đồng bộ từ Brevo
                  </p>
                  <div className="flex items-center justify-center gap-3">
                    <button
                      onClick={handleSyncFromBrevo}
                      disabled={syncing}
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center"
                    >
                      <RefreshCw className={`w-4 h-4 mr-1 ${syncing ? 'animate-spin' : ''}`} />
                      Đồng bộ từ Brevo
                    </button>
                    <span className="text-gray-300">|</span>
                    <button
                      onClick={() => toggleModal('addSender', true)}
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                    >
                      + Thêm sender mới
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Result count */}
            {filteredSenders.length > 0 && (
              <div className="text-sm text-gray-500">
                Hiển thị {filteredSenders.length} sender
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modals */}
      <AddSenderModal
        open={modals.addSender}
        onClose={() => toggleModal('addSender', false)}
        onSubmit={handleAddSender}
        loading={sendersLoading}
      />

      <PermissionModal
        open={modals.permission}
        onClose={() => {
          toggleModal('permission', false)
          setSelectedSender(null)
        }}
        sender={selectedSender}
        onSubmit={handleUpdatePermission}
        loading={sendersLoading}
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
