// ======================================================
// MODULE 4.13.1: LUỒNG TIN NHẮN – TYPE DEFINITIONS
// ======================================================

export type FlowStatus = 'draft' | 'published' | 'trash';

export type NodeType =
  | 'start'
  | 'text' | 'image' | 'video' | 'audio' | 'file' | 'carousel'
  | 'buttons' | 'quick_reply' | 'wait_response'
  | 'condition' | 'random'
  | 'delay'
  | 'action';

// ---- Node Data Types ----

export interface TextNodeData { content: string }
export interface ImageNodeData { url?: string; fileId?: string; caption?: string }
export interface VideoNodeData { url?: string; fileId?: string }
export interface AudioNodeData { fileId?: string }
export interface FileNodeData { fileId?: string; fileName?: string; fileSize?: number }
export interface CarouselCard {
  id: string;
  imageUrl?: string;
  title: string;
  description?: string;
  buttons: Button[];
}
export interface CarouselNodeData { cards: CarouselCard[] }

export interface Button {
  id: string;
  label: string;
  type: 'flow' | 'url' | 'phone';
  value: string;
}
export interface ButtonsNodeData { buttons: Button[] }

export interface QuickReply {
  id: string;
  label: string;
  type: 'flow' | 'email' | 'phone';
  targetNodeId?: string;
}
export interface QuickReplyNodeData { replies: QuickReply[] }

export interface WaitResponseNodeData {
  timeoutValue?: number;
  timeoutUnit?: 'minutes' | 'hours' | 'days';
  timeoutNodeId?: string;
}

export type ConditionField =
  | 'customer_name' | 'customer_phone' | 'customer_email'
  | 'customer_gender' | 'tags' | 'channel' | 'day_of_week' | 'hour';

export type ConditionOperator =
  | 'equals' | 'not_equals' | 'contains' | 'not_contains'
  | 'starts_with' | 'ends_with'
  | 'in' | 'not_in'
  | 'is_empty' | 'is_not_empty';

export interface Condition {
  id: string;
  field: ConditionField;
  operator: ConditionOperator;
  value: string | string[];
}
export interface ConditionNodeData {
  logic: 'and' | 'or';
  conditions: Condition[];
}

export interface RandomBranch { id: string; name: string; percentage: number }
export interface RandomNodeData { branches: RandomBranch[] }

export interface DelayNodeData {
  value: number;
  unit: 'minutes' | 'hours' | 'days';
  sendWindow?: { enabled: boolean; startHour: number; endHour: number };
}

export type ActionItem =
  | { type: 'add_tag'; tagIds: string[] }
  | { type: 'remove_tag'; tagIds: string[] }
  | { type: 'create_task'; title: string; description?: string; assignTo: string; dueDays: number }
  | { type: 'create_reminder'; content: string; delayValue: number; delayUnit: 'minutes' | 'hours' | 'days'; assignTo: string }
  | { type: 'pause_bot'; duration: number; unit: 'minutes' | 'hours' }
  | { type: 'resume_bot' }
  | { type: 'subscribe_sequence'; sequenceId: string }
  | { type: 'unsubscribe_sequence'; sequenceId: string };

export interface ActionNodeData { actions: ActionItem[] }
export interface StartNodeData { label?: string }

export type NodeData =
  | StartNodeData | TextNodeData | ImageNodeData | VideoNodeData
  | AudioNodeData | FileNodeData | CarouselNodeData | ButtonsNodeData
  | QuickReplyNodeData | WaitResponseNodeData | ConditionNodeData
  | RandomNodeData | DelayNodeData | ActionNodeData;

// ---- Flow Node & Edge ----

export interface XY { x: number; y: number }

export interface FlowNode {
  id: string;
  type: NodeType;
  position: XY;
  data: NodeData;
}

export interface FlowEdge {
  id: string;
  source: string;
  target: string;
  sourceHandle?: string;
  label?: string;
}

// ---- Folder & Flow ----

export interface Folder {
  id: string;
  name: string;
  flowCount: number;
  position: number;
  isDefault?: boolean;
}

export interface Flow {
  id: string;
  name: string;
  shortcut?: string | null;
  folder: { id: string; name: string };
  status: FlowStatus;
  usedByCount?: number;
  updatedAt: string;
  createdBy?: { id: string; name: string };
}

export interface FlowDetail extends Flow {
  currentVersion: number;
  nodes: FlowNode[];
  edges: FlowEdge[];
}

export interface CreateFlowData {
  name: string;
  folderId?: string;
  shortcut?: string;
}

// ---- Validation ----

export interface ValidationError {
  nodeId?: string;
  field?: string;
  code: string;
  message: string;
}

// ---- Editor State ----

export interface FlowEditorState {
  flowId: string | null;
  flowName: string;
  status: FlowStatus;
  nodes: FlowNode[];
  edges: FlowEdge[];
  selectedNodeId: string | null;
  hasUnsavedChanges: boolean;
  isPreviewOpen: boolean;
  validationErrors: ValidationError[];
}
