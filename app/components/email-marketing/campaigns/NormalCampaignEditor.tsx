'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  ArrowLeft,
  Check,
  Circle,
  ChevronRight,
  Mail,
  Eye,
  User,
  Users,
  FileText,
  Paperclip,
  Send,
  Save,
  Clock,
  AlertCircle
} from 'lucide-react';
import { Campaign, CampaignFormData, CampaignChecklist, EmailTemplate, SenderEmail, RecipientFilter, RecipientsPreview, Attachment, SendType, BatchSchedule } from '../types';
import { useCampaignEditor } from '../hooks';
import { MOCK_SENDER_EMAILS, MOCK_TEMPLATES, getSenderEmailById } from '../mockData';
import { SubjectModal } from './SubjectModal';
import { RecipientsModal } from './RecipientsModal';
import { ContentModal } from './ContentModal';
import { AttachmentsModal } from './AttachmentsModal';
import { ConfirmStartModal } from './ConfirmStartModal';

interface NormalCampaignEditorProps {
  campaign?: Campaign | null;
  mode: 'create' | 'edit';
  onSave: (data: Partial<CampaignFormData>) => Promise<{ success: boolean; message: string }>;
  onStart: (id: string, sendType: SendType, scheduledAt?: Date | null, batches?: BatchSchedule[]) => Promise<{ success: boolean; message: string }>;
  onClose: () => void;
}

// Checklist item component
interface ChecklistItemProps {
  title: string;
  description: string;
  isComplete: boolean;
  isRequired: boolean;
  icon: React.ReactNode;
  value?: string;
  onClick: () => void;
}

function ChecklistItem({ title, description, isComplete, isRequired, icon, value, onClick }: ChecklistItemProps) {
  return (
    <button
      onClick={onClick}
      className={`
        w-full flex items-center gap-4 p-4 rounded-lg border-2 text-left transition-all
        ${isComplete 
          ? 'border-green-200 bg-green-50 hover:bg-green-100' 
          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
        }
      `}
    >
      {/* Status indicator */}
      <div className={`
        flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center
        ${isComplete ? 'bg-green-500' : 'bg-gray-100'}
      `}>
        {isComplete ? (
          <Check className="w-5 h-5 text-white" />
        ) : (
          <span className={`${isComplete ? 'text-white' : 'text-gray-400'}`}>{icon}</span>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-medium text-gray-900">{title}</span>
          {isRequired && !isComplete && (
            <span className="text-xs text-red-500">*Bắt buộc</span>
          )}
        </div>
        {value ? (
          <p className="text-sm text-gray-700 truncate">{value}</p>
        ) : (
          <p className="text-sm text-gray-500">{description}</p>
        )}
      </div>

      {/* Arrow */}
      <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
    </button>
  );
}

export function NormalCampaignEditor({ campaign, mode, onSave, onStart, onClose }: NormalCampaignEditorProps) {
  const {
    formData,
    recipientsPreview,
    checklist,
    isComplete,
    completedCount,
    isDirty,
    activeModal,
    updateField,
    updateRecipientFilter,
    previewRecipients,
    addAttachment,
    removeAttachment,
    openModal,
    closeModal,
    markSaved,
    setFormData
  } = useCampaignEditor(campaign);

  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [showConfirmStart, setShowConfirmStart] = useState(false);

  // Initialize form with campaign data
  useEffect(() => {
    if (campaign) {
      setFormData({
        name: campaign.name,
        subject: campaign.subject,
        preview_text: campaign.preview_text || '',
        sender_email_id: campaign.sender_email_id,
        template_id: campaign.template_id,
        recipient_filter: campaign.recipient_filter,
        attachments: campaign.attachments,
        send_type: campaign.send_type,
        scheduled_at: campaign.scheduled_at,
        batches: campaign.batches || []
      });
    }
  }, [campaign, setFormData]);

  // Auto-preview recipients on mount
  useEffect(() => {
    previewRecipients();
  }, []);

  // Get selected sender email info
  const selectedSender = formData.sender_email_id 
    ? getSenderEmailById(formData.sender_email_id) 
    : null;

  // Get selected template info
  const selectedTemplate = formData.template_id
    ? MOCK_TEMPLATES.find(t => t.id === formData.template_id)
    : null;

  // Handle save
  const handleSave = async () => {
    setIsSaving(true);
    setSaveMessage(null);
    
    const result = await onSave(formData);
    
    if (result.success) {
      markSaved();
      setSaveMessage('Đã lưu thành công');
      setTimeout(() => setSaveMessage(null), 3000);
    } else {
      setSaveMessage(result.message);
    }
    
    setIsSaving(false);
  };

  // Handle start
  const handleStart = async (sendType: SendType, scheduledAt?: Date | null, batches?: BatchSchedule[]) => {
    if (!campaign?.id && mode === 'edit') return;
    
    // For new campaign, save first
    if (mode === 'create') {
      const saveResult = await onSave(formData);
      if (!saveResult.success) {
        setSaveMessage(saveResult.message);
        return;
      }
    }
    
    const startResult = await onStart(campaign?.id || '', sendType, scheduledAt, batches);
    if (startResult.success) {
      onClose();
    } else {
      setSaveMessage(startResult.message);
    }
  };

  // Handle sender selection
  const handleSenderSelect = (senderId: string) => {
    updateField('sender_email_id', senderId);
    closeModal();
  };

  // Handle template selection
  const handleTemplateSelect = (templateId: string) => {
    updateField('template_id', templateId);
    closeModal();
  };

  // Handle recipient filter save
  const handleRecipientsSave = async (filter: RecipientFilter) => {
    updateField('recipient_filter', filter);
    await previewRecipients();
    closeModal();
  };

  // Handle subject save
  const handleSubjectSave = (subject: string, previewText: string) => {
    updateField('subject', subject);
    updateField('preview_text', previewText);
    closeModal();
  };

  const requiredCount = 4; // subject, sender, recipients, content

  return (
    <div className="fixed inset-0 z-50 bg-gray-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => updateField('name', e.target.value)}
                placeholder="Tên chiến dịch..."
                className="text-lg font-semibold text-gray-900 bg-transparent border-none focus:outline-none focus:ring-0 w-full"
              />
              <p className="text-sm text-gray-500">
                {mode === 'create' ? 'Chiến dịch mới' : 'Chỉnh sửa chiến dịch'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Save status */}
            {saveMessage && (
              <span className={`text-sm ${saveMessage.includes('thành công') ? 'text-green-600' : 'text-red-600'}`}>
                {saveMessage}
              </span>
            )}
            
            {/* Save button */}
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              {isSaving ? (
                <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
              ) : (
                <Save className="w-4 h-4 text-gray-600" />
              )}
              Lưu nháp
            </button>

            {/* Start button */}
            <button
              onClick={() => setShowConfirmStart(true)}
              disabled={!isComplete}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4" />
              Bắt đầu gửi
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto py-8 px-6">
        {/* Progress indicator */}
        <div className="bg-white rounded-xl p-6 mb-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Tiến độ hoàn thành</h3>
            <span className="text-sm text-gray-500">{completedCount}/{requiredCount} mục bắt buộc</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(completedCount / requiredCount) * 100}%` }}
            />
          </div>
          {!isComplete && (
            <p className="text-sm text-gray-500 mt-2">
              Hoàn thành tất cả mục bắt buộc để bắt đầu gửi chiến dịch
            </p>
          )}
        </div>

        {/* Checklist */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900">Thiết lập chiến dịch</h3>
            <p className="text-sm text-gray-500">Hoàn thành các mục sau để gửi email</p>
          </div>

          <div className="p-6 space-y-3">
            {/* 1. Subject */}
            <ChecklistItem
              title="Tiêu đề email"
              description="Nhập tiêu đề và preheader cho email"
              isComplete={checklist.subject}
              isRequired={true}
              icon={<Mail className="w-5 h-5" />}
              value={formData.subject || undefined}
              onClick={() => openModal('subject')}
            />

            {/* 2. Sender */}
            <ChecklistItem
              title="Người gửi"
              description="Chọn email người gửi"
              isComplete={checklist.sender}
              isRequired={true}
              icon={<User className="w-5 h-5" />}
              value={selectedSender ? `${selectedSender.sender_name} <${selectedSender.email}>` : undefined}
              onClick={() => openModal('sender')}
            />

            {/* 3. Recipients */}
            <ChecklistItem
              title="Người nhận"
              description="Chọn đối tượng nhận email"
              isComplete={checklist.recipients}
              isRequired={true}
              icon={<Users className="w-5 h-5" />}
              value={recipientsPreview ? `${recipientsPreview.valid_emails.toLocaleString()} người nhận hợp lệ` : undefined}
              onClick={() => openModal('recipients')}
            />

            {/* 4. Content */}
            <ChecklistItem
              title="Nội dung email"
              description="Chọn mẫu email để gửi"
              isComplete={checklist.content}
              isRequired={true}
              icon={<FileText className="w-5 h-5" />}
              value={selectedTemplate?.name || undefined}
              onClick={() => openModal('content')}
            />

            {/* 5. Attachments (optional) */}
            <ChecklistItem
              title="File đính kèm"
              description="Thêm file đính kèm (tùy chọn)"
              isComplete={formData.attachments.length > 0}
              isRequired={false}
              icon={<Paperclip className="w-5 h-5" />}
              value={formData.attachments.length > 0 ? `${formData.attachments.length} file đính kèm` : undefined}
              onClick={() => openModal('attachments')}
            />
          </div>
        </div>

        {/* Warning if not complete */}
        {!isComplete && (
          <div className="mt-6 flex items-start gap-3 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
            <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-yellow-800">Chiến dịch chưa hoàn thành</p>
              <p className="text-sm text-yellow-700 mt-1">
                Vui lòng hoàn thành tất cả các mục bắt buộc trước khi bắt đầu gửi.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Subject Modal */}
      {activeModal === 'subject' && (
        <SubjectModal
          subject={formData.subject}
          previewText={formData.preview_text}
          onSave={handleSubjectSave}
          onClose={closeModal}
        />
      )}

      {/* Sender Modal */}
      {activeModal === 'sender' && (
        <SenderSelectModal
          selectedId={formData.sender_email_id}
          onSelect={handleSenderSelect}
          onClose={closeModal}
        />
      )}

      {/* Recipients Modal */}
      {activeModal === 'recipients' && (
        <RecipientsModal
          filter={formData.recipient_filter}
          preview={recipientsPreview}
          onSave={handleRecipientsSave}
          onPreview={previewRecipients}
          onClose={closeModal}
        />
      )}

      {/* Content Modal */}
      {activeModal === 'content' && (
        <ContentModal
          selectedId={formData.template_id}
          onSelect={handleTemplateSelect}
          onPreview={() => {}}
          onClose={closeModal}
        />
      )}

      {/* Attachments Modal */}
      {activeModal === 'attachments' && (
        <AttachmentsModal
          attachments={formData.attachments}
          onAdd={addAttachment}
          onRemove={removeAttachment}
          onClose={closeModal}
        />
      )}

      {/* Confirm Start Modal */}
      {showConfirmStart && (
        <ConfirmStartModal
          campaignName={formData.name}
          subject={formData.subject}
          recipientCount={recipientsPreview?.valid_emails || 0}
          onStart={handleStart}
          onClose={() => setShowConfirmStart(false)}
        />
      )}
    </div>
  );
}

// Sender Select Modal (inline component)
interface SenderSelectModalProps {
  selectedId: string | null;
  onSelect: (id: string) => void;
  onClose: () => void;
}

function SenderSelectModal({ selectedId, onSelect, onClose }: SenderSelectModalProps) {
  const activeSenders = MOCK_SENDER_EMAILS.filter(s => s.status === 'activated');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-xl w-full max-w-lg mx-4 max-h-[80vh] flex flex-col">
        <div className="flex-shrink-0 border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Chọn người gửi</h3>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-gray-100">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {activeSenders.length === 0 ? (
            <div className="text-center py-8">
              <Mail className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">Chưa có email đã kích hoạt</p>
              <p className="text-sm text-gray-400">Vui lòng thêm và xác thực email trong phần Cấu hình</p>
            </div>
          ) : (
            activeSenders.map(sender => (
              <button
                key={sender.id}
                onClick={() => onSelect(sender.id)}
                className={`
                  w-full flex items-center gap-3 p-4 rounded-lg border-2 text-left transition-all
                  ${selectedId === sender.id 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-gray-300'
                  }
                `}
              >
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <Mail className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900">{sender.sender_name}</p>
                  <p className="text-sm text-gray-500 truncate">{sender.email}</p>
                </div>
                {selectedId === sender.id && (
                  <Check className="w-5 h-5 text-blue-600" />
                )}
              </button>
            ))
          )}
        </div>

        <div className="flex-shrink-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
