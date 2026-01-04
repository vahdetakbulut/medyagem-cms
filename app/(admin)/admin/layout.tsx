"use client"

import { useState } from "react"
import { SessionProvider } from "next-auth/react"
import { ThemeProvider } from "next-themes"
import { Sidebar } from "@/components/admin/layout/Sidebar"
import { Header } from "@/components/admin/layout/Header"
import { Toaster } from "@/components/ui/toaster"
import { cn } from "@/lib/utils"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <SessionProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="light"
        enableSystem
        disableTransitionOnChange
      >
        <div className="min-h-screen bg-muted/30">
          <Sidebar collapsed={collapsed} onCollapsedChange={setCollapsed} />
          <Header collapsed={collapsed} />
          <main
            className={cn(
              "min-h-screen pt-16 transition-all duration-300",
              collapsed ? "ml-16" : "ml-[280px]"
            )}
          >
            <div className="container mx-auto p-6">{children}</div>
          </main>
        </div>
        <Toaster />
      </ThemeProvider>
    </SessionProvider>
  )
}
