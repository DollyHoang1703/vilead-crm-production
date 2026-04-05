'use client';

import React, { useState } from 'react';
import { X, MessageSquare, Phone, Link as LinkIcon, AlertTriangle, AlertCircle, Plus } from 'lucide-react';
import { ZbsTemplate } from './ZbsTemplateEditorModal';

interface ZbsPreviewModalProps {
  open: boolean;
  onClose: () => void;
  template: ZbsTemplate | null;
  onCreateCampaign?: (t: ZbsTemplate) => void;
  showCreateCampaign?: boolean;
}

export function ZbsPreviewModal({ open, onClose, template, onCreateCampaign, showCreateCampaign = true }: ZbsPreviewModalProps) {
  if (!open || !template) return null;

  // Replace default variables with mock data
  let previewText = template.content || 'Không có nội dung...';
  previewText = previewText.replace(/{{customer_name}}/gi, '<customer_name>');
  previewText = previewText.replace(/{{phone}}/gi, '<phone>');
  previewText = previewText.replace(/{{order_code}}/gi, '<order_code>');
  previewText = previewText.replace(/{{total_amount}}/gi, '<total_amount>');
  previewText = previewText.replace(/{{day}}/gi, '<day>');

  // Create mock params table based on variables found
  const paramsList = [
    { name: '<customer_name>', length: 200, type: 'string' },
    { name: '<phone>', length: 30, type: 'string' },
    { name: '<invoice_no>', length: 30, type: 'string' },
    { name: '<invoice_date>', length: 20, type: 'date' },
    { name: '<series>', length: 30, type: 'string' },
    { name: '<search_code>', length: 30, type: 'string' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/60" onClick={onClose} />
      
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden z-10">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
          <h2 className="text-xl font-semibold text-gray-900">Chi tiết mẫu ZNS</h2>
          <button 
            onClick={onClose}
            className="p-2 bg-gray-100 hover:bg-gray-200 text-gray-500 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left: Details */}
          <div className="w-3/5 p-6 overflow-y-auto border-r border-gray-100 flex flex-col gap-4 text-sm scrollbar-thin">
            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <span className="font-medium text-gray-700">Trạng thái</span>
              <span className={`font-medium ${template.status === 'approved' ? 'text-green-600' : template.status === 'pending' ? 'text-yellow-600' : 'text-red-600'}`}>
                {template.status === 'approved' ? 'Đã duyệt' : template.status === 'pending' ? 'Chở duyệt' : 'Từ chối'}
              </span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <span className="font-medium text-gray-700">ID mẫu ZNS</span>
              <span className="text-gray-900">{template.znsId || '485941'}</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <span className="font-medium text-gray-700">Loại mẫu</span>
              <span className="text-gray-900">{template.templateType || 'Dạng bảng'}</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <span className="font-medium text-gray-700">Chất lượng mẫu tin</span>
              <span className="text-gray-900">{template.quality || 'Chưa được xác định'}</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <span className="font-medium text-gray-700">OA gửi</span>
              <span className="text-gray-900">{template.oa || 'eEvent'}</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <span className="font-medium text-gray-700">Đơn giá (sđt)</span>
              <span className="text-gray-900">{template.price || '300đ'}/ZNS</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <span className="font-medium text-gray-700">Đơn giá (user_id)</span>
              <span className="text-gray-900">{template.priceUserId || '0đ'}/ZBS</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <span className="font-medium text-gray-700">ZTime</span>
              <span className="text-gray-900">{template.ztime || '7.200 giây'}</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <span className="font-medium text-gray-700">Thời gian tạo</span>
              <span className="text-gray-900">{template.updatedAt ? new Date(template.updatedAt).toLocaleString('vi-VN') : '11:04 11/09/2025'}</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-gray-100 mb-2">
              <span className="font-medium text-gray-700">Mục đích gửi ZNS</span>
              <span className="text-gray-900">{template.purpose || '-'}</span>
            </div>

            {/* Params Table */}
            <table className="w-full text-left text-sm mt-2">
              <thead className="bg-gray-100/80 text-gray-700">
                <tr>
                  <th className="py-2.5 px-4 font-medium rounded-tl-lg">Tên tham số</th>
                  <th className="py-2.5 px-4 font-medium">Chiều dài kí tự</th>
                  <th className="py-2.5 px-4 font-medium rounded-tr-lg">Loại dữ liệu</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {paramsList.map((param, i) => (
                  <tr key={i} className="hover:bg-gray-50/50">
                    <td className="py-3 px-4 text-gray-900">{param.name}</td>
                    <td className="py-3 px-4 text-gray-600">{param.length}</td>
                    <td className="py-3 px-4 text-gray-600">{param.type}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Right: Preview */}
          <div className="w-2/5 p-6 bg-gray-50/50 border-l border-gray-100 flex items-start justify-center overflow-y-auto">
            <div className="w-full max-w-[320px] bg-white rounded-xl shadow-sm border border-gray-200 p-5 mt-4">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center overflow-hidden border border-gray-100">
                   <div className="text-blue-600 font-bold text-[10px]">OA</div>
                </div>
              </div>
              <div className="text-[14px] text-gray-800 break-words leading-relaxed whitespace-pre-wrap font-sans">
                {previewText.split('\n').map((line, i) => (
                  <React.Fragment key={i}>
                    {line}
                    <br />
                  </React.Fragment>
                ))}
              </div>
              
              {template.buttons && template.buttons.length > 0 && (
                <div className="mt-5 space-y-2">
                  {template.buttons.map((btn, idx) => (
                    <button key={idx} className="w-full py-2.5 px-4 bg-blue-600 text-white font-medium text-sm rounded-lg hover:bg-blue-700 transition-colors">
                      {btn.label}
                    </button>
                  ))}
                </div>
              )}
              {(!template.buttons || template.buttons.length === 0) && (
                <div className="mt-5">
                   <button className="w-full py-2.5 px-4 bg-blue-600 text-white font-medium text-sm rounded-lg hover:bg-blue-700 transition-colors">
                      TRA CỨU
                    </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-end px-6 py-4 border-t border-gray-100 gap-3 shrink-0 bg-white">
          <button
            onClick={onClose}
            className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Đóng
          </button>
          {showCreateCampaign && template?.status === 'approved' && (
            <button
              onClick={() => {
                onClose();
                if (onCreateCampaign) {
                  onCreateCampaign(template);
                }
              }}
              className="px-6 py-2.5 text-sm font-medium text-white bg-green-500 rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2 shadow-sm"
            >
              Tạo chiến dịch <Plus className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
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
