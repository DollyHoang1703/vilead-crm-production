'use client';

// ==================== TEMPLATE LIBRARY COMPONENT ====================
// Thư viện mẫu email - Tab Thư viện mẫu trong Email Marketing

import React from 'react';
import { 
  Search, 
  Folder, 
  User, 
  Inbox,
  FileCode,
  RefreshCw,
  Mail
} from 'lucide-react';
import { useTemplates } from './hooks';
import { TemplateCard, CreateNewTemplateCard } from './TemplateCard';
import { PreviewModal } from './PreviewModal';
import { TemplateEditorModal } from './TemplateEditorModal';
import { DeleteTemplateModal } from './DeleteTemplateModal';

export function TemplateLibrary() {
  const {
    templates,
    totalFiltered,
    loading,
    activeTab,
    searchQuery,
    selectedTemplate,
    modals,
    editorMode,
    pagination,
    setActiveTab,
    setSearchQuery,
    toggleModal,
    openPreview,
    openCreateEditor,
    openEditEditor,
    openCloneEditor,
    openDeleteConfirm,
    createTemplate,
    updateTemplate,
    cloneTemplate,
    deleteTemplate,
    restoreVersion,
    setPage
  } = useTemplates();

  // Handle save from editor
  const handleEditorSave = async (data: { name: string; content_html: string }) => {
    if (editorMode === 'create' || editorMode === 'clone') {
      return await createTemplate({
        name: data.name,
        content_html: data.content_html,
        editor_mode: 'richtext'
      });
    } else if (editorMode === 'edit' && selectedTemplate) {
      return await updateTemplate(selectedTemplate.id, {
        name: data.name,
        content_html: data.content_html
      });
    }
    return { success: false, message: 'Lỗi không xác định' };
  };

  // Handle use template (navigate to campaign creation with this template)
  const handleUseTemplate = (template: any) => {
    console.log('Use template:', template);
    // In real implementation, navigate to campaign creation with this template
    alert(`Sử dụng mẫu "${template.name}" cho chiến dịch mới`);
  };

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex items-center gap-4 border-b border-gray-200">
        <button
          className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'system'
              ? 'text-indigo-600 border-indigo-600'
              : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300'
          }`}
          onClick={() => setActiveTab('system')}
        >
          <Folder className="w-4 h-4" />
          Mẫu Email có sẵn
        </button>
        <button
          className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'notification'
              ? 'text-indigo-600 border-indigo-600'
              : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300'
          }`}
          onClick={() => setActiveTab('notification')}
        >
          <Mail className="w-4 h-4" />
          Mẫu email hệ thống
        </button>
        <button
          className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'user'
              ? 'text-indigo-600 border-indigo-600'
              : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300'
          }`}
          onClick={() => setActiveTab('user')}
        >
          <User className="w-4 h-4" />
          Mẫu Email của bạn
        </button>
      </div>

      {/* Search & Actions */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm kiếm theo tên mẫu..."
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
          />
        </div>

        {/* Actions */}
        {/* {activeTab === 'user' && (
          <div className="flex items-center gap-2">
            <button
              className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              onClick={() => toggleModal('importHtml', true)}
            >
              <FileCode className="w-4 h-4" />
              Import HTML
            </button>
          </div>
        )} */}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <RefreshCw className="w-8 h-8 text-indigo-600 animate-spin" />
        </div>
      )}

      {/* Template Grid */}
      {!loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {/* Create New Card - only in user tab */}
          {activeTab === 'user' && (
            <CreateNewTemplateCard onClick={openCreateEditor} />
          )}

          {/* Template Cards */}
          {templates.map(template => (
            <TemplateCard
              key={template.id}
              template={template}
              showEditActions={activeTab === 'user'}
              onPreview={openPreview}
              onClone={(t) => {
                cloneTemplate(t);
              }}
              onEdit={openEditEditor}
              onDelete={openDeleteConfirm}
            />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && templates.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Inbox className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {activeTab === 'user' 
              ? 'Bạn chưa có mẫu email nào' 
              : activeTab === 'notification'
                ? searchQuery ? 'Không tìm thấy mẫu' : 'Chưa có mẫu email hệ thống'
                : searchQuery 
                  ? 'Không tìm thấy mẫu' 
                  : 'Chưa có mẫu email có sẵn'
            }
          </h3>
          <p className="text-gray-500 mb-6 max-w-sm">
            {activeTab === 'user' 
              ? 'Tạo mẫu đầu tiên hoặc clone từ mẫu có sẵn' 
              : activeTab === 'notification'
                ? searchQuery ? 'Thử tìm với từ khóa khác' : 'Các mẫu email thông báo hệ thống (OTP, đổi mật khẩu, v.v.)'
                : searchQuery 
                  ? 'Thử tìm với từ khóa khác' 
                  : 'Hệ thống sẽ cập nhật mẫu có sẵn sớm'
            }
          </p>
          {activeTab === 'user' && (
            <button
              className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
              onClick={openCreateEditor}
            >
              + Tạo mẫu mới
            </button>
          )}
        </div>
      )}

      {/* Pagination */}
      {!loading && totalFiltered > 0 && (
        <div className="flex items-center justify-between text-sm text-gray-500 mt-6">
          <span>Hiển thị {templates.length} / {totalFiltered} mẫu</span>
          {pagination.total_pages > 1 && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage(pagination.page - 1)}
                disabled={pagination.page === 1}
                className="px-3 py-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Trước
              </button>
              <span className="px-3 py-1.5">
                Trang {pagination.page} / {pagination.total_pages}
              </span>
              <button
                onClick={() => setPage(pagination.page + 1)}
                disabled={pagination.page === pagination.total_pages}
                className="px-3 py-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Sau
              </button>
            </div>
          )}
        </div>
      )}

      {/* Modals */}
      <PreviewModal
        open={modals.preview}
        onClose={() => toggleModal('preview', false)}
        template={selectedTemplate}
        onClone={(t) => {
          cloneTemplate(t);
        }}
        onUseTemplate={handleUseTemplate}
        onRestoreVersion={restoreVersion}
      />

      <TemplateEditorModal
        open={modals.editor}
        onClose={() => toggleModal('editor', false)}
        mode={editorMode}
        template={selectedTemplate}
        onSave={handleEditorSave}
      />

      <DeleteTemplateModal
        open={modals.delete}
        onClose={() => toggleModal('delete', false)}
        template={selectedTemplate}
        onConfirm={deleteTemplate}
      />

      {/* Import HTML Modal - Simplified version */}
      {modals.importHtml && (
        <ImportHtmlModal
          open={modals.importHtml}
          onClose={() => toggleModal('importHtml', false)}
          onImport={async (html, name) => {
            const result = await (window as any).__templatesHook__?.importHtml?.(html, name);
            return result || { success: false, message: 'Lỗi' };
          }}
        />
      )}
    </div>
  );
}

// ==================== IMPORT HTML MODAL ====================
interface ImportHtmlModalProps {
  open: boolean;
  onClose: () => void;
  onImport: (html: string, name?: string) => Promise<{ success: boolean; message: string; warnings?: string[] }>;
}

function ImportHtmlModal({ open, onClose, onImport }: ImportHtmlModalProps) {
  const [mode, setMode] = React.useState<'paste' | 'upload'>('paste');
  const [html, setHtml] = React.useState('');
  const [name, setName] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [preview, setPreview] = React.useState<string | null>(null);
  const [warnings, setWarnings] = React.useState<string[]>([]);

  const handlePreview = () => {
    // Simple sanitization for preview
    let sanitized = html;
    const newWarnings: string[] = [];

    if (/<script/i.test(html)) {
      sanitized = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
      newWarnings.push('Đã loại bỏ script tags');
    }

    if (/\son\w+=/i.test(sanitized)) {
      sanitized = sanitized.replace(/\s(on\w+)="[^"]*"/gi, '');
      newWarnings.push('Đã loại bỏ event handlers');
    }

    setWarnings(newWarnings);
    setPreview(sanitized);
  };

  const handleImport = async () => {
    if (!html.trim()) {
      alert('Vui lòng nhập nội dung HTML');
      return;
    }

    setLoading(true);
    const result = await onImport(html, name || undefined);
    setLoading(false);

    if (result.success) {
      setHtml('');
      setName('');
      setPreview(null);
      onClose();
    } else {
      alert(result.message);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 500 * 1024) {
      alert('File không được vượt quá 500KB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setHtml(content);
      if (!name) {
        setName(file.name.replace('.html', ''));
      }
    };
    reader.readAsText(file);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="relative bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b">
            <h2 className="text-lg font-semibold">Import HTML</h2>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
              <span className="text-xl">&times;</span>
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-auto p-6 space-y-4">
            {/* Name input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tên mẫu
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nhập tên mẫu (tùy chọn)"
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Mode tabs */}
            <div className="flex gap-2">
              <button
                className={`px-4 py-2 text-sm font-medium rounded-lg ${
                  mode === 'paste' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600 hover:bg-gray-100'
                }`}
                onClick={() => setMode('paste')}
              >
                Dán code
              </button>
              <button
                className={`px-4 py-2 text-sm font-medium rounded-lg ${
                  mode === 'upload' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600 hover:bg-gray-100'
                }`}
                onClick={() => setMode('upload')}
              >
                Upload file
              </button>
            </div>

            {/* Content input */}
            {mode === 'paste' ? (
              <textarea
                value={html}
                onChange={(e) => {
                  setHtml(e.target.value);
                  setPreview(null);
                }}
                placeholder="Dán nội dung HTML vào đây..."
                className="w-full h-48 p-3 font-mono text-sm border rounded-lg focus:ring-2 focus:ring-indigo-500 resize-none"
              />
            ) : (
              <div className="border-2 border-dashed rounded-lg p-8 text-center">
                <input
                  type="file"
                  accept=".html,.htm"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="html-file-upload"
                />
                <label
                  htmlFor="html-file-upload"
                  className="cursor-pointer text-indigo-600 hover:text-indigo-700"
                >
                  Chọn file HTML (tối đa 500KB)
                </label>
                {html && (
                  <p className="mt-2 text-sm text-green-600">✓ Đã tải file</p>
                )}
              </div>
            )}

            {/* Warnings */}
            {warnings.length > 0 && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                <p className="text-sm font-medium text-amber-800 mb-1">⚠️ Cảnh báo:</p>
                <ul className="text-sm text-amber-700 list-disc list-inside">
                  {warnings.map((w, i) => (
                    <li key={i}>{w}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Preview */}
            {preview && (
              <div className="border rounded-lg overflow-hidden">
                <div className="bg-gray-50 px-3 py-2 border-b text-sm text-gray-600">
                  Xem trước
                </div>
                <div
                  className="p-4 max-h-60 overflow-auto"
                  dangerouslySetInnerHTML={{ __html: preview }}
                />
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t bg-gray-50">
            <button
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg font-medium"
              onClick={onClose}
            >
              Hủy
            </button>
            <button
              className="px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg font-medium"
              onClick={handlePreview}
              disabled={!html.trim()}
            >
              Xem trước
            </button>
            <button
              className="px-4 py-2 bg-indigo-600 text-white hover:bg-indigo-700 rounded-lg font-medium disabled:opacity-50"
              onClick={handleImport}
              disabled={loading || !html.trim()}
            >
              {loading ? 'Đang import...' : 'Import và lưu'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
