'use client';

import React from 'react';
import { 
  BarChart3, 
  ArrowUpDown, 
  ArrowUp, 
  ArrowDown,
  ChevronLeft,
  ChevronRight,
  Eye
} from 'lucide-react';
import type { CampaignComparisonRow } from '../types';

interface CampaignComparisonTableProps {
  campaigns: CampaignComparisonRow[];
  loading?: boolean;
  sort: { field: string; order: 'asc' | 'desc' };
  pagination: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  };
  onSort: (field: string) => void;
  onPageChange: (page: number) => void;
  onViewCampaign?: (campaignId: string) => void;
}

const COLUMNS = [
  { key: 'campaign_name', label: 'Tên chiến dịch', sortable: true, width: 'flex-1 min-w-[200px]' },
  { key: 'sent_date', label: 'Ngày gửi', sortable: true, width: 'w-32' },
  { key: 'total_sent', label: 'Số gửi', sortable: true, width: 'w-24 text-right' },
  { key: 'open_rate', label: 'Tỷ lệ mở', sortable: true, width: 'w-24 text-right' },
  { key: 'click_rate', label: 'Tỷ lệ click', sortable: true, width: 'w-24 text-right' },
  { key: 'bounce_rate', label: 'Bounce', sortable: true, width: 'w-24 text-right' },
  { key: 'actions', label: '', sortable: false, width: 'w-16' }
];

function getRateColorClass(rate: number, type: 'good' | 'bad'): string {
  if (type === 'good') {
    if (rate >= 25) return 'text-green-600 bg-green-50';
    if (rate >= 15) return 'text-blue-600 bg-blue-50';
    return 'text-gray-600 bg-gray-50';
  } else {
    if (rate >= 5) return 'text-red-600 bg-red-50';
    if (rate >= 2) return 'text-orange-600 bg-orange-50';
    return 'text-gray-600 bg-gray-50';
  }
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
}

export function CampaignComparisonTable({
  campaigns,
  loading = false,
  sort,
  pagination,
  onSort,
  onPageChange,
  onViewCampaign
}: CampaignComparisonTableProps) {
  const renderSortIcon = (field: string) => {
    if (sort.field !== field) {
      return <ArrowUpDown className="h-4 w-4 text-gray-400" />;
    }
    return sort.order === 'asc' 
      ? <ArrowUp className="h-4 w-4 text-blue-500" />
      : <ArrowDown className="h-4 w-4 text-blue-500" />;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg border p-6 animate-pulse">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-5 h-5 bg-gray-200 rounded" />
          <div className="h-6 bg-gray-200 rounded w-48" />
        </div>
        <div className="space-y-3">
          <div className="h-10 bg-gray-100 rounded" />
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-14 bg-gray-50 rounded" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-green-500" />
          <h3 className="text-lg font-semibold text-gray-900">So sánh chiến dịch</h3>
        </div>
        <p className="text-sm text-gray-500 mt-1">
          Hiển thị {campaigns.length} / {pagination.total} chiến dịch
        </p>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[700px]">
          <thead className="bg-gray-50 border-b">
            <tr>
              {COLUMNS.map((col) => (
                <th 
                  key={col.key}
                  className={`px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${col.width}`}
                >
                  {col.sortable ? (
                    <button
                      onClick={() => onSort(col.key)}
                      className="flex items-center gap-1 hover:text-gray-700 transition-colors"
                    >
                      <span>{col.label}</span>
                      {renderSortIcon(col.key)}
                    </button>
                  ) : (
                    col.label
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {campaigns.length === 0 ? (
              <tr>
                <td colSpan={COLUMNS.length} className="px-4 py-8 text-center text-gray-500">
                  Không có dữ liệu chiến dịch
                </td>
              </tr>
            ) : (
              campaigns.map((campaign) => (
                <tr 
                  key={campaign.id} 
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-4 py-4">
                    <div>
                      <p className="text-sm font-medium text-gray-900 truncate max-w-[250px]">
                        {campaign.campaign_name}
                      </p>
                      {campaign.type && (
                        <span className={`inline-block mt-1 px-2 py-0.5 text-xs rounded-full ${
                          campaign.type === 'ab' 
                            ? 'bg-purple-100 text-purple-700' 
                            : 'bg-blue-100 text-blue-700'
                        }`}>
                          {campaign.type === 'ab' ? 'A/B Test' : 'Thường'}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-600">
                    {formatDate(campaign.sent_date)}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-900 text-right font-medium">
                    {campaign.total_sent.toLocaleString('vi-VN')}
                  </td>
                  <td className="px-4 py-4 text-right">
                    <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${getRateColorClass(campaign.open_rate, 'good')}`}>
                      {campaign.open_rate.toFixed(1)}%
                    </span>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${getRateColorClass(campaign.click_rate, 'good')}`}>
                      {campaign.click_rate.toFixed(1)}%
                    </span>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${getRateColorClass(campaign.bounce_rate, 'bad')}`}>
                      {campaign.bounce_rate.toFixed(1)}%
                    </span>
                  </td>
                  <td className="px-4 py-4 text-center">
                    {onViewCampaign && (
                      <button
                        onClick={() => onViewCampaign(campaign.id)}
                        className="p-2 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                        title="Xem chi tiết"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination.total_pages > 1 && (
        <div className="px-4 py-3 border-t flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Trang {pagination.page} / {pagination.total_pages}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onPageChange(pagination.page - 1)}
              disabled={pagination.page <= 1}
              className="p-2 rounded-lg border hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            
            {Array.from({ length: pagination.total_pages }).map((_, i) => (
              <button
                key={i}
                onClick={() => onPageChange(i + 1)}
                className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                  pagination.page === i + 1
                    ? 'bg-blue-500 text-white'
                    : 'hover:bg-gray-100 text-gray-600'
                }`}
              >
                {i + 1}
              </button>
            ))}
            
            <button
              onClick={() => onPageChange(pagination.page + 1)}
              disabled={pagination.page >= pagination.total_pages}
              className="p-2 rounded-lg border hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default CampaignComparisonTable;
