"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { getPollById, Poll } from "@/lib/api"

export default function PollResultsPage() {
  const router = useRouter()
  const params = useParams()
  const pollId = params.id as string

  const [poll, setPoll] = useState<Poll | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchPoll = async () => {
      try {
        const token = localStorage.getItem("token")
        if (!token) {
          router.push("/login")
          return
        }

        const pollData = await getPollById(token, pollId)
        setPoll(pollData)
      } catch (err: any) {
        setError(err.message || "Failed to load poll results")
      } finally {
        setLoading(false)
      }
    }

    if (pollId) {
      fetchPoll()
    }
  }, [pollId, router])

  if (loading) return <div className="text-center mt-20">Loading results...</div>
  if (error) return <div className="text-center mt-20 text-red-500">{error}</div>
  if (!poll) return <div className="text-center mt-20">Poll not found</div>

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">{poll.title}</h2>
        <div className="flex justify-between text-sm text-gray-500 mb-8 border-b pb-4">
          <span>Target Location: {poll.targetLocation}</span>
          <span>Total Votes: {poll.totalVotes || 0}</span>
        </div>

        <div className="space-y-6">
          {poll.results?.map((result, index) => (
            <div key={index} className="relative pt-1">
              <div className="flex mb-2 items-center justify-between">
                <div>
                  <span className="text-base font-semibold inline-block text-gray-700">
                    {result.option}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-semibold inline-block text-indigo-600">
                    {result.percentage}% ({result.votes} votes)
                  </span>
                </div>
              </div>
              <div className="overflow-hidden h-3 mb-4 text-xs flex rounded-full bg-indigo-100">
                <div
                  style={{ width: `${result.percentage}%` }}
                  className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-indigo-500 transition-all duration-1000"
                ></div>
              </div>
            </div>
          ))}
          {(!poll.results || poll.results.length === 0) && (
            <p className="text-gray-500 italic text-center py-4">No votes have been cast yet.</p>
          )}
        </div>

        <div className="mt-10 flex justify-center">
          <button
            onClick={() => router.push("/polls")}
            className="bg-indigo-600 text-white py-2 px-8 rounded-full hover:bg-indigo-700 font-medium shadow transition-colors"
          >
            Back to Polls
          </button>
        </div>
      </div>
    </div>
  )
}