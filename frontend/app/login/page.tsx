"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import { flushSync } from "react-dom";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { loginAction } from "@/lib/actions/auth-actions";
import { storeAuthCookies } from "@/lib/cookies";
import { images } from "@/lib/pahuna-content";
import { loginSchema } from "@/schemas/auth.schema";

function safeRedirectFor(role: string | undefined) {
  const search = new URLSearchParams(window.location.search);
  const requested = search.get("redirect");
  const isAdmin = role?.toLowerCase() === "admin";

  if (requested?.startsWith("/") && !requested.startsWith("//")) {
    if (requested.startsWith("/admin")) {
      return isAdmin ? requested : "/";
    }

    return requested;
  }

  return isAdmin ? "/admin" : "/";
}

export default function LoginPage() {
  const router = useRouter();
  const { setUser } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "error" | "success">("idle");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("idle");
    setMessage("");

    const parsedData = loginSchema.safeParse({ email, password });

    if (!parsedData.success) {
      setStatus("error");
      setMessage(parsedData.error.issues[0]?.message || "Invalid login data");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await loginAction(parsedData.data);
      const token = response.data?.token;
      const user = response.data?.user;

      if (!token || !user) {
        throw new Error("Auth data was not returned by the server");
      }

      storeAuthCookies(token, user);
      flushSync(() => setUser(user));
      setStatus("success");
      setMessage(response.message || "Signed in successfully");
      router.replace(safeRedirectFor(user.role));
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Login failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f8f1e4] text-stone-950">
      <div className="grid min-h-screen lg:grid-cols-[1.08fr_0.92fr]">
        <section className="relative hidden overflow-hidden lg:block">
          <Image src={images.hero} alt="Aakashe Tal landscape in Karnali" fill priority sizes="55vw" className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/85 via-stone-950/45 to-transparent" />
          <div className="relative z-10 flex h-full flex-col justify-between p-12 text-white">
            <Link href="/" className="flex w-fit items-center gap-3">
              <Image src="/pahuna-icon.svg" alt="" width={42} height={42} className="rounded-2xl bg-white p-1" />
              <span className="text-2xl font-black tracking-tight">PAHUNA</span>
            </Link>
            <div className="max-w-xl">
              <p className="text-xs font-black uppercase tracking-[0.32em] text-emerald-200">Welcome back</p>
              <h1 className="mt-4 text-5xl font-black leading-tight">Plan Surkhet and Karnali with your saved Pahuna session.</h1>
              <p className="mt-5 text-base leading-8 text-white/82">Sign in to manage your profile, continue trip planning, and keep inquiries connected to your account.</p>
            </div>
            <div className="h-1 w-28 rounded-full bg-amber-400" />
          </div>
        </section>

        <section className="flex items-center justify-center px-4 py-10 sm:px-6">
          <div className="w-full max-w-md rounded-[32px] border border-emerald-900/10 bg-white p-6 shadow-2xl shadow-emerald-900/10 sm:p-8">
            <div className="text-center">
              <Link href="/" className="mx-auto inline-flex items-center gap-2">
                <Image src="/pahuna-icon.svg" alt="" width={34} height={34} />
                <span className="text-xl font-black text-emerald-800">PAHUNA</span>
              </Link>
              <h1 className="mt-6 text-3xl font-black tracking-tight">Sign in to Pahuna</h1>
              <p className="mt-2 text-sm leading-6 text-stone-600">Use your traveler account. Admins can use the dedicated admin portal.</p>
            </div>

            <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
              <Field label="Email address" htmlFor="email">
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value);
                    setStatus("idle");
                  }}
                  className="w-full rounded-2xl border border-stone-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                  placeholder="you@example.com"
                />
              </Field>

              <Field label="Password" htmlFor="password">
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    value={password}
                    onChange={(event) => {
                      setPassword(event.target.value);
                      setStatus("idle");
                    }}
                    className="w-full rounded-2xl border border-stone-200 bg-white px-4 py-3 pr-20 text-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((value) => !value)}
                    className="absolute inset-y-1 right-1 rounded-xl px-3 text-xs font-black text-emerald-800 transition hover:bg-emerald-50"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </Field>

              {message ? (
                <p className={`rounded-2xl px-4 py-3 text-sm font-semibold ${status === "error" ? "bg-red-50 text-red-700" : "bg-emerald-50 text-emerald-800"}`}>
                  {message}
                </p>
              ) : null}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-2xl bg-emerald-700 px-5 py-3 text-sm font-black uppercase tracking-[0.16em] text-white shadow-lg shadow-emerald-800/15 transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSubmitting ? "Signing in..." : "Sign in"}
              </button>
            </form>

            <div className="mt-6 grid gap-3 text-center text-sm text-stone-600">
              <p>
                New to Pahuna?{" "}
                <Link href="/register" className="font-black text-emerald-800 hover:text-emerald-900">
                  Create account
                </Link>
              </p>
              <Link href="/admin/login" className="font-bold text-stone-500 hover:text-emerald-800">
                Admin sign in
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function Field({ label, htmlFor, children }: { label: string; htmlFor: string; children: ReactNode }) {
  return (
    <div className="space-y-2">
      <label htmlFor={htmlFor} className="text-xs font-black uppercase tracking-[0.16em] text-stone-500">
        {label}
      </label>
      {children}
    </div>
  );
}
