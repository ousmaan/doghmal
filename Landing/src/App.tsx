import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useNavigate,
} from "react-router-dom";
import "./index.css";

interface Demo {
  id: string;
  title: string;
  subtitle: string;
  path: string;
}

const DEMOS: Demo[] = [
  {
    id: "demo-01",
    title: "Demo-01",
    subtitle: "Customer Trading App",
    path: "/demo-01",
  },
  {
    id: "demo-02",
    title: "Demo-02",
    subtitle: "Mobile Automotive Prototype",
    path: "/demo-02",
  },
  {
    id: "dashboard",
    title: "Executive Dashboard",
    subtitle: "Worker productivity & branch telemetry",
    path: "/dashboard",
  },
];

function DemoFrame({ src }: { src: string }) {
  return (
    <div className="w-full h-[calc(100svh-6rem)] bg-[#0a0a0c] flex items-center justify-center rounded-2xl border border-[#1f1f23] overflow-hidden">
      <iframe
        src={src}
        className="w-full h-full border-0"
        title="demo"
      />
    </div>
  );
}

function HomePage() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-[#0a0a0c] p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-black mb-2 text-white metal-text tracking-tight">
          Doghmal Trading Co.
        </h1>
        <p className="text-[#b9bec7] mb-10 text-center">
          Select a demo to open it
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {DEMOS.map((demo) => (
            <button
              key={demo.id}
              onClick={() => navigate(demo.path)}
              className="group relative bg-[#1f1f23] text-white rounded-2xl p-8 border border-[#1f1f23] hover:border-[#eb0a1a]/50 hover:shadow-[0_0_40px_rgba(235,10,26,0.15)] transition-all cursor-pointer"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-[#eb0a1a]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <h2 className="text-xl font-bold z-10">{demo.title}</h2>
              <p className="mt-2 text-sm text-[#8a9099] z-10">{demo.subtitle}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function DemoPage({ demoPath }: { demoPath: string }) {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-[#0a0a0c] p-6">
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate(-1)}
          className="text-[#b9bec7] hover:text-white"
          aria-label="Back"
        >
          ←
        </button>
        <h2 className="text-2xl font-bold text-white">Demo</h2>
      </div>
      <DemoFrame src={demoPath} />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/demo-01" element={<DemoPage demoPath="/demos/demo-01/index.html" />} />
        <Route path="/demo-02" element={<DemoPage demoPath="/demos/demo-02/index.html" />} />
        <Route path="/dashboard" element={<DemoPage demoPath="/demos/dashboard/index.html" />} />
      </Routes>
    </BrowserRouter>
  );
}
