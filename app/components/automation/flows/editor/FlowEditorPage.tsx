'use client'

import React, { useEffect, useCallback, useMemo, useState } from 'react'
import { AlertCircle, CheckCircle2, X } from 'lucide-react'
import { FlowEditorProvider, useFlowEditor } from '../flowEditorStore'
import { FlowDetail, FlowNode, NodeType } from '../types'
import { MOCK_FOLDERS } from '../constants'
import Toolbar from './Toolbar'
import NodePalette from './NodePalette'
import FlowCanvas from './FlowCanvas'
import ConfigPanel from './ConfigPanel'
import PreviewPanel from './PreviewPanel'

// ── Toast components ───────────────────────────────────────────────────────────
function ValidationToast({ errors, onClose }: { errors: Array<{ message: string; nodeId?: string }>; onClose: () => void }) {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-96 bg-white rounded-2xl shadow-2xl border border-red-200 overflow-hidden">
      <div className="flex items-center gap-3 px-4 py-3 bg-red-50 border-b border-red-100">
        <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
        <span className="text-sm font-semibold text-red-700 flex-1">Flow chưa hợp lệ ({errors.length} lỗi)</span>
        <button onClick={onClose} className="text-red-400 hover:text-red-600"><X className="w-4 h-4" /></button>
      </div>
      <div className="max-h-40 overflow-y-auto p-3 space-y-1.5">
        {errors.map((e, i) => (
          <div key={i} className="flex items-start gap-2 text-sm text-red-700">
            <span className="text-red-400 mt-0.5">•</span>
            {e.message}
          </div>
        ))}
      </div>
    </div>
  )
}

function SuccessToast({ message, onClose }: { message: string; onClose: () => void }) {
  useEffect(() => { const t = setTimeout(onClose, 3000); return () => clearTimeout(t) }, [onClose])
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-green-600 text-white rounded-2xl px-5 py-3 shadow-xl flex items-center gap-2.5">
      <CheckCircle2 className="w-5 h-5 shrink-0" />
      <span className="text-sm font-medium">{message}</span>
    </div>
  )
}

// ── Inner editor ───────────────────────────────────────────────────────────────
function FlowEditorInner({ flowData, onBack }: { flowData: FlowDetail; onBack: () => void }) {
  const {
    state, setFlow, addNode, updateNode, moveNode, deleteNode,
    addEdge, deleteEdge, selectNode, setPreviewOpen, setFlowName, markSaved, validate
  } = useFlowEditor()

  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message?: string } | null>(null)
  const [showValidErrors, setShowValidErrors] = useState(false)

  // Initialize flow
  useEffect(() => { setFlow(flowData) }, [flowData, setFlow])

  // Auto-place start node
  useEffect(() => {
    if (state.nodes.length === 0 && state.flowId) {
      addNode('start', { x: 300, y: 80 })
    }
  }, [state.flowId, state.nodes.length, addNode])

  // Drag from NodePalette
  const handleDragStart = (e: React.DragEvent, nodeType: NodeType) => {
    e.dataTransfer.setData('nodeType', nodeType)
  }

  const handleDropNode = useCallback((nodeType: NodeType, x: number, y: number) => {
    addNode(nodeType, { x, y })
  }, [addNode])

  const handleSave = async () => {
    setSaving(true)
    await new Promise(r => setTimeout(r, 800))
    markSaved()
    setSaving(false)
    setToast({ type: 'success', message: 'Đã lưu luồng thành công' })
  }

  const handlePublish = async () => {
    const errors = validate()
    if (errors.length > 0) {
      setShowValidErrors(true)
      return
    }
    setSaving(true)
    await new Promise(r => setTimeout(r, 1000))
    markSaved()
    setSaving(false)
    setToast({ type: 'success', message: 'Đã xuất bản luồng thành công! 🎉' })
  }

  // Node index for ConfigPanel title
  const nodeDisplayIndex = useMemo(() => {
    const map = new Map<string, number>()
    let idx = 1
    state.nodes.forEach(n => {
      if (n.type !== 'start') map.set(n.id, idx++)
    })
    return map
  }, [state.nodes])

  const selectedNode = state.nodes.find(n => n.id === state.selectedNodeId) || null
  const selectedNodeIndex = selectedNode ? (nodeDisplayIndex.get(selectedNode.id) || 1) : 1

  return (
    <div className="h-full flex flex-col">
      <Toolbar
        flowName={state.flowName}
        flowGroupName={flowData.folder?.name || 'Tin nhắn Kịch bản'}
        status={state.status}
        hasChanges={state.hasUnsavedChanges}
        saving={saving}
        onBack={onBack}
        onSave={handleSave}
        onPublish={handlePublish}
        onPreview={() => setPreviewOpen(true)}
        onFlowNameChange={setFlowName}
      />

      <div className="flex flex-1 min-h-0 overflow-hidden">
        {/* Left: Config panel (slide-in when node selected) */}
        {selectedNode && (
          <ConfigPanel
            selectedNode={selectedNode}
            nodeIndex={selectedNodeIndex}
            onUpdate={updateNode}
            onDelete={deleteNode}
            onClose={() => selectNode(null)}
          />
        )}

        {/* Left: Node palette (when nothing selected) */}
        {!selectedNode && (
          <NodePalette onDragStart={handleDragStart} />
        )}

        {/* Center: Canvas */}
        <FlowCanvas
          nodes={state.nodes}
          edges={state.edges}
          selectedNodeId={state.selectedNodeId}
          validationErrors={state.validationErrors}
          onSelectNode={selectNode}
          onMoveNode={(id, x, y) => moveNode(id, { x, y })}
          onAddEdge={addEdge}
          onDeleteEdge={deleteEdge}
          onDropNode={handleDropNode}
        />
      </div>

      <PreviewPanel
        open={state.isPreviewOpen}
        nodes={state.nodes}
        edges={state.edges}
        onClose={() => setPreviewOpen(false)}
      />

      {/* Toasts */}
      {showValidErrors && state.validationErrors.length > 0 && (
        <ValidationToast errors={state.validationErrors} onClose={() => setShowValidErrors(false)} />
      )}
      {toast?.type === 'success' && (
        <SuccessToast message={toast.message || 'Thành công'} onClose={() => setToast(null)} />
      )}
    </div>
  )
}

// ── Public component ───────────────────────────────────────────────────────────
interface FlowEditorPageProps {
  flowId: string
  onBack: () => void
}

function getMockFlowData(flowId: string): FlowDetail {
  const folder = flowId === 'flow1' ? { id: 'f2', name: 'Marketing' }
    : flowId === 'flow2' ? { id: 'f3', name: 'Sales' }
    : { id: '00000000-0000-0000-0000-000000000001', name: 'Chưa phân loại' }
  return {
    id: flowId,
    name: flowId === 'flow1' ? 'Chào mừng KH mới'
      : flowId === 'flow2' ? 'Xác nhận đơn hàng' : 'Luồng tin nhắn',
    shortcut: flowId === 'flow1' ? '/chao' : null,
    folder,
    status: 'draft',
    currentVersion: 1,
    nodes: [],
    edges: [],
    usedByCount: 0,
    updatedAt: new Date().toISOString(),
  }
}

export default function FlowEditorPage({ flowId, onBack }: FlowEditorPageProps) {
  const flowData = getMockFlowData(flowId)

  return (
    <FlowEditorProvider>
      <FlowEditorInner flowData={flowData} onBack={onBack} />
    </FlowEditorProvider>
  )
}
