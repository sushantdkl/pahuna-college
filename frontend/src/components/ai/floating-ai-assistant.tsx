// @ts-nocheck
import Link from "next/link";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export function FloatingAIAssistant() {
  return (
    <div className="fixed bottom-20 right-6 z-[60] sm:bottom-24 sm:right-8">
      <Button
        asChild
        size="lg"
        className="gap-2 rounded-full px-5 shadow-lg shadow-emerald-900/10"
      >
        <Link href="/ai-trip-planner" aria-label="Ask Pahuna AI">
          <Sparkles className="h-4 w-4" /> Ask Pahuna AI
        </Link>
      </Button>
    </div>
  );
}


