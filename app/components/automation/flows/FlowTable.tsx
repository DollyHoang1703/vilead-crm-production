'use client'

import React, { useState } from 'react'
import {
  MoreHorizontal, Pencil, Copy, Trash2,
  ChevronUp, ChevronDown, ExternalLink,
  CheckCircle2, Clock, Archive
} from 'lucide-react'
import { Flow, FlowStatus } from './types'
import { cn } from '@/lib/utils'
import { formatDistanceToNow } from 'date-fns'
import { vi } from 'date-fns/locale'

interface FlowTableProps {
  flows: Flow[]
  loading: boolean
  onEdit: (id: string) => void
  onDuplicate: (id: string) => void
  onDelete: (id: string) => void
  sortField: string
  sortOrder: 'asc' | 'desc'
  onSort: (field: string) => void
  // Pagination
  currentPage: number
  totalPages: number
  pageSize: number
  totalCount: number
  onPageChange: (page: number) => void
  onPageSizeChange: (size: number) => void
}

function StatusBadge({ status }: { status: FlowStatus }) {
  if (status === 'published') return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200">
      <CheckCircle2 className="w-3 h-3" />
      Đã xuất bản
    </span>
  )
  if (status === 'draft') return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200">
      <Clock className="w-3 h-3" />
      Bản nháp
    </span>
  )
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-red-50 text-red-600 border border-red-200">
      <Archive className="w-3 h-3" />
      Thùng rác
    </span>
  )
}

function SortHeader({
  label, field, currentField, currentOrder, onSort
}: { label: string; field: string; currentField: string; currentOrder: string; onSort: (f: string) => void }) {
  const isActive = currentField === field
  return (
    <button
      onClick={() => onSort(field)}
      className={cn(
        'flex items-center gap-1 text-xs font-semibold uppercase tracking-wider transition-colors',
        isActive ? 'text-blue-600' : 'text-gray-500 hover:text-gray-700'
      )}
    >
      {label}
      <span className="flex flex-col ml-0.5">
        <ChevronUp className={cn('w-3 h-3 -mb-1', isActive && currentOrder === 'asc' ? 'text-blue-600' : 'text-gray-300')} />
        <ChevronDown className={cn('w-3 h-3', isActive && currentOrder === 'desc' ? 'text-blue-600' : 'text-gray-300')} />
      </span>
    </button>
  )
}

export default function FlowTable({
  flows, loading, onEdit, onDuplicate, onDelete,
  sortField, sortOrder, onSort,
  currentPage, totalPages, pageSize, totalCount, onPageChange, onPageSizeChange,
}: FlowTableProps) {
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const toggleSelectAll = () => {
    if (selectedIds.size === flows.length) setSelectedIds(new Set())
    else setSelectedIds(new Set(flows.map(f => f.id)))
  }

  const formatTime = (dateStr: string) => {
    try {
      return formatDistanceToNow(new Date(dateStr), { addSuffix: true, locale: vi })
    } catch {
      return dateStr
    }
  }

  if (loading) return (
    <div className="flex-1 flex items-center justify-center py-20">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-gray-500">Đang tải...</p>
      </div>
    </div>
  )

  if (flows.length === 0) return (
    <div className="flex-1 flex flex-col items-center justify-center py-16 text-center">
      <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
        <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      </div>
      <h3 className="font-semibold text-gray-800 mb-1">Chưa có luồng tin nhắn nào</h3>
      <p className="text-sm text-gray-500">Tạo luồng đầu tiên để bắt đầu tự động hóa</p>
    </div>
  )

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <div className="flex-1 overflow-auto">
        <table className="w-full text-sm">
          <thead className="sticky top-0 bg-gray-50 z-10">
            <tr className="border-b border-gray-200">
              <th className="w-10 px-4 py-3">
                <input
                  type="checkbox"
                  checked={flows.length > 0 && selectedIds.size === flows.length}
                  onChange={toggleSelectAll}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </th>
              <th className="px-4 py-3 text-left">
                <SortHeader label="Tên luồng" field="name" currentField={sortField} currentOrder={sortOrder} onSort={onSort} />
              </th>
              <th className="px-4 py-3 text-left">
                <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">Thư mục</span>
              </th>
              <th className="px-4 py-3 text-left">
                <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">Shortcut</span>
              </th>
              <th className="px-4 py-3 text-left">
                <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">Trạng thái</span>
              </th>
              <th className="px-4 py-3 text-left">
                <SortHeader label="Cập nhật" field="updatedAt" currentField={sortField} currentOrder={sortOrder} onSort={onSort} />
              </th>
              <th className="w-10 px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {flows.map((flow) => (
              <tr
                key={flow.id}
                className={cn(
                  'group transition-colors hover:bg-blue-50/40',
                  selectedIds.has(flow.id) && 'bg-blue-50'
                )}
              >
                <td className="px-4 py-3">
                  <input
                    type="checkbox"
                    checked={selectedIds.has(flow.id)}
                    onChange={() => toggleSelect(flow.id)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    onClick={e => e.stopPropagation()}
                  />
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => onEdit(flow.id)}
                    className="flex items-center gap-2 font-medium text-gray-800 hover:text-blue-600 transition-colors group/name"
                  >
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shrink-0">
                      <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <span>{flow.name}</span>
                    <ExternalLink className="w-3.5 h-3.5 text-blue-400 opacity-0 group-hover/name:opacity-100 transition-opacity ml-0.5" />
                  </button>
                </td>
                <td className="px-4 py-3">
                  <span className="inline-flex items-center gap-1 text-gray-600">
                    <svg className="w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                    </svg>
                    {flow.folder.name}
                  </span>
                </td>
                <td className="px-4 py-3">
                  {flow.shortcut ? (
                    <code className="px-2 py-0.5 bg-purple-50 text-purple-700 rounded text-xs font-mono border border-purple-200">
                      {flow.shortcut}
                    </code>
                  ) : (
                    <span className="text-gray-400 text-xs">—</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={flow.status} />
                </td>
                <td className="px-4 py-3 text-gray-500 text-xs">
                  {formatTime(flow.updatedAt)}
                </td>
                <td className="px-4 py-3 relative">
                  <div className="relative">
                    <button
                      onClick={(e) => { e.stopPropagation(); setMenuOpenId(menuOpenId === flow.id ? null : flow.id) }}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </button>

                    {menuOpenId === flow.id && (
                      <>
                        <div className="fixed inset-0 z-10" onClick={() => setMenuOpenId(null)} />
                        <div className="absolute right-0 top-8 z-20 bg-white rounded-xl shadow-xl border border-gray-200 py-1.5 min-w-40 overflow-hidden">
                          <button
                            onClick={() => { onEdit(flow.id); setMenuOpenId(null) }}
                            className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                          >
                            <Pencil className="w-3.5 h-3.5 text-gray-400" />
                            Chỉnh sửa
                          </button>
                          <button
                            onClick={() => { onDuplicate(flow.id); setMenuOpenId(null) }}
                            className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                          >
                            <Copy className="w-3.5 h-3.5 text-gray-400" />
                            Nhân bản
                          </button>
                          <div className="border-t border-gray-100 my-1" />
                          <button
                            onClick={() => { onDelete(flow.id); setMenuOpenId(null) }}
                            className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            Xóa
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 bg-white shrink-0">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span>Hiển thị</span>
          <select
            value={pageSize}
            onChange={e => onPageSizeChange(Number(e.target.value))}
            className="border border-gray-200 rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {[10, 20, 50].map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <span>/ {totalCount} luồng</span>
        </div>

        <div className="flex items-center gap-1">
          <button
            disabled={currentPage <= 1}
            onClick={() => onPageChange(currentPage - 1)}
            className="px-3 py-1.5 text-sm rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            ← Trước
          </button>
          {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map(page => (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={cn(
                'w-8 h-8 text-sm rounded-lg transition-colors',
                currentPage === page
                  ? 'bg-blue-600 text-white font-medium'
                  : 'text-gray-600 hover:bg-gray-100'
              )}
            >
              {page}
            </button>
          ))}
          <button
            disabled={currentPage >= totalPages}
            onClick={() => onPageChange(currentPage + 1)}
            className="px-3 py-1.5 text-sm rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Sau →
          </button>
        </div>
      </div>
    </div>
  )
}
