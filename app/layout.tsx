import { Inter } from "next/font/google"
import { AuthProvider } from "@/contexts/auth-context"
import "./globals.css"
import type React from "react"
import type { Metadata } from "next"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "TaskFlow",
  description: "TaskFlow helps you manage your tasks efficiently.",
  metadataBase: new URL("https://taskflow-livid.vercel.app"),
  icons: {
    icon: "/planning.ico",
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/palnning.ico" sizes="any" />
      </head>
      <body className={inter.className}>
          <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  )
}

