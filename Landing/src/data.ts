export interface Demo {
  id: number;
  title: string;
  description: string;
  route: string;
}

export const DEMOS: Demo[] = [
  { id: 1, title: "Demo-01", description: "Customer Trading App", route: "/demo-01" },
  { id: 2, title: "Demo-02", description: "Mobile Automotive Prototype", route: "/demo-02" },
  // Add Dashboard if needed
  // { id: 3, title: "Executive Dashboard", description: "Dashboard prototype", route: "/dashboard" },
];