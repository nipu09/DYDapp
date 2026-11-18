import React from "react";
import { Flame, Trophy } from "lucide-react";

const TopStreaks = () => {
  const streaks = [
    {
      rank: 1,
      name: "Alex Morgan",
      days: 32,
      medal: "🥇",
    },
    {
      rank: 2,
      name: "Sarah Wilson",
      days: 28,
      medal: "🥈",
    },
    {
      rank: 3,
      name: "James Carter",
      days: 21,
      medal: "🥉",
    },
  ];

  return (
    <section className="w-full rounded-4xl border border-white/10 bg-panel p-6">

      {/* HEADER */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Trophy size={20} className="text-lime" />
            <h2 className="font-display text-xl font-extrabold text-white">
              Top 3 Streaks
            </h2>
          </div>
          <p className="mt-1 text-sm text-white/40">
            The most consistent habit builders.
          </p>
        </div>

        <span className="rounded-full bg-lime/10 px-3 py-1 text-xs font-bold text-lime">
          All Time
        </span>
      </div>

      {/* STREAK LIST */}
      <div className="space-y-4">
        {streaks.map((user) => (
          <div
            key={user.rank}
            className="flex items-center justify-between rounded-2xl border border-white/5 bg-ink p-4 transition hover:border-grape/40"
          >
            <div className="flex items-center gap-4">
              <span className="text-2xl">{user.medal}</span>

              <div>
                <h3 className="font-bold text-white">
                  {user.name}
                </h3>
                <p className="text-xs text-white/40">
                  Rank #{user.rank}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Flame size={20} className="text-grape" />
              <span className="font-display text-lg font-extrabold text-lime">
                {user.days}
              </span>
              <span className="text-xs text-white/40">days</span>
            </div>
          </div>
        ))}
      </div>

      {/* FOOTER */}
      <p className="mt-5 text-center text-xs text-white/30">
        Consistency is the key to building great habits.
      </p>

    </section>
  );
};

export default TopStreaks;