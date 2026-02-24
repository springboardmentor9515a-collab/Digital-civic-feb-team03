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

      {/* Dark Container */}
      <div className="bg-gray-100 w-[500px] min-h-[500px] p-8 rounded-xl shadow-2xl">

        <h1 className="text-3xl font-bold text-center text-black mb-8">
          📝 Create Petition
        </h1>

        {error && (
          <p className="text-red-500 text-center mb-4 font-medium">{error}</p>
        )}

        {success && (
          <p className="text-green-400 text-center mb-4 font-medium">{success}</p>
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
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-3 border border-gray-600 rounded-lg bg-white text-black focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="" className="bg-black text-white">
                Select Category
              </option>
              <option value="Education" className="bg-black text-white">
                Education
              </option>
              <option value="Environment" className="bg-black text-white">
                Environment
              </option>
              <option value="Health" className="bg-black text-white">
                Health
              </option>
              <option value="Infrastructure" className="bg-black text-white">
                Infrastructure
              </option>
              <option value="Other" className="bg-black text-white">
                Other
              </option>
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