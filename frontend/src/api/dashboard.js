import API from "./axios";

// GET /dashboard
export const getDashboard = async () => {
  const response = await API.get("/dashboard/");
  return response.data;
};