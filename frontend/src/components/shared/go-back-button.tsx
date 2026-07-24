// @ts-nocheck
"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export function GoBackButton() {
  const router = useRouter();

  return (
    <Button
      variant="ghost"
      size="sm"
      className="mt-4 text-muted-foreground"
      onClick={() => router.back()}
    >
      <ArrowLeft className="mr-1.5 h-3.5 w-3.5" />
      Go Back
    </Button>
  );
}


