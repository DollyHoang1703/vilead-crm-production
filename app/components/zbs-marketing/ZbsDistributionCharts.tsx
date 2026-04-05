'use client';

import React from 'react';
import { PieChart } from 'lucide-react';

export interface ZbsDistributionData {
  byType: { name: string; value: number; color: string }[];
  byTemplate: { name: string; value: number; color: string }[];
}

interface ZbsDistributionChartsProps {
  data: ZbsDistributionData | null;
  loading?: boolean;
}

function PieChartSVG({ 
  data, 
  size = 200 
}: { 
  data: { name: string; value: number; color: string }[];
  size?: number;
}) {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  if (total === 0) {
    return (
      <div className="flex items-center justify-center" style={{ width: size, height: size }}>
        <div className="text-gray-400 text-sm">Không có dữ liệu</div>
      </div>
    );
  }

  const centerX = size / 2;
  const centerY = size / 2;
  const radius = size / 2 - 10;

  let currentAngle = -90; // Start from top

  const slices = data.map((item) => {
    const percentage = item.value / total;
    const angle = percentage * 360;
    const startAngle = currentAngle;
    const endAngle = currentAngle + angle;
    currentAngle = endAngle;

    // Calculate arc path
    const startRad = (startAngle * Math.PI) / 180;
    const endRad = (endAngle * Math.PI) / 180;

    const x1 = centerX + radius * Math.cos(startRad);
    const y1 = centerY + radius * Math.sin(startRad);
    const x2 = centerX + radius * Math.cos(endRad);
    const y2 = centerY + radius * Math.sin(endRad);

    const largeArc = angle > 180 ? 1 : 0;

    const path = `M ${centerX} ${centerY} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`;

    return {
      ...item,
      path,
      percentage: (percentage * 100).toFixed(1),
    };
  });

  return (
    <svg width={size} height={size}>
      {slices.map((slice, i) => (
        <path
          key={i}
          d={slice.path}
          fill={slice.color}
          stroke="white"
          strokeWidth={2}
          className="hover:opacity-80 transition-opacity cursor-pointer"
        />
      ))}
      {/* Center circle for donut effect */}
      <circle
        cx={centerX}
        cy={centerY}
        r={radius * 0.5}
        fill="white"
      />
    </svg>
  );
}

function ChartLegend({ data }: { data: { name: string; value: number; color: string }[] }) {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  
  return (
    <div className="space-y-2 mt-4">
      {data.map((item, i) => (
        <div key={i} className="flex items-center gap-2">
          <div 
            className="w-3 h-3 rounded-sm flex-shrink-0" 
            style={{ backgroundColor: item.color }} 
          />
          <span className="text-sm text-gray-600 truncate flex-1">{item.name}</span>
          <span className="text-sm font-medium text-gray-900">
            {total > 0 ? ((item.value / total) * 100).toFixed(0) : 0}%
          </span>
        </div>
      ))}
    </div>
  );
}

function ChartSkeleton() {
  return (
    <div className="bg-white rounded-xl border p-6 animate-pulse">
      <div className="h-5 w-40 bg-gray-200 rounded mb-6" />
      <div className="flex justify-center">
        <div className="w-48 h-48 rounded-full bg-gray-200" />
      </div>
      <div className="space-y-2 mt-4">
        <div className="h-4 w-full bg-gray-100 rounded" />
        <div className="h-4 w-3/4 bg-gray-100 rounded" />
      </div>
    </div>
  );
}

export function ZbsDistributionCharts({ data, loading = false }: ZbsDistributionChartsProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartSkeleton />
        <ChartSkeleton />
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* By Message Type */}
      <div className="bg-white rounded-xl border p-6">
        <div className="flex items-center gap-2 mb-4">
          <PieChart className="h-5 w-5 text-blue-600" />
          <h3 className="font-semibold text-gray-900">Thống kê lịch sử gửi tin theo loại tin</h3>
        </div>
        <div className="flex flex-col items-center">
          <PieChartSVG data={data.byType} size={200} />
          <ChartLegend data={data.byType} />
        </div>
      </div>

      {/* By Template */}
      <div className="bg-white rounded-xl border p-6">
        <div className="flex items-center gap-2 mb-4">
          <PieChart className="h-5 w-5 text-blue-600" />
          <h3 className="font-semibold text-gray-900">Thống kê lịch sử gửi tin theo mẫu tin</h3>
        </div>
        <div className="flex flex-col items-center">
          <PieChartSVG data={data.byTemplate} size={200} />
          <ChartLegend data={data.byTemplate} />
        </div>
      </div>
    </div>
  );
}
