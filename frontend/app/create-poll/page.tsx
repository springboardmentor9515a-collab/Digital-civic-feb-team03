"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function CreatePoll() {
  const router = useRouter()

  const [title, setTitle] = useState("")
  const [location, setLocation] = useState("")
  const [options, setOptions] = useState(["", ""])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

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

    if (options.length < 2) {
      setError("At least 2 options required")
      return
    }

    setLoading(true)

    try {
      const token = localStorage.getItem("token")

      const res = await fetch("http://localhost:5000/api/polls", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          title,
          location,
          options
        })
      })

      if (!res.ok) throw new Error()

      alert("Poll Created Successfully")

      router.push("/polls")
    } catch {
      setError("Failed to create poll")
    }

    setLoading(false)
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
          <option value="Ward 1">Ward 1</option>
          <option value="Ward 2">Ward 2</option>
          <option value="Ward 3">Ward 3</option>
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