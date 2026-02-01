'use client';

// ==================== TEMPLATE EDITOR MODAL ====================
// Modal chỉnh sửa/tạo mới template với Rich Text Editor

import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  ArrowLeft,
  Eye,
  Save,
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  List,
  ListOrdered,
  Link,
  Image,
  Code,
  ChevronDown,
  Variable,
  Settings
} from 'lucide-react';
import { EmailTemplate, TemplateVariable } from './types';
import { TEMPLATE_VARIABLES, replaceVariablesWithSample } from './mockData';

interface TemplateEditorModalProps {
  open: boolean;
  onClose: () => void;
  mode: 'create' | 'edit' | 'clone';
  template: EmailTemplate | null;
  onSave: (data: { name: string; content_html: string }) => Promise<{ success: boolean; message: string }>;
}

export function TemplateEditorModal({
  open,
  onClose,
  mode,
  template,
  onSave
}: TemplateEditorModalProps) {
  const [name, setName] = useState('');
  const [content, setContent] = useState('');
  const [saving, setSaving] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [showVariableDropdown, setShowVariableDropdown] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);

  // Initialize form when modal opens
  useEffect(() => {
    if (open) {
      if (mode === 'create') {
        setName('');
        setContent(getDefaultTemplate());
      } else if (mode === 'clone' && template) {
        setName(`${template.name} - Bản sao`);
        setContent(template.content_html);
      } else if (mode === 'edit' && template) {
        setName(template.name);
        setContent(template.content_html);
      }
      setIsDirty(false);
      setLastSaved(null);
    }
  }, [open, mode, template]);

  // Auto-save every 30 seconds
  useEffect(() => {
    if (!open || !isDirty || !name.trim() || !content.trim()) return;

    const timer = setTimeout(async () => {
      setSaving(true);
      const result = await onSave({ name, content_html: content });
      setSaving(false);
      if (result.success) {
        setIsDirty(false);
        setLastSaved(new Date());
      }
    }, 30000);

    return () => clearTimeout(timer);
  }, [open, isDirty, name, content, onSave]);

  // Warn on unsaved changes when leaving page
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty && open) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty, open]);

  // Handle save
  const handleSave = async () => {
    if (!name.trim()) {
      alert('Vui lòng nhập tên mẫu email');
      return;
    }

    if (!content.trim()) {
      alert('Vui lòng nhập nội dung email');
      return;
    }

    setSaving(true);
    const result = await onSave({ name, content_html: content });
    setSaving(false);

    if (result.success) {
      setIsDirty(false);
      setLastSaved(new Date());
    }
  };

  // Handle close with unsaved changes warning
  const handleClose = () => {
    if (isDirty) {
      if (confirm('Bạn có thay đổi chưa lưu. Bạn có chắc muốn đóng?')) {
        onClose();
      }
    } else {
      onClose();
    }
  };

  // Insert variable at cursor
  const insertVariable = (variable: TemplateVariable) => {
    const tag = `{${variable.key}}`;
    setContent(prev => prev + tag);
    setIsDirty(true);
    setShowVariableDropdown(false);
  };

  // Insert system field
  const insertSystemField = (field: 'unsubscribe' | 'view_browser') => {
    const tags: Record<string, string> = {
      unsubscribe: '<a href="{link_huy_dang_ky}">Hủy đăng ký nhận email</a>',
      view_browser: '<a href="{link_xem_trinh_duyet}">Xem trong trình duyệt</a>'
    };
    setContent(prev => prev + '\n' + tags[field]);
    setIsDirty(true);
  };

  // Default template
  const getDefaultTemplate = () => {
    return `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
  <h1 style="color: #333;">Tiêu đề email</h1>
  <p>Xin chào {ten_khach},</p>
  <p>Nội dung email của bạn ở đây...</p>
  <p>Trân trọng,<br/>{ten_cong_ty}</p>
</div>`;
  };

  // Get modal title
  const getTitle = () => {
    switch (mode) {
      case 'create': return 'Tạo mẫu email mới';
      case 'edit': return 'Chỉnh sửa mẫu email';
      case 'clone': return 'Tạo bản sao mẫu email';
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Full screen editor */}
      <div className="h-screen flex flex-col bg-white">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-white shadow-sm">
          <div className="flex items-center gap-3">
            <button
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              onClick={handleClose}
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <span className="text-gray-400">|</span>
            <span className="font-medium text-gray-900">{getTitle()}</span>
            
            {lastSaved && (
              <span className="text-sm text-gray-500 ml-4">
                💾 Đã lưu lúc {lastSaved.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Preview toggle */}
            <button
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                showPreview 
                  ? 'bg-indigo-100 text-indigo-700' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
              onClick={() => setShowPreview(!showPreview)}
            >
              <Eye className="w-4 h-4" />
              Xem trước
            </button>

            {/* Save button */}
            <button
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleSave}
              disabled={saving || !isDirty}
            >
              <Save className="w-4 h-4" />
              {saving ? 'Đang lưu...' : 'Lưu mẫu'}
            </button>

            {/* Close button */}
            <button
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              onClick={handleClose}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Template Name */}
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tên mẫu email <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setIsDirty(true);
            }}
            placeholder="Nhập tên mẫu email..."
            className="w-full max-w-md px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
          />
        </div>

        {/* Toolbar */}
        <div className="flex items-center gap-2 px-4 py-2 border-b border-gray-200 bg-gray-50 flex-wrap">
          {/* Format buttons */}
          <div className="flex items-center gap-1 border-r border-gray-300 pr-2">
            <button className="p-2 text-gray-600 hover:bg-gray-200 rounded transition-colors" title="Đậm">
              <Bold className="w-4 h-4" />
            </button>
            <button className="p-2 text-gray-600 hover:bg-gray-200 rounded transition-colors" title="Nghiêng">
              <Italic className="w-4 h-4" />
            </button>
            <button className="p-2 text-gray-600 hover:bg-gray-200 rounded transition-colors" title="Gạch chân">
              <Underline className="w-4 h-4" />
            </button>
          </div>

          {/* Alignment buttons */}
          <div className="flex items-center gap-1 border-r border-gray-300 pr-2">
            <button className="p-2 text-gray-600 hover:bg-gray-200 rounded transition-colors" title="Căn trái">
              <AlignLeft className="w-4 h-4" />
            </button>
            <button className="p-2 text-gray-600 hover:bg-gray-200 rounded transition-colors" title="Căn giữa">
              <AlignCenter className="w-4 h-4" />
            </button>
            <button className="p-2 text-gray-600 hover:bg-gray-200 rounded transition-colors" title="Căn phải">
              <AlignRight className="w-4 h-4" />
            </button>
          </div>

          {/* List buttons */}
          <div className="flex items-center gap-1 border-r border-gray-300 pr-2">
            <button className="p-2 text-gray-600 hover:bg-gray-200 rounded transition-colors" title="Danh sách">
              <List className="w-4 h-4" />
            </button>
            <button className="p-2 text-gray-600 hover:bg-gray-200 rounded transition-colors" title="Danh sách số">
              <ListOrdered className="w-4 h-4" />
            </button>
          </div>

          {/* Insert buttons */}
          <div className="flex items-center gap-1 border-r border-gray-300 pr-2">
            <button className="p-2 text-gray-600 hover:bg-gray-200 rounded transition-colors" title="Chèn liên kết">
              <Link className="w-4 h-4" />
            </button>
            <button className="p-2 text-gray-600 hover:bg-gray-200 rounded transition-colors" title="Chèn hình ảnh">
              <Image className="w-4 h-4" />
            </button>
          </div>

          {/* Variable Dropdown */}
          <div className="relative">
            <button
              className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
              onClick={() => setShowVariableDropdown(!showVariableDropdown)}
            >
              <Variable className="w-4 h-4" />
              Cá nhân hóa
              <ChevronDown className="w-3 h-3" />
            </button>

            {showVariableDropdown && (
              <>
                <div 
                  className="fixed inset-0 z-10" 
                  onClick={() => setShowVariableDropdown(false)}
                />
                <div className="absolute left-0 top-full mt-1 w-72 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-20 max-h-80 overflow-auto">
                  {/* Customer Variables */}
                  <div className="px-3 py-1.5 text-xs font-semibold text-gray-500 uppercase">👤 Khách hàng</div>
                  {TEMPLATE_VARIABLES.filter(v => v.category === 'customer').map(v => (
                    <button
                      key={v.key}
                      className="w-full flex items-center justify-between px-3 py-2 text-sm hover:bg-gray-50"
                      onClick={() => insertVariable(v)}
                    >
                      <span>
                        <code className="text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded">{`{${v.key}}`}</code>
                        <span className="ml-2 text-gray-500">{v.label}</span>
                      </span>
                    </button>
                  ))}

                  <hr className="my-2 border-gray-100" />

                  {/* Order Variables */}
                  <div className="px-3 py-1.5 text-xs font-semibold text-gray-500 uppercase">📦 Đơn hàng</div>
                  {TEMPLATE_VARIABLES.filter(v => v.category === 'order').map(v => (
                    <button
                      key={v.key}
                      className="w-full flex items-center justify-between px-3 py-2 text-sm hover:bg-gray-50"
                      onClick={() => insertVariable(v)}
                    >
                      <span>
                        <code className="text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded">{`{${v.key}}`}</code>
                        <span className="ml-2 text-gray-500">{v.label}</span>
                      </span>
                    </button>
                  ))}

                  <hr className="my-2 border-gray-100" />

                  {/* System Variables */}
                  <div className="px-3 py-1.5 text-xs font-semibold text-gray-500 uppercase">⚙️ Hệ thống</div>
                  {TEMPLATE_VARIABLES.filter(v => v.category === 'system').map(v => (
                    <button
                      key={v.key}
                      className="w-full flex items-center justify-between px-3 py-2 text-sm hover:bg-gray-50"
                      onClick={() => insertVariable(v)}
                    >
                      <span>
                        <code className="text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded">{`{${v.key}}`}</code>
                        <span className="ml-2 text-gray-500">{v.label}</span>
                      </span>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* System Fields */}
          <div className="relative">
            <div className="flex items-center gap-1">
              <button
                className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
                onClick={() => insertSystemField('unsubscribe')}
                title="Chèn link hủy đăng ký"
              >
                <Settings className="w-4 h-4" />
                Hủy đăng ký
              </button>
            </div>
          </div>

          {/* HTML Code Mode */}
          <div className="ml-auto">
            <span className="flex items-center gap-2 px-3 py-1.5 text-xs text-gray-500 bg-gray-100 rounded-lg">
              <Code className="w-3 h-3" />
              Chế độ HTML
            </span>
          </div>
        </div>

        {/* Editor Body */}
        <div className="flex-1 flex overflow-hidden">
          {/* Editor */}
          <div className={`${showPreview ? 'w-1/2' : 'w-full'} flex flex-col border-r border-gray-200`}>
            <div className="flex-1 overflow-auto p-4">
              <textarea
                ref={editorRef as any}
                value={content}
                onChange={(e) => {
                  setContent(e.target.value);
                  setIsDirty(true);
                }}
                className="w-full h-full min-h-[400px] p-4 font-mono text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
                placeholder="Nhập nội dung HTML của email..."
              />
            </div>
          </div>

          {/* Preview Panel */}
          {showPreview && (
            <div className="w-1/2 bg-gray-100 overflow-auto p-6">
              <div className="bg-white shadow-lg rounded-lg max-w-[600px] mx-auto overflow-hidden">
                <div className="p-4 border-b border-gray-200 bg-gray-50">
                  <span className="text-xs text-gray-500">Xem trước với dữ liệu mẫu</span>
                </div>
                <div 
                  className="p-4"
                  dangerouslySetInnerHTML={{ __html: replaceVariablesWithSample(content) }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
