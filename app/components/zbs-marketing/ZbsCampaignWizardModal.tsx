'use client';

import React, { useState, useMemo, useRef } from 'react';
import {
  X,
  Check,
  ChevronRight,
  ChevronLeft,
  Search,
  FileSpreadsheet,
  Download,
  UploadCloud,
  CheckCircle,
  AlertCircle,
  Clock,
  Send,
  MessageSquare,
  Eye,
  Calendar,
  Loader2,
  Save,
  ArrowLeft,
  AlertTriangle
} from 'lucide-react';

// ==================== TYPES ====================
interface ZbsTemplate {
  id: string;
  znsId: string;
  name: string;
  templateType: string;
  oa: string;
  price: string;
  status: 'approved' | 'pending' | 'rejected';
  usageCount: number;
  createdAt: string;
  params: TemplateParam[];
}

interface TemplateParam {
  name: string;
  maxLength: number;
  dataType: 'string' | 'date' | 'number';
}

interface ParsedDataRow {
  [key: string]: string | boolean | string[] | undefined;
  _valid?: boolean;
  _errors?: string[];
}

interface ZbsCampaign {
  id: string;
  name: string;
  status: 'draft' | 'running' | 'paused' | 'scheduled' | 'sent' | 'cancelled';
  recipientCount: number;
  templateId?: string;
  templateName?: string;
  scheduledAt?: string;
  oa?: string;
  createdBy?: string;
  createdAt?: string;
  estimatedCost?: string;
}

interface ZbsCampaignWizardModalProps {
  open: boolean;
  onClose: () => void;
  preSelectedTemplate?: ZbsTemplate | null;
  editCampaign?: ZbsCampaign | null;
  mode?: 'create' | 'edit';
  onSaveDraft?: (campaign: Partial<ZbsCampaign>) => void;
}

// ==================== MOCK DATA ====================
const mockTemplates: ZbsTemplate[] = [
  {
    id: 'zbs-tpl-1',
    znsId: '480001',
    name: 'Chương trình Tết 2026',
    templateType: 'Dạng bảng',
    oa: 'eEvent',
    price: '300đ',
    status: 'approved',
    usageCount: 45,
    createdAt: '28/01/2026',
    params: [
      { name: 'customer_name', maxLength: 200, dataType: 'string' },
      { name: 'phone', maxLength: 30, dataType: 'string' },
      { name: 'invoice_no', maxLength: 30, dataType: 'string' },
      { name: 'invoice_date', maxLength: 20, dataType: 'date' },
      { name: 'series', maxLength: 30, dataType: 'string' },
      { name: 'search_code', maxLength: 30, dataType: 'string' },
    ]
  },
  {
    id: 'zbs-tpl-2',
    znsId: '480002',
    name: 'Follow up khách hàng VIP',
    templateType: 'Dạng bảng',
    oa: 'eEvent',
    price: '300đ',
    status: 'approved',
    usageCount: 23,
    createdAt: '20/01/2026',
    params: [
      { name: 'customer_name', maxLength: 200, dataType: 'string' },
      { name: 'phone', maxLength: 30, dataType: 'string' },
      { name: 'product_name', maxLength: 100, dataType: 'string' },
    ]
  },
  {
    id: 'zbs-tpl-3',
    znsId: '480003',
    name: 'Giới thiệu sản phẩm mới',
    templateType: 'Dạng bảng',
    oa: 'eEvent',
    price: '300đ',
    status: 'pending',
    usageCount: 0,
    createdAt: '30/01/2026',
    params: [
      { name: 'customer_name', maxLength: 200, dataType: 'string' },
      { name: 'phone', maxLength: 30, dataType: 'string' },
    ]
  },
  {
    id: 'zbs-tpl-4',
    znsId: '485941',
    name: 'Chào mừng khách hàng mới',
    templateType: 'Dạng bảng',
    oa: 'eEvent',
    price: '300đ',
    status: 'approved',
    usageCount: 1250,
    createdAt: '15/01/2026',
    params: [
      { name: 'customer_name', maxLength: 200, dataType: 'string' },
      { name: 'phone', maxLength: 30, dataType: 'string' },
      { name: 'welcome_code', maxLength: 20, dataType: 'string' },
    ]
  },
];

// ==================== STEP INDICATOR ====================
function StepIndicator({ currentStep, steps }: { currentStep: number; steps: string[] }) {
  return (
    <div className="flex items-center justify-center gap-2">
      {steps.map((label, index) => {
        const stepNum = index + 1;
        const isActive = currentStep === stepNum;
        const isCompleted = currentStep > stepNum;
        
        return (
          <React.Fragment key={stepNum}>
            <div className="flex items-center gap-2">
              <div
                className={`
                  w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all
                  ${isCompleted ? 'bg-green-500 text-white' : ''}
                  ${isActive ? 'bg-blue-600 text-white ring-4 ring-blue-100' : ''}
                  ${!isActive && !isCompleted ? 'bg-gray-200 text-gray-500' : ''}
                `}
              >
                {isCompleted ? <Check className="w-4 h-4" /> : stepNum}
              </div>
              <span className={`text-sm font-medium hidden md:block ${isActive ? 'text-blue-600' : isCompleted ? 'text-green-600' : 'text-gray-400'}`}>
                {label}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div className={`w-12 h-0.5 ${currentStep > stepNum ? 'bg-green-500' : 'bg-gray-200'}`} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

// ==================== STEP 1: TEMPLATE SELECTION ====================
function Step1TemplateSelection({
  templates,
  selectedTemplate,
  onSelect,
  searchQuery,
  onSearchChange
}: {
  templates: ZbsTemplate[];
  selectedTemplate: ZbsTemplate | null;
  onSelect: (t: ZbsTemplate) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}) {
  const filteredTemplates = useMemo(() => {
    return templates.filter(t =>
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.znsId.includes(searchQuery)
    );
  }, [templates, searchQuery]);

  const getPlaceholderBg = (name: string) => {
    const colors = [
      'from-indigo-500 to-purple-600',
      'from-blue-500 to-cyan-500',
      'from-green-500 to-teal-500',
      'from-orange-500 to-red-500',
      'from-pink-500 to-rose-500',
      'from-violet-500 to-fuchsia-500'
    ];
    return colors[name.length % colors.length];
  };

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Tìm kiếm mẫu theo tên hoặc ID..."
          className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        />
      </div>

      {/* Template Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[400px] overflow-y-auto pr-1">
        {filteredTemplates.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">Không tìm thấy mẫu phù hợp</p>
          </div>
        ) : (
          filteredTemplates.map(template => {
            const isSelected = selectedTemplate?.id === template.id;
            const isDisabled = template.status !== 'approved';
            
            return (
              <div
                key={template.id}
                onClick={() => !isDisabled && onSelect(template)}
                className={`
                  relative rounded-xl border-2 overflow-hidden transition-all
                  ${isDisabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer hover:shadow-md'}
                  ${isSelected ? 'border-blue-500 ring-2 ring-blue-100 shadow-md' : 'border-gray-200 hover:border-gray-300'}
                `}
              >
                {/* Thumbnail */}
                <div className={`h-24 bg-gradient-to-br ${getPlaceholderBg(template.name)} flex items-center justify-center relative`}>
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                    <MessageSquare className="w-5 h-5 text-white" />
                  </div>
                  
                  {/* Usage Badge */}
                  {template.usageCount > 0 && (
                    <span className="absolute top-2 left-2 px-2 py-0.5 bg-yellow-400 text-yellow-900 text-[10px] font-semibold rounded">
                      Đã dùng {template.usageCount} lần
                    </span>
                  )}

                  {/* Status Badge */}
                  {template.status === 'pending' && (
                    <span className="absolute top-2 right-2 px-2 py-0.5 bg-yellow-500 text-white text-[10px] font-medium rounded">
                      Chờ duyệt
                    </span>
                  )}

                  {/* Selected Checkmark */}
                  {isSelected && (
                    <div className="absolute top-2 right-2 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center shadow">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="p-3 bg-white">
                  <h4 className="font-semibold text-gray-900 text-sm truncate mb-2">{template.name}</h4>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-gray-500">ID:</span>
                      <span className="font-medium text-gray-700">{template.znsId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Loại mẫu:</span>
                      <span className="text-gray-700">{template.templateType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">OA:</span>
                      <span className="text-gray-700">{template.oa}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Ngày tạo:</span>
                      <span className="text-gray-700">{template.createdAt}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Giá bán:</span>
                      <span className="font-medium text-green-600">{template.price}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Trạng thái:</span>
                      <span className={`font-medium ${template.status === 'approved' ? 'text-green-600' : 'text-yellow-600'}`}>
                        {template.status === 'approved' ? 'Đã duyệt' : 'Chờ duyệt'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

// ==================== STEP 2: UPLOAD EXCEL ====================
function Step2UploadExcel({
  template,
  checkDuplicates,
  onCheckDuplicatesChange,
  onFileUpload,
  isUploading
}: {
  template: ZbsTemplate;
  checkDuplicates: boolean;
  onCheckDuplicatesChange: (v: boolean) => void;
  onFileUpload: (file: File) => void;
  isUploading: boolean;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) onFileUpload(file);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onFileUpload(file);
  };

  return (
    <div className="space-y-6">
      {/* Params Table */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-1">Nội dung tệp mẫu</h3>
        <p className="text-xs text-gray-500 italic mb-3">
          Dữ liệu trong tập danh sách tải lên cần phải đúng thứ tự cột và quy định về tham số như bên dưới:
        </p>
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-700 border-b border-gray-200">
              <tr>
                <th className="py-2.5 px-4 font-medium">Tên tham số</th>
                <th className="py-2.5 px-4 font-medium">Chiều dài kí tự</th>
                <th className="py-2.5 px-4 font-medium">Loại dữ liệu</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {template.params.map((param, i) => (
                <tr key={i} className="hover:bg-gray-50/50">
                  <td className="py-2.5 px-4 text-gray-900 font-mono text-sm">{param.name}</td>
                  <td className="py-2.5 px-4 text-gray-600">{param.maxLength}</td>
                  <td className="py-2.5 px-4 text-gray-600">{param.dataType}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Download Template */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-2">Tải danh sách mẫu</h3>
        <button className="flex items-center gap-2 px-4 py-2 border border-green-500 text-green-600 rounded-lg font-medium hover:bg-green-50 transition-colors">
          <FileSpreadsheet className="w-5 h-5" />
          Tải file mẫu
          <Download className="w-4 h-4 ml-1" />
        </button>
      </div>

      {/* Upload Section */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-2">Tải lên danh sách</h3>
        <label className="flex items-start gap-2 mb-3 cursor-pointer">
          <input
            type="checkbox"
            checked={checkDuplicates}
            onChange={(e) => onCheckDuplicatesChange(e.target.checked)}
            className="w-4 h-4 mt-0.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <div>
            <span className="text-sm text-gray-800">Kiểm tra số điện thoại trùng lặp trong danh sách tải lên</span>
            <p className="text-xs text-gray-500 italic">(Bỏ chọn nếu bạn muốn chấp nhận các số điện thoại trùng lặp trong danh sách)</p>
          </div>
        </label>

        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`
            w-full border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all
            ${dragOver ? 'border-green-500 bg-green-50' : 'border-green-300 bg-green-50/30 hover:bg-green-50/50'}
            ${isUploading ? 'pointer-events-none' : ''}
          `}
        >
          {isUploading ? (
            <Loader2 className="w-8 h-8 text-green-500 mb-3 animate-spin" />
          ) : (
            <UploadCloud className="w-8 h-8 text-green-500 mb-3" />
          )}
          <span className="text-green-600 font-medium">
            {isUploading ? 'Đang xử lý...' : 'Kéo thả hoặc tải danh sách lên\n (Tối đa 5.000 dòng)'}
          </span>
          <FileSpreadsheet className="w-12 h-12 text-green-600 mt-4 opacity-80" />
          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx,.xls,.csv"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>
      </div>
    </div>
  );
}

// ==================== STEP 3: VERIFY DATA ====================
function Step3VerifyData({
  template,
  data,
  validCount,
  invalidCount
}: {
  template: ZbsTemplate;
  data: ParsedDataRow[];
  validCount: number;
  invalidCount: number;
}) {
  return (
    <div className="space-y-4">
      {/* Status Banner */}
      <div className={`flex items-center gap-3 p-4 rounded-lg border ${invalidCount === 0 ? 'bg-blue-50 border-blue-100' : 'bg-yellow-50 border-yellow-100'}`}>
        {invalidCount === 0 ? (
          <CheckCircle className="w-6 h-6 text-blue-500" />
        ) : (
          <AlertCircle className="w-6 h-6 text-yellow-500" />
        )}
        <div>
          <h3 className={`font-medium ${invalidCount === 0 ? 'text-blue-900' : 'text-yellow-900'}`}>
            {invalidCount === 0 ? 'Đã nạp file dữ liệu thành công' : 'File dữ liệu có một số lỗi'}
          </h3>
          <p className={`text-sm ${invalidCount === 0 ? 'text-blue-700' : 'text-yellow-700'}`}>
            Tìm thấy {validCount} dòng dữ liệu hợp lệ{invalidCount > 0 && `, ${invalidCount} dòng lỗi`}.
          </p>
        </div>
      </div>

      {/* Data Table */}
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto max-h-[300px]">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-gray-50 text-gray-700 border-b border-gray-200 sticky top-0">
              <tr>
                {template.params.map((param, i) => (
                  <th key={i} className="py-2.5 px-4 font-medium capitalize">
                    {param.name.replace(/_/g, ' ')}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {data.map((row, i) => (
                <tr key={i} className={`hover:bg-gray-50/50 ${row._valid === false ? 'bg-red-50' : ''}`}>
                  {template.params.map((param, j) => (
                    <td key={j} className="py-2.5 px-4 text-gray-700">
                      {typeof row[param.name] === 'string' ? row[param.name] : '-'}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ==================== STEP 4: CAMPAIGN SETUP ====================
function Step4CampaignSetup({
  campaignName,
  onCampaignNameChange,
  sendTime,
  onSendTimeChange,
  scheduleDate,
  onScheduleDateChange,
  scheduleTime,
  onScheduleTimeChange
}: {
  campaignName: string;
  onCampaignNameChange: (v: string) => void;
  sendTime: 'now' | 'scheduled';
  onSendTimeChange: (v: 'now' | 'scheduled') => void;
  scheduleDate: string;
  onScheduleDateChange: (v: string) => void;
  scheduleTime: string;
  onScheduleTimeChange: (v: string) => void;
}) {
  return (
    <div className="space-y-6">
      {/* Campaign Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Tên chiến dịch <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={campaignName}
          onChange={(e) => onCampaignNameChange(e.target.value)}
          placeholder="Nhập tên chiến dịch (VD: CSKH tháng 10...)"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        />
      </div>

      {/* Send Time */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">Thời gian gửi chiến dịch</label>
        <div className="space-y-3">
          {/* Send Now */}
          <label
            className={`
              flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all
              ${sendTime === 'now' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue  -200'}
            `}
          >
            <input
              type="radio"
              checked={sendTime === 'now'}
              onChange={() => onSendTimeChange('now')}
              className="mt-1"
            />
            <div className="flex items-start gap-3">
              <Send className={`w-5 h-5 mt-0.5 ${sendTime === 'now' ? 'text-blue-600' : 'text-gray-400'}`} />
              <div>
                <span className="font-medium text-gray-900">Gửi ngay lập tức</span>
                <p className="text-sm text-gray-500">Chiến dịch sẽ được thực thi ngay sau khi tạo thành công.</p>
              </div>
            </div>
          </label>

          {/* Schedule */}
          <label
            className={`
              flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all
              ${sendTime === 'scheduled' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-200'}
            `}
          >
            <input
              type="radio"
              checked={sendTime === 'scheduled'}
              onChange={() => onSendTimeChange('scheduled')}
              className="mt-1"
            />
            <div className="flex items-start gap-3 flex-1">
              <Clock className={`w-5 h-5 mt-0.5 ${sendTime === 'scheduled' ? 'text-blue-600' : 'text-gray-400'}`} />
              <div className="flex-1">
                <span className="font-medium text-gray-900">Hẹn giờ gửi</span>
                <p className="text-sm text-gray-500 mb-3">Lên lịch hệ thống tự động gửi ZNS.</p>
                
                {sendTime === 'scheduled' && (
                  <div className="flex gap-3">
                    <div className="flex-1">
                      <label className="block text-xs text-gray-500 mb-1">Ngày gửi</label>
                      <input
                        type="date"
                        value={scheduleDate}
                        onChange={(e) => onScheduleDateChange(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div className="w-32">
                      <label className="block text-xs text-gray-500 mb-1">Giờ gửi</label>
                      <input
                        type="time"
                        value={scheduleTime}
                        onChange={(e) => onScheduleTimeChange(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </label>
        </div>
      </div>
    </div>
  );
}

// ==================== MAIN COMPONENT ====================
export function ZbsCampaignWizardModal({ 
  open, 
  onClose, 
  preSelectedTemplate,
  editCampaign,
  mode = 'create',
  onSaveDraft
}: ZbsCampaignWizardModalProps) {
  const isEditMode = mode === 'edit' && editCampaign !== null;
  const [step, setStep] = useState(preSelectedTemplate || isEditMode ? 2 : 1);
  
  // Step 1 state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<ZbsTemplate | null>(preSelectedTemplate || null);
  
  // Step 2 state
  const [checkDuplicates, setCheckDuplicates] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  
  // Step 3 state
  const [parsedData, setParsedData] = useState<ParsedDataRow[]>([]);
  const [validCount, setValidCount] = useState(0);
  const [invalidCount, setInvalidCount] = useState(0);
  
  // Step 4 state
  const [campaignName, setCampaignName] = useState(editCampaign?.name || '');
  const [sendTime, setSendTime] = useState<'now' | 'scheduled'>('now');
  const [scheduleDate, setScheduleDate] = useState('');
  const [scheduleTime, setScheduleTime] = useState('09:00');
  
  // Draft save state
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  const steps = ['Chọn mẫu', 'Import file', 'Xác thực dữ liệu', 'Cài đặt thời gian'];

  // Calculate completion progress
  const getCompletionStatus = () => {
    let completed = 0;
    const total = 4;
    
    if (selectedTemplate) completed++;
    if (parsedData.length > 0) completed++;
    if (validCount > 0) completed++;
    if (campaignName.trim()) completed++;
    
    return { completed, total };
  };

  const { completed, total } = getCompletionStatus();
  const isComplete = completed === total && (sendTime === 'now' || (scheduleDate !== '' && scheduleTime !== ''));

  const handleFileUpload = async (file: File) => {
    setIsUploading(true);
    setUploadedFile(file);
    
    // Simulate file parsing
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mock parsed data
    const mockParsed: ParsedDataRow[] = [
      { customer_name: 'Nguyễn Văn A', phone: '0987654321', invoice_no: 'INV001', invoice_date: '05/04/2026', series: 'AB/26E', search_code: 'XYZ123', _valid: true },
      { customer_name: 'Trần Thị B', phone: '0912345678', invoice_no: 'INV002', invoice_date: '05/04/2026', series: 'AB/26E', search_code: 'ABC987', _valid: true },
    ];
    
    setParsedData(mockParsed);
    setValidCount(mockParsed.filter(r => r._valid !== false).length);
    setInvalidCount(mockParsed.filter(r => r._valid === false).length);
    setIsUploading(false);
    setStep(3);
  };

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSaveDraft = async () => {
    setIsSaving(true);
    
    const draftData: Partial<ZbsCampaign> = {
      id: editCampaign?.id || `draft-${Date.now()}`,
      name: campaignName || `Chiến dịch ${new Date().toLocaleDateString('vi-VN')}`,
      status: 'draft',
      recipientCount: validCount,
      templateId: selectedTemplate?.id,
      templateName: selectedTemplate?.name,
    };
    
    // Simulate save
    await new Promise(resolve => setTimeout(resolve, 800));
    
    if (onSaveDraft) {
      onSaveDraft(draftData);
    }
    
    setLastSaved(new Date());
    setIsSaving(false);
  };

  const handleFinish = () => {
    alert(`Chiến dịch "${campaignName}" đã được tạo thành công!`);
    onClose();
  };

  const canProceed = (): boolean => {
    switch (step) {
      case 1: return selectedTemplate !== null;
      case 2: return uploadedFile !== null || parsedData.length > 0;
      case 3: return validCount > 0;
      case 4: return campaignName.trim() !== '' && (sendTime === 'now' || (scheduleDate !== '' && scheduleTime !== ''));
      default: return false;
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[70] bg-gray-50 flex flex-col h-screen overflow-hidden">
      {/* Header - Similar to Email Marketing */}
      <div className="flex-shrink-0 bg-white border-b border-gray-200 px-6 h-16 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <button
            onClick={onClose}
            className="p-2 -ml-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          
          <div className="h-6 w-px bg-gray-300" />
          
          <div>
            <h1 className="text-lg font-semibold text-gray-900">
              {campaignName || (isEditMode ? 'Chỉnh sửa chiến dịch' : 'Chiến dịch ZBS mới')}
            </h1>
            <p className="text-xs text-gray-500">
              {isEditMode ? 'Chỉnh sửa chiến dịch' : 'Tạo chiến dịch mới'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {lastSaved && (
            <span className="text-sm text-gray-500">
              Đã lưu: {lastSaved.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
            </span>
          )}
          <button
            onClick={handleSaveDraft}
            disabled={isSaving}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 rounded-lg font-medium transition-colors shadow-sm disabled:opacity-50"
          >
            {isSaving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span>Lưu nháp</span>
          </button>
          <button
            onClick={handleFinish}
            disabled={!isComplete}
            className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4" />
            <span>Bắt đầu gửi</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto py-8 px-6">
          {/* Progress Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Tiến độ hoàn thành</h2>
                  <p className="text-sm text-gray-500 mt-1">
                    Hoàn thành tất cả các mục để bắt đầu gửi chiến dịch
                  </p>
                </div>
                <div className="text-sm font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                  {completed}/{total} mục bắt buộc
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${(completed / total) * 100}%` }}
                />
              </div>
            </div>
          </div>

          {/* Setup Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Thiết lập chiến dịch</h2>
              <p className="text-sm text-gray-500 mb-6">Hoàn thành các mục sau để gửi ZNS</p>

              {/* Checklist Items */}
              <div className="space-y-3">
                {/* Step 1: Template */}
                <button
                  onClick={() => setStep(1)}
                  className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all hover:shadow-sm ${
                    selectedTemplate ? 'border-green-200 bg-green-50' : 'border-gray-200 hover:border-blue-200'
                  }`}
                >
                  <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                    selectedTemplate ? 'bg-green-500' : 'bg-gray-100'
                  }`}>
                    {selectedTemplate ? (
                      <Check className="w-5 h-5 text-white" />
                    ) : (
                      <MessageSquare className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-900">Mẫu ZNS</span>
                      {!selectedTemplate && <span className="text-xs text-red-500">*Bắt buộc</span>}
                    </div>
                    <p className="text-sm text-gray-500 truncate">
                      {selectedTemplate ? selectedTemplate.name : 'Chọn mẫu tin nhắn ZNS'}
                    </p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </button>

                {/* Step 2: Upload File */}
                <button
                  onClick={() => setStep(2)}
                  disabled={!selectedTemplate}
                  className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all hover:shadow-sm disabled:opacity-50 disabled:cursor-not-allowed ${
                    parsedData.length > 0 ? 'border-green-200 bg-green-50' : 'border-gray-200 hover:border-blue-200'
                  }`}
                >
                  <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                    parsedData.length > 0 ? 'bg-green-500' : 'bg-gray-100'
                  }`}>
                    {parsedData.length > 0 ? (
                      <Check className="w-5 h-5 text-white" />
                    ) : (
                      <FileSpreadsheet className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-900">Danh sách người nhận</span>
                      {parsedData.length === 0 && <span className="text-xs text-red-500">*Bắt buộc</span>}
                    </div>
                    <p className="text-sm text-gray-500">
                      {parsedData.length > 0 ? `${validCount} người nhận hợp lệ` : 'Import file Excel danh sách'}
                    </p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </button>

                {/* Step 3: Verify Data */}
                <button
                  onClick={() => setStep(3)}
                  disabled={parsedData.length === 0}
                  className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all hover:shadow-sm disabled:opacity-50 disabled:cursor-not-allowed ${
                    validCount > 0 ? 'border-green-200 bg-green-50' : 'border-gray-200 hover:border-blue-200'
                  }`}
                >
                  <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                    validCount > 0 ? 'bg-green-500' : 'bg-gray-100'
                  }`}>
                    {validCount > 0 ? (
                      <Check className="w-5 h-5 text-white" />
                    ) : (
                      <CheckCircle className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-900">Xác thực dữ liệu</span>
                      {validCount === 0 && parsedData.length > 0 && <span className="text-xs text-red-500">*Bắt buộc</span>}
                    </div>
                    <p className="text-sm text-gray-500">
                      {validCount > 0 ? `${validCount} dòng hợp lệ, ${invalidCount} lỗi` : 'Kiểm tra và xác nhận dữ liệu'}
                    </p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </button>

                {/* Step 4: Campaign Setup */}
                <button
                  onClick={() => setStep(4)}
                  disabled={validCount === 0}
                  className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all hover:shadow-sm disabled:opacity-50 disabled:cursor-not-allowed ${
                    campaignName.trim() ? 'border-green-200 bg-green-50' : 'border-gray-200 hover:border-blue-200'
                  }`}
                >
                  <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                    campaignName.trim() ? 'bg-green-500' : 'bg-gray-100'
                  }`}>
                    {campaignName.trim() ? (
                      <Check className="w-5 h-5 text-white" />
                    ) : (
                      <Clock className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-900">Tên & thời gian gửi</span>
                      {!campaignName.trim() && <span className="text-xs text-red-500">*Bắt buộc</span>}
                    </div>
                    <p className="text-sm text-gray-500">
                      {campaignName.trim() ? `${campaignName} • ${sendTime === 'now' ? 'Gửi ngay' : 'Hẹn giờ'}` : 'Cài đặt tên và thời gian'}
                    </p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </button>
              </div>
            </div>

            {/* Incomplete Warning */}
            {!isComplete && (
              <div className="px-6 py-4 bg-yellow-50 border-t border-yellow-100">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-yellow-800">Chiến dịch chưa hoàn thành</p>
                    <p className="text-sm text-yellow-700">Vui lòng hoàn thành tất cả các mục bắt buộc trước khi bắt đầu gửi.</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Step Modal */}
      {step > 0 && step <= 4 && (
        <StepModal
          step={step}
          steps={steps}
          onClose={() => setStep(0)}
          onBack={handleBack}
          onNext={handleNext}
          canProceed={canProceed()}
        >
          {step === 1 && (
            <Step1TemplateSelection
              templates={mockTemplates}
              selectedTemplate={selectedTemplate}
              onSelect={(t) => {
                setSelectedTemplate(t);
              }}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
            />
          )}
          
          {step === 2 && selectedTemplate && (
            <Step2UploadExcel
              template={selectedTemplate}
              checkDuplicates={checkDuplicates}
              onCheckDuplicatesChange={setCheckDuplicates}
              onFileUpload={handleFileUpload}
              isUploading={isUploading}
            />
          )}
          
          {step === 3 && selectedTemplate && (
            <Step3VerifyData
              template={selectedTemplate}
              data={parsedData}
              validCount={validCount}
              invalidCount={invalidCount}
            />
          )}
          
          {step === 4 && (
            <Step4CampaignSetup
              campaignName={campaignName}
              onCampaignNameChange={setCampaignName}
              sendTime={sendTime}
              onSendTimeChange={setSendTime}
              scheduleDate={scheduleDate}
              onScheduleDateChange={setScheduleDate}
              scheduleTime={scheduleTime}
              onScheduleTimeChange={setScheduleTime}
            />
          )}
        </StepModal>
      )}
    </div>
  );
}

// Step Modal Component
function StepModal({
  step,
  steps,
  children,
  onClose,
  onBack,
  onNext,
  canProceed
}: {
  step: number;
  steps: string[];
  children: React.ReactNode;
  onClose: () => void;
  onBack: () => void;
  onNext: () => void;
  canProceed: boolean;
}) {
  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/60" onClick={onClose} />
      
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden z-10 max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0 bg-gray-50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
              {step}
            </div>
            <h2 className="text-lg font-semibold text-gray-900">{steps[step - 1]}</h2>
          </div>
          <button onClick={onClose} className="p-2 bg-gray-100 hover:bg-gray-200 text-gray-500 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {children}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50 shrink-0">
          <button
            onClick={step === 1 ? onClose : onBack}
            className="flex items-center gap-2 px-4 py-2 text-gray-700 font-medium hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            {step === 1 ? 'Hủy' : 'Quay lại'}
          </button>
          
          <button
            onClick={() => { onNext(); if (step === 4) onClose(); }}
            disabled={!canProceed}
            className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {step === 4 ? 'Xác nhận' : 'Tiếp tục'}
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default ZbsCampaignWizardModal;
