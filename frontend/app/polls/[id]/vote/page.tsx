"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { getPollById, getCurrentUser, voteOnPoll, Poll } from "@/lib/api"

export default function VotePage() {
  const router = useRouter()
  const params = useParams()
  const pollId = params.id as string

  const [poll, setPoll] = useState<Poll | null>(null)
  const [selectedOption, setSelectedOption] = useState("")
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  useEffect(() => {
    const fetchPollAndUser = async () => {
      try {
        const token = localStorage.getItem("token")
        if (!token) {
          router.push("/login")
          return
        }

        const userRes = await getCurrentUser(token)
        if (userRes.user.role !== "citizen") {
          router.push("/polls")
          return
        }

        const pollData = await getPollById(token, pollId)
        setPoll(pollData)
      } catch (err: any) {
        setError(err.message || "Failed to load poll")
      } finally {
        setLoading(false)
      }
    }

    if (pollId) {
      fetchPollAndUser()
    }
  }, [pollId, router])

  const handleVote = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedOption) {
      setError("Please select an option")
      return
    }

    setSubmitting(true)
    setError("")
    try {
      const token = localStorage.getItem("token")
      if (!token) throw new Error("No token available")

      await voteOnPoll(token, pollId, selectedOption)
      setSuccess("Your vote has been recorded successfully!")
      setTimeout(() => {
        router.push(`/polls/${pollId}/results`)
      }, 2000)
    } catch (err: any) {
      setError(err.message || "Failed to submit vote. You may have already voted.")
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <div className="text-center mt-20">Loading...</div>
  if (error && !poll) return <div className="text-center mt-20 text-red-500">{error}</div>
  if (!poll) return <div className="text-center mt-20">Poll not found</div>

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl mx-auto bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">{poll.title}</h2>
        <p className="text-sm text-gray-500 mb-6">Target Location: {poll.targetLocation}</p>

        {error && <div className="bg-red-50 text-red-500 p-3 rounded mb-4">{error}</div>}
        {success && <div className="bg-green-50 text-green-500 p-3 rounded mb-4">{success}</div>}

        <form onSubmit={handleVote}>
          <div className="space-y-4">
            {poll.options.map((option, index) => (
              <label key={index} className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  name="pollOption"
                  value={option}
                  checked={selectedOption === option}
                  onChange={() => setSelectedOption(option)}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-gray-700 font-medium">{option}</span>
              </label>
            ))}
          </div>

          <div className="mt-8 flex gap-4">
            <button
              type="submit"
              disabled={submitting || !!success}
              className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 disabled:bg-gray-400 font-medium transition-colors"
            >
              {submitting ? "Submitting..." : "Submit Vote"}
            </button>
            <button
              type="button"
              onClick={() => router.push("/polls")}
              className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 font-medium transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
