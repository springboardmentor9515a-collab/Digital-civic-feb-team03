"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

interface Petition {
  id: number
  title: string
  category: string
  location: string
  status: string
  signatures: number
}

export default function PetitionList() {
  const router = useRouter()
  const [petitions, setPetitions] = useState<Petition[]>([])

  useEffect(() => {
    // Temporary dummy data
    setPetitions([
      {
        id: 1,
        title: "Save Local Park",
        category: "Environment",
        location: "New York",
        status: "Active",
        signatures: 89,
      },
      {
        id: 2,
        title: "Improve School Facilities",
        category: "Education",
        location: "California",
        status: "Active",
        signatures: 120,
      },
    ])
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-200 via-purple-200 to-blue-200 p-10">
      <h1 className="text-3xl font-bold mb-8">Active Petitions</h1>

      <div className="grid gap-6">
        {petitions.map((petition) => (
          <div
            key={petition.id}
            onClick={() => router.push(`/petitions/${petition.id}`)}
            className="bg-white p-6 rounded-2xl shadow-md cursor-pointer hover:shadow-lg transition"
          >
            <h2 className="text-xl font-semibold">
              {petition.title}
            </h2>

            <div className="mt-3 text-gray-600 space-y-1">
              <p>Category: {petition.category}</p>
              <p>Location: {petition.location}</p>
              <p>Status: {petition.status}</p>
              <p>Signatures: {petition.signatures}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}