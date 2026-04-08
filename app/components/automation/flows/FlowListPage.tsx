'use client'

import React, { useState, useMemo } from 'react'
import { Plus, Search, SlidersHorizontal, X, Pencil, Trash2, AlertTriangle } from 'lucide-react'
import { Flow, Folder, CreateFlowData } from './types'
import { MOCK_FOLDERS, MOCK_FLOWS } from './constants'
import FolderSidebar from './FolderSidebar'
import FlowTable from './FlowTable'
import CreateFlowModal from './CreateFlowModal'
import { cn } from '@/lib/utils'

interface FolderModal {
  mode: 'create' | 'edit'
  folder?: Folder
  name: string
  error?: string
}

interface FlowListPageProps {
  onOpenEditor: (flowId: string) => void
}

export default function FlowListPage({ onOpenEditor }: FlowListPageProps) {
  const [flows, setFlows] = useState<Flow[]>(MOCK_FLOWS)
  const [folders, setFolders] = useState<Folder[]>(MOCK_FOLDERS)
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [sortField, setSortField] = useState('updatedAt')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)
  const [createModalOpen, setCreateModalOpen] = useState(false)
  const [folderModal, setFolderModal] = useState<FolderModal | null>(null)
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)

  // ── Filtered & sorted flows ────────────────────────────────────────────
  const filteredFlows = useMemo(() => {
    let result = flows.filter(f => f.status !== 'trash')

    if (selectedFolderId) {
      result = result.filter(f => f.folder.id === selectedFolderId)
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      result = result.filter(f =>
        f.name.toLowerCase().includes(q) ||
        (f.shortcut || '').toLowerCase().includes(q)
      )
    }
    result = [...result].sort((a, b) => {
      let va: string, vb: string
      if (sortField === 'name') { va = a.name; vb = b.name }
      else { va = a.updatedAt; vb = b.updatedAt }
      return sortOrder === 'asc' ? va.localeCompare(vb) : vb.localeCompare(va)
    })
    return result
  }, [flows, selectedFolderId, searchQuery, sortField, sortOrder])

  const totalPages = Math.max(1, Math.ceil(filteredFlows.length / pageSize))
  const pagedFlows = filteredFlows.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  // ── Folder operations ──────────────────────────────────────────────────
  const handleCreateFolder = () => setFolderModal({ mode: 'create', name: '' })
  const handleEditFolder = (folder: Folder) => setFolderModal({ mode: 'edit', folder, name: folder.name })

  const handleSaveFolder = () => {
    if (!folderModal) return
    const name = folderModal.name.trim()
    if (!name) { setFolderModal(p => p ? { ...p, error: 'Tên thư mục là bắt buộc' } : null); return }
    if (folders.some(f => f.name === name && f.id !== folderModal.folder?.id)) {
      setFolderModal(p => p ? { ...p, error: 'Tên thư mục đã tồn tại' } : null); return
    }
    if (folderModal.mode === 'create') {
      const newFolder: Folder = { id: `f_${Date.now()}`, name, flowCount: 0, position: folders.length }
      setFolders(prev => [...prev, newFolder])
    } else if (folderModal.folder) {
      setFolders(prev => prev.map(f => f.id === folderModal.folder!.id ? { ...f, name } : f))
    }
    setFolderModal(null)
  }

  const handleDeleteFolder = (folderId: string) => {
    const folder = folders.find(f => f.id === folderId)
    if (!folder || folder.isDefault) return
    // Move flows to default
    setFlows(prev => prev.map(f =>
      f.folder.id === folderId
        ? { ...f, folder: { id: '00000000-0000-0000-0000-000000000001', name: 'Chưa phân loại' } }
        : f
    ))
    setFolders(prev => prev.filter(f => f.id !== folderId))
    if (selectedFolderId === folderId) setSelectedFolderId(null)
  }

  // ── Flow operations ────────────────────────────────────────────────────
  const handleCreateFlow = async (data: CreateFlowData): Promise<void> => {
    const folder = folders.find(f => f.id === data.folderId) || folders[0]
    const newFlow: Flow = {
      id: `flow_${Date.now()}`,
      name: data.name,
      shortcut: data.shortcut || null,
      folder: { id: folder.id, name: folder.name },
      status: 'draft',
      usedByCount: 0,
      updatedAt: new Date().toISOString(),
      createdBy: { id: 'u1', name: 'Admin' },
    }
    setFlows(prev => [newFlow, ...prev])
    setCreateModalOpen(false)
    onOpenEditor(newFlow.id)
  }

  const handleSort = (field: string) => {
    if (sortField === field) setSortOrder(o => o === 'asc' ? 'desc' : 'asc')
    else { setSortField(field); setSortOrder('desc') }
  }

  const handleDuplicate = (id: string) => {
    const flow = flows.find(f => f.id === id)
    if (!flow) return
    const copy: Flow = {
      ...flow,
      id: `flow_${Date.now()}`,
      name: `${flow.name} - Bản sao`,
      shortcut: null,
      status: 'draft',
      updatedAt: new Date().toISOString(),
    }
    setFlows(prev => [copy, ...prev])
  }

  const handleDelete = (id: string) => setDeleteConfirmId(id)
  const confirmDelete = () => {
    if (deleteConfirmId) {
      setFlows(prev => prev.filter(f => f.id !== deleteConfirmId))
      setDeleteConfirmId(null)
    }
  }

  // Folder flow counts
  const foldersWithCount = folders.map(f => ({
    ...f,
    flowCount: flows.filter(fl => fl.folder.id === f.id && fl.status !== 'trash').length,
  }))

  return (
    <div className="flex h-full overflow-hidden">
      <FolderSidebar
        folders={foldersWithCount}
        selectedFolderId={selectedFolderId}
        onSelect={(id) => { setSelectedFolderId(id); setCurrentPage(1) }}
        onCreateFolder={handleCreateFolder}
        onEditFolder={handleEditFolder}
        onDeleteFolder={handleDeleteFolder}
        totalCount={flows.filter(f => f.status !== 'trash').length}
      />

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <div className="flex items-center gap-3 px-5 py-3.5 border-b border-gray-200 bg-white shrink-0">
          {/* Search */}
          <div className="flex-1 relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => { setSearchQuery(e.target.value); setCurrentPage(1) }}
              placeholder="Tìm tên hoặc shortcut..."
              className="w-full pl-9 pr-8 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Sort */}
          <div className="flex items-center gap-1.5">
            <SlidersHorizontal className="w-4 h-4 text-gray-400" />
            <select
              value={`${sortField}-${sortOrder}`}
              onChange={e => {
                const [f, o] = e.target.value.split('-')
                setSortField(f); setSortOrder(o as 'asc' | 'desc')
              }}
              className="text-sm border border-gray-200 rounded-xl px-3 py-2 bg-white focus:outline-none focus:border-blue-400"
            >
              <option value="updatedAt-desc">Mới nhất</option>
              <option value="updatedAt-asc">Cũ nhất</option>
              <option value="name-asc">Tên A→Z</option>
              <option value="name-desc">Tên Z→A</option>
            </select>
          </div>

          {/* Create */}
          <button
            onClick={() => setCreateModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm font-medium rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all shadow-sm shrink-0"
          >
            <Plus className="w-4 h-4" />
            Tạo luồng mới
          </button>
        </div>

        {/* Results info */}
        {(searchQuery || selectedFolderId) && (
          <div className="px-5 py-2 bg-blue-50 border-b border-blue-100 text-xs text-blue-600">
            Tìm thấy <strong>{filteredFlows.length}</strong> luồng
            {searchQuery && ` cho "${searchQuery}"`}
            {selectedFolderId && ` trong "${foldersWithCount.find(f => f.id === selectedFolderId)?.name}"`}
          </div>
        )}

        {/* Table */}
        <FlowTable
          flows={pagedFlows}
          loading={false}
          onEdit={onOpenEditor}
          onDuplicate={handleDuplicate}
          onDelete={handleDelete}
          sortField={sortField}
          sortOrder={sortOrder}
          onSort={handleSort}
          currentPage={currentPage}
          totalPages={totalPages}
          pageSize={pageSize}
          totalCount={filteredFlows.length}
          onPageChange={setCurrentPage}
          onPageSizeChange={(s) => { setPageSize(s); setCurrentPage(1) }}
        />
      </div>

      {/* Modals */}
      <CreateFlowModal
        open={createModalOpen}
        folders={folders}
        defaultFolderId={selectedFolderId || undefined}
        onClose={() => setCreateModalOpen(false)}
        onSubmit={handleCreateFlow}
      />

      {/* Folder modal */}
      {folderModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setFolderModal(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl p-6 w-80">
            <h3 className="text-base font-semibold text-gray-900 mb-4">
              {folderModal.mode === 'create' ? 'Tạo thư mục mới' : 'Đổi tên thư mục'}
            </h3>
            <input
              type="text"
              value={folderModal.name}
              onChange={e => setFolderModal(p => p ? { ...p, name: e.target.value, error: undefined } : null)}
              placeholder="Tên thư mục"
              maxLength={50}
              autoFocus
              onKeyDown={e => e.key === 'Enter' && handleSaveFolder()}
              className={cn(
                'w-full px-3.5 py-2.5 rounded-xl border text-sm outline-none',
                folderModal.error ? 'border-red-300 ring-2 ring-red-100' : 'border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100'
              )}
            />
            {folderModal.error && <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1"><AlertTriangle className="w-3.5 h-3.5" />{folderModal.error}</p>}
            <div className="flex gap-3 mt-5">
              <button onClick={() => setFolderModal(null)} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-700 hover:bg-gray-50">Hủy</button>
              <button onClick={handleSaveFolder} className="flex-1 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700">Lưu</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirm */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setDeleteConfirmId(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl p-6 w-80 text-center">
            <div className="w-12 h-12 bg-red-50 rounded-xl mx-auto flex items-center justify-center mb-4">
              <Trash2 className="w-6 h-6 text-red-500" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-1.5">Xóa luồng tin nhắn?</h3>
            <p className="text-sm text-gray-500 mb-5">Hành động này không thể hoàn tác.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirmId(null)} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-700 hover:bg-gray-50">Hủy</button>
              <button onClick={confirmDelete} className="flex-1 py-2.5 rounded-xl bg-red-600 text-white text-sm font-medium hover:bg-red-700">Xóa</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
