"use client";

import { useEffect, useState } from "react";

interface Petition {
  id: string;
  title: string;
  status: "active" | "under_review" | "closed";
  location: string;
}

export default function AdminDashboard() {
  const [petitions, setPetitions] = useState<Petition[]>([]);
  const [filtered, setFiltered] = useState<Petition[]>([]);

  const officialLocation = "Delhi";

  useEffect(() => {
    const data: Petition[] = [
      { id: "1", title: "Road Repair", status: "active", location: "Delhi" },
      { id: "2", title: "Water Issue", status: "under_review", location: "Delhi" },
      { id: "3", title: "Street Lights", status: "closed", location: "Delhi" },
    ];

    setPetitions(data);

    const filteredData = data.filter(
      (p) => p.location === officialLocation
    );

    setFiltered(filteredData);
  }, []);

  const total = filtered.length;
  const active = filtered.filter((p) => p.status === "active").length;
  const closed = filtered.filter((p) => p.status === "closed").length;

  return (
    // ✅ CHANGED: text-white → text-gray-900 (for visibility)
    <div className="min-h-screen bg-gradient-to-br from-purple-200 via-purple-300 to-blue-300 text-gray-900 p-6">

      {/* HEADER */}
      <h1 className="text-3xl font-bold mb-6 tracking-wide">
        Governance Dashboard
      </h1>

      {/* SUMMARY CARDS */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <Card title="Total Petitions" value={total} color="blue" />
        <Card title="Active" value={active} color="green" />
        <Card title="Closed" value={closed} color="red" />
      </div>

      {/* PETITIONS */}
      <div className="space-y-4">
        {filtered.map((p) => (
          <div
            key={p.id}
            onClick={() => (window.location.href = `/petitions/${p.id}`)}
            
            // ✅ CHANGED: bg-white/10 → bg-white/60 (more visible)
            className="cursor-pointer p-5 rounded-xl backdrop-blur-lg bg-white/60 border border-white/40 hover:bg-white/80 transition-all duration-300 shadow-lg"
          >
            {/* ✅ CHANGED: added text-gray-800 */}
            <h2 className="text-lg font-semibold text-gray-800">{p.title}</h2>

            <span
              className={`text-xs px-3 py-1 rounded-full mt-2 inline-block ${getStatusColor(
                p.status
              )}`}
            >
              {p.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* CARD COMPONENT */
function Card({
  title,
  value,
  color,
}: {
  title: string;
  value: number;
  color: string;
}) {
  const colorStyles: any = {
    blue: "from-blue-500 to-indigo-500",
    green: "from-green-500 to-emerald-500",
    red: "from-red-500 to-pink-500",
  };

  return (
    // ✅ CHANGED: bg-white/10 → bg-white/60
    <div className="p-5 rounded-2xl bg-white/60 backdrop-blur-md border border-white/40 shadow-lg hover:scale-105 transition">
      <div
        className={`w-10 h-10 mb-3 rounded-full bg-gradient-to-r ${colorStyles[color]}`}
      ></div>

      {/* ✅ CHANGED: text-gray-300 → text-gray-700 */}
      <h2 className="text-gray-700 text-sm">{title}</h2>

      <p className="text-2xl font-bold text-gray-900">{value}</p>
    </div>
  );
}

/* STATUS COLOR */
function getStatusColor(status: string) {
  switch (status) {

    // ✅ CHANGED: stronger background + darker text
    case "active":
      return "bg-green-100 text-green-700 font-medium";

    case "under_review":
      return "bg-yellow-100 text-yellow-700 font-medium";

    case "closed":
      return "bg-red-100 text-red-700 font-medium";

    default:
      return "";
  }
}