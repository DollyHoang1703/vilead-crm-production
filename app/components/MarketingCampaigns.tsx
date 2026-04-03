'use client'

import React, { useState } from 'react'
import { Mail, MessageSquare } from 'lucide-react'
import EmailMarketing from './EmailMarketing'
import ZbsMarketing from './zbs-marketing/ZbsMarketing'

// ==================== MAIN WRAPPER COMPONENT ====================
export default function MarketingCampaigns() {
  const [activeChannel, setActiveChannel] = useState<'email' | 'zbs'>('email')

  const channels = [
    {
      id: 'email' as const,
      label: 'Email Marketing',
      icon: Mail,
      description: 'Chiến dịch email',
    },
    {
      id: 'zbs' as const,
      label: 'ZBS Marketing',
      icon: MessageSquare,
      description: 'Zalo ZNS Marketing',
    },
  ]

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Chiến dịch Marketing</h1>
          <p className="text-gray-600 mt-1">Quản lý chiến dịch Email và Zalo ZNS Marketing</p>
        </div>
      </div>

      {/* Channel Tabs */}
      <div className="flex">
        {/* Left vertical tabs */}
        <div className="w-56 flex-shrink-0 border-r border-gray-200 pr-4">
          <nav className="space-y-0.5">
            {channels.map((channel) => {
              const Icon = channel.icon
              const isActive = activeChannel === channel.id
              return (
                <button
                  key={channel.id}
                  onClick={() => setActiveChannel(channel.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'text-[#3e79f7] bg-[#f0f7ff]'
                      : 'text-[#455560] hover:text-[#3e79f7] hover:bg-[#f8f9fa]'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {channel.label}
                </button>
              )
            })}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 pl-6 min-w-0">
          {activeChannel === 'email' && <EmailMarketing />}
          {activeChannel === 'zbs' && <ZbsMarketing />}
        </div>
      </div>
    </div>
  )
}
