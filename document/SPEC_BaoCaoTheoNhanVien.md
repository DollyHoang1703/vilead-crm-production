# SPEC: BÁO CÁO THEO NHÂN VIÊN

> **Module:** Báo cáo & Phân tích — Tab "Theo nhân viên"
> **Version:** 1.0 | **Ngày:** 20/03/2026
> **Tham chiếu:** US-BC01 → US-BC10

---

## 1. TỔNG QUAN

### 1.1 Mục tiêu
Cung cấp góc nhìn tổng hợp theo **con người** (nhân viên), thay vì theo chủ đề (doanh số, hiệu suất...) như 5 tab báo cáo hiện tại. Hỗ trợ 3 cấp drill-down: Phòng → Team → Nhân viên.

### 1.2 Vị trí trong hệ thống
```
Sidebar > Báo cáo > Tabs:
  [Tổng quan] [Doanh số] [Hiệu suất Sale] [Quy trình] [Nguồn Lead] [Khách hàng] [THEO NHÂN VIÊN ← MỚI]
```

### 1.3 Người dùng mục tiêu

| Vai trò | Nhu cầu chính |
|---------|---------------|
| Sales | Xem báo cáo công việc ngày/tuần/tháng của mình, tự xuất |
| Trưởng nhóm | So sánh NV trong team, xác định top/bottom performer |
| Admin | Đánh giá toàn phòng, xuất hàng loạt, cài gửi tự động |

---

## 2. PHÂN QUYỀN & CẤP ĐỘ MẶC ĐỊNH

### 2.1 Quy tắc phân quyền

| Vai trò | Cấp mặc định khi mở | Dropdown Phòng | Dropdown Team | Dropdown NV | Drill-down |
|---------|---------------------|----------------|---------------|-------------|------------|
| Sales | Cấp NV (= mình) | Ẩn | Ẩn | Khóa = mình | Không |
| Trưởng nhóm | Cấp Team (= team mình) | Ẩn | Khóa = team mình | Mở (NV trong team) | Team → NV |
| Admin | Cấp Phòng | Mở | Mở | Mở | Phòng → Team → NV |

### 2.2 Kiểm tra quyền phía Backend

```
RULE: Mọi API call PHẢI kiểm tra quyền trước khi trả data.
      Không chỉ ẩn UI — phải reject ở backend.

CHECK LOGIC:
  1. Lấy user.role và user.org_node (phòng/team/cá nhân)
  2. So sánh entity_id trong request với org-tree của user
  3. Sales: entity_id PHẢI = user.id
  4. Trưởng nhóm: entity_id PHẢI thuộc user.team_id
  5. Admin: cho phép tất cả
  6. Vi phạm → HTTP 403 + message "Bạn không có quyền xem báo cáo này"
```

---

## 3. LAYOUT TỔNG THỂ & WIREFRAME

### 3.1 Cấu trúc chung (áp dụng cả 3 cấp)

```
┌─────────────────────────────────────────────────────────────────┐
│ BREADCRUMB:  Phòng Sales  >  Team A  >  Nguyễn Văn An          │
├─────────────────────────────────────────────────────────────────┤
│ FILTER BAR                                                      │
│ [Phòng ▾] [Team ▾] [Nhân viên ▾]  |  [Tháng này ▾] [Tùy chỉnh]│
│                                                    [← Back]     │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ CONTENT AREA (thay đổi theo cấp — xem 3.2, 3.3, 3.4)          │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│ FOOTER: [Xuất báo cáo ▾]  [Xuất hàng loạt] (chỉ Admin)        │
└─────────────────────────────────────────────────────────────────┘
```

### 3.2 CẤP PHÒNG — Content Area

```
┌─ SUMMARY CARDS (5 thẻ ngang) ───────────────────────────────────┐
│ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌────────┐ │
│ │ Doanh số │ │ Lead     │ │ Tỷ lệ   │ │ KPI TB   │ │ Task   │ │
│ │ 1.2 tỷ   │ │ 520      │ │ chốt    │ │ phòng    │ │ hoàn   │ │
│ │ ▲ +8%    │ │ ▲ +12%   │ │ 38%     │ │ 72%      │ │ thành  │ │
│ │          │ │          │ │ ▼ -2%   │ │ ▲ +5%    │ │ 85%    │ │
│ └──────────┘ └──────────┘ └──────────┘ └──────────┘ └────────┘ │
└─────────────────────────────────────────────────────────────────┘

┌─ BIỂU ĐỒ ──────────────────────────────────────────────────────┐
│ ┌─ Cột chồng: Doanh số theo Team ─┐ ┌─ Đường: Xu hướng ─────┐ │
│ │ Team A ██████████ 680tr          │ │ doanh số toàn phòng   │ │
│ │ Team B ██████    520tr           │ │ theo ngày/tuần        │ │
│ │ Team C ████      380tr           │ │ trong khoảng lọc      │ │
│ └──────────────────────────────────┘ └────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘

┌─ BẢNG SO SÁNH TEAM ────────────────────────────────────────────┐
│ TEAM     │ DOANH SỐ │ LEAD │ ĐƠN CHỐT │ TỶ LỆ │ KPI% │      │
│──────────┼──────────┼──────┼──────────┼───────┼──────┼──────│
│ Team A   │ 680 tr   │ 280  │ 118      │ 42%   │ 78%  │[Xem▸]│
│ Team B   │ 520 tr   │ 240  │  79      │ 33%   │ 65%  │[Xem▸]│
│ Team C   │ 380 tr   │ 180  │  58      │ 32%   │ 61%  │[Xem▸]│
└─────────────────────────────────────────────────────────────────┘
  Sắp xếp mặc định: Doanh số giảm dần. Click header cột để sort.
  Click [Xem ▸] → drill-down sang cấp Team (cập nhật filter + breadcrumb)
```

**Lưu ý:** Cấp Phòng KHÔNG hiển thị 6 section chi tiết.

### 3.3 CẤP TEAM — Content Area

```
┌─ SUMMARY CARDS (5 thẻ + 1 highlight) ──────────────────────────┐
│ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌────────┐ │
│ │ Doanh số │ │ Lead     │ │ Tỷ lệ   │ │ KPI TB   │ │ Task   │ │
│ │ 680 tr   │ │ 280      │ │ chốt    │ │ team     │ │ hoàn   │ │
│ │ ▲ +10%   │ │ ▲ +8%    │ │ 42%     │ │ 78%      │ │ thành  │ │
│ └──────────┘ └──────────┘ └──────────┘ └──────────┘ └────────┘ │
│                                                                 │
│ ┌─ TOP NV HIGHLIGHT ──────────────────────────────────────────┐ │
│ │ 🏆 Top performer: Nguyễn Văn An — Tỷ lệ chốt 58%, KPI 92% │ │
│ └─────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘

┌─ BIỂU ĐỒ ──────────────────────────────────────────────────────┐
│ Cột nhóm (grouped bar): Doanh số & Lead theo từng NV           │
│ ██ Doanh số  ░░ Lead giao                                      │
│ ─────────────────────────────────────                           │
│ An:  ██████████  ░░░░░░░░                                       │
│ Bình: ████████    ░░░░░░░░░                                     │
│ Chánh:██████      ░░░░░░░░░░                                    │
└─────────────────────────────────────────────────────────────────┘

┌─ BẢNG SO SÁNH NHÂN VIÊN ───────────────────────────────────────┐
│ RANK│ NHÂN VIÊN      │ DOANH SỐ│ LEAD│ CHỐT│ TỶ LỆ│ KPI%│    │
│─────┼────────────────┼─────────┼─────┼─────┼──────┼─────┼────│
│ #1  │ Nguyễn Văn An  │ 250 tr  │  95 │  55 │ 58%  │ 92% │ [▸]│
│ #2  │ Trần Thị Bình  │ 230 tr  │ 100 │  38 │ 38%  │ 71% │ [▸]│
│ #3  │ Lê Minh Chánh  │ 200 tr  │  85 │  25 │ 29%  │ 65% │ [▸]│
└─────────────────────────────────────────────────────────────────┘
  Rank = xếp hạng theo KPI % giảm dần.
  Highlight: #1 = nền xanh lá nhạt, Cuối = nền đỏ nhạt.
  Click [▸] → drill-down sang cấp NV.
```

**Lưu ý:** Cấp Team KHÔNG hiển thị 6 section chi tiết.

### 3.4 CẤP NHÂN VIÊN — Content Area (chi tiết nhất)

```
┌─ SCORECARD CÁ NHÂN (6 thẻ) ────────────────────────────────────┐
│ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌────────┐ │
│ │ Doanh số │ │ Lead     │ │ Tỷ lệ   │ │ KPI      │ │ Task   │ │
│ │ 250 tr   │ │ đang XL  │ │ chốt    │ │ tiến độ  │ │ hoàn   │ │
│ │ ▲ +15%   │ │ 32       │ │ 58%     │ │ 92%      │ │ thành  │ │
│ │          │ │          │ │ TB: 42% │ │ TB: 78%  │ │ 12/15  │ │
│ └──────────┘ └──────────┘ └──────────┘ └──────────┘ └────────┘ │
│ ┌──────────┐                                                    │
│ │ Khách    │  Badge benchmark: 🟢 Trên TB  🟡 Bằng TB  🔴 Dưới TB│
│ │ hàng     │  (TB = trung bình team, ẩn danh cho Sales)        │
│ │ 28 KH    │                                                    │
│ └──────────┘                                                    │
└─────────────────────────────────────────────────────────────────┘

┌─ 6 SECTION CHI TIẾT (collapse/expand) ─────────────────────────┐
│                                                                 │
│ [▼] SECTION 1: DOANH SỐ                                        │
│ ├── Biểu đồ đường: Doanh số theo ngày trong khoảng lọc         │
│ ├── Bảng: Mã đơn | Khách hàng | Giá trị | Trạng thái | Ngày   │
│ └── Chỉ số: Tổng DS, Số đơn, Giá trị TB, Đơn hủy (số + %)    │
│                                                                 │
│ [▼] SECTION 2: HIỆU SUẤT                                       │
│ ├── Biểu đồ cột: Lead giao vs Đơn chốt theo ngày/tuần         │
│ ├── Chỉ số: Lead giao, Đơn chốt, Tỷ lệ chốt, DS chốt         │
│ └── Benchmark: Mỗi chỉ số có "TB team: X" + badge màu         │
│                                                                 │
│ [▼] SECTION 3: QUY TRÌNH (PIPELINE CÁ NHÂN)                    │
│ ├── Biểu đồ phễu mini: Lead của NV tại mỗi giai đoạn Kanban   │
│ │   Tiếp nhận (15) → Tư vấn (12) → Báo giá (8) → Chốt (5)    │
│ ├── Tỷ lệ chuyển đổi giữa giai đoạn: 80% → 67% → 63%         │
│ ├── Thời gian TB tại mỗi giai đoạn: 1.2d → 2.5d → 3.1d       │
│ └── Điểm nghẽn: highlight giai đoạn có tỷ lệ rớt cao nhất     │
│                                                                 │
│ [▼] SECTION 4: NGUỒN LEAD                                      │
│ ├── Biểu đồ tròn: Phân bố lead theo nguồn (Zalo, FB, Tay)     │
│ ├── Bảng: Nguồn | Số lead | Tỷ lệ chuyển đổi | Doanh số       │
│ └── Highlight nguồn hiệu quả nhất (tỷ lệ chuyển đổi cao nhất) │
│                                                                 │
│ [▼] SECTION 5: KHÁCH HÀNG                                      │
│ ├── Chỉ số: Số KH phụ trách, KH mới trong kỳ, Tần suất mua    │
│ └── Bảng: Top 10 KH theo doanh số | Nhãn | Loại (CN/DN)        │
│                                                                 │
│ [▶] SECTION 6: CÔNG VIỆC & KPI (collapsed mặc định)            │
│ ├── Bảng task: Tên | Trạng thái | Deadline | Ưu tiên           │
│ └── KPI progress: 4 thanh (Doanh thu, Leads, Chuyển đổi, CV)   │
│     Doanh thu  ████████░░ 80%                                   │
│     Leads      ██████████ 95%                                   │
│     Chuyển đổi ███████░░░ 72%                                   │
│     Công việc  ████████░░ 80%                                   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 4. COMPONENT SPECS

### 4.1 FilterBar

```
Component: ReportEmployeeFilterBar
Props:
  - userRole: "admin" | "leader" | "sales"
  - userOrgNode: { department_id, team_id, user_id }
  - onFilterChange: (filters) => void

State:
  - selectedLevel: "department" | "team" | "employee"
  - selectedDepartmentId: string | null
  - selectedTeamId: string | null
  - selectedEmployeeId: string | null
  - timeRange: { type: "preset" | "custom", value: string, from?: Date, to?: Date }

Behavior:
  - Khởi tạo: set selectedLevel + lock dropdowns theo userRole (xem bảng 2.1)
  - Khi thay đổi bất kỳ dropdown → gọi onFilterChange → reload data
  - Preset thời gian: "today" | "yesterday" | "this_week" | "this_month" | "this_quarter" | "custom"
  - Default: "this_month"
```

### 4.2 Breadcrumb

```
Component: DrilldownBreadcrumb
Props:
  - path: Array<{ label: string, level: string, entityId: string }>
  - onNavigate: (level, entityId) => void

Render:
  Phòng Sales  >  Team A  >  Nguyễn Văn An
  ^^^^^^^^^^^     ^^^^^^^^    (current - không click được)
  (click → quay cấp Phòng)  (click → quay cấp Team)

Behavior:
  - Click vào mức bất kỳ → gọi onNavigate → cập nhật filter + reload
  - Giữ nguyên timeRange khi navigate
```

### 4.3 SummaryCards

```
Component: SummaryCardRow
Props:
  - cards: Array<{
      label: string,
      value: string | number,
      format: "currency" | "number" | "percent",
      change: { value: number, direction: "up" | "down" | "neutral" },
      benchmark?: { label: string, value: number }  // chỉ cấp NV
    }>

Render mỗi card:
  ┌────────────────┐
  │ label    (i)   │  (i) = tooltip giải thích công thức
  │ VALUE          │  font-size: 24px, font-weight: 700
  │ ▲ +X%          │  Xanh lá nếu up, Đỏ nếu down
  │ TB team: Y     │  font-size: 12px, color: secondary (chỉ cấp NV)
  └────────────────┘

Badge benchmark (cấp NV):
  - |value - benchmark| / benchmark <= 5% → 🟡 Vàng
  - value > benchmark * 1.05 → 🟢 Xanh lá
  - value < benchmark * 0.95 → 🔴 Đỏ nhạt
```

### 4.4 ComparisonTable (cấp Phòng & Team)

```
Component: ComparisonTable
Props:
  - level: "department" | "team"
  - columns: Array<{ key, label, sortable, format }>
  - data: Array<row>
  - onDrillDown: (entityId) => void

Columns cấp Phòng (so sánh Team):
  | TÊN TEAM | DOANH SỐ | LEAD GIAO | ĐƠN CHỐT | TỶ LỆ CHỐT | KPI % | THAO TÁC |

Columns cấp Team (so sánh NV):
  | RANK | TÊN NV | DOANH SỐ | LEAD | ĐƠN CHỐT | TỶ LỆ CHỐT | KPI % | CHI TIẾT |

Behavior:
  - Click header cột (nếu sortable) → sort ASC/DESC
  - Sort mặc định: KPI % giảm dần
  - Cấp Team: Dòng #1 highlight xanh lá nhạt, dòng cuối highlight đỏ nhạt
  - Click [Xem ▸] / [▸] → gọi onDrillDown(entityId)
  - Pagination: không cần (team/NV thường < 20 dòng)
```

### 4.5 DetailSections (chỉ cấp NV)

```
Component: EmployeeDetailSections
Props:
  - employeeId: string
  - timeRange: { from, to }
  - teamBenchmark: object  // dữ liệu TB team để so sánh

6 sections, mỗi section là Collapsible:
  - Section 1-5: expanded mặc định
  - Section 6 (Công việc & KPI): collapsed mặc định
  - Click header → toggle expand/collapse
  - Mỗi section gọi API riêng (lazy load khi expand lần đầu)
```

#### 4.5.1 Section Doanh số

```
API: GET /report/employee/{id}/revenue?from=&to=

Chart: LineChart — trục X = ngày, trục Y = doanh số (VNĐ)
Table columns: Mã đơn | Khách hàng | Sản phẩm | Giá trị | Trạng thái | Ngày tạo
Metrics row: Tổng DS | Số đơn | Giá trị TB đơn | Đơn hủy (n + %)
```

#### 4.5.2 Section Hiệu suất

```
API: GET /report/employee/{id}/performance?from=&to=

Chart: GroupedBarChart — mỗi nhóm = 1 tuần/ngày, 2 cột: Lead giao (xanh dương), Đơn chốt (xanh lá)
Metrics:
  - Lead được giao: N     (TB team: X)  [badge]
  - Đơn chốt: N           (TB team: X)  [badge]
  - Tỷ lệ chốt: N%        (TB team: X%) [badge]
  - Doanh số chốt: N VNĐ  (TB team: X)  [badge]
```

#### 4.5.3 Section Quy trình (Pipeline cá nhân)

```
API: GET /report/employee/{id}/pipeline?from=&to=

Chart: FunnelChart mini
  Tiếp nhận (15) → Tư vấn (12) → Báo giá (8) → Chốt Deal (5)
  Tỷ lệ:            80%          67%          63%

Table (1 dòng / giai đoạn):
  | Giai đoạn | Số lead | Tỷ lệ chuyển đổi | Thời gian TB | Tỷ lệ rớt |

Bottleneck highlight:
  Giai đoạn có tỷ lệ rớt >= 70% → viền đỏ + icon ▲ "Điểm tắc nghẽn"

Lưu ý:
  - Danh sách giai đoạn lấy từ Cài đặt > Quy trình (master data)
  - Chỉ tính lead được gán cho NV này
  - Tỷ lệ chuyển đổi giai đoạn N = (Số lead ở GĐ N ÷ Số lead ở GĐ N-1) × 100
  - Thời gian TB = AVG(Ngày chuyển sang GĐ N+1 - Ngày vào GĐ N)
```

#### 4.5.4 Section Nguồn Lead

```
API: GET /report/employee/{id}/lead-source?from=&to=

Chart: PieChart — mỗi slice = 1 nguồn (Zalo OA, Zalo cá nhân, Facebook, Nhập tay)
Table:
  | Nguồn | Số lead | Tỷ lệ chuyển đổi | Doanh số đóng góp |
  Highlight dòng có tỷ lệ chuyển đổi cao nhất → nền xanh lá nhạt
```

#### 4.5.5 Section Khách hàng

```
API: GET /report/employee/{id}/customers?from=&to=

Metrics: Tổng KH phụ trách | KH mới trong kỳ | Tần suất mua TB
Table (top 10 KH theo doanh số):
  | Tên KH | Loại (CN/DN) | Nhãn | Số đơn | Doanh số | Đơn gần nhất |
```

#### 4.5.6 Section Công việc & KPI

```
API: GET /report/employee/{id}/tasks-kpi?from=&to=

Task table:
  | Tên task | Liên quan | Trạng thái | Deadline | Ưu tiên |
  Badge: Chưa làm (xám), Đang làm (xanh), Hoàn thành (xanh lá), Quá hạn (đỏ)
  Sort: Quá hạn đầu → Đang làm → Chưa làm → Hoàn thành

KPI progress (4 danh mục cố định):
  Doanh thu   ████████░░  80%  (40tr / 50tr)
  Leads       ██████████  95%  (95 / 100)
  Chuyển đổi  ███████░░░  72%  (18% / 25% target)
  Công việc   ████████░░  80%  (12 / 15)

  Màu progress bar:
    >= 90% → xanh lá
    70-89% → xanh dương
    50-69% → cam
    < 50%  → đỏ
```

---

## 5. API ENDPOINTS

### 5.1 Tổng quan API

| Method | Endpoint | Mô tả | Params |
|--------|----------|-------|--------|
| GET | `/api/report/employee/summary` | Summary cards + bảng so sánh | level, entity_id, from, to |
| GET | `/api/report/employee/{id}/revenue` | Section Doanh số | from, to |
| GET | `/api/report/employee/{id}/performance` | Section Hiệu suất | from, to |
| GET | `/api/report/employee/{id}/pipeline` | Section Quy trình | from, to |
| GET | `/api/report/employee/{id}/lead-source` | Section Nguồn lead | from, to |
| GET | `/api/report/employee/{id}/customers` | Section Khách hàng | from, to |
| GET | `/api/report/employee/{id}/tasks-kpi` | Section Công việc & KPI | from, to |
| GET | `/api/report/employee/{id}/benchmark` | Benchmark TB team | from, to |
| POST | `/api/report/employee/export` | Xuất báo cáo | format, scope, employee_ids[], from, to |

### 5.2 Chi tiết API chính

#### GET /api/report/employee/summary

```
Request:
  GET /api/report/employee/summary?level=department&entity_id=dept_01&from=2026-03-01&to=2026-03-31

  level: "department" | "team" | "employee"
  entity_id: ID của phòng / team / nhân viên tương ứng
  from, to: ISO date string

Response (level = department):
{
  "summary_cards": {
    "revenue": { "value": 1200000000, "change_pct": 8.2, "direction": "up" },
    "leads_assigned": { "value": 520, "change_pct": 12.0, "direction": "up" },
    "close_rate": { "value": 38.0, "change_pct": -2.1, "direction": "down" },
    "kpi_avg": { "value": 72.0, "change_pct": 5.0, "direction": "up" },
    "task_completion": { "value": 85.0, "change_pct": 3.0, "direction": "up" }
  },
  "comparison_table": [
    {
      "entity_id": "team_01",
      "name": "Team A",
      "revenue": 680000000,
      "leads_assigned": 280,
      "orders_closed": 118,
      "close_rate": 42.1,
      "kpi_pct": 78.0
    },
    ...
  ],
  "chart_data": {
    "stacked_bar": [...],  // doanh số theo team
    "trend_line": [...]     // xu hướng phòng theo ngày
  }
}

Response (level = employee):
{
  "summary_cards": {
    "revenue": { "value": 250000000, "change_pct": 15, "direction": "up",
                 "benchmark": { "label": "TB team", "value": 226000000 } },
    "leads_active": { "value": 32, ... },
    "close_rate": { "value": 58.0, "benchmark": { "label": "TB team", "value": 42.1 } },
    "kpi_progress": { "value": 92.0, "benchmark": { "label": "TB team", "value": 78.0 } },
    "task_completion": { "value": 80.0, "display": "12/15" },
    "customers": { "value": 28 }
  }
}
```

#### POST /api/report/employee/export

```
Request:
{
  "format": "xlsx" | "pdf",
  "scope": "single" | "team" | "department",
  "employee_ids": ["emp_01", "emp_02"],  // bắt buộc nếu scope = single
  "entity_id": "team_01",                // bắt buộc nếu scope = team/department
  "from": "2026-03-01",
  "to": "2026-03-31"
}

Response:
  - Scope single: File 1 NV (scorecard + 6 section)
  - Scope team/department: File nhiều NV (sheet tổng hợp + mỗi NV 1 sheet)
  - Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet | application/pdf
  - Content-Disposition: attachment; filename="BaoCao_TeamA_03-2026.xlsx"

Ràng buộc:
  - Max 50 NV / lần xuất hàng loạt
  - File > 10MB → nén zip
  - Progress: nếu > 5 giây → trả job_id, FE poll GET /api/report/employee/export/{job_id}/status
```

---

## 6. BUSINESS RULES

### 6.1 Quy tắc tổng hợp dữ liệu (Aggregation Rules)

```
RULE AGG-01: Doanh số
  Cấp NV:     SUM(orders.total_amount) WHERE assigned_to = employee_id AND status = 'Đã thanh toán'
  Cấp Team:   SUM(doanh số tất cả NV trong team)
  Cấp Phòng:  SUM(doanh số tất cả team trong phòng)

RULE AGG-02: Tỷ lệ chốt (RATIO AGGREGATION — QUAN TRỌNG)
  ⚠ KHÔNG BAO GIỜ trung bình % của cấp dưới
  Cấp NV:     orders_closed / leads_assigned   (raw data)
  Cấp Team:   SUM(orders_closed toàn team) / SUM(leads_assigned toàn team)
  Cấp Phòng:  SUM(orders_closed toàn phòng) / SUM(leads_assigned toàn phòng)

RULE AGG-03: KPI %
  Cấp NV:     Lấy từ module KPI (4 danh mục: Doanh thu, Leads, Chuyển đổi, Công việc)
  Cấp Team:   Tính lại từ raw numerator/denominator của tất cả NV trong team
  Cấp Phòng:  Tính lại từ raw của tất cả NV trong phòng
  (Tuân thủ ratio aggregation cho danh mục Chuyển đổi)

RULE AGG-04: Task hoàn thành
  Cấp NV:     COUNT(tasks WHERE status = 'Hoàn thành') / COUNT(total tasks)
  Cấp Team:   SUM(tasks hoàn thành toàn team) / SUM(total tasks toàn team)
  Cấp Phòng:  SUM(...toàn phòng) / SUM(...toàn phòng)

RULE AGG-05: Lead đang xử lý (chỉ cấp NV)
  COUNT(leads WHERE assigned_to = employee_id AND status IN ('Tiếp nhận','Tư vấn','Báo giá'))
```

### 6.2 Quy tắc so sánh kỳ trước

```
RULE CMP-01: Logic kỳ trước
  Preset "Hôm nay"    → so với "Hôm qua"
  Preset "Hôm qua"    → so với "Hôm kia"
  Preset "Tuần này"    → so với "Tuần trước" (cùng tháng, áp dụng week boundary)
  Preset "Tháng này"   → so với "Tháng trước"
  Preset "Quý này"     → so với "Quý trước"
  Custom range (N ngày) → so với N ngày liền trước range đó

RULE CMP-02: Công thức change %
  change_pct = ((current - previous) / previous) × 100
  Nếu previous = 0: hiển thị "Mới" thay vì %, direction = "neutral"
```

### 6.3 Week Boundary Rule

```
RULE WK-01: Tuần trong tháng
  - Tuần luôn nằm trong phạm vi 1 tháng dương lịch
  - Tuần 1 bắt đầu từ ngày 1 của tháng
  - Nếu tuần cross tháng → split: phần thuộc tháng trước tính cho tháng trước
  - Ngày lẻ cuối tháng (nếu còn < 7 ngày sau tuần 4) → gộp vào tuần 4
  - Áp dụng khi filter "Tuần này" hoặc khi biểu đồ group theo tuần
```

### 6.4 Benchmark

```
RULE BM-01: Benchmark TB team
  - Chỉ hiển thị ở cấp NV
  - TB team = tổng hợp raw data toàn team (ratio aggregation cho %)
  - Badge: |NV - TB| / TB <= 5% → vàng, NV > TB*1.05 → xanh, NV < TB*0.95 → đỏ

RULE BM-02: Ẩn danh cho Sales
  - Sales chỉ thấy "TB team: X" — KHÔNG thấy tên hay chỉ số của NV khác
  - Trưởng nhóm & Admin thấy đầy đủ bảng so sánh NV
```

---

## 7. DRILL-DOWN LOGIC

### 7.1 Luồng điều hướng

```
BƯỚC 1: Mở trang
  → Gọi GET /api/user/profile → lấy role + org_node
  → Set selectedLevel theo role (bảng 2.1)
  → Set filter dropdowns (lock/ẩn theo role)
  → Gọi GET /api/report/employee/summary với level + entity_id mặc định

BƯỚC 2: Drill-down (click [Xem ▸] hoặc [▸])
  → Cập nhật selectedLevel (department → team, hoặc team → employee)
  → Cập nhật entity_id = id của dòng được click
  → Cập nhật breadcrumb path (push thêm 1 mức)
  → Đồng bộ dropdowns (auto-select giá trị tương ứng)
  → GIỮ NGUYÊN timeRange
  → Gọi lại API summary với level + entity_id mới
  → Nếu level = employee → lazy load 6 section APIs

BƯỚC 3: Navigate lên (click breadcrumb hoặc [← Back])
  → Pop breadcrumb path về mức được click
  → Cập nhật selectedLevel + entity_id
  → GIỮ NGUYÊN timeRange
  → Reload summary API

BƯỚC 4: Thay đổi filter dropdown thủ công
  → Cập nhật selectedLevel tương ứng
  → Reset breadcrumb về mức mới
  → Reload API
```

### 7.2 State management

```
ReportEmployeeState = {
  // Filter
  level: "department" | "team" | "employee",
  departmentId: string | null,
  teamId: string | null,
  employeeId: string | null,
  timeRange: { type, value, from, to },

  // Navigation
  breadcrumb: Array<{ label, level, entityId }>,

  // Data (reset khi filter thay đổi)
  summaryCards: object | null,
  comparisonTable: Array | null,
  chartData: object | null,

  // Section data (chỉ khi level = employee)
  sections: {
    revenue: { loaded: boolean, data: object | null },
    performance: { loaded: boolean, data: object | null },
    pipeline: { loaded: boolean, data: object | null },
    leadSource: { loaded: boolean, data: object | null },
    customers: { loaded: boolean, data: object | null },
    tasksKpi: { loaded: boolean, data: object | null },
  },

  // UI
  expandedSections: Set<string>,  // default: ["revenue","performance","pipeline","leadSource","customers"]
  loading: boolean,
  error: string | null,
}
```

---

## 8. XUẤT BÁO CÁO

### 8.1 Ma trận quyền xuất

| Hành động | Sales | Trưởng nhóm | Admin |
|-----------|-------|-------------|-------|
| Xuất báo cáo 1 NV (mình) | ✅ | ✅ | ✅ |
| Xuất báo cáo 1 NV (người khác) | ❌ | ✅ (trong team) | ✅ |
| Xuất hàng loạt team | ❌ | ✅ (team mình) | ✅ |
| Xuất hàng loạt phòng | ❌ | ❌ | ✅ |
| Cài đặt gửi tự động | ❌ | ❌ | ✅ |

### 8.2 Cấu trúc file Excel xuất (1 NV)

```
Sheet 1: "Tổng hợp"
  - Thông tin NV: Tên, Team, Phòng, Khoảng thời gian
  - Scorecard 6 chỉ số + so sánh kỳ trước + benchmark

Sheet 2: "Doanh số"
  - Bảng đơn hàng chi tiết

Sheet 3: "Hiệu suất"
  - Bảng chỉ số hiệu suất + benchmark

Sheet 4: "Quy trình"
  - Bảng giai đoạn pipeline + tỷ lệ chuyển đổi

Sheet 5: "Nguồn Lead"
  - Bảng phân bố nguồn lead

Sheet 6: "Khách hàng"
  - Bảng top khách hàng

Sheet 7: "Công việc & KPI"
  - Bảng task + bảng KPI progress
```

### 8.3 Cấu trúc file Excel xuất hàng loạt

```
Sheet 1: "Tổng hợp"
  - Bảng so sánh tất cả NV trong phạm vi (giống ComparisonTable)
  - Mỗi dòng = 1 NV, đầy đủ chỉ số

Sheet 2..N+1: "NV - [Tên NV]"
  - Mỗi NV = 1 sheet riêng
  - Nội dung = Scorecard + 6 section (compact, không biểu đồ)
```

### 8.4 Gửi báo cáo tự động

```
Cài đặt: Cài đặt > Báo cáo tự động > Tab "Báo cáo NV"

Tần suất:
  - Hàng ngày: gửi lúc 9:00 sáng (báo cáo ngày hôm qua)
  - Hàng tuần: gửi thứ 2 lúc 9:00 (báo cáo tuần trước)
  - Hàng tháng: gửi ngày 1 lúc 9:00 (báo cáo tháng trước)

Kênh: Zalo OA hoặc Email (qua Brevo API)

Nội dung:
  - Zalo OA: Template message (max 500 ký tự) chứa 6 chỉ số chính + link CRM
  - Email: HTML email có scorecard + link CRM xem chi tiết

Người nhận theo vai trò:
  - Sales: nhận báo cáo cá nhân
  - Trưởng nhóm: nhận tổng hợp team
  - Admin: nhận tổng hợp phòng

Error handling:
  - Gửi thất bại → retry 2 lần (khoảng cách 5 phút)
  - Vẫn thất bại → ghi log, thông báo Admin
  - NV không có Zalo OA linked hoặc email → skip, ghi log
```

---

## 9. NGUỒN DỮ LIỆU

Module này KHÔNG tạo bảng mới. Chỉ aggregate từ các bảng có sẵn:

| Section | Bảng nguồn | Điều kiện |
|---------|-----------|-----------|
| Doanh số | `orders` | `assigned_to = employee_id` AND `status = 'Đã thanh toán'` |
| Hiệu suất | `leads`, `orders` | `leads.assigned_to`, `orders.assigned_to` |
| Quy trình | `leads`, `lead_stage_history` | `leads.assigned_to`, join stage history |
| Nguồn Lead | `leads` | `leads.assigned_to`, group by `source` |
| Khách hàng | `customers`, `orders` | `orders.assigned_to`, join customers |
| Công việc | `tasks` | `tasks.assigned_to = employee_id` |
| KPI | `kpi_targets`, `kpi_results` | `kpi_targets.employee_id` |
| Org-tree | `users`, `teams`, `departments` | Xây cây phân cấp |

---

## 10. HIỂN THỊ MOBILE

```
Nguyên tắc:
  - Summary cards: 2 thẻ / hàng (thay vì 5-6 thẻ ngang trên desktop)
  - Bảng so sánh: scroll ngang, cột Tên + KPI% + Thao tác cố định
  - Biểu đồ: chiều rộng 100%, có thể phóng to (pinch-to-zoom)
  - 6 section: tất cả collapsed mặc định trên mobile
  - Filter bar: thu gọn thành icon bộ lọc, tap để mở bottom sheet
  - Breadcrumb: scroll ngang nếu dài
  - Nút xuất: floating action button (FAB) góc dưới phải
```

---

## 11. EDGE CASES & XỬ LÝ LỖI

```
CASE-01: NV mới (chưa có data)
  → Summary cards hiển thị 0 / 0% / "--"
  → 6 section hiển thị "Chưa có dữ liệu trong khoảng thời gian này"
  → So sánh kỳ trước: hiển thị "Mới"

CASE-02: Team rỗng (không có NV)
  → Bảng so sánh: "Team chưa có nhân viên"
  → Summary cards: 0

CASE-03: NV chuyển team giữa kỳ
  → Dữ liệu tính theo team HIỆN TẠI của NV
  → Lead/đơn đã gán trước khi chuyển team vẫn tính cho NV đó

CASE-04: Thay đổi URL parameter trái phép
  → Backend check quyền → 403
  → FE hiển thị: "Bạn không có quyền xem báo cáo này" + nút [Quay lại]

CASE-05: API timeout (data lớn)
  → FE hiển thị skeleton loading cho từng section
  → Timeout 30s → hiển thị "Không thể tải dữ liệu. Thử lại?" + nút [Thử lại]

CASE-06: Export file lớn (> 50 NV request)
  → Backend reject: "Tối đa 50 nhân viên / lần xuất"

CASE-07: Giai đoạn Kanban thay đổi (admin thêm/bớt giai đoạn)
  → Section Quy trình tự động cập nhật theo master data giai đoạn hiện tại
```
