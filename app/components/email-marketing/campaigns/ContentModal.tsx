'use client';

import React, { useState, useMemo } from 'react';
import { X, Search, Check, FileText, Eye, Layers, Clock } from 'lucide-react';
import { EmailTemplate } from '../types';
import { MOCK_TEMPLATES } from '../mockData';
import { formatDate } from '../utils';

interface ContentModalProps {
  selectedId: string | null;
  onSelect: (id: string) => void;
  onPreview: (template: EmailTemplate) => void;
  onClose: () => void;
}

export function ContentModal({ selectedId, onSelect, onPreview, onClose }: ContentModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentSelected, setCurrentSelected] = useState<string | null>(selectedId);

  // Filter templates - show all templates since EmailTemplate doesn't have status field
  const filteredTemplates = useMemo(() => {
    return MOCK_TEMPLATES.filter(template => {
      const matchesSearch = searchQuery === '' ||
        template.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSearch;
    });
  }, [searchQuery]);

  const handleConfirm = () => {
    if (currentSelected) {
      onSelect(currentSelected);
      onClose();
    }
  };

  const selectedTemplate = MOCK_TEMPLATES.find(t => t.id === currentSelected);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-xl w-full max-w-4xl mx-4 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex-shrink-0 border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Chọn mẫu email</h3>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-gray-100">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Search */}
        <div className="flex-shrink-0 px-6 py-4 border-b border-gray-100">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm mẫu email..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>
        </div>

        {/* Template Grid */}
        <div className="flex-1 overflow-y-auto p-6">
          {filteredTemplates.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">Không tìm thấy mẫu email phù hợp</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTemplates.map(template => (
                <div
                  key={template.id}
                  className={`
                    relative rounded-lg border-2 overflow-hidden transition-all cursor-pointer group
                    ${currentSelected === template.id
                      ? 'border-blue-500 ring-2 ring-blue-200'
                      : 'border-gray-200 hover:border-gray-300'
                    }
                  `}
                  onClick={() => setCurrentSelected(template.id)}
                >
                  {/* Thumbnail */}
                  <div className="relative aspect-[4/3] bg-gray-100">
                    {template.thumbnail_url ? (
                      <img
                        src={template.thumbnail_url}
                        alt={template.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <FileText className="w-12 h-12 text-gray-300" />
                      </div>
                    )}
                    
                    {/* Preview overlay */}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onPreview(template);
                        }}
                        className="flex items-center gap-2 px-3 py-2 bg-white rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100"
                      >
                        <Eye className="w-4 h-4" />
                        Xem trước
                      </button>
                    </div>

                    {/* Selected check */}
                    {currentSelected === template.id && (
                      <div className="absolute top-2 right-2 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="p-3">
                    <h4 className="font-medium text-gray-900 truncate">{template.name}</h4>
                    <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Layers className="w-3 h-3" />
                        {template.type === 'system' ? 'Mẫu hệ thống' : 'Mẫu cá nhân'}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatDate(template.updated_at)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Selected preview */}
        {selectedTemplate && (
          <div className="flex-shrink-0 px-6 py-3 bg-blue-50 border-t border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-700">Mẫu được chọn:</p>
                <p className="font-medium text-blue-900">{selectedTemplate.name}</p>
              </div>
              <button
                onClick={() => onPreview(selectedTemplate)}
                className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700"
              >
                <Eye className="w-4 h-4" />
                Xem trước
              </button>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex-shrink-0 bg-white border-t border-gray-200 px-6 py-4 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Hủy
          </button>
          <button
            onClick={handleConfirm}
            disabled={!currentSelected}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Chọn mẫu này
          </button>
        </div>
      </div>
    </div>
  );
}
