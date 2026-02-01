'use client';

import React, { useState, useMemo } from 'react';
import { X, Send, Calendar, Layers, AlertTriangle, Users } from 'lucide-react';
import { SendType, BatchSchedule } from '../types';
import { formatDateTime } from '../utils';

interface ConfirmStartModalProps {
  campaignName: string;
  subject: string;
  recipientCount: number;
  onStart: (sendType: SendType, scheduledAt?: Date | null, batches?: BatchSchedule[]) => void;
  onClose: () => void;
}

export function ConfirmStartModal({ 
  campaignName, 
  subject, 
  recipientCount, 
  onStart, 
  onClose 
}: ConfirmStartModalProps) {
  const [sendType, setSendType] = useState<SendType>('immediate');
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [isConfirming, setIsConfirming] = useState(false);
  const [batchCount, setBatchCount] = useState(2);
  const [batchInterval, setBatchInterval] = useState(30);

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

  const batches = useMemo<BatchSchedule[]>(() => {
    if (sendType !== 'batch') return [];
    const perBatch = Math.ceil(recipientCount / batchCount);
    const result: BatchSchedule[] = [];
    const startTime = new Date();
    for (let i = 0; i < batchCount; i++) {
      const batchTime = new Date(startTime.getTime() + i * batchInterval * 60 * 1000);
      result.push({
        batch_number: i + 1,
        scheduled_at: batchTime,
        email_count: i === batchCount - 1 ? recipientCount - perBatch * i : perBatch,
        status: 'pending',
        sent_count: 0,
        failed_count: 0,
        started_at: null,
        completed_at: null
      });
    }
    return result;
  }, [sendType, batchCount, batchInterval, recipientCount]);

  const handleConfirm = async () => {
    setIsConfirming(true);
    if (sendType === 'immediate') onStart('immediate');
    else if (sendType === 'scheduled') onStart('scheduled', scheduledAt);
    else if (sendType === 'batch') onStart('batch', null, batches);
  };

  const canStart = sendType === 'immediate' || 
    (sendType === 'scheduled' && isValidSchedule) || 
    (sendType === 'batch' && batchCount >= 2);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-xl">
          <h3 className="text-lg font-semibold text-gray-900">Bắt đầu gửi chiến dịch</h3>
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
              <span className="text-gray-500">Tiêu đề:</span>
              <span className="font-medium text-gray-900 truncate max-w-[200px]">{subject}</span>
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
            <label className="block text-sm font-medium text-gray-700 mb-3">Phương thức gửi</label>
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
                  <p className="text-sm text-gray-500 mt-1">Bắt đầu gửi email ngay sau khi xác nhận</p>
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
                  <p className="text-sm text-gray-500 mt-1">Chọn thời điểm cụ thể để gửi email</p>
                  
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

              {/* Batch */}
              <label className={`
                flex items-start gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all
                ${sendType === 'batch' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}
              `}>
                <input
                  type="radio"
                  name="sendType"
                  value="batch"
                  checked={sendType === 'batch'}
                  onChange={() => setSendType('batch')}
                  className="mt-1"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-purple-600" />
                    <span className="font-medium text-gray-900">Gửi theo đợt</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">Chia nhỏ danh sách và gửi từng đợt</p>
                  
                  {sendType === 'batch' && (
                    <div className="mt-3 space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">Số đợt</label>
                          <select
                            value={batchCount}
                            onChange={(e) => setBatchCount(parseInt(e.target.value))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                          >
                            {[2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
                              <option key={n} value={n}>{n} đợt</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">Khoảng cách</label>
                          <select
                            value={batchInterval}
                            onChange={(e) => setBatchInterval(parseInt(e.target.value))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                          >
                            <option value={15}>15 phút</option>
                            <option value={30}>30 phút</option>
                            <option value={60}>1 giờ</option>
                            <option value={120}>2 giờ</option>
                          </select>
                        </div>
                      </div>
                      
                      {/* Batch preview */}
                      <div className="bg-white rounded-lg p-3 border border-gray-200">
                        <p className="text-xs font-medium text-gray-500 mb-2">Lịch gửi dự kiến:</p>
                        <div className="space-y-1">
                          {batches.slice(0, 3).map((batch, i) => (
                            <div key={i} className="flex justify-between text-xs">
                              <span className="text-gray-600">Đợt {batch.batch_number}</span>
                              <span className="text-gray-500">
                                {formatDateTime(batch.scheduled_at)} • {batch.email_count} người
                              </span>
                            </div>
                          ))}
                          {batches.length > 3 && (
                            <p className="text-xs text-gray-400">+{batches.length - 3} đợt khác</p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </label>
            </div>
          </div>

          {/* Warning for large campaigns */}
          {recipientCount > 1000 && sendType === 'immediate' && (
            <div className="flex items-start gap-2 p-3 bg-yellow-50 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-yellow-800 font-medium">Chiến dịch có số lượng lớn</p>
                <p className="text-sm text-yellow-700">
                  Với {recipientCount.toLocaleString()} người nhận, nên cân nhắc gửi theo đợt.
                </p>
              </div>
            </div>
          )}

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
            {sendType === 'immediate' && 'Email sẽ được gửi ngay'}
            {sendType === 'scheduled' && scheduledAt && `Sẽ gửi lúc ${formatDateTime(scheduledAt)}`}
            {sendType === 'batch' && `Sẽ gửi ${batches.length} đợt`}
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
