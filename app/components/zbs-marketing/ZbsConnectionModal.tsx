'use client'

import React, { useState } from 'react'
import {
  X,
  Plus,
  MessageSquare,
  AlertTriangle,
  RefreshCw,
} from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

// ==================== TYPES ====================
interface ZaloOAAccount {
  id: string
  name: string
  oaId: string
  status: 'connected' | 'disconnected'
  avatar: string
}

// ==================== MOCK DATA ====================
const mockOAAccounts: ZaloOAAccount[] = [
  {
    id: 'oa-1',
    name: 'CCycle AI - Marketing và CSKH',
    oaId: '1853684866249512254',
    status: 'connected',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=CCycle',
  },
  {
    id: 'oa-2',
    name: 'Vilead - Hỗ trợ doanh nghiệp',
    oaId: '2853684866249512254',
    status: 'connected',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=VileadOA',
  },
]

// ==================== MAIN COMPONENT ====================
interface ZbsConnectionModalProps {
  open: boolean
  onClose: () => void
}

export default function ZbsConnectionModal({ open, onClose }: ZbsConnectionModalProps) {
  const [accounts, setAccounts] = useState<ZaloOAAccount[]>(mockOAAccounts)
  const [platform, setPlatform] = useState('zalo-oa')
  const [showIntegrationModal, setShowIntegrationModal] = useState(false)
  const [showOALinkModal, setShowOALinkModal] = useState(false)

  if (!open) return null

  const toggleAccountConnection = (accountId: string) => {
    setAccounts(prev =>
      prev.map(a =>
        a.id === accountId
          ? { ...a, status: a.status === 'connected' ? 'disconnected' : 'connected' as const }
          : a
      )
    )
  }

  const handleRemove = (accountId: string) => {
    if (confirm('Bạn có chắc muốn xóa kết nối này?')) {
      setAccounts(prev => prev.filter(a => a.id !== accountId))
    }
  }

  return (
    <>
      <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
        <DialogContent className="max-w-4xl max-h-[90vh] p-0">
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Quản lý kết nối Zalo OA</h2>
            </div>

            {/* Controls */}
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <label className="text-sm text-gray-600">Chọn nền tảng:</label>
                  <select
                    value={platform}
                    onChange={(e) => setPlatform(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="zalo-oa">Zalo OA</option>
                  </select>
                </div>
                <Button 
                  className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white"
                  onClick={() => setShowIntegrationModal(true)}
                >
                  <Plus className="w-4 h-4" />
                  Thêm kết nối
                </Button>
              </div>
            </div>

            {/* Connected Accounts List */}
            <ScrollArea className="flex-1 p-6 max-h-[500px]">
              <div className="space-y-4">
                {accounts.length === 0 && (
                  <div className="text-center py-10 text-gray-500">
                    Chưa có kết nối nào.
                  </div>
                )}
                {accounts.map((account) => (
                  <div key={account.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        <Avatar className="w-12 h-12">
                          <AvatarImage src={account.avatar} />
                          <AvatarFallback className="bg-purple-500 text-white">
                            {account.name.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-gray-900">{account.name}</h3>
                            <Badge className="text-xs bg-purple-100 text-purple-800">
                              Zalo OA
                            </Badge>
                          </div>
                          <div className="text-sm text-gray-500 space-y-1">
                            <div>• ID: {account.oaId}</div>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-3">
                        {/* Row 1: Badge */}
                        <div className="flex items-center gap-2">
                          {account.status === 'connected' ? (
                            <Badge className="bg-green-100 text-green-800 flex items-center gap-1 hover:bg-green-100">
                              <div className="w-2 h-2 rounded-full bg-green-500"></div>
                              Đã kết nối
                            </Badge>
                          ) : (
                            <Badge className="bg-red-100 text-red-800 flex items-center gap-1 hover:bg-red-100">
                              <div className="w-2 h-2 rounded-full bg-red-500"></div>
                              Mất kết nối
                            </Badge>
                          )}
                        </div>
                        {/* Row 2: Disconnect & Delete buttons */}
                        <div className="flex items-center gap-2">
                          {account.status === 'connected' ? (
                            <Button
                              size="sm"
                              onClick={() => toggleAccountConnection(account.id)}
                              className="bg-orange-500 hover:bg-orange-600 text-white text-xs h-8 px-3 border-0 rounded-md"
                            >
                              Ngắt kết nối
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              onClick={() => toggleAccountConnection(account.id)}
                              className="bg-green-500 hover:bg-green-600 text-white text-xs h-8 px-3 border-0 rounded-md"
                            >
                              Kết nối
                            </Button>
                          )}
                          <Button
                            size="sm"
                            className="bg-red-500 hover:bg-red-600 text-white h-8 w-8 p-0 border-0 rounded-md"
                            onClick={() => handleRemove(account.id)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal: Chọn loại tích hợp (Chỉ hiển thị Zalo OA theo logic) */}
      <Dialog open={showIntegrationModal} onOpenChange={setShowIntegrationModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Thêm kết nối mới</DialogTitle>
            <DialogDescription>
              Chọn loại kết nối bạn muốn thêm vào hệ thống
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 px-6 py-4">
            <div>
              <Label>Loại kết nối</Label>
              <Select value="zalo-oa">
                <SelectTrigger className="mt-2 text-gray-700 bg-gray-50 border-gray-200">
                  <SelectValue placeholder="Chọn loại kết nối" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="zalo-oa">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="w-4 h-4 text-primary" />
                      Kết nối Zalo OA
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded p-3">
              <p className="text-sm text-yellow-800">
                <AlertTriangle className="w-4 h-4 inline mr-1" />
                Yêu cầu gói <strong>OA Nâng cao</strong> hoặc <strong>OA Premium</strong>
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowIntegrationModal(false)}
            >
              Hủy
            </Button>
            <Button
              onClick={() => {
                setShowIntegrationModal(false)
                setShowOALinkModal(true)
              }}
            >
              Tiếp tục
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal: Quy trình Kết nối Zalo OA */}
      <Dialog open={showOALinkModal} onOpenChange={setShowOALinkModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl text-center">
              Kết nối Vilead CRM
            </DialogTitle>
            <DialogDescription className="text-center">
              với tài khoản Zalo OA
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 px-6 py-4">
            {/* Logo Section */}
            <div className="flex items-center justify-center gap-6">
              <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl font-bold text-blue-600">V</span>
              </div>

              <RefreshCw className="w-6 h-6 text-gray-400" />

              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center">
                <MessageSquare className="w-8 h-8 text-white" />
              </div>
            </div>

            {/* Warning Message */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
              <p className="text-sm text-gray-700">
                Zalo OA yêu cầu bạn phải mua gói{' '}
                <strong className="text-yellow-800">OA Nâng cao</strong> hoặc{' '}
                <strong className="text-yellow-800">OA Premium</strong>{' '}
                để có thể kết nối với Vilead CRM
              </p>
            </div>

            <div className="text-center text-sm text-gray-500">
              Bằng việc thao tác, bạn đã cấp quyền để Vilead truy cập và quản trị Zalo OA của bạn.
            </div>
          </div>

          <DialogFooter className="flex-col sm:flex-col gap-2">
            <Button
              className="w-full bg-blue-500 hover:bg-blue-600 text-white"
              onClick={() => {
                setShowOALinkModal(false)
                alert('Tích hợp API kết nối Zalo OA chưa được thiết lập!')
              }}
            >
              Truy cập trang cấp quyền
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setShowOALinkModal(false)}
            >
              Hủy
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
