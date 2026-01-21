'use client'

import { useState, useEffect } from 'react'
import {
  LayoutDashboard,
  UserPlus,
  Target,
  BarChart3,
  Settings,
  Building2,
  UserCheck,
  ShoppingCart,
  CheckSquare,
  FileText,
  ChevronLeft,
  ChevronRight,
  X,
  CreditCard,
  MessageSquare
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from '@/lib/utils'

interface SidebarProps {
  currentView: string
  setCurrentView: (view: string) => void
  isOpen?: boolean
  onClose?: () => void
  userRole?: string
  onRoleChange?: (role: string) => void
}

// Hàm lấy thời gian hiện tại theo múi giờ Việt Nam
function getCurrentTime() {
  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Asia/Ho_Chi_Minh'
  }).format(new Date());
}

// Menu items with role-based access control
const getMenuItemsByRole = (userRole: string = 'sale') => {
  const allMenuItems = [
    {
      id: 'dashboard',
      icon: LayoutDashboard,
      label: "Tổng quan",
      iconText: "📊",
      tooltip: "Tổng quan: Dashboard theo vai trò",
      roles: ["admin", "ceo", "leader", "sale", "accountant"],
      disabled: false
    },
    {
      id: 'sales',
      icon: Target,
      label: "Hoạt động bán hàng",
      iconText: "🚀",
      tooltip: "Hoạt động bán hàng: Quản lý tổng thể Lead và Deal",
      roles: ["admin", "ceo", "leader", "sale"],
      disabled: false
    },    {
      id: 'customers',
      icon: UserCheck,
      label: "Chăm sóc Khách hàng",
      iconText: "👤",
      tooltip: "Chăm sóc Khách hàng: Thông tin và lịch sử khách hàng",
      roles: ["admin", "ceo", "leader", "sale", "accountant"],
      disabled: false
    },    {
      id: 'orders',
      icon: ShoppingCart,
      label: "Quản lý Đơn hàng",
      iconText: "🛒",
      tooltip: "Quản lý Đơn hàng: Trạng thái và hóa đơn",
      roles: ["admin", "ceo", "leader", "sale", "accountant"],
      disabled: false
    },
    {
      id: 'tasks',
      icon: CheckSquare,
      label: "Quản lý Công việc",
      iconText: "✅",
      tooltip: "Quản lý Công việc: Task và tiến độ",
      roles: ["admin", "ceo", "leader", "sale"],
      disabled: false
    },
    {
      id: 'kpi',
      icon: BarChart3,
      label: "Quản lý KPI",
      iconText: "📈",
      tooltip: "Quản lý KPI: Thiết lập và theo dõi chỉ số hiệu suất",
      roles: ["admin", "ceo", "leader"],
      disabled: false
    },
    {
      id: 'chat',
      icon: MessageSquare,
      label: "Quản lý Chat",
      iconText: "💬",
      tooltip: "Quản lý Chat: Tin nhắn và hội thoại với khách hàng",
      roles: ["admin", "ceo", "leader", "sale"],
      disabled: false
    },
    /*
    {
      id: 'reports',
      icon: FileText,
      label: "Báo cáo",
      iconText: "📊",
      tooltip: "Báo cáo: Doanh số, hiệu suất và KPIs",
      roles: ["admin", "ceo", "leader", "accountant"],
      disabled: true
    },
    */
    {
      id: 'settings',
      icon: Settings,
      label: "Cài đặt",
      iconText: "⚙️",
      tooltip: "Cài đặt: Hệ thống, tích hợp và quản lý công ty",
      roles: ["admin"],
      disabled: false
    },
  ];

  return allMenuItems.filter(item => item.roles.includes(userRole));
};

export default function VileadSidebar({ 
  currentView, 
  setCurrentView, 
  isOpen = true, 
  onClose, 
  userRole: propUserRole, 
  onRoleChange 
}: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [currentTime, setCurrentTime] = useState(getCurrentTime());
  const [userRole, setUserRole] = useState(propUserRole || 'admin'); // Default to admin for full access

  const menuItems = getMenuItemsByRole(userRole);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(getCurrentTime());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  // Sync với prop userRole từ parent
  useEffect(() => {
    if (propUserRole && propUserRole !== userRole) {
      setUserRole(propUserRole);
    }
  }, [propUserRole, userRole]);

  const handleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleRoleChange = (newRole: string) => {
    setUserRole(newRole);
    if (onRoleChange) {
      onRoleChange(newRole);
    }
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={cn(
        "fixed left-0 top-0 h-full bg-white border-r border-gray-200 z-50 transition-all duration-300 flex flex-col",
        isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        isCollapsed ? "w-16" : "w-64"
      )}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          {!isCollapsed && (
            <>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">V</span>
                </div>
                <div>
                  <h1 className="text-lg font-bold text-gray-900">ViLead CRM</h1>
                  <p className="text-xs text-gray-500">
                    {userRole === 'admin' ? 'Admin Dashboard' : 
                     userRole === 'ceo' ? 'CEO Dashboard' :
                     userRole === 'leader' ? 'Leader Sale Dashboard' : 
                     userRole === 'accountant' ? 'Kế toán Dashboard' :
                     'Sale Dashboard'}
                  </p>
                </div>
              </div>
              {onClose && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="lg:hidden"
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </>
          )}
          
          {/* Collapse button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCollapse}
            className={cn("hidden lg:flex", isCollapsed && "mx-auto")}
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </Button>
        </div>

        {/* Role Switcher */}
        {!isCollapsed && (
          <div className="px-4 py-3 border-b border-gray-200">
            <div className="space-y-2">
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                Quyền truy cập
              </label>
              <Select value={userRole} onValueChange={handleRoleChange}>
                <SelectTrigger className="w-full h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">👑 Admin (Toàn quyền)</SelectItem>
                  <SelectItem value="ceo">🏢 CEO (Xem tất cả)</SelectItem>
                  <SelectItem value="leader">👥 Leader (Nhóm A)</SelectItem>
                  <SelectItem value="accountant">🧮 Kế toán (Tài chính)</SelectItem>
                  <SelectItem value="sale">👤 Sale (Cá nhân)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            const isDisabled = item.disabled;
            
            return (
              <button
                key={item.id}
                onClick={() => {
                  if (!isDisabled) {
                    setCurrentView(item.id)
                  }
                }}
                disabled={isDisabled}
                className={cn(
                  "w-full flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 group",
                  isDisabled 
                    ? "cursor-not-allowed opacity-50 text-gray-400" 
                    : "cursor-pointer",
                  !isDisabled && isActive 
                    ? "bg-blue-50 text-blue-600 shadow-sm border border-blue-100" 
                    : !isDisabled 
                      ? "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                      : "text-gray-400"
                )}
                title={isCollapsed ? item.tooltip : (isDisabled ? `${item.tooltip} (Tạm thời không khả dụng)` : "")}
              >
                <div className={cn(
                  "flex items-center justify-center w-6 h-6",
                  isDisabled
                    ? "text-gray-400"
                    : isActive 
                      ? "text-blue-600" 
                      : "text-gray-500 group-hover:text-gray-700"
                )}>
                  <Icon className="w-5 h-5" />
                </div>
                
                {!isCollapsed && (
                  <span className={cn(
                    "font-medium text-sm truncate flex-1 text-left",
                    isDisabled && "text-gray-400"
                  )}>
                    {item.label}
                    {isDisabled && (
                      <span className="ml-2 text-xs text-gray-400">(Tạm khóa)</span>
                    )}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </>
  );
}
