export type RouteStep = {
  title: string;
  description?: string;
  duration?: string;
  cost?: string;
};

export type RouteOption = {
  title: string;
  description?: string;
  steps?: RouteStep[];
  costMin?: number;
  costMax?: number;
};
