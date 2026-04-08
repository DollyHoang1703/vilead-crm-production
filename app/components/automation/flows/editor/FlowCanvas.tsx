'use client'

import React, {
  useRef, useState, useCallback, useEffect, useMemo
} from 'react'
import { Plus, ZoomIn, ZoomOut, Maximize2 } from 'lucide-react'
import { FlowNode, FlowEdge, NodeType } from '../types'
import { NODE_COLOR } from '../constants'
import NodeCard from './NodeCard'
import NextStepPicker from './NextStepPicker'

// ─── Types ─────────────────────────────────────────────────────────────────────
interface XY { x: number; y: number }

interface DragEdgeState {
  sourceNodeId: string
  sourceHandle?: string
  startPos: XY    // canvas coords of handle
  currentPos: XY  // canvas coords of mouse
  targetNodeId?: string // hovered target
}

interface PickerState {
  sourceNodeId: string
  sourceHandle?: string
  screenPos: XY
}

interface FlowCanvasProps {
  nodes: FlowNode[]
  edges: FlowEdge[]
  selectedNodeId: string | null
  validationErrors: Array<{ nodeId?: string; message: string }>
  onSelectNode: (id: string | null) => void
  onMoveNode: (id: string, x: number, y: number) => void
  onAddEdge: (edge: FlowEdge) => void
  onDeleteEdge: (edgeId: string) => void
  onDropNode: (nodeType: NodeType, x: number, y: number) => void
}

// ─── Bezier edge path ───────────────────────────────────────────────────────────
function bezierPath(x1: number, y1: number, x2: number, y2: number): string {
  const dy = Math.abs(y2 - y1)
  const curve = Math.max(50, dy * 0.5)
  return `M ${x1} ${y1} C ${x1} ${y1 + curve}, ${x2} ${y2 - curve}, ${x2} ${y2}`
}

// ─── Sub-component: SVG Edges ────────────────────────────────────────────────
interface EdgesLayerProps {
  edges: FlowEdge[]
  nodes: FlowNode[]
  nodeRects: Map<string, { x: number; y: number; w: number; h: number }>
  selectedEdgeId: string | null
  onSelectEdge: (id: string | null) => void
  onDeleteEdge: (id: string) => void
  dragEdge: DragEdgeState | null
}

function getHandlePos(nodeId: string, handle: string | undefined, nodeRects: Map<string, { x: number; y: number; w: number; h: number }>, isOutput: boolean) {
  const rect = nodeRects.get(nodeId)
  if (!rect) return { x: 0, y: 0 }
  if (isOutput) {
    if (handle === 'true') return { x: rect.x + rect.w * 0.3, y: rect.y + rect.h }
    if (handle === 'false') return { x: rect.x + rect.w * 0.7, y: rect.y + rect.h }
    return { x: rect.x + rect.w / 2, y: rect.y + rect.h }
  }
  return { x: rect.x + rect.w / 2, y: rect.y }
}

function EdgesLayer({ edges, nodes, nodeRects, selectedEdgeId, onSelectEdge, onDeleteEdge, dragEdge }: EdgesLayerProps) {
  return (
    <svg
      className="absolute inset-0 pointer-events-none overflow-visible"
      style={{ width: '100%', height: '100%' }}
    >
      <defs>
        <marker id="arrow" markerWidth="10" markerHeight="10" refX="5" refY="3" orient="auto">
          <path d="M0,0 L0,6 L9,3 z" fill="#9CA3AF" />
        </marker>
        <marker id="arrow-blue" markerWidth="10" markerHeight="10" refX="5" refY="3" orient="auto">
          <path d="M0,0 L0,6 L9,3 z" fill="#3B82F6" />
        </marker>
        <marker id="arrow-green" markerWidth="10" markerHeight="10" refX="5" refY="3" orient="auto">
          <path d="M0,0 L0,6 L9,3 z" fill="#22C55E" />
        </marker>
        <marker id="arrow-red" markerWidth="10" markerHeight="10" refX="5" refY="3" orient="auto">
          <path d="M0,0 L0,6 L9,3 z" fill="#F87171" />
        </marker>
      </defs>

      {edges.map(edge => {
        const src = getHandlePos(edge.source, edge.sourceHandle, nodeRects, true)
        const tgt = getHandlePos(edge.target, undefined, nodeRects, false)
        if (!src || !tgt) return null
        const path = bezierPath(src.x, src.y, tgt.x, tgt.y)
        const isSelected = selectedEdgeId === edge.id
        const isTrue = edge.sourceHandle === 'true'
        const isFalse = edge.sourceHandle === 'false'
        const stroke = isTrue ? '#22C55E' : isFalse ? '#F87171' : isSelected ? '#3B82F6' : '#9CA3AF'
        const markerId = isTrue ? 'arrow-green' : isFalse ? 'arrow-red' : isSelected ? 'arrow-blue' : 'arrow'
        // midpoint for delete button
        const mx = (src.x + tgt.x) / 2
        const my = (src.y + tgt.y) / 2

        return (
          <g key={edge.id}>
            {/* Invisible thick path for easier clicking */}
            <path
              d={path}
              fill="none"
              stroke="transparent"
              strokeWidth={16}
              style={{ pointerEvents: 'stroke', cursor: 'pointer' }}
              onClick={(e) => { e.stopPropagation(); onSelectEdge(isSelected ? null : edge.id) }}
            />
            <path
              d={path}
              fill="none"
              stroke={stroke}
              strokeWidth={isSelected ? 2 : 1.5}
              strokeDasharray={isSelected ? '0' : '0'}
              markerEnd={`url(#${markerId})`}
              style={{ pointerEvents: 'none' }}
            />
            {/* Delete edge button at midpoint */}
            {isSelected && (
              <g style={{ pointerEvents: 'all' }}>
                <circle cx={mx} cy={my} r={10} fill="white" stroke="#E5E7EB" strokeWidth={1} />
                <text
                  x={mx} y={my + 4}
                  textAnchor="middle"
                  fontSize={14}
                  fill="#EF4444"
                  style={{ cursor: 'pointer', userSelect: 'none' }}
                  onClick={(e) => { e.stopPropagation(); onDeleteEdge(edge.id); onSelectEdge(null) }}
                >
                  ×
                </text>
              </g>
            )}
          </g>
        )
      })}

      {/* Drag preview edge */}
      {dragEdge && (
        <path
          d={bezierPath(dragEdge.startPos.x, dragEdge.startPos.y, dragEdge.currentPos.x, dragEdge.currentPos.y)}
          fill="none"
          stroke="#3B82F6"
          strokeWidth={2}
          strokeDasharray="6 4"
          markerEnd="url(#arrow-blue)"
          style={{ pointerEvents: 'none' }}
        />
      )}
    </svg>
  )
}

// ─── Main Canvas ────────────────────────────────────────────────────────────────
export default function FlowCanvas({
  nodes, edges, selectedNodeId, validationErrors,
  onSelectNode, onMoveNode, onAddEdge, onDeleteEdge, onDropNode
}: FlowCanvasProps) {
  const canvasRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Viewport transform
  const [transform, setTransform] = useState({ x: 80, y: 80, scale: 1 })

  // Panning
  const isPanning = useRef(false)
  const panStart = useRef<XY>({ x: 0, y: 0 })
  const transformRef = useRef(transform)
  useEffect(() => { transformRef.current = transform }, [transform])

  // Node dragging
  const draggingNode = useRef<{ id: string; startMouse: XY; startPos: XY } | null>(null)

  // Edge dragging
  const [dragEdge, setDragEdge] = useState<DragEdgeState | null>(null)
  const dragEdgeRef = useRef<DragEdgeState | null>(null)
  useEffect(() => { dragEdgeRef.current = dragEdge }, [dragEdge])

  // Node rects (for edge routing) — keyed by nodeId
  const [nodeRects, setNodeRects] = useState<Map<string, { x: number; y: number; w: number; h: number }>>(new Map())
  const nodeRectRefs = useRef<Map<string, HTMLDivElement>>(new Map())

  // Selected edge
  const [selectedEdgeId, setSelectedEdgeId] = useState<string | null>(null)

  // Next step picker
  const [picker, setPicker] = useState<PickerState | null>(null)

  // Hovered input handle
  const hoveredInput = useRef<string | null>(null)

  // ── Coordinate helpers ───────────────────────────────────────────────────────
  const screenToCanvas = useCallback((sx: number, sy: number): XY => {
    const t = transformRef.current
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return { x: 0, y: 0 }
    return {
      x: (sx - rect.left - t.x) / t.scale,
      y: (sy - rect.top - t.y) / t.scale,
    }
  }, [])

  const canvasToScreen = useCallback((cx: number, cy: number): XY => {
    const t = transformRef.current
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return { x: 0, y: 0 }
    return {
      x: cx * t.scale + t.x + rect.left,
      y: cy * t.scale + t.y + rect.top,
    }
  }, [])

  // ── Measure node rects ───────────────────────────────────────────────────────
  const measureRects = useCallback(() => {
    const map = new Map<string, { x: number; y: number; w: number; h: number }>()
    nodes.forEach(n => {
      const el = nodeRectRefs.current.get(n.id)
      if (el) {
        const s = el.style
        // Position is set directly on the element
        const w = el.offsetWidth
        const h = el.offsetHeight
        map.set(n.id, { x: n.position.x, y: n.position.y, w, h })
      } else {
        map.set(n.id, { x: n.position.x, y: n.position.y, w: 260, h: 130 })
      }
    })
    setNodeRects(map)
  }, [nodes])

  useEffect(() => {
    measureRects()
  }, [nodes, measureRects])

  // ── Zoom ─────────────────────────────────────────────────────────────────────
  const handleWheel = useCallback((e: WheelEvent) => {
    e.preventDefault()
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return
    const delta = -e.deltaY * 0.001
    setTransform(t => {
      const newScale = Math.min(2, Math.max(0.3, t.scale + delta * t.scale))
      const mx = e.clientX - rect.left
      const my = e.clientY - rect.top
      const scaleRatio = newScale / t.scale
      return {
        scale: newScale,
        x: mx - scaleRatio * (mx - t.x),
        y: my - scaleRatio * (my - t.y),
      }
    })
  }, [])

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    el.addEventListener('wheel', handleWheel, { passive: false })
    return () => el.removeEventListener('wheel', handleWheel)
  }, [handleWheel])

  // ── Pan ──────────────────────────────────────────────────────────────────────
  const handleContainerMouseDown = useCallback((e: React.MouseEvent) => {
    // Middle mouse or space+drag for panning
    if (e.button === 1 || e.altKey) {
      e.preventDefault()
      isPanning.current = true
      panStart.current = { x: e.clientX - transformRef.current.x, y: e.clientY - transformRef.current.y }
    }
  }, [])

  // ── Drag node ────────────────────────────────────────────────────────────────
  const handleNodeMouseDown = useCallback((e: React.MouseEvent, nodeId: string) => {
    // Only left-click, not on handles
    if (e.button !== 0) return
    const target = e.target as HTMLElement
    if (target.closest('[data-handle-type]')) return

    e.stopPropagation()
    e.preventDefault()
    const node = nodes.find(n => n.id === nodeId)
    if (!node) return

    draggingNode.current = {
      id: nodeId,
      startMouse: { x: e.clientX, y: e.clientY },
      startPos: { ...node.position },
    }
  }, [nodes])

  // ── Drag edge from output handle ─────────────────────────────────────────────
  const handleOutputHandleMouseDown = useCallback((e: React.MouseEvent, nodeId: string, handle?: string) => {
    e.stopPropagation()
    e.preventDefault()
    const node = nodes.find(n => n.id === nodeId)
    if (!node) return

    const rect = nodeRects.get(nodeId)
    const w = rect?.w || 260
    const h = rect?.h || 130
    let startX = node.position.x + w / 2
    let startY = node.position.y + h

    if (handle === 'true') startX = node.position.x + w * 0.3
    else if (handle === 'false') startX = node.position.x + w * 0.7

    const canvasPos = screenToCanvas(e.clientX, e.clientY)
    setDragEdge({
      sourceNodeId: nodeId,
      sourceHandle: handle,
      startPos: { x: startX, y: startY },
      currentPos: canvasPos,
    })
  }, [nodes, nodeRects, screenToCanvas])

  // ── Global mouse move / up ───────────────────────────────────────────────────
  const handleMouseMove = useCallback((e: MouseEvent) => {
    // Pan
    if (isPanning.current) {
      setTransform(t => ({
        ...t,
        x: e.clientX - panStart.current.x,
        y: e.clientY - panStart.current.y,
      }))
      return
    }

    // Drag node
    if (draggingNode.current) {
      const dx = (e.clientX - draggingNode.current.startMouse.x) / transformRef.current.scale
      const dy = (e.clientY - draggingNode.current.startMouse.y) / transformRef.current.scale
      const newX = draggingNode.current.startPos.x + dx
      const newY = draggingNode.current.startPos.y + dy
      onMoveNode(draggingNode.current.id, Math.round(newX), Math.round(newY))
    }

    // Drag edge
    if (dragEdgeRef.current) {
      const pos = screenToCanvas(e.clientX, e.clientY)
      setDragEdge(prev => prev ? { ...prev, currentPos: pos } : null)
    }
  }, [onMoveNode, screenToCanvas])

  const handleMouseUp = useCallback((e: MouseEvent) => {
    isPanning.current = false

    // Finish node drag
    if (draggingNode.current) {
      draggingNode.current = null
    }

    // Finish edge drag — check if dropped on input handle
    if (dragEdgeRef.current) {
      const targetId = hoveredInput.current
      if (targetId && targetId !== dragEdgeRef.current.sourceNodeId) {
        const edgeId = `edge_${Date.now()}`
        onAddEdge({
          id: edgeId,
          source: dragEdgeRef.current.sourceNodeId,
          target: targetId,
          sourceHandle: dragEdgeRef.current.sourceHandle,
        })
      }
      setDragEdge(null)
    }
  }, [onAddEdge])

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [handleMouseMove, handleMouseUp])

  // ── Drop node from palette ───────────────────────────────────────────────────
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'copy'
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const nodeType = e.dataTransfer.getData('nodeType') as NodeType
    if (!nodeType) return
    const pos = screenToCanvas(e.clientX, e.clientY)
    onDropNode(nodeType, pos.x, pos.y)
  }

  // ── Next step picker ─────────────────────────────────────────────────────────
  const handleOpenPicker = useCallback((nodeId: string, handle?: string, nodePos?: { x: number; y: number }) => {
    // Position picker near the node's bottom-right area
    const rect = nodeRects.get(nodeId)
    const nw = rect?.w || 260
    const nh = rect?.h || 130
    const nx = nodePos?.x || nodes.find(n => n.id === nodeId)?.position.x || 0
    const ny = nodePos?.y || nodes.find(n => n.id === nodeId)?.position.y || 0
    const screenPos = canvasToScreen(nx + nw + 20, ny)
    setPicker({
      sourceNodeId: nodeId,
      sourceHandle: handle,
      screenPos: { x: screenPos.x, y: screenPos.y },
    })
  }, [nodeRects, nodes, canvasToScreen])

  const handlePickerSelectExisting = useCallback((targetId: string) => {
    if (!picker) return
    onAddEdge({
      id: `edge_${Date.now()}`,
      source: picker.sourceNodeId,
      target: targetId,
      sourceHandle: picker.sourceHandle,
    })
    setPicker(null)
  }, [picker, onAddEdge])

  const handlePickerCreateNode = useCallback((nodeType: NodeType) => {
    if (!picker) return
    // Get source node position and place new node to the right
    const srcNode = nodes.find(n => n.id === picker.sourceNodeId)
    const rect = nodeRects.get(picker.sourceNodeId)
    const srcW = rect?.w || 260
    const srcH = rect?.h || 130
    const newX = srcNode ? srcNode.position.x + srcW + 80 : 400
    const newY = srcNode ? srcNode.position.y : 200
    onDropNode(nodeType, newX, newY)
    setPicker(null)
    // Note: the edge will be created after the node is added (need the new node id)
    // For now, the user will drag-connect or re-open picker
    // This is a known limitation – full auto-connect needs store refactor
  }, [picker, nodes, nodeRects, onDropNode])

  // ── Fit view ─────────────────────────────────────────────────────────────────
  const fitView = useCallback(() => {
    if (!nodes.length || !containerRef.current) return
    const cRect = containerRef.current.getBoundingClientRect()
    const padding = 80
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity
    nodes.forEach(n => {
      const r = nodeRects.get(n.id)
      const w = r?.w || 260
      const h = r?.h || 130
      minX = Math.min(minX, n.position.x)
      minY = Math.min(minY, n.position.y)
      maxX = Math.max(maxX, n.position.x + w)
      maxY = Math.max(maxY, n.position.y + h)
    })
    const fw = maxX - minX + padding * 2
    const fh = maxY - minY + padding * 2
    const scale = Math.min(1, Math.min(cRect.width / fw, cRect.height / fh))
    setTransform({
      scale,
      x: (cRect.width - (maxX - minX) * scale) / 2 - minX * scale,
      y: (cRect.height - (maxY - minY) * scale) / 2 - minY * scale,
    })
  }, [nodes, nodeRects])

  // Node index for display (filter out start)
  const nodeDisplayIndex = useMemo(() => {
    const map = new Map<string, number>()
    let idx = 1
    nodes.forEach(n => {
      if (n.type !== 'start') {
        map.set(n.id, idx++)
      }
    })
    return map
  }, [nodes])

  const errorNodeIds = useMemo(() =>
    new Set(validationErrors.map(e => e.nodeId).filter(Boolean) as string[]),
    [validationErrors]
  )

  return (
    <div
      ref={containerRef}
      className="relative flex-1 overflow-hidden"
      style={{ background: '#F1F3F5', cursor: isPanning.current ? 'grabbing' : 'default' }}
      onMouseDown={handleContainerMouseDown}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onClick={() => { onSelectNode(null); setSelectedEdgeId(null) }}
    >
      {/* Dot grid background */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="dotgrid" x={transform.x % (20 * transform.scale)} y={transform.y % (20 * transform.scale)}
            width={20 * transform.scale} height={20 * transform.scale} patternUnits="userSpaceOnUse">
            <circle cx={1} cy={1} r={0.8} fill="#D1D5DB" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#dotgrid)" />
      </svg>

      {/* Canvas transform layer */}
      <div
        ref={canvasRef}
        className="absolute origin-top-left"
        style={{ transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})` }}
      >
        {/* Edges SVG */}
        <EdgesLayer
          edges={edges}
          nodes={nodes}
          nodeRects={nodeRects}
          selectedEdgeId={selectedEdgeId}
          onSelectEdge={setSelectedEdgeId}
          onDeleteEdge={onDeleteEdge}
          dragEdge={dragEdge}
        />

        {/* Nodes */}
        {nodes.map(node => (
          <div
            key={node.id}
            ref={el => {
              if (el) nodeRectRefs.current.set(node.id, el)
              else nodeRectRefs.current.delete(node.id)
            }}
            className="absolute"
            style={{
              left: node.position.x,
              top: node.position.y,
              cursor: draggingNode.current?.id === node.id ? 'grabbing' : 'grab',
              zIndex: node.id === selectedNodeId ? 10 : 1,
            }}
          >
            <NodeCard
              node={node}
              edges={edges}
              selected={node.id === selectedNodeId}
              hasError={errorNodeIds.has(node.id)}
              nodeIndex={nodeDisplayIndex.get(node.id) || 1}
              onSelect={() => onSelectNode(node.id)}
              onOpenPicker={(handle) => handleOpenPicker(node.id, handle, node.position)}
              onMouseDown={(e) => handleNodeMouseDown(e, node.id)}
              onOutputHandleMouseDown={(e, handle) => handleOutputHandleMouseDown(e, node.id, handle)}
              onInputHandleMouseEnter={() => { hoveredInput.current = node.id }}
              onInputHandleMouseLeave={() => { hoveredInput.current = null }}
            />
          </div>
        ))}

        {/* Empty state */}
        {nodes.length === 0 && (
          <div className="flex flex-col items-center justify-center" style={{ width: 600, height: 400, marginLeft: 100, marginTop: 50 }}>
            <div className="w-16 h-16 rounded-2xl bg-white border-2 border-dashed border-gray-300 flex items-center justify-center mb-4">
              <Plus size={24} className="text-gray-400" />
            </div>
            <p className="text-gray-500 text-sm font-medium">Kéo và thả để thêm nội dung</p>
            <p className="text-gray-400 text-xs mt-1">Hoặc chọn từ bảng node bên trái</p>
          </div>
        )}
      </div>

      {/* ── Controls ───────────────────────────────────────────────────────────── */}
      <div className="absolute bottom-4 right-4 flex items-center gap-2">
        <div className="flex items-center gap-1 bg-white rounded-xl shadow-sm border border-gray-200 px-2 py-1.5">
          <button
            className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-600 transition-colors"
            onClick={fitView}
            title="Fit view"
          >
            <Maximize2 size={14} />
          </button>
          <button
            className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-600 transition-colors"
            onClick={() => setTransform(t => ({ ...t, scale: Math.max(0.3, t.scale - 0.1) }))}
          >
            <ZoomOut size={14} />
          </button>
          <span className="text-xs text-gray-500 w-10 text-center font-medium">
            {Math.round(transform.scale * 100)}%
          </span>
          <button
            className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-600 transition-colors"
            onClick={() => setTransform(t => ({ ...t, scale: Math.min(2, t.scale + 0.1) }))}
          >
            <ZoomIn size={14} />
          </button>
        </div>
      </div>

      {/* Drag cursor indicator */}
      {dragEdge && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs px-3 py-1.5 rounded-full shadow-lg pointer-events-none" style={{ zIndex: 9999 }}>
          Thả vào node để kết nối
        </div>
      )}

      {/* Next step picker popup */}
      {picker && (
        <NextStepPicker
          position={picker.screenPos}
          sourceNodeId={picker.sourceNodeId}
          sourceHandle={picker.sourceHandle}
          existingNodes={nodes}
          onSelectExistingNode={handlePickerSelectExisting}
          onCreateNode={handlePickerCreateNode}
          onClose={() => setPicker(null)}
        />
      )}
    </div>
  )
}
