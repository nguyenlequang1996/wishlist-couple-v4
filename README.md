# WishList Couple

Ứng dụng quản lý danh sách mong muốn dành cho các cặp đôi. Cho phép bạn và người yêu/bạn đời tạo và chia sẻ danh sách những món đồ mong muốn.

![WishList Couple Screenshot](https://i.imgur.com/RsVh4CX.jpg)

## Tính năng

- 🔐 **Đăng ký và Đăng nhập**: Hệ thống xác thực người dùng an toàn
- 📝 **Quản lý danh sách mong muốn**: Thêm, sửa, xóa các món đồ bạn muốn
- 👀 **Xem danh sách của người khác**: Dễ dàng xem danh sách món đồ mong muốn của bạn đời/người yêu
- 💖 **Tương tác**: Thể hiện sự yêu thích đối với món đồ trong danh sách của đối phương
- 🔗 **Liên kết sản phẩm**: Thêm link đến sản phẩm thực tế trên các trang thương mại điện tử

## Công nghệ sử dụng

- **Frontend**: Next.js, React, TailwindCSS
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL (Neon)
- **ORM**: Prisma
- **Authentication**: Custom authentication với bcrypt
- **Deployment**: Vercel

## Cài đặt và Chạy Locally

1. Clone repository:
```bash
git clone https://github.com/yourusername/wishlist-couple.git
cd wishlist-couple
```

2. Cài đặt dependencies:
```bash
npm install
# hoặc
yarn install
# hoặc
pnpm install
```

3. Cấu hình biến môi trường:
- Tạo file `.env` tại thư mục gốc và thêm:
```
DATABASE_URL="postgresql://username:password@host:port/database"
DIRECT_URL="postgresql://username:password@host:port/database"
```

4. Thiết lập database:
```bash
npx prisma db push
```

5. Tạo dữ liệu mẫu (nếu cần):
- Chạy ứng dụng và truy cập API endpoint `/api/seed`

6. Chạy ứng dụng:
```bash
npm run dev
# hoặc
yarn dev
# hoặc
pnpm dev
```

## Đóng góp

Mọi đóng góp đều được chào đón! Hãy mở issue hoặc gửi pull request nếu bạn muốn cải thiện ứng dụng.

## Tác giả

- Your Name

## License

MIT License