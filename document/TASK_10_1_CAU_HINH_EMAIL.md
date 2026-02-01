# TASK 10.1 - CẤU HÌNH EMAIL GỬI
## Complete UI & Data Flow Specification

> **Module**: Email Marketing
> **Task**: 10.1 - Cấu hình Email gửi
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

### 1.1 SenderEmail Model

```typescript
interface SenderEmail {
  id: string;                    // UUID, primary key
  email: string;                 // Unique, required, email format
  sender_name: string;           // Required, max 100 chars
  status: SenderEmailStatus;     // Enum
  permission_type: PermissionType;
  permitted_user_ids: string[];  // Array of user IDs (if permission_type = 'specific')
  
  // Verification
  verification_token: string | null;
  verification_expires_at: Date | null;
  verification_sent_count: number;  // Max 5/day
  verification_last_sent_at: Date | null;
  
  // Audit
  created_by: string;            // User ID
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;       // Soft delete
}

type SenderEmailStatus = 
  | 'activated'           // Đã kích hoạt - có thể dùng gửi
  | 'pending'             // Chờ xác thực - chưa click link
  | 'domain_unverified'   // Domain chưa xác thực - giới hạn gửi
  | 'disabled';           // Đã vô hiệu hóa

type PermissionType = 
  | 'all'       // Toàn bộ thành viên dự án
  | 'me'        // Chỉ người tạo
  | 'specific'; // Chọn thành viên cụ thể
```

### 1.2 EmailLimits Model

```typescript
interface EmailLimits {
  id: string;
  project_id: string;
  
  // Limits configuration
  daily_limit: number;              // Default: 500
  monthly_limit: number;            // Default: 10000
  per_sender_daily_limit: number;   // Default: 100
  delay_between_emails: number;     // Seconds, default: 5
  
  // Current usage
  daily_used: number;
  monthly_used: number;
  
  // Reset timestamps
  daily_reset_at: Date;             // 00:00 mỗi ngày
  monthly_reset_at: Date;           // Ngày 1 mỗi tháng
  
  updated_at: Date;
  updated_by: string;
}
```

### 1.3 EmailVerificationLog Model

```typescript
interface EmailVerificationLog {
  id: string;
  sender_email_id: string;
  action: 'sent' | 'clicked' | 'expired' | 'resent';
  ip_address: string | null;
  user_agent: string | null;
  created_at: Date;
}
```

---

## 2. API ENDPOINTS

### 2.1 Sender Email APIs

```typescript
// ===== GET: Danh sách email đã cấu hình =====
GET /api/email-marketing/sender-emails
Query Params:
  - search?: string          // Tìm theo email hoặc tên
  - status?: SenderEmailStatus
  - page?: number (default: 1)
  - limit?: number (default: 20)

Response 200:
{
  data: SenderEmail[],
  pagination: {
    total: number,
    page: number,
    limit: number,
    total_pages: number
  }
}

// ===== GET: Chi tiết một email =====
GET /api/email-marketing/sender-emails/:id

Response 200: SenderEmail

// ===== POST: Thêm email mới =====
POST /api/email-marketing/sender-emails
Body:
{
  email: string,              // Required, email format
  sender_name: string,        // Required
  permission_type: PermissionType,
  permitted_user_ids?: string[]
}

Response 201:
{
  data: SenderEmail,
  message: "Đã gửi email xác thực đến [email]"
}

Response 400:
{
  error: "EMAIL_EXISTS" | "INVALID_EMAIL_FORMAT" | "VALIDATION_ERROR",
  message: string
}

// ===== PUT: Cập nhật email =====
PUT /api/email-marketing/sender-emails/:id
Body:
{
  sender_name?: string,
  permission_type?: PermissionType,
  permitted_user_ids?: string[]
}
// Note: Không cho phép sửa email address

Response 200: SenderEmail

// ===== POST: Gửi lại email xác thực =====
POST /api/email-marketing/sender-emails/:id/resend-verification

Response 200:
{
  message: "Đã gửi lại email xác thực",
  remaining_attempts: number  // Còn lại bao nhiêu lần trong ngày
}

Response 429:
{
  error: "RATE_LIMIT_EXCEEDED",
  message: "Đã vượt quá 5 lần gửi/ngày. Vui lòng thử lại vào ngày mai."
}

// ===== POST: Xác thực email (từ link) =====
POST /api/email-marketing/sender-emails/verify
Body:
{
  token: string
}

Response 200:
{
  message: "Xác thực thành công",
  data: SenderEmail
}

Response 400:
{
  error: "TOKEN_EXPIRED" | "TOKEN_INVALID",
  message: string
}

// ===== PUT: Vô hiệu hóa email =====
PUT /api/email-marketing/sender-emails/:id/disable

Response 200: SenderEmail (with status = 'disabled')

// ===== PUT: Kích hoạt lại email =====
PUT /api/email-marketing/sender-emails/:id/enable

Response 200: SenderEmail

// ===== DELETE: Xóa email =====
DELETE /api/email-marketing/sender-emails/:id

Response 200:
{
  message: "Đã xóa email thành công"
}

Response 400:
{
  error: "EMAIL_IN_USE",
  message: "Không thể xóa email đang được sử dụng trong chiến dịch đang chạy"
}
```

### 2.2 Email Limits APIs

```typescript
// ===== GET: Lấy cấu hình giới hạn =====
GET /api/email-marketing/limits

Response 200: EmailLimits

// ===== PUT: Cập nhật giới hạn =====
PUT /api/email-marketing/limits
Body:
{
  daily_limit?: number,
  monthly_limit?: number,
  per_sender_daily_limit?: number,
  delay_between_emails?: number
}

Response 200: EmailLimits

// ===== GET: Lấy usage hiện tại =====
GET /api/email-marketing/limits/usage

Response 200:
{
  daily: { used: number, limit: number, percentage: number },
  monthly: { used: number, limit: number, percentage: number },
  reset_daily_in: string,    // "5 giờ 30 phút"
  reset_monthly_in: string   // "15 ngày"
}
```

---

## 3. STATE MANAGEMENT

### 3.1 Sender Emails Store

```typescript
interface SenderEmailsState {
  // List
  emails: SenderEmail[];
  loading: boolean;
  error: string | null;
  
  // Pagination
  pagination: {
    total: number;
    page: number;
    limit: number;
    total_pages: number;
  };
  
  // Filters
  filters: {
    search: string;
    status: SenderEmailStatus | 'all';
  };
  
  // Selected for edit/delete
  selectedEmail: SenderEmail | null;
  
  // Modals
  modals: {
    add: boolean;
    edit: boolean;
    delete: boolean;
    resendVerification: boolean;
  };
}

// Actions
type SenderEmailsAction =
  | { type: 'FETCH_EMAILS_START' }
  | { type: 'FETCH_EMAILS_SUCCESS'; payload: { data: SenderEmail[]; pagination: Pagination } }
  | { type: 'FETCH_EMAILS_ERROR'; payload: string }
  | { type: 'SET_FILTER'; payload: Partial<Filters> }
  | { type: 'SET_SELECTED_EMAIL'; payload: SenderEmail | null }
  | { type: 'TOGGLE_MODAL'; payload: { modal: keyof Modals; open: boolean } }
  | { type: 'ADD_EMAIL_SUCCESS'; payload: SenderEmail }
  | { type: 'UPDATE_EMAIL_SUCCESS'; payload: SenderEmail }
  | { type: 'DELETE_EMAIL_SUCCESS'; payload: string }
  | { type: 'UPDATE_EMAIL_STATUS'; payload: { id: string; status: SenderEmailStatus } };
```

### 3.2 Email Limits Store

```typescript
interface EmailLimitsState {
  config: EmailLimits | null;
  usage: {
    daily: { used: number; limit: number; percentage: number };
    monthly: { used: number; limit: number; percentage: number };
  } | null;
  loading: boolean;
  saving: boolean;
  error: string | null;
}
```

---

## 4. UI COMPONENTS CHI TIẾT

### 4.1 Trang Danh sách Email (SenderEmailListPage)

**Route**: `/settings/email-config`

**Component Structure**:
```
SenderEmailListPage
├── PageHeader
│   ├── Breadcrumb
│   ├── Title: "Cấu hình email gửi"
│   └── AddButton: "+ Thêm mới"
├── SearchAndFilter
│   ├── SearchInput (search by email, name)
│   └── StatusFilter (dropdown)
├── SenderEmailTable
│   ├── TableHeader
│   └── TableBody
│       └── SenderEmailRow (multiple)
│           ├── EmailCell
│           ├── SenderNameCell
│           ├── CreatedAtCell
│           ├── StatusBadge
│           ├── PermissionCell
│           └── ActionsCell
│               ├── EditButton
│               └── MoreMenu (dropdown)
├── Pagination
└── Modals
    ├── AddEmailModal
    ├── EditEmailModal
    ├── DeleteConfirmModal
    └── ResendVerificationModal
```

**Detailed UI Specs**:

```tsx
// === PageHeader ===
<div className="flex justify-between items-center mb-6">
  <div>
    <Breadcrumb items={[
      { label: "Cài đặt", href: "/settings" },
      { label: "Cấu hình email gửi", href: "/settings/email-config" }
    ]} />
    <h1 className="text-2xl font-semibold mt-2">Cấu hình email gửi</h1>
  </div>
  <Button variant="primary" onClick={openAddModal}>
    <PlusIcon /> Thêm mới
  </Button>
</div>

// === SearchAndFilter ===
<div className="flex gap-4 mb-4">
  <SearchInput
    placeholder="Tìm kiếm theo email, tên người gửi..."
    value={filters.search}
    onChange={(value) => setFilter({ search: value })}
    debounceMs={300}
    className="w-80"
  />
  <Select
    value={filters.status}
    onChange={(value) => setFilter({ status: value })}
    options={[
      { value: 'all', label: 'Tất cả trạng thái' },
      { value: 'activated', label: 'Đã kích hoạt' },
      { value: 'pending', label: 'Chờ xác thực' },
      { value: 'domain_unverified', label: 'Domain chưa xác thực' },
      { value: 'disabled', label: 'Đã vô hiệu hóa' }
    ]}
    className="w-48"
  />
</div>

// === Table Columns ===
const columns = [
  {
    key: 'email',
    header: 'Email',
    width: '25%',
    render: (row) => (
      <div>
        <span className="font-medium">{row.email}</span>
        {isPersonalEmail(row.email) && (
          <Tooltip content="Email cá nhân có thể bị vào spam">
            <WarningIcon className="ml-2 text-yellow-500" />
          </Tooltip>
        )}
      </div>
    )
  },
  {
    key: 'sender_name',
    header: 'Người gửi',
    width: '20%'
  },
  {
    key: 'created_at',
    header: 'Ngày tạo',
    width: '15%',
    render: (row) => formatDate(row.created_at, 'DD/MM/YYYY HH:mm')
  },
  {
    key: 'status',
    header: 'Trạng thái',
    width: '15%',
    render: (row) => <StatusBadge status={row.status} />
  },
  {
    key: 'permission',
    header: 'Quyền sử dụng',
    width: '10%',
    render: (row) => (
      <span className={row.hasPermission ? 'text-green-600' : 'text-gray-400'}>
        {row.hasPermission ? 'Có' : 'Không'}
      </span>
    )
  },
  {
    key: 'actions',
    header: 'Hành động',
    width: '15%',
    render: (row) => <ActionsCell email={row} />
  }
];
```

### 4.2 StatusBadge Component

```tsx
interface StatusBadgeProps {
  status: SenderEmailStatus;
}

const statusConfig = {
  activated: {
    label: 'Đã kích hoạt',
    color: 'bg-green-100 text-green-800',
    icon: CheckCircleIcon
  },
  pending: {
    label: 'Chờ xác thực',
    color: 'bg-yellow-100 text-yellow-800',
    icon: ClockIcon
  },
  domain_unverified: {
    label: 'Domain chưa xác thực',
    color: 'bg-red-100 text-red-800',
    icon: ExclamationIcon
  },
  disabled: {
    label: 'Đã vô hiệu hóa',
    color: 'bg-gray-100 text-gray-800',
    icon: BanIcon
  }
};

function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status];
  const Icon = config.icon;
  
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
      <Icon className="w-3 h-3 mr-1" />
      {config.label}
    </span>
  );
}
```

### 4.3 ActionsCell Component

```tsx
interface ActionsCellProps {
  email: SenderEmail;
  currentUserId: string;
  isAdmin: boolean;
}

function ActionsCell({ email, currentUserId, isAdmin }: ActionsCellProps) {
  const canEdit = isAdmin || email.created_by === currentUserId;
  const canDelete = isAdmin;
  const canResend = email.status === 'pending';
  const canDisable = isAdmin && email.status === 'activated';
  const canEnable = isAdmin && email.status === 'disabled';
  
  return (
    <div className="flex items-center gap-2">
      {canEdit && (
        <Button variant="ghost" size="sm" onClick={() => openEditModal(email)}>
          <EditIcon className="w-4 h-4" />
        </Button>
      )}
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm">
            <MoreIcon className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {canResend && (
            <DropdownMenuItem onClick={() => resendVerification(email.id)}>
              <SendIcon className="w-4 h-4 mr-2" />
              Gửi lại email xác thực
            </DropdownMenuItem>
          )}
          {canDisable && (
            <DropdownMenuItem onClick={() => disableEmail(email.id)}>
              <BanIcon className="w-4 h-4 mr-2" />
              Vô hiệu hóa
            </DropdownMenuItem>
          )}
          {canEnable && (
            <DropdownMenuItem onClick={() => enableEmail(email.id)}>
              <CheckIcon className="w-4 h-4 mr-2" />
              Kích hoạt lại
            </DropdownMenuItem>
          )}
          {canDelete && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={() => openDeleteModal(email)}
                className="text-red-600"
              >
                <TrashIcon className="w-4 h-4 mr-2" />
                Xóa
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
```

### 4.4 AddEmailModal Component

```tsx
interface AddEmailFormData {
  email: string;
  sender_name: string;
  permission_type: PermissionType;
  permitted_user_ids: string[];
}

const initialFormData: AddEmailFormData = {
  email: '',
  sender_name: '',
  permission_type: 'all',
  permitted_user_ids: []
};

function AddEmailModal({ open, onClose, onSuccess }) {
  const [formData, setFormData] = useState<AddEmailFormData>(initialFormData);
  const [errors, setErrors] = useState<Partial<AddEmailFormData>>({});
  const [loading, setLoading] = useState(false);
  const [showMemberPicker, setShowMemberPicker] = useState(false);
  
  // Validation rules
  const validate = (): boolean => {
    const newErrors: Partial<AddEmailFormData> = {};
    
    if (!formData.email) {
      newErrors.email = 'Vui lòng nhập địa chỉ email';
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = 'Địa chỉ email không hợp lệ';
    }
    
    if (!formData.sender_name) {
      newErrors.sender_name = 'Vui lòng nhập tên người gửi';
    } else if (formData.sender_name.length > 100) {
      newErrors.sender_name = 'Tên người gửi không được quá 100 ký tự';
    }
    
    if (formData.permission_type === 'specific' && formData.permitted_user_ids.length === 0) {
      newErrors.permitted_user_ids = 'Vui lòng chọn ít nhất một thành viên';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async () => {
    if (!validate()) return;
    
    setLoading(true);
    try {
      const result = await api.post('/email-marketing/sender-emails', formData);
      toast.success(result.message);
      onSuccess(result.data);
      onClose();
    } catch (error) {
      if (error.code === 'EMAIL_EXISTS') {
        setErrors({ email: 'Email này đã tồn tại trong hệ thống' });
      } else {
        toast.error(error.message);
      }
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Modal open={open} onClose={onClose} size="md">
      <ModalHeader>
        <ModalTitle>Thêm email người gửi mới</ModalTitle>
        <ModalCloseButton onClick={onClose} />
      </ModalHeader>
      
      <ModalBody>
        {/* Email Field */}
        <FormField
          label="Địa chỉ Email người gửi"
          required
          error={errors.email}
        >
          <Input
            type="email"
            placeholder="Địa chỉ Email người gửi, phải là email doanh nghiệp để tránh bị spam"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
          {isPersonalEmail(formData.email) && (
            <FormHelperText variant="warning">
              <WarningIcon className="w-4 h-4 mr-1" />
              Khuyến nghị dùng email doanh nghiệp (không phải @gmail.com, @yahoo.com) 
              để tránh bị đánh dấu spam
            </FormHelperText>
          )}
        </FormField>
        
        {/* Sender Name Field */}
        <FormField
          label="Tên người gửi"
          required
          error={errors.sender_name}
          className="mt-4"
        >
          <Input
            placeholder="Nhập tên bạn muốn khách hàng của mình nhìn thấy"
            value={formData.sender_name}
            onChange={(e) => setFormData({ ...formData, sender_name: e.target.value })}
            maxLength={100}
          />
          <FormHelperText>
            Ví dụ: "Công ty ABC", "Phòng Kinh doanh", "Nguyễn Văn A - Sales"
          </FormHelperText>
        </FormField>
        
        {/* Permission Field */}
        <FormField
          label="Quyền sử dụng Email này"
          required
          error={errors.permitted_user_ids}
          className="mt-4"
        >
          <Select
            value={formData.permission_type}
            onChange={(value) => {
              setFormData({ 
                ...formData, 
                permission_type: value,
                permitted_user_ids: value === 'specific' ? formData.permitted_user_ids : []
              });
              if (value === 'specific') {
                setShowMemberPicker(true);
              }
            }}
            options={[
              { value: 'all', label: 'Toàn bộ thành viên dự án' },
              { value: 'me', label: 'Chỉ tôi' },
              { value: 'specific', label: 'Chọn thành viên cụ thể' }
            ]}
          />
          
          {formData.permission_type === 'specific' && (
            <div className="mt-2">
              <MemberPicker
                selectedIds={formData.permitted_user_ids}
                onChange={(ids) => setFormData({ ...formData, permitted_user_ids: ids })}
              />
            </div>
          )}
        </FormField>
      </ModalBody>
      
      <ModalFooter>
        <Button variant="ghost" onClick={onClose}>
          Hủy bỏ
        </Button>
        <Button 
          variant="primary" 
          onClick={handleSubmit}
          loading={loading}
        >
          Thêm và xác nhận
        </Button>
      </ModalFooter>
    </Modal>
  );
}
```

### 4.5 EditEmailModal Component

```tsx
function EditEmailModal({ open, onClose, email, onSuccess }) {
  const [formData, setFormData] = useState({
    sender_name: email?.sender_name || '',
    permission_type: email?.permission_type || 'all',
    permitted_user_ids: email?.permitted_user_ids || []
  });
  
  // Similar to AddEmailModal but:
  // - Email field is readonly
  // - Pre-filled with existing data
  
  return (
    <Modal open={open} onClose={onClose} size="md">
      <ModalHeader>
        <ModalTitle>Chỉnh sửa thông tin email</ModalTitle>
      </ModalHeader>
      
      <ModalBody>
        {/* Email Field - READONLY */}
        <FormField label="Địa chỉ Email">
          <Input
            value={email?.email}
            disabled
            className="bg-gray-50"
          />
          <FormHelperText>
            <LockIcon className="w-4 h-4 mr-1" />
            Không thể thay đổi địa chỉ email
          </FormHelperText>
        </FormField>
        
        {/* Sender Name - Editable */}
        <FormField label="Tên người gửi" required className="mt-4">
          <Input
            value={formData.sender_name}
            onChange={(e) => setFormData({ ...formData, sender_name: e.target.value })}
          />
        </FormField>
        
        {/* Permission - Editable */}
        <FormField label="Quyền sử dụng Email này" required className="mt-4">
          <Select
            value={formData.permission_type}
            onChange={(value) => setFormData({ ...formData, permission_type: value })}
            options={permissionOptions}
          />
        </FormField>
      </ModalBody>
      
      <ModalFooter>
        <Button variant="ghost" onClick={onClose}>Hủy bỏ</Button>
        <Button variant="primary" onClick={handleSubmit}>Lưu thay đổi</Button>
      </ModalFooter>
    </Modal>
  );
}
```

### 4.6 DeleteConfirmModal Component

```tsx
function DeleteConfirmModal({ open, onClose, email, onConfirm }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const handleDelete = async () => {
    setLoading(true);
    setError(null);
    
    try {
      await api.delete(`/email-marketing/sender-emails/${email.id}`);
      toast.success('Đã xóa email thành công');
      onConfirm();
      onClose();
    } catch (err) {
      if (err.code === 'EMAIL_IN_USE') {
        setError('Không thể xóa email đang được sử dụng trong chiến dịch đang chạy');
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Modal open={open} onClose={onClose} size="sm">
      <ModalHeader>
        <ModalTitle>Xác nhận xóa</ModalTitle>
      </ModalHeader>
      
      <ModalBody>
        <div className="text-center">
          <WarningIcon className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-gray-700">
            Bạn có chắc chắn muốn xóa email <strong>{email?.email}</strong>?
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Hành động này không thể hoàn tác.
          </p>
          
          {error && (
            <Alert variant="error" className="mt-4">
              {error}
            </Alert>
          )}
        </div>
      </ModalBody>
      
      <ModalFooter>
        <Button variant="ghost" onClick={onClose}>Hủy</Button>
        <Button variant="danger" onClick={handleDelete} loading={loading}>
          Xóa
        </Button>
      </ModalFooter>
    </Modal>
  );
}
```

### 4.7 EmailLimitsPage Component

**Route**: `/settings/email-limits`

```tsx
function EmailLimitsPage() {
  const { config, usage, loading, saving, updateConfig } = useEmailLimits();
  
  const [formData, setFormData] = useState({
    daily_limit: 500,
    monthly_limit: 10000,
    per_sender_daily_limit: 100,
    delay_between_emails: 5
  });
  
  useEffect(() => {
    if (config) {
      setFormData({
        daily_limit: config.daily_limit,
        monthly_limit: config.monthly_limit,
        per_sender_daily_limit: config.per_sender_daily_limit,
        delay_between_emails: config.delay_between_emails
      });
    }
  }, [config]);
  
  return (
    <div className="p-6">
      <PageHeader
        breadcrumb={[
          { label: "Cài đặt", href: "/settings" },
          { label: "Giới hạn gửi email" }
        ]}
        title="Giới hạn gửi email"
      />
      
      <div className="space-y-6 max-w-2xl">
        {/* Daily Limit */}
        <LimitCard
          title="Giới hạn gửi theo ngày"
          value={formData.daily_limit}
          onChange={(value) => setFormData({ ...formData, daily_limit: value })}
          unit="email/ngày"
          usage={usage?.daily}
          min={100}
          max={10000}
        />
        
        {/* Monthly Limit */}
        <LimitCard
          title="Giới hạn gửi theo tháng"
          value={formData.monthly_limit}
          onChange={(value) => setFormData({ ...formData, monthly_limit: value })}
          unit="email/tháng"
          usage={usage?.monthly}
          min={1000}
          max={100000}
        />
        
        {/* Per Sender Limit */}
        <LimitCard
          title="Giới hạn theo email người gửi"
          value={formData.per_sender_daily_limit}
          onChange={(value) => setFormData({ ...formData, per_sender_daily_limit: value })}
          unit="email/ngày/email gửi"
          min={10}
          max={1000}
        />
        
        {/* Delay */}
        <LimitCard
          title="Khoảng cách giữa các email"
          value={formData.delay_between_emails}
          onChange={(value) => setFormData({ ...formData, delay_between_emails: value })}
          unit="giây"
          min={1}
          max={60}
        />
        
        <div className="flex justify-end">
          <Button 
            variant="primary" 
            onClick={() => updateConfig(formData)}
            loading={saving}
          >
            Lưu thay đổi
          </Button>
        </div>
      </div>
    </div>
  );
}
```

### 4.8 LimitCard Component

```tsx
interface LimitCardProps {
  title: string;
  value: number;
  onChange: (value: number) => void;
  unit: string;
  usage?: { used: number; limit: number; percentage: number };
  min: number;
  max: number;
}

function LimitCard({ title, value, onChange, unit, usage, min, max }: LimitCardProps) {
  const getProgressColor = (percentage: number) => {
    if (percentage >= 90) return 'bg-red-500';
    if (percentage >= 80) return 'bg-yellow-500';
    return 'bg-green-500';
  };
  
  return (
    <Card>
      <CardBody>
        <h3 className="font-medium text-gray-900 mb-3">{title}</h3>
        
        <div className="flex items-center gap-3">
          <Input
            type="number"
            value={value}
            onChange={(e) => onChange(Number(e.target.value))}
            min={min}
            max={max}
            className="w-32"
          />
          <span className="text-gray-600">{unit}</span>
        </div>
        
        {usage && (
          <div className="mt-4">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">
                Đã sử dụng: {usage.used.toLocaleString()} / {usage.limit.toLocaleString()}
              </span>
              <span className={`font-medium ${
                usage.percentage >= 90 ? 'text-red-600' :
                usage.percentage >= 80 ? 'text-yellow-600' : 'text-green-600'
              }`}>
                {usage.percentage}%
              </span>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full ${getProgressColor(usage.percentage)}`}
                style={{ width: `${Math.min(usage.percentage, 100)}%` }}
              />
            </div>
            
            {usage.percentage >= 80 && (
              <Alert 
                variant={usage.percentage >= 90 ? 'error' : 'warning'} 
                className="mt-3"
              >
                {usage.percentage >= 100 
                  ? 'Đã đạt giới hạn! Không thể gửi thêm email.'
                  : usage.percentage >= 90
                  ? 'Sắp đạt giới hạn! Chỉ còn ' + (usage.limit - usage.used) + ' email.'
                  : 'Đã sử dụng hơn 80% giới hạn.'}
              </Alert>
            )}
          </div>
        )}
      </CardBody>
    </Card>
  );
}
```

---

## 5. USER FLOWS

### 5.1 Flow: Thêm email mới

```
1. User click "+ Thêm mới"
   ↓
2. Modal "Thêm email người gửi mới" hiển thị
   ↓
3. User nhập thông tin:
   - Email address (validate realtime)
   - Tên người gửi
   - Quyền sử dụng
   ↓
4. User click "Thêm và xác nhận"
   ↓
5. System validates:
   - Email format ✓
   - Email unique ✓
   - Required fields ✓
   ↓
6. [If valid] System creates record với status = 'pending'
   ↓
7. System gửi verification email (within 30s)
   ↓
8. Toast: "Đã gửi email xác thực đến [email]"
   ↓
9. Modal đóng, list refresh với email mới (status: Chờ xác thực)
```

### 5.2 Flow: Xác thực email

```
1. User nhận email xác thực
   ↓
2. User click link trong email
   ↓
3. Browser mở trang xác thực: /verify-email?token=xxx
   ↓
4. System validate token:
   [If valid & not expired]
   ↓
5. System update status → 'activated'
   ↓
6. Hiển thị: "Xác thực thành công! Email đã sẵn sàng sử dụng."
   ↓
7. Redirect to /settings/email-config sau 3s

[If token expired]
   ↓
8. Hiển thị: "Link đã hết hạn"
   ↓
9. Button: "Gửi lại email xác thực"
```

### 5.3 Flow: Gửi lại email xác thực

```
1. User click "Gửi lại email xác thực" từ menu (...)
   ↓
2. System check: verification_sent_count < 5
   [If < 5]
   ↓
3. System gửi email mới
   ↓
4. Toast: "Đã gửi lại email xác thực. Còn X lần gửi trong ngày."
   
   [If >= 5]
   ↓
5. Toast error: "Đã vượt quá 5 lần gửi/ngày. Vui lòng thử lại vào ngày mai."
```

---

---

# 6. UTILITY FUNCTIONS

```typescript
// Email validation
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Check personal email domains
function isPersonalEmail(email: string): boolean {
  const personalDomains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'icloud.com'];
  const domain = email.split('@')[1]?.toLowerCase();
  return personalDomains.includes(domain);
}

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
```

---

# 7. MOCK DATA

## 7.1 Sender Emails Mock Data

```typescript
export const MOCK_SENDER_EMAILS: SenderEmail[] = [
  {
    id: 'se-001',
    email: 'sales@vilead.vn',
    sender_name: 'Phòng Kinh doanh ViLead',
    status: 'activated',
    permission_type: 'all',
    permitted_user_ids: [],
    verification_token: null,
    verification_expires_at: null,
    verification_sent_count: 0,
    verification_last_sent_at: null,
    created_by: 'user-001',
    created_at: new Date('2025-01-15T08:00:00Z'),
    updated_at: new Date('2025-01-15T09:30:00Z'),
    deleted_at: null
  },
  {
    id: 'se-002',
    email: 'marketing@vilead.vn',
    sender_name: 'Marketing Team',
    status: 'activated',
    permission_type: 'specific',
    permitted_user_ids: ['user-001', 'user-002', 'user-003'],
    verification_token: null,
    verification_expires_at: null,
    verification_sent_count: 0,
    verification_last_sent_at: null,
    created_by: 'user-001',
    created_at: new Date('2025-01-10T10:00:00Z'),
    updated_at: new Date('2025-01-10T10:30:00Z'),
    deleted_at: null
  },
  {
    id: 'se-003',
    email: 'support@vilead.vn',
    sender_name: 'Hỗ trợ khách hàng',
    status: 'pending',
    permission_type: 'all',
    permitted_user_ids: [],
    verification_token: 'token-abc123',
    verification_expires_at: new Date('2025-02-01T10:00:00Z'),
    verification_sent_count: 1,
    verification_last_sent_at: new Date('2025-01-31T10:00:00Z'),
    created_by: 'user-002',
    created_at: new Date('2025-01-31T10:00:00Z'),
    updated_at: new Date('2025-01-31T10:00:00Z'),
    deleted_at: null
  },
  {
    id: 'se-004',
    email: 'ceo@newcompany.vn',
    sender_name: 'CEO - Nguyễn Văn A',
    status: 'domain_unverified',
    permission_type: 'me',
    permitted_user_ids: [],
    verification_token: null,
    verification_expires_at: null,
    verification_sent_count: 0,
    verification_last_sent_at: null,
    created_by: 'user-003',
    created_at: new Date('2025-01-20T14:00:00Z'),
    updated_at: new Date('2025-01-20T14:00:00Z'),
    deleted_at: null
  },
  {
    id: 'se-005',
    email: 'test@gmail.com',
    sender_name: 'Test Personal',
    status: 'disabled',
    permission_type: 'me',
    permitted_user_ids: [],
    verification_token: null,
    verification_expires_at: null,
    verification_sent_count: 3,
    verification_last_sent_at: new Date('2025-01-25T16:00:00Z'),
    created_by: 'user-001',
    created_at: new Date('2025-01-05T09:00:00Z'),
    updated_at: new Date('2025-01-28T11:00:00Z'),
    deleted_at: null
  }
];
```

## 7.2 Email Limits Mock Data

```typescript
export const MOCK_EMAIL_LIMITS: EmailLimits = {
  id: 'limit-001',
  project_id: 'project-001',
  daily_limit: 500,
  monthly_limit: 10000,
  per_sender_daily_limit: 100,
  delay_between_emails: 5,
  daily_used: 350,
  monthly_used: 2500,
  daily_reset_at: new Date('2025-02-01T00:00:00Z'),
  monthly_reset_at: new Date('2025-02-01T00:00:00Z'),
  updated_at: new Date('2025-01-30T15:00:00Z'),
  updated_by: 'user-001'
};
```

## 7.3 Users Mock Data (for permissions)

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

- [ ] SenderEmailListPage component
- [ ] SearchAndFilter component
- [ ] SenderEmailTable component
- [ ] StatusBadge component
- [ ] AddEmailModal component
- [ ] EditEmailModal component
- [ ] DeleteConfirmModal component
- [ ] EmailLimitsPage component
- [ ] LimitCard component
- [ ] API integration hooks
- [ ] State management (store/context)
- [ ] Form validation
- [ ] Error handling
- [ ] Loading states
- [ ] Toast notifications

---

## 📌 HƯỚNG DẪN SỬ DỤNG VỚI COPILOT

Copy file này vào project, sau đó prompt:

```
Based on TASK_10_1_CAU_HINH_EMAIL.md, create the [ComponentName] component with all features described.
```

**Ví dụ:**
- "Create the SenderEmailListPage with table, filters, pagination, and all modals"
- "Create the AddEmailModal with form validation, permission selector, and email verification"
- "Create the EmailLimitsPage with LimitCard components and progress bars"

---

*Document generated for AI Code Assistants (Copilot, Claude Code, Cursor AI)*
*Task: 10.1 - Cấu hình Email gửi*
