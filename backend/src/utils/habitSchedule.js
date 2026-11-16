
import { weekdayOf } from "./dateUtils.js";

export const isScheduled = (habit, dateString) => {

  // 1. Check start date
  if (dateString < habit.startDate) {
    return false;
  }

  // 2. Check end date
  if (habit.endDate && dateString > habit.endDate) {
    return false;
  }

  // 3. Check archive date
  if (habit.archivedAt && dateString > habit.archivedAt) {
    return false;
  }

  // 4. Daily frequency
  if (habit.frequency === "daily") {
    return true;
  }

  // 5. Weekly frequency
  const weekday = weekdayOf(dateString);

  return habit.daysOfWeek.includes(weekday);
};
