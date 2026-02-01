'use client';

import React, { useEffect } from 'react';
import { 
  ArrowLeft, 
  Save, 
  ChevronRight, 
  ChevronLeft,
  Check,
  Mail,
  Users,
  FileText,
  Settings,
  Play
} from 'lucide-react';
import { useABCampaignEditor } from '../hooks';
import { Campaign, ABTestType } from '../types';
import { AB_TEST_TYPE_LABELS, MOCK_SENDER_EMAILS, MOCK_TEMPLATES } from '../mockData';
import { SenderModal } from './SenderModal';
import { RecipientsModal } from './RecipientsModal';
import { ContentModal } from './ContentModal';

// Step Indicator Component
function StepIndicator({ 
  currentStep, 
  steps 
}: { 
  currentStep: string;
  steps: { id: string; label: string; completed: boolean }[];
}) {
  return (
    <div className="flex items-center justify-center gap-2 py-4 bg-gray-50 border-b">
      {steps.map((step, index) => {
        const isActive = step.id === currentStep;
        const isPast = steps.findIndex(s => s.id === currentStep) > index;
        
        return (
          <React.Fragment key={step.id}>
            <div className="flex items-center gap-2">
              <div className={`
                w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors
                ${isActive ? 'bg-blue-600 text-white' : ''}
                ${isPast || step.completed ? 'bg-green-500 text-white' : ''}
                ${!isActive && !isPast && !step.completed ? 'bg-gray-200 text-gray-600' : ''}
              `}>
                {isPast || step.completed ? <Check className="w-4 h-4" /> : index + 1}
              </div>
              <span className={`text-sm font-medium ${isActive ? 'text-blue-600' : 'text-gray-600'}`}>
                {step.label}
              </span>
            </div>
            {index < steps.length - 1 && (
              <ChevronRight className="w-4 h-4 text-gray-400 mx-2" />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

// A/B Test Type Card
function ABTestTypeCard({
  type,
  selected,
  onSelect
}: {
  type: ABTestType;
  selected: boolean;
  onSelect: () => void;
}) {
  const config = AB_TEST_TYPE_LABELS[type];
  
  return (
    <button
      onClick={onSelect}
      className={`
        flex-1 p-4 rounded-xl border-2 transition-all text-left
        ${selected 
          ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200' 
          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
        }
      `}
    >
      <div className="text-2xl mb-2">{config.icon}</div>
      <h4 className="font-medium text-gray-900">{config.label}</h4>
      <p className="text-sm text-gray-500 mt-1">{config.description}</p>
      {selected && (
        <div className="mt-2">
          <Check className="w-5 h-5 text-blue-600" />
        </div>
      )}
    </button>
  );
}

// Checklist Item Component
function ChecklistItem({
  label,
  completed,
  required,
  value,
  onClick
}: {
  label: string;
  completed: boolean;
  required: boolean;
  value?: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`
        w-full flex items-center gap-3 p-4 rounded-lg border transition-colors text-left
        ${completed 
          ? 'border-green-200 bg-green-50 hover:bg-green-100' 
          : 'border-gray-200 hover:bg-gray-50'
        }
      `}
    >
      <div className={`
        w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0
        ${completed ? 'bg-green-500' : 'bg-gray-200'}
      `}>
        {completed ? (
          <Check className="w-4 h-4 text-white" />
        ) : (
          <div className="w-2 h-2 bg-gray-400 rounded-full" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-gray-900">
          {label} {required && <span className="text-red-500">*</span>}
        </p>
        {value && (
          <p className="text-sm text-gray-500 truncate">{value}</p>
        )}
      </div>
      <ChevronRight className="w-5 h-5 text-gray-400" />
    </button>
  );
}

// A/B Ratio Visualization
function ABRatioVisualization({
  ratioA,
  ratioB,
  countA,
  countB,
  countWinner
}: {
  ratioA: number;
  ratioB: number;
  countA: number;
  countB: number;
  countWinner: number;
}) {
  const winnerRatio = 100 - ratioA - ratioB;
  
  return (
    <div className="space-y-2">
      <div className="flex h-8 rounded-lg overflow-hidden">
        <div 
          className="bg-red-500 flex items-center justify-center text-white text-xs font-medium"
          style={{ width: `${ratioA}%` }}
        >
          A {ratioA}%
        </div>
        <div 
          className="bg-blue-500 flex items-center justify-center text-white text-xs font-medium"
          style={{ width: `${ratioB}%` }}
        >
          B {ratioB}%
        </div>
        <div 
          className="bg-green-500 flex items-center justify-center text-white text-xs font-medium"
          style={{ width: `${winnerRatio}%` }}
        >
          Winner {winnerRatio}%
        </div>
      </div>
      <div className="flex text-xs text-gray-500">
        <div style={{ width: `${ratioA}%` }} className="text-center">
          {countA} email
        </div>
        <div style={{ width: `${ratioB}%` }} className="text-center">
          {countB} email
        </div>
        <div style={{ width: `${winnerRatio}%` }} className="text-center">
          {countWinner} email
        </div>
      </div>
    </div>
  );
}

interface ABCampaignEditorProps {
  campaign?: Campaign | null;
  onClose: () => void;
  onSave: (campaign: Campaign) => void;
  onStart: (campaign: Campaign) => void;
}

export function ABCampaignEditor({ campaign, onClose, onSave, onStart }: ABCampaignEditorProps) {
  const {
    currentStep,
    formData,
    recipientsPreview,
    checklist,
    isStep1Complete,
    isStep2Complete,
    canStart,
    recipientCounts,
    confirmChecked,
    activeModal,
    updateField,
    updateRecipientFilter,
    previewRecipients,
    nextStep,
    prevStep,
    openModal,
    closeModal,
    setConfirmChecked
  } = useABCampaignEditor(campaign);

  // Load recipients preview on mount
  useEffect(() => {
    previewRecipients();
  }, []);

  const selectedSender = MOCK_SENDER_EMAILS.find(s => s.id === formData.sender_email_id);
  const selectedTemplate = MOCK_TEMPLATES.find(t => t.id === formData.template_id);
  const selectedTemplateB = MOCK_TEMPLATES.find(t => t.id === formData.template_b_id);

  const steps = [
    { id: 'basic', label: 'Thông tin cơ bản', completed: isStep1Complete },
    { id: 'ab_config', label: 'Cấu hình A/B', completed: isStep2Complete },
    { id: 'confirm', label: 'Xác nhận', completed: canStart }
  ];

  const renderStep1 = () => (
    <div className="p-6 space-y-6 max-w-3xl mx-auto">
      {/* Campaign Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Tên chiến dịch
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => updateField('name', e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="VD: [A/B] Test tiêu đề - Sale cuối năm"
        />
      </div>

      {/* A/B Test Type Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Chọn loại A/B Testing
        </label>
        <div className="grid grid-cols-3 gap-4">
          {(['subject', 'content', 'send_time'] as ABTestType[]).map(type => (
            <ABTestTypeCard
              key={type}
              type={type}
              selected={formData.ab_test_type === type}
              onSelect={() => updateField('ab_test_type', type)}
            />
          ))}
        </div>
        <p className="mt-2 text-sm text-gray-500 flex items-center gap-1">
          💡 Chỉ thay đổi 1 yếu tố mỗi lần để đo lường chính xác
        </p>
      </div>

      {/* Common Settings Checklist */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Thông tin chung
        </label>
        <div className="space-y-2">
          <ChecklistItem
            label="Người gửi"
            completed={checklist.sender}
            required={true}
            value={selectedSender ? `${selectedSender.sender_name} <${selectedSender.email}>` : undefined}
            onClick={() => openModal('sender')}
          />
          <ChecklistItem
            label="Người nhận (tối thiểu 100)"
            completed={checklist.recipients}
            required={true}
            value={recipientsPreview ? `${recipientsPreview.valid_emails} email hợp lệ` : undefined}
            onClick={() => openModal('recipients')}
          />
          {formData.ab_test_type !== 'content' && (
            <ChecklistItem
              label="Nội dung email"
              completed={checklist.content}
              required={true}
              value={selectedTemplate?.name}
              onClick={() => openModal('content')}
            />
          )}
          {formData.ab_test_type !== 'subject' && formData.ab_test_type !== 'send_time' && (
            <>
              <ChecklistItem
                label="Tiêu đề email"
                completed={!!formData.subject}
                required={true}
                value={formData.subject || undefined}
                onClick={() => {
                  const subject = prompt('Nhập tiêu đề email:', formData.subject);
                  if (subject !== null) updateField('subject', subject);
                }}
              />
            </>
          )}
        </div>
      </div>

      {/* Warning if not enough recipients */}
      {recipientsPreview && recipientsPreview.valid_emails < 100 && (
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            ⚠️ Cần tối thiểu 100 người nhận cho A/B testing. Hiện tại chỉ có {recipientsPreview.valid_emails} email hợp lệ.
          </p>
        </div>
      )}
    </div>
  );

  const renderStep2 = () => (
    <div className="p-6 space-y-6 max-w-3xl mx-auto">
      {/* Version A/B Inputs */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Nhập 2 phiên bản {AB_TEST_TYPE_LABELS[formData.ab_test_type || 'subject'].label}
        </label>
        <div className="grid grid-cols-2 gap-4">
          {/* Version A */}
          <div className="p-4 rounded-lg border-2 border-red-200 bg-red-50">
            <div className="flex items-center gap-2 mb-3">
              <span className="px-2 py-1 bg-red-500 text-white text-xs font-bold rounded">A</span>
              <span className="font-medium text-gray-900">Phiên bản A</span>
            </div>
            {formData.ab_test_type === 'subject' && (
              <input
                type="text"
                value={formData.subject}
                onChange={(e) => updateField('subject', e.target.value)}
                className="w-full px-3 py-2 border border-red-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="VD: Sale cuối năm - Giảm giá sốc!"
              />
            )}
            {formData.ab_test_type === 'content' && (
              <button
                onClick={() => openModal('content')}
                className="w-full px-3 py-2 border border-red-300 rounded-lg text-left hover:bg-red-100"
              >
                {selectedTemplate?.name || 'Chọn mẫu nội dung A...'}
              </button>
            )}
            {formData.ab_test_type === 'send_time' && (
              <input
                type="datetime-local"
                value={formData.ab_send_time_a ? new Date(formData.ab_send_time_a).toISOString().slice(0, 16) : ''}
                onChange={(e) => updateField('ab_send_time_a', e.target.value ? new Date(e.target.value) : null)}
                className="w-full px-3 py-2 border border-red-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            )}
          </div>

          {/* Version B */}
          <div className="p-4 rounded-lg border-2 border-blue-200 bg-blue-50">
            <div className="flex items-center gap-2 mb-3">
              <span className="px-2 py-1 bg-blue-500 text-white text-xs font-bold rounded">B</span>
              <span className="font-medium text-gray-900">Phiên bản B</span>
            </div>
            {formData.ab_test_type === 'subject' && (
              <input
                type="text"
                value={formData.subject_b || ''}
                onChange={(e) => updateField('subject_b', e.target.value)}
                className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="VD: {ten_khach} ơi, đừng bỏ lỡ Sale!"
              />
            )}
            {formData.ab_test_type === 'content' && (
              <button
                onClick={() => openModal('content_b')}
                className="w-full px-3 py-2 border border-blue-300 rounded-lg text-left hover:bg-blue-100"
              >
                {selectedTemplateB?.name || 'Chọn mẫu nội dung B...'}
              </button>
            )}
            {formData.ab_test_type === 'send_time' && (
              <input
                type="datetime-local"
                value={formData.ab_send_time_b ? new Date(formData.ab_send_time_b).toISOString().slice(0, 16) : ''}
                onChange={(e) => updateField('ab_send_time_b', e.target.value ? new Date(e.target.value) : null)}
                className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            )}
          </div>
        </div>
      </div>

      {/* Ratio Configuration */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Tùy chỉnh tỷ lệ gửi mail
        </label>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="text-sm text-gray-600">Tỷ lệ phiên bản A (%)</label>
            <input
              type="number"
              min={5}
              max={45}
              value={formData.ab_ratio_a}
              onChange={(e) => updateField('ab_ratio_a', Math.min(45, Math.max(5, parseInt(e.target.value) || 5)))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="text-sm text-gray-600">Tỷ lệ phiên bản B (%)</label>
            <input
              type="number"
              min={5}
              max={45}
              value={formData.ab_ratio_b}
              onChange={(e) => updateField('ab_ratio_b', Math.min(45, Math.max(5, parseInt(e.target.value) || 5)))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        
        <ABRatioVisualization
          ratioA={formData.ab_ratio_a}
          ratioB={formData.ab_ratio_b}
          countA={recipientCounts.a}
          countB={recipientCounts.b}
          countWinner={recipientCounts.winner}
        />
        
        {formData.ab_ratio_a + formData.ab_ratio_b > 50 && (
          <p className="mt-2 text-sm text-red-600">
            ⚠️ Tổng tỷ lệ A và B không được quá 50%
          </p>
        )}
      </div>

      {/* Evaluation Settings */}
      <div className="space-y-4">
        <label className="block text-sm font-medium text-gray-700">
          Cài đặt đánh giá phiên bản thắng
        </label>
        
        <div>
          <label className="text-sm text-gray-600">Thời gian đánh giá (giờ)</label>
          <input
            type="number"
            min={1}
            max={168}
            value={formData.ab_evaluation_hours}
            onChange={(e) => updateField('ab_evaluation_hours', Math.min(168, Math.max(1, parseInt(e.target.value) || 24)))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="mt-1 text-xs text-gray-500">
            💡 Nên chờ ít nhất 24 giờ để có đủ dữ liệu
          </p>
        </div>

        <div>
          <label className="text-sm text-gray-600 block mb-2">Tiêu chí đánh giá</label>
          <div className="space-y-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="criteria"
                checked={formData.ab_winning_criteria === 'open'}
                onChange={() => updateField('ab_winning_criteria', 'open')}
                className="w-4 h-4 text-blue-600"
              />
              <span className="text-gray-700">Số lượng mở mail (Open rate)</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="criteria"
                checked={formData.ab_winning_criteria === 'click'}
                onChange={() => updateField('ab_winning_criteria', 'click')}
                className="w-4 h-4 text-blue-600"
              />
              <span className="text-gray-700">Số lượng click link (Click rate)</span>
            </label>
          </div>
        </div>

        <div>
          <label className="text-sm text-gray-600 block mb-2">Tự động gửi phần còn lại</label>
          <div className="space-y-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="autoSend"
                checked={formData.ab_auto_send_winner === true}
                onChange={() => updateField('ab_auto_send_winner', true)}
                className="w-4 h-4 text-blue-600"
              />
              <span className="text-gray-700">Có, tự động gửi ngay khi tìm ra phiên bản thắng</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="autoSend"
                checked={formData.ab_auto_send_winner === false}
                onChange={() => updateField('ab_auto_send_winner', false)}
                className="w-4 h-4 text-blue-600"
              />
              <span className="text-gray-700">Không, tôi sẽ chủ động gửi sau</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="p-6 space-y-6 max-w-3xl mx-auto">
      {/* Summary */}
      <div className="p-6 bg-gray-50 rounded-xl border">
        <h3 className="font-semibold text-gray-900 mb-4">Tóm tắt chiến dịch</h3>
        
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Loại test:</span>
            <span className="font-medium">{AB_TEST_TYPE_LABELS[formData.ab_test_type || 'subject'].label}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Người gửi:</span>
            <span className="font-medium">{selectedSender?.email}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Người nhận:</span>
            <span className="font-medium">{recipientCounts.total} email</span>
          </div>
          
          <div className="border-t pt-3 mt-3">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2 py-0.5 bg-red-500 text-white text-xs font-bold rounded">A</span>
              <span className="text-gray-600">({formData.ab_ratio_a}% - {recipientCounts.a} email):</span>
            </div>
            <p className="font-medium text-gray-900 pl-6">
              {formData.ab_test_type === 'subject' && `"${formData.subject}"`}
              {formData.ab_test_type === 'content' && selectedTemplate?.name}
              {formData.ab_test_type === 'send_time' && formData.ab_send_time_a?.toLocaleString('vi-VN')}
            </p>
          </div>
          
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2 py-0.5 bg-blue-500 text-white text-xs font-bold rounded">B</span>
              <span className="text-gray-600">({formData.ab_ratio_b}% - {recipientCounts.b} email):</span>
            </div>
            <p className="font-medium text-gray-900 pl-6">
              {formData.ab_test_type === 'subject' && `"${formData.subject_b}"`}
              {formData.ab_test_type === 'content' && selectedTemplateB?.name}
              {formData.ab_test_type === 'send_time' && formData.ab_send_time_b?.toLocaleString('vi-VN')}
            </p>
          </div>
          
          <div className="border-t pt-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Phần còn lại:</span>
              <span className="font-medium">{100 - formData.ab_ratio_a - formData.ab_ratio_b}% - {recipientCounts.winner} email</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Thời gian đánh giá:</span>
              <span className="font-medium">{formData.ab_evaluation_hours} giờ</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Tiêu chí:</span>
              <span className="font-medium">{formData.ab_winning_criteria === 'open' ? 'Số lượng mở mail' : 'Số lượng click'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Tự động gửi:</span>
              <span className="font-medium">{formData.ab_auto_send_winner ? 'Có' : 'Không'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Notice */}
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-800">
          ℹ️ Sau khi bắt đầu, phiên bản A và B sẽ được gửi đồng thời.
          Sau <strong>{formData.ab_evaluation_hours} giờ</strong>, hệ thống sẽ xác định phiên bản thắng
          {formData.ab_auto_send_winner 
            ? ' và tự động gửi phần còn lại.' 
            : '. Bạn sẽ cần quyết định gửi phiên bản nào cho phần còn lại.'
          }
        </p>
      </div>

      {/* Confirm Checkbox */}
      <label className="flex items-start gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={confirmChecked}
          onChange={(e) => setConfirmChecked(e.target.checked)}
          className="w-5 h-5 mt-0.5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
        />
        <span className="text-gray-700">
          Tôi đã kiểm tra và xác nhận thông tin chính xác
        </span>
      </label>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col">
      {/* Header */}
      <div className="flex-shrink-0 border-b bg-white px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-lg font-semibold text-gray-900">
              {campaign ? 'Chỉnh sửa chiến dịch A/B' : 'Tạo chiến dịch A/B Testing'}
            </h1>
            <span className="inline-flex items-center px-2 py-0.5 bg-purple-100 text-purple-700 text-xs font-medium rounded-full">
              A/B Testing
            </span>
          </div>
        </div>
        <button
          onClick={() => {/* Save draft */}}
          className="flex items-center gap-2 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          <Save className="w-4 h-4" />
          Lưu nháp
        </button>
      </div>

      {/* Step Indicator */}
      <StepIndicator currentStep={currentStep} steps={steps} />

      {/* Content */}
      <div className="flex-1 overflow-y-auto bg-white">
        {currentStep === 'basic' && renderStep1()}
        {currentStep === 'ab_config' && renderStep2()}
        {currentStep === 'confirm' && renderStep3()}
      </div>

      {/* Footer Navigation */}
      <div className="flex-shrink-0 border-t bg-white px-6 py-4 flex justify-between">
        <button
          onClick={currentStep === 'basic' ? onClose : prevStep}
          className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
        >
          <ChevronLeft className="w-4 h-4" />
          {currentStep === 'basic' ? 'Hủy' : 'Quay lại'}
        </button>
        
        {currentStep !== 'confirm' ? (
          <button
            onClick={nextStep}
            disabled={currentStep === 'basic' ? !isStep1Complete : !isStep2Complete}
            className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Tiếp tục
            <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={() => {
              // Create campaign object and start
              const newCampaign: Campaign = {
                id: `camp-ab-${Date.now()}`,
                name: formData.name,
                type: 'ab',
                status: 'running',
                subject: formData.subject,
                preview_text: formData.preview_text,
                sender_email_id: formData.sender_email_id!,
                template_id: formData.template_id!,
                attachments: formData.attachments,
                recipient_filter: formData.recipient_filter,
                recipient_count: recipientCounts.total,
                valid_email_count: recipientCounts.total,
                send_type: formData.send_type,
                scheduled_at: formData.scheduled_at,
                batches: null,
                ab_config: {
                  test_type: formData.ab_test_type!,
                  version_a: formData.ab_test_type === 'subject' 
                    ? { subject: formData.subject }
                    : formData.ab_test_type === 'content'
                    ? { template_id: formData.template_id! }
                    : { send_at: formData.ab_send_time_a! },
                  version_b: formData.ab_test_type === 'subject'
                    ? { subject: formData.subject_b! }
                    : formData.ab_test_type === 'content'
                    ? { template_id: formData.template_b_id! }
                    : { send_at: formData.ab_send_time_b! },
                  ratio_a: formData.ab_ratio_a,
                  ratio_b: formData.ab_ratio_b,
                  evaluation_hours: formData.ab_evaluation_hours,
                  winning_criteria: formData.ab_winning_criteria,
                  winning_threshold: formData.ab_winning_threshold,
                  auto_send_winner: formData.ab_auto_send_winner,
                  winner: null,
                  evaluation_started_at: new Date(),
                  evaluation_completed_at: null,
                  winner_sent_at: null
                },
                stats: {
                  total_recipients: recipientCounts.total,
                  total_sent: 0,
                  total_delivered: 0,
                  total_bounced: 0,
                  total_opened: 0,
                  total_clicked: 0,
                  total_unsubscribed: 0,
                  delivery_rate: 0,
                  open_rate: 0,
                  click_rate: 0,
                  bounce_rate: 0,
                  unsubscribe_rate: 0,
                  stats_a: null,
                  stats_b: null
                },
                created_by: 'user-001',
                created_at: new Date(),
                updated_at: new Date(),
                started_at: new Date(),
                completed_at: null,
                deleted_at: null
              };
              onStart(newCampaign);
            }}
            disabled={!canStart}
            className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Play className="w-4 h-4" />
            Bắt đầu chiến dịch
          </button>
        )}
      </div>

      {/* Modals */}
      {activeModal === 'sender' && (
        <SenderModal
          selectedId={formData.sender_email_id}
          onSelect={(id) => {
            updateField('sender_email_id', id);
            closeModal();
          }}
          onClose={closeModal}
        />
      )}
      
      {activeModal === 'recipients' && (
        <RecipientsModal
          filter={formData.recipient_filter}
          preview={recipientsPreview}
          onSave={(filter) => {
            Object.keys(filter).forEach(key => {
              updateRecipientFilter({ [key]: filter[key as keyof typeof filter] });
            });
            previewRecipients();
            closeModal();
          }}
          onPreview={previewRecipients}
          onClose={closeModal}
        />
      )}
      
      {activeModal === 'content' && (
        <ContentModal
          selectedId={formData.template_id}
          onSelect={(id) => {
            updateField('template_id', id);
            closeModal();
          }}
          onPreview={() => {}}
          onClose={closeModal}
        />
      )}
      
      {activeModal === 'content_b' && (
        <ContentModal
          selectedId={formData.template_b_id}
          onSelect={(id) => {
            updateField('template_b_id', id);
            closeModal();
          }}
          onPreview={() => {}}
          onClose={closeModal}
        />
      )}
    </div>
  );
}
