'use client';

import React from 'react';
import { Calendar, RefreshCw, Filter as FilterIcon } from 'lucide-react';
import type { ReportFilter } from '../types';
import { PERIOD_OPTIONS } from '../mockData';

interface ReportFiltersProps {
  filters: ReportFilter;
  onUpdateFilters: (filters: Partial<ReportFilter>) => void;
  onApplyFilters: () => void;
  loading?: boolean;
}

export function ReportFilters({ 
  filters, 
  onUpdateFilters, 
  onApplyFilters,
  loading = false 
}: ReportFiltersProps) {
  const handlePeriodChange = (period: ReportFilter['period']) => {
    onUpdateFilters({ period });
  };

  const handleDateChange = (field: 'start_date' | 'end_date', value: string) => {
    onUpdateFilters({ 
      period: 'custom',
      [field]: value 
    });
  };

  return (
    <div className="bg-white rounded-lg border p-4 sticky top-0 z-10">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        {/* Period Quick Select */}
        <div className="flex items-center gap-2">
          <FilterIcon className="h-4 w-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">Kỳ báo cáo:</span>
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
          {PERIOD_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => handlePeriodChange(option.value as ReportFilter['period'])}
              className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
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
          <div className="flex items-center gap-2 ml-0 sm:ml-4">
            <Calendar className="h-4 w-4 text-gray-500" />
            <input
              type="date"
              value={filters.start_date || ''}
              onChange={(e) => handleDateChange('start_date', e.target.value)}
              className="px-3 py-1.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <span className="text-gray-400">-</span>
            <input
              type="date"
              value={filters.end_date || ''}
              onChange={(e) => handleDateChange('end_date', e.target.value)}
              className="px-3 py-1.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        )}

        {/* Apply / Refresh Button */}
        <div className="flex-1 flex justify-end">
          <button
            onClick={onApplyFilters}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-1.5 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            <span>{loading ? 'Đang tải...' : 'Làm mới'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default ReportFilters;
