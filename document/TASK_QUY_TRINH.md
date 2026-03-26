# KHỐI A — QUY TRÌNH & DANH MỤC SẢN PHẨM (Multi-Process Foundation)

> ViLead CRM — Phase 2 Enhancement  
> Version: 1.0 | Date: 25/03/2026

---

## 1. TỔNG QUAN KIẾN TRÚC

### 1.1. Nguyên tắc cốt lõi

Toàn bộ hệ thống hoạt động trong context **1 Quy trình tại 1 thời điểm**. Quy trình (Pipeline) là entity trung tâm, **độc lập với Phòng ban**.

### 1.2. Quan hệ dữ liệu

```
Quy trình (pipelines)
  ├── N Danh mục SP (product_categories.pipeline_id)
  ├── N Stage (pipeline_stages.pipeline_id) — đã có Phase 2
  ├── N User (pipeline_users — bảng mới, many-many)
  └── N Lead (leads.pipeline_id — cột mới)

Phòng ban (departments) — độc lập, quản lý nhân sự
```

### 1.3. Scope ảnh hưởng

Mọi API endpoint hiện tại cần nhận thêm query param `pipeline_id`:
- `GET /api/leads?pipeline_id=X`
- `GET /api/orders?pipeline_id=X`
- `GET /api/reports/revenue?pipeline_id=X`
- `GET /api/dashboard?pipeline_id=X`
- `GET /api/customers?pipeline_id=X`

Frontend truyền `pipeline_id` từ Pipeline Selector (lưu trong global state/context).

---

## 2. DATABASE SCHEMA CHANGES

### 2.1. Bảng mới: `pipeline_users`

```sql
CREATE TABLE pipeline_users (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pipeline_id   UUID NOT NULL REFERENCES pipelines(id) ON DELETE CASCADE,
  user_id       UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  assigned_at   TIMESTAMP DEFAULT NOW(),
  assigned_by   UUID REFERENCES users(id),
  
  UNIQUE(pipeline_id, user_id)
);

CREATE INDEX idx_pipeline_users_pipeline ON pipeline_users(pipeline_id);
CREATE INDEX idx_pipeline_users_user ON pipeline_users(user_id);
```

### 2.2. Cột mới trên bảng `pipelines`

```sql
ALTER TABLE pipelines ADD COLUMN is_default    BOOLEAN DEFAULT FALSE;
ALTER TABLE pipelines ADD COLUMN description   VARCHAR(500);
ALTER TABLE pipelines ADD COLUMN is_deleted    BOOLEAN DEFAULT FALSE;
ALTER TABLE pipelines ADD COLUMN deleted_at    TIMESTAMP;
-- Bỏ ràng buộc department_id required (nếu có)
ALTER TABLE pipelines ALTER COLUMN department_id DROP NOT NULL;
```

### 2.3. Cột mới trên bảng `product_categories`

```sql
ALTER TABLE product_categories ADD COLUMN pipeline_id UUID REFERENCES pipelines(id);
CREATE INDEX idx_product_categories_pipeline ON product_categories(pipeline_id);
```

### 2.4. Cột mới trên bảng `leads`

```sql
ALTER TABLE leads ADD COLUMN pipeline_id UUID REFERENCES pipelines(id);
CREATE INDEX idx_leads_pipeline ON leads(pipeline_id);
-- Sau migration, set NOT NULL:
-- ALTER TABLE leads ALTER COLUMN pipeline_id SET NOT NULL;
```

### 2.5. Cột mới trên bảng `leads` (Báo cáo Data - chuẩn bị cho Khối D)

```sql
ALTER TABLE leads ADD COLUMN date_of_birth DATE;
```

---

## 3. API ENDPOINTS MỚI

### 3.1. CRUD Quy trình

```
GET    /api/pipelines                     — Danh sách QT (filter: is_deleted=false)
POST   /api/pipelines                     — Tạo QT mới
GET    /api/pipelines/:id                 — Chi tiết QT
PUT    /api/pipelines/:id                 — Sửa QT
DELETE /api/pipelines/:id                 — Soft delete QT
GET    /api/pipelines/my                  — DS QT user hiện tại được assign
```

#### POST /api/pipelines — Request Body

```json
{
  "name": "Phần mềm",
  "description": "Quy trình bán phần mềm SaaS"
}
```

#### POST /api/pipelines — Response

```json
{
  "id": "uuid",
  "name": "Phần mềm",
  "description": "Quy trình bán phần mềm SaaS",
  "is_default": false,
  "is_active": true,
  "created_at": "2026-03-25T...",
  "stats": {
    "category_count": 0,
    "user_count": 0,
    "lead_count": 0
  }
}
```

#### Validation Rules

| Field       | Rule                                          |
|-------------|-----------------------------------------------|
| name        | Required, unique (case-insensitive), max 100   |
| description | Optional, max 500                             |

#### Delete Rules

| Điều kiện                           | Kết quả                    |
|-------------------------------------|----------------------------|
| QT có lead active (!=Won, !=Lost)   | ❌ Reject, trả về lead count |
| QT là duy nhất (count active = 1)   | ❌ Reject                   |
| QT is_default = true                | ❌ Reject                   |
| Không vi phạm                       | ✅ Soft delete              |

### 3.2. Gắn Danh mục SP

```
GET    /api/pipelines/:id/categories       — DS danh mục SP của QT
POST   /api/pipelines/:id/categories       — Gắn danh mục vào QT
DELETE /api/pipelines/:id/categories/:catId — Gỡ danh mục khỏi QT
GET    /api/categories/unassigned           — DS danh mục chưa gắn QT
```

#### POST /api/pipelines/:id/categories — Request Body

```json
{
  "category_ids": ["uuid1", "uuid2"]
}
```

#### Delete Validation

| Điều kiện                                        | Kết quả       |
|--------------------------------------------------|---------------|
| Danh mục có SP dùng trong Lead/Đơn active của QT | ❌ Reject     |
| Không vi phạm                                    | ✅ SET NULL   |

### 3.3. Gắn Nhân viên

```
GET    /api/pipelines/:id/users            — DS NV của QT
POST   /api/pipelines/:id/users            — Gắn NV vào QT
DELETE /api/pipelines/:id/users/:userId    — Gỡ NV khỏi QT
```

#### POST /api/pipelines/:id/users — Request Body

```json
{
  "user_ids": ["uuid1", "uuid2"]
}
```

#### Delete Validation

| Điều kiện                                  | Kết quả                              |
|--------------------------------------------|--------------------------------------|
| NV có Lead active trong QT                 | ⚠️ Warning + trả về lead count/list |
| Force = true (sau khi user confirm)        | ✅ Gỡ, Lead giữ assigned_to cũ     |

---

## 4. COMPONENT SPECS & WIREFRAMES

### 4.1. Pipeline Selector (Global Header Component)

```
┌──────────────────────────────────────────────────────────────────┐
│  [≡] ViLead CRM    [ Phần mềm        ▼ ]    🔔  👤 Nguyễn Văn A │
│                     ╔══════════════════╗                         │
│                     ║ ● Phần mềm    ✓ ║                         │
│                     ║ ○ Dịch vụ        ║                         │
│                     ║ ○ Đào tạo        ║                         │
│                     ╚══════════════════╝                         │
└──────────────────────────────────────────────────────────────────┘
```

#### Component Props

```typescript
interface PipelineSelectorProps {
  // Không cần props — component tự fetch từ API
}

interface PipelineSelectorState {
  pipelines: Pipeline[];        // GET /api/pipelines/my
  selectedId: string;           // Lưu localStorage key: 'vilead_selected_pipeline'
  isOpen: boolean;
}

interface Pipeline {
  id: string;
  name: string;
  description?: string;
  is_default: boolean;
  stats: {
    category_count: number;
    user_count: number;
    lead_count: number;
  };
}
```

#### Behavior

| Event                      | Action                                                        |
|----------------------------|---------------------------------------------------------------|
| Mount                      | Load DS từ `/api/pipelines/my`, set selected từ localStorage  |
| Selected QT bị Inactive    | Auto switch về QT đầu tiên, show toast cảnh báo              |
| Click chọn QT mới         | Check dirty form → confirm nếu có → set selected → reload    |
| User chỉ có 1 QT          | Selector hiển thị read-only (không dropdown)                  |
| Admin                      | Thấy tất cả QT active (không cần assign)                     |

#### Global Context

```typescript
// React Context / Zustand Store
interface PipelineContext {
  selectedPipelineId: string;
  selectedPipeline: Pipeline;
  setSelectedPipeline: (id: string) => void;
}

// Hook sử dụng ở mọi component
const { selectedPipelineId } = usePipelineContext();

// Mọi API call:
const leads = await api.get(`/leads?pipeline_id=${selectedPipelineId}`);
```

---

### 4.2. Màn Cài đặt → Quản lý Quy trình

```
┌──────────────────────────────────────────────────────────────────┐
│ Cài đặt > Quản lý Quy trình                    [+ Tạo quy trình]│
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ Tên QT        │ Danh mục SP │ Nhân viên │ Trạng thái │ ⋮  │  │
│  ├────────────────┼─────────────┼───────────┼────────────┼────│  │
│  │ Phần mềm ★    │ 3 danh mục  │ 12 NV     │ 🟢 Active  │ ⋮  │  │
│  │ Dịch vụ       │ 2 danh mục  │ 8 NV      │ 🟢 Active  │ ⋮  │  │
│  │ Đào tạo       │ 1 danh mục  │ 5 NV      │ ⚪ Inactive│ ⋮  │  │
│  └────────────────┴─────────────┴───────────┴────────────┴────┘  │
│                                                                  │
│  ★ = Quy trình Mặc định                                         │
│  ⋮ Menu: Sửa | Cấu hình Pipeline | Xóa                         │
└──────────────────────────────────────────────────────────────────┘
```

#### Component: PipelineManagementPage

```typescript
interface PipelineListItem {
  id: string;
  name: string;
  description?: string;
  is_default: boolean;
  is_active: boolean;
  created_at: string;
  stats: {
    category_count: number;
    user_count: number;
    lead_count: number;
  };
}
```

#### Columns

| Cột           | Field                    | Width  | Sortable |
|---------------|--------------------------|--------|----------|
| Tên QT        | name + ★ nếu is_default  | 25%    | ✅       |
| Danh mục SP   | stats.category_count     | 20%    | ✅       |
| Nhân viên     | stats.user_count         | 15%    | ✅       |
| Lead          | stats.lead_count         | 15%    | ✅       |
| Trạng thái    | is_active badge          | 15%    | ✅       |
| Thao tác      | menu ⋮                   | 10%    | ❌       |

---

### 4.3. Form Tạo/Sửa Quy trình (Modal)

```
┌──────────────────────────────────────┐
│ Tạo quy trình mới              [X]  │
├──────────────────────────────────────┤
│                                      │
│  Tên quy trình *                     │
│  ┌──────────────────────────────┐    │
│  │ Phần mềm                    │    │
│  └──────────────────────────────┘    │
│                                      │
│  Mô tả                              │
│  ┌──────────────────────────────┐    │
│  │ Quy trình bán phần mềm SaaS │    │
│  │                              │    │
│  └──────────────────────────────┘    │
│                                      │
│  Trạng thái                          │
│  ( ● Active )  ( ○ Inactive )        │
│                                      │
│          [Hủy]  [Lưu]               │
└──────────────────────────────────────┘
```

#### Validation

| Field     | Rule                              | Error message                        |
|-----------|-----------------------------------|--------------------------------------|
| name      | Required                          | "Tên quy trình là bắt buộc"         |
| name      | Max 100 chars                     | "Tên tối đa 100 ký tự"              |
| name      | Unique (API check)                | "Tên quy trình đã tồn tại"          |
| description| Max 500 chars                    | "Mô tả tối đa 500 ký tự"            |

---

### 4.4. Chi tiết Quy trình (Tabs)

```
┌──────────────────────────────────────────────────────────────────┐
│ ← Quản lý Quy trình    Phần mềm ★                [Sửa] [Xóa]  │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────────┬─────────────┬──────────────┐                    │
│  │ Danh mục SP │ Nhân viên   │ Pipeline     │                    │
│  ├─────────────┴─────────────┴──────────────┘                    │
│                                                                  │
│  === Tab Danh mục SP ===                                         │
│                                                                  │
│  [+ Thêm danh mục]                                              │
│                                                                  │
│  ┌────────────────┬──────────┬──────────┬──────┐                 │
│  │ Tên danh mục   │ Số SP    │ Ngày gắn │ Thao │                 │
│  ├────────────────┼──────────┼──────────┼──────┤                 │
│  │ CRM Software   │ 5 SP     │ 25/03    │ [Gỡ] │                 │
│  │ ERP Software   │ 3 SP     │ 25/03    │ [Gỡ] │                 │
│  │ Mobile App     │ 2 SP     │ 26/03    │ [Gỡ] │                 │
│  └────────────────┴──────────┴──────────┴──────┘                 │
│                                                                  │
│  === Tab Nhân viên ===                                           │
│                                                                  │
│  [+ Thêm nhân viên]    Filter: [Tất cả phòng ban ▼]             │
│                                                                  │
│  ┌──────────────┬────────────┬──────────┬──────────┬──────┐      │
│  │ Tên NV       │ Phòng ban  │ Role     │ Ngày gắn │ Thao │      │
│  ├──────────────┼────────────┼──────────┼──────────┼──────┤      │
│  │ Nguyễn Văn A │ Sales HN   │ Sales    │ 25/03    │ [Gỡ] │      │
│  │ Trần Thị B   │ Sales HCM  │ Leader   │ 25/03    │ [Gỡ] │      │
│  └──────────────┴────────────┴──────────┴──────────┴──────┘      │
│                                                                  │
│  === Tab Pipeline (redirect đến Pipeline Management) ===         │
│  → Link đến Cài đặt > Pipeline Management, filter theo QT này   │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

---

### 4.5. Popup Thêm Danh mục SP

```
┌──────────────────────────────────────┐
│ Thêm danh mục vào "Phần mềm"   [X]  │
├──────────────────────────────────────┤
│                                      │
│  🔍 Tìm danh mục...                 │
│                                      │
│  ☐ CRM Software (5 SP)              │
│  ☐ ERP Software (3 SP)              │
│  ☐ Mobile App (2 SP)                │
│  ☑ AI Tools (4 SP)                  │
│  ☑ Cloud Services (6 SP)            │
│                                      │
│  ⓘ Chỉ hiện danh mục chưa gắn      │
│    quy trình nào                     │
│                                      │
│       [Hủy]  [Xác nhận (2)]         │
└──────────────────────────────────────┘
```

---

### 4.6. Popup Thêm Nhân viên

```
┌──────────────────────────────────────┐
│ Thêm NV vào "Phần mềm"        [X]  │
├──────────────────────────────────────┤
│                                      │
│  Phòng ban: [Tất cả          ▼]     │
│  🔍 Tìm nhân viên...                │
│                                      │
│  ☑ Nguyễn Văn A — Sales HN          │
│  ☐ Trần Thị B — Sales HCM           │
│  ☑ Lê Văn C — Sales HN              │
│  ☐ Phạm Thị D — CSKH               │
│                                      │
│  ⓘ NV đã có trong QT này được       │
│    đánh dấu ✓ và disabled            │
│                                      │
│       [Hủy]  [Xác nhận (2)]         │
└──────────────────────────────────────┘
```

---

### 4.7. Confirm Dialog — Xóa Quy trình

```
┌──────────────────────────────────────┐
│ ⚠️ Xóa quy trình "Đào tạo"?        │
├──────────────────────────────────────┤
│                                      │
│  Quy trình này hiện có:              │
│  • 1 danh mục SP                     │
│  • 5 nhân viên                       │
│  • 0 lead đang hoạt động             │
│                                      │
│  Khi xóa:                            │
│  • Danh mục SP sẽ thành chưa gắn QT │
│  • Nhân viên sẽ bị gỡ khỏi QT       │
│  • Lead đã chốt/mất vẫn giữ data    │
│                                      │
│        [Hủy]  [Xác nhận xóa]        │
└──────────────────────────────────────┘
```

---

### 4.8. Confirm Dialog — Gỡ NV có Lead active

```
┌──────────────────────────────────────┐
│ ⚠️ Gỡ Nguyễn Văn A khỏi QT?        │
├──────────────────────────────────────┤
│                                      │
│  NV này đang phụ trách 3 lead        │
│  trong quy trình "Phần mềm":        │
│                                      │
│  • Lead ABC Corp — Đang tư vấn       │
│  • Lead XYZ — Báo giá                │
│  • Lead 123 — Đàm phán               │
│                                      │
│  Vui lòng chuyển lead trước khi gỡ,  │
│  hoặc xác nhận gỡ (lead giữ nguyên   │
│  assigned_to nhưng NV không thấy QT). │
│                                      │
│   [Hủy]  [Chuyển Lead]  [Gỡ luôn]   │
└──────────────────────────────────────┘
```

---

## 5. BUSINESS RULES TỔNG HỢP

### 5.1. Quy trình

| # | Rule                                                              |
|---|-------------------------------------------------------------------|
| 1 | Tên QT unique toàn hệ thống (case-insensitive)                   |
| 2 | Tạo QT mới → auto tạo pipeline với 4 stage cố định               |
| 3 | QT Mặc định (is_default=true) không cho xóa                      |
| 4 | Hệ thống phải có ít nhất 1 QT active                             |
| 5 | Xóa QT = soft delete (is_deleted=true)                           |
| 6 | QT Inactive → Lead ẩn khỏi Hoạt động bán hàng, giữ data         |
| 7 | Khi tạo QT, nếu chưa gắn danh mục SP → cảnh báo khi tạo Lead    |

### 5.2. Danh mục SP ↔ Quy trình

| # | Rule                                                              |
|---|-------------------------------------------------------------------|
| 1 | 1 Danh mục SP thuộc tối đa 1 QT (1-to-many from QT perspective)  |
| 2 | Danh mục chưa gắn QT → SP không hiện khi tạo Lead ở bất kỳ QT   |
| 3 | Gỡ danh mục có SP dùng trong Lead/Đơn active → chặn              |
| 4 | Gỡ danh mục → SET pipeline_id = NULL, Lead/Đơn cũ giữ data SP    |
| 5 | Tạo Danh mục SP mới → mặc định chưa gắn QT (Admin gắn thủ công) |

### 5.3. Nhân viên ↔ Quy trình

| # | Rule                                                              |
|---|-------------------------------------------------------------------|
| 1 | 1 NV thuộc N quy trình (many-to-many qua pipeline_users)         |
| 2 | Admin auto có quyền tất cả QT (không cần assign)                 |
| 3 | NV không thuộc QT nào → fallback xem QT Mặc định                 |
| 4 | Gỡ NV có Lead active → cảnh báo, cho chọn "Chuyển Lead" hoặc "Gỡ luôn" |
| 5 | NV bị gỡ → Lead cũ giữ assigned_to, NV không thấy QT trong selector |

### 5.4. Pipeline Selector

| # | Rule                                                              |
|---|-------------------------------------------------------------------|
| 1 | Mọi API call truyền pipeline_id từ selector                      |
| 2 | Lưu QT đã chọn vào localStorage, khôi phục khi reload            |
| 3 | QT đang chọn bị Inactive → auto switch về QT Mặc định + toast    |
| 4 | User bị gỡ khỏi QT đang chọn → switch về QT đầu tiên còn quyền  |
| 5 | Đổi QT giữa form chưa save → confirm dialog                     |
| 6 | URL hỗ trợ ?pipeline_id=X để deep link                           |

### 5.5. Tạo Lead trong context QT

| # | Rule                                                              |
|---|-------------------------------------------------------------------|
| 1 | Lead.pipeline_id = QT đang chọn (auto-fill, read-only)           |
| 2 | Dropdown SP chỉ hiện SP thuộc danh mục đã gắn QT đang chọn      |
| 3 | Stage mặc định = "Lead mới" của pipeline QT đang chọn            |
| 4 | QT chưa có danh mục SP → cảnh báo, vẫn cho tạo (SP = trống)     |
| 5 | Import Lead (Excel/CSV) → auto assign pipeline_id = QT đang chọn |
| 6 | Auto-assignment rules chạy trong scope QT                         |

---

## 6. MIGRATION SCRIPT

```sql
-- Step 1: Tạo QT Mặc định
INSERT INTO pipelines (id, name, description, is_default, is_active, is_deleted)
VALUES (gen_random_uuid(), 'Mặc định', 'Quy trình mặc định của hệ thống', true, true, false)
ON CONFLICT DO NOTHING
RETURNING id INTO default_pipeline_id;

-- Step 2: Gắn tất cả Danh mục SP
UPDATE product_categories 
SET pipeline_id = (SELECT id FROM pipelines WHERE is_default = true)
WHERE pipeline_id IS NULL;

-- Step 3: Gắn tất cả User
INSERT INTO pipeline_users (pipeline_id, user_id, assigned_by)
SELECT 
  (SELECT id FROM pipelines WHERE is_default = true),
  id,
  NULL
FROM users
WHERE is_active = true
ON CONFLICT (pipeline_id, user_id) DO NOTHING;

-- Step 4: Update tất cả Lead
UPDATE leads 
SET pipeline_id = (SELECT id FROM pipelines WHERE is_default = true)
WHERE pipeline_id IS NULL;

-- Step 5: Gắn Pipeline hiện tại (Phase 2) vào QT Mặc định
-- Nếu pipelines đã có department_id, giữ nguyên và thêm link đến QT Mặc định
-- (Logic cụ thể phụ thuộc schema hiện tại)

-- Step 6: Verify
SELECT 'leads_null_pipeline' AS check_name, COUNT(*) AS count
FROM leads WHERE pipeline_id IS NULL
UNION ALL
SELECT 'categories_null_pipeline', COUNT(*)
FROM product_categories WHERE pipeline_id IS NULL
UNION ALL
SELECT 'users_not_in_pipeline', COUNT(*)
FROM users u WHERE is_active = true 
AND NOT EXISTS (SELECT 1 FROM pipeline_users pu WHERE pu.user_id = u.id);
-- Tất cả count phải = 0
```

---

## 7. EDGE CASES & ERROR HANDLING

| Tình huống                                           | Xử lý                                              |
|------------------------------------------------------|-----------------------------------------------------|
| User đăng nhập lần đầu sau migration                 | Auto select QT Mặc định                             |
| QT đang chọn bị Admin xóa/tắt realtime               | WebSocket event → toast + auto switch                |
| Tạo Lead khi QT không có danh mục SP                 | Cho tạo, SP dropdown trống, hiện cảnh báo vàng       |
| Import 1000 Lead qua Excel — QT nào?                 | Dùng QT đang chọn trên selector                     |
| Lead auto-assignment rule match nhiều QT              | Rule chạy trong scope QT, không cross-pipeline       |
| Admin tạo QT mới, chưa gắn NV                        | QT hiện trong list nhưng không NV nào thấy trong selector |
| 2 Admin cùng sửa 1 QT                                | Last-write-wins (optimistic locking nếu cần)         |
| Xóa danh mục SP (module SP) đang gắn QT              | Cascade: gỡ khỏi QT trước, rồi xóa                  |
| User bị deactivate                                   | Auto gỡ khỏi tất cả pipeline_users                   |

---

## 8. MENU CÀI ĐẶT (Sidebar Update)

```
Cài đặt
  ├── Quản lý Quy trình        ← MỚI (Khối A)
  ├── Pipeline Management       ← Đã có (Phase 2) — thêm filter theo QT
  ├── Lead Automation
  ├── Sản phẩm/Dịch vụ
  ├── Phòng ban & Nhân viên
  ├── KPI
  └── Hệ thống
```

---

## 9. TESTING CHECKLIST

- [ ] Tạo QT mới → pipeline 4 stage tự tạo
- [ ] Tên QT trùng → báo lỗi
- [ ] Xóa QT có lead active → chặn
- [ ] Xóa QT cuối cùng → chặn
- [ ] Gắn danh mục SP → SP hiện trong form tạo Lead
- [ ] Gỡ danh mục có SP active → chặn
- [ ] Gắn NV → NV thấy QT trong selector
- [ ] Gỡ NV có lead → cảnh báo đúng
- [ ] Selector: đổi QT → data reload đúng
- [ ] Selector: lưu session → refresh vẫn giữ
- [ ] Selector: QT bị Inactive → auto switch
- [ ] Tạo Lead → pipeline_id gắn đúng QT
- [ ] Tạo Lead → dropdown SP scope đúng QT
- [ ] Migration: data cũ → QT Mặc định, không mất
- [ ] Báo cáo: scope theo QT đang chọn
- [ ] KPI: scope theo QT đang chọn
- [ ] Dashboard: scope theo QT đang chọn
