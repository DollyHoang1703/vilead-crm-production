# Omichat Design System

> Design system được trích xuất từ giao diện Omichat CRM để làm tham khảo cho việc thiết kế UI của Vilead CRM.

---

## Mục lục

### Foundation
1. [Color Palette](#color-palette)
2. [Typography](#typography)
3. [Spacing](#spacing)
4. [Border Radius](#border-radius)
5. [Shadows](#shadows)
6. [Transitions](#transitions)

### Components
7. [Components (Basic)](#components) - Buttons, Cards, Inputs, Tables, Badges, Pagination
8. [Form Components](#form-components-bổ-sung) - Select, Checkbox, Radio, Switch, Textarea
9. [Modal / Dialog](#modal--dialog)
10. [Dropdown Menu](#dropdown-menu)
11. [Tabs](#tabs)
12. [Avatar](#avatar)
13. [Tooltip / Popover](#tooltip--popover)
14. [Toast / Notification](#toast--notification)
15. [Loading States](#loading-states) - Spinner, Skeleton

### Layout & Patterns
16. [Layout](#layout) - Sidebar, Header, Grid
17. [Kanban / Pipeline Colors](#kanban--pipeline-colors)
18. [Empty States](#empty-states)
19. [Responsive Breakpoints](#responsive-breakpoints)

### Assets & Config
20. [Icons](#icons)
21. [Chart Colors](#chart-colors)
22. [CSS Variables](#css-variables)
23. [Tailwind CSS Config](#tailwind-css-config)

---

## Color Palette

### Primary Colors

| Tên | Hex | RGB | Mô tả |
|-----|-----|-----|-------|
| **Primary** | `#3e79f7` | `rgb(62, 121, 247)` | Màu chủ đạo - dùng cho buttons, links, active states |
| **Primary Light** | `#699dff` | `rgb(105, 157, 255)` | Hover state, secondary actions |
| **Primary Dark** | `#2a59d1` | `rgb(42, 89, 209)` | Active/pressed state |
| **Primary Lightest** | `#f0f7ff` | `rgb(240, 247, 255)` | Background tint, selected rows |

### Status Colors

| Tên | Hex | RGB | Mô tả |
|-----|-----|-----|-------|
| **Success** | `#2dc56a` | `rgb(45, 197, 106)` | Thành công, hoàn thành |
| **Success Alt** | `#04d182` | `rgb(4, 209, 130)` | Badge online, success accent |
| **Error** | `#ff6b72` | `rgb(255, 107, 114)` | Lỗi, cảnh báo nghiêm trọng |
| **Error Dark** | `#d9505c` | `rgb(217, 80, 92)` | Error hover/active |
| **Warning** | `#ffc542` | `rgb(255, 197, 66)` | Cảnh báo, pending |
| **Warning Light** | `#ffd86b` | `rgb(255, 216, 107)` | Warning tint |

### Background Colors

| Tên | Hex | Mô tả |
|-----|-----|-------|
| **Background** | `#ffffff` | Nền chính |
| **Background Secondary** | `#f7f7f8` | Nền phụ, sidebar |
| **Background Tertiary** | `#fcfcfc` | Card backgrounds |
| **Background Alt** | `#fafafb` | Alternating rows |

### Border Colors

| Tên | Hex | Mô tả |
|-----|-----|-------|
| **Border Default** | `#e6ebf1` | Border chính |
| **Border Light** | `#d0d4d7` | Dividers |
| **Border Lighter** | `#e0e0e0` | Input borders |

### Text Colors

| Tên | Hex | Mô tả |
|-----|-----|-------|
| **Text Primary** | `#1a3353` | Headings, quan trọng |
| **Text Default** | `#455560` | Body text chính |
| **Text Secondary** | `#373d3f` | Text phụ |
| **Text Muted** | `#72849a` | Placeholder, hints |
| **Text Light** | `#90a4ae` | Disabled text |

---

## Typography

### Font Family

```css
font-family: 'Plus Jakarta Sans', sans-serif;
```

**Fallback Stack:**
```css
font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI',
             Roboto, 'Helvetica Neue', Arial, sans-serif;
```

### Font Sizes

| Tên | Size | Sử dụng |
|-----|------|---------|
| **xs** | `12px` | Labels, badges, captions |
| **sm** | `13px` | Table headers, secondary text |
| **base** | `14px` | Body text (default) |
| **md** | `15px` | Emphasized body |
| **lg** | `16px` | Subheadings |
| **xl** | `22px` | Section titles |
| **2xl** | `28px` | Page titles |

### Font Weights

| Weight | Value | Sử dụng |
|--------|-------|---------|
| **Regular** | `400` | Body text |
| **Medium** | `500` | Labels, buttons |
| **Semibold** | `600` | Subheadings, emphasis |
| **Bold** | `700` | Headings |
| **Extrabold** | `800` | Hero text |
| **Black** | `900` | Table headers (uppercase) |

### Line Heights

| Tên | Value | Sử dụng |
|-----|-------|---------|
| **Tight** | `1` | Icons, badges |
| **Normal** | `1.5` | Body text (default) |
| **Relaxed** | `20px` | Small text |
| **Loose** | `24px` | Large text |

---

## Spacing

### Base Unit: 4px

| Tên | Value | Sử dụng |
|-----|-------|---------|
| **0** | `0px` | Reset |
| **1** | `4px` | Micro spacing |
| **2** | `8px` | Icon gaps, tight spacing |
| **3** | `12px` | Small padding |
| **4** | `16px` | Default gap |
| **5** | `20px` | Medium padding |
| **6** | `24px` | Card padding, section gap |
| **8** | `32px` | Large spacing |
| **10** | `40px` | Section spacing |

### Common Patterns

```css
/* Button padding */
padding: 8.5px 16px;    /* Default */
padding: 8.5px 20px;    /* Large */
padding: 9px 12px;      /* Small */

/* Card padding */
padding: 24px;

/* Table cell padding */
padding: 12px 8px;

/* Gap patterns */
gap: 4px;   /* Icon + text */
gap: 8px;   /* Compact list */
gap: 16px;  /* Default gap */
gap: 24px;  /* Section gap */
```

---

## Border Radius

| Tên | Value | Sử dụng |
|-----|-------|---------|
| **none** | `0` | Sharp corners |
| **sm** | `4px` | Small elements |
| **md** | `6px` | Inputs |
| **default** | `8px` | Default radius |
| **lg** | `10px` / `0.625rem` | Cards, buttons (primary) |
| **xl** | `20px` | Modals, large cards |
| **2xl** | `36px` - `40px` | Rounded buttons |
| **full** | `50%` / `9999px` | Circles, pills |

```css
/* Primary border-radius cho components */
border-radius: 0.625rem;  /* 10px - Cards, buttons, inputs */
border-radius: 50%;       /* Avatar, icon buttons */
```

---

## Shadows

### Elevation Levels

```css
/* Level 1 - Subtle (buttons, inputs focus) */
box-shadow: 0 2px 0 rgba(0, 0, 0, 0.015);

/* Level 2 - Card default */
box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);

/* Level 3 - Card hover */
box-shadow: 0 1px 2px -2px rgba(0, 0, 0, 0.16),
            0 3px 6px 0 rgba(0, 0, 0, 0.12),
            0 5px 12px 4px rgba(0, 0, 0, 0.09);

/* Focus Ring */
box-shadow: 0 0 0 2px rgba(62, 121, 247, 0.2);  /* Primary */
box-shadow: 0 0 0 2px rgba(255, 107, 114, 0.2); /* Error */
box-shadow: 0 0 0 2px rgba(255, 197, 66, 0.2);  /* Warning */
```

---

## Transitions

### Duration & Easing

```css
/* Fast - Micro interactions */
transition: all 0.1s cubic-bezier(0.71, -0.46, 0.88, 0.6);

/* Default - Most interactions */
transition: all 0.3s;
transition: all 0.3s ease-in-out;
transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);

/* Smooth - Large elements */
transition: all 0.5s ease;

/* Bounce - Tooltips, popovers */
transition: all 0.2s cubic-bezier(0.12, 0.4, 0.29, 1.46) 0.1s;
```

### Property-specific

```css
/* Background only */
transition: background-color 0.3s;

/* Shadow only */
transition: box-shadow 0.3s;

/* Layout changes */
transition: width 0.3s, left 0.3s, right 0.3s;
```

---

## Components

### Buttons

#### Default Button
```css
.btn {
  display: inline-block;
  font-weight: 400;
  font-size: 14px;
  line-height: 1.5;
  padding: 8.5px 16px;
  border: 1px solid #e6ebf1;
  border-radius: 0.625rem;
  background: #ffffff;
  color: #455560;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
}

.btn:hover {
  color: #699dff;
  border-color: #699dff;
}

.btn:active {
  color: #2a59d1;
  border-color: #2a59d1;
}
```

#### Primary Button
```css
.btn-primary {
  background: #3e79f7;
  border-color: #3e79f7;
  color: #ffffff;
}

.btn-primary:hover {
  background: #699dff;
  border-color: #699dff;
}

.btn-primary:active {
  background: #2a59d1;
  border-color: #2a59d1;
}
```

#### Button Sizes
```css
/* Small */
height: 36px;
padding: 9px 12px;

/* Default */
height: 40px;
padding: 8.5px 16px;

/* Large */
height: 40px;
padding: 8.5px 20px;
```

### Cards

```css
.card {
  background: #ffffff;
  border: 1px solid #e6ebf1;
  border-radius: 0.625rem;
  padding: 24px;
}

.card-hoverable:hover {
  border-color: transparent;
  box-shadow: 0 1px 2px -2px rgba(0, 0, 0, 0.16),
              0 3px 6px 0 rgba(0, 0, 0, 0.12),
              0 5px 12px 4px rgba(0, 0, 0, 0.09);
}
```

### Inputs

```css
.input {
  width: 100%;
  padding: 8px 12px;
  font-size: 14px;
  line-height: 1.5;
  color: #455560;
  background: #ffffff;
  border: 1px solid #e6ebf1;
  border-radius: 0.625rem;
  transition: all 0.3s;
}

.input::placeholder {
  color: rgba(114, 132, 154, 0.4);
}

.input:hover {
  border-color: #699dff;
}

.input:focus {
  border-color: #3e79f7;
  box-shadow: 0 0 0 2px rgba(62, 121, 247, 0.2);
  outline: none;
}
```

### Tables

```css
.table {
  font-size: 14px;
  border: 1px solid #e6ebf1;
}

.table-header {
  background: #fafafb;
  font-size: 13px;
  font-weight: 900;
  text-transform: uppercase;
  color: #455560;
}

.table-header th {
  padding: 12px 8px;
  border-bottom: 1px solid #e6ebf1;
}

.table-body td {
  padding: 12px 8px;
  border-bottom: 1px solid #e6ebf1;
}

.table-row:hover {
  background: #f0f7ff;
}

.table-row-selected {
  background: rgba(62, 121, 247, 0.1);
}
```

### Badges

```css
/* Status badges */
.badge {
  display: inline-flex;
  align-items: center;
  padding: 2px 8px;
  font-size: 12px;
  font-weight: 500;
  border-radius: 4px;
}

.badge-success {
  background: rgba(45, 197, 106, 0.15);
  color: #2dc56a;
}

.badge-error {
  background: rgba(255, 107, 114, 0.15);
  color: #ff6b72;
}

.badge-warning {
  background: rgba(255, 197, 66, 0.15);
  color: #ffc542;
}

.badge-info {
  background: rgba(62, 121, 247, 0.15);
  color: #3e79f7;
}
```

### Pagination

```css
.pagination-item {
  min-width: 32px;
  height: 32px;
  border-radius: 50%;
  font-size: 14px;
  line-height: 32px;
  text-align: center;
}

.pagination-item-active {
  background: #3e79f7;
  color: #ffffff;
}
```

---

## Layout

### Sidebar

```css
.sidebar {
  width: 220px;           /* Expanded */
  /* width: 80px; */      /* Collapsed */
  background: #ffffff;
  border-right: 1px solid #e6ebf1;
  transition: width 0.3s;
}

.sidebar-menu-item {
  padding: 12px 16px;
  color: #455560;
  border-radius: 0.625rem;
  margin: 4px 8px;
}

.sidebar-menu-item:hover {
  background: #f0f7ff;
  color: #3e79f7;
}

.sidebar-menu-item-active {
  background: #3e79f7;
  color: #ffffff;
}
```

### Header

```css
.header {
  height: 70px;
  background: #ffffff;
  border-bottom: 1px solid #e6ebf1;
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
```

### Grid System

```css
/* Dashboard cards grid */
.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 24px;
}

/* Kanban columns */
.kanban-grid {
  display: flex;
  gap: 16px;
  overflow-x: auto;
}

.kanban-column {
  min-width: 300px;
  width: 300px;
}
```

### Container Widths

```css
/* Modal widths */
.modal-sm { width: 400px; }
.modal-md { width: 500px; }
.modal-lg { width: 600px; }
.modal-xl { width: 800px; }
```

---

## CSS Variables

### Recommended CSS Variables cho Vilead CRM

```css
:root {
  /* Primary Colors */
  --primary: #3e79f7;
  --primary-light: #699dff;
  --primary-dark: #2a59d1;
  --primary-lightest: #f0f7ff;

  /* Status Colors */
  --success: #2dc56a;
  --success-light: #04d182;
  --error: #ff6b72;
  --error-dark: #d9505c;
  --warning: #ffc542;
  --warning-light: #ffd86b;

  /* Background */
  --background: #ffffff;
  --background-secondary: #f7f7f8;
  --background-tertiary: #fcfcfc;
  --background-alt: #fafafb;

  /* Border */
  --border: #e6ebf1;
  --border-light: #d0d4d7;
  --border-lighter: #e0e0e0;

  /* Text */
  --text-primary: #1a3353;
  --text-default: #455560;
  --text-secondary: #373d3f;
  --text-muted: #72849a;
  --text-light: #90a4ae;

  /* Typography */
  --font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont,
                 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  --font-size-xs: 12px;
  --font-size-sm: 13px;
  --font-size-base: 14px;
  --font-size-md: 15px;
  --font-size-lg: 16px;
  --font-size-xl: 22px;
  --font-size-2xl: 28px;

  /* Border Radius */
  --radius-sm: 4px;
  --radius-md: 6px;
  --radius-default: 8px;
  --radius-lg: 10px;
  --radius-xl: 20px;
  --radius-full: 9999px;

  /* Shadows */
  --shadow-sm: 0 2px 0 rgba(0, 0, 0, 0.015);
  --shadow-md: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
  --shadow-lg: 0 1px 2px -2px rgba(0, 0, 0, 0.16),
               0 3px 6px 0 rgba(0, 0, 0, 0.12),
               0 5px 12px 4px rgba(0, 0, 0, 0.09);
  --shadow-focus: 0 0 0 2px rgba(62, 121, 247, 0.2);

  /* Spacing */
  --spacing-1: 4px;
  --spacing-2: 8px;
  --spacing-3: 12px;
  --spacing-4: 16px;
  --spacing-5: 20px;
  --spacing-6: 24px;
  --spacing-8: 32px;
  --spacing-10: 40px;

  /* Layout */
  --sidebar-width: 220px;
  --sidebar-collapsed-width: 80px;
  --header-height: 70px;

  /* Transitions */
  --transition-fast: all 0.1s ease;
  --transition-default: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
  --transition-slow: all 0.5s ease;
}
```

---

## Tailwind CSS Config

### Recommended tailwind.config.ts extension

```typescript
// Thêm vào theme.extend trong tailwind.config.ts
{
  colors: {
    primary: {
      DEFAULT: '#3e79f7',
      light: '#699dff',
      dark: '#2a59d1',
      lightest: '#f0f7ff',
    },
    success: {
      DEFAULT: '#2dc56a',
      light: '#04d182',
    },
    error: {
      DEFAULT: '#ff6b72',
      dark: '#d9505c',
    },
    warning: {
      DEFAULT: '#ffc542',
      light: '#ffd86b',
    },
    border: {
      DEFAULT: '#e6ebf1',
      light: '#d0d4d7',
      lighter: '#e0e0e0',
    },
    text: {
      primary: '#1a3353',
      DEFAULT: '#455560',
      secondary: '#373d3f',
      muted: '#72849a',
      light: '#90a4ae',
    },
    background: {
      DEFAULT: '#ffffff',
      secondary: '#f7f7f8',
      tertiary: '#fcfcfc',
      alt: '#fafafb',
    },
  },
  fontFamily: {
    sans: ['Plus Jakarta Sans', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI',
           'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
  },
  fontSize: {
    xs: '12px',
    sm: '13px',
    base: '14px',
    md: '15px',
    lg: '16px',
    xl: '22px',
    '2xl': '28px',
  },
  borderRadius: {
    sm: '4px',
    md: '6px',
    DEFAULT: '8px',
    lg: '10px',
    xl: '20px',
    '2xl': '36px',
    full: '9999px',
  },
  boxShadow: {
    sm: '0 2px 0 rgba(0, 0, 0, 0.015)',
    DEFAULT: '0 0.125rem 0.25rem rgba(0, 0, 0, 0.075)',
    lg: '0 1px 2px -2px rgba(0, 0, 0, 0.16), 0 3px 6px 0 rgba(0, 0, 0, 0.12), 0 5px 12px 4px rgba(0, 0, 0, 0.09)',
    focus: '0 0 0 2px rgba(62, 121, 247, 0.2)',
  },
}
```

---

## So sánh với Vilead CRM hiện tại

| Thuộc tính | Omichat | Vilead hiện tại | Cần thay đổi |
|------------|---------|-----------------|--------------|
| Primary Color | `#3e79f7` | `hsl(221.2 83.2% 53.3%)` | Tương đương |
| Font | Plus Jakarta Sans | System fonts | Cần update |
| Border Radius | `10px` | `0.5rem` (8px) | Tăng lên 10px |
| Text Color | `#455560` | `hsl(222.2 84% 4.9%)` | Cần update |
| Border Color | `#e6ebf1` | `hsl(214.3 31.8% 91.4%)` | Tương đương |

---

## Form Components (Bổ sung)

### Select / Dropdown Select

```css
.select {
  width: 100%;
  min-height: 40px;
  padding: 0 11px;
  font-size: 14px;
  line-height: 38px;
  color: #455560;
  background: #ffffff;
  border: 1px solid #e6ebf1;
  border-radius: 0.625rem;
  cursor: pointer;
  transition: all 0.3s;
}

.select:hover {
  border-color: #699dff;
}

.select:focus,
.select-open {
  border-color: #3e79f7;
  box-shadow: 0 0 0 2px rgba(62, 121, 247, 0.2);
}

.select-dropdown {
  background: #ffffff;
  border-radius: 0.625rem;
  box-shadow: 0 3px 6px -4px rgba(0, 0, 0, 0.12),
              0 6px 16px 0 rgba(0, 0, 0, 0.08),
              0 9px 28px 8px rgba(0, 0, 0, 0.05);
}

.select-option {
  padding: 8px 12px;
  font-size: 14px;
  line-height: 22px;
  cursor: pointer;
}

.select-option:hover {
  background: #f0f7ff;
}

.select-option-selected {
  background: #f0f7ff;
  font-weight: 600;
  color: #3e79f7;
}
```

### Checkbox

```css
.checkbox {
  position: relative;
  width: 18px;
  height: 18px;
  border: 1px solid #e6ebf1;
  border-radius: 0.625rem;
  background: #ffffff;
  cursor: pointer;
  transition: all 0.3s;
}

.checkbox:hover {
  border-color: #3e79f7;
}

.checkbox-checked {
  background: #3e79f7;
  border-color: #3e79f7;
}

.checkbox-checked::after {
  /* Checkmark */
  position: absolute;
  top: 50%;
  left: 21.5%;
  width: 7px;
  height: 11px;
  border: 2px solid #ffffff;
  border-top: 0;
  border-left: 0;
  transform: rotate(45deg) translate(-50%, -50%);
}

.checkbox-disabled {
  background: #f7f7f8;
  border-color: #d0d4d7;
  cursor: not-allowed;
}

/* Focus ring */
.checkbox:focus {
  box-shadow: 0 0 0 2px rgba(62, 121, 247, 0.2);
}
```

### Radio Button

```css
.radio {
  position: relative;
  width: 18px;
  height: 18px;
  border: 1px solid #e6ebf1;
  border-radius: 50%;
  background: #ffffff;
  cursor: pointer;
  transition: all 0.3s;
}

.radio:hover {
  border-color: #3e79f7;
}

.radio-checked {
  border-color: #3e79f7;
}

.radio-checked::after {
  /* Inner dot */
  position: absolute;
  top: 50%;
  left: 50%;
  width: 10px;
  height: 10px;
  background: #3e79f7;
  border-radius: 50%;
  transform: translate(-50%, -50%);
}

.radio-disabled {
  background: #f7f7f8;
  border-color: #d0d4d7;
  cursor: not-allowed;
}
```

### Switch / Toggle

```css
.switch {
  position: relative;
  width: 44px;
  height: 22px;
  background: rgba(0, 0, 0, 0.25);
  border-radius: 100px;
  cursor: pointer;
  transition: all 0.2s;
}

.switch-checked {
  background: #3e79f7;
}

.switch-handle {
  position: absolute;
  top: 2px;
  left: 2px;
  width: 18px;
  height: 18px;
  background: #ffffff;
  border-radius: 50%;
  box-shadow: 0 2px 4px rgba(0, 35, 11, 0.2);
  transition: all 0.2s ease-in-out;
}

.switch-checked .switch-handle {
  left: calc(100% - 20px);
}

.switch:focus {
  box-shadow: 0 0 0 2px rgba(62, 121, 247, 0.2);
}

.switch-disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
```

### Textarea

```css
.textarea {
  width: 100%;
  min-height: 100px;
  padding: 8px 12px;
  font-size: 14px;
  line-height: 1.5;
  color: #455560;
  background: #ffffff;
  border: 1px solid #e6ebf1;
  border-radius: 0.625rem;
  resize: vertical;
  transition: all 0.3s;
}

.textarea::placeholder {
  color: rgba(114, 132, 154, 0.4);
}

.textarea:hover {
  border-color: #699dff;
}

.textarea:focus {
  border-color: #3e79f7;
  box-shadow: 0 0 0 2px rgba(62, 121, 247, 0.2);
  outline: none;
}
```

---

## Modal / Dialog

```css
/* Overlay */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  z-index: 1000;
}

/* Modal Container */
.modal {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: #ffffff;
  border-radius: 0.625rem;
  box-shadow: 0 3px 6px -4px rgba(0, 0, 0, 0.12),
              0 6px 16px 0 rgba(0, 0, 0, 0.08),
              0 9px 28px 8px rgba(0, 0, 0, 0.05);
  z-index: 1001;
}

/* Modal Sizes */
.modal-sm { width: 400px; }
.modal-md { width: 520px; }
.modal-lg { width: 720px; }
.modal-xl { width: 1000px; }
.modal-full { width: calc(100vw - 48px); max-width: 1200px; }

/* Modal Header */
.modal-header {
  padding: 16px 24px;
  border-bottom: 1px solid #e6ebf1;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.modal-title {
  font-size: 16px;
  font-weight: 600;
  color: #1a3353;
  margin: 0;
}

.modal-close {
  width: 32px;
  height: 32px;
  border: none;
  background: transparent;
  color: #72849a;
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.3s;
}

.modal-close:hover {
  color: #455560;
  background: #f7f7f8;
}

/* Modal Body */
.modal-body {
  padding: 24px;
  max-height: calc(100vh - 200px);
  overflow-y: auto;
}

/* Modal Footer */
.modal-footer {
  padding: 16px 24px;
  border-top: 1px solid #e6ebf1;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
```

---

## Dropdown Menu

```css
.dropdown-menu {
  min-width: 160px;
  padding: 4px 0;
  background: #ffffff;
  border-radius: 0.625rem;
  box-shadow: 0 3px 6px -4px rgba(0, 0, 0, 0.12),
              0 6px 16px 0 rgba(0, 0, 0, 0.08),
              0 9px 28px 8px rgba(0, 0, 0, 0.05);
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  font-size: 14px;
  color: #455560;
  cursor: pointer;
  transition: all 0.3s;
}

.dropdown-item:hover {
  background: #f0f7ff;
  color: #3e79f7;
}

.dropdown-item-danger {
  color: #ff6b72;
}

.dropdown-item-danger:hover {
  background: #ff6b72;
  color: #ffffff;
}

.dropdown-divider {
  height: 1px;
  margin: 4px 0;
  background: #e6ebf1;
}

.dropdown-header {
  padding: 8px 16px;
  font-size: 12px;
  font-weight: 600;
  color: #72849a;
  text-transform: uppercase;
}
```

---

## Tabs

```css
.tabs {
  display: flex;
  flex-direction: column;
}

.tabs-nav {
  display: flex;
  border-bottom: 1px solid #e6ebf1;
  margin-bottom: 16px;
}

.tab {
  padding: 12px 16px;
  font-size: 14px;
  font-weight: 600;
  line-height: 24px;
  color: #aeaeb7;
  border-bottom: 2px solid transparent;
  cursor: pointer;
  transition: all 0.3s;
}

.tab:hover {
  color: #3e79f7;
}

.tab-active {
  color: #3e79f7;
  border-bottom-color: #3e79f7;
}

/* Tab ink bar animation */
.tabs-ink-bar {
  position: absolute;
  bottom: 0;
  height: 2px;
  background: #3e79f7;
  transition: width 0.3s, left 0.3s, right 0.3s;
}

/* Tab variants */
.tabs-card .tab {
  background: #fafafb;
  border: 1px solid #e6ebf1;
  border-bottom: none;
  border-radius: 0.625rem 0.625rem 0 0;
  margin-right: 4px;
}

.tabs-card .tab-active {
  background: #ffffff;
  border-bottom: 1px solid #ffffff;
  margin-bottom: -1px;
}
```

---

## Avatar

```css
/* Avatar sizes */
.avatar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: #3e79f7;
  color: #ffffff;
  font-weight: 500;
  overflow: hidden;
}

.avatar-xs { width: 24px; height: 24px; font-size: 12px; }
.avatar-sm { width: 32px; height: 32px; font-size: 14px; }
.avatar-md { width: 40px; height: 40px; font-size: 16px; }
.avatar-lg { width: 48px; height: 48px; font-size: 18px; }
.avatar-xl { width: 64px; height: 64px; font-size: 24px; }

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Avatar with status */
.avatar-wrapper {
  position: relative;
  display: inline-block;
}

.avatar-status {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 10px;
  height: 10px;
  border: 2px solid #ffffff;
  border-radius: 50%;
}

.avatar-status-online { background: #04d182; }
.avatar-status-offline { background: #d0d4d7; }
.avatar-status-busy { background: #ff6b72; }

/* Avatar group */
.avatar-group {
  display: flex;
}

.avatar-group .avatar {
  margin-left: -8px;
  border: 2px solid #ffffff;
}

.avatar-group .avatar:first-child {
  margin-left: 0;
}
```

---

## Tooltip / Popover

```css
/* Tooltip */
.tooltip {
  position: relative;
  max-width: 250px;
  padding: 8px 12px;
  font-size: 12px;
  line-height: 1.5;
  color: #ffffff;
  background: rgba(0, 0, 0, 0.85);
  border-radius: 6px;
  box-shadow: 0 3px 6px -4px rgba(0, 0, 0, 0.12);
}

.tooltip-arrow {
  position: absolute;
  width: 8px;
  height: 8px;
  background: rgba(0, 0, 0, 0.85);
  transform: rotate(45deg);
}

/* Tooltip placements */
.tooltip-top .tooltip-arrow { bottom: -4px; left: 50%; margin-left: -4px; }
.tooltip-bottom .tooltip-arrow { top: -4px; left: 50%; margin-left: -4px; }
.tooltip-left .tooltip-arrow { right: -4px; top: 50%; margin-top: -4px; }
.tooltip-right .tooltip-arrow { left: -4px; top: 50%; margin-top: -4px; }

/* Popover */
.popover {
  background: #ffffff;
  border-radius: 0.625rem;
  box-shadow: 0 3px 6px -4px rgba(0, 0, 0, 0.12),
              0 6px 16px 0 rgba(0, 0, 0, 0.08),
              0 9px 28px 8px rgba(0, 0, 0, 0.05);
}

.popover-title {
  padding: 12px 16px;
  font-size: 14px;
  font-weight: 600;
  color: #1a3353;
  border-bottom: 1px solid #e6ebf1;
}

.popover-content {
  padding: 12px 16px;
  color: #455560;
}
```

---

## Toast / Notification

```css
/* Toast (center top) */
.toast {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  font-size: 14px;
  background: #ffffff;
  border-radius: 0.625rem;
  box-shadow: 0 3px 6px -4px rgba(0, 0, 0, 0.12),
              0 6px 16px 0 rgba(0, 0, 0, 0.08);
}

.toast-success { color: #2dc56a; }
.toast-error { color: #ff6b72; }
.toast-warning { color: #ffc542; }
.toast-info { color: #3e79f7; }

.toast-icon {
  width: 20px;
  height: 20px;
}

/* Notification (corner) */
.notification {
  width: 384px;
  padding: 20px 24px;
  background: #ffffff;
  border-radius: 0.625rem;
  box-shadow: 0 3px 6px -4px rgba(0, 0, 0, 0.12),
              0 6px 16px 0 rgba(0, 0, 0, 0.08),
              0 9px 28px 8px rgba(0, 0, 0, 0.05);
}

.notification-title {
  font-size: 16px;
  font-weight: 600;
  color: #1a3353;
  margin-bottom: 8px;
}

.notification-content {
  font-size: 14px;
  color: #455560;
}

.notification-close {
  position: absolute;
  top: 16px;
  right: 16px;
  color: #72849a;
  cursor: pointer;
}

.notification-close:hover {
  color: #455560;
}
```

---

## Loading States

### Spinner

```css
.spinner {
  width: 24px;
  height: 24px;
  border: 2px solid #e6ebf1;
  border-top-color: #3e79f7;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Spinner sizes */
.spinner-sm { width: 16px; height: 16px; }
.spinner-md { width: 24px; height: 24px; }
.spinner-lg { width: 40px; height: 40px; }
```

### Skeleton

```css
.skeleton {
  background: linear-gradient(
    90deg,
    #f7f7f8 25%,
    #e6ebf1 50%,
    #f7f7f8 75%
  );
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s infinite;
  border-radius: 4px;
}

@keyframes skeleton-loading {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

/* Common skeleton shapes */
.skeleton-text { height: 16px; margin-bottom: 8px; }
.skeleton-title { height: 24px; width: 50%; margin-bottom: 16px; }
.skeleton-avatar { width: 40px; height: 40px; border-radius: 50%; }
.skeleton-button { width: 80px; height: 40px; border-radius: 0.625rem; }
.skeleton-image { width: 100%; height: 200px; border-radius: 0.625rem; }
```

### Loading Overlay

```css
.loading-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.7);
  z-index: 10;
}
```

---

## Kanban / Pipeline Colors

### Stage Colors (Cơ hội/Deals)

```css
:root {
  /* Pipeline stage colors */
  --stage-new: #08aeea;          /* Mới - Cyan */
  --stage-contacting: #3e79f7;   /* Đang liên hệ - Blue */
  --stage-qualified: #ffc542;    /* Đủ điều kiện - Yellow */
  --stage-proposal: #ff9496;     /* Báo giá - Light Red */
  --stage-negotiation: #ff6b72;  /* Thương lượng - Red */
  --stage-won: #2dc56a;          /* Thắng - Green */
  --stage-lost: #d9505c;         /* Thua - Dark Red */
}
```

### Kanban Column

```css
.kanban-column {
  min-width: 300px;
  width: 300px;
  background: #f7f7f8;
  border-radius: 0.625rem;
  padding: 12px;
}

.kanban-column-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  margin-bottom: 12px;
}

.kanban-column-title {
  font-size: 14px;
  font-weight: 600;
  color: #1a3353;
}

.kanban-column-count {
  font-size: 12px;
  color: #72849a;
  background: #e6ebf1;
  padding: 2px 8px;
  border-radius: 10px;
}

.kanban-card {
  background: #ffffff;
  border: 1px solid #e6ebf1;
  border-radius: 0.625rem;
  padding: 12px;
  margin-bottom: 8px;
  cursor: grab;
  transition: box-shadow 0.3s;
}

.kanban-card:hover {
  box-shadow: 0 1px 2px -2px rgba(0, 0, 0, 0.16),
              0 3px 6px 0 rgba(0, 0, 0, 0.12);
}

.kanban-card-dragging {
  box-shadow: 0 5px 12px 4px rgba(0, 0, 0, 0.09);
  cursor: grabbing;
}

/* Stage indicator on card */
.kanban-card-stage {
  width: 4px;
  height: 100%;
  border-radius: 2px;
  position: absolute;
  left: 0;
  top: 0;
}
```

### Priority Colors

```css
:root {
  --priority-urgent: #ff6b72;    /* Khẩn cấp - Red */
  --priority-high: #ffc542;      /* Cao - Yellow */
  --priority-medium: #3e79f7;    /* Trung bình - Blue */
  --priority-low: #72849a;       /* Thấp - Gray */
}
```

---

## Icons

### Icon Library
- **Recommended**: Lucide Icons (đang dùng trong Vilead)
- **Alternative**: Heroicons, Phosphor Icons

### Icon Sizes

```css
.icon-xs { width: 12px; height: 12px; }
.icon-sm { width: 16px; height: 16px; }
.icon-md { width: 20px; height: 20px; }  /* Default */
.icon-lg { width: 24px; height: 24px; }
.icon-xl { width: 32px; height: 32px; }
```

### Icon Colors

```css
/* Icon in buttons/links */
.icon { color: currentColor; }

/* Standalone icons */
.icon-primary { color: #3e79f7; }
.icon-success { color: #2dc56a; }
.icon-error { color: #ff6b72; }
.icon-warning { color: #ffc542; }
.icon-muted { color: #72849a; }
```

### Icon Button

```css
.icon-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  background: transparent;
  color: #72849a;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s;
}

.icon-btn:hover {
  background: #f0f7ff;
  color: #3e79f7;
}
```

---

## Responsive Breakpoints

```css
/* Mobile first approach */
:root {
  --breakpoint-sm: 640px;   /* Small devices */
  --breakpoint-md: 768px;   /* Tablets */
  --breakpoint-lg: 1024px;  /* Laptops */
  --breakpoint-xl: 1280px;  /* Desktops */
  --breakpoint-2xl: 1536px; /* Large screens */
}

/* Media queries */
@media (min-width: 640px) { /* sm */ }
@media (min-width: 768px) { /* md */ }
@media (min-width: 1024px) { /* lg */ }
@media (min-width: 1280px) { /* xl */ }
@media (min-width: 1536px) { /* 2xl */ }
```

### Responsive Layout Patterns

```css
/* Sidebar collapse on mobile */
@media (max-width: 1023px) {
  .sidebar {
    position: fixed;
    left: -220px;
    z-index: 100;
    transition: left 0.3s;
  }

  .sidebar-open {
    left: 0;
  }
}

/* Stack cards on mobile */
@media (max-width: 767px) {
  .dashboard-grid {
    grid-template-columns: 1fr;
  }

  .kanban-grid {
    flex-direction: column;
  }

  .kanban-column {
    width: 100%;
    min-width: auto;
  }
}

/* Table horizontal scroll on mobile */
@media (max-width: 767px) {
  .table-responsive {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }
}
```

---

## Empty States

```css
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px 24px;
  text-align: center;
}

.empty-state-icon {
  width: 120px;
  height: 120px;
  margin-bottom: 24px;
  color: #d0d4d7;
}

.empty-state-title {
  font-size: 16px;
  font-weight: 600;
  color: #1a3353;
  margin-bottom: 8px;
}

.empty-state-description {
  font-size: 14px;
  color: #72849a;
  max-width: 300px;
  margin-bottom: 24px;
}
```

---

## Chart Colors

### Data Visualization Palette

```css
:root {
  /* Sequential palette (cho biểu đồ đơn màu) */
  --chart-blue-1: #f0f7ff;
  --chart-blue-2: #a0bdfb;
  --chart-blue-3: #699dff;
  --chart-blue-4: #3e79f7;
  --chart-blue-5: #2a59d1;

  /* Categorical palette (cho biểu đồ nhiều series) */
  --chart-1: #3e79f7;  /* Blue */
  --chart-2: #2dc56a;  /* Green */
  --chart-3: #ffc542;  /* Yellow */
  --chart-4: #ff6b72;  /* Red */
  --chart-5: #08aeea;  /* Cyan */
  --chart-6: #a855f7;  /* Purple */
  --chart-7: #f97316;  /* Orange */
  --chart-8: #ec4899;  /* Pink */
}
```

### Chart Styling

```css
/* Tooltip */
.chart-tooltip {
  background: #ffffff;
  border: 1px solid #e6ebf1;
  border-radius: 6px;
  padding: 12px;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1);
}

/* Legend */
.chart-legend {
  font-size: 12px;
  color: #455560;
}

/* Axis */
.chart-axis {
  font-size: 12px;
  color: #72849a;
}

.chart-axis-line {
  stroke: #e6ebf1;
}

/* Grid */
.chart-grid {
  stroke: #e6ebf1;
  stroke-dasharray: 3 3;
}
```

---

## Tài liệu tham khảo

- Source files: `image_ui_new/` folder
- Phân tích từ: Omichat CRM (https://omichat.com)
- Ngày tạo: 26/01/2026
- Cập nhật lần cuối: 26/01/2026
