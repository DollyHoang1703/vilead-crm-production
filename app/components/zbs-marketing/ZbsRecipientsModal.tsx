'use client';

import React, { useState, useEffect } from 'react';
import { X, Users, Filter, ChevronDown, Check, AlertCircle, Loader2 } from 'lucide-react';
import { RecipientFilter, RecipientsPreview } from '../email-marketing/types';
import { MOCK_CUSTOMER_LABELS, MOCK_CUSTOMER_SOURCES, MOCK_CUSTOMER_STATUSES } from '../email-marketing/mockData';

interface ZbsRecipientsModalProps {
  filter: RecipientFilter;
  preview: RecipientsPreview | null;
  onSave: (filter: RecipientFilter) => void;
  onPreview: () => Promise<RecipientsPreview>;
  onClose: () => void;
}

export function ZbsRecipientsModal({ 
  filter: initialFilter, 
  preview: initialPreview,
  onSave, 
  onPreview,
  onClose 
}: ZbsRecipientsModalProps) {
  const [filter, setFilter] = useState<RecipientFilter>(initialFilter);
  const [preview, setPreview] = useState<RecipientsPreview | null>(initialPreview);
  const [isLoading, setIsLoading] = useState(false);
  
  // Dropdown states
  const [showLabels, setShowLabels] = useState(false);
  const [showSources, setShowSources] = useState(false);
  const [showStatuses, setShowStatuses] = useState(false);

  // Auto preview when filter changes
  useEffect(() => {
    const timer = setTimeout(async () => {
      setIsLoading(true);
      const result = await onPreview();
      setPreview(result);
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [filter, onPreview]);

  const updateFilter = (updates: Partial<RecipientFilter>) => {
    setFilter(prev => ({ ...prev, ...updates }));
  };

  const toggleLabel = (id: string) => {
    const newLabels = filter.labels.includes(id)
      ? filter.labels.filter(l => l !== id)
      : [...filter.labels, id];
    updateFilter({ labels: newLabels });
  };

  const toggleSource = (id: string) => {
    const newSources = filter.sources.includes(id)
      ? filter.sources.filter(s => s !== id)
      : [...filter.sources, id];
    updateFilter({ sources: newSources });
  };

  const toggleStatus = (id: string) => {
    const newStatuses = filter.statuses.includes(id)
      ? filter.statuses.filter(s => s !== id)
      : [...filter.statuses, id];
    updateFilter({ statuses: newStatuses });
  };

  const handleConfirm = () => {
    onSave(filter);
    onClose();
  };

  const hasFilters = filter.labels.length > 0 || filter.sources.length > 0 || filter.statuses.length > 0;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex-shrink-0 border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Chọn người nhận</h3>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-gray-100">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Filter section */}
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Bộ lọc khách hàng
            </h4>
            
            <div className="space-y-3">
              {/* Labels filter */}
              <div className="relative">
                <button
                  onClick={() => setShowLabels(!showLabels)}
                  className="w-full flex items-center justify-between px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-gray-700">Nhãn khách hàng</span>
                    {filter.labels.length > 0 && (
                      <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full">
                        {filter.labels.length} đã chọn
                      </span>
                    )}
                  </div>
                  <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${showLabels ? 'rotate-180' : ''}`} />
                </button>
                
                {showLabels && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                    {MOCK_CUSTOMER_LABELS.map(label => (
                      <button
                        key={label.id}
                        onClick={() => toggleLabel(label.id)}
                        className="w-full flex items-center justify-between px-4 py-2 hover:bg-gray-50"
                      >
                        <div className="flex items-center gap-2">
                          <span 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: label.color }}
                          />
                          <span className="text-gray-700">{label.name}</span>
                        </div>
                        {filter.labels.includes(label.id) && (
                          <Check className="w-4 h-4 text-blue-600" />
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Sources filter */}
              <div className="relative">
                <button
                  onClick={() => setShowSources(!showSources)}
                  className="w-full flex items-center justify-between px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-gray-700">Nguồn khách hàng</span>
                    {filter.sources.length > 0 && (
                      <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full">
                        {filter.sources.length} đã chọn
                      </span>
                    )}
                  </div>
                  <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${showSources ? 'rotate-180' : ''}`} />
                </button>
                
                {showSources && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                    {MOCK_CUSTOMER_SOURCES.map(source => (
                      <button
                        key={source.id}
                        onClick={() => toggleSource(source.id)}
                        className="w-full flex items-center justify-between px-4 py-2 hover:bg-gray-50"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-gray-700">{source.name}</span>
                        </div>
                        {filter.sources.includes(source.id) && (
                          <Check className="w-4 h-4 text-blue-600" />
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Statuses filter */}
              <div className="relative">
                <button
                  onClick={() => setShowStatuses(!showStatuses)}
                  className="w-full flex items-center justify-between px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-gray-700">Trạng thái khách hàng</span>
                    {filter.statuses.length > 0 && (
                      <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full">
                        {filter.statuses.length} đã chọn
                      </span>
                    )}
                  </div>
                  <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${showStatuses ? 'rotate-180' : ''}`} />
                </button>
                
                {showStatuses && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                    {MOCK_CUSTOMER_STATUSES.map(status => (
                      <button
                        key={status.id}
                        onClick={() => toggleStatus(status.id)}
                        className="w-full flex items-center justify-between px-4 py-2 hover:bg-gray-50"
                      >
                        <div className="flex items-center gap-2">
                          <span 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: status.color }}
                          />
                          <span className="text-gray-700">{status.name}</span>
                        </div>
                        {filter.statuses.includes(status.id) && (
                          <Check className="w-4 h-4 text-blue-600" />
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Clear filters */}
            {hasFilters && (
               <button
                 onClick={() => updateFilter({ labels: [], sources: [], statuses: [] })}
                 className="mt-3 text-sm text-blue-600 hover:text-blue-700"
               >
                 Xóa tất cả bộ lọc
               </button>
            )}
          </div>

          {/* Preview section */}
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex items-center justify-between">
              <span className="font-medium text-gray-900">Xem trước người nhận</span>
              {isLoading && <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />}
            </div>
            
            {preview ? (
              <div className="p-4">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <p className="text-2xl font-bold text-blue-600">{preview.total_customers}</p>
                    <p className="text-sm text-gray-600">Tổng khách hàng</p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg">
                    <p className="text-2xl font-bold text-green-600">{preview.valid_emails}</p>
                    <p className="text-sm text-gray-600">SĐT hợp lệ</p>
                  </div>
                  <div className="p-4 bg-red-50 rounded-lg">
                    <p className="text-2xl font-bold text-red-600">{preview.invalid_emails}</p>
                    <p className="text-sm text-gray-600">SĐT không hợp lệ</p>
                  </div>
                </div>

                {preview.invalid_emails > 0 && (
                  <div className="mt-4 flex items-start gap-2 p-3 bg-yellow-50 rounded-lg">
                    <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-yellow-800">
                        <strong>{preview.invalid_emails}</strong> số điện thoại không hợp lệ sẽ không được gửi
                      </p>
                      <p className="text-xs text-yellow-700 mt-1">
                        Bao gồm: SĐT bị trống, sai định dạng (thiếu số hoặc sai đầu số)
                      </p>
                    </div>
                  </div>
                )}

                {/* Sample preview */}
                {preview.sample_recipients && preview.sample_recipients.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">Ví dụ người nhận:</p>
                    <div className="space-y-2">
                      {preview.sample_recipients.slice(0, 3).map((customer, index) => (
                        <div key={index} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium text-gray-600">
                            {customer.name.charAt(0)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">{customer.name}</p>
                            <p className="text-xs text-gray-500 truncate">{customer.email /* still using email prop as phone */}</p>
                          </div>
                        </div>
                      ))}
                      {preview.total_customers > 3 && (
                        <p className="text-xs text-gray-500 text-center">
                          +{preview.total_customers - 3} người khác
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-8 text-center text-gray-500">
                <Users className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>Chọn bộ lọc để xem trước người nhận</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex-shrink-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex items-center justify-between rounded-b-xl">
          <div className="text-sm text-gray-500">
            {preview && (
              <span>
                <strong className="text-gray-900">{preview.valid_emails}</strong> người nhận hợp lệ
              </span>
            )}
          </div>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Hủy
            </button>
            <button
              onClick={handleConfirm}
              disabled={!preview || preview.valid_emails === 0}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Xác nhận
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
