"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getReports, type ReportData } from "@/lib/api";
import { ArrowLeft, Loader2, BarChart3, Users, CheckCircle2, AlertCircle, Calendar, FileText, Vote } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function ReportsDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<ReportData | null>(null);
  const [error, setError] = useState("");

  const [filterLocation, setFilterLocation] = useState("");
  // Simple month filters
  const [fromMonth, setFromMonth] = useState(() => {
    const d = new Date();
    d.setMonth(d.getMonth() - 6);
    return d.toISOString().slice(0, 7); // YYYY-MM
  });
  const [toMonth, setToMonth] = useState(() => {
    const d = new Date();
    return d.toISOString().slice(0, 7);
  });

  useEffect(() => {
    const roleOpt = localStorage.getItem("userRole");
    const locOpt = localStorage.getItem("userLocation");
    
    if (roleOpt !== "official") {
      router.replace("/dashboard");
      return;
    }
    
    if (!filterLocation && locOpt) {
      setFilterLocation(locOpt);
    }
  }, [router, filterLocation]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      const token = localStorage.getItem("token") || "";
      
      const from = fromMonth ? new Date(fromMonth + "-01").toISOString() : undefined;
      let to;
      if (toMonth) {
         // approximate end of month by adding 1 month to 'toMonth-01'
         const d = new Date(toMonth + "-01");
         d.setMonth(d.getMonth() + 1);
         to = d.toISOString();
      }

      const res = await getReports(token, {
        location: filterLocation || undefined,
        from,
        to
      });
      setData(res.data);
    } catch (err: any) {
      setError(err.message || "Failed to load reports");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (filterLocation) {
      loadData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterLocation, fromMonth, toMonth]);

  if (loading && !data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-200 via-purple-200 to-blue-200 flex items-center justify-center p-6 text-gray-900">
        <Loader2 className="animate-spin text-indigo-500" size={48} />
      </div>
    );
  }

  // Calculate Aggregates
  let totalPetitions = 0;
  let activePetitions = 0;
  let closedPetitions = 0;
  let underReviewPetitions = 0;

  if (data?.petitionsPerStatus) {
    data.petitionsPerStatus.forEach(p => {
      totalPetitions += p.total;
      if (p.status === "active") activePetitions += p.total;
      if (p.status === "closed") closedPetitions += p.total;
      if (p.status === "under_review") underReviewPetitions += p.total;
    });
  }

  let totalSignatures = 0;
  if (data?.signaturesPerPetition) {
    totalSignatures = data.signaturesPerPetition.reduce((acc, curr) => acc + curr.totalSignatures, 0);
  }

  let totalVotes = 0;
  if (data?.pollVotesPerLocation) {
    totalVotes = data.pollVotesPerLocation.reduce((acc, curr) => acc + curr.totalVotes, 0);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-200 via-purple-200 to-blue-200 text-gray-900 py-10 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto space-y-8">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <button 
            onClick={() => router.push("/dashboard")}
            className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 transition-colors font-medium"
          >
            <ArrowLeft size={18} /> Back to Dashboard
          </button>

          <Link
            href="/dashboard/export"
            className="bg-white border border-gray-200 text-indigo-600 hover:bg-indigo-50 px-4 py-2 rounded-lg font-semibold shadow-sm transition-colors flex items-center gap-2"
          >
            <FileText size={18} /> Export Reports
          </Link>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-wrap items-end gap-6">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-semibold text-gray-700 mb-1">Location Filter</label>
            <input 
              type="text" 
              value={filterLocation}
              onChange={e => setFilterLocation(e.target.value)}
              className="w-full p-2.5 border border-gray-200 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="e.g. New York"
              readOnly // Officials should only view their registered location ideally
            />
          </div>
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center gap-2"><Calendar size={14}/> From Month</label>
            <input 
              type="month" 
              value={fromMonth}
              onChange={e => setFromMonth(e.target.value)}
              className="w-full p-2.5 border border-gray-200 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center gap-2"><Calendar size={14}/> To Month</label>
            <input 
              type="month" 
              value={toMonth}
              onChange={e => setToMonth(e.target.value)}
              className="w-full p-2.5 border border-gray-200 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {error && (
          <div className="bg-red-50 text-red-700 p-4 rounded-xl border border-red-100">
            {error}
          </div>
        )}

        {/* METRICS CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard 
            title="Total Petitions" 
            value={totalPetitions} 
            icon={<BarChart3 className="text-white" size={24}/>} 
            color="from-indigo-500 to-indigo-600" 
          />
          <MetricCard 
            title="Resolved Petitions" 
            value={closedPetitions} 
            icon={<CheckCircle2 className="text-white" size={24}/>} 
            color="from-emerald-500 to-emerald-600" 
          />
          <MetricCard 
            title="Pending Actions" 
            value={activePetitions + underReviewPetitions} 
            icon={<AlertCircle className="text-white" size={24}/>} 
            color="from-amber-500 to-orange-500" 
          />
          <MetricCard 
            title="Total Signatures" 
            value={totalSignatures} 
            icon={<Users className="text-white" size={24}/>} 
            color="from-purple-500 to-fuchsia-600" 
          />
        </div>

        {/* DETAILS SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* PETITION DISTRIBUTION */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
              <BarChart3 size={20} className="text-indigo-500"/> Petition Status Distribution
            </h3>
            <div className="space-y-6">
              <StatusRow label="Active" value={activePetitions} total={totalPetitions} color="bg-indigo-500" />
              <StatusRow label="Under Review" value={underReviewPetitions} total={totalPetitions} color="bg-amber-500" />
              <StatusRow label="Closed / Resolved" value={closedPetitions} total={totalPetitions} color="bg-emerald-500" />
            </div>
          </div>

          {/* TOP PETITIONS BY SIGNATURE */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-50 rounded-full -mr-10 -mt-10 opacity-50 blur-2xl"></div>
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2 relative z-10">
              <Users size={20} className="text-purple-500"/> Top Signatures
            </h3>
            
            <div className="space-y-4 relative z-10 relative max-h-64 overflow-y-auto pr-2">
              {data?.signaturesPerPetition?.length === 0 && (
                <p className="text-gray-500 text-sm">No signature data for this period.</p>
              )}
              {data?.signaturesPerPetition?.slice(0, 10).map((p, i) => (
                <div key={i} className="flex flex-col gap-1 border-b border-gray-50 pb-3 last:border-0">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-gray-800 text-sm truncate mr-4" title={p.title}>{p.title}</span>
                    <span className="text-indigo-600 font-bold bg-indigo-50 px-2 py-0.5 rounded-md text-xs">{p.totalSignatures}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Vote size={20} className="text-blue-500"/> Community Poll Engagement
            </h3>
            <div className="text-3xl font-black text-blue-600 bg-blue-50 px-4 py-2 rounded-xl">
              {totalVotes} <span className="text-sm font-medium text-blue-400">Total Votes Cast</span>
            </div>
        </div>

      </div>
    </div>
  );
}

// Subcomponents

function MetricCard({ title, value, icon, color }: { title: string, value: number, icon: React.ReactNode, color: string }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 relative overflow-hidden"
    >
      <div className={`absolute -right-4 -top-4 w-24 h-24 bg-gradient-to-br ${color} rounded-full opacity-10 blur-xl pointer-events-none`}></div>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-semibold text-gray-500 mb-2">{title}</p>
          <h4 className="text-4xl font-extrabold text-gray-900">{value}</h4>
        </div>
        <div className={`p-3 rounded-2xl bg-gradient-to-br ${color} shadow-lg shadow-gray-200/50`}>
          {icon}
        </div>
      </div>
    </motion.div>
  );
}

function StatusRow({ label, value, total, color }: { label: string, value: number, total: number, color: string }) {
  const percentage = total > 0 ? Math.round((value / total) * 100) : 0;
  
  return (
    <div>
      <div className="flex justify-between items-end mb-1.5">
        <span className="font-semibold text-gray-700 text-sm">{label}</span>
        <span className="text-gray-600 font-medium text-sm">{value} <span className="text-gray-400 font-normal">({percentage}%)</span></span>
      </div>
      <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className={`h-full ${color} rounded-full`}
        ></motion.div>
      </div>
    </div>
  );
}
