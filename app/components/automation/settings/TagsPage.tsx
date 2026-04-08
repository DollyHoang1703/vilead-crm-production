'use client'

import React, { useState, useRef, useEffect } from 'react'
import {
  Search, Plus, MoreHorizontal, Tag as TagIcon, Pencil,
  Link2, Trash2, X, Check, ChevronDown, AlertTriangle, Info
} from 'lucide-react'
import { Tag, SelectOption, TAG_COLORS } from './types'
import { MOCK_TAGS, MOCK_SEQUENCES } from './mockData'

// ─── Color Dot ─────────────────────────────────────────────────────────────────
function ColorDot({ color, size = 10 }: { color: string; size?: number }) {
  return <span className="inline-block rounded-full shrink-0" style={{ width: size, height: size, background: color }} />
}

// ─── Tag Badge ─────────────────────────────────────────────────────────────────
function TagBadge({ tag }: { tag: Pick<Tag, 'name' | 'color'> }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium" style={{ background: tag.color + '18', color: tag.color }}>
      <ColorDot color={tag.color} size={6} />
      {tag.name}
    </span>
  )
}

// ─── Color Picker ──────────────────────────────────────────────────────────────
function ColorPicker({ value, onChange }: { value: string; onChange: (c: string) => void }) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      {TAG_COLORS.map(c => (
        <button
          key={c.value}
          type="button"
          onClick={() => onChange(c.value)}
          className="w-8 h-8 rounded-full flex items-center justify-center transition-transform hover:scale-110 focus:outline-none"
          style={{ background: c.value }}
          title={c.label}
        >
          {value === c.value && <Check size={14} color="white" strokeWidth={3} />}
        </button>
      ))}
    </div>
  )
}

// ─── Action Menu ───────────────────────────────────────────────────────────────
function ActionMenu({ tag, onEdit, onLink, onDelete, onClose }: {
  tag: Tag; onEdit: () => void; onLink: () => void; onDelete: () => void; onClose: () => void
}) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const handle = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) onClose() }
    document.addEventListener('mousedown', handle)
    return () => document.removeEventListener('mousedown', handle)
  }, [onClose])

  return (
    <div ref={ref} className="absolute right-0 top-8 z-50 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden" style={{ minWidth: 180 }}>
      <button onClick={() => { onEdit(); onClose() }} className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors text-left">
        <Pencil size={14} className="text-gray-400" /> Sửa tag
      </button>
      <button onClick={() => { onLink(); onClose() }} className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors text-left">
        <Link2 size={14} className="text-gray-400" /> Liên kết kịch bản
      </button>
      <div className="border-t border-gray-100 my-0.5" />
      <button onClick={() => { onDelete(); onClose() }} className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors text-left">
        <Trash2 size={14} /> Xóa tag
      </button>
    </div>
  )
}

// ─── Create/Edit Tag Modal ──────────────────────────────────────────────────────
function TagModal({ tag, onClose, onSubmit }: {
  tag?: Tag; onClose: () => void; onSubmit: (data: { name: string; color: string }) => void
}) {
  const [name, setName] = useState(tag?.name || '')
  const [color, setColor] = useState(tag?.color || '#3B82F6')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) { setError('Vui lòng nhập tên tag'); return }
    if (name.trim().length > 50) { setError('Tên tag tối đa 50 ký tự'); return }
    setSubmitting(true)
    await new Promise(r => setTimeout(r, 400))
    onSubmit({ name: name.trim(), color })
    setSubmitting(false)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-bold text-gray-900">{tag ? 'Sửa tag' : 'Thêm thẻ mới'}</h2>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400">
            <X size={16} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-5">
          {/* Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Tên thẻ <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={e => { setName(e.target.value); setError('') }}
              placeholder="Nhập tên tag..."
              maxLength={50}
              className={`w-full px-3.5 py-2.5 text-sm bg-white border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${error ? 'border-red-400' : 'border-gray-200'}`}
            />
            <div className="flex items-center justify-between mt-1.5">
              {error ? <p className="text-xs text-red-500">{error}</p> : <span />}
              <span className="text-xs text-gray-300">{name.length}/50</span>
            </div>
          </div>

          {/* Color */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Màu sắc</label>
            <div className="p-3 bg-gray-50 rounded-xl">
              <ColorPicker value={color} onChange={setColor} />
            </div>
          </div>

          {/* Preview */}
          <div>
            <p className="text-xs text-gray-500 mb-2 font-medium">Xem trước:</p>
            <TagBadge tag={{ name: name || 'Tên tag', color }} />
          </div>

          <div className="flex items-center gap-3 pt-1">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
              Hủy
            </button>
            <button type="submit" disabled={submitting} className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
              {submitting ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : null}
              {tag ? 'Lưu thay đổi' : 'Tạo thẻ'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ─── Link Sequence Modal ────────────────────────────────────────────────────────
function LinkSequenceModal({ tag, sequences, onClose, onSubmit }: {
  tag: Tag; sequences: SelectOption[]; onClose: () => void;
  onSubmit: (sequenceId: string | null) => void
}) {
  const [selected, setSelected] = useState<string | null>(tag.sequence?.id || null)
  const [submitting, setSubmitting] = useState(false)
  const [open, setOpen] = useState(false)

  const handleSubmit = async () => {
    setSubmitting(true)
    await new Promise(r => setTimeout(r, 400))
    onSubmit(selected)
    setSubmitting(false)
  }

  const selectedSeq = sequences.find(s => s.id === selected)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-bold text-gray-900">Liên kết kịch bản</h2>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400">
            <X size={16} />
          </button>
        </div>
        <div className="px-6 py-5 space-y-5">
          {/* Tag badge */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Tag:</span>
            <TagBadge tag={tag} />
          </div>

          {/* Dropdown */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Chọn kịch bản liên kết</label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setOpen(o => !o)}
                className="w-full flex items-center justify-between px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-sm hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              >
                <span className={selectedSeq ? 'text-gray-800' : 'text-gray-400'}>
                  {selectedSeq ? selectedSeq.name : 'Chọn kịch bản...'}
                </span>
                <ChevronDown size={15} className={`text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`} />
              </button>
              {open && (
                <div className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden max-h-56 overflow-y-auto">
                  <button
                    onClick={() => { setSelected(null); setOpen(false) }}
                    className={`w-full flex items-center gap-2 px-4 py-2.5 text-sm text-left hover:bg-gray-50 transition-colors ${!selected ? 'text-blue-600 bg-blue-50' : 'text-gray-500'}`}
                  >
                    {!selected && <Check size={14} />}
                    <span>Không liên kết</span>
                  </button>
                  <div className="border-t border-gray-100" />
                  {sequences.map(seq => (
                    <button
                      key={seq.id}
                      onClick={() => { setSelected(seq.id); setOpen(false) }}
                      className={`w-full flex items-center gap-2 px-4 py-2.5 text-sm text-left hover:bg-gray-50 transition-colors ${selected === seq.id ? 'text-blue-600 bg-blue-50' : 'text-gray-700'}`}
                    >
                      {selected === seq.id && <Check size={14} />}
                      <span className={selected === seq.id ? 'ml-0' : 'ml-5'}>{seq.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Info */}
          <div className="flex items-start gap-2.5 p-3.5 bg-blue-50 rounded-xl">
            <Info size={15} className="text-blue-500 mt-0.5 shrink-0" />
            <p className="text-xs text-blue-700 leading-relaxed">
              Khi gắn tag này cho hội thoại, khách hàng sẽ tự động được đăng ký vào kịch bản đã chọn.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button onClick={onClose} className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
              Hủy
            </button>
            <button onClick={handleSubmit} disabled={submitting} className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
              {submitting && <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
              Lưu
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Delete Tag Modal ───────────────────────────────────────────────────────────
function DeleteTagModal({ tag, onClose, onConfirm }: {
  tag: Tag; onClose: () => void; onConfirm: () => void
}) {
  const [submitting, setSubmitting] = useState(false)
  const hasWarning = tag.conversationCount > 0 || !!tag.sequence

  const handleConfirm = async () => {
    setSubmitting(true)
    await new Promise(r => setTimeout(r, 500))
    onConfirm()
    setSubmitting(false)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-bold text-gray-900">Xóa tag</h2>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400">
            <X size={16} />
          </button>
        </div>
        <div className="px-6 py-5 space-y-4">
          <p className="text-sm text-gray-600">Bạn có chắc muốn xóa tag này?</p>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Tag:</span>
            <TagBadge tag={tag} />
          </div>
          {hasWarning && (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl space-y-2">
              <div className="flex items-center gap-2">
                <AlertTriangle size={15} className="text-amber-500 shrink-0" />
                <span className="text-sm font-semibold text-amber-700">Tag đang được sử dụng:</span>
              </div>
              <ul className="text-xs text-amber-700 space-y-1 ml-2 list-disc list-inside">
                {tag.conversationCount > 0 && <li>{tag.conversationCount} hội thoại đang gắn tag này</li>}
                {tag.sequence && <li>Đang liên kết với kịch bản: <strong>"{tag.sequence.name}"</strong></li>}
              </ul>
              <p className="text-xs text-amber-600 mt-1.5">Xóa tag sẽ tự động gỡ khỏi các hội thoại và hủy liên kết kịch bản.</p>
            </div>
          )}
          <div className="flex items-center gap-3 pt-1">
            <button onClick={onClose} className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
              Hủy
            </button>
            <button onClick={handleConfirm} disabled={submitting} className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-xl text-sm font-semibold hover:bg-red-700 transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
              {submitting && <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
              Xác nhận xóa
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Main Tags Page ─────────────────────────────────────────────────────────────
export default function TagsPage() {
  const [tags, setTags] = useState<Tag[]>(MOCK_TAGS)
  const [search, setSearch] = useState('')
  const [activeMenu, setActiveMenu] = useState<string | null>(null)
  const [modal, setModal] = useState<{
    type: 'create' | 'edit' | 'link' | 'delete'; tag?: Tag
  } | null>(null)

  const filtered = tags.filter(t => t.name.toLowerCase().includes(search.toLowerCase()))

  const handleCreate = (data: { name: string; color: string }) => {
    const newTag: Tag = {
      id: `t${Date.now()}`,
      name: data.name,
      color: data.color,
      sequence: null,
      conversationCount: 0,
      createdAt: new Date().toISOString(),
    }
    setTags(prev => [...prev, newTag])
    setModal(null)
  }

  const handleEdit = (tag: Tag, data: { name: string; color: string }) => {
    setTags(prev => prev.map(t => t.id === tag.id ? { ...t, ...data } : t))
    setModal(null)
  }

  const handleLinkSequence = (tag: Tag, sequenceId: string | null) => {
    const seq = sequenceId ? MOCK_SEQUENCES.find(s => s.id === sequenceId) || null : null
    setTags(prev => prev.map(t => t.id === tag.id ? { ...t, sequence: seq ? { id: seq.id, name: seq.name } : null } : t))
    setModal(null)
  }

  const handleDelete = (tag: Tag) => {
    setTags(prev => prev.filter(t => t.id !== tag.id))
    setModal(null)
  }

  return (
    <div className="h-full flex flex-col">
      {/* Page header */}
      <div className="px-6 py-5 border-b border-gray-100">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
              <TagIcon size={20} className="text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Quản lý Tags</h2>
              <p className="text-sm text-gray-500 mt-0.5">Quản lý các tags để phân loại hội thoại và trigger kịch bản tự động</p>
            </div>
          </div>
          <button
            onClick={() => setModal({ type: 'create' })}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors shadow-sm"
          >
            <Plus size={16} />
            Thêm thẻ
          </button>
        </div>

        {/* Search */}
        <div className="mt-4 relative max-w-sm">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm kiếm tag..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
          />
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-3 text-center">
            <div className="w-14 h-14 rounded-2xl bg-gray-50 border-2 border-dashed border-gray-200 flex items-center justify-center">
              <TagIcon size={24} className="text-gray-300" />
            </div>
            <p className="text-sm font-medium text-gray-500">Không tìm thấy tag nào</p>
            {search && <button onClick={() => setSearch('')} className="text-xs text-blue-600 hover:underline">Xóa bộ lọc</button>}
          </div>
        ) : (
          <table className="w-full">
            <thead className="sticky top-0 bg-gray-50 z-10">
              <tr>
                <th className="text-left text-xs font-semibold text-gray-500 px-6 py-3 w-12">Màu</th>
                <th className="text-left text-xs font-semibold text-gray-500 px-3 py-3">Tên tag</th>
                <th className="text-left text-xs font-semibold text-gray-500 px-3 py-3">Kịch bản liên kết</th>
                <th className="text-right text-xs font-semibold text-gray-500 px-3 py-3">Hội thoại</th>
                <th className="w-12 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map(tag => (
                <tr key={tag.id} className="hover:bg-gray-50 transition-colors group">
                  <td className="px-6 py-3.5">
                    <ColorDot color={tag.color} size={14} />
                  </td>
                  <td className="px-3 py-3.5">
                    <TagBadge tag={tag} />
                  </td>
                  <td className="px-3 py-3.5">
                    {tag.sequence ? (
                      <span className="flex items-center gap-1.5 text-sm text-gray-700">
                        <Link2 size={13} className="text-blue-500" />
                        {tag.sequence.name}
                      </span>
                    ) : (
                      <button
                        onClick={() => setModal({ type: 'link', tag })}
                        className="text-xs text-gray-400 hover:text-blue-500 italic flex items-center gap-1 transition-colors"
                      >
                        <Plus size={11} />
                        Liên kết kịch bản
                      </button>
                    )}
                  </td>
                  <td className="px-3 py-3.5 text-right">
                    <span className="text-sm font-semibold text-gray-700">{tag.conversationCount.toLocaleString()}</span>
                  </td>
                  <td className="px-3 py-3.5 relative">
                    <button
                      onClick={() => setActiveMenu(activeMenu === tag.id ? null : tag.id)}
                      className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-700 opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <MoreHorizontal size={16} />
                    </button>
                    {activeMenu === tag.id && (
                      <ActionMenu
                        tag={tag}
                        onEdit={() => setModal({ type: 'edit', tag })}
                        onLink={() => setModal({ type: 'link', tag })}
                        onDelete={() => setModal({ type: 'delete', tag })}
                        onClose={() => setActiveMenu(null)}
                      />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Footer count */}
      {filtered.length > 0 && (
        <div className="px-6 py-3 border-t border-gray-100 bg-white">
          <p className="text-xs text-gray-400">Hiển thị {filtered.length} / {tags.length} tags</p>
        </div>
      )}

      {/* Modals */}
      {modal?.type === 'create' && (
        <TagModal onClose={() => setModal(null)} onSubmit={handleCreate} />
      )}
      {modal?.type === 'edit' && modal.tag && (
        <TagModal
          tag={modal.tag}
          onClose={() => setModal(null)}
          onSubmit={(data) => handleEdit(modal.tag!, data)}
        />
      )}
      {modal?.type === 'link' && modal.tag && (
        <LinkSequenceModal
          tag={modal.tag}
          sequences={MOCK_SEQUENCES}
          onClose={() => setModal(null)}
          onSubmit={(seqId) => handleLinkSequence(modal.tag!, seqId)}
        />
      )}
      {modal?.type === 'delete' && modal.tag && (
        <DeleteTagModal
          tag={modal.tag}
          onClose={() => setModal(null)}
          onConfirm={() => handleDelete(modal.tag!)}
        />
      )}
    </div>
  )
}
