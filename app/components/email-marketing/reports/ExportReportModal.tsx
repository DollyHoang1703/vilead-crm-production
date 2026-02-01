'use client';

import React, { useState } from 'react';
import { X, Download, FileSpreadsheet, Check, Loader2 } from 'lucide-react';

interface ExportReportModalProps {
  isOpen: boolean;
  exporting: boolean;
  onClose: () => void;
  onExport: (reportTypes: ('overview' | 'campaigns' | 'unsubscribes')[], format: 'xlsx' | 'csv') => Promise<{ success: boolean; message: string }>;
}

const REPORT_OPTIONS = [
  { 
    key: 'overview' as const, 
    label: 'Báo cáo tổng quan', 
    description: 'Thống kê chung về email gửi, mở, click...' 
  },
  { 
    key: 'campaigns' as const, 
    label: 'So sánh chiến dịch', 
    description: 'Danh sách chiến dịch kèm hiệu suất' 
  },
  { 
    key: 'unsubscribes' as const, 
    label: 'Danh sách hủy đăng ký', 
    description: 'Chi tiết người dùng hủy nhận email' 
  }
];

const FORMAT_OPTIONS = [
  { key: 'xlsx' as const, label: 'Excel (.xlsx)', icon: FileSpreadsheet },
  { key: 'csv' as const, label: 'CSV (.csv)', icon: FileSpreadsheet }
];

export function ExportReportModal({ isOpen, exporting, onClose, onExport }: ExportReportModalProps) {
  const [selectedReports, setSelectedReports] = useState<('overview' | 'campaigns' | 'unsubscribes')[]>(['overview']);
  const [selectedFormat, setSelectedFormat] = useState<'xlsx' | 'csv'>('xlsx');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const toggleReport = (key: 'overview' | 'campaigns' | 'unsubscribes') => {
    setSelectedReports(prev => {
      if (prev.includes(key)) {
        return prev.filter(k => k !== key);
      }
      return [...prev, key];
    });
  };

  const handleExport = async () => {
    if (selectedReports.length === 0) {
      setMessage({ type: 'error', text: 'Vui lòng chọn ít nhất một loại báo cáo' });
      return;
    }
    
    setMessage(null);
    const result = await onExport(selectedReports, selectedFormat);
    
    if (result.success) {
      setMessage({ type: 'success', text: result.message });
      // Auto close after success
      setTimeout(() => {
        onClose();
        setMessage(null);
      }, 2000);
    } else {
      setMessage({ type: 'error', text: result.message });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Download className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Xuất báo cáo</h2>
              <p className="text-sm text-gray-500">Chọn loại báo cáo và định dạng file</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            disabled={exporting}
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* Report Type Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Chọn loại báo cáo
            </label>
            <div className="space-y-2">
              {REPORT_OPTIONS.map((option) => (
                <label
                  key={option.key}
                  className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                    selectedReports.includes(option.key)
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <div className={`w-5 h-5 rounded border flex items-center justify-center flex-shrink-0 mt-0.5 ${
                    selectedReports.includes(option.key)
                      ? 'bg-blue-500 border-blue-500'
                      : 'border-gray-300'
                  }`}>
                    {selectedReports.includes(option.key) && (
                      <Check className="h-3 w-3 text-white" />
                    )}
                  </div>
                  <div className="flex-1">
                    <input
                      type="checkbox"
                      checked={selectedReports.includes(option.key)}
                      onChange={() => toggleReport(option.key)}
                      className="sr-only"
                    />
                    <p className="text-sm font-medium text-gray-900">{option.label}</p>
                    <p className="text-xs text-gray-500">{option.description}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Format Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Định dạng file
            </label>
            <div className="flex gap-3">
              {FORMAT_OPTIONS.map((format) => (
                <button
                  key={format.key}
                  onClick={() => setSelectedFormat(format.key)}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border transition-colors ${
                    selectedFormat === format.key
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <format.icon className="h-5 w-5" />
                  <span className="text-sm font-medium">{format.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Message */}
          {message && (
            <div className={`p-3 rounded-lg text-sm ${
              message.type === 'success'
                ? 'bg-green-50 text-green-700'
                : 'bg-red-50 text-red-700'
            }`}>
              {message.text}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={exporting}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
          >
            Hủy
          </button>
          <button
            onClick={handleExport}
            disabled={exporting || selectedReports.length === 0}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {exporting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Đang xuất...</span>
              </>
            ) : (
              <>
                <Download className="h-4 w-4" />
                <span>Xuất báo cáo</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ExportReportModal;
