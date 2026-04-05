'use client';

import React from 'react';
import { Calendar, RefreshCw, Filter, ChevronDown } from 'lucide-react';

export interface ZbsReportFilter {
  period: 'week' | 'month' | 'quarter' | 'custom';
  startDate?: string;
  endDate?: string;
  oaId?: string;
  templateId?: string;
  messageType?: string;
}

interface ZbsReportFiltersProps {
  filters: ZbsReportFilter;
  onUpdateFilters: (filters: Partial<ZbsReportFilter>) => void;
  onApplyFilters: () => void;
  loading?: boolean;
  oaOptions?: { id: string; name: string }[];
  templateOptions?: { id: string; name: string }[];
}

const PERIOD_OPTIONS = [
  { value: 'week', label: 'Tuần này' },
  { value: 'month', label: 'Tháng này' },
  { value: 'quarter', label: 'Quý này' },
  { value: 'custom', label: 'Tùy chỉnh' },
];

const MESSAGE_TYPE_OPTIONS = [
  { value: '', label: 'Tất cả' },
  { value: 'zns_template', label: 'ZNS Template' },
  { value: 'zns_transaction', label: 'ZNS Transaction' },
];

export function ZbsReportFilters({
  filters,
  onUpdateFilters,
  onApplyFilters,
  loading = false,
  oaOptions = [],
  templateOptions = []
}: ZbsReportFiltersProps) {
  return (
    <div className="bg-white rounded-xl border p-4 space-y-4">
      {/* Period Quick Select */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">Kỳ báo cáo:</span>
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
          {PERIOD_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => onUpdateFilters({ period: option.value as ZbsReportFilter['period'] })}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                filters.period === option.value
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>

        {/* Custom Date Range */}
        {filters.period === 'custom' && (
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-500" />
            <input
              type="date"
              value={filters.startDate || ''}
              onChange={(e) => onUpdateFilters({ startDate: e.target.value })}
              className="px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <span className="text-gray-400">-</span>
            <input
              type="date"
              value={filters.endDate || ''}
              onChange={(e) => onUpdateFilters({ endDate: e.target.value })}
              className="px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        )}

        {/* Refresh Button */}
        <div className="flex-1 flex justify-end">
          <button
            onClick={onApplyFilters}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Làm mới</span>
          </button>
        </div>
      </div>

      {/* Additional Filters */}
      <div className="flex flex-wrap items-center gap-4 pt-2 border-t">
        {/* OA Filter */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">OA:</span>
          <div className="relative">
            <select
              value={filters.oaId || ''}
              onChange={(e) => onUpdateFilters({ oaId: e.target.value })}
              className="appearance-none pl-3 pr-8 py-2 text-sm border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              <option value="">Tất cả</option>
              {oaOptions.map((oa) => (
                <option key={oa.id} value={oa.id}>{oa.name}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Template Filter */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Mẫu tin:</span>
          <div className="relative">
            <select
              value={filters.templateId || ''}
              onChange={(e) => onUpdateFilters({ templateId: e.target.value })}
              className="appearance-none pl-3 pr-8 py-2 text-sm border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              <option value="">Tất cả</option>
              {templateOptions.map((t) => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>
    </div>
  );
}
