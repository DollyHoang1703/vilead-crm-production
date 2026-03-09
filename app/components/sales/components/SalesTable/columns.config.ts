import { ColumnConfig } from '../../types/lead.types'

export const SALES_TABLE_COLUMNS: ColumnConfig[] = [
  {
    key: 'checkbox',
    label: '',
    width: '48px',
    sticky: 'left',
    align: 'center',
    defaultVisible: true,
    sortable: false
  },
  {
    key: 'stt',
    label: 'STT',
    width: '60px',
    align: 'center',
    defaultVisible: true,
    sortable: false
  },
  {
    key: 'customerName',
    label: 'T\u00ean kh\u00e1ch h\u00e0ng',
    minWidth: '200px',
    defaultVisible: true,
    sortable: true
  },
  {
    key: 'phone',
    label: 'S\u1ed1 \u0111i\u1ec7n tho\u1ea1i',
    width: '140px',
    defaultVisible: true,
    sortable: false
  },
  {
    key: 'email',
    label: 'Email',
    minWidth: '200px',
    defaultVisible: true,
    sortable: true
  },
  {
    key: 'company',
    label: 'C\u00f4ng ty',
    width: '180px',
    defaultVisible: false,
    sortable: true
  },
  {
    key: 'address',
    label: '\u0110\u1ecba ch\u1ec9',
    minWidth: '200px',
    defaultVisible: false,
    sortable: false
  },
  {
    key: 'source',
    label: 'Ngu\u1ed3n',
    width: '130px',
    defaultVisible: true,
    sortable: true
  },
  {
    key: 'region',
    label: 'T\u1ec9nh th\u00e0nh',
    width: '130px',
    defaultVisible: false,
    sortable: true
  },
  {
    key: 'stage',
    label: 'Giai \u0111o\u1ea1n',
    width: '150px',
    defaultVisible: true,
    sortable: true
  },
  {    key: 'estimatedRevenue',
    label: 'Doanh thu ước tính',
    width: '150px',
    defaultVisible: false,
    sortable: true
  },
  {    key: 'product',
    label: 'S\u1ea3n ph\u1ea9m quan t\u00e2m',
    width: '160px',
    defaultVisible: false,
    sortable: false
  },
  {
    key: 'customerType',
    label: 'Lo\u1ea1i KH',
    width: '130px',
    defaultVisible: false,
    sortable: true
  },
  {
    key: 'salesOwner',
    label: 'Sales ph\u1ee5 tr\u00e1ch',
    width: '160px',
    defaultVisible: true,
    sortable: true
  },
  {
    key: 'tags',
    label: 'Tags',
    width: '160px',
    defaultVisible: true,
    sortable: false
  },
  {
    key: 'notes',
    label: 'Ghi ch\u00fa',
    minWidth: '200px',
    defaultVisible: true,
    sortable: false
  },
  {
    key: 'files',
    label: 'T\u1ec7p',
    width: '80px',
    align: 'center',
    defaultVisible: true,
    sortable: false
  },
  {
    key: 'createdDate',
    label: 'Ng\u00e0y t\u1ea1o',
    width: '120px',
    defaultVisible: true,
    sortable: true
  },
  {
    key: 'lastModified',
    label: 'C\u1eadp nh\u1eadt cu\u1ed1i',
    width: '140px',
    defaultVisible: false,
    sortable: true
  },
  {
    key: 'interactionCount',
    label: 'T\u01b0\u01a1ng t\u00e1c',
    width: '100px',
    align: 'center',
    defaultVisible: false,
    sortable: true
  },
  {
    key: 'lastInteraction',
    label: 'TT cu\u1ed1i c\u00f9ng',
    width: '140px',
    defaultVisible: false,
    sortable: true
  },
  {
    key: 'actions',
    label: 'H\u00e0nh \u0111\u1ed9ng',
    width: '100px',
    sticky: 'right',
    align: 'center',
    defaultVisible: true,
    sortable: false
  }
]

export const getDefaultColumnVisibility = (): Record<string, boolean> => {
  return SALES_TABLE_COLUMNS.reduce((acc, column) => {
    acc[column.key] = column.defaultVisible
    return acc
  }, {} as Record<string, boolean>)
}
