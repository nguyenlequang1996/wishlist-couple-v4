import { NextResponse } from "next/server";
import prisma from "@/lib/prisma/prisma";
import { hashPassword } from "@/lib/auth-utils";

// Chỉ sử dụng API này trong môi trường phát triển
export async function GET(request: Request) {
  // Kiểm tra xem có phải môi trường phát triển không
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json(
      { error: "API này chỉ khả dụng trong môi trường phát triển" },
      { status: 403 }
    );
  }

  try {
    // Xóa dữ liệu hiện có trước khi seed để tránh trùng lặp
    await prisma.wishlistItem.deleteMany();
    await prisma.user.deleteMany();

    // Tạo người dùng mẫu
    const password1 = await hashPassword("password1");
    const password2 = await hashPassword("password2");

    // Tạo người dùng 1
    const user1 = await prisma.user.create({
      data: {
        username: "user1",
        password: password1,
      },
    });

    // Tạo người dùng 2
    const user2 = await prisma.user.create({
      data: {
        username: "user2",
        password: password2,
      },
    });

    // Tạo các wishlist item mẫu cho user1
    const wishlistItems1 = [
      {
        name: "Laptop Apple MacBook Air M2",
        description: "MacBook Air M2 với chip M2, màn hình 13.6 inch, 8GB RAM, 256GB SSD",
        price: 26990000,
        imageUrl: "https://i.imgur.com/Ir95CxS.jpg",
        link: "https://www.thegioididong.com/laptop/apple-macbook-air-m2-2022",
        userId: user1.id,
      },
      {
        name: "Tai nghe Sony WH-1000XM5",
        description: "Tai nghe chống ồn cao cấp với chất lượng âm thanh tuyệt vời",
        price: 8490000,
        imageUrl: "https://i.imgur.com/F7GHIz7.jpg",
        link: "https://www.thegioididong.com/tai-nghe/sony-wh-1000xm5",
        userId: user1.id,
      },
      {
        name: "Điện thoại iPhone 15 Pro Max",
        description: "iPhone mới nhất với camera 48MP, chip A17 Pro",
        price: 34990000,
        imageUrl: "https://i.imgur.com/8jy4sVy.jpg",
        link: "https://www.thegioididong.com/dtdd/iphone-15-pro-max",
        userId: user1.id,
      },
    ];

    // Tạo các wishlist item mẫu cho user2
    const wishlistItems2 = [
      {
        name: "Samsung Galaxy S24 Ultra",
        description: "Điện thoại Samsung mới nhất với camera 200MP và S Pen",
        price: 29990000,
        imageUrl: "https://i.imgur.com/WU4QQZl.jpg",
        link: "https://www.thegioididong.com/dtdd/samsung-galaxy-s24-ultra",
        userId: user2.id,
      },
      {
        name: "iPad Pro M2",
        description: "iPad Pro với chip M2, màn hình 12.9 inch Liquid Retina XDR",
        price: 28990000,
        imageUrl: "https://i.imgur.com/uFJLvfU.jpg",
        link: "https://www.thegioididong.com/may-tinh-bang/ipad-pro-m2-129-inch-wifi-cellular-128gb",
        userId: user2.id,
      },
      {
        name: "Apple Watch Ultra 2",
        description: "Đồng hồ thông minh cao cấp nhất của Apple với thiết kế bền bỉ",
        price: 22990000,
        imageUrl: "https://i.imgur.com/qYDQWfu.jpg",
        link: "https://www.thegioididong.com/dong-ho-thong-minh/apple-watch-ultra-2-gps-cellular",
        userId: user2.id,
      },
    ];

    // Thêm các item vào database
    for (const item of wishlistItems1) {
      await prisma.wishlistItem.create({
        data: item,
      });
    }

    for (const item of wishlistItems2) {
      await prisma.wishlistItem.create({
        data: item,
      });
    }

    return NextResponse.json({
      success: true,
      message: "Đã khởi tạo dữ liệu mẫu thành công!",
      data: {
        users: [user1.username, user2.username],
        wishlistItems: wishlistItems1.length + wishlistItems2.length,
      },
    });
  } catch (error) {
    console.error("Lỗi khi seed database:", error);
    return NextResponse.json(
      { error: "Đã xảy ra lỗi khi khởi tạo dữ liệu mẫu" },
      { status: 500 }
    );
  }
}