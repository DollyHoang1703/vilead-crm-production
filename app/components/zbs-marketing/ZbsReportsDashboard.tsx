'use client';

import React, { useState } from 'react';
import { Download, BarChart3 } from 'lucide-react';
import { ZbsReportFilters, type ZbsReportFilter } from './ZbsReportFilters';
import { ZbsOverviewStatsCards, type ZbsOverviewStats } from './ZbsOverviewStatsCards';
import { ZbsCampaignStatsCards, type ZbsCampaignStats } from './ZbsCampaignStatsCards';
import { ZbsSpendingTrendChart, type ZbsSpendingTrendPoint } from './ZbsSpendingTrendChart';
import { ZbsSendResultChart, type ZbsSendResultPoint } from './ZbsSendResultChart';
import { ZbsDistributionCharts, type ZbsDistributionData } from './ZbsDistributionCharts';
import { ZbsExportReportModal } from './ZbsExportReportModal';

// Mock Data
const mockOaOptions = [
  { id: 'oa-1', name: 'eEvent' },
  { id: 'oa-2', name: 'CCycle AI - Marketing và CSKH' },
];

const mockTemplateOptions = [
  { id: 't-1', name: 'TEST - Tra cứu hóa đơn GTGT' },
  { id: 't-2', name: 'Thông báo thanh toán dịch vụ' },
  { id: 't-3', name: 'Thông báo xác nhận đơn hàng' },
];

const mockOverviewStats: ZbsOverviewStats = {
  total_spending: 800,
  total_sent: 5,
  total_charged: 3,
  total_free: 2,
  total_success: 3,
  total_failed: 2,
  spending_trend: { value: 12.5, direction: 'up' },
  sent_trend: { value: 8.3, direction: 'up' },
  charged_trend: { value: 5.2, direction: 'up' },
  free_trend: { value: 3.1, direction: 'down' },
  success_trend: { value: 10.0, direction: 'up' },
  failed_trend: { value: 15.5, direction: 'down' },
};

const mockCampaignStats: ZbsCampaignStats = {
  total_campaigns: 2,
  scheduled_campaigns: 0,
  immediate_campaigns: 2,
  pending_campaigns: 0,
  processing_campaigns: 0,
  cancelled_campaigns: 0,
};

const mockSpendingTrend: ZbsSpendingTrendPoint[] = [
  { date: '30-03', total_spending: 0, zns_count: 0 },
  { date: '31-03', total_spending: 0, zns_count: 0 },
  { date: '01-04', total_spending: 2400, zns_count: 8 },
  { date: '02-04', total_spending: 1200, zns_count: 4 },
  { date: '03-04', total_spending: 900, zns_count: 3 },
  { date: '04-04', total_spending: 300, zns_count: 1 },
  { date: '05-04', total_spending: 5000, zns_count: 17 },
];

const mockSendResults: ZbsSendResultPoint[] = [
  { date: '30-03', success: 0, failed: 0 },
  { date: '31-03', success: 0, failed: 0 },
  { date: '01-04', success: 1, failed: 0 },
  { date: '02-04', success: 0, failed: 0 },
  { date: '03-04', success: 0, failed: 0 },
  { date: '04-04', success: 0, failed: 0 },
  { date: '05-04', success: 4, failed: 2 },
];

const mockDistributionData: ZbsDistributionData = {
  byType: [
    { name: 'ZNS Template', value: 5, color: '#3B82F6' },
  ],
  byTemplate: [
    { name: 'TEST - Tra cứu hóa đơn GTGT', value: 2, color: '#3B82F6' },
    { name: 'Thông báo thanh toán dịch vụ', value: 2, color: '#10B981' },
    { name: 'Thông báo xác nhận đơn hàng', value: 1, color: '#F59E0B' },
  ],
};

export function ZbsReportsDashboard() {
  const [filters, setFilters] = useState<ZbsReportFilter>({
    period: 'month',
  });
  const [loading, setLoading] = useState(false);
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [trendInterval, setTrendInterval] = useState<'day' | 'week' | 'month'>('day');

  const handleUpdateFilters = (newFilters: Partial<ZbsReportFilter>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const handleApplyFilters = () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => setLoading(false), 1000);
  };

  const handleExport = (reportTypes: ('overview' | 'campaigns' | 'messages')[], format: 'xlsx' | 'csv') => {
    console.log('Exporting report:', reportTypes, 'as:', format);
    // Export logic here
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <BarChart3 className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Báo cáo & Thống kê ZBS</h2>
            <p className="text-sm text-gray-500">
              Phân tích hiệu suất chiến dịch ZBS Marketing
            </p>
          </div>
        </div>
        
        <button
          onClick={() => setExportModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors shadow-sm"
        >
          <Download className="h-4 w-4" />
          <span>Xuất báo cáo</span>
        </button>
      </div>

      {/* Filters */}
      <ZbsReportFilters
        filters={filters}
        onUpdateFilters={handleUpdateFilters}
        onApplyFilters={handleApplyFilters}
        loading={loading}
        oaOptions={mockOaOptions}
        templateOptions={mockTemplateOptions}
      />

      {/* Overview Stats */}
      <ZbsOverviewStatsCards
        stats={mockOverviewStats}
        loading={loading}
      />

      {/* Campaign Stats */}
      <ZbsCampaignStatsCards
        stats={mockCampaignStats}
        loading={loading}
      />

      {/* Spending Trend Chart */}
      <ZbsSpendingTrendChart
        data={mockSpendingTrend}
        loading={loading}
        interval={trendInterval}
        onIntervalChange={setTrendInterval}
      />

      {/* Send Result Chart */}
      <ZbsSendResultChart
        data={mockSendResults}
        loading={loading}
      />

      {/* Distribution Charts */}
      <ZbsDistributionCharts
        data={mockDistributionData}
        loading={loading}
      />

      {/* Export Modal */}
      <ZbsExportReportModal
        open={exportModalOpen}
        onClose={() => setExportModalOpen(false)}
        onExport={handleExport}
      />
    </div>
  );
}
