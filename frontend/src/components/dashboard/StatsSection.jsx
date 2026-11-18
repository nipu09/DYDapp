import React from "react";

import { Target, TrendingUp, Flame, CheckCircle2 } from "lucide-react";

import StatsCard from "./StatCard";

const StatsSection = () => {
  const stats = [
    {
      title: "Total Habits",
      value: "08",
      subtitle: "Habits you're building",
      icon: Target,
      color: "lime",
    },
    {
      title: "Completion Rate",
      value: "87%",
      subtitle: "Your overall consistency",
      icon: TrendingUp,
      color: "grape",
      trend: "+12%",
    },
    {
      title: "Current Streak",
      value: "12 Days",
      subtitle: "Keep the chain alive!",
      icon: Flame,
      color: "dark",
    },
    {
      title: "Completed Today",
      value: "04/06",
      subtitle: "Two more to go!",
      icon: CheckCircle2,
      color: "lime",
    },
  ];

  return (
    <section className="w-full">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {" "}
        {stats.map((stat) => (
          <StatsCard key={stat.title} {...stat} />
        ))}
      </div>
    </section>
  );
};

export default StatsSection;
