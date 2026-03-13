"use client"

import { useState } from "react"

export default function VotePoll({ role }: { role: string }) {
  const [voted, setVoted] = useState(false)

  const handleVote = () => {
    setVoted(true)
  }

  if (role !== "citizen") return null

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-2">Community Poll</h3>

      <button
        onClick={handleVote}
        disabled={voted}
        className="px-4 py-2 bg-indigo-500 text-white rounded disabled:bg-gray-400"
      >
        {voted ? "Already Voted" : "Vote"}
      </button>
    </div>
  )
}
