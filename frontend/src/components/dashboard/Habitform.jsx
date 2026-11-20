import React, { useState } from "react";

import {
  X,
  Plus,
  Target,
  CalendarDays,
  Clock,
  Sparkles,
  Check,
  Droplets,
  BookOpen,
  Dumbbell,
  Code,
  Heart,
  Moon,
  Leaf,
} from "lucide-react";

// CATEGORIES
const categories = [
  "Health",
  "Fitness",
  "Learning",
  "Productivity",
  "Lifestyle",
  "Mindfulness",
  "Other",
];

// ICONS
const icons = [
  { name: "Droplets", component: Droplets },
  { name: "BookOpen", component: BookOpen },
  { name: "Dumbbell", component: Dumbbell },
  { name: "Code", component: Code },
  { name: "Heart", component: Heart },
  { name: "Moon", component: Moon },
  { name: "Leaf", component: Leaf },
];

// COLORS
const colors = [
  "#D8FF54",
  "#C575F8",
  "#60A5FA",
  "#FB923C",
  "#F472B6",
  "#34D399",
  "#F87171",
];

// WEEKDAYS
const weekDays = [
  { label: "Mon", value: 1 },
  { label: "Tue", value: 2 },
  { label: "Wed", value: 3 },
  { label: "Thu", value: 4 },
  { label: "Fri", value: 5 },
  { label: "Sat", value: 6 },
  { label: "Sun", value: 0 },
];

// INITIAL FORM
const initialForm = {
  title: "",
  description: "",
  icon: "Target",
  color: "#D8FF54",
  category: "Health",
  frequency: "daily",
  daysOfWeek: [],
  targetCount: 1,
  startDate: new Date().toISOString().slice(0, 10),
  endDate: "",
};

const HabitForm = ({ onClose, onHabitAdded }) => {
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");

  // UPDATE FORM FIELDS
  const updateField = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // TOGGLE WEEKDAYS
  const toggleDay = (day) => {
    setForm((prev) => ({
      ...prev,
      daysOfWeek: prev.daysOfWeek.includes(day)
        ? prev.daysOfWeek.filter((d) => d !== day)
        : [...prev.daysOfWeek, day],
    }));
  };

  // FORM SUBMISSION (FRONTEND ONLY)
  const handleSubmit = (e) => {
    e.preventDefault();

    setError("");

    if (!form.title.trim()) {
      setError("Please enter a habit name.");
      return;
    }

    if (form.frequency === "weekly" && form.daysOfWeek.length === 0) {
      setError("Please select at least one day.");
      return;
    }

    // PASS FORM DATA TO PARENT
    if (onHabitAdded) {
      onHabitAdded(form);
    }

    console.log("New Habit:", form);

    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 p-3 backdrop-blur-sm sm:p-6"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-white/10 bg-panel shadow-2xl"
      >
        {/* HEADER */}
        <div className="sticky top-0 z-20 flex items-center justify-between border-b border-white/5 bg-panel/95 p-5 backdrop-blur-xl sm:p-7">
          <div>
            <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-lime">
              <Sparkles size={15} />
              Build better habits
            </div>

            <h2 className="font-display text-2xl font-extrabold text-white">
              Create a habit<span className="text-lime">.</span>
            </h2>

            <p className="mt-1 text-xs text-white/40">
              Small actions create remarkable results.
            </p>
          </div>

          {/* CLOSE BUTTON */}
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-white/50 transition hover:bg-white/10 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-7 p-5 sm:p-7">
          {/* TITLE */}
          <div>
            <label className="mb-2 block text-sm font-bold text-white">
              Habit name <span className="text-lime">*</span>
            </label>

            <input
              type="text"
              placeholder="e.g. Drink 2L of water"
              value={form.title}
              maxLength={80}
              onChange={(e) => updateField("title", e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-ink px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-lime/50"
            />
          </div>

          {/* DESCRIPTION */}
          <div>
            <label className="mb-2 block text-sm font-bold text-white">
              Description
              <span className="ml-2 text-xs font-normal text-white/30">
                Optional
              </span>
            </label>

            <textarea
              rows={3}
              placeholder="Why do you want to build this habit?"
              value={form.description}
              onChange={(e) => updateField("description", e.target.value)}
              className="w-full resize-none rounded-xl border border-white/10 bg-ink px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-lime/50"
            />
          </div>

          {/* CATEGORY */}
          <div>
            <label className="mb-2 block text-sm font-bold text-white">
              Category
            </label>

            <select
              value={form.category}
              onChange={(e) => updateField("category", e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-ink px-4 py-3.5 text-sm text-white outline-none focus:border-lime/50"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          {/* ICON SELECTION */}
          <div>
            <label className="mb-3 block text-sm font-bold text-white">
              Choose an icon
            </label>

            <div className="flex flex-wrap gap-3">
              {/* DEFAULT TARGET ICON */}
              <button
                type="button"
                onClick={() => updateField("icon", "Target")}
                className={`flex h-12 w-12 items-center justify-center rounded-xl border transition ${
                  form.icon === "Target"
                    ? "border-lime bg-lime/10 text-lime"
                    : "border-white/10 bg-ink text-white/40 hover:border-white/30"
                }`}
              >
                <Target size={21} />
              </button>

              {icons.map(({ name, component: Icon }) => (
                <button
                  key={name}
                  type="button"
                  onClick={() => updateField("icon", name)}
                  className={`flex h-12 w-12 items-center justify-center rounded-xl border transition ${
                    form.icon === name
                      ? "border-lime bg-lime/10 text-lime"
                      : "border-white/10 bg-ink text-white/40 hover:border-white/30"
                  }`}
                >
                  <Icon size={21} />
                </button>
              ))}
            </div>
          </div>

          {/* COLOR */}
          <div>
            <label className="mb-3 block text-sm font-bold text-white">
              Choose a color
            </label>

            <div className="flex flex-wrap gap-3">
              {colors.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => updateField("color", color)}
                  className={`flex h-9 w-9 items-center justify-center rounded-full transition ${
                    form.color === color
                      ? "ring-2 ring-white ring-offset-4 ring-offset-panel"
                      : "hover:scale-110"
                  }`}
                  style={{ backgroundColor: color }}
                >
                  {form.color === color && (
                    <Check size={17} className="text-ink" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* FREQUENCY */}
          <div>
            <label className="mb-3 block text-sm font-bold text-white">
              Frequency
            </label>

            <div className="grid grid-cols-2 gap-3">
              {["daily", "weekly"].map((frequency) => (
                <button
                  key={frequency}
                  type="button"
                  onClick={() => updateField("frequency", frequency)}
                  className={`rounded-xl border p-4 text-sm font-bold capitalize transition ${
                    form.frequency === frequency
                      ? "border-lime bg-lime/10 text-lime"
                      : "border-white/10 bg-ink text-white/40 hover:border-white/20"
                  }`}
                >
                  {frequency === "daily" ? "Every day" : "Custom days"}
                </button>
              ))}
            </div>
          </div>

          {/* WEEKDAYS */}
          {form.frequency === "weekly" && (
            <div>
              <label className="mb-3 block text-sm font-bold text-white">
                Select your days
              </label>

              <div className="grid grid-cols-7 gap-2">
                {weekDays.map((day) => {
                  const active = form.daysOfWeek.includes(day.value);

                  return (
                    <button
                      key={day.value}
                      type="button"
                      onClick={() => toggleDay(day.value)}
                      className={`rounded-xl py-3 text-xs font-bold transition ${
                        active
                          ? "bg-lime text-ink"
                          : "bg-ink text-white/40 hover:bg-white/10"
                      }`}
                    >
                      {day.label}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* TARGET COUNT */}
          <div>
            <label className="mb-2 block text-sm font-bold text-white">
              Daily target count
            </label>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() =>
                  updateField(
                    "targetCount",
                    Math.max(1, Number(form.targetCount) - 1),
                  )
                }
                className="flex h-11 w-11 items-center justify-center rounded-xl bg-ink text-white hover:bg-white/10"
              >
                −
              </button>

              <div className="flex-1 rounded-xl border border-white/10 bg-ink px-4 py-3 text-center">
                <span className="font-display text-xl font-extrabold text-lime">
                  {form.targetCount}
                </span>
              </div>

              <button
                type="button"
                onClick={() =>
                  updateField(
                    "targetCount",
                    Math.min(100, Number(form.targetCount) + 1),
                  )
                }
                className="flex h-11 w-11 items-center justify-center rounded-xl bg-ink text-white hover:bg-white/10"
              >
                +
              </button>
            </div>

            <p className="mt-2 text-xs text-white/30">
              How many times do you want to complete this habit per scheduled
              day?
            </p>
          </div>

          {/* DATES */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* START DATE */}
            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-bold text-white">
                <CalendarDays size={15} className="text-lime" />
                Start date
              </label>

              <input
                type="date"
                required
                value={form.startDate}
                onChange={(e) => updateField("startDate", e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-ink px-3 py-3 text-sm text-white outline-none focus:border-lime/50"
              />
            </div>

            {/* END DATE */}
            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-bold text-white">
                <Clock size={15} className="text-grape" />
                End date
                <span className="text-xs font-normal text-white/30">
                  Optional
                </span>
              </label>

              <input
                type="date"
                min={form.startDate}
                value={form.endDate}
                onChange={(e) => updateField("endDate", e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-ink px-3 py-3 text-sm text-white outline-none focus:border-grape/50"
              />
            </div>
          </div>

          {/* ERROR */}
          {error && (
            <div className="rounded-xl border border-red-400/20 bg-red-400/10 p-3 text-sm text-red-400">
              {error}
            </div>
          )}

          {/* SUBMIT BUTTONS */}
          <div className="flex flex-col-reverse gap-3 border-t border-white/5 pt-6 sm:flex-row">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-white/10 px-6 py-3 text-sm font-bold text-white/50 transition hover:bg-white/5 hover:text-white"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-lime px-6 py-3 text-sm font-extrabold text-ink transition hover:bg-white"
            >
              <Plus size={17} />
              Create habit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default HabitForm;
