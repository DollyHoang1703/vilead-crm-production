# EMAIL TEMPLATES SPECIFICATION - CRM VILEAD

## CONTEXT & PURPOSE

Tạo hệ thống email templates cho CRM ViLead, một nền tảng quản lý khách hàng dành cho thị trường Việt Nam. Các template này sẽ được sử dụng để gửi email tự động trong các tình huống: quản lý tài khoản, bảo mật, quản lý leads/khách hàng, và email marketing.

## TECHNICAL REQUIREMENTS

### 1. Technology Stack
- **HTML Email Template** - Responsive, compatible với tất cả email clients
- **CSS Inline** - Tất cả CSS phải inline để tương thích với email clients
- **Template Engine Support** - Support handlebars/mustache syntax cho personalization
- **Encoding** - UTF-8 để support tiếng Việt

### 2. Design Requirements
- **Width**: Max 600px (chuẩn email)
- **Responsive**: Mobile-first approach
- **Font**: System fonts (Arial, Helvetica, sans-serif)
- **Color Scheme**:
  - Primary: #1E40AF (Blue)
  - Success: #059669 (Green)
  - Warning: #F59E0B (Orange)
  - Danger: #DC2626 (Red)
  - Text: #1F2937 (Dark Gray)
  - Background: #F9FAFB (Light Gray)

### 3. Email Client Compatibility
- Gmail (Desktop & Mobile)
- Outlook (2010, 2013, 2016, 2019, 365)
- Apple Mail (iOS & macOS)
- Yahoo Mail
- Mobile email clients

### 4. Structure Requirements
```
├── Header
│   ├── Logo (ViLead CRM)
│   └── Brand colors
├── Body
│   ├── Greeting
│   ├── Main Content
│   ├── CTA Buttons
│   └── Additional Information
└── Footer
    ├── Contact Information
    ├── Social Media Links
    ├── Unsubscribe Link
    └── Copyright
```

---

## BASE TEMPLATE STRUCTURE

### Common Header
```html
<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{email_title}}</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, Helvetica, sans-serif; background-color: #F9FAFB;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
        <tr>
            <td align="center" style="padding: 20px 0;">
                <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; background-color: #FFFFFF;">
                    <!-- Header -->
                    <tr>
                        <td style="background-color: #1E40AF; padding: 30px; text-align: center;">
                            <h1 style="margin: 0; color: #FFFFFF; font-size: 24px;">ViLead CRM</h1>
                        </td>
                    </tr>
                    <!-- Main Content -->
                    <tr>
                        <td style="padding: 40px 30px;">
                            {{content}}
                        </td>
                    </tr>
                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #F3F4F6; padding: 30px; text-align: center; font-size: 12px; color: #6B7280;">
                            {{footer}}
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
```

### Common Footer
```html
<p style="margin: 0 0 10px 0;">
    <strong>CRM ViLead</strong><br>
    Địa chỉ: [Địa chỉ công ty]<br>
    Hotline: 1900 xxxx | Email: support@vilead.vn
</p>
<p style="margin: 10px 0;">
    <a href="{{facebook_url}}" style="text-decoration: none; margin: 0 5px;">Facebook</a> |
    <a href="{{linkedin_url}}" style="text-decoration: none; margin: 0 5px;">LinkedIn</a> |
    <a href="{{youtube_url}}" style="text-decoration: none; margin: 0 5px;">YouTube</a>
</p>
<p style="margin: 10px 0; font-size: 11px;">
    <a href="{{unsubscribe_url}}" style="color: #6B7280; text-decoration: underline;">Hủy đăng ký nhận email</a>
</p>
<p style="margin: 10px 0;">© 2024 ViLead CRM. All rights reserved.</p>
```

### CTA Button Component
```html
<table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center" style="margin: 20px 0;">
    <tr>
        <td style="border-radius: 4px; background-color: #1E40AF;">
            <a href="{{cta_url}}" style="display: inline-block; padding: 12px 30px; font-size: 16px; color: #FFFFFF; text-decoration: none; font-weight: bold;">
                {{cta_text}}
            </a>
        </td>
    </tr>
</table>
```

---

## EMAIL TEMPLATES DETAILED SPECIFICATIONS

## 1. QUẢN LÝ TÀI KHOẢN & BẢO MẬT

### 1.1 OTP Verification Email

**File Name**: `otp-verification.html`

**Subject Line**: `[ViLead CRM] Mã OTP xác thực tài khoản của bạn`

**Variables**:
```javascript
{
  full_name: string,
  otp_code: string,      // 6 digits
  email: string,
  timestamp: datetime,
  ip_address: string,
  expires_in: number     // minutes
}
```

**Content Structure**:
```html
<!-- Greeting -->
<p style="font-size: 16px; color: #1F2937; margin: 0 0 20px 0;">
    Xin chào <strong>{{full_name}}</strong>,
</p>

<!-- OTP Code Box -->
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 30px 0;">
    <tr>
        <td align="center">
            <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="border: 2px solid #1E40AF; border-radius: 8px; background-color: #EFF6FF;">
                <tr>
                    <td style="padding: 30px; text-align: center;">
                        <p style="margin: 0 0 10px 0; font-size: 14px; color: #6B7280;">MÃ OTP CỦA BẠN</p>
                        <p style="margin: 0; font-size: 36px; font-weight: bold; color: #1E40AF; letter-spacing: 8px;">
                            {{otp_code}}
                        </p>
                        <p style="margin: 15px 0 0 0; font-size: 12px; color: #EF4444;">
                            ⏰ Có hiệu lực trong {{expires_in}} phút
                        </p>
                    </td>
                </tr>
            </table>
        </td>
    </tr>
</table>

<!-- Instructions -->
<p style="font-size: 14px; color: #1F2937; margin: 20px 0;">
    Vui lòng nhập mã này để hoàn tất việc đăng ký tài khoản.
</p>

<!-- Security Warning Box -->
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 20px 0;">
    <tr>
        <td style="background-color: #FEF2F2; border-left: 4px solid #DC2626; padding: 15px;">
            <p style="margin: 0 0 10px 0; font-size: 14px; font-weight: bold; color: #DC2626;">
                ⚠️ LƯU Ý BẢO MẬT:
            </p>
            <ul style="margin: 0; padding-left: 20px; font-size: 13px; color: #1F2937;">
                <li>Không chia sẻ mã OTP này với bất kỳ ai</li>
                <li>Nếu bạn không thực hiện yêu cầu này, vui lòng bỏ qua email</li>
                <li>Mã OTP sẽ hết hiệu lực sau {{expires_in}} phút</li>
            </ul>
        </td>
    </tr>
</table>

<!-- Request Details -->
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 20px 0; border-top: 1px solid #E5E7EB; padding-top: 15px;">
    <tr>
        <td style="font-size: 12px; color: #6B7280;">
            <p style="margin: 5px 0;"><strong>Thông tin yêu cầu:</strong></p>
            <p style="margin: 5px 0;">• Email: {{email}}</p>
            <p style="margin: 5px 0;">• Thời gian: {{timestamp}}</p>
            <p style="margin: 5px 0;">• IP Address: {{ip_address}}</p>
        </td>
    </tr>
</table>

<!-- Support Contact -->
<p style="font-size: 13px; color: #6B7280; margin: 20px 0;">
    Cần hỗ trợ? Liên hệ: <a href="mailto:support@vilead.vn" style="color: #1E40AF;">support@vilead.vn</a> | Hotline: 1900 xxxx
</p>

<!-- Closing -->
<p style="font-size: 14px; color: #1F2937; margin: 30px 0 0 0;">
    Trân trọng,<br>
    <strong>ViLead CRM Team</strong>
</p>
```

---

### 1.2 Password Changed Confirmation

**File Name**: `password-changed.html`

**Subject Line**: `[ViLead CRM] Mật khẩu của bạn đã được thay đổi thành công`

**Variables**:
```javascript
{
  full_name: string,
  timestamp: datetime,
  location: string,        // "Hà Nội, Vietnam"
  device_info: string,     // "Chrome on Windows 10"
  ip_address: string,
  recovery_url: string
}
```

**Content Structure**:
```html
<!-- Greeting -->
<p style="font-size: 16px; color: #1F2937; margin: 0 0 20px 0;">
    Xin chào <strong>{{full_name}}</strong>,
</p>

<!-- Success Message -->
<p style="font-size: 14px; color: #1F2937; margin: 0 0 20px 0;">
    Mật khẩu tài khoản ViLead CRM của bạn vừa được thay đổi thành công.
</p>

<!-- Change Details Box -->
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 20px 0;">
    <tr>
        <td style="background-color: #F0FDF4; border-left: 4px solid #059669; padding: 15px;">
            <p style="margin: 0 0 10px 0; font-size: 14px; font-weight: bold; color: #059669;">
                ✅ THÔNG TIN THAY ĐỔI:
            </p>
            <p style="margin: 5px 0; font-size: 13px; color: #1F2937;">• <strong>Thời gian:</strong> {{timestamp}}</p>
            <p style="margin: 5px 0; font-size: 13px; color: #1F2937;">• <strong>Địa điểm:</strong> {{location}}</p>
            <p style="margin: 5px 0; font-size: 13px; color: #1F2937;">• <strong>Thiết bị:</strong> {{device_info}}</p>
            <p style="margin: 5px 0; font-size: 13px; color: #1F2937;">• <strong>IP Address:</strong> {{ip_address}}</p>
        </td>
    </tr>
</table>

<!-- Security Alert Box -->
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 30px 0;">
    <tr>
        <td style="background-color: #FEF2F2; border-left: 4px solid #DC2626; padding: 20px;">
            <p style="margin: 0 0 10px 0; font-size: 14px; font-weight: bold; color: #DC2626;">
                🔒 BẢO MẬT TÀI KHOẢN:
            </p>
            <p style="margin: 0 0 20px 0; font-size: 14px; color: #1F2937;">
                Nếu <strong>KHÔNG PHẢI BẠN</strong> thực hiện thay đổi này, tài khoản của bạn có thể đã bị xâm nhập.
            </p>
            <!-- Recovery CTA Button -->
            <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin: 0;">
                <tr>
                    <td style="border-radius: 4px; background-color: #DC2626;">
                        <a href="{{recovery_url}}" style="display: inline-block; padding: 12px 24px; font-size: 14px; color: #FFFFFF; text-decoration: none; font-weight: bold;">
                            KHÔI PHỤC TÀI KHOẢN NGAY
                        </a>
                    </td>
                </tr>
            </table>
            <p style="margin: 15px 0 0 0; font-size: 13px; color: #6B7280;">
                Hoặc liên hệ ngay với chúng tôi:<br>
                📧 <a href="mailto:security@vilead.vn" style="color: #DC2626;">security@vilead.vn</a><br>
                📞 Hotline: 1900 xxxx (24/7)
            </p>
        </td>
    </tr>
</table>

<!-- Security Recommendations -->
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 20px 0; border-top: 1px solid #E5E7EB; padding-top: 20px;">
    <tr>
        <td>
            <p style="margin: 0 0 10px 0; font-size: 14px; font-weight: bold; color: #1F2937;">
                KHUYẾN NGHỊ BẢO MẬT:
            </p>
            <ul style="margin: 0; padding-left: 20px; font-size: 13px; color: #6B7280;">
                <li>Sử dụng mật khẩu mạnh (tối thiểu 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt)</li>
                <li>Không sử dụng lại mật khẩu đã dùng cho các tài khoản khác</li>
                <li>Bật xác thực 2 yếu tố (2FA) để tăng cường bảo mật</li>
            </ul>
        </td>
    </tr>
</table>

<!-- Closing -->
<p style="font-size: 14px; color: #1F2937; margin: 30px 0 0 0;">
    Trân trọng,<br>
    <strong>ViLead CRM Security Team</strong>
</p>
```

---

### 1.3 New Device Login Alert

**File Name**: `new-device-login.html`

**Subject Line**: `[ViLead CRM] ⚠️ Phát hiện đăng nhập từ thiết bị mới`

**Variables**:
```javascript
{
  full_name: string,
  timestamp: datetime,
  device_name: string,      // "iPhone 13 Pro"
  browser_name: string,     // "Safari"
  os_name: string,          // "iOS 16.1"
  city: string,
  country: string,
  ip_address: string,
  confirm_url: string,
  deny_url: string,
  enable_2fa_url: string
}
```

**Content Structure**:
```html
<!-- Greeting -->
<p style="font-size: 16px; color: #1F2937; margin: 0 0 20px 0;">
    Xin chào <strong>{{full_name}}</strong>,
</p>

<!-- Alert Message -->
<p style="font-size: 14px; color: #1F2937; margin: 0 0 20px 0;">
    Chúng tôi phát hiện một lần đăng nhập mới vào tài khoản ViLead CRM của bạn từ thiết bị/địa điểm chưa từng sử dụng.
</p>

<!-- Login Details Box -->
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 20px 0;">
    <tr>
        <td style="background-color: #FEF3C7; border-left: 4px solid #F59E0B; padding: 15px;">
            <p style="margin: 0 0 10px 0; font-size: 14px; font-weight: bold; color: #D97706;">
                📍 THÔNG TIN ĐĂNG NHẬP:
            </p>
            <p style="margin: 5px 0; font-size: 13px; color: #1F2937;">• <strong>Thời gian:</strong> {{timestamp}}</p>
            <p style="margin: 5px 0; font-size: 13px; color: #1F2937;">• <strong>Thiết bị:</strong> {{device_name}} ({{browser_name}})</p>
            <p style="margin: 5px 0; font-size: 13px; color: #1F2937;">• <strong>Hệ điều hành:</strong> {{os_name}}</p>
            <p style="margin: 5px 0; font-size: 13px; color: #1F2937;">• <strong>Địa điểm:</strong> {{city}}, {{country}}</p>
            <p style="margin: 5px 0; font-size: 13px; color: #1F2937;">• <strong>IP Address:</strong> {{ip_address}}</p>
        </td>
    </tr>
</table>

<!-- Verification Question -->
<p style="font-size: 16px; font-weight: bold; color: #1F2937; margin: 30px 0 20px 0; text-align: center;">
    ❓ ĐÂY CÓ PHẢI LÀ BẠN?
</p>

<!-- Action Buttons -->
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 20px 0;">
    <tr>
        <td align="center">
            <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                <tr>
                    <td style="padding: 0 10px;">
                        <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                            <tr>
                                <td style="border-radius: 4px; background-color: #059669;">
                                    <a href="{{confirm_url}}" style="display: inline-block; padding: 12px 24px; font-size: 14px; color: #FFFFFF; text-decoration: none; font-weight: bold;">
                                        ĐÚNG, LÀ TÔI
                                    </a>
                                </td>
                            </tr>
                        </table>
                    </td>
                    <td style="padding: 0 10px;">
                        <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                            <tr>
                                <td style="border-radius: 4px; background-color: #DC2626;">
                                    <a href="{{deny_url}}" style="display: inline-block; padding: 12px 24px; font-size: 14px; color: #FFFFFF; text-decoration: none; font-weight: bold;">
                                        KHÔNG PHẢI TÔI
                                    </a>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
        </td>
    </tr>
</table>

<!-- Security Instructions Box -->
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 30px 0;">
    <tr>
        <td style="background-color: #FEF2F2; border: 1px solid #FCA5A5; border-radius: 4px; padding: 20px;">
            <p style="margin: 0 0 10px 0; font-size: 14px; font-weight: bold; color: #DC2626;">
                Nếu bạn KHÔNG thực hiện đăng nhập này:
            </p>
            <ol style="margin: 0; padding-left: 20px; font-size: 13px; color: #1F2937;">
                <li style="margin: 5px 0;">Đổi mật khẩu NGAY LẬP TỨC</li>
                <li style="margin: 5px 0;">Kiểm tra hoạt động gần đây trong tài khoản</li>
                <li style="margin: 5px 0;">Liên hệ bộ phận bảo mật: <a href="mailto:security@vilead.vn" style="color: #DC2626;">security@vilead.vn</a></li>
            </ol>
        </td>
    </tr>
</table>

<!-- 2FA Recommendation -->
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 20px 0;">
    <tr>
        <td style="background-color: #EFF6FF; border: 1px solid #BFDBFE; border-radius: 4px; padding: 20px; text-align: center;">
            <p style="margin: 0 0 15px 0; font-size: 14px; font-weight: bold; color: #1E40AF;">
                🔐 TĂNG CƯỜNG BẢO MẬT
            </p>
            <p style="margin: 0 0 15px 0; font-size: 13px; color: #1F2937;">
                Bật xác thực 2 yếu tố (2FA) để bảo vệ tài khoản tốt hơn.
            </p>
            <table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center">
                <tr>
                    <td style="border-radius: 4px; background-color: #1E40AF;">
                        <a href="{{enable_2fa_url}}" style="display: inline-block; padding: 12px 30px; font-size: 14px; color: #FFFFFF; text-decoration: none; font-weight: bold;">
                            BẬT 2FA NGAY
                        </a>
                    </td>
                </tr>
            </table>
        </td>
    </tr>
</table>

<!-- Closing -->
<p style="font-size: 14px; color: #1F2937; margin: 30px 0 0 0;">
    Trân trọng,<br>
    <strong>ViLead CRM Security Team</strong>
</p>
```

---

### 1.4 Forgot Password / Reset Password

**File Name**: `forgot-password.html`

**Subject Line**: `[ViLead CRM] Yêu cầu khôi phục mật khẩu`

**Variables**:
```javascript
{
  full_name: string,
  email: string,
  reset_password_link: string,
  expires_in: number,        // minutes (30)
  timestamp: datetime,
  ip_address: string
}
```

**Content Structure**:
```html
<!-- Greeting -->
<p style="font-size: 16px; color: #1F2937; margin: 0 0 20px 0;">
    Xin chào <strong>{{full_name}}</strong>,
</p>

<!-- Message -->
<p style="font-size: 14px; color: #1F2937; margin: 0 0 20px 0;">
    Chúng tôi nhận được yêu cầu khôi phục mật khẩu cho tài khoản ViLead CRM của bạn.
</p>

<p style="font-size: 14px; color: #1F2937; margin: 0 0 30px 0;">
    Nhấn vào nút bên dưới để tạo mật khẩu mới:
</p>

<!-- Reset Password CTA -->
<table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center" style="margin: 30px 0;">
    <tr>
        <td style="border-radius: 4px; background-color: #1E40AF;">
            <a href="{{reset_password_link}}" style="display: inline-block; padding: 15px 40px; font-size: 16px; color: #FFFFFF; text-decoration: none; font-weight: bold;">
                ĐẶT LẠI MẬT KHẨU
            </a>
        </td>
    </tr>
</table>

<!-- Expiry Warning -->
<p style="font-size: 13px; color: #DC2626; margin: 20px 0; text-align: center;">
    ⏰ Link này sẽ hết hiệu lực sau <strong>{{expires_in}} phút</strong>.
</p>

<!-- Alternative Link -->
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 20px 0;">
    <tr>
        <td style="background-color: #F9FAFB; border: 1px solid #E5E7EB; border-radius: 4px; padding: 15px;">
            <p style="margin: 0 0 10px 0; font-size: 13px; color: #6B7280;">
                Hoặc copy link sau vào trình duyệt:
            </p>
            <p style="margin: 0; font-size: 12px; color: #1E40AF; word-break: break-all;">
                {{reset_password_link}}
            </p>
        </td>
    </tr>
</table>

<!-- Request Details -->
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 30px 0; border-top: 1px solid #E5E7EB; padding-top: 15px;">
    <tr>
        <td>
            <p style="margin: 0 0 10px 0; font-size: 13px; font-weight: bold; color: #1F2937;">
                📋 THÔNG TIN YÊU CẦU:
            </p>
            <p style="margin: 5px 0; font-size: 12px; color: #6B7280;">• Email: {{email}}</p>
            <p style="margin: 5px 0; font-size: 12px; color: #6B7280;">• Thời gian: {{timestamp}}</p>
            <p style="margin: 5px 0; font-size: 12px; color: #6B7280;">• IP Address: {{ip_address}}</p>
        </td>
    </tr>
</table>

<!-- Warning Box -->
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 20px 0;">
    <tr>
        <td style="background-color: #FEF3C7; border-left: 4px solid #F59E0B; padding: 15px;">
            <p style="margin: 0 0 10px 0; font-size: 14px; font-weight: bold; color: #D97706;">
                ⚠️ KHÔNG PHẢI BẠN?
            </p>
            <p style="margin: 0; font-size: 13px; color: #1F2937;">
                Nếu bạn không yêu cầu khôi phục mật khẩu, vui lòng bỏ qua email này. Mật khẩu của bạn sẽ không bị thay đổi.
            </p>
            <p style="margin: 10px 0 0 0; font-size: 13px; color: #1F2937;">
                Để bảo vệ tài khoản, liên hệ ngay: <a href="mailto:security@vilead.vn" style="color: #D97706;">security@vilead.vn</a>
            </p>
        </td>
    </tr>
</table>

<!-- Closing -->
<p style="font-size: 14px; color: #1F2937; margin: 30px 0 0 0;">
    Trân trọng,<br>
    <strong>ViLead CRM Team</strong>
</p>
```

---

### 1.5 Suspicious Activity Alert

**File Name**: `suspicious-activity.html`

**Subject Line**: `[ViLead CRM] 🚨 CẢNH BÁO: Phát hiện hoạt động bất thường trên tài khoản`

**Variables**:
```javascript
{
  full_name: string,
  suspicious_activities: array,  // List of suspicious activities
  detection_time: datetime,
  risk_level: string,            // "Cao", "Trung bình", "Thấp"
  ip_address: string,
  location: string,
  change_password_url: string,
  view_activity_url: string
}
```

**Content Structure**:
```html
<!-- Greeting -->
<p style="font-size: 16px; color: #1F2937; margin: 0 0 20px 0;">
    Xin chào <strong>{{full_name}}</strong>,
</p>

<!-- Critical Alert -->
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 20px 0;">
    <tr>
        <td style="background-color: #FEE2E2; border: 2px solid #DC2626; border-radius: 4px; padding: 20px; text-align: center;">
            <p style="margin: 0 0 10px 0; font-size: 18px; font-weight: bold; color: #DC2626;">
                🚨 HỆ THỐNG PHÁT HIỆN HOẠT ĐỘNG BẤT THƯỜNG
            </p>
            <p style="margin: 0; font-size: 14px; color: #991B1B;">
                Tài khoản ViLead CRM của bạn có các hoạt động đáng ngờ.
            </p>
        </td>
    </tr>
</table>

<!-- Suspicious Activities List -->
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 20px 0;">
    <tr>
        <td style="background-color: #FEF2F2; border-left: 4px solid #DC2626; padding: 15px;">
            <p style="margin: 0 0 10px 0; font-size: 14px; font-weight: bold; color: #DC2626;">
                ⚠️ CÁC HOẠT ĐỘNG BẤT THƯỜNG:
            </p>
            {{#each suspicious_activities}}
            <p style="margin: 5px 0; font-size: 13px; color: #1F2937;">
                • {{this}}
            </p>
            {{/each}}
            
            <!-- Example static list if not using template engine -->
            <!--
            <p style="margin: 5px 0; font-size: 13px; color: #1F2937;">• Đăng nhập thất bại liên tiếp (5 lần) từ IP: 123.45.67.89</p>
            <p style="margin: 5px 0; font-size: 13px; color: #1F2937;">• Truy cập từ địa điểm lạ: Moscow, Russia</p>
            <p style="margin: 5px 0; font-size: 13px; color: #1F2937;">• Thay đổi quyền truy cập không thông thường</p>
            <p style="margin: 5px 0; font-size: 13px; color: #1F2937;">• Xuất dữ liệu khách hàng số lượng lớn</p>
            -->
        </td>
    </tr>
</table>

<!-- Detection Details -->
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 20px 0;">
    <tr>
        <td>
            <p style="margin: 0 0 10px 0; font-size: 13px; font-weight: bold; color: #1F2937;">
                📍 THÔNG TIN CHI TIẾT:
            </p>
            <p style="margin: 5px 0; font-size: 13px; color: #6B7280;">• <strong>Thời gian phát hiện:</strong> {{detection_time}}</p>
            <p style="margin: 5px 0; font-size: 13px; color: #6B7280;">• <strong>Mức độ rủi ro:</strong> <span style="color: #DC2626; font-weight: bold;">{{risk_level}}</span></p>
            <p style="margin: 5px 0; font-size: 13px; color: #6B7280;">• <strong>IP Address:</strong> {{ip_address}}</p>
            <p style="margin: 5px 0; font-size: 13px; color: #6B7280;">• <strong>Địa điểm:</strong> {{location}}</p>
        </td>
    </tr>
</table>

<!-- Recommended Actions -->
<p style="font-size: 16px; font-weight: bold; color: #1F2937; margin: 30px 0 15px 0;">
    🛡️ HÀNH ĐỘNG KHUYẾN NGHỊ:
</p>

<!-- Action 1: Change Password -->
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 15px 0;">
    <tr>
        <td>
            <p style="margin: 0 0 10px 0; font-size: 14px; font-weight: bold; color: #1F2937;">
                1. ĐỔI MẬT KHẨU NGAY
            </p>
            <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                <tr>
                    <td style="border-radius: 4px; background-color: #DC2626;">
                        <a href="{{change_password_url}}" style="display: inline-block; padding: 12px 30px; font-size: 14px; color: #FFFFFF; text-decoration: none; font-weight: bold;">
                            ĐỔI MẬT KHẨU NGAY
                        </a>
                    </td>
                </tr>
            </table>
        </td>
    </tr>
</table>

<!-- Action 2: Check Activity -->
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 15px 0;">
    <tr>
        <td>
            <p style="margin: 0 0 10px 0; font-size: 14px; font-weight: bold; color: #1F2937;">
                2. KIỂM TRA HOẠT ĐỘNG GẦN ĐÂY
            </p>
            <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                <tr>
                    <td style="border-radius: 4px; background-color: #1E40AF;">
                        <a href="{{view_activity_url}}" style="display: inline-block; padding: 12px 30px; font-size: 14px; color: #FFFFFF; text-decoration: none; font-weight: bold;">
                            XEM LỊCH SỬ HOẠT ĐỘNG
                        </a>
                    </td>
                </tr>
            </table>
        </td>
    </tr>
</table>

<!-- Action 3: Enable 2FA -->
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 15px 0;">
    <tr>
        <td>
            <p style="margin: 0; font-size: 14px; font-weight: bold; color: #1F2937;">
                3. BẬT XÁC THỰC 2 YẾU TỐ (2FA)
            </p>
        </td>
    </tr>
</table>

<!-- Emergency Contact Box -->
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 30px 0;">
    <tr>
        <td style="background-color: #FEE2E2; border: 2px solid #DC2626; border-radius: 4px; padding: 20px;">
            <p style="margin: 0 0 10px 0; font-size: 14px; font-weight: bold; color: #DC2626;">
                ⚡ HÀNH ĐỘNG KHẨN CẤP:
            </p>
            <p style="margin: 0 0 15px 0; font-size: 13px; color: #1F2937;">
                Nếu bạn nghi ngờ tài khoản bị xâm nhập:
            </p>
            <p style="margin: 5px 0; font-size: 13px; color: #1F2937;">
                • Liên hệ ngay: <a href="mailto:security@vilead.vn" style="color: #DC2626; font-weight: bold;">security@vilead.vn</a>
            </p>
            <p style="margin: 5px 0; font-size: 13px; color: #1F2937;">
                • Hotline: <strong>1900 xxxx</strong> (24/7)
            </p>
            <p style="margin: 15px 0 0 0; font-size: 12px; color: #991B1B; font-style: italic;">
                Chúng tôi đã tạm thời hạn chế quyền truy cập cho đến khi xác thực.
            </p>
        </td>
    </tr>
</table>

<!-- Closing -->
<p style="font-size: 14px; color: #1F2937; margin: 30px 0 0 0;">
    Trân trọng,<br>
    <strong>ViLead CRM Security Team</strong>
</p>
```

---

### 1.6 Welcome Email

**File Name**: `welcome.html`

**Subject Line**: `[ViLead CRM] 🎉 Chào mừng bạn đến với ViLead CRM!`

**Variables**:
```javascript
{
  full_name: string,
  email: string,
  role: string,              // "Admin", "Sales", "Support"
  company_name: string,
  created_date: date,
  login_url: string,
  update_profile_url: string,
  create_lead_url: string,
  integration_url: string,
  pipeline_setup_url: string,
  documentation_url: string,
  video_tutorials_url: string,
  community_url: string,
  support_chat_url: string
}
```

**Content Structure**:
```html
<!-- Welcome Banner -->
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 0 0 30px 0;">
    <tr>
        <td style="background: linear-gradient(135deg, #1E40AF 0%, #3B82F6 100%); padding: 40px 30px; text-align: center; border-radius: 8px;">
            <p style="margin: 0 0 15px 0; font-size: 32px; color: #FFFFFF; font-weight: bold;">
                🎉 Chào mừng bạn!
            </p>
            <p style="margin: 0; font-size: 16px; color: #DBEAFE;">
                Hành trình quản lý khách hàng của bạn bắt đầu từ đây
            </p>
        </td>
    </tr>
</table>

<!-- Greeting -->
<p style="font-size: 16px; color: #1F2937; margin: 0 0 20px 0;">
    Xin chào <strong>{{full_name}}</strong>,
</p>

<!-- Welcome Message -->
<p style="font-size: 14px; color: #1F2937; margin: 0 0 20px 0;">
    Tài khoản của bạn đã được kích hoạt thành công. Giờ đây bạn có thể bắt đầu quản lý khách hàng, leads và tối ưu hóa quy trình bán hàng của mình.
</p>

<!-- Get Started CTA -->
<table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center" style="margin: 30px 0;">
    <tr>
        <td style="border-radius: 4px; background-color: #059669;">
            <a href="{{login_url}}" style="display: inline-block; padding: 15px 40px; font-size: 16px; color: #FFFFFF; text-decoration: none; font-weight: bold;">
                BẮT ĐẦU SỬ DỤNG NGAY
            </a>
        </td>
    </tr>
</table>

<!-- Account Information Box -->
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 30px 0;">
    <tr>
        <td style="background-color: #F3F4F6; border-radius: 4px; padding: 20px;">
            <p style="margin: 0 0 15px 0; font-size: 14px; font-weight: bold; color: #1F2937;">
                📋 THÔNG TIN TÀI KHOẢN:
            </p>
            <p style="margin: 5px 0; font-size: 13px; color: #6B7280;">• <strong>Tên đăng nhập:</strong> {{email}}</p>
            <p style="margin: 5px 0; font-size: 13px; color: #6B7280;">• <strong>Vai trò:</strong> {{role}}</p>
            <p style="margin: 5px 0; font-size: 13px; color: #6B7280;">• <strong>Công ty:</strong> {{company_name}}</p>
            <p style="margin: 5px 0; font-size: 13px; color: #6B7280;">• <strong>Ngày tạo:</strong> {{created_date}}</p>
        </td>
    </tr>
</table>

<!-- Divider -->
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 40px 0 30px 0;">
    <tr>
        <td style="border-top: 2px solid #E5E7EB;"></td>
    </tr>
</table>

<!-- Getting Started Steps -->
<p style="font-size: 18px; font-weight: bold; color: #1F2937; margin: 0 0 20px 0;">
    🚀 BƯỚC ĐẦU TIÊN:
</p>

<!-- Step 1 -->
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 0 0 20px 0;">
    <tr>
        <td style="background-color: #EFF6FF; border-left: 4px solid #3B82F6; padding: 15px;">
            <p style="margin: 0 0 5px 0; font-size: 16px; font-weight: bold; color: #1E40AF;">
                1️⃣ HOÀN THIỆN PROFILE
            </p>
            <p style="margin: 0 0 10px 0; font-size: 13px; color: #1F2937;">
                Cập nhật thông tin cá nhân và cài đặt tài khoản
            </p>
            <a href="{{update_profile_url}}" style="font-size: 13px; color: #1E40AF; text-decoration: none; font-weight: bold;">
                Cập nhật profile →
            </a>
        </td>
    </tr>
</table>

<!-- Step 2 -->
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 0 0 20px 0;">
    <tr>
        <td style="background-color: #F0FDF4; border-left: 4px solid #059669; padding: 15px;">
            <p style="margin: 0 0 5px 0; font-size: 16px; font-weight: bold; color: #047857;">
                2️⃣ TẠO LEAD ĐẦU TIÊN
            </p>
            <p style="margin: 0 0 10px 0; font-size: 13px; color: #1F2937;">
                Thêm thông tin khách hàng tiềm năng đầu tiên
            </p>
            <a href="{{create_lead_url}}" style="font-size: 13px; color: #047857; text-decoration: none; font-weight: bold;">
                Tạo lead mới →
            </a>
        </td>
    </tr>
</table>

<!-- Step 3 -->
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 0 0 20px 0;">
    <tr>
        <td style="background-color: #FEF3C7; border-left: 4px solid #F59E0B; padding: 15px;">
            <p style="margin: 0 0 5px 0; font-size: 16px; font-weight: bold; color: #D97706;">
                3️⃣ KẾT NỐI KÊNH GIAO TIẾP
            </p>
            <p style="margin: 0 0 10px 0; font-size: 13px; color: #1F2937;">
                Tích hợp Zalo OA, Facebook, Email
            </p>
            <a href="{{integration_url}}" style="font-size: 13px; color: #D97706; text-decoration: none; font-weight: bold;">
                Tích hợp ngay →
            </a>
        </td>
    </tr>
</table>

<!-- Step 4 -->
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 0 0 20px 0;">
    <tr>
        <td style="background-color: #F5F3FF; border-left: 4px solid #7C3AED; padding: 15px;">
            <p style="margin: 0 0 5px 0; font-size: 16px; font-weight: bold; color: #6D28D9;">
                4️⃣ THIẾT LẬP PIPELINE
            </p>
            <p style="margin: 0 0 10px 0; font-size: 13px; color: #1F2937;">
                Tùy chỉnh quy trình bán hàng của bạn
            </p>
            <a href="{{pipeline_setup_url}}" style="font-size: 13px; color: #6D28D9; text-decoration: none; font-weight: bold;">
                Thiết lập pipeline →
            </a>
        </td>
    </tr>
</table>

<!-- Divider -->
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 40px 0 30px 0;">
    <tr>
        <td style="border-top: 2px solid #E5E7EB;"></td>
    </tr>
</table>

<!-- Resources Section -->
<p style="font-size: 18px; font-weight: bold; color: #1F2937; margin: 0 0 20px 0;">
    📚 TÀI NGUYÊN HỮU ÍCH:
</p>

<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 0 0 15px 0;">
    <tr>
        <td style="padding: 10px 0;">
            <p style="margin: 0; font-size: 14px;">
                📖 <a href="{{documentation_url}}" style="color: #1E40AF; text-decoration: none; font-weight: bold;">Hướng dẫn sử dụng</a> - Tài liệu chi tiết cho người mới
            </p>
        </td>
    </tr>
    <tr>
        <td style="padding: 10px 0;">
            <p style="margin: 0; font-size: 14px;">
                🎥 <a href="{{video_tutorials_url}}" style="color: #1E40AF; text-decoration: none; font-weight: bold;">Video tutorials</a> - Học qua video hướng dẫn
            </p>
        </td>
    </tr>
    <tr>
        <td style="padding: 10px 0;">
            <p style="margin: 0; font-size: 14px;">
                💬 <a href="{{community_url}}" style="color: #1E40AF; text-decoration: none; font-weight: bold;">Cộng đồng người dùng</a> - Kết nối và học hỏi
            </p>
        </td>
    </tr>
    <tr>
        <td style="padding: 10px 0;">
            <p style="margin: 0; font-size: 14px;">
                📞 <a href="{{support_chat_url}}" style="color: #1E40AF; text-decoration: none; font-weight: bold;">Hỗ trợ trực tuyến</a> - Chat với team support
            </p>
        </td>
    </tr>
</table>

<!-- Divider -->
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 40px 0 30px 0;">
    <tr>
        <td style="border-top: 2px solid #E5E7EB;"></td>
    </tr>
</table>

<!-- Pro Tips Box -->
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 30px 0;">
    <tr>
        <td style="background-color: #FFFBEB; border: 1px solid #FCD34D; border-radius: 4px; padding: 20px;">
            <p style="margin: 0 0 15px 0; font-size: 16px; font-weight: bold; color: #D97706;">
                💡 MẸO HAY:
            </p>
            <ul style="margin: 0; padding-left: 20px; font-size: 13px; color: #1F2937;">
                <li style="margin: 8px 0;">Sử dụng tính năng phân chia lead tự động để tối ưu năng suất</li>
                <li style="margin: 8px 0;">Theo dõi conversion rate theo từng nguồn lead</li>
                <li style="margin: 8px 0;">Thiết lập nhắc nhở follow-up để không bỏ lỡ cơ hội</li>
            </ul>
        </td>
    </tr>
</table>

<!-- Support Contact Box -->
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 30px 0;">
    <tr>
        <td style="background-color: #F3F4F6; border-radius: 4px; padding: 20px; text-align: center;">
            <p style="margin: 0 0 15px 0; font-size: 16px; font-weight: bold; color: #1F2937;">
                CẦN HỖ TRỢ?
            </p>
            <p style="margin: 5px 0; font-size: 13px; color: #6B7280;">
                📧 Email: <a href="mailto:support@vilead.vn" style="color: #1E40AF;">support@vilead.vn</a>
            </p>
            <p style="margin: 5px 0; font-size: 13px; color: #6B7280;">
                📞 Hotline: <strong>1900 xxxx</strong> (8:00 - 22:00 hàng ngày)
            </p>
            <p style="margin: 5px 0; font-size: 13px; color: #6B7280;">
                💬 <a href="{{support_chat_url}}" style="color: #1E40AF;">Live Chat</a>: Truy cập vào hệ thống và chat trực tiếp
            </p>
        </td>
    </tr>
</table>

<!-- Closing Message -->
<p style="font-size: 16px; color: #1F2937; margin: 30px 0 10px 0; text-align: center;">
    Chúc bạn thành công với ViLead CRM! 🚀
</p>

<p style="font-size: 14px; color: #1F2937; margin: 10px 0 30px 0; text-align: center;">
    Trân trọng,<br>
    <strong>ViLead CRM Team</strong>
</p>

<!-- Social Media Follow -->
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 30px 0; border-top: 1px solid #E5E7EB; padding-top: 20px;">
    <tr>
        <td style="text-align: center;">
            <p style="margin: 0 0 15px 0; font-size: 12px; color: #6B7280;">
                Theo dõi chúng tôi để nhận thêm tips & tricks:
            </p>
            <table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center">
                <tr>
                    <td style="padding: 0 10px;">
                        <a href="#" style="display: inline-block; padding: 8px 15px; background-color: #1877F2; color: #FFFFFF; text-decoration: none; border-radius: 4px; font-size: 12px;">
                            Facebook
                        </a>
                    </td>
                    <td style="padding: 0 10px;">
                        <a href="#" style="display: inline-block; padding: 8px 15px; background-color: #0A66C2; color: #FFFFFF; text-decoration: none; border-radius: 4px; font-size: 12px;">
                            LinkedIn
                        </a>
                    </td>
                    <td style="padding: 0 10px;">
                        <a href="#" style="display: inline-block; padding: 8px 15px; background-color: #FF0000; color: #FFFFFF; text-decoration: none; border-radius: 4px; font-size: 12px;">
                            YouTube
                        </a>
                    </td>
                </tr>
            </table>
        </td>
    </tr>
</table>
```

---

## 2. QUẢN LÝ LEADS & KHÁCH HÀNG

### 2.1 Payment Reminder Email

**File Name**: `payment-reminder.html`

**Subject Line**: `[ViLead CRM] Nhắc nhở thanh toán - Hóa đơn #{{invoice_number}}`

**Variables**:
```javascript
{
  customer_name: string,
  invoice_number: string,
  issue_date: date,
  due_date: date,
  amount: number,
  currency: string,          // "VNĐ"
  status: string,            // "Chưa thanh toán", "Quá hạn"
  days_remaining: number,
  payment_url: string,
  invoice_pdf_url: string,
  view_invoice_url: string,
  bank_name: string,
  account_number: string,
  account_holder: string,
  transfer_content: string
}
```

**Content Structure** (đã có ở trên, chỉ cần format thành HTML với inline CSS)

---

### 2.2 Subscription Expiry / Renewal Notification

**File Name**: `subscription-renewal.html`

**Subject Line**: `[ViLead CRM] ⚠️ Gói dịch vụ của bạn sắp hết hạn - Gia hạn ngay!`

**Variables**:
```javascript
{
  customer_name: string,
  package_name: string,
  expiry_date: date,
  days_remaining: number,
  status: string,
  features: array,           // List of features
  renewal_price: number,
  billing_cycle: string,     // "tháng", "năm"
  renew_url: string,
  early_bird_date: date,
  discount_percent: number,
  bonus_months: number,
  bonus_feature: string,
  discounted_price: number,
  savings: number,
  upgrade_package_name: string,
  upgrade_features: array,
  upgrade_price: number,
  view_pricing_url: string,
  retention_days: number     // 30 days
}
```

**Content Structure** (đã có ở trên, format thành HTML)

---

## 3. EMAIL MARKETING

### 3.1 Campaign Performance Report

**File Name**: `campaign-report.html`

**Subject Line**: `[ViLead CRM] 📊 Báo cáo kết quả Campaign "{{campaign_name}}"`

**Variables**:
```javascript
{
  user_name: string,
  campaign_name: string,
  send_date: date,
  send_time: time,
  total_sent: number,
  delivered_count: number,
  delivered_rate: number,
  failed_count: number,
  failed_rate: number,
  open_count: number,
  open_rate: number,
  click_count: number,
  click_rate: number,
  bounce_count: number,
  bounce_rate: number,
  unsub_count: number,
  unsub_rate: number,
  performance_chart_url: string,
  view_full_report_url: string,
  top_links: array,          // [{link, click_count, ctr}]
  peak_hours: array,         // [{hour, open_count}]
  top_demographics: object,  // {age_group, location, lead_source}
  new_leads: number,
  closed_deals: number,
  revenue: number,
  roi: number,
  previous_campaign: object, // {open_rate, click_rate, conv_rate}
  strengths: array,
  weaknesses: array,         // [{weakness, suggestion}]
  engaged_count: number,
  unopened_count: number,
  followup_campaign_url: string,
  resend_campaign_url: string,
  advanced_report_url: string
}
```

**Content Structure** (đã có ở trên, format thành HTML với charts và comparisons)

---

## IMPLEMENTATION CHECKLIST

### Phase 1: Base Template
- [ ] Create base HTML template structure
- [ ] Implement inline CSS for all styles
- [ ] Add responsive media queries
- [ ] Test on major email clients
- [ ] Create reusable components (header, footer, buttons)

### Phase 2: Individual Templates
- [ ] Implement all 9 email templates with full HTML/CSS
- [ ] Add personalization token support
- [ ] Implement conditional rendering for dynamic content
- [ ] Add fallback content for missing variables

### Phase 3: Testing
- [ ] Test all templates on Gmail (Desktop & Mobile)
- [ ] Test on Outlook versions
- [ ] Test on Apple Mail
- [ ] Test Vietnamese characters rendering
- [ ] Validate HTML/CSS
- [ ] Test all CTA links

### Phase 4: Integration
- [ ] Create template management system
- [ ] Implement variable injection
- [ ] Add email sending service integration
- [ ] Create preview functionality
- [ ] Add A/B testing capability

---

## ACCEPTANCE CRITERIA

Each email template must:

1. **Responsive Design**
   - Display correctly on mobile (320px - 480px)
   - Display correctly on desktop (600px)
   - All text readable without zooming

2. **Email Client Compatibility**
   - Render correctly in Gmail
   - Render correctly in Outlook 2010+
   - Render correctly in Apple Mail
   - No broken layouts or missing images

3. **Content Requirements**
   - All personalization tokens work correctly
   - All CTAs are clickable and visible
   - All Vietnamese characters display correctly
   - Footer includes unsubscribe link

4. **Performance**
   - Email size < 100KB
   - Load time < 2 seconds
   - Images optimized and have alt text

5. **Accessibility**
   - Proper HTML semantic structure
   - Alt text for all images
   - Sufficient color contrast (WCAG AA)
   - Readable without images

---

## DELIVERABLES

Please create the following files:

1. **HTML Templates** (9 files)
   - `otp-verification.html`
   - `password-changed.html`
   - `new-device-login.html`
   - `forgot-password.html`
   - `suspicious-activity.html`
   - `welcome.html`
   - `payment-reminder.html`
   - `subscription-renewal.html`
   - `campaign-report.html`

2. **Base Components** (3 files)
   - `base-template.html` - Main wrapper
   - `email-header.html` - Reusable header component
   - `email-footer.html` - Reusable footer component

3. **CSS File** (1 file)
   - `email-styles.css` - Common styles (will be inlined)

4. **Test Data** (1 file)
   - `test-data.json` - Sample data for all variables

5. **Documentation** (1 file)
   - `README.md` - Setup and usage instructions

---

## NOTES FOR COPILOT

- Use **table-based layout** for maximum email client compatibility
- ALL CSS must be **inline** (no external stylesheets)
- Use **system fonts only** (Arial, Helvetica, sans-serif)
- Ensure **UTF-8 encoding** for Vietnamese text
- Add **fallback colors** for gradient backgrounds
- Include **alt text** for all images
- Test **dark mode** compatibility where applicable
- Use **role="presentation"** for layout tables
- Add **aria-labels** for accessibility
- Keep **total width at 600px** for desktop
- Use **percentage-based widths** for mobile responsiveness

---

## TESTING VARIABLES

Provide sample test data for all templates to verify functionality.

Example for OTP Verification:
```json
{
  "full_name": "Nguyễn Văn A",
  "otp_code": "123456",
  "email": "nguyen.van.a@example.com",
  "timestamp": "2024-01-15 14:30:00",
  "ip_address": "123.45.67.89",
  "expires_in": 5
}
```

(Similar test data for all 9 templates)

---

END OF SPECIFICATION
