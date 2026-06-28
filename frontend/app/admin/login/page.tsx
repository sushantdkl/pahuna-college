"use client";

import { useState } from "react";
import { flushSync } from "react-dom";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { loginAction } from "@/lib/actions/auth-actions";
import { clearAuthCookies, storeAuthCookies } from "@/lib/cookies";
import { images } from "@/lib/pahuna-content";
import { loginSchema } from "@/schemas/auth.schema";

function adminRedirect() {
  const requested = new URLSearchParams(window.location.search).get("redirect");
  return requested?.startsWith("/admin") && !requested.startsWith("//") ? requested : "/admin";
}

export default function AdminLoginPage() {
  const router = useRouter();
  const { setUser } = useAuth();
  const [email, setEmail] = useState("admin@pahuna.com");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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
      setMessage(parsedData.error.issues[0]?.message || "Invalid admin login data");
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

      if (user.role?.toLowerCase() !== "admin") {
        clearAuthCookies();
        flushSync(() => setUser(null));
        throw new Error("This portal is only for admin users");
      }

      storeAuthCookies(token, user);
      flushSync(() => setUser(user));
      setStatus("success");
      setMessage(response.message || "Admin signed in successfully");
      router.replace(adminRedirect());
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Admin login failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f5eee1] text-stone-950">
      <div className="grid min-h-screen lg:grid-cols-[0.9fr_1.1fr]">
        <section className="flex items-center justify-center px-4 py-10 sm:px-6">
          <div className="w-full max-w-md rounded-[32px] border border-emerald-900/10 bg-white p-6 shadow-2xl shadow-emerald-900/10 sm:p-8">
            <Link href="/" className="inline-flex items-center gap-2">
              <Image src="/pahuna-icon.svg" alt="" width={36} height={36} />
              <span className="text-xl font-black text-emerald-800">PAHUNA</span>
            </Link>
            <p className="mt-8 text-xs font-black uppercase tracking-[0.28em] text-emerald-700">Admin portal</p>
            <h1 className="mt-3 text-3xl font-black tracking-tight">Sign in to manage Pahuna</h1>
            <p className="mt-3 text-sm leading-6 text-stone-600">Use the existing admin credentials. Public user login remains separate and untouched.</p>

            <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <label htmlFor="adminEmail" className="text-xs font-black uppercase tracking-[0.16em] text-stone-500">Admin email</label>
                <input id="adminEmail" type="email" autoComplete="email" value={email} onChange={(event) => { setEmail(event.target.value); setStatus("idle"); }} className="auth-input" placeholder="admin@pahuna.com" />
              </div>
              <div className="space-y-2">
                <label htmlFor="adminPassword" className="text-xs font-black uppercase tracking-[0.16em] text-stone-500">Password</label>
                <div className="relative">
                  <input id="adminPassword" type={showPassword ? "text" : "password"} autoComplete="current-password" value={password} onChange={(event) => { setPassword(event.target.value); setStatus("idle"); }} className="auth-input pr-20" placeholder="123456" />
                  <button type="button" onClick={() => setShowPassword((value) => !value)} className="absolute inset-y-1 right-1 rounded-xl px-3 text-xs font-black text-emerald-800 transition hover:bg-emerald-50">
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              {message ? (
                <p className={`rounded-2xl px-4 py-3 text-sm font-semibold ${status === "error" ? "bg-red-50 text-red-700" : "bg-emerald-50 text-emerald-800"}`}>
                  {message}
                </p>
              ) : null}

              <button type="submit" disabled={isSubmitting} className="w-full rounded-2xl bg-emerald-700 px-5 py-3 text-sm font-black uppercase tracking-[0.16em] text-white shadow-lg shadow-emerald-800/15 transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-70">
                {isSubmitting ? "Signing in..." : "Open admin dashboard"}
              </button>
            </form>

            <div className="mt-6 flex flex-wrap items-center justify-between gap-3 text-sm">
              <Link href="/login" className="font-bold text-stone-500 hover:text-emerald-800">User login</Link>
              <Link href="/" className="font-bold text-stone-500 hover:text-emerald-800">Back to site</Link>
            </div>
          </div>
        </section>

        <section className="relative hidden overflow-hidden lg:block">
          <Image src={images.hero} alt="Karnali lake landscape for Pahuna admin" fill priority sizes="55vw" className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-l from-emerald-950/90 via-stone-950/55 to-transparent" />
          <div className="relative z-10 flex h-full flex-col justify-between p-12 text-white">
            <div className="h-1 w-28 rounded-full bg-amber-400" />
            <div className="max-w-2xl">
              <p className="text-xs font-black uppercase tracking-[0.32em] text-emerald-200">Dashboard access</p>
              <h2 className="mt-4 text-5xl font-black leading-tight">A quieter control room for users, stays, and travel content.</h2>
              <p className="mt-5 text-base leading-8 text-white/82">Inspired by the reference dashboard structure, adapted to the current Pahuna auth and API flow.</p>
            </div>
            <p className="text-sm font-semibold text-white/70">Admin: admin@pahuna.com</p>
          </div>
        </section>
      </div>
    </main>
  );
}
