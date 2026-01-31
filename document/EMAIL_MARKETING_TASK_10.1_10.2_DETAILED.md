# EMAIL MARKETING - DETAILED UI & DATA FLOW SPECIFICATION

> **Phạm vi**: Task 10.1 (Cấu hình Email gửi) + Task 10.2 (Thư viện mẫu Email)
> **Mục đích**: Copilot/AI Code Assistant generate đầy đủ UI components, data flow, mock data
> **Version**: 1.0 | **Date**: 31/01/2025

---

## 📑 MỤC LỤC

- [PHẦN A: TASK 10.1 - CẤU HÌNH EMAIL GỬI](#phần-a-task-101---cấu-hình-email-gửi)
- [PHẦN B: TASK 10.2 - THƯ VIỆN MẪU EMAIL](#phần-b-task-102---thư-viện-mẫu-email)
- [PHẦN C: SHARED COMPONENTS](#phần-c-shared-components)
- [PHẦN D: MOCK DATA](#phần-d-mock-data)

---

# PHẦN A: TASK 10.1 - CẤU HÌNH EMAIL GỬI

## A1. DATA MODELS

### A1.1 SenderEmail Model

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

### A1.2 EmailLimits Model

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

### A1.3 EmailVerificationLog Model

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

## A2. API ENDPOINTS

### A2.1 Sender Email APIs

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

### A2.2 Email Limits APIs

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

## A3. STATE MANAGEMENT

### A3.1 Sender Emails Store

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

### A3.2 Email Limits Store

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

## A4. UI COMPONENTS CHI TIẾT

### A4.1 Trang Danh sách Email (SenderEmailListPage)

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

### A4.2 StatusBadge Component

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

### A4.3 ActionsCell Component

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

### A4.4 AddEmailModal Component

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

### A4.5 EditEmailModal Component

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

### A4.6 DeleteConfirmModal Component

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

### A4.7 EmailLimitsPage Component

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

### A4.8 LimitCard Component

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

## A5. USER FLOWS

### A5.1 Flow: Thêm email mới

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

### A5.2 Flow: Xác thực email

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

### A5.3 Flow: Gửi lại email xác thực

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

# PHẦN B: TASK 10.2 - THƯ VIỆN MẪU EMAIL

## B1. DATA MODELS

### B1.1 EmailTemplate Model

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

### B1.2 TemplateVariable Model

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

## B2. API ENDPOINTS

### B2.1 Template APIs

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

## B3. STATE MANAGEMENT

### B3.1 Templates Store

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

## B4. UI COMPONENTS CHI TIẾT

### B4.1 Trang Thư viện mẫu (TemplateLibraryPage)

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

### B4.2 CreateNewTemplateCard Component

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

### B4.3 TemplateCard Component

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

### B4.4 PreviewModal Component

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

### B4.5 TemplateEditorPage Component

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

### B4.6 RichTextEditor Component

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

### B4.7 DragDropEditor Component

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

### B4.8 ImportHTMLModal Component

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

## B5. USER FLOWS

### B5.1 Flow: Xem thư viện mẫu

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

### B5.2 Flow: Xem trước mẫu

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

### B5.3 Flow: Tạo bản sao (Clone)

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

### B5.4 Flow: Tạo mẫu mới

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

### B5.5 Flow: Import HTML

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

# PHẦN C: SHARED COMPONENTS

## C1. Utility Functions

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

# PHẦN D: MOCK DATA

## D1. Sender Emails Mock Data

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

## D2. Email Limits Mock Data

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

## D3. Email Templates Mock Data

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

## D4. Users Mock Data (for permissions)

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

## 📌 IMPLEMENTATION CHECKLIST

### Task 10.1: Cấu hình Email gửi
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

### Task 10.2: Thư viện mẫu Email
- [ ] TemplateLibraryPage component
- [ ] TabBar component
- [ ] CreateNewTemplateCard component
- [ ] TemplateCard component
- [ ] PreviewModal component
- [ ] TemplateEditorPage component
- [ ] RichTextEditor component
- [ ] DragDropEditor component
- [ ] BlockRenderer components (Text, Image, Button, etc.)
- [ ] BlockPropertiesPanel component
- [ ] ImportHTMLModal component
- [ ] Variables dropdown component
- [ ] API integration hooks
- [ ] Auto-save functionality
- [ ] Version history
- [ ] HTML sanitization

---

*Document generated for AI Code Assistants*
*Optimized for Copilot, Claude Code, Cursor AI*
