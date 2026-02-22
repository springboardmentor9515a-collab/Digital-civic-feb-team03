"use client"

import DashboardLoading from "./DashboardLoading"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import {
  LayoutDashboard,
  ClipboardList,
  User,
  LogOut,
  Menu
} from "lucide-react"

export default function Dashboard() {

  const router = useRouter()
  const [role, setRole] = useState<string | null>(null)
  const [collapsed, setCollapsed] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem("token")
    const storedRole = localStorage.getItem("userRole")

    if (!token || !storedRole) {
      router.replace("/login")
      return
    }

    setRole(storedRole)
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("userRole")
    router.push("/login")
  }

  if (!role) return <DashboardLoading />

  const menuItems = [
    { name: "Dashboard", icon: LayoutDashboard },
    {
      name: role === "official"
        ? "Manage Complaints"
        : "My Complaints",
      icon: ClipboardList
    },
    { name: "Profile", icon: User }
  ]

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-indigo-200 via-purple-200 to-blue-200 text-gray-900">

      {/* Sidebar */}
      <aside
        className={`${
          collapsed ? "w-20" : "w-64"
        } bg-gradient-to-b from-indigo-500 to-purple-600 
        text-white p-4 flex flex-col transition-all duration-300 shadow-xl`}
      >

        {/* Top Section */}
        <div className="flex items-center justify-between mb-8">
          {!collapsed && (
            <h2 className="text-xl font-bold tracking-wide">
              Grievance Portal
            </h2>
          )}

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 hover:bg-white/20 rounded-lg transition"
          >
            <Menu size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="space-y-3 flex-1">
          {menuItems.map((item, index) => (
            <div
              key={index}
              className="flex items-center gap-3 p-3 rounded-lg 
                         hover:bg-white/20 cursor-pointer transition-all duration-300"
            >
              <item.icon size={20} />
              {!collapsed && <span>{item.name}</span>}
            </div>
          ))}
        </nav>

        {/* Bottom Section */}
        <div className="space-y-4">
          {!collapsed && (
            <div className="text-sm text-white/80">
              Logged in as <span className="font-semibold">{role}</span>
            </div>
          )}

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-red-200 hover:text-white transition"
          >
            <LogOut size={18} />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>

      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10">

        {/* Welcome Section */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold capitalize">
            Welcome back 👋
          </h1>
          <p className="text-gray-600 mt-2">
            Here’s an overview of your {role} activity.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          {["Total", "Pending", "Resolved"].map((item, index) => (
            <motion.div
              key={item}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              whileHover={{ scale: 1.05 }}
              className="p-8 bg-white rounded-2xl shadow-lg"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-gray-500 text-lg">
                    {role === "official"
                      ? `${item} Cases`
                      : `${item} Complaints`}
                  </h3>

                  <p className="text-5xl font-bold text-indigo-600 mt-4">
                    {Math.floor(Math.random() * 50) + 10}
                  </p>
                </div>

                {item === "Total" && <LayoutDashboard size={40} className="text-indigo-400" />}
                {item === "Pending" && <ClipboardList size={40} className="text-yellow-500" />}
                {item === "Resolved" && <User size={40} className="text-green-500" />}
              </div>
            </motion.div>
          ))}

        </div>

      </main>

    </div>
  )
}