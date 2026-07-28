// @ts-nocheck
import { Plane, Bus, Car, Bike } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { transportRoutes } from "@/lib/services";
import { formatPrice } from "@/lib/utils";

const modeIcons: Record<string, React.ReactNode> = {
  Flight: <Plane className="h-4 w-4" />,
  Bus: <Bus className="h-4 w-4" />,
  Jeep: <Car className="h-4 w-4" />,
  Bike: <Bike className="h-4 w-4" />,
};

function getModeIcon(mode: string): React.ReactNode {
  for (const [key, icon] of Object.entries(modeIcons)) {
    if (mode.toLowerCase().includes(key.toLowerCase())) return icon;
  }
  return <Car className="h-4 w-4" />;
}

export function TransportTable() {
  const intercity = transportRoutes.filter((r) => r.from !== r.to);
  const local = transportRoutes.filter((r) => r.from === r.to);

  return (
    <div className="space-y-6">
      {/* Intercity */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Plane className="h-5 w-5 text-primary" /> Getting to Surkhet
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm" aria-label="Intercity transport routes to Surkhet">
              <thead>
                <tr className="border-b text-left">
                  <th className="pb-2 font-medium text-muted-foreground">Route</th>
                  <th className="pb-2 font-medium text-muted-foreground">Mode</th>
                  <th className="pb-2 font-medium text-muted-foreground">Duration</th>
                  <th className="pb-2 font-medium text-muted-foreground">Cost</th>
                  <th className="pb-2 font-medium text-muted-foreground hidden sm:table-cell">Frequency</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {intercity.map((route, i) => (
                  <tr key={i} className="hover:bg-muted/50">
                    <td className="py-3 font-medium">
                      {route.from} {"->"} {route.to}
                    </td>
                    <td className="py-3">
                      <Badge variant="outline" className="text-xs gap-1">
                        {getModeIcon(route.mode)}{" "}
                        {route.mode}
                      </Badge>
                    </td>
                    <td className="py-3 text-muted-foreground">
                      {route.durationHours}h
                    </td>
                    <td className="py-3 font-medium text-primary">
                      {formatPrice(route.costMin)} - {formatPrice(route.costMax)}
                    </td>
                    <td className="py-3 text-muted-foreground hidden sm:table-cell">
                      {route.frequency}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Local */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Car className="h-5 w-5 text-primary" /> Getting Around Surkhet
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 gap-4">
            {local.map((route, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-3 rounded-lg border"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary">
                    {getModeIcon(route.mode)}
                  </div>
                  <div>
                    <div className="font-medium text-sm">{route.mode}</div>
                    {route.notes && (
                      <div className="text-xs text-muted-foreground">
                        {route.notes}
                      </div>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium text-sm text-primary">
                    {formatPrice(route.costMin)} - {formatPrice(route.costMax)}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {route.frequency}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


