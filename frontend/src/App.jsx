import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import Home from "./pages/HomePage";
import Signup from "./pages/SignupPage";
import Login from "./pages/LoginPage";
import Dashboard from "./pages/DashboardPage";
import ProtectedRoute from "./auth/ProtectedRoute";
import MyHabitPage from "./pages/MyHabitPage";
import MyProfile from "./pages/MyProfile";
import Analysis from "./pages/AiAnalysisPage";

export default function App() {
  return (
    <>
      <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          duration: 3000,
          style: {
            borderRadius: "12px",
            fontSize: "13px",
            fontWeight: "600",
          },
        }}
      />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />

        {/* Protected Routes */} 
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/habits" element={<MyHabitPage />} />
          <Route path="/profile" element={<MyProfile />} />
          <Route path="/analysis" element={<Analysis />} />
        </Route>
      </Routes>
    </>
  );
}
