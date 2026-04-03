'use client';

import React, { useState } from 'react';
import { X, MessageSquare, Phone, Link as LinkIcon, AlertTriangle, AlertCircle } from 'lucide-react';
import { ZbsTemplate } from './ZbsTemplateEditorModal';

interface ZbsPreviewModalProps {
  open: boolean;
  onClose: () => void;
  template: ZbsTemplate | null;
}

export function ZbsPreviewModal({ open, onClose, template }: ZbsPreviewModalProps) {
  if (!open || !template) return null;

  // Replace default variables with mock data
  let previewText = template.content || 'Không có nội dung...';
  previewText = previewText.replace(/{{customer_name}}/gi, 'Nguyễn Văn A');
  previewText = previewText.replace(/{{phone}}/gi, '0987654321');
  previewText = previewText.replace(/{{order_code}}/gi, 'DH-123456');
  previewText = previewText.replace(/{{total_amount}}/gi, '1,500,000 đ');
  previewText = previewText.replace(/{{day}}/gi, new Date().toLocaleDateString('vi-VN'));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/60" onClick={onClose} />
      
      {/* Mobile Device Mockup */}
      <div className="relative w-[340px] h-[700px] bg-gray-900 rounded-[45px] border-[14px] border-gray-900 shadow-2xl overflow-hidden ring-1 ring-white/10 z-10 flex flex-col pt-6 transform transition-all duration-300 scale-95 sm:scale-100">
        <div className="absolute top-0 inset-x-0 h-7 bg-gray-900 rounded-t-[30px] z-20 flex justify-center pt-2.5">
          <div className="w-20 h-5 bg-black rounded-full" />
        </div>
        
        <div className="w-full flex-1 bg-[#F1F2F4] flex flex-col relative rounded-[32px] overflow-hidden">
          {/* App Header */}
          <div className="px-4 pt-8 pb-3 bg-white border-b border-gray-200 flex items-center gap-3 shadow-sm z-10">
            <button className="p-1 hover:bg-gray-100 rounded-full" onClick={onClose}>
              <ArrowLeftIcon className="w-5 h-5 text-gray-700" />
            </button>
            <div className="w-10 h-10 rounded-full bg-blue-500 overflow-hidden flex items-center justify-center">
              <span className="text-white text-xs font-bold">ZOA</span>
            </div>
            <div className="flex-1">
              <p className="font-semibold text-gray-900 text-[15px] leading-tight">Zalo Official Account</p>
              <p className="text-[11px] text-gray-500">Mẫu: {template.name}</p>
            </div>
          </div>

          {/* Chat Body */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 font-sans mask-image-bottom">
            <div className="flex items-center justify-center">
              <span className="px-3 py-1 bg-black/5 text-[11px] font-medium text-gray-500 rounded-full">
                Hôm nay 10:30
              </span>
            </div>

            <div className="flex gap-2">
              <div className="w-8 h-8 rounded-full bg-blue-500 flex-shrink-0 flex items-center justify-center mt-auto">
                <span className="text-white text-[10px] font-bold">ZOA</span>
              </div>
              
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden max-w-[85%] rounded-bl-sm">
                <div className="p-4 text-[14px] text-gray-800 break-words leading-relaxed whitespace-pre-wrap">
                  {previewText}
                </div>
                
                {template.buttons && template.buttons.length > 0 && (
                  <div className="border-t border-gray-100 divide-y divide-gray-100 bg-gray-50/50">
                    {template.buttons.map((btn, idx) => (
                      <div key={idx} className="p-3 text-center text-blue-600 font-medium text-[14px] flex items-center justify-center gap-2 hover:bg-gray-100/80 cursor-pointer">
                        {btn.type === 'web' ? <LinkIcon className="w-[14px] h-[14px]" /> : <Phone className="w-[14px] h-[14px]" />}
                        {btn.label}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Close button outside */}
      <button 
        onClick={onClose}
        className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 text-white rounded-full z-10 transition-colors"
      >
        <X className="w-6 h-6" />
      </button>
    </div>
  );
}

// Simple Arrow icon for navbar
function ArrowLeftIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M19 12H5M12 19l-7-7 7-7" />
    </svg>
  );
}

interface ZbsDeleteTemplateModalProps {
  open: boolean;
  onClose: () => void;
  template: ZbsTemplate | null;
  onConfirm: () => Promise<void>;
}

export function ZbsDeleteTemplateModal({ open, onClose, template, onConfirm }: ZbsDeleteTemplateModalProps) {
  const [loading, setLoading] = useState(false);

  if (!open || !template) return null;

  const handleDelete = async () => {
    setLoading(true);
    try {
      await onConfirm();
      onClose();
    } catch (e) {
      console.error(e);
      alert('Có lỗi xảy ra khi xóa');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md mx-4 p-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="w-6 h-6 text-red-600" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">Xóa mẫu ZNS?</h3>
            <p className="text-sm text-gray-500 mt-1">Hành động này không thể hoàn tác.</p>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-6 flex flex-col gap-1">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-700 truncate pr-4">{template.name}</span>
            <span className="text-xs px-2 py-0.5 bg-gray-200 text-gray-600 rounded">
              {template.category}
            </span>
          </div>
          <p className="text-xs text-gray-500 flex items-center gap-1.5 mt-1">
            <AlertCircle className="w-3.5 h-3.5" />
            {template.usageCount > 0 
              ? `Đang được sử dụng trong ${template.usageCount} chiến dịch` 
              : 'Chưa được sử dụng trong chiến dịch nào'}
          </p>
        </div>

        <div className="flex items-center justify-end gap-3">
          <button
            className="px-4 py-2 font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            onClick={onClose}
          >
            Hủy bỏ
          </button>
          <button
            className="px-4 py-2 font-medium text-white bg-red-600 border border-transparent rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            onClick={handleDelete}
            disabled={loading}
          >
            {loading ? 'Đang xóa...' : 'Xác nhận xóa'}
          </button>
        </div>
      </div>
    </div>
  );
}
