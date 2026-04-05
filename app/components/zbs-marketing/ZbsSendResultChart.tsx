'use client';

import React from 'react';
import { BarChart3 } from 'lucide-react';

export interface ZbsSendResultPoint {
  date: string;
  success: number;
  failed: number;
}

interface ZbsSendResultChartProps {
  data: ZbsSendResultPoint[];
  loading?: boolean;
}

export function ZbsSendResultChart({ data, loading = false }: ZbsSendResultChartProps) {
  const chartHeight = 260;
  const chartWidth = 800;
  const padding = { top: 30, right: 40, bottom: 50, left: 60 };
  
  const innerWidth = chartWidth - padding.left - padding.right;
  const innerHeight = chartHeight - padding.top - padding.bottom;

  // Calculate max value
  const maxValue = Math.max(...data.map(d => d.success + d.failed), 1);

  // Bar calculations
  const barWidth = data.length > 0 ? Math.min(50, (innerWidth / data.length) * 0.7) : 50;
  const barGap = data.length > 0 ? (innerWidth - barWidth * data.length) / (data.length + 1) : 0;

  const getBarX = (index: number) => padding.left + barGap + index * (barWidth + barGap);

  // Y-axis ticks
  const yTicks = [0, maxValue * 0.25, maxValue * 0.5, maxValue * 0.75, maxValue].map(Math.round);

  if (loading) {
    return (
      <div className="bg-white rounded-xl border p-6">
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 className="h-5 w-5 text-gray-400" />
          <h3 className="font-semibold text-gray-900">Kết quả gửi tin</h3>
        </div>
        <div className="h-64 flex items-center justify-center">
          <div className="animate-pulse text-gray-400">Đang tải dữ liệu...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-blue-600" />
          <h3 className="font-semibold text-gray-900">Kết quả gửi tin</h3>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-4 h-3 bg-green-500 rounded-sm" />
            <span className="text-sm text-gray-600">Thành công</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-3 bg-red-500 rounded-sm" />
            <span className="text-sm text-gray-600">Thất bại</span>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="overflow-x-auto">
        <svg width={chartWidth} height={chartHeight} className="mx-auto">
          {/* Grid lines */}
          {yTicks.map((tick, i) => {
            const y = padding.top + innerHeight - (tick / maxValue) * innerHeight;
            return (
              <g key={i}>
                <line
                  x1={padding.left}
                  y1={y}
                  x2={chartWidth - padding.right}
                  y2={y}
                  stroke="#E5E7EB"
                  strokeDasharray="4,4"
                />
                <text
                  x={padding.left - 10}
                  y={y + 4}
                  textAnchor="end"
                  className="text-xs fill-gray-500"
                >
                  {tick}
                </text>
              </g>
            );
          })}

          {/* Stacked Bars */}
          {data.map((point, i) => {
            const x = getBarX(i);
            const successHeight = (point.success / maxValue) * innerHeight;
            const failedHeight = (point.failed / maxValue) * innerHeight;
            
            const successY = padding.top + innerHeight - successHeight;
            const failedY = successY - failedHeight;
            
            return (
              <g key={i}>
                {/* Success bar (bottom) */}
                <rect
                  x={x}
                  y={successY}
                  width={barWidth}
                  height={successHeight}
                  fill="#22C55E"
                  rx={2}
                  className="hover:fill-green-600 transition-colors cursor-pointer"
                />
                {/* Failed bar (top) */}
                {point.failed > 0 && (
                  <rect
                    x={x}
                    y={failedY}
                    width={barWidth}
                    height={failedHeight}
                    fill="#EF4444"
                    rx={2}
                    className="hover:fill-red-600 transition-colors cursor-pointer"
                  />
                )}
                {/* X-axis label */}
                <text
                  x={x + barWidth / 2}
                  y={chartHeight - padding.bottom + 20}
                  textAnchor="middle"
                  className="text-xs fill-gray-500"
                >
                  {point.date}
                </text>
              </g>
            );
          })}

          {/* Axis lines */}
          <line
            x1={padding.left}
            y1={padding.top}
            x2={padding.left}
            y2={padding.top + innerHeight}
            stroke="#E5E7EB"
          />
          <line
            x1={padding.left}
            y1={padding.top + innerHeight}
            x2={chartWidth - padding.right}
            y2={padding.top + innerHeight}
            stroke="#E5E7EB"
          />
        </svg>
      </div>
    </div>
  );
}
