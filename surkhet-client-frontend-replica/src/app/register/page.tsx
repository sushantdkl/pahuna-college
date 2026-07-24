import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { RegisterForm } from "./register-form";

export const metadata: Metadata = {
  title: "Register",
  description: "Create a Pahuna traveler account",
  robots: { index: false, follow: false },
};

export default function RegisterPage() {
  return (
    <div className="flex min-h-[80vh] items-center justify-center bg-gradient-to-b from-emerald-50/70 via-white to-amber-50/60 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link href="/" className="text-sm font-semibold text-primary">
            Pahuna
          </Link>
          <h1 className="mt-3 text-2xl font-bold tracking-tight">
            Create your account
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Save your details before sending booking requests to Pahuna.
          </p>
        </div>
        <Suspense fallback={<div className="h-96" />}>
          <RegisterForm />
        </Suspense>
      </div>
    </div>
  );
}
