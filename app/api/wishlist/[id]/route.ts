import { NextResponse } from "next/server";
import prisma from "@/lib/prisma/prisma";

// PUT /api/wishlist/[id] - Cập nhật wishlist item
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { name, description, price, imageUrl, link } = body;
    const id = params.id;

    if (!id) {
      return NextResponse.json(
        { error: "ID là bắt buộc" },
        { status: 400 }
      );
    }

    // Kiểm tra xem item có tồn tại không
    const existingItem = await prisma.wishlistItem.findUnique({
      where: { id },
    });

    if (!existingItem) {
      return NextResponse.json(
        { error: "Không tìm thấy wishlist item" },
        { status: 404 }
      );
    }

    // Cập nhật item
    const updatedItem = await prisma.wishlistItem.update({
      where: { id },
      data: {
        name: name || existingItem.name,
        description: description !== undefined ? description : existingItem.description,
        price: price !== undefined ? parseFloat(price) : existingItem.price,
        imageUrl: imageUrl !== undefined ? imageUrl : existingItem.imageUrl,
        link: link !== undefined ? link : existingItem.link,
      },
    });

    return NextResponse.json(updatedItem);
  } catch (error) {
    console.error("Update wishlist item error:", error);
    return NextResponse.json(
      { error: "Đã xảy ra lỗi khi cập nhật wishlist item" },
      { status: 500 }
    );
  }
}

// DELETE /api/wishlist/[id] - Xóa wishlist item
export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    if (!id) {
      return NextResponse.json(
        { error: "ID là bắt buộc" },
        { status: 400 }
      );
    }

    // Kiểm tra xem item có tồn tại không
    const existingItem = await prisma.wishlistItem.findUnique({
      where: { id },
    });

    if (!existingItem) {
      return NextResponse.json(
        { error: "Không tìm thấy wishlist item" },
        { status: 404 }
      );
    }

    // Xóa item
    await prisma.wishlistItem.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Xóa thành công" });
  } catch (error) {
    console.error("Delete wishlist item error:", error);
    return NextResponse.json(
      { error: "Đã xảy ra lỗi khi xóa wishlist item" },
      { status: 500 }
    );
  }
}