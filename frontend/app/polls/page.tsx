
"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

export default function PollsPage() {

  const router = useRouter()

  const [polls, setPolls] = useState<any[]>([])

  useEffect(() => {

    // Dummy data for UI
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-200 via-purple-200 to-blue-200 p-10">

      <h2 className="text-3xl font-bold">Community Polls</h2>

      <div className="max-w-3xl mx-auto space-y-6 mt-6"></div>

      {polls.map((poll) => (

        <div
          key={poll.id}
          className="p-5 bg-white shadow rounded-lg cursor-pointer hover:shadow-lg mb-6"
        >

          <h3 className="text-xl font-semibold">{poll.title}</h3>

          <p className="text-gray-500">
            Location: {poll.location}
          </p>

          <p className="text-sm text-gray-600 mt-2">
            Total Votes: {poll.totalVotes}
          </p>

        </div>

      ))}

    </div>
  )
}