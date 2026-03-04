"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getPetitionById, signPetition as signPetitionApi, type Petition } from "@/lib/api";

export default function PetitionDetail() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [petition, setPetition] = useState<Petition | null>(null);
  const [loading, setLoading] = useState(true);
  const [signing, setSigning] = useState(false);
  const [signMessage, setSignMessage] = useState("");
  const [signError, setSignError] = useState("");

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const role = typeof window !== "undefined" ? localStorage.getItem("userRole") : null;
  const userId = typeof window !== "undefined" ? localStorage.getItem("userId") : null;

  // Fetch petition
  useEffect(() => {
    if (!id) return;

    const fetchPetition = async () => {
      try {
        const data = await getPetitionById(id);
        setPetition(data);
      } catch {
        setPetition(null);
      } finally {
        setLoading(false);
      }
    };

    fetchPetition();
  }, [id]);

  // Sign petition handler
  const handleSign = async () => {
    if (!token) {
      router.push("/login");
      return;
    }

    try {
      setSigning(true);
      setSignError("");
      setSignMessage("");

      await signPetitionApi(token, id);
      setSignMessage("✅ Petition signed successfully!");

      // Refresh petition data to update signature count
      const updated = await getPetitionById(id);
      setPetition(updated);
    } catch (err: any) {
      setSignError(err.message || "Failed to sign petition");
    } finally {
      setSigning(false);
    }
  };

  const statusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-700";
      case "under_review": return "bg-yellow-100 text-yellow-700";
      case "resolved": return "bg-blue-100 text-blue-700";
      case "rejected": return "bg-red-100 text-red-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-200 via-purple-200 to-blue-200">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading petition...</p>
        </div>
      </div>
    );
  }

  if (!petition) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-200 via-purple-200 to-blue-200">
        <div className="text-center">
          <p className="text-2xl font-bold text-gray-700">Petition not found</p>
          <button
            onClick={() => router.push("/petitions")}
            className="mt-4 text-indigo-600 hover:underline"
          >
            ← Back to petitions
          </button>
        </div>
      </div>
    );
  }

  const signatureCount = petition.signatureCount ?? petition.signatures?.length ?? 0;
  const canSign = role === "citizen" && petition.status === "active";

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-200 via-purple-200 to-blue-200 p-10">
      <div className="max-w-3xl mx-auto">

        {/* Back button */}
        <button
          onClick={() => router.push("/petitions")}
          className="text-indigo-600 hover:underline mb-6 inline-block"
        >
          ← Back to petitions
        </button>

        <div className="bg-white p-8 rounded-2xl shadow-lg">

          <div className="flex items-start justify-between mb-4">
            <h1 className="text-3xl font-bold text-gray-800">
              {petition.title}
            </h1>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColor(petition.status)}`}>
              {petition.status.replace("_", " ")}
            </span>
          </div>

          <p className="text-gray-600 mb-6 leading-relaxed">
            {petition.description}
          </p>

          <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
            <div className="bg-gray-50 p-3 rounded-lg">
              <span className="text-gray-500">📍 Location</span>
              <p className="font-semibold text-gray-800">{petition.location}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <span className="text-gray-500">📂 Category</span>
              <p className="font-semibold text-gray-800">{petition.category.replace("_", " ")}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <span className="text-gray-500">✍️ Signatures</span>
              <p className="font-semibold text-indigo-600 text-lg">{signatureCount}</p>
            </div>
            {petition.creator && (
              <div className="bg-gray-50 p-3 rounded-lg">
                <span className="text-gray-500">👤 Created by</span>
                <p className="font-semibold text-gray-800">{petition.creator.name}</p>
              </div>
            )}
          </div>

          {/* Sign button - citizens only, active petitions only */}
          {canSign && (
            <div className="border-t pt-6">
              <button
                onClick={handleSign}
                disabled={signing}
                className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition disabled:opacity-50"
              >
                {signing ? "Signing..." : "✍️ Sign this Petition"}
              </button>

              {signMessage && (
                <p className="mt-3 text-green-600 font-medium">{signMessage}</p>
              )}
              {signError && (
                <p className="mt-3 text-red-600 font-medium">{signError}</p>
              )}
            </div>
          )}

          {role === "official" && (
            <div className="border-t pt-6">
              <p className="text-gray-500 italic">Officials cannot sign petitions.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}