"use client"

import { useEffect } from "react"

interface ToastProps {
  show: boolean
  message: {
    title: string
    message: string
    type: string
  }
  onClose: () => void
}

export default function ToastNotification({ show, message, onClose }: ToastProps) {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose()
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [show, onClose])

  if (!show) return null

  return (
    <div
      className={`toast-cute bottom-4 right-4 flex items-center gap-3 ${
        message.type === "success" ? "border-green-500" : "border-red-500"
      }`}
    >
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center ${
          message.type === "success" ? "bg-green-100 text-green-500" : "bg-red-100 text-red-500"
        }`}
      >
        {message.type === "success" ? "✓" : "✕"}
      </div>
      <div>
        <h3 className="font-medium">{message.title}</h3>
        <p className="text-sm text-gray-600">{message.message}</p>
      </div>
    </div>
  )
}
