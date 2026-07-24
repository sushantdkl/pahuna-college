// @ts-nocheck
"use client";

import { useState } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { newsletterSchema, type NewsletterInput } from "@backend/lib/validations";
import { subscribeNewsletter } from "@/actions/newsletter";

export function NewsletterForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<NewsletterInput>({
    resolver: zodResolver(newsletterSchema as never) as Resolver<NewsletterInput>,
    defaultValues: { email: "", name: "" },
  });

  async function onSubmit(data: NewsletterInput) {
    setIsSubmitting(true);
    try {
      const result = await subscribeNewsletter(data);
      if (result.success) {
        toast.success("Welcome aboard! You're now subscribed.");
        form.reset();
      } else {
        toast.error(result.error || "Something went wrong. Please try again.");
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-2 max-w-md">
      <div className="flex-1">
        <label htmlFor="newsletter-email" className="sr-only">Email address</label>
        <Input
          id="newsletter-email"
          type="email"
          placeholder="Enter your email"
          {...form.register("email")}
          aria-invalid={!!form.formState.errors.email}
          className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
        />
        {form.formState.errors.email && (
          <p className="text-xs text-red-300 mt-1">{form.formState.errors.email.message}</p>
        )}
      </div>
      <Button
        type="submit"
        disabled={isSubmitting}
        variant="secondary"
        className="shrink-0"
      >
        <Send className="h-4 w-4 mr-2" />
        {isSubmitting ? "..." : "Subscribe"}
      </Button>
    </form>
  );
}


