import type { Job } from "../types";
import JobCard from "./JobCard";

type JobListProps = {
  jobs: Job[];
  onDelete: (id: number) => void;
};

function JobList({ jobs, onDelete }: JobListProps) {
  if (jobs.length === 0) {
    return <p className="text-gray-400 text-center">No jobs added yet.</p>;
  }

  return (
    <div className="flex flex-col gap-4">
      {jobs.map((job) => (
        <JobCard key={job.id} job={job} onDelete={onDelete} />
      ))}
    </div>
  );
}

export default JobList;
