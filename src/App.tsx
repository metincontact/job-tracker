import { useState, useEffect, useMemo } from "react";
import type { Job, NewJob } from "./types";
import type { User } from "@supabase/supabase-js";
import { supabase } from "./supabase";
import JobForm from "./components/JobForm";
import JobList from "./components/JobList";
import AuthForm from "./components/AuthForm";
import { Briefcase, LogOut, Loader2, AlertCircle } from "lucide-react";

const STATUSES = ["All", "Applied", "Interview", "Offer", "Rejected"] as const;

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filter, setFilter] = useState<Job["status"] | "All">("All");
  const [authLoading, setAuthLoading] = useState(true);
  const [jobsLoading, setJobsLoading] = useState(false);
  const [jobError, setJobError] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth
      .getSession()
      .then(({ data: { session } }) => {
        setUser(session?.user ?? null);
      })
      .catch(() => {
        setUser(null);
      })
      .finally(() => {
        setAuthLoading(false);
      });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) return;

    const fetchJobs = async () => {
      setJobsLoading(true);
      const { data, error } = await supabase
        .from("jobs")
        .select("*")
        .order("created_at", { ascending: false });
      if (!error && data) setJobs(data as Job[]);
      setJobsLoading(false);
    };

    fetchJobs();
  }, [user]);

  const addJob = async (newJob: NewJob) => {
    setJobError(null);
    const { data, error } = await supabase
      .from("jobs")
      .insert({ ...newJob, user_id: user!.id })
      .select()
      .single();
    if (error) {
      setJobError(error.message);
      return;
    }
    if (data) setJobs((prev) => [data as Job, ...prev]);
  };

  const deleteJob = async (id: number) => {
    setJobs((prev) => prev.filter((j) => j.id !== id));
    const { error } = await supabase.from("jobs").delete().eq("id", id);
    if (error) {
      setJobError(error.message);
      const { data } = await supabase
        .from("jobs")
        .select("*")
        .order("created_at", { ascending: false });
      if (data) setJobs(data as Job[]);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  const filteredJobs =
    filter === "All" ? jobs : jobs.filter((job) => job.status === filter);

  const counts = useMemo(() => {
    const result: Record<string, number> = {
      All: jobs.length,
      Applied: 0,
      Interview: 0,
      Offer: 0,
      Rejected: 0,
    };
    for (const job of jobs) result[job.status]++;
    return result;
  }, [jobs]);

  if (authLoading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-5 h-5 text-white/20 animate-spin" />
      </div>
    );

  if (!user) return <AuthForm />;

  return (
    <div className="max-w-3xl mx-auto px-6 py-14">

      {/* Header */}
      <div className="mb-10 flex justify-between items-start">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-700 flex items-center justify-center shadow-lg shadow-violet-500/25">
              <Briefcase className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Job Tracker
            </h1>
          </div>
          <p className="text-white/25 text-sm ml-12">
            {jobs.length} application{jobs.length !== 1 ? "s" : ""} tracked
          </p>
        </div>
        <div className="flex items-center gap-3 mt-1">
          <span className="text-white/25 text-xs hidden sm:block">{user.email}</span>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-white/[0.07] bg-white/[0.03] hover:bg-red-500/10 hover:border-red-500/20 text-white/30 hover:text-red-400 transition-all duration-200 text-xs"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign out</span>
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3 mb-8">
        {[
          { label: "Applied",   num: counts["Applied"],   accent: "text-violet-400",  bg: "bg-violet-500/[0.07]",  border: "border-violet-500/[0.15]"  },
          { label: "Interview", num: counts["Interview"], accent: "text-amber-400",   bg: "bg-amber-500/[0.07]",   border: "border-amber-500/[0.15]"   },
          { label: "Offer",     num: counts["Offer"],     accent: "text-emerald-400", bg: "bg-emerald-500/[0.07]", border: "border-emerald-500/[0.15]" },
          { label: "Rejected",  num: counts["Rejected"],  accent: "text-rose-400",    bg: "bg-rose-500/[0.07]",    border: "border-rose-500/[0.15]"    },
        ].map(({ label, num, accent, bg, border }) => (
          <div key={label} className={`${bg} border ${border} rounded-2xl p-4`}>
            <p className={`text-3xl font-bold tabular-nums leading-none ${accent}`}>{num}</p>
            <p className="text-white/25 text-[11px] uppercase tracking-widest mt-2">{label}</p>
          </div>
        ))}
      </div>

      {/* Error */}
      {jobError && (
        <div className="flex items-center gap-3 text-rose-400/80 text-sm mb-5 bg-rose-500/[0.06] border border-rose-500/[0.15] rounded-2xl px-4 py-3">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{jobError}</span>
        </div>
      )}

      <JobForm onAdd={addJob} />

      {/* Filter */}
      <div className="flex gap-1.5 mb-5 flex-wrap">
        {STATUSES.map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s as Job["status"] | "All")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-medium tracking-wide transition-all duration-200 ${
              filter === s
                ? "bg-white/[0.08] text-white border border-white/[0.14]"
                : "text-white/30 hover:text-white/55 border border-transparent hover:border-white/[0.07]"
            }`}
          >
            {s}
            <span className={`ml-1.5 tabular-nums ${filter === s ? "text-white/40" : "text-white/15"}`}>
              {counts[s]}
            </span>
          </button>
        ))}
      </div>

      <JobList jobs={filteredJobs} onDelete={deleteJob} loading={jobsLoading} />
    </div>
  );
}

export default App;
