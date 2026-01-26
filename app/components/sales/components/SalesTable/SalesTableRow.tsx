'use client'

import { User, Paperclip, Eye, Edit, StickyNote } from 'lucide-react'
import {
  Lead,
  ColumnVisibility,
  LEAD_STATUS_CONFIG,
  SOURCE_CONFIG,
  TAG_CONFIG,
  REGION_CONFIG
} from '../../types/lead.types'
import { SALES_TABLE_COLUMNS } from './columns.config'

interface SalesTableRowProps {
  lead: Lead
  index: number
  visibleColumns: ColumnVisibility
  isSelected: boolean
  onToggleSelect: (id: number) => void
  onViewDetail: (lead: Lead) => void
  onEdit: (lead: Lead) => void
  onViewFiles: (lead: Lead) => void
  onAddNote: (lead: Lead) => void
  onConvert: (lead: Lead) => void
}

export default function SalesTableRow({
  lead,
  index,
  visibleColumns,
  isSelected,
  onToggleSelect,
  onViewDetail,
  onEdit,
  onViewFiles,
  onAddNote,
  onConvert
}: SalesTableRowProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN')
  }

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString)
    return {
      date: date.toLocaleDateString('vi-VN'),
      time: date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
    }
  }

  const renderCell = (columnKey: string) => {
    const column = SALES_TABLE_COLUMNS.find(c => c.key === columnKey)
    if (!column) return null

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

    switch (columnKey) {
      case 'checkbox':
        return (
          <td key={columnKey} className={`${stickyClass} ${alignClass}`}>
            <input
              type="checkbox"
              className="omi-checkbox"
              checked={isSelected}
              onChange={() => onToggleSelect(lead.id)}
            />
          </td>
        )

      case 'stt':
        return (
          <td key={columnKey} className={alignClass}>
            {index + 1}
          </td>
        )

      case 'customerName':
        return (
          <td key={columnKey}>
            <span
              className="omi-link font-semibold"
              onClick={() => onViewDetail(lead)}
            >
              {lead.name}
            </span>
          </td>
        )

      case 'phone':
        return (
          <td key={columnKey}>
            <span className="omi-truncate block max-w-[130px]">{lead.phone}</span>
          </td>
        )

      case 'email':
        return (
          <td key={columnKey}>
            <span className="omi-truncate block max-w-[190px]" title={lead.email}>
              {lead.email}
            </span>
          </td>
        )

      case 'company':
        return (
          <td key={columnKey}>
            <span className="omi-truncate block max-w-[170px]" title={lead.company}>
              {lead.company || '-'}
            </span>
          </td>
        )

      case 'address':
        return (
          <td key={columnKey}>
            <span className="omi-truncate block max-w-[190px]" title={lead.address}>
              {lead.address || '-'}
            </span>
          </td>
        )

      case 'source': {
        const sourceConfig = SOURCE_CONFIG[lead.source] || {
          label: lead.source,
          bgColor: 'bg-gray-50',
          textColor: 'text-gray-600',
          icon: ''
        }
        return (
          <td key={columnKey}>
            <span className={`omi-badge ${sourceConfig.bgColor} ${sourceConfig.textColor}`}>
              {sourceConfig.icon} {sourceConfig.label}
            </span>
          </td>
        )
      }

      case 'region':
        return (
          <td key={columnKey}>
            {REGION_CONFIG[lead.region] || lead.region}
          </td>
        )

      case 'stage': {
        const statusConfig = LEAD_STATUS_CONFIG[lead.status]
        return (
          <td key={columnKey}>
            <span className={`omi-badge ${statusConfig.bgColor} ${statusConfig.textColor}`}>
              {statusConfig.icon} {statusConfig.label}
            </span>
          </td>
        )
      }

      case 'product':
        return (
          <td key={columnKey}>
            <span className="omi-truncate block max-w-[150px]" title={lead.product}>
              {lead.product}
            </span>
          </td>
        )

      case 'customerType':
        return (
          <td key={columnKey}>
            <span className={`omi-badge ${lead.customerType === 'business' ? 'omi-badge-primary' : 'bg-gray-50 text-gray-600'}`}>
              {lead.customerType === 'business' ? 'Doanh nghi\u1ec7p' : 'C\u00e1 nh\u00e2n'}
            </span>
          </td>
        )

      case 'salesOwner':
        return (
          <td key={columnKey}>
            <div className="flex items-center gap-2">
              <span className="omi-avatar omi-avatar-sm">
                {lead.assignedTo ? lead.assignedTo.charAt(0).toUpperCase() : '?'}
              </span>
              <span className="omi-truncate max-w-[120px]">
                {lead.assignedTo || 'Ch\u01b0a ph\u00e2n c\u00f4ng'}
              </span>
            </div>
          </td>
        )

      case 'tags':
        return (
          <td key={columnKey}>
            <div className="flex flex-wrap gap-1">
              {lead.tags.slice(0, 2).map((tag, tagIndex) => {
                const tagConfig = TAG_CONFIG[tag] || {
                  label: tag,
                  bgColor: 'bg-gray-50',
                  textColor: 'text-gray-600'
                }
                return (
                  <span
                    key={tagIndex}
                    className={`omi-badge ${tagConfig.bgColor} ${tagConfig.textColor}`}
                  >
                    {tagConfig.label}
                  </span>
                )
              })}
              {lead.tags.length > 2 && (
                <span className="text-xs" style={{ color: 'var(--omi-text-muted)' }}>
                  +{lead.tags.length - 2}
                </span>
              )}
            </div>
          </td>
        )

      case 'notes':
        return (
          <td key={columnKey}>
            <span className="omi-truncate block max-w-[190px]" title={lead.content}>
              {lead.content.length > 50 ? `${lead.content.substring(0, 50)}...` : lead.content}
            </span>
          </td>
        )

      case 'files':
        return (
          <td key={columnKey} className={alignClass}>
            <button
              onClick={() => onViewFiles(lead)}
              className="omi-action-btn"
              title={`${lead.files?.length || 0} t\u1ec7p \u0111\u00ednh k\u00e8m`}
            >
              <span className={lead.files && lead.files.length > 0 ? 'font-medium' : ''} style={{ color: lead.files && lead.files.length > 0 ? 'var(--omi-primary)' : 'var(--omi-text-muted)' }}>
                {lead.files?.length || 0}
              </span>
              <Paperclip className="w-4 h-4 ml-1" />
            </button>
          </td>
        )

      case 'createdDate':
        return (
          <td key={columnKey}>
            {formatDate(lead.createdAt)}
          </td>
        )

      case 'lastModified': {
        const dt = formatDateTime(lead.updatedAt)
        return (
          <td key={columnKey}>
            <div>{dt.date}</div>
            <div className="text-xs" style={{ color: 'var(--omi-text-muted)' }}>{dt.time}</div>
          </td>
        )
      }

      case 'interactionCount':
        return (
          <td key={columnKey} className={alignClass}>
            <span className="omi-badge omi-badge-info">
              {lead.interactionCount}
            </span>
          </td>
        )

      case 'lastInteraction': {
        if (!lead.lastInteractionAt) {
          return <td key={columnKey}>-</td>
        }
        const dt = formatDateTime(lead.lastInteractionAt)
        return (
          <td key={columnKey}>
            <div>{dt.date}</div>
            <div className="text-xs" style={{ color: 'var(--omi-text-muted)' }}>{dt.time}</div>
          </td>
        )
      }

      case 'actions':
        return (
          <td key={columnKey} className={`${stickyClass} ${alignClass}`}>
            <div className="flex items-center justify-center gap-1">
              <button
                onClick={() => onViewDetail(lead)}
                className="omi-action-btn"
                title="Xem chi ti\u1ebft"
              >
                <Eye className="w-4 h-4" />
              </button>
              <button
                onClick={() => onEdit(lead)}
                className="omi-action-btn"
                title="Ch\u1ec9nh s\u1eeda"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
                onClick={() => onAddNote(lead)}
                className="omi-action-btn"
                title="Th\u00eam ghi ch\u00fa"
              >
                <StickyNote className="w-4 h-4" />
              </button>
              <button
                onClick={() => onConvert(lead)}
                className="omi-action-btn"
                title="Chuy\u1ec3n \u0111\u1ed5i th\u00e0nh kh\u00e1ch h\u00e0ng"
              >
                <User className="w-4 h-4" />
              </button>
            </div>
          </td>
        )

      default:
        return <td key={columnKey}>-</td>
    }
  }

  return (
    <tr>
      {SALES_TABLE_COLUMNS.map((column) => {
        if (!visibleColumns[column.key]) return null
        return renderCell(column.key)
      })}
    </tr>
  )
}
