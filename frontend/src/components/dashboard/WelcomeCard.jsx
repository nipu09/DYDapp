
import { Sparkles, Sun } from "lucide-react";
import { getCurrentUser } from "../../api/auth";
import { useState, useEffect } from "react";

const WelcomeCard = ({ name = "there" }) => {
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState("User");

  // FETCH CURRENT USER
  useEffect(() => {
    const fetchUserName = async () => {
      try {
        const response = await getCurrentUser();

        setUserName(response.data?.username || name);

      } catch (error) {
        console.error("Failed to fetch username:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserName();
  }, [name]);

  // CURRENT DATE
  const today = new Date();

  const date = today.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <section className="relative mb-8 flex h-[340px] flex-col justify-between overflow-hidden rounded-3xl border border-white/5 bg-panel p-7 sm:p-9">

      {/* DECORATIVE CIRCLE */}
      <div className="pointer-events-none absolute -right-12 -top-20 h-64 w-64 rounded-full bg-grape/10 blur-3xl" />

      {/* UPPER SECTION - GREETING */}
      <div className="relative z-10">

        <div className="mb-4 flex items-center gap-3 text-sm font-semibold text-lime">
          <Sun size={22} />
          <span>{date}</span>
        </div>

        <h1 className="font-display text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
          Hey, {loading ? "..." : userName}
        </h1>

        <p className="mt-2 text-sm text-white/40">
          Welcome back. Let's make today count.
        </p>

      </div>

      {/* LOWER SECTION - MOTIVATION QUOTE */}
      <div className="relative z-10 border-t border-white/10 pt-5">

        <div className="mb-3 flex items-center gap-2">
          <Sparkles size={17} className="text-grape" />

          <span className="text-[10px] font-bold uppercase tracking-widest text-grape">
            Daily Motivation
          </span>
        </div>

        <p className="max-w-xl font-display text-2xl font-bold leading-relaxed text-white sm:text-xl">
          "Small habits make a big difference. Stay consistent."
        </p>

        <div className="mt-3 h-1 w-12 rounded-full bg-lime" />

      </div>

    </section>
  );
};

export default WelcomeCard;
