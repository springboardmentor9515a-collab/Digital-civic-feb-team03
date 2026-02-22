"use client"

import Dashboard from "@/app/dashboard/page"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { getCurrentUser } from "@/lib/api"

export default function AdminPage() {
  const router = useRouter()

  useEffect(() => {
    const guardAdminRoute = async () => {
      const token = localStorage.getItem("token")
      if (!token) {
        router.replace("/login")
        return
      }

      try {
        const result = await getCurrentUser(token)
        if (result.user.role !== "official") {
          router.replace("/dashboard")
        }
      } catch {
        localStorage.removeItem("token")
        localStorage.removeItem("userRole")
        localStorage.removeItem("userName")
        router.replace("/login")
      }
    }

    guardAdminRoute()
  }, [router])

  return <Dashboard />
}
