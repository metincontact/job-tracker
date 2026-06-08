import { render, screen } from "@testing-library/react";
import JobList from "./JobList";
import type { Job } from "../types";

const jobs: Job[] = [
  {
    id: 1,
    company: "Acme",
    position: "Dev",
    status: "Applied",
    date: "2024-01-01",
    notes: "",
  },
  {
    id: 2,
    company: "Globex",
    position: "Designer",
    status: "Interview",
    date: "2024-01-02",
    notes: "",
  },
];

describe("JobList", () => {
  it("renders empty state when jobs array is empty", () => {
    render(<JobList jobs={[]} onDelete={vi.fn()} />);
    expect(screen.getByText(/no applications yet/i)).toBeInTheDocument();
  });

  it("renders a spinner when loading", () => {
    const { container } = render(
      <JobList jobs={[]} onDelete={vi.fn()} loading={true} />
    );
    expect(container.querySelector(".animate-spin")).toBeInTheDocument();
  });

  it("renders the correct number of job cards", () => {
    render(<JobList jobs={jobs} onDelete={vi.fn()} />);
    expect(screen.getByText("Acme")).toBeInTheDocument();
    expect(screen.getByText("Globex")).toBeInTheDocument();
  });
});
