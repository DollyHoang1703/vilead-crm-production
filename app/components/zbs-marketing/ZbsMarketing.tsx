'use client'

import React, { useState } from 'react'
import {
  Send,
  FileText,
  BarChart3,
} from 'lucide-react'
import ZbsCampaignList from './ZbsCampaignList'
import ZbsTemplateLibrary from './ZbsTemplateLibrary'
import { ZbsReportsDashboard } from './ZbsReportsDashboard'

// ==================== MAIN COMPONENT ====================
export default function ZbsMarketing() {
  const [activeTab, setActiveTab] = useState<'campaigns' | 'templates' | 'reports'>('campaigns')

  const tabs = [
    { id: 'campaigns', label: 'Chiến dịch ZBS', icon: Send },
    { id: 'templates', label: 'Thư viện mẫu', icon: FileText },
    { id: 'reports', label: 'Báo cáo chất lượng', icon: BarChart3 },
  ]

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`group inline-flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-500'}`} />
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'campaigns' && <ZbsCampaignList />}
        {activeTab === 'templates' && <ZbsTemplateLibrary />}
        {activeTab === 'reports' && <ZbsReportsDashboard />}
      </div>
    </div>
  )
}
