import React, { useState } from "react";
import { Plus, ArrowDownCircle, Pencil, Trash2, Flame } from "lucide-react";

import Heatmap from "../dashboard/Heamap";
import EditHabit from "./EditHabit";



const HabitList = () => {



  
  const [showEditForm, setShowEditForm] = useState(false);
  const [selectedHabit, setSelectedHabit] = useState(null);

  const year = new Date().getFullYear();

  return (
    <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-panel p-5 shadow-xl sm:p-6">
      {/* HEADER */}
      <div className="mb-7 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <div className="rounded-xl bg-lime/10 p-2 text-lime">
              <Flame size={20} />
            </div>

            <h2 className="text-xl font-bold text-white">My Habits</h2>
          </div>

          <p className="mt-2 text-sm text-white/40">
            Build consistency, one day at a time.
          </p>
        </div>

        <button className="flex items-center gap-2 rounded-xl bg-lime px-4 py-2.5 text-sm font-bold text-ink transition hover:bg-lime/80">
          <Plus size={17} />
          <span className="hidden sm:inline">Add Habit</span>
        </button>
      </div>

      {/* HABIT LIST */}
      <div className="space-y-3">
        {habits.map((habit) => (
          <div
            key={habit._id}
            className="group overflow-hidden rounded-2xl border border-white/5 bg-ink transition-all duration-300 hover:border-lime/20"
          >
            {/* HABIT ROW */}
            <div className="flex items-center justify-between gap-3 p-4">
              {/* HABIT INFO */}
              <div className="flex min-w-0 items-center gap-3">
                <div
                  className={`flex size-12 shrink-0 items-center justify-center rounded-xl text-2xl ${
                    habit.color === "blue"
                      ? "bg-blue-400/15"
                      : habit.color === "purple"
                        ? "bg-purple-400/15"
                        : habit.color === "orange"
                          ? "bg-orange-400/15"
                          : "bg-lime/15"
                  }`}
                >
                  {habit.icon}
                </div>

                <div className="min-w-0">
                  <h3 className="truncate font-bold text-white">
                    {habit.title}
                  </h3>

                  <p className="mt-1 text-xs text-white/40">{habit.category}</p>
                </div>
              </div>

              {/* ACTION BUTTONS */}
              <div className="flex shrink-0 items-center gap-2">
                <span
                  className={`hidden rounded-lg px-3 py-1.5 text-xs font-semibold capitalize sm:block ${
                    habit.color === "blue"
                      ? "bg-blue-400/10 text-blue-400"
                      : habit.color === "purple"
                        ? "bg-purple-400/10 text-purple-400"
                        : habit.color === "orange"
                          ? "bg-orange-400/10 text-orange-400"
                          : "bg-lime/10 text-lime"
                  }`}
                >
                  {habit.frequency}
                </span>

                {showEditForm && (
                  <EditHabit
                    habit={habit}
                    onClose={() => setShowEditForm(false)}
                  />
                )}

                <button
                  onClick={() => {
                    setSelectedHabit(habit);
                    setShowEditForm(true);
                  }}
                  title="Edit habit"
                  className="rounded-xl border border-white/5 bg-white/5 p-2.5 text-white/50 transition hover:border-lime/30 hover:bg-lime/10 hover:text-lime"
                >
                  <Pencil size={16} />
                </button>

                <button
                  title="Delete habit"
                  className="rounded-xl border border-white/5 bg-white/5 p-2.5 text-white/50 transition hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-400"
                >
                  <Trash2 size={16} />
                </button>

                <button
                  title="View history"
                  className="rounded-xl bg-white/5 p-2.5 text-white/50 transition hover:bg-lime hover:text-ink"
                >
                  <ArrowDownCircle size={18} />
                </button>
              </div>
            </div>

            {/* ACTIVITY HISTORY */}
            <div className="border-t border-white/5 px-4 pb-5 pt-4">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white">
                    Activity History
                  </h4>

                  <p className="mt-1 text-xs text-white/40">
                    Track your consistency throughout the year.
                  </p>
                </div>

                <span className="rounded-lg border border-white/5 bg-white/5 px-3 py-1.5 text-xs font-semibold text-lime">
                  {year}
                </span>
              </div>

              <Heatmap year={year} view="year" log={{}} onCycle={() => {}} />

              {/* LEGEND */}
              <div className="mt-4 flex flex-wrap items-center justify-end gap-4 text-[10px] text-white/40">
                <div className="flex items-center gap-1.5">
                  <span className="size-2.5 rounded-sm border border-white/10 bg-white/5" />
                  No activity
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="size-2.5 rounded-sm bg-lime" />
                  Completed
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default HabitList;
