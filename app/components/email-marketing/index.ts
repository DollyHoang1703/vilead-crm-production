// Export all email marketing components and utilities

// Task 10.1 - Email Configuration
export { default as SenderEmailConfig } from './SenderEmailConfig'
export { default as EmailLimitsConfig } from './EmailLimitsConfig'
export { default as StatusBadge, PersonalEmailWarning } from './StatusBadge'
export { default as AddEmailModal } from './AddEmailModal'
export { default as EditEmailModal } from './EditEmailModal'
export { default as DeleteConfirmModal } from './DeleteConfirmModal'
export { default as LimitCard } from './LimitCard'

// Brevo Integration Components
export { default as BrevoConnectionSection } from './BrevoConnectionSection'
export { default as AddSenderModal } from './AddSenderModal'
export { default as PermissionModal } from './PermissionModal'

// Task 10.2 - Template Library
export { TemplateLibrary } from './TemplateLibrary'
export { TemplateCard, CreateNewTemplateCard } from './TemplateCard'
export { PreviewModal } from './PreviewModal'
export { TemplateEditorModal } from './TemplateEditorModal'
export { DeleteTemplateModal } from './DeleteTemplateModal'

// Task 10.5 - Reports & Statistics
export {
  EmailReportsDashboard,
  OverviewStatsCards,
  TrendChart,
  StatusDistributionChart,
  EmailFunnelChart,
  CampaignComparisonTable,
  UnsubscribeSection,
  ExportReportModal,
  ReportFilters
} from './reports'

// Export types
export * from './types'

// Export hooks
export { 
  useSenderEmails, 
  useEmailLimits, 
  useTemplates, 
  useCampaigns, 
  useCampaignEditor, 
  useEmailReports,
  // Brevo hooks
  useBrevoConnection,
  useBrevoSenders
} from './hooks'

// Export utils
export * from './utils'

// Export mock data
export { 
  MOCK_SENDER_EMAILS, 
  MOCK_EMAIL_LIMITS, 
  MOCK_USERS, 
  CURRENT_USER,
  MOCK_TEMPLATES,
  TEMPLATE_VARIABLES,
  replaceVariablesWithSample,
  // Brevo mock data
  MOCK_BREVO_CONNECTION,
  MOCK_BREVO_CONNECTION_ERROR,
  MOCK_BREVO_QUOTA,
  MOCK_BREVO_SENDER_EMAILS,
  // Task 10.5 Report mock data
  MOCK_EMAIL_OVERVIEW,
  MOCK_TREND_DATA,
  MOCK_CAMPAIGN_COMPARISON,
  MOCK_EMAIL_FUNNEL,
  MOCK_STATUS_DISTRIBUTION,
  MOCK_UNSUBSCRIBES,
  MOCK_UNSUBSCRIBE_TREND,
  EMAIL_BENCHMARKS,
  CHART_COLORS,
  PERIOD_OPTIONS,
  TREND_LINES,
  INTERVAL_OPTIONS,
  DEFAULT_REPORT_FILTER
} from './mockData'
