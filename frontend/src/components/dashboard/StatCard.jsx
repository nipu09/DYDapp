import React from "react";
import { TrendingUp } from "lucide-react";

const StatsCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  color = "lime",
  trend,
}) => {
  const themes = {
    lime: {
      bg: "bg-lime",
      text: "text-ink",
      shadow: "shadow-[4px_4px_0px\_#C575F8]",
      icon: "bg-ink/10",
    },
    grape: {
      bg: "bg-grape",
      text: "text-ink",
      shadow: "shadow-[4px_4px_0px\_#D8FF54]",
      icon: "bg-ink/10",
    },
    dark: {
      bg: "bg-panel",
      text: "text-white",
      shadow: "shadow-[4px_4px_0px\_#C575F8]",
      icon: "bg-white/10",
    },
  };

  const theme = themes[color] || themes.lime;

  return (
    <div
      className={` relative overflow-hidden rounded-3xl         p-6 transition-transform duration-300         hover:-translate-y-1         ${theme.bg} ${theme.text} ${theme.shadow}       `}
    >
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <p className="text-sm font-bold opacity-70">{title}</p>

        {Icon && (
          <div className={`rounded-xl p-2.5 ${theme.icon}`}>
            <Icon size={20} strokeWidth={2} />
          </div>
        )}
      </div>

      {/* VALUE */}
      <div className="mt-6 flex items-end justify-between">
        <div>
          <h2 className="font-display text-4xl font-extrabold tracking-tight">
            {value}
          </h2>

          <p className="mt-2 text-xs font-medium opacity-60">{subtitle}</p>
        </div>

        {trend && (
          <div className="mb-1 flex items-center gap-1 text-xs font-bold">
            <TrendingUp size={14} />
            {trend}
          </div>
        )}
      </div>
    </div>
  );
};

export default StatsCard;
