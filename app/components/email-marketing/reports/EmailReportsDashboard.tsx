'use client';

import React from 'react';
import { Download, BarChart3 } from 'lucide-react';

import { useEmailReports } from '../hooks';
import { OverviewStatsCards } from './OverviewStatsCards';
import { TrendChart } from './TrendChart';
import { StatusDistributionChart } from './StatusDistributionChart';
import { EmailFunnelChart } from './EmailFunnelChart';
import { CampaignComparisonTable } from './CampaignComparisonTable';
import { UnsubscribeSection } from './UnsubscribeSection';
import { ExportReportModal } from './ExportReportModal';
import { ReportFilters } from './ReportFilters';

interface EmailReportsDashboardProps {
  onViewCampaign?: (campaignId: string) => void;
}

export function EmailReportsDashboard({ onViewCampaign }: EmailReportsDashboardProps) {
  const {
    // Filters
    filters,
    updateFilters,
    applyFilters,
    
    // Overview
    overview,
    overviewLoading,
    
    // Trend
    trendData,
    trendLoading,
    trendInterval,
    trendVisibleMetrics,
    setTrendInterval,
    toggleTrendMetric,
    
    // Funnel
    funnel,
    funnelLoading,
    
    // Status Distribution
    statusDistribution,
    statusDistributionLoading,
    
    // Campaigns
    campaigns,
    campaignsLoading,
    campaignsSort,
    campaignsPagination,
    sortCampaigns,
    setCampaignsPage,
    
    // Unsubscribes
    unsubscribes,
    unsubscribesLoading,
    unsubscribesSearch,
    unsubscribesTrend,
    unsubscribesPagination,
    setUnsubscribesSearch,
    setUnsubscribesPage,
    
    // Export
    exportModalOpen,
    exporting,
    setExportModalOpen,
    exportReport
  } = useEmailReports();

  const isAnyLoading = overviewLoading || trendLoading || funnelLoading || 
    statusDistributionLoading || campaignsLoading || unsubscribesLoading;

  return (
    <div className="space-y-6">
      {/* Header with title and export button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <BarChart3 className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Báo cáo & Thống kê Email</h2>
            <p className="text-sm text-gray-500">
              Phân tích hiệu suất chiến dịch email marketing
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
      <ReportFilters 
        filters={filters}
        onUpdateFilters={updateFilters}
        onApplyFilters={applyFilters}
        loading={isAnyLoading}
      />

      {/* Overview Stats Cards */}
      <OverviewStatsCards 
        overview={overview}
        loading={overviewLoading}
      />

      {/* Trend Chart (Full Width) */}
      <TrendChart
        data={trendData}
        loading={trendLoading}
        interval={trendInterval}
        visibleMetrics={trendVisibleMetrics}
        onIntervalChange={setTrendInterval}
        onToggleMetric={toggleTrendMetric}
      />

      {/* Funnel and Status Distribution (Side by Side) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <EmailFunnelChart
          funnel={funnel}
          loading={funnelLoading}
        />
        <StatusDistributionChart
          data={statusDistribution}
          loading={statusDistributionLoading}
        />
      </div>

      {/* Campaign Comparison Table (Full Width) */}
      <CampaignComparisonTable
        campaigns={campaigns}
        loading={campaignsLoading}
        sort={campaignsSort}
        pagination={campaignsPagination}
        onSort={sortCampaigns}
        onPageChange={setCampaignsPage}
        onViewCampaign={onViewCampaign}
      />

      {/* Unsubscribe Section (Full Width) */}
      <UnsubscribeSection
        unsubscribes={unsubscribes}
        trend={unsubscribesTrend}
        loading={unsubscribesLoading}
        search={unsubscribesSearch}
        pagination={unsubscribesPagination}
        onSearchChange={setUnsubscribesSearch}
        onPageChange={setUnsubscribesPage}
      />

      {/* Export Modal */}
      <ExportReportModal
        isOpen={exportModalOpen}
        exporting={exporting}
        onClose={() => setExportModalOpen(false)}
        onExport={exportReport}
      />
    </div>
  );
}

export default EmailReportsDashboard;
