'use client';

// ==================== DELETE TEMPLATE CONFIRM MODAL ====================
// Modal xác nhận xóa template

import React, { useState } from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { EmailTemplate } from './types';

interface DeleteTemplateModalProps {
  open: boolean;
  onClose: () => void;
  template: EmailTemplate | null;
  onConfirm: (id: string) => Promise<{ success: boolean; message: string }>;
}

export function DeleteTemplateModal({
  open,
  onClose,
  template,
  onConfirm
}: DeleteTemplateModalProps) {
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    if (!template) return;
    
    setLoading(true);
    const result = await onConfirm(template.id);
    setLoading(false);

    if (result.success) {
      onClose();
    } else {
      alert(result.message);
    }
  };

  if (!open || !template) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="relative bg-white rounded-xl shadow-xl max-w-md w-full overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Xác nhận xóa</h2>
            <button
              className="p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
              onClick={onClose}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="px-6 py-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <p className="text-gray-900 font-medium">
                  Bạn có chắc chắn muốn xóa mẫu email này?
                </p>
                <p className="mt-2 text-sm text-gray-500">
                  Mẫu &quot;<span className="font-medium">{template.name}</span>&quot; sẽ bị xóa vĩnh viễn và không thể khôi phục.
                </p>
                {template.usage_count > 0 && (
                  <p className="mt-2 text-sm text-amber-600 bg-amber-50 px-3 py-2 rounded-lg">
                    ⚠️ Mẫu này đã được sử dụng trong {template.usage_count} chiến dịch. 
                    Các chiến dịch cũ sẽ không bị ảnh hưởng.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
            <button
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg font-medium transition-colors"
              onClick={onClose}
              disabled={loading}
            >
              Hủy
            </button>
            <button
              className="px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleConfirm}
              disabled={loading}
            >
              {loading ? 'Đang xóa...' : 'Xóa mẫu'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
