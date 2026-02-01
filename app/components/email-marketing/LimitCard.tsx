'use client'

import React from 'react'
import { getProgressColor } from './utils'

interface LimitCardProps {
  title: string
  value: number
  onChange: (value: number) => void
  unit: string
  usage?: { used: number; limit: number; percentage: number }
  min: number
  max: number
  description?: string
  resetTime?: string
}

export default function LimitCard({ 
  title, 
  value, 
  onChange, 
  unit, 
  usage, 
  min, 
  max,
  description,
  resetTime 
}: LimitCardProps) {
  const progressColor = usage ? getProgressColor(usage.percentage) : 'bg-green-500'
  
  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
      <h3 className="font-medium text-gray-900 mb-4">{title}</h3>
      
      <div className="flex items-center gap-4 mb-4">
        <input
          type="number"
          value={value}
          onChange={(e) => {
            const newValue = parseInt(e.target.value) || 0
            if (newValue >= min && newValue <= max) {
              onChange(newValue)
            }
          }}
          min={min}
          max={max}
          className="w-32 px-3 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-right font-medium"
        />
        <span className="text-gray-600">{unit}</span>
      </div>
      
      {description && (
        <p className="text-sm text-gray-500 mb-4">{description}</p>
      )}
      
      {usage && (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Đã sử dụng:</span>
            <span className="font-medium text-gray-900">
              {usage.used.toLocaleString()} / {usage.limit.toLocaleString()}
            </span>
          </div>
          
          <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-300 ${progressColor}`}
              style={{ width: `${Math.min(usage.percentage, 100)}%` }}
            />
          </div>
          
          <div className="flex items-center justify-between text-xs">
            <span className={`font-medium ${
              usage.percentage >= 90 ? 'text-red-600' :
              usage.percentage >= 80 ? 'text-yellow-600' : 'text-gray-500'
            }`}>
              {usage.percentage}% đã sử dụng
            </span>
            {resetTime && (
              <span className="text-gray-400">
                Reset sau: {resetTime}
              </span>
            )}
          </div>
          
          {usage.percentage >= 90 && (
            <div className="p-2 bg-red-50 rounded-lg">
              <p className="text-xs text-red-600">
                ⚠️ Bạn sắp đạt giới hạn. Hãy cân nhắc tăng giới hạn hoặc giảm số lượng gửi.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
