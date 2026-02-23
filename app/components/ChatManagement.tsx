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
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
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
  Settings,
  Globe,
  Facebook,
  QrCode,
  RefreshCw,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Link,
  Zap,
  ListTodo,
  StickyNote,
  ShoppingCart,
  ArrowRightLeft,
  Calendar,
  Reply,
  Forward,
  MoreHorizontal,
  Pin,
  Copy,
  Bell,
  CornerUpLeft,
  CheckSquare,
  Undo2,
  AlarmClock,
  ChevronLeft,
  Repeat2
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
  isPinned?: boolean
  replyTo?: {
    id: string
    content: string
    senderName: string
  }
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

interface ConversationConnection {
  customerId: string
  platform: 'zalo-personal' | 'zalo-oa' | 'facebook'
  accountId: string
  accountName: string
  connectedAt: string
}

interface CustomerConnectionCount {
  'zalo-personal': number
  'zalo-oa': number
  'facebook': number
  total: number
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
  notes?: string
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
  channel: 'zalo' | 'facebook'
  conversationType: 'individual' | 'group'
  members?: GroupMember[]
  memberCount?: number
  accountId?: string
  platform?: 'zalo-personal' | 'zalo-oa' | 'facebook'
}

interface Reminder {
  id: string
  title: string
  date: string
  time: string
  repeat: 'none' | 'daily' | 'weekly' | 'monthly'
  note?: string
  conversationId: string
  messageId?: string
  createdAt: string
}

// ===== GENERATE DEMO DATA =====

const vietnameseNamesZaloPersonal = [
  'Nguyễn Hải Yến', 'Nguyễn Văn Tiến', 'Cộng đồng Omichat', 'Vũ Trần Digital',
  'Lê Thị Trang', 'ABQ Startup Com', 'TunVN - HỖ TRỢ TÀI CHÍNH'
]

const vietnameseNamesZaloOA = [
  'Phạm Minh Tuấn', 'Trần Thu Hương', 'Hoàng Văn Long', 'Đỗ Thị Mai',
  'Bùi Công Danh', 'Phan Thị Lan', 'Võ Quốc Khánh'
]

const vietnameseNamesFacebook = [
  'Ngô Thanh Tùng', 'Đinh Hồng Nhung', 'Lý Văn Thành', 'Dương Thị Thảo',
  'Cao Minh Đức', 'Hồ Thanh Bình', 'Trịnh Thị Hoa'
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
  'Hợp đồng sắp hết hạn rồi',
  'Xin chào, tôi muốn hỏi về báo giá sản phẩm',
  'Anh ơi cho em hỏi về sản phẩm CRM',
  'Chị có thể gửi thông tin qua email được không?',
  'Tôi quan tâm đến gói Enterprise',
  'Phần mềm này có hỗ trợ tiếng Việt không?',
  'Cho em hỏi về cách thanh toán',
  'Em muốn đặt lịch demo sản phẩm',
  'Dạ em cần hỗ trợ kỹ thuật',
  'Bên mình có chính sách chiết khấu không ạ?',
  'Tư vấn giúp em về giải pháp quản lý khách hàng',
  'Anh có thể gọi lại cho em được không?',
  'Em đang gặp vấn đề khi đăng nhập',
  'Cho em xin địa chỉ văn phòng',
  'Cảm ơn anh/chị nhiều ạ!',
  'Nguyễn Hải Yến vừa gửi tin nhắn mới',
  'Trần Thu Hương đã xác nhận đơn hàng',
  'Phạm Minh Tuấn cần tư vấn thêm về sản phẩm',
  'Hoàng Văn Long muốn gia hạn hợp đồng',
  'Đỗ Thị Mai hỏi về tính năng báo cáo',
  'Bùi Công Danh quan tâm gói Premium',
  'Phan Thị Lan cần hỗ trợ kỹ thuật',
  'Ngô Thanh Tùng đặt lịch demo tuần sau',
  'Đinh Hồng Nhung gửi yêu cầu báo giá'
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
  platform: 'zalo-personal' | 'zalo-oa' | 'facebook'
}

const connectedZaloAccounts: ZaloAccount[] = [
  // Zalo Personal accounts (có cả individual và group conversations)
  { id: 'zp-1', name: 'Nguyễn Chính Nghĩa - Zalo', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ChinhNghia', unreadCount: 9, type: 'personal', platform: 'zalo-personal' },
  { id: 'zp-2', name: 'Hải Yến Shop - Zalo', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=HaiYenShop', unreadCount: 25, type: 'personal', platform: 'zalo-personal' },
  { id: 'zp-3', name: 'Công ty CP Tập Đoàn Vitech', avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=Vitech', unreadCount: 15, type: 'personal', platform: 'zalo-personal' },
  { id: 'zp-4', name: 'Sale Team - Marketing', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=SaleTeam', unreadCount: 0, type: 'personal', platform: 'zalo-personal' },
  // Zalo OA accounts (CHỈ có individual conversations, KHÔNG có nhóm)
  { id: 'oa-1', name: 'OA Tech Support Official', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=TechSupportOA', unreadCount: 3, type: 'oa', platform: 'zalo-oa' },
  { id: 'oa-2', name: 'OA Vilead CRM Official', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=VileadOA', unreadCount: 8, type: 'oa', platform: 'zalo-oa' },
  { id: 'oa-3', name: 'OA Dịch Vụ Khách Hàng 24/7', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=CustomerService', unreadCount: 12, type: 'oa', platform: 'zalo-oa' },
  // Facebook accounts (CHỈ có individual conversations, KHÔNG có nhóm)
  { id: 'fb-1', name: 'Fanpage Vilead CRM Solutions', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=VileadFanpage', unreadCount: 5, type: 'personal', platform: 'facebook' },
  { id: 'fb-2', name: 'Fanpage Tech Solutions Vietnam', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=TechSolutionsVN', unreadCount: 7, type: 'personal', platform: 'facebook' },
  { id: 'fb-3', name: 'Fanpage Marketing Agency Pro', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=MarketingPro', unreadCount: 2, type: 'personal', platform: 'facebook' },
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
  // Zalo OA Customers
  { id: 'crm-8', name: 'Phạm Minh Tuấn', phone: '0901234574', email: 'tuan@business.vn', company: 'Công ty CP XYZ', source: 'Zalo OA', status: 'lead', tags: ['Tư vấn'], createdAt: '2024-01-21T08:00:00Z', lastContactedAt: '2024-01-22T11:00:00Z', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=PhamMinhTuan' },
  { id: 'crm-9', name: 'Trần Thu Hương', phone: '0901234575', email: 'huong@trade.vn', company: 'Công ty Thương mại GHI', source: 'Zalo OA', status: 'potential', tags: ['Quan tâm'], createdAt: '2024-01-19T10:30:00Z', lastContactedAt: '2024-01-23T08:20:00Z', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=TranThuHuong' },
  { id: 'crm-10', name: 'Hoàng Văn Long', phone: '0901234576', email: 'long@enterprise.vn', company: 'Tập đoàn JKL', source: 'Zalo OA', status: 'customer', tags: ['Khách hàng thân thiết'], createdAt: '2024-01-17T14:45:00Z', lastContactedAt: '2024-01-22T16:30:00Z', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=HoangVanLong' },
  { id: 'crm-11', name: 'Đỗ Thị Mai', phone: '0901234577', email: 'mai@company.vn', company: 'Công ty TNHH MTV MNO', source: 'Zalo OA', status: 'lead', tags: ['Demo'], createdAt: '2024-01-22T09:15:00Z', lastContactedAt: '2024-01-23T10:00:00Z', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=DoThiMai' },
  { id: 'crm-12', name: 'Bùi Công Danh', phone: '0901234578', email: 'danh@investment.vn', company: 'Quỹ đầu tư ABC', source: 'Zalo OA', status: 'potential', tags: ['Đầu tư'], createdAt: '2024-01-20T15:30:00Z', lastContactedAt: '2024-01-22T17:00:00Z', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=BuiCongDanh' },
  { id: 'crm-13', name: 'Phan Thị Lan', phone: '0901234579', email: 'lan@retail.vn', company: 'Hệ thống bán lẻ MNO', source: 'Zalo OA', status: 'customer', tags: ['Bán lẻ'], createdAt: '2024-01-18T12:00:00Z', lastContactedAt: '2024-01-23T11:30:00Z', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=PhanThiLan' },
  { id: 'crm-14', name: 'Võ Quốc Khánh', phone: '0901234580', email: 'khanh@logistics.vn', company: 'Công ty Logistics PQR', source: 'Zalo OA', status: 'lead', tags: ['Logistics'], createdAt: '2024-01-19T09:45:00Z', lastContactedAt: '2024-01-22T13:15:00Z', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=VoQuocKhanh' },
  // Facebook Customers  
  { id: 'crm-15', name: 'Ngô Thanh Tùng', phone: '0901234581', email: 'tung@innovation.vn', company: 'Startup Innovation', source: 'Facebook', status: 'potential', tags: ['Tech', 'Startup'], createdAt: '2024-01-20T11:20:00Z', lastContactedAt: '2024-01-22T15:45:00Z', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=NgoThanhTung' },
  { id: 'crm-16', name: 'Đinh Hồng Nhung', phone: '0901234582', email: 'nhung@corp.vn', company: 'Công ty CP PQR', source: 'Facebook', status: 'customer', tags: ['VIP'], createdAt: '2024-01-18T13:30:00Z', lastContactedAt: '2024-01-23T09:00:00Z', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=DinhHongNhung' },
  { id: 'crm-17', name: 'Lý Văn Thành', phone: '0901234583', email: 'thanh@business.com', company: 'Doanh nghiệp tư nhân DEF', source: 'Facebook', status: 'lead', tags: ['Quan tâm sản phẩm'], createdAt: '2024-01-21T10:00:00Z', lastContactedAt: '2024-01-22T14:15:00Z', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=LyVanThanh' },
  { id: 'crm-18', name: 'Dương Thị Thảo', phone: '0901234584', email: 'thao@education.vn', company: 'Trung tâm đào tạo STU', source: 'Facebook', status: 'potential', tags: ['Giáo dục'], createdAt: '2024-01-19T14:00:00Z', lastContactedAt: '2024-01-22T16:45:00Z', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=DuongThiThao' },
  { id: 'crm-19', name: 'Cao Minh Đức', phone: '0901234585', email: 'duc@manufacture.vn', company: 'Nhà máy sản xuất VWX', source: 'Facebook', status: 'customer', tags: ['Sản xuất'], createdAt: '2024-01-17T11:30:00Z', lastContactedAt: '2024-01-23T08:00:00Z', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=CaoMinhDuc' },
  { id: 'crm-20', name: 'Hồ Thanh Bình', phone: '0901234586', email: 'binh@consulting.vn', company: 'Công ty Tư vấn YZA', source: 'Facebook', status: 'lead', tags: ['Tư vấn chiến lược'], createdAt: '2024-01-20T16:15:00Z', lastContactedAt: '2024-01-22T12:30:00Z', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=HoThanhBinh' },
  { id: 'crm-21', name: 'Trịnh Thị Hoa', phone: '0901234587', email: 'hoa@healthcare.vn', company: 'Phòng khám đa khoa BCD', source: 'Facebook', status: 'potential', tags: ['Y tế'], createdAt: '2024-01-18T10:45:00Z', lastContactedAt: '2024-01-23T07:30:00Z', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=TrinhThiHoa' },
]

// Sales Pipeline Stages
const salesStages = [
  { id: 'new-lead', name: 'Lead mới', color: 'bg-gray-100 text-gray-700', icon: UserPlus },
  { id: 'consulting', name: 'Đang tư vấn', color: 'bg-blue-100 text-blue-700', icon: MessageSquare },
  { id: 'quote-sent', name: 'Đã gửi đề xuất', color: 'bg-green-100 text-green-700', icon: Mail },
  { id: 'negotiation', name: 'Đàm phán', color: 'bg-yellow-100 text-yellow-700', icon: Briefcase },
  { id: 'payment-pending', name: 'Chuyển đổi - chờ thanh toán', color: 'bg-purple-100 text-purple-700', icon: Clock },
  { id: 'converted', name: 'Chuyển đổi thành công', color: 'bg-green-100 text-green-700', icon: Check },
  { id: 'lost', name: 'Thất bại', color: 'bg-red-100 text-red-700', icon: X },
]

function generateDemoContacts(names: string[], platform: string): ZaloContact[] {
  return names.map((name, index) => ({
    id: `${platform}-${String(index + 1)}`,
    zaloId: `${platform}-${String(index + 1).padStart(3, '0')}`,
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

const demoContactsZaloPersonal = generateDemoContacts(vietnameseNamesZaloPersonal, 'zalo-personal')
const demoContactsZaloOA = generateDemoContacts(vietnameseNamesZaloOA, 'zalo-oa')
const demoContactsFacebook = generateDemoContacts(vietnameseNamesFacebook, 'facebook')

// Use Zalo Personal contacts as default for backwards compatibility
const demoContacts = demoContactsZaloPersonal

function generateDemoMessages(contactId: string): ZaloMessage[] {
  const messageCount = Math.floor(Math.random() * 10) + 5
  const messages: ZaloMessage[] = []
  
  // Find contact across all platforms
  const allContacts = [...demoContactsZaloPersonal, ...demoContactsZaloOA, ...demoContactsFacebook]
  const contact = allContacts.find(c => c.id === contactId)

  for (let i = 0; i < messageCount; i++) {
    const isIncoming = i % 2 === 0
    const timestamp = new Date(Date.now() - (messageCount - i) * 3600000).toISOString()

    messages.push({
      id: `msg-${contactId}-${i}`,
      conversationId: contactId,
      content: lastMessages[Math.floor(Math.random() * lastMessages.length)],
      messageType: 'text',
      direction: isIncoming ? 'incoming' : 'outgoing',
      timestamp,
      sender: {
        id: isIncoming ? contactId : 'agent-1',
        name: isIncoming ? (contact?.name || 'Khách hàng') : 'Tư vấn viên',
        avatar: isIncoming ? contact?.avatar : undefined,
        type: isIncoming ? 'customer' : 'agent'
      },
      status: isIncoming ? 'read' : (['sent', 'delivered', 'read'][Math.floor(Math.random() * 3)] as any)
    })
  }

  return messages
}

const demoMessages: Record<string, ZaloMessage[]> = {}
// Generate messages for all platform contacts
demoContactsZaloPersonal.forEach((contact) => {
  demoMessages[contact.id] = generateDemoMessages(contact.id)
})
demoContactsZaloOA.forEach((contact) => {
  demoMessages[contact.id] = generateDemoMessages(contact.id)
})
demoContactsFacebook.forEach((contact) => {
  demoMessages[contact.id] = generateDemoMessages(contact.id)
})

function generateDemoConversations(): ZaloConversation[] {
  const allConversations: ZaloConversation[] = []
  
  // Generate Zalo Personal conversations for each account
  const zaloPersonalAccounts = connectedZaloAccounts.filter(acc => acc.platform === 'zalo-personal')
  zaloPersonalAccounts.forEach((account, accountIndex) => {
    demoContactsZaloPersonal.slice(0, 3).forEach((contact, index) => {
      const contactIndex = accountIndex * 3 + index
      const messages = demoMessages[contact.id] || []
      const lastMessage = messages.length > 0 ? messages[messages.length - 1] : null
      const hoursAgo = contactIndex < 3 ? contactIndex * 4 : Math.floor(Math.random() * 24 * 30)
      const lastMessageAt = new Date(Date.now() - hoursAgo * 60 * 60 * 1000).toISOString()
      const isGroup = index === 2 // Only third contact is a group
      
      allConversations.push({
        id: `${account.id}-conv-${contact.id}`,
        contactId: contact.id,
        contact,
        lastMessage,
        lastMessageAt,
        unreadCount: contactIndex < 5 ? Math.floor(Math.random() * 10) + 1 : 0,
        status: 'active',
        assignedTo: contactIndex % 3 === 0 ? 'Tư vấn viên A' : contactIndex % 3 === 1 ? 'Tư vấn viên B' : undefined,
        tags: contact.tags,
        priority: ['low', 'medium', 'high', 'urgent'][contactIndex % 4] as any,
        channel: 'zalo',
        conversationType: isGroup ? 'group' : 'individual',
        members: isGroup ? demoGroupMembers : undefined,
        memberCount: isGroup ? demoGroupMembers.length : undefined,
        accountId: account.id,
        platform: 'zalo-personal'
      })
    })
  })
  
  // Generate Zalo OA conversations (individual only)
  const zaloOAAccounts = connectedZaloAccounts.filter(acc => acc.platform === 'zalo-oa')
  zaloOAAccounts.forEach((account, accountIndex) => {
    demoContactsZaloOA.slice(0, 3).forEach((contact, index) => {
      const contactIndex = accountIndex * 3 + index
      const messages = demoMessages[contact.id] || []
      const lastMessage = messages.length > 0 ? messages[messages.length - 1] : null
      const hoursAgo = contactIndex < 3 ? contactIndex * 4 : Math.floor(Math.random() * 24 * 30)
      const lastMessageAt = new Date(Date.now() - hoursAgo * 60 * 60 * 1000).toISOString()
      
      allConversations.push({
        id: `${account.id}-conv-${contact.id}`,
        contactId: contact.id,
        contact,
        lastMessage,
        lastMessageAt,
        unreadCount: contactIndex < 4 ? Math.floor(Math.random() * 8) + 1 : 0,
        status: 'active',
        assignedTo: contactIndex % 2 === 0 ? 'Tư vấn viên C' : undefined,
        tags: contact.tags,
        priority: ['low', 'medium', 'high'][contactIndex % 3] as any,
        channel: 'zalo',
        conversationType: 'individual', // OA only has individual
        members: undefined,
        memberCount: undefined,
        accountId: account.id,
        platform: 'zalo-oa'
      })
    })
  })
  
  // Generate Facebook conversations (individual only)
  const facebookAccounts = connectedZaloAccounts.filter(acc => acc.platform === 'facebook')
  facebookAccounts.forEach((account, accountIndex) => {
    demoContactsFacebook.slice(0, 3).forEach((contact, index) => {
      const contactIndex = accountIndex * 3 + index
      const messages = demoMessages[contact.id] || []
      const lastMessage = messages.length > 0 ? messages[messages.length - 1] : null
      const hoursAgo = contactIndex < 3 ? contactIndex * 4 : Math.floor(Math.random() * 24 * 30)
      const lastMessageAt = new Date(Date.now() - hoursAgo * 60 * 60 * 1000).toISOString()
      
      allConversations.push({
        id: `${account.id}-conv-${contact.id}`,
        contactId: contact.id,
        contact,
        lastMessage,
        lastMessageAt,
        unreadCount: contactIndex < 3 ? Math.floor(Math.random() * 6) + 1 : 0,
        status: 'active',
        assignedTo: contactIndex % 2 === 0 ? 'Tư vấn viên D' : undefined,
        tags: contact.tags,
        priority: ['medium', 'high'][contactIndex % 2] as any,
        channel: 'facebook',
        conversationType: 'individual', // Facebook only has individual
        members: undefined,
        memberCount: undefined,
        accountId: account.id,
        platform: 'facebook'
      })
    })
  })
  
  return allConversations
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
  const [selectedChannel, setSelectedChannel] = useState<'zalo-personal' | 'zalo-oa' | 'facebook'>('zalo-personal')
  const [selectedAccount, setSelectedAccount] = useState<ZaloAccount>(connectedZaloAccounts[0])
  const [showAccountDropdown, setShowAccountDropdown] = useState(false)
  const [rightPanelTab, setRightPanelTab] = useState<'zalo' | 'sync' | 'community' | 'files' | 'reminders'>('zalo')
  const [syncSearchTerm, setSyncSearchTerm] = useState('')
  const [syncSearchAll, setSyncSearchAll] = useState(false)
  const [fileSearchTerm, setFileSearchTerm] = useState('')
  const [fileTypeFilter, setFileTypeFilter] = useState<'all' | 'file' | 'image' | 'video'>('all')
  const [fileSenderFilter, setFileSenderFilter] = useState<'all' | 'staff' | 'customer'>('all')
  const [showConnectionModal, setShowConnectionModal] = useState(false)
  const [showCreateLeadModal, setShowCreateLeadModal] = useState(false)
  const [syncedCustomers, setSyncedCustomers] = useState<Map<string, any>>(new Map())
  const [leadFormData, setLeadFormData] = useState({
    customerType: 'individual',
    name: '',
    phone: '',
    email: '',
    source: 'website',
    province: 'hanoi',
    assignTo: '',
    product: '',
    content: '',
    notes: ''
  })
  const [connectionPlatformFilter, setConnectionPlatformFilter] = useState<'all' | 'zalo-personal' | 'zalo-oa' | 'facebook'>('all')
  const [connectedAccounts, setConnectedAccounts] = useState<ZaloAccount[]>(connectedZaloAccounts)
  const [accountConnectionStatus, setAccountConnectionStatus] = useState<Map<string, boolean>>(
    new Map(connectedZaloAccounts.map(acc => [acc.id, true]))
  )
  const [memberSearchTerm, setMemberSearchTerm] = useState('')
  const [showDeleteAccountModal, setShowDeleteAccountModal] = useState(false)
  const [accountToDelete, setAccountToDelete] = useState<ZaloAccount | null>(null)
  
  // Friend request states
  const [showFriendRequestModal, setShowFriendRequestModal] = useState(false)
  const [friendRequestMessage, setFriendRequestMessage] = useState('Xin chào bạn. Tôi muốn kết bạn với bạn trên Zalo')
  const [selectedMemberForRequest, setSelectedMemberForRequest] = useState<GroupMember | null>(null)
  
  // Integration modal states
  const [showIntegrationModal, setShowIntegrationModal] = useState(false)
  const [selectedIntegrationType, setSelectedIntegrationType] = useState<'zalo-personal' | 'zalo-oa' | 'facebook' | ''>('')
  const [showQRModal, setShowQRModal] = useState(false)
  const [showOALinkModal, setShowOALinkModal] = useState(false)
  const [showFacebookModal, setShowFacebookModal] = useState(false)
  const [qrCheckStatus, setQRCheckStatus] = useState<'pending' | 'checking' | 'success' | 'error'>('pending')
  const [qrCheckInterval, setQRCheckInterval] = useState<NodeJS.Timeout | null>(null)
  const [connectedCustomers, setConnectedCustomers] = useState<Set<string>>(new Set())
  const [conversationCustomerMap, setConversationCustomerMap] = useState<Map<string, ConversationConnection>>(new Map())
  const [customerStageMap, setCustomerStageMap] = useState<Map<string, string>>(new Map())
  const [customerConnectionCount, setCustomerConnectionCount] = useState<Map<string, CustomerConnectionCount>>(new Map())
  const [selectedLeadDetail, setSelectedLeadDetail] = useState<CRMCustomer | null>(null)
  const [leadDetailTab, setLeadDetailTab] = useState<'contact' | 'history' | 'notes'>('contact')
  
  // Quick Action Modal States
  const [selectedLeadForQuickAction, setSelectedLeadForQuickAction] = useState<CRMCustomer | null>(null)
  const [showQuickStatusModal, setShowQuickStatusModal] = useState(false)
  const [showQuickTaskModal, setShowQuickTaskModal] = useState(false)
  const [showQuickNoteModal, setShowQuickNoteModal] = useState(false)
  const [showQuickOrderModal, setShowQuickOrderModal] = useState(false)
  
  // Quick Action Form States
  const [quickStatusValue, setQuickStatusValue] = useState('')
  const [quickTaskTitle, setQuickTaskTitle] = useState('')
  const [quickTaskDescription, setQuickTaskDescription] = useState('')
  const [quickTaskDeadline, setQuickTaskDeadline] = useState('')
  const [quickTaskPriority, setQuickTaskPriority] = useState('')
  const [quickTaskAssignee, setQuickTaskAssignee] = useState('')
  const [quickTaskType, setQuickTaskType] = useState('Leads')
  const [quickTaskTags, setQuickTaskTags] = useState<string[]>([])
  const [quickTaskInternalNote, setQuickTaskInternalNote] = useState('')
  const [quickNoteContent, setQuickNoteContent] = useState('')
  const [quickNoteFiles, setQuickNoteFiles] = useState<File[]>([])
  const [quickOrderProducts, setQuickOrderProducts] = useState<string[]>([])
  const [quickOrderProductVariant, setQuickOrderProductVariant] = useState<{[key: string]: string}>({})
  const [quickOrderDiscount, setQuickOrderDiscount] = useState('0')
  const [quickOrderPaymentMethod, setQuickOrderPaymentMethod] = useState('cash')
  const [quickOrderNote, setQuickOrderNote] = useState('')
  
  // Chat input expansion and attachment states
  const [isInputExpanded, setIsInputExpanded] = useState(false)
  const [selectedImages, setSelectedImages] = useState<File[]>([])
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([])

  // Message actions states
  const [forwardingMessage, setForwardingMessage] = useState<ZaloMessage | null>(null)
  const [replyingToMessage, setReplyingToMessage] = useState<ZaloMessage | null>(null)
  const [selectedMessageIds, setSelectedMessageIds] = useState<string[]>([])
  const [isSelectMode, setIsSelectMode] = useState(false)
  const [showReminderDialog, setShowReminderDialog] = useState(false)
  const [reminderMessage, setReminderMessage] = useState<ZaloMessage | null>(null)
  const [pinnedMessages, setPinnedMessages] = useState<Set<string>>(new Set())
  const [hoveredMessageId, setHoveredMessageId] = useState<string | null>(null)
  const [showPinnedList, setShowPinnedList] = useState(false)
  const [showUnpinDialog, setShowUnpinDialog] = useState(false)
  const [messageToUnpin, setMessageToUnpin] = useState<string | null>(null)
  // Reminder states
  const [reminders, setReminders] = useState<Reminder[]>([
    {
      id: 'reminder-1',
      title: 'Nhắc hẹn 2',
      date: '2026-02-25',
      time: '23:57',
      repeat: 'weekly',
      note: '',
      conversationId: 'conv-1',
      createdAt: new Date().toISOString()
    },
    {
      id: 'reminder-2',
      title: 'Ám ảnh zalo',
      date: '2026-02-24',
      time: '01:45',
      repeat: 'weekly',
      note: '',
      conversationId: 'conv-1',
      createdAt: new Date().toISOString()
    }
  ])
  const [reminderTitle, setReminderTitle] = useState('')
  const [reminderDate, setReminderDate] = useState(new Date().toISOString().split('T')[0])
  const [reminderTime, setReminderTime] = useState('09:00')
  const [reminderRepeat, setReminderRepeat] = useState<'none' | 'daily' | 'weekly' | 'monthly'>('none')
  const [reminderNote, setReminderNote] = useState('')
  const [reminderNotification, setReminderNotification] = useState<Reminder | null>(null)
  const [editingReminder, setEditingReminder] = useState<Reminder | null>(null)
  const [showDeleteReminderDialog, setShowDeleteReminderDialog] = useState(false)
  const [reminderToDelete, setReminderToDelete] = useState<string | null>(null)
  // Search mode states
  const [isSearchMode, setIsSearchMode] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchTab, setSearchTab] = useState<'all' | 'users' | 'messages'>('all')

  const messageScrollRef = useRef<HTMLDivElement>(null)
  const accountDropdownRef = useRef<HTMLDivElement>(null)
  const imageInputRef = useRef<HTMLInputElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Check if a customer already has a connection in the same platform
  const checkExistingConnectionInSamePlatform = (customerId: string, platform: 'zalo-personal' | 'zalo-oa' | 'facebook'): boolean => {
    const connections = Array.from(conversationCustomerMap.values())
    return connections.some(connection => 
      connection.customerId === customerId && connection.platform === platform
    )
  }

  // Toggle account connection status
  const toggleAccountConnection = (accountId: string) => {
    setAccountConnectionStatus(prev => {
      const newMap = new Map(prev)
      newMap.set(accountId, !prev.get(accountId))
      return newMap
    })
  }

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
    setMessages(demoMessages[conversation.contactId] || [])
    
    // Auto switch to community tab if it's a Zalo Personal group conversation
    if (conversation.conversationType === 'group' && selectedChannel === 'zalo-personal') {
      setRightPanelTab('community')
    } else {
      // Reset to zalo tab for individual conversations or non-Zalo-Personal groups
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
      status: 'sent',
      replyTo: replyingToMessage ? {
        id: replyingToMessage.id,
        content: replyingToMessage.content,
        senderName: replyingToMessage.sender.name
      } : undefined
    }

    setMessages([...messages, newMessage])
    setMessageInput('')
    setShowQuickReplies(false)
    setReplyingToMessage(null)
    setForwardingMessage(null)

    // Update conversation last message
    setConversations(conversations.map(c =>
      c.id === selectedConversation.id
        ? { ...c, lastMessage: newMessage, lastMessageAt: newMessage.timestamp }
        : c
    ))
  }

  // Message action handlers
  const handleReplyMessage = (message: ZaloMessage) => {
    setReplyingToMessage(message)
    setForwardingMessage(null)
  }

  const handleForwardMessage = (message: ZaloMessage) => {
    setForwardingMessage(message)
    setReplyingToMessage(null)
  }

  const handleCopyMessage = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content)
      // Could add toast notification here
    } catch (err) {
      console.error('Failed to copy message:', err)
    }
  }

  const handlePinMessage = (messageId: string) => {
    setPinnedMessages(prev => {
      const newSet = new Set(prev)
      if (newSet.has(messageId)) {
        newSet.delete(messageId)
      } else {
        newSet.add(messageId)
      }
      return newSet
    })
  }

  const handleDeleteMessageForMe = (messageId: string) => {
    // In real app, this would mark the message as deleted for current user
    setMessages(prev => prev.filter(m => m.id !== messageId))
  }

  const handleRecallMessage = (messageId: string) => {
    // In real app, this would recall the message from both sides
    setMessages(prev => prev.map(m => 
      m.id === messageId 
        ? { ...m, content: 'Tin nhắn đã được thu hồi', messageType: 'text' as const }
        : m
    ))
  }

  const handleSelectMessage = (messageId: string) => {
    setSelectedMessageIds(prev => 
      prev.includes(messageId)
        ? prev.filter(id => id !== messageId)
        : [...prev, messageId]
    )
  }

  const handleCreateReminder = (message?: ZaloMessage) => {
    // Check permission for community
    if (selectedConversation?.conversationType === 'group' && selectedChannel === 'zalo-personal') {
      // For community, check if user is leader/deputy (for demo, always show alert)
      alert('Chỉ trưởng/ phó cộng đồng mới được tạo nhắc hẹn')
      return
    }
    setReminderMessage(message || null)
    setReminderTitle('')
    setReminderDate(new Date().toISOString().split('T')[0])
    setReminderTime('09:00')
    setReminderRepeat('none')
    setReminderNote('')
    setShowReminderDialog(true)
  }

  // Save reminder (create or edit)
  const saveReminder = () => {
    if (!reminderTitle.trim() || !selectedConversation) return

    if (editingReminder) {
      // Edit mode
      setReminders(prev => prev.map(r => 
        r.id === editingReminder.id 
          ? {
              ...r,
              title: reminderTitle,
              date: reminderDate,
              time: reminderTime,
              repeat: reminderRepeat,
              note: reminderNote
            }
          : r
      ))
      setEditingReminder(null)
    } else {
      // Create mode
      const newReminder: Reminder = {
        id: `reminder-${Date.now()}`,
        title: reminderTitle,
        date: reminderDate,
        time: reminderTime,
        repeat: reminderRepeat,
        note: reminderNote,
        conversationId: selectedConversation.id,
        messageId: reminderMessage?.id,
        createdAt: new Date().toISOString()
      }

      setReminders(prev => [newReminder, ...prev])
      setReminderNotification(newReminder)

      // Auto-hide notification after 10 seconds
      setTimeout(() => {
        setReminderNotification(null)
      }, 10000)
    }

    setShowReminderDialog(false)
    setReminderMessage(null)
  }

  // Format reminder display date
  const formatReminderDate = (dateStr: string, timeStr: string) => {
    const date = new Date(dateStr + 'T' + timeStr)
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    if (date.toDateString() === today.toDateString()) {
      return `Hôm nay lúc ${timeStr}`
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return `Ngày mai lúc ${timeStr}`
    } else {
      const options: Intl.DateTimeFormatOptions = { weekday: 'long', day: 'numeric', month: 'long' }
      return `${date.toLocaleDateString('vi-VN', options)} lúc ${timeStr}`
    }
  }

  // Get day of week in Vietnamese
  const getDayOfWeek = (dateStr: string) => {
    const date = new Date(dateStr)
    const days = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy']
    return days[date.getDay()]
  }

  // Format repeat label
  const formatRepeatLabel = (repeat: string) => {
    switch (repeat) {
      case 'daily': return 'Nhắc hằng ngày'
      case 'weekly': return 'Nhắc theo tuần'
      case 'monthly': return 'Nhắc hằng tháng'
      default: return 'Không lặp lại'
    }
  }

  // Get reminders for current conversation
  const getConversationReminders = () => {
    if (!selectedConversation) return []
    return reminders.filter(r => r.conversationId === selectedConversation.id)
  }

  // Check if conversation has reminders
  const hasConversationReminders = (conversationId: string) => {
    return reminders.some(r => r.conversationId === conversationId)
  }

  // Handle edit reminder
  const handleEditReminder = (reminder: Reminder) => {
    setEditingReminder(reminder)
    setReminderTitle(reminder.title)
    setReminderDate(reminder.date)
    setReminderTime(reminder.time)
    setReminderRepeat(reminder.repeat)
    setReminderNote(reminder.note || '')
    setShowReminderDialog(true)
  }

  // Handle delete reminder confirmation
  const handleDeleteReminderConfirm = (reminderId: string) => {
    setReminderToDelete(reminderId)
    setShowDeleteReminderDialog(true)
  }

  // Execute delete reminder
  const executeDeleteReminder = () => {
    if (reminderToDelete) {
      setReminders(prev => prev.filter(r => r.id !== reminderToDelete))
      setReminderToDelete(null)
      setShowDeleteReminderDialog(false)
    }
  }

  // Search results with deduplication
  const getSearchResults = () => {
    if (!searchQuery.trim()) return { users: [], messages: [] }
    
    const query = searchQuery.toLowerCase()
    
    // Search users (conversations) - deduplicate by contact name
    const seenUserNames = new Set<string>()
    const userResults = conversations.filter(conv => {
      const matches = conv.contact.name.toLowerCase().includes(query) ||
        (conv.contact.phone && conv.contact.phone.includes(query))
      if (matches && !seenUserNames.has(conv.contact.name)) {
        seenUserNames.add(conv.contact.name)
        return true
      }
      return false
    })
    
    // Search ALL messages in demoMessages - deduplicate by content
    const messageResults: { message: ZaloMessage; conversation: ZaloConversation }[] = []
    const seenMessages = new Set<string>()
    
    Object.entries(demoMessages).forEach(([contactId, msgs]) => {
      msgs.forEach(msg => {
        if (msg.content.toLowerCase().includes(query)) {
          const msgKey = `${msg.content}`
          if (!seenMessages.has(msgKey)) {
            seenMessages.add(msgKey)
            const conv = conversations.find(c => c.contactId === contactId)
            if (conv) {
              messageResults.push({ message: msg, conversation: conv })
            }
          }
        }
      })
    })
    
    return { users: userResults, messages: messageResults }
  }

  const cancelReplyOrForward = () => {
    setReplyingToMessage(null)
    setForwardingMessage(null)
  }

  // Get pinned messages data
  const getPinnedMessagesData = () => {
    return messages.filter(m => pinnedMessages.has(m.id))
  }

  // Confirm unpin message
  const confirmUnpinMessage = (messageId: string) => {
    setMessageToUnpin(messageId)
    setShowUnpinDialog(true)
  }

  // Execute unpin
  const executeUnpin = () => {
    if (messageToUnpin) {
      handlePinMessage(messageToUnpin)
      setMessageToUnpin(null)
      setShowUnpinDialog(false)
    }
  }

  // Cancel select mode
  const cancelSelectMode = () => {
    setIsSelectMode(false)
    setSelectedMessageIds([])
  }

  // Bulk copy messages
  const handleBulkCopy = () => {
    const selectedMsgs = messages.filter(m => selectedMessageIds.includes(m.id))
    const content = selectedMsgs.map(m => m.content).join('\n')
    navigator.clipboard.writeText(content)
    cancelSelectMode()
  }

  // Bulk delete messages
  const handleBulkDelete = () => {
    setMessages(prev => prev.filter(m => !selectedMessageIds.includes(m.id)))
    cancelSelectMode()
  }

  // Bulk recall messages
  const handleBulkRecall = () => {
    setMessages(prev => prev.map(m => 
      selectedMessageIds.includes(m.id) 
        ? { ...m, content: 'Tin nhắn đã được thu hồi', messageType: 'text' as const }
        : m
    ))
    cancelSelectMode()
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

  // Handle image selection
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      const newImages = Array.from(files)
      setSelectedImages(prev => [...prev, ...newImages])
      
      // Create preview URLs
      newImages.forEach(file => {
        const reader = new FileReader()
        reader.onload = (e) => {
          setImagePreviewUrls(prev => [...prev, e.target?.result as string])
        }
        reader.readAsDataURL(file)
      })
    }
    // Reset input
    if (imageInputRef.current) {
      imageInputRef.current.value = ''
    }
  }

  // Handle file selection
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      const newFiles = Array.from(files)
      setSelectedFiles(prev => [...prev, ...newFiles])
    }
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  // Remove selected image
  const removeSelectedImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index))
    setImagePreviewUrls(prev => prev.filter((_, i) => i !== index))
  }

  // Remove selected file
  const removeSelectedFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index))
  }

  // Toggle input expansion
  const toggleInputExpansion = () => {
    setIsInputExpanded(prev => !prev)
  }

  // Clear all attachments
  const clearAttachments = () => {
    setSelectedImages([])
    setSelectedFiles([])
    setImagePreviewUrls([])
  }

  // Filter conversations
  const filteredConversations = conversations.filter(conv => {
    const matchesSearch = conv.contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          conv.contact.phone?.includes(searchTerm) ||
                          conv.lastMessage?.content.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesUnread = !filterUnread || conv.unreadCount > 0
    
    // Filter by selected account and platform
    const matchesAccount = conv.accountId === selectedAccount.id
    const matchesPlatform = conv.platform === selectedChannel
    
    // Zalo OA and Facebook only show individual conversations (no groups)
    // Zalo Personal can show both individual and group conversations
    const matchesChannel = (selectedChannel === 'zalo-oa' || selectedChannel === 'facebook')
      ? conv.conversationType === 'individual'
      : true
    
    return matchesSearch && matchesUnread && matchesChannel && matchesAccount && matchesPlatform
  })

  const unreadCount = conversations.reduce((sum, conv) => sum + conv.unreadCount, 0)

  return (
    <div className="h-full flex flex-col bg-white overflow-hidden">
      <div className="grid grid-cols-12 gap-0 h-full overflow-hidden">

        {/* LEFT PANEL - Conversation List */}
        <div className="col-span-3 border-r border-gray-200 h-full flex flex-col bg-white overflow-hidden">
          {/* Header */}
          <div className="p-4 border-b border-gray-200 bg-white">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-semibold text-gray-900">Tin nhắn</h2>
              <button 
                onClick={() => setShowConnectionModal(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
              >
                <Plus className="w-4 h-4" />
                <span>Kết nối</span>
              </button>
            </div>

            {/* Search */}
            <div className="relative mb-3">
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Tìm kiếm tin nhắn"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setIsSearchMode(true)}
                    className="pl-10 bg-white border-gray-300 text-sm h-9"
                  />
                </div>
                {isSearchMode && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setIsSearchMode(false)
                      setSearchQuery('')
                      setSearchTab('all')
                    }}
                    className="text-blue-500 hover:text-blue-600 hover:bg-blue-50 h-9 px-3"
                  >
                    Đóng
                  </Button>
                )}
              </div>
            </div>

            {/* Search Mode: Tabs */}
            {isSearchMode ? (
              (() => {
                const results = getSearchResults()
                const totalCount = results.users.length + results.messages.length
                return (
                  <div className="flex gap-1">
                    <Button
                      variant={searchTab === 'all' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setSearchTab('all')}
                      className={cn(
                        "text-xs h-8",
                        searchTab === 'all'
                          ? "bg-blue-500 hover:bg-blue-600 text-white"
                          : "hover:bg-gray-100 text-gray-700"
                      )}
                    >
                      Tất cả {searchQuery.trim() && `(${totalCount})`}
                    </Button>
                    <Button
                      variant={searchTab === 'users' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setSearchTab('users')}
                      className={cn(
                        "text-xs h-8",
                        searchTab === 'users'
                          ? "bg-blue-500 hover:bg-blue-600 text-white"
                          : "hover:bg-gray-100 text-gray-700"
                      )}
                    >
                      Người dùng {searchQuery.trim() && `(${results.users.length})`}
                    </Button>
                    <Button
                      variant={searchTab === 'messages' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setSearchTab('messages')}
                      className={cn(
                        "text-xs h-8",
                        searchTab === 'messages'
                          ? "bg-blue-500 hover:bg-blue-600 text-white"
                          : "hover:bg-gray-100 text-gray-700"
                      )}
                    >
                      Tin nhắn {searchQuery.trim() && `(${results.messages.length})`}
                    </Button>
                  </div>
                )
              })()
            ) : (
              <>
            {/* Channel Icons */}
            <div className="flex gap-2 mb-3">
              <button 
                onClick={() => {
                  setSelectedChannel('zalo-personal')
                  const firstAccount = connectedAccounts.find(a => a.platform === 'zalo-personal')
                  if (firstAccount) setSelectedAccount(firstAccount)
                }}
                className={cn(
                  "relative flex items-center justify-center w-10 h-10 rounded-full transition-colors",
                  selectedChannel === 'zalo-personal' 
                    ? "bg-blue-600 ring-2 ring-blue-300 ring-offset-1" 
                    : "bg-blue-500 hover:bg-blue-600"
                )}
              >
                <span className="text-white font-semibold text-xs">ZL</span>
                {(() => {
                  const count = connectedAccounts.filter(a => a.platform === 'zalo-personal').reduce((sum, a) => sum + a.unreadCount, 0)
                  return count > 0 ? (
                    <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {count > 99 ? '99+' : count}
                    </div>
                  ) : null
                })()}
              </button>
              <button 
                onClick={() => {
                  setSelectedChannel('zalo-oa')
                  const firstAccount = connectedAccounts.find(a => a.platform === 'zalo-oa')
                  if (firstAccount) setSelectedAccount(firstAccount)
                }}
                className={cn(
                  "relative flex items-center justify-center w-10 h-10 rounded-full transition-colors",
                  selectedChannel === 'zalo-oa' 
                    ? "bg-blue-600 ring-2 ring-blue-300 ring-offset-1" 
                    : "bg-blue-500 hover:bg-blue-600"
                )}
              >
                <span className="text-white font-semibold text-xs">OA</span>
                {(() => {
                  const count = connectedAccounts.filter(a => a.platform === 'zalo-oa').reduce((sum, a) => sum + a.unreadCount, 0)
                  return count > 0 ? (
                    <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {count > 99 ? '99+' : count}
                    </div>
                  ) : null
                })()}
              </button>
              <button 
                onClick={() => {
                  setSelectedChannel('facebook')
                  const firstAccount = connectedAccounts.find(a => a.platform === 'facebook')
                  if (firstAccount) setSelectedAccount(firstAccount)
                }}
                className={cn(
                  "relative flex items-center justify-center w-10 h-10 rounded-full transition-colors",
                  selectedChannel === 'facebook' 
                    ? "bg-blue-700 ring-2 ring-blue-300 ring-offset-1" 
                    : "bg-blue-600 hover:bg-blue-700"
                )}
              >
                <span className="text-white font-semibold text-xs">FB</span>
                {(() => {
                  const count = connectedAccounts.filter(a => a.platform === 'facebook').reduce((sum, a) => sum + a.unreadCount, 0)
                  return count > 0 ? (
                    <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {count > 99 ? '99+' : count}
                    </div>
                  ) : null
                })()}
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
                  <span className="text-sm text-gray-900 truncate max-w-[180px]">
                    {selectedAccount.name}
                  </span>
                  {(() => {
                    const totalUnreadForPlatform = connectedAccounts
                      .filter(a => a.platform === selectedChannel)
                      .reduce((sum, a) => sum + a.unreadCount, 0)
                    return totalUnreadForPlatform > 0 ? (
                      <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0">
                        {totalUnreadForPlatform > 99 ? '99+' : totalUnreadForPlatform}
                      </span>
                    ) : null
                  })()}
                </div>
                <ChevronDown className={cn(
                  "w-4 h-4 text-gray-400 transition-transform flex-shrink-0",
                  showAccountDropdown && "rotate-180"
                )} />
              </button>

              {/* Dropdown Menu */}
              {showAccountDropdown && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-50 py-1">
                  {connectedAccounts.filter(account => account.platform === selectedChannel).map((account) => (
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
                {selectedChannel !== 'facebook' && (
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
                )}
              </div>
            </div>
              </>
            )}
          </div>

          {/* Search Results */}
          {isSearchMode ? (
            <ScrollArea className="flex-1 bg-white">
              {(() => {
                const results = getSearchResults()
                const showUsers = searchTab === 'all' || searchTab === 'users'
                const showMessages = searchTab === 'all' || searchTab === 'messages'
                const hasResults = results.users.length > 0 || results.messages.length > 0
                
                if (!searchQuery.trim()) {
                  return (
                    <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                      <Search className="w-12 h-12 text-gray-300 mb-3" />
                      <p className="text-gray-500 text-sm">Nhập từ khóa để tìm kiếm</p>
                    </div>
                  )
                }
                
                if (!hasResults) {
                  return (
                    <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                      <Search className="w-12 h-12 text-gray-300 mb-3" />
                      <p className="text-gray-500 text-sm">Không tìm thấy kết quả</p>
                    </div>
                  )
                }
                
                return (
                  <div className="divide-y divide-gray-100">
                    {/* User Results */}
                    {showUsers && results.users.length > 0 && (
                      <div>
                        <div className="px-4 py-2 bg-gray-50 border-b border-gray-100">
                          <span className="text-xs font-medium text-gray-500 uppercase">Người dùng ({results.users.length})</span>
                        </div>
                        {results.users.map((conv) => (
                          <div
                            key={conv.id}
                            onClick={() => {
                              handleSelectConversation(conv)
                            }}
                            className={cn(
                              "px-4 py-3 flex items-center gap-3 hover:bg-gray-50 cursor-pointer transition-colors",
                              selectedConversation?.id === conv.id && "bg-blue-50 border-l-4 border-l-blue-500"
                            )}
                          >
                            <Avatar className="w-10 h-10">
                              <AvatarImage src={conv.contact.avatar} />
                              <AvatarFallback className="bg-blue-500 text-white text-sm">
                                {conv.contact.name.substring(0, 2).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-gray-900 truncate">{conv.contact.name}</p>
                              <p className="text-xs text-gray-500">{conv.contact.phone || 'Zalo'}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {/* Message Results */}
                    {showMessages && results.messages.length > 0 && (
                      <div>
                        <div className="px-4 py-2 bg-gray-50 border-b border-gray-100">
                          <span className="text-xs font-medium text-gray-500 uppercase">Tin nhắn ({results.messages.length})</span>
                        </div>
                        {results.messages.map((item, idx) => {
                          const { message, conversation: conv } = item
                          return (
                            <div
                              key={`${conv.id}-${idx}`}
                              onClick={() => {
                                handleSelectConversation(conv)
                              }}
                              className={cn(
                                "px-4 py-3 flex items-start gap-3 hover:bg-gray-50 cursor-pointer transition-colors",
                                selectedConversation?.id === conv.id && "bg-blue-50 border-l-4 border-l-blue-500"
                              )}
                            >
                              <Avatar className="w-10 h-10 flex-shrink-0">
                                <AvatarImage src={conv.contact.avatar} />
                                <AvatarFallback className="bg-blue-500 text-white text-sm">
                                  {conv.contact.name.substring(0, 2).toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-gray-900 truncate">{conv.contact.name}</p>
                                <p className="text-sm text-gray-600 line-clamp-2">{message.content}</p>
                                <p className="text-xs text-gray-400 mt-1">{message.timestamp}</p>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>
                )
              })()}
            </ScrollArea>
          ) : (
          /* Conversation List or Contacts List */
          activeTab === 'contacts' ? (
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
              {filteredConversations.map((conversation) => {
                // Check if this conversation is synced with CRM
                const isSyncedWithCRM = syncedCustomers.has(conversation.id) || 
                                       conversationCustomerMap.has(conversation.id)
                
                return (
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
                      {isSyncedWithCRM && (
                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center border-2 border-white">
                          <Link className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-0.5">
                        <h4 className="font-semibold text-sm truncate pr-2 max-w-[180px]">
                          {conversation.contact.name}
                        </h4>
                        <span className="text-xs text-gray-500 whitespace-nowrap flex-shrink-0">
                          {formatConversationTime(conversation.lastMessageAt)}
                        </span>
                      </div>

                      <div className="flex items-start justify-between gap-2">
                        <p className="text-xs text-gray-600 truncate flex-1 max-w-[200px]">
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
                )
              })}
            </ScrollArea>
          )
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
                      {conversationCustomerMap.has(selectedConversation.id) && (() => {
                        const connectionInfo = conversationCustomerMap.get(selectedConversation.id)
                        const customerId = connectionInfo?.customerId || ''
                        return (
                        <div className="hidden md:flex items-center gap-2">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <button 
                                className={cn(
                                  "inline-flex items-center rounded-full border px-2.5 font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 text-xs py-0 h-5 cursor-pointer hover:opacity-80 whitespace-nowrap",
                                  salesStages.find(s => s.id === (customerStageMap.get(customerId) || 'new-lead'))?.color || "bg-gray-100 text-gray-700"
                                )}
                              >
                                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"/>
                                </svg>
                                {salesStages.find(s => s.id === (customerStageMap.get(customerId) || 'new-lead'))?.name || 'Lead mới'}
                              </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="start" className="w-56">
                              <div className="px-2 py-1.5 text-xs font-semibold text-gray-500 uppercase">
                                Giai đoạn bán hàng
                              </div>
                              {salesStages.map((stage) => {
                                const StageIcon = stage.icon
                                const isSelected = (customerStageMap.get(customerId) || 'new-lead') === stage.id
                                return (
                                  <DropdownMenuItem 
                                    key={stage.id}
                                    onClick={() => {
                                      const newMap = new Map(customerStageMap)
                                      newMap.set(customerId, stage.id)
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
                        )
                      })()}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  {/* <Button variant="ghost" size="sm" className="h-9 w-9 p-0 rounded-full hover:bg-gray-100" title="In">
                    <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/>
                    </svg>
                  </Button> */}
                  {/* Only show bell icon if current conversation has reminders */}
                  {selectedConversation && getConversationReminders().length > 0 && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-9 w-9 p-0 rounded-full hover:bg-gray-100 relative" 
                      title="Nhắc hẹn"
                      onClick={() => setRightPanelTab('reminders')}
                    >
                      <Bell className="w-4 h-4 text-gray-600" />
                      <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-1 bg-red-500 text-white text-[10px] font-medium rounded-full flex items-center justify-center">
                        {getConversationReminders().length}
                      </span>
                    </Button>
                  )}
                  <Button variant="ghost" size="sm" className="h-9 w-9 p-0 rounded-full hover:bg-gray-100" title="Gọi điện">
                    <Phone className="w-4 h-4 text-gray-600" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-9 w-9 p-0 rounded-full hover:bg-gray-100" 
                    title="Tìm kiếm"
                    onClick={() => setRightPanelTab('files')}
                  >
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

              {/* Pinned Messages Panel */}
              {pinnedMessages.size > 0 && (
                <div className="bg-yellow-50 border-b border-yellow-200">
                  {!showPinnedList ? (
                    // Single pinned message view with expand option
                    <div 
                      className="flex items-center gap-2 px-4 py-2 cursor-pointer hover:bg-yellow-100 transition-colors"
                      onClick={() => pinnedMessages.size > 1 && setShowPinnedList(true)}
                    >
                      <Pin className="w-4 h-4 text-yellow-600 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-700 truncate">
                          {getPinnedMessagesData()[0]?.content}
                        </p>
                      </div>
                      {pinnedMessages.size > 1 && (
                        <span className="flex-shrink-0 text-xs bg-yellow-200 text-yellow-700 px-2 py-0.5 rounded-full">
                          +{pinnedMessages.size - 1} ghim
                        </span>
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          const firstPinned = getPinnedMessagesData()[0]
                          if (firstPinned) confirmUnpinMessage(firstPinned.id)
                        }}
                        className="flex-shrink-0 p-1 rounded hover:bg-yellow-200 text-yellow-600 hover:text-yellow-800"
                        title="Bỏ ghim"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    // Expanded pinned messages list
                    <div className="py-2">
                      <div 
                        className="flex items-center gap-2 px-4 py-1.5 cursor-pointer hover:bg-yellow-100"
                        onClick={() => setShowPinnedList(false)}
                      >
                        <ChevronDown className="w-4 h-4 text-yellow-600" />
                        <span className="text-sm font-medium text-yellow-700">
                          Danh sách ghim ({pinnedMessages.size})
                        </span>
                      </div>
                      <div className="max-h-[200px] overflow-y-auto">
                        {getPinnedMessagesData().map((msg) => (
                          <div 
                            key={msg.id}
                            className="flex items-center gap-2 px-4 py-2 hover:bg-yellow-100 transition-colors"
                          >
                            <Pin className="w-3 h-3 text-yellow-600 flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <p className="text-xs text-yellow-600 font-medium">{msg.sender.name}</p>
                              <p className="text-sm text-gray-700 truncate">{msg.content}</p>
                            </div>
                            <button
                              onClick={() => confirmUnpinMessage(msg.id)}
                              className="flex-shrink-0 p-1 rounded hover:bg-yellow-200 text-yellow-600 hover:text-yellow-800"
                              title="Bỏ ghim"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Reminder Notification */}
              {reminderNotification && (
                <div className="bg-yellow-50 border-b border-yellow-200 px-4 py-2 flex items-center gap-3">
                  <AlarmClock className="w-4 h-4 text-yellow-600 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <span className="text-sm text-gray-700">
                      Bạn tạo nhắc hẹn mới <span className="font-medium">{reminderNotification.title}</span> - {getDayOfWeek(reminderNotification.date)}, {new Date(reminderNotification.date).getDate()} tháng {new Date(reminderNotification.date).getMonth() + 1} lúc {reminderNotification.time} .{' '}
                      <button 
                        onClick={() => setRightPanelTab('reminders')}
                        className="text-blue-600 hover:text-blue-700 font-medium"
                      >
                        Xem
                      </button>
                    </span>
                  </div>
                  <button
                    onClick={() => setReminderNotification(null)}
                    className="flex-shrink-0 p-1 rounded hover:bg-yellow-200 text-yellow-600 hover:text-yellow-800"
                    title="Đóng"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Messages Area */}
              <div className={cn(
                "overflow-y-auto p-4 bg-white transition-all duration-300",
                isInputExpanded ? "flex-shrink-0 h-[120px] border-b border-gray-100" : "flex-1"
              )} ref={messageScrollRef}>
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
                              <div 
                                key={message.id} 
                                className="group relative flex items-center gap-1"
                                onMouseEnter={() => setHoveredMessageId(message.id)}
                                onMouseLeave={() => setHoveredMessageId(null)}
                              >
                                {/* Checkbox for select mode */}
                                {isSelectMode && (
                                  <div 
                                    className="flex-shrink-0 cursor-pointer"
                                    onClick={() => handleSelectMessage(message.id)}
                                  >
                                    <div className={cn(
                                      "w-5 h-5 rounded border-2 flex items-center justify-center transition-colors",
                                      selectedMessageIds.includes(message.id)
                                        ? "bg-blue-500 border-blue-500"
                                        : "border-gray-300 hover:border-blue-400"
                                    )}>
                                      {selectedMessageIds.includes(message.id) && (
                                        <Check className="w-3 h-3 text-white" />
                                      )}
                                    </div>
                                  </div>
                                )}
                                {/* Message Actions - Left side for outgoing */}
                                {msgGroup.direction === 'outgoing' && (
                                  <div className={cn(
                                    "flex items-center gap-0.5 transition-opacity duration-200",
                                    hoveredMessageId === message.id ? "opacity-100" : "opacity-0"
                                  )}>
                                    <button
                                      onClick={() => handleReplyMessage(message)}
                                      className="p-1.5 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-700"
                                      title="Trả lời"
                                    >
                                      <Reply className="w-4 h-4" />
                                    </button>
                                    {/* <button
                                      onClick={() => handleForwardMessage(message)}
                                      className="p-1.5 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-700"
                                      title="Chuyển tiếp"
                                    >
                                      <Forward className="w-4 h-4" />
                                    </button> */}
                                    <DropdownMenu>
                                      <DropdownMenuTrigger asChild>
                                        <button
                                          className="p-1.5 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-700"
                                          title="Thêm"
                                        >
                                          <MoreHorizontal className="w-4 h-4" />
                                        </button>
                                      </DropdownMenuTrigger>
                                      <DropdownMenuContent align="end" className="w-48">
                                        <DropdownMenuItem onClick={() => handleCopyMessage(message.content)}>
                                          <Copy className="w-4 h-4 mr-2" />
                                          Sao chép tin nhắn
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => handlePinMessage(message.id)}>
                                          <Pin className="w-4 h-4 mr-2" />
                                          {pinnedMessages.has(message.id) ? 'Bỏ ghim tin nhắn' : 'Ghim tin nhắn'}
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => {
                                          setIsSelectMode(true)
                                          handleSelectMessage(message.id)
                                        }}>
                                          <CheckSquare className="w-4 h-4 mr-2" />
                                          Chọn nhiều tin nhắn
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => handleCreateReminder(message)}>
                                          <Bell className="w-4 h-4 mr-2" />
                                          Tạo nhắc hẹn
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => handleDeleteMessageForMe(message.id)} className="text-red-600">
                                          <Trash2 className="w-4 h-4 mr-2" />
                                          Xóa tin nhắn phía tôi
                                        </DropdownMenuItem>
                                        {msgGroup.direction === 'outgoing' && (
                                          <DropdownMenuItem onClick={() => handleRecallMessage(message.id)} className="text-orange-600">
                                            <Undo2 className="w-4 h-4 mr-2" />
                                            Thu hồi
                                          </DropdownMenuItem>
                                        )}
                                      </DropdownMenuContent>
                                    </DropdownMenu>
                                  </div>
                                )}

                                {/* Message Bubble */}
                                <div className="flex flex-col">
                                  {/* Reply reference */}
                                  {message.replyTo && (
                                    <div className="text-xs text-gray-500 mb-1 px-2 py-1 bg-gray-50 rounded border-l-2 border-blue-400">
                                      <span className="font-medium">{message.replyTo.senderName}</span>
                                      <p className="truncate max-w-[200px]">{message.replyTo.content}</p>
                                    </div>
                                  )}
                                  <div
                                    className={cn(
                                      "rounded-2xl px-4 py-2 relative",
                                      msgGroup.direction === 'outgoing'
                                        ? 'bg-blue-50 text-gray-900'
                                        : 'bg-gray-100 text-gray-900',
                                      pinnedMessages.has(message.id) && "ring-2 ring-yellow-400"
                                    )}
                                  >
                                    {pinnedMessages.has(message.id) && (
                                      <Pin className="absolute -top-1 -right-1 w-3 h-3 text-yellow-500" />
                                    )}
                                    <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
                                  </div>
                                </div>

                                {/* Message Actions - Right side for incoming */}
                                {msgGroup.direction === 'incoming' && (
                                  <div className={cn(
                                    "flex items-center gap-0.5 transition-opacity duration-200",
                                    hoveredMessageId === message.id ? "opacity-100" : "opacity-0"
                                  )}>
                                    <button
                                      onClick={() => handleReplyMessage(message)}
                                      className="p-1.5 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-700"
                                      title="Trả lời"
                                    >
                                      <Reply className="w-4 h-4" />
                                    </button>
                                    {/* <button
                                      onClick={() => handleForwardMessage(message)}
                                      className="p-1.5 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-700"
                                      title="Chuyển tiếp"
                                    >
                                      <Forward className="w-4 h-4" />
                                    </button> */}
                                    <DropdownMenu>
                                      <DropdownMenuTrigger asChild>
                                        <button
                                          className="p-1.5 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-700"
                                          title="Thêm"
                                        >
                                          <MoreHorizontal className="w-4 h-4" />
                                        </button>
                                      </DropdownMenuTrigger>
                                      <DropdownMenuContent align="start" className="w-48">
                                        <DropdownMenuItem onClick={() => handleCopyMessage(message.content)}>
                                          <Copy className="w-4 h-4 mr-2" />
                                          Sao chép tin nhắn
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => handlePinMessage(message.id)}>
                                          <Pin className="w-4 h-4 mr-2" />
                                          {pinnedMessages.has(message.id) ? 'Bỏ ghim tin nhắn' : 'Ghim tin nhắn'}
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => {
                                          setIsSelectMode(true)
                                          handleSelectMessage(message.id)
                                        }}>
                                          <CheckSquare className="w-4 h-4 mr-2" />
                                          Chọn nhiều tin nhắn
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => handleCreateReminder(message)}>
                                          <Bell className="w-4 h-4 mr-2" />
                                          Tạo nhắc hẹn
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => handleDeleteMessageForMe(message.id)} className="text-red-600">
                                          <Trash2 className="w-4 h-4 mr-2" />
                                          Xóa tin nhắn phía tôi
                                        </DropdownMenuItem>
                                      </DropdownMenuContent>
                                    </DropdownMenu>
                                  </div>
                                )}
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
              <div className={cn(
                "border-t border-gray-200 bg-white transition-all duration-300",
                isInputExpanded ? "flex-1 flex flex-col min-h-0" : "flex-shrink-0"
              )}>
                {/* Hidden file inputs */}
                <input
                  type="file"
                  ref={imageInputRef}
                  onChange={handleImageSelect}
                  accept="image/*"
                  multiple
                  className="hidden"
                />
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                  multiple
                  className="hidden"
                />

                {/* Selection Mode Actions */}
                {isSelectMode && (
                  <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-200">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">
                        Đã chọn {selectedMessageIds.length} tin nhắn
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleBulkCopy}
                        disabled={selectedMessageIds.length === 0}
                        className="h-8 text-xs"
                      >
                        <Copy className="w-4 h-4 mr-1" />
                        Sao chép
                      </Button>
                      {/* <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {}}
                        disabled={selectedMessageIds.length === 0}
                        className="h-8 text-xs"
                      >
                        <Forward className="w-4 h-4 mr-1" />
                        Chia sẻ
                      </Button> */}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleBulkRecall}
                        disabled={selectedMessageIds.length === 0}
                        className="h-8 text-xs text-orange-600 hover:text-orange-700"
                      >
                        <Undo2 className="w-4 h-4 mr-1" />
                        Thu hồi
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleBulkDelete}
                        disabled={selectedMessageIds.length === 0}
                        className="h-8 text-xs text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Xóa
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={cancelSelectMode}
                        className="h-8 text-xs"
                      >
                        Hủy
                      </Button>
                    </div>
                  </div>
                )}

                {/* Message Writer Container */}
                <div className={cn("p-3", isInputExpanded && "flex-1 flex flex-col min-h-0", isSelectMode && "hidden")}>
                  {/* Expanded Header */}
                  {isInputExpanded && (
                    <div className="flex items-center justify-between mb-2 pb-2 border-b border-gray-200">
                      <span className="text-sm font-medium text-gray-700">Soạn tin nhắn</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={toggleInputExpansion}
                        className="h-8 w-8 p-0 hover:bg-gray-100"
                        title="Thu nhỏ"
                      >
                        <X className="w-4 h-4 text-gray-600" />
                      </Button>
                    </div>
                  )}

                  {/* Input Chat Box Container */}
                  <div className={cn(
                    "border border-gray-200 rounded-lg bg-white",
                    isInputExpanded && "flex-1 flex flex-col min-h-0"
                  )}>
                    {/* Reply/Forward Preview */}
                    {(replyingToMessage || forwardingMessage) && (
                      <div className="flex items-start gap-2 p-3 bg-gray-50 border-b border-gray-200 rounded-t-lg">
                        <div className="flex-shrink-0 mt-0.5">
                          {replyingToMessage ? (
                            <Reply className="w-4 h-4 text-blue-500" />
                          ) : (
                            <Forward className="w-4 h-4 text-blue-500" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0 border-l-2 border-blue-400 pl-2">
                          <div className="flex items-center gap-1 text-xs font-medium text-blue-600">
                            {replyingToMessage ? (
                              <>Trả lời {replyingToMessage.sender.name}</>
                            ) : (
                              <>Chuyển tiếp tin nhắn</>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 truncate">
                            {replyingToMessage?.content || forwardingMessage?.content}
                          </p>
                        </div>
                        <button
                          onClick={cancelReplyOrForward}
                          className="flex-shrink-0 p-1 rounded-full hover:bg-gray-200 text-gray-500 hover:text-gray-700"
                          title="Hủy"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    )}

                    {/* Attachments Preview */}
                    {(selectedImages.length > 0 || selectedFiles.length > 0) && (
                      <div className="p-2 border-b border-gray-100">
                        {/* Image Previews */}
                        {selectedImages.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-2">
                            {imagePreviewUrls.map((url, index) => (
                              <div key={index} className="relative group">
                                <img
                                  src={url}
                                  alt={`Preview ${index + 1}`}
                                  className="w-16 h-16 object-cover rounded-lg border border-gray-200"
                                />
                                <button
                                  onClick={() => removeSelectedImage(index)}
                                  className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                        {/* File Previews */}
                        {selectedFiles.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {selectedFiles.map((file, index) => (
                              <div key={index} className="flex items-center gap-2 px-2 py-1 bg-gray-100 rounded-lg group">
                                <Paperclip className="w-3 h-3 text-gray-500" />
                                <span className="text-xs text-gray-700 max-w-[100px] truncate">{file.name}</span>
                                <button
                                  onClick={() => removeSelectedFile(index)}
                                  className="w-4 h-4 text-gray-400 hover:text-red-500 transition-colors"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Large Textarea Editor Area */}
                    <div className={cn(
                      "overflow-y-auto",
                      isInputExpanded ? "flex-1 min-h-0" : "min-h-[100px] max-h-[200px]"
                    )}>
                      <Textarea
                        placeholder="Nhập tin nhắn..."
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                        onKeyDown={handleKeyPress}
                        className={cn(
                          "w-full resize-none border-0 focus-visible:ring-0 text-sm p-3",
                          isInputExpanded ? "h-full min-h-full" : "min-h-[100px]"
                        )}
                        rows={isInputExpanded ? 15 : 4}
                      />
                    </div>

                    {/* Action Buttons Row */}
                    <div className="flex items-center justify-between border-t border-gray-200 px-2 py-2">
                      {/* Left Actions */}
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className={cn(
                            "h-8 w-8 p-0 hover:bg-gray-50",
                            selectedImages.length > 0 && "bg-blue-50 text-blue-600"
                          )}
                          title="Gửi hình ảnh"
                          onClick={() => imageInputRef.current?.click()}
                        >
                          <ImageIcon className={cn(
                            "w-4 h-4",
                            selectedImages.length > 0 ? "text-blue-600" : "text-gray-600"
                          )} />
                        </Button>

                        <Button
                          variant="ghost"
                          size="sm"
                          className={cn(
                            "h-8 w-8 p-0 hover:bg-gray-50",
                            selectedFiles.length > 0 && "bg-blue-50 text-blue-600"
                          )}
                          title="Tải lên tệp"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          <svg className={cn(
                            "w-4 h-4",
                            selectedFiles.length > 0 ? "text-blue-600" : "text-gray-600"
                          )} fill="currentColor" viewBox="64 64 896 896">
                            <path d="M400 317.7h73.9V656c0 4.4 3.6 8 8 8h60c4.4 0 8-3.6 8-8V317.7H624c6.7 0 10.4-7.7 6.3-12.9L518.3 163a8 8 0 00-12.6 0l-112 141.7c-4.1 5.3-.4 13 6.3 13zM878 626h-60c-4.4 0-8 3.6-8 8v154H214V634c0-4.4-3.6-8-8-8h-60c-4.4 0-8 3.6-8 8v198c0 17.7 14.3 32 32 32h684c17.7 0 32-14.3 32-32V634c0-4.4-3.6-8-8-8z" />
                          </svg>
                        </Button>

                        <Button
                          variant="ghost"
                          size="sm"
                          className={cn(
                            "h-8 w-8 p-0 hover:bg-gray-50",
                            isInputExpanded && "bg-blue-50"
                          )}
                          title={isInputExpanded ? "Thu nhỏ" : "Mở rộng"}
                          onClick={toggleInputExpansion}
                        >
                          {isInputExpanded ? (
                            <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="64 64 896 896">
                              <path d="M881 442.4H519.7v-148c0-4.4-3.6-8-8-8h-60c-4.4 0-8 3.6-8 8v148H92c-4.4 0-8 3.6-8 8v60c0 4.4 3.6 8 8 8h351.7v148c0 4.4 3.6 8 8 8h60c4.4 0 8-3.6 8-8v-148H881c4.4 0 8-3.6 8-8v-60c0-4.4-3.6-8-8-8zM319.5 650.3L136 827.9l-0.1-141.4c0-4.4-3.6-8-8-8h-60c-4.4 0-8 3.6-8 8v232c0.1 6 4.4 11.8 10 13.4l0.4 0.1c1.6 0.4 3.2 0.5 4.8 0.5h232c4.4 0 8-3.6 8-8v-60c0-4.4-3.6-8-8-8H165.9l183.5-177.6c3.1-3 3.2-8 0.2-11.2l-42.4-43.4c-3.1-3.2-8.2-3.2-11.3-0.2l0 0zM703.5 373.7L887 196.1l0.1 141.4c0 4.4 3.6 8 8 8h60c4.4 0 8-3.6 8-8v-232c-0.1-6-4.4-11.8-10-13.4l-0.4-0.1c-1.6-0.4-3.2-0.5-4.8-0.5h-232c-4.4 0-8 3.6-8 8v60c0 4.4 3.6 8 8 8h141.1L674.3 337.5c-3.1 3-3.2 8-0.2 11.2l42.4 43.4c3.1 3.2 8.2 3.2 11.3 0.2l0 0z" />
                            </svg>
                          ) : (
                            <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="64 64 896 896">
                              <path d="M855 160.1l-189.2 23.5c-6.6.8-9.3 8.8-4.7 13.5l54.7 54.7-153.5 153.5a8.03 8.03 0 000 11.3l45.1 45.1c3.1 3.1 8.2 3.1 11.3 0l153.6-153.6 54.7 54.7a7.94 7.94 0 0013.5-4.7L863.9 169a7.9 7.9 0 00-8.9-8.9zM416.6 562.3a8.03 8.03 0 00-11.3 0L251.8 715.9l-54.7-54.7a7.94 7.94 0 00-13.5 4.7L160.1 855c-.6 5.2 3.7 9.5 8.9 8.9l189.2-23.5c6.6-.8 9.3-8.8 4.7-13.5l-54.7-54.7 153.6-153.6c3.1-3.1 3.1-8.2 0-11.3l-45.2-45z" />
                            </svg>
                          )}
                        </Button>

                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 hover:bg-gray-50"
                          title="Tạo nhắc hẹn"
                          onClick={() => handleCreateReminder()}
                        >
                          <Bell className="w-4 h-4 text-gray-600" />
                        </Button>
                      </div>

                      {/* Right Actions */}
                      <div className="flex items-center gap-2">
                        {/* Clear attachments button */}
                        {(selectedImages.length > 0 || selectedFiles.length > 0) && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={clearAttachments}
                            className="h-8 px-2 text-xs text-gray-500 hover:text-red-500"
                            title="Xóa tất cả đính kèm"
                          >
                            <Trash2 className="w-3 h-3 mr-1" />
                            Xóa đính kèm
                          </Button>
                        )}

                        <Button
                          onClick={handleSendMessage}
                          disabled={!messageInput.trim() && selectedImages.length === 0 && selectedFiles.length === 0}
                          className="h-8 px-3 bg-blue-500 hover:bg-blue-600 text-white text-xs rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
                  "px-4 py-2 text-sm font-medium border-b-2 transition-colors",
                  rightPanelTab === 'zalo'
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                )}
              >
                {selectedChannel === 'facebook' ? 'Facebook' : 'Zalo'}
              </button>
              {/* Only show Community tab for Zalo Personal groups */}
              {selectedConversation.conversationType === 'group' && selectedChannel === 'zalo-personal' ? (
                <button
                  onClick={() => setRightPanelTab('community')}
                  className={cn(
                    "px-4 py-2 text-sm font-medium border-b-2 transition-colors",
                    rightPanelTab === 'community'
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  )}
                >
                  Thông tin cộng đồng
                </button>
              ) : (
                <button
                  onClick={() => setRightPanelTab('sync')}
                  className={cn(
                    "px-4 py-2 text-sm font-medium border-b-2 transition-colors",
                    rightPanelTab === 'sync'
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  )}
                >
                  Đồng bộ
                </button>
              )}
              <button
                onClick={() => setRightPanelTab('files')}
                className={cn(
                  "px-4 py-2 text-sm font-medium border-b-2 transition-colors",
                  rightPanelTab === 'files'
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                )}
              >
                File chia sẻ
              </button>
            </div>

            {/* Tab Content: Zalo */}
            {rightPanelTab === 'zalo' && (
              <>
                {selectedConversation.conversationType === 'group' ? (
                  /* Community Info for Group Chats */
                  <>
                    {/* Community Header with Banner */}
                    <div className="flex-shrink-0 bg-white">
                      {/* Banner */}
                      <div className="h-24 bg-gradient-to-r from-blue-500 to-indigo-500 relative">
                        {/* Avatar overlapping banner */}
                        <div className="absolute -bottom-10 left-4 z-10">
                          <Avatar className="w-20 h-20 border-4 border-white shadow-md">
                            <AvatarImage src={selectedConversation.contact.avatar} />
                            <AvatarFallback className="bg-blue-500 text-white text-base">
                              {selectedConversation.contact.name.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                        </div>
                      </div>

                      {/* Info section */}
                      <div className="pt-12 px-4 pb-4 border-b border-gray-200">
                        <h3 className="font-semibold text-base text-gray-900">{selectedConversation.contact.name}</h3>
                        <p className="text-sm text-gray-500">{demoGroupMembers.length} thành viên</p>
                      </div>
                    </div>

                    {/* Community Info Content */}
                    <ScrollArea className="flex-1">
                      <div className="p-4 space-y-4">
                        {/* Basic Info */}
                        <div>
                          <h4 className="font-semibold text-sm mb-3 text-gray-700">Thông tin cộng đồng</h4>
                          <div className="space-y-2.5 text-sm">
                            <div className="flex items-start gap-2">
                              <User className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                              <div className="flex-1">
                                <span className="text-gray-500 text-xs">Tên nhóm:</span>
                                <p className="text-gray-900 font-medium">{selectedConversation.contact.name}</p>
                              </div>
                            </div>
                            <div className="flex items-start gap-2">
                              <User className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                              <div className="flex-1">
                                <span className="text-gray-500 text-xs">Số thành viên:</span>
                                <p className="text-gray-900 font-medium">{demoGroupMembers.length} người</p>
                              </div>
                            </div>
                            <div className="flex items-start gap-2">
                              <ClockIcon className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                              <div className="flex-1">
                                <span className="text-gray-500 text-xs">Ngày tạo:</span>
                                <p className="text-gray-900 font-medium">
                                  {new Date(selectedConversation.contact.firstContactedAt).toLocaleDateString('vi-VN')}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </ScrollArea>
                  </>
                ) : (
                  /* Personal Contact Info */
                  <>
                    {/* Contact Profile Header with Banner */}
                    <div className="flex-shrink-0 bg-white">
                      {/* Banner */}
                      <div className="h-24 bg-gradient-to-r from-blue-500 to-indigo-500 relative">
                        {/* Avatar overlapping banner */}
                        <div className="absolute -bottom-10 left-4 z-10">
                          <Avatar className="w-20 h-20 border-4 border-white shadow-md">
                            <AvatarImage src={selectedConversation.contact.avatar} />
                            <AvatarFallback className="bg-blue-500 text-white text-base">
                              {selectedConversation.contact.name.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                        </div>
                      </div>

                      {/* Info section */}
                      <div className="pt-12 px-4 pb-4 border-b border-gray-200">
                        <h3 className="font-semibold text-base text-gray-900">{selectedConversation.contact.name}</h3>
                        <p className="text-sm text-gray-500">{selectedConversation.contact.company}</p>
                      </div>
                    </div>

            {/* Information Tabs */}
            <Tabs defaultValue="info" className="flex-1 flex flex-col">
              <TabsContent value="info" className="flex-1 overflow-y-auto p-4 mt-0">
                <div className="space-y-4">
                  {/* Contact Information */}
                  <div>
                    <h4 className="font-semibold text-sm mb-3 text-gray-700">Thông tin liên hệ</h4>
                    <div className="space-y-2.5 text-sm">
                      {selectedChannel === 'facebook' ? (
                        <div className="flex items-center gap-2 text-gray-600">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          <span>{selectedConversation.contact.location || 'Chưa có'}</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-gray-600">
                          <Phone className="w-4 h-4 text-gray-400" />
                          <span>{selectedConversation.contact.phone || 'Chưa có'}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-gray-600">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <span className="truncate">{selectedConversation.contact.email || 'Chưa có'}</span>
                      </div>
                      {selectedChannel !== 'facebook' && (
                        <div className="flex items-center gap-2 text-gray-600">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          <span>{selectedConversation.contact.location || 'Chưa có'}</span>
                        </div>
                      )}
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

                  {/* Tags - Only show when synced with CRM */}
                  {(() => {
                    const connectionInfo = conversationCustomerMap.get(selectedConversation.id)
                    const connectedCustomerId = connectionInfo?.customerId
                    const syncedCustomer = syncedCustomers.get(selectedConversation.id)
                    const crmCustomer = syncedCustomer || (connectedCustomerId 
                      ? demoCRMCustomers.find(c => c.id === connectedCustomerId)
                      : null)
                    
                    if (crmCustomer && crmCustomer.tags && crmCustomer.tags.length > 0) {
                      return (
                        <div className="pt-3 border-t border-gray-100">
                          <h4 className="font-semibold text-sm mb-3 text-gray-700">Tags</h4>
                          <div className="flex flex-wrap gap-2">
                            {crmCustomer.tags.map((tag: string, idx: number) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )
                    }
                    return null
                  })()}
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
              </>
            )}

            {/* Tab Content: Đồng bộ CRM */}
            {rightPanelTab === 'sync' && (
              <>
                {(() => {
                  const connectionInfo = conversationCustomerMap.get(selectedConversation.id)
                  const connectedCustomerId = connectionInfo?.customerId
                  
                  // Check if we have a synced customer for this specific conversation
                  const syncedCustomer = syncedCustomers.get(selectedConversation.id)
                  
                  // First check for newly synced customer, then check existing connected customer
                  const customerToShow = syncedCustomer || (connectedCustomerId 
                    ? demoCRMCustomers.find(c => c.id === connectedCustomerId)
                    : null)

                  // Get connection count for this customer if connected
                  const connectionCount = customerToShow ? customerConnectionCount.get(customerToShow.id) : null

                  if (customerToShow) {
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
                                {connectionCount && connectionCount.total > 0 && (
                                  <div className="flex gap-2 mt-2 flex-wrap">
                                    {connectionCount['zalo-personal'] > 0 && (
                                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-blue-100 text-blue-700 text-xs font-medium">
                                        <span className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center text-white text-[10px] font-bold">ZL</span>
                                        {connectionCount['zalo-personal']} Zalo
                                      </span>
                                    )}
                                    {connectionCount['zalo-oa'] > 0 && (
                                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-blue-100 text-blue-700 text-xs font-medium">
                                        <span className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center text-white text-[10px] font-bold">OA</span>
                                        {connectionCount['zalo-oa']} Zalo OA
                                      </span>
                                    )}
                                    {connectionCount['facebook'] > 0 && (
                                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-blue-100 text-blue-700 text-xs font-medium">
                                        <span className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center text-white text-[10px] font-bold">FB</span>
                                        {connectionCount['facebook']} Facebook
                                      </span>
                                    )}
                                  </div>
                                )}
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
                                    <AvatarImage src={customerToShow.avatar} />
                                    <AvatarFallback className="bg-blue-500 text-white text-base">
                                      {customerToShow.name.substring(0, 2).toUpperCase()}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div className="flex-1 min-w-0">
                                    <h3 className="font-semibold text-base text-gray-900 mb-1">
                                      {customerToShow.name}
                                    </h3>
                                    <div className="flex items-center gap-2 flex-wrap">
                                      <Badge className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 border-blue-300">
                                        Lead
                                      </Badge>
                                      <Badge className="text-xs py-0 h-5 cursor-pointer hover:opacity-80 transition-opacity whitespace-nowrap bg-gray-100 text-gray-700">
                                        <Tag className="w-3 h-3 mr-1" />
                                        Lead mới
                                      </Badge>
                                    </div>
                                  </div>
                                </div>

                                {/* Contact Info */}
                                <div className="space-y-3 mb-4">
                                  <div className="flex items-center gap-2 text-sm">
                                    <Phone className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                    <span className="text-gray-600">Điện thoại:</span>
                                    <span className="font-medium text-gray-900">{customerToShow.phone}</span>
                                  </div>
                                  {customerToShow.email && (
                                    <div className="flex items-center gap-2 text-sm">
                                      <Mail className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                      <span className="text-gray-600">Email:</span>
                                      <span className="font-medium text-gray-900 truncate">{customerToShow.email}</span>
                                    </div>
                                  )}
                                  {customerToShow.company && (
                                    <div className="flex items-center gap-2 text-sm">
                                      <Building2 className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                      <span className="text-gray-600">Công ty:</span>
                                      <span className="font-medium text-gray-900 truncate">{customerToShow.company}</span>
                                    </div>
                                  )}
                                </div>

                                {/* Tags */}
                                {customerToShow.tags && customerToShow.tags.length > 0 && (
                                  <div className="mb-4">
                                    <div className="flex flex-wrap gap-1.5">
                                      {customerToShow.tags.map((tag: string, idx: number) => (
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
                                    <span className="font-medium text-gray-900">{customerToShow.source}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">Ngày tạo:</span>
                                    <span className="font-medium text-gray-900">
                                      {new Date(customerToShow.createdAt).toLocaleDateString('vi-VN')}
                                    </span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">Liên hệ cuối:</span>
                                    <span className="font-medium text-gray-900">
                                      {new Date(customerToShow.lastContactedAt).toLocaleDateString('vi-VN')}
                                    </span>
                                  </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button 
                                        size="sm" 
                                        className="flex-1 text-xs"
                                      >
                                        <Zap className="w-4 h-4 mr-1" />
                                        Thao tác nhanh
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="start" className="w-48">
                                      <DropdownMenuItem onClick={() => setSelectedLeadDetail(customerToShow)}>
                                        <Eye className="w-4 h-4 mr-2" />
                                        Xem chi tiết
                                      </DropdownMenuItem>
                                      <DropdownMenuItem onClick={() => {
                                        setSelectedLeadForQuickAction(customerToShow)
                                        setQuickStatusValue(customerToShow.status)
                                        setShowQuickStatusModal(true)
                                      }}>
                                        <ArrowRightLeft className="w-4 h-4 mr-2" />
                                        Chuyển trạng thái
                                      </DropdownMenuItem>
                                      <DropdownMenuItem onClick={() => {
                                        setSelectedLeadForQuickAction(customerToShow)
                                        setShowQuickTaskModal(true)
                                      }}>
                                        <ListTodo className="w-4 h-4 mr-2" />
                                        Tạo task nhanh
                                      </DropdownMenuItem>
                                      <DropdownMenuItem onClick={() => {
                                        setSelectedLeadForQuickAction(customerToShow)
                                        setShowQuickNoteModal(true)
                                      }}>
                                        <StickyNote className="w-4 h-4 mr-2" />
                                        Thêm ghi chú
                                      </DropdownMenuItem>
                                      <DropdownMenuItem onClick={() => {
                                        setSelectedLeadForQuickAction(customerToShow)
                                        setShowQuickOrderModal(true)
                                      }}>
                                        <ShoppingCart className="w-4 h-4 mr-2" />
                                        Tạo đơn hàng
                                      </DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button size="sm" variant="outline" className="px-3">
                                        <MoreVertical className="w-4 h-4" />
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-56">
                                      {connectionCount && connectionCount.total > 1 ? (
                                        <>
                                          <div className="px-2 py-1.5 text-xs font-semibold text-gray-500">
                                            Quản lý kết nối ({connectionCount.total})
                                          </div>
                                          {Array.from(conversationCustomerMap.entries())
                                            .filter(([_, conn]) => conn.customerId === customerToShow.id)
                                            .map(([convId, conn]) => (
                                              <DropdownMenuItem
                                                key={convId}
                                                onClick={() => {
                                                  // Only disconnect this specific conversation
                                                  const newConvMap = new Map(conversationCustomerMap)
                                                  newConvMap.delete(convId)
                                                  setConversationCustomerMap(newConvMap)
                                                  
                                                  // Update customer connection count
                                                  setCustomerConnectionCount(prev => {
                                                    const newMap = new Map(prev)
                                                    const current = newMap.get(customerToShow.id)
                                                    if (current) {
                                                      const updated = {
                                                        ...current,
                                                        [conn.platform]: Math.max(0, current[conn.platform] - 1),
                                                        total: Math.max(0, current.total - 1)
                                                      }
                                                      if (updated.total === 0) {
                                                        newMap.delete(customerToShow.id)
                                                        setConnectedCustomers(prev => {
                                                          const newSet = new Set(prev)
                                                          newSet.delete(customerToShow.id)
                                                          return newSet
                                                        })
                                                      } else {
                                                        newMap.set(customerToShow.id, updated)
                                                      }
                                                    }
                                                    return newMap
                                                  })
                                                  
                                                  // If disconnecting current conversation, also remove from syncedCustomers
                                                  if (convId === selectedConversation.id) {
                                                    setSyncedCustomers(prev => {
                                                      const newMap = new Map(prev)
                                                      newMap.delete(convId)
                                                      return newMap
                                                    })
                                                  }
                                                }}
                                                className="text-xs"
                                              >
                                                <div className="flex items-center gap-2 w-full">
                                                  <span className={cn(
                                                    "w-5 h-5 rounded-full flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0",
                                                    conn.platform === 'zalo-personal' ? "bg-blue-600" :
                                                    conn.platform === 'zalo-oa' ? "bg-blue-500" : "bg-blue-600"
                                                  )}>
                                                    {conn.platform === 'zalo-personal' ? 'ZL' : 
                                                     conn.platform === 'zalo-oa' ? 'OA' : 'FB'}
                                                  </span>
                                                  <span className="flex-1 truncate">{conn.accountName}</span>
                                                  <X className="w-3 h-3 text-red-600 flex-shrink-0" />
                                                </div>
                                              </DropdownMenuItem>
                                            ))
                                          }
                                        </>
                                      ) : (
                                        <DropdownMenuItem onClick={() => {
                                          if (selectedConversation && connectionInfo) {
                                            // Remove from syncedCustomers Map
                                            const newSyncedMap = new Map(syncedCustomers)
                                            newSyncedMap.delete(selectedConversation.id)
                                            setSyncedCustomers(newSyncedMap)
                                            
                                            // Remove from conversationCustomerMap
                                            const newConvMap = new Map(conversationCustomerMap)
                                            newConvMap.delete(selectedConversation.id)
                                            setConversationCustomerMap(newConvMap)
                                            
                                            // Update customer connection count
                                            setCustomerConnectionCount(prev => {
                                              const newMap = new Map(prev)
                                              const current = newMap.get(customerToShow.id)
                                              if (current) {
                                                const updated = {
                                                  ...current,
                                                  [connectionInfo.platform]: Math.max(0, current[connectionInfo.platform] - 1),
                                                  total: Math.max(0, current.total - 1)
                                                }
                                                if (updated.total === 0) {
                                                  newMap.delete(customerToShow.id)
                                                  setConnectedCustomers(prev => {
                                                    const newSet = new Set(prev)
                                                    newSet.delete(customerToShow.id)
                                                    return newSet
                                                  })
                                                } else {
                                                  newMap.set(customerToShow.id, updated)
                                                }
                                              }
                                              return newMap
                                            })
                                          }
                                        }}>
                                          <X className="w-4 h-4 mr-2" />
                                          Ngắt kết nối
                                        </DropdownMenuItem>
                                      )}
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
                        <Button variant="outline" size="sm" className="text-xs h-8 px-3" onClick={() => setShowCreateLeadModal(true)}>
                          Thêm mới
                        </Button>
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
                                    {(() => {
                                      const currentConnectionInfo = conversationCustomerMap.get(selectedConversation.id)
                                      const isThisConversationConnected = currentConnectionInfo?.customerId === customer.id
                                      const customerConnCount = customerConnectionCount.get(customer.id)
                                      const hasOtherConnections = connectedCustomers.has(customer.id) && !isThisConversationConnected
                                      const hasConnectionInCurrentPlatform = checkExistingConnectionInSamePlatform(customer.id, selectedChannel)

                                      if (isThisConversationConnected) {
                                        // This specific conversation is connected to this customer
                                        return (
                                          <div className="flex flex-col items-end gap-2 flex-shrink-0">
                                            <div className="flex items-center gap-1 bg-green-50 px-3 py-1.5 rounded-lg">
                                              <Check className="w-4 h-4 text-green-600" />
                                              <span className="text-xs font-medium text-green-700">Đã kết nối</span>
                                            </div>
                                            {customerConnCount && customerConnCount.total > 1 && (
                                              <div className="flex gap-1">
                                                {customerConnCount['zalo-personal'] > 0 && (
                                                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 font-medium">
                                                    {customerConnCount['zalo-personal']}ZL
                                                  </span>
                                                )}
                                                {customerConnCount['zalo-oa'] > 0 && (
                                                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 font-medium">
                                                    {customerConnCount['zalo-oa']}OA
                                                  </span>
                                                )}
                                                {customerConnCount['facebook'] > 0 && (
                                                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 font-medium">
                                                    {customerConnCount['facebook']}FB
                                                  </span>
                                                )}
                                              </div>
                                            )}
                                            <DropdownMenu>
                                              <DropdownMenuTrigger asChild>
                                                <Button size="sm" className="h-8 text-xs">
                                                  Thao tác nhanh
                                                </Button>
                                              </DropdownMenuTrigger>
                                              <DropdownMenuContent align="end" className="w-48">
                                                <DropdownMenuItem onClick={() => setSelectedLeadDetail(customer)}>
                                                  <Eye className="w-4 h-4 mr-2" />
                                                  Xem chi tiết
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => {
                                                  setSelectedLeadForQuickAction(customer)
                                                  setQuickStatusValue(customer.status)
                                                  setShowQuickStatusModal(true)
                                                }}>
                                                  <ArrowRightLeft className="w-4 h-4 mr-2" />
                                                  Chuyển trạng thái
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => {
                                                  setSelectedLeadForQuickAction(customer)
                                                  setShowQuickTaskModal(true)
                                                }}>
                                                  <ListTodo className="w-4 h-4 mr-2" />
                                                  Tạo task nhanh
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => {
                                                  setSelectedLeadForQuickAction(customer)
                                                  setShowQuickNoteModal(true)
                                                }}>
                                                  <StickyNote className="w-4 h-4 mr-2" />
                                                  Thêm ghi chú
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => {
                                                  setSelectedLeadForQuickAction(customer)
                                                  setShowQuickOrderModal(true)
                                                }}>
                                                  <ShoppingCart className="w-4 h-4 mr-2" />
                                                  Tạo đơn hàng
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => {
                                                  if (selectedConversation && currentConnectionInfo) {
                                                    // Remove this specific conversation connection
                                                    const newConvMap = new Map(conversationCustomerMap)
                                                    newConvMap.delete(selectedConversation.id)
                                                    setConversationCustomerMap(newConvMap)
                                                    
                                                    // Remove from syncedCustomers Map
                                                    const newSyncedMap = new Map(syncedCustomers)
                                                    newSyncedMap.delete(selectedConversation.id)
                                                    setSyncedCustomers(newSyncedMap)
                                                    
                                                    // Update customer connection count
                                                    setCustomerConnectionCount(prev => {
                                                      const newMap = new Map(prev)
                                                      const current = newMap.get(customer.id)
                                                      if (current) {
                                                        const updated = {
                                                          ...current,
                                                          [currentConnectionInfo.platform]: Math.max(0, current[currentConnectionInfo.platform] - 1),
                                                          total: Math.max(0, current.total - 1)
                                                        }
                                                        if (updated.total === 0) {
                                                          newMap.delete(customer.id)
                                                          setConnectedCustomers(prev => {
                                                            const newSet = new Set(prev)
                                                            newSet.delete(customer.id)
                                                            return newSet
                                                          })
                                                        } else {
                                                          newMap.set(customer.id, updated)
                                                        }
                                                      }
                                                      return newMap
                                                    })
                                                  }
                                                }}>
                                                  <X className="w-4 h-4 mr-2" />
                                                  Hủy liên kết
                                                </DropdownMenuItem>
                                              </DropdownMenuContent>
                                            </DropdownMenu>
                                          </div>
                                        )
                                      } else if (hasConnectionInCurrentPlatform) {
                                        // Customer already has a connection in the same platform - show "Already Connected" state
                                        const platformName = selectedChannel === 'zalo-personal' ? 'Zalo' :
                                                            selectedChannel === 'zalo-oa' ? 'Zalo OA' : 'Facebook'
                                        return (
                                          <div className="flex flex-col items-end gap-2 flex-shrink-0">
                                            {customerConnCount && (
                                              <div className="flex gap-1">
                                                {customerConnCount['zalo-personal'] > 0 && (
                                                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-100 text-gray-700 font-medium">
                                                    {customerConnCount['zalo-personal']}ZL
                                                  </span>
                                                )}
                                                {customerConnCount['zalo-oa'] > 0 && (
                                                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-100 text-gray-700 font-medium">
                                                    {customerConnCount['zalo-oa']}OA
                                                  </span>
                                                )}
                                                {customerConnCount['facebook'] > 0 && (
                                                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-100 text-gray-700 font-medium">
                                                    {customerConnCount['facebook']}FB
                                                  </span>
                                                )}
                                              </div>
                                            )}
                                            <div className="flex items-center gap-1 bg-yellow-50 px-3 py-1.5 rounded-lg">
                                              <AlertTriangle className="w-4 h-4 text-yellow-600" />
                                              <span className="text-xs font-medium text-yellow-700">Đã kết nối</span>
                                            </div>
                                            <DropdownMenu>
                                              <DropdownMenuTrigger asChild>
                                                <Button size="sm" variant="outline" className="h-8 text-xs">
                                                  Thao tác nhanh
                                                </Button>
                                              </DropdownMenuTrigger>
                                              <DropdownMenuContent align="end" className="w-48">
                                                <DropdownMenuItem onClick={() => setSelectedLeadDetail(customer)}>
                                                  <Eye className="w-4 h-4 mr-2" />
                                                  Xem chi tiết
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => {
                                                  setSelectedLeadForQuickAction(customer)
                                                  setQuickStatusValue(customer.status)
                                                  setShowQuickStatusModal(true)
                                                }}>
                                                  <ArrowRightLeft className="w-4 h-4 mr-2" />
                                                  Chuyển trạng thái
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => {
                                                  setSelectedLeadForQuickAction(customer)
                                                  setShowQuickTaskModal(true)
                                                }}>
                                                  <ListTodo className="w-4 h-4 mr-2" />
                                                  Tạo task nhanh
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => {
                                                  setSelectedLeadForQuickAction(customer)
                                                  setShowQuickNoteModal(true)
                                                }}>
                                                  <StickyNote className="w-4 h-4 mr-2" />
                                                  Thêm ghi chú
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => {
                                                  setSelectedLeadForQuickAction(customer)
                                                  setShowQuickOrderModal(true)
                                                }}>
                                                  <ShoppingCart className="w-4 h-4 mr-2" />
                                                  Tạo đơn hàng
                                                </DropdownMenuItem>
                                              </DropdownMenuContent>
                                            </DropdownMenu>
                                          </div>
                                        )
                                      } else if (hasOtherConnections) {
                                        // Customer is connected to other platforms (not current one), show connection info + allow linking
                                        return (
                                          <div className="flex flex-col items-end gap-2 flex-shrink-0">
                                            {customerConnCount && (
                                              <div className="flex gap-1">
                                                {customerConnCount['zalo-personal'] > 0 && (
                                                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-100 text-gray-700 font-medium">
                                                    {customerConnCount['zalo-personal']}ZL
                                                  </span>
                                                )}
                                                {customerConnCount['zalo-oa'] > 0 && (
                                                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-100 text-gray-700 font-medium">
                                                    {customerConnCount['zalo-oa']}OA
                                                  </span>
                                                )}
                                                {customerConnCount['facebook'] > 0 && (
                                                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-100 text-gray-700 font-medium">
                                                    {customerConnCount['facebook']}FB
                                                  </span>
                                                )}
                                              </div>
                                            )}
                                            <Button 
                                              size="sm" 
                                              className="h-8 text-xs px-3 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors"
                                              onClick={() => {
                                                const newConnected = new Set(connectedCustomers)
                                                newConnected.add(customer.id)
                                                setConnectedCustomers(newConnected)
                                                
                                                const connectionInfo: ConversationConnection = {
                                                  customerId: customer.id,
                                                  platform: selectedChannel,
                                                  accountId: selectedAccount.id,
                                                  accountName: selectedAccount.name,
                                                  connectedAt: new Date().toISOString()
                                                }
                                                
                                                const newMap = new Map(conversationCustomerMap)
                                                newMap.set(selectedConversation.id, connectionInfo)
                                                setConversationCustomerMap(newMap)
                                                
                                                // Update customer connection count
                                                setCustomerConnectionCount(prev => {
                                                  const newMap = new Map(prev)
                                                  const current = newMap.get(customer.id) || {
                                                    'zalo-personal': 0,
                                                    'zalo-oa': 0,
                                                    'facebook': 0,
                                                    total: 0
                                                  }
                                                  const updated = {
                                                    ...current,
                                                    [selectedChannel]: current[selectedChannel] + 1,
                                                    total: current.total + 1
                                                  }
                                                  newMap.set(customer.id, updated)
                                                  return newMap
                                                })
                                              }}
                                            >
                                              Liên kết
                                            </Button>
                                          </div>
                                        )
                                      } else {
                                        // Not connected at all
                                        return (
                                          <Button 
                                            size="sm" 
                                            className="h-8 text-xs px-3 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors flex-shrink-0"
                                            onClick={() => {
                                              const newConnected = new Set(connectedCustomers)
                                              newConnected.add(customer.id)
                                              setConnectedCustomers(newConnected)
                                              
                                              const connectionInfo: ConversationConnection = {
                                                customerId: customer.id,
                                                platform: selectedChannel,
                                                accountId: selectedAccount.id,
                                                accountName: selectedAccount.name,
                                                connectedAt: new Date().toISOString()
                                              }
                                              
                                              const newMap = new Map(conversationCustomerMap)
                                              newMap.set(selectedConversation.id, connectionInfo)
                                              setConversationCustomerMap(newMap)
                                              
                                              // Initialize customer connection count
                                              setCustomerConnectionCount(prev => {
                                                const newMap = new Map(prev)
                                                newMap.set(customer.id, {
                                                  'zalo-personal': selectedChannel === 'zalo-personal' ? 1 : 0,
                                                  'zalo-oa': selectedChannel === 'zalo-oa' ? 1 : 0,
                                                  'facebook': selectedChannel === 'facebook' ? 1 : 0,
                                                  total: 1
                                                })
                                                return newMap
                                              })
                                            }}
                                          >
                                            Liên kết
                                          </Button>
                                        )
                                      }
                                    })()}
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
            {/* Only show for Zalo Personal groups */}
            {rightPanelTab === 'community' && selectedConversation.conversationType === 'group' && selectedChannel === 'zalo-personal' && (
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
                                        <DropdownMenuItem 
                                          className="cursor-pointer"
                                          onClick={() => {
                                            setSelectedMemberForRequest(member)
                                            setShowFriendRequestModal(true)
                                          }}
                                        >
                                          <UserPlus className="w-4 h-4 mr-2" />
                                          Gửi lời mời kết bạn
                                        </DropdownMenuItem>
                                        <DropdownMenuItem className="cursor-pointer">\n                                          <MessageSquare className="w-4 h-4 mr-2" />
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
                                        <DropdownMenuItem 
                                          className="cursor-pointer"
                                          onClick={() => {
                                            setSelectedMemberForRequest(member)
                                            setShowFriendRequestModal(true)
                                          }}
                                        >
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
                              <Button variant="outline" size="sm" className="h-8 text-xs px-3">
                                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                </svg>
                                Tải xuống
                              </Button>
                              <Button size="sm" className="h-8 text-xs px-3 bg-blue-500 hover:bg-blue-600 text-white rounded-md">
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

            {/* Tab Content: Reminders List */}
            {rightPanelTab === 'reminders' && (
              <div className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-white">
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => setRightPanelTab('zalo')}
                      className="p-1 rounded hover:bg-gray-100 text-gray-600"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <h3 className="font-semibold text-gray-900">Danh sách nhắc hẹn</h3>
                  </div>
                  <button
                    onClick={() => handleCreateReminder()}
                    className="p-1.5 rounded hover:bg-gray-100 text-gray-600"
                    title="Thêm nhắc hẹn"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>

                {/* Reminder List */}
                <ScrollArea className="flex-1">
                  {getConversationReminders().length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                      <Bell className="w-12 h-12 text-gray-300 mb-3" />
                      <p className="text-gray-500 text-sm">Chưa có nhắc hẹn nào</p>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="mt-3"
                        onClick={() => handleCreateReminder()}
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        Tạo nhắc hẹn
                      </Button>
                    </div>
                  ) : (
                    <div className="p-4 space-y-3">
                      {getConversationReminders().map((reminder) => {
                        const date = new Date(reminder.date)
                        const day = date.getDate()
                        const month = date.getMonth() + 1
                        const dayOfWeek = getDayOfWeek(reminder.date)
                        
                        return (
                          <div 
                            key={reminder.id}
                            className="flex gap-3 p-3 bg-white border border-gray-200 rounded-lg hover:shadow-sm transition-shadow"
                          >
                            {/* Date Badge */}
                            <div className="flex-shrink-0 w-14 h-14 bg-blue-50 rounded-lg flex flex-col items-center justify-center border border-blue-100">
                              <span className="text-[10px] text-blue-600 font-medium">{dayOfWeek}</span>
                              <span className="text-lg font-bold text-blue-600">{day}</span>
                              <span className="text-[10px] text-blue-500">Tháng {month}</span>
                            </div>
                            
                            {/* Reminder Info */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between">
                                <h4 className="font-medium text-gray-900 truncate">{reminder.title}</h4>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <button className="p-1 text-gray-400 hover:text-gray-600 flex-shrink-0">
                                      <MoreHorizontal className="w-4 h-4" />
                                    </button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end" className="w-40">
                                    <DropdownMenuItem onClick={() => handleEditReminder(reminder)}>
                                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                      </svg>
                                      Sửa lịch hẹn
                                    </DropdownMenuItem>
                                    <DropdownMenuItem 
                                      onClick={() => handleDeleteReminderConfirm(reminder.id)}
                                      className="text-red-600"
                                    >
                                      <Trash2 className="w-4 h-4 mr-2" />
                                      Hủy lịch hẹn
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                              <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                                <Clock className="w-3 h-3" />
                                <span>T{date.getDay() === 0 ? 'CN' : date.getDay()} {day.toString().padStart(2, '0')}/{month.toString().padStart(2, '0')}/{date.getFullYear()} lúc {reminder.time}</span>
                              </div>
                              <div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
                                <Repeat2 className="w-3 h-3" />
                                <span>{formatRepeatLabel(reminder.repeat)}</span>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
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
                    <h3 className="text-base font-semibold text-gray-900">Chi tiết Lead - {selectedLeadDetail.name}</h3>
                    <Badge className={cn(
                      "text-xs px-2 py-0.5 h-5",
                      selectedLeadDetail.status === 'customer' ? "bg-green-100 text-green-700" :
                      selectedLeadDetail.status === 'lead' ? "bg-blue-100 text-blue-700" :
                      "bg-yellow-100 text-yellow-700"
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
                        <h4 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
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
                        <h4 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
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
                        <h4 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
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
                        <h4 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
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
                        <h4 className="text-base font-semibold text-gray-900 mb-4">Tags/Nhãn</h4>
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

      {/* Connection Management Modal */}
      <Dialog open={showConnectionModal} onOpenChange={setShowConnectionModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] p-0">
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Quản lý kết nối</h2>
            </div>

            {/* Controls */}
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <label className="text-sm text-gray-600">Chọn nền tảng:</label>
                  <select
                    value={connectionPlatformFilter}
                    onChange={(e) => setConnectionPlatformFilter(e.target.value as any)}
                    className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">Tất cả nền tảng</option>
                    <option value="zalo-personal">Zalo cá nhân</option>
                    <option value="zalo-oa">Zalo OA</option>
                    <option value="facebook">Facebook</option>
                  </select>
                </div>
                <Button 
                  className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white"
                  onClick={() => setShowIntegrationModal(true)}
                >
                  <Plus className="w-4 h-4" />
                  Thêm kết nối
                </Button>
              </div>
            </div>

            {/* Connected Accounts List */}
            <ScrollArea className="flex-1 p-6 max-h-[500px]">
              <div className="space-y-4">
                {connectedZaloAccounts
                  .filter(account => connectionPlatformFilter === 'all' || account.platform === connectionPlatformFilter)
                  .map((account) => (
                    <div key={account.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3 flex-1">
                          <Avatar className="w-12 h-12">
                            <AvatarImage src={account.avatar} />
                            <AvatarFallback className="bg-blue-500 text-white">
                              {account.name.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold text-gray-900">{account.name}</h3>
                              <Badge className={cn(
                                "text-xs",
                                account.platform === 'zalo-personal' ? "bg-blue-100 text-blue-800" :
                                account.platform === 'zalo-oa' ? "bg-purple-100 text-purple-800" :
                                "bg-blue-600 text-white"
                              )}>
                                {account.platform === 'zalo-personal' ? 'Zalo cá nhân' :
                                 account.platform === 'zalo-oa' ? 'Zalo OA' :
                                 'Facebook'}
                              </Badge>
                            </div>
                            <div className="text-sm text-gray-500 space-y-1">
                              <div>• ID: {account.id}853684866249512254</div>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-3">
                          {/* Row 1: Badge */}
                          <div className="flex items-center gap-2">
                            {accountConnectionStatus.get(account.id) ? (
                              <Badge className="bg-green-100 text-green-800 flex items-center gap-1">
                                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                Đã kết nối
                              </Badge>
                            ) : (
                              <Badge className="bg-red-100 text-red-800 flex items-center gap-1">
                                <div className="w-2 h-2 rounded-full bg-red-500"></div>
                                Mất kết nối
                              </Badge>
                            )}
                          </div>
                          {/* Row 2: Disconnect & Delete buttons */}
                          <div className="flex items-center gap-2">
                            {accountConnectionStatus.get(account.id) ? (
                              <Button
                                size="sm"
                                onClick={() => toggleAccountConnection(account.id)}
                                className="bg-orange-500 hover:bg-orange-600 text-white text-xs h-9 border-0"
                              >
                                Ngắt kết nối
                              </Button>
                            ) : (
                              <Button
                                size="sm"
                                onClick={() => toggleAccountConnection(account.id)}
                                className="bg-green-500 hover:bg-green-600 text-white text-xs h-9 border-0"
                              >
                                Kết nối
                              </Button>
                            )}
                            <Button
                              size="sm"
                              className="bg-red-500 hover:bg-red-600 text-white h-9 border-0"
                              onClick={() => {
                                setAccountToDelete(account)
                                setShowDeleteAccountModal(true)
                              }}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </ScrollArea>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal: Chọn loại tích hợp */}
      <Dialog open={showIntegrationModal} onOpenChange={setShowIntegrationModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Thêm kết nối mới</DialogTitle>
            <DialogDescription>
              Chọn loại kết nối bạn muốn thêm vào hệ thống
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 px-6 py-4">
            <div>
              <Label>Loại kết nối</Label>
              <Select
                value={selectedIntegrationType}
                onValueChange={(value) => setSelectedIntegrationType(value as 'zalo-personal' | 'zalo-oa' | 'facebook' | '')}
              >
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Chọn loại kết nối" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="zalo-personal">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="w-4 h-4" />
                      Kết nối Zalo cá nhân
                    </div>
                  </SelectItem>
                  <SelectItem value="zalo-oa">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="w-4 h-4" />
                      Kết nối Zalo OA
                    </div>
                  </SelectItem>
                  <SelectItem value="facebook">
                    <div className="flex items-center gap-2">
                      <Facebook className="w-4 h-4" />
                      Kết nối Facebook Fanpage
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {selectedIntegrationType === 'zalo-personal' && (
              <div className="bg-blue-50 border border-blue-200 rounded p-3">
                <p className="text-sm text-blue-800">
                  Quét mã QR bằng ứng dụng Zalo để kết nối tài khoản cá nhân
                </p>
              </div>
            )}

            {selectedIntegrationType === 'zalo-oa' && (
              <div className="bg-yellow-50 border border-yellow-200 rounded p-3">
                <p className="text-sm text-yellow-800">
                  <AlertTriangle className="w-4 h-4 inline mr-1" />
                  Yêu cầu gói <strong>OA Nâng cao</strong> hoặc <strong>OA Premium</strong>
                </p>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowIntegrationModal(false)
                setSelectedIntegrationType('')
              }}
            >
              Hủy
            </Button>
            <Button
              onClick={() => {
                if (selectedIntegrationType === 'zalo-personal') {
                  setShowIntegrationModal(false)
                  setShowQRModal(true)
                  setTimeout(() => {
                    setQRCheckStatus('checking')
                    // Simulate checking
                    setTimeout(() => setQRCheckStatus('success'), 3000)
                  }, 500)
                } else if (selectedIntegrationType === 'zalo-oa') {
                  setShowIntegrationModal(false)
                  setShowOALinkModal(true)
                } else if (selectedIntegrationType === 'facebook') {
                  setShowIntegrationModal(false)
                  setShowFacebookModal(true)
                }
              }}
              disabled={!selectedIntegrationType}
            >
              Tiếp tục
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal: QR Code - Kết nối Zalo cá nhân */}
      <Dialog open={showQRModal} onOpenChange={(open) => {
        if (!open) {
          if (qrCheckInterval) clearInterval(qrCheckInterval)
          setQRCheckStatus('pending')
        }
        setShowQRModal(open)
      }}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl">Kết nối Zalo cá nhân</DialogTitle>
          </DialogHeader>

          <div className="flex gap-8 px-6 py-4">
            {/* Left: QR Code */}
            <div className="flex-shrink-0">
              <div className="w-64 h-64 bg-gray-100 border-2 border-gray-300 rounded-lg flex items-center justify-center relative">
                {qrCheckStatus === 'pending' || qrCheckStatus === 'checking' ? (
                  <>
                    <div className="w-56 h-56 bg-white border border-gray-200 rounded flex items-center justify-center">
                      <QrCode className="w-32 h-32 text-gray-400" />
                    </div>
                    {qrCheckStatus === 'checking' && (
                      <div className="absolute inset-0 bg-white bg-opacity-80 flex items-center justify-center">
                        <RefreshCw className="w-8 h-8 animate-spin text-blue-500" />
                      </div>
                    )}
                  </>
                ) : qrCheckStatus === 'success' ? (
                  <div className="text-center">
                    <CheckCircle className="w-24 h-24 text-green-500 mx-auto mb-2" />
                    <p className="text-green-600 font-medium">Kết nối thành công!</p>
                  </div>
                ) : (
                  <div className="text-center">
                    <XCircle className="w-24 h-24 text-red-500 mx-auto mb-2" />
                    <p className="text-red-600 font-medium">Lỗi kết nối</p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-2"
                      onClick={() => setQRCheckStatus('checking')}
                    >
                      <RefreshCw className="w-4 h-4 mr-1" />
                      Thử lại
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Right: Instructions */}
            <div className="flex-1">
              <h3 className="text-lg font-semibold mb-4">
                Quét QR để kết nối Zalo
              </h3>

              <ol className="space-y-3 text-sm">
                <li className="flex items-start gap-2">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                    1
                  </span>
                  <div>
                    <span>Mở ứng dụng </span>
                    <Badge variant="outline" className="mx-1">
                      <MessageSquare className="w-3 h-3 mr-1" />
                      Zalo
                    </Badge>
                    <span>trên di động.</span>
                  </div>
                </li>

                <li className="flex items-start gap-2">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                    2
                  </span>
                  <div>
                    <span>Ở mục ⚙️ </span>
                    <strong>Cài đặt</strong>
                    <span>, nhấn nút quét QR 📷</span>
                  </div>
                </li>

                <li className="flex items-start gap-2">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                    3
                  </span>
                  <span>Quét mã QR để đăng nhập.</span>
                </li>
              </ol>

              <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded p-3">
                <p className="text-sm font-medium text-yellow-900 mb-1">Lưu ý:</p>
                <ul className="text-xs text-yellow-800 space-y-1">
                  <li>• Không truy cập: <code className="bg-yellow-100 px-1 rounded">chat.Zalo.me</code> để tránh bị mất kết nối</li>
                  <li>• Nếu mất kết nối: Bạn làm mới kết nối và đăng nhập lại</li>
                </ul>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowQRModal(false)}>
              Đóng
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal: Kết nối Zalo OA */}
      <Dialog open={showOALinkModal} onOpenChange={setShowOALinkModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl text-center">
              Kết nối Vilead CRM
            </DialogTitle>
            <DialogDescription className="text-center">
              với tài khoản Zalo OA
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 px-6 py-4">
            {/* Logo Section */}
            <div className="flex items-center justify-center gap-6">
              <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl font-bold text-blue-600">V</span>
              </div>

              <RefreshCw className="w-6 h-6 text-gray-400" />

              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center">
                <MessageSquare className="w-8 h-8 text-white" />
              </div>
            </div>

            {/* Warning Message */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
              <p className="text-sm text-gray-700">
                Zalo OA yêu cầu bạn phải mua gói{' '}
                <strong className="text-yellow-800">OA Nâng cao</strong> hoặc{' '}
                <strong className="text-yellow-800">OA Premium</strong>{' '}
                để có thể kết nối với Vilead CRM
              </p>
            </div>

            {/* Connect Button */}
            <Button
              className="w-full h-12 text-base"
              onClick={() => {
                alert('Đang kết nối với Zalo OA...')
                setShowOALinkModal(false)
              }}
            >
              <MessageSquare className="w-5 h-5 mr-2" />
              Kết nối tài khoản Zalo OA
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal: Kết nối Facebook Fanpage */}
      <Dialog open={showFacebookModal} onOpenChange={setShowFacebookModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl text-center">
              Kết nối Vilead CRM
            </DialogTitle>
            <DialogDescription className="text-center">
              với Facebook Fanpage
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 px-6 py-4">
            {/* Logo Section */}
            <div className="flex items-center justify-center gap-6">
              <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl font-bold text-blue-600">V</span>
              </div>

              <RefreshCw className="w-6 h-6 text-gray-400" />

              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
                <Facebook className="w-8 h-8 text-white" />
              </div>
            </div>

            {/* Info Message */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
              <p className="text-sm text-gray-700">
                Đăng nhập Facebook để kết nối các{' '}
                <strong className="text-blue-600">Fanpage</strong> bạn quản lý
              </p>
            </div>

            {/* Connect Button */}
            <Button
              className="w-full h-12 text-base bg-blue-600 hover:bg-blue-700"
              onClick={() => {
                alert('Đang kết nối với Facebook...')
                setShowFacebookModal(false)
              }}
            >
              <Facebook className="w-5 h-5 mr-2" />
              Kết nối tài khoản Facebook
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal: Xác nhận xóa kết nối */}
      <Dialog open={showDeleteAccountModal} onOpenChange={setShowDeleteAccountModal}>
        <DialogContent className="max-w-md [&>button]:hidden">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">Xác nhận xóa</DialogTitle>
          </DialogHeader>

          <div className="px-6 py-4">
            <p className="text-sm text-gray-700 leading-relaxed">
              Toàn bộ dữ liệu (tin nhắn, tài liệu đính kèm) sẽ bị xóa trên Quản lý Chat không ảnh hưởng dữ liệu trên Zalo.
              <br /><br />
              Bạn có muốn tiếp tục xoá tài khoản này hay không?
            </p>
          </div>

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              className="border-0"
              onClick={() => {
                setShowDeleteAccountModal(false)
                setAccountToDelete(null)
              }}
            >
              Hủy
            </Button>
            <Button
              className="bg-red-600 hover:bg-red-700 text-white border-0"
              onClick={() => {
                if (accountToDelete) {
                  const deletedAccountPlatform = accountToDelete.platform
                  const deletedAccountId = accountToDelete.id
                  
                  // Remove account from the list
                  const updatedAccounts = connectedAccounts.filter(acc => acc.id !== deletedAccountId)
                  setConnectedAccounts(updatedAccounts)
                  
                  // Remove from connection status
                  setAccountConnectionStatus(prev => {
                    const newMap = new Map(prev)
                    newMap.delete(deletedAccountId)
                    return newMap
                  })
                  
                  // Remove all connections related to this account
                  setConversationCustomerMap(prev => {
                    const newMap = new Map(prev)
                    // Remove conversations connected through this account
                    const entries = Array.from(newMap.entries())
                    entries.forEach(([convId, connection]) => {
                      if (connection.accountId === deletedAccountId) {
                        newMap.delete(convId)
                        // Update customer connection count
                        setCustomerConnectionCount(prevCount => {
                          const newCountMap = new Map(prevCount)
                          const currentCount = newCountMap.get(connection.customerId)
                          if (currentCount) {
                            const platform = connection.platform
                            const updatedCount = {
                              ...currentCount,
                              [platform]: Math.max(0, currentCount[platform] - 1),
                              total: Math.max(0, currentCount.total - 1)
                            }
                            if (updatedCount.total === 0) {
                              newCountMap.delete(connection.customerId)
                              setConnectedCustomers(prevConnected => {
                                const newSet = new Set(prevConnected)
                                newSet.delete(connection.customerId)
                                return newSet
                              })
                            } else {
                              newCountMap.set(connection.customerId, updatedCount)
                            }
                          }
                          return newCountMap
                        })
                      }
                    })
                    return newMap
                  })
                  
                  // Auto-select another account if the deleted one was selected
                  if (selectedAccount.id === deletedAccountId) {
                    // Try to find another account in the same platform
                    const sameplatformAccount = updatedAccounts.find(acc => acc.platform === deletedAccountPlatform)
                    
                    if (sameplatformAccount) {
                      setSelectedAccount(sameplatformAccount)
                    } else {
                      // Switch to another platform that has accounts
                      const anyAccount = updatedAccounts[0]
                      if (anyAccount) {
                        setSelectedAccount(anyAccount)
                        setSelectedChannel(anyAccount.platform)
                      }
                    }
                  }
                }
                setShowDeleteAccountModal(false)
                setAccountToDelete(null)
              }}
            >
              Xóa
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Friend Request Modal */}
      <Dialog open={showFriendRequestModal} onOpenChange={setShowFriendRequestModal}>
        <DialogContent className="max-w-md w-[calc(100vw-2rem)] sm:w-full [&>button]:hidden">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">Nhập lời nhắn gửi lời mời kết bạn</DialogTitle>
          </DialogHeader>

          <div className="px-6 py-4">
            <textarea
              value={friendRequestMessage}
              onChange={(e) => {
                if (e.target.value.length <= 150) {
                  setFriendRequestMessage(e.target.value)
                }
              }}
              className="w-full min-h-[120px] px-3 py-2 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              placeholder="Xin chào bạn. Tôi muốn kết bạn với bạn trên Zalo"
            />
            <div className="mt-2 text-sm text-gray-500">
              {friendRequestMessage.length}/150
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setShowFriendRequestModal(false)
                setFriendRequestMessage('Xin chào bạn. Tôi muốn kết bạn với bạn trên Zalo')
                setSelectedMemberForRequest(null)
              }}
            >
              Hủy
            </Button>
            <Button
              onClick={() => {
                // TODO: Send friend request API
                console.log('Send friend request to:', selectedMemberForRequest?.name, 'Message:', friendRequestMessage)
                setShowFriendRequestModal(false)
                setFriendRequestMessage('Xin chào bạn. Tôi muốn kết bạn với bạn trên Zalo')
                setSelectedMemberForRequest(null)
              }}
            >
              Gửi
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Lead Modal */}
      <Dialog open={showCreateLeadModal} onOpenChange={setShowCreateLeadModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-0 [&>button]:hidden">
          <div className="bg-white rounded-lg">
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-semibold text-gray-900">Thêm Lead mới</h3>
                  <div className="relative group">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-gray-400 hover:text-gray-600 cursor-help">
                      <circle cx="12" cy="12" r="10" />
                      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                      <path d="M12 17h.01" />
                    </svg>
                  </div>
                </div>
                <button 
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                  onClick={() => setShowCreateLeadModal(false)}
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Customer Type */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
                  <span className="text-red-500">*</span>Loại khách hàng
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <label className={`relative flex items-center p-3 border rounded-lg cursor-pointer hover:border-blue-500 transition-colors ${leadFormData.customerType === 'individual' ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}>
                    <input 
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 focus:ring-2" 
                      type="radio" 
                      value="individual" 
                      checked={leadFormData.customerType === 'individual'}
                      onChange={(e) => setLeadFormData({...leadFormData, customerType: e.target.value})}
                      name="customerType"
                    />
                    <div className="ml-3">
                      <div className="text-sm font-medium text-gray-900">👤 Cá nhân</div>
                      <div className="text-xs text-gray-500">Khách hàng cá nhân</div>
                    </div>
                  </label>
                  <label className={`relative flex items-center p-3 border rounded-lg cursor-pointer hover:border-blue-500 transition-colors ${leadFormData.customerType === 'business' ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}>
                    <input 
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 focus:ring-2" 
                      type="radio" 
                      value="business" 
                      checked={leadFormData.customerType === 'business'}
                      onChange={(e) => setLeadFormData({...leadFormData, customerType: e.target.value})}
                      name="customerType"
                    />
                    <div className="ml-3">
                      <div className="text-sm font-medium text-gray-900">🏢 Công ty</div>
                      <div className="text-xs text-gray-500">Khách hàng doanh nghiệp</div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Required Info */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
                  <span className="text-red-500">*</span>Thông tin bắt buộc
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Tên khách hàng <span className="text-red-500">*</span>
                    </label>
                    <input 
                      placeholder="Nhập tên khách hàng..." 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" 
                      type="text" 
                      value={leadFormData.name}
                      onChange={(e) => setLeadFormData({...leadFormData, name: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Số điện thoại <span className="text-red-500">*</span>
                    </label>
                    <input 
                      placeholder="0901234567" 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" 
                      type="tel" 
                      value={leadFormData.phone}
                      onChange={(e) => setLeadFormData({...leadFormData, phone: e.target.value})}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input 
                      placeholder="email@domain.com" 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" 
                      type="email" 
                      value={leadFormData.email}
                      onChange={(e) => setLeadFormData({...leadFormData, email: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              {/* Lead Source & Assignment */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-green-500" />
                  Nguồn lead & Phân công
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Nguồn</label>
                    <select 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={leadFormData.source}
                      onChange={(e) => setLeadFormData({...leadFormData, source: e.target.value})}
                    >
                      <option value="website">Website</option>
                      <option value="facebook">Facebook</option>
                      <option value="google">Google Ads</option>
                      <option value="referral">Giới thiệu</option>
                      <option value="cold-call">Cold Call</option>
                      <option value="exhibition">Triển lãm</option>
                      <option value="linkedin">LinkedIn</option>
                      <option value="email-marketing">Email Marketing</option>
                      <option value="webinar">Webinar</option>
                      <option value="partner">Đối tác</option>
                      <option value="other">Khác</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Tỉnh thành</label>
                    <select 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={leadFormData.province}
                      onChange={(e) => setLeadFormData({...leadFormData, province: e.target.value})}
                    >
                      <option value="hanoi">Hà Nội</option>
                      <option value="hcm">TP. Hồ Chí Minh</option>
                      <option value="danang">Đà Nẵng</option>
                      <option value="haiphong">Hải Phòng</option>
                      <option value="cantho">Cần Thơ</option>
                      <option value="other">Khác</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Phân công cho
                      <div className="inline-block ml-1 relative">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3 text-gray-400 hover:text-gray-600 cursor-help">
                          <circle cx="12" cy="12" r="10" />
                          <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                          <path d="M12 17h.01" />
                        </svg>
                      </div>
                    </label>
                    <select 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={leadFormData.assignTo}
                      onChange={(e) => setLeadFormData({...leadFormData, assignTo: e.target.value})}
                    >
                      <option value="">Mặc định (Minh Expert - người tạo)</option>
                      <option value="Nguyễn Văn A">Nguyễn Văn A (12 leads hiện tại)</option>
                      <option value="Trần Thị B">Trần Thị B (8 leads hiện tại)</option>
                      <option value="Lê Văn C">Lê Văn C (15 leads hiện tại)</option>
                      <option value="Phạm Thị D">Phạm Thị D (10 leads hiện tại)</option>
                      <option value="Hoàng Văn E">Hoàng Văn E (6 leads hiện tại)</option>
                      <option value="Đỗ Thị F">Đỗ Thị F (9 leads hiện tại)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Product Info */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-yellow-500">
                    <line x1="12" x2="12" y1="2" y2="22" />
                    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                  </svg>
                  Thông tin sản phẩm & Bán hàng
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Sản phẩm quan tâm</label>
                    <select 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={leadFormData.product}
                      onChange={(e) => setLeadFormData({...leadFormData, product: e.target.value})}
                    >
                      <option value="">Chọn sản phẩm...</option>
                      <option value="CRM Solution">CRM Solution - Quản lý khách hàng</option>
                      <option value="ERP System">ERP System - Quản lý tài nguyên doanh nghiệp</option>
                      <option value="Website Development">Website Development - Phát triển website</option>
                      <option value="E-commerce Platform">E-commerce Platform - Nền tảng thương mại điện tử</option>
                      <option value="Mobile Application">Mobile Application - Ứng dụng di động</option>
                      <option value="Marketing Automation">Marketing Automation - Tự động hóa marketing</option>
                      <option value="Data Analytics">Data Analytics - Phân tích dữ liệu</option>
                      <option value="Cloud Services">Cloud Services - Dịch vụ đám mây</option>
                      <option value="AI/ML Solutions">AI/ML Solutions - Giải pháp trí tuệ nhân tạo</option>
                      <option value="Cybersecurity">Cybersecurity - An ninh mạng</option>
                      <option value="Digital Transformation">Digital Transformation - Chuyển đổi số</option>
                      <option value="Custom Software">Custom Software - Phần mềm tùy chỉnh</option>
                      <option value="Consulting Services">Consulting Services - Dịch vụ tư vấn</option>
                      <option value="Training & Support">Training & Support - Đào tạo và hỗ trợ</option>
                      <option value="Other">Khác</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-orange-500">
                    <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
                    <line x1="16" x2="16" y1="2" y2="6" />
                    <line x1="8" x2="8" y1="2" y2="6" />
                    <line x1="3" x2="21" y1="10" y2="10" />
                  </svg>
                  Mô tả chi tiết
                </h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Nội dung quan tâm</label>
                    <textarea 
                      placeholder="Mô tả nhu cầu, yêu cầu của khách hàng..." 
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={leadFormData.content}
                      onChange={(e) => setLeadFormData({...leadFormData, content: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Ghi chú</label>
                    <textarea 
                      placeholder="Ghi chú thêm về lead này..." 
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={leadFormData.notes}
                      onChange={(e) => setLeadFormData({...leadFormData, notes: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              {/* Preview */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
                <h4 className="text-sm font-medium text-blue-900 mb-2 flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  Xem trước Lead
                </h4>
                <div className="text-sm text-blue-800 space-y-1">
                  <div><strong>Tên:</strong> {leadFormData.name || 'Chưa nhập'}</div>
                  <div><strong>Email:</strong> {leadFormData.email || 'Chưa nhập'}</div>
                  <div><strong>SĐT:</strong> {leadFormData.phone || 'Chưa nhập'}</div>
                  <div><strong>Nguồn:</strong> {leadFormData.source === 'website' ? 'Website' : leadFormData.source === 'facebook' ? 'Facebook' : leadFormData.source === 'google' ? 'Google Ads' : leadFormData.source}</div>
                  <div><strong>Phân công cho:</strong> {leadFormData.assignTo || 'Minh Expert (người tạo)'}</div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
              <button 
                className="px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100 border border-slate-300 rounded-lg hover:bg-slate-200 hover:text-slate-700 transition-all duration-200 shadow-sm hover:shadow-md"
                onClick={() => {
                  setShowCreateLeadModal(false)
                  setLeadFormData({
                    customerType: 'individual',
                    name: '',
                    phone: '',
                    email: '',
                    source: 'website',
                    province: 'hanoi',
                    assignTo: '',
                    product: '',
                    content: '',
                    notes: ''
                  })
                }}
              >
                Hủy
              </button>
              <button 
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 transition-all duration-200 flex items-center gap-2 shadow-md hover:shadow-lg transform hover:scale-[1.02]"
                onClick={() => {
                  // Create new lead customer
                  const newCustomer = {
                    id: Date.now().toString(),
                    name: leadFormData.name,
                    phone: leadFormData.phone,
                    email: leadFormData.email,
                    company: leadFormData.customerType === 'business' ? leadFormData.name : '',
                    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${leadFormData.name}`,
                    status: 'lead' as const,
                    source: leadFormData.source === 'website' ? 'Website' : 
                            leadFormData.source === 'facebook' ? 'Facebook' : 
                            leadFormData.source === 'google' ? 'Google Ads' : 
                            leadFormData.source.charAt(0).toUpperCase() + leadFormData.source.slice(1),
                    tags: ['Lead mới'],
                    createdAt: new Date().toISOString(),
                    lastContactedAt: new Date().toISOString(),
                    notes: leadFormData.notes
                  }
                  
                  // Connect to current conversation and save customer
                  if (selectedConversation) {
                    // Save customer to syncedCustomers Map with conversation ID as key
                    const newSyncedMap = new Map(syncedCustomers)
                    newSyncedMap.set(selectedConversation.id, newCustomer)
                    setSyncedCustomers(newSyncedMap)
                    
                    // Also update conversation customer map with proper ConversationConnection object
                    const connectionInfo: ConversationConnection = {
                      customerId: newCustomer.id,
                      platform: selectedChannel,
                      accountId: selectedAccount.id,
                      accountName: selectedAccount.name,
                      connectedAt: new Date().toISOString()
                    }
                    const newMap = new Map(conversationCustomerMap)
                    newMap.set(selectedConversation.id, connectionInfo)
                    setConversationCustomerMap(newMap)
                    
                    const newConnected = new Set(connectedCustomers)
                    newConnected.add(newCustomer.id)
                    setConnectedCustomers(newConnected)
                    
                    // Update customer connection count
                    setCustomerConnectionCount(prev => {
                      const newCountMap = new Map(prev)
                      const current = newCountMap.get(newCustomer.id) || {
                        'zalo-personal': 0,
                        'zalo-oa': 0,
                        'facebook': 0,
                        total: 0
                      }
                      const updated = {
                        ...current,
                        [selectedChannel]: current[selectedChannel] + 1,
                        total: current.total + 1
                      }
                      newCountMap.set(newCustomer.id, updated)
                      return newCountMap
                    })
                  }
                  
                  // Close modal and reset form
                  setShowCreateLeadModal(false)
                  setLeadFormData({
                    customerType: 'individual',
                    name: '',
                    phone: '',
                    email: '',
                    source: 'website',
                    province: 'hanoi',
                    assignTo: '',
                    product: '',
                    content: '',
                    notes: ''
                  })
                }}
              >
                <Plus className="w-4 h-4" />
                Thêm Lead
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Lead Detail Modal */}
      <Dialog open={!!selectedLeadDetail} onOpenChange={(open) => !open && setSelectedLeadDetail(null)}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-hidden flex flex-col p-0 [&>button]:hidden">
          <div className="bg-white rounded-lg flex flex-col h-full">
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-200 flex-shrink-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Chi tiết Lead - {selectedLeadDetail?.name}
                  </h3>
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                    Chuyển đổi thành công
                  </span>
                </div>
                <button 
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                  onClick={() => setSelectedLeadDetail(null)}
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              {/* Tabs */}
              <div className="flex border-b border-gray-200 mt-4 -mb-px">
                <button 
                  className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                    leadDetailTab === 'contact' 
                      ? 'border-blue-500 text-blue-600' 
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                  onClick={() => setLeadDetailTab('contact')}
                >
                  Thông tin liên hệ
                </button>
                <button 
                  className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                    leadDetailTab === 'history' 
                      ? 'border-blue-500 text-blue-600' 
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                  onClick={() => setLeadDetailTab('history')}
                >
                  Lịch sử tương tác
                </button>
                <button 
                  className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                    leadDetailTab === 'notes' 
                      ? 'border-blue-500 text-blue-600' 
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                  onClick={() => setLeadDetailTab('notes')}
                >
                  Ghi chú & Nội dung
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
              <div className="p-6">
                {leadDetailTab === 'contact' && selectedLeadDetail && (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Left Column */}
                    <div className="space-y-6">
                      {/* Basic Info */}
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
                          {selectedLeadDetail.company && (
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-600">Công ty:</span>
                              <span className="text-sm font-medium text-gray-900">{selectedLeadDetail.company}</span>
                            </div>
                          )}
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Loại khách hàng:</span>
                            <span className="text-sm font-medium text-gray-900">
                              {selectedLeadDetail.company ? 'Doanh nghiệp' : 'Cá nhân'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Contact Info */}
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
                      {/* Sales Info */}
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

                      {/* Time Info */}
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
                            <span className="text-sm text-gray-600">Cập nhật cuối:</span>
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
                          {selectedLeadDetail.tags?.map((tag, idx) => (
                            <span 
                              key={idx}
                              className="px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800"
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
                  <div className="space-y-4">
                    <p className="text-gray-500 text-center py-8">Lịch sử tương tác sẽ được hiển thị tại đây</p>
                  </div>
                )}

                {leadDetailTab === 'notes' && (
                  <div className="space-y-4">
                    {selectedLeadDetail?.notes ? (
                      <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-sm text-gray-900">{selectedLeadDetail.notes}</p>
                      </div>
                    ) : (
                      <p className="text-gray-500 text-center py-8">Chưa có ghi chú</p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3 flex-shrink-0">
              <button 
                className="px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100 border border-slate-300 rounded-lg hover:bg-slate-200 hover:text-slate-700 transition-all duration-200"
                onClick={() => setSelectedLeadDetail(null)}
              >
                Đóng
              </button>
              <button 
                className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-lg hover:bg-green-700 transition-all duration-200 flex items-center gap-2"
              >
                <TrendingUp className="w-4 h-4" />
                Chuyển đổi
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Quick Status Change Modal */}
      {showQuickStatusModal && selectedLeadForQuickAction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] sm:max-h-[80vh] overflow-hidden flex flex-col mx-4">
            <div className="px-4 sm:px-6 py-4 border-b border-gray-200 flex-shrink-0">
              <div className="flex justify-between items-center">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900">Chuyển trạng thái - {selectedLeadForQuickAction.name}</h3>
                <button 
                  onClick={() => {
                    setShowQuickStatusModal(false)
                    setQuickStatusValue('')
                  }}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <p className="text-sm text-gray-600 mt-2">Chọn trạng thái mới cho lead</p>
            </div>
            <div className="px-4 sm:px-6 py-4 flex-1 overflow-y-auto">
              <div className="space-y-3">
                {[
                  { value: 'new', emoji: '🆕', label: 'Lead mới', desc: 'Lead mới vừa được tạo, chưa được xử lý', bg: 'bg-gray-100', border: 'border-gray-300' },
                  { value: 'consulting', emoji: '📞', label: 'Đang tư vấn', desc: 'Đã liên hệ và đang tư vấn khách hàng', bg: 'bg-blue-100', border: 'border-blue-300' },
                  { value: 'proposal', emoji: '📋', label: 'Đã gửi đề xuất', desc: 'Đã gửi đề xuất/báo giá cho khách hàng', bg: 'bg-yellow-100', border: 'border-yellow-300' },
                  { value: 'negotiation', emoji: '🤝', label: 'Đàm phán', desc: 'Đang trong quá trình thương lượng và đàm phán', bg: 'bg-orange-100', border: 'border-orange-300' },
                  { value: 'pending_payment', emoji: '💳', label: 'Chờ thanh toán', desc: 'Đã thống nhất, chờ khách hàng thanh toán', bg: 'bg-purple-100', border: 'border-purple-300' },
                  { value: 'success', emoji: '✅', label: 'Chuyển đổi thành công', desc: 'Đã thanh toán và chuyển đổi thành công', bg: 'bg-green-100', border: 'border-green-300' },
                  { value: 'failed', emoji: '❌', label: 'Thất bại', desc: 'Lead không thành công, đã đóng', bg: 'bg-red-100', border: 'border-red-300' },
                ].map((status) => (
                  <div
                    key={status.value}
                    onClick={() => setQuickStatusValue(status.value)}
                    className={cn(
                      "p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md",
                      quickStatusValue === status.value 
                        ? `${status.bg} ${status.border}` 
                        : "border-gray-200 hover:border-gray-300"
                    )}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="text-2xl">{status.emoji}</div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">{status.label}</h4>
                        <p className="text-sm text-gray-600 mt-1">{status.desc}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="px-4 sm:px-6 py-4 border-t border-gray-200 bg-gray-50 flex-shrink-0">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
                <div className="text-sm text-gray-600 text-center sm:text-left">
                  💡 Mẹo: Việc chuyển trạng thái sẽ được ghi lại trong lịch sử tương tác
                </div>
                <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                  <button 
                    onClick={() => {
                      setShowQuickStatusModal(false)
                      setQuickStatusValue('')
                    }}
                    className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Hủy
                  </button>
                  <button 
                    disabled={!quickStatusValue}
                    onClick={() => {
                      console.log('Status changed:', quickStatusValue)
                      setShowQuickStatusModal(false)
                      setQuickStatusValue('')
                    }}
                    className={cn(
                      "w-full sm:w-auto px-4 py-2 text-sm font-medium border border-transparent rounded-lg transition-all duration-200 flex items-center justify-center gap-2",
                      quickStatusValue 
                        ? "text-white bg-blue-600 hover:bg-blue-700" 
                        : "text-gray-400 bg-gray-300 cursor-not-allowed"
                    )}
                  >
                    <TrendingUp className="w-4 h-4" />
                    {quickStatusValue ? 'Cập nhật trạng thái' : 'Chọn trạng thái để tiếp tục'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Task Modal */}
      {showQuickTaskModal && selectedLeadForQuickAction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-hidden flex flex-col mx-4">
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h3 className="text-lg font-semibold text-gray-900">Tạo công việc</h3>
              <button 
                onClick={() => {
                  setShowQuickTaskModal(false)
                  setQuickTaskTitle('')
                  setQuickTaskDescription('')
                  setQuickTaskDeadline('')
                  setQuickTaskPriority('')
                  setQuickTaskAssignee('')
                  setQuickTaskType('Leads')
                  setQuickTaskTags([])
                  setQuickTaskInternalNote('')
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="px-6 py-4 flex-1 overflow-y-auto space-y-4">
              {/* Tiêu đề */}
              <div>
                <Input 
                  placeholder="Nhập tiêu đề công việc (tối đa 100 ký tự)"
                  value={quickTaskTitle}
                  onChange={(e) => setQuickTaskTitle(e.target.value)}
                  maxLength={100}
                />
                {!quickTaskTitle && (
                  <p className="text-xs text-red-500 mt-1">Vui lòng nhập tên công việc</p>
                )}
              </div>

              {/* Mô tả */}
              <div>
                <Label className="text-sm font-medium text-gray-700">Mô tả</Label>
                <Textarea 
                  placeholder="Nhập mô tả chi tiết công việc (tối đa 1000 ký tự)"
                  value={quickTaskDescription}
                  onChange={(e) => setQuickTaskDescription(e.target.value)}
                  className="mt-1.5"
                  rows={3}
                  maxLength={1000}
                />
              </div>

              {/* Ngày đến hạn */}
              <div>
                <Label className="text-sm font-medium text-gray-700">Ngày đến hạn</Label>
                <div className="relative mt-1.5">
                  <Input 
                    type="date"
                    value={quickTaskDeadline}
                    onChange={(e) => setQuickTaskDeadline(e.target.value)}
                    placeholder="Chọn ngày đến hạn"
                  />
                </div>
              </div>

              {/* Ưu tiên */}
              <div>
                <Label className="text-sm font-medium text-gray-700">Ưu tiên</Label>
                <Select value={quickTaskPriority} onValueChange={setQuickTaskPriority}>
                  <SelectTrigger className="mt-1.5">
                    <SelectValue placeholder="Chọn ưu tiên" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Thấp</SelectItem>
                    <SelectItem value="medium">Trung bình</SelectItem>
                    <SelectItem value="high">Cao</SelectItem>
                    <SelectItem value="urgent">Khẩn cấp</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Danh sách việc cần làm */}
              <div>
                <Label className="text-sm font-medium text-gray-700">Danh sách việc cần làm</Label>
                <div className="mt-1.5 border border-gray-200 rounded-lg p-3 flex items-center justify-center">
                  <button className="text-gray-400 hover:text-gray-600">
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Người phụ trách & Loại */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-700">Người phụ trách <span className="text-red-500">*</span></Label>
                  <Select value={quickTaskAssignee} onValueChange={setQuickTaskAssignee}>
                    <SelectTrigger className="mt-1.5">
                      <SelectValue placeholder="Chọn người phụ trách" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="user1">Nguyễn Văn A</SelectItem>
                      <SelectItem value="user2">Trần Thị B</SelectItem>
                      <SelectItem value="user3">Lê Văn C</SelectItem>
                    </SelectContent>
                  </Select>
                  {!quickTaskAssignee && (
                    <p className="text-xs text-red-500 mt-1">Vui lòng chọn người phụ trách</p>
                  )}
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Loại</Label>
                  <Select value={quickTaskType} onValueChange={setQuickTaskType}>
                    <SelectTrigger className="mt-1.5">
                      <SelectValue placeholder="Leads" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Leads">Leads</SelectItem>
                      <SelectItem value="Sales">Sales</SelectItem>
                      <SelectItem value="Support">Support</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Nhãn */}
              <div>
                <Label className="text-sm font-medium text-gray-700">Nhãn</Label>
                <div className="flex flex-wrap gap-2 mt-1.5">
                  {[
                    { value: 'later', label: 'Khách hẹn mua sau', color: 'bg-gray-100 text-gray-700 border-gray-300' },
                    { value: 'potential', label: 'Khách tiềm năng', color: 'bg-green-100 text-green-700 border-green-300' },
                    { value: 'not_interested', label: 'Khách không quan tâm', color: 'bg-red-100 text-red-700 border-red-300' },
                  ].map((tag) => (
                    <button
                      key={tag.value}
                      onClick={() => {
                        setQuickTaskTags(prev => 
                          prev.includes(tag.value) 
                            ? prev.filter(t => t !== tag.value)
                            : [...prev, tag.value]
                        )
                      }}
                      className={cn(
                        "px-3 py-1 text-xs rounded-full border transition-all",
                        quickTaskTags.includes(tag.value) 
                          ? tag.color + ' border-2'
                          : 'bg-white text-gray-500 border-gray-200 hover:border-gray-400'
                      )}
                    >
                      {tag.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Ghi chú nội bộ */}
              <div>
                <Label className="text-sm font-medium text-gray-700">Ghi chú nội bộ</Label>
                <Textarea 
                  placeholder="Nhập ghi chú nội bộ"
                  value={quickTaskInternalNote}
                  onChange={(e) => setQuickTaskInternalNote(e.target.value)}
                  className="mt-1.5"
                  rows={2}
                />
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t bg-gray-50">
              <Button
                variant="outline"
                onClick={() => {
                  setShowQuickTaskModal(false)
                  setQuickTaskTitle('')
                  setQuickTaskDescription('')
                  setQuickTaskDeadline('')
                  setQuickTaskPriority('')
                  setQuickTaskAssignee('')
                  setQuickTaskType('Leads')
                  setQuickTaskTags([])
                  setQuickTaskInternalNote('')
                }}
              >
                Hủy
              </Button>
              <Button
                onClick={() => {
                  console.log('Task created:', {
                    title: quickTaskTitle,
                    description: quickTaskDescription,
                    deadline: quickTaskDeadline,
                    priority: quickTaskPriority,
                    assignee: quickTaskAssignee,
                    type: quickTaskType,
                    tags: quickTaskTags,
                    internalNote: quickTaskInternalNote
                  })
                  setShowQuickTaskModal(false)
                  setQuickTaskTitle('')
                  setQuickTaskDescription('')
                  setQuickTaskDeadline('')
                  setQuickTaskPriority('')
                  setQuickTaskAssignee('')
                  setQuickTaskType('Leads')
                  setQuickTaskTags([])
                  setQuickTaskInternalNote('')
                }}
                disabled={!quickTaskTitle.trim() || !quickTaskAssignee}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Tạo công việc
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Quick Note Modal */}
      {showQuickNoteModal && selectedLeadForQuickAction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="flex items-center justify-between p-6 border-b">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Thêm ghi chú</h3>
                <p className="text-sm text-gray-600 mt-1">Lead: {selectedLeadForQuickAction.name}</p>
              </div>
              <button 
                onClick={() => {
                  setShowQuickNoteModal(false)
                  setQuickNoteContent('')
                  setQuickNoteFiles([])
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              {/* Nội dung ghi chú */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Nội dung ghi chú</label>
                <Textarea 
                  rows={4}
                  placeholder="Nhập nội dung ghi chú..."
                  value={quickNoteContent}
                  onChange={(e) => setQuickNoteContent(e.target.value)}
                  className="w-full"
                />
              </div>

              {/* Đính kèm file */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Đính kèm file (tùy chọn)</label>
                <div className="flex items-center space-x-2">
                  <input 
                    multiple 
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.gif" 
                    className="hidden" 
                    id="quick-note-file-input" 
                    type="file"
                    onChange={(e) => {
                      if (e.target.files) {
                        setQuickNoteFiles(Array.from(e.target.files))
                      }
                    }}
                  />
                  <label 
                    htmlFor="quick-note-file-input" 
                    className="flex items-center px-3 py-2 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50 transition-colors"
                  >
                    <Paperclip className="w-4 h-4 mr-2 text-gray-600" />
                    <span className="text-sm text-gray-700">Chọn file</span>
                  </label>
                </div>
                {quickNoteFiles.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {quickNoteFiles.map((file, idx) => (
                      <div key={idx} className="flex items-center justify-between text-xs bg-gray-50 px-2 py-1 rounded">
                        <span className="truncate">{file.name}</span>
                        <button 
                          onClick={() => setQuickNoteFiles(prev => prev.filter((_, i) => i !== idx))}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                <p className="text-xs text-gray-500 mt-1">Hỗ trợ: PDF, Word, Excel, hình ảnh. Tối đa 10MB/file.</p>
              </div>

              {/* Ghi chú hiện có */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Ghi chú hiện có (3)</label>
                <div className="max-h-32 overflow-y-auto bg-gray-50 rounded-md p-3">
                  <div className="text-xs text-gray-600 mb-2">
                    <div className="font-medium">18/1/2024 - Nhân viên A</div>
                    <div className="text-gray-800">Đã liên hệ tư vấn sản phẩm</div>
                  </div>
                  <div className="text-xs text-gray-600 mb-2">
                    <div className="font-medium">19/1/2024 - Nhân viên B</div>
                    <div className="text-gray-800">Khách hàng quan tâm gói Premium</div>
                  </div>
                  <div className="text-xs text-gray-500 italic">... và 1 ghi chú khác</div>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 p-6 border-t bg-gray-50 rounded-b-lg">
              <button 
                onClick={() => {
                  setShowQuickNoteModal(false)
                  setQuickNoteContent('')
                  setQuickNoteFiles([])
                }}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
              >
                Hủy
              </button>
              <button 
                disabled={!quickNoteContent.trim()}
                onClick={() => {
                  console.log('Note added:', quickNoteContent, quickNoteFiles)
                  setShowQuickNoteModal(false)
                  setQuickNoteContent('')
                  setQuickNoteFiles([])
                }}
                className={cn(
                  "px-4 py-2 rounded-md transition-colors flex items-center gap-2",
                  quickNoteContent.trim() 
                    ? "bg-yellow-600 text-white hover:bg-yellow-700" 
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                )}
              >
                <StickyNote className="w-4 h-4" />
                Thêm ghi chú
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quick Order Modal */}
      {showQuickOrderModal && selectedLeadForQuickAction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] sm:max-h-[80vh] overflow-y-auto mx-4">
            <div className="px-4 sm:px-6 py-4 border-b border-gray-200 sticky top-0 bg-white z-10">
              <div className="flex justify-between items-center">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900">Tạo đơn hàng - {selectedLeadForQuickAction.name}</h3>
                <button 
                  onClick={() => {
                    setShowQuickOrderModal(false)
                    setQuickOrderProducts([])
                    setQuickOrderProductVariant({})
                    setQuickOrderDiscount('0')
                    setQuickOrderPaymentMethod('cash')
                    setQuickOrderNote('')
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                <strong>Lưu ý:</strong> Chọn sản phẩm/dịch vụ để tạo đơn hàng cho lead này.
              </p>
            </div>
            <div className="px-4 sm:px-6 py-4">
              {/* Chọn sản phẩm */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Chọn sản phẩm <span className="text-red-500">*</span>
                </label>
                <div className="max-h-64 overflow-y-auto space-y-3 border border-gray-300 rounded-lg p-3">
                  {[
                    { id: 'crm-basic', name: 'CRM Basic', desc: 'Hệ thống CRM cơ bản cho doanh nghiệp nhỏ', price: 500000 },
                    { id: 'crm-pro', name: 'CRM Professional', desc: 'Hệ thống CRM chuyên nghiệp với nhiều tính năng nâng cao', price: 1200000, hasVariant: true },
                    { id: 'crm-enterprise', name: 'CRM Enterprise', desc: 'Hệ thống CRM doanh nghiệp với đầy đủ tính năng', price: 2500000 },
                    { id: 'ai-analytics', name: 'AI Analytics Module', desc: 'Module phân tích dữ liệu với AI', price: 800000 },
                    { id: 'marketing-auto', name: 'Marketing Automation', desc: 'Tự động hóa marketing và email campaigns', price: 600000 },
                    { id: 'sales-dashboard', name: 'Sales Dashboard Pro', desc: 'Dashboard bán hàng chuyên nghiệp', price: 400000 },
                    { id: 'mobile-license', name: 'Mobile App License', desc: 'Giấy phép sử dụng ứng dụng di động', price: 300000 },
                  ].map((product) => (
                    <div key={product.id} className="border border-gray-200 rounded-lg p-3 bg-white">
                      <label className="flex items-start space-x-3 cursor-pointer">
                        <input 
                          type="checkbox"
                          checked={quickOrderProducts.includes(product.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setQuickOrderProducts([...quickOrderProducts, product.id])
                            } else {
                              setQuickOrderProducts(quickOrderProducts.filter(p => p !== product.id))
                              const newVariants = {...quickOrderProductVariant}
                              delete newVariants[product.id]
                              setQuickOrderProductVariant(newVariants)
                            }
                          }}
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{product.name}</h4>
                          <p className="text-sm text-gray-600">{product.desc}</p>
                          <p className="text-sm font-semibold text-green-600">{product.price.toLocaleString('vi-VN')} VNĐ</p>
                        </div>
                      </label>
                      {product.hasVariant && quickOrderProducts.includes(product.id) && (
                        <div className="ml-6 mt-2 p-2 bg-gray-50 rounded">
                          <label className="block text-xs font-medium text-gray-700 mb-1">Chọn gói:</label>
                          <select 
                            className="w-full text-sm border border-gray-300 rounded px-2 py-1"
                            value={quickOrderProductVariant[product.id] || 'standard'}
                            onChange={(e) => setQuickOrderProductVariant({...quickOrderProductVariant, [product.id]: e.target.value})}
                          >
                            <option value="standard">Gói Standard - Sản phẩm cơ bản</option>
                            <option value="plus">Gói Plus (+400.000 VNĐ) - Thêm AI Analytics</option>
                            <option value="premium">Gói Premium (+800.000 VNĐ) - Full modules + premium support</option>
                          </select>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Mã giảm giá */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Mã giảm giá (%)</label>
                <div className="flex items-center space-x-2">
                  <Input 
                    type="number"
                    min="0"
                    max="100"
                    placeholder="0"
                    value={quickOrderDiscount}
                    onChange={(e) => setQuickOrderDiscount(e.target.value)}
                    className="flex-1"
                  />
                  <span className="text-sm text-gray-500">%</span>
                </div>
                <p className="mt-1 text-xs text-gray-500">Nhập từ 0-100% để áp dụng giảm giá</p>
              </div>

              {/* Hình thức thanh toán */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Hình thức thanh toán</label>
                <div className="grid grid-cols-2 gap-3">
                  <label className={cn(
                    "flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors",
                    quickOrderPaymentMethod === 'cash' ? "border-blue-500 bg-blue-50" : "border-gray-300"
                  )}>
                    <input 
                      type="radio" 
                      value="cash" 
                      checked={quickOrderPaymentMethod === 'cash'}
                      onChange={(e) => setQuickOrderPaymentMethod(e.target.value)}
                      className="h-4 w-4 text-blue-600"
                    />
                    <span className="ml-2 text-sm text-gray-700">💵 Tiền mặt</span>
                  </label>
                  <label className={cn(
                    "flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors",
                    quickOrderPaymentMethod === 'bank_transfer' ? "border-blue-500 bg-blue-50" : "border-gray-300"
                  )}>
                    <input 
                      type="radio" 
                      value="bank_transfer" 
                      checked={quickOrderPaymentMethod === 'bank_transfer'}
                      onChange={(e) => setQuickOrderPaymentMethod(e.target.value)}
                      className="h-4 w-4 text-blue-600"
                    />
                    <span className="ml-2 text-sm text-gray-700">🏦 Chuyển khoản</span>
                  </label>
                </div>
              </div>

              {/* Tổng hợp */}
              {quickOrderProducts.length > 0 && (
                <>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                    <h5 className="text-sm font-medium text-blue-800 mb-2">Đã chọn {quickOrderProducts.length} sản phẩm:</h5>
                    <div className="space-y-1">
                      {quickOrderProducts.map(productId => {
                        const product = [
                          { id: 'crm-basic', name: 'CRM Basic', price: 500000 },
                          { id: 'crm-pro', name: 'CRM Professional', price: 1200000 },
                          { id: 'crm-enterprise', name: 'CRM Enterprise', price: 2500000 },
                          { id: 'ai-analytics', name: 'AI Analytics Module', price: 800000 },
                          { id: 'marketing-auto', name: 'Marketing Automation', price: 600000 },
                          { id: 'sales-dashboard', name: 'Sales Dashboard Pro', price: 400000 },
                          { id: 'mobile-license', name: 'Mobile App License', price: 300000 },
                        ].find(p => p.id === productId)
                        const variant = quickOrderProductVariant[productId]
                        const variantPrice = variant === 'plus' ? 400000 : variant === 'premium' ? 800000 : 0
                        return (
                          <div key={productId} className="flex justify-between text-xs text-blue-700">
                            <span>{product?.name}{variant && variant !== 'standard' ? ` (${variant})` : ''}</span>
                            <span className="font-medium">{((product?.price || 0) + variantPrice).toLocaleString('vi-VN')} VNĐ</span>
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                    <h5 className="text-sm font-medium text-green-800 mb-2">Tổng hợp giá trị đơn hàng</h5>
                    {(() => {
                      const products = [
                        { id: 'crm-basic', price: 500000 },
                        { id: 'crm-pro', price: 1200000 },
                        { id: 'crm-enterprise', price: 2500000 },
                        { id: 'ai-analytics', price: 800000 },
                        { id: 'marketing-auto', price: 600000 },
                        { id: 'sales-dashboard', price: 400000 },
                        { id: 'mobile-license', price: 300000 },
                      ]
                      const subtotal = quickOrderProducts.reduce((sum, pid) => {
                        const product = products.find(p => p.id === pid)
                        const variant = quickOrderProductVariant[pid]
                        const variantPrice = variant === 'plus' ? 400000 : variant === 'premium' ? 800000 : 0
                        return sum + (product?.price || 0) + variantPrice
                      }, 0)
                      const discount = parseInt(quickOrderDiscount) || 0
                      const total = subtotal * (1 - discount / 100)
                      return (
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Tổng tiền gốc:</span>
                            <span className="font-medium">{subtotal.toLocaleString('vi-VN')} VNĐ</span>
                          </div>
                          {discount > 0 && (
                            <div className="flex justify-between text-red-600">
                              <span>Giảm giá ({discount}%):</span>
                              <span className="font-medium">-{(subtotal * discount / 100).toLocaleString('vi-VN')} VNĐ</span>
                            </div>
                          )}
                          <div className="flex justify-between font-medium text-green-700 border-t border-green-300 pt-2">
                            <span>Tổng thành tiền:</span>
                            <span className="text-base">{total.toLocaleString('vi-VN')} VNĐ</span>
                          </div>
                          <div className="text-xs text-green-600 mt-1">
                            💰 Phương thức thanh toán: <span className="font-medium">{quickOrderPaymentMethod === 'cash' ? 'Tiền mặt' : 'Chuyển khoản'}</span>
                          </div>
                        </div>
                      )
                    })()}
                  </div>
                </>
              )}

              <p className="text-sm text-gray-600">
                Lead sẽ được chuyển sang trạng thái "Chờ thanh toán" với các sản phẩm đã chọn.
              </p>
            </div>
            <div className="px-4 sm:px-6 py-4 border-t border-gray-200 flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 sticky bottom-0 bg-white">
              <button 
                onClick={() => {
                  setShowQuickOrderModal(false)
                  setQuickOrderProducts([])
                  setQuickOrderProductVariant({})
                  setQuickOrderDiscount('0')
                  setQuickOrderPaymentMethod('cash')
                  setQuickOrderNote('')
                }}
                className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100 border border-slate-300 rounded-lg hover:bg-slate-200 transition-all"
              >
                Hủy
              </button>
              <button 
                disabled={quickOrderProducts.length === 0}
                onClick={() => {
                  console.log('Order created:', {
                    products: quickOrderProducts,
                    variants: quickOrderProductVariant,
                    discount: quickOrderDiscount,
                    paymentMethod: quickOrderPaymentMethod
                  })
                  setShowQuickOrderModal(false)
                  setQuickOrderProducts([])
                  setQuickOrderProductVariant({})
                  setQuickOrderDiscount('0')
                  setQuickOrderPaymentMethod('cash')
                  setQuickOrderNote('')
                }}
                className={cn(
                  "w-full sm:w-auto px-4 py-2 text-sm font-medium border border-transparent rounded-lg transition-all flex items-center justify-center gap-2",
                  quickOrderProducts.length > 0
                    ? "text-white bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg"
                    : "text-gray-400 bg-gray-300 cursor-not-allowed"
                )}
              >
                <CheckCircle className="w-4 h-4" />
                <span className="truncate">Xác nhận tạo đơn ({quickOrderProducts.length} SP)</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Unpin Confirmation Dialog */}
      <Dialog open={showUnpinDialog} onOpenChange={setShowUnpinDialog}>
        <DialogContent className="max-w-sm w-[calc(100vw-2rem)] sm:w-full">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">Bỏ ghim tin nhắn</DialogTitle>
            <DialogDescription>
              Bạn có chắc muốn bỏ ghim nội dung này không?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => {
                setShowUnpinDialog(false)
                setMessageToUnpin(null)
              }}
            >
              Không
            </Button>
            <Button
              onClick={executeUnpin}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              Bỏ ghim
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reminder Dialog */}
      <Dialog open={showReminderDialog} onOpenChange={setShowReminderDialog}>
        <DialogContent className="max-w-md w-[calc(100vw-2rem)] sm:w-full">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold flex items-center gap-2">
              <Bell className="w-5 h-5 text-blue-500" />
              {!editingReminder ? 'Sửa lịch hẹn' : 'Tạo nhắc hẹn'}
            </DialogTitle>
            <DialogDescription>
              {!editingReminder 
                ? 'Chỉnh sửa thông tin nhắc hẹn của bạn'
                : 'Đặt lịch nhắc hẹn để không bỏ lỡ công việc quan trọng'
              }
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4 px-6">
            {/* Related message preview */}
            {reminderMessage && (
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-xs text-gray-500 mb-1">Tin nhắn liên quan:</p>
                <p className="text-sm text-gray-700 line-clamp-2">{reminderMessage.content}</p>
              </div>
            )}

            {/* Reminder title */}
            <div>
              <Label htmlFor="reminder-title" className="text-sm font-medium text-gray-700">
                Tiêu đề nhắc hẹn
              </Label>
              <Input
                id="reminder-title"
                placeholder="VD: Gọi lại khách hàng..."
                className="mt-1"
                value={reminderTitle}
                onChange={(e) => setReminderTitle(e.target.value)}
              />
            </div>

            {/* Date and Time */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="reminder-date" className="text-sm font-medium text-gray-700">
                  Ngày
                </Label>
                <Input
                  id="reminder-date"
                  type="date"
                  className="mt-1"
                  value={reminderDate}
                  onChange={(e) => setReminderDate(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="reminder-time" className="text-sm font-medium text-gray-700">
                  Giờ
                </Label>
                <Input
                  id="reminder-time"
                  type="time"
                  className="mt-1"
                  value={reminderTime}
                  onChange={(e) => setReminderTime(e.target.value)}
                />
              </div>
            </div>

            {/* Repeat option */}
            <div>
              <Label htmlFor="reminder-repeat" className="text-sm font-medium text-gray-700">
                Chọn kiểu lặp lại (vd: Lặp lại hằng tuần)
              </Label>
              <Select value={reminderRepeat} onValueChange={(value: 'none' | 'daily' | 'weekly' | 'monthly') => setReminderRepeat(value)}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Chọn kiểu lặp lại" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Không lặp lại</SelectItem>
                  <SelectItem value="daily">Hằng ngày</SelectItem>
                  <SelectItem value="weekly">Hằng tuần</SelectItem>
                  <SelectItem value="monthly">Hằng tháng</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Note */}
            <div>
              <Label htmlFor="reminder-note" className="text-sm font-medium text-gray-700">
                Ghi chú (tùy chọn)
              </Label>
              <Textarea
                id="reminder-note"
                placeholder="Thêm ghi chú..."
                className="mt-1"
                rows={3}
                value={reminderNote}
                onChange={(e) => setReminderNote(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setShowReminderDialog(false)
                setReminderMessage(null)
                setEditingReminder(null)
              }}
            >
              Hủy
            </Button>
            <Button
              onClick={saveReminder}
              className="bg-blue-500 hover:bg-blue-600"
              disabled={!reminderTitle.trim()}
            >
              <Bell className="w-4 h-4 mr-1" />
              {editingReminder ? 'Lưu' : 'Tạo nhắc hẹn'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Reminder Confirmation Dialog */}
      <Dialog open={showDeleteReminderDialog} onOpenChange={setShowDeleteReminderDialog}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">
              Hủy nhắc hẹn
            </DialogTitle>
            <DialogDescription>
              Bạn có chắc muốn hủy nhắc hẹn này?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setShowDeleteReminderDialog(false)}
            >
              Không
            </Button>
            <Button
              onClick={executeDeleteReminder}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              Có
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
