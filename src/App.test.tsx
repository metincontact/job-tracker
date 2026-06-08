import { render, screen, waitFor } from "@testing-library/react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "./supabase";
import App from "./App";

vi.mock("./supabase", () => ({
  supabase: {
    auth: {
      getSession: vi.fn(),
      onAuthStateChange: vi.fn(),
      signOut: vi.fn(),
    },
    from: vi.fn(),
  },
}));

const mockSession = (session: Session | null) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  vi.mocked(supabase.auth.getSession).mockResolvedValue({ data: { session }, error: null } as any);
  vi.mocked(supabase.auth.onAuthStateChange).mockReturnValue({
    data: {
      subscription: { unsubscribe: vi.fn(), id: "test", callback: vi.fn() },
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any);
};

const mockJobsQuery = () => {
  vi.mocked(supabase.from).mockReturnValue({
    select: vi.fn().mockReturnValue({
      order: vi.fn().mockResolvedValue({ data: [], error: null }),
    }),
    insert: vi.fn().mockReturnValue({
      select: vi.fn().mockReturnValue({
        single: vi.fn().mockResolvedValue({ data: null, error: null }),
      }),
    }),
    delete: vi.fn().mockReturnValue({
      eq: vi.fn().mockResolvedValue({ data: null, error: null }),
    }),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any);
};

describe("App", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows a loading spinner while auth is being checked", () => {
    vi.mocked(supabase.auth.getSession).mockReturnValue(new Promise(() => {}));
    vi.mocked(supabase.auth.onAuthStateChange).mockReturnValue({
      data: {
        subscription: { unsubscribe: vi.fn(), id: "test", callback: vi.fn() },
      },
    } as ReturnType<typeof supabase.auth.onAuthStateChange>);

    const { container } = render(<App />);
    expect(container.querySelector(".animate-spin")).toBeInTheDocument();
  });

  it("shows AuthForm when there is no active session", async () => {
    mockSession(null);
    render(<App />);
    await waitFor(() => {
      expect(screen.getByText(/sign in to your account/i)).toBeInTheDocument();
    });
  });

  it("shows the main app when a session exists", async () => {
    mockSession({
      user: { id: "user-1", email: "test@example.com" },
    } as Session);
    mockJobsQuery();

    render(<App />);
    await waitFor(() => {
      expect(
        screen.getByRole("heading", { name: /job tracker/i })
      ).toBeInTheDocument();
    });
    expect(screen.getByText("test@example.com")).toBeInTheDocument();
  });

  it("shows empty state after loading jobs", async () => {
    mockSession({
      user: { id: "user-1", email: "test@example.com" },
    } as Session);
    mockJobsQuery();

    render(<App />);
    await waitFor(() => {
      expect(screen.getByText(/no applications yet/i)).toBeInTheDocument();
    });
  });
});
