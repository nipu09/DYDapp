import { Smile } from "lucide-react";
import { Link } from "react-router-dom";

const Logo = ({ className = "" }) => {
  return (
     <Link
      to="/"
      className={`inline-flex items-center gap-[9px] font-display text-[22px] font-black tracking-[-1.1px] ${className}`}
    >
      <span className="grid size-[27px] place-items-center rounded-full bg-lime text-ink">
        <Smile size={17} strokeWidth={2.6} />
      </span>
      <span>Aadat</span>
    </Link>
  )
}

export default Logo