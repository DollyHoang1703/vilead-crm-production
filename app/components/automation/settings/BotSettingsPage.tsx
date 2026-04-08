'use client'

import React, { useState } from 'react'
import { Bot, Clock, RefreshCcw, Check, Info } from 'lucide-react'
import { BotSettings } from './types'
import { MOCK_BOT_SETTINGS } from './mockData'

// ─── Toggle Switch ─────────────────────────────────────────────────────────────
function Toggle({ checked, onChange, disabled }: { checked: boolean; onChange: (v: boolean) => void; disabled?: boolean }) {
  return (
    <button
      type="button"
      onClick={() => !disabled && onChange(!checked)}
      disabled={disabled}
      className={`relative inline-flex items-center h-6 rounded-full transition-colors focus:outline-none shrink-0 ${checked ? 'bg-blue-600' : 'bg-gray-200'} ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}
      style={{ width: 44 }}
    >
      <span
        className="inline-block bg-white rounded-full shadow-sm transition-transform"
        style={{ width: 18, height: 18, transform: checked ? 'translateX(22px)' : 'translateX(2px)' }}
      />
    </button>
  )
}

// ─── Section Card ──────────────────────────────────────────────────────────────
function SectionCard({ title, description, children }: {
  title: string; description?: string; children: React.ReactNode
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100">
        <h3 className="text-sm font-bold text-gray-900">{title}</h3>
        {description && <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{description}</p>}
      </div>
      <div className="px-6 py-5">{children}</div>
    </div>
  )
}

// ─── Preview Text ─────────────────────────────────────────────────────────────
function BotPreview({ settings }: { settings: BotSettings }) {
  const buildText = () => {
    if (!settings.pauseOnAgentReply) return 'Bot luôn hoạt động, không tạm dừng khi nhân viên trả lời.'
    const dur = settings.pauseDurationMinutes
    const durText = dur >= 60
      ? `${Math.floor(dur / 60)} giờ${dur % 60 > 0 ? ` ${dur % 60} phút` : ''}`
      : `${dur} phút`
    if (settings.autoResume) {
      return `Khi nhân viên trả lời, Bot sẽ tạm dừng ${durText} và tự động kích hoạt lại sau đó.`
    }
    return `Khi nhân viên trả lời, Bot sẽ tạm dừng ${durText}. Bot không tự động kích hoạt lại và cần bật thủ công.`
  }

  return (
    <div className="flex items-start gap-2.5 p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
      <Info size={16} className="text-blue-500 mt-0.5 shrink-0" />
      <div>
        <p className="text-xs font-semibold text-blue-700 mb-1">Xem trước cấu hình:</p>
        <p className="text-sm text-blue-800 leading-relaxed italic">"{buildText()}"</p>
      </div>
    </div>
  )
}

// ─── Main Bot Settings Page ────────────────────────────────────────────────────
export default function BotSettingsPage() {
  const [settings, setSettings] = useState<BotSettings>(MOCK_BOT_SETTINGS)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [durationError, setDurationError] = useState('')

  const handleDurationChange = (val: string) => {
    const num = parseInt(val)
    if (val === '') { setSettings(s => ({ ...s, pauseDurationMinutes: 0 })); return }
    if (isNaN(num)) return
    if (num < 1) { setDurationError('Tối thiểu 1 phút'); }
    else if (num > 1440) { setDurationError('Tối đa 1440 phút (24 giờ)'); }
    else { setDurationError('') }
    setSettings(s => ({ ...s, pauseDurationMinutes: num }))
  }

  const handleSave = async () => {
    if (durationError || settings.pauseDurationMinutes < 1 || settings.pauseDurationMinutes > 1440) return
    setSaving(true)
    await new Promise(r => setTimeout(r, 600))
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Header */}
      <div className="px-6 py-5 border-b border-gray-100 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center">
            <Bot size={20} className="text-purple-600" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">Cài đặt Bot</h2>
            <p className="text-sm text-gray-500 mt-0.5">Cấu hình hành vi của Bot automation khi nhân viên can thiệp</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
        {/* Setting 1: Pause on agent reply */}
        <SectionCard
          title="1. Tạm dừng Bot khi nhân viên trả lời"
          description="Khi nhân viên gửi tin nhắn cho khách hàng, Bot sẽ tự động tạm dừng hoạt động để tránh xung đột."
        >
          <div className="space-y-5">
            {/* Toggle row */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-800">Trạng thái</p>
                <p className={`text-xs mt-0.5 ${settings.pauseOnAgentReply ? 'text-blue-600' : 'text-gray-400'}`}>
                  {settings.pauseOnAgentReply ? 'Bot sẽ tạm dừng khi NV trả lời' : 'Bot tiếp tục hoạt động liên tục'}
                </p>
              </div>
              <Toggle
                checked={settings.pauseOnAgentReply}
                onChange={v => setSettings(s => ({ ...s, pauseOnAgentReply: v }))}
              />
            </div>

            {/* Pause duration */}
            {settings.pauseOnAgentReply && (
              <div className="pl-4 border-l-2 border-blue-100">
                <label className="block text-xs font-semibold text-gray-600 mb-2 flex items-center gap-1.5">
                  <Clock size={13} className="text-gray-400" />
                  Thời gian tạm dừng
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    min={1} max={1440}
                    value={settings.pauseDurationMinutes || ''}
                    onChange={e => handleDurationChange(e.target.value)}
                    className={`w-24 px-3 py-2.5 text-sm font-semibold text-gray-800 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-center transition-colors ${durationError ? 'border-red-400 bg-red-50' : 'border-gray-200'}`}
                  />
                  <span className="text-sm text-gray-600">phút</span>
                  <span className="text-xs text-gray-400">(1 – 1440 phút)</span>
                </div>
                {durationError && <p className="text-xs text-red-500 mt-1.5">{durationError}</p>}

                {/* Quick presets */}
                <div className="flex items-center gap-2 mt-3">
                  <span className="text-xs text-gray-400">Nhanh:</span>
                  {[15, 30, 60, 120, 480].map(v => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => { setSettings(s => ({ ...s, pauseDurationMinutes: v })); setDurationError('') }}
                      className={`px-2.5 py-1 text-xs rounded-lg border transition-colors ${settings.pauseDurationMinutes === v ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-200 text-gray-600 hover:border-blue-400 hover:text-blue-600'}`}
                    >
                      {v >= 60 ? `${v / 60}h` : `${v}p`}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </SectionCard>

        {/* Setting 2: Auto resume */}
        <SectionCard
          title="2. Tự động kích hoạt lại Bot"
          description="Sau thời gian tạm dừng, Bot tự động resume hoạt động. Nếu TẮT, Bot sẽ dừng vĩnh viễn cho KH đó đến khi NV bật lại thủ công."
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-800">Trạng thái</p>
              <p className={`text-xs mt-0.5 ${settings.autoResume ? 'text-green-600' : 'text-gray-400'}`}>
                {settings.autoResume
                  ? 'Bot tự động bật lại sau thời gian tạm dừng'
                  : 'Bot sẽ phải được bật thủ công bởi nhân viên'}
              </p>
            </div>
            <Toggle
              checked={settings.autoResume}
              onChange={v => setSettings(s => ({ ...s, autoResume: v }))}
              disabled={!settings.pauseOnAgentReply}
            />
          </div>
          {!settings.pauseOnAgentReply && (
            <p className="text-xs text-gray-400 mt-3 italic">Bật "Tạm dừng Bot khi NV trả lời" để sử dụng tính năng này.</p>
          )}
        </SectionCard>

        {/* Preview */}
        <SectionCard title="📋 Xem trước cấu hình">
          <BotPreview settings={settings} />
        </SectionCard>

        {/* Save button */}
        <div className="flex items-center justify-end gap-3">
          {saved && (
            <span className="flex items-center gap-1.5 text-sm text-green-600 font-medium">
              <Check size={15} /> Đã lưu cài đặt
            </span>
          )}
          <button
            onClick={handleSave}
            disabled={saving || !!durationError}
            className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors disabled:opacity-60 shadow-sm"
          >
            {saving ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : null}
            {saving ? 'Đang lưu...' : 'Lưu cài đặt'}
          </button>
        </div>
      </div>
    </div>
  )
}
