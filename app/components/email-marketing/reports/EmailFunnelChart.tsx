'use client';

import React from 'react';
import { Filter, ArrowRight, Info } from 'lucide-react';
import type { EmailFunnel } from '../types';

interface EmailFunnelChartProps {
  funnel: EmailFunnel | null;
  loading?: boolean;
}

const STAGE_COLORS: Record<string, string> = {
  sent: '#3B82F6',      // blue
  delivered: '#10B981', // green
  opened: '#8B5CF6',    // purple
  clicked: '#F97316'    // orange
};

export function EmailFunnelChart({ funnel, loading = false }: EmailFunnelChartProps) {
  if (loading) {
    return (
      <div className="bg-white rounded-lg border p-6 animate-pulse">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-5 h-5 bg-gray-200 rounded" />
          <div className="h-6 bg-gray-200 rounded w-36" />
        </div>
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4">
              <div className="w-24 h-5 bg-gray-200 rounded" />
              <div className="flex-1 h-10 bg-gray-100 rounded-r-full" />
              <div className="w-20 h-5 bg-gray-200 rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!funnel || funnel.stages.length === 0) {
    return (
      <div className="bg-white rounded-lg border p-6">
        <div className="flex items-center gap-2 mb-6">
          <Filter className="h-5 w-5 text-blue-500" />
          <h3 className="text-lg font-semibold text-gray-900">Phễu chuyển đổi</h3>
        </div>
        <div className="text-center py-8 text-gray-500">
          Không có dữ liệu phễu
        </div>
      </div>
    );
  }

  const maxValue = funnel.stages[0]?.count || 1;

  return (
    <div className="bg-white rounded-lg border p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-blue-500" />
          <h3 className="text-lg font-semibold text-gray-900">Phễu chuyển đổi</h3>
        </div>
        <div className="group relative">
          <Info className="h-4 w-4 text-gray-400 cursor-help" />
          <div className="invisible group-hover:visible absolute right-0 top-6 bg-gray-900 text-white text-xs rounded-lg p-3 w-64 z-10">
            Phễu hiển thị hành trình của email từ lúc gửi đến khi người nhận click vào liên kết
          </div>
        </div>
      </div>

      {/* Funnel Stages */}
      <div className="space-y-4">
        {funnel.stages.map((stage, index) => {
          const widthPercent = (stage.count / maxValue) * 100;
          const stageColor = STAGE_COLORS[stage.key] || '#6B7280';
          
          return (
            <div key={stage.key} className="group">
              <div className="flex items-center gap-4">
                {/* Label */}
                <div className="w-24 flex-shrink-0">
                  <span className="text-sm font-medium text-gray-700">{stage.label}</span>
                </div>
                
                {/* Bar */}
                <div className="flex-1 relative">
                  <div className="h-10 bg-gray-100 rounded-r-full overflow-hidden">
                    <div 
                      className="h-full rounded-r-full transition-all duration-500 flex items-center justify-end pr-3"
                      style={{ 
                        width: `${Math.max(widthPercent, 5)}%`,
                        backgroundColor: stageColor
                      }}
                    >
                      <span className="text-sm font-bold text-white">
                        {stage.count.toLocaleString('vi-VN')}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Percentage */}
                <div className="w-20 text-right flex-shrink-0">
                  <span className="text-sm font-medium" style={{ color: stageColor }}>
                    {stage.rate.toFixed(1)}%
                  </span>
                </div>
              </div>

              {/* Conversion arrow between stages */}
              {index < funnel.stages.length - 1 && (
                <div className="flex items-center ml-28 my-2 text-gray-400">
                  <div className="flex-1 border-t border-dashed border-gray-300" />
                  <div className="px-2 flex items-center gap-1 text-xs">
                    <ArrowRight className="h-3 w-3" />
                    <span className="text-gray-500">
                      {((funnel.stages[index + 1].count / stage.count) * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex-1 border-t border-dashed border-gray-300" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Summary */}
      <div className="mt-6 pt-4 border-t">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">Tỷ lệ chuyển đổi tổng thể (Gửi → Click)</span>
          <span className="font-bold text-blue-600">
            {funnel.overall_conversion.toFixed(2)}%
          </span>
        </div>
      </div>
    </div>
  );
}

export default EmailFunnelChart;
