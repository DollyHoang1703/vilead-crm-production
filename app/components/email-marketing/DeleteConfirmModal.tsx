'use client'

import React, { useState } from 'react'
import { X, AlertTriangle } from 'lucide-react'
import { SenderEmail } from './types'

interface DeleteConfirmModalProps {
  open: boolean
  onClose: () => void
  email: SenderEmail | null
  onConfirm: (id: string) => Promise<{ success: boolean; message: string }>
}

export default function DeleteConfirmModal({ open, onClose, email, onConfirm }: DeleteConfirmModalProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleDelete = async () => {
    if (!email) return
    
    setIsDeleting(true)
    setError(null)
    
    const result = await onConfirm(email.id)
    
    if (!result.success) {
      setError(result.message)
      setIsDeleting(false)
    }
  }

  if (!open || !email) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Xác nhận xóa</h3>
          <button 
            onClick={onClose} 
            className="p-1 hover:bg-gray-100 rounded transition-colors"
            disabled={isDeleting}
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
            <p className="text-gray-700 mb-2">
              Bạn có chắc chắn muốn xóa email
            </p>
            <p className="text-lg font-semibold text-gray-900 mb-2">
              {email.email}
            </p>
            <p className="text-sm text-gray-500">
              Hành động này không thể hoàn tác.
            </p>

            {error && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-700 flex items-center justify-center">
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  {error}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-4 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
            disabled={isDeleting}
          >
            Hủy
          </button>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {isDeleting ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Đang xóa...
              </>
            ) : (
              'Xóa'
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
