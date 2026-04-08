// ======================================================
// MODULE 4.13.3: MOCK DATA FOR AUTOMATION SETTINGS
// ======================================================

import { Tag, AutoRule, BotSettings, SelectOption } from './types';

export const MOCK_TAGS: Tag[] = [
  { id: 't1', name: 'Khách hàng',     color: '#EF4444', sequence: { id: 's1', name: 'Chăm sóc KH mới' },  conversationCount: 156, createdAt: '2026-04-01T10:00:00Z' },
  { id: 't2', name: 'Gia đình',       color: '#22C55E', sequence: null,                                     conversationCount: 89,  createdAt: '2026-04-01T10:00:00Z' },
  { id: 't3', name: 'Công việc',      color: '#F97316', sequence: { id: 's2', name: 'Follow up B2B' },      conversationCount: 45,  createdAt: '2026-04-01T10:00:00Z' },
  { id: 't4', name: 'Bạn bè',         color: '#3B82F6', sequence: null,                                     conversationCount: 23,  createdAt: '2026-04-01T10:00:00Z' },
  { id: 't5', name: 'Trả lời sau',    color: '#EAB308', sequence: { id: 's3', name: 'Reminder 24h' },       conversationCount: 67,  createdAt: '2026-04-01T10:00:00Z' },
  { id: 't6', name: 'VIP',            color: '#8B5CF6', sequence: { id: 's4', name: 'Ưu đãi VIP' },        conversationCount: 12,  createdAt: '2026-04-01T10:00:00Z' },
  { id: 't7', name: 'Khách tiềm năng',color: '#EC4899', sequence: null,                                     conversationCount: 34,  createdAt: '2026-04-01T10:00:00Z' },
];

export const MOCK_SEQUENCES: SelectOption[] = [
  { id: 's1', name: 'Chăm sóc KH mới' },
  { id: 's2', name: 'Follow up B2B' },
  { id: 's3', name: 'Reminder 24h' },
  { id: 's4', name: 'Ưu đãi VIP' },
  { id: 's5', name: 'Chúc mừng sinh nhật' },
  { id: 's6', name: 'Onboarding sản phẩm' },
];

export const MOCK_FLOWS: SelectOption[] = [
  { id: 'f1', name: 'Chào mừng KH mới' },
  { id: 'f2', name: 'Xác nhận đơn hàng' },
  { id: 'f3', name: 'Hỏi feedback sản phẩm' },
  { id: 'f4', name: 'Upsell sản phẩm Premium' },
  { id: 'f5', name: 'Nhắc nhở gia hạn dịch vụ' },
];

export const MOCK_AUTO_RULES: AutoRule[] = [
  {
    id: 'r1',
    ruleType: 'first_message',
    ruleName: 'KH nhắn tin lần đầu',
    description: 'Trigger khi KH mới nhắn tin lần đầu tiên (chưa có trong hệ thống)',
    isEnabled: false,
    config: { assignTags: [], sendFlowId: null },
  },
  {
    id: 'r2',
    ruleType: 'first_message_daily',
    ruleName: 'KH nhắn lần đầu trong ngày',
    description: 'Trigger mỗi ngày khi KH nhắn tin đầu tiên trong ngày',
    isEnabled: true,
    config: { assignTags: ['t5'], sendFlowId: 'f1' },
  },
  {
    id: 'r3',
    ruleType: 'comeback_after_days',
    ruleName: 'KH quay lại sau X ngày',
    description: 'Trigger khi KH cũ nhắn lại sau thời gian không tương tác',
    isEnabled: false,
    config: { days: 30, assignTags: [], sendFlowId: null },
  },
  {
    id: 'r4',
    ruleType: 'conversation_synced',
    ruleName: 'Hội thoại mới được đồng bộ',
    description: 'Trigger khi nhân viên liên kết hội thoại với Lead trong CRM',
    isEnabled: false,
    config: { assignTags: [], sendFlowId: null },
  },
];

export const MOCK_BOT_SETTINGS: BotSettings = {
  pauseOnAgentReply: true,
  pauseDurationMinutes: 30,
  autoResume: true,
};
