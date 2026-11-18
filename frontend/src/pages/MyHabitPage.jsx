import React from "react";
import Sidebar from "../components/ui/Sidebar";

const MyHabitPage = () => {
  return (
    <div className="min-h-screen bg-ink">
      {/* SIDEBAR */}
      <Sidebar />

      {/* MAIN CONTENT */}
      <main className="min-h-screen min-w-0 p-4 sm:p-6 lg:ml-[260px] lg:p-8"></main>
    </div>
  );
};

export default MyHabitPage;
