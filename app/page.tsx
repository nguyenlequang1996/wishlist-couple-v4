"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { FaHeart, FaUsers, FaCog } from "react-icons/fa"

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  return (
    <div className="min-h-screen flex flex-col">
      <header className="py-4 px-6 backdrop-blur-md bg-white/70">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <FaHeart className="text-2xl text-[var(--primary)] animate-pulse" />
            <h1 className="text-xl font-bold">WishList Couple</h1>
          </div>
          <Link href="/login">
            <button className="btn-cute px-4 py-2 text-white">Đăng nhập</button>
          </Link>
        </div>
      </header>

      <main className="flex-1">
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-6 text-center">
            <div className={`space-y-6 ${isLoaded ? "animate__animated animate__fadeIn" : "opacity-0"}`}>
              <div className="inline-block relative">
                <h2 className="text-4xl md:text-5xl font-bold text-[var(--primary-dark)]">
                  Danh sách mong muốn cho cặp đôi
                </h2>
                <img
                  src="/images/heart-doodle.png"
                  alt="Heart doodle"
                  className="absolute -top-10 -right-16 w-24 h-24 opacity-70 floating"
                />
              </div>
              <p className="mx-auto max-w-[700px] text-lg text-gray-600">
                Chia sẻ những món đồ bạn muốn mua với người yêu của mình. Dễ dàng quản lý và theo dõi danh sách mong
                muốn của cả hai.
              </p>
              <div className="mt-8">
                <Link href="/login">
                  <button className="btn-cute px-8 py-3 text-white text-lg">
                    Bắt đầu ngay
                    <span className="ml-2">✨</span>
                  </button>
                </Link>
              </div>
              <div className="relative mt-12">
                <img
                  src="/images/couple-wishlist.png"
                  alt="Couple Wishlist Preview"
                  className="mx-auto rounded-2xl shadow-2xl max-w-full md:max-w-3xl bounce-in"
                />
                <img
                  src="/images/star-sparkle.png"
                  alt="Sparkle"
                  className="absolute -top-10 -left-10 w-20 h-20 floating"
                />
                <img
                  src="/images/star-sparkle.png"
                  alt="Sparkle"
                  className="absolute -bottom-5 -right-5 w-16 h-16 floating"
                  style={{ animationDelay: "1s" }}
                />
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 bg-gradient-to-b from-pink-50 to-white">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center mb-12 text-[var(--primary-dark)]">
              <span className="relative">
                Tính năng tuyệt vời
                <svg
                  className="absolute -bottom-2 w-full"
                  viewBox="0 0 100 10"
                  xmlns="http://www.w3.org/2000/svg"
                  preserveAspectRatio="none"
                >
                  <path d="M0,0 C25,8 75,8 100,0 L100,10 L0,10 Z" fill="var(--accent)" opacity="0.5"></path>
                </svg>
              </span>
            </h2>

            <div className="grid md:grid-cols-3 gap-8 mt-8">
              <div className="card-cute p-6 text-center fade-in" style={{ animationDelay: "0.1s" }}>
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-pink-100 flex items-center justify-center">
                  <FaHeart className="text-2xl text-[var(--primary)]" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-[var(--primary-dark)]">Chia sẻ mong muốn</h3>
                <p className="text-gray-600">Dễ dàng chia sẻ những món đồ bạn muốn mua với người yêu của mình.</p>
              </div>

              <div className="card-cute p-6 text-center fade-in" style={{ animationDelay: "0.3s" }}>
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-pink-100 flex items-center justify-center">
                  <FaCog className="text-2xl text-[var(--primary)]" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-[var(--primary-dark)]">Quản lý dễ dàng</h3>
                <p className="text-gray-600">
                  Thêm, chỉnh sửa và xóa các món đồ trong danh sách của bạn một cách dễ dàng.
                </p>
              </div>

              <div className="card-cute p-6 text-center fade-in" style={{ animationDelay: "0.5s" }}>
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-pink-100 flex items-center justify-center">
                  <FaUsers className="text-2xl text-[var(--primary)]" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-[var(--primary-dark)]">Tài khoản riêng biệt</h3>
                <p className="text-gray-600">
                  Mỗi người trong cặp đôi có tài khoản riêng để quản lý danh sách của mình.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-8 bg-gradient-to-b from-white to-pink-50">
        <div className="container mx-auto px-6 text-center">
          <div className="flex justify-center mb-4">
            <FaHeart className="text-2xl text-[var(--primary)] animate-pulse" />
          </div>
          <p className="text-gray-600 text-sm">
            © {new Date().getFullYear()} WishList Couple. Tất cả quyền được bảo lưu.
          </p>
        </div>
      </footer>
    </div>
  )
}
