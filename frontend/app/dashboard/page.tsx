"use client"

import VotePoll from "@/components/VotePoll"
import CreatePoll from "@/components/CreatePoll"
import SignPetition from "@/components/SignPetition"
import RoleBasedUI from "@/components/RoleBasedUI"
import DashboardLoading from "./DashboardLoading"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { LayoutDashboard, ClipboardList, User, LogOut, Menu, CheckCircle } from "lucide-react"
import { getCurrentUser, getPetitions, type Petition } from "@/lib/api"

export default function Dashboard() {
  const router = useRouter()
  const [role, setRole] = useState<string | null>(null)
  const [userLocation, setUserLocation] = useState<string>("")
  const [userId, setUserId] = useState<string>("")
  const [collapsed, setCollapsed] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [petitions, setPetitions] = useState<Petition[]>([])

  useEffect(() => {
    const token = localStorage.getItem("token")
    const storedRole = localStorage.getItem("userRole")

    if (!token) {
      router.replace("/login")
      return
    }

    if (storedRole) setRole(storedRole)

    const loadData = async () => {
      try {
        // Load user info
        const result = await getCurrentUser(token)
        const user = result.user
        setRole(user.role)
        setUserLocation(user.location)
        setUserId(user.id)
        localStorage.setItem("userRole", user.role)
        localStorage.setItem("userName", user.name)
        localStorage.setItem("userLocation", user.location)
        localStorage.setItem("userId", user.id)

        // Load petitions — officials see only their location
        const params: Record<string, string> = {}
        if (user.role === "official") {
          params.location = user.location
        }
        const petitionData = await getPetitions(params)
        setPetitions(petitionData.petitions)
      } catch (error) {
        localStorage.clear()
        router.replace("/login")
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [router])

  const handleLogout = () => {
    localStorage.clear()
    router.push("/login")
  }

  if (isLoading && !role) return <DashboardLoading />

  // Compute real stats
  const totalCount = petitions.length
  const pendingCount = petitions.filter(p => p.status === "under_review" || p.status === "active").length
  const resolvedCount = petitions.filter(p => p.status === "resolved").length

  const menuItems = [
    { name: "Dashboard", icon: LayoutDashboard },
    {
      name: role === "official" ? "Manage Complaints" : "My Complaints",
      icon: ClipboardList,
    },
    { name: "Profile", icon: User },
  ]

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-indigo-200 via-purple-200 to-blue-200 text-gray-900">

      {/* Sidebar */}
      <aside
        className={`${collapsed ? "w-20" : "w-64"
          } bg-gradient-to-b from-indigo-500 to-purple-600 
        text-white p-4 flex flex-col transition-all duration-300 shadow-xl`}
      >
        <div className="flex items-center justify-between mb-8">
          {!collapsed && (
            <motion.h2
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xl font-bold tracking-wide truncate"
            >
              Grievance Portal
            </motion.h2>
          )}

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 hover:bg-white/20 rounded-lg transition"
            aria-label="Toggle Sidebar"
          >
            <Menu size={20} />
          </button>
        </div>

        <nav className="space-y-3 flex-1">
          {menuItems.map((item) => (
            <div
              key={item.name}
              className="flex items-center gap-3 p-3 rounded-lg 
                         hover:bg-white/20 cursor-pointer transition-all duration-300"
            >
              <item.icon size={20} />
              {!collapsed && <span>{item.name}</span>}
            </div>
          ))}
        </nav>

        <div className="space-y-4 border-t border-white/10 pt-4">
          {!collapsed && (
            <div className="text-sm text-white/80">
              Logged in as <span className="font-semibold capitalize">{role}</span>
            </div>
          )}

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-red-200 hover:text-white transition w-full p-2"
          >
            <LogOut size={18} />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10 overflow-y-auto">
        <div className="mb-12">
          <h1 className="text-4xl font-bold">
            Welcome back 👋
          </h1>
          <p className="text-gray-600 mt-2">
            Here's an overview of your <span className="font-medium text-indigo-600">{role}</span> activity.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { label: "Total", count: totalCount, icon: LayoutDashboard, color: "text-indigo-400" },
            { label: "Pending", count: pendingCount, icon: ClipboardList, color: "text-yellow-500" },
            { label: "Resolved", count: resolvedCount, icon: CheckCircle, color: "text-green-500" }
          ].map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              className="p-8 bg-white rounded-2xl shadow-md border border-gray-100"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-gray-500 text-lg font-medium">
                    {role === "official" ? `${item.label} Cases` : `${item.label} Complaints`}
                  </h3>
                  <p className="text-5xl font-bold text-gray-800 mt-4">
                    {item.count}
                  </p>
                </div>
                <item.icon size={32} className={item.color} />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Petition Section */}
        <div className="mt-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">
              {role === "official" ? "Petitions in Your Area" : "Active Petitions"}
            </h2>
            {role === "citizen" && (
              <button
                onClick={() => router.push("/petitions/create")}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-indigo-700 transition"
              >
                + Create Petition
              </button>
            )}
          </div>

          {petitions.length === 0 ? (
            <div className="bg-white rounded-xl p-8 text-center text-gray-500 shadow-md">
              <p>No petitions found.</p>
              {role === "citizen" && (
                <button
                  onClick={() => router.push("/petitions/create")}
                  className="mt-4 text-indigo-600 hover:underline"
                >
                  Create your first petition →
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              {petitions.map((petition) => (
                <div
                  key={petition._id}
                  className="p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition cursor-pointer"
                  onClick={() => router.push(`/petitions/${petition._id}`)}
                >
                  <div className="flex items-start justify-between">
                    <h3 className="text-xl font-semibold">
                      {petition.title}
                    </h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${petition.status === "active" ? "bg-green-100 text-green-700" :
                        petition.status === "under_review" ? "bg-yellow-100 text-yellow-700" :
                          petition.status === "resolved" ? "bg-blue-100 text-blue-700" :
                            "bg-gray-100 text-gray-700"
                      }`}>
                      {petition.status.replace("_", " ")}
                    </span>
                  </div>

                  <div className="mt-2 flex gap-4 text-sm text-gray-500">
                    <span>📍 {petition.location}</span>
                    <span>📂 {petition.category.replace("_", " ")}</span>
                  </div>

                  <p className="text-indigo-600 font-bold mt-2">
                    ✍️ {petition.signatureCount ?? petition.signatures?.length ?? 0} signatures
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Poll Section */}
<div className="mt-16">

  <h2 className="text-2xl font-bold mb-6">
    Community Polls
  </h2>

  {/* Citizens can vote */}
  {role === "citizen" && (
    <div className="mb-10">
      <VotePoll role={role} />
    </div>
  )}

  {/* Officials can create polls */}
  {role === "official" && (
    <div>
      <CreatePoll role={role} />
    </div>
  )}

</div>
      </main>
    </div>
  )
}

