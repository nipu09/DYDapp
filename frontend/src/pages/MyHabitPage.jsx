import React from "react";
import Sidebar from "../components/ui/Sidebar";
import StatsSection from "../components/dashboard/StatsSection"
import HabitList from "../components/dashboard/HabitList";

const MyHabitPage = () => {
  return (
    <div className="min-h-screen bg-ink">
      {/* SIDEBAR */}
      <Sidebar />

      {/* MAIN CONTENT */}
      <main className="min-h-screen min-w-0 p-4 sm:p-6 lg:ml-[260px] lg:p-8">
    <div className="pb-3">
      <StatsSection />
    </div>


<div>
  <HabitList />
</div>

      </main>

    </div>
  );
};

export default MyHabitPage;
