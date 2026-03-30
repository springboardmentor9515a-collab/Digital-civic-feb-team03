"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getPetitionById, respondToPetition, type Petition } from "@/lib/api";
import { ArrowLeft, CheckCircle2, Loader2, MessageSquare } from "lucide-react";
import { motion } from "framer-motion";

export default function PetitionDetail() {
  const { id } = useParams();
  const router = useRouter();

  const [petition, setPetition] = useState<Petition | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const [comment, setComment] = useState("");
  const [status, setStatus] = useState("under_review");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const roleOpt = localStorage.getItem("userRole");
    setRole(roleOpt);

    const loadData = async () => {
      try {
        const data = await getPetitionById(id as string);
        setPetition(data);
        if (data.status) setStatus(data.status);
        if (data.officialResponse) setComment(data.officialResponse);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id]);

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      setMessage("");
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Not authenticated");

      const response = await respondToPetition(token, id as string, comment, status);
      setPetition(response.petition);
      setMessage("✅ Response submitted successfully");
      setTimeout(() => setMessage(""), 3000);
    } catch (err: any) {
      setMessage(`❌ Error: ${err.message || "Failed to submit"}`);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-blue-100 flex items-center justify-center p-6">
        <Loader2 className="animate-spin text-indigo-500" size={48} />
      </div>
    );
  }

  if (!petition) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-blue-100 flex items-center justify-center p-6">
        <div className="text-xl text-gray-700">Petition not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-blue-100 py-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto space-y-8">
        
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 transition-colors font-medium"
        >
          <ArrowLeft size={20} /> Back to Dashboard
        </button>

        {/* PETITION CARD */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-8 rounded-3xl shadow-xl border border-white/60"
        >
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 leading-tight">
                {petition.title}
              </h1>
              <div className="mt-2 flex items-center gap-3 text-sm text-gray-500 font-medium">
                <span className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full border border-indigo-100">
                  {petition.category.replace("_", " ")}
                </span>
                <span className="flex items-center gap-1">📍 {petition.location}</span>
              </div>
            </div>
            <span className={`px-4 py-1.5 rounded-full text-sm font-semibold whitespace-nowrap border ${getStatusColor(petition.status)}`}>
              {petition.status.replace("_", " ").toUpperCase()}
            </span>
          </div>

          <p className="text-gray-700 text-lg leading-relaxed mb-6">
            {petition.description}
          </p>

          <div className="flex flex-wrap items-center gap-6 pt-6 border-t border-gray-100 text-gray-600">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-400 to-indigo-500 flex items-center justify-center text-white font-bold text-sm shadow-sm">
                {petition.creator?.name?.[0]?.toUpperCase() || "U"}
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">{petition.creator?.name || "Unknown User"}</p>
                <p className="text-xs">Creator</p>
              </div>
            </div>
            <div className="h-8 w-px bg-gray-200"></div>
            <div>
              <p className="text-sm font-semibold text-gray-900">{petition.signatureCount ?? petition.signatures?.length ?? 0}</p>
              <p className="text-xs">Signatures</p>
            </div>
            <div className="h-8 w-px bg-gray-200"></div>
            <div>
              <p className="text-sm font-semibold text-gray-900">{new Date(petition.createdAt).toLocaleDateString()}</p>
              <p className="text-xs">Created At</p>
            </div>
          </div>
        </motion.div>

        {/* RESPONSE SECTION */}
        {(role === "official" || petition.officialResponse) && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white p-8 rounded-3xl shadow-xl border border-white/60 relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-indigo-500 to-purple-600"></div>
            
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 bg-indigo-50 rounded-xl text-indigo-600">
                <MessageSquare size={24} />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">
                Official Response
              </h2>
            </div>

            {role === "official" ? (
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold flex items-center gap-2 text-gray-700 mb-2">Update Response</label>
                  <textarea
                    placeholder="Write your official response..."
                    className="w-full p-4 border border-gray-200 bg-gray-50 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors min-h-[120px] resize-y"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Update Status</label>
                  <select
                    className="w-full p-3 border border-gray-200 bg-gray-50 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors appearance-none"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                  >
                    <option value="active">Active</option>
                    <option value="under_review">Under Review</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>

                <div className="pt-2">
                  <button
                    onClick={handleSubmit}
                    disabled={submitting}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold px-8 py-3 rounded-xl shadow-lg shadow-indigo-200 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {submitting ? <Loader2 size={20} className="animate-spin" /> : <CheckCircle2 size={20} />}
                    Submit Response
                  </button>
                </div>

                {message && (
                  <motion.p 
                    initial={{ opacity: 0, y: -10 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    className={`mt-4 font-medium ${message.includes("❌") ? "text-red-500" : "text-emerald-600"}`}
                  >
                    {message}
                  </motion.p>
                )}
              </div>
            ) : (
              // CITIZEN VIEW (READ-ONLY)
              <div className="space-y-4">
                <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                  <p className="text-gray-800 text-lg whitespace-pre-wrap leading-relaxed">
                    {petition.officialResponse || "No official response yet."}
                  </p>
                </div>
                {petition.respondedAt && (
                  <div className="flex items-center gap-2 text-sm text-gray-500 font-medium px-2">
                    <span>Responded on {new Date(petition.respondedAt).toLocaleDateString()}</span>
                    {petition.respondedBy?.name && (
                      <>
                        <span>•</span>
                        <span>By {petition.respondedBy.name}</span>
                      </>
                    )}
                  </div>
                )}
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}

function getStatusColor(status: string) {
  switch (status) {
    case "active": return "bg-green-50 text-emerald-700 border-emerald-200/60";
    case "under_review": return "bg-amber-50 text-amber-700 border-amber-200/60";
    case "closed": return "bg-gray-100 text-gray-700 border-gray-200";
    default: return "bg-gray-100 text-gray-700 border-gray-200";
  }
}