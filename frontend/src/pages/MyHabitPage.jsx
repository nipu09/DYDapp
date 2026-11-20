import React from "react";
import Sidebar from "../components/ui/Sidebar";
import HabitList from "../components/habitPage/HabitList";

const MyHabitPage = () => {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-ink">
      <Sidebar />

      <main className="relative z-10 min-h-screen w-full px-3 py-6 sm:px-5 sm:py-8 md:px-8 lg:px-10 lg:py-10">
        <div className="mx-auto w-full max-w-7xl">
          <HabitList />
        </div>
      </main>
    </div>
  );
};

export default MyHabitPage;