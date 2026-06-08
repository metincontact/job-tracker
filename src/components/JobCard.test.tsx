import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import JobCard from "./JobCard";
import type { Job } from "../types";

const baseJob: Job = {
  id: 1,
  company: "Acme Corp",
  position: "Frontend Developer",
  status: "Applied",
  date: "2024-01-15",
  notes: "Referral from Jane",
};

describe("JobCard", () => {
  it("renders company and position", () => {
    render(<JobCard job={baseJob} onDelete={vi.fn()} />);
    expect(screen.getByText("Acme Corp")).toBeInTheDocument();
    expect(screen.getByText("Frontend Developer")).toBeInTheDocument();
  });

  it("renders the status badge", () => {
    render(<JobCard job={baseJob} onDelete={vi.fn()} />);
    expect(screen.getByText("Applied")).toBeInTheDocument();
  });

  it("renders notes when present", () => {
    render(<JobCard job={baseJob} onDelete={vi.fn()} />);
    expect(screen.getByText("Referral from Jane")).toBeInTheDocument();
  });

  it("does not render notes section when notes is empty", () => {
    render(<JobCard job={{ ...baseJob, notes: "" }} onDelete={vi.fn()} />);
    expect(screen.queryByText("Referral from Jane")).not.toBeInTheDocument();
  });

  it("calls onDelete with the correct id when delete button clicked", async () => {
    const onDelete = vi.fn();
    render(<JobCard job={baseJob} onDelete={onDelete} />);
    await userEvent.click(screen.getByRole("button"));
    expect(onDelete).toHaveBeenCalledOnce();
    expect(onDelete).toHaveBeenCalledWith(1);
  });

  it("renders the date", () => {
    render(<JobCard job={baseJob} onDelete={vi.fn()} />);
    expect(screen.getByText("2024-01-15")).toBeInTheDocument();
  });
});
