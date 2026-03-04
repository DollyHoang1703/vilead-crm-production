// Types for Interface Permission Configuration by Role

export interface InterfaceComponent {
  id: string
  name: string
  enabled: boolean
  order: number
  parentId?: string // For nested components
}

export interface InterfaceGroup {
  id: string
  name: string
  moduleId: string
  expanded: boolean
  selectAll: boolean
  components: InterfaceComponent[]
  hasExpandButton?: boolean // For groups with nested sub-groups
}

export interface InterfaceModule {
  id: string
  name: string
  icon: string
  enabled: boolean
  groups: InterfaceGroup[]
}

export interface RoleInterfaceConfig {
  roleId: string
  roleName: string
  modules: InterfaceModule[]
}

export type ModuleId = 
  | 'dashboard'
  | 'sales'
  | 'customers'
  | 'orders'
  | 'tasks'
  | 'kpi'
  | 'chat'
  | 'email-marketing'
  | 'reports'
  | 'settings'

export interface Role {
  id: string
  name: string
  description?: string
}

// Default roles in the system
export const DEFAULT_ROLES: Role[] = [
  { id: 'admin', name: 'Admin', description: 'Quản trị viên hệ thống' },
  { id: 'sale', name: 'Sale', description: 'Nhân viên kinh doanh' },
  { id: 'leader', name: 'Leader', description: 'Trưởng nhóm' },
  { id: 'sale-manager', name: 'Sale Manager', description: 'Quản lý kinh doanh' },
  { id: 'support', name: 'Support', description: 'Nhân viên hỗ trợ' },
  { id: 'support-manager', name: 'Support Manager', description: 'Quản lý hỗ trợ' },
]
