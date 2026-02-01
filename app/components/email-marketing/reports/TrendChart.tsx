'use client';

import React from 'react';
import { 
  TrendingUp, 
  TrendingDown,
  Calendar,
  BarChart3
} from 'lucide-react';
import type { ReportTrendDataPoint } from '../types';
import { CHART_COLORS, TREND_LINES, INTERVAL_OPTIONS } from '../mockData';

interface TrendChartProps {
  data: ReportTrendDataPoint[];
  loading?: boolean;
  interval: 'day' | 'week' | 'month';
  visibleMetrics: ('sent' | 'opened' | 'clicked')[];
  onIntervalChange: (interval: 'day' | 'week' | 'month') => void;
  onToggleMetric: (metric: 'sent' | 'opened' | 'clicked') => void;
}

export function TrendChart({ 
  data, 
  loading = false, 
  interval,
  visibleMetrics,
  onIntervalChange,
  onToggleMetric
}: TrendChartProps) {
  // Calculate chart dimensions
  const chartHeight = 280;
  const chartWidth = 800;
  const padding = { top: 20, right: 20, bottom: 40, left: 60 };
  
  // Calculate max values for each metric
  const maxSent = Math.max(...data.map(d => d.sent), 1);
  const maxOpened = Math.max(...data.map(d => d.opened), 1);
  const maxClicked = Math.max(...data.map(d => d.clicked), 1);
  
  const getMaxForMetric = (metric: 'sent' | 'opened' | 'clicked') => {
    switch (metric) {
      case 'sent': return maxSent;
      case 'opened': return maxOpened;
      case 'clicked': return maxClicked;
    }
  };

  // Generate path for line chart
  const generatePath = (metric: 'sent' | 'opened' | 'clicked') => {
    if (data.length === 0) return '';
    
    const max = getMaxForMetric(metric);
    const innerWidth = chartWidth - padding.left - padding.right;
    const innerHeight = chartHeight - padding.top - padding.bottom;
    const xStep = innerWidth / Math.max(data.length - 1, 1);
    
    return data.map((point, i) => {
      const x = padding.left + i * xStep;
      const value = point[metric];
      const y = padding.top + innerHeight - (value / max) * innerHeight;
      return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
    }).join(' ');
  };

  // Calculate trend summary
  const getTrendSummary = (metric: 'sent' | 'opened' | 'clicked') => {
    if (data.length < 2) return { value: 0, direction: 'neutral' as const };
    
    const first = data[0][metric];
    const last = data[data.length - 1][metric];
    const change = first > 0 ? ((last - first) / first) * 100 : 0;
    
    return {
      value: Math.abs(change),
      direction: change > 0 ? 'up' as const : change < 0 ? 'down' as const : 'neutral' as const
    };
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg border p-6 animate-pulse">
        <div className="flex items-center justify-between mb-6">
          <div className="h-6 bg-gray-200 rounded w-48" />
          <div className="flex gap-2">
            <div className="h-8 bg-gray-200 rounded w-20" />
            <div className="h-8 bg-gray-200 rounded w-20" />
            <div className="h-8 bg-gray-200 rounded w-20" />
          </div>
        </div>
        <div className="h-[280px] bg-gray-100 rounded" />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-blue-500" />
          <h3 className="text-lg font-semibold text-gray-900">Xu hướng gửi email</h3>
        </div>
        
        {/* Interval selector */}
        <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
          {INTERVAL_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => onIntervalChange(option.value as 'day' | 'week' | 'month')}
              className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                interval === option.value 
                  ? 'bg-white text-blue-600 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Legend / Metric toggles */}
      <div className="flex flex-wrap gap-4 mb-6">
        {TREND_LINES.map((line) => {
          const isVisible = visibleMetrics.includes(line.key as 'sent' | 'opened' | 'clicked');
          const trend = getTrendSummary(line.key as 'sent' | 'opened' | 'clicked');
          
          return (
            <button
              key={line.key}
              onClick={() => onToggleMetric(line.key as 'sent' | 'opened' | 'clicked')}
              className={`flex items-center gap-3 px-4 py-2 rounded-lg border transition-all ${
                isVisible 
                  ? 'border-gray-300 bg-white shadow-sm' 
                  : 'border-transparent bg-gray-100 opacity-50'
              }`}
            >
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: line.color }}
              />
              <span className="text-sm font-medium text-gray-700">{line.label}</span>
              {isVisible && (
                <div className={`flex items-center gap-1 text-xs ${
                  trend.direction === 'up' ? 'text-green-600' : 
                  trend.direction === 'down' ? 'text-red-600' : 'text-gray-500'
                }`}>
                  {trend.direction === 'up' && <TrendingUp className="h-3 w-3" />}
                  {trend.direction === 'down' && <TrendingDown className="h-3 w-3" />}
                  <span>{trend.value.toFixed(1)}%</span>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Chart */}
      {data.length === 0 ? (
        <div className="h-[280px] flex items-center justify-center text-gray-500">
          <div className="text-center">
            <Calendar className="h-12 w-12 mx-auto mb-3 text-gray-300" />
            <p>Không có dữ liệu trong khoảng thời gian này</p>
          </div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <svg 
            viewBox={`0 0 ${chartWidth} ${chartHeight}`} 
            className="w-full min-w-[600px]"
            preserveAspectRatio="xMidYMid meet"
          >
            {/* Grid lines */}
            {[0, 1, 2, 3, 4].map((i) => {
              const y = padding.top + (i * (chartHeight - padding.top - padding.bottom)) / 4;
              return (
                <line
                  key={i}
                  x1={padding.left}
                  y1={y}
                  x2={chartWidth - padding.right}
                  y2={y}
                  stroke="#e5e7eb"
                  strokeDasharray="4,4"
                />
              );
            })}

            {/* Data lines */}
            {TREND_LINES.map((line) => {
              const metric = line.key as 'sent' | 'opened' | 'clicked';
              if (!visibleMetrics.includes(metric)) return null;
              
              return (
                <path
                  key={line.key}
                  d={generatePath(metric)}
                  fill="none"
                  stroke={line.color}
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              );
            })}

            {/* Data points */}
            {visibleMetrics.map((metric) => {
              const config = TREND_LINES.find(l => l.key === metric);
              if (!config) return null;
              
              const max = getMaxForMetric(metric);
              const innerWidth = chartWidth - padding.left - padding.right;
              const innerHeight = chartHeight - padding.top - padding.bottom;
              const xStep = innerWidth / Math.max(data.length - 1, 1);
              
              return data.map((point, i) => {
                const x = padding.left + i * xStep;
                const value = point[metric];
                const y = padding.top + innerHeight - (value / max) * innerHeight;
                
                return (
                  <g key={`${metric}-${i}`}>
                    <circle
                      cx={x}
                      cy={y}
                      r={4}
                      fill="white"
                      stroke={config.color}
                      strokeWidth={2}
                    />
                    {/* Tooltip on hover would go here in a real implementation */}
                  </g>
                );
              });
            })}

            {/* X-axis labels */}
            {data.map((point, i) => {
              const innerWidth = chartWidth - padding.left - padding.right;
              const xStep = innerWidth / Math.max(data.length - 1, 1);
              const x = padding.left + i * xStep;
              
              // Only show some labels to avoid crowding
              if (data.length > 7 && i % 2 !== 0) return null;
              
              return (
                <text
                  key={i}
                  x={x}
                  y={chartHeight - 10}
                  textAnchor="middle"
                  className="text-xs fill-gray-500"
                >
                  {point.label}
                </text>
              );
            })}
          </svg>
        </div>
      )}
    </div>
  );
}

export default TrendChart;
