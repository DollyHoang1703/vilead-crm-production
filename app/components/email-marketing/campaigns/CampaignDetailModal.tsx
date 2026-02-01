'use client';

import React, { useEffect, useMemo } from 'react';
import { 
  X, 
  ArrowLeft,
  Send, 
  Check, 
  AlertCircle, 
  Mail, 
  MousePointer,
  UserMinus,
  Copy,
  Download,
  Pause,
  Play,
  Trophy,
  Clock,
  TrendingUp,
  TrendingDown
} from 'lucide-react';
import { useCampaignDetail } from '../hooks';
import { Campaign, EmailLogStatus, ABTestResults } from '../types';
import { CampaignStatusBadge } from './CampaignStatusBadge';
import { AB_TEST_TYPE_LABELS, AB_VERSION_COLORS, EMAIL_LOG_STATUS_CONFIG } from '../mockData';
import { formatDate, formatDateTime } from '../utils';

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

// A/B Test Results Component
function ABTestResultsCard({
  results,
  onSendRemaining
}: {
  results: ABTestResults;
  onSendRemaining: (version: 'a' | 'b') => void;
}) {
  const testTypeLabel = AB_TEST_TYPE_LABELS[results.test_type]?.label || results.test_type;
  
  const getVersionValue = (version: 'a' | 'b') => {
    const content = version === 'a' ? results.version_a.content : results.version_b.content;
    switch (results.test_type) {
      case 'subject':
        return content.subject || '';
      case 'content':
        return `Template: ${content.template_id}`;
      case 'send_time':
        return content.send_at ? new Date(content.send_at).toLocaleString('vi-VN') : '';
      default:
        return '';
    }
  };

  return (
    <div className="bg-white rounded-xl border p-6">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
          🔀
        </div>
        <h3 className="font-semibold text-gray-900">Kết quả A/B Testing</h3>
      </div>
      
      <p className="text-sm text-gray-600 mb-4">Loại test: {testTypeLabel}</p>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        {/* Version A */}
        <div className={`
          p-4 rounded-lg border-2 
          ${results.winner === 'a' ? 'border-green-500 bg-green-50' : 'border-red-200 bg-red-50'}
        `}>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2 py-0.5 bg-red-500 text-white text-xs font-bold rounded">A</span>
            <span className="text-sm font-medium text-gray-900">Phiên bản A</span>
            {results.winner === 'a' && (
              <span className="ml-auto flex items-center gap-1 text-green-600 text-xs font-medium">
                <Trophy className="w-3 h-3" /> THẮNG
              </span>
            )}
          </div>
          <p className="text-xs text-gray-500 mb-3 truncate">{getVersionValue('a')}</p>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Đã gửi:</span>
              <span className="font-medium">{results.version_a.stats.sent}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Đã mở:</span>
              <span className="font-medium">{results.version_a.stats.opened} ({results.version_a.stats.open_rate.toFixed(1)}%)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Đã click:</span>
              <span className="font-medium">{results.version_a.stats.clicked} ({results.version_a.stats.click_rate.toFixed(1)}%)</span>
            </div>
          </div>
        </div>

        {/* Version B */}
        <div className={`
          p-4 rounded-lg border-2 
          ${results.winner === 'b' ? 'border-green-500 bg-green-50' : 'border-blue-200 bg-blue-50'}
        `}>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2 py-0.5 bg-blue-500 text-white text-xs font-bold rounded">B</span>
            <span className="text-sm font-medium text-gray-900">Phiên bản B</span>
            {results.winner === 'b' && (
              <span className="ml-auto flex items-center gap-1 text-green-600 text-xs font-medium">
                <Trophy className="w-3 h-3" /> THẮNG
              </span>
            )}
          </div>
          <p className="text-xs text-gray-500 mb-3 truncate">{getVersionValue('b')}</p>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Đã gửi:</span>
              <span className="font-medium">{results.version_b.stats.sent}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Đã mở:</span>
              <span className="font-medium">{results.version_b.stats.opened} ({results.version_b.stats.open_rate.toFixed(1)}%)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Đã click:</span>
              <span className="font-medium">{results.version_b.stats.clicked} ({results.version_b.stats.click_rate.toFixed(1)}%)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Comparison */}
      {results.evaluation_status === 'completed' && results.winner && results.winner !== 'tie' && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-lg mb-4">
          <p className="text-sm text-green-800 flex items-center gap-2">
            <Check className="w-4 h-4" />
            Kết luận: Phiên bản {results.winner.toUpperCase()} thắng với tỷ lệ mở cao hơn{' '}
            <strong>{Math.abs(results.comparison.open_rate_diff).toFixed(1)}%</strong>
            {results.comparison.open_rate_diff > 0 
              ? <TrendingUp className="w-4 h-4 text-green-600" />
              : <TrendingDown className="w-4 h-4 text-red-600" />
            }
          </p>
        </div>
      )}

      {/* Pending Evaluation */}
      {results.evaluation_status === 'pending' && (
        <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg mb-4">
          <p className="text-sm text-yellow-800 flex items-center gap-2">
            <Clock className="w-4 h-4" />
            ⏳ Đang đánh giá... Vui lòng chờ để có kết quả chính xác
          </p>
        </div>
      )}

      {/* Send Remaining */}
      {results.can_send_remaining && (
        <div className="p-4 bg-gray-50 border rounded-lg">
          <p className="text-sm text-gray-700 mb-3">
            Gửi phần còn lại ({results.remaining_count.toLocaleString()} email)
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => onSendRemaining('a')}
              className="flex-1 px-3 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 text-sm"
            >
              Gửi phiên bản A
            </button>
            <button
              onClick={() => onSendRemaining('b')}
              className={`
                flex-1 px-3 py-2 rounded-lg text-sm
                ${results.winner === 'b' 
                  ? 'bg-green-600 text-white hover:bg-green-700' 
                  : 'border border-blue-300 text-blue-700 hover:bg-blue-50'
                }
              `}
            >
              Gửi phiên bản B {results.winner === 'b' && '(khuyến nghị)'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Email Status Badge
function EmailStatusBadge({ status }: { status: EmailLogStatus }) {
  const config = EMAIL_LOG_STATUS_CONFIG[status];
  return (
    <span className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full ${config.bgColor} ${config.color}`}>
      {config.label}
    </span>
  );
}

// Recipients List Component
function RecipientsList({
  recipients,
  loading,
  filter,
  counts,
  onFilterChange,
  onSearch
}: {
  recipients: any[];
  loading: boolean;
  filter: { status: EmailLogStatus | 'all'; search: string };
  counts: Record<EmailLogStatus | 'all', number>;
  onFilterChange: (status: EmailLogStatus | 'all') => void;
  onSearch: (search: string) => void;
}) {
  const statusTabs: { id: EmailLogStatus | 'all'; label: string }[] = [
    { id: 'all', label: 'Tất cả' },
    { id: 'delivered', label: 'Thành công' },
    { id: 'opened', label: 'Đã mở' },
    { id: 'clicked', label: 'Đã click' },
    { id: 'bounced', label: 'Thất bại' },
    { id: 'unsubscribed', label: 'Hủy ĐK' }
  ];

  return (
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
              onClick={() => onFilterChange(tab.id)}
              className={`
                px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors
                ${filter.status === tab.id 
                  ? 'border-blue-500 text-blue-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700'
                }
              `}
            >
              {tab.label} ({counts[tab.id] || 0})
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tên KH</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Trạng thái</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">A/B</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Gửi lúc</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mở lúc</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Số lần mở</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                  Đang tải...
                </td>
              </tr>
            ) : recipients.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                  Không có dữ liệu
                </td>
              </tr>
            ) : (
              recipients.map(recipient => (
                <tr key={recipient.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-900">{recipient.recipient_email}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{recipient.recipient_name || '-'}</td>
                  <td className="px-4 py-3">
                    <EmailStatusBadge status={recipient.status} />
                  </td>
                  <td className="px-4 py-3">
                    {recipient.ab_version && (
                      <span className={`
                        px-2 py-0.5 text-xs font-bold rounded
                        ${recipient.ab_version === 'a' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}
                      `}>
                        {recipient.ab_version.toUpperCase()}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {recipient.sent_at ? formatDateTime(recipient.sent_at) : '-'}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {recipient.opened_at ? formatDateTime(recipient.opened_at) : '-'}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{recipient.open_count}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

interface CampaignDetailModalProps {
  campaignId: string;
  onClose: () => void;
}

export function CampaignDetailModal({ campaignId, onClose }: CampaignDetailModalProps) {
  const {
    campaign,
    loading,
    recipients,
    recipientsLoading,
    recipientsFilter,
    recipientCounts,
    abResults,
    loadRecipients,
    updateRecipientsFilter,
    sendRemaining
  } = useCampaignDetail(campaignId);

  // Load recipients when filter changes
  useEffect(() => {
    loadRecipients();
  }, [loadRecipients, recipientsFilter]);

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Đang tải...</p>
        </div>
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="fixed inset-0 z-50 bg-white flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-gray-600">Không tìm thấy chiến dịch</p>
          <button onClick={onClose} className="mt-4 px-4 py-2 bg-gray-100 rounded-lg">
            Đóng
          </button>
        </div>
      </div>
    );
  }

  const stats = campaign.stats;

  return (
    <div className="fixed inset-0 z-50 bg-gray-50 flex flex-col overflow-hidden">
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
                <CampaignStatusBadge status={campaign.status} />
                {campaign.type === 'ab' && (
                  <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs font-medium rounded-full">
                    A/B Testing
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Tạo lúc {formatDateTime(campaign.created_at)}
                {campaign.started_at && ` • Bắt đầu lúc ${formatDateTime(campaign.started_at)}`}
              </p>
            </div>
          </div>
          
          {/* Actions */}
          <div className="flex items-center gap-2">
            {campaign.status === 'running' && (
              <button className="flex items-center gap-2 px-4 py-2 border border-yellow-300 text-yellow-700 rounded-lg hover:bg-yellow-50">
                <Pause className="w-4 h-4" />
                Tạm dừng
              </button>
            )}
            {campaign.status === 'paused' && (
              <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                <Play className="w-4 h-4" />
                Tiếp tục
              </button>
            )}
            {campaign.status === 'sent' && (
              <>
                <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
                  <Copy className="w-4 h-4" />
                  Tạo bản sao
                </button>
                <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
                  <Download className="w-4 h-4" />
                  Export
                </button>
              </>
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

          {/* A/B Test Results (if A/B campaign) */}
          {campaign.type === 'ab' && abResults && (
            <ABTestResultsCard
              results={abResults}
              onSendRemaining={async (version) => {
                const result = await sendRemaining(version);
                if (result.success) {
                  alert(result.message);
                }
              }}
            />
          )}

          {/* Recipients List */}
          <RecipientsList
            recipients={recipients}
            loading={recipientsLoading}
            filter={recipientsFilter}
            counts={recipientCounts}
            onFilterChange={(status) => updateRecipientsFilter({ status })}
            onSearch={(search) => updateRecipientsFilter({ search })}
          />
        </div>
      </div>
    </div>
  );
}
