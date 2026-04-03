'use client';

import React, { useState, useMemo } from 'react';
import {
  X,
  ArrowLeft,
  Check,
  ChevronRight,
  Phone,
  MessageSquare,
  Users,
  Send,
  Save,
  Search,
  FileText,
  Eye,
  Layers,
  Clock,
  Settings
} from 'lucide-react';
import { RecipientFilter, RecipientsPreview } from '../email-marketing/types';
import { ZbsRecipientsConfigModal } from './ZbsRecipientsConfigModal';
import { ZbsConfirmStartModal } from './ZbsConfirmStartModal';
import { formatDate } from '../email-marketing/utils';

// Types
type ZbsSendType = 'phone' | 'zalo_id' | null;

interface ZbsCampaign {
  id: string
  name: string
  status: 'draft' | 'running' | 'paused' | 'scheduled' | 'sent' | 'cancelled'
  recipientCount: number
  scheduledAt?: string
}

interface ZbsCampaignCreatorProps {
  initialCampaign?: ZbsCampaign | null;
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
        w-full flex items-center gap-4 p-4 rounded-lg border-2 text-left transition-all hover:shadow-sm
        ${isComplete 
          ? 'border-green-200 bg-green-50 hover:bg-green-100' 
          : 'border-gray-200 hover:border-blue-200 hover:bg-gray-50'
        }
      `}
    >
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

      <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
    </button>
  );
}

// Campaign Settings Modal (Step 1)
function CampaignSettingsModal({ 
  nameValue, sendTypeValue, onSave, onClose 
}: { 
  nameValue: string; sendTypeValue: ZbsSendType; 
  onSave: (name: string, type: ZbsSendType) => void; 
  onClose: () => void; 
}) {
  const [name, setName] = useState(nameValue);
  const [type, setType] = useState<ZbsSendType>(sendTypeValue);

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-xl w-full max-w-lg mx-4 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Tên chiến dịch và Kiểu gửi</h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5 text-gray-500"/>
          </button>
        </div>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tên chiến dịch <span className="text-red-500">*</span></label>
            <input 
              type="text" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              placeholder="VD: Khuyến mãi tháng 10" 
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Kiểu gửi tin <span className="text-red-500">*</span></label>
            <div className="space-y-3">
              <label className={`flex items-start gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${type === 'phone' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-200'}`}>
                <input type="radio" checked={type === 'phone'} onChange={() => setType('phone')} className="mt-1" />
                <div>
                  <span className="font-medium text-gray-900">Gửi bằng Số điện thoại</span>
                  <p className="text-sm text-gray-500">Gửi tin ZNS đến số điện thoại của khách hàng lưu trong hệ thống</p>
                </div>
              </label>
              <label className={`flex items-start gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${type === 'zalo_id' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-200'}`}>
                <input type="radio" checked={type === 'zalo_id'} onChange={() => setType('zalo_id')} className="mt-1" />
                <div>
                  <span className="font-medium text-gray-900">Gửi bằng Zalo User ID</span>
                  <p className="text-sm text-gray-500">Gửi tin qua Zalo User ID (Dành cho khách hàng đã quan tâm OA)</p>
                </div>
              </label>
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-end gap-3 pt-4 border-t border-gray-100">
          <button onClick={onClose} className="px-4 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg font-medium">Hủy</button>
          <button 
            onClick={() => { onSave(name, type); onClose(); }} 
            className="px-6 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed" 
            disabled={!name.trim() || !type}
          >
            Lưu
          </button>
        </div>
      </div>
    </div>
  );
}

function OASenderModal({ value, onSave, onClose }: { value: string | null, onSave: (v: string) => void, onClose: () => void }) {
  const [selected, setSelected] = useState(value);
  const mockupOAs = [
    { id: 'oa-1', name: 'Zalo OA Công ty XYZ' },
    { id: 'oa-2', name: 'Zalo OA Chăm sóc Khách hàng' }
  ];

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md mx-4 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Chọn Zalo OA Gửi Tin</h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5 text-gray-500"/></button>
        </div>
        <div className="space-y-3 mt-2">
          {mockupOAs.map(oa => (
            <label key={oa.id} className={`flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${selected === oa.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-200'}`}>
              <input type="radio" checked={selected === oa.id} onChange={() => setSelected(oa.id)} className="mt-1" />
              <span className="font-medium text-gray-900">{oa.name}</span>
            </label>
          ))}
        </div>
        <div className="mt-8 flex justify-end gap-3 pt-4 border-t border-gray-100">
          <button onClick={onClose} className="px-4 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg font-medium">Hủy</button>
          <button onClick={() => { if(selected) onSave(selected); onClose(); }} className="px-6 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg font-medium disabled:opacity-50" disabled={!selected}>Lưu</button>
        </div>
      </div>
    </div>
  );
}

function ZbsTemplateModal({ value, onSave, onClose }: { value: string | null, onSave: (id: string, name: string) => void, onClose: () => void }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentSelected, setCurrentSelected] = useState<string | null>(value);

  const mockZaloTemplates = [
    { id: 'tpl-1', name: 'Chào mừng khách hàng mới', type: 'system', updated_at: '2024-06-15T00:00:00Z', thumbnail_url: '' },
    { id: 'tpl-2', name: 'Khuyến mãi đặc biệt', type: 'system', updated_at: '2024-08-20T00:00:00Z', thumbnail_url: '' },
    { id: 'tpl-3', name: 'Xác nhận đơn hàng', type: 'system', updated_at: '2024-02-01T00:00:00Z', thumbnail_url: '' },
    { id: 'tpl-4', name: 'Nhắc nhở thanh toán', type: 'system', updated_at: '2024-03-01T00:00:00Z', thumbnail_url: '' },
    { id: 'tpl-5', name: 'Cảm ơn khách hàng', type: 'system', updated_at: '2024-04-01T00:00:00Z', thumbnail_url: '' },
    { id: 'tpl-6', name: 'Chiến dịch Tết 2025', type: 'user', updated_at: '2026-01-30T00:00:00Z', thumbnail_url: '' },
    { id: 'tpl-7', name: 'Giới thiệu sản phẩm mới', type: 'system', updated_at: '2026-01-30T00:00:00Z', thumbnail_url: '' },
    { id: 'tpl-8', name: 'Mã xác thực OTP', type: 'system', updated_at: '2026-01-30T00:00:00Z', thumbnail_url: '' }
  ];

  const filteredTemplates = useMemo(() => {
    return mockZaloTemplates.filter(template => 
      template.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, mockZaloTemplates]);

  const handleConfirm = () => {
    if (currentSelected) {
      const selectedTpl = mockZaloTemplates.find(t => t.id === currentSelected);
      if (selectedTpl) {
        onSave(selectedTpl.id, selectedTpl.name);
        onClose();
      }
    }
  };

  const selectedTemplate = mockZaloTemplates.find(t => t.id === currentSelected);

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-xl w-full max-w-4xl mx-4 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex-shrink-0 border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Chọn mẫu ZNS</h3>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-gray-100">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Search */}
        <div className="flex-shrink-0 px-6 py-4 border-b border-gray-100">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm mẫu ZNS..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>
        </div>

        {/* Template Grid */}
        <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
          {filteredTemplates.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">Không tìm thấy mẫu ZNS phù hợp</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTemplates.map(template => (
                <div
                  key={template.id}
                  className={`
                    relative rounded-lg border bg-white overflow-hidden transition-all cursor-pointer group
                    ${currentSelected === template.id
                      ? 'border-blue-500 ring-2 ring-blue-200 shadow-md'
                      : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                    }
                  `}
                  onClick={() => setCurrentSelected(template.id)}
                >
                  {/* Thumbnail */}
                  <div className="relative aspect-video bg-gray-50 border-b border-gray-100">
                    <div className="w-full h-full flex flex-col items-center justify-center">
                      <MessageSquare className="w-12 h-12 text-blue-100 mb-2" />
                      <span className="text-xs text-gray-400 font-medium">{template.name}</span>
                    </div>
                    
                    {/* Preview overlay */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          alert('Xem trước mẫu: ' + template.name);
                        }}
                        className="flex items-center gap-2 px-3 py-2 bg-white rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 shadow-sm"
                      >
                        <Eye className="w-4 h-4" />
                        Xem trước
                      </button>
                    </div>

                    {/* Selected check */}
                    {currentSelected === template.id && (
                      <div className="absolute top-2 right-2 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center shadow-sm">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="p-4">
                    <h4 className="font-semibold text-gray-900 truncate mb-1">{template.name}</h4>
                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                      <span className="flex items-center gap-1.5">
                        <Layers className="w-3.5 h-3.5" />
                        {template.type === 'system' ? 'Mẫu hệ thống' : 'Mẫu cá nhân'}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        {formatDate(template.updated_at)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Selected preview bar */}
        {selectedTemplate && (
          <div className="flex-shrink-0 px-6 py-3 bg-blue-50 border-t border-blue-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-blue-600 font-medium mb-0.5">Mẫu được chọn:</p>
                <p className="font-semibold text-blue-900">{selectedTemplate.name}</p>
              </div>
              <button
                onClick={() => alert('Xem trước: ' + selectedTemplate.name)}
                className="flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-800"
              >
                <Eye className="w-4 h-4" />
                Xem trước chi tiết
              </button>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex-shrink-0 bg-white border-t border-gray-200 px-6 py-4 flex justify-end gap-3 rounded-b-xl">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 font-medium hover:bg-gray-100 rounded-lg transition-colors"
          >
            Hủy
          </button>
          <button
            onClick={handleConfirm}
            disabled={!currentSelected}
            className="px-6 py-2 bg-blue-600 font-medium text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Chọn mẫu này
          </button>
        </div>
      </div>
    </div>
  );
}

export function ZbsCampaignCreator({ onClose }: ZbsCampaignCreatorProps) {
  // Config state
  const [campaignName, setCampaignName] = useState('');
  const [sendType, setSendType] = useState<ZbsSendType>(null);
  
  const [senderOA, setSenderOA] = useState<string | null>(null);
  
  const [templateId, setTemplateId] = useState<string | null>(null);
  const [templateName, setTemplateName] = useState<string>('');
  
  const [recipientFilter, setRecipientFilter] = useState<RecipientFilter>({
    labels: [],
    sources: [],
    statuses: [],
    exclude_unsubscribed: true,
    date_range: { from: null, to: null },
    exclude_sent_within_days: 0,
    exclude_bounced: false
  } as RecipientFilter);
  const [recipientsPreview, setRecipientsPreview] = useState<RecipientsPreview | null>(null);
  
  // Modals visibility
  const [activeModal, setActiveModal] = useState<'settings' | 'sender' | 'template' | 'recipients' | 'confirm' | null>(null);

  // Validate completion
  const checklistStatus = {
    settings: !!(campaignName && sendType),
    sender: !!senderOA,
    template: !!templateId,
    recipients: recipientsPreview !== null && recipientsPreview.valid_emails > 0
  };

  const completedCount = Object.values(checklistStatus).filter(Boolean).length;
  const isComplete = completedCount === 4;

  const handleSaveDraft = () => {
    alert('Đã lưu nháp chiến dịch!');
  };

  const handleStartCampaign = (type: 'immediate' | 'scheduled', time?: Date | null) => {
    alert(`Bắt đầu gửi chiến dịch!\nType: ${type}\nTime: ${time ? time.toISOString() : 'Now'}`);
    setActiveModal(null);
    onClose();
  };

  // Mock recipients preview logic
  const mockPreviewFetcher = async (): Promise<RecipientsPreview> => {
    return {
      total_customers: 1500,
      valid_emails: 1450,
      invalid_emails: 50,
      duplicates_removed: 0,
      excluded: { recently_sent: 0, unsubscribed: 0, bounced: 0 },
      sample_recipients: [
        { id: '1', name: 'Nguyễn Văn A', email: '0901234567', labels: [] },
        { id: '2', name: 'Trần Thị B', email: '0987654321', labels: [] }
      ]
    };
  };

  return (
    <div className="fixed inset-0 z-[50] bg-gray-50 flex flex-col h-screen overflow-hidden">
      {/* Header */}
      <div className="flex-shrink-0 bg-white border-b border-gray-200 px-4 h-16 flex items-center justify-between shadow-sm relative z-10">
        <div className="flex items-center gap-4 flex-1">
          <button
            onClick={onClose}
            className="p-2 -ml-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          
          <div className="h-6 w-px bg-gray-300" />
          
          <div className="text-lg font-semibold text-gray-900 truncate">
            {campaignName || 'Chiến dịch gửi tin Zalo mới'}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500 hidden sm:block">
            Đã lưu: Vài giây trước
          </span>
          <button
            onClick={handleSaveDraft}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 rounded-lg font-medium transition-colors shadow-sm"
          >
            <Save className="w-4 h-4" />
            <span className="hidden sm:inline">Lưu nháp</span>
          </button>
          <button
            onClick={() => setActiveModal('confirm')}
            disabled={!isComplete}
            className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4" />
            <span>Bắt đầu gửi</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto py-10 px-4">
          <div className="mb-8 text-center flex flex-col items-center">
            <h1 className="text-2xl font-bold text-gray-900">Thiết lập chiến dịch ZNS</h1>
            <p className="text-gray-500 mt-2">Hoàn thành các bước dưới đây để có thể bắt đầu gửi tin</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Tiến độ thiết lập</h2>
                <div className="text-sm font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                  {completedCount}/4 bước
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-gray-100 rounded-full h-2 mb-8 overflow-hidden">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${(completedCount / 4) * 100}%` }}
                />
              </div>

              {/* Checklist */}
              <div className="space-y-4">
                <ChecklistItem
                  title="Tên chiến dịch và Kiểu gửi"
                  description="Cài đặt tên chiến dịch và kiểu gửi tin nhắn"
                  isComplete={checklistStatus.settings}
                  isRequired={true}
                  icon={<Settings className="w-5 h-5" />}
                  value={checklistStatus.settings ? `${campaignName} • Gửi bằng ${sendType === 'phone' ? 'SĐT' : 'Zalo User ID'}` : undefined}
                  onClick={() => setActiveModal('settings')}
                />

                <ChecklistItem
                  title="Tài khoản Zalo OA"
                  description="Chọn tài khoản Zalo OA để đại diện người gửi"
                  isComplete={checklistStatus.sender}
                  isRequired={true}
                  icon={<MessageSquare className="w-5 h-5" />}
                  value={senderOA ? (senderOA === 'oa-1' ? 'Zalo OA Công ty XYZ' : 'Zalo OA Chăm sóc Khách hàng') : undefined}
                  onClick={() => setActiveModal('sender')}
                />

                <ChecklistItem
                  title="Nội dung ZNS"
                  description="Chọn mẫu tin nhắn ZNS đã được duyệt bởi Zalo"
                  isComplete={checklistStatus.template}
                  isRequired={true}
                  icon={<FileText className="w-5 h-5" />}
                  value={templateName || undefined}
                  onClick={() => setActiveModal('template')}
                />

                <ChecklistItem
                  title="Người nhận"
                  description="Lọc và chọn tập danh sách khách hàng nhận tin"
                  isComplete={checklistStatus.recipients}
                  isRequired={true}
                  icon={<Users className="w-5 h-5" />}
                  value={recipientsPreview ? `Gửi đến ${recipientsPreview.valid_emails} người nhận` : undefined}
                  onClick={() => setActiveModal('recipients')}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {activeModal === 'settings' && (
        <CampaignSettingsModal 
          nameValue={campaignName}
          sendTypeValue={sendType}
          onSave={(name, type) => { setCampaignName(name); setSendType(type); }}
          onClose={() => setActiveModal(null)}
        />
      )}

      {activeModal === 'sender' && (
        <OASenderModal 
          value={senderOA} 
          onSave={setSenderOA} 
          onClose={() => setActiveModal(null)} 
        />
      )}

      {activeModal === 'template' && (
        <ZbsTemplateModal 
          value={templateId} 
          onSave={(id, name) => { setTemplateId(id); setTemplateName(name); }} 
          onClose={() => setActiveModal(null)} 
        />
      )}

      {activeModal === 'recipients' && (
        <ZbsRecipientsConfigModal
          templateName={templateName}
          onSave={({ type, details }) => {
            // For saving mock
            mockPreviewFetcher().then(setRecipientsPreview);
            setActiveModal(null);
          }}
          onClose={() => setActiveModal(null)}
        />
      )}

      {activeModal === 'confirm' && (
        <ZbsConfirmStartModal
          campaignName={campaignName}
          templateName={templateName}
          recipientCount={recipientsPreview?.valid_emails || 0}
          onStart={handleStartCampaign}
          onClose={() => setActiveModal(null)}
        />
      )}
    </div>
  );
}
