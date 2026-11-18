import React, { useEffect, useState } from "react";
import Sidebar from "../components/ui/Sidebar";
import {
  Brain,
  Sparkles,
  TrendingUp,
  AlertCircle,
  Lightbulb,
  RefreshCw,
  CheckCircle2,
  Target,
  CalendarDays,
} from "lucide-react";

const AiAnalysisPage = () => {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchReport = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${import.meta.env.VITE_API_URL || ""}/api/v1/ai/weekly-report`,
        {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Unable to generate your report.");
      }

      setReport(result.data);
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, []);

  return (
    <div className="min-h-screen bg-ink text-white">
      <Sidebar />

      <main className="min-w-0 px-4 pb-8 pt-24 sm:px-6 lg:ml-[260px] lg:p-8">
        <div className="mx-auto max-w-7xl space-y-7">

          {/* HEADER */}
          <section className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
            <div>
              <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-grape">
                <Brain size={18} />
                <span>YOUR PERSONAL HABIT COACH</span>
              </div>

              <h1 className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
                Habit <span className="text-lime">Analysis.</span>
              </h1>

              <p className="mt-2 text-sm text-white/40">
                Understand your progress and discover ways to improve.
              </p>
            </div>

            <button
              onClick={fetchReport}
              disabled={loading}
              className="flex items-center justify-center gap-2 self-start rounded-xl bg-lime px-5 py-3 text-sm font-bold text-ink transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-50 sm:self-auto"
            >
              <RefreshCw
                size={16}
                className={loading ? "animate-spin" : ""}
              />
              Refresh Analysis
            </button>
          </section>

          {/* LOADING */}
          {loading && (
            <div className="flex min-h-[350px] flex-col items-center justify-center rounded-3xl border border-white/5 bg-panel">
              <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-grape/10">
                <Brain size={30} className="animate-pulse text-grape" />
              </div>

              <h2 className="font-display text-xl font-bold">
                Analyzing your habits...
              </h2>

              <p className="mt-2 text-sm text-white/40">
                Aadat AI is reviewing your weekly performance.
              </p>

              <div className="mt-6 h-1.5 w-48 overflow-hidden rounded-full bg-white/10">
                <div className="h-full w-1/2 animate-pulse rounded-full bg-lime" />
              </div>
            </div>
          )}

          {/* ERROR */}
          {!loading && error && (
            <div className="rounded-3xl border border-red-400/20 bg-red-400/5 p-8 text-center">
              <AlertCircle
                size={35}
                className="mx-auto mb-4 text-red-400"
              />

              <h2 className="text-xl font-bold">
                Couldn't load your analysis
              </h2>

              <p className="mt-2 text-sm text-white/40">{error}</p>

              <button
                onClick={fetchReport}
                className="mt-5 rounded-xl bg-lime px-5 py-3 text-sm font-bold text-ink"
              >
                Try Again
              </button>
            </div>
          )}

          {/* REPORT */}
          {!loading && !error && report && (
            <>
              {/* AI WEEKLY REPORT */}
              <section className="relative overflow-hidden rounded-3xl border border-white/5 bg-panel p-6 sm:p-9">
                <div className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-grape/10 blur-3xl" />

                <div className="relative z-10">
                  <div className="mb-6 flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-grape/15 text-grape">
                      <Sparkles size={24} />
                    </div>

                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-grape">
                        Aadat AI Report
                      </p>
                      <h2 className="font-display text-xl font-bold">
                        Your Weekly Overview
                      </h2>
                    </div>
                  </div>

                  <p className="max-w-4xl text-base leading-8 text-white/75 sm:text-lg">
                    {report.report}
                  </p>

                  <div className="mt-7 flex items-center gap-2 border-t border-white/10 pt-5 text-xs font-semibold text-white/40">
                    <CalendarDays size={15} />
                    Your last 7 days of habit activity
                  </div>
                </div>
              </section>

              {/* INSIGHTS */}
              <section className="grid grid-cols-1 gap-5 lg:grid-cols-2">

                {/* STRENGTHS */}
                <InsightCard
                  title="Your Strengths"
                  subtitle="What you're doing well"
                  icon={TrendingUp}
                  color="lime"
                  items={report.strengths}
                  emptyText="Keep tracking your habits to discover your strengths."
                />

                {/* IMPROVEMENTS */}
                <InsightCard
                  title="Areas to Improve"
                  subtitle="Where you can grow"
                  icon={Target}
                  color="grape"
                  items={report.improvements}
                  emptyText="No major improvement areas identified."
                />
              </section>

              {/* SUGGESTIONS */}
              <section className="rounded-3xl border border-white/5 bg-panel p-6 sm:p-8">
                <div className="mb-7 flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-lime/10 text-lime">
                    <Lightbulb size={23} />
                  </div>

                  <div>
                    <h2 className="font-display text-xl font-bold">
                      Your Action Plan
                    </h2>
                    <p className="mt-1 text-xs text-white/40">
                      Practical steps recommended by Aadat AI
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  {report.suggestions?.length > 0 ? (
                    report.suggestions.map((suggestion, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-4 rounded-2xl border border-white/5 bg-ink p-4 transition hover:border-lime/20"
                      >
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-lime/10 text-sm font-extrabold text-lime">
                          {String(index + 1).padStart(2, "0")}
                        </div>

                        <p className="pt-1 text-sm leading-6 text-white/70">
                          {suggestion}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-white/40">
                      Your action plan will appear here when available.
                    </p>
                  )}
                </div>
              </section>

              {/* FOOTER */}
              <div className="flex items-center justify-center gap-2 py-4 text-xs text-white/30">
                <CheckCircle2 size={15} className="text-lime" />
                Generated by Aadat AI · Keep showing up!
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

const InsightCard = ({
  title,
  subtitle,
  icon: Icon,
  color,
  items = [],
  emptyText,
}) => {
  const isLime = color === "lime";

  return (
    <div className="rounded-3xl border border-white/5 bg-panel p-6 sm:p-7">
      <div className="mb-6 flex items-center gap-3">
        <div
          className={`flex h-11 w-11 items-center justify-center rounded-xl ${
            isLime
              ? "bg-lime/10 text-lime"
              : "bg-grape/10 text-grape"
          }`}
        >
          <Icon size={23} />
        </div>

        <div>
          <h2 className="font-display text-lg font-bold">{title}</h2>
          <p className="mt-1 text-xs text-white/40">{subtitle}</p>
        </div>
      </div>

      <div className="space-y-4">
        {items.length > 0 ? (
          items.map((item, index) => (
            <div key={index} className="flex items-start gap-3">
              <CheckCircle2
                size={17}
                className={`mt-0.5 shrink-0 ${
                  isLime ? "text-lime" : "text-grape"
                }`}
              />

              <p className="text-sm leading-6 text-white/65">{item}</p>
            </div>
          ))
        ) : (
          <p className="text-sm leading-6 text-white/40">{emptyText}</p>
        )}
      </div>
    </div>
  );
};

export default AiAnalysisPage;