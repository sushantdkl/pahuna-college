"use client";

import { useState } from "react";
import Link from "next/link";
import { getSession, signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, AlertCircle, CheckCircle2 } from "lucide-react";

export function LoginForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");
  const adminError = searchParams.get("error") === "admin";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
        callbackUrl: callbackUrl ?? undefined,
      });

      if (result?.error) {
        setError("Login failed: invalid email or password");
        return;
      }

      setSuccess("Login successful");
      const session = await getSession();
      const isAdmin = session?.user?.role === "ADMIN";
      const nextUrl = getSafeRedirectPath(
        result?.url,
        callbackUrl,
        isAdmin ? "/dashboard" : "/",
      );

      setTimeout(() => {
        window.location.assign(nextUrl);
      }, 250);
    } catch {
      setError("Login failed: please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="rounded-2xl border-emerald-900/10 shadow-lg shadow-emerald-950/5">
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          {adminError && (
            <div className="flex items-center gap-2 rounded-md bg-amber-50 px-3 py-2 text-sm text-amber-800">
              <AlertCircle className="h-4 w-4 shrink-0" />
              Admin dashboard access requires an administrator account.
            </div>
          )}
          {error && (
            <div className="flex items-center gap-2 rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {error}
            </div>
          )}
          {success && (
            <div className="flex items-center gap-2 rounded-md bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              {success}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="admin@pahuna.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Sign In
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link className="font-medium text-primary hover:underline" href="/register">
              Register
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  );
}

function getSafeRedirectPath(
  resultUrl: string | null | undefined,
  callbackUrl: string | null,
  fallback: string,
) {
  const candidate = resultUrl || callbackUrl || fallback;

  try {
    const parsed = candidate.startsWith("http")
      ? new URL(candidate)
      : new URL(candidate, window.location.origin);

    if (parsed.origin !== window.location.origin) return fallback;
    return `${parsed.pathname}${parsed.search}${parsed.hash}` || fallback;
  } catch {
    return fallback;
  }
}

