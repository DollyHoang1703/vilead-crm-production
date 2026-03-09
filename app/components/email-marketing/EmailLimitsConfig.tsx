'use client'

import React from 'react'
import { 
  CheckCircle, 
  AlertTriangle, 
  ExternalLink, 
  Mail, 
  Calendar, 
  Clock,
  RefreshCw,
  Zap,
  Crown
} from 'lucide-react'
import { useBrevoConnection } from './hooks'

// Plan badge component
function PlanBadge({ plan }: { plan: string }) {
  const planConfig: Record<string, { label: string; className: string; icon: any }> = {
    free: { label: 'Free', className: 'bg-gray-100 text-gray-700 border-gray-200', icon: null },
    starter: { label: 'Starter', className: 'bg-blue-100 text-blue-700 border-blue-200', icon: Zap },
    business: { label: 'Business', className: 'bg-purple-100 text-purple-700 border-purple-200', icon: Zap },
    enterprise: { label: 'Enterprise', className: 'bg-amber-100 text-amber-700 border-amber-200', icon: Crown }
  }

  const config = planConfig[plan] || planConfig.free
  const Icon = config.icon

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${config.className}`}>
      {Icon && <Icon className="w-3.5 h-3.5 mr-1.5" />}
      Gói {config.label}
    </span>
  )
}

// Progress bar component
function QuotaProgressBar({ 
  used, 
  limit, 
  label 
}: { 
  used: number; 
  limit: number; 
  label: string 
}) {
  const percentage = limit > 0 ? Math.min((used / limit) * 100, 100) : 0
  const isWarning = percentage >= 80
  const isCritical = percentage >= 95

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-600">{label}</span>
        <span className={`font-medium ${
          isCritical ? 'text-red-600' : isWarning ? 'text-amber-600' : 'text-gray-900'
        }`}>
          {used.toLocaleString()} / {limit.toLocaleString()}
        </span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div 
          className={`h-full rounded-full transition-all ${
            isCritical ? 'bg-red-500' : isWarning ? 'bg-amber-500' : 'bg-blue-500'
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div className="flex items-center justify-between text-xs">
        <span className="text-gray-400">Đã sử dụng {percentage.toFixed(1)}%</span>
        <span className="text-gray-400">Còn lại: {(limit - used).toLocaleString()}</span>
      </div>
    </div>
  )
}

export default function EmailLimitsConfig() {
  const { connection, quota, isConnected, loading, refreshQuota } = useBrevoConnection()

  const [toast, setToast] = React.useState<{ show: boolean; message: string }>({ show: false, message: '' })
  const [refreshing, setRefreshing] = React.useState(false)

  const showToast = (message: string) => {
    setToast({ show: true, message })
    setTimeout(() => setToast({ show: false, message: '' }), 3000)
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    await refreshQuota()
    setRefreshing(false)
    showToast('Đã cập nhật thông tin quota từ Brevo')
  }

  // Not connected state
  if (!isConnected) {
    return (
      <div className="space-y-6">
        <p className="text-sm text-gray-600">
          Xem thông tin giới hạn gửi email từ tài khoản Brevo
        </p>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8">
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="w-8 h-8 text-gray-400" />
            </div>
            <h4 className="text-lg font-medium text-gray-900 mb-2">
              Vui lòng kết nối Brevo
            </h4>
            <p className="text-gray-500 text-sm max-w-md mx-auto">
              Kết nối tài khoản Brevo để xem thông tin giới hạn gửi email và quota hiện tại.
            </p>
          </div>
        </div>
      </div>
    )
  }

  // Connected state - show Brevo quota
  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toast.show && (
        <div className="fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg bg-green-500 text-white flex items-center space-x-2 animate-slide-in">
          <CheckCircle className="w-5 h-5" />
          <span>{toast.message}</span>
        </div>
      )}

      {/* Header with refresh button */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          Giới hạn gửi email được quản lý bởi Brevo theo gói dịch vụ của bạn
        </p>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center space-x-2 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          <span>Cập nhật</span>
        </button>
      </div>

      {/* Plan Info Card */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100 p-6">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-lg font-semibold text-gray-900">Thông tin tài khoản Brevo</h3>
              <PlanBadge plan={connection?.brevo_plan || 'free'} />
            </div>
            <p className="text-sm text-gray-600 mb-4">
              {connection?.brevo_email || 'N/A'}
              {connection?.brevo_company_name && (
                <span className="mx-2">•</span>
              )}
              {connection?.brevo_company_name}
            </p>
          </div>
          <a
            href="https://app.brevo.com/billing/subscription"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            Nâng cấp gói
            <ExternalLink className="w-3.5 h-3.5 ml-1" />
          </a>
        </div>

        {/* Warning for Free plan */}
        {connection?.brevo_plan === 'free' && (
          <div className="flex items-start gap-3 p-3 bg-amber-50 border border-amber-100 rounded-lg mt-2">
            <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-amber-800">
              <p className="font-medium">Gói Free có giới hạn 300 email/ngày</p>
              <p className="text-amber-700 mt-0.5">
                Nâng cấp lên gói Starter để gửi được nhiều email hơn
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Quota Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Daily Quota */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Giới hạn ngày</h3>
              <p className="text-xs text-gray-500">Reset hàng ngày lúc 00:00 UTC</p>
            </div>
          </div>
          
          <QuotaProgressBar 
            used={quota?.daily?.used || 0}
            limit={quota?.daily?.limit || 300}
            label="Email đã gửi hôm nay"
          />

          <div className="mt-4 p-3 bg-gray-50 rounded-lg flex items-center justify-between text-sm">
            <span className="text-gray-600">Giới hạn gói {connection?.brevo_plan || 'Free'}:</span>
            <span className="font-semibold text-gray-900">
              {(quota?.daily?.limit || 300).toLocaleString()} email/ngày
            </span>
          </div>
        </div>

        {/* Monthly Quota */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Giới hạn tháng</h3>
              <p className="text-xs text-gray-500">Reset đầu mỗi tháng</p>
            </div>
          </div>
          
          <QuotaProgressBar 
            used={quota?.monthly?.used || 0}
            limit={quota?.monthly?.limit || 9000}
            label="Email đã gửi tháng này"
          />

          <div className="mt-4 p-3 bg-gray-50 rounded-lg flex items-center justify-between text-sm">
            <span className="text-gray-600">Giới hạn gói {connection?.brevo_plan || 'Free'}:</span>
            <span className="font-semibold text-gray-900">
              {(quota?.monthly?.limit || 9000).toLocaleString()} email/tháng
            </span>
          </div>
        </div>
      </div>

      {/* Plan Comparison */}
      {/* <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="font-semibold text-gray-900">So sánh các gói Brevo</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Gói</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Giới hạn ngày</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Giới hạn tháng</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Giá</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr className={connection?.brevo_plan === 'free' ? 'bg-blue-50' : ''}>
                <td className="px-6 py-3">
                  <div className="flex items-center">
                    <span className="font-medium text-gray-900">Free</span>
                    {connection?.brevo_plan === 'free' && (
                      <span className="ml-2 text-xs text-blue-600 font-medium">(Hiện tại)</span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-3 text-sm text-gray-600">300 email</td>
                <td className="px-6 py-3 text-sm text-gray-600">9,000 email</td>
                <td className="px-6 py-3 text-sm text-gray-600">Miễn phí</td>
              </tr>
              <tr className={connection?.brevo_plan === 'starter' ? 'bg-blue-50' : ''}>
                <td className="px-6 py-3">
                  <div className="flex items-center">
                    <span className="font-medium text-gray-900">Starter</span>
                    {connection?.brevo_plan === 'starter' && (
                      <span className="ml-2 text-xs text-blue-600 font-medium">(Hiện tại)</span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-3 text-sm text-gray-600">Không giới hạn</td>
                <td className="px-6 py-3 text-sm text-gray-600">20,000+ email</td>
                <td className="px-6 py-3 text-sm text-gray-600">Từ $25/tháng</td>
              </tr>
              <tr className={connection?.brevo_plan === 'business' ? 'bg-blue-50' : ''}>
                <td className="px-6 py-3">
                  <div className="flex items-center">
                    <span className="font-medium text-gray-900">Business</span>
                    {connection?.brevo_plan === 'business' && (
                      <span className="ml-2 text-xs text-blue-600 font-medium">(Hiện tại)</span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-3 text-sm text-gray-600">Không giới hạn</td>
                <td className="px-6 py-3 text-sm text-gray-600">Tùy chọn</td>
                <td className="px-6 py-3 text-sm text-gray-600">Từ $65/tháng</td>
              </tr>
              <tr className={connection?.brevo_plan === 'enterprise' ? 'bg-blue-50' : ''}>
                <td className="px-6 py-3">
                  <div className="flex items-center">
                    <span className="font-medium text-gray-900">Enterprise</span>
                    {connection?.brevo_plan === 'enterprise' && (
                      <span className="ml-2 text-xs text-blue-600 font-medium">(Hiện tại)</span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-3 text-sm text-gray-600">Không giới hạn</td>
                <td className="px-6 py-3 text-sm text-gray-600">Không giới hạn</td>
                <td className="px-6 py-3 text-sm text-gray-600">Liên hệ</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
          <a
            href="https://www.brevo.com/pricing/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            Xem chi tiết bảng giá Brevo
            <ExternalLink className="w-3.5 h-3.5 ml-1" />
          </a>
        </div>
      </div> */}

      {/* Info Card */}
      <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
        <h4 className="font-medium text-gray-900 mb-2">📌 Lưu ý quan trọng</h4>
        <ul className="text-sm text-gray-600 space-y-1.5">
          <li>• Giới hạn gửi email được quản lý bởi Brevo theo gói dịch vụ của bạn</li>
          <li>• Để tăng giới hạn gửi, vui lòng nâng cấp gói trên Brevo</li>
          <li>• Quota được reset tự động theo múi giờ UTC</li>
          <li>• Nếu đạt giới hạn, các chiến dịch sẽ tự động tạm dừng</li>
        </ul>
      </div>

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
