"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { FaHeart, FaPlus, FaShoppingBag, FaSignOutAlt } from "react-icons/fa"
import type { WishlistItem } from "@/types/wishlist"
import WishlistItemCard from "@/components/wishlist-item-card"
import AddItemDialog from "@/components/add-item-dialog"
import ThemeToggle from "@/components/theme-toggle"
import ToastNotification from "@/components/toast-notification"

export default function DashboardPage() {
  const [currentUser, setCurrentUser] = useState<string | null>(null)
  const [userId, setUserId] = useState<string | null>(null)
  const [myWishlist, setMyWishlist] = useState<WishlistItem[]>([])
  const [otherUsers, setOtherUsers] = useState<{id: string, username: string}[]>([])
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null)
  const [partnerWishlist, setPartnerWishlist] = useState<WishlistItem[]>([])
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingPartnerWishlist, setIsLoadingPartnerWishlist] = useState(false)
  const [activeTab, setActiveTab] = useState("my-wishlist")
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState({ title: "", message: "", type: "" })
  const router = useRouter()

  useEffect(() => {
    // Kiểm tra xem người dùng đã đăng nhập chưa
    const user = localStorage.getItem("currentUser")
    const id = localStorage.getItem("userId")
    
    if (!user || !id) {
      router.push("/login")
      return
    }

    setCurrentUser(user)
    setUserId(id)

    // Lấy danh sách mong muốn từ API
    fetchWishlist(id)
    
    // Lấy danh sách người dùng khác
    fetchOtherUsers(id)
  }, [router])
  
  // Khi chọn người dùng khác, tải danh sách wishlist của họ
  useEffect(() => {
    if (selectedUserId) {
      fetchPartnerWishlist(selectedUserId)
    }
  }, [selectedUserId])

  const fetchWishlist = async (id: string) => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/wishlist?userId=${id}`)
      
      if (response.ok) {
        const data = await response.json()
        setMyWishlist(data)
      } else {
        showToastNotification(
          "Lỗi",
          "Không thể tải danh sách mong muốn",
          "error"
        )
      }
    } catch (error) {
      console.error("Error fetching wishlist:", error)
      showToastNotification(
        "Lỗi",
        "Đã xảy ra lỗi khi tải danh sách mong muốn",
        "error"
      )
    } finally {
      setIsLoading(false)
    }
  }
  
  const fetchOtherUsers = async (currentUserId: string) => {
    try {
      const response = await fetch(`/api/users?exclude=${currentUserId}`)
      
      if (response.ok) {
        const data = await response.json()
        setOtherUsers(data)
        // Tự động chọn người dùng đầu tiên trong danh sách (nếu có)
        if (data.length > 0) {
          setSelectedUserId(data[0].id)
        }
      } else {
        console.error("Không thể lấy danh sách người dùng khác")
      }
    } catch (error) {
      console.error("Error fetching other users:", error)
    }
  }
  
  const fetchPartnerWishlist = async (partnerId: string) => {
    setIsLoadingPartnerWishlist(true)
    try {
      const response = await fetch(`/api/wishlist?userId=${partnerId}`)
      
      if (response.ok) {
        const data = await response.json()
        setPartnerWishlist(data)
      } else {
        showToastNotification(
          "Lỗi",
          "Không thể tải danh sách mong muốn của người khác",
          "error"
        )
      }
    } catch (error) {
      console.error("Error fetching partner wishlist:", error)
    } finally {
      setIsLoadingPartnerWishlist(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("currentUser")
    localStorage.removeItem("userId")
    router.push("/login")
  }

  const showToastNotification = (title: string, message: string, type: string) => {
    setToastMessage({ title, message, type })
    setShowToast(true)
  }

  const handleAddItem = async (item: Omit<WishlistItem, "id">) => {
    if (!userId) return

    try {
      const response = await fetch("/api/wishlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...item,
          userId,
        }),
      })

      if (response.ok) {
        const newItem = await response.json()
        setMyWishlist((prev) => [newItem, ...prev])
        showToastNotification(
          "Đã thêm món đồ", 
          `${item.name} đã được thêm vào danh sách của bạn.`, 
          "success"
        )
      } else {
        const error = await response.json()
        showToastNotification(
          "Lỗi",
          error.error || "Không thể thêm món đồ",
          "error"
        )
      }
    } catch (error) {
      console.error("Error adding item:", error)
      showToastNotification(
        "Lỗi",
        "Đã xảy ra lỗi khi thêm món đồ",
        "error"
      )
    }
  }

  const handleDeleteItem = async (id: string) => {
    try {
      const itemToDelete = myWishlist.find((item) => item.id === id)
      
      const response = await fetch(`/api/wishlist/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setMyWishlist((prev) => prev.filter((item) => item.id !== id))
        showToastNotification(
          "Đã xóa món đồ",
          itemToDelete ? `${itemToDelete.name} đã được xóa khỏi danh sách.` : "Món đồ đã được xóa khỏi danh sách.",
          "success"
        )
      } else {
        const error = await response.json()
        showToastNotification(
          "Lỗi",
          error.error || "Không thể xóa món đồ",
          "error"
        )
      }
    } catch (error) {
      console.error("Error deleting item:", error)
      showToastNotification(
        "Lỗi",
        "Đã xảy ra lỗi khi xóa món đồ",
        "error"
      )
    }
  }

  const handleEditItem = async (updatedItem: WishlistItem) => {
    try {
      const response = await fetch(`/api/wishlist/${updatedItem.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedItem),
      })

      if (response.ok) {
        const updated = await response.json()
        setMyWishlist((prev) => 
          prev.map((item) => (item.id === updated.id ? updated : item))
        )
        showToastNotification(
          "Đã cập nhật món đồ", 
          `${updatedItem.name} đã được cập nhật.`, 
          "success"
        )
      } else {
        const error = await response.json()
        showToastNotification(
          "Lỗi",
          error.error || "Không thể cập nhật món đồ",
          "error"
        )
      }
    } catch (error) {
      console.error("Error updating item:", error)
      showToastNotification(
        "Lỗi",
        "Đã xảy ra lỗi khi cập nhật món đồ",
        "error"
      )
    }
  }
  
  // Lấy tên người dùng từ ID
  const getPartnerName = () => {
    const partner = otherUsers.find(user => user.id === selectedUserId)
    return partner ? partner.username : "người khác"
  }

  if (!currentUser || isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="spinner-cute"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="py-4 px-6 backdrop-blur-md bg-white/70 dark:bg-gray-800/70 shadow-sm">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <FaHeart className="text-2xl text-[var(--primary)] animate-pulse" />
            <h1 className="text-xl font-bold">WishList Couple</h1>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <button onClick={handleLogout} className="flex items-center gap-2 btn-cute px-4 py-2 text-white">
              <FaSignOutAlt />
              Đăng xuất
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto py-8 px-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div className="relative">
            <h2 className="text-2xl font-bold text-[var(--primary-dark)]">
              Xin chào, {currentUser}
              <span className="absolute -top-2 -right-6 text-2xl animate-bounce">👋</span>
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Quản lý danh sách mong muốn của bạn
            </p>
          </div>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="btn-cute px-4 py-2 text-white flex items-center gap-2"
          >
            <FaPlus />
            Thêm món đồ mới
          </button>
        </div>

        <div className="tabs-cute">
          <button
            className={`tab-cute flex-1 ${activeTab === "my-wishlist" ? "active" : ""}`}
            onClick={() => setActiveTab("my-wishlist")}
          >
            Danh sách của tôi
          </button>
          <button
            className={`tab-cute flex-1 ${activeTab === "partner-wishlist" ? "active" : ""}`}
            onClick={() => setActiveTab("partner-wishlist")}
          >
            Danh sách của {otherUsers.length > 0 ? getPartnerName() : "người khác"}
          </button>
        </div>

        <div className="mt-6">
          {activeTab === "my-wishlist" && (
            <>
              {myWishlist.length === 0 ? (
                <div className="card-cute p-10 text-center">
                  <FaShoppingBag className="text-5xl text-[var(--accent)] mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-2 text-[var(--primary-dark)]">Danh sách của bạn đang trống</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">
                    Hãy thêm những món đồ bạn muốn mua vào danh sách
                  </p>
                  <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="btn-cute px-4 py-2 text-white flex items-center gap-2 mx-auto"
                  >
                    <FaPlus />
                    Thêm món đồ mới
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {myWishlist.map((item, index) => (
                    <div key={item.id} className="fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                      <WishlistItemCard
                        item={item}
                        onDelete={handleDeleteItem}
                        onEdit={handleEditItem}
                        isOwner={true}
                      />
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {activeTab === "partner-wishlist" && (
            <>
              {otherUsers.length > 0 && (
                <div className="mb-6">
                  <label htmlFor="partner-select" className="block text-sm font-medium mb-2">
                    Chọn người dùng:
                  </label>
                  <select
                    id="partner-select"
                    className="input-cute w-full md:w-auto"
                    value={selectedUserId || ""}
                    onChange={(e) => setSelectedUserId(e.target.value)}
                  >
                    {otherUsers.map(user => (
                      <option key={user.id} value={user.id}>
                        {user.username}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {isLoadingPartnerWishlist ? (
                <div className="flex justify-center my-12">
                  <div className="spinner-cute"></div>
                </div>
              ) : otherUsers.length === 0 ? (
                <div className="card-cute p-10 text-center">
                  <FaShoppingBag className="text-5xl text-[var(--accent)] mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-2 text-[var(--primary-dark)]">
                    Không tìm thấy người dùng khác
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Hiện chưa có người dùng khác trong hệ thống
                  </p>
                </div>
              ) : partnerWishlist.length === 0 ? (
                <div className="card-cute p-10 text-center">
                  <FaShoppingBag className="text-5xl text-[var(--accent)] mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-2 text-[var(--primary-dark)]">
                    Danh sách của {getPartnerName()} đang trống
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Họ chưa thêm món đồ nào vào danh sách
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {partnerWishlist.map((item, index) => (
                    <div key={item.id} className="fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                      <WishlistItemCard
                        item={item}
                        isOwner={false}
                      />
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </main>

      <footer className="py-6 bg-gradient-to-t from-pink-50 to-transparent dark:from-gray-800 dark:to-transparent">
        <div className="container mx-auto px-6 text-center">
          <div className="flex justify-center mb-2">
            <FaHeart className="text-xl text-[var(--primary)] animate-pulse" />
          </div>
          <p className="text-gray-600 dark:text-gray-300 text-sm">
            © {new Date().getFullYear()} WishList Couple. Tất cả quyền được bảo lưu.
          </p>
        </div>
      </footer>

      <AddItemDialog isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onAddItem={handleAddItem} />

      <ToastNotification show={showToast} message={toastMessage} onClose={() => setShowToast(false)} />
    </div>
  )
}
