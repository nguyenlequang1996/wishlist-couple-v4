import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Wishlist Couple",
  description: "Ứng dụng danh sách mong muốn dễ thương cho cặp đôi",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="vi">
      <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css" />
      </head>
      <body className={inter.className}>
        <div className="cute-background">
          <div className="stars"></div>
          <div className="hearts"></div>
        </div>
        {children}
      </body>
    </html>
  )
}


import './globals.css'