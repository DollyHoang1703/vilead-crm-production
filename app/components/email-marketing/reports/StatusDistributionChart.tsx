'use client';

import React from 'react';
import { PieChart, Info } from 'lucide-react';
import type { StatusDistributionItem } from '../types';
import { CHART_COLORS } from '../mockData';

interface StatusDistributionChartProps {
  data: StatusDistributionItem[];
  loading?: boolean;
}

export function StatusDistributionChart({ data, loading = false }: StatusDistributionChartProps) {
  const total = data.reduce((sum, item) => sum + item.count, 0);
  
  // Calculate pie chart segments
  const calculateSegments = () => {
    let cumulativePercent = 0;
    
    return data.map((item) => {
      const percent = total > 0 ? (item.count / total) * 100 : 0;
      const startPercent = cumulativePercent;
      cumulativePercent += percent;
      
      // Convert percent to radians for SVG arc
      const startAngle = (startPercent / 100) * 2 * Math.PI - Math.PI / 2;
      const endAngle = (cumulativePercent / 100) * 2 * Math.PI - Math.PI / 2;
      
      const largeArcFlag = percent > 50 ? 1 : 0;
      
      const radius = 80;
      const innerRadius = 50;
      const centerX = 100;
      const centerY = 100;
      
      // Outer arc
      const x1 = centerX + radius * Math.cos(startAngle);
      const y1 = centerY + radius * Math.sin(startAngle);
      const x2 = centerX + radius * Math.cos(endAngle);
      const y2 = centerY + radius * Math.sin(endAngle);
      
      // Inner arc
      const x3 = centerX + innerRadius * Math.cos(endAngle);
      const y3 = centerY + innerRadius * Math.sin(endAngle);
      const x4 = centerX + innerRadius * Math.cos(startAngle);
      const y4 = centerY + innerRadius * Math.sin(startAngle);
      
      const path = `
        M ${x1} ${y1}
        A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}
        L ${x3} ${y3}
        A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${x4} ${y4}
        Z
      `;
      
      return { ...item, path, percent };
    });
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg border p-6 animate-pulse">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-5 h-5 bg-gray-200 rounded" />
          <div className="h-6 bg-gray-200 rounded w-48" />
        </div>
        <div className="flex items-center gap-8">
          <div className="w-[200px] h-[200px] bg-gray-100 rounded-full" />
          <div className="flex-1 space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-3 h-3 bg-gray-200 rounded-full" />
                <div className="h-4 bg-gray-200 rounded w-24" />
                <div className="h-4 bg-gray-200 rounded w-16" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const segments = calculateSegments();

  return (
    <div className="bg-white rounded-lg border p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <PieChart className="h-5 w-5 text-purple-500" />
          <h3 className="text-lg font-semibold text-gray-900">Phân bố trạng thái email</h3>
        </div>
        <div className="group relative">
          <Info className="h-4 w-4 text-gray-400 cursor-help" />
          <div className="invisible group-hover:visible absolute right-0 top-6 bg-gray-900 text-white text-xs rounded-lg p-3 w-64 z-10">
            Biểu đồ hiển thị tỷ lệ phân bố các trạng thái email trong kỳ báo cáo đã chọn
          </div>
        </div>
      </div>

      {/* Chart and Legend */}
      <div className="flex flex-col md:flex-row items-center gap-8">
        {/* Donut Chart */}
        <div className="relative">
          <svg viewBox="0 0 200 200" className="w-[200px] h-[200px]">
            {segments.map((segment, i) => (
              <path
                key={i}
                d={segment.path}
                fill={segment.color}
                className="transition-opacity hover:opacity-80 cursor-pointer"
              />
            ))}
            {/* Center text */}
            <text
              x="100"
              y="95"
              textAnchor="middle"
              className="text-2xl font-bold fill-gray-900"
            >
              {total.toLocaleString('vi-VN')}
            </text>
            <text
              x="100"
              y="115"
              textAnchor="middle"
              className="text-xs fill-gray-500"
            >
              Tổng email
            </text>
          </svg>
        </div>

        {/* Legend */}
        <div className="flex-1 space-y-3">
          {segments.map((segment, i) => (
            <div 
              key={i} 
              className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: segment.color }}
                />
                <span className="text-sm text-gray-700">{segment.label}</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-gray-900">
                  {segment.count.toLocaleString('vi-VN')}
                </span>
                <span className="text-sm text-gray-500 w-12 text-right">
                  {segment.percent.toFixed(1)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default StatusDistributionChart;
