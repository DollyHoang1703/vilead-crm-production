'use client';

import React, { useState } from 'react';
import { X, FileSpreadsheet, Database, Download, UploadCloud, Users, ArrowRight, CheckCircle2, ChevronDown, Check } from 'lucide-react';
import { RecipientFilter, RecipientsPreview } from '../email-marketing/types';

interface ZbsRecipientsConfigModalProps {
  onClose: () => void;
  onSave: (config: { type: 'excel' | 'crm', details: any }) => void;
  templateName: string;
}

export function ZbsRecipientsConfigModal({ onClose, onSave, templateName }: ZbsRecipientsConfigModalProps) {
  const [activeTab, setActiveTab] = useState<'excel' | 'crm'>('excel');
  const [fileName, setFileName] = useState('');
  const [isMapping, setIsMapping] = useState(false);

  // Mocks
  const templateVariables = ['customer_name', 'order_code', 'address', 'phone', 'email', 'product_name', 'quantity'];
  const previewValidCount = 1450;
  const previewInvalidCount = 50;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFileName(e.target.files[0].name);
      setIsMapping(true);
      // Giả lập load
      setTimeout(() => setIsMapping(false), 800);
    }
  };

  const handleSave = () => {
    onSave({ type: activeTab, details: {} });
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/60" onClick={onClose} />
      
      <div className="relative bg-[#F8FAFC] rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex-shrink-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10 shadow-sm">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Cấu hình người nhận</h2>
            <p className="text-sm text-gray-500 mt-0.5">Xác định tập dữ liệu người nhận và map biến ZNS</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={onClose} className="px-4 py-2 font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              Đóng
            </button>
            <button 
              onClick={handleSave} 
              className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50"
              disabled={activeTab === 'excel' && !fileName}
            >
              Lưu cấu hình
            </button>
          </div>
        </div>

        {/* Content Body: 2 Columns */}
        <div className="flex-1 flex overflow-hidden">
          
          {/* Left Column: Template Information */}
          <div className="w-[380px] bg-white border-r border-gray-200 overflow-y-auto hidden md:block">
            <div className="p-6">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <div className="w-8 h-8 rounded bg-blue-50 flex justify-center items-center">
                  <Database className="w-4 h-4 text-blue-600" />
                </div>
                ZBS Template
              </h3>
              
              <div className="bg-gray-50 rounded-xl border border-gray-200 p-4 mb-6">
                <p className="text-sm font-medium text-gray-900 truncate mb-1" title={templateName || 'Xác nhận đơn hàng'}>
                  {templateName || 'Xác nhận đơn hàng trước khi giao'}
                </p>
                <div className="text-xs text-gray-500 mb-4">Template ID: 200607</div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
                  <h4 className="font-bold text-gray-800 text-sm mb-3">XÁC NHẬN ĐƠN HÀNG</h4>
                  <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                    Cám ơn <span className="text-red-500 font-mono text-xs bg-red-50 px-1 rounded">{`{{customer_name}}`}</span> đã tin tưởng. Chúng tôi đã nhận được yêu cầu đặt hàng của bạn. Thông tin chi tiết đơn hàng:
                  </p>
                  
                  <div className="grid grid-cols-2 gap-y-2 text-sm">
                    <span className="text-gray-500">Mã đơn hàng</span>
                    <span className="text-red-500 font-mono text-xs text-right break-all">{`{{order_code}}`}</span>
                    
                    <span className="text-gray-500">Địa chỉ</span>
                    <span className="text-green-600 font-mono text-xs text-right break-all">{`{{address}}`}</span>
                    
                    <span className="text-gray-500">Điện thoại</span>
                    <span className="text-red-500 font-mono text-xs text-right break-all">{`{{phone}}`}</span>
                    
                    <span className="text-gray-500">Email</span>
                    <span className="text-red-500 font-mono text-xs text-right break-all">{`{{email}}`}</span>
                    
                    <span className="text-gray-500">Sản phẩm</span>
                    <span className="text-red-500 font-mono text-xs text-right break-all">{`{{product_name}}`}</span>
                    
                    <span className="text-gray-500">Số lượng</span>
                    <span className="text-red-500 font-mono text-xs text-right break-all">{`{{quantity}}`}</span>
                  </div>
                </div>
              </div>
              
              <div className="p-4 bg-yellow-50/50 border border-yellow-100 rounded-lg text-xs leading-relaxed text-yellow-800">
                <strong>Lưu ý:</strong> Nguồn dữ liệu phải đảm bảo chứa tất cả các biến số được tô sáng phía trên để Zalo duyệt gửi tin nhắn hợp lệ.
              </div>
            </div>
          </div>

          {/* Right Column: Configuration Tabs */}
          <div className="flex-1 flex flex-col overflow-y-auto">
            <div className="p-8">
              <h3 className="font-semibold text-gray-900 mb-4 whitespace-nowrap">Hình thức thêm khách hàng</h3>
              
              <div className="flex flex-wrap gap-3 mb-8">
                <button
                  onClick={() => setActiveTab('excel')}
                  className={`flex items-center gap-2 px-5 py-3 rounded-lg font-medium border-2 transition-all ${
                    activeTab === 'excel' 
                      ? 'border-green-500 bg-green-50 text-green-700' 
                      : 'border-transparent bg-white text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <FileSpreadsheet className="w-5 h-5" />
                  File Excel
                </button>
                <button
                  onClick={() => setActiveTab('crm')}
                  className={`flex items-center gap-2 px-5 py-3 rounded-lg font-medium border-2 transition-all ${
                    activeTab === 'crm' 
                      ? 'border-blue-500 bg-blue-50 text-blue-700' 
                      : 'border-transparent bg-white text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Users className="w-5 h-5" />
                  Thuộc tính khách hàng (CRM)
                </button>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 min-h-[400px]">
                {activeTab === 'excel' && (
                  <div className="max-w-2xl animate-fade-in space-y-8">
                    
                    <div className="bg-blue-50/50 p-5 rounded-xl border border-blue-100">
                      <h4 className="font-semibold text-blue-900 flex items-center gap-2 mb-2">
                        <Download className="w-5 h-5" />
                        Tải file mẫu Excel
                      </h4>
                      <p className="text-sm text-blue-800/80 mb-4 leading-relaxed">
                        Hệ thống đã tự động tạo file mẫu Excel chứa các Cột tương ứng với Biến số của 
                        template <strong>{templateName || 'Xác nhận đơn hàng'}</strong>. Hãy tải về và điền dữ liệu.
                      </p>
                      <button className="flex items-center gap-2 px-4 py-2 bg-white text-blue-600 border border-blue-200 hover:bg-blue-50 rounded-lg text-sm font-medium transition-colors shadow-sm">
                        <Download className="w-4 h-4" />
                        Download Excel sample
                      </button>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-4">Tải lên File dữ liệu</h4>
                      
                      {!fileName ? (
                        <div className="relative border-2 border-dashed border-gray-300 rounded-xl p-8 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors group cursor-pointer">
                          <input 
                            type="file" 
                            accept=".xlsx, .xls, .csv" 
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            onChange={handleFileUpload}
                          />
                          <div className="w-14 h-14 rounded-full bg-indigo-50 flex flex-col items-center justify-center mb-4 text-indigo-500 group-hover:scale-110 transition-transform">
                            <UploadCloud className="w-7 h-7" />
                          </div>
                          <p className="font-medium text-gray-900 mb-1">Click hoặc kéo thả file vào đây</p>
                          <p className="text-xs text-gray-500">Hỗ trợ Excel (.xlsx, .xls) tối đa 5000 dòng</p>
                        </div>
                      ) : (
                        <div className="border border-green-200 bg-green-50 rounded-xl p-6 flex flex-col items-center justify-center relative">
                          <button onClick={() => setFileName('')} className="absolute top-4 right-4 p-1 rounded-md text-gray-400 hover:text-red-500 transition-colors">
                            <X className="w-5 h-5" />
                          </button>
                          
                          {isMapping ? (
                            <div className="flex flex-col items-center animate-pulse py-4">
                              <div className="w-10 h-10 border-4 border-green-200 border-t-green-600 rounded-full animate-spin mb-3" />
                              <p className="text-green-700 font-medium font-sm">Đang trích xuất biến số...</p>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center">
                              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-3 text-green-600">
                                <CheckCircle2 className="w-6 h-6" />
                              </div>
                              <p className="font-medium text-gray-900">{fileName}</p>
                              <div className="flex gap-4 mt-4">
                                <div className="text-center px-4 py-2 bg-white rounded-lg border border-green-100 shadow-sm min-w-[120px]">
                                  <div className="text-2xl font-bold text-green-600">{previewValidCount}</div>
                                  <div className="text-xs text-gray-500">SĐT hợp lệ</div>
                                </div>
                                <div className="text-center px-4 py-2 bg-white rounded-lg border border-red-100 shadow-sm min-w-[120px]">
                                  <div className="text-2xl font-bold text-red-500">{previewInvalidCount}</div>
                                  <div className="text-xs text-gray-500">Không hợp lệ</div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      <div className="mt-4 flex items-center gap-2">
                        <input type="checkbox" id="rm_dupe" className="w-4 h-4 text-blue-600 rounded border-gray-300" defaultChecked />
                        <label htmlFor="rm_dupe" className="text-sm text-gray-600">Xóa các số điện thoại trùng lặp trong file</label>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'crm' && (
                  <div className="animate-fade-in space-y-8">
                    {/* CRM Filters */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs">1</span>
                        Bộ lọc hệ thống
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="relative">
                          <label className="text-xs font-semibold text-gray-500 mb-1.5 block uppercase">Nhãn khách hàng</label>
                          <select className="w-full pl-3 pr-8 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors">
                            <option value="">Tất cả</option>
                            <option value="vip">VIP</option>
                            <option value="new">Mới</option>
                          </select>
                          <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 bottom-3 pointer-events-none" />
                        </div>
                        <div className="relative">
                          <label className="text-xs font-semibold text-gray-500 mb-1.5 block uppercase">Nguồn khách hàng</label>
                          <select className="w-full pl-3 pr-8 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors">
                            <option value="">Tất cả nguồn</option>
                            <option value="fb">Facebook</option>
                            <option value="web">Website</option>
                          </select>
                          <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 bottom-3 pointer-events-none" />
                        </div>
                        <div className="relative">
                          <label className="text-xs font-semibold text-gray-500 mb-1.5 block uppercase">Trạng thái KH</label>
                          <select className="w-full pl-3 pr-8 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors">
                            <option value="">Tất cả trạng thái</option>
                            <option value="interested">Quan tâm</option>
                            <option value="buying">Đang mua</option>
                          </select>
                          <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 bottom-3 pointer-events-none" />
                        </div>
                      </div>
                    </div>

                    {/* Mapping Config */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs">2</span>
                        Ánh xạ trường (Mapping Variables)
                      </h4>
                      <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                        <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                          {templateVariables.map((variable) => (
                            <div key={variable} className="flex items-center justify-between bg-white px-3 py-2 border border-gray-200 rounded-lg shadow-sm">
                              <span className="text-xs font-mono text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded">{`{{${variable}}}`}</span>
                              <ArrowRight className="w-4 h-4 text-gray-300 mx-2" />
                              <select className="flex-1 py-1 px-2 border-none bg-transparent text-sm font-medium focus:ring-0 cursor-pointer">
                                <option>Tự động phát hiện</option>
                                <option>Tên Khách Hàng</option>
                                <option>SĐT</option>
                                <option>Mã Đơn</option>
                                <option>Địa chỉ</option>
                              </select>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Stats Result */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs">3</span>
                        Kết quả truy xuất
                      </h4>
                      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <div className="grid grid-cols-3 gap-6 text-center">
                          <div className="bg-blue-50/50 rounded-xl p-4 border border-blue-100">
                            <div className="text-3xl font-bold text-blue-600 mb-1">1500</div>
                            <div className="text-sm font-medium text-gray-600">Tổng khách hàng</div>
                          </div>
                          <div className="bg-green-50/50 rounded-xl p-4 border border-green-100">
                            <div className="text-3xl font-bold text-green-600 mb-1">{previewValidCount}</div>
                            <div className="text-sm font-medium text-gray-600">SĐT hợp lệ</div>
                          </div>
                          <div className="bg-red-50/50 rounded-xl p-4 border border-red-100">
                            <div className="text-3xl font-bold text-red-500 mb-1">{previewInvalidCount}</div>
                            <div className="text-sm font-medium text-gray-600">SĐT không hợp lệ</div>
                          </div>
                        </div>
                        <div className="mt-4 p-3 bg-yellow-50 text-xs text-yellow-800 rounded-lg flex items-start gap-2">
                          <AlertCircleIcon className="w-4 h-4 mt-0.5 flex-shrink-0" />
                          <p>
                            {previewInvalidCount} số điện thoại không hợp lệ sẽ bị bỏ qua khi gửi tin. Bao gồm: SĐT bị thiếu, sai định dạng hoặc số ảo.
                          </p>
                        </div>
                      </div>
                    </div>

                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AlertCircleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
}
