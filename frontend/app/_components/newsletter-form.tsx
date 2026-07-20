"use client";

import { useState } from "react";
import { subscribeNewsletterAction } from "@/lib/actions/newsletter-subscriber-actions";
import { newsletterSubscriptionSchema } from "@/schemas/newsletter-subscriber.schema";

export function NewsletterForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{
    tone: "success" | "error";
    message: string;
  } | null>(null);

  return (
    <form
      className="mt-5 grid gap-3"
      onSubmit={async (event) => {
        event.preventDefault();
        setFeedback(null);

        const parsedData = newsletterSubscriptionSchema.safeParse({
          email,
          name: name.trim() || undefined,
        });

        if (!parsedData.success) {
          setFeedback({
            tone: "error",
            message:
              parsedData.error.issues[0]?.message ||
              "Check your newsletter details",
          });
          return;
        }

        setSubmitting(true);

        try {
          const response = await subscribeNewsletterAction(parsedData.data);
          setFeedback({
            tone: "success",
            message: response.message || "You are subscribed to Pahuna updates",
          });
          setName("");
          setEmail("");
        } catch (submitError) {
          setFeedback({
            tone: "error",
            message:
              submitError instanceof Error
                ? submitError.message
                : "Unable to subscribe right now",
          });
        } finally {
          setSubmitting(false);
        }
      }}
    >
      <label className="sr-only" htmlFor="newsletter-name">
        Name
      </label>
      <input
        id="newsletter-name"
        value={name}
        onChange={(event) => {
          setName(event.target.value);
          setFeedback(null);
        }}
        maxLength={120}
        autoComplete="name"
        placeholder="Your name (optional)"
        className="w-full rounded-xl border border-white/15 bg-white/10 px-4 py-2.5 text-sm text-white outline-none placeholder:text-stone-500 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-400/10"
      />
      <div className="flex flex-col gap-2 sm:flex-row">
        <label className="sr-only" htmlFor="newsletter-email">
          Email address
        </label>
        <input
          id="newsletter-email"
          type="email"
          value={email}
          onChange={(event) => {
            setEmail(event.target.value);
            setFeedback(null);
          }}
          maxLength={254}
          autoComplete="email"
          placeholder="you@example.com"
          className="min-w-0 flex-1 rounded-xl border border-white/15 bg-white/10 px-4 py-2.5 text-sm text-white outline-none placeholder:text-stone-500 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-400/10"
        />
        <button
          type="submit"
          disabled={submitting}
          className="rounded-xl bg-emerald-400 px-4 py-2.5 text-sm font-black text-emerald-950 transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? "Subscribing..." : "Subscribe"}
        </button>
      </div>
      {feedback ? (
        <p
          aria-live="polite"
          className={`rounded-xl px-3 py-2 text-xs font-semibold ${
            feedback.tone === "success"
              ? "bg-emerald-400/15 text-emerald-200"
              : "bg-red-400/15 text-red-200"
          }`}
        >
          {feedback.message}
        </p>
      ) : null}
    </form>
  );
}
