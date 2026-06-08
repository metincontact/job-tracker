import { useState } from "react";
import type { NewJob, JobStatus } from "../types";
import { Plus } from "lucide-react";

type JobFormProps = {
  onAdd: (job: NewJob) => void;
};

function JobForm({ onAdd }: JobFormProps) {
  const [company, setCompany] = useState("");
  const [position, setPosition] = useState("");
  const [status, setStatus] = useState<JobStatus>("Applied");
  const [notes, setNotes] = useState("");

  const handleSubmit = () => {
    if (!company.trim() || !position.trim()) return;

    onAdd({
      company: company.trim(),
      position: position.trim(),
      status,
      date: new Date().toISOString().split("T")[0],
      notes: notes.trim(),
    });

    setCompany("");
    setPosition("");
    setStatus("Applied");
    setNotes("");
  };

  const inputClass =
    "w-full bg-white/[0.04] border border-white/[0.07] rounded-xl px-3.5 py-2.5 text-sm outline-none focus:border-violet-500/40 focus:bg-white/[0.06] transition-all duration-200 text-white/85 placeholder:text-white/20";

  return (
    <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-5 mb-6">

      <div className="flex items-center gap-2 mb-5">
        <div className="w-5 h-5 rounded-lg bg-violet-500/15 flex items-center justify-center">
          <Plus className="w-3 h-3 text-violet-400" />
        </div>
        <h2 className="text-xs font-semibold text-white/40 uppercase tracking-widest">
          New Application
        </h2>
      </div>

      <div className="grid grid-cols-2 gap-2.5 mb-2.5">
        <input
          type="text"
          placeholder="Company"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          className={inputClass}
        />
        <input
          type="text"
          placeholder="Position"
          value={position}
          onChange={(e) => setPosition(e.target.value)}
          className={inputClass}
        />
      </div>

      <div className="grid grid-cols-2 gap-2.5 mb-4">
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as JobStatus)}
          className={inputClass}
          style={{ colorScheme: "dark" }}
        >
          <option value="Applied">Applied</option>
          <option value="Interview">Interview</option>
          <option value="Offer">Offer</option>
          <option value="Rejected">Rejected</option>
        </select>

        <input
          type="text"
          placeholder="Notes (optional)"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className={inputClass}
        />
      </div>

      <button
        onClick={handleSubmit}
        className="w-full bg-gradient-to-r from-violet-600/90 to-indigo-600/90 hover:from-violet-500 hover:to-indigo-500 text-white py-2.5 rounded-xl text-sm font-medium transition-all duration-200 shadow-md shadow-violet-500/10"
      >
        Add Application
      </button>

    </div>
  );
}

export default JobForm;
