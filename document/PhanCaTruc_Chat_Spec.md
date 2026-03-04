# NGHIỆP VỤ PHÂN CA TRỰC CHAT ZALO - ViLead CRM

> **Mục đích file**: Mô tả nghiệp vụ chi tiết để AI Coding Assistant (Copilot) triển khai code.
> **Module**: Chat đa kênh
> **Ngày**: 03/03/2026

---

## 1. TỔNG QUAN KIẾN TRÚC

### 1.1 Ba tầng nghiệp vụ

```
┌─────────────────────────────────────────────────────────────┐
│  TẦNG 1: PHÂN QUYỀN TÀI KHOẢN ZALO                        │
│  ┌──────────┐  ┌──────────┐  ┌──────────────┐              │
│  │ Quản trị │  │ Truy cập │  │ Không có quyền│              │
│  │ (Admin)  │  │ (Member) │  │   (None)     │              │
│  └────┬─────┘  └────┬─────┘  └──────────────┘              │
│       │              │                                       │
│  Bypass ca      Phải có ca                                   │
│  Xem ALL        trực mới nhận                                │
│  Thao tác ALL   chat tự động                                 │
├─────────────────────────────────────────────────────────────┤
│  TẦNG 2: CA TRỰC                                            │
│  ┌──────────────────────────────────────┐                   │
│  │ Ca sáng (08:00-12:00) → NV A, B     │                   │
│  │ Ca chiều (13:00-17:00) → NV C, D    │                   │
│  │ Ca tối (18:00-22:00) → NV E, F      │                   │
│  └──────────────────────────────────────┘                   │
├─────────────────────────────────────────────────────────────┤
│  TẦNG 3: PHÂN HỘI THOẠI TỰ ĐỘNG                           │
│  Tin nhắn Zalo → Check ca → Round-Robin → Assign NV        │
│  Ngoài giờ → Queue → Phân khi ca mới bắt đầu              │
└─────────────────────────────────────────────────────────────┘
```

### 1.2 Mối quan hệ giữa các entity

```
zalo_connections (1) ──── (N) zalo_account_permissions
zalo_connections (1) ──── (N) chat_shifts
chat_shifts      (N) ──── (N) chat_shift_members (junction table)
chat_shifts      (1) ──── (N) chat_queue (hàng đợi ngoài giờ)
conversations    (1) ──── (N) messages
users            (1) ──── (N) zalo_account_permissions
users            (1) ──── (N) chat_shift_members
```

---

## 2. DATA MODEL

### 2.1 Bảng `zalo_account_permissions`

> Phân quyền NV trên từng tài khoản Zalo.

```sql
CREATE TABLE zalo_account_permissions (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  zalo_connection_id UUID NOT NULL REFERENCES zalo_connections(id) ON DELETE CASCADE,
  user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- 3 giá trị: 'admin' | 'member' | 'none'
  permission_level VARCHAR(10) NOT NULL DEFAULT 'none'
    CHECK (permission_level IN ('admin', 'member', 'none')),
  
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW(),
  created_by      UUID REFERENCES users(id),
  
  UNIQUE(zalo_connection_id, user_id)
);

-- Index
CREATE INDEX idx_zap_zalo_id ON zalo_account_permissions(zalo_connection_id);
CREATE INDEX idx_zap_user_id ON zalo_account_permissions(user_id);
CREATE INDEX idx_zap_level ON zalo_account_permissions(permission_level);
```

**Business Rules:**
- Owner kết nối Zalo → mặc định `permission_level = 'admin'`
- NV mới thêm vào hệ thống → mặc định `'none'` trên tất cả tài khoản
- Phải có ít nhất 1 `'admin'` trên mỗi tài khoản (validate trước khi hạ quyền)
- Khi set `'none'` → gỡ NV khỏi tất cả ca trực của tài khoản + unassign hội thoại

### 2.2 Bảng `chat_shifts`

> Ca trực gắn với tài khoản Zalo cụ thể.

```sql
CREATE TABLE chat_shifts (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  zalo_connection_id UUID NOT NULL REFERENCES zalo_connections(id) ON DELETE CASCADE,
  
  name              VARCHAR(100) NOT NULL,           -- "Ca sáng", "Ca tối"
  start_time        TIME NOT NULL,                   -- 08:00
  end_time          TIME NOT NULL,                   -- 17:00
  days_of_week      INTEGER[] NOT NULL,              -- {1,2,3,4,5} (1=Mon, 7=Sun)
  is_overnight      BOOLEAN DEFAULT FALSE,           -- Ca qua đêm (22:00-06:00)
  status            VARCHAR(10) DEFAULT 'active'     -- 'active' | 'inactive'
    CHECK (status IN ('active', 'inactive')),
  
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW(),
  created_by        UUID REFERENCES users(id)
);

CREATE INDEX idx_cs_zalo ON chat_shifts(zalo_connection_id);
CREATE INDEX idx_cs_status ON chat_shifts(status);
```

**Business Rules:**
- `is_overnight = TRUE` khi `end_time < start_time` (VD: 22:00-06:00)
- Validate: `days_of_week` phải có ít nhất 1 phần tử, giá trị 1-7
- Không cho xóa shift đang có member → phải gỡ hết NV trước
- `status = 'inactive'`: NV trong ca không nhận chat tự động

### 2.3 Bảng `chat_shift_members` (Junction)

> Gán NV vào ca trực. Chỉ NV có permission_level = 'member' mới được gán.

```sql
CREATE TABLE chat_shift_members (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shift_id      UUID NOT NULL REFERENCES chat_shifts(id) ON DELETE CASCADE,
  user_id       UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  created_by    UUID REFERENCES users(id),
  
  UNIQUE(shift_id, user_id)
);

CREATE INDEX idx_csm_shift ON chat_shift_members(shift_id);
CREATE INDEX idx_csm_user ON chat_shift_members(user_id);
```

**Business Rules:**
- Validate trước khi INSERT: user phải có `zalo_account_permissions.permission_level = 'member'` trên cùng `zalo_connection_id` của shift
- Một NV có thể thuộc nhiều shift (kể cả trùng giờ)
- `admin` không cần gán shift (bypass tự động)

### 2.4 Bảng `chat_queue`

> Hàng đợi cho hội thoại ngoài giờ.

```sql
CREATE TABLE chat_queue (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id   UUID NOT NULL REFERENCES conversations(id),
  zalo_connection_id UUID NOT NULL REFERENCES zalo_connections(id),
  
  status            VARCHAR(20) DEFAULT 'pending'
    CHECK (status IN ('pending', 'assigned', 'expired')),
  
  queued_at         TIMESTAMPTZ DEFAULT NOW(),
  assigned_at       TIMESTAMPTZ,
  assigned_to       UUID REFERENCES users(id)
);

CREATE INDEX idx_cq_status ON chat_queue(status);
CREATE INDEX idx_cq_zalo ON chat_queue(zalo_connection_id);
```

### 2.5 Bổ sung bảng `messages`

> Thêm field để tracking "Gửi bởi ai".

```sql
ALTER TABLE messages ADD COLUMN sent_by_user_id UUID REFERENCES users(id);
ALTER TABLE messages ADD COLUMN sent_by_name VARCHAR(255);
-- sent_by_name: snapshot tên NV tại thời điểm gửi (không thay đổi khi NV đổi tên)
```

### 2.6 Bảng `chat_shift_settings`

> Cấu hình toàn cục cho phân ca.

```sql
CREATE TABLE chat_shift_settings (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  zalo_connection_id    UUID NOT NULL REFERENCES zalo_connections(id) ON DELETE CASCADE,
  
  max_conversations     INTEGER DEFAULT 20,       -- Max hội thoại active/NV
  shift_buffer_minutes  INTEGER DEFAULT 15,        -- Buffer chuyển ca (phút)
  queue_alert_threshold INTEGER DEFAULT 5,          -- Cảnh báo khi queue > N
  
  updated_at            TIMESTAMPTZ DEFAULT NOW(),
  updated_by            UUID REFERENCES users(id),
  
  UNIQUE(zalo_connection_id)
);
```

---

## 3. API ENDPOINTS

### 3.1 Phân quyền tài khoản Zalo

```
GET    /api/zalo-accounts/:id/permissions
       → Danh sách NV + permission_level
       → Chỉ admin/admin-zalo gọi được

PUT    /api/zalo-accounts/:id/permissions/:userId
       Body: { permission_level: 'admin' | 'member' | 'none' }
       → Validate: không hạ admin cuối cùng
       → Nếu set 'none': cascade gỡ shift_members + unassign conversations
       → Log activity_log

GET    /api/zalo-accounts/:id/members
       → Danh sách NV có quyền 'admin' hoặc 'member' (dùng cho dropdown)
```

### 3.2 Ca trực

```
GET    /api/zalo-accounts/:id/shifts
       → Danh sách ca trực của tài khoản Zalo
       → admin/admin-zalo: xem tất cả
       → member: xem ca mình thuộc

POST   /api/zalo-accounts/:id/shifts
       Body: { name, start_time, end_time, days_of_week }
       → Auto detect is_overnight
       → Chỉ admin/admin-zalo

PUT    /api/shifts/:shiftId
       Body: { name?, start_time?, end_time?, days_of_week?, status? }
       → Chỉ admin/admin-zalo

DELETE /api/shifts/:shiftId
       → Validate: không có member → nếu có thì trả lỗi 400
       → Chỉ admin/admin-zalo
```

### 3.3 Gán NV vào ca

```
GET    /api/shifts/:shiftId/members
       → Danh sách NV trong ca

POST   /api/shifts/:shiftId/members
       Body: { user_id }
       → Validate: user phải có permission_level = 'member' trên zalo_connection tương ứng
       → Validate: không trùng
       → Chỉ admin/admin-zalo

DELETE /api/shifts/:shiftId/members/:userId
       → Gỡ NV khỏi ca
       → KHÔNG reassign hội thoại đang xử lý
       → Chỉ admin/admin-zalo

GET    /api/zalo-accounts/:id/available-members?shiftId=xxx
       → NV có permission = 'member' VÀ chưa thuộc shift này
       → Dùng cho dropdown "Thêm NV"
```

### 3.4 Chat Queue & Assignment

```
GET    /api/zalo-accounts/:id/queue
       → Danh sách hội thoại đang chờ phân
       → Chỉ admin/admin-zalo

POST   /api/conversations/:id/reassign
       Body: { user_id }
       → Gán thủ công, ghi đè auto-assign
       → Chỉ admin/admin-zalo
```

### 3.5 Settings

```
GET    /api/zalo-accounts/:id/shift-settings
PUT    /api/zalo-accounts/:id/shift-settings
       Body: { max_conversations?, shift_buffer_minutes?, queue_alert_threshold? }
```

---

## 4. BUSINESS LOGIC CHI TIẾT

### 4.1 Logic phân hội thoại tự động

```
FUNCTION autoAssignConversation(conversation, zalo_connection_id):

  // B1: Check đã assign chưa
  IF conversation.assigned_to IS NOT NULL:
    RETURN  // Giữ nguyên

  // B2: Lấy pool NV đang trực
  pool = []
  
  // 2a: NV Quản trị (luôn trong pool, bypass ca)
  admins = SELECT u.* FROM zalo_account_permissions zap
           JOIN users u ON u.id = zap.user_id
           WHERE zap.zalo_connection_id = zalo_connection_id
             AND zap.permission_level = 'admin'
             AND u.status = 'online'
  pool.addAll(admins)

  // 2b: NV Truy cập đang trong ca active
  current_time = NOW().time
  current_day = NOW().day_of_week  // 1=Mon, 7=Sun
  
  members = SELECT DISTINCT u.* FROM chat_shift_members csm
            JOIN chat_shifts cs ON cs.id = csm.shift_id
            JOIN users u ON u.id = csm.user_id
            WHERE cs.zalo_connection_id = zalo_connection_id
              AND cs.status = 'active'
              AND current_day = ANY(cs.days_of_week)
              AND u.status = 'online'
              AND (
                -- Ca bình thường
                (cs.is_overnight = FALSE AND current_time BETWEEN cs.start_time AND cs.end_time)
                OR
                -- Ca qua đêm
                (cs.is_overnight = TRUE AND (current_time >= cs.start_time OR current_time <= cs.end_time))
              )
  pool.addAll(members)  // DISTINCT để tránh trùng

  // B3: Nếu pool rỗng → xếp hàng đợi
  IF pool.isEmpty():
    INSERT INTO chat_queue (conversation_id, zalo_connection_id, status)
    VALUES (conversation.id, zalo_connection_id, 'pending')
    RETURN

  // B4: Ưu tiên returning customer
  previous_agent = SELECT assigned_to FROM conversations
                   WHERE zalo_sender_id = conversation.zalo_sender_id
                     AND assigned_to IS NOT NULL
                   ORDER BY updated_at DESC LIMIT 1
  
  IF previous_agent IN pool AND previous_agent.active_count < max_conversations:
    ASSIGN conversation TO previous_agent
    RETURN

  // B5: Round-Robin
  settings = SELECT * FROM chat_shift_settings 
             WHERE zalo_connection_id = zalo_connection_id
  max_conv = settings.max_conversations ?? 20
  
  // Sắp xếp: ít hội thoại nhất → nhận lâu nhất
  sorted_pool = pool
    .filter(u => u.active_conversation_count < max_conv)
    .sortBy(u => u.active_conversation_count ASC, u.last_assigned_at ASC)
  
  IF sorted_pool.isEmpty():
    // Tất cả đạt max → xếp hàng đợi
    INSERT INTO chat_queue...
    RETURN
  
  target = sorted_pool[0]
  
  // B6: Assign
  UPDATE conversations SET assigned_to = target.id WHERE id = conversation.id
  UPDATE users SET last_chat_assigned_at = NOW() WHERE id = target.id
  
  // B7: Notification
  SEND_NOTIFICATION(target, conversation)
  LOG_ACTIVITY('chat_auto_assign', conversation.id, target.id)
```

### 4.2 Logic chuyển ca

```
FUNCTION handleShiftEnd(shift):
  settings = getShiftSettings(shift.zalo_connection_id)
  buffer = settings.shift_buffer_minutes ?? 15

  // Lấy tất cả hội thoại của NV trong ca (chỉ NV member, không phải admin)
  members = SELECT user_id FROM chat_shift_members WHERE shift_id = shift.id
  
  FOR EACH member IN members:
    conversations = SELECT * FROM conversations
                    WHERE assigned_to = member.user_id
                      AND zalo_connection_id = shift.zalo_connection_id
                      AND status = 'open'
    
    FOR EACH conv IN conversations:
      last_msg_time = SELECT MAX(created_at) FROM messages WHERE conversation_id = conv.id
      
      IF (NOW() - last_msg_time) <= buffer minutes:
        // Active → giữ nguyên, schedule check lại sau buffer
        SCHEDULE checkConversation(conv.id) AFTER buffer minutes
      ELSE:
        // Inactive → chuyển UNASSIGNED
        UPDATE conversations SET assigned_to = NULL WHERE id = conv.id
        // Thử phân cho ca mới
        autoAssignConversation(conv, shift.zalo_connection_id)
  
  // Phân hàng đợi cho ca mới
  processQueue(shift.zalo_connection_id)
  
  // Thông báo
  NOTIFY_SHIFT_END(members, count_transferred)


FUNCTION processQueue(zalo_connection_id):
  pending = SELECT * FROM chat_queue 
            WHERE zalo_connection_id = zalo_connection_id 
              AND status = 'pending'
            ORDER BY queued_at ASC
  
  FOR EACH item IN pending:
    conv = getConversation(item.conversation_id)
    autoAssignConversation(conv, zalo_connection_id)
    
    IF conv.assigned_to IS NOT NULL:
      UPDATE chat_queue SET status = 'assigned', 
             assigned_to = conv.assigned_to,
             assigned_at = NOW()
      WHERE id = item.id
```

### 4.3 Logic gửi tin nhắn (bổ sung "Gửi bởi")

```
FUNCTION sendMessage(conversation_id, content, current_user):
  // Validate quyền
  zalo_conn = getZaloConnection(conversation_id)
  perm = SELECT permission_level FROM zalo_account_permissions
         WHERE zalo_connection_id = zalo_conn.id AND user_id = current_user.id
  
  IF perm = 'none' OR perm IS NULL:
    THROW 403 "Không có quyền"
  
  IF perm = 'member' AND conversation.assigned_to != current_user.id:
    // Member chỉ gửi được cho hội thoại assigned cho mình
    THROW 403 "Bạn không được assign hội thoại này"
  
  // Gửi qua Zalo API
  zaloResponse = callZaloAPI(content, conversation.zalo_sender_id)
  
  // Lưu message + metadata "gửi bởi"
  INSERT INTO messages (
    conversation_id, content, direction, status,
    sent_by_user_id, sent_by_name
  ) VALUES (
    conversation_id, content, 'outgoing', 'sent',
    current_user.id, current_user.display_name  -- Snapshot tên
  )
```

---

## 5. CRON JOBS & SCHEDULED TASKS

### 5.1 Kiểm tra ca trực kết thúc

```
// Chạy mỗi phút
CRON '* * * * *' checkShiftEnds():
  current_time = NOW().time
  current_day = NOW().day_of_week
  
  ending_shifts = SELECT * FROM chat_shifts
    WHERE status = 'active'
      AND current_day = ANY(days_of_week)
      AND (
        (is_overnight = FALSE AND end_time = current_time)  -- ±1 min tolerance
        OR
        (is_overnight = TRUE AND end_time = current_time)
      )
  
  FOR EACH shift IN ending_shifts:
    handleShiftEnd(shift)
```

### 5.2 Kiểm tra ca trực bắt đầu

```
// Chạy mỗi phút
CRON '* * * * *' checkShiftStarts():
  current_time = NOW().time
  current_day = NOW().day_of_week
  
  starting_shifts = SELECT * FROM chat_shifts
    WHERE status = 'active'
      AND current_day = ANY(days_of_week)
      AND start_time = current_time
  
  FOR EACH shift IN starting_shifts:
    processQueue(shift.zalo_connection_id)
    NOTIFY_SHIFT_START(shift)
```

### 5.3 Dọn dẹp queue cũ

```
// Chạy mỗi ngày 00:00
CRON '0 0 * * *' cleanupQueue():
  // Xóa queue pending > 24h
  UPDATE chat_queue SET status = 'expired'
  WHERE status = 'pending' AND queued_at < NOW() - INTERVAL '24 hours'
```

---

## 6. WEBSOCKET EVENTS

```typescript
// Khi phân hội thoại tự động
socket.emit('chat:assigned', {
  conversation_id: string,
  assigned_to: string,
  assigned_by: 'system' | string,  // 'system' = tự động, userId = thủ công
})

// Khi chuyển ca
socket.emit('chat:shift_ended', {
  shift_id: string,
  transferred_count: number,
  unassigned_count: number,
})

// Khi ca mới bắt đầu
socket.emit('chat:shift_started', {
  shift_id: string,
  queue_processed: number,
})

// Cảnh báo queue quá tải
socket.emit('chat:queue_alert', {
  zalo_connection_id: string,
  queue_count: number,
  threshold: number,
})
```

---

## 7. UI COMPONENTS CẦN TRIỂN KHAI

### 7.1 Cài đặt > Chat đa kênh > Tài khoản Zalo

```
ZaloAccountList
├── ZaloAccountCard (mỗi tài khoản)
│   ├── Tab "Tổng quan" (thông tin kết nối, trạng thái)
│   ├── Tab "Phân quyền" ← MỚI
│   │   └── PermissionTable
│   │       ├── UserRow (tên NV, vai trò CRM, dropdown quyền)
│   │       └── SearchFilter (tìm NV theo tên)
│   ├── Tab "Ca trực" ← MỚI
│   │   ├── ShiftList (danh sách ca)
│   │   ├── ShiftForm (modal tạo/sửa)
│   │   └── ShiftMemberPanel (gán NV vào ca)
│   │       ├── MemberList (NV đã gán)
│   │       └── AddMemberDropdown (chỉ NV permission=member)
│   └── Tab "Cài đặt" ← MỚI
│       └── ShiftSettingsForm (max conv, buffer, alert threshold)
```

### 7.2 Chat UI - Bổ sung

```
ChatMessage (component tin nhắn)
├── MessageContent (nội dung)
├── MessageStatus (đang gửi / đã gửi / đã đọc)
└── MessageMeta ← MỚI
    └── "Gửi lúc 14:30 03/03/2026 bởi Nguyễn Văn A"
    └── style: fontSize: 11px, color: #999
    └── Chỉ hiển thị cho direction = 'outgoing'
```

### 7.3 Dashboard ca trực (cho Admin/Quản trị viên)

```
ShiftDashboard
├── ActiveShiftCard (ca đang hoạt động)
│   ├── ShiftInfo (tên, giờ, tài khoản Zalo)
│   └── AgentList (NV đang trực, trạng thái, số hội thoại)
├── QueuePanel (hội thoại chờ phân)
│   ├── QueueCount (badge cảnh báo nếu > threshold)
│   └── QueueList (danh sách, nút reassign thủ công)
└── StatsBar (thời gian phản hồi TB, tổng hội thoại hôm nay)
```

---

## 8. MIGRATION CHECKLIST

```
[ ] 1. Tạo bảng zalo_account_permissions
[ ] 2. Tạo bảng chat_shifts
[ ] 3. Tạo bảng chat_shift_members
[ ] 4. Tạo bảng chat_queue
[ ] 5. Tạo bảng chat_shift_settings
[ ] 6. ALTER messages: thêm sent_by_user_id, sent_by_name
[ ] 7. Migrate dữ liệu: owner kết nối Zalo → permission_level = 'admin'
[ ] 8. Seed default shift_settings cho tài khoản Zalo hiện có
```

---

## 9. TESTING SCENARIOS

### 9.1 Phân quyền

| # | Scenario | Expected |
|---|----------|----------|
| 1 | Admin set NV = 'member' | NV thấy tài khoản Zalo trong Chat |
| 2 | Admin set NV = 'none' | NV không thấy, gỡ khỏi ca, unassign hội thoại |
| 3 | Hạ admin cuối cùng | Báo lỗi, không cho phép |
| 4 | NV bị vô hiệu hóa CRM | Tự gỡ tất cả quyền + ca trực |

### 9.2 Ca trực

| # | Scenario | Expected |
|---|----------|----------|
| 1 | Tạo ca 08:00-17:00 T2-T6 | is_overnight=false, days=[1,2,3,4,5] |
| 2 | Tạo ca 22:00-06:00 | is_overnight=true |
| 3 | Gán NV không có quyền member | Báo lỗi 400 |
| 4 | Xóa ca có NV | Báo lỗi, yêu cầu gỡ NV trước |
| 5 | Tắt ca (inactive) | NV trong ca không nhận chat tự động |

### 9.3 Phân hội thoại

| # | Scenario | Expected |
|---|----------|----------|
| 1 | Tin nhắn 09:00 T2, ca sáng active | Phân cho NV trong ca sáng |
| 2 | Tin nhắn 23:00, không có ca | Xếp queue, phân khi ca sáng T3 bắt đầu |
| 3 | Returning customer | Ưu tiên NV cũ (nếu đang trong ca) |
| 4 | NV đạt max 20 hội thoại | Bỏ qua, phân NV tiếp theo |
| 5 | Quản trị viên online | Luôn trong pool, bypass ca |
| 6 | 2 ca trùng giờ | Gộp pool NV cả 2 ca |
| 7 | Hội thoại đã assign, tin mới đến | Giữ nguyên assign |

### 9.4 Chuyển ca

| # | Scenario | Expected |
|---|----------|----------|
| 1 | Hết ca, hội thoại active (< 15 phút) | Giữ NV, check lại sau 15 phút |
| 2 | Hết ca, hội thoại inactive | Chuyển UNASSIGNED ngay |
| 3 | Ca mới bắt đầu, queue có 3 hội thoại | Phân 3 hội thoại cho NV ca mới |
| 4 | Không có ca tiếp theo | Giữ queue, cảnh báo Admin |

### 9.5 Gửi bởi

| # | Scenario | Expected |
|---|----------|----------|
| 1 | NV A gửi tin | Hiển thị "Gửi lúc ... bởi NV A" |
| 2 | NV A đổi tên sau | Tin cũ vẫn hiển thị tên cũ (snapshot) |
| 3 | Tin từ khách | Không hiển thị metadata "gửi bởi" |
| 4 | Khách trên Zalo | Không thấy metadata (chỉ CRM hiển thị) |
