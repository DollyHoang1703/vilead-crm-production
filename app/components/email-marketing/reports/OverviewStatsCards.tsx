'use client';

import React from 'react';
import { 
  Send, 
  Mail, 
  MousePointer, 
  AlertTriangle, 
  UserX,
  TrendingUp,
  TrendingDown,
  Minus,
  CheckCircle
} from 'lucide-react';
import type { EmailMarketingOverview } from '../types';

interface OverviewStatsCardsProps {
  overview: EmailMarketingOverview | null;
  loading?: boolean;
}

const STAT_CONFIGS = [
  {
    key: 'sent' as const,
    label: 'Tổng email gửi',
    icon: Send,
    colorClass: 'bg-blue-50 text-blue-600',
    valueKey: 'total_sent' as const,
    trendKey: 'sent_trend' as const,
    format: 'number'
  },
  {
    key: 'delivered' as const,
    label: 'Tỷ lệ gửi thành công',
    icon: CheckCircle,
    colorClass: 'bg-green-50 text-green-600',
    valueKey: 'delivery_rate' as const,
    trendKey: 'delivery_trend' as const,
    format: 'percent'
  },
  {
    key: 'opened' as const,
    label: 'Tỷ lệ mở',
    icon: Mail,
    colorClass: 'bg-purple-50 text-purple-600',
    valueKey: 'open_rate' as const,
    trendKey: 'open_trend' as const,
    format: 'percent'
  },
  {
    key: 'clicked' as const,
    label: 'Tỷ lệ click',
    icon: MousePointer,
    colorClass: 'bg-orange-50 text-orange-600',
    valueKey: 'click_rate' as const,
    trendKey: 'click_trend' as const,
    format: 'percent'
  },
  {
    key: 'bounced' as const,
    label: 'Tỷ lệ bounce',
    icon: AlertTriangle,
    colorClass: 'bg-red-50 text-red-600',
    valueKey: 'bounce_rate' as const,
    trendKey: 'bounce_trend' as const,
    format: 'percent',
    invertTrend: true
  },
  {
    key: 'unsubscribed' as const,
    label: 'Tỷ lệ huỷ đăng ký',
    icon: UserX,
    colorClass: 'bg-gray-50 text-gray-600',
    valueKey: 'unsubscribe_rate' as const,
    trendKey: 'unsubscribe_trend' as const,
    format: 'percent',
    invertTrend: true
  }
];

function formatValue(value: number, format: string): string {
  if (format === 'percent') {
    return `${value.toFixed(1)}%`;
  }
  return value.toLocaleString('vi-VN');
}

function getTrendIcon(trend: { value: number; direction: 'up' | 'down' | 'neutral' }, invertTrend?: boolean) {
  const { direction } = trend;
  
  if (direction === 'neutral') {
    return <Minus className="h-3 w-3 text-gray-400" />;
  }
  
  const isPositive = invertTrend 
    ? direction === 'down' 
    : direction === 'up';
  
  if (direction === 'up') {
    return <TrendingUp className={`h-3 w-3 ${isPositive ? 'text-green-500' : 'text-red-500'}`} />;
  }
  
  return <TrendingDown className={`h-3 w-3 ${isPositive ? 'text-green-500' : 'text-red-500'}`} />;
}

function getTrendColorClass(trend: { value: number; direction: 'up' | 'down' | 'neutral' }, invertTrend?: boolean) {
  const { direction } = trend;
  
  if (direction === 'neutral') return 'text-gray-500 bg-gray-100';
  
  const isPositive = invertTrend 
    ? direction === 'down' 
    : direction === 'up';
  
  return isPositive 
    ? 'text-green-600 bg-green-50' 
    : 'text-red-600 bg-red-50';
}

export function OverviewStatsCards({ overview, loading = false }: OverviewStatsCardsProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-white rounded-lg border p-4 animate-pulse">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-gray-200 rounded-lg" />
              <div className="h-4 bg-gray-200 rounded w-20" />
            </div>
            <div className="h-8 bg-gray-200 rounded w-16 mb-2" />
            <div className="h-4 bg-gray-200 rounded w-12" />
          </div>
        ))}
      </div>
    );
  }

  if (!overview) {
    return (
      <div className="bg-white rounded-lg border p-8 text-center text-gray-500">
        Không có dữ liệu tổng quan
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {STAT_CONFIGS.map((config) => {
        const Icon = config.icon;
        const value = overview[config.valueKey];
        const trend = overview[config.trendKey];
        
        return (
          <div 
            key={config.key} 
            className="bg-white rounded-lg border p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-2 mb-3">
              <div className={`p-2 rounded-lg ${config.colorClass}`}>
                <Icon className="h-4 w-4" />
              </div>
              <span className="text-xs text-gray-500 truncate">{config.label}</span>
            </div>
            
            <div className="text-2xl font-bold text-gray-900 mb-2">
              {formatValue(value, config.format)}
            </div>
            
            {trend && (
              <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs ${getTrendColorClass(trend, config.invertTrend)}`}>
                {getTrendIcon(trend, config.invertTrend)}
                <span>{trend.value > 0 ? '+' : ''}{trend.value.toFixed(1)}%</span>
                <span className="text-gray-400 ml-1">vs tháng trước</span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default OverviewStatsCards;
