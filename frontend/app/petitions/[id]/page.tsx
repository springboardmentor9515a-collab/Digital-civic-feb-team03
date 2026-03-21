"use client";

import { useState } from "react";
import { useParams } from "next/navigation";

export default function PetitionDetail() {
  const { id } = useParams();

  const petition = {
    id,
    title: "Road Repair Needed",
    description: "The road in our area is damaged and causing traffic issues.",
    status: "active",
    signatures: 120,
  };

  const [comment, setComment] = useState("");
  const [status, setStatus] = useState(petition.status);
  const [message, setMessage] = useState("");

  const handleSubmit = () => {
    try {
      console.log({ comment, status });
      setMessage("✅ Response submitted successfully");
    } catch {
      setMessage("❌ Error submitting response");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-200 via-purple-300 to-blue-300 flex items-center justify-center p-6">

      {/* CENTER CONTAINER */}
      <div className="w-full max-w-4xl">

        <h1 className="text-3xl font-bold mb-6 text-gray-900 text-center">
          Petition Details
        </h1>

        {/* PETITION CARD */}
        <div className="bg-white backdrop-blur-md p-6 rounded-2xl shadow-xl border border-white/40 mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">
            {petition.title}
          </h2>

          <p className="mt-2 text-gray-900">{petition.description}</p>

          <div className="mt-4 flex flex-wrap gap-6 text-gray-800 font-medium">
            <p>
              Status:{" "}
              <span className={`px-3 py-1 rounded-full ${getStatusColor(status)}`}>
                {status}
              </span>
            </p>

            <p>Signatures: {petition.signatures}</p>
          </div>
        </div>

        {/* RESPONSE SECTION */}
        <div className="bg-white backdrop-blur-md p-6 rounded-2xl shadow-xl border border-white/40">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 text-center">
            Official Response
          </h2>

          {/* TEXTAREA */}
          <textarea
            placeholder="Write your response..."
            className="w-full p-3 border border-gray-400 bg-white rounded-lg mb-4 text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-400"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />

          {/* DROPDOWN */}
          <select
            className="w-full p-2 border border-gray-400 bg-white rounded-lg mb-4 text-gray-900"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="under_review">Under Review</option>
            <option value="closed">Closed</option>
          </select>

          {/* BUTTON CENTERED */}
          <div className="flex justify-center">
            <button
              onClick={handleSubmit}
              className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-6 py-2 rounded-lg shadow hover:scale-105 transition"
            >
              Submit Response
            </button>
          </div>

          {/* MESSAGE */}
          {message && (
            <p className="mt-4 text-center font-medium text-green-600">
              {message}
            </p>
          )}
        </div>

      </div>
    </div>
  );
}

/* STATUS COLOR */
function getStatusColor(status: string) {
  switch (status) {
    case "active":
      return "bg-green-100 text-green-700";
    case "under_review":
      return "bg-yellow-100 text-yellow-700";
    case "closed":
      return "bg-red-100 text-red-700";
    default:
      return "";
  }
} 