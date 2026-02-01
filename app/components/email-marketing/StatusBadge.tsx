'use client'

import React from 'react'
import { 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  Ban,
  AlertTriangle
} from 'lucide-react'
import { SenderEmailStatus } from './types'
import { STATUS_CONFIG } from './utils'

interface StatusBadgeProps {
  status: SenderEmailStatus
  showIcon?: boolean
}

const iconMap = {
  activated: CheckCircle,
  pending: Clock,
  domain_unverified: AlertCircle,
  disabled: Ban
}

export default function StatusBadge({ status, showIcon = true }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status]
  const Icon = iconMap[status]
  
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
      {showIcon && <Icon className="w-3 h-3 mr-1.5" />}
      {config.label}
    </span>
  )
}

// Email Warning Badge for personal emails
export function PersonalEmailWarning() {
  return (
    <span className="inline-flex items-center text-yellow-600 ml-2" title="Email cá nhân có thể bị vào spam">
      <AlertTriangle className="w-4 h-4" />
    </span>
  )
}
