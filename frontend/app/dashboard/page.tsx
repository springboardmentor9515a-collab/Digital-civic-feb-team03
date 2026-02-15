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
    localStorage.removeItem("userRole")
    router.push("/login")
  }

  if (!role) {
  return <DashboardLoading />
}

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
    <div className="min-h-screen flex bg-slate-950 text-white">

      {/* Sidebar */}
      <aside
        className={`${
          collapsed ? "w-20" : "w-64"
        } bg-slate-900 border-r border-slate-800 p-4 flex flex-col transition-all duration-300`}
      >

        {/* Top Section */}
        <div className="flex items-center justify-between mb-8">

          {!collapsed && (
            <h2 className="text-xl font-bold text-blue-400">
              Grievance Portal
            </h2>
          )}

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 hover:bg-slate-800 rounded-lg transition"
          >
            <Menu size={20} />
          </button>

        </div>

        {/* Navigation */}
        <nav className="space-y-3 flex-1">
          {menuItems.map((item, index) => (
            <div
              key={index}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-800 cursor-pointer transition"
            >
              <item.icon size={20} />
              {!collapsed && <span>{item.name}</span>}
            </div>
          ))}
        </nav>

        {/* Bottom Section */}
        <div className="space-y-4">

          {!collapsed && (
            <div className="text-sm text-slate-500">
              Logged in as {role}
            </div>
          )}

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-red-400 hover:text-red-500 transition"
          >
            <LogOut size={18} />
            {!collapsed && <span>Logout</span>}
          </button>

        </div>

      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10">

        <h1 className="text-4xl font-bold mb-10 capitalize">
          {role} Dashboard
        </h1>

        <div className="grid grid-cols-3 gap-8">

          {["Total", "Pending", "Resolved"].map((item, index) => (
            <motion.div
              key={item}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              whileHover={{ scale: 1.05 }}
              className="p-8 bg-slate-900 rounded-2xl shadow-xl border border-slate-800"
            >
              <h3 className="text-lg text-slate-400">
                {role === "official"
                  ? `${item} Cases`
                  : `${item} Complaints`}
              </h3>

              <p className="text-5xl font-bold text-blue-500 mt-4">
                {Math.floor(Math.random() * 50) + 10}
              </p>

            </motion.div>
          ))}

        </div>

      </main>

    </div>
  )
}