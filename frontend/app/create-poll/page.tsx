"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createPoll, getCurrentUser, getLocations } from "@/lib/api"

export default function CreatePoll() {
  const router = useRouter()

  const [title, setTitle] = useState("")
  const [location, setLocation] = useState("")
  const [options, setOptions] = useState(["", ""])
  const [availableLocations, setAvailableLocations] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    const checkRole = async () => {
      try {
        const token = localStorage.getItem("token")
        if (!token) {
          router.push("/login")
          return
        }

        const userRes = await getCurrentUser(token)
        if (userRes.user.role !== "official") {
          router.push("/polls")
          return
        }

        const locRes = await getLocations(token)
        setAvailableLocations(locRes.locations)
      } catch {
        router.push("/login")
      }
    }

    checkRole()
  }, [router])

  const addOption = () => {
    setOptions([...options, ""])
  }

  const removeOption = (index: number) => {
    const newOptions = [...options]
    newOptions.splice(index, 1)
    setOptions(newOptions)
  }

  const handleOptionChange = (value: string, index: number) => {
    const newOptions = [...options]
    newOptions[index] = value
    setOptions(newOptions)
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault()

    const validOptions = options.filter(o => o.trim() !== "")
    if (validOptions.length < 2) {
      setError("At least 2 non-empty options required")
      return
    }

    setLoading(true)

    try {
      const token = localStorage.getItem("token")
      if (!token) throw new Error("Authentication required")

      await createPoll(token, {
        title,
        targetLocation: location,
        options: validOptions
      })

      alert("Poll Created Successfully")
      router.push("/polls")

    } catch (err: any) {
      setError(err.message || "Failed to create poll")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-200 via-purple-200 to-blue-200 flex items-center justify-center p-6">

      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">

        {/* Header */}
        <div className="flex flex-col items-center mb-6">
          <div className="text-3xl mb-2">🗳️</div>
          <h2 className="text-2xl font-bold text-black">Create Poll</h2>
        </div>

        {error && (
          <p className="text-red-500 text-center mb-4">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Title */}
          <input
            type="text"
            placeholder="Enter poll title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            required
          />

          {/* Location */}
          <select
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-indigo-400"
            required
          >
            <option value="">Select Location</option>

            {availableLocations.map((loc, idx) => (
              <option key={idx} value={loc}>
                {loc}
              </option>
            ))}

            {availableLocations.length === 0 && (
              <option disabled>Loading locations...</option>
            )}
          </select>

          {/* Options */}
          <div className="space-y-3">
            {options.map((option, index) => (
              <div key={index} className="flex gap-2">

                <input
                  type="text"
                  placeholder={`Option ${index + 1}`}
                  value={option}
                  onChange={(e) =>
                    handleOptionChange(e.target.value, index)
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  required
                />

                {options.length > 2 && (
                  <button
                    type="button"
                    onClick={() => removeOption(index)}
                    className="text-red-500 text-sm"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}

            <button
              type="button"
              onClick={addOption}
              className="text-blue-600 text-sm"
            >
              + Add Option
            </button>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white p-3 rounded-lg font-medium hover:opacity-90 transition"
          >
            {loading ? "Creating..." : "Create Poll"}
          </button>

        </form>

      </div>
    </div>
  )
}