import { useState } from "react";
import type { Job } from "../types";

type JobFormProps = {
  onAdd: (job: Job) => void;
};

function JobForm({ onAdd }: JobFormProps) {
  const [company, setCompany] = useState("");
  const [position, setPosition] = useState("");
  const [status, setStatus] = useState<Job["status"]>("Applied");
  const [notes, setNotes] = useState("");

  const handleSubmit = () => {
    if (!company || !position) return;

    const newJob: Job = {
      id: Date.now(),
      company,
      position,
      status,
      date: new Date().toLocaleDateString(),
      notes,
    };

    onAdd(newJob);
    setCompany("");
    setPosition("");
    setStatus("Applied");
    setNotes("");
  };

  const inputClass =
    "w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400 transition-colors bg-white";

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 mb-6">
      <h2 className="text-lg font-semibold text-slate-700 mb-4">
        Add New Application
      </h2>

      <div className="grid grid-cols-2 gap-3 mb-3">
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

      <div className="grid grid-cols-2 gap-3 mb-3">
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as Job["status"])}
          className={inputClass}
        >
          <option>Applied</option>
          <option>Interview</option>
          <option>Offer</option>
          <option>Rejected</option>
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
        className="w-full bg-slate-800 hover:bg-slate-700 text-white py-2 rounded-lg text-sm font-medium transition-colors"
      >
        Add Application
      </button>
    </div>
  );
}

export default JobForm;
