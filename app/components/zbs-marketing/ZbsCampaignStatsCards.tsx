'use client';

import React from 'react';
import {
  LayoutList,
  Clock,
  Zap,
  Hourglass,
  Loader,
  Ban
} from 'lucide-react';

export interface ZbsCampaignStats {
  total_campaigns: number;
  scheduled_campaigns: number;
  immediate_campaigns: number;
  pending_campaigns: number;
  processing_campaigns: number;
  cancelled_campaigns: number;
}

interface ZbsCampaignStatsCardsProps {
  stats: ZbsCampaignStats | null;
  loading?: boolean;
}

const STAT_CONFIGS = [
  {
    key: 'total',
    label: 'Tổng số chiến dịch',
    icon: LayoutList,
    colorClass: 'bg-blue-50 text-blue-600',
    valueKey: 'total_campaigns' as const
  },
  {
    key: 'scheduled',
    label: 'Chiến dịch hẹn giờ',
    icon: Clock,
    colorClass: 'bg-orange-50 text-orange-600',
    valueKey: 'scheduled_campaigns' as const
  },
  {
    key: 'immediate',
    label: 'Chiến dịch chạy liền',
    icon: Zap,
    colorClass: 'bg-cyan-50 text-cyan-600',
    valueKey: 'immediate_campaigns' as const
  },
  {
    key: 'pending',
    label: 'Đang chờ xử lý',
    icon: Hourglass,
    colorClass: 'bg-yellow-50 text-yellow-600',
    valueKey: 'pending_campaigns' as const
  },
  {
    key: 'processing',
    label: 'Đang xử lý',
    icon: Loader,
    colorClass: 'bg-indigo-50 text-indigo-600',
    valueKey: 'processing_campaigns' as const
  },
  {
    key: 'cancelled',
    label: 'Hủy',
    icon: Ban,
    colorClass: 'bg-gray-100 text-gray-600',
    valueKey: 'cancelled_campaigns' as const
  }
];

function StatCardSkeleton() {
  return (
    <div className="bg-white rounded-xl border p-4 animate-pulse">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-7 h-7 rounded-lg bg-gray-200" />
        <div className="h-4 w-24 bg-gray-200 rounded" />
      </div>
      <div className="h-8 w-12 bg-gray-100 rounded" />
    </div>
  );
}

export function ZbsCampaignStatsCards({ stats, loading = false }: ZbsCampaignStatsCardsProps) {
  if (loading) {
    return (
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
          Tổng số lượng chiến dịch
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
        Tổng số lượng chiến dịch
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
                {value.toLocaleString('vi-VN')}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
