'use client'

import React, { useState } from 'react'
import { Zap, GitBranch, Clock, ArrowRight, Settings2 } from 'lucide-react'
import FlowListPage from './flows/FlowListPage'
import FlowEditorPage from './flows/editor/FlowEditorPage'
import AutomationSettings from './settings/AutomationSettings'

type AutomationView = 'overview' | 'flows-list' | 'flows-editor' | 'settings'

export default function AutomationManagement() {
  const [view, setView] = useState<AutomationView>('overview')
  const [editingFlowId, setEditingFlowId] = useState<string | null>(null)

  const openEditor = (flowId: string) => { setEditingFlowId(flowId); setView('flows-editor') }
  const openFlowList = () => { setEditingFlowId(null); setView('flows-list') }

  // ── Flow Editor ─────────────────────────────────────────────────────────────
  if (view === 'flows-editor' && editingFlowId) {
    return (
      <div className="h-full flex flex-col overflow-hidden">
        <FlowEditorPage flowId={editingFlowId} onBack={openFlowList} />
      </div>
    )
  }

  // ── Flow List ───────────────────────────────────────────────────────────────
  if (view === 'flows-list') {
    return (
      <div className="h-full flex flex-col overflow-hidden">
        <div className="flex items-center gap-2 px-5 py-3 bg-white border-b border-gray-200 shrink-0">
          <button onClick={() => setView('overview')} className="text-sm text-gray-500 hover:text-blue-600 transition-colors">
            Automation
          </button>
          <span className="text-gray-300">/</span>
          <span className="text-sm font-medium text-gray-800">Luồng tin nhắn</span>
        </div>
        <div className="flex-1 overflow-hidden">
          <FlowListPage onOpenEditor={openEditor} />
        </div>
      </div>
    )
  }

  // ── Cấu hình Automation ─────────────────────────────────────────────────────
  if (view === 'settings') {
    return (
      <AutomationSettings onBack={() => setView('overview')} />
    )
  }

  // ── Overview ────────────────────────────────────────────────────────────────
  return (
    <div className="h-full overflow-y-auto bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Automation</h1>
        <p className="text-gray-500 mt-1">Tự động hóa quy trình chăm sóc khách hàng đa kênh</p>
      </div>

      {/* Module cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-4xl">
        {/* Luồng tin nhắn */}
        <button
          onClick={openFlowList}
          className="group bg-white rounded-2xl border border-gray-200 p-6 text-left hover:border-blue-300 hover:shadow-lg transition-all duration-200"
        >
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-4 shadow-sm group-hover:scale-105 transition-transform">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-1.5">Luồng tin nhắn</h3>
          <p className="text-sm text-gray-500 leading-relaxed">
            Tạo và quản lý luồng tin nhắn tự động. Kéo thả các node để thiết kế kịch bản chat.
          </p>
          <div className="flex items-center gap-1.5 mt-4 text-blue-600 text-sm font-medium group-hover:gap-2.5 transition-all">
            Quản lý luồng <ArrowRight className="w-4 h-4" />
          </div>
        </button>

        {/* Kịch bản chăm sóc */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 opacity-60 cursor-not-allowed">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-500 rounded-xl flex items-center justify-center mb-4 shadow-sm">
            <GitBranch className="w-6 h-6 text-white" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-1.5 flex items-center gap-2">
            Kịch bản chăm sóc
            <span className="text-[10px] font-semibold px-1.5 py-0.5 bg-purple-100 text-purple-600 rounded-full">Sắp ra mắt</span>
          </h3>
          <p className="text-sm text-gray-500 leading-relaxed">
            Thiết lập chuỗi kịch bản chăm sóc theo thời gian, tích hợp với luồng tin nhắn.
          </p>
        </div>

        {/* Cấu hình Automation */}
        <button
          onClick={() => setView('settings')}
          className="group bg-white rounded-2xl border border-gray-200 p-6 text-left hover:border-indigo-300 hover:shadow-lg transition-all duration-200"
        >
          <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center mb-4 shadow-sm group-hover:scale-105 transition-transform">
            <Settings2 className="w-6 h-6 text-white" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-1.5">Cấu hình Automation</h3>
          <p className="text-sm text-gray-500 leading-relaxed">
            Quản lý Tags, thiết lập quy tắc tự động và cấu hình hành vi Bot khi nhân viên can thiệp.
          </p>
          <div className="flex items-center gap-1.5 mt-4 text-indigo-600 text-sm font-medium group-hover:gap-2.5 transition-all">
            Cấu hình <ArrowRight className="w-4 h-4" />
          </div>
        </button>
      </div>

      {/* Quick stats */}
      <div className="mt-8 max-w-4xl">
        <h2 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wider">Tổng quan</h2>
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: 'Tổng luồng', value: '8', color: 'blue' },
            { label: 'Đã xuất bản', value: '5', color: 'green' },
            { label: 'Bản nháp', value: '3', color: 'amber' },
            { label: 'Tags', value: '7', color: 'purple' },
          ].map(stat => (
            <div key={stat.label} className="bg-white rounded-xl border border-gray-200 p-4">
              <div className={`text-2xl font-bold text-${stat.color}-600`}>{stat.value}</div>
              <div className="text-xs text-gray-500 mt-0.5">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
