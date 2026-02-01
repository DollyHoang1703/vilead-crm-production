'use client';

import React from 'react';
import { 
  UserX, 
  Search, 
  TrendingUp,
  Mail,
  Calendar,
  ChevronLeft,
  ChevronRight,
  AlertTriangle
} from 'lucide-react';
import type { UnsubscribeEntry } from '../types';

interface UnsubscribeSectionProps {
  unsubscribes: UnsubscribeEntry[];
  trend: { date: string; label: string; count: number }[];
  loading?: boolean;
  search: string;
  pagination: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  };
  onSearchChange: (search: string) => void;
  onPageChange: (page: number) => void;
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

export function UnsubscribeSection({
  unsubscribes,
  trend,
  loading = false,
  search,
  pagination,
  onSearchChange,
  onPageChange
}: UnsubscribeSectionProps) {
  const totalUnsubscribes = trend.reduce((sum, t) => sum + t.count, 0);
  const avgPerWeek = trend.length > 0 ? totalUnsubscribes / trend.length : 0;

  // Find max for trend chart
  const maxTrend = Math.max(...trend.map(t => t.count), 1);

  if (loading) {
    return (
      <div className="bg-white rounded-lg border p-6 animate-pulse">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-5 h-5 bg-gray-200 rounded" />
          <div className="h-6 bg-gray-200 rounded w-48" />
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="h-[200px] bg-gray-100 rounded" />
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-14 bg-gray-50 rounded" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <UserX className="h-5 w-5 text-red-500" />
            <h3 className="text-lg font-semibold text-gray-900">Danh sách hủy đăng ký</h3>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2 text-gray-500">
              <AlertTriangle className="h-4 w-4 text-orange-500" />
              <span>Tổng: <strong className="text-gray-900">{totalUnsubscribes}</strong></span>
            </div>
            <div className="text-gray-500">
              Trung bình: <strong className="text-gray-900">{avgPerWeek.toFixed(1)}</strong>/tuần
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Trend Chart */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-4 flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Xu hướng hủy đăng ký theo tuần
            </h4>
            
            {trend.length === 0 ? (
              <div className="h-[200px] flex items-center justify-center bg-gray-50 rounded-lg text-gray-500">
                Không có dữ liệu
              </div>
            ) : (
              <div className="space-y-3">
                {trend.map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-20 text-xs text-gray-500 flex-shrink-0">
                      {item.label}
                    </div>
                    <div className="flex-1 h-6 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-red-400 rounded-full transition-all duration-500"
                        style={{ width: `${(item.count / maxTrend) * 100}%` }}
                      />
                    </div>
                    <div className="w-10 text-sm font-medium text-gray-700 text-right flex-shrink-0">
                      {item.count}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Unsubscribe List */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Chi tiết hủy đăng ký gần đây
              </h4>
              
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => onSearchChange(e.target.value)}
                  placeholder="Tìm email..."
                  className="pl-9 pr-4 py-1.5 text-sm border rounded-lg w-48 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* List */}
            <div className="space-y-2 max-h-[250px] overflow-y-auto">
              {unsubscribes.length === 0 ? (
                <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
                  {search ? 'Không tìm thấy kết quả' : 'Không có lượt hủy đăng ký'}
                </div>
              ) : (
                unsubscribes.map((entry) => (
                  <div 
                    key={entry.id} 
                    className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {entry.customer_email}
                        </p>
                        {entry.customer_name && (
                          <p className="text-xs text-gray-500 truncate">{entry.customer_name}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-gray-400 flex-shrink-0 ml-2">
                        <Calendar className="h-3 w-3" />
                        <span>{formatDate(entry.unsubscribed_at)}</span>
                      </div>
                    </div>
                    
                    {entry.reason && (
                      <p className="mt-2 text-xs text-gray-600 italic bg-white px-2 py-1 rounded">
                        Lý do: {entry.reason}
                      </p>
                    )}
                    
                    {entry.campaign_name && (
                      <p className="mt-1 text-xs text-gray-500">
                        Từ chiến dịch: <span className="text-blue-600">{entry.campaign_name}</span>
                      </p>
                    )}
                  </div>
                ))
              )}
            </div>

            {/* Pagination */}
            {pagination.total_pages > 1 && (
              <div className="flex items-center justify-between mt-4 pt-4 border-t">
                <p className="text-xs text-gray-500">
                  {pagination.total} kết quả
                </p>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onPageChange(pagination.page - 1)}
                    disabled={pagination.page <= 1}
                    className="p-1 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <span className="text-xs text-gray-600 px-2">
                    {pagination.page} / {pagination.total_pages}
                  </span>
                  <button
                    onClick={() => onPageChange(pagination.page + 1)}
                    disabled={pagination.page >= pagination.total_pages}
                    className="p-1 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default UnsubscribeSection;
