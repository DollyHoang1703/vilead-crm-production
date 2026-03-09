'use client'

import React, { useState } from 'react'
import { 
  Link2, 
  ExternalLink, 
  Eye, 
  EyeOff, 
  RefreshCw, 
  AlertTriangle,
  CheckCircle,
  X,
  Loader2
} from 'lucide-react'
import { BrevoConnection, BrevoConnectionStatus, BrevoPlan } from './types'
import { formatDate } from './utils'

interface BrevoConnectionSectionProps {
  connection: BrevoConnection | null
  onConnect: (apiKey: string) => Promise<{ success: boolean; message: string }>
  onDisconnect: () => Promise<{ success: boolean; message: string }>
  onChangeApiKey: (apiKey: string) => Promise<{ success: boolean; message: string }>
  onCheckConnection: () => Promise<{ success: boolean; message: string }>
  loading?: boolean
}

// Badge styles based on connection status
const getStatusBadgeStyle = (status: BrevoConnectionStatus | 'not_connected') => {
  switch (status) {
    case 'connected':
      return 'bg-green-100 text-green-700'
    case 'error':
      return 'bg-yellow-100 text-yellow-700'
    case 'not_connected':
    default:
      return 'bg-red-100 text-red-600'
  }
}

const getStatusText = (status: BrevoConnectionStatus | 'not_connected') => {
  switch (status) {
    case 'connected':
      return 'Đã kết nối Brevo ✔'
    case 'error':
      return 'Lỗi kết nối'
    case 'not_connected':
    default:
      return 'Chưa kết nối'
  }
}

// Badge style based on Brevo plan
const getPlanBadgeStyle = (plan: BrevoPlan) => {
  switch (plan) {
    case 'free':
      return 'bg-gray-100 text-gray-700'
    case 'starter':
      return 'bg-blue-100 text-blue-700'
    case 'business':
      return 'bg-purple-100 text-purple-700'
    case 'enterprise':
      return 'bg-amber-100 text-amber-700'
    default:
      return 'bg-gray-100 text-gray-700'
  }
}

const getPlanText = (plan: BrevoPlan) => {
  switch (plan) {
    case 'free':
      return 'Free'
    case 'starter':
      return 'Starter'
    case 'business':
      return 'Business'
    case 'enterprise':
      return 'Enterprise'
    default:
      return plan
  }
}

export default function BrevoConnectionSection({
  connection,
  onConnect,
  onDisconnect,
  onChangeApiKey,
  onCheckConnection,
  loading = false
}: BrevoConnectionSectionProps) {
  const [apiKeyInput, setApiKeyInput] = useState('')
  const [showApiKey, setShowApiKey] = useState(false)
  const [showFullApiKey, setShowFullApiKey] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [isConnecting, setIsConnecting] = useState(false)
  const [isDisconnecting, setIsDisconnecting] = useState(false)
  const [isChecking, setIsChecking] = useState(false)
  const [showChangeApiKeyForm, setShowChangeApiKeyForm] = useState(false)
  const [showDisconnectConfirm, setShowDisconnectConfirm] = useState(false)

  const status: BrevoConnectionStatus | 'not_connected' = connection?.status || 'not_connected'

  const handleConnect = async () => {
    if (!apiKeyInput.trim()) return
    
    setIsConnecting(true)
    setErrorMessage('')
    
    try {
      const result = await onConnect(apiKeyInput.trim())
      if (!result.success) {
        setErrorMessage(result.message)
      } else {
        setApiKeyInput('')
      }
    } catch {
      setErrorMessage('Không thể kết nối Brevo. Vui lòng thử lại.')
    } finally {
      setIsConnecting(false)
    }
  }

  const handleDisconnect = async () => {
    setIsDisconnecting(true)
    try {
      await onDisconnect()
      setShowDisconnectConfirm(false)
    } finally {
      setIsDisconnecting(false)
    }
  }

  const handleChangeApiKey = async () => {
    if (!apiKeyInput.trim()) return
    
    setIsConnecting(true)
    setErrorMessage('')
    
    try {
      const result = await onChangeApiKey(apiKeyInput.trim())
      if (!result.success) {
        setErrorMessage(result.message)
      } else {
        setApiKeyInput('')
        setShowChangeApiKeyForm(false)
      }
    } catch {
      setErrorMessage('Không thể kết nối Brevo. Vui lòng thử lại.')
    } finally {
      setIsConnecting(false)
    }
  }

  const handleCheckConnection = async () => {
    setIsChecking(true)
    try {
      await onCheckConnection()
    } finally {
      setIsChecking(false)
    }
  }

  // Render Not Connected State
  const renderNotConnectedState = () => (
    <div className="space-y-5">
      {/* Instructions Card */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-5">
        <div className="flex items-start space-x-3">
          <Link2 className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium text-blue-900 mb-3">Hướng dẫn kết nối Brevo</h4>
            <div className="space-y-2 text-sm text-blue-800">
              <p><span className="font-medium">Bước 1:</span> Đăng ký tài khoản Brevo miễn phí</p>
              <a 
                href="https://app.brevo.com/account/register"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-blue-600 hover:text-blue-700 hover:underline ml-14"
              >
                Đăng ký Brevo <ExternalLink className="w-3.5 h-3.5 ml-1" />
              </a>
              <p><span className="font-medium">Bước 2:</span> Vào SMTP & API → API Keys → Tạo key mới</p>
              <p><span className="font-medium">Bước 3:</span> Sao chép API Key và dán vào ô bên dưới</p>
            </div>
          </div>
        </div>
      </div>

      {/* API Key Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Brevo API Key <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <input
            type={showApiKey ? 'text' : 'password'}
            value={apiKeyInput}
            onChange={(e) => {
              setApiKeyInput(e.target.value)
              setErrorMessage('')
            }}
            placeholder="xkeysib-xxxxxx..."
            className={`w-full px-4 py-2.5 pr-10 border rounded-lg font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errorMessage ? 'border-red-300' : 'border-gray-200'
            }`}
          />
          <button
            type="button"
            onClick={() => setShowApiKey(!showApiKey)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        {errorMessage && (
          <p className="mt-1.5 text-sm text-red-600">{errorMessage}</p>
        )}
      </div>

      {/* Connect Button */}
      <button
        onClick={handleConnect}
        disabled={!apiKeyInput.trim() || isConnecting}
        className={`flex items-center justify-center space-x-2 px-5 py-2.5 rounded-lg font-medium transition-colors ${
          apiKeyInput.trim() && !isConnecting
            ? 'bg-blue-600 text-white hover:bg-blue-700'
            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
        }`}
      >
        {isConnecting ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Đang kết nối...</span>
          </>
        ) : (
          <span>Kết nối</span>
        )}
      </button>
    </div>
  )

  // Render Connected State
  const renderConnectedState = () => (
    <div className="bg-white border border-gray-200 rounded-lg p-5">
      {showChangeApiKeyForm ? (
        // Change API Key Form
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-medium text-gray-900">Đổi API Key</h4>
            <button
              onClick={() => {
                setShowChangeApiKeyForm(false)
                setApiKeyInput('')
                setErrorMessage('')
              }}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="relative">
            <input
              type={showApiKey ? 'text' : 'password'}
              value={apiKeyInput}
              onChange={(e) => {
                setApiKeyInput(e.target.value)
                setErrorMessage('')
              }}
              placeholder="xkeysib-xxxxxx..."
              className={`w-full px-4 py-2.5 pr-10 border rounded-lg font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errorMessage ? 'border-red-300' : 'border-gray-200'
              }`}
            />
            <button
              type="button"
              onClick={() => setShowApiKey(!showApiKey)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errorMessage && (
            <p className="text-sm text-red-600">{errorMessage}</p>
          )}
          
          <div className="flex items-center space-x-3">
            <button
              onClick={() => {
                setShowChangeApiKeyForm(false)
                setApiKeyInput('')
                setErrorMessage('')
              }}
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Hủy
            </button>
            <button
              onClick={handleChangeApiKey}
              disabled={!apiKeyInput.trim() || isConnecting}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                apiKeyInput.trim() && !isConnecting
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              {isConnecting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Đang kết nối...</span>
                </>
              ) : (
                <span>Lưu API Key mới</span>
              )}
            </button>
          </div>
        </div>
      ) : (
        // Connection Info
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-y-3 text-sm">
            <div className="text-gray-500 font-medium">Tên công ty</div>
            <div className="text-gray-900">{connection?.brevo_company_name}</div>
            
            <div className="text-gray-500 font-medium">Email chủ TK</div>
            <div className="text-gray-900">{connection?.brevo_email}</div>
            
            <div className="text-gray-500 font-medium">Plan hiện tại</div>
            <div>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                getPlanBadgeStyle(connection?.brevo_plan || 'free')
              }`}>
                {getPlanText(connection?.brevo_plan || 'free')}
              </span>
            </div>
            
            <div className="text-gray-500 font-medium">API Key</div>
            <div className="flex items-center space-x-2">
              <span className="font-mono text-gray-900 text-xs">
                {showFullApiKey ? 'xkeysib-abc...xyz123' : connection?.api_key_masked}
              </span>
              <button
                onClick={() => setShowFullApiKey(!showFullApiKey)}
                className="text-gray-400 hover:text-gray-600"
              >
                {showFullApiKey ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>
            
            <div className="text-gray-500 font-medium">Ngày kết nối</div>
            <div className="text-gray-900">
              {connection?.connected_at ? formatDate(connection.connected_at, 'DD/MM/YYYY') : '-'}
            </div>
            
            <div className="text-gray-500 font-medium">Kiểm tra cuối</div>
            <div className="text-gray-900">
              {connection?.last_check_at ? formatDate(connection.last_check_at, 'DD/MM/YYYY HH:mm') : '-'}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-3 pt-2">
            <button
              onClick={() => setShowChangeApiKeyForm(true)}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
            >
              Đổi API Key
            </button>
            <button
              onClick={() => setShowDisconnectConfirm(true)}
              className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors text-sm font-medium"
            >
              NGẮT KẾT NỐI
            </button>
          </div>
        </div>
      )}
    </div>
  )

  // Render Error State
  const renderErrorState = () => (
    <div className="space-y-4">
      {/* Warning Alert */}
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg">
        <div className="flex items-start space-x-3">
          <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-yellow-800 font-medium">Không thể kết nối Brevo</p>
            <p className="text-yellow-700 text-sm mt-1">
              API Key có thể đã bị hủy. Vui lòng kiểm tra tại Brevo dashboard.
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center space-x-3">
        <button
          onClick={handleCheckConnection}
          disabled={isChecking}
          className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
        >
          {isChecking ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Đang kiểm tra...</span>
            </>
          ) : (
            <>
              <RefreshCw className="w-4 h-4" />
              <span>Kiểm tra lại</span>
            </>
          )}
        </button>
        <button
          onClick={() => setShowChangeApiKeyForm(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
        >
          Đổi API Key
        </button>
      </div>

      {/* Change API Key Form (if shown) */}
      {showChangeApiKeyForm && (
        <div className="bg-white border border-gray-200 rounded-lg p-5 mt-4">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-medium text-gray-900">Nhập API Key mới</h4>
            <button
              onClick={() => {
                setShowChangeApiKeyForm(false)
                setApiKeyInput('')
                setErrorMessage('')
              }}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="relative mb-3">
            <input
              type={showApiKey ? 'text' : 'password'}
              value={apiKeyInput}
              onChange={(e) => {
                setApiKeyInput(e.target.value)
                setErrorMessage('')
              }}
              placeholder="xkeysib-xxxxxx..."
              className={`w-full px-4 py-2.5 pr-10 border rounded-lg font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errorMessage ? 'border-red-300' : 'border-gray-200'
              }`}
            />
            <button
              type="button"
              onClick={() => setShowApiKey(!showApiKey)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errorMessage && (
            <p className="text-sm text-red-600 mb-3">{errorMessage}</p>
          )}
          
          <button
            onClick={handleChangeApiKey}
            disabled={!apiKeyInput.trim() || isConnecting}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              apiKeyInput.trim() && !isConnecting
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            {isConnecting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Đang kết nối...</span>
              </>
            ) : (
              <span>Kết nối</span>
            )}
          </button>
        </div>
      )}
    </div>
  )

  // Disconnect Confirmation Dialog
  const DisconnectConfirmDialog = () => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Ngắt kết nối Brevo?</h3>
          <p className="text-gray-600 text-sm">
            NGẮT kết nối sẽ dừng mọi chiến dịch email đang chạy và không thể gửi email mới. Bạn chắc chắn?
          </p>
        </div>
        <div className="flex items-center justify-end space-x-3 px-6 pb-6">
          <button
            onClick={() => setShowDisconnectConfirm(false)}
            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Hủy
          </button>
          <button
            onClick={handleDisconnect}
            disabled={isDisconnecting}
            className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            {isDisconnecting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Đang xử lý...</span>
              </>
            ) : (
              <span>Ngắt kết nối</span>
            )}
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-gray-900">Kết nối Brevo</h3>
          <p className="text-sm text-gray-500 mt-0.5">Kết nối tài khoản Brevo để gửi email marketing</p>
        </div>
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
          getStatusBadgeStyle(status)
        }`}>
          {getStatusText(status)}
        </span>
      </div>

      {/* Content */}
      <div className="p-6">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
            <span className="ml-2 text-gray-500">Đang tải...</span>
          </div>
        ) : status === 'not_connected' ? (
          renderNotConnectedState()
        ) : status === 'error' ? (
          renderErrorState()
        ) : (
          renderConnectedState()
        )}
      </div>

      {/* Disconnect Confirmation Dialog */}
      {showDisconnectConfirm && <DisconnectConfirmDialog />}
    </div>
  )
}
