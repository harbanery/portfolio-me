"use client";

import { BiSolidFilePdf } from "react-icons/bi";

const Navbar = () => {
  return (
    <nav className="flex justify-between items-start gap-4 px-20 py-4 w-full bg-slate-950/90 fixed z-10 top-0 left-0">
      <div />

      <button className="px-3 py-2 bg-[#3a52dc] text-lg font-inter font-bold text-white flex items-center gap-1 rounded-xl">
        <BiSolidFilePdf size={32} /> Download
      </button>
    </nav>
  );
};

export default Navbar;
