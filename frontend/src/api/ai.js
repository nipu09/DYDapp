import API from "./axios";



// get ai analysis
export const getAiAnalysis = async () => {
  const response = await API.get("/ai/weekly-report");
  return response.data;
};