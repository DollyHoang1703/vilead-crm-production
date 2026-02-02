# 📧 SPEC: Cải thiện Nội dung Email Templates - CRM ViLead

> **Mục đích**: File này dùng cho AI Coding Assistant (Copilot) để cập nhật phần **body content** của các email template hệ thống CRM ViLead. Header và Footer đã chuẩn, **KHÔNG SỬA**.
>
> **Phạm vi**: Chỉ sửa phần `<td>` nội dung chính (nằm giữa header và footer).

---

## 1. Nguyên tắc thiết kế chung

### 1.1 Phong cách nội dung

| Tiêu chí | Yêu cầu |
|-----------|----------|
| Giọng văn | Chuyên nghiệp, lịch sự, thân thiện — xưng "chúng tôi", gọi "Quý khách" hoặc "Anh/Chị" |
| Ngôn ngữ | Tiếng Việt chuẩn, có dấu, tránh viết tắt |
| Căn lề nội dung | `text-align: justify` cho các đoạn văn dài |
| Độ dài | Ngắn gọn, đủ ý — mỗi đoạn tối đa 3-4 câu |
| Cấu trúc | Tiêu đề → Lời chào → Nội dung chính → Hành động (CTA) → Lưu ý/Cảnh báo → Lời kết |

### 1.2 Quy tắc CSS inline (bắt buộc cho email)

```
Toàn bộ CSS phải viết inline — email client không hỗ trợ <style> tag.
```

**Typography:**

```css
/* Tiêu đề chính */
font: 700 22px 'Segoe UI', Arial, Helvetica, sans-serif;
color: #1F2937;

/* Lời chào - tên người nhận */
font: 700 15px 'Segoe UI', Arial, Helvetica, sans-serif;
color: #1F2937;

/* Đoạn văn nội dung */
font: 15px/26px 'Segoe UI', Arial, Helvetica, sans-serif;
color: #4B5563;
text-align: justify;

/* Chữ nhỏ / ghi chú */
font: 13px/20px 'Segoe UI', Arial, Helvetica, sans-serif;
color: #9CA3AF;
```

**Màu sắc thương hiệu:**

| Vai trò | Mã màu | Dùng cho |
|---------|--------|----------|
| Primary | `#2563EB` | Nút CTA, link, viền nhấn mạnh |
| Primary Dark | `#1D4ED8` | Hover state (nếu hỗ trợ) |
| Success | `#059669` | Thông báo thành công, xác nhận |
| Warning | `#D97706` | Cảnh báo, nhắc nhở |
| Danger | `#DC2626` | Cảnh báo khẩn cấp, bảo mật |
| Text Dark | `#1F2937` | Tiêu đề, nội dung quan trọng |
| Text Medium | `#4B5563` | Nội dung chính |
| Text Light | `#9CA3AF` | Ghi chú, phụ đề |
| Background Box | `#F9FAFB` | Hộp thông tin |
| Border | `#E5E7EB` | Viền hộp |

**Nút CTA (Call-to-Action):**

```html
<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 24px;">
  <tr>
    <td align="center" style="background-color:#2563EB; border-radius:8px;">
      <a href="{{url}}" target="_blank"
         style="display:inline-block; padding:14px 36px; font:600 15px 'Segoe UI', Arial, sans-serif; color:#FFFFFF; text-decoration:none; letter-spacing:0.3px;">
        Văn bản nút
      </a>
    </td>
  </tr>
</table>
```

**Hộp thông tin (Info Box):**

```html
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 24px;">
  <tr>
    <td style="padding:20px 24px; background-color:#F9FAFB; border-radius:8px; border:1px solid #E5E7EB;">
      <!-- Nội dung bên trong -->
    </td>
  </tr>
</table>
```

**Hộp cảnh báo (Warning/Alert Box):**

```html
<!-- Warning (vàng) -->
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 24px;">
  <tr>
    <td style="padding:16px 20px; background-color:#FEF3C7; border-radius:8px; border-left:4px solid #D97706;">
      <p style="margin:0 0 6px; font:600 14px/20px 'Segoe UI', Arial, sans-serif; color:#92400E;">
        ⚠️ Tiêu đề cảnh báo
      </p>
      <p style="margin:0; font:13px/20px 'Segoe UI', Arial, sans-serif; color:#78350F;">
        Nội dung cảnh báo
      </p>
    </td>
  </tr>
</table>

<!-- Danger (đỏ) -->
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 24px;">
  <tr>
    <td style="padding:16px 20px; background-color:#FEF2F2; border-radius:8px; border-left:4px solid #DC2626;">
      <p style="margin:0 0 6px; font:600 14px/20px 'Segoe UI', Arial, sans-serif; color:#991B1B;">
        🔴 Tiêu đề cảnh báo khẩn
      </p>
      <p style="margin:0; font:13px/20px 'Segoe UI', Arial, sans-serif; color:#7F1D1D;">
        Nội dung cảnh báo
      </p>
    </td>
  </tr>
</table>

<!-- Success (xanh lá) -->
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 24px;">
  <tr>
    <td style="padding:16px 20px; background-color:#ECFDF5; border-radius:8px; border-left:4px solid #059669;">
      <p style="margin:0 0 6px; font:600 14px/20px 'Segoe UI', Arial, sans-serif; color:#065F46;">
        ✅ Tiêu đề thành công
      </p>
      <p style="margin:0; font:13px/20px 'Segoe UI', Arial, sans-serif; color:#064E3B;">
        Nội dung
      </p>
    </td>
  </tr>
</table>
```

**Đường kẻ phân cách:**

```html
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:24px 0;">
  <tr>
    <td style="border-top:1px solid #E5E7EB;"></td>
  </tr>
</table>
```

---

## 2. Chi tiết từng Email Template

> **Quy ước biến (variables)**: Các biến được đặt trong `{{ }}` — backend sẽ thay thế khi gửi.
>
> **Lưu ý quan trọng**: Chỉ implement phần nằm trong `<td style="padding:32px;">...</td>` (body content). KHÔNG sửa header, footer, wrapper table bên ngoài.

---

### 2.1 Template: Gửi OTP xác thực tài khoản mới

**Subject line:** `[ViLead CRM] Mã xác thực tài khoản — {{otp_code}}`

**Biến cần truyền:** `{{recipient_name}}`, `{{otp_code}}`, `{{expiry_minutes}}`

**Nội dung body:**

```html
<td style="padding:32px;">
  <!-- Tiêu đề -->
  <h1 style="margin:0 0 8px; font:700 22px 'Segoe UI', Arial, Helvetica, sans-serif; color:#1F2937;">
    Xác thực tài khoản của bạn
  </h1>

  <!-- Lời chào -->
  <p style="margin:0 0 20px; font:15px/26px 'Segoe UI', Arial, Helvetica, sans-serif; color:#4B5563; text-align:justify;">
    Xin chào <strong style="color:#1F2937;">{{recipient_name}}</strong>,
  </p>

  <!-- Nội dung chính -->
  <p style="margin:0 0 24px; font:15px/26px 'Segoe UI', Arial, Helvetica, sans-serif; color:#4B5563; text-align:justify;">
    Chúng tôi đã nhận được yêu cầu xác thực tài khoản CRM ViLead của bạn. Vui lòng sử dụng mã OTP bên dưới để hoàn tất quá trình xác thực:
  </p>

  <!-- OTP Code Box -->
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 24px;">
    <tr>
      <td align="center" style="padding:28px 20px; background-color:#F0F5FF; border-radius:12px; border:2px dashed #2563EB;">
        <p style="margin:0 0 8px; font:13px 'Segoe UI', Arial, sans-serif; color:#6B7280; text-transform:uppercase; letter-spacing:1.5px;">
          Mã xác thực của bạn
        </p>
        <p style="margin:0; font:700 36px 'Courier New', monospace; color:#2563EB; letter-spacing:8px;">
          {{otp_code}}
        </p>
      </td>
    </tr>
  </table>

  <!-- Warning Box -->
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 24px;">
    <tr>
      <td style="padding:16px 20px; background-color:#FEF3C7; border-radius:8px; border-left:4px solid #D97706;">
        <p style="margin:0 0 6px; font:600 14px/20px 'Segoe UI', Arial, sans-serif; color:#92400E;">
          ⚠️ Lưu ý quan trọng
        </p>
        <p style="margin:0; font:13px/20px 'Segoe UI', Arial, sans-serif; color:#78350F;">
          Mã OTP có hiệu lực trong <strong>{{expiry_minutes}} phút</strong>. Không chia sẻ mã này với bất kỳ ai, kể cả nhân viên hỗ trợ. ViLead sẽ không bao giờ yêu cầu bạn cung cấp mã OTP qua điện thoại hay tin nhắn.
        </p>
      </td>
    </tr>
  </table>

  <!-- Lời kết -->
  <p style="margin:0; font:13px/20px 'Segoe UI', Arial, sans-serif; color:#9CA3AF;">
    Nếu bạn không thực hiện yêu cầu này, vui lòng bỏ qua email này hoặc
    <a href="{{support_url}}" style="color:#2563EB; text-decoration:none;">liên hệ đội ngũ hỗ trợ</a>.
  </p>
</td>
```

---

### 2.2 Template: Xác nhận đổi mật khẩu

**Subject line:** `[ViLead CRM] Mật khẩu của bạn đã được thay đổi thành công`

**Biến cần truyền:** `{{recipient_name}}`, `{{changed_time}}`, `{{changed_ip}}`, `{{device_info}}`, `{{support_url}}`

**Nội dung body:**

```html
<td style="padding:32px;">
  <!-- Tiêu đề -->
  <h1 style="margin:0 0 8px; font:700 22px 'Segoe UI', Arial, Helvetica, sans-serif; color:#1F2937;">
    Mật khẩu đã được cập nhật
  </h1>

  <!-- Lời chào -->
  <p style="margin:0 0 20px; font:15px/26px 'Segoe UI', Arial, Helvetica, sans-serif; color:#4B5563; text-align:justify;">
    Xin chào <strong style="color:#1F2937;">{{recipient_name}}</strong>,
  </p>

  <!-- Nội dung chính -->
  <p style="margin:0 0 24px; font:15px/26px 'Segoe UI', Arial, Helvetica, sans-serif; color:#4B5563; text-align:justify;">
    Mật khẩu tài khoản CRM ViLead của bạn vừa được thay đổi thành công. Dưới đây là thông tin chi tiết về lần thay đổi này:
  </p>

  <!-- Info Box -->
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 24px;">
    <tr>
      <td style="padding:20px 24px; background-color:#ECFDF5; border-radius:8px; border-left:4px solid #059669;">
        <p style="margin:0 0 12px; font:600 14px 'Segoe UI', Arial, sans-serif; color:#065F46;">
          ✅ Thay đổi mật khẩu thành công
        </p>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td width="110" style="padding:6px 0; font:13px 'Segoe UI', Arial, sans-serif; color:#6B7280;">Thời gian:</td>
            <td style="padding:6px 0; font:14px 'Segoe UI', Arial, sans-serif; color:#1F2937; font-weight:600;">{{changed_time}}</td>
          </tr>
          <tr>
            <td width="110" style="padding:6px 0; font:13px 'Segoe UI', Arial, sans-serif; color:#6B7280;">Địa chỉ IP:</td>
            <td style="padding:6px 0; font:14px 'Segoe UI', Arial, sans-serif; color:#1F2937;">{{changed_ip}}</td>
          </tr>
          <tr>
            <td width="110" style="padding:6px 0; font:13px 'Segoe UI', Arial, sans-serif; color:#6B7280;">Thiết bị:</td>
            <td style="padding:6px 0; font:14px 'Segoe UI', Arial, sans-serif; color:#1F2937;">{{device_info}}</td>
          </tr>
        </table>
      </td>
    </tr>
  </table>

  <!-- Danger Warning Box -->
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 24px;">
    <tr>
      <td style="padding:16px 20px; background-color:#FEF2F2; border-radius:8px; border-left:4px solid #DC2626;">
        <p style="margin:0 0 6px; font:600 14px/20px 'Segoe UI', Arial, sans-serif; color:#991B1B;">
          🔒 Không phải bạn thực hiện?
        </p>
        <p style="margin:0; font:13px/20px 'Segoe UI', Arial, sans-serif; color:#7F1D1D;">
          Nếu bạn không thực hiện thay đổi này, tài khoản của bạn có thể đã bị xâm phạm.
          Hãy <a href="{{support_url}}" style="color:#DC2626; font-weight:600; text-decoration:underline;">liên hệ hỗ trợ ngay lập tức</a> để bảo vệ tài khoản.
        </p>
      </td>
    </tr>
  </table>

  <!-- Lời kết -->
  <p style="margin:0; font:13px/20px 'Segoe UI', Arial, sans-serif; color:#9CA3AF;">
    Để đảm bảo an toàn, chúng tôi khuyến nghị bạn sử dụng mật khẩu mạnh và không chia sẻ thông tin đăng nhập với bất kỳ ai.
  </p>
</td>
```

---

### 2.3 Template: Thông báo đăng nhập từ thiết bị/địa điểm mới

**Subject line:** `[ViLead CRM] Phát hiện đăng nhập từ thiết bị mới`

**Biến cần truyền:** `{{recipient_name}}`, `{{login_time}}`, `{{login_ip}}`, `{{device_info}}`, `{{location}}`, `{{secure_account_url}}`, `{{support_url}}`

**Nội dung body:**

```html
<td style="padding:32px;">
  <!-- Tiêu đề -->
  <h1 style="margin:0 0 8px; font:700 22px 'Segoe UI', Arial, Helvetica, sans-serif; color:#1F2937;">
    Đăng nhập từ thiết bị mới
  </h1>

  <!-- Lời chào -->
  <p style="margin:0 0 20px; font:15px/26px 'Segoe UI', Arial, Helvetica, sans-serif; color:#4B5563; text-align:justify;">
    Xin chào <strong style="color:#1F2937;">{{recipient_name}}</strong>,
  </p>

  <!-- Nội dung chính -->
  <p style="margin:0 0 24px; font:15px/26px 'Segoe UI', Arial, Helvetica, sans-serif; color:#4B5563; text-align:justify;">
    Chúng tôi phát hiện tài khoản CRM ViLead của bạn vừa được đăng nhập từ một thiết bị hoặc địa điểm chưa từng sử dụng trước đây. Vui lòng kiểm tra thông tin chi tiết bên dưới:
  </p>

  <!-- Info Box -->
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 24px;">
    <tr>
      <td style="padding:20px 24px; background-color:#F9FAFB; border-radius:8px; border:1px solid #E5E7EB;">
        <p style="margin:0 0 14px; font:600 14px 'Segoe UI', Arial, sans-serif; color:#1F2937;">
          📍 Chi tiết phiên đăng nhập
        </p>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td width="110" style="padding:6px 0; font:13px 'Segoe UI', Arial, sans-serif; color:#6B7280;">Thời gian:</td>
            <td style="padding:6px 0; font:14px 'Segoe UI', Arial, sans-serif; color:#1F2937;">{{login_time}}</td>
          </tr>
          <tr>
            <td width="110" style="padding:6px 0; font:13px 'Segoe UI', Arial, sans-serif; color:#6B7280;">Địa chỉ IP:</td>
            <td style="padding:6px 0; font:14px 'Segoe UI', Arial, sans-serif; color:#1F2937;">{{login_ip}}</td>
          </tr>
          <tr>
            <td width="110" style="padding:6px 0; font:13px 'Segoe UI', Arial, sans-serif; color:#6B7280;">Thiết bị:</td>
            <td style="padding:6px 0; font:14px 'Segoe UI', Arial, sans-serif; color:#1F2937;">{{device_info}}</td>
          </tr>
          <tr>
            <td width="110" style="padding:6px 0; font:13px 'Segoe UI', Arial, sans-serif; color:#6B7280;">Vị trí:</td>
            <td style="padding:6px 0; font:14px 'Segoe UI', Arial, sans-serif; color:#1F2937;">{{location}}</td>
          </tr>
        </table>
      </td>
    </tr>
  </table>

  <!-- Hai nút hành động -->
  <p style="margin:0 0 12px; font:15px/24px 'Segoe UI', Arial, sans-serif; color:#4B5563;">
    <strong>Nếu đây là bạn</strong> — bạn có thể bỏ qua email này. Phiên đăng nhập đã được ghi nhận.
  </p>

  <p style="margin:0 0 20px; font:15px/24px 'Segoe UI', Arial, sans-serif; color:#4B5563;">
    <strong>Nếu không phải bạn</strong> — hãy bảo vệ tài khoản ngay lập tức:
  </p>

  <!-- CTA Button -->
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 24px;">
    <tr>
      <td align="center" style="background-color:#DC2626; border-radius:8px;">
        <a href="{{secure_account_url}}" target="_blank"
           style="display:inline-block; padding:14px 36px; font:600 15px 'Segoe UI', Arial, sans-serif; color:#FFFFFF; text-decoration:none;">
          🔒 Bảo vệ tài khoản ngay
        </a>
      </td>
    </tr>
  </table>

  <!-- Lời kết -->
  <p style="margin:0; font:13px/20px 'Segoe UI', Arial, sans-serif; color:#9CA3AF;">
    Chúng tôi gửi thông báo này để giúp bạn theo dõi và bảo vệ tài khoản. Nếu cần hỗ trợ thêm, vui lòng
    <a href="{{support_url}}" style="color:#2563EB; text-decoration:none;">liên hệ đội ngũ CSKH</a>.
  </p>
</td>
```

---

### 2.4 Template: Xác nhận khôi phục mật khẩu (Forgot Password)

**Subject line:** `[ViLead CRM] Yêu cầu đặt lại mật khẩu`

**Biến cần truyền:** `{{recipient_name}}`, `{{reset_url}}`, `{{expiry_minutes}}`, `{{support_url}}`

**Nội dung body:**

```html
<td style="padding:32px;">
  <!-- Tiêu đề -->
  <h1 style="margin:0 0 8px; font:700 22px 'Segoe UI', Arial, Helvetica, sans-serif; color:#1F2937;">
    Đặt lại mật khẩu
  </h1>

  <!-- Lời chào -->
  <p style="margin:0 0 20px; font:15px/26px 'Segoe UI', Arial, Helvetica, sans-serif; color:#4B5563; text-align:justify;">
    Xin chào <strong style="color:#1F2937;">{{recipient_name}}</strong>,
  </p>

  <!-- Nội dung chính -->
  <p style="margin:0 0 24px; font:15px/26px 'Segoe UI', Arial, Helvetica, sans-serif; color:#4B5563; text-align:justify;">
    Chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản CRM ViLead của bạn. Nhấn vào nút bên dưới để tạo mật khẩu mới:
  </p>

  <!-- CTA Button -->
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:0 auto 24px;">
    <tr>
      <td align="center" style="background-color:#2563EB; border-radius:8px;">
        <a href="{{reset_url}}" target="_blank"
           style="display:inline-block; padding:14px 40px; font:600 15px 'Segoe UI', Arial, sans-serif; color:#FFFFFF; text-decoration:none; letter-spacing:0.3px;">
          Đặt lại mật khẩu
        </a>
      </td>
    </tr>
  </table>

  <!-- Warning Box -->
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 24px;">
    <tr>
      <td style="padding:16px 20px; background-color:#FEF3C7; border-radius:8px; border-left:4px solid #D97706;">
        <p style="margin:0 0 6px; font:600 14px/20px 'Segoe UI', Arial, sans-serif; color:#92400E;">
          ⏳ Liên kết có thời hạn
        </p>
        <p style="margin:0; font:13px/20px 'Segoe UI', Arial, sans-serif; color:#78350F;">
          Liên kết đặt lại mật khẩu sẽ hết hiệu lực sau <strong>{{expiry_minutes}} phút</strong>.
          Nếu liên kết hết hạn, bạn có thể yêu cầu gửi lại từ trang đăng nhập.
        </p>
      </td>
    </tr>
  </table>

  <!-- Fallback URL -->
  <p style="margin:0 0 20px; font:13px/20px 'Segoe UI', Arial, sans-serif; color:#9CA3AF;">
    Nếu nút không hoạt động, sao chép và dán liên kết sau vào trình duyệt:<br>
    <a href="{{reset_url}}" style="color:#2563EB; font-size:12px; word-break:break-all; text-decoration:none;">{{reset_url}}</a>
  </p>

  <!-- Đường kẻ -->
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 20px;">
    <tr><td style="border-top:1px solid #E5E7EB;"></td></tr>
  </table>

  <!-- Lời kết -->
  <p style="margin:0; font:13px/20px 'Segoe UI', Arial, sans-serif; color:#9CA3AF;">
    Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này — tài khoản của bạn vẫn an toàn. Nếu cần hỗ trợ, hãy
    <a href="{{support_url}}" style="color:#2563EB; text-decoration:none;">liên hệ chúng tôi</a>.
  </p>
</td>
```

---

### 2.5 Template: Cảnh báo hoạt động bất thường

**Subject line:** `🚨 [ViLead CRM] Cảnh báo bảo mật — Phát hiện hoạt động bất thường`

**Biến cần truyền:** `{{recipient_name}}`, `{{alert_description}}`, `{{alert_time}}`, `{{alert_ip}}`, `{{alert_location}}`, `{{secure_account_url}}`, `{{support_url}}`

**Nội dung body:**

```html
<td style="padding:32px;">
  <!-- Tiêu đề với icon cảnh báo -->
  <h1 style="margin:0 0 8px; font:700 22px 'Segoe UI', Arial, Helvetica, sans-serif; color:#DC2626;">
    🚨 Cảnh báo bảo mật tài khoản
  </h1>

  <!-- Lời chào -->
  <p style="margin:0 0 20px; font:15px/26px 'Segoe UI', Arial, Helvetica, sans-serif; color:#4B5563; text-align:justify;">
    Xin chào <strong style="color:#1F2937;">{{recipient_name}}</strong>,
  </p>

  <!-- Nội dung chính -->
  <p style="margin:0 0 24px; font:15px/26px 'Segoe UI', Arial, Helvetica, sans-serif; color:#4B5563; text-align:justify;">
    Hệ thống bảo mật CRM ViLead đã phát hiện hoạt động bất thường trên tài khoản của bạn. Chúng tôi khuyến nghị bạn kiểm tra ngay và thực hiện các biện pháp bảo vệ cần thiết.
  </p>

  <!-- Danger Alert Box -->
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 24px;">
    <tr>
      <td style="padding:20px 24px; background-color:#FEF2F2; border-radius:8px; border:1px solid #FECACA;">
        <p style="margin:0 0 14px; font:600 15px 'Segoe UI', Arial, sans-serif; color:#991B1B;">
          Chi tiết hoạt động bất thường
        </p>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td width="110" style="padding:6px 0; font:13px 'Segoe UI', Arial, sans-serif; color:#991B1B;">Sự kiện:</td>
            <td style="padding:6px 0; font:14px 'Segoe UI', Arial, sans-serif; color:#7F1D1D; font-weight:600;">{{alert_description}}</td>
          </tr>
          <tr>
            <td width="110" style="padding:6px 0; font:13px 'Segoe UI', Arial, sans-serif; color:#991B1B;">Thời gian:</td>
            <td style="padding:6px 0; font:14px 'Segoe UI', Arial, sans-serif; color:#7F1D1D;">{{alert_time}}</td>
          </tr>
          <tr>
            <td width="110" style="padding:6px 0; font:13px 'Segoe UI', Arial, sans-serif; color:#991B1B;">Địa chỉ IP:</td>
            <td style="padding:6px 0; font:14px 'Segoe UI', Arial, sans-serif; color:#7F1D1D;">{{alert_ip}}</td>
          </tr>
          <tr>
            <td width="110" style="padding:6px 0; font:13px 'Segoe UI', Arial, sans-serif; color:#991B1B;">Vị trí:</td>
            <td style="padding:6px 0; font:14px 'Segoe UI', Arial, sans-serif; color:#7F1D1D;">{{alert_location}}</td>
          </tr>
        </table>
      </td>
    </tr>
  </table>

  <!-- Hướng dẫn xử lý -->
  <p style="margin:0 0 8px; font:600 15px 'Segoe UI', Arial, sans-serif; color:#1F2937;">
    Bạn cần làm gì ngay bây giờ?
  </p>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 20px;">
    <tr>
      <td style="padding:8px 0 8px 16px; font:14px/22px 'Segoe UI', Arial, sans-serif; color:#4B5563;">
        <strong style="color:#2563EB;">1.</strong>&nbsp; Đổi mật khẩu tài khoản ngay lập tức
      </td>
    </tr>
    <tr>
      <td style="padding:8px 0 8px 16px; font:14px/22px 'Segoe UI', Arial, sans-serif; color:#4B5563;">
        <strong style="color:#2563EB;">2.</strong>&nbsp; Kiểm tra và ngắt các phiên đăng nhập lạ
      </td>
    </tr>
    <tr>
      <td style="padding:8px 0 8px 16px; font:14px/22px 'Segoe UI', Arial, sans-serif; color:#4B5563;">
        <strong style="color:#2563EB;">3.</strong>&nbsp; Bật xác thực hai yếu tố (2FA) nếu chưa kích hoạt
      </td>
    </tr>
  </table>

  <!-- CTA Button -->
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 24px;">
    <tr>
      <td align="center" style="background-color:#DC2626; border-radius:8px;">
        <a href="{{secure_account_url}}" target="_blank"
           style="display:inline-block; padding:14px 36px; font:600 15px 'Segoe UI', Arial, sans-serif; color:#FFFFFF; text-decoration:none;">
          🔒 Bảo vệ tài khoản ngay
        </a>
      </td>
    </tr>
  </table>

  <!-- Lời kết -->
  <p style="margin:0; font:13px/20px 'Segoe UI', Arial, sans-serif; color:#9CA3AF;">
    Nếu bạn nhận ra đây là hoạt động của mình, bạn có thể bỏ qua email này. Trong trường hợp cần hỗ trợ khẩn cấp, vui lòng
    <a href="{{support_url}}" style="color:#2563EB; text-decoration:none;">liên hệ đội ngũ bảo mật</a>.
  </p>
</td>
```

---

### 2.6 Template: Email chào mừng khi tạo tài khoản mới

**Subject line:** `[ViLead CRM] Chào mừng bạn đến với ViLead — Tài khoản đã sẵn sàng! 🎉`

**Biến cần truyền:** `{{recipient_name}}`, `{{email}}`, `{{role}}`, `{{login_url}}`, `{{guide_url}}`, `{{support_url}}`

**Nội dung body:**

```html
<td style="padding:32px;">
  <!-- Tiêu đề -->
  <h1 style="margin:0 0 8px; font:700 22px 'Segoe UI', Arial, Helvetica, sans-serif; color:#1F2937;">
    Chào mừng đến với ViLead CRM! 🎉
  </h1>

  <!-- Lời chào -->
  <p style="margin:0 0 20px; font:15px/26px 'Segoe UI', Arial, Helvetica, sans-serif; color:#4B5563; text-align:justify;">
    Xin chào <strong style="color:#1F2937;">{{recipient_name}}</strong>,
  </p>

  <!-- Nội dung chính -->
  <p style="margin:0 0 24px; font:15px/26px 'Segoe UI', Arial, Helvetica, sans-serif; color:#4B5563; text-align:justify;">
    Tài khoản CRM ViLead của bạn đã được tạo thành công. Chúng tôi rất vui được đồng hành cùng bạn trong hành trình quản lý khách hàng hiệu quả hơn. Dưới đây là thông tin tài khoản của bạn:
  </p>

  <!-- Account Info Box -->
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 24px;">
    <tr>
      <td style="padding:20px 24px; background-color:#F0F5FF; border-radius:8px; border:1px solid #BFDBFE;">
        <p style="margin:0 0 14px; font:600 14px 'Segoe UI', Arial, sans-serif; color:#1E40AF;">
          🔑 Thông tin tài khoản
        </p>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td width="110" style="padding:6px 0; font:13px 'Segoe UI', Arial, sans-serif; color:#6B7280;">Email:</td>
            <td style="padding:6px 0; font:14px 'Segoe UI', Arial, sans-serif; color:#1F2937; font-weight:600;">{{email}}</td>
          </tr>
          <tr>
            <td width="110" style="padding:6px 0; font:13px 'Segoe UI', Arial, sans-serif; color:#6B7280;">Vai trò:</td>
            <td style="padding:6px 0; font:14px 'Segoe UI', Arial, sans-serif; color:#1F2937;">{{role}}</td>
          </tr>
        </table>
      </td>
    </tr>
  </table>

  <!-- CTA Button -->
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:0 auto 24px;">
    <tr>
      <td align="center" style="background-color:#2563EB; border-radius:8px;">
        <a href="{{login_url}}" target="_blank"
           style="display:inline-block; padding:14px 40px; font:600 15px 'Segoe UI', Arial, sans-serif; color:#FFFFFF; text-decoration:none; letter-spacing:0.3px;">
          Đăng nhập ngay
        </a>
      </td>
    </tr>
  </table>

  <!-- Hướng dẫn bắt đầu -->
  <p style="margin:0 0 8px; font:600 15px 'Segoe UI', Arial, sans-serif; color:#1F2937;">
    Bắt đầu nhanh với ViLead
  </p>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 24px;">
    <tr>
      <td style="padding:8px 0 8px 16px; font:14px/22px 'Segoe UI', Arial, sans-serif; color:#4B5563;">
        <strong style="color:#2563EB;">1.</strong>&nbsp; Đăng nhập và cập nhật thông tin cá nhân
      </td>
    </tr>
    <tr>
      <td style="padding:8px 0 8px 16px; font:14px/22px 'Segoe UI', Arial, sans-serif; color:#4B5563;">
        <strong style="color:#2563EB;">2.</strong>&nbsp; Khám phá Dashboard tổng quan
      </td>
    </tr>
    <tr>
      <td style="padding:8px 0 8px 16px; font:14px/22px 'Segoe UI', Arial, sans-serif; color:#4B5563;">
        <strong style="color:#2563EB;">3.</strong>&nbsp; Tạo lead đầu tiên và bắt đầu quy trình bán hàng
      </td>
    </tr>
  </table>

  <!-- Đường kẻ -->
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 20px;">
    <tr><td style="border-top:1px solid #E5E7EB;"></td></tr>
  </table>

  <!-- Lời kết -->
  <p style="margin:0; font:13px/20px 'Segoe UI', Arial, sans-serif; color:#9CA3AF;">
    Cần hướng dẫn chi tiết? Truy cập <a href="{{guide_url}}" style="color:#2563EB; text-decoration:none;">Trung tâm hướng dẫn</a> hoặc
    <a href="{{support_url}}" style="color:#2563EB; text-decoration:none;">liên hệ đội ngũ hỗ trợ</a>. Chúng tôi luôn sẵn sàng đồng hành cùng bạn.
  </p>
</td>
```

---

### 2.7 Template: Nhắc nhở khách hàng thanh toán

**Subject line:** `[ViLead CRM] Nhắc nhở thanh toán — Hóa đơn #{{invoice_code}}`

**Biến cần truyền:** `{{recipient_name}}`, `{{invoice_code}}`, `{{invoice_amount}}`, `{{due_date}}`, `{{days_remaining}}`, `{{payment_url}}`, `{{invoice_detail_url}}`, `{{support_url}}`

**Nội dung body:**

```html
<td style="padding:32px;">
  <!-- Tiêu đề -->
  <h1 style="margin:0 0 8px; font:700 22px 'Segoe UI', Arial, Helvetica, sans-serif; color:#1F2937;">
    Nhắc nhở thanh toán
  </h1>

  <!-- Lời chào -->
  <p style="margin:0 0 20px; font:15px/26px 'Segoe UI', Arial, Helvetica, sans-serif; color:#4B5563; text-align:justify;">
    Kính gửi <strong style="color:#1F2937;">{{recipient_name}}</strong>,
  </p>

  <!-- Nội dung chính -->
  <p style="margin:0 0 24px; font:15px/26px 'Segoe UI', Arial, Helvetica, sans-serif; color:#4B5563; text-align:justify;">
    Chúng tôi xin nhắc nhở rằng hóa đơn dưới đây sắp đến hạn thanh toán. Vui lòng kiểm tra và hoàn tất thanh toán đúng hạn để tránh gián đoạn dịch vụ.
  </p>

  <!-- Invoice Info Box -->
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 24px;">
    <tr>
      <td style="padding:20px 24px; background-color:#F9FAFB; border-radius:8px; border:1px solid #E5E7EB;">
        <p style="margin:0 0 14px; font:600 14px 'Segoe UI', Arial, sans-serif; color:#1F2937;">
          📋 Thông tin hóa đơn
        </p>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td width="130" style="padding:8px 0; font:13px 'Segoe UI', Arial, sans-serif; color:#6B7280;">Mã hóa đơn:</td>
            <td style="padding:8px 0; font:14px 'Segoe UI', Arial, sans-serif; color:#1F2937; font-weight:600;">
              <a href="{{invoice_detail_url}}" style="color:#2563EB; text-decoration:none;">#{{invoice_code}}</a>
            </td>
          </tr>
          <tr>
            <td width="130" style="padding:8px 0; font:13px 'Segoe UI', Arial, sans-serif; color:#6B7280;">Số tiền:</td>
            <td style="padding:8px 0; font:700 18px 'Segoe UI', Arial, sans-serif; color:#1F2937;">{{invoice_amount}}</td>
          </tr>
          <tr>
            <td width="130" style="padding:8px 0; font:13px 'Segoe UI', Arial, sans-serif; color:#6B7280;">Hạn thanh toán:</td>
            <td style="padding:8px 0; font:14px 'Segoe UI', Arial, sans-serif; color:#DC2626; font-weight:600;">{{due_date}}</td>
          </tr>
          <tr>
            <td width="130" style="padding:8px 0; font:13px 'Segoe UI', Arial, sans-serif; color:#6B7280;">Còn lại:</td>
            <td style="padding:8px 0; font:14px 'Segoe UI', Arial, sans-serif; color:#D97706; font-weight:600;">{{days_remaining}} ngày</td>
          </tr>
        </table>
      </td>
    </tr>
  </table>

  <!-- CTA Button -->
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:0 auto 24px;">
    <tr>
      <td align="center" style="background-color:#2563EB; border-radius:8px;">
        <a href="{{payment_url}}" target="_blank"
           style="display:inline-block; padding:14px 40px; font:600 15px 'Segoe UI', Arial, sans-serif; color:#FFFFFF; text-decoration:none; letter-spacing:0.3px;">
          Thanh toán ngay
        </a>
      </td>
    </tr>
  </table>

  <!-- Lời kết -->
  <p style="margin:0; font:13px/20px 'Segoe UI', Arial, sans-serif; color:#9CA3AF;">
    Nếu bạn đã thanh toán, vui lòng bỏ qua email này — hệ thống có thể mất vài giờ để cập nhật trạng thái. Cần hỗ trợ? Hãy
    <a href="{{support_url}}" style="color:#2563EB; text-decoration:none;">liên hệ chúng tôi</a>.
  </p>
</td>
```

---

### 2.8 Template: Thông báo hết hạn — Gia hạn

**Subject line:** `[ViLead CRM] Gói dịch vụ của bạn sắp hết hạn — Gia hạn ngay`

**Biến cần truyền:** `{{recipient_name}}`, `{{plan_name}}`, `{{expiry_date}}`, `{{days_remaining}}`, `{{renew_url}}`, `{{support_url}}`

**Nội dung body:**

```html
<td style="padding:32px;">
  <!-- Tiêu đề -->
  <h1 style="margin:0 0 8px; font:700 22px 'Segoe UI', Arial, Helvetica, sans-serif; color:#1F2937;">
    Gói dịch vụ sắp hết hạn
  </h1>

  <!-- Lời chào -->
  <p style="margin:0 0 20px; font:15px/26px 'Segoe UI', Arial, Helvetica, sans-serif; color:#4B5563; text-align:justify;">
    Kính gửi <strong style="color:#1F2937;">{{recipient_name}}</strong>,
  </p>

  <!-- Nội dung chính -->
  <p style="margin:0 0 24px; font:15px/26px 'Segoe UI', Arial, Helvetica, sans-serif; color:#4B5563; text-align:justify;">
    Gói dịch vụ CRM ViLead mà bạn đang sử dụng sắp hết hạn. Để đảm bảo không bị gián đoạn trải nghiệm và dữ liệu, vui lòng gia hạn trước thời hạn.
  </p>

  <!-- Plan Info Box -->
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 24px;">
    <tr>
      <td style="padding:20px 24px; background-color:#FEF3C7; border-radius:8px; border:1px solid #FDE68A;">
        <p style="margin:0 0 14px; font:600 14px 'Segoe UI', Arial, sans-serif; color:#92400E;">
          ⏳ Thông tin gói dịch vụ
        </p>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td width="130" style="padding:6px 0; font:13px 'Segoe UI', Arial, sans-serif; color:#78350F;">Gói hiện tại:</td>
            <td style="padding:6px 0; font:14px 'Segoe UI', Arial, sans-serif; color:#78350F; font-weight:600;">{{plan_name}}</td>
          </tr>
          <tr>
            <td width="130" style="padding:6px 0; font:13px 'Segoe UI', Arial, sans-serif; color:#78350F;">Ngày hết hạn:</td>
            <td style="padding:6px 0; font:14px 'Segoe UI', Arial, sans-serif; color:#DC2626; font-weight:600;">{{expiry_date}}</td>
          </tr>
          <tr>
            <td width="130" style="padding:6px 0; font:13px 'Segoe UI', Arial, sans-serif; color:#78350F;">Còn lại:</td>
            <td style="padding:6px 0; font:700 16px 'Segoe UI', Arial, sans-serif; color:#DC2626;">{{days_remaining}} ngày</td>
          </tr>
        </table>
      </td>
    </tr>
  </table>

  <!-- Lý do gia hạn -->
  <p style="margin:0 0 8px; font:600 15px 'Segoe UI', Arial, sans-serif; color:#1F2937;">
    Khi hết hạn, bạn sẽ mất quyền truy cập:
  </p>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 20px;">
    <tr>
      <td style="padding:6px 0 6px 16px; font:14px/22px 'Segoe UI', Arial, sans-serif; color:#4B5563;">
        ❌&nbsp; Quản lý leads và quy trình bán hàng
      </td>
    </tr>
    <tr>
      <td style="padding:6px 0 6px 16px; font:14px/22px 'Segoe UI', Arial, sans-serif; color:#4B5563;">
        ❌&nbsp; Báo cáo doanh số và phân tích hiệu suất
      </td>
    </tr>
    <tr>
      <td style="padding:6px 0 6px 16px; font:14px/22px 'Segoe UI', Arial, sans-serif; color:#4B5563;">
        ❌&nbsp; Tích hợp Zalo, Facebook và email marketing
      </td>
    </tr>
    <tr>
      <td style="padding:6px 0 6px 16px; font:14px/22px 'Segoe UI', Arial, sans-serif; color:#4B5563;">
        ❌&nbsp; Tự động hóa và nhắc nhở công việc
      </td>
    </tr>
  </table>

  <!-- CTA Button -->
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:0 auto 24px;">
    <tr>
      <td align="center" style="background-color:#2563EB; border-radius:8px;">
        <a href="{{renew_url}}" target="_blank"
           style="display:inline-block; padding:14px 40px; font:600 15px 'Segoe UI', Arial, sans-serif; color:#FFFFFF; text-decoration:none; letter-spacing:0.3px;">
          Gia hạn ngay
        </a>
      </td>
    </tr>
  </table>

  <!-- Lời kết -->
  <p style="margin:0; font:13px/20px 'Segoe UI', Arial, sans-serif; color:#9CA3AF;">
    Dữ liệu của bạn sẽ được lưu giữ trong 30 ngày sau khi hết hạn. Nếu cần tư vấn gói phù hợp hoặc hỗ trợ gia hạn, vui lòng
    <a href="{{support_url}}" style="color:#2563EB; text-decoration:none;">liên hệ đội ngũ CSKH</a>.
  </p>
</td>
```

---

### 2.9 Template: Thông báo kết quả Campaign

**Subject line:** `[ViLead CRM] Báo cáo chiến dịch "{{campaign_name}}" đã hoàn tất`

**Biến cần truyền:** `{{recipient_name}}`, `{{campaign_name}}`, `{{campaign_channel}}`, `{{sent_count}}`, `{{open_rate}}`, `{{click_rate}}`, `{{conversion_rate}}`, `{{new_leads}}`, `{{campaign_date}}`, `{{report_url}}`, `{{support_url}}`

**Nội dung body:**

```html
<td style="padding:32px;">
  <!-- Tiêu đề -->
  <h1 style="margin:0 0 8px; font:700 22px 'Segoe UI', Arial, Helvetica, sans-serif; color:#1F2937;">
    Báo cáo kết quả chiến dịch
  </h1>

  <!-- Lời chào -->
  <p style="margin:0 0 20px; font:15px/26px 'Segoe UI', Arial, Helvetica, sans-serif; color:#4B5563; text-align:justify;">
    Xin chào <strong style="color:#1F2937;">{{recipient_name}}</strong>,
  </p>

  <!-- Nội dung chính -->
  <p style="margin:0 0 24px; font:15px/26px 'Segoe UI', Arial, Helvetica, sans-serif; color:#4B5563; text-align:justify;">
    Chiến dịch <strong style="color:#1F2937;">"{{campaign_name}}"</strong> đã hoàn tất. Dưới đây là tóm tắt kết quả thực hiện:
  </p>

  <!-- Campaign Summary Box -->
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 8px;">
    <tr>
      <td style="padding:20px 24px; background-color:#F0F5FF; border-radius:8px 8px 0 0; border:1px solid #BFDBFE; border-bottom:none;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td width="130" style="padding:6px 0; font:13px 'Segoe UI', Arial, sans-serif; color:#6B7280;">Chiến dịch:</td>
            <td style="padding:6px 0; font:14px 'Segoe UI', Arial, sans-serif; color:#1F2937; font-weight:600;">{{campaign_name}}</td>
          </tr>
          <tr>
            <td width="130" style="padding:6px 0; font:13px 'Segoe UI', Arial, sans-serif; color:#6B7280;">Kênh:</td>
            <td style="padding:6px 0; font:14px 'Segoe UI', Arial, sans-serif; color:#1F2937;">{{campaign_channel}}</td>
          </tr>
          <tr>
            <td width="130" style="padding:6px 0; font:13px 'Segoe UI', Arial, sans-serif; color:#6B7280;">Ngày thực hiện:</td>
            <td style="padding:6px 0; font:14px 'Segoe UI', Arial, sans-serif; color:#1F2937;">{{campaign_date}}</td>
          </tr>
        </table>
      </td>
    </tr>
  </table>

  <!-- Metrics Grid (2x2) -->
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 24px;">
    <tr>
      <td style="border:1px solid #BFDBFE; border-radius:0 0 0 8px; padding:16px; text-align:center; width:25%; background-color:#FFFFFF;">
        <p style="margin:0 0 4px; font:13px 'Segoe UI', Arial, sans-serif; color:#6B7280;">Đã gửi</p>
        <p style="margin:0; font:700 22px 'Segoe UI', Arial, sans-serif; color:#2563EB;">{{sent_count}}</p>
      </td>
      <td style="border:1px solid #BFDBFE; border-left:none; padding:16px; text-align:center; width:25%; background-color:#FFFFFF;">
        <p style="margin:0 0 4px; font:13px 'Segoe UI', Arial, sans-serif; color:#6B7280;">Tỷ lệ mở</p>
        <p style="margin:0; font:700 22px 'Segoe UI', Arial, sans-serif; color:#059669;">{{open_rate}}</p>
      </td>
      <td style="border:1px solid #BFDBFE; border-left:none; padding:16px; text-align:center; width:25%; background-color:#FFFFFF;">
        <p style="margin:0 0 4px; font:13px 'Segoe UI', Arial, sans-serif; color:#6B7280;">Tỷ lệ click</p>
        <p style="margin:0; font:700 22px 'Segoe UI', Arial, sans-serif; color:#D97706;">{{click_rate}}</p>
      </td>
      <td style="border:1px solid #BFDBFE; border-left:none; border-radius:0 0 8px 0; padding:16px; text-align:center; width:25%; background-color:#FFFFFF;">
        <p style="margin:0 0 4px; font:13px 'Segoe UI', Arial, sans-serif; color:#6B7280;">Chuyển đổi</p>
        <p style="margin:0; font:700 22px 'Segoe UI', Arial, sans-serif; color:#DC2626;">{{conversion_rate}}</p>
      </td>
    </tr>
  </table>

  <!-- Lead mới -->
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 24px;">
    <tr>
      <td style="padding:16px 20px; background-color:#ECFDF5; border-radius:8px; border-left:4px solid #059669;">
        <p style="margin:0; font:14px/22px 'Segoe UI', Arial, sans-serif; color:#065F46;">
          🎯 Chiến dịch đã thu về <strong style="font-size:18px;">{{new_leads}} lead mới</strong> cho hệ thống.
        </p>
      </td>
    </tr>
  </table>

  <!-- CTA Button -->
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:0 auto 24px;">
    <tr>
      <td align="center" style="background-color:#2563EB; border-radius:8px;">
        <a href="{{report_url}}" target="_blank"
           style="display:inline-block; padding:14px 40px; font:600 15px 'Segoe UI', Arial, sans-serif; color:#FFFFFF; text-decoration:none; letter-spacing:0.3px;">
          Xem báo cáo chi tiết
        </a>
      </td>
    </tr>
  </table>

  <!-- Lời kết -->
  <p style="margin:0; font:13px/20px 'Segoe UI', Arial, sans-serif; color:#9CA3AF;">
    Bạn có thể xuất báo cáo dưới dạng Excel/CSV từ trang báo cáo. Nếu cần phân tích chuyên sâu hơn, vui lòng
    <a href="{{support_url}}" style="color:#2563EB; text-decoration:none;">liên hệ đội ngũ hỗ trợ</a>.
  </p>
</td>
```

---

## 3. Checklist cho Developer

Khi implement, kiểm tra các điểm sau:

| # | Kiểm tra | Trạng thái |
|---|----------|------------|
| 1 | Tất cả CSS đều viết inline (không dùng `<style>` tag) | ☐ |
| 2 | Tất cả biến `{{variable}}` đã được backend map đúng | ☐ |
| 3 | Các link `{{url}}` trỏ đúng endpoint | ☐ |
| 4 | Font fallback chain: `'Segoe UI', Arial, Helvetica, sans-serif` | ☐ |
| 5 | `role="presentation"` trên mọi layout table | ☐ |
| 6 | Hiển thị đúng trên Gmail, Outlook, Apple Mail | ☐ |
| 7 | Responsive trên mobile (width tối đa 600px) | ☐ |
| 8 | Tiếng Việt hiển thị đúng dấu, không lỗi encoding | ☐ |
| 9 | KHÔNG sửa header và footer — chỉ sửa body content | ☐ |
| 10 | Subject line đã cập nhật đúng theo spec | ☐ |
| 11 | Fallback URL cho nút CTA (template 2.4) | ☐ |
| 12 | Emoji hiển thị đúng trên các email client | ☐ |

---

## 4. Danh sách biến tổng hợp (Variable Reference)

| Template | Biến | Kiểu | Ví dụ |
|----------|------|------|-------|
| Tất cả | `{{recipient_name}}` | String | "Nguyễn Văn A" |
| Tất cả | `{{support_url}}` | URL | "https://crm.vilead.vn/support" |
| 2.1 OTP | `{{otp_code}}` | String (6 số) | "482916" |
| 2.1 OTP | `{{expiry_minutes}}` | Number | 5 |
| 2.2 Đổi MK | `{{changed_time}}` | DateTime | "02/02/2026, 14:30 +07" |
| 2.2 Đổi MK | `{{changed_ip}}` | String | "118.69.xx.xx" |
| 2.2 Đổi MK | `{{device_info}}` | String | "Chrome 120 / Windows 11" |
| 2.3 Thiết bị mới | `{{login_time}}` | DateTime | "02/02/2026, 09:15 +07" |
| 2.3 Thiết bị mới | `{{login_ip}}` | String | "203.162.xx.xx" |
| 2.3 Thiết bị mới | `{{device_info}}` | String | "Safari / iPhone 15" |
| 2.3 Thiết bị mới | `{{location}}` | String | "Hà Nội, Việt Nam" |
| 2.3 Thiết bị mới | `{{secure_account_url}}` | URL | Link bảo vệ tài khoản |
| 2.4 Forgot PW | `{{reset_url}}` | URL | Link reset password (có token) |
| 2.4 Forgot PW | `{{expiry_minutes}}` | Number | 30 |
| 2.5 Bất thường | `{{alert_description}}` | String | "Đăng nhập sai mật khẩu 5 lần" |
| 2.5 Bất thường | `{{alert_time}}` | DateTime | "02/02/2026, 03:42 +07" |
| 2.5 Bất thường | `{{alert_ip}}` | String | "45.77.xx.xx" |
| 2.5 Bất thường | `{{alert_location}}` | String | "Singapore" |
| 2.5 Bất thường | `{{secure_account_url}}` | URL | Link bảo vệ tài khoản |
| 2.6 Chào mừng | `{{email}}` | Email | "user@company.vn" |
| 2.6 Chào mừng | `{{role}}` | String | "Sales" / "Admin" |
| 2.6 Chào mừng | `{{login_url}}` | URL | "https://crm.vilead.vn/login" |
| 2.6 Chào mừng | `{{guide_url}}` | URL | Link hướng dẫn sử dụng |
| 2.7 Thanh toán | `{{invoice_code}}` | String | "INV-2026-0042" |
| 2.7 Thanh toán | `{{invoice_amount}}` | String | "2.500.000 VNĐ" |
| 2.7 Thanh toán | `{{due_date}}` | Date | "15/02/2026" |
| 2.7 Thanh toán | `{{days_remaining}}` | Number | 13 |
| 2.7 Thanh toán | `{{payment_url}}` | URL | Link thanh toán |
| 2.7 Thanh toán | `{{invoice_detail_url}}` | URL | Link chi tiết hóa đơn |
| 2.8 Hết hạn | `{{plan_name}}` | String | "Gói Doanh Nghiệp" |
| 2.8 Hết hạn | `{{expiry_date}}` | Date | "28/02/2026" |
| 2.8 Hết hạn | `{{days_remaining}}` | Number | 26 |
| 2.8 Hết hạn | `{{renew_url}}` | URL | Link gia hạn |
| 2.9 Campaign | `{{campaign_name}}` | String | "Khuyến mãi Tết 2026" |
| 2.9 Campaign | `{{campaign_channel}}` | String | "Email" / "Zalo" |
| 2.9 Campaign | `{{sent_count}}` | Number | 1,250 |
| 2.9 Campaign | `{{open_rate}}` | String | "68.5%" |
| 2.9 Campaign | `{{click_rate}}` | String | "23.1%" |
| 2.9 Campaign | `{{conversion_rate}}` | String | "8.7%" |
| 2.9 Campaign | `{{new_leads}}` | Number | 45 |
| 2.9 Campaign | `{{campaign_date}}` | Date | "01/02/2026" |
| 2.9 Campaign | `{{report_url}}` | URL | Link xem báo cáo |

---

> **Ghi chú cuối**: File spec này chỉ định nội dung phần body. Header (logo + tên hệ thống) và Footer (thông tin công ty, hotline, địa chỉ) đã được thiết kế sẵn và **KHÔNG CẦN SỬA ĐỔI**.
