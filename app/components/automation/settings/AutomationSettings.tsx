'use client'

import React, { useState } from 'react'
import { Tag, Zap, Bot } from 'lucide-react'
import TagsPage from './TagsPage'
import AutoRulesPage from './AutoRulesPage'
import BotSettingsPage from './BotSettingsPage'

type TabId = 'tags' | 'auto-rules' | 'bot-settings'

const TABS: { id: TabId; label: string; icon: React.ComponentType<any>; iconColor: string; description: string }[] = [
  { id: 'tags',          label: 'Tags',              icon: Tag,  iconColor: '#3B82F6', description: 'Quản lý tags & liên kết kịch bản' },
  { id: 'auto-rules',    label: 'Quy tắc tự động',   icon: Zap,  iconColor: '#F59E0B', description: '4 trigger tự động theo sự kiện' },
  { id: 'bot-settings',  label: 'Cài đặt Bot',       icon: Bot,  iconColor: '#8B5CF6', description: 'Hành vi bot khi NV can thiệp' },
]

interface AutomationSettingsProps {
  onBack?: () => void
  defaultTab?: TabId
}

export default function AutomationSettings({ onBack, defaultTab = 'tags' }: AutomationSettingsProps) {
  const [activeTab, setActiveTab] = useState<TabId>(defaultTab)

  return (
    <div className="h-full flex flex-col overflow-hidden bg-gray-50">
      {/* Top header */}
      <div className="bg-white border-b border-gray-200 shrink-0 z-10">
        {/* Breadcrumb + title */}
        <div className="px-6 py-4">
          <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">
            {onBack && (
              <>
                <button onClick={onBack} className="hover:text-blue-600 transition-colors">Cài đặt</button>
                <span>/</span>
              </>
            )}
            <span className="text-gray-600 font-medium">Automation</span>
          </div>
          <h1 className="text-xl font-bold text-gray-900">Cấu hình Automation</h1>
          <p className="text-sm text-gray-500 mt-0.5">Quản lý tags, quy tắc tự động và hành vi bot</p>
        </div>

        {/* Tab navigation */}
        <div className="px-6 flex items-end gap-1">
          {TABS.map(tab => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition-colors whitespace-nowrap ${
                  isActive
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon size={15} style={{ color: isActive ? tab.iconColor : undefined }} />
                {tab.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full bg-white">
          {activeTab === 'tags' && <TagsPage />}
          {activeTab === 'auto-rules' && <AutoRulesPage />}
          {activeTab === 'bot-settings' && <BotSettingsPage />}
        </div>
      </div>
    </div>
  )
}
