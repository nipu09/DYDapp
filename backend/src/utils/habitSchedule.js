import { weekdayOf, isValidDate } from "./dateUtils.js";

export const isScheduled = (habit, dateString) => {
  if (!habit || !isValidDate(dateString)) {
    return false;
  }

  // Check start date
  if (
    !habit.startDate ||
    !isValidDate(habit.startDate) ||
    dateString < habit.startDate
  ) {
    return false;
  }

  // Check end date
  if (
    habit.endDate &&
    dateString > habit.endDate
  ) {
    return false;
  }

  // Check archive date (only if available)
  // Historical dates before archiving remain valid.
  if (
    habit.archivedAt &&
    dateString > habit.archivedAt
  ) {
    return false;
  }

  // Daily frequency
  if (habit.frequency === "daily") {
    return true;
  }

  // Weekly frequency
  if (habit.frequency === "weekly") {
    const weekday = weekdayOf(dateString);

    return (
      Array.isArray(habit.daysOfWeek) &&
      habit.daysOfWeek.includes(weekday)
    );
  }

  return false;
};