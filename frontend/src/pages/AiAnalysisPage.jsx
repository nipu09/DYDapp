import React, { useEffect, useRef, useState } from "react";
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
  ArrowUpRight,
  Zap,
  Heart,
} from "lucide-react";

import { getAiAnalysis } from "../api/ai";

// Local storage key
const CACHE_KEY = "weekly_ai_analysis";

// Safely get cached report
const getCachedReport = () => {
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    return cached ? JSON.parse(cached) : null;
  } catch (error) {
    console.error("Error reading cached AI report:", error);
    return null;
  }
};

const AiAnalysisPage = () => {
  // Load saved report immediately
  const [report, setReport] = useState(() => getCachedReport());

  const [loading, setLoading] = useState(() => !getCachedReport());

  const [error, setError] = useState("");

  // Prevent duplicate initial API calls
  const initialFetchStarted = useRef(false);

  // Fetch AI analysis
  const fetchReport = async (forceRefresh = false) => {
    // Don't call API if report is already cached
    if (!forceRefresh && report) {
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await getAiAnalysis();

      if (!response.success) {
        throw new Error(response.message || "Unable to generate report.");
      }

      // Update React state
      setReport(response.data);

      // Save report in localStorage
      localStorage.setItem(CACHE_KEY, JSON.stringify(response.data));
    } catch (err) {
      console.error("AI Analysis Error:", err);

      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch only when there is no cached report
  useEffect(() => {
    if (!report && !initialFetchStarted.current) {
      initialFetchStarted.current = true;
      fetchReport();
    }
  }, []);

  return (
    <div className="min-h-screen bg-ink text-white">
      <Sidebar />

      <main className="min-w-0 px-4 pb-10 pt-24 sm:px-6 lg:ml-[260px] lg:p-8">
        <div className="mx-auto max-w-7xl space-y-8">
          {/* HEADER */}
          <section className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
            <div>
              <div className="mb-3 flex items-center gap-2 text-sm font-bold text-grape">
                <Brain size={18} />

                <span className="tracking-widest">
                  YOUR PERSONAL HABIT COACH
                </span>
              </div>

              <h1 className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
                Habit <span className="text-lime">Analysis.</span>
              </h1>

              <p className="mt-2 text-sm text-white/40">
                Understand your progress and discover ways to improve.
              </p>
            </div>

            <button
              onClick={() => fetchReport(true)}
              disabled={loading}
              className="flex items-center justify-center gap-2 self-start rounded-xl bg-lime px-5 py-3 text-sm font-bold text-ink transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-50 sm:self-auto"
            >
              <RefreshCw size={16} className={loading ? "animate-spin" : ""} />

              {loading ? "Generating..." : "Refresh Analysis"}
            </button>
          </section>

          {/* LOADING */}
          {loading && !report && (
            <div className="flex min-h-[400px] flex-col items-center justify-center rounded-3xl border border-white/5 bg-panel">
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
          {!loading && error && !report && (
            <div className="rounded-3xl border border-red-400/20 bg-red-400/5 p-8 text-center">
              <AlertCircle size={35} className="mx-auto mb-4 text-red-400" />

              <h2 className="text-xl font-bold">Couldn't load your analysis</h2>

              <p className="mt-2 text-sm text-white/40">{error}</p>

              <button
                onClick={() => fetchReport(true)}
                className="mt-5 rounded-xl bg-lime px-5 py-3 text-sm font-bold text-ink"
              >
                Try Again
              </button>
            </div>
          )}

          {/* REPORT */}
          {report && (
            <>
              {/* REFRESH ERROR */}
              {error && (
                <div className="rounded-xl border border-red-400/20 bg-red-400/5 p-4 text-sm text-red-300">
                  Couldn't refresh your report: {error}. Your previous report is
                  still available.
                </div>
              )}

              {/* REFRESHING NOTICE */}
              {loading && (
                <div className="flex items-center gap-2 text-xs text-lime">
                  <RefreshCw size={14} className="animate-spin" />
                  Updating your AI analysis...
                </div>
              )}

              {/* AI WEEKLY REPORT */}
              <section className="relative overflow-hidden rounded-3xl border border-grape/20 bg-gradient-to-br from-grape/15 via-panel to-panel p-6 sm:p-9">
                <div className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-grape/15 blur-3xl" />

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
              <section>
                <div className="mb-5">
                  <p className="text-xs font-bold uppercase tracking-widest text-lime">
                    Performance Insights
                  </p>

                  <h2 className="mt-2 font-display text-2xl font-bold">
                    Your Growth Report
                  </h2>

                  <p className="mt-1 text-sm text-white/40">
                    Discover what's working and where you can improve.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
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
                </div>
              </section>

              {/* ACTION PLAN */}
              <section className="relative overflow-hidden rounded-3xl border border-lime/10 bg-panel p-6 sm:p-8">
                <div className="pointer-events-none absolute -right-20 -bottom-20 h-60 w-60 rounded-full bg-lime/5 blur-3xl" />

                <div className="relative z-10">
                  <div className="mb-7 flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-lime/10 text-lime">
                      <Lightbulb size={24} />
                    </div>

                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-lime">
                        Your Next Steps
                      </p>

                      <h2 className="font-display text-xl font-bold">
                        Your Action Plan
                      </h2>

                      <p className="mt-1 text-xs text-white/40">
                        Practical steps recommended by Aadat AI.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {report.suggestions?.length > 0 ? (
                      report.suggestions.map((suggestion, index) => (
                        <div
                          key={index}
                          className="group flex items-start gap-4 rounded-2xl border border-white/5 bg-ink p-4 transition hover:border-lime/30 hover:bg-lime/[0.03]"
                        >
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-lime/10 text-sm font-extrabold text-lime transition group-hover:bg-lime group-hover:text-ink">
                            {String(index + 1).padStart(2, "0")}
                          </div>

                          <div className="flex-1">
                            <p className="text-sm leading-7 text-white/70">
                              {suggestion}
                            </p>
                          </div>

                          <ArrowUpRight
                            size={17}
                            className="shrink-0 text-white/20 transition group-hover:text-lime"
                          />
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-white/40">
                        Your action plan will appear here when available.
                      </p>
                    )}
                  </div>
                </div>
              </section>

              {/* MOTIVATION CARD */}
              <section className="flex flex-col items-start justify-between gap-5 rounded-3xl border border-white/5 bg-gradient-to-r from-lime/10 to-grape/10 p-6 sm:flex-row sm:items-center sm:p-8">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-lime/10 text-lime">
                    <Heart size={24} />
                  </div>

                  <div>
                    <h3 className="font-display text-lg font-bold">
                      Small steps create big changes.
                    </h3>

                    <p className="mt-1 text-sm text-white/40">
                      Keep showing up. Your future self will thank you.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 rounded-xl bg-lime/10 px-4 py-3 text-sm font-bold text-lime">
                  <Zap size={17} />
                  Stay Consistent
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
    <div className="group rounded-3xl border border-white/5 bg-panel p-6 transition duration-300 hover:-translate-y-1 hover\:border-white/10 sm\:p-7">
      <div className="mb-6 flex items-center gap-3">
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-2xl ${isLime ? "bg-lime/10 text-lime" : "bg-grape/10 text-grape"}`}
        >
          <Icon size={23} />
        </div>

        <div>
          <h2 className="font-display text-lg font-bold">{title}</h2>

          <p className="mt-1 text-xs text-white/40">{subtitle}</p>
        </div>
      </div>

      <div className="space-y-4">
        {items?.length > 0 ? (
          items.map((item, index) => (
            <div key={index} className="flex items-start gap-3">
              <CheckCircle2
                size={18}
                className={`mt-0.5 shrink-0 ${
                  isLime ? "text-lime" : "text-grape"
                }`}
              />

              <p className="text-sm leading-7 text-white/65">{item}</p>
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
