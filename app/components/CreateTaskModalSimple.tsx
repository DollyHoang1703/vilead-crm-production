'use client'

import React, { useState, useEffect } from 'react'
import { 
  X, 
  Calendar,
  User, 
  FileText, 
  Plus,
  ChevronDown,
  Trash2,
  Search
} from 'lucide-react'

interface CreateTaskModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (task: any) => void
  employees: Employee[]
  initialTask?: any
  isEditMode?: boolean
}

export type { CreateTaskModalProps }

interface Employee {
  id: string
  name: string
  email: string
  phone: string
  role: string
  team: string
  isActive: boolean
}

export default function CreateTaskModalSimple({
  isOpen,
  onClose,
  onSave,
  employees,
  initialTask,
  isEditMode = false
}: CreateTaskModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
    priority: '',
    assignedTo: '',
    relatedType: 'leads',
    relatedTo: '',
    internalNotes: ''
  })

  const [todos, setTodos] = useState<string[]>([])
  const [showLeadSearch, setShowLeadSearch] = useState(false)
  const [leadSearchTerm, setLeadSearchTerm] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Mock leads data - replace with actual data from props or API
  const mockLeads = [
    { id: '1', name: 'Công ty ABC', phone: '0987654321', email: 'abc@example.com' },
    { id: '2', name: 'Công ty XYZ', phone: '0987654322', email: 'xyz@example.com' },
    { id: '3', name: 'Doanh nghiệp DEF', phone: '0987654323', email: 'def@example.com' },
    { id: '4', name: 'Startup GHI', phone: '0987654324', email: 'ghi@example.com' },
  ]

  const filteredLeads = mockLeads.filter(lead => 
    lead.name.toLowerCase().includes(leadSearchTerm.toLowerCase()) ||
    lead.phone.includes(leadSearchTerm) ||
    lead.email.toLowerCase().includes(leadSearchTerm.toLowerCase())
  )

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      if (isEditMode && initialTask) {
        // Parse due date for edit mode
        const dueDateTime = new Date(initialTask.dueDate)
        const dateStr = dueDateTime.toISOString().split('T')[0]
        
        setFormData({
          title: initialTask.title || '',
          description: initialTask.description || '',
          dueDate: dateStr,
          priority: initialTask.priority || '',
          assignedTo: initialTask.assignedTo || '',
          relatedType: initialTask.relatedType || 'leads',
          relatedTo: initialTask.relatedTo || '',
          internalNotes: initialTask.internalNotes || ''
        })
        setTodos(initialTask.todos || [])
      } else {
        setFormData({
          title: '',
          description: '',
          dueDate: '',
          priority: '',
          assignedTo: '',
          relatedType: 'leads',
          relatedTo: '',
          internalNotes: ''
        })
        setTodos([])
      }
      setErrors({})
      setShowLeadSearch(false)
      setLeadSearchTerm('')
    }
  }, [isOpen, isEditMode, initialTask])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.title.trim()) {
      newErrors.title = 'Tiêu đề là bắt buộc'
    }

    if (!formData.dueDate) {
      newErrors.dueDate = 'Ngày đến hạn là bắt buộc'
    }

    if (!formData.assignedTo) {
      newErrors.assignedTo = 'Phải chọn người phụ trách'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSave = () => {
    if (!validateForm()) return

    const taskData = {
      title: formData.title,
      description: formData.description,
      dueDate: `${formData.dueDate}T09:00:00`,
      priority: formData.priority || 'medium',
      assignedTo: formData.assignedTo,
      relatedType: formData.relatedType,
      relatedTo: formData.relatedTo,
      internalNotes: formData.internalNotes,
      todos: todos.filter(todo => todo.trim() !== '')
    }

    if (isEditMode) {
      // For edit mode, just pass the updated data
      onSave(taskData)
    } else {
      // For create mode, add additional fields
      const newTask = {
        id: Date.now().toString(),
        ...taskData,
        status: 'pending',
        tags: [],
        progressNotes: [],
        isAutoCreated: false,
        reminders: [],
        customReminders: [],
        createdAt: new Date().toISOString(),
        createdBy: 'current_user',
        updatedAt: new Date().toISOString(),
        history: []
      }
      onSave(newTask)
    }
    
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 flex-shrink-0">
          <h2 className="text-xl font-semibold text-gray-900">
            {isEditMode ? 'Chỉnh sửa Công việc' : 'Tạo Công việc mới'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6 space-y-4 overflow-y-auto flex-1">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tiêu đề <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Nhập tiêu đề công việc (tối đa 100 ký tự)"
              maxLength={100}
              className={`w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.title ? 'border-red-300' : ''
              }`}
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">{errors.title}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mô tả
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Nhập mô tả chi tiết công việc (tối đa 1000 ký tự)"
              maxLength={1000}
              rows={3}
              className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>

          {/* Due Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ngày đến hạn
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              <input
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
                placeholder="Chọn ngày đến hạn"
                className={`w-full pl-10 pr-3 py-2.5 text-sm text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.dueDate ? 'border-red-300' : ''
                }`}
              />
            </div>
            {errors.dueDate && (
              <p className="mt-1 text-sm text-red-600">{errors.dueDate}</p>
            )}
          </div>

          {/* Priority */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ưu tiên
            </label>
            <div className="relative">
              <select
                value={formData.priority}
                onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value }))}
                className="w-full px-3 py-2.5 text-sm text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
              >
                <option value="">Chọn ưu tiên</option>
                <option value="low">Thấp</option>
                <option value="medium">Trung bình</option>
                <option value="high">Cao</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Todo List */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Danh sách việc cần làm
            </label>
            <div className="space-y-2">
              {todos.map((todo, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={todo}
                    onChange={(e) => {
                      const newTodos = [...todos]
                      newTodos[index] = e.target.value
                      setTodos(newTodos)
                    }}
                    placeholder="Nhập việc cần làm"
                    className="flex-1 px-3 py-2.5 text-sm text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={() => setTodos(todos.filter((_, i) => i !== index))}
                    className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => setTodos([...todos, ''])}
                className="w-full px-3 py-2.5 text-sm text-gray-500 border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Assignee and Type */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Người phụ trách <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  value={formData.assignedTo}
                  onChange={(e) => setFormData(prev => ({ ...prev, assignedTo: e.target.value }))}
                  className={`w-full px-3 py-2.5 text-sm text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white ${
                    errors.assignedTo ? 'border-red-300' : ''
                  }`}
                >
                  <option value="">Chọn người phụ trách</option>
                  {employees.filter(e => e.isActive).map(emp => (
                    <option key={emp.id} value={emp.id}>
                      {emp.name} - {emp.role}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
              {errors.assignedTo && (
                <p className="mt-1 text-sm text-red-600">{errors.assignedTo}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Loại
              </label>
              <div className="relative">
                <select
                  value={formData.relatedType}
                  onChange={(e) => setFormData(prev => ({ ...prev, relatedType: e.target.value }))}
                  className="w-full px-3 py-2.5 text-sm text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                >
                  <option value="leads">Leads</option>
                  <option value="customer">Khách hàng</option>
                  <option value="general">Công việc chung</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Related To */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Liên quan
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none z-10" />
              <input
                type="text"
                value={formData.relatedTo}
                onChange={(e) => {
                  setFormData(prev => ({ ...prev, relatedTo: e.target.value }))
                  setLeadSearchTerm(e.target.value)
                  setShowLeadSearch(true)
                }}
                onFocus={() => setShowLeadSearch(true)}
                placeholder="Chọn người liên quan"
                className="w-full pl-10 pr-3 py-2.5 text-sm text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              
              {/* Dropdown with search results */}
              {showLeadSearch && formData.relatedType === 'leads' && (
                <>
                  <div 
                    className="fixed inset-0 z-20" 
                    onClick={() => setShowLeadSearch(false)}
                  />
                  <div className="absolute z-30 mt-1 w-full bg-white rounded-lg shadow-xl border border-gray-200 max-h-64 overflow-hidden">
                    {/* Search box */}
                    <div className="p-3 border-b border-gray-200">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="text"
                          value={leadSearchTerm}
                          onChange={(e) => setLeadSearchTerm(e.target.value)}
                          placeholder="Tìm kiếm leads..."
                          className="w-full pl-10 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>
                    </div>
                    
                    {/* Leads list */}
                    <div className="max-h-48 overflow-y-auto">
                      {filteredLeads.length > 0 ? (
                        filteredLeads.map(lead => (
                          <button
                            key={lead.id}
                            type="button"
                            onClick={() => {
                              setFormData(prev => ({ ...prev, relatedTo: lead.name }))
                              setShowLeadSearch(false)
                              setLeadSearchTerm('')
                            }}
                            className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                          >
                            <div className="font-medium text-sm text-gray-900">{lead.name}</div>
                            <div className="text-xs text-gray-500 mt-0.5">
                              {lead.phone} • {lead.email}
                            </div>
                          </button>
                        ))
                      ) : (
                        <div className="px-4 py-6 text-center text-sm text-gray-500">
                          Không tìm thấy leads
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Internal Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ghi chú nội bộ
            </label>
            <textarea
              value={formData.internalNotes}
              onChange={(e) => setFormData(prev => ({ ...prev, internalNotes: e.target.value }))}
              placeholder="Nhập ghi chú nội bộ"
              rows={4}
              className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 px-6 py-4 border-t border-gray-200 bg-gray-50 flex-shrink-0">
          <button
            onClick={onClose}
            type="button"
            className="px-6 py-2.5 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
          >
            Hủy
          </button>
          
          <button
            onClick={handleSave}
            type="button"
            className="bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
          >
            {isEditMode ? 'Cập nhật công việc' : 'Tạo công việc'}
          </button>
        </div>
      </div>
    </div>
  )
}