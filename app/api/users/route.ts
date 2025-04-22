import { NextResponse } from "next/server";
import prisma from "@/lib/prisma/prisma";

// Configure this route as dynamic
export const dynamic = 'force-dynamic';

// GET /api/users - Lấy danh sách người dùng
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const excludeUserId = searchParams.get("exclude");

    // Tìm tất cả người dùng, ngoại trừ người dùng hiện tại (nếu được chỉ định)
    const users = await prisma.user.findMany({
      where: excludeUserId ? {
        id: {
          not: excludeUserId
        }
      } : undefined,
      select: {
        id: true,
        username: true,
        createdAt: true,
      },
      orderBy: {
        username: "asc"
      }
    });

    return NextResponse.json(users);
  } catch (error) {
    console.error("Get users error:", error);
    return NextResponse.json(
      { error: "Đã xảy ra lỗi khi lấy danh sách người dùng" },
      { status: 500 }
    );
  }
}