'use client'

import React, { useState } from 'react'
import {
  Send,
  FileText,
  BarChart3,
} from 'lucide-react'
import ZbsCampaignList from './ZbsCampaignList'
import ZbsTemplateLibrary from './ZbsTemplateLibrary'

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
        {activeTab === 'reports' && (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mb-5">
              <BarChart3 className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Báo cáo chất lượng</h3>
            <p className="text-gray-500 max-w-md">
              Tính năng báo cáo chất lượng chiến dịch ZBS đang được phát triển.
              <br />Vui lòng quay lại sau.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
