"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getPetitions, type Petition, type PetitionCategory, type PetitionStatus } from "@/lib/api"

export default function PetitionList() {
  const router = useRouter()
  const [petitions, setPetitions] = useState<Petition[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  // Filters
  const [filterLocation, setFilterLocation] = useState("")
  const [filterCategory, setFilterCategory] = useState("")
  const [filterStatus, setFilterStatus] = useState("")

  const role = typeof window !== "undefined" ? localStorage.getItem("userRole") : null

  const fetchPetitions = async () => {
    try {
      setLoading(true)
      setError("")
      const params: Record<string, string> = {}
      if (filterLocation) params.location = filterLocation
      if (filterCategory) params.category = filterCategory
      if (filterStatus) params.status = filterStatus

      const data = await getPetitions(params)
      setPetitions(data.petitions)
    } catch (err: any) {
      setError(err.message || "Failed to load petitions")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPetitions()
  }, [filterLocation, filterCategory, filterStatus])

  const categories: { value: PetitionCategory | ""; label: string }[] = [
    { value: "", label: "All Categories" },
    { value: "infrastructure", label: "Infrastructure" },
    { value: "environment", label: "Environment" },
    { value: "public_safety", label: "Public Safety" },
    { value: "education", label: "Education" },
    { value: "healthcare", label: "Healthcare" },
    { value: "other", label: "Other" },
  ]

  const statuses: { value: PetitionStatus | ""; label: string }[] = [
    { value: "", label: "All Statuses" },
    { value: "active", label: "Active" },
    { value: "under_review", label: "Under Review" },
    { value: "resolved", label: "Resolved" },
    { value: "rejected", label: "Rejected" },
  ]

  const statusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-700"
      case "under_review": return "bg-yellow-100 text-yellow-700"
      case "resolved": return "bg-blue-100 text-blue-700"
      case "rejected": return "bg-red-100 text-red-700"
      default: return "bg-gray-100 text-gray-700"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-200 via-purple-200 to-blue-200 p-10">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Petitions</h1>
          {role === "citizen" && (
            <button
              onClick={() => router.push("/petitions/create")}
              className="bg-indigo-600 text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-indigo-700 transition"
            >
              + Create Petition
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-8">
          <input
            type="text"
            placeholder="Filter by location..."
            value={filterLocation}
            onChange={(e) => setFilterLocation(e.target.value)}
            className="px-4 py-2.5 rounded-lg border border-gray-300 bg-white focus:ring-2 focus:ring-indigo-400 outline-none"
          />
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-2.5 rounded-lg border border-gray-300 bg-white focus:ring-2 focus:ring-indigo-400 outline-none"
          >
            {categories.map((c) => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2.5 rounded-lg border border-gray-300 bg-white focus:ring-2 focus:ring-indigo-400 outline-none"
          >
            {statuses.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </div>

        {/* Loading / Error */}
        {loading && (
          <div className="text-center py-16">
            <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading petitions...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Petition Cards */}
        {!loading && !error && (
          <div className="grid gap-6">
            {petitions.length === 0 ? (
              <div className="text-center py-16 text-gray-500">
                <p className="text-xl">No petitions found</p>
                <p className="mt-2">Try adjusting your filters or create a new petition.</p>
              </div>
            ) : (
              petitions.map((petition) => (
                <div
                  key={petition._id}
                  onClick={() => router.push(`/petitions/${petition._id}`)}
                  className="bg-white p-6 rounded-2xl shadow-md cursor-pointer hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
                >
                  <div className="flex items-start justify-between">
                    <h2 className="text-xl font-semibold text-gray-800">
                      {petition.title}
                    </h2>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColor(petition.status)}`}>
                      {petition.status.replace("_", " ")}
                    </span>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-4 text-gray-600 text-sm">
                    <span>📍 {petition.location}</span>
                    <span>📂 {petition.category.replace("_", " ")}</span>
                    <span>✍️ {petition.signatures?.length ?? petition.signatureCount ?? 0} signatures</span>
                    {petition.creator && (
                      <span>👤 {petition.creator.name}</span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  )
}