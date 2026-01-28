'use client'

import React, { useState, useEffect } from 'react'
import { 
  X, 
  Save, 
  Edit, 
  Clock, 
  User, 
  Tag, 
  FileText, 
  AlertTriangle,
  CheckCircle,
  Circle,
  Play,
  Pause,
  MessageSquare,
  Mail,
  Phone,
  Bell,
  Calendar,
  History,
  Building,
  ShoppingCart,
  Users,
  Target,
  Send,
  Plus,
  Trash2,
  Download,
  Upload
} from 'lucide-react'

interface TaskDetailModalProps {
  isOpen: boolean
  onClose: () => void
  task: Task | null
  onUpdate: (task: Task) => void
  employees: Employee[]
}

interface Task {
  id: string
  title: string
  description: string
  dueDate: string
  priority: 'low' | 'medium' | 'high'
  status: 'pending' | 'in_progress' | 'completed'
  progress: number
  assignedTo: string
  assignedTeam?: string
  tags: string[]
  
  relatedType?: 'lead' | 'order' | 'customer' | 'general'
  relatedId?: string
  relatedName?: string
  relatedInfo?: {
    phone?: string
    orderNumber?: string
    orderStatus?: string
    customerHistory?: string
  }
  
  internalNotes: string
  progressNotes: TaskProgressNote[]
  
  isAutoCreated: boolean
  autoTrigger?: string
  
  reminders: TaskReminder[]
  customReminders: CustomReminder[]
  
  createdAt: string
  createdBy: string
  updatedAt: string
  completedAt?: string
  history: TaskHistory[]
}

interface TaskProgressNote {
  id: string
  progress: number
  note: string
  createdAt: string
  createdBy: string
}

interface TaskReminder {
  id: string
  taskId: string
  type: 'zalo' | 'email' | 'app'
  scheduledAt: string
  content: string
  status: 'pending' | 'sent' | 'read' | 'failed'
  sentAt?: string
  readAt?: string
  attempt: number
}

interface CustomReminder {
  id: string
  taskId: string
  scheduleType: 'once' | 'recurring'
  scheduledAt: string
  recurringPattern?: string
  channels: ('zalo' | 'email' | 'app')[]
  content: string
  isActive: boolean
  lastSent?: string
}

interface TaskHistory {
  id: string
  action: string
  details: string
  createdAt: string
  createdBy: string
}

interface Employee {
  id: string
  name: string
  email: string
  phone: string
  role: string
  team: string
  isActive: boolean
}

export default function TaskDetailModal({
  isOpen,
  onClose,
  task,
  onUpdate,
  employees
}: TaskDetailModalProps) {
  const [activeTab, setActiveTab] = useState('overview')
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState<Partial<Task>>({})
  
  // New reminder
  const [newReminder, setNewReminder] = useState({
    type: 'app' as 'zalo' | 'email' | 'app',
    scheduledAt: '',
    content: '',
    scheduleType: 'once' as 'once' | 'recurring',
    recurringPattern: '',
    channels: ['app'] as ('zalo' | 'email' | 'app')[]
  })

  const [showReminderForm, setShowReminderForm] = useState(false)

  useEffect(() => {
    if (isOpen && task) {
      setEditForm(task)
      setActiveTab('overview')
      setIsEditing(false)
      setNewReminder({
        type: 'app',
        scheduledAt: '',
        content: '',
        scheduleType: 'once',
        recurringPattern: '',
        channels: ['app']
      })
      setShowReminderForm(false)
    }
  }, [isOpen, task])

  if (!isOpen || !task) return null

  // Utility functions
  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('vi-VN')
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN')
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount)
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200'
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'low': return 'bg-green-100 text-green-800 border-green-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-200'
      case 'in_progress': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'pending': return 'bg-gray-100 text-gray-800 border-gray-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'Hoàn tất'
      case 'in_progress': return 'Đang làm'
      case 'pending': return 'Chưa làm'
      default: return status
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-5 h-5 text-green-600" />
      case 'in_progress': return <Play className="w-5 h-5 text-blue-600" />
      case 'pending': return <Circle className="w-5 h-5 text-gray-600" />
      default: return <Circle className="w-5 h-5 text-gray-600" />
    }
  }

  const handleStatusChange = (newStatus: 'pending' | 'in_progress' | 'completed') => {
    const updatedTask = {
      ...task,
      status: newStatus,
      progress: newStatus === 'completed' ? 100 : newStatus === 'in_progress' ? Math.max(task.progress, 1) : 0,
      completedAt: newStatus === 'completed' ? new Date().toISOString() : undefined,
      updatedAt: new Date().toISOString(),
      history: [
        ...task.history,
        {
          id: Date.now().toString(),
          action: 'status_change',
          details: `Trạng thái đã được thay đổi từ "${getStatusText(task.status)}" thành "${getStatusText(newStatus)}"`,
          createdAt: new Date().toISOString(),
          createdBy: 'current_user'
        }
      ]
    }
    onUpdate(updatedTask)
  }

  const handleSaveEdit = () => {
    const updatedTask = {
      ...task,
      ...editForm,
      updatedAt: new Date().toISOString(),
      history: [
        ...task.history,
        {
          id: Date.now().toString(),
          action: 'task_edit',
          details: 'Thông tin công việc đã được cập nhật',
          createdAt: new Date().toISOString(),
          createdBy: 'current_user'
        }
      ]
    }
    onUpdate(updatedTask)
    setIsEditing(false)
  }

  const addCustomReminder = () => {
    if (!newReminder.scheduledAt || !newReminder.content) return

    const reminder: CustomReminder = {
      id: Date.now().toString(),
      taskId: task.id,
      scheduleType: newReminder.scheduleType,
      scheduledAt: newReminder.scheduledAt,
      recurringPattern: newReminder.recurringPattern,
      channels: newReminder.channels,
      content: newReminder.content,
      isActive: true
    }

    const updatedTask = {
      ...task,
      customReminders: [...task.customReminders, reminder],
      updatedAt: new Date().toISOString(),
      history: [
        ...task.history,
        {
          id: Date.now().toString(),
          action: 'reminder_added',
          details: `Đã thêm nhắc nhở: ${newReminder.content}`,
          createdAt: new Date().toISOString(),
          createdBy: 'current_user'
        }
      ]
    }

    onUpdate(updatedTask)
    setShowReminderForm(false)
    setNewReminder({
      type: 'app',
      scheduledAt: '',
      content: '',
      scheduleType: 'once',
      recurringPattern: '',
      channels: ['app']
    })
  }

  const isOverdue = new Date(task.dueDate) < new Date() && task.status !== 'completed'
  const assignee = employees.find(e => e.id === task.assignedTo)

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Task Status & Quick Actions */}
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            {getStatusIcon(task.status)}
            <span className={`px-3 py-1 text-sm font-medium rounded-full border ${getStatusColor(task.status)}`}>
              {getStatusText(task.status)}
            </span>
            {isOverdue && (
              <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800 border border-red-200 flex items-center">
                <AlertTriangle className="w-3 h-3 mr-1" />
                Quá hạn
              </span>
            )}
          </div>
          
          {task.status !== 'completed' && (
            <div className="flex items-center space-x-2">
              {task.status === 'pending' && (
                <button
                  onClick={() => handleStatusChange('in_progress')}
                  className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-1"
                >
                  <Play className="w-3 h-3" />
                  <span>Bắt đầu</span>
                </button>
              )}
              {task.status === 'in_progress' && (
                <button
                  onClick={() => handleStatusChange('completed')}
                  className="px-3 py-1 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-1"
                >
                  <CheckCircle className="w-3 h-3" />
                  <span>Hoàn tất</span>
                </button>
              )}
            </div>
          )}
        </div>

      </div>

      {/* Task Information */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-500">Tiêu đề</label>
            {isEditing ? (
              <input
                type="text"
                value={editForm.title || ''}
                onChange={(e) => setEditForm(prev => ({ ...prev, title: e.target.value }))}
                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                maxLength={100}
              />
            ) : (
              <div className="text-lg font-medium text-gray-900">{task.title}</div>
            )}
          </div>

          <div>
            <label className="text-sm font-medium text-gray-500">Mô tả</label>
            {isEditing ? (
              <textarea
                value={editForm.description || ''}
                onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                maxLength={1000}
              />
            ) : (
              <div className="text-gray-900 whitespace-pre-wrap">{task.description}</div>
            )}
          </div>

          <div>
            <label className="text-sm font-medium text-gray-500">Thời hạn</label>
            {isEditing ? (
              <input
                type="datetime-local"
                value={editForm.dueDate?.slice(0, 16) || ''}
                onChange={(e) => setEditForm(prev => ({ ...prev, dueDate: e.target.value + ':00' }))}
                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <div className={`flex items-center space-x-2 ${isOverdue ? 'text-red-600' : 'text-gray-900'}`}>
                <Calendar className="w-4 h-4" />
                <span>{formatDateTime(task.dueDate)}</span>
                {isOverdue && (
                  <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                    Quá hạn
                  </span>
                )}
              </div>
            )}
          </div>

          <div>
            <label className="text-sm font-medium text-gray-500">Ưu tiên</label>
            {isEditing ? (
              <select
                value={editForm.priority || ''}
                onChange={(e) => setEditForm(prev => ({ ...prev, priority: e.target.value as 'low' | 'medium' | 'high' }))}
                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="low">Thấp</option>
                <option value="medium">Trung bình</option>
                <option value="high">Cao</option>
              </select>
            ) : (
              <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${getPriorityColor(task.priority)}`}>
                {task.priority === 'high' ? 'Cao' : task.priority === 'medium' ? 'Trung bình' : 'Thấp'}
              </span>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-500">Người phụ trách</label>
            {isEditing ? (
              <select
                value={editForm.assignedTo || ''}
                onChange={(e) => setEditForm(prev => ({ ...prev, assignedTo: e.target.value }))}
                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {employees.map(emp => (
                  <option key={emp.id} value={emp.id}>{emp.name} - {emp.role}</option>
                ))}
              </select>
            ) : (
              <div className="flex items-center space-x-2">
                <User className="w-4 h-4 text-gray-400" />
                <span className="text-gray-900">{assignee?.name}</span>
                <span className="text-sm text-gray-500">({assignee?.role})</span>
              </div>
            )}
          </div>

          {task.relatedType && (
            <div>
              <label className="text-sm font-medium text-gray-500">Liên quan</label>
              <div className="flex items-center space-x-2 mt-1">
                {task.relatedType === 'lead' && <Building className="w-4 h-4 text-blue-600" />}
                {task.relatedType === 'order' && <ShoppingCart className="w-4 h-4 text-green-600" />}
                {task.relatedType === 'customer' && <Users className="w-4 h-4 text-purple-600" />}
                <span className="text-gray-900">{task.relatedName}</span>
                <span className="text-sm text-gray-500">
                  ({task.relatedType === 'lead' ? 'Lead' : task.relatedType === 'order' ? 'Đơn hàng' : 'Khách hàng'})
                </span>
              </div>
              {task.relatedInfo?.phone && (
                <div className="flex items-center space-x-2 mt-1 text-sm text-gray-500">
                  <Phone className="w-3 h-3" />
                  <span>{task.relatedInfo.phone}</span>
                </div>
              )}
            </div>
          )}

          <div>
            <label className="text-sm font-medium text-gray-500">Nhãn</label>
            <div className="flex flex-wrap gap-1 mt-1">
              {task.tags.map(tag => (
                <span key={tag} className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-500">Tạo lúc</label>
            <div className="text-gray-900">{formatDateTime(task.createdAt)}</div>
            {task.isAutoCreated && (
              <div className="text-xs text-blue-600 mt-1">Tự động tạo: {task.autoTrigger}</div>
            )}
          </div>
        </div>
      </div>

      {/* Internal Notes */}
      {task.internalNotes && (
        <div>
          <label className="text-sm font-medium text-gray-500">Ghi chú nội bộ</label>
          {isEditing ? (
            <textarea
              value={editForm.internalNotes || ''}
              onChange={(e) => setEditForm(prev => ({ ...prev, internalNotes: e.target.value }))}
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={2}
              maxLength={500}
            />
          ) : (
            <div className="mt-1 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-gray-900">
              {task.internalNotes}
            </div>
          )}
        </div>
      )}
    </div>
  )

  const renderReminders = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">Nhắc nhở</h3>
        <button
          onClick={() => setShowReminderForm(true)}
          className="bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 text-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm nhắc nhở</span>
        </button>
      </div>

      {/* Add Reminder Form */}
      {showReminderForm && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h4 className="font-medium text-gray-900 mb-3">Tạo nhắc nhở mới</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Thời gian</label>
              <input
                type="datetime-local"
                value={newReminder.scheduledAt}
                onChange={(e) => setNewReminder(prev => ({ ...prev, scheduledAt: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Loại</label>
              <select
                value={newReminder.scheduleType}
                onChange={(e) => setNewReminder(prev => ({ ...prev, scheduleType: e.target.value as 'once' | 'recurring' }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="once">Một lần</option>
                <option value="recurring">Lặp lại</option>
              </select>
            </div>
          </div>

          {newReminder.scheduleType === 'recurring' && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Tần suất lặp</label>
              <select
                value={newReminder.recurringPattern}
                onChange={(e) => setNewReminder(prev => ({ ...prev, recurringPattern: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Chọn tần suất</option>
                <option value="daily">Hàng ngày</option>
                <option value="12h">Mỗi 12 giờ</option>
                <option value="weekly">Hàng tuần</option>
              </select>
            </div>
          )}

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Kênh nhắc nhở</label>
            <div className="flex flex-wrap gap-2">
              {[
                { value: 'app', label: 'App', icon: Bell },
                { value: 'email', label: 'Email', icon: Mail },
                { value: 'zalo', label: 'Zalo', icon: MessageSquare }
              ].map(channel => (
                <button
                  key={channel.value}
                  type="button"
                  onClick={() => {
                    setNewReminder(prev => ({
                      ...prev,
                      channels: prev.channels.includes(channel.value as any)
                        ? prev.channels.filter(c => c !== channel.value)
                        : [...prev.channels, channel.value as any]
                    }))
                  }}
                  className={`px-3 py-2 border rounded-lg flex items-center space-x-2 text-sm ${
                    newReminder.channels.includes(channel.value as any)
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <channel.icon className="w-4 h-4" />
                  <span>{channel.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Nội dung</label>
            <textarea
              value={newReminder.content}
              onChange={(e) => setNewReminder(prev => ({ ...prev, content: e.target.value }))}
              placeholder="Nhập nội dung nhắc nhở..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              maxLength={500}
            />
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={addCustomReminder}
              disabled={!newReminder.scheduledAt || !newReminder.content}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              <Save className="w-4 h-4" />
              <span>Lưu nhắc nhở</span>
            </button>
            <button
              onClick={() => setShowReminderForm(false)}
              className="text-gray-600 hover:text-gray-800"
            >
              Hủy
            </button>
          </div>
        </div>
      )}

      {/* Existing Reminders */}
      <div className="space-y-3">
        {/* System Reminders */}
        {task.reminders.length > 0 && (
          <div>
            <h4 className="font-medium text-gray-700 mb-2">Nhắc nhở hệ thống</h4>
            {task.reminders.map(reminder => (
              <div key={reminder.id} className="bg-white border border-gray-200 rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {reminder.type === 'zalo' && <MessageSquare className="w-4 h-4 text-green-600" />}
                    {reminder.type === 'email' && <Mail className="w-4 h-4 text-blue-600" />}
                    {reminder.type === 'app' && <Bell className="w-4 h-4 text-gray-600" />}
                    <span className="font-medium">{formatDateTime(reminder.scheduledAt)}</span>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    reminder.status === 'sent' ? 'bg-green-100 text-green-800' :
                    reminder.status === 'failed' ? 'bg-red-100 text-red-800' :
                    reminder.status === 'read' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {reminder.status === 'sent' ? 'Đã gửi' :
                     reminder.status === 'failed' ? 'Lỗi' :
                     reminder.status === 'read' ? 'Đã đọc' : 'Chờ gửi'}
                  </span>
                </div>
                <div className="mt-2 text-sm text-gray-600">{reminder.content}</div>
              </div>
            ))}
          </div>
        )}

        {/* Custom Reminders */}
        {task.customReminders.length > 0 && (
          <div>
            <h4 className="font-medium text-gray-700 mb-2">Nhắc nhở tùy chỉnh</h4>
            {task.customReminders.map(reminder => (
              <div key={reminder.id} className="bg-white border border-gray-200 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">{formatDateTime(reminder.scheduledAt)}</span>
                    {reminder.scheduleType === 'recurring' && (
                      <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                        Lặp lại
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-1">
                    {reminder.channels.map(channel => (
                      <div key={channel} className="p-1">
                        {channel === 'zalo' && <MessageSquare className="w-3 h-3 text-green-600" />}
                        {channel === 'email' && <Mail className="w-3 h-3 text-blue-600" />}
                        {channel === 'app' && <Bell className="w-3 h-3 text-gray-600" />}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="text-sm text-gray-600">{reminder.content}</div>
              </div>
            ))}
          </div>
        )}

        {task.reminders.length === 0 && task.customReminders.length === 0 && !showReminderForm && (
          <div className="text-center py-8 text-gray-500">
            <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p>Chưa có nhắc nhở nào</p>
          </div>
        )}
      </div>
    </div>
  )

  const renderHistory = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900">Lịch sử thay đổi</h3>
      
      {task.history.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <History className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p>Chưa có lịch sử thay đổi</p>
        </div>
      ) : (
        <div className="space-y-3">
          {task.history.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map(entry => (
            <div key={entry.id} className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="font-medium text-gray-900">{entry.action}</div>
                <div className="text-sm text-gray-500">{formatDateTime(entry.createdAt)}</div>
              </div>
              <div className="text-gray-600">{entry.details}</div>
              <div className="text-xs text-gray-500 mt-1">
                Bởi: {employees.find(e => e.id === entry.createdBy)?.name || 'Hệ thống'}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <h2 className="text-xl font-semibold text-gray-900">{task.title}</h2>
            {task.isAutoCreated && (
              <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                Tự động
              </span>
            )}
          </div>
          <div className="flex items-center space-x-2">
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                title="Chỉnh sửa"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" fill="currentColor"/>
                </svg>
              </button>
            ) : (
              <button
                onClick={handleSaveEdit}
                className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-1"
              >
                <Save className="w-4 h-4" />
                <span>Lưu</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6 overflow-x-auto">
            {[
              { id: 'overview', label: 'Tổng quan', icon: FileText },
              { id: 'reminders', label: 'Nhắc nhở', icon: Bell },
              { id: 'history', label: 'Lịch sử', icon: History }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap flex items-center space-x-2 ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="overflow-y-auto max-h-[60vh] p-6">
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'reminders' && renderReminders()}
          {activeTab === 'history' && renderHistory()}
        </div>
      </div>
    </div>
  )
}
