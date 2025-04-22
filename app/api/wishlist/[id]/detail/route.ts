import { NextResponse } from "next/server";
import prisma from "@/lib/prisma/prisma";

// Configure this route as dynamic
export const dynamic = 'force-dynamic';

// GET /api/wishlist/[id]/detail - Lấy chi tiết sản phẩm cùng thông tin chủ sở hữu
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    if (!id) {
      return NextResponse.json(
        { error: "ID sản phẩm là bắt buộc" },
        { status: 400 }
      );
    }

    // Tìm sản phẩm và lấy thông tin của chủ sở hữu
    const item = await prisma.wishlistItem.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    });

    if (!item) {
      return NextResponse.json(
        { error: "Không tìm thấy sản phẩm" },
        { status: 404 }
      );
    }

    // Trả về sản phẩm và thông tin chủ sở hữu
    return NextResponse.json({
      product: {
        id: item.id,
        name: item.name,
        description: item.description,
        price: item.price,
        imageUrl: item.imageUrl,
        link: item.link,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
      },
      owner: {
        id: item.user.id,
        username: item.user.username,
      },
    });
  } catch (error) {
    console.error("Get product detail error:", error);
    return NextResponse.json(
      { error: "Đã xảy ra lỗi khi lấy chi tiết sản phẩm" },
      { status: 500 }
    );
  }
}