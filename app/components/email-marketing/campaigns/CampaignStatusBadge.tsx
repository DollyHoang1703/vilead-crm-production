'use client';

import React from 'react';
import { CampaignStatus } from '../types';
import { CAMPAIGN_STATUS_CONFIG } from '../mockData';

interface CampaignStatusBadgeProps {
  status: CampaignStatus;
  size?: 'sm' | 'md';
  showLabel?: boolean;
}

export function CampaignStatusBadge({ 
  status, 
  size = 'md',
  showLabel = true 
}: CampaignStatusBadgeProps) {
  const config = CAMPAIGN_STATUS_CONFIG[status];
  const isRunning = status === 'running';

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-1'
  };

  return (
    <span
      className={`
        inline-flex items-center gap-1.5 rounded-full font-medium
        ${sizeClasses[size]}
        ${config.bgColor} ${config.textColor}
      `}
    >
      {/* Pulse dot for running status */}
      {isRunning && (
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
        </span>
      )}
      
      {showLabel && config.label}
    </span>
  );
}

// Export a simpler inline dot indicator for table rows
export function CampaignStatusDot({ status }: { status: CampaignStatus }) {
  const config = CAMPAIGN_STATUS_CONFIG[status];
  const isRunning = status === 'running';

  const dotColors: Record<CampaignStatus, string> = {
    draft: 'bg-gray-400',
    scheduled: 'bg-yellow-400',
    running: 'bg-blue-500',
    paused: 'bg-orange-400',
    sent: 'bg-green-500',
    cancelled: 'bg-red-400'
  };

  return (
    <span className="relative flex h-2.5 w-2.5" title={config.label}>
      {isRunning && (
        <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${dotColors[status]} opacity-75`}></span>
      )}
      <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${dotColors[status]}`}></span>
    </span>
  );
}
