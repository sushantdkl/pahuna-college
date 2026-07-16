"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { createInquiryAction } from "@/lib/actions/inquiry-actions";
import {
  createInquirySchema,
  type InquiryKind,
} from "@/schemas/inquiry.schema";

export function HotelInquiryForm({
  hotelName,
  initialTitle,
  inquiryType,
}: {
  hotelName: string;
  initialTitle: string;
  inquiryType: InquiryKind;
}) {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [title, setTitle] = useState(initialTitle);
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{
    tone: "success" | "error";
    message: string;
  } | null>(null);

  const inquiryPath = `/contact?topic=${encodeURIComponent(initialTitle)}&hotel=${encodeURIComponent(hotelName)}&type=${inquiryType}`;
  const loginHref = `/login?redirect=${encodeURIComponent(inquiryPath)}`;

  if (authLoading) {
    return (
      <div className="rounded-[32px] border border-emerald-900/10 bg-white p-8 text-sm font-semibold text-stone-500 shadow-xl shadow-emerald-900/5">
        Checking your account...
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="rounded-[32px] border border-amber-200 bg-white p-8 shadow-xl shadow-emerald-900/5">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-amber-700">Login required</p>
        <h2 className="mt-3 text-2xl font-black">Sign in before asking about this stay.</h2>
        <p className="mt-3 text-sm leading-6 text-stone-600">Browsing remains public. Signing in connects the availability inquiry to your Pahuna account.</p>
        <Link href={loginHref} className="mt-6 inline-flex rounded-full bg-emerald-700 px-6 py-3 text-sm font-black text-white hover:bg-emerald-800">Sign in and continue</Link>
      </div>
    );
  }

  return (
    <form
      className="rounded-[32px] border border-emerald-900/10 bg-white p-6 shadow-xl shadow-emerald-900/5"
      onSubmit={async (event) => {
        event.preventDefault();
        setFeedback(null);

        const parsedData = createInquirySchema.safeParse({
          hotelName,
          title,
          message,
          inquiryType,
        });

        if (!parsedData.success) {
          setFeedback({
            tone: "error",
            message: parsedData.error.issues[0]?.message || "Check the inquiry details",
          });
          return;
        }

        setSubmitting(true);

        try {
          const response = await createInquiryAction(parsedData.data);
          setFeedback({
            tone: "success",
            message: response.message || "Inquiry submitted successfully",
          });
          setMessage("");
        } catch (submitError) {
          setFeedback({
            tone: "error",
            message: submitError instanceof Error
              ? submitError.message
              : "Unable to submit inquiry",
          });
        } finally {
          setSubmitting(false);
        }
      }}
    >
      <div className="rounded-2xl bg-emerald-50 px-4 py-3">
        <p className="text-xs font-black uppercase tracking-[0.16em] text-emerald-700">Stay inquiry</p>
        <p className="mt-1 font-bold text-emerald-950">{hotelName}</p>
      </div>
      <div className="mt-5 grid gap-4">
        <label className="grid gap-2 text-sm font-bold text-stone-700">
          Subject
          <input value={title} onChange={(event) => setTitle(event.target.value)} maxLength={160} className="rounded-2xl border border-stone-200 px-4 py-3 text-sm font-normal outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100" />
        </label>
        <label className="grid gap-2 text-sm font-bold text-stone-700">
          What would you like to know?
          <textarea value={message} onChange={(event) => setMessage(event.target.value)} maxLength={5000} className="min-h-40 rounded-2xl border border-stone-200 px-4 py-3 text-sm font-normal outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100" placeholder="Include travel dates, number of guests, room needs, or your question." />
        </label>
      </div>
      {feedback ? <p aria-live="polite" className={`mt-4 rounded-2xl px-4 py-3 text-sm font-semibold ${feedback.tone === "success" ? "bg-emerald-50 text-emerald-800" : "bg-red-50 text-red-700"}`}>{feedback.message}</p> : null}
      <div className="mt-6 flex flex-wrap gap-3">
        <button type="submit" disabled={submitting} className="rounded-full bg-emerald-700 px-6 py-3 text-sm font-black text-white shadow-lg shadow-emerald-800/15 hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60">{submitting ? "Sending inquiry..." : "Send inquiry"}</button>
        <Link href="/hotels" className="rounded-full border border-stone-200 px-6 py-3 text-sm font-bold text-stone-600 hover:bg-stone-50">Back to stays</Link>
      </div>
    </form>
  );
}
