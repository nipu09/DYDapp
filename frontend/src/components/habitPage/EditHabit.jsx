import React, { useState } from "react";
import {
  X,
  Check,
  CalendarDays,
  Clock,
  Target,
  Droplets,
  BookOpen,
  Dumbbell,
  Code,
  Heart,
  Moon,
  Leaf,
} from "lucide-react";

import { updateHabit } from "../../api/habit";

const categories = [
  "Health",
  "Fitness",
  "Learning",
  "Productivity",
  "Lifestyle",
  "Mindfulness",
  "Other",
];

const icons = [
  { name: "Target", component: Target },
  { name: "Droplets", component: Droplets },
  { name: "BookOpen", component: BookOpen },
  { name: "Dumbbell", component: Dumbbell },
  { name: "Code", component: Code },
  { name: "Heart", component: Heart },
  { name: "Moon", component: Moon },
  { name: "Leaf", component: Leaf },
];

const colors = [
  "#D8FF54",
  "#C575F8",
  "#60A5FA",
  "#FB923C",
  "#F472B6",
  "#34D399",
  "#F87171",
];

const weekDays = [
  { label: "Mon", value: 1 },
  { label: "Tue", value: 2 },
  { label: "Wed", value: 3 },
  { label: "Thu", value: 4 },
  { label: "Fri", value: 5 },
  { label: "Sat", value: 6 },
  { label: "Sun", value: 0 },
];

const EditHabit = ({ onClose, onHabitUpdated, habit }) => {
  const [formData, setFormData] = useState({
    title: habit?.title || "",
    description: habit?.description || "",
    category: habit?.category || "Health",
    icon: habit?.icon || "Target",
    color: habit?.color || "#D8FF54",
    frequency: habit?.frequency || "daily",
    daysOfWeek: habit?.daysOfWeek || [],
    targetCount: habit?.targetCount ?? 1,
    startDate: habit?.startDate?.slice(0, 10) || "",
    endDate: habit?.endDate?.slice(0, 10) || "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
  };

  const updateField = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    setError("");
  };

  const toggleDay = (day) => {
    setFormData((prev) => ({
      ...prev,
      daysOfWeek: prev.daysOfWeek.includes(day)
        ? prev.daysOfWeek.filter((d) => d !== day)
        : [...prev.daysOfWeek, day],
    }));

    setError("");
  };

  const updateTarget = (amount) => {
    setFormData((prev) => ({
      ...prev,
      targetCount: Math.min(
        100,
        Math.max(1, Number(prev.targetCount) + amount)
      ),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!habit?._id && !habit?.id) {
      setError("Habit ID is missing.");
      return;
    }

    if (!formData.title.trim()) {
      setError("Please enter a habit name.");
      return;
    }

    if (
      formData.frequency === "weekly" &&
      formData.daysOfWeek.length === 0
    ) {
      setError("Please select at least one day.");
      return;
    }

    if (
      formData.startDate &&
      formData.endDate &&
      formData.endDate < formData.startDate
    ) {
      setError("End date cannot be before start date.");
      return;
    }

    try {
      setLoading(true);

      const habitId = habit._id || habit.id;

      const updatedHabit = await updateHabit(habitId, {
        ...formData,
        title: formData.title.trim(),
        description: formData.description.trim(),
        targetCount: Number(formData.targetCount),
        daysOfWeek:
          formData.frequency === "weekly"
            ? formData.daysOfWeek
            : [],
        startDate: formData.startDate || null,
        endDate: formData.endDate || null,
      });

      // Update parent component
      onHabitUpdated?.(updatedHabit);

      // Close modal after successful update
      onClose?.();

    } catch (err) {
      console.error("Habit update failed:", err);

      setError(
        err.response?.data?.message ||
        "Failed to update habit. Please try again."
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-3 backdrop-blur-sm sm:p-6"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl border border-white/10 bg-panel shadow-2xl"
      >
        {/* HEADER */}
        <div className="sticky top-0 z-20 flex items-center justify-between border-b border-white/5 bg-panel/95 px-6 py-5 backdrop-blur-xl">
          <div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-lime">
              Habit settings
            </p>

            <h2 className="font-display text-2xl font-bold text-white">
              Edit Habit<span className="text-lime">.</span>
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="rounded-xl bg-white/5 p-2.5 text-white/50 transition hover:bg-white/10 hover:text-white disabled:opacity-40"
          >
            <X size={19} />
          </button>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-6 p-6">

          {/* BASIC DETAILS */}
          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-white/80">
                Habit name
              </label>

              <input
                name="title"
                value={formData.title}
                onChange={handleChange}
                type="text"
                maxLength={80}
                placeholder="e.g. Read 20 pages"
                className="w-full rounded-xl border border-white/10 bg-ink px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-lime/50"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-white/80">
                Description
                <span className="ml-2 text-xs text-white/30">
                  Optional
                </span>
              </label>

              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={2}
                placeholder="Add a short description..."
                className="w-full resize-none rounded-xl border border-white/10 bg-ink px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-lime/50"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-white/80">
                Category
              </label>

              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full rounded-xl border border-white/10 bg-ink px-4 py-3 text-sm text-white outline-none focus:border-lime/50"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* ICON */}
          <div>
            <label className="mb-3 block text-sm font-medium text-white/80">
              Icon
            </label>

            <div className="flex flex-wrap gap-2">
              {icons.map(({ name, component: Icon }) => (
                <button
                  key={name}
                  type="button"
                  onClick={() => updateField("icon", name)}
                  className={`flex h-10 w-10 items-center justify-center rounded-xl border transition ${
                    formData.icon === name
                      ? "border-lime bg-lime/10 text-lime"
                      : "border-white/10 bg-ink text-white/40 hover:border-white/30 hover:text-white"
                  }`}
                >
                  <Icon size={18} />
                </button>
              ))}
            </div>
          </div>

          {/* COLOR */}
          <div>
            <label className="mb-3 block text-sm font-medium text-white/80">
              Color
            </label>

            <div className="flex items-center gap-3">
              {colors.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => updateField("color", color)}
                  style={{ backgroundColor: color }}
                  className={`flex h-7 w-7 items-center justify-center rounded-full transition ${
                    formData.color === color
                      ? "ring-2 ring-white ring-offset-4 ring-offset-panel"
                      : "hover:scale-110"
                  }`}
                >
                  {formData.color === color && (
                    <Check size={14} className="text-ink" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* FREQUENCY */}
          <div>
            <label className="mb-3 block text-sm font-medium text-white/80">
              Frequency
            </label>

            <div className="grid grid-cols-2 gap-3">
              {["daily", "weekly"].map((frequency) => (
                <button
                  key={frequency}
                  type="button"
                  onClick={() => updateField("frequency", frequency)}
                  className={`rounded-xl border px-4 py-3 text-sm font-semibold transition ${
                    formData.frequency === frequency
                      ? "border-lime/50 bg-lime/10 text-lime"
                      : "border-white/10 bg-ink text-white/50 hover:border-white/20"
                  }`}
                >
                  {frequency === "daily" ? "Every day" : "Custom days"}
                </button>
              ))}
            </div>
          </div>

          {/* WEEKDAYS */}
          {formData.frequency === "weekly" && (
            <div>
              <label className="mb-3 block text-sm font-medium text-white/80">
                Select days
              </label>

              <div className="grid grid-cols-7 gap-2">
                {weekDays.map((day) => {
                  const active = formData.daysOfWeek.includes(day.value);

                  return (
                    <button
                      key={day.value}
                      type="button"
                      onClick={() => toggleDay(day.value)}
                      className={`rounded-lg py-2.5 text-xs font-semibold transition ${
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

          {/* TARGET */}
          <div>
            <label className="mb-3 block text-sm font-medium text-white/80">
              Daily target
            </label>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => updateTarget(-1)}
                className="h-10 w-10 rounded-lg bg-ink text-lg text-white/70 transition hover:bg-white/10"
              >
                −
              </button>

              <div className="flex-1 rounded-lg border border-white/10 bg-ink py-2 text-center font-bold text-lime">
                {formData.targetCount}
              </div>

              <button
                type="button"
                onClick={() => updateTarget(1)}
                className="h-10 w-10 rounded-lg bg-ink text-lg text-white/70 transition hover:bg-white/10"
              >
                +
              </button>
            </div>
          </div>

          {/* DATES */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-medium text-white/80">
                <CalendarDays size={15} className="text-lime" />
                Start date
              </label>

              <input
                name="startDate"
                type="date"
                value={formData.startDate}
                onChange={handleChange}
                className="w-full rounded-xl border border-white/10 bg-ink px-3 py-3 text-sm text-white outline-none focus:border-lime/50"
              />
            </div>

            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-medium text-white/80">
                <Clock size={15} className="text-grape" />
                End date
                <span className="text-xs text-white/30">Optional</span>
              </label>

              <input
                name="endDate"
                type="date"
                min={formData.startDate || undefined}
                value={formData.endDate}
                onChange={handleChange}
                className="w-full rounded-xl border border-white/10 bg-ink px-3 py-3 text-sm text-white outline-none focus:border-grape/50"
              />
            </div>
          </div>

          {/* ERROR */}
          {error && (
            <p className="rounded-lg border border-red-400/20 bg-red-400/10 p-3 text-sm text-red-400">
              {error}
            </p>
          )}

          {/* ACTIONS */}
          <div className="flex gap-3 border-t border-white/5 pt-5">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="rounded-xl border border-white/10 px-5 py-3 text-sm font-semibold text-white/50 transition hover:bg-white/5 hover:text-white disabled:opacity-40"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-lime px-5 py-3 text-sm font-bold text-ink transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Check size={17} />

              {loading ? "Saving..." : "Save changes"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default EditHabit;