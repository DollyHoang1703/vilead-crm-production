# UI SPECIFICATION - MODULE 4.13.1: LUỒNG TIN NHẮN (FLOW BUILDER)

> **Version:** 1.0  
> **Last Updated:** 2026-04-07  
> **Target:** Copilot / Claude Code / Developers  
> **Framework:** React + TypeScript + TailwindCSS

---

## TABLE OF CONTENTS

1. [Overview](#1-overview)
2. [Database Schema](#2-database-schema)
3. [API Endpoints](#3-api-endpoints)
4. [Component Architecture](#4-component-architecture)
5. [Page Specifications](#5-page-specifications)
6. [Validation Rules](#6-validation-rules)
7. [Constants & Enums](#7-constants--enums)

---

## 1. OVERVIEW

### 1.1 Module Description

Luồng tin nhắn (Flow Builder) là visual editor cho phép tạo và quản lý các automation flows. Module này là nền tảng để Kịch bản chăm sóc (4.13.2) tham chiếu.

### 1.2 Key Features

- CRUD Luồng tin nhắn
- CRUD Thư mục phân loại
- Visual Flow Editor với drag-drop nodes
- Preview & Test flows
- Version control (Draft/Published)
- Gửi luồng từ Inbox

### 1.3 Channels Supported

- Zalo OA
- Zalo Personal
- Facebook Messenger

---

## 2. DATABASE SCHEMA

### 2.1 Tables

```sql
-- =====================================================
-- TABLE: flow_folders (Thư mục)
-- =====================================================
CREATE TABLE flow_folders (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name            VARCHAR(50) NOT NULL,
    description     TEXT,
    position        INTEGER DEFAULT 0,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by      UUID REFERENCES users(id),
    
    CONSTRAINT uq_folder_name UNIQUE (name)
);

-- Default folder (không xóa được)
INSERT INTO flow_folders (id, name, position) 
VALUES ('00000000-0000-0000-0000-000000000001', 'Chưa phân loại', 0);


-- =====================================================
-- TABLE: flows (Luồng tin nhắn)
-- =====================================================
CREATE TABLE flows (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name            VARCHAR(100) NOT NULL,
    shortcut        VARCHAR(20),
    folder_id       UUID REFERENCES flow_folders(id) DEFAULT '00000000-0000-0000-0000-000000000001',
    status          VARCHAR(20) DEFAULT 'draft', -- draft | published | trash
    current_version INTEGER DEFAULT 1,
    
    -- Metadata
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by      UUID REFERENCES users(id),
    updated_by      UUID REFERENCES users(id),
    deleted_at      TIMESTAMP, -- Soft delete
    
    CONSTRAINT uq_flow_shortcut UNIQUE (shortcut),
    CONSTRAINT chk_status CHECK (status IN ('draft', 'published', 'trash'))
);

CREATE INDEX idx_flows_folder ON flows(folder_id);
CREATE INDEX idx_flows_status ON flows(status);
CREATE INDEX idx_flows_shortcut ON flows(shortcut);


-- =====================================================
-- TABLE: flow_versions (Phiên bản)
-- =====================================================
CREATE TABLE flow_versions (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    flow_id         UUID REFERENCES flows(id) ON DELETE CASCADE,
    version         INTEGER NOT NULL,
    nodes           JSONB NOT NULL, -- Array of nodes
    edges           JSONB NOT NULL, -- Array of edges
    published_at    TIMESTAMP,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by      UUID REFERENCES users(id),
    
    CONSTRAINT uq_flow_version UNIQUE (flow_id, version)
);

CREATE INDEX idx_flow_versions_flow ON flow_versions(flow_id);


-- =====================================================
-- TABLE: flow_executions (Lịch sử thực thi)
-- =====================================================
CREATE TABLE flow_executions (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    flow_id         UUID REFERENCES flows(id),
    flow_version    INTEGER,
    conversation_id UUID REFERENCES conversations(id),
    customer_id     UUID REFERENCES customers(id),
    
    -- Execution state
    status          VARCHAR(20) DEFAULT 'running', -- running | completed | paused | failed
    current_node_id VARCHAR(50),
    started_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at    TIMESTAMP,
    
    -- Trigger info
    triggered_by    VARCHAR(50), -- manual | sequence | keyword
    triggered_user  UUID REFERENCES users(id), -- Nếu manual
    
    -- Execution data
    variables       JSONB DEFAULT '{}',
    execution_log   JSONB DEFAULT '[]'
);

CREATE INDEX idx_executions_flow ON flow_executions(flow_id);
CREATE INDEX idx_executions_conversation ON flow_executions(conversation_id);
CREATE INDEX idx_executions_status ON flow_executions(status);


-- =====================================================
-- TABLE: flow_usage (Tracking sử dụng)
-- =====================================================
CREATE TABLE flow_usage (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    flow_id         UUID REFERENCES flows(id) ON DELETE CASCADE,
    used_by_type    VARCHAR(50) NOT NULL, -- sequence | keyword | manual
    used_by_id      UUID, -- ID của sequence/keyword sử dụng
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_flow_usage_flow ON flow_usage(flow_id);
```

### 2.2 Node JSON Structure

```typescript
// Node trong flow_versions.nodes
interface FlowNode {
  id: string;           // Unique ID: "node_1", "node_2"...
  type: NodeType;       // Loại node
  position: {
    x: number;
    y: number;
  };
  data: NodeData;       // Dữ liệu cụ thể theo type
}

type NodeType = 
  // Special
  | 'start'
  // Content
  | 'text' | 'image' | 'video' | 'audio' | 'file' | 'carousel'
  // Interaction
  | 'buttons' | 'quick_reply' | 'wait_response'
  // Logic
  | 'condition' | 'random'
  // Timing
  | 'delay'
  // Action
  | 'action';
```

### 2.3 Node Data Schemas

```typescript
// ===== CONTENT NODES =====

interface TextNodeData {
  content: string;        // Max 1000 chars
}

interface ImageNodeData {
  url?: string;
  fileId?: string;        // Uploaded file
  caption?: string;
}

interface VideoNodeData {
  url?: string;
  fileId?: string;
}

interface AudioNodeData {
  fileId: string;
}

interface FileNodeData {
  fileId: string;
  fileName: string;
  fileSize: number;
}

interface CarouselNodeData {
  cards: CarouselCard[];  // Max 10 cards
}

interface CarouselCard {
  imageUrl: string;
  title: string;          // Max 45 chars
  description: string;    // Max 80 chars
  buttons: Button[];      // Max 3 buttons
}


// ===== INTERACTION NODES =====

interface ButtonsNodeData {
  buttons: Button[];      // Max 3 buttons
}

interface Button {
  id: string;
  label: string;          // Max 20 chars
  type: 'flow' | 'url' | 'phone';
  value: string;          // nodeId | URL | phone number
}

interface QuickReplyNodeData {
  replies: QuickReply[];  // Max 10 replies
}

interface QuickReply {
  id: string;
  label: string;          // Max 20 chars
  type: 'flow' | 'email' | 'phone';
  targetNodeId?: string;  // Nếu type = flow
}

interface WaitResponseNodeData {
  timeoutValue?: number;
  timeoutUnit?: 'minutes' | 'hours' | 'days';
  timeoutNodeId?: string; // Node chạy khi timeout
}


// ===== LOGIC NODES =====

interface ConditionNodeData {
  logic: 'and' | 'or';    // Thỏa mãn TẤT CẢ | MỘT TRONG
  conditions: Condition[];
}

interface Condition {
  field: ConditionField;
  operator: ConditionOperator;
  value: string | string[];
}

type ConditionField = 
  | 'customer_name' | 'customer_phone' | 'customer_email'
  | 'customer_gender' | 'tags' | 'channel' | 'day_of_week' | 'hour';

type ConditionOperator = 
  | 'equals' | 'not_equals' | 'contains' | 'not_contains'
  | 'starts_with' | 'ends_with'
  | 'in' | 'not_in'
  | 'is_empty' | 'is_not_empty';

interface RandomNodeData {
  branches: RandomBranch[];
}

interface RandomBranch {
  id: string;
  name: string;
  percentage: number;     // Tổng = 100
}


// ===== TIMING NODES =====

interface DelayNodeData {
  value: number;
  unit: 'minutes' | 'hours' | 'days';
  sendWindow?: {
    enabled: boolean;
    startHour: number;    // 0-23
    endHour: number;      // 0-23
  };
}


// ===== ACTION NODES =====

interface ActionNodeData {
  actions: Action[];
}

type Action = 
  | { type: 'add_tag'; tagIds: string[] }
  | { type: 'remove_tag'; tagIds: string[] }
  | { type: 'create_task'; title: string; description?: string; assignTo: 'owner' | string; dueDays: number }
  | { type: 'create_reminder'; content: string; delayValue: number; delayUnit: 'minutes' | 'hours' | 'days'; assignTo: 'owner' | string }
  | { type: 'pause_bot'; duration: number; unit: 'minutes' | 'hours' }
  | { type: 'resume_bot' }
  | { type: 'subscribe_sequence'; sequenceId: string }
  | { type: 'unsubscribe_sequence'; sequenceId: string };
```

### 2.4 Edge JSON Structure

```typescript
interface FlowEdge {
  id: string;
  source: string;         // Source node ID
  target: string;         // Target node ID
  sourceHandle?: string;  // Output handle (cho condition/random)
  label?: string;         // Label hiển thị
}

// Examples:
// Normal: { id: "e1", source: "node_1", target: "node_2" }
// Condition: { id: "e2", source: "node_3", target: "node_4", sourceHandle: "true", label: "Thỏa mãn" }
// Random: { id: "e3", source: "node_5", target: "node_6", sourceHandle: "branch_1", label: "50%" }
```

---

## 3. API ENDPOINTS

### 3.1 Folders API

```yaml
# GET /api/v1/flows/folders
# List all folders
Response:
  - id: string
  - name: string
  - flowCount: number
  - position: number
  - isDefault: boolean

# POST /api/v1/flows/folders
# Create folder
Request:
  name: string (required, max 50)
Response:
  id: string
  name: string

# PUT /api/v1/flows/folders/:id
# Update folder
Request:
  name: string (required, max 50)

# DELETE /api/v1/flows/folders/:id
# Delete folder (chỉ khi rỗng hoặc chuyển flows)
Request:
  moveFlowsTo?: string (folder ID to move flows)
```

### 3.2 Flows API

```yaml
# GET /api/v1/flows
# List flows with filters
Query:
  folderId?: string
  status?: 'draft' | 'published' | 'trash'
  search?: string
  page?: number (default 1)
  limit?: number (default 20)
  sortBy?: 'name' | 'updatedAt' | 'createdAt'
  sortOrder?: 'asc' | 'desc'
Response:
  data:
    - id: string
    - name: string
    - shortcut: string | null
    - folder: { id, name }
    - status: string
    - usedByCount: number
    - updatedAt: string
    - createdBy: { id, name }
  pagination:
    total: number
    page: number
    limit: number
    totalPages: number

# POST /api/v1/flows
# Create new flow
Request:
  name: string (required, max 100)
  folderId?: string
  shortcut?: string (max 20, no spaces)
Response:
  id: string
  name: string
  status: 'draft'

# GET /api/v1/flows/:id
# Get flow detail with nodes/edges
Response:
  id: string
  name: string
  shortcut: string | null
  folder: { id, name }
  status: string
  currentVersion: number
  nodes: FlowNode[]
  edges: FlowEdge[]
  usedBy: Array<{ type, id, name }>
  createdAt: string
  updatedAt: string

# PUT /api/v1/flows/:id
# Update flow metadata
Request:
  name?: string
  folderId?: string
  shortcut?: string

# PUT /api/v1/flows/:id/content
# Save flow content (nodes & edges)
Request:
  nodes: FlowNode[]
  edges: FlowEdge[]
Response:
  success: boolean
  version: number (nếu đang draft thì giữ nguyên, nếu published thì tạo draft mới)

# POST /api/v1/flows/:id/publish
# Validate and publish flow
Response:
  success: boolean
  version: number
  errors?: ValidationError[] (nếu invalid)

# POST /api/v1/flows/:id/duplicate
# Duplicate flow
Response:
  id: string (new flow ID)
  name: string (original name + ' - Copy')

# DELETE /api/v1/flows/:id
# Soft delete flow (move to trash)
Response:
  success: boolean
  error?: string (nếu đang được sử dụng)

# POST /api/v1/flows/:id/restore
# Restore from trash

# GET /api/v1/flows/:id/versions
# List all versions
Response:
  - version: number
  - publishedAt: string | null
  - createdAt: string
  - createdBy: { id, name }

# POST /api/v1/flows/:id/versions/:version/rollback
# Rollback to specific version
```

### 3.3 Flow Execution API

```yaml
# POST /api/v1/flows/:id/execute
# Execute flow for a conversation (from Inbox)
Request:
  conversationId: string
Response:
  executionId: string
  status: 'running'

# GET /api/v1/flows/executions/:id
# Get execution status
Response:
  id: string
  flowId: string
  status: 'running' | 'completed' | 'paused' | 'failed'
  currentNodeId: string | null
  startedAt: string
  completedAt: string | null
```

### 3.4 Validation Error Schema

```typescript
interface ValidationError {
  nodeId?: string;
  field?: string;
  code: string;
  message: string;
}

// Error codes:
// - DISCONNECTED_NODE: Node không được kết nối
// - EMPTY_CONTENT: Node nội dung trống
// - EMPTY_CONDITION: Node điều kiện không có condition
// - INVALID_PERCENTAGE: Tổng % của Random không = 100
// - NO_CONTENT_NODE: Flow không có node nội dung sau Start
// - CIRCULAR_REFERENCE: Phát hiện vòng lặp
```

---

## 4. COMPONENT ARCHITECTURE

### 4.1 Page Structure

```
src/
├── pages/
│   └── automation/
│       └── flows/
│           ├── index.tsx           # List page
│           └── [id]/
│               └── editor.tsx      # Flow Editor page
├── components/
│   └── flows/
│       ├── FlowList/
│       │   ├── FlowTable.tsx
│       │   ├── FolderSidebar.tsx
│       │   ├── FlowActions.tsx
│       │   └── CreateFlowModal.tsx
│       ├── FlowEditor/
│       │   ├── FlowCanvas.tsx      # React Flow wrapper
│       │   ├── NodePalette.tsx     # Drag source
│       │   ├── ConfigPanel.tsx     # Right panel
│       │   ├── PreviewPanel.tsx
│       │   ├── Toolbar.tsx
│       │   └── nodes/
│       │       ├── StartNode.tsx
│       │       ├── TextNode.tsx
│       │       ├── ImageNode.tsx
│       │       ├── VideoNode.tsx
│       │       ├── AudioNode.tsx
│       │       ├── FileNode.tsx
│       │       ├── CarouselNode.tsx
│       │       ├── ButtonsNode.tsx
│       │       ├── QuickReplyNode.tsx
│       │       ├── WaitResponseNode.tsx
│       │       ├── ConditionNode.tsx
│       │       ├── RandomNode.tsx
│       │       ├── DelayNode.tsx
│       │       └── ActionNode.tsx
│       └── FlowPreview/
│           └── ChatSimulator.tsx
├── hooks/
│   └── flows/
│       ├── useFlows.ts
│       ├── useFlowEditor.ts
│       └── useFlowExecution.ts
└── stores/
    └── flowEditorStore.ts          # Zustand store
```

### 4.2 Key Component Props

```typescript
// ===== LIST PAGE =====

interface FlowTableProps {
  flows: Flow[];
  loading: boolean;
  onEdit: (id: string) => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
  onSort: (field: string, order: 'asc' | 'desc') => void;
}

interface FolderSidebarProps {
  folders: Folder[];
  selectedFolderId: string | null;
  onSelect: (folderId: string | null) => void;
  onCreateFolder: () => void;
  onEditFolder: (folder: Folder) => void;
  onDeleteFolder: (folderId: string) => void;
  onDragFlow: (flowId: string, targetFolderId: string) => void;
}

interface CreateFlowModalProps {
  open: boolean;
  folders: Folder[];
  onClose: () => void;
  onSubmit: (data: CreateFlowData) => Promise<void>;
}

interface CreateFlowData {
  name: string;
  folderId?: string;
  shortcut?: string;
}


// ===== EDITOR PAGE =====

interface FlowCanvasProps {
  nodes: FlowNode[];
  edges: FlowEdge[];
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (connection: Connection) => void;
  onNodeClick: (node: FlowNode) => void;
}

interface NodePaletteProps {
  onDragStart: (nodeType: NodeType) => void;
}

interface ConfigPanelProps {
  selectedNode: FlowNode | null;
  onUpdate: (nodeId: string, data: NodeData) => void;
  onDelete: (nodeId: string) => void;
}

interface ToolbarProps {
  flowName: string;
  status: FlowStatus;
  hasChanges: boolean;
  onSave: () => void;
  onPublish: () => void;
  onPreview: () => void;
  onSettings: () => void;
}

interface PreviewPanelProps {
  open: boolean;
  flow: { nodes: FlowNode[]; edges: FlowEdge[] };
  testVariables: Record<string, string>;
  onClose: () => void;
  onVariablesChange: (vars: Record<string, string>) => void;
}


// ===== NODE COMPONENTS =====

// Base props for all nodes
interface BaseNodeProps {
  id: string;
  data: NodeData;
  selected: boolean;
}

// Example: TextNode
interface TextNodeProps extends BaseNodeProps {
  data: TextNodeData;
}
```

### 4.3 State Management (Zustand)

```typescript
// stores/flowEditorStore.ts

interface FlowEditorState {
  // Flow data
  flowId: string | null;
  flowName: string;
  status: FlowStatus;
  nodes: FlowNode[];
  edges: FlowEdge[];
  
  // Editor state
  selectedNodeId: string | null;
  hasUnsavedChanges: boolean;
  isPreviewOpen: boolean;
  validationErrors: ValidationError[];
  
  // Actions
  setFlow: (flow: FlowDetail) => void;
  addNode: (type: NodeType, position: Position) => void;
  updateNode: (nodeId: string, data: Partial<NodeData>) => void;
  deleteNode: (nodeId: string) => void;
  addEdge: (edge: FlowEdge) => void;
  deleteEdge: (edgeId: string) => void;
  selectNode: (nodeId: string | null) => void;
  setPreviewOpen: (open: boolean) => void;
  validate: () => ValidationError[];
  resetChanges: () => void;
}

const useFlowEditorStore = create<FlowEditorState>((set, get) => ({
  // ... implementation
}));
```

---

## 5. PAGE SPECIFICATIONS

### 5.1 Flow List Page

```
┌─────────────────────────────────────────────────────────────────────────┐
│ ← Automation    Luồng tin nhắn                         [+ Tạo mới]     │
├─────────────────────────────────────────────────────────────────────────┤
│ ┌──────────────┐  ┌───────────────────────────────────────────────────┐ │
│ │ THƯ MỤC      │  │ 🔍 Tìm kiếm...                    [Sắp xếp ▼]    │ │
│ │              │  ├───────────────────────────────────────────────────┤ │
│ │ ○ Tất cả (25)│  │ □ Tên             Thư mục    Shortcut  Cập nhật  │ │
│ │ ○ Chưa phân  │  ├───────────────────────────────────────────────────┤ │
│ │   loại (10)  │  │ □ Chào mừng KH    Marketing   /chao    2 giờ     ●│ │
│ │ ○ Marketing  │  │ □ Xác nhận đơn    Sales       /xacnhan 1 ngày    ●│ │
│ │   (8)        │  │ □ Hỏi feedback    Support     /fb      3 ngày    ●│ │
│ │ ○ Sales (5)  │  │ □ [Draft] Test    Chưa phân   -        5 phút    ●│ │
│ │ ○ Support(2) │  │                                                   │ │
│ │              │  ├───────────────────────────────────────────────────┤ │
│ │ [+ Thư mục]  │  │ ◀ 1 2 3 ... ▶                   Hiển thị: 20 ▼   │ │
│ └──────────────┘  └───────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────┘

● = Menu actions (Sửa | Sao chép | Xóa)
```

### 5.2 Flow Editor Page

```
┌─────────────────────────────────────────────────────────────────────────┐
│ ← Danh sách    Chào mừng KH mới                [Lưu] [Xem trước] [Xuất]│
├─────────────────────────────────────────────────────────────────────────┤
│ ┌────────┐  ┌─────────────────────────────────────┐  ┌────────────────┐ │
│ │ NODES  │  │                                     │  │ CẤU HÌNH       │ │
│ │        │  │                                     │  │                │ │
│ │ ─ Nội  │  │        ┌─────────┐                  │  │ Node: Văn bản  │ │
│ │   dung │  │        │ ● Bắt   │                  │  │                │ │
│ │ • Văn  │  │        │  đầu    │                  │  │ Nội dung:      │ │
│ │   bản  │  │        └────┬────┘                  │  │ ┌────────────┐ │ │
│ │ • Ảnh  │  │             │                       │  │ │ Xin chào   │ │ │
│ │ • Video│  │             ▼                       │  │ │ {ten}!     │ │ │
│ │ • Audio│  │        ┌─────────┐                  │  │ │            │ │ │
│ │ • File │  │        │ 📝 Văn  │◄─── Selected     │  │ └────────────┘ │ │
│ │ • Bộ   │  │        │  bản    │                  │  │                │ │
│ │   sưu  │  │        └────┬────┘                  │  │ Biến động:     │ │
│ │   tập  │  │             │                       │  │ [+ Thêm biến]  │ │
│ │        │  │             ▼                       │  │                │ │
│ │ ─ Tương│  │        ┌─────────┐                  │  │ • {ten}        │ │
│ │   tác  │  │        │ 🔘 Quick│                  │  │ • {sdt}        │ │
│ │ • Nút  │  │        │  Reply  │                  │  │ • {email}      │ │
│ │ • QR   │  │        └─────────┘                  │  │                │ │
│ │ • Chờ  │  │                                     │  │                │ │
│ │        │  │                                     │  │ [Xóa node]     │ │
│ │ ...    │  │                                     │  │                │ │
│ └────────┘  └─────────────────────────────────────┘  └────────────────┘ │
│             Zoom: [−] 100% [+]     Grid: [✓]                            │
└─────────────────────────────────────────────────────────────────────────┘
```

### 5.3 Preview Panel (Slide-in from right)

```
┌──────────────────────────────────────┐
│ XEM TRƯỚC                         ✕  │
├──────────────────────────────────────┤
│ Biến thử nghiệm:                     │
│ {ten}: [Nguyễn Văn A    ]            │
│ {sdt}: [0901234567      ]            │
├──────────────────────────────────────┤
│ ┌────────────────────────────────┐   │
│ │                                │   │
│ │   ┌──────────────────────┐     │   │
│ │   │ Xin chào Nguyễn Văn  │     │   │
│ │   │ A! Cảm ơn bạn đã     │     │   │
│ │   │ liên hệ.             │     │   │
│ │   └──────────────────────┘     │   │
│ │                                │   │
│ │   [Tư vấn sản phẩm]            │   │
│ │   [Hỗ trợ kỹ thuật]            │   │
│ │   [Khác]                       │   │
│ │                                │   │
│ │   ┌─────────────────────────┐  │   │
│ │   │ Nhập tin nhắn...        │  │   │
│ │   └─────────────────────────┘  │   │
│ └────────────────────────────────┘   │
│                                      │
│           [Reset] [Đóng]             │
└──────────────────────────────────────┘
```

### 5.4 Create Flow Modal

```
┌────────────────────────────────────────┐
│ TẠO LUỒNG TIN NHẮN MỚI              ✕  │
├────────────────────────────────────────┤
│                                        │
│ Tên luồng *                            │
│ ┌────────────────────────────────────┐ │
│ │                                    │ │
│ └────────────────────────────────────┘ │
│                                        │
│ Thư mục                                │
│ ┌────────────────────────────────────┐ │
│ │ Chưa phân loại                   ▼ │ │
│ └────────────────────────────────────┘ │
│                                        │
│ Shortcut (tùy chọn)                    │
│ ┌────────────────────────────────────┐ │
│ │ /                                  │ │
│ └────────────────────────────────────┘ │
│ ℹ Dùng để gọi nhanh trong chat         │
│                                        │
│              [Hủy]  [Tạo và Mở Editor] │
└────────────────────────────────────────┘
```

---

## 6. VALIDATION RULES

### 6.1 Field Validations

| Field | Rule | Error Message |
|-------|------|---------------|
| `flow.name` | Required, max 100 chars | "Tên luồng là bắt buộc" / "Tên luồng tối đa 100 ký tự" |
| `flow.shortcut` | Max 20 chars, no spaces, unique | "Shortcut tối đa 20 ký tự" / "Shortcut không được chứa khoảng trắng" / "Shortcut đã tồn tại" |
| `folder.name` | Required, max 50 chars, unique | "Tên thư mục là bắt buộc" / "Tên thư mục đã tồn tại" |
| `text.content` | Max 1000 chars | "Nội dung tối đa 1000 ký tự" |
| `image.file` | Max 5MB, JPG/PNG/GIF | "Ảnh tối đa 5MB" / "Định dạng không hỗ trợ" |
| `video.file` | Max 15MB, MP4/MOV | "Video tối đa 15MB" |
| `audio.file` | Max 10MB, MP3/WAV/OGG | "Audio tối đa 10MB" |
| `file.file` | Max 10MB | "File tối đa 10MB" |
| `carousel.cards` | Max 10 cards | "Tối đa 10 cards" |
| `carousel.card.title` | Max 45 chars | "Tiêu đề tối đa 45 ký tự" |
| `carousel.card.description` | Max 80 chars | "Mô tả tối đa 80 ký tự" |
| `buttons` | Max 3 buttons | "Tối đa 3 nút" |
| `button.label` | Max 20 chars | "Nhãn nút tối đa 20 ký tự" |
| `quick_reply` | Max 10 items | "Tối đa 10 quick replies" |
| `delay.value` | Min 1 min, max 365 days | "Delay từ 1 phút đến 365 ngày" |
| `random.branches` | 2-5 branches, sum = 100% | "Cần 2-5 nhánh" / "Tổng tỷ lệ phải = 100%" |

### 6.2 Flow Validation (before Publish)

```typescript
function validateFlow(nodes: FlowNode[], edges: FlowEdge[]): ValidationError[] {
  const errors: ValidationError[] = [];
  
  // 1. Check có node content sau Start
  const startNode = nodes.find(n => n.type === 'start');
  const connectedToStart = edges.filter(e => e.source === startNode?.id);
  if (connectedToStart.length === 0) {
    errors.push({
      code: 'NO_CONTENT_NODE',
      message: 'Cần có ít nhất 1 node sau điểm Bắt đầu'
    });
  }
  
  // 2. Check all nodes connected
  const connectedNodeIds = new Set<string>();
  connectedNodeIds.add(startNode?.id || '');
  // ... BFS/DFS to find all reachable nodes
  
  const disconnectedNodes = nodes.filter(n => 
    n.type !== 'start' && !connectedNodeIds.has(n.id)
  );
  disconnectedNodes.forEach(node => {
    errors.push({
      nodeId: node.id,
      code: 'DISCONNECTED_NODE',
      message: `Node "${getNodeLabel(node)}" không được kết nối`
    });
  });
  
  // 3. Check content nodes have content
  nodes.filter(n => ['text', 'image', 'video', 'audio', 'file'].includes(n.type))
    .forEach(node => {
      if (isEmptyContent(node)) {
        errors.push({
          nodeId: node.id,
          code: 'EMPTY_CONTENT',
          message: `Node "${getNodeLabel(node)}" chưa có nội dung`
        });
      }
    });
  
  // 4. Check condition nodes have conditions
  nodes.filter(n => n.type === 'condition').forEach(node => {
    const data = node.data as ConditionNodeData;
    if (!data.conditions || data.conditions.length === 0) {
      errors.push({
        nodeId: node.id,
        code: 'EMPTY_CONDITION',
        message: 'Node Điều kiện cần có ít nhất 1 condition'
      });
    }
  });
  
  // 5. Check random percentages = 100
  nodes.filter(n => n.type === 'random').forEach(node => {
    const data = node.data as RandomNodeData;
    const total = data.branches.reduce((sum, b) => sum + b.percentage, 0);
    if (total !== 100) {
      errors.push({
        nodeId: node.id,
        code: 'INVALID_PERCENTAGE',
        message: `Tổng tỷ lệ phải = 100% (hiện tại: ${total}%)`
      });
    }
  });
  
  return errors;
}
```

---

## 7. CONSTANTS & ENUMS

### 7.1 Node Type Definitions

```typescript
export const NODE_TYPES = {
  // Content
  TEXT: 'text',
  IMAGE: 'image',
  VIDEO: 'video',
  AUDIO: 'audio',
  FILE: 'file',
  CAROUSEL: 'carousel',
  
  // Interaction
  BUTTONS: 'buttons',
  QUICK_REPLY: 'quick_reply',
  WAIT_RESPONSE: 'wait_response',
  
  // Logic
  CONDITION: 'condition',
  RANDOM: 'random',
  
  // Timing
  DELAY: 'delay',
  
  // Action
  ACTION: 'action',
} as const;

export const NODE_CATEGORIES = [
  {
    id: 'content',
    label: 'Nội dung',
    nodes: [
      { type: 'text', label: 'Văn bản', icon: 'MessageSquare' },
      { type: 'image', label: 'Hình ảnh', icon: 'Image' },
      { type: 'video', label: 'Video', icon: 'Video' },
      { type: 'audio', label: 'Audio', icon: 'Music' },
      { type: 'file', label: 'File', icon: 'File' },
      { type: 'carousel', label: 'Bộ sưu tập', icon: 'Layers' },
    ]
  },
  {
    id: 'interaction',
    label: 'Tương tác',
    nodes: [
      { type: 'buttons', label: 'Nút bấm', icon: 'ToggleLeft' },
      { type: 'quick_reply', label: 'Trả lời nhanh', icon: 'MessageCircle' },
      { type: 'wait_response', label: 'Chờ phản hồi', icon: 'Clock' },
    ]
  },
  {
    id: 'logic',
    label: 'Logic',
    nodes: [
      { type: 'condition', label: 'Điều kiện', icon: 'GitBranch' },
      { type: 'random', label: 'Ngẫu nhiên', icon: 'Shuffle' },
    ]
  },
  {
    id: 'timing',
    label: 'Thời gian',
    nodes: [
      { type: 'delay', label: 'Chờ', icon: 'Timer' },
    ]
  },
  {
    id: 'action',
    label: 'Hành động',
    nodes: [
      { type: 'action', label: 'Thực hiện', icon: 'Zap' },
    ]
  },
];
```

### 7.2 Action Types

```typescript
export const ACTION_TYPES = [
  { value: 'add_tag', label: 'Gắn Tag', icon: 'Tag' },
  { value: 'remove_tag', label: 'Gỡ Tag', icon: 'TagOff' },
  { value: 'create_task', label: 'Tạo Công việc', icon: 'CheckSquare' },
  { value: 'create_reminder', label: 'Tạo Nhắc nhở', icon: 'Bell' },
  { value: 'pause_bot', label: 'Tạm dừng Bot', icon: 'PauseCircle' },
  { value: 'resume_bot', label: 'Kích hoạt Bot', icon: 'PlayCircle' },
  { value: 'subscribe_sequence', label: 'Đăng ký Kịch bản', icon: 'UserPlus' },
  { value: 'unsubscribe_sequence', label: 'Hủy Kịch bản', icon: 'UserMinus' },
];
```

### 7.3 Condition Fields & Operators

```typescript
export const CONDITION_FIELDS = [
  { value: 'customer_name', label: 'Tên khách hàng', type: 'string' },
  { value: 'customer_phone', label: 'Số điện thoại', type: 'string' },
  { value: 'customer_email', label: 'Email', type: 'string' },
  { value: 'customer_gender', label: 'Giới tính', type: 'enum', options: ['male', 'female', 'unknown'] },
  { value: 'tags', label: 'Tags', type: 'multi' },
  { value: 'channel', label: 'Kênh', type: 'enum', options: ['zalo_oa', 'zalo_personal', 'facebook'] },
  { value: 'day_of_week', label: 'Ngày trong tuần', type: 'multi', options: [0,1,2,3,4,5,6] },
  { value: 'hour', label: 'Giờ', type: 'range', min: 0, max: 23 },
];

export const CONDITION_OPERATORS = {
  string: [
    { value: 'equals', label: 'Bằng' },
    { value: 'not_equals', label: 'Không bằng' },
    { value: 'contains', label: 'Chứa' },
    { value: 'not_contains', label: 'Không chứa' },
    { value: 'starts_with', label: 'Bắt đầu bằng' },
    { value: 'ends_with', label: 'Kết thúc bằng' },
    { value: 'is_empty', label: 'Trống' },
    { value: 'is_not_empty', label: 'Không trống' },
  ],
  enum: [
    { value: 'equals', label: 'Là' },
    { value: 'not_equals', label: 'Không là' },
  ],
  multi: [
    { value: 'in', label: 'Có bất kỳ' },
    { value: 'not_in', label: 'Không có' },
  ],
};
```

### 7.4 Template Variables

```typescript
export const TEMPLATE_VARIABLES = [
  { key: 'ten_khach_hang', label: 'Tên đầy đủ', example: 'Nguyễn Văn A' },
  { key: 'ho', label: 'Họ', example: 'Nguyễn' },
  { key: 'ten', label: 'Tên', example: 'A' },
  { key: 'so_dien_thoai', label: 'Số điện thoại', example: '0901234567' },
  { key: 'email', label: 'Email', example: 'a@example.com' },
  { key: 'nhan_vien_phu_trach', label: 'Nhân viên phụ trách', example: 'Trần B' },
  { key: 'ten_cong_ty', label: 'Tên công ty', example: 'ABC Corp' },
  { key: 'ngay_hien_tai', label: 'Ngày hiện tại', example: '07/04/2026' },
];
```

### 7.5 File Constraints

```typescript
export const FILE_CONSTRAINTS = {
  image: {
    maxSize: 5 * 1024 * 1024, // 5MB
    acceptedTypes: ['image/jpeg', 'image/png', 'image/gif'],
    extensions: ['.jpg', '.jpeg', '.png', '.gif'],
  },
  video: {
    maxSize: 15 * 1024 * 1024, // 15MB
    acceptedTypes: ['video/mp4', 'video/quicktime'],
    extensions: ['.mp4', '.mov'],
  },
  audio: {
    maxSize: 10 * 1024 * 1024, // 10MB
    acceptedTypes: ['audio/mpeg', 'audio/wav', 'audio/ogg'],
    extensions: ['.mp3', '.wav', '.ogg'],
  },
  file: {
    maxSize: 10 * 1024 * 1024, // 10MB
    acceptedTypes: ['*/*'],
    extensions: ['*'],
  },
};
```

---

## END OF SPECIFICATION

> **Note for Developers:**
> - Use React Flow for the canvas: `npm install reactflow`
> - Use Zustand for state management: `npm install zustand`
> - Follow TailwindCSS design system defined in the project
> - All API responses should follow the standard response format defined in API Guidelines
