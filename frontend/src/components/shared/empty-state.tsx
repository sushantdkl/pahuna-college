// @ts-nocheck
import Link from "next/link";
import { SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@backend/lib/utils";

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  action?: {
    label: string;
    href: string;
  };
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-2xl border border-dashed border-muted-foreground/15 bg-muted/20 px-8 py-20 text-center",
        className
      )}
    >
      <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-muted/60 text-muted-foreground/30">
        {icon || <SearchX className="h-10 w-10" />}
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-sm leading-relaxed mb-8">
        {description}
      </p>
      {action && (
        <Button asChild variant="outline" size="sm">
          <Link href={action.href}>{action.label}</Link>
        </Button>
      )}
    </div>
  );
}


