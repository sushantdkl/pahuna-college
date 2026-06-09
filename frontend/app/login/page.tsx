"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { loginAction } from "@/lib/actions/auth-actions";
import { storeAuthCookies } from "@/lib/cookies";
import { loginSchema } from "@/schemas/auth.schema";

export default function LoginPage() {
  const router = useRouter();
  const [role, setRole] = useState("Traveler");
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

      // Store both auth_token and user_data before redirecting so the dashboard can read session context.
      storeAuthCookies(token, user);
      setStatus("success");
      setMessage(response.message || "Signed in successfully");
      router.push("/dashboard");
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Login failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-white lg:flex-row">
      <section className="relative hidden min-h-screen w-full flex-1 overflow-hidden lg:flex">
        <div className="absolute inset-0 bg-[url('/auth-hero.svg')] bg-cover bg-center" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/55 to-black/20" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(20,184,166,0.18),transparent_55%)]" />
        <div className="relative z-10 flex h-full w-full flex-col justify-between px-14 py-12 text-white">
          <div>
            <Image
              src="/pahuna-logo-exact-embedded.svg"
              alt="Pahuna"
              width={240}
              height={64}
              className="h-11 w-auto"
            />
            <p className="mt-8 max-w-md text-base leading-7 text-white/85">
              Experience the heart of Mid-Western Nepal. From Kakrebihar to Bulbule Lake,
              your journey begins with a local touch.
            </p>
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-white/70">
              Explore
            </p>
            <button
              type="button"
              className="mt-4 w-52 rounded-full border border-white/30 bg-white/10 px-6 py-2.5 text-[11px] font-semibold uppercase tracking-[0.25em] text-white/90 shadow-lg shadow-black/30 transition hover:bg-white/20"
            >
              Explore Surkhet
            </button>
          </div>
        </div>
      </section>

      <section className="flex min-h-screen w-full flex-1 items-center justify-center bg-gradient-to-b from-white via-emerald-50/40 to-white px-6 py-12 lg:px-12">
        <div className="w-full max-w-[420px] rounded-[32px] border border-emerald-100/70 bg-white/90 p-9 shadow-2xl shadow-emerald-200/70 backdrop-blur">
          <div className="flex flex-col items-center text-center">
            <Image
              src="/pahuna-logo-clean.svg"
              alt="Pahuna"
              width={150}
              height={36}
              className="h-7 w-auto"
            />
            <h1 className="mt-4 text-3xl font-semibold text-zinc-900">स्वागत छ</h1>
            <p className="mt-2 text-sm text-zinc-500">Welcome to PAHUNA Tourism Portal</p>
          </div>

          <div className="mt-7 flex items-center justify-center gap-6 text-[11px] font-semibold text-zinc-500">
            {["Traveler", "Hotel Owner", "Provider"].map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setRole(item)}
                className={`pb-2 transition ${
                  role === item
                    ? "border-b-2 border-emerald-500 text-emerald-700"
                    : "border-b-2 border-transparent text-zinc-400 hover:text-emerald-600"
                }`}
                aria-pressed={role === item}
              >
                {item}
              </button>
            ))}
          </div>

          <form className="mt-7 space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-zinc-500" htmlFor="email">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="example@pahuna.com"
                autoComplete="email"
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                  if (status !== "idle") {
                    setStatus("idle");
                  }
                }}
                className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-4 focus:ring-emerald-100"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-zinc-500">
                <label htmlFor="password">Password</label>
                <button type="button" className="text-emerald-600 hover:text-emerald-700">
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(event) => {
                    setPassword(event.target.value);
                    if (status !== "idle") {
                      setStatus("idle");
                    }
                  }}
                  className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2.5 pr-10 text-sm text-zinc-900 placeholder:text-zinc-400 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-4 focus:ring-emerald-100"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  className="absolute inset-y-0 right-2 flex items-center rounded-full px-2 text-zinc-500 transition hover:text-zinc-700"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      className="h-5 w-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 3l18 18"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M10.5 10.5a1.5 1.5 0 012.121 2.121"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6.75 6.75C4.5 8.25 3 11.25 3 12c0 .75 3 6 9 6 2.186 0 4.06-.674 5.625-1.688"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      className="h-5 w-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.036 12.322a1 1 0 010-.644C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.01 9.964 7.178a1 1 0 010 .644C20.573 16.49 16.638 19.5 12 19.5c-4.64 0-8.577-3.01-9.964-7.178z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <label className="flex items-center gap-2 text-xs text-zinc-500">
              <input type="checkbox" className="h-4 w-4 rounded border-zinc-300 text-emerald-500" />
              Remember me for 30 days
            </label>

            {status === "error" ? (
              <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
                {message}
              </div>
            ) : null}

            {status === "success" ? (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
                {message}
              </div>
            ) : null}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-200 transition hover:bg-emerald-600"
            >
              {isSubmitting ? "Signing in..." : "Sign In"}
            </button>

            <div className="flex items-center gap-4 text-[10px] font-semibold text-zinc-400">
              <span className="h-px flex-1 bg-zinc-200" />
              OR CONTINUE WITH
              <span className="h-px flex-1 bg-zinc-200" />
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs font-semibold text-zinc-600">
              <button
                type="button"
                className="flex items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-white px-3 py-2.5 transition hover:border-zinc-300"
              >
                <span className="text-base">G</span>
                Google
              </button>
              <button
                type="button"
                className="flex items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-white px-3 py-2.5 transition hover:border-zinc-300"
              >
                <span className="text-base">f</span>
                Facebook
              </button>
            </div>

            <p className="text-center text-xs text-zinc-500">
              Don&apos;t have an account?{" "}
              <Link className="font-semibold text-emerald-600 hover:text-emerald-700" href="/register">
                नयाँ खाता खोल्नुहोस्
              </Link>
            </p>
          </form>
        </div>
      </section>
    </div>
  );
}
