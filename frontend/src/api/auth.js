import API from "./axios";

// Register user
export const registerUser = async (userData) => {
  const response = await API.post("/users/register", userData);
  return response.data;
};


// Login user
export const loginUser = async (credentials) => {
  const response = await API.post("/users/login", credentials);

  return response.data;
};

// Get logged-in user
export const getCurrentUser = async () => {
  const response = await API.get("/users/me");
  return response.data;
};

// Logout user
export const logoutUser = async () => {
  try {
    const response = await API.post("/users/logout");
    return response.data;
  } finally {
    localStorage.removeItem("accessToken");
  }
};