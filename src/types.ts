export type JobStatus = "Applied" | "Interview" | "Offer" | "Rejected";

export type Job = {
  id: number;
  company: string;
  position: string;
  status: JobStatus;
  date: string;
  notes: string;
};

export type NewJob = Omit<Job, "id">;
