"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { FaArrowLeft, FaExternalLinkAlt, FaHeart } from "react-icons/fa"
import type { WishlistItem } from "@/types/wishlist"

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const [product, setProduct] = useState<WishlistItem | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [owner, setOwner] = useState<{ username: string } | null>(null)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  
  useEffect(() => {
    // Fetch product data
    const fetchProduct = async () => {
      setIsLoading(true)
      try {
        const response = await fetch(`/api/wishlist/${params.id}/detail`)
        
        if (!response.ok) {
          throw new Error("Không thể tải thông tin sản phẩm")
        }
        
        const data = await response.json()
        setProduct(data.product)
        setOwner(data.owner)
      } catch (err) {
        console.error("Error fetching product:", err)
        setError("Không tìm thấy sản phẩm hoặc đã xảy ra lỗi")
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchProduct()
  }, [params.id])
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="spinner-cute"></div>
      </div>
    )
  }
  
  if (error || !product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="card-cute p-8 text-center max-w-md">
          <h1 className="text-2xl font-bold text-[var(--primary-dark)] mb-4">Không tìm thấy sản phẩm</h1>
          <p className="text-gray-600 dark:text-gray-300 mb-6">{error || "Sản phẩm không tồn tại hoặc đã bị xóa"}</p>
          <Link href="/dashboard" className="btn-cute px-4 py-2 text-white inline-flex items-center gap-2">
            <FaArrowLeft /> Quay lại Dashboard
          </Link>
        </div>
      </div>
    )
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
    <div className="min-h-screen py-12 px-4">
      <div className="container mx-auto max-w-5xl">
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-[var(--primary)] hover:text-[var(--primary-dark)] mb-8">
          <FaArrowLeft /> Quay lại Dashboard
        </Link>
        
        <div className="card-cute p-6 md:p-8 lg:p-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Hình ảnh sản phẩm */}
            <div className="relative rounded-lg overflow-hidden h-[300px] md:h-[400px] shadow-md">
              <Image 
                src={product.imageUrl || "/images/placeholder-gift.png"} 
                alt={product.name}
                fill
                className="object-cover"
              />
              
              {/* Ribbon giá */}
              {product.price && (
                <div className="absolute top-5 -right-12 bg-[var(--primary)] text-white py-1 px-10 transform rotate-45 shadow-md z-10">
                  {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(product.price)}
                </div>
              )}
            </div>
            
            {/* Thông tin sản phẩm */}
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-[var(--primary-dark)] mb-4">{product.name}</h1>
              
              {owner && (
                <p className="text-gray-500 mb-4">
                  Từ danh sách mong muốn của <span className="font-semibold">{owner.username}</span>
                </p>
              )}
              
              {product.price && (
                <div className="text-xl font-bold text-[var(--accent-dark)] mb-6">
                  {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(product.price)}
                </div>
              )}
              
              {product.description && (
                <div className="mb-6">
                  <h2 className="text-lg font-semibold mb-2">Mô tả</h2>
                  <p className="text-gray-600 dark:text-gray-300">{product.description}</p>
                </div>
              )}
              
              {product.link && (
                <a
                  href={getValidUrl(product.link)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-cute px-6 py-3 text-white inline-flex items-center gap-2 mb-6"
                >
                  <FaExternalLinkAlt /> Xem sản phẩm trên shop
                </a>
              )}
              
              <button className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-pink-100 text-pink-500 hover:bg-pink-200 transition-colors">
                <FaHeart /> Yêu thích
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}