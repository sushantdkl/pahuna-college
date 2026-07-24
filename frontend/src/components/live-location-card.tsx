import { Card, CardContent } from "@/components/ui/card";

export function LiveLocationCard() {
  return (
    <Card>
      <CardContent className="p-4 text-sm text-muted-foreground">
        Live location sharing is available during active trips.
      </CardContent>
    </Card>
  );
}
