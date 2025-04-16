"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { FaSave, FaTimes } from "react-icons/fa"
import type { WishlistItem } from "@/types/wishlist"

interface EditItemModalProps {
  isOpen: boolean
  onClose: () => void
  item: WishlistItem
  onSave?: (item: WishlistItem) => void
}

export default function EditItemModal({ isOpen, onClose, item, onSave }: EditItemModalProps) {
  const [editedItem, setEditedItem] = useState<WishlistItem>(item)
  const modalRef = useRef<HTMLDivElement>(null)

  // Cập nhật state khi item thay đổi
  useEffect(() => {
    setEditedItem(item)
  }, [item])

  // Đóng modal khi click ra ngoài
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen, onClose])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (onSave) {
      onSave(editedItem)
    }
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="modal-overlay">
      <div ref={modalRef} className="modal-content max-w-md w-full">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-[var(--primary-dark)]">Chỉnh sửa món đồ</h2>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-[var(--accent-light)] flex items-center justify-center hover:bg-[var(--accent)] transition-colors"
            >
              <FaTimes />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="edit-name" className="block text-sm font-medium text-gray-700">
                Tên món đồ <span className="text-red-500">*</span>
              </label>
              <input
                id="edit-name"
                className="input-cute w-full"
                value={editedItem.name}
                onChange={(e) => setEditedItem({ ...editedItem, name: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="edit-description" className="block text-sm font-medium text-gray-700">
                Mô tả
              </label>
              <textarea
                id="edit-description"
                className="textarea-cute w-full"
                value={editedItem.description || ""}
                onChange={(e) => setEditedItem({ ...editedItem, description: e.target.value })}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="edit-price" className="block text-sm font-medium text-gray-700">
                Giá (VND)
              </label>
              <input
                id="edit-price"
                type="number"
                className="input-cute w-full"
                value={editedItem.price || ""}
                onChange={(e) => setEditedItem({ ...editedItem, price: Number(e.target.value) })}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="edit-image-url" className="block text-sm font-medium text-gray-700">
                URL hình ảnh
              </label>
              <input
                id="edit-image-url"
                className="input-cute w-full"
                value={editedItem.imageUrl || ""}
                onChange={(e) => setEditedItem({ ...editedItem, imageUrl: e.target.value })}
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="edit-link" className="block text-sm font-medium text-gray-700">
                Liên kết sản phẩm
              </label>
              <input
                id="edit-link"
                className="input-cute w-full"
                value={editedItem.link || ""}
                onChange={(e) => setEditedItem({ ...editedItem, link: e.target.value })}
                placeholder="https://example.com/product"
              />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-full border-2 border-gray-300 hover:bg-gray-100 transition-colors"
              >
                Hủy
              </button>
              <button type="submit" className="btn-cute px-4 py-2 text-white flex items-center gap-2">
                <FaSave />
                Lưu thay đổi
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
