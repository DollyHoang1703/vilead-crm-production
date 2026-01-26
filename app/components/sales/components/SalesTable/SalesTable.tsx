'use client'

import { Lead, ColumnVisibility } from '../../types/lead.types'
import SalesTableHeader from './SalesTableHeader'
import SalesTableRow from './SalesTableRow'

interface SalesTableProps {
  leads: Lead[]
  visibleColumns: ColumnVisibility
  selectedLeadIds: number[]
  selectAllChecked: boolean
  onToggleSelectAll: (checked: boolean) => void
  onToggleSelectLead: (id: number) => void
  onViewLeadDetail: (lead: Lead) => void
  onEditLead: (lead: Lead) => void
  onViewFiles: (lead: Lead) => void
  onAddNote: (lead: Lead) => void
  onConvert: (lead: Lead) => void
}

export default function SalesTable({
  leads,
  visibleColumns,
  selectedLeadIds,
  selectAllChecked,
  onToggleSelectAll,
  onToggleSelectLead,
  onViewLeadDetail,
  onEditLead,
  onViewFiles,
  onAddNote,
  onConvert
}: SalesTableProps) {
  return (
    <div className="omi-table-container">
      <div className="overflow-x-auto">
        <table className="omi-table">
          <SalesTableHeader
            visibleColumns={visibleColumns}
            selectAllChecked={selectAllChecked}
            onToggleSelectAll={onToggleSelectAll}
          />
          <tbody>
            {leads.length === 0 ? (
              <tr>
                <td
                  colSpan={Object.values(visibleColumns).filter(Boolean).length}
                  className="text-center py-12"
                >
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--omi-bg-alt)' }}>
                      <svg className="w-8 h-8" style={{ color: 'var(--omi-text-muted)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <p style={{ color: 'var(--omi-text-muted)' }}>Kh\u00f4ng c\u00f3 d\u1eef li\u1ec7u</p>
                  </div>
                </td>
              </tr>
            ) : (
              leads.map((lead, index) => (
                <SalesTableRow
                  key={lead.id}
                  lead={lead}
                  index={index}
                  visibleColumns={visibleColumns}
                  isSelected={selectedLeadIds.includes(lead.id)}
                  onToggleSelect={onToggleSelectLead}
                  onViewDetail={onViewLeadDetail}
                  onEdit={onEditLead}
                  onViewFiles={onViewFiles}
                  onAddNote={onAddNote}
                  onConvert={onConvert}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
