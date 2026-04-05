# ZBS Marketing Module - Technical & Business Specification

> **Mục đích tài liệu**: Tài liệu này mô tả chi tiết module ZBS Marketing trong hệ thống ViLead CRM, bao gồm các tính năng, luồng nghiệp vụ, và logic xử lý. Tài liệu được thiết kế để AI có thể đọc và tạo User Stories, Business Workflows.

---

## 1. TỔNG QUAN MODULE

### 1.1 Mô tả
ZBS Marketing (Zalo Business Services Marketing) là module quản lý chiến dịch marketing qua Zalo ZNS (Zalo Notification Service). Module cho phép người dùng tạo, quản lý và theo dõi các chiến dịch gửi tin nhắn ZNS đến khách hàng.

### 1.2 Vị trí trong hệ thống
- **Menu**: Chiến dịch Marketing > ZBS Marketing
- **Đường dẫn**: `/marketing/zbs-marketing`
- **Module liên quan**: Email Marketing (cùng cấp)

### 1.3 Đối tượng sử dụng
| Vai trò | Quyền hạn |
|---------|-----------|
| Admin | Toàn quyền: tạo, sửa, xóa, xem báo cáo |
| Marketing Manager | Tạo, sửa chiến dịch của mình, xem báo cáo |
| Marketing Staff | Tạo chiến dịch, xem báo cáo giới hạn |

---

## 2. CẤU TRÚC MODULE

### 2.1 Tabs chính
Module gồm 3 tab:

```
┌─────────────────┬─────────────────┬─────────────────┐
│  Chiến dịch ZBS │   Thư viện mẫu  │ Báo cáo chất    │
│                 │                 │ lượng           │
└─────────────────┴─────────────────┴─────────────────┘
```

| Tab | Chức năng | Component |
|-----|-----------|-----------|
| Chiến dịch ZBS | Quản lý danh sách chiến dịch | `ZbsCampaignList` |
| Thư viện mẫu | Quản lý mẫu tin ZNS | `ZbsTemplateLibrary` |
| Báo cáo chất lượng | Thống kê & báo cáo | `ZbsReportsDashboard` |

---

## 3. TAB 1: CHIẾN DỊCH ZBS

### 3.1 Danh sách chiến dịch

#### 3.1.1 Các trường dữ liệu hiển thị
| Trường | Mô tả | Kiểu dữ liệu |
|--------|-------|--------------|
| TÊN CHIẾN DỊCH | Tên chiến dịch do người dùng đặt | string |
| OA | Tên Official Account Zalo | string |
| MẪU TIN | Tên mẫu ZNS template | string |
| NGƯỜI TẠO | Tên người tạo chiến dịch | string |
| NGÀY TẠO | Ngày tạo chiến dịch | datetime |
| TRẠNG THÁI | Trạng thái chiến dịch | enum |
| CHI PHÍ DỰ KIẾN | Tổng chi phí dự kiến | number (VNĐ) |

#### 3.1.2 Các trạng thái chiến dịch
```
┌──────────────┐
│    draft     │ ← Bản nháp (chưa gửi)
└──────┬───────┘
       │ [Bắt đầu]
       ▼
┌──────────────┐
│   pending    │ ← Chờ xử lý
└──────┬───────┘
       │
       ▼
┌──────────────┐
│  processing  │ ← Đang xử lý/gửi
└──────┬───────┘
       │
       ▼
┌──────────────┐     ┌──────────────┐
│  completed   │     │   failed     │
│  (Hoàn thành)│     │  (Thất bại)  │
└──────────────┘     └──────────────┘
       
┌──────────────┐
│  cancelled   │ ← Đã hủy (từ pending/draft)
└──────────────┘
```

#### 3.1.3 Các hành động trên chiến dịch
| Hành động | Điều kiện | Mô tả |
|-----------|-----------|-------|
| Xem báo cáo | Tất cả trạng thái | Mở modal chi tiết báo cáo |
| Chỉnh sửa | draft, pending | Mở wizard chỉnh sửa |
| Sao chép | Tất cả | Tạo bản sao chiến dịch |
| Xóa | draft | Xóa chiến dịch nháp |
| Hủy | pending, processing | Hủy chiến dịch |

### 3.2 Tạo chiến dịch ZBS (Wizard 4 bước)

#### 3.2.1 Tổng quan luồng tạo chiến dịch
```
┌─────────────────────────────────────────────────────────────────┐
│                    TẠO CHIẾN DỊCH ZBS                           │
│                                                                 │
│  ┌───────────┐   ┌───────────┐   ┌───────────┐   ┌───────────┐  │
│  │  BƯỚC 1   │──▶│  BƯỚC 2   │──▶│  BƯỚC 3   │──▶│  BƯỚC 4  │ │
│  │ Chọn mẫu  │   │Import file│   │ Xác thực  │   │  Cài đặt  │ │
│  │  template │   │   Excel   │   │  dữ liệu  │   │  chiến    │ │
│  │           │   │           │   │           │   │   dịch    │ │
│  └───────────┘   └───────────┘   └───────────┘   └───────────┘ │
│                                                                 │
│  [Lưu nháp]                              [Hủy]    [Hoàn tất]   │
└─────────────────────────────────────────────────────────────────┘
```

#### 3.2.2 BƯỚC 1: Chọn mẫu template

**Mục đích**: Chọn mẫu ZNS template để gửi

**Dữ liệu mẫu template bao gồm**:
| Trường | Mô tả |
|--------|-------|
| Template ID | Mã định danh template (từ Zalo) |
| Tên mẫu tin | Tên template |
| Loại mẫu tin | Loại: OTP, Giao dịch, Chăm sóc khách hàng, v.v. |
| Trạng thái | Đang hoạt động / Không hoạt động |
| OA | Official Account liên kết |
| Giá | Chi phí mỗi tin nhắn (VNĐ) |
| Nội dung mẫu | Preview nội dung template |
| Các tham số | Danh sách biến cần điền (VD: {customer_name}, {order_id}) |

**Giao diện**:
- Danh sách template dạng card/list
- Tìm kiếm theo tên
- Lọc theo OA, loại mẫu tin
- Click để chọn template

**Validation**:
- Bắt buộc chọn 1 template
- Template phải ở trạng thái "Đang hoạt động"

#### 3.2.3 BƯỚC 2: Import file Excel

**Mục đích**: Tải lên danh sách người nhận từ file Excel

**Yêu cầu file Excel**:
- Định dạng: .xlsx, .xls
- Cột bắt buộc: Số điện thoại hoặc User ID
- Các cột tương ứng với tham số của template

**Giao diện**:
- Khu vực kéo thả file (drag & drop)
- Nút chọn file từ máy tính
- Preview 5-10 dòng đầu tiên sau khi upload
- Mapping cột Excel với tham số template

**Mapping cột**:
```
┌─────────────────────────────────────────────────┐
│  Cột Excel          →    Tham số Template       │
├─────────────────────────────────────────────────┤
│  Số điện thoại      →    phone                  │
│  Họ và tên          →    {customer_name}        │
│  Mã đơn hàng        →    {order_id}             │
│  Số tiền            →    {amount}               │
└─────────────────────────────────────────────────┘
```

**Validation**:
- File không rỗng
- Có cột số điện thoại/User ID
- Đủ các cột cho tham số bắt buộc

#### 3.2.4 BƯỚC 3: Xác thực dữ liệu

**Mục đích**: Kiểm tra và xác thực dữ liệu người nhận

**Các kiểm tra thực hiện**:
| Kiểm tra | Mô tả | Kết quả |
|----------|-------|---------|
| Định dạng SĐT | Số điện thoại hợp lệ (10 số, bắt đầu 0) | ✓ Hợp lệ / ✗ Không hợp lệ |
| Trùng lặp | Kiểm tra số điện thoại trùng | ✓ Không trùng / ✗ Có X bản trùng |
| Tham số đầy đủ | Tất cả tham số bắt buộc có giá trị | ✓ Đủ / ✗ Thiếu Y tham số |
| Ký tự đặc biệt | Kiểm tra ký tự không hợp lệ | ✓ Hợp lệ / ✗ Có ký tự lạ |

**Giao diện**:
- Bảng tổng kết: Tổng số / Hợp lệ / Không hợp lệ
- Danh sách chi tiết các bản ghi lỗi
- Cho phép sửa trực tiếp hoặc xóa bản ghi lỗi
- Nút "Bỏ qua lỗi" để tiếp tục với bản ghi hợp lệ

**Validation**:
- Phải có ít nhất 1 bản ghi hợp lệ để tiếp tục

#### 3.2.5 BƯỚC 4: Cài đặt chiến dịch

**Mục đích**: Đặt tên và lên lịch gửi chiến dịch

**Các trường cài đặt**:
| Trường | Bắt buộc | Mô tả |
|--------|----------|-------|
| Tên chiến dịch | ✓ | Tên để phân biệt chiến dịch |
| Loại gửi | ✓ | Gửi ngay / Hẹn giờ |
| Thời gian gửi | Nếu hẹn giờ | Ngày giờ bắt đầu gửi |
| Ghi chú | ✗ | Ghi chú nội bộ |

**Loại gửi**:
```
○ Gửi ngay    - Bắt đầu gửi ngay khi xác nhận
● Hẹn giờ     - Gửi vào thời điểm đã chọn
               └── [Chọn ngày] [Chọn giờ]
```

**Chi phí dự kiến**:
- Hiển thị: `Số người nhận × Giá/tin = Tổng chi phí`
- VD: `150 người × 300đ = 45,000đ`

### 3.3 Lưu nháp chiến dịch

**Tính năng**: Cho phép lưu tiến trình tạo chiến dịch để tiếp tục sau

**Điều kiện lưu nháp**:
- Có thể lưu ở bất kỳ bước nào
- Lưu tất cả dữ liệu đã nhập

**Hiển thị**:
- Thời gian lưu nháp cuối cùng
- Nút "Lưu nháp" ở header wizard

### 3.4 Chỉnh sửa chiến dịch

**Điều kiện**: Chỉ áp dụng cho chiến dịch ở trạng thái `draft` hoặc `pending`

**Quy trình**: Mở lại wizard với dữ liệu đã lưu, cho phép chỉnh sửa tất cả các bước

### 3.5 Modal Báo cáo chiến dịch

**Mục đích**: Xem chi tiết kết quả gửi của một chiến dịch

**Thống kê tổng quan** (3 card):
| Card | Mô tả | Màu |
|------|-------|-----|
| Tổng gửi | Tổng số tin đã gửi | Xanh dương |
| Thành công | Số tin gửi thành công | Xanh lá |
| Thất bại | Số tin gửi thất bại | Đỏ |

**Bảng chi tiết người nhận**:
| Cột | Mô tả |
|-----|-------|
| ID | Mã định danh |
| TÊN MẪU ZNS | Tên template sử dụng |
| TÊN OA | Official Account |
| SĐT/USER ID | Số điện thoại hoặc User ID |
| THỜI GIAN GỬI | Thời điểm gửi tin |
| TRẠNG THÁI | Thành công / Thất bại / Đang gửi |
| CHI PHÍ | Chi phí thực tế (VNĐ) |

---

## 4. TAB 2: THƯ VIỆN MẪU

### 4.1 Mô tả

**Mục đích**: Hiển thị danh sách các mẫu template ZNS đã được đăng ký với Zalo OA của doanh nghiệp.

> **Lưu ý quan trọng**: Khách hàng muốn đăng ký template ZBS mới vui lòng liên hệ Vilead-CRM để được hỗ trợ đăng ký.

### 4.2 Dữ liệu hiển thị

Mỗi template card hiển thị:
| Trường | Mô tả |
|--------|-------|
| Tên mẫu | Tên template |
| Template ID | Mã từ Zalo |
| Loại mẫu | Dạng bảng / OTP / Giao dịch / Chăm sóc KH |
| OA | Official Account |
| Ngày tạo | Ngày đăng ký template |
| Giá bán | Chi phí/tin (VNĐ) |
| Trạng thái | Đã duyệt / Chờ duyệt / Từ chối |
| Số lần sử dụng | Số lượt đã dùng template |

### 4.3 Hành động

| Hành động | Điều kiện | Mô tả |
|-----------|-----------|-------|
| Xem chi tiết | Tất cả | Mở modal xem nội dung template |
| Tạo chiến dịch | Trạng thái = "Đã duyệt" | Mở wizard tạo chiến dịch với template đã chọn |

### 4.4 Ghi chú

Phía dưới danh sách template có hiển thị:
- Số lượng mẫu: "Hiển thị X / Y mẫu"
- Ghi chú đỏ: **"Lưu ý: Khách hàng muốn đăng ký template ZBS mới vui lòng liên hệ Vilead-CRM để được hỗ trợ đăng ký."**

---

## 5. TAB 3: BÁO CÁO CHẤT LƯỢNG

### 5.1 Tổng quan

Dashboard báo cáo thống kê toàn bộ hoạt động ZBS Marketing

### 5.2 Bộ lọc

| Bộ lọc | Giá trị | Mặc định |
|--------|---------|----------|
| Kỳ báo cáo | Tuần này / Tháng này / Quý này / Tùy chỉnh | Tháng này |
| OA | Danh sách OA | Tất cả |
| Mẫu tin | Danh sách template | Tất cả |

### 5.3 Thống kê tổng chi tiêu & số lượng tin

6 card thống kê:
| Card | Icon | Màu | Dữ liệu |
|------|------|-----|---------|
| Tổng chi tiêu | 💰 | Vàng | Tổng tiền đã chi (VNĐ) |
| ZNS đã gửi | ✈️ | Xanh dương | Tổng số tin đã gửi |
| ZNS tính phí | 💳 | Xanh lá | Số tin bị tính phí |
| ZNS không tính phí | 🎁 | Tím | Số tin miễn phí |
| ZNS thành công | ✓ | Xanh ngọc | Số tin gửi thành công |
| ZNS thất bại | ✗ | Đỏ | Số tin gửi thất bại |

### 5.4 Thống kê số lượng chiến dịch

6 card thống kê:
| Card | Dữ liệu |
|------|---------|
| Tổng số chiến dịch | Tổng số chiến dịch trong kỳ |
| Chiến dịch hẹn giờ | Số chiến dịch loại scheduled |
| Chiến dịch chạy liền | Số chiến dịch loại immediate |
| Đang chờ xử lý | Số chiến dịch pending |
| Đang xử lý | Số chiến dịch processing |
| Hủy | Số chiến dịch cancelled |

### 5.5 Biểu đồ xu hướng chi tiêu

**Loại**: Biểu đồ kết hợp (Bar + Line)
- **Cột (Bar)**: Tổng chi tiêu theo ngày/tuần/tháng
- **Đường (Line)**: Số lượng ZNS gửi

**Tùy chọn hiển thị**: Theo ngày / Theo tuần / Theo tháng

### 5.6 Biểu đồ kết quả gửi tin

**Loại**: Biểu đồ cột xếp chồng (Stacked Bar)
- **Xanh lá**: Số tin thành công
- **Đỏ**: Số tin thất bại

### 5.7 Biểu đồ phân bố

2 biểu đồ tròn (Pie/Donut):

**Biểu đồ 1: Theo loại tin**
- Phân bố số lượng tin theo loại (OTP, Giao dịch, CSKH, ...)

**Biểu đồ 2: Theo mẫu tin**
- Phân bố số lượng tin theo từng template

### 5.8 Xuất báo cáo

**Loại báo cáo**:
| Loại | Mô tả |
|------|-------|
| Báo cáo tổng quan | Thống kê chung về ZNS gửi, thành công, thất bại |
| So sánh chiến dịch | Danh sách chiến dịch kèm hiệu suất |
| Chi tiết tin nhắn | Chi tiết từng tin nhắn ZNS đã gửi |

**Định dạng file**:
- Excel (.xlsx)
- CSV (.csv)

---

## 6. LUỒNG NGHIỆP VỤ CHÍNH

### 6.1 Luồng tạo và gửi chiến dịch ZBS

```
┌─────────────┐
│  Bắt đầu    │
└──────┬──────┘
       │
       ▼
┌─────────────────────┐
│ Chọn template ZNS   │
│ (Thư viện mẫu hoặc  │
│  Wizard bước 1)     │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ Chuẩn bị file Excel │
│ danh sách người nhận│
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ Import file Excel   │
│ (Wizard bước 2)     │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ Xác thực dữ liệu    │
│ (Wizard bước 3)     │
└──────────┬──────────┘
           │
     ┌─────┴─────┐
     │           │
     ▼           ▼
┌─────────┐ ┌─────────────┐
│ Có lỗi  │ │ Không lỗi   │
└────┬────┘ └──────┬──────┘
     │             │
     ▼             │
┌─────────────┐    │
│ Sửa lỗi /   │    │
│ Loại bỏ lỗi │    │
└──────┬──────┘    │
       │           │
       └─────┬─────┘
             │
             ▼
┌─────────────────────┐
│ Cài đặt chiến dịch  │
│ (Wizard bước 4)     │
│ - Tên chiến dịch    │
│ - Gửi ngay/Hẹn giờ  │
└──────────┬──────────┘
           │
     ┌─────┴─────┐
     │           │
     ▼           ▼
┌─────────┐ ┌─────────────┐
│Lưu nháp │ │ Hoàn tất    │
└─────────┘ └──────┬──────┘
                   │
             ┌─────┴─────┐
             │           │
             ▼           ▼
      ┌───────────┐ ┌───────────┐
      │ Gửi ngay  │ │ Hẹn giờ   │
      └─────┬─────┘ └─────┬─────┘
            │             │
            ▼             ▼
      ┌───────────┐ ┌───────────┐
      │Processing │ │ Pending   │
      └─────┬─────┘ └─────┬─────┘
            │             │
            │      [Đến giờ]
            │             │
            └──────┬──────┘
                   │
                   ▼
            ┌───────────┐
            │ Gửi tin   │
            │ ZNS qua   │
            │ Zalo API  │
            └─────┬─────┘
                  │
            ┌─────┴─────┐
            │           │
            ▼           ▼
      ┌───────────┐ ┌───────────┐
      │ Completed │ │  Failed   │
      └───────────┘ └───────────┘
                   │
                   ▼
            ┌───────────┐
            │ Xem báo   │
            │ cáo kết   │
            │ quả       │
            └───────────┘
```

### 6.2 Luồng xem báo cáo

```
┌─────────────┐
│  Bắt đầu    │
└──────┬──────┘
       │
       ▼
┌─────────────────────┐
│ Vào tab "Báo cáo    │
│ chất lượng"         │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ Chọn bộ lọc         │
│ - Kỳ báo cáo        │
│ - OA                │
│ - Mẫu tin           │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ Nhấn "Làm mới"      │
│ để load dữ liệu     │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ Xem thống kê:       │
│ - Cards tổng quan   │
│ - Biểu đồ xu hướng  │
│ - Biểu đồ phân bố   │
└──────────┬──────────┘
           │
     ┌─────┴─────┐
     │           │
     ▼           ▼
┌─────────┐ ┌─────────────┐
│ Xem     │ │ Xuất báo    │
│ online  │ │ cáo         │
└─────────┘ └──────┬──────┘
                   │
                   ▼
            ┌───────────────┐
            │ Chọn loại:    │
            │ - Tổng quan   │
            │ - So sánh CD  │
            │ - Chi tiết    │
            └───────┬───────┘
                    │
                    ▼
            ┌───────────────┐
            │ Chọn format:  │
            │ - Excel       │
            │ - CSV         │
            └───────┬───────┘
                    │
                    ▼
            ┌───────────────┐
            │ Download file │
            └───────────────┘
```

---

## 7. CẤU TRÚC DỮ LIỆU

### 7.1 Campaign (Chiến dịch)

```typescript
interface ZbsCampaign {
  id: string;                    // ID chiến dịch
  name: string;                  // Tên chiến dịch
  oa: string;                    // Tên Official Account
  templateId: string;            // ID template ZNS
  templateName: string;          // Tên template
  status: CampaignStatus;        // Trạng thái
  createdBy: string;             // Người tạo
  createdAt: string;             // Ngày tạo
  scheduledAt?: string;          // Thời gian hẹn giờ (nếu có)
  completedAt?: string;          // Thời gian hoàn thành
  totalRecipients: number;       // Tổng số người nhận
  successCount: number;          // Số gửi thành công
  failedCount: number;           // Số gửi thất bại
  estimatedCost: number;         // Chi phí dự kiến
  actualCost: number;            // Chi phí thực tế
  sendType: 'immediate' | 'scheduled'; // Loại gửi
  note?: string;                 // Ghi chú
}

type CampaignStatus = 
  | 'draft'       // Bản nháp
  | 'pending'     // Chờ xử lý
  | 'processing'  // Đang xử lý
  | 'completed'   // Hoàn thành
  | 'failed'      // Thất bại
  | 'cancelled';  // Đã hủy
```

### 7.2 Template (Mẫu tin)

```typescript
interface ZbsTemplate {
  id: string;                    // ID template
  templateId: string;            // Template ID từ Zalo
  name: string;                  // Tên template
  type: TemplateType;            // Loại template
  status: 'active' | 'inactive'; // Trạng thái
  oa: string;                    // Official Account
  price: number;                 // Giá/tin (VNĐ)
  content: string;               // Nội dung mẫu
  parameters: TemplateParam[];   // Danh sách tham số
  previewUrl?: string;           // URL preview (nếu có)
}

type TemplateType = 
  | 'otp'           // OTP
  | 'transaction'   // Giao dịch
  | 'customer_care' // Chăm sóc khách hàng
  | 'promotion';    // Khuyến mãi

interface TemplateParam {
  name: string;      // Tên tham số (VD: customer_name)
  type: 'string' | 'number' | 'date';
  required: boolean; // Bắt buộc hay không
  maxLength?: number;
}
```

### 7.3 Recipient (Người nhận)

```typescript
interface ZbsRecipient {
  id: string;                    // ID bản ghi
  campaignId: string;            // ID chiến dịch
  phone?: string;                // Số điện thoại
  userId?: string;               // Zalo User ID
  templateName: string;          // Tên mẫu ZNS
  oaName: string;                // Tên OA
  sentAt?: string;               // Thời gian gửi
  status: RecipientStatus;       // Trạng thái
  cost: number;                  // Chi phí
  errorCode?: string;            // Mã lỗi (nếu thất bại)
  errorMessage?: string;         // Thông báo lỗi
  params: Record<string, string>; // Giá trị các tham số
}

type RecipientStatus = 
  | 'pending'   // Chờ gửi
  | 'sending'   // Đang gửi
  | 'success'   // Thành công
  | 'failed';   // Thất bại
```

---

## 8. TÍCH HỢP API

### 8.1 Zalo ZNS API

**Endpoint gửi tin**:
```
POST https://business.openapi.zalo.me/message/template
```

**Headers**:
```
Authorization: Bearer {access_token}
Content-Type: application/json
```

**Request Body**:
```json
{
  "phone": "84987654321",
  "template_id": "485941",
  "template_data": {
    "customer_name": "Nguyễn Văn A",
    "order_id": "DH123456",
    "amount": "500,000đ"
  }
}
```

**Response**:
```json
{
  "error": 0,
  "message": "Success",
  "data": {
    "msg_id": "abc123xyz"
  }
}
```

### 8.2 Mã lỗi thường gặp

| Mã lỗi | Mô tả | Xử lý |
|--------|-------|-------|
| 0 | Thành công | - |
| -201 | Người dùng không follow OA | Đánh dấu failed |
| -202 | Template không tồn tại | Kiểm tra template ID |
| -203 | Tham số không hợp lệ | Kiểm tra dữ liệu |
| -204 | Hết quota | Thử lại sau |
| -205 | Token hết hạn | Refresh token |

---

## 9. QUY TẮC NGHIỆP VỤ

### 9.1 Quy tắc chung

1. **Số điện thoại hợp lệ**:
   - 10 chữ số
   - Bắt đầu bằng 0
   - Hoặc format quốc tế: 84xxxxxxxxx

2. **Chi phí tính toán**:
   ```
   Chi phí dự kiến = Số người nhận × Giá template
   Chi phí thực tế = Số tin thành công × Giá template
   ```

3. **Thời gian hẹn giờ**:
   - Phải >= thời điểm hiện tại + 5 phút
   - Không quá 30 ngày trong tương lai

### 9.2 Giới hạn

| Giới hạn | Giá trị |
|----------|---------|
| Số người nhận tối đa/chiến dịch | 10,000 |
| Kích thước file Excel tối đa | 5MB |
| Số chiến dịch nháp tối đa | 50 |
| Thời gian lưu nháp | 30 ngày |

### 9.3 Quyền hạn

| Hành động | Admin | Manager | Staff |
|-----------|-------|---------|-------|
| Tạo chiến dịch | ✓ | ✓ | ✓ |
| Sửa chiến dịch của mình | ✓ | ✓ | ✓ |
| Sửa chiến dịch người khác | ✓ | ✗ | ✗ |
| Xóa chiến dịch | ✓ | ✓ (của mình) | ✗ |
| Xem báo cáo tổng | ✓ | ✓ | ✗ |
| Xuất báo cáo | ✓ | ✓ | ✗ |

---

## 10. PHỤ LỤC

### 10.1 Danh sách Components

| Component | File | Chức năng |
|-----------|------|-----------|
| ZbsMarketing | ZbsMarketing.tsx | Component chính, quản lý tabs |
| ZbsCampaignList | ZbsCampaignList.tsx | Danh sách chiến dịch |
| ZbsCampaignWizardModal | ZbsCampaignWizardModal.tsx | Wizard tạo/sửa chiến dịch |
| ZbsCampaignDetailModal | ZbsCampaignDetailModal.tsx | Modal báo cáo chi tiết |
| ZbsTemplateLibrary | ZbsTemplateLibrary.tsx | Thư viện mẫu template |
| ZbsTemplateModals | ZbsTemplateModals.tsx | Các modal cho template |
| ZbsReportsDashboard | ZbsReportsDashboard.tsx | Dashboard báo cáo |
| ZbsReportFilters | ZbsReportFilters.tsx | Bộ lọc báo cáo |
| ZbsOverviewStatsCards | ZbsOverviewStatsCards.tsx | Cards thống kê tổng quan |
| ZbsCampaignStatsCards | ZbsCampaignStatsCards.tsx | Cards thống kê chiến dịch |
| ZbsSpendingTrendChart | ZbsSpendingTrendChart.tsx | Biểu đồ xu hướng chi tiêu |
| ZbsSendResultChart | ZbsSendResultChart.tsx | Biểu đồ kết quả gửi |
| ZbsDistributionCharts | ZbsDistributionCharts.tsx | Biểu đồ phân bố |
| ZbsExportReportModal | ZbsExportReportModal.tsx | Modal xuất báo cáo |

### 10.2 Glossary (Thuật ngữ)

| Thuật ngữ | Giải thích |
|-----------|------------|
| ZBS | Zalo Business Services - Dịch vụ kinh doanh của Zalo |
| ZNS | Zalo Notification Service - Dịch vụ gửi tin nhắn thông báo |
| OA | Official Account - Tài khoản doanh nghiệp trên Zalo |
| Template | Mẫu tin nhắn đã được Zalo phê duyệt |
| Template ID | Mã định danh template từ Zalo |
| Parameter | Tham số biến trong template (VD: {customer_name}) |

---

**Phiên bản tài liệu**: 1.0  
**Cập nhật lần cuối**: 2026-04-04  
**Tác giả**: ViLead CRM Development Team
