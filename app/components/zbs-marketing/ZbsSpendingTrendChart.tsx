'use client';

import React from 'react';
import { BarChart3 } from 'lucide-react';

export interface ZbsSpendingTrendPoint {
  date: string;
  total_spending: number;
  zns_count: number;
}

interface ZbsSpendingTrendChartProps {
  data: ZbsSpendingTrendPoint[];
  loading?: boolean;
  interval: 'day' | 'week' | 'month';
  onIntervalChange: (interval: 'day' | 'week' | 'month') => void;
}

const INTERVAL_OPTIONS = [
  { value: 'day', label: 'Theo ngày' },
  { value: 'week', label: 'Theo tuần' },
  { value: 'month', label: 'Theo tháng' },
];

export function ZbsSpendingTrendChart({
  data,
  loading = false,
  interval,
  onIntervalChange
}: ZbsSpendingTrendChartProps) {
  const chartHeight = 280;
  const chartWidth = 800;
  const padding = { top: 30, right: 60, bottom: 50, left: 70 };
  
  const innerWidth = chartWidth - padding.left - padding.right;
  const innerHeight = chartHeight - padding.top - padding.bottom;

  // Calculate max values
  const maxSpending = Math.max(...data.map(d => d.total_spending), 1);
  const maxCount = Math.max(...data.map(d => d.zns_count), 1);

  // Generate bar positions and line path
  const barWidth = data.length > 0 ? Math.min(40, (innerWidth / data.length) * 0.6) : 40;
  const barGap = data.length > 0 ? (innerWidth - barWidth * data.length) / (data.length + 1) : 0;

  const getBarX = (index: number) => padding.left + barGap + index * (barWidth + barGap);
  const getBarHeight = (value: number) => (value / maxSpending) * innerHeight;

  // Line path for ZNS count
  const linePath = data.map((point, i) => {
    const x = getBarX(i) + barWidth / 2;
    const y = padding.top + innerHeight - (point.zns_count / maxCount) * innerHeight;
    return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
  }).join(' ');

  // Y-axis ticks for spending
  const spendingTicks = [0, maxSpending * 0.25, maxSpending * 0.5, maxSpending * 0.75, maxSpending];
  const countTicks = [0, maxCount * 0.5, maxCount];

  if (loading) {
    return (
      <div className="bg-white rounded-xl border p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-gray-400" />
            <h3 className="font-semibold text-gray-900">Xu hướng chi tiêu ZNS</h3>
          </div>
        </div>
        <div className="h-72 flex items-center justify-center">
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
          <h3 className="font-semibold text-gray-900">Xu hướng chi tiêu ZNS</h3>
        </div>

        {/* Legend & Interval */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-4 h-3 bg-yellow-400 rounded-sm" />
              <span className="text-sm text-gray-600">Tổng chi tiêu</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-0.5 bg-blue-500" />
              <span className="text-sm text-gray-600">ZNS thường</span>
            </div>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="overflow-x-auto">
        <svg width={chartWidth} height={chartHeight} className="mx-auto">
          {/* Grid lines */}
          {spendingTicks.map((tick, i) => {
            const y = padding.top + innerHeight - (tick / maxSpending) * innerHeight;
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
                  {tick.toLocaleString('vi-VN')}
                </text>
              </g>
            );
          })}

          {/* Right Y-axis (Count) */}
          {countTicks.map((tick, i) => {
            const y = padding.top + innerHeight - (tick / maxCount) * innerHeight;
            return (
              <text
                key={`count-${i}`}
                x={chartWidth - padding.right + 10}
                y={y + 4}
                textAnchor="start"
                className="text-xs fill-blue-500"
              >
                {tick.toFixed(1)}
              </text>
            );
          })}

          {/* Bars */}
          {data.map((point, i) => {
            const x = getBarX(i);
            const height = getBarHeight(point.total_spending);
            const y = padding.top + innerHeight - height;
            
            return (
              <g key={i}>
                <rect
                  x={x}
                  y={y}
                  width={barWidth}
                  height={height}
                  fill="#FBBF24"
                  rx={2}
                  className="hover:fill-yellow-500 transition-colors cursor-pointer"
                />
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

          {/* Line for ZNS count */}
          {linePath && (
            <>
              <path
                d={linePath}
                fill="none"
                stroke="#3B82F6"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {/* Dots on line */}
              {data.map((point, i) => {
                const x = getBarX(i) + barWidth / 2;
                const y = padding.top + innerHeight - (point.zns_count / maxCount) * innerHeight;
                return (
                  <circle
                    key={`dot-${i}`}
                    cx={x}
                    cy={y}
                    r={4}
                    fill="#3B82F6"
                    stroke="white"
                    strokeWidth={2}
                    className="cursor-pointer hover:r-6"
                  />
                );
              })}
            </>
          )}

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
