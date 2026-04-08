// ======================================================
// MODULE 4.13.3: CẤU HÌNH AUTOMATION – TYPE DEFINITIONS
// ======================================================

export interface Tag {
  id: string;
  name: string;
  color: string;
  sequence: { id: string; name: string } | null;
  conversationCount: number;
  createdAt: string;
}

export type AutoRuleType =
  | 'first_message'
  | 'first_message_daily'
  | 'comeback_after_days'
  | 'conversation_synced';

export interface AutoRuleConfig {
  days?: number;           // Only for comeback_after_days
  assignTags: string[];    // Tag IDs
  sendFlowId: string | null;
}

export interface AutoRule {
  id: string;
  ruleType: AutoRuleType;
  ruleName: string;
  description: string;
  isEnabled: boolean;
  config: AutoRuleConfig;
}

export interface BotSettings {
  pauseOnAgentReply: boolean;
  pauseDurationMinutes: number; // 1–1440
  autoResume: boolean;
}

export interface SelectOption {
  id: string;
  name: string;
}

// Tag preset colors
export const TAG_COLORS = [
  { value: '#EF4444', label: 'Đỏ' },
  { value: '#F97316', label: 'Cam' },
  { value: '#EAB308', label: 'Vàng' },
  { value: '#22C55E', label: 'Xanh lá' },
  { value: '#3B82F6', label: 'Xanh' },
  { value: '#8B5CF6', label: 'Tím' },
  { value: '#EC4899', label: 'Hồng' },
  { value: '#6B7280', label: 'Xám' },
] as const;
