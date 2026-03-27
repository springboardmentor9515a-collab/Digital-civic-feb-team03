"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, FileText, FileSpreadsheet, Filter, ArrowLeft, CheckCircle2, Loader2 } from "lucide-react";
import Link from "next/link";

export default function ExportPage() {
  const [format, setFormat] = useState("csv");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleExport = async () => {
    setLoading(true);
    setSuccess(false);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `http://localhost:5000/api/export/${format}?status=${status}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `report.${format}`;
      a.click();
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error("Export failed", err);
    } finally {
      setLoading(false);
    }
  };

  const formats = [
    {
      value: "csv",
      label: "CSV",
      description: "Spreadsheet-compatible, lightweight",
      icon: FileSpreadsheet,
      tag: "Mandatory",
      tagColor: "bg-indigo-100 text-indigo-700",
      iconColor: "text-emerald-500",
      border: "border-indigo-300",
      bg: "bg-indigo-50",
    },
    {
      value: "pdf",
      label: "PDF",
      description: "Formatted report, print-ready",
      icon: FileText,
      tag: "Optional",
      tagColor: "bg-purple-100 text-purple-700",
      iconColor: "text-rose-400",
      border: "border-purple-300",
      bg: "bg-purple-50",
    },
  ];

  const statuses = [
    { value: "", label: "All Statuses" },
    { value: "active", label: "Active" },
    { value: "under_review", label: "Under Review" },
    { value: "resolved", label: "Resolved" },
    { value: "closed", label: "Closed" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-blue-100 flex items-center justify-center px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-xl"
      >
        {/* Back link */}
        <Link href="/dashboard">
          <button className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 mb-8 text-sm font-medium transition group">
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            Back to Dashboard
          </button>
        </Link>

        <div className="bg-white rounded-3xl shadow-xl border border-white/80 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-8 py-8">
            <div className="flex items-center gap-4">
              <div className="bg-white/20 p-3 rounded-2xl">
                <Download size={28} className="text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white tracking-tight">Export Reports</h1>
                <p className="text-indigo-100 text-sm mt-0.5">
                  Download petition data in your preferred format
                </p>
              </div>
            </div>
          </div>

          <div className="px-8 py-8 space-y-8">
            {/* Format Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3 uppercase tracking-widest">
                Export Format
              </label>
              <div className="grid grid-cols-2 gap-4">
                {formats.map((f) => (
                  <motion.button
                    key={f.value}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setFormat(f.value)}
                    className={`relative p-4 rounded-2xl border-2 text-left transition-all duration-200 ${
                      format === f.value
                        ? `${f.border} ${f.bg} shadow-sm`
                        : "border-gray-200 bg-gray-50 hover:border-gray-300"
                    }`}
                  >
                    {format === f.value && (
                      <motion.span
                        layoutId="format-ring"
                        className="absolute inset-0 rounded-2xl ring-2 ring-offset-1 ring-indigo-400 pointer-events-none"
                      />
                    )}
                    <f.icon size={24} className={`mb-2 ${format === f.value ? f.iconColor : "text-gray-400"}`} />
                    <div className="font-bold text-gray-800 text-base">{f.label}</div>
                    <div className="text-gray-500 text-xs mt-0.5">{f.description}</div>
                    <span className={`inline-block mt-2 text-[10px] font-semibold px-2 py-0.5 rounded-full ${f.tagColor}`}>
                      {f.tag}
                    </span>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3 uppercase tracking-widest">
                <span className="inline-flex items-center gap-2">
                  <Filter size={14} />
                  Filter by Status
                </span>
              </label>
              <div className="flex flex-wrap gap-2">
                {statuses.map((s) => (
                  <button
                    key={s.value}
                    onClick={() => setStatus(s.value)}
                    className={`px-4 py-2 rounded-full text-sm font-medium border transition-all duration-200 ${
                      status === s.value
                        ? "bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-200"
                        : "bg-white text-gray-600 border-gray-200 hover:border-indigo-300 hover:text-indigo-600"
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Summary */}
            <div className="bg-gray-50 rounded-2xl px-5 py-4 border border-gray-100 text-sm text-gray-600 flex items-center justify-between">
              <span>
                Exporting <span className="font-semibold text-gray-800">{status || "all"}</span> petitions
                {" "}as <span className="font-semibold text-gray-800">.{format.toUpperCase()}</span>
              </span>
              <span className="text-xs text-gray-400 font-mono">report.{format}</span>
            </div>

            {/* Download Button */}
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={handleExport}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-indigo-500 to-purple-600 
                         hover:from-indigo-600 hover:to-purple-700 text-white font-semibold py-4 rounded-2xl 
                         shadow-lg shadow-indigo-200 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              <AnimatePresence mode="wait">
                {loading ? (
                  <motion.span key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
                    <Loader2 size={18} className="animate-spin" />
                    Preparing Download…
                  </motion.span>
                ) : success ? (
                  <motion.span key="success" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
                    <CheckCircle2 size={18} />
                    Downloaded!
                  </motion.span>
                ) : (
                  <motion.span key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
                    <Download size={18} />
                    Download Report
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}