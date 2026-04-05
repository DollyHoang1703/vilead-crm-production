'use client';

import React from 'react';
import {
  Wallet,
  Send,
  CreditCard,
  Gift,
  CheckCircle,
  XCircle,
} from 'lucide-react';

export interface ZbsOverviewStats {
  total_spending: number;
  total_sent: number;
  total_charged: number;
  total_free: number;
  total_success: number;
  total_failed: number;
  spending_trend: { value: number; direction: 'up' | 'down' | 'neutral' };
  sent_trend: { value: number; direction: 'up' | 'down' | 'neutral' };
  charged_trend: { value: number; direction: 'up' | 'down' | 'neutral' };
  free_trend: { value: number; direction: 'up' | 'down' | 'neutral' };
  success_trend: { value: number; direction: 'up' | 'down' | 'neutral' };
  failed_trend: { value: number; direction: 'up' | 'down' | 'neutral' };
}

interface ZbsOverviewStatsCardsProps {
  stats: ZbsOverviewStats | null;
  loading?: boolean;
}

const STAT_CONFIGS = [
  {
    key: 'spending',
    label: 'Tổng chi tiêu',
    icon: Wallet,
    colorClass: 'bg-yellow-50 text-yellow-600',
    valueKey: 'total_spending' as const,
    trendKey: 'spending_trend' as const,
    format: 'currency'
  },
  {
    key: 'sent',
    label: 'ZNS đã gửi',
    icon: Send,
    colorClass: 'bg-blue-50 text-blue-600',
    valueKey: 'total_sent' as const,
    trendKey: 'sent_trend' as const,
    format: 'number'
  },
  {
    key: 'charged',
    label: 'ZNS tính phí',
    icon: CreditCard,
    colorClass: 'bg-green-50 text-green-600',
    valueKey: 'total_charged' as const,
    trendKey: 'charged_trend' as const,
    format: 'number'
  },
  {
    key: 'free',
    label: 'ZNS không tính phí',
    icon: Gift,
    colorClass: 'bg-purple-50 text-purple-600',
    valueKey: 'total_free' as const,
    trendKey: 'free_trend' as const,
    format: 'number'
  },
  {
    key: 'success',
    label: 'ZNS thành công',
    icon: CheckCircle,
    colorClass: 'bg-emerald-50 text-emerald-600',
    valueKey: 'total_success' as const,
    trendKey: 'success_trend' as const,
    format: 'number'
  },
  {
    key: 'failed',
    label: 'ZNS thất bại',
    icon: XCircle,
    colorClass: 'bg-red-50 text-red-600',
    valueKey: 'total_failed' as const,
    trendKey: 'failed_trend' as const,
    format: 'number',
    invertTrend: true
  }
];

function formatValue(value: number, format: string): string {
  if (format === 'currency') {
    return value.toLocaleString('vi-VN') + 'đ';
  }
  return value.toLocaleString('vi-VN');
}

function StatCardSkeleton() {
  return (
    <div className="bg-white rounded-xl border p-4 animate-pulse">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-7 h-7 rounded-lg bg-gray-200" />
        <div className="h-4 w-20 bg-gray-200 rounded" />
      </div>
      <div className="h-8 w-16 bg-gray-100 rounded" />
    </div>
  );
}

export function ZbsOverviewStatsCards({ stats, loading = false }: ZbsOverviewStatsCardsProps) {
  if (loading) {
    return (
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
          Tổng chi tiêu & số lượng tin
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <StatCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
        Tổng chi tiêu & số lượng tin
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {STAT_CONFIGS.map((config) => {
          const value = stats[config.valueKey];
          const Icon = config.icon;

          return (
            <div key={config.key} className="bg-white rounded-xl border p-4 hover:shadow-md transition-shadow">
              {/* Header: Icon + Label centered */}
              <div className="flex items-center gap-2 mb-3">
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${config.colorClass}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <p className="text-sm text-gray-500 truncate">{config.label}</p>
              </div>
              {/* Value */}
              <p className="text-2xl font-bold text-gray-900">
                {formatValue(value, config.format)}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
