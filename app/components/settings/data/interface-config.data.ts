import { InterfaceModule, RoleInterfaceConfig, DEFAULT_ROLES } from '../types/interface-permission.types'

// Helper function to create component
const createComponent = (id: string, name: string, order: number, parentId?: string) => ({
  id,
  name,
  enabled: true,
  order,
  parentId
})

// Helper function to create group
const createGroup = (
  id: string, 
  name: string, 
  moduleId: string, 
  components: { id: string; name: string; parentId?: string }[],
  hasExpandButton: boolean = false
) => ({
  id,
  name,
  moduleId,
  expanded: true,
  selectAll: true,
  hasExpandButton,
  components: components.map((c, idx) => createComponent(c.id, c.name, idx, c.parentId))
})

// Module: Tổng quan
export const DASHBOARD_MODULE: InterfaceModule = {
  id: 'dashboard',
  name: 'Tổng quan',
  icon: 'LayoutDashboard',
  enabled: true,
  groups: [
    createGroup('dashboard-main', 'Tổng quan', 'dashboard', [
      { id: 'dashboard-revenue', name: 'Doanh thu theo ngày' },
      { id: 'dashboard-tasks', name: 'Công việc quan trọng' },
      { id: 'dashboard-funnel', name: 'Phễu chuyển đổi' },
      { id: 'dashboard-leads-source', name: 'Nguồn leads & Phân tích' },
      { id: 'dashboard-top-sales', name: 'Top nhân viên kinh doanh' },
      { id: 'dashboard-top-products', name: 'Top sản phẩm' },
    ])
  ]
}

// Module: Hoạt động bán hàng
export const SALES_MODULE: InterfaceModule = {
  id: 'sales',
  name: 'Hoạt động bán hàng',
  icon: 'TrendingUp',
  enabled: true,
  groups: [
    createGroup('sales-process', 'Quy trình bán hàng', 'sales', [
      { id: 'sales-process-main', name: 'Quy trình bán hàng' },
    ]),
    createGroup('sales-kanban', 'Bảng - Kanban "Danh sách lead"', 'sales', [
      { id: 'sales-kanban-view', name: 'Xem chi tiết' },
      { id: 'sales-kanban-edit', name: 'Chỉnh sửa' },
      { id: 'sales-kanban-note', name: 'Thêm ghi chú' },
      { id: 'sales-kanban-convert', name: 'Chuyển đổi khách hàng' },
      { id: 'sales-kanban-delete', name: 'Xóa lead' },
    ], true),
    createGroup('sales-functions', 'Chức năng', 'sales', [
      { id: 'sales-func-import', name: 'Nhập leads' },
      { id: 'sales-func-add', name: 'Thêm lead' },
      { id: 'sales-func-assign', name: 'Gán sales nhanh' },
      { id: 'sales-func-status', name: 'Chuyển trạng thái' },
      { id: 'sales-func-task', name: 'Tạo task nhanh' },
      { id: 'sales-func-export', name: 'Xuất leads' },
      { id: 'sales-func-convert', name: 'Chuyển đổi khách hàng' },
    ], true)
  ]
}

// Module: Chăm sóc khách hàng
export const CUSTOMERS_MODULE: InterfaceModule = {
  id: 'customers',
  name: 'Chăm sóc khách hàng',
  icon: 'Users',
  enabled: true,
  groups: [
    createGroup('customers-classification', 'Phân loại khách hàng', 'customers', [
      { id: 'customers-class-main', name: 'Phân loại khách hàng' },
    ]),
    createGroup('customers-table', 'Bảng "Danh sách khách hàng"', 'customers', [
      { id: 'customers-table-view', name: 'Xem chi tiết' },
      { id: 'customers-table-order', name: 'Tạo đơn hàng' },
      { id: 'customers-table-note', name: 'Ghi chú' },
      { id: 'customers-table-delete', name: 'Xóa khách hàng' },
    ], true),
    createGroup('customers-functions', 'Chức năng', 'customers', [
      { id: 'customers-func-import', name: 'Nhập khách hàng' },
      { id: 'customers-func-add', name: 'Thêm khách hàng' },
      { id: 'customers-func-task', name: 'Tạo task nhanh' },
      { id: 'customers-func-export', name: 'Xuất dữ liệu' },
    ], true)
  ]
}

// Module: Quản lý đơn hàng
export const ORDERS_MODULE: InterfaceModule = {
  id: 'orders',
  name: 'Quản lý đơn hàng',
  icon: 'ShoppingCart',
  enabled: true,
  groups: [
    createGroup('orders-main', 'Đơn hàng', 'orders', [
      { id: 'orders-overview', name: 'Tổng quan đơn hàng' },
    ], true),
    createGroup('orders-table', 'Bảng "Danh sách đơn hàng"', 'orders', [
      { id: 'orders-table-view', name: 'Xem chi tiết' },
      { id: 'orders-table-payment', name: 'Thanh toán đơn hàng' },
      { id: 'orders-table-remind', name: 'Nhắc nhở thanh toán' },
      { id: 'orders-table-invoice', name: 'Gắn hóa đơn' },
      { id: 'orders-table-note', name: 'Thêm ghi chú' },
      { id: 'orders-table-refund', name: 'Hoàn tiền' },
      { id: 'orders-table-delete', name: 'Xóa đơn hàng' },
    ], true),
    createGroup('orders-functions', 'Chức năng', 'orders', [
      { id: 'orders-func-create', name: 'Tạo đơn hàng' },
      { id: 'orders-func-paid', name: 'Đánh dấu đã thanh toán' },
      { id: 'orders-func-remind', name: 'Gửi nhắc nhở' },
      { id: 'orders-func-export', name: 'Xuất dữ liệu' },
    ], true),
    createGroup('orders-reminder', 'Nhắc thanh toán', 'orders', [
      { id: 'orders-reminder-manage', name: 'Quản lý nhắc thanh toán' },
      { id: 'orders-reminder-table', name: 'Bảng "Danh sách nhắc thanh toán"' },
    ], true)
  ]
}

// Module: Quản lý công việc
export const TASKS_MODULE: InterfaceModule = {
  id: 'tasks',
  name: 'Quản lý công việc',
  icon: 'CheckSquare',
  enabled: true,
  groups: [
    createGroup('tasks-list', 'Danh sách', 'tasks', [
      { id: 'tasks-overview', name: 'Tổng quan công việc' },
    ], true),
    createGroup('tasks-table', 'Bảng - Kanban "Danh sách công việc"', 'tasks', [
      { id: 'tasks-table-view', name: 'Xem chi tiết' },
      { id: 'tasks-table-edit', name: 'Chỉnh sửa' },
      { id: 'tasks-table-delete', name: 'Xóa công việc' },
    ], true),
    createGroup('tasks-functions', 'Chức năng', 'tasks', [
      { id: 'tasks-func-add', name: 'Thêm mới' },
      { id: 'tasks-func-done', name: 'Đánh dấu đã làm' },
      { id: 'tasks-func-delete', name: 'Xóa công việc' },
    ], true)
  ]
}

// Module: Quản lý KPI (empty as per requirement)
export const KPI_MODULE: InterfaceModule = {
  id: 'kpi',
  name: 'Quản lý KPI',
  icon: 'Target',
  enabled: true,
  groups: []
}

// Module: Chat đa kênh
export const CHAT_MODULE: InterfaceModule = {
  id: 'chat',
  name: 'Chat đa kênh',
  icon: 'MessageSquare',
  enabled: true,
  groups: [
    createGroup('chat-channels', 'Kênh chat', 'chat', [
      { id: 'chat-facebook', name: 'Facebook' },
      { id: 'chat-zalo', name: 'Zalo' },
      { id: 'chat-zalo-oa', name: 'Zalo OA' },
    ]),
    createGroup('chat-functions', 'Chức năng', 'chat', [
      { id: 'chat-func-view', name: 'Xem chi tiết' },
      { id: 'chat-func-status', name: 'Chuyển trạng thái' },
      { id: 'chat-func-order', name: 'Tạo đơn hàng' },
      { id: 'chat-func-task', name: 'Tạo task nhanh' },
      { id: 'chat-func-note', name: 'Thêm ghi chú' },
    ], true)
  ]
}

// Module: Email Marketing (empty as per requirement)
export const EMAIL_MARKETING_MODULE: InterfaceModule = {
  id: 'email-marketing',
  name: 'Email Marketing',
  icon: 'Mail',
  enabled: true,
  groups: []
}

// Module: Chi tiết khách hàng
export const CUSTOMER_DETAIL_MODULE: InterfaceModule = {
  id: 'customer-detail',
  name: 'Chi tiết khách hàng',
  icon: 'UserCog',
  enabled: true,
  groups: [
    createGroup('customer-detail-orders', 'Đơn hàng', 'customer-detail', [
      { id: 'cd-order-view', name: 'Xem chi tiết' },
      { id: 'cd-order-invoice', name: 'Gắn hóa đơn' },
      { id: 'cd-order-refund', name: 'Hoàn tiền/Hủy đơn' },
    ], true),
    createGroup('customer-detail-notes', 'Ghi chú', 'customer-detail', [
      { id: 'cd-note-add', name: 'Thêm' },
      { id: 'cd-note-edit', name: 'Sửa' },
      { id: 'cd-note-delete', name: 'Xóa' },
    ], true),
    createGroup('customer-detail-tasks', 'Công việc', 'customer-detail', [
      { id: 'cd-tasks-main', name: 'Công việc' },
    ], true),
    createGroup('customer-detail-history', 'Lịch sử', 'customer-detail', [
      { id: 'cd-history-main', name: 'Lịch sử' },
    ], true)
  ]
}

// Module: Báo cáo
export const REPORTS_MODULE: InterfaceModule = {
  id: 'reports',
  name: 'Báo cáo',
  icon: 'BarChart3',
  enabled: true,
  groups: [
    createGroup('reports-overview', 'Tổng quan', 'reports', [
      { id: 'reports-overview-main', name: 'Tổng quan' },
    ]),
    createGroup('reports-sales', 'Doanh số', 'reports', [
      { id: 'reports-sales-status', name: 'Phân loại đơn hàng theo trạng thái' },
      { id: 'reports-sales-product', name: 'Doanh số theo sản phẩm' },
      { id: 'reports-sales-trend', name: 'Xu hướng doanh số' },
      { id: 'reports-sales-detail', name: 'Chi tiết doanh số' },
      { id: 'reports-sales-export', name: 'Xuất dữ liệu', parentId: 'reports-sales-detail' },
    ], true),
    createGroup('reports-performance', 'Hiệu suất', 'reports', [
      { id: 'reports-perf-table', name: 'Bảng hiệu suất Sales' },
      { id: 'reports-perf-export', name: 'Xuất dữ liệu', parentId: 'reports-perf-table' },
    ], true),
    createGroup('reports-process', 'Quy trình', 'reports', [
      { id: 'reports-process-funnel', name: 'Phễu chuyển đổi' },
    ], true),
    createGroup('reports-lead-source', 'Nguồn lead', 'reports', [
      { id: 'reports-lead-report', name: 'Báo cáo nguồn lead' },
    ], true),
    createGroup('reports-customer', 'Khách hàng', 'reports', [
      { id: 'reports-customer-frequency', name: 'Tần suất mua hàng' },
      { id: 'reports-customer-new-return', name: 'Khách hàng mới và quay trở lại' },
      { id: 'reports-customer-top10', name: 'Top 10 khách hàng giá trị nhất' },
      { id: 'reports-customer-export', name: 'Xuất dữ liệu', parentId: 'reports-customer-top10' },
    ], true)
  ]
}

// Module: Cài đặt
export const SETTINGS_MODULE: InterfaceModule = {
  id: 'settings',
  name: 'Cài đặt',
  icon: 'Settings',
  enabled: true,
  groups: [
    // Thiết lập - Phòng ban
    createGroup('settings-setup-dept', 'Thiết lập > Phòng ban', 'settings', [
      { id: 'settings-dept-list', name: 'Danh sách phòng ban' },
      { id: 'settings-dept-edit', name: 'Sửa', parentId: 'settings-dept-list' },
      { id: 'settings-dept-delete', name: 'Xóa', parentId: 'settings-dept-list' },
      { id: 'settings-dept-add', name: 'Thêm phòng ban' },
    ], true),
    // Thiết lập - Nhóm
    createGroup('settings-setup-group', 'Thiết lập > Nhóm', 'settings', [
      { id: 'settings-group-list', name: 'Danh sách nhóm' },
      { id: 'settings-group-edit', name: 'Sửa', parentId: 'settings-group-list' },
      { id: 'settings-group-delete', name: 'Xóa', parentId: 'settings-group-list' },
      { id: 'settings-group-add', name: 'Thêm nhóm' },
    ], true),
    // Thiết lập - Nhân viên
    createGroup('settings-setup-employee', 'Thiết lập > Nhân viên', 'settings', [
      { id: 'settings-emp-list', name: 'Danh sách nhân viên' },
      { id: 'settings-emp-edit', name: 'Sửa', parentId: 'settings-emp-list' },
      { id: 'settings-emp-delete', name: 'Xóa', parentId: 'settings-emp-list' },
      { id: 'settings-emp-add', name: 'Thêm nhân viên' },
      { id: 'settings-emp-export', name: 'Xuất dữ liệu' },
    ], true),
    // Phân quyền
    createGroup('settings-permissions', 'Phân quyền', 'settings', [
      { id: 'settings-perm-roles', name: 'Vai trò' },
      { id: 'settings-perm-assign', name: 'Gán quyền' },
      { id: 'settings-perm-interface', name: 'Giao diện theo vai trò' },
    ], true),
    // Sản phẩm
    createGroup('settings-products', 'Sản phẩm', 'settings', [
      { id: 'settings-prod-category', name: 'Danh sách thể loại sản phẩm' },
      { id: 'settings-prod-cat-edit', name: 'Sửa', parentId: 'settings-prod-category' },
      { id: 'settings-prod-cat-delete', name: 'Xóa', parentId: 'settings-prod-category' },
      { id: 'settings-prod-list', name: 'Danh sách sản phẩm' },
      { id: 'settings-prod-edit', name: 'Sửa', parentId: 'settings-prod-list' },
      { id: 'settings-prod-delete', name: 'Xóa', parentId: 'settings-prod-list' },
      { id: 'settings-prod-add', name: 'Thêm sản phẩm' },
    ], true),
    // Bán hàng - Quy trình
    createGroup('settings-sales-process', 'Bán hàng > Quy trình', 'settings', [
      { id: 'settings-sales-proc-list', name: 'Danh sách quy trình' },
      { id: 'settings-sales-proc-edit', name: 'Sửa', parentId: 'settings-sales-proc-list' },
      { id: 'settings-sales-proc-delete', name: 'Xóa', parentId: 'settings-sales-proc-list' },
      { id: 'settings-sales-proc-add', name: 'Thêm giai đoạn' },
    ], true),
    // Bán hàng - Phân bổ leads
    createGroup('settings-sales-distribution', 'Bán hàng > Phân bổ leads', 'settings', [
      { id: 'settings-sales-dist-edit', name: 'Sửa' },
      { id: 'settings-sales-dist-delete', name: 'Xóa' },
      { id: 'settings-sales-dist-activate', name: 'Kích hoạt' },
      { id: 'settings-sales-dist-add', name: 'Thêm quy tắc' },
    ], true),
    // Phân hạng khách hàng
    createGroup('settings-customer-rank', 'Phân hạng khách hàng', 'settings', [
      { id: 'settings-rank-list', name: 'Danh sách "Phân hạng khách hàng"' },
      { id: 'settings-rank-view', name: 'Xem', parentId: 'settings-rank-list' },
      { id: 'settings-rank-edit', name: 'Chỉnh sửa', parentId: 'settings-rank-list' },
    ], true),
    // Nhãn gán
    createGroup('settings-tags', 'Nhãn gán', 'settings', [
      { id: 'settings-tags-list', name: 'Danh sách nhãn' },
      { id: 'settings-tags-edit', name: 'Sửa', parentId: 'settings-tags-list' },
      { id: 'settings-tags-delete', name: 'Xóa', parentId: 'settings-tags-list' },
      { id: 'settings-tags-add', name: 'Tạo nhãn mới' },
    ], true),
    // Lịch sử
    createGroup('settings-history', 'Lịch sử', 'settings', [
      { id: 'settings-history-list', name: 'Danh sách "Lịch sử hệ thống"' },
    ], true),
    // Giao diện
    createGroup('settings-interface', 'Giao diện', 'settings', [
      { id: 'settings-interface-main', name: 'Giao diện' },
    ], true)
  ]
}

// All modules
export const ALL_MODULES: InterfaceModule[] = [
  DASHBOARD_MODULE,
  SALES_MODULE,
  CUSTOMERS_MODULE,
  CUSTOMER_DETAIL_MODULE,
  ORDERS_MODULE,
  TASKS_MODULE,
  KPI_MODULE,
  CHAT_MODULE,
  EMAIL_MARKETING_MODULE,
  REPORTS_MODULE,
  SETTINGS_MODULE
]

// Deep clone helper
const deepCloneModules = (modules: InterfaceModule[]): InterfaceModule[] => {
  return JSON.parse(JSON.stringify(modules))
}

// Generate default configs for all roles
export const generateDefaultRoleConfigs = (): RoleInterfaceConfig[] => {
  return DEFAULT_ROLES.map(role => ({
    roleId: role.id,
    roleName: role.name,
    modules: deepCloneModules(ALL_MODULES)
  }))
}

// Initial state
export const INITIAL_ROLE_CONFIGS = generateDefaultRoleConfigs()
