'use client'

import React, { useState } from 'react'
import {
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Users,
  Calendar,
  TrendingUp,
  ChevronDown,
  Link2,
  Send,
  Eye,
  Copy,
  Trash2,
  Edit,
  Play,
  Pause,
  AlertTriangle
} from 'lucide-react'
import ZbsConnectionModal from './ZbsConnectionModal'
import { ZbsCampaignCreator } from './ZbsCampaignCreator'
import { ZbsConfirmStartModal } from './ZbsConfirmStartModal'
import { ZbsCampaignDetailModal } from './ZbsCampaignDetailModal'
import { StopCircle, BarChart2 } from 'lucide-react'

interface ZbsCampaign {
  id: string
  name: string
  status: 'draft' | 'running' | 'paused' | 'scheduled' | 'sent' | 'cancelled'
  recipientCount: number
  scheduledAt?: string
}

// ==================== MOCK DATA ====================
const mockCampaigns: ZbsCampaign[] = [
  {
    id: 'zbs-1',
    name: 'Draft - Test thời gian gửi',
    status: 'draft',
    recipientCount: 295,
  },
  {
    id: 'zbs-2',
    name: 'Khảo sát khách hàng Q1',
    status: 'draft',
    recipientCount: 275,
  },
  {
    id: 'zbs-3',
    name: 'Giới thiệu sản phẩm mới',
    status: 'running',
    recipientCount: 780,
    scheduledAt: '31/01/2026 17:00'
  },
  {
    id: 'zbs-4',
    name: 'Tin nhắn chào mừng tự động',
    status: 'scheduled',
    recipientCount: 195,
    scheduledAt: '31/01/2026 16:00'
  },
  {
    id: 'zbs-5',
    name: 'Thông báo ưu đãi Tết 2026',
    status: 'sent',
    recipientCount: 1200,
    scheduledAt: '15/01/2026 09:00'
  },
  {
    id: 'zbs-6',
    name: 'Nhắc hẹn tự động',
    status: 'scheduled',
    recipientCount: 45,
    scheduledAt: '05/04/2026 08:00',
  },
]

const mockConnectedOAs = [
  {
    id: 'oa-1',
    name: 'CCycle AI - Marketing và CSKH',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=CCycle',
    status: 'connected'
  },
  {
    id: 'oa-2',
    name: 'Vilead - Hỗ trợ doanh nghiệp',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=VileadOA',
    status: 'connected'
  }
]

// ==================== STATUS HELPERS ====================
const getStatusConfig = (status: string) => {
  switch (status) {
    case 'draft':
      return { label: 'Nháp', color: 'text-blue-600', dot: 'bg-blue-500' }
    case 'running':
      return { label: 'Đang chạy', color: 'text-green-600', dot: 'bg-green-500' }
    case 'paused':
      return { label: 'Tạm dừng', color: 'text-orange-600', dot: 'bg-orange-500' }
    case 'cancelled':
      return { label: 'Đã hủy', color: 'text-red-600', dot: 'bg-red-500' }
    case 'sent':
      return { label: 'Đã gửi', color: 'text-gray-600', dot: 'bg-gray-400' }
    case 'scheduled':
      return { label: 'Đã lên lịch', color: 'text-purple-600', dot: 'bg-purple-500' }
    default:
      return { label: status, color: 'text-gray-600', dot: 'bg-gray-400' }
  }
}

// ==================== MAIN COMPONENT ====================
export default function ZbsCampaignList() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const [showConnectionModal, setShowConnectionModal] = useState(false)
  const [showCampaignCreator, setShowCampaignCreator] = useState(false)
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)
  
  // Dropdown states for OA selection
  const [showAccountDropdown, setShowAccountDropdown] = useState(false)
  const [selectedOA, setSelectedOA] = useState(mockConnectedOAs[0])
  const [campaigns, setCampaigns] = useState<ZbsCampaign[]>(mockCampaigns)

  // Modals state
  const [showCampaignDetail, setShowCampaignDetail] = useState(false)
  const [modals, setModals] = useState({
    delete: false,
    pause: false,
    start: false,
    cancel: false,
  })
  const [selectedCampaign, setSelectedCampaign] = useState<ZbsCampaign | null>(null)

  const toggleModal = (modal: keyof typeof modals, value: boolean, campaign?: ZbsCampaign) => {
    setModals(prev => ({ ...prev, [modal]: value }))
    if (campaign !== undefined) {
      setSelectedCampaign(campaign)
    }
    if (!value) {
      setOpenMenuId(null)
    }
  }

  const handleEdit = (campaign: ZbsCampaign) => {
    setSelectedCampaign(campaign)
    setShowCampaignCreator(true)
    setOpenMenuId(null)
  }

  const handleViewStats = (campaign: ZbsCampaign) => {
    setSelectedCampaign(campaign)
    setShowCampaignDetail(true)
    setOpenMenuId(null)
  }

  // Actions
  const handleDelete = () => {
    if (selectedCampaign) {
      setCampaigns(prev => prev.filter(c => c.id !== selectedCampaign.id))
      toggleModal('delete', false)
    }
  }

  const handlePause = () => {
    if (selectedCampaign) {
      setCampaigns(prev => prev.map(c => 
        c.id === selectedCampaign.id ? { ...c, status: 'paused' } : c
      ))
      toggleModal('pause', false)
    }
  }

  const handleCancelSchedule = () => {
    if (selectedCampaign) {
      setCampaigns(prev => prev.map(c => 
        c.id === selectedCampaign.id ? { ...c, status: 'cancelled' } : c
      ))
      toggleModal('cancel', false)
    }
  }

  const handleClone = (campaign: ZbsCampaign) => {
    const cloned: ZbsCampaign = {
      ...campaign,
      id: `zbs-${Date.now()}`,
      name: `${campaign.name} (Copy)`,
      status: 'draft',
      scheduledAt: undefined
    }
    setCampaigns(prev => [cloned, ...prev])
    setOpenMenuId(null)
  }

  const handleStart = (type: 'immediate' | 'scheduled', scheduledAt?: Date | null) => {
    if (selectedCampaign) {
      const scheduledStr = type === 'scheduled' && scheduledAt 
        ? scheduledAt.toLocaleString('vi-VN', { 
            day: '2-digit', month: '2-digit', year: 'numeric',
            hour: '2-digit', minute: '2-digit'
          })
        : undefined;

      setCampaigns(prev => prev.map(c => 
        c.id === selectedCampaign.id ? { 
          ...c, 
          status: type === 'scheduled' ? 'scheduled' : 'running',
          scheduledAt: scheduledStr
        } : c
      ))
      toggleModal('start', false)
    }
  }
  
  const getActions = (campaign: ZbsCampaign) => {
    const actions: Array<{
      label: string;
      icon: React.ReactNode;
      onClick: () => void;
      variant?: 'default' | 'danger';
    }> = [];

    switch (campaign.status) {
      case 'draft':
        actions.push(
          { label: 'Chỉnh sửa', icon: <Edit className="w-4 h-4" />, onClick: () => handleEdit(campaign) },
          { label: 'Bắt đầu gửi', icon: <Play className="w-4 h-4" />, onClick: () => toggleModal('start', true, campaign) },
          { label: 'Tạo bản sao', icon: <Copy className="w-4 h-4" />, onClick: () => handleClone(campaign) },
          { label: 'Xóa', icon: <Trash2 className="w-4 h-4" />, onClick: () => toggleModal('delete', true, campaign), variant: 'danger' }
        );
        break;

      case 'scheduled':
        actions.push(
          { label: 'Chỉnh sửa', icon: <Edit className="w-4 h-4" />, onClick: () => handleEdit(campaign) },
          { label: 'Hủy lịch gửi', icon: <StopCircle className="w-4 h-4" />, onClick: () => toggleModal('cancel', true, campaign), variant: 'danger' },
          { label: 'Tạo bản sao', icon: <Copy className="w-4 h-4" />, onClick: () => handleClone(campaign) }
        );
        break;

      case 'running':
        actions.push(
          { label: 'Xem tiến trình', icon: <BarChart2 className="w-4 h-4" />, onClick: () => handleViewStats(campaign) },
          { label: 'Tạm dừng', icon: <Pause className="w-4 h-4" />, onClick: () => toggleModal('pause', true, campaign) }
        );
        break;

      case 'paused':
        actions.push(
          { label: 'Tiếp tục gửi', icon: <Play className="w-4 h-4" />, onClick: () => toggleModal('start', true, campaign) },
          { label: 'Xem tiến trình', icon: <BarChart2 className="w-4 h-4" />, onClick: () => handleViewStats(campaign) },
          { label: 'Tạo bản sao', icon: <Copy className="w-4 h-4" />, onClick: () => handleClone(campaign) }
        );
        break;

      case 'sent':
        actions.push(
          { label: 'Xem báo cáo', icon: <BarChart2 className="w-4 h-4" />, onClick: () => handleViewStats(campaign) },
          { label: 'Tạo bản sao', icon: <Copy className="w-4 h-4" />, onClick: () => handleClone(campaign) },
          { label: 'Xóa', icon: <Trash2 className="w-4 h-4" />, onClick: () => toggleModal('delete', true, campaign), variant: 'danger' }
        );
        break;

      case 'cancelled':
        actions.push(
          { label: 'Tạo bản sao', icon: <Copy className="w-4 h-4" />, onClick: () => handleClone(campaign) },
          { label: 'Xóa', icon: <Trash2 className="w-4 h-4" />, onClick: () => toggleModal('delete', true, campaign), variant: 'danger' }
        );
        break;
    }

    return actions;
  };

  const dropdownRef = React.useRef<HTMLDivElement>(null)

  // Click outside to close dropdown
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowAccountDropdown(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const filteredCampaigns = campaigns.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchStatus = statusFilter === 'all' || c.status === statusFilter
    return matchSearch && matchStatus
  })

  return (
    <div className="space-y-6">
      {/* OA Connection Header (List view) */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center">
              <Link2 className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium mb-1">Tài khoản Zalo OA đang kết nối</p>
              
              {/* Account Selector Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setShowAccountDropdown(!showAccountDropdown)}
                  className="flex items-center justify-between px-3 py-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-colors h-10 min-w-[280px]"
                >
                  <div className="flex items-center gap-2">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={selectedOA.avatar} alt={selectedOA.name} className="w-6 h-6 rounded-full bg-gray-100 object-cover" />
                    <span className="text-sm font-semibold text-gray-900 truncate max-w-[200px]">
                      {selectedOA.name}
                    </span>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${showAccountDropdown ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Menu */}
                {showAccountDropdown && (
                  <div className="absolute top-full left-0 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 py-1">
                    {mockConnectedOAs.map((account) => (
                      <button
                        key={account.id}
                        onClick={() => {
                          setSelectedOA(account)
                          setShowAccountDropdown(false)
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2.5 hover:bg-gray-50 transition-colors ${
                          selectedOA.id === account.id ? "bg-blue-50" : ""
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={account.avatar} alt={account.name} className="w-6 h-6 rounded-full bg-gray-100 object-cover" />
                          <span className="text-sm font-medium text-gray-900 truncate max-w-[180px]">
                            {account.name}
                          </span>
                        </div>
                        {selectedOA.id === account.id && (
                          <div className="text-blue-600">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <button
            onClick={() => setShowConnectionModal(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-green-600 text-white rounded-lg font-medium text-sm hover:bg-green-700 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Thêm kết nối
          </button>
        </div>
      </div>

      {/* Campaign Section */}
      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-1">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Chiến dịch ZBS</h2>
            <p className="text-sm text-gray-500 mt-0.5">Quản lý và theo dõi các chiến dịch gửi ZBS</p>
          </div>
          <button 
            onClick={() => setShowCampaignCreator(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg font-medium text-sm hover:bg-blue-700 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Tạo chiến dịch
          </button>
        </div>

        {/* Search & Filters */}
        <div className="flex items-center gap-3 mt-4 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm kiếm theo tên hoặc tiêu đề..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
          </div>
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="appearance-none pl-4 pr-10 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 bg-white focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              <option value="all">Tất cả ({campaigns.length})</option>
              <option value="draft">Nháp</option>
              <option value="running">Đang chạy</option>
              <option value="sent">Đã gửi</option>
              <option value="scheduled">Đã lên lịch</option>
              <option value="paused">Tạm dừng</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
          <button className="p-2.5 border border-gray-200 rounded-xl text-gray-500 hover:bg-gray-50 transition-colors">
            <Filter className="w-4 h-4" />
          </button>
        </div>

        {/* Campaign Table */}
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center gap-1">
                    Tên chiến dịch
                    <ChevronDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Trạng thái</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center gap-1">
                    Người nhận
                    <ChevronDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center gap-1">
                    Thời gian gửi
                    <ChevronDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center gap-1">
                    
                  </div>
                </th>
                <th className="w-12 px-3 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredCampaigns.map((campaign) => {
                const statusCfg = getStatusConfig(campaign.status)
                return (
                  <tr key={campaign.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-5 py-4">
                      <div>
                        <p className="text-sm font-semibold text-blue-600 hover:text-blue-700 cursor-pointer">
                          {campaign.name}
                        </p>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${statusCfg.dot}`} />
                        <span className={`text-sm font-medium ${statusCfg.color}`}>{statusCfg.label}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1.5 text-sm text-gray-700">
                        <Users className="w-4 h-4 text-gray-400" />
                        {campaign.recipientCount.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      {campaign.scheduledAt ? (
                        <div className="flex items-center gap-1.5 text-sm text-gray-700">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          {campaign.scheduledAt}
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-3 py-4">
                      <div className="relative">
                        <button
                          onClick={() => setOpenMenuId(openMenuId === campaign.id ? null : campaign.id)}
                          className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          <MoreHorizontal className="w-4 h-4 text-gray-500" />
                        </button>
                        {openMenuId === campaign.id && (
                          <>
                            <div
                              className="fixed inset-0 z-10"
                              onClick={() => setOpenMenuId(null)}
                            />
                            <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-200 rounded-xl shadow-lg z-20 py-1">
                              {getActions(campaign).map((action, index) => (
                                <button 
                                  key={index}
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    action.onClick()
                                  }}
                                  className={`
                                    w-full flex items-center gap-2 px-4 py-2.5 text-sm
                                    ${action.variant === 'danger' 
                                      ? 'text-red-600 hover:bg-red-50' 
                                      : 'text-gray-700 hover:bg-gray-50'
                                    }
                                    transition-colors
                                  `}
                                >
                                  {action.icon}
                                  {action.label}
                                </button>
                              ))}
                            </div>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>

          {filteredCampaigns.length === 0 && (
            <div className="py-16 text-center">
              <Send className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 font-medium">Không tìm thấy chiến dịch</p>
              <p className="text-gray-400 text-sm mt-1">Thử thay đổi bộ lọc hoặc tạo chiến dịch mới</p>
            </div>
          )}
        </div>
      </div>

      {/* Connection Modal */}
      <ZbsConnectionModal
        open={showConnectionModal}
        onClose={() => setShowConnectionModal(false)}
      />

      {/* Campaign Detail Modal */}
      {showCampaignDetail && selectedCampaign && (
        <ZbsCampaignDetailModal
          campaign={selectedCampaign}
          onClose={() => setShowCampaignDetail(false)}
          onPause={(c) => toggleModal('pause', true, c)}
          onResume={(c) => toggleModal('start', true, c)}
          onClone={handleClone}
        />
      )}

      {/* Campaign Creator Modal */}
      {showCampaignCreator && (
        <ZbsCampaignCreator 
          initialCampaign={selectedCampaign}
          onClose={() => {
            setShowCampaignCreator(false)
            setSelectedCampaign(null)
          }}
        />
      )}

      {/* Delete Confirm Modal */}
      {modals.delete && selectedCampaign && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div 
            className="fixed inset-0 bg-black/50" 
            onClick={() => toggleModal('delete', false)}
          />
          <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md mx-4 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-red-100 rounded-full">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Xóa chiến dịch</h3>
                <p className="text-sm text-gray-500">{selectedCampaign.name}</p>
              </div>
            </div>
            
            <p className="text-gray-600 mb-6">
              Bạn có chắc chắn muốn xóa chiến dịch này? Hành động này không thể hoàn tác.
            </p>
            
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => toggleModal('delete', false)}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Xóa chiến dịch
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Pause Confirm Modal */}
      {modals.pause && selectedCampaign && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div 
            className="fixed inset-0 bg-black/50" 
            onClick={() => toggleModal('pause', false)}
          />
          <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md mx-4 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-orange-100 rounded-full">
                <AlertTriangle className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Tạm dừng chiến dịch</h3>
                <p className="text-sm text-gray-500">{selectedCampaign.name}</p>
              </div>
            </div>
            
            <p className="text-gray-600 mb-4">
              Chiến dịch sẽ quy về trạng thái tạm dừng, bạn có thể tiếp tục gửi sau.
            </p>
            
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => toggleModal('pause', false)}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={handlePause}
                className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
              >
                Tạm dừng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ZBS Start Confirm Modal */}
      {modals.start && selectedCampaign && (
        <ZbsConfirmStartModal
          campaignName={selectedCampaign.name}
          templateName="Template ZNS mặc định"
          recipientCount={selectedCampaign.recipientCount}
          onClose={() => toggleModal('start', false)}
          onStart={handleStart}
        />
      )}

      {/* Cancel Confirm Modal */}
      {modals.cancel && selectedCampaign && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div 
            className="fixed inset-0 bg-black/50" 
            onClick={() => toggleModal('cancel', false)}
          />
          <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md mx-4 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-red-100 rounded-full">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Hủy lịch gửi chiến dịch</h3>
                <p className="text-sm text-gray-500">{selectedCampaign.name}</p>
              </div>
            </div>
            
            <p className="text-gray-600 mb-6">
              Bạn có chắc chắn muốn hủy lịch gửi chiến dịch này? Chiến dịch sẽ chuyển sang trạng thái đã hủy.
            </p>
            
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => toggleModal('cancel', false)}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Đóng
              </button>
              <button
                onClick={handleCancelSchedule}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Hủy lịch gửi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
