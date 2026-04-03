'use client'

import React, { useState } from 'react'
import {
  Search,
  Folder,
  User,
  Inbox,
  Eye,
  Copy,
  Edit,
  Trash2,
  MoreVertical,
  Calendar,
  MessageSquare
} from 'lucide-react'

import { ZbsTemplateEditorModal } from './ZbsTemplateEditorModal';
import { ZbsPreviewModal, ZbsDeleteTemplateModal } from './ZbsTemplateModals';

// ==================== TYPES ====================
interface ZbsTemplate {
  id: string
  name: string
  category: string
  description: string
  status: 'approved' | 'pending' | 'rejected'
  usageCount: number
  updatedAt: string
  type: 'system' | 'user'
  content?: string
  buttons?: Array<{ type: 'web' | 'phone', label: string, value: string }>
}

// ==================== MOCK DATA ====================
const mockSystemTemplates: ZbsTemplate[] = [
  {
    id: 'zbs-tpl-1',
    name: 'Chào mừng khách hàng mới',
    category: 'Chào mừng',
    description: 'Template chào mừng khi có khách hàng mới đăng ký',
    status: 'approved',
    usageCount: 1250,
    updatedAt: '2026-01-15T00:00:00Z',
    type: 'system'
  },
  {
    id: 'zbs-tpl-2',
    name: 'Xác nhận đơn hàng',
    category: 'Giao dịch',
    description: 'Thông báo xác nhận đơn hàng đã được tiếp nhận',
    status: 'approved',
    usageCount: 890,
    updatedAt: '2026-01-10T00:00:00Z',
    type: 'system'
  },
  {
    id: 'zbs-tpl-3',
    name: 'Nhắc lịch hẹn',
    category: 'Nhắc nhở',
    description: 'Nhắc nhở khách hàng về lịch hẹn sắp tới',
    status: 'approved',
    usageCount: 670,
    updatedAt: '2026-01-08T00:00:00Z',
    type: 'system'
  },
  {
    id: 'zbs-tpl-4',
    name: 'Khuyến mãi đặc biệt',
    category: 'Khuyến mãi',
    description: 'Thông báo chương trình khuyến mãi, giảm giá',
    status: 'approved',
    usageCount: 2100,
    updatedAt: '2026-01-20T00:00:00Z',
    type: 'system'
  },
]

const mockUserTemplates: ZbsTemplate[] = [
  {
    id: 'zbs-utpl-1',
    name: 'Chương trình Tết 2026',
    category: 'Khuyến mãi',
    description: 'Template khuyến mãi Tết Nguyên Đán 2026',
    status: 'approved',
    usageCount: 45,
    updatedAt: '2026-01-28T00:00:00Z',
    type: 'user'
  },
  {
    id: 'zbs-utpl-2',
    name: 'Follow up khách hàng VIP',
    category: 'Chăm sóc',
    description: 'Template chăm sóc dành cho khách VIP',
    status: 'approved',
    usageCount: 23,
    updatedAt: '2026-01-20T00:00:00Z',
    type: 'user'
  },
  {
    id: 'zbs-utpl-3',
    name: 'Giới thiệu sản phẩm mới',
    category: 'Marketing',
    description: 'Thông báo ra mắt sản phẩm / dịch vụ mới',
    status: 'pending',
    usageCount: 0,
    updatedAt: '2026-01-30T00:00:00Z',
    type: 'user'
  },
]

// ==================== UTILS ====================
function formatDate(timestamp: string): string {
  const date = new Date(timestamp);
  return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

const getPlaceholderBg = (name: string) => {
  const colors = [
    'from-indigo-500 to-purple-600',
    'from-blue-500 to-cyan-500',
    'from-green-500 to-teal-500',
    'from-orange-500 to-red-500',
    'from-pink-500 to-rose-500',
    'from-violet-500 to-fuchsia-500'
  ];
  const index = name.length % colors.length;
  return colors[index];
};

// ==================== TEMPLATE CARD ====================
function ZbsTemplateCard({
  template,
  showEditActions,
  onPreview,
  onClone,
  onEdit,
  onDelete,
}: {
  template: ZbsTemplate
  showEditActions: boolean
  onPreview: (t: ZbsTemplate) => void
  onClone: (t: ZbsTemplate) => void
  onEdit?: (t: ZbsTemplate) => void
  onDelete?: (t: ZbsTemplate) => void
}) {
  const [isHovered, setIsHovered] = useState(false)
  const [showMenu, setShowMenu] = useState(false)

  return (
    <div
      className="relative bg-white rounded-xl border border-gray-200 overflow-hidden cursor-pointer group hover:shadow-lg hover:border-indigo-300 transition-all duration-200"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setShowMenu(false);
      }}
      onClick={() => onPreview(template)}
    >
      {/* Thumbnail */}
      <div className="relative h-48 bg-gray-100 overflow-hidden">
        {/* Placeholder gradient */}
        <div className={`w-full h-full bg-gradient-to-br ${getPlaceholderBg(template.name)} flex items-center justify-center`}>
          <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center">
            <MessageSquare className="w-10 h-10 text-white" />
          </div>
        </div>

        {/* Hover Overlay with actions */}
        <div 
          className={`
            absolute inset-0 bg-black/50 flex items-center justify-center gap-3
            transition-opacity duration-200
            ${isHovered ? 'opacity-100' : 'opacity-0'}
          `}
        >
          <button
            className="flex items-center gap-2 px-4 py-2 bg-white text-gray-800 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              onPreview(template);
            }}
          >
            <Eye className="w-4 h-4" />
            Xem trước
          </button>
          <button
            className="flex items-center gap-2 px-4 py-2 bg-white text-gray-800 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              onClone(template);
            }}
          >
            <Copy className="w-4 h-4" />
            Tạo bản sao
          </button>
        </div>

        {/* System Badge */}
        {template.type === 'system' && (
          <span className="absolute top-3 left-3 px-2 py-1 bg-blue-500 text-white text-xs font-medium rounded-full shadow-sm">
            Mẫu có sẵn
          </span>
        )}

        {/* Status indicator for user templates */}
        {template.type === 'user' && template.status !== 'approved' && (
          <span className={`absolute top-3 left-3 px-2 py-1 text-xs font-medium rounded-full shadow-sm ${
            template.status === 'pending'
              ? 'bg-yellow-500 text-white'
              : 'bg-red-500 text-white'
          }`}>
            {template.status === 'pending' ? 'Chờ duyệt' : 'Từ chối'}
          </span>
        )}

        {/* Usage count badge */}
        {template.usageCount > 0 && (
          <span className="absolute top-3 right-3 px-2 py-1 bg-gray-800/70 text-white text-xs font-medium rounded-full">
            Đã dùng {template.usageCount} lần
          </span>
        )}
      </div>

      {/* Info */}
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-gray-900 truncate" title={template.name}>
              {template.name}
            </h3>
            <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
              <Calendar className="w-3.5 h-3.5" />
              <span>{formatDate(template.updatedAt)}</span>
            </div>
          </div>

          {/* Actions Menu (only for user templates) */}
          {showEditActions && onEdit && onDelete && (
            <div className="relative">
              <button
                className="p-1.5 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowMenu(!showMenu);
                }}
              >
                <MoreVertical className="w-4 h-4" />
              </button>

              {/* Dropdown Menu */}
              {showMenu && (
                <>
                  <div 
                    className="fixed inset-0 z-10" 
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowMenu(false);
                    }}
                  />
                  <div className="absolute right-0 top-full mt-1 w-40 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
                    <button
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowMenu(false);
                        onEdit(template);
                      }}
                    >
                      <Edit className="w-4 h-4" />
                      Chỉnh sửa
                    </button>
                    <button
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowMenu(false);
                        onClone(template);
                      }}
                    >
                      <Copy className="w-4 h-4" />
                      Sao chép
                    </button>
                    <hr className="my-1 border-gray-100" />
                    <button
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowMenu(false);
                        onDelete(template);
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                      Xóa
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ==================== CREATE CARD ====================
function CreateNewTemplateCard({ onClick }: { onClick: () => void }) {
  return (
    <div
      className="relative bg-white rounded-xl border-2 border-dashed border-gray-300 overflow-hidden cursor-pointer group hover:border-indigo-400 hover:bg-indigo-50/30 transition-all duration-200"
      onClick={onClick}
    >
      <div className="flex flex-col items-center justify-center h-[264px] text-center p-6">
        <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center mb-4 group-hover:bg-indigo-200 transition-colors">
          <span className="text-3xl font-light text-indigo-600">+</span>
        </div>
        <h3 className="font-semibold text-gray-900 mb-2">Tạo mới</h3>
        <p className="text-sm text-gray-500">
          Tạo mẫu ZNS campaign mới
        </p>
      </div>
    </div>
  )
}

// ==================== MAIN COMPONENT ====================
export default function ZbsTemplateLibrary() {
  const [activeTab, setActiveTab] = useState<'system' | 'user'>('system')
  const [searchQuery, setSearchQuery] = useState('')
  
  // States for Modals
  const [userTemplates, setUserTemplates] = useState<ZbsTemplate[]>(mockUserTemplates)
  const [selectedTemplate, setSelectedTemplate] = useState<ZbsTemplate | null>(null)
  
  const [editorMode, setEditorMode] = useState<'create' | 'edit' | 'clone'>('create')
  const [isEditorOpen, setIsEditorOpen] = useState(false)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)

  const templates = activeTab === 'system' ? mockSystemTemplates : userTemplates

  const filteredTemplates = templates.filter(t =>
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.category.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handlePreview = (t: ZbsTemplate) => {
    setSelectedTemplate(t)
    setIsPreviewOpen(true)
  }

  const handleClone = (t: ZbsTemplate) => {
    setSelectedTemplate(t)
    setEditorMode('clone')
    setIsEditorOpen(true)
  }
  
  const handleEdit = (t: ZbsTemplate) => {
    setSelectedTemplate(t)
    setEditorMode('edit')
    setIsEditorOpen(true)
  }
  
  const handleDeleteTrigger = (t: ZbsTemplate) => {
    setSelectedTemplate(t)
    setIsDeleteOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (selectedTemplate) {
      setUserTemplates(prev => prev.filter(t => t.id !== selectedTemplate.id))
    }
  }

  const handleSaveTemplate = async (data: Partial<ZbsTemplate>) => {
    return new Promise<{ success: boolean; message: string }>((resolve) => {
      setTimeout(() => {
        if (editorMode === 'create' || editorMode === 'clone') {
          const newTemplate: ZbsTemplate = {
            id: `zbs-tpl-${Date.now()}`,
            name: data.name || '',
            category: data.category || '',
            description: '',
            status: 'pending',
            usageCount: 0,
            updatedAt: data.updatedAt || new Date().toISOString(),
            type: 'user',
            content: data.content,
            buttons: data.buttons
          };
          setUserTemplates(prev => [newTemplate, ...prev]);
        } else if (editorMode === 'edit' && selectedTemplate) {
          setUserTemplates(prev => prev.map(t => 
            t.id === selectedTemplate.id ? { ...t, ...data } as ZbsTemplate : t
          ));
        }
        setIsEditorOpen(false);
        resolve({ success: true, message: 'Đã lưu template' });
      }, 500);
    });
  }

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex items-center gap-4 border-b border-gray-200">
        <button
          className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'system'
              ? 'text-indigo-600 border-indigo-600'
              : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300'
          }`}
          onClick={() => setActiveTab('system')}
        >
          <Folder className="w-4 h-4" />
          Kho mẫu ZBS
        </button>
        <button
          className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'user'
              ? 'text-indigo-600 border-indigo-600'
              : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300'
          }`}
          onClick={() => setActiveTab('user')}
        >
          <User className="w-4 h-4" />
          Mẫu ZBS của bạn
        </button>
      </div>

      {/* Search & Actions */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm kiếm theo tên mẫu..."
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
          />
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {activeTab === 'user' && (
          <CreateNewTemplateCard onClick={() => {
            setSelectedTemplate(null);
            setEditorMode('create');
            setIsEditorOpen(true);
          }} />
        )}
        {filteredTemplates.map(template => (
          <ZbsTemplateCard
            key={template.id}
            template={template}
            showEditActions={activeTab === 'user'}
            onPreview={handlePreview}
            onClone={handleClone}
            onEdit={handleEdit}
            onDelete={handleDeleteTrigger}
          />
        ))}
      </div>

      {/* Empty state */}
      {filteredTemplates.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Inbox className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchQuery ? 'Không tìm thấy mẫu' : activeTab === 'user' ? 'Bạn chưa có mẫu ZNS nào' : 'Chưa có mẫu ZNS có sẵn'}
          </h3>
          <p className="text-gray-500 mb-6 max-w-sm">
            {searchQuery ? 'Thử tìm với từ khóa khác' : activeTab === 'user' ? 'Tạo mẫu đầu tiên hoặc clone từ mẫu có sẵn' : 'Hệ thống sẽ cập nhật mẫu có sẵn sớm'}
          </p>
          {activeTab === 'user' && (
            <button
              className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
              onClick={() => {
                setSelectedTemplate(null);
                setEditorMode('create');
                setIsEditorOpen(true);
              }}
            >
              + Tạo mẫu mới
            </button>
          )}
        </div>
      )}

      {/* Results count */}
      {filteredTemplates.length > 0 && (
        <div className="flex items-center justify-between text-sm text-gray-500 mt-6">
          <span>Hiển thị {filteredTemplates.length} / {templates.length} mẫu</span>
        </div>
      )}

      {/* Modals */}
      <ZbsTemplateEditorModal
        open={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        mode={editorMode}
        template={selectedTemplate}
        onSave={handleSaveTemplate}
      />
      
      <ZbsPreviewModal
        open={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        template={selectedTemplate}
      />
      
      <ZbsDeleteTemplateModal
        open={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        template={selectedTemplate}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  )
}
