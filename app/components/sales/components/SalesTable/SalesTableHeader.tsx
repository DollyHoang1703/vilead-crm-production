'use client'

import { ColumnVisibility } from '../../types/lead.types'
import { SALES_TABLE_COLUMNS } from './columns.config'

interface SalesTableHeaderProps {
  visibleColumns: ColumnVisibility
  selectAllChecked: boolean
  onToggleSelectAll: (checked: boolean) => void
}

export default function SalesTableHeader({
  visibleColumns,
  selectAllChecked,
  onToggleSelectAll
}: SalesTableHeaderProps) {
  return (
    <thead>
      <tr>
        {SALES_TABLE_COLUMNS.map((column) => {
          if (!visibleColumns[column.key]) return null

          const stickyClass = column.sticky === 'left'
            ? 'omi-table-sticky-left'
            : column.sticky === 'right'
              ? 'omi-table-sticky-right'
              : ''

          const alignClass = column.align === 'center'
            ? 'text-center'
            : column.align === 'right'
              ? 'text-right'
              : 'text-left'

          const widthStyle = column.width
            ? { width: column.width }
            : column.minWidth
              ? { minWidth: column.minWidth }
              : {}

          if (column.key === 'checkbox') {
            return (
              <th
                key={column.key}
                className={`${stickyClass} ${alignClass}`}
                style={widthStyle}
              >
                <input
                  type="checkbox"
                  className="omi-checkbox"
                  checked={selectAllChecked}
                  onChange={(e) => onToggleSelectAll(e.target.checked)}
                />
              </th>
            )
          }

          return (
            <th
              key={column.key}
              className={`${stickyClass} ${alignClass}`}
              style={widthStyle}
            >
              {column.label}
            </th>
          )
        })}
      </tr>
    </thead>
  )
}
