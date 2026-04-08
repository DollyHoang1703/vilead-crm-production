'use client'

import React, {
  createContext, useContext, useReducer, useCallback,
  ReactNode,
} from 'react'
import {
  FlowEditorState, FlowNode, FlowEdge, NodeType, NodeData,
  FlowDetail, ValidationError, XY,
} from './types'
import { NODE_WIDTH, NODE_HEIGHT } from './constants'

// ---- Action types ----
type Action =
  | { type: 'SET_FLOW'; payload: FlowDetail }
  | { type: 'ADD_NODE'; payload: { nodeType: NodeType; position: XY } }
  | { type: 'UPDATE_NODE'; payload: { nodeId: string; data: Partial<NodeData> } }
  | { type: 'MOVE_NODE'; payload: { nodeId: string; position: XY } }
  | { type: 'DELETE_NODE'; payload: { nodeId: string } }
  | { type: 'ADD_EDGE'; payload: FlowEdge }
  | { type: 'DELETE_EDGE'; payload: { edgeId: string } }
  | { type: 'SELECT_NODE'; payload: { nodeId: string | null } }
  | { type: 'SET_PREVIEW_OPEN'; payload: boolean }
  | { type: 'SET_FLOW_NAME'; payload: string }
  | { type: 'SET_VALIDATION_ERRORS'; payload: ValidationError[] }
  | { type: 'MARK_SAVED' }

// ---- Default node data per type ----
function defaultNodeData(nodeType: NodeType): NodeData {
  switch (nodeType) {
    case 'text':          return { content: '' }
    case 'image':         return { url: '', caption: '' }
    case 'video':         return { url: '' }
    case 'audio':         return { fileId: '' }
    case 'file':          return { fileId: '', fileName: '', fileSize: 0 }
    case 'carousel':      return { cards: [{ id: `card_${Date.now()}`, imageUrl: '', title: '', description: '', buttons: [] }] }
    case 'buttons':       return { buttons: [{ id: `btn_${Date.now()}`, label: 'Nút 1', type: 'flow', value: '' }] }
    case 'quick_reply':   return { replies: [{ id: `qr_${Date.now()}`, label: 'Trả lời 1', type: 'flow' }] }
    case 'wait_response': return { timeoutValue: 24, timeoutUnit: 'hours' }
    case 'condition':     return { logic: 'and', conditions: [] }
    case 'random':        return { branches: [{ id: `b1_${Date.now()}`, name: 'Nhánh A', percentage: 50 }, { id: `b2_${Date.now()}`, name: 'Nhánh B', percentage: 50 }] }
    case 'delay':         return { value: 1, unit: 'hours' }
    case 'action':        return { actions: [] }
    default:              return {}
  }
}

let _nodeCounter = 100

// ---- Reducer ----
function reducer(state: FlowEditorState, action: Action): FlowEditorState {
  switch (action.type) {
    case 'SET_FLOW':
      return {
        ...state,
        flowId: action.payload.id,
        flowName: action.payload.name,
        status: action.payload.status,
        nodes: action.payload.nodes,
        edges: action.payload.edges,
        hasUnsavedChanges: false,
        selectedNodeId: null,
        validationErrors: [],
      }

    case 'ADD_NODE': {
      _nodeCounter++
      const newNode: FlowNode = {
        id: `node_${_nodeCounter}`,
        type: action.payload.nodeType,
        position: action.payload.position,
        data: defaultNodeData(action.payload.nodeType),
      }
      return {
        ...state,
        nodes: [...state.nodes, newNode],
        selectedNodeId: newNode.id,
        hasUnsavedChanges: true,
      }
    }

    case 'UPDATE_NODE':
      return {
        ...state,
        nodes: state.nodes.map(n =>
          n.id === action.payload.nodeId
            ? { ...n, data: { ...n.data, ...action.payload.data } }
            : n
        ),
        hasUnsavedChanges: true,
      }

    case 'MOVE_NODE':
      return {
        ...state,
        nodes: state.nodes.map(n =>
          n.id === action.payload.nodeId
            ? { ...n, position: action.payload.position }
            : n
        ),
        hasUnsavedChanges: true,
      }

    case 'DELETE_NODE': {
      const targetId = action.payload.nodeId
      return {
        ...state,
        nodes: state.nodes.filter(n => n.id !== targetId),
        edges: state.edges.filter(e => e.source !== targetId && e.target !== targetId),
        selectedNodeId: state.selectedNodeId === targetId ? null : state.selectedNodeId,
        hasUnsavedChanges: true,
      }
    }

    case 'ADD_EDGE': {
      const edge = action.payload
      // Prevent duplicate
      const exists = state.edges.some(
        e => e.source === edge.source && e.target === edge.target && e.sourceHandle === edge.sourceHandle
      )
      if (exists) return state
      return { ...state, edges: [...state.edges, edge], hasUnsavedChanges: true }
    }

    case 'DELETE_EDGE':
      return {
        ...state,
        edges: state.edges.filter(e => e.id !== action.payload.edgeId),
        hasUnsavedChanges: true,
      }

    case 'SELECT_NODE':
      return { ...state, selectedNodeId: action.payload.nodeId }

    case 'SET_PREVIEW_OPEN':
      return { ...state, isPreviewOpen: action.payload }

    case 'SET_FLOW_NAME':
      return { ...state, flowName: action.payload, hasUnsavedChanges: true }

    case 'SET_VALIDATION_ERRORS':
      return { ...state, validationErrors: action.payload }

    case 'MARK_SAVED':
      return { ...state, hasUnsavedChanges: false }

    default:
      return state
  }
}

// ---- Initial state ----
const INITIAL_STATE: FlowEditorState = {
  flowId: null,
  flowName: 'Luồng mới',
  status: 'draft',
  nodes: [],
  edges: [],
  selectedNodeId: null,
  hasUnsavedChanges: false,
  isPreviewOpen: false,
  validationErrors: [],
}

// ---- Context ----
interface FlowEditorContextValue {
  state: FlowEditorState
  setFlow: (flow: FlowDetail) => void
  addNode: (nodeType: NodeType, position: XY) => void
  updateNode: (nodeId: string, data: Partial<NodeData>) => void
  moveNode: (nodeId: string, position: XY) => void
  deleteNode: (nodeId: string) => void
  addEdge: (edge: FlowEdge) => void
  deleteEdge: (edgeId: string) => void
  selectNode: (nodeId: string | null) => void
  setPreviewOpen: (open: boolean) => void
  setFlowName: (name: string) => void
  markSaved: () => void
  validate: () => ValidationError[]
}

const FlowEditorContext = createContext<FlowEditorContextValue | null>(null)

export function FlowEditorProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE)

  const setFlow = useCallback((flow: FlowDetail) =>
    dispatch({ type: 'SET_FLOW', payload: flow }), [])

  const addNode = useCallback((nodeType: NodeType, position: XY) =>
    dispatch({ type: 'ADD_NODE', payload: { nodeType, position } }), [])

  const updateNode = useCallback((nodeId: string, data: Partial<NodeData>) =>
    dispatch({ type: 'UPDATE_NODE', payload: { nodeId, data } }), [])

  const moveNode = useCallback((nodeId: string, position: XY) =>
    dispatch({ type: 'MOVE_NODE', payload: { nodeId, position } }), [])

  const deleteNode = useCallback((nodeId: string) =>
    dispatch({ type: 'DELETE_NODE', payload: { nodeId } }), [])

  const addEdge = useCallback((edge: FlowEdge) =>
    dispatch({ type: 'ADD_EDGE', payload: edge }), [])

  const deleteEdge = useCallback((edgeId: string) =>
    dispatch({ type: 'DELETE_EDGE', payload: { edgeId } }), [])

  const selectNode = useCallback((nodeId: string | null) =>
    dispatch({ type: 'SELECT_NODE', payload: { nodeId } }), [])

  const setPreviewOpen = useCallback((open: boolean) =>
    dispatch({ type: 'SET_PREVIEW_OPEN', payload: open }), [])

  const setFlowName = useCallback((name: string) =>
    dispatch({ type: 'SET_FLOW_NAME', payload: name }), [])

  const markSaved = useCallback(() =>
    dispatch({ type: 'MARK_SAVED' }), [])

  const validate = useCallback((): ValidationError[] => {
    const { nodes, edges } = state
    const errors: ValidationError[] = []

    const startNode = nodes.find(n => n.type === 'start')
    if (!startNode) {
      errors.push({ code: 'NO_START_NODE', message: 'Flow cần có node Bắt đầu' })
      dispatch({ type: 'SET_VALIDATION_ERRORS', payload: errors })
      return errors
    }

    // Check start has child
    const startEdges = edges.filter(e => e.source === startNode.id)
    if (startEdges.length === 0) {
      errors.push({ code: 'NO_CONTENT_NODE', message: 'Cần có ít nhất 1 node sau điểm Bắt đầu' })
    }

    // BFS reachable nodes
    const reachable = new Set<string>([startNode.id])
    const queue = [startNode.id]
    while (queue.length) {
      const curr = queue.shift()!
      edges.filter(e => e.source === curr).forEach(e => {
        if (!reachable.has(e.target)) {
          reachable.add(e.target)
          queue.push(e.target)
        }
      })
    }

    nodes.forEach(n => {
      if (n.type !== 'start' && !reachable.has(n.id)) {
        errors.push({ nodeId: n.id, code: 'DISCONNECTED_NODE', message: `Node chưa được kết nối` })
      }
    })

    // Empty content
    nodes.filter(n => ['text', 'image', 'video', 'audio', 'file'].includes(n.type)).forEach(n => {
      const d = n.data as any
      const isEmpty = n.type === 'text' ? !d.content : !d.url && !d.fileId
      if (isEmpty) {
        errors.push({ nodeId: n.id, code: 'EMPTY_CONTENT', message: 'Node chưa có nội dung' })
      }
    })

    // Condition must have conditions
    nodes.filter(n => n.type === 'condition').forEach(n => {
      const d = n.data as any
      if (!d.conditions || d.conditions.length === 0) {
        errors.push({ nodeId: n.id, code: 'EMPTY_CONDITION', message: 'Node Điều kiện cần ít nhất 1 điều kiện' })
      }
    })

    // Random must sum to 100
    nodes.filter(n => n.type === 'random').forEach(n => {
      const d = n.data as any
      const total = (d.branches || []).reduce((s: number, b: any) => s + b.percentage, 0)
      if (total !== 100) {
        errors.push({ nodeId: n.id, code: 'INVALID_PERCENTAGE', message: `Tổng tỷ lệ = ${total}%, cần = 100%` })
      }
    })

    dispatch({ type: 'SET_VALIDATION_ERRORS', payload: errors })
    return errors
  }, [state])

  return (
    <FlowEditorContext.Provider value={{
      state, setFlow, addNode, updateNode, moveNode, deleteNode,
      addEdge, deleteEdge, selectNode, setPreviewOpen, setFlowName,
      markSaved, validate,
    }}>
      {children}
    </FlowEditorContext.Provider>
  )
}

export function useFlowEditor() {
  const ctx = useContext(FlowEditorContext)
  if (!ctx) throw new Error('useFlowEditor must be used within FlowEditorProvider')
  return ctx
}
