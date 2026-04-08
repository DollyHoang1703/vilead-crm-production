'use client'

import React, { useState, useEffect } from 'react'
import {
  X, Plus, Trash2, Smile, Code2, Info, ChevronDown,
  MessageSquare, Image, Video, Mic, Paperclip, LayoutGrid,
  GitBranch, Shuffle, Timer, Zap, Clock, MousePointerClick, MessageCircle,
  Play, Sliders
} from 'lucide-react'
import { FlowNode, NodeType, NodeData, TextNodeData, ConditionNodeData, RandomNodeData, DelayNodeData, ActionNodeData, ButtonsNodeData, QuickReplyNodeData, WaitResponseNodeData, ImageNodeData, CarouselNodeData } from '../types'
import { NODE_COLOR, NODE_ICON_BG, NODE_LABEL, CONDITION_FIELDS, CONDITION_OPERATORS_BY_TYPE, ACTION_TYPES } from '../constants'

// ─── Icon ─────────────────────────────────────────────────────────────────────
function NodeIcon({ type }: { type: NodeType }) {
  const color = NODE_COLOR[type] || '#6B7280'
  const p = { size: 16, color, strokeWidth: 2 }
  switch (type) {
    case 'start':         return <Play {...p} />
    case 'text':          return <MessageSquare {...p} />
    case 'image':         return <Image {...p} />
    case 'video':         return <Video {...p} />
    case 'audio':         return <Mic {...p} />
    case 'file':          return <Paperclip {...p} />
    case 'carousel':      return <LayoutGrid {...p} />
    case 'buttons':       return <MousePointerClick {...p} />
    case 'quick_reply':   return <MessageCircle {...p} />
    case 'wait_response': return <Clock {...p} />
    case 'condition':     return <GitBranch {...p} />
    case 'random':        return <Shuffle {...p} />
    case 'delay':         return <Timer {...p} />
    case 'action':        return <Zap {...p} />
    default:              return <MessageSquare {...p} />
  }
}

// ─── Shared UI components ─────────────────────────────────────────────────────
function SectionLabel({ children }: { children: React.ReactNode }) {
  return <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">{children}</p>
}

function Divider() {
  return <div className="border-t border-gray-100 my-4" />
}

function Select({ value, onChange, children, className = '' }: {
  value: string
  onChange: (v: string) => void
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={`relative ${className}`}>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full appearance-none bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-8"
      >
        {children}
      </select>
      <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
    </div>
  )
}

function Input({ value, onChange, placeholder, className = '' }: {
  value: string
  onChange: (v: string) => void
  placeholder?: string
  className?: string
}) {
  return (
    <input
      type="text"
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      className={`w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${className}`}
    />
  )
}

// Upload zone
function UploadZone({ label, icon, hint }: { label: string; icon: React.ReactNode; hint?: string }) {
  return (
    <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 flex flex-col items-center justify-center gap-2 text-center cursor-pointer hover:border-blue-300 hover:bg-blue-50 transition-colors">
      <div className="text-gray-300">{icon}</div>
      <p className="text-sm font-medium text-gray-500">{label}</p>
      {hint && <p className="text-xs text-gray-300">{hint}</p>}
    </div>
  )
}

// ─── Text/Content form ────────────────────────────────────────────────────────
function TextForm({ data, onChange, nodeIndex }: { data: TextNodeData; onChange: (d: Partial<TextNodeData>) => void; nodeIndex: number }) {
  const [msgType, setMsgType] = useState<'within24h' | 'outside24h'>('within24h')

  return (
    <div className="space-y-4">
      {/* Message type */}
      <div>
        <SectionLabel>Loại tin nhắn</SectionLabel>
        <div className="space-y-2">
          {[
            { v: 'within24h', label: 'Trong khoảng 24 giờ' },
            { v: 'outside24h', label: 'Ngoài khoảng 24 giờ' },
          ].map(opt => (
            <label key={opt.v} className="flex items-center gap-2.5 cursor-pointer">
              <div
                className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${msgType === opt.v ? 'border-blue-500 bg-blue-500' : 'border-gray-300'}`}
                onClick={() => setMsgType(opt.v as 'within24h' | 'outside24h')}
              >
                {msgType === opt.v && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
              </div>
              <span className="text-sm text-gray-700">{opt.label}</span>
            </label>
          ))}
        </div>
      </div>

      <Divider />

      {/* Input area */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2 text-gray-500">
            <MessageSquare size={14} />
            <span className="text-xs font-medium">Nhập liệu</span>
          </div>
          <button className="text-gray-400 hover:text-gray-600"><Sliders size={14} /></button>
        </div>
        <div className="border border-gray-200 rounded-xl overflow-hidden">
          <textarea
            value={data.content || ''}
            onChange={e => onChange({ content: e.target.value })}
            placeholder="Nhập nội dung tin nhắn..."
            rows={4}
            maxLength={1200}
            className="w-full px-3.5 pt-3 pb-1 text-sm text-gray-700 placeholder-gray-300 focus:outline-none resize-none"
          />
          <div className="flex items-center justify-between px-3 pb-2">
            <div className="flex items-center gap-2">
              <button className="text-gray-400 hover:text-gray-600 transition-colors"><Smile size={15} /></button>
              <button className="text-gray-400 hover:text-gray-600 transition-colors"><Code2 size={15} /></button>
            </div>
            <span className="text-xs text-gray-300">{(data.content || '').length}/1200</span>
          </div>
        </div>
        <div className="flex items-center gap-1.5 mt-2">
          <Info size={11} className="text-gray-300 shrink-0" />
          <p className="text-xs text-gray-400">Bạn sẽ nhận được phản hồi từ khách hàng</p>
        </div>
      </div>

      {/* Quick reply shortcuts */}
      <div className="flex items-center gap-2 flex-wrap">
        {['Trả lời nhanh', 'Email', 'Số điện thoại'].map(t => (
          <button key={t} className="text-xs px-3 py-1.5 rounded-full border border-gray-200 text-gray-600 hover:border-blue-400 hover:text-blue-600 transition-colors">
            {t}
          </button>
        ))}
      </div>

      <Divider />

      {/* Add content buttons */}
      <div>
        <SectionLabel>Thêm một nội dung</SectionLabel>
        <div className="grid grid-cols-4 gap-2">
          {[
            { icon: <MessageSquare size={18} />, label: 'Văn bản' },
            { icon: <Image size={18} />, label: 'Hình ảnh' },
            { icon: <LayoutGrid size={18} />, label: 'Nhóm ảnh' },
            { icon: <LayoutGrid size={18} />, label: 'Bộ sưu tập' },
            { icon: <MessageSquare size={18} />, label: 'Templates' },
            { icon: <Video size={18} />, label: 'Video' },
            { icon: <Mic size={18} />, label: 'Audio' },
            { icon: <Plus size={18} />, label: 'Nhiều hơn' },
          ].map(item => (
            <button
              key={item.label}
              className="flex flex-col items-center gap-1.5 p-3 rounded-xl border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors text-gray-500 hover:text-blue-600"
            >
              {item.icon}
              <span className="text-[10px] font-medium">{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Image form ───────────────────────────────────────────────────────────────
function ImageForm({ data, onChange }: { data: ImageNodeData; onChange: (d: Partial<ImageNodeData>) => void }) {
  return (
    <div className="space-y-4">
      <UploadZone
        label="Tải lên ảnh"
        icon={<Image size={32} />}
        hint="Kích thước ảnh: Nhỏ (1.91:1) - Lớn (1:1) • Dung lượng ảnh: Tối đa 5MB"
      />
      <div className="space-y-2">
        <div className="relative">
          <textarea
            value={data.caption || ''}
            onChange={e => onChange({ caption: e.target.value })}
            placeholder="Nhập tiêu đề..."
            rows={2}
            maxLength={45}
            className="w-full border border-gray-200 rounded-xl px-3.5 pt-3 pb-2 text-sm text-gray-700 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
          <span className="absolute bottom-2 right-3 text-xs text-gray-300">{(data.caption || '').length}/45</span>
        </div>
      </div>
      <button className="w-full flex items-center justify-center gap-2 py-2.5 border-2 border-dashed border-gray-200 rounded-xl text-sm text-gray-400 hover:border-blue-300 hover:text-blue-500 transition-colors">
        <Plus size={16} />
        Thêm nút
      </button>
    </div>
  )
}

// ─── Video form ───────────────────────────────────────────────────────────────
function VideoForm({ data, onChange }: { data: any; onChange: (d: any) => void }) {
  return (
    <div className="space-y-4">
      <UploadZone
        label="Tải lên video hoặc link URL"
        icon={<Video size={32} />}
        hint="Giới hạn Video: 15MB"
      />
      <Input value={data.url || ''} onChange={v => onChange({ url: v })} placeholder="Dán link video URL..." />
      <button className="w-full flex items-center justify-center gap-2 py-2.5 border-2 border-dashed border-gray-200 rounded-xl text-sm text-gray-400 hover:border-blue-300 hover:text-blue-500 transition-colors">
        <Plus size={16} />
        Thêm nút
      </button>
    </div>
  )
}

// ─── Audio form ───────────────────────────────────────────────────────────────
function AudioForm({ data, onChange }: { data: any; onChange: (d: any) => void }) {
  return (
    <div className="space-y-4">
      <UploadZone
        label="Thêm âm thanh"
        icon={<Mic size={32} />}
        hint="MP3, WAV, OGG tối đa 10MB"
      />
    </div>
  )
}

// ─── File form ────────────────────────────────────────────────────────────────
function FileForm({ data, onChange }: { data: any; onChange: (d: any) => void }) {
  return (
    <div className="space-y-4">
      <UploadZone
        label="File đính kèm"
        icon={<Paperclip size={32} />}
        hint="Tải tệp lên • Tối đa 10MB"
      />
    </div>
  )
}

// ─── Buttons form ─────────────────────────────────────────────────────────────
function ButtonsForm({ data, onChange }: { data: ButtonsNodeData; onChange: (d: Partial<ButtonsNodeData>) => void }) {
  const addButton = () => {
    onChange({
      buttons: [...data.buttons, { id: `btn_${Date.now()}`, label: `Nút ${data.buttons.length + 1}`, type: 'flow', value: '' }]
    })
  }
  const removeButton = (id: string) => {
    onChange({ buttons: data.buttons.filter(b => b.id !== id) })
  }
  const updateButton = (id: string, patch: any) => {
    onChange({ buttons: data.buttons.map(b => b.id === id ? { ...b, ...patch } : b) })
  }
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        {data.buttons.map((btn, i) => (
          <div key={btn.id} className="border border-gray-200 rounded-xl p-3 space-y-2">
            <div className="flex items-center gap-2">
              <Input value={btn.label} onChange={v => updateButton(btn.id, { label: v })} placeholder={`Nút ${i + 1}`} className="flex-1" />
              <button onClick={() => removeButton(btn.id)} className="w-7 h-7 flex items-center justify-center text-red-400 hover:bg-red-50 rounded-lg">
                <Trash2 size={13} />
              </button>
            </div>
            <Select value={btn.type} onChange={v => updateButton(btn.id, { type: v })}>
              <option value="flow">Luồng tin nhắn</option>
              <option value="url">Đường dẫn URL</option>
              <option value="phone">Số điện thoại</option>
            </Select>
          </div>
        ))}
        {data.buttons.length < 3 && (
          <button onClick={addButton} className="w-full flex items-center justify-center gap-2 py-2.5 border-2 border-dashed border-gray-200 rounded-xl text-sm text-gray-400 hover:border-blue-300 hover:text-blue-600 transition-colors">
            <Plus size={16} />
            Thêm nút
          </button>
        )}
      </div>
    </div>
  )
}

// ─── Quick Reply form ─────────────────────────────────────────────────────────
function QuickReplyForm({ data, onChange }: { data: QuickReplyNodeData; onChange: (d: Partial<QuickReplyNodeData>) => void }) {
  const addReply = () => {
    onChange({ replies: [...data.replies, { id: `qr_${Date.now()}`, label: `Trả lời ${data.replies.length + 1}`, type: 'flow' }] })
  }
  const removeReply = (id: string) => {
    onChange({ replies: data.replies.filter(r => r.id !== id) })
  }
  const updateReply = (id: string, label: string) => {
    onChange({ replies: data.replies.map(r => r.id === id ? { ...r, label } : r) })
  }
  return (
    <div className="space-y-4">
      <div className="border border-gray-200 rounded-xl overflow-hidden">
        <textarea
          placeholder="Nhập nội dung câu hỏi..."
          rows={3}
          className="w-full px-3.5 pt-3 pb-2 text-sm text-gray-700 placeholder-gray-300 focus:outline-none resize-none"
        />
        <div className="flex items-center gap-1.5 px-3 pb-2 border-t border-gray-100">
          <Info size={11} className="text-gray-300" />
          <p className="text-xs text-gray-400">Bạn sẽ nhận được phản hồi từ khách hàng</p>
        </div>
      </div>
      <div className="space-y-2">
        {data.replies.map((reply, i) => (
          <div key={reply.id} className="flex items-center gap-2">
            <Input value={reply.label} onChange={v => updateReply(reply.id, v)} placeholder={`Trả lời ${i + 1}`} className="flex-1" />
            <button onClick={() => removeReply(reply.id)} className="w-7 h-7 flex items-center justify-center text-red-400 hover:bg-red-50 rounded-lg">
              <Trash2 size={13} />
            </button>
          </div>
        ))}
        <button onClick={addReply} className="w-full flex items-center justify-center gap-2 py-2.5 border-2 border-dashed border-gray-200 rounded-xl text-sm text-gray-400 hover:border-blue-300 hover:text-blue-600 transition-colors">
          <Plus size={16} />
          Thêm câu trả lời
        </button>
      </div>
    </div>
  )
}

// ─── Wait Response form ───────────────────────────────────────────────────────
function WaitResponseForm({ data, onChange }: { data: WaitResponseNodeData; onChange: (d: Partial<WaitResponseNodeData>) => void }) {
  return (
    <div className="space-y-4">
      <div className="border border-gray-200 rounded-xl p-3">
        <p className="text-xs text-gray-500 mb-2">Thời gian chờ phản hồi</p>
        <div className="flex items-center gap-2">
          <input
            type="number"
            value={data.timeoutValue || 24}
            onChange={e => onChange({ timeoutValue: Number(e.target.value) })}
            min={1}
            className="w-20 border border-gray-200 rounded-lg px-2.5 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Select value={data.timeoutUnit || 'hours'} onChange={v => onChange({ timeoutUnit: v as any })}>
            <option value="minutes">Phút</option>
            <option value="hours">Giờ</option>
            <option value="days">Ngày</option>
          </Select>
        </div>
      </div>
      <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-xl">
        <Info size={14} className="text-blue-400 mt-0.5 shrink-0" />
        <p className="text-xs text-blue-600">Bot sẽ chờ phản hồi từ khách hàng trong thời gian cài đặt trước khi chuyển sang bước tiếp theo.</p>
      </div>
    </div>
  )
}

// ─── Condition form ───────────────────────────────────────────────────────────
function ConditionForm({ data, onChange }: { data: ConditionNodeData; onChange: (d: Partial<ConditionNodeData>) => void }) {
  const addCondition = () => {
    onChange({
      conditions: [...data.conditions, { id: `cond_${Date.now()}`, field: 'customer_name' as any, operator: 'contains' as any, value: '' }]
    })
  }
  const removeCondition = (id: string) => {
    onChange({ conditions: data.conditions.filter(c => c.id !== id) })
  }
  const updateCondition = (id: string, patch: any) => {
    onChange({ conditions: data.conditions.map(c => c.id === id ? { ...c, ...patch } : c) })
  }
  const fieldDef = (field: string) => CONDITION_FIELDS.find(f => f.value === field)

  return (
    <div className="space-y-4">
      {/* Logic toggle */}
      <div>
        <SectionLabel>Điều kiện lọc</SectionLabel>
        <div className="flex items-center gap-3">
          {[
            { v: 'and', label: 'Thỏa mãn tất cả các điều kiện' },
            { v: 'or', label: 'Thỏa mãn một trong các điều kiện' },
          ].map(opt => (
            <label key={opt.v} className="flex items-center gap-2 cursor-pointer">
              <div
                className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${data.logic === opt.v ? 'border-blue-500 bg-blue-500' : 'border-gray-300'}`}
                onClick={() => onChange({ logic: opt.v as 'and' | 'or' })}
              >
                {data.logic === opt.v && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
              </div>
              <span className="text-xs text-gray-600">{opt.label}</span>
            </label>
          ))}
        </div>
      </div>

      <Divider />

      {/* Conditions list */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <SectionLabel>Điều kiện</SectionLabel>
          <button onClick={addCondition} className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 font-medium">
            <Plus size={12} />
            Thêm
          </button>
        </div>
        {data.conditions.length === 0 ? (
          <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 flex flex-col items-center gap-2">
            <GitBranch size={24} className="text-gray-200" />
            <p className="text-sm text-gray-400">Chưa có dữ liệu</p>
            <button onClick={addCondition} className="text-xs text-blue-600 hover:underline font-medium flex items-center gap-1">
              <Plus size={12} />
              Thêm điều kiện
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            {data.conditions.map(cond => {
              const fDef = fieldDef(cond.field)
              const operators = CONDITION_OPERATORS_BY_TYPE[fDef?.type || 'string'] || []
              return (
                <div key={cond.id} className="flex items-start gap-1.5">
                  <div className="flex-1 space-y-1.5">
                    <Select value={cond.field} onChange={v => updateCondition(cond.id, { field: v })}>
                      {CONDITION_FIELDS.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
                    </Select>
                    <div className="flex gap-1.5">
                      <Select value={cond.operator} onChange={v => updateCondition(cond.id, { operator: v })} className="flex-1">
                        {operators.map(op => <option key={op.value} value={op.value}>{op.label}</option>)}
                      </Select>
                      <Input value={String(cond.value)} onChange={v => updateCondition(cond.id, { value: v })} placeholder="Giá trị" className="flex-1" />
                    </div>
                  </div>
                  <button onClick={() => removeCondition(cond.id)} className="w-7 h-7 mt-1 flex items-center justify-center text-red-400 hover:bg-red-50 rounded-lg shrink-0">
                    <Trash2 size={13} />
                  </button>
                </div>
              )
            })}
          </div>
        )}
      </div>

      <Divider />

      {/* Outcome branches info */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 p-2.5 bg-green-50 rounded-xl">
          <div className="w-2.5 h-2.5 rounded-full bg-green-500 shrink-0" />
          <span className="text-xs text-green-700 font-medium">Nếu thỏa mãn điều kiện</span>
          <span className="text-xs text-green-500 ml-auto">→ Kéo từ handle xanh</span>
        </div>
        <div className="flex items-center gap-2 p-2.5 bg-red-50 rounded-xl">
          <div className="w-2.5 h-2.5 rounded-full bg-red-400 shrink-0" />
          <span className="text-xs text-red-600 font-medium">Nếu không thỏa mãn</span>
          <span className="text-xs text-red-400 ml-auto">→ Kéo từ handle đỏ</span>
        </div>
      </div>
    </div>
  )
}

// ─── Random form ──────────────────────────────────────────────────────────────
function RandomForm({ data, onChange }: { data: RandomNodeData; onChange: (d: Partial<RandomNodeData>) => void }) {
  const total = data.branches.reduce((s, b) => s + b.percentage, 0)

  const addBranch = () => {
    const newPct = Math.max(0, 100 - total)
    onChange({ branches: [...data.branches, { id: `b_${Date.now()}`, name: `Nhánh ${String.fromCharCode(65 + data.branches.length)}`, percentage: newPct }] })
  }
  const updateBranch = (id: string, patch: any) => {
    onChange({ branches: data.branches.map(b => b.id === id ? { ...b, ...patch } : b) })
  }
  const removeBranch = (id: string) => {
    if (data.branches.length <= 2) return
    onChange({ branches: data.branches.filter(b => b.id !== id) })
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-600">Phân chia tỷ lệ</span>
        <span className={`text-sm font-semibold ${total === 100 ? 'text-green-600' : 'text-red-500'}`}>
          Tổng: {total}%
        </span>
      </div>

      {data.branches.map((branch, i) => (
        <div key={branch.id} className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">{branch.name}:</span>
            {data.branches.length > 2 && (
              <button onClick={() => removeBranch(branch.id)} className="text-red-400 hover:text-red-600">
                <Trash2 size={13} />
              </button>
            )}
          </div>
          <div className="flex items-center gap-2">
            <input
              type="range"
              min={0}
              max={100}
              value={branch.percentage}
              onChange={e => updateBranch(branch.id, { percentage: Number(e.target.value) })}
              className="flex-1 accent-indigo-600"
            />
            <div className="relative w-16">
              <input
                type="number"
                min={0} max={100}
                value={branch.percentage}
                onChange={e => updateBranch(branch.id, { percentage: Number(e.target.value) })}
                className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-sm text-center text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <span className="text-xs text-gray-400">%</span>
          </div>
          <div className="p-2.5 rounded-xl border border-gray-200 text-xs text-gray-400 italic flex items-center gap-2">
            <Info size={11} className="shrink-0" />
            <span>Kéo từ handle phía dưới node để kết nối bước tiếp theo</span>
          </div>
        </div>
      ))}

      <button
        onClick={addBranch}
        className="w-full flex items-center justify-center gap-2 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors"
      >
        <Shuffle size={15} />
        Ngẫu nhiên mới
      </button>
    </div>
  )
}

// ─── Delay form ───────────────────────────────────────────────────────────────
function DelayForm({ data, onChange }: { data: DelayNodeData; onChange: (d: Partial<DelayNodeData>) => void }) {
  const [hasWindow, setHasWindow] = useState(false)

  return (
    <div className="space-y-4">
      <div>
        <SectionLabel>Thời gian trì hoãn</SectionLabel>
        <div className="flex items-center gap-2">
          <input
            type="number"
            min={1}
            value={data.value}
            onChange={e => onChange({ value: Number(e.target.value) })}
            className="w-20 border border-gray-200 rounded-lg px-2.5 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Select value={data.unit} onChange={v => onChange({ unit: v as any })}>
            <option value="minutes">Phút</option>
            <option value="hours">Giờ</option>
            <option value="days">Ngày</option>
          </Select>
        </div>
      </div>

      {/* Send window toggle */}
      <div className="flex items-center justify-between py-2">
        <span className="text-sm text-gray-600">Đặt giới hạn thời gian</span>
        <button
          onClick={() => setHasWindow(h => !h)}
          className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${hasWindow ? 'bg-blue-600' : 'bg-gray-200'}`}
        >
          <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform ${hasWindow ? 'translate-x-4.5' : 'translate-x-0.5'}`} />
        </button>
      </div>

      {hasWindow && (
        <div className="p-3 border border-gray-200 rounded-xl space-y-2">
          <SectionLabel>Khung giờ gửi</SectionLabel>
          <div className="flex items-center gap-2">
            <input type="time" defaultValue="08:00" className="border border-gray-200 rounded-lg px-2 py-1.5 text-sm text-gray-700 focus:outline-none" />
            <span className="text-gray-400 text-sm">đến</span>
            <input type="time" defaultValue="22:00" className="border border-gray-200 rounded-lg px-2 py-1.5 text-sm text-gray-700 focus:outline-none" />
          </div>
        </div>
      )}

      <div className="flex items-start gap-2 p-3 bg-amber-50 rounded-xl">
        <Info size={14} className="text-amber-500 mt-0.5 shrink-0" />
        <p className="text-xs text-amber-700">Tin nhắn sẽ được gửi sau khi hết thời gian trì hoãn. Nếu cài giới hạn thời gian, tin nhắn sẽ được gửi trong khung giờ cho phép.</p>
      </div>
    </div>
  )
}

// ─── Action form ──────────────────────────────────────────────────────────────
function ActionForm({ data, onChange }: { data: ActionNodeData; onChange: (d: Partial<ActionNodeData>) => void }) {
  const [showPicker, setShowPicker] = useState(false)
  const groups = ['Tag', 'Kịch bản', 'Thao tác với Bot']

  const removeAction = (idx: number) => {
    onChange({ actions: data.actions.filter((_, i) => i !== idx) })
  }

  const addAction = (type: string) => {
    const newAction: any = { type }
    if (type === 'add_tag' || type === 'remove_tag') newAction.tagIds = []
    if (type === 'subscribe_sequence' || type === 'unsubscribe_sequence') newAction.sequenceId = ''
    if (type === 'pause_bot') { newAction.duration = 30; newAction.unit = 'minutes' }
    onChange({ actions: [...data.actions, newAction] })
    setShowPicker(false)
  }

  return (
    <div className="space-y-4">
      {data.actions.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 gap-3">
          <div className="w-14 h-14 rounded-2xl bg-gray-50 border-2 border-dashed border-gray-200 flex items-center justify-center">
            <Zap size={24} className="text-gray-300" />
          </div>
          <p className="text-sm font-medium text-gray-500">Bạn chưa có hành động nào</p>
          <p className="text-xs text-gray-400">Thiết lập các hành động bạn muốn Bot thực hiện</p>
        </div>
      ) : (
        <div className="space-y-2">
          {data.actions.map((action, i) => {
            const def = ACTION_TYPES.find(a => a.value === action.type)
            return (
              <div key={i} className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-xl">
                <Zap size={15} className="text-amber-500 shrink-0" />
                <span className="text-sm text-amber-800 font-medium flex-1">{def?.label || action.type}</span>
                <button onClick={() => removeAction(i)} className="w-6 h-6 flex items-center justify-center text-red-400 hover:bg-red-50 rounded-lg">
                  <Trash2 size={12} />
                </button>
              </div>
            )
          })}
        </div>
      )}

      {/* Add action button */}
      <div className="relative">
        <button
          onClick={() => setShowPicker(p => !p)}
          className="w-full flex items-center justify-center gap-2 py-2.5 border-2 border-dashed border-gray-200 rounded-xl text-sm text-gray-500 hover:border-amber-400 hover:text-amber-600 hover:bg-amber-50 transition-colors font-medium"
        >
          <Plus size={16} />
          Thêm hành động
        </button>

        {showPicker && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden">
            <div className="p-2.5 border-b border-gray-100">
              <input placeholder="Tìm kiếm..." className="w-full text-sm px-3 py-2 rounded-lg bg-gray-50 border border-gray-200 focus:outline-none" />
            </div>
            <div className="max-h-56 overflow-y-auto">
              {groups.map(group => {
                const groupItems = ACTION_TYPES.filter(a => a.group === group)
                return (
                  <div key={group}>
                    <p className="text-[11px] font-semibold text-gray-400 uppercase px-3 pt-2 pb-1">{group}</p>
                    {groupItems.map(item => (
                      <button
                        key={item.value}
                        onClick={() => addAction(item.value)}
                        className="w-full flex items-center gap-2.5 px-3 py-2 hover:bg-gray-50 text-left"
                      >
                        <span className="text-sm text-gray-700">{item.label}</span>
                      </button>
                    ))}
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Carousel form ────────────────────────────────────────────────────────────
function CarouselForm({ data, onChange }: { data: CarouselNodeData; onChange: (d: Partial<CarouselNodeData>) => void }) {
  const [activeCard, setActiveCard] = useState(0)

  const addCard = () => {
    onChange({ cards: [...data.cards, { id: `card_${Date.now()}`, imageUrl: '', title: '', description: '', buttons: [] }] })
    setActiveCard(data.cards.length)
  }

  const updateCard = (idx: number, patch: any) => {
    onChange({ cards: data.cards.map((c, i) => i === idx ? { ...c, ...patch } : c) })
  }

  const card = data.cards[activeCard]

  return (
    <div className="space-y-4">
      {/* Card tabs */}
      <div className="flex items-center gap-1 overflow-x-auto pb-1">
        {data.cards.map((_, i) => (
          <button
            key={i}
            onClick={() => setActiveCard(i)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium shrink-0 transition-colors ${activeCard === i ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
          >
            Card {i + 1}
          </button>
        ))}
        <button onClick={addCard} className="px-3 py-1.5 rounded-lg text-xs text-blue-600 bg-blue-50 hover:bg-blue-100 shrink-0">
          <Plus size={12} />
        </button>
      </div>

      {card && (
        <div className="space-y-3">
          <UploadZone label="Tải lên ảnh" icon={<Image size={24} />} hint="Tối đa 5MB" />
          <Input value={card.title} onChange={v => updateCard(activeCard, { title: v })} placeholder="Nhập tiêu đề..." />
          <Input value={card.description || ''} onChange={v => updateCard(activeCard, { description: v })} placeholder="Nhập mô tả..." />
        </div>
      )}
    </div>
  )
}

// ─── Panel header ─────────────────────────────────────────────────────────────
function PanelHeader({ node, nodeIndex, onClose }: { node: FlowNode; nodeIndex: number; onClose: () => void }) {
  const color = NODE_COLOR[node.type] || '#6B7280'
  const bg = NODE_ICON_BG[node.type] || '#F3F4F6'
  const label = NODE_LABEL[node.type] || node.type
  const isStart = node.type === 'start'
  const title = isStart ? 'Bắt đầu' : `${label} #${nodeIndex}`

  return (
    <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100">
      <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: bg }}>
        <NodeIcon type={node.type} />
      </div>
      <div className="flex-1 min-w-0">
        <h2 className="text-sm font-bold text-gray-900 truncate">{title}</h2>
      </div>
      <button
        onClick={onClose}
        className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400 transition-colors"
      >
        <X size={16} />
      </button>
    </div>
  )
}

// ─── Main ConfigPanel ─────────────────────────────────────────────────────────
interface ConfigPanelProps {
  selectedNode: FlowNode | null
  nodeIndex: number
  onUpdate: (nodeId: string, data: Partial<NodeData>) => void
  onDelete: (nodeId: string) => void
  onClose: () => void
}

export default function ConfigPanel({ selectedNode, nodeIndex, onUpdate, onDelete, onClose }: ConfigPanelProps) {
  if (!selectedNode) return null

  const update = (data: Partial<NodeData>) => onUpdate(selectedNode.id, data)

  const renderForm = () => {
    switch (selectedNode.type) {
      case 'start':
        return (
          <div className="flex flex-col items-center justify-center py-8 gap-3 text-center">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center">
              <Play size={24} className="text-blue-600" />
            </div>
            <p className="text-sm font-semibold text-gray-700">Node bắt đầu</p>
            <p className="text-xs text-gray-400 max-w-[200px]">Đây là điểm khởi đầu của luồng. Kéo từ handle phía dưới để kết nối bước tiếp theo.</p>
          </div>
        )
      case 'text':
        return <TextForm data={selectedNode.data as TextNodeData} onChange={update} nodeIndex={nodeIndex} />
      case 'image':
        return <ImageForm data={selectedNode.data as ImageNodeData} onChange={update} />
      case 'video':
        return <VideoForm data={selectedNode.data} onChange={update} />
      case 'audio':
        return <AudioForm data={selectedNode.data} onChange={update} />
      case 'file':
        return <FileForm data={selectedNode.data} onChange={update} />
      case 'carousel':
        return <CarouselForm data={selectedNode.data as CarouselNodeData} onChange={update} />
      case 'buttons':
        return <ButtonsForm data={selectedNode.data as ButtonsNodeData} onChange={update} />
      case 'quick_reply':
        return <QuickReplyForm data={selectedNode.data as QuickReplyNodeData} onChange={update} />
      case 'wait_response':
        return <WaitResponseForm data={selectedNode.data as WaitResponseNodeData} onChange={update} />
      case 'condition':
        return <ConditionForm data={selectedNode.data as ConditionNodeData} onChange={update} />
      case 'random':
        return <RandomForm data={selectedNode.data as RandomNodeData} onChange={update} />
      case 'delay':
        return <DelayForm data={selectedNode.data as DelayNodeData} onChange={update} />
      case 'action':
        return <ActionForm data={selectedNode.data as ActionNodeData} onChange={update} />
      default:
        return <p className="text-sm text-gray-400">Không có cài đặt cho loại node này.</p>
    }
  }

  return (
    <div
      className="flex flex-col bg-white border-r border-gray-100 overflow-hidden"
      style={{ width: 420, minWidth: 420, maxWidth: 420 }}
    >
      <PanelHeader node={selectedNode} nodeIndex={nodeIndex} onClose={onClose} />

      <div className="flex-1 overflow-y-auto px-5 py-4">
        {renderForm()}
      </div>

      {/* Footer */}
      {selectedNode.type !== 'start' && (
        <div className="border-t border-gray-100 px-5 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare size={13} className="text-gray-400" />
            <span className="text-xs text-gray-500">Thêm ghi chú</span>
          </div>
          <button
            className="relative inline-flex h-5 w-9 items-center rounded-full bg-gray-200"
            onClick={() => {}}
          >
            <span className="inline-block h-3.5 w-3.5 transform translate-x-0.5 rounded-full bg-white shadow" />
          </button>
        </div>
      )}
    </div>
  )
}
