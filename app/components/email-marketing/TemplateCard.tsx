'use client';

// ==================== TEMPLATE CARD COMPONENT ====================
// Card hiển thị một template email với hover actions

import React, { useState } from 'react';
import { 
  MoreVertical, 
  Eye, 
  Copy, 
  Edit, 
  Trash2, 
  Mail,
  Calendar
} from 'lucide-react';
import { EmailTemplate } from './types';
import { formatDate } from './utils';

interface TemplateCardProps {
  template: EmailTemplate;
  showEditActions: boolean;
  onPreview: (template: EmailTemplate) => void;
  onClone: (template: EmailTemplate) => void;
  onEdit?: (template: EmailTemplate) => void;
  onDelete?: (template: EmailTemplate) => void;
}

export function TemplateCard({ 
  template, 
  showEditActions,
  onPreview,
  onClone,
  onEdit,
  onDelete
}: TemplateCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  // Generate placeholder thumbnail based on template name
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
        {/* Placeholder gradient with first letter */}
        <div className={`w-full h-full bg-gradient-to-br ${getPlaceholderBg(template.name)} flex items-center justify-center`}>
          <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center">
            <Mail className="w-10 h-10 text-white" />
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
          <span className="absolute top-3 left-3 px-2 py-1 bg-blue-500 text-white text-xs font-medium rounded-full">
            Mẫu có sẵn
          </span>
        )}

        {/* Usage count badge */}
        {template.usage_count > 0 && (
          <span className="absolute top-3 right-3 px-2 py-1 bg-gray-800/70 text-white text-xs font-medium rounded-full">
            Đã dùng {template.usage_count} lần
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
              <span>{formatDate(template.updated_at, 'DD/MM/YYYY')}</span>
            </div>
          </div>

          {/* Actions Menu (only for user templates) */}
          {showEditActions && (
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
                        onEdit?.(template);
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
                      Tạo bản sao
                    </button>
                    <hr className="my-1 border-gray-100" />
                    <button
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowMenu(false);
                        onDelete?.(template);
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
  );
}

// ==================== CREATE NEW TEMPLATE CARD ====================
interface CreateNewTemplateCardProps {
  onClick: () => void;
}

export function CreateNewTemplateCard({ onClick }: CreateNewTemplateCardProps) {
  return (
    <div
      className="relative bg-white rounded-xl border-2 border-dashed border-gray-300 overflow-hidden cursor-pointer group hover:border-indigo-400 hover:bg-indigo-50/30 transition-all duration-200"
      onClick={onClick}
    >
      <div className="flex flex-col items-center justify-center h-64 text-center p-6">
        <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center mb-4 group-hover:bg-indigo-200 transition-colors">
          <span className="text-3xl font-light text-indigo-600">+</span>
        </div>
        <h3 className="font-semibold text-gray-900 mb-2">Tạo mới</h3>
        <p className="text-sm text-gray-500">
          Thỏa sức sáng tạo nội dung email của riêng bạn
        </p>
      </div>
    </div>
  );
}
