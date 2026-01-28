'use client'

import { useState, useEffect } from 'react'
import { 
  Calendar, Gift, Bell, Plus, Edit, Trash2, Clock, 
  User, Mail, Phone, MessageCircle, AlertTriangle,
  CheckCircle, XCircle, RefreshCw, Send, Heart
} from 'lucide-react'

interface CustomerEvent {
  id: string
  customerId: number
  customerName: string
  type: 'birthday' | 'anniversary' | 'custom' | 'follow-up' | 'renewal'
  title: string
  description?: string
  date: string
  recurring: boolean
  reminderDays: number[]
  status: 'upcoming' | 'due' | 'overdue' | 'completed'
  actions: {
    email?: boolean
    sms?: boolean
    call?: boolean
    gift?: boolean
  }
  customMessage?: string
  lastReminder?: string
  completedAt?: string
  createdAt: string
}

interface CustomerEventsManagerProps {
  customers: any[]
}

export default function CustomerEventsManager({ customers }: CustomerEventsManagerProps) {
  const [events, setEvents] = useState<CustomerEvent[]>([])
  const [showAddModal, setShowAddModal] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<CustomerEvent | null>(null)
  const [filterStatus, setFilterStatus] = useState<string>('')
  const [filterType, setFilterType] = useState<string>('')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    // Sample events data
    const sampleEvents: CustomerEvent[] = [
      {
        id: '1',
        customerId: 1,
        customerName: 'Nguyễn Văn A',
        type: 'birthday',
        title: 'Sinh nhật khách hàng',
        description: 'Gửi lời chúc sinh nhật và ưu đãi đặc biệt',
        date: '2024-07-15',
        recurring: true,
        reminderDays: [7, 3, 1],
        status: 'upcoming',
        actions: {
          email: true,
          sms: true,
          gift: true
        },
        customMessage: 'Chúc mừng sinh nhật! Giảm 15% cho đơn hàng tiếp theo.',
        createdAt: '2024-01-15'
      },
      {
        id: '2',
        customerId: 2,
        customerName: 'Trần Thị B',
        type: 'anniversary',
        title: 'Kỷ niệm 1 năm hợp tác',
        description: 'Cảm ơn sự tin tưởng và đồng hành',
        date: '2024-06-25',
        recurring: true,
        reminderDays: [14, 7, 3],
        status: 'due',
        actions: {
          email: true,
          call: true,
          gift: true
        },
        createdAt: '2023-04-20'
      },
      {
        id: '3',
        customerId: 1,
        customerName: 'Nguyễn Văn A',
        type: 'follow-up',
        title: 'Theo dõi sau demo sản phẩm',
        description: 'Liên hệ để biết phản hồi sau buổi demo',
        date: '2024-06-24',
        recurring: false,
        reminderDays: [1],
        status: 'overdue',
        actions: {
          call: true,
          email: true
        },
        createdAt: '2024-06-20'
      }
    ]
    
    setEvents(sampleEvents)
  }, [])

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = !filterStatus || event.status === filterStatus
    const matchesType = !filterType || event.type === filterType
    
    return matchesSearch && matchesStatus && matchesType
  })

  const upcomingEvents = events.filter(event => 
    event.status === 'upcoming' || event.status === 'due'
  )

  const overdueEvents = events.filter(event => event.status === 'overdue')

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'due':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'overdue':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'upcoming':
        return 'Sắp tới'
      case 'due':
        return 'Đến hạn'
      case 'overdue':
        return 'Quá hạn'
      case 'completed':
        return 'Hoàn thành'
      default:
        return status
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'birthday':
        return <Gift className="w-4 h-4" />
      case 'anniversary':
        return <Heart className="w-4 h-4" />
      case 'follow-up':
        return <RefreshCw className="w-4 h-4" />
      case 'renewal':
        return <CheckCircle className="w-4 h-4" />
      default:
        return <Calendar className="w-4 h-4" />
    }
  }

  const getTypeText = (type: string) => {
    switch (type) {
      case 'birthday':
        return 'Sinh nhật'
      case 'anniversary':
        return 'Kỷ niệm'
      case 'follow-up':
        return 'Theo dõi'
      case 'renewal':
        return 'Gia hạn'
      case 'custom':
        return 'Tùy chỉnh'
      default:
        return type
    }
  }

  const handleCompleteEvent = (eventId: string) => {
    setEvents(events.map(event => 
      event.id === eventId 
        ? { ...event, status: 'completed' as const, completedAt: new Date().toISOString() }
        : event
    ))
  }

  const handleSendReminder = (eventId: string) => {
    setEvents(events.map(event => 
      event.id === eventId 
        ? { ...event, lastReminder: new Date().toISOString() }
        : event
    ))
    // Here you would integrate with your email/SMS service
    alert('Đã gửi nhắc nhở!')
  }

  const getDaysUntilEvent = (eventDate: string) => {
    const today = new Date()
    const eventDay = new Date(eventDate)
    const diffTime = eventDay.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Quản lý Sự kiện Khách hàng</h2>
          <p className="text-gray-600">Theo dõi và chăm sóc khách hàng theo các sự kiện quan trọng</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm sự kiện</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-600">Sự kiện sắp tới</div>
              <div className="text-2xl font-bold text-blue-600">{upcomingEvents.length}</div>
            </div>
            <Calendar className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        
        <div className="card p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-600">Đến hạn hôm nay</div>
              <div className="text-2xl font-bold text-yellow-600">
                {events.filter(e => e.status === 'due').length}
              </div>
            </div>
            <Bell className="w-8 h-8 text-yellow-600" />
          </div>
        </div>

        <div className="card p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-600">Quá hạn</div>
              <div className="text-2xl font-bold text-red-600">{overdueEvents.length}</div>
            </div>
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
        </div>

        <div className="card p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-600">Hoàn thành tháng này</div>
              <div className="text-2xl font-bold text-green-600">
                {events.filter(e => e.status === 'completed').length}
              </div>
            </div>
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="card p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Tìm kiếm sự kiện..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-4"
            />
          </div>
          
          <select 
            value={filterStatus} 
            onChange={(e) => setFilterStatus(e.target.value)}
            className="input-field"
          >
            <option value="">Tất cả trạng thái</option>
            <option value="upcoming">Sắp tới</option>
            <option value="due">Đến hạn</option>
            <option value="overdue">Quá hạn</option>
            <option value="completed">Hoàn thành</option>
          </select>

          <select 
            value={filterType} 
            onChange={(e) => setFilterType(e.target.value)}
            className="input-field"
          >
            <option value="">Tất cả loại</option>
            <option value="birthday">Sinh nhật</option>
            <option value="anniversary">Kỷ niệm</option>
            <option value="follow-up">Theo dõi</option>
            <option value="renewal">Gia hạn</option>
            <option value="custom">Tùy chỉnh</option>
          </select>

          <div className="flex space-x-2">
            <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              <Send className="w-4 h-4" />
              <span>Gửi nhắc nhở hàng loạt</span>
            </button>
          </div>
        </div>
      </div>

      {/* Events List */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="table-header">Sự kiện</th>
                <th className="table-header">Khách hàng</th>
                <th className="table-header">Ngày</th>
                <th className="table-header">Trạng thái</th>
                <th className="table-header">Hành động</th>
                <th className="table-header">Thao tác</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredEvents.map((event) => (
                <tr key={event.id} className="hover:bg-gray-50">
                  <td className="table-cell">
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                          {getTypeIcon(event.type)}
                        </div>
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{event.title}</div>
                        <div className="text-sm text-gray-500">{getTypeText(event.type)}</div>
                        {event.description && (
                          <div className="text-xs text-gray-400 mt-1">{event.description}</div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="table-cell">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-gray-600" />
                      </div>
                      <span className="font-medium text-gray-900">{event.customerName}</span>
                    </div>
                  </td>
                  <td className="table-cell">
                    <div className="text-sm text-gray-900">{event.date}</div>
                    <div className="text-xs text-gray-500">
                      {getDaysUntilEvent(event.date) > 0 
                        ? `${getDaysUntilEvent(event.date)} ngày nữa`
                        : getDaysUntilEvent(event.date) === 0 
                        ? 'Hôm nay'
                        : `${Math.abs(getDaysUntilEvent(event.date))} ngày quá hạn`
                      }
                    </div>
                  </td>
                  <td className="table-cell">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(event.status)}`}>
                      {getStatusText(event.status)}
                    </span>
                  </td>
                  <td className="table-cell">
                    <div className="flex items-center space-x-1">
                      {event.actions.email && (
                        <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                          <Mail className="w-3 h-3 text-blue-600" />
                        </div>
                      )}
                      {event.actions.sms && (
                        <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                          <MessageCircle className="w-3 h-3 text-green-600" />
                        </div>
                      )}
                      {event.actions.call && (
                        <div className="w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center">
                          <Phone className="w-3 h-3 text-yellow-600" />
                        </div>
                      )}
                      {event.actions.gift && (
                        <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center">
                          <Gift className="w-3 h-3 text-purple-600" />
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="table-cell">
                    <div className="flex items-center space-x-2">
                      {event.status !== 'completed' && (
                        <>
                          <button 
                            onClick={() => handleSendReminder(event.id)}
                            className="p-1 text-blue-600 hover:text-blue-800"
                            title="Gửi nhắc nhở"
                          >
                            <Send className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleCompleteEvent(event.id)}
                            className="p-1 text-green-600 hover:text-green-800"
                            title="Đánh dấu hoàn thành"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                        </>
                      )}
                      <button 
                        onClick={() => setSelectedEvent(event)}
                        className="p-1 text-gray-600 hover:text-gray-800"
                        title="Chỉnh sửa"
                      >
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" fill="currentColor"/>
                        </svg>
                      </button>
                      <button className="p-1 text-red-600 hover:text-red-800" title="Xóa">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Actions Panel */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Tự động hóa sự kiện</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Gift className="w-5 h-5 text-purple-600" />
              <span className="font-medium text-gray-900">Sinh nhật tự động</span>
            </div>
            <p className="text-sm text-gray-600 mb-3">
              Tự động tạo sự kiện sinh nhật cho khách hàng mới và gửi lời chúc
            </p>
            <button className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
              Kích hoạt
            </button>
          </div>

          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Heart className="w-5 h-5 text-red-600" />
              <span className="font-medium text-gray-900">Kỷ niệm hợp tác</span>
            </div>
            <p className="text-sm text-gray-600 mb-3">
              Tự động tạo sự kiện kỷ niệm và gửi lời cảm ơn khách hàng
            </p>
            <button className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
              Kích hoạt
            </button>
          </div>

          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <RefreshCw className="w-5 h-5 text-blue-600" />
              <span className="font-medium text-gray-900">Theo dõi tự động</span>
            </div>
            <p className="text-sm text-gray-600 mb-3">
              Tự động tạo task theo dõi sau các tương tác quan trọng
            </p>
            <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Kích hoạt
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
