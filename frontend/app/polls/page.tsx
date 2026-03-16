"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { getPolls, getCurrentUser, Poll } from "@/lib/api"

export default function PollsPage() {

  const router = useRouter()
  const [polls, setPolls] = useState<Poll[]>([])
  const [role, setRole] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchPolls = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          router.push("/login");
          return;
        }
        const userRes = await getCurrentUser(token);
        setRole(userRes.user.role);

        const data = await getPolls(token);
        setPolls(data.polls);
      } catch (err: any) {
        setError(err.message || "Failed to fetch polls");
      } finally {
        setLoading(false);
      }
    };

    fetchPolls();
  }, [router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-blue-100 py-12 px-6">

      <div className="max-w-2xl mx-auto">

        <h2 className="text-3xl font-bold text-center text-gray-800 mb-10">
          Community Polls
        </h2>

        {loading && <p className="text-center">Loading polls...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}

        {!loading && !error && polls.length === 0 && (
          <p className="text-center text-gray-600">No polls available.</p>
        )}

        <div className="space-y-5">

          {polls.map((poll) => (

            <div
              key={poll._id}
              className="bg-white rounded-xl shadow-md p-5 hover:shadow-lg transition-all duration-300"
            >

              {/* Poll Title */}
              <h3 className="text-lg font-semibold text-gray-800">
                {poll.title}
              </h3>

              {/* Location + Votes */}
              <div className="flex justify-between items-center mt-3">

                <span className="text-xs bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full">
                  📍 {poll.targetLocation}
                </span>

                <span className="text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded-full">
                  🗳 {poll.totalVotes || 0} Votes
                </span>

              </div>

              {/* Buttons */}
              <div className="flex gap-3 mt-5">

                {role === "citizen" && (
                  <button
                    onClick={() => router.push(`/polls/${poll._id}/vote`)}
                    className="flex-1 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm"
                  >
                    Vote
                  </button>
                )}

                <button
                  onClick={() => router.push(`/polls/${poll._id}/results`)}
                  className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm"
                >
                  View Results
                </button>

              </div>

            </div>

          ))}

        </div>

      </div>

    </div>
  )
}