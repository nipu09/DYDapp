import API from "./axios";

// Today's habits (scheduled + active) with status and streaks
// GET /habit-logs/today
export const getTodayHabits = async () => {
  const response = await API.get("/habit-logs/today");
  return response.data;
};

// Mark a habit done / not done for a date
// PUT /habit-logs/:habitId/:date   date = "YYYY-MM-DD"
// status = "done" | "not_done", note is optional
export const setHabitLog = async (habitId, date, status, note = "") => {
  const response = await API.put(`/habit-logs/${habitId}/${date}`, {
    status,
    note,
  });
  return response.data;
};

// Full-year history for one habit
// GET /habit-logs/:habitId/history?year=2026
export const getHabitHistory = async (habitId, year) => {
  const response = await API.get(`/habit-logs/${habitId}/history`, {
    params: year ? { year } : {},
  });
  return response.data;
};