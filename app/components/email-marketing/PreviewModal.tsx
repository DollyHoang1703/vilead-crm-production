'use client';

// ==================== TEMPLATE PREVIEW MODAL ====================
// Modal xem trước template với toggle desktop/mobile

import React, { useState, useEffect } from 'react';
import { 
  X, 
  Monitor, 
  Smartphone, 
  Copy, 
  Play,
  Info,
  History
} from 'lucide-react';
import { EmailTemplate, TemplateVersion } from './types';
import { replaceVariablesWithSample, TEMPLATE_VARIABLES } from './mockData';
import { formatDate } from './utils';

interface PreviewModalProps {
  open: boolean;
  onClose: () => void;
  template: EmailTemplate | null;
  onClone: (template: EmailTemplate) => void;
  onUseTemplate?: (template: EmailTemplate) => void;
  onRestoreVersion?: (templateId: string, version: number) => Promise<{ success: boolean; message: string }>;
}

export function PreviewModal({ 
  open, 
  onClose, 
  template,
  onClone,
  onUseTemplate,
  onRestoreVersion
}: PreviewModalProps) {
  const [mode, setMode] = useState<'desktop' | 'mobile'>('desktop');
  const [renderedHtml, setRenderedHtml] = useState<string>('');
  const [showVersions, setShowVersions] = useState(false);
  const [restoringVersion, setRestoringVersion] = useState<number | null>(null);

  useEffect(() => {
    if (template) {
      // Replace variables with sample data for preview
      const html = replaceVariablesWithSample(template.content_html);
      setRenderedHtml(html);
    }
  }, [template]);

  const handleRestoreVersion = async (version: number) => {
    if (!template || !onRestoreVersion) return;
    setRestoringVersion(version);
    const result = await onRestoreVersion(template.id, version);
    setRestoringVersion(null);
    if (result.success) {
      alert(result.message);
      onClose();
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
        <div className="relative bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-semibold text-gray-900">
                {template.name}
              </h2>
              {template.type === 'system' && (
                <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                  Mẫu hệ thống
                </span>
              )}
            </div>

            <div className="flex items-center gap-3">
              {/* Device Toggle */}
              <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                <button
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    mode === 'desktop' 
                      ? 'bg-white text-gray-900 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                  onClick={() => setMode('desktop')}
                >
                  <Monitor className="w-4 h-4" />
                  Desktop
                </button>
                <button
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    mode === 'mobile' 
                      ? 'bg-white text-gray-900 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                  onClick={() => setMode('mobile')}
                >
                  <Smartphone className="w-4 h-4" />
                  Mobile
                </button>
              </div>

              {/* Version History Button */}
              {template.versions && template.versions.length > 0 && (
                <button
                  className={`p-2 rounded-lg transition-colors ${
                    showVersions 
                      ? 'bg-indigo-100 text-indigo-600' 
                      : 'text-gray-500 hover:bg-gray-100'
                  }`}
                  onClick={() => setShowVersions(!showVersions)}
                  title="Lịch sử phiên bản"
                >
                  <History className="w-5 h-5" />
                </button>
              )}

              {/* Close button */}
              <button
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                onClick={onClose}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-auto bg-gray-100 p-6">
            <div className="flex gap-4">
              {/* Preview Area */}
              <div className="flex-1 flex justify-center">
                <div 
                  className={`
                    bg-white shadow-lg overflow-auto rounded-lg transition-all duration-300
                    ${mode === 'desktop' ? 'w-full max-w-[600px]' : 'w-[375px]'}
                  `}
                  style={{ maxHeight: 'calc(70vh - 100px)' }}
                >
                  <div 
                    className="p-4"
                    dangerouslySetInnerHTML={{ __html: renderedHtml }}
                  />
                </div>
              </div>

              {/* Version History Panel */}
              {showVersions && template.versions && template.versions.length > 0 && (
                <div className="w-64 bg-white rounded-lg shadow-sm p-4 overflow-auto">
                  <h3 className="font-medium text-gray-900 mb-3">Lịch sử phiên bản</h3>
                  <div className="space-y-2">
                    {/* Current version */}
                    <div className="p-3 bg-indigo-50 rounded-lg border border-indigo-200">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-indigo-700">
                          v{template.version} (Hiện tại)
                        </span>
                      </div>
                      <p className="text-xs text-indigo-600 mt-1">
                        {formatDate(template.updated_at, 'DD/MM/YYYY HH:mm')}
                      </p>
                    </div>

                    {/* Previous versions */}
                    {template.versions.map((version: TemplateVersion) => (
                      <div 
                        key={version.version}
                        className="p-3 bg-gray-50 rounded-lg border border-gray-200"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-700">
                            v{version.version}
                          </span>
                          {onRestoreVersion && (
                            <button
                              onClick={() => handleRestoreVersion(version.version)}
                              disabled={restoringVersion === version.version}
                              className="text-xs text-indigo-600 hover:text-indigo-800 font-medium disabled:opacity-50"
                            >
                              {restoringVersion === version.version ? 'Đang khôi phục...' : 'Khôi phục'}
                            </button>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          {formatDate(version.created_at, 'DD/MM/YYYY HH:mm')}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Variables Legend */}
            <div className="mt-4 p-3 bg-blue-50 rounded-lg flex items-start gap-2">
              <Info className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-blue-700">
                Các biến động được hiển thị với dữ liệu mẫu. 
                Khi gửi thực tế, biến sẽ được thay thế bằng dữ liệu khách hàng.
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
            <button
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg font-medium transition-colors"
              onClick={onClose}
            >
              Đóng
            </button>
            <button
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg font-medium transition-colors"
              onClick={() => onClone(template)}
            >
              <Copy className="w-4 h-4" />
              Tạo bản sao
            </button>
            <button
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white hover:bg-indigo-700 rounded-lg font-medium transition-colors"
              onClick={() => onUseTemplate?.(template)}
            >
              <Play className="w-4 h-4" />
              Sử dụng ngay
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
