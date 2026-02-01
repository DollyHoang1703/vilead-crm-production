// ==================== HOOKS FOR EMAIL MARKETING ====================
// State management for sender emails, email limits, templates, and campaigns

import { useState, useCallback, useMemo, useEffect } from 'react';
import { 
  SenderEmail, 
  EmailLimits, 
  SenderEmailStatus, 
  SenderEmailsFilters,
  AddEmailFormData,
  EditEmailFormData,
  EmailUsage,
  Pagination,
  EmailTemplate,
  TemplatesFilters,
  CreateTemplateFormData,
  EditTemplateFormData,
  Campaign,
  CampaignStatus,
  CampaignType,
  CampaignsFilters,
  StatusCounts,
  CampaignFormData,
  CampaignChecklist,
  RecipientFilter,
  RecipientsPreview,
  SendType,
  BatchSchedule,
  Attachment,
  // Task 10.5 types
  EmailMarketingOverview,
  ReportTrendDataPoint,
  CampaignComparisonRow,
  EmailFunnel,
  StatusDistributionItem,
  UnsubscribeEntry,
  ReportFilter
} from './types';
import { 
  MOCK_SENDER_EMAILS, 
  MOCK_EMAIL_LIMITS, 
  MOCK_TEMPLATES,
  MOCK_CAMPAIGNS,
  MOCK_RECIPIENTS_PREVIEW,
  DEFAULT_RECIPIENT_FILTER,
  CURRENT_USER,
  // Task 10.5 Report mock data
  MOCK_EMAIL_OVERVIEW,
  MOCK_TREND_DATA,
  MOCK_CAMPAIGN_COMPARISON,
  MOCK_EMAIL_FUNNEL,
  MOCK_STATUS_DISTRIBUTION,
  MOCK_UNSUBSCRIBES,
  MOCK_UNSUBSCRIBE_TREND,
  DEFAULT_REPORT_FILTER
} from './mockData';
import { generateId, formatTimeRemaining, hasPermissionToUse } from './utils';

// ==================== USE SENDER EMAILS HOOK ====================
export function useSenderEmails() {
  const [emails, setEmails] = useState<SenderEmail[]>(MOCK_SENDER_EMAILS);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<SenderEmailsFilters>({
    search: '',
    status: 'all'
  });
  const [selectedEmail, setSelectedEmail] = useState<SenderEmail | null>(null);
  
  // Modal states
  const [modals, setModals] = useState({
    add: false,
    edit: false,
    delete: false,
    resendVerification: false
  });

  // Pagination
  const [pagination, setPagination] = useState<Pagination>({
    total: MOCK_SENDER_EMAILS.length,
    page: 1,
    limit: 20,
    total_pages: 1
  });

  // Filter emails
  const filteredEmails = useMemo(() => {
    return emails.filter(email => {
      // Filter by search
      const matchesSearch = filters.search === '' || 
        email.email.toLowerCase().includes(filters.search.toLowerCase()) ||
        email.sender_name.toLowerCase().includes(filters.search.toLowerCase());
      
      // Filter by status
      const matchesStatus = filters.status === 'all' || email.status === filters.status;
      
      // Filter out deleted emails
      const notDeleted = email.deleted_at === null;
      
      return matchesSearch && matchesStatus && notDeleted;
    });
  }, [emails, filters]);

  // Update filters
  const updateFilters = useCallback((newFilters: Partial<SenderEmailsFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  // Toggle modal
  const toggleModal = useCallback((modal: keyof typeof modals, open: boolean) => {
    setModals(prev => ({ ...prev, [modal]: open }));
  }, []);

  // Add email
  const addEmail = useCallback(async (data: AddEmailFormData): Promise<{ success: boolean; message: string }> => {
    setLoading(true);
    setError(null);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Check if email already exists
    const emailExists = emails.some(e => e.email.toLowerCase() === data.email.toLowerCase() && e.deleted_at === null);
    if (emailExists) {
      setLoading(false);
      return { success: false, message: 'Email này đã tồn tại trong hệ thống' };
    }
    
    const newEmail: SenderEmail = {
      id: generateId(),
      email: data.email,
      sender_name: data.sender_name,
      status: 'pending',
      permission_type: data.permission_type,
      permitted_user_ids: data.permitted_user_ids,
      verification_token: generateId(),
      verification_expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      verification_sent_count: 1,
      verification_last_sent_at: new Date(),
      created_by: CURRENT_USER.id,
      created_at: new Date(),
      updated_at: new Date(),
      deleted_at: null
    };
    
    setEmails(prev => [newEmail, ...prev]);
    setPagination(prev => ({ ...prev, total: prev.total + 1 }));
    setLoading(false);
    toggleModal('add', false);
    
    return { success: true, message: `Đã gửi email xác thực đến ${data.email}` };
  }, [emails, toggleModal]);

  // Update email
  const updateEmail = useCallback(async (id: string, data: EditEmailFormData): Promise<{ success: boolean; message: string }> => {
    setLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setEmails(prev => prev.map(email => {
      if (email.id === id) {
        return {
          ...email,
          sender_name: data.sender_name,
          permission_type: data.permission_type,
          permitted_user_ids: data.permitted_user_ids,
          updated_at: new Date()
        };
      }
      return email;
    }));
    
    setLoading(false);
    toggleModal('edit', false);
    setSelectedEmail(null);
    
    return { success: true, message: 'Cập nhật thành công' };
  }, [toggleModal]);

  // Delete email
  const deleteEmail = useCallback(async (id: string): Promise<{ success: boolean; message: string }> => {
    setLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Soft delete
    setEmails(prev => prev.map(email => {
      if (email.id === id) {
        return { ...email, deleted_at: new Date() };
      }
      return email;
    }));
    
    setPagination(prev => ({ ...prev, total: prev.total - 1 }));
    setLoading(false);
    toggleModal('delete', false);
    setSelectedEmail(null);
    
    return { success: true, message: 'Đã xóa email thành công' };
  }, [toggleModal]);

  // Resend verification
  const resendVerification = useCallback(async (id: string): Promise<{ success: boolean; message: string; remainingAttempts?: number }> => {
    const email = emails.find(e => e.id === id);
    
    if (!email) {
      return { success: false, message: 'Không tìm thấy email' };
    }
    
    if (email.verification_sent_count >= 5) {
      return { success: false, message: 'Đã vượt quá 5 lần gửi/ngày. Vui lòng thử lại vào ngày mai.' };
    }
    
    setLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setEmails(prev => prev.map(e => {
      if (e.id === id) {
        return {
          ...e,
          verification_token: generateId(),
          verification_expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000),
          verification_sent_count: e.verification_sent_count + 1,
          verification_last_sent_at: new Date()
        };
      }
      return e;
    }));
    
    setLoading(false);
    
    const remainingAttempts = 5 - (email.verification_sent_count + 1);
    return { 
      success: true, 
      message: `Đã gửi lại email xác thực. Còn ${remainingAttempts} lần gửi trong ngày.`,
      remainingAttempts
    };
  }, [emails]);

  // Disable email
  const disableEmail = useCallback(async (id: string): Promise<{ success: boolean; message: string }> => {
    setLoading(true);
    
    await new Promise(resolve => setTimeout(resolve, 300));
    
    setEmails(prev => prev.map(email => {
      if (email.id === id) {
        return { ...email, status: 'disabled' as SenderEmailStatus, updated_at: new Date() };
      }
      return email;
    }));
    
    setLoading(false);
    return { success: true, message: 'Đã vô hiệu hóa email' };
  }, []);

  // Enable email
  const enableEmail = useCallback(async (id: string): Promise<{ success: boolean; message: string }> => {
    setLoading(true);
    
    await new Promise(resolve => setTimeout(resolve, 300));
    
    setEmails(prev => prev.map(email => {
      if (email.id === id) {
        return { ...email, status: 'activated' as SenderEmailStatus, updated_at: new Date() };
      }
      return email;
    }));
    
    setLoading(false);
    return { success: true, message: 'Đã kích hoạt lại email' };
  }, []);

  // Check permission for current user
  const checkPermission = useCallback((email: SenderEmail): boolean => {
    return hasPermissionToUse(email, CURRENT_USER.id);
  }, []);

  // Set page
  const setPage = useCallback((page: number) => {
    setPagination(prev => ({ ...prev, page }));
  }, []);

  // Calculate paginated emails
  const paginatedEmails = useMemo(() => {
    const startIndex = (pagination.page - 1) * pagination.limit;
    const endIndex = startIndex + pagination.limit;
    return filteredEmails.slice(startIndex, endIndex);
  }, [filteredEmails, pagination.page, pagination.limit]);

  // Update total pages when filtered emails change
  useMemo(() => {
    const totalPages = Math.max(1, Math.ceil(filteredEmails.length / pagination.limit));
    if (totalPages !== pagination.total_pages) {
      setPagination(prev => ({ ...prev, total: filteredEmails.length, total_pages: totalPages }));
    }
  }, [filteredEmails.length, pagination.limit, pagination.total_pages]);

  return {
    emails: paginatedEmails,
    allEmails: emails,
    totalFiltered: filteredEmails.length,
    loading,
    error,
    filters,
    selectedEmail,
    modals,
    pagination,
    currentUser: CURRENT_USER,
    updateFilters,
    toggleModal,
    setSelectedEmail,
    addEmail,
    updateEmail,
    deleteEmail,
    resendVerification,
    disableEmail,
    enableEmail,
    checkPermission,
    setPage
  };
}

// ==================== USE EMAIL LIMITS HOOK ====================
export function useEmailLimits() {
  const [config, setConfig] = useState<EmailLimits>(MOCK_EMAIL_LIMITS);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Calculate usage
  const usage: EmailUsage = useMemo(() => {
    const dailyPercentage = Math.round((config.daily_used / config.daily_limit) * 100);
    const monthlyPercentage = Math.round((config.monthly_used / config.monthly_limit) * 100);
    
    return {
      daily: { 
        used: config.daily_used, 
        limit: config.daily_limit, 
        percentage: dailyPercentage 
      },
      monthly: { 
        used: config.monthly_used, 
        limit: config.monthly_limit, 
        percentage: monthlyPercentage 
      },
      reset_daily_in: formatTimeRemaining(config.daily_reset_at),
      reset_monthly_in: formatTimeRemaining(config.monthly_reset_at)
    };
  }, [config]);

  // Update config
  const updateConfig = useCallback(async (updates: Partial<EmailLimits>): Promise<{ success: boolean; message: string }> => {
    setSaving(true);
    setError(null);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setConfig(prev => ({
      ...prev,
      ...updates,
      updated_at: new Date(),
      updated_by: CURRENT_USER.id
    }));
    
    setSaving(false);
    return { success: true, message: 'Đã lưu thay đổi' };
  }, []);

  return {
    config,
    usage,
    loading,
    saving,
    error,
    updateConfig
  };
}

// ==================== USE TEMPLATES HOOK ====================
export function useTemplates() {
  const [templates, setTemplates] = useState<EmailTemplate[]>(MOCK_TEMPLATES);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'system' | 'user'>('system');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null);

  // Modal states
  const [modals, setModals] = useState({
    preview: false,
    editor: false,
    delete: false,
    importHtml: false
  });

  // Editor state
  const [editorMode, setEditorMode] = useState<'create' | 'edit' | 'clone'>('create');
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');

  // Pagination
  const [pagination, setPagination] = useState<Pagination>({
    total: MOCK_TEMPLATES.length,
    page: 1,
    limit: 12,
    total_pages: 1
  });

  // Filter templates by tab and search
  const filteredTemplates = useMemo(() => {
    return templates.filter(template => {
      const matchesTab = template.type === activeTab;
      const matchesSearch = searchQuery === '' ||
        template.name.toLowerCase().includes(searchQuery.toLowerCase());
      const notDeleted = template.deleted_at === null;

      return matchesTab && matchesSearch && notDeleted;
    });
  }, [templates, activeTab, searchQuery]);

  // Toggle modal
  const toggleModal = useCallback((modal: keyof typeof modals, open: boolean) => {
    setModals(prev => ({ ...prev, [modal]: open }));
  }, []);

  // Open preview modal
  const openPreview = useCallback((template: EmailTemplate) => {
    setSelectedTemplate(template);
    setPreviewMode('desktop');
    toggleModal('preview', true);
  }, [toggleModal]);

  // Open editor for new template
  const openCreateEditor = useCallback(() => {
    setSelectedTemplate(null);
    setEditorMode('create');
    toggleModal('editor', true);
  }, [toggleModal]);

  // Open editor for editing
  const openEditEditor = useCallback((template: EmailTemplate) => {
    setSelectedTemplate(template);
    setEditorMode('edit');
    toggleModal('editor', true);
  }, [toggleModal]);

  // Open editor for cloning
  const openCloneEditor = useCallback((template: EmailTemplate) => {
    setSelectedTemplate(template);
    setEditorMode('clone');
    toggleModal('editor', true);
  }, [toggleModal]);

  // Open delete confirmation
  const openDeleteConfirm = useCallback((template: EmailTemplate) => {
    setSelectedTemplate(template);
    toggleModal('delete', true);
  }, [toggleModal]);

  // Create template
  const createTemplate = useCallback(async (data: CreateTemplateFormData): Promise<{ success: boolean; message: string; template?: EmailTemplate }> => {
    setLoading(true);

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const newTemplate: EmailTemplate = {
      id: generateId(),
      name: data.name,
      type: 'user',
      content_html: data.content_html,
      content_json: data.content_json || null,
      editor_mode: data.editor_mode || 'richtext',
      thumbnail_url: '/templates/thumbnails/user/custom.png',
      owner_id: CURRENT_USER.id,
      category_id: null,
      version: 1,
      versions: [],
      usage_count: 0,
      created_at: new Date(),
      updated_at: new Date(),
      deleted_at: null
    };

    setTemplates(prev => [newTemplate, ...prev]);
    setPagination(prev => ({ ...prev, total: prev.total + 1 }));
    setLoading(false);
    toggleModal('editor', false);

    return { success: true, message: 'Đã tạo mẫu email thành công', template: newTemplate };
  }, [toggleModal]);

  // Update template
  const updateTemplate = useCallback(async (id: string, data: EditTemplateFormData): Promise<{ success: boolean; message: string }> => {
    setLoading(true);

    await new Promise(resolve => setTimeout(resolve, 500));

    setTemplates(prev => prev.map(template => {
      if (template.id === id) {
        // Save current version to history
        const newVersion = {
          version: template.version,
          content_html: template.content_html,
          content_json: template.content_json,
          created_at: new Date(),
          created_by: CURRENT_USER.id
        };
        const versions = [newVersion, ...template.versions].slice(0, 10); // Keep max 10 versions

        return {
          ...template,
          name: data.name || template.name,
          content_html: data.content_html || template.content_html,
          content_json: data.content_json !== undefined ? data.content_json : template.content_json,
          version: template.version + 1,
          versions,
          updated_at: new Date()
        };
      }
      return template;
    }));

    setLoading(false);
    toggleModal('editor', false);
    setSelectedTemplate(null);

    return { success: true, message: 'Đã cập nhật mẫu email thành công' };
  }, [toggleModal]);

  // Clone template
  const cloneTemplate = useCallback(async (template: EmailTemplate): Promise<{ success: boolean; message: string; template?: EmailTemplate }> => {
    setLoading(true);

    await new Promise(resolve => setTimeout(resolve, 500));

    const clonedTemplate: EmailTemplate = {
      id: generateId(),
      name: `${template.name} - Bản sao`,
      type: 'user',
      content_html: template.content_html,
      content_json: template.content_json,
      editor_mode: template.editor_mode,
      thumbnail_url: template.thumbnail_url,
      owner_id: CURRENT_USER.id,
      category_id: null,
      version: 1,
      versions: [],
      usage_count: 0,
      created_at: new Date(),
      updated_at: new Date(),
      deleted_at: null
    };

    setTemplates(prev => [clonedTemplate, ...prev]);
    setPagination(prev => ({ ...prev, total: prev.total + 1 }));
    setLoading(false);
    toggleModal('preview', false);

    // Switch to user tab to show the new template
    setActiveTab('user');

    return { success: true, message: 'Đã tạo bản sao thành công', template: clonedTemplate };
  }, [toggleModal]);

  // Delete template
  const deleteTemplate = useCallback(async (id: string): Promise<{ success: boolean; message: string }> => {
    const template = templates.find(t => t.id === id);
    
    // Cannot delete system templates
    if (template?.type === 'system') {
      return { success: false, message: 'Không thể xóa mẫu hệ thống' };
    }

    // Cannot delete template in use (usage_count > 0 in active campaigns)
    // For mock, we just check if it has been used
    // In real implementation, check if used in running campaigns

    setLoading(true);

    await new Promise(resolve => setTimeout(resolve, 500));

    // Soft delete
    setTemplates(prev => prev.map(t => {
      if (t.id === id) {
        return { ...t, deleted_at: new Date() };
      }
      return t;
    }));

    setPagination(prev => ({ ...prev, total: prev.total - 1 }));
    setLoading(false);
    toggleModal('delete', false);
    setSelectedTemplate(null);

    return { success: true, message: 'Đã xóa mẫu email thành công' };
  }, [templates, toggleModal]);

  // Import HTML
  const importHtml = useCallback(async (html: string, name?: string): Promise<{ success: boolean; message: string; warnings?: string[]; template?: EmailTemplate }> => {
    setLoading(true);

    await new Promise(resolve => setTimeout(resolve, 500));

    // Sanitize HTML (simplified version)
    const warnings: string[] = [];
    let sanitizedHtml = html;

    // Remove script tags
    if (/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi.test(html)) {
      sanitizedHtml = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
      warnings.push('Đã loại bỏ script tags');
    }

    // Remove event handlers
    if (/\s(on\w+)="[^"]*"/gi.test(sanitizedHtml)) {
      sanitizedHtml = sanitizedHtml.replace(/\s(on\w+)="[^"]*"/gi, '');
      warnings.push('Đã loại bỏ event handlers');
    }

    const importedTemplate: EmailTemplate = {
      id: generateId(),
      name: name || 'Mẫu import HTML',
      type: 'user',
      content_html: sanitizedHtml,
      content_json: null,
      editor_mode: 'html',
      thumbnail_url: '/templates/thumbnails/user/imported.png',
      owner_id: CURRENT_USER.id,
      category_id: null,
      version: 1,
      versions: [],
      usage_count: 0,
      created_at: new Date(),
      updated_at: new Date(),
      deleted_at: null
    };

    setTemplates(prev => [importedTemplate, ...prev]);
    setPagination(prev => ({ ...prev, total: prev.total + 1 }));
    setLoading(false);
    toggleModal('importHtml', false);
    setActiveTab('user');

    return { 
      success: true, 
      message: 'Đã import HTML thành công', 
      warnings: warnings.length > 0 ? warnings : undefined,
      template: importedTemplate 
    };
  }, [toggleModal]);

  // Set page
  const setPage = useCallback((page: number) => {
    setPagination(prev => ({ ...prev, page }));
  }, []);

  // Calculate paginated templates
  const paginatedTemplates = useMemo(() => {
    const startIndex = (pagination.page - 1) * pagination.limit;
    const endIndex = startIndex + pagination.limit;
    return filteredTemplates.slice(startIndex, endIndex);
  }, [filteredTemplates, pagination.page, pagination.limit]);

  // Update total pages when filtered templates change
  useMemo(() => {
    const totalPages = Math.max(1, Math.ceil(filteredTemplates.length / pagination.limit));
    if (totalPages !== pagination.total_pages || filteredTemplates.length !== pagination.total) {
      setPagination(prev => ({ ...prev, total: filteredTemplates.length, total_pages: totalPages }));
    }
  }, [filteredTemplates.length, pagination.limit, pagination.total_pages, pagination.total]);

  // Restore version
  const restoreVersion = useCallback(async (templateId: string, version: number): Promise<{ success: boolean; message: string }> => {
    setLoading(true);

    await new Promise(resolve => setTimeout(resolve, 500));

    setTemplates(prev => prev.map(template => {
      if (template.id === templateId) {
        const versionToRestore = template.versions.find(v => v.version === version);
        if (versionToRestore) {
          // Save current as new version
          const newVersion = {
            version: template.version,
            content_html: template.content_html,
            content_json: template.content_json,
            created_at: new Date(),
            created_by: CURRENT_USER.id
          };
          const versions = [newVersion, ...template.versions].slice(0, 10);

          return {
            ...template,
            content_html: versionToRestore.content_html,
            content_json: versionToRestore.content_json,
            version: template.version + 1,
            versions,
            updated_at: new Date()
          };
        }
      }
      return template;
    }));

    setLoading(false);

    return { success: true, message: `Đã khôi phục về phiên bản ${version}` };
  }, []);

  return {
    templates: paginatedTemplates,
    allTemplates: templates,
    totalFiltered: filteredTemplates.length,
    loading,
    error,
    activeTab,
    searchQuery,
    selectedTemplate,
    modals,
    editorMode,
    previewMode,
    pagination,
    currentUser: CURRENT_USER,
    setActiveTab,
    setSearchQuery,
    setPreviewMode,
    toggleModal,
    setSelectedTemplate,
    openPreview,
    openCreateEditor,
    openEditEditor,
    openCloneEditor,
    openDeleteConfirm,
    createTemplate,
    updateTemplate,
    cloneTemplate,
    deleteTemplate,
    importHtml,
    restoreVersion,
    setPage
  };
}

// ==================== USE CAMPAIGNS HOOK ====================
export function useCampaigns() {
  const [campaigns, setCampaigns] = useState<Campaign[]>(MOCK_CAMPAIGNS);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<CampaignsFilters>({
    status: 'all',
    type: 'all',
    search: ''
  });
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);

  // Modal states
  const [modals, setModals] = useState({
    createType: false,
    delete: false,
    cancel: false,
    pause: false,
    resume: false,
    confirmStart: false,
    editor: false
  });

  // Editor mode
  const [editorMode, setEditorMode] = useState<'create' | 'edit'>('create');
  const [editorCampaignType, setEditorCampaignType] = useState<CampaignType>('normal');

  // Pagination
  const [pagination, setPagination] = useState<Pagination>({
    total: MOCK_CAMPAIGNS.length,
    page: 1,
    limit: 20,
    total_pages: 1
  });

  // Calculate status counts
  const statusCounts = useMemo<StatusCounts>(() => {
    const activeCampaigns = campaigns.filter(c => c.deleted_at === null);
    return {
      all: activeCampaigns.length,
      draft: activeCampaigns.filter(c => c.status === 'draft').length,
      scheduled: activeCampaigns.filter(c => c.status === 'scheduled').length,
      running: activeCampaigns.filter(c => c.status === 'running').length,
      paused: activeCampaigns.filter(c => c.status === 'paused').length,
      sent: activeCampaigns.filter(c => c.status === 'sent').length,
      cancelled: activeCampaigns.filter(c => c.status === 'cancelled').length
    };
  }, [campaigns]);

  // Filter campaigns
  const filteredCampaigns = useMemo(() => {
    return campaigns.filter(campaign => {
      const matchesStatus = filters.status === 'all' || campaign.status === filters.status;
      const matchesType = filters.type === 'all' || campaign.type === filters.type;
      const matchesSearch = filters.search === '' ||
        campaign.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        campaign.subject.toLowerCase().includes(filters.search.toLowerCase());
      const notDeleted = campaign.deleted_at === null;

      return matchesStatus && matchesType && matchesSearch && notDeleted;
    });
  }, [campaigns, filters]);

  // Update filters
  const updateFilters = useCallback((newFilters: Partial<CampaignsFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  // Toggle modal
  const toggleModal = useCallback((modal: keyof typeof modals, open: boolean) => {
    setModals(prev => ({ ...prev, [modal]: open }));
  }, []);

  // Open create modal
  const openCreateModal = useCallback(() => {
    toggleModal('createType', true);
  }, [toggleModal]);

  // Start creating campaign
  const startCreate = useCallback((type: CampaignType, name: string) => {
    setEditorCampaignType(type);
    setEditorMode('create');
    setSelectedCampaign(null);
    toggleModal('createType', false);
    toggleModal('editor', true);
  }, [toggleModal]);

  // Open edit
  const openEdit = useCallback((campaign: Campaign) => {
    if (campaign.status !== 'draft' && campaign.status !== 'scheduled') {
      return { success: false, message: 'Chỉ có thể chỉnh sửa chiến dịch ở trạng thái Mới hoặc Đang chờ' };
    }
    setSelectedCampaign(campaign);
    setEditorMode('edit');
    setEditorCampaignType(campaign.type);
    toggleModal('editor', true);
    return { success: true };
  }, [toggleModal]);

  // Create campaign
  const createCampaign = useCallback(async (data: Partial<CampaignFormData>): Promise<{ success: boolean; message: string; campaign?: Campaign }> => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));

    const newCampaign: Campaign = {
      id: generateId(),
      name: data.name || `Chiến dịch ${new Date().toLocaleDateString('vi-VN')}`,
      type: editorCampaignType,
      status: 'draft',
      subject: data.subject || '',
      preview_text: data.preview_text || null,
      sender_email_id: data.sender_email_id || '',
      template_id: data.template_id || '',
      attachments: data.attachments || [],
      recipient_filter: data.recipient_filter || DEFAULT_RECIPIENT_FILTER,
      recipient_count: 0,
      valid_email_count: 0,
      send_type: data.send_type || 'immediate',
      scheduled_at: data.scheduled_at || null,
      batches: data.batches || null,
      ab_config: null,
      stats: {
        total_recipients: 0,
        total_sent: 0,
        total_delivered: 0,
        total_bounced: 0,
        total_opened: 0,
        total_clicked: 0,
        total_unsubscribed: 0,
        delivery_rate: 0,
        open_rate: 0,
        click_rate: 0,
        bounce_rate: 0,
        unsubscribe_rate: 0,
        stats_a: null,
        stats_b: null
      },
      created_by: CURRENT_USER.id,
      created_at: new Date(),
      updated_at: new Date(),
      started_at: null,
      completed_at: null,
      deleted_at: null
    };

    setCampaigns(prev => [newCampaign, ...prev]);
    setLoading(false);
    toggleModal('editor', false);

    return { success: true, message: 'Đã tạo chiến dịch thành công', campaign: newCampaign };
  }, [editorCampaignType, toggleModal]);

  // Update campaign
  const updateCampaign = useCallback(async (id: string, data: Partial<CampaignFormData>): Promise<{ success: boolean; message: string }> => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));

    setCampaigns(prev => prev.map((campaign): Campaign => {
      if (campaign.id === id) {
        return {
          ...campaign,
          name: data.name ?? campaign.name,
          subject: data.subject ?? campaign.subject,
          preview_text: data.preview_text ?? campaign.preview_text,
          sender_email_id: data.sender_email_id ?? campaign.sender_email_id,
          template_id: data.template_id ?? campaign.template_id,
          recipient_filter: data.recipient_filter ?? campaign.recipient_filter,
          attachments: data.attachments ?? campaign.attachments,
          send_type: data.send_type ?? campaign.send_type,
          scheduled_at: data.scheduled_at !== undefined ? data.scheduled_at : campaign.scheduled_at,
          batches: data.batches ?? campaign.batches,
          updated_at: new Date()
        } as Campaign;
      }
      return campaign;
    }));

    setLoading(false);
    return { success: true, message: 'Đã cập nhật chiến dịch' };
  }, []);

  // Delete campaign
  const deleteCampaign = useCallback(async (id: string): Promise<{ success: boolean; message: string }> => {
    const campaign = campaigns.find(c => c.id === id);
    if (!campaign) {
      return { success: false, message: 'Không tìm thấy chiến dịch' };
    }

    if (!['draft', 'sent', 'cancelled'].includes(campaign.status)) {
      return { success: false, message: 'Không thể xóa chiến dịch ở trạng thái này' };
    }

    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));

    setCampaigns(prev => prev.map(c => {
      if (c.id === id) {
        return { ...c, deleted_at: new Date() };
      }
      return c;
    }));

    setLoading(false);
    toggleModal('delete', false);
    setSelectedCampaign(null);

    return { success: true, message: 'Đã xóa chiến dịch' };
  }, [campaigns, toggleModal]);

  // Clone campaign
  const cloneCampaign = useCallback(async (campaign: Campaign): Promise<{ success: boolean; message: string; campaign?: Campaign }> => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));

    const cloned: Campaign = {
      ...campaign,
      id: generateId(),
      name: `${campaign.name} - Bản sao`,
      status: 'draft',
      stats: {
        total_recipients: 0,
        total_sent: 0,
        total_delivered: 0,
        total_bounced: 0,
        total_opened: 0,
        total_clicked: 0,
        total_unsubscribed: 0,
        delivery_rate: 0,
        open_rate: 0,
        click_rate: 0,
        bounce_rate: 0,
        unsubscribe_rate: 0,
        stats_a: null,
        stats_b: null
      },
      created_by: CURRENT_USER.id,
      created_at: new Date(),
      updated_at: new Date(),
      started_at: null,
      completed_at: null,
      deleted_at: null
    };

    setCampaigns(prev => [cloned, ...prev]);
    setLoading(false);

    return { success: true, message: 'Đã tạo bản sao chiến dịch', campaign: cloned };
  }, []);

  // Start campaign
  const startCampaign = useCallback(async (
    id: string, 
    sendType: SendType, 
    scheduledAt?: Date | null, 
    batches?: BatchSchedule[]
  ): Promise<{ success: boolean; message: string }> => {
    const campaign = campaigns.find(c => c.id === id);
    if (!campaign) {
      return { success: false, message: 'Không tìm thấy chiến dịch' };
    }

    // Validate campaign is complete
    if (!campaign.subject || !campaign.sender_email_id || !campaign.template_id) {
      return { success: false, message: 'Vui lòng hoàn thành tất cả các mục bắt buộc' };
    }

    if (campaign.valid_email_count === 0) {
      return { success: false, message: 'Không có người nhận hợp lệ' };
    }

    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));

    const newStatus: CampaignStatus = sendType === 'scheduled' ? 'scheduled' : 'running';
    const now = new Date();

    setCampaigns(prev => prev.map(c => {
      if (c.id === id) {
        return {
          ...c,
          status: newStatus,
          send_type: sendType,
          scheduled_at: scheduledAt || null,
          batches: batches || null,
          started_at: sendType === 'immediate' ? now : null,
          updated_at: now
        };
      }
      return c;
    }));

    setLoading(false);
    toggleModal('confirmStart', false);
    toggleModal('editor', false);

    return { 
      success: true, 
      message: sendType === 'scheduled' 
        ? 'Đã lên lịch gửi chiến dịch' 
        : 'Đã bắt đầu gửi chiến dịch' 
    };
  }, [campaigns, toggleModal]);

  // Pause campaign
  const pauseCampaign = useCallback(async (id: string): Promise<{ success: boolean; message: string; stats?: { sent: number; remaining: number } }> => {
    const campaign = campaigns.find(c => c.id === id);
    if (!campaign || campaign.status !== 'running') {
      return { success: false, message: 'Không thể tạm dừng chiến dịch này' };
    }

    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));

    setCampaigns(prev => prev.map(c => {
      if (c.id === id) {
        return { ...c, status: 'paused' as CampaignStatus, updated_at: new Date() };
      }
      return c;
    }));

    setLoading(false);
    toggleModal('pause', false);
    setSelectedCampaign(null);

    return { 
      success: true, 
      message: 'Đã tạm dừng chiến dịch',
      stats: {
        sent: campaign.stats.total_sent,
        remaining: campaign.valid_email_count - campaign.stats.total_sent
      }
    };
  }, [campaigns, toggleModal]);

  // Resume campaign
  const resumeCampaign = useCallback(async (id: string, sendType?: SendType, scheduledAt?: Date): Promise<{ success: boolean; message: string }> => {
    const campaign = campaigns.find(c => c.id === id);
    if (!campaign || campaign.status !== 'paused') {
      return { success: false, message: 'Không thể tiếp tục chiến dịch này' };
    }

    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));

    const newStatus: CampaignStatus = sendType === 'scheduled' ? 'scheduled' : 'running';

    setCampaigns(prev => prev.map(c => {
      if (c.id === id) {
        return { 
          ...c, 
          status: newStatus,
          send_type: sendType || c.send_type,
          scheduled_at: scheduledAt || null,
          updated_at: new Date() 
        };
      }
      return c;
    }));

    setLoading(false);
    toggleModal('resume', false);
    setSelectedCampaign(null);

    return { success: true, message: 'Đã tiếp tục chiến dịch' };
  }, [campaigns, toggleModal]);

  // Cancel campaign
  const cancelCampaign = useCallback(async (id: string, reason?: string): Promise<{ success: boolean; message: string }> => {
    const campaign = campaigns.find(c => c.id === id);
    if (!campaign || !['draft', 'scheduled'].includes(campaign.status)) {
      return { success: false, message: 'Không thể hủy chiến dịch này' };
    }

    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));

    setCampaigns(prev => prev.map(c => {
      if (c.id === id) {
        return { ...c, status: 'cancelled' as CampaignStatus, updated_at: new Date() };
      }
      return c;
    }));

    setLoading(false);
    toggleModal('cancel', false);
    setSelectedCampaign(null);

    return { success: true, message: 'Đã hủy chiến dịch' };
  }, [campaigns, toggleModal]);

  // Open delete confirm
  const openDeleteConfirm = useCallback((campaign: Campaign) => {
    setSelectedCampaign(campaign);
    toggleModal('delete', true);
  }, [toggleModal]);

  // Open cancel confirm
  const openCancelConfirm = useCallback((campaign: Campaign) => {
    setSelectedCampaign(campaign);
    toggleModal('cancel', true);
  }, [toggleModal]);

  // Open pause confirm
  const openPauseConfirm = useCallback((campaign: Campaign) => {
    setSelectedCampaign(campaign);
    toggleModal('pause', true);
  }, [toggleModal]);

  // Open resume modal
  const openResumeModal = useCallback((campaign: Campaign) => {
    setSelectedCampaign(campaign);
    toggleModal('resume', true);
  }, [toggleModal]);

  return {
    campaigns: filteredCampaigns,
    allCampaigns: campaigns,
    loading,
    error,
    filters,
    selectedCampaign,
    modals,
    editorMode,
    editorCampaignType,
    statusCounts,
    pagination,
    currentUser: CURRENT_USER,
    updateFilters,
    toggleModal,
    setSelectedCampaign,
    openCreateModal,
    startCreate,
    openEdit,
    createCampaign,
    updateCampaign,
    deleteCampaign,
    cloneCampaign,
    startCampaign,
    pauseCampaign,
    resumeCampaign,
    cancelCampaign,
    openDeleteConfirm,
    openCancelConfirm,
    openPauseConfirm,
    openResumeModal
  };
}

// ==================== USE CAMPAIGN EDITOR HOOK ====================
export function useCampaignEditor(initialCampaign?: Campaign | null) {
  const [formData, setFormData] = useState<CampaignFormData>(() => ({
    name: initialCampaign?.name || `Chiến dịch ${new Date().toLocaleDateString('vi-VN')}`,
    subject: initialCampaign?.subject || '',
    preview_text: initialCampaign?.preview_text || '',
    sender_email_id: initialCampaign?.sender_email_id || null,
    template_id: initialCampaign?.template_id || null,
    recipient_filter: initialCampaign?.recipient_filter || DEFAULT_RECIPIENT_FILTER,
    attachments: initialCampaign?.attachments || [],
    send_type: initialCampaign?.send_type || 'immediate',
    scheduled_at: initialCampaign?.scheduled_at || null,
    batches: initialCampaign?.batches || []
  }));

  const [recipientsPreview, setRecipientsPreview] = useState<RecipientsPreview | null>(null);
  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);

  // Active modal for checklist items
  const [activeModal, setActiveModal] = useState<
    'subject' | 'preview_text' | 'sender' | 'recipients' | 'content' | 'attachments' | 'confirmStart' | null
  >(null);

  // Calculate checklist completion
  const checklist = useMemo<CampaignChecklist>(() => ({
    subject: !!formData.subject && formData.subject.length > 0,
    preview_text: true, // Optional
    sender: !!formData.sender_email_id,
    recipients: recipientsPreview !== null && recipientsPreview.valid_emails > 0,
    content: !!formData.template_id,
    attachments: true // Optional
  }), [formData, recipientsPreview]);

  // Check if required items are complete
  const isComplete = useMemo(() => {
    return checklist.subject && checklist.sender && checklist.recipients && checklist.content;
  }, [checklist]);

  // Count completed required items
  const completedCount = useMemo(() => {
    let count = 0;
    if (checklist.subject) count++;
    if (checklist.sender) count++;
    if (checklist.recipients) count++;
    if (checklist.content) count++;
    return count;
  }, [checklist]);

  // Update form field
  const updateField = useCallback(<K extends keyof CampaignFormData>(
    field: K, 
    value: CampaignFormData[K]
  ) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setIsDirty(true);
  }, []);

  // Update recipient filter
  const updateRecipientFilter = useCallback((filter: Partial<RecipientFilter>) => {
    setFormData(prev => ({
      ...prev,
      recipient_filter: { ...prev.recipient_filter, ...filter }
    }));
    setIsDirty(true);
  }, []);

  // Preview recipients (simulated)
  const previewRecipients = useCallback(async (): Promise<RecipientsPreview> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Return mock data with some variation based on filter
    const hasFilters = formData.recipient_filter.labels.length > 0 || 
                       formData.recipient_filter.sources.length > 0 ||
                       formData.recipient_filter.statuses.length > 0;
    
    const preview: RecipientsPreview = {
      ...MOCK_RECIPIENTS_PREVIEW,
      total_customers: hasFilters ? 320 : 520,
      valid_emails: hasFilters ? 305 : 485,
      invalid_emails: hasFilters ? 15 : 35
    };
    
    setRecipientsPreview(preview);
    return preview;
  }, [formData.recipient_filter]);

  // Add attachment
  const addAttachment = useCallback((file: File): { success: boolean; message: string } => {
    const currentTotal = formData.attachments.reduce((sum, a) => sum + a.file_size, 0);
    
    if (formData.attachments.length >= 3) {
      return { success: false, message: 'Tối đa 3 file đính kèm' };
    }
    
    if (file.size > 5 * 1024 * 1024) {
      return { success: false, message: 'File không được vượt quá 5MB' };
    }
    
    if (currentTotal + file.size > 10 * 1024 * 1024) {
      return { success: false, message: 'Tổng dung lượng không được vượt quá 10MB' };
    }

    const newAttachment: Attachment = {
      id: generateId(),
      campaign_id: '',
      file_name: file.name,
      file_url: URL.createObjectURL(file),
      file_size: file.size,
      file_type: file.type,
      uploaded_at: new Date()
    };

    setFormData(prev => ({
      ...prev,
      attachments: [...prev.attachments, newAttachment]
    }));
    setIsDirty(true);

    return { success: true, message: 'Đã thêm file đính kèm' };
  }, [formData.attachments]);

  // Remove attachment
  const removeAttachment = useCallback((id: string) => {
    setFormData(prev => ({
      ...prev,
      attachments: prev.attachments.filter(a => a.id !== id)
    }));
    setIsDirty(true);
  }, []);

  // Add batch
  const addBatch = useCallback((batch: Omit<BatchSchedule, 'batch_number' | 'status' | 'sent_count' | 'failed_count' | 'started_at' | 'completed_at'>) => {
    if (formData.batches.length >= 10) {
      return { success: false, message: 'Tối đa 10 đợt gửi' };
    }

    const newBatch: BatchSchedule = {
      ...batch,
      batch_number: formData.batches.length + 1,
      status: 'pending',
      sent_count: 0,
      failed_count: 0,
      started_at: null,
      completed_at: null
    };

    setFormData(prev => ({
      ...prev,
      batches: [...prev.batches, newBatch]
    }));
    setIsDirty(true);

    return { success: true, message: 'Đã thêm đợt gửi' };
  }, [formData.batches]);

  // Remove batch
  const removeBatch = useCallback((batchNumber: number) => {
    setFormData(prev => ({
      ...prev,
      batches: prev.batches
        .filter(b => b.batch_number !== batchNumber)
        .map((b, i) => ({ ...b, batch_number: i + 1 }))
    }));
    setIsDirty(true);
  }, []);

  // Open modal
  const openModal = useCallback((modal: typeof activeModal) => {
    setActiveModal(modal);
  }, []);

  // Close modal
  const closeModal = useCallback(() => {
    setActiveModal(null);
  }, []);

  // Mark as saved
  const markSaved = useCallback(() => {
    setIsDirty(false);
    setLastSavedAt(new Date());
  }, []);

  // Reset form
  const resetForm = useCallback(() => {
    setFormData({
      name: `Chiến dịch ${new Date().toLocaleDateString('vi-VN')}`,
      subject: '',
      preview_text: '',
      sender_email_id: null,
      template_id: null,
      recipient_filter: DEFAULT_RECIPIENT_FILTER,
      attachments: [],
      send_type: 'immediate',
      scheduled_at: null,
      batches: []
    });
    setRecipientsPreview(null);
    setIsDirty(false);
    setLastSavedAt(null);
  }, []);

  return {
    formData,
    recipientsPreview,
    checklist,
    isComplete,
    completedCount,
    isDirty,
    isSaving,
    lastSavedAt,
    activeModal,
    updateField,
    updateRecipientFilter,
    previewRecipients,
    addAttachment,
    removeAttachment,
    addBatch,
    removeBatch,
    openModal,
    closeModal,
    markSaved,
    resetForm,
    setFormData
  };
}

// ==================== USE A/B CAMPAIGN EDITOR HOOK ====================
import { 
  ABCampaignFormData,
  ABEditorStep,
  ABCampaignChecklist,
  ABTestType,
  ABTestResults,
  CampaignDetailState,
  TimelineDataPoint,
  EmailSendLog,
  EmailLogStatus
} from './types';
import { 
  MOCK_EMAIL_SEND_LOGS, 
  MOCK_CAMPAIGN_TIMELINE 
} from './mockData';

export function useABCampaignEditor(initialCampaign?: Campaign | null) {
  const [currentStep, setCurrentStep] = useState<ABEditorStep>('basic');
  
  const [formData, setFormData] = useState<ABCampaignFormData>(() => ({
    name: initialCampaign?.name || `[A/B] Chiến dịch ${new Date().toLocaleDateString('vi-VN')}`,
    subject: initialCampaign?.subject || '',
    subject_b: initialCampaign?.ab_config?.version_b?.subject || null,
    preview_text: initialCampaign?.preview_text || '',
    sender_email_id: initialCampaign?.sender_email_id || null,
    template_id: initialCampaign?.template_id || null,
    template_b_id: initialCampaign?.ab_config?.version_b?.template_id || null,
    recipient_filter: initialCampaign?.recipient_filter || DEFAULT_RECIPIENT_FILTER,
    attachments: initialCampaign?.attachments || [],
    send_type: initialCampaign?.send_type || 'immediate',
    scheduled_at: initialCampaign?.scheduled_at || null,
    ab_test_type: initialCampaign?.ab_config?.test_type || null,
    ab_ratio_a: initialCampaign?.ab_config?.ratio_a || 10,
    ab_ratio_b: initialCampaign?.ab_config?.ratio_b || 10,
    ab_evaluation_hours: initialCampaign?.ab_config?.evaluation_hours || 24,
    ab_winning_criteria: initialCampaign?.ab_config?.winning_criteria || 'open',
    ab_winning_threshold: initialCampaign?.ab_config?.winning_threshold || null,
    ab_auto_send_winner: initialCampaign?.ab_config?.auto_send_winner || false,
    ab_send_time_a: initialCampaign?.ab_config?.version_a?.send_at || null,
    ab_send_time_b: initialCampaign?.ab_config?.version_b?.send_at || null
  }));

  const [recipientsPreview, setRecipientsPreview] = useState<RecipientsPreview | null>(null);
  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [confirmChecked, setConfirmChecked] = useState(false);

  // Active modal
  const [activeModal, setActiveModal] = useState<
    'sender' | 'recipients' | 'content' | 'content_b' | 'attachments' | null
  >(null);

  // Calculate checklist for Step 1
  const checklist = useMemo<ABCampaignChecklist>(() => {
    const hasTestType = !!formData.ab_test_type;
    const hasSender = !!formData.sender_email_id;
    const hasRecipients = recipientsPreview !== null && recipientsPreview.valid_emails >= 100;
    
    let hasContent = false;
    let hasVersionA = false;
    let hasVersionB = false;

    switch (formData.ab_test_type) {
      case 'subject':
        hasContent = !!formData.template_id;
        hasVersionA = !!formData.subject && formData.subject.length > 0;
        hasVersionB = !!formData.subject_b && formData.subject_b.length > 0;
        break;
      case 'content':
        hasContent = true; // Not needed separately
        hasVersionA = !!formData.template_id;
        hasVersionB = !!formData.template_b_id;
        break;
      case 'send_time':
        hasContent = !!formData.template_id && !!formData.subject;
        hasVersionA = !!formData.ab_send_time_a;
        hasVersionB = !!formData.ab_send_time_b;
        break;
      default:
        hasContent = false;
        hasVersionA = false;
        hasVersionB = false;
    }

    return {
      test_type: hasTestType,
      sender: hasSender,
      recipients: hasRecipients,
      content: hasContent,
      version_a: hasVersionA,
      version_b: hasVersionB
    };
  }, [formData, recipientsPreview]);

  // Check step 1 requirements
  const isStep1Complete = useMemo(() => {
    return checklist.test_type && checklist.sender && checklist.recipients && checklist.content;
  }, [checklist]);

  // Check step 2 requirements
  const isStep2Complete = useMemo(() => {
    return checklist.version_a && checklist.version_b && 
           formData.ab_ratio_a >= 5 && formData.ab_ratio_b >= 5 &&
           formData.ab_ratio_a + formData.ab_ratio_b <= 50 &&
           formData.ab_evaluation_hours >= 1 && formData.ab_evaluation_hours <= 168;
  }, [checklist, formData]);

  // Check step 3 requirements
  const isStep3Complete = useMemo(() => {
    return confirmChecked;
  }, [confirmChecked]);

  // Can start campaign
  const canStart = useMemo(() => {
    return isStep1Complete && isStep2Complete && isStep3Complete;
  }, [isStep1Complete, isStep2Complete, isStep3Complete]);

  // Calculate recipient counts for each version
  const recipientCounts = useMemo(() => {
    const total = recipientsPreview?.valid_emails || 0;
    const countA = Math.floor(total * formData.ab_ratio_a / 100);
    const countB = Math.floor(total * formData.ab_ratio_b / 100);
    const countWinner = total - countA - countB;
    return { a: countA, b: countB, winner: countWinner, total };
  }, [recipientsPreview, formData.ab_ratio_a, formData.ab_ratio_b]);

  // Update form field
  const updateField = useCallback(<K extends keyof ABCampaignFormData>(
    field: K,
    value: ABCampaignFormData[K]
  ) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setIsDirty(true);
  }, []);

  // Update recipient filter
  const updateRecipientFilter = useCallback((filter: Partial<RecipientFilter>) => {
    setFormData(prev => ({
      ...prev,
      recipient_filter: { ...prev.recipient_filter, ...filter }
    }));
    setIsDirty(true);
  }, []);

  // Preview recipients
  const previewRecipients = useCallback(async (): Promise<RecipientsPreview> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const hasFilters = formData.recipient_filter.labels.length > 0 ||
                       formData.recipient_filter.sources.length > 0 ||
                       formData.recipient_filter.statuses.length > 0;
    
    const preview: RecipientsPreview = {
      ...MOCK_RECIPIENTS_PREVIEW,
      total_customers: hasFilters ? 420 : 980,
      valid_emails: hasFilters ? 400 : 950,
      invalid_emails: hasFilters ? 20 : 30
    };
    
    setRecipientsPreview(preview);
    return preview;
  }, [formData.recipient_filter]);

  // Navigation
  const goToStep = useCallback((step: ABEditorStep) => {
    setCurrentStep(step);
  }, []);

  const nextStep = useCallback(() => {
    if (currentStep === 'basic' && isStep1Complete) {
      setCurrentStep('ab_config');
    } else if (currentStep === 'ab_config' && isStep2Complete) {
      setCurrentStep('confirm');
    }
  }, [currentStep, isStep1Complete, isStep2Complete]);

  const prevStep = useCallback(() => {
    if (currentStep === 'confirm') {
      setCurrentStep('ab_config');
    } else if (currentStep === 'ab_config') {
      setCurrentStep('basic');
    }
  }, [currentStep]);

  // Modal controls
  const openModal = useCallback((modal: typeof activeModal) => {
    setActiveModal(modal);
  }, []);

  const closeModal = useCallback(() => {
    setActiveModal(null);
  }, []);

  // Reset form
  const resetForm = useCallback(() => {
    setFormData({
      name: `[A/B] Chiến dịch ${new Date().toLocaleDateString('vi-VN')}`,
      subject: '',
      subject_b: null,
      preview_text: '',
      sender_email_id: null,
      template_id: null,
      template_b_id: null,
      recipient_filter: DEFAULT_RECIPIENT_FILTER,
      attachments: [],
      send_type: 'immediate',
      scheduled_at: null,
      ab_test_type: null,
      ab_ratio_a: 10,
      ab_ratio_b: 10,
      ab_evaluation_hours: 24,
      ab_winning_criteria: 'open',
      ab_winning_threshold: null,
      ab_auto_send_winner: false,
      ab_send_time_a: null,
      ab_send_time_b: null
    });
    setRecipientsPreview(null);
    setCurrentStep('basic');
    setIsDirty(false);
    setConfirmChecked(false);
  }, []);

  return {
    currentStep,
    formData,
    recipientsPreview,
    checklist,
    isStep1Complete,
    isStep2Complete,
    isStep3Complete,
    canStart,
    recipientCounts,
    isDirty,
    isSaving,
    confirmChecked,
    activeModal,
    updateField,
    updateRecipientFilter,
    previewRecipients,
    goToStep,
    nextStep,
    prevStep,
    openModal,
    closeModal,
    setConfirmChecked,
    resetForm,
    setFormData
  };
}

// ==================== USE CAMPAIGN DETAIL HOOK ====================
export function useCampaignDetail(campaignId: string | null) {
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(false);
  
  // Recipients
  const [recipients, setRecipients] = useState<EmailSendLog[]>([]);
  const [recipientsLoading, setRecipientsLoading] = useState(false);
  const [recipientsPage, setRecipientsPage] = useState(1);
  const [recipientsFilter, setRecipientsFilter] = useState<{
    status: EmailLogStatus | 'all';
    search: string;
  }>({ status: 'all', search: '' });
  
  // Timeline
  const [timelineData, setTimelineData] = useState<TimelineDataPoint[]>([]);
  const [timelineMetric, setTimelineMetric] = useState<'sent' | 'opened' | 'clicked'>('opened');
  const [timelineInterval, setTimelineInterval] = useState<'hour' | 'day'>('hour');

  // A/B Results
  const [abResults, setAbResults] = useState<ABTestResults | null>(null);

  // Load campaign
  const loadCampaign = useCallback(async (id: string) => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const foundCampaign = MOCK_CAMPAIGNS.find(c => c.id === id);
    setCampaign(foundCampaign || null);
    
    if (foundCampaign?.type === 'ab' && foundCampaign.ab_config) {
      const config = foundCampaign.ab_config;
      const stats = foundCampaign.stats;
      
      setAbResults({
        test_type: config.test_type,
        version_a: {
          content: config.version_a,
          stats: stats.stats_a || { version: 'a', sent: 0, delivered: 0, opened: 0, clicked: 0, open_rate: 0, click_rate: 0 }
        },
        version_b: {
          content: config.version_b,
          stats: stats.stats_b || { version: 'b', sent: 0, delivered: 0, opened: 0, clicked: 0, open_rate: 0, click_rate: 0 }
        },
        winner: config.winner,
        comparison: {
          open_rate_diff: (stats.stats_b?.open_rate || 0) - (stats.stats_a?.open_rate || 0),
          click_rate_diff: (stats.stats_b?.click_rate || 0) - (stats.stats_a?.click_rate || 0)
        },
        evaluation_status: config.evaluation_completed_at ? 'completed' : 'pending',
        remaining_count: Math.floor(foundCampaign.valid_email_count * (100 - config.ratio_a - config.ratio_b) / 100),
        can_send_remaining: config.evaluation_completed_at !== null && config.winner_sent_at === null
      });
    }
    
    setLoading(false);
  }, []);

  // Load recipients
  const loadRecipients = useCallback(async () => {
    if (!campaignId) return;
    
    setRecipientsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 200));
    
    let filtered = MOCK_EMAIL_SEND_LOGS.filter(log => log.campaign_id === campaignId);
    
    if (recipientsFilter.status !== 'all') {
      filtered = filtered.filter(log => log.status === recipientsFilter.status);
    }
    
    if (recipientsFilter.search) {
      const search = recipientsFilter.search.toLowerCase();
      filtered = filtered.filter(log => 
        log.recipient_email.toLowerCase().includes(search) ||
        log.recipient_name?.toLowerCase().includes(search)
      );
    }
    
    setRecipients(filtered);
    setRecipientsLoading(false);
  }, [campaignId, recipientsFilter]);

  // Load timeline
  const loadTimeline = useCallback(async () => {
    if (!campaignId) return;
    
    const campaignTimeline = MOCK_CAMPAIGN_TIMELINE[campaignId as keyof typeof MOCK_CAMPAIGN_TIMELINE];
    if (!campaignTimeline) {
      setTimelineData([]);
      return;
    }
    
    const data = timelineInterval === 'hour' ? campaignTimeline.hourly : campaignTimeline.daily;
    const points: TimelineDataPoint[] = data.map(d => ({
      timestamp: d.timestamp,
      count: d[timelineMetric as keyof typeof d] as number
    }));
    
    setTimelineData(points);
  }, [campaignId, timelineMetric, timelineInterval]);

  // Get recipient counts by status
  const recipientCounts = useMemo(() => {
    const allLogs = MOCK_EMAIL_SEND_LOGS.filter(log => log.campaign_id === campaignId);
    const counts: Record<EmailLogStatus | 'all', number> = {
      all: allLogs.length,
      queued: 0, sending: 0, sent: 0, delivered: 0,
      opened: 0, clicked: 0, bounced: 0, failed: 0, unsubscribed: 0
    };
    
    allLogs.forEach(log => {
      counts[log.status]++;
    });
    
    return counts;
  }, [campaignId]);

  // Update filter
  const updateRecipientsFilter = useCallback((filter: Partial<typeof recipientsFilter>) => {
    setRecipientsFilter(prev => ({ ...prev, ...filter }));
    setRecipientsPage(1);
  }, []);

  // Send remaining for A/B
  const sendRemaining = useCallback(async (version: 'a' | 'b'): Promise<{ success: boolean; message: string }> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (campaign && campaign.ab_config) {
      setCampaign(prev => prev ? {
        ...prev,
        ab_config: prev.ab_config ? {
          ...prev.ab_config,
          winner_sent_at: new Date()
        } : null
      } : null);
      
      setAbResults(prev => prev ? {
        ...prev,
        can_send_remaining: false
      } : null);
    }
    
    return { 
      success: true, 
      message: `Đã bắt đầu gửi phần còn lại với phiên bản ${version.toUpperCase()}` 
    };
  }, [campaign]);

  // Effects to load data when campaignId changes
  useMemo(() => {
    if (campaignId) {
      loadCampaign(campaignId);
    }
  }, [campaignId, loadCampaign]);

  return {
    campaign,
    loading,
    recipients,
    recipientsLoading,
    recipientsPage,
    recipientsFilter,
    recipientCounts,
    timelineData,
    timelineMetric,
    timelineInterval,
    abResults,
    loadCampaign,
    loadRecipients,
    loadTimeline,
    updateRecipientsFilter,
    setRecipientsPage,
    setTimelineMetric,
    setTimelineInterval,
    sendRemaining
  };
}

// ==================== USE EMAIL REPORTS HOOK (Task 10.5) ====================

export function useEmailReports() {
  // Filters
  const [filters, setFilters] = useState<ReportFilter>(DEFAULT_REPORT_FILTER);
  
  // Overview state
  const [overview, setOverview] = useState<EmailMarketingOverview | null>(null);
  const [overviewLoading, setOverviewLoading] = useState(true);
  
  // Trend chart state
  const [trendData, setTrendData] = useState<ReportTrendDataPoint[]>([]);
  const [trendLoading, setTrendLoading] = useState(true);
  const [trendInterval, setTrendInterval] = useState<'day' | 'week' | 'month'>('day');
  const [trendVisibleMetrics, setTrendVisibleMetrics] = useState<('sent' | 'opened' | 'clicked')[]>(['sent', 'opened', 'clicked']);
  
  // Funnel state
  const [funnel, setFunnel] = useState<EmailFunnel | null>(null);
  const [funnelLoading, setFunnelLoading] = useState(true);
  
  // Status distribution state
  const [statusDistribution, setStatusDistribution] = useState<StatusDistributionItem[]>([]);
  const [statusDistributionLoading, setStatusDistributionLoading] = useState(true);
  
  // Campaign comparison state
  const [campaigns, setCampaigns] = useState<CampaignComparisonRow[]>([]);
  const [campaignsLoading, setCampaignsLoading] = useState(true);
  const [campaignsSort, setCampaignsSort] = useState<{ field: string; order: 'asc' | 'desc' }>({ 
    field: 'sent_date', 
    order: 'desc' 
  });
  const [campaignsPage, setCampaignsPage] = useState(1);
  const campaignsLimit = 10;
  
  // Unsubscribe state
  const [unsubscribes, setUnsubscribes] = useState<UnsubscribeEntry[]>([]);
  const [unsubscribesLoading, setUnsubscribesLoading] = useState(true);
  const [unsubscribesSearch, setUnsubscribesSearch] = useState('');
  const [unsubscribesTrend, setUnsubscribesTrend] = useState<{ date: string; label: string; count: number }[]>([]);
  const [unsubscribesPage, setUnsubscribesPage] = useState(1);
  const unsubscribesLimit = 10;
  
  // Export state
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [exporting, setExporting] = useState(false);

  // Load all data on mount and when filters change
  const loadAllData = useCallback(async () => {
    // Simulate loading all data in parallel
    setOverviewLoading(true);
    setTrendLoading(true);
    setFunnelLoading(true);
    setStatusDistributionLoading(true);
    setCampaignsLoading(true);
    setUnsubscribesLoading(true);
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setOverview(MOCK_EMAIL_OVERVIEW);
    setOverviewLoading(false);
    
    setTrendData(MOCK_TREND_DATA);
    setTrendLoading(false);
    
    setFunnel(MOCK_EMAIL_FUNNEL);
    setFunnelLoading(false);
    
    setStatusDistribution(MOCK_STATUS_DISTRIBUTION);
    setStatusDistributionLoading(false);
    
    setCampaigns(MOCK_CAMPAIGN_COMPARISON);
    setCampaignsLoading(false);
    
    setUnsubscribes(MOCK_UNSUBSCRIBES);
    setUnsubscribesTrend(MOCK_UNSUBSCRIBE_TREND);
    setUnsubscribesLoading(false);
  }, []);

  // Initial load
  useEffect(() => {
    loadAllData();
  }, [loadAllData]);

  // Update filters
  const updateFilters = useCallback((newFilters: Partial<ReportFilter>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  // Apply filters (reload data)
  const applyFilters = useCallback(() => {
    loadAllData();
  }, [loadAllData]);

  // Toggle trend metric visibility
  const toggleTrendMetric = useCallback((metric: 'sent' | 'opened' | 'clicked') => {
    setTrendVisibleMetrics(prev => {
      if (prev.includes(metric)) {
        return prev.filter(m => m !== metric);
      }
      return [...prev, metric];
    });
  }, []);

  // Sort campaigns
  const sortCampaigns = useCallback((field: string) => {
    setCampaignsSort(prev => ({
      field,
      order: prev.field === field && prev.order === 'asc' ? 'desc' : 'asc'
    }));
  }, []);

  // Sorted campaigns
  const sortedCampaigns = useMemo(() => {
    const sorted = [...campaigns];
    sorted.sort((a, b) => {
      const aVal = a[campaignsSort.field as keyof CampaignComparisonRow];
      const bVal = b[campaignsSort.field as keyof CampaignComparisonRow];
      
      if (aVal === null) return 1;
      if (bVal === null) return -1;
      
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return campaignsSort.order === 'asc' 
          ? aVal.localeCompare(bVal) 
          : bVal.localeCompare(aVal);
      }
      
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return campaignsSort.order === 'asc' ? aVal - bVal : bVal - aVal;
      }
      
      return 0;
    });
    return sorted;
  }, [campaigns, campaignsSort]);

  // Paginated campaigns
  const paginatedCampaigns = useMemo(() => {
    const start = (campaignsPage - 1) * campaignsLimit;
    return sortedCampaigns.slice(start, start + campaignsLimit);
  }, [sortedCampaigns, campaignsPage, campaignsLimit]);

  const campaignsPagination = useMemo(() => ({
    page: campaignsPage,
    limit: campaignsLimit,
    total: campaigns.length,
    total_pages: Math.ceil(campaigns.length / campaignsLimit)
  }), [campaignsPage, campaigns.length]);

  // Filtered unsubscribes
  const filteredUnsubscribes = useMemo(() => {
    if (!unsubscribesSearch) return unsubscribes;
    const search = unsubscribesSearch.toLowerCase();
    return unsubscribes.filter(u => 
      u.customer_email.toLowerCase().includes(search) ||
      (u.customer_name && u.customer_name.toLowerCase().includes(search))
    );
  }, [unsubscribes, unsubscribesSearch]);

  // Paginated unsubscribes
  const paginatedUnsubscribes = useMemo(() => {
    const start = (unsubscribesPage - 1) * unsubscribesLimit;
    return filteredUnsubscribes.slice(start, start + unsubscribesLimit);
  }, [filteredUnsubscribes, unsubscribesPage, unsubscribesLimit]);

  const unsubscribesPagination = useMemo(() => ({
    page: unsubscribesPage,
    limit: unsubscribesLimit,
    total: filteredUnsubscribes.length,
    total_pages: Math.ceil(filteredUnsubscribes.length / unsubscribesLimit)
  }), [unsubscribesPage, filteredUnsubscribes.length]);

  // Export report
  const exportReport = useCallback(async (
    reportTypes: ('overview' | 'campaigns' | 'unsubscribes')[],
    format: 'xlsx' | 'csv'
  ): Promise<{ success: boolean; message: string }> => {
    setExporting(true);
    
    // Simulate export
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setExporting(false);
    setExportModalOpen(false);
    
    // Create filename
    const timestamp = new Date().toISOString().replace(/[-:T]/g, '').slice(0, 14);
    const filename = `bao-cao-email_thang-01-2025_${timestamp}.${format}`;
    
    return { 
      success: true, 
      message: `Đã xuất báo cáo thành công: ${filename}` 
    };
  }, []);

  return {
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
    campaigns: paginatedCampaigns,
    allCampaigns: sortedCampaigns,
    campaignsLoading,
    campaignsSort,
    campaignsPagination,
    sortCampaigns,
    setCampaignsPage,
    
    // Unsubscribes
    unsubscribes: paginatedUnsubscribes,
    allUnsubscribes: filteredUnsubscribes,
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
    exportReport,
    
    // Refresh
    refreshData: loadAllData
  };
}