'use client';

import React, { useState } from 'react';
import { X, UploadCloud, FileSpreadsheet, Download, CheckCircle, Clock, Send } from 'lucide-react';
import { ZbsTemplate } from './ZbsTemplateEditorModal';

interface ZbsCampaignQuickCreateModalProps {
  open: boolean;
  onClose: () => void;
  template: ZbsTemplate | null;
}

export function ZbsCampaignQuickCreateModal({ open, onClose, template }: ZbsCampaignQuickCreateModalProps) {
  const [step, setStep] = useState(1);
  const [checkDuplicates, setCheckDuplicates] = useState(true);
  const [campaignName, setCampaignName] = useState('');
  const [sendTime, setSendTime] = useState<'now' | 'scheduled'>('now');
  const [scheduleDate, setScheduleDate] = useState('');

  if (!open || !template) return null;

  // Mock params table like in the image
  const paramsList = [
    { name: 'customer_name', length: 200, type: 'string' },
    { name: 'phone', length: 30, type: 'string' },
    { name: 'invoice_no', length: 30, type: 'string' },
    { name: 'invoice_date', length: 20, type: 'date' },
    { name: 'series', length: 30, type: 'string' },
    { name: 'search_code', length: 30, type: 'string' },
  ];

  // Mock parsed data for step 2
  const mockData = [
    { customer_name: 'Nguyễn Văn A', phone: '0987654321', invoice_no: 'INV001', invoice_date: '05/04/2026', series: 'AB/26E', search_code: 'XYZ123' },
    { customer_name: 'Trần Thị B', phone: '0912345678', invoice_no: 'INV002', invoice_date: '05/04/2026', series: 'AB/26E', search_code: 'ABC987' },
  ];

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
    else onClose();
  };

  const handleFinish = () => {
    alert('Chiến dịch ZNS đã được tạo thành công!');
    setStep(1);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[70] flex flex-col items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/60" onClick={onClose} />
      
      <div className="relative w-full max-w-3xl bg-white rounded-xl shadow-2xl flex flex-col overflow-hidden z-10 max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
          <h2 className="text-xl font-semibold text-gray-900">
            {step === 1 ? 'Tạo chiến dịch' : step === 2 ? 'Kiểm tra dữ liệu' : 'Xác nhận chiến dịch & cài đặt thời gian'}
          </h2>
          <button onClick={onClose} className="p-2 bg-gray-100 hover:bg-gray-200 text-gray-500 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-1">Nội dung tệp mẫu</h3>
                <p className="text-xs text-gray-500 italic mb-3">Dữ liệu trong tập danh sách tải lên cần phải đúng thứ tự cột và quy định về tham số như bên dưới:</p>
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-gray-100/70 text-gray-700 border-b border-gray-200">
                      <tr>
                        <th className="py-2.5 px-4 font-medium">Tên tham số</th>
                        <th className="py-2.5 px-4 font-medium">Chiều dài kí tự</th>
                        <th className="py-2.5 px-4 font-medium">Loại dữ liệu</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {paramsList.map((param, i) => (
                        <tr key={i} className="hover:bg-gray-50/50">
                          <td className="py-2.5 px-4 text-gray-900">{param.name}</td>
                          <td className="py-2.5 px-4 text-gray-600">{param.length}</td>
                          <td className="py-2.5 px-4 text-gray-600">{param.type}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-2">Tải danh sách mẫu</h3>
                <button className="flex items-center gap-2 px-4 py-2 border border-green-500 text-green-600 rounded-lg font-medium hover:bg-green-50 transition-colors">
                  <FileSpreadsheet className="w-5 h-5" /> Tải file mẫu <Download className="w-4 h-4 ml-1" />
                </button>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-2">Tải lên danh sách</h3>
                <label className="flex items-start gap-2 mb-3 cursor-pointer">
                  <div className="pt-0.5">
                    <input 
                      type="checkbox" 
                      checked={checkDuplicates} 
                      onChange={(e) => setCheckDuplicates(e.target.checked)} 
                      className="w-4 h-4 rounded border-gray-300 text-green-600 focus:ring-green-500" 
                    />
                  </div>
                  <div>
                    <span className="text-sm text-gray-800">Kiểm tra số điện thoại trùng lặp trong danh sách tải lên</span>
                    <p className="text-xs text-gray-500 italic block">(Bỏ chọn nếu bạn muốn chấp nhận các số điện thoại trùng lặp trong danh sách)</p>
                  </div>
                </label>

                <div 
                  className="w-full border-2 border-dashed border-green-300 rounded-xl p-8 flex flex-col items-center justify-center bg-green-50/30 hover:bg-green-50/50 cursor-pointer transition-colors"
                  onClick={() => handleNext()}
                >
                  <UploadCloud className="w-8 h-8 text-green-500 mb-3" />
                  <span className="text-green-600 font-medium">Kéo thả hoặc tải danh sách lên\n(Tối đa 5.000 dòng)</span>
                  <FileSpreadsheet className="w-12 h-12 text-green-600 mt-4 opacity-80" />
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 bg-blue-50 border border-blue-100 rounded-lg">
                <CheckCircle className="w-6 h-6 text-blue-500" />
                <div>
                  <h3 className="font-medium text-blue-900">Đã nạp file dữ liệu thành công</h3>
                  <p className="text-sm text-blue-700">Tìm thấy {mockData.length} dòng dữ liệu hợp lệ.</p>
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm whitespace-nowrap">
                    <thead className="bg-gray-100/70 text-gray-700 border-b border-gray-200">
                      <tr>
                        <th className="py-2.5 px-4 font-medium">Customer Name</th>
                        <th className="py-2.5 px-4 font-medium">Phone</th>
                        <th className="py-2.5 px-4 font-medium">Invoice No</th>
                        <th className="py-2.5 px-4 font-medium">Invoice Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {mockData.map((row, i) => (
                        <tr key={i} className="hover:bg-gray-50/50">
                          <td className="py-2.5 px-4 text-gray-900">{row.customer_name}</td>
                          <td className="py-2.5 px-4 text-gray-600">{row.phone}</td>
                          <td className="py-2.5 px-4 text-gray-600">{row.invoice_no}</td>
                          <td className="py-2.5 px-4 text-gray-600">{row.invoice_date}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Tên chiến dịch <span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  value={campaignName}
                  onChange={(e) => setCampaignName(e.target.value)}
                  placeholder="Nhập tên chiến dịch (VD: CSKH tháng 10...)" 
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-3">Thời gian gửi chiến dịch</label>
                <div className="space-y-3">
                  <label className={`flex items-start gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${sendTime === 'now' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-200'}`}>
                    <input type="radio" checked={sendTime === 'now'} onChange={() => setSendTime('now')} className="mt-1" />
                    <div className="flex items-center gap-2">
                       <Send className="w-5 h-5 text-gray-600" />
                      <div>
                        <span className="font-medium text-gray-900 block">Gửi ngay lập tức</span>
                        <span className="text-sm text-gray-500 block">Chiến dịch sẽ được thực thi ngay sau khi tạo thành công.</span>
                      </div>
                    </div>
                  </label>

                  <label className={`flex items-start gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${sendTime === 'scheduled' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-200'}`}>
                    <input type="radio" checked={sendTime === 'scheduled'} onChange={() => setSendTime('scheduled')} className="mt-1" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                         <Clock className="w-5 h-5 text-gray-600" />
                        <span className="font-medium text-gray-900 block">Hẹn giờ gửi</span>
                      </div>
                       <span className="text-sm text-gray-500 block mb-3">Lên lịch hệ thống tự động gửi ZNS.</span>
                      {sendTime === 'scheduled' && (
                        <input 
                          type="datetime-local" 
                          value={scheduleDate}
                          onChange={(e) => setScheduleDate(e.target.value)}
                          className="w-full sm:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      )}
                    </div>
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 shrink-0 bg-gray-50">
          <button
            onClick={handleBack}
            className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Quay lại
          </button>
          
          {step < 3 ? (
            <button
              onClick={handleNext}
              className="px-6 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Tiếp tục
            </button>
          ) : (
            <button
               onClick={handleFinish}
               disabled={!campaignName}
               className="px-6 py-2.5 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
            >
               Tạo chiến dịch
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
