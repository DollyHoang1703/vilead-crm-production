export interface Lead {
  id: number
  name: string
  phone: string
  email: string
  source: string
  region: string
  product: string
  tags: string[]
  content: string
  status: 'new' | 'contacted' | 'qualified' | 'proposal' | 'negotiation' | 'converted' | 'lost'
  stage: string
  notes: string
  assignedTo: string
  value: number
  lastContactedAt: string | null
  createdAt: string
  updatedAt: string
  type: 'lead'
  company?: string
  position?: string
  nextAction: string
  nextActionDate: string
  careCount?: number
  assignee?: string
  department?: string
  team?: string
  lastContact?: string
  interactions?: number
  priority?: string
  interestedProducts?: string[]
  quickNotes?: Array<{
    content: string
    timestamp: string
    author: string
  }>
  address?: string
  customerType: 'individual' | 'business'
  winProbability?: number
  interactionCount: number
  lastInteractionAt: string | null
  files?: Array<{
    name: string
    size: string
    type: string
    uploadedAt: string
  }>
  discountPercent?: number
  originalValue?: number
}

export interface ColumnVisibility {
  checkbox: boolean
  stt: boolean
  customerName: boolean
  phone: boolean
  email: boolean
  company: boolean
  address: boolean
  source: boolean
  region: boolean
  stage: boolean
  product: boolean
  customerType: boolean
  salesOwner: boolean
  tags: boolean
  notes: boolean
  files: boolean
  createdDate: boolean
  lastModified: boolean
  interactionCount: boolean
  lastInteraction: boolean
  actions: boolean
}

export interface ColumnConfig {
  key: keyof ColumnVisibility
  label: string
  icon?: string
  width?: string
  minWidth?: string
  sticky?: 'left' | 'right'
  align?: 'left' | 'center' | 'right'
  defaultVisible: boolean
  sortable?: boolean
}

export type LeadStatus = Lead['status']

export const LEAD_STATUS_CONFIG: Record<LeadStatus, {
  label: string
  bgColor: string
  textColor: string
  icon: string
}> = {
  new: {
    label: 'Lead m\u1edbi',
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-600',
    icon: '\ud83c\udd95'
  },
  contacted: {
    label: '\u0110ang t\u01b0 v\u1ea5n',
    bgColor: 'bg-yellow-50',
    textColor: 'text-yellow-600',
    icon: '\ud83d\udcde'
  },
  qualified: {
    label: '\u0110\u00e3 g\u1eedi \u0110X',
    bgColor: 'bg-purple-50',
    textColor: 'text-purple-600',
    icon: '\ud83d\udcdd'
  },
  proposal: {
    label: '\u0110\u00e0m ph\u00e1n',
    bgColor: 'bg-orange-50',
    textColor: 'text-orange-600',
    icon: '\ud83e\udd1d'
  },
  negotiation: {
    label: 'Ch\u1edd thanh to\u00e1n',
    bgColor: 'bg-indigo-50',
    textColor: 'text-indigo-600',
    icon: '\ud83d\udcb0'
  },
  converted: {
    label: '\u0110\u00e3 ch\u1ed1t',
    bgColor: 'bg-green-50',
    textColor: 'text-green-600',
    icon: '\u2705'
  },
  lost: {
    label: 'Th\u1ea5t b\u1ea1i',
    bgColor: 'bg-red-50',
    textColor: 'text-red-600',
    icon: '\u274c'
  }
}

export const SOURCE_CONFIG: Record<string, {
  label: string
  bgColor: string
  textColor: string
  icon: string
}> = {
  facebook: {
    label: 'Facebook',
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-600',
    icon: '\ud83d\udc65'
  },
  google: {
    label: 'Google',
    bgColor: 'bg-red-50',
    textColor: 'text-red-600',
    icon: '\ud83d\udd0d'
  },
  website: {
    label: 'Website',
    bgColor: 'bg-green-50',
    textColor: 'text-green-600',
    icon: '\ud83c\udf10'
  },
  zalo: {
    label: 'Zalo',
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-600',
    icon: '\ud83d\udcac'
  },
  linkedin: {
    label: 'LinkedIn',
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-600',
    icon: '\ud83d\udcbc'
  },
  referral: {
    label: 'Referral',
    bgColor: 'bg-purple-50',
    textColor: 'text-purple-600',
    icon: '\ud83d\udc64'
  }
}

export const TAG_CONFIG: Record<string, {
  label: string
  bgColor: string
  textColor: string
}> = {
  hot: {
    label: 'Hot',
    bgColor: 'bg-red-50',
    textColor: 'text-red-600'
  },
  warm: {
    label: 'Warm',
    bgColor: 'bg-yellow-50',
    textColor: 'text-yellow-600'
  },
  cold: {
    label: 'Cold',
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-600'
  },
  enterprise: {
    label: 'Enterprise',
    bgColor: 'bg-purple-50',
    textColor: 'text-purple-600'
  },
  sme: {
    label: 'SME',
    bgColor: 'bg-green-50',
    textColor: 'text-green-600'
  }
}

export const REGION_CONFIG: Record<string, string> = {
  ha_noi: 'H\u00e0 N\u1ed9i',
  ho_chi_minh: 'TP.HCM',
  da_nang: '\u0110\u00e0 N\u1eb5ng',
  can_tho: 'C\u1ea7n Th\u01a1',
  hai_phong: 'H\u1ea3i Ph\u00f2ng'
}
