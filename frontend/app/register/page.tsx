"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { registerAction } from "@/lib/actions/auth-actions";
import { images } from "@/lib/pahuna-content";
import { registerSchema } from "@/schemas/auth.schema";

const accountTypes = ["Traveler", "Hotel Owner", "Provider"];

export default function RegisterPage() {
  const [accountType, setAccountType] = useState("Traveler");
  const [showPassword, setShowPassword] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "error" | "success">("idle");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("idle");
    setMessage("");

    const parsedData = registerSchema.safeParse({
      fullName,
      email,
      phoneNumber,
      password,
      confirmPassword,
    });

    if (!parsedData.success) {
      setStatus("error");
      setMessage(parsedData.error.issues[0]?.message || "Invalid register data");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await registerAction(parsedData.data);
      setStatus("success");
      setMessage(response.message || `${accountType} account created successfully. You can sign in now.`);
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Registration failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f8f1e4] text-stone-950">
      <div className="grid min-h-screen lg:grid-cols-[0.92fr_1.08fr]">
        <section className="flex items-center justify-center px-4 py-10 sm:px-6">
          <div className="w-full max-w-lg rounded-[32px] border border-emerald-900/10 bg-white p-6 shadow-2xl shadow-emerald-900/10 sm:p-8">
            <div className="text-center">
              <Link href="/" className="mx-auto inline-flex items-center gap-2">
                <Image src="/pahuna-icon.svg" alt="" width={34} height={34} />
                <span className="text-xl font-black text-emerald-800">PAHUNA</span>
              </Link>
              <h1 className="mt-6 text-3xl font-black tracking-tight">Create your Pahuna account</h1>
              <p className="mt-2 text-sm leading-6 text-stone-600">Start with a traveler profile. Partner onboarding can continue through contact after registration.</p>
            </div>

            <div className="mt-7 grid gap-2 sm:grid-cols-3">
              {accountTypes.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setAccountType(item)}
                  className={`rounded-2xl border px-3 py-3 text-xs font-black transition ${
                    accountType === item
                      ? "border-emerald-700 bg-emerald-700 text-white"
                      : "border-emerald-100 bg-emerald-50 text-emerald-800 hover:bg-emerald-100"
                  }`}
                  aria-pressed={accountType === item}
                >
                  {item}
                </button>
              ))}
            </div>

            <form className="mt-7 space-y-4" onSubmit={handleSubmit}>
              <Field label="Full name" htmlFor="fullName">
                <input id="fullName" value={fullName} onChange={(event) => { setFullName(event.target.value); setStatus("idle"); }} autoComplete="name" className="auth-input" placeholder="Jane Doe" />
              </Field>
              <Field label="Email address" htmlFor="email">
                <input id="email" type="email" value={email} onChange={(event) => { setEmail(event.target.value); setStatus("idle"); }} autoComplete="email" className="auth-input" placeholder="you@example.com" />
              </Field>
              <Field label="Phone number" htmlFor="phoneNumber">
                <input id="phoneNumber" value={phoneNumber} onChange={(event) => { setPhoneNumber(event.target.value); setStatus("idle"); }} autoComplete="tel" className="auth-input" placeholder="Optional phone number" />
              </Field>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Password" htmlFor="password">
                  <input id="password" type={showPassword ? "text" : "password"} value={password} onChange={(event) => { setPassword(event.target.value); setStatus("idle"); }} autoComplete="new-password" className="auth-input" placeholder="Minimum 6 characters" />
                </Field>
                <Field label="Confirm password" htmlFor="confirmPassword">
                  <input id="confirmPassword" type={showPassword ? "text" : "password"} value={confirmPassword} onChange={(event) => { setConfirmPassword(event.target.value); setStatus("idle"); }} autoComplete="new-password" className="auth-input" placeholder="Repeat password" />
                </Field>
              </div>

              <button type="button" onClick={() => setShowPassword((value) => !value)} className="text-xs font-black text-emerald-800 hover:text-emerald-900">
                {showPassword ? "Hide passwords" : "Show passwords"}
              </button>

              {message ? (
                <p className={`rounded-2xl px-4 py-3 text-sm font-semibold ${status === "error" ? "bg-red-50 text-red-700" : "bg-emerald-50 text-emerald-800"}`}>
                  {message}
                </p>
              ) : null}

              <button disabled={isSubmitting} type="submit" className="w-full rounded-2xl bg-emerald-700 px-5 py-3 text-sm font-black uppercase tracking-[0.16em] text-white shadow-lg shadow-emerald-800/15 transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-70">
                {isSubmitting ? "Creating account..." : "Create account"}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-stone-600">
              Already registered?{" "}
              <Link href="/login" className="font-black text-emerald-800 hover:text-emerald-900">
                Sign in
              </Link>
            </p>
          </div>
        </section>

        <section className="relative hidden overflow-hidden lg:block">
          <Image src={images.hero} alt="Aakashe Tal in Jumla for Karnali travel" fill priority sizes="55vw" className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-l from-emerald-950/85 via-stone-950/45 to-transparent" />
          <div className="relative z-10 flex h-full flex-col justify-between p-12 text-white">
            <div className="h-1 w-28 rounded-full bg-amber-400" />
            <div className="max-w-xl">
              <p className="text-xs font-black uppercase tracking-[0.32em] text-emerald-200">Join Pahuna</p>
              <h2 className="mt-4 text-5xl font-black leading-tight">A cleaner account home for Karnali travel planning.</h2>
              <p className="mt-5 text-base leading-8 text-white/82">Browse publicly, then sign in when you want profile, inquiry, booking, or saved planning features.</p>
            </div>
            <Link href="/explore" className="w-fit rounded-full bg-white px-5 py-3 text-sm font-black text-emerald-900 transition hover:bg-emerald-50">
              Explore Surkhet
            </Link>
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
