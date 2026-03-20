# Task 1.3: Phân Chia Lead — FE SPEC (Flow Thao Tác)

> **Dành cho:** Frontend Developer / Copilot AI
> **Mục đích:** Spec giao diện cho thao tác gán / re-assign Lead cho Sales
> **Vị trí trigger:** Danh sách Cơ hội bán hàng (Kanban + List view) + Chi tiết Lead
> **Phân quyền:** Admin, Leader, Manager — Sales KHÔNG có quyền này

---

## 1. TỔNG QUAN FLOW

```
User chọn Lead (1 hoặc nhiều)
        ↓
  Bấm nút "Phân chia Lead"
        ↓
  ┌── Lead đã có Sales? ──┐
  │ Chưa (new)            │ Rồi (re-assign)
  ↓                       ↓
  Mở Modal            Hiện Confirm
  Phân chia            "Lead đang thuộc Sales X.
                        Bạn muốn gán lại?"
                           ↓
                     [Hủy]  [Tiếp tục]
                              ↓
                        Mở Modal Phân chia
                              ↓
          ┌── Chọn phương thức ──┐
          │                      │
   "Tự động theo rule"    "Chọn thủ công"
          ↓                      ↓
   Gọi API auto-assign    Hiện form chọn Sales
   Hiển thị kết quả        + nhập lý do
          ↓                      ↓
        Done                  [Xác nhận]
                                 ↓
                               Done
```

---

## 2. NÚT TRIGGER — Ở ĐÂU HIỆN NÚT

### 2.1 Danh sách Lead (Kanban + List view)

**Trường hợp chọn 1 lead:**
- Kanban: Click chuột phải lên card → Context menu → "Phân chia Lead"
- List view: Click checkbox 1 dòng → Thanh action bar hiện ở trên → nút "Phân chia Lead"

**Trường hợp chọn nhiều lead (bulk):**
- List view: Tick nhiều checkbox → Thanh action bar → nút "Phân chia Lead (n)"
- Kanban: Không hỗ trợ bulk (chỉ chọn từng card)

**Thanh action bar (hiện khi có lead được chọn):**

```
┌──────────────────────────────────────────────────────────────┐
│  Đã chọn 3 lead    [Phân chia Lead]  [Gắn Tag]  [Xóa]  [✕] │
└──────────────────────────────────────────────────────────────┘
```

| Phần tử | Mô tả |
|---------|-------|
| "Đã chọn n lead" | Text hiển thị số lượng lead đang chọn |
| [Phân chia Lead] | Button primary. Icon: `UserSwitch` hoặc `Share`. Disabled nếu user không có quyền. |
| [✕] | Bỏ chọn tất cả, ẩn action bar |

### 2.2 Chi tiết Lead (Lead Detail)

**Vị trí:** Trong header của form chi tiết Lead, cạnh nút "Sửa" / "Xóa"

```
┌─────────────────────────────────────────────────────────┐
│  Nguyễn Văn A               Phụ trách: Sales B          │
│  098xxx | nguyena@...                                    │
│                                                          │
│  [Sửa]  [Phân chia lại]  [···]                           │
└─────────────────────────────────────────────────────────┘
```

| Điều kiện | Label nút | Mô tả |
|-----------|----------|-------|
| Lead chưa có Sales (assigned_to = NULL) | "Phân chia Lead" | Gán lần đầu |
| Lead đã có Sales | "Phân chia lại" | Re-assign sang người khác |

---

## 3. CONFIRM RE-ASSIGN (khi Lead đã có Sales)

**Trigger:** User bấm "Phân chia Lead" / "Phân chia lại" khi lead đã assigned.

**UI:** Confirm Dialog (Modal nhỏ, width ~450px)

```
┌──────────────────────────────────────────────┐
│  ⚠ Xác nhận phân chia lại                    │
├──────────────────────────────────────────────┤
│                                              │
│  Lead "Nguyễn Văn A" hiện đang được          │
│  phụ trách bởi Sales B.                      │
│                                              │
│  Nếu phân chia lại:                          │
│  • Sales B sẽ mất quyền phụ trách lead này   │
│  • Sales B sẽ nhận thông báo                  │
│                                              │
│  Bạn có muốn tiếp tục?                       │
│                                              │
│                        [Hủy]  [Tiếp tục]     │
└──────────────────────────────────────────────┘
```

**Khi chọn nhiều lead (bulk) mà có lead đã assigned:**

```
┌──────────────────────────────────────────────────┐
│  ⚠ Xác nhận phân chia                            │
├──────────────────────────────────────────────────┤
│                                                  │
│  Bạn đã chọn 5 lead, trong đó:                   │
│  • 2 lead chưa có người phụ trách                 │
│  • 3 lead đã có người phụ trách (sẽ bị gán lại)  │
│                                                  │
│  Sales hiện tại sẽ nhận thông báo mất lead.       │
│                                                  │
│                          [Hủy]  [Tiếp tục]       │
└──────────────────────────────────────────────────┘
```

| Phần tử | Mô tả |
|---------|-------|
| [Hủy] | Đóng dialog, không làm gì |
| [Tiếp tục] | Đóng confirm → Mở Modal Phân chia (Section 4) |

**Nếu lead chưa có Sales → bỏ qua bước này, mở Modal luôn.**

---

## 4. MODAL PHÂN CHIA LEAD (Component chính)

**UI:** Modal, width ~550px

### 4.1 Layout tổng

```
┌──────────────────────────────────────────────────┐
│  Phân chia Lead                            [✕]   │
├──────────────────────────────────────────────────┤
│                                                  │
│  ── THÔNG TIN LEAD ───────────────────────────── │
│  Tên: Nguyễn Văn A     SĐT: 098xxxxxxx          │
│  Nguồn: Facebook Ads   Khu vực: TP.HCM           │
│  (Khi bulk: "5 lead được chọn")                   │
│                                                  │
│  ── PHƯƠNG THỨC PHÂN CHIA ────────────────────── │
│                                                  │
│  ○ Tự động theo quy tắc đã cấu hình             │
│      Hệ thống sẽ áp dụng rule: Territory →       │
│      Source → Round-Robin (theo thứ tự ưu tiên)   │
│                                                  │
│  ● Chọn thủ công                                 │
│                                                  │
│      Sales nhận lead *                            │
│      ┌──────────────────────────────────┐        │
│      │ Chọn Sales...              ▼     │        │
│      └──────────────────────────────────┘        │
│      ⚡ Sales B: 12 lead đang xử lý              │
│      ⚡ Sales C: 5 lead đang xử lý (khuyến nghị) │
│                                                  │
│      Lý do phân chia *                            │
│      ┌──────────────────────────────────┐        │
│      │ Nhập lý do...                    │        │
│      │                                  │        │
│      └──────────────────────────────────┘        │
│                                                  │
│                       [Hủy]  [Xác nhận phân chia]│
└──────────────────────────────────────────────────┘
```

### 4.2 Phần: Thông tin Lead (read-only)

**Khi chọn 1 lead:**

| Field | Giá trị | Mô tả |
|-------|---------|-------|
| Tên | `lead.name` | Bold |
| SĐT | `lead.phone` | |
| Nguồn | `lead.source` | Badge màu |
| Khu vực | `lead.province` | |
| Sales hiện tại | `lead.assigned_to.name` hoặc "Chưa có" | Nếu đang re-assign → hiển thị tên Sales cũ, màu cam |

**Khi chọn nhiều lead (bulk):**
- Không hiện chi tiết từng lead
- Hiện: "**5 lead** được chọn" + nút "Xem danh sách ▾" (toggle expand danh sách tên lead)

### 4.3 Phần: Phương thức phân chia

**UI:** Radio group, 2 option

#### Option 1: "Tự động theo quy tắc đã cấu hình"

| Thuộc tính | Giá trị |
|-----------|---------|
| Value | `auto` |
| Label | "Tự động theo quy tắc đã cấu hình" |
| Mô tả phụ | Text nhỏ màu #888: Liệt kê thứ tự rule đang active, VD: "Territory → Source → Round-Robin" |
| Khi chọn | Ẩn phần form chọn Sales + lý do. Nút xác nhận đổi label → "Phân chia tự động" |
| API khi submit | `POST /api/v1/lead-assignment/assign` body: `{ lead_ids: [...] }` |

**Ghi chú:** Mô tả phụ lấy từ API cấu hình rule hiện tại (`GET /api/v1/lead-assignment/settings`). Chỉ liệt kê rule đang bật (is_active = true) theo thứ tự priority_order.

#### Option 2: "Chọn thủ công"

| Thuộc tính | Giá trị |
|-----------|---------|
| Value | `manual` |
| Label | "Chọn thủ công" |
| Khi chọn | Hiện thêm 2 field: Chọn Sales + Lý do |

**Các field khi chọn thủ công:**

**Field 1: Chọn Sales**

| Thuộc tính | Giá trị |
|-----------|---------|
| Label | "Sales nhận lead" |
| Required | Có (*) |
| UI | Select/Dropdown có search |
| Placeholder | "Tìm kiếm hoặc chọn Sales..." |
| Data source | `GET /api/v1/users?role=sales&status=active` |
| Hiển thị mỗi option | Tên Sales + Phòng ban + Badge workload (số lead đang xử lý) |
| Sắp xếp | Mặc định: theo workload tăng dần (ít lead nhất lên đầu) |
| Disable option | Sales có workload ≥ max_concurrent_leads → disable + tooltip "Đã đạt giới hạn (20/20 lead)" |

**Format mỗi option trong dropdown:**

```
┌──────────────────────────────────────────┐
│  👤 Trần Văn B  •  Phòng Sales 1         │
│     5 lead đang xử lý                    │  ← Workload thấp = xanh lá
├──────────────────────────────────────────┤
│  👤 Nguyễn C    •  Phòng Sales 2         │
│     18 lead đang xử lý                   │  ← Workload cao = cam
├──────────────────────────────────────────┤
│  👤 Lê D        •  Phòng Sales 1         │
│     20 lead đang xử lý  (đã đạt max)    │  ← Disabled, text xám
└──────────────────────────────────────────┘
```

**Workload badge màu:**
- 0-49% max → Xanh lá `#52C41A`
- 50-79% max → Cam `#FAAD14`
- 80-99% max → Đỏ nhạt `#FF7875`
- 100% (đạt max) → Xám `#BFBFBF`, disable

**Khi đã chọn Sales → hiện thêm info:**

```
✅ Sales B — 5/20 lead — Phòng Sales 1
   Khu vực phụ trách: TP.HCM, Đồng Nai
   Nguồn chuyên: Facebook Ads, Zalo OA
```

Thông tin này giúp Manager đánh giá nhanh có nên gán cho Sales này không.

**Field 2: Lý do phân chia**

| Thuộc tính | Giá trị |
|-----------|---------|
| Label | "Lý do phân chia" |
| Required | Có (*) |
| UI | Textarea |
| Placeholder | "Nhập lý do phân chia lead..." |
| Max length | 500 ký tự |
| Char counter | Hiện góc phải dưới textarea: "0/500" |
| Validation | Không được để trống. Min 5 ký tự. |
| Gợi ý nhanh | Dưới textarea có tag list gợi ý (click để fill): "VIP cần senior", "Theo khu vực", "Yêu cầu khách hàng", "Sales cũ nghỉ phép" |

**Tag gợi ý lý do:**

```
  Gợi ý: [VIP cần senior] [Theo khu vực] [Sales cũ bận] [KH yêu cầu]
```

Khi click 1 tag → điền text vào textarea. User có thể sửa thêm.

---

## 5. WARNINGS TRONG MODAL

Hệ thống kiểm tra và hiện cảnh báo (Alert banner vàng) bên trong modal khi phát hiện:

### 5.1 Sales đã có lead tương tự

```
⚠ Sales B đang xử lý 1 lead có email trùng (nguyena@gmail.com).
  Có thể là lead trùng lặp.
```

**Trigger:** Sau khi chọn Sales trong dropdown → FE gọi `GET /api/v1/lead-assignment/check-conflict?sales_id=...&lead_id=...`
**Không block submit** — chỉ cảnh báo.

### 5.2 Sales workload cao

```
⚠ Sales B đang xử lý 18/20 lead. Gán thêm có thể gây quá tải.
```

**Trigger:** Khi workload ≥ 80% max.

### 5.3 Lead đã bị reject bởi Sales này

```
⚠ Sales B đã từ chối lead này trước đó (lý do: "Không đúng chuyên môn").
```

**Trigger:** Check `lead.rejected_by_sales` có chứa sales_id đang chọn không.

---

## 6. XÁC NHẬN & KẾT QUẢ

### 6.1 Khi bấm [Xác nhận phân chia]

**Validation trước khi gọi API:**

| Phương thức | Check |
|-------------|-------|
| Tự động | Không cần check thêm |
| Thủ công | Sales đã chọn? + Lý do đã nhập (≥5 ký tự)? |

**Nếu lỗi:** Highlight field lỗi + tooltip đỏ.

**API gọi:**

| Phương thức | Endpoint | Body |
|-------------|----------|------|
| Tự động | `POST /api/v1/lead-assignment/assign` | `{ lead_ids: ["id1", "id2"] }` |
| Thủ công | `POST /api/v1/lead-assignment/manual-assign` | `{ lead_ids: ["id1"], sales_id: "xxx", reason: "VIP cần senior" }` |

**Loading state:** Nút → spinner + "Đang phân chia..." + disable toàn modal.

### 6.2 Kết quả thành công

**Khi 1 lead:**

```
┌──────────────────────────────────────────────┐
│  ✅ Phân chia thành công                      │
├──────────────────────────────────────────────┤
│                                              │
│  Lead: Nguyễn Văn A                          │
│  → Đã gán cho: Sales B                       │
│  Quy tắc áp dụng: Thủ công                   │
│                                              │
│                              [Đóng]          │
└──────────────────────────────────────────────┘
```

**Khi bulk (nhiều lead), phương thức tự động:**

```
┌──────────────────────────────────────────────┐
│  ✅ Phân chia thành công                      │
├──────────────────────────────────────────────┤
│                                              │
│  5 lead đã được phân chia:                    │
│                                              │
│  ┌────────────┬──────────┬──────────────┐    │
│  │ Lead       │ Sales    │ Quy tắc      │    │
│  ├────────────┼──────────┼──────────────┤    │
│  │ Nguyễn A   │ Sales B  │ Territory    │    │
│  │ Trần C     │ Sales D  │ Source       │    │
│  │ Lê E       │ Sales B  │ Round-Robin  │    │
│  │ Phạm F     │ --       │ Queue (chờ)  │    │
│  │ Hoàng G    │ Sales A  │ Relationship │    │
│  └────────────┴──────────┴──────────────┘    │
│                                              │
│  ⚠ 1 lead không gán được, đã đưa vào hàng   │
│    chờ (không có Sales available).            │
│                                              │
│                              [Đóng]          │
└──────────────────────────────────────────────┘
```

**Sau khi đóng modal:**
- Refresh danh sách Lead (reload data)
- Cập nhật cột "Người phụ trách" trên bảng
- Toast nhỏ góc phải: "Đã phân chia n lead thành công"

### 6.3 Kết quả lỗi

```
┌──────────────────────────────────────────────┐
│  ❌ Phân chia thất bại                        │
├──────────────────────────────────────────────┤
│                                              │
│  Không thể gán Lead cho Sales B.              │
│  Lý do: Sales B đã đạt giới hạn lead tối đa. │
│                                              │
│                     [Thử lại]  [Đóng]        │
└──────────────────────────────────────────────┘
```

**[Thử lại]** → Quay về bước chọn phương thức, giữ nguyên dữ liệu đã nhập.

---

## 7. API SUMMARY

| Thao tác | Method | Endpoint | Mô tả |
|----------|--------|----------|-------|
| Load danh sách Sales | GET | `/api/v1/users?role=sales&status=active` | Cho dropdown chọn Sales |
| Load rule đang active | GET | `/api/v1/lead-assignment/settings` | Hiển thị mô tả "Territory → Source → ..." |
| Check conflict | GET | `/api/v1/lead-assignment/check-conflict?sales_id=...&lead_id=...` | Kiểm tra lead trùng / Sales đã reject |
| Phân chia tự động | POST | `/api/v1/lead-assignment/assign` | `{ lead_ids: [...] }` |
| Phân chia thủ công | POST | `/api/v1/lead-assignment/manual-assign` | `{ lead_ids: [...], sales_id, reason }` |

**Response mẫu (POST assign / manual-assign):**

```json
{
  "success": true,
  "results": [
    { "lead_id": "id1", "lead_name": "Nguyễn A", "sales_id": "s1", "sales_name": "Sales B", "rule": "territory", "status": "assigned" },
    { "lead_id": "id2", "lead_name": "Phạm F", "sales_id": null, "sales_name": null, "rule": null, "status": "queued", "reason": "No available sales" }
  ],
  "summary": { "assigned": 4, "queued": 1, "failed": 0 }
}
```

---

## 8. PHÂN QUYỀN

| Role | Xem nút? | Phân tự động? | Phân thủ công? |
|------|:--------:|:-------------:|:--------------:|
| Admin | ✅ | ✅ | ✅ |
| Leader / Manager | ✅ | ✅ | ✅ |
| Sales | ❌ | ❌ | ❌ |
| CSKH | ❌ | ❌ | ❌ |

Nếu user không có quyền → nút "Phân chia Lead" không hiển thị (ẩn hoàn toàn, không disable).

---

## 9. STATES TỔNG HỢP

| State | Khi nào | UI |
|-------|---------|-----|
| Nút disabled | Chưa chọn lead nào | Button mờ, không click được |
| Loading dropdown Sales | Đang gọi API users | Spinner trong dropdown |
| Loading submit | Đang gọi API assign | Nút spinner + "Đang phân chia..." + disable modal |
| Warning conflict | Phát hiện lead trùng / workload cao | Alert banner vàng trong modal |
| Error validation | Field trống / lý do quá ngắn | Viền đỏ field + tooltip lỗi |
| Success | API trả về thành công | Hiện kết quả trong modal → Toast khi đóng |
| Error API | API lỗi 500 / network | Modal lỗi + nút Thử lại |
| Empty Sales | Không có Sales active nào | Dropdown empty: "Không có Sales khả dụng. Kiểm tra lại danh sách nhân viên." |
