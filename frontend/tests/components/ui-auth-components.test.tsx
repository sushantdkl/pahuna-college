import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, test, vi } from "vitest";
import { Users } from "lucide-react";
import { AuthCard } from "@/components/auth-card";
import { StatCard } from "@/components/dashboard/stat-card";
import { EmptyState } from "@/components/shared/empty-state";
import { FormSuccess } from "@/components/shared/form-success";
import { PasswordInput } from "@/components/ui/password-input";

describe("AuthCard", () => {
  test("renders eyebrow, title, description, child content and footer", () => {
    render(
      <AuthCard
        eyebrow="Traveler Account"
        title="Welcome back"
        description="Sign in to continue."
        footer={<a href="/register">Register</a>}
      >
        <button type="button">Sign in</button>
      </AuthCard>,
    );

    expect(screen.getByText("Traveler Account")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Welcome back" })).toBeInTheDocument();
    expect(screen.getByText("Sign in to continue.")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Sign in" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Register" })).toHaveAttribute("href", "/register");
  });
});

describe("PasswordInput", () => {
  test("starts as password field", () => {
    render(<PasswordInput aria-label="Password" />);
    expect(screen.getByLabelText("Password")).toHaveAttribute("type", "password");
  });

  test("toggles visibility with accessible button", async () => {
    const user = userEvent.setup();
    render(<PasswordInput aria-label="Password" />);

    await user.click(screen.getByRole("button", { name: /show password/i }));
    expect(screen.getByLabelText("Password")).toHaveAttribute("type", "text");

    await user.click(screen.getByRole("button", { name: /hide password/i }));
    expect(screen.getByLabelText("Password")).toHaveAttribute("type", "password");
  });

  test("passes through value changes", async () => {
    const user = userEvent.setup();
    render(<PasswordInput aria-label="Password" />);
    await user.type(screen.getByLabelText("Password"), "secret123");
    expect(screen.getByLabelText("Password")).toHaveValue("secret123");
  });
});

describe("EmptyState", () => {
  test("renders default icon, title and description", () => {
    render(<EmptyState title="No records" description="Create your first record." />);
    expect(screen.getByRole("heading", { name: "No records" })).toBeInTheDocument();
    expect(screen.getByText("Create your first record.")).toBeInTheDocument();
  });

  test("renders optional action link", () => {
    render(
      <EmptyState
        title="No stays"
        description="Add a stay."
        action={{ label: "Add Stay", href: "/dashboard/hotels" }}
      />,
    );

    expect(screen.getByRole("link", { name: "Add Stay" })).toHaveAttribute("href", "/dashboard/hotels");
  });

  test("renders custom icon", () => {
    render(<EmptyState icon={<Users data-testid="custom-icon" />} title="No users" description="No users yet." />);
    expect(screen.getByTestId("custom-icon")).toBeInTheDocument();
  });
});

describe("FormSuccess", () => {
  test("announces success content politely", () => {
    render(<FormSuccess title="Sent" message="We received it." details="Check email." />);
    expect(screen.getByRole("status")).toHaveAttribute("aria-live", "polite");
    expect(screen.getByRole("heading", { name: "Sent" })).toBeInTheDocument();
    expect(screen.getByText("We received it.")).toBeInTheDocument();
    expect(screen.getByText("Check email.")).toBeInTheDocument();
  });

  test("renders link actions", () => {
    render(
      <FormSuccess
        title="Done"
        message="Saved"
        actions={[{ label: "Open Dashboard", href: "/dashboard" }]}
      />,
    );

    expect(screen.getByRole("link", { name: /open dashboard/i })).toHaveAttribute("href", "/dashboard");
  });

  test("calls button actions", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <FormSuccess
        title="Done"
        message="Saved"
        actions={[{ label: "Retry", onClick }]}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Retry" }));
    expect(onClick).toHaveBeenCalledOnce();
  });

  test("calls reset action", async () => {
    const user = userEvent.setup();
    const onReset = vi.fn();
    render(<FormSuccess title="Done" message="Saved" onReset={onReset} />);
    await user.click(screen.getByRole("button", { name: /submit another/i }));
    expect(onReset).toHaveBeenCalledOnce();
  });
});

describe("StatCard", () => {
  test.each([
    ["Total Users", 12, "Active accounts"],
    ["Food Providers", "8", "Public listings"],
    ["Map Locations", 5, "Verified"],
    ["Messages", 3, "New"],
  ])("renders stat card %s", (title, value, subtitle) => {
    render(<StatCard title={title} value={value} subtitle={subtitle} />);
    expect(screen.getByText(title)).toBeInTheDocument();
    expect(screen.getByText(String(value))).toBeInTheDocument();
    expect(screen.getByText(subtitle)).toBeInTheDocument();
  });

  test("renders positive trend", () => {
    render(<StatCard title="Users" value={10} trend={{ value: "12%", positive: true }} />);
    expect(screen.getByText("Up 12%")).toHaveClass("text-emerald-700");
  });

  test("renders negative trend", () => {
    render(<StatCard title="Pending" value={2} trend={{ value: "4%", positive: false }} />);
    expect(screen.getByText("Down 4%")).toHaveClass("text-red-700");
  });
});
