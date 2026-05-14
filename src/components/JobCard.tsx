import type { Job } from "../types";

type JobCardProps = {
  job: Job;
  onDelete: (id: number) => void;
};

function JobCard({ job, onDelete }: JobCardProps) {
  const statusStyles: Record<Job["status"], string> = {
    Applied: "bg-blue-50 text-blue-600",
    Interview: "bg-yellow-50 text-yellow-600",
    Offer: "bg-green-50 text-green-600",
    Rejected: "bg-red-50 text-red-600",
  };

  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow flex justify-between items-start">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <h3 className="font-semibold text-slate-800">{job.company}</h3>
          <span
            className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusStyles[job.status]}`}
          >
            {job.status}
          </span>
        </div>
        <p className="text-slate-500 text-sm">{job.position}</p>
        {job.notes && (
          <p className="text-slate-400 text-xs mt-1">{job.notes}</p>
        )}
        <p className="text-slate-300 text-xs mt-2">{job.date}</p>
      </div>

      <button
        onClick={() => onDelete(job.id)}
        className="text-slate-300 hover:text-red-400 transition-colors text-sm ml-4"
      >
        ✕
      </button>
    </div>
  );
}

export default JobCard;
