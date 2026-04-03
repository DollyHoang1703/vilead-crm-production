'use client'

import React, { useState } from 'react'
import { X, Search, Plus, MoreHorizontal, Edit, Trash2 } from 'lucide-react'

export interface ChatTag {
  id: string
  name: string
  color: string
}

export const SolidTagIcon = ({ color, className = "w-[14px] h-[14px]" }: { color: string; className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className={className}>
    <path fill={color} d="M4 4h9.17a2 2 0 0 1 1.41.59l6.59 6.59a2 2 0 0 1 0 2.83l-6.59 6.59a2 2 0 0 1-1.41.58H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" />
  </svg>
)

export const PRESET_COLORS = [
  '#EF4444', // Red
  '#22C55E', // Green
  '#F97316', // Orange
  '#3B82F6', // Blue
  '#EAB308', // Yellow
  '#EC4899', // Pink
  '#8B5CF6', // Purple
  '#14B8A6', // Teal
]

interface TagManagementModalProps {
  isOpen: boolean
  onClose: () => void
  tags: ChatTag[]
  onAddTag: (tag: ChatTag) => void
  onUpdateTag: (tag: ChatTag) => void
  onDeleteTag: (id: string) => void
}

export function TagManagementModal({
  isOpen,
  onClose,
  tags,
  onAddTag,
  onUpdateTag,
  onDeleteTag
}: TagManagementModalProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [isCreating, setIsCreating] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  
  const [tagName, setTagName] = useState('')
  const [tagColor, setTagColor] = useState(PRESET_COLORS[0])
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null)

  if (!isOpen) return null

  const filteredTags = tags.filter(t => t.name.toLowerCase().includes(searchTerm.toLowerCase()))

  const handleCreate = () => {
    if (!tagName.trim()) return
    onAddTag({
      id: `tag_${Date.now()}`,
      name: tagName.trim(),
      color: tagColor
    })
    setTagName('')
    setTagColor(PRESET_COLORS[0])
    setIsCreating(false)
  }

  const handleUpdate = () => {
    if (!tagName.trim() || !editingId) return
    onUpdateTag({
      id: editingId,
      name: tagName.trim(),
      color: tagColor
    })
    setTagName('')
    setTagColor(PRESET_COLORS[0])
    setEditingId(null)
  }

  const startEdit = (tag: ChatTag) => {
    setEditingId(tag.id)
    setTagName(tag.name)
    setTagColor(tag.color)
    setIsCreating(false)
    setActiveMenuId(null)
  }

  const startCreate = () => {
    setEditingId(null)
    setTagName('')
    setTagColor(PRESET_COLORS[0])
    setIsCreating(true)
    setActiveMenuId(null)
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="px-5 py-3 border-b flex justify-between items-center bg-gray-50/50">
          <h3 className="font-semibold text-gray-900">Quản lý thẻ phân loại</h3>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-200 text-gray-500">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          
          {/* Editor Form */}
          {(isCreating || editingId) && (
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-3 mb-4">
              <div>
                <label className="text-xs font-medium text-gray-700 mb-1 block">Tên thẻ mới</label>
                <input 
                  autoFocus
                  type="text" 
                  value={tagName}
                  onChange={e => setTagName(e.target.value)}
                  placeholder="Nhập tên thẻ phân loại"
                  className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-700 mb-1 block">Màu sắc</label>
                <div className="flex flex-wrap gap-2">
                  {PRESET_COLORS.map(color => (
                    <button
                      key={color}
                      onClick={() => setTagColor(color)}
                      style={{ backgroundColor: color }}
                      className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                        tagColor === color ? 'ring-2 ring-offset-1 ring-blue-500 scale-110' : 'hover:scale-110'
                      }`}
                    />
                  ))}
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button 
                  onClick={() => {
                    setIsCreating(false);
                    setEditingId(null);
                  }}
                  className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-200 rounded-md"
                >
                  Hủy
                </button>
                <button 
                  onClick={isCreating ? handleCreate : handleUpdate}
                  disabled={!tagName.trim()}
                  className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  {isCreating ? 'Thêm thẻ' : 'Lưu lại'}
                </button>
              </div>
            </div>
          )}

          {/* Search & Add */}
          {!isCreating && !editingId && (
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  type="text" 
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  placeholder="Tìm kiếm thẻ..."
                  className="w-full pl-9 pr-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button 
                onClick={startCreate}
                className="flex items-center gap-1 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-100"
              >
                <Plus className="w-4 h-4" /> Thêm thẻ
              </button>
            </div>
          )}

          {/* Tag List */}
          <div className="space-y-1 mt-4">
            {filteredTags.length === 0 ? (
              <p className="text-center text-sm text-gray-500 py-8">Không tìm thấy thẻ nào</p>
            ) : (
              filteredTags.map(tag => (
                <div key={tag.id} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg group">
                  <div className="flex items-center gap-3">
                    <SolidTagIcon color={tag.color} className="w-3.5 h-3.5" />
                    <span className="text-sm font-medium text-gray-800">{tag.name}</span>
                  </div>
                  
                  <div className="relative">
                    <button 
                      onClick={() => setActiveMenuId(activeMenuId === tag.id ? null : tag.id)}
                      className="p-1 text-gray-400 hover:text-gray-700 hover:bg-gray-200 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                    
                    {activeMenuId === tag.id && (
                      <div className="absolute right-0 top-full mt-1 w-32 bg-white border rounded-lg shadow-lg z-10 py-1 overflow-hidden">
                        <div className="fixed inset-0 z-[-1]" onClick={() => setActiveMenuId(null)} />
                        <button 
                          onClick={() => startEdit(tag)}
                          className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        >
                          <Edit className="w-4 h-4" /> Chỉnh sửa
                        </button>
                        <button 
                          onClick={() => {
                            onDeleteTag(tag.id);
                            setActiveMenuId(null);
                          }}
                          className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" /> Xóa
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

        </div>
      </div>
    </div>
  )
}
