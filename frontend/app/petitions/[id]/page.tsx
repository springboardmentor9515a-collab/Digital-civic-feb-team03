"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

interface Petition {
  _id: string;
  title: string;
  description: string;
  location: string;
  category: string;
  status: string;
  signatures: { _id: string; signedAt: string }[];
}

export default function PetitionDetail() {
  const params = useParams();
  const id = params?.id as string;

  const [petition, setPetition] = useState<Petition | null>(null);
  const [loading, setLoading] = useState(true);

  // 🔵 SIGN FUNCTION
  const handleSign = async () => {
    if (!id) return;

    const res = await fetch(
      `http://localhost:5000/api/petitions/${id}/sign`,
      {
        method: "POST"
      }
    );

    const updated = await res.json();
    setPetition(updated);
  };

  // 🔵 FETCH PETITION
  useEffect(() => {
    if (!id) return;

    const fetchPetition = async () => {
      const res = await fetch(
        `http://localhost:5000/api/petitions/${id}`
      );
      const data = await res.json();
      setPetition(data);
      setLoading(false);
    };

    fetchPetition();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0f172a] text-white">
        Loading...
      </div>
    );
  }

  if (!petition) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0f172a] text-white">
        Petition not found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f172a] text-white p-10">
      <div className="max-w-3xl mx-auto bg-slate-800 p-8 rounded-xl shadow-lg">

        <h1 className="text-3xl font-bold mb-4">
          {petition.title}
        </h1>

        <p className="mb-6 text-gray-300">
          {petition.description}
        </p>

        <div className="space-y-2 mb-6">
          <p><strong>Location:</strong> {petition.location}</p>
          <p><strong>Category:</strong> {petition.category}</p>
          <p><strong>Status:</strong> {petition.status}</p>
          <p>
            <strong>Signatures:</strong>{" "}
            {petition.signatures.length}
          </p>
        </div>

        <button
          onClick={handleSign}
          className="bg-blue-600 px-6 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Sign Petition
        </button>

      </div>
    </div>
  );
}