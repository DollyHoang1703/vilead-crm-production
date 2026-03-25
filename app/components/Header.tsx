'use client'

import { useState, useEffect } from 'react'
import { Search, Bell, User, LogOut, Crown, Mail, Phone, Camera, Eye, EyeOff, Upload, Save, X, Settings } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  DropdownMenuGroup,
} from '@/components/ui/dropdown-menu'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

// Sample notifications data
const notifications = [
  {
    id: 1,
    type: "urgent",
    category: "customer",
    title: "Chuyển tiếp nhận khách hàng",
    message: "Khách hàng Phạm Thị Thơm - 0989595927 ...",
    time: "9 giờ trước",
    read: false,
  },
  {
    id: 2,
    type: "important", 
    category: "orders",
    title: "Tạo mới đơn hàng",
    message: "Đơn hàng DH-001 của sản phẩm Đào tạo k...",
    time: "12 giờ trước",
    read: false,
  },
  {
    id: 3,
    type: "normal",
    category: "orders",
    title: "Tạo mới đơn hàng",
    message: "Đơn hàng DH-26-0000003 của sản phẩm ...",
    time: "1 ngày trước",
    read: true,
  },
  {
    id: 4,
    type: "urgent",
    category: "customer",
    title: "Yêu cầu tiếp nhận khách hàng",
    message: "Bạn có yêu cầu tiếp nhận khách hàng Trần ...",
    time: "4 ngày trước", 
    read: false,
  },
  {
    id: 5,
    type: "normal",
    category: "customer",
    title: "Yêu cầu tiếp nhận khách hàng",
    message: "Bạn có yêu cầu tiếp nhận khách hàng Nguy...",
    time: "4 ngày trước",
    read: false,
  },
  {
    id: 6,
    type: "normal",
    category: "orders",
    title: "Tạo mới đơn hàng",
    message: "Đơn hàng DH-26-0000002 của sản phẩm ...",
    time: "5 ngày trước",
    read: false,
  },
  {
    id: 7,
    type: "normal",
    category: "customer",
    title: "Yêu cầu tiếp nhận khách hàng",
    message: "Bạn có yêu cầu tiếp nhận khách hàng ...",
    time: "5 ngày trước",
    read: true,
  },
  {
    id: 8,
    type: "important",
    category: "leads",
    title: "Lead mới từ Website",
    message: "Lead Nguyễn Văn A quan tâm gói dịch vụ",
    time: "30 phút trước",
    read: false,
  },
  {
    id: 9,
    type: "normal",
    category: "tasks",
    title: "Task đến hạn",
    message: "Hoàn thành báo cáo doanh số tháng",
    time: "2 ngày trước",
    read: true,
  },
  {
    id: 10,
    type: "urgent",
    category: "leads",
    title: "Lead hot cần xử lý",
    message: "Lead cần xử lý trong ngày hôm nay",
    time: "3 giờ trước",
    read: false,
  },
  {
    id: 11,
    type: "important",
    category: "orders",
    title: "Đơn hàng cần xác nhận",
    message: "Đơn hàng #DH001 cần xác nhận thanh toán",
    time: "15 phút trước",
    read: false,
  },
  {
    id: 12,
    type: "normal", 
    category: "orders",
    title: "Giao hàng thành công",
    message: "Đơn hàng #DH002 đã được giao thành công",
    time: "2 giờ trước",
    read: true,
  },
  {
    id: 13,
    type: "urgent",
    category: "kpi",
    title: "Cảnh báo KPI",
    message: "KPI doanh số tháng này đang thấp hơn mục tiêu 20%",
    time: "1 giờ trước",
    read: false,
  },
  {
    id: 14,
    type: "important",
    category: "kpi", 
    title: "Báo cáo KPI",
    message: "Báo cáo KPI tuần cần được cập nhật",
    time: "hôm qua",
    read: false,
  },
  {
    id: 15,
    type: "normal",
    category: "orders",
    title: "Đơn hàng VIP",
    message: "Đơn hàng mới từ khách hàng VIP",
    time: "6 giờ trước",
    read: true,
  }
]

export default function Header() {
  const [searchQuery, setSearchQuery] = useState('')
  const [unreadCount, setUnreadCount] = useState(4)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  
  // Notification tab state
  const [activeNotificationTab, setActiveNotificationTab] = useState('all')
  const [showMoreTabsDropdown, setShowMoreTabsDropdown] = useState(false)
  const [showNotificationSettings, setShowNotificationSettings] = useState(false)
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false)
  const [showUnreadOnly, setShowUnreadOnly] = useState(false)
  
  // Notifications state - make it stateful so we can update read status
  const [notificationsList, setNotificationsList] = useState(notifications)
  
  // Notifications modal states
  const [showNotificationsModal, setShowNotificationsModal] = useState(false)
  const [showAllNotificationsModal, setShowAllNotificationsModal] = useState(false)
  const [notificationDateFilter, setNotificationDateFilter] = useState('')
  const [notificationTypeFilter, setNotificationTypeFilter] = useState('all')
  
  // Modal states for create new functionality
  const [showCreateLeadModal, setShowCreateLeadModal] = useState(false)
  const [showCreateOrderModal, setShowCreateOrderModal] = useState(false)
  const [showCreateTaskModal, setShowCreateTaskModal] = useState(false)
  const [showCreateAppointmentModal, setShowCreateAppointmentModal] = useState(false)
  const [showCreateReportModal, setShowCreateReportModal] = useState(false)
  const [showCreateCustomerModal, setShowCreateCustomerModal] = useState(false)
  const [showEmailCampaignModal, setShowEmailCampaignModal] = useState(false)

  // Profile modal states
  const [showProfileModal, setShowProfileModal] = useState(false)
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  
  // Profile form data
  const [profileData, setProfileData] = useState({
    name: 'Nguyễn Văn Anh',
    email: 'nguyenvananh@company.com',
    phone: '+84 901 234 567',
    position: 'Sales Manager',
    department: 'Kinh doanh',
    avatar: ''
  })
  
  // Password form data
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  // Handle create actions
  const handleCreateLead = (type = 'general') => {
    setShowCreateLeadModal(true)
    console.log(`Creating lead of type: ${type}`)
  }

  const handleCreateOrder = () => {
    setShowCreateOrderModal(true)
    console.log('Creating new order')
  }

  const handleCreateTask = () => {
    setShowCreateTaskModal(true)
    console.log('Creating new task')
  }

  const handleCreateAppointment = () => {
    setShowCreateAppointmentModal(true)
    console.log('Creating new appointment')
  }

  const handleCreateReport = () => {
    setShowCreateReportModal(true)
    console.log('Creating new report')
  }

  const handleCreateCustomer = (type = 'individual') => {
    setShowCreateCustomerModal(true)
    console.log(`Creating customer of type: ${type}`)
  }

  const handleCreateEmailCampaign = () => {
    setShowEmailCampaignModal(true)
    console.log('Creating email campaign')
  }

  // Profile handlers
  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setProfileData(prev => ({
          ...prev,
          avatar: e.target?.result as string
        }))
        // Auto-save avatar immediately
        console.log('Avatar updated and saved automatically')
        alert('Avatar đã được cập nhật thành công!')
      }
      reader.readAsDataURL(file)
    }
  }

  const handleProfileSave = () => {
    // This function is no longer used since we only allow avatar changes
    // and avatar is auto-saved on change
    console.log('Profile save called (deprecated)')
  }

  const handlePasswordChange = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('Mật khẩu xác nhận không khớp!')
      return
    }
    if (passwordData.newPassword.length < 6) {
      alert('Mật khẩu mới phải có ít nhất 6 ký tự!')
      return
    }
    console.log('Changing password')
    alert('Mật khẩu đã được thay đổi thành công!')
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' })
    setShowPasswordModal(false)
  }

  // Filter notifications based on active tab
  const getFilteredNotifications = () => {
    let filtered = notificationsList
    
    // Filter by category
    if (activeNotificationTab !== 'all') {
      filtered = filtered.filter(notification => notification.category === activeNotificationTab)
    }
    
    // Filter by unread status
    if (showUnreadOnly) {
      filtered = filtered.filter(notification => !notification.read)
    }
    
    return filtered
  }
  
  // Handle notification click - mark as read
  const handleNotificationClick = (notificationId: number) => {
    setNotificationsList(notificationsList.map(n => 
      n.id === notificationId ? { ...n, read: true } : n
    ))
    // Update unread count
    const newUnreadCount = notificationsList.filter(n => !n.read && n.id !== notificationId).length
    setUnreadCount(newUnreadCount)
  }

  // Filter notifications for modal popup
  // Filter notifications for modal popup
  const getFilteredNotificationsForModal = () => {
    let filtered = notificationsList

    // Filter by type/category
    if (notificationTypeFilter !== 'all') {
      filtered = filtered.filter(notification => {
        // If filtering by category (leads, customer, tasks, orders, kpi)
        if (['leads', 'customer', 'tasks', 'orders', 'kpi'].includes(notificationTypeFilter)) {
          return notification.category === notificationTypeFilter
        }
        // If filtering by priority (urgent, important, normal)
        else if (['urgent', 'important', 'normal'].includes(notificationTypeFilter)) {
          return notification.type === notificationTypeFilter
        }
        return true
      })
    }

    // Filter by date
    if (notificationDateFilter) {
      const today = new Date()
      const filterDate = new Date()
      
      switch(notificationDateFilter) {
        case 'today':
          // Show notifications from today
          filtered = filtered.filter(notification => {
            // Simple filter - in real app, you'd compare actual dates
            return notification.time.includes('phút') || notification.time.includes('giờ')
          })
          break
        case 'yesterday':
          filtered = filtered.filter(notification => notification.time.includes('hôm qua'))
          break
        case 'week':
          filtered = filtered.filter(notification => 
            notification.time.includes('ngày') || 
            notification.time.includes('phút') || 
            notification.time.includes('giờ')
          )
          break
        case 'month':
          // Show all for month filter
          break
      }
    }

    return filtered
  }

  const handleCreateTemplate = (type: string) => {
    console.log(`Creating template: ${type}`)
    // Navigate to template creation page or open template modal
    if (type === 'b2b') {
      handleCreateLead('b2b')
    } else if (type === 'ecommerce') {
      handleCreateLead('ecommerce')
    }
  }

  // Live clock state
  const [currentTime, setCurrentTime] = useState(new Date())
  
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  // Get time-based greeting with icon
  const getGreeting = () => {
    const hour = currentTime.getHours()
    if (hour >= 5 && hour < 10) {
      return {
        text: 'Chào buổi sáng',
        icon: (
          <svg viewBox="0 0 24 24" className="w-7 h-7" fill="none">
            <circle cx="12" cy="8" r="4" fill="#FBBF24" />
            <path d="M12 1v2M12 14v2M4.93 4.93l1.41 1.41M17.66 6.34l1.41-1.41M1 12h2M21 12h2M4.93 19.07l1.41-1.41M17.66 17.66l1.41 1.41" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" />
            <path d="M2 20h20" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" />
            <path d="M4 18c0-4.418 3.582-8 8-8s8 3.582 8 8" stroke="#FBBF24" strokeWidth="2" strokeLinecap="round" fill="none" />
          </svg>
        ),
        gradient: 'from-amber-500 to-orange-400'
      }
    } else if (hour >= 10 && hour < 13) {
      return {
        text: 'Chào buổi sáng',
        icon: (
          <svg viewBox="0 0 24 24" className="w-7 h-7" fill="none">
            <circle cx="12" cy="12" r="5" fill="#FBBF24" />
            <path d="M12 2v3M12 19v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M2 12h3M19 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" />
          </svg>
        ),
        gradient: 'from-yellow-400 to-amber-500'
      }
    } else if (hour >= 13 && hour < 17) {
      return {
        text: 'Chào buổi chiều',
        icon: (
          <svg viewBox="0 0 24 24" className="w-7 h-7" fill="none">
            <circle cx="12" cy="12" r="5" fill="#FB923C" />
            <path d="M12 2v3M12 19v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M2 12h3M19 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12" stroke="#F97316" strokeWidth="2" strokeLinecap="round" />
          </svg>
        ),
        gradient: 'from-orange-400 to-amber-500'
      }
    } else if (hour >= 17 && hour < 20) {
      return {
        text: 'Chào buổi tối',
        icon: (
          <svg viewBox="0 0 24 24" className="w-7 h-7" fill="none">
            <circle cx="12" cy="10" r="5" fill="#FB923C" />
            <path d="M12 1v2M4.22 4.22l1.41 1.41M1 12h2M4.22 19.78l1.41-1.41M19.78 4.22l-1.41 1.41M23 12h-2M19.78 19.78l-1.41-1.41" stroke="#EA580C" strokeWidth="2" strokeLinecap="round" />
            <path d="M2 20h20" stroke="#EA580C" strokeWidth="2" strokeLinecap="round" />
            <path d="M3 18c2-3 5-6 9-6s7 3 9 6" stroke="#F97316" strokeWidth="2" strokeLinecap="round" fill="none" />
          </svg>
        ),
        gradient: 'from-orange-500 to-red-400'
      }
    } else {
      return {
        text: 'Chào buổi tối',
        icon: (
          <svg viewBox="0 0 24 24" className="w-7 h-7" fill="none">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" fill="#FCD34D" stroke="#F59E0B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="8" cy="6" r="1" fill="#FEF3C7" opacity="0.9" />
            <circle cx="18" cy="4" r="0.7" fill="#FEF3C7" opacity="0.7" />
            <circle cx="16" cy="9" r="0.5" fill="#FEF3C7" opacity="0.6" />
            <circle cx="5" cy="15" r="0.6" fill="#FEF3C7" opacity="0.5" />
            <circle cx="20" cy="16" r="0.8" fill="#FEF3C7" opacity="0.8" />
          </svg>
        ),
        gradient: 'from-indigo-500 to-purple-500'
      }
    }
  }

  const greeting = getGreeting()

  const currentDate = new Date().toLocaleDateString('vi-VN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Searching for:", searchQuery)
  }

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Greeting Section */}
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            {greeting.icon}
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              {greeting.text}, {profileData.name}
            </h2>
            <p className="text-sm text-gray-500">
              {currentTime.toLocaleDateString('vi-VN', { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' })}
              {' | '}
              {currentTime.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-4">
          
          {/* Notifications */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="sm" className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6">
                  <path d="M12 22C13.1 22 14 21.1 14 20H10C10 21.1 10.9 22 12 22ZM18 16V11C18 7.93 16.37 5.36 13.5 4.68V4C13.5 3.17 12.83 2.5 12 2.5C11.17 2.5 10.5 3.17 10.5 4V4.68C7.64 5.36 6 7.92 6 11V16L4 18V19H20V18L18 16Z" fill="currentColor"/>
                </svg>
                {unreadCount > 0 && (
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-1 -right-1 w-5 h-5 text-xs flex items-center justify-center"
                  >
                    {unreadCount}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[450px] p-0" align="end">
              <div className="flex flex-col h-full">
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-base text-gray-800">Thông Báo</h3>
                    <div className="flex items-center gap-1 bg-gray-100 rounded-full p-0.5">
                      <button 
                        className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
                          !showUnreadOnly ? 'bg-blue-500 text-white' : 'text-gray-600 hover:text-gray-800'
                        }`}
                        onClick={() => setShowUnreadOnly(false)}
                      >
                        Tất cả
                      </button>
                      <button 
                        className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
                          showUnreadOnly ? 'bg-blue-500 text-white' : 'text-gray-600 hover:text-gray-800'
                        }`}
                        onClick={() => setShowUnreadOnly(true)}
                      >
                        Chưa đọc
                      </button>
                    </div>
                  </div>
                  <div className="relative">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 w-8 p-0"
                      onClick={() => setShowNotificationSettings(!showNotificationSettings)}
                    >
                      <Settings className="w-4 h-4" />
                    </Button>
                    
                    {showNotificationSettings && (
                      <>
                        <div 
                          className="fixed inset-0 z-10" 
                          onClick={() => setShowNotificationSettings(false)}
                        />
                        <div className="absolute top-full right-0 mt-1 w-40 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
                          <button
                            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                            onClick={() => {
                              // Mark all as read
                              setNotificationsList(notificationsList.map(n => ({ ...n, read: true })))
                              setUnreadCount(0)
                              setShowNotificationSettings(false)
                            }}
                          >
                            Đánh dấu đọc tất cả
                          </button>
                          <button
                            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                            onClick={() => {
                              setShowNotificationSettings(false)
                              setShowAllNotificationsModal(true)
                            }}
                          >
                            Xem tất cả
                          </button>
                          <button
                            className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 transition-colors"
                            onClick={() => {
                              setShowNotificationSettings(false)
                              setShowDeleteConfirmation(true)
                            }}
                          >
                            Xóa tất cả
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Tabs */}
                <div className="flex items-center gap-0 px-4 border-b">
                  <button 
                    className={`px-4 py-3 text-xs font-bold whitespace-nowrap border-b-2 transition-colors ${
                      activeNotificationTab === 'all' 
                        ? 'border-blue-600 text-blue-600' 
                        : 'border-transparent text-gray-600 hover:text-gray-800'
                    }`}
                    onClick={() => setActiveNotificationTab('all')}
                  >
                    Tất cả
                  </button>
                  <button 
                    className={`px-4 py-3 text-xs font-bold whitespace-nowrap border-b-2 transition-colors ${
                      activeNotificationTab === 'orders' 
                        ? 'border-blue-600 text-blue-600' 
                        : 'border-transparent text-gray-600 hover:text-gray-800'
                    }`}
                    onClick={() => setActiveNotificationTab('orders')}
                  >
                    Đơn hàng
                  </button>
                  <button 
                    className={`px-4 py-3 text-xs font-bold whitespace-nowrap border-b-2 transition-colors ${
                      activeNotificationTab === 'customer' 
                        ? 'border-blue-600 text-blue-600' 
                        : 'border-transparent text-gray-600 hover:text-gray-800'
                    }`}
                    onClick={() => setActiveNotificationTab('customer')}
                  >
                    Khách hàng
                  </button>
                  <button 
                    className={`px-4 py-3 text-xs font-bold whitespace-nowrap border-b-2 transition-colors ${
                      activeNotificationTab === 'tasks' 
                        ? 'border-blue-600 text-blue-600' 
                        : 'border-transparent text-gray-600 hover:text-gray-800'
                    }`}
                    onClick={() => setActiveNotificationTab('tasks')}
                  >
                    Công việc
                  </button>
                  
                  {/* More tabs dropdown */}
                  <div className="relative">
                    <button 
                      className="px-3 py-3 text-xs font-bold text-gray-600 hover:text-gray-800 border-b-2 border-transparent"
                      onClick={() => setShowMoreTabsDropdown(!showMoreTabsDropdown)}
                    >
                      ...
                    </button>
                    
                    {showMoreTabsDropdown && (
                      <>
                        <div 
                          className="fixed inset-0 z-10" 
                          onClick={() => setShowMoreTabsDropdown(false)}
                        />
                        <div className="absolute top-full right-0 mt-1 w-40 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-20">
                          <button
                            className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                            onClick={() => {
                              setActiveNotificationTab('products')
                              setShowMoreTabsDropdown(false)
                            }}
                          >
                            Sản phẩm
                          </button>
                          <button
                            className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                            onClick={() => {
                              setActiveNotificationTab('payment')
                              setShowMoreTabsDropdown(false)
                            }}
                          >
                            Thanh toán
                          </button>
                          <button
                            className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                            onClick={() => {
                              setActiveNotificationTab('events')
                              setShowMoreTabsDropdown(false)
                            }}
                          >
                            Sự kiện
                          </button>
                          <button
                            className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                            onClick={() => {
                              setActiveNotificationTab('link-notifications')
                              setShowMoreTabsDropdown(false)
                            }}
                          >
                            Thông báo link
                          </button>
                          <button
                            className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                            onClick={() => {
                              setActiveNotificationTab('system')
                              setShowMoreTabsDropdown(false)
                            }}
                          >
                            Hệ thống
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Notifications List */}
                <div className="flex-1 overflow-y-auto max-h-[400px]">
                  {getFilteredNotifications().length === 0 ? (
                    <div className="text-center py-12">
                      <p className="text-gray-500 text-sm">Không có thông báo nào</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-gray-100">
                      {getFilteredNotifications().map((notification) => (
                        <div 
                          key={notification.id} 
                          className={`relative px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer ${
                            !notification.read ? 'bg-blue-50/30' : ''
                          }`}
                          onClick={() => handleNotificationClick(notification.id)}
                        >
                          <div className="flex items-start gap-3">
                            {/* Avatar */}
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center flex-shrink-0 shadow-sm">
                              <User className="w-5 h-5 text-white" />
                            </div>
                            
                            {/* Content */}
                            <div className="flex-1 min-w-0 pr-6">
                              <div className="flex items-start justify-between gap-2">
                                <div className="flex-1">
                                  <p className="text-sm font-medium leading-relaxed">
                                    <span className="text-blue-600">
                                      {notification.category === 'customer' && 'Khách hàng'}
                                      {notification.category === 'orders' && 'Đơn hàng'}
                                      {notification.category === 'leads' && 'Cơ hội'}
                                      {notification.category === 'tasks' && 'Công việc'}
                                      {notification.category === 'kpi' && 'KPI'}
                                      {notification.category === 'calendar' && 'Lịch hẹn'}
                                      {notification.category === 'quote' && 'Báo giá'}
                                    </span>
                                    <span className="text-gray-400 mx-1">•</span>
                                    <span className="text-gray-900">{notification.title}</span>
                                  </p>
                                  <p className="text-xs text-gray-600 mt-1 line-clamp-1">
                                    {notification.message}
                                  </p>
                                  <p className="text-xs text-gray-400 mt-1.5 flex items-center gap-1">
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    {notification.time}
                                  </p>
                                </div>
                              </div>
                            </div>

                            {/* Close button */}
                            <button 
                              className="absolute top-1/2 -translate-y-1/2 right-3 text-gray-400 hover:text-gray-600 transition-colors p-1 flex-shrink-0"
                              onClick={(e) => {
                                e.stopPropagation()
                                // Handle remove notification
                              }}
                            >
                              <X className="w-4 h-4" />
                            </button>
                            
                            {/* Unread indicator dot */}
                            {!notification.read && (
                              <div className="absolute right-10 top-1/2 -translate-y-1/2">
                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </PopoverContent>
          </Popover>

          {/* User Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-10 flex items-center space-x-2 p-2" type="button">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-blue-600" />
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium text-gray-900">Nguyễn Văn Anh</p>
                  <p className="text-xs text-gray-500">Sales Manager</p>
                </div>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-72 p-4">
              {/* User Info Section */}
              <div className="flex items-center space-x-3 mb-4">
                <div className="relative">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src="/avatars/user-avatar.jpg" alt="Nguyễn Văn Anh" />
                    <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold">
                      NVA
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-1 -right-1">
                    <div className="w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-gray-900">Nguyễn Văn Anh</h3>
                    <Badge variant="secondary" className="text-xs">
                      <Crown className="w-3 h-3 mr-1" />
                      Pro
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">Sales Manager</p>
                  <div className="flex items-center text-xs text-gray-500 mt-1">
                    <Mail className="w-3 h-3 mr-1" />
                    nguyenvananh@company.com
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-2 mb-4 p-3 bg-gray-50 rounded-lg">
                <div className="text-center">
                  <div className="font-semibold text-blue-600">45</div>
                  <div className="text-xs text-gray-600">Leads</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-green-600">12</div>
                  <div className="text-xs text-gray-600">Deals</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-purple-600">89%</div>
                  <div className="text-xs text-gray-600">Target</div>
                </div>
              </div>

              <DropdownMenuSeparator className="my-3" />

              {/* Account Menu */}
              <DropdownMenuGroup>
                <DropdownMenuLabel className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Tài khoản
                </DropdownMenuLabel>
                <DropdownMenuItem 
                  className="cursor-pointer"
                  onClick={() => setShowProfileModal(true)}
                >
                  <User className="w-4 h-4 mr-3 text-gray-500" />
                  <div>
                    <div className="font-medium">Hồ sơ cá nhân</div>
                    <div className="text-xs text-gray-500">Xem và chỉnh sửa thông tin</div>
                  </div>
                </DropdownMenuItem>
              </DropdownMenuGroup>

              <DropdownMenuSeparator className="my-3" />

              {/* Logout */}
              <DropdownMenuItem className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50">
                <LogOut className="w-4 h-4 mr-3" />
                <div>
                  <div className="font-medium">Đăng xuất</div>
                  <div className="text-xs opacity-75">Thoát khỏi tài khoản</div>
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Create Lead Modal */}
      {showCreateLeadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl p-8 w-[600px] max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                👤 Tạo Lead mới
                <span className="text-sm font-normal text-gray-500">| Khách hàng tiềm năng</span>
              </h3>
              <button 
                onClick={() => setShowCreateLeadModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Thông tin cơ bản */}
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-800 border-b pb-2">📋 Thông tin cơ bản</h4>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Họ và tên *</label>
                  <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="Nguyễn Văn A" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Số điện thoại *</label>
                  <input type="tel" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="0901234567" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                  <input type="email" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="email@example.com" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Công ty/Tổ chức</label>
                  <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="Công ty ABC" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Chức vụ</label>
                  <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="Giám đốc, Trưởng phòng..." />
                </div>
              </div>

              {/* Thông tin phân loại */}
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-800 border-b pb-2">🎯 Phân loại & Nguồn</h4>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nguồn lead *</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option value="">Chọn nguồn</option>
                    <option value="website">Website</option>
                    <option value="facebook">Facebook</option>
                    <option value="google">Google Ads</option>
                    <option value="referral">Giới thiệu</option>
                    <option value="event">Sự kiện</option>
                    <option value="cold_call">Cold Call</option>
                    <option value="other">Khác</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Loại khách hàng</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option value="individual">Cá nhân</option>
                    <option value="business">Doanh nghiệp</option>
                    <option value="enterprise">Tập đoàn</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sản phẩm quan tâm</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option value="">Chọn sản phẩm</option>
                    <option value="basic">Gói Basic</option>
                    <option value="premium">Gói Premium</option>
                    <option value="enterprise">Gói Enterprise</option>
                    <option value="custom">Tùy chỉnh</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Mức độ quan tâm</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option value="hot">🔥 Nóng - Cần liên hệ ngay</option>
                    <option value="warm">🟡 Ấm - Quan tâm</option>
                    <option value="cold">❄️ Lạnh - Tìm hiểu</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Budget dự kiến</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option value="">Chưa xác định</option>
                    <option value="under_10m">Dưới 10 triệu</option>
                    <option value="10_50m">10-50 triệu</option>
                    <option value="50_100m">50-100 triệu</option>
                    <option value="over_100m">Trên 100 triệu</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Thông tin bổ sung */}
            <div className="mt-6 space-y-4">
              <h4 className="font-semibold text-gray-800 border-b pb-2">📝 Thông tin bổ sung</h4>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Ghi chú</label>
                <textarea className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" rows={3} placeholder="Ghi chú về khách hàng, yêu cầu đặc biệt..."></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Thời gian dự kiến quyết định</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  <option value="">Chưa xác định</option>
                  <option value="immediate">Ngay lập tức</option>
                  <option value="week">Trong tuần</option>
                  <option value="month">Trong tháng</option>
                  <option value="quarter">Trong quý</option>
                  <option value="later">Sau 3 tháng</option>
                </select>
              </div>
            </div>

            {/* Phân công */}
            <div className="mt-6 space-y-4">
              <h4 className="font-semibold text-gray-800 border-b pb-2">👥 Phân công xử lý</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Assign cho Sales</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option value="">Auto assign</option>
                    <option value="sales1">Nguyễn Văn Sales</option>
                    <option value="sales2">Trần Thị Sale</option>
                    <option value="sales3">Lê Văn Bán</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Ưu tiên xử lý</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option value="normal">Bình thường</option>
                    <option value="high">Cao</option>
                    <option value="urgent">Khẩn cấp</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-6 border-t mt-6">
              <button className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                ✅ Tạo Lead & Assign
              </button>
              <button className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium">
                📝 Tạo & Tạo tiếp
              </button>
              <button 
                onClick={() => setShowCreateLeadModal(false)}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Order Modal */}
      {showCreateOrderModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl p-8 w-[700px] max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                🛒 Tạo đơn hàng mới
                <span className="text-sm font-normal text-gray-500">| Đơn bán hàng</span>
              </h3>
              <button 
                onClick={() => setShowCreateOrderModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Thông tin khách hàng */}
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-800 border-b pb-2">👤 Thông tin khách hàng</h4>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Khách hàng *</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option value="">Tìm và chọn khách hàng</option>
                    <option value="kh1">Nguyễn Văn A - 0901234567</option>
                    <option value="kh2">Trần Thị B - 0987654321</option>
                    <option value="kh3">Công ty ABC - 0912345678</option>
                    <option value="new">+ Tạo khách hàng mới</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Loại đơn hàng</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option value="product">Bán sản phẩm</option>
                    <option value="service">Cung cấp dịch vụ</option>
                    <option value="subscription">Đăng ký định kỳ</option>
                    <option value="combo">Combo/Package</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Salesperson phụ trách</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option value="me">Tôi</option>
                    <option value="sales1">Nguyễn Văn Sales</option>
                    <option value="sales2">Trần Thị Sale</option>
                    <option value="team">Chia sẻ team</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Ngày giao hàng dự kiến</label>
                  <input type="date" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                </div>
              </div>

              {/* Thông tin thanh toán */}
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-800 border-b pb-2">💳 Thanh toán & Giao hàng</h4>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phương thức thanh toán</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option value="cash">Tiền mặt</option>
                    <option value="transfer">Chuyển khoản</option>
                    <option value="credit">Thẻ tín dụng</option>
                    <option value="installment">Trả góp</option>
                    <option value="cod">COD</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Điều khoản thanh toán</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option value="immediate">Thanh toán ngay</option>
                    <option value="deposit">Đặt cọc 50%</option>
                    <option value="net15">Net 15 ngày</option>
                    <option value="net30">Net 30 ngày</option>
                    <option value="custom">Tùy chỉnh</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Địa chỉ giao hàng</label>
                  <textarea className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" rows={2} placeholder="Nhập địa chỉ giao hàng"></textarea>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Ghi chú đơn hàng</label>
                  <textarea className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" rows={2} placeholder="Yêu cầu đặc biệt, ghi chú..."></textarea>
                </div>
              </div>
            </div>

            {/* Sản phẩm/Dịch vụ */}
            <div className="mt-6 space-y-4">
              <h4 className="font-semibold text-gray-800 border-b pb-2">📦 Sản phẩm/Dịch vụ</h4>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="grid grid-cols-12 gap-3 mb-3">
                  <div className="col-span-4">
                    <label className="block text-xs font-medium text-gray-600 mb-1">Sản phẩm/Dịch vụ</label>
                    <select className="w-full px-2 py-2 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500">
                      <option value="">Chọn sản phẩm</option>
                      <option value="basic">Gói Basic - 5,000,000 VNĐ</option>
                      <option value="premium">Gói Premium - 10,000,000 VNĐ</option>
                      <option value="enterprise">Gói Enterprise - 20,000,000 VNĐ</option>
                      <option value="custom">Tùy chỉnh</option>
                    </select>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs font-medium text-gray-600 mb-1">Số lượng</label>
                    <input type="number" className="w-full px-2 py-2 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500" defaultValue="1" min="1" />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs font-medium text-gray-600 mb-1">Đơn giá</label>
                    <input type="text" className="w-full px-2 py-2 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500" placeholder="5,000,000" />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs font-medium text-gray-600 mb-1">Giảm giá (%)</label>
                    <input type="number" className="w-full px-2 py-2 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500" placeholder="0" min="0" max="100" />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs font-medium text-gray-600 mb-1">Thành tiền</label>
                    <input type="text" className="w-full px-2 py-2 text-sm border border-gray-300 rounded bg-gray-100" value="5,000,000" readOnly />
                  </div>
                </div>
                <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">+ Thêm sản phẩm/dịch vụ</button>
              </div>
            </div>

            {/* Tổng kết */}
            <div className="mt-6 bg-blue-50 p-4 rounded-lg">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h5 className="font-semibold text-gray-800">💰 Tổng kết đơn hàng</h5>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>Tạm tính:</span>
                      <span>5,000,000 VNĐ</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Giảm giá:</span>
                      <span>-0 VNĐ</span>
                    </div>
                    <div className="flex justify-between">
                      <span>VAT (10%):</span>
                      <span>500,000 VNĐ</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg border-t pt-1">
                      <span>Tổng cộng:</span>
                      <span className="text-blue-600">5,500,000 VNĐ</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <h5 className="font-semibold text-gray-800">📊 Thông tin bổ sung</h5>
                  <div className="space-y-2">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Mã đơn hàng</label>
                      <input type="text" className="w-full px-2 py-1 text-sm border border-gray-300 rounded" placeholder="Auto generate" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Ưu tiên xử lý</label>
                      <select className="w-full px-2 py-1 text-sm border border-gray-300 rounded">
                        <option value="normal">Bình thường</option>
                        <option value="high">Cao</option>
                        <option value="urgent">Khẩn cấp</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-6 border-t mt-6">
              <button className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium">
                💾 Lưu đơn hàng
              </button>
              <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                📄 Lưu & In
              </button>
              <button className="px-6 py-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors font-medium">
                📧 Lưu & Gửi
              </button>
              <button 
                onClick={() => setShowCreateOrderModal(false)}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Task Modal */}
      {showCreateTaskModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl p-8 w-[600px] max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                ✅ Tạo nhiệm vụ mới
                <span className="text-sm font-normal text-gray-500">| Task Management</span>
              </h3>
              <button 
                onClick={() => setShowCreateTaskModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Thông tin cơ bản */}
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-800 border-b pb-2">📋 Thông tin nhiệm vụ</h4>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tiêu đề nhiệm vụ *</label>
                  <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="VD: Gọi điện tư vấn khách hàng ABC" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Loại nhiệm vụ</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option value="call">📞 Gọi điện</option>
                    <option value="email">📧 Gửi email</option>
                    <option value="meeting">🤝 Meeting</option>
                    <option value="demo">🖥️ Demo sản phẩm</option>
                    <option value="follow_up">🔄 Follow up</option>
                    <option value="proposal">📝 Soạn proposal</option>
                    <option value="other">📌 Khác</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Liên quan đến</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option value="">Chọn đối tượng liên quan</option>
                    <option value="lead_1">Lead: Nguyễn Văn A - 0901234567</option>
                    <option value="customer_1">Khách hàng: Công ty ABC</option>
                    <option value="deal_1">Deal: Gói Premium - 10M</option>
                    <option value="general">Công việc chung</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Mức độ ưu tiên</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option value="low">🟢 Thấp</option>
                    <option value="normal">🟡 Bình thường</option>
                    <option value="high">🟠 Cao</option>
                    <option value="urgent">🔴 Khẩn cấp</option>
                  </select>
                </div>
              </div>

              {/* Phân công và thời gian */}
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-800 border-b pb-2">👥 Phân công & Thời gian</h4>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Assign cho</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option value="me">Tôi</option>
                    <option value="team_member_1">Nguyễn Văn Sales</option>
                    <option value="team_member_2">Trần Thị Sale</option>
                    <option value="team_member_3">Lê Văn Bán</option>
                    <option value="multiple">Nhiều người</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Ngày bắt đầu</label>
                    <input type="date" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Hạn hoàn thành *</label>
                    <input type="date" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Giờ bắt đầu</label>
                    <input type="time" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Thời gian dự kiến (phút)</label>
                    <input type="number" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="30" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nhắc nhở trước</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option value="none">Không nhắc nhở</option>
                    <option value="15min">15 phút trước</option>
                    <option value="30min">30 phút trước</option>
                    <option value="1hour">1 giờ trước</option>
                    <option value="1day">1 ngày trước</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Mô tả chi tiết */}
            <div className="mt-6 space-y-4">
              <h4 className="font-semibold text-gray-800 border-b pb-2">📝 Mô tả & Checklist</h4>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Mô tả chi tiết</label>
                <textarea className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" rows={4} placeholder="Mô tả chi tiết nhiệm vụ, các bước cần thực hiện..."></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Checklist (tùy chọn)</label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded border-gray-300" />
                    <input type="text" className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm" placeholder="Bước 1: Chuẩn bị tài liệu" />
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded border-gray-300" />
                    <input type="text" className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm" placeholder="Bước 2: Gọi điện khách hàng" />
                  </div>
                  <button className="text-blue-600 hover:text-blue-700 text-sm">+ Thêm bước</button>
                </div>
              </div>
            </div>

            {/* Tự động hóa */}
            <div className="mt-6 bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-800 mb-3">⚡ Tự động hóa & Theo dõi</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded border-gray-300" />
                    <span className="text-sm">Tự động tạo task tiếp theo khi hoàn thành</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded border-gray-300" />
                    <span className="text-sm">Gửi email thông báo cho khách hàng</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded border-gray-300" />
                    <span className="text-sm">Cập nhật trạng thái lead/deal tự động</span>
                  </label>
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Template task tiếp theo</label>
                    <select className="w-full px-2 py-1 text-sm border border-gray-300 rounded">
                      <option value="">Không có</option>
                      <option value="follow_up">Follow up sau 3 ngày</option>
                      <option value="demo">Lên lịch demo</option>
                      <option value="proposal">Gửi proposal</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Cập nhật stage</label>
                    <select className="w-full px-2 py-1 text-sm border border-gray-300 rounded">
                      <option value="">Không thay đổi</option>
                      <option value="contacted">Đã liên hệ</option>
                      <option value="qualified">Qualified</option>
                      <option value="proposal">Proposal</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-6 border-t mt-6">
              <button className="flex-1 px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium">
                ✅ Tạo nhiệm vụ
              </button>
              <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                📅 Tạo & Lên lịch
              </button>
              <button className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium">
                🔄 Tạo & Tạo tiếp
              </button>
              <button 
                onClick={() => setShowCreateTaskModal(false)}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Appointment Modal */}
      {showCreateAppointmentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl p-8 w-[650px] max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                📅 Tạo cuộc hẹn mới
                <span className="text-sm font-normal text-gray-500">| Meeting/Appointment</span>
              </h3>
              <button 
                onClick={() => setShowCreateAppointmentModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Thông tin cuộc hẹn */}
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-800 border-b pb-2">📋 Thông tin cuộc hẹn</h4>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tiêu đề cuộc hẹn *</label>
                  <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="VD: Demo sản phẩm cho khách hàng ABC" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Loại cuộc hẹn</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option value="consultation">💼 Tư vấn</option>
                    <option value="demo">🖥️ Demo sản phẩm</option>
                    <option value="negotiation">🤝 Đàm phán</option>
                    <option value="contract">📄 Ký hợp đồng</option>
                    <option value="follow_up">🔄 Follow up</option>
                    <option value="training">📚 Đào tạo</option>
                    <option value="support">🛠️ Hỗ trợ kỹ thuật</option>
                    <option value="other">📌 Khác</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Khách hàng/Lead *</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option value="">Chọn khách hàng</option>
                    <option value="lead_1">Lead: Nguyễn Văn A - 0901234567</option>
                    <option value="customer_1">Khách hàng: Công ty ABC</option>
                    <option value="customer_2">Khách hàng: Trần Thị B</option>
                    <option value="prospect">Prospect mới</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Người tham gia nội bộ</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" multiple>
                    <option value="me">Tôi</option>
                    <option value="sales1">Nguyễn Văn Sales</option>
                    <option value="sales2">Trần Thị Sale</option>
                    <option value="manager">Sales Manager</option>
                    <option value="tech">Technical Support</option>
                  </select>
                  <p className="text-xs text-gray-500 mt-1">Giữ Ctrl để chọn nhiều người</p>
                </div>
              </div>

              {/* Thời gian và địa điểm */}
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-800 border-b pb-2">🕒 Thời gian & Địa điểm</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Ngày hẹn *</label>
                    <input type="date" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Giờ bắt đầu *</label>
                    <input type="time" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Thời gian dự kiến (phút)</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option value="30">30 phút</option>
                    <option value="60">1 giờ</option>
                    <option value="90">1.5 giờ</option>
                    <option value="120">2 giờ</option>
                    <option value="custom">Tùy chỉnh</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Hình thức</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option value="office">🏢 Tại văn phòng công ty</option>
                    <option value="customer_place">🏪 Tại văn phòng khách hàng</option>
                    <option value="online">💻 Online (Zoom/Teams)</option>
                    <option value="phone">📞 Qua điện thoại</option>
                    <option value="restaurant">🍽️ Tại nhà hàng</option>
                    <option value="other">📍 Địa điểm khác</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Địa chỉ/Link meeting</label>
                  <textarea className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" rows={2} placeholder="Nhập địa chỉ hoặc link Zoom/Teams..."></textarea>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nhắc nhở trước</label>
                  <div className="space-y-2">
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" className="rounded border-gray-300" defaultChecked />
                      <span className="text-sm">15 phút trước</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" className="rounded border-gray-300" />
                      <span className="text-sm">1 ngày trước</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" className="rounded border-gray-300" />
                      <span className="text-sm">Gửi email nhắc nhở khách hàng</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Nội dung và chuẩn bị */}
            <div className="mt-6 space-y-4">
              <h4 className="font-semibold text-gray-800 border-b pb-2">📝 Nội dung & Chuẩn bị</h4>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Mục đích cuộc hẹn</label>
                <textarea className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" rows={2} placeholder="Mô tả mục đích, nội dung chính của cuộc hẹn..."></textarea>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Agenda/Nội dung</label>
                  <textarea className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" rows={3} placeholder="1. Giới thiệu công ty&#10;2. Demo sản phẩm&#10;3. Q&A&#10;4. Thảo luận giá cả"></textarea>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tài liệu cần chuẩn bị</label>
                  <textarea className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" rows={3} placeholder="- Brochure sản phẩm&#10;- Bảng giá&#10;- Hợp đồng mẫu&#10;- Laptop demo"></textarea>
                </div>
              </div>
            </div>

            {/* Tự động hóa */}
            <div className="mt-6 bg-purple-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-800 mb-3">⚡ Tự động hóa</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded border-gray-300" />
                    <span className="text-sm">Gửi calendar invite cho khách hàng</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded border-gray-300" />
                    <span className="text-sm">Tạo task chuẩn bị trước cuộc hẹn</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded border-gray-300" />
                    <span className="text-sm">Tạo task follow-up sau cuộc hẹn</span>
                  </label>
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Template email invite</label>
                    <select className="w-full px-2 py-1 text-sm border border-gray-300 rounded">
                      <option value="formal">Formal business</option>
                      <option value="friendly">Thân thiện</option>
                      <option value="demo">Demo sản phẩm</option>
                      <option value="custom">Tùy chỉnh</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Follow-up sau</label>
                    <select className="w-full px-2 py-1 text-sm border border-gray-300 rounded">
                      <option value="1hour">1 giờ</option>
                      <option value="1day">1 ngày</option>
                      <option value="3days">3 ngày</option>
                      <option value="1week">1 tuần</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-6 border-t mt-6">
              <button className="flex-1 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium">
                📅 Tạo cuộc hẹn
              </button>
              <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                📧 Tạo & Gửi invite
              </button>
              <button className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium">
                📋 Tạo & Chuẩn bị
              </button>
              <button 
                onClick={() => setShowCreateAppointmentModal(false)}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Email Campaign Modal */}
      {showEmailCampaignModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl p-8 w-[750px] max-w-5xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                📧 Tạo chiến dịch Email
                <span className="text-sm font-normal text-gray-500">| Email Marketing</span>
              </h3>
              <button 
                onClick={() => setShowEmailCampaignModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Thông tin chiến dịch */}
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-800 border-b pb-2">📋 Thông tin chiến dịch</h4>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tên chiến dịch *</label>
                  <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="VD: Flash Sale Tháng 7 2025" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Loại chiến dịch</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option value="promotion">🎯 Khuyến mãi/Sale</option>
                    <option value="newsletter">📰 Newsletter</option>
                    <option value="welcome">👋 Welcome series</option>
                    <option value="nurturing">🌱 Lead nurturing</option>
                    <option value="reactivation">🔄 Re-engagement</option>
                    <option value="announcement">📢 Thông báo</option>
                    <option value="event">🎉 Sự kiện</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Mục tiêu</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option value="sales">💰 Tăng doanh số</option>
                    <option value="leads">👥 Thu thập leads</option>
                    <option value="engagement">💬 Tăng tương tác</option>
                    <option value="retention">🔒 Giữ chân khách hàng</option>
                    <option value="awareness">📣 Nâng cao nhận biết</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Độ ưu tiên</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option value="normal">🟡 Bình thường</option>
                    <option value="high">🟠 Cao</option>
                    <option value="urgent">🔴 Khẩn cấp</option>
                  </select>
                </div>
              </div>

              {/* Đối tượng gửi */}
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-800 border-b pb-2">🎯 Đối tượng gửi</h4>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nhóm đối tượng *</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option value="">Chọn nhóm đối tượng</option>
                    <option value="all_leads">📋 Tất cả leads (2,450 người)</option>
                    <option value="hot_leads">🔥 Leads nóng (156 người)</option>
                    <option value="cold_leads">❄️ Leads lạnh (1,200 người)</option>
                    <option value="customers">✅ Khách hàng hiện tại (340 người)</option>
                    <option value="prospects">👁️ Prospects (890 người)</option>
                    <option value="custom">🎛️ Tùy chỉnh</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Bộ lọc bổ sung</label>
                  <div className="space-y-2">
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                      <option value="">Nguồn leads</option>
                      <option value="website">Website</option>
                      <option value="facebook">Facebook</option>
                      <option value="google">Google Ads</option>
                    </select>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                      <option value="">Sản phẩm quan tâm</option>
                      <option value="basic">Gói Basic</option>
                      <option value="premium">Gói Premium</option>
                      <option value="enterprise">Gói Enterprise</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Loại trừ</label>
                  <div className="space-y-2">
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" className="rounded border-gray-300" />
                      <span className="text-sm">Đã unsubscribe</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" className="rounded border-gray-300" />
                      <span className="text-sm">Email bounce</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" className="rounded border-gray-300" />
                      <span className="text-sm">Đã mua trong 30 ngày</span>
                    </label>
                  </div>
                </div>
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-sm font-medium text-blue-800">Dự kiến gửi: 1,450 emails</p>
                  <p className="text-xs text-blue-600">Chi phí ước tính: 145,000 VNĐ</p>
                </div>
              </div>
            </div>

            {/* Nội dung email */}
            <div className="mt-6 space-y-4">
              <h4 className="font-semibold text-gray-800 border-b pb-2">📝 Nội dung Email</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tiêu đề email *</label>
                  <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="🔥 Flash Sale 50% - Chỉ còn 24h!" />
                  <p className="text-xs text-gray-500 mt-1">Độ dài tối ưu: 30-50 ký tự</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tên người gửi</label>
                  <div className="grid grid-cols-2 gap-2">
                    <input type="text" className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="ViLead Team" />
                    <input type="email" className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="sales@vilead.com" />
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Template email</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  <option value="">Chọn template có sẵn</option>
                  <option value="promotion">🎯 Khuyến mãi sản phẩm</option>
                  <option value="newsletter">📰 Newsletter tháng</option>
                  <option value="welcome">👋 Welcome new leads</option>
                  <option value="follow_up">🔄 Follow up leads</option>
                  <option value="reactivation">💤 Đánh thức leads cũ</option>
                  <option value="custom">✏️ Tạo mới</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nội dung email</label>
                <div className="border border-gray-300 rounded-lg p-4 bg-gray-50 min-h-[200px]">
                  <div className="mb-3 text-sm text-gray-600">
                    🎨 Email Editor - Kéo thả các thành phần
                  </div>
                  <div className="space-y-2">
                    <div className="p-3 bg-white border border-dashed border-gray-300 rounded">
                      <strong>Header:</strong> Logo + Banner khuyến mãi
                    </div>
                    <div className="p-3 bg-white border border-dashed border-gray-300 rounded">
                      <strong>Hero:</strong> Tiêu đề chính + CTA button
                    </div>
                    <div className="p-3 bg-white border border-dashed border-gray-300 rounded">
                      <strong>Content:</strong> Mô tả sản phẩm + Ưu đãi
                    </div>
                    <div className="p-3 bg-white border border-dashed border-gray-300 rounded">
                      <strong>Footer:</strong> Thông tin liên hệ + Unsubscribe
                    </div>
                  </div>
                  <button className="mt-3 text-blue-600 hover:text-blue-700 text-sm font-medium">
                    🎨 Mở Email Builder
                  </button>
                </div>
              </div>
            </div>

            {/* Lập lịch gửi */}
            <div className="mt-6 space-y-4">
              <h4 className="font-semibold text-gray-800 border-b pb-2">⏰ Lập lịch gửi</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Thời gian gửi</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option value="now">Gửi ngay</option>
                    <option value="schedule">Lập lịch</option>
                    <option value="optimal">Tự động tối ưu</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Ngày gửi</label>
                  <input type="date" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Giờ gửi</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option value="09:00">09:00 (Tỷ lệ mở cao)</option>
                    <option value="14:00">14:00 (Tỷ lệ click cao)</option>
                    <option value="19:00">19:00 (Thời gian rảnh)</option>
                    <option value="custom">Tùy chỉnh</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Cài đặt nâng cao */}
            <div className="mt-6 bg-green-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-800 mb-3">⚙️ Cài đặt nâng cao</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded border-gray-300" defaultChecked />
                    <span className="text-sm">A/B test tiêu đề (2 phiên bản)</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded border-gray-300" />
                    <span className="text-sm">Theo dõi mở email</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded border-gray-300" defaultChecked />
                    <span className="text-sm">Theo dõi click links</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded border-gray-300" />
                    <span className="text-sm">Tự động follow up sau 3 ngày</span>
                  </label>
                </div>
                <div className="space-y-2">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">UTM Campaign</label>
                    <input type="text" className="w-full px-2 py-1 text-sm border border-gray-300 rounded" placeholder="flash_sale_july_2025" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Landing page</label>
                    <input type="url" className="w-full px-2 py-1 text-sm border border-gray-300 rounded" placeholder="https://vilead.com/flash-sale" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Tỷ lệ gửi mục tiêu</label>
                    <select className="w-full px-2 py-1 text-sm border border-gray-300 rounded">
                      <option value="100">100%/giờ (Nhanh)</option>
                      <option value="50">50%/giờ (Vừa)</option>
                      <option value="25">25%/giờ (Từ từ)</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-6 border-t mt-6">
              <button className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium">
                🚀 Tạo & Gửi ngay
              </button>
              <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                📅 Lập lịch gửi
              </button>
              <button className="px-6 py-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors font-medium">
                🧪 Test gửi
              </button>
              <button className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium">
                💾 Lưu draft
              </button>
              <button 
                onClick={() => setShowEmailCampaignModal(false)}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Profile Modal */}
      <Dialog open={showProfileModal} onOpenChange={setShowProfileModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <User className="w-5 h-5 text-blue-600" />
              Hồ sơ cá nhân
            </DialogTitle>
            <DialogDescription>
              Cập nhật thông tin cá nhân và mật khẩu của bạn
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="profile">Thông tin</TabsTrigger>
              <TabsTrigger value="password">Mật khẩu</TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="space-y-4">
              {/* Avatar Section */}
              <div className="flex flex-col items-center space-y-4">
                <div className="relative">
                  <Avatar className="w-20 h-20">
                    <AvatarImage src={profileData.avatar} />
                    <AvatarFallback className="text-lg">
                      {profileData.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <label 
                    htmlFor="avatar-upload"
                    className="absolute -bottom-1 -right-1 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700 transition-colors"
                  >
                    <Camera className="w-3 h-3" />
                  </label>
                  <input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                </div>
                <p className="text-sm text-gray-500">Click vào icon camera để thay đổi avatar (tự động lưu)</p>
              </div>

              {/* Profile Form */}
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Họ tên</Label>
                    <Input
                      id="name"
                      value={profileData.name}
                      readOnly
                      className="bg-gray-50 cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <Label htmlFor="position">Chức vụ</Label>
                    <Input
                      id="position"
                      value={profileData.position}
                      readOnly
                      className="bg-gray-50 cursor-not-allowed"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profileData.email}
                    readOnly
                    className="bg-gray-50 cursor-not-allowed"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="phone">Số điện thoại</Label>
                    <Input
                      id="phone"
                      value={profileData.phone}
                      readOnly
                      className="bg-gray-50 cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <Label htmlFor="department">Phòng ban</Label>
                    <Input
                      id="department"
                      value={profileData.department}
                      readOnly
                      className="bg-gray-50 cursor-not-allowed"
                    />
                  </div>
                </div>
                
                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-700">
                    <span className="font-medium">📝 Lưu ý:</span> Chỉ có thể thay đổi avatar. Các thông tin khác cần liên hệ bộ phận HR để cập nhật.
                  </p>
                </div>
              </div>

              <DialogFooter>
                <Button onClick={() => setShowProfileModal(false)}>
                  Đóng
                </Button>
              </DialogFooter>
            </TabsContent>

            <TabsContent value="password" className="space-y-4">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="current-password">Mật khẩu hiện tại</Label>
                  <div className="relative">
                    <Input
                      id="current-password"
                      type={showCurrentPassword ? "text" : "password"}
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                      placeholder="Nhập mật khẩu hiện tại"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    >
                      {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>

                <div>
                  <Label htmlFor="new-password">Mật khẩu mới</Label>
                  <div className="relative">
                    <Input
                      id="new-password"
                      type={showNewPassword ? "text" : "password"}
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                      placeholder="Nhập mật khẩu mới (ít nhất 6 ký tự)"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>

                <div>
                  <Label htmlFor="confirm-password">Xác nhận mật khẩu</Label>
                  <div className="relative">
                    <Input
                      id="confirm-password"
                      type={showConfirmPassword ? "text" : "password"}
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                      placeholder="Nhập lại mật khẩu mới"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>

                {passwordData.newPassword && passwordData.confirmPassword && 
                 passwordData.newPassword !== passwordData.confirmPassword && (
                  <p className="text-sm text-red-600">Mật khẩu xác nhận không khớp</p>
                )}
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setShowProfileModal(false)}>
                  Hủy
                </Button>
                <Button 
                  onClick={handlePasswordChange}
                  disabled={!passwordData.currentPassword || !passwordData.newPassword || 
                           passwordData.newPassword !== passwordData.confirmPassword}
                >
                  <Save className="w-4 h-4 mr-2" />
                  Đổi mật khẩu
                </Button>
              </DialogFooter>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      {/* Notifications Modal */}
      <Dialog open={showNotificationsModal} onOpenChange={setShowNotificationsModal}>
        <DialogContent className="sm:max-w-4xl max-h-[80vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              🔔 Tất cả thông báo
            </DialogTitle>
            <DialogDescription>
              Quản lý và xem chi tiết tất cả thông báo hệ thống
            </DialogDescription>
          </DialogHeader>

          {/* Filters */}
          <div className="flex gap-4 pb-4 border-b">
            <div className="flex-1">
              <Label htmlFor="date-filter" className="text-sm font-medium">Lọc theo thời gian</Label>
              <select
                id="date-filter"
                value={notificationDateFilter}
                onChange={(e) => setNotificationDateFilter(e.target.value)}
                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Tất cả thời gian</option>
                <option value="today">Hôm nay</option>
                <option value="yesterday">Hôm qua</option>
                <option value="week">7 ngày qua</option>
                <option value="month">30 ngày qua</option>
              </select>
            </div>
            <div className="flex-1">
              <Label htmlFor="type-filter" className="text-sm font-medium">Lọc theo loại</Label>
              <select
                id="type-filter"
                value={notificationTypeFilter}
                onChange={(e) => setNotificationTypeFilter(e.target.value)}
                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">Tất cả loại</option>
                <option value="leads">📈 Lead</option>
                <option value="customer">👥 Khách hàng</option>
                <option value="tasks">📋 Công việc</option>
                <option value="orders">🛒 Đơn hàng</option>
                <option value="kpi">📊 KPI</option>
                <option value="urgent">🔴 Khẩn cấp</option>
                <option value="important">🟡 Quan trọng</option>
                <option value="normal">🔵 Thông thường</option>
              </select>
            </div>
            <div className="flex items-end">
              <Button 
                variant="outline" 
                onClick={() => {
                  setNotificationDateFilter('')
                  setNotificationTypeFilter('all')
                }}
                className="text-sm"
              >
                Xóa bộ lọc
              </Button>
            </div>
          </div>

          {/* Notifications List */}
          <div className="max-h-96 overflow-y-auto space-y-3">
            {getFilteredNotificationsForModal().length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">🔔</div>
                <p className="text-gray-500">Không có thông báo nào phù hợp với bộ lọc</p>
              </div>
            ) : (
              getFilteredNotificationsForModal().map((notification) => (
                <div 
                  key={notification.id} 
                  className={`p-4 rounded-lg border transition-colors hover:bg-gray-50 ${
                    notification.type === 'urgent' ? 'border-l-4 border-l-red-500 bg-red-50' :
                    notification.type === 'important' ? 'border-l-4 border-l-yellow-500 bg-yellow-50' :
                    'border-l-4 border-l-blue-500 bg-blue-50'
                  } ${!notification.read ? 'font-medium' : 'opacity-75'}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          notification.type === 'urgent' ? 'bg-red-100 text-red-800' :
                          notification.type === 'important' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {notification.type === 'urgent' ? '🔴 Khẩn cấp' :
                           notification.type === 'important' ? '🟡 Quan trọng' :
                           '🔵 Thông thường'}
                        </span>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                          notification.category === 'leads' ? 'bg-green-100 text-green-800' :
                          notification.category === 'customer' ? 'bg-purple-100 text-purple-800' :
                          notification.category === 'orders' ? 'bg-blue-100 text-blue-800' :
                          notification.category === 'kpi' ? 'bg-red-100 text-red-800' :
                          notification.category === 'tasks' ? 'bg-orange-100 text-orange-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {notification.category === 'leads' ? '📈 Leads' :
                           notification.category === 'customer' ? '👥 Khách hàng' :
                           notification.category === 'orders' ? '� Đơn hàng' :
                           notification.category === 'kpi' ? '📊 KPI' :
                           notification.category === 'tasks' ? '�📋 Công việc' :
                           '📋 Khác'}
                        </span>
                        {!notification.read && (
                          <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                        )}
                      </div>
                      <p className="text-gray-900 mb-1">{notification.message}</p>
                      <p className="text-xs text-gray-500 flex items-center gap-1">
                        🕐 {notification.time}
                      </p>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <Button size="sm" variant="outline" className="text-xs">
                        👁️ Xem
                      </Button>
                      <Button size="sm" variant="outline" className="text-xs">
                        ✅ Đánh dấu đã đọc
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-4 border-t">
            <p className="text-sm text-gray-600">
              Hiển thị {getFilteredNotificationsForModal().length} trong tổng số {notificationsList.length} thông báo
            </p>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setShowNotificationsModal(false)}>
                Đóng
              </Button>
              <Button>
                ✅ Đánh dấu tất cả đã đọc
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* View All Notifications Modal */}
      <Dialog open={showAllNotificationsModal} onOpenChange={setShowAllNotificationsModal}>
        <DialogContent className="max-w-[800px] max-h-[90vh] rounded-[10px] p-0">
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-base text-gray-800">Thông Báo</h3>
                <div className="flex items-center gap-1 bg-gray-100 rounded-full p-0.5">
                  <button 
                    className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
                      showUnreadOnly ? 'text-gray-600 hover:text-gray-800' : 'bg-blue-500 text-white'
                    }`}
                    onClick={() => setShowUnreadOnly(false)}
                  >
                    Tất cả
                  </button>
                  <button 
                    className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
                      showUnreadOnly ? 'bg-blue-500 text-white' : 'text-gray-600 hover:text-gray-800'
                    }`}
                    onClick={() => setShowUnreadOnly(true)}
                  >
                    Chưa đọc
                  </button>
                </div>
              </div>
              <div className="relative">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-[#455560] hover:bg-[#fafafb] rounded-[10px] text-[13px] h-8 w-8 p-0"
                  onClick={() => setShowNotificationSettings(!showNotificationSettings)}
                >
                  <Settings className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-0 px-4 border-b">
              <button 
                className={`px-4 py-3 text-xs font-bold whitespace-nowrap border-b-2 transition-colors ${
                  activeNotificationTab === 'all' 
                    ? 'border-blue-600 text-blue-600' 
                    : 'border-transparent text-gray-600 hover:text-gray-800'
                }`}
                onClick={() => setActiveNotificationTab('all')}
              >
                Tất cả
              </button>
              <button 
                className={`px-4 py-3 text-xs font-bold whitespace-nowrap border-b-2 transition-colors ${
                  activeNotificationTab === 'orders' 
                    ? 'border-blue-600 text-blue-600' 
                    : 'border-transparent text-gray-600 hover:text-gray-800'
                }`}
                onClick={() => setActiveNotificationTab('orders')}
              >
                Đơn hàng
              </button>
              <button 
                className={`px-4 py-3 text-xs font-bold whitespace-nowrap border-b-2 transition-colors ${
                  activeNotificationTab === 'customer' 
                    ? 'border-blue-600 text-blue-600' 
                    : 'border-transparent text-gray-600 hover:text-gray-800'
                }`}
                onClick={() => setActiveNotificationTab('customer')}
              >
                Khách hàng
              </button>
              <button 
                className={`px-4 py-3 text-xs font-bold whitespace-nowrap border-b-2 transition-colors ${
                  activeNotificationTab === 'tasks' 
                    ? 'border-blue-600 text-blue-600' 
                    : 'border-transparent text-gray-600 hover:text-gray-800'
                }`}
                onClick={() => setActiveNotificationTab('tasks')}
              >
                Công việc
              </button>
              
              {/* More tabs dropdown */}
              <div className="relative">
                <button 
                  className="px-3 py-3 text-xs font-bold text-gray-600 hover:text-gray-800 border-b-2 border-transparent"
                  onClick={() => setShowMoreTabsDropdown(!showMoreTabsDropdown)}
                >
                  ...
                </button>
                
                {showMoreTabsDropdown && (
                  <>
                    <div 
                      className="fixed inset-0 z-10" 
                      onClick={() => setShowMoreTabsDropdown(false)}
                    />
                    <div className="absolute top-full right-0 mt-1 w-40 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-20">
                      <button
                        className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        onClick={() => {
                          setActiveNotificationTab('products')
                          setShowMoreTabsDropdown(false)
                        }}
                      >
                        Sản phẩm
                      </button>
                      <button
                        className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        onClick={() => {
                          setActiveNotificationTab('payment')
                          setShowMoreTabsDropdown(false)
                        }}
                      >
                        Thanh toán
                      </button>
                      <button
                        className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        onClick={() => {
                          setActiveNotificationTab('events')
                          setShowMoreTabsDropdown(false)
                        }}
                      >
                        Sự kiện
                      </button>
                      <button
                        className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        onClick={() => {
                          setActiveNotificationTab('link-notifications')
                          setShowMoreTabsDropdown(false)
                        }}
                      >
                        Thông báo link
                      </button>
                      <button
                        className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        onClick={() => {
                          setActiveNotificationTab('system')
                          setShowMoreTabsDropdown(false)
                        }}
                      >
                        Hệ thống
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Notifications List */}
            <div className="flex-1 overflow-y-auto max-h-[600px]">
              <div className="divide-y divide-gray-100">
                {notificationsList
                  .filter(n => activeNotificationTab === 'all' || n.category === activeNotificationTab)
                  .filter(n => !showUnreadOnly || !n.read)
                  .map((notification) => (
                    <div 
                      key={notification.id}
                      className={`relative px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer ${
                        !notification.read ? 'bg-blue-50/30' : ''
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center flex-shrink-0 shadow-sm">
                          <User className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1 min-w-0 pr-6">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1">
                              <p className="text-sm font-medium leading-relaxed">
                                <span className="text-blue-600">
                                  {notification.category === 'leads' ? 'Cơ hội' :
                                   notification.category === 'customer' ? 'Khách hàng' :
                                   notification.category === 'orders' ? 'Đơn hàng' :
                                   notification.category === 'kpi' ? 'KPI' :
                                   notification.category === 'tasks' ? 'Công việc' : 'Khác'}
                                </span>
                                <span className="text-gray-400 mx-1">•</span>
                                <span className="text-gray-900">{notification.title}</span>
                              </p>
                              <p className="text-xs text-gray-600 mt-1 line-clamp-1">
                                {notification.message}
                              </p>
                              <p className="text-xs text-gray-400 mt-1.5 flex items-center gap-1">
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {notification.time}
                              </p>
                            </div>
                          </div>
                        </div>
                        <button 
                          className="absolute top-1/2 -translate-y-1/2 right-3 text-gray-400 hover:text-gray-600 transition-colors p-1 flex-shrink-0"
                          onClick={(e) => {
                            e.stopPropagation()
                            setNotificationsList(prev => prev.filter(n => n.id !== notification.id))
                          }}
                        >
                          <X className="w-4 h-4" />
                        </button>
                        {!notification.read && (
                          <div className="absolute right-10 top-1/2 -translate-y-1/2">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between px-4 py-3 border-t">
              <p className="text-sm text-gray-600">
                Hiển thị {notificationsList.filter(n => activeNotificationTab === 'all' || n.category === activeNotificationTab).filter(n => !showUnreadOnly || !n.read).length} thông báo
              </p>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => setShowAllNotificationsModal(false)}
                >
                  Đóng
                </Button>
                <Button
                  onClick={() => {
                    setNotificationsList(prev => prev.map(n => ({ ...n, read: true })))
                    setUnreadCount(0)
                  }}
                >
                  Đánh dấu đọc tất cả
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete All Notifications Confirmation Dialog */}
      <Dialog open={showDeleteConfirmation} onOpenChange={setShowDeleteConfirmation}>
        <DialogContent className="max-w-sm rounded-[10px]">
          <DialogHeader className="border-b border-[#e6ebf1] pb-4">
            <DialogTitle className="text-lg font-semibold text-[#1a3353]">
              Xác nhận xóa
            </DialogTitle>
          </DialogHeader>
          <div className="px-6 py-4">
            <p className="text-sm text-gray-600">
              Bạn có muốn xóa tất cả thông báo không?
            </p>
          </div>
          <DialogFooter className="border-t border-[#e6ebf1] pt-4 flex-row justify-end gap-2">
            <Button 
              variant="outline" 
              onClick={() => setShowDeleteConfirmation(false)}
              className="border-[#e6ebf1] text-[#455560] hover:bg-[#f0f7ff] hover:border-[#699dff] hover:text-[#699dff]"
            >
              Hủy
            </Button>
            <Button 
              onClick={() => {
                setNotificationsList([])
                setUnreadCount(0)
                setShowDeleteConfirmation(false)
              }}
              className="bg-[#ff6b72] text-white border border-[#ff6b72] hover:bg-[#ff9496] hover:border-[#ff9496] active:bg-[#d9505c] active:border-[#d9505c]"
            >
              Xóa
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </header>
  )
}