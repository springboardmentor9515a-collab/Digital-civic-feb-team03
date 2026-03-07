"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createPetition, type PetitionCategory } from "@/lib/api"

const CATEGORIES: { value: PetitionCategory; label: string }[] = [
  { value: "infrastructure", label: "Infrastructure" },
  { value: "environment", label: "Environment" },
  { value: "public_safety", label: "Public Safety" },
  { value: "education", label: "Education" },
  { value: "healthcare", label: "Healthcare" },
  { value: "other", label: "Other" },
]

export default function CreatePetitionPage() {
  const router = useRouter()

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState<PetitionCategory | "">("")
  const [location, setLocation] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem("token")
    const role = localStorage.getItem("userRole")

    if (!token) {
      router.replace("/login")
      return
    }

    // Only citizens can create petitions
    if (role && role !== "citizen") {
      router.replace("/dashboard")
      return
    }

    // Auto-fill location from user profile
    const userLocation = localStorage.getItem("userLocation")
    if (userLocation) setLocation(userLocation)
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!title || !description || !category || !location) {
      setError("⚠️ Please fill all fields")
      return
    }

    const token = localStorage.getItem("token")
    if (!token) {
      setError("❌ You must be logged in")
      router.replace("/login")
      return
    }

    try {
      setLoading(true)
      setError("")
      setSuccess("")

      await createPetition(token, {
        title,
        description,
        category: category as PetitionCategory,
        location,
      })

      setSuccess("🎉 Petition created successfully!")

      setTimeout(() => {
        router.push("/petitions")
      }, 1500)
    } catch (err: any) {
      setError(err.message || "❌ Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-200 via-purple-200 to-blue-200 p-4">

      {/* Form Container */}
      <div className="bg-gray-100 w-[500px] min-h-[500px] p-8 rounded-xl shadow-2xl">

        <h1 className="text-3xl font-bold text-center text-black mb-8">
          📝 Create Petition
        </h1>

        {error && (
          <p className="text-red-500 text-center mb-4 font-medium">{error}</p>
        )}

        {success && (
          <p className="text-green-600 text-center mb-4 font-medium">{success}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Title */}
          <div>
            <label className="block mb-2 font-semibold text-black">
              Petition Title
            </label>
            <input
              type="text"
              placeholder="Enter petition title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-3 border border-gray-600 rounded-lg bg-white text-black placeholder-gray-400 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block mb-2 font-semibold text-black">
              Description
            </label>
            <textarea
              rows={4}
              placeholder="Enter detailed description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3 border border-gray-600 rounded-lg bg-white text-black placeholder-gray-400 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block mb-2 font-semibold text-black">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as PetitionCategory)}
              className="w-full p-3 border border-gray-600 rounded-lg bg-white text-black focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="">
                Select Category
              </option>
              {CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>

          {/* Location */}
          <div>
            <label className="block mb-2 font-semibold text-black">
              Location
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Enter location"
              className="w-full p-3 border border-gray-600 rounded-lg bg-white text-black placeholder-gray-400 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white p-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-200 disabled:opacity-50"
          >
            {loading ? "⏳ Creating..." : "🚀 Submit Petition"}
          </button>

        </form>
      </div>
    </div>
  )
}