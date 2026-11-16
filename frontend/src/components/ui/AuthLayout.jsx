import Logo from "./Logo";
import { Link } from "react-router-dom";

const AuthLayout = ({ children, eyebrow, title, accent, kicker, heading, subtitle, footer, topText, topLabel, topTo }) => {
  return (
     <main className="grid min-h-screen grid-cols-2 bg-[#f5f5f1] text-ink max-[850px]:grid-cols-1">
      <div className="relative min-h-screen overflow-hidden bg-ink px-[7vw] py-[42px] text-white max-[850px]:min-h-[380px] max-[850px]:px-[8vw] max-[850px]:py-[30px] max-[560px]:min-h-[340px]">
        <Logo className="relative z-[2] max-[850px]:mt-0.5" />
        <div className="relative z-[1] mt-[clamp(100px,18vh,190px)] max-[850px]:mt-[65px] max-[560px]:mt-[55px]">
          <span className="inline-flex items-center gap-[9px] text-[10px] font-extrabold tracking-[2px] text-lime">{eyebrow}</span>
          <h1 className="mt-[25px] mb-[22px] font-display text-[clamp(57px,6.2vw,88px)] leading-[0.99] font-black tracking-[-6px] max-[850px]:text-[58px] max-[560px]:text-[51px] max-[560px]:tracking-[-4px]">
            {title}<br /><em className="font-serif font-normal text-grape">{accent}</em>
          </h1>
          <div className="absolute right-[5%] -bottom-[95px] -rotate-[10deg] font-serif text-[45px] leading-[0.85] text-lime italic max-[850px]:-bottom-[45px]">
            small<br />wins
          </div>
        </div>
        <div className="absolute -right-[220px] -bottom-[200px] size-[500px] rounded-full border border-white/[0.07]" />
        <div className="absolute -right-[150px] -bottom-[135px] size-[370px] rounded-full border border-grape/20" />
        <span className="absolute bottom-[35px] left-[7vw] text-[9px] tracking-[2px] text-[#777] max-[850px]:left-[8vw]">AADAT · MAKE IT A HABIT</span>
      </div>
      <section className="flex flex-col px-[clamp(35px,7vw,110px)] py-[35px] max-[850px]:min-h-[620px] max-[850px]:px-[8vw] max-[850px]:py-7 max-[560px]:min-h-[600px]">
        <div className="flex justify-end gap-2 text-xs text-[#888] max-[850px]:absolute max-[850px]:top-[34px] max-[850px]:right-[8vw] max-[850px]:text-[#aaa]">
          <span>{topText}</span>
          <Link to={topTo} className="font-extrabold text-ink underline decoration-grape underline-offset-4 max-[850px]:text-white">{topLabel}</Link>
        </div>
        <div className="m-auto w-[min(100%,390px)]">
          <span className="text-[9px] font-black tracking-[2px] text-[#9c57c6]">{kicker}</span>
          <h2 className="mt-2.5 mb-1.5 font-display text-[35px] tracking-[-1.5px]">{heading}</h2>
          <p className="mb-8 text-[13px] text-[#888]">{subtitle}</p>
          {children}
          <div className="mt-[25px] text-center text-[10px] text-[#888]">{footer}</div>
        </div>
      </section>
    </main>
  )
}

export default AuthLayout