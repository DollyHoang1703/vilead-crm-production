# TASK 10.2 - THƯ VIỆN MẪU EMAIL
## Complete UI & Data Flow Specification

> **Module**: Email Marketing
> **Task**: 10.2 - Thư viện mẫu Email
> **Mục đích**: Copilot/AI Code Assistant generate đầy đủ UI, logic, data flow
> **Version**: 1.0 | **Date**: 31/01/2025

---

## 📑 MỤC LỤC

1. [DATA MODELS](#1-data-models)
2. [API ENDPOINTS](#2-api-endpoints)
3. [STATE MANAGEMENT](#3-state-management)
4. [UI COMPONENTS CHI TIẾT](#4-ui-components-chi-tiết)
5. [USER FLOWS](#5-user-flows)
6. [UTILITY FUNCTIONS](#6-utility-functions)
7. [MOCK DATA](#7-mock-data)
8. [IMPLEMENTATION CHECKLIST](#8-implementation-checklist)

---

## 1. DATA MODELS

### 1.1 EmailTemplate Model

```typescript
interface EmailTemplate {
  id: string;
  name: string;
  type: 'system' | 'user';
  
  // Content
  content_html: string;
  content_json: TemplateBlock[] | null;  // For drag-drop editor
  editor_mode: 'richtext' | 'dragdrop' | 'html';
  
  // Preview
  thumbnail_url: string;
  
  // Metadata
  owner_id: string | null;       // null for system templates
  category_id: string | null;    // Optional categorization
  
  // Version control
  version: number;
  versions: TemplateVersion[];   // Max 10
  
  // Usage stats
  usage_count: number;           // Số lần sử dụng trong chiến dịch
  
  // Audit
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
}

interface TemplateVersion {
  version: number;
  content_html: string;
  content_json: TemplateBlock[] | null;
  created_at: Date;
  created_by: string;
}

interface TemplateBlock {
  id: string;
  type: BlockType;
  order: number;
  properties: BlockProperties;
}

type BlockType = 
  | 'text'
  | 'image'
  | 'button'
  | 'divider'
  | 'spacer'
  | 'columns'
  | 'social';

// Block Properties by type
interface TextBlockProperties {
  content: string;           // HTML content
  textAlign: 'left' | 'center' | 'right' | 'justify';
  padding: string;           // e.g., "20px"
}

interface ImageBlockProperties {
  src: string;
  alt: string;
  width: string;             // e.g., "100%" or "300px"
  align: 'left' | 'center' | 'right';
  link?: string;
}

interface ButtonBlockProperties {
  text: string;
  link: string;
  backgroundColor: string;
  textColor: string;
  borderRadius: string;
  padding: string;
  align: 'left' | 'center' | 'right';
}

interface DividerBlockProperties {
  style: 'solid' | 'dashed' | 'dotted';
  color: string;
  thickness: string;
  width: string;
}

interface SpacerBlockProperties {
  height: string;            // e.g., "20px"
}

interface ColumnsBlockProperties {
  columns: number;           // 2, 3, or 4
  gap: string;
  children: TemplateBlock[][];  // Array of blocks for each column
}

interface SocialBlockProperties {
  align: 'left' | 'center' | 'right';
  icons: SocialIcon[];
}

interface SocialIcon {
  platform: 'facebook' | 'twitter' | 'instagram' | 'linkedin' | 'youtube' | 'tiktok';
  url: string;
  iconStyle: 'color' | 'black' | 'white';
}
```

### 1.2 TemplateVariable Model

```typescript
interface TemplateVariable {
  key: string;           // e.g., "ten_khach"
  label: string;         // e.g., "Tên khách hàng"
  category: 'customer' | 'order' | 'system';
  sampleValue: string;   // For preview
  description?: string;
}

// Predefined variables
const TEMPLATE_VARIABLES: TemplateVariable[] = [
  // Customer
  { key: 'ten_khach', label: 'Tên khách hàng', category: 'customer', sampleValue: 'Nguyễn Văn A' },
  { key: 'email_khach', label: 'Email', category: 'customer', sampleValue: 'nguyenvana@email.com' },
  { key: 'sdt_khach', label: 'Số điện thoại', category: 'customer', sampleValue: '0901234567' },
  { key: 'cong_ty', label: 'Tên công ty', category: 'customer', sampleValue: 'Công ty ABC' },
  
  // Order
  { key: 'ma_don', label: 'Mã đơn hàng', category: 'order', sampleValue: 'DH-2025-001' },
  { key: 'san_pham', label: 'Sản phẩm', category: 'order', sampleValue: 'Sản phẩm XYZ' },
  { key: 'gia_tri', label: 'Giá trị đơn', category: 'order', sampleValue: '1,500,000 VNĐ' },
  { key: 'ngay_dat', label: 'Ngày đặt', category: 'order', sampleValue: '15/01/2025' },
  
  // System
  { key: 'ngay_hien_tai', label: 'Ngày hiện tại', category: 'system', sampleValue: '31/01/2025' },
  { key: 'ten_cong_ty', label: 'Tên công ty (của bạn)', category: 'system', sampleValue: 'CRM ViLead' }
];
```

---

## 2. API ENDPOINTS

### 2.1 Template APIs

```typescript
// ===== GET: Danh sách templates =====
GET /api/email-marketing/templates
Query Params:
  - type?: 'system' | 'user' | 'all' (default: 'all')
  - search?: string
  - category_id?: string
  - page?: number
  - limit?: number

Response 200:
{
  data: EmailTemplate[],
  pagination: Pagination
}

// ===== GET: Chi tiết template =====
GET /api/email-marketing/templates/:id

Response 200: EmailTemplate

// ===== POST: Tạo template mới =====
POST /api/email-marketing/templates
Body:
{
  name: string,
  content_html: string,
  content_json?: TemplateBlock[],
  editor_mode: 'richtext' | 'dragdrop' | 'html'
}

Response 201: EmailTemplate

// ===== POST: Clone template =====
POST /api/email-marketing/templates/:id/clone

Response 201:
{
  data: EmailTemplate,  // New template with name "[Original] - Copy"
  message: "Đã tạo bản sao thành công"
}

// ===== PUT: Update template =====
PUT /api/email-marketing/templates/:id
Body:
{
  name?: string,
  content_html?: string,
  content_json?: TemplateBlock[]
}

Response 200: EmailTemplate

// ===== DELETE: Delete template =====
DELETE /api/email-marketing/templates/:id

Response 200:
{
  message: "Đã xóa mẫu thành công"
}

Response 400:
{
  error: "TEMPLATE_IN_USE",
  message: "Không thể xóa mẫu đang được sử dụng trong chiến dịch đang chạy"
}

// ===== GET: Version history =====
GET /api/email-marketing/templates/:id/versions

Response 200:
{
  data: TemplateVersion[]
}

// ===== POST: Restore version =====
POST /api/email-marketing/templates/:id/versions/:version/restore

Response 200: EmailTemplate

// ===== POST: Import HTML =====
POST /api/email-marketing/templates/import-html
Body:
{
  html: string,
  name?: string
}
// Note: System will sanitize HTML

Response 201:
{
  data: EmailTemplate,
  warnings?: string[]  // e.g., ["Đã loại bỏ 2 script tags"]
}

// ===== POST: Upload image for template =====
POST /api/email-marketing/templates/upload-image
Body: FormData with file

Response 201:
{
  url: string,
  width: number,
  height: number
}

// ===== GET: Preview with sample data =====
GET /api/email-marketing/templates/:id/preview
Query Params:
  - mode?: 'desktop' | 'mobile'

Response 200:
{
  html: string,  // Rendered HTML with sample data
  variables_used: string[]
}
```

---

## 3. STATE MANAGEMENT

### 3.1 Templates Store

```typescript
interface TemplatesState {
  // List
  templates: EmailTemplate[];
  loading: boolean;
  error: string | null;
  
  // Tabs
  activeTab: 'system' | 'user';
  
  // Search
  searchQuery: string;
  
  // Pagination
  pagination: Pagination;
  
  // Editor
  editor: {
    isOpen: boolean;
    mode: 'create' | 'edit' | 'clone';
    template: EmailTemplate | null;
    isDirty: boolean;
    lastSavedAt: Date | null;
    autoSaveEnabled: boolean;
  };
  
  // Preview
  preview: {
    isOpen: boolean;
    template: EmailTemplate | null;
    mode: 'desktop' | 'mobile';
  };
}

// Actions
type TemplatesAction =
  | { type: 'FETCH_TEMPLATES_START' }
  | { type: 'FETCH_TEMPLATES_SUCCESS'; payload: { data: EmailTemplate[]; pagination: Pagination } }
  | { type: 'FETCH_TEMPLATES_ERROR'; payload: string }
  | { type: 'SET_ACTIVE_TAB'; payload: 'system' | 'user' }
  | { type: 'SET_SEARCH_QUERY'; payload: string }
  | { type: 'OPEN_EDITOR'; payload: { mode: 'create' | 'edit' | 'clone'; template?: EmailTemplate } }
  | { type: 'CLOSE_EDITOR' }
  | { type: 'SET_EDITOR_DIRTY'; payload: boolean }
  | { type: 'SET_LAST_SAVED'; payload: Date }
  | { type: 'OPEN_PREVIEW'; payload: EmailTemplate }
  | { type: 'CLOSE_PREVIEW' }
  | { type: 'SET_PREVIEW_MODE'; payload: 'desktop' | 'mobile' }
  | { type: 'ADD_TEMPLATE'; payload: EmailTemplate }
  | { type: 'UPDATE_TEMPLATE'; payload: EmailTemplate }
  | { type: 'DELETE_TEMPLATE'; payload: string };
```

---

## 4. UI COMPONENTS CHI TIẾT

### 4.1 Trang Thư viện mẫu (TemplateLibraryPage)

**Route**: `/email-marketing/templates`

**Component Structure**:
```
TemplateLibraryPage
├── PageHeader
│   ├── Breadcrumb
│   └── Title: "Thư viện mẫu"
├── TabBar
│   ├── Tab: "Mẫu Email có sẵn" (system)
│   └── Tab: "Mẫu Email của bạn" (user)
├── SearchBar
├── TemplateGrid
│   ├── CreateNewCard (only in "user" tab)
│   └── TemplateCard (multiple)
├── Pagination
└── Modals
    ├── PreviewModal
    ├── DeleteConfirmModal
    └── ImportHTMLModal
```

```tsx
function TemplateLibraryPage() {
  const { 
    templates, 
    loading, 
    activeTab, 
    searchQuery,
    pagination,
    setActiveTab,
    setSearchQuery
  } = useTemplates();
  
  return (
    <div className="p-6">
      <PageHeader
        breadcrumb={[
          { label: "Email Marketing", href: "/email-marketing" },
          { label: "Thư viện mẫu" }
        ]}
        title="Thư viện mẫu"
      />
      
      {/* Tabs */}
      <TabBar className="mb-6">
        <Tab 
          active={activeTab === 'system'}
          onClick={() => setActiveTab('system')}
          icon={<FolderIcon />}
        >
          Mẫu Email có sẵn
        </Tab>
        <Tab 
          active={activeTab === 'user'}
          onClick={() => setActiveTab('user')}
          icon={<UserIcon />}
        >
          Mẫu Email của bạn
        </Tab>
      </TabBar>
      
      {/* Search */}
      <SearchInput
        placeholder="Tìm kiếm theo tên mẫu..."
        value={searchQuery}
        onChange={setSearchQuery}
        className="w-80 mb-6"
      />
      
      {/* Grid */}
      {loading ? (
        <TemplateGridSkeleton />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {/* Create New Card - only in user tab */}
          {activeTab === 'user' && (
            <CreateNewTemplateCard onClick={() => navigateToEditor('create')} />
          )}
          
          {/* Template Cards */}
          {templates.map(template => (
            <TemplateCard
              key={template.id}
              template={template}
              showEditActions={activeTab === 'user'}
            />
          ))}
        </div>
      )}
      
      {/* Empty State */}
      {!loading && templates.length === 0 && (
        <EmptyState
          icon={<InboxIcon />}
          title={activeTab === 'user' ? "Bạn chưa có mẫu email nào" : "Không tìm thấy mẫu"}
          description={activeTab === 'user' ? "Tạo mẫu đầu tiên hoặc clone từ mẫu có sẵn" : "Thử tìm với từ khóa khác"}
          action={activeTab === 'user' && (
            <Button onClick={() => navigateToEditor('create')}>
              + Tạo mẫu mới
            </Button>
          )}
        />
      )}
      
      <Pagination
        current={pagination.page}
        total={pagination.total_pages}
        onChange={(page) => fetchTemplates({ page })}
        className="mt-6"
      />
    </div>
  );
}
```

### 4.2 CreateNewTemplateCard Component

```tsx
function CreateNewTemplateCard({ onClick }: { onClick: () => void }) {
  return (
    <Card
      className="cursor-pointer hover:border-primary-500 hover:shadow-md transition-all group"
      onClick={onClick}
    >
      <CardBody className="flex flex-col items-center justify-center h-64 text-center">
        <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center mb-4 group-hover:bg-primary-200 transition-colors">
          <PlusIcon className="w-8 h-8 text-primary-600" />
        </div>
        <h3 className="font-semibold text-gray-900 mb-2">Tạo mới</h3>
        <p className="text-sm text-gray-500">
          Thỏa sức sáng tạo nội dung email của riêng bạn
        </p>
      </CardBody>
    </Card>
  );
}
```

### 4.3 TemplateCard Component

```tsx
interface TemplateCardProps {
  template: EmailTemplate;
  showEditActions: boolean;
}

function TemplateCard({ template, showEditActions }: TemplateCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <Card
      className="overflow-hidden cursor-pointer group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Thumbnail */}
      <div className="relative h-48 bg-gray-100 overflow-hidden">
        <img
          src={template.thumbnail_url}
          alt={template.name}
          className="w-full h-full object-cover object-top"
        />
        
        {/* Hover Overlay */}
        <div className={`
          absolute inset-0 bg-black/50 flex items-center justify-center gap-3
          transition-opacity duration-200
          ${isHovered ? 'opacity-100' : 'opacity-0'}
        `}>
          <Button
            variant="white"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              openPreview(template);
            }}
          >
            <EyeIcon className="w-4 h-4 mr-1" />
            Xem trước
          </Button>
          <Button
            variant="white"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              cloneTemplate(template);
            }}
          >
            <CopyIcon className="w-4 h-4 mr-1" />
            Tạo bản sao
          </Button>
        </div>
        
        {/* System Badge */}
        {template.type === 'system' && (
          <Badge className="absolute top-2 left-2" variant="info">
            Mẫu có sẵn
          </Badge>
        )}
      </div>
      
      {/* Info */}
      <CardBody className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-gray-900 truncate">
              {template.name}
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              {formatDate(template.updated_at, 'DD/MM/YYYY')}
            </p>
          </div>
          
          {/* Actions Menu (only for user templates) */}
          {showEditActions && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreIcon className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => editTemplate(template)}>
                  <EditIcon className="w-4 h-4 mr-2" />
                  Chỉnh sửa
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => cloneTemplate(template)}>
                  <CopyIcon className="w-4 h-4 mr-2" />
                  Tạo bản sao
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={() => openDeleteModal(template)}
                  className="text-red-600"
                >
                  <TrashIcon className="w-4 h-4 mr-2" />
                  Xóa
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </CardBody>
    </Card>
  );
}
```

### 4.4 PreviewModal Component

```tsx
interface PreviewModalProps {
  open: boolean;
  onClose: () => void;
  template: EmailTemplate | null;
}

function PreviewModal({ open, onClose, template }: PreviewModalProps) {
  const [mode, setMode] = useState<'desktop' | 'mobile'>('desktop');
  const [renderedHtml, setRenderedHtml] = useState<string>('');
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    if (template) {
      loadPreview();
    }
  }, [template, mode]);
  
  const loadPreview = async () => {
    setLoading(true);
    try {
      const result = await api.get(`/email-marketing/templates/${template.id}/preview?mode=${mode}`);
      setRenderedHtml(result.html);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Modal open={open} onClose={onClose} size="xl">
      <ModalHeader>
        <div className="flex items-center justify-between w-full">
          <ModalTitle>{template?.name}</ModalTitle>
          
          {/* Device Toggle */}
          <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
            <Button
              variant={mode === 'desktop' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setMode('desktop')}
            >
              <DesktopIcon className="w-4 h-4 mr-1" />
              Desktop
            </Button>
            <Button
              variant={mode === 'mobile' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setMode('mobile')}
            >
              <MobileIcon className="w-4 h-4 mr-1" />
              Mobile
            </Button>
          </div>
        </div>
      </ModalHeader>
      
      <ModalBody className="p-0">
        <div className={`
          mx-auto bg-white shadow-lg overflow-auto
          ${mode === 'desktop' ? 'w-full max-w-[600px]' : 'w-[375px]'}
        `}
        style={{ height: '70vh' }}
        >
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <Spinner />
            </div>
          ) : (
            <div 
              className="p-4"
              dangerouslySetInnerHTML={{ __html: renderedHtml }}
            />
          )}
        </div>
        
        {/* Variables Legend */}
        <div className="p-4 bg-gray-50 border-t">
          <p className="text-sm text-gray-600">
            <InfoIcon className="w-4 h-4 inline mr-1" />
            Các biến động được hiển thị với dữ liệu mẫu. 
            Khi gửi thực tế, biến sẽ được thay thế bằng dữ liệu khách hàng.
          </p>
        </div>
      </ModalBody>
      
      <ModalFooter>
        <Button variant="ghost" onClick={onClose}>
          Đóng
        </Button>
        <Button variant="outline" onClick={() => cloneTemplate(template)}>
          <CopyIcon className="w-4 h-4 mr-1" />
          Tạo bản sao
        </Button>
        <Button variant="primary" onClick={() => useTemplate(template)}>
          Sử dụng ngay
        </Button>
      </ModalFooter>
    </Modal>
  );
}
```

### 4.5 TemplateEditorPage Component

**Route**: `/email-marketing/templates/new` hoặc `/email-marketing/templates/:id/edit`

```tsx
function TemplateEditorPage() {
  const { id } = useParams();
  const isEditMode = !!id;
  
  const [template, setTemplate] = useState<Partial<EmailTemplate>>({
    name: '',
    content_html: '',
    content_json: [],
    editor_mode: 'richtext'
  });
  const [editorMode, setEditorMode] = useState<'richtext' | 'dragdrop'>('richtext');
  const [isDirty, setIsDirty] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [saving, setSaving] = useState(false);
  
  // Auto-save every 30 seconds
  useEffect(() => {
    if (!isDirty) return;
    
    const timer = setTimeout(() => {
      autoSave();
    }, 30000);
    
    return () => clearTimeout(timer);
  }, [template, isDirty]);
  
  // Warn on unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);
  
  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b bg-white">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={handleBack}>
            <ArrowLeftIcon className="w-4 h-4 mr-1" />
            Quay lại
          </Button>
          
          {lastSaved && (
            <span className="text-sm text-gray-500">
              💾 Đã lưu lúc {formatTime(lastSaved)}
            </span>
          )}
        </div>
        
        <div className="flex items-center gap-3">
          {/* Editor Mode Toggle */}
          <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
            <Button
              variant={editorMode === 'richtext' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setEditorMode('richtext')}
            >
              <EditIcon className="w-4 h-4 mr-1" />
              Editor
            </Button>
            <Button
              variant={editorMode === 'dragdrop' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setEditorMode('dragdrop')}
            >
              <GridIcon className="w-4 h-4 mr-1" />
              Kéo thả
            </Button>
          </div>
          
          <Button variant="outline" onClick={openPreview}>
            <EyeIcon className="w-4 h-4 mr-1" />
            Xem trước
          </Button>
          
          <Button variant="outline" onClick={openImportHTML}>
            <CodeIcon className="w-4 h-4 mr-1" />
            Import HTML
          </Button>
          
          <Button variant="primary" onClick={handleSave} loading={saving}>
            Lưu và tiếp tục
          </Button>
        </div>
      </div>
      
      {/* Editor Body */}
      <div className="flex-1 overflow-hidden">
        {/* Template Name */}
        <div className="px-6 py-4 border-b bg-gray-50">
          <FormField label="Tên thư mẫu" required>
            <Input
              value={template.name}
              onChange={(e) => {
                setTemplate({ ...template, name: e.target.value });
                setIsDirty(true);
              }}
              placeholder="Nhập tên mẫu email..."
              className="max-w-md"
            />
          </FormField>
        </div>
        
        {/* Editor Area */}
        <div className="flex-1 overflow-hidden">
          {editorMode === 'richtext' ? (
            <RichTextEditor
              value={template.content_html}
              onChange={(html) => {
                setTemplate({ ...template, content_html: html });
                setIsDirty(true);
              }}
              variables={TEMPLATE_VARIABLES}
            />
          ) : (
            <DragDropEditor
              blocks={template.content_json || []}
              onChange={(blocks) => {
                setTemplate({ 
                  ...template, 
                  content_json: blocks,
                  content_html: blocksToHtml(blocks)
                });
                setIsDirty(true);
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
```

### 4.6 RichTextEditor Component

```tsx
interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  variables: TemplateVariable[];
}

function RichTextEditor({ value, onChange, variables }: RichTextEditorProps) {
  const editorRef = useRef<Editor>(null);
  
  const toolbarConfig = {
    options: ['inline', 'blockType', 'fontSize', 'fontFamily', 'list', 'textAlign', 'colorPicker', 'link', 'image', 'history'],
    inline: {
      options: ['bold', 'italic', 'underline', 'strikethrough']
    },
    blockType: {
      options: ['Normal', 'H1', 'H2', 'H3', 'Blockquote']
    },
    fontSize: {
      options: [8, 10, 12, 14, 16, 18, 20, 24, 28, 32, 36]
    },
    textAlign: {
      options: ['left', 'center', 'right', 'justify']
    },
    list: {
      options: ['unordered', 'ordered']
    }
  };
  
  const insertVariable = (variable: TemplateVariable) => {
    const variableTag = `{${variable.key}}`;
    // Insert at cursor position
    editorRef.current?.insertText(variableTag);
  };
  
  return (
    <div className="h-full flex flex-col">
      {/* Custom Toolbar Extension */}
      <div className="flex items-center gap-2 px-4 py-2 border-b bg-gray-50">
        <span className="text-sm text-gray-600">Chèn:</span>
        
        {/* Variables Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <VariableIcon className="w-4 h-4 mr-1" />
              Cá nhân hóa
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-64">
            {/* Customer Variables */}
            <DropdownMenuLabel>👤 Khách hàng</DropdownMenuLabel>
            {variables.filter(v => v.category === 'customer').map(v => (
              <DropdownMenuItem key={v.key} onClick={() => insertVariable(v)}>
                <code className="text-primary-600">{`{${v.key}}`}</code>
                <span className="ml-2 text-gray-500">- {v.label}</span>
              </DropdownMenuItem>
            ))}
            
            <DropdownMenuSeparator />
            
            {/* Order Variables */}
            <DropdownMenuLabel>📦 Đơn hàng</DropdownMenuLabel>
            {variables.filter(v => v.category === 'order').map(v => (
              <DropdownMenuItem key={v.key} onClick={() => insertVariable(v)}>
                <code className="text-primary-600">{`{${v.key}}`}</code>
                <span className="ml-2 text-gray-500">- {v.label}</span>
              </DropdownMenuItem>
            ))}
            
            <DropdownMenuSeparator />
            
            {/* System Variables */}
            <DropdownMenuLabel>⚙️ Hệ thống</DropdownMenuLabel>
            {variables.filter(v => v.category === 'system').map(v => (
              <DropdownMenuItem key={v.key} onClick={() => insertVariable(v)}>
                <code className="text-primary-600">{`{${v.key}}`}</code>
                <span className="ml-2 text-gray-500">- {v.label}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        
        {/* System Fields Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <SettingsIcon className="w-4 h-4 mr-1" />
              Trường hệ thống
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => insertUnsubscribeLink()}>
              Link hủy đăng ký
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => insertViewInBrowser()}>
              Xem trong trình duyệt
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      {/* Editor */}
      <div className="flex-1 overflow-auto p-4">
        <Editor
          ref={editorRef}
          editorState={editorState}
          onEditorStateChange={handleEditorChange}
          toolbar={toolbarConfig}
          editorClassName="min-h-[400px] prose max-w-none"
        />
      </div>
    </div>
  );
}
```

### 4.7 DragDropEditor Component

```tsx
interface DragDropEditorProps {
  blocks: TemplateBlock[];
  onChange: (blocks: TemplateBlock[]) => void;
}

function DragDropEditor({ blocks, onChange }: DragDropEditorProps) {
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  
  const blockTypes: { type: BlockType; icon: React.FC; label: string }[] = [
    { type: 'text', icon: TextIcon, label: 'Text' },
    { type: 'image', icon: ImageIcon, label: 'Image' },
    { type: 'button', icon: ButtonIcon, label: 'Button' },
    { type: 'divider', icon: MinusIcon, label: 'Divider' },
    { type: 'spacer', icon: SpaceIcon, label: 'Spacer' },
    { type: 'columns', icon: ColumnsIcon, label: 'Columns' },
    { type: 'social', icon: ShareIcon, label: 'Social' }
  ];
  
  const handleDrop = (item: { type: BlockType }, monitor: any) => {
    const newBlock: TemplateBlock = {
      id: generateId(),
      type: item.type,
      order: blocks.length,
      properties: getDefaultProperties(item.type)
    };
    onChange([...blocks, newBlock]);
  };
  
  return (
    <div className="h-full flex">
      {/* Blocks Panel (Left) */}
      <div className="w-64 border-r bg-gray-50 p-4 overflow-auto">
        <h3 className="font-medium text-gray-700 mb-4">Blocks</h3>
        
        <div className="space-y-2">
          {blockTypes.map(({ type, icon: Icon, label }) => (
            <DraggableBlock key={type} type={type}>
              <div className="flex items-center gap-3 p-3 bg-white rounded-lg border hover:border-primary-500 hover:shadow cursor-move">
                <Icon className="w-5 h-5 text-gray-400" />
                <span className="text-sm">{label}</span>
              </div>
            </DraggableBlock>
          ))}
        </div>
      </div>
      
      {/* Canvas (Center) */}
      <div className="flex-1 overflow-auto p-6 bg-gray-100">
        <DropZone onDrop={handleDrop}>
          <div className="max-w-[600px] mx-auto bg-white shadow-lg min-h-[600px]">
            {blocks.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-gray-400 border-2 border-dashed m-4 rounded-lg">
                <DropIcon className="w-12 h-12 mb-2" />
                <p>Kéo block vào đây để bắt đầu</p>
              </div>
            ) : (
              <SortableList
                items={blocks}
                onReorder={(newBlocks) => onChange(newBlocks)}
                renderItem={(block) => (
                  <BlockRenderer
                    block={block}
                    isSelected={selectedBlockId === block.id}
                    onSelect={() => setSelectedBlockId(block.id)}
                    onDelete={() => removeBlock(block.id)}
                    onUpdate={(props) => updateBlockProperties(block.id, props)}
                  />
                )}
              />
            )}
          </div>
        </DropZone>
      </div>
      
      {/* Properties Panel (Right) - Show when block selected */}
      {selectedBlockId && (
        <div className="w-80 border-l bg-white p-4 overflow-auto">
          <BlockPropertiesPanel
            block={blocks.find(b => b.id === selectedBlockId)!}
            onChange={(props) => updateBlockProperties(selectedBlockId, props)}
          />
        </div>
      )}
    </div>
  );
}
```

### 4.8 ImportHTMLModal Component

```tsx
function ImportHTMLModal({ open, onClose, onImport }) {
  const [importMode, setImportMode] = useState<'upload' | 'paste'>('upload');
  const [htmlContent, setHtmlContent] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [warnings, setWarnings] = useState<string[]>([]);
  
  const handleFileUpload = (file: File) => {
    if (file.size > 500 * 1024) {
      toast.error('File không được vượt quá 500KB');
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => {
      setHtmlContent(e.target?.result as string);
      setFile(file);
    };
    reader.readAsText(file);
  };
  
  const handlePreview = async () => {
    setLoading(true);
    try {
      const result = await api.post('/email-marketing/templates/import-html', {
        html: htmlContent,
        preview_only: true
      });
      setPreview(result.sanitized_html);
      setWarnings(result.warnings || []);
    } finally {
      setLoading(false);
    }
  };
  
  const handleImport = async () => {
    setLoading(true);
    try {
      const result = await api.post('/email-marketing/templates/import-html', {
        html: htmlContent
      });
      toast.success('Import thành công');
      onImport(result.data);
      onClose();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Modal open={open} onClose={onClose} size="lg">
      <ModalHeader>
        <ModalTitle>Import HTML</ModalTitle>
      </ModalHeader>
      
      <ModalBody>
        {/* Import Mode Tabs */}
        <TabBar className="mb-4">
          <Tab active={importMode === 'upload'} onClick={() => setImportMode('upload')}>
            Upload file
          </Tab>
          <Tab active={importMode === 'paste'} onClick={() => setImportMode('paste')}>
            Paste code
          </Tab>
        </TabBar>
        
        {importMode === 'upload' ? (
          <FileDropzone
            accept=".html"
            maxSize={500 * 1024}
            onDrop={(files) => handleFileUpload(files[0])}
            className="h-40"
          >
            <div className="text-center">
              <UploadIcon className="w-10 h-10 text-gray-400 mx-auto mb-2" />
              <p>Kéo thả file .html vào đây</p>
              <p className="text-sm text-gray-500">hoặc click để chọn file (max 500KB)</p>
            </div>
          </FileDropzone>
        ) : (
          <Textarea
            value={htmlContent}
            onChange={(e) => setHtmlContent(e.target.value)}
            placeholder="Paste HTML code vào đây..."
            rows={10}
            className="font-mono text-sm"
          />
        )}
        
        {/* Warnings */}
        {warnings.length > 0 && (
          <Alert variant="warning" className="mt-4">
            <p className="font-medium">Lưu ý:</p>
            <ul className="list-disc list-inside text-sm mt-1">
              {warnings.map((w, i) => <li key={i}>{w}</li>)}
            </ul>
          </Alert>
        )}
        
        {/* Security Notice */}
        <Alert variant="info" className="mt-4">
          <SecurityIcon className="w-4 h-4" />
          <span className="ml-2">
            Vì lý do bảo mật, các thẻ script, onclick, onerror sẽ được tự động loại bỏ.
          </span>
        </Alert>
        
        {/* Preview */}
        {preview && (
          <div className="mt-4">
            <h4 className="font-medium mb-2">Preview:</h4>
            <div 
              className="border rounded-lg p-4 max-h-60 overflow-auto bg-white"
              dangerouslySetInnerHTML={{ __html: preview }}
            />
          </div>
        )}
      </ModalBody>
      
      <ModalFooter>
        <Button variant="ghost" onClick={onClose}>Hủy</Button>
        {!preview && (
          <Button 
            variant="outline" 
            onClick={handlePreview}
            disabled={!htmlContent}
            loading={loading}
          >
            Xem trước
          </Button>
        )}
        <Button 
          variant="primary" 
          onClick={handleImport}
          disabled={!htmlContent}
          loading={loading}
        >
          Import và lưu
        </Button>
      </ModalFooter>
    </Modal>
  );
}
```

---

## 5. USER FLOWS

### 5.1 Flow: Xem thư viện mẫu

```
1. User truy cập /email-marketing/templates
   ↓
2. Mặc định hiển thị tab "Mẫu Email có sẵn"
   ↓
3. System load danh sách templates (type = 'system')
   ↓
4. Hiển thị grid cards với thumbnail
   ↓
5. User hover vào card → Hiện overlay với buttons:
   - "Xem trước"
   - "Tạo bản sao"
```

### 5.2 Flow: Xem trước mẫu

```
1. User click "Xem trước" trên card
   ↓
2. Preview Modal mở
   ↓
3. System load rendered HTML với sample data
   ↓
4. User toggle Desktop/Mobile để xem responsive
   ↓
5. User quyết định:
   [Click "Đóng"] → Đóng modal
   [Click "Tạo bản sao"] → Clone template (Flow B5.3)
   [Click "Sử dụng ngay"] → Redirect to campaign creation
```

### 5.3 Flow: Tạo bản sao (Clone)

```
1. User click "Tạo bản sao" (từ card hoặc preview)
   ↓
2. System tạo bản sao:
   - name: "[Tên gốc] - Copy"
   - type: 'user'
   - owner_id: current user
   ↓
3. Toast: "Đã tạo bản sao thành công"
   ↓
4. Redirect to Editor page với template mới
   ↓
5. User chỉnh sửa và lưu
```

### 5.4 Flow: Tạo mẫu mới

```
1. User click "+ Tạo mới" card (trong tab "Mẫu của bạn")
   ↓
2. Redirect to /email-marketing/templates/new
   ↓
3. Editor page mở (Rich Text mode mặc định)
   ↓
4. User nhập:
   - Tên mẫu (required)
   - Nội dung email
   ↓
5. [Auto-save] Mỗi 30 giây
   ↓
6. User click "Lưu và tiếp tục"
   ↓
7. System validates:
   - Name not empty ✓
   - Content not empty ✓
   ↓
8. System saves template
   ↓
9. Toast: "Lưu mẫu thành công"
   ↓
10. Redirect to template library (tab "Mẫu của bạn")
```

### 5.5 Flow: Import HTML

```
1. User click "Import HTML" trong Editor
   ↓
2. Import Modal mở
   ↓
3. User chọn:
   [Upload file] → Kéo thả hoặc chọn file .html (max 500KB)
   [Paste code] → Paste HTML vào textarea
   ↓
4. User click "Xem trước"
   ↓
5. System sanitizes HTML:
   - Remove <script> tags
   - Remove onclick, onerror, etc.
   - Convert relative URLs
   ↓
6. Hiển thị preview + warnings (nếu có)
   ↓
7. User click "Import và lưu"
   ↓
8. System saves sanitized HTML
   ↓
9. Modal đóng, Editor load content mới
```

---

---

# 6. UTILITY FUNCTIONS

```typescript
// Format date
function formatDate(date: Date | string, format: string = 'DD/MM/YYYY'): string {
  return dayjs(date).format(format);
}

// Format time
function formatTime(date: Date | string): string {
  return dayjs(date).format('HH:mm');
}

// Generate unique ID
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Replace variables in template
function replaceVariables(html: string, data: Record<string, string>): string {
  return html.replace(/\{(\w+)(?:\|([^}]+))?\}/g, (match, key, fallback) => {
    return data[key] || fallback || '';
  });
}

// Sanitize HTML
function sanitizeHTML(html: string): { sanitized: string; warnings: string[] } {
  const warnings: string[] = [];
  
  // Remove script tags
  let sanitized = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, () => {
    warnings.push('Đã loại bỏ script tags');
    return '';
  });
  
  // Remove event handlers
  sanitized = sanitized.replace(/\s(on\w+)="[^"]*"/gi, () => {
    warnings.push('Đã loại bỏ event handlers (onclick, onerror, ...)');
    return '';
  });
  
  return { sanitized, warnings: [...new Set(warnings)] };
}
```

---

# 7. MOCK DATA

## 7.1 Email Templates Mock Data

```typescript
export const MOCK_TEMPLATES: EmailTemplate[] = [
  // System Templates
  {
    id: 'tpl-sys-001',
    name: 'Chào mừng khách hàng mới',
    type: 'system',
    content_html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #333;">Xin chào {ten_khach|Quý khách}!</h1>
        <p>Chào mừng bạn đến với {ten_cong_ty}.</p>
        <p>Chúng tôi rất vui được phục vụ bạn.</p>
        <a href="#" style="display: inline-block; padding: 12px 24px; background: #4F46E5; color: white; text-decoration: none; border-radius: 6px;">Khám phá ngay</a>
      </div>
    `,
    content_json: null,
    editor_mode: 'richtext',
    thumbnail_url: '/templates/thumbnails/welcome.png',
    owner_id: null,
    category_id: 'cat-welcome',
    version: 1,
    versions: [],
    usage_count: 156,
    created_at: new Date('2024-01-01T00:00:00Z'),
    updated_at: new Date('2024-06-15T00:00:00Z'),
    deleted_at: null
  },
  {
    id: 'tpl-sys-002',
    name: 'Khuyến mãi đặc biệt',
    type: 'system',
    content_html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px; text-align: center;">
          <h1 style="color: white; margin: 0;">🎉 ƯU ĐÃI ĐẶC BIỆT</h1>
        </div>
        <div style="padding: 30px;">
          <p>Xin chào {ten_khach},</p>
          <p>Chúng tôi có ưu đãi đặc biệt dành riêng cho bạn!</p>
          <div style="text-align: center; margin: 30px 0;">
            <span style="font-size: 48px; font-weight: bold; color: #E53E3E;">GIẢM 30%</span>
          </div>
          <a href="#" style="display: block; text-align: center; padding: 15px; background: #E53E3E; color: white; text-decoration: none; border-radius: 8px;">Nhận ưu đãi ngay</a>
        </div>
      </div>
    `,
    content_json: null,
    editor_mode: 'richtext',
    thumbnail_url: '/templates/thumbnails/promo.png',
    owner_id: null,
    category_id: 'cat-promo',
    version: 2,
    versions: [],
    usage_count: 89,
    created_at: new Date('2024-01-15T00:00:00Z'),
    updated_at: new Date('2024-08-20T00:00:00Z'),
    deleted_at: null
  },
  {
    id: 'tpl-sys-003',
    name: 'Xác nhận đơn hàng',
    type: 'system',
    content_html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #10B981;">✅ Đơn hàng đã được xác nhận</h2>
        <p>Xin chào {ten_khach},</p>
        <p>Cảm ơn bạn đã đặt hàng. Đơn hàng của bạn đã được xác nhận.</p>
        <div style="background: #F3F4F6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Mã đơn hàng:</strong> {ma_don}</p>
          <p><strong>Sản phẩm:</strong> {san_pham}</p>
          <p><strong>Giá trị:</strong> {gia_tri}</p>
          <p><strong>Ngày đặt:</strong> {ngay_dat}</p>
        </div>
        <p>Chúng tôi sẽ thông báo khi đơn hàng được giao.</p>
      </div>
    `,
    content_json: null,
    editor_mode: 'richtext',
    thumbnail_url: '/templates/thumbnails/order-confirm.png',
    owner_id: null,
    category_id: 'cat-transactional',
    version: 1,
    versions: [],
    usage_count: 234,
    created_at: new Date('2024-02-01T00:00:00Z'),
    updated_at: new Date('2024-02-01T00:00:00Z'),
    deleted_at: null
  },
  
  // User Templates
  {
    id: 'tpl-user-001',
    name: 'Chiến dịch Tết 2025',
    type: 'user',
    content_html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <img src="/images/tet-banner.jpg" style="width: 100%;" alt="Tết 2025" />
        <div style="padding: 30px; text-align: center;">
          <h1 style="color: #DC2626;">🧧 CHÚC MỪNG NĂM MỚI 2025</h1>
          <p>{ten_khach} thân mến,</p>
          <p>Nhân dịp Xuân Ất Tỵ, {ten_cong_ty} xin gửi đến bạn lời chúc tốt đẹp nhất!</p>
          <p style="font-size: 24px;">🎊 Ưu đãi đến 50% 🎊</p>
          <a href="#" style="display: inline-block; padding: 15px 30px; background: #DC2626; color: white; text-decoration: none; border-radius: 8px; margin-top: 20px;">Xem ưu đãi Tết</a>
        </div>
      </div>
    `,
    content_json: null,
    editor_mode: 'richtext',
    thumbnail_url: '/templates/thumbnails/user/tet-2025.png',
    owner_id: 'user-001',
    category_id: null,
    version: 3,
    versions: [
      {
        version: 1,
        content_html: '...',
        content_json: null,
        created_at: new Date('2025-01-20T10:00:00Z'),
        created_by: 'user-001'
      },
      {
        version: 2,
        content_html: '...',
        content_json: null,
        created_at: new Date('2025-01-25T14:00:00Z'),
        created_by: 'user-001'
      }
    ],
    usage_count: 5,
    created_at: new Date('2025-01-20T10:00:00Z'),
    updated_at: new Date('2025-01-30T16:00:00Z'),
    deleted_at: null
  },
  {
    id: 'tpl-user-002',
    name: 'Newsletter tháng 1',
    type: 'user',
    content_html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #1F2937; color: white; padding: 30px; text-align: center;">
          <h1>📰 BẢN TIN THÁNG 1/2025</h1>
        </div>
        <div style="padding: 30px;">
          <p>Xin chào {ten_khach},</p>
          <p>Đây là những cập nhật quan trọng trong tháng qua:</p>
          <ul>
            <li>Tính năng mới: Email Marketing</li>
            <li>Cập nhật: Cải thiện hiệu suất</li>
            <li>Sắp ra mắt: Tích hợp Zalo OA</li>
          </ul>
          <p>Cảm ơn bạn đã đồng hành cùng chúng tôi!</p>
        </div>
      </div>
    `,
    content_json: null,
    editor_mode: 'richtext',
    thumbnail_url: '/templates/thumbnails/user/newsletter-jan.png',
    owner_id: 'user-001',
    category_id: null,
    version: 1,
    versions: [],
    usage_count: 1,
    created_at: new Date('2025-01-28T09:00:00Z'),
    updated_at: new Date('2025-01-28T09:00:00Z'),
    deleted_at: null
  }
];
```


## 7.2 Users Mock Data (for permissions)

```typescript
export const MOCK_USERS = [
  { id: 'user-001', name: 'Nguyễn Văn Admin', email: 'admin@vilead.vn', role: 'admin' },
  { id: 'user-002', name: 'Trần Thị Leader', email: 'leader@vilead.vn', role: 'leader' },
  { id: 'user-003', name: 'Lê Văn Sales', email: 'sales@vilead.vn', role: 'user' },
  { id: 'user-004', name: 'Phạm Thị Marketing', email: 'marketing@vilead.vn', role: 'user' },
  { id: 'user-005', name: 'Hoàng Văn Support', email: 'support@vilead.vn', role: 'user' }
];
```

---

# 8. IMPLEMENTATION CHECKLIST

- [ ] TemplateLibraryPage component
- [ ] TabBar component
- [ ] CreateNewTemplateCard component
- [ ] TemplateCard component
- [ ] PreviewModal component
- [ ] TemplateEditorPage component
- [ ] RichTextEditor component
- [ ] DragDropEditor component
- [ ] BlockRenderer components (Text, Image, Button, Divider, Spacer, Columns, Social)
- [ ] BlockPropertiesPanel component
- [ ] ImportHTMLModal component
- [ ] Variables dropdown component
- [ ] API integration hooks
- [ ] Auto-save functionality
- [ ] Version history
- [ ] HTML sanitization

---

## 📌 HƯỚNG DẪN SỬ DỤNG VỚI COPILOT

Copy file này vào project, sau đó prompt:

```
Based on TASK_10_2_THU_VIEN_MAU_EMAIL.md, create the [ComponentName] component with all features described.
```

**Ví dụ:**
- "Create the TemplateLibraryPage with tabs, grid, template cards, and preview modal"
- "Create the TemplateEditorPage with RichTextEditor, auto-save, and variable insertion"
- "Create the DragDropEditor with block system, drag-and-drop, and properties panel"
- "Create the ImportHTMLModal with file upload, paste code, sanitization, and preview"

---

*Document generated for AI Code Assistants (Copilot, Claude Code, Cursor AI)*
*Task: 10.2 - Thư viện mẫu Email*
