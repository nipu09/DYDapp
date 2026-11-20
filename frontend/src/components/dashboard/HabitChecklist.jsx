import React, { useState, useEffect } from "react";
import { Check, Plus, Flame } from "lucide-react";
import { getAllHabits } from "../../api/habit";
import HabitForm from "./Habitform";

const HabitChecklist = () => {
  const [showHabitForm, setShowHabitForm] = useState(false);

  const [habits, setHabits] = useState([]);
  const [loadingHabits, setLoadingHabits] = useState(true);
  const [error, setError] = useState("");

  // Fetch all habits when the component mounts
  useEffect(() => {
    const fetchHabits = async () => {
      try {
        setLoadingHabits(true);
        setError("");

        const response = await getAllHabits();

        setHabits(response.data);
      } catch (error) {
        console.error("Failed to fetch habits:", error);

        setError(error.response?.data?.message || "Failed to fetch habits");
      } finally {
        setLoadingHabits(false);
      }
    };

    fetchHabits();
  }, []);

  // Toggle habit completion (frontend only for now)
  const toggleHabit = (id) => {
    setHabits((prev) =>
      prev.map((habit) =>
        habit._id === id ? { ...habit, completed: !habit.completed } : habit,
      ),
    );
  };

  // Calculate daily progress
  const completedCount = habits.filter((habit) => habit.completed).length;

  const progress = habits.length
    ? Math.round((completedCount / habits.length) * 100)
    : 0;

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

{showHabitForm && (
  <HabitForm
    onClose={() => setShowHabitForm(false)}
  />
)}
        <button
          onClick={() => setShowHabitForm(true)}
          type="button"
          className="flex items-center gap-2 rounded-xl bg-lime px-4 py-2 text-sm font-bold text-ink transition hover:bg-lime/80"
        >
          <Plus size={16} />
          Add habit
        </button>
      </div>

      {/* LOADING STATE */}
      {loadingHabits && (
        <p className="py-5 text-center text-white/50">Loading habits...</p>
      )}

      {/* ERROR STATE */}
      {!loadingHabits && error && (
        <p className="py-5 text-center text-red-400">{error}</p>
      )}

      {/* EMPTY STATE */}
      {!loadingHabits && !error && habits.length === 0 && (
        <p className="py-5 text-center text-white/50">
          No habits found. Create your first habit!
        </p>
      )}

      {/* HABIT CONTENT */}
      {!loadingHabits && !error && habits.length > 0 && (
        <>
          {/* PROGRESS */}
          <div className="mb-6">
            <div className="mb-2 flex justify-between text-sm">
              <span className="font-semibold text-white/60">
                Daily progress
              </span>

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
                key={habit._id}
                onClick={() => toggleHabit(habit._id)}
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
                    aria-label={`Mark ${habit.title} ${
                      habit.completed ? "incomplete" : "complete"
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleHabit(habit._id);
                    }}
                    className={`flex h-6 w-6 items-center justify-center rounded-lg border-2 transition-all ${
                      habit.completed
                        ? "border-lime bg-lime text-ink"
                        : "border-white/20 bg-transparent text-transparent hover:border-lime"
                    }`}
                  >
                    {habit.completed && <Check size={15} strokeWidth={3} />}
                  </button>

                  {/* HABIT DETAILS */}
                  <div>
                    <p
                      className={`font-bold transition ${
                        habit.completed
                          ? "text-white/40 line-through"
                          : "text-white"
                      }`}
                    >
                      {habit.icon} {habit.title}
                    </p>

                    <p className="mt-1 text-xs text-white/30">
                      {habit.category}
                    </p>
                  </div>
                </div>

                {/* STREAK */}
                <div className="flex items-center gap-1 text-xs font-bold text-grape">
                  <Flame size={14} />
                  {habit.streak || 0} days
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </section>
  );
};

export default HabitChecklist;
