import type { Metadata } from "next"
import { Toaster } from "sonner"
import "./globals.css";

import "../node_modules/tw-animate-css/dist/tw-animate.css"
import "./globals.css"

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
        {children}
        <Toaster richColors position="top-right" />
      </body>
    </html>
  )
}
