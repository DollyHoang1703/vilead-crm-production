'use client'

import React, { useEffect, useRef } from 'react'
import {
  MessageSquare, Zap, Sparkles, Clock, GitBranch, Shuffle, X, ChevronRight
} from 'lucide-react'
import { FlowNode, NodeType } from '../types'
import { NODE_COLOR, NODE_LABEL } from '../constants'

interface NextStepOption {
  id: string
  label: string
  description: string
  icon: React.ReactNode
  color: string
  action: 'select_existing' | 'create_node'
  nodeType?: NodeType
}

// Existing message-type nodes that can be selected
const MESSAGE_NODE_TYPES: NodeType[] = [
  'text', 'image', 'video', 'audio', 'file', 'carousel',
  'buttons', 'quick_reply', 'wait_response'
]

interface NextStepPickerProps {
  position: { x: number; y: number }
  sourceNodeId: string
  sourceHandle?: string
  existingNodes: FlowNode[]
  onSelectExistingNode: (targetNodeId: string) => void
  onCreateNode: (nodeType: NodeType) => void
  onClose: () => void
}

export default function NextStepPicker({
  position, sourceNodeId, sourceHandle,
  existingNodes, onSelectExistingNode, onCreateNode, onClose
}: NextStepPickerProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [subMenu, setSubMenu] = React.useState<'select_message' | null>(null)

  useEffect(() => {
    const handle = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose()
      }
    }
    document.addEventListener('mousedown', handle)
    return () => document.removeEventListener('mousedown', handle)
  }, [onClose])

  // Eligible existing nodes (exclude source, exclude already connected)
  const eligibleNodes = existingNodes.filter(n =>
    n.id !== sourceNodeId && MESSAGE_NODE_TYPES.includes(n.type)
  )

  const nodeIndex = (nodeId: string) => {
    const idx = existingNodes.findIndex(n => n.id === nodeId)
    return idx + 1
  }

  const mainOptions: NextStepOption[] = [
    {
      id: 'select_message',
      label: 'Chọn tin nhắn',
      description: 'Chọn một khối tin nhắn',
      icon: <MessageSquare size={18} />,
      color: '#6B7280',
      action: 'select_existing',
    },
    {
      id: 'action',
      label: 'Hành động',
      description: 'Thêm các hành động cho Bot thực hiện',
      icon: <Zap size={18} />,
      color: '#F59E0B',
      action: 'create_node',
      nodeType: 'action',
    },
    {
      id: 'delay',
      label: 'Smart Delay',
      description: 'Thiết lập thời gian phản hồi',
      icon: <Clock size={18} />,
      color: '#F59E0B',
      action: 'create_node',
      nodeType: 'delay',
    },
    {
      id: 'condition',
      label: 'Điều kiện',
      description: 'Rẽ nhánh theo điều kiện',
      icon: <GitBranch size={18} />,
      color: '#4F46E5',
      action: 'create_node',
      nodeType: 'condition',
    },
    {
      id: 'random',
      label: 'Ngẫu nhiên',
      description: 'Phân tán ngẫu nhiên các hướng xử lý',
      icon: <Shuffle size={18} />,
      color: '#3B82F6',
      action: 'create_node',
      nodeType: 'random',
    },
    {
      id: 'ai',
      label: 'AI',
      description: 'Áp dụng AI để tạo câu trả lời',
      icon: <Sparkles size={18} />,
      color: '#EC4899',
      action: 'create_node',
      nodeType: 'text', // placeholder
    },
  ]

  const handleOptionClick = (opt: NextStepOption) => {
    if (opt.id === 'select_message') {
      setSubMenu('select_message')
      return
    }
    if (opt.action === 'create_node' && opt.nodeType && opt.id !== 'ai') {
      onCreateNode(opt.nodeType)
    }
  }

  // Adjust position to stay within viewport
  const adjustedPos = {
    x: Math.min(position.x, window.innerWidth - 300),
    y: Math.min(position.y, window.innerHeight - 400),
  }

  return (
    <div
      ref={ref}
      className="fixed z-50"
      style={{ left: adjustedPos.x, top: adjustedPos.y }}
    >
      {/* Main picker */}
      {subMenu === null && (
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden"
          style={{ width: 280, boxShadow: '0 20px 60px rgba(0,0,0,0.15)' }}>
          <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-800">Chọn bước tiếp theo</h3>
            <button onClick={onClose} className="w-6 h-6 flex items-center justify-center rounded-md hover:bg-gray-100 text-gray-400">
              <X size={14} />
            </button>
          </div>
          <div className="py-1.5">
            {mainOptions.map((opt) => (
              <button
                key={opt.id}
                onClick={() => handleOptionClick(opt)}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left group"
              >
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-105"
                  style={{ background: opt.color + '18', color: opt.color }}
                >
                  {opt.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800">{opt.label}</p>
                  <p className="text-xs text-gray-400 truncate">{opt.description}</p>
                </div>
                {opt.id === 'select_message' && (
                  <ChevronRight size={16} className="text-gray-300 group-hover:text-gray-500 shrink-0" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Sub menu: Select existing node */}
      {subMenu === 'select_message' && (
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden"
          style={{ width: 280, boxShadow: '0 20px 60px rgba(0,0,0,0.15)' }}>
          <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-2">
            <button
              onClick={() => setSubMenu(null)}
              className="w-6 h-6 flex items-center justify-center rounded-md hover:bg-gray-100 text-gray-400"
            >
              <ChevronRight size={14} className="rotate-180" />
            </button>
            <h3 className="text-sm font-semibold text-gray-800">Chọn tin nhắn</h3>
            <button onClick={onClose} className="w-6 h-6 flex items-center justify-center rounded-md hover:bg-gray-100 text-gray-400 ml-auto">
              <X size={14} />
            </button>
          </div>
          <div className="py-1.5 max-h-64 overflow-y-auto">
            {eligibleNodes.length === 0 ? (
              <div className="px-4 py-6 text-center">
                <MessageSquare size={24} className="text-gray-200 mx-auto mb-2" />
                <p className="text-sm text-gray-400">Chưa có khối tin nhắn nào</p>
                <p className="text-xs text-gray-300 mt-1">Tạo node mới từ palette bên trái</p>
              </div>
            ) : (
              eligibleNodes.map((node) => {
                const color = NODE_COLOR[node.type] || '#6B7280'
                const label = NODE_LABEL[node.type] || node.type
                const idx = nodeIndex(node.id)
                return (
                  <button
                    key={node.id}
                    onClick={() => onSelectExistingNode(node.id)}
                    className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-blue-50 transition-colors text-left group"
                  >
                    <div
                      className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                      style={{ background: color + '18', color }}
                    >
                      <MessageSquare size={13} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-700 font-medium">{label} #{idx}</p>
                    </div>
                  </button>
                )
              })
            )}
          </div>
          {/* Also allow creating a new text node */}
          <div className="border-t border-gray-100 px-4 py-2">
            <button
              onClick={() => onCreateNode('text')}
              className="w-full text-center text-xs text-blue-600 hover:text-blue-700 py-1.5 font-medium"
            >
              + Tạo khối tin nhắn mới
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
