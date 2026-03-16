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
        const token = localStorage.getItem("token");
        if (!token) {
          router.push("/login");
          return;
        }
        const userRes = await getCurrentUser(token);
        if (userRes.user.role !== "official") {
          router.push("/polls");
          return;
        }

        const locRes = await getLocations(token);
        setAvailableLocations(locRes.locations);
      } catch {
        router.push("/login");
      }
    };
    checkRole();
  }, [router]);

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
    <div className="min-h-screen bg-gradient-to-br from-indigo-200 via-purple-200 to-blue-200 p-10">

      <h2 className="text-2xl font-bold mb-6">Create Poll</h2>

      {error && <p className="text-red-500">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">

        <input
          type="text"
          placeholder="Poll Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded bg-white text-black"
          required
        />

        <select
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded bg-white text-black"
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

        {/* Poll Options */}

        <div>
          <label className="font-semibold">Options</label>

          {options.map((option, index) => (
            <div key={index} className="flex gap-2 mt-2">

              <input
                type="text"
                placeholder={`Option ${index + 1}`}
                value={option}
                onChange={(e) =>
                  handleOptionChange(e.target.value, index)
                }
                className="w-full p-3 border border-gray-300 rounded bg-white text-black"
                required
              />

              {options.length > 2 && (
                <button
                  type="button"
                  onClick={() => removeOption(index)}
                  className="text-red-500"
                >
                  Remove
                </button>
              )}
            </div>
          ))}

          <button
            type="button"
            onClick={addOption}
            className="mt-3 text-blue-600"
          >
            + Add Option
          </button>

        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 text-white p-3 rounded-lg"
        >
          {loading ? "Creating..." : "Create Poll"}
        </button>

      </form>

    </div>
  )
}