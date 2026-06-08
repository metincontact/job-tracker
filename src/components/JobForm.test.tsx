import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import JobForm from "./JobForm";

describe("JobForm", () => {
  it("renders company, position, status and notes inputs", () => {
    render(<JobForm onAdd={vi.fn()} />);
    expect(screen.getByPlaceholderText("Company")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Position")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Notes (optional)")).toBeInTheDocument();
    expect(screen.getByRole("combobox")).toBeInTheDocument();
  });

  it("does not call onAdd when company is empty", async () => {
    const onAdd = vi.fn();
    render(<JobForm onAdd={onAdd} />);
    await userEvent.type(screen.getByPlaceholderText("Position"), "Dev");
    await userEvent.click(screen.getByRole("button", { name: /add application/i }));
    expect(onAdd).not.toHaveBeenCalled();
  });

  it("does not call onAdd when position is empty", async () => {
    const onAdd = vi.fn();
    render(<JobForm onAdd={onAdd} />);
    await userEvent.type(screen.getByPlaceholderText("Company"), "Acme");
    await userEvent.click(screen.getByRole("button", { name: /add application/i }));
    expect(onAdd).not.toHaveBeenCalled();
  });

  it("does not call onAdd when company is whitespace only", async () => {
    const onAdd = vi.fn();
    render(<JobForm onAdd={onAdd} />);
    await userEvent.type(screen.getByPlaceholderText("Company"), "   ");
    await userEvent.type(screen.getByPlaceholderText("Position"), "Dev");
    await userEvent.click(screen.getByRole("button", { name: /add application/i }));
    expect(onAdd).not.toHaveBeenCalled();
  });

  it("calls onAdd with trimmed values when form is valid", async () => {
    const onAdd = vi.fn();
    render(<JobForm onAdd={onAdd} />);
    await userEvent.type(screen.getByPlaceholderText("Company"), "  Acme  ");
    await userEvent.type(screen.getByPlaceholderText("Position"), "  Frontend Dev  ");
    await userEvent.type(screen.getByPlaceholderText("Notes (optional)"), "  Some notes  ");
    await userEvent.click(screen.getByRole("button", { name: /add application/i }));
    expect(onAdd).toHaveBeenCalledOnce();
    expect(onAdd).toHaveBeenCalledWith(
      expect.objectContaining({
        company: "Acme",
        position: "Frontend Dev",
        notes: "Some notes",
        status: "Applied",
      })
    );
  });

  it("resets fields after a successful submit", async () => {
    const onAdd = vi.fn();
    render(<JobForm onAdd={onAdd} />);
    const companyInput = screen.getByPlaceholderText("Company");
    const positionInput = screen.getByPlaceholderText("Position");
    await userEvent.type(companyInput, "Acme");
    await userEvent.type(positionInput, "Dev");
    await userEvent.click(screen.getByRole("button", { name: /add application/i }));
    expect(companyInput).toHaveValue("");
    expect(positionInput).toHaveValue("");
  });

  it("submits the correct default status Applied", async () => {
    const onAdd = vi.fn();
    render(<JobForm onAdd={onAdd} />);
    await userEvent.type(screen.getByPlaceholderText("Company"), "Acme");
    await userEvent.type(screen.getByPlaceholderText("Position"), "Dev");
    await userEvent.click(screen.getByRole("button", { name: /add application/i }));
    expect(onAdd).toHaveBeenCalledWith(
      expect.objectContaining({ status: "Applied" })
    );
  });
});
