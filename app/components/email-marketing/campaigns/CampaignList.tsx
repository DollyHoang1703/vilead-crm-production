'use client';

import React, { useState } from 'react';
import {
  Search,
  Plus,
  Filter,
  Mail,
  FlaskConical,
  X,
  AlertTriangle
} from 'lucide-react';
import { CampaignStatus, CampaignType, Campaign } from '../types';
import { useCampaigns } from '../hooks';
import { CampaignTable } from './CampaignTable';
import { CampaignStatusBadge } from './CampaignStatusBadge';
import { CAMPAIGN_STATUS_CONFIG } from '../mockData';

// Status tabs configuration
const STATUS_TABS: Array<{ key: CampaignStatus | 'all'; label: string }> = [
  { key: 'all', label: 'Tất cả' },
  { key: 'draft', label: 'Mới' },
  { key: 'scheduled', label: 'Đang chờ' },
  { key: 'running', label: 'Đang gửi' },
  { key: 'paused', label: 'Tạm dừng' },
  { key: 'sent', label: 'Đã gửi' },
  { key: 'cancelled', label: 'Đã hủy' }
];

interface CampaignListProps {
  onOpenEditor: (campaign?: Campaign, mode?: 'create' | 'edit', type?: 'normal' | 'ab') => void;
  onOpenABEditor?: () => void;
  onViewStats?: (campaign: Campaign) => void;
}

export function CampaignList({ onOpenEditor, onOpenABEditor, onViewStats }: CampaignListProps) {
  const {
    campaigns,
    loading,
    filters,
    modals,
    selectedCampaign,
    statusCounts,
    editorCampaignType,
    updateFilters,
    toggleModal,
    setSelectedCampaign,
    openCreateModal,
    openEdit,
    cloneCampaign,
    deleteCampaign,
    cancelCampaign,
    pauseCampaign,
    resumeCampaign,
    openDeleteConfirm,
    openCancelConfirm,
    openPauseConfirm,
    openResumeModal
  } = useCampaigns();

  const [searchInput, setSearchInput] = useState('');
  const [newCampaignName, setNewCampaignName] = useState('');
  const [newCampaignType, setNewCampaignType] = useState<CampaignType>('normal');

  // Handle search
  const handleSearch = () => {
    updateFilters({ search: searchInput });
  };

  // Handle tab change
  const handleTabChange = (status: CampaignStatus | 'all') => {
    updateFilters({ status });
  };

  // Handle create campaign
  const handleCreateConfirm = () => {
    toggleModal('createType', false);
    // Open the appropriate editor based on campaign type
    if (newCampaignType === 'ab' && onOpenABEditor) {
      onOpenABEditor();
    } else {
      onOpenEditor(undefined, 'create', newCampaignType);
    }
  };

  // Handle edit
  const handleEdit = (campaign: Campaign) => {
    const result = openEdit(campaign);
    if (result.success) {
      onOpenEditor(campaign, 'edit');
    }
  };

  // Handle start
  const handleStart = (campaign: Campaign) => {
    // Open the editor to complete checklist and start
    onOpenEditor(campaign, 'edit');
  };

  // Handle clone
  const handleClone = async (campaign: Campaign) => {
    await cloneCampaign(campaign);
  };

  // Handle view stats
  const handleViewStats = (campaign: Campaign) => {
    if (onViewStats) {
      onViewStats(campaign);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Chiến dịch Email</h2>
          <p className="text-sm text-gray-500">
            Quản lý và theo dõi các chiến dịch gửi email
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Tạo chiến dịch
        </button>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Tìm kiếm theo tên hoặc tiêu đề..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div className="flex gap-2">
          {/* Status Filter Dropdown */}
          <select
            value={filters.status}
            onChange={(e) => handleTabChange(e.target.value as CampaignStatus | 'all')}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm min-w-[140px]"
          >
            {STATUS_TABS.map(tab => (
              <option key={tab.key} value={tab.key}>
                {tab.label} ({statusCounts[tab.key]})
              </option>
            ))}
          </select>
          {/* Campaign Type Filter */}
          <select
            value={filters.type}
            onChange={(e) => updateFilters({ type: e.target.value as CampaignType | 'all' })}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          >
            <option value="all">Tất cả loại</option>
            <option value="normal">Chiến dịch thường</option>
            <option value="ab">A/B Testing</option>
          </select>
          <button
            onClick={handleSearch}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <Filter className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Campaign Table */}
      <CampaignTable
        campaigns={campaigns}
        loading={loading}
        onEdit={handleEdit}
        onStart={handleStart}
        onPause={(campaign) => openPauseConfirm(campaign)}
        onResume={(campaign) => openResumeModal(campaign)}
        onCancel={(campaign) => openCancelConfirm(campaign)}
        onClone={handleClone}
        onDelete={(campaign) => openDeleteConfirm(campaign)}
        onViewStats={handleViewStats}
      />

      {/* Create Campaign Type Modal */}
      {modals.createType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div 
            className="fixed inset-0 bg-black/50" 
            onClick={() => toggleModal('createType', false)}
          />
          <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md mx-4 p-6">
            <button
              onClick={() => toggleModal('createType', false)}
              className="absolute right-4 top-4 p-1 rounded-lg hover:bg-gray-100"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
            
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Tạo chiến dịch mới
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tên chiến dịch
                </label>
                <input
                  type="text"
                  value={newCampaignName}
                  onChange={(e) => setNewCampaignName(e.target.value)}
                  placeholder="VD: Khuyến mãi tháng 1/2025"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Loại chiến dịch
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setNewCampaignType('normal')}
                    className={`
                      flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-colors
                      ${newCampaignType === 'normal' 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-300'
                      }
                    `}
                  >
                    <Mail className={`w-8 h-8 ${newCampaignType === 'normal' ? 'text-blue-600' : 'text-gray-400'}`} />
                    <span className={`text-sm font-medium ${newCampaignType === 'normal' ? 'text-blue-700' : 'text-gray-600'}`}>
                      Chiến dịch thường
                    </span>
                    <span className="text-xs text-gray-500 text-center">
                      Gửi một nội dung đến tất cả
                    </span>
                  </button>
                  
                  <button
                    onClick={() => setNewCampaignType('ab')}
                    className={`
                      flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-colors
                      ${newCampaignType === 'ab' 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-300'
                      }
                    `}
                  >
                    <FlaskConical className={`w-8 h-8 ${newCampaignType === 'ab' ? 'text-blue-600' : 'text-gray-400'}`} />
                    <span className={`text-sm font-medium ${newCampaignType === 'ab' ? 'text-blue-700' : 'text-gray-600'}`}>
                      A/B Testing
                    </span>
                    <span className="text-xs text-gray-500 text-center">
                      So sánh 2 phiên bản
                    </span>
                  </button>
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex gap-3 justify-end">
              <button
                onClick={() => toggleModal('createType', false)}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={handleCreateConfirm}
                disabled={!newCampaignName.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Tiếp tục
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {modals.delete && selectedCampaign && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div 
            className="fixed inset-0 bg-black/50" 
            onClick={() => toggleModal('delete', false)}
          />
          <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md mx-4 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-red-100 rounded-full">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Xóa chiến dịch</h3>
                <p className="text-sm text-gray-500">{selectedCampaign.name}</p>
              </div>
            </div>
            
            <p className="text-gray-600 mb-6">
              Bạn có chắc chắn muốn xóa chiến dịch này? Hành động này không thể hoàn tác.
            </p>
            
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => toggleModal('delete', false)}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={() => deleteCampaign(selectedCampaign.id)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Xóa chiến dịch
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Confirm Modal */}
      {modals.cancel && selectedCampaign && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div 
            className="fixed inset-0 bg-black/50" 
            onClick={() => toggleModal('cancel', false)}
          />
          <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md mx-4 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-yellow-100 rounded-full">
                <AlertTriangle className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Hủy chiến dịch</h3>
                <p className="text-sm text-gray-500">{selectedCampaign.name}</p>
              </div>
            </div>
            
            <p className="text-gray-600 mb-6">
              Bạn có chắc chắn muốn hủy chiến dịch này? Chiến dịch sẽ không được gửi đi.
            </p>
            
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => toggleModal('cancel', false)}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Quay lại
              </button>
              <button
                onClick={() => cancelCampaign(selectedCampaign.id)}
                className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
              >
                Hủy chiến dịch
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Pause Confirm Modal */}
      {modals.pause && selectedCampaign && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div 
            className="fixed inset-0 bg-black/50" 
            onClick={() => toggleModal('pause', false)}
          />
          <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md mx-4 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-orange-100 rounded-full">
                <AlertTriangle className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Tạm dừng chiến dịch</h3>
                <p className="text-sm text-gray-500">{selectedCampaign.name}</p>
              </div>
            </div>
            
            <p className="text-gray-600 mb-4">
              Chiến dịch sẽ dừng gửi email. Bạn có thể tiếp tục gửi sau.
            </p>
            
            <div className="bg-gray-50 rounded-lg p-3 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Đã gửi:</span>
                <span className="font-medium">{selectedCampaign.stats.total_sent}/{selectedCampaign.valid_email_count}</span>
              </div>
              <div className="flex justify-between text-sm mt-1">
                <span className="text-gray-500">Còn lại:</span>
                <span className="font-medium">{selectedCampaign.valid_email_count - selectedCampaign.stats.total_sent}</span>
              </div>
            </div>
            
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => toggleModal('pause', false)}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={() => pauseCampaign(selectedCampaign.id)}
                className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
              >
                Tạm dừng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Resume Modal */}
      {modals.resume && selectedCampaign && (
        <ResumeModal
          campaign={selectedCampaign}
          onClose={() => toggleModal('resume', false)}
          onResume={(sendType, scheduledAt) => resumeCampaign(selectedCampaign.id, sendType, scheduledAt)}
        />
      )}
    </div>
  );
}

// Resume Modal Component
interface ResumeModalProps {
  campaign: Campaign;
  onClose: () => void;
  onResume: (sendType: 'immediate' | 'scheduled', scheduledAt?: Date) => void;
}

function ResumeModal({ campaign, onClose, onResume }: ResumeModalProps) {
  const [sendType, setSendType] = useState<'immediate' | 'scheduled'>('immediate');
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');

  const handleConfirm = () => {
    if (sendType === 'scheduled' && scheduledDate && scheduledTime) {
      const scheduledAt = new Date(`${scheduledDate}T${scheduledTime}`);
      onResume(sendType, scheduledAt);
    } else {
      onResume(sendType);
    }
  };

  const remaining = campaign.valid_email_count - campaign.stats.total_sent;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md mx-4 p-6">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-1 rounded-lg hover:bg-gray-100"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>
        
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Tiếp tục gửi chiến dịch
        </h3>
        
        <div className="bg-blue-50 rounded-lg p-3 mb-4">
          <p className="text-sm text-blue-700">
            Còn <strong>{remaining.toLocaleString()}</strong> email chưa gửi
          </p>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Thời gian gửi
            </label>
            <div className="space-y-2">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="sendType"
                  value="immediate"
                  checked={sendType === 'immediate'}
                  onChange={() => setSendType('immediate')}
                  className="w-4 h-4 text-blue-600"
                />
                <span className="text-sm text-gray-700">Gửi ngay lập tức</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="sendType"
                  value="scheduled"
                  checked={sendType === 'scheduled'}
                  onChange={() => setSendType('scheduled')}
                  className="w-4 h-4 text-blue-600"
                />
                <span className="text-sm text-gray-700">Lên lịch gửi</span>
              </label>
            </div>
          </div>
          
          {sendType === 'scheduled' && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Ngày</label>
                <input
                  type="date"
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Giờ</label>
                <input
                  type="time"
                  value={scheduledTime}
                  onChange={(e) => setScheduledTime(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>
            </div>
          )}
        </div>
        
        <div className="mt-6 flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Hủy
          </button>
          <button
            onClick={handleConfirm}
            disabled={sendType === 'scheduled' && (!scheduledDate || !scheduledTime)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            Tiếp tục gửi
          </button>
        </div>
      </div>
    </div>
  );
}
