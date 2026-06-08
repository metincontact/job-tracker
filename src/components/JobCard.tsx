import type { Job, JobStatus } from "../types";
import { CalendarDays, Trash2 } from "lucide-react";

type JobCardProps = {
  job: Job;
  onDelete: (id: number) => void;
};

const STATUS_LEFT_BORDER: Record<JobStatus, string> = {
  Applied:   "border-l-violet-500/60",
  Interview: "border-l-amber-500/60",
  Offer:     "border-l-emerald-500/60",
  Rejected:  "border-l-rose-500/60",
};

const STATUS_BADGE: Record<JobStatus, string> = {
  Applied:   "bg-violet-500/10  text-violet-400  border-violet-500/20",
  Interview: "bg-amber-500/10   text-amber-400   border-amber-500/20",
  Offer:     "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  Rejected:  "bg-rose-500/10    text-rose-400    border-rose-500/20",
};

function JobCard({ job, onDelete }: JobCardProps) {
  return (
    <div
      className={`group relative bg-white/[0.03] border border-white/[0.06] border-l-2 ${STATUS_LEFT_BORDER[job.status]} rounded-2xl px-5 py-4 flex justify-between items-start gap-4 hover:bg-white/[0.05] transition-all duration-200`}
    >
      <div className="flex-1 min-w-0">

        {/* Company + badge */}
        <div className="flex items-center gap-2.5 mb-1.5 flex-wrap">
          <h3 className="font-semibold text-white/90 text-sm leading-snug">
            {job.company}
          </h3>
          <span className={`inline-flex text-[11px] px-2.5 py-0.5 rounded-full font-medium border ${STATUS_BADGE[job.status]}`}>
            {job.status}
          </span>
        </div>

        {/* Position */}
        <p className="text-white/45 text-sm truncate">{job.position}</p>

        {/* Notes */}
        {job.notes && (
          <p className="text-white/25 text-xs mt-2 leading-relaxed line-clamp-2">
            {job.notes}
          </p>
        )}

        {/* Date */}
        <div className="flex items-center gap-1.5 mt-3">
          <CalendarDays className="w-3 h-3 text-white/15 shrink-0" />
          <p className="text-white/20 text-xs tabular-nums">{job.date}</p>
        </div>

      </div>

      {/* Delete */}
      <button
        onClick={() => onDelete(job.id)}
        className="opacity-0 group-hover:opacity-100 shrink-0 p-1.5 rounded-lg hover:bg-rose-500/10 text-white/20 hover:text-rose-400 transition-all duration-150 mt-0.5"
        aria-label="Delete application"
      >
        <Trash2 className="w-3.5 h-3.5" />
      </button>

    </div>
  );
}

export default JobCard;
