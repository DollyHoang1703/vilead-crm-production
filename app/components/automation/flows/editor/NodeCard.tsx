'use client'

import React from 'react'
import {
  MessageSquare, Image, Video, Mic, Paperclip, LayoutGrid,
  MousePointerClick, MessageCircle, Clock, GitBranch, Shuffle,
  Timer, Zap, Play, Pencil, Circle
} from 'lucide-react'
import { FlowNode, FlowEdge, NodeType, TextNodeData, ConditionNodeData, RandomNodeData, DelayNodeData, ActionNodeData, ButtonsNodeData, QuickReplyNodeData } from '../types'
import { NODE_COLOR, NODE_ICON_BG, NODE_LABEL } from '../constants'

// ─── Icon by node type ─────────────────────────────────────────────────────────
function NodeIcon({ type, size = 16 }: { type: NodeType; size?: number }) {
  const color = NODE_COLOR[type] || '#6B7280'
  const props = { size, color, strokeWidth: 2 }
  switch (type) {
    case 'start':         return <Play {...props} />
    case 'text':          return <MessageSquare {...props} />
    case 'image':         return <Image {...props} />
    case 'video':         return <Video {...props} />
    case 'audio':         return <Mic {...props} />
    case 'file':          return <Paperclip {...props} />
    case 'carousel':      return <LayoutGrid {...props} />
    case 'buttons':       return <MousePointerClick {...props} />
    case 'quick_reply':   return <MessageCircle {...props} />
    case 'wait_response': return <Clock {...props} />
    case 'condition':     return <GitBranch {...props} />
    case 'random':        return <Shuffle {...props} />
    case 'delay':         return <Timer {...props} />
    case 'action':        return <Zap {...props} />
    default:              return <MessageSquare {...props} />
  }
}

// ─── Node body preview per type ────────────────────────────────────────────────
function NodeBodyPreview({ node }: { node: FlowNode }) {
  const { type, data } = node

  switch (type) {
    case 'start':
      return (
        <div className="flex items-center justify-center py-3">
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm">A</div>
        </div>
      )

    case 'text': {
      const d = data as TextNodeData
      return (
        <div className="min-h-[48px] flex items-center">
          {d.content ? (
            <p className="text-xs text-gray-600 line-clamp-3 leading-relaxed">{d.content}</p>
          ) : (
            <p className="text-xs text-gray-300 italic">Không có gì ở đây</p>
          )}
        </div>
      )
    }

    case 'image':
      return (
        <div className="flex flex-col items-center justify-center py-3 gap-1">
          <Image size={24} className="text-gray-300" />
          <span className="text-xs text-gray-300">Hình ảnh</span>
        </div>
      )

    case 'video':
      return (
        <div className="flex flex-col items-center justify-center py-3 gap-1">
          <Video size={24} className="text-gray-300" />
          <span className="text-xs text-gray-300">Video</span>
        </div>
      )

    case 'audio':
      return (
        <div className="flex flex-col items-center justify-center py-3 gap-1">
          <Mic size={24} className="text-gray-300" />
          <span className="text-xs text-gray-300">Thêm âm thanh</span>
          <span className="text-[10px] text-gray-200">utils.sizeLimit</span>
        </div>
      )

    case 'file':
      return (
        <div className="flex flex-col items-center justify-center py-3 gap-1">
          <Paperclip size={24} className="text-gray-300" />
          <span className="text-xs text-gray-300">File đính kèm</span>
          <span className="text-[10px] text-gray-200">utils.sizeLimit</span>
        </div>
      )

    case 'carousel':
      return (
        <div className="flex flex-col items-center justify-center py-3 gap-1">
          <LayoutGrid size={24} className="text-gray-300" />
          <span className="text-xs text-gray-300">Bộ sưu tập</span>
        </div>
      )

    case 'buttons': {
      const d = data as ButtonsNodeData
      return (
        <div className="space-y-1">
          {d.buttons.length === 0 ? (
            <p className="text-xs text-gray-300 italic text-center py-2">Chưa có nút</p>
          ) : (
            d.buttons.slice(0, 3).map((btn) => (
              <div key={btn.id} className="flex items-center justify-between py-1.5 px-2 rounded border border-gray-100">
                <span className="text-xs text-gray-600 truncate">{btn.label}</span>
                <Circle size={12} className="text-gray-300 shrink-0 ml-1" />
              </div>
            ))
          )}
        </div>
      )
    }

    case 'quick_reply': {
      const d = data as QuickReplyNodeData
      return (
        <div className="space-y-1">
          {d.replies.length === 0 ? (
            <p className="text-xs text-gray-300 italic text-center py-2">Không có câu hỏi</p>
          ) : (
            d.replies.slice(0, 2).map((r) => (
              <div key={r.id} className="text-xs text-gray-600 truncate py-0.5">{r.label}</div>
            ))
          )}
          <p className="text-xs text-gray-400 flex items-center gap-1 mt-1">
            <MessageCircle size={10} />
            Chờ phản hồi từ người dùng
          </p>
        </div>
      )
    }

    case 'wait_response':
      return (
        <div className="min-h-[40px] flex flex-col gap-1">
          <p className="text-xs text-gray-300 italic">Không có câu hỏi</p>
          <p className="text-xs text-gray-400 flex items-center gap-1">
            <MessageCircle size={10} />
            Chờ phản hồi từ người dùng
          </p>
        </div>
      )

    case 'condition': {
      const d = data as ConditionNodeData
      if (!d.conditions || d.conditions.length === 0) {
        return <p className="text-xs text-gray-300 italic py-2 text-center">Click để thêm điều kiện</p>
      }
      return (
        <div className="space-y-1">
          {d.conditions.slice(0, 2).map((c, i) => (
            <div key={c.id} className="text-xs text-gray-600 truncate">
              {i > 0 && <span className="text-purple-400 mr-1">{d.logic === 'and' ? 'VÀ' : 'HOẶC'}</span>}
              {c.field} {c.operator} {String(c.value)}
            </div>
          ))}
        </div>
      )
    }

    case 'random': {
      const d = data as RandomNodeData
      return (
        <div className="space-y-1">
          {d.branches.map((b) => (
            <div key={b.id} className="flex items-center justify-between text-xs">
              <span className="text-gray-600">{b.name}</span>
              <span className="text-gray-500 font-medium">{b.percentage}%</span>
            </div>
          ))}
        </div>
      )
    }

    case 'delay': {
      const d = data as DelayNodeData
      const unitMap: Record<string, string> = { minutes: 'phút', hours: 'giờ', days: 'ngày' }
      return (
        <div className="py-1">
          <p className="text-xs text-gray-600">
            Chờ ít nhất <strong>{d.value} {unitMap[d.unit] || d.unit}</strong>
          </p>
        </div>
      )
    }

    case 'action': {
      const d = data as ActionNodeData
      if (!d.actions || d.actions.length === 0) {
        return <p className="text-xs text-gray-300 italic py-2 text-center">Thêm hành động</p>
      }
      return (
        <div className="space-y-1">
          {d.actions.slice(0, 2).map((a, i) => (
            <div key={i} className="text-xs text-gray-600 truncate flex items-center gap-1">
              <Zap size={10} className="text-amber-400 shrink-0" />
              {a.type.replace(/_/g, ' ')}
            </div>
          ))}
          {d.actions.length > 2 && (
            <p className="text-xs text-gray-400">+{d.actions.length - 2} hành động khác</p>
          )}
        </div>
      )
    }

    default:
      return <p className="text-xs text-gray-300 italic py-2">...</p>
  }
}

// ─── Footer / Outlets ──────────────────────────────────────────────────────────
interface NodeFooterProps {
  node: FlowNode
  edges: FlowEdge[]
  onOpenPicker: (sourceHandle?: string) => void
}

function NodeFooter({ node, edges, onOpenPicker }: NodeFooterProps) {
  const { type } = node

  // Condition node: two outlets
  if (type === 'condition') {
    const trueEdge = edges.find(e => e.source === node.id && e.sourceHandle === 'true')
    const falseEdge = edges.find(e => e.source === node.id && e.sourceHandle === 'false')
    return (
      <div className="border-t border-gray-100 pt-1.5 space-y-1">
        <button
          onClick={(e) => { e.stopPropagation(); onOpenPicker('true') }}
          className="flex items-center gap-2 w-full text-left group"
        >
          <span className="w-2 h-2 rounded-full bg-green-500 shrink-0" />
          <span className="text-xs text-gray-400 group-hover:text-green-600 flex-1 truncate">
            {trueEdge ? 'Thỏa mãn bất kỳ' : 'Thỏa mãn bất kỳ'}
          </span>
          <span className="text-gray-300 group-hover:text-green-600 text-xs">→</span>
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); onOpenPicker('false') }}
          className="flex items-center gap-2 w-full text-left group"
        >
          <span className="w-2 h-2 rounded-full bg-red-400 shrink-0" />
          <span className="text-xs text-gray-400 group-hover:text-red-500 flex-1 truncate">
            Nếu không thỏa mãn
          </span>
          <span className="text-gray-300 group-hover:text-red-500 text-xs">→</span>
        </button>
      </div>
    )
  }

  // Random: no footer (branches shown in body)
  if (type === 'random') return null

  // Start node: just "next step"
  const footerLabel = type === 'delay' ? 'Bước tiếp theo' : 'Tiếp theo'
  const connected = edges.some(e => e.source === node.id)

  return (
    <div className="border-t border-gray-100 pt-1.5">
      <button
        onClick={(e) => { e.stopPropagation(); onOpenPicker() }}
        className="flex items-center justify-end gap-1 w-full group"
      >
        <span className={`text-xs ${connected ? 'text-blue-500' : 'text-gray-400'} group-hover:text-blue-600`}>
          {footerLabel}
        </span>
        <span className={`text-xs ${connected ? 'text-blue-500' : 'text-gray-300'} group-hover:text-blue-600`}>→</span>
      </button>
    </div>
  )
}

// ─── Main NodeCard ──────────────────────────────────────────────────────────────
interface NodeCardProps {
  node: FlowNode
  edges: FlowEdge[]
  selected: boolean
  hasError: boolean
  nodeIndex: number
  onSelect: () => void
  onOpenPicker: (sourceHandle?: string) => void
  // Drag handles
  onMouseDown: (e: React.MouseEvent) => void
  // Connection handles
  onOutputHandleMouseDown: (e: React.MouseEvent, handle?: string) => void
  onInputHandleMouseEnter: (e: React.MouseEvent) => void
  onInputHandleMouseLeave: (e: React.MouseEvent) => void
}

export default function NodeCard({
  node, edges, selected, hasError, nodeIndex,
  onSelect, onOpenPicker, onMouseDown,
  onOutputHandleMouseDown, onInputHandleMouseEnter, onInputHandleMouseLeave
}: NodeCardProps) {
  const { type } = node
  const accent = NODE_COLOR[type] || '#6B7280'
  const iconBg = NODE_ICON_BG[type] || '#F3F4F6'
  const label = NODE_LABEL[type] || type
  const isStart = type === 'start'

  const cardBorder = hasError
    ? '2px solid #EF4444'
    : selected
    ? `2px solid ${accent === '#6B7280' ? '#3B82F6' : accent}`
    : '1px solid #E5E7EB'

  return (
    <div
      className="relative select-none"
      style={{ minWidth: 240, maxWidth: 280 }}
      onMouseDown={onMouseDown}
      onClick={(e) => { e.stopPropagation(); onSelect() }}
    >
      {/* Input handle (top center) */}
      {!isStart && (
        <div
          className="absolute -top-2 left-1/2 -translate-x-1/2 z-20"
          data-handle-type="input"
          data-node-id={node.id}
          onMouseEnter={onInputHandleMouseEnter}
          onMouseLeave={onInputHandleMouseLeave}
          style={{ width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'crosshair', pointerEvents: 'all' }}
        >
          <div
            className="w-3 h-3 rounded-full border-2 border-white shadow-sm bg-gray-300 transition-all group-hover:bg-blue-400"
            style={{ boxShadow: '0 0 0 1px #D1D5DB' }}
          />
        </div>
      )}

      {/* Card body */}
      <div
        className="bg-white rounded-xl overflow-hidden shadow-sm transition-all"
        style={{ border: cardBorder, boxShadow: selected ? `0 0 0 3px ${accent === '#6B7280' ? '#BFDBFE' : accent + '33'}` : '0 2px 8px rgba(0,0,0,0.07)' }}
      >
        {/* Header */}
        <div className="flex items-center gap-2.5 px-3 py-2.5 border-b border-gray-100">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
            style={{ background: iconBg }}
          >
            <NodeIcon type={type} size={14} />
          </div>
          <span className="text-sm font-semibold text-gray-800 flex-1 truncate">
            {isStart ? 'Bắt đầu' : `${label} #${nodeIndex}`}
          </span>
          <button
            className="w-6 h-6 rounded-md hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors"
            onClick={(e) => { e.stopPropagation(); onSelect() }}
          >
            <Pencil size={12} />
          </button>
        </div>

        {/* Body */}
        <div className="px-3 py-2.5 min-h-[44px]">
          <NodeBodyPreview node={node} />
        </div>

        {/* Footer */}
        {!isStart || type === 'start' ? (
          <div className="px-3 pb-2.5">
            <NodeFooter node={node} edges={edges} onOpenPicker={onOpenPicker} />
          </div>
        ) : null}
      </div>

      {/* Output handle (bottom center) */}
      {type !== 'condition' && (
        <div
          className="absolute -bottom-2 left-1/2 -translate-x-1/2 z-20"
          data-handle-type="output"
          data-node-id={node.id}
          style={{ width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'crosshair', pointerEvents: 'all' }}
          onMouseDown={(e) => { e.stopPropagation(); onOutputHandleMouseDown(e) }}
        >
          <div
            className="w-3 h-3 rounded-full border-2 border-white transition-all hover:scale-125"
            style={{ background: accent, boxShadow: `0 0 0 1px ${accent}` }}
          />
        </div>
      )}

      {/* Condition outlets (bottom left = true, bottom right = false) */}
      {type === 'condition' && (
        <>
          <div
            className="absolute z-20"
            style={{ bottom: -8, left: '30%', transform: 'translateX(-50%)', width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'crosshair', pointerEvents: 'all' }}
            data-handle-type="output"
            data-node-id={node.id}
            data-handle="true"
            onMouseDown={(e) => { e.stopPropagation(); onOutputHandleMouseDown(e, 'true') }}
          >
            <div className="w-3 h-3 rounded-full border-2 border-white bg-green-500 hover:scale-125 transition-all" style={{ boxShadow: '0 0 0 1px #22c55e' }} />
          </div>
          <div
            className="absolute z-20"
            style={{ bottom: -8, left: '70%', transform: 'translateX(-50%)', width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'crosshair', pointerEvents: 'all' }}
            data-handle-type="output"
            data-node-id={node.id}
            data-handle="false"
            onMouseDown={(e) => { e.stopPropagation(); onOutputHandleMouseDown(e, 'false') }}
          >
            <div className="w-3 h-3 rounded-full border-2 border-white bg-red-400 hover:scale-125 transition-all" style={{ boxShadow: '0 0 0 1px #f87171' }} />
          </div>
        </>
      )}
    </div>
  )
}
