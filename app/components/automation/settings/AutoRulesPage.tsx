'use client'

import React, { useState, useRef, useEffect } from 'react'
import {
  Zap, MessageSquare, CalendarClock, RotateCcw, Link2,
  ChevronDown, X, Check, Info
} from 'lucide-react'
import { AutoRule, AutoRuleType, AutoRuleConfig, Tag, SelectOption } from './types'
import { MOCK_AUTO_RULES, MOCK_TAGS, MOCK_FLOWS } from './mockData'

// ─── Toggle Switch ─────────────────────────────────────────────────────────────
function Toggle({ checked, onChange, disabled }: { checked: boolean; onChange: (v: boolean) => void; disabled?: boolean }) {
  return (
    <button
      type="button"
      onClick={() => !disabled && onChange(!checked)}
      disabled={disabled}
      className={`relative inline-flex items-center h-6 w-11 rounded-full transition-colors focus:outline-none shrink-0 ${checked ? 'bg-blue-600' : 'bg-gray-200'} ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}
    >
      <span
        className={`inline-block w-4.5 h-4.5 bg-white rounded-full shadow-sm transition-transform ${checked ? 'translate-x-5.5' : 'translate-x-0.5'}`}
        style={{ width: 18, height: 18, transform: checked ? 'translateX(20px)' : 'translateX(2px)' }}
      />
    </button>
  )
}

// ─── Tag Multi-Select ──────────────────────────────────────────────────────────
function TagMultiSelect({ value, onChange, allTags }: {
  value: string[]; onChange: (v: string[]) => void; allTags: Tag[]
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false) }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])

  const toggle = (id: string) => {
    onChange(value.includes(id) ? value.filter(v => v !== id) : [...value, id])
  }

  const selectedTags = allTags.filter(t => value.includes(t.id))

  return (
    <div ref={ref} className="relative">
      <div
        onClick={() => setOpen(o => !o)}
        className="min-h-[40px] w-full flex items-center flex-wrap gap-1.5 px-3 py-2 bg-white border border-gray-200 rounded-xl cursor-pointer hover:border-blue-400 focus-within:ring-2 focus-within:ring-blue-500 transition-colors"
      >
        {selectedTags.length === 0 ? (
          <span className="text-sm text-gray-400">Chọn tags...</span>
        ) : (
          selectedTags.map(tag => (
            <span
              key={tag.id}
              className="inline-flex items-center gap-1 pl-2 pr-1.5 py-0.5 rounded-full text-xs font-medium"
              style={{ background: tag.color + '18', color: tag.color }}
            >
              <span className="inline-block w-1.5 h-1.5 rounded-full" style={{ background: tag.color }} />
              {tag.name}
              <button
                type="button"
                onClick={e => { e.stopPropagation(); toggle(tag.id) }}
                className="ml-0.5 hover:opacity-70"
              >
                <X size={10} />
              </button>
            </span>
          ))
        )}
        <ChevronDown size={14} className={`ml-auto text-gray-400 transition-transform shrink-0 ${open ? 'rotate-180' : ''}`} />
      </div>

      {open && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-xl z-50 max-h-48 overflow-y-auto">
          {allTags.map(tag => (
            <button
              key={tag.id}
              type="button"
              onClick={() => toggle(tag.id)}
              className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-sm text-left hover:bg-gray-50 transition-colors"
            >
              <div className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-colors ${value.includes(tag.id) ? 'border-blue-600 bg-blue-600' : 'border-gray-300'}`}>
                {value.includes(tag.id) && <Check size={10} color="white" />}
              </div>
              <span className="inline-block w-2 h-2 rounded-full shrink-0" style={{ background: tag.color }} />
              <span className="text-gray-700">{tag.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Flow Select ───────────────────────────────────────────────────────────────
function FlowSelect({ value, onChange, flows }: {
  value: string | null; onChange: (v: string | null) => void; flows: SelectOption[]
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false) }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])

  const selected = flows.find(f => f.id === value)

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-sm hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
      >
        <span className={selected ? 'text-gray-800' : 'text-gray-400'}>
          {selected ? selected.name : 'Không gửi'}
        </span>
        <ChevronDown size={14} className={`text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-xl z-50 max-h-48 overflow-y-auto">
          <button
            type="button"
            onClick={() => { onChange(null); setOpen(false) }}
            className={`w-full flex items-center gap-2 px-4 py-2.5 text-sm text-left transition-colors ${!value ? 'text-blue-600 bg-blue-50 font-medium' : 'text-gray-500 hover:bg-gray-50'}`}
          >
            {!value && <Check size={13} />}
            <span className={!value ? '' : 'ml-5'}>Không gửi</span>
          </button>
          <div className="border-t border-gray-100" />
          {flows.map(flow => (
            <button
              key={flow.id}
              type="button"
              onClick={() => { onChange(flow.id); setOpen(false) }}
              className={`w-full flex items-center gap-2 px-4 py-2.5 text-sm text-left transition-colors ${value === flow.id ? 'text-blue-600 bg-blue-50 font-medium' : 'text-gray-700 hover:bg-gray-50'}`}
            >
              {value === flow.id && <Check size={13} />}
              <span className={value === flow.id ? '' : 'ml-5'}>{flow.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Icon map for rule types ────────────────────────────────────────────────────
const RULE_META: Record<AutoRuleType, { icon: React.ComponentType<any>; iconBg: string; iconColor: string }> = {
  first_message:       { icon: MessageSquare, iconBg: '#EFF6FF', iconColor: '#3B82F6' },
  first_message_daily: { icon: CalendarClock,  iconBg: '#F0FDF4', iconColor: '#22C55E' },
  comeback_after_days: { icon: RotateCcw,      iconBg: '#FFF7ED', iconColor: '#F97316' },
  conversation_synced: { icon: Link2,           iconBg: '#FAF5FF', iconColor: '#8B5CF6' },
}

// ─── Auto Rule Card ────────────────────────────────────────────────────────────
function AutoRuleCard({ rule, allTags, flows, onToggle, onConfigChange }: {
  rule: AutoRule; allTags: Tag[]; flows: SelectOption[];
  onToggle: (v: boolean) => void;
  onConfigChange: (config: AutoRuleConfig) => void;
}) {
  const [localConfig, setLocalConfig] = useState<AutoRuleConfig>(rule.config)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const meta = RULE_META[rule.ruleType]
  const IconComp = meta.icon

  const handleSave = async () => {
    setSaving(true)
    await new Promise(r => setTimeout(r, 400))
    onConfigChange(localConfig)
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const isDirty = JSON.stringify(localConfig) !== JSON.stringify(rule.config)

  return (
    <div className={`bg-white border rounded-2xl overflow-hidden transition-all ${rule.isEnabled ? 'border-blue-200 shadow-sm shadow-blue-50' : 'border-gray-200'}`}>
      {/* Card header */}
      <div className="flex items-center gap-4 p-5">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: meta.iconBg }}>
          <IconComp size={18} style={{ color: meta.iconColor }} />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-bold text-gray-900">{rule.ruleName}</h3>
          <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{rule.description}</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className={`text-xs font-semibold ${rule.isEnabled ? 'text-blue-600' : 'text-gray-400'}`}>
            {rule.isEnabled ? 'BẬT' : 'TẮT'}
          </span>
          <Toggle checked={rule.isEnabled} onChange={onToggle} />
        </div>
      </div>

      {/* Config area */}
      <div className="px-5 pb-5 space-y-4 border-t border-gray-100 pt-4">
        {/* Days input (only for comeback_after_days) */}
        {rule.ruleType === 'comeback_after_days' && (
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Số ngày không tương tác:</label>
            <div className="flex items-center gap-3">
              <input
                type="number"
                min={1} max={365}
                value={localConfig.days ?? 30}
                onChange={e => setLocalConfig(c => ({ ...c, days: parseInt(e.target.value) || 1 }))}
                className="w-24 px-3 py-2 text-sm font-semibold text-gray-800 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-center"
              />
              <span className="text-sm text-gray-500">ngày</span>
              <span className="text-xs text-gray-400">(1 - 365)</span>
            </div>
          </div>
        )}

        {/* Assign tags */}
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1.5">Gán tags:</label>
          <TagMultiSelect
            value={localConfig.assignTags}
            onChange={v => setLocalConfig(c => ({ ...c, assignTags: v }))}
            allTags={allTags}
          />
        </div>

        {/* Send flow */}
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1.5">Gửi luồng tin nhắn:</label>
          <FlowSelect
            value={localConfig.sendFlowId}
            onChange={v => setLocalConfig(c => ({ ...c, sendFlowId: v }))}
            flows={flows}
          />
        </div>

        {/* Save btn */}
        {isDirty && (
          <div className="flex justify-end pt-1">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-semibold hover:bg-blue-700 transition-colors disabled:opacity-60"
            >
              {saving ? <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : null}
              {saving ? 'Đang lưu...' : 'Lưu cài đặt'}
            </button>
          </div>
        )}
        {saved && !isDirty && (
          <div className="flex justify-end">
            <span className="flex items-center gap-1.5 text-xs text-green-600 font-medium">
              <Check size={12} /> Đã lưu
            </span>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Main Auto Rules Page ─────────────────────────────────────────────────────
export default function AutoRulesPage() {
  const [rules, setRules] = useState<AutoRule[]>(MOCK_AUTO_RULES)

  const handleToggle = (ruleId: string, enabled: boolean) => {
    setRules(prev => prev.map(r => r.id === ruleId ? { ...r, isEnabled: enabled } : r))
  }

  const handleConfigChange = (ruleId: string, config: AutoRuleConfig) => {
    setRules(prev => prev.map(r => r.id === ruleId ? { ...r, config } : r))
  }

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Header */}
      <div className="px-6 py-5 border-b border-gray-100 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
            <Zap size={20} className="text-amber-600" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">Quy tắc tự động</h2>
            <p className="text-sm text-gray-500 mt-0.5">Thiết lập quy tắc tự động trigger khi có sự kiện. Tất cả rules mặc định TẮT.</p>
          </div>
        </div>

        {/* Info banner */}
        <div className="mt-4 flex items-start gap-2.5 p-3.5 bg-amber-50 rounded-xl">
          <Info size={15} className="text-amber-500 mt-0.5 shrink-0" />
          <p className="text-xs text-amber-700 leading-relaxed">
            Khi một rule được bật, hệ thống sẽ tự động thực thi cấu hình khi điều kiện trigger xảy ra. 
            Chỉ người Admin mới có thể bật/tắt và cấu hình auto rules.
          </p>
        </div>
      </div>

      {/* Rule cards */}
      <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
        {rules.map(rule => (
          <AutoRuleCard
            key={rule.id}
            rule={rule}
            allTags={MOCK_TAGS}
            flows={MOCK_FLOWS}
            onToggle={enabled => handleToggle(rule.id, enabled)}
            onConfigChange={config => handleConfigChange(rule.id, config)}
          />
        ))}
      </div>
    </div>
  )
}
