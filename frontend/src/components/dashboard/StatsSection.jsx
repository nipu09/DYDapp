import React, { useEffect, useState } from "react";
import { Target, TrendingUp, Flame, CheckCircle2 } from "lucide-react";

import StatsCard from "./StatCard";
import { getDashboard } from "../../api/dashboard"; 

const StatsSection = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);

        const response = await getDashboard();

        // Supports either an Axios response or a response body
        const data = response.data?.data ?? response.data;

        setStats(data);
      } catch (error) {
        console.error("Unable to fetch stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <p className="text-gray-500">Loading statistics...</p>;
  }

  const todayStats = stats?.todayStats;

  if (!todayStats) {
    return <p className="text-red-500">Unable to load statistics.</p>;
  }

  const {
    totalHabits = 0,
    completedToday = 0,
    pendingToday = 0,
    completionRate = 0,
  } = todayStats;

  const statistic = [
    {
      title: "Total Habits",
      value: totalHabits,
      subtitle: "Habits you're building",
      icon: Target,
      color: "lime",
    },
    {
      title: "Completion Rate",
      value: `${completionRate}%`,
      subtitle: "Your overall consistency",
      icon: TrendingUp,
      color: "grape",
      trend: "+12%",
    },
    {
      title: "Pending Today",
      value: pendingToday,
      subtitle: "Keep the chain alive!",
      icon: Flame,
      color: "dark",
    },
    {
      title: "Completed Today",
      value: `${completedToday}/${totalHabits}`,
      subtitle: "Keep up the great work!",
      icon: CheckCircle2,
      color: "lime",
    },
  ];

  return (
    <section className="w-full">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statistic.map((item) => (
          <StatsCard key={item.title} {...item} />
        ))}
      </div>
    </section>
  );
};

export default StatsSection;