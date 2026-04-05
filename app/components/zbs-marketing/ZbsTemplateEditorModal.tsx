'use client';

import React, { useState, useEffect } from 'react';
import { 
  X, 
  ArrowLeft,
  Save,
  Link as LinkIcon,
  Phone,
  MessageSquare,
  Plus,
  Trash2
} from 'lucide-react';

export interface ZbsTemplate {
  id: string;
  name: string;
  category: string;
  description: string;
  status: 'approved' | 'pending' | 'rejected';
  usageCount: number;
  updatedAt: string;
  type: 'system' | 'user';
  content?: string;
  buttons?: Array<{ type: 'web' | 'phone', label: string, value: string }>;
  znsId?: string;
  templateType?: string;
  oa?: string;
  price?: string;
  priceUserId?: string;
  ztime?: string;
  quality?: string;
  purpose?: string;
}

interface ZbsTemplateEditorModalProps {
  open: boolean;
  onClose: () => void;
  mode: 'create' | 'edit' | 'clone';
  template: ZbsTemplate | null;
  onSave: (data: Partial<ZbsTemplate>) => Promise<{ success: boolean; message: string }>;
}

export function ZbsTemplateEditorModal({
  open,
  onClose,
  mode,
  template,
  onSave
}: ZbsTemplateEditorModalProps) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Chăm sóc');
  const [content, setContent] = useState('');
  const [buttons, setButtons] = useState<Array<{ type: 'web' | 'phone', label: string, value: string }>>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      if (mode === 'create') {
        setName('');
        setContent('Kính gửi {{customer_name}},\n\nNội dung tin nhắn...');
        setButtons([]);
        setCategory('Chăm sóc');
      } else if (template) {
        setName(mode === 'clone' ? `${template.name} - Bản sao` : template.name);
        setCategory(template.category || 'Chăm sóc');
        setContent(template.content || 'Kính gửi {{customer_name}},\n\nNội dung tin nhắn...');
        setButtons(template.buttons || []);
      }
    }
  }, [open, mode, template]);

  const handleSave = async () => {
    if (!name.trim() || !content.trim()) {
      alert('Vui lòng nhập tên và nội dung mẫu (template).');
      return;
    }
    setSaving(true);
    await onSave({
      name,
      category,
      content,
      buttons,
      type: 'user',
      status: 'pending',
      updatedAt: new Date().toISOString(),
    });
    setSaving(false);
  };

  const getTitle = () => {
    switch (mode) {
      case 'create': return 'Tạo Mẫu ZNS mới';
      case 'edit': return 'Chỉnh sửa Mẫu ZNS';
      case 'clone': return 'Tạo Bản sao Mẫu ZNS';
    }
  };

  const addVariable = (variable: string) => {
    setContent(prev => prev + variable);
  };

  const commonVariables = [
    { label: 'Tên KH', value: '{{customer_name}}' },
    { label: 'SĐT', value: '{{phone}}' },
    { label: 'Mã đơn', value: '{{order_code}}' },
    { label: 'Tổng tiền', value: '{{total_amount}}' },
    { label: 'Ngày', value: '{{day}}' },
  ];

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="flex-shrink-0 flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-white shadow-sm">
        <div className="flex items-center gap-4">
          <button
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            onClick={onClose}
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <span className="font-medium text-lg text-gray-900">{getTitle()}</span>
          {(mode === 'edit' || mode === 'clone') && template?.status === 'approved' && (
            <span className="ml-2 px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-700">
              Approved
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          <button
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
            onClick={handleSave}
            disabled={saving}
          >
            <Save className="w-4 h-4" />
            {saving ? 'Đang lưu...' : 'Lưu và Gửi duyệt'}
          </button>
          <button
            className="p-2.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            onClick={onClose}
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Editor Body */}
      <div className="flex-1 overflow-auto p-6 flex justify-center">
        <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Left: Input Config */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
              <h3 className="font-semibold text-gray-900 mb-2">Thông tin cơ bản</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tên Mẫu ZNS</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nhập tên mẫu..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Loại Mẫu</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="Chăm sóc">Chăm sóc khách hàng</option>
                  <option value="Giao dịch">Giao dịch</option>
                  <option value="Khuyến mãi">Khuyến mãi / Hậu mãi</option>
                  <option value="Nhắc nhở">Nhắc nhở</option>
                  <option value="Mã OTP">Xác thực OTP</option>
                </select>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
              <div className="flex justify-between items-end mb-2">
                <h3 className="font-semibold text-gray-900">Nội dung tin nhắn</h3>
              </div>
              
              <div className="flex flex-wrap gap-2 mb-3">
                {commonVariables.map(v => (
                  <button
                    key={v.value}
                    onClick={() => addVariable(v.value)}
                    className="px-2 py-1 bg-gray-100 text-xs font-medium text-gray-600 rounded-md hover:bg-gray-200 transition-colors"
                  >
                    + {v.label}
                  </button>
                ))}
              </div>

              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={8}
                placeholder="Nhập nội dung tin nhắn. Sử dụng {{ten_bien}} để cá nhân hóa..."
                className="w-full p-4 font-mono text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none shadow-inner bg-gray-50 text-gray-800"
              />
              <p className="text-xs text-gray-500 text-right">
                {content.length} ký tự
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold text-gray-900">Nút Bấm CTA (Tối đa 2)</h3>
                {buttons.length < 2 && (
                  <button 
                    onClick={() => setButtons([...buttons, { type: 'web', label: 'Xem chi tiết', value: 'https://' }])}
                    className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1"
                  >
                    <Plus className="w-4 h-4" /> Thêm nút
                  </button>
                )}
              </div>

              {buttons.map((btn, index) => (
                <div key={index} className="flex flex-col gap-3 p-4 border border-gray-200 rounded-lg bg-gray-50 relative group">
                  <button 
                    onClick={() => setButtons(buttons.filter((_, i) => i !== index))}
                    className="absolute top-2 right-2 p-1 text-gray-400 hover:text-red-500 rounded"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Loại Nút</label>
                      <select
                        value={btn.type}
                        onChange={(e) => {
                          const newBtns = [...buttons];
                          newBtns[index].type = e.target.value as any;
                          setButtons(newBtns);
                        }}
                        className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg"
                      >
                        <option value="web">Mở Website</option>
                        <option value="phone">Gọi điện thoại</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Tên Nút</label>
                      <input
                        type="text"
                        value={btn.label}
                        onChange={(e) => {
                          const newBtns = [...buttons];
                          newBtns[index].label = e.target.value;
                          setButtons(newBtns);
                        }}
                        className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      {btn.type === 'web' ? 'Đường dẫn liên kết (URL bắt đầu bằng https://)' : 'Số điện thoại'}
                    </label>
                    <input
                      type="text"
                      value={btn.value}
                      onChange={(e) => {
                        const newBtns = [...buttons];
                        newBtns[index].value = e.target.value;
                        setButtons(newBtns);
                      }}
                      className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg"
                      placeholder={btn.type === 'web' ? 'https://example.com' : '09xxxx'}
                    />
                  </div>
                </div>
              ))}
              
              {buttons.length === 0 && (
                <div className="text-center py-4 text-sm text-gray-500 italic">
                  Chưa có nút bấm CTA nào
                </div>
              )}
            </div>

          </div>

          {/* Right: Phone Preview (Mobile frame) */}
          <div className="flex justify-center sticky top-6 items-start">
            <div className="relative w-[320px] h-[650px] bg-gray-900 rounded-[40px] border-[14px] border-gray-900 shadow-2xl overflow-hidden ring-1 ring-gray-200">
              <div className="absolute top-0 inset-x-0 h-6 bg-gray-900 rounded-t-[30px] z-20 flex justify-center pt-2">
                <div className="w-16 h-4 bg-black rounded-full" />
              </div>
              <div className="w-full h-full bg-gray-100 flex flex-col relative pt-8">
                <div className="px-4 py-3 bg-white border-b border-gray-200 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center shadow-sm">
                    <MessageSquare className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">Zalo OA Sandbox</p>
                    <p className="text-xs text-gray-500">Zalo Official Account</p>
                  </div>
                </div>

                <div className="p-4 flex-1 overflow-auto">
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="p-4 whitespace-pre-wrap text-sm text-gray-800 break-words leading-relaxed">
                      {content || 'Chưa có nội dung...'}
                    </div>
                    {buttons.length > 0 && (
                      <div className="border-t border-gray-200 divide-y divide-gray-200">
                        {buttons.map((btn, idx) => (
                          <div key={idx} className="p-3 text-center text-blue-600 font-medium text-sm flex items-center justify-center gap-2">
                            {btn.type === 'web' ? <LinkIcon className="w-4 h-4" /> : <Phone className="w-4 h-4" />}
                            {btn.label || 'Chưa đặt tên'}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
