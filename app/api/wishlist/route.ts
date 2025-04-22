import { NextResponse } from "next/server";
import prisma from "@/lib/prisma/prisma";

// Configure this route as dynamic
export const dynamic = 'force-dynamic';

// GET /api/wishlist - Lấy danh sách wishlist items của người dùng
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "userId là bắt buộc" },
        { status: 400 }
      );
    }

    const wishlistItems = await prisma.wishlistItem.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(wishlistItems);
  } catch (error) {
    console.error("Get wishlist error:", error);
    return NextResponse.json(
      { error: "Đã xảy ra lỗi khi lấy danh sách wishlist" },
      { status: 500 }
    );
  }
}

// POST /api/wishlist - Tạo mới wishlist item
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, description, price, imageUrl, link, userId } = body;

    if (!name || !userId) {
      return NextResponse.json(
        { error: "Tên và userId là bắt buộc" },
        { status: 400 }
      );
    }

    const newItem = await prisma.wishlistItem.create({
      data: {
        name,
        description,
        price: price ? parseFloat(price) : null,
        imageUrl,
        link,
        userId,
      },
    });

    return NextResponse.json(newItem);
  } catch (error) {
    console.error("Create wishlist item error:", error);
    return NextResponse.json(
      { error: "Đã xảy ra lỗi khi tạo wishlist item" },
      { status: 500 }
    );
  }
}