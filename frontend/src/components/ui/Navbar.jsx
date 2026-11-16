import { Link } from "react-router-dom";
import Logo from "./Logo";


const Navbar = () => {
  return (
   <header className="mx-auto flex h-[88px] w-[min(1280px,calc(100%_-_64px))] items-center justify-between border-b border-white/[0.07] max-[560px]:h-[72px] max-[560px]:w-[calc(100%_-_36px)]">
      <Logo />
      <nav className="ml-[70px] flex gap-9 text-[13px] text-[#aaa] max-[560px]:hidden">
        <a href="/#how-it-works" className="hover:text-lime">How it works</a>
        <a href="/#features" className="hover:text-lime">Features</a>
      </nav>
      <div className="flex items-center gap-[27px] text-[13px] max-[560px]:gap-3.5">
        <Link to="/login" className="text-[#ddd] hover:text-lime">Log in</Link>
        <Link
          to="/signup"
          className="inline-flex items-center justify-center gap-3 rounded-full bg-grape px-[19px] py-[11px] text-[13px] font-extrabold text-[#171717] shadow-[0_4px_0_#8d43bd] transition duration-200 hover:-translate-y-0.5"
        >
          Sign up <span className="text-[17px]">↗</span>
        </Link>
      </div>
    </header>
  )
}

export default Navbar