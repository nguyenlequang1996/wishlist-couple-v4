"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { FaEdit, FaTrash, FaHeart, FaExternalLinkAlt } from "react-icons/fa"
import type { WishlistItem } from "@/types/wishlist"
import EditItemModal from "./edit-item-modal"

interface WishlistItemCardProps {
  item: WishlistItem
  onDelete?: (id: string) => void
  onEdit?: (item: WishlistItem) => void
  isOwner: boolean
}

export default function WishlistItemCard({ item, onDelete, onEdit, isOwner }: WishlistItemCardProps) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [isLiked, setIsLiked] = useState(false)

  const handleLike = () => {
    setIsLiked(!isLiked)

    // Hiệu ứng tim bay lên khi like
    if (!isLiked) {
      const heart = document.createElement("div")
      heart.innerHTML = "❤️"
      heart.className = "absolute text-2xl pointer-events-none"
      heart.style.left = `${Math.random() * 80 + 10}%`
      heart.style.top = "50%"
      heart.style.animation = "float-heart 2s forwards"

      const card = document.getElementById(`card-${item.id}`)
      if (card) {
        card.appendChild(heart)
        setTimeout(() => {
          heart.remove()
        }, 2000)
      }
    }
  }

  // Đảm bảo link hợp lệ bằng cách thêm protocol nếu chưa có
  const getValidUrl = (url: string) => {
    if (!url) return '';
    
    // Kiểm tra xem URL có bắt đầu bằng http:// hoặc https:// không
    if (!/^https?:\/\//i.test(url)) {
      return 'https://' + url;
    }
    
    return url;
  }

  return (
    <>
      <div
        id={`card-${item.id}`}
        className="card-cute overflow-hidden relative"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Ribbon (chỉ hiển thị khi có giá) */}
        {item.price && (
          <div className="absolute top-5 -right-12 bg-[var(--primary)] text-white py-1 px-10 transform rotate-45 shadow-md z-10">
            {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(item.price)}
          </div>
        )}

        {/* Hình ảnh */}
        <div className="relative h-48 overflow-hidden">
          <Image
            src={item.imageUrl || "/images/placeholder-gift.png"}
            alt={item.name}
            fill
            className="object-cover transition-transform duration-500"
            style={{ transform: isHovered ? "scale(1.05)" : "scale(1)" }}
          />

          {/* Overlay gradient */}
          <div
            className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 transition-opacity duration-300"
            style={{ opacity: isHovered ? 1 : 0 }}
          ></div>

          {/* Like button */}
          {!isOwner && (
            <button
              onClick={handleLike}
              className="absolute top-2 right-2 w-10 h-10 rounded-full bg-white/80 flex items-center justify-center transition-transform duration-300 hover:scale-110"
              style={{ transform: isLiked ? "scale(1.1)" : "scale(1)" }}
            >
              <FaHeart className={`${isLiked ? "text-red-500" : "text-gray-400"} transition-colors duration-300`} />
            </button>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="text-lg font-bold mb-2 text-[var(--primary-dark)]">{item.name}</h3>

          {item.description && (
            <p className="text-gray-600 dark:text-gray-300 text-sm mb-3 line-clamp-2">{item.description}</p>
          )}

          {/* Chỉ hiển thị link "Xem sản phẩm" khi có link */}
          {item.link && (
            <a
              href={getValidUrl(item.link)}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-[var(--primary)] hover:text-[var(--primary-dark)] transition-colors flex items-center gap-1 mb-3"
            >
              <FaExternalLinkAlt size={12} /> Xem sản phẩm
            </a>
          )}

          {/* Buttons */}
          {isOwner && (
            <div className="flex justify-between mt-2">
              <button
                onClick={() => setIsEditModalOpen(true)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-[var(--secondary-light)] text-[var(--secondary-dark)] hover:bg-[var(--secondary)] transition-colors text-sm"
              >
                <FaEdit />
                Sửa
              </button>

              <button
                onClick={() => onDelete && onDelete(item.id)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-red-100 text-red-500 hover:bg-red-200 transition-colors text-sm"
              >
                <FaTrash />
                Xóa
              </button>
            </div>
          )}
        </div>

        {/* Decorative elements */}
        <div className="absolute -bottom-3 -left-3 w-6 h-6 bg-[var(--accent)] rounded-full opacity-50"></div>
        <div className="absolute -top-3 -right-3 w-6 h-6 bg-[var(--primary-light)] rounded-full opacity-50"></div>
      </div>

      {isOwner && (
        <EditItemModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} item={item} onSave={onEdit} />
      )}
    </>
  )
}
