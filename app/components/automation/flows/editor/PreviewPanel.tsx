'use client'

import React, { useState } from 'react'
import { X, RotateCcw, Send, Bot } from 'lucide-react'
import { FlowNode, FlowEdge, TextNodeData, ButtonsNodeData, QuickReplyNodeData } from '../types'
import { TEMPLATE_VARIABLES } from '../constants'
import { cn } from '@/lib/utils'

interface PreviewPanelProps {
  open: boolean
  nodes: FlowNode[]
  edges: FlowEdge[]
  onClose: () => void
}

interface Message {
  id: string
  role: 'bot' | 'user'
  content: string
  buttons?: string[]
  quickReplies?: string[]
}

export default function PreviewPanel({ open, nodes, edges, onClose }: PreviewPanelProps) {
  const [testVars, setTestVars] = useState<Record<string, string>>({
    ten_khach_hang: 'Nguyễn Văn A',
    ten: 'A',
    so_dien_thoai: '0901234567',
    email: 'a@example.com',
  })
  const [messages, setMessages] = useState<Message[]>([])
  const [currentNodeId, setCurrentNodeId] = useState<string | null>(null)
  const [userInput, setUserInput] = useState('')
  const [started, setStarted] = useState(false)

  const replaceVars = (text: string) => {
    return text.replace(/\{([^}]+)\}/g, (_, key) => testVars[key] || `{${key}}`)
  }

  const getNextNodeId = (nodeId: string, handleId?: string): string | null => {
    const edge = edges.find(e => e.source === nodeId && (handleId ? e.sourceHandle === handleId || !e.sourceHandle : true))
    return edge?.target || null
  }

  const processNode = (nodeId: string): Message[] => {
    const node = nodes.find(n => n.id === nodeId)
    if (!node) return []

    const msgs: Message[] = []

    switch (node.type) {
      case 'text': {
        const d = node.data as TextNodeData
        msgs.push({ id: `msg_${Date.now()}`, role: 'bot', content: replaceVars(d.content || '...') })
        break
      }
      case 'image':
        msgs.push({ id: `msg_${Date.now()}`, role: 'bot', content: '📷 [Hình ảnh]' })
        break
      case 'video':
        msgs.push({ id: `msg_${Date.now()}`, role: 'bot', content: '🎬 [Video]' })
        break
      case 'audio':
        msgs.push({ id: `msg_${Date.now()}`, role: 'bot', content: '🎵 [Audio]' })
        break
      case 'file':
        msgs.push({ id: `msg_${Date.now()}`, role: 'bot', content: '📎 [File đính kèm]' })
        break
      case 'carousel': {
        const d = node.data as any
        msgs.push({ id: `msg_${Date.now()}`, role: 'bot', content: `📋 [Bộ sưu tập: ${d.cards?.length || 0} thẻ]` })
        break
      }
      case 'buttons': {
        const d = node.data as ButtonsNodeData
        msgs.push({
          id: `msg_${Date.now()}`, role: 'bot',
          content: 'Vui lòng chọn một trong các tùy chọn sau:',
          buttons: d.buttons.map(b => b.label),
        })
        break
      }
      case 'quick_reply': {
        const d = node.data as QuickReplyNodeData
        msgs.push({
          id: `msg_${Date.now()}`, role: 'bot',
          content: 'Chọn câu trả lời nhanh:',
          quickReplies: d.replies.map(r => r.label),
        })
        break
      }
      case 'delay': {
        const d = node.data as any
        msgs.push({ id: `msg_${Date.now()}`, role: 'bot', content: `⏳ [Hệ thống chờ ${d.value} ${d.unit}]` })
        break
      }
      case 'action': {
        const d = node.data as any
        msgs.push({ id: `msg_${Date.now()}`, role: 'bot', content: `⚡ [Hành động: ${(d.actions || []).length} thao tác]` })
        break
      }
      case 'condition':
        msgs.push({ id: `msg_${Date.now()}`, role: 'bot', content: `🔀 [Kiểm tra điều kiện...]` })
        break
      case 'wait_response':
        msgs.push({ id: `msg_${Date.now()}`, role: 'bot', content: '⏳ [Đang chờ phản hồi từ khách hàng...]' })
        break
    }

    return msgs
  }

  const startPreview = () => {
    const startNode = nodes.find(n => n.type === 'start')
    if (!startNode) return
    const firstEdge = edges.find(e => e.source === startNode.id)
    if (!firstEdge) { setMessages([{ id: 'no_content', role: 'bot', content: 'Luồng chưa có node nào sau điểm Bắt đầu.' }]); setStarted(true); return }

    const firstNodeId = firstEdge.target
    const initialMsgs = processNode(firstNodeId)
    setMessages(initialMsgs)
    setCurrentNodeId(firstNodeId)
    setStarted(true)
  }

  const continueFlow = () => {
    if (!currentNodeId) return
    const nextId = getNextNodeId(currentNodeId)
    if (!nextId) {
      setMessages(prev => [...prev, { id: `end_${Date.now()}`, role: 'bot', content: '✅ Luồng kết thúc.' }])
      setCurrentNodeId(null)
      return
    }
    const newMsgs = processNode(nextId)
    setMessages(prev => [...prev, ...newMsgs])
    setCurrentNodeId(nextId)
  }

  const handleSend = () => {
    if (!userInput.trim()) return
    const userMsg: Message = { id: `u_${Date.now()}`, role: 'user', content: userInput }
    setMessages(prev => [...prev, userMsg])
    setUserInput('')
    setTimeout(continueFlow, 500)
  }

  const handleReset = () => {
    setMessages([])
    setCurrentNodeId(null)
    setStarted(false)
    setUserInput('')
  }

  if (!open) return null

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-30 bg-black/20" onClick={onClose} />

      {/* Panel */}
      <div className="fixed right-0 top-0 h-full w-96 bg-white shadow-2xl z-40 flex flex-col">
        {/* Header */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-blue-700">
          <Bot className="w-5 h-5 text-white" />
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-white">Xem trước luồng</h3>
            <p className="text-xs text-blue-200 mt-0.5">Mô phỏng trải nghiệm chat</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-blue-200 hover:text-white hover:bg-blue-500 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Test variables */}
        <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
          <p className="text-xs font-semibold text-gray-600 mb-2">Biến thử nghiệm</p>
          <div className="space-y-1.5">
            {TEMPLATE_VARIABLES.slice(0, 4).map(v => (
              <div key={v.key} className="flex items-center gap-2">
                <code className="text-[10px] text-purple-600 font-mono w-24 shrink-0">{`{${v.key}}`}</code>
                <input
                  value={testVars[v.key] || ''}
                  onChange={e => setTestVars(prev => ({ ...prev, [v.key]: e.target.value }))}
                  placeholder={v.example}
                  className="flex-1 px-2 py-1 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Chat area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50">
          {!started && (
            <div className="flex flex-col items-center justify-center h-full gap-3 text-center">
              <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center">
                <Bot className="w-7 h-7 text-blue-500" />
              </div>
              <p className="text-sm font-medium text-gray-600">Sẵn sàng xem trước</p>
              <button
                onClick={startPreview}
                className="px-5 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition-colors shadow-sm"
              >
                Bắt đầu mô phỏng
              </button>
            </div>
          )}

          {messages.map(msg => (
            <div
              key={msg.id}
              className={cn('flex', msg.role === 'user' ? 'justify-end' : 'justify-start')}
            >
              {msg.role === 'bot' && (
                <div className="flex items-start gap-2 max-w-[85%]">
                  <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                    <Bot className="w-3.5 h-3.5 text-white" />
                  </div>
                  <div className="space-y-2">
                    <div className="bg-white rounded-2xl rounded-tl-sm px-3.5 py-2.5 shadow-sm border border-gray-200">
                      <p className="text-sm text-gray-800 whitespace-pre-wrap">{msg.content}</p>
                    </div>
                    {msg.buttons && (
                      <div className="space-y-1.5">
                        {msg.buttons.map((btn, i) => (
                          <button
                            key={i}
                            onClick={continueFlow}
                            className="w-full px-3.5 py-2 bg-white border-2 border-blue-300 text-blue-600 text-xs font-medium rounded-xl hover:bg-blue-50 transition-colors"
                          >
                            {btn}
                          </button>
                        ))}
                      </div>
                    )}
                    {msg.quickReplies && (
                      <div className="flex flex-wrap gap-1.5">
                        {msg.quickReplies.map((qr, i) => (
                          <button
                            key={i}
                            onClick={() => {
                              setMessages(prev => [...prev, { id: `u_${Date.now()}`, role: 'user', content: qr }])
                              setTimeout(continueFlow, 500)
                            }}
                            className="px-3 py-1 bg-white border border-blue-300 text-blue-600 text-xs font-medium rounded-full hover:bg-blue-50 transition-colors"
                          >
                            {qr}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {msg.role === 'user' && (
                <div className="bg-blue-600 text-white text-sm rounded-2xl rounded-tr-sm px-3.5 py-2.5 max-w-[75%]">
                  {msg.content}
                </div>
              )}
            </div>
          ))}

          {started && currentNodeId && (
            <div className="flex justify-center">
              <button
                onClick={continueFlow}
                className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
              >
                Tiếp tục → <span className="text-[10px] text-gray-400">(bước tiếp theo)</span>
              </button>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="p-4 border-t border-gray-200 bg-white">
          <div className="flex items-center gap-2 mb-3">
            <div className="flex-1 flex items-center gap-2 border border-gray-200 rounded-xl px-3 py-2">
              <input
                value={userInput}
                onChange={e => setUserInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
                placeholder="Nhập tin nhắn thử..."
                className="flex-1 text-sm outline-none"
              />
            </div>
            <button
              onClick={handleSend}
              disabled={!userInput.trim()}
              className="w-9 h-9 bg-blue-600 text-white rounded-xl flex items-center justify-center hover:bg-blue-700 disabled:opacity-40 transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
          <button
            onClick={handleReset}
            className="w-full flex items-center justify-center gap-1.5 py-2 text-xs text-gray-500 hover:text-gray-700 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Đặt lại từ đầu
          </button>
        </div>
      </div>
    </>
  )
}
