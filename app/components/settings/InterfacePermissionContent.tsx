'use client'

import React, { useState, useCallback } from 'react'
import { 
  Users, 
  Plus, 
  MoreHorizontal, 
  GripVertical, 
  ChevronDown,
  ChevronRight,
  LayoutDashboard,
  TrendingUp,
  ShoppingCart,
  CheckSquare,
  Target,
  MessageSquare,
  Mail,
  BarChart3,
  Settings,
  UserCog
} from 'lucide-react'
import { Switch } from '@/components/ui/switch'
import { Checkbox } from '@/components/ui/checkbox'
import { cn } from '@/lib/utils'
import { 
  InterfaceModule, 
  InterfaceGroup, 
  InterfaceComponent,
  RoleInterfaceConfig,
  DEFAULT_ROLES 
} from './types/interface-permission.types'
import { INITIAL_ROLE_CONFIGS, ALL_MODULES } from './data/interface-config.data'

// Icon mapping for modules
const MODULE_ICONS: Record<string, React.ElementType> = {
  'LayoutDashboard': LayoutDashboard,
  'TrendingUp': TrendingUp,
  'Users': Users,
  'ShoppingCart': ShoppingCart,
  'CheckSquare': CheckSquare,
  'Target': Target,
  'MessageSquare': MessageSquare,
  'Mail': Mail,
  'BarChart3': BarChart3,
  'Settings': Settings,
  'UserCog': UserCog,
}

interface InterfacePermissionContentProps {
  className?: string
}

export function InterfacePermissionContent({ className }: InterfacePermissionContentProps) {
  // State
  const [selectedRoleId, setSelectedRoleId] = useState<string>('admin')
  const [roleConfigs, setRoleConfigs] = useState<RoleInterfaceConfig[]>(INITIAL_ROLE_CONFIGS)
  const [selectedModuleIds, setSelectedModuleIds] = useState<string[]>(['dashboard'])
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set())
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set())
  const [draggedItemId, setDraggedItemId] = useState<string | null>(null)
  const [dragOverItemId, setDragOverItemId] = useState<string | null>(null)
  const [draggedModuleId, setDraggedModuleId] = useState<string | null>(null)
  const [dragOverModuleId, setDragOverModuleId] = useState<string | null>(null)
  const [draggedGroupId, setDraggedGroupId] = useState<string | null>(null)
  const [dragOverGroupId, setDragOverGroupId] = useState<string | null>(null)
  const [moduleOrder, setModuleOrder] = useState<string[]>(ALL_MODULES.map(m => m.id))

  // Get current role's config
  const currentRoleConfig = roleConfigs.find(r => r.roleId === selectedRoleId)

  // Get selected modules from current role's config
  const selectedModules = currentRoleConfig?.modules.filter(m => 
    selectedModuleIds.includes(m.id)
  ) || []

  // Handle role selection
  const handleRoleSelect = useCallback((roleId: string) => {
    setSelectedRoleId(roleId)
  }, [])

  // Handle module checkbox toggle
  const handleModuleToggle = useCallback((moduleId: string, checked: boolean) => {
    if (checked) {
      setSelectedModuleIds(prev => [...prev, moduleId])
    } else {
      setSelectedModuleIds(prev => prev.filter(id => id !== moduleId))
    }
  }, [])

  // Handle group expand/collapse toggle
  const handleGroupExpand = useCallback((groupId: string) => {
    setExpandedGroups(prev => {
      const next = new Set(prev)
      if (next.has(groupId)) {
        next.delete(groupId)
      } else {
        next.add(groupId)
      }
      return next
    })
  }, [])

  // Handle module expand/collapse toggle
  const handleModuleExpand = useCallback((moduleId: string) => {
    setExpandedModules(prev => {
      const next = new Set(prev)
      if (next.has(moduleId)) {
        next.delete(moduleId)
      } else {
        next.add(moduleId)
      }
      return next
    })
  }, [])

  // Handle "Select All" toggle for entire module
  const handleModuleSelectAll = useCallback((moduleId: string, checked: boolean) => {
    setRoleConfigs(prev => prev.map(config => {
      if (config.roleId !== selectedRoleId) return config
      return {
        ...config,
        modules: config.modules.map(module => {
          if (module.id !== moduleId) return module
          return {
            ...module,
            groups: module.groups.map(group => ({
              ...group,
              selectAll: checked,
              components: group.components.map(c => ({ ...c, enabled: checked }))
            }))
          }
        })
      }
    }))
  }, [selectedRoleId])

  // Handle "Select All" toggle for a group
  const handleSelectAllToggle = useCallback((moduleId: string, groupId: string, checked: boolean) => {
    setRoleConfigs(prev => prev.map(config => {
      if (config.roleId !== selectedRoleId) return config
      return {
        ...config,
        modules: config.modules.map(module => {
          if (module.id !== moduleId) return module
          return {
            ...module,
            groups: module.groups.map(group => {
              if (group.id !== groupId) return group
              return {
                ...group,
                selectAll: checked,
                components: group.components.map(c => ({ ...c, enabled: checked }))
              }
            })
          }
        })
      }
    }))
  }, [selectedRoleId])

  // Handle individual component toggle
  const handleComponentToggle = useCallback((moduleId: string, groupId: string, componentId: string, checked: boolean) => {
    setRoleConfigs(prev => prev.map(config => {
      if (config.roleId !== selectedRoleId) return config
      return {
        ...config,
        modules: config.modules.map(module => {
          if (module.id !== moduleId) return module
          return {
            ...module,
            groups: module.groups.map(group => {
              if (group.id !== groupId) return group
              const updatedComponents = group.components.map(c => 
                c.id === componentId ? { ...c, enabled: checked } : c
              )
              const allEnabled = updatedComponents.every(c => c.enabled)
              return {
                ...group,
                selectAll: allEnabled,
                components: updatedComponents
              }
            })
          }
        })
      }
    }))
  }, [selectedRoleId])

  // Drag and drop handlers
  const handleDragStart = useCallback((e: React.DragEvent, componentId: string) => {
    setDraggedItemId(componentId)
    e.dataTransfer.effectAllowed = 'move'
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent, componentId: string) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    setDragOverItemId(componentId)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent, moduleId: string, groupId: string, targetComponentId: string) => {
    e.preventDefault()
    if (!draggedItemId || draggedItemId === targetComponentId) {
      setDraggedItemId(null)
      setDragOverItemId(null)
      return
    }

    setRoleConfigs(prev => prev.map(config => {
      if (config.roleId !== selectedRoleId) return config
      return {
        ...config,
        modules: config.modules.map(module => {
          if (module.id !== moduleId) return module
          return {
            ...module,
            groups: module.groups.map(group => {
              if (group.id !== groupId) return group
              
              const components = [...group.components]
              const draggedIndex = components.findIndex(c => c.id === draggedItemId)
              const targetIndex = components.findIndex(c => c.id === targetComponentId)
              
              if (draggedIndex === -1 || targetIndex === -1) return group
              
              // Swap positions
              const [draggedItem] = components.splice(draggedIndex, 1)
              components.splice(targetIndex, 0, draggedItem)
              
              // Update order
              const reorderedComponents = components.map((c, idx) => ({ ...c, order: idx }))
              
              return { ...group, components: reorderedComponents }
            })
          }
        })
      }
    }))

    setDraggedItemId(null)
    setDragOverItemId(null)
  }, [draggedItemId, selectedRoleId])

  const handleDragEnd = useCallback(() => {
    setDraggedItemId(null)
    setDragOverItemId(null)
  }, [])

  // Module drag and drop handlers
  const handleModuleDragStart = useCallback((e: React.DragEvent, moduleId: string) => {
    setDraggedModuleId(moduleId)
    e.dataTransfer.effectAllowed = 'move'
  }, [])

  const handleModuleDragOver = useCallback((e: React.DragEvent, moduleId: string) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    setDragOverModuleId(moduleId)
  }, [])

  const handleModuleDrop = useCallback((e: React.DragEvent, targetModuleId: string) => {
    e.preventDefault()
    if (!draggedModuleId || draggedModuleId === targetModuleId) {
      setDraggedModuleId(null)
      setDragOverModuleId(null)
      return
    }

    setModuleOrder(prev => {
      const newOrder = [...prev]
      const draggedIndex = newOrder.indexOf(draggedModuleId)
      const targetIndex = newOrder.indexOf(targetModuleId)
      
      if (draggedIndex === -1 || targetIndex === -1) return prev
      
      const [draggedItem] = newOrder.splice(draggedIndex, 1)
      newOrder.splice(targetIndex, 0, draggedItem)
      
      return newOrder
    })

    setDraggedModuleId(null)
    setDragOverModuleId(null)
  }, [draggedModuleId])

  const handleModuleDragEnd = useCallback(() => {
    setDraggedModuleId(null)
    setDragOverModuleId(null)
  }, [])

  // Group drag and drop handlers
  const handleGroupDragStart = useCallback((e: React.DragEvent, groupId: string) => {
    e.stopPropagation()
    setDraggedGroupId(groupId)
    e.dataTransfer.effectAllowed = 'move'
  }, [])

  const handleGroupDragOver = useCallback((e: React.DragEvent, groupId: string) => {
    e.preventDefault()
    e.stopPropagation()
    e.dataTransfer.dropEffect = 'move'
    setDragOverGroupId(groupId)
  }, [])

  const handleGroupDrop = useCallback((e: React.DragEvent, moduleId: string, targetGroupId: string) => {
    e.preventDefault()
    e.stopPropagation()
    if (!draggedGroupId || draggedGroupId === targetGroupId) {
      setDraggedGroupId(null)
      setDragOverGroupId(null)
      return
    }

    setRoleConfigs(prev => prev.map(config => {
      if (config.roleId !== selectedRoleId) return config
      return {
        ...config,
        modules: config.modules.map(module => {
          if (module.id !== moduleId) return module
          
          const groups = [...module.groups]
          const draggedIndex = groups.findIndex(g => g.id === draggedGroupId)
          const targetIndex = groups.findIndex(g => g.id === targetGroupId)
          
          if (draggedIndex === -1 || targetIndex === -1) return module
          
          const [draggedItem] = groups.splice(draggedIndex, 1)
          groups.splice(targetIndex, 0, draggedItem)
          
          return { ...module, groups }
        })
      }
    }))

    setDraggedGroupId(null)
    setDragOverGroupId(null)
  }, [draggedGroupId, selectedRoleId])

  const handleGroupDragEnd = useCallback(() => {
    setDraggedGroupId(null)
    setDragOverGroupId(null)
  }, [])

  // Get ordered modules
  const orderedModules = moduleOrder.map(id => ALL_MODULES.find(m => m.id === id)).filter(Boolean) as InterfaceModule[]

  return (
    <div className={cn('flex gap-4 h-[calc(100vh-280px)] min-h-[500px]', className)}>
      {/* Left Panel - Role List */}
      <RoleListPanel
        roles={DEFAULT_ROLES}
        selectedRoleId={selectedRoleId}
        onRoleSelect={handleRoleSelect}
      />

      {/* Middle Panel - Module List */}
      <ModuleListPanel
        modules={orderedModules}
        selectedModuleIds={selectedModuleIds}
        onModuleToggle={handleModuleToggle}
        draggedModuleId={draggedModuleId}
        dragOverModuleId={dragOverModuleId}
        onModuleDragStart={handleModuleDragStart}
        onModuleDragOver={handleModuleDragOver}
        onModuleDrop={handleModuleDrop}
        onModuleDragEnd={handleModuleDragEnd}
      />

      {/* Right Panel - Component Configuration */}
      <ComponentConfigPanel
        modules={selectedModules}
        expandedGroups={expandedGroups}
        expandedModules={expandedModules}
        onGroupExpand={handleGroupExpand}
        onModuleExpand={handleModuleExpand}
        onModuleSelectAll={handleModuleSelectAll}
        onSelectAllToggle={handleSelectAllToggle}
        onComponentToggle={handleComponentToggle}
        draggedItemId={draggedItemId}
        dragOverItemId={dragOverItemId}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onDragEnd={handleDragEnd}
        draggedGroupId={draggedGroupId}
        dragOverGroupId={dragOverGroupId}
        onGroupDragStart={handleGroupDragStart}
        onGroupDragOver={handleGroupDragOver}
        onGroupDrop={handleGroupDrop}
        onGroupDragEnd={handleGroupDragEnd}
      />
    </div>
  )
}

// Role List Panel Component
interface RoleListPanelProps {
  roles: typeof DEFAULT_ROLES
  selectedRoleId: string
  onRoleSelect: (roleId: string) => void
}

function RoleListPanel({ roles, selectedRoleId, onRoleSelect }: RoleListPanelProps) {
  return (
    <div className="w-56 flex-shrink-0 bg-white border border-gray-200 rounded-lg overflow-hidden">
      <div className="p-2">
        {roles.map(role => (
          <div
            key={role.id}
            onClick={() => onRoleSelect(role.id)}
            className={cn(
              'relative flex items-center justify-between px-3 py-2 rounded-md cursor-pointer transition-colors mb-1',
              selectedRoleId === role.id
                ? 'bg-[#3e79f7] text-white'
                : 'text-[#455560] hover:bg-gray-100'
            )}
          >
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span className="text-sm font-medium">{role.name}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Module List Panel Component
interface ModuleListPanelProps {
  modules: InterfaceModule[]
  selectedModuleIds: string[]
  onModuleToggle: (moduleId: string, checked: boolean) => void
  draggedModuleId: string | null
  dragOverModuleId: string | null
  onModuleDragStart: (e: React.DragEvent, moduleId: string) => void
  onModuleDragOver: (e: React.DragEvent, moduleId: string) => void
  onModuleDrop: (e: React.DragEvent, targetModuleId: string) => void
  onModuleDragEnd: () => void
}

function ModuleListPanel({ 
  modules, 
  selectedModuleIds, 
  onModuleToggle,
  draggedModuleId,
  dragOverModuleId,
  onModuleDragStart,
  onModuleDragOver,
  onModuleDrop,
  onModuleDragEnd
}: ModuleListPanelProps) {
  return (
    <div className="w-52 flex-shrink-0 bg-white border border-gray-200 rounded-lg overflow-hidden">
      <div className="p-3 border-b border-gray-200">
        <h3 className="text-sm font-semibold text-[#455560]">Module</h3>
      </div>
      <div className="p-2 space-y-1 max-h-[calc(100%-48px)] overflow-y-auto">
        {modules.map(module => {
          const IconComponent = MODULE_ICONS[module.icon] || LayoutDashboard
          return (
            <div
              key={module.id}
              draggable
              onDragStart={(e) => onModuleDragStart(e, module.id)}
              onDragOver={(e) => onModuleDragOver(e, module.id)}
              onDrop={(e) => onModuleDrop(e, module.id)}
              onDragEnd={onModuleDragEnd}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-md cursor-pointer hover:bg-gray-50 transition-colors',
                draggedModuleId === module.id && 'opacity-50',
                dragOverModuleId === module.id && draggedModuleId !== module.id && 'border-t-2 border-[#3e79f7]'
              )}
            >
              <Checkbox
                checked={selectedModuleIds.includes(module.id)}
                onCheckedChange={(checked) => onModuleToggle(module.id, checked as boolean)}
                className="data-[state=checked]:bg-[#3e79f7] data-[state=checked]:border-[#3e79f7]"
              />
              <GripVertical className="w-4 h-4 text-gray-400 cursor-grab active:cursor-grabbing" />
              <span className="text-sm text-[#455560]">{module.name}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// Component Config Panel
interface ComponentConfigPanelProps {
  modules: InterfaceModule[]
  expandedGroups: Set<string>
  expandedModules: Set<string>
  onGroupExpand: (groupId: string) => void
  onModuleExpand: (moduleId: string) => void
  onModuleSelectAll: (moduleId: string, checked: boolean) => void
  onSelectAllToggle: (moduleId: string, groupId: string, checked: boolean) => void
  onComponentToggle: (moduleId: string, groupId: string, componentId: string, checked: boolean) => void
  draggedItemId: string | null
  dragOverItemId: string | null
  onDragStart: (e: React.DragEvent, componentId: string) => void
  onDragOver: (e: React.DragEvent, componentId: string) => void
  onDrop: (e: React.DragEvent, moduleId: string, groupId: string, targetComponentId: string) => void
  onDragEnd: () => void
  draggedGroupId: string | null
  dragOverGroupId: string | null
  onGroupDragStart: (e: React.DragEvent, groupId: string) => void
  onGroupDragOver: (e: React.DragEvent, groupId: string) => void
  onGroupDrop: (e: React.DragEvent, moduleId: string, targetGroupId: string) => void
  onGroupDragEnd: () => void
}

function ComponentConfigPanel({
  modules,
  expandedGroups,
  expandedModules,
  onGroupExpand,
  onModuleExpand,
  onModuleSelectAll,
  onSelectAllToggle,
  onComponentToggle,
  draggedItemId,
  dragOverItemId,
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnd,
  draggedGroupId,
  dragOverGroupId,
  onGroupDragStart,
  onGroupDragOver,
  onGroupDrop,
  onGroupDragEnd
}: ComponentConfigPanelProps) {
  if (modules.length === 0) {
    return (
      <div className="flex-1 bg-white border border-gray-200 rounded-lg overflow-hidden flex items-center justify-center">
        <p className="text-gray-400 text-sm">Chọn module để cấu hình giao diện</p>
      </div>
    )
  }

  return (
    <div className="flex-1 bg-white border border-gray-200 rounded-lg overflow-hidden">
      <div className="p-4 max-h-full overflow-y-auto space-y-4">
        {modules.map(module => (
          <ModuleConfigSection
            key={module.id}
            module={module}
            isModuleExpanded={!expandedModules.has(module.id)}
            expandedGroups={expandedGroups}
            onModuleExpand={onModuleExpand}
            onModuleSelectAll={onModuleSelectAll}
            onGroupExpand={onGroupExpand}
            onSelectAllToggle={onSelectAllToggle}
            onComponentToggle={onComponentToggle}
            draggedItemId={draggedItemId}
            dragOverItemId={dragOverItemId}
            onDragStart={onDragStart}
            onDragOver={onDragOver}
            onDrop={onDrop}
            onDragEnd={onDragEnd}
            draggedGroupId={draggedGroupId}
            dragOverGroupId={dragOverGroupId}
            onGroupDragStart={onGroupDragStart}
            onGroupDragOver={onGroupDragOver}
            onGroupDrop={onGroupDrop}
            onGroupDragEnd={onGroupDragEnd}
          />
        ))}
      </div>
    </div>
  )
}

// Module Config Section
interface ModuleConfigSectionProps {
  module: InterfaceModule
  isModuleExpanded: boolean
  expandedGroups: Set<string>
  onModuleExpand: (moduleId: string) => void
  onModuleSelectAll: (moduleId: string, checked: boolean) => void
  onGroupExpand: (groupId: string) => void
  onSelectAllToggle: (moduleId: string, groupId: string, checked: boolean) => void
  onComponentToggle: (moduleId: string, groupId: string, componentId: string, checked: boolean) => void
  draggedItemId: string | null
  dragOverItemId: string | null
  onDragStart: (e: React.DragEvent, componentId: string) => void
  onDragOver: (e: React.DragEvent, componentId: string) => void
  onDrop: (e: React.DragEvent, moduleId: string, groupId: string, targetComponentId: string) => void
  onDragEnd: () => void
  draggedGroupId: string | null
  dragOverGroupId: string | null
  onGroupDragStart: (e: React.DragEvent, groupId: string) => void
  onGroupDragOver: (e: React.DragEvent, groupId: string) => void
  onGroupDrop: (e: React.DragEvent, moduleId: string, targetGroupId: string) => void
  onGroupDragEnd: () => void
}

function ModuleConfigSection({
  module,
  isModuleExpanded,
  expandedGroups,
  onModuleExpand,
  onModuleSelectAll,
  onGroupExpand,
  onSelectAllToggle,
  onComponentToggle,
  draggedItemId,
  dragOverItemId,
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnd,
  draggedGroupId,
  dragOverGroupId,
  onGroupDragStart,
  onGroupDragOver,
  onGroupDrop,
  onGroupDragEnd
}: ModuleConfigSectionProps) {
  const IconComponent = MODULE_ICONS[module.icon] || LayoutDashboard
  
  // Check if all groups have selectAll enabled
  const isModuleAllSelected = module.groups.length > 0 && module.groups.every(g => g.selectAll)

  if (module.groups.length === 0) {
    return (
      <div className="border border-gray-200 rounded-lg p-4">
        <div className="flex items-center gap-2 text-[#455560]">
          <IconComponent className="w-5 h-5" />
          <span className="font-medium">{module.name}</span>
        </div>
        <p className="text-sm text-gray-400 mt-2">Chưa có cấu hình chi tiết cho module này</p>
      </div>
    )
  }

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      {/* Module Header - Parent Wrapper */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#fafafb] border-b border-gray-200">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-[#1a3353]">{module.name}</span>
          <span className="text-xs text-gray-500">({module.groups.length} modules)</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">Tất cả</span>
            <Switch
              checked={isModuleAllSelected}
              onCheckedChange={(checked) => onModuleSelectAll(module.id, checked)}
              className="data-[state=checked]:bg-[#3e79f7]"
            />
          </div>
          <button
            onClick={() => onModuleExpand(module.id)}
            className="p-1 hover:bg-gray-200 rounded transition-colors"
          >
            {isModuleExpanded ? (
              <ChevronDown className="w-4 h-4 text-gray-500" />
            ) : (
              <ChevronRight className="w-4 h-4 text-gray-500" />
            )}
          </button>
        </div>
      </div>

      {/* Module Content - Groups */}
      {isModuleExpanded && (
        <div className="p-4 space-y-3">
          {module.groups.map(group => (
            <GroupConfigSection
              key={group.id}
              moduleId={module.id}
              group={group}
              isExpanded={!expandedGroups.has(group.id)}
              onToggleExpand={() => onGroupExpand(group.id)}
              onSelectAllToggle={onSelectAllToggle}
              onComponentToggle={onComponentToggle}
              draggedItemId={draggedItemId}
              dragOverItemId={dragOverItemId}
              onDragStart={onDragStart}
              onDragOver={onDragOver}
              onDrop={onDrop}
              onDragEnd={onDragEnd}
              draggedGroupId={draggedGroupId}
              dragOverGroupId={dragOverGroupId}
              onGroupDragStart={onGroupDragStart}
              onGroupDragOver={onGroupDragOver}
              onGroupDrop={onGroupDrop}
              onGroupDragEnd={onGroupDragEnd}
            />
          ))}
        </div>
      )}
    </div>
  )
}

// Group Config Section
interface GroupConfigSectionProps {
  moduleId: string
  group: InterfaceGroup
  isExpanded: boolean
  onToggleExpand: () => void
  onSelectAllToggle: (moduleId: string, groupId: string, checked: boolean) => void
  onComponentToggle: (moduleId: string, groupId: string, componentId: string, checked: boolean) => void
  draggedItemId: string | null
  dragOverItemId: string | null
  onDragStart: (e: React.DragEvent, componentId: string) => void
  onDragOver: (e: React.DragEvent, componentId: string) => void
  onDrop: (e: React.DragEvent, moduleId: string, groupId: string, targetComponentId: string) => void
  onDragEnd: () => void
  draggedGroupId: string | null
  dragOverGroupId: string | null
  onGroupDragStart: (e: React.DragEvent, groupId: string) => void
  onGroupDragOver: (e: React.DragEvent, groupId: string) => void
  onGroupDrop: (e: React.DragEvent, moduleId: string, targetGroupId: string) => void
  onGroupDragEnd: () => void
}

function GroupConfigSection({
  moduleId,
  group,
  isExpanded,
  onToggleExpand,
  onSelectAllToggle,
  onComponentToggle,
  draggedItemId,
  dragOverItemId,
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnd,
  draggedGroupId,
  dragOverGroupId,
  onGroupDragStart,
  onGroupDragOver,
  onGroupDrop,
  onGroupDragEnd
}: GroupConfigSectionProps) {
  return (
    <div 
      className={cn(
        "border border-gray-200 rounded-lg overflow-hidden bg-white",
        draggedGroupId === group.id && 'opacity-50',
        dragOverGroupId === group.id && draggedGroupId !== group.id && 'border-t-2 border-[#3e79f7]'
      )}
      draggable
      onDragStart={(e) => onGroupDragStart(e, group.id)}
      onDragOver={(e) => onGroupDragOver(e, group.id)}
      onDrop={(e) => onGroupDrop(e, moduleId, group.id)}
      onDragEnd={onGroupDragEnd}
    >
      {/* Group Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-gray-100 flex items-center justify-center cursor-grab active:cursor-grabbing">
            <GripVertical className="w-3.5 h-3.5 text-gray-400" />
          </div>
          <span className="text-sm font-medium text-[#3e79f7]">{group.name}</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">Tất cả</span>
            <Switch
              checked={group.selectAll}
              onCheckedChange={(checked) => onSelectAllToggle(moduleId, group.id, checked)}
              className="data-[state=checked]:bg-[#3e79f7]"
            />
          </div>
          <button
            onClick={onToggleExpand}
            className="p-1 hover:bg-gray-200 rounded transition-colors"
          >
            {isExpanded ? (
              <ChevronDown className="w-4 h-4 text-gray-500" />
            ) : (
              <ChevronRight className="w-4 h-4 text-gray-500" />
            )}
          </button>
        </div>
      </div>

      {/* Group Components */}
      {isExpanded && (
        <div className="p-3 space-y-1">
          {group.components.map(component => (
            <ComponentItem
              key={component.id}
              moduleId={moduleId}
              groupId={group.id}
              component={component}
              isDragged={draggedItemId === component.id}
              isDragOver={dragOverItemId === component.id}
              onToggle={onComponentToggle}
              onDragStart={onDragStart}
              onDragOver={onDragOver}
              onDrop={onDrop}
              onDragEnd={onDragEnd}
            />
          ))}
        </div>
      )}
    </div>
  )
}

// Component Item
interface ComponentItemProps {
  moduleId: string
  groupId: string
  component: InterfaceComponent
  isDragged: boolean
  isDragOver: boolean
  onToggle: (moduleId: string, groupId: string, componentId: string, checked: boolean) => void
  onDragStart: (e: React.DragEvent, componentId: string) => void
  onDragOver: (e: React.DragEvent, componentId: string) => void
  onDrop: (e: React.DragEvent, moduleId: string, groupId: string, targetComponentId: string) => void
  onDragEnd: () => void
}

function ComponentItem({
  moduleId,
  groupId,
  component,
  isDragged,
  isDragOver,
  onToggle,
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnd
}: ComponentItemProps) {
  const isNested = !!component.parentId

  return (
    <div
      draggable
      onDragStart={(e) => {
        e.stopPropagation()
        onDragStart(e, component.id)
      }}
      onDragOver={(e) => {
        e.stopPropagation()
        onDragOver(e, component.id)
      }}
      onDrop={(e) => {
        e.stopPropagation()
        onDrop(e, moduleId, groupId, component.id)
      }}
      onDragEnd={onDragEnd}
      className={cn(
        'flex items-center gap-2 py-1.5 cursor-pointer rounded px-1',
        isDragged && 'opacity-50',
        isDragOver && !isDragged && 'border-t-2 border-[#3e79f7]',
        isNested && 'ml-4'
      )}
    >
      <GripVertical className="w-3 h-3 text-gray-400 cursor-grab active:cursor-grabbing flex-shrink-0" />
      <Checkbox
        checked={component.enabled}
        onCheckedChange={(checked) => onToggle(moduleId, groupId, component.id, checked as boolean)}
        className="data-[state=checked]:bg-[#3e79f7] data-[state=checked]:border-[#3e79f7]"
      />
      <span className={cn(
        'text-sm',
        component.enabled ? 'text-[#455560]' : 'text-gray-400'
      )}>
        {component.name}
      </span>
    </div>
  )
}

export default InterfacePermissionContent
