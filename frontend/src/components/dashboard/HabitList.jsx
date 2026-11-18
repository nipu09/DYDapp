import React, { useState } from "react";
import { Plus, Flame, ArrowDownCircle, DeleteIcon, LucideDelete } from "lucide-react";
import Heatmap from "./Heamap";

const initialHabits = [
  {
    id: 1,
    name: "Drink 2L of water",
    category: "Health",
    completed: true,
    streak: 5,
  },
  {
    id: 2,
    name: "Read for 20 minutes",
    category: "Learning",
    completed: true,
    streak: 8,
  },
  {
    id: 3,
    name: "Morning workout",
    category: "Fitness",
    completed: false,
    streak: 3,
  },
  {
    id: 4,
    name: "Practice coding",
    category: "Growth",
    completed: false,
    streak: 4,
  },
  {
    id: 5,
    name: "Sleep before 11 PM",
    category: "Lifestyle",
    completed: false,
    streak: 2,
  },
];

const HabitList = () => {
  const [habits, setHabits] = useState(initialHabits);

  // Currently expanded habit
  const [expandedHabit, setExpandedHabit] = useState(null);

  // Individual heatmap data for every habit
  const [habitLogs, setHabitLogs] = useState({});

  const toggleHabit = (id) => {
    setHabits((prev) =>
      prev.map((habit) =>
        habit.id === id
          ? { ...habit, completed: !habit.completed }
          : habit
      )
    );
  };

  // Open / close individual heatmap
  const toggleHeatmap = (id) => {
    setExpandedHabit((prev) => (prev === id ? null : id));
  };

  // Cycle heatmap cells: 0 -> 1 -> 2 -> 0
  const cycleHeatmap = (habitId, date) => {
    setHabitLogs((prev) => {
      const currentLog = prev[habitId] || {};
      const currentValue = currentLog[date] || 0;

      return {
        ...prev,
        [habitId]: {
          ...currentLog,
          [date]: (currentValue + 1) % 3,
        },
      };
    });
  };

  return (
    <section className="rounded-3xl border border-white/5 bg-panel p-6">

      {/* HEADER */}
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-lg font-bold text-white">
          My Habits
        </h2>

       <div className="gap-5 flex ">
         <button className="flex items-center gap-2 rounded-xl bg-lime px-4 py-2 text-sm font-bold text-ink transition hover:bg-grape/80">
          <Plus size={16} />
          Add habit
        </button>
        <button className="flex items-center gap-2 rounded-xl bg-grape px-4 py-2 text-sm font-bold text-ink transition hover:bg-lime/80">
          Delete
        </button>

       </div>
      </div>

      {/* HABIT LIST */}
      <div className="space-y-3">

        {habits.map((habit) => {
          const isExpanded = expandedHabit === habit.id;

          return (
            <div
              key={habit.id}
              className={`overflow-hidden rounded-2xl border transition-all duration-300 ${
                habit.completed
                  ? "border-lime/20 bg-lime/5"
                  : "border-white/5 bg-ink hover:border-lime/30"
              }`}
            >

              {/* HABIT ROW */}
              <div
                className="flex cursor-pointer items-center justify-between p-4"
                onClick={() => toggleHabit(habit.id)}
              >

                {/* HABIT NAME */}
                <div>
                  <p
                    className={`font-bold transition ${
                      habit.completed
                        ? "text-white/40 line-through"
                        : "text-white"
                    }`}
                  >
                    {habit.name}
                  </p>

                  <p className="mt-1 text-xs text-white/30">
                    {habit.category}
                  </p>
                </div>

                {/* ACTIONS */}
                <div className="flex items-center gap-4">

                  {/* STREAK */}
                  <div className="flex items-center gap-1 text-xs font-bold text-grape">
                    <Flame size={14} />
                    {habit.streak} days
                  </div>

                  {/* HEATMAP BUTTON */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleHeatmap(habit.id);
                    }}
                    className={`flex items-center justify-center rounded-full bg-lime p-2 text-ink transition-all duration-300 hover:bg-grape ${
                      isExpanded ? "rotate-180" : ""
                    }`}
                    aria-label={
                      isExpanded
                        ? "Close habit heatmap"
                        : "Open habit heatmap"
                    }
                  >
                    <ArrowDownCircle size={18} />
                  </button>

                </div>
              </div>

              {/* EXPANDABLE HEATMAP */}
              <div
                className={`grid transition-all duration-500 ease-in-out ${
                  isExpanded
                    ? "grid-rows-[1fr] opacity-100"
                    : "grid-rows-[0fr] opacity-0"
                }`}
              >
                <div className="overflow-hidden">

                  <div className="border-t border-white/5 px-4 pb-5 pt-4">

                    {/* HEATMAP HEADER */}
                    <div className="mb-3 flex items-center justify-between">
                      

                      <span className="rounded-lg bg-white/5 px-3 py-1 text-xs text-white/50">
                        {new Date().getFullYear()}
                      </span>
                    </div>

                    {/* HEATMAP */}
                    <Heatmap
                      year={new Date().getFullYear()}
                      view="year"
                      log={habitLogs[habit.id] || {}}
                      onCycle={(date) =>
                        cycleHeatmap(habit.id, date)
                      }
                    />

                    {/* LEGEND */}
                    <div className="mt-3 flex flex-wrap items-center justify-end gap-3 text-[10px] text-white/40">

                      <div className="flex items-center gap-1">
                        <span className="size-2.5 rounded-sm bg-white/5 border border-white/10" />
                        No activity
                      </div>

                      <div className="flex items-center gap-1">
                        <span className="size-2.5 rounded-sm bg-grape" />
                        Partial
                      </div>

                      <div className="flex items-center gap-1">
                        <span className="size-2.5 rounded-sm bg-lime" />
                        Completed
                      </div>

                    </div>

                  </div>
                </div>
              </div>

            </div>
          );
        })}

      </div>
    </section>
  );
};

export default HabitList;