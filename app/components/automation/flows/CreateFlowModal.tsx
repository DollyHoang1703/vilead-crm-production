'use client'

import React, { useState, useEffect } from 'react'
import { X, Zap, FolderOpen, Hash, AlertCircle } from 'lucide-react'
import { CreateFlowData, Folder } from './types'
import { cn } from '@/lib/utils'

interface CreateFlowModalProps {
  open: boolean
  folders: Folder[]
  defaultFolderId?: string
  onClose: () => void
  onSubmit: (data: CreateFlowData) => Promise<void>
}

export default function CreateFlowModal({
  open, folders, defaultFolderId, onClose, onSubmit
}: CreateFlowModalProps) {
  const [name, setName] = useState('')
  const [folderId, setFolderId] = useState(defaultFolderId || folders[0]?.id || '')
  const [shortcut, setShortcut] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (open) {
      setName('')
      setFolderId(defaultFolderId || folders[0]?.id || '')
      setShortcut('')
      setErrors({})
      setSubmitting(false)
    }
  }, [open, defaultFolderId, folders])

  const validate = () => {
    const errs: Record<string, string> = {}
    if (!name.trim()) errs.name = 'Tên luồng là bắt buộc'
    else if (name.length > 100) errs.name = 'Tên luồng tối đa 100 ký tự'
    if (shortcut) {
      if (shortcut.includes(' ')) errs.shortcut = 'Shortcut không được chứa khoảng trắng'
      else if (shortcut.length > 20) errs.shortcut = 'Shortcut tối đa 20 ký tự'
    }
    return errs
  }

  const handleShortcutChange = (val: string) => {
    // Always start with /
    if (!val.startsWith('/') && val.length > 0) val = '/' + val
    setShortcut(val)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setSubmitting(true)
    try {
      await onSubmit({
        name: name.trim(),
        folderId: folderId || undefined,
        shortcut: shortcut.trim() || undefined,
      })
    } finally {
      setSubmitting(false)
    }
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
        {/* Header */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-100">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-sm">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-gray-900">Tạo luồng tin nhắn mới</h2>
            <p className="text-xs text-gray-500 mt-0.5">Thiết lập thông tin cơ bản</p>
          </div>
          <button
            onClick={onClose}
            className="ml-auto p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-5">
          {/* Name */}
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700">
              Tên luồng <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={e => { setName(e.target.value); setErrors(p => ({ ...p, name: '' })) }}
              placeholder="VD: Chào mừng khách hàng mới"
              autoFocus
              className={cn(
                'w-full px-3.5 py-2.5 rounded-xl border text-sm outline-none transition-all',
                errors.name
                  ? 'border-red-300 ring-2 ring-red-100 focus:border-red-400'
                  : 'border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100'
              )}
            />
            {errors.name && (
              <p className="flex items-center gap-1 text-xs text-red-500">
                <AlertCircle className="w-3 h-3" /> {errors.name}
              </p>
            )}
          </div>

          {/* Folder */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700">
              <FolderOpen className="w-3.5 h-3.5 text-gray-400" />
              Thư mục
            </label>
            <select
              value={folderId}
              onChange={e => setFolderId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all bg-white"
            >
              {folders.map(f => (
                <option key={f.id} value={f.id}>{f.name}</option>
              ))}
            </select>
          </div>

          {/* Shortcut */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700">
              <Hash className="w-3.5 h-3.5 text-gray-400" />
              Shortcut <span className="text-gray-400 font-normal">(tùy chọn)</span>
            </label>
            <input
              type="text"
              value={shortcut}
              onChange={e => { handleShortcutChange(e.target.value); setErrors(p => ({ ...p, shortcut: '' })) }}
              placeholder="/chao"
              className={cn(
                'w-full px-3.5 py-2.5 rounded-xl border text-sm font-mono outline-none transition-all',
                errors.shortcut
                  ? 'border-red-300 ring-2 ring-red-100'
                  : 'border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100'
              )}
            />
            {errors.shortcut ? (
              <p className="flex items-center gap-1 text-xs text-red-500">
                <AlertCircle className="w-3 h-3" /> {errors.shortcut}
              </p>
            ) : (
              <p className="text-xs text-gray-500 flex items-center gap-1">
                <span className="text-blue-500">ℹ</span>
                Dùng để gọi nhanh luồng trong cửa sổ chat
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm font-medium hover:from-blue-600 hover:to-blue-700 transition-all shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Đang tạo...
                </span>
              ) : 'Tạo và Mở Editor'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
