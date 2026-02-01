'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { X, AlertTriangle, CheckCircle, Info, Eye, Mail, HelpCircle } from 'lucide-react';
import { SPAM_KEYWORDS } from '../mockData';

interface SubjectModalProps {
  subject: string;
  previewText: string;
  onSave: (subject: string, previewText: string) => void;
  onClose: () => void;
}

export function SubjectModal({ subject: initialSubject, previewText: initialPreview, onSave, onClose }: SubjectModalProps) {
  const [subject, setSubject] = useState(initialSubject);
  const [previewText, setPreviewText] = useState(initialPreview);
  const [showPreview, setShowPreview] = useState(false);

  // Check for spam keywords
  const spamCheck = useMemo(() => {
    const foundKeywords: string[] = [];
    const lowerSubject = subject.toLowerCase();
    
    SPAM_KEYWORDS.forEach(keyword => {
      if (lowerSubject.includes(keyword.toLowerCase())) {
        foundKeywords.push(keyword);
      }
    });
    
    return {
      hasSpam: foundKeywords.length > 0,
      keywords: foundKeywords
    };
  }, [subject]);

  // Subject length validation
  const subjectValidation = useMemo(() => {
    const length = subject.length;
    if (length === 0) return { status: 'empty', message: 'Tiêu đề không được để trống' };
    if (length < 10) return { status: 'short', message: 'Tiêu đề quá ngắn (tối thiểu 10 ký tự)' };
    if (length > 100) return { status: 'long', message: 'Tiêu đề quá dài (tối đa 100 ký tự)' };
    if (length > 60) return { status: 'warning', message: `${length}/100 ký tự - Có thể bị cắt trên mobile` };
    return { status: 'valid', message: `${length}/100 ký tự` };
  }, [subject]);

  // Preview text validation
  const previewValidation = useMemo(() => {
    const length = previewText.length;
    if (length === 0) return { status: 'empty', message: 'Để trống sẽ sử dụng nội dung đầu email' };
    if (length > 150) return { status: 'long', message: 'Tối đa 150 ký tự' };
    return { status: 'valid', message: `${length}/150 ký tự` };
  }, [previewText]);

  const isValid = subjectValidation.status === 'valid' || subjectValidation.status === 'warning';

  const handleSave = () => {
    if (isValid) {
      onSave(subject.trim(), previewText.trim());
      onClose();
    }
  };

  // Sample preview
  const sampleSender = "Công ty ABC <no-reply@congtyabc.com>";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-xl">
          <h3 className="text-lg font-semibold text-gray-900">Tiêu đề email</h3>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-gray-100">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Subject input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tiêu đề email <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="VD: [Ưu đãi 50%] Khuyến mãi đặc biệt dành riêng cho bạn"
              className={`
                w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2
                ${subjectValidation.status === 'valid' || subjectValidation.status === 'warning'
                  ? 'border-gray-300 focus:ring-blue-500'
                  : 'border-red-300 focus:ring-red-500'
                }
              `}
            />
            <div className="mt-1 flex items-center gap-2">
              {subjectValidation.status === 'valid' && (
                <CheckCircle className="w-4 h-4 text-green-500" />
              )}
              {subjectValidation.status === 'warning' && (
                <AlertTriangle className="w-4 h-4 text-yellow-500" />
              )}
              {(subjectValidation.status === 'empty' || subjectValidation.status === 'short' || subjectValidation.status === 'long') && (
                <AlertTriangle className="w-4 h-4 text-red-500" />
              )}
              <span className={`text-sm ${
                subjectValidation.status === 'valid' ? 'text-gray-500' :
                subjectValidation.status === 'warning' ? 'text-yellow-600' :
                'text-red-500'
              }`}>
                {subjectValidation.message}
              </span>
            </div>
          </div>

          {/* Spam check warning */}
          {spamCheck.hasSpam && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-yellow-800">Cảnh báo spam</h4>
                  <p className="text-sm text-yellow-700 mt-1">
                    Tiêu đề chứa từ khóa có thể bị đánh dấu spam: <strong>{spamCheck.keywords.join(', ')}</strong>
                  </p>
                  <p className="text-sm text-yellow-600 mt-2">
                    Hãy cân nhắc viết lại tiêu đề để tránh bị chặn bởi bộ lọc email.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Preview text input */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <label className="text-sm font-medium text-gray-700">
                Preheader (Mô tả ngắn)
              </label>
              <div className="relative group">
                <HelpCircle className="w-4 h-4 text-gray-400" />
                <div className="absolute left-0 bottom-full mb-2 w-64 p-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  Văn bản ngắn hiển thị sau tiêu đề trong hộp thư đến. Giúp tăng tỷ lệ mở email.
                </div>
              </div>
            </div>
            <textarea
              value={previewText}
              onChange={(e) => setPreviewText(e.target.value)}
              placeholder="Mô tả ngắn hiển thị sau tiêu đề trong inbox..."
              rows={2}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
            <div className="mt-1 flex items-center gap-2">
              <Info className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-500">{previewValidation.message}</span>
            </div>
          </div>

          {/* Preview toggle */}
          <div>
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700"
            >
              <Eye className="w-4 h-4" />
              {showPreview ? 'Ẩn xem trước' : 'Xem trước trong hộp thư'}
            </button>
          </div>

          {/* Inbox preview */}
          {showPreview && (
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
                <span className="text-xs text-gray-500">Xem trước trong hộp thư</span>
              </div>
              <div className="p-4">
                <div className="flex items-start gap-3 p-3 bg-white border border-gray-200 rounded-lg hover:shadow-sm transition-shadow">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-gray-900 text-sm truncate">
                        {sampleSender}
                      </span>
                      <span className="text-xs text-gray-400 flex-shrink-0">10:30</span>
                    </div>
                    <p className="font-medium text-gray-800 truncate">
                      {subject || 'Tiêu đề email...'}
                    </p>
                    <p className="text-sm text-gray-500 truncate">
                      {previewText || 'Nội dung preheader sẽ hiển thị ở đây...'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tips */}
          <div className="bg-blue-50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-blue-800 mb-2">💡 Mẹo viết tiêu đề hiệu quả</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Ngắn gọn, dưới 60 ký tự để hiển thị đầy đủ trên mobile</li>
              <li>• Tránh viết hoa toàn bộ hoặc dùng nhiều dấu chấm than</li>
              <li>• Cá nhân hóa bằng tên người nhận nếu có thể</li>
              <li>• Tạo sự tò mò hoặc urgency phù hợp</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-end gap-3 rounded-b-xl">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
          >
            Hủy
          </button>
          <button
            onClick={handleSave}
            disabled={!isValid}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Lưu
          </button>
        </div>
      </div>
    </div>
  );
}
