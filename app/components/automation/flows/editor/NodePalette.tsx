'use client'

import React, { useState } from 'react'
import {
  MessageSquare, Image, Video, Mic, Paperclip, LayoutGrid,
  MousePointerClick, MessageCircle, Clock, GitBranch, Shuffle,
  Timer, Zap, GripVertical, Search, ChevronDown, ChevronRight
} from 'lucide-react'
import { NodeType } from '../types'
import { NODE_CATEGORIES, NODE_COLOR, NODE_ICON_BG } from '../constants'

const ICON_MAP: Record<string, React.ComponentType<any>> = {
  MessageSquare, Image, Video, Mic, Paperclip, LayoutGrid,
  MousePointerClick, MessageCircle, Clock, GitBranch, Shuffle,
  Timer, Zap, Music: Mic, File: Paperclip, Layers: LayoutGrid,
  ToggleLeft: MousePointerClick,
}

interface NodePaletteProps {
  onDragStart: (e: React.DragEvent, nodeType: NodeType) => void
}

export default function NodePalette({ onDragStart }: NodePaletteProps) {
  const [search, setSearch] = useState('')
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({})

  const toggleCategory = (id: string) => {
    setCollapsed(prev => ({ ...prev, [id]: !prev[id] }))
  }

  // Filter nodes by search
  const filteredCategories = NODE_CATEGORIES.map(cat => ({
    ...cat,
    nodes: search
      ? cat.nodes.filter(n => n.label.toLowerCase().includes(search.toLowerCase()) || n.description?.toLowerCase().includes(search.toLowerCase()))
      : cat.nodes,
  })).filter(cat => cat.nodes.length > 0)

  return (
    <div
      className="flex flex-col overflow-hidden shrink-0"
      style={{ width: 240, background: 'white', borderRight: '1px solid #E5E7EB' }}
    >
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-100">
        <h3 className="text-sm font-bold text-gray-800 mb-2.5">Thêm node</h3>
        <div className="relative">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm kiếm..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-2 text-xs text-gray-600 bg-gray-50 border border-gray-200 rounded-xl placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Node list */}
      <div className="flex-1 overflow-y-auto py-2">
        {filteredCategories.map(category => {
          const isCollapsed = collapsed[category.id]
          return (
            <div key={category.id} className="mb-1">
              {/* Category header */}
              <button
                onClick={() => toggleCategory(category.id)}
                className="w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-50 transition-colors"
              >
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wide flex-1 text-left">{category.label}</span>
                {isCollapsed
                  ? <ChevronRight size={12} className="text-gray-400" />
                  : <ChevronDown size={12} className="text-gray-400" />
                }
              </button>

              {/* Node items */}
              {!isCollapsed && (
                <div className="px-2 pb-1">
                  {category.nodes.map(node => {
                    const IconComp = ICON_MAP[node.icon] || MessageSquare
                    const color = NODE_COLOR[node.type] || '#6B7280'
                    const bg = NODE_ICON_BG[node.type] || '#F3F4F6'

                    return (
                      <div
                        key={node.type}
                        draggable
                        onDragStart={e => onDragStart(e, node.type as NodeType)}
                        className="group flex items-center gap-3 px-2.5 py-2.5 rounded-xl hover:bg-gray-50 cursor-grab active:cursor-grabbing transition-colors select-none"
                        title={node.description}
                      >
                        <div
                          className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                          style={{ background: bg }}
                        >
                          <IconComp size={15} style={{ color }} strokeWidth={2} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-gray-700 leading-tight">{node.label}</p>
                          {node.description && (
                            <p className="text-[10px] text-gray-400 truncate mt-0.5">{node.description}</p>
                          )}
                        </div>
                        <GripVertical size={12} className="text-gray-300 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Footer hint */}
      <div className="px-4 py-3 border-t border-gray-100">
        <p className="text-[10px] text-gray-300 text-center leading-relaxed">
          Kéo và thả để thêm node vào canvas
        </p>
      </div>
    </div>
  )
}
