'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Search,
  Filter,
  Send,
  Paperclip,
  Smile,
  Phone,
  Mail,
  MapPin,
  UserPlus,
  Tag,
  Info,
  Plus,
  Building2,
  X,
  Trash2,
  MoreVertical,
  Check,
  CheckCheck,
  Clock,
  AlertCircle,
  Image as ImageIcon,
  ChevronDown,
  User,
  Briefcase,
  Clock as ClockIcon,
  TrendingUp,
  Eye,
  MessageSquare,
  Settings
} from 'lucide-react'
import { cn } from '@/lib/utils'

// ===== TYPE DEFINITIONS =====

interface ZaloMessage {
  id: string
  conversationId: string
  content: string
  messageType: 'text' | 'image' | 'file' | 'sticker'
  direction: 'incoming' | 'outgoing'
  timestamp: string
  sender: {
    id: string
    name: string
    avatar?: string
    type: 'customer' | 'agent'
  }
  status: 'sending' | 'sent' | 'delivered' | 'read' | 'failed'
}

interface ZaloContact {
  id: string
  zaloId: string
  name: string
  displayName: string
  avatar?: string
  phone?: string
  email?: string
  company?: string
  position?: string
  location?: string
  tags: string[]
  totalMessages: number
  firstContactedAt: string
  lastContactedAt: string
  isActive: boolean
  notes: ContactNote[]
  purchaseHistory: PurchaseHistory[]
}

interface ContactNote {
  id: string
  content: string
  createdAt: string
  createdBy: string
}

interface PurchaseHistory {
  orderId: number
  productName: string
  amount: number
  purchaseDate: string
  status: string
}

interface GroupMember {
  id: string
  name: string
  avatar?: string
  role: 'admin' | 'member'
  joinedAt: string
  isActive: boolean
  lastSeenAt: string
  phone?: string
  email?: string
}

interface CRMCustomer {
  id: string
  name: string
  phone: string
  email?: string
  company?: string
  source: string
  status: 'lead' | 'customer' | 'potential'
  tags: string[]
  createdAt: string
  lastContactedAt: string
  avatar?: string
}

interface ZaloConversation {
  id: string
  contactId: string
  contact: ZaloContact
  lastMessage: ZaloMessage | null
  lastMessageAt: string
  unreadCount: number
  status: 'active' | 'archived' | 'spam' | 'resolved'
  assignedTo?: string
  tags: string[]
  priority: 'low' | 'medium' | 'high' | 'urgent'
  channel: 'zalo'
  conversationType: 'individual' | 'group'
  members?: GroupMember[]
  memberCount?: number
}

// ===== GENERATE DEMO DATA =====

const vietnameseNames = [
  'Nguyễn Hải Yến', 'Nguyễn Văn Tiến', 'Cộng đồng Omichat', 'Vũ Trần Digital',
  'Lê Thị Trang', 'ABQ Startup Com', 'TunVN - HỖ TRỢ TÀI CHÍNH'
]

const companies = [
  'PR Tào lao - Truyền thông', 'Công ty TNHH ABC', 'Startup Tech', 'Công ty CP XYZ',
  'Doanh nghiệp tư nhân DEF', 'Công ty Thương mại GHI', 'Tập đoàn JKL',
  'Công ty TNHH MTV MNO', 'Startup Innovation', 'Công ty CP PQR'
]

const lastMessages = [
  'Ban: 🌺 nay vitalk sao không hoạt động được vậy bạn',
  'Nguyễn Văn Tiến: @Nguyễn Hải Yến có thể hỗ trợ em được không ạ?',
  '🟢 📸 Hình ảnh',
  'được chưa?',
  'Ban: 0912345678 - Gửi bởi dụng acac',
  'Mjack: 📸 Hình ảnh',
  'Nguyễn Văn Tuân: VIẾT',
  'Cảm ơn bạn đã liên hệ!',
  'Em muốn tìm hiểu về gói CRM Professional',
  'Cho mình hỏi về tính năng marketing automation',
  'Tôi cần tư vấn về giải pháp CRM',
  'Hợp đồng sắp hết hạn rồi'
]

const tags = [
  ['VIP', 'Quan tâm CRM'],
  ['Hot Lead', 'Marketing'],
  ['Mới', 'Tư vấn'],
  ['Khách hàng cũ', 'Gia hạn'],
  ['Startup', 'Tech'],
  ['Ưu tiên'],
  ['Demo'],
  ['Báo giá'],
  ['Hỗ trợ kỹ thuật'],
  ['Tư vấn']
]

// Connected Zalo accounts
interface ZaloAccount {
  id: string
  name: string
  avatar?: string
  unreadCount: number
  type: 'personal' | 'oa'
}

const connectedZaloAccounts: ZaloAccount[] = [
  { id: '1', name: 'Chính Nghĩa', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ChinhNghia', unreadCount: 9, type: 'personal' },
  { id: '2', name: 'Hải Yến Shop', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=HaiYen', unreadCount: 25, type: 'personal' },
  { id: '3', name: 'Tech Support', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=TechSupport', unreadCount: 3, type: 'oa' },
  { id: '4', name: 'Sale Team', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=SaleTeam', unreadCount: 0, type: 'personal' },
]

// Demo shared files data
interface SharedFile {
  id: string
  name: string
  type: 'file' | 'image' | 'video'
  size: string
  time: string
  sender: string
  storage: string
  thumbnail?: string
}

const demoSharedFiles: SharedFile[] = [
  { id: '1', name: 'b5c6c763ac2e22707b3f.jpg', type: 'image', size: '0.205 MB', time: '18 phút trước', sender: 'Lam Omichat → Chính Nghĩa', storage: 'Zalo Cloud' },
  { id: '2', name: '9edde128056a8b34d27b.jpg', type: 'image', size: '0.437 MB', time: '1 giờ trước', sender: 'Lam Omichat → Chính Nghĩa', storage: 'Zalo Cloud' },
  { id: '3', name: 'Bản sao của Omichat-....pdf', type: 'file', size: '0.419 MB', time: '1 giờ trước', sender: 'Zalo → Lam Omichat', storage: 'Zalo Cloud' },
  { id: '4', name: 'video_demo_product.mp4', type: 'video', size: '12.5 MB', time: '2 giờ trước', sender: 'Chính Nghĩa → Lam Omichat', storage: 'Zalo Cloud' },
  { id: '5', name: 'bao_gia_2024.xlsx', type: 'file', size: '0.125 MB', time: '1 ngày trước', sender: 'Lam Omichat → Chính Nghĩa', storage: 'Zalo Cloud' },
]

// Demo group members for community
const demoGroupMembers: GroupMember[] = [
  { id: '1', name: 'Nguyễn Văn Anh', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=NguyenVanAnh', role: 'admin', joinedAt: '2024-01-15T10:00:00Z', isActive: true, lastSeenAt: '2024-01-22T14:30:00Z', phone: '0901234567', email: 'nva@email.com' },
  { id: '2', name: 'Trần Thị Bình', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=TranThiBinh', role: 'admin', joinedAt: '2024-01-15T10:05:00Z', isActive: true, lastSeenAt: '2024-01-22T14:25:00Z', phone: '0901234568' },
  { id: '3', name: 'Lê Văn Cường', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=LeVanCuong', role: 'member', joinedAt: '2024-01-16T09:00:00Z', isActive: true, lastSeenAt: '2024-01-22T14:20:00Z' },
  { id: '4', name: 'Phạm Thị Dung', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=PhamThiDung', role: 'member', joinedAt: '2024-01-16T11:30:00Z', isActive: false, lastSeenAt: '2024-01-22T10:15:00Z' },
  { id: '5', name: 'Hoàng Văn Em', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=HoangVanEm', role: 'member', joinedAt: '2024-01-17T14:00:00Z', isActive: true, lastSeenAt: '2024-01-22T14:28:00Z' },
  { id: '6', name: 'Đỗ Thị Phương', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=DoThiPhuong', role: 'member', joinedAt: '2024-01-17T16:20:00Z', isActive: false, lastSeenAt: '2024-01-22T08:45:00Z' },
  { id: '7', name: 'Vũ Văn Giang', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=VuVanGiang', role: 'member', joinedAt: '2024-01-18T10:10:00Z', isActive: true, lastSeenAt: '2024-01-22T14:15:00Z' },
  { id: '8', name: 'Bùi Thị Hà', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=BuiThiHa', role: 'member', joinedAt: '2024-01-18T13:45:00Z', isActive: true, lastSeenAt: '2024-01-22T14:10:00Z' },
  { id: '9', name: 'Ngô Văn Ích', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=NgoVanIch', role: 'member', joinedAt: '2024-01-19T08:30:00Z', isActive: false, lastSeenAt: '2024-01-21T18:00:00Z' },
  { id: '10', name: 'Đinh Thị Kiều', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=DinhThiKieu', role: 'member', joinedAt: '2024-01-19T11:00:00Z', isActive: true, lastSeenAt: '2024-01-22T14:05:00Z' },
  { id: '11', name: 'Lý Văn Long', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=LyVanLong', role: 'member', joinedAt: '2024-01-20T09:15:00Z', isActive: false, lastSeenAt: '2024-01-22T07:30:00Z' },
  { id: '12', name: 'Mai Thị Minh', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=MaiThiMinh', role: 'member', joinedAt: '2024-01-20T14:00:00Z', isActive: true, lastSeenAt: '2024-01-22T13:55:00Z' },
  { id: '13', name: 'Trương Văn Nam', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=TruongVanNam', role: 'member', joinedAt: '2024-01-21T10:30:00Z', isActive: true, lastSeenAt: '2024-01-22T14:00:00Z' },
  { id: '14', name: 'Phan Thị Oanh', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=PhanThiOanh', role: 'member', joinedAt: '2024-01-21T15:20:00Z', isActive: true, lastSeenAt: '2024-01-22T13:50:00Z' },
  { id: '15', name: 'Dương Văn Phúc', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=DuongVanPhuc', role: 'member', joinedAt: '2024-01-22T08:00:00Z', isActive: true, lastSeenAt: '2024-01-22T13:45:00Z' },
]

// Demo CRM customers for sync tab
const demoCRMCustomers: CRMCustomer[] = [
  { id: 'crm-1', name: 'Nguyễn Hải Yến', phone: '0901234567', email: 'haiyen@company.com', company: 'Công ty thế giới số', source: 'Facebook', status: 'lead', tags: ['VIP', 'Quan tâm CRM'], createdAt: '2024-01-10T10:00:00Z', lastContactedAt: '2024-01-22T09:30:00Z', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=NguyenHaiYen' },
  { id: 'crm-2', name: 'Nguyễn Văn Tiến', phone: '0901234568', email: 'tien@startup.vn', company: 'Startup Tech', source: 'Zalo', status: 'customer', tags: ['Hot Lead'], createdAt: '2024-01-12T14:20:00Z', lastContactedAt: '2024-01-21T16:45:00Z', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=NguyenVanTien' },
  { id: 'crm-3', name: 'Lam Omichat', phone: '0901234569', email: 'lam@omichat.vn', company: 'Omichat Solutions', source: 'Google Ads', status: 'lead', tags: ['Marketing', 'Tư vấn'], createdAt: '2024-01-15T11:00:00Z', lastContactedAt: '2024-01-22T08:15:00Z', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=LamOmichat' },
  { id: 'crm-4', name: 'Vũ Trần Digital', phone: '0901234570', email: 'vu@digitalagency.com', company: 'Digital Marketing Agency', source: 'Website', status: 'potential', tags: ['Demo'], createdAt: '2024-01-18T09:30:00Z', lastContactedAt: '2024-01-20T15:00:00Z', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=VuTranDigital' },
  { id: 'crm-5', name: 'Lê Thị Trang', phone: '0901234571', email: 'trang@company.vn', company: 'Công ty TNHH ABC', source: 'Referral', status: 'customer', tags: ['VIP', 'Gia hạn'], createdAt: '2024-01-08T13:15:00Z', lastContactedAt: '2024-01-22T10:20:00Z', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=LeThiTrang' },
  { id: 'crm-6', name: 'ABQ Startup Com', phone: '0901234572', email: 'contact@abqstartup.com', company: 'ABQ Startup Community', source: 'Facebook', status: 'lead', tags: ['Startup', 'Tech'], createdAt: '2024-01-20T10:45:00Z', lastContactedAt: '2024-01-21T14:30:00Z', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ABQStartup' },
  { id: 'crm-7', name: 'TunVN - Hỗ Trợ Tài Chính', phone: '0901234573', email: 'tun@finance.vn', company: 'Financial Services Ltd', source: 'Zalo', status: 'potential', tags: ['Báo giá', 'Hỗ trợ kỹ thuật'], createdAt: '2024-01-16T16:00:00Z', lastContactedAt: '2024-01-19T11:00:00Z', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=TunVN' },
]

// Sales Pipeline Stages
const salesStages = [
  { id: 'new-lead', name: 'Lead mới', color: 'bg-gray-100 text-gray-700', icon: UserPlus },
  { id: 'consulting', name: 'Đang tư vấn', color: 'bg-blue-100 text-blue-700', icon: MessageSquare },
  { id: 'quote-sent', name: 'Đã gửi ĐX', color: 'bg-green-100 text-green-700', icon: Mail },
  { id: 'negotiation', name: 'Đàm phán', color: 'bg-yellow-100 text-yellow-700', icon: Briefcase },
  { id: 'payment-pending', name: 'Chuyển đổi - chờ thanh toán', color: 'bg-purple-100 text-purple-700', icon: Clock },
  { id: 'converted', name: 'Chuyển đổi thành công', color: 'bg-green-100 text-green-700', icon: Check },
  { id: 'lost', name: 'Thất bại', color: 'bg-red-100 text-red-700', icon: X },
]

function generateDemoContacts(): ZaloContact[] {
  return vietnameseNames.map((name, index) => ({
    id: String(index + 1),
    zaloId: `zalo-${String(index + 1).padStart(3, '0')}`,
    name,
    displayName: name,
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name.replace(/\s/g, '')}`,
    phone: `09${String(index).padStart(8, '0')}`,
    email: `${name.toLowerCase().replace(/\s/g, '')}@email.com`,
    company: companies[index % companies.length],
    position: index % 3 === 0 ? 'Giám đốc' : index % 3 === 1 ? 'Trưởng phòng' : 'Nhân viên',
    location: index % 2 === 0 ? 'Hà Nội' : 'Hồ Chí Minh',
    tags: tags[index % tags.length],
    totalMessages: Math.floor(Math.random() * 100) + 10,
    firstContactedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
    lastContactedAt: new Date(Date.now() - Math.random() * 5 * 24 * 60 * 60 * 1000).toISOString(),
    isActive: Math.random() > 0.6,
    notes: index % 3 === 0 ? [
      {
        id: `note-${index}`,
        content: 'Khách hàng tiềm năng, cần theo dõi',
        createdAt: new Date().toISOString(),
        createdBy: 'Admin'
      }
    ] : [],
    purchaseHistory: index % 4 === 0 ? [
      {
        orderId: 100 + index,
        productName: 'Gói CRM Professional - 12 tháng',
        amount: 35000000,
        purchaseDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'Đã thanh toán'
      }
    ] : []
  }))
}

const demoContacts = generateDemoContacts()

function generateDemoMessages(conversationId: string): ZaloMessage[] {
  const messageCount = Math.floor(Math.random() * 10) + 5
  const messages: ZaloMessage[] = []

  for (let i = 0; i < messageCount; i++) {
    const isIncoming = i % 2 === 0
    const timestamp = new Date(Date.now() - (messageCount - i) * 3600000).toISOString()

    messages.push({
      id: `msg-${conversationId}-${i}`,
      conversationId,
      content: lastMessages[Math.floor(Math.random() * lastMessages.length)],
      messageType: 'text',
      direction: isIncoming ? 'incoming' : 'outgoing',
      timestamp,
      sender: {
        id: isIncoming ? conversationId : 'agent-1',
        name: isIncoming ? demoContacts[parseInt(conversationId) - 1]?.name || 'Khách hàng' : 'Tư vấn viên',
        avatar: isIncoming ? demoContacts[parseInt(conversationId) - 1]?.avatar : undefined,
        type: isIncoming ? 'customer' : 'agent'
      },
      status: isIncoming ? 'read' : (['sent', 'delivered', 'read'][Math.floor(Math.random() * 3)] as any)
    })
  }

  return messages
}

const demoMessages: Record<string, ZaloMessage[]> = {}
demoContacts.forEach((contact, index) => {
  demoMessages[contact.id] = generateDemoMessages(contact.id)
})

function generateDemoConversations(): ZaloConversation[] {
  return demoContacts.map((contact, index) => {
    const messages = demoMessages[contact.id]
    const lastMessage = messages[messages.length - 1]

    // Tạo thời gian từ 12 giờ trước đến 30 ngày trước
    const hoursAgo = index < 3 ? index * 4 : Math.floor(Math.random() * 24 * 30)
    const lastMessageAt = new Date(Date.now() - hoursAgo * 60 * 60 * 1000).toISOString()

    // Các conversation có index 2, 4, 6 sẽ là group
    const isGroup = index % 3 === 2
    
    return {
      id: contact.id,
      contactId: contact.id,
      contact,
      lastMessage,
      lastMessageAt,
      unreadCount: index < 5 ? Math.floor(Math.random() * 50) + 1 : 0,
      status: 'active',
      assignedTo: index % 3 === 0 ? 'Tư vấn viên A' : index % 3 === 1 ? 'Tư vấn viên B' : undefined,
      tags: contact.tags,
      priority: ['low', 'medium', 'high', 'urgent'][index % 4] as any,
      channel: 'zalo',
      conversationType: isGroup ? 'group' : 'individual',
      members: isGroup ? demoGroupMembers : undefined,
      memberCount: isGroup ? demoGroupMembers.length : undefined
    }
  })
}

const demoConversations = generateDemoConversations()

const quickReplyTemplates = [
  { id: '1', name: 'Chào hỏi', content: 'Xin chào! Cảm ơn bạn đã liên hệ. Em có thể giúp gì cho anh/chị ạ?' },
  { id: '2', name: 'Hỏi thông tin', content: 'Anh/chị cho em xin thêm thông tin về: số lượng nhân viên, lĩnh vực kinh doanh để em tư vấn phù hợp nhất ạ.' },
  { id: '3', name: 'Gửi báo giá', content: 'Em sẽ gửi anh/chị bảng báo giá chi tiết qua email. Anh/chị vui lòng kiểm tra hộp thư nhé!' },
  { id: '4', name: 'Hẹn demo', content: 'Anh/chị có thể sắp xếp buổi demo vào lúc nào trong tuần này ạ? Em sẽ sắp xếp lịch phù hợp.' },
  { id: '5', name: 'Cảm ơn', content: 'Cảm ơn anh/chị đã quan tâm! Em sẽ theo dõi và hỗ trợ anh/chị tốt nhất ạ.' }
]

// ===== UTILITY FUNCTIONS =====

function formatTime(timestamp: string): string {
  const date = new Date(timestamp)
  return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
}

function formatConversationTime(timestamp: string): string {
  const date = new Date(timestamp)
  const now = new Date()
  const diffTime = Math.abs(now.getTime() - date.getTime())
  const diffMinutes = Math.floor(diffTime / (1000 * 60))
  const diffHours = Math.floor(diffTime / (1000 * 60 * 60))
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

  if (diffMinutes < 60) {
    return `${diffMinutes} phút`
  } else if (diffHours < 24) {
    return `${diffHours} giờ`
  } else if (diffDays === 1) {
    return '1 ngày'
  } else if (diffDays < 30) {
    return `${diffDays} ngày`
  } else {
    return date.toLocaleDateString('vi-VN')
  }
}

function formatDate(timestamp: string): string {
  const date = new Date(timestamp)
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const messageDate = new Date(date.getFullYear(), date.getMonth(), date.getDate())
  const diffTime = today.getTime() - messageDate.getTime()
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays === 0) {
    return 'Hôm nay'
  } else if (diffDays === 1) {
    return 'Hôm qua'
  } else {
    return date.toLocaleDateString('vi-VN', { weekday: 'long', day: 'numeric', month: 'numeric', year: 'numeric' })
  }
}

function groupMessagesByDate(messages: ZaloMessage[]): { date: string; messages: ZaloMessage[] }[] {
  const groups: { date: string; messages: ZaloMessage[] }[] = []
  let currentDate = ''

  messages.forEach(message => {
    const messageDate = new Date(message.timestamp).toDateString()
    if (messageDate !== currentDate) {
      currentDate = messageDate
      groups.push({ date: message.timestamp, messages: [message] })
    } else {
      groups[groups.length - 1].messages.push(message)
    }
  })

  return groups
}

function getStatusIcon(status: string) {
  switch (status) {
    case 'sending':
      return <Clock className="w-3 h-3 opacity-70" />
    case 'sent':
      return <Check className="w-3 h-3 opacity-70" />
    case 'delivered':
      return <CheckCheck className="w-3 h-3 opacity-70" />
    case 'read':
      return <CheckCheck className="w-3 h-3 text-blue-400" />
    case 'failed':
      return <AlertCircle className="w-3 h-3 text-red-400" />
    default:
      return null
  }
}

function getPriorityColor(priority: string): string {
  const colors: Record<string, string> = {
    low: 'bg-blue-100 text-blue-800',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-orange-100 text-orange-800',
    urgent: 'bg-red-100 text-red-800'
  }
  return colors[priority] || 'bg-gray-100 text-gray-800'
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amount)
}

// ===== MAIN COMPONENT =====

export default function ChatManagement() {
  const [conversations, setConversations] = useState<ZaloConversation[]>(demoConversations)
  const [selectedConversation, setSelectedConversation] = useState<ZaloConversation | null>(demoConversations[0])
  const [messages, setMessages] = useState<ZaloMessage[]>(demoMessages['1'] || [])
  const [messageInput, setMessageInput] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [showContactDetail, setShowContactDetail] = useState(true)
  const [showQuickReplies, setShowQuickReplies] = useState(false)
  const [newNote, setNewNote] = useState('')
  const [filterUnread, setFilterUnread] = useState(false)
  const [activeTab, setActiveTab] = useState<'all' | 'unread' | 'contacts'>('all')
  const [contactTab, setContactTab] = useState<'friends' | 'groups' | 'strangers'>('friends')
  const [selectedAccount, setSelectedAccount] = useState<ZaloAccount>(connectedZaloAccounts[0])
  const [showAccountDropdown, setShowAccountDropdown] = useState(false)
  const [rightPanelTab, setRightPanelTab] = useState<'zalo' | 'sync' | 'community' | 'files'>('zalo')
  const [syncSearchTerm, setSyncSearchTerm] = useState('')
  const [syncSearchAll, setSyncSearchAll] = useState(false)
  const [fileSearchTerm, setFileSearchTerm] = useState('')
  const [fileTypeFilter, setFileTypeFilter] = useState<'all' | 'file' | 'image' | 'video'>('all')
  const [fileSenderFilter, setFileSenderFilter] = useState<'all' | 'staff' | 'customer'>('all')
  const [memberSearchTerm, setMemberSearchTerm] = useState('')
  const [connectedCustomers, setConnectedCustomers] = useState<Set<string>>(new Set())
  const [conversationCustomerMap, setConversationCustomerMap] = useState<Map<string, string>>(new Map())
  const [customerStageMap, setCustomerStageMap] = useState<Map<string, string>>(new Map())
  const [selectedLeadDetail, setSelectedLeadDetail] = useState<CRMCustomer | null>(null)
  const [leadDetailTab, setLeadDetailTab] = useState<'contact' | 'history' | 'notes'>('contact')

  const messageScrollRef = useRef<HTMLDivElement>(null)
  const accountDropdownRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (messageScrollRef.current) {
      messageScrollRef.current.scrollTop = messageScrollRef.current.scrollHeight
    }
  }, [messages])

  // Close account dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (accountDropdownRef.current && !accountDropdownRef.current.contains(event.target as Node)) {
        setShowAccountDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Select conversation and load messages
  const handleSelectConversation = (conversation: ZaloConversation) => {
    setSelectedConversation(conversation)
    setMessages(demoMessages[conversation.id] || [])
    
    // Auto switch to community tab if it's a group conversation
    if (conversation.conversationType === 'group') {
      setRightPanelTab('community')
    } else {
      // Reset to zalo tab for individual conversations
      setRightPanelTab('zalo')
    }
    
    // Mark as read
    if (conversation.unreadCount > 0) {
      setConversations(conversations.map(c =>
        c.id === conversation.id ? { ...c, unreadCount: 0 } : c
      ))
    }
  }

  // Send message
  const handleSendMessage = () => {
    if (!messageInput.trim() || !selectedConversation) return

    const newMessage: ZaloMessage = {
      id: `msg-${Date.now()}`,
      conversationId: selectedConversation.id,
      content: messageInput,
      messageType: 'text',
      direction: 'outgoing',
      timestamp: new Date().toISOString(),
      sender: { id: 'agent-1', name: 'Tư vấn viên', type: 'agent' },
      status: 'sent'
    }

    setMessages([...messages, newMessage])
    setMessageInput('')
    setShowQuickReplies(false)

    // Update conversation last message
    setConversations(conversations.map(c =>
      c.id === selectedConversation.id
        ? { ...c, lastMessage: newMessage, lastMessageAt: newMessage.timestamp }
        : c
    ))
  }

  // Handle Enter key
  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  // Insert quick reply
  const insertQuickReply = (template: typeof quickReplyTemplates[0]) => {
    setMessageInput(template.content)
    setShowQuickReplies(false)
  }

  // Add note
  const handleAddNote = () => {
    if (!newNote.trim() || !selectedConversation) return

    const note: ContactNote = {
      id: `note-${Date.now()}`,
      content: newNote,
      createdAt: new Date().toISOString(),
      createdBy: 'Admin'
    }

    // Update contact notes
    const updatedContact = {
      ...selectedConversation.contact,
      notes: [...selectedConversation.contact.notes, note]
    }

    setSelectedConversation({
      ...selectedConversation,
      contact: updatedContact
    })

    setNewNote('')
  }

  // Filter conversations
  const filteredConversations = conversations.filter(conv => {
    const matchesSearch = conv.contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          conv.contact.phone?.includes(searchTerm) ||
                          conv.lastMessage?.content.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesUnread = !filterUnread || conv.unreadCount > 0
    return matchesSearch && matchesUnread
  })

  const unreadCount = conversations.reduce((sum, conv) => sum + conv.unreadCount, 0)

  return (
    <div className="h-full flex flex-col bg-white overflow-hidden">
      <div className="grid grid-cols-12 gap-0 h-full overflow-hidden">

        {/* LEFT PANEL - Conversation List */}
        <div className="col-span-3 border-r border-gray-200 h-full flex flex-col bg-white">
          {/* Header */}
          <div className="p-4 border-b border-gray-200 bg-white">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold">Tin nhắn</h2>
            </div>

            {/* Search */}
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Tìm kiếm tin nhắn"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white border-gray-300 text-sm h-9"
              />
            </div>

            {/* Channel Icons */}
            <div className="flex gap-2 mb-3">
              <button className="relative flex items-center justify-center w-10 h-10 rounded-full bg-blue-500 hover:bg-blue-600 transition-colors">
                <span className="text-white font-semibold text-xs">ZL</span>
                <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </div>
              </button>
              <button className="relative flex items-center justify-center w-10 h-10 rounded-full bg-blue-600 hover:bg-blue-700 transition-colors">
                <span className="text-white font-semibold text-xs">OA</span>
                <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  1
                </div>
              </button>
              <button className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-700 hover:bg-blue-800 transition-colors">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2.546 20.2A1 1 0 003.8 21.454l3.032-.892A9.957 9.957 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 2a8 8 0 110 16 8 8 0 010-16zm-1 5v6h2V9h-2z"/>
                </svg>
              </button>
            </div>

            {/* Account Selector Dropdown */}
            <div className="relative mb-3" ref={accountDropdownRef}>
              <button
                onClick={() => setShowAccountDropdown(!showAccountDropdown)}
                className="w-full flex items-center justify-between px-3 py-2 border border-gray-300 rounded-md bg-white hover:bg-gray-50 transition-colors h-9"
              >
                <div className="flex items-center gap-2">
                  <Avatar className="w-6 h-6">
                    <AvatarImage src={selectedAccount.avatar} />
                    <AvatarFallback className="bg-blue-500 text-white text-[10px]">
                      {selectedAccount.name.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm text-gray-900 truncate max-w-[120px]">
                    {selectedAccount.name}
                  </span>
                  {selectedAccount.unreadCount > 0 && (
                    <span className="bg-green-500 text-white text-xs px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                      {selectedAccount.unreadCount > 9 ? '9+' : selectedAccount.unreadCount}
                    </span>
                  )}
                </div>
                <ChevronDown className={cn(
                  "w-4 h-4 text-gray-400 transition-transform flex-shrink-0",
                  showAccountDropdown && "rotate-180"
                )} />
              </button>

              {/* Dropdown Menu */}
              {showAccountDropdown && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-50 py-1">
                  {connectedZaloAccounts.map((account) => (
                    <button
                      key={account.id}
                      onClick={() => {
                        setSelectedAccount(account)
                        setShowAccountDropdown(false)
                      }}
                      className={cn(
                        "w-full flex items-center justify-between px-3 py-2 hover:bg-gray-50 transition-colors",
                        selectedAccount.id === account.id && "bg-blue-50"
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <Avatar className="w-6 h-6">
                          <AvatarImage src={account.avatar} />
                          <AvatarFallback className="bg-blue-500 text-white text-[10px]">
                            {account.name.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm text-gray-900 truncate max-w-[120px]">
                          {account.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {account.unreadCount > 0 && (
                          <span className="bg-green-500 text-white text-xs px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                            {account.unreadCount > 9 ? '9+' : account.unreadCount}
                          </span>
                        )}
                        {selectedAccount.id === account.id && (
                          <Check className="w-4 h-4 text-blue-500" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Tabs and Filter */}
            <div className="flex items-center justify-between">
              <div className="flex gap-1">
                <Button
                  variant={activeTab === 'all' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => {
                    setActiveTab('all')
                    setFilterUnread(false)
                  }}
                  className={cn(
                    "text-xs h-8",
                    activeTab === 'all'
                      ? "bg-blue-500 hover:bg-blue-600 text-white"
                      : "hover:bg-gray-100 text-gray-700"
                  )}
                >
                  Tin nhắn
                </Button>
                <Button
                  variant={activeTab === 'unread' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => {
                    setActiveTab('unread')
                    setFilterUnread(true)
                  }}
                  className={cn(
                    "text-xs h-8",
                    activeTab === 'unread'
                      ? "bg-blue-500 hover:bg-blue-600 text-white"
                      : "hover:bg-gray-100 text-gray-700"
                  )}
                >
                  Chưa đọc
                </Button>
                <Button
                  variant={activeTab === 'contacts' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => {
                    setActiveTab('contacts')
                    setFilterUnread(false)
                  }}
                  className={cn(
                    "text-xs h-8",
                    activeTab === 'contacts'
                      ? "bg-blue-500 hover:bg-blue-600 text-white"
                      : "hover:bg-gray-100 text-gray-700"
                  )}
                >
                  Danh bạ
                </Button>
              </div>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-gray-100">
                <Filter className="w-4 h-4 text-gray-600" />
              </Button>
            </div>
          </div>

          {/* Conversation List or Contacts List */}
          {activeTab === 'contacts' ? (
            // Contacts View
            <div className="flex-1 flex flex-col bg-white overflow-hidden">
              {/* Contact Tabs */}
              <div className="flex items-center border-b border-gray-200">
                <button
                  onClick={() => setContactTab('friends')}
                  className={cn(
                    "px-3 py-2.5 text-xs font-medium transition-colors relative",
                    contactTab === 'friends'
                      ? "text-blue-500 border-b-2 border-blue-500"
                      : "text-gray-900 hover:text-blue-500"
                  )}
                >
                  Bạn bè
                  <span className="ml-1 text-gray-500">(461)</span>
                </button>
                <button
                  onClick={() => setContactTab('groups')}
                  className={cn(
                    "px-3 py-2.5 text-xs font-medium transition-colors relative",
                    contactTab === 'groups'
                      ? "text-blue-500 border-b-2 border-blue-500"
                      : "text-gray-900 hover:text-blue-500"
                  )}
                >
                  Nhóm
                  <span className="ml-1 text-gray-500">(117)</span>
                </button>
                <button
                  onClick={() => setContactTab('strangers')}
                  className={cn(
                    "px-3 py-2.5 text-xs font-medium transition-colors relative",
                    contactTab === 'strangers'
                      ? "text-blue-500 border-b-2 border-blue-500"
                      : "text-gray-900 hover:text-blue-500"
                  )}
                >
                  Người lạ
                  <span className="ml-1 text-gray-500">(1)</span>
                </button>
              </div>

              {/* Contacts List - Friends */}
              {contactTab === 'friends' && (
                <ScrollArea className="flex-1">
                  {demoContacts.map((contact, idx) => {
                    // Use corresponding conversation from demo data (same as Groups)
                    const conversation = conversations[idx % conversations.length]
                    return (
                      <div
                        key={contact.id}
                        onClick={() => {
                          if (conversation) {
                            handleSelectConversation(conversation)
                          }
                        }}
                        className={cn(
                          "px-3 py-2.5 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors",
                          selectedConversation?.id === conversation?.id && "bg-blue-50 border-l-4 border-l-blue-600"
                        )}
                      >
                        <div className="flex items-center gap-2.5">
                          <Avatar className="w-10 h-10 flex-shrink-0">
                            <AvatarImage src={contact.avatar} />
                            <AvatarFallback className="bg-blue-500 text-white text-xs">
                              {contact.name.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-sm text-gray-900 truncate">
                              {contact.name}
                            </h4>
                            <p className="text-xs text-gray-500 truncate">
                              Tên danh bạ: {contact.company}
                            </p>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </ScrollArea>
              )}

              {/* Groups List */}
              {contactTab === 'groups' && (
                <ScrollArea className="flex-1">
                  {['365 DAYS MMO', 'ABQ Startup Community', 'ACAC ACADEMY', 'AE TAO MA CAO', 'AI CẦM TAY CHỈ VIỆC - Gr04', 'AI CẦM TAY CHỈ VIỆC 07', 'AI CẦM TAY CHỈ VIỆC 10', 'Amai Ft Ninja'].map((groupName, idx) => {
                    // Use corresponding conversation from demo data
                    const conversation = conversations[idx % conversations.length]
                    return (
                      <div
                        key={idx}
                        onClick={() => {
                          if (conversation) {
                            handleSelectConversation(conversation)
                          }
                        }}
                        className={cn(
                          "px-3 py-2.5 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors",
                          selectedConversation?.id === conversation?.id && "bg-blue-50 border-l-4 border-l-blue-600"
                        )}
                      >
                        <div className="flex items-center gap-2.5">
                          <Avatar className="w-10 h-10 flex-shrink-0">
                            <AvatarFallback className="bg-orange-500 text-white text-xs font-semibold">
                              {groupName.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-sm text-gray-900 truncate">
                              {groupName}
                            </h4>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </ScrollArea>
              )}

              {/* Strangers List */}
              {contactTab === 'strangers' && (
                <ScrollArea className="flex-1">
                  {(() => {
                    // Use first conversation for stranger demo
                    const conversation = conversations[0]
                    return (
                      <div
                        onClick={() => {
                          if (conversation) {
                            handleSelectConversation(conversation)
                          }
                        }}
                        className={cn(
                          "px-3 py-2.5 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors",
                          selectedConversation?.id === conversation?.id && "bg-blue-50 border-l-4 border-l-blue-600"
                        )}
                      >
                        <div className="flex items-center gap-2.5">
                          <Avatar className="w-10 h-10 flex-shrink-0">
                            <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=DuongLuan" />
                            <AvatarFallback className="bg-gray-400 text-white text-xs">
                              DL
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-sm text-gray-900 truncate">
                              Dương Luân
                            </h4>
                          </div>
                        </div>
                      </div>
                    )
                  })()}
                </ScrollArea>
              )}
            </div>
          ) : (
            // Conversations View
            <ScrollArea className="flex-1">
              {filteredConversations.map((conversation) => (
                <div
                  key={conversation.id}
                  onClick={() => handleSelectConversation(conversation)}
                  className={cn(
                    "p-3 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors",
                    selectedConversation?.id === conversation.id && "bg-blue-50 border-l-4 border-l-blue-600"
                  )}
                >
                  <div className="flex items-start gap-3">
                    <div className="relative flex-shrink-0">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={conversation.contact.avatar} />
                        <AvatarFallback className="bg-blue-500 text-white">
                          {conversation.contact.name.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      {conversation.contact.isActive && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-0.5">
                        <h4 className="font-semibold text-sm truncate pr-2">
                          {conversation.contact.name}
                        </h4>
                        <span className="text-xs text-gray-500 whitespace-nowrap flex-shrink-0">
                          {formatConversationTime(conversation.lastMessageAt)}
                        </span>
                      </div>

                      <div className="flex items-start justify-between gap-2">
                        <p className="text-xs text-gray-600 truncate flex-1">
                          {conversation.lastMessage?.content || 'Chưa có tin nhắn'}
                        </p>

                        {conversation.unreadCount > 0 && (
                          <Badge className="bg-red-500 text-white text-xs h-5 px-2 rounded-full flex-shrink-0">
                            {conversation.unreadCount > 99 ? '99+' : conversation.unreadCount}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </ScrollArea>
          )}
        </div>

        {/* MIDDLE PANEL - Chat Messages */}
        <div className={cn(
          "border-r border-gray-200 h-full flex flex-col bg-white overflow-hidden",
          showContactDetail ? "col-span-6" : "col-span-9"
        )}>
          {selectedConversation ? (
            <>
              {/* Chat Header */}
              <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between bg-white">
                <div className="flex items-center gap-3 flex-1">
                  <Avatar className="w-11 h-11">
                    <AvatarImage src={selectedConversation.contact.avatar} />
                    <AvatarFallback className="bg-blue-500 text-white">
                      {selectedConversation.contact.name.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-base truncate">{selectedConversation.contact.name}</h3>
                    <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                      <p className="text-xs text-gray-500 whitespace-nowrap">
                        {selectedConversation.contact.isActive ? (
                          <span className="text-green-600">● Đang hoạt động</span>
                        ) : (
                          `Hoạt động ${formatConversationTime(selectedConversation.contact.lastContactedAt)} trước`
                        )}
                      </p>
                      {conversationCustomerMap.has(selectedConversation.id) && (
                        <div className="hidden md:flex items-center gap-2">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <button 
                                className={cn(
                                  "inline-flex items-center rounded-full border px-2.5 font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 text-xs py-0 h-5 cursor-pointer hover:opacity-80 whitespace-nowrap",
                                  salesStages.find(s => s.id === (customerStageMap.get(selectedConversation.contact.id) || 'new-lead'))?.color || "bg-gray-100 text-gray-700"
                                )}
                              >
                                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"/>
                                </svg>
                                {salesStages.find(s => s.id === (customerStageMap.get(selectedConversation.contact.id) || 'new-lead'))?.name || 'Lead mới'}
                              </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="start" className="w-56">
                              <div className="px-2 py-1.5 text-xs font-semibold text-gray-500 uppercase">
                                Giai đoạn bán hàng
                              </div>
                              {salesStages.map((stage) => {
                                const StageIcon = stage.icon
                                const isSelected = (customerStageMap.get(selectedConversation.contact.id) || 'new-lead') === stage.id
                                return (
                                  <DropdownMenuItem 
                                    key={stage.id}
                                    onClick={() => {
                                      const newMap = new Map(customerStageMap)
                                      newMap.set(selectedConversation.contact.id, stage.id)
                                      setCustomerStageMap(newMap)
                                    }}
                                    className="flex items-center gap-2 cursor-pointer"
                                  >
                                    <div className={cn("w-8 h-8 rounded flex items-center justify-center", stage.color)}>
                                      <StageIcon className="w-4 h-4" />
                                    </div>
                                    <span className="flex-1 text-sm">{stage.name}</span>
                                    {isSelected && <Check className="w-4 h-4 text-blue-600" />}
                                  </DropdownMenuItem>
                                )
                              })}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  {/* <Button variant="ghost" size="sm" className="h-9 w-9 p-0 rounded-full hover:bg-gray-100" title="In">
                    <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/>
                    </svg>
                  </Button> */}
                  <Button variant="ghost" size="sm" className="h-9 w-9 p-0 rounded-full hover:bg-gray-100" title="Gọi điện">
                    <Phone className="w-4 h-4 text-gray-600" />
                  </Button>
                  <Button variant="ghost" size="sm" className="h-9 w-9 p-0 rounded-full hover:bg-gray-100" title="Tìm kiếm">
                    <Search className="w-4 h-4 text-gray-600" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-9 w-9 p-0 rounded-full hover:bg-gray-100"
                    onClick={() => setShowContactDetail(!showContactDetail)}
                    title="Đóng"
                  >
                    <X className="w-4 h-4 text-gray-600" />
                  </Button>
                </div>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-4 bg-white" ref={messageScrollRef}>
                {groupMessagesByDate(messages).map((group, groupIdx) => (
                  <div key={groupIdx}>
                    {/* Messages - Group consecutive messages from same sender */}
                    {(() => {
                      const groupedMessages: { sender: string; direction: string; messages: typeof group.messages }[] = []
                      let currentGroup: typeof groupedMessages[0] | null = null

                      group.messages.forEach((message, idx) => {
                        if (!currentGroup || currentGroup.sender !== message.sender.id) {
                          currentGroup = {
                            sender: message.sender.id,
                            direction: message.direction,
                            messages: [message]
                          }
                          groupedMessages.push(currentGroup)
                        } else {
                          currentGroup.messages.push(message)
                        }
                      })

                      return groupedMessages.map((msgGroup, gIdx) => (
                        <div key={gIdx} className={cn("mb-4 flex gap-2", msgGroup.direction === 'outgoing' ? 'justify-end' : 'justify-start')}>
                          {/* Avatar only for first message in group */}
                          {msgGroup.direction === 'incoming' && (
                            <Avatar className="w-10 h-10 mt-1 flex-shrink-0">
                              <AvatarImage src={msgGroup.messages[0].sender.avatar} />
                              <AvatarFallback className="bg-gray-400 text-white text-xs">
                                {msgGroup.messages[0].sender.name.substring(0, 2).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                          )}

                          <div className={cn("flex flex-col gap-1 max-w-[70%]", msgGroup.direction === 'outgoing' ? 'items-end' : 'items-start')}>
                            {msgGroup.messages.map((message, mIdx) => (
                              <div key={message.id}>
                                <div
                                  className={cn(
                                    "rounded-2xl px-4 py-2",
                                    msgGroup.direction === 'outgoing'
                                      ? 'bg-blue-50 text-gray-900'
                                      : 'bg-gray-100 text-gray-900'
                                  )}
                                >
                                  <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
                                </div>
                              </div>
                            ))}
                            {/* Show time after last message in group */}
                            <span className="text-xs text-gray-500 px-1">
                              {formatTime(msgGroup.messages[msgGroup.messages.length - 1].timestamp)}
                            </span>
                          </div>
                        </div>
                      ))
                    })()}
                  </div>
                ))}
              </div>

              {/* Message Input - Fixed at bottom */}
              <div className="border-t border-gray-200 bg-white flex-shrink-0">
                {/* Message Writer Container */}
                <div className="p-3">
                  {/* Input Chat Box Container */}
                  <div className="border border-gray-200 rounded-lg bg-white">
                    {/* Large Textarea Editor Area */}
                    <div className="min-h-[100px] max-h-[200px] overflow-y-auto">
                      <Textarea
                        placeholder="Nhập tin nhắn..."
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                        onKeyDown={handleKeyPress}
                        className="w-full resize-none min-h-[100px] border-0 focus-visible:ring-0 text-sm p-3"
                        rows={4}
                      />
                    </div>

                    {/* Action Buttons Row */}
                    <div className="flex items-center justify-between border-t border-gray-100 px-2 py-2">
                      {/* Left Actions */}
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 hover:bg-gray-50"
                          title="Gửi hình ảnh"
                        >
                          <ImageIcon className="w-4 h-4 text-gray-600" />
                        </Button>

                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 hover:bg-gray-50"
                          title="Tải lên tệp"
                        >
                          <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="64 64 896 896">
                            <path d="M400 317.7h73.9V656c0 4.4 3.6 8 8 8h60c4.4 0 8-3.6 8-8V317.7H624c6.7 0 10.4-7.7 6.3-12.9L518.3 163a8 8 0 00-12.6 0l-112 141.7c-4.1 5.3-.4 13 6.3 13zM878 626h-60c-4.4 0-8 3.6-8 8v154H214V634c0-4.4-3.6-8-8-8h-60c-4.4 0-8 3.6-8 8v198c0 17.7 14.3 32 32 32h684c17.7 0 32-14.3 32-32V634c0-4.4-3.6-8-8-8z" />
                          </svg>
                        </Button>

                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 hover:bg-gray-50"
                          title="Highlight/Vẽ"
                        >
                          <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="64 64 896 896">
                            <path d="M957.6 507.4L603.2 158.2a7.9 7.9 0 00-11.2 0L353.3 393.4a8.03 8.03 0 00-.1 11.3l.1.1 40 39.4-117.2 115.3a8.03 8.03 0 00-.1 11.3l.1.1 39.5 38.9-189.1 187H72.1c-4.4 0-8.1 3.6-8.1 8V860c0 4.4 3.6 8 8 8h344.9c2.1 0 4.1-.8 5.6-2.3l76.1-75.6 40.4 39.8a7.9 7.9 0 0011.2 0l117.1-115.6 40.1 39.5a7.9 7.9 0 0011.2 0l238.7-235.2c3.4-3 3.4-8 .3-11.2zM389.8 796.2H229.6l134.4-133 80.1 78.9-54.3 54.1zm154.8-62.1L373.2 565.2l68.6-67.6 171.4 168.9-68.6 67.6zM713.1 658L450.3 399.1 597.6 254l262.8 259-147.3 145z" />
                          </svg>
                        </Button>

                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 hover:bg-gray-50"
                          title="Mở rộng"
                        >
                          <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="64 64 896 896">
                            <path d="M855 160.1l-189.2 23.5c-6.6.8-9.3 8.8-4.7 13.5l54.7 54.7-153.5 153.5a8.03 8.03 0 000 11.3l45.1 45.1c3.1 3.1 8.2 3.1 11.3 0l153.6-153.6 54.7 54.7a7.94 7.94 0 0013.5-4.7L863.9 169a7.9 7.9 0 00-8.9-8.9zM416.6 562.3a8.03 8.03 0 00-11.3 0L251.8 715.9l-54.7-54.7a7.94 7.94 0 00-13.5 4.7L160.1 855c-.6 5.2 3.7 9.5 8.9 8.9l189.2-23.5c6.6-.8 9.3-8.8 4.7-13.5l-54.7-54.7 153.6-153.6c3.1-3.1 3.1-8.2 0-11.3l-45.2-45z" />
                          </svg>
                        </Button>
                      </div>

                      {/* Right Actions */}
                      <div className="flex items-center gap-2">
                        {/* <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 hover:bg-gray-50"
                          title="Trợ lý AI"
                        >
                          <svg className="w-4 h-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                          </svg>
                        </Button> */}

                        <Button
                          onClick={handleSendMessage}
                          disabled={!messageInput.trim()}
                          className="h-8 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white text-sm"
                          title="Gửi tin nhắn"
                        >
                          <Send className="w-4 h-4 mr-1" />
                          Gửi
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              <div className="text-center">
                <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <p className="text-sm">Chọn một cuộc hội thoại để bắt đầu</p>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT PANEL - Contact Details */}
        {showContactDetail && selectedConversation && (
          <div className="col-span-3 h-full flex flex-col bg-white overflow-hidden">
            {/* Main Tab Menu */}
            <div className="flex items-center border-b border-gray-200 bg-white flex-shrink-0">
              <button
                onClick={() => setRightPanelTab('zalo')}
                className={cn(
                  "px-4 py-3 text-sm font-medium transition-colors",
                  rightPanelTab === 'zalo'
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-600 hover:text-blue-600"
                )}
              >
                Zalo
              </button>
              {selectedConversation.conversationType === 'group' ? (
                <button
                  onClick={() => setRightPanelTab('community')}
                  className={cn(
                    "px-4 py-3 text-sm font-medium transition-colors",
                    rightPanelTab === 'community'
                      ? "text-blue-600 border-b-2 border-blue-600"
                      : "text-gray-600 hover:text-blue-600"
                  )}
                >
                  Thông tin cộng đồng
                </button>
              ) : (
                <button
                  onClick={() => setRightPanelTab('sync')}
                  className={cn(
                    "px-4 py-3 text-sm font-medium transition-colors",
                    rightPanelTab === 'sync'
                      ? "text-blue-600 border-b-2 border-blue-600"
                      : "text-gray-600 hover:text-blue-600"
                  )}
                >
                  Đồng bộ
                </button>
              )}
              <button
                onClick={() => setRightPanelTab('files')}
                className={cn(
                  "px-4 py-3 text-sm font-medium transition-colors",
                  rightPanelTab === 'files'
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-600 hover:text-blue-600"
                )}
              >
                File chia sẻ
              </button>
            </div>

            {/* Tab Content: Zalo */}
            {rightPanelTab === 'zalo' && (
              <>
                {/* Contact Profile Header */}
                <div className="p-4 border-b border-gray-200 text-center bg-gradient-to-b from-blue-50 to-white flex-shrink-0">
              <Avatar className="w-20 h-20 mx-auto mb-3 border-4 border-white shadow-lg">
                <AvatarImage src={selectedConversation.contact.avatar} />
                <AvatarFallback className="bg-blue-500 text-white text-2xl">
                  {selectedConversation.contact.name.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <h3 className="font-semibold text-lg">{selectedConversation.contact.name}</h3>
              <p className="text-sm text-gray-500">{selectedConversation.contact.company}</p>
            </div>

            {/* Information Tabs */}
            <Tabs defaultValue="info" className="flex-1 flex flex-col">
              <TabsList className="w-full justify-start border-b rounded-none p-0 bg-white h-auto">
                <TabsTrigger value="info" className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 text-xs px-4">
                  Thông tin
                </TabsTrigger>
                <TabsTrigger value="history" className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 text-xs px-4">
                  Lịch sử
                </TabsTrigger>
                <TabsTrigger value="notes" className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 text-xs px-4">
                  Ghi chú
                </TabsTrigger>
              </TabsList>

              <TabsContent value="info" className="flex-1 overflow-y-auto p-4 mt-0">
                <div className="space-y-4">
                  {/* Contact Information */}
                  <div>
                    <h4 className="font-semibold text-sm mb-3 text-gray-700">Thông tin liên hệ</h4>
                    <div className="space-y-2.5 text-sm">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <span>{selectedConversation.contact.phone || 'Chưa có'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <span className="truncate">{selectedConversation.contact.email || 'Chưa có'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span>{selectedConversation.contact.location || 'Chưa có'}</span>
                      </div>
                    </div>
                  </div>

                  {/* CRM Integration */}
                  {/* <div className="pt-3 border-t border-gray-100">
                    <h4 className="font-semibold text-sm mb-3 text-gray-700">Liên kết CRM</h4>
                    <Button variant="outline" size="sm" className="w-full text-xs">
                      <UserPlus className="w-3 h-3 mr-2" />
                      Liên kết khách hàng
                    </Button>
                  </div> */}

                  {/* Tags */}
                  <div className="pt-3 border-t border-gray-100">
                    <h4 className="font-semibold text-sm mb-3 text-gray-700">Tags</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedConversation.contact.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                          <button className="ml-1 hover:text-red-600">
                            <X className="w-3 h-3" />
                          </button>
                        </Badge>
                      ))}
                      <Button variant="ghost" size="sm" className="h-6 px-2">
                        <Plus className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>

                  {/* Purchase History */}
                  {selectedConversation.contact.purchaseHistory.length > 0 && (
                    <div className="pt-3 border-t border-gray-100">
                      <h4 className="font-semibold text-sm mb-3 text-gray-700">Lịch sử mua hàng</h4>
                      <div className="space-y-2">
                        {selectedConversation.contact.purchaseHistory.map((purchase) => (
                          <div key={purchase.orderId} className="border border-gray-200 rounded-lg p-3 text-sm bg-gray-50">
                            <div className="font-medium text-gray-900">{purchase.productName}</div>
                            <div className="text-blue-600 font-semibold mt-1">{formatCurrency(purchase.amount)}</div>
                            <div className="text-gray-500 text-xs mt-1">
                              {new Date(purchase.purchaseDate).toLocaleDateString('vi-VN')}
                            </div>
                            <Badge variant="secondary" className="mt-2 text-xs">
                              {purchase.status}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="history" className="flex-1 overflow-y-auto p-4 mt-0">
                <div className="space-y-3">
                  <div className="border-l-2 border-blue-200 pl-3 pb-3">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      <span className="font-medium text-sm">Bắt đầu cuộc hội thoại</span>
                    </div>
                    <p className="text-sm text-gray-600">Khách hàng bắt đầu chat qua Zalo</p>
                    <span className="text-xs text-gray-400">
                      {new Date(selectedConversation.contact.firstContactedAt).toLocaleString('vi-VN')}
                    </span>
                  </div>

                  {selectedConversation.contact.purchaseHistory.map((purchase) => (
                    <div key={purchase.orderId} className="border-l-2 border-green-200 pl-3 pb-3">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                        <span className="font-medium text-sm">Mua hàng</span>
                      </div>
                      <p className="text-sm text-gray-600">{purchase.productName}</p>
                      <span className="text-xs text-gray-400">
                        {new Date(purchase.purchaseDate).toLocaleString('vi-VN')}
                      </span>
                    </div>
                  ))}

                  <div className="border-l-2 border-gray-200 pl-3 pb-3">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                      <span className="font-medium text-sm">Tin nhắn gần nhất</span>
                    </div>
                    <p className="text-sm text-gray-600">Tương tác qua Zalo</p>
                    <span className="text-xs text-gray-400">
                      {new Date(selectedConversation.contact.lastContactedAt).toLocaleString('vi-VN')}
                    </span>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="notes" className="flex-1 overflow-y-auto p-4 mt-0">
                <div className="space-y-3">
                  <div>
                    <Textarea
                      placeholder="Thêm ghi chú mới..."
                      value={newNote}
                      onChange={(e) => setNewNote(e.target.value)}
                      className="mb-2 text-sm"
                      rows={3}
                    />
                    <Button onClick={handleAddNote} size="sm" className="w-full text-xs">
                      <Plus className="w-3 h-3 mr-2" />
                      Lưu ghi chú
                    </Button>
                  </div>

                  {/* Notes list */}
                  <div className="space-y-2 pt-3 border-t border-gray-200">
                    {selectedConversation.contact.notes.map((note) => (
                      <div key={note.id} className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                        <p className="text-sm text-gray-900">{note.content}</p>
                        <div className="flex justify-between items-center mt-2">
                          <span className="text-xs text-gray-500">
                            {new Date(note.createdAt).toLocaleString('vi-VN')} - {note.createdBy}
                          </span>
                          <Button variant="ghost" size="sm" className="h-6 px-2">
                            <Trash2 className="w-3 h-3 text-gray-400 hover:text-red-600" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
              </>
            )}

            {/* Tab Content: Đồng bộ CRM */}
            {rightPanelTab === 'sync' && (
              <>
                {(() => {
                  const connectedCustomerId = conversationCustomerMap.get(selectedConversation.id)
                  const connectedCustomer = connectedCustomerId 
                    ? demoCRMCustomers.find(c => c.id === connectedCustomerId)
                    : null

                  if (connectedCustomer) {
                    // Show connected state UI
                    return (
                      <div className="flex-1 flex flex-col overflow-hidden">
                        <ScrollArea className="flex-1">
                          <div className="p-6">
                            {/* Connected Status Banner */}
                            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 flex items-center gap-3">
                              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                                <Check className="w-6 h-6 text-white" />
                              </div>
                              <div className="flex-1">
                                <h3 className="font-semibold text-green-900 text-sm">Đã kết nối với CRM</h3>
                                <p className="text-xs text-green-700 mt-0.5">
                                  Hội thoại này đã được liên kết với khách hàng trong hệ thống CRM
                                </p>
                              </div>
                            </div>

                            {/* Customer Info Card */}
                            <div className="border border-gray-200 rounded-lg overflow-hidden">
                              {/* Header */}
                              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-3 border-b border-gray-200">
                                <h4 className="font-semibold text-sm text-gray-900 flex items-center gap-2">
                                  <User className="w-4 h-4 text-blue-600" />
                                  Thông tin khách hàng
                                </h4>
                              </div>

                              {/* Customer Details */}
                              <div className="p-4">
                                {/* Avatar + Name + Status */}
                                <div className="flex items-start gap-3 mb-4 pb-4 border-b border-gray-100">
                                  <Avatar className="w-16 h-16 flex-shrink-0">
                                    <AvatarImage src={connectedCustomer.avatar} />
                                    <AvatarFallback className="bg-blue-500 text-white text-lg">
                                      {connectedCustomer.name.substring(0, 2).toUpperCase()}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div className="flex-1 min-w-0">
                                    <h3 className="font-semibold text-base text-gray-900 mb-1">
                                      {connectedCustomer.name}
                                    </h3>
                                    <div className="flex items-center gap-2 flex-wrap">
                                      <Badge 
                                        className={cn(
                                          "text-xs px-2 py-0.5",
                                          connectedCustomer.status === 'customer' ? "bg-green-100 text-green-700 border-green-300" :
                                          connectedCustomer.status === 'lead' ? "bg-blue-100 text-blue-700 border-blue-300" :
                                          "bg-yellow-100 text-yellow-700 border-yellow-300"
                                        )}
                                      >
                                        {connectedCustomer.status === 'customer' ? 'Khách hàng' : 
                                         connectedCustomer.status === 'lead' ? 'Lead' : 'Tiềm năng'}
                                      </Badge>
                                      <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                          <Badge 
                                            className={cn(
                                              "text-xs py-0 h-5 cursor-pointer hover:opacity-80 transition-opacity whitespace-nowrap",
                                              salesStages.find(s => s.id === (customerStageMap.get(connectedCustomer.id) || 'new-lead'))?.color || "bg-gray-100 text-gray-700"
                                            )}
                                          >
                                            <Tag className="w-3 h-3 mr-1" />
                                            {salesStages.find(s => s.id === (customerStageMap.get(connectedCustomer.id) || 'new-lead'))?.name || 'Lead mới'}
                                          </Badge>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="start" className="w-56">
                                          <div className="px-2 py-1.5 text-xs font-semibold text-gray-500 uppercase">
                                            Giai đoạn bán hàng
                                          </div>
                                          {salesStages.map((stage) => {
                                            const StageIcon = stage.icon
                                            const isSelected = (customerStageMap.get(connectedCustomer.id) || 'new-lead') === stage.id
                                            return (
                                              <DropdownMenuItem 
                                                key={stage.id}
                                                onClick={() => {
                                                  const newMap = new Map(customerStageMap)
                                                  newMap.set(connectedCustomer.id, stage.id)
                                                  setCustomerStageMap(newMap)
                                                }}
                                                className="flex items-center gap-2 cursor-pointer"
                                              >
                                                <div className={cn("w-8 h-8 rounded flex items-center justify-center", stage.color)}>
                                                  <StageIcon className="w-4 h-4" />
                                                </div>
                                                <span className="flex-1 text-sm">{stage.name}</span>
                                                {isSelected && <Check className="w-4 h-4 text-blue-600" />}
                                              </DropdownMenuItem>
                                            )
                                          })}
                                        </DropdownMenuContent>
                                      </DropdownMenu>
                                    </div>
                                  </div>
                                </div>

                                {/* Contact Info */}
                                <div className="space-y-3 mb-4">
                                  <div className="flex items-center gap-2 text-sm">
                                    <Phone className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                    <span className="text-gray-600">Điện thoại:</span>
                                    <span className="font-medium text-gray-900">{connectedCustomer.phone}</span>
                                  </div>
                                  {connectedCustomer.email && (
                                    <div className="flex items-center gap-2 text-sm">
                                      <Mail className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                      <span className="text-gray-600">Email:</span>
                                      <span className="font-medium text-gray-900 truncate">{connectedCustomer.email}</span>
                                    </div>
                                  )}
                                  {connectedCustomer.company && (
                                    <div className="flex items-center gap-2 text-sm">
                                      <Building2 className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                      <span className="text-gray-600">Công ty:</span>
                                      <span className="font-medium text-gray-900 truncate">{connectedCustomer.company}</span>
                                    </div>
                                  )}
                                </div>

                                {/* Tags */}
                                {connectedCustomer.tags.length > 0 && (
                                  <div className="mb-4">
                                    <div className="flex flex-wrap gap-1.5">
                                      {connectedCustomer.tags.map((tag, idx) => (
                                        <span
                                          key={idx}
                                          className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-700"
                                        >
                                          {tag}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {/* Source & Dates */}
                                <div className="bg-gray-50 rounded-lg p-3 space-y-2 text-xs">
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">Nguồn:</span>
                                    <span className="font-medium text-gray-900">{connectedCustomer.source}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">Ngày tạo:</span>
                                    <span className="font-medium text-gray-900">
                                      {new Date(connectedCustomer.createdAt).toLocaleDateString('vi-VN')}
                                    </span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">Liên hệ cuối:</span>
                                    <span className="font-medium text-gray-900">
                                      {new Date(connectedCustomer.lastContactedAt).toLocaleDateString('vi-VN')}
                                    </span>
                                  </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
                                  <Button
                                    size="sm"
                                    className="flex-1 text-xs"
                                    onClick={() => setSelectedLeadDetail(connectedCustomer)}
                                  >
                                    <Eye className="w-4 h-4 mr-1" />
                                    Xem chi tiết
                                  </Button>
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button size="sm" variant="outline" className="px-3">
                                        <MoreVertical className="w-4 h-4" />
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                      <DropdownMenuItem onClick={() => {
                                        const newMap = new Map(conversationCustomerMap)
                                        newMap.delete(selectedConversation.id)
                                        setConversationCustomerMap(newMap)
                                        const newConnected = new Set(connectedCustomers)
                                        newConnected.delete(connectedCustomer.id)
                                        setConnectedCustomers(newConnected)
                                      }}>
                                        <X className="w-4 h-4 mr-2" />
                                        Ngắt kết nối
                                      </DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </div>
                              </div>
                            </div>
                          </div>
                        </ScrollArea>
                      </div>
                    )
                  }

                  // Show search UI when not connected
                  return (
                    <div className="flex-1 flex flex-col p-4 overflow-hidden">
                      {/* Search input + Button row */}
                      <div className="flex items-center gap-2 mb-4">
                        <div className="relative flex-1">
                          <Input
                            placeholder="Tìm kiếm khách hàng..."
                            value={syncSearchTerm}
                            onChange={(e) => setSyncSearchTerm(e.target.value)}
                            className="pr-16"
                          />
                          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                            {syncSearchTerm && (
                              <button onClick={() => setSyncSearchTerm('')} className="p-1 hover:bg-gray-100 rounded">
                                <X className="w-4 h-4 text-gray-400" />
                              </button>
                            )}
                            <Search className="w-4 h-4 text-gray-400" />
                          </div>
                        </div>
                        <Button variant="outline" size="sm" className="text-xs h-10">
                          Thêm mới
                        </Button>
                      </div>

                      {/* Checkbox row */}
                      <div className="flex items-center mb-4">
                        <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={syncSearchAll}
                            onChange={(e) => setSyncSearchAll(e.target.checked)}
                            className="rounded border-gray-300"
                          />
                          Tìm kiếm cả số liên hệ
                        </label>
                      </div>

                      {/* Results or Empty state */}
                      <ScrollArea className="flex-1">
                        {(() => {
                          const filteredCustomers = demoCRMCustomers.filter(customer => {
                            if (!syncSearchTerm) return false
                            const searchLower = syncSearchTerm.toLowerCase()
                            const matchName = customer.name.toLowerCase().includes(searchLower)
                            const matchPhone = syncSearchAll && customer.phone.includes(syncSearchTerm)
                            const matchEmail = customer.email?.toLowerCase().includes(searchLower)
                            const matchCompany = customer.company?.toLowerCase().includes(searchLower)
                            return matchName || matchPhone || matchEmail || matchCompany
                          })

                          if (syncSearchTerm && filteredCustomers.length === 0) {
                            return (
                              <div className="flex-1 flex items-center justify-center py-12">
                                <div className="bg-red-50 text-red-500 px-6 py-3 rounded-lg text-sm font-medium">
                                  Không tìm thấy khách hàng nào !
                                </div>
                              </div>
                            )
                          }

                          if (!syncSearchTerm) {
                            return (
                              <div className="flex items-center justify-center py-12 text-gray-400 text-sm">
                                Nhập từ khóa để tìm kiếm khách hàng
                              </div>
                            )
                          }

                          return (
                            <div className="p-3 space-y-2">
                              {filteredCustomers.map((customer) => (
                                <div
                                  key={customer.id}
                                  className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50 transition-colors cursor-pointer"
                                >
                                  <div className="flex items-start gap-3">
                                    <Avatar className="w-12 h-12 flex-shrink-0">
                                      <AvatarImage src={customer.avatar} />
                                      <AvatarFallback className="bg-blue-500 text-white text-sm">
                                        {customer.name.substring(0, 2).toUpperCase()}
                                      </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-center gap-2 mb-1">
                                        <h4 className="font-semibold text-sm text-gray-900 truncate">
                                          {customer.name}
                                        </h4>
                                        <Badge 
                                          className={cn(
                                            "text-xs px-2 py-0 h-5",
                                            customer.status === 'customer' ? "bg-green-100 text-green-700 border-green-300" :
                                            customer.status === 'lead' ? "bg-blue-100 text-blue-700 border-blue-300" :
                                            "bg-yellow-100 text-yellow-700 border-yellow-300"
                                          )}
                                        >
                                          {customer.status === 'customer' ? 'Khách hàng' : customer.status === 'lead' ? 'Lead' : 'Tiềm năng'}
                                        </Badge>
                                      </div>
                                      <div className="space-y-0.5">
                                        <p className="text-xs text-gray-600 flex items-center gap-1">
                                          <Phone className="w-3 h-3" />
                                          {customer.phone}
                                        </p>
                                        {customer.email && (
                                          <p className="text-xs text-gray-600 flex items-center gap-1 truncate">
                                            <Mail className="w-3 h-3" />
                                            {customer.email}
                                          </p>
                                        )}
                                        {customer.company && (
                                          <p className="text-xs text-gray-600 flex items-center gap-1 truncate">
                                            <Building2 className="w-3 h-3" />
                                            {customer.company}
                                          </p>
                                        )}
                                      </div>
                                      <div className="flex flex-wrap gap-1 mt-2">
                                        {customer.tags.map((tag, idx) => (
                                          <span
                                            key={idx}
                                            className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-700"
                                          >
                                            {tag}
                                          </span>
                                        ))}
                                      </div>
                                      <div className="mt-2 pt-2 border-t border-gray-100">
                                        <p className="text-xs text-gray-500">
                                          Nguồn: <span className="font-medium text-gray-700">{customer.source}</span>
                                        </p>
                                      </div>
                                    </div>
                                    {connectedCustomers.has(customer.id) ? (
                                      <div className="flex items-center gap-2 flex-shrink-0">
                                        <div className="flex items-center gap-1 bg-green-50 px-3 py-1.5 rounded-lg">
                                          <Check className="w-4 h-4 text-green-600" />
                                          <span className="text-xs font-medium text-green-700">Đã kết nối</span>
                                        </div>
                                        <DropdownMenu>
                                          <DropdownMenuTrigger asChild>
                                            <Button size="sm" className="h-8 text-xs">
                                              Thao tác
                                            </Button>
                                          </DropdownMenuTrigger>
                                          <DropdownMenuContent align="end" className="w-48">
                                            <DropdownMenuItem onClick={() => setSelectedLeadDetail(customer)}>
                                              <Eye className="w-4 h-4 mr-2" />
                                              Xem chi tiết
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => {
                                              const newConnected = new Set(connectedCustomers)
                                              newConnected.delete(customer.id)
                                              setConnectedCustomers(newConnected)
                                            }}>
                                              <X className="w-4 h-4 mr-2" />
                                              Hủy liên kết
                                            </DropdownMenuItem>
                                          </DropdownMenuContent>
                                        </DropdownMenu>
                                      </div>
                                    ) : (
                                      <Button 
                                        size="sm" 
                                        className="h-8 text-xs bg-blue-600 hover:bg-blue-700 flex-shrink-0"
                                        onClick={() => {
                                          const newConnected = new Set(connectedCustomers)
                                          newConnected.add(customer.id)
                                          setConnectedCustomers(newConnected)
                                          const newMap = new Map(conversationCustomerMap)
                                          newMap.set(selectedConversation.id, customer.id)
                                          setConversationCustomerMap(newMap)
                                        }}
                                      >
                                        Liên kết
                                      </Button>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )
                        })()}
                      </ScrollArea>
                    </div>
                  )
                })()}
              </>
            )}

            {/* Tab Content: Thông tin cộng đồng */}
            {rightPanelTab === 'community' && selectedConversation.conversationType === 'group' && (
              <div className="flex-1 flex flex-col overflow-hidden">
                {/* Search Members */}
                <div className="p-4 border-b border-gray-200 flex-shrink-0">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      placeholder="Tìm kiếm thành viên..."
                      value={memberSearchTerm}
                      onChange={(e) => setMemberSearchTerm(e.target.value)}
                      className="pl-9 pr-8"
                    />
                    {memberSearchTerm && (
                      <button 
                        onClick={() => setMemberSearchTerm('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded"
                      >
                        <X className="w-4 h-4 text-gray-400" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Members List */}
                <ScrollArea className="flex-1">
                  <div className="p-4">
                    {(() => {
                      const filteredAdmins = selectedConversation.members?.filter(m => m.role === 'admin' && (!memberSearchTerm || m.name.toLowerCase().includes(memberSearchTerm.toLowerCase()))) || []
                      const filteredMembers = selectedConversation.members?.filter(m => m.role === 'member' && (!memberSearchTerm || m.name.toLowerCase().includes(memberSearchTerm.toLowerCase()))) || []
                      const hasResults = filteredAdmins.length > 0 || filteredMembers.length > 0

                      if (!hasResults && memberSearchTerm) {
                        return (
                          <div className="flex flex-col items-center justify-center py-12">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                              <Search className="w-8 h-8 text-gray-400" />
                            </div>
                            <p className="text-sm text-gray-600">Không tìm thấy thành viên</p>
                            <p className="text-xs text-gray-500 mt-1">Thử từ khóa khác</p>
                          </div>
                        )
                      }

                      return (
                        <div className="space-y-3">
                          {/* Admin section */}
                          {filteredAdmins.length > 0 && (
                            <div>
                              <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2 px-2">
                                Quản trị viên • {filteredAdmins.length}
                              </h4>
                              <div className="space-y-1">
                                {filteredAdmins.map((member) => (
                                  <div
                                    key={member.id}
                                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
                                  >
                                    <div className="relative flex-shrink-0">
                                      <Avatar className="w-11 h-11 border-2 border-orange-200">
                                        <AvatarImage src={member.avatar} />
                                        <AvatarFallback className="bg-orange-500 text-white text-sm">
                                          {member.name.substring(0, 2).toUpperCase()}
                                        </AvatarFallback>
                                      </Avatar>
                                      {member.isActive && (
                                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                                      )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-center gap-2">
                                        <h4 className="font-medium text-sm text-gray-900 truncate">
                                          {member.name}
                                        </h4>
                                        <Badge className="bg-orange-100 text-orange-700 text-xs px-2 py-0 h-5 border-orange-300">
                                          Admin
                                        </Badge>
                                      </div>
                                      <p className="text-xs text-gray-500">
                                        {member.isActive ? (
                                          <span className="text-green-600">● Đang hoạt động</span>
                                        ) : (
                                          `Hoạt động ${formatConversationTime(member.lastSeenAt)} trước`
                                        )}
                                      </p>
                                    </div>
                                    <DropdownMenu>
                                      <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-full flex-shrink-0">
                                          <MoreVertical className="w-4 h-4 text-gray-400" />
                                        </Button>
                                      </DropdownMenuTrigger>
                                      <DropdownMenuContent align="end" className="w-48">
                                        <DropdownMenuItem className="cursor-pointer">
                                          <UserPlus className="w-4 h-4 mr-2" />
                                          Gửi lời mời kết bạn
                                        </DropdownMenuItem>
                                        <DropdownMenuItem className="cursor-pointer">
                                          <MessageSquare className="w-4 h-4 mr-2" />
                                          Nhắn tin
                                        </DropdownMenuItem>
                                      </DropdownMenuContent>
                                    </DropdownMenu>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Members section */}
                          {filteredMembers.length > 0 && (
                            <div className="pt-3">
                              <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2 px-2">
                                Thành viên • {filteredMembers.length}
                              </h4>
                              <div className="space-y-1">
                                {filteredMembers.map((member) => (
                                  <div
                                    key={member.id}
                                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
                                  >
                                    <div className="relative flex-shrink-0">
                                      <Avatar className="w-11 h-11">
                                        <AvatarImage src={member.avatar} />
                                        <AvatarFallback className="bg-blue-500 text-white text-sm">
                                          {member.name.substring(0, 2).toUpperCase()}
                                        </AvatarFallback>
                                      </Avatar>
                                      {member.isActive && (
                                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                                      )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <h4 className="font-medium text-sm text-gray-900 truncate">
                                        {member.name}
                                      </h4>
                                      <p className="text-xs text-gray-500">
                                        {member.isActive ? (
                                          <span className="text-green-600">● Đang hoạt động</span>
                                        ) : (
                                          `Hoạt động ${formatConversationTime(member.lastSeenAt)} trước`
                                        )}
                                      </p>
                                    </div>
                                    <DropdownMenu>
                                      <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-full flex-shrink-0">
                                          <MoreVertical className="w-4 h-4 text-gray-400" />
                                        </Button>
                                      </DropdownMenuTrigger>
                                      <DropdownMenuContent align="end" className="w-48">
                                        <DropdownMenuItem className="cursor-pointer">
                                          <UserPlus className="w-4 h-4 mr-2" />
                                          Gửi lời mời kết bạn
                                        </DropdownMenuItem>
                                        <DropdownMenuItem className="cursor-pointer">
                                          <MessageSquare className="w-4 h-4 mr-2" />
                                          Nhắn tin
                                        </DropdownMenuItem>
                                      </DropdownMenuContent>
                                    </DropdownMenu>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )
                    })()}
                  </div>
                </ScrollArea>

                {/* Bottom Actions */}
                <div className="p-4 border-t border-gray-200 flex-shrink-0">
                  <Button variant="outline" className="w-full text-sm text-red-600 hover:bg-red-50 hover:text-red-700 border-red-300">
                    <X className="w-4 h-4 mr-2" />
                    Rời khỏi nhóm
                  </Button>
                </div>
              </div>
            )}

            {/* Tab Content: File chia sẻ */}
            {rightPanelTab === 'files' && (
              <div className="flex-1 flex flex-col overflow-hidden">
                {/* Search */}
                <div className="p-4 border-b border-gray-200">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      placeholder="Tìm kiếm tên file..."
                      value={fileSearchTerm}
                      onChange={(e) => setFileSearchTerm(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                </div>

                {/* Filters */}
                <div className="p-4 space-y-3 border-b border-gray-200 flex-shrink-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600 w-20 flex-shrink-0">Loại file:</span>
                    <div className="flex gap-2 flex-wrap">
                      {(['all', 'file', 'image', 'video'] as const).map((type) => (
                        <button
                          key={type}
                          onClick={() => setFileTypeFilter(type)}
                          className={cn(
                            "px-3 py-1 text-xs rounded-md border transition-colors",
                            fileTypeFilter === type
                              ? "bg-blue-50 border-blue-500 text-blue-600"
                              : "border-gray-300 text-gray-600 hover:bg-gray-50"
                          )}
                        >
                          {type === 'all' ? 'Tất cả' : type}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600 w-20 flex-shrink-0">Nguồn gửi:</span>
                    <div className="flex gap-2 flex-wrap">
                      {(['all', 'staff', 'customer'] as const).map((sender) => (
                        <button
                          key={sender}
                          onClick={() => setFileSenderFilter(sender)}
                          className={cn(
                            "px-3 py-1 text-xs rounded-md border transition-colors",
                            fileSenderFilter === sender
                              ? "bg-blue-50 border-blue-500 text-blue-600"
                              : "border-gray-300 text-gray-600 hover:bg-gray-50"
                          )}
                        >
                          {sender === 'all' ? 'Tất cả' : sender === 'staff' ? 'Nhân viên' : 'Khách hàng'}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* File List */}
                <ScrollArea className="flex-1">
                  {demoSharedFiles
                    .filter(file => {
                      if (fileTypeFilter !== 'all' && file.type !== fileTypeFilter) return false
                      if (fileSearchTerm && !file.name.toLowerCase().includes(fileSearchTerm.toLowerCase())) return false
                      return true
                    })
                    .map((file) => (
                      <div key={file.id} className="p-4 border-b border-gray-100">
                        <div className="flex gap-3">
                          {/* Thumbnail */}
                          <div className="w-16 h-16 bg-gray-100 rounded flex items-center justify-center flex-shrink-0">
                            {file.type === 'image' ? (
                              <ImageIcon className="w-6 h-6 text-gray-400" />
                            ) : file.type === 'video' ? (
                              <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            ) : (
                              <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                            )}
                          </div>
                          {/* File Info */}
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-sm text-gray-900 truncate">{file.name}</h4>
                            <p className="text-xs text-gray-500 truncate">{file.sender}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge className="bg-blue-500 text-white text-xs px-2 py-0.5">
                                {file.storage}
                              </Badge>
                              <span className="text-xs text-gray-400">{file.time} • {file.size}</span>
                            </div>
                            <div className="flex gap-2 mt-2">
                              <Button variant="outline" size="sm" className="h-7 text-xs">
                                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                </svg>
                                Tải xuống
                              </Button>
                              <Button size="sm" className="h-7 text-xs bg-blue-500 hover:bg-blue-600">
                                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                                Đi tới tin nhắn
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                </ScrollArea>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Lead Detail Modal */}
      <Dialog open={selectedLeadDetail !== null} onOpenChange={(open) => !open && setSelectedLeadDetail(null)}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-hidden flex flex-col p-0">
          {selectedLeadDetail && (
            <>
              {/* Modal Header */}
              <div className="px-6 py-4 border-b border-gray-200 flex-shrink-0">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-semibold text-gray-900">Chi tiết Lead - {selectedLeadDetail.name}</h3>
                    <Badge className={cn(
                      "text-xs px-3 py-1",
                      selectedLeadDetail.status === 'customer' ? "bg-green-100 text-green-800" :
                      selectedLeadDetail.status === 'lead' ? "bg-blue-100 text-blue-800" :
                      "bg-yellow-100 text-yellow-800"
                    )}>
                      {selectedLeadDetail.status === 'customer' ? 'Chuyển đổi thành công' :
                       selectedLeadDetail.status === 'lead' ? 'Lead mới' : 'Tiềm năng'}
                    </Badge>
                  </div>
                  <button 
                    onClick={() => setSelectedLeadDetail(null)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
                
                {/* Tabs */}
                <div className="flex border-b border-gray-200 -mb-px">
                  <button
                    onClick={() => setLeadDetailTab('contact')}
                    className={cn(
                      "px-4 py-2 text-sm font-medium border-b-2 transition-colors",
                      leadDetailTab === 'contact' 
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    )}
                  >
                    Thông tin liên hệ
                  </button>
                  <button
                    onClick={() => setLeadDetailTab('history')}
                    className={cn(
                      "px-4 py-2 text-sm font-medium border-b-2 transition-colors",
                      leadDetailTab === 'history'
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    )}
                  >
                    Lịch sử tương tác
                  </button>
                  <button
                    onClick={() => setLeadDetailTab('notes')}
                    className={cn(
                      "px-4 py-2 text-sm font-medium border-b-2 transition-colors",
                      leadDetailTab === 'notes'
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    )}
                  >
                    Ghi chú & Nội dung
                  </button>
                </div>
              </div>

              {/* Modal Content */}
              <ScrollArea className="flex-1 p-6">
                {leadDetailTab === 'contact' && (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Left Column */}
                    <div className="space-y-6">
                      {/* Thông tin cơ bản */}
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                          <User className="w-5 h-5 text-blue-500" />
                          Thông tin cơ bản
                        </h4>
                        <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Tên khách hàng:</span>
                            <span className="text-sm font-medium text-gray-900">{selectedLeadDetail.name}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Công ty:</span>
                            <span className="text-sm font-medium text-gray-900">{selectedLeadDetail.company || 'N/A'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Loại khách hàng:</span>
                            <span className="text-sm font-medium text-gray-900">
                              {selectedLeadDetail.status === 'customer' ? 'Khách hàng' : 
                               selectedLeadDetail.status === 'lead' ? 'Lead' : 'Tiềm năng'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Thông tin liên hệ */}
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                          <Phone className="w-5 h-5 text-green-500" />
                          Thông tin liên hệ
                        </h4>
                        <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Số điện thoại:</span>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium text-gray-900">{selectedLeadDetail.phone}</span>
                              <button className="p-1 text-green-600 hover:bg-green-100 rounded">
                                <Phone className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                          {selectedLeadDetail.email && (
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-gray-600">Email:</span>
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-medium text-gray-900">{selectedLeadDetail.email}</span>
                                <button className="p-1 text-blue-600 hover:bg-blue-100 rounded">
                                  <Mail className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          )}
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Nguồn:</span>
                            <span className="text-sm font-medium text-gray-900">{selectedLeadDetail.source}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-6">
                      {/* Thông tin bán hàng */}
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                          <Briefcase className="w-5 h-5 text-purple-500" />
                          Thông tin bán hàng
                        </h4>
                        <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Sản phẩm quan tâm:</span>
                            <span className="text-sm font-medium text-gray-900">CRM Solution</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Sales phụ trách:</span>
                            <span className="text-sm font-medium text-gray-900">Minh Expert</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Giá trị lead:</span>
                            <span className="text-sm font-medium text-green-600">50.000.000 VNĐ</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Xác suất thành công:</span>
                            <span className="text-sm font-medium text-gray-900">85%</span>
                          </div>
                        </div>
                      </div>

                      {/* Thông tin thời gian */}
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                          <ClockIcon className="w-5 h-5 text-orange-500" />
                          Thông tin thời gian
                        </h4>
                        <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Ngày tạo:</span>
                            <span className="text-sm font-medium text-gray-900">
                              {new Date(selectedLeadDetail.createdAt).toLocaleDateString('vi-VN')}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Lần liên hệ cuối:</span>
                            <span className="text-sm font-medium text-gray-900">
                              {new Date(selectedLeadDetail.lastContactedAt).toLocaleDateString('vi-VN')}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Số lần tương tác:</span>
                            <span className="text-sm font-medium text-blue-600">8 lần</span>
                          </div>
                        </div>
                      </div>

                      {/* Tags */}
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-4">Tags/Nhãn</h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedLeadDetail.tags.map((tag, idx) => (
                            <span
                              key={idx}
                              className={cn(
                                "px-2 py-1 text-xs font-medium rounded-full",
                                tag.toLowerCase().includes('vip') ? "bg-red-100 text-red-800" :
                                tag.toLowerCase().includes('hot') ? "bg-red-100 text-red-800" :
                                tag.toLowerCase().includes('enterprise') ? "bg-purple-100 text-purple-800" :
                                "bg-gray-100 text-gray-800"
                              )}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {leadDetailTab === 'history' && (
                  <div className="text-center py-12 text-gray-500">
                    Chức năng lịch sử tương tác đang được phát triển
                  </div>
                )}

                {leadDetailTab === 'notes' && (
                  <div className="text-center py-12 text-gray-500">
                    Chức năng ghi chú & nội dung đang được phát triển
                  </div>
                )}
              </ScrollArea>

              {/* Modal Footer */}
              <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3 flex-shrink-0">
                <Button
                  variant="outline"
                  onClick={() => setSelectedLeadDetail(null)}
                  className="px-4 py-2 text-sm"
                >
                  Đóng
                </Button>
                <Button
                  className="px-4 py-2 text-sm bg-green-600 hover:bg-green-700 flex items-center gap-2"
                >
                  <TrendingUp className="w-4 h-4" />
                  Chuyển đổi
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
