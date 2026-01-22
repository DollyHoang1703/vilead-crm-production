# ViLead CRM - Design System & Style Guidelines

> **Mục đích**: Document này định nghĩa toàn bộ quy tắc thiết kế giao diện cho ViLead CRM System. Tất cả components và features mới phải tuân thủ các quy tắc này để đảm bảo tính nhất quán.

## 📋 Mục lục
- [Color Palette](#color-palette)
- [Typography](#typography)
- [Spacing & Layout](#spacing--layout)
- [Component Patterns](#component-patterns)
- [Interactive States](#interactive-states)
- [Icons & Images](#icons--images)
- [Form Elements](#form-elements)
- [Modal & Dialog](#modal--dialog)

---

## 🎨 Color Palette

### Primary Colors
```css
/* Blue - Primary Brand Color */
bg-blue-50    /* Lightest blue background */
bg-blue-100   /* Light blue background */
bg-blue-500   /* Primary blue (buttons, accents) */
bg-blue-600   /* Primary blue hover state */
bg-blue-700   /* Dark blue */

text-blue-500  /* Primary blue text */
text-blue-600  /* Blue text hover */
text-blue-700  /* Dark blue text */

border-blue-200  /* Light blue border */
border-blue-500  /* Primary blue border */
border-blue-600  /* Active state border */
```

### Secondary Colors
```css
/* Gray - Neutral Colors */
bg-gray-50     /* Lightest background */
bg-gray-100    /* Light background, hover states */
bg-gray-200    /* Borders, dividers */
text-gray-400  /* Placeholder, disabled text */
text-gray-500  /* Secondary text, timestamps */
text-gray-600  /* Secondary text */
text-gray-700  /* Body text */
text-gray-900  /* Primary text, headings */
border-gray-100  /* Subtle borders */
border-gray-200  /* Standard borders */
border-gray-300  /* Input borders */
```

### Status Colors
```css
/* Success - Green */
bg-green-50    /* Success background */
bg-green-100   /* Light success background */
bg-green-500   /* Success indicator (active dots) */
bg-green-600   /* Success button */
text-green-600  /* Success text */
text-green-700  /* Dark success text */
border-green-200  /* Success border */
border-green-300  /* Success border variant */

/* Warning - Yellow */
bg-yellow-50
bg-yellow-100
text-yellow-600
text-yellow-700
border-yellow-200
border-yellow-300

/* Error - Red */
bg-red-50
bg-red-100
bg-red-500     /* Error badges, notifications */
text-red-500
text-red-600
text-red-700
border-red-200
border-red-300

/* Info - Purple */
bg-purple-50
bg-purple-100
text-purple-600
text-purple-700
border-purple-200
border-purple-300

/* Additional - Orange */
bg-orange-100
text-orange-700
border-orange-300

/* Additional - Indigo */
bg-indigo-50
bg-indigo-100
text-indigo-700
```

### Background Colors
```css
bg-white       /* Card backgrounds, panels */
bg-gray-50     /* Subtle backgrounds */
bg-blue-50     /* Selected/active item background */

/* Gradient Backgrounds - Quy tắc chung */
/* Pattern 1: Horizontal (Cards/Sections) */
bg-gradient-to-r from-[color]-50 to-[color]-100    /* Soft gradient */
bg-gradient-to-r from-[color]-50 to-[othercolor]-50  /* Two-color blend */

/* Pattern 2: Diagonal (Dashboard/Hero Cards) */
bg-gradient-to-br from-[color]-50 to-white         /* Depth effect */

/* Pattern 3: Icon/Avatar (Solid) */
bg-gradient-to-r from-[color]-400 to-[color]-600   /* Bold gradient */

/* Ví dụ: blue, green, yellow, purple, orange, red, pink, amber, indigo */
```

---

## 📝 Typography

### Font Sizes
```css
text-xs        /* 12px - Labels, badges, timestamps, helper text */
text-sm        /* 14px - Body text, secondary content */
text-base      /* 16px - Primary body text, headings */
text-lg        /* 18px - Section headings */
text-xl        /* 20px - Page titles (rarely used) */
```

### Font Weights
```css
font-medium    /* 500 - Emphasized text, labels */
font-semibold  /* 600 - Headings, important labels */
font-bold      /* 700 - Primary headings (rare) */
```

### Text Colors
```css
/* Primary Text */
text-gray-900  /* Main headings, primary content */
text-gray-700  /* Body text */
text-gray-600  /* Secondary text */
text-gray-500  /* Tertiary text, timestamps */
text-gray-400  /* Placeholder, disabled */

/* Colored Text */
text-blue-500  /* Links, primary actions */
text-blue-600  /* Active links */
text-green-600 /* Success messages */
text-red-500   /* Error messages */
```

### Text Utilities
```css
truncate       /* Single line with ellipsis */
whitespace-nowrap  /* Prevent text wrapping */
uppercase      /* Section headers (rare) */
```

---

## 📐 Spacing & Layout

### Padding Standards
```css
/* Component Padding */
p-2     /* 8px - Tight spacing, small badges */
p-3     /* 12px - Standard list items, cards */
p-4     /* 16px - Standard panels, sections */
p-6     /* 24px - Large sections, modal content */

/* Directional Padding */
px-2    /* Horizontal: badges, small buttons */
px-3    /* Horizontal: standard buttons, inputs */
px-4    /* Horizontal: panels, cards */
px-6    /* Horizontal: wide sections */

py-1    /* Vertical: badges */
py-2    /* Vertical: buttons, inputs */
py-3    /* Vertical: list items */
py-4    /* Vertical: sections */
```

### Margin Standards
```css
/* Bottom Margins (most common) */
mb-1    /* 4px - Tight spacing */
mb-2    /* 8px - Close elements */
mb-3    /* 12px - Standard spacing */
mb-4    /* 16px - Section spacing */
mb-6    /* 24px - Large section gaps */

/* Gap (Flexbox/Grid) */
gap-1   /* 4px - Tight icon spacing */
gap-2   /* 8px - Standard icon/text spacing */
gap-3   /* 12px - Component spacing */
```

### Border Radius
```css
rounded        /* 4px - Standard inputs, cards */
rounded-md     /* 6px - Buttons, panels */
rounded-lg     /* 8px - Large cards, modals */
rounded-xl     /* 12px - Pipeline cards, feature cards */
rounded-2xl    /* 16px - Hero cards, dashboard cards */
rounded-full   /* 9999px - Badges, avatars, pills */
```

### Borders
```css
/* Border Widths */
border         /* 1px standard */
border-2       /* 2px emphasized */
border-4       /* 4px accent (left border on selected items) */

/* Border Positions */
border-b       /* Bottom only */
border-r       /* Right only (panel dividers) */
border-l       /* Left only (selected state) */
border-t       /* Top only (footers) */

/* Border Colors - see Color Palette section */
border-gray-100  /* Subtle dividers */
border-gray-200  /* Standard dividers */
border-gray-300  /* Input borders */
border-blue-500  /* Selected state */
```

### Layout Patterns
```css
/* Grid System */
grid grid-cols-12 gap-0  /* Main layout grid */
col-span-3       /* Left panel (25%) */
col-span-6       /* Center content (50%) */
col-span-3       /* Right panel (25%) */

/* Flexbox Patterns */
flex items-center justify-between  /* Header rows */
flex items-start gap-3             /* List items with avatars */
flex flex-col                      /* Vertical stacking */
flex-1                            /* Fill available space */
flex-shrink-0                     /* Prevent shrinking */
min-w-0                           /* Enable truncation in flex */
```

### Height & Width
```css
/* Common Heights: h-5, h-8, h-9, h-10, h-11, h-12 */
/* Common Widths: w-3, w-4, w-5, w-6, w-10, w-12 */
/* Use w-full for 100% width, max-w-[Xpx] for constraints */
```

---

## 🎯 Visual Effects & Shadows

### Shadows
```css
shadow-none    /* Flat elements */
shadow-sm      /* Subtle depth - input fields, small cards */
shadow         /* Standard depth - default cards */
shadow-md      /* Medium depth - hover states, modal cards */
shadow-lg      /* Large depth - popovers, important cards */
shadow-xl      /* Extra large - modals, dialogs */

/* Interactive Shadow States */
hover:shadow-md   /* Card hover effect */
hover:shadow-lg   /* Button hover effect */
active:shadow-sm  /* Pressed state */
```

### Ring Utilities (Focus & Selection States)
```css
ring-1 ring-gray-200        /* Subtle outline */
ring-2 ring-blue-500        /* Focus state */
ring-2 ring-blue-200        /* Selected state (blue) */
ring-2 ring-green-200       /* Selected state (green) */
ring-2 ring-yellow-200      /* Selected state (yellow) */
ring-2 ring-red-200         /* Selected state (red) */
ring-offset-2               /* Spacing between element and ring */

/* Interactive Ring States */
focus:ring-2 focus:ring-blue-500  /* Input focus */
hover:ring-2 hover:ring-blue-200  /* Hoverable cards */
```

### Transform Effects
```css
hover:scale-105         /* Slight zoom on hover */
hover:scale-102         /* Subtle zoom */
active:scale-95         /* Press effect */
hover:-translate-y-1    /* Lift effect */
```

---

## 🧩 Component Patterns

### Buttons

#### Primary Button
```tsx
<Button className="bg-blue-500 hover:bg-blue-600 text-white text-xs h-8 px-3 rounded-md">
  Action
</Button>
```

#### Secondary Button (Outline)
```tsx
<Button variant="outline" className="border-gray-300 hover:bg-gray-100 text-gray-700 text-xs h-9 px-3 rounded-md">
  Cancel
</Button>
```

#### Ghost Button (Icon Button)
```tsx
<Button variant="ghost" size="sm" className="h-9 w-9 p-0 rounded-full hover:bg-gray-100">
  <Icon className="w-4 h-4 text-gray-600" />
</Button>
```

#### Small Button
```tsx
<Button size="sm" className="h-8 text-xs px-3">
  Small Action
</Button>
```

### Badges

#### Status Badge
```tsx
<Badge className="text-xs px-2 py-0.5 h-5 bg-green-100 text-green-700 border-green-300">
  Khách hàng
</Badge>
```

#### Count Badge (Notification)
```tsx
<Badge className="bg-red-500 text-white text-xs h-5 px-2 rounded-full">
  99+
</Badge>
```

#### Tag/Label Badge
```tsx
<Badge variant="outline" className="text-xs py-0 h-5 bg-gray-50">
  <Tag className="w-3 h-3 mr-1" />
  Lead mới
</Badge>
```

### Cards

#### Standard Card
```tsx
<div className="border border-gray-200 rounded-lg overflow-hidden">
  <div className="px-4 py-3 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
    <h4 className="font-semibold text-sm text-gray-900">Card Title</h4>
  </div>
  <div className="p-4">
    {/* Content */}
  </div>
</div>
```

#### List Item Card
```tsx
<div className="p-3 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors">
  <div className="flex items-start gap-3">
    {/* Content */}
  </div>
</div>
```

#### Selected List Item
```tsx
<div className="p-3 border-b border-gray-100 bg-blue-50 border-l-4 border-l-blue-600">
  {/* Content */}
</div>
```

#### Metric Card Pattern (Pipeline/KPI/Dashboard)
```tsx
/* Quy tắc chung cho tất cả metric cards: */
<div className="bg-gradient-to-r from-[color]-50 to-[color]-100 rounded-lg p-3 border border-[color]-200 
              hover:shadow-md transition-all duration-200">
  <div>{/* Icon + Badge */}</div>
  <p className="text-lg font-bold text-[color]-900">{value}</p>
  <p className="text-xs text-[color]-600">{label}</p>
</div>

/* Selected state: thêm ring-2 ring-[color]-200 + shadow-md */
/* Dashboard variant: dùng bg-gradient-to-br from-[color]-50 to-white */
```

### Avatars

#### Standard Avatar
```tsx
<Avatar className="w-12 h-12">
  <AvatarImage src={avatarUrl} />
  <AvatarFallback className="bg-blue-500 text-white text-sm">
    AB
  </AvatarFallback>
</Avatar>
```

#### Avatar with Status Indicator
```tsx
<div className="relative">
  <Avatar className="w-12 h-12">
    <AvatarImage src={avatarUrl} />
    <AvatarFallback className="bg-blue-500 text-white">AB</AvatarFallback>
  </Avatar>
  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
</div>
```

### Input Fields

#### Standard Input
```tsx
<Input
  placeholder="Placeholder text..."
  className="pl-10 bg-white border-gray-300 text-sm h-9"
/>
```

#### Input with Icon
```tsx
<div className="relative">
  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
  <Input
    placeholder="Tìm kiếm..."
    className="pl-10 bg-white border-gray-300 text-sm h-9"
  />
</div>
```

#### Input with Clear Button
```tsx
<div className="relative">
  <Input placeholder="Search..." className="pr-16" />
  <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
    {value && (
      <button onClick={handleClear} className="p-1 hover:bg-gray-100 rounded">
        <X className="w-4 h-4 text-gray-400" />
      </button>
    )}
    <Search className="w-4 h-4 text-gray-400" />
  </div>
</div>
```

### Tabs

#### Standard Tabs
```tsx
<div className="flex border-b border-gray-200">
  <button
    className={cn(
      "px-4 py-2 text-sm font-medium border-b-2 transition-colors",
      isActive 
        ? "border-blue-500 text-blue-600"
        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
    )}
  >
    Tab Name
  </button>
</div>
```

#### Icon Tabs
```tsx
<button className={cn(
  "px-4 py-3 text-xs font-medium transition-colors relative",
  isActive
    ? "text-blue-500 border-b-2 border-blue-500"
    : "text-gray-900 hover:text-blue-500"
)}>
  <Icon className="w-4 h-4" />
  Tab Name
</button>
```

### Dropdown Menu

#### Standard Dropdown
```tsx
<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button>Menu</Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent align="end" className="w-48">
    <div className="px-2 py-1.5 text-xs font-semibold text-gray-500 uppercase">
      Section Header
    </div>
    <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
      <Icon className="w-4 h-4" />
      <span className="flex-1 text-sm">Menu Item</span>
    </DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

---

## ⚡ Interactive States

### Hover States
```css
/* Buttons */
hover:bg-blue-600      /* Primary button hover */
hover:bg-gray-100      /* Ghost/outline button hover */
hover:bg-gray-50       /* List item hover */
hover:opacity-80       /* Badge/tag hover */

/* Text Links */
hover:text-blue-600    /* Link hover */
hover:text-gray-700    /* Secondary text hover */

/* Borders */
hover:border-gray-300  /* Input focus border */

/* Shadows */
hover:shadow-md        /* Card lift effect */
hover:shadow-lg        /* Button emphasis */

/* Transforms */
hover:scale-105        /* Slight zoom */
hover:-translate-y-1   /* Lift animation */
```

### Active/Selected States
```css
/* Selected List Items */
bg-blue-50             /* Light blue background */
border-l-4 border-l-blue-600  /* Left accent border */

/* Active Tabs */
border-b-2 border-blue-500    /* Bottom border */
text-blue-600                  /* Active text color */

/* Active Buttons */
bg-blue-500            /* Active button background */
text-white             /* Active button text */
```

### Focus States
```css
focus:outline-none
focus:ring-2 focus:ring-ring focus:ring-offset-2
focus-visible:outline-none
focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
```

### Disabled States
```css
disabled:cursor-not-allowed
disabled:opacity-50
text-gray-400          /* Disabled text */
```

### Animation Effects
```css
/* Loading/Spin */
animate-spin           /* Continuous rotation - loading indicators (RefreshCw icon) */

/* Fade In */
animate-fade-in        /* Fade in animation - notifications, toasts */

/* Pulse */
animate-pulse          /* Pulsing effect - status indicators */

/* Bounce */
animate-bounce         /* Bounce effect - alerts */
```

### Transition Effects
```css
transition-colors      /* Standard transitions (color, background, border) */
transition-all         /* Full transitions (all properties) */
transition-opacity     /* Opacity only */
transition-shadow      /* Shadow transitions */
transition-transform   /* Transform transitions */

/* Duration */
duration-75            /* Extra fast - 75ms */
duration-100           /* Fast - 100ms */
duration-150           /* Quick - 150ms */
duration-200           /* Standard - 200ms (most common) */
duration-300           /* Medium - 300ms */
duration-500           /* Slow - 500ms */

/* Timing Functions */
ease-in-out            /* Standard easing */
ease-out               /* Deceleration */
ease-in                /* Acceleration */
```

### Cursor Styles
```css
cursor-pointer         /* Interactive elements */
cursor-help            /* Help/info icons */
cursor-not-allowed     /* Disabled elements */
```

---

## 🎭 Icons & Images

### Icon Library
- **Primary**: `lucide-react`
- Import pattern: `import { IconName } from 'lucide-react'`

### Icon Sizes
```css
w-3 h-3    /* 12px - Tiny icons in badges */
w-4 h-4    /* 16px - Standard UI icons */
w-5 h-5    /* 20px - Section header icons */
w-6 h-6    /* 24px - Large action icons */
```

### Icon Colors
```css
text-gray-400  /* Placeholder, inactive icons */
text-gray-500  /* Secondary icons */
text-gray-600  /* Primary icons */
text-blue-500  /* Brand/accent icons */
text-green-600 /* Success icons */
text-red-500   /* Error/warning icons */
```

### Common Icons
```tsx
// Navigation & Actions
<Search className="w-4 h-4 text-gray-400" />
<X className="w-4 h-4 text-gray-400" />
<Plus className="w-4 h-4" />
<MoreVertical className="w-4 h-4" />
<ChevronDown className="w-4 h-4" />

// Communication
<Phone className="w-4 h-4 text-gray-600" />
<Mail className="w-4 h-4 text-gray-400" />
<MessageSquare className="w-4 h-4" />
<Send className="w-4 h-4" />

// Status & Info
<Check className="w-4 h-4 text-green-600" />
<CheckCheck className="w-4 h-4 text-blue-600" />
<Clock className="w-4 h-4 text-gray-500" />
<AlertCircle className="w-4 h-4 text-red-500" />
<Info className="w-4 h-4 text-blue-500" />

// Business
<User className="w-4 h-4 text-blue-600" />
<UserPlus className="w-4 h-4" />
<Building2 className="w-4 h-4 text-gray-400" />
<Briefcase className="w-4 h-4 text-purple-500" />
<Tag className="w-3 h-3" />
<TrendingUp className="w-4 h-4" />
<Eye className="w-4 h-4" />

// Files & Media
<Paperclip className="w-4 h-4" />
<Image className="w-4 h-4" />
<Filter className="w-4 h-4" />
```

### Avatar Images
```tsx
// Using dicebear for demo avatars
`https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`
```

---

## 📝 Form Elements

### Input Group Pattern
```tsx
<div className="space-y-3">
  <div className="flex items-center gap-2 text-sm">
    <Icon className="w-4 h-4 text-gray-400 flex-shrink-0" />
    <span className="text-gray-600">Label:</span>
    <span className="font-medium text-gray-900">Value</span>
  </div>
</div>
```

### Info Section Pattern
```tsx
<div>
  <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
    <Icon className="w-5 h-5 text-blue-500" />
    Section Title
  </h4>
  <div className="bg-gray-50 rounded-lg p-4 space-y-3">
    <div className="flex justify-between">
      <span className="text-sm text-gray-600">Label:</span>
      <span className="text-sm font-medium text-gray-900">Value</span>
    </div>
  </div>
</div>
```

### Textarea
```tsx
<Textarea
  placeholder="Nhập nội dung..."
  className="min-h-[100px] text-sm"
/>
```

### Checkbox/Radio
```tsx
<label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
  <input
    type="checkbox"
    className="rounded border-gray-300"
  />
  Label Text
</label>
```

---

## � Table Patterns

### Table Structure
```tsx
<div className="overflow-x-auto">
  <table className="min-w-full divide-y divide-gray-200 relative">
    <thead className="bg-gray-50 sticky top-0 z-10">
      <tr>
        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200">
          👤 Column Header
        </th>
        {/* More columns... */}
      </tr>
    </thead>
    <tbody className="bg-white divide-y divide-gray-100">
      <tr className="hover:bg-gray-50 cursor-pointer transition-colors">
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border-r border-gray-100">
          Cell Content
        </td>
        {/* More cells... */}
      </tr>
    </tbody>
  </table>
</div>
```

**Table Header Styling:**
- Background: `bg-gray-50`
- Sticky header: `sticky top-0 z-10`
- Text: `text-xs font-semibold text-gray-700 uppercase tracking-wider`
- Border: `border-r border-gray-200` (right border for column separation)

**Table Body Styling:**
- Row hover: `hover:bg-gray-50 transition-colors`
- Cell padding: `px-6 py-4` (standard) or `px-3 py-3` (compact)
- Cell border: `border-r border-gray-100`
- Text: `text-sm text-gray-900`
- Divider: `divide-y divide-gray-100` between rows

**Width Control:**
- Checkbox column: `w-12`
- STT column: `w-16`
- Phone column: `w-32`
- Company column: `w-44`
- Name/Email columns: `min-w-[200px]`

---

## �🔔 Modal & Dialog

### Dialog Structure
```tsx
<Dialog open={isOpen} onOpenChange={setIsOpen}>
  <DialogContent className="max-w-5xl max-h-[90vh] overflow-hidden flex flex-col p-0">
    {/* Header */}
    <div className="px-6 py-4 border-b border-gray-200 flex-shrink-0">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Dialog Title</h3>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
          <X className="w-6 h-6" />
        </button>
      </div>
    </div>

    {/* Content */}
    <ScrollArea className="flex-1 p-6">
      {/* Main content */}
    </ScrollArea>

    {/* Footer */}
    <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3 flex-shrink-0">
      <Button variant="outline" onClick={onClose}>Đóng</Button>
      <Button className="bg-green-600 hover:bg-green-700">Xác nhận</Button>
    </div>
  </DialogContent>
</Dialog>
```

### Modal Sizes
```css
max-w-md      /* Small modal (448px) */
max-w-lg      /* Medium modal (512px) */
max-w-2xl     /* Large modal (672px) */
max-w-5xl     /* Extra large modal (1024px) */
max-h-[90vh]  /* Max height 90% viewport */
```

---

## 📱 Responsive Patterns

### Breakpoint Utilities
```css
hidden md:flex        /* Show on medium+ screens */
hidden md:block       /* Show on medium+ screens */
md:col-span-6         /* Different column span on medium+ */
```

### Common Responsive Patterns
```tsx
// Hide on mobile, show on desktop
<div className="hidden md:flex items-center gap-2">

// Responsive grid
<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

// Responsive text
<h3 className="text-sm md:text-base lg:text-lg">
```

---

## 🎯 Utility Classes

### Overflow & Scrolling
```css
overflow-hidden        /* Hide overflow */
overflow-y-auto        /* Vertical scroll */
overflow-x-hidden      /* Hide horizontal scroll */
```

### Positioning
```css
relative               /* Relative positioning */
absolute               /* Absolute positioning */
fixed                  /* Fixed positioning */
top-0 left-0           /* Position from edges */
top-1/2 left-1/2       /* Center positioning */
-translate-x-1/2 -translate-y-1/2  /* Center transform */
```

### Z-Index
```css
z-10    /* Above normal content */
z-50    /* Modals, dropdowns */
```

### Shadow
```css
shadow-sm    /* Subtle shadow */
shadow-md    /* Standard shadow */
shadow-lg    /* Prominent shadow */
shadow-xl    /* Modal shadow */
```

---

## ✅ Design Checklist

Khi tạo component mới, CHECK những điểm CỐT LÕI:

- [ ] **Colors**: Đúng palette (blue primary, gray neutral, status colors phù hợp)
- [ ] **Typography**: Font size hợp lý với hierarchy (xs/sm/base/lg)
- [ ] **Spacing**: Padding/margin nhất quán (p-2→p-6, mb-2→mb-6, gap-2→gap-3)
- [ ] **Interactive States**: Hover + Focus được xử lý (hover:bg-gray-50, focus:ring-2)
- [ ] **Icons**: Size nhất quán (w-4 h-4 standard, w-5 h-5 large)
- [ ] **Shadows**: Depth phù hợp (shadow-sm → shadow-lg)
- [ ] **Transitions**: Smooth animations (transition-all duration-200)

**Lưu ý**: Không cần tuân thủ 100% từng pattern - ưu tiên nhất quán về màu sắc và spacing!

---

## 🚀 Nguyên tắc sử dụng

### Mức độ ưu tiên

**🔴 BẮT BUỘC** (Nhất quán toàn hệ thống):
- Color palette (blue, gray, status colors)
- Spacing standards (p-2→p-6, gap-2→gap-3)
- Interactive states (hover, focus, active)

**🟡 NÊN TUÂN THỦ** (Khuyến khích):
- Typography hierarchy
- Border radius, shadows
- Icon sizes, button variants

**🟢 LINH HOẠT** (Tùy context):
- Layout cụ thể
- Animation timing
- Custom component variations

### Philosophy

> **"Nhất quán khi cần thiết, linh hoạt khi hợp lý"**

- Đây là **hướng dẫn, không phải luật cứng nhắc**
- Sáng tạo được khuyến khích - miễn sao nhất quán về màu sắc và spacing
- Pattern mới tốt hơn? Thảo luận và update guide này!

---

**Last Updated**: January 22, 2026
**Version**: 2.0.0 (Optimized)
**Maintainer**: ViLead Development Team
