'use client'

import React, { useState, useEffect } from 'react'
import { Save, CheckCircle } from 'lucide-react'
import { useEmailLimits } from './hooks'
import { EmailLimitsFormData } from './types'
import LimitCard from './LimitCard'

export default function EmailLimitsConfig() {
  const { config, usage, saving, updateConfig } = useEmailLimits()
  
  const [formData, setFormData] = useState<EmailLimitsFormData>({
    daily_limit: 500,
    monthly_limit: 10000,
    per_sender_daily_limit: 100,
    delay_between_emails: 5
  })
  
  const [hasChanges, setHasChanges] = useState(false)
  const [toast, setToast] = useState<{ show: boolean; message: string }>({ show: false, message: '' })

  // Initialize form data from config
  useEffect(() => {
    if (config) {
      setFormData({
        daily_limit: config.daily_limit,
        monthly_limit: config.monthly_limit,
        per_sender_daily_limit: config.per_sender_daily_limit,
        delay_between_emails: config.delay_between_emails
      })
    }
  }, [config])

  // Check for changes
  useEffect(() => {
    if (config) {
      const changed = 
        formData.daily_limit !== config.daily_limit ||
        formData.monthly_limit !== config.monthly_limit ||
        formData.per_sender_daily_limit !== config.per_sender_daily_limit ||
        formData.delay_between_emails !== config.delay_between_emails
      setHasChanges(changed)
    }
  }, [formData, config])

  const showToast = (message: string) => {
    setToast({ show: true, message })
    setTimeout(() => setToast({ show: false, message: '' }), 3000)
  }

  const handleSave = async () => {
    const result = await updateConfig(formData)
    if (result.success) {
      showToast(result.message)
      setHasChanges(false)
    }
  }

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Toast Notification */}
      {toast.show && (
        <div className="fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg bg-green-500 text-white flex items-center space-x-2 animate-slide-in">
          <CheckCircle className="w-5 h-5" />
          <span>{toast.message}</span>
        </div>
      )}

      {/* Description */}
      <p className="text-sm text-gray-600">
        Cấu hình giới hạn gửi email để tối ưu hóa hiệu suất và tránh bị đánh dấu spam
      </p>

      {/* Daily Limit */}
      <LimitCard
        title="Giới hạn gửi theo ngày"
        value={formData.daily_limit}
        onChange={(value) => setFormData({ ...formData, daily_limit: value })}
        unit="email/ngày"
        usage={usage?.daily}
        min={100}
        max={10000}
        description="Số lượng email tối đa có thể gửi trong một ngày"
        resetTime={usage?.reset_daily_in}
      />

      {/* Monthly Limit */}
      <LimitCard
        title="Giới hạn gửi theo tháng"
        value={formData.monthly_limit}
        onChange={(value) => setFormData({ ...formData, monthly_limit: value })}
        unit="email/tháng"
        usage={usage?.monthly}
        min={1000}
        max={100000}
        description="Số lượng email tối đa có thể gửi trong một tháng"
        resetTime={usage?.reset_monthly_in}
      />

      {/* Per Sender Limit */}
      <LimitCard
        title="Giới hạn theo email người gửi"
        value={formData.per_sender_daily_limit}
        onChange={(value) => setFormData({ ...formData, per_sender_daily_limit: value })}
        unit="email/ngày/email gửi"
        min={10}
        max={1000}
        description="Số lượng email tối đa mỗi địa chỉ email người gửi có thể gửi trong một ngày"
      />

      {/* Delay Between Emails */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <h3 className="font-medium text-gray-900 mb-4">Khoảng cách giữa các email</h3>
        
        <div className="flex items-center gap-4 mb-3">
          <input
            type="number"
            value={formData.delay_between_emails}
            onChange={(e) => {
              const value = parseInt(e.target.value) || 0
              if (value >= 1 && value <= 60) {
                setFormData({ ...formData, delay_between_emails: value })
              }
            }}
            min={1}
            max={60}
            className="w-32 px-3 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-right font-medium"
          />
          <span className="text-gray-600">giây</span>
        </div>
        
        <p className="text-sm text-gray-500">
          Thời gian chờ tối thiểu giữa mỗi email gửi đi. Giá trị từ 1-60 giây.
          Tăng thời gian chờ giúp giảm nguy cơ bị đánh dấu spam.
        </p>
        
        {/* Delay visualization */}
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-700">
            💡 Với cấu hình hiện tại, hệ thống có thể gửi tối đa{' '}
            <strong>{Math.floor(3600 / formData.delay_between_emails)}</strong> email/giờ
          </p>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex items-center justify-between pt-4">
        {hasChanges && (
          <span className="text-sm text-yellow-600">
            * Bạn có thay đổi chưa lưu
          </span>
        )}
        <button
          onClick={handleSave}
          disabled={saving || !hasChanges}
          className={`ml-auto flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-colors ${
            hasChanges
              ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }`}
        >
          {saving ? (
            <>
              <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Đang lưu...</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Lưu thay đổi</span>
            </>
          )}
        </button>
      </div>

      {/* Info Card */}
      <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
        <h4 className="font-medium text-gray-900 mb-2">📌 Lưu ý quan trọng</h4>
        <ul className="text-sm text-gray-600 space-y-1.5">
          <li>• Giới hạn gửi được reset tự động vào 00:00 mỗi ngày (cho giới hạn ngày) và ngày đầu tháng (cho giới hạn tháng)</li>
          <li>• Nếu đạt giới hạn, các chiến dịch đang chạy sẽ tạm dừng và tiếp tục khi reset</li>
          <li>• Sử dụng email doanh nghiệp và cấu hình SPF/DKIM để tăng tỷ lệ gửi thành công</li>
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
