'use client';

import React, { useState } from 'react';
import {
  MoreHorizontal,
  Edit,
  Play,
  Pause,
  StopCircle,
  Copy,
  Trash2,
  BarChart2,
  Eye,
  Calendar,
  Users,
  Mail,
  ChevronDown,
  ArrowUpDown
} from 'lucide-react';
import { Campaign, CampaignStatus } from '../types';
import { CampaignStatusBadge } from './CampaignStatusBadge';
import { formatDateTime } from '../utils';

interface CampaignTableProps {
  campaigns: Campaign[];
  loading: boolean;
  onEdit: (campaign: Campaign) => void;
  onStart: (campaign: Campaign) => void;
  onPause: (campaign: Campaign) => void;
  onResume: (campaign: Campaign) => void;
  onCancel: (campaign: Campaign) => void;
  onClone: (campaign: Campaign) => void;
  onDelete: (campaign: Campaign) => void;
  onViewStats: (campaign: Campaign) => void;
}

type SortField = 'name' | 'created_at' | 'scheduled_at' | 'recipient_count' | 'stats';
type SortOrder = 'asc' | 'desc';

export function CampaignTable({
  campaigns,
  loading,
  onEdit,
  onStart,
  onPause,
  onResume,
  onCancel,
  onClone,
  onDelete,
  onViewStats
}: CampaignTableProps) {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [sortField, setSortField] = useState<SortField>('created_at');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  // Sort campaigns
  const sortedCampaigns = [...campaigns].sort((a, b) => {
    let comparison = 0;
    switch (sortField) {
      case 'name':
        comparison = a.name.localeCompare(b.name);
        break;
      case 'created_at':
        comparison = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        break;
      case 'scheduled_at':
        const aTime = a.scheduled_at ? new Date(a.scheduled_at).getTime() : 0;
        const bTime = b.scheduled_at ? new Date(b.scheduled_at).getTime() : 0;
        comparison = aTime - bTime;
        break;
      case 'recipient_count':
        comparison = a.recipient_count - b.recipient_count;
        break;
      case 'stats':
        comparison = a.stats.open_rate - b.stats.open_rate;
        break;
    }
    return sortOrder === 'asc' ? comparison : -comparison;
  });

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const toggleDropdown = (id: string) => {
    setOpenDropdown(prev => prev === id ? null : id);
  };

  // Get actions based on campaign status
  const getActions = (campaign: Campaign) => {
    const actions: Array<{
      label: string;
      icon: React.ReactNode;
      onClick: () => void;
      variant?: 'default' | 'danger';
      disabled?: boolean;
    }> = [];

    switch (campaign.status) {
      case 'draft':
        actions.push(
          { label: 'Chỉnh sửa', icon: <Edit className="w-4 h-4" />, onClick: () => onEdit(campaign) },
          { label: 'Bắt đầu gửi', icon: <Play className="w-4 h-4" />, onClick: () => onStart(campaign) },
          { label: 'Tạo bản sao', icon: <Copy className="w-4 h-4" />, onClick: () => onClone(campaign) },
          { label: 'Xóa', icon: <Trash2 className="w-4 h-4" />, onClick: () => onDelete(campaign), variant: 'danger' }
        );
        break;

      case 'scheduled':
        actions.push(
          { label: 'Chỉnh sửa', icon: <Edit className="w-4 h-4" />, onClick: () => onEdit(campaign) },
          { label: 'Hủy lịch gửi', icon: <StopCircle className="w-4 h-4" />, onClick: () => onCancel(campaign), variant: 'danger' },
          { label: 'Tạo bản sao', icon: <Copy className="w-4 h-4" />, onClick: () => onClone(campaign) }
        );
        break;

      case 'running':
        actions.push(
          { label: 'Xem tiến trình', icon: <BarChart2 className="w-4 h-4" />, onClick: () => onViewStats(campaign) },
          { label: 'Tạm dừng', icon: <Pause className="w-4 h-4" />, onClick: () => onPause(campaign) }
        );
        break;

      case 'paused':
        actions.push(
          { label: 'Tiếp tục gửi', icon: <Play className="w-4 h-4" />, onClick: () => onResume(campaign) },
          { label: 'Xem tiến trình', icon: <BarChart2 className="w-4 h-4" />, onClick: () => onViewStats(campaign) },
          { label: 'Tạo bản sao', icon: <Copy className="w-4 h-4" />, onClick: () => onClone(campaign) }
        );
        break;

      case 'sent':
        actions.push(
          { label: 'Xem báo cáo', icon: <BarChart2 className="w-4 h-4" />, onClick: () => onViewStats(campaign) },
          { label: 'Tạo bản sao', icon: <Copy className="w-4 h-4" />, onClick: () => onClone(campaign) },
          { label: 'Xóa', icon: <Trash2 className="w-4 h-4" />, onClick: () => onDelete(campaign), variant: 'danger' }
        );
        break;

      case 'cancelled':
        actions.push(
          { label: 'Tạo bản sao', icon: <Copy className="w-4 h-4" />, onClick: () => onClone(campaign) },
          { label: 'Xóa', icon: <Trash2 className="w-4 h-4" />, onClick: () => onDelete(campaign), variant: 'danger' }
        );
        break;
    }

    return actions;
  };

  const formatStats = (campaign: Campaign) => {
    if (campaign.status === 'draft' || campaign.status === 'scheduled') {
      return '-';
    }
    
    const stats = campaign.stats;
    return `${stats.total_sent}/${campaign.valid_email_count} gửi • ${stats.open_rate.toFixed(1)}% mở`;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="animate-pulse p-8">
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="flex gap-4">
                <div className="h-4 bg-gray-200 rounded flex-1"></div>
                <div className="h-4 bg-gray-200 rounded w-24"></div>
                <div className="h-4 bg-gray-200 rounded w-32"></div>
                <div className="h-4 bg-gray-200 rounded w-20"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (campaigns.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
        <Mail className="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có chiến dịch nào</h3>
        <p className="text-gray-500">Bắt đầu bằng cách tạo chiến dịch email mới</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">
                <button
                  onClick={() => handleSort('name')}
                  className="flex items-center gap-1 hover:text-gray-900"
                >
                  Tên chiến dịch
                  <ArrowUpDown className="w-4 h-4" />
                </button>
              </th>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Trạng thái</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">
                <button
                  onClick={() => handleSort('recipient_count')}
                  className="flex items-center gap-1 hover:text-gray-900"
                >
                  Người nhận
                  <ArrowUpDown className="w-4 h-4" />
                </button>
              </th>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">
                <button
                  onClick={() => handleSort('scheduled_at')}
                  className="flex items-center gap-1 hover:text-gray-900"
                >
                  Thời gian gửi
                  <ArrowUpDown className="w-4 h-4" />
                </button>
              </th>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">
                <button
                  onClick={() => handleSort('stats')}
                  className="flex items-center gap-1 hover:text-gray-900"
                >
                  Thống kê
                  <ArrowUpDown className="w-4 h-4" />
                </button>
              </th>
              <th className="text-right px-4 py-3 text-sm font-medium text-gray-600 w-16"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {sortedCampaigns.map(campaign => {
              const actions = getActions(campaign);
              
              return (
                <tr key={campaign.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex flex-col">
                      <span className="font-medium text-gray-900">{campaign.name}</span>
                      <span className="text-sm text-gray-500 truncate max-w-xs">
                        {campaign.subject || 'Chưa có tiêu đề'}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <CampaignStatusBadge status={campaign.status} size="sm" />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1 text-gray-600">
                      <Users className="w-4 h-4" />
                      <span>{campaign.valid_email_count.toLocaleString()}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {campaign.scheduled_at ? (
                      <div className="flex items-center gap-1 text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span className="text-sm">{formatDateTime(campaign.scheduled_at)}</span>
                      </div>
                    ) : campaign.started_at ? (
                      <div className="flex items-center gap-1 text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span className="text-sm">{formatDateTime(campaign.started_at)}</span>
                      </div>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {formatStats(campaign)}
                  </td>
                  <td className="px-4 py-3 text-right relative">
                    <button
                      onClick={() => toggleDropdown(campaign.id)}
                      className="p-1.5 rounded-md hover:bg-gray-100 transition-colors"
                    >
                      <MoreHorizontal className="w-5 h-5 text-gray-500" />
                    </button>
                    
                    {/* Dropdown menu */}
                    {openDropdown === campaign.id && (
                      <>
                        <div
                          className="fixed inset-0 z-10"
                          onClick={() => setOpenDropdown(null)}
                        />
                        <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
                          {actions.map((action, index) => (
                            <button
                              key={index}
                              onClick={() => {
                                setOpenDropdown(null);
                                action.onClick();
                              }}
                              disabled={action.disabled}
                              className={`
                                w-full flex items-center gap-2 px-3 py-2 text-sm
                                ${action.variant === 'danger' 
                                  ? 'text-red-600 hover:bg-red-50' 
                                  : 'text-gray-700 hover:bg-gray-50'
                                }
                                ${action.disabled ? 'opacity-50 cursor-not-allowed' : ''}
                                transition-colors
                              `}
                            >
                              {action.icon}
                              {action.label}
                            </button>
                          ))}
                        </div>
                      </>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
