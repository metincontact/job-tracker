import { useState, useEffect } from "react";
import type { Job } from "./types";
import JobForm from "./components/JobForm";
import JobList from "./components/JobList";

function App() {
  const [jobs, setJobs] = useState<Job[]>(() => {
    const saved = localStorage.getItem("jobs");
    return saved ? JSON.parse(saved) : [];
  });

  const [filter, setFilter] = useState<Job["status"] | "All">("All");

  useEffect(() => {
    localStorage.setItem("jobs", JSON.stringify(jobs));
  }, [jobs]);

  const addJob = (job: Job) => {
    setJobs([...jobs, job]);
  };

  const deleteJob = (id: number) => {
    setJobs(jobs.filter((job) => job.id !== id));
  };

  const filteredJobs =
    filter === "All" ? jobs : jobs.filter((job) => job.status === filter);

  const counts: Record<string, number> = {
    All: jobs.length,
    Applied: jobs.filter((j) => j.status === "Applied").length,
    Interview: jobs.filter((j) => j.status === "Interview").length,
    Offer: jobs.filter((j) => j.status === "Offer").length,
    Rejected: jobs.filter((j) => j.status === "Rejected").length,
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-slate-800">Job Tracker</h1>
        <p className="text-slate-400 mt-1">
          {jobs.length} application{jobs.length !== 1 ? "s" : ""} tracked
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3 mb-8">
        {[
          {
            label: "Applied",
            color: "bg-blue-50 text-blue-600 border-blue-100",
          },
          {
            label: "Interview",
            color: "bg-yellow-50 text-yellow-600 border-yellow-100",
          },
          {
            label: "Offer",
            color: "bg-green-50 text-green-600 border-green-100",
          },
          { label: "Rejected", color: "bg-red-50 text-red-600 border-red-100" },
        ].map(({ label, color }) => (
          <div
            key={label}
            className={`border rounded-xl p-3 text-center ${color}`}
          >
            <p className="text-2xl font-bold">{counts[label]}</p>
            <p className="text-xs">{label}</p>
          </div>
        ))}
      </div>

      {/* Form */}
      <JobForm onAdd={addJob} />

      {/* Filter */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {["All", "Applied", "Interview", "Offer", "Rejected"].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s as Job["status"] | "All")}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              filter === s
                ? "bg-slate-800 text-white"
                : "bg-white text-slate-500 hover:bg-slate-100 border"
            }`}
          >
            {s} ({counts[s]})
          </button>
        ))}
      </div>

      {/* List */}
      <JobList jobs={filteredJobs} onDelete={deleteJob} />
    </div>
  );
}

export default App;
