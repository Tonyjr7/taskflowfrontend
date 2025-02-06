import { Inter } from "next/font/google"
import { AuthProvider } from "@/contexts/auth-context"
import "./globals.css"
import type React from "react" // Added import for React
import { Metadata } from "next"

// Define global metadata for your app (server-side)
export const metadata: Metadata = {
  title: "TaskFlow", // Set the app name
  description: "TaskFlow helps you manage your tasks efficiently.", // Set the app description
  metadataBase: new URL("https://taskflow-livid.vercel.app"), // Set the base URL for your app
  icons: {
    icon: "/planning.ico", // Set the favicon path
  },
};

const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* The Metadata API automatically applies the metadata */}
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  )
}
