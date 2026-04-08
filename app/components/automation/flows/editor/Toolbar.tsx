'use client'

import React, { useState, useRef, useEffect } from 'react'
import {
  ChevronRight, Eye, Save, RotateCcw, MoreHorizontal,
  CheckCircle2, Clock, Pencil
} from 'lucide-react'
import { FlowStatus } from '../types'

interface ToolbarProps {
  flowName: string
  flowGroupName?: string // e.g. "Tin nhắn Kịch bản chăm sóc 4"
  status: FlowStatus
  hasChanges: boolean
  saving: boolean
  onBack: () => void
  onSave: () => void
  onPublish: () => void
  onPreview: () => void
  onFlowNameChange: (name: string) => void
}

export default function Toolbar({
  flowName, flowGroupName = 'Luồng tin nhắn', status, hasChanges, saving,
  onBack, onSave, onPublish, onPreview, onFlowNameChange,
}: ToolbarProps) {
  const [editingName, setEditingName] = useState(false)
  const [tempName, setTempName] = useState(flowName)
  const nameInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => { setTempName(flowName) }, [flowName])

  const startEdit = () => {
    setTempName(flowName)
    setEditingName(true)
    setTimeout(() => nameInputRef.current?.select(), 50)
  }

  const commitEdit = () => {
    const trimmed = tempName.trim()
    if (trimmed && trimmed !== flowName) onFlowNameChange(trimmed)
    setEditingName(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') commitEdit()
    if (e.key === 'Escape') { setEditingName(false); setTempName(flowName) }
  }

  return (
    <div
      className="flex items-center gap-0 shrink-0"
      style={{
        height: 52,
        background: 'white',
        borderBottom: '1px solid #E5E7EB',
        paddingLeft: 16,
        paddingRight: 16,
        zIndex: 30,
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
      }}
    >
      {/* Botcake-style breadcrumb */}
      <div className="flex items-center gap-1 flex-1 min-w-0">
        <button
          onClick={onBack}
          className="text-sm text-gray-500 hover:text-blue-600 transition-colors truncate"
        >
          Luồng tin nhắn
        </button>
        <ChevronRight size={14} className="text-gray-300 shrink-0" />
        <span className="text-sm text-gray-500 truncate max-w-[140px]">{flowGroupName}</span>
        <ChevronRight size={14} className="text-gray-300 shrink-0" />
        {editingName ? (
          <input
            ref={nameInputRef}
            value={tempName}
            onChange={e => setTempName(e.target.value)}
            onBlur={commitEdit}
            onKeyDown={handleKeyDown}
            className="text-sm font-semibold text-gray-900 px-2 py-0.5 border border-blue-400 rounded-lg outline-none ring-2 ring-blue-100 max-w-[200px]"
            maxLength={100}
          />
        ) : (
          <button
            onClick={startEdit}
            className="flex items-center gap-1.5 group text-sm font-semibold text-gray-900 hover:text-blue-600 transition-colors"
          >
            <span className="truncate max-w-[200px]">{flowName}</span>
            <Pencil size={12} className="text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
          </button>
        )}
      </div>

      {/* Right side actions */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Undo-like (history) */}
        <button
          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
          title="Hoàn tác"
        >
          <RotateCcw size={15} />
        </button>

        {/* Preview */}
        <button
          onClick={onPreview}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-gray-600 border border-gray-200 hover:bg-gray-50 transition-colors"
        >
          <Eye size={15} />
          <span>Xem thử</span>
        </button>

        {/* Save */}
        <button
          onClick={onSave}
          disabled={!hasChanges || saving}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-colors font-medium
            ${hasChanges && !saving
              ? 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
              : 'bg-white border border-gray-100 text-gray-300 cursor-not-allowed'}`}
        >
          {saving ? (
            <span className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
          ) : (
            <Save size={15} />
          )}
          {saving ? 'Đang lưu...' : 'Lưu'}
        </button>

        {/* Publish */}
        <button
          onClick={onPublish}
          className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-sm text-white font-semibold transition-all"
          style={{ background: 'linear-gradient(135deg, #4F46E5, #3B82F6)' }}
        >
          {status === 'published' ? 'Cập nhật' : 'Lưu'}
        </button>

        {/* More */}
        <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-500 transition-colors">
          <MoreHorizontal size={16} />
        </button>
      </div>
    </div>
  )
}
