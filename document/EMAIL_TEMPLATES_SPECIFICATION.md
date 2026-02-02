# EMAIL TEMPLATES SPECIFICATION — CRM ViLead

> **Version:** 2.0 (Redesign — Modern & Minimal)
> **Module:** System Email & Marketing Email
> **Target:** AI Code Assistants (Copilot, Claude Code, Cursor AI)
> **Last Updated:** 2026-02-02

---

## 1. DESIGN PHILOSOPHY

### 1.1 Nguyên tắc thiết kế

Thiết kế email ViLead tuân theo triết lý **"Content-first, clean & professional"**:

| Nguyên tắc | Mô tả |
|-------------|--------|
| **Tối giản** | Không icon trang trí, không gradient, không shadow. Nội dung rõ ràng là đủ. |
| **Chuyên nghiệp** | Typography sạch, hierarchy rõ ràng, spacing nhất quán. |
| **Tương thích** | HTML table-based layout, inline CSS, hoạt động trên mọi email client. |
| **Nhất quán** | Tất cả templates dùng chung base structure, color scheme, typography. |
| **Responsive** | Hiển thị tốt trên desktop (600px) và mobile (100% width). |

### 1.2 So sánh với bản cũ

| Hạng mục | Bản cũ (v1.0) | Bản mới (v2.0) |
|----------|---------------|-----------------|
| Font | Google Fonts (Playwrite CU, Noto Serif) — load chậm, không hỗ trợ tốt | System fonts (Arial, Helvetica) — nhanh, universal |
| Màu sắc | Nhiều màu (cam, xanh, đỏ) — rối | 1 accent color + grayscale — sạch |
| Layout | Table phức tạp, nhiều div lồng nhau | Table đơn giản, 1 cột chính |
| Footer | Nền xanh đậm + nhiều thông tin | Footer nhẹ, text-based |
| Icon/Logo | Logo lớn + nhiều hình ảnh | Logo nhỏ gọn, không ảnh trang trí |
| Nội dung | Văn phong dài dòng, lễ nghi | Ngắn gọn, đi thẳng vào vấn đề |

---

## 2. TECHNICAL REQUIREMENTS

### 2.1 Technology Stack

```
- HTML 4.01 Transitional (email-compatible)
- CSS inline only (không external/internal stylesheet)
- Table-based layout (không div layout)
- UTF-8 encoding (hỗ trợ tiếng Việt đầy đủ)
- Max width: 600px (centered)
```

### 2.2 Email Client Compatibility

| Client | Yêu cầu |
|--------|----------|
| Gmail (Web & App) | ✅ Primary target |
| Outlook 2016+ | ✅ Table layout bắt buộc |
| Apple Mail | ✅ |
| Yahoo Mail | ✅ |
| Thunderbird | ✅ |
| Mobile (iOS/Android) | ✅ Responsive with media queries |

### 2.3 Design Tokens

```css
/* === COLORS === */
--color-primary:       #2563EB;   /* Brand blue — links, CTA, accents */
--color-primary-dark:  #1D4ED8;   /* CTA hover */
--color-text-primary:  #1F2937;   /* Headings, body text */
--color-text-secondary:#6B7280;   /* Captions, metadata, footer */
--color-text-muted:    #9CA3AF;   /* Timestamps, hints */
--color-border:        #E5E7EB;   /* Dividers, card borders */
--color-bg-page:       #F9FAFB;   /* Email background (ngoài card) */
--color-bg-card:       #FFFFFF;   /* Content card background */
--color-bg-highlight:  #EFF6FF;   /* Info box, highlight sections */
--color-success:       #059669;   /* Success states */
--color-warning:       #D97706;   /* Warning states */
--color-danger:        #DC2626;   /* Error, urgent states */

/* === TYPOGRAPHY === */
--font-family: Arial, Helvetica, 'Segoe UI', sans-serif;
--font-size-h1:   24px;  /* line-height: 32px */
--font-size-h2:   20px;  /* line-height: 28px */
--font-size-body: 15px;  /* line-height: 24px */
--font-size-small:13px;  /* line-height: 20px */
--font-size-tiny: 12px;  /* line-height: 18px */

/* === SPACING === */
--spacing-xs:   8px;
--spacing-sm:  12px;
--spacing-md:  16px;
--spacing-lg:  24px;
--spacing-xl:  32px;
--spacing-2xl: 48px;

/* === BORDER RADIUS === */
--radius-sm:  4px;
--radius-md:  8px;
--radius-lg: 12px;
```

---

## 3. BASE TEMPLATE STRUCTURE

### 3.1 Layout Architecture

```
┌─────────────────────────────────────────┐  ← Page background (#F9FAFB)
│                                         │
│  ┌───────────────────────────────────┐  │  ← Content card (#FFFFFF)
│  │         HEADER (Logo)             │  │     max-width: 600px
│  ├───────────────────────────────────┤  │
│  │                                   │  │
│  │         BODY CONTENT              │  │
│  │                                   │  │
│  │  ┌─────────────────────────────┐  │  │  ← Optional: Info Box (#EFF6FF)
│  │  │   Highlight / Data Box      │  │  │
│  │  └─────────────────────────────┘  │  │
│  │                                   │  │
│  │         [ CTA Button ]            │  │  ← Optional: Primary action
│  │                                   │  │
│  ├───────────────────────────────────┤  │
│  │         FOOTER                    │  │  ← Company info + links
│  └───────────────────────────────────┘  │
│                                         │
└─────────────────────────────────────────┘
```

### 3.2 Base HTML Template

```html
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>{{subject}}</title>
  <!--[if mso]>
  <style>
    table { border-collapse: collapse; }
    .fallback-font { font-family: Arial, sans-serif !important; }
  </style>
  <![endif]-->
</head>
<body style="margin:0; padding:0; background-color:#F9FAFB; -webkit-text-size-adjust:100%; -ms-text-size-adjust:100%;">

  <!-- Wrapper -->
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
         style="background-color:#F9FAFB;">
    <tr>
      <td align="center" style="padding:32px 16px;">

        <!-- Content Card -->
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0"
               style="background-color:#FFFFFF; border-radius:8px; overflow:hidden; border:1px solid #E5E7EB;">

          <!-- === HEADER === -->
          <tr>
            <td style="padding:24px 32px; border-bottom:1px solid #E5E7EB;">
              <img src="{{logo_url}}" alt="ViLead CRM" width="120"
                   style="display:block; border:0; outline:none;" />
            </td>
          </tr>

          <!-- === BODY === -->
          <tr>
            <td style="padding:32px;">
              {{body_content}}
            </td>
          </tr>

          <!-- === FOOTER === -->
          <tr>
            <td style="padding:24px 32px; border-top:1px solid #E5E7EB; background-color:#F9FAFB;">
              <p style="margin:0 0 8px; font:13px Arial, Helvetica, sans-serif; color:#6B7280;">
                {{company_name}}
              </p>
              <p style="margin:0 0 4px; font:12px Arial, Helvetica, sans-serif; color:#9CA3AF;">
                {{company_address}}
              </p>
              <p style="margin:0 0 4px; font:12px Arial, Helvetica, sans-serif; color:#9CA3AF;">
                Hotline: {{hotline}} · Email: {{support_email}}
              </p>
              <p style="margin:16px 0 0; font:11px Arial, Helvetica, sans-serif; color:#9CA3AF;">
                Email này được gửi tự động từ hệ thống CRM ViLead. Vui lòng không trả lời trực tiếp.
              </p>
            </td>
          </tr>

        </table>
        <!-- /Content Card -->

      </td>
    </tr>
  </table>
  <!-- /Wrapper -->

</body>
</html>
```

### 3.3 Reusable Components

#### Component: Primary CTA Button

```html
<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:24px 0;">
  <tr>
    <td align="center" style="background-color:#2563EB; border-radius:6px;">
      <a href="{{cta_url}}" target="_blank"
         style="display:inline-block; padding:12px 28px; font:600 15px Arial, Helvetica, sans-serif;
                color:#FFFFFF; text-decoration:none; border-radius:6px;">
        {{cta_text}}
      </a>
    </td>
  </tr>
</table>
```

#### Component: Secondary CTA Button (outline)

```html
<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:24px 0;">
  <tr>
    <td align="center" style="border:1px solid #2563EB; border-radius:6px;">
      <a href="{{cta_url}}" target="_blank"
         style="display:inline-block; padding:12px 28px; font:600 15px Arial, Helvetica, sans-serif;
                color:#2563EB; text-decoration:none;">
        {{cta_text}}
      </a>
    </td>
  </tr>
</table>
```

#### Component: Info Box (highlight)

```html
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
       style="margin:16px 0;">
  <tr>
    <td style="padding:16px 20px; background-color:#EFF6FF; border-radius:8px; border-left:4px solid #2563EB;">
      {{info_content}}
    </td>
  </tr>
</table>
```

#### Component: Warning Box

```html
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
       style="margin:16px 0;">
  <tr>
    <td style="padding:16px 20px; background-color:#FEF3C7; border-radius:8px; border-left:4px solid #D97706;">
      {{warning_content}}
    </td>
  </tr>
</table>
```

#### Component: Data Row (key-value)

```html
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
       style="margin:4px 0;">
  <tr>
    <td width="140" style="padding:8px 0; font:13px Arial, Helvetica, sans-serif; color:#6B7280; vertical-align:top;">
      {{label}}
    </td>
    <td style="padding:8px 0; font:15px Arial, Helvetica, sans-serif; color:#1F2937; vertical-align:top;">
      {{value}}
    </td>
  </tr>
</table>
```

#### Component: Divider

```html
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
  <tr>
    <td style="padding:16px 0;">
      <div style="border-top:1px solid #E5E7EB; font-size:0; line-height:0;">&nbsp;</div>
    </td>
  </tr>
</table>
```

#### Component: OTP / Code Display

```html
<table role="presentation" cellpadding="0" cellspacing="0" border="0"
       style="margin:24px auto;" align="center">
  <tr>
    <td style="padding:16px 40px; background-color:#F3F4F6; border-radius:8px;
               font:700 32px 'Courier New', monospace; color:#1F2937; letter-spacing:8px; text-align:center;">
      {{code}}
    </td>
  </tr>
</table>
```

---

## 4. EMAIL TEMPLATES — PHASE 1

---

### 4.1 TEMPLATE: OTP Verification (Xác thực OTP)

**File:** `otp-verification.html`
**Trigger:** Đăng ký tài khoản mới, xác thực hành động nhạy cảm
**Subject:** `[ViLead] Mã xác thực của bạn: {{otp_code}}`

#### Variables

```typescript
interface OTPVerificationVars {
  recipient_name: string;      // "Nguyễn Văn A"
  otp_code: string;            // "847291"
  expiry_minutes: number;      // 5
  action_description: string;  // "xác thực tài khoản" | "xác nhận đổi email"
}
```

#### Body Content

```html
<!-- Heading -->
<h1 style="margin:0 0 8px; font:700 24px Arial, Helvetica, sans-serif; color:#1F2937;">
  Mã xác thực
</h1>
<p style="margin:0 0 24px; font:15px Arial, Helvetica, sans-serif; color:#6B7280;">
  Dùng mã dưới đây để {{action_description}}
</p>

<!-- OTP Code -->
<table role="presentation" cellpadding="0" cellspacing="0" border="0"
       style="margin:0 auto 24px;" align="center">
  <tr>
    <td style="padding:16px 40px; background-color:#F3F4F6; border-radius:8px;
               font:700 32px 'Courier New', monospace; color:#1F2937; letter-spacing:8px; text-align:center;">
      {{otp_code}}
    </td>
  </tr>
</table>

<!-- Note -->
<p style="margin:0; font:13px Arial, Helvetica, sans-serif; color:#9CA3AF; text-align:center;">
  Mã có hiệu lực trong <strong style="color:#6B7280;">{{expiry_minutes}} phút</strong>.
  Không chia sẻ mã này cho bất kỳ ai.
</p>
```

---

### 4.2 TEMPLATE: Welcome Email (Chào mừng tài khoản mới)

**File:** `welcome.html`
**Trigger:** Tài khoản được kích hoạt thành công
**Subject:** `Chào mừng bạn đến với ViLead CRM`

#### Variables

```typescript
interface WelcomeVars {
  recipient_name: string;      // "Nguyễn Văn A"
  login_url: string;           // "https://app.vilead.vn/login"
  email: string;               // "nguyenvan@company.com"
  role: string;                // "Sales" | "Admin" | "Leader" | "CSKH"
}
```

#### Body Content

```html
<h1 style="margin:0 0 8px; font:700 24px Arial, Helvetica, sans-serif; color:#1F2937;">
  Chào mừng, {{recipient_name}}!
</h1>
<p style="margin:0 0 24px; font:15px/24px Arial, Helvetica, sans-serif; color:#4B5563;">
  Tài khoản CRM ViLead của bạn đã sẵn sàng. Dưới đây là thông tin đăng nhập:
</p>

<!-- Account Info Box -->
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
       style="margin:0 0 24px;">
  <tr>
    <td style="padding:20px; background-color:#F9FAFB; border-radius:8px; border:1px solid #E5E7EB;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td width="100" style="padding:6px 0; font:13px Arial, sans-serif; color:#6B7280;">Email</td>
          <td style="padding:6px 0; font:15px Arial, sans-serif; color:#1F2937;">{{email}}</td>
        </tr>
        <tr>
          <td width="100" style="padding:6px 0; font:13px Arial, sans-serif; color:#6B7280;">Vai trò</td>
          <td style="padding:6px 0; font:15px Arial, sans-serif; color:#1F2937;">{{role}}</td>
        </tr>
      </table>
    </td>
  </tr>
</table>

<!-- CTA -->
<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 24px;">
  <tr>
    <td style="background-color:#2563EB; border-radius:6px;">
      <a href="{{login_url}}" target="_blank"
         style="display:inline-block; padding:12px 28px; font:600 15px Arial, sans-serif;
                color:#FFFFFF; text-decoration:none;">
        Đăng nhập ngay
      </a>
    </td>
  </tr>
</table>

<p style="margin:0; font:13px Arial, sans-serif; color:#9CA3AF;">
  Nếu bạn cần hỗ trợ, liên hệ quản trị viên hoặc đội ngũ CSKH.
</p>
```

---

### 4.3 TEMPLATE: Password Reset (Khôi phục mật khẩu)

**File:** `password-reset.html`
**Trigger:** Người dùng yêu cầu reset password
**Subject:** `[ViLead] Đặt lại mật khẩu`

#### Variables

```typescript
interface PasswordResetVars {
  recipient_name: string;
  reset_url: string;
  expiry_minutes: number;      // 30
  request_ip: string;          // "103.XX.XX.XX"
  request_time: string;        // "02/02/2026 14:30"
}
```

#### Body Content

```html
<h1 style="margin:0 0 8px; font:700 24px Arial, Helvetica, sans-serif; color:#1F2937;">
  Đặt lại mật khẩu
</h1>
<p style="margin:0 0 24px; font:15px/24px Arial, Helvetica, sans-serif; color:#4B5563;">
  Chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn.
  Nhấn nút bên dưới để tạo mật khẩu mới:
</p>

<!-- CTA -->
<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 24px;">
  <tr>
    <td style="background-color:#2563EB; border-radius:6px;">
      <a href="{{reset_url}}" target="_blank"
         style="display:inline-block; padding:12px 28px; font:600 15px Arial, sans-serif;
                color:#FFFFFF; text-decoration:none;">
        Đặt lại mật khẩu
      </a>
    </td>
  </tr>
</table>

<p style="margin:0 0 16px; font:13px Arial, sans-serif; color:#9CA3AF;">
  Link có hiệu lực trong {{expiry_minutes}} phút. Nếu bạn không yêu cầu, hãy bỏ qua email này.
</p>

<!-- Request Info -->
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
  <tr>
    <td style="padding:12px 16px; background-color:#F9FAFB; border-radius:6px; font:12px Arial, sans-serif; color:#9CA3AF;">
      Yêu cầu lúc {{request_time}} · IP: {{request_ip}}
    </td>
  </tr>
</table>
```

---

### 4.4 TEMPLATE: Password Changed (Đổi mật khẩu thành công)

**File:** `password-changed.html`
**Trigger:** Mật khẩu được thay đổi thành công
**Subject:** `[ViLead] Mật khẩu đã được thay đổi`

#### Variables

```typescript
interface PasswordChangedVars {
  recipient_name: string;
  changed_time: string;        // "02/02/2026 14:35"
  changed_ip: string;          // "103.XX.XX.XX"
  support_url: string;
}
```

#### Body Content

```html
<h1 style="margin:0 0 8px; font:700 24px Arial, Helvetica, sans-serif; color:#1F2937;">
  Mật khẩu đã được thay đổi
</h1>
<p style="margin:0 0 24px; font:15px/24px Arial, Helvetica, sans-serif; color:#4B5563;">
  Mật khẩu tài khoản ViLead của bạn vừa được cập nhật thành công.
</p>

<!-- Info Box -->
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
       style="margin:0 0 24px;">
  <tr>
    <td style="padding:16px 20px; background-color:#F9FAFB; border-radius:8px; border:1px solid #E5E7EB;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td width="120" style="padding:4px 0; font:13px Arial, sans-serif; color:#6B7280;">Thời gian</td>
          <td style="padding:4px 0; font:14px Arial, sans-serif; color:#1F2937;">{{changed_time}}</td>
        </tr>
        <tr>
          <td width="120" style="padding:4px 0; font:13px Arial, sans-serif; color:#6B7280;">Địa chỉ IP</td>
          <td style="padding:4px 0; font:14px Arial, sans-serif; color:#1F2937;">{{changed_ip}}</td>
        </tr>
      </table>
    </td>
  </tr>
</table>

<!-- Warning -->
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
  <tr>
    <td style="padding:16px 20px; background-color:#FEF3C7; border-radius:8px; border-left:4px solid #D97706;">
      <p style="margin:0; font:14px/22px Arial, sans-serif; color:#92400E;">
        Nếu bạn không thực hiện thay đổi này, hãy
        <a href="{{support_url}}" style="color:#D97706; font-weight:600;">liên hệ hỗ trợ ngay</a>
        để bảo vệ tài khoản.
      </p>
    </td>
  </tr>
</table>
```

---

### 4.5 TEMPLATE: New Device Login (Đăng nhập từ thiết bị mới)

**File:** `new-device-login.html`
**Trigger:** Phát hiện đăng nhập từ thiết bị/vị trí chưa nhận diện
**Subject:** `[ViLead] Đăng nhập mới từ thiết bị lạ`

#### Variables

```typescript
interface NewDeviceLoginVars {
  recipient_name: string;
  device_info: string;         // "Chrome trên Windows"
  location: string;            // "Hà Nội, Việt Nam"
  login_time: string;          // "02/02/2026 14:30"
  login_ip: string;
  secure_account_url: string;
}
```

#### Body Content

```html
<h1 style="margin:0 0 8px; font:700 24px Arial, Helvetica, sans-serif; color:#1F2937;">
  Phát hiện đăng nhập mới
</h1>
<p style="margin:0 0 24px; font:15px/24px Arial, Helvetica, sans-serif; color:#4B5563;">
  Tài khoản ViLead của bạn vừa được đăng nhập từ một thiết bị mới:
</p>

<!-- Device Info -->
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
       style="margin:0 0 24px;">
  <tr>
    <td style="padding:20px; background-color:#F9FAFB; border-radius:8px; border:1px solid #E5E7EB;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td width="120" style="padding:4px 0; font:13px Arial, sans-serif; color:#6B7280;">Thiết bị</td>
          <td style="padding:4px 0; font:14px Arial, sans-serif; color:#1F2937;">{{device_info}}</td>
        </tr>
        <tr>
          <td width="120" style="padding:4px 0; font:13px Arial, sans-serif; color:#6B7280;">Vị trí</td>
          <td style="padding:4px 0; font:14px Arial, sans-serif; color:#1F2937;">{{location}}</td>
        </tr>
        <tr>
          <td width="120" style="padding:4px 0; font:13px Arial, sans-serif; color:#6B7280;">Thời gian</td>
          <td style="padding:4px 0; font:14px Arial, sans-serif; color:#1F2937;">{{login_time}}</td>
        </tr>
        <tr>
          <td width="120" style="padding:4px 0; font:13px Arial, sans-serif; color:#6B7280;">IP</td>
          <td style="padding:4px 0; font:14px Arial, sans-serif; color:#1F2937;">{{login_ip}}</td>
        </tr>
      </table>
    </td>
  </tr>
</table>

<p style="margin:0 0 16px; font:15px/24px Arial, sans-serif; color:#4B5563;">
  Nếu đây là bạn, bạn có thể bỏ qua email này. Nếu không, hãy bảo vệ tài khoản ngay:
</p>

<!-- CTA -->
<table role="presentation" cellpadding="0" cellspacing="0" border="0">
  <tr>
    <td style="background-color:#DC2626; border-radius:6px;">
      <a href="{{secure_account_url}}" target="_blank"
         style="display:inline-block; padding:12px 28px; font:600 15px Arial, sans-serif;
                color:#FFFFFF; text-decoration:none;">
        Bảo vệ tài khoản
      </a>
    </td>
  </tr>
</table>
```

---

### 4.6 TEMPLATE: Account Locked (Tài khoản bị khóa)

**File:** `account-locked.html`
**Trigger:** Đăng nhập sai quá nhiều lần / Admin khóa tài khoản
**Subject:** `[ViLead] Tài khoản của bạn đã bị tạm khóa`

#### Variables

```typescript
interface AccountLockedVars {
  recipient_name: string;
  lock_reason: string;         // "đăng nhập sai mật khẩu 5 lần" | "quyết định của quản trị viên"
  lock_time: string;
  unlock_instructions: string; // "Tài khoản sẽ tự mở khóa sau 30 phút" | "Liên hệ quản trị viên"
  support_url: string;
}
```

#### Body Content

```html
<h1 style="margin:0 0 8px; font:700 24px Arial, Helvetica, sans-serif; color:#DC2626;">
  Tài khoản tạm khóa
</h1>
<p style="margin:0 0 24px; font:15px/24px Arial, Helvetica, sans-serif; color:#4B5563;">
  Tài khoản ViLead của bạn đã bị tạm khóa do <strong>{{lock_reason}}</strong>.
</p>

<!-- Info -->
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
       style="margin:0 0 24px;">
  <tr>
    <td style="padding:16px 20px; background-color:#FEF2F2; border-radius:8px; border-left:4px solid #DC2626;">
      <p style="margin:0 0 4px; font:600 14px Arial, sans-serif; color:#991B1B;">Cách mở khóa:</p>
      <p style="margin:0; font:14px/22px Arial, sans-serif; color:#7F1D1D;">
        {{unlock_instructions}}
      </p>
    </td>
  </tr>
</table>

<p style="margin:0; font:13px Arial, sans-serif; color:#9CA3AF;">
  Cần hỗ trợ? <a href="{{support_url}}" style="color:#2563EB;">Liên hệ đội ngũ hỗ trợ</a>
</p>
```

---

### 4.7 TEMPLATE: New Lead Assigned (Phân công lead mới)

**File:** `new-lead-assigned.html`
**Trigger:** Lead mới được phân công cho sales (tự động hoặc thủ công)
**Subject:** `[ViLead] Lead mới: {{lead_name}} — {{lead_source}}`

#### Variables

```typescript
interface NewLeadAssignedVars {
  recipient_name: string;      // Tên sales được phân công
  lead_name: string;           // "Trần Thị B"
  lead_phone: string;          // "0987654321"
  lead_email: string;          // "tranthi@gmail.com"
  lead_company?: string;       // "ABC Corp" (optional)
  lead_source: string;         // "Zalo OA" | "Facebook" | "Website" | "Manual"
  lead_score?: number;         // 75 (optional)
  lead_priority: string;       // "VIP" | "Urgent" | "High" | "Normal"
  assigned_by: string;         // "Hệ thống" | "Nguyễn Leader"
  sla_deadline: string;        // "5 phút" | "30 phút" | "2 giờ"
  lead_detail_url: string;
}
```

#### Body Content

```html
<h1 style="margin:0 0 8px; font:700 24px Arial, Helvetica, sans-serif; color:#1F2937;">
  Lead mới được phân công
</h1>
<p style="margin:0 0 24px; font:15px/24px Arial, Helvetica, sans-serif; color:#4B5563;">
  Bạn vừa được phân công lead mới. Vui lòng phản hồi trong <strong style="color:#DC2626;">{{sla_deadline}}</strong>.
</p>

<!-- Lead Info Card -->
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
       style="margin:0 0 24px;">
  <tr>
    <td style="padding:20px; background-color:#EFF6FF; border-radius:8px; border:1px solid #DBEAFE;">

      <!-- Priority Badge -->
      <!-- Chỉ hiển thị nếu priority != "Normal" -->
      <p style="margin:0 0 12px;">
        <span style="display:inline-block; padding:4px 12px; background-color:#DC2626; color:#FFFFFF;
                     font:600 11px Arial, sans-serif; border-radius:4px; text-transform:uppercase; letter-spacing:0.5px;">
          {{lead_priority}}
        </span>
      </p>

      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td width="110" style="padding:5px 0; font:13px Arial, sans-serif; color:#6B7280;">Tên</td>
          <td style="padding:5px 0; font:600 15px Arial, sans-serif; color:#1F2937;">{{lead_name}}</td>
        </tr>
        <tr>
          <td width="110" style="padding:5px 0; font:13px Arial, sans-serif; color:#6B7280;">Điện thoại</td>
          <td style="padding:5px 0; font:14px Arial, sans-serif; color:#1F2937;">{{lead_phone}}</td>
        </tr>
        <tr>
          <td width="110" style="padding:5px 0; font:13px Arial, sans-serif; color:#6B7280;">Email</td>
          <td style="padding:5px 0; font:14px Arial, sans-serif; color:#1F2937;">{{lead_email}}</td>
        </tr>
        <!-- Conditional: chỉ hiển thị nếu có -->
        <tr>
          <td width="110" style="padding:5px 0; font:13px Arial, sans-serif; color:#6B7280;">Công ty</td>
          <td style="padding:5px 0; font:14px Arial, sans-serif; color:#1F2937;">{{lead_company}}</td>
        </tr>
        <tr>
          <td width="110" style="padding:5px 0; font:13px Arial, sans-serif; color:#6B7280;">Nguồn</td>
          <td style="padding:5px 0; font:14px Arial, sans-serif; color:#1F2937;">{{lead_source}}</td>
        </tr>
        <tr>
          <td width="110" style="padding:5px 0; font:13px Arial, sans-serif; color:#6B7280;">Phân công bởi</td>
          <td style="padding:5px 0; font:14px Arial, sans-serif; color:#1F2937;">{{assigned_by}}</td>
        </tr>
      </table>
    </td>
  </tr>
</table>

<!-- CTA -->
<table role="presentation" cellpadding="0" cellspacing="0" border="0">
  <tr>
    <td style="background-color:#2563EB; border-radius:6px;">
      <a href="{{lead_detail_url}}" target="_blank"
         style="display:inline-block; padding:12px 28px; font:600 15px Arial, sans-serif;
                color:#FFFFFF; text-decoration:none;">
        Xem chi tiết lead
      </a>
    </td>
  </tr>
</table>
```

---

### 4.8 TEMPLATE: Task Reminder (Nhắc nhở công việc)

**File:** `task-reminder.html`
**Trigger:** Task sắp hết hạn (trước 24h và trước 1h)
**Subject:** `[ViLead] Nhắc nhở: "{{task_title}}" sắp hết hạn`

#### Variables

```typescript
interface TaskReminderVars {
  recipient_name: string;
  task_title: string;          // "Gửi báo giá cho khách A"
  task_deadline: string;       // "02/02/2026 17:00"
  time_remaining: string;      // "còn 1 giờ" | "còn 24 giờ"
  task_priority: string;       // "Cao" | "Trung bình" | "Thấp"
  assigned_by: string;         // "Nguyễn Leader"
  related_lead?: string;       // "Trần Thị B" (optional)
  task_detail_url: string;
}
```

#### Body Content

```html
<h1 style="margin:0 0 8px; font:700 24px Arial, Helvetica, sans-serif; color:#1F2937;">
  Công việc sắp hết hạn
</h1>
<p style="margin:0 0 24px; font:15px/24px Arial, Helvetica, sans-serif; color:#4B5563;">
  Công việc dưới đây <strong style="color:#D97706;">{{time_remaining}}</strong> nữa là đến hạn hoàn thành:
</p>

<!-- Task Card -->
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
       style="margin:0 0 24px;">
  <tr>
    <td style="padding:20px; background-color:#FFFBEB; border-radius:8px; border-left:4px solid #D97706;">
      <p style="margin:0 0 12px; font:600 16px Arial, sans-serif; color:#1F2937;">
        {{task_title}}
      </p>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td width="110" style="padding:3px 0; font:13px Arial, sans-serif; color:#6B7280;">Hạn hoàn thành</td>
          <td style="padding:3px 0; font:14px Arial, sans-serif; color:#92400E; font-weight:600;">{{task_deadline}}</td>
        </tr>
        <tr>
          <td width="110" style="padding:3px 0; font:13px Arial, sans-serif; color:#6B7280;">Mức ưu tiên</td>
          <td style="padding:3px 0; font:14px Arial, sans-serif; color:#1F2937;">{{task_priority}}</td>
        </tr>
        <tr>
          <td width="110" style="padding:3px 0; font:13px Arial, sans-serif; color:#6B7280;">Giao bởi</td>
          <td style="padding:3px 0; font:14px Arial, sans-serif; color:#1F2937;">{{assigned_by}}</td>
        </tr>
        <!-- Conditional -->
        <tr>
          <td width="110" style="padding:3px 0; font:13px Arial, sans-serif; color:#6B7280;">Lead liên quan</td>
          <td style="padding:3px 0; font:14px Arial, sans-serif; color:#1F2937;">{{related_lead}}</td>
        </tr>
      </table>
    </td>
  </tr>
</table>

<!-- CTA -->
<table role="presentation" cellpadding="0" cellspacing="0" border="0">
  <tr>
    <td style="background-color:#2563EB; border-radius:6px;">
      <a href="{{task_detail_url}}" target="_blank"
         style="display:inline-block; padding:12px 28px; font:600 15px Arial, sans-serif;
                color:#FFFFFF; text-decoration:none;">
        Mở công việc
      </a>
    </td>
  </tr>
</table>
```

---

### 4.9 TEMPLATE: Lead Stage Changed (Lead chuyển giai đoạn)

**File:** `lead-stage-changed.html`
**Trigger:** Lead được di chuyển sang giai đoạn mới trong pipeline
**Subject:** `[ViLead] Lead "{{lead_name}}" chuyển sang {{new_stage}}`

#### Variables

```typescript
interface LeadStageChangedVars {
  recipient_name: string;      // Sales phụ trách
  lead_name: string;
  old_stage: string;           // "Tiếp nhận"
  new_stage: string;           // "Tư vấn"
  changed_by: string;          // "Nguyễn Sales" | "Hệ thống"
  changed_time: string;
  lead_detail_url: string;
}
```

#### Body Content

```html
<h1 style="margin:0 0 8px; font:700 24px Arial, Helvetica, sans-serif; color:#1F2937;">
  Lead chuyển giai đoạn
</h1>
<p style="margin:0 0 24px; font:15px/24px Arial, Helvetica, sans-serif; color:#4B5563;">
  Lead <strong>{{lead_name}}</strong> đã được chuyển sang giai đoạn mới:
</p>

<!-- Stage Change Visual -->
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
       style="margin:0 0 24px;">
  <tr>
    <td style="padding:20px; background-color:#F9FAFB; border-radius:8px; border:1px solid #E5E7EB; text-align:center;">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center">
        <tr>
          <td style="padding:8px 16px; background-color:#FEE2E2; border-radius:6px;
                     font:600 14px Arial, sans-serif; color:#991B1B;">
            {{old_stage}}
          </td>
          <td style="padding:0 16px; font:20px Arial, sans-serif; color:#9CA3AF;">
            &rarr;
          </td>
          <td style="padding:8px 16px; background-color:#DCFCE7; border-radius:6px;
                     font:600 14px Arial, sans-serif; color:#166534;">
            {{new_stage}}
          </td>
        </tr>
      </table>
      <p style="margin:12px 0 0; font:12px Arial, sans-serif; color:#9CA3AF;">
        Thực hiện bởi {{changed_by}} · {{changed_time}}
      </p>
    </td>
  </tr>
</table>

<!-- CTA -->
<table role="presentation" cellpadding="0" cellspacing="0" border="0">
  <tr>
    <td style="background-color:#2563EB; border-radius:6px;">
      <a href="{{lead_detail_url}}" target="_blank"
         style="display:inline-block; padding:12px 28px; font:600 15px Arial, sans-serif;
                color:#FFFFFF; text-decoration:none;">
        Xem chi tiết lead
      </a>
    </td>
  </tr>
</table>
```

---

### 4.10 TEMPLATE: New Message from Customer (Tin nhắn mới)

**File:** `new-message.html`
**Trigger:** Khách hàng gửi tin nhắn qua Zalo OA / Facebook / Web Chat
**Subject:** `[ViLead] Tin nhắn mới từ {{customer_name}} ({{channel}})`

#### Variables

```typescript
interface NewMessageVars {
  recipient_name: string;      // Sales/CSKH
  customer_name: string;       // "Trần Thị B"
  channel: string;             // "Zalo OA" | "Facebook" | "Web Chat"
  message_preview: string;     // "Cho mình hỏi về gói Premium..." (max 200 chars)
  message_time: string;        // "02/02/2026 14:30"
  conversation_url: string;
}
```

#### Body Content

```html
<h1 style="margin:0 0 8px; font:700 24px Arial, Helvetica, sans-serif; color:#1F2937;">
  Tin nhắn mới
</h1>
<p style="margin:0 0 24px; font:15px/24px Arial, Helvetica, sans-serif; color:#4B5563;">
  Bạn có tin nhắn mới từ <strong>{{customer_name}}</strong> qua <strong>{{channel}}</strong>:
</p>

<!-- Message Preview -->
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
       style="margin:0 0 24px;">
  <tr>
    <td style="padding:16px 20px; background-color:#F3F4F6; border-radius:8px; border-left:4px solid #6B7280;">
      <p style="margin:0 0 8px; font:italic 14px/22px Arial, sans-serif; color:#374151;">
        "{{message_preview}}"
      </p>
      <p style="margin:0; font:12px Arial, sans-serif; color:#9CA3AF;">
        {{message_time}}
      </p>
    </td>
  </tr>
</table>

<!-- CTA -->
<table role="presentation" cellpadding="0" cellspacing="0" border="0">
  <tr>
    <td style="background-color:#2563EB; border-radius:6px;">
      <a href="{{conversation_url}}" target="_blank"
         style="display:inline-block; padding:12px 28px; font:600 15px Arial, sans-serif;
                color:#FFFFFF; text-decoration:none;">
        Trả lời ngay
      </a>
    </td>
  </tr>
</table>
```

---

### 4.11 TEMPLATE: New Order Notification (Đơn hàng mới)

**File:** `new-order.html`
**Trigger:** Đơn hàng mới được tạo (cho Sales hoặc Manager)
**Subject:** `[ViLead] Đơn hàng mới #{{order_code}} — {{customer_name}}`

#### Variables

```typescript
interface NewOrderVars {
  recipient_name: string;
  order_code: string;          // "DH-20260202-001"
  customer_name: string;
  customer_phone: string;
  products: Array<{
    name: string;              // "Gói Premium 1 năm"
    quantity: number;
    price: string;             // "5,000,000 ₫"
  }>;
  total_amount: string;        // "5,000,000 ₫"
  discount?: string;           // "500,000 ₫"
  final_amount: string;        // "4,500,000 ₫"
  created_by: string;          // "Nguyễn Sales"
  order_detail_url: string;
}
```

#### Body Content

```html
<h1 style="margin:0 0 8px; font:700 24px Arial, Helvetica, sans-serif; color:#1F2937;">
  Đơn hàng mới
</h1>
<p style="margin:0 0 24px; font:15px/24px Arial, Helvetica, sans-serif; color:#4B5563;">
  Đơn hàng <strong>#{{order_code}}</strong> vừa được tạo bởi {{created_by}}:
</p>

<!-- Customer Info -->
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
       style="margin:0 0 16px;">
  <tr>
    <td width="110" style="padding:4px 0; font:13px Arial, sans-serif; color:#6B7280;">Khách hàng</td>
    <td style="padding:4px 0; font:15px Arial, sans-serif; color:#1F2937;">{{customer_name}}</td>
  </tr>
  <tr>
    <td width="110" style="padding:4px 0; font:13px Arial, sans-serif; color:#6B7280;">SĐT</td>
    <td style="padding:4px 0; font:14px Arial, sans-serif; color:#1F2937;">{{customer_phone}}</td>
  </tr>
</table>

<!-- Order Items Table -->
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
       style="margin:0 0 16px; border:1px solid #E5E7EB; border-radius:8px; overflow:hidden;">
  <!-- Header -->
  <tr>
    <td style="padding:10px 16px; background-color:#F9FAFB; border-bottom:1px solid #E5E7EB;
               font:600 12px Arial, sans-serif; color:#6B7280; text-transform:uppercase; letter-spacing:0.5px;">
      Sản phẩm
    </td>
    <td width="60" align="center" style="padding:10px 8px; background-color:#F9FAFB; border-bottom:1px solid #E5E7EB;
               font:600 12px Arial, sans-serif; color:#6B7280; text-transform:uppercase;">
      SL
    </td>
    <td width="130" align="right" style="padding:10px 16px; background-color:#F9FAFB; border-bottom:1px solid #E5E7EB;
               font:600 12px Arial, sans-serif; color:#6B7280; text-transform:uppercase;">
      Thành tiền
    </td>
  </tr>
  <!-- Items (loop) -->
  <tr>
    <td style="padding:12px 16px; font:14px Arial, sans-serif; color:#1F2937; border-bottom:1px solid #F3F4F6;">
      {{product.name}}
    </td>
    <td align="center" style="padding:12px 8px; font:14px Arial, sans-serif; color:#1F2937; border-bottom:1px solid #F3F4F6;">
      {{product.quantity}}
    </td>
    <td align="right" style="padding:12px 16px; font:14px Arial, sans-serif; color:#1F2937; border-bottom:1px solid #F3F4F6;">
      {{product.price}}
    </td>
  </tr>
  <!-- Total -->
  <tr>
    <td colspan="2" align="right" style="padding:12px 16px; font:600 14px Arial, sans-serif; color:#1F2937;">
      Tổng cộng
    </td>
    <td align="right" style="padding:12px 16px; font:700 16px Arial, sans-serif; color:#2563EB;">
      {{final_amount}}
    </td>
  </tr>
</table>

<!-- CTA -->
<table role="presentation" cellpadding="0" cellspacing="0" border="0">
  <tr>
    <td style="background-color:#2563EB; border-radius:6px;">
      <a href="{{order_detail_url}}" target="_blank"
         style="display:inline-block; padding:12px 28px; font:600 15px Arial, sans-serif;
                color:#FFFFFF; text-decoration:none;">
        Xem chi tiết đơn hàng
      </a>
    </td>
  </tr>
</table>
```

---

### 4.12 TEMPLATE: Payment Reminder (Nhắc thanh toán)

**File:** `payment-reminder.html`
**Trigger:** Đơn hàng chưa thanh toán sau X giờ/ngày (tối đa 3 lần nhắc)
**Subject:** `[ViLead] Nhắc thanh toán đơn #{{order_code}} — {{customer_name}}`

#### Variables

```typescript
interface PaymentReminderVars {
  customer_name: string;
  order_code: string;
  amount: string;              // "4,500,000 ₫"
  due_date: string;            // "05/02/2026"
  reminder_count: number;      // 1 | 2 | 3
  bank_name?: string;          // "Vietcombank"
  bank_account?: string;       // "0123456789"
  bank_holder?: string;        // "CÔNG TY CP VILEAD"
  payment_url?: string;        // Link thanh toán online (nếu có)
  order_detail_url: string;
}
```

#### Body Content

```html
<h1 style="margin:0 0 8px; font:700 24px Arial, Helvetica, sans-serif; color:#1F2937;">
  Nhắc thanh toán
</h1>
<p style="margin:0 0 24px; font:15px/24px Arial, Helvetica, sans-serif; color:#4B5563;">
  Xin chào <strong>{{customer_name}}</strong>, đơn hàng <strong>#{{order_code}}</strong>
  hiện chưa được thanh toán. Vui lòng hoàn tất trước <strong style="color:#DC2626;">{{due_date}}</strong>.
</p>

<!-- Amount Highlight -->
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
       style="margin:0 0 24px;">
  <tr>
    <td style="padding:20px; background-color:#EFF6FF; border-radius:8px; text-align:center;">
      <p style="margin:0 0 4px; font:13px Arial, sans-serif; color:#6B7280;">Số tiền cần thanh toán</p>
      <p style="margin:0; font:700 28px Arial, sans-serif; color:#2563EB;">{{amount}}</p>
    </td>
  </tr>
</table>

<!-- Bank Info (conditional) -->
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
       style="margin:0 0 24px;">
  <tr>
    <td style="padding:16px 20px; background-color:#F9FAFB; border-radius:8px; border:1px solid #E5E7EB;">
      <p style="margin:0 0 10px; font:600 13px Arial, sans-serif; color:#6B7280; text-transform:uppercase; letter-spacing:0.5px;">
        Thông tin chuyển khoản
      </p>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td width="120" style="padding:4px 0; font:13px Arial, sans-serif; color:#6B7280;">Ngân hàng</td>
          <td style="padding:4px 0; font:14px Arial, sans-serif; color:#1F2937;">{{bank_name}}</td>
        </tr>
        <tr>
          <td width="120" style="padding:4px 0; font:13px Arial, sans-serif; color:#6B7280;">Số tài khoản</td>
          <td style="padding:4px 0; font:600 14px Arial, sans-serif; color:#1F2937;">{{bank_account}}</td>
        </tr>
        <tr>
          <td width="120" style="padding:4px 0; font:13px Arial, sans-serif; color:#6B7280;">Chủ tài khoản</td>
          <td style="padding:4px 0; font:14px Arial, sans-serif; color:#1F2937;">{{bank_holder}}</td>
        </tr>
        <tr>
          <td width="120" style="padding:4px 0; font:13px Arial, sans-serif; color:#6B7280;">Nội dung CK</td>
          <td style="padding:4px 0; font:600 14px Arial, sans-serif; color:#2563EB;">{{order_code}}</td>
        </tr>
      </table>
    </td>
  </tr>
</table>

<!-- CTA -->
<table role="presentation" cellpadding="0" cellspacing="0" border="0">
  <tr>
    <td style="background-color:#2563EB; border-radius:6px;">
      <a href="{{order_detail_url}}" target="_blank"
         style="display:inline-block; padding:12px 28px; font:600 15px Arial, sans-serif;
                color:#FFFFFF; text-decoration:none;">
        Xem chi tiết đơn hàng
      </a>
    </td>
  </tr>
</table>
```

---

### 4.13 TEMPLATE: SLA Escalation (Cảnh báo vi phạm SLA)

**File:** `sla-escalation.html`
**Trigger:** Sales không phản hồi lead trong thời gian SLA quy định
**Subject:** `[ViLead] ⚠ Vi phạm SLA: Lead "{{lead_name}}" chưa được phản hồi`

#### Variables

```typescript
interface SLAEscalationVars {
  recipient_name: string;      // Manager
  sales_name: string;          // Sales vi phạm
  lead_name: string;
  lead_priority: string;       // "VIP" | "High" | "Normal"
  sla_limit: string;           // "30 phút"
  time_elapsed: string;        // "45 phút"
  assigned_time: string;       // "02/02/2026 14:00"
  lead_detail_url: string;
  reassign_url: string;
}
```

#### Body Content

```html
<h1 style="margin:0 0 8px; font:700 24px Arial, Helvetica, sans-serif; color:#D97706;">
  Cảnh báo SLA
</h1>
<p style="margin:0 0 24px; font:15px/24px Arial, Helvetica, sans-serif; color:#4B5563;">
  Lead <strong>{{lead_name}}</strong> ({{lead_priority}}) đã quá hạn SLA phản hồi.
</p>

<!-- SLA Detail -->
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
       style="margin:0 0 24px;">
  <tr>
    <td style="padding:20px; background-color:#FEF3C7; border-radius:8px; border-left:4px solid #D97706;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td width="130" style="padding:4px 0; font:13px Arial, sans-serif; color:#92400E;">Sales phụ trách</td>
          <td style="padding:4px 0; font:600 14px Arial, sans-serif; color:#78350F;">{{sales_name}}</td>
        </tr>
        <tr>
          <td width="130" style="padding:4px 0; font:13px Arial, sans-serif; color:#92400E;">SLA quy định</td>
          <td style="padding:4px 0; font:14px Arial, sans-serif; color:#78350F;">{{sla_limit}}</td>
        </tr>
        <tr>
          <td width="130" style="padding:4px 0; font:13px Arial, sans-serif; color:#92400E;">Thời gian đã trôi</td>
          <td style="padding:4px 0; font:700 14px Arial, sans-serif; color:#DC2626;">{{time_elapsed}}</td>
        </tr>
        <tr>
          <td width="130" style="padding:4px 0; font:13px Arial, sans-serif; color:#92400E;">Phân công lúc</td>
          <td style="padding:4px 0; font:14px Arial, sans-serif; color:#78350F;">{{assigned_time}}</td>
        </tr>
      </table>
    </td>
  </tr>
</table>

<!-- Dual CTAs -->
<table role="presentation" cellpadding="0" cellspacing="0" border="0">
  <tr>
    <td style="padding-right:12px;">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td style="background-color:#2563EB; border-radius:6px;">
            <a href="{{lead_detail_url}}" target="_blank"
               style="display:inline-block; padding:12px 24px; font:600 14px Arial, sans-serif;
                      color:#FFFFFF; text-decoration:none;">
              Xem lead
            </a>
          </td>
        </tr>
      </table>
    </td>
    <td>
      <table role="presentation" cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td style="border:1px solid #D97706; border-radius:6px;">
            <a href="{{reassign_url}}" target="_blank"
               style="display:inline-block; padding:11px 24px; font:600 14px Arial, sans-serif;
                      color:#D97706; text-decoration:none;">
              Phân công lại
            </a>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>
```

---

## 5. EMAIL TEMPLATES — PHASE 2 (MARKETING & ADVANCED)

---

### 5.1 TEMPLATE: Daily/Weekly Report (Báo cáo định kỳ)

**File:** `periodic-report.html`
**Trigger:** Tự động gửi theo lịch (hàng ngày 9h, hàng tuần thứ 2)
**Subject:** `[ViLead] Báo cáo {{report_period}} — {{report_date}}`

#### Variables

```typescript
interface PeriodicReportVars {
  recipient_name: string;
  report_period: string;       // "ngày" | "tuần" | "tháng"
  report_date: string;         // "02/02/2026" | "Tuần 05/2026"
  metrics: {
    new_leads: number;
    converted_leads: number;
    conversion_rate: string;   // "32%"
    new_orders: number;
    revenue: string;           // "125,000,000 ₫"
    tasks_completed: number;
    tasks_overdue: number;
  };
  top_sales?: Array<{
    name: string;
    leads_converted: number;
    revenue: string;
  }>;
  dashboard_url: string;
}
```

#### Body Content

```html
<h1 style="margin:0 0 4px; font:700 24px Arial, Helvetica, sans-serif; color:#1F2937;">
  Báo cáo {{report_period}}
</h1>
<p style="margin:0 0 24px; font:14px Arial, sans-serif; color:#9CA3AF;">
  {{report_date}}
</p>

<!-- KPI Grid (2 columns) -->
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
       style="margin:0 0 24px;">
  <tr>
    <td width="50%" style="padding:0 6px 12px 0; vertical-align:top;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td style="padding:16px; background-color:#EFF6FF; border-radius:8px; text-align:center;">
            <p style="margin:0; font:700 24px Arial, sans-serif; color:#2563EB;">{{metrics.new_leads}}</p>
            <p style="margin:4px 0 0; font:12px Arial, sans-serif; color:#6B7280;">Lead mới</p>
          </td>
        </tr>
      </table>
    </td>
    <td width="50%" style="padding:0 0 12px 6px; vertical-align:top;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td style="padding:16px; background-color:#ECFDF5; border-radius:8px; text-align:center;">
            <p style="margin:0; font:700 24px Arial, sans-serif; color:#059669;">{{metrics.conversion_rate}}</p>
            <p style="margin:4px 0 0; font:12px Arial, sans-serif; color:#6B7280;">Tỷ lệ chuyển đổi</p>
          </td>
        </tr>
      </table>
    </td>
  </tr>
  <tr>
    <td width="50%" style="padding:0 6px 12px 0; vertical-align:top;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td style="padding:16px; background-color:#F5F3FF; border-radius:8px; text-align:center;">
            <p style="margin:0; font:700 24px Arial, sans-serif; color:#7C3AED;">{{metrics.new_orders}}</p>
            <p style="margin:4px 0 0; font:12px Arial, sans-serif; color:#6B7280;">Đơn hàng mới</p>
          </td>
        </tr>
      </table>
    </td>
    <td width="50%" style="padding:0 0 12px 6px; vertical-align:top;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td style="padding:16px; background-color:#FFF7ED; border-radius:8px; text-align:center;">
            <p style="margin:0; font:700 20px Arial, sans-serif; color:#EA580C;">{{metrics.revenue}}</p>
            <p style="margin:4px 0 0; font:12px Arial, sans-serif; color:#6B7280;">Doanh thu</p>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>

<!-- Task Summary -->
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
       style="margin:0 0 24px;">
  <tr>
    <td style="padding:12px 16px; background-color:#F9FAFB; border-radius:8px; border:1px solid #E5E7EB;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td style="font:14px Arial, sans-serif; color:#4B5563;">
            Công việc hoàn thành: <strong>{{metrics.tasks_completed}}</strong>
          </td>
          <td align="right" style="font:14px Arial, sans-serif; color:#DC2626;">
            Quá hạn: <strong>{{metrics.tasks_overdue}}</strong>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>

<!-- CTA -->
<table role="presentation" cellpadding="0" cellspacing="0" border="0">
  <tr>
    <td style="background-color:#2563EB; border-radius:6px;">
      <a href="{{dashboard_url}}" target="_blank"
         style="display:inline-block; padding:12px 28px; font:600 15px Arial, sans-serif;
                color:#FFFFFF; text-decoration:none;">
        Xem dashboard đầy đủ
      </a>
    </td>
  </tr>
</table>
```

---

### 5.2 TEMPLATE: Marketing Campaign (Mẫu chiến dịch)

**File:** `marketing-campaign.html`
**Trigger:** Gửi chiến dịch email marketing
**Subject:** `{{campaign_subject}}` (tùy chỉnh)

#### Variables

```typescript
interface MarketingCampaignVars {
  recipient_name: string;
  campaign_subject: string;
  hero_image_url?: string;     // Banner (optional)
  headline: string;            // "Ưu đãi đặc biệt tháng 2"
  body_text: string;           // Nội dung chính (HTML)
  cta_text: string;            // "Nhận ưu đãi ngay"
  cta_url: string;
  unsubscribe_url: string;
}
```

#### Body Content

```html
<!-- Hero Image (optional) -->
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
       style="margin:0 0 24px;">
  <tr>
    <td>
      <img src="{{hero_image_url}}" alt="" width="536" style="display:block; width:100%; max-width:536px;
           height:auto; border-radius:8px; border:0;" />
    </td>
  </tr>
</table>

<!-- Content -->
<h1 style="margin:0 0 16px; font:700 24px Arial, Helvetica, sans-serif; color:#1F2937;">
  {{headline}}
</h1>
<div style="margin:0 0 24px; font:15px/24px Arial, Helvetica, sans-serif; color:#4B5563;">
  {{body_text}}
</div>

<!-- CTA -->
<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 32px;">
  <tr>
    <td style="background-color:#2563EB; border-radius:6px;">
      <a href="{{cta_url}}" target="_blank"
         style="display:inline-block; padding:14px 32px; font:600 15px Arial, sans-serif;
                color:#FFFFFF; text-decoration:none;">
        {{cta_text}}
      </a>
    </td>
  </tr>
</table>

<!-- Unsubscribe -->
<p style="margin:0; font:11px Arial, sans-serif; color:#9CA3AF; text-align:center; border-top:1px solid #E5E7EB; padding-top:16px;">
  Bạn nhận email này vì đã đăng ký nhận thông tin từ ViLead.
  <a href="{{unsubscribe_url}}" style="color:#9CA3AF; text-decoration:underline;">Hủy đăng ký</a>
</p>
```

---

### 5.3 TEMPLATE: System Maintenance (Bảo trì hệ thống)

**File:** `system-maintenance.html`
**Trigger:** Admin lên lịch bảo trì, hoặc hệ thống gặp sự cố
**Subject:** `[ViLead] Thông báo bảo trì hệ thống — {{maintenance_date}}`

#### Variables

```typescript
interface SystemMaintenanceVars {
  recipient_name: string;
  maintenance_type: string;    // "bảo trì định kỳ" | "cập nhật hệ thống" | "sự cố kỹ thuật"
  start_time: string;          // "02/02/2026 22:00"
  end_time: string;            // "03/02/2026 02:00"
  affected_services: string;   // "Tất cả module" | "Module Chat, Email"
  description?: string;        // Mô tả bổ sung
  status_page_url?: string;
}
```

#### Body Content

```html
<h1 style="margin:0 0 8px; font:700 24px Arial, Helvetica, sans-serif; color:#1F2937;">
  Thông báo {{maintenance_type}}
</h1>
<p style="margin:0 0 24px; font:15px/24px Arial, Helvetica, sans-serif; color:#4B5563;">
  Hệ thống CRM ViLead sẽ tạm ngừng hoạt động trong thời gian sau:
</p>

<!-- Schedule -->
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
       style="margin:0 0 24px;">
  <tr>
    <td style="padding:20px; background-color:#EFF6FF; border-radius:8px; border:1px solid #DBEAFE;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td width="120" style="padding:5px 0; font:13px Arial, sans-serif; color:#6B7280;">Bắt đầu</td>
          <td style="padding:5px 0; font:600 15px Arial, sans-serif; color:#1F2937;">{{start_time}}</td>
        </tr>
        <tr>
          <td width="120" style="padding:5px 0; font:13px Arial, sans-serif; color:#6B7280;">Kết thúc (dự kiến)</td>
          <td style="padding:5px 0; font:600 15px Arial, sans-serif; color:#1F2937;">{{end_time}}</td>
        </tr>
        <tr>
          <td width="120" style="padding:5px 0; font:13px Arial, sans-serif; color:#6B7280;">Ảnh hưởng</td>
          <td style="padding:5px 0; font:14px Arial, sans-serif; color:#1F2937;">{{affected_services}}</td>
        </tr>
      </table>
    </td>
  </tr>
</table>

<p style="margin:0; font:14px/22px Arial, sans-serif; color:#4B5563;">
  Chúng tôi sẽ thông báo khi hệ thống hoạt động trở lại. Xin lỗi vì sự bất tiện này.
</p>
```

---

## 6. GLOBAL VARIABLES

Các biến dùng chung cho tất cả templates (inject ở footer):

```typescript
interface GlobalVars {
  logo_url: string;            // URL logo ViLead (120px width)
  company_name: string;        // "Công ty CP ViLead"
  company_address: string;     // "Tầng X, Tòa nhà Y, ..."
  hotline: string;             // "0246.XXX.XXXX"
  support_email: string;       // "support@vilead.vn"
  website_url: string;         // "https://vilead.vn"
  current_year: number;        // 2026
}
```

---

## 7. IMPLEMENTATION GUIDE

### 7.1 File Structure

```
/emails
├── templates/
│   ├── base.html                   ← Base layout wrapper
│   ├── components/
│   │   ├── header.html             ← Logo header
│   │   ├── footer.html             ← Company footer
│   │   ├── cta-primary.html        ← Primary button
│   │   ├── cta-secondary.html      ← Outline button
│   │   ├── info-box.html           ← Blue info box
│   │   ├── warning-box.html        ← Yellow warning box
│   │   ├── danger-box.html         ← Red danger box
│   │   ├── data-row.html           ← Key-value row
│   │   ├── divider.html            ← Horizontal divider
│   │   └── otp-code.html           ← Code display
│   ├── system/
│   │   ├── otp-verification.html
│   │   ├── welcome.html
│   │   ├── password-reset.html
│   │   ├── password-changed.html
│   │   ├── new-device-login.html
│   │   ├── account-locked.html
│   │   └── system-maintenance.html
│   ├── notification/
│   │   ├── new-lead-assigned.html
│   │   ├── task-reminder.html
│   │   ├── lead-stage-changed.html
│   │   ├── new-message.html
│   │   ├── new-order.html
│   │   ├── payment-reminder.html
│   │   └── sla-escalation.html
│   └── marketing/
│       ├── campaign.html
│       └── periodic-report.html
├── data/
│   └── test-data.json              ← Mock data cho testing
└── README.md
```

### 7.2 Template Engine Integration

Templates sử dụng syntax `{{variable}}` tương thích với hầu hết template engines:

| Engine | Syntax | Ghi chú |
|--------|--------|---------|
| Handlebars | `{{variable}}` | Native support |
| EJS | `<%= variable %>` | Cần convert |
| Nunjucks | `{{ variable }}` | Native support |
| Mustache | `{{variable}}` | Native support |

### 7.3 Conditional Rendering

Sử dụng comment trong HTML để đánh dấu sections có điều kiện:

```html
<!-- IF lead_company -->
<tr>
  <td>Công ty</td>
  <td>{{lead_company}}</td>
</tr>
<!-- ENDIF -->
```

Backend cần xử lý logic render trước khi gửi.

---

## 8. TESTING CHECKLIST

### 8.1 Visual Testing

| Test | Expected |
|------|----------|
| Gmail Web | Hiển thị đúng, CTA clickable, responsive |
| Gmail App (iOS/Android) | Responsive, font readable |
| Outlook 2016+ | Table layout đúng, border-radius fallback |
| Apple Mail | Full support |
| Dark mode (Gmail, Apple) | Text readable, không mất background |

### 8.2 Content Testing

| Test | Expected |
|------|----------|
| Tiếng Việt (dấu đầy đủ) | Hiển thị đúng: ă, â, ê, ô, ơ, ư, đ |
| Long content | Không bị overflow, word-wrap đúng |
| Missing variables | Hiển thị fallback hoặc ẩn section |
| Empty optional fields | Section ẩn, không hiện label trống |

### 8.3 Deliverability Testing

| Test | Expected |
|------|----------|
| Spam score (Mail Tester) | Score ≥ 8/10 |
| SPF/DKIM/DMARC | Pass |
| Image blocking | Email vẫn đọc được khi ảnh bị chặn |
| Plain text fallback | Có version plain text kèm theo |

---

## 9. ACCEPTANCE CRITERIA

### 9.1 Design Quality

- [ ] Tất cả templates dùng chung base structure (header/footer)
- [ ] Consistent typography: Arial/Helvetica, đúng size theo design tokens
- [ ] Consistent color: chỉ dùng màu trong design tokens
- [ ] Consistent spacing: padding/margin theo spacing tokens
- [ ] Không có icon trang trí, không gradient, không shadow phức tạp
- [ ] CTA buttons rõ ràng, dễ nhấn (min height 44px)

### 9.2 Technical Quality

- [ ] HTML valid, inline CSS only
- [ ] Table-based layout (không div cho structure)
- [ ] `role="presentation"` trên tất cả layout tables
- [ ] UTF-8 encoding khai báo đúng
- [ ] Max width 600px, responsive trên mobile
- [ ] Tất cả links có `target="_blank"`
- [ ] Alt text cho tất cả images

### 9.3 Content Quality

- [ ] Văn phong ngắn gọn, chuyên nghiệp
- [ ] Đi thẳng vào vấn đề, không văn hoa
- [ ] Mỗi email có 1 CTA chính rõ ràng
- [ ] Thông tin liên hệ ở footer
- [ ] Disclaimer "email tự động" ở footer

---

## 10. SAMPLE TEST DATA

```json
{
  "global": {
    "logo_url": "https://app.vilead.vn/assets/logo.png",
    "company_name": "Công ty CP ViLead",
    "company_address": "Tầng 8, Tòa nhà ABC Tower, 123 Nguyễn Huệ, Q.1, TP.HCM",
    "hotline": "028.1234.5678",
    "support_email": "support@vilead.vn",
    "website_url": "https://vilead.vn",
    "current_year": 2026
  },
  "otp_verification": {
    "recipient_name": "Nguyễn Văn A",
    "otp_code": "847291",
    "expiry_minutes": 5,
    "action_description": "xác thực tài khoản"
  },
  "welcome": {
    "recipient_name": "Nguyễn Văn A",
    "login_url": "https://app.vilead.vn/login",
    "email": "nguyenvana@company.com",
    "role": "Sales"
  },
  "password_reset": {
    "recipient_name": "Nguyễn Văn A",
    "reset_url": "https://app.vilead.vn/reset?token=abc123",
    "expiry_minutes": 30,
    "request_ip": "103.45.67.89",
    "request_time": "02/02/2026 14:30"
  },
  "new_lead_assigned": {
    "recipient_name": "Trần Sales",
    "lead_name": "Lê Thị C",
    "lead_phone": "0987654321",
    "lead_email": "lethic@abccorp.vn",
    "lead_company": "ABC Corp",
    "lead_source": "Zalo OA",
    "lead_score": 75,
    "lead_priority": "High",
    "assigned_by": "Hệ thống (Round-Robin)",
    "sla_deadline": "30 phút",
    "lead_detail_url": "https://app.vilead.vn/leads/12345"
  },
  "task_reminder": {
    "recipient_name": "Trần Sales",
    "task_title": "Gửi báo giá gói Premium cho ABC Corp",
    "task_deadline": "02/02/2026 17:00",
    "time_remaining": "còn 1 giờ",
    "task_priority": "Cao",
    "assigned_by": "Nguyễn Leader",
    "related_lead": "Lê Thị C",
    "task_detail_url": "https://app.vilead.vn/tasks/67890"
  },
  "new_order": {
    "recipient_name": "Nguyễn Leader",
    "order_code": "DH-20260202-001",
    "customer_name": "Lê Thị C",
    "customer_phone": "0987654321",
    "products": [
      { "name": "Gói CRM Premium — 1 năm", "quantity": 1, "price": "12,000,000 ₫" },
      { "name": "Module Email Marketing", "quantity": 1, "price": "3,000,000 ₫" }
    ],
    "total_amount": "15,000,000 ₫",
    "discount": "1,500,000 ₫",
    "final_amount": "13,500,000 ₫",
    "created_by": "Trần Sales",
    "order_detail_url": "https://app.vilead.vn/orders/DH-20260202-001"
  },
  "payment_reminder": {
    "customer_name": "Lê Thị C",
    "order_code": "DH-20260202-001",
    "amount": "13,500,000 ₫",
    "due_date": "07/02/2026",
    "reminder_count": 1,
    "bank_name": "Vietcombank",
    "bank_account": "0123456789",
    "bank_holder": "CÔNG TY CP VILEAD",
    "order_detail_url": "https://app.vilead.vn/orders/DH-20260202-001"
  }
}
```

---

## 11. NOTES FOR AI CODE ASSISTANTS

### Do's
- Sử dụng inline CSS cho mọi element
- Dùng `role="presentation"` cho layout tables
- Dùng `border-collapse: collapse` cho Outlook
- Test với Litmus hoặc Email on Acid
- Luôn có plain-text fallback version
- Sử dụng `<!--[if mso]>` cho Outlook-specific fixes

### Don'ts
- Không dùng CSS `position`, `float`, `flexbox`, `grid`
- Không dùng external stylesheet hoặc `<style>` tag (Gmail strips)
- Không dùng `<div>` cho layout structure (chỉ dùng cho content)
- Không dùng background-image trong CSS (hỗ trợ kém)
- Không dùng `margin` trên `<td>` (dùng `padding` thay thế)
- Không dùng SVG inline (dùng PNG/JPG)
- Không load Google Fonts (dùng system fonts)
- Không dùng emoji trong subject line (spam filter)

### Priority Badge Colors

```
VIP     → background: #7C3AED; color: #FFFFFF;
Urgent  → background: #DC2626; color: #FFFFFF;
High    → background: #D97706; color: #FFFFFF;
Normal  → background: #6B7280; color: #FFFFFF;
```

---

*Document Version: 2.0*
*Generated for: AI Code Assistants (Copilot, Claude Code, Cursor AI)*
*Module: System Email & Marketing Email*
*Source: CRM ViLead — Phase 1 & Phase 2 Features*
