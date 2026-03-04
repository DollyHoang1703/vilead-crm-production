'use client'

import React from 'react'
import { cn } from '@/lib/utils'
import { DAYS_OF_WEEK } from '../settings/types/chat-shift.types'

interface DaySelectorProps {
  selectedDays: number[]
  onChange?: (days: number[]) => void
  readOnly?: boolean
  size?: 'sm' | 'md'
  showFullLabel?: boolean
  className?: string
}

export function DaySelector({
  selectedDays,
  onChange,
  readOnly = false,
  size = 'md',
  showFullLabel = false,
  className,
}: DaySelectorProps) {
  const handleDayClick = (day: number) => {
    if (readOnly || !onChange) return
    
    if (selectedDays.includes(day)) {
      onChange(selectedDays.filter(d => d !== day))
    } else {
      onChange([...selectedDays, day].sort((a, b) => {
        // Sort so CN (1) comes last visually
        const orderA = a === 1 ? 8 : a
        const orderB = b === 1 ? 8 : b
        return orderA - orderB
      }))
    }
  }

  const sizeClasses = {
    sm: 'w-6 h-6 text-xs',
    md: 'w-8 h-8 text-sm',
  }

  return (
    <div className={cn('flex items-center gap-1', className)}>
      {DAYS_OF_WEEK.map((day) => {
        const isSelected = selectedDays.includes(day.value)
        return (
          <button
            key={day.value}
            type="button"
            onClick={() => handleDayClick(day.value)}
            disabled={readOnly}
            className={cn(
              'rounded-full font-medium transition-colors flex items-center justify-center',
              sizeClasses[size],
              isSelected
                ? 'bg-[#3e79f7] text-white'
                : 'bg-gray-100 text-gray-500',
              !readOnly && 'hover:bg-[#3e79f7]/80 hover:text-white cursor-pointer',
              readOnly && 'cursor-default'
            )}
            title={day.fullLabel}
          >
            {showFullLabel ? day.fullLabel : day.label}
          </button>
        )
      })}
    </div>
  )
}

// Display-only variant for showing assigned days inline
interface DayBadgesProps {
  days: number[]
  className?: string
}

export function DayBadges({ days, className }: DayBadgesProps) {
  return (
    <div className={cn('flex items-center gap-0.5', className)}>
      {DAYS_OF_WEEK.map((day) => {
        const isActive = days.includes(day.value)
        return (
          <span
            key={day.value}
            className={cn(
              'w-5 h-5 rounded text-[10px] font-medium flex items-center justify-center',
              isActive
                ? 'bg-[#3e79f7] text-white'
                : 'bg-gray-200 text-gray-400'
            )}
          >
            {day.label}
          </span>
        )
      })}
    </div>
  )
}

export default DaySelector
