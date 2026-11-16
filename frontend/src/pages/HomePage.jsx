import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  Check,
  Sun,
  Heart,
  Pencil,
  Sparkles,
  CircleDot,
  Flame,
} from "lucide-react";
import Navbar from "../components/ui/Navbar";
import ActivityGrid from "../components/ui/ActivityGrid";

const HomePage = () => {
  return (
    <div className="overflow-hidden">
      <Navbar />
      <main>
        <section className="mx-auto grid min-h-[660px] w-[min(1160px,calc(100%_-_64px))] grid-cols-2 items-center gap-[50px] pt-[42px] pb-[74px] max-[850px]:grid-cols-1 max-[850px]:gap-5 max-[850px]:pt-[75px] max-[560px]:w-[calc(100%_-_36px)] max-[560px]:pt-[55px]">
          <div className="max-[850px]:text-center">
            <span className="inline-flex items-center gap-[9px] text-[10px] font-extrabold tracking-[2px] text-[#aaa]">
              <span className="size-[7px] rounded-full bg-lime shadow-[0_0_14px_#d8ff5480]" />{" "}
              YOUR DAYS, WITH INTENTION
            </span>
            <h1 className="mt-[26px] mb-[22px] font-display text-[clamp(68px,8vw,108px)] leading-[0.94] font-black tracking-[-7px] max-[560px]:text-[73px] max-[560px]:tracking-[-5px]">
              Build it.
              <br />
              <em className="font-serif font-normal tracking-[-5px] text-grape">
                Keep it.
              </em>
            </h1>
            <p className="mb-4 text-[27px] leading-[1.28] tracking-[-1px] max-[560px]:text-[23px]">
              Small habits.
              <br />
              <strong className="text-lime">Big change.</strong>
            </p>
            <p className="my-3.5 max-w-[360px] text-sm leading-[1.8] text-[#aaa] max-[850px]:mx-auto">
              Tick off your day, grow your streak and watch your dots light up.
            </p>
            <div className="mt-7 flex items-center gap-7 max-[850px]:justify-center">
              <Link
                to="/signup"
                className="inline-flex items-center justify-center gap-3 rounded-full bg-lime px-[22px] py-[15px] text-[13px] font-extrabold text-[#171717] shadow-[0_4px_0_#a9ca38] transition duration-200 hover:-translate-y-0.5"
              >
                Start your journey <ArrowUpRight size={18} />
              </Link>
              <a href="#features" className="text-[13px] font-bold">
                Peek inside <span className="ml-[7px] text-grape">↓</span>
              </a>
            </div>
            <div className="mt-12 flex items-center gap-3 text-[11px] text-[#858585] max-[850px]:justify-center">
              <div className="flex pl-1">
                <i className="-ml-1 grid size-[25px] place-items-center rounded-full border-2 border-ink bg-[#f0bd94] text-[9px] font-extrabold text-[#171717] not-italic">
                  J
                </i>
                <i className="-ml-1 grid size-[25px] place-items-center rounded-full border-2 border-ink bg-grape text-[9px] font-extrabold text-[#171717] not-italic">
                  M
                </i>
                <i className="-ml-1 grid size-[25px] place-items-center rounded-full border-2 border-ink bg-lime text-[9px] font-extrabold text-[#171717] not-italic">
                  A
                </i>
              </div>
              <span>
                Join <b className="text-[#ddd]">2,400+</b> tiny-win makers
              </span>
            </div>
          </div>

          <div className="relative grid min-h-[490px] place-items-center max-[850px]:min-h-[460px] max-[560px]:min-h-[380px]">
            <div className="absolute top-[25px] -left-2.5 z-[2] grid size-[85px] -rotate-[10deg] place-content-center rounded-full bg-lime text-center text-[9px] leading-normal font-black tracking-[1px] text-ink max-[560px]:top-0 max-[560px]:-left-[5px] max-[560px]:size-[70px] max-[560px]:text-[8px]">
              ✳ GOOD THINGS
              <br />
              TAKE HABIT
            </div>
            <div className="relative z-[1] w-[min(100%,460px)] rotate-2 rounded-[25px] border border-white/[0.09] bg-panel p-[27px] shadow-[16px_18px_0_#c575f8,-8px_-8px_0_#d8ff54] max-[560px]:rounded-[18px] max-[560px]:p-[18px] max-[560px]:shadow-[10px_12px_0_#c575f8,-5px_-5px_0_#d8ff54]">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[9px] font-extrabold tracking-[1.7px] text-[#929292]">
                    THURSDAY, MAY 16
                  </span>
                  <h3 className="mt-[5px] font-display text-[22px] font-bold">
                    Your daily wins
                  </h3>
                </div>
                <span className="grid size-[39px] place-items-center rounded-full bg-lime text-ink">
                  <Sun size={20} />
                </span>
              </div>
              <div className="mt-[23px] mb-[17px] flex items-center justify-between rounded-[15px] bg-grape px-[18px] py-4 text-[#171717]">
                <div>
                  <span className="text-[9px] font-extrabold tracking-[1.7px] text-[#929292]">
                    CURRENT STREAK
                  </span>
                  <strong className="block font-display text-[34px] leading-[1.1]">
                    12 <small className="text-xs">days</small>
                  </strong>
                </div>
                <div className="grid size-[39px] place-items-center rounded-full bg-ink text-lime">
                  <Flame size={23} />
                </div>
              </div>
              <div className="grid gap-[9px]">
                <div className="flex items-center gap-3 rounded-xl bg-lime px-3.5 py-3 text-ink">
                  <span className="grid size-[22px] place-items-center rounded-full border-[1.5px] border-[#222]">
                    <Check size={15} />
                  </span>
                  <div className="flex-1">
                    <b className="block text-xs">Morning run</b>
                    <small className="mt-[3px] block text-[10px] text-[#6f6f6f]">
                      5 km · 12 day streak
                    </small>
                  </div>
                  <Sun size={18} className="text-[#222]" />
                </div>
                <div className="flex items-center gap-3 rounded-xl bg-white px-3.5 py-3 text-ink">
                  <span className="grid size-[22px] place-items-center rounded-full border-[1.5px] border-ink bg-ink text-lime">
                    <Check size={15} />
                  </span>
                  <div className="flex-1">
                    <b className="block text-xs">Read 20 pages</b>
                    <small className="mt-[3px] block text-[10px] text-[#6f6f6f]">
                      Done today
                    </small>
                  </div>
                  <Pencil size={17} className="text-[#222]" />
                </div>
                <div className="flex items-center gap-3 rounded-xl bg-white px-3.5 py-3 text-ink">
                  <span className="grid size-[22px] place-items-center rounded-full border-[1.5px] border-[#222]" />
                  <div className="flex-1">
                    <b className="block text-xs">Drink water</b>
                    <small className="mt-[3px] block text-[10px] text-[#6f6f6f]">
                      6 of 8 glasses
                    </small>
                  </div>
                  <Heart size={18} className="text-[#222]" />
                </div>
              </div>
              <div className="mt-[19px] flex justify-between text-[10px] text-[#aaa]">
                <span>
                  <i className="mr-[5px] inline-block size-[7px] rounded-full bg-lime" />{" "}
                  4 of 6 completed
                </span>
                <b className="text-lime">67%</b>
              </div>
              <div className="mt-[9px] h-[5px] overflow-hidden rounded-[5px] bg-[#444]">
                <span className="block h-full w-[67%] rounded-[5px] bg-lime" />
              </div>
            </div>
            <div className="absolute right-[-8px] bottom-[28px] z-[2] grid size-[105px] rotate-[9deg] place-content-center rounded-full bg-grape text-center text-[9px] leading-normal font-black tracking-[1px] text-ink max-[560px]:right-[-2px] max-[560px]:bottom-[5px] max-[560px]:size-[82px]">
              <span className="font-display text-[32px] leading-none max-[560px]:text-[25px]">
                12
              </span>{" "}
              DAY
              <br />
              STREAK
            </div>
            <div className="absolute top-[35px] right-[25px] text-[48px] text-lime max-[560px]:top-[5px] max-[560px]:right-0">
              ✦
            </div>
          </div>
        </section>

        {/* Yellow strip: two identical groups, track slides left by exactly one group = seamless loop */}
        <section className="-rotate-1 scale-[1.02] overflow-hidden bg-lime py-[17px] font-display text-[13px] font-black tracking-[2px] whitespace-nowrap text-ink">
          <div className="flex w-max animate-marquee motion-reduce:animate-none">
            <div className="flex shrink-0 items-center">
              <span className="px-4">STREAKS</span>
              <b className="px-2 text-[17px] text-[#a34ed3]">✦</b>
              <span className="px-4">TINY WINS</span>
              <b className="px-2 text-[17px] text-[#a34ed3]">✦</b>
              <span className="px-4">DAILY DOTS</span>
              <b className="px-2 text-[17px] text-[#a34ed3]">✦</b>
              <span className="px-4">NO EXCUSES</span>
              <b className="px-2 text-[17px] text-[#a34ed3]">✦</b>
              <span className="px-4">STREAKS</span>
              <b className="px-2 text-[17px] text-[#a34ed3]">✦</b>
              <span className="px-4">TINY WINS</span>
              <b className="px-2 text-[17px] text-[#a34ed3]">✦</b>
              <span className="px-4">DAILY DOTS</span>
              <b className="px-2 text-[17px] text-[#a34ed3]">✦</b>
              <span className="px-4">NO EXCUSES</span>
              <b className="px-2 text-[17px] text-[#a34ed3]">✦</b>
              <span className="px-4">STREAKS</span>
              <b className="px-2 text-[17px] text-[#a34ed3]">✦</b>
              <span className="px-4">TINY WINS</span>
              <b className="px-2 text-[17px] text-[#a34ed3]">✦</b>
              <span className="px-4">DAILY DOTS</span>
              <b className="px-2 text-[17px] text-[#a34ed3]">✦</b>
              <span className="px-4">NO EXCUSES</span>
              <b className="px-2 text-[17px] text-[#a34ed3]">✦</b>
              <span className="px-4">STREAKS</span>
              <b className="px-2 text-[17px] text-[#a34ed3]">✦</b>
              <span className="px-4">TINY WINS</span>
              <b className="px-2 text-[17px] text-[#a34ed3]">✦</b>
              <span className="px-4">DAILY DOTS</span>
              <b className="px-2 text-[17px] text-[#a34ed3]">✦</b>
              <span className="px-4">NO EXCUSES</span>
              <b className="px-2 text-[17px] text-[#a34ed3]">✦</b>
            </div>
            <div className="flex shrink-0 items-center" aria-hidden="true">
              <span className="px-4">STREAKS</span>
              <b className="px-2 text-[17px] text-[#a34ed3]">✦</b>
              <span className="px-4">TINY WINS</span>
              <b className="px-2 text-[17px] text-[#a34ed3]">✦</b>
              <span className="px-4">DAILY DOTS</span>
              <b className="px-2 text-[17px] text-[#a34ed3]">✦</b>
              <span className="px-4">NO EXCUSES</span>
              <b className="px-2 text-[17px] text-[#a34ed3]">✦</b>
              <span className="px-4">STREAKS</span>
              <b className="px-2 text-[17px] text-[#a34ed3]">✦</b>
              <span className="px-4">TINY WINS</span>
              <b className="px-2 text-[17px] text-[#a34ed3]">✦</b>
              <span className="px-4">DAILY DOTS</span>
              <b className="px-2 text-[17px] text-[#a34ed3]">✦</b>
              <span className="px-4">NO EXCUSES</span>
              <b className="px-2 text-[17px] text-[#a34ed3]">✦</b>
              <span className="px-4">STREAKS</span>
              <b className="px-2 text-[17px] text-[#a34ed3]">✦</b>
              <span className="px-4">TINY WINS</span>
              <b className="px-2 text-[17px] text-[#a34ed3]">✦</b>
              <span className="px-4">DAILY DOTS</span>
              <b className="px-2 text-[17px] text-[#a34ed3]">✦</b>
              <span className="px-4">NO EXCUSES</span>
              <b className="px-2 text-[17px] text-[#a34ed3]">✦</b>
              <span className="px-4">STREAKS</span>
              <b className="px-2 text-[17px] text-[#a34ed3]">✦</b>
              <span className="px-4">TINY WINS</span>
              <b className="px-2 text-[17px] text-[#a34ed3]">✦</b>
              <span className="px-4">DAILY DOTS</span>
              <b className="px-2 text-[17px] text-[#a34ed3]">✦</b>
              <span className="px-4">NO EXCUSES</span>
              <b className="px-2 text-[17px] text-[#a34ed3]">✦</b>
            </div>
          </div>
        </section>

        <section
          id="features"
          className="mx-auto w-[min(1160px,calc(100%_-_64px))] py-[120px] max-[560px]:w-[calc(100%_-_36px)] max-[560px]:py-20"
        >
          <div className="text-center">
            <span className="inline-flex items-center gap-[9px] text-[10px] font-extrabold tracking-[2px] text-[#aaa]">
              THE GOOD STUFF
            </span>
            <h2 className="my-[19px] font-display text-[58px] leading-[1.03] font-bold tracking-[-3px] max-[560px]:text-[45px]">
              Little by little,
              <br />
              <em className="font-serif font-normal tracking-[-5px] text-grape">
                a lot gets done.
              </em>
            </h2>
            <p className="my-[13px] text-[13px] text-[#999]">
              Make showing up the easiest part of your day.
            </p>
          </div>
          <div className="mt-[52px] grid grid-cols-3 gap-[17px] max-[850px]:grid-cols-1 max-[560px]:mt-[35px]">
            <article className="relative min-h-[300px] overflow-hidden rounded-[19px] bg-lime p-[27px] text-ink max-[850px]:min-h-[260px]">
              <div className="grid size-[43px] place-items-center rounded-full border border-[#18181855]">
                <Check size={22} />
              </div>
              <span className="mt-[25px] block text-[9px] font-black tracking-[1.5px] opacity-65">
                01 / CHECK IN
              </span>
              <h3 className="my-2 font-display text-[25px] font-bold tracking-[-1px]">
                Daily check-ins
              </h3>
              <p className="my-3 max-w-[245px] text-xs leading-[1.7] text-[#343434]">
                One tap and it's done. Keep your promises to yourself, one day
                at a time.
              </p>
              <div className="absolute right-[17px] bottom-1.5 opacity-[0.18]">
                <Check size={52} />
              </div>
            </article>
            <article className="relative min-h-[300px] overflow-hidden rounded-[19px] bg-grape p-[27px] text-ink max-[850px]:min-h-[260px]">
              <div className="grid size-[43px] place-items-center rounded-full border border-[#18181855]">
                <Flame size={22} />
              </div>
              <span className="mt-[25px] block text-[9px] font-black tracking-[1.5px] opacity-65">
                02 / KEEP GOING
              </span>
              <h3 className="my-2 font-display text-[25px] font-bold tracking-[-1px]">
                Streaks
              </h3>
              <p className="my-3 max-w-[245px] text-xs leading-[1.7] text-[#343434]">
                Don't break the chain. Every little win gives you a reason to
                come back.
              </p>
              <div className="absolute right-[17px] bottom-1.5 -rotate-12 font-display text-[80px] leading-[0.8] font-black opacity-[0.18]">
                12
                <span className="block font-sans text-[9px] leading-normal font-black tracking-[2px]">
                  DAY STREAK
                </span>
              </div>
            </article>
            <article className="relative min-h-[300px] overflow-hidden rounded-[19px] bg-[#f5f5f1] p-[27px] text-ink max-[850px]:min-h-[260px]">
              <div className="grid size-[43px] place-items-center rounded-full border border-[#18181855]">
                <CircleDot size={22} />
              </div>
              <span className="mt-[25px] block text-[9px] font-black tracking-[1.5px] opacity-65">
                03 / SEE IT GROW
              </span>
              <h3 className="my-2 font-display text-[25px] font-bold tracking-[-1px]">
                Activity grid
              </h3>
              <p className="my-3 max-w-[245px] text-xs leading-[1.7] text-[#343434]">
                Your month, one dot per day. Look back and see how far you've
                come.
              </p>
              <ActivityGrid
                className="mt-7 max-w-60 gap-1.5"
                dot="size-[9px]"
              />
            </article>
          </div>
        </section>

        <section
          id="how-it-works"
          className="mx-auto w-[min(1160px,calc(100%_-_64px))] pb-[100px] max-[560px]:w-[calc(100%_-_36px)] max-[560px]:pb-[55px]"
        >
          <div className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-panel px-5 py-[70px] text-center max-[560px]:px-[15px] max-[560px]:py-[55px]">
            <Sparkles size={28} className="mx-auto mb-[17px] text-lime" />
            <span className="inline-flex items-center gap-[9px] text-[10px] font-extrabold tracking-[2px] text-[#aaa]">
              YOUR NEXT CHAPTER STARTS SMALL
            </span>
            <h2 className="my-[19px] font-display text-[62px] leading-[1.03] font-bold tracking-[-3px] max-[560px]:text-[45px]">
              Ready to make it
              <br />
              <em className="font-serif font-normal tracking-[-5px] text-grape">
                a aadat?
              </em>
            </h2>
            <p className="mt-[13px] mb-[27px] text-[13px] text-[#999]">
              Start with one habit. See where it takes you.
            </p>
            <Link
              to="/signup"
              className="inline-flex items-center justify-center gap-3 rounded-full bg-lime px-[22px] py-[15px] text-[13px] font-extrabold text-[#171717] shadow-[0_4px_0_#a9ca38] transition duration-200 hover:-translate-y-0.5"
            >
              Create free account <ArrowUpRight size={18} />
            </Link>
            <span className="mt-[22px] block text-[9px] tracking-[1.7px] text-[#777]">
              FREE FOREVER · NO CREDIT CARD NEEDED
            </span>
          </div>
        </section>
      </main>

      <footer className="flex min-h-[85px] items-center justify-between border-t border-white/[0.08] px-[max(32px,calc((100%_-_1160px)/2))] py-5 text-[11px] text-[#777] max-[560px]:flex-wrap max-[560px]:gap-3 max-[560px]:px-[18px]">
        <div className="flex items-center gap-2 text-[17px] text-white">
          <span className="grid size-[23px] place-items-center rounded-full bg-lime text-ink">
            ☺
          </span>
          <b>aadat</b>
        </div>
        <span className="max-[560px]:hidden">
          Small habits, beautifully tracked.
        </span>
        <span>© 2025 aadat</span>
      </footer>
    </div>
  );
};

export default HomePage;
