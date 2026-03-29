import type { Metadata } from "next"
import { Toaster } from "sonner"
import { RoleProvider } from "@/context/RoleContext"

import "./globals.css"
import "../node_modules/tw-animate-css/dist/tw-animate.css"

export const metadata: Metadata = {
  title: "Grievance Portal",
  description: "Industry Level Grievance Management System",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-slate-950 text-white min-h-screen">

        {/*  ROLE CONTEXT AVAILABLE EVERYWHERE */}
        <RoleProvider>
          {children}
        </RoleProvider>

        {/* Toast Notifications */}
        <Toaster richColors position="top-right" />

      </body>
    </html>
  )
}
