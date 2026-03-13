"use client"

import { useState } from "react"

export default function CreatePoll({ role }: { role: string }) {
  const [question, setQuestion] = useState("")

  if (role !== "official") return null

  const handleCreate = () => {
    console.log("Poll Created:", question)
    setQuestion("")
  }

  return (
    <div className="p-4 bg-white rounded-lg shadow mt-6">
      <h3 className="text-lg font-semibold mb-2">Create Poll</h3>

      <input
        type="text"
        placeholder="Enter poll question"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        className="border p-2 rounded w-full mb-3"
      />

      <button
        onClick={handleCreate}
        className="px-4 py-2 bg-green-600 text-white rounded"
      >
        Create Poll
      </button>
    </div>
  )
}
