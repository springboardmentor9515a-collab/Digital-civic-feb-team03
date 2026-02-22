"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

export default function CreatePetition() {
  const router = useRouter()

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("")
  const [location, setLocation] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLocation("New York")
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!title || !description || !category || !location) {
      setError("⚠️ Please fill all fields")
      return
    }

    try {
      setLoading(true)
      setError("")
      setSuccess("")

      await new Promise((resolve) => setTimeout(resolve, 1500))

      setSuccess("🎉 Petition created successfully!")

      setTimeout(() => {
        router.push("/petitions")
      }, 1500)

    } catch {
      setError("❌ Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-200 via-purple-200 to-blue-200 p-4">

      {/* Square Grey Box */}
      <div className="bg-gray-100 w-[500px] min-h-[500px] p-8 rounded-xl shadow-2xl">

        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
          📝 Create Petition
        </h1>

        {error && (
          <p className="text-red-600 text-center mb-4 font-medium">{error}</p>
        )}

        {success && (
          <p className="text-green-600 text-center mb-4 font-medium">{success}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Title */}
          <div>
            <label className="block mb-2 font-semibold text-gray-700">
              Petition Title
            </label>
            <input
              type="text"
              placeholder="Enter petition title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-3 border border-gray-400 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block mb-2 font-semibold text-gray-700">
              Description
            </label>
            <textarea
              rows={4}
              placeholder="Enter detailed description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3 border border-gray-400 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block mb-2 font-semibold text-gray-700">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-3 border border-gray-400 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="">Select Category</option>
              <option value="Education">Education</option>
              <option value="Environment">Environment</option>
              <option value="Health">Health</option>
              <option value="Infrastructure">Infrastructure</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Location */}
          <div>
            <label className="block mb-2 font-semibold text-gray-700">
              Location
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full p-3 border border-gray-400 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 outline-none"
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