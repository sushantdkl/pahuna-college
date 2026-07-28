"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { requestPasswordResetApi } from "@/lib/api/auth";

const genericMessage =
  "If an account exists for that email, a password reset link has been sent.";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!email.trim() || !email.includes("@")) {
      setError("Enter a valid email address.");
      return;
    }

    setLoading(true);

    try {
      const response = await requestPasswordResetApi({ email });

      if (!response.success) {
        setError(response.message || "Password reset could not be started.");
        return;
      }

      setSuccess(response.data?.message || response.message || genericMessage);
    } catch {
      setError("Password reset could not be started. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f8f3e8] px-4 py-12 text-stone-950">
      <Card className="w-full max-w-md rounded-[28px] border-emerald-900/10 bg-white/95 shadow-xl shadow-emerald-950/10">
        <CardContent className="p-8">
          <p className="text-xs font-black uppercase tracking-[0.28em] text-emerald-700">
            Pahuna Account
          </p>
          <h1 className="mt-3 text-3xl font-black tracking-tight">
            Forgot password?
          </h1>
          <p className="mt-3 text-sm leading-6 text-stone-600">
            Enter your account email and we will send a secure reset link if the
            account exists.
          </p>

          <form onSubmit={handleSubmit} className="mt-7 space-y-4">
            {error ? (
              <div className="flex items-center gap-2 rounded-2xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
                <AlertCircle className="h-4 w-4 shrink-0" />
                {error}
              </div>
            ) : null}
            {success ? (
              <div className="flex items-center gap-2 rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800">
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                {success}
              </div>
            ) : null}

            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                required
                autoComplete="email"
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Send reset link
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-stone-600">
            <Link href="/login" className="font-bold text-emerald-700 hover:underline">
              Back to Login
            </Link>
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
