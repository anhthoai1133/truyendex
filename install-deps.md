# Cài đặt Dependencies cho CRUD Admin

Để sử dụng tính năng CRUD admin, bạn cần cài đặt thêm dependencies:

## 1. Cài đặt react-hot-toast

```bash
cd truyendex
npm install react-hot-toast
```

## 2. Cài đặt react-hook-form (nếu chưa có)

```bash
npm install react-hook-form
```

## 3. Cài đặt @hookform/resolvers (nếu chưa có)

```bash
npm install @hookform/resolvers
```

## 4. Cài đặt yup (nếu chưa có)

```bash
npm install yup
```

## 5. Kiểm tra dependencies đã cài

```bash
npm list react-hot-toast react-hook-form @hookform/resolvers yup
```

## Sử dụng

Sau khi cài đặt xong:

1. **Truy cập admin panel**: http://localhost:3000/admin
2. **Chỉ user có role "admin" mới có thể truy cập**
3. **Các tính năng có sẵn**:
   - ✅ Thêm truyện mới
   - ✅ Xem danh sách truyện
   - ✅ Chỉnh sửa truyện
   - ✅ Xóa truyện
   - ✅ Tìm kiếm truyện
   - ✅ Phân trang

## Lưu ý

- Backend cần được start: `npm run start:dev`
- User cần có role "admin" trong database
- Tất cả API calls đều yêu cầu JWT authentication
