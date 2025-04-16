"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { FaPlus, FaTimes } from "react-icons/fa"
import type { WishlistItem } from "@/types/wishlist"

interface AddItemDialogProps {
  isOpen: boolean
  onClose: () => void
  onAddItem: (item: Omit<WishlistItem, "id">) => void
}

export default function AddItemDialog({ isOpen, onClose, onAddItem }: AddItemDialogProps) {
  const [newItem, setNewItem] = useState<Omit<WishlistItem, "id">>({
    name: "",
    description: "",
    price: undefined,
    imageUrl: "",
    link: "",
  })

  const modalRef = useRef<HTMLDivElement>(null)

  // Focus vào input đầu tiên khi mở modal
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        const nameInput = document.getElementById("name")
        if (nameInput) nameInput.focus()
      }, 100)
      return () => clearTimeout(timer)
    }
  }, [isOpen])

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

    // Truyền trực tiếp item mà không tạo ID
    onAddItem(newItem)

    // Reset form
    setNewItem({
      name: "",
      description: "",
      price: undefined,
      imageUrl: "",
      link: "",
    })

    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="modal-overlay">
      <div ref={modalRef} className="modal-content max-w-md w-full">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-[var(--primary-dark)]">Thêm món đồ mới</h2>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-[var(--accent-light)] flex items-center justify-center hover:bg-[var(--accent)] transition-colors"
            >
              <FaTimes />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Tên món đồ <span className="text-red-500">*</span>
              </label>
              <input
                id="name"
                className="input-cute w-full"
                value={newItem.name}
                onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                placeholder="Nhập tên món đồ"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Mô tả
              </label>
              <textarea
                id="description"
                className="textarea-cute w-full"
                value={newItem.description || ""}
                onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                placeholder="Mô tả món đồ"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                Giá (VND)
              </label>
              <input
                id="price"
                type="number"
                className="input-cute w-full"
                value={newItem.price || ""}
                onChange={(e) => setNewItem({ ...newItem, price: Number(e.target.value) })}
                placeholder="Nhập giá"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="image-url" className="block text-sm font-medium text-gray-700">
                URL hình ảnh
              </label>
              <input
                id="image-url"
                className="input-cute w-full"
                value={newItem.imageUrl || ""}
                onChange={(e) => setNewItem({ ...newItem, imageUrl: e.target.value })}
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="link" className="block text-sm font-medium text-gray-700">
                Liên kết sản phẩm
              </label>
              <input
                id="link"
                className="input-cute w-full"
                value={newItem.link || ""}
                onChange={(e) => setNewItem({ ...newItem, link: e.target.value })}
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
                <FaPlus />
                Thêm món đồ
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
