"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function Error({
  error,
  reset,
}: {
  error: Error
  reset: () => void
}) {
  const router = useRouter()

  useEffect(() => {
    console.error("Dashboard Error:", error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white p-6">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-10 max-w-md w-full text-center shadow-xl">

        <h2 className="text-2xl font-bold text-red-500 mb-4">
          Something went wrong 🚨
        </h2>

        <p className="text-slate-400 mb-6">
          {error.message || "Unexpected error occurred."}
        </p>

        <div className="flex justify-center gap-4">

          <button
            onClick={reset}
            className="bg-blue-600 hover:bg-blue-700 transition px-5 py-2 rounded-lg"
          >
            Try Again
          </button>

          <button
            onClick={() => router.push("/login")}
            className="bg-slate-800 hover:bg-slate-700 transition px-5 py-2 rounded-lg"
          >
            Go to Login
          </button>

        </div>
      </div>
    </div>
  )
}
