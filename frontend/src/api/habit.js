import API from "./axios";

// Get all (non-archived) habits
export const getAllHabits = async () => {
  const response = await API.get("/habits/");
  return response.data;
};

// Get a single habit
export const getHabitById = async (habitId) => {
  const response = await API.get(`/habits/${habitId}`);
  return response.data;
};

// Create a habit
// habitData: { title, description, icon, color, category, frequency,
//              daysOfWeek, targetCount, startDate, endDate }
export const createHabit = async (habitData) => {
  const response = await API.post("/habits/", habitData);
  return response.data;
};

// Update habit details (only the fields you pass are changed)
export const updateHabit = async (habitId, updates) => {
  const response = await API.patch(`/habits/${habitId}`, updates);
  return response.data;
};

// Archive habit (soft delete)
export const deleteHabit = async (habitId) => {
  const response = await API.patch(`/habits/${habitId}/archive`);
  return response.data;
};

// Pause (false) or activate (true) a habit
export const toggleHabitStatus = async (habitId, isActive) => {
  const response = await API.patch(`/habits/${habitId}/status`, { isActive });
  return response.data;
};
