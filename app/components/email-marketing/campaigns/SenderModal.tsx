'use client';

import React, { useState, useMemo } from 'react';
import { X, Search, Check, Mail, AlertCircle, ChevronRight } from 'lucide-react';
import { SenderEmail, SenderEmailStatus } from '../types';
import { MOCK_SENDER_EMAILS } from '../mockData';

interface SenderModalProps {
  selectedId: string | null;
  onSelect: (id: string) => void;
  onClose: () => void;
}

export function SenderModal({ selectedId, onSelect, onClose }: SenderModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentSelected, setCurrentSelected] = useState<string | null>(selectedId);

  // Filter only activated sender emails
  const availableSenders = useMemo(() => {
    return MOCK_SENDER_EMAILS.filter(sender => {
      const isActivated = sender.status === 'activated';
      const matchesSearch = searchQuery === '' || 
        sender.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sender.sender_name.toLowerCase().includes(searchQuery.toLowerCase());
      return isActivated && matchesSearch;
    });
  }, [searchQuery]);

  const handleConfirm = () => {
    if (currentSelected) {
      onSelect(currentSelected);
      onClose();
    }
  };

  const selectedSender = MOCK_SENDER_EMAILS.find(s => s.id === currentSelected);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-xl w-full max-w-lg mx-4 max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex-shrink-0 border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Chọn email gửi</h3>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-gray-100">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Search */}
        <div className="flex-shrink-0 px-6 py-3 border-b border-gray-100">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm email..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>
        </div>

        {/* Sender list */}
        <div className="flex-1 overflow-y-auto p-4">
          {availableSenders.length === 0 ? (
            <div className="text-center py-8">
              <Mail className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">
                {searchQuery ? 'Không tìm thấy email phù hợp' : 'Chưa có email gửi nào được kích hoạt'}
              </p>
              {!searchQuery && (
                <p className="text-sm text-gray-400 mt-1">
                  Vui lòng cấu hình email gửi trước
                </p>
              )}
            </div>
          ) : (
            <div className="space-y-2">
              {availableSenders.map(sender => (
                <button
                  key={sender.id}
                  onClick={() => setCurrentSelected(sender.id)}
                  className={`
                    w-full flex items-center gap-3 p-3 rounded-lg border transition-colors text-left
                    ${currentSelected === sender.id 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }
                  `}
                >
                  <div className={`
                    w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0
                    ${currentSelected === sender.id ? 'bg-blue-100' : 'bg-gray-100'}
                  `}>
                    <Mail className={`w-5 h-5 ${currentSelected === sender.id ? 'text-blue-600' : 'text-gray-500'}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">{sender.sender_name}</p>
                    <p className="text-sm text-gray-500 truncate">{sender.email}</p>
                  </div>
                  {currentSelected === sender.id && (
                    <Check className="w-5 h-5 text-blue-600 flex-shrink-0" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Selected preview */}
        {selectedSender && (
          <div className="flex-shrink-0 px-6 py-3 bg-gray-50 border-t border-gray-200">
            <p className="text-sm text-gray-500">Email được chọn:</p>
            <p className="font-medium text-gray-900">{selectedSender.sender_name} &lt;{selectedSender.email}&gt;</p>
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
            Xác nhận
          </button>
        </div>
      </div>
    </div>
  );
}
