import { useState } from "react";
import { Flame } from "lucide-react";
import Heatmap from "./Heamap";

const HeatmapSection = () => {
  const [year, setYear] = useState(new Date().getFullYear());
  const [view, setView] = useState("year");

  const [log, setLog] = useState({});

  const onCycle = (dateKey) => {
    setLog((prev) => ({
      ...prev,
      [dateKey]: ((prev[dateKey] || 0) + 1) % 3,
    }));
  };

  const completedDays = Object.values(log).filter(
    (value) => value === 2
  ).length;

  return (
    <section className="rounded-3xl border border-white/5 bg-panel p-6">

      {/* HEADER */}
      <div className="mb-7 flex flex-wrap items-center justify-between gap-4">
       

        {/* VIEW TOGGLE */}
        <div className="flex rounded-xl bg-ink p-1">
          {["year", "months"].map((item) => (
            <button
              key={item}
              onClick={() => setView(item)}
              className={`rounded-lg px-4 py-2 text-xs font-bold capitalize transition ${
                view === item
                  ? "bg-lime text-ink"
                  : "text-white/40 hover:text-white"
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      {/* YEAR AND COUNT */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setYear((y) => y - 1)}
            className="text-white/40 hover:text-lime"
          >
            ←
          </button>

          <span className="font-display text-lg font-bold text-white">
            {year}
          </span>

          <button
            disabled={year >= new Date().getFullYear()}
            onClick={() => setYear((y) => y + 1)}
            className="text-white/40 hover:text-lime disabled:opacity-20"
          >
            →
          </button>
        </div>
          
        <p className="text-xs font-semibold text-white/40">
          <span className="text-lime">{completedDays}</span> perfect days
        </p>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-semibold text-white/40">
            Less
          </span>

          <div className="size-3 rounded-[3px] border border-white/10 bg-white/5" />
          <div className="size-3 rounded-[3px] bg-grape" />
          <div className="size-3 rounded-[3px] bg-lime" />

          <span className="text-[10px] font-semibold text-white/40">
            More
          </span>
        </div>
      </div>

      {/* HEATMAP */}
      <Heatmap
        year={year}
        view={view}
        log={log}
        onCycle={onCycle}
      
      />

     

    </section>
  );
};

export default HeatmapSection;