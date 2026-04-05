'use client';

import React, { useState } from 'react';
import { 
  X, 
  ArrowLeft,
  Check, 
  AlertCircle, 
  Copy,
  Download,
  Pause,
  Play,
  ExternalLink,
  Send
} from 'lucide-react';

interface ZbsCampaign {
  id: string
  name: string
  status: 'draft' | 'running' | 'paused' | 'scheduled' | 'sent' | 'cancelled'
  recipientCount: number
  scheduledAt?: string
  oa?: string
  templateName?: string
  templateId?: string
  createdBy?: string
  createdAt?: string
  estimatedCost?: string
}

interface ZbsCampaignDetailModalProps {
  campaign: ZbsCampaign;
  onClose: () => void;
  onPause?: (campaign: ZbsCampaign) => void;
  onResume?: (campaign: ZbsCampaign) => void;
  onClone?: (campaign: ZbsCampaign) => void;
}

// Stat Card Component - Updated for 3 cards only
function StatCard({
  label,
  value,
  percentage,
  color,
  icon: Icon
}: {
  label: string;
  value: number;
  percentage?: number;
  color: 'gray' | 'green' | 'red';
  icon: React.ElementType;
}) {
  const colorClasses = {
    gray: 'text-gray-600 bg-gray-100',
    green: 'text-green-600 bg-green-100',
    red: 'text-red-600 bg-red-100',
  };

  return (
    <div className="bg-white rounded-xl border p-5 flex-1">
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${colorClasses[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
        <div>
          <p className="text-3xl font-bold text-gray-900">{value.toLocaleString()}</p>
          <p className="text-sm text-gray-500">{label}</p>
          {percentage !== undefined && (
            <p className="text-xs text-gray-400">{percentage.toFixed(1)}%</p>
          )}
        </div>
      </div>
    </div>
  );
}

const getStatusBadgeConfig = (status: string) => {
  switch (status) {
    case 'running': return 'bg-green-100 text-green-700';
    case 'paused': return 'bg-orange-100 text-orange-700';
    case 'sent': return 'bg-gray-100 text-gray-700';
    case 'draft': return 'bg-blue-100 text-blue-700';
    case 'scheduled': return 'bg-purple-100 text-purple-700';
    case 'cancelled': return 'bg-red-100 text-red-700';
    default: return 'bg-gray-100 text-gray-600';
  }
}

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'running': return 'Đang chạy';
    case 'paused': return 'Tạm dừng';
    case 'sent': return 'Đã gửi';
    case 'draft': return 'Nháp';
    case 'scheduled': return 'Đang chờ';
    case 'cancelled': return 'Đã hủy';
    default: return status;
  }
}

// New recipient interface matching the image
interface Recipient {
  id: string;
  templateName: string;
  templateId: string;
  oaName: string;
  phone: string;
  sentTime: string | null;
  status: 'success' | 'failed';
  cost: string;
  costCharged: boolean;
}

export function ZbsCampaignDetailModal({ campaign, onClose, onPause, onResume, onClone }: ZbsCampaignDetailModalProps) {
  const [filterStatus, setFilterStatus] = useState('all');

  // Stats for 3 cards only
  const stats = {
    total_sent: campaign.recipientCount,
    total_success: Math.floor(campaign.recipientCount * 0.95),
    success_rate: 95.0,
    total_failed: Math.floor(campaign.recipientCount * 0.05),
    fail_rate: 5.0,
  };

  // Mock recipients with new fields matching Image 5
  const recipients: Recipient[] = [
    {
      id: '-',
      templateName: 'TEST - Tra cứu hóa đơn GTGT',
      templateId: '485941',
      oaName: 'eEvent',
      phone: '0387968624',
      sentTime: null,
      status: 'failed',
      cost: '300đ',
      costCharged: false
    },
    {
      id: '-',
      templateName: 'TEST - Tra cứu hóa đơn GTGT',
      templateId: '485941',
      oaName: 'eEvent',
      phone: '0972945940',
      sentTime: null,
      status: 'failed',
      cost: '300đ',
      costCharged: false
    },
    {
      id: 'd9f5706fa9d2be8ae7c5',
      templateName: 'Thông báo thanh toán dịch vụ',
      templateId: '464324',
      oaName: 'eEvent',
      phone: '0972945940',
      sentTime: '01:09:35 05/04/2026',
      status: 'success',
      cost: '300đ',
      costCharged: true
    },
    {
      id: '9ff5376feed2f98aa0c5',
      templateName: 'Thông báo thanh toán dịch vụ',
      templateId: '464324',
      oaName: 'eEvent',
      phone: '0387968624',
      sentTime: '01:09:36 05/04/2026',
      status: 'success',
      cost: '300đ',
      costCharged: true
    },
  ];

  const statusTabs = [
    { id: 'all', label: 'Tất cả', count: stats.total_sent },
    { id: 'success', label: 'Thành công', count: stats.total_success },
    { id: 'failed', label: 'Thất bại', count: stats.total_failed }
  ];

  const filteredRecipients = recipients.filter(r => {
    if (filterStatus === 'all') return true;
    return r.status === filterStatus;
  });

  return (
    <div className="fixed inset-0 z-[100] bg-gray-50 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex-shrink-0 bg-white border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-xl font-semibold text-gray-900">{campaign.name}</h1>
                <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getStatusBadgeConfig(campaign.status)}`}>
                  {getStatusLabel(campaign.status)}
                </span>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Tạo lúc {campaign.createdAt || '30/01/2026 22:00'}
                {campaign.status === 'running' || campaign.status === 'sent' ? ` • Bắt đầu lúc ${campaign.scheduledAt || '31/01/2026 16:00'}` : ''}
              </p>
            </div>
          </div>
          
          {/* Actions */}
          <div className="flex items-center gap-2">
            {campaign.status === 'running' && onPause && (
              <button 
                onClick={() => onPause(campaign)}
                className="flex items-center gap-2 px-4 py-2 border border-yellow-300 text-yellow-700 rounded-lg hover:bg-yellow-50"
              >
                <Pause className="w-4 h-4" />
                Tạm dừng
              </button>
            )}
            {campaign.status === 'paused' && onResume && (
              <button 
                onClick={() => onResume(campaign)}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                <Play className="w-4 h-4" />
                Tiếp tục
              </button>
            )}
            {(campaign.status === 'sent' || campaign.status === 'paused') && onClone && (
              <button 
                onClick={() => onClone(campaign)}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                <Copy className="w-4 h-4" />
                Tạo bản sao
              </button>
            )}
            {campaign.status === 'sent' && (
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
                <Download className="w-4 h-4" />
                Export
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Stats Overview - Only 3 cards */}
          <div className="grid grid-cols-3 gap-4">
            <StatCard
              label="Tổng gửi"
              value={stats.total_sent}
              color="gray"
              icon={Send}
            />
            <StatCard
              label="Thành công"
              value={stats.total_success}
              percentage={stats.success_rate}
              color="green"
              icon={Check}
            />
            <StatCard
              label="Thất bại"
              value={stats.total_failed}
              percentage={stats.fail_rate}
              color="red"
              icon={AlertCircle}
            />
          </div>

          <div className="bg-white rounded-xl border">
            {/* Header */}
            <div className="p-4 border-b flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Chi tiết người nhận</h3>
              <button className="flex items-center gap-2 px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-50 rounded-lg">
                <Download className="w-4 h-4" />
                Export Excel
              </button>
            </div>

            {/* Tabs */}
            <div className="border-b overflow-x-auto">
              <div className="flex">
                {statusTabs.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setFilterStatus(tab.id)}
                    className={`
                      px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors
                      ${filterStatus === tab.id 
                        ? 'border-blue-500 text-blue-600' 
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                      }
                    `}
                  >
                    {tab.label} ({tab.count})
                  </button>
                ))}
              </div>
            </div>

            {/* Table - Updated fields */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tên mẫu ZNS</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tên OA</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">SĐT/User ID</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Thời gian gửi</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Trạng thái</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Chi phí</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredRecipients.map((recipient, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-600 font-mono">
                        {recipient.id === '-' ? '-' : recipient.id}
                      </td>
                      <td className="px-4 py-3">
                        <div>
                          <p className="text-sm text-gray-900">{recipient.templateName}</p>
                          <a href="#" className="text-xs text-blue-600 hover:underline flex items-center gap-1">
                            Id: {recipient.templateId}
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                            <span className="text-xs font-medium text-green-700">
                              {recipient.oaName.charAt(0)}
                            </span>
                          </div>
                          <span className="text-sm text-gray-700">{recipient.oaName}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">{recipient.phone}</td>
                      <td className="px-4 py-3 text-sm text-gray-500">{recipient.sentTime || '-'}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          <span className={`text-sm font-medium ${
                            recipient.status === 'success' ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {recipient.status === 'success' ? 'Thành công' : 'Thất bại'}
                          </span>
                          <span className={`w-2 h-2 rounded-full ${
                            recipient.status === 'success' ? 'bg-green-500' : 'bg-red-500'
                          }`} />
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{recipient.cost}</p>
                          {recipient.status === 'success' ? (
                            <span className="text-xs text-gray-400">Đã tính phí</span>
                          ) : (
                            <span className="text-xs text-gray-400">Không tính phí</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
