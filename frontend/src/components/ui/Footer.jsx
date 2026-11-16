import React from "react";

const Footer = () => {
  return (
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
  );
};

export default Footer;
