import { PrismaClient } from "@prisma/client"

// Tránh tạo nhiều PrismaClient instances trong môi trường dev
// và sử dụng cách khởi tạo hợp lý cho môi trường production

// Biến này sẽ được sử dụng để lưu trữ PrismaClient instance
let prisma: PrismaClient

if (process.env.NODE_ENV === "production") {
  // Trong production, tạo một instance mới mỗi lần
  prisma = new PrismaClient()
} else {
  // Trong development, sử dụng global instance để tránh nhiều connections
  if (!(global as any).prisma) {
    (global as any).prisma = new PrismaClient()
  }
  prisma = (global as any).prisma
}

export default prisma