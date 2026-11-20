import API from "./axios";

// Calendar heatmap for one month
// GET /analytics/heatmap?month=YYYY-MM
export const getHeatmap = async (month) => {
  const response = await API.get("/analytics/heatmap", { params: { month } });
  return response.data;
};

// Per-habit analytics
// GET /analytics/habits
export const getHabitAnalytics = async () => {
  const response = await API.get("/analytics/habits");
  return response.data;
};

// Current 7 days vs previous 7 days
// GET /analytics/weekly
export const getWeeklyAnalytics = async () => {
  const response = await API.get("/analytics/weekly");
  return response.data;
};

// Habit performance (best/worst)
// GET /analytics/performance
export const getHabitPerformance = async () => {
  const response = await API.get("/analytics/performance");
  return response.data;
};