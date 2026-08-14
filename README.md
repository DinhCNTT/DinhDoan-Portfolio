# DinhDoan-Portfolio-Fullstack

Dự án Landing Page Portfolio hiện đại kết hợp Web API Backend .NET 9 và AI Chatbot (Gemini RAG + Supabase Vector).

## 🔑 Thông tin tài khoản Admin Dashboard
Bạn có thể đăng nhập vào trang quản trị tại đường dẫn `/admin` trên trình duyệt:
* **Tài khoản:** `admin`
* **Mật khẩu:** `26092004DoanDinh`

*(Thông tin cấu hình được lưu tại tệp `portfolio-backend/Portfolio.API/appsettings.json`)*

---

## 🚀 Hướng dẫn khởi chạy dự án (Local)

### 1. Chạy Backend (.NET 9 Web API)
Di chuyển vào thư mục API và chạy lệnh:
```powershell
cd portfolio-backend/Portfolio.API
dotnet watch run
```
* Cổng chạy mặc định: `http://localhost:5000` hoặc `https://localhost:5001`
* Swagger UI: `http://localhost:5000/swagger`

### 2. Chạy Frontend (React Vite)
Mở cửa sổ terminal khác, di chuyển vào thư mục frontend và chạy lệnh:
```powershell
cd portfolio-frontend
npm run dev
```
* Đường dẫn hiển thị trên trình duyệt: `http://localhost:5173`

---

## ⚡ Lệnh nạp lại dữ liệu AI (Seed Database)
Khi bạn cập nhật CV trong mã nguồn hoặc muốn làm sạch database Supabase để nạp lại dữ liệu, chạy lệnh sau ở PowerShell:
```powershell
Invoke-RestMethod -Uri "http://localhost:5000/api/DbSeed/seed" -Method Post
```
