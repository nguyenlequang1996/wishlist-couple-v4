"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { FaHeart, FaUser, FaLock, FaUserPlus } from "react-icons/fa"
import ToastNotification from "@/components/toast-notification"

export default function LoginPage() {
  const [activeTab, setActiveTab] = useState<"login" | "register">("login")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoaded, setIsLoaded] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState({ title: "", message: "", type: "" })
  const router = useRouter()

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      })

      const data = await response.json()

      if (response.ok) {
        // Lưu thông tin đăng nhập vào localStorage
        localStorage.setItem("currentUser", username)
        localStorage.setItem("userId", data.id)

        setToastMessage({
          title: "Đăng nhập thành công",
          message: "Chào mừng bạn quay trở lại!",
          type: "success",
        })
        setShowToast(true)

        // Chuyển hướng đến trang dashboard sau 1 giây
        setTimeout(() => {
          router.push("/dashboard")
        }, 1000)
      } else {
        setToastMessage({
          title: "Đăng nhập thất bại",
          message: data.error || "Tên đăng nhập hoặc mật khẩu không đúng.",
          type: "error",
        })
        setShowToast(true)

        // Hiệu ứng rung cho form
        const form = document.getElementById("login-form")
        form?.classList.add("shake")
        setTimeout(() => {
          form?.classList.remove("shake")
        }, 500)
      }
    } catch (error) {
      console.error("Login error:", error)
      setToastMessage({
        title: "Đăng nhập thất bại",
        message: "Đã xảy ra lỗi khi đăng nhập.",
        type: "error",
      })
      setShowToast(true)
    } finally {
      setIsLoading(false)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Kiểm tra mật khẩu khớp nhau
    if (password !== confirmPassword) {
      setToastMessage({
        title: "Đăng ký thất bại",
        message: "Mật khẩu và xác nhận mật khẩu không khớp.",
        type: "error",
      })
      setShowToast(true)
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      })

      const data = await response.json()

      if (response.ok) {
        setToastMessage({
          title: "Đăng ký thành công",
          message: "Bạn có thể đăng nhập ngay bây giờ.",
          type: "success",
        })
        setShowToast(true)
        
        // Chuyển về tab đăng nhập
        setActiveTab("login")
        setConfirmPassword("")
      } else {
        setToastMessage({
          title: "Đăng ký thất bại",
          message: data.error || "Đã xảy ra lỗi khi đăng ký.",
          type: "error",
        })
        setShowToast(true)
      }
    } catch (error) {
      console.error("Register error:", error)
      setToastMessage({
        title: "Đăng ký thất bại",
        message: "Đã xảy ra lỗi khi đăng ký.",
        type: "error",
      })
      setShowToast(true)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative">
      <div className={`max-w-md w-full ${isLoaded ? "bounce-in" : "opacity-0"}`}>
        <div className="text-center mb-8">
          <div className="inline-block relative">
            <FaHeart className="text-4xl text-[var(--primary)] mx-auto animate-pulse" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-[var(--accent)] rounded-full animate-ping"></div>
          </div>
          <h1 className="text-3xl font-bold mt-2 text-[var(--primary-dark)]">WishList Couple</h1>
          <p className="text-gray-600 mt-1">Quản lý danh sách mong muốn của bạn</p>
        </div>

        <div className="card-cute p-8 relative">
          <img src="/images/cute-cat.png" alt="Cute Cat" className="absolute -top-16 -right-10 w-24 h-24 floating" />

          {/* Tab Navigation */}
          <div className="flex border-b border-gray-200 mb-6">
            <button
              className={`py-2 px-4 font-medium text-sm flex items-center gap-1 ${
                activeTab === "login"
                  ? "text-[var(--primary)] border-b-2 border-[var(--primary)]"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab("login")}
            >
              <FaUser className="text-xs" /> Đăng nhập
            </button>
            <button
              className={`py-2 px-4 font-medium text-sm flex items-center gap-1 ${
                activeTab === "register"
                  ? "text-[var(--primary)] border-b-2 border-[var(--primary)]"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab("register")}
            >
              <FaUserPlus className="text-xs" /> Đăng ký
            </button>
          </div>

          {activeTab === "login" ? (
            <>
              <h2 className="text-2xl font-bold text-center mb-6 text-[var(--primary-dark)]">Đăng nhập</h2>

              <form id="login-form" onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="username" className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                    <FaUser className="text-[var(--primary)]" />
                    Tên đăng nhập
                  </label>
                  <input
                    id="username"
                    type="text"
                    className="input-cute w-full"
                    placeholder="Nhập tên đăng nhập"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                    <FaLock className="text-[var(--primary)]" />
                    Mật khẩu
                  </label>
                  <input
                    id="password"
                    type="password"
                    className="input-cute w-full"
                    placeholder="Nhập mật khẩu"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                <button 
                  type="submit" 
                  className="btn-cute w-full py-3 text-white font-medium"
                  disabled={isLoading}
                >
                  {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
                  {!isLoading && <span className="ml-2">✨</span>}
                </button>
              </form>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-bold text-center mb-6 text-[var(--primary-dark)]">Đăng ký</h2>

              <form id="register-form" onSubmit={handleRegister} className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="reg-username" className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                    <FaUser className="text-[var(--primary)]" />
                    Tên đăng nhập
                  </label>
                  <input
                    id="reg-username"
                    type="text"
                    className="input-cute w-full"
                    placeholder="Nhập tên đăng nhập"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="reg-password" className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                    <FaLock className="text-[var(--primary)]" />
                    Mật khẩu
                  </label>
                  <input
                    id="reg-password"
                    type="password"
                    className="input-cute w-full"
                    placeholder="Nhập mật khẩu"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                    <FaLock className="text-[var(--primary)]" />
                    Xác nhận mật khẩu
                  </label>
                  <input
                    id="confirm-password"
                    type="password"
                    className="input-cute w-full"
                    placeholder="Nhập lại mật khẩu"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>

                <button 
                  type="submit" 
                  className="btn-cute w-full py-3 text-white font-medium"
                  disabled={isLoading}
                >
                  {isLoading ? "Đang đăng ký..." : "Đăng ký"}
                  {!isLoading && <span className="ml-2">✨</span>}
                </button>
              </form>
            </>
          )}
        </div>

        <div className="mt-6 text-center">
          <Link href="/" className="text-[var(--primary)] hover:text-[var(--primary-dark)] transition-colors">
            ← Quay lại trang chủ
          </Link>
        </div>
      </div>

      <ToastNotification show={showToast} message={toastMessage} onClose={() => setShowToast(false)} />
    </div>
  )
}
