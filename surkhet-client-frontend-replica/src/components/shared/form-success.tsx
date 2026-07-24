"use client";

import Link from "next/link";
import { CheckCircle, ArrowRight, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@server/lib/utils";

interface FormSuccessProps {
  title: string;
  message: string;
  details?: string;
  actions?: Array<{
    label: string;
    href?: string;
    onClick?: () => void;
    variant?: "default" | "outline" | "ghost";
  }>;
  onReset?: () => void;
  className?: string;
}

export function FormSuccess({
  title,
  message,
  details,
  actions,
  onReset,
  className,
}: FormSuccessProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "flex flex-col items-center text-center rounded-2xl bg-linear-to-br from-success/8 to-success/4 border border-success/20 p-10",
        className
      )}
    >
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-success/10 mb-5">
        <CheckCircle className="h-8 w-8 text-success" />
      </div>

      <h3 className="text-xl font-semibold mb-2">
        {title}
      </h3>

      <p className="text-sm text-muted-foreground max-w-md mb-2 leading-relaxed">
        {message}
      </p>

      {details && (
        <p className="text-xs text-muted-foreground/70 max-w-sm mb-4">
          {details}
        </p>
      )}

      <div className="flex flex-wrap items-center justify-center gap-3 mt-4">
        {actions?.map((action) =>
          action.href ? (
            <Button key={action.label} asChild variant={action.variant || "default"} size="sm">
              <Link href={action.href}>
                {action.label} <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
              </Link>
            </Button>
          ) : (
            <Button
              key={action.label}
              variant={action.variant || "outline"}
              size="sm"
              onClick={action.onClick}
            >
              {action.label}
            </Button>
          )
        )}
        {onReset && (
          <Button variant="ghost" size="sm" onClick={onReset}>
            <RotateCcw className="h-3.5 w-3.5 mr-1.5" /> Submit Another
          </Button>
        )}
      </div>
    </div>
  );
}


