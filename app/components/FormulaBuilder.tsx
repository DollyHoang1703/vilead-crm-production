'use client'

import React, { useState, useEffect } from 'react'
import { Plus, Trash2, X } from 'lucide-react'

// Định nghĩa các bảng trong hệ thống với metadata
const availableTables = [
  {
    id: 'leads',
    name: 'Danh sách Lead',
    columns: [
      { id: 'total_count', name: 'Tổng số lượng', type: 'count' },
      { id: 'converted_count', name: 'Số đã chuyển đổi', type: 'count' },
      { id: 'potential_value', name: 'Giá trị tiềm năng', type: 'number' },
    ]
  },
  {
    id: 'customers',
    name: 'Danh sách Khách hàng',
    columns: [
      { id: 'total_count', name: 'Tổng số khách hàng', type: 'count' },
      { id: 'new_count', name: 'Khách hàng mới', type: 'count' },
      { id: 'total_revenue', name: 'Tổng doanh thu', type: 'number' },
    ]
  },
  {
    id: 'orders',
    name: 'Đơn hàng',
    columns: [
      { id: 'total_count', name: 'Tổng số đơn', type: 'count' },
      { id: 'total_value', name: 'Tổng giá trị', type: 'number' },
      { id: 'completed_count', name: 'Đơn hoàn thành', type: 'count' },
      { id: 'avg_value', name: 'Giá trị trung bình', type: 'number' },
    ]
  },
  {
    id: 'tasks',
    name: 'Công việc',
    columns: [
      { id: 'total_count', name: 'Tổng số công việc', type: 'count' },
      { id: 'completed_count', name: 'Số công việc hoàn thành', type: 'count' },
      { id: 'in_progress_count', name: 'Đang thực hiện', type: 'count' },
    ]
  },
  {
    id: 'contracts',
    name: 'Hợp đồng',
    columns: [
      { id: 'total_count', name: 'Tổng số hợp đồng', type: 'count' },
      { id: 'total_value', name: 'Tổng giá trị', type: 'number' },
      { id: 'revenue', name: 'Doanh thu trên hợp đồng', type: 'number' },
      { id: 'active_count', name: 'Hợp đồng đang hoạt động', type: 'count' },
    ]
  }
]

export interface FormulaVariable {
  id: string
  label: string // A, B, C, D...
  tableId: string
  columnId: string
  tableName?: string
  columnName?: string
}

interface FormulaBuilderProps {
  formula: string
  variables: FormulaVariable[]
  onChange: (formula: string, variables: FormulaVariable[]) => void
}

export default function FormulaBuilder({ formula, variables, onChange }: FormulaBuilderProps) {
  const [localFormula, setLocalFormula] = useState(formula)
  const [localVariables, setLocalVariables] = useState<FormulaVariable[]>(variables)
  
  // Sync with parent
  useEffect(() => {
    setLocalFormula(formula)
    setLocalVariables(variables)
  }, [formula, variables])
  
  // Generate next variable label (A, B, C, ...)
  const getNextLabel = () => {
    if (localVariables.length === 0) return 'A'
    const lastLabel = localVariables[localVariables.length - 1].label
    return String.fromCharCode(lastLabel.charCodeAt(0) + 1)
  }
  
  // Add new variable
  const handleAddVariable = () => {
    if (localVariables.length >= 26) return // Max 26 variables (A-Z)
    
    const newVariable: FormulaVariable = {
      id: `var-${Date.now()}`,
      label: getNextLabel(),
      tableId: '',
      columnId: ''
    }
    
    const updatedVariables = [...localVariables, newVariable]
    setLocalVariables(updatedVariables)
    onChange(localFormula, updatedVariables)
  }
  
  // Remove variable
  const handleRemoveVariable = (id: string) => {
    const updatedVariables = localVariables.filter(v => v.id !== id)
    // Re-assign labels
    const reIndexed = updatedVariables.map((v, index) => ({
      ...v,
      label: String.fromCharCode(65 + index) // A=65 in ASCII
    }))
    setLocalVariables(reIndexed)
    onChange(localFormula, reIndexed)
  }
  
  // Update variable table selection
  const handleTableChange = (variableId: string, tableId: string) => {
    const table = availableTables.find(t => t.id === tableId)
    const updatedVariables = localVariables.map(v => 
      v.id === variableId 
        ? { 
            ...v, 
            tableId, 
            columnId: '', 
            tableName: table?.name || '',
            columnName: ''
          }
        : v
    )
    setLocalVariables(updatedVariables)
    onChange(localFormula, updatedVariables)
  }
  
  // Update variable column selection
  const handleColumnChange = (variableId: string, columnId: string) => {
    const variable = localVariables.find(v => v.id === variableId)
    const table = availableTables.find(t => t.id === variable?.tableId)
    const column = table?.columns.find(c => c.id === columnId)
    
    const updatedVariables = localVariables.map(v => 
      v.id === variableId 
        ? { 
            ...v, 
            columnId,
            columnName: column?.name || ''
          }
        : v
    )
    setLocalVariables(updatedVariables)
    onChange(localFormula, updatedVariables)
  }
  
  // Update formula
  const handleFormulaChange = (value: string) => {
    // Only allow: A-Z 0-9 + - * / ( ) space
    const sanitized = value.replace(/[^A-Za-z0-9+\-*/()\s.]/g, '').toUpperCase()
    setLocalFormula(sanitized)
    onChange(sanitized, localVariables)
  }
  
  // Get columns for a specific table
  const getColumnsForTable = (tableId: string) => {
    return availableTables.find(t => t.id === tableId)?.columns || []
  }

  return (
    <div className="border border-[#e6ebf1] rounded-[10px] p-4 space-y-4">
      {/* Header */}
      <div className="border-b border-[#e6ebf1] pb-3">
        <h4 className="text-sm font-semibold text-[#1a3353] uppercase">Công thức tính</h4>
      </div>
      
      {/* Formula Input */}
      <div>
        <label className="text-sm font-medium text-[#455560] mb-1.5 block">Công thức</label>
        <input
          type="text"
          value={localFormula}
          onChange={(e) => handleFormulaChange(e.target.value)}
          placeholder="Nhập công thức chứa các ký tự A-Z 0-9 + - * \ ( )"
          className="flex h-10 w-full rounded-[10px] border border-[#e6ebf1] bg-white px-3 py-2 text-sm text-[#455560] 
            transition-all duration-300 placeholder:text-[rgba(114,132,154,0.4)] 
            hover:border-[#699dff] focus:outline-none focus:border-[#3e79f7] 
            focus:ring-2 focus:ring-[rgba(62,121,247,0.2)]"
        />
      </div>
      
      {/* Variables List */}
      <div className="space-y-3">
        {/* Add Variable Button */}
        <button
          type="button"
          onClick={handleAddVariable}
          disabled={localVariables.length >= 26}
          className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium 
            border border-[#e6ebf1] rounded-[10px] text-[#455560] bg-white
            hover:bg-[#f0f7ff] hover:border-[#699dff] hover:text-[#699dff]
            transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus className="w-4 h-4" />
          Thêm biến
        </button>
        
        {/* Variables */}
        {localVariables.map((variable) => (
          <div key={variable.id} className="flex items-center gap-3">
            {/* Variable Label Badge */}
            <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center 
              bg-[#f0f7ff] text-[#3e79f7] font-semibold text-sm rounded-[10px] border border-[#e6ebf1]">
              {variable.label}
            </div>
            
            {/* Table Selector */}
            <div className="flex-1">
              <select
                value={variable.tableId}
                onChange={(e) => handleTableChange(variable.id, e.target.value)}
                className="w-full h-10 px-3 py-2 text-sm text-[#455560] 
                  border border-[#e6ebf1] rounded-[10px] bg-white
                  hover:border-[#699dff] focus:outline-none focus:border-[#3e79f7] 
                  focus:ring-2 focus:ring-[rgba(62,121,247,0.2)] transition-all duration-300
                  appearance-none cursor-pointer"
                style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em', paddingRight: '2.5rem' }}
              >
                <option value="">Chọn bảng dữ liệu...</option>
                {availableTables.map((table) => (
                  <option key={table.id} value={table.id}>{table.name}</option>
                ))}
              </select>
            </div>
            
            {/* Column Selector */}
            <div className="flex-1">
              <select
                value={variable.columnId}
                onChange={(e) => handleColumnChange(variable.id, e.target.value)}
                disabled={!variable.tableId}
                className="w-full h-10 px-3 py-2 text-sm text-[#455560] 
                  border border-[#e6ebf1] rounded-[10px] bg-white
                  hover:border-[#699dff] focus:outline-none focus:border-[#3e79f7] 
                  focus:ring-2 focus:ring-[rgba(62,121,247,0.2)] transition-all duration-300
                  disabled:bg-[#f7f7f8] disabled:cursor-not-allowed disabled:opacity-60
                  appearance-none cursor-pointer"
                style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em', paddingRight: '2.5rem' }}
              >
                <option value="">Chọn các thông tin...</option>
                {getColumnsForTable(variable.tableId).map((column) => (
                  <option key={column.id} value={column.id}>{column.name}</option>
                ))}
              </select>
            </div>
            
            {/* Delete Button */}
            <button
              type="button"
              onClick={() => handleRemoveVariable(variable.id)}
              className="flex-shrink-0 w-10 h-10 flex items-center justify-center 
                text-red-500 hover:bg-red-50 rounded-[10px] transition-all duration-300"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        ))}
      </div>
      
      {/* Formula Preview */}
      {localFormula && localVariables.length > 0 && (
        <div className="pt-3 border-t border-[#e6ebf1]">
          <p className="text-xs text-[#72849a] mb-1">Xem trước công thức:</p>
          <p className="text-sm text-[#455560] font-mono bg-[#f7f7f8] p-2 rounded-lg">
            {localFormula}
            {localVariables.filter(v => v.tableName && v.columnName).length > 0 && (
              <span className="block mt-1 text-xs text-[#72849a]">
                Trong đó: {localVariables.filter(v => v.tableName && v.columnName).map(v => 
                  `${v.label} = ${v.columnName} (${v.tableName})`
                ).join(', ')}
              </span>
            )}
          </p>
        </div>
      )}
    </div>
  )
}

// Export available tables for use in other components
export { availableTables }
