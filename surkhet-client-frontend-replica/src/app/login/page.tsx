import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to the Pahuna dashboard",
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return (
    <div className="flex min-h-[80vh] items-center justify-center bg-gradient-to-b from-emerald-50/70 via-white to-amber-50/60 px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <Link href="/" className="text-sm font-semibold text-primary">
            Pahuna
          </Link>
          <h1 className="mt-3 text-2xl font-bold tracking-tight">Welcome back</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Sign in to your dashboard
          </p>
        </div>
        <Suspense fallback={<div className="h-64" />}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}


