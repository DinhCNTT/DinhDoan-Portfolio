# 🎨 Portfolio Fullstack – Kế hoạch Thiết kế & Kiến trúc

---

## 1. Tone Màu Chủ Đạo: "Cyber Tech" Minimalist

Áp dụng tỷ lệ **60-30-10** với bảng màu sau:

| Tỷ lệ | Vai trò | Màu sắc |
|---|---|---|
| **60%** | Nền chủ đạo (Dark Mode) | `#0f172a` (Slate) hoặc `#09090b` (Zinc) |
| **30%** | Chữ & Khung | `#f8fafc` (tiêu đề), `#94a3b8` (mô tả), viền xám tối |
| **10%** | Accent (Điểm nhấn) | `#a855f7` – Tím Neon |

> Màu Tím Neon `#a855f7` dùng cho: nút CTA, hiệu ứng hover, loading line và khung viền Chatbot AI.

---

## 2. Các Tính Năng Cần Có

### 🏠 A. Hero Section – Mở màn ấn tượng

- **Headline:** Thay vì "Fresher .NET Developer", dùng câu định vị thương hiệu:
  > *"Architecting High-Performance Backends & Scalable Web Applications"*

- **Typewriter Effect:** Chạy các kỹ năng cốt lõi:
  `.NET 9 | Clean Architecture | AI Integration | Full-stack Engineer`

- **Nút CTA kép:**
  - 📄 Tải CV PDF
  - 🤖 Chat với Trợ lý ảo AI *(nổi bật màu Tím Neon)*

---

### 📊 B. Khu vực "System Architecture" & Kỹ năng

- **Biểu đồ kỹ năng trực quan** bằng **Recharts** (Radar Chart hoặc Bar Chart) theo các nhóm:
  - Backend, Frontend, DevOps/Tools, Databases

- **Sơ đồ Clean Architecture** dạng CSS/SVG tương tác, thể hiện phân tầng:
  `Domain → Application → Infrastructure`

---

### 💻 C. Khu vực "Case Studies" Dự án

Trình bày theo dạng **"Giải quyết bài toán"**, không chỉ liệt kê công nghệ.

**Tính năng Tag Lọc (Filter):** Click vào tag công nghệ để lọc dự án tương ứng.

**Showcase giải pháp – 3 tab cho mỗi dự án:**

| Tab | Nội dung |
|---|---|
| 🔴 Bài toán | Vấn đề cụ thể cần giải quyết |
| 🟡 Giải pháp | Cách tiếp cận kỹ thuật đã áp dụng |
| 🟢 Kết quả | Hiệu quả đạt được |

> **Ví dụ – TechGearShop:**
> - *Bài toán:* Tránh overselling khi nghẽn mạng hệ thống.
> - *Giải pháp:* Dùng `System.Threading.Channels` + `BackgroundService` để xử lý hàng đợi.
> - *Kết quả:* Đảm bảo tính nhất quán dữ liệu, xử lý concurrency mượt mà.

**Nút bấm đồng nhất cho mọi dự án:** `GitHub Code` + `Live Demo`

---

### 🤖 D. "Định AI Clone" – Chatbot Trợ lý *(Tính năng gây ấn tượng nhất)*

- **Giao diện:** Widget chat nhỏ góc phải màn hình, có avatar cá nhân.
- **Prompt System:** Backend .NET 9 + Gemini API, được nạp toàn bộ dữ liệu CV.
  > *Ví dụ: Hỏi "Định có biết dùng Docker không?" → Bot trả lời chi tiết về Docker Compose trong UniMarket.*
- **Realtime Stream:** Dùng **SignalR** để đẩy chữ theo kiểu "đang gõ từng từ" – vừa chân thật vừa chứng minh kỹ năng SignalR.

---

### 📈 E. Trang Admin Ẩn – Dashboard Quản lý

- Đường dẫn `/admin`, yêu cầu đăng nhập bằng **JWT**.
- **Thống kê tin nhắn:** Xem lại nhà tuyển dụng hỏi Bot AI những gì → tối ưu hóa CV.
- **Realtime Online:** Đếm số người đang xem portfolio (cơ chế Heartbeat của SignalR).

---

## 3. Tech Stack

### 🏷️ Đặt tên Repository

```
DinhDoan-Portfolio-Fullstack/
├── portfolio-frontend/
└── portfolio-backend/
```

---

### 🎨 Frontend

| Hạng mục | Công nghệ |
|---|---|
| Core Framework | React 19 (Vite) |
| Styling | Tailwind CSS |
| Animation | Framer Motion |
| Biểu đồ | Recharts |
| Icon | Lucide React |
| Deploy | Vercel + Vercel Analytics |

---

### ⚙️ Backend

| Hạng mục | Công nghệ |
|---|---|
| Framework | ASP.NET Core (.NET 9) Web API |
| Kiến trúc | Clean Architecture + Generic Repository Pattern |
| Realtime | SignalR (stream AI + Heartbeat online) |
| AI | Google Gemini API |
| Bảo mật | JWT Authentication |
| Container | Docker (Multi-stage build) |
| Deploy | Render (free) hoặc Railway |

---

### 🗄️ Database

| Hạng mục | Công nghệ |
|---|---|
| DBMS | PostgreSQL |
| ORM | EF Core + Npgsql provider |
| Local | PostgreSQL trên Docker Container |
| Deploy | Supabase (Singapore, miễn phí) |

---

## 4. Kiến trúc Solution – Clean Architecture

Solution được chia thành **4 Projects (Layers)**, từ lõi ra ngoài:

```
Portfolio.Fullstack/
├── Portfolio.Domain/          # Layer 1 – Core/Domain
├── Portfolio.Infrastructure/  # Layer 2 – Infrastructure
├── Portfolio.Application/     # Layer 3 – Application
└── Portfolio.API/             # Layer 4 – Presentation
```

---

### Layer 1 – Domain (Lõi hệ thống)

> Độc lập hoàn toàn, không phụ thuộc bất kỳ layer nào.

```
Portfolio.Domain/
├── Entities/
│   ├── Project.cs        # Tên, mô tả, link GitHub, demo, ảnh
│   ├── Skill.cs
│   └── ChatMessage.cs    # Lưu lịch sử Q&A của Bot AI
└── Interfaces/
    ├── IGenericRepository<T>
    └── IProjectRepository
```

---

### Layer 2 – Infrastructure (Hạ tầng ngoại vi)

> Giao tiếp với Database và Third-party services. Phụ thuộc vào Domain.

```
Portfolio.Infrastructure/
├── Data/
│   └── ApplicationDbContext.cs   # EF Core – PostgreSQL
├── Repositories/
│   └── GenericRepository<T>      # Triển khai Interface từ Domain
└── Services/
    └── GeminiService.cs          # Gọi Google Gemini API
```

---

### Layer 3 – Application (Logic ứng dụng)

> Chứa Use Cases, điều phối luồng dữ liệu.

```
Portfolio.Application/
├── Services/
│   └── ProjectService.cs    # CRUD dự án + IMemoryCache
└── DTOs/
    ├── ProjectDto.cs
    └── LoginRequest.cs
```

---

### Layer 4 – Portfolio.API (Presentation – Cổng vào)

> Điểm khởi chạy ứng dụng, tiếp nhận request từ React Frontend.

```
Portfolio.API/
├── Controllers/
│   ├── ProjectsController.cs   # CRUD dự án
│   ├── AuthController.cs       # Đăng nhập JWT → Admin
│   └── AiChatController.cs     # Xử lý chat AI
├── Hubs/
│   └── ChatHub.cs              # SignalR – stream AI realtime
└── Program.cs                  # DI, CORS, Docker config
```