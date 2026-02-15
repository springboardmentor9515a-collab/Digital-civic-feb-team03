"use client"

import Dashboard from "@/app/dashboard/page"
import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function AdminPage() {
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem("token")
    const role = localStorage.getItem("userRole")

    if (!token) {
      router.replace("/login")
      return
    }

    if (role !== "official") {
      router.replace("/dashboard")
    }
  }, [router])

  return <Dashboard />
}