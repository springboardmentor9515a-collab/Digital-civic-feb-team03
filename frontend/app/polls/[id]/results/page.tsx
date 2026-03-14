"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

export default function PollsPage() {

  const router = useRouter()
  const [polls, setPolls] = useState<any[]>([])

  useEffect(() => {

    const dummyPolls = [
      {
        id: 1,
        title: "Should we add more street lights?",
        location: "Ward 1",
        totalVotes: 34
      },
      {
        id: 2,
        title: "Park renovation proposal",
        location: "Ward 2",
        totalVotes: 18
      },
      {
        id: 3,
        title: "Waste collection timing change",
        location: "Ward 3",
        totalVotes: 52
      }
    ]

    setPolls(dummyPolls)

  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-blue-100 py-12 px-6">

      <div className="max-w-2xl mx-auto">

        <h2 className="text-3xl font-bold text-center text-gray-800 mb-10">
          Community Polls
        </h2>

        <div className="space-y-5">

          {polls.map((poll) => (

            <div
              key={poll.id}
              className="bg-white rounded-xl shadow-md p-5 hover:shadow-lg transition-all duration-300"
            >

              {/* Poll Title */}
              <h3 className="text-lg font-semibold text-gray-800">
                {poll.title}
              </h3>

              {/* Location + Votes */}
              <div className="flex justify-between items-center mt-3">

                <span className="text-xs bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full">
                  📍 {poll.location}
                </span>

                <span className="text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded-full">
                  🗳 {poll.totalVotes} Votes
                </span>

              </div>

              {/* Buttons */}
              <div className="flex gap-3 mt-5">

                <button
                  onClick={() => router.push(`/polls/${poll.id}/vote`)}
                  className="flex-1 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm"
                >
                  Vote
                </button>

                <button
                  onClick={() => router.push(`/polls/${poll.id}/results`)}
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