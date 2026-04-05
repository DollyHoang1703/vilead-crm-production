'use client'

import React, { useState } from 'react'
import {
  Search,
  Inbox,
  Eye,
  Edit,
  Trash2,
  MoreVertical,
  MessageSquare,
  Plus
} from 'lucide-react'

import { ZbsPreviewModal } from './ZbsTemplateModals';
import { ZbsCampaignQuickCreateModal } from './ZbsCampaignQuickCreateModal';

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
  znsId?: string
  templateType?: string
  oa?: string
  price?: string
  priceUserId?: string
  ztime?: string
  quality?: string
  purpose?: string
}

// ==================== MOCK DATA ====================
const mockUserTemplates: ZbsTemplate[] = [
  {
    id: 'zbs-utpl-1',
    znsId: '480001',
    name: 'Chương trình Tết 2026',
    templateType: 'Dạng bảng',
    oa: 'eEvent',
    category: 'Khuyến mãi',
    description: 'Template khuyến mãi Tết Nguyên Đán 2026',
    price: '300đ',
    status: 'approved',
    usageCount: 45,
    updatedAt: '2026-01-28T00:00:00Z',
    type: 'user',
    priceUserId: '0đ/ZBS',
    ztime: '7.200 giây',
    quality: 'Chưa được xác định',
    purpose: 'Khuyến mãi'
  },
  {
    id: 'zbs-utpl-2',
    znsId: '480002',
    name: 'Follow up khách hàng VIP',
    templateType: 'Dạng bảng',
    oa: 'eEvent',
    category: 'Chăm sóc',
    description: 'Template chăm sóc dành cho khách VIP',
    price: '300đ',
    status: 'approved',
    usageCount: 23,
    updatedAt: '2026-01-20T00:00:00Z',
    type: 'user',
    priceUserId: '0đ/ZBS',
    ztime: '7.200 giây',
    quality: 'Chưa được xác định',
    purpose: 'CSKH'
  },
  {
    id: 'zbs-utpl-3',
    znsId: '480003',
    name: 'Giới thiệu sản phẩm mới',
    templateType: 'Dạng bảng',
    oa: 'eEvent',
    category: 'Marketing',
    description: 'Thông báo ra mắt sản phẩm / dịch vụ mới',
    price: '300đ',
    status: 'pending',
    usageCount: 0,
    updatedAt: '2026-01-30T00:00:00Z',
    type: 'user',
    priceUserId: '0đ/ZBS',
    ztime: '7.200 giây',
    quality: 'Chưa được xác định',
    purpose: 'Khuyến mãi'
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
  showCreateCampaign = true,
  onPreview,
  onCreateCampaign,
  onEdit,
  onDelete,
}: {
  template: ZbsTemplate
  showEditActions: boolean
  showCreateCampaign?: boolean
  onPreview: (t: ZbsTemplate) => void
  onCreateCampaign: (t: ZbsTemplate) => void
  onEdit?: (t: ZbsTemplate) => void
  onDelete?: (t: ZbsTemplate) => void
}) {
  const [isHovered, setIsHovered] = useState(false)
  const [showMenu, setShowMenu] = useState(false)

  return (
    <div
      className="relative bg-white rounded-xl border border-gray-200 overflow-hidden cursor-pointer group hover:shadow-lg hover:border-indigo-300 transition-all duration-200 flex flex-col h-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setShowMenu(false);
      }}
      onClick={() => onPreview(template)}
    >
      {/* Thumbnail */}
      <div className="relative h-32 bg-gray-100 overflow-hidden shrink-0">
        <div className={`w-full h-full bg-gradient-to-br ${getPlaceholderBg(template.name)} flex items-center justify-center`}>
          <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
            <MessageSquare className="w-6 h-6 text-white" />
          </div>
        </div>

        {/* Hover Overlay with actions */}
        <div 
          className={`
            absolute inset-0 bg-black/60 flex items-center justify-center gap-3
            transition-opacity duration-200
            ${isHovered ? 'opacity-100' : 'opacity-0'}
          `}
        >
          <button
            className="flex items-center gap-2 px-3 py-1.5 bg-white text-gray-800 rounded-lg text-xs font-medium hover:bg-gray-100 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              onPreview(template);
            }}
          >
            <Eye className="w-3.5 h-3.5" />
            Xem chi tiết
          </button>
          {showCreateCampaign && template.status === 'approved' && (
            <button
              className="flex items-center gap-2 px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-medium hover:bg-indigo-700 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                onCreateCampaign(template);
              }}
            >
              <Plus className="w-3.5 h-3.5" />
              Tạo chiến dịch
            </button>
          )}
        </div>

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1.5">
          {template.type === 'system' && (
            <span className="px-2 py-0.5 bg-blue-500 text-white text-[10px] font-medium rounded shadow-sm">
              Mẫu có sẵn
            </span>
          )}
          {template.type === 'user' && template.status !== 'approved' && (
            <span className={`px-2 py-0.5 text-[10px] font-medium rounded shadow-sm ${
              template.status === 'pending'
                ? 'bg-yellow-500 text-white'
                : 'bg-red-500 text-white'
            }`}>
              {template.status === 'pending' ? 'Chợ duyệt' : 'Từ chối'}
            </span>
          )}
        </div>

        {template.usageCount > 0 && (
          <span className="absolute top-2 right-2 px-2 py-0.5 bg-gray-800/80 text-white text-[10px] font-medium rounded shadow-sm">
            Đã dùng {template.usageCount} lần
          </span>
        )}
      </div>

      {/* Info Stack (like table rows) */}
      <div className="p-4 flex-1 flex flex-col text-sm">
        <div className="flex items-start justify-between mb-3 min-h-[40px]">
          <h3 className="font-semibold text-gray-900 leading-tight line-clamp-2" title={template.name}>
            {template.name}
          </h3>
          {showEditActions && onEdit && onDelete && (
            <div className="relative shrink-0 ml-2">
              <button
                className="p-1 rounded text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowMenu(!showMenu);
                }}
              >
                <MoreVertical className="w-4 h-4" />
              </button>

              {showMenu && (
                <>
                  <div 
                    className="fixed inset-0 z-10" 
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowMenu(false);
                    }}
                  />
                  <div className="absolute right-0 top-full mt-1 w-36 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
                    <button
                      className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-50"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowMenu(false);
                        onEdit(template);
                      }}
                    >
                      <Edit className="w-3.5 h-3.5" />
                      Chỉnh sửa
                    </button>
                    <hr className="my-1 border-gray-100" />
                    <button
                      className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-red-600 hover:bg-red-50"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowMenu(false);
                        onDelete(template);
                      }}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Xóa
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        <div className="space-y-2 mt-auto">
          <div className="flex justify-between items-center text-xs">
            <span className="text-gray-500">ID:</span>
            <span className="font-medium text-gray-900">{template.znsId || '-'}</span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-gray-500">Loại mẫu:</span>
            <span className="text-gray-800">{template.templateType || 'Dạng bảng'}</span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-gray-500">OA:</span>
            <span className="text-gray-800">{template.oa || '-'}</span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-gray-500">Ngày tạo:</span>
            <span className="text-gray-800">{formatDate(template.updatedAt)}</span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-gray-500">Giá bán:</span>
            <span className="font-medium text-green-600">{template.price || '-'}</span>
          </div>
          <div className="flex justify-between items-center text-xs mt-1 pt-2 border-t border-gray-100">
            <span className="text-gray-500">Trạng thái:</span>
            <span className={`font-medium ${template.status === 'approved' ? 'text-green-600' : template.status === 'pending' ? 'text-yellow-600' : 'text-red-600'}`}>
              {template.status === 'approved' ? 'Đã duyệt' : template.status === 'pending' ? 'Chở duyệt' : 'Từ chối'}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}



// ==================== MAIN COMPONENT ====================
export default function ZbsTemplateLibrary() {
  const [searchQuery, setSearchQuery] = useState('')
  
  // States for Modals - Only user templates now (combined)
  const [templates] = useState<ZbsTemplate[]>([...mockUserTemplates])
  const [selectedTemplate, setSelectedTemplate] = useState<ZbsTemplate | null>(null)
  
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const [isQuickCreateOpen, setIsQuickCreateOpen] = useState(false)

  const filteredTemplates = templates.filter(t =>
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.category.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handlePreview = (t: ZbsTemplate) => {
    setSelectedTemplate(t)
    setIsPreviewOpen(true)
  }

  const handleCreateCampaign = (t: ZbsTemplate) => {
    setSelectedTemplate(t)
    setIsQuickCreateOpen(true)
  }

  return (
    <div className="space-y-6">
      {/* Search */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-stretch">
        {filteredTemplates.map(template => (
          <ZbsTemplateCard
            key={template.id}
            template={template}
            showEditActions={false}
            showCreateCampaign={true}
            onPreview={handlePreview}
            onCreateCampaign={handleCreateCampaign}
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
            {searchQuery ? 'Không tìm thấy mẫu' : 'Chưa có mẫu ZNS nào'}
          </h3>
          <p className="text-gray-500 mb-6 max-w-sm">
            {searchQuery ? 'Thử tìm với từ khóa khác' : 'Liên hệ Vilead-CRM để được hỗ trợ đăng ký mẫu ZNS mới'}
          </p>
        </div>
      )}

      {/* Results count & Note */}
      {filteredTemplates.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-sm text-gray-500">
            <span>Hiển thị {filteredTemplates.length} / {templates.length} mẫu</span>
          </div>
          
          {/* Red Note */}
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600 font-medium">
              <span className="font-semibold">Lưu ý:</span> Khách hàng muốn đăng ký template ZBS mới vui lòng liên hệ Vilead-CRM để được hỗ trợ đăng ký.
            </p>
          </div>
        </div>
      )}

      {/* Modals */}
      <ZbsPreviewModal
        open={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        template={selectedTemplate}
        onCreateCampaign={handleCreateCampaign}
        showCreateCampaign={true}
      />

      <ZbsCampaignQuickCreateModal
        open={isQuickCreateOpen}
        onClose={() => setIsQuickCreateOpen(false)}
        template={selectedTemplate}
      />
    </div>
  )
}
