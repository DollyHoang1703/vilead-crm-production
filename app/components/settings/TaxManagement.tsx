import React, { useState } from 'react'
import { Plus, Edit2, Trash2 } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'

export interface TaxRate {
  id: string;
  name: string;
  description: string;
  rate: number;
  isActive: boolean;
}

export const defaultTaxes: TaxRate[] = [
  { id: 'vat-10', name: 'VAT 10%', description: 'Thuế giá trị gia tăng quy định mặc định', rate: 10, isActive: true },
  { id: 'vat-8', name: 'VAT 8%', description: 'Thuế giá trị gia tăng ưu đãi', rate: 8, isActive: true },
  { id: 'vat-0', name: 'VAT 0%', description: 'Không chịu thuế', rate: 0, isActive: false }
];

export default function TaxManagement() {
  const [taxes, setTaxes] = useState<TaxRate[]>(defaultTaxes);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [taxToDelete, setTaxToDelete] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({ id: '', name: '', description: '', rate: 0 });

  const handleAdd = () => {
    const newTax: TaxRate = {
      id: `tax_${Date.now()}`,
      name: formData.name,
      description: formData.description,
      rate: Number(formData.rate),
      isActive: true
    };
    setTaxes([...taxes, newTax]);
    setShowAddModal(false);
  }

  const handleEdit = () => {
    setTaxes(taxes.map(t => t.id === formData.id ? { ...t, name: formData.name, description: formData.description, rate: Number(formData.rate) } : t));
    setShowEditModal(false);
  }

  const handleDelete = () => {
    if (taxToDelete) {
      setTaxes(taxes.filter(t => t.id !== taxToDelete));
      setShowDeleteModal(false);
      setTaxToDelete(null);
    }
  }

  const toggleActive = (id: string) => {
    setTaxes(taxes.map(t => t.id === id ? { ...t, isActive: !t.isActive } : t));
  }

  const openEdit = (tax: TaxRate) => {
    setFormData({ id: tax.id, name: tax.name, description: tax.description, rate: tax.rate });
    setShowEditModal(true);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Button size="sm" onClick={() => {
          setFormData({ id: '', name: '', description: '', rate: 0 });
          setShowAddModal(true);
        }}>
          <Plus className="w-3.5 h-3.5 mr-1.5" />
          Thêm mức thuế
        </Button>
      </div>

      <Card>
        <CardContent className="pt-4">
          <div className="space-y-2">
            {taxes.map((tax) => (
              <div key={tax.id} className="flex items-center justify-between px-3 py-2.5 border rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-xs font-semibold text-blue-600">
                    {tax.rate}%
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">{tax.name}</h4>
                    <p className="text-xs text-gray-500">{tax.description}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch className="scale-90" checked={tax.isActive} onCheckedChange={() => toggleActive(tax.id)} />
                  <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => openEdit(tax)}>
                    <Edit2 className="w-3.5 h-3.5" />
                  </Button>
                  <Button variant="outline" size="icon" className="h-7 w-7 text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => { setTaxToDelete(tax.id); setShowDeleteModal(true); }}>
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            ))}
            {taxes.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                Chưa có mức thuế nào được cấu hình.
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Modal Thêm mức thuế */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Thêm mức thuế mới</DialogTitle>
            <DialogDescription>Nhập thông tin cho mức thuế mới.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4 px-6">
            <div className="space-y-2">
              <Label htmlFor="name">Tiêu đề</Label>
              <Input id="name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="VD: VAT 10%" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="rate">Mức thuế (%)</Label>
              <Input id="rate" type="number" min="0" max="100" value={formData.rate} onChange={(e) => setFormData({...formData, rate: Number(e.target.value)})} placeholder="10" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Ghi chú</Label>
              <Textarea id="description" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} placeholder="Mô tả mức thuế..." className="resize-none" />
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setShowAddModal(false)}>Hủy</Button>
            <Button onClick={handleAdd} disabled={!formData.name}>Lưu lại</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal Sửa mức thuế */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa mức thuế</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4 px-6">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Tiêu đề</Label>
              <Input id="edit-name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="VD: VAT 10%" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-rate">Mức thuế (%)</Label>
              <Input id="edit-rate" type="number" min="0" max="100" value={formData.rate} onChange={(e) => setFormData({...formData, rate: Number(e.target.value)})} placeholder="10" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">Ghi chú</Label>
              <Textarea id="edit-description" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} placeholder="Mô tả mức thuế..." className="resize-none" />
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setShowEditModal(false)}>Hủy</Button>
            <Button onClick={handleEdit} disabled={!formData.name}>Cập nhật</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal Xóa mức thuế */}
      <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Xác nhận xóa</DialogTitle>
          </DialogHeader>
          <div className="py-4 px-6 text-sm text-gray-600">
            Bạn có chắc chắn muốn xóa mức thuế này không? Hành động này không thể hoàn tác.
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setShowDeleteModal(false)}>Hủy</Button>
            <Button variant="destructive" onClick={handleDelete}>Xóa bỏ</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
