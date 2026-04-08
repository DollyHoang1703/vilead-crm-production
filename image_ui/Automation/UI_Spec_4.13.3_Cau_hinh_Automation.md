# UI SPECIFICATION - MODULE 4.13.3: CẤU HÌNH AUTOMATION

**Version:** 1.0  
**Module:** 4.13.3 - Cấu hình Automation  
**Last Updated:** 07/04/2026  
**Target:** Copilot / AI Coding Assistant / Developer

---

## 1. TỔNG QUAN

### 1.1. Mục tiêu
Cung cấp giao diện quản trị để Admin cấu hình các thiết lập nền tảng cho hệ thống Automation:
- Quản lý Tags (đồng bộ với Chat đa kênh)
- Liên kết Tag với Kịch bản chăm sóc
- Thiết lập Auto Rules (4 quy tắc trigger tự động)
- Cấu hình Bot Settings (hành vi bot khi NV can thiệp)

### 1.2. Route Structure
```
/settings/automation              → Redirect to /settings/automation/tags
/settings/automation/tags         → Quản lý Tags
/settings/automation/auto-rules   → Auto Rules
/settings/automation/bot-settings → Bot Settings
```

### 1.3. Navigation
```
Sidebar Menu:
├── ...
├── Cài đặt
│   ├── ...
│   └── Automation
│       ├── Tags              ← Tab 1 (default)
│       ├── Quy tắc tự động   ← Tab 2
│       └── Cài đặt Bot       ← Tab 3
```

---

## 2. DATABASE SCHEMA

### 2.1. Table: tags
```sql
CREATE TABLE tags (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       UUID NOT NULL REFERENCES tenants(id),
    name            VARCHAR(50) NOT NULL,
    color           VARCHAR(7) NOT NULL DEFAULT '#3B82F6',  -- Hex color
    sequence_id     UUID REFERENCES sequences(id) ON DELETE SET NULL,  -- Liên kết Kịch bản (1:1)
    created_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at      TIMESTAMP WITH TIME ZONE,  -- Soft delete
    
    CONSTRAINT unique_tag_name_per_tenant UNIQUE (tenant_id, name, deleted_at)
);

CREATE INDEX idx_tags_tenant ON tags(tenant_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_tags_sequence ON tags(sequence_id) WHERE sequence_id IS NOT NULL;
```

### 2.2. Table: conversation_tags (Junction table - đã có từ Chat đa kênh)
```sql
CREATE TABLE conversation_tags (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    tag_id          UUID NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
    created_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by      UUID REFERENCES users(id),
    
    CONSTRAINT unique_conversation_tag UNIQUE (conversation_id, tag_id)
);

CREATE INDEX idx_conv_tags_conversation ON conversation_tags(conversation_id);
CREATE INDEX idx_conv_tags_tag ON conversation_tags(tag_id);
```

### 2.3. Table: auto_rules
```sql
CREATE TABLE auto_rules (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       UUID NOT NULL REFERENCES tenants(id),
    rule_type       VARCHAR(50) NOT NULL,  -- 'first_message', 'first_message_daily', 'comeback_after_days', 'conversation_synced'
    is_enabled      BOOLEAN DEFAULT FALSE,
    config          JSONB NOT NULL DEFAULT '{}',
    created_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT unique_rule_per_tenant UNIQUE (tenant_id, rule_type)
);

-- Config JSONB structure:
-- {
--   "days": 30,                          // Only for 'comeback_after_days'
--   "assign_tags": ["uuid1", "uuid2"],   // Tag IDs to assign
--   "send_flow_id": "uuid"               // Flow ID to send (optional)
-- }
```

### 2.4. Table: bot_settings
```sql
CREATE TABLE bot_settings (
    id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id               UUID NOT NULL UNIQUE REFERENCES tenants(id),
    pause_on_agent_reply    BOOLEAN DEFAULT TRUE,
    pause_duration_minutes  INTEGER DEFAULT 30 CHECK (pause_duration_minutes BETWEEN 1 AND 1440),
    auto_resume             BOOLEAN DEFAULT TRUE,
    created_at              TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at              TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 2.5. Table: bot_pause_status (Tracking pause status per conversation)
```sql
CREATE TABLE bot_pause_status (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID NOT NULL UNIQUE REFERENCES conversations(id) ON DELETE CASCADE,
    is_paused       BOOLEAN DEFAULT FALSE,
    paused_at       TIMESTAMP WITH TIME ZONE,
    resume_at       TIMESTAMP WITH TIME ZONE,  -- Scheduled resume time
    paused_by       UUID REFERENCES users(id),  -- Agent who triggered pause
    created_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_bot_pause_conversation ON bot_pause_status(conversation_id);
CREATE INDEX idx_bot_pause_resume ON bot_pause_status(resume_at) WHERE is_paused = TRUE;
```

---

## 3. API ENDPOINTS

### 3.1. Tags API

#### GET /api/settings/automation/tags
Lấy danh sách tags với thông tin liên kết và thống kê.

**Query Parameters:**
```typescript
{
  search?: string;           // Tìm theo tên tag
  has_sequence?: boolean;    // Filter: có liên kết kịch bản
  page?: number;             // Default: 1
  limit?: number;            // Default: 50, max: 100
  sort_by?: 'name' | 'created_at' | 'conversation_count';
  sort_order?: 'asc' | 'desc';
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "tags": [
      {
        "id": "uuid",
        "name": "Khách hàng",
        "color": "#EF4444",
        "sequence": {
          "id": "uuid",
          "name": "Chăm sóc KH mới"
        } | null,
        "conversation_count": 156,
        "created_at": "2026-04-01T10:00:00Z"
      }
    ],
    "pagination": {
      "total": 25,
      "page": 1,
      "limit": 50,
      "total_pages": 1
    }
  }
}
```

#### POST /api/settings/automation/tags
Tạo tag mới.

**Request Body:**
```json
{
  "name": "VIP",
  "color": "#8B5CF6"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "VIP",
    "color": "#8B5CF6",
    "sequence": null,
    "conversation_count": 0,
    "created_at": "2026-04-07T10:00:00Z"
  }
}
```

**Error Response (409 Conflict):**
```json
{
  "success": false,
  "error": {
    "code": "TAG_NAME_EXISTS",
    "message": "Tag với tên này đã tồn tại"
  }
}
```

#### PUT /api/settings/automation/tags/:id
Cập nhật tag (tên, màu).

**Request Body:**
```json
{
  "name": "VIP Gold",
  "color": "#F59E0B"
}
```

#### PUT /api/settings/automation/tags/:id/sequence
Liên kết/hủy liên kết tag với kịch bản.

**Request Body:**
```json
{
  "sequence_id": "uuid" | null  // null = hủy liên kết
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "VIP",
    "sequence": {
      "id": "uuid",
      "name": "Chăm sóc VIP"
    }
  }
}
```

#### DELETE /api/settings/automation/tags/:id
Xóa tag (soft delete).

**Response (tag đang được sử dụng):**
```json
{
  "success": true,
  "data": {
    "deleted": true,
    "warning": {
      "conversations_affected": 45,
      "sequence_unlinked": "Chăm sóc KH mới"
    }
  }
}
```

### 3.2. Auto Rules API

#### GET /api/settings/automation/auto-rules
Lấy tất cả auto rules của tenant.

**Response:**
```json
{
  "success": true,
  "data": {
    "rules": [
      {
        "id": "uuid",
        "rule_type": "first_message",
        "rule_name": "KH nhắn tin lần đầu",
        "description": "Trigger khi KH mới nhắn tin lần đầu tiên",
        "is_enabled": false,
        "config": {
          "assign_tags": [],
          "send_flow_id": null
        }
      },
      {
        "id": "uuid",
        "rule_type": "first_message_daily",
        "rule_name": "KH nhắn lần đầu trong ngày",
        "description": "Trigger mỗi ngày khi KH nhắn tin đầu tiên",
        "is_enabled": true,
        "config": {
          "assign_tags": ["uuid1", "uuid2"],
          "send_flow_id": "uuid"
        }
      },
      {
        "id": "uuid",
        "rule_type": "comeback_after_days",
        "rule_name": "KH quay lại sau X ngày",
        "description": "Trigger khi KH cũ nhắn lại sau thời gian không tương tác",
        "is_enabled": false,
        "config": {
          "days": 30,
          "assign_tags": [],
          "send_flow_id": null
        }
      },
      {
        "id": "uuid",
        "rule_type": "conversation_synced",
        "rule_name": "Hội thoại mới được đồng bộ",
        "description": "Trigger khi NV liên kết hội thoại với Lead",
        "is_enabled": false,
        "config": {
          "assign_tags": [],
          "send_flow_id": null
        }
      }
    ]
  }
}
```

#### PUT /api/settings/automation/auto-rules/:rule_type
Cập nhật cấu hình rule.

**Request Body:**
```json
{
  "is_enabled": true,
  "config": {
    "days": 30,                        // Only for comeback_after_days
    "assign_tags": ["uuid1", "uuid2"],
    "send_flow_id": "uuid"
  }
}
```

### 3.3. Bot Settings API

#### GET /api/settings/automation/bot-settings
Lấy cấu hình bot.

**Response:**
```json
{
  "success": true,
  "data": {
    "pause_on_agent_reply": true,
    "pause_duration_minutes": 30,
    "auto_resume": true
  }
}
```

#### PUT /api/settings/automation/bot-settings
Cập nhật cấu hình bot.

**Request Body:**
```json
{
  "pause_on_agent_reply": true,
  "pause_duration_minutes": 45,
  "auto_resume": true
}
```

### 3.4. Helper APIs

#### GET /api/settings/automation/sequences/active
Lấy danh sách kịch bản đang active (cho dropdown).

**Response:**
```json
{
  "success": true,
  "data": {
    "sequences": [
      { "id": "uuid", "name": "Chăm sóc KH mới" },
      { "id": "uuid", "name": "Follow up sau mua" },
      { "id": "uuid", "name": "Chúc mừng sinh nhật" }
    ]
  }
}
```

#### GET /api/settings/automation/flows/published
Lấy danh sách luồng đã published (cho dropdown).

**Response:**
```json
{
  "success": true,
  "data": {
    "flows": [
      { "id": "uuid", "name": "Chào mừng KH mới" },
      { "id": "uuid", "name": "Thông báo khuyến mãi" }
    ]
  }
}
```

---

## 4. TYPESCRIPT INTERFACES

### 4.1. Data Types
```typescript
// Tag
interface Tag {
  id: string;
  name: string;
  color: string;
  sequence: {
    id: string;
    name: string;
  } | null;
  conversationCount: number;
  createdAt: string;
}

// Auto Rule
type AutoRuleType = 
  | 'first_message' 
  | 'first_message_daily' 
  | 'comeback_after_days' 
  | 'conversation_synced';

interface AutoRuleConfig {
  days?: number;              // Only for comeback_after_days
  assignTags: string[];       // Tag IDs
  sendFlowId: string | null;  // Flow ID
}

interface AutoRule {
  id: string;
  ruleType: AutoRuleType;
  ruleName: string;
  description: string;
  isEnabled: boolean;
  config: AutoRuleConfig;
}

// Bot Settings
interface BotSettings {
  pauseOnAgentReply: boolean;
  pauseDurationMinutes: number;  // 1-1440
  autoResume: boolean;
}

// Dropdown Options
interface SelectOption {
  id: string;
  name: string;
}
```

### 4.2. Component Props
```typescript
// Tags Page
interface TagsPageProps {
  // No props - uses hooks for data fetching
}

// Tag Table
interface TagTableProps {
  tags: Tag[];
  loading: boolean;
  onEdit: (tag: Tag) => void;
  onDelete: (tag: Tag) => void;
  onLinkSequence: (tag: Tag) => void;
}

// Tag Modal (Create/Edit)
interface TagModalProps {
  isOpen: boolean;
  onClose: () => void;
  tag?: Tag;  // undefined = create mode
  onSubmit: (data: { name: string; color: string }) => Promise<void>;
}

// Link Sequence Modal
interface LinkSequenceModalProps {
  isOpen: boolean;
  onClose: () => void;
  tag: Tag;
  sequences: SelectOption[];
  onSubmit: (sequenceId: string | null) => Promise<void>;
}

// Delete Confirmation Modal
interface DeleteTagModalProps {
  isOpen: boolean;
  onClose: () => void;
  tag: Tag;
  onConfirm: () => Promise<void>;
}

// Auto Rule Card
interface AutoRuleCardProps {
  rule: AutoRule;
  tags: SelectOption[];
  flows: SelectOption[];
  onToggle: (enabled: boolean) => Promise<void>;
  onConfigChange: (config: AutoRuleConfig) => Promise<void>;
}

// Bot Settings Form
interface BotSettingsFormProps {
  settings: BotSettings;
  onSave: (settings: BotSettings) => Promise<void>;
}
```

---

## 5. COMPONENT STRUCTURE

### 5.1. Page Layout
```
/settings/automation/
├── AutomationSettingsLayout.tsx    ← Layout với tabs
│   ├── TabNavigation              ← Tags | Quy tắc tự động | Cài đặt Bot
│   └── <Outlet />                 ← Child routes
│
├── tags/
│   ├── TagsPage.tsx               ← Main page
│   ├── TagTable.tsx               ← Table component
│   ├── TagModal.tsx               ← Create/Edit modal
│   ├── LinkSequenceModal.tsx      ← Link to sequence modal
│   ├── DeleteTagModal.tsx         ← Delete confirmation
│   └── ColorPicker.tsx            ← Color selection
│
├── auto-rules/
│   ├── AutoRulesPage.tsx          ← Main page
│   ├── AutoRuleCard.tsx           ← Individual rule card
│   ├── TagMultiSelect.tsx         ← Multi-select for tags
│   └── FlowSelect.tsx             ← Single-select for flows
│
└── bot-settings/
    ├── BotSettingsPage.tsx        ← Main page
    └── BotSettingsForm.tsx        ← Settings form
```

### 5.2. State Management
```typescript
// Using React Query for server state

// Tags
const useTagsQuery = () => useQuery(['automation', 'tags'], fetchTags);
const useCreateTagMutation = () => useMutation(createTag, {
  onSuccess: () => queryClient.invalidateQueries(['automation', 'tags'])
});
const useUpdateTagMutation = () => useMutation(updateTag, { ... });
const useDeleteTagMutation = () => useMutation(deleteTag, { ... });
const useLinkSequenceMutation = () => useMutation(linkSequence, { ... });

// Auto Rules
const useAutoRulesQuery = () => useQuery(['automation', 'auto-rules'], fetchAutoRules);
const useUpdateAutoRuleMutation = () => useMutation(updateAutoRule, { ... });

// Bot Settings
const useBotSettingsQuery = () => useQuery(['automation', 'bot-settings'], fetchBotSettings);
const useUpdateBotSettingsMutation = () => useMutation(updateBotSettings, { ... });

// Helper queries
const useActiveSequencesQuery = () => useQuery(['sequences', 'active'], fetchActiveSequences);
const usePublishedFlowsQuery = () => useQuery(['flows', 'published'], fetchPublishedFlows);
```

---

## 6. UI WIREFRAMES (ASCII)

### 6.1. Tags Page
```
┌─────────────────────────────────────────────────────────────────────────────┐
│  Cài đặt > Automation                                                       │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────┐  ┌────────────────────┐  ┌───────────────┐                   │
│  │  Tags    │  │  Quy tắc tự động   │  │  Cài đặt Bot  │    ← Tab bar      │
│  └──────────┘  └────────────────────┘  └───────────────┘                   │
│   ═══════════                                                               │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                                                                     │   │
│  │  🏷️ Quản lý Tags                                                   │   │
│  │                                                                     │   │
│  │  Quản lý các tags để phân loại hội thoại và trigger kịch bản       │   │
│  │  tự động. Tags được đồng bộ với Chat đa kênh.                       │   │
│  │                                                                     │   │
│  │  ┌────────────────────────────────┐              ┌──────────────┐   │   │
│  │  │ 🔍 Tìm kiếm tag...             │              │  + Thêm thẻ  │   │   │
│  │  └────────────────────────────────┘              └──────────────┘   │   │
│  │                                                                     │   │
│  │  ┌─────────────────────────────────────────────────────────────┐   │   │
│  │  │ Màu │ Tên tag        │ Kịch bản liên kết    │ Hội thoại │   │   │   │
│  │  ├─────┼────────────────┼─────────────────────┼───────────┼───┤   │   │
│  │  │ 🔴  │ Khách hàng     │ Chăm sóc KH mới     │    156    │ ⋮ │   │   │
│  │  ├─────┼────────────────┼─────────────────────┼───────────┼───┤   │   │
│  │  │ 🟢  │ Gia đình       │ ─ Chưa liên kết ─   │     89    │ ⋮ │   │   │
│  │  ├─────┼────────────────┼─────────────────────┼───────────┼───┤   │   │
│  │  │ 🟠  │ Công việc      │ Follow up B2B       │     45    │ ⋮ │   │   │
│  │  ├─────┼────────────────┼─────────────────────┼───────────┼───┤   │   │
│  │  │ 🔵  │ Bạn bè         │ ─ Chưa liên kết ─   │     23    │ ⋮ │   │   │
│  │  ├─────┼────────────────┼─────────────────────┼───────────┼───┤   │   │
│  │  │ 🟡  │ Trả lời sau    │ Reminder 24h        │     67    │ ⋮ │   │   │
│  │  ├─────┼────────────────┼─────────────────────┼───────────┼───┤   │   │
│  │  │ 🔴  │ VIP            │ Ưu đãi VIP          │     12    │ ⋮ │   │   │
│  │  ├─────┼────────────────┼─────────────────────┼───────────┼───┤   │   │
│  │  │ 🔴  │ Khách tiềm năng│ ─ Chưa liên kết ─   │     34    │ ⋮ │   │   │
│  │  └─────┴────────────────┴─────────────────────┴───────────┴───┘   │   │
│  │                                                                     │   │
│  │  Hiển thị 7 / 7 tags                                               │   │
│  │                                                                     │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘

Action Menu (⋮):
┌─────────────────────┐
│ ✏️  Sửa tag         │
│ 🔗 Liên kết kịch bản│
│ ───────────────────│
│ 🗑️  Xóa tag         │
└─────────────────────┘
```

### 6.2. Create/Edit Tag Modal
```
┌──────────────────────────────────────────┐
│  Thêm thẻ mới                        ✕  │
├──────────────────────────────────────────┤
│                                          │
│  Tên thẻ *                               │
│  ┌────────────────────────────────────┐  │
│  │ VIP Gold                           │  │
│  └────────────────────────────────────┘  │
│  Tối đa 50 ký tự                         │
│                                          │
│  Màu sắc                                 │
│  ┌────────────────────────────────────┐  │
│  │  🔴 🟠 🟡 🟢 🔵 🟣 🩷 ⚫          │  │
│  │   ▲                                │  │
│  │   └── Selected                     │  │
│  └────────────────────────────────────┘  │
│                                          │
│  Xem trước:  🔴 VIP Gold                 │
│                                          │
│  ┌──────────┐  ┌────────────────────┐    │
│  │   Hủy    │  │     Tạo thẻ        │    │
│  └──────────┘  └────────────────────┘    │
│                                          │
└──────────────────────────────────────────┘

Color Options (Hex codes):
- 🔴 Đỏ:      #EF4444
- 🟠 Cam:     #F97316
- 🟡 Vàng:    #EAB308
- 🟢 Xanh lá: #22C55E
- 🔵 Xanh:    #3B82F6
- 🟣 Tím:     #8B5CF6
- 🩷 Hồng:    #EC4899
- ⚫ Xám:     #6B7280
```

### 6.3. Link Sequence Modal
```
┌──────────────────────────────────────────────┐
│  Liên kết kịch bản                       ✕  │
├──────────────────────────────────────────────┤
│                                              │
│  Tag: 🔴 VIP Gold                            │
│                                              │
│  Chọn kịch bản liên kết                      │
│  ┌────────────────────────────────────────┐  │
│  │ Chọn kịch bản...                    ▼ │  │
│  └────────────────────────────────────────┘  │
│                                              │
│  Dropdown options:                           │
│  ┌────────────────────────────────────────┐  │
│  │ ○ Không liên kết                       │  │
│  │ ─────────────────────────────────────  │  │
│  │ ○ Chăm sóc KH mới                      │  │
│  │ ○ Follow up sau mua                    │  │
│  │ ○ Ưu đãi VIP                           │  │
│  │ ● Chúc mừng sinh nhật  ← Selected      │  │
│  │ ○ Reminder 24h                         │  │
│  └────────────────────────────────────────┘  │
│                                              │
│  ⓘ Khi gắn tag này cho hội thoại, khách    │
│    hàng sẽ tự động được đăng ký vào kịch    │
│    bản đã chọn.                              │
│                                              │
│  ┌──────────┐  ┌────────────────────────┐    │
│  │   Hủy    │  │        Lưu             │    │
│  └──────────┘  └────────────────────────┘    │
│                                              │
└──────────────────────────────────────────────┘
```

### 6.4. Delete Tag Confirmation
```
┌──────────────────────────────────────────────┐
│  Xóa tag                                 ✕  │
├──────────────────────────────────────────────┤
│                                              │
│  ⚠️  Bạn có chắc muốn xóa tag này?          │
│                                              │
│  Tag: 🔴 VIP Gold                            │
│                                              │
│  ┌────────────────────────────────────────┐  │
│  │ ⚠️  Tag đang được sử dụng:             │  │
│  │     • 45 hội thoại đang gắn tag này    │  │
│  │     • Đang liên kết với kịch bản:      │  │
│  │       "Ưu đãi VIP"                     │  │
│  │                                        │  │
│  │ Xóa tag sẽ tự động gỡ khỏi các hội    │  │
│  │ thoại và hủy liên kết kịch bản.        │  │
│  └────────────────────────────────────────┘  │
│                                              │
│  ┌──────────┐  ┌────────────────────────┐    │
│  │   Hủy    │  │     Xác nhận xóa       │    │
│  └──────────┘  └────────────────────────┘    │
│                                              │
└──────────────────────────────────────────────┘
```

### 6.5. Auto Rules Page
```
┌─────────────────────────────────────────────────────────────────────────────┐
│  Cài đặt > Automation                                                       │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────┐  ┌────────────────────┐  ┌───────────────┐                   │
│  │  Tags    │  │  Quy tắc tự động   │  │  Cài đặt Bot  │                   │
│  └──────────┘  └────────────────────┘  └───────────────┘                   │
│                ═══════════════════════                                      │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                                                                     │   │
│  │  ⚡ Quy tắc tự động                                                │   │
│  │                                                                     │   │
│  │  Thiết lập các quy tắc tự động trigger khi có sự kiện.             │   │
│  │  Tất cả rules mặc định TẮT, Admin bật thủ công.                     │   │
│  │                                                                     │   │
│  │  ┌─────────────────────────────────────────────────────────────┐   │   │
│  │  │ RULE 1: KH nhắn tin lần đầu                      [  OFF  ] │   │   │
│  │  │ ─────────────────────────────────────────────────────────── │   │   │
│  │  │ Trigger khi KH mới nhắn tin lần đầu tiên (chưa có trong HT) │   │   │
│  │  │                                                             │   │   │
│  │  │ Gán tags:                                                   │   │   │
│  │  │ ┌─────────────────────────────────────────────────────┐     │   │   │
│  │  │ │ Chọn tags...                                     ▼ │     │   │   │
│  │  │ └─────────────────────────────────────────────────────┘     │   │   │
│  │  │                                                             │   │   │
│  │  │ Gửi luồng tin nhắn:                                         │   │   │
│  │  │ ┌─────────────────────────────────────────────────────┐     │   │   │
│  │  │ │ Không gửi                                        ▼ │     │   │   │
│  │  │ └─────────────────────────────────────────────────────┘     │   │   │
│  │  └─────────────────────────────────────────────────────────────┘   │   │
│  │                                                                     │   │
│  │  ┌─────────────────────────────────────────────────────────────┐   │   │
│  │  │ RULE 2: KH nhắn lần đầu trong ngày              [████ ON ] │   │   │
│  │  │ ─────────────────────────────────────────────────────────── │   │   │
│  │  │ Trigger mỗi ngày khi KH nhắn tin đầu tiên                   │   │   │
│  │  │                                                             │   │   │
│  │  │ Gán tags:                                                   │   │   │
│  │  │ ┌─────────────────────────────────────────────────────┐     │   │   │
│  │  │ │ 🟡 Trả lời sau  ✕  │ 🔵 Active today  ✕          │     │   │   │
│  │  │ └─────────────────────────────────────────────────────┘     │   │   │
│  │  │                                                             │   │   │
│  │  │ Gửi luồng tin nhắn:                                         │   │   │
│  │  │ ┌─────────────────────────────────────────────────────┐     │   │   │
│  │  │ │ Chào mừng hàng ngày                              ▼ │     │   │   │
│  │  │ └─────────────────────────────────────────────────────┘     │   │   │
│  │  └─────────────────────────────────────────────────────────────┘   │   │
│  │                                                                     │   │
│  │  ┌─────────────────────────────────────────────────────────────┐   │   │
│  │  │ RULE 3: KH quay lại sau X ngày                   [  OFF  ] │   │   │
│  │  │ ─────────────────────────────────────────────────────────── │   │   │
│  │  │ Trigger khi KH cũ nhắn lại sau thời gian không tương tác    │   │   │
│  │  │                                                             │   │   │
│  │  │ Số ngày không tương tác:                                    │   │   │
│  │  │ ┌─────────┐                                                 │   │   │
│  │  │ │   30    │ ngày                                            │   │   │
│  │  │ └─────────┘                                                 │   │   │
│  │  │                                                             │   │   │
│  │  │ Gán tags:     [Chọn tags...]                                │   │   │
│  │  │ Gửi luồng:    [Không gửi    ]                               │   │   │
│  │  └─────────────────────────────────────────────────────────────┘   │   │
│  │                                                                     │   │
│  │  ┌─────────────────────────────────────────────────────────────┐   │   │
│  │  │ RULE 4: Hội thoại mới được đồng bộ               [  OFF  ] │   │   │
│  │  │ ─────────────────────────────────────────────────────────── │   │   │
│  │  │ Trigger khi NV liên kết hội thoại với Lead trong CRM        │   │   │
│  │  │                                                             │   │   │
│  │  │ Gán tags:     [Chọn tags...]                                │   │   │
│  │  │ Gửi luồng:    [Không gửi    ]                               │   │   │
│  │  └─────────────────────────────────────────────────────────────┘   │   │
│  │                                                                     │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 6.6. Bot Settings Page
```
┌─────────────────────────────────────────────────────────────────────────────┐
│  Cài đặt > Automation                                                       │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────┐  ┌────────────────────┐  ┌───────────────┐                   │
│  │  Tags    │  │  Quy tắc tự động   │  │  Cài đặt Bot  │                   │
│  └──────────┘  └────────────────────┘  └───────────────┘                   │
│                                         ═══════════════                     │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                                                                     │   │
│  │  🤖 Cài đặt Bot                                                    │   │
│  │                                                                     │   │
│  │  Cấu hình hành vi của Bot automation khi nhân viên can thiệp.       │   │
│  │                                                                     │   │
│  │  ┌─────────────────────────────────────────────────────────────┐   │   │
│  │  │                                                             │   │   │
│  │  │  1. Tạm dừng Bot khi nhân viên trả lời                      │   │   │
│  │  │  ─────────────────────────────────────────────────────────  │   │   │
│  │  │                                                             │   │   │
│  │  │  Khi nhân viên gửi tin nhắn cho khách hàng, Bot sẽ tự      │   │   │
│  │  │  động tạm dừng hoạt động để tránh xung đột.                │   │   │
│  │  │                                                             │   │   │
│  │  │  Trạng thái:     [████████████ ON ]                         │   │   │
│  │  │                                                             │   │   │
│  │  │  Thời gian tạm dừng:                                        │   │   │
│  │  │  ┌─────────┐                                                │   │   │
│  │  │  │   30    │ phút    (1 - 1440 phút)                        │   │   │
│  │  │  └─────────┘                                                │   │   │
│  │  │                                                             │   │   │
│  │  └─────────────────────────────────────────────────────────────┘   │   │
│  │                                                                     │   │
│  │  ┌─────────────────────────────────────────────────────────────┐   │   │
│  │  │                                                             │   │   │
│  │  │  2. Tự động kích hoạt lại Bot                               │   │   │
│  │  │  ─────────────────────────────────────────────────────────  │   │   │
│  │  │                                                             │   │   │
│  │  │  Sau thời gian tạm dừng, Bot tự động resume hoạt động.      │   │   │
│  │  │  Nếu TẮT, Bot sẽ dừng vĩnh viễn cho KH đó đến khi NV       │   │   │
│  │  │  bật lại thủ công.                                          │   │   │
│  │  │                                                             │   │   │
│  │  │  Trạng thái:     [████████████ ON ]                         │   │   │
│  │  │                                                             │   │   │
│  │  └─────────────────────────────────────────────────────────────┘   │   │
│  │                                                                     │   │
│  │  ┌─────────────────────────────────────────────────────────────┐   │   │
│  │  │                                                             │   │   │
│  │  │  📋 Xem trước cấu hình                                      │   │   │
│  │  │  ─────────────────────────────────────────────────────────  │   │   │
│  │  │                                                             │   │   │
│  │  │  "Khi nhân viên trả lời, Bot sẽ tạm dừng 30 phút           │   │   │
│  │  │   và tự động kích hoạt lại sau đó."                         │   │   │
│  │  │                                                             │   │   │
│  │  └─────────────────────────────────────────────────────────────┘   │   │
│  │                                                                     │   │
│  │                                    ┌────────────────────────┐       │   │
│  │                                    │     Lưu cài đặt        │       │   │
│  │                                    └────────────────────────┘       │   │
│  │                                                                     │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 7. VALIDATION RULES

### 7.1. Tag Validation
```typescript
const tagValidation = {
  name: {
    required: true,
    maxLength: 50,
    pattern: /^[^\s].*[^\s]$/,  // No leading/trailing spaces
    unique: true,  // Per tenant
    messages: {
      required: "Vui lòng nhập tên tag",
      maxLength: "Tên tag tối đa 50 ký tự",
      pattern: "Tên tag không được có khoảng trắng đầu/cuối",
      unique: "Tag với tên này đã tồn tại"
    }
  },
  color: {
    required: true,
    pattern: /^#[0-9A-Fa-f]{6}$/,
    allowedValues: ['#EF4444', '#F97316', '#EAB308', '#22C55E', '#3B82F6', '#8B5CF6', '#EC4899', '#6B7280'],
    messages: {
      required: "Vui lòng chọn màu",
      pattern: "Màu không hợp lệ"
    }
  }
};
```

### 7.2. Auto Rule Validation
```typescript
const autoRuleValidation = {
  days: {  // Only for comeback_after_days
    required: true,
    min: 1,
    max: 365,
    messages: {
      required: "Vui lòng nhập số ngày",
      min: "Tối thiểu 1 ngày",
      max: "Tối đa 365 ngày"
    }
  },
  assignTags: {
    maxItems: 10,
    messages: {
      maxItems: "Tối đa 10 tags"
    }
  },
  sendFlowId: {
    mustBePublished: true,
    messages: {
      mustBePublished: "Chỉ được chọn luồng đã Published"
    }
  }
};
```

### 7.3. Bot Settings Validation
```typescript
const botSettingsValidation = {
  pauseDurationMinutes: {
    required: true,
    min: 1,
    max: 1440,
    messages: {
      required: "Vui lòng nhập thời gian",
      min: "Tối thiểu 1 phút",
      max: "Tối đa 1440 phút (24 giờ)"
    }
  }
};
```

---

## 8. PERMISSION MATRIX

### 8.1. Access Control
```typescript
const permissions = {
  // Page access
  '/settings/automation': ['admin'],
  '/settings/automation/tags': ['admin'],
  '/settings/automation/auto-rules': ['admin'],
  '/settings/automation/bot-settings': ['admin'],
  
  // API endpoints
  'GET /api/settings/automation/*': ['admin'],
  'POST /api/settings/automation/*': ['admin'],
  'PUT /api/settings/automation/*': ['admin'],
  'DELETE /api/settings/automation/*': ['admin'],
};
```

### 8.2. Feature Access Matrix

| Feature | Admin | Manager | Nhân viên |
|---------|-------|---------|-----------|
| Xem trang Cài đặt Automation | ✅ | ❌ | ❌ |
| Xem danh sách Tags | ✅ | ❌ | ❌ |
| Tạo/Sửa/Xóa Tags | ✅ | ❌ | ❌ |
| Liên kết Tag - Kịch bản | ✅ | ❌ | ❌ |
| Cấu hình Auto Rules | ✅ | ❌ | ❌ |
| Cấu hình Bot Settings | ✅ | ❌ | ❌ |
| Gắn/Gỡ Tag trong Chat đa kênh | ✅ | ✅ | ✅ |

---

## 9. ERROR HANDLING

### 9.1. API Error Codes
```typescript
const errorCodes = {
  // Tags
  'TAG_NAME_EXISTS': 'Tag với tên này đã tồn tại',
  'TAG_NOT_FOUND': 'Không tìm thấy tag',
  'TAG_IN_USE': 'Tag đang được sử dụng, không thể xóa',
  
  // Sequences
  'SEQUENCE_NOT_FOUND': 'Không tìm thấy kịch bản',
  'SEQUENCE_NOT_ACTIVE': 'Kịch bản không ở trạng thái Active',
  
  // Flows
  'FLOW_NOT_FOUND': 'Không tìm thấy luồng tin nhắn',
  'FLOW_NOT_PUBLISHED': 'Luồng chưa được xuất bản',
  
  // General
  'UNAUTHORIZED': 'Bạn không có quyền thực hiện thao tác này',
  'VALIDATION_ERROR': 'Dữ liệu không hợp lệ',
  'INTERNAL_ERROR': 'Đã có lỗi xảy ra, vui lòng thử lại'
};
```

### 9.2. Error Display
```typescript
// Toast notification for errors
const showError = (error: ApiError) => {
  toast.error(errorCodes[error.code] || error.message);
};

// Inline validation errors
const FormField = ({ error }: { error?: string }) => (
  <div>
    <input className={error ? 'border-red-500' : ''} />
    {error && <span className="text-red-500 text-sm">{error}</span>}
  </div>
);
```

---

## 10. SYNCHRONIZATION LOGIC

### 10.1. Tag Sync with Chat đa kênh
```typescript
// Khi tạo/sửa/xóa tag trong Cài đặt
// → Real-time sync đến Chat đa kênh

// Event emitter
const tagEvents = {
  'tag:created': (tag: Tag) => {
    // Broadcast to all connected clients
    websocket.broadcast('tag:created', tag);
  },
  'tag:updated': (tag: Tag) => {
    websocket.broadcast('tag:updated', tag);
  },
  'tag:deleted': (tagId: string) => {
    websocket.broadcast('tag:deleted', { id: tagId });
  }
};

// Chat đa kênh listens
useEffect(() => {
  socket.on('tag:created', (tag) => {
    queryClient.invalidateQueries(['tags']);
  });
  // ... similar for updated, deleted
}, []);
```

### 10.2. Tag-Sequence Trigger Logic
```typescript
// Khi gắn tag cho hội thoại (trong Chat đa kênh)
async function onTagAssigned(conversationId: string, tagId: string) {
  const tag = await getTag(tagId);
  
  if (tag.sequenceId) {
    // Tự động đăng ký KH vào kịch bản
    const conversation = await getConversation(conversationId);
    await enrollCustomerToSequence(conversation.customerId, tag.sequenceId);
  }
}

// Khi gỡ tag khỏi hội thoại
async function onTagRemoved(conversationId: string, tagId: string) {
  const tag = await getTag(tagId);
  
  if (tag.sequenceId) {
    // Tự động hủy KH khỏi kịch bản
    const conversation = await getConversation(conversationId);
    await unenrollCustomerFromSequence(conversation.customerId, tag.sequenceId);
  }
}
```

---

## 11. DESIGN TOKENS

### 11.1. Colors (Matching ViLead Design System)
```css
:root {
  /* Primary */
  --color-primary: #1A2744;
  --color-accent: #E8652D;
  
  /* Tag colors */
  --tag-red: #EF4444;
  --tag-orange: #F97316;
  --tag-yellow: #EAB308;
  --tag-green: #22C55E;
  --tag-blue: #3B82F6;
  --tag-purple: #8B5CF6;
  --tag-pink: #EC4899;
  --tag-gray: #6B7280;
  
  /* Status */
  --color-success: #22C55E;
  --color-warning: #F59E0B;
  --color-error: #EF4444;
  --color-info: #3B82F6;
  
  /* Backgrounds */
  --bg-primary: #FFFFFF;
  --bg-secondary: #F8F9FA;
  --bg-hover: #F3F4F6;
  
  /* Borders */
  --border-light: #E5E7EB;
  --border-medium: #D1D5DB;
}
```

### 11.2. Spacing
```css
:root {
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  --spacing-xl: 32px;
}
```

### 11.3. Typography
```css
:root {
  --font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  
  --text-xs: 12px;
  --text-sm: 14px;
  --text-base: 16px;
  --text-lg: 18px;
  --text-xl: 20px;
  --text-2xl: 24px;
}
```

---

## 12. IMPLEMENTATION NOTES

### 12.1. Key Implementation Points
1. **Tag sync**: Sử dụng WebSocket để real-time sync giữa Cài đặt và Chat đa kênh
2. **Dropdown data**: Pre-fetch danh sách Sequences và Flows khi load page
3. **Auto-save**: Auto Rules và Bot Settings save onChange (với debounce 500ms)
4. **Optimistic updates**: Update UI trước khi API response
5. **Error recovery**: Rollback UI nếu API fail

### 12.2. Performance Considerations
1. **Pagination**: Tags list với lazy loading (50 items/page)
2. **Caching**: Cache Sequences và Flows dropdown với staleTime 5 phút
3. **Debounce**: Search input debounce 300ms
4. **Memoization**: Memoize heavy computations và callbacks

### 12.3. Testing Checklist
- [ ] CRUD Tags hoạt động đúng
- [ ] Tag sync 2 chiều với Chat đa kênh
- [ ] Liên kết Tag-Sequence hoạt động
- [ ] Auto enroll/unenroll khi gắn/gỡ tag
- [ ] 4 Auto Rules toggle và config đúng
- [ ] Bot Settings save đúng
- [ ] Permission chỉ Admin truy cập được
- [ ] Validation messages hiển thị đúng
- [ ] Error handling và recovery

---

**END OF SPECIFICATION**
