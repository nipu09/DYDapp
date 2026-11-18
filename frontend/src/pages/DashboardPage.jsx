import Sidebar from "../components/ui/Sidebar";
import StatsSection from "../components/dashboard/StatsSection";
import HabitChecklist from "../components/dashboard/HabitChecklist";
import HeatmapSection from "../components/dashboard/HeatmapSection";
import WelcomeCard from "../components/dashboard/WelcomeCard";
import ProgressCircle from "../components/dashboard/ProgressCircle";
import TopStreaks from "../components/dashboard/TopStreak";

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-ink">

      {/* SIDEBAR */}
      <Sidebar />

      {/* MAIN CONTENT */}
      <main className="min-h-screen min-w-0 p-4 sm:p-6 lg:ml-[260px] lg:p-8">

        <div className="space-y-6 sm:space-y-8">

          {/* TOP SECTION */}
          <section className="grid grid-cols-1 gap-5 lg:grid-cols-12">

            {/* WELCOME CARD */}
            <div className="min-w-0 lg:col-span-4">
              <WelcomeCard />
            </div>

            {/* HEATMAP */}
            <div className="min-w-0  lg:col-span-8">
              <HeatmapSection />
            </div>

          </section>

          {/* STATS SECTION */}
          <section className="min-w-0">
            <StatsSection />
          </section>

          {/* BOTTOM SECTION */}
          <section className="grid grid-cols-1 items-start gap-5 xl:grid-cols-12">

            {/* HABIT CHECKLIST */}
            <div className="min-w-0 xl:col-span-8">
              <HabitChecklist />
            </div>

            {/* RIGHT SIDE CARDS */}
            <div className="flex min-w-0 flex-col gap-5 sm:grid sm:grid-cols-2 xl:col-span-4 xl:flex xl:flex-col">

              {/* PROGRESS */}
              <div className="min-w-0">
                <ProgressCircle
                  size={190}
                  strokeWidth={14}
                />
              </div>

              {/* TOP STREAKS */}
              <div className="min-w-0">
                <TopStreaks />
              </div>

            </div>

          </section>

        </div>
      </main>
    </div>
  );
};

export default Dashboard;