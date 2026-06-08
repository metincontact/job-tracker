import type { Job } from "../types";
import JobCard from "./JobCard";
import { Inbox, Loader2 } from "lucide-react";

type JobListProps = {
  jobs: Job[];
  onDelete: (id: number) => void;
  loading?: boolean;
};

function JobList({ jobs, onDelete, loading }: JobListProps) {
  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="w-5 h-5 text-white/15 animate-spin" />
      </div>
    );
  }

  if (jobs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-12 h-12 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center mb-4">
          <Inbox className="w-5 h-5 text-white/15" />
        </div>
        <p className="text-white/25 text-sm">No applications yet</p>
        <p className="text-white/12 text-xs mt-1">Add your first job above</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2.5">
      {jobs.map((job) => (
        <JobCard key={job.id} job={job} onDelete={onDelete} />
      ))}
    </div>
  );
}

export default JobList;
