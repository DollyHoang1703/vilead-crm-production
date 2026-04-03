'use client';

import React, { useState } from 'react';
import { 
  X, 
  ArrowLeft,
  Send, 
  Check, 
  AlertCircle, 
  Mail, 
  MousePointer,
  Copy,
  Download,
  Pause,
  Play
} from 'lucide-react';

interface ZbsCampaign {
  id: string
  name: string
  status: 'draft' | 'running' | 'paused' | 'scheduled' | 'sent' | 'cancelled'
  recipientCount: number
  scheduledAt?: string
}

interface ZbsCampaignDetailModalProps {
  campaign: ZbsCampaign;
  onClose: () => void;
  onPause?: (campaign: ZbsCampaign) => void;
  onResume?: (campaign: ZbsCampaign) => void;
  onClone?: (campaign: ZbsCampaign) => void;
}

// Stat Card Component
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
  color: 'gray' | 'green' | 'red' | 'blue' | 'purple';
  icon: React.ElementType;
}) {
  const colorClasses = {
    gray: 'text-gray-600 bg-gray-100',
    green: 'text-green-600 bg-green-100',
    red: 'text-red-600 bg-red-100',
    blue: 'text-blue-600 bg-blue-100',
    purple: 'text-purple-600 bg-purple-100'
  };

  return (
    <div className="bg-white rounded-xl border p-4">
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colorClasses[color]}`}>
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <p className="text-2xl font-bold text-gray-900">{value.toLocaleString()}</p>
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

export function ZbsCampaignDetailModal({ campaign, onClose, onPause, onResume, onClone }: ZbsCampaignDetailModalProps) {
  const [filterStatus, setFilterStatus] = useState('all');

  // Hardcode fake stats for visual check
  const stats = {
    total_sent: campaign.recipientCount,
    total_delivered: Math.floor(campaign.recipientCount * 0.95),
    delivery_rate: 95.0,
    total_bounced: Math.floor(campaign.recipientCount * 0.05),
    bounce_rate: 5.0,
    total_opened: Math.floor(campaign.recipientCount * 0.45),
    open_rate: 45.0,
    total_clicked: Math.floor(campaign.recipientCount * 0.12),
    click_rate: 12.0
  };

  const recipients = Array.from({ length: 5 }).map((_, i) => ({
    id: i,
    phone: `09${Math.floor(Math.random() * 100000000)}`,
    name: `Khách hàng ${i + 1}`,
    status: i === 4 ? 'failed' : 'delivered',
    sentTime: '31/01/2026 16:00',
    openTime: i < 3 ? '31/01/2026 16:15' : null,
    opens: i < 3 ? 1 : 0
  }))

  const statusTabs = [
    { id: 'all', label: 'Tất cả', count: campaign.recipientCount },
    { id: 'delivered', label: 'Thành công', count: stats.total_delivered },
    { id: 'opened', label: 'Đã mở', count: stats.total_opened },
    { id: 'clicked', label: 'Đã click', count: stats.total_clicked },
    { id: 'failed', label: 'Thất bại', count: stats.total_bounced }
  ];

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
                Tạo lúc 30/01/2026 22:00
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
          {/* Stats Overview */}
          <div className="grid grid-cols-5 gap-4">
            <StatCard
              label="Tổng gửi"
              value={stats.total_sent}
              color="gray"
              icon={Send}
            />
            <StatCard
              label="Thành công"
              value={stats.total_delivered}
              percentage={stats.delivery_rate}
              color="green"
              icon={Check}
            />
            <StatCard
              label="Thất bại"
              value={stats.total_bounced}
              percentage={stats.bounce_rate}
              color="red"
              icon={AlertCircle}
            />
            <StatCard
              label="Đã mở"
              value={stats.total_opened}
              percentage={stats.open_rate}
              color="blue"
              icon={Mail}
            />
            <StatCard
              label="Đã click"
              value={stats.total_clicked}
              percentage={stats.click_rate}
              color="purple"
              icon={MousePointer}
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

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">SĐT</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tên KH</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Trạng thái</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Gửi lúc</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mở lúc</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Số lần mở</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {recipients.filter(r => filterStatus === 'all' || r.status === filterStatus || (filterStatus !== 'failed' && filterStatus !== 'delivered')).map(recipient => (
                    <tr key={recipient.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-900">{recipient.phone}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{recipient.name}</td>
                      <td className="px-4 py-3">
                         <span className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full ${recipient.status === 'delivered' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {recipient.status === 'delivered' ? 'Thành công' : 'Thất bại'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500">{recipient.sentTime}</td>
                      <td className="px-4 py-3 text-sm text-gray-500">{recipient.openTime || '-'}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{recipient.opens}</td>
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
