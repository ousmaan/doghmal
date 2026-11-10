import React from "react";
import { DEMOS } from "./data";
import DemoCard from "./components/DemoCard";
import "./index.css";

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#0a0a0c] text-[#101013] p-6">
      <h1 className="text-3xl font-bold mb-8 text-center">Select a Demo</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {DEMOS.map((demo) => (
          <DemoCard key={demo.id} title={demo.title} description={demo.description} route={demo.route} />
        ))}
      </div>
    </div>
  );
};

export default App;