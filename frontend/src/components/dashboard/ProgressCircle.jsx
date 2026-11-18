import React from "react";
import { Target, Sparkles, TrendingUp } from "lucide-react";

const ProgressCircle = ({
  progress = 87,
  size = 220,
  strokeWidth = 16,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset =
    circumference - (progress / 100) * circumference;

  return (
    <div className="flex w-full flex-col items-center rounded-4xl border border-white/10 bg-panel p-7">

      {/* HEADER */}
      <div className="mb-7 flex w-full items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Target size={20} className="text-grape" />
            <h2 className="font-display text-lg font-extrabold text-white">
              Your Progress
            </h2>
          </div>

          <p className="mt-1 text-xs text-white/40">
            Your consistency at a glance
          </p>
        </div>

        <span className="rounded-full bg-grape/10 px-3 py-1 text-xs font-bold text-grape">
          Weekly
        </span>
      </div>

      {/* PROGRESS CIRCLE */}
      <div className="relative flex items-center justify-center">
        <svg width={size} height={size} className="-rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="rgba(255,255,255,0.07)"
            strokeWidth={strokeWidth}
            fill="none"
          />

          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#C575F8"
            strokeWidth={strokeWidth}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        <div className="absolute flex flex-col items-center">
          <span className="font-display text-5xl font-extrabold text-lime">
            {progress}%
          </span>
          <span className="mt-1 text-xs font-medium uppercase tracking-widest text-white/40">
            Completed
          </span>
        </div>
      </div>

      {/* FOOTER */}
      <div className="mt-7 w-full rounded-2xl bg-ink p-4">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-lime/10 p-2">
            <TrendingUp size={20} className="text-lime" />
          </div>

          <div>
            <p className="text-sm font-bold text-white">
              You're doing amazing!
            </p>
            <p className="mt-1 text-xs text-white/40">
              Keep showing up. Small steps create big changes.
            </p>
          </div>
        </div>
      </div>

      {/* MOTIVATION */}
      <div className="mt-5 flex items-center gap-2 text-xs text-grape">
        <Sparkles size={15} />
        <span>Consistency over perfection.</span>
      </div>

    </div>
  );
};

export default ProgressCircle;