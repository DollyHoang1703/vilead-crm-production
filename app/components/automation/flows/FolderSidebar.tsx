'use client'

import React, { useState } from 'react'
import { FolderOpen, Folder, Plus, MoreHorizontal, Pencil, Trash2, ChevronRight } from 'lucide-react'
import { Folder as FolderType } from './types'
import { cn } from '@/lib/utils'

interface FolderSidebarProps {
  folders: FolderType[]
  selectedFolderId: string | null
  onSelect: (folderId: string | null) => void
  onCreateFolder: () => void
  onEditFolder: (folder: FolderType) => void
  onDeleteFolder: (folderId: string) => void
  totalCount: number
}

export default function FolderSidebar({
  folders,
  selectedFolderId,
  onSelect,
  onCreateFolder,
  onEditFolder,
  onDeleteFolder,
  totalCount,
}: FolderSidebarProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null)

  const handleMenuClick = (e: React.MouseEvent, folderId: string) => {
    e.stopPropagation()
    setMenuOpenId(menuOpenId === folderId ? null : folderId)
  }

  return (
    <div className="w-52 shrink-0 flex flex-col border-r border-gray-200 bg-gray-50 h-full">
      <div className="p-3 border-b border-gray-200">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-1">Thư mục</h3>
      </div>

      <nav className="flex-1 overflow-y-auto p-2 space-y-0.5">
        {/* All */}
        <button
          onClick={() => onSelect(null)}
          className={cn(
            'w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors',
            selectedFolderId === null
              ? 'bg-blue-50 text-blue-700 font-medium'
              : 'text-gray-700 hover:bg-white hover:shadow-sm'
          )}
        >
          <FolderOpen className={cn('w-4 h-4 shrink-0', selectedFolderId === null ? 'text-blue-600' : 'text-gray-400')} />
          <span className="flex-1 text-left truncate">Tất cả</span>
          <span className={cn(
            'text-xs font-medium px-1.5 py-0.5 rounded-full',
            selectedFolderId === null ? 'bg-blue-100 text-blue-700' : 'bg-gray-200 text-gray-600'
          )}>
            {totalCount}
          </span>
        </button>

        {/* Folders */}
        {folders.map((folder) => {
          const isSelected = selectedFolderId === folder.id
          const isHovered = hoveredId === folder.id
          const isMenuOpen = menuOpenId === folder.id

          return (
            <div
              key={folder.id}
              className="relative"
              onMouseEnter={() => setHoveredId(folder.id)}
              onMouseLeave={() => { setHoveredId(null); setMenuOpenId(null) }}
            >
              <button
                onClick={() => onSelect(folder.id)}
                className={cn(
                  'w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors',
                  isSelected
                    ? 'bg-blue-50 text-blue-700 font-medium'
                    : 'text-gray-700 hover:bg-white hover:shadow-sm'
                )}
              >
                <Folder className={cn('w-4 h-4 shrink-0', isSelected ? 'text-blue-600' : 'text-gray-400')} />
                <span className="flex-1 text-left truncate">{folder.name}</span>

                {/* count or menu button */}
                {isHovered && !folder.isDefault ? (
                  <button
                    onClick={(e) => handleMenuClick(e, folder.id)}
                    className="p-0.5 rounded hover:bg-gray-200 text-gray-500"
                  >
                    <MoreHorizontal className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <span className={cn(
                    'text-xs font-medium px-1.5 py-0.5 rounded-full',
                    isSelected ? 'bg-blue-100 text-blue-700' : 'bg-gray-200 text-gray-600'
                  )}>
                    {folder.flowCount}
                  </span>
                )}
              </button>

              {/* Context menu */}
              {isMenuOpen && (
                <div className="absolute right-0 top-8 z-30 bg-white rounded-lg shadow-lg border border-gray-200 py-1 min-w-32">
                  <button
                    onClick={() => { onEditFolder(folder); setMenuOpenId(null) }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <Pencil className="w-3.5 h-3.5 text-gray-400" />
                    Đổi tên
                  </button>
                  <button
                    onClick={() => { onDeleteFolder(folder.id); setMenuOpenId(null) }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Xóa thư mục
                  </button>
                </div>
              )}
            </div>
          )
        })}
      </nav>

      {/* Add folder button */}
      <div className="p-3 border-t border-gray-200">
        <button
          onClick={onCreateFolder}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-blue-600 hover:bg-blue-50 transition-colors font-medium"
        >
          <Plus className="w-4 h-4" />
          Thêm thư mục
        </button>
      </div>
    </div>
  )
}
