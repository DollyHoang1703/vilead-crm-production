'use client';

import React, { useState, useMemo } from 'react';
import { X, Send, Calendar, AlertTriangle, Users } from 'lucide-react';
import { formatDateTime } from '../email-marketing/utils';

interface ZbsConfirmStartModalProps {
  campaignName: string;
  templateName: string;
  recipientCount: number;
  onStart: (type: 'immediate' | 'scheduled', scheduledAt?: Date | null) => void;
  onClose: () => void;
}

export function ZbsConfirmStartModal({ 
  campaignName, 
  templateName, 
  recipientCount, 
  onStart, 
  onClose 
}: ZbsConfirmStartModalProps) {
  const [sendType, setSendType] = useState<'immediate' | 'scheduled'>('immediate');
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [isConfirming, setIsConfirming] = useState(false);

  const minDate = new Date().toISOString().split('T')[0];

  const scheduledAt = useMemo(() => {
    if (sendType === 'scheduled' && scheduledDate && scheduledTime) {
      return new Date(`${scheduledDate}T${scheduledTime}`);
    }
    return null;
  }, [sendType, scheduledDate, scheduledTime]);

  const isValidSchedule = useMemo(() => {
    if (sendType !== 'scheduled') return true;
    if (!scheduledAt) return false;
    return scheduledAt.getTime() > Date.now() + 5 * 60 * 1000;
  }, [sendType, scheduledAt]);

  const handleConfirm = async () => {
    setIsConfirming(true);
    if (sendType === 'immediate') onStart('immediate');
    else if (sendType === 'scheduled') onStart('scheduled', scheduledAt);
  };

  const canStart = sendType === 'immediate' || 
    (sendType === 'scheduled' && isValidSchedule);

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-xl z-10">
          <h3 className="text-lg font-semibold text-gray-900">Bắt đầu gửi chiến dịch ZBS</h3>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-gray-100">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Campaign summary */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-500">Chiến dịch:</span>
              <span className="font-medium text-gray-900">{campaignName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Mẫu tin nhắn:</span>
              <span className="font-medium text-gray-900 truncate max-w-[200px]">{templateName || 'Chưa chọn mẫu'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Người nhận:</span>
              <span className="font-medium text-gray-900 flex items-center gap-1">
                <Users className="w-4 h-4" />
                {recipientCount.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Send type options */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Phương thức gửi tin</label>
            <div className="space-y-3">
              {/* Immediate */}
              <label className={`
                flex items-start gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all
                ${sendType === 'immediate' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}
              `}>
                <input
                  type="radio"
                  name="sendType"
                  value="immediate"
                  checked={sendType === 'immediate'}
                  onChange={() => setSendType('immediate')}
                  className="mt-1"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Send className="w-4 h-4 text-blue-600" />
                    <span className="font-medium text-gray-900">Gửi ngay lập tức</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">Bắt đầu gửi ZNS ngay sau khi xác nhận</p>
                </div>
              </label>

              {/* Scheduled */}
              <label className={`
                flex items-start gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all
                ${sendType === 'scheduled' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}
              `}>
                <input
                  type="radio"
                  name="sendType"
                  value="scheduled"
                  checked={sendType === 'scheduled'}
                  onChange={() => setSendType('scheduled')}
                  className="mt-1"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-yellow-600" />
                    <span className="font-medium text-gray-900">Lên lịch gửi</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">Chọn thời điểm cụ thể để bắt đầu gửi</p>
                  
                  {sendType === 'scheduled' && (
                    <div className="mt-3 grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Ngày gửi</label>
                        <input
                          type="date"
                          value={scheduledDate}
                          onChange={(e) => setScheduledDate(e.target.value)}
                          min={minDate}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Giờ gửi</label>
                        <input
                          type="time"
                          value={scheduledTime}
                          onChange={(e) => setScheduledTime(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </label>
            </div>
          </div>

          {/* Validation error */}
          {sendType === 'scheduled' && scheduledDate && scheduledTime && !isValidSchedule && (
            <div className="flex items-center gap-2 p-3 bg-red-50 text-red-700 rounded-lg">
              <AlertTriangle className="w-5 h-5" />
              <span className="text-sm">Thời gian gửi phải ít nhất 5 phút sau hiện tại</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex items-center justify-between rounded-b-xl">
          <p className="text-sm text-gray-500">
            {sendType === 'immediate' && 'ZNS sẽ được gửi ngay'}
            {sendType === 'scheduled' && scheduledAt && `Sẽ gửi lúc ${formatDateTime(scheduledAt)}`}
          </p>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Hủy
            </button>
            <button
              onClick={handleConfirm}
              disabled={!canStart || isConfirming}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isConfirming ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Đang xử lý...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  {sendType === 'scheduled' ? 'Lên lịch gửi' : 'Bắt đầu gửi'}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
