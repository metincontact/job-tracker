import { useState, useEffect } from "react";
import type { Job } from "./types";
import type { User } from "@supabase/supabase-js";
import { supabase } from "./supabase";
import JobForm from "./components/JobForm";
import JobList from "./components/JobList";
import AuthForm from "./AuthForm";

const STATUSES = ["All", "Applied", "Interview", "Offer", "Rejected"];

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filter, setFilter] = useState<Job["status"] | "All">("All");
  const [loading, setLoading] = useState(true);

  // Auth state
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchJobs = async () => {
    const { data } = await supabase
      .from("jobs")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setJobs(data);
  };

  // Jobs fetch
  useEffect(() => {
    if (!user) return;
    fetchJobs();
  }, [user]);

  const addJob = async (job: Job) => {
    const { data } = await supabase
      .from("jobs")
      .insert({ ...job, user_id: user?.id })
      .select()
      .single();
    if (data) setJobs([data, ...jobs]);
  };

  const deleteJob = async (id: number) => {
    await supabase.from("jobs").delete().eq("id", id);
    setJobs(jobs.filter((j) => j.id !== id));
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
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

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );

  if (!user) return <AuthForm />;

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="mb-8 flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-bold text-slate-800">Job Tracker</h1>
          <p className="text-slate-400 mt-1">
            {jobs.length} application{jobs.length !== 1 ? "s" : ""} tracked
          </p>
        </div>
        <div className="text-right">
          <p className="text-slate-400 text-xs mb-1">{user.email}</p>
          <button
            onClick={handleSignOut}
            className="text-sm text-red-400 hover:text-red-300 transition-colors"
          >
            Sign out
          </button>
        </div>
      </div>

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

      <JobForm onAdd={addJob} />

      <div className="flex gap-2 mb-4 flex-wrap">
        {STATUSES.map((s) => (
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

      <JobList jobs={filteredJobs} onDelete={deleteJob} />
    </div>
  );
}

export default App;
