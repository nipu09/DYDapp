
import React, { useState } from "react";
import { Check, Plus, Flame } from "lucide-react";

const initialHabits = [
  { id: 1, name: "Drink 2L of water", category: "Health", completed: true, streak: 5 },
  { id: 2, name: "Read for 20 minutes", category: "Learning", completed: true, streak: 8 },
  { id: 3, name: "Morning workout", category: "Fitness", completed: false, streak: 3 },
  { id: 4, name: "Practice coding", category: "Growth", completed: false, streak: 4 },
  { id: 5, name: "Sleep before 11 PM", category: "Lifestyle", completed: false, streak: 2 },
];

const HabitChecklist = () => {
  const [habits, setHabits] = useState(initialHabits);

  const toggleHabit = (id) => {
    setHabits((prev) =>
      prev.map((habit) =>
        habit.id === id
          ? { ...habit, completed: !habit.completed }
          : habit
      )
    );
  };

  const completedCount = habits.filter((habit) => habit.completed).length;
  const progress = Math.round((completedCount / habits.length) * 100);

  return (
    <section className="rounded-3xl border border-white/5 bg-panel p-6">
      {/* HEADER */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl font-extrabold text-white">
            Today's habits<span className="text-lime">.</span>
          </h2>
          <p className="mt-1 text-sm text-white/40">
            Small steps, big changes.
          </p>
        </div>

        <button className="flex items-center gap-2 rounded-xl bg-lime px-4 py-2 text-sm font-bold text-ink transition hover:bg-lime/80">
          <Plus size={16} />
          Add habit
        </button>
      </div>

      {/* PROGRESS */}
      <div className="mb-6">
        <div className="mb-2 flex justify-between text-sm">
          <span className="font-semibold text-white/60">Daily progress</span>
          <span className="font-bold text-lime">
            {completedCount}/{habits.length} completed
          </span>
        </div>

        <div className="h-2 overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-lime transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* HABIT LIST */}
      <div className="space-y-3">
        {habits.map((habit) => (
          <div
            key={habit.id}
            onClick={() => toggleHabit(habit.id)}
            className={`flex cursor-pointer items-center justify-between rounded-2xl border p-4 transition-all duration-200 ${
              habit.completed
                ? "border-lime/20 bg-lime/5"
                : "border-white/5 bg-ink hover:border-lime/30"
            }`}
          >
            <div className="flex items-center gap-4">
              {/* CUSTOM CHECKBOX */}
              <button
                type="button"
                aria-label={`Mark ${habit.name} ${habit.completed ? "incomplete" : "complete"}`}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleHabit(habit.id);
                }}
                className={`flex h-6 w-6 items-center justify-center rounded-lg border-2 transition-all ${
                  habit.completed
                    ? "border-lime bg-lime text-ink"
                    : "border-white/20 bg-transparent text-transparent hover:border-lime"
                }`}
              >
                {habit.completed && <Check size={15} strokeWidth={3} />}
              </button>

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
            </div>

            <div className="flex items-center gap-1 text-xs font-bold text-grape">
              <Flame size={14} />
              {habit.streak} days
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default HabitChecklist;
